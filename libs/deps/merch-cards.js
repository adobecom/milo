// Wed, 31 Jan 2024 17:14:26 GMT
import{html as a,LitElement as A}from"/libs/deps/lit-all.min.js";import{unsafeHTML as w}from"/libs/deps/lit-all.min.js";var d=class{constructor(t,e){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(e),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var f="hashchange";function v(r=window.location.hash){let t=[],e=r.replace(/^#/,"").split("&");for(let o of e){let[n,i=""]=o.split("=");n&&t.push([n,decodeURIComponent(i)])}return Object.fromEntries(t)}function p(r){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(r).forEach(([e,o])=>{o?t.set(e,o):t.delete(e)}),t.sort(),window.location.hash=decodeURIComponent(t.toString())}function g(r){let t=e=>{let o=v(window.location.hash);r(o)};return t(),window.addEventListener(f,t),()=>{window.removeEventListener(f,t)}}var x=(r,t={})=>{requestAnimationFrame(()=>{r.querySelectorAll("span[data-placeholder]").forEach(e=>{let{placeholder:o}=e.dataset;e.innerText=t[o]??""})})};var y="(max-width: 1200px)",T="(min-width: 768px)",b="(min-width: 1200px)";import{css as C,unsafeCSS as E}from"/libs/deps/lit-all.min.js";var S=C`
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
        grid-template-columns: 1fr 1fr;
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
    @media screen and ${E(T)} {
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
    @media screen and ${E(b)} {
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
`;var u=(r,t)=>r.querySelector(`[slot="${t}"]`).textContent.trim();var $="merch-cards",l={alphabetical:"alphabetical",authored:"authored"},k={filters:["noResultText","resultText","resultsText"],mobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noSearchResultsText","searchResultText","searchResultsText"]},M=(r,{filter:t})=>r.filter(e=>e.filters.hasOwnProperty(t)),B=(r,{types:t})=>t?(t=t.split(","),r.filter(e=>t.some(o=>e.types.includes(o)))):r,R=r=>r.sort((t,e)=>(t.title??"").localeCompare(e.title??"","en",{sensitivity:"base"})),N=(r,{filter:t})=>r.sort((e,o)=>o.filters[t]?.order==null||isNaN(o.filters[t]?.order)?-1:e.filters[t]?.order==null||isNaN(e.filters[t]?.order)?1:e.filters[t].order-o.filters[t].order),L=(r,{search:t})=>t?.length?(t=t.toLowerCase(),r.filter(e=>e.includes(t))):r,m=class extends A{static properties={filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:l.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single-app",reflect:!0},hasMore:{type:Boolean},displayResult:{type:Boolean,attribute:"display-result"},resultCount:{type:Number},sidenav:{type:Object}};#e;#t;mobileAndTablet=new d(this,y);constructor(){super(),this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.#t=0,this.displayResult=!1}render(){return a`${this.header}
            <slot></slot>
            ${this.footer}`}updated(t){if(!this.querySelector("merch-card"))return;let e=[...this.children].filter(s=>s.tagName==="MERCH-CARD");if(e.length===0)return;t.has("singleApp")&&this.singleApp&&e.forEach(s=>{s.updateFilters(s.name===this.singleApp)});let o=this.sort===l.alphabetical?R:N,i=[M,B,L,o].reduce((s,c)=>c(s,this),e).map((s,c)=>[s,c]);if(this.resultCount=i.length,this.page&&this.limit){let s=this.page*this.limit;this.hasMore=i.length>s,i=i.filter(([,c])=>c<s)}let h=new Map(i);this.#t=(this.limit*(this.page-1)+1).toString(),e.forEach(s=>{h.has(s)?(s.style.order=h.get(s),s.style.order===this.#t&&(this.#e=s),s.size=s.filters[this.filter]?.size,s.style.removeProperty("display")):(s.style.display="none",s.size=void 0,s.style.removeProperty("order"))}),this.updateComplete.then(()=>{let s=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];s&&x(s,{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters.selectedText})})}connectedCallback(){super.connectedCallback(),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.sidenav=document.querySelector("merch-sidenav")}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}get header(){if(!this.filtered)return a`<div id="header">
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
        </div>`}get resultTextSlotName(){return k[this.search?this.mobileAndTablet.matches?"mobile":"desktop":"filters"][Math.min(this.resultCount,2)]}get showMoreButton(){if(this.hasMore)return a`<sp-button
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
              ></sp-button>`:""}get searchBar(){let t=u(this,"searchText");return this.mobileAndTablet.matches?a`<merch-search deeplink="search">
                  <sp-search
                      id="searchBar"
                      placeholder="${t}"
                  ></sp-search>
              </merch-search>`:""}get sortButton(){let t=u(this,"sortText"),e=u(this,"popularityText"),o=u(this,"alphabeticallyText");if(!(t&&e&&o))return;let n=this.sort===l.alphabetical,i=n?"":"selected",h=n?"selected":"";return a`
            <overlay-trigger id="sortButton" placement="bottom" type="hint">
                <sp-button
                    slot="trigger"
                    variant="secondary"
                    treatment="outline"
                    >${t}:
                    ${n?o:e}</sp-button
                >
                <sp-popover slot="click-content" tip>
                    <sp-menu @click="${this.sortChanged}">
                        ${w(`<sp-menu-item
                                value="${l.authored}"
                                ${i}
                                >${e}</sp-menu-item>`)} ${w(`<sp-menu-item
                                value="${l.alphabetical}"
                                ${h}
                                >${o}</sp-menu-item
                            >`)}
                    </sp-menu>
                </sp-popover>
            </overlay-trigger>
        `}sortChanged(t){t.target.value===l.authored?p({sort:void 0}):p({sort:t.target.value})}async showMore(){let t=this.page+1;p({page:t}),this.page=t,await this.updateComplete,this.#e.scrollIntoView({behavior:"smooth"})}startDeeplink(){this.stopDeeplink=g(({category:t,filter:e,types:o,sort:n,search:i,single_app:h,page:s})=>{e=e||t,!this.filtered&&e&&e!==this.filter&&setTimeout(()=>{p({page:void 0}),this.page=1},1),this.filtered||(this.filter=e??this.filter),this.types=o??"",this.search=i??"",this.singleApp=h,this.sort=n,this.page=Number(s)||1})}openFilters({target:t}){this.sidenav?.showModal(t)}static styles=[S]};m.SortOrder=l;customElements.define($,m);export{m as MerchCards};
