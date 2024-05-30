// branch: develop commit: f499abc85176fc7d34f43457efeeb72adb1e6103 Thu, 30 May 2024 14:05:27 GMT
import{html as a,LitElement as N}from"/libs/deps/lit-all.min.js";var m=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};var E="hashchange";function S(r=window.location.hash){let e=[],t=r.replace(/^#/,"").split("&");for(let o of t){let[i,l=""]=o.split("=");i&&e.push([i,decodeURIComponent(l.replace(/\+/g," "))])}return Object.fromEntries(e)}function p(r){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(r).forEach(([i,l])=>{l?e.set(i,l):e.delete(i)}),e.sort();let t=e.toString(),o=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,o)}function x(r){let e=()=>{let t=S(window.location.hash);r(t)};return e(),window.addEventListener(E,e),()=>{window.removeEventListener(E,e)}}var g=(r,e={})=>{r.querySelectorAll("span[data-placeholder]").forEach(t=>{let{placeholder:o}=t.dataset;t.innerText=e[o]??""})};var T="(max-width: 1199px)",y="(min-width: 768px)",C="(min-width: 1200px)";import{css as _,unsafeCSS as b}from"/libs/deps/lit-all.min.js";var w=_`
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
    @media screen and ${b(y)} {
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
    @media screen and ${b(C)} {
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
`;var u=(r,e)=>r.querySelector(`[slot="${e}"]`).textContent.trim();var A="merch-card-collection",n={alphabetical:"alphabetical",authored:"authored"},R={filters:["noResultText","resultText","resultsText"],mobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noSearchResultsText","searchResultText","searchResultsText"]},v=(r,{filter:e})=>r.filter(t=>t.filters.hasOwnProperty(e)),M=(r,{types:e})=>e?(e=e.split(","),r.filter(t=>e.some(o=>t.types.includes(o)))):r,L=r=>r.sort((e,t)=>(e.title??"").localeCompare(t.title??"","en",{sensitivity:"base"})),D=(r,{filter:e})=>r.sort((t,o)=>o.filters[e]?.order==null||isNaN(o.filters[e]?.order)?-1:t.filters[e]?.order==null||isNaN(t.filters[e]?.order)?1:t.filters[e].order-o.filters[e].order),k=(r,{search:e})=>e?.length?(e=e.toLowerCase(),r.filter(t=>(t.title??"").toLowerCase().includes(e))):r,f=class extends N{static properties={filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:n.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single-app",reflect:!0},hasMore:{type:Boolean},displayResult:{type:Boolean,attribute:"display-result"},resultCount:{type:Number},sidenav:{type:Object}};mobileAndTablet=new m(this,T);constructor(){super(),this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1}render(){return a`${this.header}
            <slot></slot>
            ${this.footer}`}updated(e){if(!this.querySelector("merch-card"))return;let t=window.scrollY||document.documentElement.scrollTop,o=[...this.children].filter(s=>s.tagName==="MERCH-CARD");if(o.length===0)return;e.has("singleApp")&&this.singleApp&&o.forEach(s=>{s.updateFilters(s.name===this.singleApp)});let i=this.sort===n.alphabetical?L:D,c=[v,M,k,i].reduce((s,h)=>h(s,this),o).map((s,h)=>[s,h]);if(this.resultCount=c.length,this.page&&this.limit){let s=this.page*this.limit;this.hasMore=c.length>s,c=c.filter(([,h])=>h<s)}let d=new Map(c);o.forEach(s=>{d.has(s)?(s.style.order=d.get(s),s.size=s.filters[this.filter]?.size,s.style.removeProperty("display"),s.requestUpdate()):(s.style.display="none",s.size=void 0,s.style.removeProperty("order"))}),window.scrollTo(0,t),this.updateComplete.then(()=>{let s=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];s&&g(s,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText})})}connectedCallback(){super.connectedCallback(),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.sidenav=document.querySelector("merch-sidenav")}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}get header(){if(!this.filtered)return a`<div id="header">
                <sp-theme theme="spectrum" color="light" scale="medium">
                    ${this.searchBar} ${this.filtersButton} ${this.sortButton}
                </sp-theme>
            </div>
            <div id="resultText">
                ${this.displayResult?a`<slot name="${this.resultTextSlotName}"></slot>`:""}
            </div>`}get footer(){if(!this.filtered)return a`<div id="footer">
            <sp-theme theme="spectrum" color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get resultTextSlotName(){return R[this.search?this.mobileAndTablet.matches?"mobile":"desktop":"filters"][Math.min(this.resultCount,2)]}get showMoreButton(){if(this.hasMore)return a`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}get filtersButton(){return this.mobileAndTablet.matches?a`<sp-action-button
                  id="filtersButton"
                  variant="secondary"
                  treatment="outline"
                  @click="${this.openFilters}"
                  ><slot name="filtersText"></slot
              ></sp-action-button>`:""}get searchBar(){let e=u(this,"searchText");return this.mobileAndTablet.matches?a`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      @submit="${this.searchSubmit}"
                      placeholder="${e}"
                  ></sp-search>
              </merch-search>`:""}get sortButton(){let e=u(this,"sortText"),t=u(this,"popularityText"),o=u(this,"alphabeticallyText");if(!(e&&t&&o))return;let i=this.sort===n.alphabetical;return a`
            <sp-action-menu
                id="sortButton"
                size="m"
                @change="${this.sortChanged}"
                selects="single"
                value="${i?n.alphabetical:n.authored}"
            >
                <span slot="label-only"
                    >${e}:
                    ${i?o:t}</span
                >
                <sp-menu-item value="${n.authored}"
                    >${t}</sp-menu-item
                >
                <sp-menu-item value="${n.alphabetical}"
                    >${o}</sp-menu-item
                >
            </sp-action-menu>
        `}sortChanged(e){e.target.value===n.authored?p({sort:void 0}):p({sort:e.target.value})}async showMore(){let e=this.page+1;p({page:e}),this.page=e,await this.updateComplete}startDeeplink(){this.stopDeeplink=x(({category:e,filter:t,types:o,sort:i,search:l,single_app:c,page:d})=>{t=t||e,!this.filtered&&t&&t!==this.filter&&setTimeout(()=>{p({page:void 0}),this.page=1},1),this.filtered||(this.filter=t??this.filter),this.types=o??"",this.search=l??"",this.singleApp=c,this.sort=i,this.page=Number(d)||1})}openFilters(e){this.sidenav?.showModal(e)}static styles=[w]};f.SortOrder=n;customElements.define(A,f);export{f as MerchCardCollection};
