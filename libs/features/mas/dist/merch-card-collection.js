var ne=Object.defineProperty;var $=s=>{throw TypeError(s)};var ae=(s,t,e)=>t in s?ne(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var R=(s,t,e)=>ae(s,typeof t!="symbol"?t+"":t,e),U=(s,t,e)=>t.has(s)||$("Cannot "+e);var a=(s,t,e)=>(U(s,t,"read from private field"),e?e.call(s):t.get(s)),g=(s,t,e)=>t.has(s)?$("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(s):t.set(s,e),S=(s,t,e,r)=>(U(s,t,"write to private field"),r?r.call(s,e):t.set(s,e),e),F=(s,t,e)=>(U(s,t,"access private method"),e);import{html as T,LitElement as te,css as me,unsafeCSS as ee,nothing as m}from"../lit-all.min.js";var v="(min-width: 768px)",N="(min-width: 1200px)";var y=class{constructor(t,e){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(e),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var z="hashchange";function ce(s=window.location.hash){let t=[],e=s.replace(/^#/,"").split("&");for(let r of e){let[i,c=""]=r.split("=");i&&t.push([i,decodeURIComponent(c.replace(/\+/g," "))])}return Object.fromEntries(t)}function O(s){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(s).forEach(([i,c])=>{c?t.set(i,c):t.delete(i)}),t.sort();let e=t.toString();if(e===window.location.hash)return;let r=window.scrollY||document.documentElement.scrollTop;window.location.hash=e,window.scrollTo(0,r)}function G(s){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let e=ce(window.location.hash);s(e)};return t(),window.addEventListener(z,t),()=>{window.removeEventListener(z,t)}}var Me=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),we=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var le='span[is="inline-price"][data-wcs-osi]',he='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var de='a[is="upt-link"]',Pe=`${le},${he},${de}`;var B="merch-card-collection:sort",I="merch-card-collection:literals-changed",H="merch-card-collection:sidenav-attached",q="merch-card-collection:showmore",K="merch-sidenav:select",j="aem:load",W="aem:error";var Q="mas:error";var De=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var Ie=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var E={alphabetical:"alphabetical",authored:"authored"};import{css as ue,unsafeCSS as X}from"../lit-all.min.js";var Z=ue`
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
    @media screen and ${X(v)} {
        #header {
            grid-template-columns: 1fr fit-content(100%) fit-content(100%);
        }

        #searchBar {
            grid-column: 1;
        }

        #filtersButton {
            grid-column: 2;
        }

        #sortButton {
            grid-column: 3;
        }
    }

    /* Laptop */
    @media screen and ${X(N)} {
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
`;var pe="mas-commerce-service";var M=(s,t)=>s?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function J(){return document.getElementsByTagName(pe)?.[0]}var re="merch-card-collection",Ee=2e4,fe={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},Te={plans:!0},_e=(s,{filter:t})=>s.filter(e=>e.filters.hasOwnProperty(t)),Ae=(s,{types:t})=>t?(t=t.split(","),s.filter(e=>t.some(r=>e.types.includes(r)))):s,ge=s=>s.sort((t,e)=>(t.title??"").localeCompare(e.title??"","en",{sensitivity:"base"})),xe=(s,{filter:t})=>s.sort((e,r)=>r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?-1:e.filters[t]?.order==null||isNaN(e.filters[t]?.order)?1:e.filters[t].order-r.filters[t].order),Re=(s,{search:t})=>t?.length?(t=t.toLowerCase(),s.filter(e=>(e.title??"").toLowerCase().includes(t))):s,x,P,D,V,se,C=class extends te{constructor(){super();g(this,V);g(this,x,{});g(this,P);g(this,D);this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1}render(){return T`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let r=new Promise(i=>setTimeout(()=>i(!1),Ee));return Promise.race([this.hydrationReady,r])}updated(e){if(!this.querySelector("merch-card"))return;let r=window.scrollY||document.documentElement.scrollTop,i=[...this.children].filter(o=>o.tagName==="MERCH-CARD");if(i.length===0)return;e.has("singleApp")&&this.singleApp&&i.forEach(o=>{o.updateFilters(o.name===this.singleApp)});let c=this.sort===E.alphabetical?ge:xe,l=[_e,Ae,Re,c].reduce((o,h)=>h(o,this),i).map((o,h)=>[o,h]);if(this.resultCount=l.length,this.page&&this.limit){let o=this.page*this.limit;this.hasMore=l.length>o,l=l.filter(([,h])=>h<o)}let p=new Map(l.reverse());for(let o of p.keys())this.prepend(o);i.forEach(o=>{p.has(o)?(o.size=o.filters[this.filter]?.size,o.style.removeProperty("display"),o.requestUpdate()):(o.style.display="none",o.size=void 0)}),window.scrollTo(0,r),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(K,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(I,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){S(this,x,{}),this.overrides?.split(",").forEach(e=>{let[r,i]=e?.split(":");r&&i&&(a(this,x)[r]=i)})}connectedCallback(){super.connectedCallback(),S(this,P,J()),S(this,D,a(this,P).Log.module(re)),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}initializeHeader(){let e=document.createElement("merch-card-collection-header");e.collection=this,e.classList.add(this.variant),this.parentElement.insertBefore(e,this),this.header=e,this.querySelectorAll("[placeholder]").forEach(i=>{let c=i.getAttribute("slot");this.header.placeholderKeys.includes(c)&&this.header.append(i)})}initializePlaceholders(){let e=this.data?.placeholders||{};for(let r of Object.keys(e)){let i=e[r],c=i.includes("<p>")?"div":"p",n=document.createElement(c);n.setAttribute("slot",r),n.setAttribute("placeholder",""),n.innerHTML=i,this.append(n)}}attachSidenav(e,r=!0){e&&(r&&this.parentElement.prepend(e),this.sidenav=e,this.sidenav.variant=this.variant,this.sidenav.classList.add(this.variant),Te[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.initializeHeader(),this.dispatchEvent(new CustomEvent(H)))}async hydrate(){if(this.hydrating)return!1;let e=this.querySelector("aem-fragment");if(!e)return;this.hydrating=!0;let r;this.hydrationReady=new Promise(n=>{r=n});let i=this;function c(n,l){let p={cards:[],hierarchy:[],placeholders:n.placeholders};function o(h,f){for(let u of f){if(u.fieldName==="cards"){if(p.cards.findIndex(A=>A.id===u.identifier)!==-1)continue;p.cards.push(n.references[u.identifier].value);continue}let{fields:_}=n.references[u.identifier].value,b={label:_.label,icon:_.icon,iconLight:_.iconLight,navigationLabel:_.navigationLabel,cards:_.cards.map(A=>l[A]||A),collections:[]};h.push(b),o(b.collections,u.referencesTree)}}return o(p.hierarchy,n.referencesTree),p.hierarchy.length===0&&(i.filtered="all"),p}e.addEventListener(W,n=>{F(this,V,se).call(this,"Error loading AEM fragment",n.detail),this.hydrating=!1,e.remove()}),e.addEventListener(j,async n=>{this.data=c(n.detail,a(this,x));let{cards:l,hierarchy:p}=this.data;for(let f of l){let b=function(ie){for(let k of ie){let Y=k.cards.indexOf(_);if(Y===-1)continue;let oe=k.label.toLowerCase();u.filters[oe]={order:Y+1,size:f.fields.size},b(k.collections)}},u=document.createElement("merch-card"),_=a(this,x)[f.id]||f.id;u.setAttribute("consonant",""),u.setAttribute("style",""),b(p);let A=document.createElement("aem-fragment");A.setAttribute("fragment",_),u.append(A),Object.keys(u.filters).length===0&&(u.filters={all:{order:l.indexOf(f)+1,size:f.fields.size}}),this.append(u)}let o="",h=l[0]?.fields.variant;h.startsWith("plans")&&(h="plans"),this.variant=h,h==="plans"&&l.length===3&&!l.some(f=>f.fields.size?.includes("wide"))&&(o="ThreeColumns"),this.classList.add("merch-card-collection",h,...fe[`${h}${o}`]||[]),this.displayResult=!0,this.hydrating=!1,e.remove(),r()}),await this.hydrationReady}get footer(){if(!this.filtered)return T`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return T`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(e){e.target.value===E.authored?O({sort:void 0}):O({sort:e.target.value}),this.dispatchEvent(new CustomEvent(B,{bubbles:!0,composed:!0,detail:{value:e.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(q,{bubbles:!0,composed:!0}));let e=this.page+1;O({page:e}),this.page=e,await this.updateComplete}startDeeplink(){this.stopDeeplink=G(({category:e,filter:r,types:i,sort:c,search:n,single_app:l,page:p})=>{r=r||e,!this.filtered&&r&&r!==this.filter&&setTimeout(()=>{O({page:void 0}),this.page=1},1),this.filtered||(this.filter=r??this.filter),this.types=i??"",this.search=n??"",this.singleApp=l,this.sort=c,this.page=Number(p)||1})}openFilters(e){this.sidenav?.showModal(e)}};x=new WeakMap,P=new WeakMap,D=new WeakMap,V=new WeakSet,se=function(e,r={},i=!0){a(this,D).error(`merch-card-collection: ${e}`,r),this.failed=!0,i&&this.dispatchEvent(new CustomEvent(Q,{detail:{...r,message:e},bubbles:!0,composed:!0}))},R(C,"properties",{displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:E.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),R(C,"styles",[Z]);C.SortOrder=E;customElements.define(re,C);var Se={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},Ce=(s,t,e)=>{s.querySelectorAll(`[data-placeholder="${t}"]`).forEach(i=>{i.innerText=e||""})},Le={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},be={catalog:"l"},d,L,w=class extends te{constructor(){super();g(this,d);g(this,L);R(this,"tablet",new y(this,v));R(this,"desktop",new y(this,N));this.collection=null,S(this,d,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(I,this.updateLiterals),this.collection?.addEventListener(H,this.handleSidenavAttached),S(this,L,customElements.get("merch-card"))}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(I,this.updateLiterals),this.collection?.removeEventListener(H,this.handleSidenavAttached)}willUpdate(){a(this,d).search=this.getVisibility("search"),a(this,d).filter=this.getVisibility("filter"),a(this,d).sort=this.getVisibility("sort"),a(this,d).result=this.getVisibility("result"),a(this,d).custom=this.getVisibility("custom")}parseVisibilityOptions(e,r){if(!e||!Object.hasOwn(e,r))return null;let i=e[r];return i===!1?!1:i===!0?!0:i.includes(this.currentMedia)}getVisibility(e){let r=a(this,L).getCollectionOptions(this.collection?.variant)?.headerVisibility,i=this.parseVisibilityOptions(r,e);return i!==null?i:this.parseVisibilityOptions(Le,e)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get variant(){return this.collection?.variant}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!a(this,d).search)return m;let e=M(this,"searchText");return e?T`
              <merch-search deeplink="search" id="search">
                  <sp-search
                      id="search-bar"
                      placeholder="${e}"
                      .size=${be[this.variant]}
                  ></sp-search>
              </merch-search>
          `:m}get filterAction(){return a(this,d).filter?this.sidenav?T`
              <sp-action-button
                id="filter"
                variant="secondary"
                treatment="outline"
                @click="${this.openFilters}"
                ><slot name="filtersText"></slot
              ></sp-action-button>
          `:m:m}get sortAction(){if(!a(this,d).sort)return m;let e=M(this,"sortText");if(!e)return;let r=M(this,"popularityText"),i=M(this,"alphabeticallyText");if(!(r&&i))return;let c=this.collection?.sort===E.alphabetical;return T`
              <sp-action-menu
                  id="sort"
                  size="m"
                  @change="${this.collection?.sortChanged}"
                  selects="single"
                  value="${c?E.alphabetical:E.authored}"
              >
                  <span slot="label-only"
                      >${e}:
                      ${c?i:r}</span
                  >
                  <sp-menu-item value="${E.authored}"
                      >${r}</sp-menu-item
                  >
                  <sp-menu-item value="${E.alphabetical}"
                      >${i}</sp-menu-item
                  >
              </sp-action-menu>
          `}get resultSlotName(){let e=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return Se[e][Math.min(this.resultCount,2)]}get resultLabel(){if(!a(this,d).result)return m;if(!this.sidenav)return m;let e=this.search?"search":"filter",r=this.resultCount?this.resultCount===1?"single":"multiple":"none";return T`
            <div id="result" aria-live="polite" type=${e} quantity=${r}>
                <slot name="${this.resultSlotName}"></slot>
            </div>`}get customArea(){if(!a(this,d).custom)return m;let e=a(this,L).getCollectionOptions(this.collection?.variant)?.customHeaderArea;if(!e)return m;let r=e(this.collection);return!r||r===m?m:T`<div id="custom">${r}</div>`}openFilters(e){this.sidenav.showModal(e)}updateLiterals(e){Object.keys(e.detail).forEach(r=>{Ce(this,r,e.detail[r])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return T`
            <sp-theme color="light" scale="medium">
              <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
            </sp-theme>
          `}get placeholderKeys(){return["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]}};d=new WeakMap,L=new WeakMap,R(w,"styles",me`
          :host {
              --merch-card-collection-header-max-width: var(--merch-card-collection-card-width);
              --merch-card-collection-header-margin-bottom: 32px;
              --merch-card-collection-header-column-gap: 8px;
              --merch-card-collection-header-row-gap: 16px;
              --merch-card-collection-header-columns: auto auto;
              --merch-card-collection-header-areas: "search search" 
                                                    "filter sort"
                                                    "result result";
              --merch-card-collection-header-search-max-width: unset;
              --merch-card-collection-header-filter-height: 40px;
              --merch-card-collection-header-filter-font-size: 16px;
              --merch-card-collection-header-filter-padding: 15px;
              --merch-card-collection-header-sort-height: var(--merch-card-collection-header-filter-height);
              --merch-card-collection-header-sort-font-size: var(--merch-card-collection-header-filter-font-size);
              --merch-card-collection-header-sort-padding: var(--merch-card-collection-header-filter-padding);
              --merch-card-collection-header-result-font-size: 14px;
          }
  
          sp-theme {
              font-size: inherit;
          }
  
          #header {
              display: grid;
              column-gap: var(--merch-card-collection-header-column-gap);
              row-gap: var(--merch-card-collection-header-row-gap);
              align-items: center;
              grid-template-columns: var(--merch-card-collection-header-columns);
              grid-template-areas: var(--merch-card-collection-header-areas);
              margin-bottom: var(--merch-card-collection-header-margin-bottom);
              max-width: var(--merch-card-collection-header-max-width);
          }
  
          #header:empty {
              margin-bottom: 0;
          }
          
          #search {
              grid-area: search;
          }
  
          #search sp-search {
              max-width: var(--merch-card-collection-header-search-max-width);
              width: 100%;
          }
  
          #filter {
              grid-area: filter;
              --mod-actionbutton-edge-to-text: var(--merch-card-collection-header-filter-padding);
              --mod-actionbutton-height: var(--merch-card-collection-header-filter-height);
          }
  
          #filter slot[name="filtersText"] {
              font-size: var(--merch-card-collection-header-filter-font-size);
          }
  
          #sort {
              grid-area: sort;
              --mod-actionbutton-edge-to-text: var(--merch-card-collection-header-sort-padding);
              --mod-actionbutton-height: var(--merch-card-collection-header-sort-height);
          }
  
          #sort [slot="label-only"] {
              font-size: var(--merch-card-collection-header-sort-font-size);
          }
  
          #result {
              grid-area: result;
              font-size: var(--merch-card-collection-header-result-font-size);
          }
  
          #result[type="search"][quantity="none"] {
              font-size: inherit;
          }
  
          #custom {
              grid-area: custom;
          }
  
          /* tablets */
          @media screen and ${ee(v)} {
              :host {
                  --merch-card-collection-header-max-width: auto;
                  --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                  --merch-card-collection-header-areas: "search filter sort" 
                                                        "result result result";
              }
          }
  
          /* Laptop */
          @media screen and ${ee(N)} {
              :host {
                  --merch-card-collection-header-columns: 1fr fit-content(100%);
                  --merch-card-collection-header-areas: "result sort";
                  --merch-card-collection-header-result-font-size: inherit;
              }
          }
      `);customElements.define("merch-card-collection-header",w);export{C as MerchCardCollection,w as default};
