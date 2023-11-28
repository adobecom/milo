// Tue, 28 Nov 2023 12:50:55 GMT
import{html as a,LitElement as M}from"./lit-all.min.js";import{unsafeHTML as C}from"./lit-all.min.js";var u=class{constructor(t,e){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(e),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var f="hashchange";function E(r=window.location.hash){let t=[],e=r.replace(/^#/,"").split("&");for(let i of e){let[n,o=""]=i.split("=");n&&t.push([n,decodeURIComponent(o)])}return Object.fromEntries(t)}function p(r){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(r).forEach(([e,i])=>{i?t.set(e,i):t.delete(e)}),t.sort(),window.location.hash=decodeURIComponent(t.toString())}function g(r){let t=e=>{let i=E(window.location.hash);r(i)};return t(),window.addEventListener(f,t),()=>{window.removeEventListener(f,t)}}var x=(r,t={})=>{requestAnimationFrame(()=>{r.querySelectorAll("span[data-placeholder]").forEach(e=>{let{placeholder:i}=e.dataset;e.innerText=t[i]??""})})};var T="(max-width: 1200px)",y="(min-width: 900px)",b="(min-width: 1200px)";import{css as v,unsafeCSS as S}from"./lit-all.min.js";var w=v`
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
        gap: var(--consonant-merch-spacing-m);
    }

    #searchBar {
        grid-column: 1 / -1;
        width: 100%;
        max-width: 302px;
    }

    #sortButton {
        justify-self: end;
    }

    #footer {
        order: 1000;
    }

    /* tablets */
    @media screen and ${S(y)} {
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
`;var d=(r,t)=>r.querySelector(`[slot="${t}"]`).textContent.trim();var A="merch-cards",l={alphabetical:"alphabetical",authored:"authored"},B={filters:[,"resultText","resultsText"],mobile:["noResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noResultsText","searchResultText","searchResultsText"]},k=(r,{filter:t})=>r.filter(e=>e.filters.hasOwnProperty(t)),$=(r,{types:t})=>t?(t=t.split(","),r.filter(e=>t.some(i=>e.types.includes(i)))):r,L=r=>r.sort((t,e)=>(t.title??"").localeCompare(e.title??"","en",{sensitivity:"base"})),R=(r,{filter:t})=>r.sort((e,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:e.filters[t]?.order==null||isNaN(e.filters[t]?.order)?1:e.filters[t].order-i.filters[t].order),N=(r,{search:t})=>t?.length?(t=t.toLowerCase(),r.filter(e=>e.includes(t))):r,m=class extends M{static properties={filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:l.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single_app"},hasMore:{type:Boolean},resultCount:{type:Number}};#t;mobileAndTablet=new u(this,T);constructor(){super(),this.filter="all",this.hasMore=!1,this.resultCount=0,this.#t=null}render(){return a`${this.header}
            <slot></slot>
            ${this.footer}`}updated(t){let e=[...this.children].filter(s=>s.tagName==="MERCH-CARD");t.has("singleApp")&&this.singleApp&&e.forEach(s=>{s.updateFilters(s.name===this.singleApp)});let i=this.sort===l.alphabetical?L:R,o=[k,$,N,i].reduce((s,c)=>c(s,this),e).map((s,c)=>[s,c]);if(this.resultCount=o.length,this.page&&this.limit){let s=this.page*this.limit;this.hasMore=o.length>s,o=o.filter(([,c])=>c<s)}o.length>0&&(this.cardToScrollTo=o[o.length-1][0]);let h=new Map(o);e.forEach(s=>{h.has(s)?(s.style.order=h.get(s),s.size=s.filters[this.filter]?.size,s.style.removeProperty("display")):(s.style.display="none",s.size=void 0,s.style.removeProperty("order"))}),this.updateComplete.then(()=>{let s=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];s&&x(s,{resultCount:this.resultCount,searchTerm:this.search,filter:this.#t?.filters.selectedText})})}connectedCallback(){super.connectedCallback(),this.#t||(this.#t=document.querySelector("merch-sidenav")),this.filtered||!this.#t?this.filter=this.filtered:this.startDeeplink(),this.updateComplete.then(()=>{this.prepareShowMore()})}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}get header(){if(!this.filtered)return a`<div id="header">
                <sp-theme theme="spectrum" color="light" scale="medium">
                    ${this.searchBar} ${this.filtersButton} ${this.sortButton}
                </sp-theme>
            </div>
            <div id="resultText">
                <slot name="${this.resultTextSlotName}"></slot>
            </div>`}get footer(){if(!this.filtered)return a`<div id="footer">
            <sp-theme theme="spectrum" color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get resultTextSlotName(){if(this.resultCount==null)return;let t=this.mobileAndTablet.matches;return B[this.search?t?"mobile":"desktop":"filters"][Math.min(this.resultCount,2)]}get showMoreButton(){if(this.hasMore)return a`<sp-button
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
              </merch-search>`:""}get sortButton(){if(this.resultCount<=1)return;let t=d(this,"sortText"),e=d(this,"popularityText"),i=d(this,"alphabeticallyText");if(!(t&&e&&i))return;let n=this.sort===l.alphabetical,o=n?"":"selected",h=n?"selected":"";return a`
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
                        ${C(`<sp-menu-item
                                value="${l.authored}"
                                ${o}
                                >${e}</sp-menu-item>`)} ${C(`<sp-menu-item
                                value="${l.alphabetical}"
                                ${h}
                                >${i}</sp-menu-item
                            >`)}
                    </sp-menu>
                </sp-popover>
            </overlay-trigger>
        `}sortChanged(t){t.target.value===l.authored?p({sort:void 0}):p({sort:t.target.value})}showMore(){p({page:this.page+1}),setTimeout(()=>{this.scrollToShowMore()},1)}prepareShowMore(){this.page?this.limit=this.limit||24:this.page=1}scrollToShowMore(){this.cardToScrollTo.scrollIntoView({behavior:"smooth"})}startDeeplink(){this.stopDeeplink=g(({filter:t,types:e,sort:i,search:n,single_app:o,page:h})=>{!this.filtered&&t&&t!==this.filter&&setTimeout(()=>{p({page:void 0}),this.page=1},1),this.filtered||(this.filter=t??this.filter),this.types=e??"",this.search=n??"",this.singleApp=o,this.sort=i,this.page=Number(h)||this.page})}openFilters({target:t}){this.#t?.showModal(t)}static styles=[w]};m.SortOrder=l;customElements.define(A,m);export{m as MerchCards};
