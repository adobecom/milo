import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './simplified-pricing-express.css.js';

export const SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING = {
    mnemonics: {
        size: 's',
    },
    title: {
        tag: 'h3',
        slot: 'heading-l',
        maxCount: 250,
        withSuffix: true,
    },
    badge: {
        tag: 'div',
        slot: 'badge',
    },
    description: {
        tag: 'div',
        slot: 'body-s',
        maxCount: 2000,
        withSuffix: false,
    },
    prices: {
        tag: 'p',
        slot: 'price',
    },
    ctas: {
        slot: 'cta',
        size: 'L',
    },
    borderColor: {
        attribute: 'border-color',
        specialValues: {
            gray: '--spectrum-gray-300',
            blue: '--spectrum-blue-400',
        },
    },
};

export class SimplifiedPricingExpress extends VariantLayout {
    getGlobalCSS() {
        return CSS;
    }

    get aemFragmentMapping() {
        return SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING;
    }

    renderLayout() {
        return html`
            <div class="header">
                <slot name="heading-l"></slot>
                <slot name="badge"></slot>
            </div>
            <div class="description">
                <slot name="body-s"></slot>
            </div>
            <div class="price">
                <slot name="price"></slot>
            </div>
            <div class="cta">
                <slot name="cta"></slot>
            </div>
        `;
    }

    static variantStyle = css`
        :host([variant='simplified-pricing-express']) {
            --merch-card-simplified-pricing-express-max-width: 246px;
            --merch-card-simplified-pricing-express-padding: 24px;
            --merch-card-simplified-pricing-express-min-height: 341px;
            --merch-card-simplified-pricing-express-price-font-size: 28px;
            --merch-card-simplified-pricing-express-price-font-weight: 900;
            --merch-card-simplified-pricing-express-price-line-height: 36.4px;
            --merch-card-simplified-pricing-express-price-currency-font-size: 22px;
            --merch-card-simplified-pricing-express-price-currency-font-weight: 700;
            --merch-card-simplified-pricing-express-price-currency-line-height: 28.6px;
            --merch-card-simplified-pricing-express-price-currency-symbol-font-size: 22px;
            --merch-card-simplified-pricing-express-price-currency-symbol-font-weight: 700;
            --merch-card-simplified-pricing-express-price-currency-symbol-line-height: 28.6px;
            --merch-card-simplified-pricing-express-body-s-line-height: 20.8px;
            --merch-card-simplified-pricing-express-price-p-font-size: 14px;
            --merch-card-simplified-pricing-express-price-p-font-weight: 400;
            --merch-card-simplified-pricing-express-price-p-line-height: 15.6px;
            max-width: var(--merch-card-simplified-pricing-express-max-width);
            min-height: var(--merch-card-simplified-pricing-express-min-height);
            background: var(--spectrum-gray-50);
            border: 1px solid var(--merch-card-custom-border-color, transparent);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: var(--merch-card-simplified-pricing-express-padding);
            gap: 16px;
            box-sizing: border-box;
            position: relative;
        }

        :host([variant='simplified-pricing-express']) .header {
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            gap: 8px;
        }

        :host([variant='simplified-pricing-express']) .badge {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--spectrum-blue-400);
            color: white;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 700;
            z-index: 1;
        }

        :host([variant='simplified-pricing-express']) .pricing-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        :host([variant='simplified-pricing-express']) .price-container {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            gap: 4px;
        }

        :host([variant='simplified-pricing-express']) .cta-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: auto;
        }

        :host([variant='simplified-pricing-express']) .cta {
            width: 100%;
            display: flex;
            flex-direction: row;
            gap: 8px;
            margin-top: auto;
        }

        :host([variant='simplified-pricing-express']) .cta ::slotted(*) {
            flex: 1;
            width: 100%;
        }

        :host([variant='simplified-pricing-express']) .footer-text {
            font-size: 12px;
            line-height: 1.4;
            color: var(--spectrum-gray-700);
        }
    `;
}

customElements.define(
    'simplified-pricing-express-card',
    SimplifiedPricingExpress,
);
