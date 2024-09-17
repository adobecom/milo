import { html, css } from 'lit';
import { VariantLayout } from './variant-layout';
import { CSS } from './ccd-suggested.css.js';

export class CCDSuggested extends VariantLayout {
  constructor(card) {
    super(card);
  }

  getGlobalCSS() {
    return CSS;
  }

  get headingSelector() {
    return '[slot="detail-m"]';
  }

  get stripStyle() {
    if (this.strip && this.stripBackground) {
      return `
        background: ${this.stripBackground};
        background-size: ${this.strip} 100%;
        background-repeat: no-repeat;
        background-position: left;
      `;
    }
    return '';
  }

  renderLayout () {
      return html`${this.cardImage}
          <div style="${this.stripStyle}" class="body">
              <slot name="icons"></slot>
              <slot name="detail-m"></slot>
              <slot name="heading-xs"></slot>
              <slot name="body-xs"></slot>
              <slot name="footer"></slot>
          </div>
                <slot></slot>`;
  }

  static variantStyle = css`
    :host([variant='ccd-suggested']) {
      width: var(--consonant-merch-card-ccd-suggested-width);
      height: var(--consonant-merch-card-ccd-suggested-height);
      border-radius: 4px;
      display: flex;
      flex-flow: wrap;
    }
  `;
};
