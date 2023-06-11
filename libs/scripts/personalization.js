/* eslint-disable no-console */
let utils;

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
  removecontent: (el) => el.remove(),
  replacecontent: (el, fragment) => el.replaceWith(fragment),
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

function handleCommands(selectedVariant, rootEl) {
  const createFragmentLink = (url) => {
    const a = utils.createTag('a', { href: url }, url);
    const p = utils.createTag('p', undefined, a);
    return p;
  };

  const mainEl = rootEl || document.querySelector('main');

  selectedVariant.commands.forEach((cmd) => {
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
};

export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return (meta && meta.content) || '';
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

export function parseExperimentConfig(data) {
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

    experiences.forEach((line) => {
      const action = line.action?.toLowerCase();
      const { selector } = line;
      const pageFilter = line.pageFilter || line.pageFilterOptional;

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
    console.log('error parsing experiment config:', e, experiences);
  }
  return null;
}

export function parseExperimentSupport(json) {
  if (!json.experiences) return {};
  const sheets = {};
  Object.entries(json).forEach(([sheetName, sheet]) => {
    if (sheetName !== 'experiences' && !sheetName.startsWith(':')) {
      try {
        sheet.data.forEach((line) => {
          const { key } = line;
          Object.entries(line).forEach(([rowName, value]) => {
            if (rowName !== 'key') {
              if (!sheets[sheetName]) sheets[sheetName] = {};
              if (rowName === 'value') {
                sheets[sheetName][key] = value;
              } else {
                if (!sheets[sheetName][key]) sheets[sheetName][key] = {};
                sheets[sheetName][key][rowName] = value;
              }
            }
          });
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('error parsing experiment support:', e, json[sheet]);
      }
    }
  });
  return sheets;
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
    if (!resp.ok) {
      console.log('error loading experiment config:', resp);
      return null;
    }
    const json = await resp.json();
    return json.data;
  } catch (e) {
    console.log(`error loading experiment manifest: ${path}`, e);
  }
  return null;
}

export async function getExpConfig(experimentName, variantLabel, manifestData, manifestPath) {
  console.log('Experiment: ', experimentName || manifestPath);

  const data = manifestData || await fetchManifest(normalizePath(manifestPath));
  const config = parseExperimentConfig(data);

  if (!config) {
    console.log('Error loading experiment config: ', experimentName || manifestPath);
    return {};
  }

  const selectedVariant = getPersonalizationVariant(config.variantNames, variantLabel);

  if (selectedVariant && config.variantNames.includes(selectedVariant)) {
    config.run = true;
    config.selectedVariantName = selectedVariant;
    config.selectedVariant = config.variants[selectedVariant];
  }

  config.experimentName = experimentName;
  config.manifest = manifestPath;
  return config;
}

export async function fragmentPersonalization(doc) {
  const fpTableRows = doc.querySelectorAll('.fragment-personalization > div');
  doc.querySelector('.fragment-personalization').remove();
  if (!fpTableRows) return doc;

  const variantNames = [];
  const info = [...fpTableRows].reduce((obj, row) => {
    if (row.children[0]?.innerText?.toLowerCase() === 'action') {
      return obj;
    }
    const variantName = row.children[2].innerText?.toLowerCase();
    if (!variantNames.includes(variantName)) {
      variantNames.push(variantName);
      obj[variantName] = [];
    }
    console.log(row.children[3]);
    obj[variantName].push({
      action: row.children[0].innerText?.toLowerCase(),
      selector: row.children[1].innerText?.toLowerCase(),
      htmlFragment: row.children[3].firstElementChild,
    });
    return obj;
  }, {});

  const selectedVariant = getPersonalizationVariant(variantNames);
  if (selectedVariant) {
    info[selectedVariant].forEach((cmd) => {
      const selectedEl = doc.querySelector(cmd.selector);
      if (!selectedEl) return;

      if (['replace', 'replacecontent'].includes(cmd.action)) {
        selectedEl.replaceWith(cmd.htmlFragment);
      } else if (['insertbefore', 'insertcontentbefore'].includes(cmd.action)) {
        selectedEl.insertAdjacentElement('beforebegin', cmd.htmlFragment);
      } else if (['insertafter', 'insertcontentafter'].includes(cmd.action)) {
        selectedEl.insertAdjacentElement('afterend', cmd.htmlFragment);
      } else if (['remove', 'removecontent'].includes(cmd.action)) {
        selectedEl.remove();
      }
    });
  }
  return doc;
}

export async function runExperiment(experimentInfo) {
  const {
    experimentName,
    manifestData,
    manifestPath,
    variantLabel,
  } = experimentInfo;

  const experiment = await getExpConfig(experimentName, variantLabel, manifestData, manifestPath);

  const { selectedVariant } = experiment;
  if (!selectedVariant) return {};

  if (selectedVariant.replacepage) {
    // only one replacepage can be defined
    await replaceInner(selectedVariant.replacepage[0], document.querySelector('main'));
  }

  selectedVariant.insertscript?.map((script) => utils.loadScript(script.val));
  selectedVariant.updatemetadata?.map((metadata) => setMetadata(metadata));

  handleCommands(selectedVariant);

  return {
    experiment,
    blocks: selectedVariant.useblockcode,
    fragments: selectedVariant.replacefragment,
  };
}

export async function applyPersonalization(
  { persManifests = [], targetManifests = [] },
  { createTag, loadScript, getConfig, setConfig },
) {
  if (!(persManifests.length || targetManifests.length)) return;

  utils = { createTag, loadScript };

  let manifests = targetManifests;

  manifests = manifests.concat(
    persManifests.map((manifestPath) => ({ manifestPath: appendJsonExt(manifestPath) })),
  );

  let results = [];
  for (const manifest of manifests) {
    results.push(await runExperiment(manifest));
  }

  results = results.filter(Boolean);
  // Currently required for preview.js
  window.hlx ??= {};
  window.hlx.experiments = results.map((r) => r.experiment);

  setConfig({
    ...getConfig(),
    experiments: results.map((r) => r.experiment),
    experimentBlocks: consolidateObjects(results, 'blocks'),
    experimentFragments: consolidateObjects(results, 'fragments'),
  });
}
