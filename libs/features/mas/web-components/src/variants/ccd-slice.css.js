import { TABLET_UP, DESKTOP_UP, LARGE_DESKTOP } from "../media.js";

export const CSS = `
:root {
  --consonant-merch-card-ccd-slice-single-width: 322px;
  --consonant-merch-card-ccd-slice-icon-size: 30px;
  --consonant-merch-card-ccd-slice-wide-width: 600px;
  --consonant-merch-card-ccd-slice-single-height: 154px;
  --consonant-merch-card-ccd-slice-background-img-size: 119px;
}

.one-merch-card.ccd-slice,
.two-merch-cards.ccd-slice,
.three-merch-cards.ccd-slice,
.four-merch-cards.ccd-slice {
    grid-template-columns: var(--consonant-merch-card-ccd-slice-width);
}

merch-card[variant="ccd-slice"] [slot='body-s'] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xxs-line-height);
}

merch-card[variant="ccd-slice"] [slot='body-s'] a:not(.con-button) {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    font-style: normal;
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    text-decoration-line: underline;
    color: var(--merch-color-grey-80);
  }

merch-card[variant="ccd-slice"] [slot='image'] {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  width: var(--consonant-merch-card-ccd-slice-background-img-size);
  height: var(--consonant-merch-card-ccd-slice-background-img-size);
  overflow: hidden;
  border-radius: 50%;
  padding: var(--consonant-merch-spacing-xs);
  align-self: center;
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
