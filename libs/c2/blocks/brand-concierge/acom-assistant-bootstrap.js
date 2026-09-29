import { getMetadata, loadScript, loadStyle } from '../../../utils/utils.js';
import { loadAcomAssistant, sendAcomAssistantUserMessage, openAcomAssistantChat, setAcomAssistantIdentity } from '../../../features/acom-assistant.js';
import acomAssistantAnalyticsAdapter from './acom-assistant-analytics.js';

// bc-bacom is the Assistant team's test appid for the BC experience while Brand Concierge's
// own surface is still being provisioned (onboarding form, see acom-assistant.js reference).
const BC_APP_ID_FALLBACK = 'bc-bacom';
const chatLabelText = 'Ask';
let initialized = false;

function extractCardPrompts(cards) {
  if (!cards) return undefined;
  const prompts = [...cards.querySelectorAll(':scope > div')]
    .map((row) => ({ label: row.textContent.trim() }))
    .filter((prompt) => prompt.label);
  return prompts.length ? prompts : undefined;
}

async function ensureAcomAssistant(cards) {
  // appid/appver are provisioned per-surface by the Assistant team (onboarding form) --
  // read from metadata so a real value can be authored once provisioning is complete.
  const appid = getMetadata('acom-assistant-id') || BC_APP_ID_FALLBACK;
  const appver = getMetadata('acom-assistant-version') || '1.0';

  // Re-affirm Brand Concierge's identity on every call (not just the first) -- another
  // surface (e.g. the Jarvis GNav link) sharing this client may have set its own identity
  // for a click in between, and Brand Concierge's own clicks need to report theirs back.
  setAcomAssistantIdentity({ appid, appver });

  if (initialized) return;
  initialized = true;
  await loadAcomAssistant({
    appid,
    appver,
    componentid: 'brand-concierge',
    context: { prompts: extractCardPrompts(cards) },
    callbacks: { analyticsCallback: acomAssistantAnalyticsAdapter },
  }, { loadScript, loadStyle });
}

/** Replaces bc-bootstrap.js's bcBootstrap/openModal/openSideModal for the acom-assistant
 *  flag-on path -- the client owns its own iframe/window chrome, so no Milo modal or
 *  mount element is created here. */
export default async function acomAssistantRouteInput(text, cards) {
  await ensureAcomAssistant(cards);
  await openAcomAssistantChat({ sourceType: 'button', sourceText: chatLabelText });
  if (text) {
    await sendAcomAssistantUserMessage({ label: text });
  }
}
