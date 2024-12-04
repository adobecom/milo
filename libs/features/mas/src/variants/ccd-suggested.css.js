export const CSS = `
:root {
  --consonant-merch-card-ccd-suggested-width: 305px;
  --consonant-merch-card-ccd-suggested-height: 205px;
  --consonant-merch-card-ccd-suggested-background-img-size: 119px;
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  font-size: var(--consonant-merch-card-heading-xxs-font-size);
  line-height: var(--consonant-merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration: underline;
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  font-weight: 700;
}
`;
