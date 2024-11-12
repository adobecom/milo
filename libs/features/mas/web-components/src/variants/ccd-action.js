import { VariantLayout } from './variant-layout.js';
import { html, css } from 'lit';
import { CSS } from './ccd-action.css.js';

const AEM_FRAGMENT_MAPPING = {
    title: { tag: 'h3', slot: 'heading-xs' },
    prices: { tag: 'h3', slot: 'heading-xs' },
    description: { tag: 'div', slot: 'body-xs' },
    ctas: { slot: 'footer', size: 'l' },
};

export class CCDAction extends VariantLayout {
    constructor(card) {
        super(card);
    }

    getGlobalCSS() {
        return CSS;
    }

    get aemFragmentMapping() {
        return AEM_FRAGMENT_MAPPING;
    }

    // This variant might go away, will not implement code coverage for now.
    /* c8 ignore next 15 */
    renderLayout() {
        return html` <div class="body">
            <slot name="icons"></slot> ${this.badge}
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            ${this.promoBottom
                ? html`<slot name="body-xs"></slot
                      ><slot name="promo-text"></slot>`
                : html`<slot name="promo-text"></slot
                      ><slot name="body-xs"></slot>`}
            <footer><slot name="footer"></slot></footer>
            <slot></slot>
        </div>`;
    }
    static variantStyle = css`
        :host([variant='ccd-action']:not([size])) {
            width: var(--consonant-merch-card-ccd-action-width);
        }
    `;
}
