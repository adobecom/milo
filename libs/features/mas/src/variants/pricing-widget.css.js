export const CSS = `
:root {
  	--merch-card-pricing-widget-width: 132px;
  	--merch-card-pricing-widget-height: 212px;
}

merch-card[variant="pricing-widget"] [slot="heading-xxxs"] {
    letter-spacing: normal;
    font-size: 12px;
    line-height: 18px;
    color: var(--spectrum-gray-800);
}

merch-card[variant="pricing-widget"] [slot="body-xxs"] {
    letter-spacing: normal;
    max-height: 54px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    margin-bottom: 12px;
    box-sizing: border-box;
    color: var(--spectrum-gray-800);
}

merch-card[variant="pricing-widget"] [slot="price"] a {
    color: var(--spectrum-gray-900);
}


merch-card[variant="pricing-widget"] [slot="price"] span[is="inline-price"] {
    font-size: 14px;
    line-height: 18px;
}
  `;
