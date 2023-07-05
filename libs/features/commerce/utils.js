const TAX_INCLUSIVE_DETAILS = 'TAX_INCLUSIVE_DETAILS';
const TAX_EXCLUSIVE = 'TAX_EXCLUSIVE';

/**
 * Updates the offer price and priceWithoutDiscount from tax exclusive prices.
 * @param {*} offer
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export
export function forceTaxExclusivePrice(offer) {
  const { priceDetails } = offer;
  const { price, priceWithoutTax, priceWithoutDiscountAndTax, taxDisplay } = priceDetails;

  if (taxDisplay !== TAX_INCLUSIVE_DETAILS) {
    return;
  }

  priceDetails.price = priceWithoutTax ?? price;
  priceDetails.priceWithoutDiscount = priceWithoutDiscountAndTax
    ?? priceDetails.priceWithoutDiscount;
  priceDetails.taxDisplay = TAX_EXCLUSIVE;
}

/**
 *  Find a single offer among a pair of offers at max, based on the following rules.
 *  - whether the country is GB
 *  - whether the OSI corresponds to a perpetual offer
 * @param {*} resolvedOffers, array of resolved offers.
 * Usually the response of WCS for an OSI with or without language parameter.
 * @param {*} country
 * @param {*} isPerpetual whether the OSI corresponds to a perpetual offer
 * @returns a single offer
 */
export function getSingleOffer([first, second], country, isPerpetual) {
  if (!second) return first;
  if (country === 'GB' || isPerpetual) {
    return first.language === 'EN' ? first : second;
  }
  return first.language === 'MULT' ? first : second;
}

export const ignore = () => {
  /* do nothing */
};

export const isBoolean = (val) => typeof val === 'boolean';
export const isFunction = (val) => typeof val === 'function';
export const isNumber = (val) => typeof val === 'number';
export const isPositiveFiniteNumber = (val) => isNumber(val) && Number.isFinite(val) && val > 0;

export const equalsCI = (value1, value2) => 0 === String(value1 ?? '').localeCompare(
  value2,
  'en',
  { sensitivity: 'base' },
);

export function toBoolean(val, def) {
  const str = String(val);
  if (['1', 'true'].includes(str)) return true;
  if (['0', 'false'].includes(str)) return false;
  return def;
}

/**
 * @template T
 * @param {any} val - value to convert
 * @param {T} enm - enum object
 * @param {T[keyof T]} [def] - default value
 * @returns {T[keyof T]}
 */
export function toEnum(val, enm, def) {
  const vals = Object.values(enm);
  return vals.find(itm => equalsCI(itm, val)) ?? def ?? vals[0];
}

export function toPositiveFiniteNumber(val, def = 1) {
  if (isPositiveFiniteNumber(val)) return val;
  const num = Number.parseInt(val, 10);
  return isPositiveFiniteNumber(num) ? num : def;
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
