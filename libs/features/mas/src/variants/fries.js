import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './fries.css.js';

export const FRIES_AEM_FRAGMENT_MAPPING = {
    mnemonics: { size: 's' },
    title: { tag: 'h3', slot: 'heading-xxs', maxCount: 250, withSuffix: true },
    description: {
        tag: 'div',
        slot: 'body-s',
        maxCount: 2000,
        withSuffix: false,
    },
    badge: { tag: 'div', slot: 'badge' , default: 'spectrum-yellow-300'},
    trialBadge: { tag: 'div', slot: 'trial-badge', default: 'spectrum-green-800' },
    prices: { tag: 'p', slot: 'price' },
    ctas: { slot: 'cta', size: 'M' },
    addonConfirmation: { tag: 'div', slot: 'addon-confirmation' },
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
                  <div class="cta">
                    <slot name="cta"></slot>
                    <slot name="addon-confirmation"></slot>
                  </div>
                  <slot name="price"></slot>
                </div>
            </div>
            <slot></slot>
        `;
    }

    static variantStyle = css`
        :host([variant='fries']) {
            --merch-card-fries-max-width: 620px;
            --merch-card-fries-padding: 24px;
            --merch-card-fries-min-height: 204px;
            --merch-card-fries-header-min-height: 36px;
            --merch-card-fries-gray-background: rgba(248, 248, 248);
            --merch-card-fries-text-color: rgba(19, 19, 19);
            --merch-card-fries-price-line-height: 17px;
            --merch-card-fries-outline: transparent;
            --merch-card-custom-border-width: 1px;
            max-width: var(--merch-card-fries-max-width);
            min-height: var(--merch-card-fries-min-height);
            background-color: var(
                --merch-card-custom-background-color,
                var(--spectrum-gray-300)
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
            flex-grow: 1;
        }

        :host([variant='fries']) .header {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--consonant-merch-spacing-xxs);
            padding-bottom: 15px;
            padding-top: 5px;
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

        :host([variant='fries']) .cta  {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
            margin-top: 15px;
        }
    `;
}

customElements.define('fries-card', FriesCard); 

