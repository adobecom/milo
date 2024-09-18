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
      return html`
          <div style="${this.stripStyle}" class="body">
              <div class="top-secton">
                <slot name="icons"></slot>
                <div class="header">
                  <slot name="detail-m"></slot>
                  <slot name="heading-xs"></slot>
                </div>
              </div>
              <slot name="body-xs"></slot>
              <div class="footer">
                <slot name="price"></slot>
                <slot name="cta"></slot>
              </div>
          </div>
                <slot></slot>`;
  }

  static variantStyle = css`
    :host([variant='ccd-suggested']) {
      width: var(--consonant-merch-card-ccd-suggested-width);
      min-height: var(--consonant-merch-card-ccd-suggested-height);
      border-radius: 4px;
      display: flex;
      flex-flow: wrap;
    }

    :host([variant='ccd-suggested']) .body {
      height: auto;
    }

    :host([variant='ccd-suggested']) .top-secton {
      display: flex;
      flex-flow: wrap;
      place-self: flex-start;
    }

    :host([variant='ccd-suggested']) .header {
      padding-inline-start: var(--consonant-merch-spacing-xxs);
    }

    :host([variant='ccd-suggested']) slot[name='detail-m'] {
      flex-flow: wrap;
      place-self: flex-start;
    }

    :host([variant='ccd-suggested']) .footer {
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
      margin-top: auto;
      align-items: flex-end;
    }
  `;
};
