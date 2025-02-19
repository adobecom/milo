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
  stockOffer: true,
  secureLabel: true,
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
    }

    :host([variant='plans']) .body {
        min-width: var(--merch-card-plans-min-width);
        max-width: var(--merch-card-plans-max-width);
        padding: var(--merch-card-plans-padding);
    }

    :host([variant='plans']) ::slotted([slot='callout-content']) {
        line-height: var(--consonant-merch-card-body-xs-line-height);
    }

    :host([variant='plans']) footer {
        padding: var(--merch-card-plans-padding);
        padding-top: 0;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
        max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `;
}
