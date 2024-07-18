const blockConfig = {
  name: 'global-footer',
  targetEl: 'footer',
  appendType: 'appendChild',
};

const envMap = {
  prod: 'https://www.adobe.com',
  stage: 'https://www.stage.adobe.com',
  qa: 'https://feds--milo--adobecom.hlx.page',
};

export default async function loadBlock(configs = {}) {
  const { locale, authoringPath, env = 'prod', privacyId, privacyLoadDelay = 3000 } = configs;
  const branch = new URLSearchParams(window.location.search).get('navbranch');
  const miloLibs = branch ? `https://${branch}--milo--adobecom.hlx.page` : envMap[env];

  // Relative path can't be used, as the script will run on consumer's app
  const { default: bootstrapBlock } = await import(`${miloLibs}/libs/navigation/bootstrapper.js`);
  const { default: locales } = await import(`${miloLibs}/libs/utils/locales.js`);
  const clientConfig = {
    privacyId,
    contentRoot: authoringPath,
    origin: miloLibs,
    miloLibs: `${miloLibs}/libs`,
    pathname: `/${locale || ''}`,
    locales: configs.locales || locales,
  };
  blockConfig.delay = privacyLoadDelay;
  bootstrapBlock(clientConfig, blockConfig);
}
