import { html, css } from 'lit';
import { VariantLayout } from './variant-layout.js';
import { CSS } from './ah-try-buy-widget.css.js';
import MatchMediaController from '../match-media-controller.js';
import { MOBILE_LANDSCAPE } from '../media.js';

const AEM_FRAGMENT_MAPPING = {
  mnemonics: { size: 's' },
  title: { tag: 'h3', slot: 'heading-xxxs', maxCount: 40 },
  description: { tag: 'div', slot: 'body-xxs', maxCount: 200 },
  prices: { tag: 'p', slot: 'price' },
  ctas: { slot: 'cta', size: 'S' },
  backgroundImage: { tag: 'div', slot: 'image' },
  allowedColors: ['gray'],
  size: ['single', 'double']
};

export class AHTryBuyWidget extends VariantLayout {
  getGlobalCSS() {
    return CSS;
  }

  #mobile = new MatchMediaController(this.card, MOBILE_LANDSCAPE);

  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return AEM_FRAGMENT_MAPPING;
  }



  renderLayout() {
    return html`
      <div class="content">
        <div class="header">
    		    <slot name="icons"></slot>
            <slot name="heading-xxxs"></slot>
        </div>
        <slot name="body-xxs"></slot>
        <slot name="price"></slot>
      </div>
      <slot></slot>
    `;
  }

  static variantStyle = css`
    :host([variant='ah-try-buy-widget']) {
        --merch-card-ah-try-buy-widget-min-width: 132px;
        --merch-card-ah-try-buy-widget-max-width: 132px;
        --merch-card-ah-try-buy-widget-content-min-width: 132px;
        --merch-card-ah-try-buy-widget-content-max-width: 245px;
        --merch-card-ah-try-buy-widget-height: 206px;
        --merch-card-ah-try-buy-widget-header-min-height: 36px;
        --merch-card-ah-try-buy-widget-gray-background: rgba(248, 248, 248);
        --merch-card-ah-try-buy-widget-text-color: rgba(19, 19, 19);
        --merch-card-ah-try-buy-widget-price-line-height: 17px;
        --merch-card-ah-try-buy-widget-outline: transparent;
        min-width: var(--merch-card-ah-try-buy-widget-min-width);
        max-width: var(--merch-card-ah-try-buy-widget-max-width);
        min-height: var(--merch-card-ah-try-buy-widget-height);
        background-color: var(--consonant-merch-card-background-color);
        color: var(--consonant-merch-card-heading-xxxs-color);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 12px !important;
        gap: 16px;
        box-sizing: content-box !important;
        border: none;
        outline: 1px solid var(--merch-card-ah-try-buy-widget-outline);
        justify-content: space-between;
    }

    :host([variant='ah-try-buy-widget'][size='single']) {
        --merch-card-ah-try-buy-widget-max-width: 460px;
        max-height: 230px;
        flex-direction: column;
        flex-wrap: wrap;
    }

    :host([variant='ah-try-buy-widget'][size='single']) ::slotted(div[slot="cta"])  {
        display: flex;
        flex-grow: 0;
    }

    :host([variant='ah-try-buy-widget'][size='double']) {
        --merch-card-ah-try-buy-widget-max-width: 214px;
    }

    :host([variant='ah-try-buy-widget'][background-color='gray']) {
        background-color: var(--merch-card-ah-try-buy-widget-gray-background);
    }

    :host([variant='ah-try-buy-widget']) .content {
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        justify-content: flex-start;
        min-width: var(--merch-card-ah-try-buy-widget-content-min-width);
        max-width: var(--merch-card-ah-try-buy-widget-content-max-width);
        flex-basis: var(--merch-card-ah-try-buy-widget-content-min-width);
        flex-grow: 1;
    }

    :host([variant='ah-try-buy-widget']) .header {
        display: flex;
        min-height: var(--merch-card-ah-try-buy-widget-header-min-height);
        flex-direction: row;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
        margin-bottom: 4px;
    }


    :host([variant='ah-try-buy-widget']) ::slotted([slot='price']) {
        margin-left: var(--spacing-xs);
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: end;
        font-size: var(--consonant-merch-card-detail-s-font-size);
        font-style: italic;
        line-height: var(--merch-card-ah-try-buy-widget-price-line-height);
        color: var(--consonant-merch-card-heading-xxxs-color);
    }

    :host([variant='ah-try-buy-widget']) .footer {
      display: flex;
      width: fit-content;
      flex-wrap: wrap;
      gap: 8px;
      flex-direction: row;
    }

    :host([variant='ah-try-buy-widget']) .footer .spectrum-Button-label {
        height: 16px;
        padding-block: 2px;
        white-space: nowrap;
    }

    :host([variant='ah-try-buy-widget'][size='single']) .image {
      display: flex;
      width: 199px;
      overflow: hidden;
      height: 100%;
      order: 1;
    }

    :host([variant='ah-try-buy-widget']) .image {
        display: none;
    }

    :host([variant='ah-try-buy-widget']) .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
        overflow: hidden;
    }

    :host([variant='ah-try-buy-widget']) ::slotted(.spectrum-Button--primary) {
        background-color: var(--spectrum-primary-color, #1473E6);
        color: white;
    }

    :host([variant='ah-try-buy-widget']) ::slotted(.spectrum-Button--secondary) {
        background-color: var(--spectrum-secondary-color, #E5E5E5);
        color: black;
    }
  `;
}

customElements.define('ah-try-buy-widget', AHTryBuyWidget);
