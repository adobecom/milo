export default async function bootstrapBlock(miloLibs, blockConfig) {
  const { name, targetEl, layout, noBorder, jarvis } = blockConfig;
  const { getConfig, createTag, loadLink, loadScript } = await import(`${miloLibs}/utils/utils.js`);
  const { default: initBlock } = await import(`${miloLibs}/blocks/${name}/${name}.js`);

  const styles = [`${miloLibs}/blocks/${name}/${name}.css`, `${miloLibs}/navigation/navigation.css`];
  styles.forEach((url) => loadLink(url, { rel: 'stylesheet' }));

  const setNavLayout = () => {
    const element = document.querySelector(targetEl);
    if (layout === 'fullWidth') {
      element.classList.add('feds--full-width');
    }
    if (noBorder) {
      element.classList.add('feds--no-border');
    }
  };

  if (!document.querySelector(targetEl)) {
    const block = createTag(targetEl, { class: name });
    document.body[blockConfig.appendType](block);
  }
  // Configure Unav components and redirect uri
  if (blockConfig.targetEl === 'header') {
    setNavLayout();
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
  if (jarvis?.id) {
    const isChatInitialized = (client) => !!client?.isAdobeMessagingClientInitialized();

    const isChatOpen = (client) => isChatInitialized(client) && client?.getMessagingExperienceState()?.windowState !== 'hidden';

    const openChat = (event) => {
      const client = window.AdobeMessagingExperienceClient;

      /* c8 ignore next 4 */
      if (!isChatInitialized(client)) {
        window.location.assign('https://helpx.adobe.com');
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
      document.addEventListener('click', (event) => {
        if (!event.target.closest('[href*="#open-jarvis-chat"]')) return;
        event.preventDefault();
        openChat(event);
      });
    };

    // Attach DOM events
    addDomEvents();
  }
}
