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
  wrapper.parentElement.replaceChild(icon, wrapper);
}

export function setNodeIndexClass(icon) {
  const parent = icon.parentNode;
  const children = parent.childNodes;
  const nodeIndex = [...children].indexOf.call(children, icon);
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
    icon.setAttribute('data-name', iconName);
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
    const iconName = icon.getAttribute('data-name');
    if (iconName && federalIcons[iconName] && !icon.dataset.svgInjected) {
      const svgClone = federalIcons[iconName].cloneNode(true);
      icon.appendChild(svgClone);
      icon.dataset.svgInjected = 'true';
    }
  });
}
