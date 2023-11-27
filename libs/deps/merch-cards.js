// Fri, 24 Nov 2023 15:57:08 GMT
import{html as a,LitElement as M}from"./lit-all.min.js";import{unsafeHTML as C}from"./lit-all.min.js";var d=class{constructor(t,e){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(e),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var f="hashchange";function E(r=window.location.hash){let t=[],e=r.replace(/^#/,"").split("&");for(let o of e){let[n,i=""]=o.split("=");n&&t.push([n,decodeURIComponent(i)])}return Object.fromEntries(t)}function p(r){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(r).forEach(([e,o])=>{o?t.set(e,o):t.delete(e)}),t.sort(),window.location.hash=decodeURIComponent(t.toString())}function g(r){let t=e=>{let o=E(window.location.hash);r(o)};return t(),window.addEventListener(f,t),()=>{window.removeEventListener(f,t)}}var T=(r,t={})=>{r.querySelectorAll("span[data-placeholder]").forEach(e=>{let{placeholder:o}=e.dataset;e.innerText=t[o]??""})};var x="(max-width: 1200px)",y="(min-width: 900px)",b="(min-width: 1200px)";import{css as v,unsafeCSS as S}from"./lit-all.min.js";var w=v`
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
`;var u=(r,t)=>r.querySelector(`[slot="${t}"]`).textContent.trim();var B="merch-cards",l={alphabetical:"alphabetical",authored:"authored"},$={filters:[,"resultText","resultsText"],mobile:["noResultsMobileText","searchResultMobileText","searchResultsMobileText"],desktop:["noResultsText","searchResultText","searchResultsText"]},A=(r,{filter:t})=>r.filter(e=>e.filters.hasOwnProperty(t)),k=(r,{types:t})=>t?(t=t.split(","),r.filter(e=>t.some(o=>e.types.includes(o)))):r,L=r=>r.sort((t,e)=>(t.title??"").localeCompare(e.title??"","en",{sensitivity:"base"})),R=(r,{filter:t})=>r.sort((e,o)=>o.filters[t]?.order==null||isNaN(o.filters[t]?.order)?-1:e.filters[t]?.order==null||isNaN(e.filters[t]?.order)?1:e.filters[t].order-o.filters[t].order),N=(r,{search:t})=>t?.length?(t=t.toLowerCase(),r.filter(e=>e.includes(t))):r,m=class extends M{static properties={filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:String,attribute:"sort",default:l.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single_app"},hasMore:{type:Boolean},resultCount:{type:Number}};mobileAndTablet=new d(this,x);constructor(){super(),this.filter="all",this.hasMore=!1,this.resultCount=0}render(){return a`${this.header}
            <slot></slot>
            ${this.footer}`}updated(t){let e=[...this.children].filter(s=>s.tagName==="MERCH-CARD");t.has("singleApp")&&this.singleApp&&e.forEach(s=>{s.updateFilters(s.name===this.singleApp)});let o=this.sort===l.alphabetical?L:R,i=[A,k,N,o].reduce((s,c)=>c(s,this),e).map((s,c)=>[s,c]);if(this.resultCount=i.length,this.page&&this.limit){let s=this.page*this.limit;this.hasMore=i.length>s,i=i.filter(([,c])=>c<s)}i.length>0&&(this.cardToScrollTo=i[i.length-1][0]);let h=new Map(i);e.forEach(s=>{h.has(s)?(s.style.order=h.get(s),s.size=s.filters[this.filter]?.size,s.style.removeProperty("display")):(s.style.display="none",s.size=void 0,s.style.removeProperty("order"))}),this.updateComplete.then(()=>{let s=this.shadowRoot.getElementById("resultText")?.firstElementChild?.assignedElements?.()?.[0];s&&T(s,{resultCount:this.resultCount,searchTerm:this.search})})}connectedCallback(){super.connectedCallback(),this.filtered?this.filter=this.filtered:this.startDeeplink(),this.updateComplete.then(()=>{this.prepareShowMore()})}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}get header(){if(!this.filtered)return a`<div id="header">
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
        </div>`}get resultTextSlotName(){if(this.resultCount==null)return;let t=this.mobileAndTablet.matches;return $[this.search?t?"mobile":"desktop":"filters"][Math.min(this.resultCount,2)]}get showMoreButton(){if(this.hasMore)return a`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}get filtersButton(){return this.mobileAndTablet.matches?a` <sp-button
                  id="filtersButton"
                  variant="secondary"
                  treatment="outline"
                  @click="${this.openFilters}"
                  ><slot name="filtersText"></slot
              ></sp-button>`:""}get searchBar(){let t=u(this,"searchText");return this.mobileAndTablet.matches?a` <sp-search
                  id="searchBar"
                  placeholder="${t}"
                  ></sp-button>`:""}get sortButton(){if(this.resultCount<=1)return;let t=u(this,"sortText"),e=u(this,"popularityText"),o=u(this,"alphabeticallyText");if(!(t&&e&&o))return;let n=this.sort===l.alphabetical,i=n?"":"selected",h=n?"selected":"";return a`
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
                        ${C(`<sp-menu-item
                                value="${l.authored}"
                                ${i}
                                >${e}</sp-menu-item>`)} ${C(`<sp-menu-item
                                value="${l.alphabetical}"
                                ${h}
                                >${o}</sp-menu-item
                            >`)}
                    </sp-menu>
                </sp-popover>
            </overlay-trigger>
        `}sortChanged(t){t.target.value===l.authored?p({sort:void 0}):p({sort:t.target.value})}showMore(){p({page:this.page+1}),setTimeout(()=>{this.scrollToShowMore()},1)}prepareShowMore(){this.page?this.limit=this.limit||24:this.page=1}scrollToShowMore(){this.cardToScrollTo.scrollIntoView({behavior:"smooth"})}startDeeplink(){this.stopDeeplink=g(({filter:t,types:e,sort:o,search:n,single_app:i,page:h})=>{!this.filtered&&t&&t!==this.filter&&setTimeout(()=>{p({page:void 0}),this.page=1},1),this.filtered||(this.filter=t??this.filter),this.types=e??"",this.search=n??"",this.singleApp=i,this.sort=o,this.page=Number(h)||this.page})}openFilters(){let t=document.querySelector("merch-sidenav");t&&t.open()}static styles=[w]};m.SortOrder=l;customElements.define(B,m);export{m as MerchCards};
