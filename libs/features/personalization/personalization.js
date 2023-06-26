/* eslint-disable no-console */
let utils;

const CLASS_EL_DELETE = 'p13n-deleted';
const CLASS_EL_REPLACE = 'p13n-replaced';

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
const RE_SPACE_COMMA = /[ ,]/;

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

const createFrag = (url) => {
  const a = utils.createTag('a', { href: url }, url);
  const p = utils.createTag('p', undefined, a);
  return p;
};

const COMMANDS = {
  insertcontentafter: (el, target) => el.insertAdjacentElement('afterend', createFrag(target)),
  insertcontentbefore: (el, target) => el.insertAdjacentElement('beforebegin', createFrag(target)),
  removecontent: (el, target) => (target !== 'false' && el.classList.add(CLASS_EL_DELETE)),
  replacecontent: (el, target) => {
    if (el.classList.contains(CLASS_EL_REPLACE)) return;
    el.insertAdjacentElement('beforebegin', createFrag(target));
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
      throw new Error('Invalid response', resp);
    }
    return await resp[type]();
  } catch (e) {
    console.log(`Error loading content: ${url}`, e);
  }
  return null;
};

function normalizePath(p) {
  let path = p;

  if (!path.includes('/')) {
    return path;
  }

  const config = utils.getConfig();

  if (path.startsWith(config.codeRoot) || path.startsWith(`https://${config.productionDomain}`)) {
    try {
      path = new URL(path).pathname;
    } catch (e) { /* return path below */ }
  } else if (!path.startsWith('http') && !path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
}

const appendJsonExt = (path) => (path.endsWith('.json') ? path : `${path}.json`);

const consolidateObjects = (arr, prop) => arr.reduce((propMap, item) => {
  item[prop]?.forEach((i) => {
    propMap[i.selector] = i.val;
  });
  return propMap;
}, {});

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

const getPageSearchParams = (() => {
  let psParams;
  return () => {
    if (!psParams) {
      psParams = new URL(window.location).searchParams;
    }
    return psParams;
  };
})();

const checkForParamMatch = (paramStr) => {
  const [name, val] = paramStr.split('param-')[1].split('=');
  if (!name) return false;
  const searchParams = getPageSearchParams();
  const searchParamVal = searchParams.get(name);
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

function handleCommands(commands, rootEl = document) {
  commands.forEach((cmd) => {
    if (VALID_COMMANDS.includes(cmd.action)) {
      let selectorEl = rootEl.querySelector(cmd.selector);

      if (!selectorEl) return;

      if (selectorEl.classList[0] === 'section-metadata') {
        selectorEl = selectorEl.parentElement || selectorEl;
      }

      COMMANDS[cmd.action](selectorEl, cmd.target);
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

function getPersonalizationVariant(variantNames = [], variantLabel = null) {
  const tagNames = Object.keys(PERSONALIZATION_TAGS);
  const matchingVariant = variantNames.find((variant) => {
    // handle multiple variants that are space / comma delimited
    const names = variant.split(RE_SPACE_COMMA).filter(Boolean);
    return names.some((name) => {
      if (name === variantLabel) return true;
      if (name.startsWith('param-')) return checkForParamMatch(name);
      return tagNames.includes(name) && PERSONALIZATION_TAGS[name]();
    });
  });
  return matchingVariant;
}

export async function getPersConfig(name, variantLabel, manifestData, manifestPath) {
  console.log('Personalization: ', name || manifestPath);

  const data = manifestData || await fetchData(manifestPath, DATA_TYPE.JSON);
  const config = parseConfig(data);

  if (!config) {
    console.log('Error loading personalization config: ', name || manifestPath);
    return {};
  }

  const selectedVariant = getPersonalizationVariant(config.variantNames, variantLabel);

  if (selectedVariant && config.variantNames.includes(selectedVariant)) {
    config.run = true;
    config.selectedVariantName = selectedVariant;
    config.selectedVariant = config.variants[selectedVariant];
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

const modifyFragment = (selectedEl, action, htmlFragment) => {
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
  const fpTableRows = el.querySelectorAll(':scope > div');
  el.remove();
  if (!fpTableRows) return el;

  const { info, names } = getFPInfo(fpTableRows);

  const selectedVariant = getPersonalizationVariant(names);
  if (!selectedVariant) return el;

  info[selectedVariant].forEach((cmd) => {
    const selectedEl = el.querySelector(cmd.selector);
    if (!selectedEl) return;
    modifyFragment(selectedEl, cmd.action, cmd.htmlFragment);
  });

  return el;
}

export async function runPersonalization(info) {
  const {
    name,
    manifestData,
    manifestPath,
    variantLabel,
  } = info;

  const experiment = await getPersConfig(name, variantLabel, manifestData, manifestPath);

  const { selectedVariant } = experiment;
  if (!selectedVariant) return {};

  if (selectedVariant.replacepage) {
    // only one replacepage can be defined
    await replaceInner(selectedVariant.replacepage[0], document.querySelector('main'));
  }

  selectedVariant.insertscript?.map((script) => utils.loadScript(script.val));
  selectedVariant.updatemetadata?.map((metadata) => setMetadata(metadata));

  handleCommands(selectedVariant.commands);

  return {
    experiment,
    blocks: selectedVariant.useblockcode,
    fragments: selectedVariant.replacefragment,
  };
}

export async function applyPersonalization(
  { persManifests = [], targetManifests = [] },
  { createTag, getConfig, loadLink, loadScript, updateConfig },
) {
  if (!(persManifests.length || targetManifests.length)) return;

  utils = { createTag, getConfig, loadScript };

  let manifests = targetManifests;

  manifests = manifests.concat(
    persManifests.map((manifestPath) => ({ manifestPath: appendJsonExt(manifestPath) })),
  );

  for (const manifest of manifests) {
    if (!manifest.manifestData && manifest.manifestPath) {
      manifest.manifestPath = normalizePath(manifest.manifestPath);
      loadLink(
        manifest.manifestPath,
        { as: 'fetch', crossorigin: 'anonymous', rel: 'preload' },
      );
    }
  }

  let results = [];
  for (const manifest of manifests) {
    results.push(await runPersonalization(manifest));
  }
  results = results.filter(Boolean);
  deleteMarkedEls();

  // Currently required for preview.js
  window.hlx ??= {};
  window.hlx.experiments = results.map((r) => r.experiment);

  updateConfig({
    ...getConfig(),
    experiments: results.map((r) => r.experiment),
    expBlocks: consolidateObjects(results, 'blocks'),
    expFragments: consolidateObjects(results, 'fragments'),
  });
}
