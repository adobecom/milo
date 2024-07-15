const blockConfig = {
  name: 'global-footer',
  targetEl: 'footer',
  appendType: 'appendChild',
};

async function loadBlock() {
  const { fedsGlobalConfig = {} } = window;
  const miloLibs = fedsGlobalConfig.miloLibs || 'https://www.adobe.com';

  // Relative path can't be used, as the script will run on consumer's app
  const { default: bootstrapBlock } = await import(`${miloLibs}/libs/navigation/bootstrapper.js`);
  const { default: locales } = await import(`${miloLibs}/libs/utils/locales.js`);
  const clientConfig = {
    origin: miloLibs,
    contentRoot: fedsGlobalConfig.contentRoot,
    miloLibs: `${miloLibs}/libs`,
    pathname: `/${fedsGlobalConfig.locale || ''}`,
    locales: fedsGlobalConfig.locales || locales,
  };

  bootstrapBlock(clientConfig, blockConfig);
}

loadBlock();
