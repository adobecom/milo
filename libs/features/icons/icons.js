import { lanaLog } from '../../blocks/global-navigation/utilities/utilities.js';
import { getFederatedContentRoot } from '../../utils/federated.js';
import { getConfig } from '../../utils/utils.js';

// These are blocks that misuse icons for other purposes
const rogueBlocks = ['unity', 'cc-forms', 'interactive-metadata'];
const iconCache = new Map();
let miloIconsPromise;

let tooltipListenersAdded = false;

function setTooltipPosition(tooltips) {
  const positionClasses = ['top', 'bottom', 'right', 'left'];
  const viewportWidth = window.innerWidth;
  const tooltipMaxWidth = viewportWidth <= 600 ? 200 : 160;
  const tooltipMargin = 12;
  const headerHeight = 64;

  tooltips.forEach((tooltip) => {
    const currentPosition = positionClasses.find((cls) => tooltip.classList.contains(cls));
    if (!tooltip.dataset.originalPosition
      && currentPosition) tooltip.dataset.originalPosition = currentPosition;

    const rect = tooltip.getBoundingClientRect();
    const { originalPosition } = tooltip.dataset;
    const isVerticalPosition = originalPosition === 'top' || originalPosition === 'bottom';
    const effectiveMaxWidth = isVerticalPosition ? tooltipMaxWidth / 2 : tooltipMaxWidth;
    const topMargin = originalPosition === 'top' ? tooltipMargin : 0;
    const tooltipHeight = rect.height;
    const effectiveHeight = originalPosition === 'top' ? tooltipHeight + topMargin : tooltipHeight / 2;
    const willCutoffTop = rect.top - effectiveHeight < headerHeight;
    const willCutoffBottom = rect.bottom + (originalPosition === 'bottom' ? tooltipHeight + tooltipMargin : 0)
    > window.innerHeight;
    const willOverflowRight = rect.right + effectiveMaxWidth + tooltipMargin > viewportWidth;
    const willOverflowLeft = rect.left - effectiveMaxWidth - tooltipMargin < 0;
    const willOverflowRightAtBottom = rect.left + tooltipMaxWidth / 2
     + tooltipMargin > viewportWidth;
    const willOverflowLeftAtBottom = rect.left - tooltipMaxWidth / 2 - tooltipMargin < 0;

    const hasOverflowIssues = willOverflowRight || willOverflowLeft || willCutoffTop
      || willCutoffBottom || willOverflowRightAtBottom || willOverflowLeftAtBottom;
    if ((originalPosition !== currentPosition) && !hasOverflowIssues) {
      tooltip.classList.remove(...positionClasses);
      tooltip.classList.add(originalPosition);
      return;
    }

    let updatedPosition = originalPosition;

    if (willOverflowRight && willOverflowRightAtBottom) {
      updatedPosition = 'left';
    } else if (willOverflowLeft && willOverflowLeftAtBottom) {
      updatedPosition = 'right';
    } else if ((willOverflowRight && willCutoffTop) || (willOverflowLeft && willCutoffTop)) {
      updatedPosition = (willOverflowRightAtBottom && 'left') || (willOverflowLeftAtBottom && 'right') || 'bottom';
    } else if (willOverflowRight || willOverflowLeft) {
      updatedPosition = willOverflowRight ? 'left' : 'right';
    } else if (willCutoffTop && ['top', 'left', 'right'].includes(originalPosition)) {
      updatedPosition = 'bottom';
    } else if (willCutoffBottom && ['bottom', 'left', 'right'].includes(originalPosition)) {
      updatedPosition = 'top';
    }

    if (currentPosition !== updatedPosition) {
      tooltip.classList.remove(...positionClasses);
      tooltip.classList.add(updatedPosition);
    }
  });
}

function addTooltipListeners() {
  tooltipListenersAdded = true;

  ['keydown', 'mouseenter', 'focus', 'mouseleave', 'blur'].forEach((eventType) => {
    document.addEventListener(eventType, (event) => {
      const isTooltip = event.target?.matches?.('.milo-tooltip');
      if (!isTooltip) return;

      if (['mouseenter', 'focus'].includes(eventType)) {
        setTooltipPosition([event.target]);
        event.target.classList.remove('hide-tooltip');
      } else if (['mouseleave', 'blur'].includes(eventType)
        || (eventType === 'keydown' && event.key === 'Escape')) {
        event.target.classList.add('hide-tooltip');
      }
    }, true);
  });
}

function decorateToolTip(icon, iconName) {
  const hasTooltip = icon.closest('em')?.textContent.includes('|') && [...icon.classList].some((cls) => cls.includes('tooltip'));
  if (!hasTooltip) return;

  const wrapper = icon.closest('em');
  wrapper.className = 'tooltip-wrapper';
  const conf = wrapper.textContent.split('|');
  const content = conf.pop()?.trim();
  if (!content) return;

  icon.dataset.tooltip = content;
  const place = conf.pop()?.trim().toLowerCase() || 'right';
  icon.className = `icon icon-${iconName} milo-tooltip ${place}`;

  [['tabindex', '0'], ['aria-label', content], ['role', 'button']].forEach(([attr, value]) => {
    icon.setAttribute(attr, value);
  });

  wrapper.parentElement.replaceChild(icon, wrapper);
  if (!tooltipListenersAdded) addTooltipListeners();
}

async function getSVGsfromFile(path) {
  if (!path) return null;
  const resp = await fetch(path);
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

async function fetchAndParseSVG(url, iconName) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch SVG for ${iconName}: ${response.statusText}`);

  const text = await response.text();
  const parser = new DOMParser();
  const svgElement = parser.parseFromString(text, 'image/svg+xml').querySelector('svg');

  if (!svgElement) throw new Error(`No SVG element found in fetched content for ${iconName}`);

  svgElement.classList.add('icon-milo', `icon-milo-${iconName}`);
  return svgElement;
}

async function fetchFederalIcon(iconName) {
  const fedRoot = getFederatedContentRoot();
  const url = `${fedRoot}/federal/assets/icons/svgs/${iconName}.svg`;

  try {
    const svgElement = await fetchAndParseSVG(url, iconName);
    iconCache.set(iconName, svgElement);
    return svgElement;
  } catch (error) {
    lanaLog({
      message: `Error fetching federal SVG for ${iconName}, falling back to Milo icon`,
      error,
      tags: 'icons',
      errorType: 'error',
    });
    return null;
  }
}

async function fetchMiloIcon(iconName) {
  if (!miloIconsPromise) {
    const { miloLibs, codeRoot } = getConfig();
    const base = miloLibs || codeRoot;
    miloIconsPromise = getSVGsfromFile(`${base}/img/icons/icons.svg`);
  }

  const miloIcons = await miloIconsPromise;
  if (miloIcons?.[iconName]) {
    const icon = miloIcons[iconName].cloneNode(true);
    iconCache.set(iconName, icon);
    return icon;
  }

  lanaLog({
    message: `No fallback Milo icon found for ${iconName}`,
    tags: 'icons',
    errorType: 'error',
  });
  return null;
}

async function getIcon(iconName, isRogueIcon) {
  if (iconCache.has(iconName)) return iconCache.get(iconName);

  if (!isRogueIcon) {
    const federalIcon = await fetchFederalIcon(iconName);
    if (federalIcon) return federalIcon;
  }

  return fetchMiloIcon(iconName);
}

export default async function loadIcons(icons) {
  const iconPromises = [...icons].map(async (icon) => {
    const iconNameInitial = icon.classList[1].replace('icon-', '');
    let iconName = iconNameInitial === 'tooltip' ? 'info' : iconNameInitial;
    if (iconNameInitial.includes('tooltip-')) iconName = iconNameInitial.replace(/tooltip-/, '');
    decorateToolTip(icon, iconName);
    if (icon.dataset.svgInjected || !iconName) return;

    const isRogueIcon = rogueBlocks.some((b) => icon.closest(`div.${b}`));
    const svgElement = await getIcon(iconName, isRogueIcon);
    if (svgElement && !icon.dataset.svgInjected) {
      const svgClone = svgElement.cloneNode(true);
      icon.appendChild(svgClone);
      icon.dataset.svgInjected = 'true';

      const parent = icon.parentElement;
      if (parent?.childNodes.length > 1) {
        if (parent.lastChild === icon) {
          icon.classList.add('margin-inline-start');
        } else if (parent.firstChild === icon) {
          icon.classList.add('margin-inline-end');
          if (parent.parentElement.tagName === 'LI') parent.parentElement.classList.add('icon-list-item');
        } else {
          icon.classList.add('margin-inline-start', 'margin-inline-end');
        }
      }
    }
  });

  await Promise.allSettled(iconPromises);
}

export const fetchIcons = (config) => {
  const { miloLibs, codeRoot } = config;
  const base = miloLibs || codeRoot;
  return getSVGsfromFile(`${base}/img/icons/icons.svg`);
};

export function fetchIconList(url) {
  return fetch(url)
    .then((resp) => resp.json())
    .then((json) => json.content.data)
    .catch(() => {
      lanaLog({ message: 'Failed to fetch iconList', tags: 'icons', errorType: 'error' });
      return [];
    });
}
