// branch: twp-panel commit: d5f0d522bb2a13e311d36c2bad0b64dd9cf897fb Wed, 03 Apr 2024 10:26:46 GMT
import{LitElement as p,html as m}from"/libs/deps/lit-all.min.js";import{css as h,unsafeCSS as c}from"/libs/deps/lit-all.min.js";var n="(min-width: 768px)",a="(min-width: 1200px)";var o=h`
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

    @media ${c(n)} {
    }

    @media ${c(a)} {
        #cards {
            align-items: flex-start;
            background-color: #fbfbfb;
            flex-direction: row;
            height: min-content;
            justify-content: center;
            padding: 0 var(--consonant-merch-spacing-xs);
        }
    }
`;var d='merch-offer-select [is="inline-price"][data-template="price"]',r=class extends p{static styles=[o];cards;panel;tabs=[];static properties={activeTab:{type:Object}};connectedCallback(){if(super.connectedCallback(),this.cards=this.querySelectorAll("merch-card"),this.panel=this.parentNode.querySelector("merch-subscription-panel"),this.panel&&this.cards.length){let t=[];[...this.cards].forEach(e=>{let s=e.querySelector(d);s&&(t=[...t,s.onceSettled()])}),Promise.all(t).then(()=>{this.cards.forEach(e=>{let s=e.querySelector(d);if(!s?.value?.length)return;let{marketSegments:i,customerSegment:l}=s.value[0];i?.length&&(i[0]==="COM"&&l==="INDIVIDUAL"?this.addCard("indiviual",e):i[0]==="COM"?this.addCard("business",e):i[0]==="EDU"&&this.addCard("students",e))}),this.tabs?.length&&(this.tabs[0].active=!0,this.activeTab=this.tabs.find(e=>e.active===!0),this.setActiveCard(this.activeTab.cards[0]))})}}setActiveCard(t){t.querySelector('merch-offer-select span[is="inline-price"]')?.onceSettled().then(()=>{this.panel.card=t})}addCard(t,e){let s=this.tabs.find(i=>i.name===t);s?s.cards?.push(e):this.tabs.push({name:t,cards:[e]})}render(){return m`<div id="cards">${this.activeTab?.cards}</div>`}};window.customElements.define("merch-subscription-tabs",r);export{r as MerchSubscriptionTabs};
//# sourceMappingURL=merch-subscription-tabs.js.map
