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

async function decorateToolTip(icon) {
  const wrapper = icon.closest('em');
  if (!wrapper) return;
  wrapper.className = 'tooltip-wrapper';
  const conf = wrapper.textContent.split('|');
  // Text is the last part of a tooltip
  const content = conf.pop().trim();
  if (!content) return;
  icon.dataset.tooltip = content;
  // Position is the next to last part of a tooltip
  const place = conf.pop()?.trim().toLowerCase() || 'right';
  const defaultIcon = 'info-outline';
  icon.className = `icon icon-${defaultIcon} milo-tooltip ${place}`;
  icon.dataset.name = defaultIcon;
  wrapper.parentElement.replaceChild(icon, wrapper);
}

export function getIconData(icon) {
  const fedRoot = getFederatedContentRoot();
  const name = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
  const path = `${fedRoot}/federal/assets/icons/svgs/${name}.svg`;
  return { path, name };
}

function preloadInViewIconResources(config) {
  const { base } = config;
  loadStyle(`${base}/features/icons/icons.css`);
  loadLink(`${base}/utils/federated.js`, { rel: 'preload', as: 'script', crossorigin: 'anonymous' });
  loadLink(`${base}/features/icons/icons.js`, { rel: 'preload', as: 'script', crossorigin: 'anonymous' });
}

const preloadInViewIcons = async (icons = []) => icons.forEach((icon) => {
  const { path } = getIconData(icon);
  loadLink(path, { rel: 'preload', as: 'fetch', crossorigin: 'anonymous' });
});

function isElementInView(e) {
  const rect = e.getBoundingClientRect();
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

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

export async function decorateIcons(area, icons, config) {
  if (!icons.length) return;
  const iconsATF = [...icons].filter((icon) => isElementInView(icon));
  const uniqueIcons = filterDuplicatedIcons(iconsATF);
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
    const isToolTip = icon.classList.contains('icon-tooltip');
    if (isToolTip) decorateToolTip(icon);
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
