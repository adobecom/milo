import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './ah-pricing-widget.css.js';

const AEM_FRAGMENT_MAPPING = {
  mnemonics: { size: 's' },
  title: { tag: 'h3', slot: 'heading-xxxs' },
  description: { tag: 'div', slot: 'body-xxs' },
  prices: { tag: 'p', slot: 'price' },
  ctas: { slot: 'cta', size: 'S' },
  allowedColors: ['gray'],
};

export class AHPricingWidget extends VariantLayout {
  
  getGlobalCSS() {
    return CSS;
  }

  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return AEM_FRAGMENT_MAPPING;
  }

  renderLayout() {
    return html`
        <div class="header">
    		    <slot name="icons"></slot>
            <slot name="heading-xxxs"></slot>
        </div>
        <slot name="body-xxs"></slot>
        <slot name="price"></slot>
        <div class="footer">
          <slot name="cta"></slot>
        </div>
      <slot></slot>
    `;
  }

  static variantStyle = css`
    :host([variant='ah-pricing-widget']) {
        --merch-card-ah-pricing-widget-width: 132px;
        --merch-card-ah-pricing-widget-height: 212px;
        --merch-card-ah-pricing-widget-gray-background: rgba(248, 248, 248);
        --merch-card-ah-pricing-widget-text-color: rgba(19, 19, 19);
        width: var(--merch-card-ah-pricing-widget-width);
        min-height: var(--merch-card-ah-pricing-widget-height);
        background-color: var(--consonant-merch-card-background-color);
        color: var(--consonant-merch-card-heading-xxxs-color);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 12px !important;
        box-sizing: content-box !important;
        border: none;
    }

    :host([variant='ah-pricing-widget'][background-color='gray']) {
        background-color: var(--merch-card-ah-pricing-widget-gray-background);
    }

    :host([variant='ah-pricing-widget']) .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
        padding-bottom: 4px;
    }


    :host([variant='ah-pricing-widget']) ::slotted([slot='price']) {
        margin-left: var(--spacing-xs);
        display: flex;
        flex-direction: column;
        font-size: var(--consonant-merch-card-detail-s-font-size);
        line-height: var(--consonant-merch-card-detail-s-line-height);
        color: var(--consonant-merch-card-heading-xxxs-color);
        gap: 4px;
    }

    :host([variant='ah-pricing-widget']) .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }

    :host([variant='ah-pricing-widget']) ::slotted([slot='cta']) {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
  `;
}

customElements.define('ah-pricing-widget', AHPricingWidget);
