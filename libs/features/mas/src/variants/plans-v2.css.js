
import { MOBILE_LANDSCAPE, TABLET_DOWN, TABLET_UP, DESKTOP_UP, LARGE_DESKTOP } from '../media.js';

export const CSS = `
:root {
    --consonant-merch-card-plans-v2-width: 385px;
    --consonant-merch-card-plans-v2-height: auto;
    --consonant-merch-card-plans-v2-icon-size: 35px;
    --consonant-merch-card-plans-v2-border-color: #DADADA;
    --consonant-merch-card-plans-v2-border-radius: 8px;
    --picker-up-icon-black: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18"><path d="M14 10.99a1 1 0 0 1-1.706.706L9.005 8.41l-3.289 3.286a1 1 0 0 1-1.437-1.387l.025-.024L8.3 6.293a1 1 0 0 1 1.413 0l3.994 3.991a.995.995 0 0 1 .293.706z" fill="%23000000"/></svg>');
    --picker-down-icon-black: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18"><path d="M4 7.01a1 1 0 0 1 1.706-.706L8.993 9.59l3.29-3.285A1 1 0 0 1 13.72 7.69l-.024.025L9.7 11.707a1 1 0 0 1-1.413 0L4.293 7.716A.995.995 0 0 1 4 7.01z" fill="%23000000"/></svg>');

}

merch-card[variant="plans-v2"] {
    width: var(--consonant-merch-card-plans-v2-width);
    height: var(--consonant-merch-card-plans-v2-height);
    border: 1px solid var(--consonant-merch-card-border-color, var(--consonant-merch-card-plans-v2-border-color));
    border-radius: var(--consonant-merch-card-plans-v2-border-radius);
    background-color: var(--spectrum-gray-50, #FFFFFF);
}

merch-card[variant="plans-v2"][size="wide"],
merch-card[variant="plans-v2"][size="super-wide"] {
    width: 100%;
    max-width: 768px;
}

merch-card[variant="plans-v2"] [slot="icons"] {
    --img-width: var(--consonant-merch-card-plans-v2-icon-size);
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] span.price-unit-type {
    display: inline;
}

merch-card[variant="plans-v2"] .price-unit-type:not(.disabled)::before {
    content: none;
}

merch-card[variant="plans-v2"] [slot="description"] {
    min-height: auto;
}

merch-card[variant="plans-v2"] [slot="description"] {
    min-height: auto;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] {
    margin-top: 0;
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] merch-addon {
    --merch-addon-gap: 10px;
    --merch-addon-align: flex-start;
}

merch-card[variant="plans-v2"] merch-addon span[data-template="price"] {
    display: inline;
}

merch-card[variant="plans-v2"] span[data-template="legal"] {
    display: inline;
    color: var(--spectrum-gray-600, #6E6E6E);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375;
}

merch-card[variant="plans-v2"] span.text-l {
    display: inline;
    font-size: inherit;
    line-height: inherit;
}

merch-card[variant="plans-v2"] [slot="callout-content"] {
    margin: 0;
}

merch-card[variant="plans-v2"] [slot='callout-content'] > div > div,
merch-card[variant="plans-v2"] [slot="callout-content"] > p {
    background: transparent;
    padding: 0;
}

merch-card[variant="plans-v2"] [slot="footer"] a {
    line-height: 1.2;
    padding: 9px 11px;
}

merch-card[variant="plans-v2"][border-color="spectrum-red-700-plans"] {
    border-color: var(--spectrum-red-700-plans);
}

merch-card[variant="plans-v2"] [slot="icons"] img {
    width: var(--consonant-merch-card-plans-v2-icon-size);
    height: var(--consonant-merch-card-plans-v2-icon-size);
}

merch-card[variant="plans-v2"] [slot="heading-xs"] {
    font-size: 28px;
    font-weight: 900;
    font-family: 'Adobe Clean Display', sans-serif;
    line-height: 30.8px;
    color: var(--spectrum-gray-800, #2C2C2C);
}

merch-card[variant="plans-v2"][size="wide"] [slot="subtitle"] {
    font-size: 52px;
    font-weight: 900;
    line-height: 57.2px;
}

merch-card[variant="plans-v2"] [slot="heading-m"] {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-wrapper {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

merch-card[variant="plans-v2"] [slot="heading-m"] span.price {
    font-size: 22px;
    font-weight: 800;
    font-family: 'Adobe Clean', sans-serif;
    color: var(--spectrum-gray-900, #1E1E1E);
    line-height: 1.2;
}

merch-card[variant="plans-v2"] [slot="heading-m"] span.price.price-strikethrough {
    font-size: 18px;
    font-weight: 400;
    color: #6B6B6B;
}

merch-card[variant="plans-v2"] span[is='inline-price'] {
    display: block;
}

merch-card[variant="plans-v2"] [slot="heading-m"]:has(span[is='inline-price'] + span[is='inline-price']) span[is='inline-price'] {
    display: inline;
    text-decoration: none;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-legal {
    font-size: 16px;
    font-weight: 400;
    color: var(--spectrum-gray-600, #6E6E6E);
    line-height: 1.375;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-recurrence,
merch-card[variant="plans-v2"] [slot="heading-m"] span[data-template="recurrence"] {
    text-transform: lowercase;
    color: #6B6B6B;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-plan-type,
merch-card[variant="plans-v2"] [slot="heading-m"] span[data-template="planType"] {
    display: block;
    text-transform: capitalize;
    color: #2C2C2C;
    font-size: 14px;
    font-weight: 400;
}

merch-card[variant="plans-v2"] [slot="promo-text"] {
    font-size: 16px;
    font-weight: 700;
    font-family: 'Adobe Clean', sans-serif;
    color: var(--merch-color-green-promo, #05834E);
    line-height: 1.5;
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] [slot="promo-text"] a {
    color: inherit;
    text-decoration: underline;
}

merch-card[variant="plans-v2"] [slot="body-xs"] {
    font-size: 18px;
    font-weight: 400;
    font-family: 'Adobe Clean', sans-serif;
    color: var(--spectrum-gray-700, #4B4B4B);
    line-height: 25.2px;
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] {
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] label {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: var(--spectrum-gray-700, #4B4B4B);
    margin-bottom: 8px;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] merch-quantity-select {
    width: 100%;
    --qs-input-height: 44px;
    --qs-button-width: 44px;
    --qs-font-size: 16px;
    --qs-border-color: #909090;
    --qs-border-width: 1px;
    --qs-background-color: #FFFFFF;
    --qs-label-font-size: 12px;
    --qs-label-color: #222;
    --radius: 8px;
    --picker-up-icon: var(--picker-up-icon-black);
    --picker-down-icon: var(--picker-down-icon-black);
    --picker-button-border-left: none;
}

merch-card[variant="plans-v2"] .picker-button {
    border-left: none;
}

merch-card[variant="plans-v2"] [slot="footer"] {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: auto;
    padding-top: 16px;
}

merch-card[variant="plans-v2"] [slot="footer"] a {
    width: 100%;
    text-align: center;
    padding: 9px 11px;
    border-radius: 20px;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.2;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.blue {
    background-color: #3B63FB;
    color: #FFFFFF;
    border: 2px solid #3B63FB;
    border-radius: 20px;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.blue:hover {
    background-color: #0D66D0;
    border-color: #0D66D0;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.outline {
    background-color: transparent;
    color: #3B63FB;
    border: 2px solid #3B63FB;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.outline:hover {
    background-color: #F5F5F5;
}


merch-card[variant="plans-v2"] h4 {
    font-size: 16px;
    font-weight: 700;
    color: var(--spectrum-gray-800, #2C2C2C);
    margin: 0 0 16px 0;
}

merch-card[variant="plans-v2"] ul {
    padding: 0 0 0 20px;
    margin: 0;
}

merch-card[variant="plans-v2"] ul li {
    font-size: 16px;
    font-weight: 400;
    color: var(--spectrum-gray-700, #4B4B4B);
    line-height: 1.625;
    margin-bottom: 12px;
    position: relative;
    margin: 0;
    padding: 7px 0 8px 5px;
    list-style-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -3 18 18" height="18px"><path fill="currentcolor" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"></path></svg>');

}

merch-card[variant="plans-v2"] .help-text {
    font-size: 12px;
    font-weight: 400;
    color: var(--spectrum-gray-600, #6E6E6E);
    line-height: 1.5;
    margin-top: 8px;
}

@media screen and ${TABLET_UP}, ${DESKTOP_UP}, ${LARGE_DESKTOP} {
    :root {
        --consonant-merch-card-plans-v2-width: 385px;
    }
}

@media screen and ${MOBILE_LANDSCAPE}, ${TABLET_DOWN} {
    merch-card[variant="plans-v2"] {
        width: 100%;
        max-width: var(--consonant-merch-card-plans-v2-width);
    }
}

.collection-container.plans {
    --merch-card-collection-card-min-height: 273px;
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-v2-width);
    max-width: 100%;
}

merch-sidenav.plans-v2 {
    --merch-sidenav-padding: 16px 20px 16px 16px;
}

merch-card-collection-header.plans {
    --merch-card-collection-header-columns: 1fr fit-content(100%);
    --merch-card-collection-header-areas: "result filter";
}

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-v2-width);
}

merch-card-collection.plans merch-card {
    width: auto;
    height: 100%;
}

merch-card-collection.plans merch-card[variant="plans-v2"] {
    display: grid;
    grid-template-rows: auto 1fr auto;
}

merch-card-collection.plans merch-card[variant="plans-v2"] .body {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: min-content;
    align-content: start;
}

merch-card-collection.plans merch-card[variant="plans-v2"] .heading-wrapper {
    min-height: 35px;
    align-items: center;
}

merch-card-collection.plans merch-card[variant="plans-v2"] [slot="icons"] {
    height: 35px;
    align-items: center;
}

merch-card-collection.plans merch-card[variant="plans-v2"] [slot="heading-xs"] {
    min-height: 31px;
    display: flex;
    align-items: center;
}

merch-card-collection.plans merch-card[variant="plans-v2"] aem-fragment + [slot^="heading-"] {
    margin-top: calc(40px + var(--consonant-merch-spacing-xxs));
}

merch-card-collection:has([slot="subtitle"]) merch-card[variant="plans-v2"] {
    --merch-card-plans-v2-subtitle-display: block;
}

merch-card[variant="plans-v2"][size="wide"] {
    width: 100%;
    max-width: 768px;
}

merch-card[variant="plans-v2"] .price-divider {
    display: none;
}

merch-card[variant="plans-v2"][size="wide"] .price-divider {
    display: block;
    height: 1px;
    background-color: #E8E8E8;
    margin: 16px 0;
}

merch-card[variant="plans-v2"][size="wide"] .heading-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 0;
}

merch-card[variant="plans-v2"][size="wide"] .heading-wrapper [slot="icons"] {
    margin-bottom: 0;
}

merch-card[variant="plans-v2"][size="wide"] .heading-wrapper [slot="heading-xs"] {
    margin: 0;
}

merch-card[variant="plans-v2"][size="wide"] [slot="body-xs"] {
    margin-bottom: 0;
}

merch-card[variant="plans-v2"][size="wide"] [slot="heading-m"] {
    margin-top: 0;
}

merch-card[variant="plans-v2"][size="wide"] footer {
    align-items: flex-start;
}

merch-card[variant="plans-v2"][size="wide"] footer [slot="heading-m"] {
    order: -1;
    margin-bottom: 16px;
    align-self: flex-start;
}

/* Mobile */
@media screen and ${MOBILE_LANDSCAPE} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
}

/* Tablet */
@media screen and ${TABLET_UP} {
    .four-merch-cards.plans-v2 .foreground {
        max-width: unset;
    }
}

/* Desktop */
@media screen and ${DESKTOP_UP} {
    :root {
        --consonant-merch-card-plans-v2-width: 385px;
    }

    merch-sidenav.plans-v2 {
        --merch-sidenav-collection-gap: 30px;
    }

    .columns .four-merch-cards.plans-v2 {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-v2-width));
    }

    .four-merch-cards.plans,
    .four-merch-cards.plans-v2 {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-v2-width));
    }

    merch-card-collection-header.plans {
        --merch-card-collection-header-columns: fit-content(100%);
        --merch-card-collection-header-areas: "custom";
    }

    .collection-container.plans:has(merch-sidenav) {
        width: fit-content;
        max-width: 100%;
        position: relative;
        left: 50%;
        transform: translateX(-50vw);
        justify-content: start;
        padding-inline: 30px;
    }
}

/* Large Desktop */
@media screen and ${LARGE_DESKTOP} {
    .four-merch-cards.plans,
    .four-merch-cards.plans-v2 {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-v2-width));
    }

    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-v2-width));
    }

    merch-sidenav.plans-v2 {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;
