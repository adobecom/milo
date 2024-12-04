export const CSS = `
:root {
  --merch-card-ccd-suggested-width: 305px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  text-decoration: underline;
}

merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-gray-60));
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  font-weight: 700;
}

merch-card [slot='detail-s'] {
  color: var(--merch-card-detail-s-color);
}
`;
