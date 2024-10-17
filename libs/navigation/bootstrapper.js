export default async function bootstrapBlock(miloLibs, blockConfig) {
  const { name, targetEl } = blockConfig;
  const { getConfig, createTag, loadLink, loadScript } = await import(`${miloLibs}/utils/utils.js`);
  const { default: initBlock } = await import(`${miloLibs}/blocks/${name}/${name}.js`);

  const styles = [`${miloLibs}/blocks/${name}/${name}.css`, `${miloLibs}/navigation/navigation.css`];
  styles.forEach((url) => loadLink(url, { rel: 'stylesheet' }));

  if (!document.querySelector(targetEl)) {
    const block = createTag(targetEl, { class: name });
    document.body[blockConfig.appendType](block);
  }
  // Configure Unav components and redirect uri
  if (blockConfig.targetEl === 'header') {
    const metaTags = [
      { key: 'unavComponents', name: 'universal-nav' },
      { key: 'redirect', name: 'adobe-home-redirect' },
    ];
    metaTags.forEach((tag) => {
      const { key } = tag;
      if (blockConfig[key]) {
        const metaTag = createTag('meta', {
          name: tag.name,
          content: blockConfig[key],
        });
        document.head.append(metaTag);
      }
    });
  }

  await initBlock(document.querySelector(targetEl));
  if (blockConfig.targetEl === 'footer') {
    const { loadPrivacy } = await import(`${miloLibs}/scripts/delayed.js`);
    setTimeout(() => {
      loadPrivacy(getConfig, loadScript);
    }, blockConfig.delay);
  }

  /** Jarvis Chat */
  const isChatInitialized = (client) => !!client?.isAdobeMessagingClientInitialized();

  const redirectToSupport = () => window.location.assign('https://helpx.adobe.com');

  const isChatOpen = (client) => client?.isAdobeMessagingClientInitialized() && client?.getMessagingExperienceState()?.windowState !== 'hidden';

  const openChat = (event) => {
    const client = window.AdobeMessagingExperienceClient;

    if (!isChatInitialized(client)) {
      redirectToSupport();
      return;
    }

    const open = client?.openMessagingWindow;
    if (typeof open !== 'function' || isChatOpen(client)) {
      return;
    }

    const sourceType = event?.target.tagName?.toLowerCase();
    const sourceText = sourceType === 'img' ? event.target.alt?.trim() : event.target.innerText?.trim();

    open(event ? { sourceType, sourceText } : {});
  };

  const addDomEvents = () => {
    console.log(document);
    document.addEventListener('click', (event) => {
      if (!event.target.closest('[href*="#open-jarvis-chat"]')) return;
      event.preventDefault();
      openChat(event);
    });
  };

  // Attach DOM events
  addDomEvents();
}
