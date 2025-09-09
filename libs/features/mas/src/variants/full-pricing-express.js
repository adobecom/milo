import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './full-pricing-express.css.js';

export const FULL_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING = {
    title: {
        tag: 'h3',
        slot: 'heading-xs',
        maxCount: 250,
        withSuffix: true,
    },
    badge: {
        tag: 'div',
        slot: 'badge',
        default: 'spectrum-blue-400',
    },
    allowedBadgeColors: [
        'spectrum-blue-400',
        'spectrum-gray-300',
        'spectrum-yellow-300',
        'gradient-purple-blue',
        'gradient-firefly-spectrum',
    ],
    description: {
        tag: 'div',
        slot: 'body-xs',
        maxCount: 2000,
        withSuffix: false,
    },
    description2: {  // NEW - Features list
        tag: 'div',
        slot: 'description2',
        maxCount: 3000,
        withSuffix: false,
    },
    prices: {
        tag: 'div',
        slot: 'price',
    },
    ctas: {
        slot: 'cta',
        size: 'XL',
    },
    borderColor: {
        attribute: 'border-color',
        specialValues: {
            gray: 'var(--spectrum-gray-300)',
            blue: 'var(--spectrum-blue-400)',
            'gradient-purple-blue': 'linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)',
            'gradient-firefly-spectrum': 'linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)',
        },
    },
    disabledAttributes: ['trialBadgeColor', 'trialBadgeBorderColor'],
};

export class FullPricingExpress extends VariantLayout {
    getGlobalCSS() {
        return CSS;
    }

    get aemFragmentMapping() {
        return FULL_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING;
    }

    get headingSelector() {
        return '[slot="heading-xs"]';
    }

    renderLayout() {
        return html`
            <div class="badge-wrapper">
                <slot name="badge"></slot>
            </div>
            <div class="card-content">
                <div class="header">
                    <slot name="heading-xs"></slot>
                </div>
                <div class="description">
                    <slot name="body-xs"></slot>
                </div>
                <div class="price-container">
                    <slot name="price"></slot>
                </div>
                <div class="cta">
                    <slot name="cta"></slot>
                </div>
                <div class="description2">
                    <slot name="description2"></slot>
                </div>
            </div>
            <slot></slot>
        `;
    }

    static variantStyle = css`
        :host([variant='full-pricing-express']) {
            /* CSS Variables */
            --merch-card-full-pricing-express-width: 378px;
            --merch-card-full-pricing-express-mobile-width: 365px;
            --merch-card-full-pricing-express-padding: 24px;
            --merch-card-full-pricing-express-padding-mobile: 20px;
            --merch-card-full-pricing-express-section-gap: 16px;
            
            /* Price container specific */
            --merch-card-full-pricing-express-price-bg: #F8F8F8;
            --merch-card-full-pricing-express-price-padding: 16px;
            --merch-card-full-pricing-express-price-radius: 8px;
            
            /* Typography - matching simplified-pricing-express */
            --merch-card-full-pricing-express-price-font-size: 28px;
            --merch-card-full-pricing-express-price-line-height: 36.4px;
            --merch-card-full-pricing-express-price-font-weight: 700;
            --merch-card-full-pricing-express-body-xs-font-size: 14px;
            --merch-card-full-pricing-express-body-xs-line-height: 21px;
            --merch-card-full-pricing-express-cta-font-size: 18px;
            --merch-card-full-pricing-express-cta-font-weight: 700;
            --merch-card-full-pricing-express-cta-line-height: 23.4px;
            
            /* Gradient definitions (reused) */
            --gradient-purple-blue: linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%);
            --gradient-firefly-spectrum: linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%);
            
            width: var(--merch-card-full-pricing-express-width);
            max-width: var(--merch-card-full-pricing-express-width);
            background: transparent;
            border: none;
            display: flex;
            flex-direction: column;
            overflow: visible;
            box-sizing: border-box;
            position: relative;
        }

        /* Badge wrapper styling (same as simplified) */
        :host([variant='full-pricing-express']) .badge-wrapper {
            padding: 4px 12px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            font-size: 12px;
            font-weight: 500;
            line-height: 15.6px;
            color: var(--spectrum-gray-800);
            position: relative;
            min-height: 23px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Hide badge wrapper when empty */
        :host([variant='full-pricing-express']) .badge-wrapper:empty,
        :host([variant='full-pricing-express']:not(:has([slot="badge"]:not(:empty)))) .badge-wrapper {
            display: none;
        }

        /* Card content styling */
        :host([variant='full-pricing-express']) .card-content {
            border-radius: 8px;
            padding: var(--merch-card-full-pricing-express-padding);
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--merch-card-full-pricing-express-section-gap);
            position: relative;
        }
        
        :host([variant='full-pricing-express']) .card-content > * {
            position: relative;
        }
        
        /* Regular border styling */
        :host([variant='full-pricing-express']:not([gradient-border='true'])) .card-content {
            background: var(--spectrum-gray-50);
            border: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        /* When badge exists, adjust card content border radius */
        :host([variant='full-pricing-express']:has([slot="badge"]:not(:empty))) .card-content {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        
        /* When badge exists with regular border, ensure top border */
        :host([variant='full-pricing-express']:not([gradient-border='true']):has([slot="badge"]:not(:empty))) .card-content {
            border-top: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        /* When badge has content, ensure seamless connection */
        :host([variant='full-pricing-express']:has([slot="badge"]:not(:empty))) .badge-wrapper {
            margin-bottom: -2px;
        }
        
        /* Gradient border styling (reused from simplified) */
        :host([variant='full-pricing-express'][gradient-border='true']) .badge-wrapper {
            border: none;
            margin-bottom: -6px;
            padding-bottom: 6px;
        }
        
        :host([variant='full-pricing-express'][gradient-border='true']) .badge-wrapper ::slotted(*) {
            color: white !important;
        }

        :host([variant='full-pricing-express'][gradient-border='true']) .card-content {
            position: relative;
            border: none;
            padding: calc(var(--merch-card-full-pricing-express-padding) + 2px);
            border-radius: 8px;
        }
        
        :host([variant='full-pricing-express'][gradient-border='true']) .card-content::before {
            content: '';
            position: absolute;
            top: 1px;
            left: 1px;
            right: 1px;
            bottom: 1px;
            background: var(--spectrum-gray-50);
            border-radius: 7px;
            z-index: 0;
            pointer-events: none;
        }
        
        /* Gradient backgrounds */
        :host([variant='full-pricing-express'][border-color='gradient-purple-blue']) .badge-wrapper,
        :host([variant='full-pricing-express'][border-color='gradient-purple-blue']) .card-content {
            background: var(--gradient-purple-blue);
        }
        
        :host([variant='full-pricing-express'][border-color='gradient-firefly-spectrum']) .badge-wrapper,
        :host([variant='full-pricing-express'][border-color='gradient-firefly-spectrum']) .card-content {
            background: var(--gradient-firefly-spectrum);
        }
        
        /* When gradient and badge exist, keep rounded corners for smooth transition */
        :host([variant='full-pricing-express'][gradient-border='true']:has([slot="badge"]:not(:empty))) .card-content {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        
        :host([variant='full-pricing-express'][gradient-border='true']:has([slot="badge"]:not(:empty))) .card-content::before {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
        }

        /* Header styling */
        :host([variant='full-pricing-express']) .header {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
        }

        :host([variant='full-pricing-express']) [slot="heading-xs"] {
            font-size: 18px;
            font-weight: 700;
            line-height: 23.4px;
            color: var(--spectrum-gray-800);
        }

        /* Description sections */
        :host([variant='full-pricing-express']) .description,
        :host([variant='full-pricing-express']) .description2 {
            display: flex;
            flex-direction: column;
        }

        /* Features section (description2) */
        :host([variant='full-pricing-express']) .features-label {
            font-size: 14px;
            font-weight: 700;
            line-height: 18.2px;
            margin: 0 0 8px 0;
            color: var(--spectrum-gray-800);
        }

        /* Price container with background */
        :host([variant='full-pricing-express']) .price-container {
            background: var(--merch-card-full-pricing-express-price-bg);
            padding: var(--merch-card-full-pricing-express-price-padding);
            border-radius: var(--merch-card-full-pricing-express-price-radius);
            display: flex;
            flex-direction: column;
            margin-top: auto;
        }

        /* CTA styling */
        :host([variant='full-pricing-express']) .cta,
        :host([variant='full-pricing-express']) .cta ::slotted(*) {
            width: 100%;
            display: block;
        }

        /* Mobile styles */
        @media (max-width: 767px) {
            :host([variant='full-pricing-express']) {
                width: var(--merch-card-full-pricing-express-mobile-width);
                max-width: var(--merch-card-full-pricing-express-mobile-width);
            }
            
            :host([variant='full-pricing-express']) .card-content {
                padding: var(--merch-card-full-pricing-express-padding-mobile);
            }
            
            :host([variant='full-pricing-express'][gradient-border='true']) .card-content {
                padding: calc(var(--merch-card-full-pricing-express-padding-mobile) + 2px);
            }
            
            /* HIDE description2 (features) on mobile */
            :host([variant='full-pricing-express']) .description2 {
                display: none !important;
            }
        }

        /* Tablet and Desktop - fixed heights for alignment */
        @media (min-width: 768px) {
            :host([variant='full-pricing-express']) {
                display: flex;
                flex-direction: column;
                height: auto;
            }

            :host([variant='full-pricing-express']) .cta {
                flex-shrink: 0;
            }
        }
    `;
}
