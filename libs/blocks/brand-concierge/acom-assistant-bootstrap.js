import { getConfig, getMetadata, loadScript, loadStyle } from '../../utils/utils.js';
import { initAcomAssistantOnce, sendAcomAssistantUserMessage, openAcomAssistantChat } from '../../features/acom-assistant.js';
import acomAssistantAnalyticsAdapter from './acom-assistant-analytics.js';

const chatLabelText = 'Ask';

function extractCardPrompts(cards) {
  if (!cards) return undefined;
  const prompts = [...cards.querySelectorAll(':scope > div')]
    .map((row) => row.textContent.trim())
    .filter(Boolean)
    .map((label) => ({
      label,
      action: { click_analytics: `BC-suggested_prompt_clicked|gnav|${label}` },
    }));
  return prompts.length ? prompts : undefined;
}

/** Kicks off the (idempotent) client load/init without sending a message -- used by
 *  the GNav mount, which needs the client initialized as soon as it renders, before
 *  any user input exists. */
export async function ensureAcomAssistant(cards) {
  const appid = getConfig().jarvis?.id;
  const appver = getConfig().jarvis?.version;

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
export async function acomAssistantRouteInput(text, cards) {
  await ensureAcomAssistant(cards);
  await openAcomAssistantChat({ sourceType: 'button', sourceText: chatLabelText });
  if (text) {
    await sendAcomAssistantUserMessage({ label: text });
  }
}
