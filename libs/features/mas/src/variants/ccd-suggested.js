import { html, css } from 'lit';
import { VariantLayout } from './variant-layout';
import { CSS } from './ccd-suggested.css.js';

const AEM_FRAGMENT_MAPPING = {
    mnemonics: { size: 'l' },
    subtitle: { tag: 'h4', slot: 'detail-s' },
    title: { tag: 'h3', slot: 'heading-xs' },
    prices: { tag: 'p', slot: 'price' },
    description: { tag: 'div', slot: 'body-xs' },
    ctas: { slot: 'cta', size: 'M' },
};

export class CCDSuggested extends VariantLayout {
    getGlobalCSS() {
        return CSS;
    }

    /* c8 ignore next 3 */
    get aemFragmentMapping() {
        return AEM_FRAGMENT_MAPPING;
    }

    renderLayout() {
        return html` <div style="${this.stripStyle}" class="body">
                <div class="header">
                    <div class="top-section">
                        <slot name="icons"></slot>
                        ${this.badge}
                    </div>
                    <div class="headings">
                        <slot name="detail-s"></slot>
                        <slot name="heading-xs"></slot>
                    </div>
                </div>
                <slot name="body-xs"></slot>
                <div class="footer">
                    <slot name="price"></slot>
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot></slot>`;
    }

    static variantStyle = css`
        :host([variant='ccd-suggested']) {
            --consonant-merch-card-background-color: var(--spectrum-gray-100);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --consonant-merch-card-border-color: var(--spectrum-gray-200);
            --mod-img-height: 38px;

            width: 305px;
            min-width: 305px;
            min-height: 205px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
            overflow: hidden;
        }

        :host([variant='ccd-suggested']:hover) {
          border-color: var(--spectrum-gray-300);
        }

        :host([variant='ccd-suggested']) .body {
            height: auto;
            padding: 20px;
            gap: 0;
        }

        :host([variant='ccd-suggested'].thin-strip) .body {
            padding: 20px 20px 20px 28px;
        }

        :host([variant='ccd-suggested']) .header {
            display: flex;
            flex-flow: wrap;
            place-self: flex-start;
            flex-wrap: nowrap;
        }

        :host([variant='ccd-suggested']) .headings {
            padding-inline-start: var(--consonant-merch-spacing-xxs);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
            place-self: center;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
            font-size: var(--consonant-merch-card-heading-xxs-font-size);
            line-height: var(--consonant-merch-card-heading-xxs-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='detail-m']) {
            line-height: var(--consonant-merch-card-detail-m-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
            color: var(--ccd-gray-700-dark);
            padding-top: 8px;
            flex-grow: 1;
        }

        :host([variant='ccd-suggested'].wide-strip)
            ::slotted([slot='body-xs']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='price']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='price']) {
            display: flex;
            align-items: center;
            color: var(--spectrum-gray-800, #f8f8f8);
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xs-line-height);
            min-width: fit-content;
        }

        :host([variant='ccd-suggested'])
            ::slotted([slot='price'])
            span.placeholder-resolved[data-template='priceStrikethrough'] {
            text-decoration: line-through;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='cta']) {
            display: flex;
            align-items: center;
            min-width: fit-content;
        }

        :host([variant='ccd-suggested']) .footer {
            display: flex;
            justify-content: space-between;
            flex-grow: 0;
            margin-top: 6px;
            align-items: center;
        }

        :host([variant='ccd-suggested']) div[class$='-badge'] {
            position: static;
            border-radius: 4px;
        }

        :host([variant='ccd-suggested']) .top-section {
            align-items: center;
        }
    `;
}
