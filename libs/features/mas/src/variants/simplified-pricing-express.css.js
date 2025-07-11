import { TABLET_DOWN, DESKTOP_UP } from '../media.js';

export const CSS = `
:root {
    --consonant-merch-card-simplified-pricing-express-width: 294px;
    --merch-card-simplified-pricing-express-cta-color: var(
        var(--spectrum-gray-50),
        rgba(255, 255, 255, 1)
    );
}

merch-card[variant="simplified-pricing-express"] {
    min-width: var(--consonant-merch-card-simplified-pricing-express-width);
    background-color: var(--spectrum-gray-50);
    border-radius: 16px;
    height: 100%;
    display: flex;
}

/* Grid layout for simplified-pricing-express cards */
.section .content:has(merch-card[variant="simplified-pricing-express"]) {
    display: grid;
    justify-content: center;
    justify-items: center;
    align-items: stretch;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
}

/* Mobile/Tablet - Single column */
@media screen and ${TABLET_DOWN} {
    .section .content:has(merch-card[variant="simplified-pricing-express"]) {
        grid-template-columns: 1fr;
    }
    
    merch-card[variant="simplified-pricing-express"] {
        width: 100%;
        max-width: var(--consonant-merch-card-simplified-pricing-express-width);
    }
}

/* Desktop - 4 columns */
@media screen and ${DESKTOP_UP} {
    .section .content:has(merch-card[variant="simplified-pricing-express"]) {
        grid-template-columns: repeat(4, var(--consonant-merch-card-simplified-pricing-express-width));
        max-width: calc(4 * var(--consonant-merch-card-simplified-pricing-express-width) + 3 * var(--consonant-merch-spacing-m));
        margin: 0 auto;
    }
}

merch-card[variant="simplified-pricing-express"] p {
    margin: 0 !important;
}

merch-card[variant="simplified-pricing-express"] [slot="body-s"] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--merch-card-simplified-pricing-express-body-s-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-top: auto;
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button,
merch-card[variant="simplified-pricing-express"] [slot="cta"] button,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"] {
    width: 100%;
    font-weight: 700;
    line-height: 23.4px;
    margin: 0;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"] {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"][data-template="optical"] {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-font-weight);
  color: var(--spectrum-gray-800);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] p {
  font-size: var(--merch-card-simplified-pricing-express-price-p-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-p-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] .price-currency-symbol {
  font-size: var(--merch-card-simplified-pricing-express-price-currency-symbol-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-currency-symbol-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-currency-symbol-line-height);
  color: var(--spectrum-gray-700);
  width: 100%;
}

/* Remove default strikethrough for simplified-pricing-express */
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-strikethrough, 
merch-card[variant="simplified-pricing-express"] span.placeholder-resolved[data-template='strikethrough'] {
  text-decoration: none !important;
}

/* Apply strikethrough only to price numbers */
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-integer,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-decimals-delimiter,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-decimals {
  text-decoration: line-through;
  font-size: 28px;
  font-weight: 900;
  line-height: 36.4px;
  text-decoration-thickness: 2px;
}

/* Hide screen reader only text */
merch-card[variant="simplified-pricing-express"] sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button[variant="accent"],
merch-card[variant="simplified-pricing-express"] [slot="cta"] button.spectrum-Button--accent,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a.spectrum-Button.spectrum-Button--accent {
    background-color: var(--spectrum-indigo-900);
}

merch-card[variant="simplified-pricing-express"] [slot="footer"] sp-button[variant="accent"] {
    background-color: var(--spectrum-indigo-900);
}
`;
