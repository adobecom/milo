var $s=Object.defineProperty;var Dn=e=>{throw TypeError(e)};var Rs=(e,t,r)=>t in e?$s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var p=(e,t,r)=>Rs(e,typeof t!="symbol"?t+"":t,r),dr=(e,t,r)=>t.has(e)||Dn("Cannot "+r);var E=(e,t,r)=>(dr(e,t,"read from private field"),r?r.call(e):t.get(e)),I=(e,t,r)=>t.has(e)?Dn("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),k=(e,t,r,n)=>(dr(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),Z=(e,t,r)=>(dr(e,t,"access private method"),r);(function(){let r={clientId:"",endpoint:"https://www.adobe.com/lana/ll",endpointStage:"https://www.stage.adobe.com/lana/ll",errorType:"e",sampleRate:1,tags:"",implicitSampleRate:1,useProd:!0,isProdDomain:!1},n=window;function o(){let{host:h}=window.location;return h.substring(h.length-10)===".adobe.com"&&h.substring(h.length-15)!==".corp.adobe.com"&&h.substring(h.length-16)!==".stage.adobe.com"}function i(h,m){h||(h={}),m||(m={});function d(u){return h[u]!==void 0?h[u]:m[u]!==void 0?m[u]:r[u]}return Object.keys(r).reduce((u,g)=>(u[g]=d(g),u),{})}function s(h,m){h=h&&h.stack?h.stack:h||"",h.length>2e3&&(h=`${h.slice(0,2e3)}<trunc>`);let d=i(m,n.lana.options);if(!d.clientId){console.warn("LANA ClientID is not set in options.");return}let g=parseInt(new URL(window.location).searchParams.get("lana-sample"),10)||(d.errorType==="i"?d.implicitSampleRate:d.sampleRate);if(!n.lana.debug&&!n.lana.localhost&&g<=Math.random()*100)return;let x=o()||d.isProdDomain,N=!x||!d.useProd?d.endpointStage:d.endpoint,U=[`m=${encodeURIComponent(h)}`,`c=${encodeURI(d.clientId)}`,`s=${g}`,`t=${encodeURI(d.errorType)}`];if(d.tags&&U.push(`tags=${encodeURI(d.tags)}`),(!x||n.lana.debug||n.lana.localhost)&&console.log("LANA Msg: ",h,`
Opts:`,d),!n.lana.localhost||n.lana.debug){let O=new XMLHttpRequest;return n.lana.debug&&(U.push("d"),O.addEventListener("load",()=>{console.log("LANA response:",O.responseText)})),O.open("GET",`${N}?${U.join("&")}`),O.send(),O}}function a(h){s(h.reason||h.error||h.message,{errorType:"i"})}function c(){return n.location.search.toLowerCase().indexOf("lanadebug")!==-1}function l(){return n.location.host.toLowerCase().indexOf("localhost")!==-1}n.lana={debug:!1,log:s,options:i(n.lana&&n.lana.options)},c()&&(n.lana.debug=!0),l()&&(n.lana.localhost=!0),n.addEventListener("error",a),n.addEventListener("unhandledrejection",a)})();var Pt=window,$t=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Gn=Symbol(),zn=new WeakMap,Lt=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==Gn)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if($t&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=zn.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&zn.set(r,t))}return t}toString(){return this.cssText}},Fn=e=>new Lt(typeof e=="string"?e:e+"",void 0,Gn);var mr=(e,t)=>{$t?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=Pt.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},Rt=$t?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return Fn(r)})(e):e;var ur,Nt=window,Vn=Nt.trustedTypes,Ns=Vn?Vn.emptyScript:"",jn=Nt.reactiveElementPolyfillSupport,fr={toAttribute(e,t){switch(t){case Boolean:e=e?Ns:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},Wn=(e,t)=>t!==e&&(t==t||e==e),pr={attribute:!0,type:String,converter:fr,reflect:!1,hasChanged:Wn},gr="finalized",ce=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=pr){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||pr}static finalize(){if(this.hasOwnProperty(gr))return!1;this[gr]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(Rt(o))}else t!==void 0&&r.push(Rt(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return mr(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=pr){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:fr).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:fr;this._$El=i,this[i]=a.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||Wn)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};ce[gr]=!0,ce.elementProperties=new Map,ce.elementStyles=[],ce.shadowRootOptions={mode:"open"},jn?.({ReactiveElement:ce}),((ur=Nt.reactiveElementVersions)!==null&&ur!==void 0?ur:Nt.reactiveElementVersions=[]).push("1.6.3");var xr,Ot=window,Pe=Ot.trustedTypes,Yn=Pe?Pe.createPolicy("lit-html",{createHTML:e=>e}):void 0,br="$lit$",Q=`lit$${(Math.random()+"").slice(9)}$`,eo="?"+Q,Os=`<${eo}>`,de=document,Ht=()=>de.createComment(""),et=e=>e===null||typeof e!="object"&&typeof e!="function",to=Array.isArray,Hs=e=>to(e)||typeof e?.[Symbol.iterator]=="function",vr=`[ 	
\f\r]`,Je=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qn=/-->/g,Xn=/>/g,le=RegExp(`>|${vr}(?:([^\\s"'>=/]+)(${vr}*=${vr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Kn=/'/g,Zn=/"/g,ro=/^(?:script|style|textarea|title)$/i,no=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),Xc=no(1),Kc=no(2),tt=Symbol.for("lit-noChange"),P=Symbol.for("lit-nothing"),Qn=new WeakMap,he=de.createTreeWalker(de,129,null,!1);function oo(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return Yn!==void 0?Yn.createHTML(t):t}var Ms=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=Je;for(let a=0;a<r;a++){let c=e[a],l,h,m=-1,d=0;for(;d<c.length&&(s.lastIndex=d,h=s.exec(c),h!==null);)d=s.lastIndex,s===Je?h[1]==="!--"?s=qn:h[1]!==void 0?s=Xn:h[2]!==void 0?(ro.test(h[2])&&(o=RegExp("</"+h[2],"g")),s=le):h[3]!==void 0&&(s=le):s===le?h[0]===">"?(s=o??Je,m=-1):h[1]===void 0?m=-2:(m=s.lastIndex-h[2].length,l=h[1],s=h[3]===void 0?le:h[3]==='"'?Zn:Kn):s===Zn||s===Kn?s=le:s===qn||s===Xn?s=Je:(s=le,o=void 0);let u=s===le&&e[a+1].startsWith("/>")?" ":"";i+=s===Je?c+Os:m>=0?(n.push(l),c.slice(0,m)+br+c.slice(m)+Q+u):c+Q+(m===-2?(n.push(void 0),a):u)}return[oo(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},rt=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,a=t.length-1,c=this.parts,[l,h]=Ms(t,r);if(this.el=e.createElement(l,n),he.currentNode=this.el.content,r===2){let m=this.el.content,d=m.firstChild;d.remove(),m.append(...d.childNodes)}for(;(o=he.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes()){let m=[];for(let d of o.getAttributeNames())if(d.endsWith(br)||d.startsWith(Q)){let u=h[s++];if(m.push(d),u!==void 0){let g=o.getAttribute(u.toLowerCase()+br).split(Q),x=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:x[2],strings:g,ctor:x[1]==="."?Er:x[1]==="?"?Ar:x[1]==="@"?_r:$e})}else c.push({type:6,index:i})}for(let d of m)o.removeAttribute(d)}if(ro.test(o.tagName)){let m=o.textContent.split(Q),d=m.length-1;if(d>0){o.textContent=Pe?Pe.emptyScript:"";for(let u=0;u<d;u++)o.append(m[u],Ht()),he.nextNode(),c.push({type:2,index:++i});o.append(m[d],Ht())}}}else if(o.nodeType===8)if(o.data===eo)c.push({type:2,index:i});else{let m=-1;for(;(m=o.data.indexOf(Q,m+1))!==-1;)c.push({type:7,index:i}),m+=Q.length-1}i++}}static createElement(t,r){let n=de.createElement("template");return n.innerHTML=t,n}};function Le(e,t,r=e,n){var o,i,s,a;if(t===tt)return t;let c=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,l=et(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,n)),n!==void 0?((s=(a=r)._$Co)!==null&&s!==void 0?s:a._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=Le(e,c._$AS(e,t.values),c,n)),t}var yr=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:de).importNode(n,!0);he.currentNode=i;let s=he.nextNode(),a=0,c=0,l=o[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new Mt(s,s.nextSibling,this,t):l.type===1?h=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(h=new Sr(s,this,t)),this._$AV.push(h),l=o[++c]}a!==l?.index&&(s=he.nextNode(),a++)}return he.currentNode=de,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},Mt=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=P,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Le(this,t,r),et(t)?t===P||t==null||t===""?(this._$AH!==P&&this._$AR(),this._$AH=P):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Hs(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==P&&et(this._$AH)?this._$AA.nextSibling.data=t:this.$(de.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=rt.createElement(oo(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new yr(i,this),a=s.u(this.options);s.v(n),this.$(a),this._$AH=s}}_$AC(t){let r=Qn.get(t.strings);return r===void 0&&Qn.set(t.strings,r=new rt(t)),r}T(t){to(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(Ht()),this.k(Ht()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},$e=class{constructor(t,r,n,o,i){this.type=1,this._$AH=P,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=P}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=Le(this,t,r,0),s=!et(t)||t!==this._$AH&&t!==tt,s&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=Le(this,a[n+c],r,c),l===tt&&(l=this._$AH[c]),s||(s=!et(l)||l!==this._$AH[c]),l===P?t=P:t!==P&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}s&&!o&&this.j(t)}j(t){t===P?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Er=class extends $e{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===P?void 0:t}},Is=Pe?Pe.emptyScript:"",Ar=class extends $e{constructor(){super(...arguments),this.type=4}j(t){t&&t!==P?this.element.setAttribute(this.name,Is):this.element.removeAttribute(this.name)}},_r=class extends $e{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=Le(this,t,r,0))!==null&&n!==void 0?n:P)===tt)return;let o=this._$AH,i=t===P&&o!==P||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==P&&(o===P||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},Sr=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Le(this,t)}};var Jn=Ot.litHtmlPolyfillSupport;Jn?.(rt,Mt),((xr=Ot.litHtmlVersions)!==null&&xr!==void 0?xr:Ot.litHtmlVersions=[]).push("2.8.0");var It=window,kt=It.ShadowRoot&&(It.ShadyCSS===void 0||It.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,wr=Symbol(),io=new WeakMap,nt=class{constructor(t,r,n){if(this._$cssResult$=!0,n!==wr)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=r}get styleSheet(){let t=this.o,r=this.t;if(kt&&t===void 0){let n=r!==void 0&&r.length===1;n&&(t=io.get(r)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&io.set(r,t))}return t}toString(){return this.cssText}},J=e=>new nt(typeof e=="string"?e:e+"",void 0,wr),_=(e,...t)=>{let r=e.length===1?e[0]:t.reduce((n,o,i)=>n+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new nt(r,e,wr)},Tr=(e,t)=>{kt?e.adoptedStyleSheets=t.map(r=>r instanceof CSSStyleSheet?r:r.styleSheet):t.forEach(r=>{let n=document.createElement("style"),o=It.litNonce;o!==void 0&&n.setAttribute("nonce",o),n.textContent=r.cssText,e.appendChild(n)})},Bt=kt?e=>e:e=>e instanceof CSSStyleSheet?(t=>{let r="";for(let n of t.cssRules)r+=n.cssText;return J(r)})(e):e;var Cr,Ut=window,so=Ut.trustedTypes,ks=so?so.emptyScript:"",ao=Ut.reactiveElementPolyfillSupport,Lr={toAttribute(e,t){switch(t){case Boolean:e=e?ks:null;break;case Object:case Array:e=e==null?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=e!==null;break;case Number:r=e===null?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch{r=null}}return r}},co=(e,t)=>t!==e&&(t==t||e==e),Pr={attribute:!0,type:String,converter:Lr,reflect:!1,hasChanged:co},$r="finalized",Y=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var r;this.finalize(),((r=this.h)!==null&&r!==void 0?r:this.h=[]).push(t)}static get observedAttributes(){this.finalize();let t=[];return this.elementProperties.forEach((r,n)=>{let o=this._$Ep(n,r);o!==void 0&&(this._$Ev.set(o,n),t.push(o))}),t}static createProperty(t,r=Pr){if(r.state&&(r.attribute=!1),this.finalize(),this.elementProperties.set(t,r),!r.noAccessor&&!this.prototype.hasOwnProperty(t)){let n=typeof t=="symbol"?Symbol():"__"+t,o=this.getPropertyDescriptor(t,n,r);o!==void 0&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,r,n){return{get(){return this[r]},set(o){let i=this[t];this[r]=o,this.requestUpdate(t,i,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||Pr}static finalize(){if(this.hasOwnProperty($r))return!1;this[$r]=!0;let t=Object.getPrototypeOf(this);if(t.finalize(),t.h!==void 0&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let r=this.properties,n=[...Object.getOwnPropertyNames(r),...Object.getOwnPropertySymbols(r)];for(let o of n)this.createProperty(o,r[o])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){let r=[];if(Array.isArray(t)){let n=new Set(t.flat(1/0).reverse());for(let o of n)r.unshift(Bt(o))}else t!==void 0&&r.push(Bt(t));return r}static _$Ep(t,r){let n=r.attribute;return n===!1?void 0:typeof n=="string"?n:typeof t=="string"?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(r=>this.enableUpdating=r),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(t=this.constructor.h)===null||t===void 0||t.forEach(r=>r(this))}addController(t){var r,n;((r=this._$ES)!==null&&r!==void 0?r:this._$ES=[]).push(t),this.renderRoot!==void 0&&this.isConnected&&((n=t.hostConnected)===null||n===void 0||n.call(t))}removeController(t){var r;(r=this._$ES)===null||r===void 0||r.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,r)=>{this.hasOwnProperty(r)&&(this._$Ei.set(r,this[r]),delete this[r])})}createRenderRoot(){var t;let r=(t=this.shadowRoot)!==null&&t!==void 0?t:this.attachShadow(this.constructor.shadowRootOptions);return Tr(r,this.constructor.elementStyles),r}connectedCallback(){var t;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostConnected)===null||n===void 0?void 0:n.call(r)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostDisconnected)===null||n===void 0?void 0:n.call(r)})}attributeChangedCallback(t,r,n){this._$AK(t,n)}_$EO(t,r,n=Pr){var o;let i=this.constructor._$Ep(t,n);if(i!==void 0&&n.reflect===!0){let s=(((o=n.converter)===null||o===void 0?void 0:o.toAttribute)!==void 0?n.converter:Lr).toAttribute(r,n.type);this._$El=t,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(t,r){var n;let o=this.constructor,i=o._$Ev.get(t);if(i!==void 0&&this._$El!==i){let s=o.getPropertyOptions(i),a=typeof s.converter=="function"?{fromAttribute:s.converter}:((n=s.converter)===null||n===void 0?void 0:n.fromAttribute)!==void 0?s.converter:Lr;this._$El=i,this[i]=a.fromAttribute(r,s.type),this._$El=null}}requestUpdate(t,r,n){let o=!0;t!==void 0&&(((n=n||this.constructor.getPropertyOptions(t)).hasChanged||co)(this[t],r)?(this._$AL.has(t)||this._$AL.set(t,r),n.reflect===!0&&this._$El!==t&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(t,n))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(r){Promise.reject(r)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((o,i)=>this[i]=o),this._$Ei=void 0);let r=!1,n=this._$AL;try{r=this.shouldUpdate(n),r?(this.willUpdate(n),(t=this._$ES)===null||t===void 0||t.forEach(o=>{var i;return(i=o.hostUpdate)===null||i===void 0?void 0:i.call(o)}),this.update(n)):this._$Ek()}catch(o){throw r=!1,this._$Ek(),o}r&&this._$AE(n)}willUpdate(t){}_$AE(t){var r;(r=this._$ES)===null||r===void 0||r.forEach(n=>{var o;return(o=n.hostUpdated)===null||o===void 0?void 0:o.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){this._$EC!==void 0&&(this._$EC.forEach((r,n)=>this._$EO(n,this[n],r)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}};Y[$r]=!0,Y.elementProperties=new Map,Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},ao?.({ReactiveElement:Y}),((Cr=Ut.reactiveElementVersions)!==null&&Cr!==void 0?Cr:Ut.reactiveElementVersions=[]).push("1.6.3");var Rr,Dt=window,Re=Dt.trustedTypes,lo=Re?Re.createPolicy("lit-html",{createHTML:e=>e}):void 0,Or="$lit$",ee=`lit$${(Math.random()+"").slice(9)}$`,xo="?"+ee,Bs=`<${xo}>`,pe=document,it=()=>pe.createComment(""),st=e=>e===null||typeof e!="object"&&typeof e!="function",vo=Array.isArray,Us=e=>vo(e)||typeof e?.[Symbol.iterator]=="function",Nr=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ho=/-->/g,mo=/>/g,me=RegExp(`>|${Nr}(?:([^\\s"'>=/]+)(${Nr}*=${Nr}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),uo=/'/g,po=/"/g,bo=/^(?:script|style|textarea|title)$/i,yo=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),f=yo(1),rl=yo(2),fe=Symbol.for("lit-noChange"),L=Symbol.for("lit-nothing"),fo=new WeakMap,ue=pe.createTreeWalker(pe,129,null,!1);function Eo(e,t){if(!Array.isArray(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return lo!==void 0?lo.createHTML(t):t}var Ds=(e,t)=>{let r=e.length-1,n=[],o,i=t===2?"<svg>":"",s=ot;for(let a=0;a<r;a++){let c=e[a],l,h,m=-1,d=0;for(;d<c.length&&(s.lastIndex=d,h=s.exec(c),h!==null);)d=s.lastIndex,s===ot?h[1]==="!--"?s=ho:h[1]!==void 0?s=mo:h[2]!==void 0?(bo.test(h[2])&&(o=RegExp("</"+h[2],"g")),s=me):h[3]!==void 0&&(s=me):s===me?h[0]===">"?(s=o??ot,m=-1):h[1]===void 0?m=-2:(m=s.lastIndex-h[2].length,l=h[1],s=h[3]===void 0?me:h[3]==='"'?po:uo):s===po||s===uo?s=me:s===ho||s===mo?s=ot:(s=me,o=void 0);let u=s===me&&e[a+1].startsWith("/>")?" ":"";i+=s===ot?c+Bs:m>=0?(n.push(l),c.slice(0,m)+Or+c.slice(m)+ee+u):c+ee+(m===-2?(n.push(void 0),a):u)}return[Eo(e,i+(e[r]||"<?>")+(t===2?"</svg>":"")),n]},at=class e{constructor({strings:t,_$litType$:r},n){let o;this.parts=[];let i=0,s=0,a=t.length-1,c=this.parts,[l,h]=Ds(t,r);if(this.el=e.createElement(l,n),ue.currentNode=this.el.content,r===2){let m=this.el.content,d=m.firstChild;d.remove(),m.append(...d.childNodes)}for(;(o=ue.nextNode())!==null&&c.length<a;){if(o.nodeType===1){if(o.hasAttributes()){let m=[];for(let d of o.getAttributeNames())if(d.endsWith(Or)||d.startsWith(ee)){let u=h[s++];if(m.push(d),u!==void 0){let g=o.getAttribute(u.toLowerCase()+Or).split(ee),x=/([.?@])?(.*)/.exec(u);c.push({type:1,index:i,name:x[2],strings:g,ctor:x[1]==="."?Mr:x[1]==="?"?Ir:x[1]==="@"?kr:Oe})}else c.push({type:6,index:i})}for(let d of m)o.removeAttribute(d)}if(bo.test(o.tagName)){let m=o.textContent.split(ee),d=m.length-1;if(d>0){o.textContent=Re?Re.emptyScript:"";for(let u=0;u<d;u++)o.append(m[u],it()),ue.nextNode(),c.push({type:2,index:++i});o.append(m[d],it())}}}else if(o.nodeType===8)if(o.data===xo)c.push({type:2,index:i});else{let m=-1;for(;(m=o.data.indexOf(ee,m+1))!==-1;)c.push({type:7,index:i}),m+=ee.length-1}i++}}static createElement(t,r){let n=pe.createElement("template");return n.innerHTML=t,n}};function Ne(e,t,r=e,n){var o,i,s,a;if(t===fe)return t;let c=n!==void 0?(o=r._$Co)===null||o===void 0?void 0:o[n]:r._$Cl,l=st(t)?void 0:t._$litDirective$;return c?.constructor!==l&&((i=c?._$AO)===null||i===void 0||i.call(c,!1),l===void 0?c=void 0:(c=new l(e),c._$AT(e,r,n)),n!==void 0?((s=(a=r)._$Co)!==null&&s!==void 0?s:a._$Co=[])[n]=c:r._$Cl=c),c!==void 0&&(t=Ne(e,c._$AS(e,t.values),c,n)),t}var Hr=class{constructor(t,r){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=r}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var r;let{el:{content:n},parts:o}=this._$AD,i=((r=t?.creationScope)!==null&&r!==void 0?r:pe).importNode(n,!0);ue.currentNode=i;let s=ue.nextNode(),a=0,c=0,l=o[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new ct(s,s.nextSibling,this,t):l.type===1?h=new l.ctor(s,l.name,l.strings,this,t):l.type===6&&(h=new Br(s,this,t)),this._$AV.push(h),l=o[++c]}a!==l?.index&&(s=ue.nextNode(),a++)}return ue.currentNode=pe,i}v(t){let r=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(t,n,r),r+=n.strings.length-2):n._$AI(t[r])),r++}},ct=class e{constructor(t,r,n,o){var i;this.type=2,this._$AH=L,this._$AN=void 0,this._$AA=t,this._$AB=r,this._$AM=n,this.options=o,this._$Cp=(i=o?.isConnected)===null||i===void 0||i}get _$AU(){var t,r;return(r=(t=this._$AM)===null||t===void 0?void 0:t._$AU)!==null&&r!==void 0?r:this._$Cp}get parentNode(){let t=this._$AA.parentNode,r=this._$AM;return r!==void 0&&t?.nodeType===11&&(t=r.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,r=this){t=Ne(this,t,r),st(t)?t===L||t==null||t===""?(this._$AH!==L&&this._$AR(),this._$AH=L):t!==this._$AH&&t!==fe&&this._(t):t._$litType$!==void 0?this.g(t):t.nodeType!==void 0?this.$(t):Us(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==L&&st(this._$AH)?this._$AA.nextSibling.data=t:this.$(pe.createTextNode(t)),this._$AH=t}g(t){var r;let{values:n,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=at.createElement(Eo(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)===null||r===void 0?void 0:r._$AD)===i)this._$AH.v(n);else{let s=new Hr(i,this),a=s.u(this.options);s.v(n),this.$(a),this._$AH=s}}_$AC(t){let r=fo.get(t.strings);return r===void 0&&fo.set(t.strings,r=new at(t)),r}T(t){vo(this._$AH)||(this._$AH=[],this._$AR());let r=this._$AH,n,o=0;for(let i of t)o===r.length?r.push(n=new e(this.k(it()),this.k(it()),this,this.options)):n=r[o],n._$AI(i),o++;o<r.length&&(this._$AR(n&&n._$AB.nextSibling,o),r.length=o)}_$AR(t=this._$AA.nextSibling,r){var n;for((n=this._$AP)===null||n===void 0||n.call(this,!1,!0,r);t&&t!==this._$AB;){let o=t.nextSibling;t.remove(),t=o}}setConnected(t){var r;this._$AM===void 0&&(this._$Cp=t,(r=this._$AP)===null||r===void 0||r.call(this,t))}},Oe=class{constructor(t,r,n,o,i){this.type=1,this._$AH=L,this._$AN=void 0,this.element=t,this.name=r,this._$AM=o,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=L}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,r=this,n,o){let i=this.strings,s=!1;if(i===void 0)t=Ne(this,t,r,0),s=!st(t)||t!==this._$AH&&t!==fe,s&&(this._$AH=t);else{let a=t,c,l;for(t=i[0],c=0;c<i.length-1;c++)l=Ne(this,a[n+c],r,c),l===fe&&(l=this._$AH[c]),s||(s=!st(l)||l!==this._$AH[c]),l===L?t=L:t!==L&&(t+=(l??"")+i[c+1]),this._$AH[c]=l}s&&!o&&this.j(t)}j(t){t===L?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Mr=class extends Oe{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===L?void 0:t}},zs=Re?Re.emptyScript:"",Ir=class extends Oe{constructor(){super(...arguments),this.type=4}j(t){t&&t!==L?this.element.setAttribute(this.name,zs):this.element.removeAttribute(this.name)}},kr=class extends Oe{constructor(t,r,n,o,i){super(t,r,n,o,i),this.type=5}_$AI(t,r=this){var n;if((t=(n=Ne(this,t,r,0))!==null&&n!==void 0?n:L)===fe)return;let o=this._$AH,i=t===L&&o!==L||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==L&&(o===L||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var r,n;typeof this._$AH=="function"?this._$AH.call((n=(r=this.options)===null||r===void 0?void 0:r.host)!==null&&n!==void 0?n:this.element,t):this._$AH.handleEvent(t)}},Br=class{constructor(t,r,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=r,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Ne(this,t)}};var go=Dt.litHtmlPolyfillSupport;go?.(at,ct),((Rr=Dt.litHtmlVersions)!==null&&Rr!==void 0?Rr:Dt.litHtmlVersions=[]).push("2.8.0");var Ao=(e,t,r)=>{var n,o;let i=(n=r?.renderBefore)!==null&&n!==void 0?n:t,s=i._$litPart$;if(s===void 0){let a=(o=r?.renderBefore)!==null&&o!==void 0?o:null;i._$litPart$=s=new ct(t.insertBefore(it(),a),a,void 0,r??{})}return s._$AI(e),s};var Ur,Dr;var F=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,r;let n=super.createRenderRoot();return(t=(r=this.renderOptions).renderBefore)!==null&&t!==void 0||(r.renderBefore=n.firstChild),n}update(t){let r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ao(r,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)===null||t===void 0||t.setConnected(!1)}render(){return fe}};F.finalized=!0,F._$litElement$=!0,(Ur=globalThis.litElementHydrateSupport)===null||Ur===void 0||Ur.call(globalThis,{LitElement:F});var _o=globalThis.litElementPolyfillSupport;_o?.({LitElement:F});((Dr=globalThis.litElementVersions)!==null&&Dr!==void 0?Dr:globalThis.litElementVersions=[]).push("3.3.3");var te="(max-width: 767px)",zt="(max-width: 1199px)",T="(min-width: 768px)",w="(min-width: 1200px)",z="(min-width: 1600px)";var So=_`
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
`,wo=()=>[_`
        /* Tablet */
        @media screen and ${J(T)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${J(w)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `];var He,lt=class lt{constructor(t){p(this,"card");I(this,He);this.card=t,this.insertVariantStyle()}getContainer(){return k(this,He,E(this,He)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),E(this,He)}insertVariantStyle(){if(!lt.styleMap[this.card.variant]){lt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,o=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),i=parseInt(this.getContainer().style.getPropertyValue(n))||0;o>i&&this.getContainer().style.setProperty(n,`${o}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),f`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return f` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let t=this.card.secureLabel?f`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return f`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};He=new WeakMap,p(lt,"styleMap",{});var S=lt;function V(e,t={},r=null,n=null){let o=n?document.createElement(e,{is:n}):document.createElement(e);r instanceof HTMLElement?o.appendChild(r):o.innerHTML=r;for(let[i,s]of Object.entries(t))o.setAttribute(i,s);return o}function Gt(){return window.matchMedia("(max-width: 767px)").matches}function To(){return window.matchMedia("(max-width: 1024px)").matches}var zr="wcms:commerce:ready";var Co="merch-offer-select:ready",Po="merch-card:ready",Lo="merch-card:action-menu-toggle";var Gr="merch-storage:change",Fr="merch-quantity-selector:change";var Me="aem:load",Ie="aem:error",$o="mas:ready",Ro="mas:error",No="placeholder-failed",Oo="placeholder-pending",Ho="placeholder-resolved";var Mo="mas:failed",Io="mas:resolved",ko="mas/commerce";var re="failed",ge="pending",ne="resolved",Vr={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var Bo=`
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

@media screen and ${T} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${w} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${z} {
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
}`;var jr={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},ke=class extends S{constructor(r){super(r);p(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Lo,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});p(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let n=this.actionMenuContentSlot.classList.contains("hidden");n||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!n).toString())});p(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(n||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",n),this.setAriaExpanded(this.actionMenu,"false"))});p(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")});p(this,"focusEventHandler",r=>{this.actionMenu&&(this.actionMenu.classList.add("always-visible"),(r.relatedTarget?.nodeName==="MERCH-CARD-COLLECTION"||r.relatedTarget?.nodeName==="MERCH-CARD"&&r.target.nodeName!=="MERCH-ICON")&&this.actionMenu.classList.remove("always-visible"))})}get aemFragmentMapping(){return jr}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return f` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${To()&&this.card.actionMenu?"always-visible":""}
                ${this.card.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        tabindex="0"
                        aria-expanded="false"
                        role="button"
                    >Action Menu</div>
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
                ${this.promoBottom?"":f`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?f`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Bo}setAriaExpanded(r,n){r.setAttribute("aria-expanded",n)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusout",this.focusEventHandler)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusout",this.focusEventHandler)}};p(ke,"variantStyle",_`
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
    `);var Uo=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${T} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${w} {
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
`;var Ft=class extends S{constructor(t){super(t)}getGlobalCSS(){return Uo}renderLayout(){return f`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?f`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:f`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?f`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:f`
              <hr />
              ${this.secureLabelFooter}
          `}`}};var Do=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${T} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${w} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${z} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Vt=class extends S{constructor(t){super(t)}getGlobalCSS(){return Do}renderLayout(){return f` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":f`<hr />`} ${this.secureLabelFooter}`}};var zo=`
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
@media screen and ${te} {
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

@media screen and ${zt} {
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
@media screen and ${T} {
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
@media screen and ${w} {
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

@media screen and ${z} {
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
`;var Gs=32,Be=class extends S{constructor(r){super(r);p(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);p(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?f`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:f`<slot name="secure-transaction-label"></slot>`;return f`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return zo}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(o=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"] ul')?.children].forEach((n,o)=>{let i=Math.max(Gs,parseFloat(window.getComputedStyle(n).height)||0),s=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(o+1)))||0;i>s&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(o+1),`${i}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}renderLayout(){return f` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?f`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>`:f`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){Gt()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};p(Be,"variantStyle",_`
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

    @media screen and ${J(zt)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${J(w)} {
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
  `);var Go=`
:root {
  --consonant-merch-card-plans-width: 300px;
  --consonant-merch-card-plans-icon-size: 40px;
}
  
merch-card[variant="plans"] [slot="description"] {
  min-height: 84px;
}

merch-card[variant="plans"] [slot="quantity-select"] {
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: var(--consonant-merch-spacing-xs);
}

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    grid-template-columns: var(--consonant-merch-card-plans-width);
}

/* Tablet */
@media screen and ${T} {
  :root {
    --consonant-merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
}

/* desktop */
@media screen and ${w} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${z} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var Ue=class extends S{constructor(t){super(t)}getGlobalCSS(){return Go}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?f`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return f` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="body-xxs"></slot>
            ${this.promoBottom?"":f`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
            <slot name="body-xs"></slot>
            ${this.promoBottom?f`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};p(Ue,"variantStyle",_`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var Fo=`
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
@media screen and ${T} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${w} {
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
`;var xe=class extends S{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Fo}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return f` ${this.badge}
      <div class="body" aria-live="polite">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":f`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?f`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(Gt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};p(xe,"variantStyle",_`
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
  `);var Vo=`
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
@media screen and ${te} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${T} {
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
@media screen and ${w} {
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
`;var De=class extends S{constructor(t){super(t)}getGlobalCSS(){return Vo}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return f` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":f`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?f`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};p(De,"variantStyle",_`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);var jo=`
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

@media screen and ${te} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${T} {
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
@media screen and ${w} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${z} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Wr={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ze=class extends S{constructor(t){super(t)}getGlobalCSS(){return jo}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return Wr}renderLayout(){return f`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?f`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:f`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};p(ze,"variantStyle",_`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var Wo=`
:root {
  --consonant-merch-card-twp-width: 268px;
  --consonant-merch-card-twp-mobile-width: 300px;
  --consonant-merch-card-twp-mobile-height: 358px;
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
  padding: var(--consonant-merch-spacing-s);
  var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
  color: var(--merch-color-grey-80);
  display: flex;
  flex-flow: wrap;
}

merch-card[variant='twp'] merch-quantity-select,
merch-card[variant='twp'] merch-offer-select {
  display: none;
}

.one-merch-card.twp,
.two-merch-cards.twp,
.three-merch-cards.twp {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${te} {
  :root {
    --consonant-merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
  }
}

@media screen and ${T} {
  :root {
    --consonant-merch-card-twp-width: 268px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
  
@media screen and ${w} {
  :root {
    --consonant-merch-card-twp-width: 268px;
  }
  .one-merch-card.twp
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}

@media screen and ${z} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`;var Ge=class extends S{constructor(t){super(t)}getGlobalCSS(){return Wo}renderLayout(){return f`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};p(Ge,"variantStyle",_`
    :host([variant='twp']) {
      padding: 4px 10px 5px 10px;
    }
    .twp-badge {
      padding: 4px 10px 5px 10px;
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
    
    :host([aria-selected]) .twp-badge {
        margin-inline-end: 2px;
        padding-inline-end: 9px;
    }

    :host([variant='twp']) footer {
      gap: var(--consonant-merch-spacing-xxs);
      flex-direction: column;
      align-self: flex-start;
    }
  `);var Yo=`

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
`;var Yr={backgroundImage:{attribute:"background-image"},badge:!0,ctas:{slot:"cta",size:"M"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"p",slot:"price"},size:[],subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"}},Fe=class extends S{getGlobalCSS(){return Yo}get aemFragmentMapping(){return Yr}get stripStyle(){return this.card.backgroundImage?`
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir==="ltr"?"left":"right"};
        `:""}renderLayout(){return f` <div style="${this.stripStyle}" class="body">
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
            <slot></slot>`}postCardUpdateHook(t){t.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let t=new Image;t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")}}};p(Fe,"variantStyle",_`
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
    `);var qo=`

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
`;var qr={backgroundImage:{tag:"div",slot:"image"},badge:!0,ctas:{slot:"footer",size:"S"},description:{tag:"div",slot:"body-s"},mnemonics:{size:"m"},size:["wide"]},Ve=class extends S{getGlobalCSS(){return qo}get aemFragmentMapping(){return qr}renderLayout(){return f` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};p(Ve,"variantStyle",_`
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
    `);var Xr=(e,t=!1)=>{switch(e.variant){case"catalog":return new ke(e);case"image":return new Ft(e);case"inline-heading":return new Vt(e);case"mini-compare-chart":return new Be(e);case"plans":return new Ue(e);case"product":return new xe(e);case"segment":return new De(e);case"special-offers":return new ze(e);case"twp":return new Ge(e);case"ccd-suggested":return new Fe(e);case"ccd-slice":return new Ve(e);default:return t?void 0:new xe(e)}},Xo={catalog:jr,image:null,"inline-heading":null,"mini-compare-chart":null,plans:null,product:null,segment:null,"special-offers":Wr,twp:null,"ccd-suggested":Yr,"ccd-slice":qr},Ko=()=>{let e=[];return e.push(ke.variantStyle),e.push(Be.variantStyle),e.push(xe.variantStyle),e.push(Ue.variantStyle),e.push(De.variantStyle),e.push(ze.variantStyle),e.push(Ge.variantStyle),e.push(Fe.variantStyle),e.push(Ve.variantStyle),e};var Zo=document.createElement("style");Zo.innerHTML=`
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
    --consonant-merch-card-detail-s-font-size: 11px;
    --consonant-merch-card-detail-s-line-height: 14px;
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
    --consonant-merch-card-body-xxl-font-size: 24px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --consonant-merch-card-background-color: inherit;
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: rgb(59, 99, 251);
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-10: #f6f6f6;
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

    /* ccd colors */
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;

    
  
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

`;document.head.appendChild(Zo);var ht;(function(e){e.V2="UCv2",e.V3="UCv3"})(ht||(ht={}));var dt;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(dt||(dt={}));var Kr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Kr||(Kr={}));var H;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(H||(H={}));var C;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(C||(C={}));var Zr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Zr||(Zr={}));var Qr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Qr||(Qr={}));var Jr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Jr||(Jr={}));var en;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(en||(en={}));var Qo="tacocat.js";var Jo=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function je(e,t={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let i;if(n&&i==null){let s=new URLSearchParams(window.location.search),a=mt(n)?n:e;i=s.get(a)}if(o&&i==null){let s=mt(o)?o:e;i=window.sessionStorage.getItem(s)??window.localStorage.getItem(s)}if(r&&i==null){let s=Fs(mt(r)?r:e);i=document.documentElement.querySelector(`meta[name="${s}"]`)?.content}return i??t[e]}var We=()=>{};var ei=e=>typeof e=="boolean",ut=e=>typeof e=="function",tn=e=>typeof e=="number",ti=e=>e!=null&&typeof e=="object";var mt=e=>typeof e=="string";var pt=e=>tn(e)&&Number.isFinite(e)&&e>0;function B(e,t){if(ei(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function Fs(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}var Vs=Date.now(),rn=()=>`(+${Date.now()-Vs}ms)`,jt=new Set,js=B(je("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function ri(e){let t=`[${Qo}/${e}]`,r=(s,a,...c)=>s?!0:(o(a,...c),!1),n=js?(s,...a)=>{console.debug(`${t} ${s}`,...a,rn())}:()=>{},o=(s,...a)=>{let c=`${t} ${s}`;jt.forEach(([l])=>l(c,...a))};return{assert:r,debug:n,error:o,warn:(s,...a)=>{let c=`${t} ${s}`;jt.forEach(([,l])=>l(c,...a))}}}function Ws(e,t){let r=[e,t];return jt.add(r),()=>{jt.delete(r)}}Ws((e,...t)=>{console.error(e,...t,rn())},(e,...t)=>{console.warn(e,...t,rn())});var ni="ABM",oi="PUF",ii="M2M",si="PERPETUAL",ai="P3Y",Ys="TAX_INCLUSIVE_DETAILS",qs="TAX_EXCLUSIVE",ci={ABM:ni,PUF:oi,M2M:ii,PERPETUAL:si,P3Y:ai},vd={[ni]:{commitment:H.YEAR,term:C.MONTHLY},[oi]:{commitment:H.YEAR,term:C.ANNUAL},[ii]:{commitment:H.MONTH,term:C.MONTHLY},[si]:{commitment:H.PERPETUAL,term:void 0},[ai]:{commitment:H.THREE_MONTHS,term:C.P3Y}};function nn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:i,taxDisplay:s}=t;if(s!==Ys)return e;let a={...e,priceDetails:{...t,price:o??r,priceWithoutDiscount:i??n,taxDisplay:qs}};return a.offerType==="TRIAL"&&a.priceDetails.price===0&&(a.priceDetails.price=a.priceDetails.priceWithoutDiscount),a}var on=function(e,t){return on=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},on(e,t)};function ft(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");on(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var b=function(){return b=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},b.apply(this,arguments)};function Wt(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,i;n<o;n++)(i||!(n in t))&&(i||(i=Array.prototype.slice.call(t,0,n)),i[n]=t[n]);return e.concat(i||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var A;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(A||(A={}));var ve;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(ve||(ve={}));function sn(e){return e.type===A.literal}function li(e){return e.type===A.argument}function Yt(e){return e.type===A.number}function qt(e){return e.type===A.date}function Xt(e){return e.type===A.time}function Kt(e){return e.type===A.select}function Zt(e){return e.type===A.plural}function hi(e){return e.type===A.pound}function Qt(e){return e.type===A.tag}function Jt(e){return!!(e&&typeof e=="object"&&e.type===ve.number)}function gt(e){return!!(e&&typeof e=="object"&&e.type===ve.dateTime)}var an=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Xs=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function di(e){var t={};return e.replace(Xs,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var mi=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function gi(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(mi).filter(function(d){return d.length>0}),r=[],n=0,o=t;n<o.length;n++){var i=o[n],s=i.split("/");if(s.length===0)throw new Error("Invalid number skeleton");for(var a=s[0],c=s.slice(1),l=0,h=c;l<h.length;l++){var m=h[l];if(m.length===0)throw new Error("Invalid number skeleton")}r.push({stem:a,options:c})}return r}function Ks(e){return e.replace(/^(.*?)-/,"")}var ui=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,xi=/^(@+)?(\+|#+)?[rs]?$/g,Zs=/(\*)(0+)|(#+)(0+)|(0+)/g,vi=/^(0+)$/;function pi(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(xi,function(r,n,o){return typeof o!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):o==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),t}function bi(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Qs(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!vi.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function fi(e){var t={},r=bi(e);return r||t}function yi(e){for(var t={},r=0,n=e;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=o.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Ks(o.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=b(b(b({},t),{notation:"scientific"}),o.options.reduce(function(c,l){return b(b({},c),fi(l))},{}));continue;case"engineering":t=b(b(b({},t),{notation:"engineering"}),o.options.reduce(function(c,l){return b(b({},c),fi(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace(Zs,function(c,l,h,m,d,u){if(l)t.minimumIntegerDigits=h.length;else{if(m&&d)throw new Error("We currently do not support maximum integer digits");if(u)throw new Error("We currently do not support exact integer digits")}return""});continue}if(vi.test(o.stem)){t.minimumIntegerDigits=o.stem.length;continue}if(ui.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(ui,function(c,l,h,m,d,u){return h==="*"?t.minimumFractionDigits=l.length:m&&m[0]==="#"?t.maximumFractionDigits=m.length:d&&u?(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length+u.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var i=o.options[0];i==="w"?t=b(b({},t),{trailingZeroDisplay:"stripIfInteger"}):i&&(t=b(b({},t),pi(i)));continue}if(xi.test(o.stem)){t=b(b({},t),pi(o.stem));continue}var s=bi(o.stem);s&&(t=b(b({},t),s));var a=Qs(o.stem);a&&(t=b(b({},t),a))}return t}var xt={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function Ei(e,t){for(var r="",n=0;n<e.length;n++){var o=e.charAt(n);if(o==="j"){for(var i=0;n+1<e.length&&e.charAt(n+1)===o;)i++,n++;var s=1+(i&1),a=i<2?1:3+(i>>1),c="a",l=Js(t);for((l=="H"||l=="k")&&(a=0);a-- >0;)r+=c;for(;s-- >0;)r=l+r}else o==="J"?r+="H":r+=o}return r}function Js(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,n;r!=="root"&&(n=e.maximize().region);var o=xt[n||""]||xt[r||""]||xt["".concat(r,"-001")]||xt["001"];return o[0]}var cn,ea=new RegExp("^".concat(an.source,"*")),ta=new RegExp("".concat(an.source,"*$"));function y(e,t){return{start:e,end:t}}var ra=!!String.prototype.startsWith,na=!!String.fromCodePoint,oa=!!Object.fromEntries,ia=!!String.prototype.codePointAt,sa=!!String.prototype.trimStart,aa=!!String.prototype.trimEnd,ca=!!Number.isSafeInteger,la=ca?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},hn=!0;try{Ai=Ti("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),hn=((cn=Ai.exec("a"))===null||cn===void 0?void 0:cn[0])==="a"}catch{hn=!1}var Ai,_i=ra?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},dn=na?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",o=t.length,i=0,s;o>i;){if(s=t[i++],s>1114111)throw RangeError(s+" is not a valid code point");n+=s<65536?String.fromCharCode(s):String.fromCharCode(((s-=65536)>>10)+55296,s%1024+56320)}return n},Si=oa?Object.fromEntries:function(t){for(var r={},n=0,o=t;n<o.length;n++){var i=o[n],s=i[0],a=i[1];r[s]=a}return r},wi=ia?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var o=t.charCodeAt(r),i;return o<55296||o>56319||r+1===n||(i=t.charCodeAt(r+1))<56320||i>57343?o:(o-55296<<10)+(i-56320)+65536}},ha=sa?function(t){return t.trimStart()}:function(t){return t.replace(ea,"")},da=aa?function(t){return t.trimEnd()}:function(t){return t.replace(ta,"")};function Ti(e,t){return new RegExp(e,t)}var mn;hn?(ln=Ti("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),mn=function(t,r){var n;ln.lastIndex=r;var o=ln.exec(t);return(n=o[1])!==null&&n!==void 0?n:""}):mn=function(t,r){for(var n=[];;){var o=wi(t,r);if(o===void 0||Pi(o)||pa(o))break;n.push(o),r+=o>=65536?2:1}return dn.apply(void 0,n)};var ln,Ci=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var o=[];!this.isEOF();){var i=this.char();if(i===123){var s=this.parseArgument(t,n);if(s.err)return s;o.push(s.val)}else{if(i===125&&t>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var a=this.clonePosition();this.bump(),o.push({type:A.pound,location:y(a,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(v.UNMATCHED_CLOSING_TAG,y(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&un(this.peek()||0)){var s=this.parseTag(t,r);if(s.err)return s;o.push(s.val)}else{var s=this.parseLiteral(t,r);if(s.err)return s;o.push(s.val)}}}return{val:o,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:A.literal,value:"<".concat(o,"/>"),location:y(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(t+1,r,!0);if(i.err)return i;var s=i.val,a=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!un(this.char()))return this.error(v.INVALID_TAG,y(a,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return o!==l?this.error(v.UNMATCHED_CLOSING_TAG,y(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:A.tag,value:o,children:s,location:y(n,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,y(a,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,y(n,this.clonePosition()))}else return this.error(v.INVALID_TAG,y(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&ua(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),o="";;){var i=this.tryParseQuote(r);if(i){o+=i;continue}var s=this.tryParseUnquoted(t,r);if(s){o+=s;continue}var a=this.tryParseLeftAngleBracket();if(a){o+=a;continue}break}var c=y(n,this.clonePosition());return{val:{type:A.literal,value:o,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!ma(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return dn.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),dn(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,y(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(v.MALFORMED_ARGUMENT,y(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:A.argument,value:o,location:y(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition())):this.parseArgumentOptions(t,r,o,n);default:return this.error(v.MALFORMED_ARGUMENT,y(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=mn(this.message,r),o=r+n.length;this.bumpTo(o);var i=this.clonePosition(),s=y(t,i);return{value:n,location:s}},e.prototype.parseArgumentOptions=function(t,r,n,o){var i,s=this.clonePosition(),a=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(a){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,y(s,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),m=this.parseSimpleArgStyleIfPossible();if(m.err)return m;var d=da(m.val);if(d.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,y(this.clonePosition(),this.clonePosition()));var u=y(h,this.clonePosition());l={style:d,styleLocation:u}}var g=this.tryParseArgumentClose(o);if(g.err)return g;var x=y(o,this.clonePosition());if(l&&_i(l?.style,"::",0)){var N=ha(l.style.slice(2));if(a==="number"){var m=this.parseNumberSkeletonFromString(N,l.styleLocation);return m.err?m:{val:{type:A.number,value:n,location:x,style:m.val},err:null}}else{if(N.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,x);var U=N;this.locale&&(U=Ei(N,this.locale));var d={type:ve.dateTime,pattern:U,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?di(U):{}},O=a==="date"?A.date:A.time;return{val:{type:O,value:n,location:x,style:d},err:null}}}return{val:{type:a==="number"?A.number:a==="date"?A.date:A.time,value:n,location:x,style:(i=l?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var D=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,y(D,b({},D)));this.bumpSpace();var se=this.parseIdentifierIfPossible(),j=0;if(a!=="select"&&se.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y(this.clonePosition(),this.clonePosition()));this.bumpSpace();var m=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(m.err)return m;this.bumpSpace(),se=this.parseIdentifierIfPossible(),j=m.val}var ae=this.tryParsePluralOrSelectOptions(t,a,r,se);if(ae.err)return ae;var g=this.tryParseArgumentClose(o);if(g.err)return g;var Ct=y(o,this.clonePosition());return a==="select"?{val:{type:A.select,value:n,options:Si(ae.val),location:Ct},err:null}:{val:{type:A.plural,value:n,options:Si(ae.val),offset:j,pluralType:a==="plural"?"cardinal":"ordinal",location:Ct},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,y(s,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,y(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,y(o,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=gi(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:ve.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?yi(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,o){for(var i,s=!1,a=[],c=new Set,l=o.value,h=o.location;;){if(l.length===0){var m=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var d=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(d.err)return d;h=y(m,this.clonePosition()),l=this.message.slice(m.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);l==="other"&&(s=!0),this.bumpSpace();var u=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,y(this.clonePosition(),this.clonePosition()));var g=this.parseMessage(t+1,r,n);if(g.err)return g;var x=this.tryParseArgumentClose(u);if(x.err)return x;a.push([l,{value:g.val,location:y(u,this.clonePosition())}]),c.add(l),this.bumpSpace(),i=this.parseIdentifierIfPossible(),l=i.value,h=i.location}return a.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,y(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!s?this.error(v.MISSING_OTHER_CLAUSE,y(this.clonePosition(),this.clonePosition())):{val:a,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var i=!1,s=0;!this.isEOF();){var a=this.char();if(a>=48&&a<=57)i=!0,s=s*10+(a-48),this.bump();else break}var c=y(o,this.clonePosition());return i?(s*=n,la(s)?{val:s,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=wi(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(_i(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Pi(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function un(e){return e>=97&&e<=122||e>=65&&e<=90}function ma(e){return un(e)||e===47}function ua(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Pi(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function pa(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function pn(e){e.forEach(function(t){if(delete t.location,Kt(t)||Zt(t))for(var r in t.options)delete t.options[r].location,pn(t.options[r].value);else Yt(t)&&Jt(t.style)||(qt(t)||Xt(t))&&gt(t.style)?delete t.style.location:Qt(t)&&pn(t.children)})}function Li(e,t){t===void 0&&(t={}),t=b({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Ci(e,t).parse();if(r.err){var n=SyntaxError(v[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||pn(r.val),r.val}function vt(e,t){var r=t&&t.cache?t.cache:ya,n=t&&t.serializer?t.serializer:ba,o=t&&t.strategy?t.strategy:ga;return o(e,{cache:r,serializer:n})}function fa(e){return e==null||typeof e=="number"||typeof e=="boolean"}function $i(e,t,r,n){var o=fa(n)?n:r(n),i=t.get(o);return typeof i>"u"&&(i=e.call(this,n),t.set(o,i)),i}function Ri(e,t,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),i=t.get(o);return typeof i>"u"&&(i=e.apply(this,n),t.set(o,i)),i}function fn(e,t,r,n,o){return r.bind(t,e,n,o)}function ga(e,t){var r=e.length===1?$i:Ri;return fn(e,this,r,t.cache.create(),t.serializer)}function xa(e,t){return fn(e,this,Ri,t.cache.create(),t.serializer)}function va(e,t){return fn(e,this,$i,t.cache.create(),t.serializer)}var ba=function(){return JSON.stringify(arguments)};function gn(){this.cache=Object.create(null)}gn.prototype.get=function(e){return this.cache[e]};gn.prototype.set=function(e,t){this.cache[e]=t};var ya={create:function(){return new gn}},er={variadic:xa,monadic:va};var be;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(be||(be={}));var bt=function(e){ft(t,e);function t(r,n,o){var i=e.call(this,r)||this;return i.code=n,i.originalMessage=o,i}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var xn=function(e){ft(t,e);function t(r,n,o,i){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(n,'". Options are "').concat(Object.keys(o).join('", "'),'"'),be.INVALID_VALUE,i)||this}return t}(bt);var Ni=function(e){ft(t,e);function t(r,n,o){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(n),be.INVALID_VALUE,o)||this}return t}(bt);var Oi=function(e){ft(t,e);function t(r,n){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(n,'"'),be.MISSING_VALUE,n)||this}return t}(bt);var R;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(R||(R={}));function Ea(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==R.literal||r.type!==R.literal?t.push(r):n.value+=r.value,t},[])}function Aa(e){return typeof e=="function"}function yt(e,t,r,n,o,i,s){if(e.length===1&&sn(e[0]))return[{type:R.literal,value:e[0].value}];for(var a=[],c=0,l=e;c<l.length;c++){var h=l[c];if(sn(h)){a.push({type:R.literal,value:h.value});continue}if(hi(h)){typeof i=="number"&&a.push({type:R.literal,value:r.getNumberFormat(t).format(i)});continue}var m=h.value;if(!(o&&m in o))throw new Oi(m,s);var d=o[m];if(li(h)){(!d||typeof d=="string"||typeof d=="number")&&(d=typeof d=="string"||typeof d=="number"?String(d):""),a.push({type:typeof d=="string"?R.literal:R.object,value:d});continue}if(qt(h)){var u=typeof h.style=="string"?n.date[h.style]:gt(h.style)?h.style.parsedOptions:void 0;a.push({type:R.literal,value:r.getDateTimeFormat(t,u).format(d)});continue}if(Xt(h)){var u=typeof h.style=="string"?n.time[h.style]:gt(h.style)?h.style.parsedOptions:n.time.medium;a.push({type:R.literal,value:r.getDateTimeFormat(t,u).format(d)});continue}if(Yt(h)){var u=typeof h.style=="string"?n.number[h.style]:Jt(h.style)?h.style.parsedOptions:void 0;u&&u.scale&&(d=d*(u.scale||1)),a.push({type:R.literal,value:r.getNumberFormat(t,u).format(d)});continue}if(Qt(h)){var g=h.children,x=h.value,N=o[x];if(!Aa(N))throw new Ni(x,"function",s);var U=yt(g,t,r,n,o,i),O=N(U.map(function(j){return j.value}));Array.isArray(O)||(O=[O]),a.push.apply(a,O.map(function(j){return{type:typeof j=="string"?R.literal:R.object,value:j}}))}if(Kt(h)){var D=h.options[d]||h.options.other;if(!D)throw new xn(h.value,d,Object.keys(h.options),s);a.push.apply(a,yt(D.value,t,r,n,o));continue}if(Zt(h)){var D=h.options["=".concat(d)];if(!D){if(!Intl.PluralRules)throw new bt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,be.MISSING_INTL_API,s);var se=r.getPluralRules(t,{type:h.pluralType}).select(d-(h.offset||0));D=h.options[se]||h.options.other}if(!D)throw new xn(h.value,d,Object.keys(h.options),s);a.push.apply(a,yt(D.value,t,r,n,o,d-(h.offset||0)));continue}}return Ea(a)}function _a(e,t){return t?b(b(b({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=b(b({},e[n]),t[n]||{}),r},{})):e}function Sa(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=_a(e[n],t[n]),r},b({},e)):e}function vn(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function wa(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:vt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,Wt([void 0],r,!1)))},{cache:vn(e.number),strategy:er.variadic}),getDateTimeFormat:vt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,Wt([void 0],r,!1)))},{cache:vn(e.dateTime),strategy:er.variadic}),getPluralRules:vt(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,Wt([void 0],r,!1)))},{cache:vn(e.pluralRules),strategy:er.variadic})}}var Hi=function(){function e(t,r,n,o){var i=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(s){var a=i.formatToParts(s);if(a.length===1)return a[0].value;var c=a.reduce(function(l,h){return!l.length||h.type!==R.literal||typeof l[l.length-1]!="string"?l.push(h.value):l[l.length-1]+=h.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(s){return yt(i.ast,i.locales,i.formatters,i.formats,s,void 0,i.message)},this.resolvedOptions=function(){return{locale:i.resolvedLocale.toString()}},this.getAst=function(){return i.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:o?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Sa(e.formats,n),this.formatters=o&&o.formatters||wa(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=Li,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Mi=Hi;var Ta=/[0-9\-+#]/,Ca=/[^\d\-+#]/g;function Ii(e){return e.search(Ta)}function Pa(e="#.##"){let t={},r=e.length,n=Ii(e);t.prefix=n>0?e.substring(0,n):"";let o=Ii(e.split("").reverse().join("")),i=r-o,s=e.substring(i,i+1),a=i+(s==="."||s===","?1:0);t.suffix=o>0?e.substring(a,r):"",t.mask=e.substring(n,a),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(Ca);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function La(e,t,r){let n=!1,o={value:e};e<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(t.fraction&&t.fraction.length),o.value=Number(o.value).toString();let i=t.fraction&&t.fraction.lastIndexOf("0"),[s="0",a=""]=o.value.split(".");return(!a||a&&a.length<=i)&&(a=i<0?"":(+("0."+a)).toFixed(i+1).replace("0.","")),o.integer=s,o.fraction=a,$a(o,t),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&t.maskHasPositiveSign?o.sign="+":n&&t.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),o}function $a(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;e.integer.length<n.length-o;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let i=r[1]&&r[r.length-1].length;if(i){let s=e.integer.length,a=s%i;for(let c=0;c<s;c++)e.result+=e.integer.charAt(c),!((c-a+1)%i)&&c<s-i&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Ra(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Pa(e),o=La(t,n,r);return n.prefix+o.sign+o.result+n.suffix}var ki=Ra;var Bi=".",Na=",",Di=/^\s+/,zi=/\s+$/,Ui="&nbsp;",bn=e=>e*12,Gi=(e,t)=>{let{start:r,end:n,displaySummary:{amount:o,duration:i,minProductQuantity:s,outcomeType:a}={}}=e;if(!(o&&i&&a&&s))return!1;let c=t?new Date(t):new Date;if(!r||!n)return!1;let l=new Date(r),h=new Date(n);return c>=l&&c<=h},ye={MONTH:"MONTH",YEAR:"YEAR"},Oa={[C.ANNUAL]:12,[C.MONTHLY]:1,[C.THREE_YEARS]:36,[C.TWO_YEARS]:24},yn=(e,t)=>({accept:e,round:t}),Ha=[yn(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),yn(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),yn(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],En={[H.YEAR]:{[C.MONTHLY]:ye.MONTH,[C.ANNUAL]:ye.YEAR},[H.MONTH]:{[C.MONTHLY]:ye.MONTH}},Ma=(e,t)=>e.indexOf(`'${t}'`)===0,Ia=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=Vi(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Ba(e)),r},ka=e=>{let t=Ua(e),r=Ma(e,t),n=e.replace(/'.*?'/,""),o=Di.test(n)||zi.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:o}},Fi=e=>e.replace(Di,Ui).replace(zi,Ui),Ba=e=>e.match(/#(.?)#/)?.[1]===Bi?Na:Bi,Ua=e=>e.match(/'(.*?)'/)?.[1]??"",Vi=e=>e.match(/0(.?)0/)?.[1]??"";function Ye({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},o,i=s=>s){let{currencySymbol:s,isCurrencyFirst:a,hasCurrencySpace:c}=ka(e),l=r?Vi(e):"",h=Ia(e,r),m=r?2:0,d=i(t,{currencySymbol:s}),u=n?d.toLocaleString("hi-IN",{minimumFractionDigits:m,maximumFractionDigits:m}):ki(h,d),g=r?u.lastIndexOf(l):u.length,x=u.substring(0,g),N=u.substring(g+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,u).replace(/SYMBOL/,s),currencySymbol:s,decimals:N,decimalsDelimiter:l,hasCurrencySpace:c,integer:x,isCurrencyFirst:a,recurrenceTerm:o}}var ji=e=>{let{commitment:t,term:r,usePrecision:n}=e,o=Oa[r]??1;return Ye(e,o>1?ye.MONTH:En[t]?.[r],i=>{let s={divisor:o,price:i,usePrecision:n},{round:a}=Ha.find(({accept:c})=>c(s));if(!a)throw new Error(`Missing rounding rule for: ${JSON.stringify(s)}`);return a(s)})},Wi=({commitment:e,term:t,...r})=>Ye(r,En[e]?.[t]),Yi=e=>{let{commitment:t,instant:r,price:n,originalPrice:o,priceWithoutDiscount:i,promotion:s,quantity:a=1,term:c}=e;if(t===H.YEAR&&c===C.MONTHLY){if(!s)return Ye(e,ye.YEAR,bn);let{displaySummary:{outcomeType:l,duration:h,minProductQuantity:m=1}={}}=s;switch(l){case"PERCENTAGE_DISCOUNT":if(a>=m&&Gi(s,r)){let d=parseInt(h.replace("P","").replace("M",""));if(isNaN(d))return bn(n);let u=a*o*d,g=a*i*(12-d),x=Math.floor((u+g)*100)/100;return Ye({...e,price:x},ye.YEAR)}default:return Ye(e,ye.YEAR,()=>bn(i??n))}}return Ye(e,En[t]?.[c])};var Da={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},za=ri("ConsonantTemplates/price"),Ga=/<\/?[^>]+(>|$)/g,$={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},Ee={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},Fa="TAX_EXCLUSIVE",Va=e=>ti(e)?Object.entries(e).filter(([,t])=>mt(t)||tn(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+Jo(n)+'"'}`,""):"",M=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+$.disabled}"${Va(r)}>${n?Fi(t):t??""}</span>`;function ja(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:o,hasCurrencySpace:i,integer:s,isCurrencyFirst:a,recurrenceLabel:c,perUnitLabel:l,taxInclusivityLabel:h},m={}){let d=M($.currencySymbol,r),u=M($.currencySpace,i?"&nbsp;":""),g="";return a&&(g+=d+u),g+=M($.integer,s),g+=M($.decimalsDelimiter,o),g+=M($.decimals,n),a||(g+=u+d),g+=M($.recurrence,c,null,!0),g+=M($.unitType,l,null,!0),g+=M($.taxInclusivity,h,!0),M(e,g,{...m,"aria-label":t})}var G=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1,instant:n=void 0}={})=>({country:o,displayFormatted:i=!0,displayRecurrence:s=!0,displayPerUnit:a=!1,displayTax:c=!1,language:l,literals:h={},quantity:m=1}={},{commitment:d,offerSelectorIds:u,formatString:g,price:x,priceWithoutDiscount:N,taxDisplay:U,taxTerm:O,term:D,usePrecision:se,promotion:j}={},ae={})=>{Object.entries({country:o,formatString:g,language:l,price:x}).forEach(([W,lr])=>{if(lr==null)throw new Error(`Argument "${W}" is missing for osi ${u?.toString()}, country ${o}, language ${l}`)});let Ct={...Da,...h},As=`${l.toLowerCase()}-${o.toUpperCase()}`;function we(W,lr){let hr=Ct[W];if(hr==null)return"";try{return new Mi(hr.replace(Ga,""),As).format(lr)}catch{return za.error("Failed to format literal:",hr),""}}let _s=t&&N?N:x,In=e?ji:Wi;r&&(In=Yi);let{accessiblePrice:Ss,recurrenceTerm:sr,...kn}=In({commitment:d,formatString:g,instant:n,isIndianPrice:o==="IN",originalPrice:x,priceWithoutDiscount:N,price:e?x:_s,promotion:j,quantity:m,term:D,usePrecision:se}),Te=Ss,ar="";if(B(s)&&sr){let W=we(Ee.recurrenceAriaLabel,{recurrenceTerm:sr});W&&(Te+=" "+W),ar=we(Ee.recurrenceLabel,{recurrenceTerm:sr})}let cr="";if(B(a)){cr=we(Ee.perUnitLabel,{perUnit:"LICENSE"});let W=we(Ee.perUnitAriaLabel,{perUnit:"LICENSE"});W&&(Te+=" "+W)}let Ze="";B(c)&&O&&(Ze=we(U===Fa?Ee.taxExclusiveLabel:Ee.taxInclusiveLabel,{taxTerm:O}),Ze&&(Te+=" "+Ze)),t&&(Te=we(Ee.strikethroughAriaLabel,{strikethroughPrice:Te}));let Qe=$.container;if(e&&(Qe+=" "+$.containerOptical),t&&(Qe+=" "+$.containerStrikethrough),r&&(Qe+=" "+$.containerAnnual),B(i))return ja(Qe,{...kn,accessibleLabel:Te,recurrenceLabel:ar,perUnitLabel:cr,taxInclusivityLabel:Ze},ae);let{currencySymbol:Bn,decimals:ws,decimalsDelimiter:Ts,hasCurrencySpace:Un,integer:Cs,isCurrencyFirst:Ps}=kn,Ce=[Cs,Ts,ws];Ps?(Ce.unshift(Un?"\xA0":""),Ce.unshift(Bn)):(Ce.push(Un?"\xA0":""),Ce.push(Bn)),Ce.push(ar,cr,Ze);let Ls=Ce.join("");return M(Qe,Ls,ae)},qi=()=>(e,t,r)=>{let o=(e.displayOldPrice===void 0||B(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${G()(e,t,r)}${o?"&nbsp;"+G({displayStrikethrough:!0})(e,t,r):""}`},Xi=()=>(e,t,r)=>{let{instant:n}=e;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let o={...e,displayTax:!1,displayPerUnit:!1};return`${(e.displayOldPrice===void 0||B(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price?G({displayStrikethrough:!0})(o,t,r)+"&nbsp;":""}${G()(e,t,r)}${M($.containerAnnualPrefix,"&nbsp;(")}${G({displayAnnual:!0,instant:n})(o,t,r)}${M($.containerAnnualSuffix,")")}`},Ki=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${G()(e,t,r)}${M($.containerAnnualPrefix,"&nbsp;(")}${G({displayAnnual:!0})(n,t,r)}${M($.containerAnnualSuffix,")")}`};var Wa=G(),Ya=qi(),qa=G({displayOptical:!0}),Xa=G({displayStrikethrough:!0}),Ka=G({displayAnnual:!0}),Za=Ki(),Qa=Xi();var Ja=(e,t)=>{if(!(!pt(e)||!pt(t)))return Math.floor((t-e)/t*100)},Zi=()=>(e,t)=>{let{price:r,priceWithoutDiscount:n}=t,o=Ja(r,n);return o===void 0?'<span class="no-discount"></span>':`<span class="discount">${o}%</span>`};var ec=Zi();var{freeze:Et}=Object,An=Et({...ht}),_n=Et({...dt}),Sn={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},Im=Et({...H}),km=Et({...ci}),Bm=Et({...C});var Ji="mas-commerce-service";function es(e,{once:t=!1}={}){let r=null;function n(){let o=document.querySelector(Ji);o!==r&&(r=o,o&&e(o))}return document.addEventListener(zr,n,{once:t}),At(n),()=>document.removeEventListener(zr,n)}function ts(e,{country:t,forceTaxExclusive:r,perpetual:n}){let o;if(e.length<2)o=e;else{let i=t==="GB"||n?"EN":"MULT",[s,a]=e;o=[s.language===i?s:a]}return r&&(o=o.map(nn)),o}var At=e=>window.setTimeout(e);function Ae(){return document.getElementsByTagName(Ji)?.[0]}var _e={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},rs=1e3,ns=new Set;function nc(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function os(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:o,status:i}=e;return[n,i,o].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!_e.serializableTypes.includes(r))return r}return e}function oc(e,t){if(!_e.ignoredProperties.includes(e))return os(t)}var wn={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,n=[],o=[],i=t;r.forEach(l=>{l!=null&&(nc(l)?n:o).push(l)}),n.length&&(i+=" "+n.map(os).join(" "));let{pathname:s,search:a}=window.location,c=`${_e.delimiter}page=${s}${a}`;c.length>rs&&(c=`${c.slice(0,rs)}<trunc>`),i+=c,o.length&&(i+=`${_e.delimiter}facts=`,i+=JSON.stringify(o,oc)),ns.has(i)||(ns.add(i),window.lana?.log(i,_e))}};function tr(e){Object.assign(_e,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in _e&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var ic=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:An.V3,checkoutWorkflowStep:_n.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:Sn.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Vr.PUBLISHED,wcsBufferLimit:1});var Tn=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});var Cn={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},sc=Date.now(),Pn=new Set,Ln=new Set,is=new Map,ss={append({level:e,message:t,params:r,timestamp:n,source:o}){console[e](`${n}ms [${o}] %c${t}`,"font-weight: bold;",...r)}},as={filter:({level:e})=>e!==Cn.DEBUG},ac={filter:()=>!1};function cc(e,t,r,n,o){return{level:e,message:t,namespace:r,get params(){return n.length===1&&ut(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:o,timestamp:Date.now()-sc}}function lc(e){[...Ln].every(t=>t(e))&&Pn.forEach(t=>t(e))}function cs(e){let t=(is.get(e)??0)+1;is.set(e,t);let r=`${e} #${t}`,n={id:r,namespace:e,module:o=>cs(`${n.namespace}/${o}`),updateConfig:tr};return Object.values(Cn).forEach(o=>{n[o]=(i,...s)=>lc(cc(o,i,e,s,r))}),Object.seal(n)}function rr(...e){e.forEach(t=>{let{append:r,filter:n}=t;ut(n)&&Ln.add(n),ut(r)&&Pn.add(r)})}function hc(e={}){let{name:t}=e,r=B(je("commerce.debug",{search:!0,storage:!0}),t===Tn.LOCAL);return rr(r?ss:as),t===Tn.PROD&&rr(wn),$n}function dc(){Pn.clear(),Ln.clear()}var $n={...cs(ko),Level:Cn,Plugins:{consoleAppender:ss,debugFilter:as,quietFilter:ac,lanaAppender:wn},init:hc,reset:dc,use:rr};var mc={[re]:No,[ge]:Oo,[ne]:Ho},uc={[re]:Mo,[ne]:Io},nr=class{constructor(t){p(this,"changes",new Map);p(this,"connected",!1);p(this,"dispose",We);p(this,"error");p(this,"log");p(this,"options");p(this,"promises",[]);p(this,"state",ge);p(this,"timer",null);p(this,"value");p(this,"version",0);p(this,"wrapperElement");this.wrapperElement=t}update(){[re,ge,ne].forEach(t=>{this.wrapperElement.classList.toggle(mc[t],t===this.state)})}notify(){(this.state===ne||this.state===re)&&(this.state===ne?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===re&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]),this.wrapperElement.dispatchEvent(new CustomEvent(uc[this.state],{bubbles:!0}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){this.dispose=es(()=>this.requestUpdate(!0))}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement})),this.dispose(),this.dispose=We}onceSettled(){let{error:t,promises:r,state:n}=this;return ne===n?Promise.resolve(this.wrapperElement):re===n?Promise.reject(t):new Promise((o,i)=>{r.push({resolve:o,reject:i})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=ne,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),At(()=>this.notify()),!0)}toggleFailed(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.error=r,this.state=re,this.update(),this.log?.error("Failed:",{element:this.wrapperElement,error:r}),At(()=>this.notify()),!0)}togglePending(t){return this.version++,t&&(this.options=t),this.state=ge,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!Ae()||this.timer)return;let r=$n.module("mas-element"),{error:n,options:o,state:i,value:s,version:a}=this;this.state=ge,this.timer=At(async()=>{this.timer=null;let c=null;if(this.changes.size&&(c=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:c}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:c})),c||t)try{await this.wrapperElement.render?.()===!1&&this.state===ge&&this.version===a&&(this.state=i,this.error=n,this.value=s,this.update(),this.notify())}catch(l){r.error("Failed to render mas-element: ",l),this.toggleFailed(this.version,l,o)}})}};function ls(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function hs(e,t={}){let{tag:r,is:n}=e,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,ls(t)),o}function ds(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,ls(t)),e):null}var pc="download",fc="upgrade";function ms(e,t={},r=""){let n=Ae();if(!n)return null;let{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:a,upgrade:c,modal:l,perpetual:h,promotionCode:m,quantity:d,wcsOsi:u,extraOptions:g}=n.collectCheckoutOptions(t),x=hs(e,{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:a,upgrade:c,modal:l,perpetual:h,promotionCode:m,quantity:d,wcsOsi:u,extraOptions:g});return r&&(x.innerHTML=`<span style="pointer-events: none;">${r}</span>`),x}function us(e){return class extends e{constructor(){super(...arguments);p(this,"checkoutActionHandler");p(this,"masElement",new nr(this))}attributeChangedCallback(n,o,i){this.masElement.attributeChangedCallback(n,o,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){if(!this.isConnected)return!1;let o=Ae();if(!o)return!1;this.dataset.imsCountry||o.imsCountryPromise.then(m=>{m&&(this.dataset.imsCountry=m)},We),n.imsCountry=null;let i=o.collectCheckoutOptions(n,this);if(!i.wcsOsi.length)return!1;let s;try{s=JSON.parse(i.extraOptions??"{}")}catch(m){this.masElement.log?.error("cannot parse exta checkout options",m)}let a=this.masElement.togglePending(i);this.setCheckoutUrl("");let c=o.resolveOfferSelectors(i),l=await Promise.all(c);l=l.map(m=>ts(m,i)),i.country=this.dataset.imsCountry||i.country;let h=await o.buildCheckoutAction?.(l.flat(),{...s,...i},this);return this.renderOffers(l.flat(),i,{},h,a)}renderOffers(n,o,i={},s=void 0,a=void 0){if(!this.isConnected)return!1;let c=Ae();if(!c)return!1;if(o={...JSON.parse(this.dataset.extraOptions??"null"),...o,...i},a??(a=this.masElement.togglePending(o)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),s){this.classList.remove(pc,fc),this.masElement.toggleResolved(a,n,o);let{url:h,text:m,className:d,handler:u}=s;return h&&this.setCheckoutUrl(h),m&&(this.firstElementChild.innerHTML=m),d&&this.classList.add(...d.split(" ")),u&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=u.bind(this)),!0}else if(n.length){if(this.masElement.toggleResolved(a,n,o)){let h=c.buildCheckoutURL(n,o);return this.setCheckoutUrl(h),!0}}else{let h=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(a,h,o))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let o=Ae();if(!o)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:a,entitlement:c,upgrade:l,modal:h,perpetual:m,promotionCode:d,quantity:u,wcsOsi:g}=o.collectCheckoutOptions(n);return ds(this,{checkoutMarketSegment:i,checkoutWorkflow:s,checkoutWorkflowStep:a,entitlement:c,upgrade:l,modal:h,perpetual:m,promotionCode:d,quantity:u,wcsOsi:g}),!0}}}var _t=class _t extends us(HTMLButtonElement){static createCheckoutButton(t={},r=""){return ms(_t,t,r)}setCheckoutUrl(t){this.setAttribute("data-href",t)}get href(){return this.getAttribute("data-href")}get isCheckoutButton(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}this.href&&(window.location.href=this.href)}};p(_t,"is","checkout-button"),p(_t,"tag","button");var qe=_t;window.customElements.get(qe.is)||window.customElements.define(qe.is,qe,{extends:qe.tag});var gc="#000000",xc="#F8D904",vc=/(accent|primary|secondary)(-(outline|link))?/,bc="mas:product_code/",yc="daa-ll",or="daa-lh",Ec=["XL","L","M","S"];function Ac(e,t,r){e.mnemonicIcon?.map((o,i)=>({icon:o,alt:e.mnemonicAlt[i]??"",link:e.mnemonicLink[i]??""}))?.forEach(({icon:o,alt:i,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let a={slot:"icons",src:o,loading:t.loading,size:r?.size??"l"};i&&(a.alt=i),s&&(a.href=s);let c=V("merch-icon",a);t.append(c)})}function _c(e,t){e.badge&&(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||gc),t.setAttribute("badge-background-color",e.badgeBackgroundColor||xc))}function Sc(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function wc(e,t,r){e.cardTitle&&r&&t.append(V(r.tag,{slot:r.slot},e.cardTitle))}function Tc(e,t,r){e.subtitle&&r&&t.append(V(r.tag,{slot:r.slot},e.subtitle))}function Cc(e,t,r){if(e.backgroundImage){let n={loading:t.loading??"lazy",src:e.backgroundImage};if(e.backgroundImageAltText?n.alt=e.backgroundImageAltText:n.role="none",!r)return;if(r?.attribute){t.setAttribute(r.attribute,e.backgroundImage);return}t.append(V(r.tag,{slot:r.slot},V("img",n)))}}function Pc(e,t,r){if(e.prices&&r){let n=V(r.tag,{slot:r.slot},e.prices);t.append(n)}}function Lc(e,t,r){if(e.description&&r){let n=V(r.tag,{slot:r.slot},e.description);t.append(n)}}function $c(e,t,r,n){let i=customElements.get("checkout-button").createCheckoutButton({},e.innerHTML);i.setAttribute("tabindex",0);for(let h of e.attributes)["class","is"].includes(h.name)||i.setAttribute(h.name,h.value);i.firstElementChild?.classList.add("spectrum-Button-label");let s=t.ctas.size??"M",a=`spectrum-Button--${n}`,c=Ec.includes(s)?`spectrum-Button--size${s}`:"spectrum-Button--sizeM",l=["spectrum-Button",a,c];return r&&l.push("spectrum-Button--outline"),i.classList.add(...l),i}function Rc(e,t,r,n){let o="fill";r&&(o="outline");let i=V("sp-button",{treatment:o,variant:n,tabIndex:0,size:t.ctas.size??"m"},e);return i.addEventListener("click",s=>{s.target!==e&&(s.stopPropagation(),e.click())}),i}function Nc(e,t){return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function Oc(e,t,r,n){if(e.ctas){let{slot:o}=r.ctas,i=V("div",{slot:o},e.ctas),s=[...i.querySelectorAll("a")].map(a=>{let c=a.parentElement.tagName==="STRONG";if(t.consonant)return Nc(a,c);let l=vc.exec(a.className)?.[0]??"accent",h=l.includes("accent"),m=l.includes("primary"),d=l.includes("secondary"),u=l.includes("-outline");if(l.includes("-link"))return a;let x;return h||c?x="accent":m?x="primary":d&&(x="secondary"),t.spectrum==="swc"?Rc(a,r,u,x):$c(a,r,u,x)});i.innerHTML="",i.append(...s),t.append(i)}}function Hc(e,t){let{tags:r}=e,n=r?.find(o=>o.startsWith(bc))?.split("/").pop();n&&(t.setAttribute(or,n),t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]").forEach((o,i)=>{o.setAttribute(yc,`${o.dataset.analyticsId}-${i+1}`)}))}function Mc(e){e.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,r])=>{e.querySelectorAll(`a.${t}`).forEach(n=>{n.classList.remove(t),n.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}async function ps(e,t){let{fields:r}=e,{variant:n}=r;if(!n)return;t.querySelectorAll("[slot]").forEach(i=>{i.remove()}),t.removeAttribute("background-image"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.classList.remove("wide-strip"),t.classList.remove("thin-strip"),t.removeAttribute(or),t.variant=n,await t.updateComplete;let{aemFragmentMapping:o}=t.variantLayout;o&&(Ac(r,t,o.mnemonics),_c(r,t),Sc(r,t,o.size),wc(r,t,o.title),Tc(r,t,o.subtitle),Pc(r,t,o.prices),Cc(r,t,o.backgroundImage),Lc(r,t,o.description),Oc(r,t,o,n),Hc(r,t),Mc(t))}var Ic="merch-card",kc=":start",Bc=":ready",Uc=1e4,fs="merch-card:",wt,Rn,St=class extends F{constructor(){super();I(this,wt);p(this,"customerSegment");p(this,"marketSegment");p(this,"variantLayout");this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}static getFragmentMapping(r){return Xo[r]}firstUpdated(){this.variantLayout=Xr(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=Xr(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(r)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let i=o.value?.[0]?.planType;if(!i)return;let s=this.stockOfferOsis[i];if(!s)return;let a=o.dataset.wcsOsi.split(",").filter(c=>c!==s);r.checked&&a.push(s),o.dataset.wcsOsi=a.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let i=n[o].order;i===1||isNaN(i)||(n[o].order=Number(i)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback();let r=this.querySelector("aem-fragment")?.getAttribute("fragment");performance.mark(`${fs}${r}${kc}`),this.addEventListener(Fr,this.handleQuantitySelection),this.addEventListener(Co,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(Ie,this.handleAemFragmentEvents),this.addEventListener(Me,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(Fr,this.handleQuantitySelection),this.storageOptions?.removeEventListener(Gr,this.handleStorageChange),this.removeEventListener(Ie,this.handleAemFragmentEvents),this.removeEventListener(Me,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===Ie&&Z(this,wt,Rn).call(this,"AEM fragment cannot be loaded"),r.type===Me&&r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;await ps(n,this),this.checkReady()}}async checkReady(){let r=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(i=>i.onceSettled().catch(()=>i))).then(i=>i.every(s=>s.classList.contains("placeholder-resolved"))),n=new Promise(i=>setTimeout(()=>i(!1),Uc));if(await Promise.race([r,n])===!0){performance.mark(`${fs}${this.id}${Bc}`),this.dispatchEvent(new CustomEvent($o,{bubbles:!0,composed:!0}));return}Z(this,wt,Rn).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll('a[is="checkout-link"].con-button')).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(Po,{bubbles:!0})),this.displayFooterElementsInColumn())}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(Gr,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let o=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(o)}):n.replaceWith(o)}}};wt=new WeakSet,Rn=function(r){this.dispatchEvent(new CustomEvent(Ro,{detail:r,bubbles:!0,composed:!0}))},p(St,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[n,o,i]=r.split(",");return{PUF:n,ABM:o,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,i,s]=n.split(":"),a=Number(i);return[o,{order:isNaN(a)?void 0:a,size:s}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:i}])=>[n,o,i].filter(s=>s!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:or,reflect:!0},loading:{type:String}}),p(St,"styles",[So,Ko(),...wo()]);customElements.define(Ic,St);var Xe=class extends F{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?f`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:f` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};p(Xe,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),p(Xe,"styles",_`
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
    `);customElements.define("merch-icon",Xe);var bs=new CSSStyleSheet;bs.replaceSync(":host { display: contents; }");var Dc=document.querySelector('meta[name="aem-base-url"]')?.content??"https://odin.adobe.com",gs="fragment",xs="author",zc="ims",vs=e=>{throw new Error(`Failed to get fragment: ${e}`)};async function Gc(e,t,r,n){let o=r?`${e}/adobe/sites/cf/fragments/${t}`:`${e}/adobe/sites/fragments/${t}`,i=await fetch(o,{cache:"default",credentials:"omit",headers:n}).catch(s=>vs(s.message));return i?.ok||vs(`${i.status} ${i.statusText}`),i.json()}var Nn,oe,On=class{constructor(){I(this,oe,new Map)}clear(){E(this,oe).clear()}add(...t){t.forEach(r=>{let{id:n}=r;n&&E(this,oe).set(n,r)})}has(t){return E(this,oe).has(t)}get(t){return E(this,oe).get(t)}remove(t){E(this,oe).delete(t)}};oe=new WeakMap;var ir=new On,Se,q,ie,Tt,X,Ke,K,Mn,ys,Es,Hn=class extends HTMLElement{constructor(){super();I(this,K);p(this,"cache",ir);I(this,Se);I(this,q);I(this,ie);I(this,Tt,!1);I(this,X);I(this,Ke,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[bs];let r=this.getAttribute(zc);["",!0,"true"].includes(r)&&(k(this,Tt,!0),Nn||(Nn={Authorization:`Bearer ${window.adobeid?.authorize?.()}`}))}static get observedAttributes(){return[gs,xs]}attributeChangedCallback(r,n,o){r===gs&&(k(this,ie,o),this.refresh(!1)),r===xs&&k(this,Ke,["","true"].includes(o))}connectedCallback(){if(!E(this,ie)){Z(this,K,Mn).call(this,"Missing fragment id");return}}async refresh(r=!0){E(this,X)&&!await Promise.race([E(this,X),Promise.resolve(!1)])||(r&&ir.remove(E(this,ie)),k(this,X,this.fetchData().then(()=>(this.dispatchEvent(new CustomEvent(Me,{detail:this.data,bubbles:!0,composed:!0})),!0)).catch(n=>(Z(this,K,Mn).call(this,"Network error: failed to load fragment"),k(this,X,null),!1))),E(this,X))}async fetchData(){k(this,Se,null),k(this,q,null);let r=ir.get(E(this,ie));r||(r=await Gc(Dc,E(this,ie),E(this,Ke),E(this,Tt)?Nn:void 0),ir.add(r)),k(this,Se,r)}get updateComplete(){return E(this,X)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return E(this,q)?E(this,q):(E(this,Ke)?Z(this,K,ys).call(this):Z(this,K,Es).call(this),E(this,q))}};Se=new WeakMap,q=new WeakMap,ie=new WeakMap,Tt=new WeakMap,X=new WeakMap,Ke=new WeakMap,K=new WeakSet,Mn=function(r){this.classList.add("error"),this.dispatchEvent(new CustomEvent(Ie,{detail:r,bubbles:!0,composed:!0}))},ys=function(){let{fields:r,id:n,tags:o}=E(this,Se);k(this,q,r.reduce((i,{name:s,multiple:a,values:c})=>(i.fields[s]=a?c:c[0],i),{fields:{},id:n,tags:o}))},Es=function(){let{fields:r,id:n,tags:o}=E(this,Se);k(this,q,Object.entries(r).reduce((i,[s,a])=>(i.fields[s]=a?.mimeType?a.value:a??"",i),{fields:{},id:n,tags:o}))};customElements.define("aem-fragment",Hn);tr({sampleRate:1});
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
