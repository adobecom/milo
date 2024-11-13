import { getFederatedContentRoot } from '../../utils/federated.js';
import { loadLink, loadStyle } from '../../utils/utils.js';

let fetchedIcons;
let fetched = false;

const fedRoot = getFederatedContentRoot();
const iconKeys = new Set();
const iconSvgs = {};

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

function preloadIcon(icon) {
  if (iconKeys.has(icon)) return;
  iconKeys.add(icon);
  loadLink(
    `${fedRoot}/federal/assets/icons/svgs/${icon}.svg`,
    { rel: 'preload', as: 'fetch', crossorigin: 'anonymous' },
  );
}

function setLegacyToolTip(icon, key) {
  // support for legacy tooltip
  icon.dataset.name = 'info-outline';
  icon.classList.replace(`icon-${key}`, 'icon-info-outline');
}

async function fetchIconSvg(icon) {
  return new Promise((resolve) => {
    (async () => {
      const { name, svginjected } = icon.dataset;
      if (svginjected || !name) resolve();
      try {
        const url = `${fedRoot}/federal/assets/icons/svgs/${name}.svg`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch SVG: ${res.statusText}`);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgEl = doc.querySelector('svg');
        if (!svgEl) throw new Error('Missing SVG Content');
        const svg = svgEl.cloneNode(true);
        svg.classList.add('icon-milo', `icon-milo-${name}`);
        iconSvgs[name] = svg;
        resolve();
      } catch (error) {
        window.lana?.log(`Error fetching SVG for ${name}:`, error);
        resolve();
      }
    })();
  });
}

async function decorate(icon) {
  const { name, tooltip, tooltipdir, svginjected } = icon.dataset;
  if (!name) return;
  if (iconSvgs[name] && !svginjected) {
    icon.appendChild(iconSvgs[name].cloneNode(true));
    icon.dataset.svginjected = true;
  }
  if (tooltip) icon.classList.add('milo-tooltip', tooltipdir);
  const listItem = icon.parentElement.closest('li');
  listItem?.classList.add('icon-list-item');
}

function setIconData(icon, name) {
  icon.dataset.name = name;
  const em = icon.closest('em');
  const content = em?.textContent.split('|');
  if (em && content) {
    icon.dataset.tooltip = content.pop().trim();
    icon.dataset.tooltipdir = content.pop()?.trim().toLowerCase() || 'right';
    if (name === 'tooltip') setLegacyToolTip(icon, name);
    em.parentElement.replaceChild(icon, em);
  }
  const nodes = [...icon.parentNode.childNodes];
  icon.dataset.nodeindex = nodes.length > 1 ? {
    0: 'first',
    [nodes.length - 1]: 'last',
  }[nodes.indexOf.call(nodes, icon)] ?? 'middle' : 'only';
}

export default async function decorateIcons(icons, config) {
  if (!icons.length) return;
  loadStyle(`${config.base}/features/icons/icons.css`);
  await Promise.all([...icons].map((icon) => {
    const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (name) {
      setIconData(icon, name);
      preloadIcon(icon.dataset.name);
    }
    return fetchIconSvg(icon);
  }));
  icons.forEach((icon) => decorate(icon));
}
