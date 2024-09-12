import { VariantLayout } from './variant-layout.js';
import { html, css } from 'lit';
import { CSS } from './ccd-slice.css.js';

export class CCDSlice extends VariantLayout {
  constructor(card) {
    super(card);
  }
  
  getGlobalCSS() {
    return CSS;
  }

  renderLayout() {
    return html` <div class="body">
        <slot name="icons"></slot> ${this.badge}
        <slot name="body-s"></slot>
        <footer><slot name="footer"></slot></footer>
        <slot name="background"></slot>
        <slot></slot>
    </div>`;
  }
  static variantStyle = css`
    :host([variant='ccd-slice']:not([size])) {
      width: var(--consonant-merch-card-ccd-slice-width);
    }
  `;
}
