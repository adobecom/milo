export const CSS = `
    merch-card[variant="ah-pricing-widget"] [slot="body-xxs"] {
        letter-spacing: normal;
        margin-bottom: 16px;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-pricing-widget"] [slot="heading-xxxs"] {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: -moz-box;
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        line-clamp: 3;
        -webkit-line-clamp: 3;
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price {
        line-height: var(--consonant-merch-card-detail-xl-line-height);
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
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        text-decoration-thickness: from-font;
        width: fit-content;
    }

    merch-card[variant="ah-pricing-widget"] [slot='image'] img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
        overflow: hidden;
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
