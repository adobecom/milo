export const CSS = `

  merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
    font-size: var(--consonant-merch-card-heading-xxs-font-size);
    line-height: var(--consonant-merch-card-heading-xxs-line-height);
  }
  
  merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

.spectrum--darkest merch-card[variant="ccd-suggested"] {
  --consonant-merch-card-background-color: #1e1e1e;
  --consonant-merch-card-heading-xs-color: #f8f8f8;
  --consonant-merch-card-body-xs-color: #f8f8f8;
  --consonant-merch-card-border-color: #393939;
  --consonant-merch-card-detail-s-color: #f8f8f8;
  --consonant-merch-card-price-color: #f8f8f8;
  --merch-color-inline-price-strikethrough: #b0b0b0;
}

.spectrum--darkest  merch-card[variant='ccd-suggested']:hover {
  --consonant-merch-card-border-color: #494949;
}
`;
