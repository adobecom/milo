export default async function bootstrapBlock(miloConfigs, blockConfig) {
  const { miloLibs } = miloConfigs;
  const { name, targetEl } = blockConfig;
  const { setConfig, createTag, loadLink } = await import(`${miloLibs}/utils/utils.js`);
  setConfig({ ...miloConfigs });
  const styles = [`${miloLibs}/blocks/${name}/${name}.css`, `${miloLibs}/navigation/styles.css`];
  styles.forEach((url) => loadLink(url, { rel: 'stylesheet' }));
  const { default: initBlock } = await import(`${miloLibs}/blocks/${name}/${name}.js`);

  if (!document.querySelector(targetEl)) {
    const block = createTag(targetEl, { class: name });
    document.body[blockConfig.appendType](block);
  }
  initBlock(document.querySelector(targetEl));
}
