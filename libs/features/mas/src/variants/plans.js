import { VariantLayout } from './variant-layout';
import { html, css } from 'lit';
import { CSS } from './plans.css.js';
import { isMobile, matchMobile } from '../utils.js';
import {
    SELECTOR_MAS_INLINE_PRICE,
    TEMPLATE_PRICE,
    TEMPLATE_PRICE_LEGAL,
} from '../constants.js';

export const PLANS_AEM_FRAGMENT_MAPPING = {
    title: { tag: 'p', slot: 'heading-xs' },
    prices: { tag: 'p', slot: 'heading-m' },
    promoText: { tag: 'p', slot: 'promo-text' },
    description: { tag: 'div', slot: 'body-xs' },
    mnemonics: { size: 'l' },
    callout: { tag: 'div', slot: 'callout-content' },
    quantitySelect: { tag: 'div', slot: 'quantity-select' },
    stockOffer: true /* @deprecated */,
    addon: true,
    secureLabel: true,
    planType: true,
    badge: { tag: 'div', slot: 'badge' },
    allowedBadgeColors: [
      'spectrum-yellow-300-plans',
      'spectrum-gray-300-plans',
      'spectrum-gray-700-plans',
      'spectrum-green-900-plans',
    ],
    allowedBorderColors: [
      'spectrum-yellow-300-plans',
      'spectrum-gray-300-plans',
    ],
    borderColor: { attribute: 'border-color' },
    size: ['wide', 'super-wide'],
    whatsIncluded: { tag: 'div', slot: 'whats-included' },
    ctas: { slot: 'footer', size: 'm' },
    style: 'consonant',
};

export const PLANS_EDUCATION_AEM_FRAGMENT_MAPPING = {
  ...(function(){
    const { whatsIncluded, ...rest } = PLANS_AEM_FRAGMENT_MAPPING;
    return rest;
  }()),
  title: { tag: 'p', slot: 'heading-s' },
  subtitle: { tag: 'p', slot: 'subtitle' },
  secureLabel: false
}

export const PLANS_STUDENTS_AEM_FRAGMENT_MAPPING = {
  ...(function(){
    const { whatsIncluded, size, quantitySelect, ...rest } = PLANS_AEM_FRAGMENT_MAPPING;
    return rest;
  }())
}

export class Plans extends VariantLayout {
    constructor(card) {
        super(card);
        this.adaptForMobile = this.adaptForMobile.bind(this);
    }

    priceOptionsProvider(element, options) {
        if (element.dataset.template !== TEMPLATE_PRICE_LEGAL) return;
        options.displayPlanType = this.card?.settings?.displayPlanType ?? false;
    }

    getGlobalCSS() {
        return CSS;
    }

    adaptForMobile() {
        if (
            !this.card.closest(
                'merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards',
            )
        ) {
            this.card.removeAttribute('size');
            return;
        }

        const shadowRoot = this.card.shadowRoot;
        const footer = shadowRoot.querySelector('footer');
        const size = this.card.getAttribute('size');
        const stockInFooter = shadowRoot.querySelector(
            'footer #stock-checkbox',
        );
        const stockInBody = shadowRoot.querySelector('.body #stock-checkbox');
        const body = shadowRoot.querySelector('.body');

        if (!size) {
            footer?.classList.remove('wide-footer');
            if (stockInFooter) stockInFooter.remove();
            return;
        }

        const mobile = isMobile();
        footer?.classList.toggle('wide-footer', !mobile);
        if (mobile && stockInFooter) {
            stockInBody
                ? stockInFooter.remove()
                : body.appendChild(stockInFooter);
            return;
        }
        if (!mobile && stockInBody) {
            stockInFooter ? stockInBody.remove() : footer.prepend(stockInBody);
        }
    }

    postCardUpdateHook() {
        this.adaptForMobile();
        this.adjustTitleWidth();
        this.adjustLegal();
        this.adjustAddon();
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
        : ''
    }

    async adjustLegal() {
        await this.card.updateComplete;
        if (this.legal) return;
        const prices = [];
        const headingPrice = this.card.querySelector(`[slot="heading-m"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`);
        if (headingPrice) prices.push(headingPrice);
        const bodyPrices = this.card.querySelectorAll(`[slot="body-xs"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`);
        bodyPrices.forEach(bodyPrice => prices.push(bodyPrice));
        const legalPromises = prices.map(async (price) => {
          const legal = price.cloneNode(true);
          if (price === headingPrice) this.legal = legal;
          await price.onceSettled();
          if (!price?.options) return;
          if (price.options.displayPerUnit)
              price.dataset.displayPerUnit = 'false';
          if (price.options.displayTax) price.dataset.displayTax = 'false';
          if (price.options.displayPlanType)
              price.dataset.displayPlanType = 'false';
          legal.setAttribute('data-template', 'legal');
          price.parentNode.insertBefore(legal, price.nextSibling);
        });
        await Promise.all(legalPromises);
    }

    async adjustAddon() {
      await this.card.updateComplete;
      const addon = this.card.addon;
      if (!addon) return;
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
            : '';
    }

    get icons() {
      if (!this.card.querySelector('[slot="icons"]')) return '';
      return html`<slot name="icons"></slot>`;
    }

    connectedCallbackHook() {
        const match = matchMobile();
        if (match?.addEventListener)
            match.addEventListener('change', this.adaptForMobile);
    }

    disconnectedCallbackHook() {
        const match = matchMobile();
        if (match?.removeEventListener)
            match.removeEventListener('change', this.adaptForMobile);
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
                ${this.stockCheckbox}
                <slot name="addon"></slot>
                <slot name="badge"></slot>
                <slot name="quantity-select"></slot>
            </div>
            ${this.secureLabelFooter}`;
    }

    static variantStyle = css`
        :host([variant^='plans']) {
            min-height: 273px;
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
            --merch-card-plans-min-width: 244px;
            --merch-card-plans-max-width: 244px;
            --merch-card-plans-padding: 15px;
            --merch-card-plans-heading-min-height: 23px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
            font-weight: 400;
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
        }

        :host([variant='plans']) ::slotted([slot='heading-xs']) {
            min-height: var(--merch-card-plans-heading-min-height);
        }

        :host([variant='plans']) .body {
            min-width: var(--merch-card-plans-min-width);
            max-width: var(--merch-card-plans-max-width);
            padding: var(--merch-card-plans-padding);
        }

        :host([variant='plans'][size]) .body {
            max-width: none;
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

        :host([variant='plans']) footer {
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
}
