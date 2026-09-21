import { getConfig, getMetadata, loadScript, loadStyle } from '../../utils/utils.js';
import { loadAcomAssistant, sendAcomAssistantUserMessage, openAcomAssistantChat } from '../../features/acom-assistant.js';
import acomAssistantAnalyticsAdapter from './acom-assistant-analytics.js';

const chatLabelText = 'Ask';
let initialized = false;

function extractCardPrompts(cards) {
  if (!cards) return undefined;
  const prompts = [...cards.querySelectorAll(':scope > div')]
    .map((row) => ({ label: row.textContent.trim() }))
    .filter((prompt) => prompt.label);
  return prompts.length ? prompts : undefined;
}

/** Kicks off the (idempotent) client load/init without sending a message -- used by
 *  the GNav mount, which needs the client initialized as soon as it renders, before
 *  any user input exists. */
export async function ensureAcomAssistant(cards) {
  if (initialized) return;
  initialized = true;
  // appid/appver are provisioned per-surface by the Assistant team (onboarding form) --
  // read from metadata so a real value can be authored once provisioning is complete.
  await loadAcomAssistant({
    appid: getMetadata('acom-assistant-id') || getMetadata('jarvis-surface-id') || getConfig().jarvis?.id || 'adobedotcom2',
    appver: getMetadata('acom-assistant-version') || getMetadata('jarvis-surface-version') || getConfig().jarvis?.version || getConfig().acomAssistant?.version || '1.0',
    componentid: 'brand-concierge',
    context: { prompts: extractCardPrompts(cards) },
    callbacks: { analyticsCallback: acomAssistantAnalyticsAdapter },
  }, { loadScript, loadStyle });
}

/** Replaces bc-bootstrap.js's bcBootstrap/openModal/openSideModal for the acom-assistant
 *  flag-on path -- the client owns its own iframe/window chrome, so no Milo modal or
 *  mount element is created here. */
export async function acomAssistantRouteInput(text, cards) {
  await ensureAcomAssistant(cards);
  await openAcomAssistantChat({ sourceType: 'button', sourceText: chatLabelText });
  if (text) {
    await sendAcomAssistantUserMessage({ label: text });
  }
}
