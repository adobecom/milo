import { VariantLayout } from "./variant-layout";
import { html } from 'lit';
import { CSS } from './product.css.js';

export class Product extends VariantLayout {
  constructor(card) {
    super(card);
  }

  getGlobalCSS() {
    return CSS;
  }

  renderLayout() {
    return html` ${this.badge}
      <div class="body">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${!this.promoBottom ? html`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ''}
          <slot name="body-xs"></slot>
          ${this.promoBottom ? html`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ''}
      </div>
      ${this.secureLabelFooter}`;
  }
}
