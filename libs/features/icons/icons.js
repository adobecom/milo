let fetchedIcons;
let fetched = false;
const appIcons = {};
const sizes = ['xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'initial'];

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

async function getSvgFromPath(path, type) {
  /* c8 ignore next */
  if (!path) return null;
  const resp = await fetch(path);
  /* c8 ignore next */
  if (!resp.ok) return null;
  const text = await resp.text();
  const parser = new DOMParser();
  const parsedText = parser.parseFromString(text, 'image/svg+xml');
  const parsedSvg = parsedText.querySelector('svg');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  while (parsedSvg.firstChild) svg.appendChild(parsedSvg.firstChild);
  [...parsedSvg.attributes].forEach((attr) => svg.attributes.setNamedItem(attr.cloneNode()));
  svg.classList.add('icon-milo', `icon-type-${type}`);
  return svg;
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

// eslint-disable-next-line no-async-promise-executor
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

async function fetchIconSprite(icons, config) {
  const iconSVGs = await fetchIcons(config);
  if (!iconSVGs) return;
  icons.forEach(async (icon) => {
    const { classList } = icon;
    if (classList.contains('icon-tooltip')) decorateToolTip(icon);
    const iconName = icon.classList[1].replace('icon-', '');
    if (!iconSVGs[iconName]) return;
    const parent = icon.parentElement;
    if (parent.childNodes.length > 1) {
      if (parent.lastChild === icon) {
        icon.classList.add('margin-left');
      } else if (parent.firstChild === icon) {
        icon.classList.add('margin-right');
        if (parent.parentElement.tagName === 'LI') parent.parentElement.classList.add('icon-list-item');
      } else {
        icon.classList.add('margin-left', 'margin-right');
      }
    }
    icon.insertAdjacentHTML('afterbegin', iconSVGs[iconName].outerHTML);
  });
}

const fetchIcon = async (name, config) => {
  const { miloLibs, codeRoot } = config;
  const base = miloLibs || codeRoot;
  const [folderName, fileName] = name.split(/-(.*)/s);
  // Check if the icon is already in the cache
  if (appIcons[name]) return appIcons[name];
  let foundSize = null;
  sizes.some((size) => {
    if (name.endsWith(`-${size}`)) foundSize = `-${size}`;
    return foundSize;
  });
  let svgPath = `${base}/img/icons/${folderName}/${fileName}.svg`;
  if (foundSize !== null) {
    const nameSplit = fileName.split(foundSize);
    svgPath = `${base}/img/icons/${folderName}/${nameSplit[0]}.svg`;
  }
  const fetchedIcon = await getSvgFromPath(svgPath, folderName);
  if (foundSize !== null) fetchedIcon.iconSize = `icon-size${foundSize}`;
  appIcons[name] = fetchedIcon;
  return fetchedIcon;
};

async function fetchAppIcons(icons, config) {
  const iconsArray = [...icons];
  iconsArray.forEach(async (icon) => {
    const iconName = icon.classList[1].replace('icon-', '');
    if (iconName.startsWith('app-') || iconName.startsWith('ui-')) {
      try {
        const appIcon = await fetchIcon(iconName, config);
        if (appIcon) {
          if (appIcon.iconSize) appIcon.classList.add(appIcon.iconSize);
          icon.insertAdjacentHTML('afterbegin', appIcon.outerHTML);
        }
      } catch (error) {
        console.error(`Error loading icon ${iconName}:`, error);
      }
    }
  });
}

export default async function loadIcons(icons, config) {
  await fetchIconSprite(icons, config);
  await fetchAppIcons(icons, config);
}
