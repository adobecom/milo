import { getMetadata, loadScript, loadStyle } from '../../../utils/utils.js';
import { initAcomAssistantOnce, sendAcomAssistantUserMessage, openAcomAssistantChat } from '../../../features/acom-assistant.js';
import acomAssistantAnalyticsAdapter from './acom-assistant-analytics.js';

// bc-adobedotcom2 is the Assistant team's test appid for the BC experience while Brand Concierge's
// own surface is still being provisioned (onboarding form, see acom-assistant.js reference).
// TODO: Remove this when we have the correct app id from Jarvis team.
const BC_APP_ID_FALLBACK = 'bc-adobedotcom2';
const chatLabelText = 'Ask';

function extractCardPrompts(cards) {
  if (!cards) return undefined;
  const prompts = [...cards.querySelectorAll(':scope > div')]
    .map((row) => ({ label: row.textContent.trim() }))
    .filter((prompt) => prompt.label);
  return prompts.length ? prompts : undefined;
}

export async function ensureAcomAssistant(cards) {
  // appid/appver are provisioned per-surface by the Assistant team (onboarding form) --
  // read from metadata so a real value can be authored once provisioning is complete.
  const appid = getMetadata('acom-assistant-id') || BC_APP_ID_FALLBACK;
  const appver = getMetadata('acom-assistant-version') || '1.0';

  return initAcomAssistantOnce({
    appid,
    appver,
    componentid: 'brand-concierge',
    pageTitle: getMetadata('og:title') || undefined,
    pageDescription: getMetadata('og:description') || undefined,
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
