const ALL = 'all';

const COMMANDS = {
  before: (el, fragment) => el.insertAdjacentElement('beforebegin', fragment),
  after: (el, fragment) => el.insertAdjacentElement('afterend', fragment),
  replace: (el, fragment) => el.replaceWith(fragment),
  remove: (el) => el.remove(),
};

const handleCommands = (cmdList, control, selectedVariant, createTag) => {
  const createFragment = (url) => {
    const a = createTag('a', { href: url }, url);
    const p = createTag('p', undefined, a);
    return p;
  }

  const validCommands = Object.keys(COMMANDS);
  const mainEl = document.querySelector('main');

  // Used to track when the same command is used multiple times
  const nameIndex = {};

  cmdList.forEach((name) => {
    let all = false;
    let cmd = name;
    if (name.endsWith('All')) {
      all = true;
      cmd = name.slice(0, -3);
    }

    const i = nameIndex[name] === undefined ? 0 : nameIndex[name] + 1;
    nameIndex[name] = i;

    if (validCommands.includes(cmd) && selectedVariant[name][i] && control[name][i]) {
      let targetEls;
      const query = control[name][i].startsWith('.') ? control[name][i] : `.${control[name][i]}`;
      if (all) {
        targetEls = [...mainEl.querySelectorAll(query)];
      } else {
        targetEls = [mainEl.querySelector(query)];
      }
      if (!targetEls.length) return;

      targetEls.forEach((el) => {
        if (!el) return;
        COMMANDS[cmd](el, createFragment(selectedVariant[name][i]));
      });
    }
  });

}

export const toClassName = (name) =>
  typeof name === 'string'
    ? name
        .toLowerCase()
        .replace(/[^0-9a-z]/gi, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    : '';

export const toCamelCase = (name) => toClassName(name).replace(/-([a-z])/g, (g) => g[1].toUpperCase());

export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const $meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return ($meta && $meta.content) || '';
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
export function parseExperimentConfig(json) {
  const config = {};
  const arrayProperties = ['pages', 'blocks', 'before', 'after', 'replace',
    'remove', 'beforeAll', 'afterAll', 'replaceAll', 'removeAll']
  try {
    if (json.settings) {
      json.settings.data.forEach((line) => {
        const key = toCamelCase(line.Name);
        config[key] = line.Value;
      });
    }
    const experiences = json.experiences || json;
    const variants = {};
    let variantNames = Object.keys(experiences.data[0]);
    variantNames.shift();
    variantNames = variantNames.map((vn) => toCamelCase(vn));
    variantNames.forEach((variantName) => {
      variants[variantName] = {};
    });
    let lastKey = 'default';
    config.names = [];
    experiences.data.forEach((line) => {
      let key = toCamelCase(line.Name);
      config.names.push(key || lastKey);
      if (!key) key = lastKey;
      lastKey = key;
      const vns = Object.keys(line);
      vns.shift();
      vns.forEach((vn) => {
        const camelVN = toCamelCase(vn);
        if (arrayProperties.includes(key)) {
          variants[camelVN][key] = variants[camelVN][key] || [];
          if (key === 'pages') variants[camelVN][key].push(line[vn] ? new URL(line[vn]).pathname : '');
          else variants[camelVN][key].push(line[vn]);
        } else {
          variants[camelVN][key] = line[vn];
        }
      });
    });
    config.variants = variants;
    config.variantNames = variantNames;
    return config;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('error parsing experiment config:', e, json);
  }
  return null;
}

export function isValidConfig(config) {
  if (!config.variantNames
    || !config.variantNames.length
    || !config.variants
    || !Object.values(config.variants).length
    || !Object.values(config.variants).every((v) => (
      typeof v === 'object'
      && !!v.blocks
      && !!v.pages
      && (v.percentageSplit === '' || !!v.percentageSplit)
    ))) {
    console.warn('Invalid experiment config. Please review your sheet and parser.');
    return false;
  }
  return true;
}

/**
 * Replaces element with content from path
 * @param {string} path
 * @param {HTMLElement} element
 * @param {boolean} isBlock
 */
export async function replaceInner(path, element) {
  if (!path || !element) return false;
  const plainPath = path.endsWith('.plain.html') ? path : `${path}.plain.html`;
  try {
    const resp = await fetch(plainPath);
    if (!resp.ok) {
      console.log('error loading experiment content:', resp);
      return false;
    }
    const html = await resp.text();
    // eslint-disable-next-line no-param-reassign
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
export function getConfigForInstantExperiment(experimentId, instantExperiment) {
  const config = {
    label: `Instant Experiment: ${experimentId}`,
    audience: '',
    status: 'Active',
    id: experimentId,
    instant: true,
    variants: {},
    variantNames: [],
  };

  const pages = instantExperiment.split(',').map((p) => new URL(p.trim()).pathname);
  const evenSplit = 1 / (pages.length + 1);

  config.variantNames.push('control');
  config.variants.control = {
    percentageSplit: '',
    pages: [window.location.pathname],
    blocks: [],
    label: 'Control',
  };

  pages.forEach((page, i) => {
    const vname = `challenger-${i + 1}`;
    config.variantNames.push(vname);
    config.variants[vname] = {
      percentageSplit: `${evenSplit.toFixed(2)}`,
      pages: [page],
      label: `Challenger ${i + 1}`,
    };
  });

  return (config);
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
export async function getConfigForFullExperiment(experiment) {
  const experimentId = experiment.includes('/') ? experiment.slice(experiment.lastIndexOf('/') + 1) : experiment;
  let path = experiment.includes('/') ? `${experiment}.json` : `/experiments/${experimentId}/manifest.json`;
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  try {
    const resp = await fetch(path);
    if (!resp.ok) {
      console.log('error loading experiment config:', resp);
      return null;
    }
    const json = await resp.json();
    const config = parseExperimentConfig(json);
    if (!config) {
      return null;
    }
    config.id = experimentId;
    config.manifest = path;
    // config.basePath = `${cfg.root}/${experimentId}`;
    return config;
  } catch (e) {
    console.log(`error loading experiment manifest: ${path}`, e);
  }
  return null;
}

export async function getConfig(experimentName, variant, instantExperiment) {
  let config;
  if (instantExperiment) {
    console.log('Instant Experiment: ', instantExperiment);
    config = getConfigForInstantExperiment(experimentName || 'not defined', instantExperiment);

  } else {
    console.log('Experiment: ', experimentName);
    config = await getConfigForFullExperiment(experimentName);
  }

  if (!config) {
    console.log('Error loading experiment config: ', experimentName);
    return {};
  }

  if (config.variantNames.includes(variant)) {
    config.run = true;
    config.selectedVariant = variant;
  }

  config.experimentName = experimentName;

  return config;
}

export async function runExperiment(experiment, pageReplaceEl, createTag) {
  const controlName = experiment.variantNames[0];
  const control = experiment.variants[controlName];

  if (!experiment.selectedVariant || experiment.selectedVariant === controlName) {
    return;
  }

  const selectedVariant = experiment.variants[experiment.selectedVariant];
  const { pages } = selectedVariant;
  if (pages.length) {
    const currentPath = window.location.pathname;
    const index = control.pages.indexOf(currentPath);
    if (index > 0 || pages[index] !== currentPath) {
      // swap page
      document.body.classList.add(`experiment-${experiment.id}`);
      await replaceInner(pages[index], document.querySelector('main'));
    }
  }

  // Handle block movement/replacement
  handleCommands(experiment.names, control, selectedVariant, createTag);
}
