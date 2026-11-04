import { isAcomAssistantEnabled } from '../utils/utils.js';

let linksInitialized = false;

export default async function initChatLinks(config, loadScript, loadStyle, getMetadata) {
  if (!isAcomAssistantEnabled()) {
    const { initJarvisChat } = await import('./jarvis-chat.js');
    await initJarvisChat(config, loadScript, loadStyle, getMetadata);
    return;
  }

  if (linksInitialized) return;
  linksInitialized = true;
  const bootstrapPath = getMetadata('foundation') === 'c2'
    || getMetadata('gnav-foundation') === 'c2'
    ? '../c2/blocks/brand-concierge/acom-assistant-bootstrap.js'
    : '../blocks/brand-concierge/acom-assistant-bootstrap.js';

  // Register links only. BC owns client initialization, including on link clicks.
  // With the flag on, every #open-jarvis-chat link on the page (header, body, footer)
  // opens the BC chat. Footer links can carry their own app ID (see below).
  document.addEventListener('click', async (event) => {
    const link = event.target.closest('[href*="#open-jarvis-chat"]');
    if (!link) return;
    event.preventDefault();
    try {
      const [
        { ensureAcomAssistant },
        { openAcomAssistantChat },
        { getAuthoredGnavCards },
      ] = await Promise.all([
        import(bootstrapPath),
        import('./acom-assistant.js'),
        import('./acom-assistant-gnav.js'),
      ]);
      // Footer links only: the footer block saved the footer doc's app ID
      // (jarvis-surface-id / jarvis-surface-version) on the link as data-jarvis-config.
      // Header and body links skip this and use the page's app ID.
      let sectionMeta = null;
      if (link.closest('.global-footer')) {
        try {
          sectionMeta = JSON.parse(link.dataset.jarvisConfig);
        } catch {
          // use default config
        }
      }
      await ensureAcomAssistant(getAuthoredGnavCards());
      const sourceType = event.target.tagName?.toLowerCase();
      const sourceText = sourceType === 'img'
        ? event.target.alt?.trim() : event.target.innerText?.trim();
      await openAcomAssistantChat({ sourceType, sourceText }, sectionMeta);
    } catch (error) {
      window.lana?.log?.(`AcomAssistant: failed to open chat (${error.message})`, {
        tags: 'acom-assistant',
        severity: 'error',
      });
    }
  });
}
