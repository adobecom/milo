export default async function bootstrapBlock(miloConfigs, blockConfig) {
  const { miloLibs } = miloConfigs;
  const { name, targetEl } = blockConfig;
  const { getConfig, setConfig, createTag, loadLink, loadScript } = await import(`${miloLibs}/utils/utils.js`);
  setConfig({ ...miloConfigs });
  const { default: initBlock } = await import(`${miloLibs}/blocks/${name}/${name}.js`);

  const styles = [`${miloLibs}/blocks/${name}/${name}.css`, `${miloLibs}/navigation/navigation.css`];
  styles.forEach((url) => loadLink(url, { rel: 'stylesheet' }));

  if (!document.querySelector(targetEl)) {
    const block = createTag(targetEl, { class: name });
    document.body[blockConfig.appendType](block);
  }
  initBlock(document.querySelector(targetEl));
  if (blockConfig.targetEl === 'footer') {
    const { loadPrivacy } = await import(`${miloLibs}/scripts/delayed.js`);
    setTimeout(() => {
      loadPrivacy(getConfig, loadScript);
    }, blockConfig.delay);
  }
}
