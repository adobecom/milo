import { VariantLayout } from './variant-layout';
import { html, css, nothing } from 'lit';
import { CSS } from './plans.css.js';
import Media from '../media.js';
import {
    EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED,
    SELECTOR_MAS_INLINE_PRICE,
    TEMPLATE_PRICE_LEGAL,
} from '../constants.js';
import { getOuterHeight } from '../utils.js';

export const PLANS_AEM_FRAGMENT_MAPPING = {
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
    badge: { tag: 'div', slot: 'badge', default: 'spectrum-yellow-300-plans' },
    allowedBadgeColors: [
      'spectrum-yellow-300-plans',
      'spectrum-gray-300-plans',
      'spectrum-gray-700-plans',
      'spectrum-green-900-plans',
    ],
    allowedBorderColors: [
      'spectrum-yellow-300-plans',
      'spectrum-gray-300-plans',
      'spectrum-green-900-plans',
    ],
    borderColor: { attribute: 'border-color' },
    size: ['wide', 'super-wide'],
    whatsIncluded: { tag: 'div', slot: 'whats-included' },
    ctas: { slot: 'footer', size: 'm' },
    style: 'consonant',
    perUnitLabel: { tag: 'span', slot: 'per-unit-label' },
};

export const PLANS_EDUCATION_AEM_FRAGMENT_MAPPING = {
  ...(function(){
    const { whatsIncluded, size, ...rest } = PLANS_AEM_FRAGMENT_MAPPING;
    return rest;
  }()),
  title: { tag: 'h3', slot: 'heading-s' },
  secureLabel: false
}

export const PLANS_STUDENTS_AEM_FRAGMENT_MAPPING = {
  ...(function(){
    const { subtitle, whatsIncluded, size, quantitySelect, ...rest } = PLANS_AEM_FRAGMENT_MAPPING;
    return rest;
  }())
}

export class Plans extends VariantLayout {
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

    async adjustEduLists() {
        if (this.card.variant !== 'plans-education') return;
        const existingSpacer = this.card.querySelector('.spacer');
        if (existingSpacer) return;

        const body = this.card.querySelector('[slot="body-xs"]');
        if (!body) return;
        const list = body.querySelector('ul');
        if (!list) return;

        /* Add spacer */
        const listHeader = list.previousElementSibling;
        const spacer = document.createElement('div');
        spacer.classList.add('spacer');
        body.insertBefore(spacer, listHeader);
        
        const intersectionObs = new IntersectionObserver(([entry]) => {
            if (entry.boundingClientRect.height === 0) return;
            let offset = 0;
            const heading = this.card.querySelector('[slot="heading-s"]');
            if (heading) offset += getOuterHeight(heading);
            const subtitle = this.card.querySelector('[slot="subtitle"]');
            if (subtitle) offset += getOuterHeight(subtitle);
            const price = this.card.querySelector('[slot="heading-m"]');
            /* If price is slotted, also add 8 pixels for the gap */
            if (price) offset += 8 + getOuterHeight(price);
            for (const child of body.childNodes) {
                if (child.classList.contains('spacer')) break;
                offset += getOuterHeight(child);
            }

            const maxOffset = this.card.parentElement.style.getPropertyValue('--merch-card-plans-edu-list-max-offset');
            if (offset > (parseFloat(maxOffset) || 0)) {
                this.card.parentElement.style.setProperty('--merch-card-plans-edu-list-max-offset', `${offset}px`);
            }
            this.card.style.setProperty('--merch-card-plans-edu-list-offset', `${offset}px`);
            intersectionObs.disconnect();
        });
        
        intersectionObs.observe(this.card);
    }

    async postCardUpdateHook() {
        this.adaptForMedia();
        this.adjustTitleWidth();
        this.adjustAddon();
        this.adjustCallout();
        if (!this.legalAdjusted) {
            await this.adjustLegal();
            await this.adjustEduLists();
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

    get divider() {
        return this.card.variant === 'plans-education'
            ? html`<div class="divider"></div>` 
            : nothing
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
            /* Proceed with adjusting edu lists */
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
                ${this.icons}
                <slot name="heading-xs"></slot>
                <slot name="heading-s"></slot>
                <slot name="subtitle"></slot>
                ${this.divider}
                <slot name="heading-m"></slot>
                <slot name="annualPrice"></slot>
                <slot name="priceLabel"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="body-xs"></slot>
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
        :host([variant^='plans']) {
            min-height: 273px;
            border: 1px solid var(--consonant-merch-card-border-color, #dadada);
            --merch-card-plans-min-width: 244px;
            --merch-card-plans-padding: 15px;
            --merch-card-plans-subtitle-display: contents;
            --merch-card-plans-heading-min-height: 23px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
            font-weight: 400;
        }

        :host([variant^='plans']) .slot-placeholder {
            display: none;
        }

        :host([variant='plans-education']) {
            min-height: unset;
        }

        :host([variant='plans-education']) ::slotted([slot='subtitle']) {
            font-size: var(--consonant-merch-card-heading-xxxs-font-size);
            line-height: var(--consonant-merch-card-heading-xxxs-line-height);
            font-style: italic;
            font-weight: 400;
        }
        
        :host([variant='plans-education']) .divider {
            border: 0;
            border-top: 1px solid #E8E8E8;
            margin-top: 8px;
            margin-bottom: 8px;
        }

        :host([variant='plans']) slot[name="subtitle"] {
            display: var(--merch-card-plans-subtitle-display);
            min-height: 18px;
            margin-top: 8px;
            margin-bottom: -8px;
        }

        :host([variant='plans']) ::slotted([slot='heading-xs']) {
            min-height: var(--merch-card-plans-heading-min-height);
        }

        :host([variant^='plans']) .body {
            min-width: var(--merch-card-plans-min-width);
            padding: var(--merch-card-plans-padding);
        }

        :host([variant='plans'][size]) .body {
            max-width: none;
        }

        :host([variant^='plans']) ::slotted([slot='addon']) {
            margin-top: auto;
            padding-top: 8px;
        }

        :host([variant^='plans']) footer ::slotted([slot='addon']) {
            margin: 0;
            padding: 0;
        }

        :host([variant='plans']) .wide-footer #stock-checkbox {
            margin-top: 0;
        }

        :host([variant='plans']) #stock-checkbox {
            margin-top: 8px;
            gap: 9px;
            color: rgb(34, 34, 34);
            line-height: var(--consonant-merch-card-detail-xs-line-height);
            padding-top: 4px;
            padding-bottom: 5px;
        }

        :host([variant='plans']) #stock-checkbox > span {
            border: 2px solid rgb(109, 109, 109);
            width: 12px;
            height: 12px;
        }

        :host([variant^='plans']) footer {
            padding: var(--merch-card-plans-padding);
            padding-top: 1px;
        }

        :host([variant='plans']) .secure-transaction-label {
            color: rgb(80, 80, 80);
            line-height: var(--consonant-merch-card-detail-xs-line-height);
        }

        :host([variant='plans']) ::slotted([slot='heading-xs']) {
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }

        :host([variant='plans']) #badge {
            border-radius: 4px 0 0 4px;
            font-weight: 400;
            line-height: 21px;
            padding: 2px 10px 3px;
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
    }
}
