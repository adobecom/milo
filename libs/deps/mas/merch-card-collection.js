var M=Object.defineProperty;var O=(r,e,t)=>e in r?M(r,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[e]=t;var f=(r,e,t)=>O(r,typeof e!="symbol"?e+"":e,t);import{html as d,LitElement as P}from"../lit-all.min.js";var _=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};var g="hashchange";function v(r=window.location.hash){let e=[],t=r.replace(/^#/,"").split("&");for(let o of t){let[n,i=""]=o.split("=");n&&e.push([n,decodeURIComponent(i.replace(/\+/g," "))])}return Object.fromEntries(e)}function u(r){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(r).forEach(([n,i])=>{i?e.set(n,i):e.delete(n)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let o=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,o)}function A(r){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=v(window.location.hash);r(t)};return e(),window.addEventListener(g,e),()=>{window.removeEventListener(g,e)}}var R="merch-card-collection:sort",S="merch-card-collection:showmore";var C="(max-width: 1199px)",w="(min-width: 768px)",b="(min-width: 1200px)";import{css as D,unsafeCSS as y}from"../lit-all.min.js";var N=D`
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
    @media screen and ${y(w)} {
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
    @media screen and ${y(b)} {
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
`;var E=(r,e)=>r.querySelector(`[slot="${e}"]`)?.textContent?.trim();var k="merch-card-collection",l={alphabetical:"alphabetical",authored:"authored"},B={filters:["noResultText","resultText","resultsText"],mobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noSearchResultsText","searchResultText","searchResultsText"]},H=(r,e={})=>{r.querySelectorAll("span[data-placeholder]").forEach(t=>{let{placeholder:o}=t.dataset;t.innerText=e[o]??""})},I=(r,{filter:e})=>r.filter(t=>t.filters.hasOwnProperty(e)),V=(r,{types:e})=>e?(e=e.split(","),r.filter(t=>e.some(o=>t.types.includes(o)))):r,F=r=>r.sort((e,t)=>(e.title??"").localeCompare(t.title??"","en",{sensitivity:"base"})),$=(r,{filter:e})=>r.sort((t,o)=>o.filters[e]?.order==null||isNaN(o.filters[e]?.order)?-1:t.filters[e]?.order==null||isNaN(t.filters[e]?.order)?1:t.filters[e].order-o.filters[e].order),U=(r,{search:e})=>e?.length?(e=e.toLowerCase(),r.filter(t=>(t.title??"").toLowerCase().includes(e))):r,p=class extends P{constructor(){super();f(this,"mobileAndTablet",new _(this,C));this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1}render(){return d`${this.header}
            <slot></slot>
            ${this.footer}`}checkReady(){return Promise.resolve}updated(t){if(!this.querySelector("merch-card"))return;let o=window.scrollY||document.documentElement.scrollTop,n=[...this.children].filter(s=>s.tagName==="MERCH-CARD");if(n.length===0)return;t.has("singleApp")&&this.singleApp&&n.forEach(s=>{s.updateFilters(s.name===this.singleApp)});let i=this.sort===l.alphabetical?F:$,c=[I,V,U,i].reduce((s,h)=>h(s,this),n).map((s,h)=>[s,h]);if(this.resultCount=c.length,this.page&&this.limit){let s=this.page*this.limit;this.hasMore=c.length>s,c=c.filter(([,h])=>h<s)}let a=new Map(c.reverse());for(let s of a.keys())this.prepend(s);n.forEach(s=>{a.has(s)?(s.size=s.filters[this.filter]?.size,s.style.removeProperty("display"),s.requestUpdate()):(s.style.display="none",s.size=void 0)}),window.scrollTo(0,o),this.updateComplete.then(()=>{let s=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];s&&H(s,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText})})}connectedCallback(){super.connectedCallback(),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.sidenav=document.querySelector("merch-sidenav");let t=this.getAttribute("fragment");t&&this.populateFromFragment(t)}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}async populateFromFragment(t){this.removeAttribute("fragment");let o=`https://www.stage.adobe.com/mas/io/fragment?id=${t}&api_key=nico&locale=fr_FR`,n=await fetch(o).catch(a=>console.log(a.message));n?.ok||console.log(`${n.status} ${n.statusText}`);let i=await n.json(),m;await customElements.whenDefined("aem-fragment").then(()=>{m=document.createElement("aem-fragment").cache});let c=Object.keys(i.fields.cards).map(a=>i.fields.cards[a]);m.add(...c);for(let a of i.fields.categories);for(let a of c){let s=document.createElement("merch-card");s.setAttribute("consonant",""),s.setAttribute("style","");let h=document.createElement("aem-fragment");h.setAttribute("fragment",a.id),s.append(h),s.filters={};for(let x of i.fields.categories){let T=x.cards.indexOf(a.id);if(T===-1)continue;let L=x.label.toLowerCase();s.filters[L]={order:T+1}}this.append(s)}this.displayResult=!0}get header(){if(!this.filtered)return d`<div id="header">
                <sp-theme  color="light" scale="medium">
                    ${this.searchBar} ${this.filtersButton} ${this.sortButton}
                </sp-theme>
            </div>
            <div id="resultText" aria-live="polite">
                ${this.displayResult?d`<slot name="${this.resultTextSlotName}"></slot>`:""}
            </div>`}get footer(){if(!this.filtered)return d`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get resultTextSlotName(){return B[this.search?this.mobileAndTablet.matches?"mobile":"desktop":"filters"][Math.min(this.resultCount,2)]}get showMoreButton(){if(this.hasMore)return d`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}get filtersButton(){return this.mobileAndTablet.matches?d`<sp-action-button
                  id="filtersButton"
                  variant="secondary"
                  treatment="outline"
                  @click="${this.openFilters}"
                  ><slot name="filtersText"></slot
              ></sp-action-button>`:""}get searchBar(){let t=E(this,"searchText");return this.mobileAndTablet.matches?d`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      @submit="${this.searchSubmit}"
                      placeholder="${t}"
                  ></sp-search>
              </merch-search>`:""}get sortButton(){let t=E(this,"sortText"),o=E(this,"popularityText"),n=E(this,"alphabeticallyText");if(!(t&&o&&n))return;let i=this.sort===l.alphabetical;return d`
            <sp-action-menu
                id="sortButton"
                size="m"
                @change="${this.sortChanged}"
                selects="single"
                value="${i?l.alphabetical:l.authored}"
            >
                <span slot="label-only"
                    >${t}:
                    ${i?n:o}</span
                >
                <sp-menu-item value="${l.authored}"
                    >${o}</sp-menu-item
                >
                <sp-menu-item value="${l.alphabetical}"
                    >${n}</sp-menu-item
                >
            </sp-action-menu>
        `}sortChanged(t){t.target.value===l.authored?u({sort:void 0}):u({sort:t.target.value}),this.dispatchEvent(new CustomEvent(R,{bubbles:!0,composed:!0,detail:{value:t.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(S,{bubbles:!0,composed:!0}));let t=this.page+1;u({page:t}),this.page=t,await this.updateComplete}startDeeplink(){this.stopDeeplink=A(({category:t,filter:o,types:n,sort:i,search:m,single_app:c,page:a})=>{o=o||t,!this.filtered&&o&&o!==this.filter&&setTimeout(()=>{u({page:void 0}),this.page=1},1),this.filtered||(this.filter=o??this.filter),this.types=n??"",this.search=m??"",this.singleApp=c,this.sort=i,this.page=Number(a)||1})}openFilters(t){this.sidenav?.showModal(t)}};f(p,"properties",{filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:l.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single-app",reflect:!0},hasMore:{type:Boolean},displayResult:{type:Boolean,attribute:"display-result"},resultCount:{type:Number},sidenav:{type:Object}}),f(p,"styles",[N]);p.SortOrder=l;customElements.define(k,p);export{p as MerchCardCollection,H as updateLiterals};
//# sourceMappingURL=merch-card-collection.js.map
