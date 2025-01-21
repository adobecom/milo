import { html, LitElement, css } from 'lit';
import { parseState, pushStateFromComponent } from '../deeplink.js';
import { createTag } from '../utils.js';

export class MerchSidenavCheckboxGroup extends LitElement {
    static properties = {
        sidenavCheckboxTitle: { type: String },
        label: { type: String },
        deeplink: { type: String },
        selectedValues: { type: Array, reflect: true },
        value: { type: String },
    };

    static styles = css`
        :host {
            display: block;
            contain: content;
            border-top: 1px solid var(--color-gray-200);
            padding: 12px;
        }
        h3 {
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            height: 32px;
            letter-spacing: 0px;
            padding: 0px;
            line-height: 18.2px;
            color: var(--color-gray-600);
            margin: 0px;
        }
        .checkbox-group {
            display: flex;
            flex-direction: column;
        }
    `;

    /*
     * set the state of the sidenav based on the URL
     */
    setStateFromURL() {
        this.selectedValues = [];
        const { types: state } = parseState();
        if (state) {
            this.selectedValues = state.split(',');
            this.selectedValues.forEach((name) => {
                const element = this.querySelector(`sp-checkbox[name=${name}]`);
                if (element) {
                    element.checked = true;
                }
            });
        }
    }

    /**
     * leaf level item change handler
     * @param {*} event
     */
    selectionChanged(event) {
        const { target } = event;
        const name = target.getAttribute('name');
        if (name) {
            const index = this.selectedValues.indexOf(name);
            if (target.checked && index === -1) {
                this.selectedValues.push(name);
            } else if (!target.checked && index >= 0) {
                this.selectedValues.splice(index, 1);
            }
        }
        pushStateFromComponent(this, this.selectedValues.join(','));
    }

    addAccessibilityAttributes() {
        const id = 'sidenav-checkbox-group-title';
        const groupIdEl = createTag('div', { class: 'invisible-and-shrank', id });
        groupIdEl.textContent = this.sidenavCheckboxTitle;
        this.append(groupIdEl);
        this.querySelectorAll('sp-checkbox').forEach((checkboxEl) => {
            checkboxEl.setAttribute('role', 'group');
            checkboxEl.setAttribute('aria-labelledby', id);
        });
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateComplete.then(async () => {
            this.setStateFromURL();
            this.addAccessibilityAttributes();
        });
    }

    render() {
        return html`<div aria-label="${this.label}">
            <h3>${this.sidenavCheckboxTitle}</h3>
            <div
                @change="${(e) => this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`;
    }
}

customElements.define(
    'merch-sidenav-checkbox-group',
    MerchSidenavCheckboxGroup,
);
