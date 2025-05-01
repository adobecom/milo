import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './fries.css.js';

export const FRIES_AEM_FRAGMENT_MAPPING = {
    mnemonics: { size: 's' },
    title: { tag: 'h3', slot: 'heading-xxs', maxCount: 60, withSuffix: true },
    description: {
        tag: 'div',
        slot: 'body-xxs',
        maxCount: 200,
        withSuffix: false,
    },
    prices: { tag: 'p', slot: 'price' },
    ctas: { slot: 'cta', size: 'S' },
    backgroundColor: { attribute: 'background-color' },
    borderColor: { attribute: 'border-color', specialValues: {} },
    allowedColors: {
        gray: '--spectrum-gray-100',
    },
};

export class FriesCard extends VariantLayout {
    getGlobalCSS() {
        return CSS;
    }

    get aemFragmentMapping() {
        return FRIES_AEM_FRAGMENT_MAPPING;
    }

    renderLayout() {
        return html`
            <div class="content">
                <div class="header">
                    <slot name="icons"></slot>
                    <slot name="heading-xxs"></slot>
                </div>
                <slot name="body-s"></slot>
                <div class="footer">
                    <slot name="cta"></slot>
                </div>
                <div class="price">
                    <slot name="price"></slot>
                </div>
            </div>
            <slot></slot>
        `;
    }

    static variantStyle = css`
        :host([variant='fries']) {
            --merch-card-fries-min-width: 620px;
            --merch-card-fries-height: 220px;
            --merch-card-fries-padding: 24px;
            --merch-card-fries-content-min-width: 300px;
            --merch-card-fries-header-min-height: 36px;
            --merch-card-fries-gray-background: rgba(248, 248, 248);
            --merch-card-fries-text-color: rgba(19, 19, 19);
            --merch-card-fries-price-line-height: 17px;
            --merch-card-fries-outline: transparent;
            --merch-card-custom-border-width: 1px;
            height: var(--merch-card-fries-height);
            min-width: var(--merch-card-fries-min-width);
            background-color: var(
                --merch-card-custom-background-color,
                var(--consonant-merch-card-background-color)
            );
            color: var(--consonant-merch-card-heading-xxxs-color);
            border-radius: 10px;
            border: 1px solid var(--merch-card-custom-border-color, transparent);
            display: flex;
            flex-direction: row;
            overflow: hidden;
            padding: var(--merch-card-fries-padding) !important;
            gap: 16px;
            justify-content: space-between;
            box-sizing: border-box !important;
        }

        :host([variant='fries'][size='double']) {
            flex-direction: column;
        }

        :host([variant='fries']) .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: var(--merch-card-fries-content-min-width);
            flex-basis: var(--merch-card-fries-content-min-width);
            flex-grow: 1;
        }

        :host([variant='fries']) .header {
            display: flex;
            min-height: var(--merch-card-fries-header-min-height);
            flex-direction: row;
            align-items: center;
            gap: var(--consonant-merch-spacing-xxs);
            margin-bottom: 4px;
        }

        :host([variant='fries']) .price {
            display: flex;
            flex-grow: 1;
        }

        :host([variant='fries']) ::slotted([slot='price']) {
            margin-left: var(--spacing-xs);
            display: flex;
            flex-direction: column;
            justify-content: end;
            font-size: var(--consonant-merch-card-detail-s-font-size);
            font-style: italic;
            line-height: var(--merch-card-fries-price-line-height);
            color: var(--consonant-merch-card-heading-xxxs-color);
        }

        :host([variant='fries']) .footer {
            display: flex;
            width: fit-content;
            flex-wrap: wrap;
            gap: 8px;
            flex-direction: row;
        }
    `;
}

customElements.define('fries-card', FriesCard); 
