import { VariantLayout } from './variant-layout.js';
import { html, css } from 'lit';
import { CSS } from './ccd-action.css.js';

export class CCDAction extends VariantLayout {
  constructor(card) {
    super(card);
  }
  
  getGlobalCSS() {
    return CSS;
  }

  renderLayout() {
    return html` <div class="body">
        <slot name="icons"></slot> ${this.badge}
        <slot name="heading-xs"></slot>
        <slot name="heading-m"></slot>
        ${this.promoBottom ? html`<slot name="body-xs"></slot><slot name="promo-text"></slot>` : html`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
        <footer><slot name="footer"></slot></footer>
        ${this.defaultSlot}
    </div>`;
  }
  static variantStyle = css`
    :host([variant='ccd-action']:not([size])) {
      width: var(--consonant-merch-card-ccd-action-width);
    }
  `;
}
