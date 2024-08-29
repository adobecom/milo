import { VariantLayout } from './variant-layout.js';
import { html, css } from 'lit';
import { isMobileOrTablet } from '../utils.js';
import { EVENT_MERCH_CARD_ACTION_MENU_TOGGLE } from '../constants.js';
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

  toggleActionMenu(e) {
    //beware this is an event on card, so this points to the card, not the layout
    const retract = e?.type === 'mouseleave' ? true : undefined;
    const actionMenuContentSlot = this.shadowRoot.querySelector(
        'slot[name="action-menu-content"]',
    );
    if (!actionMenuContentSlot) return;
    if (!retract) {
        this.card.dispatchEvent(
            new CustomEvent(EVENT_MERCH_CARD_ACTION_MENU_TOGGLE, {
                bubbles: true,
                composed: true,
                detail: {
                    card: this.name,
                    type: 'action-menu',
                },
            }),
        );
    }
    actionMenuContentSlot.classList.toggle('hidden', retract);
  }

  getGlobalCSS() {
    return CSS;
  }

  connectedCallbackHook() {
    this.card.addEventListener('mouseleave', this.toggleActionMenu);
  }
  disconnectedCallbackHook() {
    this.card.removeEventListener('mouseleave', this.toggleActionMenu);
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
