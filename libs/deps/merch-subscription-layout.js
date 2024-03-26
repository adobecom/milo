// branch: MWPW-144805-twp commit: 3f2b985bb0f93cdac2c759c36f7e58aa704f3c16 Tue, 26 Mar 2024 15:57:34 GMT
import{LitElement as m,html as h}from"/libs/deps/lit-all.min.js";import{css as p,unsafeCSS as c}from"/libs/deps/lit-all.min.js";var r="(min-width: 768px)",o="(min-width: 1200px)";var d=p`
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

    @media ${c(r)} {
    }

    @media ${c(o)} {
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
`;var u="merch-subscription-layout",n=class extends m{static styles=[d];cards;panel;tabs={individual:[],business:[],students:[]};connectedCallback(){if(super.connectedCallback(),this.cards=this.querySelectorAll("merch-card"),this.panel=this.querySelector("merch-subscription-panel"),this.panel&&this.cards.length){let i=[];[...this.cards].forEach(a=>{let t=a.querySelectorAll('[is="inline-price"][data-template="price"]');t.length&&(i=[...i,...[...t].map(e=>e.onceSettled())])}),Promise.all(i).then(()=>{this.cards.forEach(t=>{let e=t.querySelector('[is="inline-price"][data-template="price"]');if(!e.value)return;let{marketSegments:s,customerSegment:l}=e.value[0];s&&(s[0]==="COM"&&l==="INDIVIDUAL"?this.tabs.individual=[...this.tabs.individual,t]:s[0]==="COM"?this.tabs.business=[...this.tabs.business,t]:s[0]==="EDU"&&(this.tabs.students=[...this.tabs.students,t]))});let a=this.cards[1];this.panel.card=this.cards[0]})}}render(){return h`
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
        `}};window.customElements.define(u,n);export{n as SubscriptionLayout};
//# sourceMappingURL=merch-subscription-layout.js.map
