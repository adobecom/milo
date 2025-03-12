import { VariantLayout } from "./variant-layout";
import { html, css } from 'lit';
import { CSS } from './plans.css.js';
import { isMobile, matchMobile } from '../utils.js';

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
  size: ['wide', 'super-wide'],
  whatsIncluded: { tag: 'div', slot: 'whats-included' },
  ctas: { slot: 'footer', size: 'm' },
  style: 'consonant'
};

export class Plans extends VariantLayout {
  constructor(card) {
    super(card);
    this.adaptForMobile = this.adaptForMobile.bind(this);
  }

    /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return PLANS_AEM_FRAGMENT_MAPPING;
  }

  getGlobalCSS() {
    return CSS;
  }

  adaptForMobile() {
    const shadowRoot = this.card.shadowRoot;
    const footer = shadowRoot.querySelector('footer');
    const size = this.card.getAttribute('size');
    const stockInFooter = shadowRoot.querySelector('footer #stock-checkbox');

    if (!size) {
      footer.classList.remove('wide-footer');
      if (stockInFooter) stockInFooter.remove();
      return;
    }
    if (size !== 'super-wide' && size !== 'wide' && !footer.classList.contains('wide-footer')) {
      return;
    }

    const isMob = isMobile();
    if (footer) {
      footer.classList.toggle('wide-footer', !isMob);
    }
    const stockInBody = shadowRoot.querySelector('.body #stock-checkbox');
    if (isMob) {
      if (stockInFooter && stockInBody) {
        stockInFooter.remove();
      } else if (stockInFooter && !stockInBody) {
        shadowRoot.querySelector('.body').appendChild(stockInFooter);
      }
    } else {
      if (stockInBody && stockInFooter) {
        stockInBody.remove();
      } else if (stockInBody && !stockInFooter) {
        footer.prepend(stockInBody);
      }
    }
  }

  postCardUpdateHook() {
    this.adaptForMobile();
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

  connectedCallbackHook() {
    matchMobile().addEventListener('change', this.adaptForMobile);
  }

  disconnectedCallbackHook() {
    const match = matchMobile();
    if (match?.removeEventListener) match.removeEventListener('change', this.adaptForMobile);
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
            <slot name="whats-included"></slot>
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`;
  }

  static variantStyle = css`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `;
}
