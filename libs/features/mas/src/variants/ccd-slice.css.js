export const CSS = `
:root {
  --merch-card-ccd-slice-single-width: 322px;
  --merch-card-ccd-slice-icon-size: 30px;
  --merch-card-ccd-slice-wide-width: 600px;
  --merch-card-ccd-slice-single-height: 154px;
  --merch-card-ccd-slice-background-img-size: 119px;
}

merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-gray-60));
}

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}
`;
