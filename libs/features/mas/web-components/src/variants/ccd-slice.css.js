import { TABLET_UP, DESKTOP_UP, LARGE_DESKTOP } from "../media.js";

export const CSS = `
:root {
  --consonant-merch-card-ccd-slice-single-width: 322px;
  --consonant-merch-card-ccd-slice-single-height: 154px;
  --consonant-merch-card-ccd-slice-background-img-size: 119px;
}

.one-merch-card.ccd-slice,
.two-merch-cards.ccd-slice,
.three-merch-cards.ccd-slice,
.four-merch-cards.ccd-slice {
    grid-template-columns: var(--consonant-merch-card-ccd-slice-width);
}

merch-card[variant="ccd-slice"] [slot='background-img'] {
  width: var(--consonant-merch-card-ccd-slice-background-size);
  height: var(--consonant-merch-card-ccd-slice-background-size);
  overflow: hidden;
  border-radius: 50%;
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.ccd-slice,
  .three-merch-cards.ccd-slice,
  .four-merch-cards.ccd-slice {
      grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-slice-width));
  }
}

@media screen and ${DESKTOP_UP} {
  .three-merch-cards.ccd-slice,
  .four-merch-cards.ccd-slice {
      grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-slice-width));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.ccd-slice {
      grid-template-columns: repeat(4, var(--consonant-merch-card-ccd-slice-width));
  }
}
`;
