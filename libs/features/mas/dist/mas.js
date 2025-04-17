var bi=Object.defineProperty;var vi=e=>{throw TypeError(e)};var xc=(e,t,r)=>t in e?bi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var bc=(e,t)=>{for(var r in t)bi(e,r,{get:t[r],enumerable:!0})};var p=(e,t,r)=>xc(e,typeof t!="symbol"?t+"":t,r),An=(e,t,r)=>t.has(e)||vi("Cannot "+r);var b=(e,t,r)=>(An(e,t,"read from private field"),r?r.call(e):t.get(e)),R=(e,t,r)=>t.has(e)?vi("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),k=(e,t,r,n)=>(An(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),de=(e,t,r)=>(An(e,t,"access private method"),r);(function(){let r={clientId:"",endpoint:"https://www.adobe.com/lana/ll",endpointStage:"https://www.stage.adobe.com/lana/ll",errorType:"e",sampleRate:1,tags:"",implicitSampleRate:1,useProd:!0,isProdDomain:!1},n=window;function o(){let{host:h}=window.location;return h.substring(h.length-10)===".adobe.com"&&h.substring(h.length-15)!==".corp.adobe.com"&&h.substring(h.length-16)!==".stage.adobe.com"}function i(h,u){h||(h={}),u||(u={});function d(m){return h[m]!==void 0?h[m]:u[m]!==void 0?u[m]:r[m]}return Object.keys(r).reduce((m,x)=>(m[x]=d(x),m),{})}function s(h,u){h=h&&h.stack?h.stack:h||"",h.length>2e3&&(h=`${h.slice(0,2e3)}<trunc>`);let d=i(u,n.lana.options);if(!d.clientId){console.warn("LANA ClientID is not set in options.");return}let x=parseInt(new URL(window.location).searchParams.get("lana-sample"),10)||(d.errorType==="i"?d.implicitSampleRate:d.sampleRate);if(!n.lana.debug&&!n.lana.localhost&&x<=Math.random()*100)return;let f=o()||d.isProdDomain,C=!f||!d.useProd?d.endpointStage:d.endpoint,y=[`m=${encodeURIComponent(h)}`,`c=${encodeURI(d.clientId)}`,`s=${x}`,`t=${encodeURI(d.errorType)}`];if(d.tags&&y.push(`tags=${encodeURI(d.tags)}`),(!f||n.lana.debug||n.lana.localhost)&&console.log("LANA Msg: ",h,`
Opts:`,d),!n.lana.localhost||n.lana.debug){let E=new XMLHttpRequest;return n.lana.debug&&(y.push("d"),E.addEventListener("load",()=>{console.log("LANA response:",E.responseText)})),E.open("GET",`${C}?${y.join("&")}`),E.send(),E}}function a(h){s(h.reason||h.error||h.message,{errorType:"i"})}function c(){return n.location.search.toLowerCase().indexOf("lanadebug")!==-1}function l(){return n.location.host.toLowerCase().indexOf("localhost")!==-1}n.lana={debug:!1,log:s,options:i(n.lana&&n.lana.options)},c()&&(n.lana.debug=!0),l()&&(n.lana.localhost=!0),n.addEventListener("error",a),n.addEventListener("unhandledrejection",a)})();var Gn={};bc(Gn,{CLASS_NAME_FAILED:()=>Ln,CLASS_NAME_HIDDEN:()=>yc,CLASS_NAME_PENDING:()=>Rn,CLASS_NAME_RESOLVED:()=>kn,CheckoutWorkflow:()=>ie,CheckoutWorkflowStep:()=>V,Commitment:()=>Ue,ERROR_MESSAGE_BAD_REQUEST:()=>On,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Pc,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>$n,EVENT_AEM_ERROR:()=>ze,EVENT_AEM_LOAD:()=>Be,EVENT_MAS_ERROR:()=>Pn,EVENT_MAS_READY:()=>Cn,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>Sn,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>Tc,EVENT_MERCH_CARD_COLLECTION_SORT:()=>Sc,EVENT_MERCH_CARD_READY:()=>_n,EVENT_MERCH_OFFER_READY:()=>ct,EVENT_MERCH_OFFER_SELECT_READY:()=>zt,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>ue,EVENT_MERCH_SEARCH_CHANGE:()=>_c,EVENT_MERCH_SIDENAV_SELECT:()=>Cc,EVENT_MERCH_STOCK_CHANGE:()=>Ac,EVENT_MERCH_STORAGE_CHANGE:()=>wc,EVENT_OFFER_SELECTED:()=>Tn,EVENT_TYPE_FAILED:()=>Nn,EVENT_TYPE_READY:()=>wr,EVENT_TYPE_RESOLVED:()=>Mn,Env:()=>fe,HEADER_X_REQUEST_ID:()=>zn,LOG_NAMESPACE:()=>In,Landscape:()=>Te,MARK_DURATION_SUFFIX:()=>Ft,MARK_START_SUFFIX:()=>Ce,MODAL_TYPE_3_IN_1:()=>se,NAMESPACE:()=>vc,PARAM_AOS_API_KEY:()=>Lc,PARAM_ENV:()=>Hn,PARAM_LANDSCAPE:()=>Un,PARAM_WCS_API_KEY:()=>Rc,PROVIDER_ENVIRONMENT:()=>Fn,SELECTOR_MAS_CHECKOUT_LINK:()=>De,SELECTOR_MAS_ELEMENT:()=>Bt,SELECTOR_MAS_INLINE_PRICE:()=>_r,SELECTOR_MAS_SP_BUTTON:()=>wn,STATE_FAILED:()=>me,STATE_PENDING:()=>Se,STATE_RESOLVED:()=>pe,TAG_NAME_SERVICE:()=>Ec,Term:()=>te,WCS_PROD_URL:()=>Dn,WCS_STAGE_URL:()=>Bn});var Ue=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),te=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),vc="merch",yc="hidden",wr="wcms:commerce:ready",Ec="mas-commerce-service",_r='span[is="inline-price"][data-wcs-osi]',De='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',wn="sp-button[data-wcs-osi]",Bt=`${_r},${De}`,ct="merch-offer:ready",zt="merch-offer-select:ready",_n="merch-card:ready",Sn="merch-card:action-menu-toggle",Tn="merch-offer:selected",Ac="merch-stock:change",wc="merch-storage:change",ue="merch-quantity-selector:change",_c="merch-search:change",Sc="merch-card-collection:sort",Tc="merch-card-collection:showmore",Cc="merch-sidenav:select",Be="aem:load",ze="aem:error",Cn="mas:ready",Pn="mas:error",Ln="placeholder-failed",Rn="placeholder-pending",kn="placeholder-resolved",On="Bad WCS request",$n="Commerce offer not found",Pc="Literals URL not provided",Nn="mas:failed",Mn="mas:resolved",In="mas/commerce",Hn="commerce.env",Un="commerce.landscape",Lc="commerce.aosKey",Rc="commerce.wcsKey",Dn="https://www.adobe.com/web_commerce_artifact",Bn="https://www.stage.adobe.com/web_commerce_artifact_stage",me="failed",Se="pending",pe="resolved",Te={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},zn="X-Request-Id",V=Object.freeze({CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),ie=Object.freeze({V2:"UCv2",V3:"UCv3"}),fe=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),Fn={PRODUCTION:"PRODUCTION"},se={TWP:"twp",D2P:"d2p",CRM:"crm"},Ce=":start",Ft=":duration";var yi="tacocat.js";var Vn=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),Ei=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function I(e,t={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let i;if(n&&i==null){let s=new URLSearchParams(window.location.search),a=lt(n)?n:e;i=s.get(a)}if(o&&i==null){let s=lt(o)?o:e;i=window.sessionStorage.getItem(s)??window.localStorage.getItem(s)}if(r&&i==null){let s=Oc(lt(r)?r:e);i=document.documentElement.querySelector(`meta[name="${s}"]`)?.content}return i??t[e]}var kc=e=>typeof e=="boolean",Sr=e=>typeof e=="function",Tr=e=>typeof e=="number",Ai=e=>e!=null&&typeof e=="object";var lt=e=>typeof e=="string",wi=e=>lt(e)&&e,Gt=e=>Tr(e)&&Number.isFinite(e)&&e>0;function Vt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function T(e,t){if(kc(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function Fe(e,t,r){let n=Object.values(t);return n.find(o=>Vn(o,e))??r??n[0]}function Oc(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function _i(e,t=1){return Tr(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var $c=Date.now(),jn=()=>`(+${Date.now()-$c}ms)`,Cr=new Set,Nc=T(I("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function Si(e){let t=`[${yi}/${e}]`,r=(s,a,...c)=>s?!0:(o(a,...c),!1),n=Nc?(s,...a)=>{console.debug(`${t} ${s}`,...a,jn())}:()=>{},o=(s,...a)=>{let c=`${t} ${s}`;Cr.forEach(([l])=>l(c,...a))};return{assert:r,debug:n,error:o,warn:(s,...a)=>{let c=`${t} ${s}`;Cr.forEach(([,l])=>l(c,...a))}}}function Mc(e,t){let r=[e,t];return Cr.add(r),()=>{Cr.delete(r)}}Mc((e,...t)=>{console.error(e,...t,jn())},(e,...t)=>{console.warn(e,...t,jn())});var Ic="no promo",Ti="promo-tag",Hc="yellow",Uc="neutral",Dc=(e,t,r)=>{let n=i=>i||Ic,o=r?` (was "${n(t)}")`:"";return`${n(e)}${o}`},Bc="cancel-context",Pr=(e,t)=>{let r=e===Bc,n=!r&&e?.length>0,o=(n||r)&&(t&&t!=e||!t&&!r),i=o&&n||!o&&!!t,s=i?e||t:void 0;return{effectivePromoCode:s,overridenPromoCode:e,className:i?Ti:`${Ti} no-promo`,text:Dc(s,t,o),variant:i?Hc:Uc,isOverriden:o}};var qn;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(qn||(qn={}));var J;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(J||(J={}));var re;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(re||(re={}));var Wn;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Wn||(Wn={}));var Yn;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Yn||(Yn={}));var Xn;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Xn||(Xn={}));var Kn;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Kn||(Kn={}));var Zn="ABM",Qn="PUF",Jn="M2M",eo="PERPETUAL",to="P3Y",zc="TAX_INCLUSIVE_DETAILS",Fc="TAX_EXCLUSIVE",Ci={ABM:Zn,PUF:Qn,M2M:Jn,PERPETUAL:eo,P3Y:to},cd={[Zn]:{commitment:J.YEAR,term:re.MONTHLY},[Qn]:{commitment:J.YEAR,term:re.ANNUAL},[Jn]:{commitment:J.MONTH,term:re.MONTHLY},[eo]:{commitment:J.PERPETUAL,term:void 0},[to]:{commitment:J.THREE_MONTHS,term:re.P3Y}},Pi="Value is not an offer",Lr=e=>{if(typeof e!="object")return Pi;let{commitment:t,term:r}=e,n=Gc(t,r);return{...e,planType:n}};var Gc=(e,t)=>{switch(e){case void 0:return Pi;case"":return"";case J.YEAR:return t===re.MONTHLY?Zn:t===re.ANNUAL?Qn:"";case J.MONTH:return t===re.MONTHLY?Jn:"";case J.PERPETUAL:return eo;case J.TERM_LICENSE:return t===re.P3Y?to:"";default:return""}};function Li(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:i,taxDisplay:s}=t;if(s!==zc)return e;let a={...e,priceDetails:{...t,price:o??r,priceWithoutDiscount:i??n,taxDisplay:Fc}};return a.offerType==="TRIAL"&&a.priceDetails.price===0&&(a.priceDetails.price=a.priceDetails.priceWithoutDiscount),a}var Vc="mas-commerce-service";function jt(e,{country:t,forceTaxExclusive:r,perpetual:n}){let o;if(e.length<2)o=e;else{let i=t==="GB"||n?"EN":"MULT",[s,a]=e;o=[s.language===i?s:a]}return r&&(o=o.map(Li)),o}var Rr=e=>window.setTimeout(e);function ht(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(_i).filter(Gt);return r.length||(r=[t]),r}function kr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(wi)}function Y(){return document.getElementsByTagName(Vc)?.[0]}var Ge={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Ri=1e3;function jc(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function ki(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:o,status:i}=e;return[n,i,o].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Ge.serializableTypes.includes(r))return r}return e}function qc(e,t){if(!Ge.ignoredProperties.includes(e))return ki(t)}var ro={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,n=[],o=[],i=t;r.forEach(l=>{l!=null&&(jc(l)?n:o).push(l)}),n.length&&(i+=" "+n.map(ki).join(" "));let{pathname:s,search:a}=window.location,c=`${Ge.delimiter}page=${s}${a}`;c.length>Ri&&(c=`${c.slice(0,Ri)}<trunc>`),i+=c,o.length&&(i+=`${Ge.delimiter}facts=`,i+=JSON.stringify(o,qc)),window.lana?.log(i,Ge)}};function dt(e){Object.assign(Ge,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in Ge&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var Oi={LOCAL:"local",PROD:"prod",STAGE:"stage"},no={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},oo=new Set,io=new Set,$i=new Map,Ni={append({level:e,message:t,params:r,timestamp:n,source:o}){console[e](`${n}ms [${o}] %c${t}`,"font-weight: bold;",...r)}},Mi={filter:({level:e})=>e!==no.DEBUG},Wc={filter:()=>!1};function Yc(e,t,r,n,o){return{level:e,message:t,namespace:r,get params(){return n.length===1&&Sr(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:o,timestamp:performance.now().toFixed(3)}}function Xc(e){[...io].every(t=>t(e))&&oo.forEach(t=>t(e))}function Ii(e){let t=($i.get(e)??0)+1;$i.set(e,t);let r=`${e} #${t}`,n={id:r,namespace:e,module:o=>Ii(`${n.namespace}/${o}`),updateConfig:dt};return Object.values(no).forEach(o=>{n[o]=(i,...s)=>Xc(Yc(o,i,e,s,r))}),Object.seal(n)}function Or(...e){e.forEach(t=>{let{append:r,filter:n}=t;Sr(n)&&io.add(n),Sr(r)&&oo.add(r)})}function Kc(e={}){let{name:t}=e,r=T(I("commerce.debug",{search:!0,storage:!0}),t===Oi.LOCAL);return Or(r?Ni:Mi),t===Oi.PROD&&Or(ro),ee}function Zc(){oo.clear(),io.clear()}var ee={...Ii(In),Level:no,Plugins:{consoleAppender:Ni,debugFilter:Mi,quietFilter:Wc,lanaAppender:ro},init:Kc,reset:Zc,use:Or};var ge=class e extends Error{constructor(t,r,n){if(super(t,{cause:n}),this.name="MasError",r.response){let o=r.response.headers?.get(zn);o&&(r.requestId=o),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([n,o])=>`${n}: ${JSON.stringify(o)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var Qc={[me]:Ln,[Se]:Rn,[pe]:kn},Jc={[me]:Nn,[pe]:Mn},qt,ut=class{constructor(t){R(this,qt);p(this,"changes",new Map);p(this,"connected",!1);p(this,"error");p(this,"log");p(this,"options");p(this,"promises",[]);p(this,"state",Se);p(this,"timer",null);p(this,"value");p(this,"version",0);p(this,"wrapperElement");this.wrapperElement=t,this.log=ee.module("mas-element")}update(){[me,Se,pe].forEach(t=>{this.wrapperElement.classList.toggle(Qc[t],t===this.state)})}notify(){(this.state===pe||this.state===me)&&(this.state===pe?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===me&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof ge&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(Jc[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){k(this,qt,Y()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:n}=this;return pe===n?Promise.resolve(this.wrapperElement):me===n?Promise.reject(t):new Promise((o,i)=>{r.push({resolve:o,reject:i})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=pe,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Rr(()=>this.notify()),!0)}toggleFailed(t,r,n){if(t!==this.version)return!1;n!==void 0&&(this.options=n),this.error=r,this.state=me,this.update();let o=this.wrapperElement.getAttribute("is");return this.log?.error(`${o}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...b(this,qt)?.duration}),Rr(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=Se,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!Y()||this.timer)return;let{error:r,options:n,state:o,value:i,version:s}=this;this.state=Se,this.timer=Rr(async()=>{this.timer=null;let a=null;if(this.changes.size&&(a=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:a}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:a})),a||t)try{await this.wrapperElement.render?.()===!1&&this.state===Se&&this.version===s&&(this.state=o,this.error=r,this.value=i,this.update(),this.notify())}catch(c){this.toggleFailed(this.version,c,n)}})}};qt=new WeakMap;function Hi(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function $r(e,t={}){let{tag:r,is:n}=e,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,Hi(t)),o}function Nr(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Hi(t)),e):null}var Ui="download",Di="upgrade";function Mr(e,t={},r=""){let n=Y();if(!n)return null;let{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:a,upgrade:c,modal:l,perpetual:h,promotionCode:u,quantity:d,wcsOsi:m,extraOptions:x}=n.collectCheckoutOptions(t),f=$r(e,{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:a,upgrade:c,modal:l,perpetual:h,promotionCode:u,quantity:d,wcsOsi:m,extraOptions:x});return r&&(f.innerHTML=`<span style="pointer-events: none;">${r}</span>`),f}function Ir(e){return class extends e{constructor(){super(...arguments);p(this,"checkoutActionHandler");p(this,"masElement",new ut(this))}attributeChangedCallback(n,o,i){this.masElement.attributeChangedCallback(n,o,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isOpen3in1Modal(){let n=document.querySelector("meta[name=mas-ff-3in1]");return Object.values(se).includes(this.getAttribute("data-modal"))&&(!n||n.content!=="off")}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){let o=Y();if(!o)return!1;this.dataset.imsCountry||o.imsCountryPromise.then(u=>{u&&(this.dataset.imsCountry=u)}),n.imsCountry=null;let i=o.collectCheckoutOptions(n,this);if(!i.wcsOsi.length)return!1;let s;try{s=JSON.parse(i.extraOptions??"{}")}catch(u){this.masElement.log?.error("cannot parse exta checkout options",u)}let a=this.masElement.togglePending(i);this.setCheckoutUrl("");let c=o.resolveOfferSelectors(i),l=await Promise.all(c);l=l.map(u=>jt(u,i)),i.country=this.dataset.imsCountry||i.country;let h=await o.buildCheckoutAction?.(l.flat(),{...s,...i},this);return this.renderOffers(l.flat(),i,{},h,a)}renderOffers(n,o,i={},s=void 0,a=void 0){let c=Y();if(!c)return!1;if(o={...JSON.parse(this.dataset.extraOptions??"null"),...o,...i},a??(a=this.masElement.togglePending(o)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),s){this.classList.remove(Ui,Di),this.masElement.toggleResolved(a,n,o);let{url:h,text:u,className:d,handler:m}=s;h&&this.setCheckoutUrl(h),u&&(this.firstElementChild.innerHTML=u),d&&this.classList.add(...d.split(" ")),m&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=m.bind(this))}if(n.length){if(this.masElement.toggleResolved(a,n,o)){if(!this.classList.contains(Ui)&&!this.classList.contains(Di)){let h=c.buildCheckoutURL(n,o);this.setCheckoutUrl(o.modal==="true"?"#":h)}return!0}}else{let h=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(a,h,o))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let o=Y();if(!o)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:a,entitlement:c,upgrade:l,modal:h,perpetual:u,promotionCode:d,quantity:m,wcsOsi:x}=o.collectCheckoutOptions(n);return Nr(this,{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:a,entitlement:c,upgrade:l,modal:h,perpetual:u,promotionCode:d,quantity:m,wcsOsi:x}),!0}}}var Wt=class Wt extends Ir(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return Mr(Wt,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};p(Wt,"is","checkout-link"),p(Wt,"tag","a");var xe=Wt;window.customElements.get(xe.is)||window.customElements.define(xe.is,xe,{extends:xe.tag});var el="p_draft_landscape",tl="/store/",rl=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]),so=new Set(["af","ai","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),nl=["env","workflowStep","clientId","country"],Bi=e=>rl.get(e)??e;function ao(e,t,r){for(let[n,o]of Object.entries(e)){let i=Bi(n);o!=null&&r.has(i)&&t.set(i,o)}}function ol(e){switch(e){case Fn.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function il(e,t){for(let r in e){let n=e[r];for(let[o,i]of Object.entries(n)){if(i==null)continue;let s=Bi(o);t.set(`items[${r}][${s}]`,i)}}}function sl(e,t,r,n){return!Object.values(se).includes(t)||!e?.searchParams||!r||!n||(e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl"),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===se.CRM?"creative":"mini_plans"),t===se.CRM?e.searchParams.set("af","uc_segmentation_hide_tabs,uc_new_user_iframe,uc_new_system_close"):(t===se.TWP||t===se.D2P)&&(e.searchParams.set("af","uc_new_user_iframe,uc_new_system_close"),r==="INDIVIDUAL"&&n==="EDU"&&e.searchParams.set("ms","e"),r==="TEAM"&&n==="COM"&&e.searchParams.set("cs","t"))),e}function zi(e){al(e);let{env:t,items:r,workflowStep:n,ms:o,marketSegment:i,customerSegment:s,ot:a,offerType:c,pa:l,productArrangementCode:h,landscape:u,modal:d,...m}=e,x={marketSegment:i??o,offerType:c??a,productArrangementCode:h??l},f=new URL(ol(t));return f.pathname=`${tl}${n}`,n!==V.SEGMENTATION&&n!==V.CHANGE_PLAN_TEAM_PLANS&&il(r,f.searchParams),n===V.SEGMENTATION&&ao(x,f.searchParams,so),ao(m,f.searchParams,so),u===Te.DRAFT&&ao({af:el},f.searchParams,so),f=sl(f,d,s,i),f.toString()}function al(e){for(let t of nl)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==V.SEGMENTATION&&e.workflowStep!==V.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var P=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:ie.V3,checkoutWorkflowStep:V.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:fe.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Te.PUBLISHED});function Fi({providers:e,settings:t}){function r(i,s){let{checkoutClientId:a,checkoutWorkflow:c,checkoutWorkflowStep:l,country:h,language:u,promotionCode:d,quantity:m}=t,{checkoutMarketSegment:x,checkoutWorkflow:f=c,checkoutWorkflowStep:C=l,imsCountry:y,country:E=y??h,language:S=u,quantity:L=m,entitlement:M,upgrade:H,modal:j,perpetual:W,promotionCode:oe=d,wcsOsi:D,extraOptions:Q,...ae}=Object.assign({},s?.dataset??{},i??{}),we=Fe(f,ie,P.checkoutWorkflow),he=V.CHECKOUT;we===ie.V3&&(he=Fe(C,V,P.checkoutWorkflowStep));let He=Vt({...ae,extraOptions:Q,checkoutClientId:a,checkoutMarketSegment:x,country:E,quantity:ht(L,P.quantity),checkoutWorkflow:we,checkoutWorkflowStep:he,language:S,entitlement:T(M),upgrade:T(H),modal:j,perpetual:T(W),promotionCode:Pr(oe).effectivePromoCode,wcsOsi:kr(D)});if(s)for(let _e of e.checkout)_e(s,He);return He}function n(i,s){if(!Array.isArray(i)||!i.length||!s)return"";let{env:a,landscape:c}=t,{checkoutClientId:l,checkoutMarketSegment:h,checkoutWorkflow:u,checkoutWorkflowStep:d,country:m,promotionCode:x,quantity:f,...C}=r(s),y=window.frameElement||Object.values(se).includes(s.modal)?"if":"fp",E={checkoutPromoCode:x,clientId:l,context:y,country:m,env:a,items:[],marketSegment:h,workflowStep:d,landscape:c,...C};if(i.length===1){let[{offerId:S,offerType:L,productArrangementCode:M}]=i,{marketSegments:[H],customerSegment:j}=i[0];Object.assign(E,{marketSegment:H,customerSegment:j,offerType:L,productArrangementCode:M}),E.items.push(f[0]===1?{id:S}:{id:S,quantity:f[0]})}else E.items.push(...i.map(({offerId:S},L)=>({id:S,quantity:f[L]??P.quantity})));return zi(E)}let{createCheckoutLink:o}=xe;return{CheckoutLink:xe,CheckoutWorkflow:ie,CheckoutWorkflowStep:V,buildCheckoutURL:n,collectCheckoutOptions:r,createCheckoutLink:o}}function cl({interval:e=200,maxAttempts:t=25}={}){let r=ee.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let o=0;function i(){window.adobeIMS?.initialized?n():++o>t?(r.debug("Timeout"),n()):setTimeout(i,e)}i()})}function ll(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function hl(e){let t=ee.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function Gi({}){let e=cl(),t=ll(e),r=hl(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var Vi=window.masPriceLiterals;function ji(e){if(Array.isArray(Vi)){let t=n=>Vi.find(o=>Vn(o.lang,n)),r=t(e.language)??t(P.language);if(r)return Object.freeze(r)}return{}}var co=function(e,t){return co=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},co(e,t)};function Yt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");co(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var w=function(){return w=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},w.apply(this,arguments)};function Hr(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,i;n<o;n++)(i||!(n in t))&&(i||(i=Array.prototype.slice.call(t,0,n)),i[n]=t[n]);return e.concat(i||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var O;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(O||(O={}));var Ve;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Ve||(Ve={}));function lo(e){return e.type===O.literal}function qi(e){return e.type===O.argument}function Ur(e){return e.type===O.number}function Dr(e){return e.type===O.date}function Br(e){return e.type===O.time}function zr(e){return e.type===O.select}function Fr(e){return e.type===O.plural}function Wi(e){return e.type===O.pound}function Gr(e){return e.type===O.tag}function Vr(e){return!!(e&&typeof e=="object"&&e.type===Ve.number)}function Xt(e){return!!(e&&typeof e=="object"&&e.type===Ve.dateTime)}var ho=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var dl=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Yi(e){var t={};return e.replace(dl,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Xi=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Ji(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Xi).filter(function(d){return d.length>0}),r=[],n=0,o=t;n<o.length;n++){var i=o[n],s=i.split("/");if(s.length===0)throw new Error("Invalid number skeleton");for(var a=s[0],c=s.slice(1),l=0,h=c;l<h.length;l++){var u=h[l];if(u.length===0)throw new Error("Invalid number skeleton")}r.push({stem:a,options:c})}return r}function ul(e){return e.replace(/^(.*?)-/,"")}var Ki=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,es=/^(@+)?(\+|#+)?[rs]?$/g,ml=/(\*)(0+)|(#+)(0+)|(0+)/g,ts=/^(0+)$/;function Zi(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(es,function(r,n,o){return typeof o!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):o==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),t}function rs(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function pl(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!ts.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Qi(e){var t={},r=rs(e);return r||t}function ns(e){for(var t={},r=0,n=e;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=o.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=ul(o.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=w(w(w({},t),{notation:"scientific"}),o.options.reduce(function(c,l){return w(w({},c),Qi(l))},{}));continue;case"engineering":t=w(w(w({},t),{notation:"engineering"}),o.options.reduce(function(c,l){return w(w({},c),Qi(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace(ml,function(c,l,h,u,d,m){if(l)t.minimumIntegerDigits=h.length;else{if(u&&d)throw new Error("We currently do not support maximum integer digits");if(m)throw new Error("We currently do not support exact integer digits")}return""});continue}if(ts.test(o.stem)){t.minimumIntegerDigits=o.stem.length;continue}if(Ki.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(Ki,function(c,l,h,u,d,m){return h==="*"?t.minimumFractionDigits=l.length:u&&u[0]==="#"?t.maximumFractionDigits=u.length:d&&m?(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length+m.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var i=o.options[0];i==="w"?t=w(w({},t),{trailingZeroDisplay:"stripIfInteger"}):i&&(t=w(w({},t),Zi(i)));continue}if(es.test(o.stem)){t=w(w({},t),Zi(o.stem));continue}var s=rs(o.stem);s&&(t=w(w({},t),s));var a=pl(o.stem);a&&(t=w(w({},t),a))}return t}var Kt={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function os(e,t){for(var r="",n=0;n<e.length;n++){var o=e.charAt(n);if(o==="j"){for(var i=0;n+1<e.length&&e.charAt(n+1)===o;)i++,n++;var s=1+(i&1),a=i<2?1:3+(i>>1),c="a",l=fl(t);for((l=="H"||l=="k")&&(a=0);a-- >0;)r+=c;for(;s-- >0;)r=l+r}else o==="J"?r+="H":r+=o}return r}function fl(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,n;r!=="root"&&(n=e.maximize().region);var o=Kt[n||""]||Kt[r||""]||Kt["".concat(r,"-001")]||Kt["001"];return o[0]}var uo,gl=new RegExp("^".concat(ho.source,"*")),xl=new RegExp("".concat(ho.source,"*$"));function _(e,t){return{start:e,end:t}}var bl=!!String.prototype.startsWith,vl=!!String.fromCodePoint,yl=!!Object.fromEntries,El=!!String.prototype.codePointAt,Al=!!String.prototype.trimStart,wl=!!String.prototype.trimEnd,_l=!!Number.isSafeInteger,Sl=_l?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},po=!0;try{is=ls("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),po=((uo=is.exec("a"))===null||uo===void 0?void 0:uo[0])==="a"}catch{po=!1}var is,ss=bl?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},fo=vl?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",o=t.length,i=0,s;o>i;){if(s=t[i++],s>1114111)throw RangeError(s+" is not a valid code point");n+=s<65536?String.fromCharCode(s):String.fromCharCode(((s-=65536)>>10)+55296,s%1024+56320)}return n},as=yl?Object.fromEntries:function(t){for(var r={},n=0,o=t;n<o.length;n++){var i=o[n],s=i[0],a=i[1];r[s]=a}return r},cs=El?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var o=t.charCodeAt(r),i;return o<55296||o>56319||r+1===n||(i=t.charCodeAt(r+1))<56320||i>57343?o:(o-55296<<10)+(i-56320)+65536}},Tl=Al?function(t){return t.trimStart()}:function(t){return t.replace(gl,"")},Cl=wl?function(t){return t.trimEnd()}:function(t){return t.replace(xl,"")};function ls(e,t){return new RegExp(e,t)}var go;po?(mo=ls("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),go=function(t,r){var n;mo.lastIndex=r;var o=mo.exec(t);return(n=o[1])!==null&&n!==void 0?n:""}):go=function(t,r){for(var n=[];;){var o=cs(t,r);if(o===void 0||ds(o)||Rl(o))break;n.push(o),r+=o>=65536?2:1}return fo.apply(void 0,n)};var mo,hs=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var o=[];!this.isEOF();){var i=this.char();if(i===123){var s=this.parseArgument(t,n);if(s.err)return s;o.push(s.val)}else{if(i===125&&t>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var a=this.clonePosition();this.bump(),o.push({type:O.pound,location:_(a,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(v.UNMATCHED_CLOSING_TAG,_(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&xo(this.peek()||0)){var s=this.parseTag(t,r);if(s.err)return s;o.push(s.val)}else{var s=this.parseLiteral(t,r);if(s.err)return s;o.push(s.val)}}}return{val:o,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:O.literal,value:"<".concat(o,"/>"),location:_(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(t+1,r,!0);if(i.err)return i;var s=i.val,a=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!xo(this.char()))return this.error(v.INVALID_TAG,_(a,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return o!==l?this.error(v.UNMATCHED_CLOSING_TAG,_(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:O.tag,value:o,children:s,location:_(n,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,_(a,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,_(n,this.clonePosition()))}else return this.error(v.INVALID_TAG,_(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Ll(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),o="";;){var i=this.tryParseQuote(r);if(i){o+=i;continue}var s=this.tryParseUnquoted(t,r);if(s){o+=s;continue}var a=this.tryParseLeftAngleBracket();if(a){o+=a;continue}break}var c=_(n,this.clonePosition());return{val:{type:O.literal,value:o,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Pl(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return fo.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),fo(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,_(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,_(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(v.MALFORMED_ARGUMENT,_(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,_(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:O.argument,value:o,location:_(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,_(n,this.clonePosition())):this.parseArgumentOptions(t,r,o,n);default:return this.error(v.MALFORMED_ARGUMENT,_(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=go(this.message,r),o=r+n.length;this.bumpTo(o);var i=this.clonePosition(),s=_(t,i);return{value:n,location:s}},e.prototype.parseArgumentOptions=function(t,r,n,o){var i,s=this.clonePosition(),a=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(a){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,_(s,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),u=this.parseSimpleArgStyleIfPossible();if(u.err)return u;var d=Cl(u.val);if(d.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,_(this.clonePosition(),this.clonePosition()));var m=_(h,this.clonePosition());l={style:d,styleLocation:m}}var x=this.tryParseArgumentClose(o);if(x.err)return x;var f=_(o,this.clonePosition());if(l&&ss(l?.style,"::",0)){var C=Tl(l.style.slice(2));if(a==="number"){var u=this.parseNumberSkeletonFromString(C,l.styleLocation);return u.err?u:{val:{type:O.number,value:n,location:f,style:u.val},err:null}}else{if(C.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,f);var y=C;this.locale&&(y=os(C,this.locale));var d={type:Ve.dateTime,pattern:y,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?Yi(y):{}},E=a==="date"?O.date:O.time;return{val:{type:E,value:n,location:f,style:d},err:null}}}return{val:{type:a==="number"?O.number:a==="date"?O.date:O.time,value:n,location:f,style:(i=l?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var S=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,_(S,w({},S)));this.bumpSpace();var L=this.parseIdentifierIfPossible(),M=0;if(a!=="select"&&L.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,_(this.clonePosition(),this.clonePosition()));this.bumpSpace();var u=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(u.err)return u;this.bumpSpace(),L=this.parseIdentifierIfPossible(),M=u.val}var H=this.tryParsePluralOrSelectOptions(t,a,r,L);if(H.err)return H;var x=this.tryParseArgumentClose(o);if(x.err)return x;var j=_(o,this.clonePosition());return a==="select"?{val:{type:O.select,value:n,options:as(H.val),location:j},err:null}:{val:{type:O.plural,value:n,options:as(H.val),offset:M,pluralType:a==="plural"?"cardinal":"ordinal",location:j},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,_(s,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,_(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,_(o,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=Ji(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:Ve.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?ns(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,o){for(var i,s=!1,a=[],c=new Set,l=o.value,h=o.location;;){if(l.length===0){var u=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var d=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(d.err)return d;h=_(u,this.clonePosition()),l=this.message.slice(u.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);l==="other"&&(s=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,_(this.clonePosition(),this.clonePosition()));var x=this.parseMessage(t+1,r,n);if(x.err)return x;var f=this.tryParseArgumentClose(m);if(f.err)return f;a.push([l,{value:x.val,location:_(m,this.clonePosition())}]),c.add(l),this.bumpSpace(),i=this.parseIdentifierIfPossible(),l=i.value,h=i.location}return a.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,_(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!s?this.error(v.MISSING_OTHER_CLAUSE,_(this.clonePosition(),this.clonePosition())):{val:a,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var i=!1,s=0;!this.isEOF();){var a=this.char();if(a>=48&&a<=57)i=!0,s=s*10+(a-48),this.bump();else break}var c=_(o,this.clonePosition());return i?(s*=n,Sl(s)?{val:s,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=cs(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(ss(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&ds(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function xo(e){return e>=97&&e<=122||e>=65&&e<=90}function Pl(e){return xo(e)||e===47}function Ll(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function ds(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Rl(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function bo(e){e.forEach(function(t){if(delete t.location,zr(t)||Fr(t))for(var r in t.options)delete t.options[r].location,bo(t.options[r].value);else Ur(t)&&Vr(t.style)||(Dr(t)||Br(t))&&Xt(t.style)?delete t.style.location:Gr(t)&&bo(t.children)})}function us(e,t){t===void 0&&(t={}),t=w({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new hs(e,t).parse();if(r.err){var n=SyntaxError(v[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||bo(r.val),r.val}function Zt(e,t){var r=t&&t.cache?t.cache:Il,n=t&&t.serializer?t.serializer:Ml,o=t&&t.strategy?t.strategy:Ol;return o(e,{cache:r,serializer:n})}function kl(e){return e==null||typeof e=="number"||typeof e=="boolean"}function ms(e,t,r,n){var o=kl(n)?n:r(n),i=t.get(o);return typeof i>"u"&&(i=e.call(this,n),t.set(o,i)),i}function ps(e,t,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),i=t.get(o);return typeof i>"u"&&(i=e.apply(this,n),t.set(o,i)),i}function vo(e,t,r,n,o){return r.bind(t,e,n,o)}function Ol(e,t){var r=e.length===1?ms:ps;return vo(e,this,r,t.cache.create(),t.serializer)}function $l(e,t){return vo(e,this,ps,t.cache.create(),t.serializer)}function Nl(e,t){return vo(e,this,ms,t.cache.create(),t.serializer)}var Ml=function(){return JSON.stringify(arguments)};function yo(){this.cache=Object.create(null)}yo.prototype.get=function(e){return this.cache[e]};yo.prototype.set=function(e,t){this.cache[e]=t};var Il={create:function(){return new yo}},jr={variadic:$l,monadic:Nl};var je;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(je||(je={}));var Qt=function(e){Yt(t,e);function t(r,n,o){var i=e.call(this,r)||this;return i.code=n,i.originalMessage=o,i}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var Eo=function(e){Yt(t,e);function t(r,n,o,i){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(n,'". Options are "').concat(Object.keys(o).join('", "'),'"'),je.INVALID_VALUE,i)||this}return t}(Qt);var fs=function(e){Yt(t,e);function t(r,n,o){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(n),je.INVALID_VALUE,o)||this}return t}(Qt);var gs=function(e){Yt(t,e);function t(r,n){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(n,'"'),je.MISSING_VALUE,n)||this}return t}(Qt);var q;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(q||(q={}));function Hl(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==q.literal||r.type!==q.literal?t.push(r):n.value+=r.value,t},[])}function Ul(e){return typeof e=="function"}function Jt(e,t,r,n,o,i,s){if(e.length===1&&lo(e[0]))return[{type:q.literal,value:e[0].value}];for(var a=[],c=0,l=e;c<l.length;c++){var h=l[c];if(lo(h)){a.push({type:q.literal,value:h.value});continue}if(Wi(h)){typeof i=="number"&&a.push({type:q.literal,value:r.getNumberFormat(t).format(i)});continue}var u=h.value;if(!(o&&u in o))throw new gs(u,s);var d=o[u];if(qi(h)){(!d||typeof d=="string"||typeof d=="number")&&(d=typeof d=="string"||typeof d=="number"?String(d):""),a.push({type:typeof d=="string"?q.literal:q.object,value:d});continue}if(Dr(h)){var m=typeof h.style=="string"?n.date[h.style]:Xt(h.style)?h.style.parsedOptions:void 0;a.push({type:q.literal,value:r.getDateTimeFormat(t,m).format(d)});continue}if(Br(h)){var m=typeof h.style=="string"?n.time[h.style]:Xt(h.style)?h.style.parsedOptions:n.time.medium;a.push({type:q.literal,value:r.getDateTimeFormat(t,m).format(d)});continue}if(Ur(h)){var m=typeof h.style=="string"?n.number[h.style]:Vr(h.style)?h.style.parsedOptions:void 0;m&&m.scale&&(d=d*(m.scale||1)),a.push({type:q.literal,value:r.getNumberFormat(t,m).format(d)});continue}if(Gr(h)){var x=h.children,f=h.value,C=o[f];if(!Ul(C))throw new fs(f,"function",s);var y=Jt(x,t,r,n,o,i),E=C(y.map(function(M){return M.value}));Array.isArray(E)||(E=[E]),a.push.apply(a,E.map(function(M){return{type:typeof M=="string"?q.literal:q.object,value:M}}))}if(zr(h)){var S=h.options[d]||h.options.other;if(!S)throw new Eo(h.value,d,Object.keys(h.options),s);a.push.apply(a,Jt(S.value,t,r,n,o));continue}if(Fr(h)){var S=h.options["=".concat(d)];if(!S){if(!Intl.PluralRules)throw new Qt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,je.MISSING_INTL_API,s);var L=r.getPluralRules(t,{type:h.pluralType}).select(d-(h.offset||0));S=h.options[L]||h.options.other}if(!S)throw new Eo(h.value,d,Object.keys(h.options),s);a.push.apply(a,Jt(S.value,t,r,n,o,d-(h.offset||0)));continue}}return Hl(a)}function Dl(e,t){return t?w(w(w({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=w(w({},e[n]),t[n]||{}),r},{})):e}function Bl(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=Dl(e[n],t[n]),r},w({},e)):e}function Ao(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function zl(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Zt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,Hr([void 0],r,!1)))},{cache:Ao(e.number),strategy:jr.variadic}),getDateTimeFormat:Zt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,Hr([void 0],r,!1)))},{cache:Ao(e.dateTime),strategy:jr.variadic}),getPluralRules:Zt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,Hr([void 0],r,!1)))},{cache:Ao(e.pluralRules),strategy:jr.variadic})}}var xs=function(){function e(t,r,n,o){var i=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(s){var a=i.formatToParts(s);if(a.length===1)return a[0].value;var c=a.reduce(function(l,h){return!l.length||h.type!==q.literal||typeof l[l.length-1]!="string"?l.push(h.value):l[l.length-1]+=h.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(s){return Jt(i.ast,i.locales,i.formatters,i.formats,s,void 0,i.message)},this.resolvedOptions=function(){return{locale:i.resolvedLocale.toString()}},this.getAst=function(){return i.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:o?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Bl(e.formats,n),this.formatters=o&&o.formatters||zl(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=us,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var bs=xs;var Fl=/[0-9\-+#]/,Gl=/[^\d\-+#]/g;function vs(e){return e.search(Fl)}function Vl(e="#.##"){let t={},r=e.length,n=vs(e);t.prefix=n>0?e.substring(0,n):"";let o=vs(e.split("").reverse().join("")),i=r-o,s=e.substring(i,i+1),a=i+(s==="."||s===","?1:0);t.suffix=o>0?e.substring(a,r):"",t.mask=e.substring(n,a),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(Gl);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function jl(e,t,r){let n=!1,o={value:e};e<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(t.fraction&&t.fraction.length),o.value=Number(o.value).toString();let i=t.fraction&&t.fraction.lastIndexOf("0"),[s="0",a=""]=o.value.split(".");return(!a||a&&a.length<=i)&&(a=i<0?"":(+("0."+a)).toFixed(i+1).replace("0.","")),o.integer=s,o.fraction=a,ql(o,t),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&t.maskHasPositiveSign?o.sign="+":n&&t.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),o}function ql(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;e.integer.length<n.length-o;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let i=r[1]&&r[r.length-1].length;if(i){let s=e.integer.length,a=s%i;for(let c=0;c<s;c++)e.result+=e.integer.charAt(c),!((c-a+1)%i)&&c<s-i&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Wl(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Vl(e),o=jl(t,n,r);return n.prefix+o.sign+o.result+n.suffix}var ys=Wl;var Es=".",Yl=",",ws=/^\s+/,_s=/\s+$/,As="&nbsp;",wo=e=>e*12,Ss=(e,t)=>{let{start:r,end:n,displaySummary:{amount:o,duration:i,minProductQuantity:s,outcomeType:a}={}}=e;if(!(o&&i&&a&&s))return!1;let c=t?new Date(t):new Date;if(!r||!n)return!1;let l=new Date(r),h=new Date(n);return c>=l&&c<=h},qe={MONTH:"MONTH",YEAR:"YEAR"},Xl={[te.ANNUAL]:12,[te.MONTHLY]:1,[te.THREE_YEARS]:36,[te.TWO_YEARS]:24},_o=(e,t)=>({accept:e,round:t}),Kl=[_o(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),_o(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),_o(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],So={[Ue.YEAR]:{[te.MONTHLY]:qe.MONTH,[te.ANNUAL]:qe.YEAR},[Ue.MONTH]:{[te.MONTHLY]:qe.MONTH}},Zl=(e,t)=>e.indexOf(`'${t}'`)===0,Ql=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=Cs(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+eh(e)),r},Jl=e=>{let t=th(e),r=Zl(e,t),n=e.replace(/'.*?'/,""),o=ws.test(n)||_s.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:o}},Ts=e=>e.replace(ws,As).replace(_s,As),eh=e=>e.match(/#(.?)#/)?.[1]===Es?Yl:Es,th=e=>e.match(/'(.*?)'/)?.[1]??"",Cs=e=>e.match(/0(.?)0/)?.[1]??"";function mt({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},o,i=s=>s){let{currencySymbol:s,isCurrencyFirst:a,hasCurrencySpace:c}=Jl(e),l=r?Cs(e):"",h=Ql(e,r),u=r?2:0,d=i(t,{currencySymbol:s}),m=n?d.toLocaleString("hi-IN",{minimumFractionDigits:u,maximumFractionDigits:u}):ys(h,d),x=r?m.lastIndexOf(l):m.length,f=m.substring(0,x),C=m.substring(x+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,s),currencySymbol:s,decimals:C,decimalsDelimiter:l,hasCurrencySpace:c,integer:f,isCurrencyFirst:a,recurrenceTerm:o}}var Ps=e=>{let{commitment:t,term:r,usePrecision:n}=e,o=Xl[r]??1;return mt(e,o>1?qe.MONTH:So[t]?.[r],i=>{let s={divisor:o,price:i,usePrecision:n},{round:a}=Kl.find(({accept:c})=>c(s));if(!a)throw new Error(`Missing rounding rule for: ${JSON.stringify(s)}`);return a(s)})},Ls=({commitment:e,term:t,...r})=>mt(r,So[e]?.[t]),Rs=e=>{let{commitment:t,instant:r,price:n,originalPrice:o,priceWithoutDiscount:i,promotion:s,quantity:a=1,term:c}=e;if(t===Ue.YEAR&&c===te.MONTHLY){if(!s)return mt(e,qe.YEAR,wo);let{displaySummary:{outcomeType:l,duration:h,minProductQuantity:u=1}={}}=s;switch(l){case"PERCENTAGE_DISCOUNT":if(a>=u&&Ss(s,r)){let d=parseInt(h.replace("P","").replace("M",""));if(isNaN(d))return wo(n);let m=a*o*d,x=a*i*(12-d),f=Math.floor((m+x)*100)/100;return mt({...e,price:f},qe.YEAR)}default:return mt(e,qe.YEAR,()=>wo(i??n))}}return mt(e,So[t]?.[c])};var rh={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at"},nh=Si("ConsonantTemplates/price"),oh=/<\/?[^>]+(>|$)/g,B={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},pt={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},ih="TAX_EXCLUSIVE",sh=e=>Ai(e)?Object.entries(e).filter(([,t])=>lt(t)||Tr(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+Ei(n)+'"'}`,""):"",K=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+B.disabled}"${sh(r)}>${n?Ts(t):t??""}</span>`;function ah(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:n,decimals:o,decimalsDelimiter:i,hasCurrencySpace:s,integer:a,isCurrencyFirst:c,recurrenceLabel:l,perUnitLabel:h,taxInclusivityLabel:u},d={}){let m=K(B.currencySymbol,n),x=K(B.currencySpace,s?"&nbsp;":""),f="";return t?f=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),c&&(f+=m+x),f+=K(B.integer,a),f+=K(B.decimalsDelimiter,i),f+=K(B.decimals,o),c||(f+=x+m),f+=K(B.recurrence,l,null,!0),f+=K(B.unitType,h,null,!0),f+=K(B.taxInclusivity,u,!0),K(e,f,{...d})}var Z=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:n=!1,instant:o=void 0}={})=>({country:i,displayFormatted:s=!0,displayRecurrence:a=!0,displayPerUnit:c=!1,displayTax:l=!1,language:h,literals:u={},quantity:d=1}={},{commitment:m,offerSelectorIds:x,formatString:f,price:C,priceWithoutDiscount:y,taxDisplay:E,taxTerm:S,term:L,usePrecision:M,promotion:H}={},j={})=>{Object.entries({country:i,formatString:f,language:h,price:C}).forEach(([vn,yn])=>{if(yn==null)throw new Error(`Argument "${vn}" is missing for osi ${x?.toString()}, country ${i}, language ${h}`)});let W={...rh,...u},oe=`${h.toLowerCase()}-${i.toUpperCase()}`;function D(vn,yn){let En=W[vn];if(En==null)return"";try{return new bs(En.replace(oh,""),oe).format(yn)}catch{return nh.error("Failed to format literal:",En),""}}let Q=r&&y?y:C,ae=t?Ps:Ls;n&&(ae=Rs);let{accessiblePrice:we,recurrenceTerm:he,...He}=ae({commitment:m,formatString:f,instant:o,isIndianPrice:i==="IN",originalPrice:C,priceWithoutDiscount:y,price:t?C:Q,promotion:H,quantity:d,term:L,usePrecision:M}),_e="",Dt="",gn="";T(a)&&he&&(gn=D(pt.recurrenceLabel,{recurrenceTerm:he}));let xn="";T(c)&&(xn=D(pt.perUnitLabel,{perUnit:"LICENSE"}));let bn="";T(l)&&S&&(bn=D(E===ih?pt.taxExclusiveLabel:pt.taxInclusiveLabel,{taxTerm:S})),r&&(_e=D(pt.strikethroughAriaLabel,{strikethroughPrice:_e})),e&&(Dt=D(pt.alternativePriceAriaLabel,{alternativePrice:Dt}));let st=B.container;if(t&&(st+=" "+B.containerOptical),r&&(st+=" "+B.containerStrikethrough),e&&(st+=" "+B.containerAlternative),n&&(st+=" "+B.containerAnnual),T(s))return ah(st,{...He,accessibleLabel:_e,altAccessibleLabel:Dt,recurrenceLabel:gn,perUnitLabel:xn,taxInclusivityLabel:bn},j);let{currencySymbol:gi,decimals:uc,decimalsDelimiter:mc,hasCurrencySpace:xi,integer:pc,isCurrencyFirst:fc}=He,at=[pc,mc,uc];fc?(at.unshift(xi?"\xA0":""),at.unshift(gi)):(at.push(xi?"\xA0":""),at.push(gi)),at.push(gn,xn,bn);let gc=at.join("");return K(st,gc,j)},ks=()=>(e,t,r)=>{let o=(e.displayOldPrice===void 0||T(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${Z({isAlternativePrice:o})(e,t,r)}${o?"&nbsp;"+Z({displayStrikethrough:!0})(e,t,r):""}`},Os=()=>(e,t,r)=>{let{instant:n}=e;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let o={...e,displayTax:!1,displayPerUnit:!1},s=(e.displayOldPrice===void 0||T(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${s?Z({displayStrikethrough:!0})(o,t,r)+"&nbsp;":""}${Z({isAlternativePrice:s})(e,t,r)}${K(B.containerAnnualPrefix,"&nbsp;(")}${Z({displayAnnual:!0,instant:n})(o,t,r)}${K(B.containerAnnualSuffix,")")}`},$s=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${Z({isAlternativePrice:e.displayOldPrice})(e,t,r)}${K(B.containerAnnualPrefix,"&nbsp;(")}${Z({displayAnnual:!0})(n,t,r)}${K(B.containerAnnualSuffix,")")}`};var Ns=Z(),Ms=ks(),Is=Z({displayOptical:!0}),Hs=Z({displayStrikethrough:!0}),Us=Z({displayAnnual:!0}),Ds=Z({displayOptical:!0,isAlternativePrice:!0}),Bs=Z({isAlternativePrice:!0}),zs=$s(),Fs=Os();var ch=(e,t)=>{if(!(!Gt(e)||!Gt(t)))return Math.floor((t-e)/t*100)},Gs=()=>(e,t)=>{let{price:r,priceWithoutDiscount:n}=t,o=ch(r,n);return o===void 0?'<span class="no-discount"></span>':`<span class="discount">${o}%</span>`};var Vs=Gs();var js=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","FR_fr","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],lh={INDIVIDUAL_COM:["ZA_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","ZA_en","SG_en","KR_ko"],TEAM_COM:["ZA_en","LT_lt","LV_lv","NG_en","ZA_en","CO_es","KR_ko"],INDIVIDUAL_EDU:["LT_lt","LV_lv","SA_en","SG_en"],TEAM_EDU:["SG_en","KR_ko"]},er=class er extends HTMLSpanElement{constructor(){super();p(this,"masElement",new ut(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let n=Y();if(!n)return null;let{displayOldPrice:o,displayPerUnit:i,displayRecurrence:s,displayTax:a,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:u,alternativePrice:d,template:m,wcsOsi:x}=n.collectPriceOptions(r);return $r(er,{displayOldPrice:o,displayPerUnit:i,displayRecurrence:s,displayTax:a,forceTaxExclusive:c,perpetual:l,promotionCode:h,quantity:u,alternativePrice:d,template:m,wcsOsi:x})}get isInlinePrice(){return!0}attributeChangedCallback(r,n,o){this.masElement.attributeChangedCallback(r,n,o)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}resolveDisplayTaxForGeoAndSegment(r,n,o,i){let s=`${r}_${n}`;if(js.includes(r)||js.includes(s))return!0;let a=lh[`${o}_${i}`];return a?!!(a.includes(r)||a.includes(s)):!1}async resolveDisplayTax(r,n){let[o]=await r.resolveOfferSelectors(n),i=jt(await o,n);if(i?.length){let{country:s,language:a}=n,c=i[0],[l=""]=c.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(s,a,c.customerSegment,l)}}async render(r={}){if(!this.isConnected)return!1;let n=Y();if(!n)return!1;let o=n.collectPriceOptions(r,this);if(!o.wcsOsi.length)return!1;let i=this.masElement.togglePending(o);this.innerHTML="";let[s]=n.resolveOfferSelectors(o);return this.renderOffers(jt(await s,o),o,i)}renderOffers(r,n={},o=void 0){if(!this.isConnected)return;let i=Y();if(!i)return!1;let s=i.collectPriceOptions({...this.dataset,...n},this);if(o??(o=this.masElement.togglePending(s)),r.length){if(this.masElement.toggleResolved(o,r,s)){this.innerHTML=i.buildPriceHTML(r,s);let a=this.closest("p, h3, div");if(!a||!a.querySelector('span[data-template="strikethrough"]')||a.querySelector(".alt-aria-label"))return!0;let c=a?.querySelectorAll('span[is="inline-price"]');return c.length>1&&c.length===a.querySelectorAll('span[data-template="strikethrough"]').length*2&&c.forEach(l=>{l.dataset.template!=="strikethrough"&&l.options&&!l.options.alternativePrice&&(l.options.alternativePrice=!0,l.innerHTML=i.buildPriceHTML(r,l.options))}),!0}}else{let a=new Error(`Not provided: ${s?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(o,a,s))return this.innerHTML="",!0}return!1}updateOptions(r){let n=Y();if(!n)return!1;let{alternativePrice:o,displayOldPrice:i,displayPerUnit:s,displayRecurrence:a,displayTax:c,forceTaxExclusive:l,perpetual:h,promotionCode:u,quantity:d,template:m,wcsOsi:x}=n.collectPriceOptions(r);return Nr(this,{alternativePrice:o,displayOldPrice:i,displayPerUnit:s,displayRecurrence:a,displayTax:c,forceTaxExclusive:l,perpetual:h,promotionCode:u,quantity:d,template:m,wcsOsi:x}),!0}};p(er,"is","inline-price"),p(er,"tag","span");var be=er;window.customElements.get(be.is)||window.customElements.define(be.is,be,{extends:be.tag});function qs({literals:e,providers:t,settings:r}){function n(s,a){let{country:c,displayOldPrice:l,displayPerUnit:h,displayRecurrence:u,displayTax:d,forceTaxExclusive:m,language:x,promotionCode:f,quantity:C,alternativePrice:y}=r,{displayOldPrice:E=l,displayPerUnit:S=h,displayRecurrence:L=u,displayTax:M=d,forceTaxExclusive:H=m,country:j=c,language:W=x,perpetual:oe,promotionCode:D=f,quantity:Q=C,alternativePrice:ae=y,template:we,wcsOsi:he,...He}=Object.assign({},a?.dataset??{},s??{}),_e=Vt({...He,country:j,displayOldPrice:T(E),displayPerUnit:T(S),displayRecurrence:T(L),displayTax:T(M),forceTaxExclusive:T(H),language:W,perpetual:T(oe),promotionCode:Pr(D).effectivePromoCode,quantity:ht(Q,P.quantity),alternativePrice:T(ae),template:we,wcsOsi:kr(he)});if(a)for(let Dt of t.price)Dt(a,_e);return _e}function o(s,a){if(!Array.isArray(s)||!s.length||!a)return"";let{template:c}=a,l;switch(c){case"discount":l=Vs;break;case"strikethrough":l=Hs;break;case"annual":l=Us;break;default:a.template==="optical"&&a.alternativePrice?l=Ds:a.template==="optical"?l=Is:a.country==="AU"&&s[0].planType==="ABM"?l=a.promotionCode?Fs:zs:a.alternativePrice?l=Bs:l=a.promotionCode?Ms:Ns}let h=n(a);h.literals=Object.assign({},e.price,Vt(a.literals??{}));let[u]=s;return u={...u,...u.priceDetails},l(h,u)}let i=be.createInlinePrice;return{InlinePrice:be,buildPriceHTML:o,collectPriceOptions:n,createInlinePrice:i}}function hh({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||P.language),t??(t=e?.split("_")?.[1]||P.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function Ws(e={}){let{commerce:t={}}=e,r=fe.PRODUCTION,n=Dn,o=I("checkoutClientId",t)??P.checkoutClientId,i=Fe(I("checkoutWorkflow",t),ie,P.checkoutWorkflow),s=V.CHECKOUT;i===ie.V3&&(s=Fe(I("checkoutWorkflowStep",t),V,P.checkoutWorkflowStep));let a=T(I("displayOldPrice",t),P.displayOldPrice),c=T(I("displayPerUnit",t),P.displayPerUnit),l=T(I("displayRecurrence",t),P.displayRecurrence),h=T(I("displayTax",t),P.displayTax),u=T(I("entitlement",t),P.entitlement),d=T(I("modal",t),P.modal),m=T(I("forceTaxExclusive",t),P.forceTaxExclusive),x=I("promotionCode",t)??P.promotionCode,f=ht(I("quantity",t)),C=I("wcsApiKey",t)??P.wcsApiKey,y=t?.env==="stage",E=Te.PUBLISHED;["true",""].includes(t.allowOverride)&&(y=(I(Hn,t,{metadata:!1})?.toLowerCase()??t?.env)==="stage",E=Fe(I(Un,t),Te,E)),y&&(r=fe.STAGE,n=Bn);let L=I("mas-io-url")??e.masIOUrl??`https://www${r===fe.STAGE?".stage":""}.adobe.com/mas/io`;return{...hh(e),displayOldPrice:a,checkoutClientId:o,checkoutWorkflow:i,checkoutWorkflowStep:s,displayPerUnit:c,displayRecurrence:l,displayTax:h,entitlement:u,extraOptions:P.extraOptions,modal:d,env:r,forceTaxExclusive:m,promotionCode:x,quantity:f,alternativePrice:P.alternativePrice,wcsApiKey:C,wcsURL:n,landscape:E,masIOUrl:L}}async function qr(e,t={},r=2,n=100){let o;for(let i=0;i<=r;i++)try{return await fetch(e,t)}catch(s){if(o=s,i>r)break;await new Promise(a=>setTimeout(a,n*(i+1)))}throw o}var To="wcs";function Ys({settings:e}){let t=ee.module(To),{env:r,wcsApiKey:n}=e,o=new Map,i=new Map,s,a=new Map;async function c(d,m,x=!0){let f=Y(),C=$n;t.debug("Fetching:",d);let y="",E;if(d.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let S=new Map(m),[L]=d.offerSelectorIds,M=Date.now()+Math.random().toString(36).substring(2,7),H=`${To}:${L}:${M}${Ce}`,j=`${To}:${L}:${M}${Ft}`,W,oe;try{if(performance.mark(H),y=new URL(e.wcsURL),y.searchParams.set("offer_selector_ids",L),y.searchParams.set("country",d.country),y.searchParams.set("locale",d.locale),y.searchParams.set("landscape",r===fe.STAGE?"ALL":e.landscape),y.searchParams.set("api_key",n),d.language&&y.searchParams.set("language",d.language),d.promotionCode&&y.searchParams.set("promotion_code",d.promotionCode),d.currency&&y.searchParams.set("currency",d.currency),E=await qr(y.toString(),{credentials:"omit"}),E.ok){let D=[];try{let Q=await E.json();t.debug("Fetched:",d,Q),D=Q.resolvedOffers??[]}catch(Q){t.error(`Error parsing JSON: ${Q.message}`,{...Q.context,...f?.duration})}D=D.map(Lr),m.forEach(({resolve:Q},ae)=>{let we=D.filter(({offerSelectorIds:he})=>he.includes(ae)).flat();we.length&&(S.delete(ae),m.delete(ae),Q(we))})}else C=On}catch(D){C=`Network error: ${D.message}`}finally{({startTime:W,duration:oe}=performance.measure(j,H)),performance.clearMarks(H),performance.clearMeasures(j)}x&&m.size&&(t.debug("Missing:",{offerSelectorIds:[...m.keys()]}),m.forEach(D=>{D.reject(new ge(C,{...d,response:E,startTime:W,duration:oe,...f?.duration}))}))}function l(){clearTimeout(s);let d=[...i.values()];i.clear(),d.forEach(({options:m,promises:x})=>c(m,x))}function h(){let d=o.size;a=new Map(o),o.clear(),t.debug(`Moved ${d} cache entries to stale cache`)}function u({country:d,language:m,perpetual:x=!1,promotionCode:f="",wcsOsi:C=[]}){let y=`${m}_${d}`;d!=="GB"&&(m=x?"EN":"MULT");let E=[d,m,f].filter(S=>S).join("-").toLowerCase();return C.map(S=>{let L=`${S}-${E}`;if(o.has(L))return o.get(L);let M=new Promise((H,j)=>{let W=i.get(E);if(!W){let oe={country:d,locale:y,offerSelectorIds:[]};d!=="GB"&&(oe.language=m),W={options:oe,promises:new Map},i.set(E,W)}f&&(W.options.promotionCode=f),W.options.offerSelectorIds.push(S),W.promises.set(S,{resolve:H,reject:j}),l()}).catch(H=>{if(a.has(L))return a.get(L);throw H});return o.set(L,M),M})}return{Commitment:Ue,PlanType:Ci,Term:te,applyPlanType:Lr,resolveOfferSelectors:u,flushWcsCacheInternal:h}}var Xs="mas-commerce-service",Ks="mas:start",Zs="mas:ready",Qs="mas-commerce-service:initTime",tr,Wr,Js,Co=class extends HTMLElement{constructor(){super(...arguments);R(this,Wr);R(this,tr);p(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(n,o,i)=>{let s=await r?.(n,o,this.imsSignedInPromise,i);return s||null})}activate(){let r=b(this,Wr,Js),n=Object.freeze(Ws(r));dt(r.lana);let o=ee.init(r.hostEnv).module("service");o.debug("Activating:",r);let s={price:ji(n)},a={checkout:new Set,price:new Set},c={literals:s,providers:a,settings:n};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...Fi(c),...Gi(c),...qs(c),...Ys(c),...Gn,Log:ee,get defaults(){return P},get log(){return ee},get providers(){return{checkout(h){return a.checkout.add(h),()=>a.checkout.delete(h)},price(h){return a.price.add(h),()=>a.price.delete(h)}}},get settings(){return n}})),o.debug("Activated:",{literals:s,settings:n});let l=new CustomEvent(wr,{bubbles:!0,cancelable:!1,detail:this});performance.mark(Zs),k(this,tr,performance.measure(Qs,Ks,Zs)?.duration),this.dispatchEvent(l),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(Ks),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(Bt).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh()),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{[Qs]:b(this,tr)}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:o})=>o>this.lastLoggingTime).filter(({transferSize:o,duration:i,responseStatus:s})=>o===0&&i===0&&s<200||s>=400),n=Array.from(new Map(r.map(o=>[o.name,o])).values());if(n.some(({name:o})=>/(\/fragments\/|web_commerce_artifact)/.test(o))){let o=n.map(({name:i})=>i);this.log.error("Failed requests:",{failedUrls:o,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};tr=new WeakMap,Wr=new WeakSet,Js=function(){let r=this.getAttribute("env")??"prod",n={hostEnv:{name:r},commerce:{env:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language"].forEach(o=>{let i=this.getAttribute(o);i&&(n[o]=i)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(o=>{let i=this.getAttribute(o);if(i!=null){let s=o.replace(/-([a-z])/g,a=>a[1].toUpperCase());n.commerce[s]=i}}),n};window.customElements.get(Xs)||window.customElements.define(Xs,Co);var rr=class rr extends Ir(HTMLButtonElement){static createCheckoutButton(t={},r=""){return Mr(rr,t,r)}setCheckoutUrl(t){this.setAttribute("data-href",t)}get href(){return this.getAttribute("data-href")}get isCheckoutButton(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}this.href&&(window.location.href=this.href)}};p(rr,"is","checkout-button"),p(rr,"tag","button");var ft=rr;window.customElements.get(ft.is)||window.customElements.define(ft.is,ft,{extends:ft.tag});var dh="mas-commerce-service";function ea(e,t){let r;return function(){let n=this,o=arguments;clearTimeout(r),r=setTimeout(()=>e.apply(n,o),t)}}function We(e,t={},r=null,n=null){let o=n?document.createElement(e,{is:n}):document.createElement(e);r instanceof HTMLElement?o.appendChild(r):o.innerHTML=r;for(let[i,s]of Object.entries(t))o.setAttribute(i,s);return o}function Yr(){return window.matchMedia("(max-width: 767px)")}function gt(){return Yr().matches}function ta(){return window.matchMedia("(max-width: 1024px)").matches}function xt(){return document.getElementsByTagName(dh)?.[0]}function uh(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var nr,Ye=class Ye extends HTMLAnchorElement{constructor(){super();R(this,nr,!1);this.setAttribute("is",Ye.is)}get isUptLink(){return!0}initializeWcsData(r,n){this.setAttribute("data-wcs-osi",r),n&&this.setAttribute("data-promotion-code",n),k(this,nr,!0),this.composePromoTermsUrl()}attributeChangedCallback(r,n,o){b(this,nr)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let r=this.getAttribute("data-wcs-osi");if(!r){let u=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${u}`);return}let n=xt(),o=[r],i=this.getAttribute("data-promotion-code"),{country:s,language:a,env:c}=n.settings,l={country:s,language:a,wcsOsi:o,promotionCode:i},h=n.resolveOfferSelectors(l);Promise.all(h).then(([[u]])=>{let d=`locale=${a}_${s}&country=${s}&offer_id=${u.offerId}`;i&&(d+=`&promotion_code=${encodeURIComponent(i)}`),this.href=`${uh(c)}?${d}`}).catch(u=>{console.error(`Could not resolve offer selectors for id: ${r}.`,u.message)})}static createFrom(r){let n=new Ye;for(let o of r.attributes)o.name!=="is"&&(o.name==="class"&&o.value.includes("upt-link")?n.setAttribute("class",o.value.replace("upt-link","").trim()):n.setAttribute(o.name,o.value));return n.innerHTML=r.innerHTML,n.setAttribute("tabindex",0),n}};nr=new WeakMap,p(Ye,"is","upt-link"),p(Ye,"tag","a"),p(Ye,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var Pe=Ye;window.customElements.get(Pe.is)||window.customElements.define(Pe.is,Pe,{extends:Pe.tag});var Xr=window,Zr=Xr.ShadowRoot&&(Xr.ShadyCSS===void 0||Xr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,na=Symbol(),ra=new WeakMap,Kr=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==na)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(Zr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=ra.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ra.set(r,t))}return t}toString(){return this.cssText}},oa=e=>new Kr(typeof e=="string"?e:e+"",void 0,na);var Po=(e,t)=>{Zr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=Xr.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},Qr=Zr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return oa(r)})(e):e;var Lo,Jr=window,ia=Jr.trustedTypes,mh=ia?ia.emptyScript:"",sa=Jr.reactiveElementPolyfillSupport,ko={toAttribute(e,t){switch(t){case Boolean:e=e?mh:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},aa=(e,t)=>t!==e&&(t==t||e==e),Ro={attribute:!0,type:String,converter:ko,reflect:!1,hasChanged:aa},Oo="finalized",Xe=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=Ro){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Ro}static finalize(){if(this.hasOwnProperty(Oo))return!1;this[Oo]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(Qr(o))}else t!==void 0&&r.push(Qr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Po(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=Ro){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:ko).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:ko;this._$El=i,this[i]=a.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||aa)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Xe[Oo]=!0,Xe.elementProperties=new Map,Xe.elementStyles=[],Xe.shadowRootOptions={mode:"open"},sa?.({ReactiveElement:Xe}),((Lo=Jr.reactiveElementVersions)!==null&&Lo!==void 0?Lo:Jr.reactiveElementVersions=[]).push("1.6.3");var $o,en=window,bt=en.trustedTypes,ca=bt?bt.createPolicy("lit-html",{createHTML:e=>e}):void 0,Mo="$lit$",Le=`lit$${(Math.random()+"").slice(9)}$`,fa="?"+Le,ph=`<${fa}>`,Qe=document,tn=()=>Qe.createComment(""),ir=e=>e===null||typeof e!="object"&&typeof e!="function",ga=Array.isArray,fh=e=>ga(e)||typeof e?.[Symbol.iterator]=="function",No=`[ 	
\f\r]`,or=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,la=/-->/g,ha=/>/g,Ke=RegExp(`>|${No}(?:([^\\s"'>=/]+)(${No}*=${No}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),da=/'/g,ua=/"/g,xa=/^(?:script|style|textarea|title)$/i,ba=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),lp=ba(1),hp=ba(2),sr=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),ma=new WeakMap,Ze=Qe.createTreeWalker(Qe,129,null,!1);function va(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ca!==void 0?ca.createHTML(t):t}var gh=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=or;for(let a=0;a<r;a++){let c=e[a],l,h,u=-1,d=0;for(;d<c.length&&(s.lastIndex=d,h=s.exec(c),h!==null);)d=s.lastIndex,s===or?h[1]==="!--"?s=la:h[1]!==void 0?s=ha:h[2]!==void 0?(xa.test(h[2])&&(o=RegExp("</"+h[2],"g")),s=Ke):h[3]!==void 0&&(s=Ke):s===Ke?h[0]===">"?(s=o??or,u=-1):h[1]===void 0?u=-2:(u=s.lastIndex-h[2].length,l=h[1],s=h[3]===void 0?Ke:h[3]==='"'?ua:da):s===ua||s===da?s=Ke:s===la||s===ha?s=or:(s=Ke,o=void 0);let m=s===Ke&&e[a+1].startsWith("/>")?" ":"";i+=s===or?c+ph:u>=0?(n.push(l),c.slice(0,u)+Mo+c.slice(u)+Le+m):c+Le+(u===-2?(n.push(void 0),a):m)}return[va(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},ar=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,a=t.length-1,c=this.parts,[l,h]=gh(t,r);if(this.el=e.createElement(l,n),Ze.currentNode=this.el.content,r===2){let u=this.el.content,d=u.firstChild;d.remove(),u.append(...d.childNodes)}for(;(o=Ze.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes()){let u=[];for(let d of o.getAttributeNames())if(d.endsWith(Mo)||d.startsWith(Le)){let m=h[s++];if(u.push(d),m!==void 0){let x=o.getAttribute(m.toLowerCase()+Mo).split(Le),f=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:f[2],strings:x,ctor:f[1]==="."?Ho:f[1]==="?"?Uo:f[1]==="@"?Do:yt})}else c.push({type:6,index:i})}for(let d of u)o.removeAttribute(d)}if(xa.test(o.tagName)){let u=o.textContent.split(Le),d=u.length-1;if(d>0){o.textContent=bt?bt.emptyScript:"";for(let m=0;m<d;m++)o.append(u[m],tn()),Ze.nextNode(),c.push({type:2,index:++i});o.append(u[d],tn())}}}else if(o.nodeType===8)if(o.data===fa)c.push({type:2,index:i});else{let u=-1;for(;(u=o.data.indexOf(Le,u+1))!==-1;)c.push({type:7,index:i}),u+=Le.length-1}i++}}static createElement(t,r){let n=Qe.createElement("template");return n.innerHTML=t,n}};function vt(e,t,r=e,n){var o,i,s,a;if(t===sr)return t;let c=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,l=ir(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,n)),n!==void 0?((s=(a=r)._$Co)!==null&&s!==void 0?s:a._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=vt(e,c._$AS(e,t.values),c,n)),t}var Io=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:Qe).importNode(n,!0);Ze.currentNode=i;let s=Ze.nextNode(),a=0,c=0,l=o[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new rn(s,s.nextSibling,this,t):l.type===1?h=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(h=new Bo(s,this,t)),this._$AV.push(h),l=o[++c]}a!==l?.index&&(s=Ze.nextNode(),a++)}return Ze.currentNode=Qe,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},rn=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=vt(this,t,r),ir(t)?t===z||t==null||t===""?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==sr&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):fh(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==z&&ir(this._$AH)?this._$AA.nextSibling.data=t:this.$(Qe.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=ar.createElement(va(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new Io(i,this),a=s.u(this.options);s.v(n),this.$(a),this._$AH=s}}_$AC(t){let r=ma.get(t.strings);return r===void 0&&ma.set(t.strings,r=new ar(t)),r}T(t){ga(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(tn()),this.k(tn()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},yt=class{constructor(t,r,n,o,i){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=z}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=vt(this,t,r,0),s=!ir(t)||t!==this._$AH&&t!==sr,s&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=vt(this,a[n+c],r,c),l===sr&&(l=this._$AH[c]),s||(s=!ir(l)||l!==this._$AH[c]),l===z?t=z:t!==z&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}s&&!o&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ho=class extends yt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}},xh=bt?bt.emptyScript:"",Uo=class extends yt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==z?this.element.setAttribute(this.name,xh):this.element.removeAttribute(this.name)}},Do=class extends yt{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=vt(this,t,r,0))!==null&&n!==void 0?n:z)===sr)return;let o=this._$AH,i=t===z&&o!==z||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==z&&(o===z||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},Bo=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){vt(this,t)}};var pa=en.litHtmlPolyfillSupport;pa?.(ar,rn),(($o=en.litHtmlVersions)!==null&&$o!==void 0?$o:en.litHtmlVersions=[]).push("2.8.0");var nn=window,on=nn.ShadowRoot&&(nn.ShadyCSS===void 0||nn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zo=Symbol(),ya=new WeakMap,cr=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==zo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(on&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=ya.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ya.set(r,t))}return t}toString(){return this.cssText}},Re=e=>new cr(typeof e=="string"?e:e+"",void 0,zo),A=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((n,o,i)=>n+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new cr(r,e,zo)},Fo=(e,t)=>{on?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=nn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},sn=on?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return Re(r)})(e):e;var Go,an=window,Ea=an.trustedTypes,bh=Ea?Ea.emptyScript:"",Aa=an.reactiveElementPolyfillSupport,jo={toAttribute(e,t){switch(t){case Boolean:e=e?bh:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},wa=(e,t)=>t!==e&&(t==t||e==e),Vo={attribute:!0,type:String,converter:jo,reflect:!1,hasChanged:wa},qo="finalized",ve=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=Vo){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Vo}static finalize(){if(this.hasOwnProperty(qo))return!1;this[qo]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(sn(o))}else t!==void 0&&r.push(sn(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Fo(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=Vo){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:jo).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:jo;this._$El=i,this[i]=a.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||wa)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};ve[qo]=!0,ve.elementProperties=new Map,ve.elementStyles=[],ve.shadowRootOptions={mode:"open"},Aa?.({ReactiveElement:ve}),((Go=an.reactiveElementVersions)!==null&&Go!==void 0?Go:an.reactiveElementVersions=[]).push("1.6.3");var Wo,cn=window,Et=cn.trustedTypes,_a=Et?Et.createPolicy("lit-html",{createHTML:e=>e}):void 0,Xo="$lit$",ke=`lit$${(Math.random()+"").slice(9)}$`,ka="?"+ke,vh=`<${ka}>`,tt=document,hr=()=>tt.createComment(""),dr=e=>e===null||typeof e!="object"&&typeof e!="function",Oa=Array.isArray,yh=e=>Oa(e)||typeof e?.[Symbol.iterator]=="function",Yo=`[ 	
\f\r]`,lr=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Sa=/-->/g,Ta=/>/g,Je=RegExp(`>|${Yo}(?:([^\\s"'>=/]+)(${Yo}*=${Yo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ca=/'/g,Pa=/"/g,$a=/^(?:script|style|textarea|title)$/i,Na=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),g=Na(1),gp=Na(2),rt=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),La=new WeakMap,et=tt.createTreeWalker(tt,129,null,!1);function Ma(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return _a!==void 0?_a.createHTML(t):t}var Eh=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=lr;for(let a=0;a<r;a++){let c=e[a],l,h,u=-1,d=0;for(;d<c.length&&(s.lastIndex=d,h=s.exec(c),h!==null);)d=s.lastIndex,s===lr?h[1]==="!--"?s=Sa:h[1]!==void 0?s=Ta:h[2]!==void 0?($a.test(h[2])&&(o=RegExp("</"+h[2],"g")),s=Je):h[3]!==void 0&&(s=Je):s===Je?h[0]===">"?(s=o??lr,u=-1):h[1]===void 0?u=-2:(u=s.lastIndex-h[2].length,l=h[1],s=h[3]===void 0?Je:h[3]==='"'?Pa:Ca):s===Pa||s===Ca?s=Je:s===Sa||s===Ta?s=lr:(s=Je,o=void 0);let m=s===Je&&e[a+1].startsWith("/>")?" ":"";i+=s===lr?c+vh:u>=0?(n.push(l),c.slice(0,u)+Xo+c.slice(u)+ke+m):c+ke+(u===-2?(n.push(void 0),a):m)}return[Ma(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},ur=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,a=t.length-1,c=this.parts,[l,h]=Eh(t,r);if(this.el=e.createElement(l,n),et.currentNode=this.el.content,r===2){let u=this.el.content,d=u.firstChild;d.remove(),u.append(...d.childNodes)}for(;(o=et.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes()){let u=[];for(let d of o.getAttributeNames())if(d.endsWith(Xo)||d.startsWith(ke)){let m=h[s++];if(u.push(d),m!==void 0){let x=o.getAttribute(m.toLowerCase()+Xo).split(ke),f=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:f[2],strings:x,ctor:f[1]==="."?Zo:f[1]==="?"?Qo:f[1]==="@"?Jo:wt})}else c.push({type:6,index:i})}for(let d of u)o.removeAttribute(d)}if($a.test(o.tagName)){let u=o.textContent.split(ke),d=u.length-1;if(d>0){o.textContent=Et?Et.emptyScript:"";for(let m=0;m<d;m++)o.append(u[m],hr()),et.nextNode(),c.push({type:2,index:++i});o.append(u[d],hr())}}}else if(o.nodeType===8)if(o.data===ka)c.push({type:2,index:i});else{let u=-1;for(;(u=o.data.indexOf(ke,u+1))!==-1;)c.push({type:7,index:i}),u+=ke.length-1}i++}}static createElement(t,r){let n=tt.createElement("template");return n.innerHTML=t,n}};function At(e,t,r=e,n){var o,i,s,a;if(t===rt)return t;let c=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,l=dr(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,n)),n!==void 0?((s=(a=r)._$Co)!==null&&s!==void 0?s:a._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=At(e,c._$AS(e,t.values),c,n)),t}var Ko=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:tt).importNode(n,!0);et.currentNode=i;let s=et.nextNode(),a=0,c=0,l=o[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new mr(s,s.nextSibling,this,t):l.type===1?h=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(h=new ei(s,this,t)),this._$AV.push(h),l=o[++c]}a!==l?.index&&(s=et.nextNode(),a++)}return et.currentNode=tt,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},mr=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=At(this,t,r),dr(t)?t===F||t==null||t===""?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==rt&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):yh(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==F&&dr(this._$AH)?this._$AA.nextSibling.data=t:this.$(tt.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=ur.createElement(Ma(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new Ko(i,this),a=s.u(this.options);s.v(n),this.$(a),this._$AH=s}}_$AC(t){let r=La.get(t.strings);return r===void 0&&La.set(t.strings,r=new ur(t)),r}T(t){Oa(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(hr()),this.k(hr()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},wt=class{constructor(t,r,n,o,i){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=F}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=At(this,t,r,0),s=!dr(t)||t!==this._$AH&&t!==rt,s&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=At(this,a[n+c],r,c),l===rt&&(l=this._$AH[c]),s||(s=!dr(l)||l!==this._$AH[c]),l===F?t=F:t!==F&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}s&&!o&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Zo=class extends wt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}},Ah=Et?Et.emptyScript:"",Qo=class extends wt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==F?this.element.setAttribute(this.name,Ah):this.element.removeAttribute(this.name)}},Jo=class extends wt{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=At(this,t,r,0))!==null&&n!==void 0?n:F)===rt)return;let o=this._$AH,i=t===F&&o!==F||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==F&&(o===F||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},ei=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){At(this,t)}};var Ra=cn.litHtmlPolyfillSupport;Ra?.(ur,mr),((Wo=cn.litHtmlVersions)!==null&&Wo!==void 0?Wo:cn.litHtmlVersions=[]).push("2.8.0");var Ia=(e,t,r)=>{var n,o;let i=(n=r?.renderBefore)!==null&&n!==void 0?n:t,s=i._$litPart$;if(s===void 0){let a=(o=r?.renderBefore)!==null&&o!==void 0?o:null;i._$litPart$=s=new mr(t.insertBefore(hr(),a),a,void 0,r??{})}return s._$AI(e),s};var ti,ri;var N=class extends ve{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ia(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return rt}};N.finalized=!0,N._$litElement$=!0,(ti=globalThis.litElementHydrateSupport)===null||ti===void 0||ti.call(globalThis,{LitElement:N});var Ha=globalThis.litElementPolyfillSupport;Ha?.({LitElement:N});((ri=globalThis.litElementVersions)!==null&&ri!==void 0?ri:globalThis.litElementVersions=[]).push("3.3.3");var Oe="(max-width: 767px)",ln="(max-width: 1199px)",G="(min-width: 768px)",U="(min-width: 1200px)",ce="(min-width: 1600px)";var Ua=A`
    :host {
        --consonant-merch-card-background-color: #fff;
        --consonant-merch-card-border: 1px solid var(--consonant-merch-card-border-color);
        -webkit-font-smoothing: antialiased;
        background-color: var(--consonant-merch-card-background-color);
        border-radius: var(--consonant-merch-spacing-xs);
        border: var(--consonant-merch-card-border);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-family: var(--merch-body-font-family, 'Adobe Clean');
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        position: relative;
        text-align: start;
    }

    :host([failed]) {
        display: none;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([aria-selected]) {
        outline: none;
        box-shadow: inset 0 0 0 2px var(--color-accent);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible,
    :host(:active) .invisible,
    :host(:focus) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .top-section {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 16px;
    }

    .top-section.badge {
        min-height: 32px;
    }

    .body {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        gap: var(--consonant-merch-spacing-xxs);
        padding: var(--consonant-merch-spacing-xs);
    }

    footer {
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        align-items: flex-end;
        width: 100%;
        flex-flow: wrap;
        gap: var(--consonant-merch-spacing-xs);

        padding: var(--consonant-merch-spacing-xs);
    }
    
    footer.wide-footer {
        align-items: center;
    }
    
    footer.wide-footer .secure-transaction-label {
        flex: 0 1 auto;
    }
    
    footer.footer-column {
        flex-direction: column;
    }
    
    footer.footer-column .secure-transaction-label {
        align-self: flex-start;
    }

    hr {
        background-color: var(--merch-color-grey-200);
        border: none;
        height: 1px;
        width: auto;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: var(--consonant-merch-spacing-xs);
        margin-right: var(--consonant-merch-spacing-xs);
    }

    div[class$='-badge'] {
        position: absolute;
        top: 16px;
        right: 0;
        font-size: var(--type-heading-xxs-size);
        font-weight: 500;
        max-width: 180px;
        line-height: 16px;
        text-align: center;
        padding: 8px 11px;
        border-radius: 5px 0 0 5px;
    }

    div[class$='-badge']:dir(rtl) {
        left: 0;
        right: initial;
        padding: 8px 11px;
        border-radius: 0 5px 5px 0;
    }

    .detail-bg-container {
        right: 0;
        padding: var(--consonant-merch-spacing-xs);
        border-radius: 5px;
        font-size: var(--consonant-merch-card-body-font-size);
        margin: var(--consonant-merch-spacing-xs);
    }

    .action-menu {
        display: flex;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 16px;
        right: 16px;
        background-color: #f6f6f6;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px 16px;
        font-size: 0;
    }
    .hidden {
        visibility: hidden;
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--merch-color-grey-600);
    }

    #stock-checkbox {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        gap: 10px; /*same as spectrum */
    }

    #stock-checkbox > input {
        display: none;
    }

    #stock-checkbox > span {
        display: inline-block;
        box-sizing: border-box;
        border: 2px solid rgb(117, 117, 117);
        border-radius: 2px;
        width: 14px;
        height: 14px;
    }

    #stock-checkbox > input:checked + span {
        background: var(--checkmark-icon) no-repeat var(--color-accent);
        border-color: var(--color-accent);
    }

    .secure-transaction-label {
        white-space: nowrap;
        display: inline-flex;
        gap: var(--consonant-merch-spacing-xxs);
        align-items: center;
        flex: 1;
        line-height: normal;
        align-self: center;
    }

    .secure-transaction-label::before {
        display: inline-block;
        content: '';
        width: 12px;
        height: 15px;
        background: var(--secure-icon) no-repeat;
        background-position: center;
        background-size: contain;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
    }

    .checkbox-container input[type='checkbox']:checked + .checkmark {
        background-color: var(--color-accent);
        background-image: var(--checkmark-icon);
        border-color: var(--color-accent);
    }

    .checkbox-container input[type='checkbox'] {
        display: none;
    }

    .checkbox-container .checkmark {
        position: relative;
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #757575;
        background: #fff;
        border-radius: 2px;
        cursor: pointer;
        margin-top: 2px;
    }

    slot[name='icons'] {
        display: flex;
        gap: 8px;
    }

    ::slotted([slot='price']) {
      color: var(--consonant-merch-card-price-color);
    }
`,Da=()=>[A`
      /* Tablet */
      @media screen and ${Re(G)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${Re(U)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];var _t=class extends N{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?g`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:g` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};p(_t,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),p(_t,"styles",A`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='m']) {
            --img-width: 30px;
            --img-height: 30px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }
    `);customElements.define("merch-icon",_t);var St,pr=class pr{constructor(t){p(this,"card");R(this,St);this.card=t,this.insertVariantStyle()}getContainer(){return k(this,St,b(this,St)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),b(this,St)}insertVariantStyle(){if(!pr.styleMap[this.card.variant]){pr.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,o=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),i=parseInt(this.getContainer().style.getPropertyValue(n))||0;o>i&&this.getContainer().style.setProperty(n,`${o}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),g`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return g` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let t=this.card.secureLabel?g`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return g`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};St=new WeakMap,p(pr,"styleMap",{});var $=pr;var Ba=`
:root {
  --consonant-merch-card-catalog-width: 276px;
  --consonant-merch-card-catalog-icon-size: 40px;
}
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--consonant-merch-card-catalog-width);
}

@media screen and ${G} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${U} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${ce} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--consonant-merch-card-catalog-width));
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
}`;var ni={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Tt=class extends ${constructor(r){super(r);p(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Sn,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});p(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let n=this.actionMenuContentSlot.classList.contains("hidden");n||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!n).toString())});p(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(n||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",n),this.setAriaExpanded(this.actionMenu,"false"))});p(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get aemFragmentMapping(){return ni}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return g` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${ta()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":g`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?g`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Ba}setAriaExpanded(r,n){r.setAttribute("aria-expanded",n)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};p(Tt,"variantStyle",A`
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
    `);var za=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${G} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${U} {
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
`;var hn=class extends ${constructor(t){super(t)}getGlobalCSS(){return za}renderLayout(){return g`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?g`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:g`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?g`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:g`
              <hr />
              ${this.secureLabelFooter}
          `}`}};var Fa=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${G} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${U} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${ce} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var dn=class extends ${constructor(t){super(t)}getGlobalCSS(){return Fa}renderLayout(){return g` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":g`<hr />`} ${this.secureLabelFooter}`}};var Ga=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m"] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-xxl-font-size);
    padding: 0 var(--consonant-merch-spacing-xs);
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
    gap: var(--consonant-merch-spacing-xs);
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
    font-color: var(--merch-color-grey-80);
    font-weight: 700;
    padding-block-end: var(--consonant-merch-spacing-xxs);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-size: var(--consonant-merch-card-body-xs-font-size);
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

  merch-card[variant="mini-compare-chart"] .chevron-icon {
    margin-left: 8px;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container {
    display: none;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container.open {
    display: block;
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
@media screen and ${Oe} {
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
}

@media screen and ${ln} {
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
}
@media screen and ${G} {
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
@media screen and ${U} {
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

@media screen and ${ce} {
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
`;var wh=32,Ct=class extends ${constructor(r){super(r);p(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);p(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?g`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:g`<slot name="secure-transaction-label"></slot>`;return g`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Ga}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(o=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((n,o)=>{let i=Math.max(wh,parseFloat(window.getComputedStyle(n).height)||0),s=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(o+1)))||0;i>s&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(o+1),`${i}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}renderLayout(){return g` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?g`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>`:g`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){gt()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};p(Ct,"variantStyle",A`
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

    @media screen and ${Re(ln)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Re(U)} {
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
    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        justify-content: flex-start;
    }
  `);var Va=`
:root {
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;
    --consonant-merch-card-plans-students-width: 568px;
}

merch-card[variant^="plans"] {
    --consonant-merch-card-callout-icon-size: 18px;
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant="plans-students"] {
    width: var(--consonant-merch-card-plans-students-width);
}

merch-card[variant^="plans"] [slot="icons"] {
    --img-width: 41.5px;
}

merch-card[variant^="plans"] [slot="heading-xs"] span.price.price-strikethrough,
merch-card[variant^="plans"] [slot="heading-m"] span.price.price-strikethrough {
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-weight: 700;
}

merch-card[variant^="plans"] [slot="promo-text"] {
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card-collection merch-card[variant^="plans"] {
  width: auto;
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
    padding: 2px 10px 3px;
    background: #D9D9D9;
}

merch-card[variant^="plans"] [slot='callout-content'] > p,
merch-card[variant^="plans"] [slot='callout-content'] > div > div > div {
    color: #000;
}

merch-card[variant^="plans"] [slot="callout-content"] img,
merch-card[variant^="plans"] [slot="callout-content"] .icon-button {
    margin: 1.5px 0 1.5px 8px;
}

merch-card[variant^="plans"] [slot="callout-content"] .icon-button::before {
    width: 18px;
    height: 18px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path fill="%232c2c2c" d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>');
    background-size: 18px 18px;
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
}

merch-card[variant^="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

.plans-container {
    display: flex;
    justify-content: center;
    gap: 36px;
}

.plans-container merch-card-collection {
    padding: 0;
}

/* Mobile */
@media screen and ${Oe} {
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

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    grid-template-columns: var(--consonant-merch-card-plans-width);
}

/* Tablet */
@media screen and ${G} {
  :root {
    --consonant-merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
  .four-merch-cards.plans .foreground {
      max-width: unset;
  }
}

/* desktop */
@media screen and ${U} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${ce} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var un={title:{tag:"p",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},stockOffer:!0,secureLabel:!0,badge:{tag:"div",slot:"badge"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},$e=class extends ${constructor(t){super(t),this.adaptForMobile=this.adaptForMobile.bind(this)}get aemFragmentMapping(){return un}getGlobalCSS(){return Va}adaptForMobile(){if(!this.card.closest("merch-card-collection,overlay-trigger")){this.card.removeAttribute("size");return}let t=this.card.shadowRoot,r=t.querySelector("footer"),n=this.card.getAttribute("size"),o=t.querySelector("footer #stock-checkbox"),i=t.querySelector(".body #stock-checkbox"),s=t.querySelector(".body");if(!n){r.classList.remove("wide-footer"),o&&o.remove();return}let a=gt();if(r&&r.classList.toggle("wide-footer",!a),a&&o){i?o.remove():s.appendChild(o);return}!a&&i&&(o?i.remove():r.prepend(i))}postCardUpdateHook(){this.adaptForMobile(),this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?g`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}connectedCallbackHook(){let t=Yr();t?.addEventListener&&t.addEventListener("change",this.adaptForMobile)}disconnectedCallbackHook(){let t=Yr();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMobile)}renderLayout(){return g` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="annualPrice"></slot>
            <slot name="priceLabel"></slot>
            <slot name="body-xxs"></slot>
            <slot name="promo-text"></slot>
            <slot name="body-xs"></slot>
            <slot name="whats-included"></slot>
            <slot name="callout-content"></slot>
            ${this.stockCheckbox}
            <slot name="badge"></slot>
            <slot name="quantity-select"></slot>
        </div>
        ${this.secureLabelFooter}`}};p($e,"variantStyle",A`
    :host([variant^='plans']) {
        min-height: 348px;
        border: 1px solid var(--merch-card-custom-border-color, #DADADA);
        --merch-card-plans-min-width: 244px;
        --merch-card-plans-max-width: 244px;
        --merch-card-plans-padding: 15px;
        --merch-card-plans-heading-min-height: 23px;
        --merch-color-green-promo: rgb(0, 122, 77);
        --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
        font-weight: 400;
    }

    :host([variant^='plans']) ::slotted([slot='heading-xs']) {
        min-height: var(--merch-card-plans-heading-min-height);
    }

    :host([variant^='plans']) .body {
        min-width: var(--merch-card-plans-min-width);
        max-width: var(--merch-card-plans-max-width);
        padding: var(--merch-card-plans-padding);
    }

    :host([variant^='plans'][size]) .body {
        max-width: none;
    }

    :host([variant^='plans']) .wide-footer #stock-checkbox {
        margin-top: 0;
    }

    :host([variant^='plans']) #stock-checkbox {
        margin-top: 8px;
        gap: 9px;
        color: rgb(34, 34, 34);
        line-height: var(--consonant-merch-card-detail-xs-line-height);
        padding-top: 4px;
        padding-bottom: 5px;
    }

    :host([variant^='plans']) #stock-checkbox > span {
        border: 2px solid rgb(109, 109, 109);
        width: 12px;
        height: 12px;
    }

    :host([variant^='plans']) footer {
        padding: var(--merch-card-plans-padding);
        padding-top: 1px;
    }

    :host([variant^='plans']) .secure-transaction-label {
        color: rgb(80, 80, 80);
        line-height: var(--consonant-merch-card-detail-xs-line-height);
    }
      
    :host([variant^='plans']) ::slotted([slot='heading-xs']) {
        max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }

    :host([variant^='plans']) #badge {
        border-radius: 4px 0 0 4px;
        font-weight: 400;
        line-height: 21px;
        padding: 2px 10px 3px;
    }
    
    :host([variant='plans-students']) {
        min-height: unset;
    }
    
    :host([variant='plans-students']) .body {
        max-width: none;
    }    
  `);var ja=`
:root {
  --consonant-merch-card-product-width: 300px;
}

/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--consonant-merch-card-product-width);
}

/* Tablet */
@media screen and ${G} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${U} {
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
`;var nt=class extends ${constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return ja}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return g` ${this.badge}
      <div class="body" aria-live="polite">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":g`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?g`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(gt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};p(nt,"variantStyle",A`
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
        min-height: var(--consonant-merch-card-product-callout-content-height);
        display: block;
    }
      
    :host([variant='product']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var qa=`
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
@media screen and ${Oe} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${G} {
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
@media screen and ${U} {
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
`;var Pt=class extends ${constructor(t){super(t)}getGlobalCSS(){return qa}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return g` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":g`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?g`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};p(Pt,"variantStyle",A`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var Wa=`
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

@media screen and ${Oe} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${G} {
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
@media screen and ${U} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${ce} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var oi={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Lt=class extends ${constructor(t){super(t)}getGlobalCSS(){return Wa}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return oi}renderLayout(){return g`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?g`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:g`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};p(Lt,"variantStyle",A`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var ii=new Map,X=(e,t,r=null,n=null)=>{ii.set(e,{class:t,fragmentMapping:r,style:n})};X("catalog",Tt,ni,Tt.variantStyle);X("image",hn);X("inline-heading",dn);X("mini-compare-chart",Ct,null,Ct.variantStyle);X("plans",$e,un,$e.variantStyle);X("plans-students",$e,un,$e.variantStyle);X("product",nt,null,nt.variantStyle);X("segment",Pt,null,Pt.variantStyle);X("special-offers",Lt,oi,Lt.variantStyle);var si=(e,t=!1)=>{let r=ii.get(e.variant);if(!r)return t?void 0:new nt(e);let{class:n,style:o}=r;if(o){let i=new CSSStyleSheet;i.replaceSync(o.cssText),e.shadowRoot.adoptedStyleSheets.push(i)}return new n(e)};function Ya(e){return ii.get(e)?.fragmentMapping}var Xa=document.createElement("style");Xa.innerHTML=`
:root {
    --consonant-merch-card-detail-font-size: 12px;
    --consonant-merch-card-detail-font-weight: 500;
    --consonant-merch-card-detail-letter-spacing: 0.8px;

    --consonant-merch-card-heading-font-size: 18px;
    --consonant-merch-card-heading-line-height: 22.5px;
    --consonant-merch-card-heading-secondary-font-size: 14px;
    --consonant-merch-card-body-font-size: 14px;
    --consonant-merch-card-body-line-height: 21px;
    --consonant-merch-card-promo-text-height: var(--consonant-merch-card-body-font-size);

    /* Fonts */
    --merch-body-font-family: 'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --consonant-merch-card-cta-font-size: 15px;

    /* headings */
    --consonant-merch-card-heading-xxxs-font-size: 14px;
    --consonant-merch-card-heading-xxxs-line-height: 18px;
    --consonant-merch-card-heading-xxs-font-size: 16px;
    --consonant-merch-card-heading-xxs-line-height: 20px;
    --consonant-merch-card-heading-xs-font-size: 18px;
    --consonant-merch-card-heading-xs-line-height: 22.5px;
    --consonant-merch-card-heading-s-font-size: 20px;
    --consonant-merch-card-heading-s-line-height: 25px;
    --consonant-merch-card-heading-m-font-size: 24px;
    --consonant-merch-card-heading-m-line-height: 30px;
    --consonant-merch-card-heading-l-font-size: 20px;
    --consonant-merch-card-heading-l-line-height: 30px;
    --consonant-merch-card-heading-xl-font-size: 36px;
    --consonant-merch-card-heading-xl-line-height: 45px;

    /* detail */
    --consonant-merch-card-detail-xs-line-height: 12px;
    --consonant-merch-card-detail-s-font-size: 11px;
    --consonant-merch-card-detail-s-line-height: 14px;
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;
    --consonant-merch-card-detail-l-line-height: 18px;
    --consonant-merch-card-detail-xl-line-height: 23px;

    /* body */
    --consonant-merch-card-body-xxs-font-size: 12px;
    --consonant-merch-card-body-xxs-line-height: 18px;
    --consonant-merch-card-body-xxs-letter-spacing: 1px;
    --consonant-merch-card-body-xs-font-size: 14px;
    --consonant-merch-card-body-xs-line-height: 21px;
    --consonant-merch-card-body-s-font-size: 16px;
    --consonant-merch-card-body-s-line-height: 24px;
    --consonant-merch-card-body-m-font-size: 18px;
    --consonant-merch-card-body-m-line-height: 27px;
    --consonant-merch-card-body-l-font-size: 20px;
    --consonant-merch-card-body-l-line-height: 30px;
    --consonant-merch-card-body-xl-font-size: 22px;
    --consonant-merch-card-body-xxl-font-size: 24px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --consonant-merch-card-background-color: inherit;
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: rgb(59, 99, 251);
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-10: #f6f6f6;
    --merch-color-grey-50: var(--specturm-gray-50);
    --merch-color-grey-60: var(--specturm-gray-600);
    --merch-color-grey-80: #2c2c2c;
    --merch-color-grey-200: #E8E8E8;
    --merch-color-grey-600: #686868;
    --merch-color-grey-700: #464646;
    --merch-color-green-promo: #2D9D78;
    --consonant-merch-card-body-xs-color: var(--spectrum-gray-100, var(--merch-color-grey-80));
    --merch-color-inline-price-strikethrough: initial;
    --consonant-merch-card-detail-s-color: var(--spectrum-gray-600, var(--merch-color-grey-600));
    --consonant-merch-card-heading-color: var(--spectrum-gray-800, var(--merch-color-grey-80));
    --consonant-merch-card-heading-xs-color: var(--consonant-merch-card-heading-color);
    --consonant-merch-card-price-color: #222222;
    --consonant-merch-card-heading-xxxs-color: #131313;
    --consonant-merch-card-body-xxs-color: #292929;

    /* ccd colors */
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;

    /* ah colors */
    --ah-gray-500: #717171;
    
    /* plans colors */
    --spectrum-yellow-300-plans: #F5C700;
    --spectrum-green-900-plans: #05834E;
    --spectrum-gray-300-plans: #DADADA;
    --spectrum-gray-700-plans: #505050;
  
    /* merch card generic */
    --consonant-merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* background image */
    --consonant-merch-card-bg-img-height: 180px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --info-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='12' r='2.15'%3E%3C/circle%3E%3Cpath d='M20.333 24H20v-7.6a.4.4 0 0 0-.4-.4h-3.933s-1.167.032-1.167 1 1.167 1 1.167 1H16v6h-.333s-1.167.032-1.167 1 1.167 1 1.167 1h4.667s1.167-.033 1.167-1-1.168-1-1.168-1z'%3E%3C/path%3E%3Cpath d='M18 2.1A15.9 15.9 0 1 0 33.9 18 15.9 15.9 0 0 0 18 2.1zm0 29.812A13.912 13.912 0 1 1 31.913 18 13.912 13.912 0 0 1 18 31.913z'%3E%3C/path%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(0 6)"/></svg>');

    /* callout */
    --consonant-merch-card-callout-line-height: 21px;
    --consonant-merch-card-callout-font-size: 14px;
    --consonant-merch-card-callout-font-color: #2C2C2C;
    --consonant-merch-card-callout-icon-size: 16px;
    --consonant-merch-card-callout-icon-top: 6px;
    --consonant-merch-card-callout-icon-right: 8px;
    --consonant-merch-card-callout-letter-spacing: 0px;
    --consonant-merch-card-callout-icon-padding: 34px;
    --consonant-merch-card-callout-spacing-xxs: 8px;
}

merch-card-collection {
    display: contents;
}

merch-card-collection > merch-card:not([style]) {
    display: none;
}

merch-card-collection > p[slot],
merch-card-collection > div[slot] p {
    margin: 0;
}

.one-merch-card,
.two-merch-cards,
.three-merch-cards,
.four-merch-cards {
    display: grid;
    justify-content: center;
    justify-items: stretch;
    align-items: normal;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
}

merch-card[variant="ccd-suggested"] *,
merch-card[variant="ccd-slice"] * {
  box-sizing: border-box;
}

merch-card * {
  padding: revert-layer;
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin: var(--consonant-merch-spacing-xs) 0;
    height: 1px;
    border: none;
}

merch-card.has-divider div[slot='body-lower'] hr {
    margin: 0;
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is='inline-price'] {
    display: inline-block;
}

merch-card [slot^='heading-'] {
    color: var(--consonant-merch-card-heading-color);
    font-weight: 700;
}

merch-card [slot='heading-xxxs'] {
        font-size: var(--consonant-merch-card-heading-xxxs-font-size);
        line-height: var(--consonant-merch-card-heading-xxxs-line-height);
        color: var(--consonant-merch-card-heading-xxxs-color);
        letter-spacing: normal;
}

merch-card [slot='heading-xs'] {
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    color: var(--consonant-merch-card-heading-xs-color);
    margin: 0;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-grey-80);
}

merch-card div.starting-at {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  font-weight: 500;
}

merch-card [slot='heading-xs'] a:not(:hover) {
    text-decoration: inherit;
}

merch-card [slot='heading-s'] {
    font-size: var(--consonant-merch-card-heading-s-font-size);
    line-height: var(--consonant-merch-card-heading-s-line-height);
    margin: 0;
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='heading-l'] {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    margin: 0;
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
}

merch-card [slot='whats-included'] {
    margin: var(--consonant-merch-spacing-xxxs) 0px;
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
}

merch-card[variant^='plans'] [slot='badge'] {
    position: absolute;
    top: 16px;
    right: 0;
    line-height: 16px;
}

merch-card [slot='callout-content'] > p {
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
    width: fit-content;
    font-size: var(--consonant-merch-card-callout-font-size);
    line-height: var(--consonant-merch-card-callout-line-height);
}

merch-card [slot='callout-content'] .icon-button {
    position: relative;
    top: 3px;
}

merch-card [slot='callout-content'] .icon-button:before {
    display: inline-block;
    content: '';
    width: 14px;
    height: 14px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>')
}

merch-card [slot='callout-content'] > div {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
    align-items: flex-start;
}

merch-card [slot='callout-content'] > div > div {
    display: flex;
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
}

merch-card [slot='callout-content'] > div > div > div {
    display: inline-block;
    text-align: start;
    font: normal normal normal var(--consonant-merch-card-callout-font-size)/var(--consonant-merch-card-callout-line-height) var(--body-font-family, 'Adobe Clean');
    letter-spacing: var(--consonant-merch-card-callout-letter-spacing);
    color: var(--consonant-merch-card-callout-font-color);
}

merch-card [slot='callout-content'] img {
    width: var(--consonant-merch-card-callout-icon-size);
    height: var(--consonant-merch-card-callout-icon-size);
    margin-inline-end: 2.5px;
    margin-inline-start: 9px;
    margin-block-start: 2.5px;
}

merch-card [slot='detail-s'] {
    font-size: var(--consonant-merch-card-detail-s-font-size);
    line-height: var(--consonant-merch-card-detail-s-line-height);
    letter-spacing: 0.66px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--consonant-merch-card-detail-s-color);
}

merch-card [slot='detail-m'] {
    font-size: var(--consonant-merch-card-detail-m-font-size);
    letter-spacing: var(--consonant-merch-card-detail-m-letter-spacing);
    font-weight: var(--consonant-merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--consonant-merch-card-body-xxs-letter-spacing);
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-s"] {
    color: var(--consonant-merch-card-body-s-color);
}

merch-card button.spectrum-Button > a {
  color: inherit;
  text-decoration: none;
}

merch-card button.spectrum-Button > a:hover {
  color: inherit;
}

merch-card button.spectrum-Button > a:active {
  color: inherit;
}

merch-card button.spectrum-Button > a:focus {
  color: inherit;
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--consonant-merch-card-body-xs-color);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="cci-footer"] p,
merch-card [slot="cct-footer"] p,
merch-card [slot="cce-footer"] p {
    margin: 0;
}

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--consonant-merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--consonant-merch-card-promo-text-height);
    margin: 0;
    min-height: var(--consonant-merch-card-promo-text-height);
    padding: 0;
}

merch-card [slot="footer-rows"] {
    min-height: var(--consonant-merch-card-footer-rows-height);
}

merch-card div[slot="footer"] {
    display: contents;
}

merch-card.product div[slot="footer"] {
    display: block;
}

merch-card.product div[slot="footer"] a + a {
    margin: 5px 0 0 5px;
}

merch-card [slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

merch-card [slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

merch-card div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-bg-img-height);
    max-height: var(--consonant-merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

.price-unit-type:not(.disabled)::before,
.price-tax-inclusivity:not(.disabled)::before {
  content: "\\00a0";
}

merch-card span.placeholder-resolved[data-template='priceStrikethrough'],
merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  font-weight: normal;
  text-decoration: line-through;
  color: var(--merch-color-inline-price-strikethrough);
}

/* merch-offer-select */
merch-offer-select[variant="subscription-options"] merch-offer span[is="inline-price"][data-display-tax='true'] .price-tax-inclusivity {
    font-size: 12px;
    font-style: italic;
    font-weight: normal;
    position: absolute;
    left: 0;
    top: 20px;
}

body.merch-modal {
    overflow: hidden;
    scrollbar-gutter: stable;
    height: 100vh;
}

merch-sidenav-checkbox-group h3 {
    font-size: 14px;
    height: 32px;
    letter-spacing: 0px;
    line-height: 18.2px;
    color: var(--color-gray-600);
    margin: 0px;
}

sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

`;document.head.appendChild(Xa);var Qa=new CSSStyleSheet;Qa.replaceSync(":host { display: contents; }");var Ka="fragment",Za="author",mn="aem-fragment",ye,ai=class{constructor(){R(this,ye,new Map)}clear(){b(this,ye).clear()}addByRequestedId(t,r){b(this,ye).set(t,r)}add(...t){t.forEach(r=>{let{id:n}=r;n&&b(this,ye).set(n,r)})}has(t){return b(this,ye).has(t)}get(t){return b(this,ye).get(t)}remove(t){b(this,ye).delete(t)}};ye=new WeakMap;var fr=new ai,gr,le,Ee,Rt,kt,Ne,ne,Me,xr,br,li,ci=class extends HTMLElement{constructor(){super();R(this,br);p(this,"cache",fr);R(this,gr);R(this,le,null);R(this,Ee,null);R(this,Rt,!1);R(this,kt,null);R(this,Ne,null);R(this,ne);R(this,Me);R(this,xr,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Qa]}static get observedAttributes(){return[Ka,Za]}attributeChangedCallback(r,n,o){r===Ka&&k(this,ne,o),r===Za&&k(this,xr,["","true"].includes(o))}connectedCallback(){if(k(this,Ne,xt(this)),k(this,gr,b(this,Ne).log.module(mn)),k(this,kt,`${mn}:${b(this,ne)}${Ce}`),performance.mark(b(this,kt)),!b(this,ne)){de(this,br,li).call(this,{message:"Missing fragment id"});return}this.refresh(!1)}async getFragmentById(r,n,o){let i=`${mn}:${n}${Ft}`,s;try{if(s=await qr(r,{cache:"default",credentials:"omit"}),!s?.ok){let{startTime:a,duration:c}=performance.measure(i,o);throw new ge("Unexpected fragment response",{response:s,startTime:a,duration:c,...b(this,Ne).duration})}return s.json()}catch{let{startTime:c,duration:l}=performance.measure(i,o);throw s||(s={url:r}),new ge("Failed to fetch fragment",{response:s,startTime:c,duration:l,...b(this,Ne).duration})}}async refresh(r=!0){if(!(b(this,Me)&&!await Promise.race([b(this,Me),Promise.resolve(!1)])))return r&&fr.remove(b(this,ne)),k(this,Me,this.fetchData().then(()=>{let{references:n,referencesTree:o,placeholders:i}=b(this,le)||{};return this.dispatchEvent(new CustomEvent(Be,{detail:{...this.data,stale:b(this,Rt),references:n,referencesTree:o,placeholders:i},bubbles:!0,composed:!0})),!0}).catch(n=>b(this,le)?(fr.addByRequestedId(b(this,ne),b(this,le)),!0):(de(this,br,li).call(this,n),!1))),b(this,Me)}async fetchData(){this.classList.remove("error"),k(this,Ee,null);let r=fr.get(b(this,ne));if(r){k(this,le,r);return}k(this,Rt,!0);let{masIOUrl:n,wcsApiKey:o,locale:i}=b(this,Ne).settings,s=`${n}/fragment?id=${b(this,ne)}&api_key=${o}&locale=${i}`;r=await this.getFragmentById(s,b(this,ne),b(this,kt)),fr.addByRequestedId(b(this,ne),r),k(this,le,r),k(this,Rt,!1)}get updateComplete(){return b(this,Me)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return b(this,Ee)?b(this,Ee):(b(this,xr)?this.transformAuthorData():this.transformPublishData(),b(this,Ee))}transformAuthorData(){let{fields:r,id:n,tags:o}=b(this,le);k(this,Ee,r.reduce((i,{name:s,multiple:a,values:c})=>(i.fields[s]=a?c:c[0],i),{fields:{},id:n,tags:o}))}transformPublishData(){let{fields:r,id:n,tags:o}=b(this,le);k(this,Ee,Object.entries(r).reduce((i,[s,a])=>(i.fields[s]=a?.mimeType?a.value:a??"",i),{fields:{},id:n,tags:o}))}};gr=new WeakMap,le=new WeakMap,Ee=new WeakMap,Rt=new WeakMap,kt=new WeakMap,Ne=new WeakMap,ne=new WeakMap,Me=new WeakMap,xr=new WeakMap,br=new WeakSet,li=function({message:r,context:n}){this.classList.add("error"),b(this,gr).error(`aem-fragment: ${r}`,n),this.dispatchEvent(new CustomEvent(ze,{detail:{message:r,...n},bubbles:!0,composed:!0}))};customElements.define(mn,ci);var Ot=class extends N{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return g`<div class="plans-badge">
            ${this.text}
        </div>`}};p(Ot,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),p(Ot,"styles",A`
        :host {
            display: block;
            background-color: var(--merch-badge-background-color);
            color: var(--merch-badge-color, #000);
            padding: var(--merch-badge-padding);
            border-radius: var(--merch-badge-border-radius);
            font-size: var(--merch-badge-font-size);
            line-height: 21px;
            border: var(--merch-badge-border);
            position: relative;
            left: 1px;
        }
    `);customElements.define("merch-badge",Ot);var vr=class extends N{constructor(){super()}render(){return g`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};p(vr,"styles",A`
        :host {
            display: flex;
            flex-wrap: nowrap;
            gap: 8px;
            margin-right: 16px;
            align-items: center;
        }

        ::slotted([slot='icon']) {
            display: flex;
            justify-content: center;
            align-items: center;
            height: max-content;
        }

        ::slotted([slot='description']) {
            font-size: 14px;
            line-height: 21px;
            margin: 0;
        }

        :host .hidden {
            display: none;
        }
    `),p(vr,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",vr);var yr=class extends N{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((t,r)=>{r>=5&&(t.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return g`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?g`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:g``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};p(yr,"styles",A`
        :host {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            overflow: hidden;
            box-sizing: border-box;
            row-gap: 10px;
        }

        ::slotted([slot='heading']) {
            font-size: 14px;
            font-weight: 700;
            margin-right: 16px;
        }

        ::slotted([slot='content']) {
            display: contents;
        }

        .hidden {
            display: none;
        }

        .see-more {
            font-size: 14px;
            text-decoration: underline;
            color: var(--link-color-dark);
        }
    `),p(yr,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",yr);var _h="#000000",Ja="spectrum-yellow-300-plans",ec="#F8D904",Sh="#EAEAEA",Th=/(accent|primary|secondary)(-(outline|link))?/,Ch="mas:product_code/",Ph="daa-ll",pn="daa-lh",Lh=["XL","L","M","S"],hi="...";function Ae(e,t,r,n){let o=n[e];if(t[e]&&o){let i={slot:o?.slot},s=t[e];if(o.maxCount&&typeof s=="string"){let[c,l]=zh(s,o.maxCount,o.withSuffix);c!==s&&(i.title=l,s=c)}let a=We(o.tag,i,s);r.append(a)}}function Rh(e,t,r){e.mnemonicIcon?.map((o,i)=>({icon:o,alt:e.mnemonicAlt[i]??"",link:e.mnemonicLink[i]??""}))?.forEach(({icon:o,alt:i,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let a={slot:"icons",src:o,loading:t.loading,size:r?.size??"l"};i&&(a.alt=i),s&&(a.href=s);let c=We("merch-icon",a);t.append(c)})}function kh(e,t,r){if(e.variant==="plans"||e.variant==="plans-students"){e.badge?.length&&!e.badge?.startsWith("<merch-badge")&&(e.badge=`<merch-badge variant="${e.variant}" background-color="${Ja}">${e.badge}</merch-badge>`,e.borderColor||(e.borderColor=Ja)),Ae("badge",e,t,r);return}e.badge?(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||_h),t.setAttribute("badge-background-color",e.badgeBackgroundColor||ec),t.setAttribute("border-color",e.badgeBackgroundColor||ec)):t.setAttribute("border-color",e.borderColor||Sh)}function Oh(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function $h(e,t,r){Ae("cardTitle",e,t,{cardTitle:r})}function Nh(e,t,r){Ae("subtitle",e,t,r)}function Mh(e,t,r){if(!e.backgroundColor||e.backgroundColor.toLowerCase()==="default"){t.style.removeProperty("--merch-card-custom-background-color"),t.removeAttribute("background-color");return}r?.[e.backgroundColor]&&(t.style.setProperty("--merch-card-custom-background-color",`var(${r[e.backgroundColor]})`),t.setAttribute("background-color",e.backgroundColor))}function Ih(e,t,r){let n="--merch-card-custom-border-color";e.borderColor?.toLowerCase()==="transparent"?(t.style.removeProperty(n),e.variant==="plans"&&t.style.setProperty(n,"transparent")):e.borderColor&&r&&t.style.setProperty(n,`var(--${e.borderColor})`)}function Hh(e,t,r){if(e.backgroundImage){let n={loading:t.loading??"lazy",src:e.backgroundImage};if(e.backgroundImageAltText?n.alt=e.backgroundImageAltText:n.role="none",!r)return;if(r?.attribute){t.setAttribute(r.attribute,e.backgroundImage);return}t.append(We(r.tag,{slot:r.slot},We("img",n)))}}function Uh(e,t,r){Ae("prices",e,t,r)}function Dh(e,t,r){Ae("promoText",e,t,r),Ae("description",e,t,r),Ae("callout",e,t,r),Ae("quantitySelect",e,t,r),Ae("whatsIncluded",e,t,r)}function Bh(e,t,r,n){e.showStockCheckbox&&r.stockOffer&&(t.setAttribute("checkbox-label",n.stockCheckboxLabel),t.setAttribute("stock-offer-osis",n.stockOfferOsis)),n.secureLabel&&r.secureLabel&&t.setAttribute("secure-label",n.secureLabel)}function zh(e,t,r=!0){try{let n=typeof e!="string"?"":e,o=tc(n);if(o.length<=t)return[n,o];let i=0,s=!1,a=r?t-hi.length<1?1:t-hi.length:t,c=[];for(let u of n){if(i++,u==="<")if(s=!0,n[i]==="/")c.pop();else{let d="";for(let m of n.substring(i)){if(m===" "||m===">")break;d+=m}c.push(d)}if(u==="/"&&n[i]===">"&&c.pop(),u===">"){s=!1;continue}if(!s&&(a--,a===0))break}let l=n.substring(0,i).trim();if(c.length>0){c[0]==="p"&&c.shift();for(let u of c.reverse())l+=`</${u}>`}return[`${l}${r?hi:""}`,o]}catch{let o=typeof e=="string"?e:"",i=tc(o);return[o,i]}}function tc(e){if(!e)return"";let t="",r=!1;for(let n of e){if(n==="<"&&(r=!0),n===">"){r=!1;continue}r||(t+=n)}return t}function Fh(e,t){t.querySelectorAll("a.upt-link").forEach(n=>{let o=Pe.createFrom(n);n.replaceWith(o),o.initializeWcsData(e.osi,e.promoCode)})}function Gh(e,t,r,n){let i=customElements.get("checkout-button").createCheckoutButton({},e.innerHTML);i.setAttribute("tabindex",0);for(let h of e.attributes)["class","is"].includes(h.name)||i.setAttribute(h.name,h.value);i.firstElementChild?.classList.add("spectrum-Button-label");let s=t.ctas.size??"M",a=`spectrum-Button--${n}`,c=Lh.includes(s)?`spectrum-Button--size${s}`:"spectrum-Button--sizeM",l=["spectrum-Button",a,c];return r&&l.push("spectrum-Button--outline"),i.classList.add(...l),i}function Vh(e,t,r,n){let i=customElements.get("checkout-button").createCheckoutButton(e.dataset);e.dataset.analyticsId&&i.setAttribute("data-analytics-id",e.dataset.analyticsId),i.connectedCallback(),i.render();let s="fill";r&&(s="outline");let a=We("sp-button",{treatment:s,variant:n,tabIndex:0,size:t.ctas.size??"m",...e.dataset.analyticsId&&{"data-analytics-id":e.dataset.analyticsId}},e.innerHTML);return a.source=i,i.onceSettled().then(c=>{a.setAttribute("data-navigation-url",c.href)}),a.addEventListener("click",c=>{c.defaultPrevented||i.click()}),a}function jh(e,t){return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function qh(e,t,r,n){if(e.ctas){let{slot:o}=r.ctas,i=We("div",{slot:o},e.ctas),s=[...i.querySelectorAll("a")].map(a=>{let c=Th.exec(a.className)?.[0]??"accent",l=c.includes("accent"),h=c.includes("primary"),u=c.includes("secondary"),d=c.includes("-outline"),m=c.includes("-link");if(t.consonant)return jh(a,l);if(m)return a;let x;return l?x="accent":h?x="primary":u&&(x="secondary"),t.spectrum==="swc"?Vh(a,r,d,x):Gh(a,r,d,x)});i.innerHTML="",i.append(...s),t.append(i)}}function Wh(e,t){let{tags:r}=e,n=r?.find(i=>i.startsWith(Ch))?.split("/").pop();if(!n)return;t.setAttribute(pn,n),[...t.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((i,s)=>{i.setAttribute(Ph,`${i.dataset.analyticsId}-${s+1}`)})}function Yh(e){e.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,r])=>{e.querySelectorAll(`a.${t}`).forEach(n=>{n.classList.remove(t),n.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}function Xh(e,t){e.querySelectorAll("[slot]").forEach(o=>{o.remove()}),["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","size",pn].forEach(o=>e.removeAttribute(o));let n=["wide-strip","thin-strip"];e.classList.remove(...n)}async function rc(e,t){let{id:r,fields:n}=e,{variant:o}=n;if(!o)throw new Error(`hydrate: no variant found in payload ${r}`);let i={stockCheckboxLabel:"Add a 30-day free trial of Adobe Stock.*",stockOfferOsis:"",secureLabel:"Secure transaction"};Xh(t,o),t.id??(t.id=e.id),t.variant=o,await t.updateComplete;let{aemFragmentMapping:s}=t.variantLayout;if(!s)throw new Error(`hydrate: aemFragmentMapping found for ${r}`);s.style==="consonant"&&t.setAttribute("consonant",!0),Rh(n,t,s.mnemonics),kh(n,t,s),Oh(n,t,s.size),$h(n,t,s.title),Nh(n,t,s),Uh(n,t,s),Hh(n,t,s.backgroundImage),Mh(n,t,s.allowedColors),Ih(n,t,s.borderColor),Dh(n,t,s),Bh(n,t,s,i),Fh(n,t),qh(n,t,s,o),Wh(n,t),Yh(t)}var nc="merch-card",Kh=":ready",Zh=":error",di=2e4,fn="merch-card:",Nt,Mt,Ie,$t,ot=class extends N{constructor(){super();R(this,Ie);p(this,"customerSegment");p(this,"marketSegment");p(this,"variantLayout");R(this,Nt);R(this,Mt);p(this,"readyEventDispatched",!1);this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=si(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(r=>{de(this,Ie,$t).call(this,r,{},!1),this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=si(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(r)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(_r)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(De)??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let i=o.value?.[0]?.planType;if(!i)return;let s=this.stockOfferOsis[i];if(!s)return;let a=o.dataset.wcsOsi.split(",").filter(c=>c!==s);r.checked&&a.push(s),o.dataset.wcsOsi=a.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let i=n[o].order;i===1||isNaN(i)||(n[o].order=Number(i)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback(),k(this,Mt,xt()),k(this,Nt,b(this,Mt).Log.module(nc)),this.id??(this.id=this.querySelector("aem-fragment")?.getAttribute("fragment")),performance.mark(`${fn}${this.id}${Ce}`),this.addEventListener(ue,this.handleQuantitySelection),this.addEventListener(zt,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.addEventListener(ze,this.handleAemFragmentEvents),this.addEventListener(Be,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(ue,this.handleQuantitySelection),this.removeEventListener(ze,this.handleAemFragmentEvents),this.removeEventListener(Be,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===ze&&de(this,Ie,$t).call(this,`AEM fragment cannot be loaded: ${r.detail.message}`,r.detail),r.type===Be&&r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;rc(n,this).then(()=>this.checkReady()).catch(o=>b(this,Nt).error(o))}}async checkReady(){let r=new Promise(s=>setTimeout(()=>s("timeout"),di));if(this.aemFragment){let s=await Promise.race([this.aemFragment.updateComplete,r]);if(s===!1){let a=s==="timeout"?`AEM fragment was not resolved within ${di} timeout`:"AEM fragment cannot be loaded";de(this,Ie,$t).call(this,a,{},!1);return}}let n=[...this.querySelectorAll(Bt)];n.push(...[...this.querySelectorAll(wn)].map(s=>s.source));let o=Promise.all(n.map(s=>s.onceSettled().catch(()=>s))).then(s=>s.every(a=>a.classList.contains("placeholder-resolved"))),i=await Promise.race([o,r]);if(i===!0)return performance.mark(`${fn}${this.id}${Kh}`),this.readyEventDispatched||(this.readyEventDispatched=!0,this.dispatchEvent(new CustomEvent(Cn,{bubbles:!0,composed:!0}))),this;{let{duration:s,startTime:a}=performance.measure(`${fn}${this.id}${Zh}`,`${fn}${this.id}${Ce}`),c={duration:s,startTime:a,...b(this,Mt).duration};i==="timeout"?de(this,Ie,$t).call(this,`Contains offers that were not resolved within ${di} timeout`,c):de(this,Ie,$t).call(this,"Contains unresolved offers",c)}}get aemFragment(){return this.querySelector("aem-fragment")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(De)).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(_n,{bubbles:!0})),this.displayFooterElementsInColumn())}get dynamicPrice(){return this.querySelector('[slot="price"]')}};Nt=new WeakMap,Mt=new WeakMap,Ie=new WeakSet,$t=function(r,n={},o=!0){b(this,Nt).error(`merch-card: ${r}`,n),this.failed=!0,o&&this.dispatchEvent(new CustomEvent(Pn,{detail:{...n,message:r},bubbles:!0,composed:!0}))},p(ot,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{if(!r)return;let[n,o,i]=r.split(",");return{PUF:n,ABM:o,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,i,s]=n.split(":"),a=Number(i);return[o,{order:isNaN(a)?void 0:a,size:s}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:i}])=>[n,o,i].filter(s=>s!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:pn,reflect:!0},loading:{type:String}}),p(ot,"styles",[Ua,...Da()]),p(ot,"registerVariant",X),p(ot,"getFragmentMapping",Ya);customElements.define(nc,ot);var It,Er=class extends N{constructor(){super();R(this,It);this.defaults={},this.variant="plans"}saveContainerDefaultValues(){let r=this.closest(this.getAttribute("container")),n=r?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(!0),o=r?.badgeText;return{description:n,badgeText:o}}getSlottedElement(r,n){return(n||this.closest(this.getAttribute("container"))).querySelector(`[slot="${r}"]:not(merch-offer > *)`)}updateSlot(r,n){let o=this.getSlottedElement(r,n);if(!o)return;let i=this.selectedOffer.getOptionValue(r)?this.selectedOffer.getOptionValue(r):this.defaults[r];i&&o.replaceWith(i.cloneNode(!0))}handleOfferSelection(r){let n=r.detail;this.selectOffer(n)}handleOfferSelectionByQuantity(r){let n=r.detail.option,o=Number.parseInt(n),i=this.findAppropriateOffer(o);this.selectOffer(i),this.getSlottedElement("cta").setAttribute("data-quantity",o)}selectOffer(r){if(!r)return;let n=this.selectedOffer;n&&(n.selected=!1),r.selected=!0,this.selectedOffer=r,this.planType=r.planType,this.updateContainer(),this.updateComplete.then(()=>{this.dispatchEvent(new CustomEvent(Tn,{detail:this,bubbles:!0}))})}findAppropriateOffer(r){let n=null;return this.offers.find(i=>{let s=Number.parseInt(i.getAttribute("value"));if(s===r)return!0;if(s>r)return!1;n=i})||n}updateBadgeText(r){this.selectedOffer.badgeText===""?r.badgeText=null:this.selectedOffer.badgeText?r.badgeText=this.selectedOffer.badgeText:r.badgeText=this.defaults.badgeText}updateContainer(){let r=this.closest(this.getAttribute("container"));!r||!this.selectedOffer||(this.updateSlot("cta",r),this.updateSlot("secondary-cta",r),this.updateSlot("price",r),!this.manageableMode&&(this.updateSlot("description",r),this.updateBadgeText(r)))}render(){return g`<fieldset><slot class="${this.variant}"></slot></fieldset>`}connectedCallback(){super.connectedCallback(),this.addEventListener("focusin",this.handleFocusin),this.addEventListener("click",this.handleFocusin),this.addEventListener(ct,this.handleOfferSelectReady);let r=this.closest("merch-quantity-select");this.manageableMode=r,this.offers=[...this.querySelectorAll("merch-offer")],k(this,It,this.handleOfferSelectionByQuantity.bind(this)),this.manageableMode?r.addEventListener(ue,b(this,It)):this.defaults=this.saveContainerDefaultValues(),this.selectedOffer=this.offers[0],this.planType&&this.updateContainer()}get miniCompareMobileCard(){return this.merchCard?.variant==="mini-compare-chart"&&this.isMobile}get merchCard(){return this.closest("merch-card")}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(ue,b(this,It)),this.removeEventListener(ct,this.handleOfferSelectReady),this.removeEventListener("focusin",this.handleFocusin),this.removeEventListener("click",this.handleFocusin)}get price(){return this.querySelector('merch-offer[aria-selected] [is="inline-price"]')}get customerSegment(){return this.selectedOffer?.customerSegment}get marketSegment(){return this.selectedOffer?.marketSegment}handleFocusin(r){r.target?.nodeName==="MERCH-OFFER"&&(r.preventDefault(),r.stopImmediatePropagation(),this.selectOffer(r.target))}async handleOfferSelectReady(){this.planType||this.querySelector("merch-offer:not([plan-type])")||(this.planType=this.selectedOffer.planType,await this.updateComplete,this.selectOffer(this.selectedOffer??this.querySelector("merch-offer[aria-selected]")??this.querySelector("merch-offer")),this.dispatchEvent(new CustomEvent(zt,{bubbles:!0})))}};It=new WeakMap,p(Er,"styles",A`
        :host {
            display: inline-block;
        }

        :host .horizontal {
            display: flex;
            flex-direction: row;
        }

        fieldset {
            display: contents;
        }

        :host([variant='subscription-options']) {
            display: flex;
            flex-direction: column;
            gap: var(--consonant-merch-spacing-xs);
        }
    `),p(Er,"properties",{offers:{type:Array},selectedOffer:{type:Object},defaults:{type:Object},variant:{type:String,attribute:"variant",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},stock:{type:Boolean,reflect:!0}});customElements.define("merch-offer-select",Er);var oc=A`
    :host {
        --merch-radio: rgba(82, 88, 228);
        --merch-radio-hover: rgba(64, 70, 202);
        --merch-radio-down: rgba(50, 54, 168);
        --merch-radio-selected: rgb(2, 101, 220);
        --merch-hovered-shadow: 0 0 0 1px #aaa;
        --merch-selected-shadow: 0 0 0 2px var(--merch-radio-selected);
        box-sizing: border-box;
    }
    .merch-Radio {
        align-items: flex-start;
        display: flex;
        max-inline-size: 100%;
        margin-inline-end: 19px;
        min-block-size: 32px;
        position: relative;
        vertical-align: top;
    }

    .merch-Radio-input {
        block-size: 100%;
        box-sizing: border-box;
        cursor: pointer;
        font-family: inherit;
        font-size: 100%;
        inline-size: 100%;
        line-height: 1.3;
        margin: 0;
        opacity: 0;
        overflow: visible;
        padding: 0;
        position: absolute;
        z-index: 1;
    }

    .merch-Radio-button {
        block-size: 14px;
        box-sizing: border-box;
        flex-grow: 0;
        flex-shrink: 0;
        inline-size: 14px;
        margin-block-start: 9px;
        position: relative;
    }

    .merch-Radio-button:before {
        border-color: rgb(109, 109, 109);
        border-radius: 50%;
        border-style: solid;
        border-width: 2px;
        box-sizing: border-box;
        content: '';
        display: block;
        height: 14px;
        position: absolute;
        transition:
            border 0.13s ease-in-out,
            box-shadow 0.13s ease-in-out;
        width: 14px;
        z-index: 0;
    }

    .merch-Radio-button:after {
        border-radius: 50%;
        content: '';
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        transition:
            opacity 0.13s ease-out,
            margin 0.13s ease-out;
    }

    :host(:active) .merch-Radio-button:before {
        border-color: var(--merch-radio-down);
    }

    :host(:hover) .merch-Radio-button:before {
        border-color: var(--merch-radio-hover);
    }

    :host([aria-selected]) .merch-Radio-button::before {
        border-color: var(--merch-radio-selected);
        border-width: 5px;
    }

    .merch-Radio-label {
        color: rgb(34, 34, 34);
        font-size: 14px;
        line-height: 18.2px;
        margin-block-end: 9px;
        margin-block-start: 6px;
        margin-inline-start: 10px;
        text-align: start;
        transition: color 0.13s ease-in-out;
    }

    input {
        height: 0;
        outline: none;
        position: absolute;
        width: 0;
        z-index: -1;
    }

    .label {
        background-color: white;
        border: 1px solid transparent;
        border-radius: var(--consonant-merch-spacing-xxxs);
        cursor: pointer;
        display: block;
        margin: var(--consonant-merch-spacing-xs) 0;
        padding: var(--consonant-merch-spacing-xs);
        position: relative;
    }

    label:hover {
        box-shadow: var(--merch-hovered-shadow);
    }

    :host([aria-selected]) label {
        box-shadow: var(--merch-selected-shadow);
    }

    sp-icon-info-outline {
        color: #6e6e6e;
        content: '';
    }

    ::slotted(p),
    ::slotted(h5) {
        margin: 0;
    }

    ::slotted([slot='commitment']) {
        font-size: 14px !important;
        font-weight: normal !important;
        line-height: 17px !important;
    }

    #condition {
        line-height: 15px;
    }

    ::slotted([slot='condition']) {
        display: inline-block;
        font-style: italic;
        font-size: 12px;
    }

    ::slotted([slot='teaser']) {
        color: #2d9d78;
        font-size: 14px;
        font-weight: bold;
        line-height: 17px;
    }

    :host([type='subscription-option']) slot[name='price'] {
        display: flex;
        flex-direction: row-reverse;
        align-self: baseline;
        gap: 6px;
    }

    ::slotted(span[is='inline-price']) {
        font-size: 16px;
        font-weight: bold;
        line-height: 20px;
    }

    ::slotted(span[data-template='strikethrough']) {
        font-weight: normal;
    }

    :host([type='subscription-option']) {
        background-color: #fff;
        box-sizing: border-box;
        border-width: 2px;
        border-radius: 5px;
        border-style: solid;
        border-color: #eaeaea;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        min-height: 102px;
    }

    :host([type='subscription-option']:hover) {
        border-color: #cacaca;
    }

    :host([type='subscription-option'][aria-selected]) {
        border-color: #1473e6;
    }

    :host([type='subscription-option']) #condition {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    :host([type='subscription-option'])
        ::slotted([is='inline-price'][data-display-tax='true']) {
        position: relative;
        height: 40px;
    }
`;var Qh="merch-offer",Ar=class extends N{constructor(){super();p(this,"tr");this.type="radio",this.selected=!1}getOptionValue(r){return this.querySelector(`[slot="${r}"]`)}connectedCallback(){super.connectedCallback(),this.initOffer(),this.configuration=this.closest("quantity-selector"),!this.hasAttribute("tabindex")&&!this.configuration&&(this.tabIndex=0),!this.hasAttribute("role")&&!this.configuration&&(this.role="radio")}get asRadioOption(){return g` <div class="merch-Radio">
            <input tabindex="-1" type="radio" class="merch-Radio-input" />
            <span class="merch-Radio-button"></span>
            <span class="merch-Radio-label">${this.text}</span>
        </div>`}get asSubscriptionOption(){return g`<slot name="commitment"></slot>
            <slot name="price"></slot>
            <slot name="teaser"></slot>
            <div id="condition">
                <slot name="condition"></slot>
                <span id="info">
                    <sp-icon-info-outline size="s"></sp-icon-info-outline
                ></span>
                <sp-overlay placement="top" trigger="info@hover" type="hint">
                    <sp-tooltip
                        ><slot name="condition-tooltip"></slot
                    ></sp-tooltip>
                </sp-overlay>
            </div>`}render(){return this.configuration||!this.price?"":this.type==="subscription-option"?this.asSubscriptionOption:this.asRadioOption}get price(){return this.querySelector('span[is="inline-price"]:not([data-template="strikethrough"])')}get cta(){return this.querySelector(De)}get prices(){return this.querySelectorAll('span[is="inline-price"]')}get customerSegment(){return this.price?.value?.[0].customerSegment}get marketSegment(){return this.price?.value?.[0].marketSegments[0]}async initOffer(){if(!this.price)return;this.prices.forEach(n=>n.setAttribute("slot","price")),await this.updateComplete,await Promise.all([...this.prices].map(n=>n.onceSettled()));let{value:[r]}=this.price;this.planType=r.planType,await this.updateComplete,this.dispatchEvent(new CustomEvent(ct,{bubbles:!0}))}};p(Ar,"properties",{text:{type:String},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},badgeText:{type:String,attribute:"badge-text"},type:{type:String,attribute:"type",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0}}),p(Ar,"styles",[oc]);customElements.define(Qh,Ar);var ic=A`
    :host {
        box-sizing: border-box;
        --background-color: var(--qs-background-color, #f6f6f6);
        --text-color: #000;
        --radius: 5px;
        --border-color: var(--qs-border-color, #e8e8e8);
        --border-width: var(--qs-border-width, 1px);
        --label-font-size: var(--qs-label-font-size, 12px);
        --font-size: var(--qs-font-size, 12px);
        --label-color: var(--qs-lable-color, #000);
        --input-height: var(--qs-input-height, 30px);
        --input-width: var(--qs-input-width, 72px);
        --button-width: var(--qs-button-width, 30px);
        --font-size: var(--qs-font-size, 12px);
        --picker-fill-icon: var(
            --chevron-down-icon,
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="10" height="6" aria-hidden="true" viewBox="0 0 10 6"><path fill="%23787878" d="M9.99 1.01A1 1 0 0 0 8.283.3L5 3.586 1.717.3A1 1 0 1 0 .3 1.717L4.293 5.7a1 1 0 0 0 1.414 0L9.7 1.717a1 1 0 0 0 .29-.707z"/></svg>')
        );
        --qs-transition: var(--transition);

        display: block;
        position: relative;
        color: var(--text-color);
        line-height: var(--qs-line-height, 2);
    }

    .text-field {
        display: flex;
        align-items: center;
        width: var(--input-width);
        position: relative;
        margin-top: 6px;
    }

    .text-field-input {
        font-family: inherit;
        padding: 0;
        font-size: var(--font-size);
        height: var(--input-height);
        width: calc(var(--input-width) - var(--button-width));
        border: var(--border-width) solid var(--border-color);
        border-top-left-radius: var(--radius);
        border-bottom-left-radius: var(--radius);
        border-right: none;
        padding-inline-start: 12px;
        box-sizing: border-box;
        -moz-appearance: textfield;
    }

    .text-field-input::-webkit-inner-spin-button,
    .text-field-input::-webkit-outer-spin-button {
        margin: 0;
        -webkit-appearance: none;
    }

    .label {
        font-size: var(--label-font-size);
        color: var(--label-color);
    }

    .picker-button {
        width: var(--button-width);
        height: var(--input-height);
        position: absolute;
        inset-inline-end: 0;
        border: var(--border-width) solid var(--border-color);
        border-top-right-radius: var(--radius);
        border-bottom-right-radius: var(--radius);
        background-color: var(--background-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
    }

    .picker-button-fill {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: var(--picker-fill-icon);
        background-position: center;
        background-repeat: no-repeat;
    }

    .popover {
        position: absolute;
        top: var(--input-height);
        left: 0;
        width: var(--input-width);
        border-radius: var(--radius);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 100;
        margin-top: var(--popover-margin-top, 6px);
        transition: var(--qs-transition);
        opacity: 0;
        box-sizing: border-box;
    }

    .popover.open {
        opacity: 1;
        background: #ffffff;
        border: var(--border-width) solid var(--border-color);
    }

    .popover.closed {
        max-height: 0;
        opacity: 0;
    }

    ::slotted(p) {
        margin: 0;
    }

    .item {
        display: flex;
        align-items: center;
        color: var(--text-color);
        font-size: var(--font-size);
        padding-inline-start: 12px;
        box-sizing: border-box;
    }

    .item.highlighted {
        background-color: var(--background-color);
    }
`;var[qg,Wg,sc,ac,cc,Yg]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Tab"];var ui=class extends N{static get properties(){return{closed:{type:Boolean,reflect:!0},selected:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},maxInput:{type:Number,attribute:"max-input"},options:{type:Array},highlightedIndex:{type:Number},defaultValue:{type:Number,attribute:"default-value",reflect:!0},title:{type:String}}}static get styles(){return ic}constructor(){super(),this.options=[],this.title="",this.closed=!0,this.min=0,this.max=0,this.step=0,this.maxInput=void 0,this.defaultValue=void 0,this.selectedValue=0,this.highlightedIndex=0,this.toggleMenu=this.toggleMenu.bind(this),this.handleClickOutside=this.handleClickOutside.bind(this),this.boundKeydownListener=this.handleKeydown.bind(this),this.addEventListener("keydown",this.boundKeydownListener),window.addEventListener("mousedown",this.handleClickOutside),this.handleKeyupDebounced=ea(this.handleKeyup.bind(this),500)}handleKeyup(){this.handleInput(),this.sendEvent()}handleKeydown(t){switch(t.key){case ac:this.closed||(t.preventDefault(),this.highlightedIndex=(this.highlightedIndex+1)%this.options.length);break;case sc:this.closed||(t.preventDefault(),this.highlightedIndex=(this.highlightedIndex-1+this.options.length)%this.options.length);break;case cc:if(this.closed)this.closePopover(),this.blur();else{let r=this.options[this.highlightedIndex];if(!r)break;this.selectedValue=r,this.handleMenuOption(this.selectedValue),this.toggleMenu()}break}t.composedPath().includes(this)&&t.stopPropagation()}adjustInput(t,r){this.selectedValue=r,t.value=r,this.highlightedIndex=this.options.indexOf(r)}handleInput(){let t=this.shadowRoot.querySelector(".text-field-input"),r=parseInt(t.value);if(!isNaN(r))if(r>0&&r!==this.selectedValue){let n=r;this.maxInput&&r>this.maxInput&&(n=this.maxInput),this.min&&n<this.min&&(n=this.min),this.adjustInput(t,n)}else this.adjustInput(t,this.min||1)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mousedown",this.handleClickOutside),this.removeEventListener("keydown",this.boundKeydownListener)}generateOptionsArray(){let t=[];if(this.step>0)for(let r=this.min;r<=this.max;r+=this.step)t.push(r);return t}update(t){(t.has("min")||t.has("max")||t.has("step")||t.has("defaultValue"))&&(this.options=this.generateOptionsArray(),this.highlightedIndex=this.defaultValue?this.options.indexOf(this.defaultValue):0,this.handleMenuOption(this.defaultValue?this.defaultValue:this.options[0])),super.update(t)}handleClickOutside(t){t.composedPath().includes(this)||this.closePopover()}toggleMenu(){this.closed=!this.closed}handleMouseEnter(t){this.highlightedIndex=t}handleMenuOption(t){t===this.max&&this.shadowRoot.querySelector(".text-field-input")?.focus(),this.selectedValue=t,this.sendEvent(),this.closePopover()}sendEvent(){let t=new CustomEvent(ue,{detail:{option:this.selectedValue},bubbles:!0});this.dispatchEvent(t)}closePopover(){this.closed||this.toggleMenu()}get offerSelect(){return this.querySelector("merch-offer-select")}get popover(){return g` <div class="popover ${this.closed?"closed":"open"}">
            ${this.options.map((t,r)=>g`
                    <div
                        class="item ${r===this.highlightedIndex?"highlighted":""}"
                        @click="${()=>this.handleMenuOption(t)}"
                        @mouseenter="${()=>this.handleMouseEnter(r)}"
                    >
                        ${t===this.max?`${t}+`:t}
                    </div>
                `)}
        </div>`}render(){return g`
            <div class="label">${this.title}</div>
            <div class="text-field">
                <input
                    class="text-field-input"
                    @focus="${this.closePopover}"
                    .value="${this.selectedValue}"
                    type="number"
                    @keydown="${this.handleKeydown}"
                    @keyup="${this.handleKeyupDebounced}"
                />
                <button class="picker-button" @click="${this.toggleMenu}">
                    <div
                        class="picker-button-fill ${this.closed?"open":"closed"}"
                    ></div>
                </button>
                ${this.popover}
            </div>
        `}};customElements.define("merch-quantity-select",ui);var lc=`

  merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
    font-size: var(--consonant-merch-card-heading-xxs-font-size);
    line-height: var(--consonant-merch-card-heading-xxs-line-height);
  }
  
  merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

  merch-card[variant="ccd-suggested"] [slot="price"] em {
      font-size: var(--consonant-merch-card-body-xxs-font-size);
      line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

.spectrum--darkest merch-card[variant="ccd-suggested"] {
  --consonant-merch-card-background-color:rgb(30, 30, 30);
  --consonant-merch-card-heading-xs-color:rgb(239, 239, 239);
  --consonant-merch-card-body-xs-color:rgb(200, 200, 200);
  --consonant-merch-card-border-color:rgb(57, 57, 57);
  --consonant-merch-card-detail-s-color:rgb(162, 162, 162);
  --consonant-merch-card-price-color:rgb(248, 248, 248);
  --merch-color-inline-price-strikethrough:rgb(176, 176, 176);
}

.spectrum--darkest  merch-card[variant="ccd-suggested"]:hover {
  --consonant-merch-card-border-color:rgb(73, 73, 73);
}
`;var mi={backgroundImage:{attribute:"background-image"},badge:!0,ctas:{slot:"cta",size:"M"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"p",slot:"price"},size:[],subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"}},Ht=class extends ${getGlobalCSS(){return lc}get aemFragmentMapping(){return mi}get stripStyle(){return this.card.backgroundImage?`
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir==="ltr"?"left":"right"};
        `:""}renderLayout(){return g` <div style="${this.stripStyle}" class="body">
                <div class="header">
                    <div class="top-section">
                        <slot name="icons"></slot>
                        ${this.badge}
                    </div>
                    <div class="headings">
                        <slot name="detail-s"></slot>
                        <slot name="heading-xs"></slot>
                    </div>
                </div>
                <slot name="body-xs"></slot>
                <div class="footer">
                    <slot name="price"></slot>
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot></slot>`}postCardUpdateHook(t){t.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let t=new Image;t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")}}};p(Ht,"variantStyle",A`
        :host([variant='ccd-suggested']) {
            --consonant-merch-card-background-color: rgb(245, 245, 245);
            --consonant-merch-card-body-xs-color: rgb(75, 75, 75);
            --consonant-merch-card-border-color: rgb(225, 225, 225);
            --consonant-merch-card-detail-s-color: rgb(110, 110, 110);
            --consonant-merch-card-heading-xs-color: rgb(44, 44, 44);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --mod-img-height: 38px;

            box-sizing: border-box;
            width: 100%;
            max-width: 305px;
            min-width: 270px;
            min-height: 205px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
            overflow: hidden;
        }

        :host([variant='ccd-slice']) * {
            overflow: hidden;
        }

        :host([variant='ccd-suggested']:hover) {
            --consonant-merch-card-border-color: #cacaca;
        }

        :host([variant='ccd-suggested']) .body {
            height: auto;
            padding: 20px;
            gap: 0;
        }

        :host([variant='ccd-suggested'].thin-strip) .body {
            padding: 20px 20px 20px 28px;
        }

        :host([variant='ccd-suggested']) .header {
            display: flex;
            flex-flow: wrap;
            place-self: flex-start;
            flex-wrap: nowrap;
        }

        :host([variant='ccd-suggested']) .headings {
            padding-inline-start: var(--consonant-merch-spacing-xxs);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
            place-self: center;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
            font-size: var(--consonant-merch-card-heading-xxs-font-size);
            line-height: var(--consonant-merch-card-heading-xxs-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='detail-m']) {
            line-height: var(--consonant-merch-card-detail-m-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
            color: var(--ccd-gray-700-dark);
            padding-top: 8px;
            flex-grow: 1;
        }

        :host([variant='ccd-suggested'].wide-strip)
            ::slotted([slot='body-xs']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='price']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='price']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xs-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='cta']) {
            display: flex;
            align-items: center;
            min-width: fit-content;
        }

        :host([variant='ccd-suggested']) .footer {
            display: flex;
            justify-content: space-between;
            flex-grow: 0;
            margin-top: 6px;
            align-items: center;
        }

        :host([variant='ccd-suggested']) div[class$='-badge'] {
            position: static;
            border-radius: 4px;
        }

        :host([variant='ccd-suggested']) .top-section {
            align-items: center;
        }
    `);var hc=`

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a.spectrum-Link {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-xxs-line-height);
}

.spectrum--darkest merch-card[variant="ccd-slice"] {
  --consonant-merch-card-background-color:rgb(29, 29, 29);
  --consonant-merch-card-body-s-color:rgb(235, 235, 235);
  --consonant-merch-card-border-color:rgb(48, 48, 48);
  --consonant-merch-card-detail-s-color:rgb(235, 235, 235);
}
`;var pi={backgroundImage:{tag:"div",slot:"image"},badge:!0,ctas:{slot:"footer",size:"S"},description:{tag:"div",slot:"body-s"},mnemonics:{size:"m"},size:["wide"]},Ut=class extends ${getGlobalCSS(){return hc}get aemFragmentMapping(){return pi}renderLayout(){return g` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};p(Ut,"variantStyle",A`
        :host([variant='ccd-slice']) {
            --consonant-merch-card-background-color: rgb(248, 248, 248);
            --consonant-merch-card-border-color: rgb(230, 230, 230);
            --consonant-merch-card-body-s-color: rgb(34, 34, 34);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --mod-img-height: 29px;

            box-sizing: border-box;
            min-width: 290px;
            max-width: 322px;
            width: 100%;
            max-height: 154px;
            height: 154px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) * {
            overflow: hidden;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            min-width: 154px;
            max-width: 171px;
            height: 55px;
            overflow: hidden;
        }

        :host([variant='ccd-slice'][size='wide']) ::slotted([slot='body-s']) {
            max-width: 425px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: 600px;
            max-width: 600px;
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: 15px;
            padding-inline-end: 0;
            height: 154px;
            box-sizing: border-box;
            min-height: 123px;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            flex: 1 0 0;
        }

        :host([variant='ccd-slice'])
            ::slotted([slot='body-s'])
            ::slotted(a:not(.con-button)) {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            font-style: normal;
            font-weight: 400;
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            text-decoration-line: underline;
            color: var(--spectrum-gray-800, var(--merch-color-grey-80));
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: 134px;
            height: 149px;
            overflow: hidden;
            border-radius: 50%;
            padding: 15px;
            align-self: center;
            padding-inline-start: 0;
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) img {
            overflow: hidden;
            border-radius: 50%;
            width: inherit;
            height: inherit;
        }

        :host([variant='ccd-slice']) div[class$='-badge'] {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            position: static;
            border-radius: 4px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            padding: 4px 9px;
        }

        :host([variant='ccd-slice']) .top-section {
            align-items: center;
            gap: 8px;
        }
    `);var dc=`
    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] {
        letter-spacing: normal;
        margin-bottom: 16px;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] a {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="heading-xxxs"] {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: -moz-box;
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        line-clamp: 3;
        -webkit-line-clamp: 3;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price {
        display: inline-block;
        height: var(--consonant-merch-card-detail-xl-line-height);
        line-height: var(--consonant-merch-card-detail-xl-line-height);
        font-style: normal;
        margin-top: 4px;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price.price-strikethrough {
        height: var(--consonant-merch-card-detail-l-line-height);
        line-height: var(--consonant-merch-card-detail-l-line-height);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        text-decoration-thickness: .5px;
        color: var(--ah-gray-500);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-currency-symbol,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-integer,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-decimals-delimiter,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-decimals {
        color: var(--consonant-merch-card-heading-xxxs-color);
        font-size: var(--consonant-merch-card-heading-xs-font-size);
        font-weight: 700;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-recurrence {
        display: inline-block;
        width: 21px;
        text-align: end;
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 400;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] a {
        color: var(--consonant-merch-card-body-xxs-color);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        font-style: normal;
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        text-decoration: underline;
        text-decoration-thickness: .75px;
        text-underline-offset: 1px;
        width: fit-content;
        margin-top: 4px;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 700;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="cta"] {
        align-self: end;
        gap: 8px;
        display: flex;
        padding-top: 24px;
        flex-wrap: wrap;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="image"] {
      display: none;
    }
    
    merch-card[variant="ah-try-buy-widget"][size='single'] [slot="image"] {
      display: flex;
      width: 199px;
      overflow: hidden;
      height: 100%;
      border-radius: 16px;
      order: 1;
    }

    merch-card[variant="ah-try-buy-widget"][size='single'] [slot="image"] img {
      width: 100%;
      object-fit: cover;
      border-radius: 16px;
      overflow: hidden;
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"][background-color='gray'],
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"][background-color='gray'] {
      --merch-card-ah-try-buy-widget-gray-background: rgb(27, 27, 27);
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"],
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"] {
      --consonant-merch-card-background-color:rgb(17, 17, 17);
      --consonant-merch-card-heading-xxxs-color:rgb(242, 242, 242);
      --consonant-merch-card-body-xxs-color:rgb(219, 219, 219);
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"]:hover,
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"]:hover {
      --consonant-merch-card-border-color:rgb(73, 73, 73);
    }
`;var fi={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40,withSuffix:!0},description:{tag:"div",slot:"body-xxs",maxCount:200,withSuffix:!1},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},backgroundColor:{attribute:"background-color"},borderColor:{attribute:"border-color"},allowedColors:{gray:"--spectrum-gray-100"},size:["single","double","triple"]},it=class extends ${getGlobalCSS(){return dc}get aemFragmentMapping(){return fi}renderLayout(){return g`
      <div class="content">
        <div class="header">
    		    <slot name="icons"></slot>
            <slot name="heading-xxxs"></slot>
        </div>
        <slot name="body-xxs"></slot>
        <div class="price">
            <slot name="price"></slot>
        </div>
        <div class="footer">
          <slot name="cta"></slot>
        </div>
      </div>
      <slot name="image"></slot>
      <slot></slot>
    `}};p(it,"variantStyle",A`
    :host([variant='ah-try-buy-widget']) {
        --merch-card-ah-try-buy-widget-min-width: 156px;
        --merch-card-ah-try-buy-widget-content-min-width: 132px;
        --merch-card-ah-try-buy-widget-header-min-height: 36px;
        --merch-card-ah-try-buy-widget-gray-background: rgba(248, 248, 248);
        --merch-card-ah-try-buy-widget-text-color: rgba(19, 19, 19);
        --merch-card-ah-try-buy-widget-price-line-height: 17px;
        --merch-card-ah-try-buy-widget-outline: transparent;
        --merch-card-custom-border-width: 1px;
        height: 100%;
        min-width: var(--merch-card-ah-try-buy-widget-min-width);
        background-color: var(--merch-card-custom-background-color, var(--consonant-merch-card-background-color));
        color: var(--consonant-merch-card-heading-xxxs-color);
        border-radius: 10px;
        border: 1px solid var(--merch-card-custom-border-color, transparent);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 11px !important;
        gap: 16px;
        justify-content: space-between;
        box-sizing: border-box !important;
    }

    :host([variant='ah-try-buy-widget'][size='single']) {
        flex-direction: row;
    }

    :host([variant='ah-try-buy-widget'][size='single']) ::slotted(div[slot="cta"])  {
        display: flex;
        flex-grow: 0;
    }

    :host([variant='ah-try-buy-widget']) .content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        min-width: var(--merch-card-ah-try-buy-widget-content-min-width);
        flex-basis: var(--merch-card-ah-try-buy-widget-content-min-width);
        flex-grow: 1;
    }

    :host([variant='ah-try-buy-widget']) .header {
        display: flex;
        min-height: var(--merch-card-ah-try-buy-widget-header-min-height);
        flex-direction: row;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
        margin-bottom: 4px;
    }

    :host([variant='ah-try-buy-widget']) .price {
        display: flex;
        flex-grow: 1;
    }

    :host([variant='ah-try-buy-widget']) ::slotted([slot='price']) {
        margin-left: var(--spacing-xs);
        display: flex;
        flex-direction: column;
        justify-content: end;
        font-size: var(--consonant-merch-card-detail-s-font-size);
        font-style: italic;
        line-height: var(--merch-card-ah-try-buy-widget-price-line-height);
        color: var(--consonant-merch-card-heading-xxxs-color);
    }

    :host([variant='ah-try-buy-widget']) .footer {
      display: flex;
      width: fit-content;
      flex-wrap: wrap;
      gap: 8px;
      flex-direction: row;
    }
  `);customElements.define("ah-try-buy-widget",it);dt({sampleRate:1});X("ccd-suggested",Ht,mi,Ht.variantStyle);X("ccd-slice",Ut,pi,Ut.variantStyle);X("ah-try-buy-widget",it,fi,it.variantStyle);
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
