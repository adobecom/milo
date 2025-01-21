export const CSS = `
    merch-card[variant="ah-single-plan"] [slot="heading-xs"] {
        letter-spacing: normal;
        font-size: 14px;
        line-height: 18px;
        color: var(--merch-card-ah-single-plan-text-color);
    }

    merch-card[variant="ah-single-plan"] [slot="body-xxs"] {
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
        margin-bottom: 16px;
        box-sizing: border-box;
        color: var(--merch-card-ah-single-plan-text-color);
    }

    merch-card[variant="ah-single-plan"] [slot="price"] a {
        color: var(--merch-card-ah-single-plan-text-color);
    }


    merch-card[variant="ah-single-plan"] [slot="price"] span[is="inline-price"] {
        font-size: 14px;
        line-height: 18px;
    }

    merch-card[variant="ah-single-plan"] [slot='image'] img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
        overflow: hidden;
    }
`;