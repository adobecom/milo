import { VariantLayout } from './variant-layout.js';
import { css, html } from 'lit';
import { SELECTOR_MAS_INLINE_PRICE } from '../constants.js';
import { CSS } from './mini.css.js';

export const MINI_AEM_FRAGMENT_MAPPING = {
    title: { tag: 'p', slot: 'title' },
    prices: { tag: 'p', slot: 'prices' },
    description: {
        tag: 'p',
        slot: 'description',
    },
    planType: true,
    ctas: { slot: 'ctas', size: 'S' },
};

/**
 * This variant is a headless data source for rendering by consumers using their own stack such as React...
 */
export class Mini extends VariantLayout {
    legal = undefined;

    async postCardUpdateHook() {
        await this.card.updateComplete;
        this.adjustLegal();
    }

    getGlobalCSS() {
        return CSS;
    }

    get headingSelector() {
        return '[slot="title"]';
    }

    priceOptionsProvider(element, options) {
        // accessibility texts are not needed as part of price text
        options.literals = {
            ...options.literals,
            strikethroughAriaLabel: '',
            alternativePriceAriaLabel: '',
        };
        options.space = true;
        options.displayAnnual = this.card.settings?.displayAnnual ?? false;
    }

    adjustLegal() {
        if (this.legal !== undefined) return;
        const price = this.card.querySelector(
            `${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`,
        );
        if (!price) return;
        const legal = price.cloneNode(true);
        this.legal = legal;
        price.dataset.displayTax = 'false';
        legal.dataset.template = 'legal';
        legal.dataset.displayPlanType =
            this.card?.settings?.displayPlanType ?? true;
        legal.setAttribute('slot', 'legal');
        this.card.appendChild(legal);
    }

    renderLayout() {
        return html`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `;
    }

    static variantStyle = css`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--consonant-merch-card-border-color, #dadada);
        }
    `;
}
