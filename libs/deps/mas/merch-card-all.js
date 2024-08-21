var V=window,q=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Te=Symbol(),Re=new WeakMap,j=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(q&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=Re.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Re.set(t,e))}return e}toString(){return this.cssText}},ze=o=>new j(typeof o=="string"?o:o+"",void 0,Te);var te=(o,e)=>{q?o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(t=>{let r=document.createElement("style"),n=V.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=t.cssText,o.appendChild(r)})},F=q?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return ze(t)})(o):o;var re,W=window,Oe=W.trustedTypes,ft=Oe?Oe.emptyScript:"",Me=W.reactiveElementPolyfillSupport,oe={toAttribute(o,e){switch(e){case Boolean:o=o?ft:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},Pe=(o,e)=>e!==o&&(e==e||o==o),ne={attribute:!0,type:String,converter:oe,reflect:!1,hasChanged:Pe},ae="finalized",$=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();let e=[];return this.elementProperties.forEach((t,r)=>{let n=this._$Ep(r,t);n!==void 0&&(this._$Ev.set(n,r),e.push(n))}),e}static createProperty(e,t=ne){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){let r=typeof e=="symbol"?Symbol():"__"+e,n=this.getPropertyDescriptor(e,r,t);n!==void 0&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(n){let a=this[e];this[t]=n,this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||ne}static finalize(){if(this.hasOwnProperty(ae))return!1;this[ae]=!0;let e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let t=this.properties,r=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(let n of r)this.createProperty(n,t[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let n of r)t.unshift(F(n))}else e!==void 0&&t.push(F(e));return t}static _$Ep(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(t=>t(this))}addController(e){var t,r;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)===null||r===void 0||r.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;let t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return te(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostConnected)===null||r===void 0?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostDisconnected)===null||r===void 0?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=ne){var n;let a=this.constructor._$Ep(e,r);if(a!==void 0&&r.reflect===!0){let i=(((n=r.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?r.converter:oe).toAttribute(t,r.type);this._$El=e,i==null?this.removeAttribute(a):this.setAttribute(a,i),this._$El=null}}_$AK(e,t){var r;let n=this.constructor,a=n._$Ev.get(e);if(a!==void 0&&this._$El!==a){let i=n.getPropertyOptions(a),h=typeof i.converter=="function"?{fromAttribute:i.converter}:((r=i.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?i.converter:oe;this._$El=a,this[a]=h.fromAttribute(t,i.type),this._$El=null}}requestUpdate(e,t,r){let n=!0;e!==void 0&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||Pe)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,r))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,a)=>this[a]=n),this._$Ei=void 0);let t=!1,r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(e=this._$ES)===null||e===void 0||e.forEach(n=>{var a;return(a=n.hostUpdate)===null||a===void 0?void 0:a.call(n)}),this.update(r)):this._$Ek()}catch(n){throw t=!1,this._$Ek(),n}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostUpdated)===null||n===void 0?void 0:n.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((t,r)=>this._$EO(r,this[r],t)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};$[ae]=!0,$.elementProperties=new Map,$.elementStyles=[],$.shadowRootOptions={mode:"open"},Me?.({ReactiveElement:$}),((re=W.reactiveElementVersions)!==null&&re!==void 0?re:W.reactiveElementVersions=[]).push("1.6.3");var ie,G=window,O=G.trustedTypes,Le=O?O.createPolicy("lit-html",{createHTML:o=>o}):void 0,ce="$lit$",E=`lit$${(Math.random()+"").slice(9)}$`,Ve="?"+E,vt=`<${Ve}>`,C=document,N=()=>C.createComment(""),H=o=>o===null||typeof o!="object"&&typeof o!="function",je=Array.isArray,xt=o=>je(o)||typeof o?.[Symbol.iterator]=="function",se=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ne=/-->/g,He=/>/g,_=RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ue=/'/g,Be=/"/g,qe=/^(?:script|style|textarea|title)$/i,Fe=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),c=Fe(1),Mt=Fe(2),A=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),De=new WeakMap,S=C.createTreeWalker(C,129,null,!1);function We(o,e){if(!Array.isArray(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Le!==void 0?Le.createHTML(e):e}var bt=(o,e)=>{let t=o.length-1,r=[],n,a=e===2?"<svg>":"",i=L;for(let h=0;h<t;h++){let s=o[h],l,d,m=-1,p=0;for(;p<s.length&&(i.lastIndex=p,d=i.exec(s),d!==null);)p=i.lastIndex,i===L?d[1]==="!--"?i=Ne:d[1]!==void 0?i=He:d[2]!==void 0?(qe.test(d[2])&&(n=RegExp("</"+d[2],"g")),i=_):d[3]!==void 0&&(i=_):i===_?d[0]===">"?(i=n??L,m=-1):d[1]===void 0?m=-2:(m=i.lastIndex-d[2].length,l=d[1],i=d[3]===void 0?_:d[3]==='"'?Be:Ue):i===Be||i===Ue?i=_:i===Ne||i===He?i=L:(i=_,n=void 0);let f=i===_&&o[h+1].startsWith("/>")?" ":"";a+=i===L?s+vt:m>=0?(r.push(l),s.slice(0,m)+ce+s.slice(m)+E+f):s+E+(m===-2?(r.push(void 0),h):f)}return[We(o,a+(o[t]||"<?>")+(e===2?"</svg>":"")),r]},U=class o{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let a=0,i=0,h=e.length-1,s=this.parts,[l,d]=bt(e,t);if(this.el=o.createElement(l,r),S.currentNode=this.el.content,t===2){let m=this.el.content,p=m.firstChild;p.remove(),m.append(...p.childNodes)}for(;(n=S.nextNode())!==null&&s.length<h;){if(n.nodeType===1){if(n.hasAttributes()){let m=[];for(let p of n.getAttributeNames())if(p.endsWith(ce)||p.startsWith(E)){let f=d[i++];if(m.push(p),f!==void 0){let I=n.getAttribute(f.toLowerCase()+ce).split(E),z=/([.?@])?(.*)/.exec(f);s.push({type:1,index:a,name:z[2],strings:I,ctor:z[1]==="."?le:z[1]==="?"?de:z[1]==="@"?me:P})}else s.push({type:6,index:a})}for(let p of m)n.removeAttribute(p)}if(qe.test(n.tagName)){let m=n.textContent.split(E),p=m.length-1;if(p>0){n.textContent=O?O.emptyScript:"";for(let f=0;f<p;f++)n.append(m[f],N()),S.nextNode(),s.push({type:2,index:++a});n.append(m[p],N())}}}else if(n.nodeType===8)if(n.data===Ve)s.push({type:2,index:a});else{let m=-1;for(;(m=n.data.indexOf(E,m+1))!==-1;)s.push({type:7,index:a}),m+=E.length-1}a++}}static createElement(e,t){let r=C.createElement("template");return r.innerHTML=e,r}};function M(o,e,t=o,r){var n,a,i,h;if(e===A)return e;let s=r!==void 0?(n=t._$Co)===null||n===void 0?void 0:n[r]:t._$Cl,l=H(e)?void 0:e._$litDirective$;return s?.constructor!==l&&((a=s?._$AO)===null||a===void 0||a.call(s,!1),l===void 0?s=void 0:(s=new l(o),s._$AT(o,t,r)),r!==void 0?((i=(h=t)._$Co)!==null&&i!==void 0?i:h._$Co=[])[r]=s:t._$Cl=s),s!==void 0&&(e=M(o,s._$AS(o,e.values),s,r)),e}var he=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;let{el:{content:r},parts:n}=this._$AD,a=((t=e?.creationScope)!==null&&t!==void 0?t:C).importNode(r,!0);S.currentNode=a;let i=S.nextNode(),h=0,s=0,l=n[0];for(;l!==void 0;){if(h===l.index){let d;l.type===2?d=new B(i,i.nextSibling,this,e):l.type===1?d=new l.ctor(i,l.name,l.strings,this,e):l.type===6&&(d=new pe(i,this,e)),this._$AV.push(d),l=n[++s]}h!==l?.index&&(i=S.nextNode(),h++)}return S.currentNode=C,a}v(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},B=class o{constructor(e,t,r,n){var a;this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cp=(a=n?.isConnected)===null||a===void 0||a}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=M(this,e,t),H(e)?e===g||e==null||e===""?(this._$AH!==g&&this._$AR(),this._$AH=g):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):xt(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==g&&H(this._$AH)?this._$AA.nextSibling.data=e:this.$(C.createTextNode(e)),this._$AH=e}g(e){var t;let{values:r,_$litType$:n}=e,a=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=U.createElement(We(n.h,n.h[0]),this.options)),n);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===a)this._$AH.v(r);else{let i=new he(a,this),h=i.u(this.options);i.v(r),this.$(h),this._$AH=i}}_$AC(e){let t=De.get(e.strings);return t===void 0&&De.set(e.strings,t=new U(e)),t}T(e){je(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,n=0;for(let a of e)n===t.length?t.push(r=new o(this.k(N()),this.k(N()),this,this.options)):r=t[n],r._$AI(a),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,t);e&&e!==this._$AB;){let n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}},P=class{constructor(e,t,r,n,a){this.type=1,this._$AH=g,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=a,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=g}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,n){let a=this.strings,i=!1;if(a===void 0)e=M(this,e,t,0),i=!H(e)||e!==this._$AH&&e!==A,i&&(this._$AH=e);else{let h=e,s,l;for(e=a[0],s=0;s<a.length-1;s++)l=M(this,h[r+s],t,s),l===A&&(l=this._$AH[s]),i||(i=!H(l)||l!==this._$AH[s]),l===g?e=g:e!==g&&(e+=(l??"")+a[s+1]),this._$AH[s]=l}i&&!n&&this.j(e)}j(e){e===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},le=class extends P{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===g?void 0:e}},yt=O?O.emptyScript:"",de=class extends P{constructor(){super(...arguments),this.type=4}j(e){e&&e!==g?this.element.setAttribute(this.name,yt):this.element.removeAttribute(this.name)}},me=class extends P{constructor(e,t,r,n,a){super(e,t,r,n,a),this.type=5}_$AI(e,t=this){var r;if((e=(r=M(this,e,t,0))!==null&&r!==void 0?r:g)===A)return;let n=this._$AH,a=e===g&&n!==g||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==g&&(n===g||a);a&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;typeof this._$AH=="function"?this._$AH.call((r=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&r!==void 0?r:this.element,e):this._$AH.handleEvent(e)}},pe=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){M(this,e)}};var Ie=G.litHtmlPolyfillSupport;Ie?.(U,B),((ie=G.litHtmlVersions)!==null&&ie!==void 0?ie:G.litHtmlVersions=[]).push("2.8.0");var Ge=(o,e,t)=>{var r,n;let a=(r=t?.renderBefore)!==null&&r!==void 0?r:e,i=a._$litPart$;if(i===void 0){let h=(n=t?.renderBefore)!==null&&n!==void 0?n:null;a._$litPart$=i=new B(e.insertBefore(N(),h),h,void 0,t??{})}return i._$AI(o),i};var K=window,Z=K.ShadowRoot&&(K.ShadyCSS===void 0||K.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),Ke=new WeakMap,D=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(Z&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=Ke.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Ke.set(t,e))}return e}toString(){return this.cssText}},y=o=>new D(typeof o=="string"?o:o+"",void 0,ge),k=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((r,n,a)=>r+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+o[a+1],o[0]);return new D(t,o,ge)},ue=(o,e)=>{Z?o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(t=>{let r=document.createElement("style"),n=K.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=t.cssText,o.appendChild(r)})},Y=Z?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return y(t)})(o):o;var fe,J=window,Ze=J.trustedTypes,wt=Ze?Ze.emptyScript:"",Ye=J.reactiveElementPolyfillSupport,xe={toAttribute(o,e){switch(e){case Boolean:o=o?wt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},Je=(o,e)=>e!==o&&(e==e||o==o),ve={attribute:!0,type:String,converter:xe,reflect:!1,hasChanged:Je},be="finalized",w=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();let e=[];return this.elementProperties.forEach((t,r)=>{let n=this._$Ep(r,t);n!==void 0&&(this._$Ev.set(n,r),e.push(n))}),e}static createProperty(e,t=ve){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){let r=typeof e=="symbol"?Symbol():"__"+e,n=this.getPropertyDescriptor(e,r,t);n!==void 0&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(n){let a=this[e];this[t]=n,this.requestUpdate(e,a,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||ve}static finalize(){if(this.hasOwnProperty(be))return!1;this[be]=!0;let e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let t=this.properties,r=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(let n of r)this.createProperty(n,t[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let n of r)t.unshift(Y(n))}else e!==void 0&&t.push(Y(e));return t}static _$Ep(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(t=>t(this))}addController(e){var t,r;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)===null||r===void 0||r.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;let t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return ue(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostConnected)===null||r===void 0?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostDisconnected)===null||r===void 0?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=ve){var n;let a=this.constructor._$Ep(e,r);if(a!==void 0&&r.reflect===!0){let i=(((n=r.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?r.converter:xe).toAttribute(t,r.type);this._$El=e,i==null?this.removeAttribute(a):this.setAttribute(a,i),this._$El=null}}_$AK(e,t){var r;let n=this.constructor,a=n._$Ev.get(e);if(a!==void 0&&this._$El!==a){let i=n.getPropertyOptions(a),h=typeof i.converter=="function"?{fromAttribute:i.converter}:((r=i.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?i.converter:xe;this._$El=a,this[a]=h.fromAttribute(t,i.type),this._$El=null}}requestUpdate(e,t,r){let n=!0;e!==void 0&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||Je)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,r))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,a)=>this[a]=n),this._$Ei=void 0);let t=!1,r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(e=this._$ES)===null||e===void 0||e.forEach(n=>{var a;return(a=n.hostUpdate)===null||a===void 0?void 0:a.call(n)}),this.update(r)):this._$Ek()}catch(n){throw t=!1,this._$Ek(),n}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostUpdated)===null||n===void 0?void 0:n.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((t,r)=>this._$EO(r,this[r],t)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};w[be]=!0,w.elementProperties=new Map,w.elementStyles=[],w.shadowRootOptions={mode:"open"},Ye?.({ReactiveElement:w}),((fe=J.reactiveElementVersions)!==null&&fe!==void 0?fe:J.reactiveElementVersions=[]).push("1.6.3");var ye,we;var b=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;let r=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=r.firstChild),r}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return A}};b.finalized=!0,b._$litElement$=!0,(ye=globalThis.litElementHydrateSupport)===null||ye===void 0||ye.call(globalThis,{LitElement:b});var Qe=globalThis.litElementPolyfillSupport;Qe?.({LitElement:b});((we=globalThis.litElementVersions)!==null&&we!==void 0?we:globalThis.litElementVersions=[]).push("3.3.3");var R="(max-width: 767px)",Q="(max-width: 1199px)",v="(min-width: 768px)",u="(min-width: 1200px)",x="(min-width: 1600px)";var Xe=k`
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
        border-radius: 5px;
        position: relative;
        top: 0;
        margin-left: var(--consonant-merch-spacing-xxs);
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

    .share-link {
      text-decoration: none;
      display: inline-flex;
      align-items: center;
    }

    .share-link:link,
    .share-link:visited {
      color: #757575;                 
    }

    .share-link:hover,
    .share-link:active,
    .share-icons a:hover,
    .share-icons a:active {
      filter: brightness(0.7);                 
    }

    .share-icon {
      color: #adadad;
      background-image: var(--share-icon); /* Replace with desired icon */
      width: 24px; 
      height: 24px; 
      display: inline-block;
      margin-right: 6px;
    }

    .share-icons {
      border: 2px solid #adadad;
      border-radius: 8px;
      padding: 7px 7px 0 7px;
      position: absolute;
      top: -40px;
      right: 50px;
    }

    .share-icons a {
      display: inline-block;
      width: 24px;
      height: 24px;
      background-size: contain;
      background-repeat: no-repeat;
    }

    .share-icons > a:not(:first-child) {
        margin-inline-start: 18px;
    }

    .share-facebook {
      background:  var(--facebook-icon) no-repeat;
    }

    .share-twitter {
      background:  var(--twitter-icon) no-repeat;
    }

    .share-linkedin {
      background:  var(--linkedin-icon) no-repeat;
    }

    .share-reddit {
      background:  var(--reddit-icon) no-repeat;
    }

    .share-clipboard {
      background:  var(--clipboard-icon) no-repeat;
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

    :host([variant='plans'][share]) footer {
        position: relative;
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-top-section-height);
    }

    @media screen and ${y(Q)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${y(R)} {
        :host([variant='mini-compare-chart']) .top-section {
            padding-top: var(--consonant-merch-spacing-xs);
        }
        :host([variant='mini-compare-chart']) .mini-compare-chart-badge {
            font-size: var(--consonant-merch-card-detail-font-size);
            padding: 6px 8px;
            top: 10px;
        }
    }
    @media screen and ${y(u)} {
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
`,et=()=>{let o=[k`
        /* Tablet */
        @media screen and ${y(v)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                grid-column: span 3;
                width: 100%;
                max-width: var(--consonant-merch-card-tablet-wide-width);
                margin: 0 auto;
            }
        }

        /* Laptop */
        @media screen and ${y(u)} {
            :host([size='super-wide']) {
                grid-column: span 3;
            }
        `];return o.push(k`
        /* Large desktop */
        @media screen and ${y(x)} {
            :host([size='super-wide']) {
                grid-column: span 4;
            }
        }
    `),o};var[tt,rt,nt,ot,at,er]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Tab"];var it=document.createElement("style");it.innerHTML=`
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

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23aaaaaa' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
  
    --share-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23adadad' viewBox='0 0 24 24'%3E%3Cpath d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.3 3.3 0 0 0 0-1.42l7.13-4.11a3 3 0 1 0-.88-1.5L8.03 9.78a3 3 0 1 0 0 4.43l7.14 4.1a3.06 3.06 0 1 0 .82-1.53l-.01-.7-.02-.6-.03-.2a.72.72 0 0 1-.03-.12c0-.02 0-.04-.01-.06h0l-.02-.09-.02-.08-.05-.17c0-.01 0-.01-.01-.02v-.01a2.98 2.98 0 0 0-1.91-1.13Z'/%3E%3C/svg%3E");
    --facebook-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 35'%3E%3Cpath fill='%23adadad' d='M28.438,0a6.324,6.324,0,0,1,4.637,1.925A6.324,6.324,0,0,1,35,6.563V28.438A6.574,6.574,0,0,1,28.438,35H24.154V21.442h4.535l.684-5.286H24.154V12.783a2.919,2.919,0,0,1,.535-1.914,2.657,2.657,0,0,1,2.085-.638l2.78-.023V5.492A30.537,30.537,0,0,0,25.5,5.286a6.769,6.769,0,0,0-4.956,1.823,6.892,6.892,0,0,0-1.857,5.15v3.9H14.128v5.286h4.557V35H6.563a6.324,6.324,0,0,1-4.637-1.925A6.324,6.324,0,0,1,0,28.438V6.563A6.324,6.324,0,0,1,1.925,1.925,6.324,6.324,0,0,1,6.563,0Z'/%3E%3C/svg%3E");
    --twitter-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 35'%3E%3Cpath fill='none' d='M28.3,6.5h-3.8l-6.3,7.1l-5.3-7.1H5.2l9.2,12.1l-8.8,10h4.1l6.7-7.7l5.9,7.7h7.5l-9.7-12.6L28.3,6.5z M25.3,26.3h-2.1L9.7,8.7h1.9L25.3,26.3z'/%3E%3Cg%3E%3Cpolygon fill='%23adadad' points='9.7,8.7 23.3,26.3 25.3,26.3 11.6,8.7'/%3E%3Cpath fill='%23adadad' d='M33.1,1.9c-1.2-1.3-2.9-2-4.6-1.9H6.6C4.8,0,3.1,0.7,1.9,1.9C0.7,3.1,0,4.8,0,6.6v21.9c0,1.7,0.7,3.4,1.9,4.6c1.2,1.3,2.9,2,4.6,1.9h21.9c3.6,0,6.6-2.9,6.6-6.6V6.6C35,4.8,34.3,3.1,33.1,1.9z M22.3,28.5l-5.9-7.7l-6.7,7.7H5.6l8.8-10L5.2,6.5h7.7l5.3,7.1l6.3-7.1h3.8l-8.2,9.5l9.7,12.6H22.3z'/%3E%3C/g%3E%3C/svg%3E");
    --linkedin-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 35'%3E%3Cpath fill='%23adadad' d='M5.4,29.3h5.264V13.49H5.4Zm5.605-20.69a2.7,2.7,0,0,0-.82-1.96,2.906,2.906,0,0,0-2.119-.775,3.027,3.027,0,0,0-2.153.775,2.565,2.565,0,0,0-.832,1.96,2.6,2.6,0,0,0,.809,1.948A2.9,2.9,0,0,0,8,11.348h.023a3,3,0,0,0,2.165-.786A2.59,2.59,0,0,0,11.006,8.613ZM24.336,29.3H29.6V20.234a7.564,7.564,0,0,0-1.663-5.309,5.7,5.7,0,0,0-4.4-1.8,5.3,5.3,0,0,0-4.762,2.666h.046v-2.3H13.558q.068,1.5,0,15.814h5.264V20.462a3.753,3.753,0,0,1,.16-1.276,3.517,3.517,0,0,1,1.025-1.356,2.584,2.584,0,0,1,1.686-.558q2.642,0,2.643,3.577ZM35,6.563V28.438A6.574,6.574,0,0,1,28.438,35H6.563a6.324,6.324,0,0,1-4.637-1.925A6.324,6.324,0,0,1,0,28.438V6.563A6.324,6.324,0,0,1,1.925,1.925,6.324,6.324,0,0,1,6.563,0H28.438a6.324,6.324,0,0,1,4.637,1.925A6.324,6.324,0,0,1,35,6.563Z'/%3E%3C/svg%3E");
 --reddit-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 35 35' fill='%23adadad'%3E%3Cpath d='m33.08,1.93C31.86.67,30.18-.02,28.44,0H6.56c-1.75-.03-3.42.67-4.64,1.92C.67,3.14-.03,4.82,0,6.56v21.88c-.03,1.75.67,3.42,1.93,4.64,1.21,1.25,2.89,1.95,4.64,1.92h21.88c3.62,0,6.56-2.94,6.56-6.56V6.56c.03-1.75-.67-3.42-1.92-4.64Zm-4.23,18.33c.02.28.02.57,0,.85,0,4.35-5.06,7.88-11.31,7.88s-11.31-3.53-11.31-7.88c-.02-.28-.02-.57,0-.85-.28-.13-.53-.3-.76-.51-1.14-1.07-1.19-2.86-.12-4,1.07-1.14,2.86-1.19,4-.12,2.24-1.52,4.86-2.35,7.57-2.39l1.44-6.73s0,0,0,0c.07-.32.39-.53.72-.46l4.75.95c.31-.53.86-.89,1.47-.95,1.07-.11,2.02.66,2.14,1.72.11,1.07-.66,2.02-1.72,2.14-1.07.11-2.02-.66-2.14-1.72l-4.15-.87-1.26,6.05c2.67.06,5.26.89,7.47,2.39.5-.48,1.16-.76,1.86-.79,1.56-.06,2.88,1.16,2.93,2.73.02,1.09-.59,2.09-1.57,2.58Zm-11.54,4.14c-1.18.84-2.61,1.26-4.05,1.18-1.44.06-2.87-.37-4.03-1.22-.19-.16-.47-.16-.66,0-.22.18-.26.51-.07.74,1.38,1.04,3.07,1.57,4.79,1.49,1.72.07,3.42-.46,4.79-1.49v.08c.21-.21.22-.55,0-.77-.21-.21-.55-.22-.77,0Zm-6.64-4.64c0-1.07-.87-1.94-1.94-1.94s-1.94.87-1.94,1.94.87,1.94,1.94,1.94,1.94-.87,1.94-1.94Zm7.04-1.86c-1.07,0-1.94.87-1.94,1.94s.87,1.94,1.94,1.94l-.02.08s.07,0,.1,0c1.07-.04,1.9-.95,1.86-2.02,0-1.07-.87-1.94-1.94-1.94Z'/%3E%3C/svg%3E");

    --clipboard-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 37 37'%3E%3Cpath fill='%23adadad' d='M31 0H6C2.7 0 0 2.7 0 6v25c0 3.3 2.7 6 6 6h25c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zM15.34 30.58a6.296 6.296 0 0 1-8.83 0c-2.48-2.44-2.52-6.43-.08-8.91l6.31-6.31a6.423 6.423 0 0 1 9.01-.04c.43.43.79.93 1.08 1.47l-1.52 1.51c-.11.11-.24.2-.38.28a3.68 3.68 0 0 0-3.32-2.44c-1.1-.04-2.17.37-2.96 1.13l-6.31 6.31a3.591 3.591 0 0 0 0 5.09 3.591 3.591 0 0 0 5.09 0c.19-.19 2.81-2.85 3.26-3.3 1.04.43 2.16.61 3.29.53-.96.95-4.31 4.34-4.64 4.68zm15.19-15.2-5.94 5.94c-2.54 2.57-6.63 2.73-9.38.38-.43-.43-.79-.93-1.08-1.47l1.44-1.5a2 2 0 0 1 .37-.28c.24.56.61 1.05 1.09 1.43.64.62 1.49.97 2.37.97 1.1.04 2.17-.37 2.96-1.14l6.26-6.26a3.591 3.591 0 0 0 0-5.09 3.591 3.591 0 0 0-5.09 0c-.19.19-2.87 2.83-3.32 3.29a7.267 7.267 0 0 0-3.29-.53c.96-.96 4.36-4.32 4.7-4.66a6.301 6.301 0 0 1 8.91 0l.01.01c2.46 2.47 2.46 6.46-.01 8.91z'/%3E%3C/svg%3E");




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

merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
}

merch-card[variant="mini-compare-chart"] [slot='callout-content'] [is="inline-price"] {
    min-height: unset;
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

@media screen and ${R} {
    merch-card[variant="mini-compare-chart"] .mini-compare-chart-badge + [slot='heading-m'] {
        margin-top: var(--consonant-merch-spacing-m);
    }

    merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
        padding: 0 var(--consonant-merch-spacing-xs) 0;
        font-size: var(--consonant-merch-card-body-s-font-size);
        line-height: var(--consonant-merch-card-body-s-line-height);
        width: inherit;
    }

    merch-card[variant="mini-compare-chart"] [slot='body-m'] {
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot="offers"] {
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
        font-size: var(--consonant-merch-card-body-s-font-size);
        padding: 0 var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot="heading-m-price"]:has(+ [slot="footer"]) {
        padding-bottom: 0;
    }

    html[lang="he"] merch-card[variant="mini-compare-chart"] [is="inline-price"] .price-recurrence::before {
        content: "\\200B";
    }

    merch-card[variant="mini-compare-chart"] [slot="price-commitment"] {
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
        font-size: var(--consonant-merch-card-body-xs-font-size);
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
        font-size: var(--consonant-merch-card-body-xs-font-size);
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] .footer-row-cell {
        flex-direction: column;
        place-items: flex-start;
        gap: 0px;
        padding: var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] .footer-row-icon {
        margin-bottom: var(--consonant-merch-spacing-xs);
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
@media screen and ${R} {
    :root {
        --consonant-merch-card-mini-compare-chart-width: 142px;
        --consonant-merch-card-segment-width: 276px;
        --consonant-merch-card-mini-compare-chart-wide-width: 302px;
        --consonant-merch-card-special-offers-width: 302px;
        --consonant-merch-card-twp-width: 300px;
    }
}


/* Tablet */
@media screen and ${v} {
    :root {
        --consonant-merch-card-catalog-width: 302px;
        --consonant-merch-card-plans-width: 302px;
        --consonant-merch-card-segment-width: 276px;
        --consonant-merch-card-mini-compare-chart-width: 178px;
        --consonant-merch-card-mini-compare-chart-wide-width: 302px;
        --consonant-merch-card-special-offers-width: 302px;
        --consonant-merch-card-twp-width: 268px;
    }
}

/* desktop */
@media screen and ${u} {
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
@media screen and ${v} {
    .two-merch-cards.plans,
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}

/* desktop */
@media screen and ${u} {
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
    }
}

/* Large desktop */
    @media screen and ${x} {
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
@media screen and ${v} {
    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

/* desktop */
@media screen and ${u} {
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

/* Large desktop */
    @media screen and ${x} {
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
@media screen and ${v} {
    .two-merch-cards.special-offers,
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(2, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

/* desktop */
@media screen and ${u} {
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

@media screen and ${x} {
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
@media screen and ${v} {
    .two-merch-cards.image,
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
    }
}

/* desktop */
@media screen and ${u} {
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
    }
}

/* Large desktop */
    @media screen and ${x} {
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
@media screen and ${v} {
    .two-merch-cards.segment,
    .three-merch-cards.segment,
    .four-merch-cards.segment {
        grid-template-columns: repeat(2, minmax(276px, var(--consonant-merch-card-segment-width)));
    }
}

/* desktop */
@media screen and ${u} {
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
@media screen and ${v} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${u} {
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
    }
}

/* Large desktop */
    @media screen and ${x} {
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
@media screen and ${v} {
    .one-merch-card.twp,
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* desktop */
@media screen and ${u} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Large desktop */
    @media screen and ${x} {
        .one-merch-card.twp
        .two-merch-cards.twp {
            grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
        }
        .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Mobile */
@media screen and ${R} {
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
@media screen and ${v} {
    .two-merch-cards.inline-heading,
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
    }
}

/* desktop */
@media screen and ${u} {
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
    }
}

/* Large desktop */
    @media screen and ${x} {
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
@media screen and ${v} {
    .two-merch-cards.ccd-action,
    .three-merch-cards.ccd-action,
    .four-merch-cards.ccd-action {
        grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-action-width));
    }
}

/* desktop */
@media screen and ${u} {
    .three-merch-cards.ccd-action,
    .four-merch-cards.ccd-action {
        grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-action-width));
    }
}

/* Large desktop */
    @media screen and ${x} {
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

@media screen and ${R} {
    .two-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
        flex: 1;
    }
}

@media screen and ${Q} {
    .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
        flex: 1;
    }
}

/* Tablet */
@media screen and ${v} {
    .two-merch-cards.mini-compare-chart {
        grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
        gap: var(--consonant-merch-spacing-m);
    }

    .three-merch-cards.mini-compare-chart,
    .four-merch-cards.mini-compare-chart {
        grid-template-columns: repeat(3, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
    }
}

/* desktop */
@media screen and ${u} {
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

@media screen and ${x} {
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
`;document.head.appendChild(it);var st="merch-offer-select:ready",ct="merch-card:ready",ht="merch-card:action-menu-toggle";var Ee="merch-storage:change",$e="merch-quantity-selector:change";function lt(o){let e=[];function t(r){r.nodeType===Node.TEXT_NODE?e.push(r):r.childNodes.forEach(t)}return t(o),e}function T(o,e={},t){let r=document.createElement(o);r.innerHTML=t;for(let[n,a]of Object.entries(e))r.setAttribute(n,a);return r}var _e="MERCH-CARD",Et="merch-card",$t=32,Se="mini-compare-chart",dt=o=>`--consonant-merch-card-footer-row-${o}-min-height`,Ce=class extends b{static properties={name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},borderColor:{type:String,attribute:"border-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},share:{type:String,attribute:"share"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},customHr:{type:Boolean,attribute:"custom-hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{let[t,r,n]=e.split(",");return{PUF:t,ABM:r,M2M:n}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(t=>{let[r,n,a]=t.split(":"),i=Number(n);return[r,{order:isNaN(i)?void 0:i,size:a}]})),toAttribute:e=>Object.entries(e).map(([t,{order:r,size:n}])=>[t,r,n].filter(a=>a!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object}};static styles=[Xe,...et()];customerSegment;marketSegment;constructor(){super(),this.filters={},this.types="",this.selected=!1}#e;updated(e){(e.has("badgeBackgroundColor")||e.has("borderColor"))&&(this.style.border=this.computedBorderStyle),this.updateComplete.then(async()=>{let r=Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]')).filter(n=>!n.closest('[slot="callout-content"]'));await Promise.all(r.map(n=>n.onceSettled())),this.adjustTitleWidth(),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows()})}get computedBorderStyle(){return this.variant!=="twp"?`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`:""}get evergreen(){return this.classList.contains("intro-pricing")}get stockCheckbox(){return this.checkboxLabel?c`<label id="stock-checkbox">
                    <input type="checkbox" @change=${this.toggleStockOffer}></input>
                    <span></span>
                    ${this.checkboxLabel}
                </label>`:""}get cardImage(){return c` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}get secureLabelFooter(){let e=this.secureLabel?c`<span class="secure-transaction-label"
                  >${this.secureLabel}</span
              >`:"";return c`<footer>${e} ${this.shareButton} <slot name="footer"></slot></footer>`}get miniCompareFooter(){let e=this.secureLabel?c`<slot name="secure-transaction-label">
                  <span class="secure-transaction-label"
                      >${this.secureLabel}</span
                  ></slot
              >`:c`<slot name="secure-transaction-label"></slot>`;return c`<footer>${e}<slot name="footer"></slot></footer>`}get badge(){let e;if(!(!this.badgeBackgroundColor||!this.badgeColor||!this.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`),c`
            <div
                id="badge"
                class="${this.variant}-badge"
                style="background-color: ${this.badgeBackgroundColor};
                    color: ${this.badgeColor};
                    ${e}"
            >
                ${this.badgeText}
            </div>
        `}get badgeElement(){return this.shadowRoot.getElementById("badge")}getContainer(){return this.closest('[class*="-merch-cards"]')??this.parentElement}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}get isMobileOrTablet(){return window.matchMedia("(max-width: 1024px)").matches}async toggleStockOffer({target:e}){if(!this.stockOfferOsis)return;let t=this.checkoutLinks;if(t.length!==0)for(let r of t){await r.onceSettled();let n=r.value?.[0]?.planType;if(!n)return;let a=this.stockOfferOsis[n];if(!a)return;let i=r.dataset.wcsOsi.split(",").filter(h=>h!==a);e.checked&&i.push(a),r.dataset.wcsOsi=i.join(",")}}toggleActionMenu(e){let t=e?.type==="mouseleave"?!0:void 0,r=this.shadowRoot.querySelector('slot[name="action-menu-content"]');r&&(t||this.dispatchEvent(new CustomEvent(ht,{bubbles:!0,composed:!0,detail:{card:this.name,type:"action-menu"}})),r.classList.toggle("hidden",t))}handleQuantitySelection(e){let t=this.checkoutLinks;for(let r of t)r.dataset.quantity=e.detail.option}get titleElement(){return this.variant==="special-offers"?this.querySelector('[slot="detail-m"]'):this.querySelector('[slot="heading-xs"]')}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}get descriptionText(){return Array.from(this.querySelector('[slot="body-xs"]')?.children).find(e=>e.childNodes.length&&e.childNodes[0].nodeName==="#text")?.textContent||""}updateFilters(e){let t={...this.filters};Object.keys(t).forEach(r=>{if(e){t[r].order=Math.min(t[r].order||2,2);return}let n=t[r].order;n===1||isNaN(n)||(t[r].order=Number(n)+1)}),this.filters=t}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}getShareURL(){let e=window.location.href.replace("promoshare--milo","main--milo"),t=this.footerSlot?.querySelector("a[data-modal-path]")?.getAttribute("data-modal-hash");return`${e}${encodeURIComponent(t)}`}_shareFacebook(e){e?.preventDefault();let t=`https://www.facebook.com/sharer/sharer.php?u=${this.getShareURL()}`;window.open(t,"newwindow","width=600, height=400")}_shareTwitter(e){e?.preventDefault();let r=`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.descriptionText)}&url=${this.getShareURL()}`;window.open(r,"newwindow","width=600, height=400")}_shareLinkedIn(e){e?.preventDefault();let t=`https://www.linkedin.com/sharing/share-offsite/?url=${this.getShareURL()}`;window.open(t,"newwindow","width=600, height=400")}_shareReddit(e){e?.preventDefault();let t=`https://reddit.com/submit?url=${this.getShareURL()}`;window.open(t,"newwindow","width=600, height=400")}_shareClipboard(e){navigator.clipboard.writeText(this.getShareURL()).then(()=>{})}_toggleShareVisibility(e){e?.preventDefault();var t=this.shadowRoot.querySelector(".share-icons");t.style.display==="none"?t.style.display="block":t.style.display="none"}get shareButton(){return this.share?c`
      <div class="share-icons" style="display: none;">
        <a class="share-facebook" href="" @click="${this._shareFacebook}" title="Share to Facebook"></a>
        <a class="share-twitter" href="" @click="${this._shareTwitter}" title="Share to Twitter"></a>
        <a class="share-linkedin" href="" @click="${this._shareLinkedIn}" title="Share to LinkedIn"></a>
        <a class="share-reddit" href="" @click="${this._shareReddit}" title="Share to Reddit"></a>
        <a class="share-clipboard" href="" @click="${this._shareClipboard}" title="Copy to clipboard"></a>
      </div>
      <a class="share-link" href="" @click="${this._toggleShareVisibility}"><span class="share-icon" ></span> Spread the word</a>
      `:c``}render(){if(!(!this.isConnected||this.style.display==="none"))switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"image":return this.renderImage();case"product":return this.renderProduct();case"inline-heading":return this.renderInlineHeading();case Se:return this.renderMiniCompareChart();case"ccd-action":return this.renderCcdAction();case"twp":return this.renderTwp();default:return this.renderProduct()}}renderSpecialOffer(){return c`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?c`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:c`
                      <hr />
                      ${this.secureLabelFooter}
                  `}`}get promoBottom(){return this.classList.contains("promo-bottom")}renderSegment(){return c` ${this.badge}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":c`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?c`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
            </div>
            <hr />
            ${this.secureLabelFooter}`}renderPlans(){return c` 
            ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":c`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
                <slot name="body-xs"></slot>
                ${this.promoBottom?c`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
                ${this.stockCheckbox}
            </div>
            <slot name="quantity-select"></slot>
            ${this.secureLabelFooter}`}renderCatalog(){return c` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                        ${this.isMobileOrTablet&&this.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":c`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?c`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}`}renderImage(){return c`${this.cardImage}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?c`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:c`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
            </div>
            ${this.evergreen?c`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:c`
                      <hr />
                      ${this.secureLabelFooter}
                  `}`}renderInlineHeading(){return c` ${this.badge}
            <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot>
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="body-xs"></slot>
            </div>
            ${this.customHr?"":c`<hr />`} ${this.secureLabelFooter}`}renderProduct(){return c` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":c`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?c`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}`}renderMiniCompareChart(){let{badge:e}=this;return c` <div class="top-section${e?" badge":""}">
                <slot name="icons"></slot> ${e}
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
            <slot name="footer-rows"><slot name="body-s"></slot></slot>`}renderTwp(){return c`${this.badge}
            <div class="top-section">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs-top"></slot>
            </div>
            <div class="body">
                <slot name="body-xs"></slot>
            </div>
            <footer><slot name="footer"></slot></footer>`}get defaultSlot(){return this.querySelector(":scope > a:not([slot]),:scope > p:not([slot]),:scope > div:not([slot]),:scope > span:not([slot])")?c`<slot></slot>`:g}renderCcdAction(){return c` <div class="body">
            <slot name="icons"></slot> ${this.badge}
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            ${this.promoBottom?c`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:c`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
            <footer><slot name="footer"></slot></footer>
            ${this.defaultSlot}
        </div>`}connectedCallback(){super.connectedCallback(),this.#e=this.getContainer(),this.setAttribute("tabindex",this.getAttribute("tabindex")??"0"),this.addEventListener("keydown",this.keydownHandler),this.addEventListener("mouseleave",this.toggleActionMenu),this.addEventListener($e,this.handleQuantitySelection),this.addEventListener(st,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.keydownHandler),this.removeEventListener($e,this.handleQuantitySelection),this.storageOptions?.removeEventListener(Ee,this.handleStorageChange)}appendInvisibleSpacesToFooterLinks(){[...this.querySelectorAll('[slot="footer"] a')].forEach(e=>{lt(e).forEach(r=>{let i=r.textContent.split(" ").map(h=>h.match(/.{1,7}/g)?.join("\u200B")).join(" ");r.textContent=i})})}keydownHandler(e){let t=document.activeElement?.closest(_e);if(!t)return;function r(d,m){let p=document.elementFromPoint(d,m)?.closest(_e);p&&(t.selected=!1,e.preventDefault(),e.stopImmediatePropagation(),p.focus(),p.selected=!0,p.scrollIntoView({behavior:"smooth",block:"center"}))}let{x:n,y:a,width:i,height:h}=t.getBoundingClientRect(),s=64,{code:l}=e;if(l==="Tab"){let d=Array.from(this.querySelectorAll('a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select')),m=d[0],p=d[d.length-1];if(!e.shiftKey&&document.activeElement===p){let f=this.closest(".section");f||(f=document);let I=f.querySelectorAll(_e),z=I[I.length-1];if(this===z)return;e.preventDefault(),e.stopImmediatePropagation()}else e.shiftKey&&document.activeElement===m&&(e.preventDefault(),e.stopImmediatePropagation())}else switch(l){case tt:r(n-s,a);break;case rt:r(n+i+s,a);break;case nt:r(n,a-s);break;case ot:r(n,a+h+s);break;case at:if(this.variant==="twp")return;this.footerSlot?.querySelector("a")?.click();break}}updateMiniCompareElementMinHeight(e,t){let r=`--consonant-merch-card-mini-compare-${t}-height`,n=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),a=parseInt(this.#e.style.getPropertyValue(r))||0;n>a&&this.#e.style.setProperty(r,`${n}px`)}async adjustTitleWidth(){if(!["segment","plans"].includes(this.variant))return;let e=this.getBoundingClientRect().width,t=this.badgeElement?.getBoundingClientRect().width||0;e===0||t===0||this.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-t-16)}px`)}async adjustMiniCompareBodySlots(){if(this.variant!==Se||this.getBoundingClientRect().width===0)return;this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","price-commitment","offers","promo-text","callout-content","secure-transaction-label"].forEach(r=>this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(`slot[name="${r}"]`),r)),this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector("footer"),"footer");let t=this.shadowRoot.querySelector(".mini-compare-chart-badge");t&&t.textContent!==""&&this.#e.style.setProperty("--consonant-merch-card-mini-compare-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.variant!==Se||this.getBoundingClientRect().width===0)return;[...this.querySelector('[slot="footer-rows"]').children].forEach((t,r)=>{let n=Math.max($t,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.#e.style.getPropertyValue(dt(r+1)))||0;n>a&&this.#e.style.setProperty(dt(r+1),`${n}px`)})}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let e=this.storageOptions?.selected;if(e){let t=this.querySelector(`merch-offer-select[storage="${e}"]`);if(t)return t}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(ct,{bubbles:!0}))}handleStorageChange(){let e=this.closest("merch-card")?.offerSelect.cloneNode(!0);e&&this.dispatchEvent(new CustomEvent(Ee,{detail:{offerSelect:e},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(e){if(e===this.merchOffer)return;this.merchOffer=e;let t=this.dynamicPrice;if(e.price&&t){let r=e.price.cloneNode(!0);t.onceSettled?t.onceSettled().then(()=>{t.replaceWith(r)}):t.replaceWith(r)}}};customElements.define(Et,Ce);var X=class extends b{static properties={size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}};constructor(){super(),this.size="m",this.alt=""}render(){let{href:e}=this;return e?c`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:c` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}static styles=k`
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
    `};customElements.define("merch-icon",X);var _t=localStorage.getItem("masAccessToken"),mt={Authorization:`Bearer ${_t}`,pragma:"no-cache","cache-control":"no-cache"};async function St({path:o,query:e}){let t={};o&&(t.path=o),e&&(t.fullText={text:encodeURIComponent(e),queryMode:"EXACT_WORDS"});let r=new URLSearchParams({query:JSON.stringify({filter:t})}).toString();return fetch(`${this.cfSearchUrl}?${r}`,{headers:mt}).then(n=>n.json()).then(({items:n})=>n)}async function Ct(o){return fetch(`${this.cfFragmentsUrl}?path=${o}`,{headers:mt}).then(e=>e.json()).then(({items:[e]})=>e)}var ee=class{sites={cf:{fragments:{search:St.bind(this),getCfByPath:Ct.bind(this)}}};constructor(e){let r=`${`https://${e}.adobeaemcloud.com`}/adobe/sites`;this.cfFragmentsUrl=`${r}/cf/fragments`,this.cfSearchUrl=`${this.cfFragmentsUrl}/search`}};var pt="aem-bucket",gt={catalog:{name:"catalog",title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},ah:{name:"ah",title:{tag:"h3",slot:"heading-xxs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xxs"},ctas:{size:"s"}},"ccd-action":{name:"ccd-action",title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}}};async function At(o,e){let t=o.fields.reduce((a,{name:i,multiple:h,values:s})=>(a[i]=h?s:s[0],a),{}),{type:r="catalog"}=t,n=gt[r]||gt.catalog;if(e.variant=r,e.setAttribute("variant",r),t.icon?.forEach(a=>{let i=T("merch-icon",{slot:"icons",src:a,alt:"",href:"",size:"l"});e.append(i)}),t.title&&e.append(T(n.title.tag,{slot:n.title.slot},t.title)),t.prices){let a=t.prices,i=T(n.prices.tag,{slot:n.prices.slot},a);e.append(i)}if(e.append(T("p",{slot:"body-xxs",id:"individuals1"},"Desktop")),t.description){let a=T(n.description.tag,{slot:n.description.slot},t.description);e.append(a)}if(t.ctas){let a=t.ctas,i=T("div",{slot:"footer"},a);e.append(i)}}var Ae=class{#e=new Map;clear(){this.#e.clear()}add(...e){e.forEach(t=>{let{path:r}=t;r&&this.#e.set(r,t)})}has(e){return this.#e.has(e)}get(e){return this.#e.get(e)}remove(e){this.#e.delete(e)}},ut=new Ae,ke=class extends HTMLElement{#e;cache=ut;path;static get observedAttributes(){return["source","path"]}attributeChangedCallback(e,t,r){this[e]=r}connectedCallback(){let e=this.getAttribute(pt)??document.querySelector("mas-studio")?.getAttribute(pt);this.#e=new ee(e),this.fetchData()}refresh(){this.cache.remove(this.path),this.fetchData()}async fetchData(){let e=ut.get(this.path);if(e||(e=await this.#e.sites.cf.fragments.getCfByPath(this.path)),e){At(e,this.parentElement),this.render();return}this.render()}async render(){this.isConnected&&this.parentElement.tagName==="MERCH-CARD"&&await Promise.all([...this.parentElement.querySelectorAll('[is="inline-price"],[is="checkout-link"]')].map(e=>e.onceSettled()))}};customElements.define("merch-datasource",ke);
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
//# sourceMappingURL=merch-card-all.js.map
