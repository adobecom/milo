const blockConfig = {
  footer: {
    name: 'global-footer',
    targetEl: 'footer',
    appendType: 'appendChild',
  },
};

const envMap = {
  prod: 'https://www.adobe.com',
  stage: 'https://www.stage.adobe.com',
  qa: 'https://feds--milo--adobecom.hlx.page',
};

export default async function loadBlock(configs, customLib) {
  const { footer, locale, env = 'prod' } = configs || {};
  const branch = new URLSearchParams(window.location.search).get('navbranch');
  const miloLibs = branch ? `https://${branch}--milo--adobecom.hlx.page` : customLib || envMap[env];

  // Relative path can't be used, as the script will run on consumer's app
  const { default: bootstrapBlock } = await import(`${miloLibs}/libs/navigation/bootstrapper.js`);
  const { default: locales } = await import(`${miloLibs}/libs/utils/locales.js`);
  const clientConfig = {
    origin: miloLibs,
    miloLibs: `${miloLibs}/libs`,
    pathname: `/${locale || ''}`,
    locales: configs.locales || locales,
  };
  if (footer) {
    const { authoringPath, privacyId, privacyLoadDelay = 3000 } = footer;
    blockConfig.delay = privacyLoadDelay;
    bootstrapBlock({ ...clientConfig, contentRoot: authoringPath, privacyId }, blockConfig.footer);
  }
}
