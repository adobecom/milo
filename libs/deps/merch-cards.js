// Wed, 20 Dec 2023 15:18:15 GMT
import{html as a,LitElement as B}from"/libs/deps/lit-all.min.js";import{unsafeHTML as E}from"/libs/deps/lit-all.min.js";var u=class{constructor(t,e){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(e),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var f="hashchange";function v(r=window.location.hash){let t=[],e=r.replace(/^#/,"").split("&");for(let i of e){let[n,o=""]=i.split("=");n&&t.push([n,decodeURIComponent(o)])}return Object.fromEntries(t)}function p(r){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(r).forEach(([e,i])=>{i?t.set(e,i):t.delete(e)}),t.sort(),window.location.hash=decodeURIComponent(t.toString())}function g(r){let t=e=>{let i=v(window.location.hash);r(i)};return t(),window.addEventListener(f,t),()=>{window.removeEventListener(f,t)}}var x=(r,t={})=>{requestAnimationFrame(()=>{r.querySelectorAll("span[data-placeholder]").forEach(e=>{let{placeholder:i}=e.dataset;e.innerText=t[i]??""})})};var y="(max-width: 1200px)",T="(min-width: 768px)",b="(min-width: 1200px)";import{css as C,unsafeCSS as S}from"/libs/deps/lit-all.min.js";var w=C`
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
        justify-items: baseline;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
        row-gap: var(--consonant-merch-spacing-m);
        align-self: baseline;
    }

    #resultText {
        align-self: baseline;
        min-height: 27px;
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

    sp-menu sp-button {
        min-width: 140px;
    }

    sp-menu {
        min-width: 180px;
    }

    #footer {
        order: 1000;
    }

    /* tablets */
    @media screen and ${S(T)} {
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
    @media screen and ${S(b)} {
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
`;var d=(r,t)=>r.querySelector(`[slot="${t}"]`).textContent.trim();var A="merch-cards",l={alphabetical:"alphabetical",authored:"authored"},R={filters:["noResultText","resultText","resultsText"],mobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noSearchResultsText","searchResultText","searchResultsText"]},$=(r,{filter:t})=>r.filter(e=>e.filters.hasOwnProperty(t)),k=(r,{types:t})=>t?(t=t.split(","),r.filter(e=>t.some(i=>e.types.includes(i)))):r,M=r=>r.sort((t,e)=>(t.title??"").localeCompare(e.title??"","en",{sensitivity:"base"})),L=(r,{filter:t})=>r.sort((e,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:e.filters[t]?.order==null||isNaN(e.filters[t]?.order)?1:e.filters[t].order-i.filters[t].order),N=(r,{search:t})=>t?.length?(t=t.toLowerCase(),r.filter(e=>e.includes(t))):r,m=class extends B{static properties={filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:l.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single_app"},hasMore:{type:Boolean},displayResult:{type:Boolean},resultCount:{type:Number},sidenav:{type:Object}};#e;#t;mobileAndTablet=new u(this,y);constructor(){super(),this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.#t=0,this.displayResult=!1}render(){return a`${this.header}
            <slot></slot>
            ${this.footer}`}updated(t){if(!this.querySelector("merch-card"))return;let e=[...this.children].filter(s=>s.tagName==="MERCH-CARD");if(e.length===0)return;t.has("singleApp")&&this.singleApp&&e.forEach(s=>{s.updateFilters(s.name===this.singleApp)});let i=this.sort===l.alphabetical?M:L,o=[$,k,N,i].reduce((s,c)=>c(s,this),e).map((s,c)=>[s,c]);if(this.resultCount=o.length,this.page&&this.limit){let s=this.page*this.limit;this.hasMore=o.length>s,o=o.filter(([,c])=>c<s)}let h=new Map(o);this.#t=(this.limit*(this.page-1)+1).toString(),e.forEach(s=>{h.has(s)?(s.style.order=h.get(s),s.style.order===this.#t&&(this.#e=s),s.size=s.filters[this.filter]?.size,s.style.removeProperty("display")):(s.style.display="none",s.size=void 0,s.style.removeProperty("order"))}),this.updateComplete.then(()=>{let s=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];s&&x(s,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText})})}connectedCallback(){super.connectedCallback(),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.sidenav=document.querySelector("merch-sidenav")}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}get header(){if(!this.filtered)return a`<div id="header">
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
        </sp-button>`}get filtersButton(){return this.mobileAndTablet.matches?a`<sp-button
                  id="filtersButton"
                  variant="secondary"
                  treatment="outline"
                  @click="${this.openFilters}"
                  ><slot name="filtersText"></slot
              ></sp-button>`:""}get searchBar(){let t=d(this,"searchText");return this.mobileAndTablet.matches?a`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      placeholder="${t}"
                  ></sp-search>
              </merch-search>`:""}get sortButton(){let t=d(this,"sortText"),e=d(this,"popularityText"),i=d(this,"alphabeticallyText");if(!(t&&e&&i))return;let n=this.sort===l.alphabetical,o=n?"":"selected",h=n?"selected":"";return a`
            <overlay-trigger id="sortButton" placement="bottom" type="hint">
                <sp-button
                    slot="trigger"
                    variant="secondary"
                    treatment="outline"
                    >${t}:
                    ${n?i:e}</sp-button
                >
                <sp-popover slot="click-content" tip>
                    <sp-menu @click="${this.sortChanged}">
                        ${E(`<sp-menu-item
                                value="${l.authored}"
                                ${o}
                                >${e}</sp-menu-item>`)} ${E(`<sp-menu-item
                                value="${l.alphabetical}"
                                ${h}
                                >${i}</sp-menu-item
                            >`)}
                    </sp-menu>
                </sp-popover>
            </overlay-trigger>
        `}sortChanged(t){t.target.value===l.authored?p({sort:void 0}):p({sort:t.target.value})}async showMore(){let t=this.page+1;p({page:t}),this.page=t,await this.updateComplete,this.#e.scrollIntoView({behavior:"smooth"})}startDeeplink(){this.stopDeeplink=g(({category:t,filter:e,types:i,sort:n,search:o,single_app:h,page:s})=>{e=e||t,!this.filtered&&e&&e!==this.filter&&setTimeout(()=>{p({page:void 0}),this.page=1},1),this.filtered||(this.filter=e??this.filter),this.types=i??"",this.search=o??"",this.singleApp=h,this.sort=n,this.page=Number(s)||1})}openFilters({target:t}){this.sidenav?.showModal(t)}static styles=[w]};m.SortOrder=l;customElements.define(A,m);export{m as MerchCards};
