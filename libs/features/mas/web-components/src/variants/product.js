import { VariantLayout } from "./variant-layout";
import { isMobile } from '../utils.js';
import { html, css } from 'lit';
import { CSS } from './product.css.js';

export class Product extends VariantLayout {
  constructor(card) {
    super(card);
  }

  getGlobalCSS() {
    return CSS;
  }

  adjustProductBodySlots() {
    if (this.card.getBoundingClientRect().width === 0) return;

    const slots = [
      'heading-xs',
      'body-xxs',
      'body-xs',
      'promo-text',
      'callout-content',
      'body-lower',
    ];

    slots.forEach((slot) =>
      this.updateCardElementMinHeight(
        this.card.shadowRoot.querySelector(`slot[name="${slot}"]`),
        slot
      ),
    );
  }

  renderLayout() {
    return html` ${this.badge}
      <div class="body">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${!this.promoBottom ? html`<slot name="promo-text"></slot>` : ''}
          <slot name="body-xs"></slot>
          ${this.promoBottom ? html`<slot name="promo-text"></slot>` : ''}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`;
  }

  connectedCallbackHook() {
    super.connectedCallbackHook();
    window.addEventListener('resize', this.postCardUpdateHook.bind(this));
  }

  postCardUpdateHook() {
    if (!isMobile()) {
      this.adjustProductBodySlots();
    }
  }

  static variantStyle = css`
    :host([variant='product']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='product']) slot[name='body-xs'] {
        min-height: var(--consonant-merch-card-product-body-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='heading-xs'] {
        min-height: var(--consonant-merch-card-product-heading-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='body-xxs'] {
        min-height: var(--consonant-merch-card-product-body-xxs-height);
        display: block;
    }
    :host([variant='product']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-product-promo-text-height);
        display: block;
    }
    :host([variant='product']) slot[name='callout-content'] {
        min-height: var(--consonant-merch-card-product-callout-content-height);
        display: block;
    }
  `;
}
