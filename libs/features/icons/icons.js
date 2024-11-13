import { getFederatedContentRoot } from '../../utils/federated.js';
import { loadLink, loadStyle } from '../../utils/utils.js';

let fetchedIcons;
let fetched = false;
const iconSVG = {};

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
        const icon = await fetch(url);
        if (!icon.ok) throw new Error(`Failed to fetch SVG: ${icon.statusText}`);
        const text = await icon.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (!svg) throw new Error('Missing SVG Content');
        const asset = svg.cloneNode(true);
        asset.classList.add('icon-milo', `icon-milo-${name}`);
        iconSVG[name] = asset;
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
  if (iconSVG[icon.dataset.name] && !icon.dataset.svgInjected) {
    icon.appendChild(iconSVG[icon.dataset.name].cloneNode(true));
    icon.dataset.svgInjected = true;
  }
}

function setIconAttrs(icon) {
  const em = icon.closest('em');
  const content = em?.textContent.split('|');
  if (em && content) {
    icon.dataset.tooltip = content.pop().trim();
    const place = content.pop()?.trim().toLowerCase() || 'right';
    const defaultIcon = 'info-outline';
    icon.className = `icon icon-${defaultIcon} milo-tooltip ${place}`;
    icon.dataset.name = defaultIcon;
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

export default async function decorateAllIcons(icons, config) {
  if (!icons.length) return;
  const root = getFederatedContentRoot();
  loadStyle(`${config.base}/features/icons/icons.css`);
  const iconKeys = new Set();
  const iconAssets = {};
  const requests = [];
  icons.forEach((icon) => {
    setIconAttrs(icon);
    const iconKey = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (!iconKey) return;
    icon.dataset.name = iconKey;
    // preload icons above the fold
    if (!iconKeys.has(iconKey)) {
      iconKeys.add(iconKey);
      const path = `${root}/federal/assets/icons/svgs/${iconKey}.svg`;
      loadLink(path, { rel: 'preload', as: 'fetch', crossorigin: 'anonymous' });
    }
    if (iconAssets[iconKey] && !icon.dataset.svgInjected) return;
    iconAssets[iconKey] = fetchIcon(root, iconKey);
    requests.push(iconAssets[iconKey]);
    const parent = icon.parentElement;
    if (parent && parent.parentElement.tagName === 'LI') {
      parent.parentElement.classList.add('icon-list-item');
    }
  });
  await Promise.all(requests);
  icons.forEach((icon) => injectSVG(icon));
}
