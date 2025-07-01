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
  if (!wrapper) return;
  const conf = wrapper.textContent.split('|');
  // Text is the last part of a tooltip
  const content = conf.pop().trim();
  if (!content) return;
  icon.dataset.tooltip = content;
  // Position is the next to last part of a tooltip
  const place = conf.pop()?.trim().toLowerCase() || 'right';
  icon.className = `icon icon-${iconName} milo-tooltip ${place}`;
  icon.setAttribute('tabindex', '0');
  icon.setAttribute('aria-label', content);
  icon.setAttribute('role', 'button');
  wrapper.parentElement.replaceChild(icon, wrapper);
  if (!tooltipListenersAdded) addTooltipListeners();
}

export default async function loadIcons(icons, config) {
  const iconSVGs = await fetchIcons(config);
  if (!iconSVGs) return;
  icons.forEach(async (icon) => {
    const iconNameInitial = icon.classList[1].replace('icon-', '');
    let iconName = iconNameInitial === 'tooltip' ? 'info' : iconNameInitial;
    if (iconNameInitial.includes('tooltip-')) iconName = iconNameInitial.replace(/tooltip-/, '');
    decorateToolTip(icon, iconName);

    const existingIcon = icon.querySelector('svg');
    if (!iconSVGs[iconName] || existingIcon) return;
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
    icon.insertAdjacentHTML('afterbegin', iconSVGs[iconName].outerHTML);
  });
}
