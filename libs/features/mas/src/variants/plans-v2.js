import { VariantLayout } from './variant-layout';
import { html, css, nothing } from 'lit';
import { CSS } from './plans-v2.css.js';
import Media from '../media.js';
import {
    EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED,
    SELECTOR_MAS_INLINE_PRICE,
    TEMPLATE_PRICE_LEGAL,
} from '../constants.js';

export const PLANS_V2_AEM_FRAGMENT_MAPPING = {
    cardName: { attribute: 'name' },
    title: { tag: 'h3', slot: 'heading-xs' },
    subtitle: { tag: 'p', slot: 'subtitle' },
    prices: { tag: 'p', slot: 'heading-m' },
    promoText: { tag: 'p', slot: 'promo-text' },
    description: { tag: 'div', slot: 'body-xs' },
    mnemonics: { size: 'l' },
    callout: { tag: 'div', slot: 'callout-content' },
    quantitySelect: { tag: 'div', slot: 'quantity-select' },
    addon: true,
    secureLabel: true,
    planType: true,
    badge: { tag: 'div', slot: 'badge', default: 'spectrum-red-700-plans' },
    allowedBadgeColors: [
        'spectrum-yellow-300-plans',
        'spectrum-gray-300-plans',
        'spectrum-gray-700-plans',
        'spectrum-green-900-plans',
        'spectrum-red-700-plans',
    ],
    allowedBorderColors: [
        'spectrum-yellow-300-plans',
        'spectrum-gray-300-plans',
        'spectrum-green-900-plans',
        'spectrum-red-700-plans',
    ],
    borderColor: { attribute: 'border-color' },
    size: ['wide', 'super-wide'],
    whatsIncluded: { tag: 'div', slot: 'whats-included' },
    ctas: { slot: 'footer', size: 'm' },
    style: 'consonant',
    perUnitLabel: { tag: 'span', slot: 'per-unit-label' },
};

export class PlansV2 extends VariantLayout {
    constructor(card) {
        super(card);
        this.adaptForMedia = this.adaptForMedia.bind(this);
    }

    priceOptionsProvider(element, options) {
        if (element.dataset.template !== TEMPLATE_PRICE_LEGAL) return;
        options.displayPlanType = this.card?.settings?.displayPlanType ?? false;
    }

    getGlobalCSS() {
        return CSS;
    }

    /**
     * Moves a slot to its proper place (body or footer) depending on card size and screen size
     * @param {string} name 
     * @param {string[]} sizes 
     * @param {boolean} shouldBeInFooter 
     * @returns 
     */
    adjustSlotPlacement(name, sizes, shouldBeInFooter) {
        const shadowRoot = this.card.shadowRoot;
        const footer = shadowRoot.querySelector('footer');
        const size = this.card.getAttribute('size');
        if (!size)
            return;

        const slotInFooter = shadowRoot.querySelector(
            `footer slot[name="${name}"]`,
        );
        const slotInBody = shadowRoot.querySelector(`.body slot[name="${name}"]`);
        const body = shadowRoot.querySelector('.body');

        if (!size.includes('wide')) {
            footer?.classList.remove('wide-footer');
            if (slotInFooter) slotInFooter.remove();
        }
        if (!sizes.includes(size)) return;
        

        footer?.classList.toggle('wide-footer', Media.isDesktopOrUp);
        if (!shouldBeInFooter && slotInFooter) {
            if (slotInBody) 
                slotInFooter.remove();
            else {
                const bodyPlaceholder = body.querySelector(`[data-placeholder-for="${name}"]`);
                if (bodyPlaceholder) bodyPlaceholder.replaceWith(slotInFooter);
                else body.appendChild(slotInFooter);
            }
            return;
        }
        if (shouldBeInFooter && slotInBody) {
            const bodyPlaceholder = document.createElement('div');
            bodyPlaceholder.setAttribute('data-placeholder-for', name);
            bodyPlaceholder.classList.add('slot-placeholder');
            if (!slotInFooter) {
                const slotInBodyClone = slotInBody.cloneNode(true);
                footer.prepend(slotInBodyClone);
            }
            slotInBody.replaceWith(bodyPlaceholder)
        }
    }

    adaptForMedia() {
        if (
            !this.card.closest(
                'merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns',
            )
        ) {
            this.card.removeAttribute('size');
            return;
        }
        
        this.adjustSlotPlacement('addon', ['super-wide'], Media.isDesktopOrUp);
        this.adjustSlotPlacement('callout-content', ['super-wide'], Media.isDesktopOrUp);
    }

    adjustCallout() {
        const tooltipIcon = this.card.querySelector('[slot="callout-content"] .icon-button');
        if (tooltipIcon && tooltipIcon.title) {
            tooltipIcon.dataset.tooltip = tooltipIcon.title;
            tooltipIcon.removeAttribute('title');
            tooltipIcon.classList.add('hide-tooltip');
            document.addEventListener('touchstart', (event) => {
                event.preventDefault();
                if (event.target !== tooltipIcon) {
                    tooltipIcon.classList.add('hide-tooltip');
                } else {
                    event.target.classList.toggle('hide-tooltip');
                }
            });
            document.addEventListener('mouseover', (event) => {
                event.preventDefault();
                if (event.target !== tooltipIcon) {
                    tooltipIcon.classList.add('hide-tooltip');
                } else {
                    event.target.classList.remove('hide-tooltip');
                }
            });
        }
    }

    async postCardUpdateHook() {
        this.adaptForMedia();
        this.adjustTitleWidth();
        this.adjustAddon();
        this.adjustCallout();
        if (!this.legalAdjusted) {
            await this.adjustLegal();
        }
    }

    get headingM() {
        return this.card.querySelector('[slot="heading-m"]');
    }

    get mainPrice() {
        const price = this.headingM.querySelector(
            `${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`,
        );
        return price;
    }

    async adjustLegal() {
        if (this.legalAdjusted) return;
        try {
            this.legalAdjusted = true;
            await this.card.updateComplete;
            await customElements.whenDefined('inline-price');
            const prices = [];
            const headingPrice = this.card.querySelector(`[slot="heading-m"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`);
            if (headingPrice) prices.push(headingPrice);
            const legalPromises = prices.map(async (price) => {
              const legal = price.cloneNode(true);
              await price.onceSettled();
              if (!price?.options) return;
              if (price.options.displayPerUnit)
                  price.dataset.displayPerUnit = 'false';
              if (price.options.displayTax) price.dataset.displayTax = 'false';
              if (price.options.displayPlanType)
                  price.dataset.displayPlanType = 'false';
              legal.setAttribute('data-template', 'legal');
              price.parentNode.insertBefore(legal, price.nextSibling);
              await legal.onceSettled();
            });
            await Promise.all(legalPromises);
        }
        catch {
            /* Proceed with other adjustments */
        }
    }

    async adjustAddon() {
        await this.card.updateComplete;
        const addon = this.card.addon;
        if (!addon) return;
        addon.setAttribute('custom-checkbox', '');
        const price = this.mainPrice;
        if (!price) return;
        await price.onceSettled();
        const planType = price.value?.[0]?.planType;
        if (!planType) return;
        addon.planType = planType;
    }

    get stockCheckbox() {
        return this.card.checkboxLabel
            ? html`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`
            : nothing;
    }

    get icons() {
        if (!this.card.querySelector('[slot="icons"]') && !this.card.getAttribute('id')) return nothing;
        return html`<slot name="icons"></slot>`;
    }

    connectedCallbackHook() {
        Media.matchMobile.addEventListener('change', this.adaptForMedia);
        Media.matchDesktopOrUp.addEventListener('change', this.adaptForMedia);
    }

    disconnectedCallbackHook() {
        Media.matchMobile.removeEventListener('change', this.adaptForMedia);
        Media.matchDesktopOrUp.removeEventListener('change', this.adaptForMedia);
    }

    renderLayout() {
        return html` ${this.badge}
            <div class="body">
                <div class="heading-wrapper">
                    ${this.icons}
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="subtitle"></slot>
                <slot name="body-xs"></slot>
                <div class="price-divider"></div>
                <slot name="heading-m"></slot>
                <slot name="annualPrice"></slot>
                <slot name="priceLabel"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="whats-included"></slot>
                <slot name="callout-content"></slot>
                <slot name="quantity-select"></slot>
                ${this.stockCheckbox}
                <slot name="addon"></slot>
                <slot name="badge"></slot>
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`;
    }

    static variantStyle = css`
        :host([variant='plans-v2']) {
            display: flex;
            flex-direction: column;
            min-height: 273px;
            width: 321px;
            position: relative;
            background-color: var(--spectrum-gray-50, #FFFFFF);
            border-radius: var(--consonant-merch-card-plans-v2-border-radius, 8px);
            overflow: hidden;
            --merch-card-plans-v2-min-width: 244px;
            --merch-card-plans-v2-padding: 26px 32px;
            --merch-card-plans-v2-subtitle-display: contents;
            --merch-card-plans-v2-heading-min-height: 23px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
            font-weight: 400;
        }

        :host([variant='plans-v2']) .slot-placeholder {
            display: none;
        }

        :host([variant='plans-v2']) .body {
            display: flex;
            flex-direction: column;
            min-width: var(--merch-card-plans-v2-min-width);
            padding: var(--merch-card-plans-v2-padding);
            padding-bottom: 0;
            flex-grow: 1;
        }

        :host([variant='plans-v2'][size]) .body {
            max-width: none;
        }

        :host([variant='plans-v2']) footer {
            padding: var(--merch-card-plans-v2-padding);
            padding-top: 1px;
            justify-content: flex-start;
        }

        :host([variant='plans-v2']) slot[name="subtitle"] {
            display: var(--merch-card-plans-v2-subtitle-display);
            min-height: 18px;
            margin-top: 8px;
            margin-bottom: -8px;
        }

        :host([variant='plans-v2']) ::slotted([slot='heading-xs']) {
            font-size: 32px;
            font-weight: 900;
            font-family: 'Adobe Clean Display', sans-serif;
            line-height: 1.2;
            color: var(--spectrum-gray-800, #2C2C2C);
            margin: 0 0 16px 0;
            min-height: var(--merch-card-plans-v2-heading-min-height);
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }

        :host([variant='plans-v2']) slot[name='icons'] {
            gap: 3px;
            mask-image: linear-gradient(to right, 
                rgba(0, 0, 0, 1) 0%, 
                rgba(0, 0, 0, 1) 12.5%, 
                rgba(0, 0, 0, 0.8) 25%, 
                rgba(0, 0, 0, 0.6) 37.5%, 
                rgba(0, 0, 0, 0.4) 50%, 
                rgba(0, 0, 0, 0.2) 62.5%, 
                rgba(0, 0, 0, 0.05) 75%, 
                rgba(0, 0, 0, 0.03) 87.5%, 
                rgba(0, 0, 0, 0) 100%);
            -webkit-mask-image: linear-gradient(to right, 
                rgba(0, 0, 0, 1) 0%, 
                rgba(0, 0, 0, 1) 12.5%, 
                rgba(0, 0, 0, 0.8) 25%, 
                rgba(0, 0, 0, 0.6) 37.5%, 
                rgba(0, 0, 0, 0.4) 50%, 
                rgba(0, 0, 0, 0.2) 62.5%, 
                rgba(0, 0, 0, 0.05) 75%, 
                rgba(0, 0, 0, 0.03) 87.5%, 
                rgba(0, 0, 0, 0) 100%);
        }

        :host([variant='plans-v2']) ::slotted([slot='icons']) {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }

        :host([variant='plans-v2']) ::slotted([slot='heading-m']) {
            margin: 0 0 8px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='promo-text']) {
            font-size: 16px;
            font-weight: 700;
            color: var(--merch-color-green-promo, #05834E);
            line-height: 1.5;
            margin: 0 0 16px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='body-xs']) {
            font-size: 18px;
            font-weight: 400;
            color: var(--spectrum-gray-700, #4B4B4B);
            line-height: 1.5;
            margin: 0 0 16px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='quantity-select']) {
            margin: 0 0 16px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='whats-included']) {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #E8E8E8;
        }

        :host([variant='plans-v2']) ::slotted([slot='addon']) {
            margin-top: auto;
            padding-top: 8px;
        }

        :host([variant='plans-v2']) footer ::slotted([slot='addon']) {
            margin: 0;
            padding: 0;
        }

        :host([variant='plans-v2']) .wide-footer #stock-checkbox {
            margin-top: 0;
        }

        :host([variant='plans-v2']) #stock-checkbox {
            margin-top: 8px;
            gap: 9px;
            color: rgb(34, 34, 34);
            line-height: var(--consonant-merch-card-detail-xs-line-height);
            padding-top: 4px;
            padding-bottom: 5px;
        }

        :host([variant='plans-v2']) #stock-checkbox > span {
            border: 2px solid rgb(109, 109, 109);
            width: 12px;
            height: 12px;
        }

        :host([variant='plans-v2']) .secure-transaction-label {
            color: rgb(80, 80, 80);
            line-height: var(--consonant-merch-card-detail-xs-line-height);
        }

        :host([variant='plans-v2']) footer ::slotted(a) {
            display: block;
            width: 100%;
            text-align: center;
            margin-bottom: 12px;
        }

        :host([variant='plans-v2']) footer ::slotted(a:last-child) {
            margin-bottom: 0;
        }

        /* Border color variants */
        :host([variant='plans-v2'][border-color='spectrum-yellow-300-plans']) {
            border-color: #FFD947;
        }

        :host([variant='plans-v2'][border-color='spectrum-gray-300-plans']) {
            border-color: #DADADA;
        }

        :host([variant='plans-v2'][border-color='spectrum-green-900-plans']) {
            border-color: #05834E;
        }

        :host([variant='plans-v2'][border-color='spectrum-red-700-plans']) {
            border-color: #EB1000;
        }

        /* Badge color variants */
        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-yellow-300-plans),
        :host([variant='plans-v2']) #badge.spectrum-yellow-300-plans {
            background-color: #FFD947;
            color: #2C2C2C;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-gray-300-plans),
        :host([variant='plans-v2']) #badge.spectrum-gray-300-plans {
            background-color: #DADADA;
            color: #2C2C2C;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-gray-700-plans),
        :host([variant='plans-v2']) #badge.spectrum-gray-700-plans {
            background-color: #4B4B4B;
            color: #FFFFFF;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-green-900-plans),
        :host([variant='plans-v2']) #badge.spectrum-green-900-plans {
            background-color: #05834E;
            color: #FFFFFF;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-red-700-plans),
        :host([variant='plans-v2']) #badge.spectrum-red-700-plans {
            background-color: #EB1000;
            color: #FFFFFF;
        }

        /* Price divider - hidden by default */
        :host([variant='plans-v2']) .price-divider {
            display: none;
        }

        /* Heading wrapper - default stacked layout */
        :host([variant='plans-v2']) .heading-wrapper {
            display: flex;
            flex-direction: column;
        }

        /* Wide size variant styles */
        :host([variant='plans-v2'][size='wide']) {
            width: 100%;
            max-width: 768px;
        }

        /* Wide variant - icons and title on same line */
        :host([variant='plans-v2'][size='wide']) .heading-wrapper {
            flex-direction: row;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper slot[name='icons'] {
            margin-bottom: 0;
            mask-image: none;
            -webkit-mask-image: none;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper ::slotted([slot='icons']) {
            margin-bottom: 0;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper ::slotted([slot='heading-xs']) {
            margin: 0;
        }

        :host([variant='plans-v2'][size='wide']) .price-divider {
            display: block;
            height: 1px;
            background-color: #E8E8E8;
            margin: 16px 0;
        }

        :host([variant='plans-v2'][size='wide']) ::slotted([slot='body-xs']) {
            margin-bottom: 0;
        }

        :host([variant='plans-v2'][size='wide']) ::slotted([slot='heading-m']) {
            margin-top: 0;
        }

        :host([variant='plans-v2'][size='wide']) footer {
            justify-content: flex-start;
        }

        :host([variant='plans-v2'][size='wide']) footer ::slotted(a) {
            width: auto;
            min-width: 150px;
            margin-right: 12px;
        }

        :host([variant='plans-v2'][size='wide']) footer ::slotted(a:last-child) {
            margin-right: 0;
        }
    `;

    static collectionOptions = {
        customHeaderArea: (collection) => {
            if (!collection.sidenav) return nothing;
            return html`<slot name="resultsText"></slot>`
        },
        headerVisibility: {
            search: false,
            sort: false,
            result: ['mobile', 'tablet'],
            custom: ['desktop']
        },
        onSidenavAttached: (collection) => {
            const minifyOverflowingWideCards = () => {
                const merchCards = collection.querySelectorAll('merch-card');
                for (const merchCard of merchCards) {
                    if (merchCard.hasAttribute('data-size')) {
                        merchCard.setAttribute('size', merchCard.getAttribute('data-size'));
                        merchCard.removeAttribute('data-size');
                    }
                }
                if (!Media.isDesktop) return;
                let columns = 0;
                for (const merchCard of merchCards) {
                    if (merchCard.style.display === 'none') continue;
                    const size = merchCard.getAttribute('size');
                    let columnCount = size === 'wide' ? 2 : size === 'super-wide' ? 3 : 1;
                    if (columnCount === 2 && columns % 3 === 2) {
                        merchCard.setAttribute('data-size', size);
                        merchCard.removeAttribute('size');
                        columnCount = 1;
                    }
                    columns += columnCount;
                }
            }

            Media.matchDesktop.addEventListener('change', minifyOverflowingWideCards);
            collection.addEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, minifyOverflowingWideCards);

            collection.onUnmount.push(() => {
                Media.matchDesktop.removeEventListener('change', minifyOverflowingWideCards);
                collection.removeEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, minifyOverflowingWideCards);
            });
        }
    };
}

