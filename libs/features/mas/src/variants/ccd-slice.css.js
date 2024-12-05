export const CSS = `
merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="strikethrough"] {
  color: var(--ccd-gray-600-light, var(--merch-color-grey-60));
}

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a.spectrum-Link {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-xxs-line-height);
}

.spectrum--darkest merch-card[variant="ccd-slice"] {
  --consonant-merch-card-background-color: #222222;
  --consonant-merch-card-body-s-color: #f8f8f8;
  --consonant-merch-card-border-color: #303030;
  --consonant-merch-card-detail-s-color: #f8f8f8;
}


.spectrum--darkest  merch-card[variant='ccd-slice']:hover {
  --consonant-merch-card-border-color: #4b4b4b;
}
`;
