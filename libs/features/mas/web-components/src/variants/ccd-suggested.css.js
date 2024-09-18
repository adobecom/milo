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

merch-card[variant="ccd-suggested"] [slot='detail-m'] {
  color: var(--merch-color-grey-60);
}

merch-card[variant="ccd-suggested"] [slot='icons'] {
    flex-flow: wrap;
    place-self: flex-start;
}

merch-card[variant="ccd-suggested"] [slot='heading-xs'] {
  font-size: var(--consonant-merch-card-heading-xxs-font-size);
  line-height: var(--consonant-merch-card-heading-xxs-line-height);

}

merch-card[variant="ccd-suggested"] [slot='cta'] a {
  text-decoration: none;
  color: var(--merch-color-grey-60);
  font-weight: 500;
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
