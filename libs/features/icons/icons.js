import { getFederatedContentRoot } from '../../utils/federated.js';

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

function decorateToolTip(icon) {
  const wrapper = icon.closest('em');
  wrapper.className = 'tooltip-wrapper';
  if (!wrapper) return;
  const conf = wrapper.textContent.split('|');
  // Text is the last part of a tooltip
  const content = conf.pop().trim();
  if (!content) return;
  icon.dataset.tooltip = content;
  // Position is the next to last part of a tooltip
  const place = conf.pop()?.trim().toLowerCase() || 'right';
  icon.className = `icon icon-info milo-tooltip ${place}`;
  wrapper.parentElement.replaceChild(icon, wrapper);
}

export function setNodeIndexClass(icon) {
  const parent = icon.parentNode;
  const children = parent.childNodes;
  console.log('parent', parent, 'children', children);
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
    icon.classList.add('milo-icon');
    setNodeIndexClass(icon);
    const iconName = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (icon.dataset.svgInjected || !iconName) return;
    if (iconName === 'tooltip') {
      decorateToolTip(icon);
      return;
    }
    if (!federalIcons[iconName] && !iconsToFetch.has(iconName)) {
      const url = `${fedRoot}/federal/assets/icons/svgs/${iconName}.svg`;
      iconsToFetch.set(iconName, fetch(url).then(async (response) => {
        if (!response.ok) throw new Error(`Failed to fetch SVG for ${iconName}: ${response.statusText}`);
        federalIcons[iconName] = await response.text();
      }));
    }
    iconRequests.push(iconsToFetch.get(iconName));

    const parent = icon.parentElement;
    if (parent && parent.parentElement.tagName === 'LI') parent.parentElement.classList.add('icon-list-item');
  });

  try {
    await Promise.all(iconRequests);
  } catch (error) {
    /* c8 ignore next 2 */
    window.lana.log('Error fetching icons:', error);
  }

  icons.forEach((icon) => {
    const iconName = [...icon.classList].find((c) => c.startsWith('icon-'))?.substring(5);
    if (iconName && federalIcons[iconName] && !icon.dataset.svgInjected) {
      icon.insertAdjacentHTML('afterbegin', federalIcons[iconName]);
      icon.dataset.svgInjected = 'true';
    }
  });
}
