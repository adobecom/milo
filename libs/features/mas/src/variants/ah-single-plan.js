import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './ah-single-plan.css.js';

const AEM_FRAGMENT_MAPPING = {
  mnemonics: { size: 's' },
  backgroundImage: { tag: 'div', slot: 'image' },
  title: { tag: 'h3', slot: 'heading-xs' },
  description: { tag: 'div', slot: 'body-xs' },
  prices: { tag: 'p', slot: 'price' },
  ctas: { slot: 'cta', size: 'S' },
  allowedColors: ['gray'],
};

export class AHSinglePlan extends VariantLayout {

  constructor(card) {
    super(card);
    this.card.spectrum = 'swc';
    this.updateComplete;
  }

  getGlobalCSS() {
    return CSS;
  }

  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return AEM_FRAGMENT_MAPPING;
  }

  renderLayout() {
    return html`
      <div class="content">
        <div class="header">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
        <slot name="price"></slot>
        <div class="footer">
          <slot name="cta"></slot>
        </div>
      </div>
      <slot name="image"></slot>
      <slot></slot>
    `;
  }

  static variantStyle = css`
    :host([variant='ah-single-plan']) {
        --merch-card-ah-single-plan-width: 460px;
        --merch-card-ah-single-plan-height: 206px;
        --merch-card-ah-single-plan-content-width: 245px;
        --merch-card-ah-single-plan-heading-color: rgba(44, 44, 44, 1);
        --merch-card-ah-single-plan-gray-background: rgba(248, 248, 248, 1);
        --merch-card-ah-single-plan-white-background: rgba(255, 255, 255, 1);
        --merch-card-ah-single-plan-text-color: rgba(19, 19, 19, 1);
        width: var(--merch-card-ah-single-plan-width);
        min-height: var(--merch-card-ah-single-plan-height);
        background-color: var(--merch-card-ah-single-plan-white-background);
        color: var(--merch-card-ah-single-plan-heading-color);
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        gap: 16px;
        overflow: hidden;
        padding: 12px !important;
        box-sizing: content-box !important;
        border: none;
    }
    
    :host([variant='ah-single-plan'][background-color='gray']) {
        background-color: var(--merch-card-ah-single-plan-gray-background);
    }

    :host([variant='ah-single-plan']) .content {
        display: flex;
        flex-direction: column;
        width: var(--merch-card-ah-single-plan-content-width);
    }

    :host([variant='ah-single-plan']) .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
        padding-bottom: 4px;
    }
    :host([variant='ah-single-plan']) ::slotted([slot='heading-xxxs']) {
        letter-spacing: normal;
        font-size: 12px;
        line-height: 18px;
        color: var(--merch-card-ah-single-plan-heading-color);
    }
    :host([variant='ah-single-plan']) ::slotted([slot='price']) {
        margin-left: var(--spacing-xs);
        display: flex;
        flex-direction: column;
        font-size: 12px;
        line-height: 18px;
        color: var(--merch-card-ah-single-plan-heading-color);
    }
    :host([variant='ah-single-plan']) .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }
    :host([variant='ah-single-plan']) ::slotted([slot='cta']) {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
        
    :host([variant='ah-single-plan']) ::slotted([slot='image']) {
        width: 199px;
        overflow: hidden;
    }

    :host([variant='ah-single-plan']) ::slotted([slot='image']) img {
        border-radius: 16px;
        object-fit: cover;
    }
  `;
}

customElements.define('ah-single-plan', AHSinglePlan);