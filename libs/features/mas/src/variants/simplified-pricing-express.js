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
        tag: 'div',
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
            gradient:
                'linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%)',
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

    connectedCallback() {
        super.connectedCallbackHook();
        this.setupMobileAccordion();
    }

    setupMobileAccordion() {
        const merchCard = this.closest('merch-card');
        if (!merchCard) return;

        // Set initial state based on viewport - now includes tablet (up to 1199px)
        if (window.matchMedia('(max-width: 1199px)').matches) {
            // Check if this is the first simplified-pricing-express card
            const isFirstCard = this.isFirstCard(merchCard);
            merchCard.setAttribute('data-expanded', isFirstCard ? 'true' : 'false');
        }

        // Listen for viewport changes
        const mediaQuery = window.matchMedia('(max-width: 1199px)');
        this.mediaQueryListener = (e) => {
            if (e.matches) {
                const isFirstCard = this.isFirstCard(merchCard);
                merchCard.setAttribute('data-expanded', isFirstCard ? 'true' : 'false');
            } else {
                merchCard.removeAttribute('data-expanded');
            }
        };
        mediaQuery.addEventListener('change', this.mediaQueryListener);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.mediaQueryListener) {
            const mediaQuery = window.matchMedia('(max-width: 1199px)');
            mediaQuery.removeEventListener('change', this.mediaQueryListener);
        }
    }

    isFirstCard(merchCard) {
        let container = merchCard.parentElement; // This should be <p>
        while (container && !container.classList.contains('content')) {
            container = container.parentElement;
        }
        
        if (!container) {
            container = merchCard.closest('.section');
        }
        
        if (!container) {
            container = merchCard.parentElement?.parentElement;
        }
        
        if (container) {
            const allCards = container.querySelectorAll('merch-card[variant="simplified-pricing-express"]');
            return allCards.length > 0 && allCards[0] === merchCard;
        }
        
        return false;
    }

    handleChevronClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const merchCard = this.closest('merch-card');
        if (!merchCard || !window.matchMedia('(max-width: 1199px)').matches) return;
        
        const isExpanded = merchCard.getAttribute('data-expanded') === 'true';
        merchCard.setAttribute('data-expanded', !isExpanded ? 'true' : 'false');
    }

    renderLayout() {
        return html`
            <div class="header" @click=${this.handleChevronClick}>
                <slot name="heading-l"></slot>
                <slot name="badge"></slot>
                <button class="chevron-button" aria-label="Expand card" @click=${this.handleChevronClick}>
                    <svg class="chevron-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15.5L5 8.5L6.4 7.1L12 12.7L17.6 7.1L19 8.5L12 15.5Z" fill="currentColor"/>
                    </svg>
                </button>
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
            --merch-card-simplified-pricing-express-width: 294px;
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
            --merch-card-simplified-pricing-express-body-s-font-size: 16px;
            --merch-card-simplified-pricing-express-body-s-line-height: 20.8px;
            --merch-card-simplified-pricing-express-price-p-font-size: 12px;
            --merch-card-simplified-pricing-express-price-p-font-weight: 400;
            --merch-card-simplified-pricing-express-price-p-line-height: 15.6px;
            --merch-card-simplified-pricing-express-cta-font-size: 18px;
            --merch-card-simplified-pricing-express-cta-font-weight: 700;
            --merch-card-simplified-pricing-express-cta-line-height: 23.4px;
            width: var(--merch-card-simplified-pricing-express-width);
            max-width: var(--merch-card-simplified-pricing-express-width);
            min-height: var(--merch-card-simplified-pricing-express-min-height);
            height: 100%;
            background: var(--spectrum-gray-50);
            border: 2px solid var(--merch-card-custom-border-color, transparent);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: var(--merch-card-simplified-pricing-express-padding);
            gap: 16px;
            box-sizing: border-box;
            position: relative;
        }

        :host([variant='simplified-pricing-express'][gradient-border='true']) {
            border: none;
            background-origin: padding-box, border-box;
            background-clip: padding-box, border-box;
            background-image: linear-gradient(
                    to bottom,
                    #f8f8f8,
                    #f8f8f8
                ),
                linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%);
            border: 2px solid transparent;
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

        /* Mobile accordion styles */
        :host([variant='simplified-pricing-express']) .chevron-button {
            display: none;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        :host([variant='simplified-pricing-express']) .chevron-icon {
            width: 24px;
            height: 24px;
            color: var(--spectrum-gray-800);
            transition: transform 0.3s ease;
        }

        /* Mobile and Tablet - Show chevron */
        @media (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) .header {
                position: relative;
                padding-right: 32px;
                justify-content: flex-start;
                gap: 0;
                flex-wrap: wrap;
            }

            :host([variant='simplified-pricing-express']) .chevron-button {
                display: block;
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
            }
        }

        /* Mobile styles - 270px width */
        @media (max-width: 599px) {
            :host([variant='simplified-pricing-express']) {
                width: 270px;
                max-width: 270px;
                min-height: auto;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            /* Collapsed state */
            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) {
                gap: 0;
                padding: 16px;
                height: auto;
                min-height: auto;
            }

            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) .description,
            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) .price,
            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) .cta {
                display: none;
                height: 0;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }

            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) .chevron-icon {
                transform: rotate(0deg);
            }

            /* Expanded state */
            merch-card[variant='simplified-pricing-express'][data-expanded='true'] :host([variant='simplified-pricing-express']) .chevron-icon {
                transform: rotate(180deg);
            }

            /* Smooth transitions for collapsing content */
            :host([variant='simplified-pricing-express']) .description,
            :host([variant='simplified-pricing-express']) .price,
            :host([variant='simplified-pricing-express']) .cta {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            merch-card[variant='simplified-pricing-express'][data-expanded='true'] :host([variant='simplified-pricing-express']) .description,
            merch-card[variant='simplified-pricing-express'][data-expanded='true'] :host([variant='simplified-pricing-express']) .price,
            merch-card[variant='simplified-pricing-express'][data-expanded='true'] :host([variant='simplified-pricing-express']) .cta {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Tablet styles - 548px width */
        @media (min-width: 600px) and (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) {
                width: 548px;
                max-width: 548px;
            }
        }
    `;
}

