var An=Object.defineProperty;var _n=e=>{throw TypeError(e)};var Ya=(e,t,r)=>t in e?An(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var qa=(e,t)=>{for(var r in t)An(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>Ya(e,typeof t!="symbol"?t+"":t,r),Jt=(e,t,r)=>t.has(e)||_n("Cannot "+r);var V=(e,t,r)=>(Jt(e,t,"read from private field"),r?r.call(e):t.get(e)),W=(e,t,r)=>t.has(e)?_n("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),te=(e,t,r,n)=>(Jt(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),wn=(e,t,r)=>(Jt(e,t,"access private method"),r);import{html as vn,LitElement as xc}from"../lit-all.min.js";var Pn="hashchange";function Wa(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let n of r){let[i,a=""]=n.split("=");i&&t.push([i,decodeURIComponent(a.replace(/\+/g," "))])}return Object.fromEntries(t)}function Ye(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([i,a])=>{a?t.set(i,a):t.delete(i)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let n=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,n)}function Cn(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=Wa(window.location.hash);e(r)};return t(),window.addEventListener(Pn,t),()=>{window.removeEventListener(Pn,t)}}var _r={};qa(_r,{CLASS_NAME_FAILED:()=>cr,CLASS_NAME_HIDDEN:()=>Ka,CLASS_NAME_PENDING:()=>lr,CLASS_NAME_RESOLVED:()=>hr,CheckoutWorkflow:()=>uo,CheckoutWorkflowStep:()=>z,Commitment:()=>Ee,ERROR_MESSAGE_BAD_REQUEST:()=>mr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>lo,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>dr,EVENT_AEM_ERROR:()=>or,EVENT_AEM_LOAD:()=>ar,EVENT_MAS_ERROR:()=>sr,EVENT_MAS_READY:()=>co,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>oo,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>tr,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>Ce,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>nr,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>Le,EVENT_MERCH_CARD_COLLECTION_SORT:()=>rr,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>ao,EVENT_MERCH_OFFER_READY:()=>Ja,EVENT_MERCH_OFFER_SELECT_READY:()=>eo,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>io,EVENT_MERCH_SEARCH_CHANGE:()=>so,EVENT_MERCH_SIDENAV_SELECT:()=>ir,EVENT_MERCH_STOCK_CHANGE:()=>ro,EVENT_MERCH_STORAGE_CHANGE:()=>no,EVENT_OFFER_SELECTED:()=>to,EVENT_TYPE_FAILED:()=>ur,EVENT_TYPE_READY:()=>Et,EVENT_TYPE_RESOLVED:()=>pr,Env:()=>ne,FF_DEFAULTS:()=>We,HEADER_X_REQUEST_ID:()=>qe,LOG_NAMESPACE:()=>fr,Landscape:()=>pe,MARK_DURATION_SUFFIX:()=>Sr,MARK_START_SUFFIX:()=>Tr,MODAL_TYPE_3_IN_1:()=>xe,NAMESPACE:()=>Xa,PARAM_AOS_API_KEY:()=>ho,PARAM_ENV:()=>Er,PARAM_LANDSCAPE:()=>xr,PARAM_MAS_PREVIEW:()=>gr,PARAM_WCS_API_KEY:()=>mo,PROVIDER_ENVIRONMENT:()=>vr,SELECTOR_MAS_CHECKOUT_LINK:()=>Ln,SELECTOR_MAS_ELEMENT:()=>er,SELECTOR_MAS_INLINE_PRICE:()=>re,SELECTOR_MAS_SP_BUTTON:()=>Za,SORT_ORDER:()=>K,STATE_FAILED:()=>J,STATE_PENDING:()=>ue,STATE_RESOLVED:()=>se,TAG_NAME_SERVICE:()=>Qa,TEMPLATE_PRICE:()=>po,TEMPLATE_PRICE_ANNUAL:()=>go,TEMPLATE_PRICE_LEGAL:()=>Ar,TEMPLATE_PRICE_STRIKETHROUGH:()=>fo,Term:()=>X,WCS_PROD_URL:()=>br,WCS_STAGE_URL:()=>yr});var Ee=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),X=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),Xa="merch",Ka="hidden",Et="wcms:commerce:ready",Qa="mas-commerce-service",re='span[is="inline-price"][data-wcs-osi]',Ln='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',Za="sp-button[data-wcs-osi]",er=`${re},${Ln}`,Ja="merch-offer:ready",eo="merch-offer-select:ready",tr="merch-card:action-menu-toggle",to="merch-offer:selected",ro="merch-stock:change",no="merch-storage:change",io="merch-quantity-selector:change",ao="merch-card-quantity:change",oo="merch-modal:addon-and-quantity-update",so="merch-search:change",rr="merch-card-collection:sort",Ce="merch-card-collection:literals-changed",Le="merch-card-collection:sidenav-attached",nr="merch-card-collection:showmore",ir="merch-sidenav:select",ar="aem:load",or="aem:error",co="mas:ready",sr="mas:error",cr="placeholder-failed",lr="placeholder-pending",hr="placeholder-resolved",mr="Bad WCS request",dr="Commerce offer not found",lo="Literals URL not provided",ur="mas:failed",pr="mas:resolved",fr="mas/commerce",gr="mas.preview",Er="commerce.env",xr="commerce.landscape",ho="commerce.aosKey",mo="commerce.wcsKey",br="https://www.adobe.com/web_commerce_artifact",yr="https://www.stage.adobe.com/web_commerce_artifact_stage",J="failed",ue="pending",se="resolved",pe={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},qe="X-Request-Id",z=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),uo="UCv3",ne=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),vr={PRODUCTION:"PRODUCTION"},xe={TWP:"twp",D2P:"d2p",CRM:"crm"},Tr=":start",Sr=":duration",po="price",fo="price-strikethrough",go="annual",Ar="legal",We="mas-ff-defaults",K={alphabetical:"alphabetical",authored:"authored"};import{css as Eo,unsafeCSS as Rn}from"../lit-all.min.js";var ie="(max-width: 767px)",xt="(max-width: 1199px)",O="(min-width: 768px)",R="(min-width: 1200px)",fe="(min-width: 1600px)";var Nn=Eo`
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
    @media screen and ${Rn(O)} {
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
    @media screen and ${Rn(R)} {
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
`;var xo="mas-commerce-service";var Xe=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function Re(e,t={},r=null,n=null){let i=n?document.createElement(e,{is:n}):document.createElement(e);r instanceof HTMLElement?i.appendChild(r):i.innerHTML=r;for(let[a,o]of Object.entries(t))i.setAttribute(a,o);return i}function bt(){return window.matchMedia("(max-width: 767px)")}function Ne(){return bt().matches}function yt(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function Mn(){return window.matchMedia("(max-width: 1024px)").matches}function On(){return document.getElementsByTagName(xo)?.[0]}var In="tacocat.js";var wr=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),Hn=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function P(e,t={},{metadata:r=!0,search:n=!0,storage:i=!0}={}){let a;if(n&&a==null){let o=new URLSearchParams(window.location.search),s=Me(n)?n:e;a=o.get(s)}if(i&&a==null){let o=Me(i)?i:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&a==null){let o=yo(Me(r)?r:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var bo=e=>typeof e=="boolean",vt=e=>typeof e=="function",Tt=e=>typeof e=="number",Dn=e=>e!=null&&typeof e=="object";var Me=e=>typeof e=="string",kn=e=>Me(e)&&e,Ke=e=>Tt(e)&&Number.isFinite(e)&&e>0;function Qe(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function x(e,t){if(bo(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function Ze(e,t,r){let n=Object.values(t);return n.find(i=>wr(i,e))??r??n[0]}function yo(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function Un(e,t=1){return Tt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var vo=Date.now(),Pr=()=>`(+${Date.now()-vo}ms)`,St=new Set,To=x(P("tacocat.debug",{},{metadata:!1}),!1);function Bn(e){let t=`[${In}/${e}]`,r=(o,s,...l)=>o?!0:(i(s,...l),!1),n=To?(o,...s)=>{console.debug(`${t} ${o}`,...s,Pr())}:()=>{},i=(o,...s)=>{let l=`${t} ${o}`;St.forEach(([c])=>c(l,...s))};return{assert:r,debug:n,error:i,warn:(o,...s)=>{let l=`${t} ${o}`;St.forEach(([,c])=>c(l,...s))}}}function So(e,t){let r=[e,t];return St.add(r),()=>{St.delete(r)}}So((e,...t)=>{console.error(e,...t,Pr())},(e,...t)=>{console.warn(e,...t,Pr())});var Ao="no promo",Fn="promo-tag",_o="yellow",wo="neutral",Po=(e,t,r)=>{let n=a=>a||Ao,i=r?` (was "${n(t)}")`:"";return`${n(e)}${i}`},Co="cancel-context",At=(e,t)=>{let r=e===Co,n=!r&&e?.length>0,i=(n||r)&&(t&&t!=e||!t&&!r),a=i&&n||!i&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?Fn:`${Fn} no-promo`,text:Po(o,t,i),variant:a?_o:wo,isOverriden:i}};var Cr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Cr||(Cr={}));var q;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(q||(q={}));var Q;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(Q||(Q={}));var Lr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Lr||(Lr={}));var Rr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Rr||(Rr={}));var Nr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Nr||(Nr={}));var Mr;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Mr||(Mr={}));var Or="ABM",Ir="PUF",Hr="M2M",Dr="PERPETUAL",kr="P3Y",Lo="TAX_INCLUSIVE_DETAILS",Ro="TAX_EXCLUSIVE",Gn={ABM:Or,PUF:Ir,M2M:Hr,PERPETUAL:Dr,P3Y:kr},$c={[Or]:{commitment:q.YEAR,term:Q.MONTHLY},[Ir]:{commitment:q.YEAR,term:Q.ANNUAL},[Hr]:{commitment:q.MONTH,term:Q.MONTHLY},[Dr]:{commitment:q.PERPETUAL,term:void 0},[kr]:{commitment:q.THREE_MONTHS,term:Q.P3Y}},$n="Value is not an offer",_t=e=>{if(typeof e!="object")return $n;let{commitment:t,term:r}=e,n=No(t,r);return{...e,planType:n}};var No=(e,t)=>{switch(e){case void 0:return $n;case"":return"";case q.YEAR:return t===Q.MONTHLY?Or:t===Q.ANNUAL?Ir:"";case q.MONTH:return t===Q.MONTHLY?Hr:"";case q.PERPETUAL:return Dr;case q.TERM_LICENSE:return t===Q.P3Y?kr:"";default:return""}};function Vn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:i,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==Lo)return e;let s={...e,priceDetails:{...t,price:i??r,priceWithoutDiscount:a??n,taxDisplay:Ro}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var Mo="mas-commerce-service",Oo={requestId:qe,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function Je(e,{country:t,forceTaxExclusive:r,perpetual:n}){let i;if(e.length<2)i=e;else{let a=t==="GB"?"EN":"MULT";e.sort((o,s)=>o.language===a?-1:s.language===a?1:0),e.sort((o,s)=>o.term?1:s.term?-1:0),i=[e[0]]}return r&&(i=i.map(Vn)),i}var wt=e=>window.setTimeout(e);function Oe(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(Un).filter(Ke);return r.length||(r=[t]),r}function Pt(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(kn)}function $(){return document.getElementsByTagName(Mo)?.[0]}function zn(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[n,i]of Object.entries(Oo)){let a=r.get(i);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),t[n]=a)}return t}var be={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},jn=1e3;function Io(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function Yn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:i,status:a}=e;return[n,a,i].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!be.serializableTypes.includes(r))return r}return e}function Ho(e,t){if(!be.ignoredProperties.includes(e))return Yn(t)}var Ur={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,n=[],i=[],a=t;r.forEach(c=>{c!=null&&(Io(c)?n:i).push(c)}),n.length&&(a+=" "+n.map(Yn).join(" "));let{pathname:o,search:s}=window.location,l=`${be.delimiter}page=${o}${s}`;l.length>jn&&(l=`${l.slice(0,jn)}<trunc>`),a+=l,i.length&&(a+=`${be.delimiter}facts=`,a+=JSON.stringify(i,Ho)),window.lana?.log(a,be)}};function Ct(e){Object.assign(be,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in be&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var qn={LOCAL:"local",PROD:"prod",STAGE:"stage"},Br={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},Fr=new Set,Gr=new Set,Wn=new Map,Xn={append({level:e,message:t,params:r,timestamp:n,source:i}){console[e](`${n}ms [${i}] %c${t}`,"font-weight: bold;",...r)}},Kn={filter:({level:e})=>e!==Br.DEBUG},Do={filter:()=>!1};function ko(e,t,r,n,i){return{level:e,message:t,namespace:r,get params(){return n.length===1&&vt(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:i,timestamp:performance.now().toFixed(3)}}function Uo(e){[...Gr].every(t=>t(e))&&Fr.forEach(t=>t(e))}function Qn(e){let t=(Wn.get(e)??0)+1;Wn.set(e,t);let r=`${e} #${t}`,n={id:r,namespace:e,module:i=>Qn(`${n.namespace}/${i}`),updateConfig:Ct};return Object.values(Br).forEach(i=>{n[i]=(a,...o)=>Uo(ko(i,a,e,o,r))}),Object.seal(n)}function Lt(...e){e.forEach(t=>{let{append:r,filter:n}=t;vt(n)&&Gr.add(n),vt(r)&&Fr.add(r)})}function Bo(e={}){let{name:t}=e,r=x(P("commerce.debug",{search:!0,storage:!0}),t===qn.LOCAL);return Lt(r?Xn:Kn),t===qn.PROD&&Lt(Ur),Z}function Fo(){Fr.clear(),Gr.clear()}var Z={...Qn(fr),Level:Br,Plugins:{consoleAppender:Xn,debugFilter:Kn,quietFilter:Do,lanaAppender:Ur},init:Bo,reset:Fo,use:Lt};var Ie=class e extends Error{constructor(t,r,n){if(super(t,{cause:n}),this.name="MasError",r.response){let i=r.response.headers?.get(qe);i&&(r.requestId=i),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([n,i])=>`${n}: ${JSON.stringify(i)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var Go={[J]:cr,[ue]:lr,[se]:hr},$o={[J]:ur,[se]:pr},et,He=class{constructor(t){W(this,et);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",ue);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=Z.module("mas-element")}update(){[J,ue,se].forEach(t=>{this.wrapperElement.classList.toggle(Go[t],t===this.state)})}notify(){(this.state===se||this.state===J)&&(this.state===se?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===J&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof Ie&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent($o[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){te(this,et,$()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:n}=this;return se===n?Promise.resolve(this.wrapperElement):J===n?Promise.reject(t):new Promise((i,a)=>{r.push({resolve:i,reject:a})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=se,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),wt(()=>this.notify()),!0)}toggleFailed(t,r,n){if(t!==this.version)return!1;n!==void 0&&(this.options=n),this.error=r,this.state=J,this.update();let i=this.wrapperElement.getAttribute("is");return this.log?.error(`${i}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...V(this,et)?.duration}),wt(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=ue,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!$()||this.timer)return;let{error:r,options:n,state:i,value:a,version:o}=this;this.state=ue,this.timer=wt(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===ue&&this.version===o&&(this.state=i,this.error=r,this.value=a,this.update(),this.notify())}catch(l){this.toggleFailed(this.version,l,n)}})}};et=new WeakMap;function Zn(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Rt(e,t={}){let{tag:r,is:n}=e,i=document.createElement(r,{is:n});return i.setAttribute("is",n),Object.assign(i.dataset,Zn(t)),i}function Nt(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Zn(t)),e):null}var Jn="download",ei="upgrade",ti={e:"EDU",t:"TEAM"};function ri(e,t={},r=""){let n=$();if(!n)return null;let{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:h,promotionCode:d,quantity:u,wcsOsi:m,extraOptions:p,analyticsId:f}=n.collectCheckoutOptions(t),E=Rt(e,{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:h,promotionCode:d,quantity:u,wcsOsi:m,extraOptions:p,analyticsId:f});return r&&(E.innerHTML=`<span style="pointer-events: none;">${r}</span>`),E}function ni(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new He(this))}attributeChangedCallback(n,i,a){this.masElement.attributeChangedCallback(n,i,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let n=this.options?.ms??this.value?.[0].marketSegments?.[0];return ti[n]??n}get customerSegment(){let n=this.options?.cs??this.value?.[0]?.customerSegment;return ti[n]??n}get is3in1Modal(){return Object.values(xe).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let n=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!n||n.content!=="off")}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){let i=$();if(!i)return!1;this.dataset.imsCountry||i.imsCountryPromise.then(d=>{d&&(this.dataset.imsCountry=d)}),n.imsCountry=null;let a=i.collectCheckoutOptions(n,this);if(!a.wcsOsi.length)return!1;let o;try{o=JSON.parse(a.extraOptions??"{}")}catch(d){this.masElement.log?.error("cannot parse exta checkout options",d)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let l=i.resolveOfferSelectors(a),c=await Promise.all(l);c=c.map(d=>Je(d,a)),a.country=this.dataset.imsCountry||a.country;let h=await i.buildCheckoutAction?.(c.flat(),{...o,...a},this);return this.renderOffers(c.flat(),a,{},h,s)}renderOffers(n,i,a={},o=void 0,s=void 0){let l=$();if(!l)return!1;if(i={...JSON.parse(this.dataset.extraOptions??"null"),...i,...a},s??(s=this.masElement.togglePending(i)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),o){this.classList.remove(Jn,ei),this.masElement.toggleResolved(s,n,i);let{url:h,text:d,className:u,handler:m}=o;h&&this.setCheckoutUrl(h),d&&(this.firstElementChild.innerHTML=d),u&&this.classList.add(...u.split(" ")),m&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=m.bind(this))}if(n.length){if(this.masElement.toggleResolved(s,n,i)){if(!this.classList.contains(Jn)&&!this.classList.contains(ei)){let h=l.buildCheckoutURL(n,i);this.setCheckoutUrl(i.modal==="true"?"#":h)}return!0}}else{let h=new Error(`Not provided: ${i?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,h,i))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let i=$();if(!i)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:h,perpetual:d,promotionCode:u,quantity:m,wcsOsi:p}=i.collectCheckoutOptions(n);return Nt(this,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:h,perpetual:d,promotionCode:u,quantity:m,wcsOsi:p}),!0}}}var tt=class tt extends ni(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return ri(tt,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(tt,"is","checkout-link"),g(tt,"tag","a");var ce=tt;window.customElements.get(ce.is)||window.customElements.define(ce.is,ce,{extends:ce.tag});var Vo="p_draft_landscape",zo="/store/",jo=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),$r=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),Yo=["env","workflowStep","clientId","country"],ii=e=>jo.get(e)??e;function Vr(e,t,r){for(let[n,i]of Object.entries(e)){let a=ii(n);i!=null&&r.has(a)&&t.set(a,i)}}function qo(e){switch(e){case vr.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Wo(e,t){for(let r in e){let n=e[r];for(let[i,a]of Object.entries(n)){if(a==null)continue;let o=ii(i);t.set(`items[${r}][${o}]`,a)}}}function Xo({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let n=e.searchParams.get("af");return e.searchParams.set("af",[n,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===xe.CRM?"creative":"mini_plans"),e}function ai(e){Ko(e);let{env:t,items:r,workflowStep:n,marketSegment:i,customerSegment:a,offerType:o,productArrangementCode:s,landscape:l,modal:c,is3in1:h,preselectPlan:d,...u}=e,m=new URL(qo(t));if(m.pathname=`${zo}${n}`,n!==z.SEGMENTATION&&n!==z.CHANGE_PLAN_TEAM_PLANS&&Wo(r,m.searchParams),Vr({...u},m.searchParams,$r),l===pe.DRAFT&&Vr({af:Vo},m.searchParams,$r),n===z.SEGMENTATION){let p={marketSegment:i,offerType:o,customerSegment:a,productArrangementCode:s,quantity:r?.[0]?.quantity,addonProductArrangementCode:s?r?.find(f=>f.productArrangementCode!==s)?.productArrangementCode:r?.[1]?.productArrangementCode};d?.toLowerCase()==="edu"?m.searchParams.set("ms","EDU"):d?.toLowerCase()==="team"&&m.searchParams.set("cs","TEAM"),Vr(p,m.searchParams,$r),m.searchParams.get("ot")==="PROMOTION"&&m.searchParams.delete("ot"),m=Xo({url:m,modal:c,is3in1:h})}return m.toString()}function Ko(e){for(let t of Yo)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==z.SEGMENTATION&&e.workflowStep!==z.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var A=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:z.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!0,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:ne.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:pe.PUBLISHED});function oi({settings:e}){function t(i,a){let{checkoutClientId:o,checkoutWorkflowStep:s,country:l,language:c,promotionCode:h,quantity:d,preselectPlan:u}=e,{checkoutMarketSegment:m,checkoutWorkflowStep:p=s,imsCountry:f,country:E=f??l,language:_=c,quantity:S=d,entitlement:y,upgrade:N,modal:w,perpetual:M,promotionCode:I=h,wcsOsi:F,extraOptions:L,...U}=Object.assign({},a?.dataset??{},i??{}),D=Ze(p,z,A.checkoutWorkflowStep);return Qe({...U,extraOptions:L,checkoutClientId:o,checkoutMarketSegment:m,country:E,quantity:Oe(S,A.quantity),checkoutWorkflowStep:D,language:_,entitlement:x(y),upgrade:x(N),modal:w,perpetual:x(M),promotionCode:At(I).effectivePromoCode,wcsOsi:Pt(F),preselectPlan:u})}function r(i,a){if(!Array.isArray(i)||!i.length||!a)return"";let{env:o,landscape:s}=e,{checkoutClientId:l,checkoutMarketSegment:c,checkoutWorkflowStep:h,country:d,promotionCode:u,quantity:m,preselectPlan:p,ms:f,cs:E,..._}=t(a),S=document.querySelector("meta[name=mas-ff-3in1]"),y=Object.values(xe).includes(a.modal)&&(!S||S.content!=="off"),N=window.frameElement||y?"if":"fp",[{productArrangementCode:w,marketSegments:[M],customerSegment:I,offerType:F}]=i,L=f??M??c,U=E??I;p?.toLowerCase()==="edu"?L="EDU":p?.toLowerCase()==="team"&&(U="TEAM");let D={is3in1:y,checkoutPromoCode:u,clientId:l,context:N,country:d,env:o,items:[],marketSegment:L,customerSegment:U,offerType:F,productArrangementCode:w,workflowStep:h,landscape:s,..._},de=m[0]>1?m[0]:void 0;if(i.length===1){let{offerId:oe}=i[0];D.items.push({id:oe,quantity:de})}else D.items.push(...i.map(({offerId:oe,productArrangementCode:_e})=>({id:oe,quantity:de,...y?{productArrangementCode:_e}:{}})));return ai(D)}let{createCheckoutLink:n}=ce;return{CheckoutLink:ce,CheckoutWorkflowStep:z,buildCheckoutURL:r,collectCheckoutOptions:t,createCheckoutLink:n}}function Qo({interval:e=200,maxAttempts:t=25}={}){let r=Z.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let i=0;function a(){window.adobeIMS?.initialized?n():++i>t?(r.debug("Timeout"),n()):setTimeout(a,e)}a()})}function Zo(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function Jo(e){let t=Z.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function si({}){let e=Qo(),t=Zo(e),r=Jo(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var ci=window.masPriceLiterals;function li(e){if(Array.isArray(ci)){let t=n=>ci.find(i=>wr(i.lang,n)),r=t(e.language)??t(A.language);if(r)return Object.freeze(r)}return{}}var zr=function(e,t){return zr=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(r[i]=n[i])},zr(e,t)};function rt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");zr(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var v=function(){return v=Object.assign||function(t){for(var r,n=1,i=arguments.length;n<i;n++){r=arguments[n];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},v.apply(this,arguments)};function Mt(e,t,r){if(r||arguments.length===2)for(var n=0,i=t.length,a;n<i;n++)(a||!(n in t))&&(a||(a=Array.prototype.slice.call(t,0,n)),a[n]=t[n]);return e.concat(a||Array.prototype.slice.call(t))}var b;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(b||(b={}));var C;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(C||(C={}));var ye;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(ye||(ye={}));function jr(e){return e.type===C.literal}function hi(e){return e.type===C.argument}function Ot(e){return e.type===C.number}function It(e){return e.type===C.date}function Ht(e){return e.type===C.time}function Dt(e){return e.type===C.select}function kt(e){return e.type===C.plural}function mi(e){return e.type===C.pound}function Ut(e){return e.type===C.tag}function Bt(e){return!!(e&&typeof e=="object"&&e.type===ye.number)}function nt(e){return!!(e&&typeof e=="object"&&e.type===ye.dateTime)}var Yr=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var es=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function di(e){var t={};return e.replace(es,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var ui=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Ei(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(ui).filter(function(u){return u.length>0}),r=[],n=0,i=t;n<i.length;n++){var a=i[n],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],l=o.slice(1),c=0,h=l;c<h.length;c++){var d=h[c];if(d.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:l})}return r}function ts(e){return e.replace(/^(.*?)-/,"")}var pi=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,xi=/^(@+)?(\+|#+)?[rs]?$/g,rs=/(\*)(0+)|(#+)(0+)|(0+)/g,bi=/^(0+)$/;function fi(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(xi,function(r,n,i){return typeof i!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):i==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof i=="string"?i.length:0)),""}),t}function yi(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function ns(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!bi.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function gi(e){var t={},r=yi(e);return r||t}function vi(e){for(var t={},r=0,n=e;r<n.length;r++){var i=n[r];switch(i.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=i.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=ts(i.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=v(v(v({},t),{notation:"scientific"}),i.options.reduce(function(l,c){return v(v({},l),gi(c))},{}));continue;case"engineering":t=v(v(v({},t),{notation:"engineering"}),i.options.reduce(function(l,c){return v(v({},l),gi(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(i.options[0]);continue;case"integer-width":if(i.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");i.options[0].replace(rs,function(l,c,h,d,u,m){if(c)t.minimumIntegerDigits=h.length;else{if(d&&u)throw new Error("We currently do not support maximum integer digits");if(m)throw new Error("We currently do not support exact integer digits")}return""});continue}if(bi.test(i.stem)){t.minimumIntegerDigits=i.stem.length;continue}if(pi.test(i.stem)){if(i.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");i.stem.replace(pi,function(l,c,h,d,u,m){return h==="*"?t.minimumFractionDigits=c.length:d&&d[0]==="#"?t.maximumFractionDigits=d.length:u&&m?(t.minimumFractionDigits=u.length,t.maximumFractionDigits=u.length+m.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""});var a=i.options[0];a==="w"?t=v(v({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=v(v({},t),fi(a)));continue}if(xi.test(i.stem)){t=v(v({},t),fi(i.stem));continue}var o=yi(i.stem);o&&(t=v(v({},t),o));var s=ns(i.stem);s&&(t=v(v({},t),s))}return t}var it={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function Ti(e,t){for(var r="",n=0;n<e.length;n++){var i=e.charAt(n);if(i==="j"){for(var a=0;n+1<e.length&&e.charAt(n+1)===i;)a++,n++;var o=1+(a&1),s=a<2?1:3+(a>>1),l="a",c=is(t);for((c=="H"||c=="k")&&(s=0);s-- >0;)r+=l;for(;o-- >0;)r=c+r}else i==="J"?r+="H":r+=i}return r}function is(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,n;r!=="root"&&(n=e.maximize().region);var i=it[n||""]||it[r||""]||it["".concat(r,"-001")]||it["001"];return i[0]}var qr,as=new RegExp("^".concat(Yr.source,"*")),os=new RegExp("".concat(Yr.source,"*$"));function T(e,t){return{start:e,end:t}}var ss=!!String.prototype.startsWith,cs=!!String.fromCodePoint,ls=!!Object.fromEntries,hs=!!String.prototype.codePointAt,ms=!!String.prototype.trimStart,ds=!!String.prototype.trimEnd,us=!!Number.isSafeInteger,ps=us?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},Xr=!0;try{Si=Pi("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Xr=((qr=Si.exec("a"))===null||qr===void 0?void 0:qr[0])==="a"}catch{Xr=!1}var Si,Ai=ss?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},Kr=cs?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",i=t.length,a=0,o;i>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");n+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return n},_i=ls?Object.fromEntries:function(t){for(var r={},n=0,i=t;n<i.length;n++){var a=i[n],o=a[0],s=a[1];r[o]=s}return r},wi=hs?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var i=t.charCodeAt(r),a;return i<55296||i>56319||r+1===n||(a=t.charCodeAt(r+1))<56320||a>57343?i:(i-55296<<10)+(a-56320)+65536}},fs=ms?function(t){return t.trimStart()}:function(t){return t.replace(as,"")},gs=ds?function(t){return t.trimEnd()}:function(t){return t.replace(os,"")};function Pi(e,t){return new RegExp(e,t)}var Qr;Xr?(Wr=Pi("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Qr=function(t,r){var n;Wr.lastIndex=r;var i=Wr.exec(t);return(n=i[1])!==null&&n!==void 0?n:""}):Qr=function(t,r){for(var n=[];;){var i=wi(t,r);if(i===void 0||Li(i)||bs(i))break;n.push(i),r+=i>=65536?2:1}return Kr.apply(void 0,n)};var Wr,Ci=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var i=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,n);if(o.err)return o;i.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),i.push({type:C.pound,location:T(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(b.UNMATCHED_CLOSING_TAG,T(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&Zr(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;i.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;i.push(o.val)}}}return{val:i,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var i=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:C.literal,value:"<".concat(i,"/>"),location:T(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Zr(this.char()))return this.error(b.INVALID_TAG,T(s,this.clonePosition()));var l=this.clonePosition(),c=this.parseTagName();return i!==c?this.error(b.UNMATCHED_CLOSING_TAG,T(l,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:C.tag,value:i,children:o,location:T(n,this.clonePosition())},err:null}:this.error(b.INVALID_TAG,T(s,this.clonePosition())))}else return this.error(b.UNCLOSED_TAG,T(n,this.clonePosition()))}else return this.error(b.INVALID_TAG,T(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&xs(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),i="";;){var a=this.tryParseQuote(r);if(a){i+=a;continue}var o=this.tryParseUnquoted(t,r);if(o){i+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){i+=s;continue}break}var l=T(n,this.clonePosition());return{val:{type:C.literal,value:i,location:l},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Es(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return Kr.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),Kr(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,T(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(b.EMPTY_ARGUMENT,T(n,this.clonePosition()));var i=this.parseIdentifierIfPossible().value;if(!i)return this.error(b.MALFORMED_ARGUMENT,T(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,T(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:C.argument,value:i,location:T(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,T(n,this.clonePosition())):this.parseArgumentOptions(t,r,i,n);default:return this.error(b.MALFORMED_ARGUMENT,T(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=Qr(this.message,r),i=r+n.length;this.bumpTo(i);var a=this.clonePosition(),o=T(t,a);return{value:n,location:o}},e.prototype.parseArgumentOptions=function(t,r,n,i){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,l=this.clonePosition();switch(s){case"":return this.error(b.EXPECT_ARGUMENT_TYPE,T(o,l));case"number":case"date":case"time":{this.bumpSpace();var c=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var u=gs(d.val);if(u.length===0)return this.error(b.EXPECT_ARGUMENT_STYLE,T(this.clonePosition(),this.clonePosition()));var m=T(h,this.clonePosition());c={style:u,styleLocation:m}}var p=this.tryParseArgumentClose(i);if(p.err)return p;var f=T(i,this.clonePosition());if(c&&Ai(c?.style,"::",0)){var E=fs(c.style.slice(2));if(s==="number"){var d=this.parseNumberSkeletonFromString(E,c.styleLocation);return d.err?d:{val:{type:C.number,value:n,location:f,style:d.val},err:null}}else{if(E.length===0)return this.error(b.EXPECT_DATE_TIME_SKELETON,f);var _=E;this.locale&&(_=Ti(E,this.locale));var u={type:ye.dateTime,pattern:_,location:c.styleLocation,parsedOptions:this.shouldParseSkeletons?di(_):{}},S=s==="date"?C.date:C.time;return{val:{type:S,value:n,location:f,style:u},err:null}}}return{val:{type:s==="number"?C.number:s==="date"?C.date:C.time,value:n,location:f,style:(a=c?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var y=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(b.EXPECT_SELECT_ARGUMENT_OPTIONS,T(y,v({},y)));this.bumpSpace();var N=this.parseIdentifierIfPossible(),w=0;if(s!=="select"&&N.value==="offset"){if(!this.bumpIf(":"))return this.error(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,T(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,b.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),N=this.parseIdentifierIfPossible(),w=d.val}var M=this.tryParsePluralOrSelectOptions(t,s,r,N);if(M.err)return M;var p=this.tryParseArgumentClose(i);if(p.err)return p;var I=T(i,this.clonePosition());return s==="select"?{val:{type:C.select,value:n,options:_i(M.val),location:I},err:null}:{val:{type:C.plural,value:n,options:_i(M.val),offset:w,pluralType:s==="plural"?"cardinal":"ordinal",location:I},err:null}}default:return this.error(b.INVALID_ARGUMENT_TYPE,T(o,l))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,T(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var i=this.clonePosition();if(!this.bumpUntil("'"))return this.error(b.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,T(i,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=Ei(t)}catch{return this.error(b.INVALID_NUMBER_SKELETON,r)}return{val:{type:ye.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?vi(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,i){for(var a,o=!1,s=[],l=new Set,c=i.value,h=i.location;;){if(c.length===0){var d=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_SELECTOR,b.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;h=T(d,this.clonePosition()),c=this.message.slice(d.offset,this.offset())}else break}if(l.has(c))return this.error(r==="select"?b.DUPLICATE_SELECT_ARGUMENT_SELECTOR:b.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);c==="other"&&(o=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:b.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,T(this.clonePosition(),this.clonePosition()));var p=this.parseMessage(t+1,r,n);if(p.err)return p;var f=this.tryParseArgumentClose(m);if(f.err)return f;s.push([c,{value:p.val,location:T(m,this.clonePosition())}]),l.add(c),this.bumpSpace(),a=this.parseIdentifierIfPossible(),c=a.value,h=a.location}return s.length===0?this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR:b.EXPECT_PLURAL_ARGUMENT_SELECTOR,T(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(b.MISSING_OTHER_CLAUSE,T(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,i=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var l=T(i,this.clonePosition());return a?(o*=n,ps(o)?{val:o,err:null}:this.error(r,l)):this.error(t,l)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=wi(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Ai(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Li(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function Zr(e){return e>=97&&e<=122||e>=65&&e<=90}function Es(e){return Zr(e)||e===47}function xs(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Li(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function bs(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function Jr(e){e.forEach(function(t){if(delete t.location,Dt(t)||kt(t))for(var r in t.options)delete t.options[r].location,Jr(t.options[r].value);else Ot(t)&&Bt(t.style)||(It(t)||Ht(t))&&nt(t.style)?delete t.style.location:Ut(t)&&Jr(t.children)})}function Ri(e,t){t===void 0&&(t={}),t=v({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Ci(e,t).parse();if(r.err){var n=SyntaxError(b[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||Jr(r.val),r.val}function at(e,t){var r=t&&t.cache?t.cache:_s,n=t&&t.serializer?t.serializer:As,i=t&&t.strategy?t.strategy:vs;return i(e,{cache:r,serializer:n})}function ys(e){return e==null||typeof e=="number"||typeof e=="boolean"}function Ni(e,t,r,n){var i=ys(n)?n:r(n),a=t.get(i);return typeof a>"u"&&(a=e.call(this,n),t.set(i,a)),a}function Mi(e,t,r){var n=Array.prototype.slice.call(arguments,3),i=r(n),a=t.get(i);return typeof a>"u"&&(a=e.apply(this,n),t.set(i,a)),a}function en(e,t,r,n,i){return r.bind(t,e,n,i)}function vs(e,t){var r=e.length===1?Ni:Mi;return en(e,this,r,t.cache.create(),t.serializer)}function Ts(e,t){return en(e,this,Mi,t.cache.create(),t.serializer)}function Ss(e,t){return en(e,this,Ni,t.cache.create(),t.serializer)}var As=function(){return JSON.stringify(arguments)};function tn(){this.cache=Object.create(null)}tn.prototype.get=function(e){return this.cache[e]};tn.prototype.set=function(e,t){this.cache[e]=t};var _s={create:function(){return new tn}},Ft={variadic:Ts,monadic:Ss};var ve;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(ve||(ve={}));var ot=function(e){rt(t,e);function t(r,n,i){var a=e.call(this,r)||this;return a.code=n,a.originalMessage=i,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var rn=function(e){rt(t,e);function t(r,n,i,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(n,'". Options are "').concat(Object.keys(i).join('", "'),'"'),ve.INVALID_VALUE,a)||this}return t}(ot);var Oi=function(e){rt(t,e);function t(r,n,i){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(n),ve.INVALID_VALUE,i)||this}return t}(ot);var Ii=function(e){rt(t,e);function t(r,n){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(n,'"'),ve.MISSING_VALUE,n)||this}return t}(ot);var G;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(G||(G={}));function ws(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==G.literal||r.type!==G.literal?t.push(r):n.value+=r.value,t},[])}function Ps(e){return typeof e=="function"}function st(e,t,r,n,i,a,o){if(e.length===1&&jr(e[0]))return[{type:G.literal,value:e[0].value}];for(var s=[],l=0,c=e;l<c.length;l++){var h=c[l];if(jr(h)){s.push({type:G.literal,value:h.value});continue}if(mi(h)){typeof a=="number"&&s.push({type:G.literal,value:r.getNumberFormat(t).format(a)});continue}var d=h.value;if(!(i&&d in i))throw new Ii(d,o);var u=i[d];if(hi(h)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),s.push({type:typeof u=="string"?G.literal:G.object,value:u});continue}if(It(h)){var m=typeof h.style=="string"?n.date[h.style]:nt(h.style)?h.style.parsedOptions:void 0;s.push({type:G.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(Ht(h)){var m=typeof h.style=="string"?n.time[h.style]:nt(h.style)?h.style.parsedOptions:n.time.medium;s.push({type:G.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(Ot(h)){var m=typeof h.style=="string"?n.number[h.style]:Bt(h.style)?h.style.parsedOptions:void 0;m&&m.scale&&(u=u*(m.scale||1)),s.push({type:G.literal,value:r.getNumberFormat(t,m).format(u)});continue}if(Ut(h)){var p=h.children,f=h.value,E=i[f];if(!Ps(E))throw new Oi(f,"function",o);var _=st(p,t,r,n,i,a),S=E(_.map(function(w){return w.value}));Array.isArray(S)||(S=[S]),s.push.apply(s,S.map(function(w){return{type:typeof w=="string"?G.literal:G.object,value:w}}))}if(Dt(h)){var y=h.options[u]||h.options.other;if(!y)throw new rn(h.value,u,Object.keys(h.options),o);s.push.apply(s,st(y.value,t,r,n,i));continue}if(kt(h)){var y=h.options["=".concat(u)];if(!y){if(!Intl.PluralRules)throw new ot(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,ve.MISSING_INTL_API,o);var N=r.getPluralRules(t,{type:h.pluralType}).select(u-(h.offset||0));y=h.options[N]||h.options.other}if(!y)throw new rn(h.value,u,Object.keys(h.options),o);s.push.apply(s,st(y.value,t,r,n,i,u-(h.offset||0)));continue}}return ws(s)}function Cs(e,t){return t?v(v(v({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=v(v({},e[n]),t[n]||{}),r},{})):e}function Ls(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=Cs(e[n],t[n]),r},v({},e)):e}function nn(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Rs(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:at(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,Mt([void 0],r,!1)))},{cache:nn(e.number),strategy:Ft.variadic}),getDateTimeFormat:at(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,Mt([void 0],r,!1)))},{cache:nn(e.dateTime),strategy:Ft.variadic}),getPluralRules:at(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,Mt([void 0],r,!1)))},{cache:nn(e.pluralRules),strategy:Ft.variadic})}}var Hi=function(){function e(t,r,n,i){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var l=s.reduce(function(c,h){return!c.length||h.type!==G.literal||typeof c[c.length-1]!="string"?c.push(h.value):c[c.length-1]+=h.value,c},[]);return l.length<=1?l[0]||"":l},this.formatToParts=function(o){return st(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:i?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Ls(e.formats,n),this.formatters=i&&i.formatters||Rs(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=Ri,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Di=Hi;var Ns=/[0-9\-+#]/,Ms=/[^\d\-+#]/g;function ki(e){return e.search(Ns)}function Os(e="#.##"){let t={},r=e.length,n=ki(e);t.prefix=n>0?e.substring(0,n):"";let i=ki(e.split("").reverse().join("")),a=r-i,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=i>0?e.substring(s,r):"",t.mask=e.substring(n,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let l=t.mask.match(Ms);return t.decimal=l&&l[l.length-1]||".",t.separator=l&&l[1]&&l[0]||",",l=t.mask.split(t.decimal),t.integer=l[0],t.fraction=l[1],t}function Is(e,t,r){let n=!1,i={value:e};e<0&&(n=!0,i.value=-i.value),i.sign=n?"-":"",i.value=Number(i.value).toFixed(t.fraction&&t.fraction.length),i.value=Number(i.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=i.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),i.integer=o,i.fraction=s,Hs(i,t),(i.result==="0"||i.result==="")&&(n=!1,i.sign=""),!n&&t.maskHasPositiveSign?i.sign="+":n&&t.maskHasPositiveSign?i.sign="-":n&&(i.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),i}function Hs(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),i=n&&n.indexOf("0");if(i>-1)for(;e.integer.length<n.length-i;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let l=0;l<o;l++)e.result+=e.integer.charAt(l),!((l-s+1)%a)&&l<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Ds(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Os(e),i=Is(t,n,r);return n.prefix+i.sign+i.result+n.suffix}var Ui=Ds;var Bi=".",ks=",",Gi=/^\s+/,$i=/\s+$/,Fi="&nbsp;",an=e=>e*12,Vi=(e,t)=>{let{start:r,end:n,displaySummary:{amount:i,duration:a,minProductQuantity:o,outcomeType:s}={}}=e;if(!(i&&a&&s&&o))return!1;let l=t?new Date(t):new Date;if(!r||!n)return!1;let c=new Date(r),h=new Date(n);return l>=c&&l<=h},Te={MONTH:"MONTH",YEAR:"YEAR"},Us={[X.ANNUAL]:12,[X.MONTHLY]:1,[X.THREE_YEARS]:36,[X.TWO_YEARS]:24},on=(e,t)=>({accept:e,round:t}),Bs=[on(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),on(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),on(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],sn={[Ee.YEAR]:{[X.MONTHLY]:Te.MONTH,[X.ANNUAL]:Te.YEAR},[Ee.MONTH]:{[X.MONTHLY]:Te.MONTH}},Fs=(e,t)=>e.indexOf(`'${t}'`)===0,Gs=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=ji(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Vs(e)),r},$s=e=>{let t=zs(e),r=Fs(e,t),n=e.replace(/'.*?'/,""),i=Gi.test(n)||$i.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:i}},zi=e=>e.replace(Gi,Fi).replace($i,Fi),Vs=e=>e.match(/#(.?)#/)?.[1]===Bi?ks:Bi,zs=e=>e.match(/'(.*?)'/)?.[1]??"",ji=e=>e.match(/0(.?)0/)?.[1]??"";function De({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},i,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:l}=$s(e),c=r?ji(e):"",h=Gs(e,r),d=r?2:0,u=a(t,{currencySymbol:o}),m=n?u.toLocaleString("hi-IN",{minimumFractionDigits:d,maximumFractionDigits:d}):Ui(h,u),p=r?m.lastIndexOf(c):m.length,f=m.substring(0,p),E=m.substring(p+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,o),currencySymbol:o,decimals:E,decimalsDelimiter:c,hasCurrencySpace:l,integer:f,isCurrencyFirst:s,recurrenceTerm:i}}var Yi=e=>{let{commitment:t,term:r,usePrecision:n}=e,i=Us[r]??1;return De(e,i>1?Te.MONTH:sn[t]?.[r],a=>{let o={divisor:i,price:a,usePrecision:n},{round:s}=Bs.find(({accept:l})=>l(o));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(o)}`);return s(o)})},qi=({commitment:e,term:t,...r})=>De(r,sn[e]?.[t]),Wi=e=>{let{commitment:t,instant:r,price:n,originalPrice:i,priceWithoutDiscount:a,promotion:o,quantity:s=1,term:l}=e;if(t===Ee.YEAR&&l===X.MONTHLY){if(!o)return De(e,Te.YEAR,an);let{displaySummary:{outcomeType:c,duration:h,minProductQuantity:d=1}={}}=o;switch(c){case"PERCENTAGE_DISCOUNT":if(s>=d&&Vi(o,r)){let u=parseInt(h.replace("P","").replace("M",""));if(isNaN(u))return an(n);let m=s*i*u,p=s*a*(12-u),f=Math.round((m+p)*100)/100;return De({...e,price:f},Te.YEAR)}default:return De(e,Te.YEAR,()=>an(a??n))}}return De(e,sn[t]?.[l])};var cn={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, paid monthly.} other {}}"},js=Bn("ConsonantTemplates/price"),Ys=/<\/?[^>]+(>|$)/g,H={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},ge={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},ln="TAX_EXCLUSIVE",qs=e=>Dn(e)?Object.entries(e).filter(([,t])=>Me(t)||Tt(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+Hn(n)+'"'}`,""):"",k=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+H.disabled}"${qs(r)}>${n?zi(t):t??""}</span>`;function le(e,t,r,n){let i=e[r];if(i==null)return"";try{return new Di(i.replace(Ys,""),t).format(n)}catch{return js.error("Failed to format literal:",i),""}}function Ws(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:n,decimals:i,decimalsDelimiter:a,hasCurrencySpace:o,integer:s,isCurrencyFirst:l,recurrenceLabel:c,perUnitLabel:h,taxInclusivityLabel:d},u={}){let m=k(H.currencySymbol,n),p=k(H.currencySpace,o?"&nbsp;":""),f="";return t?f=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),l&&(f+=m+p),f+=k(H.integer,s),f+=k(H.decimalsDelimiter,a),f+=k(H.decimals,i),l||(f+=p+m),f+=k(H.recurrence,c,null,!0),f+=k(H.unitType,h,null,!0),f+=k(H.taxInclusivity,d,!0),k(e,f,{...u})}var j=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:n=!1,instant:i=void 0}={})=>({country:a,displayFormatted:o=!0,displayRecurrence:s=!0,displayPerUnit:l=!1,displayTax:c=!1,language:h,literals:d={},quantity:u=1}={},{commitment:m,offerSelectorIds:p,formatString:f,price:E,priceWithoutDiscount:_,taxDisplay:S,taxTerm:y,term:N,usePrecision:w,promotion:M}={},I={})=>{Object.entries({country:a,formatString:f,language:h,price:E}).forEach(([za,ja])=>{if(ja==null)throw new Error(`Argument "${za}" is missing for osi ${p?.toString()}, country ${a}, language ${h}`)});let F={...cn,...d},L=`${h.toLowerCase()}-${a.toUpperCase()}`,U=r&&_?_:E,D=t?Yi:qi;n&&(D=Wi);let{accessiblePrice:de,recurrenceTerm:oe,..._e}=D({commitment:m,formatString:f,instant:i,isIndianPrice:a==="IN",originalPrice:E,priceWithoutDiscount:_,price:t?E:U,promotion:M,quantity:u,term:N,usePrecision:w}),Wt="",Xt="",Kt="";x(s)&&oe&&(Kt=le(F,L,ge.recurrenceLabel,{recurrenceTerm:oe}));let Qt="";x(l)&&(Qt=le(F,L,ge.perUnitLabel,{perUnit:"LICENSE"}));let Zt="";x(c)&&y&&(Zt=le(F,L,S===ln?ge.taxExclusiveLabel:ge.taxInclusiveLabel,{taxTerm:y})),r&&(Wt=le(F,L,ge.strikethroughAriaLabel,{strikethroughPrice:Wt})),e&&(Xt=le(F,L,ge.alternativePriceAriaLabel,{alternativePrice:Xt}));let we=H.container;if(t&&(we+=" "+H.containerOptical),r&&(we+=" "+H.containerStrikethrough),e&&(we+=" "+H.containerAlternative),n&&(we+=" "+H.containerAnnual),x(o))return Ws(we,{..._e,accessibleLabel:Wt,altAccessibleLabel:Xt,recurrenceLabel:Kt,perUnitLabel:Qt,taxInclusivityLabel:Zt},I);let{currencySymbol:Tn,decimals:Ba,decimalsDelimiter:Fa,hasCurrencySpace:Sn,integer:Ga,isCurrencyFirst:$a}=_e,Pe=[Ga,Fa,Ba];$a?(Pe.unshift(Sn?"\xA0":""),Pe.unshift(Tn)):(Pe.push(Sn?"\xA0":""),Pe.push(Tn)),Pe.push(Kt,Qt,Zt);let Va=Pe.join("");return k(we,Va,I)},Xi=()=>(e,t,r)=>{let i=(e.displayOldPrice===void 0||x(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${i?j({displayStrikethrough:!0})(e,t,r)+"&nbsp;":""}${j({isAlternativePrice:i})(e,t,r)}`},Ki=()=>(e,t,r)=>{let{instant:n}=e;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let i={...e,displayTax:!1,displayPerUnit:!1},o=(e.displayOldPrice===void 0||x(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${o?j({displayStrikethrough:!0})(i,t,r)+"&nbsp;":""}${j({isAlternativePrice:o})(e,t,r)}${k(H.containerAnnualPrefix,"&nbsp;(")}${j({displayAnnual:!0,instant:n})(i,t,r)}${k(H.containerAnnualSuffix,")")}`},Qi=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${j({isAlternativePrice:e.displayOldPrice})(e,t,r)}${k(H.containerAnnualPrefix,"&nbsp;(")}${j({displayAnnual:!0})(n,t,r)}${k(H.containerAnnualSuffix,")")}`};var ct={...H,containerLegal:"price-legal",planType:"price-plan-type"},Gt={...ge,planTypeLabel:"planTypeLabel"};function Xs(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:n},i={}){let a="";return a+=k(ct.unitType,t,null,!0),t&&(r||n)&&(a+=" ("),r&&n&&(r+=". "),a+=k(ct.taxInclusivity,r,!0),a+=k(ct.planType,n,null),t&&(r||n)&&(a+=")"),k(e,a,{...i})}var Zi=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:n=!1,language:i,literals:a={}}={},{taxDisplay:o,taxTerm:s,planType:l}={},c={})=>{let h={...cn,...a},d=`${i.toLowerCase()}-${e.toUpperCase()}`,u="";x(t)&&(u=le(h,d,Gt.perUnitLabel,{perUnit:"LICENSE"}));let m="";e==="US"&&i==="en"&&(r=!1),x(r)&&s&&(m=le(h,d,o===ln?Gt.taxExclusiveLabel:Gt.taxInclusiveLabel,{taxTerm:s}));let p="";x(n)&&l&&(p=le(h,d,Gt.planTypeLabel,{planType:l}));let f=ct.container;return f+=" "+ct.containerLegal,Xs(f,{perUnitLabel:u,taxInclusivityLabel:m,planTypeLabel:p},c)};var Ji=j(),ea=Xi(),ta=j({displayOptical:!0}),ra=j({displayStrikethrough:!0}),na=j({displayAnnual:!0}),ia=j({displayOptical:!0,isAlternativePrice:!0}),aa=j({isAlternativePrice:!0}),oa=Qi(),sa=Ki(),ca=Zi;var Ks=(e,t)=>{if(!(!Ke(e)||!Ke(t)))return Math.floor((t-e)/t*100)},la=()=>(e,t)=>{let{price:r,priceWithoutDiscount:n}=t,i=Ks(r,n);return i===void 0?'<span class="no-discount"></span>':`<span class="discount">${i}%</span>`};var ha=la();var da="INDIVIDUAL_COM",hn="TEAM_COM",ua="INDIVIDUAL_EDU",mn="TEAM_EDU",ma=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],Qs={[da]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[hn]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[ua]:["LT_lt","LV_lv","SA_en","SG_en"],[mn]:["SG_en","KR_ko"]},Zs={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},Js=[da,hn,ua,mn],ec=e=>[hn,mn].includes(e),tc=(e,t,r,n)=>{let i=`${e}_${t}`,a=`${r}_${n}`,o=Zs[i];if(o){let s=Js.indexOf(a);return o[s]}return ec(a)},rc=(e,t,r,n)=>{let i=`${e}_${t}`;if(ma.includes(e)||ma.includes(i))return!0;let a=Qs[`${r}_${n}`];return a?a.includes(e)||a.includes(i)?!0:A.displayTax:A.displayTax},nc=async(e,t,r,n)=>{let i=rc(e,t,r,n);return{displayTax:i,forceTaxExclusive:i?tc(e,t,r,n):A.forceTaxExclusive}},lt=class lt extends HTMLSpanElement{constructor(){super();g(this,"masElement",new He(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let n=$();if(!n)return null;let{displayOldPrice:i,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:l,displayAnnual:c,forceTaxExclusive:h,perpetual:d,promotionCode:u,quantity:m,alternativePrice:p,template:f,wcsOsi:E}=n.collectPriceOptions(r);return Rt(lt,{displayOldPrice:i,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:l,displayAnnual:c,forceTaxExclusive:h,perpetual:d,promotionCode:u,quantity:m,alternativePrice:p,template:f,wcsOsi:E})}get isInlinePrice(){return!0}attributeChangedCallback(r,n,i){this.masElement.attributeChangedCallback(r,n,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===J}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let n=$();if(!n)return!1;let i=n.collectPriceOptions(r,this);if(!i.wcsOsi.length)return!1;if(P(We)==="on"&&(!this.dataset.displayTax||!this.dataset.forceTaxExclusive)){let[l]=await n.resolveOfferSelectors(i),c=Je(await l,i);if(c?.length){let{country:h,language:d}=i,u=c[0],[m=""]=u.marketSegments,p=await nc(h,d,u.customerSegment,m);this.dataset.displayTax||(i.displayTax=p?.displayTax||i.displayTax),this.dataset.forceTaxExclusive||(i.forceTaxExclusive=p?.forceTaxExclusive||i.forceTaxExclusive)}}let o=this.masElement.togglePending(i);this.innerHTML="";let[s]=n.resolveOfferSelectors(i);try{let l=await s;return this.renderOffers(Je(l,i),i,o)}catch(l){throw this.innerHTML="",l}}renderOffers(r,n={},i=void 0){if(!this.isConnected)return;let a=$();if(!a)return!1;let o=a.collectPriceOptions({...this.dataset,...n},this);if(i??(i=this.masElement.togglePending(o)),r.length){if(this.masElement.toggleResolved(i,r,o)){this.innerHTML=a.buildPriceHTML(r,o);let s=this.closest("p, h3, div");if(!s||!s.querySelector('span[data-template="strikethrough"]')||s.querySelector(".alt-aria-label"))return!0;let l=s?.querySelectorAll('span[is="inline-price"]');return l.length>1&&l.length===s.querySelectorAll('span[data-template="strikethrough"]').length*2&&l.forEach(c=>{c.dataset.template!=="strikethrough"&&c.options&&!c.options.alternativePrice&&!c.isFailed&&(c.options.alternativePrice=!0,c.innerHTML=a.buildPriceHTML(r,c.options))}),!0}}else{let s=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(i,s,o))return this.innerHTML="",!0}return!1}updateOptions(r){let n=$();if(!n)return!1;let{alternativePrice:i,displayOldPrice:a,displayPerUnit:o,displayRecurrence:s,displayTax:l,forceTaxExclusive:c,perpetual:h,promotionCode:d,quantity:u,template:m,wcsOsi:p}=n.collectPriceOptions(r);return Nt(this,{alternativePrice:i,displayOldPrice:a,displayPerUnit:o,displayRecurrence:s,displayTax:l,forceTaxExclusive:c,perpetual:h,promotionCode:d,quantity:u,template:m,wcsOsi:p}),!0}};g(lt,"is","inline-price"),g(lt,"tag","span");var he=lt;window.customElements.get(he.is)||window.customElements.define(he.is,he,{extends:he.tag});function pa({literals:e,providers:t,settings:r}){function n(o,s=null){let l=structuredClone(r);if(s)for(let M of t.price)M(s,l);let{displayOldPrice:c,displayPerUnit:h,displayRecurrence:d,displayTax:u,displayPlanType:m,forceTaxExclusive:p,perpetual:f,displayAnnual:E,promotionCode:_,quantity:S,alternativePrice:y,wcsOsi:N,...w}=Object.assign(l,s?.dataset??{},o??{});return Object.assign(l,Qe({...w,displayOldPrice:x(c),displayPerUnit:x(h),displayRecurrence:x(d),displayTax:x(u),displayPlanType:x(m),forceTaxExclusive:x(p),perpetual:x(f),displayAnnual:x(E),promotionCode:At(_).effectivePromoCode,quantity:Oe(S,A.quantity),alternativePrice:x(y),wcsOsi:Pt(N)})),l}function i(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:l}=s,c;switch(l){case"discount":c=ha;break;case"strikethrough":c=ra;break;case"annual":c=na;break;case"legal":c=ca;break;default:s.template==="optical"&&s.alternativePrice?c=ia:s.template==="optical"?c=ta:s.displayAnnual&&o[0].planType==="ABM"?c=s.promotionCode?sa:oa:s.alternativePrice?c=aa:c=s.promotionCode?ea:Ji}let h=n(s);h.literals=Object.assign({},e.price,Qe(s.literals??{}));let[d]=o;return d={...d,...d.priceDetails},c(h,d)}let a=he.createInlinePrice;return{InlinePrice:he,buildPriceHTML:i,collectPriceOptions:n,createInlinePrice:a}}function ic({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||A.language),t??(t=e?.split("_")?.[1]||A.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function fa(e={}){let t=P(We)==="on",{commerce:r={}}=e,n=ne.PRODUCTION,i=br,a=P("checkoutClientId",r)??A.checkoutClientId,o=Ze(P("checkoutWorkflowStep",r),z,A.checkoutWorkflowStep),s=x(P("displayOldPrice",r),t?A.displayOldPrice:!A.displayOldPrice),l=x(P("displayPerUnit",r),t?A.displayPerUnit:!A.displayPerUnit),c=x(P("displayRecurrence",r),A.displayRecurrence),h=x(P("displayTax",r),A.displayTax),d=x(P("displayPlanType",r),A.displayPlanType),u=x(P("entitlement",r),A.entitlement),m=x(P("modal",r),A.modal),p=x(P("forceTaxExclusive",r),A.forceTaxExclusive),f=P("promotionCode",r)??A.promotionCode,E=Oe(P("quantity",r)),_=P("wcsApiKey",r)??A.wcsApiKey,S=r?.env==="stage",y=pe.PUBLISHED;["true",""].includes(r.allowOverride)&&(S=(P(Er,r,{metadata:!1})?.toLowerCase()??r?.env)==="stage",y=Ze(P(xr,r),pe,y)),S&&(n=ne.STAGE,i=yr);let w=P(gr)??e.preview,M=typeof w<"u"&&w!=="off"&&w!=="false",I={};M&&(I={preview:M});let F=P("mas-io-url")??e.masIOUrl??`https://www${n===ne.STAGE?".stage":""}.adobe.com/mas/io`,L=P("preselect-plan")??void 0;return{...ic(e),...I,displayOldPrice:s,checkoutClientId:a,checkoutWorkflowStep:o,displayPerUnit:l,displayRecurrence:c,displayTax:h,displayPlanType:d,entitlement:u,extraOptions:A.extraOptions,modal:m,env:n,forceTaxExclusive:p,promotionCode:f,quantity:E,alternativePrice:A.alternativePrice,wcsApiKey:_,wcsURL:i,landscape:y,masIOUrl:F,...L&&{preselectPlan:L}}}async function ga(e,t={},r=2,n=100){let i;for(let a=0;a<=r;a++)try{let o=await fetch(e,t);return o.retryCount=a,o}catch(o){if(i=o,i.retryCount=a,a>r)break;await new Promise(s=>setTimeout(s,n*(a+1)))}throw i}var dn="wcs";function Ea({settings:e}){let t=Z.module(dn),{env:r,wcsApiKey:n}=e,i=new Map,a=new Map,o,s=new Map;async function l(m,p,f=!0){let E=$(),_=dr;t.debug("Fetching:",m);let S="",y;if(m.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let N=new Map(p),[w]=m.offerSelectorIds,M=Date.now()+Math.random().toString(36).substring(2,7),I=`${dn}:${w}:${M}${Tr}`,F=`${dn}:${w}:${M}${Sr}`,L;try{if(performance.mark(I),S=new URL(e.wcsURL),S.searchParams.set("offer_selector_ids",w),S.searchParams.set("country",m.country),S.searchParams.set("locale",m.locale),S.searchParams.set("landscape",r===ne.STAGE?"ALL":e.landscape),S.searchParams.set("api_key",n),m.language&&S.searchParams.set("language",m.language),m.promotionCode&&S.searchParams.set("promotion_code",m.promotionCode),m.currency&&S.searchParams.set("currency",m.currency),y=await ga(S.toString(),{credentials:"omit"}),y.ok){let U=[];try{let D=await y.json();t.debug("Fetched:",m,D),U=D.resolvedOffers??[]}catch(D){t.error(`Error parsing JSON: ${D.message}`,{...D.context,...E?.duration})}U=U.map(_t),p.forEach(({resolve:D},de)=>{let oe=U.filter(({offerSelectorIds:_e})=>_e.includes(de)).flat();oe.length&&(N.delete(de),p.delete(de),D(oe))})}else _=mr}catch(U){_=`Network error: ${U.message}`}finally{L=performance.measure(F,I),performance.clearMarks(I),performance.clearMeasures(F)}if(f&&p.size){t.debug("Missing:",{offerSelectorIds:[...p.keys()]});let U=zn(y);p.forEach(D=>{D.reject(new Ie(_,{...m,...U,response:y,measure:yt(L),...E?.duration}))})}}function c(){clearTimeout(o);let m=[...a.values()];a.clear(),m.forEach(({options:p,promises:f})=>l(p,f))}function h(m){if(!m||typeof m!="object")throw new TypeError("Cache must be a Map or similar object");let p=r===ne.STAGE?"stage":"prod",f=m[p];if(!f||typeof f!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[E,_]of Object.entries(f))i.set(E,Promise.resolve(_.map(_t)));t.debug(`Prefilled WCS cache with ${f.size} entries`)}function d(){let m=i.size;s=new Map(i),i.clear(),t.debug(`Moved ${m} cache entries to stale cache`)}function u({country:m,language:p,perpetual:f=!1,promotionCode:E="",wcsOsi:_=[]}){let S=`${p}_${m}`;m!=="GB"&&!f&&(p="MULT");let y=[m,p,E].filter(N=>N).join("-").toLowerCase();return _.map(N=>{let w=`${N}-${y}`;if(i.has(w))return i.get(w);let M=new Promise((I,F)=>{let L=a.get(y);if(!L){let U={country:m,locale:S,offerSelectorIds:[]};m!=="GB"&&!f&&(U.language=p),L={options:U,promises:new Map},a.set(y,L)}E&&(L.options.promotionCode=E),L.options.offerSelectorIds.push(N),L.promises.set(N,{resolve:I,reject:F}),c()}).catch(I=>{if(s.has(w))return s.get(w);throw I});return i.set(w,M),M})}return{Commitment:Ee,PlanType:Gn,Term:X,applyPlanType:_t,resolveOfferSelectors:u,flushWcsCacheInternal:d,prefillWcsCache:h}}var xa="mas-commerce-service",ba="mas-commerce-service:start",ya="mas-commerce-service:ready",ht,$t,va,un=class extends HTMLElement{constructor(){super(...arguments);W(this,$t);W(this,ht);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(n,i,a)=>{let o=await r?.(n,i,this.imsSignedInPromise,a);return o||null})}activate(){let r=V(this,$t,va),n=fa(r);Ct(r.lana);let i=Z.init(r.hostEnv).module("service");i.debug("Activating:",r);let o={price:li(n)},s={checkout:new Set,price:new Set},l={literals:o,providers:s,settings:n};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...oi(l),...si(l),...pa(l),...Ea(l),..._r,Log:Z,get defaults(){return A},get log(){return Z},get providers(){return{checkout(h){return s.checkout.add(h),()=>s.checkout.delete(h)},price(h){return s.price.add(h),()=>s.price.delete(h)},has:h=>s.price.has(h)||s.checkout.has(h)}},get settings(){return n}})),i.debug("Activated:",{literals:o,settings:n});let c=new CustomEvent(Et,{bubbles:!0,cancelable:!1,detail:this});performance.mark(ya),te(this,ht,performance.measure(ya,ba)),this.dispatchEvent(c),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(ba),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(er).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh()),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":yt(V(this,ht))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:i})=>i>this.lastLoggingTime).filter(({transferSize:i,duration:a,responseStatus:o})=>i===0&&a===0&&o<200||o>=400),n=Array.from(new Map(r.map(i=>[i.name,i])).values());if(n.some(({name:i})=>/(\/fragments\/|web_commerce_artifact)/.test(i))){let i=n.map(({name:a})=>a);this.log.error("Failed requests:",{failedUrls:i,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};ht=new WeakMap,$t=new WeakSet,va=function(){let r=this.getAttribute("env")??"prod",n={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(i=>{let a=this.getAttribute(i);a&&(n[i]=a)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(i=>{let a=this.getAttribute(i);if(a!=null){let o=i.replace(/-([a-z])/g,s=>s[1].toUpperCase());n.commerce[o]=a}}),n};window.customElements.get(xa)||window.customElements.define(xa,un);import{html as ze,css as uc,unsafeCSS as Da,LitElement as pc,nothing as ee}from"../lit-all.min.js";var mt=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};import{html as Vt,nothing as ac}from"../lit-all.min.js";var ke,dt=class dt{constructor(t){g(this,"card");W(this,ke);this.card=t,this.insertVariantStyle()}getContainer(){return te(this,ke,V(this,ke)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),V(this,ke)}insertVariantStyle(){if(!dt.styleMap[this.card.variant]){dt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,i=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(n))||0;i>a&&this.getContainer().style.setProperty(n,`${i}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Vt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Vt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Vt`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:ac}get secureLabelFooter(){return Vt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Ta(this.card.variant)}};ke=new WeakMap,g(dt,"styleMap",{});var B=dt;import{html as pn,css as oc}from"../lit-all.min.js";var Sa=`
:root {
  --consonant-merch-card-catalog-icon-size: 40px;
}

.collection-container.catalog {
    --merch-card-collection-card-width: 276px;
}

@media screen and ${O} {
    .collection-container.catalog {
        --merch-card-collection-card-width: 302px;
    }
}

@media screen and ${R} {
    .collection-container.catalog {
        --merch-card-collection-card-width: 276px;
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
}`;var Aa={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Ue=class extends B{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(tr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let n=this.actionMenuContentSlot.classList.contains("hidden");n||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!n).toString())});g(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(n||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",n),this.setAriaExpanded(this.actionMenu,"false"))});g(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return pn` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Mn()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":pn`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?pn`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Sa}setAriaExpanded(r,n){r.setAttribute("aria-expanded",n)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};g(Ue,"variantStyle",oc`
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
    `);import{html as ut}from"../lit-all.min.js";var _a=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${O} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${R} {
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
`;var zt=class extends B{constructor(t){super(t)}getGlobalCSS(){return _a}renderLayout(){return ut`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?ut`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:ut`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?ut`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:ut`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as Pa}from"../lit-all.min.js";var wa=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${O} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${R} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${fe} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var jt=class extends B{constructor(t){super(t)}getGlobalCSS(){return wa}renderLayout(){return Pa` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Pa`<hr />`} ${this.secureLabelFooter}`}};import{html as Be,css as sc,unsafeCSS as fn}from"../lit-all.min.js";var Ca=`
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
@media screen and ${ie} {
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

@media screen and ${xt} {
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
@media screen and ${O} {
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
@media screen and ${R} {
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

@media screen and ${fe} {
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
`;var cc=32,Fe=class extends B{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Be`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Be`<slot name="secure-transaction-label"></slot>`;return Be`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Ca}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(i=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${i}"]`),i)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((n,i)=>{let a=Math.max(cc,parseFloat(window.getComputedStyle(n).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(i+1)))||0;a>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(i+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let i=n.querySelector(".footer-row-cell-description");i&&!i.textContent.trim()&&n.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${re}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let n=this.mainPrice,i=this.headingMPriceSlot;if(!n&&i){let a=r?.getAttribute("plan-type"),o=null;if(r&&a&&(o=r.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(o){let s=Re("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},o.innerHTML);this.card.appendChild(s)}}else{let s=Re("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let n=this.mainPrice,i=this.card.planType;n&&(await n.onceSettled(),i=n.value?.[0]?.planType),i&&(r.planType=i)}renderLayout(){return Be` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?Be`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:Be`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),Ne()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(Fe,"variantStyle",sc`
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

    @media screen and ${fn(ie)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${fn(xt)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${fn(R)} {
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
  `);import{html as Se,css as lc,nothing as pt}from"../lit-all.min.js";var La=`
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

merch-card-collection.plans merch-card aem-fragment + [slot^="heading-"] {
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
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding-top: 16px;
    flex-grow: 1;
    align-items: end;
}

merch-card[variant^="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

merch-card[variant^="plans"] [slot="footer"] .con-button > span {
    min-width: unset;
}

merch-card[variant^="plans"] merch-addon {
    margin-top: 16px;
    margin-bottom: 16px;
    font-family: "Adobe Clean";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    align-items: center;
}

merch-card[variant^="plans"] merch-addon span[data-template="price"] {
    display: none;
}

/* Mobile */
@media screen and ${ie} {
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
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-width);
}

merch-card-collection-header.plans {
    --merch-card-collection-header-columns: 1fr fit-content(100%);
    --merch-card-collection-header-areas: "result filter";
    --merch-card-collection-header-result-font-size: 12px;
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
@media screen and ${O} {
  .collection-container.plans {
       --merch-card-collection-card-width: 302px;
  }

  .four-merch-cards.plans .foreground {
      max-width: unset;
  }
  
  .columns.merch-card > .row {
      grid-template-columns: repeat(auto-fit, calc(var(--consonant-merch-card-plans-width) * 2 + var(--consonant-merch-spacing-m)));
  }

  merch-card-collection-header.plans {
      --merch-card-collection-header-result-font-size: inherit;
  }
}

/* desktop */
@media screen and ${R} {
  .columns .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }

  merch-card[variant="plans-students"] {
      width: var(--consonant-merch-card-plans-students-width);
  }

  .collection-container.plans {
      --merch-card-collection-card-width: 276px;
  }

  merch-card-collection-header.plans {
      --merch-card-collection-header-columns: fit-content(100%);
      --merch-card-collection-header-areas: "custom";
  }
}

/* Large desktop */
@media screen and ${fe} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}
`;var Yt={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},Ra={...function(){let{whatsIncluded:e,...t}=Yt;return t}(),title:{tag:"h3",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},Na={...function(){let{whatsIncluded:e,size:t,quantitySelect:r,...n}=Yt;return n}()},Y=class extends B{constructor(t){super(t),this.adaptForMobile=this.adaptForMobile.bind(this)}priceOptionsProvider(t,r){t.dataset.template===Ar&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return La}adaptForMobile(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}let t=this.card.shadowRoot,r=t.querySelector("footer"),n=this.card.getAttribute("size"),i=t.querySelector("footer #stock-checkbox"),a=t.querySelector(".body #stock-checkbox"),o=t.querySelector(".body");if(!n){r?.classList.remove("wide-footer"),i&&i.remove();return}let s=Ne();if(r?.classList.toggle("wide-footer",!s),s&&i){a?i.remove():o.appendChild(i);return}!s&&a&&(i?a.remove():r.prepend(a))}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}postCardUpdateHook(){this.adaptForMobile(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${re}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?Se`<div class="divider"></div>`:pt}async adjustLegal(){if(await this.card.updateComplete,this.legalAdjusted)return;this.legalAdjusted=!0;let t=[],r=this.card.querySelector(`[slot="heading-m"] ${re}[data-template="price"]`);r&&t.push(r),this.card.querySelectorAll(`[slot="body-xs"] ${re}[data-template="price"]`).forEach(a=>t.push(a));let i=t.map(async a=>{let o=a.cloneNode(!0);await a.onceSettled(),a?.options&&(a.options.displayPerUnit&&(a.dataset.displayPerUnit="false"),a.options.displayTax&&(a.dataset.displayTax="false"),a.options.displayPlanType&&(a.dataset.displayPlanType="false"),o.setAttribute("data-template","legal"),a.parentNode.insertBefore(o,a.nextSibling))});await Promise.all(i)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice;if(!r)return;await r.onceSettled();let n=r.value?.[0]?.planType;n&&(t.planType=n)}get stockCheckbox(){return this.card.checkboxLabel?Se`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:pt}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?pt:Se`<slot name="icons"></slot>`}get addon(){return this.card.size==="super-wide"?pt:Se`<slot name="addon"></slot>`}get plansSecureLabelFooter(){return this.card.size==="super-wide"?Se`<footer><slot name="addon"></slot>${this.secureLabel}<slot name="footer"></slot></footer>`:this.secureLabelFooter}connectedCallbackHook(){let t=bt();t?.addEventListener&&t.addEventListener("change",this.adaptForMobile)}disconnectedCallbackHook(){let t=bt();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMobile)}renderLayout(){return Se` ${this.badge}
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
                ${this.stockCheckbox}
                ${this.addon}
                <slot name="badge"></slot>
                <slot name="quantity-select"></slot>
            </div>
            ${this.plansSecureLabelFooter}`}};g(Y,"variantStyle",lc`
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
    `),g(Y,"collectionOptions",{customHeaderArea:t=>t.sidenav?Se`<slot name="resultsText"></slot>`:pt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as gn,css as hc}from"../lit-all.min.js";var Ma=`
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
@media screen and ${O} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${R} {
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
`;var Ge=class extends B{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Ma}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return gn` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":gn`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?gn`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),Ne()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${re}[data-template="price"]`)}toggleAddon(t){let r=this.mainPrice,n=this.headingXSSlot;if(!r&&n){let i=t?.getAttribute("plan-type"),a=null;if(t&&i&&(a=t.querySelector(`p[data-plan-type="${i}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(o=>o.remove()),t.checked){if(a){let o=Re("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(o)}}else{let o=Re("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,n=this.card.planType;r&&(await r.onceSettled(),n=r.value?.[0]?.planType),n&&(t.planType=n)}};g(Ge,"variantStyle",hc`
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
    `);import{html as En,css as mc}from"../lit-all.min.js";var Oa=`
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
@media screen and ${ie} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${O} {
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
@media screen and ${R} {
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
`;var $e=class extends B{constructor(t){super(t)}getGlobalCSS(){return Oa}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return En` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":En`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?En`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};g($e,"variantStyle",mc`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as xn,css as dc}from"../lit-all.min.js";var Ia=`
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

@media screen and ${ie} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${O} {
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
@media screen and ${R} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${fe} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Ha={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Ve=class extends B{constructor(t){super(t)}getGlobalCSS(){return Ia}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return xn`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?xn`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:xn`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};g(Ve,"variantStyle",dc`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var bn=new Map,ae=(e,t,r=null,n=null,i)=>{bn.set(e,{class:t,fragmentMapping:r,style:n,collectionOptions:i})};ae("catalog",Ue,Aa,Ue.variantStyle);ae("image",zt);ae("inline-heading",jt);ae("mini-compare-chart",Fe,null,Fe.variantStyle);ae("plans",Y,Yt,Y.variantStyle,Y.collectionOptions);ae("plans-students",Y,Na,Y.variantStyle,Y.collectionOptions);ae("plans-education",Y,Ra,Y.variantStyle,Y.collectionOptions);ae("product",Ge,null,Ge.variantStyle);ae("segment",$e,null,$e.variantStyle);ae("special-offers",Ve,Ha,Ve.variantStyle);function Ta(e){return bn.get(e)?.fragmentMapping}function yn(e){return bn.get(e)?.collectionOptions}var fc={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},gc=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(i=>{i.innerText=r||""})},Ec={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},me=class extends pc{constructor(){super();g(this,"tablet",new mt(this,O));g(this,"desktop",new mt(this,R));this.collection??(this.collection=null),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(Ce,this.updateLiterals),this.collection?.addEventListener(Le,this.handleSidenavAttached)}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(Ce,this.updateLiterals),this.collection?.removeEventListener(Le,this.handleSidenavAttached)}get sidenav(){return this.collection?.sidenav}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}parseVisibilityOptions(r,n){if(!r||!Object.hasOwn(r,n))return null;let i=r[n];return i===!1?!1:i===!0?!0:i.includes(this.currentMedia)}getVisibility(r){let n=yn(this.collection?.variant)?.headerVisibility,i=this.parseVisibilityOptions(n,r);return i!==null?i:this.parseVisibilityOptions(Ec,r)}get searchAction(){if(!this.getVisibility("search"))return ee;let r=Xe(this,"searchText");return r?ze`
            <merch-search deeplink="search" id="search">
                <sp-search
                    id="search-bar"
                    placeholder="${r}"
                ></sp-search>
            </merch-search>
        `:ee}get filterAction(){return this.getVisibility("filter")?this.sidenav?ze`
            <sp-action-button
              id="filter"
              variant="secondary"
              treatment="outline"
              @click="${this.openFilters}"
              ><slot name="filtersText"></slot
            ></sp-action-button>
        `:ee:ee}get sortAction(){if(!this.getVisibility("sort"))return ee;let r=Xe(this,"sortText");if(!r)return;let n=Xe(this,"popularityText"),i=Xe(this,"alphabeticallyText");if(!(n&&i))return;let a=this.sort===K.alphabetical;return ze`
            <sp-action-menu
                id="sort"
                size="m"
                @change="${this.collection?.sortChanged}"
                selects="single"
                value="${a?K.alphabetical:K.authored}"
            >
                <span slot="label-only"
                    >${r}:
                    ${a?i:n}</span
                >
                <sp-menu-item value="${K.authored}"
                    >${n}</sp-menu-item
                >
                <sp-menu-item value="${K.alphabetical}"
                    >${i}</sp-menu-item
                >
            </sp-action-menu>
        `}get resultSlotName(){let r=`${this.collection?.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return fc[r][Math.min(this.collection?.resultCount,2)]}get resultLabel(){return this.getVisibility("result")?this.sidenav?ze`
          <div id="result" aria-live="polite">
              <slot name="${this.resultSlotName}"></slot>
          </div>`:ee:ee}get customArea(){if(!this.getVisibility("custom"))return ee;let r=yn(this.collection?.variant)?.customHeaderArea;if(!r)return ee;let n=r(this.collection);return!n||n===ee?ee:ze`<div id="custom">${n}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(n=>{gc(this,n,r.detail[n])})}handleSidenavAttached(){this.requestUpdate()}render(){return ze`
          <sp-theme color="light" scale="medium">
            <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
          </sp-theme>
        `}};g(me,"styles",uc`
        :host {
            --merch-card-collection-header-margin-bottom: 32px;
            --merch-card-collection-header-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-row-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-columns: auto max-content;
            --merch-card-collection-header-areas: "search search" 
                                                  "filter sort"
                                                  "result result";
            --merch-card-collection-header-result-font-size: inherit;
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

        #custom {
            grid-area: custom;
        }

        /* tablets */
        @media screen and ${Da(O)} {
            :host {
                --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                --merch-card-collection-header-areas: "search filter sort" 
                                                      "result result result";
            }
        }

        /* Laptop */
        @media screen and ${Da(R)} {
            :host {
                --merch-card-collection-header-columns: 1fr fit-content(100%);
                --merch-card-collection-header-areas: "result sort";
            }
        }
    `),g(me,"placeholderKeys",["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]);customElements.define("merch-card-collection-header",me);var ka="merch-card-collection",bc=2e4,yc={catalog:["four-merch-cards"],plans:["four-merch-cards"]},vc=(e,{filter:t})=>e.filter(r=>r.filters.hasOwnProperty(t)),Tc=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(n=>r.types.includes(n)))):e,Sc=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),Ac=(e,{filter:t})=>e.sort((r,n)=>n.filters[t]?.order==null||isNaN(n.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-n.filters[t].order),_c=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,Ae,ft,gt,qt,Ua,je=class extends xc{constructor(){super();W(this,qt);W(this,Ae,{});W(this,ft);W(this,gt);this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1}render(){return vn`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let n=new Promise(i=>setTimeout(()=>i(!1),bc));return Promise.race([this.hydrationReady,n])}updated(r){if(!this.querySelector("merch-card"))return;let n=window.scrollY||document.documentElement.scrollTop,i=[...this.children].filter(c=>c.tagName==="MERCH-CARD");if(i.length===0)return;r.has("singleApp")&&this.singleApp&&i.forEach(c=>{c.updateFilters(c.name===this.singleApp)});let a=this.sort===K.alphabetical?Sc:Ac,s=[vc,Tc,_c,a].reduce((c,h)=>h(c,this),i).map((c,h)=>[c,h]);if(this.resultCount=s.length,this.page&&this.limit){let c=this.page*this.limit;this.hasMore=s.length>c,s=s.filter(([,h])=>h<c)}let l=new Map(s.reverse());for(let c of l.keys())this.prepend(c);i.forEach(c=>{l.has(c)?(c.size=c.filters[this.filter]?.size,c.style.removeProperty("display"),c.requestUpdate()):(c.style.display="none",c.size=void 0)}),window.scrollTo(0,n),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(ir,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(Ce,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){te(this,Ae,{}),this.overrides?.split(",").forEach(r=>{let[n,i]=r?.split(":");n&&i&&(V(this,Ae)[n]=i)})}connectedCallback(){super.connectedCallback(),te(this,ft,On()),te(this,gt,V(this,ft).Log.module(ka)),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializeHeader(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r}initializePlaceholders(){let r=this.querySelectorAll("[placeholder]");if(r.length>0)r.forEach(n=>{let i=n.getAttribute("slot");me.placeholderKeys.includes(i)&&this.header?.append(n)});else{let n=this.data?.placeholders||{};for(let i of Object.keys(n)){let a=n[i],o=a.includes("<p>")?"div":"p",s=document.createElement(o);s.setAttribute("slot",i),s.innerHTML=a,me.placeholderKeys.includes(i)?this.header?.append(s):this.append(s)}}}attachSidenav(r,n=!0){r&&(n&&this.parentElement.insertBefore(r,this.parentElement.firstChild),this.sidenav=r,this.dispatchEvent(new CustomEvent(Le)))}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.hydrating=!0;let n;this.hydrationReady=new Promise(o=>{n=o});let i=this;function a(o,s){let l={cards:[],hierarchy:[],placeholders:o.placeholders};function c(h,d){for(let u of d){if(u.fieldName==="cards"){if(l.cards.findIndex(f=>f.id===u.identifier)!==-1)continue;l.cards.push(o.references[u.identifier].value);continue}let{fields:m}=o.references[u.identifier].value,p={label:m.label,icon:m.icon,iconLight:m.iconLight,navigationLabel:m.navigationLabel,cards:m.cards.map(f=>s[f]||f),collections:[]};h.push(p),c(p.collections,u.referencesTree)}}return c(l.hierarchy,o.referencesTree),l.hierarchy.length===0&&(i.filtered="all"),l}r.addEventListener(or,o=>{wn(this,qt,Ua).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(ar,async o=>{this.data=a(o.detail,V(this,Ae));let{cards:s,hierarchy:l}=this.data;r.cache.add(...s);for(let h of s){let m=function(f){for(let E of f){let _=E.cards.indexOf(u);if(_===-1)continue;let S=E.label.toLowerCase();d.filters[S]={order:_+1,size:h.fields.size},m(E.collections)}},d=document.createElement("merch-card"),u=V(this,Ae)[h.id]||h.id;d.setAttribute("consonant",""),d.setAttribute("style",""),m(l);let p=document.createElement("aem-fragment");p.setAttribute("fragment",u),d.append(p),Object.keys(d.filters).length===0&&(d.filters={all:{order:s.indexOf(h)+1,size:h.fields.size}}),this.append(d)}let c=s[0]?.fields.variant;c.startsWith("plans")&&(c="plans"),this.variant=c,this.classList.add("merch-card-collection",c,...yc[c]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),n()}),await this.hydrationReady}get footer(){if(!this.filtered)return vn`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return vn`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===K.authored?Ye({sort:void 0}):Ye({sort:r.target.value}),this.dispatchEvent(new CustomEvent(rr,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(nr,{bubbles:!0,composed:!0}));let r=this.page+1;Ye({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=Cn(({category:r,filter:n,types:i,sort:a,search:o,single_app:s,page:l})=>{n=n||r,!this.filtered&&n&&n!==this.filter&&setTimeout(()=>{Ye({page:void 0}),this.page=1},1),this.filtered||(this.filter=n??this.filter),this.types=i??"",this.search=o??"",this.singleApp=s,this.sort=a,this.page=Number(l)||1})}openFilters(r){this.sidenav?.showModal(r)}};Ae=new WeakMap,ft=new WeakMap,gt=new WeakMap,qt=new WeakSet,Ua=function(r,n={},i=!0){V(this,gt).error(`merch-card-collection: ${r}`,n),this.failed=!0,i&&this.dispatchEvent(new CustomEvent(sr,{detail:{...n,message:r},bubbles:!0,composed:!0}))},g(je,"properties",{displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:K.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(je,"styles",[Nn]);je.SortOrder=K;customElements.define(ka,je);export{je as MerchCardCollection};
