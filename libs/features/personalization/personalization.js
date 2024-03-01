/* eslint-disable no-console */

import {
  createTag, getConfig, loadLink, loadScript, localizeLink, updateConfig,
} from '../../utils/utils.js';
import { getEntitlementMap } from './entitlements.js';

/* c20 ignore start */
const PHONE_SIZE = window.screen.width < 768 || window.screen.height < 768;
export const PERSONALIZATION_TAGS = {
  all: () => true,
  chrome: () => navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg'),
  firefox: () => navigator.userAgent.includes('Firefox'),
  safari: () => navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'),
  edge: () => navigator.userAgent.includes('Edg'),
  android: () => navigator.userAgent.includes('Android'),
  ios: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
  windows: () => navigator.userAgent.includes('Windows'),
  mac: () => navigator.userAgent.includes('Macintosh'),
  'mobile-device': () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Touch/i.test(navigator.userAgent),
  phone: () => PERSONALIZATION_TAGS['mobile-device']() && PHONE_SIZE,
  tablet: () => PERSONALIZATION_TAGS['mobile-device']() && !PHONE_SIZE,
  desktop: () => !PERSONALIZATION_TAGS['mobile-device'](),
  loggedout: () => !window.adobeIMS?.isSignedInUser(),
  loggedin: () => !!window.adobeIMS?.isSignedInUser(),
};
const PERSONALIZATION_KEYS = Object.keys(PERSONALIZATION_TAGS);
/* c20 ignore stop */

const CLASS_EL_DELETE = 'p13n-deleted';
const CLASS_EL_REPLACE = 'p13n-replaced';
const COLUMN_NOT_OPERATOR = 'not';
const TARGET_EXP_PREFIX = 'target-';
const PAGE_URL = new URL(window.location.href);

export const NON_TRACKED_MANIFEST_TYPE = 'test or promo';

// Replace any non-alpha chars except comma, space, ampersand and hyphen
const RE_KEY_REPLACE = /[^a-z0-9\- _,&=]/g;

const MANIFEST_KEYS = [
  'action',
  'selector',
  'pagefilter',
  'page filter',
  'page filter optional',
];

const DATA_TYPE = {
  JSON: 'json',
  TEXT: 'text',
};

export const appendJsonExt = (path) => (path.endsWith('.json') ? path : `${path}.json`);

export const normalizePath = (p) => {
  let path = p;

  if (!path.includes('/')) {
    return path;
  }

  const config = getConfig();

  if (path.startsWith(config.codeRoot)
    || path.includes('.hlx.')
    || path.startsWith(`https://${config.productionDomain}`)) {
    try {
      const url = new URL(path);
      const firstFolder = url.pathname.split('/')[1];
      if (config.locale.ietf === 'en-US' || url.hash === '#_dnt' || firstFolder in config.locales || path.includes('.json')) {
        path = url.pathname;
      } else {
        path = `${config.locale.prefix}${url.pathname}`;
      }
    } catch (e) { /* return path below */ }
  } else if (!path.startsWith('http') && !path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
};

export const preloadManifests = ({ targetManifests = [], persManifests = [] }) => {
  let manifests = targetManifests;

  manifests = manifests.concat(
    persManifests.map((manifest) => ({
      ...manifest,
      manifestPath: appendJsonExt(manifest.manifestPath),
      manifestUrl: manifest.manifestPath,
    })),
  );

  for (const manifest of manifests) {
    if (!manifest.manifestData && manifest.manifestPath && !manifest.disabled) {
      manifest.manifestPath = normalizePath(manifest.manifestPath);
      loadLink(
        manifest.manifestPath,
        { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
      );
    }
  }
  return manifests;
};

export const getFileName = (path) => path?.split('/').pop();

const createFrag = (el, url, manifestId) => {
  let href = url;
  try {
    const { pathname, search, hash } = new URL(url);
    href = `${pathname}${search}${hash}`;
  } catch {
    // ignore
  }
  const a = createTag('a', { href }, url);
  if (manifestId) a.dataset.manifestId = manifestId;
  let frag = createTag('p', undefined, a);
  const isSection = el.parentElement.nodeName === 'MAIN';
  if (isSection) {
    frag = createTag('div', undefined, frag);
  }
  loadLink(`${localizeLink(a.href)}.plain.html`, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
  return frag;
};

const GLOBAL_CMDS = [
  'insertscript',
  'replacepage',
  'updatemetadata',
  'useblockcode',
];

const CREATE_CMDS = {
  insertafter: 'afterend',
  insertbefore: 'beforebegin',
  prependtosection: 'afterbegin',
  appendtosection: 'beforeend',
};

const COMMANDS = {
  remove: (el, target, manifestId) => {
    if (target === 'false') return;
    if (manifestId) {
      el.dataset.removedManifestId = manifestId;
      return;
    }
    el.classList.add(CLASS_EL_DELETE);
  },
  replace: (el, target, manifestId) => {
    if (!el || el.classList.contains(CLASS_EL_REPLACE)) return;
    el.insertAdjacentElement('beforebegin', createFrag(el, target, manifestId));
    el.classList.add(CLASS_EL_DELETE, CLASS_EL_REPLACE);
  },
};

function checkSelectorType(selector) {
  return selector?.includes('/fragments/') ? 'fragment' : 'css';
}

const fetchData = async (url, type = DATA_TYPE.JSON) => {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      /* c8 ignore next 5 */
      if (resp.status === 404) {
        throw new Error('File not found');
      }
      throw new Error(`Invalid response: ${resp.status} ${resp.statusText}`);
    }
    return await resp[type]();
  } catch (e) {
    /* c8 ignore next 3 */
    console.log(`Error loading content: ${url}`, e.message || e);
  }
  return null;
};

const getBlockProps = (fVal) => {
  let val = fVal;
  if (val?.includes('\\')) val = val?.split('\\').join('/');
  if (!val?.startsWith('/')) val = `/${val}`;
  const blockSelector = val?.split('/').pop();
  const { origin } = PAGE_URL;
  if (origin.includes('.hlx.') || origin.includes('localhost')) {
    if (val.startsWith('/libs/')) {
      /* c8 ignore next 2 */
      const { miloLibs, codeRoot } = getConfig();
      val = `${miloLibs || codeRoot}${val.replace('/libs', '')}`;
    } else {
      val = `${origin}${val}`;
    }
  }
  return { blockSelector, blockTarget: val };
};

const consolidateObjects = (arr, prop) => arr.reduce((propMap, item) => {
  item[prop]?.forEach((i) => {
    const { selector, val } = i;
    if (prop === 'blocks') {
      propMap[selector] = val;
      return;
    }

    if (selector in propMap) return;
    const action = {
      fragment: val,
      manifestPath: item.manifestPath,
      action: i.action,
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const key in propMap) {
      if (propMap[key].fragment === selector) propMap[key] = action;
    }
    propMap[selector] = action;
  });
  return propMap;
}, {});

const matchGlob = (searchStr, inputStr) => {
  const pattern = searchStr.replace(/\*\*/g, '.*');
  const reg = new RegExp(`^${pattern}$`, 'i'); // devtool bug needs this backtick: `
  return reg.test(inputStr);
};

export async function replaceInner(path, element) {
  if (!path || !element) return false;
  let plainPath = path.endsWith('/') ? `${path}index` : path;
  plainPath = plainPath.endsWith('.plain.html') ? plainPath : `${plainPath}.plain.html`;
  const html = await fetchData(plainPath, DATA_TYPE.TEXT);
  if (!html) return false;

  element.innerHTML = html;
  const { decorateArea } = getConfig();
  if (decorateArea) decorateArea(element);
  return true;
}
/* c8 ignore stop */

const setMetadata = (metadata) => {
  const { selector, val } = metadata;
  if (!selector || !val) return;
  const propName = selector.startsWith('og:') ? 'property' : 'name';
  let metaEl = document.querySelector(`meta[${propName}="${selector}"]`);
  if (!metaEl) {
    metaEl = document.createElement('meta');
    metaEl.setAttribute(propName, selector);
    document.head.append(metaEl);
  }
  metaEl.setAttribute('content', val);
};

function toLowerAlpha(str) {
  const s = str.toLowerCase();
  return s.replace(RE_KEY_REPLACE, '');
}

function normalizeKeys(obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[toLowerAlpha(key)] = obj[key];
    return newObj;
  }, {});
}

function getSelectedElement(selector, action) {
  try {
    if ((action.includes('appendtosection') || action.includes('prependtosection')) && selector.includes('section')) {
      let section = selector.trim().replace('section', '');
      if (section === '') section = 1;
      if (Number.isNaN(section)) return null;
      return document.querySelector(`main > :nth-child(${section})`);
    }
    if (checkSelectorType(selector) === 'fragment') {
      const fragment = document.querySelector(`a[href*="${normalizePath(selector)}"]`);
      if (fragment) {
        return fragment.parentNode;
      }
      return null;
    }
    return document.querySelector(selector);
  } catch (e) {
    return null;
  }
}

function handleCommands(commands, manifestId) {
  commands.forEach((cmd) => {
    const { action, selector, target } = cmd;
    if (action in COMMANDS) {
      const el = getSelectedElement(selector, action);
      COMMANDS[action](el, target, manifestId);
    } else if (action in CREATE_CMDS) {
      const el = getSelectedElement(selector, action);
      el?.insertAdjacentElement(CREATE_CMDS[action], createFrag(el, target, manifestId));
    } else {
      /* c8 ignore next 2 */
      console.log('Invalid command found: ', cmd);
    }
  });
}

const getVariantInfo = (line, variantNames, variants) => {
  const action = line.action?.toLowerCase().replace('content', '').replace('fragment', '');
  const { selector } = line;
  const pageFilter = line['page filter'] || line['page filter optional'];

  if (pageFilter && !matchGlob(pageFilter, new URL(window.location).pathname)) return;

  variantNames.forEach((vn) => {
    if (!line[vn] || line[vn].toLowerCase() === 'false') return;

    const variantInfo = {
      action,
      selector,
      pageFilter,
      target: line[vn],
      selectorType: checkSelectorType(selector),
    };

    if (action in COMMANDS && variantInfo.selectorType === 'fragment') {
      variants[vn].fragments.push({
        selector: normalizePath(variantInfo.selector),
        val: normalizePath(line[vn]),
        action,
      });
    } else if (GLOBAL_CMDS.includes(action)) {
      variants[vn][action] = variants[vn][action] || [];

      if (action === 'useblockcode') {
        const { blockSelector, blockTarget } = getBlockProps(line[vn]);
        variants[vn][action].push({
          selector: blockSelector,
          val: blockTarget,
          pageFilter,
        });
      } else {
        variants[vn][action].push({
          selector: normalizePath(selector),
          val: normalizePath(line[vn]),
          pageFilter,
        });
      }
    } else if (action in COMMANDS || action in CREATE_CMDS) {
      variants[vn].commands.push(variantInfo);
    } else {
      /* c8 ignore next 2 */
      console.log('Invalid action found: ', line);
    }
  });
};

export function parseConfig(data) {
  if (!data?.length) return null;

  const config = {};
  const experiences = data.map((d) => normalizeKeys(d));

  try {
    const variants = {};
    const variantNames = Object.keys(experiences[0])
      .filter((vn) => !MANIFEST_KEYS.includes(vn));

    variantNames.forEach((vn) => {
      variants[vn] = { commands: [], fragments: [] };
    });

    experiences.forEach((line) => getVariantInfo(line, variantNames, variants));

    config.variants = variants;
    config.variantNames = variantNames;
    return config;
  } catch (e) {
    /* c8 ignore next 3 */
    console.log('error parsing personalization config:', e, experiences);
  }
  return null;
}

/* c8 ignore start */
function parsePlaceholders(placeholders, config, selectedVariantName = '') {
  if (!placeholders?.length || selectedVariantName === 'default') return config;
  const valueNames = [
    'value',
    selectedVariantName.toLowerCase(),
    config.locale.ietf.toLowerCase(),
    ...config.locale.ietf.toLowerCase().split('-'),
  ];
  const [val] = Object.entries(placeholders[0])
    .find(([key]) => valueNames.includes(key.toLowerCase()));
  if (val) {
    const results = placeholders.reduce((res, item) => {
      res[item.key] = item[val];
      return res;
    }, {});
    config.placeholders = { ...(config.placeholders || {}), ...results };
  }
  return config;
}
/* c8 ignore stop */

const checkForParamMatch = (paramStr) => {
  const [name, val] = paramStr.split('param-')[1].split('=');
  if (!name) return false;
  const params = new URLSearchParams(
    Array.from(PAGE_URL.searchParams, ([key, value]) => [key.toLowerCase(), value?.toLowerCase()]),
  );
  const searchParamVal = params.get(name.toLowerCase());
  if (searchParamVal !== null) {
    if (val) return val === searchParamVal;
    return true; // if no val is set, just check for existence of param
  }
  return false;
};

async function getPersonalizationVariant(manifestPath, variantNames = [], variantLabel = null) {
  const config = getConfig();
  if (config.mep?.override) {
    let manifest;
    /* c8 ignore start */
    config.mep?.override?.split(',').some((item) => {
      const pair = item.trim().split('--');
      if (pair[0] === manifestPath && pair.length > 1) {
        [, manifest] = pair;
        return true;
      }
      return false;
    });
    /* c8 ignore stop */
    if (manifest) return manifest;
  }

  const variantInfo = variantNames.reduce((acc, name) => {
    let nameArr = [name];
    if (!name.startsWith(TARGET_EXP_PREFIX)) nameArr = name.split(',');
    const vNames = nameArr.map((v) => v.trim()).filter(Boolean);
    acc[name] = vNames;
    acc.allNames = [...acc.allNames, ...vNames];
    return acc;
  }, { allNames: [] });

  const entitlementKeys = Object.values(await getEntitlementMap());
  const hasEntitlementTag = entitlementKeys.some((tag) => variantInfo.allNames.includes(tag));

  let userEntitlements = [];
  if (hasEntitlementTag) {
    userEntitlements = await config.entitlements();
  }

  const hasMatch = (name) => {
    if (name === '') return true;
    if (name === variantLabel?.toLowerCase()) return true;
    if (name.startsWith('param-')) return checkForParamMatch(name);
    if (userEntitlements?.includes(name)) return true;
    return PERSONALIZATION_KEYS.includes(name) && PERSONALIZATION_TAGS[name]();
  };

  const matchVariant = (name) => {
    if (name.startsWith(TARGET_EXP_PREFIX)) return hasMatch(name);
    const processedList = name.split('&').map((condition) => {
      const reverse = condition.trim().startsWith(COLUMN_NOT_OPERATOR);
      const match = hasMatch(condition.replace(COLUMN_NOT_OPERATOR, '').trim());
      return reverse ? !match : match;
    });
    return !processedList.includes(false);
  };

  const matchingVariant = variantNames.find((variant) => variantInfo[variant].some(matchVariant));
  return matchingVariant;
}

export async function getPersConfig(info) {
  const {
    name,
    manifestData,
    manifestPath,
    manifestUrl,
    manifestPlaceholders,
    manifestInfo,
    variantLabel,
    disabled,
    event,
  } = info;
  let data = manifestData;
  if (!data) {
    const fetchedData = await fetchData(manifestPath, DATA_TYPE.JSON);
    if (fetchData) data = fetchedData;
  }

  const persData = data?.experiences?.data || data?.data || data;
  if (!persData) return null;
  const config = parseConfig(persData);

  if (!config) {
    /* c8 ignore next 3 */
    console.log('Error loading personalization config: ', name || manifestPath);
    return null;
  }

  const infoTab = manifestInfo || data?.info?.data;
  config.manifestType = infoTab
    ?.find((element) => element.key?.toLowerCase() === 'manifest-type')?.value?.toLowerCase()
    || 'personalization';

  config.manifestOverrideName = infoTab
    ?.find((element) => element.key?.toLowerCase() === 'manifest-override-name')
    ?.value?.toLowerCase();

  const selectedVariantName = await getPersonalizationVariant(
    manifestPath,
    config.variantNames,
    variantLabel,
  );

  if (selectedVariantName && config.variantNames.includes(selectedVariantName)) {
    config.run = true;
    config.selectedVariantName = selectedVariantName;
    config.selectedVariant = config.variants[selectedVariantName];
  } else {
    /* c8 ignore next 2 */
    config.selectedVariantName = 'default';
    config.selectedVariant = 'default';
  }

  const placeholders = manifestPlaceholders || data?.placeholders?.data;
  if (placeholders) {
    updateConfig(
      parsePlaceholders(placeholders, getConfig(), config.selectedVariantName),
    );
  }

  config.name = name;
  config.manifest = manifestPath;
  config.manifestUrl = manifestUrl;
  config.disabled = disabled;
  config.event = event;
  return config;
}

const deleteMarkedEls = () => {
  [...document.querySelectorAll(`.${CLASS_EL_DELETE}`)]
    .forEach((el) => el.remove());
};

const normalizeFragPaths = ({ selector, val, action }) => ({
  selector: normalizePath(selector),
  val: normalizePath(val),
  action,
});

export async function runPersonalization(info, config) {
  const { manifestPath } = info;

  const experiment = await getPersConfig(info);
  if (!experiment) return null;

  const { selectedVariant } = experiment;
  if (!selectedVariant) return {};
  if (selectedVariant === 'default') {
    return { experiment };
  }

  if (selectedVariant.replacepage) {
    // only one replacepage can be defined
    await replaceInner(selectedVariant.replacepage[0]?.val, document.querySelector('main'));
    document.querySelector('main').dataset.manifestId = manifestPath;
  }

  selectedVariant.insertscript?.map((script) => loadScript(script.val));
  selectedVariant.updatemetadata?.map((metadata) => setMetadata(metadata));

  let manifestId = getFileName(experiment.manifest);
  if (!config.mep?.preview) {
    manifestId = false;
  } else if (experiment.name) {
    manifestId = `${experiment.name}: ${manifestId}`;
  }
  handleCommands(selectedVariant.commands, manifestId);

  selectedVariant.fragments &&= selectedVariant.fragments.map(normalizeFragPaths);

  return {
    manifestPath,
    experiment,
    blocks: selectedVariant.useblockcode,
    fragments: selectedVariant.fragments,
  };
}

function cleanManifestList(manifests) {
  const manifestPaths = [];
  const cleanedList = [];
  manifests.forEach((manifest) => {
    try {
      const url = new URL(manifest.manifestPath);
      manifest.manifestPath = url.pathname;
    } catch (e) {
      // do nothing
    }
    const foundIndex = manifestPaths.indexOf(manifest.manifestPath);
    if (foundIndex === -1) {
      manifestPaths.push(manifest.manifestPath);
      cleanedList.push(manifest);
    } else {
      cleanedList[foundIndex] = { ...cleanedList[foundIndex], ...manifest };
    }
  });
  return cleanedList;
}

const createDefaultExperiment = (manifest) => ({
  disabled: manifest.disabled,
  event: manifest.event,
  manifest: manifest.manifestPath,
  variantNames: ['all'],
  selectedVariantName: 'default',
  selectedVariant: { commands: [], fragments: [] },
});

export async function applyPers(manifests) {
  const config = getConfig();

  if (!manifests?.length) return;

  const cleanedManifests = cleanManifestList(manifests);

  const override = config.mep?.override;
  let results = [];
  const experiments = [];
  for (const manifest of cleanedManifests) {
    if (manifest.disabled && !override) {
      experiments.push(createDefaultExperiment(manifest));
    } else {
      const result = await runPersonalization(manifest, config);
      if (result) {
        results.push(result);
        experiments.push(result.experiment);
      }
    }
  }
  results = results.filter(Boolean);
  deleteMarkedEls();

  config.experiments = experiments;
  config.expBlocks = consolidateObjects(results, 'blocks');
  config.expFragments = consolidateObjects(results, 'fragments');

  const pznList = results.filter((r) => (r.experiment.manifestType !== NON_TRACKED_MANIFEST_TYPE));
  if (!pznList.length) return;

  const pznVariants = pznList.map((r) => {
    const val = r.experiment.selectedVariantName.replace(TARGET_EXP_PREFIX, '').trim().slice(0, 15);
    return val === 'default' ? 'nopzn' : val;
  });
  const pznManifests = pznList.map((r) => {
    const val = r.experiment?.manifestOverrideName || r.experiment?.manifest;
    return getFileName(val).replace('.json', '').trim().slice(0, 15);
  });
  if (!config?.mep) config.mep = {};
  config.mep.martech = `|${pznVariants.join('--')}|${pznManifests.join('--')}`;
  config.mep.handleFragmentCommand = (command, a) => {
    const { action, fragment, manifestPath } = command;
    if (action === 'replace') {
      a.href = fragment;
      if (config.mep.preview) a.dataset.manifestId = manifestPath;
      return fragment;
    }
    if (action === 'remove') {
      if (config.mep.preview) {
        a.parentElement.dataset.removedManifestId = manifestPath;
      } else {
        a.parentElement.remove();
      }
    }
    return false;
  };
}
