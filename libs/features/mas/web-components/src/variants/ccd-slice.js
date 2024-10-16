import { VariantLayout } from './variant-layout.js';
import { html, css } from 'lit';
import { CSS } from './ccd-slice.css.js';

const AEM_FRAGMENT_MAPPING = {
    backgroundImage: { tag: 'div', slot: 'image' },
    description: { tag: 'div', slot: 'body-s' },
    ctas: { size: 's' },
    allowedSizes: ['wide'],
};

export class CCDSlice extends VariantLayout {
    getGlobalCSS() {
        return CSS;
    }

    /* c8 ignore next 3 */
    get aemFragmentMapping() {
        return AEM_FRAGMENT_MAPPING;
    }

    renderLayout() {
        return html` <div class="content">
                <div class="top-section">
                  <slot name="icons"></slot> 
                  ${this.badge}
                </div>  
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`;
    }

    static variantStyle = css`
        :host([variant='ccd-slice']) {
            width: var(--consonant-merch-card-ccd-slice-single-width);
            background-color: var(
              --spectrum-gray-50, #fff);
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: var(--consonant-merch-card-ccd-slice-wide-width);
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: var(--consonant-merch-spacing-xs);
            padding-inline-end: 0;
            width: 154px;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            flex: 1 0 0;
        }

        :host([variant='ccd-slice'])
            ::slotted([slot='body-s'])
            ::slotted(a:not(.con-button)) {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            font-style: normal;
            font-weight: 400;
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            text-decoration-line: underline;
            color: var(--merch-color-grey-80);
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: var(--consonant-merch-card-ccd-slice-background-img-size);
            height: var(--consonant-merch-card-ccd-slice-background-img-size);
            overflow: hidden;
            border-radius: 50%;
            padding: var(--consonant-merch-spacing-xs);
            align-self: center;
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) img {
            overflow: hidden;
            border-radius: 50%;
            width: inherit;
            height: inherit;
        }

        :host([variant='ccd-slice']) div[class$='-badge'] {
            position: static;
            border-radius: 4px;
        }

        :host([variant='ccd-slice']) .top-section {
            align-items: center;
        }
    `;
}
