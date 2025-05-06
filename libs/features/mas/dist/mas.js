var Ri=Object.defineProperty;var Oi=t=>{throw TypeError(t)};var Mc=(t,e,r)=>e in t?Ri(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var Nc=(t,e)=>{for(var r in e)Ri(t,r,{get:e[r],enumerable:!0})};var m=(t,e,r)=>Mc(t,typeof e!="symbol"?e+"":e,r),Ln=(t,e,r)=>e.has(t)||Oi("Cannot "+r);var b=(t,e,r)=>(Ln(t,e,"read from private field"),r?r.call(t):e.get(t)),P=(t,e,r)=>e.has(t)?Oi("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,r),k=(t,e,r,n)=>(Ln(t,e,"write to private field"),n?n.call(t,r):e.set(t,r),r),le=(t,e,r)=>(Ln(t,e,"access private method"),r);(function(){let r={clientId:"",endpoint:"https://www.adobe.com/lana/ll",endpointStage:"https://www.stage.adobe.com/lana/ll",errorType:"e",sampleRate:1,tags:"",implicitSampleRate:1,useProd:!0,isProdDomain:!1},n=new Set(["d","debug","i","info","w","warn","e","error","c","critical"]),o=window;function i(){let{host:d}=window.location;return d.substring(d.length-10)===".adobe.com"&&d.substring(d.length-15)!==".corp.adobe.com"&&d.substring(d.length-16)!==".stage.adobe.com"}function a(d,p){d||(d={}),p||(p={});function u(g){return d[g]!==void 0?d[g]:p[g]!==void 0?p[g]:r[g]}return Object.keys(r).reduce((g,f)=>(g[f]=u(f),g),{})}function s(){return o.location.search.toLowerCase().indexOf("lanadebug")!==-1}function c(){return o.location.host.toLowerCase().indexOf("localhost")!==-1}function l(d,p){d=d&&d.stack?d.stack:d||"",d.length>2e3&&(d=`${d.slice(0,2e3)}<trunc>`);let u=a(p,o.lana.options);if(!u.clientId){console.warn("LANA ClientID is not set in options.");return}let g;if(p&&p.severity!==void 0)if(n.has(p.severity))g=p.severity;else{let O=s()||o.lana.debug?"d":"i";console.warn(`LANA: Invalid severity '${p.severity}'. Defaulting to '${O}'.`),g=O}else o.lana.debug&&(g="d");let w=parseInt(new URL(window.location).searchParams.get("lana-sample"),10)||(u.errorType==="i"?u.implicitSampleRate:u.sampleRate);if(!o.lana.debug&&!o.lana.localhost&&w<=Math.random()*100)return;let _=i()||u.isProdDomain,L=!_||!u.useProd?u.endpointStage:u.endpoint,y=[`m=${encodeURIComponent(d)}`,`c=${encodeURI(u.clientId)}`,`s=${w}`,`t=${encodeURI(u.errorType)}`];if(g&&y.push(`r=${encodeURI(g)}`),u.tags&&y.push(`tags=${encodeURI(u.tags)}`),(!_||o.lana.debug||o.lana.localhost)&&console.log("LANA Msg: ",d,`
Opts:`,u),!o.lana.localhost||o.lana.debug){let C=new XMLHttpRequest;return o.lana.debug&&(y.push("d"),C.addEventListener("load",()=>{console.log("LANA response:",C.responseText)})),C.open("GET",`${L}?${y.join("&")}`),C.send(),C}}function h(d){l(d.reason||d.error||d.message,{errorType:"i"})}o.lana={debug:!1,log:l,options:a(o.lana&&o.lana.options)},s()&&(o.lana.debug=!0),c()&&(o.lana.localhost=!0),o.addEventListener("error",h),o.addEventListener("unhandledrejection",h)})();var Zn={};Nc(Zn,{CLASS_NAME_FAILED:()=>Hn,CLASS_NAME_HIDDEN:()=>Hc,CLASS_NAME_PENDING:()=>Un,CLASS_NAME_RESOLVED:()=>Dn,CheckoutWorkflow:()=>se,CheckoutWorkflowStep:()=>j,Commitment:()=>Ue,ERROR_MESSAGE_BAD_REQUEST:()=>Bn,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>jc,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>zn,EVENT_AEM_ERROR:()=>ze,EVENT_AEM_LOAD:()=>Be,EVENT_MAS_ERROR:()=>In,EVENT_MAS_READY:()=>Nn,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>$n,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>Gc,EVENT_MERCH_CARD_COLLECTION_SORT:()=>Fc,EVENT_MERCH_CARD_READY:()=>On,EVENT_MERCH_OFFER_READY:()=>pt,EVENT_MERCH_OFFER_SELECT_READY:()=>qt,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>pe,EVENT_MERCH_SEARCH_CHANGE:()=>zc,EVENT_MERCH_SIDENAV_SELECT:()=>Vc,EVENT_MERCH_STOCK_CHANGE:()=>Dc,EVENT_MERCH_STORAGE_CHANGE:()=>Bc,EVENT_OFFER_SELECTED:()=>Mn,EVENT_TYPE_FAILED:()=>Fn,EVENT_TYPE_READY:()=>$r,EVENT_TYPE_RESOLVED:()=>ut,Env:()=>fe,HEADER_X_REQUEST_ID:()=>Yn,LOG_NAMESPACE:()=>Gn,Landscape:()=>Ce,MARK_DURATION_SUFFIX:()=>Wt,MARK_START_SUFFIX:()=>Pe,MODAL_TYPE_3_IN_1:()=>ce,NAMESPACE:()=>Ic,PARAM_AOS_API_KEY:()=>qc,PARAM_ENV:()=>Vn,PARAM_LANDSCAPE:()=>jn,PARAM_WCS_API_KEY:()=>Wc,PROVIDER_ENVIRONMENT:()=>Xn,SELECTOR_MAS_CHECKOUT_LINK:()=>De,SELECTOR_MAS_ELEMENT:()=>jt,SELECTOR_MAS_INLINE_PRICE:()=>ee,SELECTOR_MAS_SP_BUTTON:()=>Rn,STATE_FAILED:()=>ue,STATE_PENDING:()=>Te,STATE_RESOLVED:()=>me,TAG_NAME_SERVICE:()=>Uc,TEMPLATE_PRICE:()=>Yc,TEMPLATE_PRICE_ANNUAL:()=>Kc,TEMPLATE_PRICE_LEGAL:()=>Kn,TEMPLATE_PRICE_STRIKETHROUGH:()=>Xc,Term:()=>oe,WCS_PROD_URL:()=>qn,WCS_STAGE_URL:()=>Wn});var Ue=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),oe=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),Ic="merch",Hc="hidden",$r="wcms:commerce:ready",Uc="mas-commerce-service",ee='span[is="inline-price"][data-wcs-osi]',De='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',Rn="sp-button[data-wcs-osi]",jt=`${ee},${De}`,pt="merch-offer:ready",qt="merch-offer-select:ready",On="merch-card:ready",$n="merch-card:action-menu-toggle",Mn="merch-offer:selected",Dc="merch-stock:change",Bc="merch-storage:change",pe="merch-quantity-selector:change",zc="merch-search:change",Fc="merch-card-collection:sort",Gc="merch-card-collection:showmore",Vc="merch-sidenav:select",Be="aem:load",ze="aem:error",Nn="mas:ready",In="mas:error",Hn="placeholder-failed",Un="placeholder-pending",Dn="placeholder-resolved",Bn="Bad WCS request",zn="Commerce offer not found",jc="Literals URL not provided",Fn="mas:failed",ut="mas:resolved",Gn="mas/commerce",Vn="commerce.env",jn="commerce.landscape",qc="commerce.aosKey",Wc="commerce.wcsKey",qn="https://www.adobe.com/web_commerce_artifact",Wn="https://www.stage.adobe.com/web_commerce_artifact_stage",ue="failed",Te="pending",me="resolved",Ce={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},Yn="X-Request-Id",j=Object.freeze({CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),se=Object.freeze({V2:"UCv2",V3:"UCv3"}),fe=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),Xn={PRODUCTION:"PRODUCTION"},ce={TWP:"twp",D2P:"d2p",CRM:"crm"},Pe=":start",Wt=":duration",Yc="price",Xc="price-strikethrough",Kc="annual",Kn="legal";var $i="tacocat.js";var Qn=(t,e)=>String(t??"").toLowerCase()==String(e??"").toLowerCase(),Mi=t=>`${t??""}`.replace(/[&<>'"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[e]??e)??"";function I(t,e={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let i;if(n&&i==null){let a=new URLSearchParams(window.location.search),s=mt(n)?n:t;i=a.get(s)}if(o&&i==null){let a=mt(o)?o:t;i=window.sessionStorage.getItem(a)??window.localStorage.getItem(a)}if(r&&i==null){let a=Qc(mt(r)?r:t);i=document.documentElement.querySelector(`meta[name="${a}"]`)?.content}return i??e[t]}var Zc=t=>typeof t=="boolean",Mr=t=>typeof t=="function",Nr=t=>typeof t=="number",Ni=t=>t!=null&&typeof t=="object";var mt=t=>typeof t=="string",Ii=t=>mt(t)&&t,Yt=t=>Nr(t)&&Number.isFinite(t)&&t>0;function Xt(t,e=r=>r==null||r===""){return t!=null&&Object.entries(t).forEach(([r,n])=>{e(n)&&delete t[r]}),t}function E(t,e){if(Zc(t))return t;let r=String(t);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:e}function Fe(t,e,r){let n=Object.values(e);return n.find(o=>Qn(o,t))??r??n[0]}function Qc(t=""){return String(t).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(e,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function Hi(t,e=1){return Nr(t)||(t=Number.parseInt(t,10)),!Number.isNaN(t)&&t>0&&Number.isFinite(t)?t:e}var Jc=Date.now(),Jn=()=>`(+${Date.now()-Jc}ms)`,Ir=new Set,el=E(I("tacocat.debug",{},{metadata:!1}),!1);function Ui(t){let e=`[${$i}/${t}]`,r=(a,s,...c)=>a?!0:(o(s,...c),!1),n=el?(a,...s)=>{console.debug(`${e} ${a}`,...s,Jn())}:()=>{},o=(a,...s)=>{let c=`${e} ${a}`;Ir.forEach(([l])=>l(c,...s))};return{assert:r,debug:n,error:o,warn:(a,...s)=>{let c=`${e} ${a}`;Ir.forEach(([,l])=>l(c,...s))}}}function tl(t,e){let r=[t,e];return Ir.add(r),()=>{Ir.delete(r)}}tl((t,...e)=>{console.error(t,...e,Jn())},(t,...e)=>{console.warn(t,...e,Jn())});var rl="no promo",Di="promo-tag",nl="yellow",ol="neutral",il=(t,e,r)=>{let n=i=>i||rl,o=r?` (was "${n(e)}")`:"";return`${n(t)}${o}`},al="cancel-context",Hr=(t,e)=>{let r=t===al,n=!r&&t?.length>0,o=(n||r)&&(e&&e!=t||!e&&!r),i=o&&n||!o&&!!e,a=i?t||e:void 0;return{effectivePromoCode:a,overridenPromoCode:t,className:i?Di:`${Di} no-promo`,text:il(a,e,o),variant:i?nl:ol,isOverriden:o}};var eo;(function(t){t.BASE="BASE",t.TRIAL="TRIAL",t.PROMOTION="PROMOTION"})(eo||(eo={}));var te;(function(t){t.MONTH="MONTH",t.YEAR="YEAR",t.TWO_YEARS="TWO_YEARS",t.THREE_YEARS="THREE_YEARS",t.PERPETUAL="PERPETUAL",t.TERM_LICENSE="TERM_LICENSE",t.ACCESS_PASS="ACCESS_PASS",t.THREE_MONTHS="THREE_MONTHS",t.SIX_MONTHS="SIX_MONTHS"})(te||(te={}));var ie;(function(t){t.ANNUAL="ANNUAL",t.MONTHLY="MONTHLY",t.TWO_YEARS="TWO_YEARS",t.THREE_YEARS="THREE_YEARS",t.P1D="P1D",t.P1Y="P1Y",t.P3Y="P3Y",t.P10Y="P10Y",t.P15Y="P15Y",t.P3D="P3D",t.P7D="P7D",t.P30D="P30D",t.HALF_YEARLY="HALF_YEARLY",t.QUARTERLY="QUARTERLY"})(ie||(ie={}));var to;(function(t){t.INDIVIDUAL="INDIVIDUAL",t.TEAM="TEAM",t.ENTERPRISE="ENTERPRISE"})(to||(to={}));var ro;(function(t){t.COM="COM",t.EDU="EDU",t.GOV="GOV"})(ro||(ro={}));var no;(function(t){t.DIRECT="DIRECT",t.INDIRECT="INDIRECT"})(no||(no={}));var oo;(function(t){t.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",t.ETLA="ETLA",t.RETAIL="RETAIL",t.VIP="VIP",t.VIPMP="VIPMP",t.FREE="FREE"})(oo||(oo={}));var io="ABM",ao="PUF",so="M2M",co="PERPETUAL",lo="P3Y",sl="TAX_INCLUSIVE_DETAILS",cl="TAX_EXCLUSIVE",Bi={ABM:io,PUF:ao,M2M:so,PERPETUAL:co,P3Y:lo},kd={[io]:{commitment:te.YEAR,term:ie.MONTHLY},[ao]:{commitment:te.YEAR,term:ie.ANNUAL},[so]:{commitment:te.MONTH,term:ie.MONTHLY},[co]:{commitment:te.PERPETUAL,term:void 0},[lo]:{commitment:te.THREE_MONTHS,term:ie.P3Y}},zi="Value is not an offer",Ur=t=>{if(typeof t!="object")return zi;let{commitment:e,term:r}=t,n=ll(e,r);return{...t,planType:n}};var ll=(t,e)=>{switch(t){case void 0:return zi;case"":return"";case te.YEAR:return e===ie.MONTHLY?io:e===ie.ANNUAL?ao:"";case te.MONTH:return e===ie.MONTHLY?so:"";case te.PERPETUAL:return co;case te.TERM_LICENSE:return e===ie.P3Y?lo:"";default:return""}};function Fi(t){let{priceDetails:e}=t,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:i,taxDisplay:a}=e;if(a!==sl)return t;let s={...t,priceDetails:{...e,price:o??r,priceWithoutDiscount:i??n,taxDisplay:cl}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var hl="mas-commerce-service";function Kt(t,{country:e,forceTaxExclusive:r,perpetual:n}){let o;if(t.length<2)o=t;else{let i=e==="GB"||n?"EN":"MULT",[a,s]=t;o=[a.language===i?a:s]}return r&&(o=o.map(Fi)),o}var Dr=t=>window.setTimeout(t);function ft(t,e=1){if(t==null)return[e];let r=(Array.isArray(t)?t:String(t).split(",")).map(Hi).filter(Yt);return r.length||(r=[e]),r}function Br(t){return t==null?[]:(Array.isArray(t)?t:String(t).split(",")).filter(Ii)}function W(){return document.getElementsByTagName(hl)?.[0]}var Ge={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Gi=1e3;function dl(t){return t instanceof Error||typeof t?.originatingRequest=="string"}function Vi(t){if(t==null)return;let e=typeof t;if(e==="function")return t.name?`function ${t.name}`:"function";if(e==="object"){if(t instanceof Error)return t.message;if(typeof t.originatingRequest=="string"){let{message:n,originatingRequest:o,status:i}=t;return[n,i,o].filter(Boolean).join(" ")}let r=t[Symbol.toStringTag]??Object.getPrototypeOf(t).constructor.name;if(!Ge.serializableTypes.includes(r))return r}return t}function pl(t,e){if(!Ge.ignoredProperties.includes(t))return Vi(e)}var ho={append(t){if(t.level!=="error")return;let{message:e,params:r}=t,n=[],o=[],i=e;r.forEach(l=>{l!=null&&(dl(l)?n:o).push(l)}),n.length&&(i+=" "+n.map(Vi).join(" "));let{pathname:a,search:s}=window.location,c=`${Ge.delimiter}page=${a}${s}`;c.length>Gi&&(c=`${c.slice(0,Gi)}<trunc>`),i+=c,o.length&&(i+=`${Ge.delimiter}facts=`,i+=JSON.stringify(o,pl)),window.lana?.log(i,Ge)}};function gt(t){Object.assign(Ge,Object.fromEntries(Object.entries(t).filter(([e,r])=>e in Ge&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var ji={LOCAL:"local",PROD:"prod",STAGE:"stage"},po={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},uo=new Set,mo=new Set,qi=new Map,Wi={append({level:t,message:e,params:r,timestamp:n,source:o}){console[t](`${n}ms [${o}] %c${e}`,"font-weight: bold;",...r)}},Yi={filter:({level:t})=>t!==po.DEBUG},ul={filter:()=>!1};function ml(t,e,r,n,o){return{level:t,message:e,namespace:r,get params(){return n.length===1&&Mr(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:o,timestamp:performance.now().toFixed(3)}}function fl(t){[...mo].every(e=>e(t))&&uo.forEach(e=>e(t))}function Xi(t){let e=(qi.get(t)??0)+1;qi.set(t,e);let r=`${t} #${e}`,n={id:r,namespace:t,module:o=>Xi(`${n.namespace}/${o}`),updateConfig:gt};return Object.values(po).forEach(o=>{n[o]=(i,...a)=>fl(ml(o,i,t,a,r))}),Object.seal(n)}function zr(...t){t.forEach(e=>{let{append:r,filter:n}=e;Mr(n)&&mo.add(n),Mr(r)&&uo.add(r)})}function gl(t={}){let{name:e}=t,r=E(I("commerce.debug",{search:!0,storage:!0}),e===ji.LOCAL);return zr(r?Wi:Yi),e===ji.PROD&&zr(ho),re}function xl(){uo.clear(),mo.clear()}var re={...Xi(Gn),Level:po,Plugins:{consoleAppender:Wi,debugFilter:Yi,quietFilter:ul,lanaAppender:ho},init:gl,reset:xl,use:zr};var ge=class t extends Error{constructor(e,r,n){if(super(e,{cause:n}),this.name="MasError",r.response){let o=r.response.headers?.get(Yn);o&&(r.requestId=o),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,t)}toString(){let e=Object.entries(this.context||{}).map(([n,o])=>`${n}: ${JSON.stringify(o)}`).join(", "),r=`${this.name}: ${this.message}`;return e&&(r+=` (${e})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var bl={[ue]:Hn,[Te]:Un,[me]:Dn},vl={[ue]:Fn,[me]:ut},Zt,xt=class{constructor(e){P(this,Zt);m(this,"changes",new Map);m(this,"connected",!1);m(this,"error");m(this,"log");m(this,"options");m(this,"promises",[]);m(this,"state",Te);m(this,"timer",null);m(this,"value");m(this,"version",0);m(this,"wrapperElement");this.wrapperElement=e,this.log=re.module("mas-element")}update(){[ue,Te,me].forEach(e=>{this.wrapperElement.classList.toggle(bl[e],e===this.state)})}notify(){(this.state===me||this.state===ue)&&(this.state===me?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===ue&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let e=this.error;this.error instanceof ge&&(e={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(vl[this.state],{bubbles:!0,detail:e}))}attributeChangedCallback(e,r,n){this.changes.set(e,n),this.requestUpdate()}connectedCallback(){k(this,Zt,W()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:e,promises:r,state:n}=this;return me===n?Promise.resolve(this.wrapperElement):ue===n?Promise.reject(e):new Promise((o,i)=>{r.push({resolve:o,reject:i})})}toggleResolved(e,r,n){return e!==this.version?!1:(n!==void 0&&(this.options=n),this.state=me,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Dr(()=>this.notify()),!0)}toggleFailed(e,r,n){if(e!==this.version)return!1;n!==void 0&&(this.options=n),this.error=r,this.state=ue,this.update();let o=this.wrapperElement.getAttribute("is");return this.log?.error(`${o}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...b(this,Zt)?.duration}),Dr(()=>this.notify()),!0}togglePending(e){return this.version++,e&&(this.options=e),this.state=Te,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(e=!1){if(!this.wrapperElement.isConnected||!W()||this.timer)return;let{error:r,options:n,state:o,value:i,version:a}=this;this.state=Te,this.timer=Dr(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||e)try{await this.wrapperElement.render?.()===!1&&this.state===Te&&this.version===a&&(this.state=o,this.error=r,this.value=i,this.update(),this.notify())}catch(c){this.toggleFailed(this.version,c,n)}})}};Zt=new WeakMap;function Ki(t={}){return Object.entries(t).forEach(([e,r])=>{(r==null||r===""||r?.length===0)&&delete t[e]}),t}function Fr(t,e={}){let{tag:r,is:n}=t,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,Ki(e)),o}function Gr(t,e={}){return t instanceof HTMLElement?(Object.assign(t.dataset,Ki(e)),t):null}var Zi="download",Qi="upgrade";function Vr(t,e={},r=""){let n=W();if(!n)return null;let{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:d,quantity:p,wcsOsi:u,extraOptions:g,analyticsId:f}=n.collectCheckoutOptions(e),w=Fr(t,{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:d,quantity:p,wcsOsi:u,extraOptions:g,analyticsId:f});return r&&(w.innerHTML=`<span style="pointer-events: none;">${r}</span>`),w}function jr(t){return class extends t{constructor(){super(...arguments);m(this,"checkoutActionHandler");m(this,"masElement",new xt(this))}attributeChangedCallback(n,o,i){this.masElement.attributeChangedCallback(n,o,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isOpen3in1Modal(){let n=document.querySelector("meta[name=mas-ff-3in1]");return Object.values(ce).includes(this.getAttribute("data-modal"))&&(!n||n.content!=="off")}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){let o=W();if(!o)return!1;this.dataset.imsCountry||o.imsCountryPromise.then(d=>{d&&(this.dataset.imsCountry=d)}),n.imsCountry=null;let i=o.collectCheckoutOptions(n,this);if(!i.wcsOsi.length)return!1;let a;try{a=JSON.parse(i.extraOptions??"{}")}catch(d){this.masElement.log?.error("cannot parse exta checkout options",d)}let s=this.masElement.togglePending(i);this.setCheckoutUrl("");let c=o.resolveOfferSelectors(i),l=await Promise.all(c);l=l.map(d=>Kt(d,i)),i.country=this.dataset.imsCountry||i.country;let h=await o.buildCheckoutAction?.(l.flat(),{...a,...i},this);return this.renderOffers(l.flat(),i,{},h,s)}renderOffers(n,o,i={},a=void 0,s=void 0){let c=W();if(!c)return!1;if(o={...JSON.parse(this.dataset.extraOptions??"null"),...o,...i},s??(s=this.masElement.togglePending(o)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),a){this.classList.remove(Zi,Qi),this.masElement.toggleResolved(s,n,o);let{url:h,text:d,className:p,handler:u}=a;h&&this.setCheckoutUrl(h),d&&(this.firstElementChild.innerHTML=d),p&&this.classList.add(...p.split(" ")),u&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=u.bind(this))}if(n.length){if(this.masElement.toggleResolved(s,n,o)){if(!this.classList.contains(Zi)&&!this.classList.contains(Qi)){let h=c.buildCheckoutURL(n,o);this.setCheckoutUrl(o.modal==="true"?"#":h)}return!0}}else{let h=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,h,o))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let o=W();if(!o)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:d,promotionCode:p,quantity:u,wcsOsi:g}=o.collectCheckoutOptions(n);return Gr(this,{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:d,promotionCode:p,quantity:u,wcsOsi:g}),!0}}}var Qt=class Qt extends jr(HTMLAnchorElement){static createCheckoutLink(e={},r=""){return Vr(Qt,e,r)}setCheckoutUrl(e){this.setAttribute("href",e)}get isCheckoutLink(){return!0}clickHandler(e){if(this.checkoutActionHandler){this.checkoutActionHandler?.(e);return}}};m(Qt,"is","checkout-link"),m(Qt,"tag","a");var xe=Qt;window.customElements.get(xe.is)||window.customElements.define(xe.is,xe,{extends:xe.tag});var yl="p_draft_landscape",El="/store/",Al=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]),fo=new Set(["af","ai","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),wl=["env","workflowStep","clientId","country"],Ji=t=>Al.get(t)??t;function go(t,e,r){for(let[n,o]of Object.entries(t)){let i=Ji(n);o!=null&&r.has(i)&&e.set(i,o)}}function _l(t){switch(t){case Xn.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Sl(t,e){for(let r in t){let n=t[r];for(let[o,i]of Object.entries(n)){if(i==null)continue;let a=Ji(o);e.set(`items[${r}][${a}]`,i)}}}function Tl(t,e,r,n){return!Object.values(ce).includes(e)||!t?.searchParams||!r||!n||(t.searchParams.set("rtc","t"),t.searchParams.set("lo","sl"),t.searchParams.get("cli")!=="doc_cloud"&&t.searchParams.set("cli",e===ce.CRM?"creative":"mini_plans"),e===ce.CRM?t.searchParams.set("af","uc_segmentation_hide_tabs,uc_new_user_iframe,uc_new_system_close"):(e===ce.TWP||e===ce.D2P)&&(t.searchParams.set("af","uc_new_user_iframe,uc_new_system_close"),r==="INDIVIDUAL"&&n==="EDU"&&t.searchParams.set("ms","e"),r==="TEAM"&&n==="COM"&&t.searchParams.set("cs","t"))),t}function ea(t){Cl(t);let{env:e,items:r,workflowStep:n,ms:o,marketSegment:i,customerSegment:a,ot:s,offerType:c,pa:l,productArrangementCode:h,landscape:d,modal:p,...u}=t,g={marketSegment:i??o,offerType:c??s,productArrangementCode:h??l},f=new URL(_l(e));return f.pathname=`${El}${n}`,n!==j.SEGMENTATION&&n!==j.CHANGE_PLAN_TEAM_PLANS&&Sl(r,f.searchParams),n===j.SEGMENTATION&&go(g,f.searchParams,fo),go(u,f.searchParams,fo),d===Ce.DRAFT&&go({af:yl},f.searchParams,fo),f=Tl(f,p,a,i),f.toString()}function Cl(t){for(let e of wl)if(!t[e])throw new Error('Argument "checkoutData" is not valid, missing: '+e);if(t.workflowStep!==j.SEGMENTATION&&t.workflowStep!==j.CHANGE_PLAN_TEAM_PLANS&&!t.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var R=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:se.V3,checkoutWorkflowStep:j.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:fe.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Ce.PUBLISHED});function ta({providers:t,settings:e}){function r(i,a){let{checkoutClientId:s,checkoutWorkflow:c,checkoutWorkflowStep:l,country:h,language:d,promotionCode:p,quantity:u}=e,{checkoutMarketSegment:g,checkoutWorkflow:f=c,checkoutWorkflowStep:w=l,imsCountry:_,country:L=_??h,language:y=d,quantity:C=u,entitlement:O,upgrade:H,modal:X,perpetual:V,promotionCode:Q=p,wcsOsi:J,extraOptions:ne,...ct}=Object.assign({},a?.dataset??{},i??{}),Se=Fe(f,se,R.checkoutWorkflow),He=j.CHECKOUT;Se===se.V3&&(He=Fe(w,j,R.checkoutWorkflowStep));let lt=Xt({...ct,extraOptions:ne,checkoutClientId:s,checkoutMarketSegment:g,country:L,quantity:ft(C,R.quantity),checkoutWorkflow:Se,checkoutWorkflowStep:He,language:y,entitlement:E(O),upgrade:E(H),modal:X,perpetual:E(V),promotionCode:Hr(Q).effectivePromoCode,wcsOsi:Br(J)});if(a)for(let Vt of t.checkout)Vt(a,lt);return lt}function n(i,a){if(!Array.isArray(i)||!i.length||!a)return"";let{env:s,landscape:c}=e,{checkoutClientId:l,checkoutMarketSegment:h,checkoutWorkflow:d,checkoutWorkflowStep:p,country:u,promotionCode:g,quantity:f,...w}=r(a),_=window.frameElement||Object.values(ce).includes(a.modal)?"if":"fp",L={checkoutPromoCode:g,clientId:l,context:_,country:u,env:s,items:[],marketSegment:h,workflowStep:p,landscape:c,...w};if(i.length===1){let[{offerId:y,offerType:C,productArrangementCode:O}]=i,{marketSegments:[H],customerSegment:X}=i[0];Object.assign(L,{marketSegment:H,customerSegment:X,offerType:C,productArrangementCode:O}),L.items.push(f[0]===1?{id:y}:{id:y,quantity:f[0]})}else L.items.push(...i.map(({offerId:y},C)=>({id:y,quantity:f[C]??R.quantity})));return ea(L)}let{createCheckoutLink:o}=xe;return{CheckoutLink:xe,CheckoutWorkflow:se,CheckoutWorkflowStep:j,buildCheckoutURL:n,collectCheckoutOptions:r,createCheckoutLink:o}}function Pl({interval:t=200,maxAttempts:e=25}={}){let r=re.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let o=0;function i(){window.adobeIMS?.initialized?n():++o>e?(r.debug("Timeout"),n()):setTimeout(i,t)}i()})}function kl(t){return t.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function Ll(t){let e=re.module("ims");return t.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(e.debug("Got user country:",n),n),n=>{e.error("Unable to get user country:",n)}):null)}function ra({}){let t=Pl(),e=kl(t),r=Ll(e);return{imsReadyPromise:t,imsSignedInPromise:e,imsCountryPromise:r}}var na=window.masPriceLiterals;function oa(t){if(Array.isArray(na)){let e=n=>na.find(o=>Qn(o.lang,n)),r=e(t.language)??e(R.language);if(r)return Object.freeze(r)}return{}}var xo=function(t,e){return xo=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},xo(t,e)};function Jt(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");xo(t,e);function r(){this.constructor=t}t.prototype=e===null?Object.create(e):(r.prototype=e.prototype,new r)}var S=function(){return S=Object.assign||function(e){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e},S.apply(this,arguments)};function qr(t,e,r){if(r||arguments.length===2)for(var n=0,o=e.length,i;n<o;n++)(i||!(n in e))&&(i||(i=Array.prototype.slice.call(e,0,n)),i[n]=e[n]);return t.concat(i||Array.prototype.slice.call(e))}var A;(function(t){t[t.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",t[t.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",t[t.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",t[t.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",t[t.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",t[t.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",t[t.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",t[t.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",t[t.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",t[t.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",t[t.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",t[t.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",t[t.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",t[t.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",t[t.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",t[t.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",t[t.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",t[t.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",t[t.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",t[t.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",t[t.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",t[t.INVALID_TAG=23]="INVALID_TAG",t[t.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",t[t.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",t[t.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(A||(A={}));var M;(function(t){t[t.literal=0]="literal",t[t.argument=1]="argument",t[t.number=2]="number",t[t.date=3]="date",t[t.time=4]="time",t[t.select=5]="select",t[t.plural=6]="plural",t[t.pound=7]="pound",t[t.tag=8]="tag"})(M||(M={}));var Ve;(function(t){t[t.number=0]="number",t[t.dateTime=1]="dateTime"})(Ve||(Ve={}));function bo(t){return t.type===M.literal}function ia(t){return t.type===M.argument}function Wr(t){return t.type===M.number}function Yr(t){return t.type===M.date}function Xr(t){return t.type===M.time}function Kr(t){return t.type===M.select}function Zr(t){return t.type===M.plural}function aa(t){return t.type===M.pound}function Qr(t){return t.type===M.tag}function Jr(t){return!!(t&&typeof t=="object"&&t.type===Ve.number)}function er(t){return!!(t&&typeof t=="object"&&t.type===Ve.dateTime)}var vo=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Rl=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function sa(t){var e={};return t.replace(Rl,function(r){var n=r.length;switch(r[0]){case"G":e.era=n===4?"long":n===5?"narrow":"short";break;case"y":e.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":e.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":e.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":e.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");e.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");e.weekday=["short","long","narrow","short"][n-4];break;case"a":e.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":e.hourCycle="h12",e.hour=["numeric","2-digit"][n-1];break;case"H":e.hourCycle="h23",e.hour=["numeric","2-digit"][n-1];break;case"K":e.hourCycle="h11",e.hour=["numeric","2-digit"][n-1];break;case"k":e.hourCycle="h24",e.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":e.minute=["numeric","2-digit"][n-1];break;case"s":e.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":e.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),e}var ca=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function pa(t){if(t.length===0)throw new Error("Number skeleton cannot be empty");for(var e=t.split(ca).filter(function(p){return p.length>0}),r=[],n=0,o=e;n<o.length;n++){var i=o[n],a=i.split("/");if(a.length===0)throw new Error("Invalid number skeleton");for(var s=a[0],c=a.slice(1),l=0,h=c;l<h.length;l++){var d=h[l];if(d.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function Ol(t){return t.replace(/^(.*?)-/,"")}var la=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,ua=/^(@+)?(\+|#+)?[rs]?$/g,$l=/(\*)(0+)|(#+)(0+)|(0+)/g,ma=/^(0+)$/;function ha(t){var e={};return t[t.length-1]==="r"?e.roundingPriority="morePrecision":t[t.length-1]==="s"&&(e.roundingPriority="lessPrecision"),t.replace(ua,function(r,n,o){return typeof o!="string"?(e.minimumSignificantDigits=n.length,e.maximumSignificantDigits=n.length):o==="+"?e.minimumSignificantDigits=n.length:n[0]==="#"?e.maximumSignificantDigits=n.length:(e.minimumSignificantDigits=n.length,e.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),e}function fa(t){switch(t){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Ml(t){var e;if(t[0]==="E"&&t[1]==="E"?(e={notation:"engineering"},t=t.slice(2)):t[0]==="E"&&(e={notation:"scientific"},t=t.slice(1)),e){var r=t.slice(0,2);if(r==="+!"?(e.signDisplay="always",t=t.slice(2)):r==="+?"&&(e.signDisplay="exceptZero",t=t.slice(2)),!ma.test(t))throw new Error("Malformed concise eng/scientific notation");e.minimumIntegerDigits=t.length}return e}function da(t){var e={},r=fa(t);return r||e}function ga(t){for(var e={},r=0,n=t;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":e.style="percent";continue;case"%x100":e.style="percent",e.scale=100;continue;case"currency":e.style="currency",e.currency=o.options[0];continue;case"group-off":case",_":e.useGrouping=!1;continue;case"precision-integer":case".":e.maximumFractionDigits=0;continue;case"measure-unit":case"unit":e.style="unit",e.unit=Ol(o.options[0]);continue;case"compact-short":case"K":e.notation="compact",e.compactDisplay="short";continue;case"compact-long":case"KK":e.notation="compact",e.compactDisplay="long";continue;case"scientific":e=S(S(S({},e),{notation:"scientific"}),o.options.reduce(function(c,l){return S(S({},c),da(l))},{}));continue;case"engineering":e=S(S(S({},e),{notation:"engineering"}),o.options.reduce(function(c,l){return S(S({},c),da(l))},{}));continue;case"notation-simple":e.notation="standard";continue;case"unit-width-narrow":e.currencyDisplay="narrowSymbol",e.unitDisplay="narrow";continue;case"unit-width-short":e.currencyDisplay="code",e.unitDisplay="short";continue;case"unit-width-full-name":e.currencyDisplay="name",e.unitDisplay="long";continue;case"unit-width-iso-code":e.currencyDisplay="symbol";continue;case"scale":e.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace($l,function(c,l,h,d,p,u){if(l)e.minimumIntegerDigits=h.length;else{if(d&&p)throw new Error("We currently do not support maximum integer digits");if(u)throw new Error("We currently do not support exact integer digits")}return""});continue}if(ma.test(o.stem)){e.minimumIntegerDigits=o.stem.length;continue}if(la.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(la,function(c,l,h,d,p,u){return h==="*"?e.minimumFractionDigits=l.length:d&&d[0]==="#"?e.maximumFractionDigits=d.length:p&&u?(e.minimumFractionDigits=p.length,e.maximumFractionDigits=p.length+u.length):(e.minimumFractionDigits=l.length,e.maximumFractionDigits=l.length),""});var i=o.options[0];i==="w"?e=S(S({},e),{trailingZeroDisplay:"stripIfInteger"}):i&&(e=S(S({},e),ha(i)));continue}if(ua.test(o.stem)){e=S(S({},e),ha(o.stem));continue}var a=fa(o.stem);a&&(e=S(S({},e),a));var s=Ml(o.stem);s&&(e=S(S({},e),s))}return e}var tr={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function xa(t,e){for(var r="",n=0;n<t.length;n++){var o=t.charAt(n);if(o==="j"){for(var i=0;n+1<t.length&&t.charAt(n+1)===o;)i++,n++;var a=1+(i&1),s=i<2?1:3+(i>>1),c="a",l=Nl(e);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;a-- >0;)r=l+r}else o==="J"?r+="H":r+=o}return r}function Nl(t){var e=t.hourCycle;if(e===void 0&&t.hourCycles&&t.hourCycles.length&&(e=t.hourCycles[0]),e)switch(e){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=t.language,n;r!=="root"&&(n=t.maximize().region);var o=tr[n||""]||tr[r||""]||tr["".concat(r,"-001")]||tr["001"];return o[0]}var yo,Il=new RegExp("^".concat(vo.source,"*")),Hl=new RegExp("".concat(vo.source,"*$"));function T(t,e){return{start:t,end:e}}var Ul=!!String.prototype.startsWith,Dl=!!String.fromCodePoint,Bl=!!Object.fromEntries,zl=!!String.prototype.codePointAt,Fl=!!String.prototype.trimStart,Gl=!!String.prototype.trimEnd,Vl=!!Number.isSafeInteger,jl=Vl?Number.isSafeInteger:function(t){return typeof t=="number"&&isFinite(t)&&Math.floor(t)===t&&Math.abs(t)<=9007199254740991},Ao=!0;try{ba=Aa("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Ao=((yo=ba.exec("a"))===null||yo===void 0?void 0:yo[0])==="a"}catch{Ao=!1}var ba,va=Ul?function(e,r,n){return e.startsWith(r,n)}:function(e,r,n){return e.slice(n,n+r.length)===r},wo=Dl?String.fromCodePoint:function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n="",o=e.length,i=0,a;o>i;){if(a=e[i++],a>1114111)throw RangeError(a+" is not a valid code point");n+=a<65536?String.fromCharCode(a):String.fromCharCode(((a-=65536)>>10)+55296,a%1024+56320)}return n},ya=Bl?Object.fromEntries:function(e){for(var r={},n=0,o=e;n<o.length;n++){var i=o[n],a=i[0],s=i[1];r[a]=s}return r},Ea=zl?function(e,r){return e.codePointAt(r)}:function(e,r){var n=e.length;if(!(r<0||r>=n)){var o=e.charCodeAt(r),i;return o<55296||o>56319||r+1===n||(i=e.charCodeAt(r+1))<56320||i>57343?o:(o-55296<<10)+(i-56320)+65536}},ql=Fl?function(e){return e.trimStart()}:function(e){return e.replace(Il,"")},Wl=Gl?function(e){return e.trimEnd()}:function(e){return e.replace(Hl,"")};function Aa(t,e){return new RegExp(t,e)}var _o;Ao?(Eo=Aa("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),_o=function(e,r){var n;Eo.lastIndex=r;var o=Eo.exec(e);return(n=o[1])!==null&&n!==void 0?n:""}):_o=function(e,r){for(var n=[];;){var o=Ea(e,r);if(o===void 0||_a(o)||Kl(o))break;n.push(o),r+=o>=65536?2:1}return wo.apply(void 0,n)};var Eo,wa=function(){function t(e,r){r===void 0&&(r={}),this.message=e,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return t.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},t.prototype.parseMessage=function(e,r,n){for(var o=[];!this.isEOF();){var i=this.char();if(i===123){var a=this.parseArgument(e,n);if(a.err)return a;o.push(a.val)}else{if(i===125&&e>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),o.push({type:M.pound,location:T(s,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(A.UNMATCHED_CLOSING_TAG,T(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&So(this.peek()||0)){var a=this.parseTag(e,r);if(a.err)return a;o.push(a.val)}else{var a=this.parseLiteral(e,r);if(a.err)return a;o.push(a.val)}}}return{val:o,err:null}},t.prototype.parseTag=function(e,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:M.literal,value:"<".concat(o,"/>"),location:T(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(e+1,r,!0);if(i.err)return i;var a=i.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!So(this.char()))return this.error(A.INVALID_TAG,T(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return o!==l?this.error(A.UNMATCHED_CLOSING_TAG,T(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:M.tag,value:o,children:a,location:T(n,this.clonePosition())},err:null}:this.error(A.INVALID_TAG,T(s,this.clonePosition())))}else return this.error(A.UNCLOSED_TAG,T(n,this.clonePosition()))}else return this.error(A.INVALID_TAG,T(n,this.clonePosition()))},t.prototype.parseTagName=function(){var e=this.offset();for(this.bump();!this.isEOF()&&Xl(this.char());)this.bump();return this.message.slice(e,this.offset())},t.prototype.parseLiteral=function(e,r){for(var n=this.clonePosition(),o="";;){var i=this.tryParseQuote(r);if(i){o+=i;continue}var a=this.tryParseUnquoted(e,r);if(a){o+=a;continue}var s=this.tryParseLeftAngleBracket();if(s){o+=s;continue}break}var c=T(n,this.clonePosition());return{val:{type:M.literal,value:o,location:c},err:null}},t.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Yl(this.peek()||0))?(this.bump(),"<"):null},t.prototype.tryParseQuote=function(e){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(e==="plural"||e==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return wo.apply(void 0,r)},t.prototype.tryParseUnquoted=function(e,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&e>0?null:(this.bump(),wo(n))},t.prototype.parseArgument=function(e,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(A.EXPECT_ARGUMENT_CLOSING_BRACE,T(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(A.EMPTY_ARGUMENT,T(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(A.MALFORMED_ARGUMENT,T(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(A.EXPECT_ARGUMENT_CLOSING_BRACE,T(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:M.argument,value:o,location:T(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(A.EXPECT_ARGUMENT_CLOSING_BRACE,T(n,this.clonePosition())):this.parseArgumentOptions(e,r,o,n);default:return this.error(A.MALFORMED_ARGUMENT,T(n,this.clonePosition()))}},t.prototype.parseIdentifierIfPossible=function(){var e=this.clonePosition(),r=this.offset(),n=_o(this.message,r),o=r+n.length;this.bumpTo(o);var i=this.clonePosition(),a=T(e,i);return{value:n,location:a}},t.prototype.parseArgumentOptions=function(e,r,n,o){var i,a=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(A.EXPECT_ARGUMENT_TYPE,T(a,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var p=Wl(d.val);if(p.length===0)return this.error(A.EXPECT_ARGUMENT_STYLE,T(this.clonePosition(),this.clonePosition()));var u=T(h,this.clonePosition());l={style:p,styleLocation:u}}var g=this.tryParseArgumentClose(o);if(g.err)return g;var f=T(o,this.clonePosition());if(l&&va(l?.style,"::",0)){var w=ql(l.style.slice(2));if(s==="number"){var d=this.parseNumberSkeletonFromString(w,l.styleLocation);return d.err?d:{val:{type:M.number,value:n,location:f,style:d.val},err:null}}else{if(w.length===0)return this.error(A.EXPECT_DATE_TIME_SKELETON,f);var _=w;this.locale&&(_=xa(w,this.locale));var p={type:Ve.dateTime,pattern:_,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?sa(_):{}},L=s==="date"?M.date:M.time;return{val:{type:L,value:n,location:f,style:p},err:null}}}return{val:{type:s==="number"?M.number:s==="date"?M.date:M.time,value:n,location:f,style:(i=l?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var y=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(A.EXPECT_SELECT_ARGUMENT_OPTIONS,T(y,S({},y)));this.bumpSpace();var C=this.parseIdentifierIfPossible(),O=0;if(s!=="select"&&C.value==="offset"){if(!this.bumpIf(":"))return this.error(A.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,T(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(A.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,A.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),C=this.parseIdentifierIfPossible(),O=d.val}var H=this.tryParsePluralOrSelectOptions(e,s,r,C);if(H.err)return H;var g=this.tryParseArgumentClose(o);if(g.err)return g;var X=T(o,this.clonePosition());return s==="select"?{val:{type:M.select,value:n,options:ya(H.val),location:X},err:null}:{val:{type:M.plural,value:n,options:ya(H.val),offset:O,pluralType:s==="plural"?"cardinal":"ordinal",location:X},err:null}}default:return this.error(A.INVALID_ARGUMENT_TYPE,T(a,c))}},t.prototype.tryParseArgumentClose=function(e){return this.isEOF()||this.char()!==125?this.error(A.EXPECT_ARGUMENT_CLOSING_BRACE,T(e,this.clonePosition())):(this.bump(),{val:!0,err:null})},t.prototype.parseSimpleArgStyleIfPossible=function(){for(var e=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(A.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,T(o,this.clonePosition()));this.bump();break}case 123:{e+=1,this.bump();break}case 125:{if(e>0)e-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},t.prototype.parseNumberSkeletonFromString=function(e,r){var n=[];try{n=pa(e)}catch{return this.error(A.INVALID_NUMBER_SKELETON,r)}return{val:{type:Ve.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?ga(n):{}},err:null}},t.prototype.tryParsePluralOrSelectOptions=function(e,r,n,o){for(var i,a=!1,s=[],c=new Set,l=o.value,h=o.location;;){if(l.length===0){var d=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var p=this.tryParseDecimalInteger(A.EXPECT_PLURAL_ARGUMENT_SELECTOR,A.INVALID_PLURAL_ARGUMENT_SELECTOR);if(p.err)return p;h=T(d,this.clonePosition()),l=this.message.slice(d.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?A.DUPLICATE_SELECT_ARGUMENT_SELECTOR:A.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);l==="other"&&(a=!0),this.bumpSpace();var u=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?A.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:A.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,T(this.clonePosition(),this.clonePosition()));var g=this.parseMessage(e+1,r,n);if(g.err)return g;var f=this.tryParseArgumentClose(u);if(f.err)return f;s.push([l,{value:g.val,location:T(u,this.clonePosition())}]),c.add(l),this.bumpSpace(),i=this.parseIdentifierIfPossible(),l=i.value,h=i.location}return s.length===0?this.error(r==="select"?A.EXPECT_SELECT_ARGUMENT_SELECTOR:A.EXPECT_PLURAL_ARGUMENT_SELECTOR,T(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!a?this.error(A.MISSING_OTHER_CLAUSE,T(this.clonePosition(),this.clonePosition())):{val:s,err:null}},t.prototype.tryParseDecimalInteger=function(e,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var i=!1,a=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)i=!0,a=a*10+(s-48),this.bump();else break}var c=T(o,this.clonePosition());return i?(a*=n,jl(a)?{val:a,err:null}:this.error(r,c)):this.error(e,c)},t.prototype.offset=function(){return this.position.offset},t.prototype.isEOF=function(){return this.offset()===this.message.length},t.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},t.prototype.char=function(){var e=this.position.offset;if(e>=this.message.length)throw Error("out of bound");var r=Ea(this.message,e);if(r===void 0)throw Error("Offset ".concat(e," is at invalid UTF-16 code unit boundary"));return r},t.prototype.error=function(e,r){return{val:null,err:{kind:e,message:this.message,location:r}}},t.prototype.bump=function(){if(!this.isEOF()){var e=this.char();e===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=e<65536?1:2)}},t.prototype.bumpIf=function(e){if(va(this.message,e,this.offset())){for(var r=0;r<e.length;r++)this.bump();return!0}return!1},t.prototype.bumpUntil=function(e){var r=this.offset(),n=this.message.indexOf(e,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},t.prototype.bumpTo=function(e){if(this.offset()>e)throw Error("targetOffset ".concat(e," must be greater than or equal to the current offset ").concat(this.offset()));for(e=Math.min(e,this.message.length);;){var r=this.offset();if(r===e)break;if(r>e)throw Error("targetOffset ".concat(e," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},t.prototype.bumpSpace=function(){for(;!this.isEOF()&&_a(this.char());)this.bump()},t.prototype.peek=function(){if(this.isEOF())return null;var e=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(e>=65536?2:1));return n??null},t}();function So(t){return t>=97&&t<=122||t>=65&&t<=90}function Yl(t){return So(t)||t===47}function Xl(t){return t===45||t===46||t>=48&&t<=57||t===95||t>=97&&t<=122||t>=65&&t<=90||t==183||t>=192&&t<=214||t>=216&&t<=246||t>=248&&t<=893||t>=895&&t<=8191||t>=8204&&t<=8205||t>=8255&&t<=8256||t>=8304&&t<=8591||t>=11264&&t<=12271||t>=12289&&t<=55295||t>=63744&&t<=64975||t>=65008&&t<=65533||t>=65536&&t<=983039}function _a(t){return t>=9&&t<=13||t===32||t===133||t>=8206&&t<=8207||t===8232||t===8233}function Kl(t){return t>=33&&t<=35||t===36||t>=37&&t<=39||t===40||t===41||t===42||t===43||t===44||t===45||t>=46&&t<=47||t>=58&&t<=59||t>=60&&t<=62||t>=63&&t<=64||t===91||t===92||t===93||t===94||t===96||t===123||t===124||t===125||t===126||t===161||t>=162&&t<=165||t===166||t===167||t===169||t===171||t===172||t===174||t===176||t===177||t===182||t===187||t===191||t===215||t===247||t>=8208&&t<=8213||t>=8214&&t<=8215||t===8216||t===8217||t===8218||t>=8219&&t<=8220||t===8221||t===8222||t===8223||t>=8224&&t<=8231||t>=8240&&t<=8248||t===8249||t===8250||t>=8251&&t<=8254||t>=8257&&t<=8259||t===8260||t===8261||t===8262||t>=8263&&t<=8273||t===8274||t===8275||t>=8277&&t<=8286||t>=8592&&t<=8596||t>=8597&&t<=8601||t>=8602&&t<=8603||t>=8604&&t<=8607||t===8608||t>=8609&&t<=8610||t===8611||t>=8612&&t<=8613||t===8614||t>=8615&&t<=8621||t===8622||t>=8623&&t<=8653||t>=8654&&t<=8655||t>=8656&&t<=8657||t===8658||t===8659||t===8660||t>=8661&&t<=8691||t>=8692&&t<=8959||t>=8960&&t<=8967||t===8968||t===8969||t===8970||t===8971||t>=8972&&t<=8991||t>=8992&&t<=8993||t>=8994&&t<=9e3||t===9001||t===9002||t>=9003&&t<=9083||t===9084||t>=9085&&t<=9114||t>=9115&&t<=9139||t>=9140&&t<=9179||t>=9180&&t<=9185||t>=9186&&t<=9254||t>=9255&&t<=9279||t>=9280&&t<=9290||t>=9291&&t<=9311||t>=9472&&t<=9654||t===9655||t>=9656&&t<=9664||t===9665||t>=9666&&t<=9719||t>=9720&&t<=9727||t>=9728&&t<=9838||t===9839||t>=9840&&t<=10087||t===10088||t===10089||t===10090||t===10091||t===10092||t===10093||t===10094||t===10095||t===10096||t===10097||t===10098||t===10099||t===10100||t===10101||t>=10132&&t<=10175||t>=10176&&t<=10180||t===10181||t===10182||t>=10183&&t<=10213||t===10214||t===10215||t===10216||t===10217||t===10218||t===10219||t===10220||t===10221||t===10222||t===10223||t>=10224&&t<=10239||t>=10240&&t<=10495||t>=10496&&t<=10626||t===10627||t===10628||t===10629||t===10630||t===10631||t===10632||t===10633||t===10634||t===10635||t===10636||t===10637||t===10638||t===10639||t===10640||t===10641||t===10642||t===10643||t===10644||t===10645||t===10646||t===10647||t===10648||t>=10649&&t<=10711||t===10712||t===10713||t===10714||t===10715||t>=10716&&t<=10747||t===10748||t===10749||t>=10750&&t<=11007||t>=11008&&t<=11055||t>=11056&&t<=11076||t>=11077&&t<=11078||t>=11079&&t<=11084||t>=11085&&t<=11123||t>=11124&&t<=11125||t>=11126&&t<=11157||t===11158||t>=11159&&t<=11263||t>=11776&&t<=11777||t===11778||t===11779||t===11780||t===11781||t>=11782&&t<=11784||t===11785||t===11786||t===11787||t===11788||t===11789||t>=11790&&t<=11798||t===11799||t>=11800&&t<=11801||t===11802||t===11803||t===11804||t===11805||t>=11806&&t<=11807||t===11808||t===11809||t===11810||t===11811||t===11812||t===11813||t===11814||t===11815||t===11816||t===11817||t>=11818&&t<=11822||t===11823||t>=11824&&t<=11833||t>=11834&&t<=11835||t>=11836&&t<=11839||t===11840||t===11841||t===11842||t>=11843&&t<=11855||t>=11856&&t<=11857||t===11858||t>=11859&&t<=11903||t>=12289&&t<=12291||t===12296||t===12297||t===12298||t===12299||t===12300||t===12301||t===12302||t===12303||t===12304||t===12305||t>=12306&&t<=12307||t===12308||t===12309||t===12310||t===12311||t===12312||t===12313||t===12314||t===12315||t===12316||t===12317||t>=12318&&t<=12319||t===12320||t===12336||t===64830||t===64831||t>=65093&&t<=65094}function To(t){t.forEach(function(e){if(delete e.location,Kr(e)||Zr(e))for(var r in e.options)delete e.options[r].location,To(e.options[r].value);else Wr(e)&&Jr(e.style)||(Yr(e)||Xr(e))&&er(e.style)?delete e.style.location:Qr(e)&&To(e.children)})}function Sa(t,e){e===void 0&&(e={}),e=S({shouldParseSkeletons:!0,requiresOtherClause:!0},e);var r=new wa(t,e).parse();if(r.err){var n=SyntaxError(A[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return e?.captureLocation||To(r.val),r.val}function rr(t,e){var r=e&&e.cache?e.cache:rh,n=e&&e.serializer?e.serializer:th,o=e&&e.strategy?e.strategy:Ql;return o(t,{cache:r,serializer:n})}function Zl(t){return t==null||typeof t=="number"||typeof t=="boolean"}function Ta(t,e,r,n){var o=Zl(n)?n:r(n),i=e.get(o);return typeof i>"u"&&(i=t.call(this,n),e.set(o,i)),i}function Ca(t,e,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),i=e.get(o);return typeof i>"u"&&(i=t.apply(this,n),e.set(o,i)),i}function Co(t,e,r,n,o){return r.bind(e,t,n,o)}function Ql(t,e){var r=t.length===1?Ta:Ca;return Co(t,this,r,e.cache.create(),e.serializer)}function Jl(t,e){return Co(t,this,Ca,e.cache.create(),e.serializer)}function eh(t,e){return Co(t,this,Ta,e.cache.create(),e.serializer)}var th=function(){return JSON.stringify(arguments)};function Po(){this.cache=Object.create(null)}Po.prototype.get=function(t){return this.cache[t]};Po.prototype.set=function(t,e){this.cache[t]=e};var rh={create:function(){return new Po}},en={variadic:Jl,monadic:eh};var je;(function(t){t.MISSING_VALUE="MISSING_VALUE",t.INVALID_VALUE="INVALID_VALUE",t.MISSING_INTL_API="MISSING_INTL_API"})(je||(je={}));var nr=function(t){Jt(e,t);function e(r,n,o){var i=t.call(this,r)||this;return i.code=n,i.originalMessage=o,i}return e.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},e}(Error);var ko=function(t){Jt(e,t);function e(r,n,o,i){return t.call(this,'Invalid values for "'.concat(r,'": "').concat(n,'". Options are "').concat(Object.keys(o).join('", "'),'"'),je.INVALID_VALUE,i)||this}return e}(nr);var Pa=function(t){Jt(e,t);function e(r,n,o){return t.call(this,'Value for "'.concat(r,'" must be of type ').concat(n),je.INVALID_VALUE,o)||this}return e}(nr);var ka=function(t){Jt(e,t);function e(r,n){return t.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(n,'"'),je.MISSING_VALUE,n)||this}return e}(nr);var q;(function(t){t[t.literal=0]="literal",t[t.object=1]="object"})(q||(q={}));function nh(t){return t.length<2?t:t.reduce(function(e,r){var n=e[e.length-1];return!n||n.type!==q.literal||r.type!==q.literal?e.push(r):n.value+=r.value,e},[])}function oh(t){return typeof t=="function"}function or(t,e,r,n,o,i,a){if(t.length===1&&bo(t[0]))return[{type:q.literal,value:t[0].value}];for(var s=[],c=0,l=t;c<l.length;c++){var h=l[c];if(bo(h)){s.push({type:q.literal,value:h.value});continue}if(aa(h)){typeof i=="number"&&s.push({type:q.literal,value:r.getNumberFormat(e).format(i)});continue}var d=h.value;if(!(o&&d in o))throw new ka(d,a);var p=o[d];if(ia(h)){(!p||typeof p=="string"||typeof p=="number")&&(p=typeof p=="string"||typeof p=="number"?String(p):""),s.push({type:typeof p=="string"?q.literal:q.object,value:p});continue}if(Yr(h)){var u=typeof h.style=="string"?n.date[h.style]:er(h.style)?h.style.parsedOptions:void 0;s.push({type:q.literal,value:r.getDateTimeFormat(e,u).format(p)});continue}if(Xr(h)){var u=typeof h.style=="string"?n.time[h.style]:er(h.style)?h.style.parsedOptions:n.time.medium;s.push({type:q.literal,value:r.getDateTimeFormat(e,u).format(p)});continue}if(Wr(h)){var u=typeof h.style=="string"?n.number[h.style]:Jr(h.style)?h.style.parsedOptions:void 0;u&&u.scale&&(p=p*(u.scale||1)),s.push({type:q.literal,value:r.getNumberFormat(e,u).format(p)});continue}if(Qr(h)){var g=h.children,f=h.value,w=o[f];if(!oh(w))throw new Pa(f,"function",a);var _=or(g,e,r,n,o,i),L=w(_.map(function(O){return O.value}));Array.isArray(L)||(L=[L]),s.push.apply(s,L.map(function(O){return{type:typeof O=="string"?q.literal:q.object,value:O}}))}if(Kr(h)){var y=h.options[p]||h.options.other;if(!y)throw new ko(h.value,p,Object.keys(h.options),a);s.push.apply(s,or(y.value,e,r,n,o));continue}if(Zr(h)){var y=h.options["=".concat(p)];if(!y){if(!Intl.PluralRules)throw new nr(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,je.MISSING_INTL_API,a);var C=r.getPluralRules(e,{type:h.pluralType}).select(p-(h.offset||0));y=h.options[C]||h.options.other}if(!y)throw new ko(h.value,p,Object.keys(h.options),a);s.push.apply(s,or(y.value,e,r,n,o,p-(h.offset||0)));continue}}return nh(s)}function ih(t,e){return e?S(S(S({},t||{}),e||{}),Object.keys(t).reduce(function(r,n){return r[n]=S(S({},t[n]),e[n]||{}),r},{})):t}function ah(t,e){return e?Object.keys(t).reduce(function(r,n){return r[n]=ih(t[n],e[n]),r},S({},t)):t}function Lo(t){return{create:function(){return{get:function(e){return t[e]},set:function(e,r){t[e]=r}}}}}function sh(t){return t===void 0&&(t={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:rr(function(){for(var e,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((e=Intl.NumberFormat).bind.apply(e,qr([void 0],r,!1)))},{cache:Lo(t.number),strategy:en.variadic}),getDateTimeFormat:rr(function(){for(var e,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((e=Intl.DateTimeFormat).bind.apply(e,qr([void 0],r,!1)))},{cache:Lo(t.dateTime),strategy:en.variadic}),getPluralRules:rr(function(){for(var e,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((e=Intl.PluralRules).bind.apply(e,qr([void 0],r,!1)))},{cache:Lo(t.pluralRules),strategy:en.variadic})}}var La=function(){function t(e,r,n,o){var i=this;if(r===void 0&&(r=t.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(a){var s=i.formatToParts(a);if(s.length===1)return s[0].value;var c=s.reduce(function(l,h){return!l.length||h.type!==q.literal||typeof l[l.length-1]!="string"?l.push(h.value):l[l.length-1]+=h.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(a){return or(i.ast,i.locales,i.formatters,i.formats,a,void 0,i.message)},this.resolvedOptions=function(){return{locale:i.resolvedLocale.toString()}},this.getAst=function(){return i.ast},this.locales=r,this.resolvedLocale=t.resolveLocale(r),typeof e=="string"){if(this.message=e,!t.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=t.__parse(e,{ignoreTag:o?.ignoreTag,locale:this.resolvedLocale})}else this.ast=e;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=ah(t.formats,n),this.formatters=o&&o.formatters||sh(this.formatterCache)}return Object.defineProperty(t,"defaultLocale",{get:function(){return t.memoizedDefaultLocale||(t.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),t.memoizedDefaultLocale},enumerable:!1,configurable:!0}),t.memoizedDefaultLocale=null,t.resolveLocale=function(e){var r=Intl.NumberFormat.supportedLocalesOf(e);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof e=="string"?e:e[0])},t.__parse=Sa,t.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},t}();var Ra=La;var ch=/[0-9\-+#]/,lh=/[^\d\-+#]/g;function Oa(t){return t.search(ch)}function hh(t="#.##"){let e={},r=t.length,n=Oa(t);e.prefix=n>0?t.substring(0,n):"";let o=Oa(t.split("").reverse().join("")),i=r-o,a=t.substring(i,i+1),s=i+(a==="."||a===","?1:0);e.suffix=o>0?t.substring(s,r):"",e.mask=t.substring(n,s),e.maskHasNegativeSign=e.mask.charAt(0)==="-",e.maskHasPositiveSign=e.mask.charAt(0)==="+";let c=e.mask.match(lh);return e.decimal=c&&c[c.length-1]||".",e.separator=c&&c[1]&&c[0]||",",c=e.mask.split(e.decimal),e.integer=c[0],e.fraction=c[1],e}function dh(t,e,r){let n=!1,o={value:t};t<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(e.fraction&&e.fraction.length),o.value=Number(o.value).toString();let i=e.fraction&&e.fraction.lastIndexOf("0"),[a="0",s=""]=o.value.split(".");return(!s||s&&s.length<=i)&&(s=i<0?"":(+("0."+s)).toFixed(i+1).replace("0.","")),o.integer=a,o.fraction=s,ph(o,e),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&e.maskHasPositiveSign?o.sign="+":n&&e.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!e.maskHasNegativeSign?"":"-"),o}function ph(t,e){t.result="";let r=e.integer.split(e.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;t.integer.length<n.length-o;)t.integer="0"+t.integer;else Number(t.integer)===0&&(t.integer="");let i=r[1]&&r[r.length-1].length;if(i){let a=t.integer.length,s=a%i;for(let c=0;c<a;c++)t.result+=t.integer.charAt(c),!((c-s+1)%i)&&c<a-i&&(t.result+=e.separator)}else t.result=t.integer;return t.result+=e.fraction&&t.fraction?e.decimal+t.fraction:"",t}function uh(t,e,r={}){if(!t||isNaN(Number(e)))return e;let n=hh(t),o=dh(e,n,r);return n.prefix+o.sign+o.result+n.suffix}var $a=uh;var Ma=".",mh=",",Ia=/^\s+/,Ha=/\s+$/,Na="&nbsp;",Ro=t=>t*12,Ua=(t,e)=>{let{start:r,end:n,displaySummary:{amount:o,duration:i,minProductQuantity:a,outcomeType:s}={}}=t;if(!(o&&i&&s&&a))return!1;let c=e?new Date(e):new Date;if(!r||!n)return!1;let l=new Date(r),h=new Date(n);return c>=l&&c<=h},qe={MONTH:"MONTH",YEAR:"YEAR"},fh={[oe.ANNUAL]:12,[oe.MONTHLY]:1,[oe.THREE_YEARS]:36,[oe.TWO_YEARS]:24},Oo=(t,e)=>({accept:t,round:e}),gh=[Oo(({divisor:t,price:e})=>e%t==0,({divisor:t,price:e})=>e/t),Oo(({usePrecision:t})=>t,({divisor:t,price:e})=>Math.round(e/t*100)/100),Oo(()=>!0,({divisor:t,price:e})=>Math.ceil(Math.floor(e*100/t)/100))],$o={[Ue.YEAR]:{[oe.MONTHLY]:qe.MONTH,[oe.ANNUAL]:qe.YEAR},[Ue.MONTH]:{[oe.MONTHLY]:qe.MONTH}},xh=(t,e)=>t.indexOf(`'${e}'`)===0,bh=(t,e=!0)=>{let r=t.replace(/'.*?'/,"").trim(),n=Ba(r);return!!n?e||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+yh(t)),r},vh=t=>{let e=Eh(t),r=xh(t,e),n=t.replace(/'.*?'/,""),o=Ia.test(n)||Ha.test(n);return{currencySymbol:e,isCurrencyFirst:r,hasCurrencySpace:o}},Da=t=>t.replace(Ia,Na).replace(Ha,Na),yh=t=>t.match(/#(.?)#/)?.[1]===Ma?mh:Ma,Eh=t=>t.match(/'(.*?)'/)?.[1]??"",Ba=t=>t.match(/0(.?)0/)?.[1]??"";function bt({formatString:t,price:e,usePrecision:r,isIndianPrice:n=!1},o,i=a=>a){let{currencySymbol:a,isCurrencyFirst:s,hasCurrencySpace:c}=vh(t),l=r?Ba(t):"",h=bh(t,r),d=r?2:0,p=i(e,{currencySymbol:a}),u=n?p.toLocaleString("hi-IN",{minimumFractionDigits:d,maximumFractionDigits:d}):$a(h,p),g=r?u.lastIndexOf(l):u.length,f=u.substring(0,g),w=u.substring(g+1);return{accessiblePrice:t.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,u).replace(/SYMBOL/,a),currencySymbol:a,decimals:w,decimalsDelimiter:l,hasCurrencySpace:c,integer:f,isCurrencyFirst:s,recurrenceTerm:o}}var za=t=>{let{commitment:e,term:r,usePrecision:n}=t,o=fh[r]??1;return bt(t,o>1?qe.MONTH:$o[e]?.[r],i=>{let a={divisor:o,price:i,usePrecision:n},{round:s}=gh.find(({accept:c})=>c(a));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(a)}`);return s(a)})},Fa=({commitment:t,term:e,...r})=>bt(r,$o[t]?.[e]),Ga=t=>{let{commitment:e,instant:r,price:n,originalPrice:o,priceWithoutDiscount:i,promotion:a,quantity:s=1,term:c}=t;if(e===Ue.YEAR&&c===oe.MONTHLY){if(!a)return bt(t,qe.YEAR,Ro);let{displaySummary:{outcomeType:l,duration:h,minProductQuantity:d=1}={}}=a;switch(l){case"PERCENTAGE_DISCOUNT":if(s>=d&&Ua(a,r)){let p=parseInt(h.replace("P","").replace("M",""));if(isNaN(p))return Ro(n);let u=s*o*p,g=s*i*(12-p),f=Math.floor((u+g)*100)/100;return bt({...t,price:f},qe.YEAR)}default:return bt(t,qe.YEAR,()=>Ro(i??n))}}return bt(t,$o[e]?.[c])};var Mo={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, paid monthly.} other {}}"},Ah=Ui("ConsonantTemplates/price"),wh=/<\/?[^>]+(>|$)/g,U={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},ke={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},No="TAX_EXCLUSIVE",_h=t=>Ni(t)?Object.entries(t).filter(([,e])=>mt(e)||Nr(e)||e===!0).reduce((e,[r,n])=>e+` ${r}${n===!0?"":'="'+Mi(n)+'"'}`,""):"",B=(t,e,r,n=!1)=>`<span class="${t}${e?"":" "+U.disabled}"${_h(r)}>${n?Da(e):e??""}</span>`;function be(t,e,r,n){let o=t[r];if(o==null)return"";try{return new Ra(o.replace(wh,""),e).format(n)}catch{return Ah.error("Failed to format literal:",o),""}}function Sh(t,{accessibleLabel:e,altAccessibleLabel:r,currencySymbol:n,decimals:o,decimalsDelimiter:i,hasCurrencySpace:a,integer:s,isCurrencyFirst:c,recurrenceLabel:l,perUnitLabel:h,taxInclusivityLabel:d},p={}){let u=B(U.currencySymbol,n),g=B(U.currencySpace,a?"&nbsp;":""),f="";return e?f=`<sr-only class="strikethrough-aria-label">${e}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),c&&(f+=u+g),f+=B(U.integer,s),f+=B(U.decimalsDelimiter,i),f+=B(U.decimals,o),c||(f+=g+u),f+=B(U.recurrence,l,null,!0),f+=B(U.unitType,h,null,!0),f+=B(U.taxInclusivity,d,!0),B(t,f,{...p})}var K=({isAlternativePrice:t=!1,displayOptical:e=!1,displayStrikethrough:r=!1,displayAnnual:n=!1,instant:o=void 0}={})=>({country:i,displayFormatted:a=!0,displayRecurrence:s=!0,displayPerUnit:c=!1,displayTax:l=!1,language:h,literals:d={},quantity:p=1}={},{commitment:u,offerSelectorIds:g,formatString:f,price:w,priceWithoutDiscount:_,taxDisplay:L,taxTerm:y,term:C,usePrecision:O,promotion:H}={},X={})=>{Object.entries({country:i,formatString:f,language:h,price:w}).forEach(([Oc,$c])=>{if($c==null)throw new Error(`Argument "${Oc}" is missing for osi ${g?.toString()}, country ${i}, language ${h}`)});let V={...Mo,...d},Q=`${h.toLowerCase()}-${i.toUpperCase()}`,J=r&&_?_:w,ne=e?za:Fa;n&&(ne=Ga);let{accessiblePrice:ct,recurrenceTerm:Se,...He}=ne({commitment:u,formatString:f,instant:o,isIndianPrice:i==="IN",originalPrice:w,priceWithoutDiscount:_,price:e?w:J,promotion:H,quantity:p,term:C,usePrecision:O}),lt="",Vt="",Cn="";E(s)&&Se&&(Cn=be(V,Q,ke.recurrenceLabel,{recurrenceTerm:Se}));let Pn="";E(c)&&(Pn=be(V,Q,ke.perUnitLabel,{perUnit:"LICENSE"}));let kn="";E(l)&&y&&(kn=be(V,Q,L===No?ke.taxExclusiveLabel:ke.taxInclusiveLabel,{taxTerm:y})),r&&(lt=be(V,Q,ke.strikethroughAriaLabel,{strikethroughPrice:lt})),t&&(Vt=be(V,Q,ke.alternativePriceAriaLabel,{alternativePrice:Vt}));let ht=U.container;if(e&&(ht+=" "+U.containerOptical),r&&(ht+=" "+U.containerStrikethrough),t&&(ht+=" "+U.containerAlternative),n&&(ht+=" "+U.containerAnnual),E(a))return Sh(ht,{...He,accessibleLabel:lt,altAccessibleLabel:Vt,recurrenceLabel:Cn,perUnitLabel:Pn,taxInclusivityLabel:kn},X);let{currencySymbol:ki,decimals:Cc,decimalsDelimiter:Pc,hasCurrencySpace:Li,integer:kc,isCurrencyFirst:Lc}=He,dt=[kc,Pc,Cc];Lc?(dt.unshift(Li?"\xA0":""),dt.unshift(ki)):(dt.push(Li?"\xA0":""),dt.push(ki)),dt.push(Cn,Pn,kn);let Rc=dt.join("");return B(ht,Rc,X)},Va=()=>(t,e,r)=>{let o=(t.displayOldPrice===void 0||E(t.displayOldPrice))&&e.priceWithoutDiscount&&e.priceWithoutDiscount!=e.price;return`${K({isAlternativePrice:o})(t,e,r)}${o?"&nbsp;"+K({displayStrikethrough:!0})(t,e,r):""}`},ja=()=>(t,e,r)=>{let{instant:n}=t;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let o={...t,displayTax:!1,displayPerUnit:!1},a=(t.displayOldPrice===void 0||E(t.displayOldPrice))&&e.priceWithoutDiscount&&e.priceWithoutDiscount!=e.price;return`${a?K({displayStrikethrough:!0})(o,e,r)+"&nbsp;":""}${K({isAlternativePrice:a})(t,e,r)}${B(U.containerAnnualPrefix,"&nbsp;(")}${K({displayAnnual:!0,instant:n})(o,e,r)}${B(U.containerAnnualSuffix,")")}`},qa=()=>(t,e,r)=>{let n={...t,displayTax:!1,displayPerUnit:!1};return`${K({isAlternativePrice:t.displayOldPrice})(t,e,r)}${B(U.containerAnnualPrefix,"&nbsp;(")}${K({displayAnnual:!0})(n,e,r)}${B(U.containerAnnualSuffix,")")}`};var ir={...U,containerLegal:"price-legal",planType:"price-plan-type"},tn={...ke,planTypeLabel:"planTypeLabel"};function Th(t,{perUnitLabel:e,taxInclusivityLabel:r,planTypeLabel:n},o={}){let i="";return i+=B(ir.unitType,e,null,!0),e&&(r||n)&&(i+=" ("),r&&n&&(r+=". "),i+=B(ir.taxInclusivity,r,!0),i+=B(ir.planType,n,null),e&&(r||n)&&(i+=")"),B(t,i,{...o})}var Wa=({country:t,displayPerUnit:e=!1,displayTax:r=!1,displayPlanType:n=!1,language:o,literals:i={}}={},{taxDisplay:a,taxTerm:s,planType:c}={},l={})=>{let h={...Mo,...i},d=`${o.toLowerCase()}-${t.toUpperCase()}`,p="";E(e)&&(p=be(h,d,tn.perUnitLabel,{perUnit:"LICENSE"}));let u="";t==="US"&&o==="en"&&(r=!1),E(r)&&s&&(u=be(h,d,a===No?tn.taxExclusiveLabel:tn.taxInclusiveLabel,{taxTerm:s}));let g="";E(n)&&c&&(g=be(h,d,tn.planTypeLabel,{planType:c}));let f=ir.container;return f+=" "+ir.containerLegal,Th(f,{perUnitLabel:p,taxInclusivityLabel:u,planTypeLabel:g},l)};var Ya=K(),Xa=Va(),Ka=K({displayOptical:!0}),Za=K({displayStrikethrough:!0}),Qa=K({displayAnnual:!0}),Ja=K({displayOptical:!0,isAlternativePrice:!0}),es=K({isAlternativePrice:!0}),ts=qa(),rs=ja(),ns=Wa;var Ch=(t,e)=>{if(!(!Yt(t)||!Yt(e)))return Math.floor((e-t)/e*100)},os=()=>(t,e)=>{let{price:r,priceWithoutDiscount:n}=e,o=Ch(r,n);return o===void 0?'<span class="no-discount"></span>':`<span class="discount">${o}%</span>`};var is=os();var as=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","FR_fr","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],Ph={INDIVIDUAL_COM:["ZA_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","ZA_en","SG_en","KR_ko"],TEAM_COM:["ZA_en","LT_lt","LV_lv","NG_en","ZA_en","CO_es","KR_ko"],INDIVIDUAL_EDU:["LT_lt","LV_lv","SA_en","SG_en"],TEAM_EDU:["SG_en","KR_ko"]},ar=class ar extends HTMLSpanElement{constructor(){super();m(this,"masElement",new xt(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let n=W();if(!n)return null;let{displayOldPrice:o,displayPerUnit:i,displayRecurrence:a,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:h,perpetual:d,promotionCode:p,quantity:u,alternativePrice:g,template:f,wcsOsi:w}=n.collectPriceOptions(r);return Fr(ar,{displayOldPrice:o,displayPerUnit:i,displayRecurrence:a,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:h,perpetual:d,promotionCode:p,quantity:u,alternativePrice:g,template:f,wcsOsi:w})}get isInlinePrice(){return!0}attributeChangedCallback(r,n,o){this.masElement.attributeChangedCallback(r,n,o)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}resolveDisplayTaxForGeoAndSegment(r,n,o,i){let a=`${r}_${n}`;if(as.includes(r)||as.includes(a))return!0;let s=Ph[`${o}_${i}`];return s?!!(s.includes(r)||s.includes(a)):!1}async resolveDisplayTax(r,n){let[o]=await r.resolveOfferSelectors(n),i=Kt(await o,n);if(i?.length){let{country:a,language:s}=n,c=i[0],[l=""]=c.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(a,s,c.customerSegment,l)}}async render(r={}){if(!this.isConnected)return!1;let n=W();if(!n)return!1;let o=n.collectPriceOptions(r,this);if(!o.wcsOsi.length)return!1;let i=this.masElement.togglePending(o);this.innerHTML="";let[a]=n.resolveOfferSelectors(o);return this.renderOffers(Kt(await a,o),o,i)}renderOffers(r,n={},o=void 0){if(!this.isConnected)return;let i=W();if(!i)return!1;let a=i.collectPriceOptions({...this.dataset,...n},this);if(o??(o=this.masElement.togglePending(a)),r.length){if(this.masElement.toggleResolved(o,r,a)){this.innerHTML=i.buildPriceHTML(r,a);let s=this.closest("p, h3, div");if(!s||!s.querySelector('span[data-template="strikethrough"]')||s.querySelector(".alt-aria-label"))return!0;let c=s?.querySelectorAll('span[is="inline-price"]');return c.length>1&&c.length===s.querySelectorAll('span[data-template="strikethrough"]').length*2&&c.forEach(l=>{l.dataset.template!=="strikethrough"&&l.options&&!l.options.alternativePrice&&(l.options.alternativePrice=!0,l.innerHTML=i.buildPriceHTML(r,l.options))}),!0}}else{let s=new Error(`Not provided: ${a?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(o,s,a))return this.innerHTML="",!0}return!1}updateOptions(r){let n=W();if(!n)return!1;let{alternativePrice:o,displayOldPrice:i,displayPerUnit:a,displayRecurrence:s,displayTax:c,forceTaxExclusive:l,perpetual:h,promotionCode:d,quantity:p,template:u,wcsOsi:g}=n.collectPriceOptions(r);return Gr(this,{alternativePrice:o,displayOldPrice:i,displayPerUnit:a,displayRecurrence:s,displayTax:c,forceTaxExclusive:l,perpetual:h,promotionCode:d,quantity:p,template:u,wcsOsi:g}),!0}};m(ar,"is","inline-price"),m(ar,"tag","span");var ve=ar;window.customElements.get(ve.is)||window.customElements.define(ve.is,ve,{extends:ve.tag});function ss({literals:t,providers:e,settings:r}){function n(a,s=null){let c=structuredClone(r);if(s)for(let H of e.price)H(s,c);let{displayOldPrice:l,displayPerUnit:h,displayRecurrence:d,displayTax:p,displayPlanType:u,forceTaxExclusive:g,perpetual:f,displayAnnual:w,promotionCode:_,quantity:L,alternativePrice:y,wcsOsi:C,...O}=Object.assign(c,s?.dataset??{},a??{});return Object.assign(c,Xt({...O,displayOldPrice:E(l),displayPerUnit:E(h),displayRecurrence:E(d),displayTax:E(p),displayPlanType:E(u),forceTaxExclusive:E(g),perpetual:E(f),displayAnnual:E(w),promotionCode:Hr(_).effectivePromoCode,quantity:ft(L,R.quantity),alternativePrice:E(y),wcsOsi:Br(C)})),c}function o(a,s){if(!Array.isArray(a)||!a.length||!s)return"";let{template:c}=s,l;switch(c){case"discount":l=is;break;case"strikethrough":l=Za;break;case"annual":l=Qa;break;case"legal":l=ns;break;default:s.template==="optical"&&s.alternativePrice?l=Ja:s.template==="optical"?l=Ka:s.displayAnnual&&a[0].planType==="ABM"?l=s.promotionCode?rs:ts:s.alternativePrice?l=es:l=s.promotionCode?Xa:Ya}let h=n(s);h.literals=Object.assign({},t.price,Xt(s.literals??{}));let[d]=a;return d={...d,...d.priceDetails},l(h,d)}let i=ve.createInlinePrice;return{InlinePrice:ve,buildPriceHTML:o,collectPriceOptions:n,createInlinePrice:i}}function kh({locale:t=void 0,country:e=void 0,language:r=void 0}={}){return r??(r=t?.split("_")?.[0]||R.language),e??(e=t?.split("_")?.[1]||R.country),t??(t=`${r}_${e}`),{locale:t,country:e,language:r}}function cs(t={}){let{commerce:e={}}=t,r=fe.PRODUCTION,n=qn,o=I("checkoutClientId",e)??R.checkoutClientId,i=Fe(I("checkoutWorkflow",e),se,R.checkoutWorkflow),a=j.CHECKOUT;i===se.V3&&(a=Fe(I("checkoutWorkflowStep",e),j,R.checkoutWorkflowStep));let s=E(I("displayOldPrice",e),R.displayOldPrice),c=E(I("displayPerUnit",e),R.displayPerUnit),l=E(I("displayRecurrence",e),R.displayRecurrence),h=E(I("displayTax",e),R.displayTax),d=E(I("displayPlanType",e),R.displayPlanType),p=E(I("entitlement",e),R.entitlement),u=E(I("modal",e),R.modal),g=E(I("forceTaxExclusive",e),R.forceTaxExclusive),f=I("promotionCode",e)??R.promotionCode,w=ft(I("quantity",e)),_=I("wcsApiKey",e)??R.wcsApiKey,L=e?.env==="stage",y=Ce.PUBLISHED;["true",""].includes(e.allowOverride)&&(L=(I(Vn,e,{metadata:!1})?.toLowerCase()??e?.env)==="stage",y=Fe(I(jn,e),Ce,y)),L&&(r=fe.STAGE,n=Wn);let O=I("mas-io-url")??t.masIOUrl??`https://www${r===fe.STAGE?".stage":""}.adobe.com/mas/io`;return{...kh(t),displayOldPrice:s,checkoutClientId:o,checkoutWorkflow:i,checkoutWorkflowStep:a,displayPerUnit:c,displayRecurrence:l,displayTax:h,displayPlanType:d,entitlement:p,extraOptions:R.extraOptions,modal:u,env:r,forceTaxExclusive:g,promotionCode:f,quantity:w,alternativePrice:R.alternativePrice,wcsApiKey:_,wcsURL:n,landscape:y,masIOUrl:O}}async function rn(t,e={},r=2,n=100){let o;for(let i=0;i<=r;i++)try{return await fetch(t,e)}catch(a){if(o=a,i>r)break;await new Promise(s=>setTimeout(s,n*(i+1)))}throw o}var Io="wcs";function ls({settings:t}){let e=re.module(Io),{env:r,wcsApiKey:n}=t,o=new Map,i=new Map,a,s=new Map;async function c(p,u,g=!0){let f=W(),w=zn;e.debug("Fetching:",p);let _="",L;if(p.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let y=new Map(u),[C]=p.offerSelectorIds,O=Date.now()+Math.random().toString(36).substring(2,7),H=`${Io}:${C}:${O}${Pe}`,X=`${Io}:${C}:${O}${Wt}`,V,Q;try{if(performance.mark(H),_=new URL(t.wcsURL),_.searchParams.set("offer_selector_ids",C),_.searchParams.set("country",p.country),_.searchParams.set("locale",p.locale),_.searchParams.set("landscape",r===fe.STAGE?"ALL":t.landscape),_.searchParams.set("api_key",n),p.language&&_.searchParams.set("language",p.language),p.promotionCode&&_.searchParams.set("promotion_code",p.promotionCode),p.currency&&_.searchParams.set("currency",p.currency),L=await rn(_.toString(),{credentials:"omit"}),L.ok){let J=[];try{let ne=await L.json();e.debug("Fetched:",p,ne),J=ne.resolvedOffers??[]}catch(ne){e.error(`Error parsing JSON: ${ne.message}`,{...ne.context,...f?.duration})}J=J.map(Ur),u.forEach(({resolve:ne},ct)=>{let Se=J.filter(({offerSelectorIds:He})=>He.includes(ct)).flat();Se.length&&(y.delete(ct),u.delete(ct),ne(Se))})}else w=Bn}catch(J){w=`Network error: ${J.message}`}finally{({startTime:V,duration:Q}=performance.measure(X,H)),performance.clearMarks(H),performance.clearMeasures(X)}g&&u.size&&(e.debug("Missing:",{offerSelectorIds:[...u.keys()]}),u.forEach(J=>{J.reject(new ge(w,{...p,response:L,startTime:V,duration:Q,...f?.duration}))}))}function l(){clearTimeout(a);let p=[...i.values()];i.clear(),p.forEach(({options:u,promises:g})=>c(u,g))}function h(){let p=o.size;s=new Map(o),o.clear(),e.debug(`Moved ${p} cache entries to stale cache`)}function d({country:p,language:u,perpetual:g=!1,promotionCode:f="",wcsOsi:w=[]}){let _=`${u}_${p}`;p!=="GB"&&(u=g?"EN":"MULT");let L=[p,u,f].filter(y=>y).join("-").toLowerCase();return w.map(y=>{let C=`${y}-${L}`;if(o.has(C))return o.get(C);let O=new Promise((H,X)=>{let V=i.get(L);if(!V){let Q={country:p,locale:_,offerSelectorIds:[]};p!=="GB"&&(Q.language=u),V={options:Q,promises:new Map},i.set(L,V)}f&&(V.options.promotionCode=f),V.options.offerSelectorIds.push(y),V.promises.set(y,{resolve:H,reject:X}),l()}).catch(H=>{if(s.has(C))return s.get(C);throw H});return o.set(C,O),O})}return{Commitment:Ue,PlanType:Bi,Term:oe,applyPlanType:Ur,resolveOfferSelectors:d,flushWcsCacheInternal:h}}var hs="mas-commerce-service",ds="mas:start",ps="mas:ready",us="mas-commerce-service:initTime",sr,nn,ms,Ho=class extends HTMLElement{constructor(){super(...arguments);P(this,nn);P(this,sr);m(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(n,o,i)=>{let a=await r?.(n,o,this.imsSignedInPromise,i);return a||null})}activate(){let r=b(this,nn,ms),n=cs(r);gt(r.lana);let o=re.init(r.hostEnv).module("service");o.debug("Activating:",r);let a={price:oa(n)},s={checkout:new Set,price:new Set},c={literals:a,providers:s,settings:n};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...ta(c),...ra(c),...ss(c),...ls(c),...Zn,Log:re,get defaults(){return R},get log(){return re},get providers(){return{checkout(h){return s.checkout.add(h),()=>s.checkout.delete(h)},price(h){return s.price.add(h),()=>s.price.delete(h)},has:h=>s.price.has(h)||s.checkout.has(h)}},get settings(){return n}})),o.debug("Activated:",{literals:a,settings:n});let l=new CustomEvent($r,{bubbles:!0,cancelable:!1,detail:this});performance.mark(ps),k(this,sr,performance.measure(us,ds,ps)?.duration),this.dispatchEvent(l),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(ds),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(jt).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh()),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{[us]:b(this,sr)}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:o})=>o>this.lastLoggingTime).filter(({transferSize:o,duration:i,responseStatus:a})=>o===0&&i===0&&a<200||a>=400),n=Array.from(new Map(r.map(o=>[o.name,o])).values());if(n.some(({name:o})=>/(\/fragments\/|web_commerce_artifact)/.test(o))){let o=n.map(({name:i})=>i);this.log.error("Failed requests:",{failedUrls:o,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};sr=new WeakMap,nn=new WeakSet,ms=function(){let r=this.getAttribute("env")??"prod",n={hostEnv:{name:r},commerce:{env:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language"].forEach(o=>{let i=this.getAttribute(o);i&&(n[o]=i)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(o=>{let i=this.getAttribute(o);if(i!=null){let a=o.replace(/-([a-z])/g,s=>s[1].toUpperCase());n.commerce[a]=i}}),n};window.customElements.get(hs)||window.customElements.define(hs,Ho);var cr=class cr extends jr(HTMLButtonElement){static createCheckoutButton(e={},r=""){return Vr(cr,e,r)}setCheckoutUrl(e){this.setAttribute("data-href",e)}get href(){return this.getAttribute("data-href")}get isCheckoutButton(){return!0}clickHandler(e){if(this.checkoutActionHandler){this.checkoutActionHandler?.(e);return}this.href&&(window.location.href=this.href)}};m(cr,"is","checkout-button"),m(cr,"tag","button");var vt=cr;window.customElements.get(vt.is)||window.customElements.define(vt.is,vt,{extends:vt.tag});var Lh="mas-commerce-service";function on(t,e){let r;return function(){let n=this,o=arguments;clearTimeout(r),r=setTimeout(()=>t.apply(n,o),e)}}function Z(t,e={},r=null,n=null){let o=n?document.createElement(t,{is:n}):document.createElement(t);r instanceof HTMLElement?o.appendChild(r):o.innerHTML=r;for(let[i,a]of Object.entries(e))o.setAttribute(i,a);return o}function an(){return window.matchMedia("(max-width: 767px)")}function yt(){return an().matches}function fs(){return window.matchMedia("(max-width: 1024px)").matches}function Et(){return document.getElementsByTagName(Lh)?.[0]}function Rh(t){return`https://${t==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var lr,We=class We extends HTMLAnchorElement{constructor(){super();P(this,lr,!1);this.setAttribute("is",We.is)}get isUptLink(){return!0}initializeWcsData(r,n){this.setAttribute("data-wcs-osi",r),n&&this.setAttribute("data-promotion-code",n),k(this,lr,!0),this.composePromoTermsUrl()}attributeChangedCallback(r,n,o){b(this,lr)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let r=this.getAttribute("data-wcs-osi");if(!r){let d=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${d}`);return}let n=Et(),o=[r],i=this.getAttribute("data-promotion-code"),{country:a,language:s,env:c}=n.settings,l={country:a,language:s,wcsOsi:o,promotionCode:i},h=n.resolveOfferSelectors(l);Promise.all(h).then(([[d]])=>{let p=`locale=${s}_${a}&country=${a}&offer_id=${d.offerId}`;i&&(p+=`&promotion_code=${encodeURIComponent(i)}`),this.href=`${Rh(c)}?${p}`}).catch(d=>{console.error(`Could not resolve offer selectors for id: ${r}.`,d.message)})}static createFrom(r){let n=new We;for(let o of r.attributes)o.name!=="is"&&(o.name==="class"&&o.value.includes("upt-link")?n.setAttribute("class",o.value.replace("upt-link","").trim()):n.setAttribute(o.name,o.value));return n.innerHTML=r.innerHTML,n.setAttribute("tabindex",0),n}};lr=new WeakMap,m(We,"is","upt-link"),m(We,"tag","a"),m(We,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var Le=We;window.customElements.get(Le.is)||window.customElements.define(Le.is,Le,{extends:Le.tag});var sn=window,ln=sn.ShadowRoot&&(sn.ShadyCSS===void 0||sn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xs=Symbol(),gs=new WeakMap,cn=class{constructor(e,r,n){if(this._$cssResult$=!0,n!==xs)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o,r=this.t;if(ln&&e===void 0){let n=r!==void 0&&r.length===1;n&&(e=gs.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&gs.set(r,e))}return e}toString(){return this.cssText}},bs=t=>new cn(typeof t=="string"?t:t+"",void 0,xs);var Uo=(t,e)=>{ln?t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):e.forEach(r=>{let n=document.createElement("style"),o=sn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,t.appendChild(n)})},hn=ln?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(let n of e.cssRules)r+=n.cssText;return bs(r)})(t):t;var Do,dn=window,vs=dn.trustedTypes,Oh=vs?vs.emptyScript:"",ys=dn.reactiveElementPolyfillSupport,zo={toAttribute(t,e){switch(e){case Boolean:t=t?Oh:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},Es=(t,e)=>e!==t&&(e==e||t==t),Bo={attribute:!0,type:String,converter:zo,reflect:!1,hasChanged:Es},Fo="finalized",Ye=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(e)}static get observedAttributes(){this.finalize();let e=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),e.push(o))}),e}static createProperty(e,r=Bo){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(e,r),!r.noAccessor&&!this.prototype.hasOwnProperty(e)){let n=typeof e=="symbol"?Symbol():"__"+e,o=this.getPropertyDescriptor(e,n,r);o!==void 0&&Object.defineProperty(this.prototype,e,o)}}static getPropertyDescriptor(e,r,n){return{get(){return this[r]},set(o){let i=this[e];this[r]=o,this.requestUpdate(e,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||Bo}static finalize(){if(this.hasOwnProperty(Fo))return!1;this[Fo]=!0;let e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){let r=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let o of n)r.unshift(hn(o))}else e!==void 0&&r.push(hn(e));return r}static _$Ep(e,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(r=>r(this))}addController(e){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((n=e.hostConnected)===null||n===void 0||n.call(e))}removeController(e){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var e;let r=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return Uo(r,this.constructor.elementStyles),r}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(e,r,n){this._$AK(e,n)}_$EO(e,r,n=Bo){var o;let i=this.constructor._$Ep(e,n);if(i!==void 0&&n.reflect===!0){let a=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:zo).toAttribute(r,n.type);this._$El=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$El=null}}_$AK(e,r){var n;let o=this.constructor,i=o._$Ev.get(e);if(i!==void 0&&this._$El!==i){let a=o.getPropertyOptions(i),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?a.converter:zo;this._$El=i,this[i]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(e,r,n){let o=!0;e!==void 0&&(((n=n||this.constructor.getPropertyOptions(e)).hasChanged||Es)(this[e],r)?(this._$AL.has(e)||this._$AL.set(e,r),n.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(e=this._$ES)===null||e===void 0||e.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(e){}_$AE(e){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};Ye[Fo]=!0,Ye.elementProperties=new Map,Ye.elementStyles=[],Ye.shadowRootOptions={mode:"open"},ys?.({ReactiveElement:Ye}),((Do=dn.reactiveElementVersions)!==null&&Do!==void 0?Do:dn.reactiveElementVersions=[]).push("1.6.3");var Go,pn=window,At=pn.trustedTypes,As=At?At.createPolicy("lit-html",{createHTML:t=>t}):void 0,jo="$lit$",Re=`lit$${(Math.random()+"").slice(9)}$`,ks="?"+Re,$h=`<${ks}>`,Ze=document,un=()=>Ze.createComment(""),dr=t=>t===null||typeof t!="object"&&typeof t!="function",Ls=Array.isArray,Mh=t=>Ls(t)||typeof t?.[Symbol.iterator]=="function",Vo=`[ 	
\f\r]`,hr=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ws=/-->/g,_s=/>/g,Xe=RegExp(`>|${Vo}(?:([^\\s"'>=/]+)(${Vo}*=${Vo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ss=/'/g,Ts=/"/g,Rs=/^(?:script|style|textarea|title)$/i,Os=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),Mm=Os(1),Nm=Os(2),pr=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),Cs=new WeakMap,Ke=Ze.createTreeWalker(Ze,129,null,!1);function $s(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return As!==void 0?As.createHTML(e):e}var Nh=(t,e)=>{let r=t.length-1,n=[],o,i=e===2?"<svg>":"",a=hr;for(let s=0;s<r;s++){let c=t[s],l,h,d=-1,p=0;for(;p<c.length&&(a.lastIndex=p,h=a.exec(c),h!==null);)p=a.lastIndex,a===hr?h[1]==="!--"?a=ws:h[1]!==void 0?a=_s:h[2]!==void 0?(Rs.test(h[2])&&(o=RegExp("</"+h[2],"g")),a=Xe):h[3]!==void 0&&(a=Xe):a===Xe?h[0]===">"?(a=o??hr,d=-1):h[1]===void 0?d=-2:(d=a.lastIndex-h[2].length,l=h[1],a=h[3]===void 0?Xe:h[3]==='"'?Ts:Ss):a===Ts||a===Ss?a=Xe:a===ws||a===_s?a=hr:(a=Xe,o=void 0);let u=a===Xe&&t[s+1].startsWith("/>")?" ":"";i+=a===hr?c+$h:d>=0?(n.push(l),c.slice(0,d)+jo+c.slice(d)+Re+u):c+Re+(d===-2?(n.push(void 0),s):u)}return[$s(t,i+(t[r]||"<?>")+(e===2?"</svg>":"")),n]},ur=class t{constructor({strings:e,_$litType$:r},n){let o;this.parts=[];let i=0,a=0,s=e.length-1,c=this.parts,[l,h]=Nh(e,r);if(this.el=t.createElement(l,n),Ke.currentNode=this.el.content,r===2){let d=this.el.content,p=d.firstChild;p.remove(),d.append(...p.childNodes)}for(;(o=Ke.nextNode())!==null&&c.length<s;){if(o.nodeType===1){if(o.hasAttributes()){let d=[];for(let p of o.getAttributeNames())if(p.endsWith(jo)||p.startsWith(Re)){let u=h[a++];if(d.push(p),u!==void 0){let g=o.getAttribute(u.toLowerCase()+jo).split(Re),f=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:f[2],strings:g,ctor:f[1]==="."?Wo:f[1]==="?"?Yo:f[1]==="@"?Xo:_t})}else c.push({type:6,index:i})}for(let p of d)o.removeAttribute(p)}if(Rs.test(o.tagName)){let d=o.textContent.split(Re),p=d.length-1;if(p>0){o.textContent=At?At.emptyScript:"";for(let u=0;u<p;u++)o.append(d[u],un()),Ke.nextNode(),c.push({type:2,index:++i});o.append(d[p],un())}}}else if(o.nodeType===8)if(o.data===ks)c.push({type:2,index:i});else{let d=-1;for(;(d=o.data.indexOf(Re,d+1))!==-1;)c.push({type:7,index:i}),d+=Re.length-1}i++}}static createElement(e,r){let n=Ze.createElement("template");return n.innerHTML=e,n}};function wt(t,e,r=t,n){var o,i,a,s;if(e===pr)return e;let c=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,l=dr(e)?void 0:e._$litDirective$;return c?.constructor!==l&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),l===void 0?c=void 0:(c=new l(t),c._$AT(t,r,n)),n!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(e=wt(t,c._$AS(t,e.values),c,n)),e}var qo=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=e?.creationScope)!==null&&r!==void 0?r:Ze).importNode(n,!0);Ke.currentNode=i;let a=Ke.nextNode(),s=0,c=0,l=o[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new mn(a,a.nextSibling,this,e):l.type===1?h=new l.ctor(a,l.name,l.strings,this,e):l.type===6&&(h=new Ko(a,this,e)),this._$AV.push(h),l=o[++c]}s!==l?.index&&(a=Ke.nextNode(),s++)}return Ke.currentNode=Ze,i}v(e){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,r),r+=n.strings.length-2):n._$AI(e[r])),r++}},mn=class t{constructor(e,r,n,o){var i;this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var e,r;return(r=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let e=this._$AA.parentNode,r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=wt(this,e,r),dr(e)?e===z||e==null||e===""?(this._$AH!==z&&this._$AR(),this._$AH=z):e!==this._$AH&&e!==pr&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):Mh(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==z&&dr(this._$AH)?this._$AA.nextSibling.data=e:this.$(Ze.createTextNode(e)),this._$AH=e}g(e){var r;let{values:n,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=ur.createElement($s(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let a=new qo(i,this),s=a.u(this.options);a.v(n),this.$(s),this._$AH=a}}_$AC(e){let r=Cs.get(e.strings);return r===void 0&&Cs.set(e.strings,r=new ur(e)),r}T(e){Ls(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of e)o===r.length?r.push(n=new t(this.k(un()),this.k(un()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(e=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);e&&e!==this._$AB;){let o=e.nextSibling;e.remove(),e=o}}setConnected(e){var r;this._$AM===void 0&&(this._$Cp=e,(r=this._$AP)===null||r===void 0||r.call(this,e))}},_t=class{constructor(e,r,n,o,i){this.type=1,this._$AH=z,this._$AN=void 0,this.element=e,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=z}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,r=this,n,o){let i=this.strings,a=!1;if(i===void 0)e=wt(this,e,r,0),a=!dr(e)||e!==this._$AH&&e!==pr,a&&(this._$AH=e);else{let s=e,c,l;for(e=i[0],c=0;c<i.length-1;c++)l=wt(this,s[n+c],r,c),l===pr&&(l=this._$AH[c]),a||(a=!dr(l)||l!==this._$AH[c]),l===z?e=z:e!==z&&(e+=(l??"")+i[c+1]),this._$AH[c]=l}a&&!o&&this.j(e)}j(e){e===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Wo=class extends _t{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===z?void 0:e}},Ih=At?At.emptyScript:"",Yo=class extends _t{constructor(){super(...arguments),this.type=4}j(e){e&&e!==z?this.element.setAttribute(this.name,Ih):this.element.removeAttribute(this.name)}},Xo=class extends _t{constructor(e,r,n,o,i){super(e,r,n,o,i),this.type=5}_$AI(e,r=this){var n;if((e=(n=wt(this,e,r,0))!==null&&n!==void 0?n:z)===pr)return;let o=this._$AH,i=e===z&&o!==z||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,a=e!==z&&(o===z||i);i&&this.element.removeEventListener(this.name,this,o),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,e):this._$AH.handleEvent(e)}},Ko=class{constructor(e,r,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){wt(this,e)}};var Ps=pn.litHtmlPolyfillSupport;Ps?.(ur,mn),((Go=pn.litHtmlVersions)!==null&&Go!==void 0?Go:pn.litHtmlVersions=[]).push("2.8.0");var fn=window,gn=fn.ShadowRoot&&(fn.ShadyCSS===void 0||fn.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Zo=Symbol(),Ms=new WeakMap,mr=class{constructor(e,r,n){if(this._$cssResult$=!0,n!==Zo)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=r}get styleSheet(){let e=this.o,r=this.t;if(gn&&e===void 0){let n=r!==void 0&&r.length===1;n&&(e=Ms.get(r)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&Ms.set(r,e))}return e}toString(){return this.cssText}},Oe=t=>new mr(typeof t=="string"?t:t+"",void 0,Zo),v=(t,...e)=>{let r=t.length===1?t[0]:e.reduce((n,o,i)=>n+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1],t[0]);return new mr(r,t,Zo)},Qo=(t,e)=>{gn?t.adoptedStyleSheets=e.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):e.forEach(r=>{let n=document.createElement("style"),o=fn.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,t.appendChild(n)})},xn=gn?t=>t:t=>t instanceof CSSStyleSheet?(e=>{let r="";for(let n of e.cssRules)r+=n.cssText;return Oe(r)})(t):t;var Jo,bn=window,Ns=bn.trustedTypes,Hh=Ns?Ns.emptyScript:"",Is=bn.reactiveElementPolyfillSupport,ti={toAttribute(t,e){switch(e){case Boolean:t=t?Hh:null;break;case Object:case Array:t=t==null?t:JSON.stringify(t)}return t},fromAttribute(t,e){let r=t;switch(e){case Boolean:r=t!==null;break;case Number:r=t===null?null:Number(t);break;case Object:case Array:try{r=JSON.parse(t)}catch{r=null}}return r}},Hs=(t,e)=>e!==t&&(e==e||t==t),ei={attribute:!0,type:String,converter:ti,reflect:!1,hasChanged:Hs},ri="finalized",ye=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(e)}static get observedAttributes(){this.finalize();let e=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),e.push(o))}),e}static createProperty(e,r=ei){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(e,r),!r.noAccessor&&!this.prototype.hasOwnProperty(e)){let n=typeof e=="symbol"?Symbol():"__"+e,o=this.getPropertyDescriptor(e,n,r);o!==void 0&&Object.defineProperty(this.prototype,e,o)}}static getPropertyDescriptor(e,r,n){return{get(){return this[r]},set(o){let i=this[e];this[r]=o,this.requestUpdate(e,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||ei}static finalize(){if(this.hasOwnProperty(ri))return!1;this[ri]=!0;let e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){let r=[];if(Array.isArray(e)){let n=new Set(e.flat(1/0).reverse());for(let o of n)r.unshift(xn(o))}else e!==void 0&&r.push(xn(e));return r}static _$Ep(e,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(r=>r(this))}addController(e){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((n=e.hostConnected)===null||n===void 0||n.call(e))}removeController(e){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var e;let r=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return Qo(r,this.constructor.elementStyles),r}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(e,r,n){this._$AK(e,n)}_$EO(e,r,n=ei){var o;let i=this.constructor._$Ep(e,n);if(i!==void 0&&n.reflect===!0){let a=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:ti).toAttribute(r,n.type);this._$El=e,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$El=null}}_$AK(e,r){var n;let o=this.constructor,i=o._$Ev.get(e);if(i!==void 0&&this._$El!==i){let a=o.getPropertyOptions(i),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((n=a.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?a.converter:ti;this._$El=i,this[i]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(e,r,n){let o=!0;e!==void 0&&(((n=n||this.constructor.getPropertyOptions(e)).hasChanged||Hs)(this[e],r)?(this._$AL.has(e)||this._$AL.set(e,r),n.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(e=this._$ES)===null||e===void 0||e.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(e){}_$AE(e){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};ye[ri]=!0,ye.elementProperties=new Map,ye.elementStyles=[],ye.shadowRootOptions={mode:"open"},Is?.({ReactiveElement:ye}),((Jo=bn.reactiveElementVersions)!==null&&Jo!==void 0?Jo:bn.reactiveElementVersions=[]).push("1.6.3");var ni,vn=window,St=vn.trustedTypes,Us=St?St.createPolicy("lit-html",{createHTML:t=>t}):void 0,ii="$lit$",$e=`lit$${(Math.random()+"").slice(9)}$`,js="?"+$e,Uh=`<${js}>`,et=document,gr=()=>et.createComment(""),xr=t=>t===null||typeof t!="object"&&typeof t!="function",qs=Array.isArray,Dh=t=>qs(t)||typeof t?.[Symbol.iterator]=="function",oi=`[ 	
\f\r]`,fr=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ds=/-->/g,Bs=/>/g,Qe=RegExp(`>|${oi}(?:([^\\s"'>=/]+)(${oi}*=${oi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),zs=/'/g,Fs=/"/g,Ws=/^(?:script|style|textarea|title)$/i,Ys=t=>(e,...r)=>({_$litType$:t,strings:e,values:r}),x=Ys(1),zm=Ys(2),tt=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),Gs=new WeakMap,Je=et.createTreeWalker(et,129,null,!1);function Xs(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return Us!==void 0?Us.createHTML(e):e}var Bh=(t,e)=>{let r=t.length-1,n=[],o,i=e===2?"<svg>":"",a=fr;for(let s=0;s<r;s++){let c=t[s],l,h,d=-1,p=0;for(;p<c.length&&(a.lastIndex=p,h=a.exec(c),h!==null);)p=a.lastIndex,a===fr?h[1]==="!--"?a=Ds:h[1]!==void 0?a=Bs:h[2]!==void 0?(Ws.test(h[2])&&(o=RegExp("</"+h[2],"g")),a=Qe):h[3]!==void 0&&(a=Qe):a===Qe?h[0]===">"?(a=o??fr,d=-1):h[1]===void 0?d=-2:(d=a.lastIndex-h[2].length,l=h[1],a=h[3]===void 0?Qe:h[3]==='"'?Fs:zs):a===Fs||a===zs?a=Qe:a===Ds||a===Bs?a=fr:(a=Qe,o=void 0);let u=a===Qe&&t[s+1].startsWith("/>")?" ":"";i+=a===fr?c+Uh:d>=0?(n.push(l),c.slice(0,d)+ii+c.slice(d)+$e+u):c+$e+(d===-2?(n.push(void 0),s):u)}return[Xs(t,i+(t[r]||"<?>")+(e===2?"</svg>":"")),n]},br=class t{constructor({strings:e,_$litType$:r},n){let o;this.parts=[];let i=0,a=0,s=e.length-1,c=this.parts,[l,h]=Bh(e,r);if(this.el=t.createElement(l,n),Je.currentNode=this.el.content,r===2){let d=this.el.content,p=d.firstChild;p.remove(),d.append(...p.childNodes)}for(;(o=Je.nextNode())!==null&&c.length<s;){if(o.nodeType===1){if(o.hasAttributes()){let d=[];for(let p of o.getAttributeNames())if(p.endsWith(ii)||p.startsWith($e)){let u=h[a++];if(d.push(p),u!==void 0){let g=o.getAttribute(u.toLowerCase()+ii).split($e),f=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:f[2],strings:g,ctor:f[1]==="."?si:f[1]==="?"?ci:f[1]==="@"?li:Ct})}else c.push({type:6,index:i})}for(let p of d)o.removeAttribute(p)}if(Ws.test(o.tagName)){let d=o.textContent.split($e),p=d.length-1;if(p>0){o.textContent=St?St.emptyScript:"";for(let u=0;u<p;u++)o.append(d[u],gr()),Je.nextNode(),c.push({type:2,index:++i});o.append(d[p],gr())}}}else if(o.nodeType===8)if(o.data===js)c.push({type:2,index:i});else{let d=-1;for(;(d=o.data.indexOf($e,d+1))!==-1;)c.push({type:7,index:i}),d+=$e.length-1}i++}}static createElement(e,r){let n=et.createElement("template");return n.innerHTML=e,n}};function Tt(t,e,r=t,n){var o,i,a,s;if(e===tt)return e;let c=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,l=xr(e)?void 0:e._$litDirective$;return c?.constructor!==l&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),l===void 0?c=void 0:(c=new l(t),c._$AT(t,r,n)),n!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(e=Tt(t,c._$AS(t,e.values),c,n)),e}var ai=class{constructor(e,r){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=e?.creationScope)!==null&&r!==void 0?r:et).importNode(n,!0);Je.currentNode=i;let a=Je.nextNode(),s=0,c=0,l=o[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new vr(a,a.nextSibling,this,e):l.type===1?h=new l.ctor(a,l.name,l.strings,this,e):l.type===6&&(h=new hi(a,this,e)),this._$AV.push(h),l=o[++c]}s!==l?.index&&(a=Je.nextNode(),s++)}return Je.currentNode=et,i}v(e){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,r),r+=n.strings.length-2):n._$AI(e[r])),r++}},vr=class t{constructor(e,r,n,o){var i;this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var e,r;return(r=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let e=this._$AA.parentNode,r=this._$AM;return r!==void 0&&e?.nodeType===11&&(e=r.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,r=this){e=Tt(this,e,r),xr(e)?e===F||e==null||e===""?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==tt&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):Dh(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==F&&xr(this._$AH)?this._$AA.nextSibling.data=e:this.$(et.createTextNode(e)),this._$AH=e}g(e){var r;let{values:n,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=br.createElement(Xs(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let a=new ai(i,this),s=a.u(this.options);a.v(n),this.$(s),this._$AH=a}}_$AC(e){let r=Gs.get(e.strings);return r===void 0&&Gs.set(e.strings,r=new br(e)),r}T(e){qs(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of e)o===r.length?r.push(n=new t(this.k(gr()),this.k(gr()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(e=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);e&&e!==this._$AB;){let o=e.nextSibling;e.remove(),e=o}}setConnected(e){var r;this._$AM===void 0&&(this._$Cp=e,(r=this._$AP)===null||r===void 0||r.call(this,e))}},Ct=class{constructor(e,r,n,o,i){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=F}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,r=this,n,o){let i=this.strings,a=!1;if(i===void 0)e=Tt(this,e,r,0),a=!xr(e)||e!==this._$AH&&e!==tt,a&&(this._$AH=e);else{let s=e,c,l;for(e=i[0],c=0;c<i.length-1;c++)l=Tt(this,s[n+c],r,c),l===tt&&(l=this._$AH[c]),a||(a=!xr(l)||l!==this._$AH[c]),l===F?e=F:e!==F&&(e+=(l??"")+i[c+1]),this._$AH[c]=l}a&&!o&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},si=class extends Ct{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}},zh=St?St.emptyScript:"",ci=class extends Ct{constructor(){super(...arguments),this.type=4}j(e){e&&e!==F?this.element.setAttribute(this.name,zh):this.element.removeAttribute(this.name)}},li=class extends Ct{constructor(e,r,n,o,i){super(e,r,n,o,i),this.type=5}_$AI(e,r=this){var n;if((e=(n=Tt(this,e,r,0))!==null&&n!==void 0?n:F)===tt)return;let o=this._$AH,i=e===F&&o!==F||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,a=e!==F&&(o===F||i);i&&this.element.removeEventListener(this.name,this,o),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,e):this._$AH.handleEvent(e)}},hi=class{constructor(e,r,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){Tt(this,e)}};var Vs=vn.litHtmlPolyfillSupport;Vs?.(br,vr),((ni=vn.litHtmlVersions)!==null&&ni!==void 0?ni:vn.litHtmlVersions=[]).push("2.8.0");var Ks=(t,e,r)=>{var n,o;let i=(n=r?.renderBefore)!==null&&n!==void 0?n:e,a=i._$litPart$;if(a===void 0){let s=(o=r?.renderBefore)!==null&&o!==void 0?o:null;i._$litPart$=a=new vr(e.insertBefore(gr(),s),s,void 0,r??{})}return a._$AI(t),a};var di,pi;var N=class extends ye{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,r;let n=super.createRenderRoot();return(e=(r=this.renderOptions).renderBefore)!==null&&e!==void 0||(r.renderBefore=n.firstChild),n}update(e){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ks(r,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return tt}};N.finalized=!0,N._$litElement$=!0,(di=globalThis.litElementHydrateSupport)===null||di===void 0||di.call(globalThis,{LitElement:N});var Zs=globalThis.litElementPolyfillSupport;Zs?.({LitElement:N});((pi=globalThis.litElementVersions)!==null&&pi!==void 0?pi:globalThis.litElementVersions=[]).push("3.3.3");var Me="(max-width: 767px)",yn="(max-width: 1199px)",G="(min-width: 768px)",D="(min-width: 1200px)",he="(min-width: 1600px)";var Qs=v`
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
`,Js=()=>[v`
      /* Tablet */
      @media screen and ${Oe(G)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${Oe(D)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];var Pt=class extends N{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:e}=this;return e?x`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:x` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};m(Pt,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),m(Pt,"styles",v`
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
    `);customElements.define("merch-icon",Pt);var yr,kt,Er,Ar,wr,En=class extends HTMLElement{constructor(){super();P(this,yr,"");P(this,kt,"");P(this,Er,[]);P(this,Ar,[]);P(this,wr);k(this,wr,on(()=>{this.parentElement.style.background=this.value},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let r=b(this,Er).map((n,o)=>{let i=b(this,Ar)[o]||"";return`${n} ${i}`}).join(", ");return`linear-gradient(${b(this,yr)}, ${r})`}attributeChangedCallback(r,n,o){r==="border-radius"&&(k(this,kt,o?.trim()),b(this,kt)?this.parentElement.style.borderRadius=b(this,kt):n&&(this.parentElement.style.borderRadius="")),r==="colors"&&o?k(this,Er,o?.split(",").map(i=>i.trim())??[]):r==="positions"&&o?k(this,Ar,o?.split(",").map(i=>i.trim())??[]):r==="angle"&&k(this,yr,o?.trim()??""),b(this,wr).call(this)}};yr=new WeakMap,kt=new WeakMap,Er=new WeakMap,Ar=new WeakMap,wr=new WeakMap;customElements.define("merch-gradient",En);var Lt=class extends N{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this)}connectedCallback(){super.connectedCallback(),this.addEventListener(ut,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(ut,this.updatePlanType)}updatePlanType(e){if(e.target.tagName!=="SPAN")return;let r=e.target,n=r?.value?.[0];n&&r.closest("p").setAttribute("data-plan-type",n.planType)}handleChange(e){this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return x`<input
                type="checkbox"
                id="addon-checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
            <label for="addon-checkbox">
                <slot></slot>
            </label>`}};m(Lt,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0}}),m(Lt,"styles",v`
        :host {
            display: flex;
            gap: 9px;
            align-items: start;
            cursor: pointer;
        }

        :host,
        label {
            cursor: pointer;
        }

        :host-context(merch-card[variant="product"]) label,
        :host-context(merch-card[variant="mini-compare-chart"]) label {
            display: flex;
            flex-direction: column;
            padding: 8px 4px 8px 0;
            width: 100%;
        }

        :host input[type="checkbox"] {
            height: 18px;
            width: 18px;
            margin: 14px 12px 0 8px;
        }


        ::slotted(p[data-plan-type]) {
            display: none;
        }

        :host([plan-type='PUF']) ::slotted(p[data-plan-type='PUF']) {
            display: block;
        }

        :host([plan-type='ABM']) ::slotted(p[data-plan-type='ABM']) {
            display: block;
        }

        :host([plan-type='M2M']) ::slotted(p[data-plan-type='M2M']) {
            display: block;
        }
    `);customElements.define("merch-addon",Lt);var Rt,_r=class _r{constructor(e){m(this,"card");P(this,Rt);this.card=e,this.insertVariantStyle()}getContainer(){return k(this,Rt,b(this,Rt)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),b(this,Rt)}insertVariantStyle(){if(!_r.styleMap[this.card.variant]){_r.styleMap[this.card.variant]=!0;let e=document.createElement("style");e.innerHTML=this.getGlobalCSS(),document.head.appendChild(e)}}updateCardElementMinHeight(e,r){if(!e)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,o=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),i=parseInt(this.getContainer().style.getPropertyValue(n))||0;o>i&&this.getContainer().style.setProperty(n,`${o}px`)}get badge(){let e;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),x`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${e}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return x` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let e=this.card.secureLabel?x`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return x`<footer>${e}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let e=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;e===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};Rt=new WeakMap,m(_r,"styleMap",{});var $=_r;var ec=`
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

@media screen and ${D} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${he} {
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
}`;var ui={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Ot=class extends ${constructor(r){super(r);m(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent($n,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});m(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let n=this.actionMenuContentSlot.classList.contains("hidden");n||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!n).toString())});m(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(n||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",n),this.setAriaExpanded(this.actionMenu,"false"))});m(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get aemFragmentMapping(){return ui}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return x` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${fs()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":x`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?x`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return ec}setAriaExpanded(r,n){r.setAttribute("aria-expanded",n)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};m(Ot,"variantStyle",v`
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
    `);var tc=`
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

@media screen and ${D} {
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
`;var An=class extends ${constructor(e){super(e)}getGlobalCSS(){return tc}renderLayout(){return x`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?x`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:x`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?x`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:x`
              <hr />
              ${this.secureLabelFooter}
          `}`}};var rc=`
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

@media screen and ${D} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${he} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var wn=class extends ${constructor(e){super(e)}getGlobalCSS(){return rc}renderLayout(){return x` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":x`<hr />`} ${this.secureLabelFooter}`}};var nc=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
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
    font-weight: bold;
    pointer-events: none;
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
@media screen and ${Me} {
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

@media screen and ${yn} {
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
@media screen and ${D} {
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

@media screen and ${he} {
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
`;var Fh=32,$t=class extends ${constructor(r){super(r);m(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);m(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?x`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:x`<slot name="secure-transaction-label"></slot>`;return x`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return nc}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(o=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((n,o)=>{let i=Math.max(Fh,parseFloat(window.getComputedStyle(n).height)||0),a=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(o+1)))||0;i>a&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(o+1),`${i}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${ee}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let n=this.mainPrice,o=this.headingMPriceSlot;if(!n&&o){let i=r?.getAttribute("plan-type"),a=null;if(r&&i&&(a=r.querySelector(`p[data-plan-type="${i}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(a){let s=Z("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},a.innerHTML);this.card.appendChild(s)}}else{let s=Z("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let n=this.mainPrice,o=this.card.planType;n&&(await n.onceSettled(),o=n.value?.[0]?.planType),o&&(r.planType=o)}renderLayout(){return x` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?x`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>`:x`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){yt()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustAddon(),this.adjustMiniCompareFooterRows())}};m($t,"variantStyle",v`
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

    @media screen and ${Oe(yn)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Oe(D)} {
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
  `);var oc=`
:root {
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;
}

merch-card[variant="plans"] {
    --consonant-merch-card-callout-icon-size: 18px;
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant="plans"] [slot="icons"] {
    --img-width: 41.5px;
}

merch-card[variant="plans"] [slot="heading-xs"] span.price.price-strikethrough,
merch-card[variant="plans"] [slot="heading-m"] span.price.price-strikethrough {
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-weight: 700;
}

merch-card[variant="plans"] [slot="promo-text"] {
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card-collection merch-card[variant="plans"] {
  width: auto;
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

merch-card[variant="plans"] [slot="description"] {
    min-height: 84px;
}

merch-card[variant="plans"] [slot="body-xs"] a {
    color: var(--link-color);
}

merch-card[variant="plans"] [slot="promo-text"] a {
    color: inherit;
}

merch-card[variant="plans"] [slot="callout-content"] {
    margin: 8px 0 0;
}

merch-card[variant="plans"] [slot='callout-content'] > div > div,
merch-card[variant="plans"] [slot="callout-content"] > p {
    padding: 2px 10px 3px;
    background: #D9D9D9;
}

merch-card[variant="plans"] [slot='callout-content'] > p,
merch-card[variant="plans"] [slot='callout-content'] > div > div > div {
    color: #000;
}

merch-card[variant="plans"] [slot="callout-content"] img,
merch-card[variant="plans"] [slot="callout-content"] .icon-button {
    margin: 1.5px 0 1.5px 8px;
}

merch-card[variant="plans"] [slot="callout-content"] .icon-button::before {
    width: 18px;
    height: 18px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path fill="%232c2c2c" d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>');
    background-size: 18px 18px;
}

merch-card[variant="plans"] [slot="whats-included"] [slot="description"] {
  min-height: auto;
}

merch-card[variant="plans"] [slot="quantity-select"] {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding-top: 16px;
}

merch-card[variant="plans"] [slot="footer"] a {
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
@media screen and ${Me} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
}

merch-card[variant="plans"]:not([size]) {
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
@media screen and ${D} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${he} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var mi={title:{tag:"p",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},stockOffer:!0,addon:!0,secureLabel:!0,badge:{tag:"div",slot:"badge"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},Mt=class extends ${constructor(e){super(e),this.adaptForMobile=this.adaptForMobile.bind(this)}get aemFragmentMapping(){return mi}priceOptionsProvider(e,r){e.dataset.template===Kn&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return oc}adaptForMobile(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards")){this.card.removeAttribute("size");return}let e=this.card.shadowRoot,r=e.querySelector("footer"),n=this.card.getAttribute("size"),o=e.querySelector("footer #stock-checkbox"),i=e.querySelector(".body #stock-checkbox"),a=e.querySelector(".body");if(!n){r?.classList.remove("wide-footer"),o&&o.remove();return}let s=yt();if(r?.classList.toggle("wide-footer",!s),s&&o){i?o.remove():a.appendChild(o);return}!s&&i&&(o?i.remove():r.prepend(i))}postCardUpdateHook(){this.adaptForMobile(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${ee}[data-template="price"]`)}async adjustLegal(){if(await this.card.updateComplete,this.legal)return;let e=this.mainPrice;if(!e)return;let r=e.cloneNode(!0);this.legal=r,await e.onceSettled(),e?.options&&(e.options.displayPerUnit&&(e.dataset.displayPerUnit="false"),e.options.displayTax&&(e.dataset.displayTax="false"),e.options.displayPlanType&&(e.dataset.displayPlanType="false"),r.setAttribute("data-template","legal"),this.headingM.appendChild(r))}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let r=this.mainPrice;if(!r)return;await r.onceSettled();let n=r.value?.[0]?.planType;n&&(e.planType=n)}get stockCheckbox(){return this.card.checkboxLabel?x`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}connectedCallbackHook(){let e=an();e?.addEventListener&&e.addEventListener("change",this.adaptForMobile)}disconnectedCallbackHook(){let e=an();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMobile)}renderLayout(){return x` ${this.badge}
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
                <slot name="addon"></slot>
                <slot name="badge"></slot>
                <slot name="quantity-select"></slot>
            </div>
            ${this.secureLabelFooter}`}};m(Mt,"variantStyle",v`
        :host([variant='plans']) {
            min-height: 348px;
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
            --merch-card-plans-min-width: 244px;
            --merch-card-plans-max-width: 244px;
            --merch-card-plans-padding: 15px;
            --merch-card-plans-heading-min-height: 23px;
            --merch-color-green-promo: rgb(0, 122, 77);
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
            font-weight: 400;
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
    `);var ic=`
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
@media screen and ${D} {
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
`;var rt=class extends ${constructor(e){super(e),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return ic}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return x` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":x`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?x`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(yt()||this.adjustProductBodySlots(),this.adjustTitleWidth(),this.adjustAddon())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${ee}[data-template="price"]`)}toggleAddon(e){let r=this.mainPrice,n=this.headingXSSlot;if(!r&&n){let o=e?.getAttribute("plan-type"),i=null;if(e&&o&&(i=e.querySelector(`p[data-plan-type="${o}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(a=>a.remove()),e.checked){if(i){let a=Z("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},i.innerHTML);this.card.appendChild(a)}}else{let a=Z("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(a)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let r=this.mainPrice,n=this.card.planType;r&&(await r.onceSettled(),n=r.value?.[0]?.planType),n&&(e.planType=n)}};m(rt,"variantStyle",v`
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

        :host([variant='product']) ::slotted([slot='heading-xs']) {
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }
    `);var ac=`
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
@media screen and ${Me} {
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
@media screen and ${D} {
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
`;var Nt=class extends ${constructor(e){super(e)}getGlobalCSS(){return ac}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return x` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};m(Nt,"variantStyle",v`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var sc=`
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

@media screen and ${Me} {
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
@media screen and ${D} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${he} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var fi={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},It=class extends ${constructor(e){super(e)}getGlobalCSS(){return sc}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return fi}renderLayout(){return x`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?x`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:x`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};m(It,"variantStyle",v`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var gi=new Map,Y=(t,e,r=null,n=null)=>{gi.set(t,{class:e,fragmentMapping:r,style:n})};Y("catalog",Ot,ui,Ot.variantStyle);Y("image",An);Y("inline-heading",wn);Y("mini-compare-chart",$t,null,$t.variantStyle);Y("plans",Mt,mi,Mt.variantStyle);Y("product",rt,null,rt.variantStyle);Y("segment",Nt,null,Nt.variantStyle);Y("special-offers",It,fi,It.variantStyle);var xi=(t,e=!1)=>{let r=gi.get(t.variant);if(!r)return e?void 0:new rt(t);let{class:n,style:o}=r;if(o){let i=new CSSStyleSheet;i.replaceSync(o.cssText),t.shadowRoot.adoptedStyleSheets.push(i)}return new n(t)};function cc(t){return gi.get(t)?.fragmentMapping}var lc=document.createElement("style");lc.innerHTML=`
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

merch-card[variant='plans'] [slot='badge'] {
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

merch-gradient {
    display: none;
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
`;document.head.appendChild(lc);var pc=new CSSStyleSheet;pc.replaceSync(":host { display: contents; }");var hc="fragment",dc="author",_n="aem-fragment",Ee,bi=class{constructor(){P(this,Ee,new Map)}clear(){b(this,Ee).clear()}addByRequestedId(e,r){b(this,Ee).set(e,r)}add(...e){e.forEach(r=>{let{id:n}=r;n&&b(this,Ee).set(n,r)})}has(e){return b(this,Ee).has(e)}get(e){return b(this,Ee).get(e)}remove(e){b(this,Ee).delete(e)}};Ee=new WeakMap;var Sr=new bi,Tr,de,Ae,Ht,Ut,Ne,ae,we,Cr,Pr,yi,vi=class extends HTMLElement{constructor(){super();P(this,Pr);m(this,"cache",Sr);P(this,Tr);P(this,de,null);P(this,Ae,null);P(this,Ht,!1);P(this,Ut,null);P(this,Ne,null);P(this,ae);P(this,we);P(this,Cr,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[pc]}static get observedAttributes(){return[hc,dc]}attributeChangedCallback(r,n,o){r===hc&&k(this,ae,o),r===dc&&k(this,Cr,["","true"].includes(o))}connectedCallback(){if(!b(this,we)){if(k(this,Ne,Et(this)),k(this,Tr,b(this,Ne).log.module(_n)),k(this,Ut,`${_n}:${b(this,ae)}${Pe}`),performance.mark(b(this,Ut)),!b(this,ae)){le(this,Pr,yi).call(this,{message:"Missing fragment id"});return}this.refresh(!1)}}async getFragmentById(r,n,o){let i=`${_n}:${n}${Wt}`,a;try{if(a=await rn(r,{cache:"default",credentials:"omit"}),!a?.ok){let{startTime:s,duration:c}=performance.measure(i,o);throw new ge("Unexpected fragment response",{response:a,startTime:s,duration:c,...b(this,Ne).duration})}return a.json()}catch{let{startTime:c,duration:l}=performance.measure(i,o);throw a||(a={url:r}),new ge("Failed to fetch fragment",{response:a,startTime:c,duration:l,...b(this,Ne).duration})}}async refresh(r=!0){if(!(b(this,we)&&!await Promise.race([b(this,we),Promise.resolve(!1)])))return r&&Sr.remove(b(this,ae)),k(this,we,this.fetchData().then(()=>{let{references:n,referencesTree:o,placeholders:i}=b(this,de)||{};return this.dispatchEvent(new CustomEvent(Be,{detail:{...this.data,stale:b(this,Ht),references:n,referencesTree:o,placeholders:i},bubbles:!0,composed:!0})),!0}).catch(n=>b(this,de)?(Sr.addByRequestedId(b(this,ae),b(this,de)),!0):(le(this,Pr,yi).call(this,n),!1))),b(this,we)}async fetchData(){this.classList.remove("error"),k(this,Ae,null);let r=Sr.get(b(this,ae));if(r){k(this,de,r);return}k(this,Ht,!0);let{masIOUrl:n,wcsApiKey:o,locale:i}=b(this,Ne).settings,a=`${n}/fragment?id=${b(this,ae)}&api_key=${o}&locale=${i}`;r=await this.getFragmentById(a,b(this,ae),b(this,Ut)),Sr.addByRequestedId(b(this,ae),r),k(this,de,r),k(this,Ht,!1)}get updateComplete(){return b(this,we)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return b(this,Ae)?b(this,Ae):(b(this,Cr)?this.transformAuthorData():this.transformPublishData(),b(this,Ae))}transformAuthorData(){let{fields:r,id:n,tags:o,settings:i={}}=b(this,de);k(this,Ae,r.reduce((a,{name:s,multiple:c,values:l})=>(a.fields[s]=c?l:l[0],a),{fields:{},id:n,tags:o,settings:i}))}transformPublishData(){let{fields:r,id:n,tags:o,settings:i={}}=b(this,de);k(this,Ae,Object.entries(r).reduce((a,[s,c])=>(a.fields[s]=c?.mimeType?c.value:c??"",a),{fields:{},id:n,tags:o,settings:i}))}};Tr=new WeakMap,de=new WeakMap,Ae=new WeakMap,Ht=new WeakMap,Ut=new WeakMap,Ne=new WeakMap,ae=new WeakMap,we=new WeakMap,Cr=new WeakMap,Pr=new WeakSet,yi=function({message:r,context:n}){this.classList.add("error"),b(this,Tr).error(`aem-fragment: ${r}`,n),this.dispatchEvent(new CustomEvent(ze,{detail:{message:r,...n},bubbles:!0,composed:!0}))};customElements.define(_n,vi);var Dt=class extends N{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor=""}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.variant==="plans"&&this.style.setProperty("border-right","none"),super.connectedCallback()}render(){return x`<div class="plans-badge">
            ${this.textContent}
        </div>`}};m(Dt,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),m(Dt,"styles",v`
        :host {
            display: block;
            background-color: var(--merch-badge-background-color);
            color: var(--merch-badge-color, #000);
            padding: var(--merch-badge-padding);
            border-radius: var(--merch-badge-border-radius);
            font-size: var(--merch-badge-font-size);
            line-height: 21px;
            border: var(--merch-badge-border);
        }
    `);customElements.define("merch-badge",Dt);var kr=class extends N{constructor(){super()}render(){return x`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};m(kr,"styles",v`
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
    `),m(kr,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",kr);var Lr=class extends N{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((e,r)=>{r>=5&&(e.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return x`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?x`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:x``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};m(Lr,"styles",v`
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
    `),m(Lr,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",Lr);var Gh="#000000",uc="spectrum-yellow-300-plans",mc="#F8D904",Vh="#EAEAEA",jh=/(accent|primary|secondary)(-(outline|link))?/,qh="mas:product_code/",Wh="daa-ll",Sn="daa-lh",Yh=["XL","L","M","S"],Ei="...";function Ie(t,e,r,n){let o=n[t];if(e[t]&&o){let i={slot:o?.slot},a=e[t];if(o.maxCount&&typeof a=="string"){let[c,l]=sd(a,o.maxCount,o.withSuffix);c!==a&&(i.title=l,a=c)}let s=Z(o.tag,i,a);r.append(s)}}function Xh(t,e,r){t.mnemonicIcon?.map((o,i)=>({icon:o,alt:t.mnemonicAlt[i]??"",link:t.mnemonicLink[i]??""}))?.forEach(({icon:o,alt:i,link:a})=>{if(a&&!/^https?:/.test(a))try{a=new URL(`https://${a}`).href.toString()}catch{a="#"}let s={slot:"icons",src:o,loading:e.loading,size:r?.size??"l"};i&&(s.alt=i),a&&(s.href=a);let c=Z("merch-icon",s);e.append(c)})}function Kh(t,e,r){if(t.variant==="plans"){t.badge?.length&&!t.badge?.startsWith("<merch-badge")&&(t.badge=`<merch-badge variant="${t.variant}" background-color="${uc}">${t.badge}</merch-badge>`,t.borderColor||(t.borderColor=uc)),Ie("badge",t,e,r);return}t.badge?(e.setAttribute("badge-text",t.badge),e.setAttribute("badge-color",t.badgeColor||Gh),e.setAttribute("badge-background-color",t.badgeBackgroundColor||mc),e.setAttribute("border-color",t.badgeBackgroundColor||mc)):e.setAttribute("border-color",t.borderColor||Vh)}function Zh(t,e,r){r?.includes(t.size)&&e.setAttribute("size",t.size)}function Qh(t,e,r){Ie("cardTitle",t,e,{cardTitle:r})}function Jh(t,e,r){Ie("subtitle",t,e,r)}function ed(t,e,r){if(!t.backgroundColor||t.backgroundColor.toLowerCase()==="default"){e.style.removeProperty("--merch-card-custom-background-color"),e.removeAttribute("background-color");return}r?.[t.backgroundColor]&&(e.style.setProperty("--merch-card-custom-background-color",`var(${r[t.backgroundColor]})`),e.setAttribute("background-color",t.backgroundColor))}function td(t,e,r){let n="--merch-card-custom-border-color";t.borderColor?.toLowerCase()==="transparent"?(e.style.removeProperty(n),t.variant==="plans"&&e.style.setProperty(n,"transparent")):t.borderColor&&r&&(/-gradient/.test(t.borderColor)?(e.setAttribute("gradient-border","true"),e.style.removeProperty(n)):e.style.setProperty(n,`var(--${t.borderColor})`))}function rd(t,e,r){if(t.backgroundImage){let n={loading:e.loading??"lazy",src:t.backgroundImage};if(t.backgroundImageAltText?n.alt=t.backgroundImageAltText:n.role="none",!r)return;if(r?.attribute){e.setAttribute(r.attribute,t.backgroundImage);return}e.append(Z(r.tag,{slot:r.slot},Z("img",n)))}}function nd(t,e,r){Ie("prices",t,e,r)}function od(t,e,r){Ie("promoText",t,e,r),Ie("description",t,e,r),Ie("callout",t,e,r),Ie("quantitySelect",t,e,r)}function id(t,e,r){if(!r.addon)return;let n=t.addon;if(!n||/disabled/.test(n))return;let o=Z("merch-addon",{slot:"addon"},n);[...o.querySelectorAll(ee)].forEach(i=>{let a=i.parentElement;a?.nodeName==="P"&&a.setAttribute("data-plan-type","")}),e.append(o)}function ad(t,e,r,n){t.showStockCheckbox&&r.stockOffer&&(e.setAttribute("checkbox-label",n?.stockCheckboxLabel?n.stockCheckboxLabel:""),e.setAttribute("stock-offer-osis",n?.stockOfferOsis?n.stockOfferOsis:"")),n?.secureLabel&&r?.secureLabel&&e.setAttribute("secure-label",n.secureLabel)}function sd(t,e,r=!0){try{let n=typeof t!="string"?"":t,o=fc(n);if(o.length<=e)return[n,o];let i=0,a=!1,s=r?e-Ei.length<1?1:e-Ei.length:e,c=[];for(let d of n){if(i++,d==="<")if(a=!0,n[i]==="/")c.pop();else{let p="";for(let u of n.substring(i)){if(u===" "||u===">")break;p+=u}c.push(p)}if(d==="/"&&n[i]===">"&&c.pop(),d===">"){a=!1;continue}if(!a&&(s--,s===0))break}let l=n.substring(0,i).trim();if(c.length>0){c[0]==="p"&&c.shift();for(let d of c.reverse())l+=`</${d}>`}return[`${l}${r?Ei:""}`,o]}catch{let o=typeof t=="string"?t:"",i=fc(o);return[o,i]}}function fc(t){if(!t)return"";let e="",r=!1;for(let n of t){if(n==="<"&&(r=!0),n===">"){r=!1;continue}r||(e+=n)}return e}function cd(t,e){e.querySelectorAll("a.upt-link").forEach(n=>{let o=Le.createFrom(n);n.replaceWith(o),o.initializeWcsData(t.osi,t.promoCode)})}function ld(t,e,r,n){let i=customElements.get("checkout-button").createCheckoutButton({},t.innerHTML);i.setAttribute("tabindex",0);for(let h of t.attributes)["class","is"].includes(h.name)||i.setAttribute(h.name,h.value);i.firstElementChild?.classList.add("spectrum-Button-label");let a=e.ctas.size??"M",s=`spectrum-Button--${n}`,c=Yh.includes(a)?`spectrum-Button--size${a}`:"spectrum-Button--sizeM",l=["spectrum-Button",s,c];return r&&l.push("spectrum-Button--outline"),i.classList.add(...l),i}function hd(t,e,r,n){let i=customElements.get("checkout-button").createCheckoutButton(t.dataset);i.connectedCallback(),i.render();let a="fill";r&&(a="outline");let s=Z("sp-button",{treatment:a,variant:n,tabIndex:0,size:e.ctas.size??"m",...t.dataset.analyticsId&&{"data-analytics-id":t.dataset.analyticsId}},t.innerHTML);return s.source=i,i.onceSettled().then(c=>{s.setAttribute("data-navigation-url",c.href)}),s.addEventListener("click",c=>{c.defaultPrevented||i.click()}),s}function dd(t,e){let n=customElements.get("checkout-link").createCheckoutLink(t.dataset,t.innerHTML);return n.classList.add("con-button"),e&&n.classList.add("blue"),n}function pd(t,e,r,n){if(t.ctas){let{slot:o}=r.ctas,i=Z("div",{slot:o},t.ctas),a=[...i.querySelectorAll("a")].map(s=>{let c=jh.exec(s.className)?.[0]??"accent",l=c.includes("accent"),h=c.includes("primary"),d=c.includes("secondary"),p=c.includes("-outline"),u=c.includes("-link");if(e.consonant)return dd(s,l);if(u)return s;let g;return l?g="accent":h?g="primary":d&&(g="secondary"),e.spectrum==="swc"?hd(s,r,p,g):ld(s,r,p,g)});i.innerHTML="",i.append(...a),e.append(i)}}function ud(t,e){let{tags:r}=t,n=r?.find(i=>i.startsWith(qh))?.split("/").pop();if(!n)return;e.setAttribute(Sn,n),[...e.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...e.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((i,a)=>{i.setAttribute(Wh,`${i.dataset.analyticsId}-${a+1}`)})}function md(t){t.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([e,r])=>{t.querySelectorAll(`a.${e}`).forEach(n=>{n.classList.remove(e),n.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}function fd(t){t.querySelectorAll("[slot]").forEach(n=>{n.remove()}),t.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","size",Sn].forEach(n=>t.removeAttribute(n));let r=["wide-strip","thin-strip"];t.classList.remove(...r)}async function gc(t,e){let{id:r,fields:n,settings:o={}}=t,{variant:i}=n;if(!i)throw new Error(`hydrate: no variant found in payload ${r}`);fd(e),e.settings=o,e.variant=i,await e.updateComplete;let{aemFragmentMapping:a}=e.variantLayout;if(!a)throw new Error(`hydrate: aemFragmentMapping found for ${r}`);a.style==="consonant"&&e.setAttribute("consonant",!0),Xh(n,e,a.mnemonics),Kh(n,e,a),Zh(n,e,a.size),Qh(n,e,a.title),Jh(n,e,a),nd(n,e,a),rd(n,e,a.backgroundImage),ed(n,e,a.allowedColors),td(n,e,a.borderColor),od(n,e,a),id(n,e,a),ad(n,e,a,o),cd(n,e),pd(n,e,a,i),ud(n,e),md(e)}var wi="merch-card",gd=":ready",xd=":error",Ai=2e4,Tn="merch-card:";function xc(t,e){let r=t.closest(wi);if(!r)return e;r.variantLayout?.priceOptionsProvider?.(t,e)}function bd(t){t.providers.has(xc)||t.providers.price(xc)}var Bt,it,_e,ot,nt=class extends N{constructor(){super();P(this,_e);m(this,"customerSegment");m(this,"marketSegment");m(this,"variantLayout");P(this,Bt);P(this,it);m(this,"readyEventDispatched",!1);this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=xi(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(r=>{le(this,_e,ot).call(this,r,{},!1),this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=xi(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle);try{this.variantLayout?.postCardUpdateHook(r)}catch(n){le(this,_e,ot).call(this,`Error in postCardUpdateHook: ${n.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(ee)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(De)??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let i=o.value?.[0]?.planType;if(!i)return;let a=this.stockOfferOsis[i];if(!a)return;let s=o.dataset.wcsOsi.split(",").filter(c=>c!==a);r.checked&&s.push(a),o.dataset.wcsOsi=s.join(",")}}changeHandler(r){r.target.tagName==="MERCH-ADDON"&&this.toggleAddon(r.target)}toggleAddon(r){let n=this.checkoutLinks;if(this.variantLayout?.toggleAddon(r),n.length!==0)for(let o of n){let i=o.value?.[0]?.planType;if(!i)return;let a=r.querySelector(`p[data-plan-type="${i}"] ${ee}`)?.dataset?.wcsOsi,s=o.dataset.wcsOsi.split(",").filter(c=>c!==a);r.checked&&s.push(a),o.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let i=n[o].order;i===1||isNaN(i)||(n[o].order=Number(i)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback(),k(this,it,Et()),bd(b(this,it)),k(this,Bt,b(this,it).Log.module(wi)),this.id??(this.id=this.querySelector("aem-fragment")?.getAttribute("fragment")),performance.mark(`${Tn}${this.id}${Pe}`),this.addEventListener(pe,this.handleQuantitySelection),this.addEventListener(qt,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.addEventListener(ze,this.handleAemFragmentEvents),this.addEventListener(Be,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(pe,this.handleQuantitySelection),this.removeEventListener(ze,this.handleAemFragmentEvents),this.removeEventListener(Be,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler)}async handleAemFragmentEvents(r){if(r.type===ze&&le(this,_e,ot).call(this,`AEM fragment cannot be loaded: ${r.detail.message}`,r.detail),r.type===Be&&r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;gc(n,this).then(()=>this.checkReady()).catch(o=>b(this,Bt).error(o))}}async checkReady(){let r=new Promise(a=>setTimeout(()=>a("timeout"),Ai));if(this.aemFragment){let a=await Promise.race([this.aemFragment.updateComplete,r]);if(a===!1){let s=a==="timeout"?`AEM fragment was not resolved within ${Ai} timeout`:"AEM fragment cannot be loaded";le(this,_e,ot).call(this,s,{},!1);return}}let n=[...this.querySelectorAll(jt)];n.push(...[...this.querySelectorAll(Rn)].map(a=>a.source));let o=Promise.all(n.map(a=>a.onceSettled().catch(()=>a))).then(a=>a.every(s=>s.classList.contains("placeholder-resolved"))),i=await Promise.race([o,r]);if(i===!0)return performance.mark(`${Tn}${this.id}${gd}`),this.readyEventDispatched||(this.readyEventDispatched=!0,this.dispatchEvent(new CustomEvent(Nn,{bubbles:!0,composed:!0}))),this;{let{duration:a,startTime:s}=performance.measure(`${Tn}${this.id}${xd}`,`${Tn}${this.id}${Pe}`),c={duration:a,startTime:s,...b(this,it).duration};i==="timeout"?le(this,_e,ot).call(this,`Contains offers that were not resolved within ${Ai} timeout`,c):le(this,_e,ot).call(this,"Contains unresolved offers",c)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(De)).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(On,{bubbles:!0})),this.displayFooterElementsInColumn())}get dynamicPrice(){return this.querySelector('[slot="price"]')}};Bt=new WeakMap,it=new WeakMap,_e=new WeakSet,ot=function(r,n={},o=!0){b(this,Bt).error(`merch-card: ${r}`,n),this.failed=!0,o&&this.dispatchEvent(new CustomEvent(In,{detail:{...n,message:r},bubbles:!0,composed:!0}))},m(nt,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{if(!r)return;let[n,o,i]=r.split(",");return{PUF:n,ABM:o,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,i,a]=n.split(":"),s=Number(i);return[o,{order:isNaN(s)?void 0:s,size:a}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:i}])=>[n,o,i].filter(a=>a!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Sn,reflect:!0},loading:{type:String}}),m(nt,"styles",[Qs,...Js()]),m(nt,"registerVariant",Y),m(nt,"getFragmentMapping",cc);customElements.define(wi,nt);var zt,Rr=class extends N{constructor(){super();P(this,zt);this.defaults={},this.variant="plans"}saveContainerDefaultValues(){let r=this.closest(this.getAttribute("container")),n=r?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(!0),o=r?.badgeText;return{description:n,badgeText:o}}getSlottedElement(r,n){return(n||this.closest(this.getAttribute("container"))).querySelector(`[slot="${r}"]:not(merch-offer > *)`)}updateSlot(r,n){let o=this.getSlottedElement(r,n);if(!o)return;let i=this.selectedOffer.getOptionValue(r)?this.selectedOffer.getOptionValue(r):this.defaults[r];i&&o.replaceWith(i.cloneNode(!0))}handleOfferSelection(r){let n=r.detail;this.selectOffer(n)}handleOfferSelectionByQuantity(r){let n=r.detail.option,o=Number.parseInt(n),i=this.findAppropriateOffer(o);this.selectOffer(i),this.getSlottedElement("cta").setAttribute("data-quantity",o)}selectOffer(r){if(!r)return;let n=this.selectedOffer;n&&(n.selected=!1),r.selected=!0,this.selectedOffer=r,this.planType=r.planType,this.updateContainer(),this.updateComplete.then(()=>{this.dispatchEvent(new CustomEvent(Mn,{detail:this,bubbles:!0}))})}findAppropriateOffer(r){let n=null;return this.offers.find(i=>{let a=Number.parseInt(i.getAttribute("value"));if(a===r)return!0;if(a>r)return!1;n=i})||n}updateBadgeText(r){this.selectedOffer.badgeText===""?r.badgeText=null:this.selectedOffer.badgeText?r.badgeText=this.selectedOffer.badgeText:r.badgeText=this.defaults.badgeText}updateContainer(){let r=this.closest(this.getAttribute("container"));!r||!this.selectedOffer||(this.updateSlot("cta",r),this.updateSlot("secondary-cta",r),this.updateSlot("price",r),!this.manageableMode&&(this.updateSlot("description",r),this.updateBadgeText(r)))}render(){return x`<fieldset><slot class="${this.variant}"></slot></fieldset>`}connectedCallback(){super.connectedCallback(),this.addEventListener("focusin",this.handleFocusin),this.addEventListener("click",this.handleFocusin),this.addEventListener(pt,this.handleOfferSelectReady);let r=this.closest("merch-quantity-select");this.manageableMode=r,this.offers=[...this.querySelectorAll("merch-offer")],k(this,zt,this.handleOfferSelectionByQuantity.bind(this)),this.manageableMode?r.addEventListener(pe,b(this,zt)):this.defaults=this.saveContainerDefaultValues(),this.selectedOffer=this.offers[0],this.planType&&this.updateContainer()}get miniCompareMobileCard(){return this.merchCard?.variant==="mini-compare-chart"&&this.isMobile}get merchCard(){return this.closest("merch-card")}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(pe,b(this,zt)),this.removeEventListener(pt,this.handleOfferSelectReady),this.removeEventListener("focusin",this.handleFocusin),this.removeEventListener("click",this.handleFocusin)}get price(){return this.querySelector('merch-offer[aria-selected] [is="inline-price"]')}get customerSegment(){return this.selectedOffer?.customerSegment}get marketSegment(){return this.selectedOffer?.marketSegment}handleFocusin(r){r.target?.nodeName==="MERCH-OFFER"&&(r.preventDefault(),r.stopImmediatePropagation(),this.selectOffer(r.target))}async handleOfferSelectReady(){this.planType||this.querySelector("merch-offer:not([plan-type])")||(this.planType=this.selectedOffer.planType,await this.updateComplete,this.selectOffer(this.selectedOffer??this.querySelector("merch-offer[aria-selected]")??this.querySelector("merch-offer")),this.dispatchEvent(new CustomEvent(qt,{bubbles:!0})))}};zt=new WeakMap,m(Rr,"styles",v`
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
    `),m(Rr,"properties",{offers:{type:Array},selectedOffer:{type:Object},defaults:{type:Object},variant:{type:String,attribute:"variant",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},stock:{type:Boolean,reflect:!0}});customElements.define("merch-offer-select",Rr);var bc=v`
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
`;var vd="merch-offer",Or=class extends N{constructor(){super();m(this,"tr");this.type="radio",this.selected=!1}getOptionValue(r){return this.querySelector(`[slot="${r}"]`)}connectedCallback(){super.connectedCallback(),this.initOffer(),this.configuration=this.closest("quantity-selector"),!this.hasAttribute("tabindex")&&!this.configuration&&(this.tabIndex=0),!this.hasAttribute("role")&&!this.configuration&&(this.role="radio")}get asRadioOption(){return x` <div class="merch-Radio">
            <input tabindex="-1" type="radio" class="merch-Radio-input" />
            <span class="merch-Radio-button"></span>
            <span class="merch-Radio-label">${this.text}</span>
        </div>`}get asSubscriptionOption(){return x`<slot name="commitment"></slot>
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
            </div>`}render(){return this.configuration||!this.price?"":this.type==="subscription-option"?this.asSubscriptionOption:this.asRadioOption}get price(){return this.querySelector('span[is="inline-price"]:not([data-template="strikethrough"])')}get cta(){return this.querySelector(De)}get prices(){return this.querySelectorAll('span[is="inline-price"]')}get customerSegment(){return this.price?.value?.[0].customerSegment}get marketSegment(){return this.price?.value?.[0].marketSegments[0]}async initOffer(){if(!this.price)return;this.prices.forEach(n=>n.setAttribute("slot","price")),await this.updateComplete,await Promise.all([...this.prices].map(n=>n.onceSettled()));let{value:[r]}=this.price;this.planType=r.planType,await this.updateComplete,this.dispatchEvent(new CustomEvent(pt,{bubbles:!0}))}};m(Or,"properties",{text:{type:String},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},badgeText:{type:String,attribute:"badge-text"},type:{type:String,attribute:"type",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0}}),m(Or,"styles",[bc]);customElements.define(vd,Or);var vc=v`
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
`;var[Lx,Rx,yc,Ec,Ac,Ox]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Tab"];var _i=class extends N{static get properties(){return{closed:{type:Boolean,reflect:!0},selected:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},maxInput:{type:Number,attribute:"max-input"},options:{type:Array},highlightedIndex:{type:Number},defaultValue:{type:Number,attribute:"default-value",reflect:!0},title:{type:String}}}static get styles(){return vc}constructor(){super(),this.options=[],this.title="",this.closed=!0,this.min=0,this.max=0,this.step=0,this.maxInput=void 0,this.defaultValue=void 0,this.selectedValue=0,this.highlightedIndex=0,this.toggleMenu=this.toggleMenu.bind(this),this.handleClickOutside=this.handleClickOutside.bind(this),this.boundKeydownListener=this.handleKeydown.bind(this),this.addEventListener("keydown",this.boundKeydownListener),window.addEventListener("mousedown",this.handleClickOutside),this.handleKeyupDebounced=on(this.handleKeyup.bind(this),500)}handleKeyup(){this.handleInput(),this.sendEvent()}handleKeydown(e){switch(e.key){case Ec:this.closed||(e.preventDefault(),this.highlightedIndex=(this.highlightedIndex+1)%this.options.length);break;case yc:this.closed||(e.preventDefault(),this.highlightedIndex=(this.highlightedIndex-1+this.options.length)%this.options.length);break;case Ac:if(this.closed)this.closePopover(),this.blur();else{let r=this.options[this.highlightedIndex];if(!r)break;this.selectedValue=r,this.handleMenuOption(this.selectedValue),this.toggleMenu()}break}e.composedPath().includes(this)&&e.stopPropagation()}adjustInput(e,r){this.selectedValue=r,e.value=r,this.highlightedIndex=this.options.indexOf(r)}handleInput(){let e=this.shadowRoot.querySelector(".text-field-input"),r=parseInt(e.value);if(!isNaN(r))if(r>0&&r!==this.selectedValue){let n=r;this.maxInput&&r>this.maxInput&&(n=this.maxInput),this.min&&n<this.min&&(n=this.min),this.adjustInput(e,n)}else this.adjustInput(e,this.min||1)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mousedown",this.handleClickOutside),this.removeEventListener("keydown",this.boundKeydownListener)}generateOptionsArray(){let e=[];if(this.step>0)for(let r=this.min;r<=this.max;r+=this.step)e.push(r);return e}update(e){(e.has("min")||e.has("max")||e.has("step")||e.has("defaultValue"))&&(this.options=this.generateOptionsArray(),this.highlightedIndex=this.defaultValue?this.options.indexOf(this.defaultValue):0,this.handleMenuOption(this.defaultValue?this.defaultValue:this.options[0])),super.update(e)}handleClickOutside(e){e.composedPath().includes(this)||this.closePopover()}toggleMenu(){this.closed=!this.closed}handleMouseEnter(e){this.highlightedIndex=e}handleMenuOption(e){e===this.max&&this.shadowRoot.querySelector(".text-field-input")?.focus(),this.selectedValue=e,this.sendEvent(),this.closePopover()}sendEvent(){let e=new CustomEvent(pe,{detail:{option:this.selectedValue},bubbles:!0});this.dispatchEvent(e)}closePopover(){this.closed||this.toggleMenu()}get offerSelect(){return this.querySelector("merch-offer-select")}get popover(){return x` <div class="popover ${this.closed?"closed":"open"}">
            ${this.options.map((e,r)=>x`
                    <div
                        class="item ${r===this.highlightedIndex?"highlighted":""}"
                        @click="${()=>this.handleMenuOption(e)}"
                        @mouseenter="${()=>this.handleMouseEnter(r)}"
                    >
                        ${e===this.max?`${e}+`:e}
                    </div>
                `)}
        </div>`}render(){return x`
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
        `}};customElements.define("merch-quantity-select",_i);var wc=`

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
`;var Si={backgroundImage:{attribute:"background-image"},badge:!0,ctas:{slot:"cta",size:"M"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"p",slot:"price"},size:[],subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"}},Ft=class extends ${getGlobalCSS(){return wc}get aemFragmentMapping(){return Si}get stripStyle(){return this.card.backgroundImage?`
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir==="ltr"?"left":"right"};
        `:""}renderLayout(){return x` <div style="${this.stripStyle}" class="body">
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
            <slot></slot>`}postCardUpdateHook(e){e.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let e=new Image;e.src=this.card.backgroundImage,e.onload=()=>{e.width>8?this.card.classList.add("wide-strip"):e.width===8&&this.card.classList.add("thin-strip")}}};m(Ft,"variantStyle",v`
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
    `);var _c=`

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
`;var Ti={backgroundImage:{tag:"div",slot:"image"},badge:!0,ctas:{slot:"footer",size:"S"},description:{tag:"div",slot:"body-s"},mnemonics:{size:"m"},size:["wide"]},Gt=class extends ${getGlobalCSS(){return _c}get aemFragmentMapping(){return Ti}renderLayout(){return x` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};m(Gt,"variantStyle",v`
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
    `);var Sc=`
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
`;var Ci={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40,withSuffix:!0},description:{tag:"div",slot:"body-xxs",maxCount:200,withSuffix:!1},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},backgroundColor:{attribute:"background-color"},borderColor:{attribute:"border-color",specialValues:{}},allowedColors:{gray:"--spectrum-gray-100"},size:["single","double","triple"]},at=class extends ${getGlobalCSS(){return Sc}get aemFragmentMapping(){return Ci}renderLayout(){return x`
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
        `}};m(at,"variantStyle",v`
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
            background-color: var(
                --merch-card-custom-background-color,
                var(--consonant-merch-card-background-color)
            );
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

        :host([variant='ah-try-buy-widget'][size='single'])
            ::slotted(div[slot='cta']) {
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
    `);customElements.define("ah-try-buy-widget",at);var Tc=`
    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] {
        letter-spacing: normal;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] a {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price {
        display: inline-block;
        height: var(--consonant-merch-card-detail-xl-line-height);
        line-height: var(--consonant-merch-card-detail-xl-line-height);
        font-style: normal;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price.price-strikethrough {
        height: var(--consonant-merch-card-detail-l-line-height);
        line-height: var(--consonant-merch-card-detail-l-line-height);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        text-decoration-thickness: .5px;
        color: var(--merch-card-ah-promoted-plans-strikethrough-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-currency-symbol,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-integer,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-decimals-delimiter,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-decimals {
        color: var(--consonant-merch-card-heading-xxxs-color);
        font-size: var(--consonant-merch-card-heading-xs-font-size);
        font-weight: 700;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-recurrence {
        display: inline-block;
        width: 21px;
        text-align: end;
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 400;
    }

    merch-card[variant="ah-promoted-plans"] [slot="cta"] {
        gap: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    
    merch-card[variant="ah-promoted-plans"] [slot="cta"] .spectrum-Link {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="cta"] button[is="checkout-button"] {
        margin-inline-start: auto;
    }
    
    merch-card[variant="ah-promoted-plans"] [slot="cta"] button[is="checkout-button"]:last-child {
        margin-inline-start: 0;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] em {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        color: var(--merch-card-ah-promoted-plans-abm-color);
    }

    .spectrum--dark merch-card[variant="ah-promoted-plans"],
    .spectrum--darkest merch-card[variant="ah-promoted-plans"] {
      --consonant-merch-card-background-color:rgb(34, 34, 34);
      --consonant-merch-card-heading-xxxs-color:rgb(242, 242, 242);
      --merch-card-ah-promoted-plans-abm-color:rgb(175, 175, 175);
      --consonant-merch-card-body-xxs-color:rgb(219, 219, 219);
      --merch-card-ah-promoted-plans-strikethrough-color:rgb(138, 138, 138);
    }
`;var Pi={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40,withSuffix:!0},description:{tag:"div",slot:"body-xxs",maxCount:200,withSuffix:!1},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},backgroundColor:{attribute:"background-color"},borderColor:{attribute:"border-color",specialValues:{gradient:"linear-gradient(135deg, #ff4885 0%, #b272eb 50%, #5d89ff 100%)"}}},st=class extends ${getGlobalCSS(){return Tc}get aemFragmentMapping(){return Pi}renderLayout(){return x`
            <div class="content">
                <div class="header">
                    <slot name="icons"></slot>
                    <slot name="heading-xxxs"></slot>
                </div>
                <div class="price">
                    <slot name="price"></slot>
                </div>
                <slot name="body-xxs"></slot>
                <div class="footer">
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot></slot>
        `}};m(st,"variantStyle",v`
        /* Default styles for the component */
        :host([variant='ah-promoted-plans']) {
            --merch-card-ah-promoted-plans-min-width: 211px;
            --merch-card-ah-promoted-plans-max-width: 384px;
            --merch-card-ah-promoted-plans-header-min-height: 36px;
            --merch-card-ah-promoted-plans-gray-background: rgba(248, 248, 248);
            --merch-card-ah-promoted-plans-text-color: rgba(19, 19, 19);
            --merch-card-ah-promoted-plans-abm-color: rgba(80, 80, 80);
            --merch-card-ah-promoted-plans-strikethrough-color: rgba(
                113,
                113,
                113
            );
            --merch-card-ah-promoted-plans-price-line-height: 17px;
            --merch-card-ah-promoted-plans-outline: transparent;
            --merch-card-custom-border-width: 1px;
            height: 100%;
            min-width: var(--merch-card-ah-promoted-plans-min-width);
            max-width: var(--merch-card-ah-promoted-plans-max-width);
            background-color: var(
                --merch-card-custom-background-color,
                var(--consonant-merch-card-background-color)
            );
            color: var(--consonant-merch-card-heading-xxxs-color);
            border-radius: 10px;
            border: 1px solid var(--merch-card-custom-border-color, transparent);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 16px !important;
            gap: 16px;
            justify-content: space-between;
            box-sizing: border-box !important;
            position: relative;
        }

        :host([variant='ah-promoted-plans'][gradient-border='true']) {
            border: none;
            padding: 15px !important;
            background-origin: padding-box, border-box;
            background-clip: padding-box, border-box;
            background-image: linear-gradient(
                    to bottom,
                    var(
                        --merch-card-custom-background-color,
                        var(--consonant-merch-card-background-color)
                    ),
                    var(
                        --merch-card-custom-background-color,
                        var(--consonant-merch-card-background-color)
                    )
                ),
                linear-gradient(135deg, #ff4885 0%, #b272eb 50%, #5d89ff 100%);
            border: 1px solid transparent;
        }

        :host([variant='ah-promoted-plans']) .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: var(--consonant-merch-spacing-xxs);
            flex-grow: 1;
        }

        :host([variant='ah-promoted-plans']) .header {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--consonant-merch-spacing-xxs);
        }

        :host([variant='ah-promoted-plans']) ::slotted([slot='price']) {
            margin-left: var(--spacing-xs);
            display: flex;
            flex-direction: column;
            justify-content: end;
            font-size: var(--consonant-merch-card-body-m-font-size);
            font-style: italic;
            line-height: var(--consonant-merch-card-body-m-line-height);
            color: var(--consonant-merch-card-heading-xxxs-color);
        }

        :host([variant='ah-promoted-plans']) .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    `);customElements.define("ah-promoted-plans",st);gt({sampleRate:1});Y("ccd-suggested",Ft,Si,Ft.variantStyle);Y("ccd-slice",Gt,Ti,Gt.variantStyle);Y("ah-try-buy-widget",at,Ci,at.variantStyle);Y("ah-promoted-plans",st,Pi,st.variantStyle);
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
