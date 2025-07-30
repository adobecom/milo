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
    trialBadge: {
        tag: 'div',
        slot: 'trial-badge',
    },
    description: {
        tag: 'div',
        slot: 'body-xs',
        maxCount: 2000,
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
            gradient:
                'linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%)',
        },
    },
    disabledAttributes: ['badgeColor', 'trialBadgeColor', 'trialBadgeBorderColor'],
    supportsDefaultChild: true,
};

export class SimplifiedPricingExpress extends VariantLayout {
    getGlobalCSS() {
        return CSS;
    }

    get aemFragmentMapping() {
        return SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING;
    }

    get headingSelector() {
        return '[slot="heading-l"]';
    }

    postCardUpdateHook(changedProperties) {
        if (changedProperties.has('borderColor') && this.card.borderColor) {
            this.card.style.setProperty(
                '--merch-card-custom-border-color',
                this.card.borderColor,
            );
        }
    }

    connectedCallbackHook() {
        if (!this.card || this.card.failed) {
            return;
        }
        
        this.setupMobileAccordion();
        this.watchForDefaultCardAttribute();
        
        setTimeout(() => {
            if (this.card?.hasAttribute('data-default-card') && window.matchMedia('(max-width: 1199px)').matches) {
                this.card.setAttribute('data-expanded', 'true');
            }
        }, 100);
    }

    watchForDefaultCardAttribute() {
        if (!this.card) return;
        
        this.attributeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes') {
                    if (mutation.attributeName === 'data-default-card' && this.card.hasAttribute('data-default-card')) {
                        if (window.matchMedia('(max-width: 1199px)').matches) {
                            this.card.setAttribute('data-expanded', 'true');
                        }
                    }
                }
            });
        });
        
        this.attributeObserver.observe(this.card, { 
            attributes: true,
            attributeOldValue: true
        });
    }

    setupMobileAccordion() {
        const merchCard = this.card;
        if (!merchCard) {
            return;
        }

        const updateExpandedState = () => {
            if (window.matchMedia('(max-width: 1199px)').matches) {
                const isDefaultCard = merchCard.hasAttribute('data-default-card');
                merchCard.setAttribute('data-expanded', isDefaultCard ? 'true' : 'false');
            } else {
                merchCard.removeAttribute('data-expanded');
            }
        };

        updateExpandedState();

        const mediaQuery = window.matchMedia('(max-width: 1199px)');
        this.mediaQueryListener = (e) => {
            updateExpandedState();
        };
        mediaQuery.addEventListener('change', this.mediaQueryListener);
    }

    disconnectedCallbackHook() {
        if (this.mediaQueryListener) {
            const mediaQuery = window.matchMedia('(max-width: 1199px)');
            mediaQuery.removeEventListener('change', this.mediaQueryListener);
        }
        if (this.attributeObserver) {
            this.attributeObserver.disconnect();
        }
    }

    handleChevronClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const merchCard = this.card;
        if (!merchCard) {
            return;
        }
        
        if (!window.matchMedia('(max-width: 1199px)').matches) {
            return;
        }
        
        const currentExpanded = merchCard.getAttribute('data-expanded');
        const isExpanded = currentExpanded === 'true';
        const newExpanded = !isExpanded ? 'true' : 'false';
        
        merchCard.setAttribute('data-expanded', newExpanded);
    }

    renderLayout() {
        return html`
            <div class="header" @click=${(e) => this.handleChevronClick(e)}>
                <slot name="heading-l"></slot>
                <slot name="trial-badge"></slot>
                <slot name="badge"></slot>
                <button class="chevron-button" aria-label="Expand card" @click=${(e) => this.handleChevronClick(e)}>
                    <svg class="chevron-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15.5L5 8.5L6.4 7.1L12 12.7L17.6 7.1L19 8.5L12 15.5Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
            <div class="description">
                <slot name="body-xs"></slot>
            </div>
            <div class="price">
                <slot name="price"></slot>
            </div>
            <div class="cta">
                <slot name="cta"></slot>
            </div>
            <slot></slot>
        `;
    }

    static variantStyle = css`
        :host([variant='simplified-pricing-express']) {
            --merch-card-simplified-pricing-express-width: 294px;
            --merch-card-simplified-pricing-express-padding: 24px;
            --merch-card-simplified-pricing-express-padding-mobile: 16px;
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
            --merch-card-simplified-pricing-express-body-xs-font-size: 16px;
            --merch-card-simplified-pricing-express-body-xs-line-height: 20.8px;
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
            overflow: visible;
            padding: var(--merch-card-simplified-pricing-express-padding);
            gap: var(--consonant-merch-spacing-s);
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
            align-items: flex-start;
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

        :host([variant='simplified-pricing-express']) .price {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        /* Desktop only - Fixed heights for alignment */
        @media (min-width: 1200px) {
            :host([variant='simplified-pricing-express']) {
                display: flex;
                flex-direction: column;
                min-height: 360px; /* Increased to accommodate all content */
                height: auto;
            }

            :host([variant='simplified-pricing-express']) .description {
                height: 80px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
            }

            :host([variant='simplified-pricing-express']) .price {
                height: 100px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            :host([variant='simplified-pricing-express']) .cta {
                margin-top: auto;
                flex-shrink: 0;
            }
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
            display: block;
            margin-top: auto;
        }

        :host([variant='simplified-pricing-express']) .cta ::slotted(*) {
            width: 100%;
            display: block;
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

        /* Chevron rotation based on parent card's data-expanded attribute */
        :host-context(merch-card[data-expanded='false']) .chevron-icon {
            transform: rotate(0deg);
        }

        :host-context(merch-card[data-expanded='true']) .chevron-icon {
            transform: rotate(180deg);
        }

        /* Mobile and Tablet - Show chevron */
        @media (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) .header {
                position: relative;
                padding-right: 32px;
                justify-content: flex-start;
                gap: 8px;
            }

            :host([variant='simplified-pricing-express']) .chevron-button {
                display: block;
                position: absolute;
                right: 0;
                top: 65%;
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

