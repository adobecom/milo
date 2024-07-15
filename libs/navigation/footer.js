const blockConfig = {
  name: 'global-footer',
  targetEl: 'footer',
  appendType: 'appendChild',
};

export default async function loadBlock(configs = {}) {
  let miloLibs = configs.miloLibs || 'https://www.adobe.com';
  const branch = new URLSearchParams(window.location.search).get('branch');
  if (branch) {
    miloLibs = `https://${branch}--milo--adobecom.hlx.page`
  }
  const { locale,  contentRoot} = configs;

  // Relative path can't be used, as the script will run on consumer's app
  const { default: bootstrapBlock } = await import(`${miloLibs}/libs/navigation/bootstrapper.js`);
  const { default: locales } = await import(`${miloLibs}/libs/utils/locales.js`);
  const clientConfig = {
    contentRoot,
    origin: miloLibs,
    miloLibs: `${miloLibs}/libs`,
    pathname: `/${locale || ''}`,
    locales: configs.locales || locales,
  };

  bootstrapBlock(clientConfig, blockConfig);
}

