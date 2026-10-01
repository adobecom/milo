let linksInitialized = false;

export default async function initChatLinks(config, loadScript, loadStyle, getMetadata) {
  const flag = new URLSearchParams(window.location.search).get('acom-assistant')
    || getMetadata('acom-assistant');
  if (flag !== 'on') {
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
  document.addEventListener('click', async (event) => {
    const link = event.target.closest('[href*="#open-jarvis-chat"]');
    if (!link) return;
    event.preventDefault();
    try {
      const authoredConfig = link.getAttribute('data-jarvis-config');
      const jarvisConfig = authoredConfig ? JSON.parse(authoredConfig) : {};
      if (!jarvisConfig || typeof jarvisConfig !== 'object' || Array.isArray(jarvisConfig)) {
        throw new Error('Invalid Jarvis link configuration');
      }
      const identity = {
        appid: jarvisConfig['jarvis-surface-id']
          || getMetadata('jarvis-surface-id') || config.jarvis?.id,
        appver: jarvisConfig['jarvis-surface-version']
          || getMetadata('jarvis-surface-version') || config.jarvis?.version,
      };
      if (!identity.appid || !identity.appver) {
        throw new Error('Jarvis link requires a surface ID and version');
      }
      const [{ ensureAcomAssistant }, { openAcomAssistantChat }] = await Promise.all([
        import(bootstrapPath),
        import('./acom-assistant.js'),
      ]);
      await ensureAcomAssistant();
      const sourceType = event.target.tagName?.toLowerCase();
      const sourceText = sourceType === 'img'
        ? event.target.alt?.trim() : event.target.innerText?.trim();
      await openAcomAssistantChat({ sourceType, sourceText }, identity);
    } catch (error) {
      window.lana?.log?.(`AcomAssistant: failed to open chat (${error.message})`, {
        tags: 'acom-assistant',
        severity: 'error',
      });
    }
  });
}
