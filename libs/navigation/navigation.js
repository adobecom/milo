const blockConfig = [
  {
    key: 'header',
    name: 'global-navigation',
    targetEl: 'header',
    appendType: 'prepend',
    params: ['imsClientId'],
  },
  {
    key: 'footer',
    name: 'global-footer',
    targetEl: 'footer',
    appendType: 'appendChild',
    params: ['privacyId', 'privacyLoadDelay'],
  },
];

const envMap = {
  prod: 'https://www.adobe.com',
  stage: 'https://www.stage.adobe.com',
  qa: 'https://gnav--milo--adobecom.hlx.page',
};

function getParamsConfigs(configs) {
  return blockConfig.reduce((acc, block) => {
    block.params.forEach((param) => {
      const value = configs[block.key]?.[param];
      if (value !== undefined) {
        acc[param] = value;
      }
    });
    return acc;
  }, {});
}

export default async function loadBlock(configs, customLib) {
  const { header, footer, authoringPath, env = 'prod', locale = '' } = configs || {};
  const branch = new URLSearchParams(window.location.search).get('navbranch');
  const miloLibs = branch ? `https://${branch}--milo--adobecom.hlx.page` : customLib || envMap[env];
  if (!header && !footer) {
    console.error('Global navigation Error: header and footer configurations are missing.');
    return;
  }
  // Relative path can't be used, as the script will run on consumer's app
  const [{ default: bootstrapBlock }, { default: locales }, { setConfig }] = await Promise.all([
    import(`${miloLibs}/libs/navigation/bootstrapper.js`),
    import(`${miloLibs}/libs/utils/locales.js`),
    import(`${miloLibs}/libs/utils/utils.js`),
  ]);

  const paramConfigs = getParamsConfigs(configs, miloLibs);
  const clientConfig = {
    origin: `https://main--federal--adobecom.hlx.${env === 'prod' ? 'live' : 'page'}`,
    miloLibs: `${miloLibs}/libs`,
    pathname: `/${locale}`,
    locales: configs.locales || locales,
    contentRoot: authoringPath || footer.authoringPath,
    ...paramConfigs,
  };
  setConfig(clientConfig);

  blockConfig.forEach((block) => {
    const configBlock = configs[block.key];
    if (configBlock) {
      bootstrapBlock(`${miloLibs}/libs`, {
        ...block,
        ...(block.key === 'header' && { unavComponents: configBlock.unavComponents, redirect: configBlock.redirect }),
      });
    }
  });
}

window.loadNavigation = loadBlock;
