import { html, css, LitElement, nothing } from 'lit';
import { MatchMediaController } from '@spectrum-web-components/reactive-controllers/src/MatchMedia.js';
import '../merch-search.js';
import './merch-sidenav-list.js';
import './merch-sidenav-checkbox-group.js';
import { SPECTRUM_MOBILE_LANDSCAPE, TABLET_DOWN } from '../media.js';
import { EVENT_MERCH_SIDENAV_SELECT } from '../constants.js';

const SEARCH_SIZE = {
    catalog: 'l'
};

const CHECKBOX_SIZE = {
    catalog: 'xl'
};

export class MerchSideNav extends LitElement {
    static properties = {
        sidenavTitle: { type: String },
        closeText: { type: String, attribute: 'close-text' },
        modal: { type: Boolean, reflect: true },
        open: { type: Boolean, state: true, reflect: true },
        autoclose: { type: Boolean, attribute: 'autoclose', reflect: true }
    };

    constructor() {
        super();
        this.open = false;
        this.autoclose = false;
        this.variant = null;
        this.closeModal = this.closeModal.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener(EVENT_MERCH_SIDENAV_SELECT, this.handleSelection);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener(EVENT_MERCH_SIDENAV_SELECT, this.handleSelection);
    }

    firstUpdated() {
        /* Adjust search size */
        const searchSize = SEARCH_SIZE[this.variant];
        if (searchSize) {
            const search = this.querySelector('merch-search sp-search');
            search.setAttribute('size', searchSize);
        }

        /* Adjust checkboxes size */
        const checkboxSize = CHECKBOX_SIZE[this.variant];
        if (checkboxSize) {
            const checkboxes = this.querySelectorAll('merch-sidenav-checkbox-group sp-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.setAttribute('size', checkboxSize);
            });
        }
    }

    updated() {
        if (this.mobileAndTablet.matches) {
            this.modal = true;
            this.style.padding = 0;
            this.style.margin = 0;
        }
        else {
            this.modal = false;
            this.style.removeProperty('padding');
            this.style.removeProperty('margin');
            if (this.open) this.closeModal();
        }
    }

    mobileDevice = new MatchMediaController(this, SPECTRUM_MOBILE_LANDSCAPE);
    mobileAndTablet = new MatchMediaController(this, TABLET_DOWN);

    get filters() {
        return this.querySelector('merch-sidenav-list');
    }

    get search() {
        return this.querySelector('merch-search');
    }

    render() {
        return this.mobileAndTablet.matches ? this.asDialog : this.asAside;
    }

    get asDialog() {
        if (!this.open) return nothing;
        const closeButton = !this.autoclose ? 
            html`<sp-link @click="${this.closeModal}"
                >${this.closeText || 'Close'}</sp-link
            >` : nothing;
        return html`
            <sp-theme color="light" scale="medium">
                <sp-overlay type="modal" open @sp-closed=${this.closeModal}>
                    <sp-dialog-base
                        dismissable
                        underlay
                        no-divider
                        @close=${this.closeModal}
                    >
                        <div id="content">
                            <div id="sidenav">
                                <div>
                                    <h2>${this.sidenavTitle}</h2>
                                    <slot></slot>
                                </div>
                                ${closeButton}
                            </div>
                        </div>
                    </sp-dialog-base>
                </sp-overlay>
            </sp-theme>
        `;
    }

    get asAside() {
        return html`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`;
    }

    get dialog() {
        return this.shadowRoot.querySelector('sp-dialog-base');
    }
    
    handleSelection() {
        if (this.autoclose) 
            this.closeModal();
    }

    closeModal() {
        this.open = false;
        document.querySelector('body')?.classList.remove('merch-modal');
    }

    showModal() {
        this.open = true;
        document.querySelector('body')?.classList.add('merch-modal');
    }

    static styles = css`
        :host {
            --merch-sidenav-padding: 16px;
            --merch-sidenav-collection-gap: 30px;
            /* Title */
            --merch-sidenav-title-font-size: 12px;
            --merch-sidenav-title-font-weight: 400;
            --merch-sidenav-title-line-height: 16px;
            --merch-sidenav-title-color: var(--spectrum-gray-700, #464646);
            --merch-sidenav-title-padding: 6px 12px 16px;
            /* Search */
            --merch-sidenav-search-gap: 10px;
            /* List */
            --merch-sidenav-list-gap: 0;
            --merch-sidenav-list-title-color: var(--spectrum-gray-700, #464646);
            --merch-sidenav-list-title-font-size: 14px;
            --merch-sidenav-list-title-font-weight: 400;
            --merch-sidenav-list-title-padding: 6px 12px 8px;
            --merch-sidenav-list-title-line-height: 18px;
            --merch-sidenav-item-height: unset;
            --merch-sidenav-item-inline-padding: 12px;
            --merch-sidenav-item-font-weight: 400;
            --merch-sidenav-item-font-size: 14px;
            --merch-sidenav-item-line-height: 18px;
            --merch-sidenav-item-label-top-margin: 6px;
            --merch-sidenav-item-label-bottom-margin: 8px;
            --merch-sidenav-item-icon-top-margin: 7px;
            --merch-sidenav-item-icon-gap: 8px;
            --merch-sidenav-item-selected-color: var(--spectrum-gray-800, #222222);
            --merch-sidenav-item-selected-background: var(--spectrum-gray-200, #E6E6E6);
            --merch-sidenav-list-item-gap: 4px;
            /* Checkbox group */
            --merch-sidenav-checkbox-group-title-font-size: 14px;
            --merch-sidenav-checkbox-group-title-font-weight: 400;
            --merch-sidenav-checkbox-group-title-line-height: 18px;
            --merch-sidenav-checkbox-group-title-color: var(--spectrum-gray-700, #464646);
            --merch-sidenav-checkbox-group-title-padding: 6px 0 8px;
            --merch-sidenav-checkbox-group-gap: 32px;
            --merch-sidenav-checkbox-group-padding: 0 12px;
            --merch-sidenav-checkbox-group-label-font-size: 17px;
            --merch-sidenav-checkbox-group-checkbox-spacing: 22px;
            --merch-sidenav-checkbox-group-label-gap: 13px;
            --merch-sidenav-checkbox-group-label-top-margin: 8px;
            --merch-sidenav-checkbox-group-height: 40px;
            /* Modal */
            --merch-sidenav-modal-close-font-size: 15px;
            --merch-sidenav-modal-close-line-height: 19px;
            --merch-sidenav-modal-close-gap: 10px;
            --merch-sidenav-modal-border-radius: 8px;
            --merch-sidenav-modal-padding: var(--merch-sidenav-padding);

            display: block;
            z-index: 2;
            padding: var(--merch-sidenav-padding);
            margin-right: var(--merch-sidenav-collection-gap);
        }

        ::slotted(merch-sidenav-list) {
            --mod-sidenav-min-height: var(--merch-sidenav-item-height);
            --mod-sidenav-inline-padding: var(--merch-sidenav-item-inline-padding);
            --mod-sidenav-top-level-font-weight: var(--merch-sidenav-item-font-weight);
            --mod-sidenav-top-level-font-size: var(--merch-sidenav-item-font-size);
            --mod-sidenav-top-level-line-height: var(--merch-sidenav-item-line-height);
            --mod-sidenav-top-to-label: var(--merch-sidenav-item-label-top-margin);
            --mod-sidenav-bottom-to-label: var(--merch-sidenav-item-label-bottom-margin);
            --mod-sidenav-top-to-icon: var(--merch-sidenav-item-icon-top-margin);
            --mod-sidenav-icon-spacing: var(--merch-sidenav-item-icon-gap);
            --mod-sidenav-content-color-default-selected: var(--merch-sidenav-item-selected-color);
            --mod-sidenav-item-background-default-selected: var(--merch-sidenav-item-selected-background);
            --mod-sidenav-gap: var(--merch-sidenav-list-item-gap);
        }

        ::slotted(merch-sidenav-checkbox-group) {
            --mod-checkbox-font-size: var(--merch-sidenav-checkbox-group-label-font-size);
            --mod-checkbox-spacing: var(--merch-sidenav-checkbox-group-checkbox-spacing);
            --mod-checkbox-text-to-control: var(--merch-sidenav-checkbox-group-label-gap);
            --mod-checkbox-top-to-text: var(--merch-sidenav-checkbox-group-label-top-margin);
            --mod-checkbox-height: var(--merch-sidenav-checkbox-group-height);
        }

        :host h2 {
            color: var(--merch-sidenav-title-color);
            font-size: var(--merch-sidenav-title-font-size);
            font-weight: var(--merch-sidenav-title-font-weight);
            padding: var(--merch-sidenav-title-padding);
            line-height: var(--merch-sidenav-title-line-height);
            margin: 0;
        }

        #content {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: baseline;
        }
        
        ::slotted(merch-search) {
            display: block;
            margin-bottom: var(--merch-sidenav-search-gap);
        }

        :host([modal]) ::slotted(merch-search) {
            display: none;
        }

        #sidenav {
            display: flex;
            flex-direction: column;
            max-width: 248px;
            overflow-y: auto;
            place-items: center;
            position: relative;
            width: 100%;
            border-radius: var(--merch-sidenav-modal-border-radius);
            padding: var(--merch-sidenav-modal-padding);
        }

        sp-dialog-base {
            --mod-modal-confirm-border-radius: var(--merch-sidenav-modal-border-radius);
            --mod-modal-max-height: 100dvh;
        }

        sp-dialog-base #sidenav {
            box-sizing: border-box;
            max-width: 300px;
            max-height: 95dvh;
            background: #ffffff 0% 0% no-repeat padding-box;
            box-shadow: 0px 1px 4px #00000026;
        }

        :host(:not([autoclose])) #sidenav h2 {
            margin-top: calc(var(--merch-sidenav-modal-close-gap) + var(--merch-sidenav-modal-close-line-height));
        }

        sp-link {
            position: absolute;
            top: 16px;
            right: 16px;
            font-size: var(--merch-sidenav-modal-close-font-size);
            line-height: var(--merch-sidenav-modal-close-line-height);
        }
    `;
}

customElements.define('merch-sidenav', MerchSideNav);
