import { TABLET_UP, DESKTOP_UP, LARGE_DESKTOP } from "../media.js";

export const CSS = `
:root {
  --consonant-merch-card-ccd-action-width: 276px;
  --consonant-merch-card-ccd-action-min-height: 320px;
}

.one-merch-card.ccd-action,
.two-merch-cards.ccd-action,
.three-merch-cards.ccd-action,
.four-merch-cards.ccd-action {
    grid-template-columns: var(--consonant-merch-card-ccd-action-width);
}

merch-card[variant="ccd-action"] .price-strikethrough {
    font-size: 18px;
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.ccd-action,
  .three-merch-cards.ccd-action,
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-action-width));
  }
}

@media screen and ${DESKTOP_UP} {
  .three-merch-cards.ccd-action,
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-action-width));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(4, var(--consonant-merch-card-ccd-action-width));
  }
}
`;
