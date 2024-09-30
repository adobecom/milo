import { html, css } from 'lit';
import { VariantLayout } from './variant-layout';
import { CSS } from './ccd-suggested.css.js';

export class CCDSuggested extends VariantLayout {

  getGlobalCSS() {
    return CSS;
  }

  renderLayout () {
      return html`
          <div style="${this.stripStyle}" class="body">
              <div class="header">
                <slot name="icons"></slot>
                <div class="headings">
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
      width: var(--merch-card-ccd-suggested-width);
      min-height: var(--merch-card-ccd-suggested-height);
      border-radius: 4px;
      display: flex;
      flex-flow: wrap;
    }

    :host([variant='ccd-suggested']) .body {
      height: auto;
    }

    :host([variant='ccd-suggested']) .header {
      display: flex;
      flex-flow: wrap;
      place-self: flex-start;
    }

    :host([variant='ccd-suggested']) .headings {
      padding-inline-start: var(--consonant-merch-spacing-xxs);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
      flex-flow: wrap;
      place-self: flex-start;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
      font-size: var(--consonant-merch-card-heading-xxs-font-size);
      line-height: var(--consonant-merch-card-heading-xxs-line-height);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='detail-m']) {
      color: var(--merch-color-grey-60);
    }
    
    :host([variant='ccd-suggested'][strip-size='wide']) ::slotted([slot='body-xs']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested'][strip-size='wide']) ::slotted([slot='price']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='price']) {
      display: flex;
      align-items: center;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='cta']) {
      display: flex;
      align-items: center;
    }


    :host([variant='ccd-suggested']) .footer {
      display: flex;
      justify-content: space-between;
      flex-grow: 0;
      margin-top: auto;
      align-items: center;
    }
  `;
};
