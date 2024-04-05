// branch: twp-panel commit: 1db48026128e58b82f612c98c350b6335065998e Wed, 03 Apr 2024 15:12:50 GMT
import{html as s,LitElement as n}from"/libs/deps/lit-all.min.js";import{css as i}from"/libs/deps/lit-all.min.js";var r=i`
    :host {
        --merch-focused-outline: var(--merch-color-focus-ring) auto 1px;
        background-color: #f5f5f5;
        border-radius: var(--consonant-merch-spacing-xs);
        display: block;
        padding: var(--consonant-merch-spacing-xs);
    }

    #footer {
        justify-content: space-between;
        display: flex;
        grid-area: footer;
        order: 4;
    }
    #footer:focus-within {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }

    #header {
        grid-area: header;
        order: 1;
        outline: none;
        padding: 0 0.25em;
    }
    #header:focus-visible {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }

    #offers {
        grid-area: offers;
        order: 2;
    }
    #offers:focus-within {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }

    #panel {
        display: grid;
        gap: var(--consonant-merch-spacing-xs);
        grid-template-areas:
            'header'
            'offers'
            'stock'
            'footer';
    }

    #spinner {
        display: flex;
        justify-content: center;
    }

    #stock {
        grid-area: stock;
        order: 3;
    }
    #stock:focus-within {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }
`;var c="header",o=class extends n{static styles=[r];static properties={card:{type:Object}};get listLayout(){let e=this.card.querySelector("merch-offer-select").cloneNode(!0);return e.append(...[...this.querySelectorAll("template")].map(t=>t.cloneNode(!0))),e.setAttribute("container","merch-subscription-layout"),e.querySelectorAll("merch-offer").forEach(t=>{t.type="div"}),s`
            <div id="panel">
                <div id="header" tabindex="0">
                    <slot name="${c}"></slot>
                </div>
                <div id="offers">${e}</div>
                <div id="footer">
                    <slot name="footer"></slot>
                    <slot name="cta"></slot>
                </div>
            </div>
        `}get waitLayout(){return s`
            <sp-theme theme="spectrum" color="light" scale="medium">
                <div id="spinner">
                    <sp-progress-circle indeterminate size="l" />
                </div>
            </sp-theme>
        `}render(){return this.card?this.listLayout:this.waitLayout}};window.customElements.define("merch-subscription-panel",o);export{c as SLOT_HEADER};
//# sourceMappingURL=merch-subscription-panel.js.map
