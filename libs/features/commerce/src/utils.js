export const ignore = () => {
  /* do nothing */
};

export const isBoolean = (val) => typeof val === 'boolean';
export const isFunction = (val) => typeof val === 'function';
export const isNumber = (val) => typeof val === 'number';
export const isFiniteNumber = (val) => isNumber(val) && Number.isFinite(val);

export const equalsCI = (value1, value2) => String(value1 ?? '').localeCompare(
  value2,
  'en',
  { sensitivity: 'base' },
) === 0;

export function toBoolean(val, def) {
  const str = String(val);
  if (['1', 'true'].includes(str)) return true;
  if (['0', 'false'].includes(str)) return false;
  return def;
}

/**
 * @template T
 * @param {any} val
 * @param {T} enm
 * @param {T[keyof T]} [def]
 * @returns {T[keyof T]}
 */
export function toEnum(val, enm, def) {
  const vals = Object.values(enm);
  return vals.find((itm) => equalsCI(itm, val)) ?? def ?? vals[0];
}

export function toFiniteNumber(val, def = 1) {
  if (isFiniteNumber(val)) return val;
  const num = Number.parseInt(val, 10);
  return isFiniteNumber(num) ? num : def;
}

/**
 * Converts value to `kebab-case` string.
 * @param {any} val - value to convert
 */
export const toKebabCase = (val) => String(val ?? '').replace(
  /(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,
  (_, p1, p2) => `${p1}-${p2}`,
).replace(
  /[\p{Separator}\p{Punctuation}]+/gu,
  '-',
).toLowerCase();

/**
 * @param {string} key
 * @param {boolean} useMetadata
 * @param {boolean} useSearchAndStorage
 * @returns
 */
export function getParam(key, useMetadata = false, useSearchAndStorage = false) {
  let param;
  if (useMetadata) {
    param = document.documentElement
      .querySelector(`meta[name="${toKebabCase(key)}"]`)
      // @ts-ignore
      ?.content;
  }
  if (useSearchAndStorage && param == null) {
    param = new URLSearchParams(window.location.search).get(key)
      ?? window.sessionStorage.getItem(key)
      ?? window.localStorage.getItem(key);
  }
  return param;
}
