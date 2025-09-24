import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './simplified-pricing-express.css.js';
import { TABLET_DOWN, isMobile } from '../media.js';

// Helper function to check if viewport is tablet or below
const isTabletOrBelow = () => window.matchMedia(TABLET_DOWN).matches;

export const SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING = {
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
    disabledAttributes: ['badgeColor', 'badgeBorderColor', 'trialBadgeColor', 'trialBadgeBorderColor'],
    supportsDefaultChild: true,
};

export class SimplifiedPricingExpress extends VariantLayout {
    constructor(card) {
        super(card);
        this.postCardUpdateHook = this.postCardUpdateHook.bind(this);
        this.intersectionObserver = null;
        this.visibilityObserver = null;
        this.containerElement = null;
    }

    getGlobalCSS() {
        return CSS;
    }

    get aemFragmentMapping() {
        return SIMPLIFIED_PRICING_EXPRESS_AEM_FRAGMENT_MAPPING;
    }

    get headingSelector() {
        return '[slot="heading-xs"]';
    }

    getContainer() {
        let container = this.card.closest('merch-card-collection');
        if (!container) {
            let parent = this.card.parentElement;
            while (parent && parent !== document.body) {
                const cards = parent.querySelectorAll('merch-card[variant="simplified-pricing-express"]');
                if (cards.length > 1) {
                    const firstCardParent = cards[0].parentElement;
                    const allSameParent = Array.from(cards).every(card =>
                        card.parentElement === firstCardParent ||
                        card.closest('merch-card-collection') === parent
                    );
                    if (allSameParent) {
                        container = parent;
                        break;
                    }
                }
                parent = parent.parentElement;
            }
        }

        if (!container) {
            container = this.card.parentElement;
        }

        return container;
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

        const descriptionSlot = this.card.querySelector('[slot="body-xs"]');
        if (descriptionSlot) {
            descriptionSlot.offsetHeight;

            const height = descriptionSlot.offsetHeight;
            this.updateCardElementMinHeightValue(height, 'description');
        }

        const priceSlot = this.card.querySelector('[slot="price"]');
        if (priceSlot) {
            priceSlot.offsetHeight;

            const height = priceSlot.offsetHeight;
            this.updateCardElementMinHeightValue(height, 'price');
        }
    }

    clearHeightVariables() {
        const container = this.getContainer();
        if (!container) return;

        const prefix = `--consonant-merch-card-${this.card.variant}`;
        ['description', 'price'].forEach(name => {
            container.style.removeProperty(`${prefix}-${name}-height`);
        });
    }

    async waitForPrices() {
        if (this.card.prices?.length) {
            await Promise.all(this.card.prices.map(price => price.onceSettled?.()));
        }
    }

    async syncAllCardsInContainer(container) {
        const cards = container.querySelectorAll('merch-card[variant="simplified-pricing-express"]');

        if (!cards.length) return;

        const prefix = `--consonant-merch-card-${this.card.variant}`;
        ['description', 'price'].forEach(name => {
            container.style.removeProperty(`${prefix}-${name}-height`);
        });

        await Promise.all(
            Array.from(cards).flatMap(card =>
                card.prices?.map(price => price.onceSettled?.()) || []
            )
        );

        requestAnimationFrame(() => {
            cards.forEach(card => card.variantLayout?.syncHeights?.());
        });
    }

    async forceRemeasure() {
        const container = this.getContainer();
        if (container) {
            await this.syncAllCardsInContainer(container);
        }
    }

    async postCardUpdateHook() {
        if (!this.card.isConnected) return;

        await this.card.updateComplete;
        await this.waitForPrices();

        if (window.matchMedia('(min-width: 1200px)').matches) {
            requestAnimationFrame(() => this.syncHeights());
        }
    }

    connectedCallbackHook() {
        if (!this.card || this.card.failed) {
            return;
        }

        this.setupAccordion();

        requestAnimationFrame(() => {
            if (this.card?.hasAttribute('data-default-card') && isTabletOrBelow()) {
                this.card.setAttribute('data-expanded', 'true');
            }
        });

        window.addEventListener('resize', this.postCardUpdateHook);

        setTimeout(() => this.setupVisibilityDetection(), 100);
    }

    setupVisibilityDetection() {
        const tabPanel = this.card.closest('.tabpanel, [role="tabpanel"]');

        if (tabPanel) {
            this.visibilityObserver = new MutationObserver(async (mutations) => {
                const becameVisible = mutations.some(m =>
                    m.attributeName === 'hidden' && !tabPanel.hasAttribute('hidden')
                );

                if (becameVisible && window.matchMedia('(min-width: 1200px)').matches) {
                    const container = this.getContainer();
                    if (container) {
                        await this.syncAllCardsInContainer(container);
                    }
                }
            });

            this.visibilityObserver.observe(tabPanel, {
                attributes: true,
                attributeFilter: ['hidden']
            });
        } else {
            this.intersectionObserver = new IntersectionObserver(async (entries) => {
                const visible = entries.find(e => e.isIntersecting && e.target.clientHeight > 0);
                if (visible && window.matchMedia('(min-width: 1200px)').matches) {
                    const container = this.getContainer();
                    if (container) {
                        await this.syncAllCardsInContainer(container);
                    }
                }
            });
            this.intersectionObserver.observe(this.card);
        }
    }

    setupAccordion() {
        const merchCard = this.card;
        if (!merchCard) {
            return;
        }

        const updateExpandedState = () => {
            if (isTabletOrBelow()) {
                const isDefaultCard = merchCard.hasAttribute('data-default-card');
                merchCard.setAttribute('data-expanded', isDefaultCard ? 'true' : 'false');
            } else {
                merchCard.removeAttribute('data-expanded');
            }
        };

        // Set initial state
        updateExpandedState();

        // Watch for viewport changes
        const mediaQuery = window.matchMedia(TABLET_DOWN);
        this.mediaQueryListener = () => {
            updateExpandedState();
        };
        mediaQuery.addEventListener('change', this.mediaQueryListener);

        // Watch for default card attribute changes
        this.attributeObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'data-default-card' &&
                    this.card.hasAttribute('data-default-card') &&
                    isTabletOrBelow()) {
                    this.card.setAttribute('data-expanded', 'true');
                }
            });
        });

        this.attributeObserver.observe(this.card, {
            attributes: true,
            attributeOldValue: true
        });
    }

    disconnectedCallbackHook() {
        window.removeEventListener('resize', this.postCardUpdateHook);

        if (this.mediaQueryListener) {
            const mediaQuery = window.matchMedia(TABLET_DOWN);
            mediaQuery.removeEventListener('change', this.mediaQueryListener);
        }
        if (this.attributeObserver) {
            this.attributeObserver.disconnect();
        }

        if (this.visibilityObserver) {
            this.visibilityObserver.disconnect();
            this.visibilityObserver = null;
        }

        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
        }
    }

    handleChevronClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const merchCard = this.card;
        if (!merchCard || !isTabletOrBelow()) {
            return;
        }
        
        const currentExpanded = merchCard.getAttribute('data-expanded');
        const isExpanded = currentExpanded === 'true';
        const newExpanded = !isExpanded ? 'true' : 'false';
        
        merchCard.setAttribute('data-expanded', newExpanded);
    }

    renderLayout() {
        return html`
            <div class="badge-wrapper">
                <slot name="badge"></slot>
            </div>
            <div class="card-content">
                <div class="header">
                    <slot name="heading-xs"></slot>
                    <slot name="trial-badge"></slot>
                    <button class="chevron-button" @click=${(e) => this.handleChevronClick(e)}>
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
            </div>
            <slot></slot>
        `;
    }

    static variantStyle = css`
        :host([variant='simplified-pricing-express']) {
            /* CSS Variables */
            --merch-card-simplified-pricing-express-width: 365px;
            --merch-card-simplified-pricing-express-tablet-width: 532px;
            --merch-card-simplified-pricing-express-padding: 24px;
            --merch-card-simplified-pricing-express-padding-mobile: 16px;
            --merch-card-simplified-pricing-express-min-height: 341px;
            --merch-card-simplified-pricing-express-price-font-size: 28px;
            --merch-card-simplified-pricing-express-price-p-font-size: 12px;
            --merch-card-simplified-pricing-express-price-p-line-height: 15.6px;
            --merch-card-simplified-pricing-express-price-font-weight: 700;
            --merch-card-simplified-pricing-express-price-line-height: 36.4px;
            --merch-card-simplified-pricing-express-price-currency-font-size: 22px;
            --merch-card-simplified-pricing-express-price-currency-font-weight: 700;
            --merch-card-simplified-pricing-express-price-currency-line-height: 28.6px;
            --merch-card-simplified-pricing-express-price-currency-symbol-font-size: 22px;
            --merch-card-simplified-pricing-express-price-currency-symbol-font-weight: 700;
            --merch-card-simplified-pricing-express-price-currency-symbol-line-height: 28.6px;
            --merch-card-simplified-pricing-express-price-recurrence-font-size: 12px;
            --merch-card-simplified-pricing-express-price-recurrence-font-weight: 700;
            --merch-card-simplified-pricing-express-price-recurrence-line-height: 15.6px;
            --merch-card-simplified-pricing-express-body-xs-font-size: 14px;
            --merch-card-simplified-pricing-express-body-xs-line-height: 18.2px;
            --merch-card-simplified-pricing-express-price-p-font-size: 12px;
            --merch-card-simplified-pricing-express-price-p-font-weight: 400;
            --merch-card-simplified-pricing-express-price-p-line-height: 15.6px;
            --merch-card-simplified-pricing-express-cta-font-size: 18px;
            --merch-card-simplified-pricing-express-cta-font-weight: 700;
            --merch-card-simplified-pricing-express-cta-line-height: 23.4px;
            
            /* Gradient definitions */
            --gradient-purple-blue: linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%);
            --gradient-firefly-spectrum: linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%);
            width: var(--merch-card-simplified-pricing-express-width);
            max-width: var(--merch-card-simplified-pricing-express-width);
            background: transparent;
            border: none;
            display: flex;
            flex-direction: column;
            overflow: visible;
            box-sizing: border-box;
            position: relative;
        }

        /* Badge wrapper styling */
        :host([variant='simplified-pricing-express']) .badge-wrapper {
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
        :host([variant='simplified-pricing-express']) .badge-wrapper:empty {
            display: none;
        }
        
        /* Also hide when badge slot is empty */
        :host([variant='simplified-pricing-express']:not(:has([slot="badge"]:not(:empty)))) .badge-wrapper {
            display: none;
        }

        /* Card content styling */
        :host([variant='simplified-pricing-express']) .card-content {
            border-radius: 8px;
            padding: var(--merch-card-simplified-pricing-express-padding);
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--consonant-merch-spacing-xxs);
            position: relative;
        }
        
        /* Ensure content appears above pseudo-element background */
        :host([variant='simplified-pricing-express']) .card-content > * {
            position: relative;
        }
        
        :host([variant='simplified-pricing-express']:not([gradient-border='true'])) .card-content {
            background: var(--spectrum-gray-50);
            border: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        /* Collapsed state for non-gradient cards */
        :host([variant='simplified-pricing-express']:not([gradient-border='true'])[data-expanded='false']) .card-content {
            overflow: hidden;
        }
        
        /* When badge exists, adjust card content border radius */
        :host([variant='simplified-pricing-express']:has([slot="badge"]:not(:empty))) .card-content {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        
        /* When badge exists with regular border, ensure top border */
        :host([variant='simplified-pricing-express']:not([gradient-border='true']):has([slot="badge"]:not(:empty))) .card-content {
            border-top: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        /* When badge has content, ensure seamless connection */
        :host([variant='simplified-pricing-express']:has([slot="badge"]:not(:empty))) .badge-wrapper {
            margin-bottom: -2px;
        }

        /* Common gradient border styles */
        :host([variant='simplified-pricing-express'][gradient-border='true']) .badge-wrapper {
            border: none;
            margin-bottom: -6px;
            padding-bottom: 6px;
        }
        
        :host([variant='simplified-pricing-express'][gradient-border='true']) .badge-wrapper ::slotted(*) {
            color: white !important;
        }

        :host([variant='simplified-pricing-express'][gradient-border='true']) .card-content {
            position: relative;
            border: none;
            padding: calc(var(--merch-card-simplified-pricing-express-padding) + 2px);
            border-radius: 8px;
        }
        
        :host([variant='simplified-pricing-express'][gradient-border='true']) .card-content::before {
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
        
        /* Gradient-specific backgrounds */
        :host([variant='simplified-pricing-express'][border-color='gradient-purple-blue']) .badge-wrapper,
        :host([variant='simplified-pricing-express'][border-color='gradient-purple-blue']) .card-content {
            background: var(--gradient-purple-blue);
        }
        
        :host([variant='simplified-pricing-express'][border-color='gradient-firefly-spectrum']) .badge-wrapper,
        :host([variant='simplified-pricing-express'][border-color='gradient-firefly-spectrum']) .card-content {
            background: var(--gradient-firefly-spectrum);
        }
        
        /* When gradient and badge exist, keep rounded corners for smooth transition */
        :host([variant='simplified-pricing-express'][gradient-border='true']:has([slot="badge"]:not(:empty))) .card-content {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        
        :host([variant='simplified-pricing-express'][gradient-border='true']:has([slot="badge"]:not(:empty))) .card-content::before {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
        }
        
        :host([variant='simplified-pricing-express']) .header {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
        }

        /* Font specifications for heading and body */
        :host([variant='simplified-pricing-express']) [slot="heading-xs"] {
            font-size: 18px;
            font-weight: 700;
            line-height: 23.4px;
            color: var(--spectrum-gray-800);
        }

        :host([variant='simplified-pricing-express']) .description {
            gap: 16px;
            display: flex;
            flex-direction: column;
        }

        :host([variant='simplified-pricing-express']) .price {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin-top: auto;
        }

        /* Desktop only - Fixed heights for alignment */
        @media (min-width: 1200px) {
            :host([variant='simplified-pricing-express']) {
                display: flex;
                flex-direction: column;
                height: auto;
            }

            /* Make card-content fill parent and use flexbox */
            :host([variant='simplified-pricing-express']) .card-content {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            /* Apply synchronized heights to containers */
            :host([variant='simplified-pricing-express']) .description {
                display: flex;
                flex-direction: column;
                flex: 1;
            }

            :host([variant='simplified-pricing-express']) .price {
                display: flex;
                flex-direction: column;
            }

            :host([variant='simplified-pricing-express']) .cta {
                flex-shrink: 0;
            }
        }

        :host([variant='simplified-pricing-express']) .cta,
        :host([variant='simplified-pricing-express']) .cta ::slotted(*) {
            width: 100%;
            display: block;
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

        /* Mobile and Tablet styles */
        @media (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) {
                width: 311px;
                max-width: 311px;
                min-height: auto;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            :host([variant='simplified-pricing-express']) .header {
                position: relative;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
            }

            :host([variant='simplified-pricing-express']) .chevron-button {
                display: block;
                flex-shrink: 0;
                margin-left: auto;
            }
            
            :host([variant='simplified-pricing-express'][gradient-border='true']) .card-content,
            :host([variant='simplified-pricing-express']:not([gradient-border='true'])) .card-content {
                padding: calc(var(--merch-card-simplified-pricing-express-padding-mobile) + 2px);
            }
            
            /* Hide badge-wrapper on mobile/tablet except for gradient borders */
            :host([variant='simplified-pricing-express']:not([gradient-border='true'])) .badge-wrapper {
                display: none;
            }
            
            /* Gradient border collapsed state - limit badge-wrapper height */
            :host([variant='simplified-pricing-express'][gradient-border='true'][data-expanded='false']) .card-content {
                overflow: hidden;
                padding: 16px 16px 35px 16px;
            }
        }
    `;
}

