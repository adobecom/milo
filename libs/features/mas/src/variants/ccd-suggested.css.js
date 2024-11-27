export const CSS = `
:root {
  --merch-card-ccd-suggested-width: 305px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] {
  background-color: #F8F8F8;
  border: 1px solid #E6E6E6;
  color: #222;
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] {
  background-color: #1D1D1D;
  border: 1px solid #3F3F3F;
  color: #F8F8F8;
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] [slot="detail-s"] {
  color: #6D6D6D;
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] [slot="detail-s"] {
  color: #F8F8F8;
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: #222;
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: #F8F8F8;
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: #222;
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: #F8F8F8;
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration: underline;
  color: #147AF3;
}

merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--spectrum-gray-600);
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  color: var(--spectrum-gray-800);
  font-weight: 700;
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] [slot="cta"] a {
  color: var(--spectrum-gray-700);
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] [slot="cta"] a {
  color: var(--spectrum-gray-900);
}

sp-theme[color='dark'] merch-card[variant="ccd-suggested"] [slot="cta"] sp-button[treatment="outline"] {
  color: var(--spectrum-gray-700, #E6E6E6);
  border: 2px solid var(--spectrum-gray-700, #E6E6E6);
}
`;
