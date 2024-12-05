export const CSS = `

merch-card[variant="ccd-suggested"] {
  --consonant-merch-card-detail-s-color: #6d6d6d;
  --consonant-merch-card-body-xs-color: var(--spectrum-gray-700);
  --consonant-merch-card-heading-xs-color: var(--spectrum-gray-800);
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

.spectrum--darkest merch-card[variant="ccd-suggested"] {
    --consonant-merch-card-detail-s-color: #f8f8f8;
    --consonant-merch-card-body-xs-color: #f8f8f8;
    --consonant-merch-card-border-color: #303030;
    --consonant-merch-card-background-color: #222222;
}
`;
