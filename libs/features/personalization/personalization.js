/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import { createTag, getConfig, loadLink, loadScript, localizeLink } from '../../utils/utils.js';
import { getEntitlementMap } from './entitlements.js';

/* c8 ignore start */
const PHONE_SIZE = window.screen.width < 550 || window.screen.height < 550;
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
const FLAGS = {
  all: 'all',
  includeFragments: 'include-fragments',
};

export const TRACKED_MANIFEST_TYPE = 'personalization';

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

const GLOBAL_CMDS = [
  'insertscript',
  'replacepage',
  'updatemetadata',
  'useblockcode',
];

const CREATE_CMDS = {
  insertafter: 'afterend',
  insertbefore: 'beforebegin',
  prepend: 'afterbegin',
  append: 'beforeend',
};

const COMMANDS_KEYS = {
  remove: 'remove',
  replace: 'replace',
};

function addIds(el, manifestId, targetManifestId) {
  if (manifestId) el.dataset.manifestId = manifestId;
  if (targetManifestId) el.dataset.adobeTargetTestid = targetManifestId;
}

function getSelectorType(selector) {
  const sel = selector.toLowerCase().trim();
  if (sel.startsWith('/') || sel.startsWith('http')) return 'fragment';
  return 'other';
}

const getUpdatedHref = (el, content, action) => {
  const href = el.getAttribute('href');
  if (action === 'insertafter' || action === 'append') return `${href}${content}`;
  if (action === 'insertbefore' || action === 'prepend') return `${content}${href}`;
  return content;
};

const createFrag = (el, action, content, manifestId, targetManifestId) => {
  if (action === 'replace') el.classList.add(CLASS_EL_DELETE, CLASS_EL_REPLACE);
  let href = content;
  try {
    const { pathname, search, hash } = new URL(content);
    href = `${pathname}${search}${hash}`;
  } catch {
    // ignore
  }
  const a = createTag('a', { href }, content);
  addIds(a, manifestId, targetManifestId);
  const frag = createTag('p', undefined, a);
  const isDelayedModalAnchor = /#.*delay=/.test(href);
  if (isDelayedModalAnchor) frag.classList.add('hide-block');
  if (isInLcpSection(el)) {
    loadLink(`${localizeLink(a.href)}.plain.html`, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
  }
  return frag;
};

export function replacePlaceholders(value, placeholders) {
  let val = value;
  const matches = val.match(/{{(.*?)}}/g);
  if (!matches) return val;
  matches.forEach((match) => {
    const key = match.replace(/{{|}}/g, '').trim();
    if (placeholders?.[key]) val = val.replace(match, placeholders[key]);
  });
  return val;
}

export const createContent = (el, { content, manifestId, targetManifestId, action, modifiers }) => {
  if (action === 'replace') {
    addIds(el, manifestId, targetManifestId);
  }
  if (el?.nodeName === 'A' && modifiers?.includes('href')) {
    el.setAttribute('href', getUpdatedHref(el, content, action));
    addIds(el, manifestId, targetManifestId);
    return el;
  }
  if (getSelectorType(content) !== 'fragment') {
    const config = getConfig();
    const newContent = replacePlaceholders(content, config.placeholders);

    if (action === 'replace') {
      el.innerHTML = newContent;

      return el;
    }

    const container = createTag('div', {}, newContent);
    addIds(container, manifestId, targetManifestId);
    return container;
  }

  const frag = createFrag(el, action, content, manifestId, targetManifestId);
  addIds(frag, manifestId, targetManifestId);
  if (el?.parentElement.nodeName !== 'MAIN') return frag;
  return createTag('div', undefined, frag);
};

const COMMANDS = {
  [COMMANDS_KEYS.remove]: (el, { content, manifestId }) => {
    if (content === 'false') return;
    if (manifestId) {
      el.dataset.removedManifestId = manifestId;
      return;
    }
    el.classList.add(CLASS_EL_DELETE);
  },
  [COMMANDS_KEYS.replace]: (el, cmd) => {
    if (!el || el.classList.contains(CLASS_EL_REPLACE)) return;
    el.insertAdjacentElement(
      'beforebegin',
      createContent(el, cmd),
    );
  },
};

const log = (...msg) => {
  const config = getConfig();
  if (config.mep?.preview) console.log(...msg);
};

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
    log(`Error loading content: ${url}`, e.message || e);
  }
  return null;
};

const getBlockProps = (fVal, miloLibs, origin) => {
  let val = fVal;
  if (val?.includes('\\')) val = val?.split('\\').join('/');
  if (!val?.startsWith('/')) val = `/${val}`;
  const blockSelector = val?.split('/').pop();

  if (val.startsWith('/libs/')) {
    /* c8 ignore next 1 */
    val = `${miloLibs}${val.replace('/libs', '')}`;
  } else {
    val = `${origin}${val}`;
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
    metaEl = createTag('meta', { [propName]: selector });
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

function registerInBlockActions(command) {
  const blockAndSelector = command.selector.substring(IN_BLOCK_SELECTOR_PREFIX.length)
    .trim().split(/\s+/);
  const [blockName] = blockAndSelector;

  const config = getConfig();
  config.mep.inBlock ??= {};
  config.mep.inBlock[blockName] ??= {};

  let blockSelector;
  if (blockAndSelector.length === 1) delete command.selector;
  if (blockAndSelector.length > 1) {
    blockSelector = blockAndSelector.slice(1).join(' ');
    command.selector = blockSelector;
    if (getSelectorType(blockSelector) === 'fragment') {
      config.mep.inBlock[blockName].fragments ??= {};
      const { fragments } = config.mep.inBlock[blockName];
      delete command.selector;
      if (blockSelector in fragments) return;

      // eslint-disable-next-line no-restricted-syntax
      for (const key in fragments) {
        if (fragments[key].content === blockSelector) fragments[key] = command;
      }
      fragments[blockSelector] = command;

      blockSelector = normalizePath(blockSelector);
      // eslint-disable-next-line no-restricted-syntax
      for (const key in fragments) {
        if (fragments[key].content === blockSelector) fragments[key] = command;
      }
      fragments[blockSelector] = command;
      return;
    }
  }
  config.mep.inBlock[blockName].commands ??= [];
  config.mep.inBlock[blockName].commands.push(command);
}

const updateEndNumber = (endNumber, term) => (endNumber
  ? term.replace(endNumber, `:nth-child(${endNumber})`)
  : term);
function modifySelectorTerm(termParam) {
  let term = termParam;
  const specificSelectors = {
    section: 'main > div',
    'primary-cta': 'strong a',
    'secondary-cta': 'em a',
    'action-area': '*:has(> em a, > strong a)',
    'any-marquee-section': 'main > div:has([class*="marquee"])',
    'any-marquee': '[class*="marquee"]',
    'any-header': ':is(h1, h2, h3, h4, h5, h6)',
  };
  const otherSelectors = ['row', 'col'];
  const htmlEls = [
    'html', 'body', 'header', 'footer', 'main',
    'div', 'a', 'p', 'strong', 'em', 'picture', 'source', 'img', 'h',
    'ul', 'ol', 'li',
  ];
  const startTextMatch = term.match(/^[a-zA-Z/./-]*/);
  const startText = startTextMatch ? startTextMatch[0].toLowerCase() : '';
  const startTextPart1 = startText.split(/\.|:/)[0];
  const endNumberMatch = term.match(/[0-9]*$/);
  const endNumber = endNumberMatch && startText.match(/^[a-zA-Z]/) ? endNumberMatch[0] : '';
  if (!startText || htmlEls.includes(startText)) return term;
  if (otherSelectors.includes(startText)) {
    term = term.replace(startText, '> div');
    term = updateEndNumber(endNumber, term);
    return term;
  }
  if (Object.keys(specificSelectors).includes(startTextPart1)) {
    term = term.replace(startTextPart1, specificSelectors[startTextPart1]);
    term = updateEndNumber(endNumber, term);
    return term;
  }

  if (!startText.startsWith('.')) term = `.${term}`;
  if (endNumber) {
    term = term.replace(endNumber, '');
    term = `${term}:nth-child(${endNumber} of ${term})`;
  }
  return term;
}
function getModifiers(selector) {
  let sel = selector;
  const modifiers = [];
  const flags = sel.split(/\s+#_/);
  if (flags.length) {
    sel = flags.shift();
    flags.forEach((flag) => {
      flag.split(/_|#_/).forEach((mod) => modifiers.push(mod.toLowerCase().trim()));
    });
  }
  return { sel, modifiers };
}
export function modifyNonFragmentSelector(selector) {
  const { sel, modifiers } = getModifiers(selector);
  return {
    modifiedSelector: sel
      .split('>').join(' > ')
      .split(',').join(' , ')
      .replaceAll(/main\s*>?\s*(section\d*)/gi, '$1')
      .split(/\s+/)
      .map(modifySelectorTerm)
      .join(' ')
      .trim(),
    modifiers,
  };
}

function getSelectedElements(sel, rootEl, forceRootEl) {
  const root = forceRootEl ? rootEl : document;
  const selector = sel.trim();
  if (!selector) return {};

  if (getSelectorType(selector) === 'fragment') {
    try {
      const fragments = root.querySelectorAll(
        `a[href*="${normalizePath(selector, false)}"], a[href*="${normalizePath(selector, true)}"]`,
      );
      return { els: fragments, modifiers: [FLAGS.all, FLAGS.includeFragments] };
    } catch (e) {
      /* c8 ignore next */
      return { els: [], modifiers: [] };
    }
  }
  const { modifiedSelector, modifiers } = modifyNonFragmentSelector(selector);
  let els;
  try {
    els = root.querySelectorAll(modifiedSelector);
  } catch (e) {
  /* eslint-disable-next-line no-console */
    log('Invalid selector: ', selector);
    return null;
  }
  if (modifiers.includes(FLAGS.all) || !els.length) return { els, modifiers };
  els = [els[0]];
  return { els, modifiers };
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
    addIds(fragment, manifestId, adobeTargetTestid);
  }
};

export function handleCommands(commands, rootEl, forceInline = false, forceRootEl = false) {
  commands.forEach((cmd) => {
    const { action, content, selector } = cmd;
    cmd.content = forceInline ? addHash(content, INLINE_HASH) : content;
    if (selector.startsWith(IN_BLOCK_SELECTOR_PREFIX)) {
      registerInBlockActions(cmd);
      cmd.selectorType = IN_BLOCK_SELECTOR_PREFIX;
      return;
    }
    const { els, modifiers } = getSelectedElements(selector, rootEl, forceRootEl);
    cmd.modifiers = modifiers;

    els?.forEach((el) => {
      if (!el || (!(action in COMMANDS) && !(action in CREATE_CMDS))
        || (rootEl && !rootEl.contains(el))) return;

      if (action in COMMANDS) {
        COMMANDS[action](el, cmd);
        return;
      }
      const insertAnchor = getSelectorType(selector) === 'fragment' ? el.parentElement : el;
      insertAnchor?.insertAdjacentElement(
        CREATE_CMDS[action],
        createContent(el, cmd),
      );
    });
    if ((els.length && !cmd.modifiers.includes(FLAGS.all))
      || !cmd.modifiers.includes(FLAGS.includeFragments)) {
      cmd.completed = true;
    }
  });
  return commands.filter((cmd) => !cmd.completed
    && cmd.selectorType !== IN_BLOCK_SELECTOR_PREFIX);
}

const getVariantInfo = (line, variantNames, variants, manifestPath, fTargetId) => {
  const config = getConfig();
  let manifestId = getFileName(manifestPath);
  let targetId = manifestId.replace('.json', '');
  if (fTargetId) targetId = fTargetId;
  if (!config.mep?.preview) manifestId = false;
  // retro support
  const action = line.action?.toLowerCase()
    .replace('content', '').replace('fragment', '').replace('tosection', '');
  if (!action) {
    log('Row found with empty action field: ', line);
    return;
  }
  const pageFilter = line['page filter'] || line['page filter optional'];
  const { selector } = line;

  if (pageFilter && !matchGlob(pageFilter, new URL(window.location).pathname)) return;

  if (!config.mep?.preview) manifestId = false;
  const { origin } = PAGE_URL;
  variantNames.forEach((vn) => {
    const targetManifestId = vn.startsWith(TARGET_EXP_PREFIX) ? targetId : false;
    if (!line[vn] || line[vn].toLowerCase() === 'false') return;

    const variantInfo = {
      action,
      selector,
      pageFilter,
      content: line[vn],
      selectorType: getSelectorType(selector),
      manifestId,
      targetManifestId,
    };

    if (action in COMMANDS && variantInfo.selectorType === 'fragment') {
      variants[vn].fragments.push({
        selector: normalizePath(variantInfo.selector.split(' #_')[0]),
        val: normalizePath(line[vn]),
        action,
        manifestId,
        targetManifestId,
      });
    } else if (GLOBAL_CMDS.includes(action)) {
      variants[vn][action] = variants[vn][action] || [];

      if (action === 'useblockcode') {
        const { blockSelector, blockTarget } = getBlockProps(line[vn], config.miloLibs, origin);
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
          val: normalizePath(line[vn]),
          pageFilter,
          manifestId,
          targetManifestId,
        });
      }
    } else if (action in COMMANDS || action in CREATE_CMDS) {
      variants[vn].commands.push(variantInfo);
    }
  });
};

export function parseManifestVariants(data, manifestPath, targetId) {
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
      getVariantInfo(line, variantNames, variants, manifestPath, targetId);
    });

    manifestConfig.variants = variants;
    manifestConfig.variantNames = variantNames;
    const config = getConfig();
    if (!config.mep?.preview) manifestConfig.manifestId = false;

    return manifestConfig;
  } catch (e) {
    /* c8 ignore next 3 */
    log('error parsing personalization manifestConfig:', e, experiences);
  }
  return null;
}

export async function createMartechMetadata(placeholders, config, column) {
  if (config.locale.ietf === 'en-US') return;

  await import('../../martech/attributes.js').then(({ processTrackingLabels }) => {
    config.mep.analyticLocalization ??= {};

    placeholders.forEach((item, i) => {
      const firstRow = placeholders[i];
      let usValue = firstRow['en-us'] || firstRow.us || firstRow.en || firstRow.key;

      if (!usValue) return;

      usValue = processTrackingLabels(usValue);
      const translatedValue = processTrackingLabels(item[column]);
      config.mep.analyticLocalization[translatedValue] = usValue;
    });
  });
}

/* c8 ignore start */
export function parsePlaceholders(placeholders, config, selectedVariantName = '') {
  if (!placeholders?.length || selectedVariantName === 'default') return config;
  const valueNames = [
    selectedVariantName.toLowerCase(),
    config.mep?.geoPrefix,
    config.locale.region.toLowerCase(),
    config.locale.ietf.toLowerCase(),
    ...config.locale.ietf.toLowerCase().split('-'),
    'value',
    'other',
  ];
  const keys = placeholders?.length ? Object.entries(placeholders[0]) : [];
  const keyVal = keys.find(([key]) => valueNames.includes(key.toLowerCase()));
  const key = keyVal?.[0];

  if (key) {
    const results = placeholders.reduce((res, item) => {
      res[item.key] = item[key];
      return res;
    }, {});
    config.placeholders = { ...(config.placeholders || {}), ...results };
  }

  createMartechMetadata(placeholders, config, key);

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

function trimNames(arr) {
  return arr.map((v) => v.trim()).filter(Boolean);
}
export function buildVariantInfo(variantNames) {
  return variantNames.reduce((acc, name) => {
    let nameArr = [name];
    if (!name.startsWith(TARGET_EXP_PREFIX)) nameArr = name.split(',');
    acc[name] = trimNames(nameArr);
    acc.allNames = [...acc.allNames, ...trimNames(name.split(/[,&]|\bnot\b/))];
    return acc;
  }, { allNames: [] });
}

async function getPersonalizationVariant(manifestPath, variantNames = [], variantLabel = null) {
  const config = getConfig();
  if (config.mep?.variantOverride?.[manifestPath]) {
    return config.mep.variantOverride[manifestPath];
  }

  const variantInfo = buildVariantInfo(variantNames);

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
export async function getManifestConfig(info = {}, variantOverride = false) {
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
  const manifestOverrideName = infoObj?.['manifest-override-name']?.toLowerCase();
  const targetId = name || manifestOverrideName;
  const manifestConfig = parseManifestVariants(persData, manifestPath, targetId);

  if (!manifestConfig) {
    /* c8 ignore next 3 */
    log('Error loading personalization manifestConfig: ', name || manifestPath);
    return null;
  }
  const infoKeyMap = {
    'manifest-type': ['Personalization', 'Promo', 'Test'],
    'manifest-execution-order': ['First', 'Normal', 'Last'],
  };
  if (infoTab) {
    manifestConfig.manifestType = infoObj?.['manifest-type']?.toLowerCase();
    if (manifestOverrideName && manifestConfig.manifestType === TRACKED_MANIFEST_TYPE) {
      manifestConfig.manifestOverrideName = manifestOverrideName;
    }
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
  manifestConfig.selectedVariantName = await getPersonalizationVariant(
    manifestConfig.manifestPath,
    manifestConfig.variantNames,
    variantLabel,
  );

  manifestConfig.placeholderData = manifestPlaceholders || data?.placeholders?.data;
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

      const manifestConfig = manifestObj[manifest.manifestPath];
      const { selectedVariantName, variantNames, placeholderData } = manifestConfig;
      if (selectedVariantName && variantNames.includes(selectedVariantName)) {
        manifestConfig.run = true;
        manifestConfig.selectedVariantName = selectedVariantName;
        manifestConfig.selectedVariant = manifestConfig.variants[selectedVariantName];
      } else {
        /* c8 ignore next 2 */
        manifestConfig.selectedVariantName = 'default';
        manifestConfig.selectedVariant = 'default';
      }

      parsePlaceholders(placeholderData, getConfig(), manifestConfig.selectedVariantName);
    } catch (e) {
      log(`MEP Error parsing manifests: ${e.toString()}`);
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
    addIds(a, manifestId, targetManifestId);
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

export function parseNestedPlaceholders({ placeholders }) {
  if (!placeholders) return;
  Object.entries(placeholders).forEach(([key, value]) => {
    placeholders[key] = replacePlaceholders(value, placeholders);
  });
}

export async function applyPers(manifests, postLCP = false) {
  if (!manifests?.length) return;
  let experiments = manifests;
  const config = getConfig();
  for (let i = 0; i < experiments.length; i += 1) {
    experiments[i] = await getManifestConfig(experiments[i], config.mep?.variantOverride);
  }

  experiments = cleanAndSortManifestList(experiments);
  parseNestedPlaceholders(config);

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
    addIds(main, manifestId, targetManifestId);
  }

  if (!postLCP) config.mep.commands = handleCommands(config.mep.commands);
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
      updateFragDataProps,
      preview: (mepButton !== 'off'
        && (config.env?.name !== 'prod' || mepParam || mepParam === '' || mepButton)),
      variantOverride: parseMepParam(mepParam),
      highlight: (mepHighlight !== undefined && mepHighlight !== 'false'),
      targetEnabled: target,
      experiments: [],
      geoPrefix: config.locale?.prefix.split('/')[1]?.toLowerCase() || 'en-us',
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
    log(`MEP Error: ${e.toString()}`);
    window.lana?.log(`MEP Error: ${e.toString()}`);
  }
}
