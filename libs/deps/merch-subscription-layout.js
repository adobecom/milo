// branch: MWPW-144805-twp commit: 3f2b985bb0f93cdac2c759c36f7e58aa704f3c16 Mon, 25 Mar 2024 16:01:55 GMT
import{LitElement as s,html as i}from"/libs/deps/lit-all.min.js";import{css as o,unsafeCSS as a}from"/libs/deps/lit-all.min.js";var e="(min-width: 768px)",n="(min-width: 1200px)";var r=o`
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

    #cards {
        align-items: center;
        border-radius: var(--consonant-merch-spacing-xs);
        display: flex;
        flex-direction: column;
        gap: var(--consonant-merch-spacing-xs);
        grid-area: cards;
        padding: var(--consonant-merch-spacing-xs) 0;
    }

    #layout {
        border-radius: var(--consonant-merch-spacing-xs);
        box-sizing: border-box;
        display: grid;
        gap: var(--consonant-merch-spacing-xs);
        grid-template-columns: auto;
        grid-template-rows: min-content min-content;
        grid-template-areas: 'cards' 'panel';
        margin: 0 auto;
        max-width: 514px;
        width: 100%;
    }

    #panel {
        grid-area: panel;
    }

    @media ${a(e)} {
    }

    @media ${a(n)} {
        :host {
            padding: 0;
        }

        #cards {
            align-items: flex-start;
            background-color: #fbfbfb;
            flex-direction: row;
            height: min-content;
            justify-content: center;
            padding: 0 var(--consonant-merch-spacing-xs);
        }

        #layout {
            max-width: unset;
            grid-template-columns: 1fr 390px;
            grid-template-rows: min-content;
            grid-template-areas: 'cards panel';
        }
    }
`;var d="merch-subscription-layout",t=class extends s{static styles=[r];render(){return i`
            <sp-theme theme="spectrum" color="light" scale="medium">
                <div id="layout">
                    <div id="cards">
                        <slot name="cards"></slot>
                    </div>
                    <div id="panel">
                        <slot name="panel"></slot>
                    </div>
                </div>
            </div>
        `}};window.customElements.define(d,t);export{t as SubscriptionLayout};
//# sourceMappingURL=merch-subscription-layout.js.map
