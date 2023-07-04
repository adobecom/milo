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

export const isFunction = (value) => typeof value === 'function';

export const isBoolean = (value) => typeof value === 'boolean';

export const equalsCI = (value1, value2) => value1.localeCompare(
  value2,
  'en',
  { sensitivity: 'base' },
);

export const toBoolean = (value) => (isBoolean(value) ? value : ['1', 'true'].includes(String(value)));

export const toKebabCase = (value) => value.replace(
  /(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,
  (_, p1, p2) => `${p1}-${p2}`,
).replace(
  /[\p{Separator}\p{Punctuation}]+/gu,
  '-',
).toLowerCase();
