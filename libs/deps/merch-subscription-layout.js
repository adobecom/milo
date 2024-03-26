// branch: MWPW-144805-twp commit: 208bdea01fff769dc4e5ddaadaa91f073105c943 Tue, 26 Mar 2024 16:23:09 GMT
import{LitElement as p,html as m}from"/libs/deps/lit-all.min.js";import{css as l,unsafeCSS as o}from"/libs/deps/lit-all.min.js";var a="(min-width: 768px)",r="(min-width: 1200px)";var c=l`
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

    @media ${o(a)} {
    }

    @media ${o(r)} {
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
`;var h="merch-subscription-layout",n=class extends p{static styles=[c];cards;panel;tabs={individual:[],business:[],students:[]};connectedCallback(){if(super.connectedCallback(),this.cards=this.querySelectorAll("merch-card"),this.panel=this.querySelector("merch-subscription-panel"),this.panel&&this.cards.length){let i=[];[...this.cards].forEach(t=>{let s=t.querySelectorAll('[is="inline-price"][data-template="price"]');s.length&&(i=[...i,...[...s].map(e=>e.onceSettled())])}),Promise.all(i).then(()=>{this.cards.forEach(t=>{let s=t.querySelector('[is="inline-price"][data-template="price"]');if(!s.value?.length)return;let{marketSegments:e,customerSegment:d}=s.value[0];e?.length&&(e[0]==="COM"&&d==="INDIVIDUAL"?this.tabs.individual=[...this.tabs.individual,t]:e[0]==="COM"?this.tabs.business=[...this.tabs.business,t]:e[0]==="EDU"&&(this.tabs.students=[...this.tabs.students,t]))}),this.tabs.individual&&this.tabs.individual.length&&(this.panel.card=this.tabs.individual[0])})}}render(){return m`
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
        `}};window.customElements.define(h,n);export{n as SubscriptionLayout};
//# sourceMappingURL=merch-subscription-layout.js.map
