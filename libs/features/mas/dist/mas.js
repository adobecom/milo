var yi=Object.defineProperty;var Ei=e=>{throw TypeError(e)};var yc=(e,t,r)=>t in e?yi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var Ec=(e,t)=>{for(var r in t)yi(e,r,{get:t[r],enumerable:!0})};var p=(e,t,r)=>yc(e,typeof t!="symbol"?t+"":t,r),Ao=(e,t,r)=>t.has(e)||Ei("Cannot "+r);var b=(e,t,r)=>(Ao(e,t,"read from private field"),r?r.call(e):t.get(e)),L=(e,t,r)=>t.has(e)?Ei("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),R=(e,t,r,o)=>(Ao(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r),de=(e,t,r)=>(Ao(e,t,"access private method"),r);(function(){let r={clientId:"",endpoint:"https://www.adobe.com/lana/ll",endpointStage:"https://www.stage.adobe.com/lana/ll",errorType:"e",sampleRate:1,tags:"",implicitSampleRate:1,useProd:!0,isProdDomain:!1},o=window;function n(){let{host:h}=window.location;return h.substring(h.length-10)===".adobe.com"&&h.substring(h.length-15)!==".corp.adobe.com"&&h.substring(h.length-16)!==".stage.adobe.com"}function i(h,u){h||(h={}),u||(u={});function d(m){return h[m]!==void 0?h[m]:u[m]!==void 0?u[m]:r[m]}return Object.keys(r).reduce((m,x)=>(m[x]=d(x),m),{})}function a(h,u){h=h&&h.stack?h.stack:h||"",h.length>2e3&&(h=`${h.slice(0,2e3)}<trunc>`);let d=i(u,o.lana.options);if(!d.clientId){console.warn("LANA ClientID is not set in options.");return}let x=parseInt(new URL(window.location).searchParams.get("lana-sample"),10)||(d.errorType==="i"?d.implicitSampleRate:d.sampleRate);if(!o.lana.debug&&!o.lana.localhost&&x<=Math.random()*100)return;let f=n()||d.isProdDomain,w=!f||!d.useProd?d.endpointStage:d.endpoint,E=[`m=${encodeURIComponent(h)}`,`c=${encodeURI(d.clientId)}`,`s=${x}`,`t=${encodeURI(d.errorType)}`];if(d.tags&&E.push(`tags=${encodeURI(d.tags)}`),(!f||o.lana.debug||o.lana.localhost)&&console.log("LANA Msg: ",h,`
Opts:`,d),!o.lana.localhost||o.lana.debug){let A=new XMLHttpRequest;return o.lana.debug&&(E.push("d"),A.addEventListener("load",()=>{console.log("LANA response:",A.responseText)})),A.open("GET",`${w}?${E.join("&")}`),A.send(),A}}function s(h){a(h.reason||h.error||h.message,{errorType:"i"})}function c(){return o.location.search.toLowerCase().indexOf("lanadebug")!==-1}function l(){return o.location.host.toLowerCase().indexOf("localhost")!==-1}o.lana={debug:!1,log:a,options:i(o.lana&&o.lana.options)},c()&&(o.lana.debug=!0),l()&&(o.lana.localhost=!0),o.addEventListener("error",s),o.addEventListener("unhandledrejection",s)})();var Go={};Ec(Go,{CLASS_NAME_FAILED:()=>ko,CLASS_NAME_HIDDEN:()=>wc,CLASS_NAME_PENDING:()=>Lo,CLASS_NAME_RESOLVED:()=>Ro,CheckoutWorkflow:()=>ie,CheckoutWorkflowStep:()=>V,Commitment:()=>He,ERROR_MESSAGE_BAD_REQUEST:()=>Oo,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Rc,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>$o,EVENT_AEM_ERROR:()=>Be,EVENT_AEM_LOAD:()=>Ue,EVENT_MAS_ERROR:()=>Po,EVENT_MAS_READY:()=>Co,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>So,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>kc,EVENT_MERCH_CARD_COLLECTION_SORT:()=>Pc,EVENT_MERCH_CARD_READY:()=>_o,EVENT_MERCH_OFFER_READY:()=>lt,EVENT_MERCH_OFFER_SELECT_READY:()=>Gt,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>ue,EVENT_MERCH_SEARCH_CHANGE:()=>Cc,EVENT_MERCH_SIDENAV_SELECT:()=>Lc,EVENT_MERCH_STOCK_CHANGE:()=>Sc,EVENT_MERCH_STORAGE_CHANGE:()=>Tc,EVENT_OFFER_SELECTED:()=>To,EVENT_TYPE_FAILED:()=>Mo,EVENT_TYPE_READY:()=>Tr,EVENT_TYPE_RESOLVED:()=>No,Env:()=>fe,HEADER_X_REQUEST_ID:()=>zo,LOG_NAMESPACE:()=>Io,Landscape:()=>_e,MARK_DURATION_SUFFIX:()=>Vt,MARK_START_SUFFIX:()=>Se,MODAL_TYPE_3_IN_1:()=>ae,NAMESPACE:()=>Ac,PARAM_AOS_API_KEY:()=>Oc,PARAM_ENV:()=>Ho,PARAM_LANDSCAPE:()=>Do,PARAM_WCS_API_KEY:()=>$c,PROVIDER_ENVIRONMENT:()=>Fo,SELECTOR_MAS_CHECKOUT_LINK:()=>De,SELECTOR_MAS_ELEMENT:()=>Ft,SELECTOR_MAS_INLINE_PRICE:()=>Cr,SELECTOR_MAS_SP_BUTTON:()=>wo,STATE_FAILED:()=>me,STATE_PENDING:()=>we,STATE_RESOLVED:()=>pe,TAG_NAME_SERVICE:()=>_c,Term:()=>te,WCS_PROD_URL:()=>Uo,WCS_STAGE_URL:()=>Bo});var He=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),te=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),Ac="merch",wc="hidden",Tr="wcms:commerce:ready",_c="mas-commerce-service",Cr='span[is="inline-price"][data-wcs-osi]',De='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',wo="sp-button[data-wcs-osi]",Ft=`${Cr},${De}`,lt="merch-offer:ready",Gt="merch-offer-select:ready",_o="merch-card:ready",So="merch-card:action-menu-toggle",To="merch-offer:selected",Sc="merch-stock:change",Tc="merch-storage:change",ue="merch-quantity-selector:change",Cc="merch-search:change",Pc="merch-card-collection:sort",kc="merch-card-collection:showmore",Lc="merch-sidenav:select",Ue="aem:load",Be="aem:error",Co="mas:ready",Po="mas:error",ko="placeholder-failed",Lo="placeholder-pending",Ro="placeholder-resolved",Oo="Bad WCS request",$o="Commerce offer not found",Rc="Literals URL not provided",Mo="mas:failed",No="mas:resolved",Io="mas/commerce",Ho="commerce.env",Do="commerce.landscape",Oc="commerce.aosKey",$c="commerce.wcsKey",Uo="https://www.adobe.com/web_commerce_artifact",Bo="https://www.stage.adobe.com/web_commerce_artifact_stage",me="failed",we="pending",pe="resolved",_e={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},zo="X-Request-Id",V=Object.freeze({CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),ie=Object.freeze({V2:"UCv2",V3:"UCv3"}),fe=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),Fo={PRODUCTION:"PRODUCTION"},ae={TWP:"twp",D2P:"d2p",CRM:"crm"},Se=":start",Vt=":duration";var Ai="tacocat.js";var Vo=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),wi=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function I(e,t={},{metadata:r=!0,search:o=!0,storage:n=!0}={}){let i;if(o&&i==null){let a=new URLSearchParams(window.location.search),s=ht(o)?o:e;i=a.get(s)}if(n&&i==null){let a=ht(n)?n:e;i=window.sessionStorage.getItem(a)??window.localStorage.getItem(a)}if(r&&i==null){let a=Nc(ht(r)?r:e);i=document.documentElement.querySelector(`meta[name="${a}"]`)?.content}return i??t[e]}var Mc=e=>typeof e=="boolean",Pr=e=>typeof e=="function",kr=e=>typeof e=="number",_i=e=>e!=null&&typeof e=="object";var ht=e=>typeof e=="string",Si=e=>ht(e)&&e,jt=e=>kr(e)&&Number.isFinite(e)&&e>0;function qt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,o])=>{t(o)&&delete e[r]}),e}function T(e,t){if(Mc(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function ze(e,t,r){let o=Object.values(t);return o.find(n=>Vo(n,e))??r??o[0]}function Nc(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,o)=>`${r}-${o}`).replace(/\W+/gu,"-").toLowerCase()}function Ti(e,t=1){return kr(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Ic=Date.now(),jo=()=>`(+${Date.now()-Ic}ms)`,Lr=new Set,Hc=T(I("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function Ci(e){let t=`[${Ai}/${e}]`,r=(a,s,...c)=>a?!0:(n(s,...c),!1),o=Hc?(a,...s)=>{console.debug(`${t} ${a}`,...s,jo())}:()=>{},n=(a,...s)=>{let c=`${t} ${a}`;Lr.forEach(([l])=>l(c,...s))};return{assert:r,debug:o,error:n,warn:(a,...s)=>{let c=`${t} ${a}`;Lr.forEach(([,l])=>l(c,...s))}}}function Dc(e,t){let r=[e,t];return Lr.add(r),()=>{Lr.delete(r)}}Dc((e,...t)=>{console.error(e,...t,jo())},(e,...t)=>{console.warn(e,...t,jo())});var Uc="no promo",Pi="promo-tag",Bc="yellow",zc="neutral",Fc=(e,t,r)=>{let o=i=>i||Uc,n=r?` (was "${o(t)}")`:"";return`${o(e)}${n}`},Gc="cancel-context",Rr=(e,t)=>{let r=e===Gc,o=!r&&e?.length>0,n=(o||r)&&(t&&t!=e||!t&&!r),i=n&&o||!n&&!!t,a=i?e||t:void 0;return{effectivePromoCode:a,overridenPromoCode:e,className:i?Pi:`${Pi} no-promo`,text:Fc(a,t,n),variant:i?Bc:zc,isOverriden:n}};var qo;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(qo||(qo={}));var J;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(J||(J={}));var re;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(re||(re={}));var Wo;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Wo||(Wo={}));var Yo;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Yo||(Yo={}));var Xo;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Xo||(Xo={}));var Ko;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Ko||(Ko={}));var Zo="ABM",Qo="PUF",Jo="M2M",en="PERPETUAL",tn="P3Y",Vc="TAX_INCLUSIVE_DETAILS",jc="TAX_EXCLUSIVE",ki={ABM:Zo,PUF:Qo,M2M:Jo,PERPETUAL:en,P3Y:tn},dd={[Zo]:{commitment:J.YEAR,term:re.MONTHLY},[Qo]:{commitment:J.YEAR,term:re.ANNUAL},[Jo]:{commitment:J.MONTH,term:re.MONTHLY},[en]:{commitment:J.PERPETUAL,term:void 0},[tn]:{commitment:J.THREE_MONTHS,term:re.P3Y}},Li="Value is not an offer",Or=e=>{if(typeof e!="object")return Li;let{commitment:t,term:r}=e,o=qc(t,r);return{...e,planType:o}};var qc=(e,t)=>{switch(e){case void 0:return Li;case"":return"";case J.YEAR:return t===re.MONTHLY?Zo:t===re.ANNUAL?Qo:"";case J.MONTH:return t===re.MONTHLY?Jo:"";case J.PERPETUAL:return en;case J.TERM_LICENSE:return t===re.P3Y?tn:"";default:return""}};function Ri(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:o,priceWithoutTax:n,priceWithoutDiscountAndTax:i,taxDisplay:a}=t;if(a!==Vc)return e;let s={...e,priceDetails:{...t,price:n??r,priceWithoutDiscount:i??o,taxDisplay:jc}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var Wc="mas-commerce-service";function Wt(e,{country:t,forceTaxExclusive:r,perpetual:o}){let n;if(e.length<2)n=e;else{let i=t==="GB"||o?"EN":"MULT",[a,s]=e;n=[a.language===i?a:s]}return r&&(n=n.map(Ri)),n}var $r=e=>window.setTimeout(e);function dt(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(Ti).filter(jt);return r.length||(r=[t]),r}function Mr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(Si)}function Y(){return document.getElementsByTagName(Wc)?.[0]}var Fe={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Oi=1e3;function Yc(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function $i(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:o,originatingRequest:n,status:i}=e;return[o,i,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Fe.serializableTypes.includes(r))return r}return e}function Xc(e,t){if(!Fe.ignoredProperties.includes(e))return $i(t)}var rn={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,o=[],n=[],i=t;r.forEach(l=>{l!=null&&(Yc(l)?o:n).push(l)}),o.length&&(i+=" "+o.map($i).join(" "));let{pathname:a,search:s}=window.location,c=`${Fe.delimiter}page=${a}${s}`;c.length>Oi&&(c=`${c.slice(0,Oi)}<trunc>`),i+=c,n.length&&(i+=`${Fe.delimiter}facts=`,i+=JSON.stringify(n,Xc)),window.lana?.log(i,Fe)}};function ut(e){Object.assign(Fe,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in Fe&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var Mi={LOCAL:"local",PROD:"prod",STAGE:"stage"},on={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},nn=new Set,an=new Set,Ni=new Map,Ii={append({level:e,message:t,params:r,timestamp:o,source:n}){console[e](`${o}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},Hi={filter:({level:e})=>e!==on.DEBUG},Kc={filter:()=>!1};function Zc(e,t,r,o,n){return{level:e,message:t,namespace:r,get params(){return o.length===1&&Pr(o[0])&&(o=o[0](),Array.isArray(o)||(o=[o])),o},source:n,timestamp:performance.now().toFixed(3)}}function Qc(e){[...an].every(t=>t(e))&&nn.forEach(t=>t(e))}function Di(e){let t=(Ni.get(e)??0)+1;Ni.set(e,t);let r=`${e} #${t}`,o={id:r,namespace:e,module:n=>Di(`${o.namespace}/${n}`),updateConfig:ut};return Object.values(on).forEach(n=>{o[n]=(i,...a)=>Qc(Zc(n,i,e,a,r))}),Object.seal(o)}function Nr(...e){e.forEach(t=>{let{append:r,filter:o}=t;Pr(o)&&an.add(o),Pr(r)&&nn.add(r)})}function Jc(e={}){let{name:t}=e,r=T(I("commerce.debug",{search:!0,storage:!0}),t===Mi.LOCAL);return Nr(r?Ii:Hi),t===Mi.PROD&&Nr(rn),ee}function el(){nn.clear(),an.clear()}var ee={...Di(Io),Level:on,Plugins:{consoleAppender:Ii,debugFilter:Hi,quietFilter:Kc,lanaAppender:rn},init:Jc,reset:el,use:Nr};var ge=class e extends Error{constructor(t,r,o){if(super(t,{cause:o}),this.name="MasError",r.response){let n=r.response.headers?.get(zo);n&&(r.requestId=n),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([o,n])=>`${o}: ${JSON.stringify(n)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var tl={[me]:ko,[we]:Lo,[pe]:Ro},rl={[me]:Mo,[pe]:No},Yt,mt=class{constructor(t){L(this,Yt);p(this,"changes",new Map);p(this,"connected",!1);p(this,"error");p(this,"log");p(this,"options");p(this,"promises",[]);p(this,"state",we);p(this,"timer",null);p(this,"value");p(this,"version",0);p(this,"wrapperElement");this.wrapperElement=t,this.log=ee.module("mas-element")}update(){[me,we,pe].forEach(t=>{this.wrapperElement.classList.toggle(tl[t],t===this.state)})}notify(){(this.state===pe||this.state===me)&&(this.state===pe?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===me&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof ge&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(rl[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,o){this.changes.set(t,o),this.requestUpdate()}connectedCallback(){R(this,Yt,Y()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:o}=this;return pe===o?Promise.resolve(this.wrapperElement):me===o?Promise.reject(t):new Promise((n,i)=>{r.push({resolve:n,reject:i})})}toggleResolved(t,r,o){return t!==this.version?!1:(o!==void 0&&(this.options=o),this.state=pe,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),$r(()=>this.notify()),!0)}toggleFailed(t,r,o){if(t!==this.version)return!1;o!==void 0&&(this.options=o),this.error=r,this.state=me,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...b(this,Yt)?.duration}),$r(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=we,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!Y()||this.timer)return;let{error:r,options:o,state:n,value:i,version:a}=this;this.state=we,this.timer=$r(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===we&&this.version===a&&(this.state=n,this.error=r,this.value=i,this.update(),this.notify())}catch(c){this.toggleFailed(this.version,c,o)}})}};Yt=new WeakMap;function Ui(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Ir(e,t={}){let{tag:r,is:o}=e,n=document.createElement(r,{is:o});return n.setAttribute("is",o),Object.assign(n.dataset,Ui(t)),n}function Hr(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Ui(t)),e):null}var Bi="download",zi="upgrade";function Dr(e,t={},r=""){let o=Y();if(!o)return null;let{checkoutMarketSegment:n,checkoutWorkflow:i,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:u,quantity:d,wcsOsi:m,extraOptions:x,analyticsId:f}=o.collectCheckoutOptions(t),w=Ir(e,{checkoutMarketSegment:n,checkoutWorkflow:i,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:u,quantity:d,wcsOsi:m,extraOptions:x,analyticsId:f});return r&&(w.innerHTML=`<span style="pointer-events: none;">${r}</span>`),w}function Ur(e){return class extends e{constructor(){super(...arguments);p(this,"checkoutActionHandler");p(this,"masElement",new mt(this))}attributeChangedCallback(o,n,i){this.masElement.attributeChangedCallback(o,n,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isOpen3in1Modal(){let o=document.querySelector("meta[name=mas-ff-3in1]");return Object.values(ae).includes(this.getAttribute("data-modal"))&&(!o||o.content!=="off")}requestUpdate(o=!1){return this.masElement.requestUpdate(o)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(o={}){let n=Y();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(u=>{u&&(this.dataset.imsCountry=u)}),o.imsCountry=null;let i=n.collectCheckoutOptions(o,this);if(!i.wcsOsi.length)return!1;let a;try{a=JSON.parse(i.extraOptions??"{}")}catch(u){this.masElement.log?.error("cannot parse exta checkout options",u)}let s=this.masElement.togglePending(i);this.setCheckoutUrl("");let c=n.resolveOfferSelectors(i),l=await Promise.all(c);l=l.map(u=>Wt(u,i)),i.country=this.dataset.imsCountry||i.country;let h=await n.buildCheckoutAction?.(l.flat(),{...a,...i},this);return this.renderOffers(l.flat(),i,{},h,s)}renderOffers(o,n,i={},a=void 0,s=void 0){let c=Y();if(!c)return!1;if(n={...JSON.parse(this.dataset.extraOptions??"null"),...n,...i},s??(s=this.masElement.togglePending(n)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),a){this.classList.remove(Bi,zi),this.masElement.toggleResolved(s,o,n);let{url:h,text:u,className:d,handler:m}=a;h&&this.setCheckoutUrl(h),u&&(this.firstElementChild.innerHTML=u),d&&this.classList.add(...d.split(" ")),m&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=m.bind(this))}if(o.length){if(this.masElement.toggleResolved(s,o,n)){if(!this.classList.contains(Bi)&&!this.classList.contains(zi)){let h=c.buildCheckoutURL(o,n);this.setCheckoutUrl(n.modal==="true"?"#":h)}return!0}}else{let h=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,h,n))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(o){}updateOptions(o={}){let n=Y();if(!n)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:u,promotionCode:d,quantity:m,wcsOsi:x}=n.collectCheckoutOptions(o);return Hr(this,{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:u,promotionCode:d,quantity:m,wcsOsi:x}),!0}}}var Xt=class Xt extends Ur(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return Dr(Xt,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};p(Xt,"is","checkout-link"),p(Xt,"tag","a");var xe=Xt;window.customElements.get(xe.is)||window.customElements.define(xe.is,xe,{extends:xe.tag});var ol="p_draft_landscape",nl="/store/",il=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]),sn=new Set(["af","ai","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),al=["env","workflowStep","clientId","country"],Fi=e=>il.get(e)??e;function cn(e,t,r){for(let[o,n]of Object.entries(e)){let i=Fi(o);n!=null&&r.has(i)&&t.set(i,n)}}function sl(e){switch(e){case Fo.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function cl(e,t){for(let r in e){let o=e[r];for(let[n,i]of Object.entries(o)){if(i==null)continue;let a=Fi(n);t.set(`items[${r}][${a}]`,i)}}}function ll(e,t,r,o){return!Object.values(ae).includes(t)||!e?.searchParams||!r||!o||(e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl"),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===ae.CRM?"creative":"mini_plans"),t===ae.CRM?e.searchParams.set("af","uc_segmentation_hide_tabs,uc_new_user_iframe,uc_new_system_close"):(t===ae.TWP||t===ae.D2P)&&(e.searchParams.set("af","uc_new_user_iframe,uc_new_system_close"),r==="INDIVIDUAL"&&o==="EDU"&&e.searchParams.set("ms","e"),r==="TEAM"&&o==="COM"&&e.searchParams.set("cs","t"))),e}function Gi(e){hl(e);let{env:t,items:r,workflowStep:o,ms:n,marketSegment:i,customerSegment:a,ot:s,offerType:c,pa:l,productArrangementCode:h,landscape:u,modal:d,...m}=e,x={marketSegment:i??n,offerType:c??s,productArrangementCode:h??l},f=new URL(sl(t));return f.pathname=`${nl}${o}`,o!==V.SEGMENTATION&&o!==V.CHANGE_PLAN_TEAM_PLANS&&cl(r,f.searchParams),o===V.SEGMENTATION&&cn(x,f.searchParams,sn),cn(m,f.searchParams,sn),u===_e.DRAFT&&cn({af:ol},f.searchParams,sn),f=ll(f,d,a,i),f.toString()}function hl(e){for(let t of al)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==V.SEGMENTATION&&e.workflowStep!==V.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var P=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:ie.V3,checkoutWorkflowStep:V.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:fe.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:_e.PUBLISHED});function Vi({providers:e,settings:t}){function r(i,a){let{checkoutClientId:s,checkoutWorkflow:c,checkoutWorkflowStep:l,country:h,language:u,promotionCode:d,quantity:m}=t,{checkoutMarketSegment:x,checkoutWorkflow:f=c,checkoutWorkflowStep:w=l,imsCountry:E,country:A=E??h,language:C=u,quantity:k=m,entitlement:N,upgrade:H,modal:j,perpetual:W,promotionCode:ne=d,wcsOsi:U,extraOptions:Q,...se}=Object.assign({},a?.dataset??{},i??{}),Ae=ze(f,ie,P.checkoutWorkflow),he=V.CHECKOUT;Ae===ie.V3&&(he=ze(w,V,P.checkoutWorkflowStep));let Ne=qt({...se,extraOptions:Q,checkoutClientId:s,checkoutMarketSegment:x,country:A,quantity:dt(k,P.quantity),checkoutWorkflow:Ae,checkoutWorkflowStep:he,language:C,entitlement:T(N),upgrade:T(H),modal:j,perpetual:T(W),promotionCode:Rr(ne).effectivePromoCode,wcsOsi:Mr(U)});if(a)for(let Ie of e.checkout)Ie(a,Ne);return Ne}function o(i,a){if(!Array.isArray(i)||!i.length||!a)return"";let{env:s,landscape:c}=t,{checkoutClientId:l,checkoutMarketSegment:h,checkoutWorkflow:u,checkoutWorkflowStep:d,country:m,promotionCode:x,quantity:f,...w}=r(a),E=window.frameElement||Object.values(ae).includes(a.modal)?"if":"fp",A={checkoutPromoCode:x,clientId:l,context:E,country:m,env:s,items:[],marketSegment:h,workflowStep:d,landscape:c,...w};if(i.length===1){let[{offerId:C,offerType:k,productArrangementCode:N}]=i,{marketSegments:[H],customerSegment:j}=i[0];Object.assign(A,{marketSegment:H,customerSegment:j,offerType:k,productArrangementCode:N}),A.items.push(f[0]===1?{id:C}:{id:C,quantity:f[0]})}else A.items.push(...i.map(({offerId:C},k)=>({id:C,quantity:f[k]??P.quantity})));return Gi(A)}let{createCheckoutLink:n}=xe;return{CheckoutLink:xe,CheckoutWorkflow:ie,CheckoutWorkflowStep:V,buildCheckoutURL:o,collectCheckoutOptions:r,createCheckoutLink:n}}function dl({interval:e=200,maxAttempts:t=25}={}){let r=ee.module("ims");return new Promise(o=>{r.debug("Waing for IMS to be ready");let n=0;function i(){window.adobeIMS?.initialized?o():++n>t?(r.debug("Timeout"),o()):setTimeout(i,e)}i()})}function ul(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function ml(e){let t=ee.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:o})=>(t.debug("Got user country:",o),o),o=>{t.error("Unable to get user country:",o)}):null)}function ji({}){let e=dl(),t=ul(e),r=ml(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var qi=window.masPriceLiterals;function Wi(e){if(Array.isArray(qi)){let t=o=>qi.find(n=>Vo(n.lang,o)),r=t(e.language)??t(P.language);if(r)return Object.freeze(r)}return{}}var ln=function(e,t){return ln=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,o){r.__proto__=o}||function(r,o){for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(r[n]=o[n])},ln(e,t)};function Kt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");ln(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var _=function(){return _=Object.assign||function(t){for(var r,o=1,n=arguments.length;o<n;o++){r=arguments[o];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},_.apply(this,arguments)};function Br(e,t,r){if(r||arguments.length===2)for(var o=0,n=t.length,i;o<n;o++)(i||!(o in t))&&(i||(i=Array.prototype.slice.call(t,0,o)),i[o]=t[o]);return e.concat(i||Array.prototype.slice.call(t))}var y;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(y||(y={}));var $;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})($||($={}));var Ge;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Ge||(Ge={}));function hn(e){return e.type===$.literal}function Yi(e){return e.type===$.argument}function zr(e){return e.type===$.number}function Fr(e){return e.type===$.date}function Gr(e){return e.type===$.time}function Vr(e){return e.type===$.select}function jr(e){return e.type===$.plural}function Xi(e){return e.type===$.pound}function qr(e){return e.type===$.tag}function Wr(e){return!!(e&&typeof e=="object"&&e.type===Ge.number)}function Zt(e){return!!(e&&typeof e=="object"&&e.type===Ge.dateTime)}var dn=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var pl=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Ki(e){var t={};return e.replace(pl,function(r){var o=r.length;switch(r[0]){case"G":t.era=o===4?"long":o===5?"narrow":"short";break;case"y":t.year=o===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][o-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][o-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=o===4?"short":o===5?"narrow":"short";break;case"e":if(o<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][o-4];break;case"c":if(o<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][o-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][o-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][o-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][o-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][o-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][o-1];break;case"s":t.second=["numeric","2-digit"][o-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=o<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Zi=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function ta(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Zi).filter(function(d){return d.length>0}),r=[],o=0,n=t;o<n.length;o++){var i=n[o],a=i.split("/");if(a.length===0)throw new Error("Invalid number skeleton");for(var s=a[0],c=a.slice(1),l=0,h=c;l<h.length;l++){var u=h[l];if(u.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function fl(e){return e.replace(/^(.*?)-/,"")}var Qi=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,ra=/^(@+)?(\+|#+)?[rs]?$/g,gl=/(\*)(0+)|(#+)(0+)|(0+)/g,oa=/^(0+)$/;function Ji(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(ra,function(r,o,n){return typeof n!="string"?(t.minimumSignificantDigits=o.length,t.maximumSignificantDigits=o.length):n==="+"?t.minimumSignificantDigits=o.length:o[0]==="#"?t.maximumSignificantDigits=o.length:(t.minimumSignificantDigits=o.length,t.maximumSignificantDigits=o.length+(typeof n=="string"?n.length:0)),""}),t}function na(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function xl(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!oa.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function ea(e){var t={},r=na(e);return r||t}function ia(e){for(var t={},r=0,o=e;r<o.length;r++){var n=o[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=fl(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=_(_(_({},t),{notation:"scientific"}),n.options.reduce(function(c,l){return _(_({},c),ea(l))},{}));continue;case"engineering":t=_(_(_({},t),{notation:"engineering"}),n.options.reduce(function(c,l){return _(_({},c),ea(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(gl,function(c,l,h,u,d,m){if(l)t.minimumIntegerDigits=h.length;else{if(u&&d)throw new Error("We currently do not support maximum integer digits");if(m)throw new Error("We currently do not support exact integer digits")}return""});continue}if(oa.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(Qi.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(Qi,function(c,l,h,u,d,m){return h==="*"?t.minimumFractionDigits=l.length:u&&u[0]==="#"?t.maximumFractionDigits=u.length:d&&m?(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length+m.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var i=n.options[0];i==="w"?t=_(_({},t),{trailingZeroDisplay:"stripIfInteger"}):i&&(t=_(_({},t),Ji(i)));continue}if(ra.test(n.stem)){t=_(_({},t),Ji(n.stem));continue}var a=na(n.stem);a&&(t=_(_({},t),a));var s=xl(n.stem);s&&(t=_(_({},t),s))}return t}var Qt={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function aa(e,t){for(var r="",o=0;o<e.length;o++){var n=e.charAt(o);if(n==="j"){for(var i=0;o+1<e.length&&e.charAt(o+1)===n;)i++,o++;var a=1+(i&1),s=i<2?1:3+(i>>1),c="a",l=bl(t);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;a-- >0;)r=l+r}else n==="J"?r+="H":r+=n}return r}function bl(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,o;r!=="root"&&(o=e.maximize().region);var n=Qt[o||""]||Qt[r||""]||Qt["".concat(r,"-001")]||Qt["001"];return n[0]}var un,vl=new RegExp("^".concat(dn.source,"*")),yl=new RegExp("".concat(dn.source,"*$"));function S(e,t){return{start:e,end:t}}var El=!!String.prototype.startsWith,Al=!!String.fromCodePoint,wl=!!Object.fromEntries,_l=!!String.prototype.codePointAt,Sl=!!String.prototype.trimStart,Tl=!!String.prototype.trimEnd,Cl=!!Number.isSafeInteger,Pl=Cl?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},pn=!0;try{sa=da("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),pn=((un=sa.exec("a"))===null||un===void 0?void 0:un[0])==="a"}catch{pn=!1}var sa,ca=El?function(t,r,o){return t.startsWith(r,o)}:function(t,r,o){return t.slice(o,o+r.length)===r},fn=Al?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var o="",n=t.length,i=0,a;n>i;){if(a=t[i++],a>1114111)throw RangeError(a+" is not a valid code point");o+=a<65536?String.fromCharCode(a):String.fromCharCode(((a-=65536)>>10)+55296,a%1024+56320)}return o},la=wl?Object.fromEntries:function(t){for(var r={},o=0,n=t;o<n.length;o++){var i=n[o],a=i[0],s=i[1];r[a]=s}return r},ha=_l?function(t,r){return t.codePointAt(r)}:function(t,r){var o=t.length;if(!(r<0||r>=o)){var n=t.charCodeAt(r),i;return n<55296||n>56319||r+1===o||(i=t.charCodeAt(r+1))<56320||i>57343?n:(n-55296<<10)+(i-56320)+65536}},kl=Sl?function(t){return t.trimStart()}:function(t){return t.replace(vl,"")},Ll=Tl?function(t){return t.trimEnd()}:function(t){return t.replace(yl,"")};function da(e,t){return new RegExp(e,t)}var gn;pn?(mn=da("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),gn=function(t,r){var o;mn.lastIndex=r;var n=mn.exec(t);return(o=n[1])!==null&&o!==void 0?o:""}):gn=function(t,r){for(var o=[];;){var n=ha(t,r);if(n===void 0||ma(n)||$l(n))break;o.push(n),r+=n>=65536?2:1}return fn.apply(void 0,o)};var mn,ua=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,o){for(var n=[];!this.isEOF();){var i=this.char();if(i===123){var a=this.parseArgument(t,o);if(a.err)return a;n.push(a.val)}else{if(i===125&&t>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:$.pound,location:S(s,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(o)break;return this.error(y.UNMATCHED_CLOSING_TAG,S(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&xn(this.peek()||0)){var a=this.parseTag(t,r);if(a.err)return a;n.push(a.val)}else{var a=this.parseLiteral(t,r);if(a.err)return a;n.push(a.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var o=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:$.literal,value:"<".concat(n,"/>"),location:S(o,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(t+1,r,!0);if(i.err)return i;var a=i.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!xn(this.char()))return this.error(y.INVALID_TAG,S(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return n!==l?this.error(y.UNMATCHED_CLOSING_TAG,S(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:$.tag,value:n,children:a,location:S(o,this.clonePosition())},err:null}:this.error(y.INVALID_TAG,S(s,this.clonePosition())))}else return this.error(y.UNCLOSED_TAG,S(o,this.clonePosition()))}else return this.error(y.INVALID_TAG,S(o,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Ol(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var o=this.clonePosition(),n="";;){var i=this.tryParseQuote(r);if(i){n+=i;continue}var a=this.tryParseUnquoted(t,r);if(a){n+=a;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var c=S(o,this.clonePosition());return{val:{type:$.literal,value:n,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Rl(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var o=this.char();if(o===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(o);this.bump()}return fn.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var o=this.char();return o===60||o===123||o===35&&(r==="plural"||r==="selectordinal")||o===125&&t>0?null:(this.bump(),fn(o))},e.prototype.parseArgument=function(t,r){var o=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,S(o,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(y.EMPTY_ARGUMENT,S(o,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(y.MALFORMED_ARGUMENT,S(o,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,S(o,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:$.argument,value:n,location:S(o,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,S(o,this.clonePosition())):this.parseArgumentOptions(t,r,n,o);default:return this.error(y.MALFORMED_ARGUMENT,S(o,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),o=gn(this.message,r),n=r+o.length;this.bumpTo(n);var i=this.clonePosition(),a=S(t,i);return{value:o,location:a}},e.prototype.parseArgumentOptions=function(t,r,o,n){var i,a=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(y.EXPECT_ARGUMENT_TYPE,S(a,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),u=this.parseSimpleArgStyleIfPossible();if(u.err)return u;var d=Ll(u.val);if(d.length===0)return this.error(y.EXPECT_ARGUMENT_STYLE,S(this.clonePosition(),this.clonePosition()));var m=S(h,this.clonePosition());l={style:d,styleLocation:m}}var x=this.tryParseArgumentClose(n);if(x.err)return x;var f=S(n,this.clonePosition());if(l&&ca(l?.style,"::",0)){var w=kl(l.style.slice(2));if(s==="number"){var u=this.parseNumberSkeletonFromString(w,l.styleLocation);return u.err?u:{val:{type:$.number,value:o,location:f,style:u.val},err:null}}else{if(w.length===0)return this.error(y.EXPECT_DATE_TIME_SKELETON,f);var E=w;this.locale&&(E=aa(w,this.locale));var d={type:Ge.dateTime,pattern:E,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?Ki(E):{}},A=s==="date"?$.date:$.time;return{val:{type:A,value:o,location:f,style:d},err:null}}}return{val:{type:s==="number"?$.number:s==="date"?$.date:$.time,value:o,location:f,style:(i=l?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var C=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(y.EXPECT_SELECT_ARGUMENT_OPTIONS,S(C,_({},C)));this.bumpSpace();var k=this.parseIdentifierIfPossible(),N=0;if(s!=="select"&&k.value==="offset"){if(!this.bumpIf(":"))return this.error(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,S(this.clonePosition(),this.clonePosition()));this.bumpSpace();var u=this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(u.err)return u;this.bumpSpace(),k=this.parseIdentifierIfPossible(),N=u.val}var H=this.tryParsePluralOrSelectOptions(t,s,r,k);if(H.err)return H;var x=this.tryParseArgumentClose(n);if(x.err)return x;var j=S(n,this.clonePosition());return s==="select"?{val:{type:$.select,value:o,options:la(H.val),location:j},err:null}:{val:{type:$.plural,value:o,options:la(H.val),offset:N,pluralType:s==="plural"?"cardinal":"ordinal",location:j},err:null}}default:return this.error(y.INVALID_ARGUMENT_TYPE,S(a,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,S(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var o=this.char();switch(o){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(y.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,S(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var o=[];try{o=ta(t)}catch{return this.error(y.INVALID_NUMBER_SKELETON,r)}return{val:{type:Ge.number,tokens:o,location:r,parsedOptions:this.shouldParseSkeletons?ia(o):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,o,n){for(var i,a=!1,s=[],c=new Set,l=n.value,h=n.location;;){if(l.length===0){var u=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var d=this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_SELECTOR,y.INVALID_PLURAL_ARGUMENT_SELECTOR);if(d.err)return d;h=S(u,this.clonePosition()),l=this.message.slice(u.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?y.DUPLICATE_SELECT_ARGUMENT_SELECTOR:y.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);l==="other"&&(a=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?y.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:y.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,S(this.clonePosition(),this.clonePosition()));var x=this.parseMessage(t+1,r,o);if(x.err)return x;var f=this.tryParseArgumentClose(m);if(f.err)return f;s.push([l,{value:x.val,location:S(m,this.clonePosition())}]),c.add(l),this.bumpSpace(),i=this.parseIdentifierIfPossible(),l=i.value,h=i.location}return s.length===0?this.error(r==="select"?y.EXPECT_SELECT_ARGUMENT_SELECTOR:y.EXPECT_PLURAL_ARGUMENT_SELECTOR,S(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!a?this.error(y.MISSING_OTHER_CLAUSE,S(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var o=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(o=-1);for(var i=!1,a=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)i=!0,a=a*10+(s-48),this.bump();else break}var c=S(n,this.clonePosition());return i?(a*=o,Pl(a)?{val:a,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=ha(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(ca(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),o=this.message.indexOf(t,r);return o>=0?(this.bumpTo(o),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&ma(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),o=this.message.charCodeAt(r+(t>=65536?2:1));return o??null},e}();function xn(e){return e>=97&&e<=122||e>=65&&e<=90}function Rl(e){return xn(e)||e===47}function Ol(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function ma(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function $l(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function bn(e){e.forEach(function(t){if(delete t.location,Vr(t)||jr(t))for(var r in t.options)delete t.options[r].location,bn(t.options[r].value);else zr(t)&&Wr(t.style)||(Fr(t)||Gr(t))&&Zt(t.style)?delete t.style.location:qr(t)&&bn(t.children)})}function pa(e,t){t===void 0&&(t={}),t=_({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new ua(e,t).parse();if(r.err){var o=SyntaxError(y[r.err.kind]);throw o.location=r.err.location,o.originalMessage=r.err.message,o}return t?.captureLocation||bn(r.val),r.val}function Jt(e,t){var r=t&&t.cache?t.cache:Ul,o=t&&t.serializer?t.serializer:Dl,n=t&&t.strategy?t.strategy:Nl;return n(e,{cache:r,serializer:o})}function Ml(e){return e==null||typeof e=="number"||typeof e=="boolean"}function fa(e,t,r,o){var n=Ml(o)?o:r(o),i=t.get(n);return typeof i>"u"&&(i=e.call(this,o),t.set(n,i)),i}function ga(e,t,r){var o=Array.prototype.slice.call(arguments,3),n=r(o),i=t.get(n);return typeof i>"u"&&(i=e.apply(this,o),t.set(n,i)),i}function vn(e,t,r,o,n){return r.bind(t,e,o,n)}function Nl(e,t){var r=e.length===1?fa:ga;return vn(e,this,r,t.cache.create(),t.serializer)}function Il(e,t){return vn(e,this,ga,t.cache.create(),t.serializer)}function Hl(e,t){return vn(e,this,fa,t.cache.create(),t.serializer)}var Dl=function(){return JSON.stringify(arguments)};function yn(){this.cache=Object.create(null)}yn.prototype.get=function(e){return this.cache[e]};yn.prototype.set=function(e,t){this.cache[e]=t};var Ul={create:function(){return new yn}},Yr={variadic:Il,monadic:Hl};var Ve;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Ve||(Ve={}));var er=function(e){Kt(t,e);function t(r,o,n){var i=e.call(this,r)||this;return i.code=o,i.originalMessage=n,i}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var En=function(e){Kt(t,e);function t(r,o,n,i){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(o,'". Options are "').concat(Object.keys(n).join('", "'),'"'),Ve.INVALID_VALUE,i)||this}return t}(er);var xa=function(e){Kt(t,e);function t(r,o,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(o),Ve.INVALID_VALUE,n)||this}return t}(er);var ba=function(e){Kt(t,e);function t(r,o){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(o,'"'),Ve.MISSING_VALUE,o)||this}return t}(er);var q;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(q||(q={}));function Bl(e){return e.length<2?e:e.reduce(function(t,r){var o=t[t.length-1];return!o||o.type!==q.literal||r.type!==q.literal?t.push(r):o.value+=r.value,t},[])}function zl(e){return typeof e=="function"}function tr(e,t,r,o,n,i,a){if(e.length===1&&hn(e[0]))return[{type:q.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var h=l[c];if(hn(h)){s.push({type:q.literal,value:h.value});continue}if(Xi(h)){typeof i=="number"&&s.push({type:q.literal,value:r.getNumberFormat(t).format(i)});continue}var u=h.value;if(!(n&&u in n))throw new ba(u,a);var d=n[u];if(Yi(h)){(!d||typeof d=="string"||typeof d=="number")&&(d=typeof d=="string"||typeof d=="number"?String(d):""),s.push({type:typeof d=="string"?q.literal:q.object,value:d});continue}if(Fr(h)){var m=typeof h.style=="string"?o.date[h.style]:Zt(h.style)?h.style.parsedOptions:void 0;s.push({type:q.literal,value:r.getDateTimeFormat(t,m).format(d)});continue}if(Gr(h)){var m=typeof h.style=="string"?o.time[h.style]:Zt(h.style)?h.style.parsedOptions:o.time.medium;s.push({type:q.literal,value:r.getDateTimeFormat(t,m).format(d)});continue}if(zr(h)){var m=typeof h.style=="string"?o.number[h.style]:Wr(h.style)?h.style.parsedOptions:void 0;m&&m.scale&&(d=d*(m.scale||1)),s.push({type:q.literal,value:r.getNumberFormat(t,m).format(d)});continue}if(qr(h)){var x=h.children,f=h.value,w=n[f];if(!zl(w))throw new xa(f,"function",a);var E=tr(x,t,r,o,n,i),A=w(E.map(function(N){return N.value}));Array.isArray(A)||(A=[A]),s.push.apply(s,A.map(function(N){return{type:typeof N=="string"?q.literal:q.object,value:N}}))}if(Vr(h)){var C=h.options[d]||h.options.other;if(!C)throw new En(h.value,d,Object.keys(h.options),a);s.push.apply(s,tr(C.value,t,r,o,n));continue}if(jr(h)){var C=h.options["=".concat(d)];if(!C){if(!Intl.PluralRules)throw new er(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Ve.MISSING_INTL_API,a);var k=r.getPluralRules(t,{type:h.pluralType}).select(d-(h.offset||0));C=h.options[k]||h.options.other}if(!C)throw new En(h.value,d,Object.keys(h.options),a);s.push.apply(s,tr(C.value,t,r,o,n,d-(h.offset||0)));continue}}return Bl(s)}function Fl(e,t){return t?_(_(_({},e||{}),t||{}),Object.keys(e).reduce(function(r,o){return r[o]=_(_({},e[o]),t[o]||{}),r},{})):e}function Gl(e,t){return t?Object.keys(e).reduce(function(r,o){return r[o]=Fl(e[o],t[o]),r},_({},e)):e}function An(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Vl(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Jt(function(){for(var t,r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];return new((t=Intl.NumberFormat).bind.apply(t,Br([void 0],r,!1)))},{cache:An(e.number),strategy:Yr.variadic}),getDateTimeFormat:Jt(function(){for(var t,r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];return new((t=Intl.DateTimeFormat).bind.apply(t,Br([void 0],r,!1)))},{cache:An(e.dateTime),strategy:Yr.variadic}),getPluralRules:Jt(function(){for(var t,r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];return new((t=Intl.PluralRules).bind.apply(t,Br([void 0],r,!1)))},{cache:An(e.pluralRules),strategy:Yr.variadic})}}var va=function(){function e(t,r,o,n){var i=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(a){var s=i.formatToParts(a);if(s.length===1)return s[0].value;var c=s.reduce(function(l,h){return!l.length||h.type!==q.literal||typeof l[l.length-1]!="string"?l.push(h.value):l[l.length-1]+=h.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(a){return tr(i.ast,i.locales,i.formatters,i.formats,a,void 0,i.message)},this.resolvedOptions=function(){return{locale:i.resolvedLocale.toString()}},this.getAst=function(){return i.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Gl(e.formats,o),this.formatters=n&&n.formatters||Vl(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=pa,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var ya=va;var jl=/[0-9\-+#]/,ql=/[^\d\-+#]/g;function Ea(e){return e.search(jl)}function Wl(e="#.##"){let t={},r=e.length,o=Ea(e);t.prefix=o>0?e.substring(0,o):"";let n=Ea(e.split("").reverse().join("")),i=r-n,a=e.substring(i,i+1),s=i+(a==="."||a===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(o,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(ql);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function Yl(e,t,r){let o=!1,n={value:e};e<0&&(o=!0,n.value=-n.value),n.sign=o?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let i=t.fraction&&t.fraction.lastIndexOf("0"),[a="0",s=""]=n.value.split(".");return(!s||s&&s.length<=i)&&(s=i<0?"":(+("0."+s)).toFixed(i+1).replace("0.","")),n.integer=a,n.fraction=s,Xl(n,t),(n.result==="0"||n.result==="")&&(o=!1,n.sign=""),!o&&t.maskHasPositiveSign?n.sign="+":o&&t.maskHasPositiveSign?n.sign="-":o&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function Xl(e,t){e.result="";let r=t.integer.split(t.separator),o=r.join(""),n=o&&o.indexOf("0");if(n>-1)for(;e.integer.length<o.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let i=r[1]&&r[r.length-1].length;if(i){let a=e.integer.length,s=a%i;for(let c=0;c<a;c++)e.result+=e.integer.charAt(c),!((c-s+1)%i)&&c<a-i&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Kl(e,t,r={}){if(!e||isNaN(Number(t)))return t;let o=Wl(e),n=Yl(t,o,r);return o.prefix+n.sign+n.result+o.suffix}var Aa=Kl;var wa=".",Zl=",",Sa=/^\s+/,Ta=/\s+$/,_a="&nbsp;",wn=e=>e*12,Ca=(e,t)=>{let{start:r,end:o,displaySummary:{amount:n,duration:i,minProductQuantity:a,outcomeType:s}={}}=e;if(!(n&&i&&s&&a))return!1;let c=t?new Date(t):new Date;if(!r||!o)return!1;let l=new Date(r),h=new Date(o);return c>=l&&c<=h},je={MONTH:"MONTH",YEAR:"YEAR"},Ql={[te.ANNUAL]:12,[te.MONTHLY]:1,[te.THREE_YEARS]:36,[te.TWO_YEARS]:24},_n=(e,t)=>({accept:e,round:t}),Jl=[_n(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),_n(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),_n(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],Sn={[He.YEAR]:{[te.MONTHLY]:je.MONTH,[te.ANNUAL]:je.YEAR},[He.MONTH]:{[te.MONTHLY]:je.MONTH}},eh=(e,t)=>e.indexOf(`'${t}'`)===0,th=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),o=ka(r);return!!o?t||(r=r.replace(/[,\.]0+/,o)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+oh(e)),r},rh=e=>{let t=nh(e),r=eh(e,t),o=e.replace(/'.*?'/,""),n=Sa.test(o)||Ta.test(o);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},Pa=e=>e.replace(Sa,_a).replace(Ta,_a),oh=e=>e.match(/#(.?)#/)?.[1]===wa?Zl:wa,nh=e=>e.match(/'(.*?)'/)?.[1]??"",ka=e=>e.match(/0(.?)0/)?.[1]??"";function pt({formatString:e,price:t,usePrecision:r,isIndianPrice:o=!1},n,i=a=>a){let{currencySymbol:a,isCurrencyFirst:s,hasCurrencySpace:c}=rh(e),l=r?ka(e):"",h=th(e,r),u=r?2:0,d=i(t,{currencySymbol:a}),m=o?d.toLocaleString("hi-IN",{minimumFractionDigits:u,maximumFractionDigits:u}):Aa(h,d),x=r?m.lastIndexOf(l):m.length,f=m.substring(0,x),w=m.substring(x+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,a),currencySymbol:a,decimals:w,decimalsDelimiter:l,hasCurrencySpace:c,integer:f,isCurrencyFirst:s,recurrenceTerm:n}}var La=e=>{let{commitment:t,term:r,usePrecision:o}=e,n=Ql[r]??1;return pt(e,n>1?je.MONTH:Sn[t]?.[r],i=>{let a={divisor:n,price:i,usePrecision:o},{round:s}=Jl.find(({accept:c})=>c(a));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(a)}`);return s(a)})},Ra=({commitment:e,term:t,...r})=>pt(r,Sn[e]?.[t]),Oa=e=>{let{commitment:t,instant:r,price:o,originalPrice:n,priceWithoutDiscount:i,promotion:a,quantity:s=1,term:c}=e;if(t===He.YEAR&&c===te.MONTHLY){if(!a)return pt(e,je.YEAR,wn);let{displaySummary:{outcomeType:l,duration:h,minProductQuantity:u=1}={}}=a;switch(l){case"PERCENTAGE_DISCOUNT":if(s>=u&&Ca(a,r)){let d=parseInt(h.replace("P","").replace("M",""));if(isNaN(d))return wn(o);let m=s*n*d,x=s*i*(12-d),f=Math.floor((m+x)*100)/100;return pt({...e,price:f},je.YEAR)}default:return pt(e,je.YEAR,()=>wn(i??o))}}return pt(e,Sn[t]?.[c])};var ih={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at"},ah=Ci("ConsonantTemplates/price"),sh=/<\/?[^>]+(>|$)/g,B={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},ft={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},ch="TAX_EXCLUSIVE",lh=e=>_i(e)?Object.entries(e).filter(([,t])=>ht(t)||kr(t)||t===!0).reduce((t,[r,o])=>t+` ${r}${o===!0?"":'="'+wi(o)+'"'}`,""):"",K=(e,t,r,o=!1)=>`<span class="${e}${t?"":" "+B.disabled}"${lh(r)}>${o?Pa(t):t??""}</span>`;function hh(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:o,decimals:n,decimalsDelimiter:i,hasCurrencySpace:a,integer:s,isCurrencyFirst:c,recurrenceLabel:l,perUnitLabel:h,taxInclusivityLabel:u},d={}){let m=K(B.currencySymbol,o),x=K(B.currencySpace,a?"&nbsp;":""),f="";return t?f=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),c&&(f+=m+x),f+=K(B.integer,s),f+=K(B.decimalsDelimiter,i),f+=K(B.decimals,n),c||(f+=x+m),f+=K(B.recurrence,l,null,!0),f+=K(B.unitType,h,null,!0),f+=K(B.taxInclusivity,u,!0),K(e,f,{...d})}var Z=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:o=!1,instant:n=void 0}={})=>({country:i,displayFormatted:a=!0,displayRecurrence:s=!0,displayPerUnit:c=!1,displayTax:l=!1,language:h,literals:u={},quantity:d=1}={},{commitment:m,offerSelectorIds:x,formatString:f,price:w,priceWithoutDiscount:E,taxDisplay:A,taxTerm:C,term:k,usePrecision:N,promotion:H}={},j={})=>{Object.entries({country:i,formatString:f,language:h,price:w}).forEach(([vo,yo])=>{if(yo==null)throw new Error(`Argument "${vo}" is missing for osi ${x?.toString()}, country ${i}, language ${h}`)});let W={...ih,...u},ne=`${h.toLowerCase()}-${i.toUpperCase()}`;function U(vo,yo){let Eo=W[vo];if(Eo==null)return"";try{return new ya(Eo.replace(sh,""),ne).format(yo)}catch{return ah.error("Failed to format literal:",Eo),""}}let Q=r&&E?E:w,se=t?La:Ra;o&&(se=Oa);let{accessiblePrice:Ae,recurrenceTerm:he,...Ne}=se({commitment:m,formatString:f,instant:n,isIndianPrice:i==="IN",originalPrice:w,priceWithoutDiscount:E,price:t?w:Q,promotion:H,quantity:d,term:k,usePrecision:N}),Ie="",at="",zt="";T(s)&&he&&(zt=U(ft.recurrenceLabel,{recurrenceTerm:he}));let xo="";T(c)&&(xo=U(ft.perUnitLabel,{perUnit:"LICENSE"}));let bo="";T(l)&&C&&(bo=U(A===ch?ft.taxExclusiveLabel:ft.taxInclusiveLabel,{taxTerm:C})),r&&(Ie=U(ft.strikethroughAriaLabel,{strikethroughPrice:Ie})),e&&(at=U(ft.alternativePriceAriaLabel,{alternativePrice:at}));let st=B.container;if(t&&(st+=" "+B.containerOptical),r&&(st+=" "+B.containerStrikethrough),e&&(st+=" "+B.containerAlternative),o&&(st+=" "+B.containerAnnual),T(a))return hh(st,{...Ne,accessibleLabel:Ie,altAccessibleLabel:at,recurrenceLabel:zt,perUnitLabel:xo,taxInclusivityLabel:bo},j);let{currencySymbol:bi,decimals:fc,decimalsDelimiter:gc,hasCurrencySpace:vi,integer:xc,isCurrencyFirst:bc}=Ne,ct=[xc,gc,fc];bc?(ct.unshift(vi?"\xA0":""),ct.unshift(bi)):(ct.push(vi?"\xA0":""),ct.push(bi)),ct.push(zt,xo,bo);let vc=ct.join("");return K(st,vc,j)},$a=()=>(e,t,r)=>{let n=(e.displayOldPrice===void 0||T(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${Z({isAlternativePrice:n})(e,t,r)}${n?"&nbsp;"+Z({displayStrikethrough:!0})(e,t,r):""}`},Ma=()=>(e,t,r)=>{let{instant:o}=e;try{o||(o=new URLSearchParams(document.location.search).get("instant")),o&&(o=new Date(o))}catch{o=void 0}let n={...e,displayTax:!1,displayPerUnit:!1},a=(e.displayOldPrice===void 0||T(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${a?Z({displayStrikethrough:!0})(n,t,r)+"&nbsp;":""}${Z({isAlternativePrice:a})(e,t,r)}${K(B.containerAnnualPrefix,"&nbsp;(")}${Z({displayAnnual:!0,instant:o})(n,t,r)}${K(B.containerAnnualSuffix,")")}`},Na=()=>(e,t,r)=>{let o={...e,displayTax:!1,displayPerUnit:!1};return`${Z({isAlternativePrice:e.displayOldPrice})(e,t,r)}${K(B.containerAnnualPrefix,"&nbsp;(")}${Z({displayAnnual:!0})(o,t,r)}${K(B.containerAnnualSuffix,")")}`};var Ia=Z(),Ha=$a(),Da=Z({displayOptical:!0}),Ua=Z({displayStrikethrough:!0}),Ba=Z({displayAnnual:!0}),za=Z({displayOptical:!0,isAlternativePrice:!0}),Fa=Z({isAlternativePrice:!0}),Ga=Na(),Va=Ma();var dh=(e,t)=>{if(!(!jt(e)||!jt(t)))return Math.floor((t-e)/t*100)},ja=()=>(e,t)=>{let{price:r,priceWithoutDiscount:o}=t,n=dh(r,o);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var qa=ja();var Wa=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","FR_fr","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],uh={INDIVIDUAL_COM:["ZA_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","ZA_en","SG_en","KR_ko"],TEAM_COM:["ZA_en","LT_lt","LV_lv","NG_en","ZA_en","CO_es","KR_ko"],INDIVIDUAL_EDU:["LT_lt","LV_lv","SA_en","SG_en"],TEAM_EDU:["SG_en","KR_ko"]},rr=class rr extends HTMLSpanElement{constructor(){super();p(this,"masElement",new mt(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-annual","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let o=Y();if(!o)return null;let{displayOldPrice:n,displayPerUnit:i,displayRecurrence:a,displayTax:s,displayAnnual:c,forceTaxExclusive:l,perpetual:h,promotionCode:u,quantity:d,alternativePrice:m,template:x,wcsOsi:f}=o.collectPriceOptions(r);return Ir(rr,{displayOldPrice:n,displayPerUnit:i,displayRecurrence:a,displayTax:s,displayAnnual:c,forceTaxExclusive:l,perpetual:h,promotionCode:u,quantity:d,alternativePrice:m,template:x,wcsOsi:f})}get isInlinePrice(){return!0}attributeChangedCallback(r,o,n){this.masElement.attributeChangedCallback(r,o,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}resolveDisplayTaxForGeoAndSegment(r,o,n,i){let a=`${r}_${o}`;if(Wa.includes(r)||Wa.includes(a))return!0;let s=uh[`${n}_${i}`];return s?!!(s.includes(r)||s.includes(a)):!1}async resolveDisplayTax(r,o){let[n]=await r.resolveOfferSelectors(o),i=Wt(await n,o);if(i?.length){let{country:a,language:s}=o,c=i[0],[l=""]=c.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(a,s,c.customerSegment,l)}}async render(r={}){if(!this.isConnected)return!1;let o=Y();if(!o)return!1;let n=o.collectPriceOptions(r,this);if(!n.wcsOsi.length)return!1;let i=this.masElement.togglePending(n);this.innerHTML="";let[a]=o.resolveOfferSelectors(n);return this.renderOffers(Wt(await a,n),n,i)}renderOffers(r,o={},n=void 0){if(!this.isConnected)return;let i=Y();if(!i)return!1;let a=i.collectPriceOptions({...this.dataset,...o},this);if(n??(n=this.masElement.togglePending(a)),r.length){if(this.masElement.toggleResolved(n,r,a)){this.innerHTML=i.buildPriceHTML(r,a);let s=this.closest("p, h3, div");if(!s||!s.querySelector('span[data-template="strikethrough"]')||s.querySelector(".alt-aria-label"))return!0;let c=s?.querySelectorAll('span[is="inline-price"]');return c.length>1&&c.length===s.querySelectorAll('span[data-template="strikethrough"]').length*2&&c.forEach(l=>{l.dataset.template!=="strikethrough"&&l.options&&!l.options.alternativePrice&&(l.options.alternativePrice=!0,l.innerHTML=i.buildPriceHTML(r,l.options))}),!0}}else{let s=new Error(`Not provided: ${a?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(n,s,a))return this.innerHTML="",!0}return!1}updateOptions(r){let o=Y();if(!o)return!1;let{alternativePrice:n,displayOldPrice:i,displayPerUnit:a,displayRecurrence:s,displayTax:c,forceTaxExclusive:l,perpetual:h,promotionCode:u,quantity:d,template:m,wcsOsi:x}=o.collectPriceOptions(r);return Hr(this,{alternativePrice:n,displayOldPrice:i,displayPerUnit:a,displayRecurrence:s,displayTax:c,forceTaxExclusive:l,perpetual:h,promotionCode:u,quantity:d,template:m,wcsOsi:x}),!0}};p(rr,"is","inline-price"),p(rr,"tag","span");var be=rr;window.customElements.get(be.is)||window.customElements.define(be.is,be,{extends:be.tag});function Ya({literals:e,providers:t,settings:r}){function o(a,s){let{country:c,displayOldPrice:l,displayPerUnit:h,displayRecurrence:u,displayTax:d,forceTaxExclusive:m,language:x,promotionCode:f,quantity:w,alternativePrice:E}=r,{displayOldPrice:A=l,displayPerUnit:C=h,displayRecurrence:k=u,displayTax:N=d,forceTaxExclusive:H=m,country:j=c,language:W=x,perpetual:ne,displayAnnual:U,promotionCode:Q=f,quantity:se=w,alternativePrice:Ae=E,template:he,wcsOsi:Ne,...Ie}=Object.assign({},s?.dataset??{},a??{}),at=qt({...Ie,country:j,displayOldPrice:T(A),displayPerUnit:T(C),displayRecurrence:T(k),displayTax:T(N),displayAnnual:T(U),forceTaxExclusive:T(H),language:W,perpetual:T(ne),promotionCode:Rr(Q).effectivePromoCode,quantity:dt(se,P.quantity),alternativePrice:T(Ae),template:he,wcsOsi:Mr(Ne)});if(s)for(let zt of t.price)zt(s,at);return at}function n(a,s){if(!Array.isArray(a)||!a.length||!s)return"";let{template:c}=s,l;switch(c){case"discount":l=qa;break;case"strikethrough":l=Ua;break;case"annual":l=Ba;break;default:s.template==="optical"&&s.alternativePrice?l=za:s.template==="optical"?l=Da:s.displayAnnual&&a[0].planType==="ABM"?l=s.promotionCode?Va:Ga:s.alternativePrice?l=Fa:l=s.promotionCode?Ha:Ia}let h=o(s);h.literals=Object.assign({},e.price,qt(s.literals??{}));let[u]=a;return u={...u,...u.priceDetails},l(h,u)}let i=be.createInlinePrice;return{InlinePrice:be,buildPriceHTML:n,collectPriceOptions:o,createInlinePrice:i}}function mh({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||P.language),t??(t=e?.split("_")?.[1]||P.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function Xa(e={}){let{commerce:t={}}=e,r=fe.PRODUCTION,o=Uo,n=I("checkoutClientId",t)??P.checkoutClientId,i=ze(I("checkoutWorkflow",t),ie,P.checkoutWorkflow),a=V.CHECKOUT;i===ie.V3&&(a=ze(I("checkoutWorkflowStep",t),V,P.checkoutWorkflowStep));let s=T(I("displayOldPrice",t),P.displayOldPrice),c=T(I("displayPerUnit",t),P.displayPerUnit),l=T(I("displayRecurrence",t),P.displayRecurrence),h=T(I("displayTax",t),P.displayTax),u=T(I("entitlement",t),P.entitlement),d=T(I("modal",t),P.modal),m=T(I("forceTaxExclusive",t),P.forceTaxExclusive),x=I("promotionCode",t)??P.promotionCode,f=dt(I("quantity",t)),w=I("wcsApiKey",t)??P.wcsApiKey,E=t?.env==="stage",A=_e.PUBLISHED;["true",""].includes(t.allowOverride)&&(E=(I(Ho,t,{metadata:!1})?.toLowerCase()??t?.env)==="stage",A=ze(I(Do,t),_e,A)),E&&(r=fe.STAGE,o=Bo);let k=I("mas-io-url")??e.masIOUrl??`https://www${r===fe.STAGE?".stage":""}.adobe.com/mas/io`;return{...mh(e),displayOldPrice:s,checkoutClientId:n,checkoutWorkflow:i,checkoutWorkflowStep:a,displayPerUnit:c,displayRecurrence:l,displayTax:h,entitlement:u,extraOptions:P.extraOptions,modal:d,env:r,forceTaxExclusive:m,promotionCode:x,quantity:f,alternativePrice:P.alternativePrice,wcsApiKey:w,wcsURL:o,landscape:A,masIOUrl:k}}async function Xr(e,t={},r=2,o=100){let n;for(let i=0;i<=r;i++)try{return await fetch(e,t)}catch(a){if(n=a,i>r)break;await new Promise(s=>setTimeout(s,o*(i+1)))}throw n}var Tn="wcs";function Ka({settings:e}){let t=ee.module(Tn),{env:r,wcsApiKey:o}=e,n=new Map,i=new Map,a,s=new Map;async function c(d,m,x=!0){let f=Y(),w=$o;t.debug("Fetching:",d);let E="",A;if(d.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let C=new Map(m),[k]=d.offerSelectorIds,N=Date.now()+Math.random().toString(36).substring(2,7),H=`${Tn}:${k}:${N}${Se}`,j=`${Tn}:${k}:${N}${Vt}`,W,ne;try{if(performance.mark(H),E=new URL(e.wcsURL),E.searchParams.set("offer_selector_ids",k),E.searchParams.set("country",d.country),E.searchParams.set("locale",d.locale),E.searchParams.set("landscape",r===fe.STAGE?"ALL":e.landscape),E.searchParams.set("api_key",o),d.language&&E.searchParams.set("language",d.language),d.promotionCode&&E.searchParams.set("promotion_code",d.promotionCode),d.currency&&E.searchParams.set("currency",d.currency),A=await Xr(E.toString(),{credentials:"omit"}),A.ok){let U=[];try{let Q=await A.json();t.debug("Fetched:",d,Q),U=Q.resolvedOffers??[]}catch(Q){t.error(`Error parsing JSON: ${Q.message}`,{...Q.context,...f?.duration})}U=U.map(Or),m.forEach(({resolve:Q},se)=>{let Ae=U.filter(({offerSelectorIds:he})=>he.includes(se)).flat();Ae.length&&(C.delete(se),m.delete(se),Q(Ae))})}else w=Oo}catch(U){w=`Network error: ${U.message}`}finally{({startTime:W,duration:ne}=performance.measure(j,H)),performance.clearMarks(H),performance.clearMeasures(j)}x&&m.size&&(t.debug("Missing:",{offerSelectorIds:[...m.keys()]}),m.forEach(U=>{U.reject(new ge(w,{...d,response:A,startTime:W,duration:ne,...f?.duration}))}))}function l(){clearTimeout(a);let d=[...i.values()];i.clear(),d.forEach(({options:m,promises:x})=>c(m,x))}function h(){let d=n.size;s=new Map(n),n.clear(),t.debug(`Moved ${d} cache entries to stale cache`)}function u({country:d,language:m,perpetual:x=!1,promotionCode:f="",wcsOsi:w=[]}){let E=`${m}_${d}`;d!=="GB"&&(m=x?"EN":"MULT");let A=[d,m,f].filter(C=>C).join("-").toLowerCase();return w.map(C=>{let k=`${C}-${A}`;if(n.has(k))return n.get(k);let N=new Promise((H,j)=>{let W=i.get(A);if(!W){let ne={country:d,locale:E,offerSelectorIds:[]};d!=="GB"&&(ne.language=m),W={options:ne,promises:new Map},i.set(A,W)}f&&(W.options.promotionCode=f),W.options.offerSelectorIds.push(C),W.promises.set(C,{resolve:H,reject:j}),l()}).catch(H=>{if(s.has(k))return s.get(k);throw H});return n.set(k,N),N})}return{Commitment:He,PlanType:ki,Term:te,applyPlanType:Or,resolveOfferSelectors:u,flushWcsCacheInternal:h}}var Za="mas-commerce-service",Qa="mas:start",Ja="mas:ready",es="mas-commerce-service:initTime",or,Kr,ts,Cn=class extends HTMLElement{constructor(){super(...arguments);L(this,Kr);L(this,or);p(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(o,n,i)=>{let a=await r?.(o,n,this.imsSignedInPromise,i);return a||null})}activate(){let r=b(this,Kr,ts),o=Object.freeze(Xa(r));ut(r.lana);let n=ee.init(r.hostEnv).module("service");n.debug("Activating:",r);let a={price:Wi(o)},s={checkout:new Set,price:new Set},c={literals:a,providers:s,settings:o};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...Vi(c),...ji(c),...Ya(c),...Ka(c),...Go,Log:ee,get defaults(){return P},get log(){return ee},get providers(){return{checkout(h){return s.checkout.add(h),()=>s.checkout.delete(h)},price(h){return s.price.add(h),()=>s.price.delete(h)}}},get settings(){return o}})),n.debug("Activated:",{literals:a,settings:o});let l=new CustomEvent(Tr,{bubbles:!0,cancelable:!1,detail:this});performance.mark(Ja),R(this,or,performance.measure(es,Qa,Ja)?.duration),this.dispatchEvent(l),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(Qa),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(Ft).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh()),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{[es]:b(this,or)}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:n})=>n>this.lastLoggingTime).filter(({transferSize:n,duration:i,responseStatus:a})=>n===0&&i===0&&a<200||a>=400),o=Array.from(new Map(r.map(n=>[n.name,n])).values());if(o.some(({name:n})=>/(\/fragments\/|web_commerce_artifact)/.test(n))){let n=o.map(({name:i})=>i);this.log.error("Failed requests:",{failedUrls:n,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};or=new WeakMap,Kr=new WeakSet,ts=function(){let r=this.getAttribute("env")??"prod",o={hostEnv:{name:r},commerce:{env:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language"].forEach(n=>{let i=this.getAttribute(n);i&&(o[n]=i)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(n=>{let i=this.getAttribute(n);if(i!=null){let a=n.replace(/-([a-z])/g,s=>s[1].toUpperCase());o.commerce[a]=i}}),o};window.customElements.get(Za)||window.customElements.define(Za,Cn);var nr=class nr extends Ur(HTMLButtonElement){static createCheckoutButton(t={},r=""){return Dr(nr,t,r)}setCheckoutUrl(t){this.setAttribute("data-href",t)}get href(){return this.getAttribute("data-href")}get isCheckoutButton(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}this.href&&(window.location.href=this.href)}};p(nr,"is","checkout-button"),p(nr,"tag","button");var gt=nr;window.customElements.get(gt.is)||window.customElements.define(gt.is,gt,{extends:gt.tag});var ph="mas-commerce-service";function rs(e,t){let r;return function(){let o=this,n=arguments;clearTimeout(r),r=setTimeout(()=>e.apply(o,n),t)}}function qe(e,t={},r=null,o=null){let n=o?document.createElement(e,{is:o}):document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[i,a]of Object.entries(t))n.setAttribute(i,a);return n}function Zr(){return window.matchMedia("(max-width: 767px)")}function xt(){return Zr().matches}function os(){return window.matchMedia("(max-width: 1024px)").matches}function bt(){return document.getElementsByTagName(ph)?.[0]}function fh(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var ir,We=class We extends HTMLAnchorElement{constructor(){super();L(this,ir,!1);this.setAttribute("is",We.is)}get isUptLink(){return!0}initializeWcsData(r,o){this.setAttribute("data-wcs-osi",r),o&&this.setAttribute("data-promotion-code",o),R(this,ir,!0),this.composePromoTermsUrl()}attributeChangedCallback(r,o,n){b(this,ir)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let r=this.getAttribute("data-wcs-osi");if(!r){let u=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${u}`);return}let o=bt(),n=[r],i=this.getAttribute("data-promotion-code"),{country:a,language:s,env:c}=o.settings,l={country:a,language:s,wcsOsi:n,promotionCode:i},h=o.resolveOfferSelectors(l);Promise.all(h).then(([[u]])=>{let d=`locale=${s}_${a}&country=${a}&offer_id=${u.offerId}`;i&&(d+=`&promotion_code=${encodeURIComponent(i)}`),this.href=`${fh(c)}?${d}`}).catch(u=>{console.error(`Could not resolve offer selectors for id: ${r}.`,u.message)})}static createFrom(r){let o=new We;for(let n of r.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?o.setAttribute("class",n.value.replace("upt-link","").trim()):o.setAttribute(n.name,n.value));return o.innerHTML=r.innerHTML,o.setAttribute("tabindex",0),o}};ir=new WeakMap,p(We,"is","upt-link"),p(We,"tag","a"),p(We,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var Te=We;window.customElements.get(Te.is)||window.customElements.define(Te.is,Te,{extends:Te.tag});var Qr=window,eo=Qr.ShadowRoot&&(Qr.ShadyCSS===void 0||Qr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,is=Symbol(),ns=new WeakMap,Jr=class{constructor(t,r,o){if(this._$cssResult$=!0,o!==is)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(eo&&t===void 0){let o=r!==void 0&&r.length===1;o&&(t=ns.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&ns.set(r,t))}return t}toString(){return this.cssText}},as=e=>new Jr(typeof e=="string"?e:e+"",void 0,is);var Pn=(e,t)=>{eo?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let o=document.createElement("style"),n=Qr.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=r.cssText,e.appendChild(o)})},to=eo?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let o of t.cssRules)r+=o.cssText;return as(r)})(e):e;var kn,ro=window,ss=ro.trustedTypes,gh=ss?ss.emptyScript:"",cs=ro.reactiveElementPolyfillSupport,Rn={toAttribute(e,t){switch(t){case Boolean:e=e?gh:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},ls=(e,t)=>t!==e&&(t==t||e==e),Ln={attribute:!0,type:String,converter:Rn,reflect:!1,hasChanged:ls},On="finalized",Ye=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,o)=>{let n=this._$Ep(o,r);n!==void 0&&(this._$Ev.set(n,o),t.push(n))}),t}static createProperty(t,r=Ln){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let o=typeof t=="symbol"?Symbol():"__"+t,n=this.getPropertyDescriptor(t,o,r);n!==void 0&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,r,o){return{get(){return this[r]},set(n){let i=this[t];this[r]=n,this.requestUpdate(t,i,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Ln}static finalize(){if(this.hasOwnProperty(On))return!1;this[On]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,o=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let n of o)this.createProperty(n,r[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)r.unshift(to(n))}else t!==void 0&&r.push(to(t));return r}static _$Ep(t,r){let o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,o;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)===null||o===void 0||o.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Pn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var o;return(o=r.hostConnected)===null||o===void 0?void 0:o.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var o;return(o=r.hostDisconnected)===null||o===void 0?void 0:o.call(r)})}attributeChangedCallback(t,r,o){this._$AK(t,o)}_$EO(t,r,o=Ln){var n;let i=this.constructor._$Ep(t,o);if(i!==void 0&&o.reflect===!0){let a=(((n=o.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?o.converter:Rn).toAttribute(r,o.type);this._$El=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$El=null}}_$AK(t,r){var o;let n=this.constructor,i=n._$Ev.get(t);if(i!==void 0&&this._$El!==i){let a=n.getPropertyOptions(i),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)===null||o===void 0?void 0:o.fromAttribute)!==void 0?a.converter:Rn;this._$El=i,this[i]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(t,r,o){let n=!0;t!==void 0&&(((o=o||this.constructor.getPropertyOptions(t)).hasChanged||ls)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),o.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,o))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,i)=>this[i]=n),this._$Ei=void 0);let r=!1,o=this._$AL;try{r=this.shouldUpdate(o),r?(this.willUpdate(o),(t=this._$ES)===null||t===void 0||t.forEach(n=>{var i;return(i=n.hostUpdate)===null||i===void 0?void 0:i.call(n)}),this.update(o)):this._$Ek()}catch(n){throw r=!1,this._$Ek(),n}r&&this._$AE(o)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(o=>{var n;return(n=o.hostUpdated)===null||n===void 0?void 0:n.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,o)=>this._$EO(o,this[o],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Ye[On]=!0,Ye.elementProperties=new Map,Ye.elementStyles=[],Ye.shadowRootOptions={mode:"open"},cs?.({ReactiveElement:Ye}),((kn=ro.reactiveElementVersions)!==null&&kn!==void 0?kn:ro.reactiveElementVersions=[]).push("1.6.3");var $n,oo=window,vt=oo.trustedTypes,hs=vt?vt.createPolicy("lit-html",{createHTML:e=>e}):void 0,Nn="$lit$",Ce=`lit$${(Math.random()+"").slice(9)}$`,xs="?"+Ce,xh=`<${xs}>`,Ze=document,no=()=>Ze.createComment(""),sr=e=>e===null||typeof e!="object"&&typeof e!="function",bs=Array.isArray,bh=e=>bs(e)||typeof e?.[Symbol.iterator]=="function",Mn=`[ 	
\f\r]`,ar=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ds=/-->/g,us=/>/g,Xe=RegExp(`>|${Mn}(?:([^\\s"'>=/]+)(${Mn}*=${Mn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ms=/'/g,ps=/"/g,vs=/^(?:script|style|textarea|title)$/i,ys=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),up=ys(1),mp=ys(2),cr=Symbol.for("lit-noChange"),z=Symbol.for("lit-nothing"),fs=new WeakMap,Ke=Ze.createTreeWalker(Ze,129,null,!1);function Es(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return hs!==void 0?hs.createHTML(t):t}var vh=(e,t)=>{let r=e.length-1,o=[],n,i=t===2?"<svg>":"",a=ar;for(let s=0;s<r;s++){let c=e[s],l,h,u=-1,d=0;for(;d<c.length&&(a.lastIndex=d,h=a.exec(c),h!==null);)d=a.lastIndex,a===ar?h[1]==="!--"?a=ds:h[1]!==void 0?a=us:h[2]!==void 0?(vs.test(h[2])&&(n=RegExp("</"+h[2],"g")),a=Xe):h[3]!==void 0&&(a=Xe):a===Xe?h[0]===">"?(a=n??ar,u=-1):h[1]===void 0?u=-2:(u=a.lastIndex-h[2].length,l=h[1],a=h[3]===void 0?Xe:h[3]==='"'?ps:ms):a===ps||a===ms?a=Xe:a===ds||a===us?a=ar:(a=Xe,n=void 0);let m=a===Xe&&e[s+1].startsWith("/>")?" ":"";i+=a===ar?c+xh:u>=0?(o.push(l),c.slice(0,u)+Nn+c.slice(u)+Ce+m):c+Ce+(u===-2?(o.push(void 0),s):m)}return[Es(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),o]},lr=class e{constructor({strings:t,_$litType$:r},o){let n;this.parts=[];let i=0,a=0,s=t.length-1,c=this.parts,[l,h]=vh(t,r);if(this.el=e.createElement(l,o),Ke.currentNode=this.el.content,r===2){let u=this.el.content,d=u.firstChild;d.remove(),u.append(...d.childNodes)}for(;(n=Ke.nextNode())!==null&&c.length<s;){if(n.nodeType===1){if(n.hasAttributes()){let u=[];for(let d of n.getAttributeNames())if(d.endsWith(Nn)||d.startsWith(Ce)){let m=h[a++];if(u.push(d),m!==void 0){let x=n.getAttribute(m.toLowerCase()+Nn).split(Ce),f=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:f[2],strings:x,ctor:f[1]==="."?Hn:f[1]==="?"?Dn:f[1]==="@"?Un:Et})}else c.push({type:6,index:i})}for(let d of u)n.removeAttribute(d)}if(vs.test(n.tagName)){let u=n.textContent.split(Ce),d=u.length-1;if(d>0){n.textContent=vt?vt.emptyScript:"";for(let m=0;m<d;m++)n.append(u[m],no()),Ke.nextNode(),c.push({type:2,index:++i});n.append(u[d],no())}}}else if(n.nodeType===8)if(n.data===xs)c.push({type:2,index:i});else{let u=-1;for(;(u=n.data.indexOf(Ce,u+1))!==-1;)c.push({type:7,index:i}),u+=Ce.length-1}i++}}static createElement(t,r){let o=Ze.createElement("template");return o.innerHTML=t,o}};function yt(e,t,r=e,o){var n,i,a,s;if(t===cr)return t;let c=o!==void 0?(n=r._$Co)===null||n===void 0?void 0:n[o]:r._$Cl,l=sr(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,o)),o!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[o]=c:r._$Cl=c),c!==void 0&&(t=yt(e,c._$AS(e,t.values),c,o)),t}var In=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:o},parts:n}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:Ze).importNode(o,!0);Ke.currentNode=i;let a=Ke.nextNode(),s=0,c=0,l=n[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new io(a,a.nextSibling,this,t):l.type===1?h=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(h=new Bn(a,this,t)),this._$AV.push(h),l=n[++c]}s!==l?.index&&(a=Ke.nextNode(),s++)}return Ke.currentNode=Ze,i}v(t){let r=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,r),r+=o.strings.length-2):o._$AI(t[r])),r++}},io=class e{constructor(t,r,o,n){var i;this.type=2,this._$AH=z,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=o,this.options=n,this._$Cp=(i=n?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=yt(this,t,r),sr(t)?t===z||t==null||t===""?(this._$AH!==z&&this._$AR(),this._$AH=z):t!==this._$AH&&t!==cr&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):bh(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==z&&sr(this._$AH)?this._$AA.nextSibling.data=t:this.$(Ze.createTextNode(t)),this._$AH=t}g(t){var r;let{values:o,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=lr.createElement(Es(n.h,n.h[0]),this.options)),n);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(o);else{let a=new In(i,this),s=a.u(this.options);a.v(o),this.$(s),this._$AH=a}}_$AC(t){let r=fs.get(t.strings);return r===void 0&&fs.set(t.strings,r=new lr(t)),r}T(t){bs(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,o,n=0;for(let i of t)n===r.length?r.push(o=new e(this.k(no()),this.k(no()),this,this.options)):o=r[n],o._$AI(i),n++;n<r.length&&(this._$AR(o&&o._$AB.nextSibling,n),r.length=n)}_$AR(t=this._$AA.nextSibling,r){var o;for((o=this._$AP)===null||o===void 0||o.call(this,!1,!0,r);t&&t!==this._$AB;){let n=t.nextSibling;t.remove(),t=n}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},Et=class{constructor(t,r,o,n,i){this.type=1,this._$AH=z,this._$AN=void 0,this.element=t,this.name=r,this._$AM=n,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=z}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,o,n){let i=this.strings,a=!1;if(i===void 0)t=yt(this,t,r,0),a=!sr(t)||t!==this._$AH&&t!==cr,a&&(this._$AH=t);else{let s=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=yt(this,s[o+c],r,c),l===cr&&(l=this._$AH[c]),a||(a=!sr(l)||l!==this._$AH[c]),l===z?t=z:t!==z&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}a&&!n&&this.j(t)}j(t){t===z?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Hn=class extends Et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===z?void 0:t}},yh=vt?vt.emptyScript:"",Dn=class extends Et{constructor(){super(...arguments),this.type=4}j(t){t&&t!==z?this.element.setAttribute(this.name,yh):this.element.removeAttribute(this.name)}},Un=class extends Et{constructor(t,r,o,n,i){super(t,r,o,n,i),this.type=5}_$AI(t,r=this){var o;if((t=(o=yt(this,t,r,0))!==null&&o!==void 0?o:z)===cr)return;let n=this._$AH,i=t===z&&n!==z||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,a=t!==z&&(n===z||i);i&&this.element.removeEventListener(this.name,this,n),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,o;typeof this._$AH=="function"?this._$AH.call((o=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&o!==void 0?o:this.element,t):this._$AH.handleEvent(t)}},Bn=class{constructor(t,r,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){yt(this,t)}};var gs=oo.litHtmlPolyfillSupport;gs?.(lr,io),(($n=oo.litHtmlVersions)!==null&&$n!==void 0?$n:oo.litHtmlVersions=[]).push("2.8.0");var ao=window,so=ao.ShadowRoot&&(ao.ShadyCSS===void 0||ao.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zn=Symbol(),As=new WeakMap,hr=class{constructor(t,r,o){if(this._$cssResult$=!0,o!==zn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(so&&t===void 0){let o=r!==void 0&&r.length===1;o&&(t=As.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&As.set(r,t))}return t}toString(){return this.cssText}},Pe=e=>new hr(typeof e=="string"?e:e+"",void 0,zn),v=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((o,n,i)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+e[i+1],e[0]);return new hr(r,e,zn)},Fn=(e,t)=>{so?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let o=document.createElement("style"),n=ao.litNonce;n!==void 0&&o.setAttribute("nonce",n),o.textContent=r.cssText,e.appendChild(o)})},co=so?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let o of t.cssRules)r+=o.cssText;return Pe(r)})(e):e;var Gn,lo=window,ws=lo.trustedTypes,Eh=ws?ws.emptyScript:"",_s=lo.reactiveElementPolyfillSupport,jn={toAttribute(e,t){switch(t){case Boolean:e=e?Eh:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},Ss=(e,t)=>t!==e&&(t==t||e==e),Vn={attribute:!0,type:String,converter:jn,reflect:!1,hasChanged:Ss},qn="finalized",ve=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,o)=>{let n=this._$Ep(o,r);n!==void 0&&(this._$Ev.set(n,o),t.push(n))}),t}static createProperty(t,r=Vn){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let o=typeof t=="symbol"?Symbol():"__"+t,n=this.getPropertyDescriptor(t,o,r);n!==void 0&&Object.defineProperty(this.prototype,t,n)}}static getPropertyDescriptor(t,r,o){return{get(){return this[r]},set(n){let i=this[t];this[r]=n,this.requestUpdate(t,i,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Vn}static finalize(){if(this.hasOwnProperty(qn))return!1;this[qn]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,o=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let n of o)this.createProperty(n,r[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let o=new Set(t.flat(1/0).reverse());for(let n of o)r.unshift(co(n))}else t!==void 0&&r.push(co(t));return r}static _$Ep(t,r){let o=r.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,o;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((o=t.hostConnected)===null||o===void 0||o.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Fn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var o;return(o=r.hostConnected)===null||o===void 0?void 0:o.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var o;return(o=r.hostDisconnected)===null||o===void 0?void 0:o.call(r)})}attributeChangedCallback(t,r,o){this._$AK(t,o)}_$EO(t,r,o=Vn){var n;let i=this.constructor._$Ep(t,o);if(i!==void 0&&o.reflect===!0){let a=(((n=o.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?o.converter:jn).toAttribute(r,o.type);this._$El=t,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$El=null}}_$AK(t,r){var o;let n=this.constructor,i=n._$Ev.get(t);if(i!==void 0&&this._$El!==i){let a=n.getPropertyOptions(i),s=typeof a.converter=="function"?{fromAttribute:a.converter}:((o=a.converter)===null||o===void 0?void 0:o.fromAttribute)!==void 0?a.converter:jn;this._$El=i,this[i]=s.fromAttribute(r,a.type),this._$El=null}}requestUpdate(t,r,o){let n=!0;t!==void 0&&(((o=o||this.constructor.getPropertyOptions(t)).hasChanged||Ss)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),o.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,o))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,i)=>this[i]=n),this._$Ei=void 0);let r=!1,o=this._$AL;try{r=this.shouldUpdate(o),r?(this.willUpdate(o),(t=this._$ES)===null||t===void 0||t.forEach(n=>{var i;return(i=n.hostUpdate)===null||i===void 0?void 0:i.call(n)}),this.update(o)):this._$Ek()}catch(n){throw r=!1,this._$Ek(),n}r&&this._$AE(o)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(o=>{var n;return(n=o.hostUpdated)===null||n===void 0?void 0:n.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,o)=>this._$EO(o,this[o],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};ve[qn]=!0,ve.elementProperties=new Map,ve.elementStyles=[],ve.shadowRootOptions={mode:"open"},_s?.({ReactiveElement:ve}),((Gn=lo.reactiveElementVersions)!==null&&Gn!==void 0?Gn:lo.reactiveElementVersions=[]).push("1.6.3");var Wn,ho=window,At=ho.trustedTypes,Ts=At?At.createPolicy("lit-html",{createHTML:e=>e}):void 0,Xn="$lit$",ke=`lit$${(Math.random()+"").slice(9)}$`,$s="?"+ke,Ah=`<${$s}>`,et=document,ur=()=>et.createComment(""),mr=e=>e===null||typeof e!="object"&&typeof e!="function",Ms=Array.isArray,wh=e=>Ms(e)||typeof e?.[Symbol.iterator]=="function",Yn=`[ 	
\f\r]`,dr=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Cs=/-->/g,Ps=/>/g,Qe=RegExp(`>|${Yn}(?:([^\\s"'>=/]+)(${Yn}*=${Yn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ks=/'/g,Ls=/"/g,Ns=/^(?:script|style|textarea|title)$/i,Is=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),g=Is(1),vp=Is(2),tt=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),Rs=new WeakMap,Je=et.createTreeWalker(et,129,null,!1);function Hs(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ts!==void 0?Ts.createHTML(t):t}var _h=(e,t)=>{let r=e.length-1,o=[],n,i=t===2?"<svg>":"",a=dr;for(let s=0;s<r;s++){let c=e[s],l,h,u=-1,d=0;for(;d<c.length&&(a.lastIndex=d,h=a.exec(c),h!==null);)d=a.lastIndex,a===dr?h[1]==="!--"?a=Cs:h[1]!==void 0?a=Ps:h[2]!==void 0?(Ns.test(h[2])&&(n=RegExp("</"+h[2],"g")),a=Qe):h[3]!==void 0&&(a=Qe):a===Qe?h[0]===">"?(a=n??dr,u=-1):h[1]===void 0?u=-2:(u=a.lastIndex-h[2].length,l=h[1],a=h[3]===void 0?Qe:h[3]==='"'?Ls:ks):a===Ls||a===ks?a=Qe:a===Cs||a===Ps?a=dr:(a=Qe,n=void 0);let m=a===Qe&&e[s+1].startsWith("/>")?" ":"";i+=a===dr?c+Ah:u>=0?(o.push(l),c.slice(0,u)+Xn+c.slice(u)+ke+m):c+ke+(u===-2?(o.push(void 0),s):m)}return[Hs(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),o]},pr=class e{constructor({strings:t,_$litType$:r},o){let n;this.parts=[];let i=0,a=0,s=t.length-1,c=this.parts,[l,h]=_h(t,r);if(this.el=e.createElement(l,o),Je.currentNode=this.el.content,r===2){let u=this.el.content,d=u.firstChild;d.remove(),u.append(...d.childNodes)}for(;(n=Je.nextNode())!==null&&c.length<s;){if(n.nodeType===1){if(n.hasAttributes()){let u=[];for(let d of n.getAttributeNames())if(d.endsWith(Xn)||d.startsWith(ke)){let m=h[a++];if(u.push(d),m!==void 0){let x=n.getAttribute(m.toLowerCase()+Xn).split(ke),f=/([.?@])?(.*)/.exec(m);c.push({type:1,index:i,name:f[2],strings:x,ctor:f[1]==="."?Zn:f[1]==="?"?Qn:f[1]==="@"?Jn:_t})}else c.push({type:6,index:i})}for(let d of u)n.removeAttribute(d)}if(Ns.test(n.tagName)){let u=n.textContent.split(ke),d=u.length-1;if(d>0){n.textContent=At?At.emptyScript:"";for(let m=0;m<d;m++)n.append(u[m],ur()),Je.nextNode(),c.push({type:2,index:++i});n.append(u[d],ur())}}}else if(n.nodeType===8)if(n.data===$s)c.push({type:2,index:i});else{let u=-1;for(;(u=n.data.indexOf(ke,u+1))!==-1;)c.push({type:7,index:i}),u+=ke.length-1}i++}}static createElement(t,r){let o=et.createElement("template");return o.innerHTML=t,o}};function wt(e,t,r=e,o){var n,i,a,s;if(t===tt)return t;let c=o!==void 0?(n=r._$Co)===null||n===void 0?void 0:n[o]:r._$Cl,l=mr(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,o)),o!==void 0?((a=(s=r)._$Co)!==null&&a!==void 0?a:s._$Co=[])[o]=c:r._$Cl=c),c!==void 0&&(t=wt(e,c._$AS(e,t.values),c,o)),t}var Kn=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:o},parts:n}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:et).importNode(o,!0);Je.currentNode=i;let a=Je.nextNode(),s=0,c=0,l=n[0];for(;l!==void 0;){if(s===l.index){let h;l.type===2?h=new fr(a,a.nextSibling,this,t):l.type===1?h=new l.ctor(a,l.name,l.strings,this,t):l.type===6&&(h=new ei(a,this,t)),this._$AV.push(h),l=n[++c]}s!==l?.index&&(a=Je.nextNode(),s++)}return Je.currentNode=et,i}v(t){let r=0;for(let o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,r),r+=o.strings.length-2):o._$AI(t[r])),r++}},fr=class e{constructor(t,r,o,n){var i;this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=o,this.options=n,this._$Cp=(i=n?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=wt(this,t,r),mr(t)?t===F||t==null||t===""?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):wh(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==F&&mr(this._$AH)?this._$AA.nextSibling.data=t:this.$(et.createTextNode(t)),this._$AH=t}g(t){var r;let{values:o,_$litType$:n}=t,i=typeof n=="number"?this._$AC(t):(n.el===void 0&&(n.el=pr.createElement(Hs(n.h,n.h[0]),this.options)),n);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(o);else{let a=new Kn(i,this),s=a.u(this.options);a.v(o),this.$(s),this._$AH=a}}_$AC(t){let r=Rs.get(t.strings);return r===void 0&&Rs.set(t.strings,r=new pr(t)),r}T(t){Ms(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,o,n=0;for(let i of t)n===r.length?r.push(o=new e(this.k(ur()),this.k(ur()),this,this.options)):o=r[n],o._$AI(i),n++;n<r.length&&(this._$AR(o&&o._$AB.nextSibling,n),r.length=n)}_$AR(t=this._$AA.nextSibling,r){var o;for((o=this._$AP)===null||o===void 0||o.call(this,!1,!0,r);t&&t!==this._$AB;){let n=t.nextSibling;t.remove(),t=n}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},_t=class{constructor(t,r,o,n,i){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=r,this._$AM=n,this.options=i,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=F}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,o,n){let i=this.strings,a=!1;if(i===void 0)t=wt(this,t,r,0),a=!mr(t)||t!==this._$AH&&t!==tt,a&&(this._$AH=t);else{let s=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=wt(this,s[o+c],r,c),l===tt&&(l=this._$AH[c]),a||(a=!mr(l)||l!==this._$AH[c]),l===F?t=F:t!==F&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}a&&!n&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Zn=class extends _t{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}},Sh=At?At.emptyScript:"",Qn=class extends _t{constructor(){super(...arguments),this.type=4}j(t){t&&t!==F?this.element.setAttribute(this.name,Sh):this.element.removeAttribute(this.name)}},Jn=class extends _t{constructor(t,r,o,n,i){super(t,r,o,n,i),this.type=5}_$AI(t,r=this){var o;if((t=(o=wt(this,t,r,0))!==null&&o!==void 0?o:F)===tt)return;let n=this._$AH,i=t===F&&n!==F||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,a=t!==F&&(n===F||i);i&&this.element.removeEventListener(this.name,this,n),a&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,o;typeof this._$AH=="function"?this._$AH.call((o=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&o!==void 0?o:this.element,t):this._$AH.handleEvent(t)}},ei=class{constructor(t,r,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){wt(this,t)}};var Os=ho.litHtmlPolyfillSupport;Os?.(pr,fr),((Wn=ho.litHtmlVersions)!==null&&Wn!==void 0?Wn:ho.litHtmlVersions=[]).push("2.8.0");var Ds=(e,t,r)=>{var o,n;let i=(o=r?.renderBefore)!==null&&o!==void 0?o:t,a=i._$litPart$;if(a===void 0){let s=(n=r?.renderBefore)!==null&&n!==void 0?n:null;i._$litPart$=a=new fr(t.insertBefore(ur(),s),s,void 0,r??{})}return a._$AI(e),a};var ti,ri;var M=class extends ve{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let o=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=o.firstChild),o}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ds(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return tt}};M.finalized=!0,M._$litElement$=!0,(ti=globalThis.litElementHydrateSupport)===null||ti===void 0||ti.call(globalThis,{LitElement:M});var Us=globalThis.litElementPolyfillSupport;Us?.({LitElement:M});((ri=globalThis.litElementVersions)!==null&&ri!==void 0?ri:globalThis.litElementVersions=[]).push("3.3.3");var Le="(max-width: 767px)",uo="(max-width: 1199px)",G="(min-width: 768px)",D="(min-width: 1200px)",ce="(min-width: 1600px)";var Bs=v`
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
`,zs=()=>[v`
      /* Tablet */
      @media screen and ${Pe(G)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${Pe(D)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];var St=class extends M{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?g`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:g` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};p(St,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),p(St,"styles",v`
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
    `);customElements.define("merch-icon",St);var Tt,gr=class gr{constructor(t){p(this,"card");L(this,Tt);this.card=t,this.insertVariantStyle()}getContainer(){return R(this,Tt,b(this,Tt)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),b(this,Tt)}insertVariantStyle(){if(!gr.styleMap[this.card.variant]){gr.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let o=`--consonant-merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),i=parseInt(this.getContainer().style.getPropertyValue(o))||0;n>i&&this.getContainer().style.setProperty(o,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),g`
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
              >`:"";return g`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};Tt=new WeakMap,p(gr,"styleMap",{});var O=gr;var Fs=`
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
}`;var oi={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Ct=class extends O{constructor(r){super(r);p(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(So,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});p(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let o=this.actionMenuContentSlot.classList.contains("hidden");o||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!o).toString())});p(this,"toggleActionMenuFromCard",r=>{let o=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(o||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",o),this.setAriaExpanded(this.actionMenu,"false"))});p(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get aemFragmentMapping(){return oi}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return g` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${os()&&this.card.actionMenu?"always-visible":""}
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
            <slot></slot>`}getGlobalCSS(){return Fs}setAriaExpanded(r,o){r.setAttribute("aria-expanded",o)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};p(Ct,"variantStyle",v`
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
    `);var Gs=`
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
`;var mo=class extends O{constructor(t){super(t)}getGlobalCSS(){return Gs}renderLayout(){return g`${this.cardImage}
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
          `}`}};var Vs=`
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

@media screen and ${ce} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var po=class extends O{constructor(t){super(t)}getGlobalCSS(){return Vs}renderLayout(){return g` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":g`<hr />`} ${this.secureLabelFooter}`}};var js=`
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
@media screen and ${Le} {
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

@media screen and ${uo} {
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
`;var Th=32,Pt=class extends O{constructor(r){super(r);p(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);p(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?g`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:g`<slot name="secure-transaction-label"></slot>`;return g`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return js}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let o=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");o&&o.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((o,n)=>{let i=Math.max(Th,parseFloat(window.getComputedStyle(o).height)||0),a=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;i>a&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${i}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(o=>{let n=o.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&o.remove()})}renderLayout(){return g` <div class="top-section${this.badge?" badge":""}">
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
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){xt()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};p(Pt,"variantStyle",v`
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

    @media screen and ${Pe(uo)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Pe(D)} {
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
  `);var qs=`
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

/* Mobile */
@media screen and ${Le} {
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
    @media screen and ${ce} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var ni={title:{tag:"p",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},stockOffer:!0,secureLabel:!0,badge:{tag:"div",slot:"badge"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},kt=class extends O{constructor(t){super(t),this.adaptForMobile=this.adaptForMobile.bind(this)}get aemFragmentMapping(){return ni}getGlobalCSS(){return qs}adaptForMobile(){if(!this.card.closest("merch-card-collection,overlay-trigger")){this.card.removeAttribute("size");return}let t=this.card.shadowRoot,r=t.querySelector("footer"),o=this.card.getAttribute("size"),n=t.querySelector("footer #stock-checkbox"),i=t.querySelector(".body #stock-checkbox"),a=t.querySelector(".body");if(!o){r.classList.remove("wide-footer"),n&&n.remove();return}let s=xt();if(r&&r.classList.toggle("wide-footer",!s),s&&n){i?n.remove():a.appendChild(n);return}!s&&i&&(n?i.remove():r.prepend(i))}postCardUpdateHook(){this.adaptForMobile(),this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?g`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}connectedCallbackHook(){let t=Zr();t?.addEventListener&&t.addEventListener("change",this.adaptForMobile)}disconnectedCallbackHook(){let t=Zr();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMobile)}renderLayout(){return g` ${this.badge}
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
        ${this.secureLabelFooter}`}};p(kt,"variantStyle",v`
    :host([variant='plans']) {
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
  `);var Ws=`
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
`;var rt=class extends O{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Ws}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return g` ${this.badge}
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
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(xt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};p(rt,"variantStyle",v`
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
  `);var Ys=`
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
@media screen and ${Le} {
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
`;var Lt=class extends O{constructor(t){super(t)}getGlobalCSS(){return Ys}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return g` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":g`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?g`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};p(Lt,"variantStyle",v`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var Xs=`
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

@media screen and ${Le} {
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

@media screen and ${ce} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var ii={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Rt=class extends O{constructor(t){super(t)}getGlobalCSS(){return Xs}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return ii}renderLayout(){return g`${this.cardImage}
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
            <slot></slot>`}};p(Rt,"variantStyle",v`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var ai=new Map,X=(e,t,r=null,o=null)=>{ai.set(e,{class:t,fragmentMapping:r,style:o})};X("catalog",Ct,oi,Ct.variantStyle);X("image",mo);X("inline-heading",po);X("mini-compare-chart",Pt,null,Pt.variantStyle);X("plans",kt,ni,kt.variantStyle);X("product",rt,null,rt.variantStyle);X("segment",Lt,null,Lt.variantStyle);X("special-offers",Rt,ii,Rt.variantStyle);var si=(e,t=!1)=>{let r=ai.get(e.variant);if(!r)return t?void 0:new rt(e);let{class:o,style:n}=r;if(n){let i=new CSSStyleSheet;i.replaceSync(n.cssText),e.shadowRoot.adoptedStyleSheets.push(i)}return new o(e)};function Ks(e){return ai.get(e)?.fragmentMapping}var Zs=document.createElement("style");Zs.innerHTML=`
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

`;document.head.appendChild(Zs);var ec=new CSSStyleSheet;ec.replaceSync(":host { display: contents; }");var Qs="fragment",Js="author",fo="aem-fragment",ye,ci=class{constructor(){L(this,ye,new Map)}clear(){b(this,ye).clear()}addByRequestedId(t,r){b(this,ye).set(t,r)}add(...t){t.forEach(r=>{let{id:o}=r;o&&b(this,ye).set(o,r)})}has(t){return b(this,ye).has(t)}get(t){return b(this,ye).get(t)}remove(t){b(this,ye).delete(t)}};ye=new WeakMap;var xr=new ci,br,le,Ee,Ot,$t,Re,oe,Oe,vr,yr,hi,li=class extends HTMLElement{constructor(){super();L(this,yr);p(this,"cache",xr);L(this,br);L(this,le,null);L(this,Ee,null);L(this,Ot,!1);L(this,$t,null);L(this,Re,null);L(this,oe);L(this,Oe);L(this,vr,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[ec]}static get observedAttributes(){return[Qs,Js]}attributeChangedCallback(r,o,n){r===Qs&&R(this,oe,n),r===Js&&R(this,vr,["","true"].includes(n))}connectedCallback(){if(R(this,Re,bt(this)),R(this,br,b(this,Re).log.module(fo)),R(this,$t,`${fo}:${b(this,oe)}${Se}`),performance.mark(b(this,$t)),!b(this,oe)){de(this,yr,hi).call(this,{message:"Missing fragment id"});return}this.refresh(!1)}async getFragmentById(r,o,n){let i=`${fo}:${o}${Vt}`,a;try{if(a=await Xr(r,{cache:"default",credentials:"omit"}),!a?.ok){let{startTime:s,duration:c}=performance.measure(i,n);throw new ge("Unexpected fragment response",{response:a,startTime:s,duration:c,...b(this,Re).duration})}return a.json()}catch{let{startTime:c,duration:l}=performance.measure(i,n);throw a||(a={url:r}),new ge("Failed to fetch fragment",{response:a,startTime:c,duration:l,...b(this,Re).duration})}}async refresh(r=!0){if(!(b(this,Oe)&&!await Promise.race([b(this,Oe),Promise.resolve(!1)])))return r&&xr.remove(b(this,oe)),R(this,Oe,this.fetchData().then(()=>{let{references:o,referencesTree:n,placeholders:i}=b(this,le)||{};return this.dispatchEvent(new CustomEvent(Ue,{detail:{...this.data,stale:b(this,Ot),references:o,referencesTree:n,placeholders:i},bubbles:!0,composed:!0})),!0}).catch(o=>b(this,le)?(xr.addByRequestedId(b(this,oe),b(this,le)),!0):(de(this,yr,hi).call(this,o),!1))),b(this,Oe)}async fetchData(){this.classList.remove("error"),R(this,Ee,null);let r=xr.get(b(this,oe));if(r){R(this,le,r);return}R(this,Ot,!0);let{masIOUrl:o,wcsApiKey:n,locale:i}=b(this,Re).settings,a=`${o}/fragment?id=${b(this,oe)}&api_key=${n}&locale=${i}`;r=await this.getFragmentById(a,b(this,oe),b(this,$t)),xr.addByRequestedId(b(this,oe),r),R(this,le,r),R(this,Ot,!1)}get updateComplete(){return b(this,Oe)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return b(this,Ee)?b(this,Ee):(b(this,vr)?this.transformAuthorData():this.transformPublishData(),b(this,Ee))}transformAuthorData(){let{fields:r,id:o,tags:n}=b(this,le);R(this,Ee,r.reduce((i,{name:a,multiple:s,values:c})=>(i.fields[a]=s?c:c[0],i),{fields:{},id:o,tags:n}))}transformPublishData(){let{fields:r,id:o,tags:n}=b(this,le);R(this,Ee,Object.entries(r).reduce((i,[a,s])=>(i.fields[a]=s?.mimeType?s.value:s??"",i),{fields:{},id:o,tags:n}))}};br=new WeakMap,le=new WeakMap,Ee=new WeakMap,Ot=new WeakMap,$t=new WeakMap,Re=new WeakMap,oe=new WeakMap,Oe=new WeakMap,vr=new WeakMap,yr=new WeakSet,hi=function({message:r,context:o}){this.classList.add("error"),b(this,br).error(`aem-fragment: ${r}`,o),this.dispatchEvent(new CustomEvent(Be,{detail:{message:r,...o},bubbles:!0,composed:!0}))};customElements.define(fo,li);var Mt=class extends M{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor=""}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.variant==="plans"&&this.style.setProperty("border-right","none"),super.connectedCallback()}render(){return g`<div class="plans-badge">
            ${this.textContent}
        </div>`}};p(Mt,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),p(Mt,"styles",v`
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
    `);customElements.define("merch-badge",Mt);var Er=class extends M{constructor(){super()}render(){return g`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};p(Er,"styles",v`
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
    `),p(Er,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",Er);var Ar=class extends M{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((t,r)=>{r>=5&&(t.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return g`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?g`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:g``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};p(Ar,"styles",v`
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
    `),p(Ar,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",Ar);var Ch="#000000",tc="spectrum-yellow-300-plans",rc="#F8D904",Ph="#EAEAEA",kh=/(accent|primary|secondary)(-(outline|link))?/,Lh="mas:product_code/",Rh="daa-ll",wr="daa-lh",Oh=["XL","L","M","S"],di="...";function $e(e,t,r,o){let n=o[e];if(t[e]&&n){let i={slot:n?.slot},a=t[e];if(n.maxCount&&typeof a=="string"){let[c,l]=Vh(a,n.maxCount,n.withSuffix);c!==a&&(i.title=l,a=c)}let s=qe(n.tag,i,a);r.append(s)}}function $h(e,t,r){e.mnemonicIcon?.map((n,i)=>({icon:n,alt:e.mnemonicAlt[i]??"",link:e.mnemonicLink[i]??""}))?.forEach(({icon:n,alt:i,link:a})=>{if(a&&!/^https?:/.test(a))try{a=new URL(`https://${a}`).href.toString()}catch{a="#"}let s={slot:"icons",src:n,loading:t.loading,size:r?.size??"l"};i&&(s.alt=i),a&&(s.href=a);let c=qe("merch-icon",s);t.append(c)})}function Mh(e,t,r){if(e.variant==="plans"){e.badge?.length&&!e.badge?.startsWith("<merch-badge")&&(e.badge=`<merch-badge variant="${e.variant}" background-color="${tc}">${e.badge}</merch-badge>`,e.borderColor||(e.borderColor=tc)),$e("badge",e,t,r);return}e.badge?(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||Ch),t.setAttribute("badge-background-color",e.badgeBackgroundColor||rc),t.setAttribute("border-color",e.badgeBackgroundColor||rc)):t.setAttribute("border-color",e.borderColor||Ph)}function Nh(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function Ih(e,t,r){$e("cardTitle",e,t,{cardTitle:r})}function Hh(e,t,r){$e("subtitle",e,t,r)}function Dh(e,t,r){if(!e.backgroundColor||e.backgroundColor.toLowerCase()==="default"){t.style.removeProperty("--merch-card-custom-background-color"),t.removeAttribute("background-color");return}r?.[e.backgroundColor]&&(t.style.setProperty("--merch-card-custom-background-color",`var(${r[e.backgroundColor]})`),t.setAttribute("background-color",e.backgroundColor))}function Uh(e,t,r){let o="--merch-card-custom-border-color";e.borderColor?.toLowerCase()==="transparent"?(t.style.removeProperty(o),e.variant==="plans"&&t.style.setProperty(o,"transparent")):e.borderColor&&r&&(/-gradient/.test(e.borderColor)?(t.setAttribute("gradient-border","true"),t.style.removeProperty(o)):t.style.setProperty(o,`var(--${e.borderColor})`))}function Bh(e,t,r){if(e.backgroundImage){let o={loading:t.loading??"lazy",src:e.backgroundImage};if(e.backgroundImageAltText?o.alt=e.backgroundImageAltText:o.role="none",!r)return;if(r?.attribute){t.setAttribute(r.attribute,e.backgroundImage);return}t.append(qe(r.tag,{slot:r.slot},qe("img",o)))}}function zh(e,t,r){$e("prices",e,t,r)}function Fh(e,t,r){$e("promoText",e,t,r),$e("description",e,t,r),$e("callout",e,t,r),$e("quantitySelect",e,t,r)}function Gh(e,t,r,o){e.showStockCheckbox&&r.stockOffer&&(t.setAttribute("checkbox-label",o.stockCheckboxLabel),t.setAttribute("stock-offer-osis",o.stockOfferOsis)),o.secureLabel&&r.secureLabel&&t.setAttribute("secure-label",o.secureLabel)}function Vh(e,t,r=!0){try{let o=typeof e!="string"?"":e,n=oc(o);if(n.length<=t)return[o,n];let i=0,a=!1,s=r?t-di.length<1?1:t-di.length:t,c=[];for(let u of o){if(i++,u==="<")if(a=!0,o[i]==="/")c.pop();else{let d="";for(let m of o.substring(i)){if(m===" "||m===">")break;d+=m}c.push(d)}if(u==="/"&&o[i]===">"&&c.pop(),u===">"){a=!1;continue}if(!a&&(s--,s===0))break}let l=o.substring(0,i).trim();if(c.length>0){c[0]==="p"&&c.shift();for(let u of c.reverse())l+=`</${u}>`}return[`${l}${r?di:""}`,n]}catch{let n=typeof e=="string"?e:"",i=oc(n);return[n,i]}}function oc(e){if(!e)return"";let t="",r=!1;for(let o of e){if(o==="<"&&(r=!0),o===">"){r=!1;continue}r||(t+=o)}return t}function jh(e,t){t.querySelectorAll("a.upt-link").forEach(o=>{let n=Te.createFrom(o);o.replaceWith(n),n.initializeWcsData(e.osi,e.promoCode)})}function qh(e,t,r,o){let i=customElements.get("checkout-button").createCheckoutButton({},e.innerHTML);i.setAttribute("tabindex",0);for(let h of e.attributes)["class","is"].includes(h.name)||i.setAttribute(h.name,h.value);i.firstElementChild?.classList.add("spectrum-Button-label");let a=t.ctas.size??"M",s=`spectrum-Button--${o}`,c=Oh.includes(a)?`spectrum-Button--size${a}`:"spectrum-Button--sizeM",l=["spectrum-Button",s,c];return r&&l.push("spectrum-Button--outline"),i.classList.add(...l),i}function Wh(e,t,r,o){let i=customElements.get("checkout-button").createCheckoutButton(e.dataset);i.connectedCallback(),i.render();let a="fill";r&&(a="outline");let s=qe("sp-button",{treatment:a,variant:o,tabIndex:0,size:t.ctas.size??"m",...e.dataset.analyticsId&&{"data-analytics-id":e.dataset.analyticsId}},e.innerHTML);return s.source=i,i.onceSettled().then(c=>{s.setAttribute("data-navigation-url",c.href)}),s.addEventListener("click",c=>{c.defaultPrevented||i.click()}),s}function Yh(e,t){let o=customElements.get("checkout-link").createCheckoutLink(e.dataset,e.innerHTML);return o.classList.add("con-button"),t&&o.classList.add("blue"),o}function Xh(e,t,r,o){if(e.ctas){let{slot:n}=r.ctas,i=qe("div",{slot:n},e.ctas),a=[...i.querySelectorAll("a")].map(s=>{let c=kh.exec(s.className)?.[0]??"accent",l=c.includes("accent"),h=c.includes("primary"),u=c.includes("secondary"),d=c.includes("-outline"),m=c.includes("-link");if(t.consonant)return Yh(s,l);if(m)return s;let x;return l?x="accent":h?x="primary":u&&(x="secondary"),t.spectrum==="swc"?Wh(s,r,d,x):qh(s,r,d,x)});i.innerHTML="",i.append(...a),t.append(i)}}function Kh(e,t){let{tags:r}=e,o=r?.find(i=>i.startsWith(Lh))?.split("/").pop();if(!o)return;t.setAttribute(wr,o),[...t.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((i,a)=>{i.setAttribute(Rh,`${i.dataset.analyticsId}-${a+1}`)})}function Zh(e){e.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,r])=>{e.querySelectorAll(`a.${t}`).forEach(o=>{o.classList.remove(t),o.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}function Qh(e){e.querySelectorAll("[slot]").forEach(o=>{o.remove()}),["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","size",wr].forEach(o=>e.removeAttribute(o));let r=["wide-strip","thin-strip"];e.classList.remove(...r)}async function nc(e,t){let{id:r,fields:o}=e,{variant:n}=o;if(!n)throw new Error(`hydrate: no variant found in payload ${r}`);let i={stockCheckboxLabel:"Add a 30-day free trial of Adobe Stock.*",stockOfferOsis:"",secureLabel:"Secure transaction"};Qh(t),t.id??(t.id=e.id),t.removeAttribute("background-image"),t.removeAttribute("background-color"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.removeAttribute("gradient-border"),t.classList.remove("wide-strip"),t.classList.remove("thin-strip"),t.removeAttribute(wr),t.variant=n,await t.updateComplete;let{aemFragmentMapping:a}=t.variantLayout;if(!a)throw new Error(`hydrate: aemFragmentMapping found for ${r}`);a.style==="consonant"&&t.setAttribute("consonant",!0),$h(o,t,a.mnemonics),Mh(o,t,a),Nh(o,t,a.size),Ih(o,t,a.title),Hh(o,t,a),zh(o,t,a),Bh(o,t,a.backgroundImage),Dh(o,t,a.allowedColors),Uh(o,t,a.borderColor),Fh(o,t,a),Gh(o,t,a,i),jh(o,t),Xh(o,t,a,n),Kh(o,t),Zh(t)}var ic="merch-card",Jh=":ready",ed=":error",ui=2e4,go="merch-card:",It,Ht,Me,Nt,ot=class extends M{constructor(){super();L(this,Me);p(this,"customerSegment");p(this,"marketSegment");p(this,"variantLayout");L(this,It);L(this,Ht);p(this,"readyEventDispatched",!1);this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=si(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(r=>{de(this,Me,Nt).call(this,r,{},!1),this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=si(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(r)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(Cr)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(De)??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let o=this.checkoutLinks;if(o.length!==0)for(let n of o){await n.onceSettled();let i=n.value?.[0]?.planType;if(!i)return;let a=this.stockOfferOsis[i];if(!a)return;let s=n.dataset.wcsOsi.split(",").filter(c=>c!==a);r.checked&&s.push(a),n.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let o=this.checkoutLinks;for(let n of o)n.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let o={...this.filters};Object.keys(o).forEach(n=>{if(r){o[n].order=Math.min(o[n].order||2,2);return}let i=o[n].order;i===1||isNaN(i)||(o[n].order=Number(i)+1)}),this.filters=o}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback(),R(this,Ht,bt()),R(this,It,b(this,Ht).Log.module(ic)),this.id??(this.id=this.querySelector("aem-fragment")?.getAttribute("fragment")),performance.mark(`${go}${this.id}${Se}`),this.addEventListener(ue,this.handleQuantitySelection),this.addEventListener(Gt,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.addEventListener(Be,this.handleAemFragmentEvents),this.addEventListener(Ue,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(ue,this.handleQuantitySelection),this.removeEventListener(Be,this.handleAemFragmentEvents),this.removeEventListener(Ue,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===Be&&de(this,Me,Nt).call(this,`AEM fragment cannot be loaded: ${r.detail.message}`,r.detail),r.type===Ue&&r.target.nodeName==="AEM-FRAGMENT"){let o=r.detail;nc(o,this).then(()=>this.checkReady()).catch(n=>b(this,It).error(n))}}async checkReady(){let r=new Promise(a=>setTimeout(()=>a("timeout"),ui));if(this.aemFragment){let a=await Promise.race([this.aemFragment.updateComplete,r]);if(a===!1){let s=a==="timeout"?`AEM fragment was not resolved within ${ui} timeout`:"AEM fragment cannot be loaded";de(this,Me,Nt).call(this,s,{},!1);return}}let o=[...this.querySelectorAll(Ft)];o.push(...[...this.querySelectorAll(wo)].map(a=>a.source));let n=Promise.all(o.map(a=>a.onceSettled().catch(()=>a))).then(a=>a.every(s=>s.classList.contains("placeholder-resolved"))),i=await Promise.race([n,r]);if(i===!0)return performance.mark(`${go}${this.id}${Jh}`),this.readyEventDispatched||(this.readyEventDispatched=!0,this.dispatchEvent(new CustomEvent(Co,{bubbles:!0,composed:!0}))),this;{let{duration:a,startTime:s}=performance.measure(`${go}${this.id}${ed}`,`${go}${this.id}${Se}`),c={duration:a,startTime:s,...b(this,Ht).duration};i==="timeout"?de(this,Me,Nt).call(this,`Contains offers that were not resolved within ${ui} timeout`,c):de(this,Me,Nt).call(this,"Contains unresolved offers",c)}}get aemFragment(){return this.querySelector("aem-fragment")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(De)).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(_o,{bubbles:!0})),this.displayFooterElementsInColumn())}get dynamicPrice(){return this.querySelector('[slot="price"]')}};It=new WeakMap,Ht=new WeakMap,Me=new WeakSet,Nt=function(r,o={},n=!0){b(this,It).error(`merch-card: ${r}`,o),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(Po,{detail:{...o,message:r},bubbles:!0,composed:!0}))},p(ot,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{if(!r)return;let[o,n,i]=r.split(",");return{PUF:o,ABM:n,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(o=>{let[n,i,a]=o.split(":"),s=Number(i);return[n,{order:isNaN(s)?void 0:s,size:a}]})),toAttribute:r=>Object.entries(r).map(([o,{order:n,size:i}])=>[o,n,i].filter(a=>a!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:wr,reflect:!0},loading:{type:String}}),p(ot,"styles",[Bs,...zs()]),p(ot,"registerVariant",X),p(ot,"getFragmentMapping",Ks);customElements.define(ic,ot);var Dt,_r=class extends M{constructor(){super();L(this,Dt);this.defaults={},this.variant="plans"}saveContainerDefaultValues(){let r=this.closest(this.getAttribute("container")),o=r?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(!0),n=r?.badgeText;return{description:o,badgeText:n}}getSlottedElement(r,o){return(o||this.closest(this.getAttribute("container"))).querySelector(`[slot="${r}"]:not(merch-offer > *)`)}updateSlot(r,o){let n=this.getSlottedElement(r,o);if(!n)return;let i=this.selectedOffer.getOptionValue(r)?this.selectedOffer.getOptionValue(r):this.defaults[r];i&&n.replaceWith(i.cloneNode(!0))}handleOfferSelection(r){let o=r.detail;this.selectOffer(o)}handleOfferSelectionByQuantity(r){let o=r.detail.option,n=Number.parseInt(o),i=this.findAppropriateOffer(n);this.selectOffer(i),this.getSlottedElement("cta").setAttribute("data-quantity",n)}selectOffer(r){if(!r)return;let o=this.selectedOffer;o&&(o.selected=!1),r.selected=!0,this.selectedOffer=r,this.planType=r.planType,this.updateContainer(),this.updateComplete.then(()=>{this.dispatchEvent(new CustomEvent(To,{detail:this,bubbles:!0}))})}findAppropriateOffer(r){let o=null;return this.offers.find(i=>{let a=Number.parseInt(i.getAttribute("value"));if(a===r)return!0;if(a>r)return!1;o=i})||o}updateBadgeText(r){this.selectedOffer.badgeText===""?r.badgeText=null:this.selectedOffer.badgeText?r.badgeText=this.selectedOffer.badgeText:r.badgeText=this.defaults.badgeText}updateContainer(){let r=this.closest(this.getAttribute("container"));!r||!this.selectedOffer||(this.updateSlot("cta",r),this.updateSlot("secondary-cta",r),this.updateSlot("price",r),!this.manageableMode&&(this.updateSlot("description",r),this.updateBadgeText(r)))}render(){return g`<fieldset><slot class="${this.variant}"></slot></fieldset>`}connectedCallback(){super.connectedCallback(),this.addEventListener("focusin",this.handleFocusin),this.addEventListener("click",this.handleFocusin),this.addEventListener(lt,this.handleOfferSelectReady);let r=this.closest("merch-quantity-select");this.manageableMode=r,this.offers=[...this.querySelectorAll("merch-offer")],R(this,Dt,this.handleOfferSelectionByQuantity.bind(this)),this.manageableMode?r.addEventListener(ue,b(this,Dt)):this.defaults=this.saveContainerDefaultValues(),this.selectedOffer=this.offers[0],this.planType&&this.updateContainer()}get miniCompareMobileCard(){return this.merchCard?.variant==="mini-compare-chart"&&this.isMobile}get merchCard(){return this.closest("merch-card")}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(ue,b(this,Dt)),this.removeEventListener(lt,this.handleOfferSelectReady),this.removeEventListener("focusin",this.handleFocusin),this.removeEventListener("click",this.handleFocusin)}get price(){return this.querySelector('merch-offer[aria-selected] [is="inline-price"]')}get customerSegment(){return this.selectedOffer?.customerSegment}get marketSegment(){return this.selectedOffer?.marketSegment}handleFocusin(r){r.target?.nodeName==="MERCH-OFFER"&&(r.preventDefault(),r.stopImmediatePropagation(),this.selectOffer(r.target))}async handleOfferSelectReady(){this.planType||this.querySelector("merch-offer:not([plan-type])")||(this.planType=this.selectedOffer.planType,await this.updateComplete,this.selectOffer(this.selectedOffer??this.querySelector("merch-offer[aria-selected]")??this.querySelector("merch-offer")),this.dispatchEvent(new CustomEvent(Gt,{bubbles:!0})))}};Dt=new WeakMap,p(_r,"styles",v`
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
    `),p(_r,"properties",{offers:{type:Array},selectedOffer:{type:Object},defaults:{type:Object},variant:{type:String,attribute:"variant",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},stock:{type:Boolean,reflect:!0}});customElements.define("merch-offer-select",_r);var ac=v`
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
`;var td="merch-offer",Sr=class extends M{constructor(){super();p(this,"tr");this.type="radio",this.selected=!1}getOptionValue(r){return this.querySelector(`[slot="${r}"]`)}connectedCallback(){super.connectedCallback(),this.initOffer(),this.configuration=this.closest("quantity-selector"),!this.hasAttribute("tabindex")&&!this.configuration&&(this.tabIndex=0),!this.hasAttribute("role")&&!this.configuration&&(this.role="radio")}get asRadioOption(){return g` <div class="merch-Radio">
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
            </div>`}render(){return this.configuration||!this.price?"":this.type==="subscription-option"?this.asSubscriptionOption:this.asRadioOption}get price(){return this.querySelector('span[is="inline-price"]:not([data-template="strikethrough"])')}get cta(){return this.querySelector(De)}get prices(){return this.querySelectorAll('span[is="inline-price"]')}get customerSegment(){return this.price?.value?.[0].customerSegment}get marketSegment(){return this.price?.value?.[0].marketSegments[0]}async initOffer(){if(!this.price)return;this.prices.forEach(o=>o.setAttribute("slot","price")),await this.updateComplete,await Promise.all([...this.prices].map(o=>o.onceSettled()));let{value:[r]}=this.price;this.planType=r.planType,await this.updateComplete,this.dispatchEvent(new CustomEvent(lt,{bubbles:!0}))}};p(Sr,"properties",{text:{type:String},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},badgeText:{type:String,attribute:"badge-text"},type:{type:String,attribute:"type",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0}}),p(Sr,"styles",[ac]);customElements.define(td,Sr);var sc=v`
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
`;var[Xg,Kg,cc,lc,hc,Zg]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Tab"];var mi=class extends M{static get properties(){return{closed:{type:Boolean,reflect:!0},selected:{type:Number},min:{type:Number},max:{type:Number},step:{type:Number},maxInput:{type:Number,attribute:"max-input"},options:{type:Array},highlightedIndex:{type:Number},defaultValue:{type:Number,attribute:"default-value",reflect:!0},title:{type:String}}}static get styles(){return sc}constructor(){super(),this.options=[],this.title="",this.closed=!0,this.min=0,this.max=0,this.step=0,this.maxInput=void 0,this.defaultValue=void 0,this.selectedValue=0,this.highlightedIndex=0,this.toggleMenu=this.toggleMenu.bind(this),this.handleClickOutside=this.handleClickOutside.bind(this),this.boundKeydownListener=this.handleKeydown.bind(this),this.addEventListener("keydown",this.boundKeydownListener),window.addEventListener("mousedown",this.handleClickOutside),this.handleKeyupDebounced=rs(this.handleKeyup.bind(this),500)}handleKeyup(){this.handleInput(),this.sendEvent()}handleKeydown(t){switch(t.key){case lc:this.closed||(t.preventDefault(),this.highlightedIndex=(this.highlightedIndex+1)%this.options.length);break;case cc:this.closed||(t.preventDefault(),this.highlightedIndex=(this.highlightedIndex-1+this.options.length)%this.options.length);break;case hc:if(this.closed)this.closePopover(),this.blur();else{let r=this.options[this.highlightedIndex];if(!r)break;this.selectedValue=r,this.handleMenuOption(this.selectedValue),this.toggleMenu()}break}t.composedPath().includes(this)&&t.stopPropagation()}adjustInput(t,r){this.selectedValue=r,t.value=r,this.highlightedIndex=this.options.indexOf(r)}handleInput(){let t=this.shadowRoot.querySelector(".text-field-input"),r=parseInt(t.value);if(!isNaN(r))if(r>0&&r!==this.selectedValue){let o=r;this.maxInput&&r>this.maxInput&&(o=this.maxInput),this.min&&o<this.min&&(o=this.min),this.adjustInput(t,o)}else this.adjustInput(t,this.min||1)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("mousedown",this.handleClickOutside),this.removeEventListener("keydown",this.boundKeydownListener)}generateOptionsArray(){let t=[];if(this.step>0)for(let r=this.min;r<=this.max;r+=this.step)t.push(r);return t}update(t){(t.has("min")||t.has("max")||t.has("step")||t.has("defaultValue"))&&(this.options=this.generateOptionsArray(),this.highlightedIndex=this.defaultValue?this.options.indexOf(this.defaultValue):0,this.handleMenuOption(this.defaultValue?this.defaultValue:this.options[0])),super.update(t)}handleClickOutside(t){t.composedPath().includes(this)||this.closePopover()}toggleMenu(){this.closed=!this.closed}handleMouseEnter(t){this.highlightedIndex=t}handleMenuOption(t){t===this.max&&this.shadowRoot.querySelector(".text-field-input")?.focus(),this.selectedValue=t,this.sendEvent(),this.closePopover()}sendEvent(){let t=new CustomEvent(ue,{detail:{option:this.selectedValue},bubbles:!0});this.dispatchEvent(t)}closePopover(){this.closed||this.toggleMenu()}get offerSelect(){return this.querySelector("merch-offer-select")}get popover(){return g` <div class="popover ${this.closed?"closed":"open"}">
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
        `}};customElements.define("merch-quantity-select",mi);var dc=`

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
`;var pi={backgroundImage:{attribute:"background-image"},badge:!0,ctas:{slot:"cta",size:"M"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"p",slot:"price"},size:[],subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"}},Ut=class extends O{getGlobalCSS(){return dc}get aemFragmentMapping(){return pi}get stripStyle(){return this.card.backgroundImage?`
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
            <slot></slot>`}postCardUpdateHook(t){t.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let t=new Image;t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")}}};p(Ut,"variantStyle",v`
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
    `);var uc=`

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
`;var fi={backgroundImage:{tag:"div",slot:"image"},badge:!0,ctas:{slot:"footer",size:"S"},description:{tag:"div",slot:"body-s"},mnemonics:{size:"m"},size:["wide"]},Bt=class extends O{getGlobalCSS(){return uc}get aemFragmentMapping(){return fi}renderLayout(){return g` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};p(Bt,"variantStyle",v`
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
    `);var mc=`
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
`;var gi={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40,withSuffix:!0},description:{tag:"div",slot:"body-xxs",maxCount:200,withSuffix:!1},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},backgroundColor:{attribute:"background-color"},borderColor:{attribute:"border-color",specialValues:{}},allowedColors:{gray:"--spectrum-gray-100"},size:["single","double","triple"]},nt=class extends O{getGlobalCSS(){return mc}get aemFragmentMapping(){return gi}renderLayout(){return g`
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
        `}};p(nt,"variantStyle",v`
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
    `);customElements.define("ah-try-buy-widget",nt);var pc=`
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
`;var xi={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40,withSuffix:!0},description:{tag:"div",slot:"body-xxs",maxCount:200,withSuffix:!1},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},backgroundColor:{attribute:"background-color"},borderColor:{attribute:"border-color",specialValues:{gradient:"linear-gradient(135deg, #ff4885 0%, #b272eb 50%, #5d89ff 100%)"}}},it=class extends O{getGlobalCSS(){return pc}get aemFragmentMapping(){return xi}renderLayout(){return g`
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
        `}};p(it,"variantStyle",v`
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
    `);customElements.define("ah-promoted-plans",it);ut({sampleRate:1});X("ccd-suggested",Ut,pi,Ut.variantStyle);X("ccd-slice",Bt,fi,Bt.variantStyle);X("ah-try-buy-widget",nt,gi,nt.variantStyle);X("ah-promoted-plans",it,xi,it.variantStyle);
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
