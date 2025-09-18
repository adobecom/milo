import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './full-pricing-express.css.js';
import { isMobile } from '../media.js';
import { EVENT_MERCH_CARD_COLLECTION_READY } from '../constants.js';

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
        slot: 'body-s',
        maxCount: 2000,
        withSuffix: false,
    },
    shortDescription: {
        tag: 'div',
        slot: 'shortDescription',
        maxCount: 3000,
        withSuffix: false,
    },
    prices: {
        tag: 'div',
        slot: 'price',
    },
    trialBadge: {
        tag: 'div',
        slot: 'trial-badge',
    },
    ctas: {
        slot: 'cta',
        size: 'XL',
    },
    mnemonics: {
        size: 'l',
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
    disabledAttributes: [],
};

export class FullPricingExpress extends VariantLayout {
    constructor(card) {
        super(card);
        this.postCardUpdateHook = this.postCardUpdateHook.bind(this);
    }

    getGlobalCSS() {
        return CSS;
    }

    get aemFragmentMapping() {
        return FULL_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING;
    }

    get headingSelector() {
        return '[slot="heading-xs"]';
    }

    updateCardElementMinHeight(el, name) {
        if (!el) return;
        const elMinHeightPropertyName = `--consonant-merch-card-${this.card.variant}-${name}-height`;
        const height = Math.max(0, el.offsetHeight || 0);
        const maxMinHeight =
            parseInt(
                this.getContainer().style.getPropertyValue(
                    elMinHeightPropertyName,
                ),
            ) || 0;

        if (height > maxMinHeight) {
            this.getContainer().style.setProperty(
                elMinHeightPropertyName,
                `${height}px`,
            );
        }
    }

    updateCardElementMinHeightValue(height, name) {
        if (!height) return;
        const elMinHeightPropertyName = `--consonant-merch-card-${this.card.variant}-${name}-height`;
        const container = this.getContainer();
        const maxMinHeight =
            parseInt(
                container.style.getPropertyValue(
                    elMinHeightPropertyName,
                ),
            ) || 0;

        if (height > maxMinHeight) {
            container.style.setProperty(
                elMinHeightPropertyName,
                `${height}px`,
            );
        }
    }

    syncHeights() {
        if (this.card.getBoundingClientRect().width === 0) {
            return;
        }

        // Sync main description (body-s) slot
        const descriptionSlot = this.card.querySelector('[slot="body-s"]');
        if (descriptionSlot) {
            descriptionSlot.offsetHeight;

            const styles = window.getComputedStyle(descriptionSlot);
            const marginTop = parseFloat(styles.marginTop) || 0;
            const marginBottom = parseFloat(styles.marginBottom) || 0;
            const height = descriptionSlot.offsetHeight + marginTop + marginBottom;
            this.updateCardElementMinHeightValue(height, 'description');
        }

        const priceSlot = this.card.querySelector('[slot="price"]');
        if (priceSlot) {
            priceSlot.offsetHeight;

            const styles = window.getComputedStyle(priceSlot);
            const marginTop = parseFloat(styles.marginTop) || 0;
            const marginBottom = parseFloat(styles.marginBottom) || 0;
            const height = priceSlot.offsetHeight + marginTop + marginBottom;
            this.updateCardElementMinHeightValue(height, 'price');
        }

        const ctaSlot = this.card.querySelector('[slot="cta"]');
        if (ctaSlot) {
            ctaSlot.offsetHeight;

            const styles = window.getComputedStyle(ctaSlot);
            const marginTop = parseFloat(styles.marginTop) || 0;
            const marginBottom = parseFloat(styles.marginBottom) || 0;
            const height = ctaSlot.offsetHeight + marginTop + marginBottom;
            this.updateCardElementMinHeightValue(height, 'cta');
        }

        const shortDescriptionSlot = this.card.querySelector('[slot="shortDescription"]');
        if (shortDescriptionSlot) {
            shortDescriptionSlot.offsetHeight;

            const styles = window.getComputedStyle(shortDescriptionSlot);
            const marginTop = parseFloat(styles.marginTop) || 0;
            const marginBottom = parseFloat(styles.marginBottom) || 0;
            const height = shortDescriptionSlot.offsetHeight + marginTop + marginBottom;
            this.updateCardElementMinHeightValue(height, 'shortDescription');
        }
    }

    forceRemeasure() {
        const container = this.getContainer();
        if (container) {
            container.style.removeProperty(`--consonant-merch-card-${this.card.variant}-description-height`);
            container.style.removeProperty(`--consonant-merch-card-${this.card.variant}-price-height`);
            container.style.removeProperty(`--consonant-merch-card-${this.card.variant}-cta-height`);
            container.style.removeProperty(`--consonant-merch-card-${this.card.variant}-shortDescription-height`);

            this.syncHeights();
        }
    }

    async postCardUpdateHook() {
        if (!this.card.isConnected) return;
        
        await this.card.updateComplete;
        
        if (this.card.prices?.length) {
            await Promise.all(this.card.prices.map((price) => price.onceSettled?.()));
        }
        
        if (!isMobile()) {
            requestAnimationFrame(() => {
                this.syncHeights();
            });
        }
    }

    connectedCallbackHook() {
        window.addEventListener('resize', this.postCardUpdateHook);
        
        this.handleCollectionReady = async () => {
            if (!isMobile()) {
                if (this.card.prices?.length) {
                    await Promise.all(this.card.prices.map((price) => price.onceSettled?.()));
                }
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        this.syncHeights();
                    }, 200);
                });
            }
        };
        
        const collection = this.card.closest('merch-card-collection');
        if (collection) {
            collection.addEventListener(EVENT_MERCH_CARD_COLLECTION_READY, this.handleCollectionReady);
        }
    }

    disconnectedCallbackHook() {
        window.removeEventListener('resize', this.postCardUpdateHook);
        
        if (this.handleCollectionReady) {
            const collection = this.card.closest('merch-card-collection');
            if (collection) {
                collection.removeEventListener(EVENT_MERCH_CARD_COLLECTION_READY, this.handleCollectionReady);
            }
        }
    }

    renderLayout() {
        return html`
            <div class="badge-wrapper">
                <slot name="badge"></slot>
            </div>
            <div class="card-content">
                <div class="header">
                    <slot name="heading-xs"></slot>
                    <slot name="icons"></slot>
                </div>
                <div class="description">
                    <slot name="body-s"></slot>
                </div>
                <div class="price-container">
                    <slot name="trial-badge"></slot>
                    <slot name="price"></slot>
                </div>
                <div class="cta">
                    <slot name="cta"></slot>
                </div>
                <div class="shortDescription">
                    <slot name="shortDescription"></slot>
                </div>
            </div>
            <slot></slot>
        `;
    }

    static variantStyle = css`
        :host([variant='full-pricing-express']) {
            /* CSS Variables */
            --merch-card-full-pricing-express-width: 437px;
            --merch-card-full-pricing-express-mobile-width: 303px;
            --merch-card-full-pricing-express-padding: 24px;
            --merch-card-full-pricing-express-padding-mobile: 20px;
            --merch-card-full-pricing-express-section-gap: 24px;
            
            /* Price container specific */
            --merch-card-full-pricing-express-price-bg: #F8F8F8;
            --merch-card-full-pricing-express-price-padding: 16px;
            --merch-card-full-pricing-express-price-radius: 8px;
            
            /* Typography - matching simplified-pricing-express */
            --merch-card-full-pricing-express-trial-badge-font-size: 12px;
            --merch-card-full-pricing-express-trial-badge-font-weight: 700;
            --merch-card-full-pricing-express-trial-badge-line-height: 15.6px;
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
            font-size: 16px;
            font-weight: 700;
            line-height: 20.8px;
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
            color: white;
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
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        :host([variant='full-pricing-express']) [slot="heading-xs"] {
            font-size: 18px;
            font-weight: 700;
            line-height: 23.4px;
            color: var(--spectrum-gray-800);
        }

        /* Icons/Mnemonics styling */
        :host([variant='full-pricing-express']) [slot="icons"] {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-shrink: 0;
        }

        :host([variant='full-pricing-express']) [slot="icons"] merch-icon {
            --img-width: 20px;
            --img-height: 20px;
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
          min-height: 96px;
            background: var(--merch-card-full-pricing-express-price-bg);
            padding: 24px 16px;
            border-radius: var(--merch-card-full-pricing-express-price-radius);
            border: 1px solid #E0E2FF;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: visible;
            margin-bottom: var(--merch-card-full-pricing-express-section-gap);
            display: flex;
            justify-content: center;
            align-items: flex-start;
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
            
            /* Show description2 container on mobile (content controlled by light DOM) */
            :host([variant='full-pricing-express']) .description2 {
                display: block;
            }
        }

        /* Tablet and Desktop - fixed heights for alignment */
        @media (min-width: 768px) {
            :host([variant='full-pricing-express']) {
                display: flex;
                flex-direction: column;
                height: auto;
            }

            /* Make card-content fill parent and use flexbox */
            :host([variant='full-pricing-express']) .card-content {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            /* Apply synchronized heights to shadow DOM containers */
            :host([variant='full-pricing-express']) .description {
                min-height: var(--consonant-merch-card-full-pricing-express-description-height);
            }

            :host([variant='full-pricing-express']) .price-container {
                min-height: var(--consonant-merch-card-full-pricing-express-price-height);
                display: flex;
                flex-direction: column;
            }

            :host([variant='full-pricing-express']) .cta {
                min-height: var(--consonant-merch-card-full-pricing-express-cta-height);
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }

            /* Make shortDescription grow to fill remaining space */
            :host([variant='full-pricing-express']) .shortDescription {
                flex: 1;
                min-height: var(--consonant-merch-card-full-pricing-express-shortDescription-height);
                display: flex;
                flex-direction: column;
            }
        }
    `;
}
