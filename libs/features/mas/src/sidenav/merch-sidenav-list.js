import { html, LitElement, css, nothing } from 'lit';
import { deeplink, pushStateFromComponent } from '../deeplink.js';
import { debounce, updateHash, paramsToHash } from '../utils.js';
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
        toggleIconColor: {
            type: Boolean,
            attribute: 'toggle-icon-color'
        }
    };

    static styles = css`
        :host {
            display: block;
            contain: content;
            margin-top: var(--merch-sidenav-list-gap);
        }

        :host h2 {
            color: var(--merch-sidenav-list-title-color);
            font-size: var(--merch-sidenav-list-title-font-size);
            font-weight: var(--merch-sidenav-list-title-font-weight);
            padding: var(--merch-sidenav-list-title-padding);
            line-height: var(--merch-sidenav-list-title-line-height);
            margin: 0;
        }

        .right {
            position: absolute;
            right: 0;
        }
    `;

    constructor() {
        super();
        this.toggleIconColor = false;
        this.handleClickDebounced = debounce(this.handleClick.bind(this));
    }

    selectElement(element, selected = true) {
        element.selected = selected;
        if (element.parentNode.tagName === 'SP-SIDENAV-ITEM') {
            this.selectElement(element.parentNode, false);
        }
        const selectionElement = element.querySelector('.selection');
        selectionElement?.setAttribute('selected', selected);
        const selection = selectionElement?.dataset;
        const iconSrc = (selected && this.toggleIconColor) ? selection?.light : selection?.dark;
        if (iconSrc) {
          element.querySelector('img')?.setAttribute('src', iconSrc);
        }
        if (selected) {
            this.selectedElement = element;            
            this.selectedText = selection?.selectedText || element.label;
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

    markCurrentItem(element) {
        const sidenav = element.closest('sp-sidenav');
        if (!sidenav) return;
        sidenav.querySelectorAll('sp-sidenav-item[aria-current]').forEach((currentItem) => {
            currentItem.removeAttribute('aria-current');
        });
        element.setAttribute('aria-current', 'true');
    }

    /**
     * click handler to manage first level items state of sidenav
     * @param {*} param
     */
    handleClick({ target: item }, shouldUpdateHash = true) {
        const { value, parentNode } = item;
        this.selectElement(item);
        this.markCurrentItem(item);
        if (parentNode?.tagName === 'SP-SIDENAV') {
            //swc does not consider, in multilevel, first level as a potential selection
            //and does not close other parents, we'll do that here          
            parentNode
                .querySelectorAll('sp-sidenav-item[expanded],sp-sidenav-item[selected]')
                .forEach((item) => {
                    if (item.value !== value) {
                        item.expanded = false;
                        item.removeAttribute('aria-expanded');
                        this.selectElement(item, false);
                    }
                });
            //additional call to disable previous selection settings
            parentNode.querySelectorAll('.selection[selected=true]')
            .forEach((selection) => {
                const item = selection.parentElement;
                if (item.value !== value) {
                    this.selectElement(item, false);
                }
            });
        } else if (parentNode?.tagName === 'SP-SIDENAV-ITEM') {
          const topLevelItems = parentNode.closest('sp-sidenav')?.querySelectorAll(':scope > sp-sidenav-item');
          [...topLevelItems].filter((item) => item !== parentNode).forEach((item) => {
              item.expanded = false;
              item.removeAttribute('aria-expanded');
          });
          parentNode.closest('sp-sidenav')?.querySelectorAll('sp-sidenav-item[selected]')
              .forEach((item) => {
                  if (item.value !== value) {
                      this.selectElement(item, false);
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
    selectionChanged(event) {
        const { target: { value, parentNode } } = event;
        this.selectElement(
            this.querySelector(`sp-sidenav-item[value="${value}"]`),
        );
        pushStateFromComponent(this, value);
    }

    startDeeplink() {
      this.stopDeeplink = deeplink(
          (params) => {
              const value = params[this.deeplink] ?? 'all';
              let element = this.querySelector(
                  `sp-sidenav-item[value="${value}"]`,
              )
              // fallback for invalid filter
              if (!element) {
                element = this.querySelector('sp-sidenav-item:first-child');
                updateHash(this.deeplink, element.value);
              }

              this.updateComplete.then(() => {
                  if (element.firstElementChild?.tagName === 'SP-SIDENAV-ITEM') {
                    element.expanded = true;
                    element.setAttribute('aria-expanded', 'true');
                  } 
                  if (element.parentNode?.tagName === 'SP-SIDENAV-ITEM') {
                    element.parentNode.expanded = true;
                    element.parentNode.setAttribute('aria-expanded', 'true');
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
            paramsToHash(['filter', 'single_app']);
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
            ${this.sidenavListTitle ? html`<h2>${this.sidenavListTitle}</h2>` : nothing}
            <slot></slot>
        </div>`;
    }
}

customElements.define('merch-sidenav-list', MerchSidenavList);
