var ee=window,re=ee.ShadowRoot&&(ee.ShadyCSS===void 0||ee.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Xe=Symbol(),Ze=new WeakMap,te=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(re&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=Ze.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&Ze.set(t,e))}return e}toString(){return this.cssText}},et=o=>new te(typeof o=="string"?o:o+"",void 0,Xe);var fe=(o,e)=>{re?o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(t=>{let r=document.createElement("style"),n=ee.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=t.cssText,o.appendChild(r)})},ne=re?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return et(t)})(o):o;var ve,oe=window,tt=oe.trustedTypes,Qt=tt?tt.emptyScript:"",rt=oe.reactiveElementPolyfillSupport,ye={toAttribute(o,e){switch(e){case Boolean:o=o?Qt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},nt=(o,e)=>e!==o&&(e==e||o==o),xe={attribute:!0,type:String,converter:ye,reflect:!1,hasChanged:nt},be="finalized",S=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();let e=[];return this.elementProperties.forEach((t,r)=>{let n=this._$Ep(r,t);n!==void 0&&(this._$Ev.set(n,r),e.push(n))}),e}static createProperty(e,t=xe){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){let r=typeof e=="symbol"?Symbol():"__"+e,n=this.getPropertyDescriptor(e,r,t);n!==void 0&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(n){let i=this[e];this[t]=n,this.requestUpdate(e,i,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||xe}static finalize(){if(this.hasOwnProperty(be))return!1;this[be]=!0;let e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let t=this.properties,r=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(let n of r)this.createProperty(n,t[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let n of r)t.unshift(ne(n))}else e!==void 0&&t.push(ne(e));return t}static _$Ep(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(t=>t(this))}addController(e){var t,r;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)===null||r===void 0||r.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;let t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return fe(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostConnected)===null||r===void 0?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostDisconnected)===null||r===void 0?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=xe){var n;let i=this.constructor._$Ep(e,r);if(i!==void 0&&r.reflect===!0){let s=(((n=r.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?r.converter:ye).toAttribute(t,r.type);this._$El=e,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(e,t){var r;let n=this.constructor,i=n._$Ev.get(e);if(i!==void 0&&this._$El!==i){let s=n.getPropertyOptions(i),h=typeof s.converter=="function"?{fromAttribute:s.converter}:((r=s.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?s.converter:ye;this._$El=i,this[i]=h.fromAttribute(t,s.type),this._$El=null}}requestUpdate(e,t,r){let n=!0;e!==void 0&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||nt)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,r))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,i)=>this[i]=n),this._$Ei=void 0);let t=!1,r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(e=this._$ES)===null||e===void 0||e.forEach(n=>{var i;return(i=n.hostUpdate)===null||i===void 0?void 0:i.call(n)}),this.update(r)):this._$Ek()}catch(n){throw t=!1,this._$Ek(),n}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostUpdated)===null||n===void 0?void 0:n.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((t,r)=>this._$EO(r,this[r],t)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};S[be]=!0,S.elementProperties=new Map,S.elementStyles=[],S.shadowRootOptions={mode:"open"},rt?.({ReactiveElement:S}),((ve=oe.reactiveElementVersions)!==null&&ve!==void 0?ve:oe.reactiveElementVersions=[]).push("1.6.3");var $e,ie=window,U=ie.trustedTypes,ot=U?U.createPolicy("lit-html",{createHTML:o=>o}):void 0,_e="$lit$",E=`lit$${(Math.random()+"").slice(9)}$`,dt="?"+E,Zt=`<${dt}>`,T=document,se=()=>T.createComment(""),W=o=>o===null||typeof o!="object"&&typeof o!="function",mt=Array.isArray,Xt=o=>mt(o)||typeof o?.[Symbol.iterator]=="function",we=`[ 	
\f\r]`,q=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,it=/-->/g,st=/>/g,C=RegExp(`>|${we}(?:([^\\s"'>=/]+)(${we}*=${we}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),at=/'/g,ct=/"/g,pt=/^(?:script|style|textarea|title)$/i,gt=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),xr=gt(1),yr=gt(2),F=Symbol.for("lit-noChange"),f=Symbol.for("lit-nothing"),ht=new WeakMap,k=T.createTreeWalker(T,129,null,!1);function ut(o,e){if(!Array.isArray(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return ot!==void 0?ot.createHTML(e):e}var er=(o,e)=>{let t=o.length-1,r=[],n,i=e===2?"<svg>":"",s=q;for(let h=0;h<t;h++){let a=o[h],c,l,d=-1,m=0;for(;m<a.length&&(s.lastIndex=m,l=s.exec(a),l!==null);)m=s.lastIndex,s===q?l[1]==="!--"?s=it:l[1]!==void 0?s=st:l[2]!==void 0?(pt.test(l[2])&&(n=RegExp("</"+l[2],"g")),s=C):l[3]!==void 0&&(s=C):s===C?l[0]===">"?(s=n??q,d=-1):l[1]===void 0?d=-2:(d=s.lastIndex-l[2].length,c=l[1],s=l[3]===void 0?C:l[3]==='"'?ct:at):s===ct||s===at?s=C:s===it||s===st?s=q:(s=C,n=void 0);let g=s===C&&o[h+1].startsWith("/>")?" ":"";i+=s===q?a+Zt:d>=0?(r.push(c),a.slice(0,d)+_e+a.slice(d)+E+g):a+E+(d===-2?(r.push(void 0),h):g)}return[ut(o,i+(o[t]||"<?>")+(e===2?"</svg>":"")),r]},G=class o{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let i=0,s=0,h=e.length-1,a=this.parts,[c,l]=er(e,t);if(this.el=o.createElement(c,r),k.currentNode=this.el.content,t===2){let d=this.el.content,m=d.firstChild;m.remove(),d.append(...m.childNodes)}for(;(n=k.nextNode())!==null&&a.length<h;){if(n.nodeType===1){if(n.hasAttributes()){let d=[];for(let m of n.getAttributeNames())if(m.endsWith(_e)||m.startsWith(E)){let g=l[s++];if(d.push(m),g!==void 0){let L=n.getAttribute(g.toLowerCase()+_e).split(E),b=/([.?@])?(.*)/.exec(g);a.push({type:1,index:i,name:b[2],strings:L,ctor:b[1]==="."?Ae:b[1]==="?"?Se:b[1]==="@"?Ce:D})}else a.push({type:6,index:i})}for(let m of d)n.removeAttribute(m)}if(pt.test(n.tagName)){let d=n.textContent.split(E),m=d.length-1;if(m>0){n.textContent=U?U.emptyScript:"";for(let g=0;g<m;g++)n.append(d[g],se()),k.nextNode(),a.push({type:2,index:++i});n.append(d[m],se())}}}else if(n.nodeType===8)if(n.data===dt)a.push({type:2,index:i});else{let d=-1;for(;(d=n.data.indexOf(E,d+1))!==-1;)a.push({type:7,index:i}),d+=E.length-1}i++}}static createElement(e,t){let r=T.createElement("template");return r.innerHTML=e,r}};function B(o,e,t=o,r){var n,i,s,h;if(e===F)return e;let a=r!==void 0?(n=t._$Co)===null||n===void 0?void 0:n[r]:t._$Cl,c=W(e)?void 0:e._$litDirective$;return a?.constructor!==c&&((i=a?._$AO)===null||i===void 0||i.call(a,!1),c===void 0?a=void 0:(a=new c(o),a._$AT(o,t,r)),r!==void 0?((s=(h=t)._$Co)!==null&&s!==void 0?s:h._$Co=[])[r]=a:t._$Cl=a),a!==void 0&&(e=B(o,a._$AS(o,e.values),a,r)),e}var Ee=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;let{el:{content:r},parts:n}=this._$AD,i=((t=e?.creationScope)!==null&&t!==void 0?t:T).importNode(r,!0);k.currentNode=i;let s=k.nextNode(),h=0,a=0,c=n[0];for(;c!==void 0;){if(h===c.index){let l;c.type===2?l=new ae(s,s.nextSibling,this,e):c.type===1?l=new c.ctor(s,c.name,c.strings,this,e):c.type===6&&(l=new ke(s,this,e)),this._$AV.push(l),c=n[++a]}h!==c?.index&&(s=k.nextNode(),h++)}return k.currentNode=T,i}v(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},ae=class o{constructor(e,t,r,n){var i;this.type=2,this._$AH=f,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cp=(i=n?.isConnected)===null||i===void 0||i}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=B(this,e,t),W(e)?e===f||e==null||e===""?(this._$AH!==f&&this._$AR(),this._$AH=f):e!==this._$AH&&e!==F&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):Xt(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==f&&W(this._$AH)?this._$AA.nextSibling.data=e:this.$(T.createTextNode(e)),this._$AH=e}g(e){var t;let{values:r,_$litType$:n}=e,i=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=G.createElement(ut(n.h,n.h[0]),this.options)),n);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===i)this._$AH.v(r);else{let s=new Ee(i,this),h=s.u(this.options);s.v(r),this.$(h),this._$AH=s}}_$AC(e){let t=ht.get(e.strings);return t===void 0&&ht.set(e.strings,t=new G(e)),t}T(e){mt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,n=0;for(let i of e)n===t.length?t.push(r=new o(this.k(se()),this.k(se()),this,this.options)):r=t[n],r._$AI(i),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,t);e&&e!==this._$AB;){let n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}},D=class{constructor(e,t,r,n,i){this.type=1,this._$AH=f,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=f}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,n){let i=this.strings,s=!1;if(i===void 0)e=B(this,e,t,0),s=!W(e)||e!==this._$AH&&e!==F,s&&(this._$AH=e);else{let h=e,a,c;for(e=i[0],a=0;a<i.length-1;a++)c=B(this,h[r+a],t,a),c===F&&(c=this._$AH[a]),s||(s=!W(c)||c!==this._$AH[a]),c===f?e=f:e!==f&&(e+=(c??"")+i[a+1]),this._$AH[a]=c}s&&!n&&this.j(e)}j(e){e===f?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Ae=class extends D{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===f?void 0:e}},tr=U?U.emptyScript:"",Se=class extends D{constructor(){super(...arguments),this.type=4}j(e){e&&e!==f?this.element.setAttribute(this.name,tr):this.element.removeAttribute(this.name)}},Ce=class extends D{constructor(e,t,r,n,i){super(e,t,r,n,i),this.type=5}_$AI(e,t=this){var r;if((e=(r=B(this,e,t,0))!==null&&r!==void 0?r:f)===F)return;let n=this._$AH,i=e===f&&n!==f||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,s=e!==f&&(n===f||i);i&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;typeof this._$AH=="function"?this._$AH.call((r=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&r!==void 0?r:this.element,e):this._$AH.handleEvent(e)}},ke=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){B(this,e)}};var lt=ie.litHtmlPolyfillSupport;lt?.(G,ae),(($e=ie.litHtmlVersions)!==null&&$e!==void 0?$e:ie.litHtmlVersions=[]).push("2.8.0");var ce=window,he=ce.ShadowRoot&&(ce.ShadyCSS===void 0||ce.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Te=Symbol(),ft=new WeakMap,K=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==Te)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(he&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=ft.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&ft.set(t,e))}return e}toString(){return this.cssText}},w=o=>new K(typeof o=="string"?o:o+"",void 0,Te),R=(o,...e)=>{let t=o.length===1?o[0]:e.reduce((r,n,i)=>r+(s=>{if(s._$cssResult$===!0)return s.cssText;if(typeof s=="number")return s;throw Error("Value passed to 'css' function must be a 'css' function result: "+s+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+o[i+1],o[0]);return new K(t,o,Te)},Re=(o,e)=>{he?o.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(t=>{let r=document.createElement("style"),n=ce.litNonce;n!==void 0&&r.setAttribute("nonce",n),r.textContent=t.cssText,o.appendChild(r)})},le=he?o=>o:o=>o instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return w(t)})(o):o;var ze,de=window,vt=de.trustedTypes,rr=vt?vt.emptyScript:"",xt=de.reactiveElementPolyfillSupport,Ne={toAttribute(o,e){switch(e){case Boolean:o=o?rr:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,e){let t=o;switch(e){case Boolean:t=o!==null;break;case Number:t=o===null?null:Number(o);break;case Object:case Array:try{t=JSON.parse(o)}catch{t=null}}return t}},yt=(o,e)=>e!==o&&(e==e||o==o),Oe={attribute:!0,type:String,converter:Ne,reflect:!1,hasChanged:yt},Me="finalized",_=class extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(e){var t;this.finalize(),((t=this.h)!==null&&t!==void 0?t:this.h=[]).push(e)}static get observedAttributes(){this.finalize();let e=[];return this.elementProperties.forEach((t,r)=>{let n=this._$Ep(r,t);n!==void 0&&(this._$Ev.set(n,r),e.push(n))}),e}static createProperty(e,t=Oe){if(t.state&&(t.attribute=!1),this.finalize(),this.elementProperties.set(e,t),!t.noAccessor&&!this.prototype.hasOwnProperty(e)){let r=typeof e=="symbol"?Symbol():"__"+e,n=this.getPropertyDescriptor(e,r,t);n!==void 0&&Object.defineProperty(this.prototype,e,n)}}static getPropertyDescriptor(e,t,r){return{get(){return this[t]},set(n){let i=this[e];this[t]=n,this.requestUpdate(e,i,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)||Oe}static finalize(){if(this.hasOwnProperty(Me))return!1;this[Me]=!0;let e=Object.getPrototypeOf(this);if(e.finalize(),e.h!==void 0&&(this.h=[...e.h]),this.elementProperties=new Map(e.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){let t=this.properties,r=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(let n of r)this.createProperty(n,t[n])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let n of r)t.unshift(le(n))}else e!==void 0&&t.push(le(e));return t}static _$Ep(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}_$Eu(){var e;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(e=this.constructor.h)===null||e===void 0||e.forEach(t=>t(this))}addController(e){var t,r;((t=this._$ES)!==null&&t!==void 0?t:this._$ES=[]).push(e),this.renderRoot!==void 0&&this.isConnected&&((r=e.hostConnected)===null||r===void 0||r.call(e))}removeController(e){var t;(t=this._$ES)===null||t===void 0||t.splice(this._$ES.indexOf(e)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((e,t)=>{this.hasOwnProperty(t)&&(this._$Ei.set(t,this[t]),delete this[t])})}createRenderRoot(){var e;let t=(e=this.shadowRoot)!==null&&e!==void 0?e:this.attachShadow(this.constructor.shadowRootOptions);return Re(t,this.constructor.elementStyles),t}connectedCallback(){var e;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostConnected)===null||r===void 0?void 0:r.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$ES)===null||e===void 0||e.forEach(t=>{var r;return(r=t.hostDisconnected)===null||r===void 0?void 0:r.call(t)})}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$EO(e,t,r=Oe){var n;let i=this.constructor._$Ep(e,r);if(i!==void 0&&r.reflect===!0){let s=(((n=r.converter)===null||n===void 0?void 0:n.toAttribute)!==void 0?r.converter:Ne).toAttribute(t,r.type);this._$El=e,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$El=null}}_$AK(e,t){var r;let n=this.constructor,i=n._$Ev.get(e);if(i!==void 0&&this._$El!==i){let s=n.getPropertyOptions(i),h=typeof s.converter=="function"?{fromAttribute:s.converter}:((r=s.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?s.converter:Ne;this._$El=i,this[i]=h.fromAttribute(t,s.type),this._$El=null}}requestUpdate(e,t,r){let n=!0;e!==void 0&&(((r=r||this.constructor.getPropertyOptions(e)).hasChanged||yt)(this[e],t)?(this._$AL.has(e)||this._$AL.set(e,t),r.reflect===!0&&this._$El!==e&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(e,r))):n=!1),!this.isUpdatePending&&n&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((n,i)=>this[i]=n),this._$Ei=void 0);let t=!1,r=this._$AL;try{t=this.shouldUpdate(r),t?(this.willUpdate(r),(e=this._$ES)===null||e===void 0||e.forEach(n=>{var i;return(i=n.hostUpdate)===null||i===void 0?void 0:i.call(n)}),this.update(r)):this._$Ek()}catch(n){throw t=!1,this._$Ek(),n}t&&this._$AE(r)}willUpdate(e){}_$AE(e){var t;(t=this._$ES)===null||t===void 0||t.forEach(r=>{var n;return(n=r.hostUpdated)===null||n===void 0?void 0:n.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(e){return!0}update(e){this._$EC!==void 0&&(this._$EC.forEach((t,r)=>this._$EO(r,this[r],t)),this._$EC=void 0),this._$Ek()}updated(e){}firstUpdated(e){}};_[Me]=!0,_.elementProperties=new Map,_.elementStyles=[],_.shadowRootOptions={mode:"open"},xt?.({ReactiveElement:_}),((ze=de.reactiveElementVersions)!==null&&ze!==void 0?ze:de.reactiveElementVersions=[]).push("1.6.3");var Pe,me=window,I=me.trustedTypes,bt=I?I.createPolicy("lit-html",{createHTML:o=>o}):void 0,Le="$lit$",A=`lit$${(Math.random()+"").slice(9)}$`,Ct="?"+A,nr=`<${Ct}>`,N=document,J=()=>N.createComment(""),Q=o=>o===null||typeof o!="object"&&typeof o!="function",kt=Array.isArray,or=o=>kt(o)||typeof o?.[Symbol.iterator]=="function",He=`[ 	
\f\r]`,Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$t=/-->/g,wt=/>/g,z=RegExp(`>|${He}(?:([^\\s"'>=/]+)(${He}*=${He}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_t=/'/g,Et=/"/g,Tt=/^(?:script|style|textarea|title)$/i,Rt=o=>(e,...t)=>({_$litType$:o,strings:e,values:t}),p=Rt(1),Ar=Rt(2),M=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),At=new WeakMap,O=N.createTreeWalker(N,129,null,!1);function zt(o,e){if(!Array.isArray(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return bt!==void 0?bt.createHTML(e):e}var ir=(o,e)=>{let t=o.length-1,r=[],n,i=e===2?"<svg>":"",s=Y;for(let h=0;h<t;h++){let a=o[h],c,l,d=-1,m=0;for(;m<a.length&&(s.lastIndex=m,l=s.exec(a),l!==null);)m=s.lastIndex,s===Y?l[1]==="!--"?s=$t:l[1]!==void 0?s=wt:l[2]!==void 0?(Tt.test(l[2])&&(n=RegExp("</"+l[2],"g")),s=z):l[3]!==void 0&&(s=z):s===z?l[0]===">"?(s=n??Y,d=-1):l[1]===void 0?d=-2:(d=s.lastIndex-l[2].length,c=l[1],s=l[3]===void 0?z:l[3]==='"'?Et:_t):s===Et||s===_t?s=z:s===$t||s===wt?s=Y:(s=z,n=void 0);let g=s===z&&o[h+1].startsWith("/>")?" ":"";i+=s===Y?a+nr:d>=0?(r.push(c),a.slice(0,d)+Le+a.slice(d)+A+g):a+A+(d===-2?(r.push(void 0),h):g)}return[zt(o,i+(o[t]||"<?>")+(e===2?"</svg>":"")),r]},Z=class o{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let i=0,s=0,h=e.length-1,a=this.parts,[c,l]=ir(e,t);if(this.el=o.createElement(c,r),O.currentNode=this.el.content,t===2){let d=this.el.content,m=d.firstChild;m.remove(),d.append(...m.childNodes)}for(;(n=O.nextNode())!==null&&a.length<h;){if(n.nodeType===1){if(n.hasAttributes()){let d=[];for(let m of n.getAttributeNames())if(m.endsWith(Le)||m.startsWith(A)){let g=l[s++];if(d.push(m),g!==void 0){let L=n.getAttribute(g.toLowerCase()+Le).split(A),b=/([.?@])?(.*)/.exec(g);a.push({type:1,index:i,name:b[2],strings:L,ctor:b[1]==="."?Be:b[1]==="?"?De:b[1]==="@"?Ie:V})}else a.push({type:6,index:i})}for(let m of d)n.removeAttribute(m)}if(Tt.test(n.tagName)){let d=n.textContent.split(A),m=d.length-1;if(m>0){n.textContent=I?I.emptyScript:"";for(let g=0;g<m;g++)n.append(d[g],J()),O.nextNode(),a.push({type:2,index:++i});n.append(d[m],J())}}}else if(n.nodeType===8)if(n.data===Ct)a.push({type:2,index:i});else{let d=-1;for(;(d=n.data.indexOf(A,d+1))!==-1;)a.push({type:7,index:i}),d+=A.length-1}i++}}static createElement(e,t){let r=N.createElement("template");return r.innerHTML=e,r}};function j(o,e,t=o,r){var n,i,s,h;if(e===M)return e;let a=r!==void 0?(n=t._$Co)===null||n===void 0?void 0:n[r]:t._$Cl,c=Q(e)?void 0:e._$litDirective$;return a?.constructor!==c&&((i=a?._$AO)===null||i===void 0||i.call(a,!1),c===void 0?a=void 0:(a=new c(o),a._$AT(o,t,r)),r!==void 0?((s=(h=t)._$Co)!==null&&s!==void 0?s:h._$Co=[])[r]=a:t._$Cl=a),a!==void 0&&(e=j(o,a._$AS(o,e.values),a,r)),e}var Ue=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){var t;let{el:{content:r},parts:n}=this._$AD,i=((t=e?.creationScope)!==null&&t!==void 0?t:N).importNode(r,!0);O.currentNode=i;let s=O.nextNode(),h=0,a=0,c=n[0];for(;c!==void 0;){if(h===c.index){let l;c.type===2?l=new X(s,s.nextSibling,this,e):c.type===1?l=new c.ctor(s,c.name,c.strings,this,e):c.type===6&&(l=new je(s,this,e)),this._$AV.push(l),c=n[++a]}h!==c?.index&&(s=O.nextNode(),h++)}return O.currentNode=N,i}v(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},X=class o{constructor(e,t,r,n){var i;this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cp=(i=n?.isConnected)===null||i===void 0||i}get _$AU(){var e,t;return(t=(e=this._$AM)===null||e===void 0?void 0:e._$AU)!==null&&t!==void 0?t:this._$Cp}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=j(this,e,t),Q(e)?e===u||e==null||e===""?(this._$AH!==u&&this._$AR(),this._$AH=u):e!==this._$AH&&e!==M&&this._(e):e._$litType$!==void 0?this.g(e):e.nodeType!==void 0?this.$(e):or(e)?this.T(e):this._(e)}k(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}$(e){this._$AH!==e&&(this._$AR(),this._$AH=this.k(e))}_(e){this._$AH!==u&&Q(this._$AH)?this._$AA.nextSibling.data=e:this.$(N.createTextNode(e)),this._$AH=e}g(e){var t;let{values:r,_$litType$:n}=e,i=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=Z.createElement(zt(n.h,n.h[0]),this.options)),n);if(((t=this._$AH)===null||t===void 0?void 0:t._$AD)===i)this._$AH.v(r);else{let s=new Ue(i,this),h=s.u(this.options);s.v(r),this.$(h),this._$AH=s}}_$AC(e){let t=At.get(e.strings);return t===void 0&&At.set(e.strings,t=new Z(e)),t}T(e){kt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,n=0;for(let i of e)n===t.length?t.push(r=new o(this.k(J()),this.k(J()),this,this.options)):r=t[n],r._$AI(i),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,t);e&&e!==this._$AB;){let n=e.nextSibling;e.remove(),e=n}}setConnected(e){var t;this._$AM===void 0&&(this._$Cp=e,(t=this._$AP)===null||t===void 0||t.call(this,e))}},V=class{constructor(e,t,r,n,i){this.type=1,this._$AH=u,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=u}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(e,t=this,r,n){let i=this.strings,s=!1;if(i===void 0)e=j(this,e,t,0),s=!Q(e)||e!==this._$AH&&e!==M,s&&(this._$AH=e);else{let h=e,a,c;for(e=i[0],a=0;a<i.length-1;a++)c=j(this,h[r+a],t,a),c===M&&(c=this._$AH[a]),s||(s=!Q(c)||c!==this._$AH[a]),c===u?e=u:e!==u&&(e+=(c??"")+i[a+1]),this._$AH[a]=c}s&&!n&&this.j(e)}j(e){e===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Be=class extends V{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===u?void 0:e}},sr=I?I.emptyScript:"",De=class extends V{constructor(){super(...arguments),this.type=4}j(e){e&&e!==u?this.element.setAttribute(this.name,sr):this.element.removeAttribute(this.name)}},Ie=class extends V{constructor(e,t,r,n,i){super(e,t,r,n,i),this.type=5}_$AI(e,t=this){var r;if((e=(r=j(this,e,t,0))!==null&&r!==void 0?r:u)===M)return;let n=this._$AH,i=e===u&&n!==u||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,s=e!==u&&(n===u||i);i&&this.element.removeEventListener(this.name,this,n),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t,r;typeof this._$AH=="function"?this._$AH.call((r=(t=this.options)===null||t===void 0?void 0:t.host)!==null&&r!==void 0?r:this.element,e):this._$AH.handleEvent(e)}},je=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){j(this,e)}};var St=me.litHtmlPolyfillSupport;St?.(Z,X),((Pe=me.litHtmlVersions)!==null&&Pe!==void 0?Pe:me.litHtmlVersions=[]).push("2.8.0");var Ot=(o,e,t)=>{var r,n;let i=(r=t?.renderBefore)!==null&&r!==void 0?r:e,s=i._$litPart$;if(s===void 0){let h=(n=t?.renderBefore)!==null&&n!==void 0?n:null;i._$litPart$=s=new X(e.insertBefore(J(),h),h,void 0,t??{})}return s._$AI(o),s};var Ve,qe;var $=class extends _{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t;let r=super.createRenderRoot();return(e=(t=this.renderOptions).renderBefore)!==null&&e!==void 0||(t.renderBefore=r.firstChild),r}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ot(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)===null||e===void 0||e.setConnected(!1)}render(){return M}};$.finalized=!0,$._$litElement$=!0,(Ve=globalThis.litElementHydrateSupport)===null||Ve===void 0||Ve.call(globalThis,{LitElement:$});var Nt=globalThis.litElementPolyfillSupport;Nt?.({LitElement:$});((qe=globalThis.litElementVersions)!==null&&qe!==void 0?qe:globalThis.litElementVersions=[]).push("3.3.3");var P="(max-width: 767px)",pe="(max-width: 1199px)",x="(min-width: 768px)",v="(min-width: 1200px)",y="(min-width: 1600px)";var Mt=R`
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

    @media screen and ${w(pe)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${w(P)} {
        :host([variant='mini-compare-chart']) .top-section {
            padding-top: var(--consonant-merch-spacing-xs);
        }
        :host([variant='mini-compare-chart']) .mini-compare-chart-badge {
            font-size: var(--consonant-merch-card-detail-font-size);
            padding: 6px 8px;
            top: 10px;
        }
    }
    @media screen and ${w(v)} {
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
`,Pt=()=>{let o=[R`
        /* Tablet */
        @media screen and ${w(x)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                grid-column: span 3;
                width: 100%;
                max-width: var(--consonant-merch-card-tablet-wide-width);
                margin: 0 auto;
            }
        }

        /* Laptop */
        @media screen and ${w(v)} {
            :host([size='super-wide']) {
                grid-column: span 3;
            }
        `];return o.push(R`
        /* Large desktop */
        @media screen and ${w(y)} {
            :host([size='super-wide']) {
                grid-column: span 4;
            }
        }
    `),o};var[Ht,Lt,Ut,Bt,Dt,jr]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Tab"];var It=document.createElement("style");It.innerHTML=`
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

@media screen and ${P} {
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
@media screen and ${P} {
    :root {
        --consonant-merch-card-mini-compare-chart-width: 142px;
        --consonant-merch-card-segment-width: 276px;
        --consonant-merch-card-mini-compare-chart-wide-width: 302px;
        --consonant-merch-card-special-offers-width: 302px;
        --consonant-merch-card-twp-width: 300px;
    }
}


/* Tablet */
@media screen and ${x} {
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
@media screen and ${v} {
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
@media screen and ${x} {
    .two-merch-cards.plans,
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}

/* desktop */
@media screen and ${v} {
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
    }
}

/* Large desktop */
    @media screen and ${y} {
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
@media screen and ${x} {
    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

/* desktop */
@media screen and ${v} {
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

/* Large desktop */
    @media screen and ${y} {
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
@media screen and ${x} {
    .two-merch-cards.special-offers,
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(2, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

/* desktop */
@media screen and ${v} {
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

@media screen and ${y} {
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
@media screen and ${x} {
    .two-merch-cards.image,
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
    }
}

/* desktop */
@media screen and ${v} {
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
    }
}

/* Large desktop */
    @media screen and ${y} {
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
@media screen and ${x} {
    .two-merch-cards.segment,
    .three-merch-cards.segment,
    .four-merch-cards.segment {
        grid-template-columns: repeat(2, minmax(276px, var(--consonant-merch-card-segment-width)));
    }
}

/* desktop */
@media screen and ${v} {
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
@media screen and ${x} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${v} {
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
    }
}

/* Large desktop */
    @media screen and ${y} {
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
@media screen and ${x} {
    .one-merch-card.twp,
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* desktop */
@media screen and ${v} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Large desktop */
    @media screen and ${y} {
        .one-merch-card.twp
        .two-merch-cards.twp {
            grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
        }
        .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Mobile */
@media screen and ${P} {
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
@media screen and ${x} {
    .two-merch-cards.inline-heading,
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
    }
}

/* desktop */
@media screen and ${v} {
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
    }
}

/* Large desktop */
    @media screen and ${y} {
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
@media screen and ${x} {
    .two-merch-cards.ccd-action,
    .three-merch-cards.ccd-action,
    .four-merch-cards.ccd-action {
        grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-action-width));
    }
}

/* desktop */
@media screen and ${v} {
    .three-merch-cards.ccd-action,
    .four-merch-cards.ccd-action {
        grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-action-width));
    }
}

/* Large desktop */
    @media screen and ${y} {
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

@media screen and ${P} {
    .two-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
        flex: 1;
    }
}

@media screen and ${pe} {
    .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
        flex: 1;
    }
}

/* Tablet */
@media screen and ${x} {
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
@media screen and ${v} {
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

@media screen and ${y} {
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
`;document.head.appendChild(It);var jt="merch-offer-select:ready",Vt="merch-card:ready",qt="merch-card:action-menu-toggle";var We="merch-storage:change",Fe="merch-quantity-selector:change";function Wt(o){let e=[];function t(r){r.nodeType===Node.TEXT_NODE?e.push(r):r.childNodes.forEach(t)}return t(o),e}function H(o,e={},t){let r=document.createElement(o);r.innerHTML=t;for(let[n,i]of Object.entries(e))r.setAttribute(n,i);return r}var Ge="MERCH-CARD",ar="merch-card",cr=32,Ke="mini-compare-chart",Ft=o=>`--consonant-merch-card-footer-row-${o}-min-height`,Ye=class extends ${static properties={name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},borderColor:{type:String,attribute:"border-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},customHr:{type:Boolean,attribute:"custom-hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{let[t,r,n]=e.split(",");return{PUF:t,ABM:r,M2M:n}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(t=>{let[r,n,i]=t.split(":"),s=Number(n);return[r,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:e=>Object.entries(e).map(([t,{order:r,size:n}])=>[t,r,n].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object}};static styles=[Mt,...Pt()];customerSegment;marketSegment;constructor(){super(),this.filters={},this.types="",this.selected=!1}#e;updated(e){(e.has("badgeBackgroundColor")||e.has("borderColor"))&&(this.style.border=this.computedBorderStyle),this.updateComplete.then(async()=>{let r=Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]')).filter(n=>!n.closest('[slot="callout-content"]'));await Promise.all(r.map(n=>n.onceSettled())),this.adjustTitleWidth(),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows()})}get computedBorderStyle(){return this.variant!=="twp"?`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`:""}get evergreen(){return this.classList.contains("intro-pricing")}get stockCheckbox(){return this.checkboxLabel?p`<label id="stock-checkbox">
                    <input type="checkbox" @change=${this.toggleStockOffer}></input>
                    <span></span>
                    ${this.checkboxLabel}
                </label>`:""}get cardImage(){return p` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}get secureLabelFooter(){let e=this.secureLabel?p`<span class="secure-transaction-label"
                  >${this.secureLabel}</span
              >`:"";return p`<footer>${e}<slot name="footer"></slot></footer>`}get miniCompareFooter(){let e=this.secureLabel?p`<slot name="secure-transaction-label">
                  <span class="secure-transaction-label"
                      >${this.secureLabel}</span
                  ></slot
              >`:p`<slot name="secure-transaction-label"></slot>`;return p`<footer>${e}<slot name="footer"></slot></footer>`}get badge(){let e;if(!(!this.badgeBackgroundColor||!this.badgeColor||!this.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`),p`
            <div
                id="badge"
                class="${this.variant}-badge"
                style="background-color: ${this.badgeBackgroundColor};
                    color: ${this.badgeColor};
                    ${e}"
            >
                ${this.badgeText}
            </div>
        `}get badgeElement(){return this.shadowRoot.getElementById("badge")}getContainer(){return this.closest('[class*="-merch-cards"]')??this.parentElement}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}get isMobileOrTablet(){return window.matchMedia("(max-width: 1024px)").matches}async toggleStockOffer({target:e}){if(!this.stockOfferOsis)return;let t=this.checkoutLinks;if(t.length!==0)for(let r of t){await r.onceSettled();let n=r.value?.[0]?.planType;if(!n)return;let i=this.stockOfferOsis[n];if(!i)return;let s=r.dataset.wcsOsi.split(",").filter(h=>h!==i);e.checked&&s.push(i),r.dataset.wcsOsi=s.join(",")}}toggleActionMenu(e){let t=e?.type==="mouseleave"?!0:void 0,r=this.shadowRoot.querySelector('slot[name="action-menu-content"]');r&&(t||this.dispatchEvent(new CustomEvent(qt,{bubbles:!0,composed:!0,detail:{card:this.name,type:"action-menu"}})),r.classList.toggle("hidden",t))}handleQuantitySelection(e){let t=this.checkoutLinks;for(let r of t)r.dataset.quantity=e.detail.option}get titleElement(){return this.variant==="special-offers"?this.querySelector('[slot="detail-m"]'):this.querySelector('[slot="heading-xs"]')}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(e){let t={...this.filters};Object.keys(t).forEach(r=>{if(e){t[r].order=Math.min(t[r].order||2,2);return}let n=t[r].order;n===1||isNaN(n)||(t[r].order=Number(n)+1)}),this.filters=t}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}render(){if(!(!this.isConnected||this.style.display==="none"))switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"image":return this.renderImage();case"product":return this.renderProduct();case"inline-heading":return this.renderInlineHeading();case Ke:return this.renderMiniCompareChart();case"ccd-action":return this.renderCcdAction();case"twp":return this.renderTwp();default:return this.renderProduct()}}renderSpecialOffer(){return p`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?p`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:p`
                      <hr />
                      ${this.secureLabelFooter}
                  `}`}get promoBottom(){return this.classList.contains("promo-bottom")}renderSegment(){return p` ${this.badge}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":p`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?p`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
            </div>
            <hr />
            ${this.secureLabelFooter}`}renderPlans(){return p` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":p`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
                <slot name="body-xs"></slot>
                ${this.promoBottom?p`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
                ${this.stockCheckbox}
            </div>
            <slot name="quantity-select"></slot>
            ${this.secureLabelFooter}`}renderCatalog(){return p` <div class="body">
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
                ${this.promoBottom?"":p`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?p`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}`}renderImage(){return p`${this.cardImage}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?p`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:p`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
            </div>
            ${this.evergreen?p`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:p`
                      <hr />
                      ${this.secureLabelFooter}
                  `}`}renderInlineHeading(){return p` ${this.badge}
            <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot>
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="body-xs"></slot>
            </div>
            ${this.customHr?"":p`<hr />`} ${this.secureLabelFooter}`}renderProduct(){return p` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":p`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?p`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}`}renderMiniCompareChart(){let{badge:e}=this;return p` <div class="top-section${e?" badge":""}">
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
            <slot name="footer-rows"><slot name="body-s"></slot></slot>`}renderTwp(){return p`${this.badge}
            <div class="top-section">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs-top"></slot>
            </div>
            <div class="body">
                <slot name="body-xs"></slot>
            </div>
            <footer><slot name="footer"></slot></footer>`}get defaultSlot(){return this.querySelector(":scope > a:not([slot]),:scope > p:not([slot]),:scope > div:not([slot]),:scope > span:not([slot])")?p`<slot></slot>`:u}renderCcdAction(){return p` <div class="body">
            <slot name="icons"></slot> ${this.badge}
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            ${this.promoBottom?p`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:p`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
            <footer><slot name="footer"></slot></footer>
            ${this.defaultSlot}
        </div>`}connectedCallback(){super.connectedCallback(),this.#e=this.getContainer(),this.setAttribute("tabindex",this.getAttribute("tabindex")??"0"),this.addEventListener("keydown",this.keydownHandler),this.addEventListener("mouseleave",this.toggleActionMenu),this.addEventListener(Fe,this.handleQuantitySelection),this.addEventListener(jt,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.keydownHandler),this.removeEventListener(Fe,this.handleQuantitySelection),this.storageOptions?.removeEventListener(We,this.handleStorageChange)}appendInvisibleSpacesToFooterLinks(){[...this.querySelectorAll('[slot="footer"] a')].forEach(e=>{Wt(e).forEach(r=>{let s=r.textContent.split(" ").map(h=>h.match(/.{1,7}/g)?.join("\u200B")).join(" ");r.textContent=s})})}keydownHandler(e){let t=document.activeElement?.closest(Ge);if(!t)return;function r(l,d){let m=document.elementFromPoint(l,d)?.closest(Ge);m&&(t.selected=!1,e.preventDefault(),e.stopImmediatePropagation(),m.focus(),m.selected=!0,m.scrollIntoView({behavior:"smooth",block:"center"}))}let{x:n,y:i,width:s,height:h}=t.getBoundingClientRect(),a=64,{code:c}=e;if(c==="Tab"){let l=Array.from(this.querySelectorAll('a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select')),d=l[0],m=l[l.length-1];if(!e.shiftKey&&document.activeElement===m){let g=this.closest(".section");g||(g=document);let L=g.querySelectorAll(Ge),b=L[L.length-1];if(this===b)return;e.preventDefault(),e.stopImmediatePropagation()}else e.shiftKey&&document.activeElement===d&&(e.preventDefault(),e.stopImmediatePropagation())}else switch(c){case Ht:r(n-a,i);break;case Lt:r(n+s+a,i);break;case Ut:r(n,i-a);break;case Bt:r(n,i+h+a);break;case Dt:if(this.variant==="twp")return;this.footerSlot?.querySelector("a")?.click();break}}updateMiniCompareElementMinHeight(e,t){let r=`--consonant-merch-card-mini-compare-${t}-height`,n=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),i=parseInt(this.#e.style.getPropertyValue(r))||0;n>i&&this.#e.style.setProperty(r,`${n}px`)}async adjustTitleWidth(){if(!["segment","plans"].includes(this.variant))return;let e=this.getBoundingClientRect().width,t=this.badgeElement?.getBoundingClientRect().width||0;e===0||t===0||this.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-t-16)}px`)}async adjustMiniCompareBodySlots(){if(this.variant!==Ke||this.getBoundingClientRect().width===0)return;this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","price-commitment","offers","promo-text","callout-content","secure-transaction-label"].forEach(r=>this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(`slot[name="${r}"]`),r)),this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector("footer"),"footer");let t=this.shadowRoot.querySelector(".mini-compare-chart-badge");t&&t.textContent!==""&&this.#e.style.setProperty("--consonant-merch-card-mini-compare-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.variant!==Ke||this.getBoundingClientRect().width===0)return;[...this.querySelector('[slot="footer-rows"]').children].forEach((t,r)=>{let n=Math.max(cr,parseInt(window.getComputedStyle(t).height)||0),i=parseInt(this.#e.style.getPropertyValue(Ft(r+1)))||0;n>i&&this.#e.style.setProperty(Ft(r+1),`${n}px`)})}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let e=this.storageOptions?.selected;if(e){let t=this.querySelector(`merch-offer-select[storage="${e}"]`);if(t)return t}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(Vt,{bubbles:!0}))}handleStorageChange(){let e=this.closest("merch-card")?.offerSelect.cloneNode(!0);e&&this.dispatchEvent(new CustomEvent(We,{detail:{offerSelect:e},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(e){if(e===this.merchOffer)return;this.merchOffer=e;let t=this.dynamicPrice;if(e.price&&t){let r=e.price.cloneNode(!0);t.onceSettled?t.onceSettled().then(()=>{t.replaceWith(r)}):t.replaceWith(r)}}};customElements.define(ar,Ye);var ge=class extends ${static properties={size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}};constructor(){super(),this.size="m",this.alt=""}render(){let{href:e}=this;return e?p`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:p` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}static styles=R`
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
    `};customElements.define("merch-icon",ge);var hr=localStorage.getItem("masAccessToken"),Gt={Authorization:`Bearer ${hr}`,pragma:"no-cache","cache-control":"no-cache"};async function lr({path:o,query:e}){let t={};o&&(t.path=o),e&&(t.fullText={text:encodeURIComponent(e),queryMode:"EXACT_WORDS"});let r=new URLSearchParams({query:JSON.stringify({filter:t})}).toString();return fetch(`${this.cfSearchUrl}?${r}`,{headers:Gt}).then(n=>n.json()).then(({items:n})=>n)}async function dr(o){return fetch(`${this.cfFragmentsUrl}?path=${o}`,{headers:Gt}).then(e=>e.json()).then(({items:[e]})=>e)}var ue=class{sites={cf:{fragments:{search:lr.bind(this),getCfByPath:dr.bind(this)}}};constructor(e){let r=`${`https://${e}.adobeaemcloud.com`}/adobe/sites`;this.cfFragmentsUrl=`${r}/cf/fragments`,this.cfSearchUrl=`${this.cfFragmentsUrl}/search`}};var Kt="aem-bucket",Yt={catalog:{name:"catalog",title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},ah:{name:"ah",title:{tag:"h3",slot:"heading-xxs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xxs"},ctas:{size:"s"}},"ccd-action":{name:"ccd-action",title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}}};async function mr(o,e){let t=o.fields.reduce((i,{name:s,multiple:h,values:a})=>(i[s]=h?a:a[0],i),{}),{type:r="catalog"}=t,n=Yt[r]||Yt.catalog;if(e.variant=r,e.setAttribute("variant",r),t.icon?.forEach(i=>{let s=H("merch-icon",{slot:"icons",src:i,alt:"",href:"",size:"l"});e.append(s)}),t.title&&e.append(H(n.title.tag,{slot:n.title.slot},t.title)),t.prices){let i=t.prices,s=H(n.prices.tag,{slot:n.prices.slot},i);e.append(s)}if(e.append(H("p",{slot:"body-xxs",id:"individuals1"},"Desktop")),t.description){let i=H(n.description.tag,{slot:n.description.slot},t.description);e.append(i)}if(t.ctas){let i=t.ctas,s=H("div",{slot:"footer"},i);e.append(s)}}var Je=class{#e=new Map;clear(){this.#e.clear()}add(...e){e.forEach(t=>{let{path:r}=t;r&&this.#e.set(r,t)})}has(e){return this.#e.has(e)}get(e){return this.#e.get(e)}remove(e){this.#e.delete(e)}},Jt=new Je,Qe=class extends HTMLElement{#e;cache=Jt;path;static get observedAttributes(){return["source","path"]}attributeChangedCallback(e,t,r){this[e]=r}connectedCallback(){let e=this.getAttribute(Kt)??document.querySelector("mas-studio")?.getAttribute(Kt);this.#e=new ue(e),this.fetchData()}refresh(){this.cache.remove(this.path),this.fetchData()}async fetchData(){let e=Jt.get(this.path);if(e||(e=await this.#e.sites.cf.fragments.getCfByPath(this.path)),e){mr(e,this.parentElement),this.render();return}this.render()}async render(){this.isConnected&&this.parentElement.tagName==="MERCH-CARD"&&await Promise.all([...this.parentElement.querySelectorAll('[is="inline-price"],[is="checkout-link"]')].map(e=>e.onceSettled()))}};customElements.define("merch-datasource",Qe);
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
//# sourceMappingURL=merch-card-all.js.map
