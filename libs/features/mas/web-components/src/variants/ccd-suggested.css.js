export const CSS = `
:root {
  --merch-card-ccd-suggested-width: 304px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

merch-card[variant="ccd-suggested"] [slot='detail-m'] {
  color: var(--merch-color-grey-60);
}

merch-card[variant="ccd-suggested"] [slot='icons'] {
    flex-flow: wrap;
    place-self: flex-start;
}

merch-card[variant="ccd-suggested"] [slot='heading-xs'] {
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);

}

merch-card[variant="ccd-suggested"] [slot='cta'] a {
  text-decoration: none;
  color: var(--merch-color-grey-60);
  font-weight: 500;
}
`;
