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
merch-card[variant="simplified-pricing-express"] [slot="cta"] button {
    width: 100%;
    color: var(--merch-card-simplified-pricing-express-cta-color);
    font-size: 16px;
    font-weight: 700;
    line-height: 20.8px;
}

/* Base styles for all checkout-link buttons */
merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button {
    /* Display and sizing */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 40px; /* XL size sp-button height */
    padding: 0 24px; /* XL size sp-button padding */
    box-sizing: border-box;
    
    /* Typography */
    font-size: 16px; /* XL size sp-button font size */
    font-weight: 700; /* Bold text as requested */
    line-height: 24px;
    text-decoration: none;
    text-align: center;
    
    /* Border and shape */
    border: 2px solid;
    border-radius: 24px; /* Spectrum button border radius */
    
    /* Interaction */
    cursor: pointer;
    transition: background-color 130ms ease-in-out, 
                border-color 130ms ease-in-out,
                color 130ms ease-in-out;
    outline: none;
    position: relative;
}

/* Accent variant (con-button blue) */
merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button.blue {
    background-color: var(--spectrum-indigo-900, rgba(82, 88, 228, 1));
    border-color: var(--spectrum-indigo-900, rgba(82, 88, 228, 1));
    color: white;
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button.blue:hover {
    background-color: var(--spectrum-indigo-1000, rgba(73, 78, 216, 1));
    border-color: var(--spectrum-indigo-1000, rgba(73, 78, 216, 1));
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button.blue:active {
    background-color: var(--spectrum-indigo-1100, rgba(64, 68, 204, 1));
    border-color: var(--spectrum-indigo-1100, rgba(64, 68, 204, 1));
}

/* Outline variant (con-button without blue) */
merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button:not(.blue) {
    background-color: transparent;
    border-color: var(--spectrum-gray-700, #464646);
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button:not(.blue):hover {
    background-color: var(--spectrum-gray-200, #E8E8E8);
    border-color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button:not(.blue):active {
    background-color: var(--spectrum-gray-300, #D3D3D3);
    border-color: var(--spectrum-gray-900, #1a1a1a);
}

/* Focus state for both variants */
merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button:focus-visible {
    outline: 2px solid var(--spectrum-blue-900, #0062E3);
    outline-offset: 2px;
}

/* Ensure span inside button doesn't interfere with click */
merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"].con-button span {
    pointer-events: none;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"] {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] .price p {
  font-size: var(--merch-card-simplified-pricing-express-price-p-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-p-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] .price .price-currency-symbol {
  font-size: var(--merch-card-simplified-pricing-express-price-currency-symbol-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-currency-symbol-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-currency-symbol-line-height);
  color: var(--spectrum-gray-700);
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button[variant="accent"],
merch-card[variant="simplified-pricing-express"] [slot="cta"] button.spectrum-Button--accent {
    background-color: var(--spectrum-indigo-900);
}

merch-card[variant="simplified-pricing-express"] [slot="footer"] sp-button[variant="accent"] {
    background-color: var(--spectrum-indigo-900);
`;
