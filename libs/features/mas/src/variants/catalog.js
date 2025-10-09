import { VariantLayout } from './variant-layout.js';
import { html, css } from 'lit';
import { isMobileOrTablet } from '../utils.js';
import { EVENT_MERCH_CARD_ACTION_MENU_TOGGLE } from '../constants.js';
import { CSS } from './catalog.css.js';

export const CATALOG_AEM_FRAGMENT_MAPPING = {
    badge: true,
    ctas: { slot: 'footer', size: 'm' },
    description: { tag: 'div', slot: 'body-xs' },
    mnemonics: { size: 'l' },
    prices: { tag: 'h3', slot: 'heading-xs' },
    shortDescription: { tag: 'div', slot: 'action-menu-content', attributes: { tabindex: '0' } },
    size: ['wide', 'super-wide'],
    title: { tag: 'h3', slot: 'heading-xs' },
};

export class Catalog extends VariantLayout {
    constructor(card) {
        super(card);
    }

    get actionMenu() {
        return this.card.shadowRoot.querySelector('.action-menu');
    }

    get actionMenuContentSlot() {
        return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');
    }

    get slottedContent() {
        return this.card.querySelector('[slot="action-menu-content"]');
    }

    setIconVisibility(visible) {
        if (isMobileOrTablet() && this.card.actionMenu) return;
        this.actionMenu?.classList.toggle('hidden', !visible);
        this.actionMenu?.classList.toggle('always-visible', visible);
    }

    setMenuVisibility(open) {
        this.actionMenuContentSlot?.classList.toggle('hidden', !open);
        this.setAriaExpanded(this.actionMenu, open.toString());
        if (open) this.dispatchActionMenuToggle();
    }

    isMenuOpen() {
        return !this.actionMenuContentSlot?.classList.contains('hidden');
    }

    renderLayout() {
        return html` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${isMobileOrTablet() && this.card.actionMenu
                            ? 'always-visible'
                            : 'hidden'}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        @focus="${this.showActionMenuOnHover}"
                        @blur="${this.hideActionMenuOnBlur}"
                        tabindex="0"
                        aria-expanded="false"
                        role="button"
                        aria-label="${this.card.actionMenuLabel} - ${this.card.title}"
                    ></div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
            ${!this.card.actionMenuContent ? 'hidden' : ''}"
                    >${this.card.actionMenuContent}
                </slot>
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
            ${this.secureLabelFooter}
            <slot></slot>`;
    }

    getGlobalCSS() {
        return CSS;
    }

    dispatchActionMenuToggle = () => {
        this.card.dispatchEvent(
            new CustomEvent(EVENT_MERCH_CARD_ACTION_MENU_TOGGLE, {
                bubbles: true,
                composed: true,
                detail: {
                    card: this.card.name,
                    type: 'action-menu',
                },
            }),
        );
    };

    toggleActionMenu = (e) => {
      if (!this.actionMenuContentSlot || !e || (e.type !== 'click' && e.code !== 'Space' && e.code !== 'Enter')) return;

      e.preventDefault();
      this.setMenuVisibility(!this.isMenuOpen());
    };

    toggleActionMenuFromCard = (e) => {
        //beware this is an event on card, so this points to the card, not the layout
        const retract = e?.type === 'mouseleave' ? true : undefined;
        this.card.blur();
        this.setIconVisibility(false);
        if (!this.actionMenuContentSlot) return;

        this.setMenuVisibility(!retract);
    };

    showActionMenuOnHover = () => {
        if (!this.actionMenu) return;
        this.setIconVisibility(true);
    };

    hideActionMenu = () => {
      this.setMenuVisibility(false);
      this.setIconVisibility(false);
    }

    hideActionMenuOnBlur = (e) => {
      if (e.relatedTarget === this.slottedContent) return;

      if (this.isMenuOpen()) {
        this.setMenuVisibility(false);
      }

      if (!this.card.contains(e.relatedTarget)) {
        this.setIconVisibility(false);
      }
    };

    handleCardFocusOut = (e) => {
      if (e.target === this.slottedContent && !this.slottedContent.contains(e.relatedTarget)) {
        this.setMenuVisibility(false);
      }

      if (!this.card.contains(e.relatedTarget) && !this.isMenuOpen()) {
        this.setIconVisibility(false);
      }
    };

    handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        this.hideActionMenu();
        this.actionMenu?.focus();
      }
    };

    setAriaExpanded(element, value) {
        element.setAttribute('aria-expanded', value);
    }

    connectedCallbackHook() {
        this.card.addEventListener('mouseenter', this.showActionMenuOnHover);
        this.card.addEventListener('mouseleave', this.toggleActionMenuFromCard);
        this.card.addEventListener('focusin', this.showActionMenuOnHover);
        this.card.addEventListener('focusout', this.handleCardFocusOut);
        this.card.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallbackHook() {
        this.card.removeEventListener('mouseenter', this.showActionMenuOnHover);
        this.card.removeEventListener('mouseleave', this.toggleActionMenuFromCard);
        this.card.removeEventListener('focusin', this.showActionMenuOnHover);
        this.card.removeEventListener('focusout', this.handleCardFocusOut);
        this.card.removeEventListener('keydown', this.handleKeyDown);
    }

    static variantStyle = css`
        :host([variant='catalog']) {
            min-height: 330px;
            width: var(--consonant-merch-card-catalog-width);
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
