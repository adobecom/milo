export const CSS = `
:root {
  --merch-card-ccd-suggested-width: 305px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] {
  color: var(--spectrum-gray-800);
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] {
  color: var(--merch-ccd-gray-900);
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] [slot="detail-s"] {
  color: var(--spectrum-gray-600);
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] [slot="detail-s"] {
  color: var(--merch-ccd-gray-100);
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: var(--spectrum-gray-800);
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: var(--merch-ccd-gray-100);
}

sp-theme[color='light'] merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: var(--spectrum-gray-800);
}

sp-theme[color='darkest'] merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: var(--merch-ccd-gray-100);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration: underline;
  color: var(--spectrum-blue-800);
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
`;
