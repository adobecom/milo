import { html, LitElement, css } from 'lit';
import { deeplink, pushStateFromComponent } from '../deeplink.js';
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
        .checkbox-group {
            display: flex;
            flex-direction: column;
        }
    `;

    constructor() {
      super();
      this.selectedValues = [];
    }

    /**
     * leaf level item change handler
     * @param {*} event
     */
    selectionChanged({ target }) {
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

    addGroupTitle() {
        const id = 'sidenav-checkbox-group-title';
        const h3El = createTag('h3', { id });
        h3El.textContent = this.sidenavCheckboxTitle;
        this.prepend(h3El);

        [...this.children].forEach((el) => {
          if (el.id && el.id !== id) {
                el.setAttribute('role', 'group');
                el.setAttribute('aria-labelledby', id);
            }
        });
    }

    startDeeplink() {
      this.stopDeeplink = deeplink(
          ({ types }) => {
              if (types) {
                const newTypes = types.split(',');
                [...new Set([...newTypes, ...this.selectedValues])].forEach(name => {
                  const checkbox = this.querySelector(`sp-checkbox[name=${name}]`)
                  if (checkbox) checkbox.checked = newTypes.includes(name);
                });
                this.selectedValues = newTypes;
              } else {
                this.selectedValues.forEach(name => {
                  const checkbox = this.querySelector(`sp-checkbox[name=${name}]`)
                  if (checkbox) checkbox.checked = false;
                });
                this.selectedValues = [];
              }
          },
      );
    }

    connectedCallback() {
        super.connectedCallback();
        this.updateComplete.then(async () => {
            this.addGroupTitle();
            this.startDeeplink();
        });
    }

    disconnectedCallback() {
      this.stopDeeplink?.();
    }

    render() {
        return html`<div aria-label="${this.label}">
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
