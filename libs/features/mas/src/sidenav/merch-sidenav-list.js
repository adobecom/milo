import { html, LitElement, css } from 'lit';
import { deeplink, pushStateFromComponent } from '../deeplink.js';
import { headingStyles } from './merch-sidenav-heading.css.js';
import { debounce } from '../utils';
import { EVENT_MERCH_SIDENAV_SELECT } from '../constants.js';
export class MerchSidenavList extends LitElement {
    static properties = {
        sidenavListTitle: { type: String },
        label: { type: String },
        deeplink: { type: String, attribute: 'deeplink' },
        selectedText: {
            type: String,
            reflect: true,
            attribute: 'selected-text',
        },
        selectedValue: {
            type: String,
            reflect: true,
            attribute: 'selected-value',
        },
    };

    static styles = [
        css`
            :host {
                display: block;
                contain: content;
                padding-top: 16px;
            }
            .right {
                position: absolute;
                right: 0;
            }

            ::slotted(sp-sidenav.resources) {
                --mod-sidenav-item-background-default-selected: transparent;
                --mod-sidenav-content-color-default-selected: var(
                    --highcontrast-sidenav-content-color-default,
                    var(
                        --mod-sidenav-content-color-default,
                        var(--spectrum-sidenav-content-color-default)
                    )
                );
            }
        `,
        headingStyles,
    ];

    constructor() {
        super();
        this.handleClickDebounced = debounce(this.handleClick.bind(this));
    }

    selectElement(element, selected = true) {
        if (element.parentNode.tagName === 'SP-SIDENAV-ITEM') {
            this.selectElement(element.parentNode, false);
        }
        if (selected) {
            this.selectedElement = element;
            this.selectedText = element.label;
            this.selectedValue = element.value;
            setTimeout(() => {
                element.selected = true;
            }, 1);
            this.dispatchEvent(
                new CustomEvent(EVENT_MERCH_SIDENAV_SELECT, {
                    bubbles: true,
                    composed: true,
                    detail: {
                        type: 'sidenav',
                        value: this.selectedValue,
                        elt: this.selectedElement,
                    },
                }),
            );
        }
    }

    /**
     * click handler to manage first level items state of sidenav
     * @param {*} param
     */
    handleClick({ target: item }, shouldUpdateHash = true) {
        const { value, parentNode } = item;
        this.selectElement(item);
        if (parentNode?.tagName === 'SP-SIDENAV') {
            //swc does not consider, in multilevel, first level as a potential selection
            //and does not close other parents, we'll do that here
            item.selected = true;
            parentNode
                .querySelectorAll(
                    'sp-sidenav-item[expanded],sp-sidenav-item[selected]',
                )
                .forEach((item) => {
                    if (item.value !== value) {
                        item.expanded = false;
                        item.selected = false;
                    }
                });
        } else if (parentNode?.tagName === 'SP-SIDENAV-ITEM') {
          const topLevelItems = parentNode.closest('sp-sidenav')?.querySelectorAll(':scope > sp-sidenav-item');
          [...topLevelItems].filter((item) => item !== parentNode).forEach((item) => {
              item.expanded = false;
          });
          parentNode.closest('sp-sidenav')?.querySelectorAll('sp-sidenav-item[selected]')
              .forEach((item) => {
                  if (item.value !== value) {
                      item.selected = false;
                  }
              });
        }
        if (shouldUpdateHash) {
            pushStateFromComponent(this, value);
        }
    }

    /**
     * leaf level item selection handler
     * @param {*} event
     */
    selectionChanged({ target: { value, parentNode } }) {
        this.selectElement(
            this.querySelector(`sp-sidenav-item[value="${value}"]`),
        );
        pushStateFromComponent(this, value);
    }

    startDeeplink() {
      this.stopDeeplink = deeplink(
          (params) => {
              const value = params[this.deeplink] ?? 'all';
              const element = this.querySelector(
                  `sp-sidenav-item[value="${value}"]`,
              );
              if (!element) return;
              this.updateComplete.then(() => {
                  if (element.firstElementChild?.tagName === 'SP-SIDENAV-ITEM') {
                    element.expanded = true;
                  } 
                  if (element.parentNode?.tagName === 'SP-SIDENAV-ITEM') {
                    element.parentNode.expanded = true;
                  }
                  this.handleClick({ target: element }, !!window.location.hash.includes('category'));
              });
          },
      );
  }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('click', this.handleClickDebounced);
        this.updateComplete.then(() => {
            if (!this.deeplink) return;
            this.startDeeplink();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('click', this.handleClickDebounced);
        this.stopDeeplink?.();
    }

    render() {
        return html`<div
            aria-label="${this.label}"
            @change="${(e) => this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle ? html`<h2>${this.sidenavListTitle}</h2>` : ''}
            <slot></slot>
        </div>`;
    }
}

customElements.define('merch-sidenav-list', MerchSidenavList);
