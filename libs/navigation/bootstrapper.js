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
    ['unavComponents', 'redirect'].forEach((key) => {
      if (blockConfig[key]) {
        const metaTag = createTag('meta', {
          name: key === 'unavComponents' ? 'universal-nav' : 'adobe-home-redirect',
          content: blockConfig[key],
        });
        document.head.append(metaTag);
      }
    });
  }

  initBlock(document.querySelector(targetEl));
  if (blockConfig.targetEl === 'footer') {
    const { loadPrivacy } = await import(`${miloLibs}/scripts/delayed.js`);
    setTimeout(() => {
      loadPrivacy(getConfig, loadScript);
    }, blockConfig.delay);
  }
}
