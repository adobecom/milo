/* eslint-disable no-console */
import {
  createTag, getConfig, loadIms, loadLink, loadScript, updateConfig,
} from '../../utils/utils.js';

const CLASS_EL_DELETE = 'p13n-deleted';
const CLASS_EL_REPLACE = 'p13n-replaced';
const LS_ENT_KEY = 'milo:entitlements';
const LS_ENT_EXPIRE_KEY = 'milo:entitlements:expire';
const ENT_CACHE_EXPIRE = 1000 * 60 * 60 * 3; // 3 hours
const ENT_CACHE_REFRESH = 1000 * 60 * 3; // 3 minutes
const PAGE_URL = new URL(window.location.href);

/* c8 ignore start */
export const PERSONALIZATION_TAGS = {
  all: () => true,
  chrome: () => navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Mobile'),
  firefox: () => navigator.userAgent.includes('Firefox') && !navigator.userAgent.includes('Mobile'),
  android: () => navigator.userAgent.includes('Android'),
  ios: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
  loggedout: () => !window.adobeIMS?.isSignedInUser(),
  loggedin: () => window.adobeIMS?.isSignedInUser(),
  darkmode: () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
  lightmode: () => !PERSONALIZATION_TAGS.darkmode(),
};

export const ENTITLEMENT_TAGS = {
  photoshop: (ents) => ents.photoshop_cc,
  lightroom: (ents) => ents.lightroom_cc,
};
/* c8 ignore stop */

const personalizationKeys = Object.keys(PERSONALIZATION_TAGS);
const entitlementKeys = Object.keys(ENTITLEMENT_TAGS);

// Replace any non-alpha chars except comma, space and hyphen
const RE_KEY_REPLACE = /[^a-z0-9\- _,=]/g;

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
  loadLink(`${href}.plain.html`, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
  return frag;
};

const COMMANDS = {
  insertcontentafter: (el, target, manifestId) => el
    .insertAdjacentElement('afterend', createFrag(el, target, manifestId)),
  insertcontentbefore: (el, target, manifestId) => el
    .insertAdjacentElement('beforebegin', createFrag(el, target, manifestId)),
  removecontent: (el, target, manifestId) => {
    if (target === 'false') return;
    if (manifestId) {
      const div = createTag('div', { 'data-removed-manifest-id': manifestId });
      el.insertAdjacentElement('beforebegin', div);
    }
    el.classList.add(CLASS_EL_DELETE);
  },
  replacecontent: (el, target, manifestId) => {
    if (el.classList.contains(CLASS_EL_REPLACE)) return;
    el.insertAdjacentElement('beforebegin', createFrag(el, target, manifestId));
    el.classList.add(CLASS_EL_DELETE, CLASS_EL_REPLACE);
  },
};

const VALID_COMMANDS = Object.keys(COMMANDS);

const GLOBAL_CMDS = [
  'insertscript',
  'replacefragment',
  'replacepage',
  'updatemetadata',
  'useblockcode',
];

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

const consolidateObjects = (arr, prop) => arr.reduce((propMap, item) => {
  item[prop]?.forEach((i) => {
    propMap[i.selector] = i.val;
  });
  return propMap;
}, {});

/* c8 ignore start */
function normalizePath(p) {
  let path = p;

  if (!path.includes('/')) {
    return path;
  }

  const config = getConfig();

  if (path.startsWith(config.codeRoot)
    || path.includes('.hlx.')
    || path.startsWith(`https://${config.productionDomain}`)) {
    try {
      path = new URL(path).pathname;
    } catch (e) { /* return path below */ }
  } else if (!path.startsWith('http') && !path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
}

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

function handleCommands(commands, manifestId, rootEl = document) {
  commands.forEach((cmd) => {
    if (VALID_COMMANDS.includes(cmd.action)) {
      try {
        const selectorEl = rootEl.querySelector(cmd.selector);
        if (!selectorEl) return;
        COMMANDS[cmd.action](selectorEl, cmd.target, manifestId);
      } catch (e) {
        console.log('Invalid selector: ', cmd.selector);
      }
    } else {
      /* c8 ignore next 2 */
      console.log('Invalid command found: ', cmd);
    }
  });
}

const getVariantInfo = (line, variantNames, variants) => {
  const action = line.action?.toLowerCase();
  const { selector } = line;
  const pageFilter = line['page filter'] || line['page filter optional'];

  if (pageFilter && !matchGlob(pageFilter, new URL(window.location).pathname)) return;

  variantNames.forEach((vn) => {
    if (!line[vn]) return;

    const variantInfo = {
      action,
      selector,
      pageFilter,
      target: line[vn],
    };

    if (GLOBAL_CMDS.includes(action)) {
      variants[vn][action] = variants[vn][action] || [];

      variants[vn][action].push({
        selector: normalizePath(selector),
        val: normalizePath(line[vn]),
      });
    } else if (VALID_COMMANDS.includes(action)) {
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
      variants[vn] = { commands: [] };
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

const fetchEntitlements = async () => {
  const [{ default: getUserEntitlements }] = await Promise.all([
    import('../../blocks/global-navigation/utilities/getUserEntitlements.js'),
    loadIms(),
  ]);
  return getUserEntitlements();
};

const setEntLocalStorage = (ents) => {
  localStorage.setItem(LS_ENT_KEY, JSON.stringify(ents));
  localStorage.setItem(LS_ENT_EXPIRE_KEY, Date.now());
};

const loadEntsFromLocalStorage = () => {
  const ents = localStorage.getItem(LS_ENT_KEY);
  const expireDate = localStorage.getItem(LS_ENT_EXPIRE_KEY);
  const now = Date.now();
  if (!ents || !expireDate || (now - expireDate) > ENT_CACHE_EXPIRE) return null;
  if ((now - expireDate) > ENT_CACHE_REFRESH) {
    // refresh entitlements in background
    setTimeout(() => {
      fetchEntitlements().then((newEnts) => {
        setEntLocalStorage(newEnts);
      });
    }, 5000);
  }
  return JSON.parse(ents);
};

const clearEntLocalStorage = () => {
  localStorage.removeItem(LS_ENT_KEY);
  localStorage.removeItem(LS_ENT_EXPIRE_KEY);
};

export const getEntitlements = (() => {
  let ents;
  let logoutEventSet;
  return (async () => {
    if (window.adobeIMS && !window.adobeIMS.isSignedInUser()) {
      clearEntLocalStorage();
      return {};
    }
    if (!ents) {
      ents = loadEntsFromLocalStorage();
    }
    if (!ents) {
      ents = await fetchEntitlements();
      setEntLocalStorage(ents);
    }
    if (!logoutEventSet) {
      window.addEventListener('feds:signOut', clearEntLocalStorage);
      logoutEventSet = true;
    }
    return ents;
  });
})();

const getFlatEntitlements = async () => {
  const ents = await getEntitlements();
  return {
    ...ents.arrangement_codes,
    ...ents.clouds,
    ...ents.fulfilled_codes,
  };
};

const checkForEntitlementMatch = (name, entitlements) => {
  const entName = name.split('ent-')[1];
  if (!entName) return false;
  return entitlements[entName];
};
/* c8 ignore stop */

const checkForParamMatch = (paramStr) => {
  const [name, val] = paramStr.split('param-')[1].split('=');
  if (!name) return false;
  const searchParamVal = PAGE_URL.searchParams.get(name);
  if (searchParamVal !== null) {
    if (val) return val === searchParamVal;
    return true; // if no val is set, just check for existence of param
  }
  return false;
};

async function getPersonalizationVariant(manifestPath, variantNames = [], variantLabel = null) {
  const config = getConfig();
  if (config.mep?.override !== '') {
    let manifest;
    /* c8 ignore start */
    config.mep?.override.split(',').some((item) => {
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
    const vNames = name.split(',').map((v) => v.trim()).filter(Boolean);
    acc[name] = vNames;
    acc.allNames = [...acc.allNames, ...vNames];
    return acc;
  }, { allNames: [] });

  const hasEntitlementPrefix = variantInfo.allNames.some((name) => name.startsWith('ent-'));
  const hasEntitlementTag = entitlementKeys.some((tag) => variantInfo.allNames.includes(tag));

  let entitlements = {};
  if (hasEntitlementPrefix || hasEntitlementTag) {
    entitlements = await getFlatEntitlements();
  }

  const matchVariant = (name) => {
    if (name === variantLabel) return true;
    if (name.startsWith('param-')) return checkForParamMatch(name);
    if (name.startsWith('ent-')) return checkForEntitlementMatch(name, entitlements);
    if (entitlementKeys.includes(name)) {
      return ENTITLEMENT_TAGS[name](entitlements);
    }
    return personalizationKeys.includes(name) && PERSONALIZATION_TAGS[name]();
  };

  const matchingVariant = variantNames.find((variant) => variantInfo[variant].some(matchVariant));
  return matchingVariant;
}

export async function getPersConfig(name, variantLabel, manifestData, manifestPath) {
  let data = manifestData;
  if (!data) {
    const fetchedData = await fetchData(manifestPath, DATA_TYPE.JSON);
    if (fetchData) data = fetchedData;
  }
  let placeholders = false;
  if (data?.placeholders?.data) {
    placeholders = data.placeholders.data;
  }

  const persData = data?.experiences?.data || data?.data || data;
  if (!persData) return null;
  const config = parseConfig(persData);

  if (!config) {
    /* c8 ignore next 3 */
    console.log('Error loading personalization config: ', name || manifestPath);
    return null;
  }

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

  if (placeholders) {
    updateConfig(
      parsePlaceholders(placeholders, getConfig(), config.selectedVariantName),
    );
  }

  config.name = name;
  config.manifest = manifestPath;
  return config;
}

const deleteMarkedEls = () => {
  [...document.querySelectorAll(`.${CLASS_EL_DELETE}`)]
    .forEach((el) => el.remove());
};

const normalizeFragPaths = ({ selector, val }) => ({
  selector: normalizePath(selector),
  val: normalizePath(val),
});

export async function runPersonalization(info, config) {
  const {
    name,
    manifestData,
    manifestPath,
    variantLabel,
  } = info;

  const experiment = await getPersConfig(name, variantLabel, manifestData, manifestPath);

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

  let manifestId = experiment.manifest;
  if (!config.mep?.preview) {
    manifestId = false;
  } else if (experiment.name) {
    manifestId = `${experiment.name}: ${manifestId}`;
  }
  handleCommands(selectedVariant.commands, manifestId);

  selectedVariant.replacefragment &&= selectedVariant.replacefragment.map(normalizeFragPaths);

  return {
    experiment,
    blocks: selectedVariant.useblockcode,
    fragments: selectedVariant.replacefragment,
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

const decoratePreviewCheck = async (config, experiments) => {
  if (config.mep?.preview) {
    const { default: decoratePreviewMode } = await import('./preview.js');
    decoratePreviewMode(experiments);
  }
};

export async function applyPers(manifests) {
  const config = getConfig();

  if (!manifests?.length) {
    /* c8 ignore next */
    decoratePreviewCheck(config, []);
    return;
  }

  getEntitlements();
  const cleanedManifests = cleanManifestList(manifests);

  let results = [];
  for (const manifest of cleanedManifests) {
    results.push(await runPersonalization(manifest, config));
  }
  results = results.filter(Boolean);
  deleteMarkedEls();

  const experiments = results.map((r) => r.experiment);
  updateConfig({
    ...config,
    experiments,
    expBlocks: consolidateObjects(results, 'blocks'),
    expFragments: consolidateObjects(results, 'fragments'),
  });
  const trackingManifests = results.map((r) => r.experiment.manifest.split('/').pop().replace('.json', ''));
  const trackingVariants = results.map((r) => r.experiment.selectedVariantName);
  document.body.dataset.mep = `${trackingVariants.join('--')}|${trackingManifests.join('--')}`;

  decoratePreviewCheck(config, experiments);
}
