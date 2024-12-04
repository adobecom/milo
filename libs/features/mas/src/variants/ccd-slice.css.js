export const CSS = `
:root {
  --consonant-merch-card-ccd-slice-single-width: 322px;
  --consonant-merch-card-ccd-slice-icon-size: 30px;
  --consonant-merch-card-ccd-slice-wide-width: 600px;
  --consonant-merch-card-ccd-slice-single-height: 154px;
  --consonant-merch-card-ccd-slice-background-img-size: 119px;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a:not(.con-button) {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration-line: underline;
}

merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="strikethrough"] {
  color: var(--ccd-gray-600-light, var(--merch-color-grey-60));
}

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}
`;
