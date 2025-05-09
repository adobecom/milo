import { VariantLayout } from './variant-layout';
import { isMobile, createTag } from '../utils.js';
import { html, css } from 'lit';
import { CSS } from './product.css.js';
import { SELECTOR_MAS_INLINE_PRICE } from '../constants.js';

export class Product extends VariantLayout {
    constructor(card) {
        super(card);
        this.postCardUpdateHook = this.postCardUpdateHook.bind(this);
    }

    getGlobalCSS() {
        return CSS;
    }

    adjustProductBodySlots() {
        if (this.card.getBoundingClientRect().width === 0) return;

        const slots = [
            'heading-xs',
            'body-xxs',
            'body-xs',
            'promo-text',
            'callout-content',
            'addon',
            'body-lower',
        ];

        slots.forEach((slot) =>
            this.updateCardElementMinHeight(
                this.card.shadowRoot.querySelector(`slot[name="${slot}"]`),
                slot,
            ),
        );
    }

    renderLayout() {
        return html` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${!this.promoBottom
                    ? html`<slot name="promo-text"></slot>`
                    : ''}
                <slot name="body-xs"></slot>
                ${this.promoBottom ? html`<slot name="promo-text"></slot>` : ''}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`;
    }

    connectedCallbackHook() {
        window.addEventListener('resize', this.postCardUpdateHook);
    }

    disconnectedCallbackHook() {
        window.removeEventListener('resize', this.postCardUpdateHook);
    }

    postCardUpdateHook() {
        if (!this.card.isConnected) return;
        this.adjustAddon();
        if (!isMobile()) {
            this.adjustProductBodySlots();
        }
        this.adjustTitleWidth(); 
    }

    get headingXSSlot() {
      return this.card.shadowRoot
        .querySelector('slot[name="heading-xs"]')
        .assignedElements()[0];
  }

    get mainPrice() {
        const price = this.card.querySelector(
            `[slot="heading-xs"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`,
        );
        return price;
    }

    toggleAddon(merchAddon) {
      const mainPrice = this.mainPrice;
      const headingXSSlot = this.headingXSSlot;
          if (!mainPrice && headingXSSlot) {
              const planType = merchAddon?.getAttribute('plan-type');
              let visibleSpan = null;
              if (merchAddon && planType) {
                  const matchingP = merchAddon.querySelector(`p[data-plan-type="${planType}"]`);
                  visibleSpan = matchingP?.querySelector('span[is="inline-price"]');
              }
              this.card.querySelectorAll('p[slot="heading-xs"]').forEach(p => p.remove());
              if (merchAddon.checked) {
                  if (visibleSpan) {
                      const replacementP = createTag(
                        'p',
                        { class: 'addon-heading-xs-price-addon', slot: 'heading-xs' },
                        visibleSpan.innerHTML
                      );
                      this.card.appendChild(replacementP);
                  }
              } else {
                  const freeP = createTag(
                    'p',
                    { class: 'card-heading', id: 'free', slot: 'heading-xs' },
                    'Free'
                  );
                  this.card.appendChild(freeP);
              }
       }
  }

    async adjustAddon() {
        await this.card.updateComplete;
        const addon = this.card.addon;
        if (!addon) return;
        const price = this.mainPrice;
        let planType = this.card.planType;
        if (price) {
            await price.onceSettled();
            planType = price.value?.[0]?.planType;
        }
        if (!planType) return;
        addon.planType = planType;
    }

    static variantStyle = css`
        :host([variant='product']) > slot:not([name='icons']) {
            display: block;
        }
        :host([variant='product']) slot[name='body-xs'] {
            min-height: var(--consonant-merch-card-product-body-xs-height);
            display: block;
        }
        :host([variant='product']) slot[name='heading-xs'] {
            min-height: var(--consonant-merch-card-product-heading-xs-height);
            display: block;
        }
        :host([variant='product']) slot[name='body-xxs'] {
            min-height: var(--consonant-merch-card-product-body-xxs-height);
            display: block;
        }
        :host([variant='product']) slot[name='promo-text'] {
            min-height: var(--consonant-merch-card-product-promo-text-height);
            display: block;
        }
        :host([variant='product']) slot[name='callout-content'] {
            min-height: var(
                --consonant-merch-card-product-callout-content-height
            );
            display: block;
        }
        :host([variant='product']) slot[name='addon'] {
            min-height: var(
                --consonant-merch-card-product-addon-height
            );
        }

        :host([variant='product']) ::slotted([slot='heading-xs']) {
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }
    `;
}
