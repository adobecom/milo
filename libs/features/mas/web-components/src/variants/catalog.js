import { VariantLayout } from './variant-layout.js';
import { html, css } from 'lit';
import { isMobileOrTablet } from '../utils.js';
import { CSS } from './catalog.css.js';

export class Catalog extends VariantLayout {
  constructor(card) {
    super(card);
  }

  renderLayout() {
      return html` <div class="body">
        <div class="top-section">
            <slot name="icons"></slot> ${this.badge}
            <div
                class="action-menu
                ${isMobileOrTablet() && this.card.actionMenu
                    ? 'always-visible'
                    : ''}
                ${!this.card.actionMenu ? 'hidden' : 'invisible'}"
                @click="${this.card.toggleActionMenu}"
            ></div>
        </div>
        <slot
            name="action-menu-content"
            class="action-menu-content
            ${!this.card.actionMenuContent ? 'hidden' : ''}"
            >${this.card.actionMenuContent}</slot
        >
        <slot name="heading-xs"></slot>
        <slot name="heading-m"></slot>
        <slot name="body-xxs"></slot>
        ${!this.promoBottom
            ? html`<slot name="promo-text"></slot
                  ><slot name="callout-content"></slot>`
            : ''}
        <slot name="body-xs"></slot>
        ${this.promoBottom
            ? html`<slot name="promo-text"></slot
                  ><slot name="callout-content"></slot>`
            : ''}
    </div>
    ${this.secureLabelFooter}`;
  }

  getGlobalCSS() {
    return CSS;
  }

  connectedCallbackHook() {
    this.card.addEventListener('mouseleave', this.card.toggleActionMenu);
  }
  disconnectedCallbackHook() {
    this.card.removeEventListener('mouseleave', this.card.toggleActionMenu);
  }
  static variantStyle = css`
    :host([variant='catalog']) {
      min-height: 330px;
    }

    .body .catalog-badge {
      display: flex;
      height: fit-content;
      flex-direction: column;
      width: fit-content;
      max-width: 140px;
      border-radius: 5px;
      position: relative;
      top: 0;
      margin-left: var(--consonant-merch-spacing-xxs);
      box-sizing: border-box;
    }
  `;
}
