const ALL = 'all';

const MANIFEST_KEYS = [
  'action',
  'selector',
  'pageFilter',
  'pageFilterOptional',
];

const COMMANDS = {
  before: (el, fragment) => el.insertAdjacentElement('beforebegin', fragment),
  after: (el, fragment) => el.insertAdjacentElement('afterend', fragment),
  replace: (el, fragment) => el.replaceWith(fragment),
  remove: (el) => el.remove(),
};

const COMMANDSHTML = {
  before: (el, html) => el.insertAdjacentHTML('beforebegin', html),
  after: (el, html) => el.insertAdjacentHTML('afterend', html),
  replace: (el, html) => { el.outerHTML = html; },
  remove: (el) => el.remove(),
};

const handleCommands = (
  cmdList,
  control,
  selectedVariant,
  createTag,
  content,
) => {
  const createFragment = (url) => {
    const a = createTag('a', { href: url }, url);
    const p = createTag('p', undefined, a);
    return p;
  };

  const validCommands = Object.keys(COMMANDS);
  const mainEl = document.querySelector('main');

  // Used to track when the same command is used multiple times
  const nameIndex = {};

  cmdList.forEach((name) => {
    let cmd = name;

    const i = nameIndex[name] === undefined ? 0 : nameIndex[name] + 1;
    nameIndex[name] = i;

    if (validCommands.includes(cmd) && control[name][i] && selectedVariant[name][i]) {
      const query = control[name][i].startsWith('.') ? control[name][i] : `.${control[name][i]}`;
      let targetEl = mainEl.querySelector(query);

      if (!targetEl) return;

      if (targetEl.classList[0] === 'section-metadata') {
        targetEl = targetEl.parentElement || targetEl;
      }

      if (cmd !== 'remove' && content[selectedVariant[name][i]]) {
        const parser = new DOMParser();
        const dom = parser.parseFromString(content[selectedVariant[name][i]], 'text/html');
        COMMANDS[cmd](targetEl, dom);
      } else {
        COMMANDS[cmd](targetEl, cmd !== 'remove' && createFragment(selectedVariant[name][i]));
      }
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
export function parseExperimentConfig(experiences) {
  const config = { replacepage: {} };
  const ACTIONS = [
    'useblockcode',
    'insertscript',
    'replacecontent',
    'replacefragment',
    'replacepage',
    'insertcontentbefore',
    'insertcontentafter',
    'removecontent',
  ];
  try {
    // if (json.settings) {
    //   json.settings.data.forEach((line) => {
    //     const key = toCamelCase(line.Name);
    //     config[key] = line.Value;
    //   });
    // }
    // const experiences = json.experiences || json;
    const variants = {};
    const variantNames = Object.keys(experiences[0])
      .map((vn) => toCamelCase(vn))
      .filter((vn) => !MANIFEST_KEYS.includes(vn));

    variantNames.forEach((variantName) => {
      variants[variantName] = [];
    });

    experiences.forEach((line) => {
      const action = toCamelCase(line.action);
      const { selector } = line;
      const pageFilter = line.pageFilter || line.pageFilterOptional;

      variantNames.forEach((vn) => {
        if (!line[vn]) return;

        if (ACTIONS.includes(action)) {
          const variantInfo = {
            action,
            selector,
            pageFilter,
            target: line[vn],
          };
          if (action === 'replacepage') {
            config.replacepage[vn] = variantInfo;
          } else {
            variants[vn].push(variantInfo);
          }
        } else {
          console.log('Invalid action found: ', line);
        }
      });
    });
    config.variants = variants;
    config.variantNames = variantNames;
    // config.variantLabels = Object.entries(variants).reduce((labelMap, [variantName, variant]) => {
    //   labelMap[variant.label] = variantName;
    //   return labelMap;
    // }, {});
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

export function isValidConfig(config) {
  if (
    !config.variantNames ||
    !config.variantNames.length ||
    !config.variants ||
    !Object.values(config.variants).length ||
    !Object.values(config.variants).every(
      (v) =>
        typeof v === 'object' &&
        !!v.blocks &&
        !!v.pages &&
        (v.percentageSplit === '' || !!v.percentageSplit)
    )
  ) {
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
  let plainPath = path.endsWith('/') ? `${path}index` : path;
  plainPath = plainPath.endsWith('.plain.html') ? plainPath : `${plainPath}.plain.html`;
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

  return config;
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
export async function getConfigForFullExperiment(experiment, manifestData, manifestLocation) {
  const experimentId = experiment.includes('/')
    ? experiment.slice(experiment.lastIndexOf('/') + 1)
    : experiment;

  let path = manifestLocation
    || (experiment.includes('/')
      ? `${experiment}.json`
      : `/experiments/${experimentId}/manifest.json`);

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

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

export async function getConfig(experimentName, variantLabel, manifestData, manifestLocation) {
  console.log('Experiment: ', experimentName);
  const config = await getConfigForFullExperiment(experimentName, manifestData, manifestLocation);

  if (!config) {
    console.log('Error loading experiment config: ', experimentName);
    return {};
  }

  if (config.variantNames.includes(variantLabel)) {
    config.run = true;
    config.selectedVariantName = variantLabel;
    config.selectedVariant = config.variants[variantLabel];
  }

  config.experimentName = experimentName;
  // config.controlName = config.variantNames[0];
  // config.control = config.variants[config.variantNames[0]];

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
    manifestLocation,
    variantLabel,
  } = experimentInfo;

  const experiment = await getConfig(experimentName, variantLabel, manifestData, manifestLocation);
  const { control } = experiment;
  // const supportData = parseExperimentSupport(manifestData);
  const supportData = { content: {} };

  if (!experiment.selectedVariant || experiment.selectedVariantName === experiment.controlName) {
    return {};
  }

  const { selectedVariant } = experiment;
  await checkForPageReplacement(
    control.pages,
    selectedVariant.pages,
    experiment.id,
    supportData.content,
  );

  // Handle block movement/replacement
  handleCommands(
    experiment.names,
    control,
    selectedVariant,
    createTag,
    supportData.content,
  );

  convertToMap('blocks', control, selectedVariant);
  convertToMap('fragments', control, selectedVariant);

  // swapFragments(selectedVariant.fragments);

  return {
    experiment,
    blocks: selectedVariant.blocks,
    fragments: selectedVariant.fragments,
  };
}
