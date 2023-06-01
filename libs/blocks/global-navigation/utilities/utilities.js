import { getConfig, getMetadata, loadStyle, loadLana } from '../../../utils/utils.js';

loadLana();

export const selectors = {
  globalNav: '.global-navigation',
  curtain: '.feds-curtain',
  navLink: '.feds-navLink',
  navItem: '.feds-navItem',
  activeDropdown: '.feds-dropdown--active',
  menuSection: '.feds-menu-section',
  menuColumn: '.feds-menu-column',
};

export function toFragment(htmlStrings, ...values) {
  const templateStr = htmlStrings.reduce((acc, htmlString, index) => {
    if (values[index] instanceof HTMLElement) {
      return `${acc + htmlString}<elem ref="${index}"></elem>`;
    }
    return acc + htmlString + (values[index] || '');
  }, '');

  const fragment = document.createRange().createContextualFragment(templateStr).children[0];

  Array.prototype.map.call(fragment.querySelectorAll('elem'), (replaceable) => {
    const ref = replaceable.getAttribute('ref');
    replaceable.replaceWith(values[ref]);
  });

  return fragment;
}

export const getFedsPlaceholderConfig = () => {
  const { locale } = getConfig();
  let libOrigin = 'https://milo.adobe.com';

  if (window.location.origin.includes('localhost')) {
    libOrigin = `${window.location.origin}`;
  }

  if (window.location.origin.includes('.hlx.page')) {
    libOrigin = 'https://main--milo--adobecom.hlx.page';
  }

  if (window.location.origin.includes('.hlx.live')) {
    libOrigin = 'https://main--milo--adobecom.hlx.live';
  }

  return {
    locale: {
      ...locale,
      contentRoot: `${libOrigin}${locale.prefix}`,
    },
  };
};

export function getAnalyticsValue(str, index) {
  if (typeof str !== 'string' || !str.length) return str;

  let analyticsValue = str.trim().replace(/[^\w]+/g, '_').replace(/^_+|_+$/g, '');
  analyticsValue = typeof index === 'number' ? `${analyticsValue}-${index}` : analyticsValue;

  return analyticsValue;
}

export function getExperienceName() {
  const experiencePath = getMetadata('gnav-source');

  return experiencePath?.split('/').pop() || '';
}

export function loadStyles(path) {
  const { miloLibs, codeRoot } = getConfig();
  return new Promise((resolve) => {
    loadStyle(`${miloLibs || codeRoot}/blocks/global-navigation/${path}`, resolve);
  });
}

// Base styles are shared between top navigation and footer,
// since they can be independent of each other.
// CSS imports were not used due to duplication of file include
export async function loadBaseStyles() {
  await loadStyles('base.css');
}

export function loadBlock(path) {
  return import(path).then((module) => module.default);
}

let cachedDecorateMenu;
export async function loadDecorateMenu() {
  if (cachedDecorateMenu) return cachedDecorateMenu;

  let resolve;
  cachedDecorateMenu = new Promise((_resolve) => {
    resolve = _resolve;
  });

  const [{ decorateMenu, decorateLinkGroup }] = await Promise.all([
    loadBlock('./menu/menu.js'),
    loadStyles('utilities/menu/menu.css'),
  ]);

  resolve({
    decorateMenu,
    decorateLinkGroup,
  });
  return cachedDecorateMenu;
}

export function decorateCta({ elem, type = 'primaryCta', index } = {}) {
  const modifier = type === 'secondaryCta' ? 'secondary' : 'primary';

  return toFragment`
    <div class="feds-cta-wrapper">
      <a
        href="${elem.href}"
        class="feds-cta feds-cta--${modifier}"
        daa-ll="${getAnalyticsValue(elem.textContent, index)}">
          ${elem.textContent}
      </a>
    </div>`;
}

let curtainElem;
export function setCurtainState(state) {
  if (typeof state !== 'boolean') return;

  curtainElem = curtainElem || document.querySelector(selectors.curtain);
  if (curtainElem) curtainElem.classList.toggle('feds-curtain--open', state);
}

export const isDesktop = window.matchMedia('(min-width: 900px)');

export function setActiveDropdown(elem) {
  const activeClass = selectors.activeDropdown.replace('.', '');

  // We always need to reset all active dropdowns at first
  const resetActiveDropdown = () => {
    [...document.querySelectorAll(selectors.activeDropdown)]
      .forEach((activeDropdown) => activeDropdown.classList.remove(activeClass));
  };
  resetActiveDropdown();

  // If no elem is provided, de-activating all dropdowns is enough
  if (!(elem instanceof HTMLElement)) return;

  // Compose an array of parents that could be active dropdowns
  const selectorArr = [selectors.menuSection, selectors.menuColumn, selectors.navItem];

  // Look for the first parent that fits the active dropdown criteria
  while (selectorArr.length) {
    const closestSection = elem.closest(selectorArr.shift());

    if (closestSection && closestSection.querySelector('[aria-expanded = "true"]')) {
      closestSection.classList.add(activeClass);
      break;
    }
  }
}

export function closeAllDropdowns({ type } = {}) {
  const selector = type === 'headline'
    ? '.feds-menu-headline[aria-expanded="true"]'
    : `${selectors.globalNav} [aria-expanded='true']`;
  const openElements = document.querySelectorAll(selector);
  if (!openElements) return;
  [...openElements].forEach((el) => {
    if ('fedsPreventautoclose' in el.dataset) return;
    el.setAttribute('aria-expanded', 'false');
  });

  setActiveDropdown();

  if (isDesktop.matches) setCurtainState(false);
}

export function trigger({ element, event, type } = {}) {
  if (event) event.preventDefault();
  const isOpen = element?.getAttribute('aria-expanded') === 'true';
  closeAllDropdowns({ type });
  if (isOpen) return false;
  element.setAttribute('aria-expanded', 'true');
  return true;
}

export const yieldToMain = () => new Promise((resolve) => { setTimeout(resolve, 0); });

export const lanaLog = ({ message, e = '' }) => window.lana.log(`${message} ${e.reason || e.error || e.message || e}`, {
  clientId: 'feds-milo',
  sampleRate: 1,
});

export const logErrorFor = async (fn, message) => {
  try {
    await fn();
  } catch (e) {
    lanaLog({ message, e });
  }
};
