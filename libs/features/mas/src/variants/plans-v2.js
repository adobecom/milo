
import { VariantLayout } from './variant-layout';
import { html, css, unsafeCSS, nothing } from 'lit';
import { CSS } from './plans-v2.css.js';
import Media, { MOBILE_LANDSCAPE, TABLET_DOWN } from '../media.js';
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
    shortDescription: { tag: 'p', slot: 'short-description' },
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
        this.toggleShortDescription = this.toggleShortDescription.bind(this);
        this.shortDescriptionExpanded = false;
    }

    priceOptionsProvider(element, options) {
        if (element.dataset.template !== TEMPLATE_PRICE_LEGAL) return;
        options.displayPlanType = this.card?.settings?.displayPlanType ?? false;
    }

    getGlobalCSS() {
        return CSS;
    }

    adjustSlotPlacement(name, sizes, shouldBeInFooter) {
        const { shadowRoot } = this.card;
        const footer = shadowRoot.querySelector('footer');
        const body = shadowRoot.querySelector('.body');
        const size = this.card.getAttribute('size');
        
        if (!size) return;

        const slotInFooter = shadowRoot.querySelector(`footer slot[name="${name}"]`);
        const slotInBody = shadowRoot.querySelector(`.body slot[name="${name}"]`);

        if (!size.includes('wide')) {
            footer?.classList.remove('wide-footer');
            slotInFooter?.remove();
        }
        if (!sizes.includes(size)) return;

        footer?.classList.toggle('wide-footer', Media.isDesktopOrUp);

        if (!shouldBeInFooter && slotInFooter) {
            if (slotInBody) {
                slotInFooter.remove();
            } else {
                const bodyPlaceholder = body.querySelector(`[data-placeholder-for="${name}"]`);
                if (bodyPlaceholder) {
                    bodyPlaceholder.replaceWith(slotInFooter);
                } else {
                    body.appendChild(slotInFooter);
                }
            }
            return;
        }

        if (shouldBeInFooter && slotInBody) {
            const bodyPlaceholder = document.createElement('div');
            bodyPlaceholder.setAttribute('data-placeholder-for', name);
            bodyPlaceholder.classList.add('slot-placeholder');
            if (!slotInFooter) {
                footer.prepend(slotInBody.cloneNode(true));
            }
            slotInBody.replaceWith(bodyPlaceholder);
        }
    }

    adaptForMedia() {
        if (!this.card.closest('merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards,.columns')) {
            this.card.removeAttribute('size');
            return;
        }
        this.adjustSlotPlacement('heading-m', ['wide'], true);
        this.adjustSlotPlacement('addon', ['super-wide'], Media.isDesktopOrUp);
        this.adjustSlotPlacement('callout-content', ['super-wide'], Media.isDesktopOrUp);
    }

    adjustCallout() {
        const tooltipIcon = this.card.querySelector('[slot="callout-content"] .icon-button');
        if (!tooltipIcon?.title) return;

        tooltipIcon.dataset.tooltip = tooltipIcon.title;
        tooltipIcon.removeAttribute('title');
        tooltipIcon.classList.add('hide-tooltip');

        const hideTooltipExcept = (target) => {
            if (target === tooltipIcon) {
                tooltipIcon.classList.toggle('hide-tooltip');
            } else {
                tooltipIcon.classList.add('hide-tooltip');
            }
        };

        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            hideTooltipExcept(e.target);
        });

        document.addEventListener('mouseover', (e) => {
            e.preventDefault();
            if (e.target !== tooltipIcon) {
                tooltipIcon.classList.add('hide-tooltip');
            } else {
                tooltipIcon.classList.remove('hide-tooltip');
            }
        });
    }

    async postCardUpdateHook() {
        this.adaptForMedia();
        this.adjustTitleWidth();
        this.adjustAddon();
        this.adjustCallout();
        this.updateShortDescriptionVisibility();
        if (!this.legalAdjusted) {
            await this.adjustLegal();
        }
    }

    get mainPrice() {
        return this.card.querySelector(`[slot="heading-m"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`);
    }

    async adjustLegal() {
        if (this.legalAdjusted) return;
        
        try {
            this.legalAdjusted = true;
            await this.card.updateComplete;
            await customElements.whenDefined('inline-price');
            
            const headingPrice = this.mainPrice;
            if (!headingPrice) return;

            const legal = headingPrice.cloneNode(true);
            await headingPrice.onceSettled();
            
            if (!headingPrice?.options) return;

            if (headingPrice.options.displayPerUnit) headingPrice.dataset.displayPerUnit = 'false';
            if (headingPrice.options.displayTax) headingPrice.dataset.displayTax = 'false';
            if (headingPrice.options.displayPlanType) headingPrice.dataset.displayPlanType = 'false';
            
            legal.setAttribute('data-template', 'legal');
            headingPrice.parentNode.insertBefore(legal, headingPrice.nextSibling);
            await legal.onceSettled();
        } catch {
            // Proceed with other adjustments
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
        if (planType) addon.planType = planType;
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

    get hasShortDescription() {
        return !!this.card.querySelector('[slot="short-description"]');
    }

    get shortDescriptionLabel() {
        const shortDescElement = this.card.querySelector('[slot="short-description"]');
        
        const boldElement = shortDescElement.querySelector('strong, b');
        if (boldElement?.textContent?.trim()) {
            return boldElement.textContent.trim();
        }
        
        const headingOrPara = shortDescElement.querySelector('h1, h2, h3, h4, h5, h6, p');
        if (headingOrPara?.textContent?.trim()) {
            return headingOrPara.textContent.trim();
        }
        
        const firstLine = shortDescElement.textContent?.trim().split('\n')[0].trim();
        return firstLine
    }

    updateShortDescriptionVisibility() {
        const shortDescElement = this.card.querySelector('[slot="short-description"]');
        if (!shortDescElement) return;

        // Find the first bold or paragraph element
        const firstElement = shortDescElement.querySelector('strong, b, p');
        if (!firstElement) return;

        // On mobile, hide the first element (it's shown in the toggle label)
        // On desktop, show it (it's part of the content)
        if (Media.isDesktopOrUp) {
            firstElement.style.display = '';
        } else {
            firstElement.style.display = 'none';
        }
    }

    toggleShortDescription() {
        this.shortDescriptionExpanded = !this.shortDescriptionExpanded;
        this.card.requestUpdate();
    }

    get shortDescriptionToggle() {
        if (!this.hasShortDescription) return nothing;
        
        if (Media.isDesktopOrUp) {
            return html`
                <div class="short-description-divider"></div>
                <div class="short-description-content desktop">
                    <slot name="short-description"></slot>
                </div>
            `;
        }
        
        return html`
            <div class="short-description-divider"></div>
            <div class="short-description-toggle" @click=${this.toggleShortDescription}>
                <span class="toggle-label">${this.shortDescriptionLabel}</span>
                <span class="toggle-icon ${this.shortDescriptionExpanded ? 'expanded' : ''}"></span>
            </div>
            <div class="short-description-content ${this.shortDescriptionExpanded ? 'expanded' : ''}">
                <slot name="short-description"></slot>
            </div>
        `;
    }

    get icons() {
        return (this.card.querySelector('[slot="icons"]') || this.card.getAttribute('id'))
            ? html`<slot name="icons"></slot>`
            : nothing;
    }

    connectedCallbackHook() {
        this.handleMediaChange = () => {
            this.adaptForMedia();
            this.updateShortDescriptionVisibility();
            this.card.requestUpdate();
        };

        Media.matchMobile.addEventListener('change', this.handleMediaChange);
        Media.matchDesktopOrUp.addEventListener('change', this.handleMediaChange);
    }

    disconnectedCallbackHook() {
        Media.matchMobile.removeEventListener('change', this.handleMediaChange);
        Media.matchDesktopOrUp.removeEventListener('change', this.handleMediaChange);
    }

    renderLayout() {
        return html` ${this.badge}
            <div class="body">
                <div class="heading-wrapper">
                    ${this.icons}
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="heading-m"></slot>
                <slot name="subtitle"></slot>
                <slot name="body-xs"></slot>
                <div class="price-divider"></div>
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
            ${this.shortDescriptionToggle}
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
            font-weight: 400;
            --merch-card-plans-v2-min-width: 244px;
            --merch-card-plans-v2-padding: 26px 32px;
            --merch-card-plans-v2-subtitle-display: contents;
            --merch-card-plans-v2-heading-min-height: 23px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
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
            mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.6) 37.5%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 62.5%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.03) 87.5%, rgba(0, 0, 0, 0) 100%);
            -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.6) 37.5%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 62.5%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.03) 87.5%, rgba(0, 0, 0, 0) 100%);
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

        :host([variant='plans-v2']) .short-description-divider {
            height: 1px;
            background-color: #E8E8E8;
            margin: 0;
        }

        :host([variant='plans-v2']) .short-description-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            padding: 16px 32px;
            cursor: pointer;
            background-color: var(--spectrum-gray-50, #FFFFFF);
            transition: background-color 0.2s ease;
        }

        :host([variant='plans-v2']) .short-description-toggle:hover {
            background-color: var(--spectrum-gray-75, #F8F8F8);
        }

        :host([variant='plans-v2']) .short-description-toggle .toggle-label {
            font-size: 16px;
            font-weight: 700;
            color: var(--spectrum-gray-800, #2C2C2C);
            text-align: left;
            flex: 1;
            line-height: 1.5;
        }

        :host([variant='plans-v2']) .short-description-toggle .toggle-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            flex-shrink: 0;
            background-image: url('data:image/svg+xml,<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="%23F8F8F8"/><path d="M14 26C7.38258 26 2 20.6174 2 14C2 7.38258 7.38258 2 14 2C20.6174 2 26 7.38258 26 14C26 20.6174 20.6174 26 14 26ZM14 4.05714C8.51696 4.05714 4.05714 8.51696 4.05714 14C4.05714 19.483 8.51696 23.9429 14 23.9429C19.483 23.9429 23.9429 19.483 23.9429 14C23.9429 8.51696 19.483 4.05714 14 4.05714Z" fill="%23292929"/><path d="M18.5484 12.9484H15.0484V9.44844C15.0484 8.86875 14.5781 8.39844 13.9984 8.39844C13.4188 8.39844 12.9484 8.86875 12.9484 9.44844V12.9484H9.44844C8.86875 12.9484 8.39844 13.4188 8.39844 13.9984C8.39844 14.5781 8.86875 15.0484 9.44844 15.0484H12.9484V18.5484C12.9484 19.1281 13.4188 19.5984 13.9984 19.5984C14.5781 19.5984 15.0484 19.1281 15.0484 18.5484V15.0484H18.5484C19.1281 15.0484 19.5984 14.5781 19.5984 13.9984C19.5984 13.4188 19.1281 12.9484 18.5484 12.9484Z" fill="%23292929"/></svg>');
            background-size: 28px 28px;
            background-position: center;
            background-repeat: no-repeat;
            transition: background-image 0.3s ease;
        }

        :host([variant='plans-v2']) .short-description-toggle .toggle-icon.expanded {
            background-image: url('data:image/svg+xml,<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="%23292929"/><path d="M14 26C7.38258 26 2 20.6174 2 14C2 7.38258 7.38258 2 14 2C20.6174 2 26 7.38258 26 14C26 20.6174 20.6174 26 14 26ZM14 4.05714C8.51696 4.05714 4.05714 8.51696 4.05714 14C4.05714 19.483 8.51696 23.9429 14 23.9429C19.483 23.9429 23.9429 19.483 23.9429 14C23.9429 8.51696 19.483 4.05714 14 4.05714Z" fill="%23292929"/><path d="M9 14L19 14" stroke="%23F8F8F8" stroke-width="2" stroke-linecap="round"/></svg>');
        }

        :host([variant='plans-v2']) .short-description-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
            padding: 0 32px;
        }

        :host([variant='plans-v2']) .short-description-content.expanded {
            max-height: 500px;
            padding: 24px 32px;
        }

        :host([variant='plans-v2']) .short-description-content.desktop {
            max-height: none;
            overflow: visible;
            padding: 24px 32px;
            transition: none;
        }

        :host([variant='plans-v2']) .short-description-content ::slotted([slot='short-description']) {
            font-size: 16px;
            font-weight: 400;
            color: var(--spectrum-gray-700, #4B4B4B);
            line-height: 1.5;
            margin: 0;
        }

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

        :host([variant='plans-v2']) .price-divider {
            display: none;
        }

        :host([variant='plans-v2']) .heading-wrapper {
            display: flex;
            flex-direction: column;
        }

        :host([variant='plans-v2'][size='wide']) {
            width: 100%;
            max-width: 768px;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper {
            flex-direction: row;
            align-items: center;
            gap: 12px;
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
            flex-direction: column;
            align-items: flex-start;
        }

        :host([variant='plans-v2'][size='wide']) footer ::slotted([slot='heading-m']) {
            order: -1;
            margin-bottom: 16px;
            align-self: flex-start;
        }

        :host([variant='plans-v2'][size='wide']) footer ::slotted(a) {
            width: auto;
            min-width: 150px;
            margin-right: 12px;
            margin-bottom: 0;
        }

        :host([variant='plans-v2'][size='wide']) footer ::slotted(a:last-child) {
            margin-right: 0;
        }

        @media screen and ${unsafeCSS(MOBILE_LANDSCAPE)}, ${unsafeCSS(TABLET_DOWN)} {
            :host([variant='plans-v2']) {
                --merch-card-plans-v2-padding: 26px 16px;
            }

            :host([variant='plans-v2']) .short-description-toggle {
                padding: 16px;
            }

            :host([variant='plans-v2']) .short-description-content {
                padding: 0 16px;
            }

            :host([variant='plans-v2']) .short-description-content.expanded {
                padding: 24px 16px;
            }
        }
    `;

    static collectionOptions = {
        customHeaderArea: (collection) => {
            if (!collection.sidenav) return nothing;
            return html`<slot name="resultsText"></slot>`;
        },
        headerVisibility: {
            search: false,
            sort: false,
            result: ['mobile', 'tablet'],
            custom: ['desktop'],
        },
        onSidenavAttached: (collection) => {
            const minifyOverflowingWideCards = () => {
                const merchCards = collection.querySelectorAll('merch-card');
                merchCards.forEach(merchCard => {
                    if (merchCard.hasAttribute('data-size')) {
                        merchCard.setAttribute('size', merchCard.getAttribute('data-size'));
                        merchCard.removeAttribute('data-size');
                    }
                });

                if (!Media.isDesktop) return;

                let columns = 0;
                merchCards.forEach(merchCard => {
                    if (merchCard.style.display === 'none') return;
                    const size = merchCard.getAttribute('size');
                    let columnCount = size === 'wide' ? 2 : size === 'super-wide' ? 3 : 1;
                    if (columnCount === 2 && columns % 3 === 2) {
                        merchCard.setAttribute('data-size', size);
                        merchCard.removeAttribute('size');
                        columnCount = 1;
                    }
                    columns += columnCount;
                });
            };

            Media.matchDesktop.addEventListener('change', minifyOverflowingWideCards);
            collection.addEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, minifyOverflowingWideCards);

            collection.onUnmount.push(() => {
                Media.matchDesktop.removeEventListener('change', minifyOverflowingWideCards);
                collection.removeEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, minifyOverflowingWideCards);
            });
        },
    };
}
