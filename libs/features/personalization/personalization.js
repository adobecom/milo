/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import {
  createTag, getConfig, loadLink, loadScript, localizeLink, updateConfig, MILO_BLOCKS,
} from '../../utils/utils.js';
import { getEntitlementMap } from './entitlements.js';

/* c8 ignore start */
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
/* c8 ignore stop */

const CLASS_EL_DELETE = 'p13n-deleted';
const CLASS_EL_REPLACE = 'p13n-replaced';
const COLUMN_NOT_OPERATOR = 'not ';
const TARGET_EXP_PREFIX = 'target-';
const INLINE_HASH = '_inline';
const PAGE_URL = new URL(window.location.href);

export const TRACKED_MANIFEST_TYPE = 'personalization';

// Replace any non-alpha chars except comma, space, ampersand and hyphen
const RE_KEY_REPLACE = /[^a-z0-9\- _,&=]/g;

const MANIFEST_KEYS = [
  'action',
  'selector',
  'modifier',
  'pagefilter',
  'page filter',
  'page filter optional',
];

const DATA_TYPE = {
  JSON: 'json',
  TEXT: 'text',
};

const IN_BLOCK_SELECTOR_PREFIX = 'in-block:';

export const normalizePath = (p, localize = true) => {
  let path = p;

  if (!path?.includes('/')) {
    return path;
  }

  const config = getConfig();

  if (path.startsWith(config.codeRoot)
    || path.includes('.hlx.')
    || path.includes('.adobe.')) {
    try {
      const url = new URL(path);
      const firstFolder = url.pathname.split('/')[1];
      if (!localize
        || config.locale.ietf === 'en-US'
        || url.hash.includes('#_dnt')
        || firstFolder in config.locales
        || path.includes('.json')) {
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

export const getFileName = (path) => path?.split('/').pop();

const isInLcpSection = (el) => {
  const lcpSection = document.querySelector('body > main > div');
  return lcpSection === el || lcpSection?.contains(el);
};

export const createFrag = (el, url, manifestId, targetManifestId) => {
  let href = url;
  try {
    const { pathname, search, hash } = new URL(url);
    href = `${pathname}${search}${hash}`;
  } catch {
    // ignore
  }
  const a = createTag('a', { href }, url);
  if (manifestId) a.dataset.manifestId = manifestId;
  if (targetManifestId) a.dataset.adobeTargetTestid = targetManifestId;
  let frag = createTag('p', undefined, a);
  const isDelayedModalAnchor = /#.*delay=/.test(href);
  if (isDelayedModalAnchor) frag.classList.add('hide-block');
  const isSection = el.parentElement.nodeName === 'MAIN';
  if (isSection) {
    frag = createTag('div', undefined, frag);
  }
  if (isInLcpSection(el)) {
    loadLink(`${localizeLink(a.href)}.plain.html`, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
  }
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

const COMMANDS_KEYS = {
  remove: 'remove',
  replace: 'replace',
  update: 'update',
};

const COMMANDS = {
  [COMMANDS_KEYS.remove]: ({ el, target, manifestId }) => {
    if (target === 'false') return;
    if (manifestId) {
      el.dataset.removedManifestId = manifestId;
      return;
    }
    el.classList.add(CLASS_EL_DELETE);
  },
  [COMMANDS_KEYS.replace]: ({ el, target, manifestId, targetManifestId }) => {
    if (!el || el.classList.contains(CLASS_EL_REPLACE)) return;
    el.insertAdjacentElement('beforebegin', createFrag(el, target, manifestId, targetManifestId));
    el.classList.add(CLASS_EL_DELETE, CLASS_EL_REPLACE);
  },
  [COMMANDS_KEYS.update]: ({ el, target, modifier, targetManifestId }) => {
    if (!el) return;
    switch (modifier) {
      case 'href':
        el.href = target;
        break;
      case 'html':
        el.innerHTML = target;
        break;
      default:
        el.innerText = target;
        break;
    }
    if (targetManifestId) el.dataset.adobeTargetTestid = targetManifestId;
  },
};

function checkSelectorType(selector) {
  return selector?.startsWith('/') || selector?.startsWith('http') ? 'fragment' : 'css';
}

const fetchData = async (url, type = DATA_TYPE.JSON) => {
  try {
    const resp = await fetch(normalizePath(url));
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

const consolidateArray = (arr, prop, existing = []) => arr
  .reduce((results, i) => [...results, ...i[prop] || []], existing);

const consolidateObjects = (arr, prop, existing = {}) => arr.reduce((propMap, item) => {
  item[prop]?.forEach((i) => {
    const { selector, val } = i;
    if (prop === 'blocks') {
      propMap[selector] = val;
      return;
    }

    if (selector in propMap) return;
    const action = {
      action: i.action,
      fragment: val,
      selector,
      manifestPath: item.manifestPath,
      manifestId: i.manifestId,
      targetManifestId: i.targetManifestId,
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const key in propMap) {
      if (propMap[key].fragment === selector) propMap[key] = action;
    }
    propMap[selector] = action;
  });
  return { ...existing, ...propMap };
}, {});

export const matchGlob = (searchStr, inputStr) => {
  const pattern = searchStr.replace(/\*\*/g, '.*');
  const reg = new RegExp(`^${pattern}(\\.html)?$`, 'i'); // devtool bug needs this backtick: `
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

const querySelector = (el, selector, all = false) => {
  try {
    return all ? el.querySelectorAll(selector) : el.querySelector(selector);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.log('Invalid selector: ', selector);
    return null;
  }
};
function registerInBlockActions(cmd, manifestId, targetManifestId) {
  const { action, target, selector } = cmd;
  const command = { action, target, manifestId, targetManifestId };

  const blockAndSelector = selector.substring(IN_BLOCK_SELECTOR_PREFIX.length).trim().split(/\s+/);
  const [blockName] = blockAndSelector;

  const config = getConfig();
  config.mep.inBlock ??= {};
  config.mep.inBlock[blockName] ??= {};

  let blockSelector;
  if (blockAndSelector.length > 1) {
    blockSelector = blockAndSelector.slice(1).join(' ');
    command.selector = blockSelector;
    if (checkSelectorType(blockSelector) === 'fragment') {
      config.mep.inBlock[blockName].fragments ??= {};
      const { fragments } = config.mep.inBlock[blockName];
      delete command.selector;
      if (blockSelector in fragments) return;

      // eslint-disable-next-line no-restricted-syntax
      for (const key in fragments) {
        if (fragments[key].target === blockSelector) fragments[key] = command;
      }
      fragments[blockSelector] = command;

      blockSelector = normalizePath(blockSelector);
      // eslint-disable-next-line no-restricted-syntax
      for (const key in fragments) {
        if (fragments[key].target === blockSelector) fragments[key] = command;
      }
      fragments[blockSelector] = command;
      return;
    }
  }
  config.mep.inBlock[blockName].commands ??= [];
  config.mep.inBlock[blockName].commands.push(command);
}

function getSelectedElement({ selector, rootEl }) {
  if (!selector) return null;
  const originalSelector = selector;
  if (checkSelectorType(selector) === 'fragment') {
    // handle fragment selector
    try {
      const fragment = document.querySelector(`a[href*="${normalizePath(selector, false)}"], a[href*="${normalizePath(selector, true)}"]`);
      if (fragment) return fragment.parentNode;
      return null;
    } catch (e) {
      return null;
    }
  } else {
    try {
      // translate Milo Blocks names to CSS selectors
      MILO_BLOCKS.forEach((block) => {
        const regex = new RegExp(`(\\s|^)(${block})\\.?(\\d+)?(\\s|$)`, 'g');
        const match = regex.exec(selector);
        if (match?.length) {
          const simplifiedSelector = match[0].replace(/\s+/g, '');
          const n = simplifiedSelector.match(/\d+/g) || '1';
          const cleanClassSelector = match[2]; // this one has no digits and no spaces
          const cssOptimizedSelector = ` .${cleanClassSelector}:nth-child(${n} of .${cleanClassSelector})`;
          // eslint-disable-next-line no-param-reassign
          selector = selector.replace(simplifiedSelector, cssOptimizedSelector);
        }
      });
      // translate Simplified (pseudo) selectors to CSS selectors
      ['section', 'row', 'col'].forEach((sel) => {
        const simplifiedSelectors = selector.match(new RegExp(`${sel}\\.?\\d?`, 'g'));
        simplifiedSelectors?.forEach((simplifiedSelector) => {
          const n = simplifiedSelector.match(/\d+/g) || '1';
          const cssOptimizedSelector = `> div:nth-of-type(${n})`;
          // eslint-disable-next-line no-param-reassign
          selector = selector.replace(simplifiedSelector, cssOptimizedSelector);
        });
      });
      /// translate "helper" selectors (selector:attribute pairs) to CSS selectors
      ['primary-cta', 'secondary-cta', 'action-area'].forEach((sel) => {
        const simplifiedSelectors = selector.match(new RegExp(`${sel}`, 'g'));
        simplifiedSelectors?.forEach((simplifiedSelector) => {
          switch (true) {
            case simplifiedSelector.includes('primary-cta'):
              // eslint-disable-next-line no-param-reassign
              selector = selector.replace(simplifiedSelector, 'p strong a');
              break;
            case simplifiedSelector.includes('secondary-cta'):
              // eslint-disable-next-line no-param-reassign
              selector = selector.replace(simplifiedSelector, 'p em a');
              break;
            case simplifiedSelector.includes('action-area'):
              // eslint-disable-next-line no-param-reassign
              selector = selector.replace(simplifiedSelector, 'p:has(em a, strong a)');
              break;
            default: break;
          }
        });
      });
      // transalte custom block selectors to CSS selectors
      const customBlockSelectors = selector.match(/\.\w+-?\w+\d+/g);
      customBlockSelectors?.forEach((customBlockSelector) => {
        const n = customBlockSelector.match(/\d+/g);
        const blockName = customBlockSelector.replace(/(\.|\d+)/g, '');
        const cssOptimizedSelector = ` .${blockName}:nth-child(${n} of .${blockName})`;
        // eslint-disable-next-line no-param-reassign
        selector = selector.replace(customBlockSelector, cssOptimizedSelector);
      });
      // eslint-disable-next-line no-param-reassign
      selector = rootEl === document ? `body > main ${selector}` : `:scope ${selector}`;
      const element = querySelector(rootEl || document, selector);

      // TODO: for testing purposes only. Remove when done
      console.log('=====================================');
      console.log('selector: ', originalSelector, ' ==> ', selector);
      console.log('element: ', element ? 'found' : '!!! NOT FOUND !!!');

      return element;
    } catch (e) {
      console.error('Error optimizing selector: ', e);
      return null;
    }
  }
}
const addHash = (url, newHash) => {
  if (!newHash) return url;
  try {
    const { origin, pathname, search } = new URL(url);
    return `${origin}${pathname}${search}#${newHash}`;
  } catch (e) {
    return `${url}#${newHash}`;
  }
};

const setDataIdOnChildren = (sections, id, value) => {
  [...sections[0].children].forEach(
    (child) => (child.dataset[id] = value),
  );
};

export const updateFragDataProps = (a, inline, sections, fragment) => {
  const { manifestId, adobeTargetTestid } = a.dataset;
  if (inline) {
    if (manifestId) setDataIdOnChildren(sections, 'manifestId', manifestId);
    if (adobeTargetTestid) setDataIdOnChildren(sections, 'adobeTargetTestid', adobeTargetTestid);
  } else {
    if (manifestId) fragment.dataset.manifestId = manifestId;
    if (adobeTargetTestid) fragment.dataset.adobeTargetTestid = adobeTargetTestid;
  }
};


export function handleCommands(commands, rootEl = document, forceInline = false) {
  commands.forEach((cmd) => {
    const {
      manifestId, targetManifestId, action, selector, modifier, target: trgt 
    } = cmd;
    const target = forceInline ? addHash(trgt, INLINE_HASH) : trgt;
    if (selector.startsWith(IN_BLOCK_SELECTOR_PREFIX)) {
      registerInBlockActions(cmd, manifestId, targetManifestId);
      return;
    }
    const el = getSelectedElement({ selector, rootEl });

    if (!el || (!(action in COMMANDS) && !(action in CREATE_CMDS))) return;

    if (action in COMMANDS) {
      COMMANDS[action]({ el, target, manifestId, targetManifestId, modifier });
      return;
    }
    el?.insertAdjacentElement(
      CREATE_CMDS[action],
      createFrag(el, target, manifestId, targetManifestId),
    );
  });
}

const getVariantInfo = (line, variantNames, variants, manifestPath, manifestOverrideName) => {
  const config = getConfig();
  let manifestId = getFileName(manifestPath);
  let targetId = manifestId.replace('.json', '');
  if (manifestOverrideName) targetId = manifestOverrideName;
  if (!config.mep?.preview) manifestId = false;
  const action = line.action?.toLowerCase().replace('content', '').replace('fragment', '');
  const { selector, modifier } = line;
  const pageFilter = line['page filter'] || line['page filter optional'];

  if (pageFilter && !matchGlob(pageFilter, new URL(window.location).pathname)) return;

  if (!config.mep?.preview) manifestId = false;
  variantNames.forEach((vn) => {
    const targetManifestId = vn.startsWith(TARGET_EXP_PREFIX) ? targetId : false;
    if (!line[vn] || line[vn].toLowerCase() === 'false') return;

    const variantInfo = {
      action,
      selector,
      modifier,
      pageFilter,
      target: line[vn],
      selectorType: checkSelectorType(selector),
      manifestId,
      targetManifestId,
    };

    if (action in COMMANDS && variantInfo.selectorType === 'fragment') {
      variants[vn].fragments.push({
        selector: normalizePath(variantInfo.selector),
        val: normalizePath(line[vn]),
        action,
        manifestId,
        targetManifestId,
      });
    } else if (GLOBAL_CMDS.includes(action)) {
      variants[vn][action] = variants[vn][action] || [];

      if (action === 'useblockcode') {
        const { blockSelector, blockTarget } = getBlockProps(line[vn]);
        variants[vn][action].push({
          selector: blockSelector,
          val: blockTarget,
          pageFilter,
          manifestId,
          targetManifestId,
        });
      } else {
        variants[vn][action].push({
          selector: normalizePath(selector),
          modifier,
          val: normalizePath(line[vn]),
          pageFilter,
          manifestId,
          targetManifestId,
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

export function parseManifestVariants(data, manifestPath, manifestOverrideName) {
  if (!data?.length) return null;

  const manifestConfig = {};
  const experiences = data.map((d) => normalizeKeys(d));

  try {
    const variants = {};
    const variantNames = Object.keys(experiences[0])
      .filter((vn) => !MANIFEST_KEYS.includes(vn));

    variantNames.forEach((vn) => {
      variants[vn] = { commands: [], fragments: [] };
    });

    experiences.forEach((line) => {
      getVariantInfo(line, variantNames, variants, manifestPath, manifestOverrideName);
    });

    manifestConfig.variants = variants;
    manifestConfig.variantNames = variantNames;
    const config = getConfig();
    if (!config.mep?.preview) manifestConfig.manifestId = false;

    return manifestConfig;
  } catch (e) {
    /* c8 ignore next 3 */
    console.log('error parsing personalization manifestConfig:', e, experiences);
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
  if (config.mep?.variantOverride?.[manifestPath]) {
    return config.mep.variantOverride[manifestPath];
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

const createDefaultExperiment = (manifest) => ({
  disabled: manifest.disabled,
  event: manifest.event,
  manifest: manifest.manifestPath,
  executionOrder: '1-1',
  selectedVariant: { commands: [], fragments: [] },
  selectedVariantName: 'default',
  variantNames: ['all'],
  variants: {},
});

export const addMepAnalytics = (config, header) => {
  config.mep.experiments.forEach((experiment) => {
    experiment?.selectedVariant?.useblockcode?.forEach(({ selector, targetManifestId }) => {
      if (selector && targetManifestId) {
        document.querySelectorAll(`.${selector}`)
          .forEach((el) => (el.dataset.adobeTargetTestid = targetManifestId));
      }
    });
    if (header) {
      experiment?.selectedVariant?.updatemetadata?.forEach((updateMetaData) => {
        if (updateMetaData?.selector === 'gnav-source' && updateMetaData.targetManifestId) {
          header.dataset.adobeTargetTestid = updateMetaData.targetManifestId;
        }
      });
    }
  });
};
export async function getManifestConfig(info, variantOverride = false) {
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
  if (disabled && (!variantOverride || !Object.keys(variantOverride).length)) {
    return createDefaultExperiment(info);
  }
  let data = manifestData;
  if (!data) {
    const fetchedData = await fetchData(manifestPath, DATA_TYPE.JSON);
    if (fetchData) data = fetchedData;
  }

  const persData = data?.experiences?.data || data?.data || data;
  if (!persData) return null;
  const infoTab = manifestInfo || data?.info?.data;
  const infoObj = infoTab?.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
  const manifestOverrideName = name || infoObj?.['manifest-override-name']?.toLowerCase();
  const manifestConfig = parseManifestVariants(persData, manifestPath, manifestOverrideName);

  if (!manifestConfig) {
    /* c8 ignore next 3 */
    console.log('Error loading personalization manifestConfig: ', name || manifestPath);
    return null;
  }
  const infoKeyMap = {
    'manifest-type': ['Personalization', 'Promo', 'Test'],
    'manifest-execution-order': ['First', 'Normal', 'Last'],
  };
  if (infoTab) {
    manifestConfig.manifestOverrideName = manifestOverrideName;
    manifestConfig.manifestType = infoObj?.['manifest-type']?.toLowerCase();
    const executionOrder = {
      'manifest-type': 1,
      'manifest-execution-order': 1,
    };
    Object.keys(infoObj).forEach((key) => {
      if (!infoKeyMap[key]) return;
      const index = infoKeyMap[key].indexOf(infoObj[key]);
      executionOrder[key] = index > -1 ? index : 1;
    });
    manifestConfig.executionOrder = `${executionOrder['manifest-execution-order']}-${executionOrder['manifest-type']}`;
  } else {
    // eslint-disable-next-line prefer-destructuring
    manifestConfig.manifestType = infoKeyMap['manifest-type'][1];
    manifestConfig.executionOrder = '1-1';
  }

  manifestConfig.manifestPath = normalizePath(manifestPath);
  const selectedVariantName = await getPersonalizationVariant(
    manifestConfig.manifestPath,
    manifestConfig.variantNames,
    variantLabel,
  );

  if (selectedVariantName && manifestConfig.variantNames.includes(selectedVariantName)) {
    manifestConfig.run = true;
    manifestConfig.selectedVariantName = selectedVariantName;
    manifestConfig.selectedVariant = manifestConfig.variants[selectedVariantName];
  } else {
    /* c8 ignore next 2 */
    manifestConfig.selectedVariantName = 'default';
    manifestConfig.selectedVariant = 'default';
  }
  const placeholders = manifestPlaceholders || data?.placeholders?.data;
  if (placeholders) {
    updateConfig(
      parsePlaceholders(placeholders, getConfig(), manifestConfig.selectedVariantName),
    );
  }

  manifestConfig.name = name;
  manifestConfig.manifest = manifestPath;
  manifestConfig.manifestUrl = manifestUrl;
  manifestConfig.disabled = disabled;
  manifestConfig.event = event;
  return manifestConfig;
}

export const deleteMarkedEls = (rootEl = document) => {
  [...rootEl.querySelectorAll(`.${CLASS_EL_DELETE}`)]
    .forEach((el) => el.remove());
};

const normalizeFragPaths = ({ selector, val, action, manifestId, targetManifestId }) => ({
  selector: normalizePath(selector),
  val: normalizePath(val),
  action,
  manifestId,
  targetManifestId,
});
export async function categorizeActions(experiment, config) {
  if (!experiment) return null;
  const { manifestPath, selectedVariant } = experiment;
  if (!selectedVariant || selectedVariant === 'default') return { experiment };

  // only one replacepage can be defined
  const { replacepage } = selectedVariant;
  // eslint-disable-next-line prefer-destructuring
  if (selectedVariant.replacepage?.length) config.mep.replacepage = replacepage[0];

  selectedVariant.insertscript?.map((script) => loadScript(script.val));
  selectedVariant.updatemetadata?.map((metadata) => setMetadata(metadata));

  selectedVariant.fragments &&= selectedVariant.fragments.map(normalizeFragPaths);

  return {
    manifestPath,
    experiment,
    blocks: selectedVariant.useblockcode,
    fragments: selectedVariant.fragments,
    commands: selectedVariant.commands,
  };
}

function parseMepParam(mepParam) {
  if (!mepParam) return false;
  const mepObject = Object.create(null);
  const decodedParam = decodeURIComponent(mepParam);
  decodedParam.split('---').forEach((item) => {
    const pair = item.trim().split('--');
    if (pair.length > 1) {
      const [manifestPath, selectedVariant] = pair;
      mepObject[manifestPath] = selectedVariant;
    }
  });

  return mepObject;
}

function compareExecutionOrder(a, b) {
  if (a.executionOrder === b.executionOrder) return 0;
  return a.executionOrder > b.executionOrder ? 1 : -1;
}

export function cleanAndSortManifestList(manifests) {
  const config = getConfig();
  const manifestObj = {};
  let allManifests = manifests;
  if (config.mep?.experiments) allManifests = [...manifests, ...config.mep.experiments];
  allManifests.forEach((manifest) => {
    try {
      if (!manifest?.manifest) return;
      if (!manifest.manifestPath) manifest.manifestPath = normalizePath(manifest.manifest);
      if (manifest.manifestPath in manifestObj) {
        let fullManifest = manifestObj[manifest.manifestPath];
        let freshManifest = manifest;
        if (manifest.name) {
          fullManifest = manifest;
          freshManifest = manifestObj[manifest.manifestPath];
        }
        freshManifest.name = fullManifest.name;
        freshManifest.selectedVariantName = fullManifest.selectedVariantName;
        freshManifest.selectedVariant = freshManifest.variants[freshManifest.selectedVariantName];
        manifestObj[manifest.manifestPath] = freshManifest;
      } else {
        manifestObj[manifest.manifestPath] = manifest;
      }
    } catch (e) {
      console.warn(e);
      window.lana?.log(`MEP Error parsing manifests: ${e.toString()}`);
    }
  });
  Object.keys(manifestObj).forEach((key) => {
    delete manifestObj[key].variants;
  });
  return Object.values(manifestObj).sort(compareExecutionOrder);
}

export function handleFragmentCommand(command, a) {
  const { action, fragment, manifestId, targetManifestId } = command;
  if (action === COMMANDS_KEYS.replace) {
    a.href = fragment;
    if (manifestId) a.dataset.manifestId = manifestId;
    if (targetManifestId) a.dataset.adobeTargetTestid = targetManifestId;
    return fragment;
  }
  if (action === COMMANDS_KEYS.remove) {
    if (manifestId) {
      a.parentElement.dataset.removedManifestId = manifestId;
    } else {
      a.parentElement.remove();
    }
  }
  return false;
}

export async function applyPers(manifests, postLCP = false) {
  if (!manifests?.length) return;
  let experiments = manifests;
  const config = getConfig();
  for (let i = 0; i < experiments.length; i += 1) {
    experiments[i] = await getManifestConfig(experiments[i], config.mep?.variantOverride);
  }

  experiments = cleanAndSortManifestList(experiments);

  let results = [];

  for (const experiment of experiments) {
    const result = await categorizeActions(experiment, config);
    if (result) results.push(result);
  }
  results = results.filter(Boolean);

  config.mep.experiments = [...config.mep.experiments, ...experiments];
  config.mep.blocks = consolidateObjects(results, 'blocks', config.mep.blocks);
  config.mep.fragments = consolidateObjects(results, 'fragments', config.mep.fragments);
  config.mep.commands = consolidateArray(results, 'commands', config.mep.commands);

  const main = document.querySelector('main');
  if (config.mep.replacepage && !postLCP && main) {
    await replaceInner(config.mep.replacepage.val, main);
    const { manifestId, targetManifestId } = config.mep.replacepage;
    if (manifestId) main.dataset.manifestId = manifestId;
    if (targetManifestId) main.dataset.adobeTargetTestid = targetManifestId;
  }

  if (!postLCP) handleCommands(config.mep.commands);
  deleteMarkedEls();

  const pznList = results.filter((r) => (r.experiment?.manifestType === TRACKED_MANIFEST_TYPE));
  if (!pznList.length) return;

  const pznVariants = pznList.map((r) => {
    const val = r.experiment.selectedVariantName.replace(TARGET_EXP_PREFIX, '').trim().slice(0, 15);
    return val === 'default' ? 'nopzn' : val;
  });
  const pznManifests = pznList.map((r) => {
    const val = r.experiment?.manifestOverrideName || r.experiment?.manifest;
    return getFileName(val).replace('.json', '').trim().slice(0, 15);
  });
  config.mep.martech = `|${pznVariants.join('--')}|${pznManifests.join('--')}`;
}

export const combineMepSources = async (persEnabled, promoEnabled, mepParam) => {
  let persManifests = [];

  if (persEnabled) {
    persManifests = persEnabled.toLowerCase()
      .split(/,|(\s+)|(\\n)/g)
      .filter((path) => path?.trim())
      .map((manifestPath) => ({ manifestPath }));
  }

  if (promoEnabled) {
    const { default: getPromoManifests } = await import('./promo-utils.js');
    persManifests = persManifests.concat(getPromoManifests(promoEnabled, PAGE_URL.searchParams));
  }

  if (mepParam && mepParam !== 'off') {
    const persManifestPaths = persManifests.map((manifest) => {
      const { manifestPath } = manifest;
      if (manifestPath.startsWith('/')) return manifestPath;
      try {
        const url = new URL(manifestPath);
        return url.pathname;
      } catch (e) {
        return manifestPath;
      }
    });

    mepParam.split('---').forEach((manifestPair) => {
      const manifestPath = manifestPair.trim().toLowerCase().split('--')[0];
      if (!persManifestPaths.includes(manifestPath)) {
        persManifests.push({ manifestPath });
      }
    });
  }
  return persManifests;
};

export async function init(enablements = {}) {
  let manifests = [];
  const {
    mepParam, mepHighlight, mepButton, pzn, promo, target, postLCP,
  } = enablements;
  const config = getConfig();
  if (!postLCP) {
    config.mep = {
      handleFragmentCommand,
      updateFragDataProps,
      preview: (mepButton !== 'off'
        && (config.env?.name !== 'prod' || mepParam || mepParam === '' || mepButton)),
      variantOverride: parseMepParam(mepParam),
      highlight: (mepHighlight !== undefined && mepHighlight !== 'false'),
      targetEnabled: target,
      experiments: [],
    };
    manifests = manifests.concat(await combineMepSources(pzn, promo, mepParam));
    manifests?.forEach((manifest) => {
      if (manifest.disabled) return;
      const normalizedURL = normalizePath(manifest.manifestPath);
      loadLink(normalizedURL, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
    });
  }

  if (target === true || (target === 'gnav' && postLCP)) {
    const { getTargetPersonalization } = await import('../../martech/martech.js');
    const { targetManifests, targetPropositions } = await getTargetPersonalization();
    manifests = manifests.concat(targetManifests);
    if (targetPropositions?.length && window._satellite) {
      window._satellite.track('propositionDisplay', targetPropositions);
    }
  }
  try {
    await applyPers(manifests, postLCP);
  } catch (e) {
    console.warn(e);
    window.lana?.log(`MEP Error: ${e.toString()}`);
  }
}
