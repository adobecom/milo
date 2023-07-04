const NO_PROMO_TEXT = 'no promo';
const CLASS = 'promo-tag';
const PROMO_VARIANT = 'yellow';
const NOPROMO_VARIANT = 'neutral';

export const PROMO_CONTEXT_CANCEL_VALUE = 'cancel-context';

function fullPromoText(promo, old, isOverriden) {
  const promoText = (promo) => promo || NO_PROMO_TEXT;
  const suffix = isOverriden ? ` (was "${promoText(old)}")` : '';
  return `${promoText(promo)}${suffix}`;
}

/**
 * @param {*} overriden overriden promotion code
 * @param {} configured configured promotion code
 * @returns full status (variant + promotion code to use)
 */
export function computePromoStatus(overriden, configured) {
  const localPromoUnset = overriden === PROMO_CONTEXT_CANCEL_VALUE;
  const localPromoSet = !localPromoUnset && overriden?.length > 0;
  const isOverriden = (localPromoSet || localPromoUnset)
    // in case configured equals override, we consider no override
    && ((configured && configured !== overriden)
      // in case it does not have been configured, if overriden to cancel,
      // we consider no override
      || (!configured && !localPromoUnset));
  const isPromo = (isOverriden && localPromoSet) || (!isOverriden && !!configured);
  const effectivePromoCode = isPromo ? overriden || configured : undefined;
  return {
    effectivePromoCode,
    overridenPromoCode: overriden,
    className: isPromo ? CLASS : `${CLASS} no-promo`,
    text: fullPromoText(effectivePromoCode, configured, isOverriden),
    variant: isPromo ? PROMO_VARIANT : NOPROMO_VARIANT,
    isOverriden,
  };
}
