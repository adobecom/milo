const blockConfig = [
  {
    key: 'header',
    name: 'global-navigation',
    targetEl: 'header',
    appendType: 'prepend',
    params: ['imsClientId', 'searchEnabled', 'unav', 'customLinks', 'jarvis'],
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
  qa: 'https://gnav--milo--adobecom.aem.page',
};

const getStageDomainsMap = (stageDomainsMap) => (
  {
    'www.stage.adobe.com': {
      'www.adobe.com': 'origin',
      'helpx.adobe.com': 'helpx.stage.adobe.com',
      'creativecloud.adobe.com': 'stage.creativecloud.adobe.com',
      ...stageDomainsMap,
    },
    // Test app
    'adobecom.github.io': {
      'www.adobe.com': 'www.stage.adobe.com',
      'helpx.adobe.com': 'helpx.stage.adobe.com',
      'creativecloud.adobe.com': 'stage.creativecloud.adobe.com',
      ...stageDomainsMap,
    },
  }
);

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
  const {
    header,
    footer,
    authoringPath,
    env = 'prod',
    locale = '',
    theme,
    stageDomainsMap = {},
  } = configs || {};
  const branch = new URLSearchParams(window.location.search).get('navbranch');
  const miloLibs = branch ? `https://${branch}--milo--adobecom.aem.page` : customLib || envMap[env];
  if (!header && !footer) {
    // eslint-disable-next-line no-console
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
    clientEnv: env,
    origin: `https://main--federal--adobecom.aem.${env === 'prod' ? 'live' : 'page'}`,
    miloLibs: `${miloLibs}/libs`,
    pathname: `/${locale}`,
    locales: configs.locales || locales,
    contentRoot: authoringPath || footer.authoringPath,
    theme,
    ...paramConfigs,
    stageDomainsMap: getStageDomainsMap(stageDomainsMap),
  };
  setConfig(clientConfig);
  for await (const block of blockConfig) {
    const configBlock = configs[block.key];
    try {
      if (configBlock) {
        await bootstrapBlock(`${miloLibs}/libs`, {
          ...block,
          ...(block.key === 'header' && {
            unavComponents: configBlock.unav?.unavComponents,
            redirect: configBlock.redirect,
            layout: configBlock.layout,
            noBorder: configBlock.noBorder,
            jarvis: configBlock.jarvis,
          }),
        });
        configBlock.onReady?.();
      }
    } catch (e) {
      configBlock.onError?.(e);
    }
  }
}

window.loadNavigation = loadBlock;
