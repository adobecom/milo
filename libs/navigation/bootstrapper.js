export default async function bootstrapBlock(miloLibs, blockConfig) {
  const { name, targetEl, layout, noBorder } = blockConfig;
  const { getConfig, createTag, loadLink, loadScript } = await import(`${miloLibs}/utils/utils.js`);
  const { default: initBlock } = await import(`${miloLibs}/blocks/${name}/${name}.js`);

  const styles = [`${miloLibs}/blocks/${name}/${name}.css`, `${miloLibs}/navigation/navigation.css`];
  styles.forEach((url) => loadLink(url, { rel: 'stylesheet' }));

  const setNavLayout = () => {
    const element = document.querySelector(targetEl);
    if (element && layout === 'fullWidth') {
      element.classList.add('feds--full-width');
    }
    if (element && noBorder) {
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
}
