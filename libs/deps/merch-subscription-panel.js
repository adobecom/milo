// branch: twp-panel commit: b84d063bcc7cfeff3355cf9950d3a24f0ba37040 Wed, 03 Apr 2024 13:20:13 GMT
import{html as o,LitElement as n}from"/libs/deps/lit-all.min.js";import{css as s}from"/libs/deps/lit-all.min.js";var i=s`
    :host {
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
`;var a="header",r=class extends n{static styles=[i];static properties={card:{type:Object}};renderOption(){return o` <div id="opt">I am an option</div> `}get listLayout(){let e=this.card.querySelector("merch-offer-select").cloneNode(!0);return e.append(...[...this.querySelectorAll("template")].map(t=>t.cloneNode(!0))),e.setAttribute("container","merch-subscription-layout"),e.querySelectorAll("merch-offer").forEach(t=>{t.type="div"}),o`
            <div id="panel">
                <div id="header" tabindex="0">
                    <slot name="${a}"></slot>
                </div>
                <div id="offers">${e}</div>
                <div id="footer">
                    <slot name="footer"></slot>
                    <slot name="cta"></slot>
                </div>
            </div>
        `}get waitLayout(){return o`
            <sp-theme theme="spectrum" color="light" scale="medium">
                <div id="spinner">
                    <sp-progress-circle indeterminate size="l" />
                </div>
            </sp-theme>
        `}render(){return this.card?this.listLayout:this.waitLayout}};window.customElements.define("merch-subscription-panel",r);export{a as SLOT_HEADER};
//# sourceMappingURL=merch-subscription-panel.js.map
