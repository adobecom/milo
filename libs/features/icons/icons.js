import { createTag } from '../../utils/utils.js';

let fetchedSpriteIcons;
let fetchedLocalIcons;
let fetchedFederalSvgImages;
let fetched = false;

export async function getSvgFromFile(path, name) {
  /* c8 ignore next */
  if (!path) return null;

  let resp;
  try {
    // if (fetchedSpriteIcons[name] === undefined) return fetchIcons[name];
    resp = await fetch(path);
    const text = await resp.text();
    const parser = new DOMParser();
    const parsedText = parser.parseFromString(text, 'image/svg+xml');
    const svg = parsedText.firstChild;
    svg.id = name;
    const parsedSvg = parsedText.querySelector('svg');
    parsedSvg.classList.add('icon-milo', `icon-milo-${name}`);
    return parsedSvg;
  } catch (error) {
    return null;
  }
}

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
    fetchedSpriteIcons = await getSVGsfromFile(`${base}/img/icons/icons.svg`);
    fetched = true;
  }
  resolve(fetchedSpriteIcons);
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

function isUrlValid(string) {
  try {
    const newUrl = new URL(string);
    return newUrl;
  } catch (err) {
    return false;
  }
}

export default async function loadIcons(icons, config) {
  const iconSVGs = await fetchIcons(config);
  if (!iconSVGs) return;
  const { contentRoot } = config.locale;
  icons.forEach(async (icon) => {
    const { classList } = icon;
    if (classList.contains('icon-tooltip')) decorateToolTip(icon);
    const iconName = icon.classList[1].replace('icon-', '');
    const existingIcon = icon.querySelector('svg');
    if (!iconSVGs[iconName] || existingIcon) {
      // check for icon in local /assets/icons/svgs/
      const localIconSvg = await getSvgFromFile(`${contentRoot}/assets/icons/svgs/${iconName}.svg`, iconName);
      if (localIconSvg && localIconSvg !== null) {
        icon.insertAdjacentHTML('afterbegin', localIconSvg.outerHTML);
      } else {
        // check for icon in /federal/libs/img/icons/svgs/ repo as <img/>
        // const federalIconSrc = `https://main--federal--adobecom.aem.page/federal/libs/img/icons/svgs/${iconName}.svg`;
        // const fedUrl = isUrlValid(federalIconSrc);
        // if (!fedUrl) return;
        // const iconImg = createTag('img', { class: `${iconName}`, src: federalIconSrc });
        // icon.insertAdjacentHTML('afterbegin', iconImg.outerHTML);

        // get SVG from adobe.com
        const adobeSrcUrl = await getSvgFromFile(`https://www.adobe.com/federal/libs/img/icons/svgs/${iconName}.svg`, iconName);
        if (adobeSrcUrl) {
          icon.insertAdjacentHTML('afterbegin', adobeSrcUrl.outerHTML);
        }
      }
    } else {
      icon.insertAdjacentHTML('afterbegin', iconSVGs[iconName].outerHTML);
    }

    const parent = icon.parentElement;
    if (parent.childNodes.length > 1) {
      if (parent.lastChild === icon) {
        icon.classList.add('margin-inline-start');
      } else if (parent.firstChild === icon) {
        icon.classList.add('margin-inline-end');
        if (parent.parentElement.tagName === 'LI') parent.parentElement.classList.add('icon-list-item');
      } else {
        icon.classList.add('margin-inline-start', 'margin-inline-end');
      }
    }
  });
}
