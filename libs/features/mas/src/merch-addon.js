import { LitElement, html, css } from 'lit';
import { EVENT_TYPE_RESOLVED, SELECTOR_MAS_INLINE_PRICE } from './constants.js';

export default class MerchAddon extends LitElement {
    static properties = {
        planType: { type: String, attribute: 'plan-type', reflect: true },
        checked: { type: Boolean, reflect: true },
        customCheckbox: { type: Boolean, attribute: 'custom-checkbox', reflect: true }
    };

    constructor() {
        super();
        this.planType = undefined;
        this.checked = false;
        this.updatePlanType = this.updatePlanType.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCustomClick = this.handleCustomClick.bind(this);
    }

    getOsi(planType, offerType) {
      const offerTypeOptions = {
        'TRIAL': ['TRIAL'],
        'BASE': ['BASE', 'PROMOTION', 'TRIAL'],
        'PROMOTION': ['PROMOTION', 'BASE', 'TRIAL']
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

    handleCustomClick() {
        const addonCheckbox = this.shadowRoot.querySelector('input');
        addonCheckbox.click();
    }

    handleKeyDown(e) {
        if (e.key === ' ') {
            e.preventDefault();
            this.handleCustomClick();
        }
    }

    render() {
        return html`
            <input
                type="checkbox"
                id="addon-checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
            <span 
                role="checkbox" 
                aria-checked=${this.checked} 
                tabindex="0" 
                aria-labelledby="custom-checkbox-label" 
                id="custom-checkbox" 
                @click=${this.handleCustomClick}
                @keydown=${this.handleKeyDown}>
            </span>
            <label id="custom-checkbox-label" for="addon-checkbox">
                <slot></slot>
            </label>`;
    }

    static styles = css`
        :host {
            --merch-addon-gap: 9px;
            --merch-addon-align: start;
            --merch-addon-checkbox-size: unset;
            --merch-addon-checkbox-border: unset;
            --merch-addon-checkbox-radius: unset;
            --merch-addon-checkbox-checked-bg: unset;
            --merch-addon-checkbox-checked-color: unset;
            --merch-addon-label-size: unset;
            --merch-addon-label-color: unset;
            --merch-addon-label-line-height: unset;
            display: flex;
            gap: var(--merch-addon-gap);
            align-items: var(--merch-addon-align);
            cursor: pointer;
        }

        :host([custom-checkbox]) #addon-checkbox {
            display: none;
        }

        :host([custom-checkbox]) #custom-checkbox {
            display: block;
        }

        :host #custom-checkbox {
            display: none;
            width: var(--merch-addon-checkbox-size);
            height: var(--merch-addon-checkbox-size);
            border: var(--merch-addon-checkbox-border);
            border-radius: var(--merch-addon-checkbox-radius);
            box-sizing: border-box;
        }

        :host #addon-checkbox:checked + #custom-checkbox {
            background: var(--merch-addon-checkbox-checked-bg) no-repeat var(--merch-addon-checkbox-checked-color);
            border-color: var(--merch-addon-checkbox-checked-color);
        }

        ::slotted(p:not([data-plan-type])) {
            color: var(--merch-addon-label-color);
            font-size: var(--merch-addon-label-size);
            line-height: var(--merch-addon-label-line-height);
            font-style: normal;
            font-weight: 400;
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
