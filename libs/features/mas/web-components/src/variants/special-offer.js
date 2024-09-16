import { html, css } from 'lit';
import { VariantLayout } from './variant-layout';
import { CSS } from './special-offer.css.js';

export class SpecialOffer extends VariantLayout {
  constructor(card) {
    super(card);
  }

  getGlobalCSS() {
    return CSS;
  }

  get headingSelector() {
    return '[slot="detail-m"]';
  }
  
  renderLayout () {
      return html`${this.cardImage}
          <div class="body">
              <slot name="detail-m"></slot>
              <slot name="heading-xs"></slot>
              <slot name="body-xs"></slot>
          </div>
          ${this.evergreen
              ? html`
                    <div
                        class="detail-bg-container"
                        style="background: ${this.card['detailBg']}"
                    >
                        <slot name="detail-bg"></slot>
                    </div>
                `
              : html`
                    <hr />
                    ${this.secureLabelFooter}
                `}
                <slot></slot>`;
  }

  static variantStyle = css`
    :host([variant='special-offers']) {
      min-height: 439px;
    }
      
    :host([variant='special-offers'].center) {
      text-align: center;
    }  
  `;
};
