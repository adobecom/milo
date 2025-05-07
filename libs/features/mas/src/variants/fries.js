import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './fries.css.js';

export const FRIES_AEM_FRAGMENT_MAPPING = {
    mnemonics: { size: 's' },
    title: { tag: 'h3', slot: 'heading-xxs', maxCount: 250, withSuffix: true },
    description: {
        tag: 'div',
        slot: 'body-s',
        maxCount: 300,
        withSuffix: false,
    },
    badge: { tag: 'div', slot: 'badge' },
    trialBadge: { tag: 'div', slot: 'trial-badge' },
    prices: { tag: 'p', slot: 'price' },
    ctas: { slot: 'cta', size: 'M' },
    backgroundColor: { attribute: 'background-color' },
    borderColor: { attribute: 'border-color', specialValues: {
        gray: '--spectrum-gray-300',
    } },
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
                    <slot name="trial-badge"></slot>
                </div>
                <slot name="badge"></slot>
                <slot name="body-s"></slot>
                <div class="footer">
                    <slot name="cta"></slot>
                    <slot name="price"></slot>
                </div>
            </div>
            <slot></slot>
        `;
    }

    static variantStyle = css`
        :host([variant='fries']) {
            --merch-card-fries-min-width: 620px;
            --merch-card-fries-width: 620px;
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
            width: var(--merch-card-fries-width);
            min-width: var(--merch-card-fries-min-width);
            background-color: var(
                --merch-card-custom-background-color,
                var(--consonant-merch-card-background-color)
            );
            color: var(--consonant-merch-card-heading-xxxs-color);
            border-radius: 4px;
            border: 1px solid var(--merch-card-custom-border-color, transparent);
            display: flex;
            flex-direction: row;
            overflow: hidden;
            padding: var(--merch-card-fries-padding) !important;
            gap: 16px;
            justify-content: space-between;
            box-sizing: border-box !important;
        }

        :host([variant='fries']) .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: var(--merch-card-fries-content-min-width);
            flex-basis: var(--merch-card-fries-content-min-width);
            flex-grow: 1;
            gap: 15px;
        }

        :host([variant='fries']) .header {
            display: flex;
            min-height: var(--merch-card-fries-header-min-height);
            flex-direction: row;
            align-items: center;
            gap: var(--consonant-merch-spacing-xxs);
        }

        :host([variant='fries']) .footer {
          display: flex;
          width: fit-content;
          flex-wrap: nowrap;
          gap: 8px;
          flex-direction: row;
          margin-top: auto;
          align-items: end;
          width: 100%;
          justify-content: space-between;
        }
    `;
}

customElements.define('fries-card', FriesCard); 
