var Nn=Object.defineProperty;var Mn=e=>{throw TypeError(e)};var ro=(e,t,r)=>t in e?Nn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var no=(e,t)=>{for(var r in t)Nn(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>ro(e,typeof t!="symbol"?t+"":t,r),or=(e,t,r)=>t.has(e)||Mn("Cannot "+r);var P=(e,t,r)=>(or(e,t,"read from private field"),r?r.call(e):t.get(e)),$=(e,t,r)=>t.has(e)?Mn("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),X=(e,t,r,n)=>(or(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),yt=(e,t,r)=>(or(e,t,"access private method"),r);import{html as Cn,LitElement as Rc}from"../lit-all.min.js";var On="hashchange";function ao(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let n of r){let[a,i=""]=n.split("=");a&&t.push([a,decodeURIComponent(i.replace(/\+/g," "))])}return Object.fromEntries(t)}function Ke(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([a,i])=>{i?t.set(a,i):t.delete(a)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let n=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,n)}function In(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=ao(window.location.hash);e(r)};return t(),window.addEventListener(On,t),()=>{window.removeEventListener(On,t)}}var Mr={};no(Mr,{CLASS_NAME_FAILED:()=>fr,CLASS_NAME_HIDDEN:()=>oo,CLASS_NAME_PENDING:()=>gr,CLASS_NAME_RESOLVED:()=>xr,CheckoutWorkflow:()=>So,CheckoutWorkflowStep:()=>j,Commitment:()=>ve,ERROR_MESSAGE_BAD_REQUEST:()=>Er,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>vo,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>br,EVENT_AEM_ERROR:()=>ur,EVENT_AEM_LOAD:()=>mr,EVENT_MAS_ERROR:()=>pr,EVENT_MAS_READY:()=>bo,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>xo,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>cr,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>Re,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>hr,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>Ne,EVENT_MERCH_CARD_COLLECTION_SORT:()=>lr,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>go,EVENT_MERCH_OFFER_READY:()=>lo,EVENT_MERCH_OFFER_SELECT_READY:()=>ho,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>fo,EVENT_MERCH_SEARCH_CHANGE:()=>Eo,EVENT_MERCH_SIDENAV_SELECT:()=>dr,EVENT_MERCH_STOCK_CHANGE:()=>uo,EVENT_MERCH_STORAGE_CHANGE:()=>po,EVENT_OFFER_SELECTED:()=>mo,EVENT_TYPE_FAILED:()=>vr,EVENT_TYPE_READY:()=>Tt,EVENT_TYPE_RESOLVED:()=>yr,Env:()=>ce,FF_DEFAULTS:()=>xe,HEADER_X_REQUEST_ID:()=>Qe,LOG_NAMESPACE:()=>Tr,Landscape:()=>ge,MARK_DURATION_SUFFIX:()=>Rr,MARK_START_SUFFIX:()=>Lr,MODAL_TYPE_3_IN_1:()=>ye,NAMESPACE:()=>io,PARAM_AOS_API_KEY:()=>yo,PARAM_ENV:()=>Ar,PARAM_LANDSCAPE:()=>_r,PARAM_MAS_PREVIEW:()=>Sr,PARAM_WCS_API_KEY:()=>To,PROVIDER_ENVIRONMENT:()=>Cr,SELECTOR_MAS_CHECKOUT_LINK:()=>Hn,SELECTOR_MAS_ELEMENT:()=>sr,SELECTOR_MAS_INLINE_PRICE:()=>re,SELECTOR_MAS_SP_BUTTON:()=>co,SELECTOR_MAS_UPT_LINK:()=>Dn,SORT_ORDER:()=>J,STATE_FAILED:()=>ne,STATE_PENDING:()=>fe,STATE_RESOLVED:()=>le,TAG_NAME_SERVICE:()=>so,TEMPLATE_PRICE:()=>Ao,TEMPLATE_PRICE_ANNUAL:()=>wo,TEMPLATE_PRICE_LEGAL:()=>Nr,TEMPLATE_PRICE_STRIKETHROUGH:()=>_o,Term:()=>Z,WCS_PROD_URL:()=>wr,WCS_STAGE_URL:()=>Pr});var ve=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),Z=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),io="merch",oo="hidden",Tt="wcms:commerce:ready",so="mas-commerce-service",re='span[is="inline-price"][data-wcs-osi]',Hn='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',co="sp-button[data-wcs-osi]",Dn='a[is="upt-link"]',sr=`${re},${Hn},${Dn}`,lo="merch-offer:ready",ho="merch-offer-select:ready",cr="merch-card:action-menu-toggle",mo="merch-offer:selected",uo="merch-stock:change",po="merch-storage:change",fo="merch-quantity-selector:change",go="merch-card-quantity:change",xo="merch-modal:addon-and-quantity-update",Eo="merch-search:change",lr="merch-card-collection:sort",Re="merch-card-collection:literals-changed",Ne="merch-card-collection:sidenav-attached",hr="merch-card-collection:showmore",dr="merch-sidenav:select",mr="aem:load",ur="aem:error",bo="mas:ready",pr="mas:error",fr="placeholder-failed",gr="placeholder-pending",xr="placeholder-resolved",Er="Bad WCS request",br="Commerce offer not found",vo="Literals URL not provided",vr="mas:failed",yr="mas:resolved",Tr="mas/commerce",Sr="mas.preview",Ar="commerce.env",_r="commerce.landscape",yo="commerce.aosKey",To="commerce.wcsKey",wr="https://www.adobe.com/web_commerce_artifact",Pr="https://www.stage.adobe.com/web_commerce_artifact_stage",ne="failed",fe="pending",le="resolved",ge={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},Qe="X-Request-Id",j=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),So="UCv3",ce=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),Cr={PRODUCTION:"PRODUCTION"},ye={TWP:"twp",D2P:"d2p",CRM:"crm"},Lr=":start",Rr=":duration",Ao="price",_o="price-strikethrough",wo="annual",Nr="legal",xe="mas-ff-defaults",J={alphabetical:"alphabetical",authored:"authored"};import{css as Po,unsafeCSS as kn}from"../lit-all.min.js";var ae="(max-width: 767px)",St="(max-width: 1199px)",H="(min-width: 768px)",M="(min-width: 1200px)",Ee="(min-width: 1600px)";function At(){return window.matchMedia(ae)}function _t(){return window.matchMedia(M)}function wt(){return At().matches}function Pt(){return _t().matches}var Un=Po`
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
    @media screen and ${kn(H)} {
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
    @media screen and ${kn(M)} {
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
`;var Co="mas-commerce-service";var Ze=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function Me(e,t={},r=null,n=null){let a=n?document.createElement(e,{is:n}):document.createElement(e);r instanceof HTMLElement?a.appendChild(r):a.innerHTML=r;for(let[i,o]of Object.entries(t))a.setAttribute(i,o);return a}function Ct(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function Bn(){return window.matchMedia("(max-width: 1024px)").matches}function Fn(){return document.getElementsByTagName(Co)?.[0]}var Gn="tacocat.js";var Or=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),$n=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function R(e,t={},{metadata:r=!0,search:n=!0,storage:a=!0}={}){let i;if(n&&i==null){let o=new URLSearchParams(window.location.search),s=Oe(n)?n:e;i=o.get(s)}if(a&&i==null){let o=Oe(a)?a:e;i=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&i==null){let o=Ro(Oe(r)?r:e);i=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return i??t[e]}var Lo=e=>typeof e=="boolean",Lt=e=>typeof e=="function",Rt=e=>typeof e=="number",Vn=e=>e!=null&&typeof e=="object";var Oe=e=>typeof e=="string",zn=e=>Oe(e)&&e,Je=e=>Rt(e)&&Number.isFinite(e)&&e>0;function Nt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function x(e,t){if(Lo(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function et(e,t,r){let n=Object.values(t);return n.find(a=>Or(a,e))??r??n[0]}function Ro(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function jn(e,t=1){return Rt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var No=Date.now(),Ir=()=>`(+${Date.now()-No}ms)`,Mt=new Set,Mo=x(R("tacocat.debug",{},{metadata:!1}),!1);function Yn(e){let t=`[${Gn}/${e}]`,r=(o,s,...l)=>o?!0:(a(s,...l),!1),n=Mo?(o,...s)=>{console.debug(`${t} ${o}`,...s,Ir())}:()=>{},a=(o,...s)=>{let l=`${t} ${o}`;Mt.forEach(([c])=>c(l,...s))};return{assert:r,debug:n,error:a,warn:(o,...s)=>{let l=`${t} ${o}`;Mt.forEach(([,c])=>c(l,...s))}}}function Oo(e,t){let r=[e,t];return Mt.add(r),()=>{Mt.delete(r)}}Oo((e,...t)=>{console.error(e,...t,Ir())},(e,...t)=>{console.warn(e,...t,Ir())});var Io="no promo",qn="promo-tag",Ho="yellow",Do="neutral",ko=(e,t,r)=>{let n=i=>i||Io,a=r?` (was "${n(t)}")`:"";return`${n(e)}${a}`},Uo="cancel-context",Ot=(e,t)=>{let r=e===Uo,n=!r&&e?.length>0,a=(n||r)&&(t&&t!=e||!t&&!r),i=a&&n||!a&&!!t,o=i?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:i?qn:`${qn} no-promo`,text:ko(o,t,a),variant:i?Ho:Do,isOverriden:a}};var Hr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Hr||(Hr={}));var K;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(K||(K={}));var ee;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(ee||(ee={}));var Dr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Dr||(Dr={}));var kr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(kr||(kr={}));var Ur;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Ur||(Ur={}));var Br;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Br||(Br={}));var Fr="ABM",Gr="PUF",$r="M2M",Vr="PERPETUAL",zr="P3Y",Bo="TAX_INCLUSIVE_DETAILS",Fo="TAX_EXCLUSIVE",Wn={ABM:Fr,PUF:Gr,M2M:$r,PERPETUAL:Vr,P3Y:zr},tl={[Fr]:{commitment:K.YEAR,term:ee.MONTHLY},[Gr]:{commitment:K.YEAR,term:ee.ANNUAL},[$r]:{commitment:K.MONTH,term:ee.MONTHLY},[Vr]:{commitment:K.PERPETUAL,term:void 0},[zr]:{commitment:K.THREE_MONTHS,term:ee.P3Y}},Xn="Value is not an offer",It=e=>{if(typeof e!="object")return Xn;let{commitment:t,term:r}=e,n=Go(t,r);return{...e,planType:n}};var Go=(e,t)=>{switch(e){case void 0:return Xn;case"":return"";case K.YEAR:return t===ee.MONTHLY?Fr:t===ee.ANNUAL?Gr:"";case K.MONTH:return t===ee.MONTHLY?$r:"";case K.PERPETUAL:return Vr;case K.TERM_LICENSE:return t===ee.P3Y?zr:"";default:return""}};function Kn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:a,priceWithoutDiscountAndTax:i,taxDisplay:o}=t;if(o!==Bo)return e;let s={...e,priceDetails:{...t,price:a??r,priceWithoutDiscount:i??n,taxDisplay:Fo}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var $o="mas-commerce-service",Vo={requestId:Qe,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function tt(e,{country:t,forceTaxExclusive:r,perpetual:n}){let a;if(e.length<2)a=e;else{let i=t==="GB"?"EN":"MULT";e.sort((o,s)=>o.language===i?-1:s.language===i?1:0),e.sort((o,s)=>!o.term&&s.term?-1:o.term&&!s.term?1:0),a=[e[0]]}return r&&(a=a.map(Kn)),a}var Ht=e=>window.setTimeout(e);function Ie(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(jn).filter(Je);return r.length||(r=[t]),r}function Dt(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(zn)}function V(){return document.getElementsByTagName($o)?.[0]}function Qn(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[n,a]of Object.entries(Vo)){let i=r.get(a);i&&(i=i.replace(/[,;]/g,"|"),i=i.replace(/[| ]+/g,"|"),t[n]=i)}return t}var Te={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Zn=1e3;function zo(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function Jn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:a,status:i}=e;return[n,i,a].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Te.serializableTypes.includes(r))return r}return e}function jo(e,t){if(!Te.ignoredProperties.includes(e))return Jn(t)}var jr={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,n=[],a=[],i=t;r.forEach(c=>{c!=null&&(zo(c)?n:a).push(c)}),n.length&&(i+=" "+n.map(Jn).join(" "));let{pathname:o,search:s}=window.location,l=`${Te.delimiter}page=${o}${s}`;l.length>Zn&&(l=`${l.slice(0,Zn)}<trunc>`),i+=l,a.length&&(i+=`${Te.delimiter}facts=`,i+=JSON.stringify(a,jo)),window.lana?.log(i,Te)}};function kt(e){Object.assign(Te,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in Te&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var ea={LOCAL:"local",PROD:"prod",STAGE:"stage"},Yr={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},qr=new Set,Wr=new Set,ta=new Map,ra={append({level:e,message:t,params:r,timestamp:n,source:a}){console[e](`${n}ms [${a}] %c${t}`,"font-weight: bold;",...r)}},na={filter:({level:e})=>e!==Yr.DEBUG},Yo={filter:()=>!1};function qo(e,t,r,n,a){return{level:e,message:t,namespace:r,get params(){return n.length===1&&Lt(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:a,timestamp:performance.now().toFixed(3)}}function Wo(e){[...Wr].every(t=>t(e))&&qr.forEach(t=>t(e))}function aa(e){let t=(ta.get(e)??0)+1;ta.set(e,t);let r=`${e} #${t}`,n={id:r,namespace:e,module:a=>aa(`${n.namespace}/${a}`),updateConfig:kt};return Object.values(Yr).forEach(a=>{n[a]=(i,...o)=>Wo(qo(a,i,e,o,r))}),Object.seal(n)}function Ut(...e){e.forEach(t=>{let{append:r,filter:n}=t;Lt(n)&&Wr.add(n),Lt(r)&&qr.add(r)})}function Xo(e={}){let{name:t}=e,r=x(R("commerce.debug",{search:!0,storage:!0}),t===ea.LOCAL);return Ut(r?ra:na),t===ea.PROD&&Ut(jr),te}function Ko(){qr.clear(),Wr.clear()}var te={...aa(Tr),Level:Yr,Plugins:{consoleAppender:ra,debugFilter:na,quietFilter:Yo,lanaAppender:jr},init:Xo,reset:Ko,use:Ut};var He=class e extends Error{constructor(t,r,n){if(super(t,{cause:n}),this.name="MasError",r.response){let a=r.response.headers?.get(Qe);a&&(r.requestId=a),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([n,a])=>`${n}: ${JSON.stringify(a)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var Qo={[ne]:fr,[fe]:gr,[le]:xr},Zo={[ne]:vr,[le]:yr},rt,De=class{constructor(t){$(this,rt);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",fe);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=te.module("mas-element")}update(){[ne,fe,le].forEach(t=>{this.wrapperElement.classList.toggle(Qo[t],t===this.state)})}notify(){(this.state===le||this.state===ne)&&(this.state===le?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===ne&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof He&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(Zo[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){X(this,rt,V()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:n}=this;return le===n?Promise.resolve(this.wrapperElement):ne===n?Promise.reject(t):new Promise((a,i)=>{r.push({resolve:a,reject:i})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=le,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Ht(()=>this.notify()),!0)}toggleFailed(t,r,n){if(t!==this.version)return!1;n!==void 0&&(this.options=n),this.error=r,this.state=ne,this.update();let a=this.wrapperElement.getAttribute("is");return this.log?.error(`${a}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...P(this,rt)?.duration}),Ht(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=fe,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!V()||this.timer)return;let{error:r,options:n,state:a,value:i,version:o}=this;this.state=fe,this.timer=Ht(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===fe&&this.version===o&&(this.state=a,this.error=r,this.value=i,this.update(),this.notify())}catch(l){this.toggleFailed(this.version,l,n)}})}};rt=new WeakMap;function ia(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Bt(e,t={}){let{tag:r,is:n}=e,a=document.createElement(r,{is:n});return a.setAttribute("is",n),Object.assign(a.dataset,ia(t)),a}function Ft(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,ia(t)),e):null}var oa="download",sa="upgrade",ca={e:"EDU",t:"TEAM"};function la(e,t={},r=""){let n=V();if(!n)return null;let{checkoutMarketSegment:a,checkoutWorkflow:i,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:h,promotionCode:u,quantity:m,wcsOsi:d,extraOptions:f,analyticsId:p}=n.collectCheckoutOptions(t),b=Bt(e,{checkoutMarketSegment:a,checkoutWorkflow:i,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:h,promotionCode:u,quantity:m,wcsOsi:d,extraOptions:f,analyticsId:p});return r&&(b.innerHTML=`<span style="pointer-events: none;">${r}</span>`),b}function ha(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new De(this))}attributeChangedCallback(n,a,i){this.masElement.attributeChangedCallback(n,a,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let n=this.options?.ms??this.value?.[0].marketSegments?.[0];return ca[n]??n}get customerSegment(){let n=this.options?.cs??this.value?.[0]?.customerSegment;return ca[n]??n}get is3in1Modal(){return Object.values(ye).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let n=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!n||n.content!=="off")}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){let a=V();if(!a)return!1;this.dataset.imsCountry||a.imsCountryPromise.then(u=>{u&&(this.dataset.imsCountry=u)}),n.imsCountry=null;let i=a.collectCheckoutOptions(n,this);if(!i.wcsOsi.length)return!1;let o;try{o=JSON.parse(i.extraOptions??"{}")}catch(u){this.masElement.log?.error("cannot parse exta checkout options",u)}let s=this.masElement.togglePending(i);this.setCheckoutUrl("");let l=a.resolveOfferSelectors(i),c=await Promise.all(l);c=c.map(u=>tt(u,i)),i.country=this.dataset.imsCountry||i.country;let h=await a.buildCheckoutAction?.(c.flat(),{...o,...i},this);return this.renderOffers(c.flat(),i,{},h,s)}renderOffers(n,a,i={},o=void 0,s=void 0){let l=V();if(!l)return!1;if(a={...JSON.parse(this.dataset.extraOptions??"{}"),...a,...i},s??(s=this.masElement.togglePending(a)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),o){this.classList.remove(oa,sa),this.masElement.toggleResolved(s,n,a);let{url:h,text:u,className:m,handler:d}=o;h&&this.setCheckoutUrl(h),u&&(this.firstElementChild.innerHTML=u),m&&this.classList.add(...m.split(" ")),d&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=d.bind(this))}if(n.length){if(this.masElement.toggleResolved(s,n,a)){if(!this.classList.contains(oa)&&!this.classList.contains(sa)){let h=l.buildCheckoutURL(n,a);this.setCheckoutUrl(a.modal==="true"?"#":h)}return!0}}else{let h=new Error(`Not provided: ${a?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,h,a))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let a=V();if(!a)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:h,perpetual:u,promotionCode:m,quantity:d,wcsOsi:f}=a.collectCheckoutOptions(n);return Ft(this,{checkoutMarketSegment:i,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:h,perpetual:u,promotionCode:m,quantity:d,wcsOsi:f}),!0}}}var nt=class nt extends ha(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return la(nt,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(nt,"is","checkout-link"),g(nt,"tag","a");var he=nt;window.customElements.get(he.is)||window.customElements.define(he.is,he,{extends:he.tag});var Jo="p_draft_landscape",es="/store/",ts=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),Xr=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),rs=["env","workflowStep","clientId","country"],da=e=>ts.get(e)??e;function Kr(e,t,r){for(let[n,a]of Object.entries(e)){let i=da(n);a!=null&&r.has(i)&&t.set(i,a)}}function ns(e){switch(e){case Cr.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function as(e,t){for(let r in e){let n=e[r];for(let[a,i]of Object.entries(n)){if(i==null)continue;let o=da(a);t.set(`items[${r}][${o}]`,i)}}}function is({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let n=e.searchParams.get("af");return e.searchParams.set("af",[n,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===ye.CRM?"creative":"mini_plans"),e}function ma(e){os(e);let{env:t,items:r,workflowStep:n,marketSegment:a,customerSegment:i,offerType:o,productArrangementCode:s,landscape:l,modal:c,is3in1:h,preselectPlan:u,...m}=e,d=new URL(ns(t));if(d.pathname=`${es}${n}`,n!==j.SEGMENTATION&&n!==j.CHANGE_PLAN_TEAM_PLANS&&as(r,d.searchParams),Kr({...m},d.searchParams,Xr),l===ge.DRAFT&&Kr({af:Jo},d.searchParams,Xr),n===j.SEGMENTATION){let f={marketSegment:a,offerType:o,customerSegment:i,productArrangementCode:s,quantity:r?.[0]?.quantity,addonProductArrangementCode:s?r?.find(p=>p.productArrangementCode!==s)?.productArrangementCode:r?.[1]?.productArrangementCode};u?.toLowerCase()==="edu"?d.searchParams.set("ms","EDU"):u?.toLowerCase()==="team"&&d.searchParams.set("cs","TEAM"),Kr(f,d.searchParams,Xr),d.searchParams.get("ot")==="PROMOTION"&&d.searchParams.delete("ot"),d=is({url:d,modal:c,is3in1:h})}return d.toString()}function os(e){for(let t of rs)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==j.SEGMENTATION&&e.workflowStep!==j.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var _=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:j.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!0,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:ce.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:ge.PUBLISHED});function ua({settings:e,providers:t}){function r(i,o){let{checkoutClientId:s,checkoutWorkflowStep:l,country:c,language:h,promotionCode:u,quantity:m,preselectPlan:d,env:f}=e,p={checkoutClientId:s,checkoutWorkflowStep:l,country:c,language:h,promotionCode:u,quantity:m,preselectPlan:d,env:f};if(o)for(let Pe of t.checkout)Pe(o,p);let{checkoutMarketSegment:b,checkoutWorkflowStep:A=l,imsCountry:v,country:y=v??c,language:w=h,quantity:C=m,entitlement:O,upgrade:U,modal:z,perpetual:I,promotionCode:L=u,wcsOsi:F,extraOptions:Q,...pe}=Object.assign(p,o?.dataset??{},i??{}),se=et(A,j,_.checkoutWorkflowStep);return p=Nt({...pe,extraOptions:Q,checkoutClientId:s,checkoutMarketSegment:b,country:y,quantity:Ie(C,_.quantity),checkoutWorkflowStep:se,language:w,entitlement:x(O),upgrade:x(U),modal:z,perpetual:x(I),promotionCode:Ot(L).effectivePromoCode,wcsOsi:Dt(F),preselectPlan:d}),p}function n(i,o){if(!Array.isArray(i)||!i.length||!o)return"";let{env:s,landscape:l}=e,{checkoutClientId:c,checkoutMarketSegment:h,checkoutWorkflowStep:u,country:m,promotionCode:d,quantity:f,preselectPlan:p,ms:b,cs:A,...v}=r(o),y=document.querySelector("meta[name=mas-ff-3in1]"),w=Object.values(ye).includes(o.modal)&&(!y||y.content!=="off"),C=window.frameElement||w?"if":"fp",[{productArrangementCode:O,marketSegments:[U],customerSegment:z,offerType:I}]=i,L=b??U??h,F=A??z;p?.toLowerCase()==="edu"?L="EDU":p?.toLowerCase()==="team"&&(F="TEAM");let Q={is3in1:w,checkoutPromoCode:d,clientId:c,context:C,country:m,env:s,items:[],marketSegment:L,customerSegment:F,offerType:I,productArrangementCode:O,workflowStep:u,landscape:l,...v},pe=f[0]>1?f[0]:void 0;if(i.length===1){let{offerId:se}=i[0];Q.items.push({id:se,quantity:pe})}else Q.items.push(...i.map(({offerId:se,productArrangementCode:Pe})=>({id:se,quantity:pe,...w?{productArrangementCode:Pe}:{}})));return ma(Q)}let{createCheckoutLink:a}=he;return{CheckoutLink:he,CheckoutWorkflowStep:j,buildCheckoutURL:n,collectCheckoutOptions:r,createCheckoutLink:a}}function ss({interval:e=200,maxAttempts:t=25}={}){let r=te.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let a=0;function i(){window.adobeIMS?.initialized?n():++a>t?(r.debug("Timeout"),n()):setTimeout(i,e)}i()})}function cs(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function ls(e){let t=te.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function pa({}){let e=ss(),t=cs(e),r=ls(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var fa=window.masPriceLiterals;function ga(e){if(Array.isArray(fa)){let t=n=>fa.find(a=>Or(a.lang,n)),r=t(e.language)??t(_.language);if(r)return Object.freeze(r)}return{}}var Qr=function(e,t){return Qr=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(r[a]=n[a])},Qr(e,t)};function at(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Qr(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var T=function(){return T=Object.assign||function(t){for(var r,n=1,a=arguments.length;n<a;n++){r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},T.apply(this,arguments)};function Gt(e,t,r){if(r||arguments.length===2)for(var n=0,a=t.length,i;n<a;n++)(i||!(n in t))&&(i||(i=Array.prototype.slice.call(t,0,n)),i[n]=t[n]);return e.concat(i||Array.prototype.slice.call(t))}var E;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(E||(E={}));var N;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(N||(N={}));var Se;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Se||(Se={}));function Zr(e){return e.type===N.literal}function xa(e){return e.type===N.argument}function $t(e){return e.type===N.number}function Vt(e){return e.type===N.date}function zt(e){return e.type===N.time}function jt(e){return e.type===N.select}function Yt(e){return e.type===N.plural}function Ea(e){return e.type===N.pound}function qt(e){return e.type===N.tag}function Wt(e){return!!(e&&typeof e=="object"&&e.type===Se.number)}function it(e){return!!(e&&typeof e=="object"&&e.type===Se.dateTime)}var Jr=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var hs=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function ba(e){var t={};return e.replace(hs,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var va=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Aa(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(va).filter(function(m){return m.length>0}),r=[],n=0,a=t;n<a.length;n++){var i=a[n],o=i.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],l=o.slice(1),c=0,h=l;c<h.length;c++){var u=h[c];if(u.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:l})}return r}function ds(e){return e.replace(/^(.*?)-/,"")}var ya=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,_a=/^(@+)?(\+|#+)?[rs]?$/g,ms=/(\*)(0+)|(#+)(0+)|(0+)/g,wa=/^(0+)$/;function Ta(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(_a,function(r,n,a){return typeof a!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):a==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof a=="string"?a.length:0)),""}),t}function Pa(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function us(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!wa.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Sa(e){var t={},r=Pa(e);return r||t}function Ca(e){for(var t={},r=0,n=e;r<n.length;r++){var a=n[r];switch(a.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=a.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=ds(a.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=T(T(T({},t),{notation:"scientific"}),a.options.reduce(function(l,c){return T(T({},l),Sa(c))},{}));continue;case"engineering":t=T(T(T({},t),{notation:"engineering"}),a.options.reduce(function(l,c){return T(T({},l),Sa(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(a.options[0]);continue;case"integer-width":if(a.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");a.options[0].replace(ms,function(l,c,h,u,m,d){if(c)t.minimumIntegerDigits=h.length;else{if(u&&m)throw new Error("We currently do not support maximum integer digits");if(d)throw new Error("We currently do not support exact integer digits")}return""});continue}if(wa.test(a.stem)){t.minimumIntegerDigits=a.stem.length;continue}if(ya.test(a.stem)){if(a.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");a.stem.replace(ya,function(l,c,h,u,m,d){return h==="*"?t.minimumFractionDigits=c.length:u&&u[0]==="#"?t.maximumFractionDigits=u.length:m&&d?(t.minimumFractionDigits=m.length,t.maximumFractionDigits=m.length+d.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""});var i=a.options[0];i==="w"?t=T(T({},t),{trailingZeroDisplay:"stripIfInteger"}):i&&(t=T(T({},t),Ta(i)));continue}if(_a.test(a.stem)){t=T(T({},t),Ta(a.stem));continue}var o=Pa(a.stem);o&&(t=T(T({},t),o));var s=us(a.stem);s&&(t=T(T({},t),s))}return t}var ot={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function La(e,t){for(var r="",n=0;n<e.length;n++){var a=e.charAt(n);if(a==="j"){for(var i=0;n+1<e.length&&e.charAt(n+1)===a;)i++,n++;var o=1+(i&1),s=i<2?1:3+(i>>1),l="a",c=ps(t);for((c=="H"||c=="k")&&(s=0);s-- >0;)r+=l;for(;o-- >0;)r=c+r}else a==="J"?r+="H":r+=a}return r}function ps(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,n;r!=="root"&&(n=e.maximize().region);var a=ot[n||""]||ot[r||""]||ot["".concat(r,"-001")]||ot["001"];return a[0]}var en,fs=new RegExp("^".concat(Jr.source,"*")),gs=new RegExp("".concat(Jr.source,"*$"));function S(e,t){return{start:e,end:t}}var xs=!!String.prototype.startsWith,Es=!!String.fromCodePoint,bs=!!Object.fromEntries,vs=!!String.prototype.codePointAt,ys=!!String.prototype.trimStart,Ts=!!String.prototype.trimEnd,Ss=!!Number.isSafeInteger,As=Ss?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},rn=!0;try{Ra=Ia("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),rn=((en=Ra.exec("a"))===null||en===void 0?void 0:en[0])==="a"}catch{rn=!1}var Ra,Na=xs?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},nn=Es?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",a=t.length,i=0,o;a>i;){if(o=t[i++],o>1114111)throw RangeError(o+" is not a valid code point");n+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return n},Ma=bs?Object.fromEntries:function(t){for(var r={},n=0,a=t;n<a.length;n++){var i=a[n],o=i[0],s=i[1];r[o]=s}return r},Oa=vs?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var a=t.charCodeAt(r),i;return a<55296||a>56319||r+1===n||(i=t.charCodeAt(r+1))<56320||i>57343?a:(a-55296<<10)+(i-56320)+65536}},_s=ys?function(t){return t.trimStart()}:function(t){return t.replace(fs,"")},ws=Ts?function(t){return t.trimEnd()}:function(t){return t.replace(gs,"")};function Ia(e,t){return new RegExp(e,t)}var an;rn?(tn=Ia("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),an=function(t,r){var n;tn.lastIndex=r;var a=tn.exec(t);return(n=a[1])!==null&&n!==void 0?n:""}):an=function(t,r){for(var n=[];;){var a=Oa(t,r);if(a===void 0||Da(a)||Ls(a))break;n.push(a),r+=a>=65536?2:1}return nn.apply(void 0,n)};var tn,Ha=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var a=[];!this.isEOF();){var i=this.char();if(i===123){var o=this.parseArgument(t,n);if(o.err)return o;a.push(o.val)}else{if(i===125&&t>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),a.push({type:N.pound,location:S(s,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(E.UNMATCHED_CLOSING_TAG,S(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&on(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;a.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;a.push(o.val)}}}return{val:a,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var a=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:N.literal,value:"<".concat(a,"/>"),location:S(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(t+1,r,!0);if(i.err)return i;var o=i.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!on(this.char()))return this.error(E.INVALID_TAG,S(s,this.clonePosition()));var l=this.clonePosition(),c=this.parseTagName();return a!==c?this.error(E.UNMATCHED_CLOSING_TAG,S(l,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:N.tag,value:a,children:o,location:S(n,this.clonePosition())},err:null}:this.error(E.INVALID_TAG,S(s,this.clonePosition())))}else return this.error(E.UNCLOSED_TAG,S(n,this.clonePosition()))}else return this.error(E.INVALID_TAG,S(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Cs(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),a="";;){var i=this.tryParseQuote(r);if(i){a+=i;continue}var o=this.tryParseUnquoted(t,r);if(o){a+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){a+=s;continue}break}var l=S(n,this.clonePosition());return{val:{type:N.literal,value:a,location:l},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Ps(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return nn.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),nn(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(E.EXPECT_ARGUMENT_CLOSING_BRACE,S(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(E.EMPTY_ARGUMENT,S(n,this.clonePosition()));var a=this.parseIdentifierIfPossible().value;if(!a)return this.error(E.MALFORMED_ARGUMENT,S(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(E.EXPECT_ARGUMENT_CLOSING_BRACE,S(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:N.argument,value:a,location:S(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(E.EXPECT_ARGUMENT_CLOSING_BRACE,S(n,this.clonePosition())):this.parseArgumentOptions(t,r,a,n);default:return this.error(E.MALFORMED_ARGUMENT,S(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=an(this.message,r),a=r+n.length;this.bumpTo(a);var i=this.clonePosition(),o=S(t,i);return{value:n,location:o}},e.prototype.parseArgumentOptions=function(t,r,n,a){var i,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,l=this.clonePosition();switch(s){case"":return this.error(E.EXPECT_ARGUMENT_TYPE,S(o,l));case"number":case"date":case"time":{this.bumpSpace();var c=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),u=this.parseSimpleArgStyleIfPossible();if(u.err)return u;var m=ws(u.val);if(m.length===0)return this.error(E.EXPECT_ARGUMENT_STYLE,S(this.clonePosition(),this.clonePosition()));var d=S(h,this.clonePosition());c={style:m,styleLocation:d}}var f=this.tryParseArgumentClose(a);if(f.err)return f;var p=S(a,this.clonePosition());if(c&&Na(c?.style,"::",0)){var b=_s(c.style.slice(2));if(s==="number"){var u=this.parseNumberSkeletonFromString(b,c.styleLocation);return u.err?u:{val:{type:N.number,value:n,location:p,style:u.val},err:null}}else{if(b.length===0)return this.error(E.EXPECT_DATE_TIME_SKELETON,p);var A=b;this.locale&&(A=La(b,this.locale));var m={type:Se.dateTime,pattern:A,location:c.styleLocation,parsedOptions:this.shouldParseSkeletons?ba(A):{}},v=s==="date"?N.date:N.time;return{val:{type:v,value:n,location:p,style:m},err:null}}}return{val:{type:s==="number"?N.number:s==="date"?N.date:N.time,value:n,location:p,style:(i=c?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var y=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(E.EXPECT_SELECT_ARGUMENT_OPTIONS,S(y,T({},y)));this.bumpSpace();var w=this.parseIdentifierIfPossible(),C=0;if(s!=="select"&&w.value==="offset"){if(!this.bumpIf(":"))return this.error(E.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,S(this.clonePosition(),this.clonePosition()));this.bumpSpace();var u=this.tryParseDecimalInteger(E.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,E.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(u.err)return u;this.bumpSpace(),w=this.parseIdentifierIfPossible(),C=u.val}var O=this.tryParsePluralOrSelectOptions(t,s,r,w);if(O.err)return O;var f=this.tryParseArgumentClose(a);if(f.err)return f;var U=S(a,this.clonePosition());return s==="select"?{val:{type:N.select,value:n,options:Ma(O.val),location:U},err:null}:{val:{type:N.plural,value:n,options:Ma(O.val),offset:C,pluralType:s==="plural"?"cardinal":"ordinal",location:U},err:null}}default:return this.error(E.INVALID_ARGUMENT_TYPE,S(o,l))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(E.EXPECT_ARGUMENT_CLOSING_BRACE,S(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var a=this.clonePosition();if(!this.bumpUntil("'"))return this.error(E.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,S(a,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=Aa(t)}catch{return this.error(E.INVALID_NUMBER_SKELETON,r)}return{val:{type:Se.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?Ca(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,a){for(var i,o=!1,s=[],l=new Set,c=a.value,h=a.location;;){if(c.length===0){var u=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var m=this.tryParseDecimalInteger(E.EXPECT_PLURAL_ARGUMENT_SELECTOR,E.INVALID_PLURAL_ARGUMENT_SELECTOR);if(m.err)return m;h=S(u,this.clonePosition()),c=this.message.slice(u.offset,this.offset())}else break}if(l.has(c))return this.error(r==="select"?E.DUPLICATE_SELECT_ARGUMENT_SELECTOR:E.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);c==="other"&&(o=!0),this.bumpSpace();var d=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?E.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:E.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,S(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(t+1,r,n);if(f.err)return f;var p=this.tryParseArgumentClose(d);if(p.err)return p;s.push([c,{value:f.val,location:S(d,this.clonePosition())}]),l.add(c),this.bumpSpace(),i=this.parseIdentifierIfPossible(),c=i.value,h=i.location}return s.length===0?this.error(r==="select"?E.EXPECT_SELECT_ARGUMENT_SELECTOR:E.EXPECT_PLURAL_ARGUMENT_SELECTOR,S(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(E.MISSING_OTHER_CLAUSE,S(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,a=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var i=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)i=!0,o=o*10+(s-48),this.bump();else break}var l=S(a,this.clonePosition());return i?(o*=n,As(o)?{val:o,err:null}:this.error(r,l)):this.error(t,l)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Oa(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Na(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Da(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function on(e){return e>=97&&e<=122||e>=65&&e<=90}function Ps(e){return on(e)||e===47}function Cs(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Da(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Ls(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function sn(e){e.forEach(function(t){if(delete t.location,jt(t)||Yt(t))for(var r in t.options)delete t.options[r].location,sn(t.options[r].value);else $t(t)&&Wt(t.style)||(Vt(t)||zt(t))&&it(t.style)?delete t.style.location:qt(t)&&sn(t.children)})}function ka(e,t){t===void 0&&(t={}),t=T({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Ha(e,t).parse();if(r.err){var n=SyntaxError(E[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||sn(r.val),r.val}function st(e,t){var r=t&&t.cache?t.cache:Hs,n=t&&t.serializer?t.serializer:Is,a=t&&t.strategy?t.strategy:Ns;return a(e,{cache:r,serializer:n})}function Rs(e){return e==null||typeof e=="number"||typeof e=="boolean"}function Ua(e,t,r,n){var a=Rs(n)?n:r(n),i=t.get(a);return typeof i>"u"&&(i=e.call(this,n),t.set(a,i)),i}function Ba(e,t,r){var n=Array.prototype.slice.call(arguments,3),a=r(n),i=t.get(a);return typeof i>"u"&&(i=e.apply(this,n),t.set(a,i)),i}function cn(e,t,r,n,a){return r.bind(t,e,n,a)}function Ns(e,t){var r=e.length===1?Ua:Ba;return cn(e,this,r,t.cache.create(),t.serializer)}function Ms(e,t){return cn(e,this,Ba,t.cache.create(),t.serializer)}function Os(e,t){return cn(e,this,Ua,t.cache.create(),t.serializer)}var Is=function(){return JSON.stringify(arguments)};function ln(){this.cache=Object.create(null)}ln.prototype.get=function(e){return this.cache[e]};ln.prototype.set=function(e,t){this.cache[e]=t};var Hs={create:function(){return new ln}},Xt={variadic:Ms,monadic:Os};var Ae;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Ae||(Ae={}));var ct=function(e){at(t,e);function t(r,n,a){var i=e.call(this,r)||this;return i.code=n,i.originalMessage=a,i}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var hn=function(e){at(t,e);function t(r,n,a,i){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(n,'". Options are "').concat(Object.keys(a).join('", "'),'"'),Ae.INVALID_VALUE,i)||this}return t}(ct);var Fa=function(e){at(t,e);function t(r,n,a){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(n),Ae.INVALID_VALUE,a)||this}return t}(ct);var Ga=function(e){at(t,e);function t(r,n){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(n,'"'),Ae.MISSING_VALUE,n)||this}return t}(ct);var G;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(G||(G={}));function Ds(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==G.literal||r.type!==G.literal?t.push(r):n.value+=r.value,t},[])}function ks(e){return typeof e=="function"}function lt(e,t,r,n,a,i,o){if(e.length===1&&Zr(e[0]))return[{type:G.literal,value:e[0].value}];for(var s=[],l=0,c=e;l<c.length;l++){var h=c[l];if(Zr(h)){s.push({type:G.literal,value:h.value});continue}if(Ea(h)){typeof i=="number"&&s.push({type:G.literal,value:r.getNumberFormat(t).format(i)});continue}var u=h.value;if(!(a&&u in a))throw new Ga(u,o);var m=a[u];if(xa(h)){(!m||typeof m=="string"||typeof m=="number")&&(m=typeof m=="string"||typeof m=="number"?String(m):""),s.push({type:typeof m=="string"?G.literal:G.object,value:m});continue}if(Vt(h)){var d=typeof h.style=="string"?n.date[h.style]:it(h.style)?h.style.parsedOptions:void 0;s.push({type:G.literal,value:r.getDateTimeFormat(t,d).format(m)});continue}if(zt(h)){var d=typeof h.style=="string"?n.time[h.style]:it(h.style)?h.style.parsedOptions:n.time.medium;s.push({type:G.literal,value:r.getDateTimeFormat(t,d).format(m)});continue}if($t(h)){var d=typeof h.style=="string"?n.number[h.style]:Wt(h.style)?h.style.parsedOptions:void 0;d&&d.scale&&(m=m*(d.scale||1)),s.push({type:G.literal,value:r.getNumberFormat(t,d).format(m)});continue}if(qt(h)){var f=h.children,p=h.value,b=a[p];if(!ks(b))throw new Fa(p,"function",o);var A=lt(f,t,r,n,a,i),v=b(A.map(function(C){return C.value}));Array.isArray(v)||(v=[v]),s.push.apply(s,v.map(function(C){return{type:typeof C=="string"?G.literal:G.object,value:C}}))}if(jt(h)){var y=h.options[m]||h.options.other;if(!y)throw new hn(h.value,m,Object.keys(h.options),o);s.push.apply(s,lt(y.value,t,r,n,a));continue}if(Yt(h)){var y=h.options["=".concat(m)];if(!y){if(!Intl.PluralRules)throw new ct(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Ae.MISSING_INTL_API,o);var w=r.getPluralRules(t,{type:h.pluralType}).select(m-(h.offset||0));y=h.options[w]||h.options.other}if(!y)throw new hn(h.value,m,Object.keys(h.options),o);s.push.apply(s,lt(y.value,t,r,n,a,m-(h.offset||0)));continue}}return Ds(s)}function Us(e,t){return t?T(T(T({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=T(T({},e[n]),t[n]||{}),r},{})):e}function Bs(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=Us(e[n],t[n]),r},T({},e)):e}function dn(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Fs(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:st(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,Gt([void 0],r,!1)))},{cache:dn(e.number),strategy:Xt.variadic}),getDateTimeFormat:st(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,Gt([void 0],r,!1)))},{cache:dn(e.dateTime),strategy:Xt.variadic}),getPluralRules:st(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,Gt([void 0],r,!1)))},{cache:dn(e.pluralRules),strategy:Xt.variadic})}}var $a=function(){function e(t,r,n,a){var i=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=i.formatToParts(o);if(s.length===1)return s[0].value;var l=s.reduce(function(c,h){return!c.length||h.type!==G.literal||typeof c[c.length-1]!="string"?c.push(h.value):c[c.length-1]+=h.value,c},[]);return l.length<=1?l[0]||"":l},this.formatToParts=function(o){return lt(i.ast,i.locales,i.formatters,i.formats,o,void 0,i.message)},this.resolvedOptions=function(){return{locale:i.resolvedLocale.toString()}},this.getAst=function(){return i.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:a?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Bs(e.formats,n),this.formatters=a&&a.formatters||Fs(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=ka,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Va=$a;var Gs=/[0-9\-+#]/,$s=/[^\d\-+#]/g;function za(e){return e.search(Gs)}function Vs(e="#.##"){let t={},r=e.length,n=za(e);t.prefix=n>0?e.substring(0,n):"";let a=za(e.split("").reverse().join("")),i=r-a,o=e.substring(i,i+1),s=i+(o==="."||o===","?1:0);t.suffix=a>0?e.substring(s,r):"",t.mask=e.substring(n,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let l=t.mask.match($s);return t.decimal=l&&l[l.length-1]||".",t.separator=l&&l[1]&&l[0]||",",l=t.mask.split(t.decimal),t.integer=l[0],t.fraction=l[1],t}function zs(e,t,r){let n=!1,a={value:e};e<0&&(n=!0,a.value=-a.value),a.sign=n?"-":"",a.value=Number(a.value).toFixed(t.fraction&&t.fraction.length),a.value=Number(a.value).toString();let i=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=a.value.split(".");return(!s||s&&s.length<=i)&&(s=i<0?"":(+("0."+s)).toFixed(i+1).replace("0.","")),a.integer=o,a.fraction=s,js(a,t),(a.result==="0"||a.result==="")&&(n=!1,a.sign=""),!n&&t.maskHasPositiveSign?a.sign="+":n&&t.maskHasPositiveSign?a.sign="-":n&&(a.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),a}function js(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),a=n&&n.indexOf("0");if(a>-1)for(;e.integer.length<n.length-a;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let i=r[1]&&r[r.length-1].length;if(i){let o=e.integer.length,s=o%i;for(let l=0;l<o;l++)e.result+=e.integer.charAt(l),!((l-s+1)%i)&&l<o-i&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Ys(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Vs(e),a=zs(t,n,r);return n.prefix+a.sign+a.result+n.suffix}var ja=Ys;var Ya=".",qs=",",Wa=/^\s+/,Xa=/\s+$/,qa="&nbsp;",mn=e=>e*12,Ka=(e,t)=>{let{start:r,end:n,displaySummary:{amount:a,duration:i,minProductQuantity:o,outcomeType:s}={}}=e;if(!(a&&i&&s&&o))return!1;let l=t?new Date(t):new Date;if(!r||!n)return!1;let c=new Date(r),h=new Date(n);return l>=c&&l<=h},_e={MONTH:"MONTH",YEAR:"YEAR"},Ws={[Z.ANNUAL]:12,[Z.MONTHLY]:1,[Z.THREE_YEARS]:36,[Z.TWO_YEARS]:24},un=(e,t)=>({accept:e,round:t}),Xs=[un(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),un(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),un(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],pn={[ve.YEAR]:{[Z.MONTHLY]:_e.MONTH,[Z.ANNUAL]:_e.YEAR},[ve.MONTH]:{[Z.MONTHLY]:_e.MONTH}},Ks=(e,t)=>e.indexOf(`'${t}'`)===0,Qs=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=Za(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Js(e)),r},Zs=e=>{let t=ec(e),r=Ks(e,t),n=e.replace(/'.*?'/,""),a=Wa.test(n)||Xa.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:a}},Qa=e=>e.replace(Wa,qa).replace(Xa,qa),Js=e=>e.match(/#(.?)#/)?.[1]===Ya?qs:Ya,ec=e=>e.match(/'(.*?)'/)?.[1]??"",Za=e=>e.match(/0(.?)0/)?.[1]??"";function ke({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},a,i=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:l}=Zs(e),c=r?Za(e):"",h=Qs(e,r),u=r?2:0,m=i(t,{currencySymbol:o}),d=n?m.toLocaleString("hi-IN",{minimumFractionDigits:u,maximumFractionDigits:u}):ja(h,m),f=r?d.lastIndexOf(c):d.length,p=d.substring(0,f),b=d.substring(f+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,d).replace(/SYMBOL/,o),currencySymbol:o,decimals:b,decimalsDelimiter:c,hasCurrencySpace:l,integer:p,isCurrencyFirst:s,recurrenceTerm:a}}var Ja=e=>{let{commitment:t,term:r,usePrecision:n}=e,a=Ws[r]??1;return ke(e,a>1?_e.MONTH:pn[t]?.[r],i=>{let o={divisor:a,price:i,usePrecision:n},{round:s}=Xs.find(({accept:l})=>l(o));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(o)}`);return s(o)})},ei=({commitment:e,term:t,...r})=>ke(r,pn[e]?.[t]),ti=e=>{let{commitment:t,instant:r,price:n,originalPrice:a,priceWithoutDiscount:i,promotion:o,quantity:s=1,term:l}=e;if(t===ve.YEAR&&l===Z.MONTHLY){if(!o)return ke(e,_e.YEAR,mn);let{displaySummary:{outcomeType:c,duration:h,minProductQuantity:u=1}={}}=o;switch(c){case"PERCENTAGE_DISCOUNT":if(s>=u&&Ka(o,r)){let m=parseInt(h.replace("P","").replace("M",""));if(isNaN(m))return mn(n);let d=s*a*m,f=s*i*(12-m),p=Math.round((d+f)*100)/100;return ke({...e,price:p},_e.YEAR)}default:return ke(e,_e.YEAR,()=>mn(i??n))}}return ke(e,pn[t]?.[l])};var fn={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, billed monthly} other {}}"},tc=Yn("ConsonantTemplates/price"),rc=/<\/?[^>]+(>|$)/g,D={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},be={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},gn="TAX_EXCLUSIVE",nc=e=>Vn(e)?Object.entries(e).filter(([,t])=>Oe(t)||Rt(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+$n(n)+'"'}`,""):"",B=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+D.disabled}"${nc(r)}>${n?Qa(t):t??""}</span>`;function de(e,t,r,n){let a=e[r];if(a==null)return"";try{return new Va(a.replace(rc,""),t).format(n)}catch{return tc.error("Failed to format literal:",a),""}}function ac(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:n,decimals:a,decimalsDelimiter:i,hasCurrencySpace:o,integer:s,isCurrencyFirst:l,recurrenceLabel:c,perUnitLabel:h,taxInclusivityLabel:u},m={}){let d=B(D.currencySymbol,n),f=B(D.currencySpace,o?"&nbsp;":""),p="";return t?p=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(p=`<sr-only class="alt-aria-label">${r}</sr-only>`),l&&(p+=d+f),p+=B(D.integer,s),p+=B(D.decimalsDelimiter,i),p+=B(D.decimals,a),l||(p+=f+d),p+=B(D.recurrence,c,null,!0),p+=B(D.unitType,h,null,!0),p+=B(D.taxInclusivity,u,!0),B(e,p,{...m})}var Y=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:n=!1,instant:a=void 0}={})=>({country:i,displayFormatted:o=!0,displayRecurrence:s=!0,displayPerUnit:l=!1,displayTax:c=!1,language:h,literals:u={},quantity:m=1,space:d=!1}={},{commitment:f,offerSelectorIds:p,formatString:b,price:A,priceWithoutDiscount:v,taxDisplay:y,taxTerm:w,term:C,usePrecision:O,promotion:U}={},z={})=>{Object.entries({country:i,formatString:b,language:h,price:A}).forEach(([eo,to])=>{if(to==null)throw new Error(`Argument "${eo}" is missing for osi ${p?.toString()}, country ${i}, language ${h}`)});let I={...fn,...u},L=`${h.toLowerCase()}-${i.toUpperCase()}`,F=r&&v?v:A,Q=t?Ja:ei;n&&(Q=ti);let{accessiblePrice:pe,recurrenceTerm:se,...Pe}=Q({commitment:f,formatString:b,instant:a,isIndianPrice:i==="IN",originalPrice:A,priceWithoutDiscount:v,price:t?A:F,promotion:U,quantity:m,term:C,usePrecision:O}),nr="",ar="",ir="";x(s)&&se&&(ir=de(I,L,be.recurrenceLabel,{recurrenceTerm:se}));let bt="";x(l)&&(d&&(bt+=" "),bt+=de(I,L,be.perUnitLabel,{perUnit:"LICENSE"}));let vt="";x(c)&&w&&(d&&(vt+=" "),vt+=de(I,L,y===gn?be.taxExclusiveLabel:be.taxInclusiveLabel,{taxTerm:w})),r&&(nr=de(I,L,be.strikethroughAriaLabel,{strikethroughPrice:nr})),e&&(ar=de(I,L,be.alternativePriceAriaLabel,{alternativePrice:ar}));let Ce=D.container;if(t&&(Ce+=" "+D.containerOptical),r&&(Ce+=" "+D.containerStrikethrough),e&&(Ce+=" "+D.containerAlternative),n&&(Ce+=" "+D.containerAnnual),x(o))return ac(Ce,{...Pe,accessibleLabel:nr,altAccessibleLabel:ar,recurrenceLabel:ir,perUnitLabel:bt,taxInclusivityLabel:vt},z);let{currencySymbol:Ln,decimals:Xi,decimalsDelimiter:Ki,hasCurrencySpace:Rn,integer:Qi,isCurrencyFirst:Zi}=Pe,Le=[Qi,Ki,Xi];Zi?(Le.unshift(Rn?"\xA0":""),Le.unshift(Ln)):(Le.push(Rn?"\xA0":""),Le.push(Ln)),Le.push(ir,bt,vt);let Ji=Le.join("");return B(Ce,Ji,z)},ri=()=>(e,t,r)=>{let a=(e.displayOldPrice===void 0||x(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${a?Y({displayStrikethrough:!0})(e,t,r)+"&nbsp;":""}${Y({isAlternativePrice:a})(e,t,r)}`},ni=()=>(e,t,r)=>{let{instant:n}=e;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let a={...e,displayTax:!1,displayPerUnit:!1},o=(e.displayOldPrice===void 0||x(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${o?Y({displayStrikethrough:!0})(a,t,r)+"&nbsp;":""}${Y({isAlternativePrice:o})(e,t,r)}${B(D.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0,instant:n})(a,t,r)}${B(D.containerAnnualSuffix,")")}`},ai=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${Y({isAlternativePrice:e.displayOldPrice})(e,t,r)}${B(D.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0})(n,t,r)}${B(D.containerAnnualSuffix,")")}`};var ht={...D,containerLegal:"price-legal",planType:"price-plan-type"},Kt={...be,planTypeLabel:"planTypeLabel"};function ic(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:n},a={}){let i="";return i+=B(ht.unitType,t,null,!0),r&&n&&(r+=". "),i+=B(ht.taxInclusivity,r,!0),i+=B(ht.planType,n,null),B(e,i,{...a})}var ii=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:n=!1,language:a,literals:i={}}={},{taxDisplay:o,taxTerm:s,planType:l}={},c={})=>{let h={...fn,...i},u=`${a.toLowerCase()}-${e.toUpperCase()}`,m="";x(t)&&(m=de(h,u,Kt.perUnitLabel,{perUnit:"LICENSE"}));let d="";e==="US"&&a==="en"&&(r=!1),x(r)&&s&&(d=de(h,u,o===gn?Kt.taxExclusiveLabel:Kt.taxInclusiveLabel,{taxTerm:s}));let f="";x(n)&&l&&(f=de(h,u,Kt.planTypeLabel,{planType:l}));let p=ht.container;return p+=" "+ht.containerLegal,ic(p,{perUnitLabel:m,taxInclusivityLabel:d,planTypeLabel:f},c)};var oi=Y(),si=ri(),ci=Y({displayOptical:!0}),li=Y({displayStrikethrough:!0}),hi=Y({displayAnnual:!0}),di=Y({displayOptical:!0,isAlternativePrice:!0}),mi=Y({isAlternativePrice:!0}),ui=ai(),pi=ni(),fi=ii;var oc=(e,t)=>{if(!(!Je(e)||!Je(t)))return Math.floor((t-e)/t*100)},gi=()=>(e,t)=>{let{price:r,priceWithoutDiscount:n}=t,a=oc(r,n);return a===void 0?'<span class="no-discount"></span>':`<span class="discount">${a}%</span>`};var xi=gi();var bi="INDIVIDUAL_COM",xn="TEAM_COM",vi="INDIVIDUAL_EDU",En="TEAM_EDU",Ei=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],sc={[bi]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[xn]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[vi]:["LT_lt","LV_lv","SA_en","SG_en"],[En]:["SG_en","KR_ko"]},cc={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},lc=[bi,xn,vi,En],hc=e=>[xn,En].includes(e),dc=(e,t,r,n)=>{let a=`${e}_${t}`,i=`${r}_${n}`,o=cc[a];if(o){let s=lc.indexOf(i);return o[s]}return hc(i)},mc=(e,t,r,n)=>{let a=`${e}_${t}`;if(Ei.includes(e)||Ei.includes(a))return!0;let i=sc[`${r}_${n}`];return i?i.includes(e)||i.includes(a)?!0:_.displayTax:_.displayTax},uc=async(e,t,r,n)=>{let a=mc(e,t,r,n);return{displayTax:a,forceTaxExclusive:a?dc(e,t,r,n):_.forceTaxExclusive}},dt=class dt extends HTMLSpanElement{constructor(){super();g(this,"masElement",new De(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let n=V();if(!n)return null;let{displayOldPrice:a,displayPerUnit:i,displayRecurrence:o,displayTax:s,displayPlanType:l,displayAnnual:c,forceTaxExclusive:h,perpetual:u,promotionCode:m,quantity:d,alternativePrice:f,template:p,wcsOsi:b}=n.collectPriceOptions(r);return Bt(dt,{displayOldPrice:a,displayPerUnit:i,displayRecurrence:o,displayTax:s,displayPlanType:l,displayAnnual:c,forceTaxExclusive:h,perpetual:u,promotionCode:m,quantity:d,alternativePrice:f,template:p,wcsOsi:b})}get isInlinePrice(){return!0}attributeChangedCallback(r,n,a){this.masElement.attributeChangedCallback(r,n,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===ne}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let n=V();if(!n)return!1;let a=n.collectPriceOptions(r,this),i={...n.settings,...a};if(!i.wcsOsi.length)return!1;if(n.featureFlags[xe]&&(a.displayTax===void 0||a.forceTaxExclusive===void 0)){let[l]=await n.resolveOfferSelectors(i),c=tt(await l,i);if(c?.length){let{country:h,language:u}=i,m=c[0],[d=""]=m.marketSegments,f=await uc(h,u,m.customerSegment,d);a.displayTax===void 0&&(i.displayTax=f?.displayTax||i.displayTax),a.forceTaxExclusive===void 0&&(i.forceTaxExclusive=f?.forceTaxExclusive||i.forceTaxExclusive)}}let o=this.masElement.togglePending(i);this.innerHTML="";let[s]=n.resolveOfferSelectors(i);try{let l=await s;return this.renderOffers(tt(l,i),o)}catch(l){throw this.innerHTML="",l}}renderOffers(r,n=void 0){if(!this.isConnected)return;let a=V();if(!a)return!1;if(n??(n=this.masElement.togglePending()),r.length){if(this.masElement.toggleResolved(n,r)){this.innerHTML=a.buildPriceHTML(r,this.options);let i=this.closest("p, h3, div");if(!i||!i.querySelector('span[data-template="strikethrough"]')||i.querySelector(".alt-aria-label"))return!0;let o=i?.querySelectorAll('span[is="inline-price"]');return o.length>1&&o.length===i.querySelectorAll('span[data-template="strikethrough"]').length*2&&o.forEach(s=>{s.dataset.template!=="strikethrough"&&s.options&&!s.options.alternativePrice&&!s.isFailed&&(s.options.alternativePrice=!0,s.innerHTML=a.buildPriceHTML(r,s.options))}),!0}}else{let i=new Error(`Not provided: ${this.options?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(n,i,this.options))return this.innerHTML="",!0}return!1}updateOptions(r){let n=V();if(!n)return!1;let{alternativePrice:a,displayOldPrice:i,displayPerUnit:o,displayRecurrence:s,displayTax:l,forceTaxExclusive:c,perpetual:h,promotionCode:u,quantity:m,template:d,wcsOsi:f}=n.collectPriceOptions(r);return Ft(this,{alternativePrice:a,displayOldPrice:i,displayPerUnit:o,displayRecurrence:s,displayTax:l,forceTaxExclusive:c,perpetual:h,promotionCode:u,quantity:m,template:d,wcsOsi:f}),!0}};g(dt,"is","inline-price"),g(dt,"tag","span");var me=dt;window.customElements.get(me.is)||window.customElements.define(me.is,me,{extends:me.tag});function yi({literals:e,providers:t,settings:r}){function n(o,s=null){let l={country:r.country,language:r.language,locale:r.locale,literals:structuredClone(e.price)};if(s&&t?.price)for(let O of t.price)O(s,l);let{displayOldPrice:c,displayPerUnit:h,displayRecurrence:u,displayTax:m,displayPlanType:d,forceTaxExclusive:f,perpetual:p,displayAnnual:b,promotionCode:A,quantity:v,alternativePrice:y,wcsOsi:w,...C}=Object.assign(l,s?.dataset??{},o??{});return l=Nt(Object.assign({...l,...C,displayOldPrice:x(c),displayPerUnit:x(h),displayRecurrence:x(u),displayTax:x(m),displayPlanType:x(d),forceTaxExclusive:x(f),perpetual:x(p),displayAnnual:x(b),promotionCode:Ot(A).effectivePromoCode,quantity:Ie(v,_.quantity),alternativePrice:x(y),wcsOsi:Dt(w)})),l}function a(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:l}=s,c;switch(l){case"discount":c=xi;break;case"strikethrough":c=li;break;case"annual":c=hi;break;case"legal":c=fi;break;default:s.template==="optical"&&s.alternativePrice?c=di:s.template==="optical"?c=ci:s.displayAnnual&&o[0].planType==="ABM"?c=s.promotionCode?pi:ui:s.alternativePrice?c=mi:c=s.promotionCode?si:oi}let[h]=o;return h={...h,...h.priceDetails},c({...r,...s},h)}let i=me.createInlinePrice;return{InlinePrice:me,buildPriceHTML:a,collectPriceOptions:n,createInlinePrice:i}}function pc({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||_.language),t??(t=e?.split("_")?.[1]||_.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function Ti(e={},t){let r=t.featureFlags[xe],{commerce:n={}}=e,a=ce.PRODUCTION,i=wr,o=R("checkoutClientId",n)??_.checkoutClientId,s=et(R("checkoutWorkflowStep",n),j,_.checkoutWorkflowStep),l=x(R("displayOldPrice",n),r?_.displayOldPrice:!_.displayOldPrice),c=x(R("displayPerUnit",n),r?_.displayPerUnit:!_.displayPerUnit),h=x(R("displayRecurrence",n),_.displayRecurrence),u=x(R("displayTax",n),_.displayTax),m=x(R("displayPlanType",n),_.displayPlanType),d=x(R("entitlement",n),_.entitlement),f=x(R("modal",n),_.modal),p=x(R("forceTaxExclusive",n),_.forceTaxExclusive),b=R("promotionCode",n)??_.promotionCode,A=Ie(R("quantity",n)),v=R("wcsApiKey",n)??_.wcsApiKey,y=n?.env==="stage",w=ge.PUBLISHED;["true",""].includes(n.allowOverride)&&(y=(R(Ar,n,{metadata:!1})?.toLowerCase()??n?.env)==="stage",w=et(R(_r,n),ge,w)),y&&(a=ce.STAGE,i=Pr);let O=R(Sr)??e.preview,U=typeof O<"u"&&O!=="off"&&O!=="false",z={};U&&(z={preview:U});let I=R("mas-io-url")??e.masIOUrl??`https://www${a===ce.STAGE?".stage":""}.adobe.com/mas/io`,L=R("preselect-plan")??void 0;return{...pc(e),...z,displayOldPrice:l,checkoutClientId:o,checkoutWorkflowStep:s,displayPerUnit:c,displayRecurrence:h,displayTax:u,displayPlanType:m,entitlement:d,extraOptions:_.extraOptions,modal:f,env:a,forceTaxExclusive:p,promotionCode:b,quantity:A,alternativePrice:_.alternativePrice,wcsApiKey:v,wcsURL:i,landscape:w,masIOUrl:I,...L&&{preselectPlan:L}}}async function Si(e,t={},r=2,n=100){let a;for(let i=0;i<=r;i++)try{let o=await fetch(e,t);return o.retryCount=i,o}catch(o){if(a=o,a.retryCount=i,i>r)break;await new Promise(s=>setTimeout(s,n*(i+1)))}throw a}var bn="wcs";function Ai({settings:e}){let t=te.module(bn),{env:r,wcsApiKey:n}=e,a=new Map,i=new Map,o,s=new Map;async function l(d,f,p=!0){let b=V(),A=br;t.debug("Fetching:",d);let v="",y;if(d.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let w=new Map(f),[C]=d.offerSelectorIds,O=Date.now()+Math.random().toString(36).substring(2,7),U=`${bn}:${C}:${O}${Lr}`,z=`${bn}:${C}:${O}${Rr}`,I;try{if(performance.mark(U),v=new URL(e.wcsURL),v.searchParams.set("offer_selector_ids",C),v.searchParams.set("country",d.country),v.searchParams.set("locale",d.locale),v.searchParams.set("landscape",r===ce.STAGE?"ALL":e.landscape),v.searchParams.set("api_key",n),d.language&&v.searchParams.set("language",d.language),d.promotionCode&&v.searchParams.set("promotion_code",d.promotionCode),d.currency&&v.searchParams.set("currency",d.currency),y=await Si(v.toString(),{credentials:"omit"}),y.ok){let L=[];try{let F=await y.json();t.debug("Fetched:",d,F),L=F.resolvedOffers??[]}catch(F){t.error(`Error parsing JSON: ${F.message}`,{...F.context,...b?.duration})}L=L.map(It),f.forEach(({resolve:F},Q)=>{let pe=L.filter(({offerSelectorIds:se})=>se.includes(Q)).flat();pe.length&&(w.delete(Q),f.delete(Q),F(pe))})}else A=Er}catch(L){A=`Network error: ${L.message}`}finally{I=performance.measure(z,U),performance.clearMarks(U),performance.clearMeasures(z)}if(p&&f.size){t.debug("Missing:",{offerSelectorIds:[...f.keys()]});let L=Qn(y);f.forEach(F=>{F.reject(new He(A,{...d,...L,response:y,measure:Ct(I),...b?.duration}))})}}function c(){clearTimeout(o);let d=[...i.values()];i.clear(),d.forEach(({options:f,promises:p})=>l(f,p))}function h(d){if(!d||typeof d!="object")throw new TypeError("Cache must be a Map or similar object");let f=r===ce.STAGE?"stage":"prod",p=d[f];if(!p||typeof p!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[b,A]of Object.entries(p))a.set(b,Promise.resolve(A.map(It)));t.debug(`Prefilled WCS cache with ${p.size} entries`)}function u(){let d=a.size;s=new Map(a),a.clear(),t.debug(`Moved ${d} cache entries to stale cache`)}function m({country:d,language:f,perpetual:p=!1,promotionCode:b="",wcsOsi:A=[]}){let v=`${f}_${d}`;d!=="GB"&&!p&&(f="MULT");let y=[d,f,b].filter(w=>w).join("-").toLowerCase();return A.map(w=>{let C=`${w}-${y}`;if(a.has(C))return a.get(C);let O=new Promise((U,z)=>{let I=i.get(y);if(!I){let L={country:d,locale:v,offerSelectorIds:[]};d!=="GB"&&!p&&(L.language=f),I={options:L,promises:new Map},i.set(y,I)}b&&(I.options.promotionCode=b),I.options.offerSelectorIds.push(w),I.promises.set(w,{resolve:U,reject:z}),c()}).catch(U=>{if(s.has(C))return s.get(C);throw U});return a.set(C,O),O})}return{Commitment:ve,PlanType:Wn,Term:Z,applyPlanType:It,resolveOfferSelectors:m,flushWcsCacheInternal:u,prefillWcsCache:h}}var _i="mas-commerce-service",wi="mas-commerce-service:start",Pi="mas-commerce-service:ready",mt,Ue,Be,Ci,Li,vn=class extends HTMLElement{constructor(){super(...arguments);$(this,Be);$(this,mt);$(this,Ue);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(n,a,i)=>{let o=await r?.(n,a,this.imsSignedInPromise,i);return o||null})}get featureFlags(){return P(this,Ue)||X(this,Ue,{[xe]:yt(this,Be,Li).call(this,xe)}),P(this,Ue)}activate(){let r=P(this,Be,Ci),n=Ti(r,this);kt(r.lana);let a=te.init(r.hostEnv).module("service");a.debug("Activating:",r);let o={price:ga(n)},s={checkout:new Set,price:new Set},l={literals:o,providers:s,settings:n};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...ua(l),...pa(l),...yi(l),...Ai(l),...Mr,Log:te,get defaults(){return _},get log(){return te},get providers(){return{checkout(h){return s.checkout.add(h),()=>s.checkout.delete(h)},price(h){return s.price.add(h),()=>s.price.delete(h)},has:h=>s.price.has(h)||s.checkout.has(h)}},get settings(){return n}})),a.debug("Activated:",{literals:o,settings:n});let c=new CustomEvent(Tt,{bubbles:!0,cancelable:!1,detail:this});performance.mark(Pi),X(this,mt,performance.measure(Pi,wi)),this.dispatchEvent(c),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(wi),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(sr).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),customElements.get("aem-fragment")?.cache.clear(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh(!1)),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":Ct(P(this,mt))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:a})=>a>this.lastLoggingTime).filter(({transferSize:a,duration:i,responseStatus:o})=>a===0&&i===0&&o<200||o>=400),n=Array.from(new Map(r.map(a=>[a.name,a])).values());if(n.some(({name:a})=>/(\/fragment\?|web_commerce_artifact)/.test(a))){let a=n.map(({name:i})=>i);this.log.error("Failed requests:",{failedUrls:a,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};mt=new WeakMap,Ue=new WeakMap,Be=new WeakSet,Ci=function(){let r=this.getAttribute("env")??"prod",n={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(a=>{let i=this.getAttribute(a);i&&(n[a]=i)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(a=>{let i=this.getAttribute(a);if(i!=null){let o=a.replace(/-([a-z])/g,s=>s[1].toUpperCase());n.commerce[o]=i}}),n},Li=function(r){return["on","true",!0].includes(this.getAttribute(`data-${r}`)||R(r))};window.customElements.get(_i)||window.customElements.define(_i,vn);import{html as We,css as _c,unsafeCSS as Yi,LitElement as wc,nothing as oe}from"../lit-all.min.js";var ut=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};import{html as Qt,nothing as fc}from"../lit-all.min.js";var Fe,pt=class pt{constructor(t){g(this,"card");$(this,Fe);this.card=t,this.insertVariantStyle()}getContainer(){return X(this,Fe,P(this,Fe)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),P(this,Fe)}insertVariantStyle(){if(!pt.styleMap[this.card.variant]){pt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,a=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),i=parseInt(this.getContainer().style.getPropertyValue(n))||0;a>i&&this.getContainer().style.setProperty(n,`${a}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Qt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Qt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Qt`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:fc}get secureLabelFooter(){return Qt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Ri(this.card.variant)}};Fe=new WeakMap,g(pt,"styleMap",{});var k=pt;import{html as yn,css as gc}from"../lit-all.min.js";var Ni=`
:root {
    --consonant-merch-card-catalog-width: 276px;
    --consonant-merch-card-catalog-icon-size: 40px;
}

.collection-container.catalog {
    --merch-card-collection-card-min-height: 330px;
    --merch-card-collection-card-width: var(--consonant-merch-card-catalog-width);
}

.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    --merch-card-collection-card-width: var(--consonant-merch-card-catalog-width);
}

.collection-container.catalog merch-sidenav {
    --merch-sidenav-gap: 10px;
}

merch-card-collection-header.catalog {
    --merch-card-collection-header-row-gap: var(--consonant-merch-spacing-xs);
}

@media screen and ${H} {
    :root {
        --consonant-merch-card-catalog-width: 302px;
    }
}

@media screen and ${M} {
    :root {
        --consonant-merch-card-catalog-width: 276px;
    }
}

merch-card[variant="catalog"] [slot="action-menu-content"] {
  background-color: #000;
  color: var(--color-white, #fff);
  font-size: var(--consonant-merch-card-body-xs-font-size);
  width: fit-content;
  padding: var(--consonant-merch-spacing-xs);
  border-radius: var(--consonant-merch-spacing-xxxs);
  position: absolute;
  top: 55px;
  right: 15px;
  line-height: var(--consonant-merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ul {
  padding-left: 0;
  padding-bottom: var(--consonant-merch-spacing-xss);
  margin-top: 0;
  margin-bottom: 0;
  list-style-position: inside;
  list-style-type: '\u2022 ';
}

merch-card[variant="catalog"] [slot="action-menu-content"] ul li {
  padding-left: 0;
  line-height: var(--consonant-merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ::marker {
  margin-right: 0;
}

merch-card[variant="catalog"] [slot="action-menu-content"] p {
  color: var(--color-white, #fff);
}

merch-card[variant="catalog"] [slot="action-menu-content"] a {
  color: var(--consonant-merch-card-background-color);
  text-decoration: underline;
}

merch-card[variant="catalog"] .payment-details {
  font-size: var(--consonant-merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-line-height);
}`;var Mi={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Ge=class extends k{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(cr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let n=this.actionMenuContentSlot.classList.contains("hidden");n||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!n).toString())});g(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(n||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",n),this.setAriaExpanded(this.actionMenu,"false"))});g(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return yn` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Bn()&&this.card.actionMenu?"always-visible":""}
                ${this.card.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        tabindex="0"
                        aria-expanded="false"
                        role="button"
                    >${this.card.actionMenuLabel} - ${this.card.title}</div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
            ${this.card.actionMenuContent?"":"hidden"}"
                    @focusout="${this.hideActionMenu}"
                    >${this.card.actionMenuContent}
                </slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":yn`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?yn`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Ni}setAriaExpanded(r,n){r.setAttribute("aria-expanded",n)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};g(Ge,"variantStyle",gc`
        :host([variant='catalog']) {
            min-height: 330px;
            width: var(--consonant-merch-card-catalog-width);
        }

        .body .catalog-badge {
            display: flex;
            height: fit-content;
            flex-direction: column;
            width: fit-content;
            max-width: 140px;
            border-radius: 5px;
            position: relative;
            top: 0;
            margin-left: var(--consonant-merch-spacing-xxs);
            box-sizing: border-box;
        }
    `);import{html as ft}from"../lit-all.min.js";var Oi=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${H} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${M} {
  :root {
    --consonant-merch-card-image-width: 378px;
    --consonant-merch-card-image-width-4clm: 276px;
  }
    
  .three-merch-cards.image {
      grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
  }

  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--consonant-merch-card-image-width-4clm));
  }
}
`;var Zt=class extends k{constructor(t){super(t)}getGlobalCSS(){return Oi}renderLayout(){return ft`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?ft`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:ft`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?ft`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:ft`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as Hi}from"../lit-all.min.js";var Ii=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${H} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${M} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${Ee} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Jt=class extends k{constructor(t){super(t)}getGlobalCSS(){return Ii}renderLayout(){return Hi` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Hi`<hr />`} ${this.secureLabelFooter}`}};import{html as $e,css as xc,unsafeCSS as Tn}from"../lit-all.min.js";var Di=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 16px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
    --consonant-merch-card-mini-compare-mobile-price-font-size: 32px;
    --consonant-merch-card-mini-compare-mobile-border-color-light: #F3F3F3;
    --consonant-merch-card-card-mini-compare-mobile-background-color: #F8F8F8;
    --consonant-merch-card-card-mini-compare-mobile-spacing-xs: 12px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"] merch-addon {
    box-sizing: border-box;
  }

  merch-card[variant="mini-compare-chart"] merch-addon {
    padding-left: 4px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 8px;
    border-radius: .5rem;
    font-family: var(--merch-body-font-family, 'Adobe Clean');
    margin: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) .5rem;
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] merch-addon [is="inline-price"] {
    min-height: unset;
    font-weight: bold;
    pointer-events: none;
  }

  merch-card[variant="mini-compare-chart"] merch-addon::part(checkbox) {
      height: 18px;
      width: 18px;
      margin: 14px 12px 0 8px;
  }

  merch-card[variant="mini-compare-chart"] merch-addon::part(label) {
    display: flex;
    flex-direction: column;
    padding: 8px 4px 8px 0;
    width: 100%;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m"] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] [is="inline-price"] {
    min-height: unset;
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: 0 var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'],
  merch-card[variant="mini-compare-chart"].bullet-list [slot='price-commitment'] {
    padding: 0 var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] a {
    display: inline-block;
    height: 27px;
  }

  merch-card[variant="mini-compare-chart"] [slot="offers"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;    
  }

   merch-card[variant="mini-compare-chart"].bullet-list [slot="body-xxs"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0;    
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="promo-text"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] a {
    text-decoration: underline;
  }

  merch-card[variant="mini-compare-chart"] .action-area {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    width: 100%;
    gap: var(--consonant-merch-spacing-xxs);
  }

  merch-card[variant="mini-compare-chart"] [slot="footer-rows"] ul {
    margin-block-start: 0px;
    margin-block-end: 0px;
    padding-inline-start: 0px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon {
    display: flex;
    place-items: center;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon img {
    max-width: initial;
    width: var(--consonant-merch-card-mini-compare-chart-icon-size);
    height: var(--consonant-merch-card-mini-compare-chart-icon-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-rows-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-color: var(--merch-color-grey-60);
    font-weight: 700;
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-size: var(--consonant-merch-card-body-s-font-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell {
    border-top: 1px solid var(--consonant-merch-card-border-color);
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    place-items: center;
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
    margin-block: 0px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon-checkmark img {
    max-width: initial;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon-checkmark {
    display: flex;
    align-items: center;
    height: 20px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-checkmark {
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    align-items: flex-start;
    margin-block: var(--consonant-merch-spacing-xxxs);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description-checkmark {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description p {
    color: var(--merch-color-grey-80);
    vertical-align: bottom;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description a {
    color: var(--color-accent);
  }

  merch-card[variant="mini-compare-chart"] .toggle-icon {
    display: flex;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    text-align: inherit;
    font: inherit;
    border-radius: 0;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container {
    display: none;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container.open {
    display: block;
    padding-block-start: var(--consonant-merch-card-card-mini-compare-mobile-spacing-xs);
    padding-block-end: 4px;
  }
  
.one-merch-card.mini-compare-chart {
  grid-template-columns: var(--consonant-merch-card-mini-compare-chart-wide-width);
  gap: var(--consonant-merch-spacing-xs);
}

.two-merch-cards.mini-compare-chart,
.three-merch-cards.mini-compare-chart,
.four-merch-cards.mini-compare-chart {
  grid-template-columns: repeat(2, var(--consonant-merch-card-mini-compare-chart-width));
  gap: var(--consonant-merch-spacing-xs);
}

/* mini compare mobile */ 
@media screen and ${ae} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 302px;
    --consonant-merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart,
  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: var(--consonant-merch-card-mini-compare-chart-width);
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] merch-addon {
    box-sizing: border-box;
  }

  merch-card[variant="mini-compare-chart"].bullet-list {
    border-radius: var(--consonant-merch-spacing-xxs);
    border-color: var(--consonant-merch-card-mini-compare-mobile-border-color-light);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] {
    padding: 0 var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-mini-compare-mobile-price-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    font-weight: 800;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] span.price-strikethrough,
  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] span[is="inline-price"][data-template="strikethrough"] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="price-commitment"] {
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xs) 0 var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="body-m"] {
    padding: var(--consonant-merch-card-card-mini-compare-mobile-spacing-xs) var(--consonant-merch-spacing-xs) 0 var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="offers"] {
    padding: 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list .action-area {
    justify-content: flex-start;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="footer-rows"] {
    background-color: var(--consonant-merch-card-card-mini-compare-mobile-background-color);
    border-radius: 0 0 var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xxs);
  }
}

@media screen and ${St} {
  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"].bullet-list .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }
}
@media screen and ${H} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 302px;
    --consonant-merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
  }
}

/* desktop */
@media screen and ${M} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 378px;
    --consonant-merch-card-mini-compare-chart-wide-width: 484px;  
  }
  .one-merch-card.mini-compare-chart {
    grid-template-columns: var(--consonant-merch-card-mini-compare-chart-wide-width);
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, var(--consonant-merch-card-mini-compare-chart-wide-width));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(3, var(--consonant-merch-card-mini-compare-chart-width));
    gap: var(--consonant-merch-spacing-m);
  }
}

@media screen and ${Ee} {
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(4, var(--consonant-merch-card-mini-compare-chart-width));
  }
}

merch-card .footer-row-cell:nth-child(1) {
  min-height: var(--consonant-merch-card-footer-row-1-min-height);
}

merch-card .footer-row-cell:nth-child(2) {
  min-height: var(--consonant-merch-card-footer-row-2-min-height);
}

merch-card .footer-row-cell:nth-child(3) {
  min-height: var(--consonant-merch-card-footer-row-3-min-height);
}

merch-card .footer-row-cell:nth-child(4) {
  min-height: var(--consonant-merch-card-footer-row-4-min-height);
}

merch-card .footer-row-cell:nth-child(5) {
  min-height: var(--consonant-merch-card-footer-row-5-min-height);
}

merch-card .footer-row-cell:nth-child(6) {
  min-height: var(--consonant-merch-card-footer-row-6-min-height);
}

merch-card .footer-row-cell:nth-child(7) {
  min-height: var(--consonant-merch-card-footer-row-7-min-height);
}

merch-card .footer-row-cell:nth-child(8) {
  min-height: var(--consonant-merch-card-footer-row-8-min-height);
}
`;var Ec=32,Ve=class extends k{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?$e`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:$e`<slot name="secure-transaction-label"></slot>`;return $e`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Di}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(a=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${a}"]`),a)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((n,a)=>{let i=Math.max(Ec,parseFloat(window.getComputedStyle(n).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(a+1)))||0;i>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(a+1),`${i}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let a=n.querySelector(".footer-row-cell-description");a&&!a.textContent.trim()&&n.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${re}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let n=this.mainPrice,a=this.headingMPriceSlot;if(!n&&a){let i=r?.getAttribute("plan-type"),o=null;if(r&&i&&(o=r.querySelector(`p[data-plan-type="${i}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(o){let s=Me("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},o.innerHTML);this.card.appendChild(s)}}else{let s=Me("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let n=this.mainPrice,a=this.card.planType;n&&(await n.onceSettled(),a=n.value?.[0]?.planType),a&&(r.planType=a)}renderLayout(){return $e` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?$e`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:$e`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),wt()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(Ve,"variantStyle",xc`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-s);
    }

    :host([variant='mini-compare-chart'].bullet-list) footer {
        flex-flow: column nowrap;
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-chart-top-section-height);
    }

    :host([variant='mini-compare-chart'].bullet-list) .top-section {
        padding-top: var(--consonant-merch-spacing-xs);
        padding-inline-start: var(--consonant-merch-spacing-xs);
    }

    :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
      align-self: flex-start;
      flex: none;
      color: var(--merch-color-grey-700);
    }

    @media screen and ${Tn(ae)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${Tn(St)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Tn(M)} {
        :host([variant='mini-compare-chart']) footer {
            padding: var(--consonant-merch-spacing-xs)
                var(--consonant-merch-spacing-s)
                var(--consonant-merch-spacing-s)
                var(--consonant-merch-spacing-s);
        }
    }

    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: end;
    }
    /* mini-compare card heights for the slots: heading-m, body-m, heading-m-price, price-commitment, offers, promo-text, footer */
    :host([variant='mini-compare-chart']) slot[name='heading-m'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-heading-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='body-m'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-body-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='heading-m-price'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-heading-m-price-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='body-xxs'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-body-xxs-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='price-commitment'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-price-commitment-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='offers'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-offers-height);
    }
    :host([variant='mini-compare-chart']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-promo-text-height);
    }
    :host([variant='mini-compare-chart']) slot[name='callout-content'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-callout-content-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='addon'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-addon-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        justify-content: flex-start;
    }
  `);import{html as gt,css as bc,nothing as er}from"../lit-all.min.js";var ki=`
:root {
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;
    --consonant-merch-card-plans-students-width: 568px;
}

merch-card[variant^="plans"] {
    --merch-card-plans-heading-xs-min-height: 23px;
    --consonant-merch-card-callout-icon-size: 18px;
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant^="plans"][size="wide"], merch-card[variant^="plans"][size="super-wide"] {
    width: auto;
}

merch-card[variant="plans-students"] {
    width: 100%;
}

merch-card[variant^="plans"] [slot="icons"] {
    --img-width: 41.5px;
}

merch-card[variant="plans-education"] [slot="body-xs"] span.price:not(.price-legal) {
  display: inline-block;
  font-size: var(--consonant-merch-card-heading-xs-font-size);
  font-weight: 700;
}

merch-card[variant^="plans"] span.price-unit-type:not([slot="callout-content"] *):not([slot="addon"] *) {
    display: block;
}

merch-card[variant^="plans"] [slot="heading-xs"] span.price.price-strikethrough,
merch-card[variant^="plans"] [slot="heading-m"] span.price.price-strikethrough,
merch-card[variant="plans-education"] [slot="body-xs"] span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-heading-xxxs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  font-weight: 700;
}

merch-card[variant^="plans"] [slot='heading-xs'],
merch-card[variant="plans-education"] span.heading-xs,
merch-card[variant="plans-education"] [slot="body-xs"] span.price:not(.price-strikethrough) {
  min-height: var(--merch-card-plans-heading-xs-min-height);
}

merch-card[variant="plans-education"] span.heading-xs {
  margin-top: 16px;
  margin-bottom: 8px;
}

merch-card[variant="plans-education"] [slot="body-xs"] p:first-of-type span.heading-xs {
  margin-top: 8px;
}

merch-card[variant="plans-education"] span.promo-text {
  margin-bottom: 8px;
}

merch-card[variant="plans-education"] p:has(a[href^='tel:']):has(+ p) {
  margin-bottom: 16px;
}

merch-card[variant^="plans"] [slot="promo-text"],
merch-card[variant="plans-education"] span.promo-text {
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card-collection.plans merch-card {
  width: auto;
  height: 100%;
}

merch-card-collection.plans merch-card[variant="plans"] aem-fragment + [slot^="heading-"] {
    margin-top: calc(40px + var(--consonant-merch-spacing-xxs));
}

merch-card[variant^='plans'] span[data-template="legal"] {
    display: block;
    color: var(----merch-color-grey-80);
    font-family: var(--Font-adobe-clean, "Adobe Clean");
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    line-height: 21px;
}

merch-card[variant^='plans'] span.price-legal::first-letter {
    text-transform: uppercase;
}

merch-card[variant^='plans'] span.price-legal .price-tax-inclusivity::before {
  content: initial;
}

merch-card[variant^="plans"] [slot="description"] {
    min-height: 84px;
}

merch-card[variant^="plans"] [slot="body-xs"] a {
    color: var(--link-color);
}

merch-card[variant^="plans"] [slot="promo-text"] a {
    color: inherit;
}

merch-card[variant^="plans"] [slot="callout-content"] {
    margin: 8px 0 0;
}

merch-card[variant^="plans"][size="super-wide"] [slot="callout-content"] {
    margin: 0;
}

merch-card[variant^="plans"] [slot='callout-content'] > div > div,
merch-card[variant^="plans"] [slot="callout-content"] > p {
    position: relative;
    padding: 2px 10px 3px;
    background: #D9D9D9;
}

merch-card[variant^="plans"] [slot="callout-content"] > p:has(> .icon-button) {
    padding-right: 36px;
}

merch-card[variant^="plans"] [slot='callout-content'] > p,
merch-card[variant^="plans"] [slot='callout-content'] > div > div > div {
    color: #000;
}

merch-card[variant^="plans"] [slot="callout-content"] img,
merch-card[variant^="plans"] [slot="callout-content"] .icon-button {
    margin: 1.5px 0 1.5px 8px;
}

merch-card[variant^="plans"] [slot="whats-included"] [slot="description"] {
  min-height: auto;
}

merch-card[variant^="plans"] [slot="quantity-select"] {
    margin-top: auto;
    padding-top: 8px;
}

merch-card[variant^="plans"]:has([slot="quantity-select"]) merch-addon {
    margin: 0;
}

merch-card[variant^="plans"] merch-addon {
    --merch-addon-gap: 10px;
    --merch-addon-align: center;
    --merch-addon-checkbox-size: 12px;
    --merch-addon-checkbox-border: 2px solid rgb(109, 109, 109);
    --merch-addon-checkbox-radius: 2px;
    --merch-addon-checkbox-checked-bg: var(--checkmark-icon);
    --merch-addon-checkbox-checked-color: var(--color-accent);
    --merch-addon-label-size: 12px;
    --merch-addon-label-color: rgb(34, 34, 34);
    --merch-addon-label-line-height: normal;
}

merch-card[variant^="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

merch-card[variant^="plans"] [slot="footer"] .con-button > span {
    min-width: unset;
}

merch-card[variant^="plans"] merch-addon span[data-template="price"] {
    display: none;
}

/* Mobile */
@media screen and ${ae} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }

    merch-card[variant="plans-students"] {
        min-width: var(--consonant-merch-card-plans-width);
        max-width: var(--consonant-merch-card-plans-students-width);
        width: 100%;
    }
}

merch-card[variant^="plans"]:not([size]) {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
}

.collection-container.plans {
    --merch-card-collection-card-min-height: 273px;
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-width);
}

merch-card-collection-header.plans {
    --merch-card-collection-header-columns: 1fr fit-content(100%);
    --merch-card-collection-header-areas: "result filter";
}

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-width);
}

.columns .text .foreground {
    margin: 0;
}

.columns.merch-card > .row {
    grid-template-columns: repeat(auto-fit, var(--consonant-merch-card-plans-width));
    justify-content: center;
    align-items: center;
}

.columns.checkmark-list ul {
    padding-left: 20px;
    list-style-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -3 18 18" height="18px"><path fill="currentcolor" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"></path></svg>');
}

.columns.checkmark-list ul li {
    padding-left: 8px;
}

/* Tablet */
@media screen and ${H} {
  :root {
      --consonant-merch-card-plans-width: 302px;
  }

  .four-merch-cards.plans .foreground {
      max-width: unset;
  }
  
  .columns.merch-card > .row {
      grid-template-columns: repeat(auto-fit, calc(var(--consonant-merch-card-plans-width) * 2 + var(--consonant-merch-spacing-m)));
  }
}

/* desktop */
@media screen and ${M} {
  :root {
        --consonant-merch-card-plans-width: 276px;
  }

  .columns .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }

  merch-card[variant="plans-students"] {
      width: var(--consonant-merch-card-plans-students-width);
  }

  merch-card-collection-header.plans {
      --merch-card-collection-header-columns: fit-content(100%);
      --merch-card-collection-header-areas: "custom";
  }
}

/* Large desktop */
@media screen and ${Ee} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}
`;var tr={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},Ui={...function(){let{whatsIncluded:e,size:t,...r}=tr;return r}(),title:{tag:"h3",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},Bi={...function(){let{whatsIncluded:e,size:t,quantitySelect:r,...n}=tr;return n}()},q=class extends k{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,r){t.dataset.template===Nr&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return ki}adjustSlotPlacement(t,r,n){let a=this.card.shadowRoot,i=a.querySelector("footer"),o=this.card.getAttribute("size"),s=a.querySelector(`footer slot[name="${t}"]`),l=a.querySelector(`.body slot[name="${t}"]`),c=a.querySelector(".body");if((!o||!o.includes("wide"))&&(i?.classList.remove("wide-footer"),s&&s.remove()),!!r.includes(o)){if(i?.classList.toggle("wide-footer",Pt()),!n&&s){if(l)s.remove();else{let h=c.querySelector(`[data-placeholder-for="${t}"]`);h?h.replaceWith(s):c.appendChild(s)}return}if(n&&l){let h=document.createElement("div");if(h.setAttribute("data-placeholder-for",t),h.classList.add("slot-placeholder"),!s){let u=l.cloneNode(!0);i.prepend(u)}l.replaceWith(h)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],Pt()),this.adjustSlotPlacement("callout-content",["super-wide"],Pt())}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}adjustPrices(){this.headingM&&(this.headingM.setAttribute("role","heading"),this.headingM.setAttribute("aria-level","2"))}postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout(),this.adjustPrices()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${re}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?gt`<div class="divider"></div>`:er}async adjustLegal(){if(await this.card.updateComplete,await customElements.whenDefined("inline-price"),this.legalAdjusted)return;this.legalAdjusted=!0;let t=[],r=this.card.querySelector(`[slot="heading-m"] ${re}[data-template="price"]`);r&&t.push(r);let n=t.map(async a=>{let i=a.cloneNode(!0);await a.onceSettled(),a?.options&&(a.options.displayPerUnit&&(a.dataset.displayPerUnit="false"),a.options.displayTax&&(a.dataset.displayTax="false"),a.options.displayPlanType&&(a.dataset.displayPlanType="false"),i.setAttribute("data-template","legal"),a.parentNode.insertBefore(i,a.nextSibling))});await Promise.all(n)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let n=r.value?.[0]?.planType;n&&(t.planType=n)}get stockCheckbox(){return this.card.checkboxLabel?gt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:er}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?er:gt`<slot name="icons"></slot>`}connectedCallbackHook(){let t=At();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia);let r=_t();r?.addEventListener&&r.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let t=At();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia);let r=_t();r?.removeEventListener&&r.removeEventListener("change",this.adaptForMedia)}renderLayout(){return gt` ${this.badge}
            <div class="body">
                ${this.icons}
                <slot name="heading-xs"></slot>
                <slot name="heading-s"></slot>
                <slot name="subtitle"></slot>
                ${this.divider}
                <slot name="heading-m"></slot>
                <slot name="annualPrice"></slot>
                <slot name="priceLabel"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="body-xs"></slot>
                <slot name="whats-included"></slot>
                <slot name="callout-content"></slot>
                <slot name="quantity-select"></slot>
                ${this.stockCheckbox}
                <slot name="addon"></slot>
                <slot name="badge"></slot>
            </div>
            ${this.secureLabelFooter}`}};g(q,"variantStyle",bc`
        :host([variant^='plans']) {
            min-height: 273px;
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
            --merch-card-plans-min-width: 244px;
            --merch-card-plans-max-width: 244px;
            --merch-card-plans-padding: 15px;
            --merch-card-plans-heading-min-height: 23px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
            font-weight: 400;
        }

        :host([variant^='plans']) .slot-placeholder {
            display: none;
        }

        :host([variant='plans-education']) {
            min-height: unset;
        }

        :host([variant='plans-education']) ::slotted([slot='subtitle']) {
            font-size: var(--consonant-merch-card-heading-xxxs-font-size);
            line-height: var(--consonant-merch-card-heading-xxxs-line-height);
            font-style: italic;
            font-weight: 400;
        }
        :host([variant='plans-education']) .divider {
            border: 0;
            border-top: 1px solid #E8E8E8;
            margin-top: 8px;
        }

        :host([variant='plans']) ::slotted([slot='heading-xs']) {
            min-height: var(--merch-card-plans-heading-min-height);
        }

        :host([variant='plans']) .body {
            min-width: var(--merch-card-plans-min-width);
            max-width: var(--merch-card-plans-max-width);
            padding: var(--merch-card-plans-padding);
        }

        :host([variant='plans'][size]) .body {
            max-width: none;
        }

        :host([variant^='plans']) ::slotted([slot='addon']) {
            margin-top: auto;
            padding-top: 8px;
        }

        :host([variant^='plans']) footer ::slotted([slot='addon']) {
            margin: 0;
            padding: 0;
        }

        :host([variant='plans']) .wide-footer #stock-checkbox {
            margin-top: 0;
        }

        :host([variant='plans']) #stock-checkbox {
            margin-top: 8px;
            gap: 9px;
            color: rgb(34, 34, 34);
            line-height: var(--consonant-merch-card-detail-xs-line-height);
            padding-top: 4px;
            padding-bottom: 5px;
        }

        :host([variant='plans']) #stock-checkbox > span {
            border: 2px solid rgb(109, 109, 109);
            width: 12px;
            height: 12px;
        }

        :host([variant='plans']) footer {
            padding: var(--merch-card-plans-padding);
            padding-top: 1px;
        }

        :host([variant='plans']) .secure-transaction-label {
            color: rgb(80, 80, 80);
            line-height: var(--consonant-merch-card-detail-xs-line-height);
        }

        :host([variant='plans']) ::slotted([slot='heading-xs']) {
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }

        :host([variant='plans']) #badge {
            border-radius: 4px 0 0 4px;
            font-weight: 400;
            line-height: 21px;
            padding: 2px 10px 3px;
        }
    `),g(q,"collectionOptions",{customHeaderArea:t=>t.sidenav?gt`<slot name="resultsText"></slot>`:er,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as Sn,css as vc}from"../lit-all.min.js";var Fi=`
:root {
  --consonant-merch-card-product-width: 300px;
}

  merch-card[variant="product"] merch-addon {
    padding-left: 4px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 8px;
    border-radius: .5rem;
    font-family: var(--merch-body-font-family, 'Adobe Clean');
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="product"] merch-addon [is="inline-price"] {
    font-weight: bold;
    pointer-events: none;
  }

  merch-card[variant="product"] merch-addon::part(checkbox) {
      height: 18px;
      width: 18px;
      margin: 14px 12px 0 8px;
  }

  merch-card[variant="product"] merch-addon::part(label) {
    display: flex;
    flex-direction: column;
    padding: 8px 4px 8px 0;
    width: 100%;
  }

/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--consonant-merch-card-product-width);
}

/* Tablet */
@media screen and ${H} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${M} {
  :root {
    --consonant-merch-card-product-width: 378px;
    --consonant-merch-card-product-width-4clm: 276px;
  }
    
  .three-merch-cards.product {
      grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
  }

  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--consonant-merch-card-product-width-4clm));
  }
}
`;var ze=class extends k{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Fi}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Sn` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Sn`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Sn`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),wt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${re}[data-template="price"]`)}toggleAddon(t){let r=this.mainPrice,n=this.headingXSSlot;if(!r&&n){let a=t?.getAttribute("plan-type"),i=null;if(t&&a&&(i=t.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(o=>o.remove()),t.checked){if(i){let o=Me("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},i.innerHTML);this.card.appendChild(o)}}else{let o=Me("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,n=this.card.planType;r&&(await r.onceSettled(),n=r.value?.[0]?.planType),n&&(t.planType=n)}};g(ze,"variantStyle",vc`
        :host([variant='product']) > slot:not([name='icons']) {
            display: block;
        }
        :host([variant='product']) slot[name='body-xs'] {
            min-height: var(--consonant-merch-card-product-body-xs-height);
            display: block;
        }
        :host([variant='product']) slot[name='heading-xs'] {
            min-height: var(--consonant-merch-card-product-heading-xs-height);
            display: block;
        }
        :host([variant='product']) slot[name='body-xxs'] {
            min-height: var(--consonant-merch-card-product-body-xxs-height);
            display: block;
        }
        :host([variant='product']) slot[name='promo-text'] {
            min-height: var(--consonant-merch-card-product-promo-text-height);
            display: block;
        }
        :host([variant='product']) slot[name='callout-content'] {
            min-height: var(
                --consonant-merch-card-product-callout-content-height
            );
            display: block;
        }
        :host([variant='product']) slot[name='addon'] {
            min-height: var(
                --consonant-merch-card-product-addon-height
            );
        }

        :host([variant='product']) ::slotted([slot='heading-xs']) {
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }
    `);import{html as An,css as yc}from"../lit-all.min.js";var Gi=`
:root {
  --consonant-merch-card-segment-width: 378px;
}

/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
  grid-template-columns: minmax(276px, var(--consonant-merch-card-segment-width));
}

/* Mobile */
@media screen and ${ae} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${H} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
    
  .two-merch-cards.segment,
  .three-merch-cards.segment,
  .four-merch-cards.segment {
      grid-template-columns: repeat(2, minmax(276px, var(--consonant-merch-card-segment-width)));
  }
}

/* desktop */
@media screen and ${M} {
  :root {
    --consonant-merch-card-segment-width: 302px;
  }
    
  .three-merch-cards.segment {
      grid-template-columns: repeat(3, minmax(276px, var(--consonant-merch-card-segment-width)));
  }

  .four-merch-cards.segment {
      grid-template-columns: repeat(4, minmax(276px, var(--consonant-merch-card-segment-width)));
  }
}
`;var je=class extends k{constructor(t){super(t)}getGlobalCSS(){return Gi}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return An` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":An`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?An`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};g(je,"variantStyle",yc`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as _n,css as Tc}from"../lit-all.min.js";var $i=`
:root {
  --consonant-merch-card-special-offers-width: 378px;
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="strikethrough"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
}

/* grid style for special-offers */
.one-merch-card.special-offers,
.two-merch-cards.special-offers,
.three-merch-cards.special-offers,
.four-merch-cards.special-offers {
  grid-template-columns: minmax(300px, var(--consonant-merch-card-special-offers-width));
}

@media screen and ${ae} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${H} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
    
  .two-merch-cards.special-offers,
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
      grid-template-columns: repeat(2, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

/* desktop */
@media screen and ${M} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${Ee} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Vi={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Ye=class extends k{constructor(t){super(t)}getGlobalCSS(){return $i}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return _n`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?_n`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:_n`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};g(Ye,"variantStyle",Tc`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{css as Sc,html as Ac}from"../lit-all.min.js";var zi=`
merch-card[variant="mini"] {
  color: var(--spectrum-body-color);
  width: 400px;
  height: 250px;
}

merch-card[variant="mini"] .price-tax-inclusivity::before {
  content: initial;
}

merch-card[variant="mini"] [slot="title"] {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
}

merch-card[variant="mini"] [slot="legal"] {
    min-height: 17px;
}

merch-card[variant="mini"] [slot="ctas"] {
  display: flex;
  flex: 1;
  gap: 16px;
  align-items: end;
  justify-content: end;
}

merch-card[variant="mini"] span.promo-duration-text,
merch-card[variant="mini"] span.renewal-text {
    display: block;
}
`;var ji={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},qe=class extends k{constructor(){super(...arguments);g(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return zi}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(r,n){n.literals={...n.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},n.space=!0,n.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let r=this.card.querySelector(`${re}[data-template="price"]`);if(!r)return;let n=r.cloneNode(!0);this.legal=n,r.dataset.displayTax="false",n.dataset.template="legal",n.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,n.setAttribute("slot","legal"),this.card.appendChild(n)}renderLayout(){return Ac`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};g(qe,"variantStyle",Sc`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
        }
    `);var wn=new Map,ie=(e,t,r=null,n=null,a)=>{wn.set(e,{class:t,fragmentMapping:r,style:n,collectionOptions:a})};ie("catalog",Ge,Mi,Ge.variantStyle);ie("image",Zt);ie("inline-heading",Jt);ie("mini-compare-chart",Ve,null,Ve.variantStyle);ie("plans",q,tr,q.variantStyle,q.collectionOptions);ie("plans-students",q,Bi,q.variantStyle,q.collectionOptions);ie("plans-education",q,Ui,q.variantStyle,q.collectionOptions);ie("product",ze,null,ze.variantStyle);ie("segment",je,null,je.variantStyle);ie("special-offers",Ye,Vi,Ye.variantStyle);ie("mini",qe,ji,qe.variantStyle);function Ri(e){return wn.get(e)?.fragmentMapping}function Pn(e){return wn.get(e)?.collectionOptions}var Pc={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},Cc=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(a=>{a.innerText=r||""})},Lc={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},W,ue=class extends wc{constructor(){super();$(this,W);g(this,"tablet",new ut(this,H));g(this,"desktop",new ut(this,M));this.collection=null,X(this,W,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(Re,this.updateLiterals),this.collection?.addEventListener(Ne,this.handleSidenavAttached)}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(Re,this.updateLiterals),this.collection?.removeEventListener(Ne,this.handleSidenavAttached)}willUpdate(){P(this,W).search=this.getVisibility("search"),P(this,W).filter=this.getVisibility("filter"),P(this,W).sort=this.getVisibility("sort"),P(this,W).result=this.getVisibility("result"),P(this,W).custom=this.getVisibility("custom")}parseVisibilityOptions(r,n){if(!r||!Object.hasOwn(r,n))return null;let a=r[n];return a===!1?!1:a===!0?!0:a.includes(this.currentMedia)}getVisibility(r){let n=Pn(this.collection?.variant)?.headerVisibility,a=this.parseVisibilityOptions(n,r);return a!==null?a:this.parseVisibilityOptions(Lc,r)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!P(this,W).search)return oe;let r=Ze(this,"searchText");return r?We`
            <merch-search deeplink="search" id="search">
                <sp-search
                    id="search-bar"
                    placeholder="${r}"
                ></sp-search>
            </merch-search>
        `:oe}get filterAction(){return P(this,W).filter?this.sidenav?We`
            <sp-action-button
              id="filter"
              variant="secondary"
              treatment="outline"
              @click="${this.openFilters}"
              ><slot name="filtersText"></slot
            ></sp-action-button>
        `:oe:oe}get sortAction(){if(!P(this,W).sort)return oe;let r=Ze(this,"sortText");if(!r)return;let n=Ze(this,"popularityText"),a=Ze(this,"alphabeticallyText");if(!(n&&a))return;let i=this.collection?.sort===J.alphabetical;return We`
            <sp-action-menu
                id="sort"
                size="m"
                @change="${this.collection?.sortChanged}"
                selects="single"
                value="${i?J.alphabetical:J.authored}"
            >
                <span slot="label-only"
                    >${r}:
                    ${i?a:n}</span
                >
                <sp-menu-item value="${J.authored}"
                    >${n}</sp-menu-item
                >
                <sp-menu-item value="${J.alphabetical}"
                    >${a}</sp-menu-item
                >
            </sp-action-menu>
        `}get resultSlotName(){let r=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return Pc[r][Math.min(this.resultCount,2)]}get resultLabel(){if(!P(this,W).result)return oe;if(!this.sidenav)return oe;let r=this.search?"search":"filter",n=this.resultCount?this.resultCount===1?"single":"multiple":"none";return We`
          <div id="result" aria-live="polite" type=${r} quantity=${n}>
              <slot name="${this.resultSlotName}"></slot>
          </div>`}get customArea(){if(!P(this,W).custom)return oe;let r=Pn(this.collection?.variant)?.customHeaderArea;if(!r)return oe;let n=r(this.collection);return!n||n===oe?oe:We`<div id="custom">${n}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(n=>{Cc(this,n,r.detail[n])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return We`
          <sp-theme color="light" scale="medium">
            <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
          </sp-theme>
        `}};W=new WeakMap,g(ue,"styles",_c`
        :host {
            --merch-card-collection-header-max-width: var(--merch-card-collection-card-width);
            --merch-card-collection-header-margin-bottom: 32px;
            --merch-card-collection-header-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-row-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-columns: auto auto;
            --merch-card-collection-header-areas: "search search" 
                                                  "filter sort"
                                                  "result result";
            --merch-card-collection-header-result-font-size: 14px;
        }

        sp-theme {
            font-size: inherit;
        }

        #header {
            display: grid;
            gap: var(--merch-card-collection-header-gap);
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
            max-width: 302px;
            width: 100%;
        }

        #filter {
            grid-area: filter;
            width: 92px;
        }

        #sort {
            grid-area: sort;
            justify-self: end;
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
        @media screen and ${Yi(H)} {
            :host {
                --merch-card-collection-header-max-width: auto;
                --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                --merch-card-collection-header-areas: "search filter sort" 
                                                      "result result result";
            }
        }

        /* Laptop */
        @media screen and ${Yi(M)} {
            :host {
                --merch-card-collection-header-columns: 1fr fit-content(100%);
                --merch-card-collection-header-areas: "result sort";
                --merch-card-collection-header-result-font-size: inherit;
            }
        }
    `),g(ue,"placeholderKeys",["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]);customElements.define("merch-card-collection-header",ue);var qi="merch-card-collection",Nc=2e4,Mc={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},Oc={plans:!0},Ic=(e,{filter:t})=>e.filter(r=>r.filters.hasOwnProperty(t)),Hc=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(n=>r.types.includes(n)))):e,Dc=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),kc=(e,{filter:t})=>e.sort((r,n)=>n.filters[t]?.order==null||isNaN(n.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-n.filters[t].order),Uc=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,we,xt,Et,rr,Wi,Xe=class extends Rc{constructor(){super();$(this,rr);$(this,we,{});$(this,xt);$(this,Et);this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1}render(){return Cn`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let n=new Promise(a=>setTimeout(()=>a(!1),Nc));return Promise.race([this.hydrationReady,n])}updated(r){if(!this.querySelector("merch-card"))return;let n=window.scrollY||document.documentElement.scrollTop,a=[...this.children].filter(c=>c.tagName==="MERCH-CARD");if(a.length===0)return;r.has("singleApp")&&this.singleApp&&a.forEach(c=>{c.updateFilters(c.name===this.singleApp)});let i=this.sort===J.alphabetical?Dc:kc,s=[Ic,Hc,Uc,i].reduce((c,h)=>h(c,this),a).map((c,h)=>[c,h]);if(this.resultCount=s.length,this.page&&this.limit){let c=this.page*this.limit;this.hasMore=s.length>c,s=s.filter(([,h])=>h<c)}let l=new Map(s.reverse());for(let c of l.keys())this.prepend(c);a.forEach(c=>{l.has(c)?(c.size=c.filters[this.filter]?.size,c.style.removeProperty("display"),c.requestUpdate()):(c.style.display="none",c.size=void 0)}),window.scrollTo(0,n),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(dr,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(Re,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){X(this,we,{}),this.overrides?.split(",").forEach(r=>{let[n,a]=r?.split(":");n&&a&&(P(this,we)[n]=a)})}connectedCallback(){super.connectedCallback(),X(this,xt,Fn()),X(this,Et,P(this,xt).Log.module(qi)),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializeHeader(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r}initializePlaceholders(){let r=this.querySelectorAll("[placeholder]");if(r.length>0)r.forEach(n=>{let a=n.getAttribute("slot");ue.placeholderKeys.includes(a)&&this.header?.append(n)});else{let n=this.data?.placeholders||{};for(let a of Object.keys(n)){let i=n[a],o=i.includes("<p>")?"div":"p",s=document.createElement(o);s.setAttribute("slot",a),s.setAttribute("placeholder",""),s.innerHTML=i,ue.placeholderKeys.includes(a)?this.header?.append(s):this.append(s)}}}attachSidenav(r,n=!0){r&&(n&&this.parentElement.prepend(r),this.sidenav=r,Oc[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.dispatchEvent(new CustomEvent(Ne)))}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.hydrating=!0;let n;this.hydrationReady=new Promise(o=>{n=o});let a=this;function i(o,s){let l={cards:[],hierarchy:[],placeholders:o.placeholders};function c(h,u){for(let m of u){if(m.fieldName==="cards"){if(l.cards.findIndex(p=>p.id===m.identifier)!==-1)continue;l.cards.push(o.references[m.identifier].value);continue}let{fields:d}=o.references[m.identifier].value,f={label:d.label,icon:d.icon,iconLight:d.iconLight,navigationLabel:d.navigationLabel,cards:d.cards.map(p=>s[p]||p),collections:[]};h.push(f),c(f.collections,m.referencesTree)}}return c(l.hierarchy,o.referencesTree),l.hierarchy.length===0&&(a.filtered="all"),l}r.addEventListener(ur,o=>{yt(this,rr,Wi).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(mr,async o=>{this.data=i(o.detail,P(this,we));let{cards:s,hierarchy:l}=this.data;for(let u of s){let f=function(b){for(let A of b){let v=A.cards.indexOf(d);if(v===-1)continue;let y=A.label.toLowerCase();m.filters[y]={order:v+1,size:u.fields.size},f(A.collections)}},m=document.createElement("merch-card"),d=P(this,we)[u.id]||u.id;m.setAttribute("consonant",""),m.setAttribute("style",""),f(l);let p=document.createElement("aem-fragment");p.setAttribute("fragment",d),m.append(p),Object.keys(m.filters).length===0&&(m.filters={all:{order:s.indexOf(u)+1,size:u.fields.size}}),this.append(m)}let c="",h=s[0]?.fields.variant;h.startsWith("plans")&&(h="plans"),this.variant=h,h==="plans"&&s.length===3&&!s.some(u=>u.fields.size?.includes("wide"))&&(c="ThreeColumns"),this.classList.add("merch-card-collection",h,...Mc[`${h}${c}`]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),n()}),await this.hydrationReady}get footer(){if(!this.filtered)return Cn`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return Cn`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===J.authored?Ke({sort:void 0}):Ke({sort:r.target.value}),this.dispatchEvent(new CustomEvent(lr,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(hr,{bubbles:!0,composed:!0}));let r=this.page+1;Ke({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=In(({category:r,filter:n,types:a,sort:i,search:o,single_app:s,page:l})=>{n=n||r,!this.filtered&&n&&n!==this.filter&&setTimeout(()=>{Ke({page:void 0}),this.page=1},1),this.filtered||(this.filter=n??this.filter),this.types=a??"",this.search=o??"",this.singleApp=s,this.sort=i,this.page=Number(l)||1})}openFilters(r){this.sidenav?.showModal(r)}};we=new WeakMap,xt=new WeakMap,Et=new WeakMap,rr=new WeakSet,Wi=function(r,n={},a=!0){P(this,Et).error(`merch-card-collection: ${r}`,n),this.failed=!0,a&&this.dispatchEvent(new CustomEvent(pr,{detail:{...n,message:r},bubbles:!0,composed:!0}))},g(Xe,"properties",{displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:J.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(Xe,"styles",[Un]);Xe.SortOrder=J;customElements.define(qi,Xe);export{Xe as MerchCardCollection};
