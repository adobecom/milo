var bo=Object.defineProperty;var _o=e=>{throw TypeError(e)};var Ms=(e,t,r)=>t in e?bo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var Us=(e,t)=>{for(var r in t)bo(e,r,{get:t[r],enumerable:!0})};var O=(e,t,r)=>Ms(e,typeof t!="symbol"?t+"":t,r),wo=(e,t,r)=>t.has(e)||_o("Cannot "+r);var R=(e,t,r)=>(wo(e,t,"read from private field"),r?r.call(e):t.get(e)),K=(e,t,r)=>t.has(e)?_o("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),ee=(e,t,r,n)=>(wo(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r);var lt;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(lt||(lt={}));var Mr;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(Mr||(Mr={}));var ht;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(ht||(ht={}));var Se;(function(e){e.V2="UCv2",e.V3="UCv3"})(Se||(Se={}));var X;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(X||(X={}));var Ur=function(e){var t;return(t=Ds.get(e))!==null&&t!==void 0?t:e},Ds=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var Ao=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},So=function(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),o,i=[],s;try{for(;(t===void 0||t-- >0)&&!(o=n.next()).done;)i.push(o.value)}catch(c){s={error:c}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(s)throw s.error}}return i};function je(e,t,r){var n,o;try{for(var i=Ao(Object.entries(e)),s=i.next();!s.done;s=i.next()){var c=So(s.value,2),a=c[0],h=c[1],l=Ur(a);h!=null&&r.has(l)&&t.set(l,h)}}catch(d){n={error:d}}finally{try{s&&!s.done&&(o=i.return)&&o.call(i)}finally{if(n)throw n.error}}}function Ft(e){switch(e){case lt.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Ht(e,t){var r,n;for(var o in e){var i=e[o];try{for(var s=(r=void 0,Ao(Object.entries(i))),c=s.next();!c.done;c=s.next()){var a=So(c.value,2),h=a[0],l=a[1];if(l!=null){var d=Ur(h);t.set("items["+o+"]["+d+"]",l)}}}catch(u){r={error:u}}finally{try{c&&!c.done&&(n=s.return)&&n.call(s)}finally{if(r)throw r.error}}}}var Fs=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r},Hs=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function To(e){Vs(e);var t=e.env,r=e.items,n=e.workflowStep,o=Fs(e,["env","items","workflowStep"]),i=new URL(Ft(t));return i.pathname=n+"/",Ht(r,i.searchParams),je(o,i.searchParams,zs),i.toString()}var zs=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),Gs=["env","workflowStep","clientId","country","items"];function Vs(e){var t,r;try{for(var n=Hs(Gs),o=n.next();!o.done;o=n.next()){var i=o.value;if(!e[i])throw new Error('Argument "checkoutData" is not valid, missing: '+i)}}catch(s){t={error:s}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}return!0}var js=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r},Bs=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Ws="p_draft_landscape",qs="/store/";function Fr(e){Xs(e);var t=e.env,r=e.items,n=e.workflowStep,o=e.ms,i=e.marketSegment,s=e.ot,c=e.offerType,a=e.pa,h=e.productArrangementCode,l=e.landscape,d=js(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),u={marketSegment:i??o,offerType:c??s,productArrangementCode:h??a},m=new URL(Ft(t));return m.pathname=""+qs+n,n!==X.SEGMENTATION&&n!==X.CHANGE_PLAN_TEAM_PLANS&&Ht(r,m.searchParams),n===X.SEGMENTATION&&je(u,m.searchParams,Dr),je(d,m.searchParams,Dr),l===ht.DRAFT&&je({af:Ws},m.searchParams,Dr),m.toString()}var Dr=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),Ys=["env","workflowStep","clientId","country"];function Xs(e){var t,r;try{for(var n=Bs(Ys),o=n.next();!o.done;o=n.next()){var i=o.value;if(!e[i])throw new Error('Argument "checkoutData" is not valid, missing: '+i)}}catch(s){t={error:s}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}if(e.workflowStep!==X.SEGMENTATION&&e.workflowStep!==X.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function Hr(e,t){switch(e){case Se.V2:return To(t);case Se.V3:return Fr(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),Fr(t)}}var zr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(zr||(zr={}));var k;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(k||(k={}));var L;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(L||(L={}));var Gr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Gr||(Gr={}));var Vr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Vr||(Vr={}));var jr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(jr||(jr={}));var Br;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Br||(Br={}));var Po="tacocat.js";var zt=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),Co=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function N(e,t={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let i;if(n&&i==null){let s=new URLSearchParams(window.location.search),c=Be(n)?n:e;i=s.get(c)}if(o&&i==null){let s=Be(o)?o:e;i=window.sessionStorage.getItem(s)??window.localStorage.getItem(s)}if(r&&i==null){let s=Zs(Be(r)?r:e);i=document.documentElement.querySelector(`meta[name="${s}"]`)?.content}return i??t[e]}var We=()=>{};var $o=e=>typeof e=="boolean",pe=e=>typeof e=="function",Gt=e=>typeof e=="number",Oo=e=>e!=null&&typeof e=="object";var Be=e=>typeof e=="string",Wr=e=>Be(e)&&e,qe=e=>Gt(e)&&Number.isFinite(e)&&e>0;function Ye(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function w(e,t){if($o(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function fe(e,t,r){let n=Object.values(t);return n.find(o=>zt(o,e))??r??n[0]}function Zs(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function Xe(e,t=1){return Gt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Js=Date.now(),qr=()=>`(+${Date.now()-Js}ms)`,Vt=new Set,Qs=w(N("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function Lo(e){let t=`[${Po}/${e}]`,r=(s,c,...a)=>s?!0:(o(c,...a),!1),n=Qs?(s,...c)=>{console.debug(`${t} ${s}`,...c,qr())}:()=>{},o=(s,...c)=>{let a=`${t} ${s}`;Vt.forEach(([h])=>h(a,...c))};return{assert:r,debug:n,error:o,warn:(s,...c)=>{let a=`${t} ${s}`;Vt.forEach(([,h])=>h(a,...c))}}}function Ks(e,t){let r=[e,t];return Vt.add(r),()=>{Vt.delete(r)}}Ks((e,...t)=>{console.error(e,...t,qr())},(e,...t)=>{console.warn(e,...t,qr())});var ea="no promo",No="promo-tag",ta="yellow",ra="neutral",na=(e,t,r)=>{let n=i=>i||ea,o=r?` (was "${n(t)}")`:"";return`${n(e)}${o}`},oa="cancel-context",dt=(e,t)=>{let r=e===oa,n=!r&&e?.length>0,o=(n||r)&&(t&&t!=e||!t&&!r),i=o&&n||!o&&!!t,s=i?e||t:void 0;return{effectivePromoCode:s,overridenPromoCode:e,className:i?No:`${No} no-promo`,text:na(s,t,o),variant:i?ta:ra,isOverriden:o}};var Yr="ABM",Xr="PUF",Zr="M2M",Jr="PERPETUAL",Qr="P3Y",ia="TAX_INCLUSIVE_DETAILS",sa="TAX_EXCLUSIVE",Ro={ABM:Yr,PUF:Xr,M2M:Zr,PERPETUAL:Jr,P3Y:Qr},Ol={[Yr]:{commitment:k.YEAR,term:L.MONTHLY},[Xr]:{commitment:k.YEAR,term:L.ANNUAL},[Zr]:{commitment:k.MONTH,term:L.MONTHLY},[Jr]:{commitment:k.PERPETUAL,term:void 0},[Qr]:{commitment:k.THREE_MONTHS,term:L.P3Y}},Io="Value is not an offer",Kr=e=>{if(typeof e!="object")return Io;let{commitment:t,term:r}=e,n=aa(t,r);return{...e,planType:n}};var aa=(e,t)=>{switch(e){case void 0:return Io;case"":return"";case k.YEAR:return t===L.MONTHLY?Yr:t===L.ANNUAL?Xr:"";case k.MONTH:return t===L.MONTHLY?Zr:"";case k.PERPETUAL:return Jr;case k.TERM_LICENSE:return t===L.P3Y?Qr:"";default:return""}};function en(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:i,taxDisplay:s}=t;if(s!==ia)return e;let c={...e,priceDetails:{...t,price:o??r,priceWithoutDiscount:i??n,taxDisplay:sa}};return c.offerType==="TRIAL"&&c.priceDetails.price===0&&(c.priceDetails.price=c.priceDetails.priceWithoutDiscount),c}var tn=function(e,t){return tn=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},tn(e,t)};function ut(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");tn(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var E=function(){return E=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},E.apply(this,arguments)};function jt(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,i;n<o;n++)(i||!(n in t))&&(i||(i=Array.prototype.slice.call(t,0,n)),i[n]=t[n]);return e.concat(i||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var T;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(T||(T={}));var Te;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Te||(Te={}));function rn(e){return e.type===T.literal}function ko(e){return e.type===T.argument}function Bt(e){return e.type===T.number}function Wt(e){return e.type===T.date}function qt(e){return e.type===T.time}function Yt(e){return e.type===T.select}function Xt(e){return e.type===T.plural}function Mo(e){return e.type===T.pound}function Zt(e){return e.type===T.tag}function Jt(e){return!!(e&&typeof e=="object"&&e.type===Te.number)}function mt(e){return!!(e&&typeof e=="object"&&e.type===Te.dateTime)}var nn=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var ca=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Uo(e){var t={};return e.replace(ca,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Do=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Go(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Do).filter(function(u){return u.length>0}),r=[],n=0,o=t;n<o.length;n++){var i=o[n],s=i.split("/");if(s.length===0)throw new Error("Invalid number skeleton");for(var c=s[0],a=s.slice(1),h=0,l=a;h<l.length;h++){var d=l[h];if(d.length===0)throw new Error("Invalid number skeleton")}r.push({stem:c,options:a})}return r}function la(e){return e.replace(/^(.*?)-/,"")}var Fo=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Vo=/^(@+)?(\+|#+)?$/g,ha=/(\*)(0+)|(#+)(0+)|(0+)/g,jo=/^(0+)$/;function Ho(e){var t={};return e.replace(Vo,function(r,n,o){return typeof o!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):o==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),t}function Bo(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function da(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!jo.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function zo(e){var t={},r=Bo(e);return r||t}function Wo(e){for(var t={},r=0,n=e;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=o.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=la(o.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=E(E(E({},t),{notation:"scientific"}),o.options.reduce(function(c,a){return E(E({},c),zo(a))},{}));continue;case"engineering":t=E(E(E({},t),{notation:"engineering"}),o.options.reduce(function(c,a){return E(E({},c),zo(a))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace(ha,function(c,a,h,l,d,u){if(a)t.minimumIntegerDigits=h.length;else{if(l&&d)throw new Error("We currently do not support maximum integer digits");if(u)throw new Error("We currently do not support exact integer digits")}return""});continue}if(jo.test(o.stem)){t.minimumIntegerDigits=o.stem.length;continue}if(Fo.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(Fo,function(c,a,h,l,d,u){return h==="*"?t.minimumFractionDigits=a.length:l&&l[0]==="#"?t.maximumFractionDigits=l.length:d&&u?(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length+u.length):(t.minimumFractionDigits=a.length,t.maximumFractionDigits=a.length),""}),o.options.length&&(t=E(E({},t),Ho(o.options[0])));continue}if(Vo.test(o.stem)){t=E(E({},t),Ho(o.stem));continue}var i=Bo(o.stem);i&&(t=E(E({},t),i));var s=da(o.stem);s&&(t=E(E({},t),s))}return t}var on,ua=new RegExp("^"+nn.source+"*"),ma=new RegExp(nn.source+"*$");function y(e,t){return{start:e,end:t}}var pa=!!String.prototype.startsWith,fa=!!String.fromCodePoint,ga=!!Object.fromEntries,xa=!!String.prototype.codePointAt,va=!!String.prototype.trimStart,ya=!!String.prototype.trimEnd,Ea=!!Number.isSafeInteger,ba=Ea?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},an=!0;try{qo=Jo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),an=((on=qo.exec("a"))===null||on===void 0?void 0:on[0])==="a"}catch{an=!1}var qo,Yo=pa?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},cn=fa?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",o=t.length,i=0,s;o>i;){if(s=t[i++],s>1114111)throw RangeError(s+" is not a valid code point");n+=s<65536?String.fromCharCode(s):String.fromCharCode(((s-=65536)>>10)+55296,s%1024+56320)}return n},Xo=ga?Object.fromEntries:function(t){for(var r={},n=0,o=t;n<o.length;n++){var i=o[n],s=i[0],c=i[1];r[s]=c}return r},Zo=xa?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var o=t.charCodeAt(r),i;return o<55296||o>56319||r+1===n||(i=t.charCodeAt(r+1))<56320||i>57343?o:(o-55296<<10)+(i-56320)+65536}},_a=va?function(t){return t.trimStart()}:function(t){return t.replace(ua,"")},wa=ya?function(t){return t.trimEnd()}:function(t){return t.replace(ma,"")};function Jo(e,t){return new RegExp(e,t)}var ln;an?(sn=Jo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),ln=function(t,r){var n;sn.lastIndex=r;var o=sn.exec(t);return(n=o[1])!==null&&n!==void 0?n:""}):ln=function(t,r){for(var n=[];;){var o=Zo(t,r);if(o===void 0||Ko(o)||Ta(o))break;n.push(o),r+=o>=65536?2:1}return cn.apply(void 0,n)};var sn,Qo=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var o=[];!this.isEOF();){var i=this.char();if(i===123){var s=this.parseArgument(t,n);if(s.err)return s;o.push(s.val)}else{if(i===125&&t>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var c=this.clonePosition();this.bump(),o.push({type:T.pound,location:y(c,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(v.UNMATCHED_CLOSING_TAG,y(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&hn(this.peek()||0)){var s=this.parseTag(t,r);if(s.err)return s;o.push(s.val)}else{var s=this.parseLiteral(t,r);if(s.err)return s;o.push(s.val)}}}return{val:o,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:T.literal,value:"<"+o+"/>",location:y(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(t+1,r,!0);if(i.err)return i;var s=i.val,c=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!hn(this.char()))return this.error(v.INVALID_TAG,y(c,this.clonePosition()));var a=this.clonePosition(),h=this.parseTagName();return o!==h?this.error(v.UNMATCHED_CLOSING_TAG,y(a,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:T.tag,value:o,children:s,location:y(n,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,y(c,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,y(n,this.clonePosition()))}else return this.error(v.INVALID_TAG,y(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Sa(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),o="";;){var i=this.tryParseQuote(r);if(i){o+=i;continue}var s=this.tryParseUnquoted(t,r);if(s){o+=s;continue}var c=this.tryParseLeftAngleBracket();if(c){o+=c;continue}break}var a=y(n,this.clonePosition());return{val:{type:T.literal,value:o,location:a},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Aa(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return cn.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),cn(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,y(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(v.MALFORMED_ARGUMENT,y(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:T.argument,value:o,location:y(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition())):this.parseArgumentOptions(t,r,o,n);default:return this.error(v.MALFORMED_ARGUMENT,y(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=ln(this.message,r),o=r+n.length;this.bumpTo(o);var i=this.clonePosition(),s=y(t,i);return{value:n,location:s}},e.prototype.parseArgumentOptions=function(t,r,n,o){var i,s=this.clonePosition(),c=this.parseIdentifierIfPossible().value,a=this.clonePosition();switch(c){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,y(s,a));case"number":case"date":case"time":{this.bumpSpace();var h=null;if(this.bumpIf(",")){this.bumpSpace();var l=this.clonePosition(),d=this.parseSimpleArgStyleIfPossible();if(d.err)return d;var u=wa(d.val);if(u.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,y(this.clonePosition(),this.clonePosition()));var m=y(l,this.clonePosition());h={style:u,styleLocation:m}}var f=this.tryParseArgumentClose(o);if(f.err)return f;var g=y(o,this.clonePosition());if(h&&Yo(h?.style,"::",0)){var _=_a(h.style.slice(2));if(c==="number"){var d=this.parseNumberSkeletonFromString(_,h.styleLocation);return d.err?d:{val:{type:T.number,value:n,location:g,style:d.val},err:null}}else{if(_.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,g);var u={type:Te.dateTime,pattern:_,location:h.styleLocation,parsedOptions:this.shouldParseSkeletons?Uo(_):{}},P=c==="date"?T.date:T.time;return{val:{type:P,value:n,location:g,style:u},err:null}}}return{val:{type:c==="number"?T.number:c==="date"?T.date:T.time,value:n,location:g,style:(i=h?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var C=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,y(C,E({},C)));this.bumpSpace();var A=this.parseIdentifierIfPossible(),I=0;if(c!=="select"&&A.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y(this.clonePosition(),this.clonePosition()));this.bumpSpace();var d=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(d.err)return d;this.bumpSpace(),A=this.parseIdentifierIfPossible(),I=d.val}var S=this.tryParsePluralOrSelectOptions(t,c,r,A);if(S.err)return S;var f=this.tryParseArgumentClose(o);if(f.err)return f;var $=y(o,this.clonePosition());return c==="select"?{val:{type:T.select,value:n,options:Xo(S.val),location:$},err:null}:{val:{type:T.plural,value:n,options:Xo(S.val),offset:I,pluralType:c==="plural"?"cardinal":"ordinal",location:$},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,y(s,a))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,y(o,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=Go(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:Te.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?Wo(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,o){for(var i,s=!1,c=[],a=new Set,h=o.value,l=o.location;;){if(h.length===0){var d=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;l=y(d,this.clonePosition()),h=this.message.slice(d.offset,this.offset())}else break}if(a.has(h))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);h==="other"&&(s=!0),this.bumpSpace();var m=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,y(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(t+1,r,n);if(f.err)return f;var g=this.tryParseArgumentClose(m);if(g.err)return g;c.push([h,{value:f.val,location:y(m,this.clonePosition())}]),a.add(h),this.bumpSpace(),i=this.parseIdentifierIfPossible(),h=i.value,l=i.location}return c.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,y(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!s?this.error(v.MISSING_OTHER_CLAUSE,y(this.clonePosition(),this.clonePosition())):{val:c,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var i=!1,s=0;!this.isEOF();){var c=this.char();if(c>=48&&c<=57)i=!0,s=s*10+(c-48),this.bump();else break}var a=y(o,this.clonePosition());return i?(s*=n,ba(s)?{val:s,err:null}:this.error(r,a)):this.error(t,a)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Zo(this.message,t);if(r===void 0)throw Error("Offset "+t+" is at invalid UTF-16 code unit boundary");return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Yo(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset "+t+" must be greater than or equal to the current offset "+this.offset());for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset "+t+" is at invalid UTF-16 code unit boundary");if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Ko(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function hn(e){return e>=97&&e<=122||e>=65&&e<=90}function Aa(e){return hn(e)||e===47}function Sa(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Ko(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Ta(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function dn(e){e.forEach(function(t){if(delete t.location,Yt(t)||Xt(t))for(var r in t.options)delete t.options[r].location,dn(t.options[r].value);else Bt(t)&&Jt(t.style)||(Wt(t)||qt(t))&&mt(t.style)?delete t.style.location:Zt(t)&&dn(t.children)})}function ei(e,t){t===void 0&&(t={}),t=E({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Qo(e,t).parse();if(r.err){var n=SyntaxError(v[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||dn(r.val),r.val}function pt(e,t){var r=t&&t.cache?t.cache:Na,n=t&&t.serializer?t.serializer:La,o=t&&t.strategy?t.strategy:Ca;return o(e,{cache:r,serializer:n})}function Pa(e){return e==null||typeof e=="number"||typeof e=="boolean"}function ti(e,t,r,n){var o=Pa(n)?n:r(n),i=t.get(o);return typeof i>"u"&&(i=e.call(this,n),t.set(o,i)),i}function ri(e,t,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),i=t.get(o);return typeof i>"u"&&(i=e.apply(this,n),t.set(o,i)),i}function un(e,t,r,n,o){return r.bind(t,e,n,o)}function Ca(e,t){var r=e.length===1?ti:ri;return un(e,this,r,t.cache.create(),t.serializer)}function $a(e,t){return un(e,this,ri,t.cache.create(),t.serializer)}function Oa(e,t){return un(e,this,ti,t.cache.create(),t.serializer)}var La=function(){return JSON.stringify(arguments)};function mn(){this.cache=Object.create(null)}mn.prototype.get=function(e){return this.cache[e]};mn.prototype.set=function(e,t){this.cache[e]=t};var Na={create:function(){return new mn}},Qt={variadic:$a,monadic:Oa};var Pe;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Pe||(Pe={}));var ft=function(e){ut(t,e);function t(r,n,o){var i=e.call(this,r)||this;return i.code=n,i.originalMessage=o,i}return t.prototype.toString=function(){return"[formatjs Error: "+this.code+"] "+this.message},t}(Error);var pn=function(e){ut(t,e);function t(r,n,o,i){return e.call(this,'Invalid values for "'+r+'": "'+n+'". Options are "'+Object.keys(o).join('", "')+'"',Pe.INVALID_VALUE,i)||this}return t}(ft);var ni=function(e){ut(t,e);function t(r,n,o){return e.call(this,'Value for "'+r+'" must be of type '+n,Pe.INVALID_VALUE,o)||this}return t}(ft);var oi=function(e){ut(t,e);function t(r,n){return e.call(this,'The intl string context variable "'+r+'" was not provided to the string "'+n+'"',Pe.MISSING_VALUE,n)||this}return t}(ft);var D;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(D||(D={}));function Ra(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==D.literal||r.type!==D.literal?t.push(r):n.value+=r.value,t},[])}function Ia(e){return typeof e=="function"}function gt(e,t,r,n,o,i,s){if(e.length===1&&rn(e[0]))return[{type:D.literal,value:e[0].value}];for(var c=[],a=0,h=e;a<h.length;a++){var l=h[a];if(rn(l)){c.push({type:D.literal,value:l.value});continue}if(Mo(l)){typeof i=="number"&&c.push({type:D.literal,value:r.getNumberFormat(t).format(i)});continue}var d=l.value;if(!(o&&d in o))throw new oi(d,s);var u=o[d];if(ko(l)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),c.push({type:typeof u=="string"?D.literal:D.object,value:u});continue}if(Wt(l)){var m=typeof l.style=="string"?n.date[l.style]:mt(l.style)?l.style.parsedOptions:void 0;c.push({type:D.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(qt(l)){var m=typeof l.style=="string"?n.time[l.style]:mt(l.style)?l.style.parsedOptions:void 0;c.push({type:D.literal,value:r.getDateTimeFormat(t,m).format(u)});continue}if(Bt(l)){var m=typeof l.style=="string"?n.number[l.style]:Jt(l.style)?l.style.parsedOptions:void 0;m&&m.scale&&(u=u*(m.scale||1)),c.push({type:D.literal,value:r.getNumberFormat(t,m).format(u)});continue}if(Zt(l)){var f=l.children,g=l.value,_=o[g];if(!Ia(_))throw new ni(g,"function",s);var P=gt(f,t,r,n,o,i),C=_(P.map(function(S){return S.value}));Array.isArray(C)||(C=[C]),c.push.apply(c,C.map(function(S){return{type:typeof S=="string"?D.literal:D.object,value:S}}))}if(Yt(l)){var A=l.options[u]||l.options.other;if(!A)throw new pn(l.value,u,Object.keys(l.options),s);c.push.apply(c,gt(A.value,t,r,n,o));continue}if(Xt(l)){var A=l.options["="+u];if(!A){if(!Intl.PluralRules)throw new ft(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Pe.MISSING_INTL_API,s);var I=r.getPluralRules(t,{type:l.pluralType}).select(u-(l.offset||0));A=l.options[I]||l.options.other}if(!A)throw new pn(l.value,u,Object.keys(l.options),s);c.push.apply(c,gt(A.value,t,r,n,o,u-(l.offset||0)));continue}}return Ra(c)}function ka(e,t){return t?E(E(E({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=E(E({},e[n]),t[n]||{}),r},{})):e}function Ma(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=ka(e[n],t[n]),r},E({},e)):e}function fn(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Ua(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:pt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,jt([void 0],r)))},{cache:fn(e.number),strategy:Qt.variadic}),getDateTimeFormat:pt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,jt([void 0],r)))},{cache:fn(e.dateTime),strategy:Qt.variadic}),getPluralRules:pt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,jt([void 0],r)))},{cache:fn(e.pluralRules),strategy:Qt.variadic})}}var ii=function(){function e(t,r,n,o){var i=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(s){var c=i.formatToParts(s);if(c.length===1)return c[0].value;var a=c.reduce(function(h,l){return!h.length||l.type!==D.literal||typeof h[h.length-1]!="string"?h.push(l.value):h[h.length-1]+=l.value,h},[]);return a.length<=1?a[0]||"":a},this.formatToParts=function(s){return gt(i.ast,i.locales,i.formatters,i.formats,s,void 0,i.message)},this.resolvedOptions=function(){return{locale:Intl.NumberFormat.supportedLocalesOf(i.locales)[0]}},this.getAst=function(){return i.ast},typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:o?.ignoreTag})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Ma(e.formats,n),this.locales=r,this.formatters=o&&o.formatters||Ua(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.__parse=ei,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var si=ii;var Da=/[0-9\-+#]/,Fa=/[^\d\-+#]/g;function ai(e){return e.search(Da)}function Ha(e="#.##"){let t={},r=e.length,n=ai(e);t.prefix=n>0?e.substring(0,n):"";let o=ai(e.split("").reverse().join("")),i=r-o,s=e.substring(i,i+1),c=i+(s==="."||s===","?1:0);t.suffix=o>0?e.substring(c,r):"",t.mask=e.substring(n,c),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let a=t.mask.match(Fa);return t.decimal=a&&a[a.length-1]||".",t.separator=a&&a[1]&&a[0]||",",a=t.mask.split(t.decimal),t.integer=a[0],t.fraction=a[1],t}function za(e,t,r){let n=!1,o={value:e};e<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(t.fraction&&t.fraction.length),o.value=Number(o.value).toString();let i=t.fraction&&t.fraction.lastIndexOf("0"),[s="0",c=""]=o.value.split(".");return(!c||c&&c.length<=i)&&(c=i<0?"":(+("0."+c)).toFixed(i+1).replace("0.","")),o.integer=s,o.fraction=c,Ga(o,t),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&t.maskHasPositiveSign?o.sign="+":n&&t.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),o}function Ga(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;e.integer.length<n.length-o;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let i=r[1]&&r[r.length-1].length;if(i){let s=e.integer.length,c=s%i;for(let a=0;a<s;a++)e.result+=e.integer.charAt(a),!((a-c+1)%i)&&a<s-i&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Va(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Ha(e),o=za(t,n,r);return n.prefix+o.sign+o.result+n.suffix}var ci=Va;var li=".",ja=",",di=/^\s+/,ui=/\s+$/,hi="&nbsp;",xt={MONTH:"MONTH",YEAR:"YEAR"},Ba={[L.ANNUAL]:12,[L.MONTHLY]:1,[L.THREE_YEARS]:36,[L.TWO_YEARS]:24},Wa={CHF:e=>Math.round(e*20)/20},gn=(e,t)=>({accept:e,round:t}),qa=[gn(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),gn(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.ceil(Math.floor(t*1e4/e)/100)/100),gn(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],xn={[k.YEAR]:{[L.MONTHLY]:xt.MONTH,[L.ANNUAL]:xt.YEAR},[k.MONTH]:{[L.MONTHLY]:xt.MONTH}},Ya=(e,t)=>e.indexOf(`'${t}'`)===0,Xa=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=pi(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Ja(e)),r},Za=e=>{let t=Qa(e),r=Ya(e,t),n=e.replace(/'.*?'/,""),o=di.test(n)||ui.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:o}},mi=e=>e.replace(di,hi).replace(ui,hi),Ja=e=>e.match(/#(.?)#/)?.[1]===li?ja:li,Qa=e=>e.match(/'(.*?)'/)?.[1]??"",pi=e=>e.match(/0(.?)0/)?.[1]??"";function Kt({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},o,i=s=>s){let{currencySymbol:s,isCurrencyFirst:c,hasCurrencySpace:a}=Za(e),h=r?pi(e):"",l=Xa(e,r),d=r?2:0,u=i(t,{currencySymbol:s}),m=n?u.toLocaleString("hi-IN",{minimumFractionDigits:d,maximumFractionDigits:d}):ci(l,u),f=r?m.lastIndexOf(h):m.length,g=m.substring(0,f),_=m.substring(f+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,m).replace(/SYMBOL/,s),currencySymbol:s,decimals:_,decimalsDelimiter:h,hasCurrencySpace:a,integer:g,isCurrencyFirst:c,recurrenceTerm:o}}var fi=e=>{let{commitment:t,term:r,usePrecision:n}=e,o=Ba[r]??1;return Kt(e,o>1?xt.MONTH:xn[t]?.[r],(i,{currencySymbol:s})=>{let c={divisor:o,price:i,usePrecision:n},{round:a}=qa.find(({accept:l})=>l(c));if(!a)throw new Error(`Missing rounding rule for: ${JSON.stringify(c)}`);return(Wa[s]??(l=>l))(a(c))})},gi=({commitment:e,term:t,...r})=>Kt(r,xn[e]?.[t]),xi=e=>{let{commitment:t,term:r}=e;return t===k.YEAR&&r===L.MONTHLY?Kt(e,xt.YEAR,n=>n*12):Kt(e,xn[t]?.[r])};var Ka={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},ec=Lo("ConsonantTemplates/price"),tc=/<.+?>/g,W={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},Ce={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},rc="TAX_EXCLUSIVE",nc=e=>Oo(e)?Object.entries(e).filter(([,t])=>Be(t)||Gt(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+Co(n)+'"'}`,""):"",te=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+W.disabled}"${nc(r)}>${n?mi(t):t??""}</span>`;function oc(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:o,hasCurrencySpace:i,integer:s,isCurrencyFirst:c,recurrenceLabel:a,perUnitLabel:h,taxInclusivityLabel:l},d={}){let u=te(W.currencySymbol,r),m=te(W.currencySpace,i?"&nbsp;":""),f="";return c&&(f+=u+m),f+=te(W.integer,s),f+=te(W.decimalsDelimiter,o),f+=te(W.decimals,n),c||(f+=m+u),f+=te(W.recurrence,a,null,!0),f+=te(W.unitType,h,null,!0),f+=te(W.taxInclusivity,l,!0),te(e,f,{...d,"aria-label":t})}var $e=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1}={})=>({country:n,displayFormatted:o=!0,displayRecurrence:i=!0,displayPerUnit:s=!1,displayTax:c=!1,language:a,literals:h={}}={},{commitment:l,formatString:d,price:u,priceWithoutDiscount:m,taxDisplay:f,taxTerm:g,term:_,usePrecision:P}={},C={})=>{Object.entries({country:n,formatString:d,language:a,price:u}).forEach(([ce,Ir])=>{if(Ir==null)throw new Error(`Argument "${ce}" is missing`)});let A={...Ka,...h},I=`${a.toLowerCase()}-${n.toUpperCase()}`;function S(ce,Ir){let kr=A[ce];if(kr==null)return"";try{return new si(kr.replace(tc,""),I).format(Ir)}catch{return ec.error("Failed to format literal:",kr),""}}let $=t&&m?m:u,z=e?fi:gi;r&&(z=xi);let{accessiblePrice:Z,recurrenceTerm:se,...me}=z({commitment:l,formatString:d,term:_,price:e?u:$,usePrecision:P,isIndianPrice:n==="IN"}),J=Z,we="";if(w(i)&&se){let ce=S(Ce.recurrenceAriaLabel,{recurrenceTerm:se});ce&&(J+=" "+ce),we=S(Ce.recurrenceLabel,{recurrenceTerm:se})}let Ae="";if(w(s)){Ae=S(Ce.perUnitLabel,{perUnit:"LICENSE"});let ce=S(Ce.perUnitAriaLabel,{perUnit:"LICENSE"});ce&&(J+=" "+ce)}let ae="";w(c)&&g&&(ae=S(f===rc?Ce.taxExclusiveLabel:Ce.taxInclusiveLabel,{taxTerm:g}),ae&&(J+=" "+ae)),t&&(J=S(Ce.strikethroughAriaLabel,{strikethroughPrice:J}));let Q=W.container;if(e&&(Q+=" "+W.containerOptical),t&&(Q+=" "+W.containerStrikethrough),r&&(Q+=" "+W.containerAnnual),w(o))return oc(Q,{...me,accessibleLabel:J,recurrenceLabel:we,perUnitLabel:Ae,taxInclusivityLabel:ae},C);let{currencySymbol:Ge,decimals:Ut,decimalsDelimiter:Dt,hasCurrencySpace:ct,integer:Rr,isCurrencyFirst:Is}=me,Ve=[Rr,Dt,Ut];Is?(Ve.unshift(ct?"\xA0":""),Ve.unshift(Ge)):(Ve.push(ct?"\xA0":""),Ve.push(Ge)),Ve.push(we,Ae,ae);let ks=Ve.join("");return te(Q,ks,C)},vi=()=>(e,t,r)=>{let o=(e.displayOldPrice===void 0||w(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${$e()(e,t,r)}${o?"&nbsp;"+$e({displayStrikethrough:!0})(e,t,r):""}`};var vn=$e(),yn=vi(),En=$e({displayOptical:!0}),bn=$e({displayStrikethrough:!0}),_n=$e({displayAnnual:!0});var ic=(e,t)=>{if(!(!qe(e)||!qe(t)))return Math.floor((t-e)/t*100)},yi=()=>(e,t,r)=>{let{price:n,priceWithoutDiscount:o}=t,i=ic(n,o);return i===void 0?'<span class="no-discount"></span>':`<span class="discount">${i}%</span>`};var wn=yi();var{freeze:vt}=Object,le=vt({...Se}),he=vt({...X}),Oe={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},Ei=vt({...k}),bi=vt({...Ro}),_i=vt({...L});var Ln={};Us(Ln,{CLASS_NAME_FAILED:()=>er,CLASS_NAME_PENDING:()=>tr,CLASS_NAME_RESOLVED:()=>rr,ERROR_MESSAGE_BAD_REQUEST:()=>nr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Sn,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>An,EVENT_TYPE_ERROR:()=>sc,EVENT_TYPE_FAILED:()=>or,EVENT_TYPE_PENDING:()=>ir,EVENT_TYPE_READY:()=>Ze,EVENT_TYPE_RESOLVED:()=>sr,LOG_NAMESPACE:()=>Tn,Landscape:()=>Je,PARAM_AOS_API_KEY:()=>ac,PARAM_ENV:()=>Pn,PARAM_LANDSCAPE:()=>Cn,PARAM_WCS_API_KEY:()=>cc,STATE_FAILED:()=>re,STATE_PENDING:()=>ne,STATE_RESOLVED:()=>oe,TAG_NAME_SERVICE:()=>ge,WCS_PROD_URL:()=>$n,WCS_STAGE_URL:()=>On});var er="placeholder-failed",tr="placeholder-pending",rr="placeholder-resolved",nr="Bad WCS request",An="Commerce offer not found",Sn="Literals URL not provided",sc="wcms:commerce:error",or="wcms:placeholder:failed",ir="wcms:placeholder:pending",Ze="wcms:commerce:ready",sr="wcms:placeholder:resolved",Tn="wcms/commerce",Pn="commerce.env",Cn="commerce.landscape",ac="commerce.aosKey",cc="commerce.wcsKey",$n="https://www.adobe.com/web_commerce_artifact",On="https://www.stage.adobe.com/web_commerce_artifact_stage",re="failed",ne="pending",oe="resolved",ge="wcms-commerce",Je={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var Nn={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:30,tags:"consumer=milo/commerce"},wi=new Set,lc=e=>e instanceof Error||typeof e.originatingRequest=="string";function Ai(e){if(e==null)return;let t=typeof e;if(t==="function"){let{name:r}=e;return r?`${t} ${r}`:t}if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:o,status:i}=e;return[n,i,o].filter(s=>s).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Nn.serializableTypes.includes(r))return r}return e}function hc(e,t){if(!Nn.ignoredProperties.includes(e))return Ai(t)}var Rn={append(e){let{delimiter:t,sampleRate:r,tags:n,clientId:o}=Nn,{message:i,params:s}=e,c=[],a=i,h=[];s.forEach(u=>{u!=null&&(lc(u)?c:h).push(u)}),c.length&&(a+=" ",a+=c.map(Ai).join(" "));let{pathname:l,search:d}=window.location;a+=`${t}page=`,a+=l+d,h.length&&(a+=`${t}facts=`,a+=JSON.stringify(h,hc)),wi.has(a)||(wi.add(a),window.lana?.log(a,{sampleRate:r,tags:n,clientId:o}))}};var b=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:le.V3,checkoutWorkflowStep:he.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:Oe.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Je.PUBLISHED,wcsBufferLimit:1});function Si(e,{once:t=!1}={}){let r=null;function n(){let o=document.querySelector(ge);o!==r&&(r=o,o&&e(o))}return document.addEventListener(Ze,n,{once:t}),xe(n),()=>document.removeEventListener(Ze,n)}function yt(e,{country:t,forceTaxExclusive:r,perpetual:n}){let o;if(e.length<2)o=e;else{let i=t==="GB"||n?"EN":"MULT",[s,c]=e;o=[s.language===i?s:c]}return r&&(o=o.map(en)),o}var xe=e=>window.setTimeout(e);function Qe(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(Xe).filter(qe);return r.length||(r=[t]),r}function ar(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(Wr)}function G(){return window.customElements.get(ge)?.instance}var dc="en_US",p={ar:"AR_es",be_en:"BE_en",be_fr:"BE_fr",be_nl:"BE_nl",br:"BR_pt",ca:"CA_en",ch_de:"CH_de",ch_fr:"CH_fr",ch_it:"CH_it",cl:"CL_es",co:"CO_es",la:"DO_es",mx:"MX_es",pe:"PE_es",africa:"MU_en",dk:"DK_da",de:"DE_de",ee:"EE_et",eg_ar:"EG_ar",eg_en:"EG_en",es:"ES_es",fr:"FR_fr",gr_el:"GR_el",gr_en:"GR_en",ie:"IE_en",il_he:"IL_iw",it:"IT_it",lv:"LV_lv",lt:"LT_lt",lu_de:"LU_de",lu_en:"LU_en",lu_fr:"LU_fr",my_en:"MY_en",my_ms:"MY_ms",hu:"HU_hu",mt:"MT_en",mena_en:"DZ_en",mena_ar:"DZ_ar",nl:"NL_nl",no:"NO_nb",pl:"PL_pl",pt:"PT_pt",ro:"RO_ro",si:"SI_sl",sk:"SK_sk",fi:"FI_fi",se:"SE_sv",tr:"TR_tr",uk:"GB_en",at:"AT_de",cz:"CZ_cs",bg:"BG_bg",ru:"RU_ru",ua:"UA_uk",au:"AU_en",in_en:"IN_en",in_hi:"IN_hi",id_en:"ID_en",id_id:"ID_in",nz:"NZ_en",sa_ar:"SA_ar",sa_en:"SA_en",sg:"SG_en",cn:"CN_zh-Hans",tw:"TW_zh-Hant",hk_zh:"HK_zh-hant",jp:"JP_ja",kr:"KR_ko",za:"ZA_en",ng:"NG_en",cr:"CR_es",ec:"EC_es",pr:"US_es",gt:"GT_es",cis_en:"AZ_en",cis_ru:"AZ_ru",sea:"SG_en",th_en:"TH_en",th_th:"TH_th"},cr=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});function uc({locale:e={}}={}){if(!e.prefix)return{country:b.country,language:b.language,locale:dc};let t=e.prefix.replace("/","")??"",[r=b.country,n=b.language]=(p[t]??t).split("_",2);return r=r.toUpperCase(),n=n.toLowerCase(),{country:r,language:n,locale:`${n}_${r}`}}function Ti(e={}){let{commerce:t={},locale:r=void 0}=e,n=Oe.PRODUCTION,o=$n,i=["local","stage"].includes(e.env?.name),s=N(Pn,t,{metadata:!1})?.toLowerCase()==="stage";i&&s&&(n=Oe.STAGE,o=On);let c=N("checkoutClientId",t)??b.checkoutClientId,a=fe(N("checkoutWorkflow",t),le,b.checkoutWorkflow),h=he.CHECKOUT;a===le.V3&&(h=fe(N("checkoutWorkflowStep",t),he,b.checkoutWorkflowStep));let l=w(N("displayOldPrice",t),b.displayOldPrice),d=w(N("displayPerUnit",t),b.displayPerUnit),u=w(N("displayRecurrence",t),b.displayRecurrence),m=w(N("displayTax",t),b.displayTax),f=w(N("entitlement",t),b.entitlement),g=w(N("modal",t),b.modal),_=w(N("forceTaxExclusive",t),b.forceTaxExclusive),P=N("promotionCode",t)??b.promotionCode,C=Qe(N("quantity",t)),A=N("wcsApiKey",t)??b.wcsApiKey,I=e.env?.name===cr.PROD?Je.PUBLISHED:fe(N(Cn,t),Je,b.landscape),S=Xe(N("wcsBufferDelay",t),b.wcsBufferDelay),$=Xe(N("wcsBufferLimit",t),b.wcsBufferLimit);return{...uc({locale:r}),displayOldPrice:l,checkoutClientId:c,checkoutWorkflow:a,checkoutWorkflowStep:h,displayPerUnit:d,displayRecurrence:u,displayTax:m,entitlement:f,extraOptions:b.extraOptions,modal:g,env:n,forceTaxExclusive:_,priceLiteralsURL:t.priceLiteralsURL,priceLiteralsPromise:t.priceLiteralsPromise,promotionCode:P,quantity:C,wcsApiKey:A,wcsBufferDelay:S,wcsBufferLimit:$,wcsURL:o,landscape:I}}var Ci="debug",mc="error",pc="info",fc="warn",gc=Date.now(),In=new Set,kn=new Set,Pi=new Map,Et=Object.freeze({DEBUG:Ci,ERROR:mc,INFO:pc,WARN:fc}),$i={append({level:e,message:t,params:r,timestamp:n,source:o}){console[e](`${n}ms [${o}] %c${t}`,"font-weight: bold;",...r)}},Oi={filter:({level:e})=>e!==Ci},xc={filter:()=>!1};function vc(e,t,r,n,o){return{level:e,message:t,namespace:r,get params(){if(n.length===1){let[i]=n;pe(i)&&(n=i(),Array.isArray(n)||(n=[n]))}return n},source:o,timestamp:Date.now()-gc}}function yc(e){[...kn].every(t=>t(e))&&In.forEach(t=>t(e))}function Li(e){let t=(Pi.get(e)??0)+1;Pi.set(e,t);let r=`${e} #${t}`,n=i=>(s,...c)=>yc(vc(i,s,e,c,r)),o=Object.seal({id:r,namespace:e,module(i){return Li(`${o.namespace}/${i}`)},debug:n(Et.DEBUG),error:n(Et.ERROR),info:n(Et.INFO),warn:n(Et.WARN)});return o}function lr(...e){e.forEach(t=>{let{append:r,filter:n}=t;pe(n)?kn.add(n):pe(r)&&In.add(r)})}function Ec(e={}){let{name:t}=e,r=w(N("commerce.debug",{search:!0,storage:!0}),t===cr.LOCAL);return lr(r?$i:Oi),t===cr.PROD&&lr(Rn),F}function bc(){In.clear(),kn.clear()}var F={...Li(Tn),Level:Et,Plugins:{consoleAppender:$i,debugFilter:Oi,quietFilter:xc,lanaAppender:Rn},init:Ec,reset:bc,use:lr};var _c={CLASS_NAME_FAILED:er,CLASS_NAME_PENDING:tr,CLASS_NAME_RESOLVED:rr,EVENT_TYPE_FAILED:or,EVENT_TYPE_PENDING:ir,EVENT_TYPE_RESOLVED:sr,STATE_FAILED:re,STATE_PENDING:ne,STATE_RESOLVED:oe},wc={[re]:er,[ne]:tr,[oe]:rr},Ac={[re]:or,[ne]:ir,[oe]:sr},ur=new WeakMap;function V(e){if(!ur.has(e)){let t=F.module(e.constructor.is);ur.set(e,{changes:new Map,connected:!1,dispose:We,error:void 0,log:t,options:void 0,promises:[],state:ne,timer:null,value:void 0,version:0})}return ur.get(e)}function hr(e){let t=V(e),{error:r,promises:n,state:o}=t;(o===oe||o===re)&&(t.promises=[],o===oe?n.forEach(({resolve:i})=>i(e)):o===re&&n.forEach(({reject:i})=>i(r))),e.dispatchEvent(new CustomEvent(Ac[o],{bubbles:!0}))}function dr(e){let t=ur.get(e);[re,ne,oe].forEach(r=>{e.classList.toggle(wc[r],r===t.state)})}var Sc={get error(){return V(this).error},get log(){return V(this).log},get options(){return V(this).options},get state(){return V(this).state},get value(){return V(this).value},attributeChangedCallback(e,t,r){V(this).changes.set(e,r),this.requestUpdate()},connectedCallback(){V(this).dispose=Si(()=>this.requestUpdate(!0))},disconnectedCallback(){let e=V(this);e.connected&&(e.connected=!1,e.log.debug("Disconnected:",{element:this})),e.dispose(),e.dispose=We},onceSettled(){let{error:e,promises:t,state:r}=V(this);return oe===r?Promise.resolve(this):re===r?Promise.reject(e):new Promise((n,o)=>{t.push({resolve:n,reject:o})})},toggleResolved(e,t,r){let n=V(this);return e!==n.version?!1:(r!==void 0&&(n.options=r),n.state=oe,n.value=t,dr(this),this.log.debug("Resolved:",{element:this,value:t}),xe(()=>hr(this)),!0)},toggleFailed(e,t,r){let n=V(this);return e!==n.version?!1:(r!==void 0&&(n.options=r),n.error=t,n.state=re,dr(this),n.log.error("Failed:",{element:this,error:t}),xe(()=>hr(this)),!0)},togglePending(e){let t=V(this);return t.version++,e&&(t.options=e),t.state=ne,dr(this),xe(()=>hr(this)),t.version},requestUpdate(e=!1){if(!this.isConnected||!G())return;let t=V(this);if(t.timer)return;let{error:r,options:n,state:o,value:i,version:s}=t;t.state=ne,t.timer=xe(async()=>{t.timer=null;let c=null;if(t.changes.size&&(c=Object.fromEntries(t.changes.entries()),t.changes.clear()),t.connected?t.log.debug("Updated:",{element:this,changes:c}):(t.connected=!0,t.log.debug("Connected:",{element:this,changes:c})),c||e)try{await this.render?.()===!1&&t.state===ne&&t.version===s&&(t.state=o,t.error=r,t.value=i,dr(this),hr(this))}catch(a){this.toggleFailed(t.version,a,n)}})}};function Ni(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function mr(e,t={}){let{tag:r,is:n}=e,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,Ni(t)),o}function pr(e){let{tag:t,is:r,prototype:n}=e,o=window.customElements.get(r);return o||(Object.defineProperties(n,Object.getOwnPropertyDescriptors(Sc)),o=Object.defineProperties(e,Object.getOwnPropertyDescriptors(_c)),window.customElements.define(r,o,{extends:t})),o}function fr(e,t=document.body){return Array.from(t?.querySelectorAll(`${e.tag}[is="${e.is}"]`)??[])}function gr(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Ni(t)),e):null}var Tc="download",Pc="upgrade",Le,Ke=class Ke extends HTMLAnchorElement{constructor(){super();K(this,Le);this.addEventListener("click",this.clickHandler)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}static createCheckoutLink(r={},n=""){let o=G();if(!o)return null;let{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:c,entitlement:a,upgrade:h,modal:l,perpetual:d,promotionCode:u,quantity:m,wcsOsi:f,extraOptions:g}=o.collectCheckoutOptions(r),_=mr(Ke,{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:c,entitlement:a,upgrade:h,modal:l,perpetual:d,promotionCode:u,quantity:m,wcsOsi:f,extraOptions:g});return n&&(_.innerHTML=`<span>${n}</span>`),_}static getCheckoutLinks(r){return fr(Ke,r)}get isCheckoutLink(){return!0}get placeholder(){return this}clickHandler(r){var n;(n=R(this,Le))==null||n.call(this,r)}async render(r={}){if(!this.isConnected)return!1;let n=G();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(l=>{l&&(this.dataset.imsCountry=l)},We);let o=n.collectCheckoutOptions(r,this.placeholder);if(!o.wcsOsi.length)return!1;let i;try{i=JSON.parse(o.extraOptions??"{}")}catch(l){this.placeholder.log.error("cannot parse exta checkout options",l)}let s=this.placeholder.togglePending(o);this.href="";let c=n.resolveOfferSelectors(o),a=await Promise.all(c);a=a.map(l=>yt(l,o));let h=await n.buildCheckoutAction(a.flat(),{...i,...o});return this.renderOffers(a.flat(),o,{},h,s)}renderOffers(r,n,o={},i=void 0,s=void 0){if(!this.isConnected)return!1;let c=G();if(!c)return!1;if(n={...JSON.parse(this.placeholder.dataset.extraOptions??"null"),...n,...o},s??(s=this.placeholder.togglePending(n)),R(this,Le)&&ee(this,Le,void 0),i){this.classList.remove(Tc,Pc),this.placeholder.toggleResolved(s,r,n);let{url:h,text:l,className:d,handler:u}=i;return h&&(this.href=h),l&&(this.firstElementChild.innerHTML=l),d&&this.classList.add(...d.split(" ")),u&&(this.setAttribute("href","#"),ee(this,Le,u.bind(this))),!0}else if(r.length){if(this.placeholder.toggleResolved(s,r,n)){let h=c.buildCheckoutURL(r,n);return this.setAttribute("href",h),!0}}else{let h=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(s,h,n))return this.setAttribute("href","#"),!0}return!1}updateOptions(r={}){let n=G();if(!n)return!1;let{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:c,upgrade:a,modal:h,perpetual:l,promotionCode:d,quantity:u,wcsOsi:m}=n.collectCheckoutOptions(r);return gr(this,{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:c,upgrade:a,modal:h,perpetual:l,promotionCode:d,quantity:u,wcsOsi:m}),!0}};Le=new WeakMap,O(Ke,"is","checkout-link"),O(Ke,"tag","a");var Mn=Ke,Un=pr(Mn);var Ri=[p.uk,p.au,p.fr,p.at,p.be_en,p.be_fr,p.be_nl,p.bg,p.ch_de,p.ch_fr,p.ch_it,p.cz,p.de,p.dk,p.ee,p.eg_ar,p.eg_en,p.es,p.fi,p.fr,p.gr_el,p.gr_en,p.hu,p.ie,p.it,p.lu_de,p.lu_en,p.lu_fr,p.nl,p.no,p.pl,p.pt,p.ro,p.se,p.si,p.sk,p.tr,p.ua,p.id_en,p.id_id,p.in_en,p.in_hi,p.jp,p.my_en,p.my_ms,p.nz,p.th_en,p.th_th],Cc={INDIVIDUAL_COM:[p.za,p.lt,p.lv,p.ng,p.sa_ar,p.sa_en,p.za,p.sg,p.kr],TEAM_COM:[p.za,p.lt,p.lv,p.ng,p.za,p.co,p.kr],INDIVIDUAL_EDU:[p.lt,p.lv,p.sa_en,p.sea],TEAM_EDU:[p.sea,p.kr]},et=class et extends HTMLSpanElement{static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-perpetual","data-promotion-code","data-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(t){let r=G();if(!r)return null;let{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:c,perpetual:a,promotionCode:h,quantity:l,template:d,wcsOsi:u}=r.collectPriceOptions(t);return mr(et,{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:c,perpetual:a,promotionCode:h,quantity:l,template:d,wcsOsi:u})}static getInlinePrices(t){return fr(et,t)}get isInlinePrice(){return!0}get placeholder(){return this}resolveDisplayTaxForGeoAndSegment(t,r,n,o){let i=`${t}_${r}`;if(Ri.includes(t)||Ri.includes(i))return!0;let s=Cc[`${n}_${o}`];return s?!!(s.includes(t)||s.includes(i)):!1}async resolveDisplayTax(t,r){let[n]=await t.resolveOfferSelectors(r),o=yt(await n,r);if(o?.length){let{country:i,language:s}=r,c=o[0],[a=""]=c.marketSegments;return this.resolveDisplayTaxForGeoAndSegment(i,s,c.customerSegment,a)}}async render(t={}){if(!this.isConnected)return!1;let r=G();if(!r)return!1;let n=r.collectPriceOptions(t,this.placeholder);if(!n.wcsOsi.length)return!1;let o=this.placeholder.togglePending(n);this.innerHTML="";let[i]=r.resolveOfferSelectors(n);return this.renderOffers(yt(await i,n),n,o)}renderOffers(t,r={},n=void 0){if(!this.isConnected)return;let o=G();if(!o)return!1;let i=o.collectPriceOptions({...this.dataset,...r});if(n??(n=this.placeholder.togglePending(i)),t.length){if(this.placeholder.toggleResolved(n,t,i))return this.innerHTML=o.buildPriceHTML(t,i),!0}else{let s=new Error(`Not provided: ${i?.wcsOsi??"-"}`);if(this.placeholder.toggleFailed(n,s,i))return this.innerHTML="",!0}return!1}updateOptions(t){let r=G();if(!r)return!1;let{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:c,perpetual:a,promotionCode:h,quantity:l,template:d,wcsOsi:u}=r.collectPriceOptions(t);return gr(this,{displayOldPrice:n,displayPerUnit:o,displayRecurrence:i,displayTax:s,forceTaxExclusive:c,perpetual:a,promotionCode:h,quantity:l,template:d,wcsOsi:u}),!0}};O(et,"is","inline-price"),O(et,"tag","span");var Dn=et,Fn=pr(Dn);function Ii({providers:e,settings:t},r){let n=F.module("checkout");function o(h,l){let{checkoutClientId:d,checkoutWorkflow:u,checkoutWorkflowStep:m,country:f,language:g,promotionCode:_,quantity:P}=t,{checkoutMarketSegment:C,checkoutWorkflow:A=u,checkoutWorkflowStep:I=m,imsCountry:S,country:$=S??f,language:z=g,quantity:Z=P,entitlement:se,upgrade:me,modal:J,perpetual:we,promotionCode:Ae=_,wcsOsi:ae,extraOptions:Q,...Ge}=Object.assign({},l?.dataset??{},h??{}),Ut=fe(A,le,b.checkoutWorkflow),Dt=he.CHECKOUT;Ut===le.V3&&(Dt=fe(I,he,b.checkoutWorkflowStep));let ct=Ye({...Ge,extraOptions:Q,checkoutClientId:d,checkoutMarketSegment:C,country:$,quantity:Qe(Z,b.quantity),checkoutWorkflow:Ut,checkoutWorkflowStep:Dt,language:z,entitlement:w(se),upgrade:w(me),modal:w(J),perpetual:w(we),promotionCode:dt(Ae).effectivePromoCode,wcsOsi:ar(ae)});if(l)for(let Rr of e.checkout)Rr(l,ct);return ct}async function i(h,l){let d=G(),u=await r.getCheckoutAction?.(h,l,d.imsSignedInPromise);return u||null}function s(h,l){if(!Array.isArray(h)||!h.length||!l)return"";let{env:d,landscape:u}=t,{checkoutClientId:m,checkoutMarketSegment:f,checkoutWorkflow:g,checkoutWorkflowStep:_,country:P,promotionCode:C,quantity:A,...I}=o(l),S=window.frameElement?"if":"fp",$={checkoutPromoCode:C,clientId:m,context:S,country:P,env:d,items:[],marketSegment:f,workflowStep:_,landscape:u,...I};if(h.length===1){let[{offerId:z,offerType:Z,productArrangementCode:se}]=h,{marketSegments:[me]}=h[0];Object.assign($,{marketSegment:me,offerType:Z,productArrangementCode:se}),$.items.push(A[0]===1?{id:z}:{id:z,quantity:A[0]})}else $.items.push(...h.map(({offerId:z},Z)=>({id:z,quantity:A[Z]??b.quantity})));return Hr(g,$)}let{createCheckoutLink:c,getCheckoutLinks:a}=Un;return{CheckoutLink:Un,CheckoutWorkflow:le,CheckoutWorkflowStep:he,buildCheckoutAction:i,buildCheckoutURL:s,collectCheckoutOptions:o,createCheckoutLink:c,getCheckoutLinks:a}}function $c({interval:e=200,maxAttempts:t=25}={}){let r=F.module("ims");return new Promise(n=>{r.debug("Waing for IMS to be ready");let o=0;function i(){window.adobeIMS?.initialized?n():++o>t?(r.debug("Timeout"),n()):setTimeout(i,e)}i()})}function Oc(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function Lc(e){let t=F.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:n})=>(t.debug("Got user country:",n),n),n=>{t.error("Unable to get user country:",n)}):null)}function ki({}){let e=$c(),t=Oc(e),r=Lc(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}function Nc(e){if(!e.priceLiteralsURL)throw new Error(Sn);return new Promise(t=>{window.fetch(e.priceLiteralsURL).then(r=>{r.json().then(({data:n})=>{t(n)})})})}async function Mi(e){let r=await(e.priceLiteralsPromise||Nc(e));if(Array.isArray(r)){let n=i=>r.find(s=>zt(s.lang,i)),o=n(e.language)??n(b.language);if(o)return Object.freeze(o)}return{}}function Ui({literals:e,providers:t,settings:r}){function n(c,a){let{country:h,displayOldPrice:l,displayPerUnit:d,displayRecurrence:u,displayTax:m,forceTaxExclusive:f,language:g,promotionCode:_,quantity:P}=r,{displayOldPrice:C=l,displayPerUnit:A=d,displayRecurrence:I=u,displayTax:S=m,forceTaxExclusive:$=f,country:z=h,language:Z=g,perpetual:se,promotionCode:me=_,quantity:J=P,template:we,wcsOsi:Ae,...ae}=Object.assign({},a?.dataset??{},c??{}),Q=Ye({...ae,country:z,displayOldPrice:w(C),displayPerUnit:w(A),displayRecurrence:w(I),displayTax:w(S),forceTaxExclusive:w($),language:Z,perpetual:w(se),promotionCode:dt(me).effectivePromoCode,quantity:Qe(J,b.quantity),template:we,wcsOsi:ar(Ae)});if(a)for(let Ge of t.price)Ge(a,Q);return Q}function o(c,a){if(!Array.isArray(c)||!c.length||!a)return"";let{template:h}=a,l;switch(h){case"discount":l=wn;break;case"strikethrough":l=bn;break;case"optical":l=En;break;case"annual":l=_n;break;default:l=a.promotionCode?yn:vn}let d=n(a);d.literals=Object.assign({},e.price,Ye(a.literals??{}));let[u]=c;return u={...u,...u.priceDetails},l(d,u)}let{createInlinePrice:i,getInlinePrices:s}=Fn;return{InlinePrice:Fn,buildPriceHTML:o,collectPriceOptions:n,createInlinePrice:i,getInlinePrices:s}}function Di({settings:e}){let t=F.module("wcs"),{env:r,wcsApiKey:n}=e,o=new Map,i=new Map,s;async function c(l,d,u=!0){let m=An;t.debug("Fetching:",l);try{l.offerSelectorIds=l.offerSelectorIds.sort();let f=new URL(e.wcsURL);f.searchParams.set("offer_selector_ids",l.offerSelectorIds.join(",")),f.searchParams.set("country",l.country),f.searchParams.set("locale",l.locale),f.searchParams.set("landscape",r===Oe.STAGE?"ALL":e.landscape),f.searchParams.set("api_key",n),l.language&&f.searchParams.set("language",l.language),l.promotionCode&&f.searchParams.set("promotion_code",l.promotionCode),l.currency&&f.searchParams.set("currency",l.currency);let g=await fetch(f.toString(),{credentials:"omit"});if(g.ok){let _=await g.json();t.debug("Fetched:",l,_);let P=_.resolvedOffers??[];P=P.map(Kr),d.forEach(({resolve:C},A)=>{let I=P.filter(({offerSelectorIds:S})=>S.includes(A)).flat();I.length&&(d.delete(A),C(I))})}else g.status===404&&l.offerSelectorIds.length>1?(t.debug("Multi-osi 404, fallback to fetch-by-one strategy"),await Promise.allSettled(l.offerSelectorIds.map(_=>c({...l,offerSelectorIds:[_]},d,!1)))):(m=nr,t.error(m,l))}catch(f){m=nr,t.error(m,l,f)}u&&d.size&&(t.debug("Missing:",{offerSelectorIds:[...d.keys()]}),d.forEach(f=>{f.reject(new Error(m))}))}function a(){clearTimeout(s);let l=[...i.values()];i.clear(),l.forEach(({options:d,promises:u})=>c(d,u))}function h({country:l,language:d,perpetual:u=!1,promotionCode:m="",wcsOsi:f=[]}){let g=`${d}_${l}`;l!=="GB"&&(d=u?"EN":"MULT");let _=[l,d,m].filter(P=>P).join("-").toLowerCase();return f.map(P=>{let C=`${P}-${_}`;if(!o.has(C)){let A=new Promise((I,S)=>{let $=i.get(_);if(!$){let z={country:l,locale:g,offerSelectorIds:[]};l!=="GB"&&(z.language=d),$={options:z,promises:new Map},i.set(_,$)}m&&($.options.promotionCode=m),$.options.offerSelectorIds.push(P),$.promises.set(P,{resolve:I,reject:S}),$.options.offerSelectorIds.length>=e.wcsBufferLimit?a():(t.debug("Queued:",$.options),s||(s=setTimeout(a,e.wcsBufferDelay)))});o.set(C,A)}return o.get(C)})}return{WcsCommitment:Ei,WcsPlanType:bi,WcsTerm:_i,resolveOfferSelectors:h}}var j=class extends HTMLElement{get isWcmsCommerce(){return!0}};O(j,"instance"),O(j,"promise",null);window.customElements.define(ge,j);async function Rc(e,t){let r=F.init(e.env).module("service");r.debug("Activating:",e);let n={price:{}},o=Object.freeze(Ti(e));try{n.price=await Mi(o)}catch(a){r.warn("Price literals were not fetched:",a)}let i={checkout:new Set,price:new Set},s=document.createElement(ge),c={literals:n,providers:i,settings:o};return j.instance=Object.defineProperties(s,Object.getOwnPropertyDescriptors({...Ii(c,t),...ki(c),...Ui(c),...Di(c),...Ln,Log:F,get defaults(){return b},get literals(){return n},get log(){return F},get providers(){return{checkout(a){return i.checkout.add(a),()=>i.checkout.delete(a)},price(a){return i.price.add(a),()=>i.price.delete(a)}}},get settings(){return o}})),r.debug("Activated:",{literals:n,settings:o,element:s}),document.head.append(s),xe(()=>{let a=new CustomEvent(Ze,{bubbles:!0,cancelable:!1,detail:j.instance});j.instance.dispatchEvent(a)}),j.instance}function Fi(){document.head.querySelector(ge)?.remove(),j.promise=null,F.reset()}function bt(e,t){let r=pe(e)?e():null,n=pe(t)?t():{};return r&&(n.force&&Fi(),Rc(r,n).then(o=>{bt.resolve(o)})),j.promise??(j.promise=new Promise(o=>{bt.resolve=o})),j.promise}var xr=window,yr=xr.ShadowRoot&&(xr.ShadyCSS===void 0||xr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,zi=Symbol(),Hi=new WeakMap,vr=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==zi)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(yr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=Hi.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&Hi.set(r,t))}return t}toString(){return this.cssText}},Gi=e=>new vr(typeof e=="string"?e:e+"",void 0,zi);var Hn=(e,t)=>{yr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=xr.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},Er=yr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return Gi(r)})(e):e;var zn,br=window,Vi=br.trustedTypes,Ic=Vi?Vi.emptyScript:"",ji=br.reactiveElementPolyfillSupport,Vn={toAttribute(e,t){switch(t){case Boolean:e=e?Ic:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},Bi=(e,t)=>t!==e&&(t==t||e==e),Gn={attribute:!0,type:String,converter:Vn,reflect:!1,hasChanged:Bi},jn="finalized",Ne=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=Gn){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Gn}static finalize(){if(this.hasOwnProperty(jn))return!1;this[jn]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(Er(o))}else t!==void 0&&r.push(Er(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Hn(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=Gn){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:Vn).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),c=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:Vn;this._$El=i,this[i]=c.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||Bi)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Ne[jn]=!0,Ne.elementProperties=new Map,Ne.elementStyles=[],Ne.shadowRootOptions={mode:"open"},ji?.({ReactiveElement:Ne}),((zn=br.reactiveElementVersions)!==null&&zn!==void 0?zn:br.reactiveElementVersions=[]).push("1.6.3");var Bn,_r=window,tt=_r.trustedTypes,Wi=tt?tt.createPolicy("lit-html",{createHTML:e=>e}):void 0,qn="$lit$",ve=`lit$${(Math.random()+"").slice(9)}$`,Ki="?"+ve,kc=`<${Ki}>`,ke=document,wr=()=>ke.createComment(""),wt=e=>e===null||typeof e!="object"&&typeof e!="function",es=Array.isArray,Mc=e=>es(e)||typeof e?.[Symbol.iterator]=="function",Wn=`[ 	
\f\r]`,_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qi=/-->/g,Yi=/>/g,Re=RegExp(`>|${Wn}(?:([^\\s"'>=/]+)(${Wn}*=${Wn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xi=/'/g,Zi=/"/g,ts=/^(?:script|style|textarea|title)$/i,rs=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),nu=rs(1),ou=rs(2),At=Symbol.for("lit-noChange"),M=Symbol.for("lit-nothing"),Ji=new WeakMap,Ie=ke.createTreeWalker(ke,129,null,!1);function ns(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Wi!==void 0?Wi.createHTML(t):t}var Uc=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=_t;for(let c=0;c<r;c++){let a=e[c],h,l,d=-1,u=0;for(;u<a.length&&(s.lastIndex=u,l=s.exec(a),l!==null);)u=s.lastIndex,s===_t?l[1]==="!--"?s=qi:l[1]!==void 0?s=Yi:l[2]!==void 0?(ts.test(l[2])&&(o=RegExp("</"+l[2],"g")),s=Re):l[3]!==void 0&&(s=Re):s===Re?l[0]===">"?(s=o??_t,d=-1):l[1]===void 0?d=-2:(d=s.lastIndex-l[2].length,h=l[1],s=l[3]===void 0?Re:l[3]==='"'?Zi:Xi):s===Zi||s===Xi?s=Re:s===qi||s===Yi?s=_t:(s=Re,o=void 0);let m=s===Re&&e[c+1].startsWith("/>")?" ":"";i+=s===_t?a+kc:d>=0?(n.push(h),a.slice(0,d)+qn+a.slice(d)+ve+m):a+ve+(d===-2?(n.push(void 0),c):m)}return[ns(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},St=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,c=t.length-1,a=this.parts,[h,l]=Uc(t,r);if(this.el=e.createElement(h,n),Ie.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(o=Ie.nextNode())!==null&&a.length<c;){if(o.nodeType===1){if(o.hasAttributes()){let d=[];for(let u of o.getAttributeNames())if(u.endsWith(qn)||u.startsWith(ve)){let m=l[s++];if(d.push(u),m!==void 0){let f=o.getAttribute(m.toLowerCase()+qn).split(ve),g=/([.?@])?(.*)/.exec(m);a.push({type:1,index:i,name:g[2],strings:f,ctor:g[1]==="."?Xn:g[1]==="?"?Zn:g[1]==="@"?Jn:nt})}else a.push({type:6,index:i})}for(let u of d)o.removeAttribute(u)}if(ts.test(o.tagName)){let d=o.textContent.split(ve),u=d.length-1;if(u>0){o.textContent=tt?tt.emptyScript:"";for(let m=0;m<u;m++)o.append(d[m],wr()),Ie.nextNode(),a.push({type:2,index:++i});o.append(d[u],wr())}}}else if(o.nodeType===8)if(o.data===Ki)a.push({type:2,index:i});else{let d=-1;for(;(d=o.data.indexOf(ve,d+1))!==-1;)a.push({type:7,index:i}),d+=ve.length-1}i++}}static createElement(t,r){let n=ke.createElement("template");return n.innerHTML=t,n}};function rt(e,t,r=e,n){var o,i,s,c;if(t===At)return t;let a=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,h=wt(t)?void 0:t._$litDirective$;return a?.constructor!==h&&((i=a?._$AO)===null||i===void 0||i.call(a,!1),h===void 0?a=void 0:(a=new h(e),a._$AT(e,r,n)),n!==void 0?((s=(c=r)._$Co)!==null&&s!==void 0?s:c._$Co=[])[n]=a:r._$Cl=a),a!==void 0&&(t=rt(e,a._$AS(e,t.values),a,n)),t}var Yn=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:ke).importNode(n,!0);Ie.currentNode=i;let s=Ie.nextNode(),c=0,a=0,h=o[0];for(;h!==void 0;){if(c===h.index){let l;h.type===2?l=new Ar(s,s.nextSibling,this,t):h.type===1?l=new h.ctor(s,h.name,h.strings,this,t):h.type===6&&(l=new Qn(s,this,t)),this._$AV.push(l),h=o[++a]}c!==h?.index&&(s=Ie.nextNode(),c++)}return Ie.currentNode=ke,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Ar=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=M,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=rt(this,t,r),wt(t)?t===M||t==null||t===""?(this._$AH!==M&&this._$AR(),this._$AH=M):t!==this._$AH&&t!==At&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Mc(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==M&&wt(this._$AH)?this._$AA.nextSibling.data=t:this.$(ke.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=St.createElement(ns(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new Yn(i,this),c=s.u(this.options);s.v(n),this.$(c),this._$AH=s}}_$AC(t){let r=Ji.get(t.strings);return r===void 0&&Ji.set(t.strings,r=new St(t)),r}T(t){es(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(wr()),this.k(wr()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},nt=class{constructor(t,r,n,o,i){this.type=1,this._$AH=M,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=M}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=rt(this,t,r,0),s=!wt(t)||t!==this._$AH&&t!==At,s&&(this._$AH=t);else{let c=t,a,h;for(t=i[0],a=0;a<i.length-1;a++)h=rt(this,c[n+a],r,a),h===At&&(h=this._$AH[a]),s||(s=!wt(h)||h!==this._$AH[a]),h===M?t=M:t!==M&&(t+=(h??"")+i[a+1]),this._$AH[a]=h}s&&!o&&this.j(t)}j(t){t===M?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Xn=class extends nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===M?void 0:t}},Dc=tt?tt.emptyScript:"",Zn=class extends nt{constructor(){super(...arguments),this.type=4}j(t){t&&t!==M?this.element.setAttribute(this.name,Dc):this.element.removeAttribute(this.name)}},Jn=class extends nt{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=rt(this,t,r,0))!==null&&n!==void 0?n:M)===At)return;let o=this._$AH,i=t===M&&o!==M||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==M&&(o===M||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},Qn=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}};var Qi=_r.litHtmlPolyfillSupport;Qi?.(St,Ar),((Bn=_r.litHtmlVersions)!==null&&Bn!==void 0?Bn:_r.litHtmlVersions=[]).push("2.8.0");var Sr=window,Tr=Sr.ShadowRoot&&(Sr.ShadyCSS===void 0||Sr.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Kn=Symbol(),os=new WeakMap,Tt=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==Kn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(Tr&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=os.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&os.set(r,t))}return t}toString(){return this.cssText}},ye=e=>new Tt(typeof e=="string"?e:e+"",void 0,Kn),Me=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((n,o,i)=>n+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new Tt(r,e,Kn)},eo=(e,t)=>{Tr?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=Sr.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},Pr=Tr?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return ye(r)})(e):e;var to,Cr=window,is=Cr.trustedTypes,Fc=is?is.emptyScript:"",ss=Cr.reactiveElementPolyfillSupport,no={toAttribute(e,t){switch(t){case Boolean:e=e?Fc:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},as=(e,t)=>t!==e&&(t==t||e==e),ro={attribute:!0,type:String,converter:no,reflect:!1,hasChanged:as},oo="finalized",de=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=ro){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||ro}static finalize(){if(this.hasOwnProperty(oo))return!1;this[oo]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(Pr(o))}else t!==void 0&&r.push(Pr(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return eo(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=ro){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:no).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),c=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:no;this._$El=i,this[i]=c.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||as)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};de[oo]=!0,de.elementProperties=new Map,de.elementStyles=[],de.shadowRootOptions={mode:"open"},ss?.({ReactiveElement:de}),((to=Cr.reactiveElementVersions)!==null&&to!==void 0?to:Cr.reactiveElementVersions=[]).push("1.6.3");var io,$r=window,ot=$r.trustedTypes,cs=ot?ot.createPolicy("lit-html",{createHTML:e=>e}):void 0,ao="$lit$",Ee=`lit$${(Math.random()+"").slice(9)}$`,fs="?"+Ee,Hc=`<${fs}>`,Fe=document,Ct=()=>Fe.createComment(""),$t=e=>e===null||typeof e!="object"&&typeof e!="function",gs=Array.isArray,zc=e=>gs(e)||typeof e?.[Symbol.iterator]=="function",so=`[ 	
\f\r]`,Pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ls=/-->/g,hs=/>/g,Ue=RegExp(`>|${so}(?:([^\\s"'>=/]+)(${so}*=${so}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ds=/'/g,us=/"/g,xs=/^(?:script|style|textarea|title)$/i,vs=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),x=vs(1),hu=vs(2),He=Symbol.for("lit-noChange"),U=Symbol.for("lit-nothing"),ms=new WeakMap,De=Fe.createTreeWalker(Fe,129,null,!1);function ys(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return cs!==void 0?cs.createHTML(t):t}var Gc=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=Pt;for(let c=0;c<r;c++){let a=e[c],h,l,d=-1,u=0;for(;u<a.length&&(s.lastIndex=u,l=s.exec(a),l!==null);)u=s.lastIndex,s===Pt?l[1]==="!--"?s=ls:l[1]!==void 0?s=hs:l[2]!==void 0?(xs.test(l[2])&&(o=RegExp("</"+l[2],"g")),s=Ue):l[3]!==void 0&&(s=Ue):s===Ue?l[0]===">"?(s=o??Pt,d=-1):l[1]===void 0?d=-2:(d=s.lastIndex-l[2].length,h=l[1],s=l[3]===void 0?Ue:l[3]==='"'?us:ds):s===us||s===ds?s=Ue:s===ls||s===hs?s=Pt:(s=Ue,o=void 0);let m=s===Ue&&e[c+1].startsWith("/>")?" ":"";i+=s===Pt?a+Hc:d>=0?(n.push(h),a.slice(0,d)+ao+a.slice(d)+Ee+m):a+Ee+(d===-2?(n.push(void 0),c):m)}return[ys(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},Ot=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,c=t.length-1,a=this.parts,[h,l]=Gc(t,r);if(this.el=e.createElement(h,n),De.currentNode=this.el.content,r===2){let d=this.el.content,u=d.firstChild;u.remove(),d.append(...u.childNodes)}for(;(o=De.nextNode())!==null&&a.length<c;){if(o.nodeType===1){if(o.hasAttributes()){let d=[];for(let u of o.getAttributeNames())if(u.endsWith(ao)||u.startsWith(Ee)){let m=l[s++];if(d.push(u),m!==void 0){let f=o.getAttribute(m.toLowerCase()+ao).split(Ee),g=/([.?@])?(.*)/.exec(m);a.push({type:1,index:i,name:g[2],strings:f,ctor:g[1]==="."?lo:g[1]==="?"?ho:g[1]==="@"?uo:st})}else a.push({type:6,index:i})}for(let u of d)o.removeAttribute(u)}if(xs.test(o.tagName)){let d=o.textContent.split(Ee),u=d.length-1;if(u>0){o.textContent=ot?ot.emptyScript:"";for(let m=0;m<u;m++)o.append(d[m],Ct()),De.nextNode(),a.push({type:2,index:++i});o.append(d[u],Ct())}}}else if(o.nodeType===8)if(o.data===fs)a.push({type:2,index:i});else{let d=-1;for(;(d=o.data.indexOf(Ee,d+1))!==-1;)a.push({type:7,index:i}),d+=Ee.length-1}i++}}static createElement(t,r){let n=Fe.createElement("template");return n.innerHTML=t,n}};function it(e,t,r=e,n){var o,i,s,c;if(t===He)return t;let a=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,h=$t(t)?void 0:t._$litDirective$;return a?.constructor!==h&&((i=a?._$AO)===null||i===void 0||i.call(a,!1),h===void 0?a=void 0:(a=new h(e),a._$AT(e,r,n)),n!==void 0?((s=(c=r)._$Co)!==null&&s!==void 0?s:c._$Co=[])[n]=a:r._$Cl=a),a!==void 0&&(t=it(e,a._$AS(e,t.values),a,n)),t}var co=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:Fe).importNode(n,!0);De.currentNode=i;let s=De.nextNode(),c=0,a=0,h=o[0];for(;h!==void 0;){if(c===h.index){let l;h.type===2?l=new Lt(s,s.nextSibling,this,t):h.type===1?l=new h.ctor(s,h.name,h.strings,this,t):h.type===6&&(l=new mo(s,this,t)),this._$AV.push(l),h=o[++a]}c!==h?.index&&(s=De.nextNode(),c++)}return De.currentNode=Fe,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Lt=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=U,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=it(this,t,r),$t(t)?t===U||t==null||t===""?(this._$AH!==U&&this._$AR(),this._$AH=U):t!==this._$AH&&t!==He&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):zc(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==U&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.$(Fe.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=Ot.createElement(ys(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new co(i,this),c=s.u(this.options);s.v(n),this.$(c),this._$AH=s}}_$AC(t){let r=ms.get(t.strings);return r===void 0&&ms.set(t.strings,r=new Ot(t)),r}T(t){gs(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(Ct()),this.k(Ct()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},st=class{constructor(t,r,n,o,i){this.type=1,this._$AH=U,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=U}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=it(this,t,r,0),s=!$t(t)||t!==this._$AH&&t!==He,s&&(this._$AH=t);else{let c=t,a,h;for(t=i[0],a=0;a<i.length-1;a++)h=it(this,c[n+a],r,a),h===He&&(h=this._$AH[a]),s||(s=!$t(h)||h!==this._$AH[a]),h===U?t=U:t!==U&&(t+=(h??"")+i[a+1]),this._$AH[a]=h}s&&!o&&this.j(t)}j(t){t===U?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},lo=class extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===U?void 0:t}},Vc=ot?ot.emptyScript:"",ho=class extends st{constructor(){super(...arguments),this.type=4}j(t){t&&t!==U?this.element.setAttribute(this.name,Vc):this.element.removeAttribute(this.name)}},uo=class extends st{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=it(this,t,r,0))!==null&&n!==void 0?n:U)===He)return;let o=this._$AH,i=t===U&&o!==U||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==U&&(o===U||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},mo=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}};var ps=$r.litHtmlPolyfillSupport;ps?.(Ot,Lt),((io=$r.litHtmlVersions)!==null&&io!==void 0?io:$r.litHtmlVersions=[]).push("2.8.0");var Es=(e,t,r)=>{var n,o;let i=(n=r?.renderBefore)!==null&&n!==void 0?n:t,s=i._$litPart$;if(s===void 0){let c=(o=r?.renderBefore)!==null&&o!==void 0?o:null;i._$litPart$=s=new Lt(t.insertBefore(Ct(),c),c,void 0,r??{})}return s._$AI(e),s};var po,fo;var ie=class extends de{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Es(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return He}};ie.finalized=!0,ie._$litElement$=!0,(po=globalThis.litElementHydrateSupport)===null||po===void 0||po.call(globalThis,{LitElement:ie});var bs=globalThis.litElementPolyfillSupport;bs?.({LitElement:ie});((fo=globalThis.litElementVersions)!==null&&fo!==void 0?fo:globalThis.litElementVersions=[]).push("3.3.3");var Nt="(max-width: 767px)",Rt="(max-width: 1199px)",B="(min-width: 768px)",H="(min-width: 1200px)",q="(min-width: 1600px)";var _s=Me`
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

    @media screen and ${ye(Rt)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${ye(H)} {
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
`,ws=()=>{let e=[Me`
        /* Tablet */
        @media screen and ${ye(B)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                grid-column: span 3;
                width: 100%;
                max-width: var(--consonant-merch-card-tablet-wide-width);
                margin: 0 auto;
            }
        }

        /* Laptop */
        @media screen and ${ye(H)} {
            :host([size='super-wide']) {
                grid-column: span 3;
            }
        `];return e.push(Me`
        /* Large desktop */
        @media screen and ${ye(q)} {
            :host([size='super-wide']) {
                grid-column: span 4;
            }
        }
    `),e};function be(e,t={},r){let n=document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[o,i]of Object.entries(t))n.setAttribute(o,i);return n}function As(){return window.matchMedia("(max-width: 767px)").matches}function Ss(){return window.matchMedia("(max-width: 1024px)").matches}function Ts(e=1e3){return new Promise(t=>setTimeout(t,e))}var Ps=document.createElement("style");Ps.innerHTML=`
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

/* mini compare tablet */
@media screen and ${Rt} {
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
@media screen and ${Nt} {
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
@media screen and ${H} {
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
@media screen and ${H} {
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
@media screen and ${H} {
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
@media screen and ${H} {
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
@media screen and ${H} {
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
@media screen and ${H} {
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
@media screen and ${H} {
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
@media screen and ${H} {
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
@media screen and ${Nt} {
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
@media screen and ${H} {
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
@media screen and ${H} {
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

@media screen and ${Nt} {
    .two-merch-cards.mini-compare-chart,
    .three-merch-cards.mini-compare-chart,
    .four-merch-cards.mini-compare-chart {
        grid-template-columns: var(--consonant-merch-card-mini-compare-chart-width);
        gap: var(--consonant-merch-spacing-xs);
    }
}

@media screen and ${Rt} {
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
@media screen and ${H} {
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
`;document.head.appendChild(Ps);var Cs="merch-offer-select:ready",$s="merch-card:ready",Os="merch-card:action-menu-toggle";var go="merch-storage:change",xo="merch-quantity-selector:change";var jc="merch-card",Bc=32,Or="mini-compare-chart",Ls=e=>`--consonant-merch-card-footer-row-${e}-min-height`,ue,It=class extends ie{constructor(){super();O(this,"customerSegment");O(this,"marketSegment");K(this,ue);this.filters={},this.types="",this.selected=!1}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&(this.style.border=this.computedBorderStyle),this.updateComplete.then(async()=>{let o=Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]')).filter(i=>!i.closest('[slot="callout-content"]'));await Promise.all(o.map(i=>i.onceSettled())),this.adjustTitleWidth(),As()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())})}get computedBorderStyle(){return this.variant!=="twp"?`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`:""}get evergreen(){return this.classList.contains("intro-pricing")}get stockCheckbox(){return this.checkboxLabel?x`<label id="stock-checkbox">
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
        `}get badgeElement(){return this.shadowRoot.getElementById("badge")}getContainer(){return this.closest('[class*="-merch-cards"]')??this.parentElement}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let i=o.value?.[0]?.planType;if(!i)return;let s=this.stockOfferOsis[i];if(!s)return;let c=o.dataset.wcsOsi.split(",").filter(a=>a!==s);r.checked&&c.push(s),o.dataset.wcsOsi=c.join(",")}}toggleActionMenu(r){let n=r?.type==="mouseleave"?!0:void 0,o=this.shadowRoot.querySelector('slot[name="action-menu-content"]');o&&(n||this.dispatchEvent(new CustomEvent(Os,{bubbles:!0,composed:!0,detail:{card:this.name,type:"action-menu"}})),o.classList.toggle("hidden",n))}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.variant==="special-offers"?this.querySelector('[slot="detail-m"]'):this.querySelector('[slot="heading-xs"]')}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let i=n[o].order;i===1||isNaN(i)||(n[o].order=Number(i)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}render(){if(!(!this.isConnected||this.style.display==="none"))switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"image":return this.renderImage();case"product":return this.renderProduct();case"inline-heading":return this.renderInlineHeading();case Or:return this.renderMiniCompareChart();case"ccd-action":return this.renderCcdAction();case"twp":return this.renderTwp();default:return this.renderProduct()}}renderSpecialOffer(){return x`${this.cardImage}
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
                        ${Ss()&&this.actionMenu?"always-visible":""}
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
        </div>`}connectedCallback(){super.connectedCallback(),ee(this,ue,this.getContainer()),this.setAttribute("tabindex",this.getAttribute("tabindex")??"0"),this.addEventListener("mouseleave",this.toggleActionMenu),this.addEventListener(xo,this.handleQuantitySelection),this.addEventListener(Cs,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(xo,this.handleQuantitySelection),this.storageOptions?.removeEventListener(go,this.handleStorageChange)}updateMiniCompareElementMinHeight(r,n){let o=`--consonant-merch-card-mini-compare-${n}-height`,i=Math.max(0,parseInt(window.getComputedStyle(r).height)||0),s=parseInt(R(this,ue).style.getPropertyValue(o))||0;i>s&&R(this,ue).style.setProperty(o,`${i}px`)}async adjustTitleWidth(){if(!["segment","plans"].includes(this.variant))return;let r=this.getBoundingClientRect().width,n=this.badgeElement?.getBoundingClientRect().width||0;r===0||n===0||this.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(r-n-16)}px`)}async adjustMiniCompareBodySlots(){if(this.variant!==Or||this.getBoundingClientRect().width===0)return;this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","price-commitment","offers","promo-text","callout-content","secure-transaction-label"].forEach(o=>this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector("footer"),"footer");let n=this.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&R(this,ue).style.setProperty("--consonant-merch-card-mini-compare-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.variant!==Or||this.getBoundingClientRect().width===0)return;[...this.querySelector('[slot="footer-rows"]').children].forEach((n,o)=>{let i=Math.max(Bc,parseInt(window.getComputedStyle(n).height)||0),s=parseInt(R(this,ue).style.getPropertyValue(Ls(o+1)))||0;i>s&&R(this,ue).style.setProperty(Ls(o+1),`${i}px`)})}removeEmptyRows(){if(this.variant!==Or)return;this.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent($s,{bubbles:!0}))}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(go,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let o=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(o)}):n.replaceWith(o)}}};ue=new WeakMap,O(It,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},borderColor:{type:String,attribute:"border-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},customHr:{type:Boolean,attribute:"custom-hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[n,o,i]=r.split(",");return{PUF:n,ABM:o,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,i,s]=n.split(":"),c=Number(i);return[o,{order:isNaN(c)?void 0:c,size:s}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:i}])=>[n,o,i].filter(s=>s!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object}}),O(It,"styles",[_s,...ws()]);customElements.define(jc,It);var at=class extends ie{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?x`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:x` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};O(at,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),O(at,"styles",Me`
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
    `);customElements.define("merch-icon",at);var Y=class extends Error{constructor(t,r={}){super(t),this.name="AEMError",this.details=r}},kt,Lr=class{constructor(t){K(this,kt);O(this,"sites",{cf:{fragments:{search:this.searchFragment.bind(this),getByPath:this.getFragmentByPath.bind(this),getById:this.getFragmentById.bind(this),save:this.saveFragment.bind(this),copy:this.copyFragmentClassic.bind(this),publish:this.publishFragment.bind(this),delete:this.deleteFragment.bind(this)}}});ee(this,kt,/^author-/.test(t));let r=`https://${t}.adobeaemcloud.com`,n=`${r}/adobe/sites`;this.cfFragmentsUrl=`${n}/cf/fragments`,this.cfSearchUrl=`${this.cfFragmentsUrl}/search`,this.cfPublishUrl=`${this.cfFragmentsUrl}/publish`,this.wcmcommandUrl=`${r}/bin/wcmcommand`,this.csrfTokenUrl=`${r}/libs/granite/csrf/token.json`,this.headers={Authorization:`Bearer ${sessionStorage.getItem("masAccessToken")??window.adobeid?.authorize?.()}`,pragma:"no-cache","cache-control":"no-cache"}}async getCsrfToken(){let t=await fetch(this.csrfTokenUrl,{headers:this.headers});if(!t.ok)throw new Y(`Failed to get CSRF token: ${t.status} ${t.statusText}`);let{token:r}=await t.json();return r}async searchFragment({path:t,query:r,variant:n}){let o={};t&&(o.path=t),r&&(o.fullText={text:encodeURIComponent(r),queryMode:"EXACT_WORDS"});let i=new URLSearchParams({query:JSON.stringify({filter:o})}).toString(),s=await fetch(`${this.cfSearchUrl}?${i}`,{headers:this.headers});if(!s.ok)throw new Y(`Search failed: ${s.status} ${s.statusText}`);let a=(await s.json()).items;return n&&(a=a.filter(h=>{let[l]=h.fields.find(d=>d.name==="variant")?.values;return l===n})),a}async getFragmentByPath(t){let r=R(this,kt)?this.headers:{},n=await fetch(`${this.cfFragmentsUrl}?path=${t}`,{headers:r});if(!n.ok)throw new Y(`Failed to get fragment: ${n.status} ${n.statusText}`);let{items:o}=await n.json();if(!o||o.length===0)throw new Y("Fragment not found");return o[0]}async getFragment(t){let r=t.headers.get("Etag"),n=await t.json();return n.etag=r,n}async getFragmentById(t){let r=await fetch(`${this.cfFragmentsUrl}/${t}`,{headers:this.headers});if(!r.ok)throw new Y(`Failed to get fragment: ${r.status} ${r.statusText}`);return await this.getFragment(r)}async saveFragment(t){let{title:r,fields:n}=t,o=await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({title:r,fields:n})});if(!o.ok)throw new Y(`Failed to save fragment: ${o.status} ${o.statusText}`);return await this.getFragment(o)}async copyFragmentClassic(t){let r=await this.getCsrfToken(),n=t.path.split("/").slice(0,-1).join("/"),o=new FormData;o.append("cmd","copyPage"),o.append("srcPath",t.path),o.append("destParentPath",n),o.append("shallow","false"),o.append("_charset_","UTF-8");let i=await fetch(this.wcmcommandUrl,{method:"POST",headers:{...this.headers,"csrf-token":r},body:o});if(!i.ok)throw new Y(`Failed to copy fragment: ${i.status} ${i.statusText}`);let s=await i.text(),l=new DOMParser().parseFromString(s,"text/html").getElementById("Message")?.textContent.trim();if(!l)throw new Y("Failed to extract new path from copy response");await Ts();let d=await this.getFragmentByPath(l);return d&&(d=await this.getFragmentById(d.id)),d}async publishFragment(t){let r=await fetch(this.cfPublishUrl,{method:"POST",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({paths:[t.path],filterReferencesByStatus:["DRAFT","UNPUBLISHED"],workflowModelId:"/var/workflow/models/scheduled_activation_with_references"})});if(!r.ok)throw new Y(`Failed to publish fragment: ${r.status} ${r.statusText}`)}async deleteFragment(t){let r=await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"DELETE",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers}});if(!r.ok)throw new Y(`Failed to delete fragment: ${r.status} ${r.statusText}`)}};kt=new WeakMap;var Wc="aem-bucket",Nr={CATALOG:"catalog",AH:"ah",CCD_ACTION:"ccd-action",SPECIAL_OFFERS:"special-offers"},qc={[Nr.CATALOG]:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[Nr.AH]:{title:{tag:"h3",slot:"heading-xxs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xxs"},ctas:{size:"s"}},[Nr.CCD_ACTION]:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[Nr.SPECIAL_OFFERS]:{name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}}};async function Yc(e,t,r,n){let o=e.fields.reduce((c,{name:a,multiple:h,values:l})=>(c[a]=h?l:l[0],c),{id:e.id});o.model=o.model;let{variant:i="catalog"}=o;r.setAttribute("variant",i);let s=qc[i]??"catalog";if(o.icon?.forEach(c=>{let a=be("merch-icon",{slot:"icons",src:c,alt:"",href:"",size:"l"});t(a)}),o.title&&s.title&&t(be(s.title.tag,{slot:s.title.slot},o.title)),o.backgroundImage&&s.backgroundImage&&t(be(s.backgroundImage.tag,{slot:s.backgroundImage.slot},`<img loading="lazy" src="${o.backgroundImage}" width="600" height="362">`)),o.prices&&s.prices){let c=o.prices,a=be(s.prices.tag,{slot:s.prices.slot},c);t(a)}if(o.description&&s.description){let c=be(s.description.tag,{slot:s.description.slot},o.description);t(c)}if(o.ctas){let c=be("div",{slot:"footer"},o.ctas),a=[];[...c.querySelectorAll("a")].forEach(h=>{let l=h.parentElement.tagName==="STRONG";if(n)h.classList.add("con-button"),l&&h.classList.add("blue"),a.push(h);else{let m=be("sp-button",{treatment:l?"fill":"outline",variant:l?"accent":"primary"},h);m.addEventListener("click",f=>{f.stopPropagation(),h.click()}),a.push(m)}}),c.innerHTML="",c.append(...a),t(c)}}var _e,yo=class{constructor(){K(this,_e,new Map)}clear(){R(this,_e).clear()}add(...t){t.forEach(r=>{let{path:n}=r;n&&R(this,_e).set(n,r)})}has(t){return R(this,_e).has(t)}get(t){return R(this,_e).get(t)}remove(t){R(this,_e).delete(t)}};_e=new WeakMap;var vo=new yo,Mt,ze,Eo=class extends HTMLElement{constructor(){super(...arguments);K(this,Mt);O(this,"cache",vo);O(this,"refs",[]);O(this,"path");O(this,"consonant",!1);K(this,ze)}static get observedAttributes(){return["source","path","consonant"]}attributeChangedCallback(r,n,o){this[r]=o}connectedCallback(){this.consonant=this.hasAttribute("consonant"),this.clearRefs();let r=this.getAttribute(Wc)??"publish-p22655-e59341";ee(this,Mt,new Lr(r)),this.refresh(!1)}clearRefs(){this.refs.forEach(r=>{r.remove()})}async refresh(r=!0){this.path&&(R(this,ze)&&!await Promise.race([R(this,ze),Promise.resolve(!1)])||(this.clearRefs(),this.refs=[],r&&this.cache.remove(this.path),ee(this,ze,this.fetchData().then(()=>!0))))}async fetchData(){let r=vo.get(this.path);if(r||(r=await R(this,Mt).sites.cf.fragments.getByPath(this.path),vo.add(r)),r){Yc(r,o=>{this.parentElement.appendChild(o),this.refs.push(o)},this.parentElement,this.consonant);return}}get updateComplete(){return R(this,ze)??Promise.reject(new Error("datasource is not correctly configured"))}};Mt=new WeakMap,ze=new WeakMap;customElements.define("merch-datasource",Eo);var{searchParams:Ns}=new URL(import.meta.url),Xc=Ns.get("locale")??"US_en",Rs=Ns.get("env")==="stage",Zc=Rs?"stage":"prod",Jc=Rs?"STAGE":"PROD",Qc=fetch("https://www.adobe.com/federal/commerce/price-literals.json").then(e=>e.json().then(({data:t})=>t)),Kc=()=>({env:{name:Zc},commerce:{"commerce.env":Jc,priceLiteralsPromise:Qc},locale:{prefix:Xc}}),el=bt(Kc),Qu=el;export{Qu as default};
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
