import { html, css, LitElement } from 'lit';
import { MatchMediaController } from '@spectrum-web-components/reactive-controllers/src/MatchMedia.js';
import { headingStyles } from './merch-sidenav-heading.css.js';
import '../merch-search.js';
import './merch-sidenav-list.js';
import './merch-sidenav-checkbox-group.js';
import { SPECTRUM_MOBILE_LANDSCAPE, TABLET_DOWN } from '../media.js';

export class MerchSideNav extends LitElement {
    static properties = {
        sidenavTitle: { type: String },
        closeText: { type: String, attribute: 'close-text' },
        open: { type: Boolean, state: true, reflect: true },
    };

    constructor() {
        super();
        this.open = false;
        this.closeModal = this.closeModal.bind(this);
    }

    updated() {
        if (!this.mobileAndTablet.matches && this.open)
            this.closeModal();
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
        return html`
            <sp-theme  color="light" scale="medium">
                <sp-overlay type="modal" ?open=${this.open} @close=${this.closeModal}>
                    <sp-dialog-base
                        dismissable
                        underlay
                        no-divider
                    >
                        <div id="content">
                            <div id="sidenav">
                                <div>
                                    <h2>${this.sidenavTitle}</h2>
                                    <slot></slot>
                                </div>
                                <sp-link href="#" @click="${this.closeModal}"
                                    >${this.closeText || 'Close'}</sp-link
                                >
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

    closeModal() {
        this.open = false;
        document.querySelector('body')?.classList.remove('merch-modal');
    }

    showModal() {
        this.open = true;
        document.querySelector('body')?.classList.add('merch-modal');
    }

    static styles = [
        css`
            :host {
                display: block;
                z-index: 2;
            }

            :host h2 {
              color: var(--spectrum-global-color-gray-900);
              font-size: 12px;
            }

            :host(:not([modal])) {
                --mod-sidenav-item-background-default-selected: #222;
                --mod-sidenav-content-color-default-selected: #fff;
            }

            #content {
                width: 100%;
                min-width: 300px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: baseline;
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
                padding-bottom: 16px;
            }

            sp-dialog-base #sidenav {
                padding-top: 16px;
                max-width: 300px;
                max-height: 80dvh;
                min-height: min(500px, 80dvh);
                background: #ffffff 0% 0% no-repeat padding-box;
                box-shadow: 0px 1px 4px #00000026;
            }

            sp-link {
                position: absolute;
                top: 16px;
                right: 16px;
            }
        `,
        headingStyles,
    ];
}

customElements.define('merch-sidenav', MerchSideNav);
