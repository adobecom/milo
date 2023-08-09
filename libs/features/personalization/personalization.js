/* eslint-disable no-console */
import { createTag, getConfig, loadLink, loadScript, updateConfig } from '../../utils/utils.js';

const CLASS_EL_DELETE = 'p13n-deleted';
const CLASS_EL_REPLACE = 'p13n-replaced';
const PAGE_URL = new URL(window.location.href);

export const PERSONALIZATION_TAGS = {
  chrome: () => navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Mobile'),
  firefox: () => navigator.userAgent.includes('Firefox') && !navigator.userAgent.includes('Mobile'),
  android: () => navigator.userAgent.includes('Android'),
  ios: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
  loggedout: () => !window.adobeIMS?.isSignedInUser(),
  loggedin: () => window.adobeIMS?.isSignedInUser(),
  darkmode: () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches,
  lightmode: () => !PERSONALIZATION_TAGS.darkmode(),
};

// Replace any non-alpha chars except comma, space and hyphen
const RE_KEY_REPLACE = /[^a-z0-9\- ,=]/g;

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

const createFrag = (url, manifestId) => {
  const a = createTag('a', { href: url }, url);
  if (manifestId) a.dataset.manifestId = manifestId;
  const p = createTag('p', undefined, a);
  loadLink(`${url}.plain.html`, { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' });
  return p;
};

const COMMANDS = {
  insertcontentafter: (el, target, manifestId) => el
    .insertAdjacentElement('afterend', createFrag(target, manifestId)),
  insertcontentbefore: (el, target, manifestId) => el.insertAdjacentElement('beforebegin', createFrag(target, manifestId)),
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
    el.insertAdjacentElement('beforebegin', createFrag(target, manifestId));
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
      if (resp.status === 404) {
        throw new Error('File not found');
      }
      throw new Error(`Invalid response: ${resp.status} ${resp.statusText}`);
    }
    return await resp[type]();
  } catch (e) {
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
  const reg = new RegExp(`^${pattern}$`, 'i');
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
      let selectorEl = rootEl.querySelector(cmd.selector);

      if (!selectorEl) return;

      if (selectorEl.classList[0] === 'section-metadata') {
        selectorEl = selectorEl.parentElement || selectorEl;
      }

      COMMANDS[cmd.action](selectorEl, cmd.target, manifestId);
    } else {
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
        selector: action === 'useblockcode' ? line[vn]?.split('/').pop() : normalizePath(selector),
        val: normalizePath(line[vn]),
      });
    } else if (VALID_COMMANDS.includes(action)) {
      variants[vn].commands.push(variantInfo);
    } else {
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
    console.log('error parsing personalization config:', e, experiences);
  }
  return null;
}

function parsePlaceholders(placeholders, config, selectedVariantName = '') {
  if (!placeholders?.length || selectedVariantName === 'no changes') return config;
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

function getPersonalizationVariant(manifestPath, variantNames = [], variantLabel = null) {
  const config = getConfig();
  let manifestFound = false;
  if (config.mep?.override !== '') {
    config.mep?.override.split(',').forEach((item) => {
      const pair = item.trim().split('--');
      if (pair[0] === manifestPath && pair.length > 1) {
        // eslint-disable-next-line prefer-destructuring
        manifestFound = pair[1];
      }
    });
    if (manifestFound) return manifestFound;
  }

  const tagNames = Object.keys(PERSONALIZATION_TAGS);
  const matchingVariant = variantNames.find((variant) => {
    // handle multiple variants that are space / comma delimited
    const names = variant.split(',').map((v) => v.trim()).filter(Boolean);
    return names.some((name) => {
      if (name === variantLabel) return true;
      if (name.startsWith('param-')) return checkForParamMatch(name);
      return tagNames.includes(name) && PERSONALIZATION_TAGS[name]();
    });
  });
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

  const persData = data?.data || data?.experiences?.data || data?.experiments?.data;
  if (!persData) return null;
  const config = parseConfig(persData);

  if (!config) {
    console.log('Error loading personalization config: ', name || manifestPath);
    return null;
  }

  const selectedVariantName = getPersonalizationVariant(
    manifestPath,
    config.variantNames,
    variantLabel,
  );

  if (selectedVariantName && config.variantNames.includes(selectedVariantName)) {
    config.run = true;
    config.selectedVariantName = selectedVariantName;
    config.selectedVariant = config.variants[selectedVariantName];
  } else {
    config.selectedVariantName = 'no changes';
    config.selectedVariant = 'no changes';
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

const getFPInfo = (fpTableRows) => {
  const names = [];
  const info = [...fpTableRows].reduce((infoObj, row) => {
    const [actionEl, selectorEl, variantEl, fragment] = row.children;
    if (actionEl?.innerText?.toLowerCase() === 'action') {
      return infoObj;
    }
    const variantName = variantEl?.innerText?.toLowerCase();
    if (!names.includes(variantName)) {
      names.push(variantName);
      infoObj[variantName] = [];
    }
    infoObj[variantName].push({
      action: actionEl.innerText?.toLowerCase(),
      selector: selectorEl.innerText?.toLowerCase(),
      htmlFragment: fragment.firstElementChild,
    });
    return infoObj;
  }, {});
  return { info, names };
};

const modifyFragment = (selectedEl, action, htmlFragment, manifestId) => {
  htmlFragment.dataset.manifestId = manifestId;
  switch (action) {
    case 'replace': case 'replacecontent':
      selectedEl.replaceWith(htmlFragment);
      break;
    case 'insertbefore': case 'insertcontentbefore':
      selectedEl.insertAdjacentElement('beforebegin', htmlFragment);
      break;
    case 'insertafter': case 'insertcontentafter':
      selectedEl.insertAdjacentElement('afterend', htmlFragment);
      break;
    case 'remove': case 'removecontent':
      selectedEl.insertAdjacentElement('beforebegin', createTag('div', { 'data-remove-manifest-id': manifestId }));
      selectedEl.remove();
      break;
    default:
      console.warn(`Unknown action: ${action}`);
  }
};

const deleteMarkedEls = () => {
  [...document.querySelectorAll(`.${CLASS_EL_DELETE}`)]
    .forEach((el) => el.remove());
};

export async function fragmentPersonalization(el) {
  const fpTable = el.querySelector('div.fragment-personalization');
  if (!fpTable) return el;
  const fpTableRows = fpTable.querySelectorAll(':scope > div');

  const { info, names } = getFPInfo(fpTableRows);
  fpTable.remove();

  const manifestId = 'fragment-personalization';
  const selectedVariant = getPersonalizationVariant(manifestId, names);
  if (!selectedVariant) return el;

  info[selectedVariant].forEach((cmd) => {
    const selectedEl = el.querySelector(cmd.selector);
    if (!selectedEl) return;
    modifyFragment(selectedEl, cmd.action, cmd.htmlFragment, manifestId);
  });

  return el;
}

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
  if (selectedVariant === 'no changes') {
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
    decoratePreviewCheck(config, []);
    return;
  }
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

  decoratePreviewCheck(config, experiments);
}
