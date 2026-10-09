let linksInitialized = false;

export default async function initChatLinks(config, loadScript, loadStyle, getMetadata) {
  const enableAssistantUI = getMetadata('acom-assistant');
  if (enableAssistantUI !== 'on') {
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
  // With the flag on, every chat link opens the BC experience (same appid as BC).
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
      await ensureAcomAssistant(getAuthoredGnavCards());
      const sourceType = event.target.tagName?.toLowerCase();
      const sourceText = sourceType === 'img'
        ? event.target.alt?.trim() : event.target.innerText?.trim();
      await openAcomAssistantChat({ sourceType, sourceText });
    } catch (error) {
      window.lana?.log?.(`AcomAssistant: failed to open chat (${error.message})`, {
        tags: 'acom-assistant',
        severity: 'error',
      });
    }
  });
}
