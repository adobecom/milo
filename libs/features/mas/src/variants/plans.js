import { VariantLayout } from "./variant-layout";
import { html, css } from 'lit';
import { CSS } from './plans.css.js';

export const PLANS_AEM_FRAGMENT_MAPPING = {
  title: { tag: 'p', slot: 'heading-xs' },
  prices: { tag: 'p', slot: 'heading-m' },
  promoText: {tag: 'p', slot: 'promo-text'},
  description: { tag: 'div', slot: 'body-xs' },
  mnemonics: { size: 'l' },
  callout: {tag: 'div', slot: 'callout-content'},
  quantitySelect: { tag: 'div', slot: 'quantity-select' },
  stockOffer: true,
  secureLabel: true,
  badge: true,
  ctas: { slot: 'footer', size: 'm' },
  style: 'consonant'
};

export class Plans extends VariantLayout {
  constructor(card) {
    super(card);
  }

    /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return PLANS_AEM_FRAGMENT_MAPPING;
  }

  getGlobalCSS() {
    return CSS;
  }
  
  postCardUpdateHook() {
    this.adjustTitleWidth();
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

  renderLayout() {
    return html` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="annualPrice"></slot>
            <slot name="priceLabel"></slot>
            <slot name="body-xxs"></slot>
            <slot name="promo-text"></slot>
            <slot name="body-xs"></slot>
            <slot name="callout-content"></slot> 
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`;
  }

  static variantStyle = css`
    :host([variant='plans']) {
        --merch-card-plans-min-width: 244px;
        --merch-card-plans-max-width: 244px;
        --merch-card-plans-padding: 15px;
        --merch-card-plans-heading-min-height: 23px;
        --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
    }

    :host([variant='plans']) ::slotted([slot='heading-xs']) {
        min-height: var(--merch-card-plans-heading-min-height);
    }

    :host([variant='plans']) .body {
        min-width: var(--merch-card-plans-min-width);
        max-width: var(--merch-card-plans-max-width);
        padding: var(--merch-card-plans-padding);
    }

    :host([variant='plans']) #stock-checkbox {
        margin-top: 8px;
    }

    :host([variant='plans']) footer {
        padding: var(--merch-card-plans-padding);
        padding-top: 1px;
    }

    :host([variant='plans']) .secure-transaction-label {
        color: #505050;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
        max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `;
}
