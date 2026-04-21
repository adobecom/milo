import { loadStyle } from '../utils/utils.js';

export const blockConfig = [
  {
    key: 'header',
    name: 'global-navigation',
    targetEl: 'header',
    appendType: 'prepend',
    params: ['imsClientId', 'searchEnabled', 'unav', 'customLinks', 'jarvis', 'selfIntegrateUnav', 'miniGnav', 'desktopAppsCta', 'useSusiModal', 'whatsNew'],
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

export const prodDomains = [
  'milo.adobe.com',
  'business.adobe.com',
  'www.adobe.com',
  'helpx.adobe.com',
  'stock.adobe.com',
  'adobecom.github.io',
];

export function resolveMiloLibs(env, customLib) {
  const branch = new URLSearchParams(window.location.search).get('navbranch');
  let miloLibs = branch ? `https://${branch}--milo--adobecom.aem.page` : customLib || envMap[env];
  const useLocal = new URLSearchParams(window.location.search).get('useLocal') || false;
  if (useLocal) {
    miloLibs = 'http://localhost:6456';
  }

  return miloLibs;
}

export function getStageDomainsMap(stageDomainsMap, env) {
  const defaultUrls = {
    'www.adobe.com': 'origin',
    'helpx.adobe.com': 'helpx.stage.adobe.com',
    'creativecloud.adobe.com': 'stage.creativecloud.adobe.com',
  };

  const merged = { ...defaultUrls, ...stageDomainsMap };
  const domainMap = { 'www.stage.adobe.com': merged };

  if (env !== 'prod') {
    domainMap[window.location.host] = { ...merged, 'www.adobe.com': 'www.stage.adobe.com' };
  }

  return domainMap;
}

export function getParamsConfigs(configs) {
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

export function setMetaTags(metaTags, configs, createTag) {
  metaTags.forEach((tag) => {
    const { key } = tag;
    if (configs[key]) {
      const metaTag = createTag('meta', {
        name: tag.name,
        content: configs[key],
      });
      document.head.append(metaTag);
    }
  });
}

export function getOrigin(env) {
  switch (env) {
    case 'prod': return 'https://www.adobe.com';
    case 'stage': return 'https://www.stage.adobe.com';
    default: return 'https://main--federal--adobecom.aem.page';
  }
}

export async function loadStandaloneNavigationStyles(theme, miloLibs) {
  // The below css imports will fail when using the non-bundled standalone gnav
  // and fallback to using loadStyle. On the other hand, the bundler will rewrite
  // the css imports to attach the styles to the head (and point to the dist folder
  // using the custom StyleLoader plugin found in build.mjs
  try {
    await import('./base.css');
    if (theme === 'dark') {
      await import('./dark-nav.css');
    }
    await import('./navigation.css');
  } catch (e) {
    if (theme === 'dark') {
      loadStyle(`${miloLibs}/libs/navigation/base.css`, () => loadStyle(`${miloLibs}/libs/navigation/dark-nav.css`));
    } else {
      loadStyle(`${miloLibs}/libs/navigation/base.css`);
    }
    loadStyle(`${miloLibs}/libs/navigation/navigation.css`);
  }
}
