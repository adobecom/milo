import { TABLET_UP, DESKTOP_UP, MOBILE_LANDSCAPE,} from '../media.js';
export const CSS = `
:root {
  --merch-card-segment-width: 378px;
}

/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
  grid-template-columns: minmax(276px, var(--merch-card-segment-width));
}

/* Mobile */
@media screen and ${MOBILE_LANDSCAPE} {
  :root {
    --merch-card-segment-width: 276px;
  }
}

@media screen and ${TABLET_UP} {
  :root {
    --merch-card-segment-width: 276px;
  }
    
  .two-merch-cards.segment,
  .three-merch-cards.segment,
  .four-merch-cards.segment {
      grid-template-columns: repeat(2, minmax(276px, var(--merch-card-segment-width)));
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --merch-card-segment-width: 302px;
  }
    
  .three-merch-cards.segment {
      grid-template-columns: repeat(3, minmax(276px, var(--merch-card-segment-width)));
  }

  .four-merch-cards.segment {
      grid-template-columns: repeat(4, minmax(276px, var(--merch-card-segment-width)));
  }
}
`;
