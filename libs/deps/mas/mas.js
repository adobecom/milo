var Eo=Object.defineProperty;var bo=e=>{throw TypeError(e)};var ks=(e,t,r)=>t in e?Eo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var Ms=(e,t)=>{for(var r in t)Eo(e,r,{get:t[r],enumerable:!0})};var O=(e,t,r)=>ks(e,typeof t!="symbol"?t+"":t,r),_o=(e,t,r)=>t.has(e)||bo("Cannot "+r);var R=(e,t,r)=>(_o(e,t,"read from private field"),r?r.call(e):t.get(e)),Q=(e,t,r)=>t.has(e)?bo("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),K=(e,t,r,n)=>(_o(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r);var ct;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(ct||(ct={}));var kr;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(kr||(kr={}));var lt;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(lt||(lt={}));var Ae;(function(e){e.V2="UCv2",e.V3="UCv3"})(Ae||(Ae={}));var Y;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(Y||(Y={}));var Mr=function(e){var t;return(t=Us.get(e))!==null&&t!==void 0?t:e},Us=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var wo=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Ao=function(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),o,i=[],s;try{for(;(t===void 0||t-- >0)&&!(o=n.next()).done;)i.push(o.value)}catch(c){s={error:c}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(s)throw s.error}}return i};function Ve(e,t,r){var n,o;try{for(var i=wo(Object.entries(e)),s=i.next();!s.done;s=i.next()){var c=Ao(s.value,2),a=c[0],h=c[1],l=Mr(a);h!=null&&r.has(l)&&t.set(l,h)}}catch(d){n={error:d}}finally{try{s&&!s.done&&(o=i.return)&&o.call(i)}finally{if(n)throw n.error}}}function Dt(e){switch(e){case ct.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Ht(e,t){var r,n;for(var o in e){var i=e[o];try{for(var s=(r=void 0,wo(Object.entries(i))),c=s.next();!c.done;c=s.next()){var a=Ao(c.value,2),h=a[0],l=a[1];if(l!=null){var d=Mr(h);t.set("items["+o+"]["+d+"]",l)}}}catch(u){r={error:u}}finally{try{c&&!c.done&&(n=s.return)&&n.call(s)}finally{if(r)throw r.error}}}}var Ds=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r},Hs=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function So(e){Gs(e);var t=e.env,r=e.items,n=e.workflowStep,o=Ds(e,["env","items","workflowStep"]),i=new URL(Dt(t));return i.pathname=n+"/",Ht(r,i.searchParams),Ve(o,i.searchParams,Fs),i.toString()}var Fs=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),zs=["env","workflowStep","clientId","country","items"];function Gs(e){var t,r;try{for(var n=Hs(zs),o=n.next();!o.done;o=n.next()){var i=o.value;if(!e[i])throw new Error('Argument "checkoutData" is not valid, missing: '+i)}}catch(s){t={error:s}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}return!0}var Vs=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r},js=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Bs="p_draft_landscape",Ws="/store/";function Dr(e){Ys(e);var t=e.env,r=e.items,n=e.workflowStep,o=e.ms,i=e.marketSegment,s=e.ot,c=e.offerType,a=e.pa,h=e.productArrangementCode,l=e.landscape,d=Vs(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),u={marketSegment:i??o,offerType:c??s,productArrangementCode:h??a},m=new URL(Dt(t));return m.pathname=""+Ws+n,n!==Y.SEGMENTATION&&n!==Y.CHANGE_PLAN_TEAM_PLANS&&Ht(r,m.searchParams),n===Y.SEGMENTATION&&Ve(u,m.searchParams,Ur),Ve(d,m.searchParams,Ur),l===lt.DRAFT&&Ve({af:Bs},m.searchParams,Ur),m.toString()}var Ur=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),qs=["env","workflowStep","clientId","country"];function Ys(e){var t,r;try{for(var n=js(qs),o=n.next();!o.done;o=n.next()){var i=o.value;if(!e[i])throw new Error('Argument "checkoutData" is not valid, missing: '+i)}}catch(s){t={error:s}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}if(e.workflowStep!==Y.SEGMENTATION&&e.workflowStep!==Y.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function Hr(e,t){switch(e){case Ae.V2:return So(t);case Ae.V3:return Dr(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),Dr(t)}}var Fr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Fr||(Fr={}));var k;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(k||(k={}));var L;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(L||(L={}));var zr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(zr||(zr={}));var Gr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Gr||(Gr={}));var Vr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Vr||(Vr={}));var jr;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(jr||(jr={}));var To="tacocat.js";var Ft=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),Po=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function N(e,t={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let i;if(n&&i==null){let s=new URLSearchParams(window.location.search),c=je(n)?n:e;i=s.get(c)}if(o&&i==null){let s=je(o)?o:e;i=window.sessionStorage.getItem(s)??window.localStorage.getItem(s)}if(r&&i==null){let s=Xs(je(r)?r:e);i=document.documentElement.querySelector(`meta[name="${s}"]`)?.content}return i??t[e]}var Be=()=>{};var Co=e=>typeof e=="boolean",me=e=>typeof e=="function",zt=e=>typeof e=="number",$o=e=>e!=null&&typeof e=="object";var je=e=>typeof e=="string",Br=e=>je(e)&&e,We=e=>zt(e)&&Number.isFinite(e)&&e>0;function qe(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function w(e,t){if(Co(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function pe(e,t,r){let n=Object.values(t);return n.find(o=>Ft(o,e))??r??n[0]}function Xs(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function Ye(e,t=1){return zt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Zs=Date.now(),Wr=()=>`(+${Date.now()-Zs}ms)`,Gt=new Set,Js=w(N("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function Oo(e){let t=`[${To}/${e}]`,r=(s,c,...a)=>s?!0:(o(c,...a),!1),n=Js?(s,...c)=>{console.debug(`${t} ${s}`,...c,Wr())}:()=>{},o=(s,...c)=>{let a=`${t} ${s}`;Gt.forEach(([h])=>h(a,...c))};return{assert:r,debug:n,error:o,warn:(s,...c)=>{let a=`${t} ${s}`;Gt.forEach(([,h])=>h(a,...c))}}}function Qs(e,t){let r=[e,t];return Gt.add(r),()=>{Gt.delete(r)}}Qs((e,...t)=>{console.error(e,...t,Wr())},(e,...t)=>{console.warn(e,...t,Wr())});var Ks="no promo",Lo="promo-tag",ea="yellow",ta="neutral",ra=(e,t,r)=>{let n=i=>i||Ks,o=r?` (was "${n(t)}")`:"";return`${n(e)}${o}`},na="cancel-context",ht=(e,t)=>{let r=e===na,n=!r&&e?.length>0,o=(n||r)&&(t&&t!=e||!t&&!r),i=o&&n||!o&&!!t,s=i?e||t:void 0;return{effectivePromoCode:s,overridenPromoCode:e,className:i?Lo:`${Lo} no-promo`,text:ra(s,t,o),variant:i?ea:ta,isOverriden:o}};var qr="ABM",Yr="PUF",Xr="M2M",Zr="PERPETUAL",Jr="P3Y",oa="TAX_INCLUSIVE_DETAILS",ia="TAX_EXCLUSIVE",No={ABM:qr,PUF:Yr,M2M:Xr,PERPETUAL:Zr,P3Y:Jr},$l={[qr]:{commitment:k.YEAR,term:L.MONTHLY},[Yr]:{commitment:k.YEAR,term:L.ANNUAL},[Xr]:{commitment:k.MONTH,term:L.MONTHLY},[Zr]:{commitment:k.PERPETUAL,term:void 0},[Jr]:{commitment:k.THREE_MONTHS,term:L.P3Y}},Ro="Value is not an offer",Qr=e=>{if(typeof e!="object")return Ro;let{commitment:t,term:r}=e,n=sa(t,r);return{...e,planType:n}};var sa=(e,t)=>{switch(e){case void 0:return Ro;case"":return"";case k.YEAR:return t===L.MONTHLY?qr:t===L.ANNUAL?Yr:"";case k.MONTH:return t===L.MONTHLY?Xr:"";case k.PERPETUAL:return Zr;case k.TERM_LICENSE:return t===L.P3Y?Jr:"";default:return""}};function Kr(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:i,taxDisplay:s}=t;if(s!==oa)return e;let c={...e,priceDetails:{...t,price:o??r,priceWithoutDiscount:i??n,taxDisplay:ia}};return c.offerType==="TRIAL"&&c.priceDetails.price===0&&(c.priceDetails.price=c.priceDetails.priceWithoutDiscount),c}var en=function(e,t){return en=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},en(e,t)};function dt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");en(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var E=function(){return E=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},E.apply(this,arguments)};function Vt(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,i;n<o;n++)(i||!(n in t))&&(i||(i=Array.prototype.slice.call(t,0,n)),i[n]=t[n]);return e.concat(i||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var T;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(T||(T={}));var Se;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Se||(Se={}));function tn(e){return e.type===T.literal}function Io(e){return e.type===T.argument}function jt(e){return e.type===T.number}function Bt(e){return e.type===T.date}function Wt(e){return e.type===T.time}function qt(e){return e.type===T.select}function Yt(e){return e.type===T.plural}function ko(e){return e.type===T.pound}function Xt(e){return e.type===T.tag}function Zt(e){return!!(e&&typeof e=="object"&&e.type===Se.number)}function ut(e){return!!(e&&typeof e=="object"&&e.type===Se.dateTime)}var rn=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var aa=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Mo(e){var t={};return e.replace(aa,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Uo=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function zo(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Uo).filter(function(u){return u.length>0}),r=[],n=0,o=t;n<o.length;n++){var i=o[n],s=i.split("/");if(s.length===0)throw new Error("Invalid number skeleton");for(var c=s[0],a=s.slice(1),h=0,l=a;h<l.length;h++){var d=l[h];if(d.length===0)throw new Error("Invalid number skeleton")}r.push({stem:c,options:a})}return r}function ca(e){return e.replace(/^(.*?)-/,"")}var Do=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Go=/^(@+)?(\+|#+)?$/g,la=/(\*)(0+)|(#+)(0+)|(0+)/g,Vo=/^(0+)$/;function Ho(e){var t={};return e.replace(Go,function(r,n,o){return typeof o!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):o==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),t}function jo(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function ha(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!Vo.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Fo(e){var t={},r=jo(e);return r||t}function Bo(e){for(var t={},r=0,n=e;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=o.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=ca(o.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=E(E(E({},t),{notation:"scientific"}),o.options.reduce(function(c,a){return E(E({},c),Fo(a))},{}));continue;case"engineering":t=E(E(E({},t),{notation:"engineering"}),o.options.reduce(function(c,a){return E(E({},c),Fo(a))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace(la,function(c,a,h,l,d,u){if(a)t.minimumIntegerDigits=h.length;else{if(l&&d)throw new Error("We currently do not support maximum integer digits");if(u)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Vo.test(o.stem)){t.minimumIntegerDigits=o.stem.length;continue}if(Do.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(Do,function(c,a,h,l,d,u){return h==="*"?t.minimumFractionDigits=a.length:l&&l[0]==="#"?t.maximumFractionDigits=l.length:d&&u?(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length+u.length):(t.minimumFractionDigits=a.length,t.maximumFractionDigits=a.length),""}),o.options.length&&(t=E(E({},t),Ho(o.options[0])));continue}if(Go.test(o.stem)){t=E(E({},t),Ho(o.stem));continue}var i=jo(o.stem);i&&(t=E(E({},t),i));var s=ha(o.stem);s&&(t=E(E({},t),s))}return t}var nn,da=new RegExp("^"+rn.source+"*"),ua=new RegExp(rn.source+"*$");function y(e,t){return{start:e,end:t}}var ma=!!String.prototype.startsWith,pa=!!String.fromCodePoint,fa=!!Object.fromEntries,ga=!!String.prototype.codePointAt,xa=!!String.prototype.trimStart,va=!!String.prototype.trimEnd,ya=!!Number.isSafeInteger,Ea=ya?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},sn=!0;try{Wo=Zo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),sn=((nn=Wo.exec("a"))===null||nn===void 0?void 0:nn[0])==="a"}catch{sn=!1}var Wo,qo=ma?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},an=pa?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",o=t.length,i=0,s;o>i;){if(s=t[i++],s>1114111)throw RangeError(s+" is not a valid code point");n+=s<65536?String.fromCharCode(s):String.fromCharCode(((s-=65536)>>10)+55296,s%1024+56320)}return n},Yo=fa?Object.fromEntries:function(t){for(var r={},n=0,o=t;n<o.length;n++){var i=o[n],s=i[0],c=i[1];r[s]=c}return r},Xo=ga?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var o=t.charCodeAt(r),i;return o<55296||o>56319||r+1===n||(i=t.charCodeAt(r+1))<56320||i>57343?o:(o-55296<<10)+(i-56320)+65536}},ba=xa?function(t){return t.trimStart()}:function(t){return t.replace(da,"")},_a=va?function(t){return t.trimEnd()}:function(t){return t.replace(ua,"")};function Zo(e,t){return new RegExp(e,t)}var cn;sn?(on=Zo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),cn=function(t,r){var n;on.lastIndex=r;var o=on.exec(t);return(n=o[1])!==null&&n!==void 0?n:""}):cn=function(t,r){for(var n=[];;){var o=Xo(t,r);if(o===void 0||Qo(o)||Sa(o))break;n.push(o),r+=o>=65536?2:1}return an.apply(void 0,n)};var on,Jo=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var o=[];!this.isEOF();){var i=this.char();if(i===123){var s=this.parseArgument(t,n);if(s.err)return s;o.push(s.val)}else{if(i===125&&t>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var c=this.clonePosition();this.bump(),o.push({type:T.pound,location:y(c,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(v.UNMATCHED_CLOSING_TAG,y(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&ln(this.peek()||0)){var s=this.parseTag(t,r);if(s.err)return s;o.push(s.val)}else{var s=this.parseLiteral(t,r);if(s.err)return s;o.push(s.val)}}}return{val:o,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:T.literal,value:"<"+o+"/>",location:y(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(t+1,r,!0);if(i.err)return i;var s=i.val,c=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!ln(this.char()))return this.error(v.INVALID_TAG,y(c,this.clonePosition()));var a=this.clonePosition(),h=this.parseTagName();return o!==h?this.error(v.UNMATCHED_CLOSING_TAG,y(a,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:T.tag,value:o,children:s,location:y(n,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,y(c,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,y(n,this.clonePosition()))}else return this.error(v.INVALID_TAG,y(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Aa(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),o="";;){var i=this.tryParseQuote(r);if(i){o+=i;continue}var s=this.tryParseUnquoted(t,r);if(s){o+=s;continue}var c=this.tryParseLeftAngleBracket();if(c){o+=c;continue}break}var a=y(n,this.clonePosition());return{val:{type:T.literal,value:o,location:a},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!wa(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return an.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),an(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,y(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(v.MALFORMED_ARGUMENT,y(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:T.argument,value:o,location:y(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition())):this.parseArgumentOptions(t,r,o,n);default:return this.error(v.MALFORMED_ARGUMENT,y(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=cn(this.message,r),o=r+n.length;this.bumpTo(o);var i=this.clonePosition(),s=y(t,i);return{value:n,location:s}},e.prototype.parseArgumentOptions=function(t,r,n,o){var i,s=this.clonePosition(),c=this.parseIdentifierIfPossible().value,a=this.clonePosition();switch(c){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,y(s,a));case"number":case"date":case"time":{this.bumpSpace();var h=null;if(this.bumpIf(",")){this.bumpSpace();var l=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var u=_a(d.val);if(u.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,y(this.clonePosition(),this.clonePosition()));var m=y(l,this.clonePosition());h={style:u,styleLocation:m}}var f=this.tryParseArgumentClose(o);if(f.err)return f;var g=y(o,this.clonePosition());if(h&&qo(h?.style,"::",0)){var _=ba(h.style.slice(2));if(c==="number"){var d=this.parseNumberSkeletonFromString(_,h.styleLocation);return d.err?d:{val:{type:T.number,value:n,location:g,style:d.val},err:null}}else{if(_.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,g);var u={type:Se.dateTime,pattern:_,location:h.styleLocation,parsedOptions:this.shouldParseSkeletons?Mo(_):{}},P=c==="date"?T.date:T.time;return{val:{type:P,value:n,location:g,style:u},err:null}}}return{val:{type:c==="number"?T.number:c==="date"?T.date:T.time,value:n,location:g,style:(i=h?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var C=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,y(C,E({},C)));this.bumpSpace();var A=this.parseIdentifierIfPossible(),I=0;if(c!=="select"&&A.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),A=this.parseIdentifierIfPossible(),I=d.val}var S=this.tryParsePluralOrSelectOptions(t,c,r,A);if(S.err)return S;var f=this.tryParseArgumentClose(o);if(f.err)return f;var $=y(o,this.clonePosition());return c==="select"?{val:{type:T.select,value:n,options:Yo(S.val),location:$},err:null}:{val:{type:T.plural,value:n,options:Yo(S.val),offset:I,pluralType:c==="plural"?"cardinal":"ordinal",location:$},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,y(s,a))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,y(o,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=zo(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:Se.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?Bo(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,o){for(var i,s=!1,c=[],a=new Set,h=o.value,l=o.location;;){if(h.length===0){var d=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;l=y(d,this.clonePosition()),h=this.message.slice(d.offset,this.offset())}else break}if(a.has(h))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);h==="other"&&(s=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,y(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(t+1,r,n);if(f.err)return f;var g=this.tryParseArgumentClose(m);if(g.err)return g;c.push([h,{value:f.val,location:y(m,this.clonePosition())}]),a.add(h),this.bumpSpace(),i=this.parseIdentifierIfPossible(),h=i.value,l=i.location}return c.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,y(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!s?this.error(v.MISSING_OTHER_CLAUSE,y(this.clonePosition(),this.clonePosition())):{val:c,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var i=!1,s=0;!this.isEOF();){var c=this.char();if(c>=48&&c<=57)i=!0,s=s*10+(c-48),this.bump();else break}var a=y(o,this.clonePosition());return i?(s*=n,Ea(s)?{val:s,err:null}:this.error(r,a)):this.error(t,a)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Xo(this.message,t);if(r===void 0)throw Error("Offset "+t+" is at invalid UTF-16 code unit boundary");return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(qo(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset "+t+" must be greater than or equal to the current offset "+this.offset());for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset "+t+" is at invalid UTF-16 code unit boundary");if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Qo(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function ln(e){return e>=97&&e<=122||e>=65&&e<=90}function wa(e){return ln(e)||e===47}function Aa(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Qo(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Sa(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function hn(e){e.forEach(function(t){if(delete t.location,qt(t)||Yt(t))for(var r in t.options)delete t.options[r].location,hn(t.options[r].value);else jt(t)&&Zt(t.style)||(Bt(t)||Wt(t))&&ut(t.style)?delete t.style.location:Xt(t)&&hn(t.children)})}function Ko(e,t){t===void 0&&(t={}),t=E({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Jo(e,t).parse();if(r.err){var n=SyntaxError(v[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||hn(r.val),r.val}function mt(e,t){var r=t&&t.cache?t.cache:La,n=t&&t.serializer?t.serializer:Oa,o=t&&t.strategy?t.strategy:Pa;return o(e,{cache:r,serializer:n})}function Ta(e){return e==null||typeof e=="number"||typeof e=="boolean"}function ei(e,t,r,n){var o=Ta(n)?n:r(n),i=t.get(o);return typeof i>"u"&&(i=e.call(this,n),t.set(o,i)),i}function ti(e,t,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),i=t.get(o);return typeof i>"u"&&(i=e.apply(this,n),t.set(o,i)),i}function dn(e,t,r,n,o){return r.bind(t,e,n,o)}function Pa(e,t){var r=e.length===1?ei:ti;return dn(e,this,r,t.cache.create(),t.serializer)}function Ca(e,t){return dn(e,this,ti,t.cache.create(),t.serializer)}function $a(e,t){return dn(e,this,ei,t.cache.create(),t.serializer)}var Oa=function(){return JSON.stringify(arguments)};function un(){this.cache=Object.create(null)}un.prototype.get=function(e){return this.cache[e]};un.prototype.set=function(e,t){this.cache[e]=t};var La={create:function(){return new un}},Jt={variadic:Ca,monadic:$a};var Te;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Te||(Te={}));var pt=function(e){dt(t,e);function t(r,n,o){var i=e.call(this,r)||this;return i.code=n,i.originalMessage=o,i}return t.prototype.toString=function(){return"[formatjs Error: "+this.code+"] "+this.message},t}(Error);var mn=function(e){dt(t,e);function t(r,n,o,i){return e.call(this,'Invalid values for "'+r+'": "'+n+'". Options are "'+Object.keys(o).join('", "')+'"',Te.INVALID_VALUE,i)||this}return t}(pt);var ri=function(e){dt(t,e);function t(r,n,o){return e.call(this,'Value for "'+r+'" must be of type '+n,Te.INVALID_VALUE,o)||this}return t}(pt);var ni=function(e){dt(t,e);function t(r,n){return e.call(this,'The intl string context variable "'+r+'" was not provided to the string "'+n+'"',Te.MISSING_VALUE,n)||this}return t}(pt);var D;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(D||(D={}));function Na(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==D.literal||r.type!==D.literal?t.push(r):n.value+=r.value,t},[])}function Ra(e){return typeof e=="function"}function ft(e,t,r,n,o,i,s){if(e.length===1&&tn(e[0]))return[{type:D.literal,value:e[0].value}];for(var c=[],a=0,h=e;a<h.length;a++){var l=h[a];if(tn(l)){c.push({type:D.literal,value:l.value});continue}if(ko(l)){typeof i=="number"&&c.push({type:D.literal,value:r.getNumberFormat(t).format(i)});continue}var d=l.value;if(!(o&&d in o))throw new ni(d,s);var u=o[d];if(Io(l)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),c.push({type:typeof u=="string"?D.literal:D.object,value:u});continue}if(Bt(l)){var m=typeof l.style=="string"?n.date[l.style]:ut(l.style)?l.style.parsedOptions:void 0;c.push({type:D.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(Wt(l)){var m=typeof l.style=="string"?n.time[l.style]:ut(l.style)?l.style.parsedOptions:void 0;c.push({type:D.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(jt(l)){var m=typeof l.style=="string"?n.number[l.style]:Zt(l.style)?l.style.parsedOptions:void 0;m&&m.scale&&(u=u*(m.scale||1)),c.push({type:D.literal,value:r.getNumberFormat(t,m).format(u)});continue}if(Xt(l)){var f=l.children,g=l.value,_=o[g];if(!Ra(_))throw new ri(g,"function",s);var P=ft(f,t,r,n,o,i),C=_(P.map(function(S){return S.value}));Array.isArray(C)||(C=[C]),c.push.apply(c,C.map(function(S){return{type:typeof S=="string"?D.literal:D.object,value:S}}))}if(qt(l)){var A=l.options[u]||l.options.other;if(!A)throw new mn(l.value,u,Object.keys(l.options),s);c.push.apply(c,ft(A.value,t,r,n,o));continue}if(Yt(l)){var A=l.options["="+u];if(!A){if(!Intl.PluralRules)throw new pt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Te.MISSING_INTL_API,s);var I=r.getPluralRules(t,{type:l.pluralType}).select(u-(l.offset||0));A=l.options[I]||l.options.other}if(!A)throw new mn(l.value,u,Object.keys(l.options),s);c.push.apply(c,ft(A.value,t,r,n,o,u-(l.offset||0)));continue}}return Na(c)}function Ia(e,t){return t?E(E(E({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=E(E({},e[n]),t[n]||{}),r},{})):e}function ka(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=Ia(e[n],t[n]),r},E({},e)):e}function pn(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Ma(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:mt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,Vt([void 0],r)))},{cache:pn(e.number),strategy:Jt.variadic}),getDateTimeFormat:mt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,Vt([void 0],r)))},{cache:pn(e.dateTime),strategy:Jt.variadic}),getPluralRules:mt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,Vt([void 0],r)))},{cache:pn(e.pluralRules),strategy:Jt.variadic})}}var oi=function(){function e(t,r,n,o){var i=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(s){var c=i.formatToParts(s);if(c.length===1)return c[0].value;var a=c.reduce(function(h,l){return!h.length||l.type!==D.literal||typeof h[h.length-1]!="string"?h.push(l.value):h[h.length-1]+=l.value,h},[]);return a.length<=1?a[0]||"":a},this.formatToParts=function(s){return ft(i.ast,i.locales,i.formatters,i.formats,s,void 0,i.message)},this.resolvedOptions=function(){return{locale:Intl.NumberFormat.supportedLocalesOf(i.locales)[0]}},this.getAst=function(){return i.ast},typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:o?.ignoreTag})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=ka(e.formats,n),this.locales=r,this.formatters=o&&o.formatters||Ma(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.__parse=Ko,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var ii=oi;var Ua=/[0-9\-+#]/,Da=/[^\d\-+#]/g;function si(e){return e.search(Ua)}function Ha(e="#.##"){let t={},r=e.length,n=si(e);t.prefix=n>0?e.substring(0,n):"";let o=si(e.split("").reverse().join("")),i=r-o,s=e.substring(i,i+1),c=i+(s==="."||s===","?1:0);t.suffix=o>0?e.substring(c,r):"",t.mask=e.substring(n,c),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let a=t.mask.match(Da);return t.decimal=a&&a[a.length-1]||".",t.separator=a&&a[1]&&a[0]||",",a=t.mask.split(t.decimal),t.integer=a[0],t.fraction=a[1],t}function Fa(e,t,r){let n=!1,o={value:e};e<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(t.fraction&&t.fraction.length),o.value=Number(o.value).toString();let i=t.fraction&&t.fraction.lastIndexOf("0"),[s="0",c=""]=o.value.split(".");return(!c||c&&c.length<=i)&&(c=i<0?"":(+("0."+c)).toFixed(i+1).replace("0.","")),o.integer=s,o.fraction=c,za(o,t),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&t.maskHasPositiveSign?o.sign="+":n&&t.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),o}function za(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;e.integer.length<n.length-o;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let i=r[1]&&r[r.length-1].length;if(i){let s=e.integer.length,c=s%i;for(let a=0;a<s;a++)e.result+=e.integer.charAt(a),!((a-c+1)%i)&&a<s-i&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Ga(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Ha(e),o=Fa(t,n,r);return n.prefix+o.sign+o.result+n.suffix}var ai=Ga;var ci=".",Va=",",hi=/^\s+/,di=/\s+$/,li="&nbsp;",gt={MONTH:"MONTH",YEAR:"YEAR"},ja={[L.ANNUAL]:12,[L.MONTHLY]:1,[L.THREE_YEARS]:36,[L.TWO_YEARS]:24},Ba={CHF:e=>Math.round(e*20)/20},fn=(e,t)=>({accept:e,round:t}),Wa=[fn(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),fn(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.ceil(Math.floor(t*1e4/e)/100)/100),fn(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],gn={[k.YEAR]:{[L.MONTHLY]:gt.MONTH,[L.ANNUAL]:gt.YEAR},[k.MONTH]:{[L.MONTHLY]:gt.MONTH}},qa=(e,t)=>e.indexOf(`'${t}'`)===0,Ya=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=mi(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Za(e)),r},Xa=e=>{let t=Ja(e),r=qa(e,t),n=e.replace(/'.*?'/,""),o=hi.test(n)||di.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:o}},ui=e=>e.replace(hi,li).replace(di,li),Za=e=>e.match(/#(.?)#/)?.[1]===ci?Va:ci,Ja=e=>e.match(/'(.*?)'/)?.[1]??"",mi=e=>e.match(/0(.?)0/)?.[1]??"";function Qt({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},o,i=s=>s){let{currencySymbol:s,isCurrencyFirst:c,hasCurrencySpace:a}=Xa(e),h=r?mi(e):"",l=Ya(e,r),d=r?2:0,u=i(t,{currencySymbol:s}),m=n?u.toLocaleString("hi-IN",{minimumFractionDigits:d,maximumFractionDigits:d}):ai(l,u),f=r?m.lastIndexOf(h):m.length,g=m.substring(0,f),_=m.substring(f+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,s),currencySymbol:s,decimals:_,decimalsDelimiter:h,hasCurrencySpace:a,integer:g,isCurrencyFirst:c,recurrenceTerm:o}}var pi=e=>{let{commitment:t,term:r,usePrecision:n}=e,o=ja[r]??1;return Qt(e,o>1?gt.MONTH:gn[t]?.[r],(i,{currencySymbol:s})=>{let c={divisor:o,price:i,usePrecision:n},{round:a}=Wa.find(({accept:l})=>l(c));if(!a)throw new Error(`Missing rounding rule for: ${JSON.stringify(c)}`);return(Ba[s]??(l=>l))(a(c))})},fi=({commitment:e,term:t,...r})=>Qt(r,gn[e]?.[t]),gi=e=>{let{commitment:t,term:r}=e;return t===k.YEAR&&r===L.MONTHLY?Qt(e,gt.YEAR,n=>n*12):Qt(e,gn[t]?.[r])};var Qa={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},Ka=Oo("ConsonantTemplates/price"),ec=/<.+?>/g,W={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},Pe={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},tc="TAX_EXCLUSIVE",rc=e=>$o(e)?Object.entries(e).filter(([,t])=>je(t)||zt(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+Po(n)+'"'}`,""):"",ee=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+W.disabled}"${rc(r)}>${n?ui(t):t??""}</span>`;function nc(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:o,hasCurrencySpace:i,integer:s,isCurrencyFirst:c,recurrenceLabel:a,perUnitLabel:h,taxInclusivityLabel:l},d={}){let u=ee(W.currencySymbol,r),m=ee(W.currencySpace,i?"&nbsp;":""),f="";return c&&(f+=u+m),f+=ee(W.integer,s),f+=ee(W.decimalsDelimiter,o),f+=ee(W.decimals,n),c||(f+=m+u),f+=ee(W.recurrence,a,null,!0),f+=ee(W.unitType,h,null,!0),f+=ee(W.taxInclusivity,l,!0),ee(e,f,{...d,"aria-label":t})}var Ce=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1}={})=>({country:n,displayFormatted:o=!0,displayRecurrence:i=!0,displayPerUnit:s=!1,displayTax:c=!1,language:a,literals:h={}}={},{commitment:l,formatString:d,price:u,priceWithoutDiscount:m,taxDisplay:f,taxTerm:g,term:_,usePrecision:P}={},C={})=>{Object.entries({country:n,formatString:d,language:a,price:u}).forEach(([ae,Rr])=>{if(Rr==null)throw new Error(`Argument "${ae}" is missing`)});let A={...Qa,...h},I=`${a.toLowerCase()}-${n.toUpperCase()}`;function S(ae,Rr){let Ir=A[ae];if(Ir==null)return"";try{return new ii(Ir.replace(ec,""),I).format(Rr)}catch{return Ka.error("Failed to format literal:",Ir),""}}let $=t&&m?m:u,z=e?pi:fi;r&&(z=gi);let{accessiblePrice:X,recurrenceTerm:ie,...ue}=z({commitment:l,formatString:d,term:_,price:e?u:$,usePrecision:P,isIndianPrice:n==="IN"}),Z=X,_e="";if(w(i)&&ie){let ae=S(Pe.recurrenceAriaLabel,{recurrenceTerm:ie});ae&&(Z+=" "+ae),_e=S(Pe.recurrenceLabel,{recurrenceTerm:ie})}let we="";if(w(s)){we=S(Pe.perUnitLabel,{perUnit:"LICENSE"});let ae=S(Pe.perUnitAriaLabel,{perUnit:"LICENSE"});ae&&(Z+=" "+ae)}let se="";w(c)&&g&&(se=S(f===tc?Pe.taxExclusiveLabel:Pe.taxInclusiveLabel,{taxTerm:g}),se&&(Z+=" "+se)),t&&(Z=S(Pe.strikethroughAriaLabel,{strikethroughPrice:Z}));let J=W.container;if(e&&(J+=" "+W.containerOptical),t&&(J+=" "+W.containerStrikethrough),r&&(J+=" "+W.containerAnnual),w(o))return nc(J,{...ue,accessibleLabel:Z,recurrenceLabel:_e,perUnitLabel:we,taxInclusivityLabel:se},C);let{currencySymbol:ze,decimals:Mt,decimalsDelimiter:Ut,hasCurrencySpace:at,integer:Nr,isCurrencyFirst:Rs}=ue,Ge=[Nr,Ut,Mt];Rs?(Ge.unshift(at?"\xA0":""),Ge.unshift(ze)):(Ge.push(at?"\xA0":""),Ge.push(ze)),Ge.push(_e,we,se);let Is=Ge.join("");return ee(J,Is,C)},xi=()=>(e,t,r)=>{let o=(e.displayOldPrice===void 0||w(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${Ce()(e,t,r)}${o?"&nbsp;"+Ce({displayStrikethrough:!0})(e,t,r):""}`};var xn=Ce(),vn=xi(),yn=Ce({displayOptical:!0}),En=Ce({displayStrikethrough:!0}),bn=Ce({displayAnnual:!0});var oc=(e,t)=>{if(!(!We(e)||!We(t)))return Math.floor((t-e)/t*100)},vi=()=>(e,t,r)=>{let{price:n,priceWithoutDiscount:o}=t,i=oc(n,o);return i===void 0?'<span class="no-discount"></span>':`<span class="discount">${i}%</span>`};var _n=vi();var{freeze:xt}=Object,ce=xt({...Ae}),le=xt({...Y}),$e={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},yi=xt({...k}),Ei=xt({...No}),bi=xt({...L});var On={};Ms(On,{CLASS_NAME_FAILED:()=>Kt,CLASS_NAME_PENDING:()=>er,CLASS_NAME_RESOLVED:()=>tr,ERROR_MESSAGE_BAD_REQUEST:()=>rr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>An,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>wn,EVENT_TYPE_ERROR:()=>ic,EVENT_TYPE_FAILED:()=>nr,EVENT_TYPE_PENDING:()=>or,EVENT_TYPE_READY:()=>Xe,EVENT_TYPE_RESOLVED:()=>ir,LOG_NAMESPACE:()=>Sn,Landscape:()=>Ze,PARAM_AOS_API_KEY:()=>sc,PARAM_ENV:()=>Tn,PARAM_LANDSCAPE:()=>Pn,PARAM_WCS_API_KEY:()=>ac,STATE_FAILED:()=>te,STATE_PENDING:()=>re,STATE_RESOLVED:()=>ne,TAG_NAME_SERVICE:()=>fe,WCS_PROD_URL:()=>Cn,WCS_STAGE_URL:()=>$n});var Kt="placeholder-failed",er="placeholder-pending",tr="placeholder-resolved",rr="Bad WCS request",wn="Commerce offer not found",An="Literals URL not provided",ic="wcms:commerce:error",nr="wcms:placeholder:failed",or="wcms:placeholder:pending",Xe="wcms:commerce:ready",ir="wcms:placeholder:resolved",Sn="wcms/commerce",Tn="commerce.env",Pn="commerce.landscape",sc="commerce.aosKey",ac="commerce.wcsKey",Cn="https://www.adobe.com/web_commerce_artifact",$n="https://www.stage.adobe.com/web_commerce_artifact_stage",te="failed",re="pending",ne="resolved",fe="wcms-commerce",Ze={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var Ln={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:30,tags:"consumer=milo/commerce"},_i=new Set,cc=e=>e instanceof Error||typeof e.originatingRequest=="string";function wi(e){if(e==null)return;let t=typeof e;if(t==="function"){let{name:r}=e;return r?`${t} ${r}`:t}if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:o,status:i}=e;return[n,i,o].filter(s=>s).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Ln.serializableTypes.includes(r))return r}return e}function lc(e,t){if(!Ln.ignoredProperties.includes(e))return wi(t)}var Nn={append(e){let{delimiter:t,sampleRate:r,tags:n,clientId:o}=Ln,{message:i,params:s}=e,c=[],a=i,h=[];s.forEach(u=>{u!=null&&(cc(u)?c:h).push(u)}),c.length&&(a+=" ",a+=c.map(wi).join(" "));let{pathname:l,search:d}=window.location;a+=`${t}page=`,a+=l+d,h.length&&(a+=`${t}facts=`,a+=JSON.stringify(h,lc)),_i.has(a)||(_i.add(a),window.lana?.log(a,{sampleRate:r,tags:n,clientId:o}))}};var b=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:ce.V3,checkoutWorkflowStep:le.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:$e.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Ze.PUBLISHED,wcsBufferLimit:1});function Ai(e,{once:t=!1}={}){let r=null;function n(){let o=document.querySelector(fe);o!==r&&(r=o,o&&e(o))}return document.addEventListener(Xe,n,{once:t}),ge(n),()=>document.removeEventListener(Xe,n)}function vt(e,{country:t,forceTaxExclusive:r,perpetual:n}){let o;if(e.length<2)o=e;else{let i=t==="GB"||n?"EN":"MULT",[s,c]=e;o=[s.language===i?s:c]}return r&&(o=o.map(Kr)),o}var ge=e=>window.setTimeout(e);function Je(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(Ye).filter(We);return r.length||(r=[t]),r}function sr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(Br)}function G(){return window.customElements.get(fe)?.instance}var hc="en_US",p={ar:"AR_es",be_en:"BE_en",be_fr:"BE_fr",be_nl:"BE_nl",br:"BR_pt",ca:"CA_en",ch_de:"CH_de",ch_fr:"CH_fr",ch_it:"CH_it",cl:"CL_es",co:"CO_es",la:"DO_es",mx:"MX_es",pe:"PE_es",africa:"MU_en",dk:"DK_da",de:"DE_de",ee:"EE_et",eg_ar:"EG_ar",eg_en:"EG_en",es:"ES_es",fr:"FR_fr",gr_el:"GR_el",gr_en:"GR_en",ie:"IE_en",il_he:"IL_iw",it:"IT_it",lv:"LV_lv",lt:"LT_lt",lu_de:"LU_de",lu_en:"LU_en",lu_fr:"LU_fr",my_en:"MY_en",my_ms:"MY_ms",hu:"HU_hu",mt:"MT_en",mena_en:"DZ_en",mena_ar:"DZ_ar",nl:"NL_nl",no:"NO_nb",pl:"PL_pl",pt:"PT_pt",ro:"RO_ro",si:"SI_sl",sk:"SK_sk",fi:"FI_fi",se:"SE_sv",tr:"TR_tr",uk:"GB_en",at:"AT_de",cz:"CZ_cs",bg:"BG_bg",ru:"RU_ru",ua:"UA_uk",au:"AU_en",in_en:"IN_en",in_hi:"IN_hi",id_en:"ID_en",id_id:"ID_in",nz:"NZ_en",sa_ar:"SA_ar",sa_en:"SA_en",sg:"SG_en",cn:"CN_zh-Hans",tw:"TW_zh-Hant",hk_zh:"HK_zh-hant",jp:"JP_ja",kr:"KR_ko",za:"ZA_en",ng:"NG_en",cr:"CR_es",ec:"EC_es",pr:"US_es",gt:"GT_es",cis_en:"AZ_en",cis_ru:"AZ_ru",sea:"SG_en",th_en:"TH_en",th_th:"TH_th"},ar=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});function dc({locale:e={}}={}){if(!e.prefix)return{country:b.country,language:b.language,locale:hc};let t=e.prefix.replace("/","")??"",[r=b.country,n=b.language]=(p[t]??t).split("_",2);return r=r.toUpperCase(),n=n.toLowerCase(),{country:r,language:n,locale:`${n}_${r}`}}function Si(e={}){let{commerce:t={},locale:r=void 0}=e,n=$e.PRODUCTION,o=Cn,i=["local","stage"].includes(e.env?.name),s=N(Tn,t,{metadata:!1})?.toLowerCase()==="stage";i&&s&&(n=$e.STAGE,o=$n);let c=N("checkoutClientId",t)??b.checkoutClientId,a=pe(N("checkoutWorkflow",t),ce,b.checkoutWorkflow),h=le.CHECKOUT;a===ce.V3&&(h=pe(N("checkoutWorkflowStep",t),le,b.checkoutWorkflowStep));let l=w(N("displayOldPrice",t),b.displayOldPrice),d=w(N("displayPerUnit",t),b.displayPerUnit),u=w(N("displayRecurrence",t),b.displayRecurrence),m=w(N("displayTax",t),b.displayTax),f=w(N("entitlement",t),b.entitlement),g=w(N("modal",t),b.modal),_=w(N("forceTaxExclusive",t),b.forceTaxExclusive),P=N("promotionCode",t)??b.promotionCode,C=Je(N("quantity",t)),A=N("wcsApiKey",t)??b.wcsApiKey,I=e.env?.name===ar.PROD?Ze.PUBLISHED:pe(N(Pn,t),Ze,b.landscape),S=Ye(N("wcsBufferDelay",t),b.wcsBufferDelay),$=Ye(N("wcsBufferLimit",t),b.wcsBufferLimit);return{...dc({locale:r}),displayOldPrice:l,checkoutClientId:c,checkoutWorkflow:a,checkoutWorkflowStep:h,displayPerUnit:d,displayRecurrence:u,displayTax:m,entitlement:f,extraOptions:b.extraOptions,modal:g,env:n,forceTaxExclusive:_,priceLiteralsURL:t.priceLiteralsURL,priceLiteralsPromise:t.priceLiteralsPromise,promotionCode:P,quantity:C,wcsApiKey:A,wcsBufferDelay:S,wcsBufferLimit:$,wcsURL:o,landscape:I}}var Pi="debug",uc="error",mc="info",pc="warn",fc=Date.now(),Rn=new Set,In=new Set,Ti=new Map,yt=Object.freeze({DEBUG:Pi,ERROR:uc,INFO:mc,WARN:pc}),Ci={append({level:e,message:t,params:r,timestamp:n,source:o}){console[e](`${n}ms [${o}] %c${t}`,"font-weight: bold;",...r)}},$i={filter:({level:e})=>e!==Pi},gc={filter:()=>!1};function xc(e,t,r,n,o){return{level:e,message:t,namespace:r,get params(){if(n.length===1){let[i]=n;me(i)&&(n=i(),Array.isArray(n)||(n=[n]))}return n},source:o,timestamp:Date.now()-fc}}function vc(e){[...In].every(t=>t(e))&&Rn.forEach(t=>t(e))}function Oi(e){let t=(Ti.get(e)??0)+1;Ti.set(e,t);let r=`${e} #${t}`,n=i=>(s,...c)=>vc(xc(i,s,e,c,r)),o=Object.seal({id:r,namespace:e,module(i){return Oi(`${o.namespace}/${i}`)},debug:n(yt.DEBUG),error:n(yt.ERROR),info:n(yt.INFO),warn:n(yt.WARN)});return o}function cr(...e){e.forEach(t=>{let{append:r,filter:n}=t;me(n)?In.add(n):me(r)&&Rn.add(r)})}function yc(e={}){let{name:t}=e,r=w(N("commerce.debug",{search:!0,storage:!0}),t===ar.LOCAL);return cr(r?Ci:$i),t===ar.PROD&&cr(Nn),H}function Ec(){Rn.clear(),In.clear()}var H={...Oi(Sn),Level:yt,Plugins:{consoleAppender:Ci,debugFilter:$i,quietFilter:gc,lanaAppender:Nn},init:yc,reset:Ec,use:cr};var bc={CLASS_NAME_FAILED:Kt,CLASS_NAME_PENDING:er,CLASS_NAME_RESOLVED:tr,EVENT_TYPE_FAILED:nr,EVENT_TYPE_PENDING:or,EVENT_TYPE_RESOLVED:ir,STATE_FAILED:te,STATE_PENDING:re,STATE_RESOLVED:ne},_c={[te]:Kt,[re]:er,[ne]:tr},wc={[te]:nr,[re]:or,[ne]:ir},dr=new WeakMap;function V(e){if(!dr.has(e)){let t=H.module(e.constructor.is);dr.set(e,{changes:new Map,connected:!1,dispose:Be,error:void 0,log:t,options:void 0,promises:[],state:re,timer:null,value:void 0,version:0})}return dr.get(e)}function lr(e){let t=V(e),{error:r,promises:n,state:o}=t;(o===ne||o===te)&&(t.promises=[],o===ne?n.forEach(({resolve:i})=>i(e)):o===te&&n.forEach(({reject:i})=>i(r))),e.dispatchEvent(new CustomEvent(wc[o],{bubbles:!0}))}function hr(e){let t=dr.get(e);[te,re,ne].forEach(r=>{e.classList.toggle(_c[r],r===t.state)})}var Ac={get error(){return V(this).error},get log(){return V(this).log},get options(){return V(this).options},get state(){return V(this).state},get value(){return V(this).value},attributeChangedCallback(e,t,r){V(this).changes.set(e,r),this.requestUpdate()},connectedCallback(){V(this).dispose=Ai(()=>this.requestUpdate(!0))},disconnectedCallback(){let e=V(this);e.connected&&(e.connected=!1,e.log.debug("Disconnected:",{element:this})),e.dispose(),e.dispose=Be},onceSettled(){let{error:e,promises:t,state:r}=V(this);return ne===r?Promise.resolve(this):te===r?Promise.reject(e):new Promise((n,o)=>{t.push({resolve:n,reject:o})})},toggleResolved(e,t,r){let n=V(this);return e!==n.version?!1:(r!==void 0&&(n.options=r),n.state=ne,n.value=t,hr(this),this.log.debug("Resolved:",{element:this,value:t}),ge(()=>lr(this)),!0)},toggleFailed(e,t,r){let n=V(this);return e!==n.version?!1:(r!==void 0&&(n.options=r),n.error=t,n.state=te,hr(this),n.log.error("Failed:",{element:this,error:t}),ge(()=>lr(this)),!0)},togglePending(e){let t=V(this);return t.version++,e&&(t.options=e),t.state=re,hr(this),ge(()=>lr(this)),t.version},requestUpdate(e=!1){if(!this.isConnected||!G())return;let t=V(this);if(t.timer)return;let{error:r,options:n,state:o,value:i,version:s}=t;t.state=re,t.timer=ge(async()=>{t.timer=null;let c=null;if(t.changes.size&&(c=Object.fromEntries(t.changes.entries()),t.changes.clear()),t.connected?t.log.debug("Updated:",{element:this,changes:c}):(t.connected=!0,t.log.debug("Connected:",{element:this,changes:c})),c||e)try{await this.render?.()===!1&&t.state===re&&t.version===s&&(t.state=o,t.error=r,t.value=i,hr(this),lr(this))}catch(a){this.toggleFailed(t.version,a,n)}})}};function Li(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function ur(e,t={}){let{tag:r,is:n}=e,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,Li(t)),o}function mr(e){let{tag:t,is:r,prototype:n}=e,o=window.customElements.get(r);return o||(Object.defineProperties(n,Object.getOwnPropertyDescriptors(Ac)),o=Object.defineProperties(e,Object.getOwnPropertyDescriptors(bc)),window.customElements.define(r,o,{extends:t})),o}function pr(e,t=document.body){return Array.from(t?.querySelectorAll(`${e.tag}[is="${e.is}"]`)??[])}function fr(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Li(t)),e):null}var Sc="download",Tc="upgrade",Oe,Qe=class Qe extends HTMLAnchorElement{constructor(){super();Q(this,Oe);this.addEventListener("click",this.clickHandler)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}static createCheckoutLink(r={},n=""){let o=G();if(!o)return null;let{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:c,entitlement:a,upgrade:h,modal:l,perpetual:d,promotionCode:u,quantity:m,wcsOsi:f,extraOptions:g}=o.collectCheckoutOptions(r),_=ur(Qe,{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:c,entitlement:a,upgrade:h,modal:l,perpetual:d,promotionCode:u,quantity:m,wcsOsi:f,extraOptions:g});return n&&(_.innerHTML=`<span>${n}</span>`),_}static getCheckoutLinks(r){return pr(Qe,r)}get isCheckoutLink(){return!0}get placeholder(){return this}clickHandler(r){var n;(n=R(this,Oe))==null||n.call(this,r)}async render(r={}){if(!this.isConnected)return!1;let n=G();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(l=>{l&&(this.dataset.imsCountry=l)},Be);let o=n.collectCheckoutOptions(r,this.placeholder);if(!o.wcsOsi.length)return!1;let i;try{i=JSON.parse(o.extraOptions??"{}")}catch(l){this.placeholder.log.error("cannot parse exta checkout options",l)}let s=this.placeholder.togglePending(o);this.href="";let c=n.resolveOfferSelectors(o),a=await Promise.all(c);a=a.map(l=>vt(l,o));let h=await n.buildCheckoutAction(a.flat(),{...i,...o});return this.renderOffers(a.flat(),o,{},h,s)}renderOffers(r,n,o={},i=void 0,s=void 0){if(!this.isConnected)return!1;let c=G();if(!c)return!1;if(n={...JSON.parse(this.placeholder.dataset.extraOptions??"null"),...n,...o},s??(s=this.placeholder.togglePending(n)),R(this,Oe)&&K(this,Oe,void 0),i){this.classList.remove(Sc,Tc),this.placeholder.toggleResolved(s,r,n);let{url:h,text:l,className:d,handler:u}=i;return h&&(this.href=h),l&&(this.firstElementChild.innerHTML=l),d&&this.classList.add(...d.split(" ")),u&&(this.setAttribute("href","#"),K(this,Oe,u.bind(this))),!0}else if(r.length){if(this.placeholder.toggleResolved(s,r,n)){let h=c.buildCheckoutURL(r,n);return this.setAttribute("href",h),!0}}else{let h=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(s,h,n))return this.setAttribute("href","#"),!0}return!1}updateOptions(r={}){let n=G();if(!n)return!1;let{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:c,upgrade:a,modal:h,perpetual:l,promotionCode:d,quantity:u,wcsOsi:m}=n.collectCheckoutOptions(r);return fr(this,{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:c,upgrade:a,modal:h,perpetual:l,promotionCode:d,quantity:u,wcsOsi:m}),!0}};Oe=new WeakMap,O(Qe,"is","checkout-link"),O(Qe,"tag","a");var kn=Qe,Mn=mr(kn);var Ni=[p.uk,p.au,p.fr,p.at,p.be_en,p.be_fr,p.be_nl,p.bg,p.ch_de,p.ch_fr,p.ch_it,p.cz,p.de,p.dk,p.ee,p.eg_ar,p.eg_en,p.es,p.fi,p.fr,p.gr_el,p.gr_en,p.hu,p.ie,p.it,p.lu_de,p.lu_en,p.lu_fr,p.nl,p.no,p.pl,p.pt,p.ro,p.se,p.si,p.sk,p.tr,p.ua,p.id_en,p.id_id,p.in_en,p.in_hi,p.jp,p.my_en,p.my_ms,p.nz,p.th_en,p.th_th],Pc={INDIVIDUAL_COM:[p.za,p.lt,p.lv,p.ng,p.sa_ar,p.sa_en,p.za,p.sg,p.kr],TEAM_COM:[p.za,p.lt,p.lv,p.ng,p.za,p.co,p.kr],INDIVIDUAL_EDU:[p.lt,p.lv,p.sa_en,p.sea],TEAM_EDU:[p.sea,p.kr]},Ke=class Ke extends HTMLSpanElement{static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(t){let r=G();if(!r)return null;let{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:c,perpetual:a,promotionCode:h,quantity:l,template:d,wcsOsi:u}=r.collectPriceOptions(t);return ur(Ke,{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:c,perpetual:a,promotionCode:h,quantity:l,template:d,wcsOsi:u})}static getInlinePrices(t){return pr(Ke,t)}get isInlinePrice(){return!0}get placeholder(){return this}resolveDisplayTaxForGeoAndSegment(t,r,n,o){let i=`${t}_${r}`;if(Ni.includes(t)||Ni.includes(i))return!0;let s=Pc[`${n}_${o}`];return s?!!(s.includes(t)||s.includes(i)):!1}async resolveDisplayTax(t,r){let[n]=await t.resolveOfferSelectors(r),o=vt(await n,r);if(o?.length){let{country:i,language:s}=r,c=o[0],[a=""]=c.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(i,s,c.customerSegment,a)}}async render(t={}){if(!this.isConnected)return!1;let r=G();if(!r)return!1;let n=r.collectPriceOptions(t,this.placeholder);if(!n.wcsOsi.length)return!1;let o=this.placeholder.togglePending(n);this.innerHTML="";let[i]=r.resolveOfferSelectors(n);return this.renderOffers(vt(await i,n),n,o)}renderOffers(t,r={},n=void 0){if(!this.isConnected)return;let o=G();if(!o)return!1;let i=o.collectPriceOptions({...this.dataset,...r});if(n??(n=this.placeholder.togglePending(i)),t.length){if(this.placeholder.toggleResolved(n,t,i))return this.innerHTML=o.buildPriceHTML(t,i),!0}else{let s=new Error(`Not provided: ${i?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(n,s,i))return this.innerHTML="",!0}return!1}updateOptions(t){let r=G();if(!r)return!1;let{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:c,perpetual:a,promotionCode:h,quantity:l,template:d,wcsOsi:u}=r.collectPriceOptions(t);return fr(this,{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:c,perpetual:a,promotionCode:h,quantity:l,template:d,wcsOsi:u}),!0}};O(Ke,"is","inline-price"),O(Ke,"tag","span");var Un=Ke,Dn=mr(Un);function Ri({providers:e,settings:t},r){let n=H.module("checkout");function o(h,l){let{checkoutClientId:d,checkoutWorkflow:u,checkoutWorkflowStep:m,country:f,language:g,promotionCode:_,quantity:P}=t,{checkoutMarketSegment:C,checkoutWorkflow:A=u,checkoutWorkflowStep:I=m,imsCountry:S,country:$=S??f,language:z=g,quantity:X=P,entitlement:ie,upgrade:ue,modal:Z,perpetual:_e,promotionCode:we=_,wcsOsi:se,extraOptions:J,...ze}=Object.assign({},l?.dataset??{},h??{}),Mt=pe(A,ce,b.checkoutWorkflow),Ut=le.CHECKOUT;Mt===ce.V3&&(Ut=pe(I,le,b.checkoutWorkflowStep));let at=qe({...ze,extraOptions:J,checkoutClientId:d,checkoutMarketSegment:C,country:$,quantity:Je(X,b.quantity),checkoutWorkflow:Mt,checkoutWorkflowStep:Ut,language:z,entitlement:w(ie),upgrade:w(ue),modal:w(Z),perpetual:w(_e),promotionCode:ht(we).effectivePromoCode,wcsOsi:sr(se)});if(l)for(let Nr of e.checkout)Nr(l,at);return at}async function i(h,l){let d=G(),u=await r.getCheckoutAction?.(h,l,d.imsSignedInPromise);return u||null}function s(h,l){if(!Array.isArray(h)||!h.length||!l)return"";let{env:d,landscape:u}=t,{checkoutClientId:m,checkoutMarketSegment:f,checkoutWorkflow:g,checkoutWorkflowStep:_,country:P,promotionCode:C,quantity:A,...I}=o(l),S=window.frameElement?"if":"fp",$={checkoutPromoCode:C,clientId:m,context:S,country:P,env:d,items:[],marketSegment:f,workflowStep:_,landscape:u,...I};if(h.length===1){let[{offerId:z,offerType:X,productArrangementCode:ie}]=h,{marketSegments:[ue]}=h[0];Object.assign($,{marketSegment:ue,offerType:X,productArrangementCode:ie}),$.items.push(A[0]===1?{id:z}:{id:z,quantity:A[0]})}else $.items.push(...h.map(({offerId:z},X)=>({id:z,quantity:A[X]??b.quantity})));return Hr(g,$)}let{createCheckoutLink:c,getCheckoutLinks:a}=Mn;return{CheckoutLink:Mn,CheckoutWorkflow:ce,CheckoutWorkflowStep:le,buildCheckoutAction:i,buildCheckoutURL:s,collectCheckoutOptions:o,createCheckoutLink:c,getCheckoutLinks:a}}function Cc({interval:e=200,maxAttempts:t=25}={}){let r=H.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let o=0;function i(){window.adobeIMS?.initialized?n():++o>t?(r.debug("Timeout"),n()):setTimeout(i,e)}i()})}function $c(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function Oc(e){let t=H.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function Ii({}){let e=Cc(),t=$c(e),r=Oc(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}function Lc(e){if(!e.priceLiteralsURL)throw new Error(An);return new Promise(t=>{window.fetch(e.priceLiteralsURL).then(r=>{r.json().then(({data:n})=>{t(n)})})})}async function ki(e){let r=await(e.priceLiteralsPromise||Lc(e));if(Array.isArray(r)){let n=i=>r.find(s=>Ft(s.lang,i)),o=n(e.language)??n(b.language);if(o)return Object.freeze(o)}return{}}function Mi({literals:e,providers:t,settings:r}){function n(c,a){let{country:h,displayOldPrice:l,displayPerUnit:d,displayRecurrence:u,displayTax:m,forceTaxExclusive:f,language:g,promotionCode:_,quantity:P}=r,{displayOldPrice:C=l,displayPerUnit:A=d,displayRecurrence:I=u,displayTax:S=m,forceTaxExclusive:$=f,country:z=h,language:X=g,perpetual:ie,promotionCode:ue=_,quantity:Z=P,template:_e,wcsOsi:we,...se}=Object.assign({},a?.dataset??{},c??{}),J=qe({...se,country:z,displayOldPrice:w(C),displayPerUnit:w(A),displayRecurrence:w(I),displayTax:w(S),forceTaxExclusive:w($),language:X,perpetual:w(ie),promotionCode:ht(ue).effectivePromoCode,quantity:Je(Z,b.quantity),template:_e,wcsOsi:sr(we)});if(a)for(let ze of t.price)ze(a,J);return J}function o(c,a){if(!Array.isArray(c)||!c.length||!a)return"";let{template:h}=a,l;switch(h){case"discount":l=_n;break;case"strikethrough":l=En;break;case"optical":l=yn;break;case"annual":l=bn;break;default:l=a.promotionCode?vn:xn}let d=n(a);d.literals=Object.assign({},e.price,qe(a.literals??{}));let[u]=c;return u={...u,...u.priceDetails},l(d,u)}let{createInlinePrice:i,getInlinePrices:s}=Dn;return{InlinePrice:Dn,buildPriceHTML:o,collectPriceOptions:n,createInlinePrice:i,getInlinePrices:s}}function Ui({settings:e}){let t=H.module("wcs"),{env:r,wcsApiKey:n}=e,o=new Map,i=new Map,s;async function c(l,d,u=!0){let m=wn;t.debug("Fetching:",l);try{l.offerSelectorIds=l.offerSelectorIds.sort();let f=new URL(e.wcsURL);f.searchParams.set("offer_selector_ids",l.offerSelectorIds.join(",")),f.searchParams.set("country",l.country),f.searchParams.set("locale",l.locale),f.searchParams.set("landscape",r===$e.STAGE?"ALL":e.landscape),f.searchParams.set("api_key",n),l.language&&f.searchParams.set("language",l.language),l.promotionCode&&f.searchParams.set("promotion_code",l.promotionCode),l.currency&&f.searchParams.set("currency",l.currency);let g=await fetch(f.toString(),{credentials:"omit"});if(g.ok){let _=await g.json();t.debug("Fetched:",l,_);let P=_.resolvedOffers??[];P=P.map(Qr),d.forEach(({resolve:C},A)=>{let I=P.filter(({offerSelectorIds:S})=>S.includes(A)).flat();I.length&&(d.delete(A),C(I))})}else g.status===404&&l.offerSelectorIds.length>1?(t.debug("Multi-osi 404, fallback to fetch-by-one strategy"),await Promise.allSettled(l.offerSelectorIds.map(_=>c({...l,offerSelectorIds:[_]},d,!1)))):(m=rr,t.error(m,l))}catch(f){m=rr,t.error(m,l,f)}u&&d.size&&(t.debug("Missing:",{offerSelectorIds:[...d.keys()]}),d.forEach(f=>{f.reject(new Error(m))}))}function a(){clearTimeout(s);let l=[...i.values()];i.clear(),l.forEach(({options:d,promises:u})=>c(d,u))}function h({country:l,language:d,perpetual:u=!1,promotionCode:m="",wcsOsi:f=[]}){let g=`${d}_${l}`;l!=="GB"&&(d=u?"EN":"MULT");let _=[l,d,m].filter(P=>P).join("-").toLowerCase();return f.map(P=>{let C=`${P}-${_}`;if(!o.has(C)){let A=new Promise((I,S)=>{let $=i.get(_);if(!$){let z={country:l,locale:g,offerSelectorIds:[]};l!=="GB"&&(z.language=d),$={options:z,promises:new Map},i.set(_,$)}m&&($.options.promotionCode=m),$.options.offerSelectorIds.push(P),$.promises.set(P,{resolve:I,reject:S}),$.options.offerSelectorIds.length>=e.wcsBufferLimit?a():(t.debug("Queued:",$.options),s||(s=setTimeout(a,e.wcsBufferDelay)))});o.set(C,A)}return o.get(C)})}return{WcsCommitment:yi,WcsPlanType:Ei,WcsTerm:bi,resolveOfferSelectors:h}}var j=class extends HTMLElement{get isWcmsCommerce(){return!0}};O(j,"instance"),O(j,"promise",null);window.customElements.define(fe,j);async function Nc(e,t){let r=H.init(e.env).module("service");r.debug("Activating:",e);let n={price:{}},o=Object.freeze(Si(e));try{n.price=await ki(o)}catch(a){r.warn("Price literals were not fetched:",a)}let i={checkout:new Set,price:new Set},s=document.createElement(fe),c={literals:n,providers:i,settings:o};return j.instance=Object.defineProperties(s,Object.getOwnPropertyDescriptors({...Ri(c,t),...Ii(c),...Mi(c),...Ui(c),...On,Log:H,get defaults(){return b},get literals(){return n},get log(){return H},get providers(){return{checkout(a){return i.checkout.add(a),()=>i.checkout.delete(a)},price(a){return i.price.add(a),()=>i.price.delete(a)}}},get settings(){return o}})),r.debug("Activated:",{literals:n,settings:o,element:s}),document.head.append(s),ge(()=>{let a=new CustomEvent(Xe,{bubbles:!0,cancelable:!1,detail:j.instance});j.instance.dispatchEvent(a)}),j.instance}function Di(){document.head.querySelector(fe)?.remove(),j.promise=null,H.reset()}function Et(e,t){let r=me(e)?e():null,n=me(t)?t():{};return r&&(n.force&&Di(),Nc(r,n).then(o=>{Et.resolve(o)})),j.promise??(j.promise=new Promise(o=>{Et.resolve=o})),j.promise}var gr=window,vr=gr.ShadowRoot&&(gr.ShadyCSS===void 0||gr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Fi=Symbol(),Hi=new WeakMap,xr=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==Fi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(vr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=Hi.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Hi.set(r,t))}return t}toString(){return this.cssText}},zi=e=>new xr(typeof e=="string"?e:e+"",void 0,Fi);var Hn=(e,t)=>{vr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=gr.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},yr=vr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return zi(r)})(e):e;var Fn,Er=window,Gi=Er.trustedTypes,Rc=Gi?Gi.emptyScript:"",Vi=Er.reactiveElementPolyfillSupport,Gn={toAttribute(e,t){switch(t){case Boolean:e=e?Rc:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},ji=(e,t)=>t!==e&&(t==t||e==e),zn={attribute:!0,type:String,converter:Gn,reflect:!1,hasChanged:ji},Vn="finalized",Le=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=zn){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||zn}static finalize(){if(this.hasOwnProperty(Vn))return!1;this[Vn]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(yr(o))}else t!==void 0&&r.push(yr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Hn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=zn){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:Gn).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),c=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:Gn;this._$El=i,this[i]=c.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||ji)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Le[Vn]=!0,Le.elementProperties=new Map,Le.elementStyles=[],Le.shadowRootOptions={mode:"open"},Vi?.({ReactiveElement:Le}),((Fn=Er.reactiveElementVersions)!==null&&Fn!==void 0?Fn:Er.reactiveElementVersions=[]).push("1.6.3");var jn,br=window,et=br.trustedTypes,Bi=et?et.createPolicy("lit-html",{createHTML:e=>e}):void 0,Wn="$lit$",xe=`lit$${(Math.random()+"").slice(9)}$`,Qi="?"+xe,Ic=`<${Qi}>`,Ie=document,_r=()=>Ie.createComment(""),_t=e=>e===null||typeof e!="object"&&typeof e!="function",Ki=Array.isArray,kc=e=>Ki(e)||typeof e?.[Symbol.iterator]=="function",Bn=`[ 	
\f\r]`,bt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Wi=/-->/g,qi=/>/g,Ne=RegExp(`>|${Bn}(?:([^\\s"'>=/]+)(${Bn}*=${Bn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Yi=/'/g,Xi=/"/g,es=/^(?:script|style|textarea|title)$/i,ts=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),ru=ts(1),nu=ts(2),wt=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),Zi=new WeakMap,Re=Ie.createTreeWalker(Ie,129,null,!1);function rs(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Bi!==void 0?Bi.createHTML(t):t}var Mc=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=bt;for(let c=0;c<r;c++){let a=e[c],h,l,d=-1,u=0;for(;u<a.length&&(s.lastIndex=u,l=s.exec(a),l!==null);)u=s.lastIndex,s===bt?l[1]==="!--"?s=Wi:l[1]!==void 0?s=qi:l[2]!==void 0?(es.test(l[2])&&(o=RegExp("</"+l[2],"g")),s=Ne):l[3]!==void 0&&(s=Ne):s===Ne?l[0]===">"?(s=o??bt,d=-1):l[1]===void 0?d=-2:(d=s.lastIndex-l[2].length,h=l[1],s=l[3]===void 0?Ne:l[3]==='"'?Xi:Yi):s===Xi||s===Yi?s=Ne:s===Wi||s===qi?s=bt:(s=Ne,o=void 0);let m=s===Ne&&e[c+1].startsWith("/>")?" ":"";i+=s===bt?a+Ic:d>=0?(n.push(h),a.slice(0,d)+Wn+a.slice(d)+xe+m):a+xe+(d===-2?(n.push(void 0),c):m)}return[rs(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},At=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,c=t.length-1,a=this.parts,[h,l]=Mc(t,r);if(this.el=e.createElement(h,n),Re.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(o=Re.nextNode())!==null&&a.length<c;){if(o.nodeType===1){if(o.hasAttributes()){let d=[];for(let u of o.getAttributeNames())if(u.endsWith(Wn)||u.startsWith(xe)){let m=l[s++];if(d.push(u),m!==void 0){let f=o.getAttribute(m.toLowerCase()+Wn).split(xe),g=/([.?@])?(.*)/.exec(m);a.push({type:1,index:i,name:g[2],strings:f,ctor:g[1]==="."?Yn:g[1]==="?"?Xn:g[1]==="@"?Zn:rt})}else a.push({type:6,index:i})}for(let u of d)o.removeAttribute(u)}if(es.test(o.tagName)){let d=o.textContent.split(xe),u=d.length-1;if(u>0){o.textContent=et?et.emptyScript:"";for(let m=0;m<u;m++)o.append(d[m],_r()),Re.nextNode(),a.push({type:2,index:++i});o.append(d[u],_r())}}}else if(o.nodeType===8)if(o.data===Qi)a.push({type:2,index:i});else{let d=-1;for(;(d=o.data.indexOf(xe,d+1))!==-1;)a.push({type:7,index:i}),d+=xe.length-1}i++}}static createElement(t,r){let n=Ie.createElement("template");return n.innerHTML=t,n}};function tt(e,t,r=e,n){var o,i,s,c;if(t===wt)return t;let a=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,h=_t(t)?void 0:t._$litDirective$;return a?.constructor!==h&&((i=a?._$AO)===null||i===void 0||i.call(a,!1),h===void 0?a=void 0:(a=new h(e),a._$AT(e,r,n)),n!==void 0?((s=(c=r)._$Co)!==null&&s!==void 0?s:c._$Co=[])[n]=a:r._$Cl=a),a!==void 0&&(t=tt(e,a._$AS(e,t.values),a,n)),t}var qn=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:Ie).importNode(n,!0);Re.currentNode=i;let s=Re.nextNode(),c=0,a=0,h=o[0];for(;h!==void 0;){if(c===h.index){let l;h.type===2?l=new wr(s,s.nextSibling,this,t):h.type===1?l=new h.ctor(s,h.name,h.strings,this,t):h.type===6&&(l=new Jn(s,this,t)),this._$AV.push(l),h=o[++a]}c!==h?.index&&(s=Re.nextNode(),c++)}return Re.currentNode=Ie,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},wr=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=tt(this,t,r),_t(t)?t===M||t==null||t===""?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==wt&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):kc(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==M&&_t(this._$AH)?this._$AA.nextSibling.data=t:this.$(Ie.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=At.createElement(rs(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new qn(i,this),c=s.u(this.options);s.v(n),this.$(c),this._$AH=s}}_$AC(t){let r=Zi.get(t.strings);return r===void 0&&Zi.set(t.strings,r=new At(t)),r}T(t){Ki(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(_r()),this.k(_r()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},rt=class{constructor(t,r,n,o,i){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=M}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=tt(this,t,r,0),s=!_t(t)||t!==this._$AH&&t!==wt,s&&(this._$AH=t);else{let c=t,a,h;for(t=i[0],a=0;a<i.length-1;a++)h=tt(this,c[n+a],r,a),h===wt&&(h=this._$AH[a]),s||(s=!_t(h)||h!==this._$AH[a]),h===M?t=M:t!==M&&(t+=(h??"")+i[a+1]),this._$AH[a]=h}s&&!o&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Yn=class extends rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}},Uc=et?et.emptyScript:"",Xn=class extends rt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==M?this.element.setAttribute(this.name,Uc):this.element.removeAttribute(this.name)}},Zn=class extends rt{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=tt(this,t,r,0))!==null&&n!==void 0?n:M)===wt)return;let o=this._$AH,i=t===M&&o!==M||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==M&&(o===M||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},Jn=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}};var Ji=br.litHtmlPolyfillSupport;Ji?.(At,wr),((jn=br.litHtmlVersions)!==null&&jn!==void 0?jn:br.litHtmlVersions=[]).push("2.8.0");var Ar=window,Sr=Ar.ShadowRoot&&(Ar.ShadyCSS===void 0||Ar.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Qn=Symbol(),ns=new WeakMap,St=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==Qn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(Sr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=ns.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&ns.set(r,t))}return t}toString(){return this.cssText}},ve=e=>new St(typeof e=="string"?e:e+"",void 0,Qn),ke=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((n,o,i)=>n+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new St(r,e,Qn)},Kn=(e,t)=>{Sr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=Ar.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},Tr=Sr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return ve(r)})(e):e;var eo,Pr=window,os=Pr.trustedTypes,Dc=os?os.emptyScript:"",is=Pr.reactiveElementPolyfillSupport,ro={toAttribute(e,t){switch(t){case Boolean:e=e?Dc:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},ss=(e,t)=>t!==e&&(t==t||e==e),to={attribute:!0,type:String,converter:ro,reflect:!1,hasChanged:ss},no="finalized",he=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=to){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||to}static finalize(){if(this.hasOwnProperty(no))return!1;this[no]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(Tr(o))}else t!==void 0&&r.push(Tr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Kn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=to){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:ro).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),c=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:ro;this._$El=i,this[i]=c.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||ss)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};he[no]=!0,he.elementProperties=new Map,he.elementStyles=[],he.shadowRootOptions={mode:"open"},is?.({ReactiveElement:he}),((eo=Pr.reactiveElementVersions)!==null&&eo!==void 0?eo:Pr.reactiveElementVersions=[]).push("1.6.3");var oo,Cr=window,nt=Cr.trustedTypes,as=nt?nt.createPolicy("lit-html",{createHTML:e=>e}):void 0,so="$lit$",ye=`lit$${(Math.random()+"").slice(9)}$`,ps="?"+ye,Hc=`<${ps}>`,De=document,Pt=()=>De.createComment(""),Ct=e=>e===null||typeof e!="object"&&typeof e!="function",fs=Array.isArray,Fc=e=>fs(e)||typeof e?.[Symbol.iterator]=="function",io=`[ 	
\f\r]`,Tt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,cs=/-->/g,ls=/>/g,Me=RegExp(`>|${io}(?:([^\\s"'>=/]+)(${io}*=${io}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),hs=/'/g,ds=/"/g,gs=/^(?:script|style|textarea|title)$/i,xs=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),x=xs(1),lu=xs(2),He=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),us=new WeakMap,Ue=De.createTreeWalker(De,129,null,!1);function vs(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return as!==void 0?as.createHTML(t):t}var zc=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=Tt;for(let c=0;c<r;c++){let a=e[c],h,l,d=-1,u=0;for(;u<a.length&&(s.lastIndex=u,l=s.exec(a),l!==null);)u=s.lastIndex,s===Tt?l[1]==="!--"?s=cs:l[1]!==void 0?s=ls:l[2]!==void 0?(gs.test(l[2])&&(o=RegExp("</"+l[2],"g")),s=Me):l[3]!==void 0&&(s=Me):s===Me?l[0]===">"?(s=o??Tt,d=-1):l[1]===void 0?d=-2:(d=s.lastIndex-l[2].length,h=l[1],s=l[3]===void 0?Me:l[3]==='"'?ds:hs):s===ds||s===hs?s=Me:s===cs||s===ls?s=Tt:(s=Me,o=void 0);let m=s===Me&&e[c+1].startsWith("/>")?" ":"";i+=s===Tt?a+Hc:d>=0?(n.push(h),a.slice(0,d)+so+a.slice(d)+ye+m):a+ye+(d===-2?(n.push(void 0),c):m)}return[vs(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},$t=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,c=t.length-1,a=this.parts,[h,l]=zc(t,r);if(this.el=e.createElement(h,n),Ue.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(o=Ue.nextNode())!==null&&a.length<c;){if(o.nodeType===1){if(o.hasAttributes()){let d=[];for(let u of o.getAttributeNames())if(u.endsWith(so)||u.startsWith(ye)){let m=l[s++];if(d.push(u),m!==void 0){let f=o.getAttribute(m.toLowerCase()+so).split(ye),g=/([.?@])?(.*)/.exec(m);a.push({type:1,index:i,name:g[2],strings:f,ctor:g[1]==="."?co:g[1]==="?"?lo:g[1]==="@"?ho:it})}else a.push({type:6,index:i})}for(let u of d)o.removeAttribute(u)}if(gs.test(o.tagName)){let d=o.textContent.split(ye),u=d.length-1;if(u>0){o.textContent=nt?nt.emptyScript:"";for(let m=0;m<u;m++)o.append(d[m],Pt()),Ue.nextNode(),a.push({type:2,index:++i});o.append(d[u],Pt())}}}else if(o.nodeType===8)if(o.data===ps)a.push({type:2,index:i});else{let d=-1;for(;(d=o.data.indexOf(ye,d+1))!==-1;)a.push({type:7,index:i}),d+=ye.length-1}i++}}static createElement(t,r){let n=De.createElement("template");return n.innerHTML=t,n}};function ot(e,t,r=e,n){var o,i,s,c;if(t===He)return t;let a=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,h=Ct(t)?void 0:t._$litDirective$;return a?.constructor!==h&&((i=a?._$AO)===null||i===void 0||i.call(a,!1),h===void 0?a=void 0:(a=new h(e),a._$AT(e,r,n)),n!==void 0?((s=(c=r)._$Co)!==null&&s!==void 0?s:c._$Co=[])[n]=a:r._$Cl=a),a!==void 0&&(t=ot(e,a._$AS(e,t.values),a,n)),t}var ao=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:De).importNode(n,!0);Ue.currentNode=i;let s=Ue.nextNode(),c=0,a=0,h=o[0];for(;h!==void 0;){if(c===h.index){let l;h.type===2?l=new Ot(s,s.nextSibling,this,t):h.type===1?l=new h.ctor(s,h.name,h.strings,this,t):h.type===6&&(l=new uo(s,this,t)),this._$AV.push(l),h=o[++a]}c!==h?.index&&(s=Ue.nextNode(),c++)}return Ue.currentNode=De,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Ot=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=ot(this,t,r),Ct(t)?t===U||t==null||t===""?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==He&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Fc(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==U&&Ct(this._$AH)?this._$AA.nextSibling.data=t:this.$(De.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=$t.createElement(vs(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new ao(i,this),c=s.u(this.options);s.v(n),this.$(c),this._$AH=s}}_$AC(t){let r=us.get(t.strings);return r===void 0&&us.set(t.strings,r=new $t(t)),r}T(t){fs(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(Pt()),this.k(Pt()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},it=class{constructor(t,r,n,o,i){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=U}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=ot(this,t,r,0),s=!Ct(t)||t!==this._$AH&&t!==He,s&&(this._$AH=t);else{let c=t,a,h;for(t=i[0],a=0;a<i.length-1;a++)h=ot(this,c[n+a],r,a),h===He&&(h=this._$AH[a]),s||(s=!Ct(h)||h!==this._$AH[a]),h===U?t=U:t!==U&&(t+=(h??"")+i[a+1]),this._$AH[a]=h}s&&!o&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},co=class extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}},Gc=nt?nt.emptyScript:"",lo=class extends it{constructor(){super(...arguments),this.type=4}j(t){t&&t!==U?this.element.setAttribute(this.name,Gc):this.element.removeAttribute(this.name)}},ho=class extends it{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=ot(this,t,r,0))!==null&&n!==void 0?n:U)===He)return;let o=this._$AH,i=t===U&&o!==U||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==U&&(o===U||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},uo=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){ot(this,t)}};var ms=Cr.litHtmlPolyfillSupport;ms?.($t,Ot),((oo=Cr.litHtmlVersions)!==null&&oo!==void 0?oo:Cr.litHtmlVersions=[]).push("2.8.0");var ys=(e,t,r)=>{var n,o;let i=(n=r?.renderBefore)!==null&&n!==void 0?n:t,s=i._$litPart$;if(s===void 0){let c=(o=r?.renderBefore)!==null&&o!==void 0?o:null;i._$litPart$=s=new Ot(t.insertBefore(Pt(),c),c,void 0,r??{})}return s._$AI(e),s};var mo,po;var oe=class extends he{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=ys(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return He}};oe.finalized=!0,oe._$litElement$=!0,(mo=globalThis.litElementHydrateSupport)===null||mo===void 0||mo.call(globalThis,{LitElement:oe});var Es=globalThis.litElementPolyfillSupport;Es?.({LitElement:oe});((po=globalThis.litElementVersions)!==null&&po!==void 0?po:globalThis.litElementVersions=[]).push("3.3.3");var Lt="(max-width: 767px)",Nt="(max-width: 1199px)",B="(min-width: 768px)",F="(min-width: 1200px)",q="(min-width: 1600px)";var bs=ke`
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

    @media screen and ${ve(Nt)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${ve(F)} {
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
`,_s=()=>{let e=[ke`
        /* Tablet */
        @media screen and ${ve(B)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                grid-column: span 3;
                width: 100%;
                max-width: var(--consonant-merch-card-tablet-wide-width);
                margin: 0 auto;
            }
        }

        /* Laptop */
        @media screen and ${ve(F)} {
            :host([size='super-wide']) {
                grid-column: span 3;
            }
        `];return e.push(ke`
        /* Large desktop */
        @media screen and ${ve(q)} {
            :host([size='super-wide']) {
                grid-column: span 4;
            }
        }
    `),e};function Ee(e,t={},r){let n=document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[o,i]of Object.entries(t))n.setAttribute(o,i);return n}function ws(){return window.matchMedia("(max-width: 767px)").matches}function As(){return window.matchMedia("(max-width: 1024px)").matches}function Ss(e=1e3){return new Promise(t=>setTimeout(t,e))}var Ts=document.createElement("style");Ts.innerHTML=`
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
@media screen and ${Lt} {
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
@media screen and ${Nt} {
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
@media screen and ${Lt} {
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
@media screen and ${F} {
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
@media screen and ${F} {
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
    }
}

/* Large desktop */
    @media screen and ${q} {
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
@media screen and ${F} {
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

/* Large desktop */
    @media screen and ${q} {
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
@media screen and ${F} {
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

@media screen and ${q} {
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
@media screen and ${F} {
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
    }
}

/* Large desktop */
    @media screen and ${q} {
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
@media screen and ${F} {
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
@media screen and ${F} {
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
    }
}

/* Large desktop */
    @media screen and ${q} {
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
@media screen and ${F} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Large desktop */
    @media screen and ${q} {
        .one-merch-card.twp
        .two-merch-cards.twp {
            grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
        }
        .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Mobile */
@media screen and ${Lt} {
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
@media screen and ${F} {
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
    }
}

/* Large desktop */
    @media screen and ${q} {
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
@media screen and ${F} {
    .three-merch-cards.ccd-action,
    .four-merch-cards.ccd-action {
        grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-action-width));
    }
}

/* Large desktop */
    @media screen and ${q} {
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

@media screen and ${Lt} {
    .two-merch-cards.mini-compare-chart,
    .three-merch-cards.mini-compare-chart,
    .four-merch-cards.mini-compare-chart {
        grid-template-columns: var(--consonant-merch-card-mini-compare-chart-width);
        gap: var(--consonant-merch-spacing-xs);
    }
}

@media screen and ${Nt} {
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
@media screen and ${F} {
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

@media screen and ${q} {
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
`;document.head.appendChild(Ts);var Ps="merch-offer-select:ready",Cs="merch-card:ready",$s="merch-card:action-menu-toggle";var fo="merch-storage:change",go="merch-quantity-selector:change";var Vc="merch-card",jc=32,$r="mini-compare-chart",Os=e=>`--consonant-merch-card-footer-row-${e}-min-height`,de,Rt=class extends oe{constructor(){super();O(this,"customerSegment");O(this,"marketSegment");Q(this,de);this.filters={},this.types="",this.selected=!1}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&(this.style.border=this.computedBorderStyle),this.updateComplete.then(async()=>{let o=Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]')).filter(i=>!i.closest('[slot="callout-content"]'));await Promise.all(o.map(i=>i.onceSettled())),this.adjustTitleWidth(),ws()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())})}get computedBorderStyle(){return this.variant!=="twp"?`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`:""}get evergreen(){return this.classList.contains("intro-pricing")}get stockCheckbox(){return this.checkboxLabel?x`<label id="stock-checkbox">
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
        `}get badgeElement(){return this.shadowRoot.getElementById("badge")}getContainer(){return this.closest('[class*="-merch-cards"]')??this.parentElement}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let i=o.value?.[0]?.planType;if(!i)return;let s=this.stockOfferOsis[i];if(!s)return;let c=o.dataset.wcsOsi.split(",").filter(a=>a!==s);r.checked&&c.push(s),o.dataset.wcsOsi=c.join(",")}}toggleActionMenu(r){let n=r?.type==="mouseleave"?!0:void 0,o=this.shadowRoot.querySelector('slot[name="action-menu-content"]');o&&(n||this.dispatchEvent(new CustomEvent($s,{bubbles:!0,composed:!0,detail:{card:this.name,type:"action-menu"}})),o.classList.toggle("hidden",n))}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.variant==="special-offers"?this.querySelector('[slot="detail-m"]'):this.querySelector('[slot="heading-xs"]')}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let i=n[o].order;i===1||isNaN(i)||(n[o].order=Number(i)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}render(){if(!(!this.isConnected||this.style.display==="none"))switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"image":return this.renderImage();case"product":return this.renderProduct();case"inline-heading":return this.renderInlineHeading();case $r:return this.renderMiniCompareChart();case"ccd-action":return this.renderCcdAction();case"twp":return this.renderTwp();default:return this.renderProduct()}}renderSpecialOffer(){return x`${this.cardImage}
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
                        ${As()&&this.actionMenu?"always-visible":""}
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
        </div>`}connectedCallback(){super.connectedCallback(),K(this,de,this.getContainer()),this.setAttribute("tabindex",this.getAttribute("tabindex")??"0"),this.addEventListener("mouseleave",this.toggleActionMenu),this.addEventListener(go,this.handleQuantitySelection),this.addEventListener(Ps,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(go,this.handleQuantitySelection),this.storageOptions?.removeEventListener(fo,this.handleStorageChange)}updateMiniCompareElementMinHeight(r,n){let o=`--consonant-merch-card-mini-compare-${n}-height`,i=Math.max(0,parseInt(window.getComputedStyle(r).height)||0),s=parseInt(R(this,de).style.getPropertyValue(o))||0;i>s&&R(this,de).style.setProperty(o,`${i}px`)}async adjustTitleWidth(){if(!["segment","plans"].includes(this.variant))return;let r=this.getBoundingClientRect().width,n=this.badgeElement?.getBoundingClientRect().width||0;r===0||n===0||this.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(r-n-16)}px`)}async adjustMiniCompareBodySlots(){if(this.variant!==$r||this.getBoundingClientRect().width===0)return;this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","price-commitment","offers","promo-text","callout-content","secure-transaction-label"].forEach(o=>this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector("footer"),"footer");let n=this.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&R(this,de).style.setProperty("--consonant-merch-card-mini-compare-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.variant!==$r||this.getBoundingClientRect().width===0)return;[...this.querySelector('[slot="footer-rows"]').children].forEach((n,o)=>{let i=Math.max(jc,parseInt(window.getComputedStyle(n).height)||0),s=parseInt(R(this,de).style.getPropertyValue(Os(o+1)))||0;i>s&&R(this,de).style.setProperty(Os(o+1),`${i}px`)})}removeEmptyRows(){if(this.variant!==$r)return;this.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(Cs,{bubbles:!0}))}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(fo,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let o=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(o)}):n.replaceWith(o)}}};de=new WeakMap,O(Rt,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},borderColor:{type:String,attribute:"border-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},customHr:{type:Boolean,attribute:"custom-hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[n,o,i]=r.split(",");return{PUF:n,ABM:o,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,i,s]=n.split(":"),c=Number(i);return[o,{order:isNaN(c)?void 0:c,size:s}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:i}])=>[n,o,i].filter(s=>s!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object}}),O(Rt,"styles",[bs,..._s()]);customElements.define(Vc,Rt);var st=class extends oe{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?x`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:x` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};O(st,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),O(st,"styles",ke`
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
    `);customElements.define("merch-icon",st);var It,Or=class{constructor(t){Q(this,It);O(this,"sites",{cf:{fragments:{search:this.searchFragment.bind(this),getByPath:this.getFragmentByPath.bind(this),getById:this.getFragmentById.bind(this),save:this.saveFragment.bind(this),copy:this.copyFragmentClassic.bind(this),publish:this.publishFragment.bind(this),delete:this.deleteFragment.bind(this)}}});K(this,It,/^author-/.test(t));let r=`https://${t}.adobeaemcloud.com`,n=`${r}/adobe/sites`;this.cfFragmentsUrl=`${n}/cf/fragments`,this.cfSearchUrl=`${this.cfFragmentsUrl}/search`,this.cfPublishUrl=`${this.cfFragmentsUrl}/publish`,this.wcmcommandUrl=`${r}/bin/wcmcommand`,this.csrfTokenUrl=`${r}/libs/granite/csrf/token.json`,this.headers={Authorization:`Bearer ${sessionStorage.getItem("masAccessToken")??window.adobeid?.authorize?.()}`,pragma:"no-cache","cache-control":"no-cache"}}async getCsrfToken(){let{token:t}=await fetch(this.csrfTokenUrl,{headers:this.headers}).then(r=>r.json());return t}async searchFragment({path:t,query:r,variant:n}){let o={};t&&(o.path=t),r&&(o.fullText={text:encodeURIComponent(r),queryMode:"EXACT_WORDS"});let i=new URLSearchParams({query:JSON.stringify({filter:o})}).toString();return fetch(`${this.cfSearchUrl}?${i}`,{headers:this.headers}).then(s=>s.json()).then(s=>s.items).then(s=>n?s.filter(c=>{let[a]=c.fields.find(h=>h.name==="variant")?.values;return a===n}):s)}async getFragmentByPath(t){let r=R(this,It)?this.headers:{};return fetch(`${this.cfFragmentsUrl}?path=${t}`,{headers:r}).then(n=>n.json()).then(({items:[n]})=>n)}async getFragment(t){let r=t.headers.get("Etag"),n=await t.json();return n.etag=r,n}async getFragmentById(t){return await fetch(`${this.cfFragmentsUrl}/${t}`,{headers:this.headers}).then(this.getFragment)}async saveFragment(t){let{title:r,fields:n}=t;return await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({title:r,fields:n})}).then(this.getFragment)}async copyFragmentClassic(t){let r=await this.getCsrfToken(),n=t.path.split("/").slice(0,-1).join("/"),o=new FormData;o.append("cmd","copyPage"),o.append("srcPath",t.path),o.append("destParentPath",n),o.append("shallow","false"),o.append("_charset_","UTF-8");let i=await fetch(this.wcmcommandUrl,{method:"POST",headers:{...this.headers,"csrf-token":r},body:o});if(i.ok){let s=await i.text(),l=new DOMParser().parseFromString(s,"text/html").getElementById("Message")?.textContent.trim();await Ss();let d=await this.getFragmentByPath(l);return d&&(d=await this.getFragmentById(d.id)),d}throw new Error("Failed to copy fragment")}async publishFragment(t){await fetch(this.cfPublishUrl,{method:"POST",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({paths:[t.path],filterReferencesByStatus:["DRAFT","UNPUBLISHED"],workflowModelId:"/var/workflow/models/scheduled_activation_with_references"})})}async deleteFragment(t){await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"DELETE",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers}})}};It=new WeakMap;var Bc="aem-bucket",Lr={CATALOG:"catalog",AH:"ah",CCD_ACTION:"ccd-action",SPECIAL_OFFERS:"special-offers"},Wc={[Lr.CATALOG]:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[Lr.AH]:{title:{tag:"h3",slot:"heading-xxs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xxs"},ctas:{size:"s"}},[Lr.CCD_ACTION]:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[Lr.SPECIAL_OFFERS]:{name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}}};async function qc(e,t,r,n){let o=e.fields.reduce((c,{name:a,multiple:h,values:l})=>(c[a]=h?l:l[0],c),{id:e.id});o.model=o.model;let{variant:i="catalog"}=o;r.setAttribute("variant",i);let s=Wc[i]??"catalog";if(o.icon?.forEach(c=>{let a=Ee("merch-icon",{slot:"icons",src:c,alt:"",href:"",size:"l"});t(a)}),o.title&&s.title&&t(Ee(s.title.tag,{slot:s.title.slot},o.title)),o.backgroundImage&&s.backgroundImage&&t(Ee(s.backgroundImage.tag,{slot:s.backgroundImage.slot},`<img loading="lazy" src="${o.backgroundImage}" width="600" height="362">`)),o.prices&&s.prices){let c=o.prices,a=Ee(s.prices.tag,{slot:s.prices.slot},c);t(a)}if(o.description&&s.description){let c=Ee(s.description.tag,{slot:s.description.slot},o.description);t(c)}if(o.ctas){let c=Ee("div",{slot:"footer"},o.ctas),a=[];[...c.querySelectorAll("a")].forEach(h=>{let l=h.parentElement.tagName==="STRONG";if(n)h.classList.add("con-button"),l&&h.classList.add("blue"),a.push(h);else{let m=Ee("sp-button",{treatment:l?"fill":"outline",variant:l?"accent":"primary"},h);m.addEventListener("click",f=>{f.stopPropagation(),h.click()}),a.push(m)}}),c.innerHTML="",c.append(...a),t(c)}}var be,vo=class{constructor(){Q(this,be,new Map)}clear(){R(this,be).clear()}add(...t){t.forEach(r=>{let{path:n}=r;n&&R(this,be).set(n,r)})}has(t){return R(this,be).has(t)}get(t){return R(this,be).get(t)}remove(t){R(this,be).delete(t)}};be=new WeakMap;var xo=new vo,kt,Fe,yo=class extends HTMLElement{constructor(){super(...arguments);Q(this,kt);O(this,"cache",xo);O(this,"refs",[]);O(this,"path");O(this,"consonant",!1);Q(this,Fe)}static get observedAttributes(){return["source","path","consonant"]}attributeChangedCallback(r,n,o){this[r]=o}connectedCallback(){this.consonant=this.hasAttribute("consonant"),this.clearRefs();let r=this.getAttribute(Bc)??"publish-p22655-e59341";K(this,kt,new Or(r)),this.refresh(!1)}clearRefs(){this.refs.forEach(r=>{r.remove()})}async refresh(r=!0){this.path&&(R(this,Fe)&&!await Promise.race([R(this,Fe),Promise.resolve(!1)])||(this.clearRefs(),this.refs=[],r&&this.cache.remove(this.path),K(this,Fe,this.fetchData().then(()=>!0))))}async fetchData(){let r=xo.get(this.path);if(r||(r=await R(this,kt).sites.cf.fragments.getByPath(this.path),xo.add(r)),r){qc(r,o=>{this.parentElement.appendChild(o),this.refs.push(o)},this.parentElement,this.consonant);return}}get updateComplete(){return R(this,Fe)??Promise.reject(new Error("datasource is not correctly configured"))}};kt=new WeakMap,Fe=new WeakMap;customElements.define("merch-datasource",yo);var{searchParams:Ls}=new URL(import.meta.url),Yc=Ls.get("locale")??"US_en",Ns=Ls.get("env")==="stage",Xc=Ns?"stage":"prod",Zc=Ns?"STAGE":"PROD",Jc=fetch("https://www.adobe.com/federal/commerce/price-literals.json").then(e=>e.json().then(({data:t})=>t)),Qc=()=>({env:{name:Xc},commerce:{"commerce.env":Zc,priceLiteralsPromise:Jc},locale:{prefix:Yc}}),Kc=Et(Qc),Ju=Kc;export{Ju as default};
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
