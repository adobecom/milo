// branch: twp-panel commit: f19db18cb1184615d0f7d3afead626d724d62121 Wed, 03 Apr 2024 14:11:30 GMT
import{LitElement as r,html as a}from"/libs/deps/lit-all.min.js";import{css as s,unsafeCSS as n}from"/libs/deps/lit-all.min.js";var e="(min-width: 768px)",o="(min-width: 1200px)";var i=s`
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
`;var d="merch-subscription-layout",t=class extends r{static styles=[i];render(){return a`
            <sp-theme theme="spectrum" color="light" scale="medium">
                <div id="layout">
                    <div id="content">
                        <slot name="content"></slot>
                    </div>
                    <div id="panel">
                        <slot name="panel"></slot>
                    </div>
                </div>
            </div>
        `}};window.customElements.define(d,t);export{t as SubscriptionLayout};
//# sourceMappingURL=merch-subscription-layout.js.map
