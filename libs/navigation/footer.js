const blockConfig = {
  name: 'global-footer',
  targetEl: 'footer',
  appendType: 'appendChild',
};

const envMap = {
  prod: 'https://www.adobe.com',
  stage: 'https://www.stage.adobe.com/',
  qa: 'https://feds--milo--adobecom.hlx.page'
}

export default async function loadBlock(configs = {}) {
  const { locale, contentRoot, env = 'prod' } = configs;
  let miloLibs = envMap[env];
  const branch = new URLSearchParams(window.location.search).get('navbranch');
  if (branch) {
    miloLibs = `https://${branch}--milo--adobecom.hlx.page`;
  }

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
