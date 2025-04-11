import { MOBILE_LANDSCAPE } from '../media.js';
export const CSS = `
:root {
  --consonant-merch-card-plans-width: 300px;
  --consonant-merch-card-plans-edu-width: 568px;
}

merch-card[variant="plans"][segment="students"] {
  width: var(--consonant-merch-card-plans-edu-width);
}

/* Mobile */
@media screen and ${MOBILE_LANDSCAPE} {
  merch-card[variant="plans"][segment="students"] {
    min-width: var(--consonant-merch-card-plans-width);
    max-width: var(--consonant-merch-card-plans-edu-width);
    width: 100%;
  }
}
`;
