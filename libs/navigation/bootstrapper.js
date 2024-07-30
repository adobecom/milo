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
  // Configure Unav if unav components are in configs
  if (blockConfig.targetEl === 'header' && blockConfig.unavComponents) {
    const unavMeta = createTag('meta', { name: 'universal-nav', content: blockConfig.unavComponents });
    document.head.append(unavMeta);
  }

  initBlock(document.querySelector(targetEl));
  if (blockConfig.targetEl === 'footer') {
    const { loadPrivacy } = await import(`${miloLibs}/scripts/delayed.js`);
    setTimeout(() => {
      loadPrivacy(getConfig, loadScript);
    }, blockConfig.delay);
  }
}
