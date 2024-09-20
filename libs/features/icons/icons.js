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

export function setNodeIndexClass(icons) {
  icons.forEach(async (icon) => {
    const parent = icon.parentNode;
    const children = parent.childNodes;
    const nodeIndex = Array.prototype.indexOf.call(children, icon);
    let indexClass = (nodeIndex === children.length - 1) ? 'last' : 'middle';
    if (nodeIndex === 0) indexClass = 'first';
    if (children.length === 1) indexClass = 'only';
    icon.classList.add(`node-index-${indexClass}`);
  });
}

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

// Function to fetch and inject SVG icons
export async function injectSVGIcons(icons) {
  const fedRoot = getFederatedContentRoot();
  // Iterate through each icon element
  for (const icon of icons) {
    // Extract the icon name from the class list (assuming it is the second class)
    const iconName = [...icon.classList].find((c) => c.startsWith('icon-')).substring(5);
    if (!iconName || iconName === 'tooltip') return;
    try {
      if (!federalIcons[iconName]) {
        const url = `${fedRoot}/federal/assets/icons/svgs/${iconName}.svg`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch SVG for ${iconName}: ${response.statusText}`);
        const svgText = await response.text();
        federalIcons[iconName] = svgText;
      }
      icon.insertAdjacentHTML('afterbegin', federalIcons[iconName]);
    } catch (error) {
      console.error(`Error fetching or inserting icon ${iconName}:`, error);
    }
  }
}

export default async function loadIcons(icons) {
  injectSVGIcons(icons);
  icons.forEach(async (icon) => {
    icon.classList.add('milo-icon');
    if (icon.classList.contains('icon-tooltip')) decorateToolTip(icon);
    const parent = icon.parentElement;
    if (parent.parentElement.tagName === 'LI') parent.parentElement.classList.add('icon-list-item');
  });
}
