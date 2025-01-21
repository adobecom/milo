export const CSS = `
    merch-card[variant="ah-pricing-widget"] [slot="body-xxs"] {
        letter-spacing: normal;
        max-height: 54px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        display: -moz-box;
        -moz-box-orient: vertical;
        line-clamp: 3;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        margin-bottom: 12px;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-integer,
    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-decimals-delimiter,
    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-decimals {
        color: var(--consonant-merch-card-heading-xxxs-color);
        font-size: var(--consonant-merch-card-heading-xs-font-size);
        font-weight: 700;
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-currency-symbol {
        vertical-align: top;
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-currency-symbol,
    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-recurrence {
      font-size: var(--consonant-merch-card-body-xxs-font-size);
      color: var(--consonant-merch-card-body-xxs-color);
      font-weight: 400;
  }

    merch-card[variant="ah-pricing-widget"] [slot="price"] a {
        color: var(--consonant-merch-card-body-xxs-color);
    }

.spectrum--dark merch-card[variant="ah-pricing-widget"][background-color='gray']{
  --merch-card-ah-pricing-widget-gray-background: rgb(17, 17, 17);
}

.spectrum--dark merch-card[variant="ah-pricing-widget"] {
  --consonant-merch-card-background-color:rgb(17, 17, 17);
  --consonant-merch-card-heading-xxxs-color:rgb(242, 242, 242);
  --consonant-merch-card-body-xxs-color:rgb(219, 219, 219);
}

.spectrum--dark  merch-card[variant="ah-pricing-widget"]:hover {
  --consonant-merch-card-border-color:rgb(73, 73, 73);
}

`;
