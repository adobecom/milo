import { LitElement, html, css } from 'lit';
import { EVENT_TYPE_RESOLVED, SELECTOR_MAS_INLINE_PRICE } from './constants.js';

export default class MerchAddon extends LitElement {
    static properties = {
        planType: { type: String, attribute: 'plan-type', reflect: true },
        checked: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.planType = undefined;
        this.checked = false;
        this.updatePlanType = this.updatePlanType.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    getOsi(planType, offerType) {
      const offerTypeOptions = {
        'TRIAL': ['TRIAL'],
        'BASE': ['BASE', 'PROMOTION'],
        'PROMOTION': ['PROMOTION', 'BASE']
      };
      // Get the priority list for this offer type
      const priorityList = offerTypeOptions[offerType] || [offerType];
      // Build the selector by joining the options with comma
      const selector = priorityList
        .map(type => `p[data-plan-type="${planType}"] ${SELECTOR_MAS_INLINE_PRICE}[data-offer-type="${type}"]`)
        .join(', ');
      
      const el = this.querySelector(selector);
      return el?.dataset?.wcsOsi;
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener(EVENT_TYPE_RESOLVED, this.updatePlanType);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener(EVENT_TYPE_RESOLVED, this.updatePlanType);
    }

    updatePlanType(e) {
        if (e.target.tagName !== 'SPAN') return;
        const price = e.target;
        const offer = price?.value?.[0];
        if (!offer) return;
        price.setAttribute('data-offer-type', offer.offerType);
        price.closest('p').setAttribute('data-plan-type', offer.planType);
    }

    handleChange(e) {
        this.checked = e.target.checked;
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: { checked: this.checked },
                bubbles: true,
                composed: true,
            }),
        );
    }

    render() {
        return html`<input
                type="checkbox"
                id="addon-checkbox"
                part="checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
            <label for="addon-checkbox" part="label">
                <slot></slot>
            </label>`;
    }

    static styles = css`
        :host {
            display: flex;
            gap: 9px;
            align-items: start;
            cursor: pointer;
        }

        :host,
        label {
            cursor: pointer;
        }

        ::slotted(p[data-plan-type]) {
            display: none;
        }

        :host([plan-type='PUF']) ::slotted(p[data-plan-type='PUF']) {
            display: block;
        }

        :host([plan-type='ABM']) ::slotted(p[data-plan-type='ABM']) {
            display: block;
        }

        :host([plan-type='M2M']) ::slotted(p[data-plan-type='M2M']) {
            display: block;
        }
    `;
}

customElements.define('merch-addon', MerchAddon);
