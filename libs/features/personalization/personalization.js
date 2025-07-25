/* eslint-disable default-param-last */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

import {
  createTag,
  getConfig,
  loadLink,
  loadScript,
  localizeLink,
  getFederatedUrl,
  isSignedOut,
} from '../../utils/utils.js';

/* c8 ignore start */
const PHONE_SIZE = window.screen.width < 550 || window.screen.height < 550;
const safariIpad = navigator.userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1;
const isGalaxyTab = navigator.userAgent.includes('Linux') && navigator.maxTouchPoints > 1;
export const US_GEO = 'en-us';
export const PERSONALIZATION_TAGS = {
  all: () => true,
  chrome: () => navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg'),
  firefox: () => navigator.userAgent.includes('Firefox'),
  safari: () => navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome'),
  edge: () => navigator.userAgent.includes('Edg'),
  android: () => navigator.userAgent.includes('Android') || isGalaxyTab,
  ios: () => /iPad|iPhone|iPod/.test(navigator.userAgent) || safariIpad,
  windows: () => navigator.userAgent.includes('Windows'),
  mac: () => navigator.userAgent.includes('Macintosh') && !safariIpad,
  'mobile-device': () => safariIpad
    || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Touch/i
      .test(navigator.userAgent) || isGalaxyTab,
  phone: () => PERSONALIZATION_TAGS['mobile-device']() && PHONE_SIZE,
  tablet: () => PERSONALIZATION_TAGS['mobile-device']() && !PHONE_SIZE,
  desktop: () => !PERSONALIZATION_TAGS['mobile-device'](),
  loggedout: () => isSignedOut(),
  loggedin: () => !isSignedOut(),
};
const PERSONALIZATION_KEYS = Object.keys(PERSONALIZATION_TAGS);
/* c8 ignore stop */

const CLASS_EL_DELETE = 'p13n-deleted';
const CLASS_EL_REPLACE = 'p13n-replaced';
const COLUMN_NOT_OPERATOR = 'not ';
const TARGET_EXP_PREFIX = 'target-';
const INLINE_HASH = '_inline';
const MARTECH_RETURNED_EVENT = 'martechReturned';
const PAGE_URL = new URL(window.location.href);
const FLAGS = {
  all: 'all',
  includeFragments: 'include-fragments',
};
let isPostLCP = false;

export const TRACKED_MANIFEST_TYPE = 'personalization';

// Replace any non-alpha chars except comma, space, ampersand, colon, and hyphen
const RE_KEY_REPLACE = /[^a-z0-9\- _,&=:]/g;

const MANIFEST_KEYS = [
  'action',
  'selector',
  'pagefilter',
  'page filter',
  'page filter optional',
];

export const DATA_TYPE = {
  JSON: 'json',
  TEXT: 'text',
};

const IN_BLOCK_SELECTOR_PREFIX = 'in-block:';

const isDamContent = (path) => path?.includes('/content/dam/');

export const normalizePath = (p, localize = true) => {
  let path = p;

  if (isDamContent(path) || !path?.includes('/')) return path;

  if (path.includes('/federal/')) return getFederatedUrl(path);

  const config = getConfig();
  if (!path.startsWith(config.codeRoot) && !path.startsWith('http') && !path.startsWith('/')) {
    path = `/${path}`;
  }

  try {
    const url = new URL(path);
    const { hash, pathname } = url;
    const firstFolder = pathname.split('/')[1];
    const mepHash = '#_dnt';

    if (path.startsWith(config.codeRoot)
      || path.includes('.hlx.')
      || path.includes('.aem.')
      || path.includes('.adobe.')
      || path.includes('localhost:')) {
      if (!localize
        || config.locale.ietf === 'en-US'
        || hash.includes(mepHash)
        || firstFolder in config.locales
        || path.includes('.json')) {
        path = pathname;
      } else {
        path = `${config.locale.prefix}${pathname}`;
      }
    }
    return `${path}${hash.replace(mepHash, '')}`;
  } catch (e) {
    return path;
  }
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
  updateAttribute: 'updateattribute',
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

export function replacePlaceholders(value, ph) {
  const placeholders = ph || getConfig().placeholders;
  if (!placeholders) return value;
  let val = value;
  const matches = val.match(/{{(.*?)}}/g);
  if (!matches) return val;
  matches.forEach((match) => {
    const key = match.replace(/{{|}}/g, '').trim();
    if (placeholders[key]) val = val.replace(match, placeholders[key]);
  });
  return val;
}

const getUpdatedHref = (el, content, action) => {
  const href = el.getAttribute('href');
  const newContent = replacePlaceholders(content);
  if (action === 'insertafter' || action === 'append') return `${href}${newContent}`;
  if (action === 'insertbefore' || action === 'prepend') return `${newContent}${href}`;
  return newContent;
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
  const noParagraphWrap = !!el?.parentElement?.closest('p')
    || (el.nodeName === 'P' && action.includes('pend'));
  const frag = noParagraphWrap ? a : createTag('p', undefined, a);
  const isDelayedModalAnchor = /#.*delay=/.test(href);
  if (isDelayedModalAnchor) frag.classList.add('hide-block');
  if (isInLcpSection(el)) {
    loadLink(`${localizeLink(a.href)}.plain.html`, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
  }
  return frag;
};

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
    const newContent = replacePlaceholders(content);

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
  [COMMANDS_KEYS.remove]: (el, { content }) => {
    if (content !== 'false') el.classList.add(CLASS_EL_DELETE);
  },
  [COMMANDS_KEYS.replace]: (el, cmd) => {
    if (!el || el.classList.contains(CLASS_EL_REPLACE)) return;
    el.insertAdjacentElement(
      'beforebegin',
      createContent(el, cmd),
    );
  },
  [COMMANDS_KEYS.updateAttribute]: (el, cmd) => {
    const { manifestId, targetManifestId } = cmd;
    if (!cmd.attribute || !cmd.content) return;
    const [attribute, parameter] = cmd.attribute.split('_');
    cmd.content = replacePlaceholders(cmd.content);

    let value;
    if (attribute === 'href' && parameter) {
      const href = el.getAttribute('href');
      switch (parameter) {
        case '#': el.href += el.href.includes(cmd.content) ? '' : cmd.content; break;
        default:
          try {
            const url = new URL(href);
            const parameters = new URLSearchParams(url.search);
            parameters.set(parameter, cmd.content);
            url.search = parameters.toString();
            value = url.toString();
          } catch (error) {
            /* c8 ignore next 2 */
            console.log(`Invalid updateAttribute URL: ${href}`, error.message || error);
          }
      }
    } else {
      value = cmd.content;
    }

    if (value) {
      el.setAttribute(attribute, value);
      addIds(el, manifestId, targetManifestId);
    }
  },
};

const log = (...msg) => {
  const config = getConfig();
  if (config.mep?.preview) console.log(...msg);
};

export const fetchData = async (url, type = DATA_TYPE.JSON, config) => {
  try {
    const resp = await fetch(normalizePath(url), config);
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

const getBlockProps = (fVal, config, origin) => {
  let val = fVal;
  if (val?.includes('\\')) val = val?.split('\\').join('/');
  if (!val?.startsWith('/')) val = `/${val}`;
  const blockSelector = val?.split('/').pop();

  if (val.startsWith('/libs/')) {
    /* c8 ignore next 1 */
    val = `${config.miloLibs || config.codeRoot}${val.replace('/libs', '')}`;
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
  const modifiedStr = str.toLowerCase();
  if (!modifiedStr.includes('countryip') && !modifiedStr.includes('countrychoice') && !modifiedStr.includes('previouspage')) {
    return modifiedStr.replace(RE_KEY_REPLACE, '');
  }
  return modifiedStr.replace(RE_KEY_REPLACE, (char) => (['(', ')', '/', '*'].includes(char) ? char : ''));
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
    if (blockSelector.startsWith('https://mas.adobe.com/')) {
      const getFragmentId = (masUrl) => {
        const { hash } = new URL(masUrl);
        const hashValue = hash.startsWith('#') ? hash.substring(1) : hash;
        const searchParams = new URLSearchParams(hashValue);
        return searchParams.get('fragment') || searchParams.get('query');
      };
      blockSelector = getFragmentId(blockSelector);
      if (blockSelector) {
        config.mep.inBlock[blockName].fragments ??= {};
        const { fragments } = config.mep.inBlock[blockName];
        command.content = getFragmentId(command.content);
        fragments[blockSelector] = command;
      }
      return;
    }
    if (getSelectorType(blockSelector) === 'fragment') {
      if (blockSelector.includes('/federal/')) blockSelector = getFederatedUrl(blockSelector);
      if (command.content.includes('/federal/')) command.content = getFederatedUrl(command.content);
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
export function modifyNonFragmentSelector(selector, action) {
  const { sel, modifiers } = getModifiers(selector);

  let modifiedSelector = sel
    .split('>').join(' > ')
    .split(',').join(' , ')
    .replaceAll(/main\s*>?\s*(section\d*)/gi, '$1')
    .split(/\s+/)
    .map(modifySelectorTerm)
    .join(' ')
    .trim();

  let attribute;

  if (action === COMMANDS_KEYS.updateAttribute) {
    const string = modifiedSelector.split(' ').pop();
    attribute = string.replace('.', '');
    modifiedSelector = modifiedSelector.replace(string, '').trim();
  }

  return {
    modifiedSelector,
    modifiers,
    attribute,
  };
}

function getSelectedElements(sel, rootEl, forceRootEl, action) {
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
      /* c8 ignore next 2 */
      return { els: [], modifiers: [] };
    }
  }
  const {
    modifiedSelector,
    modifiers,
    attribute,
  } = modifyNonFragmentSelector(selector, action);

  let els;
  try {
    els = root.querySelectorAll(modifiedSelector);
  } catch (e) {
    /* eslint-disable-next-line no-console */
    log('Invalid selector: ', selector);
    return {};
  }
  if (modifiers.includes(FLAGS.all) || !els.length) return { els, modifiers, attribute };
  els = [els[0]];
  return { els, modifiers, attribute };
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

export const deleteMarkedEls = (rootEl = document) => {
  [...rootEl.querySelectorAll(`.${CLASS_EL_DELETE}`)]
    .forEach((el) => el.remove());
};

export function addSectionAnchors(rootEl = document) {
  rootEl.querySelectorAll('.section-metadata').forEach((block) => {
    [...block.children].forEach((row) => {
      const col1 = row.children[0]?.textContent.toLowerCase().trim();
      const col2 = row.children[1]?.textContent.toLowerCase().trim().replaceAll(/\s+/g, '-');
      if (!col1 || !col2 || col1 !== 'anchor') return;
      block.parentElement.setAttribute('id', col2);
    });
  });
}

export function handleCommands(
  commands,
  rootEl = document,
  forceInline = false,
  forceRootEl = false,
) {
  const section1 = document.querySelector('main > div');
  addSectionAnchors(rootEl);
  commands.forEach((cmd) => {
    const { action, content, selector } = cmd;
    cmd.content = forceInline && getSelectorType(content) === 'fragment' ? addHash(content, INLINE_HASH) : content;
    if (selector.startsWith(IN_BLOCK_SELECTOR_PREFIX)) {
      registerInBlockActions(cmd);
      cmd.selectorType = IN_BLOCK_SELECTOR_PREFIX;
      return;
    }
    const {
      els,
      modifiers,
      attribute,
    } = getSelectedElements(selector, rootEl, forceRootEl, action);

    Object.assign(cmd, { modifiers, attribute });

    els?.forEach((el) => {
      if (!el
        || (!(action in COMMANDS) && !(action in CREATE_CMDS))
        || (rootEl && !rootEl.contains(el))
        || (isPostLCP && section1?.contains(el))) return;

      if (action in COMMANDS) {
        COMMANDS[action](el, cmd);
        return;
      }
      const insertAnchor = getSelectorType(selector) === 'fragment' ? el.parentElement : el;
      insertAnchor?.insertAdjacentElement(
        CREATE_CMDS[action],
        createContent(insertAnchor, cmd),
      );
    });
    if ((els.length && !cmd.modifiers.includes(FLAGS.all))
      || !cmd.modifiers.includes(FLAGS.includeFragments)) {
      cmd.completed = true;
    }
  });
  deleteMarkedEls(rootEl);
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
    const targetManifestId = vn.includes(TARGET_EXP_PREFIX) ? targetId : false;
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
        const { blockSelector, blockTarget } = getBlockProps(line[vn], config, origin);
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
      let usValue = firstRow[US_GEO] || firstRow.us || firstRow.en || firstRow.key;

      if (!usValue) return;

      usValue = processTrackingLabels(usValue);
      const translatedValue = processTrackingLabels(item[column]);
      config.mep.analyticLocalization[translatedValue] = usValue;
    });
  });
}
const matchesCountryChoiceOrIP = (name, config) => {
  if (!name.includes('countrychoice') && !name.includes('countryip')) return false;
  const countryList = name.match(/\(([^)]+)\)/)?.[1]?.split(',').map((c) => (c).trim());
  if (!countryList?.length) return false;
  const { countryChoice, countryIP } = config.mep;
  const testCountry = name.includes('countrychoice') ? countryChoice : countryIP;
  return countryList.includes(testCountry);
};

function hasCountryMatch(str, config) {
  if (str.includes('countrychoice') || str.includes('countryip')) {
    const modifiedStr = str.replace('uk', 'gb');
    return matchesCountryChoiceOrIP(modifiedStr, config);
  }
  return false;
}
/* c8 ignore start */
export function parsePlaceholders(placeholders, config, selectedVariantName = '') {
  if (!placeholders?.length || selectedVariantName === 'default') return config;
  const { countryIP, countryChoice } = config.mep || {};
  const valueNames = [
    selectedVariantName.toLowerCase(),
    config.mep?.prefix,
    config.locale.region.toLowerCase(),
    ...(countryIP ? [`countryip(${countryIP})`] : []),
    ...(countryChoice ? [`countrychoice(${countryChoice})`] : []),
    config.locale.ietf.toLowerCase(),
    ...config.locale.ietf.toLowerCase().split('-'),
    'value',
    'other',
  ];
  const keys = placeholders?.length ? Object.entries(placeholders[0]) : [];
  const keyVal = keys.find(([key]) => {
    const modifiedStr = key.toLowerCase();
    return valueNames.includes(modifiedStr) || hasCountryMatch(modifiedStr, config);
  });
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

export const checkForPreviousPageMatch = (previousPageStr, lastVisitedPage = document.referrer) => {
  if (!lastVisitedPage) return false;
  const previousPageString = previousPageStr.toLowerCase().split('previouspage-')[1];
  return matchGlob(previousPageString, new URL(lastVisitedPage).pathname);
};

function trimNames(arr) {
  return arr.map((v) => v.trim()).filter(Boolean);
}
export function buildVariantInfo(variantNames) {
  return variantNames.reduce((acc, name) => {
    let nameArr = [name];
    if (!name.startsWith(TARGET_EXP_PREFIX)) nameArr = name.split(/,(?![^(]*\))/);
    acc[name] = trimNames(nameArr);
    acc.allNames = [...acc.allNames, ...trimNames(name.split(/(?:\([^)]*\))?,|&|\bnot\b/))];
    return acc;
  }, { allNames: [] });
}

const getXLGListURL = (config) => {
  const sheet = config.env?.name === 'prod' ? 'prod' : 'stage';
  return `https://www.adobe.com/federal/assets/data/mep-xlg-tags.json?sheet=${sheet}`;
};

export const getEntitlementMap = async () => {
  const config = getConfig();
  if (config.mep?.entitlementMap) return config.mep.entitlementMap;
  const entitlementUrl = getXLGListURL(config);
  const fetchedData = await fetchData(entitlementUrl, DATA_TYPE.JSON);
  if (!fetchedData) return config.consumerEntitlements || {};
  const entitlements = {};
  fetchedData?.data?.forEach((ent) => {
    const { id, tagname } = ent;
    entitlements[id] = tagname;
  });
  config.mep ??= {};
  config.mep.entitlementMap = { ...config.consumerEntitlements, ...entitlements };
  return config.mep.entitlementMap;
};

export const getEntitlements = async (data) => {
  const entitlementMap = await getEntitlementMap();

  return data.flatMap((destination) => {
    const ents = destination.segments?.flatMap((segment) => {
      const entMatch = entitlementMap[segment.id];
      return entMatch ? [entMatch] : [];
    });

    return ents || [];
  });
};

function normCountry(country) {
  return (country.toLowerCase() === 'uk' ? 'gb' : country.toLowerCase()).split('_')[0];
}
async function setMepCountry(config) {
  const urlParams = new URLSearchParams(window.location.search);
  const country = urlParams.get('country') || (document.cookie.split('; ').find((row) => row.startsWith('international='))?.split('=')[1]);
  const akamaiCode = urlParams.get('akamaiLocale')?.toLowerCase() || sessionStorage.getItem('akamai');
  config.mep = config.mep || {};
  if (country) {
    config.mep.countryChoice = normCountry(country);
  }
  if (akamaiCode) {
    config.mep.countryIP = normCountry(akamaiCode);
  }
  if (!config.mep.countryChoice && config.mep.countryIP) {
    config.mep.countryChoice = config.mep.countryIP;
  } else if (!config.mep.countryIP && config.mep.countryIPPromise) {
    try {
      let countryIP = await config.mep.countryIPPromise;
      if (countryIP) {
        countryIP = countryIP === 'uk' ? 'gb' : countryIP.split('_')[0];
        config.mep.countryIP = countryIP;
        if (!config.mep.countryChoice) config.mep.countryChoice = countryIP;
      }
    } catch (e) {
      log('MEP Error: Unable to get user country');
    }
  }
}

async function getPersonalizationVariant(
  manifestPath,
  variantNames = [],
  variantLabel = null,
) {
  const config = getConfig();
  if (config.mep?.variantOverride?.[manifestPath]) {
    return config.mep.variantOverride[manifestPath];
  }

  const variantInfo = buildVariantInfo(variantNames);

  const entitlementKeys = Object.values(await getEntitlementMap());
  const hasEntitlementTag = entitlementKeys.some((tag) => variantInfo.allNames.includes(tag));

  let userEntitlements = [];
  if (hasEntitlementTag) {
    if (config?.mep?.enablePersV2) {
      userEntitlements = [];
    } else {
      userEntitlements = await config.entitlements();
    }
  }

  const hasMatch = (name) => {
    if (!name) return true;
    if (name === variantLabel?.toLowerCase()) return true;
    if (name.startsWith('param-')) return checkForParamMatch(name);
    if (name.toLowerCase().startsWith('previouspage-')) return checkForPreviousPageMatch(name);
    if (hasCountryMatch(name, config)) return true;
    if (userEntitlements?.includes(name)) return true;
    return PERSONALIZATION_KEYS.includes(name) && PERSONALIZATION_TAGS[name]();
  };

  const matchVariant = (n) => {
    // split before checks
    const name = n.includes(':') ? n.split(':')[1] : n;
    if (name.startsWith(TARGET_EXP_PREFIX)) return hasMatch(name);
    const processedList = name.split('&').map((condition) => {
      const reverse = condition.trim().startsWith(COLUMN_NOT_OPERATOR);
      const match = hasMatch(condition.replace(COLUMN_NOT_OPERATOR, '').trim());
      return reverse ? !match : match;
    });
    return !processedList.includes(false);
  };

  if (config.mep?.geoLocation) {
    await setMepCountry(config);
  }

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
  source: ['promo'],
});

export const addMepAnalytics = (config, header) => {
  config.mep?.experiments?.forEach((experiment) => {
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
    source,
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
    if (manifestConfig.manifestType === TRACKED_MANIFEST_TYPE) {
      manifestConfig.manifestOverrideName = manifestOverrideName;
      const analytics = manifestOverrideName || getFileName(manifestPath).replace('.json', '');
      manifestConfig.analyticsTitle = analytics.trim().slice(0, 15);
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
  if (source?.length) manifestConfig.source = source;
  return manifestConfig;
}

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

export function cleanAndSortManifestList(manifests, config = getConfig()) {
  const manifestObj = {};
  let allManifests = manifests;
  let targetManifestWinsOverServerManifest = false;
  if (config.mep?.experiments) allManifests = [...manifests, ...config.mep.experiments];
  allManifests.forEach((manifest) => {
    try {
      if (!manifest?.manifest) return;
      if (!manifest.manifestPath) manifest.manifestPath = normalizePath(manifest.manifest);
      if (manifest.source && !manifest.source.includes('target')) manifest.manifest = normalizePath(manifest.manifest);
      if (manifest.manifestPath in manifestObj) {
        let fullManifest = manifestObj[manifest.manifestPath];
        let freshManifest = manifest;
        if (manifest.name) {
          fullManifest = manifest;
          freshManifest = manifestObj[manifest.manifestPath];
        }
        freshManifest.source = freshManifest.source.concat(fullManifest.source);
        freshManifest.name = fullManifest.name;
        freshManifest.selectedVariantName = fullManifest.selectedVariantName;
        targetManifestWinsOverServerManifest = config?.env?.name === 'prod' && fullManifest.selectedVariantName.startsWith('target-');

        if (targetManifestWinsOverServerManifest) {
          freshManifest.variants = fullManifest.variants;
          freshManifest.placeholderData = fullManifest.placeholderData;
        }

        freshManifest.selectedVariant = freshManifest.variants[freshManifest.selectedVariantName];
        manifestObj[manifest.manifestPath] = freshManifest;
      } else {
        manifestObj[manifest.manifestPath] = manifest;
      }

      const manifestConfig = manifestObj[manifest.manifestPath];
      const { selectedVariantName, variantNames, placeholderData } = manifestConfig;

      if (selectedVariantName && variantNames.includes(selectedVariantName)) {
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
  const addInline = (a.href.includes(INLINE_HASH) && !fragment.includes(INLINE_HASH));
  if (action === COMMANDS_KEYS.replace) {
    a.href = fragment;
    if (addInline) a.href += `#${INLINE_HASH}`;
    addIds(a, manifestId, targetManifestId);
    return fragment;
  }
  if (action === COMMANDS_KEYS.remove) {
    a.parentElement.remove();
  }
  return false;
}

export function parseNestedPlaceholders({ placeholders }) {
  if (!placeholders) return;
  Object.entries(placeholders).forEach(([key, value]) => {
    placeholders[key] = replacePlaceholders(value, placeholders);
  });
}

export async function applyPers({ manifests }) {
  if (!manifests?.length) return;
  let experiments = manifests;
  const config = getConfig();
  for (let i = 0; i < experiments.length; i += 1) {
    experiments[i] = await getManifestConfig(
      experiments[i],
      config.mep?.variantOverride,
    );
  }
  experiments = cleanAndSortManifestList(experiments, config);
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
  if (config.mep.replacepage && !isPostLCP && main) {
    await replaceInner(config.mep.replacepage.val, main);
    const { manifestId, targetManifestId } = config.mep.replacepage;
    addIds(main, manifestId, targetManifestId);
  }

  config.mep.commands = handleCommands(config.mep.commands);

  const pznList = results.filter((r) => (r.experiment?.manifestType === TRACKED_MANIFEST_TYPE));
  if (!pznList.length) return;

  const pznVariants = pznList.map((r) => {
    const val = r.experiment.selectedVariantName.replace(TARGET_EXP_PREFIX, '').trim().slice(0, 15);
    const arr = val.split(':');
    if (arr.length > 2 || arr[0]?.trim() === '' || arr[1]?.trim() === '') {
      log('MEP Error: When using (optional) column nicknames, please use the following syntax: "<nickname>: <original audience>"');
    }
    if (!val.includes(':') || val.startsWith(':')) return val === 'default' ? 'nopzn' : val;
    return arr[0].trim();
  });
  const pznManifests = pznList.map((r) => r.experiment.analyticsTitle);
  config.mep.martech = `|${pznVariants.join('--')}|${pznManifests.join('--')}`;
}

function parseManifestUrlAndAddSource(manifestString, source) {
  if (!manifestString) return [];
  return manifestString.toLowerCase()
    .split(/,|(\s+)|(\\n)/g)
    .filter((path) => path?.trim())
    .map((manifestPath) => ({ manifestPath, source: [source] }));
}

export const combineMepSources = async (
  persEnabled,
  rocPersEnabled,
  promoEnabled,
  mepParam,
) => {
  let persManifests = [];

  if (persEnabled) {
    persManifests = parseManifestUrlAndAddSource(persEnabled, 'pzn');
  }

  if (rocPersEnabled) {
    const rocPersManifest = parseManifestUrlAndAddSource(rocPersEnabled, 'pzn-roc');
    persManifests = persManifests.concat(rocPersManifest);
  }

  if (promoEnabled) {
    const { default: getPromoManifests } = await import('./promo-utils.js');
    persManifests = persManifests.concat(getPromoManifests(promoEnabled, PAGE_URL.searchParams));
  }

  if (mepParam && mepParam !== 'off') {
    const persManifestPaths = persManifests.map((manifest) => {
      const { manifestPath } = manifest;
      if (manifestPath?.startsWith('/')) return manifestPath;
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
        persManifests.push({ manifestPath, source: ['mep param'] });
      }
    });
  }
  return persManifests;
};

async function updateManifestsAndPropositions(
  { config, targetAjoManifests, targetAjoPropositions },
) {
  targetAjoManifests.forEach((manifest) => {
    manifest.source = [config.mep.ajoEnabled ? 'ajo' : 'target'];
  });
  config.mep.targetAjoManifests = targetAjoManifests;
  if (config.mep.enablePersV2) {
    window.addEventListener('alloy_sendEvent', () => {
      if (targetAjoPropositions?.length && window._satellite) {
        window._satellite.track('propositionDisplay', targetAjoPropositions);
      }
    }, { once: true });
  } else if (targetAjoPropositions?.length && window._satellite) {
    window._satellite.track('propositionDisplay', targetAjoPropositions);
  }
  if (config.mep.targetEnabled === 'postlcp') {
    const event = new CustomEvent(MARTECH_RETURNED_EVENT, { detail: 'Martech returned' });
    window.dispatchEvent(event);
  }
  return targetAjoManifests;
}

function roundToQuarter(num) {
  return Math.ceil(num / 250) / 4;
}

function calculateResponseTime(responseStart) {
  const responseTime = Date.now() - responseStart;
  return roundToQuarter(responseTime);
}

function sendTargetResponseAnalytics(failure, responseStart, timeoutLocal, message) {
  // temporary solution until we can decide on a better timeout value
  const responseTime = calculateResponseTime(responseStart);
  const timeoutTime = roundToQuarter(timeoutLocal);
  let val = `target response time ${responseTime}:timed out ${failure}:timeout ${timeoutTime}`;
  if (message) val += `:${message}`;
  // eslint-disable-next-line no-underscore-dangle
  window.addEventListener('alloy_sendEvent', () => {
    window._satellite?.track?.('event', {
      documentUnloading: true,
      xdm: {
        eventType: 'web.webinteraction.linkClicks',
        web: {
          webInteraction: {
            linkClicks: { value: 1 },
            type: 'other',
            name: val,
          },
        },
      },
      data:
        { _adobe_corpnew: { digitalData: { primaryEvent: { eventInfo: { eventName: val } } } } },
    });
  }, { once: true });
}

const handleAlloyResponse = (response) => ((response.propositions || response.decisions))
  ?.map((i) => {
    const { id } = i;
    return i.items.map((item) => ({ ...item, id }));
  })
  ?.flat()
  ?.map((item) => {
    const content = item?.data?.content;
    if (!content || !(content.manifestLocation || content.manifestContent)) return null;
    return {
      manifestPath: content.manifestLocation || content.manifestPath,
      manifestUrl: content.manifestLocation,
      manifestData: content.manifestContent?.experiences?.data || content.manifestContent?.data,
      manifestPlaceholders: content.manifestContent?.placeholders?.data,
      manifestInfo: content.manifestContent?.info.data,
      name: item.meta?.['activity.name'] || item.id,
      variantLabel: (item.meta?.['experience.name'] && `target-${item.meta['experience.name']}`)
        || content.experienceName,
      meta: item.meta,
    };
  })
  ?.filter(Boolean) ?? [];

async function handleMartechTargetInteraction(
  { config, targetInteractionPromise, calculatedTimeout },
) {
  const targetAjo = config.mep.ajoEnabled ? 'ajo' : 'target';
  let targetAjoManifests = [];
  let targetAjoPropositions = [];
  if (config?.mep?.enablePersV2 && targetInteractionPromise) {
    const { targetInteractionData, respTime, respStartTime } = await targetInteractionPromise;
    sendTargetResponseAnalytics(false, respStartTime, calculatedTimeout);
    if (targetInteractionData.result) {
      const roundedResponseTime = roundToQuarter(respTime);
      performance.clearMarks();
      performance.clearMeasures();
      try {
        window.lana.log(`${targetAjo} response time: ${roundedResponseTime}`, {
          tags: 'martech',
          errorType: 'e',
          sampleRate: 0.5,
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(`Error logging ${targetAjo} response time:`, e);
      }
      targetAjoManifests = handleAlloyResponse(targetInteractionData.result);
      targetAjoPropositions = targetInteractionData.result?.propositions || [];
    }
  }

  return updateManifestsAndPropositions(
    { config, targetAjoManifests, targetAjoPropositions },
  );
}

async function callMartech(config) {
  const { getTargetAjoPersonalization } = await import('../../martech/martech.js');
  const {
    targetAjoManifests,
    targetAjoPropositions,
  } = await getTargetAjoPersonalization(
    { handleAlloyResponse, config, sendTargetResponseAnalytics },
  );
  return updateManifestsAndPropositions(
    { config, targetAjoManifests, targetAjoPropositions },
  );
}

const awaitMartech = () => new Promise((resolve) => {
  const listener = (event) => resolve(event.detail);
  window.addEventListener(MARTECH_RETURNED_EVENT, listener, { once: true });
});

export async function init(enablements = {}) {
  let manifests = [];
  const {
    mepParam, mepHighlight, mepButton, pzn, pznroc, promo, enablePersV2,
    target, ajo, countryIPPromise, mepgeolocation, targetInteractionPromise, calculatedTimeout,
    postLCP,
  } = enablements;
  const config = getConfig();
  if (postLCP) {
    isPostLCP = true;
  } else {
    config.mep = {
      updateFragDataProps,
      preview: (mepButton !== 'off'
        && (config.env?.name !== 'prod' || mepParam || mepParam === '' || mepButton)),
      variantOverride: parseMepParam(mepParam),
      highlight: (mepHighlight !== undefined && mepHighlight !== 'false'),
      targetEnabled: target,
      ajoEnabled: ajo,
      experiments: [],
      prefix: config.locale?.prefix.split('/')[1]?.toLowerCase() || US_GEO,
      enablePersV2,
      countryIPPromise,
      geoLocation: mepgeolocation,
      targetInteractionPromise,
    };

    manifests = manifests.concat(await combineMepSources(pzn, pznroc, promo, mepParam));
    manifests?.forEach((manifest) => {
      if (manifest.disabled) return;
      const normalizedURL = normalizePath(manifest.manifestPath);
      loadLink(normalizedURL, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
    });
    if (pzn || pznroc) loadLink(getXLGListURL(config), { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
  }

  if (enablePersV2 && target === true) {
    manifests = manifests.concat(await handleMartechTargetInteraction(
      { config, targetInteractionPromise, calculatedTimeout },
    ));
  } else {
    if (target === true || ajo === true) manifests = manifests.concat(await callMartech(config));
    if (target === 'postlcp' || ajo === 'postlcp') callMartech(config);
  }
  if (postLCP) {
    if (!config.mep.targetAjoManifests) await awaitMartech();
    manifests = config.mep.targetAjoManifests;
  }
  try {
    if (manifests?.length) await applyPers({ manifests });
    if (config.mep?.preview) await import('./preview.js').then(({ saveToMmm }) => saveToMmm());
  } catch (e) {
    log(`MEP Error: ${e.toString()}`);
    window.lana?.log(`MEP Error: ${e.toString()}`);
  }
}
