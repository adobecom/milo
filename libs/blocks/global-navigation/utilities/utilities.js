/* eslint-disable no-underscore-dangle */
import { getConfig } from '../../../utils/utils.js';

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

export function debounceCallback(callback, time = 200) {
  if (typeof callback !== 'function') return undefined;

  let timeout = null;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), time);
  };
}

// TODO: should we replace these with proper Locale/country service(s)?
export function getLocale() {
  return document.documentElement.getAttribute('lang') || 'en-US';
}

export function getCountry() {
  return getLocale()?.split('-').pop() || 'US';
}

// TODO this is just prototyped and should also support ?milolibs=test-branch
export const getFedsPlaceholderConfig = () => {
  const { locale } = getConfig();
  let origin = 'https://adobe.com';
  if (window.location.origin.includes('localhost') || window.location.origin.includes('.hlx.')) {
    origin = window.location.origin;
  }
  return {
    locale: {
      ...locale,
      contentRoot: `${origin}/libs/feds${locale.prefix}`,
    },
  };
};
