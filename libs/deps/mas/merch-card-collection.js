var L=Object.defineProperty;var M=(s,e,t)=>e in s?L(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var E=(s,e,t)=>(M(s,typeof e!="symbol"?e+"":e,t),t);import{html as c,LitElement as D}from"../lit-all.min.js";var f=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};var T="hashchange";function O(s=window.location.hash){let e=[],t=s.replace(/^#/,"").split("&");for(let o of t){let[i,n=""]=o.split("=");i&&e.push([i,decodeURIComponent(n.replace(/\+/g," "))])}return Object.fromEntries(e)}function d(s){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(s).forEach(([i,n])=>{n?e.set(i,n):e.delete(i)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let o=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,o)}function x(s){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=O(window.location.hash);s(t)};return e(),window.addEventListener(T,e),()=>{window.removeEventListener(T,e)}}var S="merch-card-collection:sort",A="merch-card-collection:showmore",g="merch-sidenav:select";var C="(max-width: 1199px)",R="(min-width: 768px)",w="(min-width: 1200px)";import{css as v,unsafeCSS as b}from"../lit-all.min.js";var N=v`
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
    @media screen and ${b(R)} {
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
    @media screen and ${b(w)} {
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
`;var u=(s,e)=>s.querySelector(`[slot="${e}"]`)?.textContent?.trim();var P="merch-card-collection",a={alphabetical:"alphabetical",authored:"authored"},B={filters:["noResultText","resultText","resultsText"],mobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noSearchResultsText","searchResultText","searchResultsText"]},y=(s,e={})=>{s.querySelectorAll("span[data-placeholder]").forEach(t=>{let{placeholder:o}=t.dataset;t.innerText=e[o]??""})},H=(s,{filter:e})=>s.filter(t=>t.filters.hasOwnProperty(e)),V=(s,{types:e})=>e?(e=e.split(","),s.filter(t=>e.some(o=>t.types.includes(o)))):s,I=s=>s.sort((e,t)=>(e.title??"").localeCompare(t.title??"","en",{sensitivity:"base"})),k=(s,{filter:e})=>s.sort((t,o)=>o.filters[e]?.order==null||isNaN(o.filters[e]?.order)?-1:t.filters[e]?.order==null||isNaN(t.filters[e]?.order)?1:t.filters[e].order-o.filters[e].order),$=(s,{search:e})=>e?.length?(e=e.toLowerCase(),s.filter(t=>(t.title??"").toLowerCase().includes(e))):s,h=class extends D{constructor(){super();E(this,"mobileAndTablet",new f(this,C));this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1}render(){return c`${this.header}
            <slot></slot>
            ${this.footer}`}updated(t){if(!this.querySelector("merch-card"))return;let o=window.scrollY||document.documentElement.scrollTop,i=[...this.children].filter(r=>r.tagName==="MERCH-CARD");if(i.length===0)return;t.has("singleApp")&&this.singleApp&&i.forEach(r=>{r.updateFilters(r.name===this.singleApp)});let n=this.sort===a.alphabetical?I:k,l=[H,V,$,n].reduce((r,p)=>p(r,this),i).map((r,p)=>[r,p]);if(this.resultCount=l.length,this.page&&this.limit){let r=this.page*this.limit;this.hasMore=l.length>r,l=l.filter(([,p])=>p<r)}let m=new Map(l.reverse());for(let r of m.keys())this.prepend(r);i.forEach(r=>{m.has(r)?(r.size=r.filters[this.filter]?.size,r.style.removeProperty("display"),r.requestUpdate()):(r.style.display="none",r.size=void 0)}),window.scrollTo(0,o),this.updateComplete.then(()=>{let r=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];r&&(this.sidenav?.filters?.addEventListener(g,()=>{y(r,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText})}),y(r,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText}))})}connectedCallback(){super.connectedCallback(),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.sidenav=document.querySelector("merch-sidenav")}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}get header(){if(!this.filtered)return c`<div id="header">
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
        </div>`}get resultTextSlotName(){return B[this.search?this.mobileAndTablet.matches?"mobile":"desktop":"filters"][Math.min(this.resultCount,2)]}get showMoreButton(){if(this.hasMore)return c`<sp-button
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
              ></sp-action-button>`:""}get searchBar(){let t=u(this,"searchText");return this.mobileAndTablet.matches?c`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      @submit="${this.searchSubmit}"
                      placeholder="${t}"
                  ></sp-search>
              </merch-search>`:""}get sortButton(){let t=u(this,"sortText"),o=u(this,"popularityText"),i=u(this,"alphabeticallyText");if(!(t&&o&&i))return;let n=this.sort===a.alphabetical;return c`
            <sp-action-menu
                id="sortButton"
                size="m"
                @change="${this.sortChanged}"
                selects="single"
                value="${n?a.alphabetical:a.authored}"
            >
                <span slot="label-only"
                    >${t}:
                    ${n?i:o}</span
                >
                <sp-menu-item value="${a.authored}"
                    >${o}</sp-menu-item
                >
                <sp-menu-item value="${a.alphabetical}"
                    >${i}</sp-menu-item
                >
            </sp-action-menu>
        `}sortChanged(t){t.target.value===a.authored?d({sort:void 0}):d({sort:t.target.value}),this.dispatchEvent(new CustomEvent(S,{bubbles:!0,composed:!0,detail:{value:t.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(A,{bubbles:!0,composed:!0}));let t=this.page+1;d({page:t}),this.page=t,await this.updateComplete}startDeeplink(){this.stopDeeplink=x(({category:t,filter:o,types:i,sort:n,search:_,single_app:l,page:m})=>{o=o||t,!this.filtered&&o&&o!==this.filter&&setTimeout(()=>{d({page:void 0}),this.page=1},1),this.filtered||(this.filter=o??this.filter),this.types=i??"",this.search=_??"",this.singleApp=l,this.sort=n,this.page=Number(m)||1})}openFilters(t){this.sidenav?.showModal(t)}};E(h,"properties",{filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:a.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single-app",reflect:!0},hasMore:{type:Boolean},displayResult:{type:Boolean,attribute:"display-result"},resultCount:{type:Number},sidenav:{type:Object}}),E(h,"styles",[N]);h.SortOrder=a;customElements.define(P,h);export{h as MerchCardCollection,y as updateLiterals};
//# sourceMappingURL=merch-card-collection.js.map
