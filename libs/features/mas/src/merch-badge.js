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
    }

    connectedCallback() {
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
        if (this.variant === 'plans') {
            this.style.setProperty('border-right', 'none');
        }
        super.connectedCallback();
    }

    render() {
        return html`<div class="plans-badge">
            ${this.textContent}
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
        }
    `;
}

customElements.define('merch-badge', MerchBadge);
