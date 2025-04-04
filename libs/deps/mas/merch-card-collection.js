var w=Object.defineProperty;var b=(s,e,t)=>e in s?w(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var m=(s,e,t)=>b(s,typeof e!="symbol"?e+"":e,t);import{html as c,LitElement as I}from"../lit-all.min.js";var T=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};var A="hashchange";function y(s=window.location.hash){let e=[],t=s.replace(/^#/,"").split("&");for(let o of t){let[n,i=""]=o.split("=");n&&e.push([n,decodeURIComponent(i.replace(/\+/g," "))])}return Object.fromEntries(e)}function p(s){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(s).forEach(([n,i])=>{i?e.set(n,i):e.delete(n)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let o=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,o)}function f(s){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=y(window.location.hash);s(t)};return e(),window.addEventListener(A,e),()=>{window.removeEventListener(A,e)}}var W=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),j=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var D='span[is="inline-price"][data-wcs-osi]',P='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var z=`${D},${P}`;var S="merch-card-collection:sort",R="merch-card-collection:showmore",x="merch-sidenav:select";var q=Object.freeze({CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),X=Object.freeze({V2:"UCv2",V3:"UCv3"}),Q=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var C="(max-width: 1199px)",N="(min-width: 768px)",M="(min-width: 1200px)";import{css as v,unsafeCSS as O}from"../lit-all.min.js";var g=v`
    #header,
    #resultText,
    #footer {
        grid-column: 1 / -1;
        justify-self: stretch;
        color: var(--merch-color-grey-80);
    }

    sp-theme {
        display: contents;
    }

    sp-action-menu {
      z-index: 1;
    }

    #header {
        order: -2;
        display: grid;
        justify-items: top;
        grid-template-columns: auto max-content;
        grid-template-rows: auto;
        row-gap: var(--consonant-merch-spacing-m);
        align-self: baseline;
    }

    #resultText {
        min-height: 32px;
    }

    merch-search {
        display: contents;
    }

    #searchBar {
        grid-column: 1 / -1;
        width: 100%;
        max-width: 302px;
    }

    #filtersButton {
        width: 92px;
        margin-inline-end: var(--consonant-merch-spacing-xxs);
    }

    #sortButton {
        justify-self: end;
    }

    sp-action-button {
        align-self: baseline;
    }

    sp-menu sp-action-button {
        min-width: 140px;
    }

    sp-menu {
        min-width: 180px;
    }

    #footer {
        order: 1000;
    }

    /* tablets */
    @media screen and ${O(N)} {
        #header {
            grid-template-columns: 1fr fit-content(100%) fit-content(100%);
        }

        #searchBar {
            grid-column: span 1;
        }

        #filtersButton {
            grid-column: span 1;
        }

        #sortButton {
            grid-column: span 1;
        }
    }

    /* Laptop */
    @media screen and ${O(M)} {
        #resultText {
            grid-column: span 2;
            order: -3;
        }

        #header {
            grid-column: 3 / -1;
            display: flex;
            justify-content: end;
        }
    }
`;var d=(s,e)=>s.querySelector(`[slot="${e}"]`)?.textContent?.trim();var H="merch-card-collection",a={alphabetical:"alphabetical",authored:"authored"},Y={filters:["noResultText","resultText","resultsText"],mobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noSearchResultsText","searchResultText","searchResultsText"]},L=(s,e={})=>{s.querySelectorAll("span[data-placeholder]").forEach(t=>{let{placeholder:o}=t.dataset;t.innerText=e[o]??""})},U=(s,{filter:e})=>s.filter(t=>t.filters.hasOwnProperty(e)),V=(s,{types:e})=>e?(e=e.split(","),s.filter(t=>e.some(o=>t.types.includes(o)))):s,k=s=>s.sort((e,t)=>(e.title??"").localeCompare(t.title??"","en",{sensitivity:"base"})),B=(s,{filter:e})=>s.sort((t,o)=>o.filters[e]?.order==null||isNaN(o.filters[e]?.order)?-1:t.filters[e]?.order==null||isNaN(t.filters[e]?.order)?1:t.filters[e].order-o.filters[e].order),F=(s,{search:e})=>e?.length?(e=e.toLowerCase(),s.filter(t=>(t.title??"").toLowerCase().includes(e))):s,h=class extends I{constructor(){super();m(this,"mobileAndTablet",new T(this,C));this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1}render(){return c`${this.header}
            <slot></slot>
            ${this.footer}`}updated(t){if(!this.querySelector("merch-card"))return;let o=window.scrollY||document.documentElement.scrollTop,n=[...this.children].filter(r=>r.tagName==="MERCH-CARD");if(n.length===0)return;t.has("singleApp")&&this.singleApp&&n.forEach(r=>{r.updateFilters(r.name===this.singleApp)});let i=this.sort===a.alphabetical?k:B,l=[U,V,F,i].reduce((r,E)=>E(r,this),n).map((r,E)=>[r,E]);if(this.resultCount=l.length,this.page&&this.limit){let r=this.page*this.limit;this.hasMore=l.length>r,l=l.filter(([,E])=>E<r)}let u=new Map(l.reverse());for(let r of u.keys())this.prepend(r);n.forEach(r=>{u.has(r)?(r.size=r.filters[this.filter]?.size,r.style.removeProperty("display"),r.requestUpdate()):(r.style.display="none",r.size=void 0)}),window.scrollTo(0,o),this.updateComplete.then(()=>{let r=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];r&&(this.sidenav?.filters?.addEventListener(x,()=>{L(r,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText})}),L(r,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText}))})}connectedCallback(){super.connectedCallback(),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.sidenav=document.querySelector("merch-sidenav")}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}get header(){if(!this.filtered)return c`<div id="header">
                <sp-theme  color="light" scale="medium">
                    ${this.searchBar} ${this.filtersButton} ${this.sortButton}
                </sp-theme>
            </div>
            <div id="resultText" aria-live="polite">
                ${this.displayResult?c`<slot name="${this.resultTextSlotName}"></slot>`:""}
            </div>`}get footer(){if(!this.filtered)return c`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get resultTextSlotName(){return Y[this.search?this.mobileAndTablet.matches?"mobile":"desktop":"filters"][Math.min(this.resultCount,2)]}get showMoreButton(){if(this.hasMore)return c`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}get filtersButton(){return this.mobileAndTablet.matches?c`<sp-action-button
                  id="filtersButton"
                  variant="secondary"
                  treatment="outline"
                  @click="${this.openFilters}"
                  ><slot name="filtersText"></slot
              ></sp-action-button>`:""}get searchBar(){let t=d(this,"searchText");return this.mobileAndTablet.matches?c`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      @submit="${this.searchSubmit}"
                      placeholder="${t}"
                  ></sp-search>
              </merch-search>`:""}get sortButton(){let t=d(this,"sortText"),o=d(this,"popularityText"),n=d(this,"alphabeticallyText");if(!(t&&o&&n))return;let i=this.sort===a.alphabetical;return c`
            <sp-action-menu
                id="sortButton"
                size="m"
                @change="${this.sortChanged}"
                selects="single"
                value="${i?a.alphabetical:a.authored}"
            >
                <span slot="label-only"
                    >${t}:
                    ${i?n:o}</span
                >
                <sp-menu-item value="${a.authored}"
                    >${o}</sp-menu-item
                >
                <sp-menu-item value="${a.alphabetical}"
                    >${n}</sp-menu-item
                >
            </sp-action-menu>
        `}sortChanged(t){t.target.value===a.authored?p({sort:void 0}):p({sort:t.target.value}),this.dispatchEvent(new CustomEvent(S,{bubbles:!0,composed:!0,detail:{value:t.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(R,{bubbles:!0,composed:!0}));let t=this.page+1;p({page:t}),this.page=t,await this.updateComplete}startDeeplink(){this.stopDeeplink=f(({category:t,filter:o,types:n,sort:i,search:_,single_app:l,page:u})=>{o=o||t,!this.filtered&&o&&o!==this.filter&&setTimeout(()=>{p({page:void 0}),this.page=1},1),this.filtered||(this.filter=o??this.filter),this.types=n??"",this.search=_??"",this.singleApp=l,this.sort=i,this.page=Number(u)||1})}openFilters(t){this.sidenav?.showModal(t)}};m(h,"properties",{filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:a.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single-app",reflect:!0},hasMore:{type:Boolean},displayResult:{type:Boolean,attribute:"display-result"},resultCount:{type:Number},sidenav:{type:Object}}),m(h,"styles",[g]);h.SortOrder=a;customElements.define(H,h);export{h as MerchCardCollection,L as updateLiterals};
