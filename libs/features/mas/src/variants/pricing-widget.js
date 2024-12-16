import { html, css } from 'lit';
import { VariantLayout } from './variant-layout';
import { CSS } from './pricing-widget.css.js';

const AEM_FRAGMENT_MAPPING = {
  mnemonics: { size: 's' },
  title: { tag: 'h3', slot: 'heading-xxxs' },
  description: { tag: 'div', slot: 'body-xxs' },
  prices: { tag: 'p', slot: 'price' },
  ctas: { slot: 'cta', size: 'S' },
};

export class PricingWidget extends VariantLayout {

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
    :host([variant='pricing-widget']) {
        width: var(--merch-card-pricing-widget-width);
        min-height: var(--merch-card-pricing-widget-height);
        background-color: var(--spectrum-gray-50);
        color: var(--spectrum-gray-800);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 12px;
        box-sizing: content-box !important;
        border: none;
    }

    :host([variant='pricing-widget'][size='gray']) {
        background-color: var(--spectrum-gray-100);
    }

    :host([variant='pricing-widget']) .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
        padding-bottom: 4px;
    }

    :host([variant='pricing-widget']) ::slotted([slot='heading-xxxs']) {
        letter-spacing: normal;
        font-size: 12px;
        line-height: 18px;
        color: var(--spectrum-gray-800);
    }

    :host([variant='pricing-widget']) ::slotted([slot='price']) {
        margin-left: var(--spacing-xs);
        display: flex;
        flex-direction: column;
        font-size: 12px;
        line-height: 18px;
        color: var(--spectrum-gray-800);
    }

    :host([variant='pricing-widget']) .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
    }

    :host([variant='pricing-widget']) ::slotted([slot='cta']) {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }
  `;
}

customElements.define('pricing-widget', PricingWidget);
