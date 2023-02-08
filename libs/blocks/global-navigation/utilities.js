/* eslint-disable no-underscore-dangle */
import { getConfig } from '../../utils/utils.js';

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
const getOrigin = () => {
  if (window.location.origin.includes('localhost') || window.location.origin.includes('.hlx.')) {
    return window.location.origin;
  }
  return 'https://adobe.com';
};

async function fetchData(path) {
  const resp = await fetch(path).catch(() => ({}));
  const { data } = resp.ok ? await resp.json() : { data: [] };
  const res = {};
  for (let i = 0; i < data.length; i += 1) {
    res[data[i].key] = data[i];
  }
  return res;
}

let fetchedPlaceholders;
async function fetchPlaceholders() {
  fetchedPlaceholders = fetchedPlaceholders || new Promise((resolve) => {
    const { locale } = getConfig();
    fetchData(`${getOrigin()}/libs/feds${locale.prefix}/placeholders.json`)
      .then((res) => resolve(res));
  });
  return fetchedPlaceholders;
}

let fetchedDefaultPlaceholders;
async function fetchDefaultPlaceholders() {
  fetchedDefaultPlaceholders = fetchedDefaultPlaceholders || new Promise((resolve) => {
    fetchData(`${getOrigin()}/libs/feds/placeholders.json`)
      .then((res) => resolve(res));
  });
  return fetchedDefaultPlaceholders;
}

const keyToStr = (key) => key.replaceAll('-', ' ');

export async function getPlaceholder(key = '') {
  if (typeof key !== 'string') return { value: '' };
  const { locale } = getConfig();
  const defaultLocale = 'en-US';
  const placeholders = await fetchPlaceholders();
  if (placeholders[key]) return placeholders[key];
  let defaultPlaceholders = {};
  if (!fetchedDefaultPlaceholders && locale.ietf !== defaultLocale) {
    defaultPlaceholders = await fetchDefaultPlaceholders();
  }
  if (defaultPlaceholders[key]) return defaultPlaceholders[key];
  return { value: keyToStr(key) }; // turn 'sign-in' into 'sign in'
}

// We want to always map a key to value, even if it's just a transformed key
// that way we can always display something to the user
// example: sign-in becomes {sign-in: {value: "sign in"}}
export async function getPlaceholders(keys = []) {
  if (!Array.isArray(keys)) return [];
  const placeholderArray = await Promise.all(keys.map((key) => getPlaceholder(key)));
  const placeholders = {};
  for (let i = 0; i < placeholderArray.length; i += 1) {
    placeholders[keys[i]] = placeholderArray[i].key
      ? placeholderArray[i]
      : { value: keys[i].replaceAll('-', ' ') };
  }
  return placeholders;
}
