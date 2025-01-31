var y=Object.defineProperty;var N=(s,e,t)=>e in s?y(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var a=(s,e,t)=>N(s,typeof e!="symbol"?e+"":e,t);import{html as l,LitElement as O}from"../lit-all.min.js";import"../lit-all.min.js";var u=class{constructor(e,t){a(this,"key");a(this,"host");a(this,"media");a(this,"matches");this.key=Symbol("match-media-key"),this.media=window.matchMedia(t),this.matches=this.media.matches,this.updateMatches=this.updateMatches.bind(this),(this.host=e).addController(this)}hostConnected(){this.media.addEventListener("change",this.updateMatches)}hostDisconnected(){this.media.removeEventListener("change",this.updateMatches)}updateMatches(){this.matches!==this.media.matches&&(this.matches=this.media.matches,this.host.requestUpdate(this.key,!this.matches))}};var _="hashchange";function M(s=window.location.hash){let e=[],t=s.replace(/^#/,"").split("&");for(let r of t){let[i,n=""]=r.split("=");i&&e.push([i,decodeURIComponent(n.replace(/\+/g," "))])}return Object.fromEntries(e)}function m(s){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(s).forEach(([i,n])=>{n?e.set(i,n):e.delete(i)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let r=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,r)}function x(s){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=M(window.location.hash);s(t)};return e(),window.addEventListener(_,e),()=>{window.removeEventListener(_,e)}}var S="merch-card-collection:sort",A="merch-card-collection:showmore";var R="(max-width: 1199px)",g="(min-width: 768px)",C="(min-width: 1200px)";import{css as L,unsafeCSS as w}from"../lit-all.min.js";var b=L`
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
    @media screen and ${w(g)} {
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
    @media screen and ${w(C)} {
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
`;var E=(s,e)=>s.querySelector(`[slot="${e}"]`)?.textContent?.trim();var D="merch-card-collection",c={alphabetical:"alphabetical",authored:"authored"},v={filters:["noResultText","resultText","resultsText"],mobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noSearchResultsText","searchResultText","searchResultsText"]},P=(s,e={})=>{s.querySelectorAll("span[data-placeholder]").forEach(t=>{let{placeholder:r}=t.dataset;t.innerText=e[r]??""})},B=(s,{filter:e})=>s.filter(t=>t.filters.hasOwnProperty(e)),H=(s,{types:e})=>e?(e=e.split(","),s.filter(t=>e.some(r=>t.types.includes(r)))):s,V=s=>s.sort((e,t)=>(e.title??"").localeCompare(t.title??"","en",{sensitivity:"base"})),k=(s,{filter:e})=>s.sort((t,r)=>r.filters[e]?.order==null||isNaN(r.filters[e]?.order)?-1:t.filters[e]?.order==null||isNaN(t.filters[e]?.order)?1:t.filters[e].order-r.filters[e].order),I=(s,{search:e})=>e?.length?(e=e.toLowerCase(),s.filter(t=>(t.title??"").toLowerCase().includes(e))):s,p=class extends O{constructor(){super();a(this,"mobileAndTablet",new u(this,R));this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1}render(){return l`${this.header}
            <slot></slot>
            ${this.footer}`}updated(t){if(!this.querySelector("merch-card"))return;let r=window.scrollY||document.documentElement.scrollTop,i=[...this.children].filter(o=>o.tagName==="MERCH-CARD");if(i.length===0)return;t.has("singleApp")&&this.singleApp&&i.forEach(o=>{o.updateFilters(o.name===this.singleApp)});let n=this.sort===c.alphabetical?V:k,h=[B,H,I,n].reduce((o,d)=>d(o,this),i).map((o,d)=>[o,d]);if(this.resultCount=h.length,this.page&&this.limit){let o=this.page*this.limit;this.hasMore=h.length>o,h=h.filter(([,d])=>d<o)}let f=new Map(h.reverse());for(let o of f.keys())this.prepend(o);i.forEach(o=>{f.has(o)?(o.size=o.filters[this.filter]?.size,o.style.removeProperty("display"),o.requestUpdate()):(o.style.display="none",o.size=void 0)}),window.scrollTo(0,r),this.updateComplete.then(()=>{let o=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];o&&P(o,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText})})}connectedCallback(){super.connectedCallback(),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.sidenav=document.querySelector("merch-sidenav")}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}get header(){if(!this.filtered)return l`<div id="header">
                <sp-theme  color="light" scale="medium">
                    ${this.searchBar} ${this.filtersButton} ${this.sortButton}
                </sp-theme>
            </div>
            <div id="resultText" aria-live="polite">
                ${this.displayResult?l`<slot name="${this.resultTextSlotName}"></slot>`:""}
            </div>`}get footer(){if(!this.filtered)return l`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get resultTextSlotName(){return v[this.search?this.mobileAndTablet.matches?"mobile":"desktop":"filters"][Math.min(this.resultCount,2)]}get showMoreButton(){if(this.hasMore)return l`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}get filtersButton(){return this.mobileAndTablet.matches?l`<sp-action-button
                  id="filtersButton"
                  variant="secondary"
                  treatment="outline"
                  @click="${this.openFilters}"
                  ><slot name="filtersText"></slot
              ></sp-action-button>`:""}get searchBar(){let t=E(this,"searchText");return this.mobileAndTablet.matches?l`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      @submit="${this.searchSubmit}"
                      placeholder="${t}"
                  ></sp-search>
              </merch-search>`:""}get sortButton(){let t=E(this,"sortText"),r=E(this,"popularityText"),i=E(this,"alphabeticallyText");if(!(t&&r&&i))return;let n=this.sort===c.alphabetical;return l`
            <sp-action-menu
                id="sortButton"
                size="m"
                @change="${this.sortChanged}"
                selects="single"
                value="${n?c.alphabetical:c.authored}"
            >
                <span slot="label-only"
                    >${t}:
                    ${n?i:r}</span
                >
                <sp-menu-item value="${c.authored}"
                    >${r}</sp-menu-item
                >
                <sp-menu-item value="${c.alphabetical}"
                    >${i}</sp-menu-item
                >
            </sp-action-menu>
        `}sortChanged(t){t.target.value===c.authored?m({sort:void 0}):m({sort:t.target.value}),this.dispatchEvent(new CustomEvent(S,{bubbles:!0,composed:!0,detail:{value:t.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(A,{bubbles:!0,composed:!0}));let t=this.page+1;m({page:t}),this.page=t,await this.updateComplete}startDeeplink(){this.stopDeeplink=x(({category:t,filter:r,types:i,sort:n,search:T,single_app:h,page:f})=>{r=r||t,!this.filtered&&r&&r!==this.filter&&setTimeout(()=>{m({page:void 0}),this.page=1},1),this.filtered||(this.filter=r??this.filter),this.types=i??"",this.search=T??"",this.singleApp=h,this.sort=n,this.page=Number(f)||1})}openFilters(t){this.sidenav?.showModal(t)}};a(p,"properties",{filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:c.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single-app",reflect:!0},hasMore:{type:Boolean},displayResult:{type:Boolean,attribute:"display-result"},resultCount:{type:Number},sidenav:{type:Object}}),a(p,"styles",[b]);p.SortOrder=c;customElements.define(D,p);export{p as MerchCardCollection,P as updateLiterals};
