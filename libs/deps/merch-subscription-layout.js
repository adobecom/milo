// branch: MWPW-144805-twp commit: 91afdfadeb0860a085c91d4b486f937fd051a742 Wed, 27 Mar 2024 12:16:26 GMT
import{LitElement as a,html as r}from"/libs/deps/lit-all.min.js";import{css as i,unsafeCSS as n}from"/libs/deps/lit-all.min.js";var e="(min-width: 768px)",o="(min-width: 1200px)";var s=i`
    :host {
        background-color: #fbfbfb;
        border-radius: var(--consonant-merch-spacing-xs);
        box-sizing: border-box;
        display: block;
        padding: 0 30px;
        width: 100%;
    }

    sp-theme {
        display: contents;
    }

    #layout {
        border-radius: var(--consonant-merch-spacing-xs);
        box-sizing: border-box;
        display: grid;
        gap: var(--consonant-merch-spacing-xs);
        grid-template-columns: auto;
        grid-template-rows: min-content min-content;
        grid-template-areas: 'content' 'panel';
        margin: 0 auto;
        max-width: 514px;
        width: 100%;
    }

    #panel {
        grid-area: panel;
    }

    @media ${n(e)} {
    }

    @media ${n(o)} {
        :host {
            padding: 0;
        }

        #layout {
            max-width: unset;
            grid-template-columns: 1fr 390px;
            grid-template-rows: min-content;
            grid-template-areas: 'cards panel';
        }
    }
`;var d="merch-subscription-layout",t=class extends a{static styles=[s];render(){return r`
            <sp-theme theme="spectrum" color="light" scale="medium">
                <div id="layout">
                    <div id="content">
                        <slot name="title"></slot>
                        <slot name="sub-title"></slot>
                        <slot name="tabs"></slot>
                    </div>
                    <div id="panel">
                        <slot name="panel"></slot>
                    </div>
                </div>
            </div>
        `}};window.customElements.define(d,t);export{t as SubscriptionLayout};
//# sourceMappingURL=merch-subscription-layout.js.map
