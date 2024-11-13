import { getFederatedContentRoot } from '../../utils/federated.js';
import { loadLink, loadStyle } from '../../utils/utils.js';

let fetchedIcons;
let fetched = false;
const iconsSVG = {};

async function getSVGsfromFile(path) {
  /* c8 ignore next */
  if (!path) return null;
  const resp = await fetch(path);
  /* c8 ignore next */
  if (!resp.ok) return null;
  const miloIcons = {};
  const text = await resp.text();
  const parser = new DOMParser();
  const parsedText = parser.parseFromString(text, 'image/svg+xml');
  const symbols = parsedText.querySelectorAll('symbol');
  symbols.forEach((symbol) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    while (symbol.firstChild) svg.appendChild(symbol.firstChild);
    [...symbol.attributes].forEach((attr) => svg.attributes.setNamedItem(attr.cloneNode()));
    svg.classList.add('icon-milo', `icon-milo-${svg.id}`);
    miloIcons[svg.id] = svg;
  });
  return miloIcons;
}

// TODO: remove after all consumers have stopped calling this method
// eslint-disable-next-line no-async-promise-executor
export const fetchIcons = (config) => new Promise(async (resolve) => {
  /* c8 ignore next */
  if (!fetched) {
    const { miloLibs, codeRoot } = config;
    const base = miloLibs || codeRoot;
    fetchedIcons = await getSVGsfromFile(`${base}/img/icons/icons.svg`);
    fetched = true;
  }
  resolve(fetchedIcons);
});

async function fetchIcon(root, name) {
  return new Promise((resolve) => {
    (async () => {
      try {
        const url = `${root}/federal/assets/icons/svgs/${name}.svg`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.statusText}`);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) throw new Error('Missing SVG Content');
        const asset = svg.cloneNode(true);
        asset.classList.add('icon-milo', `icon-milo-${name}`);
        iconsSVG[name] = asset;
        resolve();
      } catch (error) {
        window.lana?.log(`Error fetching SVG for ${name}:`, error);
        resolve();
      }
    })();
  });
}

async function injectSVG(icon) {
  if (!icon.dataset.name) return;
  if (iconsSVG[icon.dataset.name] && !icon.dataset.svgInjected) {
    icon.appendChild(iconsSVG[icon.dataset.name].cloneNode(true));
    icon.dataset.svgInjected = true;
  }
}

function setIconAttrs(icon, iconKey) {
  icon.dataset.name = iconKey;
  const em = icon.closest('em');
  const content = em?.textContent.split('|');
  if (em && content) {
    icon.dataset.tooltip = content.pop().trim();
    const place = content.pop()?.trim().toLowerCase() || 'right';
    // support legacy tooltip authoring
    const iconName = iconKey === 'tooltip' ? 'info-outline' : iconKey;
    icon.dataset.name = iconName;
    icon.className = `icon icon-${iconName} milo-tooltip ${place}`;
    em.parentElement.replaceChild(icon, em);
  }
  const parent = icon.parentNode;
  const children = parent.childNodes;
  const nodeIndex = [...children].indexOf.call(children, icon);
  let indexClass = (nodeIndex === children.length - 1) ? 'last' : 'middle';
  if (nodeIndex === 0) indexClass = 'first';
  if (children.length === 1) indexClass = 'only';
  icon.classList.add(`node-index-${indexClass}`);
}

export default async function decorateIcons(icons, config) {
  if (!icons.length) return;
  const root = getFederatedContentRoot();
  loadStyle(`${config.base}/features/icons/icons.css`);
  const keys = new Set();
  const assets = {};
  const requests = [];
  icons.forEach((icon) => {
    const iconName = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (!iconName) return;
    setIconAttrs(icon, iconName);
    // preload icons above the fold
    if (!keys.has(icon.dataset.name)) {
      keys.add(icon.dataset.name);
      const path = `${root}/federal/assets/icons/svgs/${icon.dataset.name}.svg`;
      loadLink(path, { rel: 'preload', as: 'fetch', crossorigin: 'anonymous' });
    }
    if (assets[icon.dataset.name] && icon.dataset.svgInjected) return;
    assets[icon.dataset.name] = fetchIcon(root, icon.dataset.name);
    requests.push(assets[icon.dataset.name]);
    const listItem = icon.parentElement.closest('li');
    listItem?.classList.add('icon-list-item');
  });
  await Promise.all(requests);
  icons.forEach((icon) => injectSVG(icon));
}
