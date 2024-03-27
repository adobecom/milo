// branch: MWPW-144805-twp commit: 91afdfadeb0860a085c91d4b486f937fd051a742 Wed, 27 Mar 2024 12:16:26 GMT
import{LitElement as p,html as h}from"/libs/deps/lit-all.min.js";import{css as l,unsafeCSS as c}from"/libs/deps/lit-all.min.js";var r="(min-width: 768px)",n="(min-width: 1200px)";var o=l`
    :host {
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

    @media ${c(r)} {
    }

    @media ${c(n)} {
        #cards {
            align-items: flex-start;
            background-color: #fbfbfb;
            flex-direction: row;
            height: min-content;
            justify-content: center;
            padding: 0 var(--consonant-merch-spacing-xs);
        }
    }
`;var a=class extends p{static styles=[o];cards;panel;tabs=[];static properties={activeTab:{type:Object}};connectedCallback(){if(super.connectedCallback(),this.cards=this.querySelectorAll("merch-card"),this.panel=this.parentNode.querySelector("merch-subscription-panel"),this.panel&&this.cards.length){let i=[];[...this.cards].forEach(t=>{let e=t.querySelectorAll('[is="inline-price"][data-template="price"]');e.length&&(i=[...i,...[...e].map(s=>s.onceSettled())])}),Promise.all(i).then(()=>{this.cards.forEach(t=>{let e=t.querySelector('[is="inline-price"][data-template="price"]');if(!e?.value?.length)return;let{marketSegments:s,customerSegment:d}=e.value[0];s?.length&&(s[0]==="COM"&&d==="INDIVIDUAL"?this.addCard("indiviual",t):s[0]==="COM"?this.addCard("business",t):s[0]==="EDU"&&this.addCard("students",t))}),this.tabs?.length&&(this.tabs[0].active=!0,this.activeTab=this.tabs.find(t=>t.active===!0),this.panel.card=this.tabs[0].cards[0])})}}addCard(i,t){let e=this.tabs.find(s=>s.name===i);e?e.cards?.push(t):this.tabs.push({name:i,cards:[t]})}render(){return h`<div id="cards">${this.activeTab?.cards}</div>`}};window.customElements.define("merch-subscription-tabs",a);export{a as MerchSubscriptionTabs};
//# sourceMappingURL=merch-subscription-tabs.js.map
