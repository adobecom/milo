export const CSS = `
:root {
  --merch-card-ccd-suggested-width: 305px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

.spectrum--light merch-card[variant="ccd-suggested"] {
  background-color: var(--ccd-gray-100-light);
  color: var(--ccd-gray-700-dark);
  border: 1px solid var(--ccd-gray-200-light);
}

.spectrum--light merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: var(--ccd-gray-700-dark);
}

.spectrum--dark merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: var(--ccd-gray-100-light);
}

.spectrum--dark merch-card[variant="ccd-suggested"] {
  background-color: var(--ccd-gray-800-dark);
  color: var(--ccd-gray-100-light);
  border: 1px solid var(--ccd-gray-700-dark);
}

merch-card[variant="ccd-suggested"] [slot="detail-s"] {
  color: var(--merch-color-grey-60);
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: var(--spectrum-gray-800, #F8F8F8);
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration: underline;
}

merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-grey-60));
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  color: var(--spectrum-gray-800, var(--merch-color-grey-80));
  font-weight: 700;
}

.spectrum--dark merch-card[variant="ccd-suggested"] [slot="cta"] button[treatment="outline"] {
  color: var(--ccd-gray-200-light);
  border: 2px solid var(--ccd-gray-200-light);
}
`;
