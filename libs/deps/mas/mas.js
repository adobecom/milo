var ro=Object.defineProperty;var no=e=>{throw TypeError(e)};var ms=(e,t,r)=>t in e?ro(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var us=(e,t)=>{for(var r in t)ro(e,r,{get:t[r],enumerable:!0})};var C=(e,t,r)=>ms(e,typeof t!="symbol"?t+"":t,r),oo=(e,t,r)=>t.has(e)||no("Cannot "+r);var $=(e,t,r)=>(oo(e,t,"read from private field"),r?r.call(e):t.get(e)),re=(e,t,r)=>t.has(e)?no("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),ne=(e,t,r,n)=>(oo(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r);var nt;(function(e){e.ServerError="ServerError",e.ClientError="ClientError",e.UnexpectedError="UnexpectedError"})(nt||(nt={}));var io=(e,t,r)=>({type:(o=>o>=500?nt.ServerError:o<400?nt.UnexpectedError:nt.ClientError)(e),message:t,originatingRequest:r,status:e});var ps=function(e,t,r,n){function o(i){return i instanceof r?i:new r(function(s){s(i)})}return new(r||(r=Promise))(function(i,s){function a(l){try{h(n.next(l))}catch(d){s(d)}}function c(l){try{h(n.throw(l))}catch(d){s(d)}}function h(l){l.done?i(l.value):o(l.value).then(a,c)}h((n=n.apply(e,t||[])).next())})},Ot;(function(e){e.AUTHORIZATION="Authorization",e.X_API_KEY="X-Api-Key"})(Ot||(Ot={}));var wr=class{constructor(t){this.fetchOptions=t}commonHeaders(){let t={};return this.fetchOptions.apiKey&&(t[Ot.X_API_KEY]=this.fetchOptions.apiKey),this.fetchOptions.accessToken&&(t[Ot.AUTHORIZATION]=`Bearer ${this.fetchOptions.accessToken}`),t}transformData(t,r){return r?t.map(n=>r(n)):t.map(n=>this.identifyTransform(n))}transformDatum(t,r){return r?r(t):this.identifyTransform(t)}identifyTransform(t){return t}failOnBadStatusOrParseBody(t,r){return ps(this,void 0,void 0,function*(){if(t.ok)return t.json().then(o=>({headers:t.headers,status:t.status,statusText:t.statusText,data:o}));let n=yield t.text();return Promise.reject(io(t.status,n,r))})}buildUrl(t,r,n,o,i){var s;let a=(s=this.fetchOptions.baseUrl)!==null&&s!==void 0?s:o(this.fetchOptions.env),c=i(r,n);return this.generateUrl(a,t,c)}generateUrl(t,r,n){let o=new URL(r,t);return n&&(o.search=this.convertToSearchParams(n).toString()),o.toString()}convertToSearchParams(t){return new URLSearchParams(t)}setParams(t,r,n){n!=null&&typeof n=="boolean"?t[r]=String(n):n&&(t[r]=n)}},Sr=wr;var K;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(K||(K={}));var ot;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(ot||(ot={}));var q;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(q||(q={}));var Te;(function(e){e.V2="UCv2",e.V3="UCv3"})(Te||(Te={}));var ee;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(ee||(ee={}));var Ar=function(e){var t;return(t=fs.get(e))!==null&&t!==void 0?t:e},fs=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var so=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},ao=function(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),o,i=[],s;try{for(;(t===void 0||t-- >0)&&!(o=n.next()).done;)i.push(o.value)}catch(a){s={error:a}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(s)throw s.error}}return i};function He(e,t,r){var n,o;try{for(var i=so(Object.entries(e)),s=i.next();!s.done;s=i.next()){var a=ao(s.value,2),c=a[0],h=a[1],l=Ar(c);h!=null&&r.has(l)&&t.set(l,h)}}catch(d){n={error:d}}finally{try{s&&!s.done&&(o=i.return)&&o.call(i)}finally{if(n)throw n.error}}}function Lt(e){switch(e){case K.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Nt(e,t){var r,n;for(var o in e){var i=e[o];try{for(var s=(r=void 0,so(Object.entries(i))),a=s.next();!a.done;a=s.next()){var c=ao(a.value,2),h=c[0],l=c[1];if(l!=null){var d=Ar(h);t.set("items["+o+"]["+d+"]",l)}}}catch(m){r={error:m}}finally{try{a&&!a.done&&(n=s.return)&&n.call(s)}finally{if(r)throw r.error}}}}var gs=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r},xs=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function co(e){Es(e);var t=e.env,r=e.items,n=e.workflowStep,o=gs(e,["env","items","workflowStep"]),i=new URL(Lt(t));return i.pathname=n+"/",Nt(r,i.searchParams),He(o,i.searchParams,vs),i.toString()}var vs=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),ys=["env","workflowStep","clientId","country","items"];function Es(e){var t,r;try{for(var n=xs(ys),o=n.next();!o.done;o=n.next()){var i=o.value;if(!e[i])throw new Error('Argument "checkoutData" is not valid, missing: '+i)}}catch(s){t={error:s}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}return!0}var bs=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r},_s=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},ws="p_draft_landscape",Ss="/store/";function Pr(e){Ts(e);var t=e.env,r=e.items,n=e.workflowStep,o=e.ms,i=e.marketSegment,s=e.ot,a=e.offerType,c=e.pa,h=e.productArrangementCode,l=e.landscape,d=bs(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),m={marketSegment:i??o,offerType:a??s,productArrangementCode:h??c},p=new URL(Lt(t));return p.pathname=""+Ss+n,n!==ee.SEGMENTATION&&n!==ee.CHANGE_PLAN_TEAM_PLANS&&Nt(r,p.searchParams),n===ee.SEGMENTATION&&He(m,p.searchParams,Tr),He(d,p.searchParams,Tr),l===q.DRAFT&&He({af:ws},p.searchParams,Tr),p.toString()}var Tr=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),As=["env","workflowStep","clientId","country"];function Ts(e){var t,r;try{for(var n=_s(As),o=n.next();!o.done;o=n.next()){var i=o.value;if(!e[i])throw new Error('Argument "checkoutData" is not valid, missing: '+i)}}catch(s){t={error:s}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}if(e.workflowStep!==ee.SEGMENTATION&&e.workflowStep!==ee.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function Cr(e,t){switch(e){case Te.V2:return co(t);case Te.V3:return Pr(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),Pr(t)}}var Or;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Or||(Or={}));var k;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(k||(k={}));var N;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(N||(N={}));var Lr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Lr||(Lr={}));var Nr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Nr||(Nr={}));var Rr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Rr||(Rr={}));var $r;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})($r||($r={}));var Ir=()=>{};Ir.createContext=Ir;var Ps=q.PUBLISHED,lo=e=>{switch(e){case K.PRODUCTION:return"https://wcs.adobe.io";case K.STAGE:return"https://wcs-stage.adobe.io";case K.LOCAL:return"http://localhost:3002";default:return"https://wcs-stage.adobe.io"}},ho=(e,t)=>{var r;return e.api_key=t.apiKey,e.landscape=(r=t.landscape)!==null&&r!==void 0?r:Ps,e};var Cs=function(e,t,r,n){function o(i){return i instanceof r?i:new r(function(s){s(i)})}return new(r||(r=Promise))(function(i,s){function a(l){try{h(n.next(l))}catch(d){s(d)}}function c(l){try{h(n.throw(l))}catch(d){s(d)}}function h(l){l.done?i(l.value):o(l.value).then(a,c)}h((n=n.apply(e,t||[])).next())})},kr=class extends Sr{constructor(t){super(t),this.apiPaths={getWebCommerceArtifact:"web_commerce_artifact"},this.getWebCommerceArtifact=(r,n,o,i)=>Cs(this,void 0,void 0,function*(){let s=this.buildUrl(this.apiPaths.getWebCommerceArtifact,n,r,a=>lo(a),(a,c)=>this.evaluateGetWebCommerceArtifactParams(a,c));return this.fetchOptions.fetch(s,{signal:i,headers:Object.assign({},this.commonHeaders()),mode:"cors"}).then(a=>this.failOnBadStatusOrParseBody(a,`GET ${s}`)).then(a=>{let h=a.data;return{data:this.transformDatum(h,o)}})})}evaluateGetWebCommerceArtifactParams(t,r){let n={};return this.setParams(n,"offer_selector_ids",r.offerSelectorIds.join(",")),this.setParams(n,"country",r.country),this.setParams(n,"language",r.language),this.setParams(n,"currency",r.currency),this.setParams(n,"locale",r.locale),this.setParams(n,"promotion_code",r.promotionCode),ho(n,t)}},mo=kr;var Rt=e=>new mo(e).getWebCommerceArtifact;var uo="tacocat.js";var $t=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),po=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function O(e,t={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let i;if(n&&i==null){let s=new URLSearchParams(window.location.search),a=Ve(n)?n:e;i=s.get(a)}if(o&&i==null){let s=Ve(o)?o:e;i=window.sessionStorage.getItem(s)??window.localStorage.getItem(s)}if(r&&i==null){let s=xo(Ve(r)?r:e);i=document.documentElement.querySelector(`meta[name="${s}"]`)?.content}return i??t[e]}var je=()=>{};var fo=e=>typeof e=="boolean",ve=e=>typeof e=="function",It=e=>typeof e=="number",go=e=>e!=null&&typeof e=="object";var Ve=e=>typeof e=="string",Mr=e=>Ve(e)&&e,Be=e=>It(e)&&Number.isFinite(e)&&e>0;function We(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function b(e,t){if(fo(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function de(e,t,r){let n=Object.values(t);return n.find(o=>$t(o,e))??r??n[0]}function xo(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function qe(e,t=1){return It(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Os=Date.now(),Ur=()=>`(+${Date.now()-Os}ms)`,kt=new Set,Ls=b(O("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function vo(e){let t=`[${uo}/${e}]`,r=(s,a,...c)=>s?!0:(o(a,...c),!1),n=Ls?(s,...a)=>{console.debug(`${t} ${s}`,...a,Ur())}:()=>{},o=(s,...a)=>{let c=`${t} ${s}`;kt.forEach(([h])=>h(c,...a))};return{assert:r,debug:n,error:o,warn:(s,...a)=>{let c=`${t} ${s}`;kt.forEach(([,h])=>h(c,...a))}}}function Ns(e,t){let r=[e,t];return kt.add(r),()=>{kt.delete(r)}}Ns((e,...t)=>{console.error(e,...t,Ur())},(e,...t)=>{console.warn(e,...t,Ur())});var Rs="no promo",yo="promo-tag",$s="yellow",Is="neutral",ks=(e,t,r)=>{let n=i=>i||Rs,o=r?` (was "${n(t)}")`:"";return`${n(e)}${o}`},Ms="cancel-context",it=(e,t)=>{let r=e===Ms,n=!r&&e?.length>0,o=(n||r)&&(t&&t!=e||!t&&!r),i=o&&n||!o&&!!t,s=i?e||t:void 0;return{effectivePromoCode:s,overridenPromoCode:e,className:i?yo:`${yo} no-promo`,text:ks(s,t,o),variant:i?$s:Is,isOverriden:o}};var Dr=function(e,t){return Dr=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},Dr(e,t)};function st(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Dr(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var _=function(){return _=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},_.apply(this,arguments)};function Mt(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,i;n<o;n++)(i||!(n in t))&&(i||(i=Array.prototype.slice.call(t,0,n)),i[n]=t[n]);return e.concat(i||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var P;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(P||(P={}));var Pe;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Pe||(Pe={}));function Fr(e){return e.type===P.literal}function Eo(e){return e.type===P.argument}function Ut(e){return e.type===P.number}function Dt(e){return e.type===P.date}function Ft(e){return e.type===P.time}function zt(e){return e.type===P.select}function Gt(e){return e.type===P.plural}function bo(e){return e.type===P.pound}function Ht(e){return e.type===P.tag}function Vt(e){return!!(e&&typeof e=="object"&&e.type===Pe.number)}function at(e){return!!(e&&typeof e=="object"&&e.type===Pe.dateTime)}var zr=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Us=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function _o(e){var t={};return e.replace(Us,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var wo=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Po(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(wo).filter(function(m){return m.length>0}),r=[],n=0,o=t;n<o.length;n++){var i=o[n],s=i.split("/");if(s.length===0)throw new Error("Invalid number skeleton");for(var a=s[0],c=s.slice(1),h=0,l=c;h<l.length;h++){var d=l[h];if(d.length===0)throw new Error("Invalid number skeleton")}r.push({stem:a,options:c})}return r}function Ds(e){return e.replace(/^(.*?)-/,"")}var So=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Co=/^(@+)?(\+|#+)?$/g,Fs=/(\*)(0+)|(#+)(0+)|(0+)/g,Oo=/^(0+)$/;function Ao(e){var t={};return e.replace(Co,function(r,n,o){return typeof o!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):o==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),t}function Lo(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function zs(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!Oo.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function To(e){var t={},r=Lo(e);return r||t}function No(e){for(var t={},r=0,n=e;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=o.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Ds(o.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=_(_(_({},t),{notation:"scientific"}),o.options.reduce(function(a,c){return _(_({},a),To(c))},{}));continue;case"engineering":t=_(_(_({},t),{notation:"engineering"}),o.options.reduce(function(a,c){return _(_({},a),To(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace(Fs,function(a,c,h,l,d,m){if(c)t.minimumIntegerDigits=h.length;else{if(l&&d)throw new Error("We currently do not support maximum integer digits");if(m)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Oo.test(o.stem)){t.minimumIntegerDigits=o.stem.length;continue}if(So.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(So,function(a,c,h,l,d,m){return h==="*"?t.minimumFractionDigits=c.length:l&&l[0]==="#"?t.maximumFractionDigits=l.length:d&&m?(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length+m.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""}),o.options.length&&(t=_(_({},t),Ao(o.options[0])));continue}if(Co.test(o.stem)){t=_(_({},t),Ao(o.stem));continue}var i=Lo(o.stem);i&&(t=_(_({},t),i));var s=zs(o.stem);s&&(t=_(_({},t),s))}return t}var Gr,Gs=new RegExp("^"+zr.source+"*"),Hs=new RegExp(zr.source+"*$");function y(e,t){return{start:e,end:t}}var Vs=!!String.prototype.startsWith,js=!!String.fromCodePoint,Bs=!!Object.fromEntries,Ws=!!String.prototype.codePointAt,qs=!!String.prototype.trimStart,Ys=!!String.prototype.trimEnd,Xs=!!Number.isSafeInteger,Zs=Xs?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},Vr=!0;try{Ro=Mo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Vr=((Gr=Ro.exec("a"))===null||Gr===void 0?void 0:Gr[0])==="a"}catch{Vr=!1}var Ro,$o=Vs?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},jr=js?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",o=t.length,i=0,s;o>i;){if(s=t[i++],s>1114111)throw RangeError(s+" is not a valid code point");n+=s<65536?String.fromCharCode(s):String.fromCharCode(((s-=65536)>>10)+55296,s%1024+56320)}return n},Io=Bs?Object.fromEntries:function(t){for(var r={},n=0,o=t;n<o.length;n++){var i=o[n],s=i[0],a=i[1];r[s]=a}return r},ko=Ws?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var o=t.charCodeAt(r),i;return o<55296||o>56319||r+1===n||(i=t.charCodeAt(r+1))<56320||i>57343?o:(o-55296<<10)+(i-56320)+65536}},Js=qs?function(t){return t.trimStart()}:function(t){return t.replace(Gs,"")},Qs=Ys?function(t){return t.trimEnd()}:function(t){return t.replace(Hs,"")};function Mo(e,t){return new RegExp(e,t)}var Br;Vr?(Hr=Mo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Br=function(t,r){var n;Hr.lastIndex=r;var o=Hr.exec(t);return(n=o[1])!==null&&n!==void 0?n:""}):Br=function(t,r){for(var n=[];;){var o=ko(t,r);if(o===void 0||Do(o)||ta(o))break;n.push(o),r+=o>=65536?2:1}return jr.apply(void 0,n)};var Hr,Uo=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var o=[];!this.isEOF();){var i=this.char();if(i===123){var s=this.parseArgument(t,n);if(s.err)return s;o.push(s.val)}else{if(i===125&&t>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var a=this.clonePosition();this.bump(),o.push({type:P.pound,location:y(a,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(v.UNMATCHED_CLOSING_TAG,y(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&Wr(this.peek()||0)){var s=this.parseTag(t,r);if(s.err)return s;o.push(s.val)}else{var s=this.parseLiteral(t,r);if(s.err)return s;o.push(s.val)}}}return{val:o,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:P.literal,value:"<"+o+"/>",location:y(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(t+1,r,!0);if(i.err)return i;var s=i.val,a=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Wr(this.char()))return this.error(v.INVALID_TAG,y(a,this.clonePosition()));var c=this.clonePosition(),h=this.parseTagName();return o!==h?this.error(v.UNMATCHED_CLOSING_TAG,y(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:P.tag,value:o,children:s,location:y(n,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,y(a,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,y(n,this.clonePosition()))}else return this.error(v.INVALID_TAG,y(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&ea(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),o="";;){var i=this.tryParseQuote(r);if(i){o+=i;continue}var s=this.tryParseUnquoted(t,r);if(s){o+=s;continue}var a=this.tryParseLeftAngleBracket();if(a){o+=a;continue}break}var c=y(n,this.clonePosition());return{val:{type:P.literal,value:o,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Ks(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return jr.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),jr(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,y(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(v.MALFORMED_ARGUMENT,y(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:P.argument,value:o,location:y(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition())):this.parseArgumentOptions(t,r,o,n);default:return this.error(v.MALFORMED_ARGUMENT,y(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=Br(this.message,r),o=r+n.length;this.bumpTo(o);var i=this.clonePosition(),s=y(t,i);return{value:n,location:s}},e.prototype.parseArgumentOptions=function(t,r,n,o){var i,s=this.clonePosition(),a=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(a){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,y(s,c));case"number":case"date":case"time":{this.bumpSpace();var h=null;if(this.bumpIf(",")){this.bumpSpace();var l=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var m=Qs(d.val);if(m.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,y(this.clonePosition(),this.clonePosition()));var p=y(l,this.clonePosition());h={style:m,styleLocation:p}}var f=this.tryParseArgumentClose(o);if(f.err)return f;var g=y(o,this.clonePosition());if(h&&$o(h?.style,"::",0)){var A=Js(h.style.slice(2));if(a==="number"){var d=this.parseNumberSkeletonFromString(A,h.styleLocation);return d.err?d:{val:{type:P.number,value:n,location:g,style:d.val},err:null}}else{if(A.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,g);var m={type:Pe.dateTime,pattern:A,location:h.styleLocation,parsedOptions:this.shouldParseSkeletons?_o(A):{}},R=a==="date"?P.date:P.time;return{val:{type:R,value:n,location:g,style:m},err:null}}}return{val:{type:a==="number"?P.number:a==="date"?P.date:P.time,value:n,location:g,style:(i=h?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var T=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,y(T,_({},T)));this.bumpSpace();var S=this.parseIdentifierIfPossible(),L=0;if(a!=="select"&&S.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),S=this.parseIdentifierIfPossible(),L=d.val}var E=this.tryParsePluralOrSelectOptions(t,a,r,S);if(E.err)return E;var f=this.tryParseArgumentClose(o);if(f.err)return f;var I=y(o,this.clonePosition());return a==="select"?{val:{type:P.select,value:n,options:Io(E.val),location:I},err:null}:{val:{type:P.plural,value:n,options:Io(E.val),offset:L,pluralType:a==="plural"?"cardinal":"ordinal",location:I},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,y(s,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,y(o,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=Po(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:Pe.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?No(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,o){for(var i,s=!1,a=[],c=new Set,h=o.value,l=o.location;;){if(h.length===0){var d=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var m=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(m.err)return m;l=y(d,this.clonePosition()),h=this.message.slice(d.offset,this.offset())}else break}if(c.has(h))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);h==="other"&&(s=!0),this.bumpSpace();var p=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,y(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(t+1,r,n);if(f.err)return f;var g=this.tryParseArgumentClose(p);if(g.err)return g;a.push([h,{value:f.val,location:y(p,this.clonePosition())}]),c.add(h),this.bumpSpace(),i=this.parseIdentifierIfPossible(),h=i.value,l=i.location}return a.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,y(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!s?this.error(v.MISSING_OTHER_CLAUSE,y(this.clonePosition(),this.clonePosition())):{val:a,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var i=!1,s=0;!this.isEOF();){var a=this.char();if(a>=48&&a<=57)i=!0,s=s*10+(a-48),this.bump();else break}var c=y(o,this.clonePosition());return i?(s*=n,Zs(s)?{val:s,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=ko(this.message,t);if(r===void 0)throw Error("Offset "+t+" is at invalid UTF-16 code unit boundary");return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if($o(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset "+t+" must be greater than or equal to the current offset "+this.offset());for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset "+t+" is at invalid UTF-16 code unit boundary");if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Do(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function Wr(e){return e>=97&&e<=122||e>=65&&e<=90}function Ks(e){return Wr(e)||e===47}function ea(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Do(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function ta(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function qr(e){e.forEach(function(t){if(delete t.location,zt(t)||Gt(t))for(var r in t.options)delete t.options[r].location,qr(t.options[r].value);else Ut(t)&&Vt(t.style)||(Dt(t)||Ft(t))&&at(t.style)?delete t.style.location:Ht(t)&&qr(t.children)})}function Fo(e,t){t===void 0&&(t={}),t=_({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Uo(e,t).parse();if(r.err){var n=SyntaxError(v[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||qr(r.val),r.val}function ct(e,t){var r=t&&t.cache?t.cache:aa,n=t&&t.serializer?t.serializer:sa,o=t&&t.strategy?t.strategy:na;return o(e,{cache:r,serializer:n})}function ra(e){return e==null||typeof e=="number"||typeof e=="boolean"}function zo(e,t,r,n){var o=ra(n)?n:r(n),i=t.get(o);return typeof i>"u"&&(i=e.call(this,n),t.set(o,i)),i}function Go(e,t,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),i=t.get(o);return typeof i>"u"&&(i=e.apply(this,n),t.set(o,i)),i}function Yr(e,t,r,n,o){return r.bind(t,e,n,o)}function na(e,t){var r=e.length===1?zo:Go;return Yr(e,this,r,t.cache.create(),t.serializer)}function oa(e,t){return Yr(e,this,Go,t.cache.create(),t.serializer)}function ia(e,t){return Yr(e,this,zo,t.cache.create(),t.serializer)}var sa=function(){return JSON.stringify(arguments)};function Xr(){this.cache=Object.create(null)}Xr.prototype.get=function(e){return this.cache[e]};Xr.prototype.set=function(e,t){this.cache[e]=t};var aa={create:function(){return new Xr}},jt={variadic:oa,monadic:ia};var Ce;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Ce||(Ce={}));var lt=function(e){st(t,e);function t(r,n,o){var i=e.call(this,r)||this;return i.code=n,i.originalMessage=o,i}return t.prototype.toString=function(){return"[formatjs Error: "+this.code+"] "+this.message},t}(Error);var Zr=function(e){st(t,e);function t(r,n,o,i){return e.call(this,'Invalid values for "'+r+'": "'+n+'". Options are "'+Object.keys(o).join('", "')+'"',Ce.INVALID_VALUE,i)||this}return t}(lt);var Ho=function(e){st(t,e);function t(r,n,o){return e.call(this,'Value for "'+r+'" must be of type '+n,Ce.INVALID_VALUE,o)||this}return t}(lt);var Vo=function(e){st(t,e);function t(r,n){return e.call(this,'The intl string context variable "'+r+'" was not provided to the string "'+n+'"',Ce.MISSING_VALUE,n)||this}return t}(lt);var D;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(D||(D={}));function ca(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==D.literal||r.type!==D.literal?t.push(r):n.value+=r.value,t},[])}function la(e){return typeof e=="function"}function ht(e,t,r,n,o,i,s){if(e.length===1&&Fr(e[0]))return[{type:D.literal,value:e[0].value}];for(var a=[],c=0,h=e;c<h.length;c++){var l=h[c];if(Fr(l)){a.push({type:D.literal,value:l.value});continue}if(bo(l)){typeof i=="number"&&a.push({type:D.literal,value:r.getNumberFormat(t).format(i)});continue}var d=l.value;if(!(o&&d in o))throw new Vo(d,s);var m=o[d];if(Eo(l)){(!m||typeof m=="string"||typeof m=="number")&&(m=typeof m=="string"||typeof m=="number"?String(m):""),a.push({type:typeof m=="string"?D.literal:D.object,value:m});continue}if(Dt(l)){var p=typeof l.style=="string"?n.date[l.style]:at(l.style)?l.style.parsedOptions:void 0;a.push({type:D.literal,value:r.getDateTimeFormat(t,p).format(m)});continue}if(Ft(l)){var p=typeof l.style=="string"?n.time[l.style]:at(l.style)?l.style.parsedOptions:void 0;a.push({type:D.literal,value:r.getDateTimeFormat(t,p).format(m)});continue}if(Ut(l)){var p=typeof l.style=="string"?n.number[l.style]:Vt(l.style)?l.style.parsedOptions:void 0;p&&p.scale&&(m=m*(p.scale||1)),a.push({type:D.literal,value:r.getNumberFormat(t,p).format(m)});continue}if(Ht(l)){var f=l.children,g=l.value,A=o[g];if(!la(A))throw new Ho(g,"function",s);var R=ht(f,t,r,n,o,i),T=A(R.map(function(E){return E.value}));Array.isArray(T)||(T=[T]),a.push.apply(a,T.map(function(E){return{type:typeof E=="string"?D.literal:D.object,value:E}}))}if(zt(l)){var S=l.options[m]||l.options.other;if(!S)throw new Zr(l.value,m,Object.keys(l.options),s);a.push.apply(a,ht(S.value,t,r,n,o));continue}if(Gt(l)){var S=l.options["="+m];if(!S){if(!Intl.PluralRules)throw new lt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Ce.MISSING_INTL_API,s);var L=r.getPluralRules(t,{type:l.pluralType}).select(m-(l.offset||0));S=l.options[L]||l.options.other}if(!S)throw new Zr(l.value,m,Object.keys(l.options),s);a.push.apply(a,ht(S.value,t,r,n,o,m-(l.offset||0)));continue}}return ca(a)}function ha(e,t){return t?_(_(_({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=_(_({},e[n]),t[n]||{}),r},{})):e}function da(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=ha(e[n],t[n]),r},_({},e)):e}function Jr(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function ma(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:ct(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,Mt([void 0],r)))},{cache:Jr(e.number),strategy:jt.variadic}),getDateTimeFormat:ct(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,Mt([void 0],r)))},{cache:Jr(e.dateTime),strategy:jt.variadic}),getPluralRules:ct(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,Mt([void 0],r)))},{cache:Jr(e.pluralRules),strategy:jt.variadic})}}var jo=function(){function e(t,r,n,o){var i=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(s){var a=i.formatToParts(s);if(a.length===1)return a[0].value;var c=a.reduce(function(h,l){return!h.length||l.type!==D.literal||typeof h[h.length-1]!="string"?h.push(l.value):h[h.length-1]+=l.value,h},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(s){return ht(i.ast,i.locales,i.formatters,i.formats,s,void 0,i.message)},this.resolvedOptions=function(){return{locale:Intl.NumberFormat.supportedLocalesOf(i.locales)[0]}},this.getAst=function(){return i.ast},typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:o?.ignoreTag})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=da(e.formats,n),this.locales=r,this.formatters=o&&o.formatters||ma(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.__parse=Fo,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Bo=jo;var ua=/[0-9\-+#]/,pa=/[^\d\-+#]/g;function Wo(e){return e.search(ua)}function fa(e="#.##"){let t={},r=e.length,n=Wo(e);t.prefix=n>0?e.substring(0,n):"";let o=Wo(e.split("").reverse().join("")),i=r-o,s=e.substring(i,i+1),a=i+(s==="."||s===","?1:0);t.suffix=o>0?e.substring(a,r):"",t.mask=e.substring(n,a),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(pa);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function ga(e,t,r){let n=!1,o={value:e};e<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(t.fraction&&t.fraction.length),o.value=Number(o.value).toString();let i=t.fraction&&t.fraction.lastIndexOf("0"),[s="0",a=""]=o.value.split(".");return(!a||a&&a.length<=i)&&(a=i<0?"":(+("0."+a)).toFixed(i+1).replace("0.","")),o.integer=s,o.fraction=a,xa(o,t),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&t.maskHasPositiveSign?o.sign="+":n&&t.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),o}function xa(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;e.integer.length<n.length-o;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let i=r[1]&&r[r.length-1].length;if(i){let s=e.integer.length,a=s%i;for(let c=0;c<s;c++)e.result+=e.integer.charAt(c),!((c-a+1)%i)&&c<s-i&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function va(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=fa(e),o=ga(t,n,r);return n.prefix+o.sign+o.result+n.suffix}var qo=va;var Yo=".",ya=",",Zo=/^\s+/,Jo=/\s+$/,Xo="&nbsp;",dt={MONTH:"MONTH",YEAR:"YEAR"},Ea={[N.ANNUAL]:12,[N.MONTHLY]:1,[N.THREE_YEARS]:36,[N.TWO_YEARS]:24},ba={CHF:e=>Math.round(e*20)/20},Qr=(e,t)=>({accept:e,round:t}),_a=[Qr(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),Qr(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.ceil(Math.floor(t*1e4/e)/100)/100),Qr(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],Kr={[k.YEAR]:{[N.MONTHLY]:dt.MONTH,[N.ANNUAL]:dt.YEAR},[k.MONTH]:{[N.MONTHLY]:dt.MONTH}},wa=(e,t)=>e.indexOf(`'${t}'`)===0,Sa=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=Ko(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Ta(e)),r},Aa=e=>{let t=Pa(e),r=wa(e,t),n=e.replace(/'.*?'/,""),o=Zo.test(n)||Jo.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:o}},Qo=e=>e.replace(Zo,Xo).replace(Jo,Xo),Ta=e=>e.match(/#(.?)#/)?.[1]===Yo?ya:Yo,Pa=e=>e.match(/'(.*?)'/)?.[1]??"",Ko=e=>e.match(/0(.?)0/)?.[1]??"";function Bt({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},o,i=s=>s){let{currencySymbol:s,isCurrencyFirst:a,hasCurrencySpace:c}=Aa(e),h=r?Ko(e):"",l=Sa(e,r),d=r?2:0,m=i(t,{currencySymbol:s}),p=n?m.toLocaleString("hi-IN",{minimumFractionDigits:d,maximumFractionDigits:d}):qo(l,m),f=r?p.lastIndexOf(h):p.length,g=p.substring(0,f),A=p.substring(f+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,p).replace(/SYMBOL/,s),currencySymbol:s,decimals:A,decimalsDelimiter:h,hasCurrencySpace:c,integer:g,isCurrencyFirst:a,recurrenceTerm:o}}var ei=e=>{let{commitment:t,term:r,usePrecision:n}=e,o=Ea[r]??1;return Bt(e,o>1?dt.MONTH:Kr[t]?.[r],(i,{currencySymbol:s})=>{let a={divisor:o,price:i,usePrecision:n},{round:c}=_a.find(({accept:l})=>l(a));if(!c)throw new Error(`Missing rounding rule for: ${JSON.stringify(a)}`);return(ba[s]??(l=>l))(c(a))})},ti=({commitment:e,term:t,...r})=>Bt(r,Kr[e]?.[t]),ri=e=>{let{commitment:t,term:r}=e;return t===k.YEAR&&r===N.MONTHLY?Bt(e,dt.YEAR,n=>n*12):Bt(e,Kr[t]?.[r])};var Ca={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},Oa=vo("ConsonantTemplates/price"),La=/<.+?>/g,Y={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},Oe={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},Na="TAX_EXCLUSIVE",Ra=e=>go(e)?Object.entries(e).filter(([,t])=>Ve(t)||It(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+po(n)+'"'}`,""):"",oe=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+Y.disabled}"${Ra(r)}>${n?Qo(t):t??""}</span>`;function $a(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:o,hasCurrencySpace:i,integer:s,isCurrencyFirst:a,recurrenceLabel:c,perUnitLabel:h,taxInclusivityLabel:l},d={}){let m=oe(Y.currencySymbol,r),p=oe(Y.currencySpace,i?"&nbsp;":""),f="";return a&&(f+=m+p),f+=oe(Y.integer,s),f+=oe(Y.decimalsDelimiter,o),f+=oe(Y.decimals,n),a||(f+=p+m),f+=oe(Y.recurrence,c,null,!0),f+=oe(Y.unitType,h,null,!0),f+=oe(Y.taxInclusivity,l,!0),oe(e,f,{...d,"aria-label":t})}var Le=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1}={})=>({country:n,displayFormatted:o=!0,displayRecurrence:i=!0,displayPerUnit:s=!1,displayTax:a=!1,language:c,literals:h={}}={},{commitment:l,formatString:d,price:m,priceWithoutDiscount:p,taxDisplay:f,taxTerm:g,term:A,usePrecision:R}={},T={})=>{Object.entries({country:n,formatString:d,language:c,price:m}).forEach(([he,br])=>{if(br==null)throw new Error(`Argument "${he}" is missing`)});let S={...Ca,...h},L=`${c.toLowerCase()}-${n.toUpperCase()}`;function E(he,br){let _r=S[he];if(_r==null)return"";try{return new Bo(_r.replace(La,""),L).format(br)}catch{return Oa.error("Failed to format literal:",_r),""}}let I=t&&p?p:m,F=e?ei:ti;r&&(F=ri);let{accessiblePrice:J,recurrenceTerm:Q,...U}=F({commitment:l,formatString:d,term:A,price:e?m:I,usePrecision:R,isIndianPrice:n==="IN"}),W=J,xe="";if(b(i)&&Q){let he=E(Oe.recurrenceAriaLabel,{recurrenceTerm:Q});he&&(W+=" "+he),xe=E(Oe.recurrenceLabel,{recurrenceTerm:Q})}let Ae="";if(b(s)){Ae=E(Oe.perUnitLabel,{perUnit:"LICENSE"});let he=E(Oe.perUnitAriaLabel,{perUnit:"LICENSE"});he&&(W+=" "+he)}let le="";b(a)&&g&&(le=E(f===Na?Oe.taxExclusiveLabel:Oe.taxInclusiveLabel,{taxTerm:g}),le&&(W+=" "+le)),t&&(W=E(Oe.strikethroughAriaLabel,{strikethroughPrice:W}));let te=Y.container;if(e&&(te+=" "+Y.containerOptical),t&&(te+=" "+Y.containerStrikethrough),r&&(te+=" "+Y.containerAnnual),b(o))return $a(te,{...U,accessibleLabel:W,recurrenceLabel:xe,perUnitLabel:Ae,taxInclusivityLabel:le},T);let{currencySymbol:ze,decimals:Pt,decimalsDelimiter:Ct,hasCurrencySpace:rt,integer:Er,isCurrencyFirst:hs}=U,Ge=[Er,Ct,Pt];hs?(Ge.unshift(rt?"\xA0":""),Ge.unshift(ze)):(Ge.push(rt?"\xA0":""),Ge.push(ze)),Ge.push(xe,Ae,le);let ds=Ge.join("");return oe(te,ds,T)},ni=()=>(e,t,r)=>{let o=(e.displayOldPrice===void 0||b(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${Le()(e,t,r)}${o?"&nbsp;"+Le({displayStrikethrough:!0})(e,t,r):""}`};var en=Le(),tn=ni(),rn=Le({displayOptical:!0}),nn=Le({displayStrikethrough:!0}),on=Le({displayAnnual:!0});var Ia=(e,t)=>{if(!(!Be(e)||!Be(t)))return Math.floor((t-e)/t*100)},oi=()=>(e,t,r)=>{let{price:n,priceWithoutDiscount:o}=t,i=Ia(n,o);return i===void 0?'<span class="no-discount"></span>':`<span class="discount">${i}%</span>`};var sn=oi();var an="ABM",cn="PUF",ln="M2M",hn="PERPETUAL",ii="P3Y",ka="TAX_INCLUSIVE_DETAILS",Ma="TAX_EXCLUSIVE",si={ABM:an,PUF:cn,M2M:ln,PERPETUAL:hn,P3Y:ii},bh={[an]:{commitment:k.YEAR,term:N.MONTHLY},[cn]:{commitment:k.YEAR,term:N.ANNUAL},[ln]:{commitment:k.MONTH,term:N.MONTHLY},[hn]:{commitment:k.PERPETUAL,term:void 0},[ii]:{commitment:k.THREE_MONTHS,term:N.P3Y}},ai="Value is not an offer",dn=e=>{if(typeof e!="object")return ai;let{commitment:t,term:r}=e,n=Ua(t,r);return{...e,planType:n}};var Ua=(e,t)=>{if(e===void 0)return ai;if(e===""&&t==="")return"";let r="";return e===k.YEAR?t===N.MONTHLY?r=an:t===N.ANNUAL&&(r=cn):e===k.MONTH?t===N.MONTHLY&&(r=ln):e===k.PERPETUAL&&(r=hn),r};function mn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:i,taxDisplay:s}=t;if(s!==ka)return e;let a={...e,priceDetails:{...t,price:o??r,priceWithoutDiscount:i??n,taxDisplay:Ma}};return a.offerType==="TRIAL"&&a.priceDetails.price===0&&(a.priceDetails.price=a.priceDetails.priceWithoutDiscount),a}var{freeze:Ne}=Object,me=Ne({...Te}),ue=Ne({...ee}),X=Ne({...K}),ci=Ne({...k}),mt=Ne({...ot}),li=Ne({...si}),hi=Ne({...N});var yn={};us(yn,{CLASS_NAME_FAILED:()=>Wt,CLASS_NAME_PENDING:()=>qt,CLASS_NAME_RESOLVED:()=>Yt,ERROR_MESSAGE_BAD_REQUEST:()=>un,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>fn,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>pn,EVENT_TYPE_ERROR:()=>Da,EVENT_TYPE_FAILED:()=>Xt,EVENT_TYPE_PENDING:()=>Zt,EVENT_TYPE_READY:()=>Ye,EVENT_TYPE_RESOLVED:()=>Jt,LOG_NAMESPACE:()=>gn,PARAM_AOS_API_KEY:()=>Fa,PARAM_ENV:()=>xn,PARAM_LANDSCAPE:()=>vn,PARAM_WCS_API_KEY:()=>za,STATE_FAILED:()=>ie,STATE_PENDING:()=>se,STATE_RESOLVED:()=>ae,TAG_NAME_SERVICE:()=>ye});var Wt="placeholder-failed",qt="placeholder-pending",Yt="placeholder-resolved",un="Bad WCS request",pn="Commerce offer not found",fn="Literals URL not provided",Da="wcms:commerce:error",Xt="wcms:placeholder:failed",Zt="wcms:placeholder:pending",Ye="wcms:commerce:ready",Jt="wcms:placeholder:resolved",gn="wcms/commerce",xn="commerce.env",vn="commerce.landscape",Fa="commerce.aosKey",za="commerce.wcsKey",ie="failed",se="pending",ae="resolved",ye="wcms-commerce";var En={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:30,tags:"consumer=milo/commerce"},di=new Set,Ga=e=>e instanceof Error||typeof e.originatingRequest=="string";function mi(e){if(e==null)return;let t=typeof e;if(t==="function"){let{name:r}=e;return r?`${t} ${r}`:t}if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:o,status:i}=e;return[n,i,o].filter(s=>s).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!En.serializableTypes.includes(r))return r}return e}function Ha(e,t){if(!En.ignoredProperties.includes(e))return mi(t)}var bn={append(e){let{delimiter:t,sampleRate:r,tags:n,clientId:o}=En,{message:i,params:s}=e,a=[],c=i,h=[];s.forEach(m=>{m!=null&&(Ga(m)?a:h).push(m)}),a.length&&(c+=" ",c+=a.map(mi).join(" "));let{pathname:l,search:d}=window.location;c+=`${t}page=`,c+=l+d,h.length&&(c+=`${t}facts=`,c+=JSON.stringify(h,Ha)),di.has(c)||(di.add(c),window.lana?.log(c,{sampleRate:r,tags:n,clientId:o}))}};var w=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:me.V3,checkoutWorkflowStep:ue.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,domainSwitch:!1,env:X.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsEnv:mt.PRODUCTION,landscape:q.PUBLISHED,wcsBufferLimit:1});function ui(e,{once:t=!1}={}){let r=null;function n(){let o=document.querySelector(ye);o!==r&&(r=o,o&&e(o))}return document.addEventListener(Ye,n,{once:t}),Ee(n),()=>document.removeEventListener(Ye,n)}function ut(e,{country:t,forceTaxExclusive:r,perpetual:n}){let o;if(e.length<2)o=e;else{let i=t==="GB"||n?"EN":"MULT",[s,a]=e;o=[s.language===i?s:a]}return r&&(o=o.map(mn)),o}var Ee=e=>window.setTimeout(e);function Xe(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(qe).filter(Be);return r.length||(r=[t]),r}function Qt(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(Mr)}function H(){return window.customElements.get(ye)?.instance}var Va="en_US",u={ar:"AR_es",be_en:"BE_en",be_fr:"BE_fr",be_nl:"BE_nl",br:"BR_pt",ca:"CA_en",ch_de:"CH_de",ch_fr:"CH_fr",ch_it:"CH_it",cl:"CL_es",co:"CO_es",la:"DO_es",mx:"MX_es",pe:"PE_es",africa:"MU_en",dk:"DK_da",de:"DE_de",ee:"EE_et",eg_ar:"EG_ar",eg_en:"EG_en",es:"ES_es",fr:"FR_fr",gr_el:"GR_el",gr_en:"GR_en",ie:"IE_en",il_he:"IL_iw",it:"IT_it",lv:"LV_lv",lt:"LT_lt",lu_de:"LU_de",lu_en:"LU_en",lu_fr:"LU_fr",my_en:"MY_en",my_ms:"MY_ms",hu:"HU_hu",mt:"MT_en",mena_en:"DZ_en",mena_ar:"DZ_ar",nl:"NL_nl",no:"NO_nb",pl:"PL_pl",pt:"PT_pt",ro:"RO_ro",si:"SI_sl",sk:"SK_sk",fi:"FI_fi",se:"SE_sv",tr:"TR_tr",uk:"GB_en",at:"AT_de",cz:"CZ_cs",bg:"BG_bg",ru:"RU_ru",ua:"UA_uk",au:"AU_en",in_en:"IN_en",in_hi:"IN_hi",id_en:"ID_en",id_id:"ID_in",nz:"NZ_en",sa_ar:"SA_ar",sa_en:"SA_en",sg:"SG_en",cn:"CN_zh-Hans",tw:"TW_zh-Hant",hk_zh:"HK_zh-hant",jp:"JP_ja",kr:"KR_ko",za:"ZA_en",ng:"NG_en",cr:"CR_es",ec:"EC_es",pr:"US_es",gt:"GT_es",cis_en:"AZ_en",cis_ru:"AZ_ru",sea:"SG_en",th_en:"TH_en",th_th:"TH_th"},pe=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});function ja({locale:e={}}={}){if(!e.prefix)return{country:w.country,language:w.language,locale:Va};let t=e.prefix.replace("/","")??"",[r=w.country,n=w.language]=(u[t]??t).split("_",2);return r=r.toUpperCase(),n=n.toLowerCase(),{country:r,language:n,locale:`${n}_${r}`}}function pi(e={}){let{commerce:t={},locale:r=void 0}=e,o=(e.env?.name===pe.PROD?pe.PROD:de(O(xn,t,{metadata:!1}),pe,pe.PROD))===pe.STAGE?X.STAGE:X.PRODUCTION,i=O("checkoutClientId",t)??w.checkoutClientId,s=de(O("checkoutWorkflow",t),me,w.checkoutWorkflow),a=ue.CHECKOUT;s===me.V3&&(a=de(O("checkoutWorkflowStep",t),ue,w.checkoutWorkflowStep));let c=b(O("displayOldPrice",t),w.displayOldPrice),h=b(O("displayPerUnit",t),w.displayPerUnit),l=b(O("displayRecurrence",t),w.displayRecurrence),d=b(O("displayTax",t),w.displayTax),m=b(O("entitlement",t),w.entitlement),p=b(O("modal",t),w.modal),f=b(O("forceTaxExclusive",t),w.forceTaxExclusive),g=O("promotionCode",t)??w.promotionCode,A=Xe(O("quantity",t)),R=O("wcsApiKey",t)??w.wcsApiKey,T=e.env?.name===pe.PROD?q.PUBLISHED:de(O(vn,t),q,w.landscape),S=qe(O("wcsBufferDelay",t),w.wcsBufferDelay),L=qe(O("wcsBufferLimit",t),w.wcsBufferLimit),E=b(O("domain.switch",t),!1);return{...ja({locale:r}),displayOldPrice:c,checkoutClientId:i,checkoutWorkflow:s,checkoutWorkflowStep:a,displayPerUnit:h,displayRecurrence:l,displayTax:d,entitlement:m,extraOptions:w.extraOptions,modal:p,env:o,forceTaxExclusive:f,priceLiteralsURL:t.priceLiteralsURL,priceLiteralsPromise:t.priceLiteralsPromise,promotionCode:g,quantity:A,wcsApiKey:R,wcsBufferDelay:S,wcsBufferLimit:L,wcsEnv:o===X.STAGE?mt.STAGE:mt.PRODUCTION,landscape:T,domainSwitch:E}}var gi="debug",Ba="error",Wa="info",qa="warn",Ya=Date.now(),_n=new Set,wn=new Set,fi=new Map,pt=Object.freeze({DEBUG:gi,ERROR:Ba,INFO:Wa,WARN:qa}),xi={append({level:e,message:t,params:r,timestamp:n,source:o}){console[e](`${n}ms [${o}] %c${t}`,"font-weight: bold;",...r)}},vi={filter:({level:e})=>e!==gi},Xa={filter:()=>!1};function Za(e,t,r,n,o){return{level:e,message:t,namespace:r,get params(){if(n.length===1){let[i]=n;ve(i)&&(n=i(),Array.isArray(n)||(n=[n]))}return n},source:o,timestamp:Date.now()-Ya}}function Ja(e){[...wn].every(t=>t(e))&&_n.forEach(t=>t(e))}function yi(e){let t=(fi.get(e)??0)+1;fi.set(e,t);let r=`${e} #${t}`,n=i=>(s,...a)=>Ja(Za(i,s,e,a,r)),o=Object.seal({id:r,namespace:e,module(i){return yi(`${o.namespace}/${i}`)},debug:n(pt.DEBUG),error:n(pt.ERROR),info:n(pt.INFO),warn:n(pt.WARN)});return o}function Kt(...e){e.forEach(t=>{let{append:r,filter:n}=t;ve(n)?wn.add(n):ve(r)&&_n.add(r)})}function Qa(e={}){let{name:t}=e,r=b(O("commerce.debug",{search:!0,storage:!0}),t===pe.LOCAL);return Kt(r?xi:vi),t===pe.PROD&&Kt(bn),z}function Ka(){_n.clear(),wn.clear()}var z={...yi(gn),Level:pt,Plugins:{consoleAppender:xi,debugFilter:vi,quietFilter:Xa,lanaAppender:bn},init:Qa,reset:Ka,use:Kt};var ec={CLASS_NAME_FAILED:Wt,CLASS_NAME_PENDING:qt,CLASS_NAME_RESOLVED:Yt,EVENT_TYPE_FAILED:Xt,EVENT_TYPE_PENDING:Zt,EVENT_TYPE_RESOLVED:Jt,STATE_FAILED:ie,STATE_PENDING:se,STATE_RESOLVED:ae},tc={[ie]:Wt,[se]:qt,[ae]:Yt},rc={[ie]:Xt,[se]:Zt,[ae]:Jt},rr=new WeakMap;function V(e){if(!rr.has(e)){let t=z.module(e.constructor.is);rr.set(e,{changes:new Map,connected:!1,dispose:je,error:void 0,log:t,options:void 0,promises:[],state:se,timer:null,value:void 0,version:0})}return rr.get(e)}function er(e){let t=V(e),{error:r,promises:n,state:o}=t;(o===ae||o===ie)&&(t.promises=[],o===ae?n.forEach(({resolve:i})=>i(e)):o===ie&&n.forEach(({reject:i})=>i(r))),e.dispatchEvent(new CustomEvent(rc[o],{bubbles:!0}))}function tr(e){let t=rr.get(e);[ie,se,ae].forEach(r=>{e.classList.toggle(tc[r],r===t.state)})}var nc={get error(){return V(this).error},get log(){return V(this).log},get options(){return V(this).options},get state(){return V(this).state},get value(){return V(this).value},attributeChangedCallback(e,t,r){V(this).changes.set(e,r),this.requestUpdate()},connectedCallback(){V(this).dispose=ui(()=>this.requestUpdate(!0))},disconnectedCallback(){let e=V(this);e.connected&&(e.connected=!1,e.log.debug("Disconnected:",{element:this})),e.dispose(),e.dispose=je},onceSettled(){let{error:e,promises:t,state:r}=V(this);return ae===r?Promise.resolve(this):ie===r?Promise.reject(e):new Promise((n,o)=>{t.push({resolve:n,reject:o})})},toggleResolved(e,t,r){let n=V(this);return e!==n.version?!1:(r!==void 0&&(n.options=r),n.state=ae,n.value=t,tr(this),this.log.debug("Resolved:",{element:this,value:t}),Ee(()=>er(this)),!0)},toggleFailed(e,t,r){let n=V(this);return e!==n.version?!1:(r!==void 0&&(n.options=r),n.error=t,n.state=ie,tr(this),n.log.error("Failed:",{element:this,error:t}),Ee(()=>er(this)),!0)},togglePending(e){let t=V(this);return t.version++,e&&(t.options=e),t.state=se,tr(this),Ee(()=>er(this)),t.version},requestUpdate(e=!1){if(!this.isConnected||!H())return;let t=V(this);if(t.timer)return;let{error:r,options:n,state:o,value:i,version:s}=t;t.state=se,t.timer=Ee(async()=>{t.timer=null;let a=null;if(t.changes.size&&(a=Object.fromEntries(t.changes.entries()),t.changes.clear()),t.connected?t.log.debug("Updated:",{element:this,changes:a}):(t.connected=!0,t.log.debug("Connected:",{element:this,changes:a})),a||e)try{await this.render?.()===!1&&t.state===se&&t.version===s&&(t.state=o,t.error=r,t.value=i,tr(this),er(this))}catch(c){this.toggleFailed(t.version,c,n)}})}};function Ei(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function nr(e,t={}){let{tag:r,is:n}=e,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,Ei(t)),o}function or(e){let{tag:t,is:r,prototype:n}=e,o=window.customElements.get(r);return o||(Object.defineProperties(n,Object.getOwnPropertyDescriptors(nc)),o=Object.defineProperties(e,Object.getOwnPropertyDescriptors(ec)),window.customElements.define(r,o,{extends:t})),o}function ir(e,t=document.body){return Array.from(t?.querySelectorAll(`${e.tag}[is="${e.is}"]`)??[])}function sr(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Ei(t)),e):null}var oc="download",ic="upgrade",Re,Ze=class Ze extends HTMLAnchorElement{constructor(){super();re(this,Re);this.addEventListener("click",this.clickHandler)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}static createCheckoutLink(r={},n=""){let o=H();if(!o)return null;let{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:a,entitlement:c,upgrade:h,modal:l,perpetual:d,promotionCode:m,quantity:p,wcsOsi:f,extraOptions:g}=o.collectCheckoutOptions(r),A=nr(Ze,{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:a,entitlement:c,upgrade:h,modal:l,perpetual:d,promotionCode:m,quantity:p,wcsOsi:f,extraOptions:g});return n&&(A.innerHTML=`<span>${n}</span>`),A}static getCheckoutLinks(r){return ir(Ze,r)}get isCheckoutLink(){return!0}get placeholder(){return this}clickHandler(r){var n;(n=$(this,Re))==null||n.call(this,r)}async render(r={}){if(!this.isConnected)return!1;let n=H();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(l=>{l&&(this.dataset.imsCountry=l)},je);let o=n.collectCheckoutOptions(r,this.placeholder);if(!o.wcsOsi.length)return!1;let i;try{i=JSON.parse(o.extraOptions??"{}")}catch(l){this.placeholder.log.error("cannot parse exta checkout options",l)}let s=this.placeholder.togglePending(o);this.href="";let a=n.resolveOfferSelectors(o),c=await Promise.all(a);c=c.map(l=>ut(l,o));let h=await n.buildCheckoutAction(c.flat(),{...i,...o});return this.renderOffers(c.flat(),o,{},h,s)}renderOffers(r,n,o={},i=void 0,s=void 0){if(!this.isConnected)return!1;let a=H();if(!a)return!1;if(n={...JSON.parse(this.placeholder.dataset.extraOptions??"null"),...n,...o},s??(s=this.placeholder.togglePending(n)),$(this,Re)&&ne(this,Re,void 0),i){this.classList.remove(oc,ic),this.placeholder.toggleResolved(s,r,n);let{url:h,text:l,className:d,handler:m}=i;return h&&(this.href=h),l&&(this.firstElementChild.innerHTML=l),d&&this.classList.add(...d.split(" ")),m&&(this.setAttribute("href","#"),ne(this,Re,m.bind(this))),!0}else if(r.length){if(this.placeholder.toggleResolved(s,r,n)){let h=a.buildCheckoutURL(r,n);return this.setAttribute("href",h),!0}}else{let h=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(s,h,n))return this.setAttribute("href","#"),!0}return!1}updateOptions(r={}){let n=H();if(!n)return!1;let{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:a,upgrade:c,modal:h,perpetual:l,promotionCode:d,quantity:m,wcsOsi:p}=n.collectCheckoutOptions(r);return sr(this,{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:a,upgrade:c,modal:h,perpetual:l,promotionCode:d,quantity:m,wcsOsi:p}),!0}};Re=new WeakMap,C(Ze,"is","checkout-link"),C(Ze,"tag","a");var Sn=Ze,An=or(Sn);var bi=[u.uk,u.au,u.fr,u.at,u.be_en,u.be_fr,u.be_nl,u.bg,u.ch_de,u.ch_fr,u.ch_it,u.cz,u.de,u.dk,u.ee,u.eg_ar,u.eg_en,u.es,u.fi,u.fr,u.gr_el,u.gr_en,u.hu,u.ie,u.it,u.lu_de,u.lu_en,u.lu_fr,u.nl,u.no,u.pl,u.pt,u.ro,u.se,u.si,u.sk,u.tr,u.ua,u.id_en,u.id_id,u.in_en,u.in_hi,u.jp,u.my_en,u.my_ms,u.nz,u.th_en,u.th_th],sc={INDIVIDUAL_COM:[u.za,u.lt,u.lv,u.ng,u.sa_ar,u.sa_en,u.za,u.sg,u.kr],TEAM_COM:[u.za,u.lt,u.lv,u.ng,u.za,u.co,u.kr],INDIVIDUAL_EDU:[u.lt,u.lv,u.sa_en,u.sea],TEAM_EDU:[u.sea,u.kr]},Je=class Je extends HTMLSpanElement{static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(t){let r=H();if(!r)return null;let{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:a,perpetual:c,promotionCode:h,quantity:l,template:d,wcsOsi:m}=r.collectPriceOptions(t);return nr(Je,{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:a,perpetual:c,promotionCode:h,quantity:l,template:d,wcsOsi:m})}static getInlinePrices(t){return ir(Je,t)}get isInlinePrice(){return!0}get placeholder(){return this}resolveDisplayTaxForGeoAndSegment(t,r,n,o){let i=`${t}_${r}`;if(bi.includes(t)||bi.includes(i))return!0;let s=sc[`${n}_${o}`];return s?!!(s.includes(t)||s.includes(i)):!1}async resolveDisplayTax(t,r){let[n]=await t.resolveOfferSelectors(r),o=ut(await n,r);if(o?.length){let{country:i,language:s}=r,a=o[0],[c=""]=a.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(i,s,a.customerSegment,c)}}async render(t={}){if(!this.isConnected)return!1;let r=H();if(!r)return!1;let n=r.collectPriceOptions(t,this.placeholder);if(!n.wcsOsi.length)return!1;let o=this.placeholder.togglePending(n);this.innerHTML="";let[i]=r.resolveOfferSelectors(n);return this.renderOffers(ut(await i,n),n,o)}renderOffers(t,r={},n=void 0){if(!this.isConnected)return;let o=H();if(!o)return!1;let i=o.collectPriceOptions({...this.dataset,...r});if(n??(n=this.placeholder.togglePending(i)),t.length){if(this.placeholder.toggleResolved(n,t,i))return this.innerHTML=o.buildPriceHTML(t,i),!0}else{let s=new Error(`Not provided: ${i?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(n,s,i))return this.innerHTML="",!0}return!1}updateOptions(t){let r=H();if(!r)return!1;let{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:a,perpetual:c,promotionCode:h,quantity:l,template:d,wcsOsi:m}=r.collectPriceOptions(t);return sr(this,{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:a,perpetual:c,promotionCode:h,quantity:l,template:d,wcsOsi:m}),!0}};C(Je,"is","inline-price"),C(Je,"tag","span");var Tn=Je,Pn=or(Tn);function _i({providers:e,settings:t},r){let n=z.module("checkout");function o(h,l){let{checkoutClientId:d,checkoutWorkflow:m,checkoutWorkflowStep:p,country:f,language:g,promotionCode:A,quantity:R}=t,{checkoutMarketSegment:T,checkoutWorkflow:S=m,checkoutWorkflowStep:L=p,imsCountry:E,country:I=E??f,language:F=g,quantity:J=R,entitlement:Q,upgrade:U,modal:W,perpetual:xe,promotionCode:Ae=A,wcsOsi:le,extraOptions:te,...ze}=Object.assign({},l?.dataset??{},h??{}),Pt=de(S,me,w.checkoutWorkflow),Ct=ue.CHECKOUT;Pt===me.V3&&(Ct=de(L,ue,w.checkoutWorkflowStep));let rt=We({...ze,extraOptions:te,checkoutClientId:d,checkoutMarketSegment:T,country:I,quantity:Xe(J,w.quantity),checkoutWorkflow:Pt,checkoutWorkflowStep:Ct,language:F,entitlement:b(Q),upgrade:b(U),modal:b(W),perpetual:b(xe),promotionCode:it(Ae).effectivePromoCode,wcsOsi:Qt(le)});if(l)for(let Er of e.checkout)Er(l,rt);return rt}async function i(h,l){let d=H(),m=await r.getCheckoutAction?.(h,l,d.imsSignedInPromise);return m||null}function s(h,l){if(!Array.isArray(h)||!h.length||!l)return"";let{env:d,landscape:m}=t,{checkoutClientId:p,checkoutMarketSegment:f,checkoutWorkflow:g,checkoutWorkflowStep:A,country:R,promotionCode:T,quantity:S,...L}=o(l),E=window.frameElement?"if":"fp",I={checkoutPromoCode:T,clientId:p,context:E,country:R,env:d,items:[],marketSegment:f,workflowStep:A,landscape:m,...L};if(h.length===1){let[{offerId:F,offerType:J,productArrangementCode:Q}]=h,{marketSegments:[U]}=h[0];Object.assign(I,{marketSegment:U,offerType:J,productArrangementCode:Q}),I.items.push(S[0]===1?{id:F}:{id:F,quantity:S[0]})}else I.items.push(...h.map(({offerId:F},J)=>({id:F,quantity:S[J]??w.quantity})));return Cr(g,I)}let{createCheckoutLink:a,getCheckoutLinks:c}=An;return{CheckoutLink:An,CheckoutWorkflow:me,CheckoutWorkflowStep:ue,buildCheckoutAction:i,buildCheckoutURL:s,collectCheckoutOptions:o,createCheckoutLink:a,getCheckoutLinks:c}}function ac({interval:e=200,maxAttempts:t=25}={}){let r=z.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let o=0;function i(){window.adobeIMS?.initialized?n():++o>t?(r.debug("Timeout"),n()):setTimeout(i,e)}i()})}function cc(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function lc(e){let t=z.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function wi({}){let e=ac(),t=cc(e),r=lc(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}function hc(e){if(!e.priceLiteralsURL)throw new Error(fn);return new Promise(t=>{window.fetch(e.priceLiteralsURL).then(r=>{r.json().then(({data:n})=>{t(n)})})})}async function Si(e){let r=await(e.priceLiteralsPromise||hc(e));if(Array.isArray(r)){let n=i=>r.find(s=>$t(s.lang,i)),o=n(e.language)??n(w.language);if(o)return Object.freeze(o)}return{}}function Ai({literals:e,providers:t,settings:r}){function n(a,c){let{country:h,displayOldPrice:l,displayPerUnit:d,displayRecurrence:m,displayTax:p,forceTaxExclusive:f,language:g,promotionCode:A,quantity:R}=r,{displayOldPrice:T=l,displayPerUnit:S=d,displayRecurrence:L=m,displayTax:E=p,forceTaxExclusive:I=f,country:F=h,language:J=g,perpetual:Q,promotionCode:U=A,quantity:W=R,template:xe,wcsOsi:Ae,...le}=Object.assign({},c?.dataset??{},a??{}),te=We({...le,country:F,displayOldPrice:b(T),displayPerUnit:b(S),displayRecurrence:b(L),displayTax:b(E),forceTaxExclusive:b(I),language:J,perpetual:b(Q),promotionCode:it(U).effectivePromoCode,quantity:Xe(W,w.quantity),template:xe,wcsOsi:Qt(Ae)});if(c)for(let ze of t.price)ze(c,te);return te}function o(a,c){if(!Array.isArray(a)||!a.length||!c)return"";let{template:h}=c,l;switch(h){case"discount":l=sn;break;case"strikethrough":l=nn;break;case"optical":l=rn;break;case"annual":l=on;break;default:l=c.promotionCode?tn:en}let d=n(c);d.literals=Object.assign({},e.price,We(c.literals??{}));let[m]=a;return m={...m,...m.priceDetails},l(d,m)}let{createInlinePrice:i,getInlinePrices:s}=Pn;return{InlinePrice:Pn,buildPriceHTML:o,collectPriceOptions:n,createInlinePrice:i,getInlinePrices:s}}var Cn="_acom",Ti={[X.PRODUCTION]:"https://www.adobe.com",[X.STAGE]:"https://www.stage.adobe.com",[X.PRODUCTION+Cn]:"https://www.adobe.com",[X.STAGE+Cn]:"https://www.stage.adobe.com"};function Pi({settings:e}){let t=z.module("wcs"),{env:r,domainSwitch:n,wcsApiKey:o}=e,i=n?Ti[r+Cn]:Ti[r],s={apiKey:o,baseUrl:i,fetch:window.fetch.bind(window)},a=Rt(s),c=new Map,h=new Map,l;async function d(f,g,A=!0){let R=pn;try{t.debug("Fetching:",f),f.offerSelectorIds=f.offerSelectorIds.sort();let{data:T}=await a(f,{apiKey:o,environment:e.wcsEnv,landscape:r===X.STAGE?"ALL":e.landscape},({resolvedOffers:L})=>({offers:L.map(dn)}));t.debug("Fetched:",f,T);let{offers:S}=T??{};g.forEach(({resolve:L},E)=>{let I=S.filter(({offerSelectorIds:F})=>F.includes(E)).flat();I.length&&(g.delete(E),L(I))})}catch(T){T.status===404&&f.offerSelectorIds.length>1?(t.debug("Multi-osi 404, fallback to fetch-by-one strategy"),await Promise.allSettled(f.offerSelectorIds.map(S=>d({...f,offerSelectorIds:[S]},g,!1)))):(t.error("Failed:",f,T),R=un)}A&&g.size&&(t.debug("Missing:",{offerSelectorIds:[...g.keys()]}),g.forEach(T=>{T.reject(new Error(R))}))}function m(){clearTimeout(l);let f=[...h.values()];h.clear(),f.forEach(({options:g,promises:A})=>d(g,A))}function p({country:f,language:g,perpetual:A=!1,promotionCode:R="",wcsOsi:T=[]}){let S=`${g}_${f}`;f!=="GB"&&(g=A?"EN":"MULT");let L=[f,g,R].filter(E=>E).join("-").toLowerCase();return T.map(E=>{let I=`${E}-${L}`;if(!c.has(I)){let F=new Promise((J,Q)=>{let U=h.get(L);if(!U){let W={country:f,locale:S,offerSelectorIds:[]};f!=="GB"&&(W.language=g),U={options:W,promises:new Map},h.set(L,U)}R&&(U.options.promotionCode=R),U.options.offerSelectorIds.push(E),U.promises.set(E,{resolve:J,reject:Q}),U.options.offerSelectorIds.length>=e.wcsBufferLimit?m():(t.debug("Queued:",U.options),l||(l=setTimeout(m,e.wcsBufferDelay)))});c.set(I,F)}return c.get(I)})}return{WcsCommitment:ci,WcsPlanType:li,WcsTerm:hi,resolveOfferSelectors:p}}var j=class extends HTMLElement{get isWcmsCommerce(){return!0}};C(j,"instance"),C(j,"promise",null);window.customElements.define(ye,j);async function dc(e,t){let r=z.init(e.env).module("service");r.debug("Activating:",e);let n={price:{}},o=Object.freeze(pi(e));try{n.price=await Si(o)}catch(c){r.warn("Price literals were not fetched:",c)}let i={checkout:new Set,price:new Set},s=document.createElement(ye),a={literals:n,providers:i,settings:o};return j.instance=Object.defineProperties(s,Object.getOwnPropertyDescriptors({..._i(a,t),...wi(a),...Ai(a),...Pi(a),...yn,Log:z,get defaults(){return w},get literals(){return n},get log(){return z},get providers(){return{checkout(c){return i.checkout.add(c),()=>i.checkout.delete(c)},price(c){return i.price.add(c),()=>i.price.delete(c)}}},get settings(){return o}})),r.debug("Activated:",{literals:n,settings:o,element:s}),document.head.append(s),Ee(()=>{let c=new CustomEvent(Ye,{bubbles:!0,cancelable:!1,detail:j.instance});j.instance.dispatchEvent(c)}),j.instance}function Ci(){document.head.querySelector(ye)?.remove(),j.promise=null,z.reset()}function ft(e,t){let r=ve(e)?e():null,n=ve(t)?t():{};return r&&(n.force&&Ci(),dc(r,n).then(o=>{ft.resolve(o)})),j.promise??(j.promise=new Promise(o=>{ft.resolve=o})),j.promise}var ar=window,lr=ar.ShadowRoot&&(ar.ShadyCSS===void 0||ar.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Li=Symbol(),Oi=new WeakMap,cr=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==Li)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(lr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=Oi.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Oi.set(r,t))}return t}toString(){return this.cssText}},Ni=e=>new cr(typeof e=="string"?e:e+"",void 0,Li);var On=(e,t)=>{lr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=ar.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},hr=lr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return Ni(r)})(e):e;var Ln,dr=window,Ri=dr.trustedTypes,mc=Ri?Ri.emptyScript:"",$i=dr.reactiveElementPolyfillSupport,Rn={toAttribute(e,t){switch(t){case Boolean:e=e?mc:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},Ii=(e,t)=>t!==e&&(t==t||e==e),Nn={attribute:!0,type:String,converter:Rn,reflect:!1,hasChanged:Ii},$n="finalized",$e=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=Nn){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Nn}static finalize(){if(this.hasOwnProperty($n))return!1;this[$n]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(hr(o))}else t!==void 0&&r.push(hr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return On(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=Nn){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:Rn).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:Rn;this._$El=i,this[i]=a.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||Ii)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};$e[$n]=!0,$e.elementProperties=new Map,$e.elementStyles=[],$e.shadowRootOptions={mode:"open"},$i?.({ReactiveElement:$e}),((Ln=dr.reactiveElementVersions)!==null&&Ln!==void 0?Ln:dr.reactiveElementVersions=[]).push("1.6.3");var In,mr=window,Qe=mr.trustedTypes,ki=Qe?Qe.createPolicy("lit-html",{createHTML:e=>e}):void 0,Mn="$lit$",be=`lit$${(Math.random()+"").slice(9)}$`,Hi="?"+be,uc=`<${Hi}>`,Me=document,xt=()=>Me.createComment(""),vt=e=>e===null||typeof e!="object"&&typeof e!="function",Vi=Array.isArray,pc=e=>Vi(e)||typeof e?.[Symbol.iterator]=="function",kn=`[ 	
\f\r]`,gt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Mi=/-->/g,Ui=/>/g,Ie=RegExp(`>|${kn}(?:([^\\s"'>=/]+)(${kn}*=${kn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Di=/'/g,Fi=/"/g,ji=/^(?:script|style|textarea|title)$/i,Bi=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),x=Bi(1),Zd=Bi(2),Ue=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),zi=new WeakMap,ke=Me.createTreeWalker(Me,129,null,!1);function Wi(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return ki!==void 0?ki.createHTML(t):t}var fc=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=gt;for(let a=0;a<r;a++){let c=e[a],h,l,d=-1,m=0;for(;m<c.length&&(s.lastIndex=m,l=s.exec(c),l!==null);)m=s.lastIndex,s===gt?l[1]==="!--"?s=Mi:l[1]!==void 0?s=Ui:l[2]!==void 0?(ji.test(l[2])&&(o=RegExp("</"+l[2],"g")),s=Ie):l[3]!==void 0&&(s=Ie):s===Ie?l[0]===">"?(s=o??gt,d=-1):l[1]===void 0?d=-2:(d=s.lastIndex-l[2].length,h=l[1],s=l[3]===void 0?Ie:l[3]==='"'?Fi:Di):s===Fi||s===Di?s=Ie:s===Mi||s===Ui?s=gt:(s=Ie,o=void 0);let p=s===Ie&&e[a+1].startsWith("/>")?" ":"";i+=s===gt?c+uc:d>=0?(n.push(h),c.slice(0,d)+Mn+c.slice(d)+be+p):c+be+(d===-2?(n.push(void 0),a):p)}return[Wi(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},yt=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,a=t.length-1,c=this.parts,[h,l]=fc(t,r);if(this.el=e.createElement(h,n),ke.currentNode=this.el.content,r===2){let d=this.el.content,m=d.firstChild;m.remove(),d.append(...m.childNodes)}for(;(o=ke.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes()){let d=[];for(let m of o.getAttributeNames())if(m.endsWith(Mn)||m.startsWith(be)){let p=l[s++];if(d.push(m),p!==void 0){let f=o.getAttribute(p.toLowerCase()+Mn).split(be),g=/([.?@])?(.*)/.exec(p);c.push({type:1,index:i,name:g[2],strings:f,ctor:g[1]==="."?Dn:g[1]==="?"?Fn:g[1]==="@"?zn:et})}else c.push({type:6,index:i})}for(let m of d)o.removeAttribute(m)}if(ji.test(o.tagName)){let d=o.textContent.split(be),m=d.length-1;if(m>0){o.textContent=Qe?Qe.emptyScript:"";for(let p=0;p<m;p++)o.append(d[p],xt()),ke.nextNode(),c.push({type:2,index:++i});o.append(d[m],xt())}}}else if(o.nodeType===8)if(o.data===Hi)c.push({type:2,index:i});else{let d=-1;for(;(d=o.data.indexOf(be,d+1))!==-1;)c.push({type:7,index:i}),d+=be.length-1}i++}}static createElement(t,r){let n=Me.createElement("template");return n.innerHTML=t,n}};function Ke(e,t,r=e,n){var o,i,s,a;if(t===Ue)return t;let c=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,h=vt(t)?void 0:t._$litDirective$;return c?.constructor!==h&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),h===void 0?c=void 0:(c=new h(e),c._$AT(e,r,n)),n!==void 0?((s=(a=r)._$Co)!==null&&s!==void 0?s:a._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=Ke(e,c._$AS(e,t.values),c,n)),t}var Un=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:Me).importNode(n,!0);ke.currentNode=i;let s=ke.nextNode(),a=0,c=0,h=o[0];for(;h!==void 0;){if(a===h.index){let l;h.type===2?l=new Et(s,s.nextSibling,this,t):h.type===1?l=new h.ctor(s,h.name,h.strings,this,t):h.type===6&&(l=new Gn(s,this,t)),this._$AV.push(l),h=o[++c]}a!==h?.index&&(s=ke.nextNode(),a++)}return ke.currentNode=Me,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Et=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Ke(this,t,r),vt(t)?t===M||t==null||t===""?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==Ue&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):pc(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==M&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.$(Me.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=yt.createElement(Wi(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new Un(i,this),a=s.u(this.options);s.v(n),this.$(a),this._$AH=s}}_$AC(t){let r=zi.get(t.strings);return r===void 0&&zi.set(t.strings,r=new yt(t)),r}T(t){Vi(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(xt()),this.k(xt()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},et=class{constructor(t,r,n,o,i){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=M}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=Ke(this,t,r,0),s=!vt(t)||t!==this._$AH&&t!==Ue,s&&(this._$AH=t);else{let a=t,c,h;for(t=i[0],c=0;c<i.length-1;c++)h=Ke(this,a[n+c],r,c),h===Ue&&(h=this._$AH[c]),s||(s=!vt(h)||h!==this._$AH[c]),h===M?t=M:t!==M&&(t+=(h??"")+i[c+1]),this._$AH[c]=h}s&&!o&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Dn=class extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}},gc=Qe?Qe.emptyScript:"",Fn=class extends et{constructor(){super(...arguments),this.type=4}j(t){t&&t!==M?this.element.setAttribute(this.name,gc):this.element.removeAttribute(this.name)}},zn=class extends et{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=Ke(this,t,r,0))!==null&&n!==void 0?n:M)===Ue)return;let o=this._$AH,i=t===M&&o!==M||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==M&&(o===M||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},Gn=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ke(this,t)}};var Gi=mr.litHtmlPolyfillSupport;Gi?.(yt,Et),((In=mr.litHtmlVersions)!==null&&In!==void 0?In:mr.litHtmlVersions=[]).push("2.8.0");var qi=(e,t,r)=>{var n,o;let i=(n=r?.renderBefore)!==null&&n!==void 0?n:t,s=i._$litPart$;if(s===void 0){let a=(o=r?.renderBefore)!==null&&o!==void 0?o:null;i._$litPart$=s=new Et(t.insertBefore(xt(),a),a,void 0,r??{})}return s._$AI(e),s};var ur=window,pr=ur.ShadowRoot&&(ur.ShadyCSS===void 0||ur.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Hn=Symbol(),Yi=new WeakMap,bt=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==Hn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(pr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=Yi.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Yi.set(r,t))}return t}toString(){return this.cssText}},_e=e=>new bt(typeof e=="string"?e:e+"",void 0,Hn),De=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((n,o,i)=>n+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new bt(r,e,Hn)},Vn=(e,t)=>{pr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=ur.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},fr=pr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return _e(r)})(e):e;var jn,gr=window,Xi=gr.trustedTypes,xc=Xi?Xi.emptyScript:"",Zi=gr.reactiveElementPolyfillSupport,Wn={toAttribute(e,t){switch(t){case Boolean:e=e?xc:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},Ji=(e,t)=>t!==e&&(t==t||e==e),Bn={attribute:!0,type:String,converter:Wn,reflect:!1,hasChanged:Ji},qn="finalized",fe=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=Bn){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Bn}static finalize(){if(this.hasOwnProperty(qn))return!1;this[qn]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(fr(o))}else t!==void 0&&r.push(fr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Vn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=Bn){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:Wn).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:Wn;this._$El=i,this[i]=a.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||Ji)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};fe[qn]=!0,fe.elementProperties=new Map,fe.elementStyles=[],fe.shadowRootOptions={mode:"open"},Zi?.({ReactiveElement:fe}),((jn=gr.reactiveElementVersions)!==null&&jn!==void 0?jn:gr.reactiveElementVersions=[]).push("1.6.3");var Yn,Xn;var ce=class extends fe{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=qi(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return Ue}};ce.finalized=!0,ce._$litElement$=!0,(Yn=globalThis.litElementHydrateSupport)===null||Yn===void 0||Yn.call(globalThis,{LitElement:ce});var Qi=globalThis.litElementPolyfillSupport;Qi?.({LitElement:ce});((Xn=globalThis.litElementVersions)!==null&&Xn!==void 0?Xn:globalThis.litElementVersions=[]).push("3.3.3");var _t="(max-width: 767px)",wt="(max-width: 1199px)",B="(min-width: 768px)",G="(min-width: 1200px)",Z="(min-width: 1600px)";var Ki=De`
    :host {
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: start;
        background-color: var(--consonant-merch-card-background-color);
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        background-color: var(--consonant-merch-card-background-color);
        font-family: var(--body-font-family, 'Adobe Clean');
        border-radius: var(--consonant-merch-spacing-xs);
        border: 1px solid var(--consonant-merch-card-border-color);
        box-sizing: border-box;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([variant='special-offers']) {
        min-height: 439px;
    }

    :host([variant='catalog']) {
        min-height: 330px;
    }

    :host([variant='plans']) {
        min-height: 348px;
    }

    :host([variant='segment']) {
        min-height: 214px;
    }

    :host([variant='ccd-action']:not([size])) {
        width: var(--consonant-merch-card-ccd-action-width);
    }

    :host([aria-selected]) {
        outline: none;
        box-sizing: border-box;
        box-shadow: inset 0 0 0 2px var(--color-accent);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
    }

    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
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

    hr {
        background-color: var(--color-gray-200);
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
    }
    .hidden {
        visibility: hidden;
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--color-gray-600);
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

    .twp-badge {
        padding: 4px 10px 5px 10px;
    }

    :host([aria-selected]) .twp-badge {
        margin-inline-end: 2px;
        padding-inline-end: 9px;
    }

    :host([variant='twp']) {
        padding: 4px 10px 5px 10px;
    }

    slot[name='icons'] {
        display: flex;
        gap: 8px;
    }

    :host([variant='twp']) ::slotted(merch-offer-select) {
        display: none;
    }

    :host([variant='twp']) .top-section {
        flex: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        gap: var(--consonant-merch-spacing-xxs);
        padding: var(--consonant-merch-spacing-xs)
            var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs)
            var(--consonant-merch-spacing-xs);
        align-items: flex-start;
    }

    :host([variant='twp']) .body {
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    :host([variant='twp']) footer {
        gap: var(--consonant-merch-spacing-xxs);
        flex-direction: column;
        align-self: flex-start;
    }

    :host([variant='special-offers'].center) {
        text-align: center;
    }

    /* plans */
    :host([variant='plans']) {
        min-height: 348px;
    }

    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-top-section-height);
    }

    @media screen and ${_e(wt)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${_e(G)} {
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
        min-height: var(--consonant-merch-card-mini-compare-heading-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='body-m'] {
        min-height: var(--consonant-merch-card-mini-compare-body-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='heading-m-price'] {
        min-height: var(
            --consonant-merch-card-mini-compare-heading-m-price-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='price-commitment'] {
        min-height: var(
            --consonant-merch-card-mini-compare-price-commitment-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='offers'] {
        min-height: var(--consonant-merch-card-mini-compare-offers-height);
    }
    :host([variant='mini-compare-chart']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-mini-compare-promo-text-height);
    }
    :host([variant='mini-compare-chart']) slot[name='callout-content'] {
        min-height: var(
            --consonant-merch-card-mini-compare-callout-content-height
        );
    }

    :host([variant='plans']) ::slotted([slot='heading-xs']),
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
        max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
`,es=()=>{let e=[De`
        /* Tablet */
        @media screen and ${_e(B)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                grid-column: span 3;
                width: 100%;
                max-width: var(--consonant-merch-card-tablet-wide-width);
                margin: 0 auto;
            }
        }

        /* Laptop */
        @media screen and ${_e(G)} {
            :host([size='super-wide']) {
                grid-column: span 3;
            }
        `];return e.push(De`
        /* Large desktop */
        @media screen and ${_e(Z)} {
            :host([size='super-wide']) {
                grid-column: span 4;
            }
        }
    `),e};function we(e,t={},r){let n=document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[o,i]of Object.entries(t))n.setAttribute(o,i);return n}function ts(){return window.matchMedia("(max-width: 767px)").matches}function rs(){return window.matchMedia("(max-width: 1024px)").matches}function ns(e=1e3){return new Promise(t=>setTimeout(t,e))}var os=document.createElement("style");os.innerHTML=`
:root {
    --consonant-merch-card-detail-font-size: 12px;
    --consonant-merch-card-detail-font-weight: 500;
    --consonant-merch-card-detail-letter-spacing: 0.8px;
    --consonant-merch-card-background-color: #fff;

    --consonant-merch-card-heading-font-size: 18px;
    --consonant-merch-card-heading-line-height: 22.5px;
    --consonant-merch-card-heading-secondary-font-size: 14px;
    --consonant-merch-card-body-font-size: 14px;
    --consonant-merch-card-body-line-height: 21px;
    --consonant-merch-card-promo-text-height: var(--consonant-merch-card-body-font-size);

    /* responsive width */
    --consonant-merch-card-mobile-width: 300px;
    --consonant-merch-card-tablet-wide-width: 700px;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --consonant-merch-card-cta-font-size: 15px;

    /* headings */
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
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;

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
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;
    --consonant-merch-card-image-height: 180px;

    /* colors */
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: #1473E6;
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-80: #2c2c2c;
    --merch-color-green-promo: #2D9D78;

    /* merch card generic */
    --consonant-merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* special offers */
    --consonant-merch-card-special-offers-width: 378px;

    /* image */
    --consonant-merch-card-image-width: 300px;

    /* segment */
    --consonant-merch-card-segment-width: 378px;

    /* inline-heading */
    --consonant-merch-card-inline-heading-width: 300px;

    /* product */
    --consonant-merch-card-product-width: 300px;

    /* plans */
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;

    /* catalog */
    --consonant-merch-card-catalog-width: 276px;
    --consonant-merch-card-catalog-icon-size: 40px;

    /* twp */
    --consonant-merch-card-twp-width: 268px;
    --consonant-merch-card-twp-mobile-width: 300px;
    --consonant-merch-card-twp-mobile-height: 358px;

    /* ccd-action */
    --consonant-merch-card-ccd-action-width: 276px;
    --consonant-merch-card-ccd-action-min-height: 320px;


    /*mini compare chart */
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;

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
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin-bottom: var(--consonant-merch-spacing-xs);
    height: 1px;
    border: none;
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="strikethrough"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is=inline-price] {
    display: inline-block;
}

merch-card [slot='heading-xs'] {
    color: var(--merch-color-grey-80);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    margin: 0;
    text-decoration: none;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-grey-80);
}

merch-card [slot='starting-at'] {
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
    color: var(--merch-color-grey-80);
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
    color: var(--merch-color-grey-80);
    font-weight: 700;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    font-weight: 700;
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='heading-l'] {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
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
    text-align: left;
    font: normal normal normal var(--consonant-merch-card-callout-font-size)/var(--consonant-merch-card-callout-line-height) var(--body-font-family, 'Adobe Clean');
    letter-spacing: var(--consonant-merch-card-callout-letter-spacing);
    color: var(--consonant-merch-card-callout-font-color);
}

merch-card [slot='callout-content'] img {
    width: var(--consonant-merch-card-callout-icon-size);
    height: var(--consonant-merch-card-callout-icon-size);
    margin: 2.5px 0px 0px 9px;
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
    color: var(--merch-color-grey-80);
    margin: 0;
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--merch-color-grey-80);
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

merch-card[variant="plans"] [slot="description"] {
    min-height: 84px;
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
}

merch-card[variant="ccd-action"] .price-strikethrough {
    font-size: 18px;
}

merch-card[variant="plans"] [slot="quantity-select"] {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding: var(--consonant-merch-spacing-xs);
}

merch-card[variant="twp"] div[class$='twp-badge'] {
    padding: 4px 10px 5px 10px;
}

merch-card[variant="twp"] [slot="body-xs-top"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--merch-color-grey-80);
}

merch-card[variant="twp"] [slot="body-xs"] ul {
    padding: 0;
    margin: 0;
}

merch-card[variant="twp"] [slot="body-xs"] ul li {
    list-style-type: none;
    padding-left: 0;
}

merch-card[variant="twp"] [slot="body-xs"] ul li::before {
    content: '\xB7';
    font-size: 20px;
    padding-right: 5px;
    font-weight: bold;
}

merch-card[variant="twp"] [slot="footer"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    padding: var(--consonant-merch-spacing-s)
    var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
    color: var(--merch-color-grey-80);
    display: flex;
    flex-flow: wrap;
}

merch-card[variant='twp'] merch-quantity-select,
merch-card[variant='twp'] merch-offer-select {
    display: none;
}

[slot="cci-footer"] p,
[slot="cct-footer"] p,
[slot="cce-footer"] p {
    margin: 0;
}

/* mini compare chart card styles */

merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
}

merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
}

merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
}

merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
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

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--consonant-merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--consonant-merch-card-promo-text-height);
    margin: 0;
    min-height: var(--consonant-merch-card-promo-text-height);
    padding: 0;
}


merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;    
}

merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;
}

merch-card[variant="mini-compare-chart"] [slot="promo-text"] a {
    text-decoration: underline;
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

merch-card[variant="mini-compare-chart"] .footer-row-cell {
    border-top: 1px solid var(--consonant-merch-card-border-color);
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    place-items: center;
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
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
    text-decoration: solid;
}

/* mini compare mobile */ 
@media screen and ${_t} {
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

/* mini compare tablet */
@media screen and ${wt} {
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

div[slot="footer"] {
    display: contents;
}

[slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

[slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-image-height);
    max-height: var(--consonant-merch-card-image-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

/* Mobile */
@media screen and ${_t} {
    :root {
        --consonant-merch-card-mini-compare-chart-width: 302px;
        --consonant-merch-card-segment-width: 276px;
        --consonant-merch-card-mini-compare-chart-wide-width: 302px;
        --consonant-merch-card-special-offers-width: 302px;
        --consonant-merch-card-twp-width: 300px;
    }
}


/* Tablet */
@media screen and ${B} {
    :root {
        --consonant-merch-card-catalog-width: 302px;
        --consonant-merch-card-plans-width: 302px;
        --consonant-merch-card-segment-width: 276px;
        --consonant-merch-card-mini-compare-chart-width: 302px;
        --consonant-merch-card-mini-compare-chart-wide-width: 302px;
        --consonant-merch-card-special-offers-width: 302px;
        --consonant-merch-card-twp-width: 268px;
    }
}

/* desktop */
@media screen and ${G} {
    :root {
        --consonant-merch-card-catalog-width: 276px;
        --consonant-merch-card-plans-width: 276px;
        --consonant-merch-card-segment-width: 302px;
        --consonant-merch-card-inline-heading-width: 378px;
        --consonant-merch-card-product-width: 378px;
        --consonant-merch-card-image-width: 378px;
        --consonant-merch-card-mini-compare-chart-width: 378px;
        --consonant-merch-card-mini-compare-chart-wide-width: 484px;
        --consonant-merch-card-twp-width: 268px;
    }
}

/* supported cards */
/* grid style for plans */
.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    grid-template-columns: var(--consonant-merch-card-plans-width);
}

/* Tablet */
@media screen and ${B} {
    .two-merch-cards.plans,
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}

/* desktop */
@media screen and ${G} {
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
    }
}

/* Large desktop */
    @media screen and ${Z} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}


/* grid style for catalog */
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--consonant-merch-card-catalog-width);
}

/* Tablet */
@media screen and ${B} {
    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

/* desktop */
@media screen and ${G} {
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

/* Large desktop */
    @media screen and ${Z} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--consonant-merch-card-catalog-width));
    }
}


/* grid style for special-offers */
.one-merch-card.special-offers,
.two-merch-cards.special-offers,
.three-merch-cards.special-offers,
.four-merch-cards.special-offers {
    grid-template-columns: minmax(300px, var(--consonant-merch-card-special-offers-width));
}

/* Tablet */
@media screen and ${B} {
    .two-merch-cards.special-offers,
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(2, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

/* desktop */
@media screen and ${G} {
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

@media screen and ${Z} {
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}


/* grid style for image */
.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
    grid-template-columns: var(--consonant-merch-card-image-width);
}

/* Tablet */
@media screen and ${B} {
    .two-merch-cards.image,
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
    }
}

/* desktop */
@media screen and ${G} {
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
    }
}

/* Large desktop */
    @media screen and ${Z} {
    .four-merch-cards.image {
        grid-template-columns: repeat(4, var(--consonant-merch-card-image-width));
    }
}


/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
    grid-template-columns: minmax(276px, var(--consonant-merch-card-segment-width));
}

/* Tablet */
@media screen and ${B} {
    .two-merch-cards.segment,
    .three-merch-cards.segment,
    .four-merch-cards.segment {
        grid-template-columns: repeat(2, minmax(276px, var(--consonant-merch-card-segment-width)));
    }
}

/* desktop */
@media screen and ${G} {
    .three-merch-cards.segment {
        grid-template-columns: repeat(3, minmax(276px, var(--consonant-merch-card-segment-width)));
    }

    .four-merch-cards.segment {
        grid-template-columns: repeat(4, minmax(276px, var(--consonant-merch-card-segment-width)));
    }
}


/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--consonant-merch-card-product-width);
}

/* Tablet */
@media screen and ${B} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${G} {
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
    }
}

/* Large desktop */
    @media screen and ${Z} {
    .four-merch-cards.product {
        grid-template-columns: repeat(4, var(--consonant-merch-card-product-width));
    }
}

/* grid style for twp */
.one-merch-card.twp,
.two-merch-cards.twp,
.three-merch-cards.twp {
    grid-template-columns: var(--consonant-merch-card-image-width);
}

/* Tablet */
@media screen and ${B} {
    .one-merch-card.twp,
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* desktop */
@media screen and ${G} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Large desktop */
    @media screen and ${Z} {
        .one-merch-card.twp
        .two-merch-cards.twp {
            grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
        }
        .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Mobile */
@media screen and ${_t} {
    .one-merch-card.twp,
    .two-merch-cards.twp,
    .three-merch-cards.twp {
        grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
    }
}

/* grid style for inline-heading */
.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

/* Tablet */
@media screen and ${B} {
    .two-merch-cards.inline-heading,
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
    }
}

/* desktop */
@media screen and ${G} {
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
    }
}

/* Large desktop */
    @media screen and ${Z} {
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
    }
}

/* grid style for ccd-action */
.one-merch-card.ccd-action,
.two-merch-cards.ccd-action,
.three-merch-cards.ccd-action,
.four-merch-cards.ccd-action {
    grid-template-columns: var(--consonant-merch-card-ccd-action-width);
}

/* Tablet */
@media screen and ${B} {
    .two-merch-cards.ccd-action,
    .three-merch-cards.ccd-action,
    .four-merch-cards.ccd-action {
        grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-action-width));
    }
}

/* desktop */
@media screen and ${G} {
    .three-merch-cards.ccd-action,
    .four-merch-cards.ccd-action {
        grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-action-width));
    }
}

/* Large desktop */
    @media screen and ${Z} {
    .four-merch-cards.ccd-action {
        grid-template-columns: repeat(4, var(--consonant-merch-card-ccd-action-width));
    }
}

/* grid style for mini-compare-chart */
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

@media screen and ${_t} {
    .two-merch-cards.mini-compare-chart,
    .three-merch-cards.mini-compare-chart,
    .four-merch-cards.mini-compare-chart {
        grid-template-columns: var(--consonant-merch-card-mini-compare-chart-width);
        gap: var(--consonant-merch-spacing-xs);
    }
}

@media screen and ${wt} {
    .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
        flex: 1;
    }
}

/* Tablet */
@media screen and ${B} {
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
@media screen and ${G} {
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

@media screen and ${Z} {
    .four-merch-cards.mini-compare-chart {
        grid-template-columns: repeat(4, var(--consonant-merch-card-mini-compare-chart-width));
    }
}

/* mini-compare card footer rows */
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

span[is="inline-price"][data-template='strikethrough'] {
    text-decoration: line-through;
}

merch-card sp-button a {
  text-decoration: none;
    color: var(
        --highcontrast-button-content-color-default,
        var(
            --mod-button-content-color-default,
            var(--spectrum-button-content-color-default)
        )
    );
}

merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  font-weight: normal;
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
`;document.head.appendChild(os);var is="merch-offer-select:ready",ss="merch-card:ready",as="merch-card:action-menu-toggle";var Zn="merch-storage:change",Jn="merch-quantity-selector:change";var vc="merch-card",yc=32,xr="mini-compare-chart",cs=e=>`--consonant-merch-card-footer-row-${e}-min-height`,ge,St=class extends ce{constructor(){super();C(this,"customerSegment");C(this,"marketSegment");re(this,ge);this.filters={},this.types="",this.selected=!1}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&(this.style.border=this.computedBorderStyle),this.updateComplete.then(async()=>{let o=Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]')).filter(i=>!i.closest('[slot="callout-content"]'));await Promise.all(o.map(i=>i.onceSettled())),this.adjustTitleWidth(),ts()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())})}get computedBorderStyle(){return this.variant!=="twp"?`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`:""}get evergreen(){return this.classList.contains("intro-pricing")}get stockCheckbox(){return this.checkboxLabel?x`<label id="stock-checkbox">
                    <input type="checkbox" @change=${this.toggleStockOffer}></input>
                    <span></span>
                    ${this.checkboxLabel}
                </label>`:""}get cardImage(){return x` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}get secureLabelFooter(){let r=this.secureLabel?x`<span class="secure-transaction-label"
                  >${this.secureLabel}</span
              >`:"";return x`<footer>${r}<slot name="footer"></slot></footer>`}get miniCompareFooter(){let r=this.secureLabel?x`<slot name="secure-transaction-label">
                  <span class="secure-transaction-label"
                      >${this.secureLabel}</span
                  ></slot
              >`:x`<slot name="secure-transaction-label"></slot>`;return x`<footer>${r}<slot name="footer"></slot></footer>`}get badge(){let r;if(!(!this.badgeBackgroundColor||!this.badgeColor||!this.badgeText))return this.evergreen&&(r=`border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`),x`
            <div
                id="badge"
                class="${this.variant}-badge"
                style="background-color: ${this.badgeBackgroundColor};
                    color: ${this.badgeColor};
                    ${r}"
            >
                ${this.badgeText}
            </div>
        `}get badgeElement(){return this.shadowRoot.getElementById("badge")}getContainer(){return this.closest('[class*="-merch-cards"]')??this.parentElement}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let i=o.value?.[0]?.planType;if(!i)return;let s=this.stockOfferOsis[i];if(!s)return;let a=o.dataset.wcsOsi.split(",").filter(c=>c!==s);r.checked&&a.push(s),o.dataset.wcsOsi=a.join(",")}}toggleActionMenu(r){let n=r?.type==="mouseleave"?!0:void 0,o=this.shadowRoot.querySelector('slot[name="action-menu-content"]');o&&(n||this.dispatchEvent(new CustomEvent(as,{bubbles:!0,composed:!0,detail:{card:this.name,type:"action-menu"}})),o.classList.toggle("hidden",n))}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.variant==="special-offers"?this.querySelector('[slot="detail-m"]'):this.querySelector('[slot="heading-xs"]')}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let i=n[o].order;i===1||isNaN(i)||(n[o].order=Number(i)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}render(){if(!(!this.isConnected||this.style.display==="none"))switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"image":return this.renderImage();case"product":return this.renderProduct();case"inline-heading":return this.renderInlineHeading();case xr:return this.renderMiniCompareChart();case"ccd-action":return this.renderCcdAction();case"twp":return this.renderTwp();default:return this.renderProduct()}}renderSpecialOffer(){return x`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?x`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:x`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
                  <slot></slot>`}get promoBottom(){return this.classList.contains("promo-bottom")}get startingAt(){return this.classList.contains("starting-at")}renderSegment(){return x` ${this.badge}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
            </div>
            <hr />
            ${this.secureLabelFooter}`}renderPlans(){return x` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":x`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
                <slot name="body-xs"></slot>
                ${this.promoBottom?x`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
                ${this.stockCheckbox}
            </div>
            <slot name="quantity-select"></slot>
            ${this.secureLabelFooter}`}renderCatalog(){return x` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                        ${rs()&&this.actionMenu?"always-visible":""}
                        ${this.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                    ></div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
                    ${this.actionMenuContent?"":"hidden"}"
                    >${this.actionMenuContent}</slot
                >
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":x`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?x`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}`}renderImage(){return x`${this.cardImage}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?x`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:x`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
            </div>
            ${this.evergreen?x`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:x`
                      <hr />
                      ${this.secureLabelFooter}
                  `}`}renderInlineHeading(){return x` ${this.badge}
            <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot>
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="body-xs"></slot>
            </div>
            ${this.customHr?"":x`<hr />`} ${this.secureLabelFooter}`}renderProduct(){return x` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?x`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}`}renderMiniCompareChart(){let{badge:r}=this;return x` <div class="top-section${r?" badge":""}">
                <slot name="icons"></slot> ${r}
            </div>
            <slot name="heading-m"></slot>
            <slot name="body-m"></slot>
            <slot name="heading-m-price"></slot>
            <slot name="body-xxs"></slot>
            <slot name="price-commitment"></slot>
            <slot name="offers"></slot>
            <slot name="promo-text"></slot>
            <slot name="callout-content"></slot>
            ${this.miniCompareFooter}
            <slot name="footer-rows"><slot name="body-s"></slot></slot>`}renderTwp(){return x`${this.badge}
            <div class="top-section">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs-top"></slot>
            </div>
            <div class="body">
                <slot name="body-xs"></slot>
            </div>
            <footer><slot name="footer"></slot></footer>`}renderCcdAction(){return x` <div class="body">
            <slot name="icons"></slot> ${this.badge}
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            ${this.promoBottom?x`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:x`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
            <footer><slot name="footer"></slot></footer>
            <slot></slot>
        </div>`}connectedCallback(){super.connectedCallback(),ne(this,ge,this.getContainer()),this.setAttribute("tabindex",this.getAttribute("tabindex")??"0"),this.addEventListener("mouseleave",this.toggleActionMenu),this.addEventListener(Jn,this.handleQuantitySelection),this.addEventListener(is,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(Jn,this.handleQuantitySelection),this.storageOptions?.removeEventListener(Zn,this.handleStorageChange)}updateMiniCompareElementMinHeight(r,n){let o=`--consonant-merch-card-mini-compare-${n}-height`,i=Math.max(0,parseInt(window.getComputedStyle(r).height)||0),s=parseInt($(this,ge).style.getPropertyValue(o))||0;i>s&&$(this,ge).style.setProperty(o,`${i}px`)}async adjustTitleWidth(){if(!["segment","plans"].includes(this.variant))return;let r=this.getBoundingClientRect().width,n=this.badgeElement?.getBoundingClientRect().width||0;r===0||n===0||this.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(r-n-16)}px`)}async adjustMiniCompareBodySlots(){if(this.variant!==xr||this.getBoundingClientRect().width===0)return;this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","price-commitment","offers","promo-text","callout-content","secure-transaction-label"].forEach(o=>this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector("footer"),"footer");let n=this.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&$(this,ge).style.setProperty("--consonant-merch-card-mini-compare-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.variant!==xr||this.getBoundingClientRect().width===0)return;[...this.querySelector('[slot="footer-rows"]').children].forEach((n,o)=>{let i=Math.max(yc,parseInt(window.getComputedStyle(n).height)||0),s=parseInt($(this,ge).style.getPropertyValue(cs(o+1)))||0;i>s&&$(this,ge).style.setProperty(cs(o+1),`${i}px`)})}removeEmptyRows(){if(this.variant!==xr)return;this.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(ss,{bubbles:!0}))}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(Zn,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let o=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(o)}):n.replaceWith(o)}}};ge=new WeakMap,C(St,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},borderColor:{type:String,attribute:"border-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},customHr:{type:Boolean,attribute:"custom-hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[n,o,i]=r.split(",");return{PUF:n,ABM:o,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,i,s]=n.split(":"),a=Number(i);return[o,{order:isNaN(a)?void 0:a,size:s}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:i}])=>[n,o,i].filter(s=>s!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object}}),C(St,"styles",[Ki,...es()]);customElements.define(vc,St);var tt=class extends ce{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?x`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:x` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};C(tt,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),C(tt,"styles",De`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--img-width);
            height: var(--img-height);
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--img-width);
            height: var(--img-height);
        }
    `);customElements.define("merch-icon",tt);var At,vr=class{constructor(t){re(this,At);C(this,"sites",{cf:{fragments:{search:this.searchFragment.bind(this),getByPath:this.getFragmentByPath.bind(this),getById:this.getFragmentById.bind(this),save:this.saveFragment.bind(this),copy:this.copyFragmentClassic.bind(this),publish:this.publishFragment.bind(this),delete:this.deleteFragment.bind(this)}}});ne(this,At,/^author-/.test(t));let r=`https://${t}.adobeaemcloud.com`,n=`${r}/adobe/sites`;this.cfFragmentsUrl=`${n}/cf/fragments`,this.cfSearchUrl=`${this.cfFragmentsUrl}/search`,this.cfPublishUrl=`${this.cfFragmentsUrl}/publish`,this.wcmcommandUrl=`${r}/bin/wcmcommand`,this.csrfTokenUrl=`${r}/libs/granite/csrf/token.json`,this.headers={Authorization:`Bearer ${sessionStorage.getItem("masAccessToken")??window.adobeid?.authorize?.()}`,pragma:"no-cache","cache-control":"no-cache"}}async getCsrfToken(){let{token:t}=await fetch(this.csrfTokenUrl,{headers:this.headers}).then(r=>r.json());return t}async searchFragment({path:t,query:r,variant:n}){let o={};t&&(o.path=t),r&&(o.fullText={text:encodeURIComponent(r),queryMode:"EXACT_WORDS"});let i=new URLSearchParams({query:JSON.stringify({filter:o})}).toString();return fetch(`${this.cfSearchUrl}?${i}`,{headers:this.headers}).then(s=>s.json()).then(s=>s.items).then(s=>n?s.filter(a=>{let[c]=a.fields.find(h=>h.name==="variant")?.values;return c===n}):s)}async getFragmentByPath(t){let r=$(this,At)?this.headers:{};return fetch(`${this.cfFragmentsUrl}?path=${t}`,{headers:r}).then(n=>n.json()).then(({items:[n]})=>n)}async getFragment(t){let r=t.headers.get("Etag"),n=await t.json();return n.etag=r,n}async getFragmentById(t){return await fetch(`${this.cfFragmentsUrl}/${t}`,{headers:this.headers}).then(this.getFragment)}async saveFragment(t){let{title:r,fields:n}=t;return await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({title:r,fields:n})}).then(this.getFragment)}async copyFragmentClassic(t){let r=await this.getCsrfToken(),n=t.path.split("/").slice(0,-1).join("/"),o=new FormData;o.append("cmd","copyPage"),o.append("srcPath",t.path),o.append("destParentPath",n),o.append("shallow","false"),o.append("_charset_","UTF-8");let i=await fetch(this.wcmcommandUrl,{method:"POST",headers:{...this.headers,"csrf-token":r},body:o});if(i.ok){let s=await i.text(),l=new DOMParser().parseFromString(s,"text/html").getElementById("Message")?.textContent.trim();await ns();let d=await this.getFragmentByPath(l);return d&&(d=await this.getFragmentById(d.id)),d}throw new Error("Failed to copy fragment")}async publishFragment(t){await fetch(this.cfPublishUrl,{method:"POST",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({paths:[t.path],filterReferencesByStatus:["DRAFT","UNPUBLISHED"],workflowModelId:"/var/workflow/models/scheduled_activation_with_references"})})}async deleteFragment(t){await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"DELETE",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers}})}};At=new WeakMap;var Ec="aem-bucket",bc=["SP-BUTTON","A"],yr={CATALOG:"catalog",AH:"ah",CCD_ACTION:"ccd-action",SPECIAL_OFFERS:"special-offers"},_c={[yr.CATALOG]:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[yr.AH]:{title:{tag:"h3",slot:"heading-xxs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xxs"},ctas:{size:"s"}},[yr.CCD_ACTION]:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[yr.SPECIAL_OFFERS]:{name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}}};async function wc(e,t,r,n){let o=e.fields.reduce((a,{name:c,multiple:h,values:l})=>(a[c]=h?l:l[0],a),{id:e.id});o.model=o.model;let{variant:i="catalog"}=o;r.setAttribute("variant",i);let s=_c[i]??"catalog";if(o.icon?.forEach(a=>{let c=we("merch-icon",{slot:"icons",src:a,alt:"",href:"",size:"l"});t(c)}),o.title&&s.title&&t(we(s.title.tag,{slot:s.title.slot},o.title)),o.backgroundImage&&s.backgroundImage&&t(we(s.backgroundImage.tag,{slot:s.backgroundImage.slot},`<img loading="lazy" src="${o.backgroundImage}" width="600" height="362">`)),o.prices&&s.prices){let a=o.prices,c=we(s.prices.tag,{slot:s.prices.slot},a);t(c)}if(o.description&&s.description){let a=we(s.description.tag,{slot:s.description.slot},o.description);t(a)}if(o.ctas){let a=we("div",{slot:"footer"},o.ctas);[...a.querySelectorAll("a")].forEach(c=>{if(c.textContent.trim()===""){c.remove();return}if(n)c.classList.add("con-button"),c.parentElement.tagName==="STRONG"&&c.classList.add("blue"),a.appendChild(c);else{let h=we("sp-button",{},c);h.addEventListener("click",l=>{l.stopPropagation(),c.click()}),a.appendChild(h)}}),[...a.children].forEach(c=>{bc.includes(c.tagName)||a.removeChild(c)}),t(a)}}var Se,Kn=class{constructor(){re(this,Se,new Map)}clear(){$(this,Se).clear()}add(...t){t.forEach(r=>{let{path:n}=r;n&&$(this,Se).set(n,r)})}has(t){return $(this,Se).has(t)}get(t){return $(this,Se).get(t)}remove(t){$(this,Se).delete(t)}};Se=new WeakMap;var Qn=new Kn,Tt,Fe,eo=class extends HTMLElement{constructor(){super(...arguments);re(this,Tt);C(this,"cache",Qn);C(this,"refs",[]);C(this,"path");C(this,"consonant",!1);re(this,Fe)}static get observedAttributes(){return["source","path","consonant"]}attributeChangedCallback(r,n,o){this[r]=o}connectedCallback(){this.consonant=this.hasAttribute("consonant"),this.clearRefs();let r=this.getAttribute(Ec)??"publish-p22655-e59341";ne(this,Tt,new vr(r)),this.refresh(!1)}clearRefs(){this.refs.forEach(r=>{r.remove()})}async refresh(r=!0){this.path&&($(this,Fe)&&!await Promise.race([$(this,Fe),Promise.resolve(!1)])||(this.clearRefs(),this.refs=[],r&&this.cache.remove(this.path),ne(this,Fe,this.fetchData().then(()=>!0))))}async fetchData(){let r=Qn.get(this.path);if(r||(r=await $(this,Tt).sites.cf.fragments.getByPath(this.path),Qn.add(r)),r){wc(r,o=>{this.parentElement.appendChild(o),this.refs.push(o)},this.parentElement,this.consonant);return}}get updateComplete(){return $(this,Fe)??Promise.reject(new Error("datasource is not correctly configured"))}};Tt=new WeakMap,Fe=new WeakMap;customElements.define("merch-datasource",eo);var{searchParams:to}=new URL(import.meta.url),Sc=to.get("locale")??"US_en",Hm=to.get("lang")??"en",ls=to.get("env")==="stage",Ac=ls?"stage":"prod",Tc=ls?"STAGE":"PROD",Pc=fetch("https://www.adobe.com/federal/commerce/price-literals.json").then(e=>e.json().then(({data:t})=>t)),Cc=()=>({env:{name:Ac},commerce:{"commerce.env":Tc,priceLiteralsPromise:Pc},locale:{prefix:Sc}}),Oc=ft(Cc),Vm=Oc;export{Vm as default};
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
//# sourceMappingURL=mas.js.map
