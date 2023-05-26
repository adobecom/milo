const ALL = 'all';

const SPLIT_RE = /,|(\s+)|(\\n)/g;

const MANIFEST_KEYS = [
  'action',
  'selector',
  'pageFilter',
  'pageFilterOptional',
];

const COMMANDS = {
  insertcontentafter: (el, fragment) => el.insertAdjacentElement('afterend', fragment),
  insertcontentbefore: (el, fragment) => el.insertAdjacentElement('beforebegin', fragment),
  removecontent: (el) => el.remove(),
  replacecontent: (el, fragment) => el.replaceWith(fragment),
};

const COMMANDSHTML = {
  before: (el, html) => el.insertAdjacentHTML('beforebegin', html),
  after: (el, html) => el.insertAdjacentHTML('afterend', html),
  replace: (el, html) => { el.outerHTML = html; },
  remove: (el) => el.remove(),
};

export const PERSONALIZATION_TAGS = {
  chrome: () => navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Mobile'),
  firefox: () => navigator.userAgent.includes('Firefox') && !navigator.userAgent.includes('Mobile'),
  android: () => navigator.userAgent.includes('Android'),
  ios: () => /iPad|iPhone|iPod/.test(navigator.userAgent),
  loggedout: () => !window.adobeIMS?.isSignedInUser(),
  loggedin: () => window.adobeIMS?.isSignedInUser(),
};

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

const handleCommands = (
  selectedVariant,
  createTag,
  content,
) => {
  const createFragmentLink = (url) => {
    const a = createTag('a', { href: url }, url);
    const p = createTag('p', undefined, a);
    return p;
  };

  const validCommands = Object.keys(COMMANDS);
  const mainEl = document.querySelector('main');

  selectedVariant.commands.forEach((cmd) => {
    if (validCommands.includes(cmd.action)) {
      let targetEl = mainEl.querySelector(cmd.selector);

      if (!targetEl) return;

      // TODO: why?
      if (targetEl.classList[0] === 'section-metadata') {
        targetEl = targetEl.parentElement || targetEl;
      }

      // TODO: commented out content code for now - only frags supported
      // if (cmd !== 'remove' && content[selectedVariant[name][i]]) {
      //   const parser = new DOMParser();
      //   const dom = parser.parseFromString(content[selectedVariant[name][i]], 'text/html');
      //   COMMANDS[cmd](targetEl, dom);
      // } else {
      COMMANDS[cmd.action](targetEl, cmd !== 'remove' && createFragmentLink(cmd.target));
      // }
    } else {
      console.log('Invalid command found: ', cmd);
    }
  });
};

export const toClassName = (name) => (
  typeof name === 'string'
    ? name
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    : ''
);

export const toCamelCase = (...names) => {
  const ccNames = names.map((name) => toClassName(name)
    .replace(/-([a-z])/g, (g) => g[1].toUpperCase()));
  return ccNames.length === 1 ? ccNames[0] : ccNames;
};

export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return (meta && meta.content) || '';
}

function convertKeysToCamelCase(obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[toCamelCase(key)] = obj[key];
    return newObj;
  }, {});
}

/**
 * Parses the experimentation configuration sheet and creates an internal model.
 *
 * Output model is expected to have the following structure:
 *      {
 *        id: <string>,
 *        label: <string>,
 *        blocks: [<string>]
 *        audience: Desktop | Mobile,
 *        status: Active | Inactive,
 *        variantNames: [<string>],
 *        variants: {
 *          [variantName]: {
 *            label: <string>
 *            percentageSplit: <number 0-1>,
 *            pages: <string>,
 *            blocks: <string>,
 *          }
 *        }
 *      };
 */
export function parseExperimentConfig(data) {
  const config = {};

  const validCommands = Object.keys(COMMANDS);
  // update keys
  const experiences = data.map((d) => convertKeysToCamelCase(d));
  try {
    const variants = {};
    const variantNames = Object.keys(experiences[0])
      // .map((vn) => toCamelCase(vn))
      .filter((vn) => !MANIFEST_KEYS.includes(vn));

    variantNames.forEach((variantName) => {
      variants[variantName] = { commands: [] };
    });

    const globalCommands = ['insertscript', 'replacefragment', 'replacepage', 'useblockcode'];

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

        if (globalCommands.includes(action)) {
          if (!variants[vn][action]) {
            variants[vn][action] = {};
          }
          if (action === 'replacepage') {
            variants[vn][action] = normalizePath(line[vn]);
          } else {
            variants[vn][action][normalizePath(selector)] = normalizePath(line[vn]);
          }
        } else if (validCommands.includes(action)) {
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
    // eslint-disable-next-line no-console
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

/**
 * Replaces element with content from path
 * @param {string} path
 * @param {HTMLElement} element
 * @param {boolean} isBlock
 */
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

/**
 * Gets experiment config from the manifest and transforms it to more easily
 * consumable structure.
 *
 * the manifest consists of two sheets "settings" and "experiences", by default
 *
 * "settings" is applicable to the entire test and contains information
 * like "Audience", "Status" or "Blocks".
 *
 * "experience" hosts the experiences in rows, consisting of:
 * a "Percentage Split", "Label" and a set of "Links".
 *
 *
 * @param {string} experimentId
 * @param {object} cfg
 * @returns {object} containing the experiment manifest
 */
export async function getConfigForFullExperiment(experiment, manifestData, manifestPath) {
  const exp = experiment || manifestPath || 'unknown';
  const experimentId = exp.includes('/')
    ? exp.slice(exp.lastIndexOf('/') + 1)
    : exp;

  let path = manifestPath
    || (experiment.includes('/')
      ? `${experiment}.json`
      : `/experiments/${experimentId}/manifest.json`);

  path = normalizePath(path);

  try {
    let data;
    if (manifestData) {
      data = manifestData;
    } else {
      const resp = await fetch(path);
      if (!resp.ok) {
        console.log('error loading experiment config:', resp);
        return null;
      }
      const json = await resp.json();
      data = json.data;
    }
    const config = parseExperimentConfig(data);
    if (!config) {
      return null;
    }
    config.id = experimentId;
    config.manifest = path;
    return config;
  } catch (e) {
    console.log(`error loading experiment manifest: ${path}`, e);
  }
  return null;
}

function splitCamelCase (str) {
  return str.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase().split('-');
}

function getPersonalizationVariant(config) {
  const { variantNames = [] } = config;
  const tagNames = Object.keys(PERSONALIZATION_TAGS);
  const matchingVariant = variantNames.find((variant) => {
    const names = splitCamelCase(variant);
    if (names.some((name) => tagNames.includes(name) && PERSONALIZATION_TAGS[name]())) {
      return variant;
    }
    return false;
  });
  return matchingVariant;
}

export async function getConfig(experimentName, variantLabel, manifestData, manifestPath) {
  let selectedVariant = variantLabel;
  console.log('Experiment: ', experimentName);
  const config = await getConfigForFullExperiment(experimentName, manifestData, manifestPath);

  if (!config) {
    console.log('Error loading experiment config: ', experimentName);
    return {};
  }

  if (!selectedVariant) {
    selectedVariant = getPersonalizationVariant(config);
  }

  if (selectedVariant && config.variantNames.includes(selectedVariant)) {
    config.run = true;
    config.selectedVariantName = selectedVariant;
    config.selectedVariant = config.variants[selectedVariant];
  }

  config.experimentName = experimentName;
  return config;
}

const checkForPageReplacement = async (controlPages, selectedPages, id, content) => {
  if (!controlPages?.length || !selectedPages?.length) return;

  const currentPath = window.location.pathname;
  const index = controlPages.indexOf(currentPath);
  if (index >= 0 || selectedPages[index] !== currentPath) {
    document.body.classList.add(`experiment-${id}`);
    if (content?.[selectedPages[index]]) {
      document.querySelector('main').innerHTML = content[selectedPages[index]];
    } else {
      await replaceInner(selectedPages[index], document.querySelector('main'));
    }
  }
};

const convertToMap = (blockName, control, selectedVariant) => {
  if (!control[blockName]?.length || !selectedVariant[blockName]?.length) return;
  const blockMap = control[blockName].reduce((map, block, idx) => {
    if (block && selectedVariant[blockName][idx]) {
      map[block] = selectedVariant[blockName][idx];
    }
    return map;
  }, {});
  selectedVariant[blockName] = blockMap;
};

export async function runExperiment(
  experimentInfo,
  createTag,
) {
  const {
    experimentName,
    manifestData,
    manifestPath,
    variantLabel,
  } = experimentInfo;

  const experiment = await getConfig(experimentName, variantLabel, manifestData, manifestPath);
  // const supportData = parseExperimentSupport(manifestData);
  const supportData = { content: {} };

  if (!experiment.selectedVariant) {
    return {};
  }

  const { selectedVariant } = experiment;
  if (selectedVariant.replacepage) {
    await replaceInner(selectedVariant.replacepage, document.querySelector('main'));
  }

  // Handle block movement/replacement
  handleCommands(
    selectedVariant,
    createTag,
    supportData.content,
  );

  return {
    experiment,
    blocks: selectedVariant.useblockcode,
    fragments: selectedVariant.replacefragment,
  };
}
