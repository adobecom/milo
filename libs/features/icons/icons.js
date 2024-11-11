import { getFederatedContentRoot } from '../../utils/federated.js';
import { loadLink, loadStyle } from '../../utils/utils.js';

let fetchedIcons;
let fetched = false;
const federalIcons = {};

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

export function getIconData(icon) {
  const fedRoot = getFederatedContentRoot();
  const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
  const path = `${fedRoot}/federal/assets/icons/svgs/${name}.svg`;
  return { path, name };
}

function preloadInViewIconResources(config) {
  const { base } = config;
  loadStyle(`${base}/features/icons/icons.css`);
}

const preloadInViewIcons = async (icons = []) => icons.forEach((icon) => {
  const { path } = getIconData(icon);
  loadLink(path, { rel: 'preload', as: 'fetch', crossorigin: 'anonymous' });
});

function filterDuplicatedIcons(icons) {
  if (!icons.length) return [];
  const uniqueIconKeys = new Set();
  const uniqueIcons = [];
  for (const icon of icons) {
    const key = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (!uniqueIconKeys.has(key)) {
      uniqueIconKeys.add(key);
      uniqueIcons.push(icon);
    }
  }
  return uniqueIcons;
}

function handleLegacyToolTip(icons) {
  const tooltips = [...icons].filter((icon) => icon.classList.contains('icon-tooltip'));
  if (!tooltips.length) return;
  tooltips.forEach((icon) => icon.classList.replace('icon-tooltip', 'icon-info-outline'));
}

export async function decorateIcons(icons, config) {
  if (!icons.length) return;
  handleLegacyToolTip(icons);
  const uniqueIcons = filterDuplicatedIcons(icons);
  if (!uniqueIcons.length) return;
  preloadInViewIcons(uniqueIcons);
  preloadInViewIconResources(config);
  icons.forEach((icon) => {
    const iconName = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (!iconName) return;
    icon.dataset.name = iconName;
  });
}

export default async function loadIcons(icons) {
  const fedRoot = getFederatedContentRoot();
  const iconRequests = [];
  const iconsToFetch = new Map();

  icons.forEach(async (icon) => {
    if (icon.dataset.tooltip) {
      icon.classList.add('milo-tooltip', icon.dataset.tooltipdir);
    }
    const iconName = icon.dataset.name;
    if (icon.dataset.svgInjected || !iconName) return;
    if (!federalIcons[iconName] && !iconsToFetch.has(iconName)) {
      const url = `${fedRoot}/federal/assets/icons/svgs/${iconName}.svg`;
      iconsToFetch.set(iconName, fetch(url)
        .then(async (res) => {
          if (!res.ok) throw new Error(`Failed to fetch SVG for ${iconName}: ${res.statusText}`);
          const text = await res.text();
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(text, 'image/svg+xml');
          const svgElement = svgDoc.querySelector('svg');
          if (!svgElement) {
            window.lana?.log(`No SVG element found in fetched content for ${iconName}`);
            return;
          }
          const svgClone = svgElement.cloneNode(true);
          svgClone.classList.add('icon-milo', `icon-milo-${iconName}`);
          federalIcons[iconName] = svgClone;
        })
        /* c8 ignore next 3 */
        .catch((error) => {
          window.lana?.log(`Error fetching SVG for ${iconName}:`, error);
        }));
    }
    iconRequests.push(iconsToFetch.get(iconName));
    const parent = icon.parentElement;
    if (parent && parent.parentElement.tagName === 'LI') parent.parentElement.classList.add('icon-list-item');
  });

  await Promise.all(iconRequests);

  icons.forEach((icon) => {
    const iconName = icon.dataset.name;
    if (iconName && federalIcons[iconName] && !icon.dataset.svgInjected) {
      const svgClone = federalIcons[iconName].cloneNode(true);
      icon.appendChild(svgClone);
      icon.dataset.svgInjected = 'true';
    }
  });
}
