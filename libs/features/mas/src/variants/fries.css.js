import { css } from 'lit';

export const CSS = css`
    :host {
        --merch-card-fries-min-width: 620px;
        --merch-card-fries-height: 220px;
        --merch-card-fries-padding: 24px;
        --merch-card-fries-content-min-width: 300px;
        --merch-card-fries-header-min-height: 36px;
        --merch-card-fries-text-color: var(--spectrum-neutral-content-color-default);
        --merch-card-fries-price-line-height: 17px;
        --merch-card-fries-outline: transparent;
        --merch-card-custom-border-width: 1px;
    }

    :host([variant='fries']) {
        background-color: var(
            --merch-card-custom-background-color,
            var(--consonant-merch-card-background-color)
        );
    }

    :host([variant='fries']) ::slotted([slot='heading-xxxs']) {
        font-size: var(--spectrum-heading-s-text-size);
        font-weight: var(--spectrum-heading-s-text-font-weight);
        line-height: var(--spectrum-heading-s-text-line-height);
        margin: 0;
    }

    :host([variant='fries']) ::slotted([slot='body-xxs']) {
        font-size: var(--spectrum-body-s-text-size);
        font-weight: var(--spectrum-body-s-text-font-weight);
        line-height: var(--spectrum-body-s-text-line-height);
        color: var(--spectrum-neutral-content-color-default);
        margin: 0;
    }

    :host([variant='fries']) ::slotted([slot='image']) {
        width: 200px;
        height: 100%;
        object-fit: contain;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    :host([variant='fries']) ::slotted([slot='cta']) {
        display: flex;
        gap: 8px;
    }
`; 
