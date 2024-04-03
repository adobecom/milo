// branch: twp-panel commit: d5f0d522bb2a13e311d36c2bad0b64dd9cf897fb Wed, 03 Apr 2024 10:26:46 GMT
import{html as t,LitElement as s}from"/libs/deps/lit-all.min.js";import{css as n}from"/libs/deps/lit-all.min.js";var i=n`
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

    input[type='radio'] {
        height: 0;
        outline: none;
        position: absolute;
        width: 0;
        z-index: -1;
    }

    label {
        background-color: white;
        border: 1px solid transparent;
        border-radius: var(--consonant-merch-spacing-xxxs);
        cursor: pointer;
        display: block;
        margin: var(--consonant-merch-spacing-xs) 0;
        padding: var(--consonant-merch-spacing-xs);
        position: relative;
    }

    label:hover {
        box-shadow: var(--merch-hovered-shadow);
    }

    input:checked + label {
        box-shadow: var(--merch-selected-shadow);
    }

    .condition-icon {
        background-position: center;
        background-size: contain;
        background: var(--info-icon) no-repeat;
        content: '';
        color: #6e6e6e;
        display: inline-block;
        height: 1.1em;
        margin-bottom: -3px;
        width: 1.1em;
    }

    ::slotted([slot$='-commitment']) {
    }

    ::slotted([slot$='-condition']) {
        display: inline-block;
        font-style: italic;
    }

    ::slotted([slot$='-plan']) {
        font-weight: 700;
    }
`;var a="header",o=class extends s{static styles=[i];static properties={card:{type:Object}};renderOption(){return t` <div id="opt">I am an option</div> `}get listLayout(){let e=this.card.querySelector("merch-offer-select").cloneNode(!0);return e.append(...this.querySelectorAll("template")),e.setAttribute("container","merch-subscription-layout"),e.querySelectorAll("merch-offer").forEach(r=>{r.type="div",r.append(...this.querySelectorAll("template"))}),t`
            <div id="panel">
                <div id="header" tabindex="0">
                    <slot name="${a}"></slot>
                </div>
                ${e}
                <div id="footer">
                    <slot name="footer"></slot>
                    <slot name="cta"></slot>
                </div>
            </div>
        `}get waitLayout(){return t`
            <sp-theme theme="spectrum" color="light" scale="medium">
                <div id="spinner">
                    <sp-progress-circle indeterminate size="l" />
                </div>
            </sp-theme>
        `}render(){return this.card?this.listLayout:this.waitLayout}};window.customElements.define("merch-subscription-panel",o);export{a as SLOT_HEADER};
//# sourceMappingURL=merch-subscription-panel.js.map
