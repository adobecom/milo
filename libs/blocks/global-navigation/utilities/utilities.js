import { getConfig, getMetadata, loadStyle, loadLana } from '../../../utils/utils.js';
import { processTrackingLabels } from '../../../martech/attributes.js';

loadLana();

export const selectors = {
  globalNav: '.global-navigation',
  curtain: '.feds-curtain',
  navLink: '.feds-navLink',
  overflowingTopNav: '.feds-topnav--overflowing',
  navItem: '.feds-navItem',
  activeNavItem: '.feds-navItem--active',
  deferredActiveNavItem: '.feds-navItem--activeDeferred',
  activeDropdown: '.feds-dropdown--active',
  menuSection: '.feds-menu-section',
  menuColumn: '.feds-menu-column',
  gnavPromo: '.gnav-promo',
  columnBreak: '.column-break',
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
  const { origin } = window.location;

  if (origin.includes('localhost') || origin.includes('.hlx.')) {
    libOrigin = `https://main--milo--adobecom.hlx.${origin.includes('hlx.live') ? 'live' : 'page'}`;
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

  let analyticsValue = processTrackingLabels(str, getConfig(), 30);
  analyticsValue = typeof index === 'number' ? `${analyticsValue}-${index}` : analyticsValue;

  return analyticsValue;
}

export function getExperienceName() {
  const experiencePath = getMetadata('gnav-source');
  const explicitExperience = experiencePath?.split('/').pop();
  if (explicitExperience?.length
    && explicitExperience !== 'gnav') return explicitExperience;

  const { imsClientId } = getConfig();
  if (imsClientId?.length) return imsClientId;

  return '';
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

  const clone = elem.cloneNode(true);
  clone.className = `feds-cta feds-cta--${modifier}`;
  clone.setAttribute('daa-ll', getAnalyticsValue(clone.textContent, index));

  return toFragment`
    <div class="feds-cta-wrapper">
      ${clone}
    </div>`;
}

let curtainElem;
export function setCurtainState(state) {
  if (typeof state !== 'boolean') return;

  curtainElem = curtainElem || document.querySelector(selectors.curtain);
  if (curtainElem) curtainElem.classList.toggle('feds-curtain--open', state);
}

export const isDesktop = window.matchMedia('(min-width: 900px)');
export const isTangentToViewport = window.matchMedia('(min-width: 900px) and (max-width: 1440px)');

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
  selectorArr.some((selector) => {
    const closestSection = elem.closest(selector);

    if (closestSection && closestSection.querySelector('[aria-expanded = "true"]')) {
      closestSection.classList.add(activeClass);
      return true;
    }

    return false;
  });
}

export const [hasActiveLink, setActiveLink, getActiveLink] = (() => {
  let activeLinkFound;

  return [
    () => activeLinkFound,
    (val) => { activeLinkFound = !!val; },
    (area) => {
      if (hasActiveLink() || !(area instanceof HTMLElement)) return null;
      const { origin, pathname } = window.location;
      let activeLink;

      [`${origin}${pathname}`, pathname].forEach((path) => {
        if (activeLink) return;
        activeLink = area.querySelector(`a[href = '${path}'], a[href ^= '${path}?'], a[href ^= '${path}#']`);
      });

      if (!activeLink) return null;

      setActiveLink(true);
      return activeLink;
    },
  ];
})();

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

export const lanaLog = ({ message, e = '', tags = 'errorType=default' }) => {
  const url = getMetadata('gnav-source');
  window.lana.log(`${message} | gnav-source: ${url} | href: ${window.location.href} | ${e.reason || e.error || e.message || e}`, {
    clientId: 'feds-milo',
    sampleRate: 1,
    tags,
  });
};

export const logErrorFor = async (fn, message, tags) => {
  try {
    await fn();
  } catch (e) {
    lanaLog({ message, e, tags });
  }
};

export function processMartechAttributeMetadata(html) {
  const dom = new DOMParser().parseFromString(html, 'text/html').body;
  const blocks = dom.querySelectorAll('.martech-metadata');
  blocks.forEach((block) => {
    import('../../martech-metadata/martech-metadata.js')
      .then(({ default: decorate }) => decorate(block));
  });
  return null;
}
