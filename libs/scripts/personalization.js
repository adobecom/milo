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
const RE_KEY_REPLACE = /[^a-z0-9\- ,]/g;
const RE_SPACE_COMMA = /[ ,]/;

const MANIFEST_KEYS = [
  'action',
  'selector',
  'pagefilter',
  'page filter',
  'page filter optional',
];

const COMMANDS = {
  insertcontentafter: (el, fragment) => el.insertAdjacentElement('afterend', fragment),
  insertcontentbefore: (el, fragment) => el.insertAdjacentElement('beforebegin', fragment),
  removecontent: (el) => el.classList.add(CLASS_EL_DELETE),
  replacecontent: (el, fragment) => {
    if (el.classList.contains(CLASS_EL_REPLACE)) return;
    el.insertAdjacentElement('beforebegin', fragment);
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

function normalizePath(p) {
  let path = p;

  if (!path.includes('/')) {
    return path;
  }

  if (path.startsWith('http')) {
    path = new URL(path)?.pathname;
  } else if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  return path;
}

const appendJsonExt = (path) => (path.endsWith('.json') ? path : `${path}.json`);

const consolidateObjects = (arr, prop) => arr.reduce((propMap, item) => {
  Object.entries(item[prop] || {})
    .forEach(([key, val]) => {
      propMap[key] = val;
    });
  return propMap;
}, {});

const matchGlob = (searchStr, inputStr) => {
  const pattern = searchStr.replace(/\*\*/g, '.*');
  const reg = new RegExp(`^${pattern}$`, 'i');
  return reg.test(inputStr);
};

const createFragmentLink = (url) => {
  const a = utils.createTag('a', { href: url }, url);
  const p = utils.createTag('p', undefined, a);
  return p;
};

function handleCommands(commands, rootEl) {
  const mainEl = rootEl || document.querySelector('main');

  commands.forEach((cmd) => {
    if (VALID_COMMANDS.includes(cmd.action)) {
      let targetEl = mainEl.querySelector(cmd.selector);

      if (!targetEl) return;

      if (targetEl.classList[0] === 'section-metadata') {
        targetEl = targetEl.parentElement || targetEl;
      }

      COMMANDS[cmd.action](targetEl, cmd !== 'remove' && createFragmentLink(cmd.target));
    } else {
      console.log('Invalid command found: ', cmd);
    }
  });
}

const setMetadata = (metadata) => {
  const { selector, val } = metadata;
  if (!selector || !val) return;

  let metaEl = document.querySelector(`meta[name="${selector}"]`);
  if (!metaEl) {
    metaEl = document.createElement('meta');
    metaEl.setAttribute('name', selector);
    document.head.append(metaEl);
  }
  metaEl.setAttribute('content', val);
};

function toLowerAlpha(str) {
  const s = str.toLowerCase();
  return s.replace(RE_KEY_REPLACE, '');
}

function transformKeys(obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[toLowerAlpha(key)] = obj[key];
    return newObj;
  }, {});
}

export function parseConfig(data) {
  if (!data?.length) return null;

  const config = {};
  const experiences = data.map((d) => transformKeys(d));

  try {
    const variants = {};
    const variantNames = Object.keys(experiences[0])
      .filter((vn) => !MANIFEST_KEYS.includes(vn));

    variantNames.forEach((variantName) => {
      variants[variantName] = { commands: [] };
    });

    const currentPath = new URL(window.location).pathname;

    experiences.forEach((line) => {
      const action = line.action?.toLowerCase();
      const { selector } = line;
      const pageFilter = line['page filter'] || line['page filter optional'];

      if (pageFilter && !matchGlob(pageFilter, currentPath)) return;

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
          console.log('Invalid action found: ', line);
        }
      });
    });

    config.variants = variants;
    config.variantNames = variantNames;
    return config;
  } catch (e) {
    console.log('error parsing personalization config:', e, experiences);
  }
  return null;
}

export async function replaceInner(path, element) {
  if (!path || !element) return false;
  let plainPath = path.endsWith('/') ? `${path}index` : path;
  plainPath = plainPath.endsWith('.plain.html') ? plainPath : `${plainPath}.plain.html`;
  try {
    const resp = await fetch(plainPath);
    if (!resp.ok) {
      throw new Error('Invalid response', resp);
    }
    const html = await resp.text();
    element.innerHTML = html;
    return true;
  } catch (e) {
    console.log(`error loading experiment content: ${plainPath}`, e);
  }
  return false;
}

function getPersonalizationVariant(variantNames = [], variantLabel = null) {
  const tagNames = Object.keys(PERSONALIZATION_TAGS);
  // handle multiple variants that are space / comma delimited
  const matchingVariant = variantNames.find((variant) => {
    const names = variant.split(RE_SPACE_COMMA).filter(Boolean);
    if (names.some((name) => (
      name === variantLabel || (tagNames.includes(name) && PERSONALIZATION_TAGS[name]())))
    ) {
      return variant;
    }
    return false;
  });
  return matchingVariant;
}

async function fetchManifest(path) {
  try {
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(resp);
    const json = await resp.json();
    return json.data;
  } catch (e) {
    console.error(`Error loading manifest: ${path}`, e);
    return null;
  }
}

export async function getPersConfig(name, variantLabel, manifestData, manifestPath) {
  console.log('Personalization: ', name || manifestPath);

  const data = manifestData || await fetchManifest(manifestPath);
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

export async function fragmentPersonalization(doc) {
  const fpTableRows = doc.querySelectorAll('.fragment-personalization > div');
  doc.querySelector('.fragment-personalization').remove();
  if (!fpTableRows) return doc;

  const variantNames = [];
  const info = [...fpTableRows].reduce((obj, row) => {
    const [actionEl, selectorEl, variantEl, fragment] = row.children;
    if (actionEl?.innerText?.toLowerCase() === 'action') {
      return obj;
    }
    const variantName = variantEl?.innerText?.toLowerCase();
    if (!variantNames.includes(variantName)) {
      variantNames.push(variantName);
      obj[variantName] = [];
    }
    obj[variantName].push({
      action: actionEl.innerText?.toLowerCase(),
      selector: selectorEl.innerText?.toLowerCase(),
      htmlFragment: fragment.firstElementChild,
    });
    return obj;
  }, {});

  const selectedVariant = getPersonalizationVariant(variantNames);
  if (selectedVariant) {
    info[selectedVariant].forEach((cmd) => {
      const selectedEl = doc.querySelector(cmd.selector);
      if (!selectedEl) return;

      switch (cmd.action) {
        case 'replace': case 'replacecontent':
          selectedEl.replaceWith(cmd.htmlFragment);
          break;
        case 'insertbefore': case 'insertcontentbefore':
          selectedEl.insertAdjacentElement('beforebegin', cmd.htmlFragment);
          break;
        case 'insertafter': case 'insertcontentafter':
          selectedEl.insertAdjacentElement('afterend', cmd.htmlFragment);
          break;
        case 'remove': case 'removecontent':
          selectedEl.remove();
          break;
        default:
          console.warn(`Unknown action: ${cmd.action}`);
      }
    });
  }

  // const selectedVariant = getPersonalizationVariant(variantNames);
  // if (selectedVariant) {
  //   info[selectedVariant].forEach((cmd) => {
  //     const selectedEl = doc.querySelector(cmd.selector);
  //     if (!selectedEl) return;

  //     if (['replace', 'replacecontent'].includes(cmd.action)) {
  //       selectedEl.replaceWith(cmd.htmlFragment);
  //     } else if (['insertbefore', 'insertcontentbefore'].includes(cmd.action)) {
  //       selectedEl.insertAdjacentElement('beforebegin', cmd.htmlFragment);
  //     } else if (['insertafter', 'insertcontentafter'].includes(cmd.action)) {
  //       selectedEl.insertAdjacentElement('afterend', cmd.htmlFragment);
  //     } else if (['remove', 'removecontent'].includes(cmd.action)) {
  //       selectedEl.remove();
  //     }
  //   });
  // }
  return doc;
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
  { createTag, getConfig, loadScript, preload, updateConfig },
) {
  if (!(persManifests.length || targetManifests.length)) return;

  utils = { createTag, loadScript };

  let manifests = targetManifests;

  manifests = manifests.concat(
    persManifests.map((manifestPath) => ({ manifestPath: appendJsonExt(manifestPath) })),
  );

  for (const manifest of manifests) {
    if (!manifest.manifestData && manifest.manifestPath) {
      manifest.manifestPath = normalizePath(manifest.manifestPath);
      preload(manifest.manifestPath, { as: 'fetch', crossorigin: 'anonymous' });
    }
  }

  let results = [];
  for (const manifest of manifests) {
    results.push(await runPersonalization(manifest));
  }
  results = results.filter(Boolean);

  [...document.querySelectorAll(`.${CLASS_EL_DELETE}`)].forEach((el) => el.remove());

  // Currently required for preview.js
  window.hlx ??= {};
  window.hlx.experiments = results.map((r) => r.experiment);

  updateConfig({
    ...getConfig(),
    experiments: results.map((r) => r.experiment),
    p13nBlocks: consolidateObjects(results, 'blocks'),
    p13nFragments: consolidateObjects(results, 'fragments'),
  });
}
