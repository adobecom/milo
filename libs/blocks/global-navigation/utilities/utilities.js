import { getConfig, localizeLink } from '../../../utils/utils.js';

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
        href="${localizeLink(elem.href)}"
        class="feds-cta feds-cta--${modifier}"
        daa-ll="${getAnalyticsValue(elem.textContent, index)}">
          ${elem.textContent}
      </a>
    </div>`;
}
