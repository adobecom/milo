import { TABLET_UP, DESKTOP_UP, LARGE_DESKTOP } from "../media.js";

export const CSS = `
:root {
  --consonant-merch-card-ccd-suggested-width: 304px;
  --consonant-merch-card-ccd-suggested-height: 205px;
  --consonant-merch-card-ccd-suggested-background-img-size: 119px;
}

.one-merch-card.ccd-suggested,
.two-merch-cards.ccd-suggested,
.three-merch-cards.ccd-suggested,
.four-merch-cards.ccd-suggested {
    grid-template-columns: var(--consonant-merch-card-ccd-suggested-width);
}

merch-card[variant="ccd-suggested"] [slot='heading-xxs'] {
  font-size: var(--consonant-merch-card-heading-xxs-font-size);
  line-height: var(--consonant-merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot='body-s'] a:not(.con-button) {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    font-style: normal;
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    text-decoration-line: underline;
    color: var(--merch-color-grey-80);
}

merch-card[variant="ccd-suggested"] [slot='image'] {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  width: var(--consonant-merch-card-ccd-suggested-background-img-size);
  height: var(--consonant-merch-card-ccd-suggested-background-img-size);
  overflow: hidden;
  border-radius: 50%;
  padding: var(--consonant-merch-spacing-xs);
  align-self: center;
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.ccd-suggested,
  .three-merch-cards.ccd-suggested,
  .four-merch-cards.ccd-suggested {
      grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-suggested-width));
  }
}
@media screen and ${DESKTOP_UP} {
  .three-merch-cards.ccd-suggested,
  .four-merch-cards.ccd-suggested {
      grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-suggested-width));
  }
}
@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.ccd-suggested {
      grid-template-columns: repeat(4, var(--consonant-merch-card-ccd-suggested-width));
  }
}
`;
