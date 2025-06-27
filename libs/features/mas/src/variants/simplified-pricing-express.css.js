export const CSS = `
:root {
    --consonant-merch-card-simplified-pricing-express-width: 294px;
}

merch-card[variant="simplified-pricing-express"] {
    min-width: var(--consonant-merch-card-simplified-pricing-express-width);
    background-color: var(--spectrum-gray-50);
    border-radius: 16px;
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
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button[variant="accent"],
merch-card[variant="simplified-pricing-express"] [slot="cta"] button.spectrum-Button--accent {
    background-color: var(--spectrum-indigo-900);
}

merch-card[variant="simplified-pricing-express"] [slot="footer"] sp-button[variant="accent"] {
    background-color: var(--spectrum-indigo-900);
`;