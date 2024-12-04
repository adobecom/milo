import { TABLET_UP, DESKTOP_UP, LARGE_DESKTOP,} from '../media.js';
export const CSS = `
:root {
  --merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--merch-card-image-width);
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--merch-card-image-width));
  }
}

@media screen and ${DESKTOP_UP} {
  :root {
    --merch-card-image-width: 378px;
  }
    
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(3, var(--merch-card-image-width));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--merch-card-image-width));
  }
}
`;
