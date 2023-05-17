import { getConfig } from '../../../utils/utils.js';

const curtainSelector = '.feds-curtain';
const navLink = '.feds-navLink';
const globalNavSelector = '.global-navigation';
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

// TODO this is just prototyped
export const getFedsPlaceholderConfig = () => {
  const { locale, miloLibs, env } = getConfig();
  let libOrigin = 'https://milo.adobe.com';
  if (window.location.origin.includes('localhost')) {
    libOrigin = `${window.location.origin}`;
  }

  if (window.location.origin.includes('.hlx.')) {
    const baseMiloUrl = env.name === 'prod'
      ? 'https://main--milo--adobecom.hlx.live'
      : 'https://main--milo--adobecom.hlx.page';
    libOrigin = miloLibs || `${baseMiloUrl}`;
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
  const openElements = document.querySelectorAll(`${globalNavSelector} [aria-expanded='true']`);
  if (!openElements) return;
  if (e) e.preventDefault();
  [...openElements].forEach((el) => {
    el.setAttribute('aria-expanded', 'false');
    if (el.closest(navLink)) {
      el.setAttribute('daa-lh', 'header|Open');
    }
  });
  // TODO the curtain will be refactored
  document.querySelector(curtainSelector)?.classList.remove('is-open');
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
  if (element.closest(navLink)) {
    element.setAttribute('daa-lh', 'header|Close');
  }
  element.setAttribute('aria-expanded', 'true');
  return true;
}

export function expandTrigger({ element } = {}) {
  if (!element) return;
  closeAllDropdowns();
  if (element.closest(navLink)) {
    element.setAttribute('daa-lh', 'header|Close');
  }
  element.setAttribute('aria-expanded', 'true');
}

export const yieldToMain = () => new Promise((resolve) => { setTimeout(resolve, 0); });
