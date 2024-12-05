export const CSS = `

merch-card[variant="ccd-suggested"] {
  --merch-color-body-xs-color: var(--spectrum-gray-700);
  --consonant-merch-card-heading-xs-color: var(--spectrum-gray-800);
}

.spectrum--darkest merch-card[variant="ccd-suggested"] {
  --merch-color-body-xs-color: #F8F8F8;
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  font-size: var(--consonant-merch-card-heading-xxs-font-size);
  line-height: var(--consonant-merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  line-height: var(--consonant-merch-card-body-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  font-weight: 700;
}
`;
