import { getFederatedContentRoot, getFederatedUrl } from '../../utils/federated.js';
import { loadLink } from '../../utils/utils.js';

let fetchedIcons;
let fetched = false;

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
export const fetchIcons = (icons, config) => new Promise(async (resolve) => {
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

export async function getSvgFromFile(path, name) {
  /* c8 ignore next */
  if (!path) return null;

  let resp;
  try {
    // if (fetchedIcons[name] === undefined) return fetchIcons[name];
    resp = await fetch(path);
    const text = await resp.text();
    const parser = new DOMParser();
    const parsedText = parser.parseFromString(text, 'image/svg+xml');
    const svg = parsedText.firstChild;
    svg.id = name;
    const parsedSvg = parsedText.querySelector('svg');
    parsedSvg.classList.add('icon-milo', `icon-milo-${name}`);
    fetchedIcons[name] = parsedSvg;
    return parsedSvg;
  } catch (error) {
    return null;
  }
}

async function decorateIcon(icon) {
  const iconName = Array.from(icon.classList)
    .find((c) => c.startsWith('icon-'))
    .substring(5);
  if (fetchedIcons[iconName] !== undefined || iconName === 'tooltip') return icon;
  const fedRoot = getFederatedContentRoot();
  const svgFedPath = `${fedRoot}/federal/assets/icons/svgs/${iconName}.svg`;
  const newIcon = await getSvgFromFile(svgFedPath, iconName);
  return newIcon;
}

export default async function loadIcons(icons, config) {
  const iconSVGs = await fetchIcons(icons, config);
  if (!iconSVGs) return;
  icons.forEach(async (icon) => {
    icon.classList.add('milo-icon');
    await decorateIcon(icon, config);
    const { classList } = icon;
    if (classList.contains('icon-tooltip')) decorateToolTip(icon);
    const iconName = icon.classList[1].replace('icon-', '');
    const existingIcon = icon.querySelector('svg');
    if (!iconSVGs[iconName] || existingIcon) return;
    const parent = icon.parentElement;
    if (parent.parentElement.tagName === 'LI') parent.parentElement.classList.add('icon-list-item');
    icon.insertAdjacentHTML('afterbegin', iconSVGs[iconName].outerHTML);
  });
}
