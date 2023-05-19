import { getConfig, getMetadata, loadStyle } from '../../../utils/utils.js';

export const selectors = {
  globalNav: '.global-navigation',
  curtain: '.feds-curtain',
  navLink: '.feds-navLink',
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
  // eslint-disable-next-line no-async-promise-executor
  cachedDecorateMenu = cachedDecorateMenu || new Promise(async (resolve) => {
    const [{ decorateMenu, decorateLinkGroup }] = await Promise.all([
      loadBlock('./menu/menu.js'),
      loadStyles('utilities/menu/menu.css'),
    ]);

    resolve({
      decorateMenu,
      decorateLinkGroup,
    });
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

export function closeAllDropdowns({ e } = {}) {
  const openElements = document.querySelectorAll(`${selectors.globalNav} [aria-expanded='true']`);
  if (!openElements) return;
  if (e) e.preventDefault();
  [...openElements].forEach((el) => {
    el.setAttribute('aria-expanded', 'false');
    if (el.closest(selectors.navLink)) {
      el.setAttribute('daa-lh', 'header|Open');
    }
  });
  // TODO the curtain will be refactored
  document.querySelector(selectors.curtain)?.classList.remove('is-open');
}

/**
 * @param {*} param0
 * @param {*} param0.element - the DOM element of the trigger to expand
 * @returns true if the element has been expanded, false if it was already expanded
 */
export function trigger({ element } = {}) {
  const isOpen = element?.getAttribute('aria-expanded') === 'true';
  closeAllDropdowns();
  if (isOpen) return false;
  if (element.closest(selectors.navLink)) {
    element.setAttribute('daa-lh', 'header|Close');
  }
  element.setAttribute('aria-expanded', 'true');
  return true;
}

export function expandTrigger({ element } = {}) {
  if (!element) return;
  closeAllDropdowns();
  if (element.closest(selectors.navLink)) {
    element.setAttribute('daa-lh', 'header|Close');
  }
  element.setAttribute('aria-expanded', 'true');
}

export const yieldToMain = () => new Promise((resolve) => { setTimeout(resolve, 0); });
