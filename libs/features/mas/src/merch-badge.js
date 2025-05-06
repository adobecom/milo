import { LitElement, html, css } from 'lit';

export default class MerchBadge extends LitElement {
    static properties = {
        color: { type: String },
        variant: { type: String },
        backgroundColor: { type: String, attribute: 'background-color' },
        borderColor: { type: String, attribute: 'border-color' },
    };

    constructor() {
        super();
        this.color = '';
        this.variant = '';
        this.backgroundColor = '';
        this.borderColor = '';
        this.text = this.textContent;
    }

    connectedCallback() {
        if (this.variant === 'trial') {
            this.style.setProperty('--merch-badge-border', '1px solid var(--spectrum-global-color-green-500, #31A547)');
            this.style.setProperty('--merch-badge-background-color', 'transparent');
            this.style.setProperty('--merch-badge-color', 'var(--spectrum-global-color-green-700, #268E41)');
            this.style.setProperty('--merch-badge-padding', '8px 12px');
            this.style.setProperty('--merch-badge-border-radius', '4px');
            this.style.setProperty('--merch-badge-font-size', '14px');
        } else {
            if (this.borderColor && this.borderColor !== 'Transparent') {
                this.style.setProperty('--merch-badge-border', `1px solid var(--${this.borderColor})`);
            } else {
                this.style.setProperty('--merch-badge-border', `1px solid var(--${this.backgroundColor})`);
            }
            this.style.setProperty('--merch-badge-background-color', `var(--${this.backgroundColor})`);
            this.style.setProperty('--merch-badge-color', this.color);
            this.style.setProperty('--merch-badge-padding', '2px 10px 3px 10px');
            this.style.setProperty('--merch-badge-border-radius', '4px 0 0 4px');
            this.style.setProperty('--merch-badge-font-size', 'var(--consonant-merch-card-body-xs-font-size)');
        }
        this.textContent = '';
        super.connectedCallback();
    }

    render() {
        return html`<div class="${this.variant === 'trial' ? 'trial-badge' : 'plans-badge'}">
            ${this.text}
        </div>`;
    }

    static styles = css`
        :host {
            display: block;
            background-color: var(--merch-badge-background-color);
            color: var(--merch-badge-color, #000);
            padding: var(--merch-badge-padding);
            border-radius: var(--merch-badge-border-radius);
            font-size: var(--merch-badge-font-size);
            line-height: 21px;
            border: var(--merch-badge-border);
            position: relative;
            left: 1px;
        }

        .trial-badge {
            display: inline-flex;
            line-height: 1.3;
            max-width: fit-content;
        }
    `;
}

customElements.define('merch-badge', MerchBadge);
