import { lanaLog } from '../../blocks/global-navigation/utilities/utilities.js';
import { getFederatedContentRoot } from '../../utils/federated.js';
import { getConfig } from '../../utils/utils.js';

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

export function fetchIconList(url) {
  return fetch(url)
    .then((resp) => resp.json())
    .then((json) => json.content.data)
    .catch(() => {
      lanaLog({ message: 'Failed to fetch iconList', tags: 'icons', errorType: 'error' });
      return [];
    });
}

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
  icon.className = `icon icon-info-outline milo-tooltip ${place}`;
  [['tabindex', '0'], ['aria-label', content], ['role', 'button']].forEach(([attr, value]) => {
    icon.setAttribute(attr, value);
  });
  wrapper.parentElement.replaceChild(icon, wrapper);
}

export function setNodeIndexClass(icon) {
  const children = icon.parentNode.childNodes;
  const nodeIndex = Array.prototype.indexOf.call(children, icon);
  let indexClass = (nodeIndex === children.length - 1) ? 'last' : 'middle';
  if (nodeIndex === 0) indexClass = 'first';
  if (children.length === 1) indexClass = 'only';
  icon.classList.add(`node-index-${indexClass}`);
}

export default async function loadIcons(icons) {
  const fedRoot = getFederatedContentRoot();
  const iconRequests = [];
  const iconsToFetch = new Map();
  icons.forEach((icon) => {
    setNodeIndexClass(icon);
    if (icon.classList.contains('icon-tooltip')) decorateToolTip(icon);
    const iconName = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (icon.dataset.svgInjected || !iconName) return;
    if (!federalIcons[iconName] && !iconsToFetch.has(iconName)) {
      iconsToFetch.set(iconName, fetch(`${fedRoot}/federal/assets/icons/svgs/${iconName}.svg`)
        .then(async (res) => {
          if (!res.ok) throw new Error(`Failed to fetch SVG for ${iconName}: ${res.statusText}`);
          const text = await res.text();
          const parser = new DOMParser();
          const svgElement = parser.parseFromString(text, 'image/svg+xml').querySelector('svg');
          if (!svgElement) {
            lanaLog({ message: `No SVG element found in fetched content for ${iconName}`, tags: 'icons', errorType: 'error' });
            return;
          }
          svgElement.classList.add('icon-milo', `icon-milo-${iconName}`);
          federalIcons[iconName] = svgElement;
        })
        .catch(async (e) => {
          lanaLog({ message: `Error fetching federal SVG for ${iconName}, falling back to Milo icon`, e, tags: 'icons', errorType: 'error' });
          // Fallback to Milo icons
          if (!fetchedIcons) {
            const { miloLibs, codeRoot } = getConfig();
            const base = miloLibs || codeRoot;
            fetchedIcons = await getSVGsfromFile(`${base}/img/icons/icons.svg`);
          }
          if (fetchedIcons?.[iconName]) {
            federalIcons[iconName] = fetchedIcons[iconName].cloneNode(true);
            return;
          }
          lanaLog({ message: `No fallback Milo icon found for ${iconName}`, e, tags: 'icons', errorType: 'error' });
        }));
    }
    iconRequests.push(iconsToFetch.get(iconName));
    const parent = icon.parentElement;
    if (parent && parent.parentElement.tagName === 'LI') parent.parentElement.classList.add('icon-list-item');
  });
  await Promise.all(iconRequests);
  icons.forEach((icon) => {
    const iconName = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (iconName && federalIcons[iconName] && !icon.dataset.svgInjected) {
      const svgClone = federalIcons[iconName].cloneNode(true);
      icon.appendChild(svgClone);
      icon.dataset.svgInjected = 'true';
    }
  });
}
