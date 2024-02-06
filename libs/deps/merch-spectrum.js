// Tue, 06 Feb 2024 14:20:14 GMT
var Ia=Object.create;var qr=Object.defineProperty;var Ta=Object.getOwnPropertyDescriptor;var Sa=Object.getOwnPropertyNames;var ja=Object.getPrototypeOf,Aa=Object.prototype.hasOwnProperty;var E=(s,t)=>()=>(s&&(t=s(s=0)),t);var Da=(s,t)=>()=>(t||s((t={exports:{}}).exports,t),t.exports),La=(s,t)=>{for(var e in t)qr(s,e,{get:t[e],enumerable:!0})},Hr=(s,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Sa(t))!Aa.call(s,o)&&o!==e&&qr(s,o,{get:()=>t[o],enumerable:!(r=Ta(t,o))||r.enumerable});return s},St=(s,t,e)=>(Hr(s,t,"default"),e&&Hr(e,t,"default")),Oa=(s,t,e)=>(e=s!=null?Ia(ja(s)):{},Hr(t||!s||!s.__esModule?qr(e,"default",{value:s,enumerable:!0}):e,s));var wo,zo=E(()=>{wo="0.39.4"});import{LitElement as Ha}from"/libs/deps/lit-all.min.js";function Co(s){class t extends s{get isLTR(){return this.dir==="ltr"}hasVisibleFocusInTree(){let r=((o=document)=>{var a;let c=o.activeElement;for(;c!=null&&c.shadowRoot&&c.shadowRoot.activeElement;)c=c.shadowRoot.activeElement;let l=c?[c]:[];for(;c;){let u=c.assignedSlot||c.parentElement||((a=c.getRootNode())==null?void 0:a.host);u&&l.push(u),c=u}return l})(this.getRootNode())[0];if(!r)return!1;try{return r.matches(":focus-visible")||r.matches(".focus-visible")}catch{return r.matches(".focus-visible")}}connectedCallback(){if(!this.hasAttribute("dir")){let r=this.assignedSlot||this.parentNode;for(;r!==document.documentElement&&!Ba(r);)r=r.assignedSlot||r.parentNode||r.host;if(this.dir=r.dir==="rtl"?r.dir:this.dir||"ltr",r===document.documentElement)$r.add(this);else{let{localName:o}=r;o.search("-")>-1&&!customElements.get(o)?customElements.whenDefined(o).then(()=>{r.startManagingContentDirection(this)}):r.startManagingContentDirection(this)}this._dirParent=r}super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._dirParent&&(this._dirParent===document.documentElement?$r.delete(this):this._dirParent.stopManagingContentDirection(this),this.removeAttribute("dir"))}}return t}var $r,qa,$a,Ba,I,Eo=E(()=>{"use strict";zo();$r=new Set,qa=()=>{let s=document.documentElement.dir==="rtl"?document.documentElement.dir:"ltr";$r.forEach(t=>{t.setAttribute("dir",s)})},$a=new MutationObserver(qa);$a.observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});Ba=s=>typeof s.startManagingContentDirection<"u"||s.tagName==="SP-THEME";I=class extends Co(Ha){};I.VERSION=wo});import{property as Ma}from"/libs/deps/lit-all.min.js";function H(s,{validSizes:t=["s","m","l","xl"],noDefaultSize:e,defaultSize:r="m"}={}){class o extends s{constructor(){super(...arguments),this._size=r}get size(){return this._size||r}set size(c){let l=e?null:r,u=c&&c.toLocaleLowerCase(),m=t.includes(u)?u:l;if(m&&this.setAttribute("size",m),this._size===m)return;let d=this._size;this._size=m,this.requestUpdate("size",d)}update(c){!this.hasAttribute("size")&&!e&&this.setAttribute("size",this.size),super.update(c)}}return Ra([Ma({type:String,reflect:!0})],o.prototype,"size",1),o}var Fa,Ua,Ra,_a,Po=E(()=>{"use strict";Fa=Object.defineProperty,Ua=Object.getOwnPropertyDescriptor,Ra=(s,t,e,r)=>{for(var o=r>1?void 0:r?Ua(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Fa(t,e,o),o},_a={xxs:"xxs",xs:"xs",s:"s",m:"m",l:"l",xl:"xl",xxl:"xxl"}});var i={};La(i,{ElementSizes:()=>_a,SizedMixin:()=>H,SpectrumElement:()=>I,SpectrumMixin:()=>Co});import*as Mn from"/libs/deps/lit-all.min.js";var h=E(()=>{"use strict";Eo();Po();St(i,Mn)});var n={};import*as cl from"/libs/deps/lit-all.min.js";var S=E(()=>{"use strict";St(n,cl)});import{ifDefined as z}from"/libs/deps/lit-all.min.js";import{repeat as ul}from"/libs/deps/lit-all.min.js";import{classMap as jo}from"/libs/deps/lit-all.min.js";import{styleMap as Br}from"/libs/deps/lit-all.min.js";import{until as hl}from"/libs/deps/lit-all.min.js";import{live as Ao}from"/libs/deps/lit-all.min.js";import{when as vl}from"/libs/deps/lit-all.min.js";var tt=E(()=>{"use strict"});function Qt(s){class t extends s{renderAnchor({id:r,className:o,ariaHidden:a,labelledby:c,tabindex:l,anchorContent:u=i.html`<slot></slot>`}){return i.html`<a
                    id=${r}
                    class=${z(o)}
                    href=${z(this.href)}
                    download=${z(this.download)}
                    target=${z(this.target)}
                    aria-label=${z(this.label)}
                    aria-labelledby=${z(c)}
                    aria-hidden=${z(a?"true":void 0)}
                    tabindex=${z(l)}
                    rel=${z(this.rel)}
                >${u}</a>`}}return Ce([(0,n.property)({reflect:!0})],t.prototype,"download",2),Ce([(0,n.property)()],t.prototype,"label",2),Ce([(0,n.property)({reflect:!0})],t.prototype,"href",2),Ce([(0,n.property)({reflect:!0})],t.prototype,"target",2),Ce([(0,n.property)({reflect:!0})],t.prototype,"rel",2),t}var Ya,Za,Ce,Ee=E(()=>{"use strict";h();S();tt();Ya=Object.defineProperty,Za=Object.getOwnPropertyDescriptor,Ce=(s,t,e,r)=>{for(var o=r>1?void 0:r?Za(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Ya(t,e,o),o}});var Lo=Da((Fr,Do)=>{(function(s,t){typeof Fr=="object"&&typeof Do<"u"?t():typeof define=="function"&&define.amd?define(t):t()})(Fr,function(){"use strict";function s(e){var r=!0,o=!1,a=null,c={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function l(y){return!!(y&&y!==document&&y.nodeName!=="HTML"&&y.nodeName!=="BODY"&&"classList"in y&&"contains"in y.classList)}function u(y){var q=y.type,D=y.tagName;return!!(D==="INPUT"&&c[q]&&!y.readOnly||D==="TEXTAREA"&&!y.readOnly||y.isContentEditable)}function m(y){y.classList.contains("focus-visible")||(y.classList.add("focus-visible"),y.setAttribute("data-focus-visible-added",""))}function d(y){y.hasAttribute("data-focus-visible-added")&&(y.classList.remove("focus-visible"),y.removeAttribute("data-focus-visible-added"))}function p(y){y.metaKey||y.altKey||y.ctrlKey||(l(e.activeElement)&&m(e.activeElement),r=!0)}function f(y){r=!1}function g(y){l(y.target)&&(r||u(y.target))&&m(y.target)}function v(y){l(y.target)&&(y.target.classList.contains("focus-visible")||y.target.hasAttribute("data-focus-visible-added"))&&(o=!0,window.clearTimeout(a),a=window.setTimeout(function(){o=!1},100),d(y.target))}function x(y){document.visibilityState==="hidden"&&(o&&(r=!0),C())}function C(){document.addEventListener("mousemove",k),document.addEventListener("mousedown",k),document.addEventListener("mouseup",k),document.addEventListener("pointermove",k),document.addEventListener("pointerdown",k),document.addEventListener("pointerup",k),document.addEventListener("touchmove",k),document.addEventListener("touchstart",k),document.addEventListener("touchend",k)}function w(){document.removeEventListener("mousemove",k),document.removeEventListener("mousedown",k),document.removeEventListener("mouseup",k),document.removeEventListener("pointermove",k),document.removeEventListener("pointerdown",k),document.removeEventListener("pointerup",k),document.removeEventListener("touchmove",k),document.removeEventListener("touchstart",k),document.removeEventListener("touchend",k)}function k(y){y.target.nodeName&&y.target.nodeName.toLowerCase()==="html"||(r=!1,w())}document.addEventListener("keydown",p,!0),document.addEventListener("mousedown",f,!0),document.addEventListener("pointerdown",f,!0),document.addEventListener("touchstart",f,!0),document.addEventListener("visibilitychange",x,!0),C(),e.addEventListener("focus",g,!0),e.addEventListener("blur",v,!0),e.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&e.host?e.host.setAttribute("data-js-focus-visible",""):e.nodeType===Node.DOCUMENT_NODE&&(document.documentElement.classList.add("js-focus-visible"),document.documentElement.setAttribute("data-js-focus-visible",""))}if(typeof window<"u"&&typeof document<"u"){window.applyFocusVisiblePolyfill=s;var t;try{t=new CustomEvent("focus-visible-polyfill-ready")}catch{t=document.createEvent("CustomEvent"),t.initCustomEvent("focus-visible-polyfill-ready",!1,!1,{})}window.dispatchEvent(t)}typeof document<"u"&&s(document)})});var Ur,lt,Pe=E(()=>{"use strict";Ur=!0;try{document.body.querySelector(":focus-visible")}catch{Ur=!1,Promise.resolve().then(()=>Oa(Lo(),1))}lt=s=>{var t;let e=a=>{if(a.shadowRoot==null||a.hasAttribute("data-js-focus-visible"))return()=>{};if(self.applyFocusVisiblePolyfill)self.applyFocusVisiblePolyfill(a.shadowRoot),a.manageAutoFocus&&a.manageAutoFocus();else{let c=()=>{self.applyFocusVisiblePolyfill&&a.shadowRoot&&self.applyFocusVisiblePolyfill(a.shadowRoot),a.manageAutoFocus&&a.manageAutoFocus()};return self.addEventListener("focus-visible-polyfill-ready",c,{once:!0}),()=>{self.removeEventListener("focus-visible-polyfill-ready",c)}}return()=>{}},r=Symbol("endPolyfillCoordination");class o extends s{constructor(){super(...arguments),this[t]=null}connectedCallback(){super.connectedCallback&&super.connectedCallback(),Ur||requestAnimationFrame(()=>{this[r]==null&&(this[r]=e(this))})}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),Ur||requestAnimationFrame(()=>{this[r]!=null&&(this[r](),this[r]=null)})}}return t=r,o}});function Oo(){return new Promise(s=>requestAnimationFrame(()=>s()))}var Qa,Ja,Rr,U,Ft=E(()=>{"use strict";h();S();Pe();Qa=Object.defineProperty,Ja=Object.getOwnPropertyDescriptor,Rr=(s,t,e,r)=>{for(var o=r>1?void 0:r?Ja(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Qa(t,e,o),o};U=class extends lt(I){constructor(){super(...arguments),this.disabled=!1,this.autofocus=!1,this._tabIndex=0,this.manipulatingTabindex=!1,this._recentlyConnected=!1}get tabIndex(){if(this.focusElement===this){let e=this.hasAttribute("tabindex")?Number(this.getAttribute("tabindex")):NaN;return isNaN(e)?-1:e}let t=parseFloat(this.hasAttribute("tabindex")&&this.getAttribute("tabindex")||"0");return this.disabled||t<0?-1:this.focusElement?this.focusElement.tabIndex:t}set tabIndex(t){if(this.manipulatingTabindex){this.manipulatingTabindex=!1;return}if(this.focusElement===this){if(t!==this._tabIndex){this._tabIndex=t;let e=this.disabled?"-1":""+t;this.manipulatingTabindex=!0,this.setAttribute("tabindex",e)}return}if(t===-1?this.addEventListener("pointerdown",this.onPointerdownManagementOfTabIndex):(this.manipulatingTabindex=!0,this.removeEventListener("pointerdown",this.onPointerdownManagementOfTabIndex)),t===-1||this.disabled){this.setAttribute("tabindex","-1"),this.removeAttribute("focusable"),t!==-1&&this.manageFocusElementTabindex(t);return}this.setAttribute("focusable",""),this.hasAttribute("tabindex")?this.removeAttribute("tabindex"):this.manipulatingTabindex=!1,this.manageFocusElementTabindex(t)}onPointerdownManagementOfTabIndex(){this.tabIndex===-1&&(this.tabIndex=0,this.focus({preventScroll:!0}))}async manageFocusElementTabindex(t){this.focusElement||await this.updateComplete,t===null?this.focusElement.removeAttribute("tabindex"):this.focusElement.tabIndex=t}get focusElement(){throw new Error("Must implement focusElement getter!")}focus(t){this.disabled||!this.focusElement||(this.focusElement!==this?this.focusElement.focus(t):HTMLElement.prototype.focus.apply(this,[t]))}blur(){let t=this.focusElement||this;t!==this?t.blur():HTMLElement.prototype.blur.apply(this)}click(){if(this.disabled)return;let t=this.focusElement||this;t!==this?t.click():HTMLElement.prototype.click.apply(this)}manageAutoFocus(){this.autofocus&&(this.dispatchEvent(new KeyboardEvent("keydown",{code:"Tab"})),this.focusElement.focus())}firstUpdated(t){super.firstUpdated(t),(!this.hasAttribute("tabindex")||this.getAttribute("tabindex")!=="-1")&&this.setAttribute("focusable","")}update(t){t.has("disabled")&&this.handleDisabledChanged(this.disabled,t.get("disabled")),super.update(t)}updated(t){super.updated(t),t.has("disabled")&&this.disabled&&this.blur()}async handleDisabledChanged(t,e){let r=()=>this.focusElement!==this&&typeof this.focusElement.disabled<"u";t?(this.manipulatingTabindex=!0,this.setAttribute("tabindex","-1"),await this.updateComplete,r()?this.focusElement.disabled=!0:this.setAttribute("aria-disabled","true")):e&&(this.manipulatingTabindex=!0,this.focusElement===this?this.setAttribute("tabindex",""+this._tabIndex):this.removeAttribute("tabindex"),await this.updateComplete,r()?this.focusElement.disabled=!1:this.removeAttribute("aria-disabled"))}async getUpdateComplete(){let t=await super.getUpdateComplete();return this._recentlyConnected&&(this._recentlyConnected=!1,await Oo(),await Oo()),t}connectedCallback(){super.connectedCallback(),this._recentlyConnected=!0,this.updateComplete.then(()=>{this.manageAutoFocus()})}};Rr([(0,n.property)({type:Boolean,reflect:!0})],U.prototype,"disabled",2),Rr([(0,n.property)({type:Boolean})],U.prototype,"autofocus",2),Rr([(0,n.property)({type:Number})],U.prototype,"tabIndex",1)});var At,Me=E(()=>{At=class{constructor(t,{target:e,config:r,callback:o,skipInitial:a}){this.t=new Set,this.o=!1,this.i=!1,this.h=t,e!==null&&this.t.add(e??t),this.l=r,this.o=a??this.o,this.callback=o,window.MutationObserver?(this.u=new MutationObserver(c=>{this.handleChanges(c),this.h.requestUpdate()}),t.addController(this)):console.warn("MutationController error: browser does not support MutationObserver.")}handleChanges(t){this.value=this.callback?.(t,this.u)}hostConnected(){for(let t of this.t)this.observe(t)}hostDisconnected(){this.disconnect()}async hostUpdated(){let t=this.u.takeRecords();(t.length||!this.o&&this.i)&&this.handleChanges(t),this.i=!1}observe(t){this.t.add(t),this.u.observe(t,this.l),this.i=!0,this.h.requestUpdate()}disconnect(){this.u.disconnect()}}});function _e(s,t,e=[]){var r;let o=c=>l=>c.matches(l);class a extends s{constructor(...l){super(l),this.slotHasContent=!1,new At(this,{config:{characterData:!0,subtree:!0},callback:u=>{for(let m of u)if(m.type==="characterData"){this.manageTextObservedSlot();return}}})}manageTextObservedSlot(){if(!this[Mr])return;let l=[...this[Mr]].filter(u=>{let m=u;return m.tagName?!e.some(o(m)):m.textContent?m.textContent.trim():!1});this.slotHasContent=l.length>0}update(l){if(!this.hasUpdated){let{childNodes:u}=this,m=[...u].filter(d=>{let p=d;return p.tagName?e.some(o(p))?!1:t?p.getAttribute("slot")===t:!p.hasAttribute("slot"):p.textContent?p.textContent.trim():!1});this.slotHasContent=m.length>0}super.update(l)}firstUpdated(l){super.firstUpdated(l),this.updateComplete.then(()=>{this.manageTextObservedSlot()})}}return r=Mr,Ho([(0,n.property)({type:Boolean,attribute:!1})],a.prototype,"slotHasContent",2),Ho([(0,n.queryAssignedNodes)({slot:t,flatten:!0})],a.prototype,r,2),a}var tc,ec,Ho,Mr,_r=E(()=>{"use strict";S();Me();tc=Object.defineProperty,ec=Object.getOwnPropertyDescriptor,Ho=(s,t,e,r)=>{for(var o=r>1?void 0:r?ec(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&tc(t,e,o),o},Mr=Symbol("assignedNodes")});function b(s,t){window.__swc,customElements.define(s,t)}var P=E(()=>{"use strict"});var is,cs,xt,ns,ar=E(()=>{"use strict";is=["button","[focusable]","[href]","input","label","select","textarea","[tabindex]"],cs=':not([tabindex="-1"])',xt=is.join(`${cs}, `)+cs,ns=is.join(", ")});var Lt,ae,ce=E(()=>{"use strict";ar();Lt=s=>s.querySelector(xt),ae=s=>s.assignedElements().find(t=>t.matches(xt))});var ls=E(()=>{"use strict"});function cr(s,t){var e;let r=Array.isArray(t)?t:[t];class o extends s{constructor(...c){super(c),this[e]=new Map,this.managePresenceObservedSlot=()=>{let l=!1;r.forEach(u=>{let m=!!this.querySelector(`:scope > ${u}`),d=this[ie].get(u)||!1;l=l||d!==m,this[ie].set(u,!!this.querySelector(`:scope > ${u}`))}),l&&this.updateComplete.then(()=>{this.requestUpdate()})},new At(this,{config:{childList:!0,subtree:!0},callback:()=>{this.managePresenceObservedSlot()}}),this.managePresenceObservedSlot()}get slotContentIsPresent(){if(r.length===1)return this[ie].get(r[0])||!1;throw new Error("Multiple selectors provided to `ObserveSlotPresence` use `getSlotContentPresence(selector: string)` instead.")}getSlotContentPresence(c){if(this[ie].has(c))return this[ie].get(c)||!1;throw new Error(`The provided selector \`${c}\` is not being observed.`)}}return e=ie,o}var ie,us=E(()=>{"use strict";Me();ie=Symbol("slotContentIsPresent")});function Bc(s){return typeof window<"u"&&window.navigator!=null?s.test(window.navigator.userAgent):!1}function Xr(s){return typeof window<"u"&&window.navigator!=null?s.test(window.navigator.platform):!1}function Fc(){return Xr(/^Mac/)}function Uc(){return Xr(/^iPhone/)}function Rc(){return Xr(/^iPad/)||Fc()&&navigator.maxTouchPoints>1}function ms(){return Uc()||Rc()}function ps(){return Bc(/Android/)}var Yr=E(()=>{"use strict"});function Mc(s,t,e=[]){for(let r=0;r<t.length;++r){let o=t[r],a=s[r],c=a.parentElement||a.getRootNode();e[r]&&e[r](o),c&&c!==a&&c.replaceChild(o,a),delete s[r]}return t}var ds,Zr=E(()=>{"use strict";ds=(s,t,{position:e,prepareCallback:r}={position:"beforeend"})=>{let{length:o}=s;if(o===0)return()=>s;let a=1,c=0;(e==="afterbegin"||e==="afterend")&&(a=-1,c=o-1);let l=new Array(o),u=new Array(o),m=document.createComment("placeholder for reparented element");do{let d=s[c];r&&(u[c]=r(d)),l[c]=m.cloneNode();let p=d.parentElement||d.getRootNode();p&&p!==d&&p.replaceChild(l[c],d),t.insertAdjacentElement(e,d),c+=a}while(--o>0);return function(){return Mc(l,s,u)}}});var hs,Qr=E(()=>{"use strict";hs=(s,t)=>{if(s)return null;let e=t.assignedNodes().reduce((r,o)=>o.textContent?r+o.textContent:r,"");return e?e.trim():null}});var kt=E(()=>{"use strict";ce();Pe();Ft();ar();ls();Ee();us();_r();Yr();Zr();Qr()});function Nc(s,t,e){let r=s.getAttribute(t),o=r?r.split(/\s+/):[];o=o.filter(a=>!e.find(c=>a===c)),o.length?s.setAttribute(t,o.join(" ")):s.removeAttribute(t)}function ut(s,t,e){let r=Array.isArray(e)?e:[e],o=s.getAttribute(t),a=o?o.split(/\s+/):[];return r.every(c=>a.indexOf(c)>-1)?()=>{}:(a.push(...r),s.setAttribute(t,a.join(" ")),()=>Nc(s,t,r))}var ir=E(()=>{"use strict"});var to,hr,js=E(()=>{"use strict";to=Symbol("element resolver updated"),hr=class{constructor(t,{selector:e}={selector:""}){this._element=null,this._selector="",this.mutationCallback=r=>{let o=!1;r.forEach(a=>{if(!o){if(a.type==="childList"){let c=this.element&&[...a.removedNodes].includes(this.element),l=!!this.selector&&[...a.addedNodes].some(this.elementIsSelected);o=o||c||l}if(a.type==="attributes"){let c=a.target===this.element,l=!!this.selector&&this.elementIsSelected(a.target);o=o||c||l}}}),o&&this.resolveElement()},this.elementIsSelected=r=>{var o;return this.selectorIsId?r?.id===this.selectorAsId:(o=r?.matches)==null?void 0:o.call(r,this.selector)},this.host=t,this.selector=e,this.observer=new MutationObserver(this.mutationCallback),this.host.addController(this)}get element(){return this._element}set element(t){if(t===this.element)return;let e=this.element;this._element=t,this.host.requestUpdate(to,e)}get selector(){return this._selector}set selector(t){t!==this.selector&&(this.releaseElement(),this._selector=t,this.resolveElement())}get selectorAsId(){return this.selector.slice(1)}get selectorIsId(){return!!this.selector&&this.selector.startsWith("#")}hostConnected(){this.resolveElement(),this.observer.observe(this.host.getRootNode(),{subtree:!0,childList:!0,attributes:!0})}hostDisconnected(){this.releaseElement(),this.observer.disconnect()}resolveElement(){if(!this.selector){this.releaseElement();return}let t=this.host.getRootNode();this.element=this.selectorIsId?t.getElementById(this.selectorAsId):t.querySelector(this.selector)}releaseElement(){this.element=null}}});var gr,As=E(()=>{"use strict";gr=class{constructor(t={}){this.warmUpDelay=1e3,this.coolDownDelay=1e3,this.isWarm=!1,this.timeout=0,Object.assign(this,t)}async openTimer(t){if(this.cancelCooldownTimer(),!this.component||t!==this.component)return this.component&&(this.close(this.component),this.cancelCooldownTimer()),this.component=t,this.isWarm?!1:(this.promise=new Promise(e=>{this.resolve=e,this.timeout=window.setTimeout(()=>{this.resolve&&(this.resolve(!1),this.isWarm=!0)},this.warmUpDelay)}),this.promise);if(this.promise)return this.promise;throw new Error("Inconsistent state")}close(t){this.component&&this.component===t&&(this.resetCooldownTimer(),this.timeout>0&&(clearTimeout(this.timeout),this.timeout=0),this.resolve&&(this.resolve(!0),delete this.resolve),delete this.promise,delete this.component)}resetCooldownTimer(){this.isWarm&&(this.cooldownTimeout&&window.clearTimeout(this.cooldownTimeout),this.cooldownTimeout=window.setTimeout(()=>{this.isWarm=!1,delete this.cooldownTimeout},this.coolDownDelay))}cancelCooldownTimer(){this.cooldownTimeout&&window.clearTimeout(this.cooldownTimeout),delete this.cooldownTimeout}}});function Mt(){return new Promise(s=>requestAnimationFrame(()=>s()))}function Ds(){document.body.offsetHeight}var ue,dt,Ot,Ht,me,le,_t=E(()=>{"use strict";h();Zr();As();ue=new gr,dt=()=>{},Ot=class extends Event{constructor(){super("beforetoggle",{bubbles:!1,composed:!1}),this.currentState="open",this.newState="closed"}},Ht=class extends Event{constructor(){super("beforetoggle",{bubbles:!1,composed:!1}),this.currentState="closed",this.newState="open"}},me=(s,t,e)=>{let r=new AbortController,o=new Map,a=()=>{r.abort(),e()},c,l,u=requestAnimationFrame(()=>{c=requestAnimationFrame(()=>{l=requestAnimationFrame(()=>{a()})})}),m=p=>{p.target===s&&(o.set(p.propertyName,o.get(p.propertyName)-1),o.get(p.propertyName)||o.delete(p.propertyName),o.size===0&&a())},d=p=>{p.target===s&&(o.has(p.propertyName)||o.set(p.propertyName,0),o.set(p.propertyName,o.get(p.propertyName)+1),cancelAnimationFrame(u),cancelAnimationFrame(c),cancelAnimationFrame(l))};s.addEventListener("transitionrun",d,{signal:r.signal}),s.addEventListener("transitionend",m,{signal:r.signal}),s.addEventListener("transitioncancel",m,{signal:r.signal}),t()};le=class extends I{constructor(){super(...arguments),this.dispose=dt,this.offset=6,this.willPreventClose=!1}async applyFocus(t,e){}get delayed(){return!1}set delayed(t){}async ensureOnDOM(t){}async makeTransition(t){return null}async manageDelay(t){}async manageDialogOpen(){}async managePopoverOpen(){}managePosition(){}get open(){return!1}set open(t){}get state(){return"closed"}set state(t){}manuallyKeepOpen(){}static update(){let t=new CustomEvent("sp-update-overlays",{bubbles:!0,composed:!0,cancelable:!0});document.dispatchEvent(t)}static async open(t,e,r,o){var a,c,l,u;await Promise.resolve().then(()=>(Nt(),pe));let m=arguments.length===2,d=r||t,p=new this,f=!1;p.dispose=()=>{p.addEventListener("sp-closed",()=>{f||(g(),f=!0),requestAnimationFrame(()=>{p.remove()})}),p.open=!1,p.dispose=dt};let g=ds([d],p,{position:"beforeend",prepareCallback:x=>{let C=x.slot;return x.removeAttribute("slot"),()=>{x.slot=C}}});if(!m&&d&&o){let x=t,C=e,w=o;return p.delayed=w.delayed||d.hasAttribute("delayed"),p.receivesFocus=(a=w.receivesFocus)!=null?a:"auto",p.triggerElement=w.virtualTrigger||x,p.type=C==="modal"?"modal":C==="hover"?"hint":"auto",p.offset=(c=w.offset)!=null?c:6,p.placement=w.placement,p.willPreventClose=!!w.notImmediatelyClosable,x.insertAdjacentElement("afterend",p),await p.updateComplete,p.open=!0,p.dispose}let v=e;return p.append(d),p.delayed=v.delayed||d.hasAttribute("delayed"),p.receivesFocus=(l=v.receivesFocus)!=null?l:"auto",p.triggerElement=v.trigger||null,p.type=v.type||"modal",p.offset=(u=v.offset)!=null?u:6,p.placement=v.placement,p.willPreventClose=!!v.notImmediatelyClosable,p.updateComplete.then(()=>{p.open=!0}),p}}});var X,de=E(()=>{"use strict";_t();X=class{constructor(t,e){this.x=0,this.y=0,this.x=t,this.y=e}updateBoundingClientRect(t,e){this.x=t,this.y=e,le.update()}getBoundingClientRect(){return{width:0,height:0,top:this.y,right:this.x,y:this.y,x:this.x,bottom:this.y,left:this.x,toJSON(){}}}}});function Ls(s){class t extends s{async manageDialogOpen(){let r=this.open;if(await this.managePosition(),this.open!==r||this.open!==r)return;let o=await this.dialogMakeTransition(r);this.open===r&&await this.dialogApplyFocus(r,o)}async dialogMakeTransition(r){let o=null,a=(l,u)=>async()=>{if(typeof l.open<"u"&&(l.open=r),!r){let d=()=>{l.removeEventListener("close",d),c(l,u)};l.addEventListener("close",d)}if(u>0)return;let m=r?Ht:Ot;this.dispatchEvent(new m),r&&(l.matches(xt)&&(o=l),o=o||Lt(l),o||l.querySelectorAll("slot").forEach(d=>{o||(o=ae(d))}),!(!this.isConnected||this.dialogEl.open)&&this.dialogEl.showModal())},c=(l,u)=>()=>{if(this.open!==r)return;let m=r?"sp-opened":"sp-closed";if(u>0){l.dispatchEvent(new CustomEvent(m,{bubbles:!1,composed:!1,detail:{interaction:this.type}}));return}if(!this.isConnected||r!==this.open)return;let d=()=>{let p=this.triggerElement instanceof X;this.dispatchEvent(new Event(m,{bubbles:p,composed:p})),l.dispatchEvent(new Event(m,{bubbles:!1,composed:!1})),this.triggerElement&&!p&&this.triggerElement.dispatchEvent(new CustomEvent(m,{bubbles:!0,composed:!0,detail:{interaction:this.type}})),this.state=r?"opened":"closed"};!r&&this.dialogEl.open?(this.dialogEl.addEventListener("close",()=>{d()},{once:!0}),this.dialogEl.close()):d()};return this.elements.forEach((l,u)=>{me(l,a(l,u),c(l,u))}),o}async dialogApplyFocus(r,o){this.applyFocus(r,o)}}return t}var Os=E(()=>{"use strict";ce();de();_t();kt()});function Hs(s){let t=!1;try{t=s.matches(":popover-open")}catch{}let e=!1;try{e=s.matches(":open")}catch{}return t||e}function qs(s){class t extends s{async manageDelay(r){if(r===!1||r!==this.open){ue.close(this);return}this.delayed&&await ue.openTimer(this)&&(this.open=!r)}async shouldHidePopover(r){if(r&&this.open!==r)return;let o=async({newState:a}={})=>{a!=="open"&&await this.placementController.resetOverlayPosition()};if(!Hs(this.dialogEl)){o();return}this.dialogEl.addEventListener("toggle",o,{once:!0})}async shouldShowPopover(r){let o=!1;try{o=this.dialogEl.matches(":popover-open")}catch{}let a=!1;try{a=this.dialogEl.matches(":open")}catch{}r&&this.open===r&&!o&&!a&&this.isConnected&&(this.dialogEl.showPopover(),await this.managePosition())}async ensureOnDOM(r){await Mt(),await this.shouldHidePopover(r),await this.shouldShowPopover(r),await Mt()}async makeTransition(r){if(this.open!==r)return null;let o=null,a=(l,u)=>()=>{if(typeof l.open<"u"&&(l.open=r),u===0){let m=r?Ht:Ot;this.dispatchEvent(new m)}!r||(l.matches(xt)&&(o=l),o=o||Lt(l),o)||l.querySelectorAll("slot").forEach(m=>{o||(o=ae(m))})},c=(l,u)=>async()=>{if(this.open!==r)return;let m=r?"sp-opened":"sp-closed";if(u>0){l.dispatchEvent(new CustomEvent(m,{bubbles:!1,composed:!1,detail:{interaction:this.type}}));return}let d=async()=>{if(this.open!==r)return;await Mt();let f=this.triggerElement instanceof X;this.dispatchEvent(new Event(m,{bubbles:f,composed:f})),l.dispatchEvent(new CustomEvent(m,{bubbles:!1,composed:!1,detail:{interaction:this.type}})),this.triggerElement&&!f&&this.triggerElement.dispatchEvent(new CustomEvent(m,{bubbles:!0,composed:!0,detail:{interaction:this.type}})),this.state=r?"opened":"closed"};if(this.open!==r)return;let p=Hs(this.dialogEl);r!==!0&&p&&this.isConnected?(this.dialogEl.addEventListener("beforetoggle",()=>{d()},{once:!0}),this.dialogEl.hidePopover()):d()};return this.elements.forEach((l,u)=>{me(l,a(l,u),c(l,u))}),o}}return t}var $s=E(()=>{"use strict";ce();de();_t();kt()});function Bs(s){class t extends s{async managePopoverOpen(){await this.managePosition()}async manageDelay(r){if(r===!1||r!==this.open){ue.close(this);return}this.delayed&&await ue.openTimer(this)&&(this.open=!r)}async ensureOnDOM(r){Ds()}async makeTransition(r){if(this.open!==r)return null;let o=null,a=(l,u)=>()=>{if(r===this.open){if(typeof l.open<"u"&&(l.open=r),u===0){let m=r?Ht:Ot;this.dispatchEvent(new m)}r!==!0||(l.matches(xt)&&(o=l),o=o||Lt(l),o)||l.querySelectorAll("slot").forEach(m=>{o||(o=ae(m))})}},c=(l,u)=>()=>{if(this.open!==r)return;let m=r?"sp-opened":"sp-closed";if(l.dispatchEvent(new CustomEvent(m,{bubbles:!1,composed:!1,detail:{interaction:this.type}})),u>0)return;let d=this.triggerElement instanceof X;this.dispatchEvent(new Event(m,{bubbles:d,composed:d})),this.triggerElement&&!d&&this.triggerElement.dispatchEvent(new CustomEvent(m,{bubbles:!0,composed:!0,detail:{interaction:this.type}})),this.state=r?"opened":"closed"};return this.elements.forEach((l,u)=>{me(l,a(l,u),c(l,u))}),o}}return t}var Fs=E(()=>{"use strict";ce();de();_t();kt()});var li,eo,ro,Us=E(()=>{"use strict";li="showPopover"in document.createElement("div"),eo=class{constructor(){this.root=document.body,this.stack=[],this.handlePointerdown=t=>{this.pointerdownPath=t.composedPath()},this.handlePointerup=()=>{var t;if(!this.stack.length||!((t=this.pointerdownPath)!=null&&t.length))return;let e=this.pointerdownPath;this.pointerdownPath=void 0;let r=this.stack.filter(o=>!e.find(a=>a===o||a===o?.triggerElement)&&!o.shouldPreventClose());r.reverse(),r.forEach(o=>{this.closeOverlay(o);let a=o.parentOverlayToForceClose;for(;a;)this.closeOverlay(a),a=a.parentOverlayToForceClose})},this.handleBeforetoggle=t=>{let{target:e,newState:r}=t;r!=="open"&&this.closeOverlay(e)},this.handleKeydown=t=>{if(t.code!=="Escape")return;let e=this.stack.at(-1);if(e?.type==="page"){t.preventDefault();return}li||this.stack.length&&e&&this.closeOverlay(e)},this.bindEvents()}get document(){return this.root.ownerDocument||document}bindEvents(){this.document.addEventListener("pointerdown",this.handlePointerdown),this.document.addEventListener("pointerup",this.handlePointerup),this.document.addEventListener("keydown",this.handleKeydown)}closeOverlay(t){let e=this.stack.indexOf(t);e>-1&&this.stack.splice(e,1),t.open=!1}overlaysByTriggerElement(t){return this.stack.filter(e=>e.triggerElement===t)}add(t){if(this.stack.includes(t)){let e=this.stack.indexOf(t);e>-1&&(this.stack.splice(e,1),this.stack.push(t));return}if(t.type==="auto"||t.type==="modal"||t.type==="page"){let e="sp-overlay-query-path",r=new Event(e,{composed:!0,bubbles:!0});t.addEventListener(e,o=>{let a=o.composedPath();this.stack.forEach(c=>{!a.find(l=>l===c)&&c.type!=="manual"&&this.closeOverlay(c)})},{once:!0}),t.dispatchEvent(r)}else t.type==="hint"&&this.stack.forEach(e=>{e.type==="hint"&&this.closeOverlay(e)});requestAnimationFrame(()=>{this.stack.push(t),t.addEventListener("beforetoggle",this.handleBeforetoggle,{once:!0})})}remove(t){this.closeOverlay(t)}},ro=new eo});function vr(s,t,e){return N(s,ht(t,e))}function Vt(s,t){return typeof s=="function"?s(t):s}function Ct(s){return s.split("-")[0]}function Kt(s){return s.split("-")[1]}function oo(s){return s==="x"?"y":"x"}function fr(s){return s==="y"?"height":"width"}function he(s){return["top","bottom"].includes(Ct(s))?"y":"x"}function yr(s){return oo(he(s))}function Rs(s,t,e){e===void 0&&(e=!1);let r=Kt(s),o=yr(s),a=fr(o),c=o==="x"?r===(e?"end":"start")?"right":"left":r==="start"?"bottom":"top";return t.reference[a]>t.floating[a]&&(c=je(c)),[c,je(c)]}function Ms(s){let t=je(s);return[br(s),t,br(t)]}function br(s){return s.replace(/start|end/g,t=>mi[t])}function pi(s,t,e){let r=["left","right"],o=["right","left"],a=["top","bottom"],c=["bottom","top"];switch(s){case"top":case"bottom":return e?t?o:r:t?r:o;case"left":case"right":return t?a:c;default:return[]}}function _s(s,t,e,r){let o=Kt(s),a=pi(Ct(s),e==="start",r);return o&&(a=a.map(c=>c+"-"+o),t&&(a=a.concat(a.map(br)))),a}function je(s){return s.replace(/left|right|bottom|top/g,t=>ui[t])}function di(s){return{top:0,right:0,bottom:0,left:0,...s}}function so(s){return typeof s!="number"?di(s):{top:s,right:s,bottom:s,left:s}}function Wt(s){return{...s,top:s.y,left:s.x,right:s.x+s.width,bottom:s.y+s.height}}var ht,N,Ae,De,zt,ui,mi,xr=E(()=>{ht=Math.min,N=Math.max,Ae=Math.round,De=Math.floor,zt=s=>({x:s,y:s}),ui={left:"right",right:"left",bottom:"top",top:"bottom"},mi={start:"end",end:"start"}});function Ns(s,t,e){let{reference:r,floating:o}=s,a=he(t),c=yr(t),l=fr(c),u=Ct(t),m=a==="y",d=r.x+r.width/2-o.width/2,p=r.y+r.height/2-o.height/2,f=r[l]/2-o[l]/2,g;switch(u){case"top":g={x:d,y:r.y-o.height};break;case"bottom":g={x:d,y:r.y+r.height};break;case"right":g={x:r.x+r.width,y:p};break;case"left":g={x:r.x-o.width,y:p};break;default:g={x:r.x,y:r.y}}switch(Kt(t)){case"start":g[c]-=f*(e&&m?-1:1);break;case"end":g[c]+=f*(e&&m?-1:1);break}return g}async function kr(s,t){var e;t===void 0&&(t={});let{x:r,y:o,platform:a,rects:c,elements:l,strategy:u}=s,{boundary:m="clippingAncestors",rootBoundary:d="viewport",elementContext:p="floating",altBoundary:f=!1,padding:g=0}=Vt(t,s),v=so(g),C=l[f?p==="floating"?"reference":"floating":p],w=Wt(await a.getClippingRect({element:(e=await(a.isElement==null?void 0:a.isElement(C)))==null||e?C:C.contextElement||await(a.getDocumentElement==null?void 0:a.getDocumentElement(l.floating)),boundary:m,rootBoundary:d,strategy:u})),k=p==="floating"?{...c.floating,x:r,y:o}:c.reference,y=await(a.getOffsetParent==null?void 0:a.getOffsetParent(l.floating)),q=await(a.isElement==null?void 0:a.isElement(y))?await(a.getScale==null?void 0:a.getScale(y))||{x:1,y:1}:{x:1,y:1},D=Wt(a.convertOffsetParentRelativeRectToViewportRelativeRect?await a.convertOffsetParentRelativeRectToViewportRelativeRect({rect:k,offsetParent:y,strategy:u}):k);return{top:(w.top-D.top+v.top)/q.y,bottom:(D.bottom-w.bottom+v.bottom)/q.y,left:(w.left-D.left+v.left)/q.x,right:(D.right-w.right+v.right)/q.x}}async function hi(s,t){let{placement:e,platform:r,elements:o}=s,a=await(r.isRTL==null?void 0:r.isRTL(o.floating)),c=Ct(e),l=Kt(e),u=he(e)==="y",m=["left","top"].includes(c)?-1:1,d=a&&u?-1:1,p=Vt(t,s),{mainAxis:f,crossAxis:g,alignmentAxis:v}=typeof p=="number"?{mainAxis:p,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...p};return l&&typeof v=="number"&&(g=l==="end"?v*-1:v),u?{x:g*d,y:f*m}:{x:f*m,y:g*d}}var Vs,ao,wr,co,io,no,lo=E(()=>{xr();xr();Vs=async(s,t,e)=>{let{placement:r="bottom",strategy:o="absolute",middleware:a=[],platform:c}=e,l=a.filter(Boolean),u=await(c.isRTL==null?void 0:c.isRTL(t)),m=await c.getElementRects({reference:s,floating:t,strategy:o}),{x:d,y:p}=Ns(m,r,u),f=r,g={},v=0;for(let x=0;x<l.length;x++){let{name:C,fn:w}=l[x],{x:k,y,data:q,reset:D}=await w({x:d,y:p,initialPlacement:r,placement:f,strategy:o,middlewareData:g,rects:m,platform:c,elements:{reference:s,floating:t}});if(d=k??d,p=y??p,g={...g,[C]:{...g[C],...q}},D&&v<=50){v++,typeof D=="object"&&(D.placement&&(f=D.placement),D.rects&&(m=D.rects===!0?await c.getElementRects({reference:s,floating:t,strategy:o}):D.rects),{x:d,y:p}=Ns(m,f,u)),x=-1;continue}}return{x:d,y:p,placement:f,strategy:o,middlewareData:g}};ao=s=>({name:"arrow",options:s,async fn(t){let{x:e,y:r,placement:o,rects:a,platform:c,elements:l,middlewareData:u}=t,{element:m,padding:d=0}=Vt(s,t)||{};if(m==null)return{};let p=so(d),f={x:e,y:r},g=yr(o),v=fr(g),x=await c.getDimensions(m),C=g==="y",w=C?"top":"left",k=C?"bottom":"right",y=C?"clientHeight":"clientWidth",q=a.reference[v]+a.reference[g]-f[g]-a.floating[v],D=f[g]-a.reference[g],$=await(c.getOffsetParent==null?void 0:c.getOffsetParent(m)),W=$?$[y]:0;(!W||!await(c.isElement==null?void 0:c.isElement($)))&&(W=l.floating[y]||a.floating[v]);let ct=q/2-D/2,Tt=W/2-x[v]/2-1,ke=ht(p[w],Tt),we=ht(p[k],Tt),J=ke,ze=W-x[v]-we,G=W/2-x[v]/2+ct,it=vr(J,G,ze),nt=!u.arrow&&Kt(o)!=null&&G!=it&&a.reference[v]/2-(G<J?ke:we)-x[v]/2<0,ft=nt?G<J?G-J:G-ze:0;return{[g]:f[g]+ft,data:{[g]:it,centerOffset:G-it-ft,...nt&&{alignmentOffset:ft}},reset:nt}}}),wr=function(s){return s===void 0&&(s={}),{name:"flip",options:s,async fn(t){var e,r;let{placement:o,middlewareData:a,rects:c,initialPlacement:l,platform:u,elements:m}=t,{mainAxis:d=!0,crossAxis:p=!0,fallbackPlacements:f,fallbackStrategy:g="bestFit",fallbackAxisSideDirection:v="none",flipAlignment:x=!0,...C}=Vt(s,t);if((e=a.arrow)!=null&&e.alignmentOffset)return{};let w=Ct(o),k=Ct(l)===l,y=await(u.isRTL==null?void 0:u.isRTL(m.floating)),q=f||(k||!x?[je(l)]:Ms(l));!f&&v!=="none"&&q.push(..._s(l,x,v,y));let D=[l,...q],$=await kr(t,C),W=[],ct=((r=a.flip)==null?void 0:r.overflows)||[];if(d&&W.push($[w]),p){let J=Rs(o,c,y);W.push($[J[0]],$[J[1]])}if(ct=[...ct,{placement:o,overflows:W}],!W.every(J=>J<=0)){var Tt,ke;let J=(((Tt=a.flip)==null?void 0:Tt.index)||0)+1,ze=D[J];if(ze)return{data:{index:J,overflows:ct},reset:{placement:ze}};let G=(ke=ct.filter(it=>it.overflows[0]<=0).sort((it,nt)=>it.overflows[1]-nt.overflows[1])[0])==null?void 0:ke.placement;if(!G)switch(g){case"bestFit":{var we;let it=(we=ct.map(nt=>[nt.placement,nt.overflows.filter(ft=>ft>0).reduce((ft,Pa)=>ft+Pa,0)]).sort((nt,ft)=>nt[1]-ft[1])[0])==null?void 0:we[0];it&&(G=it);break}case"initialPlacement":G=l;break}if(o!==G)return{reset:{placement:G}}}return{}}}};co=function(s){return s===void 0&&(s=0),{name:"offset",options:s,async fn(t){let{x:e,y:r}=t,o=await hi(t,s);return{x:e+o.x,y:r+o.y,data:o}}}},io=function(s){return s===void 0&&(s={}),{name:"shift",options:s,async fn(t){let{x:e,y:r,placement:o}=t,{mainAxis:a=!0,crossAxis:c=!1,limiter:l={fn:C=>{let{x:w,y:k}=C;return{x:w,y:k}}},...u}=Vt(s,t),m={x:e,y:r},d=await kr(t,u),p=he(Ct(o)),f=oo(p),g=m[f],v=m[p];if(a){let C=f==="y"?"top":"left",w=f==="y"?"bottom":"right",k=g+d[C],y=g-d[w];g=vr(k,g,y)}if(c){let C=p==="y"?"top":"left",w=p==="y"?"bottom":"right",k=v+d[C],y=v-d[w];v=vr(k,v,y)}let x=l.fn({...t,[f]:g,[p]:v});return{...x,data:{x:x.x-e,y:x.y-r}}}}},no=function(s){return s===void 0&&(s={}),{name:"size",options:s,async fn(t){let{placement:e,rects:r,platform:o,elements:a}=t,{apply:c=()=>{},...l}=Vt(s,t),u=await kr(t,l),m=Ct(e),d=Kt(e),p=he(e)==="y",{width:f,height:g}=r.floating,v,x;m==="top"||m==="bottom"?(v=m,x=d===(await(o.isRTL==null?void 0:o.isRTL(a.floating))?"start":"end")?"left":"right"):(x=m,v=d==="end"?"top":"bottom");let C=g-u[v],w=f-u[x],k=!t.middlewareData.shift,y=C,q=w;if(p){let $=f-u.left-u.right;q=d||k?ht(w,$):$}else{let $=g-u.top-u.bottom;y=d||k?ht(C,$):$}if(k&&!d){let $=N(u.left,0),W=N(u.right,0),ct=N(u.top,0),Tt=N(u.bottom,0);p?q=f-2*($!==0||W!==0?$+W:N(u.left,u.right)):y=g-2*(ct!==0||Tt!==0?ct+Tt:N(u.top,u.bottom))}await c({...t,availableWidth:q,availableHeight:y});let D=await o.getDimensions(a.floating);return f!==D.width||g!==D.height?{reset:{rects:!0}}:{}}}}});function Et(s){return Ws(s)?(s.nodeName||"").toLowerCase():"#document"}function M(s){var t;return(s==null||(t=s.ownerDocument)==null?void 0:t.defaultView)||window}function gt(s){var t;return(t=(Ws(s)?s.ownerDocument:s.document)||window.document)==null?void 0:t.documentElement}function Ws(s){return s instanceof Node||s instanceof M(s).Node}function bt(s){return s instanceof Element||s instanceof M(s).Element}function st(s){return s instanceof HTMLElement||s instanceof M(s).HTMLElement}function Ks(s){return typeof ShadowRoot>"u"?!1:s instanceof ShadowRoot||s instanceof M(s).ShadowRoot}function be(s){let{overflow:t,overflowX:e,overflowY:r,display:o}=Y(s);return/auto|scroll|overlay|hidden|clip/.test(t+r+e)&&!["inline","contents"].includes(o)}function Gs(s){return["table","td","th"].includes(Et(s))}function ve(s){let t=Cr(),e=Y(s);return e.transform!=="none"||e.perspective!=="none"||(e.containerType?e.containerType!=="normal":!1)||!t&&(e.backdropFilter?e.backdropFilter!=="none":!1)||!t&&(e.filter?e.filter!=="none":!1)||["transform","perspective","filter"].some(r=>(e.willChange||"").includes(r))||["paint","layout","strict","content"].some(r=>(e.contain||"").includes(r))}function zr(s){let t=Gt(s);for(;st(t)&&!Le(t);){if(ve(t))return t;t=Gt(t)}return null}function Cr(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}function Le(s){return["html","body","#document"].includes(Et(s))}function Y(s){return M(s).getComputedStyle(s)}function Oe(s){return bt(s)?{scrollLeft:s.scrollLeft,scrollTop:s.scrollTop}:{scrollLeft:s.pageXOffset,scrollTop:s.pageYOffset}}function Gt(s){if(Et(s)==="html")return s;let t=s.assignedSlot||s.parentNode||Ks(s)&&s.host||gt(s);return Ks(t)?t.host:t}function Xs(s){let t=Gt(s);return Le(t)?s.ownerDocument?s.ownerDocument.body:s.body:st(t)&&be(t)?t:Xs(t)}function ge(s,t,e){var r;t===void 0&&(t=[]),e===void 0&&(e=!0);let o=Xs(s),a=o===((r=s.ownerDocument)==null?void 0:r.body),c=M(o);return a?t.concat(c,c.visualViewport||[],be(o)?o:[],c.frameElement&&e?ge(c.frameElement):[]):t.concat(o,ge(o,[],e))}var uo=E(()=>{});function Qs(s){let t=Y(s),e=parseFloat(t.width)||0,r=parseFloat(t.height)||0,o=st(s),a=o?s.offsetWidth:e,c=o?s.offsetHeight:r,l=Ae(e)!==a||Ae(r)!==c;return l&&(e=a,r=c),{width:e,height:r,$:l}}function mo(s){return bt(s)?s:s.contextElement}function fe(s){let t=mo(s);if(!st(t))return zt(1);let e=t.getBoundingClientRect(),{width:r,height:o,$:a}=Qs(t),c=(a?Ae(e.width):e.width)/r,l=(a?Ae(e.height):e.height)/o;return(!c||!Number.isFinite(c))&&(c=1),(!l||!Number.isFinite(l))&&(l=1),{x:c,y:l}}function Js(s){let t=M(s);return!Cr()||!t.visualViewport?gi:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function bi(s,t,e){return t===void 0&&(t=!1),!e||t&&e!==M(s)?!1:t}function Xt(s,t,e,r){t===void 0&&(t=!1),e===void 0&&(e=!1);let o=s.getBoundingClientRect(),a=mo(s),c=zt(1);t&&(r?bt(r)&&(c=fe(r)):c=fe(s));let l=bi(a,e,r)?Js(a):zt(0),u=(o.left+l.x)/c.x,m=(o.top+l.y)/c.y,d=o.width/c.x,p=o.height/c.y;if(a){let f=M(a),g=r&&bt(r)?M(r):r,v=f.frameElement;for(;v&&r&&g!==f;){let x=fe(v),C=v.getBoundingClientRect(),w=Y(v),k=C.left+(v.clientLeft+parseFloat(w.paddingLeft))*x.x,y=C.top+(v.clientTop+parseFloat(w.paddingTop))*x.y;u*=x.x,m*=x.y,d*=x.x,p*=x.y,u+=k,m+=y,v=M(v).frameElement}}return Wt({width:d,height:p,x:u,y:m})}function vi(s){let{rect:t,offsetParent:e,strategy:r}=s,o=st(e),a=gt(e);if(e===a)return t;let c={scrollLeft:0,scrollTop:0},l=zt(1),u=zt(0);if((o||!o&&r!=="fixed")&&((Et(e)!=="body"||be(a))&&(c=Oe(e)),st(e))){let m=Xt(e);l=fe(e),u.x=m.x+e.clientLeft,u.y=m.y+e.clientTop}return{width:t.width*l.x,height:t.height*l.y,x:t.x*l.x-c.scrollLeft*l.x+u.x,y:t.y*l.y-c.scrollTop*l.y+u.y}}function fi(s){return Array.from(s.getClientRects())}function ta(s){return Xt(gt(s)).left+Oe(s).scrollLeft}function yi(s){let t=gt(s),e=Oe(s),r=s.ownerDocument.body,o=N(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),a=N(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight),c=-e.scrollLeft+ta(s),l=-e.scrollTop;return Y(r).direction==="rtl"&&(c+=N(t.clientWidth,r.clientWidth)-o),{width:o,height:a,x:c,y:l}}function xi(s,t){let e=M(s),r=gt(s),o=e.visualViewport,a=r.clientWidth,c=r.clientHeight,l=0,u=0;if(o){a=o.width,c=o.height;let m=Cr();(!m||m&&t==="fixed")&&(l=o.offsetLeft,u=o.offsetTop)}return{width:a,height:c,x:l,y:u}}function ki(s,t){let e=Xt(s,!0,t==="fixed"),r=e.top+s.clientTop,o=e.left+s.clientLeft,a=st(s)?fe(s):zt(1),c=s.clientWidth*a.x,l=s.clientHeight*a.y,u=o*a.x,m=r*a.y;return{width:c,height:l,x:u,y:m}}function Ys(s,t,e){let r;if(t==="viewport")r=xi(s,e);else if(t==="document")r=yi(gt(s));else if(bt(t))r=ki(t,e);else{let o=Js(s);r={...t,x:t.x-o.x,y:t.y-o.y}}return Wt(r)}function ea(s,t){let e=Gt(s);return e===t||!bt(e)||Le(e)?!1:Y(e).position==="fixed"||ea(e,t)}function wi(s,t){let e=t.get(s);if(e)return e;let r=ge(s,[],!1).filter(l=>bt(l)&&Et(l)!=="body"),o=null,a=Y(s).position==="fixed",c=a?Gt(s):s;for(;bt(c)&&!Le(c);){let l=Y(c),u=ve(c);!u&&l.position==="fixed"&&(o=null),(a?!u&&!o:!u&&l.position==="static"&&!!o&&["absolute","fixed"].includes(o.position)||be(c)&&!u&&ea(s,c))?r=r.filter(d=>d!==c):o=l,c=Gt(c)}return t.set(s,r),r}function zi(s){let{element:t,boundary:e,rootBoundary:r,strategy:o}=s,c=[...e==="clippingAncestors"?wi(t,this._c):[].concat(e),r],l=c[0],u=c.reduce((m,d)=>{let p=Ys(t,d,o);return m.top=N(p.top,m.top),m.right=ht(p.right,m.right),m.bottom=ht(p.bottom,m.bottom),m.left=N(p.left,m.left),m},Ys(t,l,o));return{width:u.right-u.left,height:u.bottom-u.top,x:u.left,y:u.top}}function Ci(s){return Qs(s)}function Ei(s,t,e){let r=st(t),o=gt(t),a=e==="fixed",c=Xt(s,!0,a,t),l={scrollLeft:0,scrollTop:0},u=zt(0);if(r||!r&&!a)if((Et(t)!=="body"||be(o))&&(l=Oe(t)),r){let m=Xt(t,!0,a,t);u.x=m.x+t.clientLeft,u.y=m.y+t.clientTop}else o&&(u.x=ta(o));return{x:c.left+l.scrollLeft-u.x,y:c.top+l.scrollTop-u.y,width:c.width,height:c.height}}function Zs(s,t){return!st(s)||Y(s).position==="fixed"?null:t?t(s):s.offsetParent}function ra(s,t){let e=M(s);if(!st(s))return e;let r=Zs(s,t);for(;r&&Gs(r)&&Y(r).position==="static";)r=Zs(r,t);return r&&(Et(r)==="html"||Et(r)==="body"&&Y(r).position==="static"&&!ve(r))?e:r||zr(s)||e}function Ii(s){return Y(s).direction==="rtl"}function Si(s,t){let e=null,r,o=gt(s);function a(){clearTimeout(r),e&&e.disconnect(),e=null}function c(l,u){l===void 0&&(l=!1),u===void 0&&(u=1),a();let{left:m,top:d,width:p,height:f}=s.getBoundingClientRect();if(l||t(),!p||!f)return;let g=De(d),v=De(o.clientWidth-(m+p)),x=De(o.clientHeight-(d+f)),C=De(m),k={rootMargin:-g+"px "+-v+"px "+-x+"px "+-C+"px",threshold:N(0,ht(1,u))||1},y=!0;function q(D){let $=D[0].intersectionRatio;if($!==u){if(!y)return c();$?c(!1,$):r=setTimeout(()=>{c(!1,1e-7)},100)}y=!1}try{e=new IntersectionObserver(q,{...k,root:o.ownerDocument})}catch{e=new IntersectionObserver(q,k)}e.observe(s)}return c(!0),a}function oa(s,t,e,r){r===void 0&&(r={});let{ancestorScroll:o=!0,ancestorResize:a=!0,elementResize:c=typeof ResizeObserver=="function",layoutShift:l=typeof IntersectionObserver=="function",animationFrame:u=!1}=r,m=mo(s),d=o||a?[...m?ge(m):[],...ge(t)]:[];d.forEach(w=>{o&&w.addEventListener("scroll",e,{passive:!0}),a&&w.addEventListener("resize",e)});let p=m&&l?Si(m,e):null,f=-1,g=null;c&&(g=new ResizeObserver(w=>{let[k]=w;k&&k.target===m&&g&&(g.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{g&&g.observe(t)})),e()}),m&&!u&&g.observe(m),g.observe(t));let v,x=u?Xt(s):null;u&&C();function C(){let w=Xt(s);x&&(w.x!==x.x||w.y!==x.y||w.width!==x.width||w.height!==x.height)&&e(),x=w,v=requestAnimationFrame(C)}return e(),()=>{d.forEach(w=>{o&&w.removeEventListener("scroll",e),a&&w.removeEventListener("resize",e)}),p&&p(),g&&g.disconnect(),g=null,u&&cancelAnimationFrame(v)}}var gi,Pi,Ti,sa,aa=E(()=>{lo();lo();xr();uo();gi=zt(0);Pi=async function(s){let{reference:t,floating:e,strategy:r}=s,o=this.getOffsetParent||ra,a=this.getDimensions;return{reference:Ei(t,await o(e),r),floating:{x:0,y:0,...await a(e)}}};Ti={convertOffsetParentRelativeRectToViewportRelativeRect:vi,getDocumentElement:gt,getClippingRect:zi,getOffsetParent:ra,getElementRects:Pi,getClientRects:fi,getDimensions:Ci,getScale:fe,isElement:bt,isRTL:Ii};sa=(s,t,e)=>{let r=new Map,o={platform:Ti,...e},a={...o.platform,_c:r};return Vs(s,t,{...o,platform:a})}});var ca,ia=E(()=>{"use strict";uo();de();ca=()=>({name:"topLayer",async fn(s){let{x:t,y:e,elements:{reference:r,floating:o}}=s,a=!1,c=!1,l=!1,u={x:0,y:0};try{a=a||o.matches(":popover-open")}catch{}try{a=a||o.matches(":open")}catch{}try{a=a||o.matches(":modal")}catch{}c=a;let m=new Event("floating-ui-dialog-test",{composed:!0,bubbles:!0});o.addEventListener("floating-ui-dialog-test",p=>{p.composedPath().forEach(f=>{if(l=l||f===r,!(f===o||f.localName!=="dialog"))try{a=a||f.matches(":modal")}catch{}})},{once:!0}),o.dispatchEvent(m);let d=!1;if(!(r instanceof X)){let p=l?r:o,f=ve(p)?p:zr(p),g={};if(f!==null&&M(f)!==f&&(g=getComputedStyle(f),d=g.transform!=="none"||g.translate!=="none"||(g.backdropFilter?g.backdropFilter!=="none":!1)||(g.filter?g.filter!=="none":!1)||g.willChange.search("transform")>-1||g.willChange.search("translate")>-1||["paint","layout","strict","content"].some(v=>(g.contain||"").includes(v))),a&&d&&f){let v=f.getBoundingClientRect(),{marginInlineStart:x="0",marginBlockStart:C="0"}=g;u.x=v.x+parseFloat(x),u.y=v.y+parseFloat(C)}}return a&&c?{x:t+u.x,y:e+u.y,data:u}:a?{x:t,y:e,data:u}:{x:t-u.x,y:e-u.y,data:u}}})});function Er(s){if(typeof s>"u")return 0;let t=window.devicePixelRatio||1;return Math.round(s*t)/t}var Pr,ji,Ai,xb,Ir,na=E(()=>{"use strict";aa();ia();Pr=8,ji=100,Ai=s=>{var t;return(t={left:["right","bottom","top"],"left-start":["right-start","bottom","top"],"left-end":["right-end","bottom","top"],right:["left","bottom","top"],"right-start":["left-start","bottom","top"],"right-end":["left-end","bottom","top"],top:["bottom","left","right"],"top-start":["bottom-start","left","right"],"top-end":["bottom-end","left","right"],bottom:["top","left","right"],"bottom-start":["top-start","left","right"],"bottom-end":["top-end","left","right"]}[s])!=null?t:[s]},xb=Symbol("placement updated"),Ir=class{constructor(t){this.originalPlacements=new WeakMap,this.allowPlacementUpdate=!1,this.updatePlacement=()=>{if(!this.allowPlacementUpdate&&this.options.type!=="modal"&&this.cleanup){this.target.dispatchEvent(new Event("close",{bubbles:!0}));return}this.computePlacement(),this.allowPlacementUpdate=!1},this.resetOverlayPosition=()=>{!this.target||!this.options||(this.target.style.removeProperty("max-height"),this.target.style.removeProperty("height"),this.initialHeight=void 0,this.isConstrained=!1,this.host.offsetHeight,this.computePlacement())},this.host=t,this.host.addController(this)}async placeOverlay(t=this.target,e=this.options){if(this.target=t,this.options=e,!t||!e)return;let r=oa(e.trigger,t,this.updatePlacement,{elementResize:!1,layoutShift:!1});this.cleanup=()=>{var o;(o=this.host.elements)==null||o.forEach(a=>{a.addEventListener("sp-closed",()=>{let c=this.originalPlacements.get(a);c&&a.setAttribute("placement",c),this.originalPlacements.delete(a)},{once:!0})}),r()}}async computePlacement(){var t,e;let{options:r,target:o}=this;await(document.fonts?document.fonts.ready:Promise.resolve());let a=r.trigger instanceof HTMLElement?wr():wr({padding:Pr,fallbackPlacements:Ai(r.placement)}),[c=0,l=0]=Array.isArray(r?.offset)?r.offset:[r.offset,0],u=(t=this.host.elements.find(v=>v.tipElement))==null?void 0:t.tipElement,m=[co({mainAxis:c,crossAxis:l}),io({padding:Pr}),a,no({padding:Pr,apply:({availableWidth:v,availableHeight:x,rects:{floating:C}})=>{let w=Math.max(ji,Math.floor(x)),k=C.height;this.initialHeight=this.isConstrained&&this.initialHeight||k,this.isConstrained=k<this.initialHeight||w<=k;let y=this.isConstrained?`${w}px`:"";Object.assign(o.style,{maxWidth:`${Math.floor(v)}px`,maxHeight:y,height:y})}}),...u?[ao({element:u,padding:r.tipPadding||Pr})]:[],ca()],{x:d,y:p,placement:f,middlewareData:g}=await sa(r.trigger,o,{placement:r.placement,middleware:m,strategy:"fixed"});if(Object.assign(o.style,{top:"0px",left:"0px",translate:`${Er(d)}px ${Er(p)}px`}),o.setAttribute("actual-placement",f),(e=this.host.elements)==null||e.forEach(v=>{this.originalPlacements.set(v,v.getAttribute("placement")),v.setAttribute("placement",f)}),u&&g.arrow){let{x:v,y:x}=g.arrow;Object.assign(u.style,{top:f.startsWith("right")||f.startsWith("left")?"0px":"",left:f.startsWith("bottom")||f.startsWith("top")?"0px":"",translate:`${Er(v)}px ${Er(x)}px`})}}hostConnected(){document.addEventListener("sp-update-overlays",this.resetOverlayPosition)}hostUpdated(){var t;this.host.open||((t=this.cleanup)==null||t.call(this),this.cleanup=void 0)}hostDisconnected(){var t;(t=this.cleanup)==null||t.call(this),this.cleanup=void 0,document.removeEventListener("sp-update-overlays",this.resetOverlayPosition)}}});var Di,la,ua=E(()=>{"use strict";h();Di=i.css`
:host{--swc-overlay-animation-distance:var(
--spectrum-picker-m-texticon-popover-offset-y,var(--spectrum-global-dimension-size-75)
);display:contents;pointer-events:none}.dialog{--sp-overlay-open:true;background:none;border:0;box-sizing:border-box;display:flex;height:auto;inset:auto;left:0;margin:0;max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);max-width:calc(100vw - 16px);opacity:1!important;overflow:visible;padding:0;position:fixed;top:0}.dialog:not([is-visible]){translate:-999em -999em!important}.dialog:focus{outline:none}dialog:modal{--mod-popover-filter:var(--spectrum-popover-filter)}:host(:not([open])) .dialog{--sp-overlay-open:false}.dialog::backdrop{display:none}.dialog:before{content:"";inset:-999em;pointer-events:auto!important;position:absolute}.dialog:not(.not-immediately-closable):before{display:none}.dialog>div{width:100%}::slotted(*){pointer-events:auto}::slotted(sp-popover){position:static}::slotted(sp-tooltip){--swc-tooltip-margin:0}.dialog:not([actual-placement])[placement*=top]{margin-top:var(--swc-overlay-animation-distance);padding-block:var(--swc-overlay-animation-distance)}.dialog:not([actual-placement])[placement*=right]{margin-left:calc(var(--swc-overlay-animation-distance)*-1);padding-inline:var(--swc-overlay-animation-distance)}.dialog:not([actual-placement])[placement*=bottom]{margin-top:calc(var(--swc-overlay-animation-distance)*-1);padding-block:var(--swc-overlay-animation-distance)}.dialog:not([actual-placement])[placement*=left]{margin-left:var(--swc-overlay-animation-distance);padding-inline:var(--swc-overlay-animation-distance)}.dialog[actual-placement*=top]{margin-top:var(--swc-overlay-animation-distance);padding-block:var(--swc-overlay-animation-distance)}.dialog[actual-placement*=right]{margin-left:calc(var(--swc-overlay-animation-distance)*-1);padding-inline:var(--swc-overlay-animation-distance)}.dialog[actual-placement*=bottom]{margin-top:calc(var(--swc-overlay-animation-distance)*-1);padding-block:var(--swc-overlay-animation-distance)}.dialog[actual-placement*=left]{margin-left:var(--swc-overlay-animation-distance);padding-inline:var(--swc-overlay-animation-distance)}slot[name=longpress-describedby-descriptor]{display:none}@supports selector(:open){.dialog{opacity:0}.dialog:open{--mod-popover-filter:var(--spectrum-popover-filter);opacity:1}}@supports selector(:popover-open){.dialog{opacity:0}.dialog:popover-open{--mod-popover-filter:var(--spectrum-popover-filter);opacity:1}}@supports (not selector(:open)) and (not selector(:popover-open)){:host:not([open]) .dialog{pointer-events:none}.dialog[actual-placement]{z-index:calc(var(--swc-overlay-z-index-base, 1000) + var(--swc-overlay-open-count))}}
`,la=Di});var Li,Oi,V,Hi,qi,$i,Bi,He,B,Tr,ho=E(()=>{"use strict";h();S();Yr();js();ir();tt();_t();Os();$s();Fs();Us();_t();de();na();ua();Li=Object.defineProperty,Oi=Object.getOwnPropertyDescriptor,V=(s,t,e,r)=>{for(var o=r>1?void 0:r?Oi(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Li(t,e,o),o},Hi=300,qi=300,$i={touch:"Double tap and long press for additional options",keyboard:"Press Space or Alt+Down Arrow for additional options",mouse:"Click and hold for additional options"},Bi="showPopover"in document.createElement("div"),He=Ls(le);Bi?He=qs(He):He=Bs(He);B=class po extends He{constructor(){super(...arguments),this._delayed=!1,this._disabled=!1,this.longpressState="null",this.offset=6,this.placementController=new Ir(this),this._open=!1,this.receivesFocus="auto",this.releaseAriaDescribedby=dt,this.releaseLongpressDescribedby=dt,this._state="closed",this.triggerElement=null,this.type="auto",this.wasOpen=!1,this.elementResolver=new hr(this),this.closeOnFocusOut=t=>{if(!t.relatedTarget)return;let e=new Event("overlay-relation-query",{bubbles:!0,composed:!0});t.relatedTarget.addEventListener(e.type,r=>{r.composedPath().includes(this)||(this.open=!1)}),t.relatedTarget.dispatchEvent(e)},this.elementIds=[],this.handlePointerdown=t=>{if(!this.triggerElement||t.button!==0)return;let e=this.triggerElement;this.longpressState="potential",document.addEventListener("pointerup",this.handlePointerup),document.addEventListener("pointercancel",this.handlePointerup),!e.holdAffordance&&(this.longressTimeout=setTimeout(()=>{e&&e.dispatchEvent(new CustomEvent("longpress",{bubbles:!0,composed:!0,detail:{source:"pointer"}}))},Hi))},this.handlePointerup=()=>{clearTimeout(this.longressTimeout),this.triggerElement&&(this.longpressState=this.state==="opening"?"pressed":"null",document.removeEventListener("pointerup",this.handlePointerup),document.removeEventListener("pointercancel",this.handlePointerup))},this.handleKeydown=t=>{let{code:e,altKey:r}=t;(e==="Space"||r&&e==="ArrowDown")&&e==="ArrowDown"&&(t.stopPropagation(),t.stopImmediatePropagation())},this.handleKeyup=t=>{let{code:e,altKey:r}=t;if(e==="Space"||r&&e==="ArrowDown"){if(!this.triggerElement||!this.hasNonVirtualTrigger)return;t.stopPropagation(),this.triggerElement.dispatchEvent(new CustomEvent("longpress",{bubbles:!0,composed:!0,detail:{source:"keyboard"}})),setTimeout(()=>{this.longpressState="null"})}},this.preventNextToggle=!1,this.handlePointerdownForClick=()=>{this.preventNextToggle=this.open},this.handleClick=()=>{this.longpressState==="opening"||this.longpressState==="pressed"||(this.preventNextToggle||(this.open=!this.open),this.preventNextToggle=!1)},this.focusedin=!1,this.handleFocusin=()=>{this.open=!0,this.focusedin=!0},this.handleFocusout=()=>{this.focusedin=!1,!this.pointerentered&&(this.open=!1)},this.pointerentered=!1,this.handlePointerenter=()=>{this.hoverTimeout&&(clearTimeout(this.hoverTimeout),delete this.hoverTimeout),!this.disabled&&(this.open=!0,this.pointerentered=!0)},this.handleOverlayPointerenter=()=>{this.hoverTimeout&&(clearTimeout(this.hoverTimeout),delete this.hoverTimeout)},this.handlePointerleave=()=>{this.doPointerleave()},this.handleOverlayPointerleave=()=>{this.doPointerleave()},this.handleLongpress=()=>{this.open=!0,this.longpressState=this.longpressState==="potential"?"opening":"pressed"}}get delayed(){var t;return((t=this.elements.at(-1))==null?void 0:t.hasAttribute("delayed"))||this._delayed}set delayed(t){this._delayed=t}get disabled(){return this._disabled}set disabled(t){this._disabled=t,t?(this.hasNonVirtualTrigger&&this.unbindEvents(),this.wasOpen=this.open,this.open=!1):(this.bindEvents(),this.open=this.open||this.wasOpen,this.wasOpen=!1)}get hasNonVirtualTrigger(){return!!this.triggerElement&&!(this.triggerElement instanceof X)}get open(){return this._open}set open(t){t&&this.disabled||t!==this.open&&((this.longpressState==="opening"||this.longpressState==="pressed")&&!t||(this._open=t,this.open&&(po.openCount+=1),this.requestUpdate("open",!this.open)))}get state(){return this._state}set state(t){if(t===this.state)return;let e=this.state;this._state=t,(this.state==="opened"||this.state==="closed")&&(this.longpressState=this.longpressState==="pressed"?"null":this.longpressState),this.requestUpdate("state",e)}get usesDialog(){return this.type==="modal"||this.type==="page"}get popoverValue(){if("popover"in this)switch(this.type){case"modal":case"page":return;case"hint":return"manual";default:return this.type}}get requiresPosition(){return!(this.type==="page"||!this.open||!this.triggerElement||!this.placement&&this.type!=="hint")}managePosition(){if(!this.requiresPosition||!this.open)return;let t=this.offset||0,e=this.triggerElement,r=this.placement||"right",o=this.tipPadding;this.placementController.placeOverlay(this.dialogEl,{offset:t,placement:r,tipPadding:o,trigger:e,type:this.type})}async managePopoverOpen(){super.managePopoverOpen();let t=this.open;if(this.open!==t||(await this.manageDelay(t),this.open!==t)||(await this.ensureOnDOM(t),this.open!==t))return;let e=await this.makeTransition(t);this.open===t&&await this.applyFocus(t,e)}async applyFocus(t,e){if(!(this.receivesFocus==="false"||this.type==="hint")){if(await Mt(),await Mt(),t===this.open&&!this.open){this.hasNonVirtualTrigger&&this.contains(this.getRootNode().activeElement)&&this.triggerElement.focus();return}e?.focus()}}async manageOpen(t){var e;if(!(!this.isConnected&&this.open)){if(this.hasUpdated||await this.updateComplete,this.open?(ro.add(this),this.willPreventClose&&(document.addEventListener("pointerup",()=>{this.dialogEl.classList.toggle("not-immediately-closable",!1),this.willPreventClose=!1},{once:!0}),this.dialogEl.classList.toggle("not-immediately-closable",!0))):(t&&this.dispose(),ro.remove(this)),this.open&&this.state!=="opened"?this.state="opening":!this.open&&this.state!=="closed"&&(this.state="closing"),this.usesDialog?this.manageDialogOpen():this.managePopoverOpen(),this.type==="auto"){let r=this.getRootNode();this.open?r.addEventListener("focusout",this.closeOnFocusOut,{capture:!0}):r.removeEventListener("focusout",this.closeOnFocusOut,{capture:!0})}if(!this.open&&this.type!=="hint"){let r=()=>{var o;let a=[],c=document.activeElement;for(;c!=null&&c.shadowRoot&&c.shadowRoot.activeElement;)c=c.shadowRoot.activeElement;for(;c;){let l=c.assignedSlot||c.parentElement||((o=c.getRootNode())==null?void 0:o.host);l&&a.push(l),c=l}return a};(e=this.triggerElement)!=null&&e.focus&&(this.contains(this.getRootNode().activeElement)||r().includes(this))&&this.triggerElement.focus()}}}unbindEvents(){var t;(t=this.abortController)==null||t.abort()}bindEvents(){if(!this.hasNonVirtualTrigger)return;this.abortController=new AbortController;let t=this.triggerElement;switch(this.triggerInteraction){case"click":this.bindClickEvents(t);return;case"longpress":this.bindLongpressEvents(t);return;case"hover":this.bindHoverEvents(t);return}}bindClickEvents(t){let e={signal:this.abortController.signal};t.addEventListener("click",this.handleClick,e),t.addEventListener("pointerdown",this.handlePointerdownForClick,e)}bindLongpressEvents(t){let e={signal:this.abortController.signal};t.addEventListener("longpress",this.handleLongpress,e),t.addEventListener("pointerdown",this.handlePointerdown,e),this.prepareLongpressDescription(t),!t.holdAffordance&&(t.addEventListener("keydown",this.handleKeydown,e),t.addEventListener("keyup",this.handleKeyup,e))}bindHoverEvents(t){let e={signal:this.abortController.signal};t.addEventListener("focusin",this.handleFocusin,e),t.addEventListener("focusout",this.handleFocusout,e),t.addEventListener("pointerenter",this.handlePointerenter,e),t.addEventListener("pointerleave",this.handlePointerleave,e),this.addEventListener("pointerenter",this.handleOverlayPointerenter,e),this.addEventListener("pointerleave",this.handleOverlayPointerleave,e)}manageTriggerElement(t){t&&(this.unbindEvents(),this.releaseAriaDescribedby()),!(!this.triggerElement||this.triggerElement instanceof X)&&(this.bindEvents(),this.receivesFocus!=="true"&&this.prepareAriaDescribedby())}prepareLongpressDescription(t){if(this.triggerInteraction!=="longpress"||this.releaseLongpressDescribedby!==dt||!this.elements.length)return;let e=document.createElement("div");e.id=`longpress-describedby-descriptor-${crypto.randomUUID().slice(0,8)}`;let r=ms()||ps()?"touch":"keyboard";e.textContent=$i[r],e.slot="longpress-describedby-descriptor";let o=t.getRootNode(),a=this.getRootNode();o===a?this.append(e):(e.hidden=!("host"in o),t.insertAdjacentElement("afterend",e));let c=ut(t,"aria-describedby",[e.id]);this.releaseLongpressDescribedby=()=>{c(),e.remove(),this.releaseLongpressDescribedby=dt}}prepareAriaDescribedby(){if(this.triggerInteraction!=="hover"||this.releaseAriaDescribedby!==dt||!this.elements.length||!this.hasNonVirtualTrigger)return;let t=this.triggerElement,e=t.getRootNode(),r=this.elements[0].getRootNode(),o=this.getRootNode();if(e==o){let a=ut(t,"aria-describedby",[this.id]);this.releaseAriaDescribedby=()=>{a(),this.releaseAriaDescribedby=dt}}else if(e===r){this.elementIds=this.elements.map(l=>l.id);let a=this.elements.map(l=>(l.id||(l.id=`${this.tagName.toLowerCase()}-helper-${crypto.randomUUID().slice(0,8)}`),l.id)),c=ut(t,"aria-describedby",a);this.releaseAriaDescribedby=()=>{c(),this.elements.map((l,u)=>{l.id=this.elementIds[u]}),this.releaseAriaDescribedby=dt}}}doPointerleave(){this.pointerentered=!1;let t=this.triggerElement;this.focusedin&&t.matches(":focus-visible")||(this.hoverTimeout=setTimeout(()=>{this.open=!1},qi))}handleBeforetoggle(t){t.newState!=="open"&&this.handleBrowserClose()}handleBrowserClose(){if(this.longpressState!=="opening"&&this.longpressState!=="pressed"){this.open=!1;return}this.manuallyKeepOpen()}manuallyKeepOpen(){super.manuallyKeepOpen(),this.open=!0,this.placementController.allowPlacementUpdate=!0,this.manageOpen(!1)}handleSlotchange(){this.triggerElement&&this.prepareAriaDescribedby(),this.elements.length?this.hasNonVirtualTrigger&&this.prepareLongpressDescription(this.triggerElement):this.releaseLongpressDescribedby()}shouldPreventClose(){let t=this.willPreventClose;return this.willPreventClose=!1,t}willUpdate(t){var e;if(this.hasAttribute("id")||this.setAttribute("id",`${this.tagName.toLowerCase()}-${crypto.randomUUID().slice(0,8)}`),t.has("open")&&(typeof t.get("open")<"u"||this.open)&&this.manageOpen(t.get("open")),t.has("trigger")){let[o,a]=((e=this.trigger)==null?void 0:e.split("@"))||[];this.elementResolver.selector=o?`#${o}`:"",this.triggerInteraction=a}let r=this.triggerElement;t.has(to)&&(this.triggerElement=this.elementResolver.element,this.manageTriggerElement(r)),t.has("triggerElement")&&this.manageTriggerElement(t.get("triggerElement"))}updated(t){super.updated(t),t.has("placement")&&(this.placement?this.dialogEl.setAttribute("actual-placement",this.placement):this.dialogEl.removeAttribute("actual-placement"),this.open&&typeof t.get("placement")<"u"&&this.placementController.resetOverlayPosition())}renderContent(){return i.html`
            <slot @slotchange=${this.handleSlotchange}></slot>
        `}get dialogStyleMap(){return{"--swc-overlay-open-count":po.openCount.toString()}}renderDialog(){return i.html`
            <dialog
                class="dialog"
                part="dialog"
                placement=${z(this.requiresPosition?this.placement||"right":void 0)}
                style=${Br(this.dialogStyleMap)}
                @close=${this.handleBrowserClose}
                @cancel=${this.handleBrowserClose}
                @beforetoggle=${this.handleBeforetoggle}
                ?is-visible=${this.state!=="closed"}
            >
                ${this.renderContent()}
            </dialog>
        `}renderPopover(){return i.html`
            <div
                class="dialog"
                part="dialog"
                placement=${z(this.requiresPosition?this.placement||"right":void 0)}
                popover=${z(this.popoverValue)}
                style=${Br(this.dialogStyleMap)}
                @beforetoggle=${this.handleBeforetoggle}
                @close=${this.handleBrowserClose}
                ?is-visible=${this.state!=="closed"}
            >
                ${this.renderContent()}
            </div>
        `}render(){let t=this.type==="modal"||this.type==="page";return i.html`
            ${t?this.renderDialog():this.renderPopover()}
            <slot name="longpress-describedby-descriptor"></slot>
        `}connectedCallback(){super.connectedCallback(),this.addEventListener("close",()=>{this.open=!1}),this.hasNonVirtualTrigger&&this.bindEvents()}disconnectedCallback(){this.hasNonVirtualTrigger&&this.unbindEvents(),this.releaseAriaDescribedby(),this.releaseLongpressDescribedby(),this.open=!1,super.disconnectedCallback()}};B.styles=[la],B.openCount=1,V([(0,n.property)({type:Boolean})],B.prototype,"delayed",1),V([(0,n.query)(".dialog")],B.prototype,"dialogEl",2),V([(0,n.property)({type:Boolean})],B.prototype,"disabled",1),V([(0,n.queryAssignedElements)({flatten:!0,selector:':not([slot="longpress-describedby-descriptor"], slot)'})],B.prototype,"elements",2),V([(0,n.property)({type:Number})],B.prototype,"offset",2),V([(0,n.property)({type:Boolean,reflect:!0})],B.prototype,"open",1),V([(0,n.property)()],B.prototype,"placement",2),V([(0,n.property)({attribute:"receives-focus"})],B.prototype,"receivesFocus",2),V([(0,n.query)("slot")],B.prototype,"slotEl",2),V([(0,n.state)()],B.prototype,"state",1),V([(0,n.property)({type:Number,attribute:"tip-padding"})],B.prototype,"tipPadding",2),V([(0,n.property)()],B.prototype,"trigger",2),V([(0,n.property)({attribute:!1})],B.prototype,"triggerElement",2),V([(0,n.property)({attribute:!1})],B.prototype,"triggerInteraction",2),V([(0,n.property)()],B.prototype,"type",2);Tr=B});var pe={};var Nt=E(()=>{"use strict";P();ho();b("sp-overlay",Tr)});var Fi,ma,pa=E(()=>{"use strict";h();Fi=i.css`
:host{--spectrum-overlay-animation-distance:6px;--spectrum-overlay-animation-duration:var(
--spectrum-animation-duration-100
);opacity:0;pointer-events:none;transition:transform var(--spectrum-overlay-animation-duration) ease-in-out,opacity var(--spectrum-overlay-animation-duration) ease-in-out,visibility 0s linear var(--spectrum-overlay-animation-duration);visibility:hidden}:host([open]){opacity:1;pointer-events:auto;transition-delay:0s;visibility:visible}:host([open]) .spectrum-Popover--bottom-end,:host([open]) .spectrum-Popover--bottom-left,:host([open]) .spectrum-Popover--bottom-right,:host([open]) .spectrum-Popover--bottom-start,:host([placement*=bottom][open]){--spectrum-overlay-animation-distance:6px;transform:translateY(var(--spectrum-overlay-animation-distance))}:host([open]) .spectrum-Popover--top-end,:host([open]) .spectrum-Popover--top-left,:host([open]) .spectrum-Popover--top-right,:host([open]) .spectrum-Popover--top-start,:host([placement*=top][open]){--spectrum-overlay-animation-distance:6px;transform:translateY(calc(var(--spectrum-overlay-animation-distance)*-1))}:host([dir=rtl][open]) .spectrum-Popover--start,:host([dir=rtl][open]) .spectrum-Popover--start-bottom,:host([dir=rtl][open]) .spectrum-Popover--start-top,:host([open]) .spectrum-Popover--end,:host([open]) .spectrum-Popover--end-bottom,:host([open]) .spectrum-Popover--end-top,:host([open]) .spectrum-Popover--right-bottom,:host([open]) .spectrum-Popover--right-top,:host([placement*=right][open]){--spectrum-overlay-animation-distance:6px;transform:translateX(var(--spectrum-overlay-animation-distance))}:host([dir=rtl][open]) .spectrum-Popover--end,:host([dir=rtl][open]) .spectrum-Popover--end-bottom,:host([dir=rtl][open]) .spectrum-Popover--end-top,:host([open]) .spectrum-Popover--left-bottom,:host([open]) .spectrum-Popover--left-top,:host([open]) .spectrum-Popover--start,:host([open]) .spectrum-Popover--start-bottom,:host([open]) .spectrum-Popover--start-top,:host([placement*=left][open]){--spectrum-overlay-animation-distance:6px;transform:translateX(calc(var(--spectrum-overlay-animation-distance)*-1))}:host{--flow-direction:1;--spectrum-popover-offset:0px;--spectrum-popover-background-color:var(
--spectrum-background-layer-2-color
);--spectrum-popover-border-color:var(--spectrum-gray-400);--spectrum-popover-content-area-spacing-vertical:var(
--spectrum-popover-top-to-content-area
);--spectrum-popover-shadow-horizontal:var(--spectrum-drop-shadow-x);--spectrum-popover-shadow-vertical:var(--spectrum-drop-shadow-y);--spectrum-popover-shadow-blur:var(--spectrum-drop-shadow-blur);--spectrum-popover-shadow-color:var(--spectrum-drop-shadow-color);--spectrum-popover-corner-radius:var(--spectrum-corner-radius-100);--spectrum-popover-pointer-width:var(--spectrum-popover-tip-width);--spectrum-popover-pointer-height:var(--spectrum-popover-tip-height);--spectrum-popover-pointer-edge-offset:calc(var(--spectrum-corner-radius-100) + var(--spectrum-popover-tip-width)/2);--spectrum-popover-pointer-edge-spacing:calc(var(--spectrum-popover-pointer-edge-offset) - var(--spectrum-popover-tip-width)/2)}:host([dir=rtl]){--flow-direction:-1}@media (forced-colors:active){:host{--highcontrast-popover-border-color:CanvasText}}:host{--spectrum-popover-filter:drop-shadow(var(
--mod-popover-shadow-horizontal,var(--spectrum-popover-shadow-horizontal)
) var(
--mod-popover-shadow-vertical,var(--spectrum-popover-shadow-vertical)
) var(--mod-popover-shadow-blur,var(--spectrum-popover-shadow-blur)) var(
--mod-popover-shadow-color,var(--spectrum-popover-shadow-color)
));background-color:var(
--mod-popover-background-color,var(--spectrum-popover-background-color)
);border-color:var(
--highcontrast-popover-border-color,var(--mod-popover-border-color,var(--spectrum-popover-border-color))
);border-radius:var(
--mod-popover-corner-radius,var(--spectrum-popover-corner-radius)
);border-style:solid;border-width:var(
--mod-popover-border-width,var(--spectrum-popover-border-width)
);box-sizing:border-box;display:inline-flex;filter:var(--mod-popover-filter,var(--spectrum-popover-filter));flex-direction:column;outline:none;padding:var(
--mod-popover-content-area-spacing-vertical,var(--spectrum-popover-content-area-spacing-vertical)
) 0;position:absolute}:host([tip]) #tip .triangle{stroke-linecap:square;stroke-linejoin:miter;fill:var(
--highcontrast-popover-background-color,var(
--mod-popover-background-color,var(--spectrum-popover-background-color)
)
);stroke:var(
--highcontrast-popover-border-color,var(--mod-popover-border-color,var(--spectrum-popover-border-color))
);stroke-width:var(
--mod-popover-border-width,var(--spectrum-popover-border-width)
)}*{--mod-popover-filter:none}.spectrum-Popover--top-end,.spectrum-Popover--top-left,.spectrum-Popover--top-right,.spectrum-Popover--top-start,:host([placement*=top]){margin-bottom:var(--mod-popover-offset,var(--spectrum-popover-offset))}.spectrum-Popover--bottom-end,.spectrum-Popover--bottom-left,.spectrum-Popover--bottom-right,.spectrum-Popover--bottom-start,:host([placement*=bottom]){margin-top:var(--mod-popover-offset,var(--spectrum-popover-offset))}.spectrum-Popover--right-bottom,.spectrum-Popover--right-top,:host([placement*=right]){margin-left:var(--mod-popover-offset,var(--spectrum-popover-offset))}.spectrum-Popover--left-bottom,.spectrum-Popover--left-top,:host([placement*=left]){margin-right:var(--mod-popover-offset,var(--spectrum-popover-offset))}.spectrum-Popover--start,.spectrum-Popover--start-bottom,.spectrum-Popover--start-top{margin-inline-end:var(
--mod-popover-offset,var(--spectrum-popover-offset)
)}.spectrum-Popover--end,.spectrum-Popover--end-bottom,.spectrum-Popover--end-top{margin-inline-start:var(
--mod-popover-offset,var(--spectrum-popover-offset)
)}:host([tip]) #tip,:host([tip]) .spectrum-Popover--bottom-end #tip,:host([tip]) .spectrum-Popover--bottom-left #tip,:host([tip]) .spectrum-Popover--bottom-right #tip,:host([tip]) .spectrum-Popover--bottom-start #tip,:host([tip]) .spectrum-Popover--top-end #tip,:host([tip]) .spectrum-Popover--top-left #tip,:host([tip]) .spectrum-Popover--top-right #tip,:host([tip]) .spectrum-Popover--top-start #tip,:host([tip][placement*=bottom]) #tip,:host([tip][placement*=top]) #tip{height:var(
--mod-popover-pointer-height,var(--spectrum-popover-pointer-height)
);left:0;margin:auto;position:absolute;right:0;top:100%;transform:translate(0);width:var(
--mod-popover-pointer-width,var(--spectrum-popover-pointer-width)
)}:host([tip]) .spectrum-Popover--top-left #tip{left:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
);right:auto}:host([tip]) .spectrum-Popover--top-right #tip{left:auto;right:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
)}:host([tip]) .spectrum-Popover--top-start #tip{margin-inline-start:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
)}:host([tip]) .spectrum-Popover--top-end #tip{margin-inline-end:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
)}:host([tip]) .spectrum-Popover--bottom-end #tip,:host([tip]) .spectrum-Popover--bottom-left #tip,:host([tip]) .spectrum-Popover--bottom-right #tip,:host([tip]) .spectrum-Popover--bottom-start #tip,:host([tip][placement*=bottom]) #tip{bottom:100%;top:auto;transform:scaleY(-1)}:host([tip]) .spectrum-Popover--bottom-left #tip{left:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
);right:auto}:host([tip]) .spectrum-Popover--bottom-right #tip{left:auto;right:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
)}:host([tip]) .spectrum-Popover--bottom-start #tip{margin-inline-start:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
)}:host([tip]) .spectrum-Popover--bottom-end #tip{margin-inline-end:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
)}:host([tip]) .spectrum-Popover--end #tip,:host([tip]) .spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--start #tip,:host([tip]) .spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--start-top #tip,:host([tip][placement*=left]) #tip,:host([tip][placement*=right]) #tip{bottom:0;height:var(
--mod-popover-pointer-width,var(--spectrum-popover-pointer-width)
);top:0;width:var(
--mod-popover-pointer-height,var(--spectrum-popover-pointer-height)
)}:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--left-top #tip,:host([tip][placement*=left]) .spectrum-Popover--end #tip,:host([tip][placement*=left]) .spectrum-Popover--end-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--end-top #tip,:host([tip][placement*=left]) .spectrum-Popover--left-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--left-top #tip,:host([tip][placement*=left]) .spectrum-Popover--right-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--right-top #tip,:host([tip][placement*=left]) .spectrum-Popover--start #tip,:host([tip][placement*=left]) .spectrum-Popover--start-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--start-top #tip,:host([tip][placement*=left][placement*=left]) #tip,:host([tip][placement*=right]) .spectrum-Popover--left-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--left-top #tip,:host([tip][placement*=right][placement*=left]) #tip{left:100%;right:auto}:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--right-top #tip,:host([tip][placement*=left]) .spectrum-Popover--right-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--right-top #tip,:host([tip][placement*=left][placement*=right]) #tip,:host([tip][placement*=right]) .spectrum-Popover--end #tip,:host([tip][placement*=right]) .spectrum-Popover--end-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--end-top #tip,:host([tip][placement*=right]) .spectrum-Popover--left-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--left-top #tip,:host([tip][placement*=right]) .spectrum-Popover--right-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--right-top #tip,:host([tip][placement*=right]) .spectrum-Popover--start #tip,:host([tip][placement*=right]) .spectrum-Popover--start-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--start-top #tip,:host([tip][placement*=right][placement*=right]) #tip{left:auto;right:100%;transform:scaleX(-1)}:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--start-top #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--end-top #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--left-top #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--right-top #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--start-top #tip,:host([tip][placement*=left]) .spectrum-Popover--end-top #tip,:host([tip][placement*=left]) .spectrum-Popover--left-top #tip,:host([tip][placement*=left]) .spectrum-Popover--right-top #tip,:host([tip][placement*=left]) .spectrum-Popover--start-top #tip,:host([tip][placement*=right]) .spectrum-Popover--end-top #tip,:host([tip][placement*=right]) .spectrum-Popover--left-top #tip,:host([tip][placement*=right]) .spectrum-Popover--right-top #tip,:host([tip][placement*=right]) .spectrum-Popover--start-top #tip{bottom:auto;top:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
)}:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--end-bottom.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--end-top.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--end.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--left-bottom.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--left-top.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--right-bottom.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--right-top.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--start-bottom.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--start-top.spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--left-bottom #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--right-bottom #tip,:host([tip]) .spectrum-Popover--start.spectrum-Popover--start-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--end-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--left-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--right-bottom #tip,:host([tip][placement*=left]) .spectrum-Popover--start-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--end-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--left-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--right-bottom #tip,:host([tip][placement*=right]) .spectrum-Popover--start-bottom #tip{bottom:var(
--mod-popover-pointer-edge-spacing,var(--spectrum-popover-pointer-edge-spacing)
);top:auto}:host([tip]) .spectrum-Popover--start #tip,:host([tip]) .spectrum-Popover--start-bottom #tip,:host([tip]) .spectrum-Popover--start-top #tip{margin-inline-start:100%}:host([dir=rtl][tip]) .spectrum-Popover--start #tip,:host([dir=rtl][tip]) .spectrum-Popover--start-bottom #tip,:host([dir=rtl][tip]) .spectrum-Popover--start-top #tip{transform:none}:host([tip]) .spectrum-Popover--end #tip,:host([tip]) .spectrum-Popover--end-bottom #tip,:host([tip]) .spectrum-Popover--end-top #tip{margin-inline-end:100%;transform:scaleX(-1)}:host([dir=rtl][tip]) .spectrum-Popover--end #tip,:host([dir=rtl][tip]) .spectrum-Popover--end-bottom #tip,:host([dir=rtl][tip]) .spectrum-Popover--end-top #tip{transform:scaleX(1)}:host{--spectrum-popover-border-width:var(
--system-spectrum-popover-border-width
)}:host{--sp-popover-tip-size:24px;--mod-popover-pointer-width:max(var(--spectrum-popover-pointer-width),var(--spectrum-popover-pointer-height));--mod-popover-pointer-height:max(var(--spectrum-popover-pointer-width),var(--spectrum-popover-pointer-height));clip-path:none;max-height:100%;max-width:100%;min-width:min-content}::slotted(*){overscroll-behavior:contain}:host([placement*=left]) #tip[style],:host([placement*=right]) #tip[style]{bottom:auto}:host([placement*=bottom]) #tip[style],:host([placement*=top]) #tip[style]{right:auto}.block{display:block;height:50%;width:100%}.inline{display:block;height:100%;width:50%}:host([placement*=left]) .block,:host([placement*=right]) .block{display:none}:host([placement*=bottom]) .inline,:host([placement*=top]) .inline{display:none}::slotted(.visually-hidden){clip:rect(0,0,0,0);border:0;clip-path:inset(50%);height:1px;margin:0 -1px -1px 0;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}::slotted(sp-menu){margin:0}:host([dialog]){min-width:var(
--mod-popover-dialog-min-width,var(--spectrum-popover-dialog-min-width,270px)
);padding:var(
--mod-popover-dialog-padding,var(--spectrum-popover-dialog-padding,30px 29px)
)}
`,ma=Fi});var Ui,Ri,qe,Pt,da=E(()=>{"use strict";h();S();pa();Ui=Object.defineProperty,Ri=Object.getOwnPropertyDescriptor,qe=(s,t,e,r)=>{for(var o=r>1?void 0:r?Ri(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Ui(t,e,o),o},Pt=class extends I{constructor(){super(...arguments),this.dialog=!1,this.open=!1,this.tip=!1}static get styles(){return[ma]}renderTip(){return i.html`
            <div id="tip" aria-hidden="true">
                <svg class="tip block" viewBox="0 -0.5 16 9">
                    <path class="triangle" d="M-1,-1 8,8 17,-1"></path>
                </svg>
                <svg class="tip inline" viewBox="0 -0.5 9 16">
                    <path class="triangle" d="M-1,-1 8,8 -1,17"></path>
                </svg>
            </div>
        `}update(t){super.update(t)}render(){return i.html`
            <slot></slot>
            ${this.tip?this.renderTip():i.nothing}
        `}};qe([(0,n.property)({type:Boolean,reflect:!0})],Pt.prototype,"dialog",2),qe([(0,n.property)({type:Boolean,reflect:!0})],Pt.prototype,"open",2),qe([(0,n.property)({reflect:!0})],Pt.prototype,"placement",2),qe([(0,n.property)({type:Boolean,reflect:!0})],Pt.prototype,"tip",2),qe([(0,n.query)("#tip")],Pt.prototype,"tipElement",2)});var Mi={};var go=E(()=>{"use strict";da();P();b("sp-popover",Pt)});h();var Na=["spectrum","express"],Va=["medium","large","medium-express","large-express"],Ka=["light","lightest","dark","darkest","light-express","lightest-express","dark-express","darkest-express"],Re=class F extends HTMLElement{constructor(){super(),this._dir="",this._theme="spectrum",this._color="",this._scale="",this.trackedChildren=new Set,this._updateRequested=!1,this._contextConsumers=new Map,this.attachShadow({mode:"open"});let t=document.importNode(F.template.content,!0);this.shadowRoot.appendChild(t),this.shouldAdoptStyles(),this.addEventListener("sp-query-theme",this.onQueryTheme),this.addEventListener("sp-language-context",this._handleContextPresence),this.updateComplete=this.__createDeferredPromise()}static get observedAttributes(){return["color","scale","theme","lang","dir"]}set dir(t){if(t===this.dir)return;this.setAttribute("dir",t),this._dir=t;let e=t==="rtl"?t:"ltr";this.trackedChildren.forEach(r=>{r.setAttribute("dir",e)})}get dir(){return this._dir}attributeChangedCallback(t,e,r){e!==r&&(t==="color"?this.color=r:t==="scale"?this.scale=r:t==="lang"&&r?(this.lang=r,this._provideContext()):t==="theme"?this.theme=r:t==="dir"&&(this.dir=r))}requestUpdate(){window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow?window.ShadyCSS.styleElement(this):this.shouldAdoptStyles()}get theme(){let t=F.themeFragmentsByKind.get("theme"),{name:e}=t&&t.get("default")||{};return this._theme||e||""}set theme(t){if(t===this._theme)return;let e=t&&Na.includes(t)?t:this.theme;e!==this._theme&&(this._theme=e,this.requestUpdate()),e?this.setAttribute("theme",e):this.removeAttribute("theme")}get color(){let t=F.themeFragmentsByKind.get("color"),{name:e}=t&&t.get("default")||{};return this._color||e||""}set color(t){if(t===this._color)return;let e=t&&Ka.includes(t)?t:this.color;e!==this._color&&(this._color=e,this.requestUpdate()),e?this.setAttribute("color",e):this.removeAttribute("color")}get scale(){let t=F.themeFragmentsByKind.get("scale"),{name:e}=t&&t.get("default")||{};return this._scale||e||""}set scale(t){if(t===this._scale)return;let e=t&&Va.includes(t)?t:this.scale;e!==this._scale&&(this._scale=e,this.requestUpdate()),e?this.setAttribute("scale",e):this.removeAttribute("scale")}get styles(){let t=[...F.themeFragmentsByKind.keys()],e=(r,o,a)=>{let c=a&&a!=="theme"&&this.theme==="express"?r.get(`${o}-express`):r.get(o),l=o==="spectrum"||!a||this.hasAttribute(a);if(c&&l)return c.styles};return[...t.reduce((r,o)=>{let a=F.themeFragmentsByKind.get(o),c;if(o==="app"||o==="core")c=e(a,o);else{let{[o]:l}=this;c=e(a,l,o)}return c&&r.push(c),r},[])]}static get template(){return this.templateElement||(this.templateElement=document.createElement("template"),this.templateElement.innerHTML="<slot></slot>"),this.templateElement}__createDeferredPromise(){return new Promise(t=>{this.__resolve=t})}onQueryTheme(t){if(t.defaultPrevented)return;t.preventDefault();let{detail:e}=t;e.color=this.color||void 0,e.scale=this.scale||void 0,e.lang=this.lang||document.documentElement.lang||navigator.language,e.theme=this.theme||void 0}connectedCallback(){if(this.shouldAdoptStyles(),window.ShadyCSS!==void 0&&window.ShadyCSS.styleElement(this),F.instances.add(this),!this.hasAttribute("dir")){let t=this.assignedSlot||this.parentNode;for(;t!==document.documentElement&&!(t instanceof F);)t=t.assignedSlot||t.parentNode||t.host;this.dir=t.dir==="rtl"?t.dir:"ltr"}}disconnectedCallback(){F.instances.delete(this)}startManagingContentDirection(t){this.trackedChildren.add(t)}stopManagingContentDirection(t){this.trackedChildren.delete(t)}async shouldAdoptStyles(){this._updateRequested||(this.updateComplete=this.__createDeferredPromise(),this._updateRequested=!0,this._updateRequested=await!1,this.adoptStyles(),this.__resolve(!0))}adoptStyles(){let t=this.styles;if(window.ShadyCSS!==void 0&&!window.ShadyCSS.nativeShadow&&window.ShadyCSS.ScopingShim){let e=[];for(let[r,o]of F.themeFragmentsByKind)for(let[a,{styles:c}]of o){if(a==="default")continue;let l=c.cssText;F.defaultFragments.has(a)||(l=l.replace(":host",`:host([${r}='${a}'])`)),e.push(l)}window.ShadyCSS.ScopingShim.prepareAdoptedCssText(e,this.localName),window.ShadyCSS.prepareTemplate(F.template,this.localName)}else if(i.supportsAdoptingStyleSheets){let e=[];for(let r of t)e.push(r.styleSheet);this.shadowRoot.adoptedStyleSheets=e}else this.shadowRoot.querySelectorAll("style").forEach(e=>e.remove()),t.forEach(e=>{let r=document.createElement("style");r.textContent=e.cssText,this.shadowRoot.appendChild(r)})}static registerThemeFragment(t,e,r){let o=F.themeFragmentsByKind.get(e)||new Map;o.size===0&&(F.themeFragmentsByKind.set(e,o),o.set("default",{name:t,styles:r}),F.defaultFragments.add(t)),o.set(t,{name:t,styles:r}),F.instances.forEach(a=>a.shouldAdoptStyles())}_provideContext(){this._contextConsumers.forEach(([t,e])=>t(this.lang,e))}_handleContextPresence(t){t.stopPropagation();let e=t.composedPath()[0];if(this._contextConsumers.has(e))return;this._contextConsumers.set(e,[t.detail.callback,()=>this._contextConsumers.delete(e)]);let[r,o]=this._contextConsumers.get(e)||[];r&&o&&r(this.lang||document.documentElement.lang||navigator.language,o)}};Re.themeFragmentsByKind=new Map,Re.defaultFragments=new Set(["spectrum"]),Re.instances=new Set;var jt=Re;customElements.define("sp-theme",jt);h();var Wa=i.css`
:host,:root{--spectrum-global-color-status:Verified;--spectrum-global-color-version:5.1.0;--spectrum-global-color-opacity-100:1;--spectrum-global-color-opacity-90:0.9;--spectrum-global-color-opacity-80:0.8;--spectrum-global-color-opacity-70:0.7;--spectrum-global-color-opacity-60:0.6;--spectrum-global-color-opacity-55:0.55;--spectrum-global-color-opacity-50:0.5;--spectrum-global-color-opacity-42:0.42;--spectrum-global-color-opacity-40:0.4;--spectrum-global-color-opacity-30:0.3;--spectrum-global-color-opacity-25:0.25;--spectrum-global-color-opacity-20:0.2;--spectrum-global-color-opacity-15:0.15;--spectrum-global-color-opacity-10:0.1;--spectrum-global-color-opacity-8:0.08;--spectrum-global-color-opacity-7:0.07;--spectrum-global-color-opacity-6:0.06;--spectrum-global-color-opacity-5:0.05;--spectrum-global-color-opacity-4:0.04;--spectrum-global-color-opacity-0:0;--spectrum-global-color-celery-400-rgb:39,187,54;--spectrum-global-color-celery-400:rgb(var(--spectrum-global-color-celery-400-rgb));--spectrum-global-color-celery-500-rgb:7,167,33;--spectrum-global-color-celery-500:rgb(var(--spectrum-global-color-celery-500-rgb));--spectrum-global-color-celery-600-rgb:0,145,18;--spectrum-global-color-celery-600:rgb(var(--spectrum-global-color-celery-600-rgb));--spectrum-global-color-celery-700-rgb:0,124,15;--spectrum-global-color-celery-700:rgb(var(--spectrum-global-color-celery-700-rgb));--spectrum-global-color-chartreuse-400-rgb:152,197,10;--spectrum-global-color-chartreuse-400:rgb(var(--spectrum-global-color-chartreuse-400-rgb));--spectrum-global-color-chartreuse-500-rgb:135,177,3;--spectrum-global-color-chartreuse-500:rgb(var(--spectrum-global-color-chartreuse-500-rgb));--spectrum-global-color-chartreuse-600-rgb:118,156,0;--spectrum-global-color-chartreuse-600:rgb(var(--spectrum-global-color-chartreuse-600-rgb));--spectrum-global-color-chartreuse-700-rgb:103,136,0;--spectrum-global-color-chartreuse-700:rgb(var(--spectrum-global-color-chartreuse-700-rgb));--spectrum-global-color-yellow-400-rgb:232,198,0;--spectrum-global-color-yellow-400:rgb(var(--spectrum-global-color-yellow-400-rgb));--spectrum-global-color-yellow-500-rgb:215,179,0;--spectrum-global-color-yellow-500:rgb(var(--spectrum-global-color-yellow-500-rgb));--spectrum-global-color-yellow-600-rgb:196,159,0;--spectrum-global-color-yellow-600:rgb(var(--spectrum-global-color-yellow-600-rgb));--spectrum-global-color-yellow-700-rgb:176,140,0;--spectrum-global-color-yellow-700:rgb(var(--spectrum-global-color-yellow-700-rgb));--spectrum-global-color-magenta-400-rgb:222,61,130;--spectrum-global-color-magenta-400:rgb(var(--spectrum-global-color-magenta-400-rgb));--spectrum-global-color-magenta-500-rgb:200,34,105;--spectrum-global-color-magenta-500:rgb(var(--spectrum-global-color-magenta-500-rgb));--spectrum-global-color-magenta-600-rgb:173,9,85;--spectrum-global-color-magenta-600:rgb(var(--spectrum-global-color-magenta-600-rgb));--spectrum-global-color-magenta-700-rgb:142,0,69;--spectrum-global-color-magenta-700:rgb(var(--spectrum-global-color-magenta-700-rgb));--spectrum-global-color-fuchsia-400-rgb:205,58,206;--spectrum-global-color-fuchsia-400:rgb(var(--spectrum-global-color-fuchsia-400-rgb));--spectrum-global-color-fuchsia-500-rgb:182,34,183;--spectrum-global-color-fuchsia-500:rgb(var(--spectrum-global-color-fuchsia-500-rgb));--spectrum-global-color-fuchsia-600-rgb:157,3,158;--spectrum-global-color-fuchsia-600:rgb(var(--spectrum-global-color-fuchsia-600-rgb));--spectrum-global-color-fuchsia-700-rgb:128,0,129;--spectrum-global-color-fuchsia-700:rgb(var(--spectrum-global-color-fuchsia-700-rgb));--spectrum-global-color-purple-400-rgb:157,87,244;--spectrum-global-color-purple-400:rgb(var(--spectrum-global-color-purple-400-rgb));--spectrum-global-color-purple-500-rgb:137,61,231;--spectrum-global-color-purple-500:rgb(var(--spectrum-global-color-purple-500-rgb));--spectrum-global-color-purple-600-rgb:115,38,211;--spectrum-global-color-purple-600:rgb(var(--spectrum-global-color-purple-600-rgb));--spectrum-global-color-purple-700-rgb:93,19,183;--spectrum-global-color-purple-700:rgb(var(--spectrum-global-color-purple-700-rgb));--spectrum-global-color-indigo-400-rgb:104,109,244;--spectrum-global-color-indigo-400:rgb(var(--spectrum-global-color-indigo-400-rgb));--spectrum-global-color-indigo-500-rgb:82,88,228;--spectrum-global-color-indigo-500:rgb(var(--spectrum-global-color-indigo-500-rgb));--spectrum-global-color-indigo-600-rgb:64,70,202;--spectrum-global-color-indigo-600:rgb(var(--spectrum-global-color-indigo-600-rgb));--spectrum-global-color-indigo-700-rgb:50,54,168;--spectrum-global-color-indigo-700:rgb(var(--spectrum-global-color-indigo-700-rgb));--spectrum-global-color-seafoam-400-rgb:0,161,154;--spectrum-global-color-seafoam-400:rgb(var(--spectrum-global-color-seafoam-400-rgb));--spectrum-global-color-seafoam-500-rgb:0,140,135;--spectrum-global-color-seafoam-500:rgb(var(--spectrum-global-color-seafoam-500-rgb));--spectrum-global-color-seafoam-600-rgb:0,119,114;--spectrum-global-color-seafoam-600:rgb(var(--spectrum-global-color-seafoam-600-rgb));--spectrum-global-color-seafoam-700-rgb:0,99,95;--spectrum-global-color-seafoam-700:rgb(var(--spectrum-global-color-seafoam-700-rgb));--spectrum-global-color-red-400-rgb:234,56,41;--spectrum-global-color-red-400:rgb(var(--spectrum-global-color-red-400-rgb));--spectrum-global-color-red-500-rgb:211,21,16;--spectrum-global-color-red-500:rgb(var(--spectrum-global-color-red-500-rgb));--spectrum-global-color-red-600-rgb:180,0,0;--spectrum-global-color-red-600:rgb(var(--spectrum-global-color-red-600-rgb));--spectrum-global-color-red-700-rgb:147,0,0;--spectrum-global-color-red-700:rgb(var(--spectrum-global-color-red-700-rgb));--spectrum-global-color-orange-400-rgb:246,133,17;--spectrum-global-color-orange-400:rgb(var(--spectrum-global-color-orange-400-rgb));--spectrum-global-color-orange-500-rgb:228,111,0;--spectrum-global-color-orange-500:rgb(var(--spectrum-global-color-orange-500-rgb));--spectrum-global-color-orange-600-rgb:203,93,0;--spectrum-global-color-orange-600:rgb(var(--spectrum-global-color-orange-600-rgb));--spectrum-global-color-orange-700-rgb:177,76,0;--spectrum-global-color-orange-700:rgb(var(--spectrum-global-color-orange-700-rgb));--spectrum-global-color-green-400-rgb:0,143,93;--spectrum-global-color-green-400:rgb(var(--spectrum-global-color-green-400-rgb));--spectrum-global-color-green-500-rgb:0,122,77;--spectrum-global-color-green-500:rgb(var(--spectrum-global-color-green-500-rgb));--spectrum-global-color-green-600-rgb:0,101,62;--spectrum-global-color-green-600:rgb(var(--spectrum-global-color-green-600-rgb));--spectrum-global-color-green-700-rgb:0,81,50;--spectrum-global-color-green-700:rgb(var(--spectrum-global-color-green-700-rgb));--spectrum-global-color-blue-400-rgb:20,122,243;--spectrum-global-color-blue-400:rgb(var(--spectrum-global-color-blue-400-rgb));--spectrum-global-color-blue-500-rgb:2,101,220;--spectrum-global-color-blue-500:rgb(var(--spectrum-global-color-blue-500-rgb));--spectrum-global-color-blue-600-rgb:0,84,182;--spectrum-global-color-blue-600:rgb(var(--spectrum-global-color-blue-600-rgb));--spectrum-global-color-blue-700-rgb:0,68,145;--spectrum-global-color-blue-700:rgb(var(--spectrum-global-color-blue-700-rgb));--spectrum-global-color-gray-50-rgb:255,255,255;--spectrum-global-color-gray-50:rgb(var(--spectrum-global-color-gray-50-rgb));--spectrum-global-color-gray-75-rgb:253,253,253;--spectrum-global-color-gray-75:rgb(var(--spectrum-global-color-gray-75-rgb));--spectrum-global-color-gray-100-rgb:248,248,248;--spectrum-global-color-gray-100:rgb(var(--spectrum-global-color-gray-100-rgb));--spectrum-global-color-gray-200-rgb:230,230,230;--spectrum-global-color-gray-200:rgb(var(--spectrum-global-color-gray-200-rgb));--spectrum-global-color-gray-300-rgb:213,213,213;--spectrum-global-color-gray-300:rgb(var(--spectrum-global-color-gray-300-rgb));--spectrum-global-color-gray-400-rgb:177,177,177;--spectrum-global-color-gray-400:rgb(var(--spectrum-global-color-gray-400-rgb));--spectrum-global-color-gray-500-rgb:144,144,144;--spectrum-global-color-gray-500:rgb(var(--spectrum-global-color-gray-500-rgb));--spectrum-global-color-gray-600-rgb:109,109,109;--spectrum-global-color-gray-600:rgb(var(--spectrum-global-color-gray-600-rgb));--spectrum-global-color-gray-700-rgb:70,70,70;--spectrum-global-color-gray-700:rgb(var(--spectrum-global-color-gray-700-rgb));--spectrum-global-color-gray-800-rgb:34,34,34;--spectrum-global-color-gray-800:rgb(var(--spectrum-global-color-gray-800-rgb));--spectrum-global-color-gray-900-rgb:0,0,0;--spectrum-global-color-gray-900:rgb(var(--spectrum-global-color-gray-900-rgb));--spectrum-alias-background-color-primary:var(
--spectrum-global-color-gray-50
);--spectrum-alias-background-color-secondary:var(
--spectrum-global-color-gray-100
);--spectrum-alias-background-color-tertiary:var(
--spectrum-global-color-gray-300
);--spectrum-alias-background-color-modal-overlay:rgba(0,0,0,.4);--spectrum-alias-dropshadow-color:rgba(0,0,0,.15);--spectrum-alias-background-color-hover-overlay:rgba(0,0,0,.04);--spectrum-alias-highlight-hover:rgba(0,0,0,.06);--spectrum-alias-highlight-down:rgba(0,0,0,.1);--spectrum-alias-highlight-selected:rgba(2,101,220,.1);--spectrum-alias-highlight-selected-hover:rgba(2,101,220,.2);--spectrum-alias-text-highlight-color:rgba(2,101,220,.2);--spectrum-alias-background-color-quickactions:hsla(0,0%,97%,.9);--spectrum-alias-border-color-selected:var(
--spectrum-global-color-blue-500
);--spectrum-alias-border-color-translucent:rgba(0,0,0,.1);--spectrum-alias-radial-reaction-color-default:rgba(34,34,34,.6);--spectrum-alias-pasteboard-background-color:var(
--spectrum-global-color-gray-300
);--spectrum-alias-appframe-border-color:var(
--spectrum-global-color-gray-300
);--spectrum-alias-appframe-separator-color:var(
--spectrum-global-color-gray-300
);--spectrum-scrollbar-mac-s-track-background-color:var(
--spectrum-global-color-gray-75
);--spectrum-scrollbar-mac-m-track-background-color:var(
--spectrum-global-color-gray-75
);--spectrum-scrollbar-mac-l-track-background-color:var(
--spectrum-global-color-gray-75
);--spectrum-well-background-color:rgba(34,34,34,.02)}:host,:root{color-scheme:light}:host,:root{--spectrum-overlay-opacity:0.4;--spectrum-drop-shadow-color-rgb:0,0,0;--spectrum-drop-shadow-color-opacity:0.15;--spectrum-drop-shadow-color:rgba(var(--spectrum-drop-shadow-color-rgb),var(--spectrum-drop-shadow-color-opacity));--spectrum-background-base-color:var(--spectrum-gray-200);--spectrum-background-layer-1-color:var(--spectrum-gray-100);--spectrum-background-layer-2-color:var(--spectrum-gray-50);--spectrum-neutral-background-color-default:var(--spectrum-gray-800);--spectrum-neutral-background-color-hover:var(--spectrum-gray-900);--spectrum-neutral-background-color-down:var(--spectrum-gray-900);--spectrum-neutral-background-color-key-focus:var(--spectrum-gray-900);--spectrum-neutral-subdued-background-color-default:var(
--spectrum-gray-600
);--spectrum-neutral-subdued-background-color-hover:var(--spectrum-gray-700);--spectrum-neutral-subdued-background-color-down:var(--spectrum-gray-800);--spectrum-neutral-subdued-background-color-key-focus:var(
--spectrum-gray-700
);--spectrum-accent-background-color-default:var(
--spectrum-accent-color-900
);--spectrum-accent-background-color-hover:var(--spectrum-accent-color-1000);--spectrum-accent-background-color-down:var(--spectrum-accent-color-1100);--spectrum-accent-background-color-key-focus:var(
--spectrum-accent-color-1000
);--spectrum-informative-background-color-default:var(
--spectrum-informative-color-900
);--spectrum-informative-background-color-hover:var(
--spectrum-informative-color-1000
);--spectrum-informative-background-color-down:var(
--spectrum-informative-color-1100
);--spectrum-informative-background-color-key-focus:var(
--spectrum-informative-color-1000
);--spectrum-negative-background-color-default:var(
--spectrum-negative-color-900
);--spectrum-negative-background-color-hover:var(
--spectrum-negative-color-1000
);--spectrum-negative-background-color-down:var(
--spectrum-negative-color-1100
);--spectrum-negative-background-color-key-focus:var(
--spectrum-negative-color-1000
);--spectrum-positive-background-color-default:var(
--spectrum-positive-color-900
);--spectrum-positive-background-color-hover:var(
--spectrum-positive-color-1000
);--spectrum-positive-background-color-down:var(
--spectrum-positive-color-1100
);--spectrum-positive-background-color-key-focus:var(
--spectrum-positive-color-1000
);--spectrum-notice-background-color-default:var(
--spectrum-notice-color-600
);--spectrum-gray-background-color-default:var(--spectrum-gray-700);--spectrum-red-background-color-default:var(--spectrum-red-900);--spectrum-orange-background-color-default:var(--spectrum-orange-600);--spectrum-yellow-background-color-default:var(--spectrum-yellow-400);--spectrum-chartreuse-background-color-default:var(
--spectrum-chartreuse-500
);--spectrum-celery-background-color-default:var(--spectrum-celery-600);--spectrum-green-background-color-default:var(--spectrum-green-900);--spectrum-seafoam-background-color-default:var(--spectrum-seafoam-900);--spectrum-cyan-background-color-default:var(--spectrum-cyan-900);--spectrum-blue-background-color-default:var(--spectrum-blue-900);--spectrum-indigo-background-color-default:var(--spectrum-indigo-900);--spectrum-purple-background-color-default:var(--spectrum-purple-900);--spectrum-fuchsia-background-color-default:var(--spectrum-fuchsia-900);--spectrum-magenta-background-color-default:var(--spectrum-magenta-900);--spectrum-neutral-visual-color:var(--spectrum-gray-500);--spectrum-accent-visual-color:var(--spectrum-accent-color-800);--spectrum-informative-visual-color:var(--spectrum-informative-color-800);--spectrum-negative-visual-color:var(--spectrum-negative-color-800);--spectrum-notice-visual-color:var(--spectrum-notice-color-700);--spectrum-positive-visual-color:var(--spectrum-positive-color-700);--spectrum-gray-visual-color:var(--spectrum-gray-500);--spectrum-red-visual-color:var(--spectrum-red-800);--spectrum-orange-visual-color:var(--spectrum-orange-700);--spectrum-yellow-visual-color:var(--spectrum-yellow-600);--spectrum-chartreuse-visual-color:var(--spectrum-chartreuse-600);--spectrum-celery-visual-color:var(--spectrum-celery-700);--spectrum-green-visual-color:var(--spectrum-green-700);--spectrum-seafoam-visual-color:var(--spectrum-seafoam-700);--spectrum-cyan-visual-color:var(--spectrum-cyan-600);--spectrum-blue-visual-color:var(--spectrum-blue-800);--spectrum-indigo-visual-color:var(--spectrum-indigo-800);--spectrum-purple-visual-color:var(--spectrum-purple-800);--spectrum-fuchsia-visual-color:var(--spectrum-fuchsia-800);--spectrum-magenta-visual-color:var(--spectrum-magenta-800);--spectrum-opacity-checkerboard-square-dark:var(--spectrum-gray-200);--spectrum-gray-50-rgb:255,255,255;--spectrum-gray-50:rgba(var(--spectrum-gray-50-rgb));--spectrum-gray-75-rgb:253,253,253;--spectrum-gray-75:rgba(var(--spectrum-gray-75-rgb));--spectrum-gray-100-rgb:248,248,248;--spectrum-gray-100:rgba(var(--spectrum-gray-100-rgb));--spectrum-gray-200-rgb:230,230,230;--spectrum-gray-200:rgba(var(--spectrum-gray-200-rgb));--spectrum-gray-300-rgb:213,213,213;--spectrum-gray-300:rgba(var(--spectrum-gray-300-rgb));--spectrum-gray-400-rgb:177,177,177;--spectrum-gray-400:rgba(var(--spectrum-gray-400-rgb));--spectrum-gray-500-rgb:144,144,144;--spectrum-gray-500:rgba(var(--spectrum-gray-500-rgb));--spectrum-gray-600-rgb:109,109,109;--spectrum-gray-600:rgba(var(--spectrum-gray-600-rgb));--spectrum-gray-700-rgb:70,70,70;--spectrum-gray-700:rgba(var(--spectrum-gray-700-rgb));--spectrum-gray-800-rgb:34,34,34;--spectrum-gray-800:rgba(var(--spectrum-gray-800-rgb));--spectrum-gray-900-rgb:0,0,0;--spectrum-gray-900:rgba(var(--spectrum-gray-900-rgb));--spectrum-blue-100-rgb:224,242,255;--spectrum-blue-100:rgba(var(--spectrum-blue-100-rgb));--spectrum-blue-200-rgb:202,232,255;--spectrum-blue-200:rgba(var(--spectrum-blue-200-rgb));--spectrum-blue-300-rgb:181,222,255;--spectrum-blue-300:rgba(var(--spectrum-blue-300-rgb));--spectrum-blue-400-rgb:150,206,253;--spectrum-blue-400:rgba(var(--spectrum-blue-400-rgb));--spectrum-blue-500-rgb:120,187,250;--spectrum-blue-500:rgba(var(--spectrum-blue-500-rgb));--spectrum-blue-600-rgb:89,167,246;--spectrum-blue-600:rgba(var(--spectrum-blue-600-rgb));--spectrum-blue-700-rgb:56,146,243;--spectrum-blue-700:rgba(var(--spectrum-blue-700-rgb));--spectrum-blue-800-rgb:20,122,243;--spectrum-blue-800:rgba(var(--spectrum-blue-800-rgb));--spectrum-blue-900-rgb:2,101,220;--spectrum-blue-900:rgba(var(--spectrum-blue-900-rgb));--spectrum-blue-1000-rgb:0,84,182;--spectrum-blue-1000:rgba(var(--spectrum-blue-1000-rgb));--spectrum-blue-1100-rgb:0,68,145;--spectrum-blue-1100:rgba(var(--spectrum-blue-1100-rgb));--spectrum-blue-1200-rgb:0,53,113;--spectrum-blue-1200:rgba(var(--spectrum-blue-1200-rgb));--spectrum-blue-1300-rgb:0,39,84;--spectrum-blue-1300:rgba(var(--spectrum-blue-1300-rgb));--spectrum-blue-1400-rgb:0,28,60;--spectrum-blue-1400:rgba(var(--spectrum-blue-1400-rgb));--spectrum-red-100-rgb:255,235,231;--spectrum-red-100:rgba(var(--spectrum-red-100-rgb));--spectrum-red-200-rgb:255,221,214;--spectrum-red-200:rgba(var(--spectrum-red-200-rgb));--spectrum-red-300-rgb:255,205,195;--spectrum-red-300:rgba(var(--spectrum-red-300-rgb));--spectrum-red-400-rgb:255,183,169;--spectrum-red-400:rgba(var(--spectrum-red-400-rgb));--spectrum-red-500-rgb:255,155,136;--spectrum-red-500:rgba(var(--spectrum-red-500-rgb));--spectrum-red-600-rgb:255,124,101;--spectrum-red-600:rgba(var(--spectrum-red-600-rgb));--spectrum-red-700-rgb:247,92,70;--spectrum-red-700:rgba(var(--spectrum-red-700-rgb));--spectrum-red-800-rgb:234,56,41;--spectrum-red-800:rgba(var(--spectrum-red-800-rgb));--spectrum-red-900-rgb:211,21,16;--spectrum-red-900:rgba(var(--spectrum-red-900-rgb));--spectrum-red-1000-rgb:180,0,0;--spectrum-red-1000:rgba(var(--spectrum-red-1000-rgb));--spectrum-red-1100-rgb:147,0,0;--spectrum-red-1100:rgba(var(--spectrum-red-1100-rgb));--spectrum-red-1200-rgb:116,0,0;--spectrum-red-1200:rgba(var(--spectrum-red-1200-rgb));--spectrum-red-1300-rgb:89,0,0;--spectrum-red-1300:rgba(var(--spectrum-red-1300-rgb));--spectrum-red-1400-rgb:67,0,0;--spectrum-red-1400:rgba(var(--spectrum-red-1400-rgb));--spectrum-orange-100-rgb:255,236,204;--spectrum-orange-100:rgba(var(--spectrum-orange-100-rgb));--spectrum-orange-200-rgb:255,223,173;--spectrum-orange-200:rgba(var(--spectrum-orange-200-rgb));--spectrum-orange-300-rgb:253,210,145;--spectrum-orange-300:rgba(var(--spectrum-orange-300-rgb));--spectrum-orange-400-rgb:255,187,99;--spectrum-orange-400:rgba(var(--spectrum-orange-400-rgb));--spectrum-orange-500-rgb:255,160,55;--spectrum-orange-500:rgba(var(--spectrum-orange-500-rgb));--spectrum-orange-600-rgb:246,133,17;--spectrum-orange-600:rgba(var(--spectrum-orange-600-rgb));--spectrum-orange-700-rgb:228,111,0;--spectrum-orange-700:rgba(var(--spectrum-orange-700-rgb));--spectrum-orange-800-rgb:203,93,0;--spectrum-orange-800:rgba(var(--spectrum-orange-800-rgb));--spectrum-orange-900-rgb:177,76,0;--spectrum-orange-900:rgba(var(--spectrum-orange-900-rgb));--spectrum-orange-1000-rgb:149,61,0;--spectrum-orange-1000:rgba(var(--spectrum-orange-1000-rgb));--spectrum-orange-1100-rgb:122,47,0;--spectrum-orange-1100:rgba(var(--spectrum-orange-1100-rgb));--spectrum-orange-1200-rgb:97,35,0;--spectrum-orange-1200:rgba(var(--spectrum-orange-1200-rgb));--spectrum-orange-1300-rgb:73,25,1;--spectrum-orange-1300:rgba(var(--spectrum-orange-1300-rgb));--spectrum-orange-1400-rgb:53,18,1;--spectrum-orange-1400:rgba(var(--spectrum-orange-1400-rgb));--spectrum-yellow-100-rgb:251,241,152;--spectrum-yellow-100:rgba(var(--spectrum-yellow-100-rgb));--spectrum-yellow-200-rgb:248,231,80;--spectrum-yellow-200:rgba(var(--spectrum-yellow-200-rgb));--spectrum-yellow-300-rgb:248,217,4;--spectrum-yellow-300:rgba(var(--spectrum-yellow-300-rgb));--spectrum-yellow-400-rgb:232,198,0;--spectrum-yellow-400:rgba(var(--spectrum-yellow-400-rgb));--spectrum-yellow-500-rgb:215,179,0;--spectrum-yellow-500:rgba(var(--spectrum-yellow-500-rgb));--spectrum-yellow-600-rgb:196,159,0;--spectrum-yellow-600:rgba(var(--spectrum-yellow-600-rgb));--spectrum-yellow-700-rgb:176,140,0;--spectrum-yellow-700:rgba(var(--spectrum-yellow-700-rgb));--spectrum-yellow-800-rgb:155,120,0;--spectrum-yellow-800:rgba(var(--spectrum-yellow-800-rgb));--spectrum-yellow-900-rgb:133,102,0;--spectrum-yellow-900:rgba(var(--spectrum-yellow-900-rgb));--spectrum-yellow-1000-rgb:112,83,0;--spectrum-yellow-1000:rgba(var(--spectrum-yellow-1000-rgb));--spectrum-yellow-1100-rgb:91,67,0;--spectrum-yellow-1100:rgba(var(--spectrum-yellow-1100-rgb));--spectrum-yellow-1200-rgb:72,51,0;--spectrum-yellow-1200:rgba(var(--spectrum-yellow-1200-rgb));--spectrum-yellow-1300-rgb:54,37,0;--spectrum-yellow-1300:rgba(var(--spectrum-yellow-1300-rgb));--spectrum-yellow-1400-rgb:40,26,0;--spectrum-yellow-1400:rgba(var(--spectrum-yellow-1400-rgb));--spectrum-chartreuse-100-rgb:219,252,110;--spectrum-chartreuse-100:rgba(var(--spectrum-chartreuse-100-rgb));--spectrum-chartreuse-200-rgb:203,244,67;--spectrum-chartreuse-200:rgba(var(--spectrum-chartreuse-200-rgb));--spectrum-chartreuse-300-rgb:188,233,42;--spectrum-chartreuse-300:rgba(var(--spectrum-chartreuse-300-rgb));--spectrum-chartreuse-400-rgb:170,216,22;--spectrum-chartreuse-400:rgba(var(--spectrum-chartreuse-400-rgb));--spectrum-chartreuse-500-rgb:152,197,10;--spectrum-chartreuse-500:rgba(var(--spectrum-chartreuse-500-rgb));--spectrum-chartreuse-600-rgb:135,177,3;--spectrum-chartreuse-600:rgba(var(--spectrum-chartreuse-600-rgb));--spectrum-chartreuse-700-rgb:118,156,0;--spectrum-chartreuse-700:rgba(var(--spectrum-chartreuse-700-rgb));--spectrum-chartreuse-800-rgb:103,136,0;--spectrum-chartreuse-800:rgba(var(--spectrum-chartreuse-800-rgb));--spectrum-chartreuse-900-rgb:87,116,0;--spectrum-chartreuse-900:rgba(var(--spectrum-chartreuse-900-rgb));--spectrum-chartreuse-1000-rgb:72,96,0;--spectrum-chartreuse-1000:rgba(var(--spectrum-chartreuse-1000-rgb));--spectrum-chartreuse-1100-rgb:58,77,0;--spectrum-chartreuse-1100:rgba(var(--spectrum-chartreuse-1100-rgb));--spectrum-chartreuse-1200-rgb:44,59,0;--spectrum-chartreuse-1200:rgba(var(--spectrum-chartreuse-1200-rgb));--spectrum-chartreuse-1300-rgb:33,44,0;--spectrum-chartreuse-1300:rgba(var(--spectrum-chartreuse-1300-rgb));--spectrum-chartreuse-1400-rgb:24,31,0;--spectrum-chartreuse-1400:rgba(var(--spectrum-chartreuse-1400-rgb));--spectrum-celery-100-rgb:205,252,191;--spectrum-celery-100:rgba(var(--spectrum-celery-100-rgb));--spectrum-celery-200-rgb:174,246,157;--spectrum-celery-200:rgba(var(--spectrum-celery-200-rgb));--spectrum-celery-300-rgb:150,238,133;--spectrum-celery-300:rgba(var(--spectrum-celery-300-rgb));--spectrum-celery-400-rgb:114,224,106;--spectrum-celery-400:rgba(var(--spectrum-celery-400-rgb));--spectrum-celery-500-rgb:78,207,80;--spectrum-celery-500:rgba(var(--spectrum-celery-500-rgb));--spectrum-celery-600-rgb:39,187,54;--spectrum-celery-600:rgba(var(--spectrum-celery-600-rgb));--spectrum-celery-700-rgb:7,167,33;--spectrum-celery-700:rgba(var(--spectrum-celery-700-rgb));--spectrum-celery-800-rgb:0,145,18;--spectrum-celery-800:rgba(var(--spectrum-celery-800-rgb));--spectrum-celery-900-rgb:0,124,15;--spectrum-celery-900:rgba(var(--spectrum-celery-900-rgb));--spectrum-celery-1000-rgb:0,103,15;--spectrum-celery-1000:rgba(var(--spectrum-celery-1000-rgb));--spectrum-celery-1100-rgb:0,83,13;--spectrum-celery-1100:rgba(var(--spectrum-celery-1100-rgb));--spectrum-celery-1200-rgb:0,64,10;--spectrum-celery-1200:rgba(var(--spectrum-celery-1200-rgb));--spectrum-celery-1300-rgb:0,48,7;--spectrum-celery-1300:rgba(var(--spectrum-celery-1300-rgb));--spectrum-celery-1400-rgb:0,34,5;--spectrum-celery-1400:rgba(var(--spectrum-celery-1400-rgb));--spectrum-green-100-rgb:206,248,224;--spectrum-green-100:rgba(var(--spectrum-green-100-rgb));--spectrum-green-200-rgb:173,244,206;--spectrum-green-200:rgba(var(--spectrum-green-200-rgb));--spectrum-green-300-rgb:137,236,188;--spectrum-green-300:rgba(var(--spectrum-green-300-rgb));--spectrum-green-400-rgb:103,222,168;--spectrum-green-400:rgba(var(--spectrum-green-400-rgb));--spectrum-green-500-rgb:73,204,147;--spectrum-green-500:rgba(var(--spectrum-green-500-rgb));--spectrum-green-600-rgb:47,184,128;--spectrum-green-600:rgba(var(--spectrum-green-600-rgb));--spectrum-green-700-rgb:21,164,110;--spectrum-green-700:rgba(var(--spectrum-green-700-rgb));--spectrum-green-800-rgb:0,143,93;--spectrum-green-800:rgba(var(--spectrum-green-800-rgb));--spectrum-green-900-rgb:0,122,77;--spectrum-green-900:rgba(var(--spectrum-green-900-rgb));--spectrum-green-1000-rgb:0,101,62;--spectrum-green-1000:rgba(var(--spectrum-green-1000-rgb));--spectrum-green-1100-rgb:0,81,50;--spectrum-green-1100:rgba(var(--spectrum-green-1100-rgb));--spectrum-green-1200-rgb:5,63,39;--spectrum-green-1200:rgba(var(--spectrum-green-1200-rgb));--spectrum-green-1300-rgb:10,46,29;--spectrum-green-1300:rgba(var(--spectrum-green-1300-rgb));--spectrum-green-1400-rgb:10,32,21;--spectrum-green-1400:rgba(var(--spectrum-green-1400-rgb));--spectrum-seafoam-100-rgb:206,247,243;--spectrum-seafoam-100:rgba(var(--spectrum-seafoam-100-rgb));--spectrum-seafoam-200-rgb:170,241,234;--spectrum-seafoam-200:rgba(var(--spectrum-seafoam-200-rgb));--spectrum-seafoam-300-rgb:140,233,226;--spectrum-seafoam-300:rgba(var(--spectrum-seafoam-300-rgb));--spectrum-seafoam-400-rgb:101,218,210;--spectrum-seafoam-400:rgba(var(--spectrum-seafoam-400-rgb));--spectrum-seafoam-500-rgb:63,201,193;--spectrum-seafoam-500:rgba(var(--spectrum-seafoam-500-rgb));--spectrum-seafoam-600-rgb:15,181,174;--spectrum-seafoam-600:rgba(var(--spectrum-seafoam-600-rgb));--spectrum-seafoam-700-rgb:0,161,154;--spectrum-seafoam-700:rgba(var(--spectrum-seafoam-700-rgb));--spectrum-seafoam-800-rgb:0,140,135;--spectrum-seafoam-800:rgba(var(--spectrum-seafoam-800-rgb));--spectrum-seafoam-900-rgb:0,119,114;--spectrum-seafoam-900:rgba(var(--spectrum-seafoam-900-rgb));--spectrum-seafoam-1000-rgb:0,99,95;--spectrum-seafoam-1000:rgba(var(--spectrum-seafoam-1000-rgb));--spectrum-seafoam-1100-rgb:12,79,76;--spectrum-seafoam-1100:rgba(var(--spectrum-seafoam-1100-rgb));--spectrum-seafoam-1200-rgb:18,60,58;--spectrum-seafoam-1200:rgba(var(--spectrum-seafoam-1200-rgb));--spectrum-seafoam-1300-rgb:18,44,43;--spectrum-seafoam-1300:rgba(var(--spectrum-seafoam-1300-rgb));--spectrum-seafoam-1400-rgb:15,31,30;--spectrum-seafoam-1400:rgba(var(--spectrum-seafoam-1400-rgb));--spectrum-cyan-100-rgb:197,248,255;--spectrum-cyan-100:rgba(var(--spectrum-cyan-100-rgb));--spectrum-cyan-200-rgb:164,240,255;--spectrum-cyan-200:rgba(var(--spectrum-cyan-200-rgb));--spectrum-cyan-300-rgb:136,231,250;--spectrum-cyan-300:rgba(var(--spectrum-cyan-300-rgb));--spectrum-cyan-400-rgb:96,216,243;--spectrum-cyan-400:rgba(var(--spectrum-cyan-400-rgb));--spectrum-cyan-500-rgb:51,197,232;--spectrum-cyan-500:rgba(var(--spectrum-cyan-500-rgb));--spectrum-cyan-600-rgb:18,176,218;--spectrum-cyan-600:rgba(var(--spectrum-cyan-600-rgb));--spectrum-cyan-700-rgb:1,156,200;--spectrum-cyan-700:rgba(var(--spectrum-cyan-700-rgb));--spectrum-cyan-800-rgb:0,134,180;--spectrum-cyan-800:rgba(var(--spectrum-cyan-800-rgb));--spectrum-cyan-900-rgb:0,113,159;--spectrum-cyan-900:rgba(var(--spectrum-cyan-900-rgb));--spectrum-cyan-1000-rgb:0,93,137;--spectrum-cyan-1000:rgba(var(--spectrum-cyan-1000-rgb));--spectrum-cyan-1100-rgb:0,74,115;--spectrum-cyan-1100:rgba(var(--spectrum-cyan-1100-rgb));--spectrum-cyan-1200-rgb:0,57,93;--spectrum-cyan-1200:rgba(var(--spectrum-cyan-1200-rgb));--spectrum-cyan-1300-rgb:0,42,70;--spectrum-cyan-1300:rgba(var(--spectrum-cyan-1300-rgb));--spectrum-cyan-1400-rgb:0,30,51;--spectrum-cyan-1400:rgba(var(--spectrum-cyan-1400-rgb));--spectrum-indigo-100-rgb:237,238,255;--spectrum-indigo-100:rgba(var(--spectrum-indigo-100-rgb));--spectrum-indigo-200-rgb:224,226,255;--spectrum-indigo-200:rgba(var(--spectrum-indigo-200-rgb));--spectrum-indigo-300-rgb:211,213,255;--spectrum-indigo-300:rgba(var(--spectrum-indigo-300-rgb));--spectrum-indigo-400-rgb:193,196,255;--spectrum-indigo-400:rgba(var(--spectrum-indigo-400-rgb));--spectrum-indigo-500-rgb:172,175,255;--spectrum-indigo-500:rgba(var(--spectrum-indigo-500-rgb));--spectrum-indigo-600-rgb:149,153,255;--spectrum-indigo-600:rgba(var(--spectrum-indigo-600-rgb));--spectrum-indigo-700-rgb:126,132,252;--spectrum-indigo-700:rgba(var(--spectrum-indigo-700-rgb));--spectrum-indigo-800-rgb:104,109,244;--spectrum-indigo-800:rgba(var(--spectrum-indigo-800-rgb));--spectrum-indigo-900-rgb:82,88,228;--spectrum-indigo-900:rgba(var(--spectrum-indigo-900-rgb));--spectrum-indigo-1000-rgb:64,70,202;--spectrum-indigo-1000:rgba(var(--spectrum-indigo-1000-rgb));--spectrum-indigo-1100-rgb:50,54,168;--spectrum-indigo-1100:rgba(var(--spectrum-indigo-1100-rgb));--spectrum-indigo-1200-rgb:38,41,134;--spectrum-indigo-1200:rgba(var(--spectrum-indigo-1200-rgb));--spectrum-indigo-1300-rgb:27,30,100;--spectrum-indigo-1300:rgba(var(--spectrum-indigo-1300-rgb));--spectrum-indigo-1400-rgb:20,22,72;--spectrum-indigo-1400:rgba(var(--spectrum-indigo-1400-rgb));--spectrum-purple-100-rgb:246,235,255;--spectrum-purple-100:rgba(var(--spectrum-purple-100-rgb));--spectrum-purple-200-rgb:238,221,255;--spectrum-purple-200:rgba(var(--spectrum-purple-200-rgb));--spectrum-purple-300-rgb:230,208,255;--spectrum-purple-300:rgba(var(--spectrum-purple-300-rgb));--spectrum-purple-400-rgb:219,187,254;--spectrum-purple-400:rgba(var(--spectrum-purple-400-rgb));--spectrum-purple-500-rgb:204,164,253;--spectrum-purple-500:rgba(var(--spectrum-purple-500-rgb));--spectrum-purple-600-rgb:189,139,252;--spectrum-purple-600:rgba(var(--spectrum-purple-600-rgb));--spectrum-purple-700-rgb:174,114,249;--spectrum-purple-700:rgba(var(--spectrum-purple-700-rgb));--spectrum-purple-800-rgb:157,87,244;--spectrum-purple-800:rgba(var(--spectrum-purple-800-rgb));--spectrum-purple-900-rgb:137,61,231;--spectrum-purple-900:rgba(var(--spectrum-purple-900-rgb));--spectrum-purple-1000-rgb:115,38,211;--spectrum-purple-1000:rgba(var(--spectrum-purple-1000-rgb));--spectrum-purple-1100-rgb:93,19,183;--spectrum-purple-1100:rgba(var(--spectrum-purple-1100-rgb));--spectrum-purple-1200-rgb:71,12,148;--spectrum-purple-1200:rgba(var(--spectrum-purple-1200-rgb));--spectrum-purple-1300-rgb:51,16,106;--spectrum-purple-1300:rgba(var(--spectrum-purple-1300-rgb));--spectrum-purple-1400-rgb:35,15,73;--spectrum-purple-1400:rgba(var(--spectrum-purple-1400-rgb));--spectrum-fuchsia-100-rgb:255,233,252;--spectrum-fuchsia-100:rgba(var(--spectrum-fuchsia-100-rgb));--spectrum-fuchsia-200-rgb:255,218,250;--spectrum-fuchsia-200:rgba(var(--spectrum-fuchsia-200-rgb));--spectrum-fuchsia-300-rgb:254,199,248;--spectrum-fuchsia-300:rgba(var(--spectrum-fuchsia-300-rgb));--spectrum-fuchsia-400-rgb:251,174,246;--spectrum-fuchsia-400:rgba(var(--spectrum-fuchsia-400-rgb));--spectrum-fuchsia-500-rgb:245,146,243;--spectrum-fuchsia-500:rgba(var(--spectrum-fuchsia-500-rgb));--spectrum-fuchsia-600-rgb:237,116,237;--spectrum-fuchsia-600:rgba(var(--spectrum-fuchsia-600-rgb));--spectrum-fuchsia-700-rgb:224,85,226;--spectrum-fuchsia-700:rgba(var(--spectrum-fuchsia-700-rgb));--spectrum-fuchsia-800-rgb:205,58,206;--spectrum-fuchsia-800:rgba(var(--spectrum-fuchsia-800-rgb));--spectrum-fuchsia-900-rgb:182,34,183;--spectrum-fuchsia-900:rgba(var(--spectrum-fuchsia-900-rgb));--spectrum-fuchsia-1000-rgb:157,3,158;--spectrum-fuchsia-1000:rgba(var(--spectrum-fuchsia-1000-rgb));--spectrum-fuchsia-1100-rgb:128,0,129;--spectrum-fuchsia-1100:rgba(var(--spectrum-fuchsia-1100-rgb));--spectrum-fuchsia-1200-rgb:100,6,100;--spectrum-fuchsia-1200:rgba(var(--spectrum-fuchsia-1200-rgb));--spectrum-fuchsia-1300-rgb:71,14,70;--spectrum-fuchsia-1300:rgba(var(--spectrum-fuchsia-1300-rgb));--spectrum-fuchsia-1400-rgb:50,13,49;--spectrum-fuchsia-1400:rgba(var(--spectrum-fuchsia-1400-rgb));--spectrum-magenta-100-rgb:255,234,241;--spectrum-magenta-100:rgba(var(--spectrum-magenta-100-rgb));--spectrum-magenta-200-rgb:255,220,232;--spectrum-magenta-200:rgba(var(--spectrum-magenta-200-rgb));--spectrum-magenta-300-rgb:255,202,221;--spectrum-magenta-300:rgba(var(--spectrum-magenta-300-rgb));--spectrum-magenta-400-rgb:255,178,206;--spectrum-magenta-400:rgba(var(--spectrum-magenta-400-rgb));--spectrum-magenta-500-rgb:255,149,189;--spectrum-magenta-500:rgba(var(--spectrum-magenta-500-rgb));--spectrum-magenta-600-rgb:250,119,170;--spectrum-magenta-600:rgba(var(--spectrum-magenta-600-rgb));--spectrum-magenta-700-rgb:239,90,152;--spectrum-magenta-700:rgba(var(--spectrum-magenta-700-rgb));--spectrum-magenta-800-rgb:222,61,130;--spectrum-magenta-800:rgba(var(--spectrum-magenta-800-rgb));--spectrum-magenta-900-rgb:200,34,105;--spectrum-magenta-900:rgba(var(--spectrum-magenta-900-rgb));--spectrum-magenta-1000-rgb:173,9,85;--spectrum-magenta-1000:rgba(var(--spectrum-magenta-1000-rgb));--spectrum-magenta-1100-rgb:142,0,69;--spectrum-magenta-1100:rgba(var(--spectrum-magenta-1100-rgb));--spectrum-magenta-1200-rgb:112,0,55;--spectrum-magenta-1200:rgba(var(--spectrum-magenta-1200-rgb));--spectrum-magenta-1300-rgb:84,3,42;--spectrum-magenta-1300:rgba(var(--spectrum-magenta-1300-rgb));--spectrum-magenta-1400-rgb:60,6,29;--spectrum-magenta-1400:rgba(var(--spectrum-magenta-1400-rgb));--spectrum-icon-color-blue-primary-default:var(--spectrum-blue-900);--spectrum-icon-color-green-primary-default:var(--spectrum-green-900);--spectrum-icon-color-red-primary-default:var(--spectrum-red-900);--spectrum-icon-color-yellow-primary-default:var(--spectrum-yellow-400)}:host,:root{--spectrum-menu-item-background-color-default-rgb:0,0,0;--spectrum-menu-item-background-color-default-opacity:0;--spectrum-menu-item-background-color-default:rgba(var(--spectrum-menu-item-background-color-default-rgb),var(--spectrum-menu-item-background-color-default-opacity));--spectrum-menu-item-background-color-hover:var(
--spectrum-transparent-black-200
);--spectrum-menu-item-background-color-down:var(
--spectrum-transparent-black-200
);--spectrum-menu-item-background-color-key-focus:var(
--spectrum-transparent-black-200
);--spectrum-drop-zone-background-color-rgb:var(
--spectrum-blue-800-rgb
);--spectrum-calendar-day-background-color-selected:rgba(var(--spectrum-blue-900-rgb),0.1);--spectrum-calendar-day-background-color-hover:rgba(var(--spectrum-black-rgb),0.06);--spectrum-calendar-day-today-background-color-selected-hover:rgba(var(--spectrum-blue-900-rgb),0.2);--spectrum-calendar-day-background-color-selected-hover:rgba(var(--spectrum-blue-900-rgb),0.2);--spectrum-calendar-day-background-color-down:var(
--spectrum-transparent-black-200
);--spectrum-calendar-day-background-color-cap-selected:rgba(var(--spectrum-blue-900-rgb),0.2);--spectrum-calendar-day-background-color-key-focus:rgba(var(--spectrum-black-rgb),0.06);--spectrum-calendar-day-border-color-key-focus:var(--spectrum-blue-800);--spectrum-badge-label-icon-color-primary:var(--spectrum-white);--spectrum-coach-indicator-ring-default-color:var(--spectrum-blue-800);--spectrum-coach-indicator-ring-dark-color:var(--spectrum-gray-900);--spectrum-coach-indicator-ring-light-color:var(--spectrum-gray-50);--spectrum-well-border-color:var(--spectrum-black-rgb);--spectrum-steplist-current-marker-color-key-focus:var(
--spectrum-blue-800
);--spectrum-treeview-item-background-color-quiet-selected:rgba(var(--spectrum-gray-900-rgb),0.06);--spectrum-treeview-item-background-color-selected:rgba(var(--spectrum-blue-900-rgb),0.1);--spectrum-logic-button-and-background-color:var(--spectrum-blue-900);--spectrum-logic-button-and-border-color:var(--spectrum-blue-900);--spectrum-logic-button-and-background-color-hover:var(
--spectrum-blue-1100
);--spectrum-logic-button-and-border-color-hover:var(--spectrum-blue-1100);--spectrum-logic-button-or-background-color:var(--spectrum-magenta-900);--spectrum-logic-button-or-border-color:var(--spectrum-magenta-900);--spectrum-logic-button-or-background-color-hover:var(
--spectrum-magenta-1100
);--spectrum-logic-button-or-border-color-hover:var(--spectrum-magenta-1100)}
`,Io=Wa;h();var Ga=i.css`
:host,:root{--spectrum-global-animation-linear:cubic-bezier(0,0,1,1);--spectrum-global-animation-duration-0:0ms;--spectrum-global-animation-duration-100:130ms;--spectrum-global-animation-duration-200:160ms;--spectrum-global-animation-duration-300:190ms;--spectrum-global-animation-duration-400:220ms;--spectrum-global-animation-duration-500:250ms;--spectrum-global-animation-duration-600:300ms;--spectrum-global-animation-duration-700:350ms;--spectrum-global-animation-duration-800:400ms;--spectrum-global-animation-duration-900:450ms;--spectrum-global-animation-duration-1000:500ms;--spectrum-global-animation-duration-2000:1000ms;--spectrum-global-animation-duration-4000:2000ms;--spectrum-global-animation-ease-in-out:cubic-bezier(0.45,0,0.4,1);--spectrum-global-animation-ease-in:cubic-bezier(0.5,0,1,1);--spectrum-global-animation-ease-out:cubic-bezier(0,0,0.4,1);--spectrum-global-animation-ease-linear:cubic-bezier(0,0,1,1);--spectrum-global-color-status:Verified;--spectrum-global-color-version:5.1.0;--spectrum-global-color-static-black-rgb:0,0,0;--spectrum-global-color-static-black:rgb(var(--spectrum-global-color-static-black-rgb));--spectrum-global-color-static-white-rgb:255,255,255;--spectrum-global-color-static-white:rgb(var(--spectrum-global-color-static-white-rgb));--spectrum-global-color-static-blue-rgb:0,87,191;--spectrum-global-color-static-blue:rgb(var(--spectrum-global-color-static-blue-rgb));--spectrum-global-color-static-gray-50-rgb:255,255,255;--spectrum-global-color-static-gray-50:rgb(var(--spectrum-global-color-static-gray-50-rgb));--spectrum-global-color-static-gray-75-rgb:255,255,255;--spectrum-global-color-static-gray-75:rgb(var(--spectrum-global-color-static-gray-75-rgb));--spectrum-global-color-static-gray-100-rgb:255,255,255;--spectrum-global-color-static-gray-100:rgb(var(--spectrum-global-color-static-gray-100-rgb));--spectrum-global-color-static-gray-200-rgb:235,235,235;--spectrum-global-color-static-gray-200:rgb(var(--spectrum-global-color-static-gray-200-rgb));--spectrum-global-color-static-gray-300-rgb:217,217,217;--spectrum-global-color-static-gray-300:rgb(var(--spectrum-global-color-static-gray-300-rgb));--spectrum-global-color-static-gray-400-rgb:179,179,179;--spectrum-global-color-static-gray-400:rgb(var(--spectrum-global-color-static-gray-400-rgb));--spectrum-global-color-static-gray-500-rgb:146,146,146;--spectrum-global-color-static-gray-500:rgb(var(--spectrum-global-color-static-gray-500-rgb));--spectrum-global-color-static-gray-600-rgb:110,110,110;--spectrum-global-color-static-gray-600:rgb(var(--spectrum-global-color-static-gray-600-rgb));--spectrum-global-color-static-gray-700-rgb:71,71,71;--spectrum-global-color-static-gray-700:rgb(var(--spectrum-global-color-static-gray-700-rgb));--spectrum-global-color-static-gray-800-rgb:34,34,34;--spectrum-global-color-static-gray-800:rgb(var(--spectrum-global-color-static-gray-800-rgb));--spectrum-global-color-static-gray-900-rgb:0,0,0;--spectrum-global-color-static-gray-900:rgb(var(--spectrum-global-color-static-gray-900-rgb));--spectrum-global-color-static-red-400-rgb:237,64,48;--spectrum-global-color-static-red-400:rgb(var(--spectrum-global-color-static-red-400-rgb));--spectrum-global-color-static-red-500-rgb:217,28,21;--spectrum-global-color-static-red-500:rgb(var(--spectrum-global-color-static-red-500-rgb));--spectrum-global-color-static-red-600-rgb:187,2,2;--spectrum-global-color-static-red-600:rgb(var(--spectrum-global-color-static-red-600-rgb));--spectrum-global-color-static-red-700-rgb:154,0,0;--spectrum-global-color-static-red-700:rgb(var(--spectrum-global-color-static-red-700-rgb));--spectrum-global-color-static-red-800-rgb:124,0,0;--spectrum-global-color-static-red-800:rgb(var(--spectrum-global-color-static-red-800-rgb));--spectrum-global-color-static-orange-400-rgb:250,139,26;--spectrum-global-color-static-orange-400:rgb(var(--spectrum-global-color-static-orange-400-rgb));--spectrum-global-color-static-orange-500-rgb:233,117,0;--spectrum-global-color-static-orange-500:rgb(var(--spectrum-global-color-static-orange-500-rgb));--spectrum-global-color-static-orange-600-rgb:209,97,0;--spectrum-global-color-static-orange-600:rgb(var(--spectrum-global-color-static-orange-600-rgb));--spectrum-global-color-static-orange-700-rgb:182,80,0;--spectrum-global-color-static-orange-700:rgb(var(--spectrum-global-color-static-orange-700-rgb));--spectrum-global-color-static-orange-800-rgb:155,64,0;--spectrum-global-color-static-orange-800:rgb(var(--spectrum-global-color-static-orange-800-rgb));--spectrum-global-color-static-yellow-200-rgb:250,237,123;--spectrum-global-color-static-yellow-200:rgb(var(--spectrum-global-color-static-yellow-200-rgb));--spectrum-global-color-static-yellow-300-rgb:250,224,23;--spectrum-global-color-static-yellow-300:rgb(var(--spectrum-global-color-static-yellow-300-rgb));--spectrum-global-color-static-yellow-400-rgb:238,205,0;--spectrum-global-color-static-yellow-400:rgb(var(--spectrum-global-color-static-yellow-400-rgb));--spectrum-global-color-static-yellow-500-rgb:221,185,0;--spectrum-global-color-static-yellow-500:rgb(var(--spectrum-global-color-static-yellow-500-rgb));--spectrum-global-color-static-yellow-600-rgb:201,164,0;--spectrum-global-color-static-yellow-600:rgb(var(--spectrum-global-color-static-yellow-600-rgb));--spectrum-global-color-static-yellow-700-rgb:181,144,0;--spectrum-global-color-static-yellow-700:rgb(var(--spectrum-global-color-static-yellow-700-rgb));--spectrum-global-color-static-yellow-800-rgb:160,125,0;--spectrum-global-color-static-yellow-800:rgb(var(--spectrum-global-color-static-yellow-800-rgb));--spectrum-global-color-static-chartreuse-300-rgb:176,222,27;--spectrum-global-color-static-chartreuse-300:rgb(var(--spectrum-global-color-static-chartreuse-300-rgb));--spectrum-global-color-static-chartreuse-400-rgb:157,203,13;--spectrum-global-color-static-chartreuse-400:rgb(var(--spectrum-global-color-static-chartreuse-400-rgb));--spectrum-global-color-static-chartreuse-500-rgb:139,182,4;--spectrum-global-color-static-chartreuse-500:rgb(var(--spectrum-global-color-static-chartreuse-500-rgb));--spectrum-global-color-static-chartreuse-600-rgb:122,162,0;--spectrum-global-color-static-chartreuse-600:rgb(var(--spectrum-global-color-static-chartreuse-600-rgb));--spectrum-global-color-static-chartreuse-700-rgb:106,141,0;--spectrum-global-color-static-chartreuse-700:rgb(var(--spectrum-global-color-static-chartreuse-700-rgb));--spectrum-global-color-static-chartreuse-800-rgb:90,120,0;--spectrum-global-color-static-chartreuse-800:rgb(var(--spectrum-global-color-static-chartreuse-800-rgb));--spectrum-global-color-static-celery-200-rgb:126,229,114;--spectrum-global-color-static-celery-200:rgb(var(--spectrum-global-color-static-celery-200-rgb));--spectrum-global-color-static-celery-300-rgb:87,212,86;--spectrum-global-color-static-celery-300:rgb(var(--spectrum-global-color-static-celery-300-rgb));--spectrum-global-color-static-celery-400-rgb:48,193,61;--spectrum-global-color-static-celery-400:rgb(var(--spectrum-global-color-static-celery-400-rgb));--spectrum-global-color-static-celery-500-rgb:15,172,38;--spectrum-global-color-static-celery-500:rgb(var(--spectrum-global-color-static-celery-500-rgb));--spectrum-global-color-static-celery-600-rgb:0,150,20;--spectrum-global-color-static-celery-600:rgb(var(--spectrum-global-color-static-celery-600-rgb));--spectrum-global-color-static-celery-700-rgb:0,128,15;--spectrum-global-color-static-celery-700:rgb(var(--spectrum-global-color-static-celery-700-rgb));--spectrum-global-color-static-celery-800-rgb:0,107,15;--spectrum-global-color-static-celery-800:rgb(var(--spectrum-global-color-static-celery-800-rgb));--spectrum-global-color-static-green-400-rgb:29,169,115;--spectrum-global-color-static-green-400:rgb(var(--spectrum-global-color-static-green-400-rgb));--spectrum-global-color-static-green-500-rgb:0,148,97;--spectrum-global-color-static-green-500:rgb(var(--spectrum-global-color-static-green-500-rgb));--spectrum-global-color-static-green-600-rgb:0,126,80;--spectrum-global-color-static-green-600:rgb(var(--spectrum-global-color-static-green-600-rgb));--spectrum-global-color-static-green-700-rgb:0,105,65;--spectrum-global-color-static-green-700:rgb(var(--spectrum-global-color-static-green-700-rgb));--spectrum-global-color-static-green-800-rgb:0,86,53;--spectrum-global-color-static-green-800:rgb(var(--spectrum-global-color-static-green-800-rgb));--spectrum-global-color-static-seafoam-200-rgb:75,206,199;--spectrum-global-color-static-seafoam-200:rgb(var(--spectrum-global-color-static-seafoam-200-rgb));--spectrum-global-color-static-seafoam-300-rgb:32,187,180;--spectrum-global-color-static-seafoam-300:rgb(var(--spectrum-global-color-static-seafoam-300-rgb));--spectrum-global-color-static-seafoam-400-rgb:0,166,160;--spectrum-global-color-static-seafoam-400:rgb(var(--spectrum-global-color-static-seafoam-400-rgb));--spectrum-global-color-static-seafoam-500-rgb:0,145,139;--spectrum-global-color-static-seafoam-500:rgb(var(--spectrum-global-color-static-seafoam-500-rgb));--spectrum-global-color-static-seafoam-600-rgb:0,124,118;--spectrum-global-color-static-seafoam-600:rgb(var(--spectrum-global-color-static-seafoam-600-rgb));--spectrum-global-color-static-seafoam-700-rgb:0,103,99;--spectrum-global-color-static-seafoam-700:rgb(var(--spectrum-global-color-static-seafoam-700-rgb));--spectrum-global-color-static-seafoam-800-rgb:10,83,80;--spectrum-global-color-static-seafoam-800:rgb(var(--spectrum-global-color-static-seafoam-800-rgb));--spectrum-global-color-static-blue-200-rgb:130,193,251;--spectrum-global-color-static-blue-200:rgb(var(--spectrum-global-color-static-blue-200-rgb));--spectrum-global-color-static-blue-300-rgb:98,173,247;--spectrum-global-color-static-blue-300:rgb(var(--spectrum-global-color-static-blue-300-rgb));--spectrum-global-color-static-blue-400-rgb:66,151,244;--spectrum-global-color-static-blue-400:rgb(var(--spectrum-global-color-static-blue-400-rgb));--spectrum-global-color-static-blue-500-rgb:27,127,245;--spectrum-global-color-static-blue-500:rgb(var(--spectrum-global-color-static-blue-500-rgb));--spectrum-global-color-static-blue-600-rgb:4,105,227;--spectrum-global-color-static-blue-600:rgb(var(--spectrum-global-color-static-blue-600-rgb));--spectrum-global-color-static-blue-700-rgb:0,87,190;--spectrum-global-color-static-blue-700:rgb(var(--spectrum-global-color-static-blue-700-rgb));--spectrum-global-color-static-blue-800-rgb:0,72,153;--spectrum-global-color-static-blue-800:rgb(var(--spectrum-global-color-static-blue-800-rgb));--spectrum-global-color-static-indigo-200-rgb:178,181,255;--spectrum-global-color-static-indigo-200:rgb(var(--spectrum-global-color-static-indigo-200-rgb));--spectrum-global-color-static-indigo-300-rgb:155,159,255;--spectrum-global-color-static-indigo-300:rgb(var(--spectrum-global-color-static-indigo-300-rgb));--spectrum-global-color-static-indigo-400-rgb:132,137,253;--spectrum-global-color-static-indigo-400:rgb(var(--spectrum-global-color-static-indigo-400-rgb));--spectrum-global-color-static-indigo-500-rgb:109,115,246;--spectrum-global-color-static-indigo-500:rgb(var(--spectrum-global-color-static-indigo-500-rgb));--spectrum-global-color-static-indigo-600-rgb:87,93,232;--spectrum-global-color-static-indigo-600:rgb(var(--spectrum-global-color-static-indigo-600-rgb));--spectrum-global-color-static-indigo-700-rgb:68,74,208;--spectrum-global-color-static-indigo-700:rgb(var(--spectrum-global-color-static-indigo-700-rgb));--spectrum-global-color-static-indigo-800-rgb:68,74,208;--spectrum-global-color-static-indigo-800:rgb(var(--spectrum-global-color-static-indigo-800-rgb));--spectrum-global-color-static-purple-400-rgb:178,121,250;--spectrum-global-color-static-purple-400:rgb(var(--spectrum-global-color-static-purple-400-rgb));--spectrum-global-color-static-purple-500-rgb:161,93,246;--spectrum-global-color-static-purple-500:rgb(var(--spectrum-global-color-static-purple-500-rgb));--spectrum-global-color-static-purple-600-rgb:142,67,234;--spectrum-global-color-static-purple-600:rgb(var(--spectrum-global-color-static-purple-600-rgb));--spectrum-global-color-static-purple-700-rgb:120,43,216;--spectrum-global-color-static-purple-700:rgb(var(--spectrum-global-color-static-purple-700-rgb));--spectrum-global-color-static-purple-800-rgb:98,23,190;--spectrum-global-color-static-purple-800:rgb(var(--spectrum-global-color-static-purple-800-rgb));--spectrum-global-color-static-fuchsia-400-rgb:228,93,230;--spectrum-global-color-static-fuchsia-400:rgb(var(--spectrum-global-color-static-fuchsia-400-rgb));--spectrum-global-color-static-fuchsia-500-rgb:211,63,212;--spectrum-global-color-static-fuchsia-500:rgb(var(--spectrum-global-color-static-fuchsia-500-rgb));--spectrum-global-color-static-fuchsia-600-rgb:188,39,187;--spectrum-global-color-static-fuchsia-600:rgb(var(--spectrum-global-color-static-fuchsia-600-rgb));--spectrum-global-color-static-fuchsia-700-rgb:163,10,163;--spectrum-global-color-static-fuchsia-700:rgb(var(--spectrum-global-color-static-fuchsia-700-rgb));--spectrum-global-color-static-fuchsia-800-rgb:135,0,136;--spectrum-global-color-static-fuchsia-800:rgb(var(--spectrum-global-color-static-fuchsia-800-rgb));--spectrum-global-color-static-magenta-200-rgb:253,127,175;--spectrum-global-color-static-magenta-200:rgb(var(--spectrum-global-color-static-magenta-200-rgb));--spectrum-global-color-static-magenta-300-rgb:242,98,157;--spectrum-global-color-static-magenta-300:rgb(var(--spectrum-global-color-static-magenta-300-rgb));--spectrum-global-color-static-magenta-400-rgb:226,68,135;--spectrum-global-color-static-magenta-400:rgb(var(--spectrum-global-color-static-magenta-400-rgb));--spectrum-global-color-static-magenta-500-rgb:205,40,111;--spectrum-global-color-static-magenta-500:rgb(var(--spectrum-global-color-static-magenta-500-rgb));--spectrum-global-color-static-magenta-600-rgb:179,15,89;--spectrum-global-color-static-magenta-600:rgb(var(--spectrum-global-color-static-magenta-600-rgb));--spectrum-global-color-static-magenta-700-rgb:149,0,72;--spectrum-global-color-static-magenta-700:rgb(var(--spectrum-global-color-static-magenta-700-rgb));--spectrum-global-color-static-magenta-800-rgb:119,0,58;--spectrum-global-color-static-magenta-800:rgb(var(--spectrum-global-color-static-magenta-800-rgb));--spectrum-global-color-static-transparent-white-200:hsla(0,0%,100%,.1);--spectrum-global-color-static-transparent-white-300:hsla(0,0%,100%,.25);--spectrum-global-color-static-transparent-white-400:hsla(0,0%,100%,.4);--spectrum-global-color-static-transparent-white-500:hsla(0,0%,100%,.55);--spectrum-global-color-static-transparent-white-600:hsla(0,0%,100%,.7);--spectrum-global-color-static-transparent-white-700:hsla(0,0%,100%,.8);--spectrum-global-color-static-transparent-white-800:hsla(0,0%,100%,.9);--spectrum-global-color-static-transparent-white-900-rgb:255,255,255;--spectrum-global-color-static-transparent-white-900:rgb(var(--spectrum-global-color-static-transparent-white-900-rgb));--spectrum-global-color-static-transparent-black-200:rgba(0,0,0,.1);--spectrum-global-color-static-transparent-black-300:rgba(0,0,0,.25);--spectrum-global-color-static-transparent-black-400:rgba(0,0,0,.4);--spectrum-global-color-static-transparent-black-500:rgba(0,0,0,.55);--spectrum-global-color-static-transparent-black-600:rgba(0,0,0,.7);--spectrum-global-color-static-transparent-black-700:rgba(0,0,0,.8);--spectrum-global-color-static-transparent-black-800:rgba(0,0,0,.9);--spectrum-global-color-static-transparent-black-900-rgb:0,0,0;--spectrum-global-color-static-transparent-black-900:rgb(var(--spectrum-global-color-static-transparent-black-900-rgb));--spectrum-global-color-sequential-cerulean:#e9fff1,#c8f1e4,#a5e3d7,#82d5ca,#68c5c1,#54b4ba,#3fa2b2,#2991ac,#2280a2,#1f6d98,#1d5c8d,#1a4b83,#1a3979,#1a266f,#191264,#180057;--spectrum-global-color-sequential-forest:#ffffdf,#e2f6ba,#c4eb95,#a4e16d,#8dd366,#77c460,#5fb65a,#48a754,#36984f,#2c894d,#237a4a,#196b47,#105c45,#094d41,#033f3e,#00313a;--spectrum-global-color-sequential-rose:#fff4dd,#ffddd7,#ffc5d2,#feaecb,#fa96c4,#f57ebd,#ef64b5,#e846ad,#d238a1,#bb2e96,#a3248c,#8a1b83,#71167c,#560f74,#370b6e,#000968;--spectrum-global-color-diverging-orange-yellow-seafoam:#580000,#79260b,#9c4511,#bd651a,#dd8629,#f5ad52,#fed693,#ffffe0,#bbe4d1,#76c7be,#3ea8a6,#208288,#076769,#00494b,#002c2d;--spectrum-global-color-diverging-red-yellow-blue:#4a001e,#751232,#a52747,#c65154,#e47961,#f0a882,#fad4ac,#ffffe0,#bce2cf,#89c0c4,#579eb9,#397aa8,#1c5796,#163771,#10194d;--spectrum-global-color-diverging-red-blue:#4a001e,#731331,#9f2945,#cc415a,#e06e85,#ed9ab0,#f8c3d9,#faf0ff,#c6d0f2,#92b2de,#5d94cb,#2f74b3,#265191,#163670,#0b194c;--spectrum-semantic-negative-background-color:var(
--spectrum-global-color-static-red-600
);--spectrum-semantic-negative-color-default:var(
--spectrum-global-color-red-500
);--spectrum-semantic-negative-color-hover:var(
--spectrum-global-color-red-600
);--spectrum-semantic-negative-color-dark:var(
--spectrum-global-color-red-600
);--spectrum-semantic-negative-border-color:var(
--spectrum-global-color-red-400
);--spectrum-semantic-negative-icon-color:var(
--spectrum-global-color-red-600
);--spectrum-semantic-negative-status-color:var(
--spectrum-global-color-red-400
);--spectrum-semantic-negative-text-color-large:var(
--spectrum-global-color-red-500
);--spectrum-semantic-negative-text-color-small:var(
--spectrum-global-color-red-600
);--spectrum-semantic-negative-text-color-small-hover:var(
--spectrum-global-color-red-700
);--spectrum-semantic-negative-text-color-small-down:var(
--spectrum-global-color-red-700
);--spectrum-semantic-negative-text-color-small-key-focus:var(
--spectrum-global-color-red-600
);--spectrum-semantic-negative-color-down:var(
--spectrum-global-color-red-700
);--spectrum-semantic-negative-color-key-focus:var(
--spectrum-global-color-red-400
);--spectrum-semantic-negative-background-color-default:var(
--spectrum-global-color-static-red-600
);--spectrum-semantic-negative-background-color-hover:var(
--spectrum-global-color-static-red-700
);--spectrum-semantic-negative-background-color-down:var(
--spectrum-global-color-static-red-800
);--spectrum-semantic-negative-background-color-key-focus:var(
--spectrum-global-color-static-red-700
);--spectrum-semantic-notice-background-color:var(
--spectrum-global-color-static-orange-600
);--spectrum-semantic-notice-color-default:var(
--spectrum-global-color-orange-500
);--spectrum-semantic-notice-color-dark:var(
--spectrum-global-color-orange-600
);--spectrum-semantic-notice-border-color:var(
--spectrum-global-color-orange-400
);--spectrum-semantic-notice-icon-color:var(
--spectrum-global-color-orange-600
);--spectrum-semantic-notice-status-color:var(
--spectrum-global-color-orange-400
);--spectrum-semantic-notice-text-color-large:var(
--spectrum-global-color-orange-500
);--spectrum-semantic-notice-text-color-small:var(
--spectrum-global-color-orange-600
);--spectrum-semantic-notice-color-down:var(
--spectrum-global-color-orange-700
);--spectrum-semantic-notice-color-key-focus:var(
--spectrum-global-color-orange-400
);--spectrum-semantic-notice-background-color-default:var(
--spectrum-global-color-static-orange-600
);--spectrum-semantic-notice-background-color-hover:var(
--spectrum-global-color-static-orange-700
);--spectrum-semantic-notice-background-color-down:var(
--spectrum-global-color-static-orange-800
);--spectrum-semantic-notice-background-color-key-focus:var(
--spectrum-global-color-static-orange-700
);--spectrum-semantic-positive-background-color:var(
--spectrum-global-color-static-green-600
);--spectrum-semantic-positive-color-default:var(
--spectrum-global-color-green-500
);--spectrum-semantic-positive-color-dark:var(
--spectrum-global-color-green-600
);--spectrum-semantic-positive-border-color:var(
--spectrum-global-color-green-400
);--spectrum-semantic-positive-icon-color:var(
--spectrum-global-color-green-600
);--spectrum-semantic-positive-status-color:var(
--spectrum-global-color-green-400
);--spectrum-semantic-positive-text-color-large:var(
--spectrum-global-color-green-500
);--spectrum-semantic-positive-text-color-small:var(
--spectrum-global-color-green-600
);--spectrum-semantic-positive-color-down:var(
--spectrum-global-color-green-700
);--spectrum-semantic-positive-color-key-focus:var(
--spectrum-global-color-green-400
);--spectrum-semantic-positive-background-color-default:var(
--spectrum-global-color-static-green-600
);--spectrum-semantic-positive-background-color-hover:var(
--spectrum-global-color-static-green-700
);--spectrum-semantic-positive-background-color-down:var(
--spectrum-global-color-static-green-800
);--spectrum-semantic-positive-background-color-key-focus:var(
--spectrum-global-color-static-green-700
);--spectrum-semantic-informative-background-color:var(
--spectrum-global-color-static-blue-600
);--spectrum-semantic-informative-color-default:var(
--spectrum-global-color-blue-500
);--spectrum-semantic-informative-color-dark:var(
--spectrum-global-color-blue-600
);--spectrum-semantic-informative-border-color:var(
--spectrum-global-color-blue-400
);--spectrum-semantic-informative-icon-color:var(
--spectrum-global-color-blue-600
);--spectrum-semantic-informative-status-color:var(
--spectrum-global-color-blue-400
);--spectrum-semantic-informative-text-color-large:var(
--spectrum-global-color-blue-500
);--spectrum-semantic-informative-text-color-small:var(
--spectrum-global-color-blue-600
);--spectrum-semantic-informative-color-down:var(
--spectrum-global-color-blue-700
);--spectrum-semantic-informative-color-key-focus:var(
--spectrum-global-color-blue-400
);--spectrum-semantic-informative-background-color-default:var(
--spectrum-global-color-static-blue-600
);--spectrum-semantic-informative-background-color-hover:var(
--spectrum-global-color-static-blue-700
);--spectrum-semantic-informative-background-color-down:var(
--spectrum-global-color-static-blue-800
);--spectrum-semantic-informative-background-color-key-focus:var(
--spectrum-global-color-static-blue-700
);--spectrum-semantic-cta-background-color-default:var(
--spectrum-global-color-static-blue-600
);--spectrum-semantic-cta-background-color-hover:var(
--spectrum-global-color-static-blue-700
);--spectrum-semantic-cta-background-color-down:var(
--spectrum-global-color-static-blue-800
);--spectrum-semantic-cta-background-color-key-focus:var(
--spectrum-global-color-static-blue-700
);--spectrum-semantic-emphasized-border-color-default:var(
--spectrum-global-color-blue-500
);--spectrum-semantic-emphasized-border-color-hover:var(
--spectrum-global-color-blue-600
);--spectrum-semantic-emphasized-border-color-down:var(
--spectrum-global-color-blue-700
);--spectrum-semantic-emphasized-border-color-key-focus:var(
--spectrum-global-color-blue-600
);--spectrum-semantic-neutral-background-color-default:var(
--spectrum-global-color-static-gray-700
);--spectrum-semantic-neutral-background-color-hover:var(
--spectrum-global-color-static-gray-800
);--spectrum-semantic-neutral-background-color-down:var(
--spectrum-global-color-static-gray-900
);--spectrum-semantic-neutral-background-color-key-focus:var(
--spectrum-global-color-static-gray-800
);--spectrum-semantic-presence-color-1:var(
--spectrum-global-color-static-red-500
);--spectrum-semantic-presence-color-2:var(
--spectrum-global-color-static-orange-400
);--spectrum-semantic-presence-color-3:var(
--spectrum-global-color-static-yellow-400
);--spectrum-semantic-presence-color-4-rgb:75,204,162;--spectrum-semantic-presence-color-4:rgb(var(--spectrum-semantic-presence-color-4-rgb));--spectrum-semantic-presence-color-5-rgb:0,199,255;--spectrum-semantic-presence-color-5:rgb(var(--spectrum-semantic-presence-color-5-rgb));--spectrum-semantic-presence-color-6-rgb:0,140,184;--spectrum-semantic-presence-color-6:rgb(var(--spectrum-semantic-presence-color-6-rgb));--spectrum-semantic-presence-color-7-rgb:126,75,243;--spectrum-semantic-presence-color-7:rgb(var(--spectrum-semantic-presence-color-7-rgb));--spectrum-semantic-presence-color-8:var(
--spectrum-global-color-static-fuchsia-600
);--spectrum-global-dimension-static-percent-50:50%;--spectrum-global-dimension-static-percent-70:70%;--spectrum-global-dimension-static-percent-100:100%;--spectrum-global-dimension-static-breakpoint-xsmall:304px;--spectrum-global-dimension-static-breakpoint-small:768px;--spectrum-global-dimension-static-breakpoint-medium:1280px;--spectrum-global-dimension-static-breakpoint-large:1768px;--spectrum-global-dimension-static-breakpoint-xlarge:2160px;--spectrum-global-dimension-static-grid-columns:12;--spectrum-global-dimension-static-grid-fluid-width:100%;--spectrum-global-dimension-static-grid-fixed-max-width:1280px;--spectrum-global-dimension-static-size-0:0px;--spectrum-global-dimension-static-size-10:1px;--spectrum-global-dimension-static-size-25:2px;--spectrum-global-dimension-static-size-40:3px;--spectrum-global-dimension-static-size-50:4px;--spectrum-global-dimension-static-size-65:5px;--spectrum-global-dimension-static-size-75:6px;--spectrum-global-dimension-static-size-85:7px;--spectrum-global-dimension-static-size-100:8px;--spectrum-global-dimension-static-size-115:9px;--spectrum-global-dimension-static-size-125:10px;--spectrum-global-dimension-static-size-130:11px;--spectrum-global-dimension-static-size-150:12px;--spectrum-global-dimension-static-size-160:13px;--spectrum-global-dimension-static-size-175:14px;--spectrum-global-dimension-static-size-185:15px;--spectrum-global-dimension-static-size-200:16px;--spectrum-global-dimension-static-size-225:18px;--spectrum-global-dimension-static-size-250:20px;--spectrum-global-dimension-static-size-275:22px;--spectrum-global-dimension-static-size-300:24px;--spectrum-global-dimension-static-size-325:26px;--spectrum-global-dimension-static-size-350:28px;--spectrum-global-dimension-static-size-400:32px;--spectrum-global-dimension-static-size-450:36px;--spectrum-global-dimension-static-size-500:40px;--spectrum-global-dimension-static-size-550:44px;--spectrum-global-dimension-static-size-600:48px;--spectrum-global-dimension-static-size-700:56px;--spectrum-global-dimension-static-size-800:64px;--spectrum-global-dimension-static-size-900:72px;--spectrum-global-dimension-static-size-1000:80px;--spectrum-global-dimension-static-size-1200:96px;--spectrum-global-dimension-static-size-1700:136px;--spectrum-global-dimension-static-size-2400:192px;--spectrum-global-dimension-static-size-2500:200px;--spectrum-global-dimension-static-size-2600:208px;--spectrum-global-dimension-static-size-2800:224px;--spectrum-global-dimension-static-size-3200:256px;--spectrum-global-dimension-static-size-3400:272px;--spectrum-global-dimension-static-size-3500:280px;--spectrum-global-dimension-static-size-3600:288px;--spectrum-global-dimension-static-size-3800:304px;--spectrum-global-dimension-static-size-4600:368px;--spectrum-global-dimension-static-size-5000:400px;--spectrum-global-dimension-static-size-6000:480px;--spectrum-global-dimension-static-size-16000:1280px;--spectrum-global-dimension-static-font-size-50:11px;--spectrum-global-dimension-static-font-size-75:12px;--spectrum-global-dimension-static-font-size-100:14px;--spectrum-global-dimension-static-font-size-150:15px;--spectrum-global-dimension-static-font-size-200:16px;--spectrum-global-dimension-static-font-size-300:18px;--spectrum-global-dimension-static-font-size-400:20px;--spectrum-global-dimension-static-font-size-500:22px;--spectrum-global-dimension-static-font-size-600:25px;--spectrum-global-dimension-static-font-size-700:28px;--spectrum-global-dimension-static-font-size-800:32px;--spectrum-global-dimension-static-font-size-900:36px;--spectrum-global-dimension-static-font-size-1000:40px;--spectrum-global-font-family-base:adobe-clean,"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Trebuchet MS","Lucida Grande",sans-serif;--spectrum-global-font-family-serif:adobe-clean-serif,"Source Serif Pro",Georgia,serif;--spectrum-global-font-family-code:"Source Code Pro",Monaco,monospace;--spectrum-global-font-weight-thin:100;--spectrum-global-font-weight-ultra-light:200;--spectrum-global-font-weight-light:300;--spectrum-global-font-weight-regular:400;--spectrum-global-font-weight-medium:500;--spectrum-global-font-weight-semi-bold:600;--spectrum-global-font-weight-bold:700;--spectrum-global-font-weight-extra-bold:800;--spectrum-global-font-weight-black:900;--spectrum-global-font-style-regular:normal;--spectrum-global-font-style-italic:italic;--spectrum-global-font-letter-spacing-none:0;--spectrum-global-font-letter-spacing-small:0.0125em;--spectrum-global-font-letter-spacing-han:0.05em;--spectrum-global-font-letter-spacing-medium:0.06em;--spectrum-global-font-line-height-large:1.7;--spectrum-global-font-line-height-medium:1.5;--spectrum-global-font-line-height-small:1.3;--spectrum-global-font-multiplier-0:0em;--spectrum-global-font-multiplier-25:0.25em;--spectrum-global-font-multiplier-75:0.75em;--spectrum-global-font-font-family-ar:myriad-arabic,adobe-clean,"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Trebuchet MS","Lucida Grande",sans-serif;--spectrum-global-font-font-family-he:myriad-hebrew,adobe-clean,"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Trebuchet MS","Lucida Grande",sans-serif;--spectrum-global-font-font-family-zh:adobe-clean-han-traditional,source-han-traditional,"MingLiu","Heiti TC Light","sans-serif";--spectrum-global-font-font-family-zhhans:adobe-clean-han-simplified-c,source-han-simplified-c,"SimSun","Heiti SC Light","sans-serif";--spectrum-global-font-font-family-ko:adobe-clean-han-korean,source-han-korean,"Malgun Gothic","Apple Gothic","sans-serif";--spectrum-global-font-font-family-ja:adobe-clean-han-japanese,"Hiragino Kaku Gothic ProN","ヒラギノ角ゴ ProN W3","Osaka",YuGothic,"Yu Gothic","メイリオ",Meiryo,"ＭＳ Ｐゴシック","MS PGothic","sans-serif";--spectrum-global-font-font-family-condensed:adobe-clean-han-traditional,source-han-traditional,"MingLiu","Heiti TC Light",adobe-clean,"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Trebuchet MS","Lucida Grande",sans-serif;--spectrum-alias-loupe-entry-animation-duration:var(
--spectrum-global-animation-duration-300
);--spectrum-alias-loupe-exit-animation-duration:var(
--spectrum-global-animation-duration-300
);--spectrum-alias-heading-text-line-height:var(
--spectrum-global-font-line-height-small
);--spectrum-alias-heading-text-font-weight-regular:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-heading-text-font-weight-regular-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-heading-text-font-weight-light:var(
--spectrum-global-font-weight-light
);--spectrum-alias-heading-text-font-weight-light-strong:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-heading-text-font-weight-heavy:var(
--spectrum-global-font-weight-black
);--spectrum-alias-heading-text-font-weight-heavy-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-heading-text-font-weight-quiet:var(
--spectrum-global-font-weight-light
);--spectrum-alias-heading-text-font-weight-quiet-strong:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-heading-text-font-weight-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-heading-text-font-weight-strong-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-heading-margin-bottom:var(
--spectrum-global-font-multiplier-25
);--spectrum-alias-subheading-text-font-weight:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-subheading-text-font-weight-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-body-text-font-family:var(
--spectrum-global-font-family-base
);--spectrum-alias-body-text-line-height:var(
--spectrum-global-font-line-height-medium
);--spectrum-alias-body-text-font-weight:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-body-text-font-weight-strong:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-body-margin-bottom:var(
--spectrum-global-font-multiplier-75
);--spectrum-alias-detail-text-font-weight:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-detail-text-font-weight-regular:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-detail-text-font-weight-light:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-detail-text-font-weight-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-article-heading-text-font-weight:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-article-heading-text-font-weight-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-article-heading-text-font-weight-quiet:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-article-heading-text-font-weight-quiet-strong:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-article-body-text-font-weight:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-article-body-text-font-weight-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-article-subheading-text-font-weight:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-article-subheading-text-font-weight-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-article-detail-text-font-weight:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-article-detail-text-font-weight-strong:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-code-text-font-family:var(
--spectrum-global-font-family-code
);--spectrum-alias-code-text-font-weight-regular:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-code-text-font-weight-strong:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-code-text-line-height:var(
--spectrum-global-font-line-height-medium
);--spectrum-alias-code-margin-bottom:var(
--spectrum-global-font-multiplier-0
);--spectrum-alias-font-family-ar:var(--spectrum-global-font-font-family-ar);--spectrum-alias-font-family-he:var(--spectrum-global-font-font-family-he);--spectrum-alias-font-family-zh:var(--spectrum-global-font-font-family-zh);--spectrum-alias-font-family-zhhans:var(
--spectrum-global-font-font-family-zhhans
);--spectrum-alias-font-family-ko:var(--spectrum-global-font-font-family-ko);--spectrum-alias-font-family-ja:var(--spectrum-global-font-font-family-ja);--spectrum-alias-font-family-condensed:var(
--spectrum-global-font-font-family-condensed
);--spectrum-alias-component-text-line-height:var(
--spectrum-global-font-line-height-small
);--spectrum-alias-han-component-text-line-height:var(
--spectrum-global-font-line-height-medium
);--spectrum-alias-serif-text-font-family:var(
--spectrum-global-font-family-serif
);--spectrum-alias-han-heading-text-line-height:var(
--spectrum-global-font-line-height-medium
);--spectrum-alias-han-heading-text-font-weight-regular:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-han-heading-text-font-weight-regular-emphasis:var(
--spectrum-global-font-weight-extra-bold
);--spectrum-alias-han-heading-text-font-weight-regular-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-han-heading-text-font-weight-quiet-strong:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-han-heading-text-font-weight-light:var(
--spectrum-global-font-weight-light
);--spectrum-alias-han-heading-text-font-weight-light-emphasis:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-han-heading-text-font-weight-light-strong:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-han-heading-text-font-weight-heavy:var(
--spectrum-global-font-weight-black
);--spectrum-alias-han-heading-text-font-weight-heavy-emphasis:var(
--spectrum-global-font-weight-black
);--spectrum-alias-han-heading-text-font-weight-heavy-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-han-body-text-line-height:var(
--spectrum-global-font-line-height-large
);--spectrum-alias-han-body-text-font-weight-regular:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-han-body-text-font-weight-emphasis:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-han-body-text-font-weight-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-han-subheading-text-font-weight-regular:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-han-subheading-text-font-weight-emphasis:var(
--spectrum-global-font-weight-extra-bold
);--spectrum-alias-han-subheading-text-font-weight-strong:var(
--spectrum-global-font-weight-black
);--spectrum-alias-han-detail-text-font-weight:var(
--spectrum-global-font-weight-regular
);--spectrum-alias-han-detail-text-font-weight-emphasis:var(
--spectrum-global-font-weight-bold
);--spectrum-alias-han-detail-text-font-weight-strong:var(
--spectrum-global-font-weight-black
)}:host,:root{--spectrum-alias-item-height-s:var(--spectrum-global-dimension-size-300);--spectrum-alias-item-height-m:var(--spectrum-global-dimension-size-400);--spectrum-alias-item-height-l:var(--spectrum-global-dimension-size-500);--spectrum-alias-item-height-xl:var(--spectrum-global-dimension-size-600);--spectrum-alias-item-rounded-border-radius-s:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-item-rounded-border-radius-m:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-item-rounded-border-radius-l:var(
--spectrum-global-dimension-size-250
);--spectrum-alias-item-rounded-border-radius-xl:var(
--spectrum-global-dimension-size-300
);--spectrum-alias-item-text-size-s:var(
--spectrum-global-dimension-font-size-75
);--spectrum-alias-item-text-size-m:var(
--spectrum-global-dimension-font-size-100
);--spectrum-alias-item-text-size-l:var(
--spectrum-global-dimension-font-size-200
);--spectrum-alias-item-text-size-xl:var(
--spectrum-global-dimension-font-size-300
);--spectrum-alias-item-text-padding-top-s:var(
--spectrum-global-dimension-static-size-50
);--spectrum-alias-item-text-padding-top-m:var(
--spectrum-global-dimension-size-75
);--spectrum-alias-item-text-padding-top-xl:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-item-text-padding-bottom-m:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-text-padding-bottom-l:var(
--spectrum-global-dimension-size-130
);--spectrum-alias-item-text-padding-bottom-xl:var(
--spectrum-global-dimension-size-175
);--spectrum-alias-item-icon-padding-top-s:var(
--spectrum-global-dimension-size-50
);--spectrum-alias-item-icon-padding-top-m:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-icon-padding-top-l:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-icon-padding-top-xl:var(
--spectrum-global-dimension-size-160
);--spectrum-alias-item-icon-padding-bottom-s:var(
--spectrum-global-dimension-size-50
);--spectrum-alias-item-icon-padding-bottom-m:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-icon-padding-bottom-l:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-icon-padding-bottom-xl:var(
--spectrum-global-dimension-size-160
);--spectrum-alias-item-padding-s:var(--spectrum-global-dimension-size-115);--spectrum-alias-item-padding-m:var(--spectrum-global-dimension-size-150);--spectrum-alias-item-padding-l:var(--spectrum-global-dimension-size-185);--spectrum-alias-item-padding-xl:var(--spectrum-global-dimension-size-225);--spectrum-alias-item-rounded-padding-s:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-item-rounded-padding-m:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-item-rounded-padding-l:var(
--spectrum-global-dimension-size-250
);--spectrum-alias-item-rounded-padding-xl:var(
--spectrum-global-dimension-size-300
);--spectrum-alias-item-icononly-padding-s:var(
--spectrum-global-dimension-size-50
);--spectrum-alias-item-icononly-padding-m:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-icononly-padding-l:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-icononly-padding-xl:var(
--spectrum-global-dimension-size-160
);--spectrum-alias-item-control-gap-s:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-control-gap-m:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-control-gap-l:var(
--spectrum-global-dimension-size-130
);--spectrum-alias-item-control-gap-xl:var(
--spectrum-global-dimension-size-160
);--spectrum-alias-item-workflow-icon-gap-s:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-workflow-icon-gap-m:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-item-workflow-icon-gap-l:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-workflow-icon-gap-xl:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-mark-gap-s:var(--spectrum-global-dimension-size-85);--spectrum-alias-item-mark-gap-m:var(--spectrum-global-dimension-size-100);--spectrum-alias-item-mark-gap-l:var(--spectrum-global-dimension-size-115);--spectrum-alias-item-mark-gap-xl:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-ui-icon-gap-s:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-ui-icon-gap-m:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-item-ui-icon-gap-l:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-ui-icon-gap-xl:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-clearbutton-gap-s:var(
--spectrum-global-dimension-size-50
);--spectrum-alias-item-clearbutton-gap-m:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-clearbutton-gap-l:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-clearbutton-gap-xl:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-item-workflow-padding-left-s:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-workflow-padding-left-l:var(
--spectrum-global-dimension-size-160
);--spectrum-alias-item-workflow-padding-left-xl:var(
--spectrum-global-dimension-size-185
);--spectrum-alias-item-rounded-workflow-padding-left-s:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-rounded-workflow-padding-left-l:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-item-mark-padding-top-s:var(
--spectrum-global-dimension-size-40
);--spectrum-alias-item-mark-padding-top-l:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-mark-padding-top-xl:var(
--spectrum-global-dimension-size-130
);--spectrum-alias-item-mark-padding-bottom-s:var(
--spectrum-global-dimension-size-40
);--spectrum-alias-item-mark-padding-bottom-l:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-mark-padding-bottom-xl:var(
--spectrum-global-dimension-size-130
);--spectrum-alias-item-mark-padding-left-s:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-mark-padding-left-l:var(
--spectrum-global-dimension-size-160
);--spectrum-alias-item-mark-padding-left-xl:var(
--spectrum-global-dimension-size-185
);--spectrum-alias-item-control-1-size-s:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-item-control-1-size-m:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-item-control-2-size-m:var(
--spectrum-global-dimension-size-175
);--spectrum-alias-item-control-2-size-l:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-item-control-2-size-xl:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-item-control-2-size-xxl:var(
--spectrum-global-dimension-size-250
);--spectrum-alias-item-control-2-border-radius-s:var(
--spectrum-global-dimension-size-75
);--spectrum-alias-item-control-2-border-radius-m:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-control-2-border-radius-l:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-item-control-2-border-radius-xl:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-control-2-border-radius-xxl:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-control-2-padding-s:var(
--spectrum-global-dimension-size-75
);--spectrum-alias-item-control-2-padding-m:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-control-2-padding-l:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-item-control-2-padding-xl:var(
--spectrum-global-dimension-size-185
);--spectrum-alias-item-control-3-height-m:var(
--spectrum-global-dimension-size-175
);--spectrum-alias-item-control-3-height-l:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-item-control-3-height-xl:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-item-control-3-border-radius-s:var(
--spectrum-global-dimension-size-75
);--spectrum-alias-item-control-3-border-radius-m:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-item-control-3-border-radius-l:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-item-control-3-border-radius-xl:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-control-3-padding-s:var(
--spectrum-global-dimension-size-75
);--spectrum-alias-item-control-3-padding-m:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-control-3-padding-l:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-item-control-3-padding-xl:var(
--spectrum-global-dimension-size-185
);--spectrum-alias-item-mark-size-s:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-item-mark-size-l:var(
--spectrum-global-dimension-size-275
);--spectrum-alias-item-mark-size-xl:var(
--spectrum-global-dimension-size-325
);--spectrum-alias-heading-xxxl-text-size:var(
--spectrum-global-dimension-font-size-1300
);--spectrum-alias-heading-xxl-text-size:var(
--spectrum-global-dimension-font-size-1100
);--spectrum-alias-heading-xl-text-size:var(
--spectrum-global-dimension-font-size-900
);--spectrum-alias-heading-l-text-size:var(
--spectrum-global-dimension-font-size-700
);--spectrum-alias-heading-m-text-size:var(
--spectrum-global-dimension-font-size-500
);--spectrum-alias-heading-s-text-size:var(
--spectrum-global-dimension-font-size-300
);--spectrum-alias-heading-xs-text-size:var(
--spectrum-global-dimension-font-size-200
);--spectrum-alias-heading-xxs-text-size:var(
--spectrum-global-dimension-font-size-100
);--spectrum-alias-heading-xxxl-margin-top:var(
--spectrum-global-dimension-font-size-1200
);--spectrum-alias-heading-xxl-margin-top:var(
--spectrum-global-dimension-font-size-900
);--spectrum-alias-heading-xl-margin-top:var(
--spectrum-global-dimension-font-size-800
);--spectrum-alias-heading-l-margin-top:var(
--spectrum-global-dimension-font-size-600
);--spectrum-alias-heading-m-margin-top:var(
--spectrum-global-dimension-font-size-400
);--spectrum-alias-heading-s-margin-top:var(
--spectrum-global-dimension-font-size-200
);--spectrum-alias-heading-xs-margin-top:var(
--spectrum-global-dimension-font-size-100
);--spectrum-alias-heading-xxs-margin-top:var(
--spectrum-global-dimension-font-size-75
);--spectrum-alias-heading-han-xxxl-text-size:var(
--spectrum-global-dimension-font-size-1300
);--spectrum-alias-heading-han-xxl-text-size:var(
--spectrum-global-dimension-font-size-900
);--spectrum-alias-heading-han-xl-text-size:var(
--spectrum-global-dimension-font-size-800
);--spectrum-alias-heading-han-l-text-size:var(
--spectrum-global-dimension-font-size-600
);--spectrum-alias-heading-han-m-text-size:var(
--spectrum-global-dimension-font-size-400
);--spectrum-alias-heading-han-s-text-size:var(
--spectrum-global-dimension-font-size-300
);--spectrum-alias-heading-han-xs-text-size:var(
--spectrum-global-dimension-font-size-200
);--spectrum-alias-heading-han-xxs-text-size:var(
--spectrum-global-dimension-font-size-100
);--spectrum-alias-heading-han-xxxl-margin-top:var(
--spectrum-global-dimension-font-size-1200
);--spectrum-alias-heading-han-xxl-margin-top:var(
--spectrum-global-dimension-font-size-800
);--spectrum-alias-heading-han-xl-margin-top:var(
--spectrum-global-dimension-font-size-700
);--spectrum-alias-heading-han-l-margin-top:var(
--spectrum-global-dimension-font-size-500
);--spectrum-alias-heading-han-m-margin-top:var(
--spectrum-global-dimension-font-size-300
);--spectrum-alias-heading-han-s-margin-top:var(
--spectrum-global-dimension-font-size-200
);--spectrum-alias-heading-han-xs-margin-top:var(
--spectrum-global-dimension-font-size-100
);--spectrum-alias-heading-han-xxs-margin-top:var(
--spectrum-global-dimension-font-size-75
);--spectrum-alias-component-border-radius:var(
--spectrum-global-dimension-size-50
);--spectrum-alias-component-border-radius-quiet:var(
--spectrum-global-dimension-static-size-0
);--spectrum-alias-component-focusring-gap:var(
--spectrum-global-dimension-static-size-0
);--spectrum-alias-component-focusring-gap-emphasized:var(
--spectrum-global-dimension-static-size-25
);--spectrum-alias-component-focusring-size:var(
--spectrum-global-dimension-static-size-10
);--spectrum-alias-component-focusring-size-emphasized:var(
--spectrum-global-dimension-static-size-25
);--spectrum-alias-input-border-size:var(
--spectrum-global-dimension-static-size-10
);--spectrum-alias-input-focusring-gap:var(
--spectrum-global-dimension-static-size-0
);--spectrum-alias-input-quiet-focusline-gap:var(
--spectrum-global-dimension-static-size-10
);--spectrum-alias-control-two-size-m:var(
--spectrum-global-dimension-size-175
);--spectrum-alias-control-two-size-l:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-control-two-size-xl:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-control-two-size-xxl:var(
--spectrum-global-dimension-size-250
);--spectrum-alias-control-two-border-radius-s:var(
--spectrum-global-dimension-size-75
);--spectrum-alias-control-two-border-radius-m:var(
--spectrum-global-dimension-size-85
);--spectrum-alias-control-two-border-radius-l:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-control-two-border-radius-xl:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-control-two-border-radius-xxl:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-control-two-focus-ring-border-radius-s:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-control-two-focus-ring-border-radius-m:var(
--spectrum-global-dimension-size-130
);--spectrum-alias-control-two-focus-ring-border-radius-l:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-control-two-focus-ring-border-radius-xl:var(
--spectrum-global-dimension-size-160
);--spectrum-alias-control-two-focus-ring-border-radius-xxl:var(
--spectrum-global-dimension-size-175
);--spectrum-alias-control-three-height-m:var(
--spectrum-global-dimension-size-175
);--spectrum-alias-control-three-height-l:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-control-three-height-xl:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-clearbutton-icon-margin-s:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-clearbutton-icon-margin-m:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-clearbutton-icon-margin-l:var(
--spectrum-global-dimension-size-185
);--spectrum-alias-clearbutton-icon-margin-xl:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-clearbutton-border-radius:var(
--spectrum-global-dimension-size-50
);--spectrum-alias-combobox-quiet-button-offset-x:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-percent-50:50%;--spectrum-alias-percent-70:70%;--spectrum-alias-percent-100:100%;--spectrum-alias-breakpoint-xsmall:304px;--spectrum-alias-breakpoint-small:768px;--spectrum-alias-breakpoint-medium:1280px;--spectrum-alias-breakpoint-large:1768px;--spectrum-alias-breakpoint-xlarge:2160px;--spectrum-alias-grid-columns:12;--spectrum-alias-grid-fluid-width:100%;--spectrum-alias-grid-fixed-max-width:1280px;--spectrum-alias-border-size-thin:var(
--spectrum-global-dimension-static-size-10
);--spectrum-alias-border-size-thick:var(
--spectrum-global-dimension-static-size-25
);--spectrum-alias-border-size-thicker:var(
--spectrum-global-dimension-static-size-50
);--spectrum-alias-border-size-thickest:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-border-offset-thin:var(
--spectrum-global-dimension-static-size-25
);--spectrum-alias-border-offset-thick:var(
--spectrum-global-dimension-static-size-50
);--spectrum-alias-border-offset-thicker:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-border-offset-thickest:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-grid-baseline:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-grid-gutter-xsmall:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-grid-gutter-small:var(
--spectrum-global-dimension-static-size-300
);--spectrum-alias-grid-gutter-medium:var(
--spectrum-global-dimension-static-size-400
);--spectrum-alias-grid-gutter-large:var(
--spectrum-global-dimension-static-size-500
);--spectrum-alias-grid-gutter-xlarge:var(
--spectrum-global-dimension-static-size-600
);--spectrum-alias-grid-margin-xsmall:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-grid-margin-small:var(
--spectrum-global-dimension-static-size-300
);--spectrum-alias-grid-margin-medium:var(
--spectrum-global-dimension-static-size-400
);--spectrum-alias-grid-margin-large:var(
--spectrum-global-dimension-static-size-500
);--spectrum-alias-grid-margin-xlarge:var(
--spectrum-global-dimension-static-size-600
);--spectrum-alias-grid-layout-region-margin-bottom-xsmall:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-grid-layout-region-margin-bottom-small:var(
--spectrum-global-dimension-static-size-300
);--spectrum-alias-grid-layout-region-margin-bottom-medium:var(
--spectrum-global-dimension-static-size-400
);--spectrum-alias-grid-layout-region-margin-bottom-large:var(
--spectrum-global-dimension-static-size-500
);--spectrum-alias-grid-layout-region-margin-bottom-xlarge:var(
--spectrum-global-dimension-static-size-600
);--spectrum-alias-radial-reaction-size-default:var(
--spectrum-global-dimension-static-size-550
);--spectrum-alias-focus-ring-gap:var(
--spectrum-global-dimension-static-size-25
);--spectrum-alias-focus-ring-size:var(
--spectrum-global-dimension-static-size-25
);--spectrum-alias-focus-ring-gap-small:var(
--spectrum-global-dimension-static-size-0
);--spectrum-alias-focus-ring-size-small:var(
--spectrum-global-dimension-static-size-10
);--spectrum-alias-dropshadow-blur:var(--spectrum-global-dimension-size-50);--spectrum-alias-dropshadow-offset-y:var(
--spectrum-global-dimension-size-10
);--spectrum-alias-font-size-default:var(
--spectrum-global-dimension-font-size-100
);--spectrum-alias-layout-label-gap-size:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-pill-button-text-size:var(
--spectrum-global-dimension-font-size-100
);--spectrum-alias-pill-button-text-baseline:var(
--spectrum-global-dimension-static-size-150
);--spectrum-alias-border-radius-xsmall:var(
--spectrum-global-dimension-size-10
);--spectrum-alias-border-radius-small:var(
--spectrum-global-dimension-size-25
);--spectrum-alias-border-radius-regular:var(
--spectrum-global-dimension-size-50
);--spectrum-alias-border-radius-medium:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-border-radius-large:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-border-radius-xlarge:var(
--spectrum-global-dimension-size-300
);--spectrum-alias-focus-ring-border-radius-xsmall:var(
--spectrum-global-dimension-size-50
);--spectrum-alias-focus-ring-border-radius-small:var(
--spectrum-global-dimension-static-size-65
);--spectrum-alias-focus-ring-border-radius-medium:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-focus-ring-border-radius-large:var(
--spectrum-global-dimension-size-250
);--spectrum-alias-focus-ring-border-radius-xlarge:var(
--spectrum-global-dimension-size-350
);--spectrum-alias-single-line-height:var(
--spectrum-global-dimension-size-400
);--spectrum-alias-single-line-width:var(
--spectrum-global-dimension-size-2400
);--spectrum-alias-workflow-icon-size-s:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-workflow-icon-size-m:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-workflow-icon-size-xl:var(
--spectrum-global-dimension-size-275
);--spectrum-alias-ui-icon-alert-size-75:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-ui-icon-alert-size-100:var(
--spectrum-global-dimension-size-225
);--spectrum-alias-ui-icon-alert-size-200:var(
--spectrum-global-dimension-size-250
);--spectrum-alias-ui-icon-alert-size-300:var(
--spectrum-global-dimension-size-275
);--spectrum-alias-ui-icon-triplegripper-size-100-height:var(
--spectrum-global-dimension-size-100
);--spectrum-alias-ui-icon-doublegripper-size-100-width:var(
--spectrum-global-dimension-size-200
);--spectrum-alias-ui-icon-singlegripper-size-100-width:var(
--spectrum-global-dimension-size-300
);--spectrum-alias-ui-icon-cornertriangle-size-75:var(
--spectrum-global-dimension-size-65
);--spectrum-alias-ui-icon-cornertriangle-size-200:var(
--spectrum-global-dimension-size-75
);--spectrum-alias-ui-icon-asterisk-size-75:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-ui-icon-asterisk-size-100:var(
--spectrum-global-dimension-size-100
)}:host,:root{--spectrum-alias-transparent-blue-background-color-hover:rgba(0,87,190,.15);--spectrum-alias-transparent-blue-background-color-down:rgba(0,72,153,.3);--spectrum-alias-transparent-blue-background-color-key-focus:var(
--spectrum-alias-transparent-blue-background-color-hover
);--spectrum-alias-transparent-blue-background-color-mouse-focus:var(
--spectrum-alias-transparent-blue-background-color-hover
);--spectrum-alias-transparent-blue-background-color:var(
--spectrum-alias-component-text-color-default
);--spectrum-alias-transparent-red-background-color-hover:rgba(154,0,0,.15);--spectrum-alias-transparent-red-background-color-down:rgba(124,0,0,.3);--spectrum-alias-transparent-red-background-color-key-focus:var(
--spectrum-alias-transparent-red-background-color-hover
);--spectrum-alias-transparent-red-background-color-mouse-focus:var(
--spectrum-alias-transparent-red-background-color-hover
);--spectrum-alias-transparent-red-background-color:var(
--spectrum-alias-component-text-color-default
);--spectrum-alias-component-text-color-disabled:var(
--spectrum-global-color-gray-500
);--spectrum-alias-component-text-color-default:var(
--spectrum-global-color-gray-800
);--spectrum-alias-component-text-color-hover:var(
--spectrum-global-color-gray-900
);--spectrum-alias-component-text-color-down:var(
--spectrum-global-color-gray-900
);--spectrum-alias-component-text-color-key-focus:var(
--spectrum-alias-component-text-color-hover
);--spectrum-alias-component-text-color-mouse-focus:var(
--spectrum-alias-component-text-color-hover
);--spectrum-alias-component-text-color:var(
--spectrum-alias-component-text-color-default
);--spectrum-alias-component-text-color-selected-default:var(
--spectrum-alias-component-text-color-default
);--spectrum-alias-component-text-color-selected-hover:var(
--spectrum-alias-component-text-color-hover
);--spectrum-alias-component-text-color-selected-down:var(
--spectrum-alias-component-text-color-down
);--spectrum-alias-component-text-color-selected-key-focus:var(
--spectrum-alias-component-text-color-key-focus
);--spectrum-alias-component-text-color-selected-mouse-focus:var(
--spectrum-alias-component-text-color-mouse-focus
);--spectrum-alias-component-text-color-selected:var(
--spectrum-alias-component-text-color-selected-default
);--spectrum-alias-component-text-color-emphasized-selected-default:var(
--spectrum-global-color-static-white
);--spectrum-alias-component-text-color-emphasized-selected-hover:var(
--spectrum-alias-component-text-color-emphasized-selected-default
);--spectrum-alias-component-text-color-emphasized-selected-down:var(
--spectrum-alias-component-text-color-emphasized-selected-default
);--spectrum-alias-component-text-color-emphasized-selected-key-focus:var(
--spectrum-alias-component-text-color-emphasized-selected-default
);--spectrum-alias-component-text-color-emphasized-selected-mouse-focus:var(
--spectrum-alias-component-text-color-emphasized-selected-default
);--spectrum-alias-component-text-color-emphasized-selected:var(
--spectrum-alias-component-text-color-emphasized-selected-default
);--spectrum-alias-component-text-color-error-default:var(
--spectrum-semantic-negative-text-color-small
);--spectrum-alias-component-text-color-error-hover:var(
--spectrum-semantic-negative-text-color-small-hover
);--spectrum-alias-component-text-color-error-down:var(
--spectrum-semantic-negative-text-color-small-down
);--spectrum-alias-component-text-color-error-key-focus:var(
--spectrum-semantic-negative-text-color-small-key-focus
);--spectrum-alias-component-text-color-error-mouse-focus:var(
--spectrum-semantic-negative-text-color-small-key-focus
);--spectrum-alias-component-text-color-error:var(
--spectrum-alias-component-text-color-error-default
);--spectrum-alias-component-icon-color-disabled:var(
--spectrum-alias-icon-color-disabled
);--spectrum-alias-component-icon-color-default:var(
--spectrum-alias-icon-color
);--spectrum-alias-component-icon-color-hover:var(
--spectrum-alias-icon-color-hover
);--spectrum-alias-component-icon-color-down:var(
--spectrum-alias-icon-color-down
);--spectrum-alias-component-icon-color-key-focus:var(
--spectrum-alias-icon-color-hover
);--spectrum-alias-component-icon-color-mouse-focus:var(
--spectrum-alias-icon-color-down
);--spectrum-alias-component-icon-color:var(
--spectrum-alias-component-icon-color-default
);--spectrum-alias-component-icon-color-selected:var(
--spectrum-alias-icon-color-selected-neutral-subdued
);--spectrum-alias-component-icon-color-emphasized-selected-default:var(
--spectrum-global-color-static-white
);--spectrum-alias-component-icon-color-emphasized-selected-hover:var(
--spectrum-alias-component-icon-color-emphasized-selected-default
);--spectrum-alias-component-icon-color-emphasized-selected-down:var(
--spectrum-alias-component-icon-color-emphasized-selected-default
);--spectrum-alias-component-icon-color-emphasized-selected-key-focus:var(
--spectrum-alias-component-icon-color-emphasized-selected-default
);--spectrum-alias-component-icon-color-emphasized-selected:var(
--spectrum-alias-component-icon-color-emphasized-selected-default
);--spectrum-alias-component-background-color-disabled:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-background-color-quiet-disabled:var(
--spectrum-alias-background-color-transparent
);--spectrum-alias-component-background-color-quiet-selected-disabled:var(
--spectrum-alias-component-background-color-disabled
);--spectrum-alias-component-background-color-default:var(
--spectrum-global-color-gray-75
);--spectrum-alias-component-background-color-hover:var(
--spectrum-global-color-gray-50
);--spectrum-alias-component-background-color-down:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-background-color-key-focus:var(
--spectrum-global-color-gray-50
);--spectrum-alias-component-background-color:var(
--spectrum-alias-component-background-color-default
);--spectrum-alias-component-background-color-selected-default:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-background-color-selected-hover:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-background-color-selected-down:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-background-color-selected-key-focus:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-background-color-selected:var(
--spectrum-alias-component-background-color-selected-default
);--spectrum-alias-component-background-color-quiet-default:var(
--spectrum-alias-background-color-transparent
);--spectrum-alias-component-background-color-quiet-hover:var(
--spectrum-alias-background-color-transparent
);--spectrum-alias-component-background-color-quiet-down:var(
--spectrum-global-color-gray-300
);--spectrum-alias-component-background-color-quiet-key-focus:var(
--spectrum-alias-background-color-transparent
);--spectrum-alias-component-background-color-quiet:var(
--spectrum-alias-component-background-color-quiet-default
);--spectrum-alias-component-background-color-quiet-selected-default:var(
--spectrum-alias-component-background-color-selected-default
);--spectrum-alias-component-background-color-quiet-selected-hover:var(
--spectrum-alias-component-background-color-selected-hover
);--spectrum-alias-component-background-color-quiet-selected-down:var(
--spectrum-alias-component-background-color-selected-down
);--spectrum-alias-component-background-color-quiet-selected-key-focus:var(
--spectrum-alias-component-background-color-selected-key-focus
);--spectrum-alias-component-background-color-quiet-selected:var(
--spectrum-alias-component-background-color-selected-default
);--spectrum-alias-component-background-color-emphasized-selected-default:var(
--spectrum-semantic-cta-background-color-default
);--spectrum-alias-component-background-color-emphasized-selected-hover:var(
--spectrum-semantic-cta-background-color-hover
);--spectrum-alias-component-background-color-emphasized-selected-down:var(
--spectrum-semantic-cta-background-color-down
);--spectrum-alias-component-background-color-emphasized-selected-key-focus:var(
--spectrum-semantic-cta-background-color-key-focus
);--spectrum-alias-component-background-color-emphasized-selected:var(
--spectrum-alias-component-background-color-emphasized-selected-default
);--spectrum-alias-component-border-color-disabled:var(
--spectrum-alias-border-color-disabled
);--spectrum-alias-component-border-color-quiet-disabled:var(
--spectrum-alias-border-color-transparent
);--spectrum-alias-component-border-color-default:var(
--spectrum-alias-border-color
);--spectrum-alias-component-border-color-hover:var(
--spectrum-alias-border-color-hover
);--spectrum-alias-component-border-color-down:var(
--spectrum-alias-border-color-down
);--spectrum-alias-component-border-color-key-focus:var(
--spectrum-alias-border-color-key-focus
);--spectrum-alias-component-border-color:var(
--spectrum-alias-component-border-color-default
);--spectrum-alias-component-border-color-selected-default:var(
--spectrum-alias-border-color
);--spectrum-alias-component-border-color-selected-hover:var(
--spectrum-alias-border-color-hover
);--spectrum-alias-component-border-color-selected-down:var(
--spectrum-alias-border-color-down
);--spectrum-alias-component-border-color-selected-key-focus:var(
--spectrum-alias-border-color-key-focus
);--spectrum-alias-component-border-color-selected:var(
--spectrum-alias-component-border-color-selected-default
);--spectrum-alias-component-border-color-quiet-default:var(
--spectrum-alias-border-color-transparent
);--spectrum-alias-component-border-color-quiet-hover:var(
--spectrum-alias-border-color-transparent
);--spectrum-alias-component-border-color-quiet-down:var(
--spectrum-alias-border-color-transparent
);--spectrum-alias-component-border-color-quiet-key-focus:var(
--spectrum-alias-border-color-key-focus
);--spectrum-alias-component-border-color-quiet:var(
--spectrum-alias-component-border-color-quiet-default
);--spectrum-alias-component-border-color-quiet-selected-default:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-border-color-quiet-selected-hover:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-border-color-quiet-selected-down:var(
--spectrum-global-color-gray-200
);--spectrum-alias-component-border-color-quiet-selected-key-focus:var(
--spectrum-alias-border-color-key-focus
);--spectrum-alias-component-border-color-quiet-selected:var(
--spectrum-alias-component-border-color-quiet-selected-default
);--spectrum-alias-component-border-color-emphasized-selected-default:var(
--spectrum-semantic-cta-background-color-default
);--spectrum-alias-component-border-color-emphasized-selected-hover:var(
--spectrum-semantic-cta-background-color-hover
);--spectrum-alias-component-border-color-emphasized-selected-down:var(
--spectrum-semantic-cta-background-color-down
);--spectrum-alias-component-border-color-emphasized-selected-key-focus:var(
--spectrum-semantic-cta-background-color-key-focus
);--spectrum-alias-component-border-color-emphasized-selected:var(
--spectrum-alias-component-border-color-emphasized-selected-default
);--spectrum-alias-toggle-background-color-default:var(
--spectrum-global-color-gray-700
);--spectrum-alias-toggle-background-color-hover:var(
--spectrum-global-color-gray-800
);--spectrum-alias-toggle-background-color-down:var(
--spectrum-global-color-gray-900
);--spectrum-alias-toggle-background-color-key-focus:var(
--spectrum-global-color-gray-800
);--spectrum-alias-toggle-background-color:var(
--spectrum-alias-toggle-background-color-default
);--spectrum-alias-toggle-background-color-emphasized-selected-default:var(
--spectrum-global-color-blue-500
);--spectrum-alias-toggle-background-color-emphasized-selected-hover:var(
--spectrum-global-color-blue-600
);--spectrum-alias-toggle-background-color-emphasized-selected-down:var(
--spectrum-global-color-blue-700
);--spectrum-alias-toggle-background-color-emphasized-selected-key-focus:var(
--spectrum-global-color-blue-600
);--spectrum-alias-toggle-background-color-emphasized-selected:var(
--spectrum-alias-toggle-background-color-emphasized-selected-default
);--spectrum-alias-toggle-border-color-default:var(
--spectrum-global-color-gray-700
);--spectrum-alias-toggle-border-color-hover:var(
--spectrum-global-color-gray-800
);--spectrum-alias-toggle-border-color-down:var(
--spectrum-global-color-gray-900
);--spectrum-alias-toggle-border-color-key-focus:var(
--spectrum-global-color-gray-800
);--spectrum-alias-toggle-border-color:var(
--spectrum-alias-toggle-border-color-default
);--spectrum-alias-toggle-icon-color-selected:var(
--spectrum-global-color-gray-75
);--spectrum-alias-toggle-icon-color-emphasized-selected:var(
--spectrum-global-color-gray-75
);--spectrum-alias-input-border-color-disabled:var(
--spectrum-alias-border-color-transparent
);--spectrum-alias-input-border-color-quiet-disabled:var(
--spectrum-alias-border-color-mid
);--spectrum-alias-input-border-color-default:var(
--spectrum-alias-border-color
);--spectrum-alias-input-border-color-hover:var(
--spectrum-alias-border-color-hover
);--spectrum-alias-input-border-color-down:var(
--spectrum-alias-border-color-mouse-focus
);--spectrum-alias-input-border-color-mouse-focus:var(
--spectrum-alias-border-color-mouse-focus
);--spectrum-alias-input-border-color-key-focus:var(
--spectrum-alias-border-color-key-focus
);--spectrum-alias-input-border-color:var(
--spectrum-alias-input-border-color-default
);--spectrum-alias-input-border-color-invalid-default:var(
--spectrum-semantic-negative-color-default
);--spectrum-alias-input-border-color-invalid-hover:var(
--spectrum-semantic-negative-color-hover
);--spectrum-alias-input-border-color-invalid-down:var(
--spectrum-semantic-negative-color-down
);--spectrum-alias-input-border-color-invalid-mouse-focus:var(
--spectrum-semantic-negative-color-hover
);--spectrum-alias-input-border-color-invalid-key-focus:var(
--spectrum-alias-border-color-key-focus
);--spectrum-alias-input-border-color-invalid:var(
--spectrum-alias-input-border-color-invalid-default
);--spectrum-alias-background-color-yellow-default:var(
--spectrum-global-color-static-yellow-300
);--spectrum-alias-background-color-yellow-hover:var(
--spectrum-global-color-static-yellow-400
);--spectrum-alias-background-color-yellow-key-focus:var(
--spectrum-global-color-static-yellow-400
);--spectrum-alias-background-color-yellow-down:var(
--spectrum-global-color-static-yellow-500
);--spectrum-alias-background-color-yellow:var(
--spectrum-alias-background-color-yellow-default
);--spectrum-alias-tabitem-text-color-default:var(
--spectrum-alias-label-text-color
);--spectrum-alias-tabitem-text-color-hover:var(
--spectrum-alias-text-color-hover
);--spectrum-alias-tabitem-text-color-down:var(
--spectrum-alias-text-color-down
);--spectrum-alias-tabitem-text-color-key-focus:var(
--spectrum-alias-text-color-hover
);--spectrum-alias-tabitem-text-color-mouse-focus:var(
--spectrum-alias-text-color-hover
);--spectrum-alias-tabitem-text-color:var(
--spectrum-alias-tabitem-text-color-default
);--spectrum-alias-tabitem-text-color-selected-default:var(
--spectrum-global-color-gray-900
);--spectrum-alias-tabitem-text-color-selected-hover:var(
--spectrum-alias-tabitem-text-color-selected-default
);--spectrum-alias-tabitem-text-color-selected-down:var(
--spectrum-alias-tabitem-text-color-selected-default
);--spectrum-alias-tabitem-text-color-selected-key-focus:var(
--spectrum-alias-tabitem-text-color-selected-default
);--spectrum-alias-tabitem-text-color-selected-mouse-focus:var(
--spectrum-alias-tabitem-text-color-selected-default
);--spectrum-alias-tabitem-text-color-selected:var(
--spectrum-alias-tabitem-text-color-selected-default
);--spectrum-alias-tabitem-text-color-emphasized:var(
--spectrum-alias-tabitem-text-color-default
);--spectrum-alias-tabitem-text-color-emphasized-selected-default:var(
--spectrum-global-color-static-blue-500
);--spectrum-alias-tabitem-text-color-emphasized-selected-hover:var(
--spectrum-alias-tabitem-text-color-emphasized-selected-default
);--spectrum-alias-tabitem-text-color-emphasized-selected-down:var(
--spectrum-alias-tabitem-text-color-emphasized-selected-default
);--spectrum-alias-tabitem-text-color-emphasized-selected-key-focus:var(
--spectrum-alias-tabitem-text-color-emphasized-selected-default
);--spectrum-alias-tabitem-text-color-emphasized-selected-mouse-focus:var(
--spectrum-alias-tabitem-text-color-emphasized-selected-default
);--spectrum-alias-tabitem-text-color-emphasized-selected:var(
--spectrum-alias-tabitem-text-color-emphasized-selected-default
);--spectrum-alias-tabitem-selection-indicator-color-default:var(
--spectrum-alias-tabitem-text-color-selected-default
);--spectrum-alias-tabitem-selection-indicator-color-emphasized:var(
--spectrum-alias-tabitem-text-color-emphasized-selected-default
);--spectrum-alias-tabitem-icon-color-disabled:var(
--spectrum-alias-text-color-disabled
);--spectrum-alias-tabitem-icon-color-default:var(
--spectrum-alias-icon-color
);--spectrum-alias-tabitem-icon-color-hover:var(
--spectrum-alias-icon-color-hover
);--spectrum-alias-tabitem-icon-color-down:var(
--spectrum-alias-icon-color-down
);--spectrum-alias-tabitem-icon-color-key-focus:var(
--spectrum-alias-icon-color-hover
);--spectrum-alias-tabitem-icon-color-mouse-focus:var(
--spectrum-alias-icon-color-down
);--spectrum-alias-tabitem-icon-color:var(
--spectrum-alias-tabitem-icon-color-default
);--spectrum-alias-tabitem-icon-color-selected:var(
--spectrum-alias-icon-color-selected-neutral
);--spectrum-alias-tabitem-icon-color-emphasized:var(
--spectrum-alias-tabitem-text-color-default
);--spectrum-alias-tabitem-icon-color-emphasized-selected:var(
--spectrum-alias-tabitem-text-color-emphasized-selected-default
);--spectrum-alias-assetcard-selectionindicator-background-color-ordered:var(
--spectrum-global-color-blue-500
);--spectrum-alias-assetcard-overlay-background-color:rgba(27,127,245,.1);--spectrum-alias-assetcard-border-color-selected:var(
--spectrum-global-color-blue-500
);--spectrum-alias-assetcard-border-color-selected-hover:var(
--spectrum-global-color-blue-500
);--spectrum-alias-assetcard-border-color-selected-down:var(
--spectrum-global-color-blue-600
);--spectrum-alias-background-color-default:var(
--spectrum-global-color-gray-100
);--spectrum-alias-background-color-disabled:var(
--spectrum-global-color-gray-200
);--spectrum-alias-background-color-transparent:transparent;--spectrum-alias-background-color-overbackground-down:hsla(0,0%,100%,.2);--spectrum-alias-background-color-quiet-overbackground-hover:hsla(0,0%,100%,.1);--spectrum-alias-background-color-quiet-overbackground-down:hsla(0,0%,100%,.2);--spectrum-alias-background-color-overbackground-disabled:hsla(0,0%,100%,.1);--spectrum-alias-background-color-quickactions-overlay:rgba(0,0,0,.2);--spectrum-alias-placeholder-text-color:var(
--spectrum-global-color-gray-800
);--spectrum-alias-placeholder-text-color-hover:var(
--spectrum-global-color-gray-900
);--spectrum-alias-placeholder-text-color-down:var(
--spectrum-global-color-gray-900
);--spectrum-alias-placeholder-text-color-selected:var(
--spectrum-global-color-gray-800
);--spectrum-alias-label-text-color:var(--spectrum-global-color-gray-700);--spectrum-alias-text-color:var(--spectrum-global-color-gray-800);--spectrum-alias-text-color-hover:var(--spectrum-global-color-gray-900);--spectrum-alias-text-color-down:var(--spectrum-global-color-gray-900);--spectrum-alias-text-color-key-focus:var(
--spectrum-global-color-blue-600
);--spectrum-alias-text-color-mouse-focus:var(
--spectrum-global-color-blue-600
);--spectrum-alias-text-color-disabled:var(--spectrum-global-color-gray-500);--spectrum-alias-text-color-invalid:var(--spectrum-global-color-red-500);--spectrum-alias-text-color-selected:var(--spectrum-global-color-blue-600);--spectrum-alias-text-color-selected-neutral:var(
--spectrum-global-color-gray-900
);--spectrum-alias-text-color-overbackground:var(
--spectrum-global-color-static-white
);--spectrum-alias-text-color-overbackground-disabled:hsla(0,0%,100%,.2);--spectrum-alias-text-color-quiet-overbackground-disabled:hsla(0,0%,100%,.2);--spectrum-alias-heading-text-color:var(--spectrum-global-color-gray-900);--spectrum-alias-border-color:var(--spectrum-global-color-gray-400);--spectrum-alias-border-color-hover:var(--spectrum-global-color-gray-500);--spectrum-alias-border-color-down:var(--spectrum-global-color-gray-500);--spectrum-alias-border-color-key-focus:var(
--spectrum-global-color-blue-400
);--spectrum-alias-border-color-mouse-focus:var(
--spectrum-global-color-blue-500
);--spectrum-alias-border-color-disabled:var(
--spectrum-global-color-gray-200
);--spectrum-alias-border-color-extralight:var(
--spectrum-global-color-gray-100
);--spectrum-alias-border-color-light:var(--spectrum-global-color-gray-200);--spectrum-alias-border-color-mid:var(--spectrum-global-color-gray-300);--spectrum-alias-border-color-dark:var(--spectrum-global-color-gray-400);--spectrum-alias-border-color-darker-default:var(
--spectrum-global-color-gray-600
);--spectrum-alias-border-color-darker-hover:var(
--spectrum-global-color-gray-900
);--spectrum-alias-border-color-darker-down:var(
--spectrum-global-color-gray-900
);--spectrum-alias-border-color-transparent:transparent;--spectrum-alias-border-color-translucent-dark:rgba(0,0,0,.05);--spectrum-alias-border-color-translucent-darker:rgba(0,0,0,.1);--spectrum-alias-focus-color:var(--spectrum-global-color-blue-400);--spectrum-alias-focus-ring-color:var(--spectrum-alias-focus-color);--spectrum-alias-track-color-default:var(--spectrum-global-color-gray-300);--spectrum-alias-track-fill-color-overbackground:var(
--spectrum-global-color-static-white
);--spectrum-alias-track-color-disabled:var(
--spectrum-global-color-gray-300
);--spectrum-alias-track-color-overbackground:hsla(0,0%,100%,.2);--spectrum-alias-icon-color:var(--spectrum-global-color-gray-700);--spectrum-alias-icon-color-overbackground:var(
--spectrum-global-color-static-white
);--spectrum-alias-icon-color-hover:var(--spectrum-global-color-gray-900);--spectrum-alias-icon-color-down:var(--spectrum-global-color-gray-900);--spectrum-alias-icon-color-key-focus:var(
--spectrum-global-color-gray-900
);--spectrum-alias-icon-color-disabled:var(--spectrum-global-color-gray-400);--spectrum-alias-icon-color-overbackground-disabled:hsla(0,0%,100%,.2);--spectrum-alias-icon-color-quiet-overbackground-disabled:hsla(0,0%,100%,.15);--spectrum-alias-icon-color-selected-neutral:var(
--spectrum-global-color-gray-900
);--spectrum-alias-icon-color-selected-neutral-subdued:var(
--spectrum-global-color-gray-800
);--spectrum-alias-icon-color-selected:var(--spectrum-global-color-blue-500);--spectrum-alias-icon-color-selected-hover:var(
--spectrum-global-color-blue-600
);--spectrum-alias-icon-color-selected-down:var(
--spectrum-global-color-blue-700
);--spectrum-alias-icon-color-selected-focus:var(
--spectrum-global-color-blue-600
);--spectrum-alias-image-opacity-disabled:var(
--spectrum-global-color-opacity-30
);--spectrum-alias-toolbar-background-color:var(
--spectrum-global-color-gray-100
);--spectrum-alias-code-highlight-color-default:var(
--spectrum-global-color-gray-800
);--spectrum-alias-code-highlight-background-color:var(
--spectrum-global-color-gray-75
);--spectrum-alias-code-highlight-color-keyword:var(
--spectrum-global-color-fuchsia-600
);--spectrum-alias-code-highlight-color-section:var(
--spectrum-global-color-red-600
);--spectrum-alias-code-highlight-color-literal:var(
--spectrum-global-color-blue-600
);--spectrum-alias-code-highlight-color-attribute:var(
--spectrum-global-color-seafoam-600
);--spectrum-alias-code-highlight-color-class:var(
--spectrum-global-color-magenta-600
);--spectrum-alias-code-highlight-color-variable:var(
--spectrum-global-color-purple-600
);--spectrum-alias-code-highlight-color-title:var(
--spectrum-global-color-indigo-600
);--spectrum-alias-code-highlight-color-string:var(
--spectrum-global-color-fuchsia-600
);--spectrum-alias-code-highlight-color-function:var(
--spectrum-global-color-blue-600
);--spectrum-alias-code-highlight-color-comment:var(
--spectrum-global-color-gray-700
);--spectrum-alias-categorical-color-1:var(
--spectrum-global-color-static-seafoam-200
);--spectrum-alias-categorical-color-2:var(
--spectrum-global-color-static-indigo-700
);--spectrum-alias-categorical-color-3:var(
--spectrum-global-color-static-orange-500
);--spectrum-alias-categorical-color-4:var(
--spectrum-global-color-static-magenta-500
);--spectrum-alias-categorical-color-5:var(
--spectrum-global-color-static-indigo-200
);--spectrum-alias-categorical-color-6:var(
--spectrum-global-color-static-celery-200
);--spectrum-alias-categorical-color-7:var(
--spectrum-global-color-static-blue-500
);--spectrum-alias-categorical-color-8:var(
--spectrum-global-color-static-purple-800
);--spectrum-alias-categorical-color-9:var(
--spectrum-global-color-static-yellow-500
);--spectrum-alias-categorical-color-10:var(
--spectrum-global-color-static-orange-700
);--spectrum-alias-categorical-color-11:var(
--spectrum-global-color-static-green-600
);--spectrum-alias-categorical-color-12:var(
--spectrum-global-color-static-chartreuse-300
);--spectrum-alias-categorical-color-13:var(
--spectrum-global-color-static-blue-200
);--spectrum-alias-categorical-color-14:var(
--spectrum-global-color-static-fuchsia-500
);--spectrum-alias-categorical-color-15:var(
--spectrum-global-color-static-magenta-200
);--spectrum-alias-categorical-color-16:var(
--spectrum-global-color-static-yellow-200
)}:host,:root{--spectrum-colorcontrol-checkerboard-light-color:var(
--spectrum-global-color-static-white
);--spectrum-colorcontrol-checkerboard-dark-color:var(
--spectrum-global-color-static-gray-300
)}:host,:root{-webkit-tap-highlight-color:rgb(0 0 0/0)}:host,:root{--spectrum-focus-indicator-color:var(--spectrum-blue-800);--spectrum-static-white-focus-indicator-color:var(--spectrum-white);--spectrum-static-black-focus-indicator-color:var(--spectrum-black);--spectrum-overlay-color:var(--spectrum-black);--spectrum-opacity-disabled:0.3;--spectrum-neutral-subdued-content-color-selected:var(
--spectrum-neutral-subdued-content-color-down
);--spectrum-accent-content-color-selected:var(
--spectrum-accent-content-color-down
);--spectrum-disabled-background-color:var(--spectrum-gray-200);--spectrum-disabled-static-white-background-color:var(
--spectrum-transparent-white-200
);--spectrum-disabled-static-black-background-color:var(
--spectrum-transparent-black-200
);--spectrum-background-opacity-default:0;--spectrum-background-opacity-hover:0.1;--spectrum-background-opacity-down:0.1;--spectrum-background-opacity-key-focus:0.1;--spectrum-neutral-content-color-default:var(--spectrum-gray-800);--spectrum-neutral-content-color-hover:var(--spectrum-gray-900);--spectrum-neutral-content-color-down:var(--spectrum-gray-900);--spectrum-neutral-content-color-focus-hover:var(
--spectrum-neutral-content-color-down
);--spectrum-neutral-content-color-focus:var(
--spectrum-neutral-content-color-down
);--spectrum-neutral-content-color-key-focus:var(--spectrum-gray-900);--spectrum-neutral-subdued-content-color-default:var(--spectrum-gray-700);--spectrum-neutral-subdued-content-color-hover:var(--spectrum-gray-800);--spectrum-neutral-subdued-content-color-down:var(--spectrum-gray-900);--spectrum-neutral-subdued-content-color-key-focus:var(
--spectrum-gray-800
);--spectrum-accent-content-color-default:var(--spectrum-accent-color-900);--spectrum-accent-content-color-hover:var(--spectrum-accent-color-1000);--spectrum-accent-content-color-down:var(--spectrum-accent-color-1100);--spectrum-accent-content-color-key-focus:var(
--spectrum-accent-color-1000
);--spectrum-negative-content-color-default:var(
--spectrum-negative-color-900
);--spectrum-negative-content-color-hover:var(
--spectrum-negative-color-1000
);--spectrum-negative-content-color-down:var(--spectrum-negative-color-1100);--spectrum-negative-content-color-key-focus:var(
--spectrum-negative-color-1000
);--spectrum-disabled-content-color:var(--spectrum-gray-400);--spectrum-disabled-static-white-content-color:var(
--spectrum-transparent-white-500
);--spectrum-disabled-static-black-content-color:var(
--spectrum-transparent-black-500
);--spectrum-disabled-border-color:var(--spectrum-gray-300);--spectrum-disabled-static-white-border-color:var(
--spectrum-transparent-white-300
);--spectrum-disabled-static-black-border-color:var(
--spectrum-transparent-black-300
);--spectrum-negative-border-color-default:var(
--spectrum-negative-color-900
);--spectrum-negative-border-color-hover:var(--spectrum-negative-color-1000);--spectrum-negative-border-color-down:var(--spectrum-negative-color-1100);--spectrum-negative-border-color-focus-hover:var(
--spectrum-negative-border-color-down
);--spectrum-negative-border-color-focus:var(--spectrum-negative-color-1000);--spectrum-negative-border-color-key-focus:var(
--spectrum-negative-color-1000
);--spectrum-swatch-border-color:var(--spectrum-gray-900);--spectrum-swatch-border-opacity:0.51;--spectrum-swatch-disabled-icon-border-color:var(--spectrum-black);--spectrum-swatch-disabled-icon-border-opacity:0.51;--spectrum-thumbnail-border-color:var(--spectrum-gray-800);--spectrum-thumbnail-border-opacity:0.1;--spectrum-thumbnail-opacity-disabled:var(--spectrum-opacity-disabled);--spectrum-opacity-checkerboard-square-light:var(--spectrum-white);--spectrum-avatar-opacity-disabled:var(--spectrum-opacity-disabled);--spectrum-color-area-border-color:var(--spectrum-gray-900);--spectrum-color-area-border-opacity:0.1;--spectrum-color-slider-border-color:var(--spectrum-gray-900);--spectrum-color-slider-border-opacity:0.1;--spectrum-color-loupe-drop-shadow-color:var(
--spectrum-transparent-black-300
);--spectrum-color-loupe-drop-shadow-y:2px;--spectrum-color-loupe-drop-shadow-blur:8px;--spectrum-color-loupe-inner-border:var(--spectrum-transparent-black-200);--spectrum-color-loupe-outer-border:var(--spectrum-white);--spectrum-card-selection-background-color:var(--spectrum-gray-100);--spectrum-card-selection-background-color-opacity:0.95;--spectrum-drop-zone-background-color:var(--spectrum-accent-visual-color);--spectrum-drop-zone-background-color-opacity:0.1;--spectrum-drop-zone-background-color-opacity-filled:0.3;--spectrum-coach-mark-pagination-color:var(--spectrum-gray-600);--spectrum-color-handle-inner-border-color:var(--spectrum-black);--spectrum-color-handle-inner-border-opacity:0.42;--spectrum-color-handle-outer-border-opacity:var(
--spectrum-color-handle-inner-border-opacity
);--spectrum-floating-action-button-drop-shadow-color:var(
--spectrum-transparent-black-300
);--spectrum-floating-action-button-shadow-color:var(
--spectrum-floating-action-button-drop-shadow-color
);--spectrum-table-row-hover-color:var(--spectrum-gray-900);--spectrum-table-row-hover-opacity:0.07;--spectrum-table-selected-row-background-color:var(
--spectrum-informative-background-color-default
);--spectrum-table-selected-row-background-opacity:0.1;--spectrum-table-selected-row-background-color-non-emphasized:var(
--spectrum-neutral-background-color-selected-default
);--spectrum-table-selected-row-background-opacity-non-emphasized:0.1;--spectrum-table-row-down-opacity:0.1;--spectrum-table-selected-row-background-opacity-hover:0.15;--spectrum-table-selected-row-background-opacity-non-emphasized-hover:0.15;--spectrum-white-rgb:255,255,255;--spectrum-white:rgba(var(--spectrum-white-rgb));--spectrum-transparent-white-100-rgb:255,255,255;--spectrum-transparent-white-100-opacity:0;--spectrum-transparent-white-100:rgba(var(--spectrum-transparent-white-100-rgb),var(--spectrum-transparent-white-100-opacity));--spectrum-transparent-white-200-rgb:255,255,255;--spectrum-transparent-white-200-opacity:0.1;--spectrum-transparent-white-200:rgba(var(--spectrum-transparent-white-200-rgb),var(--spectrum-transparent-white-200-opacity));--spectrum-transparent-white-300-rgb:255,255,255;--spectrum-transparent-white-300-opacity:0.25;--spectrum-transparent-white-300:rgba(var(--spectrum-transparent-white-300-rgb),var(--spectrum-transparent-white-300-opacity));--spectrum-transparent-white-400-rgb:255,255,255;--spectrum-transparent-white-400-opacity:0.4;--spectrum-transparent-white-400:rgba(var(--spectrum-transparent-white-400-rgb),var(--spectrum-transparent-white-400-opacity));--spectrum-transparent-white-500-rgb:255,255,255;--spectrum-transparent-white-500-opacity:0.55;--spectrum-transparent-white-500:rgba(var(--spectrum-transparent-white-500-rgb),var(--spectrum-transparent-white-500-opacity));--spectrum-transparent-white-600-rgb:255,255,255;--spectrum-transparent-white-600-opacity:0.7;--spectrum-transparent-white-600:rgba(var(--spectrum-transparent-white-600-rgb),var(--spectrum-transparent-white-600-opacity));--spectrum-transparent-white-700-rgb:255,255,255;--spectrum-transparent-white-700-opacity:0.8;--spectrum-transparent-white-700:rgba(var(--spectrum-transparent-white-700-rgb),var(--spectrum-transparent-white-700-opacity));--spectrum-transparent-white-800-rgb:255,255,255;--spectrum-transparent-white-800-opacity:0.9;--spectrum-transparent-white-800:rgba(var(--spectrum-transparent-white-800-rgb),var(--spectrum-transparent-white-800-opacity));--spectrum-transparent-white-900-rgb:255,255,255;--spectrum-transparent-white-900:rgba(var(--spectrum-transparent-white-900-rgb));--spectrum-black-rgb:0,0,0;--spectrum-black:rgba(var(--spectrum-black-rgb));--spectrum-transparent-black-100-rgb:0,0,0;--spectrum-transparent-black-100-opacity:0;--spectrum-transparent-black-100:rgba(var(--spectrum-transparent-black-100-rgb),var(--spectrum-transparent-black-100-opacity));--spectrum-transparent-black-200-rgb:0,0,0;--spectrum-transparent-black-200-opacity:0.1;--spectrum-transparent-black-200:rgba(var(--spectrum-transparent-black-200-rgb),var(--spectrum-transparent-black-200-opacity));--spectrum-transparent-black-300-rgb:0,0,0;--spectrum-transparent-black-300-opacity:0.25;--spectrum-transparent-black-300:rgba(var(--spectrum-transparent-black-300-rgb),var(--spectrum-transparent-black-300-opacity));--spectrum-transparent-black-400-rgb:0,0,0;--spectrum-transparent-black-400-opacity:0.4;--spectrum-transparent-black-400:rgba(var(--spectrum-transparent-black-400-rgb),var(--spectrum-transparent-black-400-opacity));--spectrum-transparent-black-500-rgb:0,0,0;--spectrum-transparent-black-500-opacity:0.55;--spectrum-transparent-black-500:rgba(var(--spectrum-transparent-black-500-rgb),var(--spectrum-transparent-black-500-opacity));--spectrum-transparent-black-600-rgb:0,0,0;--spectrum-transparent-black-600-opacity:0.7;--spectrum-transparent-black-600:rgba(var(--spectrum-transparent-black-600-rgb),var(--spectrum-transparent-black-600-opacity));--spectrum-transparent-black-700-rgb:0,0,0;--spectrum-transparent-black-700-opacity:0.8;--spectrum-transparent-black-700:rgba(var(--spectrum-transparent-black-700-rgb),var(--spectrum-transparent-black-700-opacity));--spectrum-transparent-black-800-rgb:0,0,0;--spectrum-transparent-black-800-opacity:0.9;--spectrum-transparent-black-800:rgba(var(--spectrum-transparent-black-800-rgb),var(--spectrum-transparent-black-800-opacity));--spectrum-transparent-black-900-rgb:0,0,0;--spectrum-transparent-black-900:rgba(var(--spectrum-transparent-black-900-rgb));--spectrum-icon-color-inverse:var(--spectrum-gray-50);--spectrum-icon-color-primary-default:var(
--spectrum-neutral-content-color-default
);--spectrum-radio-button-selection-indicator:4px;--spectrum-field-label-to-component:0px;--spectrum-help-text-to-component:0px;--spectrum-button-minimum-width-multiplier:2.25;--spectrum-divider-thickness-small:1px;--spectrum-divider-thickness-medium:2px;--spectrum-divider-thickness-large:4px;--spectrum-swatch-rectangle-width-multiplier:2;--spectrum-swatch-slash-thickness-extra-small:2px;--spectrum-swatch-slash-thickness-small:3px;--spectrum-swatch-slash-thickness-medium:4px;--spectrum-swatch-slash-thickness-large:5px;--spectrum-progress-bar-minimum-width:48px;--spectrum-progress-bar-maximum-width:768px;--spectrum-meter-minimum-width:48px;--spectrum-meter-maximum-width:768px;--spectrum-meter-default-width:var(--spectrum-meter-width);--spectrum-in-line-alert-minimum-width:240px;--spectrum-popover-tip-width:16px;--spectrum-popover-tip-height:8px;--spectrum-menu-item-label-to-description:1px;--spectrum-menu-item-section-divider-height:8px;--spectrum-picker-minimum-width-multiplier:2;--spectrum-picker-end-edge-to-disclousure-icon-quiet:var(
--spectrum-picker-end-edge-to-disclosure-icon-quiet
);--spectrum-picker-end-edge-to-disclosure-icon-quiet:0px;--spectrum-text-field-minimum-width-multiplier:1.5;--spectrum-combo-box-minimum-width-multiplier:2.5;--spectrum-combo-box-quiet-minimum-width-multiplier:2;--spectrum-combo-box-visual-to-field-button-quiet:0px;--spectrum-alert-dialog-minimum-width:288px;--spectrum-alert-dialog-maximum-width:480px;--spectrum-contextual-help-minimum-width:268px;--spectrum-breadcrumbs-height:var(--spectrum-component-height-300);--spectrum-breadcrumbs-height-compact:var(--spectrum-component-height-200);--spectrum-breadcrumbs-end-edge-to-text:0px;--spectrum-breadcrumbs-truncated-menu-to-separator-icon:0px;--spectrum-breadcrumbs-start-edge-to-truncated-menu:0px;--spectrum-breadcrumbs-truncated-menu-to-bottom-text:0px;--spectrum-alert-banner-to-top-workflow-icon:var(
--spectrum-alert-banner-top-to-workflow-icon
);--spectrum-alert-banner-to-top-text:var(
--spectrum-alert-banner-top-to-text
);--spectrum-alert-banner-to-bottom-text:var(
--spectrum-alert-banner-bottom-to-text
);--spectrum-color-area-border-width:var(--spectrum-border-width-100);--spectrum-color-area-border-rounding:var(--spectrum-corner-radius-100);--spectrum-color-wheel-color-area-margin:12px;--spectrum-color-slider-border-width:1px;--spectrum-color-slider-border-rounding:4px;--spectrum-floating-action-button-drop-shadow-blur:12px;--spectrum-floating-action-button-drop-shadow-y:4px;--spectrum-illustrated-message-maximum-width:380px;--spectrum-search-field-minimum-width-multiplier:3;--spectrum-color-loupe-height:64px;--spectrum-color-loupe-width:48px;--spectrum-color-loupe-bottom-to-color-handle:12px;--spectrum-color-loupe-outer-border-width:var(--spectrum-border-width-200);--spectrum-color-loupe-inner-border-width:1px;--spectrum-card-minimum-width:100px;--spectrum-card-preview-minimum-height:130px;--spectrum-card-selection-background-size:40px;--spectrum-drop-zone-width:428px;--spectrum-drop-zone-content-maximum-width:var(
--spectrum-illustrated-message-maximum-width
);--spectrum-drop-zone-border-dash-length:8px;--spectrum-drop-zone-border-dash-gap:4px;--spectrum-drop-zone-title-size:var(
--spectrum-illustrated-message-title-size
);--spectrum-drop-zone-cjk-title-size:var(
--spectrum-illustrated-message-cjk-title-size
);--spectrum-drop-zone-body-size:var(
--spectrum-illustrated-message-body-size
);--spectrum-color-handle-border-width:var(--spectrum-border-width-200);--spectrum-color-handle-inner-border-width:1px;--spectrum-color-handle-outer-border-width:1px;--spectrum-color-handle-drop-shadow-x:0;--spectrum-color-handle-drop-shadow-y:0;--spectrum-color-handle-drop-shadow-blur:0;--spectrum-table-row-height-small-compact:var(
--spectrum-component-height-75
);--spectrum-table-row-height-medium-compact:var(
--spectrum-component-height-100
);--spectrum-table-row-height-large-compact:var(
--spectrum-component-height-200
);--spectrum-table-row-height-extra-large-compact:var(
--spectrum-component-height-300
);--spectrum-table-row-top-to-text-small-compact:var(
--spectrum-component-top-to-text-75
);--spectrum-table-row-top-to-text-medium-compact:var(
--spectrum-component-top-to-text-100
);--spectrum-table-row-top-to-text-large-compact:var(
--spectrum-component-top-to-text-200
);--spectrum-table-row-top-to-text-extra-large-compact:var(
--spectrum-component-top-to-text-300
);--spectrum-table-row-bottom-to-text-small-compact:var(
--spectrum-component-bottom-to-text-75
);--spectrum-table-row-bottom-to-text-medium-compact:var(
--spectrum-component-bottom-to-text-100
);--spectrum-table-row-bottom-to-text-large-compact:var(
--spectrum-component-bottom-to-text-200
);--spectrum-table-row-bottom-to-text-extra-large-compact:var(
--spectrum-component-bottom-to-text-300
);--spectrum-table-border-divider-width:1px;--spectrum-tab-item-height-small:var(--spectrum-component-height-200);--spectrum-tab-item-height-medium:var(--spectrum-component-height-300);--spectrum-tab-item-height-large:var(--spectrum-component-height-400);--spectrum-tab-item-height-extra-large:var(
--spectrum-component-height-500
);--spectrum-tab-item-compact-height-small:var(
--spectrum-component-height-75
);--spectrum-tab-item-compact-height-medium:var(
--spectrum-component-height-100
);--spectrum-tab-item-compact-height-large:var(
--spectrum-component-height-200
);--spectrum-tab-item-compact-height-extra-large:var(
--spectrum-component-height-300
);--spectrum-tab-item-start-to-edge-quiet:0px;--spectrum-in-field-button-width-stacked-small:20px;--spectrum-in-field-button-width-stacked-medium:28px;--spectrum-in-field-button-width-stacked-large:36px;--spectrum-in-field-button-width-stacked-extra-large:44px;--spectrum-in-field-button-edge-to-disclosure-icon-stacked-small:7px;--spectrum-in-field-button-edge-to-disclosure-icon-stacked-medium:9px;--spectrum-in-field-button-edge-to-disclosure-icon-stacked-large:13px;--spectrum-in-field-button-edge-to-disclosure-icon-stacked-extra-large:16px;--spectrum-in-field-button-outer-edge-to-disclosure-icon-stacked-small:3px;--spectrum-android-elevation:2dp;--spectrum-spacing-50:2px;--spectrum-spacing-75:4px;--spectrum-spacing-100:8px;--spectrum-spacing-200:12px;--spectrum-spacing-300:16px;--spectrum-spacing-400:24px;--spectrum-spacing-500:32px;--spectrum-spacing-600:40px;--spectrum-spacing-700:48px;--spectrum-spacing-800:64px;--spectrum-spacing-900:80px;--spectrum-spacing-1000:96px;--spectrum-focus-indicator-thickness:2px;--spectrum-focus-indicator-gap:2px;--spectrum-border-width-200:2px;--spectrum-border-width-400:4px;--spectrum-field-edge-to-text-quiet:0px;--spectrum-field-edge-to-visual-quiet:0px;--spectrum-field-edge-to-border-quiet:0px;--spectrum-field-edge-to-alert-icon-quiet:0px;--spectrum-field-edge-to-validation-icon-quiet:0px;--spectrum-text-underline-thickness:1px;--spectrum-text-underline-gap:1px;--spectrum-informative-color-100:var(--spectrum-blue-100);--spectrum-informative-color-200:var(--spectrum-blue-200);--spectrum-informative-color-300:var(--spectrum-blue-300);--spectrum-informative-color-400:var(--spectrum-blue-400);--spectrum-informative-color-500:var(--spectrum-blue-500);--spectrum-informative-color-600:var(--spectrum-blue-600);--spectrum-informative-color-700:var(--spectrum-blue-700);--spectrum-informative-color-800:var(--spectrum-blue-800);--spectrum-informative-color-900:var(--spectrum-blue-900);--spectrum-informative-color-1000:var(--spectrum-blue-1000);--spectrum-informative-color-1100:var(--spectrum-blue-1100);--spectrum-informative-color-1200:var(--spectrum-blue-1200);--spectrum-informative-color-1300:var(--spectrum-blue-1300);--spectrum-informative-color-1400:var(--spectrum-blue-1400);--spectrum-negative-color-100:var(--spectrum-red-100);--spectrum-negative-color-200:var(--spectrum-red-200);--spectrum-negative-color-300:var(--spectrum-red-300);--spectrum-negative-color-400:var(--spectrum-red-400);--spectrum-negative-color-500:var(--spectrum-red-500);--spectrum-negative-color-600:var(--spectrum-red-600);--spectrum-negative-color-700:var(--spectrum-red-700);--spectrum-negative-color-800:var(--spectrum-red-800);--spectrum-negative-color-900:var(--spectrum-red-900);--spectrum-negative-color-1000:var(--spectrum-red-1000);--spectrum-negative-color-1100:var(--spectrum-red-1100);--spectrum-negative-color-1200:var(--spectrum-red-1200);--spectrum-negative-color-1300:var(--spectrum-red-1300);--spectrum-negative-color-1400:var(--spectrum-red-1400);--spectrum-notice-color-100:var(--spectrum-orange-100);--spectrum-notice-color-200:var(--spectrum-orange-200);--spectrum-notice-color-300:var(--spectrum-orange-300);--spectrum-notice-color-400:var(--spectrum-orange-400);--spectrum-notice-color-500:var(--spectrum-orange-500);--spectrum-notice-color-600:var(--spectrum-orange-600);--spectrum-notice-color-700:var(--spectrum-orange-700);--spectrum-notice-color-800:var(--spectrum-orange-800);--spectrum-notice-color-900:var(--spectrum-orange-900);--spectrum-notice-color-1000:var(--spectrum-orange-1000);--spectrum-notice-color-1100:var(--spectrum-orange-1100);--spectrum-notice-color-1200:var(--spectrum-orange-1200);--spectrum-notice-color-1300:var(--spectrum-orange-1300);--spectrum-notice-color-1400:var(--spectrum-orange-1400);--spectrum-positive-color-100:var(--spectrum-green-100);--spectrum-positive-color-200:var(--spectrum-green-200);--spectrum-positive-color-300:var(--spectrum-green-300);--spectrum-positive-color-400:var(--spectrum-green-400);--spectrum-positive-color-500:var(--spectrum-green-500);--spectrum-positive-color-600:var(--spectrum-green-600);--spectrum-positive-color-700:var(--spectrum-green-700);--spectrum-positive-color-800:var(--spectrum-green-800);--spectrum-positive-color-900:var(--spectrum-green-900);--spectrum-positive-color-1000:var(--spectrum-green-1000);--spectrum-positive-color-1100:var(--spectrum-green-1100);--spectrum-positive-color-1200:var(--spectrum-green-1200);--spectrum-positive-color-1300:var(--spectrum-green-1300);--spectrum-positive-color-1400:var(--spectrum-green-1400);--spectrum-default-font-family:var(--spectrum-sans-serif-font-family);--spectrum-sans-serif-font-family:Adobe Clean;--spectrum-serif-font-family:Adobe Clean Serif;--spectrum-cjk-font-family:Adobe Clean Han;--spectrum-light-font-weight:300;--spectrum-regular-font-weight:400;--spectrum-medium-font-weight:500;--spectrum-bold-font-weight:700;--spectrum-extra-bold-font-weight:800;--spectrum-black-font-weight:900;--spectrum-italic-font-style:italic;--spectrum-default-font-style:normal;--spectrum-line-height-100:1.3;--spectrum-line-height-200:1.5;--spectrum-cjk-line-height-100:1.5;--spectrum-cjk-line-height-200:1.7;--spectrum-cjk-letter-spacing:0.05em;--spectrum-heading-sans-serif-font-family:var(
--spectrum-sans-serif-font-family
);--spectrum-heading-serif-font-family:var(--spectrum-serif-font-family);--spectrum-heading-cjk-font-family:var(--spectrum-cjk-font-family);--spectrum-heading-sans-serif-light-font-weight:var(
--spectrum-light-font-weight
);--spectrum-heading-sans-serif-light-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-serif-light-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-heading-serif-light-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-cjk-light-font-weight:var(--spectrum-light-font-weight);--spectrum-heading-cjk-light-font-style:var(--spectrum-default-font-style);--spectrum-heading-sans-serif-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-serif-font-style:var(--spectrum-default-font-style);--spectrum-heading-cjk-font-style:var(--spectrum-default-font-style);--spectrum-heading-sans-serif-heavy-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-sans-serif-heavy-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-serif-heavy-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-serif-heavy-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-cjk-heavy-font-weight:var(--spectrum-black-font-weight);--spectrum-heading-cjk-heavy-font-style:var(--spectrum-default-font-style);--spectrum-heading-sans-serif-light-strong-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-heading-sans-serif-light-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-serif-light-strong-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-heading-serif-light-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-cjk-light-strong-font-weight:var(
--spectrum-extra-bold-font-weight
);--spectrum-heading-cjk-light-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-sans-serif-strong-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-sans-serif-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-serif-strong-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-serif-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-cjk-strong-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-cjk-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-sans-serif-heavy-strong-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-sans-serif-heavy-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-serif-heavy-strong-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-serif-heavy-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-cjk-heavy-strong-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-cjk-heavy-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-sans-serif-light-emphasized-font-weight:var(
--spectrum-light-font-weight
);--spectrum-heading-sans-serif-light-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-serif-light-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-heading-serif-light-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-cjk-light-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-heading-cjk-light-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-sans-serif-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-serif-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-cjk-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-cjk-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-sans-serif-heavy-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-sans-serif-heavy-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-serif-heavy-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-serif-heavy-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-cjk-heavy-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-cjk-heavy-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-sans-serif-light-strong-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-heading-sans-serif-light-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-serif-light-strong-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-heading-serif-light-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-cjk-light-strong-emphasized-font-weight:var(
--spectrum-extra-bold-font-weight
);--spectrum-heading-cjk-light-strong-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-sans-serif-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-sans-serif-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-serif-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-serif-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-cjk-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-cjk-strong-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-sans-serif-heavy-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-sans-serif-heavy-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-serif-heavy-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-serif-heavy-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-heading-cjk-heavy-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-heading-cjk-heavy-strong-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-heading-size-xxxl:var(--spectrum-font-size-1300);--spectrum-heading-size-xxl:var(--spectrum-font-size-1100);--spectrum-heading-size-xl:var(--spectrum-font-size-900);--spectrum-heading-size-l:var(--spectrum-font-size-700);--spectrum-heading-size-m:var(--spectrum-font-size-500);--spectrum-heading-size-s:var(--spectrum-font-size-300);--spectrum-heading-size-xs:var(--spectrum-font-size-200);--spectrum-heading-size-xxs:var(--spectrum-font-size-100);--spectrum-heading-cjk-size-xxxl:var(--spectrum-font-size-1300);--spectrum-heading-cjk-size-xxl:var(--spectrum-font-size-900);--spectrum-heading-cjk-size-xl:var(--spectrum-font-size-800);--spectrum-heading-cjk-size-l:var(--spectrum-font-size-600);--spectrum-heading-cjk-size-m:var(--spectrum-font-size-400);--spectrum-heading-cjk-size-s:var(--spectrum-font-size-300);--spectrum-heading-cjk-size-xs:var(--spectrum-font-size-200);--spectrum-heading-cjk-size-xxs:var(--spectrum-font-size-100);--spectrum-heading-line-height:var(--spectrum-line-height-100);--spectrum-heading-cjk-line-height:var(--spectrum-cjk-line-height-100);--spectrum-heading-margin-top-multiplier:0.88888889;--spectrum-heading-margin-bottom-multiplier:0.25;--spectrum-heading-color:var(--spectrum-gray-900);--spectrum-body-sans-serif-font-family:var(
--spectrum-sans-serif-font-family
);--spectrum-body-serif-font-family:var(--spectrum-serif-font-family);--spectrum-body-cjk-font-family:var(--spectrum-cjk-font-family);--spectrum-body-sans-serif-font-weight:var(--spectrum-regular-font-weight);--spectrum-body-sans-serif-font-style:var(--spectrum-default-font-style);--spectrum-body-serif-font-weight:var(--spectrum-regular-font-weight);--spectrum-body-serif-font-style:var(--spectrum-default-font-style);--spectrum-body-cjk-font-weight:var(--spectrum-regular-font-weight);--spectrum-body-cjk-font-style:var(--spectrum-default-font-style);--spectrum-body-sans-serif-strong-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-body-sans-serif-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-body-serif-strong-font-weight:var(--spectrum-bold-font-weight);--spectrum-body-serif-strong-font-style:var(--spectrum-default-font-style);--spectrum-body-cjk-strong-font-weight:var(--spectrum-black-font-weight);--spectrum-body-cjk-strong-font-style:var(--spectrum-default-font-style);--spectrum-body-sans-serif-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-body-sans-serif-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-body-serif-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-body-serif-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-body-cjk-emphasized-font-weight:var(
--spectrum-extra-bold-font-weight
);--spectrum-body-cjk-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-body-sans-serif-strong-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-body-sans-serif-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-body-serif-strong-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-body-serif-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-body-cjk-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-body-cjk-strong-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-body-size-xxxl:var(--spectrum-font-size-600);--spectrum-body-size-xxl:var(--spectrum-font-size-500);--spectrum-body-size-xl:var(--spectrum-font-size-400);--spectrum-body-size-l:var(--spectrum-font-size-300);--spectrum-body-size-m:var(--spectrum-font-size-200);--spectrum-body-size-s:var(--spectrum-font-size-100);--spectrum-body-size-xs:var(--spectrum-font-size-75);--spectrum-body-line-height:var(--spectrum-line-height-200);--spectrum-body-cjk-line-height:var(--spectrum-cjk-line-height-200);--spectrum-body-margin-multiplier:0.75;--spectrum-body-color:var(--spectrum-gray-800);--spectrum-detail-sans-serif-font-family:var(
--spectrum-sans-serif-font-family
);--spectrum-detail-serif-font-family:var(--spectrum-serif-font-family);--spectrum-detail-cjk-font-family:var(--spectrum-cjk-font-family);--spectrum-detail-sans-serif-font-weight:var(--spectrum-bold-font-weight);--spectrum-detail-sans-serif-font-style:var(--spectrum-default-font-style);--spectrum-detail-serif-font-weight:var(--spectrum-bold-font-weight);--spectrum-detail-serif-font-style:var(--spectrum-default-font-style);--spectrum-detail-cjk-font-weight:var(--spectrum-extra-bold-font-weight);--spectrum-detail-cjk-font-style:var(--spectrum-default-font-style);--spectrum-detail-sans-serif-light-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-sans-serif-light-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-serif-light-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-serif-light-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-cjk-light-font-weight:var(--spectrum-light-font-weight);--spectrum-detail-cjk-light-font-style:var(--spectrum-default-font-style);--spectrum-detail-sans-serif-strong-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-detail-sans-serif-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-serif-strong-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-detail-serif-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-cjk-strong-font-weight:var(--spectrum-black-font-weight);--spectrum-detail-cjk-strong-font-style:var(--spectrum-default-font-style);--spectrum-detail-sans-serif-light-strong-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-sans-serif-light-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-serif-light-strong-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-serif-light-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-cjk-light-strong-font-weight:var(
--spectrum-extra-bold-font-weight
);--spectrum-detail-cjk-light-strong-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-sans-serif-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-detail-sans-serif-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-detail-serif-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-detail-serif-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-detail-cjk-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-detail-cjk-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-sans-serif-light-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-sans-serif-light-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-detail-serif-light-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-serif-light-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-detail-cjk-light-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-cjk-light-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-sans-serif-strong-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-detail-sans-serif-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-detail-serif-strong-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-detail-serif-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-detail-cjk-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-detail-cjk-strong-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-sans-serif-light-strong-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-sans-serif-light-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-detail-serif-light-strong-emphasized-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-detail-serif-light-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-detail-cjk-light-strong-emphasized-font-weight:var(
--spectrum-extra-bold-font-weight
);--spectrum-detail-cjk-light-strong-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-detail-size-xl:var(--spectrum-font-size-200);--spectrum-detail-size-l:var(--spectrum-font-size-100);--spectrum-detail-size-m:var(--spectrum-font-size-75);--spectrum-detail-size-s:var(--spectrum-font-size-50);--spectrum-detail-line-height:var(--spectrum-line-height-100);--spectrum-detail-cjk-line-height:var(--spectrum-cjk-line-height-100);--spectrum-detail-margin-top-multiplier:0.88888889;--spectrum-detail-margin-bottom-multiplier:0.25;--spectrum-detail-letter-spacing:0.06em;--spectrum-detail-sans-serif-text-transform:uppercase;--spectrum-detail-serif-text-transform:uppercase;--spectrum-detail-color:var(--spectrum-gray-900);--spectrum-code-font-family:Source Code Pro;--spectrum-code-cjk-font-family:var(--spectrum-code-font-family);--spectrum-code-font-weight:var(--spectrum-regular-font-weight);--spectrum-code-font-style:var(--spectrum-default-font-style);--spectrum-code-cjk-font-weight:var(--spectrum-regular-font-weight);--spectrum-code-cjk-font-style:var(--spectrum-default-font-style);--spectrum-code-strong-font-weight:var(--spectrum-bold-font-weight);--spectrum-code-strong-font-style:var(--spectrum-default-font-style);--spectrum-code-cjk-strong-font-weight:var(--spectrum-black-font-weight);--spectrum-code-cjk-strong-font-style:var(--spectrum-default-font-style);--spectrum-code-emphasized-font-weight:var(--spectrum-regular-font-weight);--spectrum-code-emphasized-font-style:var(--spectrum-italic-font-style);--spectrum-code-cjk-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-code-cjk-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-code-strong-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-code-strong-emphasized-font-style:var(
--spectrum-italic-font-style
);--spectrum-code-cjk-strong-emphasized-font-weight:var(
--spectrum-black-font-weight
);--spectrum-code-cjk-strong-emphasized-font-style:var(
--spectrum-default-font-style
);--spectrum-code-size-xl:var(--spectrum-font-size-400);--spectrum-code-size-l:var(--spectrum-font-size-300);--spectrum-code-size-m:var(--spectrum-font-size-200);--spectrum-code-size-s:var(--spectrum-font-size-100);--spectrum-code-size-xs:var(--spectrum-font-size-75);--spectrum-code-line-height:var(--spectrum-line-height-200);--spectrum-code-cjk-line-height:var(--spectrum-cjk-line-height-200);--spectrum-code-color:var(--spectrum-gray-800)}:host,:root{--spectrum-neutral-background-color-selected-default:var(
--spectrum-gray-700
);--spectrum-neutral-background-color-selected-hover:var(
--spectrum-gray-800
);--spectrum-neutral-background-color-selected-down:var(--spectrum-gray-900);--spectrum-neutral-background-color-selected-key-focus:var(
--spectrum-gray-800
);--spectrum-color-handle-outer-border-color:var(--spectrum-black);--spectrum-slider-track-thickness:2px;--spectrum-slider-handle-gap:4px;--spectrum-picker-border-width:var(--spectrum-border-width-100);--spectrum-in-field-button-fill-stacked-inner-border-rounding:0px;--spectrum-in-field-button-edge-to-fill:0px;--spectrum-in-field-button-stacked-inner-edge-to-fill:0px;--spectrum-in-field-button-outer-edge-to-disclosure-icon-stacked-medium:3px;--spectrum-in-field-button-outer-edge-to-disclosure-icon-stacked-large:4px;--spectrum-in-field-button-outer-edge-to-disclosure-icon-stacked-extra-large:5px;--spectrum-in-field-button-inner-edge-to-disclosure-icon-stacked-small:var(
--spectrum-in-field-button-outer-edge-to-disclosure-icon-stacked-small
);--spectrum-in-field-button-inner-edge-to-disclosure-icon-stacked-medium:var(
--spectrum-in-field-button-outer-edge-to-disclosure-icon-stacked-medium
);--spectrum-in-field-button-inner-edge-to-disclosure-icon-stacked-large:var(
--spectrum-in-field-button-outer-edge-to-disclosure-icon-stacked-large
);--spectrum-in-field-button-inner-edge-to-disclosure-icon-stacked-extra-large:var(
--spectrum-in-field-button-outer-edge-to-disclosure-icon-stacked-extra-large
);--spectrum-border-width-100:1px;--spectrum-accent-color-100:var(--spectrum-blue-100);--spectrum-accent-color-200:var(--spectrum-blue-200);--spectrum-accent-color-300:var(--spectrum-blue-300);--spectrum-accent-color-400:var(--spectrum-blue-400);--spectrum-accent-color-500:var(--spectrum-blue-500);--spectrum-accent-color-600:var(--spectrum-blue-600);--spectrum-accent-color-700:var(--spectrum-blue-700);--spectrum-accent-color-800:var(--spectrum-blue-800);--spectrum-accent-color-900:var(--spectrum-blue-900);--spectrum-accent-color-1000:var(--spectrum-blue-1000);--spectrum-accent-color-1100:var(--spectrum-blue-1100);--spectrum-accent-color-1200:var(--spectrum-blue-1200);--spectrum-accent-color-1300:var(--spectrum-blue-1300);--spectrum-accent-color-1400:var(--spectrum-blue-1400);--spectrum-heading-sans-serif-font-weight:var(--spectrum-bold-font-weight);--spectrum-heading-serif-font-weight:var(--spectrum-bold-font-weight);--spectrum-heading-cjk-font-weight:var(--spectrum-extra-bold-font-weight);--spectrum-heading-sans-serif-emphasized-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-heading-serif-emphasized-font-weight:var(
--spectrum-bold-font-weight
)}:host,:root{--system-spectrum-actionbutton-background-color-default:var(
--spectrum-gray-75
);--system-spectrum-actionbutton-background-color-hover:var(
--spectrum-gray-200
);--system-spectrum-actionbutton-background-color-down:var(
--spectrum-gray-300
);--system-spectrum-actionbutton-background-color-focus:var(
--spectrum-gray-200
);--system-spectrum-actionbutton-border-color-default:var(
--spectrum-gray-400
);--system-spectrum-actionbutton-border-color-hover:var(--spectrum-gray-500);--system-spectrum-actionbutton-border-color-down:var(--spectrum-gray-600);--system-spectrum-actionbutton-border-color-focus:var(--spectrum-gray-500);--system-spectrum-actionbutton-background-color-disabled:transparent;--system-spectrum-actionbutton-border-color-disabled:var(
--spectrum-disabled-border-color
);--system-spectrum-actionbutton-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-actionbutton-quiet-background-color-default:transparent;--system-spectrum-actionbutton-quiet-background-color-hover:var(
--spectrum-gray-200
);--system-spectrum-actionbutton-quiet-background-color-down:var(
--spectrum-gray-300
);--system-spectrum-actionbutton-quiet-background-color-focus:var(
--spectrum-gray-200
);--system-spectrum-actionbutton-quiet-border-color-default:transparent;--system-spectrum-actionbutton-quiet-border-color-hover:transparent;--system-spectrum-actionbutton-quiet-border-color-down:transparent;--system-spectrum-actionbutton-quiet-border-color-focus:transparent;--system-spectrum-actionbutton-quiet-background-color-disabled:transparent;--system-spectrum-actionbutton-quiet-border-color-disabled:transparent;--system-spectrum-actionbutton-selected-border-color-default:transparent;--system-spectrum-actionbutton-selected-border-color-hover:transparent;--system-spectrum-actionbutton-selected-border-color-down:transparent;--system-spectrum-actionbutton-selected-border-color-focus:transparent;--system-spectrum-actionbutton-selected-background-color-disabled:var(
--spectrum-disabled-background-color
);--system-spectrum-actionbutton-selected-border-color-disabled:transparent;--system-spectrum-actionbutton-staticblack-quiet-border-color-default:transparent;--system-spectrum-actionbutton-staticwhite-quiet-border-color-default:transparent;--system-spectrum-actionbutton-staticblack-quiet-border-color-hover:transparent;--system-spectrum-actionbutton-staticwhite-quiet-border-color-hover:transparent;--system-spectrum-actionbutton-staticblack-quiet-border-color-down:transparent;--system-spectrum-actionbutton-staticwhite-quiet-border-color-down:transparent;--system-spectrum-actionbutton-staticblack-quiet-border-color-focus:transparent;--system-spectrum-actionbutton-staticwhite-quiet-border-color-focus:transparent;--system-spectrum-actionbutton-staticblack-quiet-border-color-disabled:transparent;--system-spectrum-actionbutton-staticwhite-quiet-border-color-disabled:transparent;--system-spectrum-actionbutton-staticblack-background-color-default:transparent;--system-spectrum-actionbutton-staticblack-background-color-hover:var(
--spectrum-transparent-black-300
);--system-spectrum-actionbutton-staticblack-background-color-down:var(
--spectrum-transparent-black-400
);--system-spectrum-actionbutton-staticblack-background-color-focus:var(
--spectrum-transparent-black-300
);--system-spectrum-actionbutton-staticblack-border-color-default:var(
--spectrum-transparent-black-400
);--system-spectrum-actionbutton-staticblack-border-color-hover:var(
--spectrum-transparent-black-500
);--system-spectrum-actionbutton-staticblack-border-color-down:var(
--spectrum-transparent-black-600
);--system-spectrum-actionbutton-staticblack-border-color-focus:var(
--spectrum-transparent-black-500
);--system-spectrum-actionbutton-staticblack-content-color-default:var(
--spectrum-black
);--system-spectrum-actionbutton-staticblack-content-color-hover:var(
--spectrum-black
);--system-spectrum-actionbutton-staticblack-content-color-down:var(
--spectrum-black
);--system-spectrum-actionbutton-staticblack-content-color-focus:var(
--spectrum-black
);--system-spectrum-actionbutton-staticblack-focus-indicator-color:var(
--spectrum-static-black-focus-indicator-color
);--system-spectrum-actionbutton-staticblack-background-color-disabled:transparent;--system-spectrum-actionbutton-staticblack-border-color-disabled:var(
--spectrum-disabled-static-black-border-color
);--system-spectrum-actionbutton-staticblack-content-color-disabled:var(
--spectrum-disabled-static-black-content-color
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-background-color-default:var(
--spectrum-transparent-black-800
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-background-color-hover:var(
--spectrum-transparent-black-900
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-background-color-down:var(
--spectrum-transparent-black-900
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-background-color-focus:var(
--spectrum-transparent-black-900
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-content-color-default:var(
--spectrum-white
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-content-color-hover:var(
--spectrum-white
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-content-color-down:var(
--spectrum-white
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-content-color-focus:var(
--spectrum-white
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-background-color-disabled:var(
--spectrum-disabled-static-black-background-color
);--system-spectrum-actionbutton-staticblack-selected-mod-actionbutton-border-color-disabled:transparent;--system-spectrum-actionbutton-staticwhite-background-color-default:transparent;--system-spectrum-actionbutton-staticwhite-background-color-hover:var(
--spectrum-transparent-white-300
);--system-spectrum-actionbutton-staticwhite-background-color-down:var(
--spectrum-transparent-white-400
);--system-spectrum-actionbutton-staticwhite-background-color-focus:var(
--spectrum-transparent-white-300
);--system-spectrum-actionbutton-staticwhite-border-color-default:var(
--spectrum-transparent-white-400
);--system-spectrum-actionbutton-staticwhite-border-color-hover:var(
--spectrum-transparent-white-500
);--system-spectrum-actionbutton-staticwhite-border-color-down:var(
--spectrum-transparent-white-600
);--system-spectrum-actionbutton-staticwhite-border-color-focus:var(
--spectrum-transparent-white-500
);--system-spectrum-actionbutton-staticwhite-content-color-default:var(
--spectrum-white
);--system-spectrum-actionbutton-staticwhite-content-color-hover:var(
--spectrum-white
);--system-spectrum-actionbutton-staticwhite-content-color-down:var(
--spectrum-white
);--system-spectrum-actionbutton-staticwhite-content-color-focus:var(
--spectrum-white
);--system-spectrum-actionbutton-staticwhite-focus-indicator-color:var(
--spectrum-static-white-focus-indicator-color
);--system-spectrum-actionbutton-staticwhite-background-color-disabled:transparent;--system-spectrum-actionbutton-staticwhite-border-color-disabled:var(
--spectrum-disabled-static-white-border-color
);--system-spectrum-actionbutton-staticwhite-content-color-disabled:var(
--spectrum-disabled-static-white-content-color
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-background-color-default:var(
--spectrum-transparent-white-800
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-background-color-hover:var(
--spectrum-transparent-white-900
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-background-color-down:var(
--spectrum-transparent-white-900
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-background-color-focus:var(
--spectrum-transparent-white-900
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-content-color-default:var(
--spectrum-black
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-content-color-hover:var(
--spectrum-black
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-content-color-down:var(
--spectrum-black
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-content-color-focus:var(
--spectrum-black
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-background-color-disabled:var(
--spectrum-disabled-static-white-background-color
);--system-spectrum-actionbutton-staticwhite-selected-mod-actionbutton-border-color-disabled:transparent}:host,:root{--system-spectrum-actiongroup-gap-size-compact:0;--system-spectrum-actiongroup-horizontal-spacing-compact:-1px;--system-spectrum-actiongroup-vertical-spacing-compact:-1px}:host,:root{--system-spectrum-button-background-color-default:var(--spectrum-gray-75);--system-spectrum-button-background-color-hover:var(--spectrum-gray-200);--system-spectrum-button-background-color-down:var(--spectrum-gray-300);--system-spectrum-button-background-color-focus:var(--spectrum-gray-200);--system-spectrum-button-border-color-default:var(--spectrum-gray-400);--system-spectrum-button-border-color-hover:var(--spectrum-gray-500);--system-spectrum-button-border-color-down:var(--spectrum-gray-600);--system-spectrum-button-border-color-focus:var(--spectrum-gray-500);--system-spectrum-button-content-color-default:var(
--spectrum-neutral-content-color-default
);--system-spectrum-button-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--system-spectrum-button-content-color-down:var(
--spectrum-neutral-content-color-down
);--system-spectrum-button-content-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--system-spectrum-button-background-color-disabled:transparent;--system-spectrum-button-border-color-disabled:var(
--spectrum-disabled-border-color
);--system-spectrum-button-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-accent-background-color-default:var(
--spectrum-accent-background-color-default
);--system-spectrum-button-accent-background-color-hover:var(
--spectrum-accent-background-color-hover
);--system-spectrum-button-accent-background-color-down:var(
--spectrum-accent-background-color-down
);--system-spectrum-button-accent-background-color-focus:var(
--spectrum-accent-background-color-key-focus
);--system-spectrum-button-accent-border-color-default:transparent;--system-spectrum-button-accent-border-color-hover:transparent;--system-spectrum-button-accent-border-color-down:transparent;--system-spectrum-button-accent-border-color-focus:transparent;--system-spectrum-button-accent-content-color-default:var(
--spectrum-white
);--system-spectrum-button-accent-content-color-hover:var(--spectrum-white);--system-spectrum-button-accent-content-color-down:var(--spectrum-white);--system-spectrum-button-accent-content-color-focus:var(--spectrum-white);--system-spectrum-button-accent-background-color-disabled:var(
--spectrum-disabled-background-color
);--system-spectrum-button-accent-border-color-disabled:transparent;--system-spectrum-button-accent-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-accent-outline-background-color-default:transparent;--system-spectrum-button-accent-outline-background-color-hover:var(
--spectrum-accent-color-200
);--system-spectrum-button-accent-outline-background-color-down:var(
--spectrum-accent-color-300
);--system-spectrum-button-accent-outline-background-color-focus:var(
--spectrum-accent-color-200
);--system-spectrum-button-accent-outline-border-color-default:var(
--spectrum-accent-color-900
);--system-spectrum-button-accent-outline-border-color-hover:var(
--spectrum-accent-color-1000
);--system-spectrum-button-accent-outline-border-color-down:var(
--spectrum-accent-color-1100
);--system-spectrum-button-accent-outline-border-color-focus:var(
--spectrum-accent-color-1000
);--system-spectrum-button-accent-outline-content-color-default:var(
--spectrum-accent-content-color-default
);--system-spectrum-button-accent-outline-content-color-hover:var(
--spectrum-accent-content-color-hover
);--system-spectrum-button-accent-outline-content-color-down:var(
--spectrum-accent-content-color-down
);--system-spectrum-button-accent-outline-content-color-focus:var(
--spectrum-accent-content-color-key-focus
);--system-spectrum-button-accent-outline-background-color-disabled:transparent;--system-spectrum-button-accent-outline-border-color-disabled:var(
--spectrum-disabled-border-color
);--system-spectrum-button-accent-outline-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-negative-background-color-default:var(
--spectrum-negative-background-color-default
);--system-spectrum-button-negative-background-color-hover:var(
--spectrum-negative-background-color-hover
);--system-spectrum-button-negative-background-color-down:var(
--spectrum-negative-background-color-down
);--system-spectrum-button-negative-background-color-focus:var(
--spectrum-negative-background-color-key-focus
);--system-spectrum-button-negative-border-color-default:transparent;--system-spectrum-button-negative-border-color-hover:transparent;--system-spectrum-button-negative-border-color-down:transparent;--system-spectrum-button-negative-border-color-focus:transparent;--system-spectrum-button-negative-content-color-default:var(
--spectrum-white
);--system-spectrum-button-negative-content-color-hover:var(
--spectrum-white
);--system-spectrum-button-negative-content-color-down:var(--spectrum-white);--system-spectrum-button-negative-content-color-focus:var(
--spectrum-white
);--system-spectrum-button-negative-background-color-disabled:var(
--spectrum-disabled-background-color
);--system-spectrum-button-negative-border-color-disabled:transparent;--system-spectrum-button-negative-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-negative-outline-background-color-default:transparent;--system-spectrum-button-negative-outline-background-color-hover:var(
--spectrum-negative-color-200
);--system-spectrum-button-negative-outline-background-color-down:var(
--spectrum-negative-color-300
);--system-spectrum-button-negative-outline-background-color-focus:var(
--spectrum-negative-color-200
);--system-spectrum-button-negative-outline-border-color-default:var(
--spectrum-negative-color-900
);--system-spectrum-button-negative-outline-border-color-hover:var(
--spectrum-negative-color-1000
);--system-spectrum-button-negative-outline-border-color-down:var(
--spectrum-negative-color-1100
);--system-spectrum-button-negative-outline-border-color-focus:var(
--spectrum-negative-color-1000
);--system-spectrum-button-negative-outline-content-color-default:var(
--spectrum-negative-content-color-default
);--system-spectrum-button-negative-outline-content-color-hover:var(
--spectrum-negative-content-color-hover
);--system-spectrum-button-negative-outline-content-color-down:var(
--spectrum-negative-content-color-down
);--system-spectrum-button-negative-outline-content-color-focus:var(
--spectrum-negative-content-color-key-focus
);--system-spectrum-button-negative-outline-background-color-disabled:transparent;--system-spectrum-button-negative-outline-border-color-disabled:var(
--spectrum-disabled-border-color
);--system-spectrum-button-negative-outline-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-primary-background-color-default:var(
--spectrum-neutral-background-color-default
);--system-spectrum-button-primary-background-color-hover:var(
--spectrum-neutral-background-color-hover
);--system-spectrum-button-primary-background-color-down:var(
--spectrum-neutral-background-color-down
);--system-spectrum-button-primary-background-color-focus:var(
--spectrum-neutral-background-color-key-focus
);--system-spectrum-button-primary-border-color-default:transparent;--system-spectrum-button-primary-border-color-hover:transparent;--system-spectrum-button-primary-border-color-down:transparent;--system-spectrum-button-primary-border-color-focus:transparent;--system-spectrum-button-primary-content-color-default:var(
--spectrum-white
);--system-spectrum-button-primary-content-color-hover:var(--spectrum-white);--system-spectrum-button-primary-content-color-down:var(--spectrum-white);--system-spectrum-button-primary-content-color-focus:var(--spectrum-white);--system-spectrum-button-primary-background-color-disabled:var(
--spectrum-disabled-background-color
);--system-spectrum-button-primary-border-color-disabled:transparent;--system-spectrum-button-primary-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-primary-outline-background-color-default:transparent;--system-spectrum-button-primary-outline-background-color-hover:var(
--spectrum-gray-300
);--system-spectrum-button-primary-outline-background-color-down:var(
--spectrum-gray-400
);--system-spectrum-button-primary-outline-background-color-focus:var(
--spectrum-gray-300
);--system-spectrum-button-primary-outline-border-color-default:var(
--spectrum-gray-800
);--system-spectrum-button-primary-outline-border-color-hover:var(
--spectrum-gray-900
);--system-spectrum-button-primary-outline-border-color-down:var(
--spectrum-gray-900
);--system-spectrum-button-primary-outline-border-color-focus:var(
--spectrum-gray-900
);--system-spectrum-button-primary-outline-content-color-default:var(
--spectrum-neutral-content-color-default
);--system-spectrum-button-primary-outline-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--system-spectrum-button-primary-outline-content-color-down:var(
--spectrum-neutral-content-color-down
);--system-spectrum-button-primary-outline-content-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--system-spectrum-button-primary-outline-background-color-disabled:transparent;--system-spectrum-button-primary-outline-border-color-disabled:var(
--spectrum-disabled-border-color
);--system-spectrum-button-primary-outline-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-secondary-background-color-default:var(
--spectrum-gray-200
);--system-spectrum-button-secondary-background-color-hover:var(
--spectrum-gray-300
);--system-spectrum-button-secondary-background-color-down:var(
--spectrum-gray-400
);--system-spectrum-button-secondary-background-color-focus:var(
--spectrum-gray-300
);--system-spectrum-button-secondary-border-color-default:transparent;--system-spectrum-button-secondary-border-color-hover:transparent;--system-spectrum-button-secondary-border-color-down:transparent;--system-spectrum-button-secondary-border-color-focus:transparent;--system-spectrum-button-secondary-content-color-default:var(
--spectrum-neutral-content-color-default
);--system-spectrum-button-secondary-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--system-spectrum-button-secondary-content-color-down:var(
--spectrum-neutral-content-color-down
);--system-spectrum-button-secondary-content-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--system-spectrum-button-secondary-background-color-disabled:var(
--spectrum-disabled-background-color
);--system-spectrum-button-secondary-border-color-disabled:transparent;--system-spectrum-button-secondary-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-secondary-outline-background-color-default:transparent;--system-spectrum-button-secondary-outline-background-color-hover:var(
--spectrum-gray-300
);--system-spectrum-button-secondary-outline-background-color-down:var(
--spectrum-gray-400
);--system-spectrum-button-secondary-outline-background-color-focus:var(
--spectrum-gray-300
);--system-spectrum-button-secondary-outline-border-color-default:var(
--spectrum-gray-300
);--system-spectrum-button-secondary-outline-border-color-hover:var(
--spectrum-gray-400
);--system-spectrum-button-secondary-outline-border-color-down:var(
--spectrum-gray-500
);--system-spectrum-button-secondary-outline-border-color-focus:var(
--spectrum-gray-400
);--system-spectrum-button-secondary-outline-content-color-default:var(
--spectrum-neutral-content-color-default
);--system-spectrum-button-secondary-outline-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--system-spectrum-button-secondary-outline-content-color-down:var(
--spectrum-neutral-content-color-down
);--system-spectrum-button-secondary-outline-content-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--system-spectrum-button-secondary-outline-background-color-disabled:transparent;--system-spectrum-button-secondary-outline-border-color-disabled:var(
--spectrum-disabled-border-color
);--system-spectrum-button-secondary-outline-content-color-disabled:var(
--spectrum-disabled-content-color
);--system-spectrum-button-quiet-background-color-default:transparent;--system-spectrum-button-quiet-background-color-hover:var(
--spectrum-gray-200
);--system-spectrum-button-quiet-background-color-down:var(
--spectrum-gray-300
);--system-spectrum-button-quiet-background-color-focus:var(
--spectrum-gray-200
);--system-spectrum-button-quiet-border-color-default:transparent;--system-spectrum-button-quiet-border-color-hover:transparent;--system-spectrum-button-quiet-border-color-down:transparent;--system-spectrum-button-quiet-border-color-focus:transparent;--system-spectrum-button-quiet-background-color-disabled:transparent;--system-spectrum-button-quiet-border-color-disabled:transparent;--system-spectrum-button-selected-background-color-default:var(
--spectrum-neutral-subdued-background-color-default
);--system-spectrum-button-selected-background-color-hover:var(
--spectrum-neutral-subdued-background-color-hover
);--system-spectrum-button-selected-background-color-down:var(
--spectrum-neutral-subdued-background-color-down
);--system-spectrum-button-selected-background-color-focus:var(
--spectrum-neutral-subdued-background-color-key-focus
);--system-spectrum-button-selected-border-color-default:transparent;--system-spectrum-button-selected-border-color-hover:transparent;--system-spectrum-button-selected-border-color-down:transparent;--system-spectrum-button-selected-border-color-focus:transparent;--system-spectrum-button-selected-content-color-default:var(
--spectrum-white
);--system-spectrum-button-selected-content-color-hover:var(
--spectrum-white
);--system-spectrum-button-selected-content-color-down:var(--spectrum-white);--system-spectrum-button-selected-content-color-focus:var(
--spectrum-white
);--system-spectrum-button-selected-background-color-disabled:var(
--spectrum-disabled-background-color
);--system-spectrum-button-selected-border-color-disabled:transparent;--system-spectrum-button-selected-emphasized-background-color-default:var(
--spectrum-accent-background-color-default
);--system-spectrum-button-selected-emphasized-background-color-hover:var(
--spectrum-accent-background-color-hover
);--system-spectrum-button-selected-emphasized-background-color-down:var(
--spectrum-accent-background-color-down
);--system-spectrum-button-selected-emphasized-background-color-focus:var(
--spectrum-accent-background-color-key-focus
);--system-spectrum-button-staticblack-quiet-border-color-default:transparent;--system-spectrum-button-staticwhite-quiet-border-color-default:transparent;--system-spectrum-button-staticblack-quiet-border-color-hover:transparent;--system-spectrum-button-staticwhite-quiet-border-color-hover:transparent;--system-spectrum-button-staticblack-quiet-border-color-down:transparent;--system-spectrum-button-staticwhite-quiet-border-color-down:transparent;--system-spectrum-button-staticblack-quiet-border-color-focus:transparent;--system-spectrum-button-staticwhite-quiet-border-color-focus:transparent;--system-spectrum-button-staticblack-quiet-border-color-disabled:transparent;--system-spectrum-button-staticwhite-quiet-border-color-disabled:transparent;--system-spectrum-button-staticwhite-background-color-default:var(
--spectrum-transparent-white-800
);--system-spectrum-button-staticwhite-background-color-hover:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-background-color-down:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-background-color-focus:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-border-color-default:transparent;--system-spectrum-button-staticwhite-border-color-hover:transparent;--system-spectrum-button-staticwhite-border-color-down:transparent;--system-spectrum-button-staticwhite-border-color-focus:transparent;--system-spectrum-button-staticwhite-content-color-default:var(
--spectrum-black
);--system-spectrum-button-staticwhite-content-color-hover:var(
--spectrum-black
);--system-spectrum-button-staticwhite-content-color-down:var(
--spectrum-black
);--system-spectrum-button-staticwhite-content-color-focus:var(
--spectrum-black
);--system-spectrum-button-staticwhite-focus-indicator-color:var(
--spectrum-static-white-focus-indicator-color
);--system-spectrum-button-staticwhite-background-color-disabled:var(
--spectrum-disabled-static-white-background-color
);--system-spectrum-button-staticwhite-border-color-disabled:transparent;--system-spectrum-button-staticwhite-content-color-disabled:var(
--spectrum-disabled-static-white-content-color
);--system-spectrum-button-staticwhite-outline-background-color-default:transparent;--system-spectrum-button-staticwhite-outline-background-color-hover:var(
--spectrum-transparent-white-300
);--system-spectrum-button-staticwhite-outline-background-color-down:var(
--spectrum-transparent-white-400
);--system-spectrum-button-staticwhite-outline-background-color-focus:var(
--spectrum-transparent-white-300
);--system-spectrum-button-staticwhite-outline-border-color-default:var(
--spectrum-transparent-white-800
);--system-spectrum-button-staticwhite-outline-border-color-hover:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-outline-border-color-down:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-outline-border-color-focus:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-outline-content-color-default:var(
--spectrum-white
);--system-spectrum-button-staticwhite-outline-content-color-hover:var(
--spectrum-white
);--system-spectrum-button-staticwhite-outline-content-color-down:var(
--spectrum-white
);--system-spectrum-button-staticwhite-outline-content-color-focus:var(
--spectrum-white
);--system-spectrum-button-staticwhite-outline-focus-indicator-color:var(
--spectrum-static-white-focus-indicator-color
);--system-spectrum-button-staticwhite-outline-background-color-disabled:transparent;--system-spectrum-button-staticwhite-outline-border-color-disabled:var(
--spectrum-disabled-static-white-border-color
);--system-spectrum-button-staticwhite-outline-content-color-disabled:var(
--spectrum-disabled-static-white-content-color
);--system-spectrum-button-staticwhite-selected-background-color-default:var(
--spectrum-transparent-white-800
);--system-spectrum-button-staticwhite-selected-background-color-hover:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-selected-background-color-down:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-selected-background-color-focus:var(
--spectrum-transparent-white-900
);--system-spectrum-button-staticwhite-selected-content-color-default:var(
--spectrum-black
);--system-spectrum-button-staticwhite-selected-content-color-hover:var(
--spectrum-black
);--system-spectrum-button-staticwhite-selected-content-color-down:var(
--spectrum-black
);--system-spectrum-button-staticwhite-selected-content-color-focus:var(
--spectrum-black
);--system-spectrum-button-staticwhite-selected-background-color-disabled:var(
--spectrum-disabled-static-white-background-color
);--system-spectrum-button-staticwhite-selected-border-color-disabled:transparent;--system-spectrum-button-staticwhite-secondary-background-color-default:var(
--spectrum-transparent-white-200
);--system-spectrum-button-staticwhite-secondary-background-color-hover:var(
--spectrum-transparent-white-300
);--system-spectrum-button-staticwhite-secondary-background-color-down:var(
--spectrum-transparent-white-400
);--system-spectrum-button-staticwhite-secondary-background-color-focus:var(
--spectrum-transparent-white-300
);--system-spectrum-button-staticwhite-secondary-border-color-default:transparent;--system-spectrum-button-staticwhite-secondary-border-color-hover:transparent;--system-spectrum-button-staticwhite-secondary-border-color-down:transparent;--system-spectrum-button-staticwhite-secondary-border-color-focus:transparent;--system-spectrum-button-staticwhite-secondary-content-color-default:var(
--spectrum-white
);--system-spectrum-button-staticwhite-secondary-content-color-hover:var(
--spectrum-white
);--system-spectrum-button-staticwhite-secondary-content-color-down:var(
--spectrum-white
);--system-spectrum-button-staticwhite-secondary-content-color-focus:var(
--spectrum-white
);--system-spectrum-button-staticwhite-secondary-focus-indicator-color:var(
--spectrum-static-white-focus-indicator-color
);--system-spectrum-button-staticwhite-secondary-background-color-disabled:var(
--spectrum-disabled-static-white-background-color
);--system-spectrum-button-staticwhite-secondary-border-color-disabled:transparent;--system-spectrum-button-staticwhite-secondary-content-color-disabled:var(
--spectrum-disabled-static-white-content-color
);--system-spectrum-button-staticwhite-secondary-outline-background-color-default:transparent;--system-spectrum-button-staticwhite-secondary-outline-background-color-hover:var(
--spectrum-transparent-white-300
);--system-spectrum-button-staticwhite-secondary-outline-background-color-down:var(
--spectrum-transparent-white-400
);--system-spectrum-button-staticwhite-secondary-outline-background-color-focus:var(
--spectrum-transparent-white-300
);--system-spectrum-button-staticwhite-secondary-outline-border-color-default:var(
--spectrum-transparent-white-300
);--system-spectrum-button-staticwhite-secondary-outline-border-color-hover:var(
--spectrum-transparent-white-400
);--system-spectrum-button-staticwhite-secondary-outline-border-color-down:var(
--spectrum-transparent-white-500
);--system-spectrum-button-staticwhite-secondary-outline-border-color-focus:var(
--spectrum-transparent-white-400
);--system-spectrum-button-staticwhite-secondary-outline-content-color-default:var(
--spectrum-white
);--system-spectrum-button-staticwhite-secondary-outline-content-color-hover:var(
--spectrum-white
);--system-spectrum-button-staticwhite-secondary-outline-content-color-down:var(
--spectrum-white
);--system-spectrum-button-staticwhite-secondary-outline-content-color-focus:var(
--spectrum-white
);--system-spectrum-button-staticwhite-secondary-outline-focus-indicator-color:var(
--spectrum-static-white-focus-indicator-color
);--system-spectrum-button-staticwhite-secondary-outline-background-color-disabled:transparent;--system-spectrum-button-staticwhite-secondary-outline-border-color-disabled:var(
--spectrum-disabled-static-white-border-color
);--system-spectrum-button-staticwhite-secondary-outline-content-color-disabled:var(
--spectrum-disabled-static-white-content-color
);--system-spectrum-button-staticblack-background-color-default:var(
--spectrum-transparent-black-800
);--system-spectrum-button-staticblack-background-color-hover:var(
--spectrum-transparent-black-900
);--system-spectrum-button-staticblack-background-color-down:var(
--spectrum-transparent-black-900
);--system-spectrum-button-staticblack-background-color-focus:var(
--spectrum-transparent-black-900
);--system-spectrum-button-staticblack-border-color-default:transparent;--system-spectrum-button-staticblack-border-color-hover:transparent;--system-spectrum-button-staticblack-border-color-down:transparent;--system-spectrum-button-staticblack-border-color-focus:transparent;--system-spectrum-button-staticblack-content-color-default:var(
--spectrum-white
);--system-spectrum-button-staticblack-content-color-hover:var(
--spectrum-white
);--system-spectrum-button-staticblack-content-color-down:var(
--spectrum-white
);--system-spectrum-button-staticblack-content-color-focus:var(
--spectrum-white
);--system-spectrum-button-staticblack-focus-indicator-color:var(
--spectrum-static-black-focus-indicator-color
);--system-spectrum-button-staticblack-background-color-disabled:var(
--spectrum-disabled-static-black-background-color
);--system-spectrum-button-staticblack-border-color-disabled:transparent;--system-spectrum-button-staticblack-content-color-disabled:var(
--spectrum-disabled-static-black-content-color
);--system-spectrum-button-staticblack-outline-background-color-default:transparent;--system-spectrum-button-staticblack-outline-background-color-hover:var(
--spectrum-transparent-black-300
);--system-spectrum-button-staticblack-outline-background-color-down:var(
--spectrum-transparent-black-400
);--system-spectrum-button-staticblack-outline-background-color-focus:var(
--spectrum-transparent-black-300
);--system-spectrum-button-staticblack-outline-border-color-default:var(
--spectrum-transparent-black-400
);--system-spectrum-button-staticblack-outline-border-color-hover:var(
--spectrum-transparent-black-500
);--system-spectrum-button-staticblack-outline-border-color-down:var(
--spectrum-transparent-black-600
);--system-spectrum-button-staticblack-outline-border-color-focus:var(
--spectrum-transparent-black-500
);--system-spectrum-button-staticblack-outline-content-color-default:var(
--spectrum-black
);--system-spectrum-button-staticblack-outline-content-color-hover:var(
--spectrum-black
);--system-spectrum-button-staticblack-outline-content-color-down:var(
--spectrum-black
);--system-spectrum-button-staticblack-outline-content-color-focus:var(
--spectrum-black
);--system-spectrum-button-staticblack-outline-focus-indicator-color:var(
--spectrum-static-black-focus-indicator-color
);--system-spectrum-button-staticblack-outline-background-color-disabled:transparent;--system-spectrum-button-staticblack-outline-border-color-disabled:var(
--spectrum-disabled-static-black-border-color
);--system-spectrum-button-staticblack-outline-content-color-disabled:var(
--spectrum-disabled-static-black-content-color
);--system-spectrum-button-staticblack-secondary-background-color-default:var(
--spectrum-transparent-black-200
);--system-spectrum-button-staticblack-secondary-background-color-hover:var(
--spectrum-transparent-black-300
);--system-spectrum-button-staticblack-secondary-background-color-down:var(
--spectrum-transparent-black-400
);--system-spectrum-button-staticblack-secondary-background-color-focus:var(
--spectrum-transparent-black-300
);--system-spectrum-button-staticblack-secondary-border-color-default:transparent;--system-spectrum-button-staticblack-secondary-border-color-hover:transparent;--system-spectrum-button-staticblack-secondary-border-color-down:transparent;--system-spectrum-button-staticblack-secondary-border-color-focus:transparent;--system-spectrum-button-staticblack-secondary-content-color-default:var(
--spectrum-black
);--system-spectrum-button-staticblack-secondary-content-color-hover:var(
--spectrum-black
);--system-spectrum-button-staticblack-secondary-content-color-down:var(
--spectrum-black
);--system-spectrum-button-staticblack-secondary-content-color-focus:var(
--spectrum-black
);--system-spectrum-button-staticblack-secondary-focus-indicator-color:var(
--spectrum-static-black-focus-indicator-color
);--system-spectrum-button-staticblack-secondary-background-color-disabled:var(
--spectrum-disabled-static-black-background-color
);--system-spectrum-button-staticblack-secondary-border-color-disabled:transparent;--system-spectrum-button-staticblack-secondary-content-color-disabled:var(
--spectrum-disabled-static-black-content-color
);--system-spectrum-button-staticblack-secondary-outline-background-color-default:transparent;--system-spectrum-button-staticblack-secondary-outline-background-color-hover:var(
--spectrum-transparent-black-300
);--system-spectrum-button-staticblack-secondary-outline-background-color-down:var(
--spectrum-transparent-black-400
);--system-spectrum-button-staticblack-secondary-outline-background-color-focus:var(
--spectrum-transparent-black-300
);--system-spectrum-button-staticblack-secondary-outline-border-color-default:var(
--spectrum-transparent-black-300
);--system-spectrum-button-staticblack-secondary-outline-border-color-hover:var(
--spectrum-transparent-black-400
);--system-spectrum-button-staticblack-secondary-outline-border-color-down:var(
--spectrum-transparent-black-500
);--system-spectrum-button-staticblack-secondary-outline-border-color-focus:var(
--spectrum-transparent-black-400
);--system-spectrum-button-staticblack-secondary-outline-content-color-default:var(
--spectrum-black
);--system-spectrum-button-staticblack-secondary-outline-content-color-hover:var(
--spectrum-black
);--system-spectrum-button-staticblack-secondary-outline-content-color-down:var(
--spectrum-black
);--system-spectrum-button-staticblack-secondary-outline-content-color-focus:var(
--spectrum-black
);--system-spectrum-button-staticblack-secondary-outline-focus-indicator-color:var(
--spectrum-static-black-focus-indicator-color
);--system-spectrum-button-staticblack-secondary-outline-background-color-disabled:transparent;--system-spectrum-button-staticblack-secondary-outline-border-color-disabled:var(
--spectrum-disabled-static-black-border-color
);--system-spectrum-button-staticblack-secondary-outline-content-color-disabled:var(
--spectrum-disabled-static-black-content-color
)}:host,:root{--system-spectrum-checkbox-control-color-default:var(--spectrum-gray-600);--system-spectrum-checkbox-control-color-hover:var(--spectrum-gray-700);--system-spectrum-checkbox-control-color-down:var(--spectrum-gray-800);--system-spectrum-checkbox-control-color-focus:var(--spectrum-gray-700)}:host,:root{--system-spectrum-closebutton-background-color-default:transparent;--system-spectrum-closebutton-background-color-hover:var(
--spectrum-gray-200
);--system-spectrum-closebutton-background-color-down:var(
--spectrum-gray-300
);--system-spectrum-closebutton-background-color-focus:var(
--spectrum-gray-200
)}:host,:root{--system-spectrum-infieldbutton-spectrum-infield-button-border-width:var(
--spectrum-border-width-100
);--system-spectrum-infieldbutton-spectrum-infield-button-border-color:inherit;--system-spectrum-infieldbutton-spectrum-infield-button-border-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-infieldbutton-spectrum-infield-button-border-radius-reset:0;--system-spectrum-infieldbutton-spectrum-infield-button-stacked-top-border-radius-start-start:var(
--spectrum-infield-button-border-radius-reset
);--system-spectrum-infieldbutton-spectrum-infield-button-stacked-bottom-border-radius-end-start:var(
--spectrum-infield-button-border-radius-reset
);--system-spectrum-infieldbutton-spectrum-infield-button-background-color:var(
--spectrum-gray-75
);--system-spectrum-infieldbutton-spectrum-infield-button-background-color-hover:var(
--spectrum-gray-200
);--system-spectrum-infieldbutton-spectrum-infield-button-background-color-down:var(
--spectrum-gray-300
);--system-spectrum-infieldbutton-spectrum-infield-button-background-color-key-focus:var(
--spectrum-gray-200
)}:host,:root{--system-spectrum-radio-button-border-color-default:var(
--spectrum-gray-600
);--system-spectrum-radio-button-border-color-hover:var(--spectrum-gray-700);--system-spectrum-radio-button-border-color-down:var(--spectrum-gray-800);--system-spectrum-radio-button-border-color-focus:var(--spectrum-gray-700);--system-spectrum-radio-emphasized-button-checked-border-color-default:var(
--spectrum-accent-color-900
);--system-spectrum-radio-emphasized-button-checked-border-color-hover:var(
--spectrum-accent-color-1000
);--system-spectrum-radio-emphasized-button-checked-border-color-down:var(
--spectrum-accent-color-1100
);--system-spectrum-radio-emphasized-button-checked-border-color-focus:var(
--spectrum-accent-color-1000
)}:host,:root{--system-spectrum-switch-handle-border-color-default:var(
--spectrum-gray-600
);--system-spectrum-switch-handle-border-color-hover:var(
--spectrum-gray-700
);--system-spectrum-switch-handle-border-color-down:var(--spectrum-gray-800);--system-spectrum-switch-handle-border-color-focus:var(
--spectrum-gray-700
);--system-spectrum-switch-handle-border-color-selected-default:var(
--spectrum-gray-700
);--system-spectrum-switch-handle-border-color-selected-hover:var(
--spectrum-gray-800
);--system-spectrum-switch-handle-border-color-selected-down:var(
--spectrum-gray-900
);--system-spectrum-switch-handle-border-color-selected-focus:var(
--spectrum-gray-800
)}:host,:root{--system-spectrum-tag-border-color:var(--spectrum-gray-700);--system-spectrum-tag-border-color-hover:var(--spectrum-gray-800);--system-spectrum-tag-border-color-active:var(--spectrum-gray-900);--system-spectrum-tag-border-color-focus:var(--spectrum-gray-800);--system-spectrum-tag-size-small-corner-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-tag-size-medium-corner-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-tag-size-large-corner-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-tag-background-color:var(--spectrum-gray-75);--system-spectrum-tag-background-color-hover:var(--spectrum-gray-75);--system-spectrum-tag-background-color-active:var(--spectrum-gray-200);--system-spectrum-tag-background-color-focus:var(--spectrum-gray-75);--system-spectrum-tag-content-color:var(
--spectrum-neutral-subdued-content-color-default
);--system-spectrum-tag-content-color-hover:var(
--spectrum-neutral-subdued-content-color-hover
);--system-spectrum-tag-content-color-active:var(
--spectrum-neutral-subdued-content-color-down
);--system-spectrum-tag-content-color-focus:var(
--spectrum-neutral-subdued-content-color-key-focus
);--system-spectrum-tag-border-color-selected:var(
--spectrum-neutral-subdued-background-color-default
);--system-spectrum-tag-border-color-selected-hover:var(
--spectrum-neutral-subdued-background-color-hover
);--system-spectrum-tag-border-color-selected-active:var(
--spectrum-neutral-subdued-background-color-down
);--system-spectrum-tag-border-color-selected-focus:var(
--spectrum-neutral-subdued-background-color-key-focus
);--system-spectrum-tag-border-color-disabled:transparent;--system-spectrum-tag-background-color-disabled:var(
--spectrum-disabled-background-color
);--system-spectrum-tag-size-small-spacing-inline-start:var(
--spectrum-component-edge-to-visual-75
);--system-spectrum-tag-size-small-label-spacing-inline-end:var(
--spectrum-component-edge-to-text-75
);--system-spectrum-tag-size-small-clear-button-spacing-inline-end:var(
--spectrum-component-edge-to-visual-75
);--system-spectrum-tag-size-medium-spacing-inline-start:var(
--spectrum-component-edge-to-visual-100
);--system-spectrum-tag-size-medium-label-spacing-inline-end:var(
--spectrum-component-edge-to-text-100
);--system-spectrum-tag-size-medium-clear-button-spacing-inline-end:var(
--spectrum-component-edge-to-visual-100
);--system-spectrum-tag-size-large-spacing-inline-start:var(
--spectrum-component-edge-to-visual-200
);--system-spectrum-tag-size-large-label-spacing-inline-end:var(
--spectrum-component-edge-to-text-200
);--system-spectrum-tag-size-large-clear-button-spacing-inline-end:var(
--spectrum-component-edge-to-visual-200
)}:host,:root{--system-spectrum-toast-background-color-default:var(
--spectrum-neutral-subdued-background-color-default
)}:host,:root{--system-spectrum-tooltip-backgound-color-default-neutral:var(
--spectrum-neutral-subdued-background-color-default
)}:host,:root{--system-spectrum-picker-background-color-default:var(--spectrum-gray-75);--system-spectrum-picker-background-color-default-open:var(
--spectrum-gray-200
);--system-spectrum-picker-background-color-active:var(--spectrum-gray-300);--system-spectrum-picker-background-color-hover:var(--spectrum-gray-200);--system-spectrum-picker-background-color-hover-open:var(
--spectrum-gray-200
);--system-spectrum-picker-background-color-key-focus:var(
--spectrum-gray-200
);--system-spectrum-picker-border-color-default:var(--spectrum-gray-500);--system-spectrum-picker-border-color-default-open:var(
--spectrum-gray-500
);--system-spectrum-picker-border-color-hover:var(--spectrum-gray-600);--system-spectrum-picker-border-color-hover-open:var(--spectrum-gray-600);--system-spectrum-picker-border-color-active:var(--spectrum-gray-700);--system-spectrum-picker-border-color-key-focus:var(--spectrum-gray-600)}:host,:root{--system-spectrum-slider-track-color:var(--spectrum-gray-300);--system-spectrum-slider-track-fill-color:var(--spectrum-gray-700);--system-spectrum-slider-ramp-track-color:var(--spectrum-gray-400);--system-spectrum-slider-ramp-track-color-disabled:var(
--spectrum-gray-200
);--system-spectrum-slider-handle-background-color:transparent;--system-spectrum-slider-handle-background-color-disabled:transparent;--system-spectrum-slider-ramp-handle-background-color:var(
--spectrum-gray-100
);--system-spectrum-slider-ticks-handle-background-color:var(
--spectrum-gray-100
);--system-spectrum-slider-handle-border-color:var(--spectrum-gray-700);--system-spectrum-slider-handle-disabled-background-color:var(
--spectrum-gray-100
);--system-spectrum-slider-tick-mark-color:var(--spectrum-gray-300);--system-spectrum-slider-handle-border-color-hover:var(
--spectrum-gray-800
);--system-spectrum-slider-handle-border-color-down:var(--spectrum-gray-800);--system-spectrum-slider-handle-border-color-key-focus:var(
--spectrum-gray-800
);--system-spectrum-slider-handle-focus-ring-color-key-focus:var(
--spectrum-focus-indicator-color
)}:host,:root{--system-spectrum-popover-border-width:var(--spectrum-border-width-100)}:host,:root{--system-spectrum-stepper-border-width:var(--spectrum-border-width-100);--system-spectrum-stepper-buttons-border-style:none;--system-spectrum-stepper-buttons-border-width:0;--system-spectrum-stepper-buttons-background-color:var(--spectrum-gray-50);--system-spectrum-stepper-border-color:var(--spectrum-gray-500);--system-spectrum-stepper-border-color-hover:var(--spectrum-gray-600);--system-spectrum-stepper-border-color-focus:var(--spectrum-gray-800);--system-spectrum-stepper-border-color-focus-hover:var(
--spectrum-gray-800
);--system-spectrum-stepper-border-color-keyboard-focus:var(
--spectrum-gray-900
);--system-spectrum-stepper-button-border-radius-reset:0px;--system-spectrum-stepper-button-background-color-focus:var(
--spectrum-gray-300
);--system-spectrum-stepper-button-background-color-keyboard-focus:var(
--spectrum-gray-200
)}:host,:root{--system-spectrum-textfield-border-color:var(--spectrum-gray-500);--system-spectrum-textfield-border-color-hover:var(--spectrum-gray-600);--system-spectrum-textfield-border-color-focus:var(--spectrum-gray-800);--system-spectrum-textfield-border-color-focus-hover:var(
--spectrum-gray-900
);--system-spectrum-textfield-border-color-keyboard-focus:var(
--spectrum-gray-900
);--system-spectrum-textfield-border-width:var(--spectrum-border-width-100)}:host,:root{--system-spectrum-search-border-radius:var(--spectrum-corner-radius-100);--system-spectrum-search-edge-to-visual:var(
--spectrum-component-edge-to-visual-100
);--system-spectrum-search-border-color-default:var(--spectrum-gray-500);--system-spectrum-search-border-color-hover:var(--spectrum-gray-600);--system-spectrum-search-border-color-focus:var(--spectrum-gray-800);--system-spectrum-search-border-color-focus-hover:var(--spectrum-gray-900);--system-spectrum-search-border-color-key-focus:var(--spectrum-gray-900);--system-spectrum-search-sizes-border-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-search-sizes-edge-to-visual:var(
--spectrum-component-edge-to-visual-75
);--system-spectrum-search-sizem-border-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-search-sizem-edge-to-visual:var(
--spectrum-component-edge-to-visual-100
);--system-spectrum-search-sizel-border-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-search-sizel-edge-to-visual:var(
--spectrum-component-edge-to-visual-200
);--system-spectrum-search-sizexl-border-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-search-sizexl-edge-to-visual:var(
--spectrum-component-edge-to-visual-300
)}:host,:root{--system-spectrum-tabs-font-weight:var(--spectrum-default-font-weight)}:host,:root{--system-spectrum-pickerbutton-spectrum-picker-button-background-color:var(
--spectrum-gray-75
);--system-spectrum-pickerbutton-spectrum-picker-button-background-color-hover:var(
--spectrum-gray-200
);--system-spectrum-pickerbutton-spectrum-picker-button-background-color-down:var(
--spectrum-gray-300
);--system-spectrum-pickerbutton-spectrum-picker-button-background-color-key-focus:var(
--spectrum-gray-200
);--system-spectrum-pickerbutton-spectrum-picker-button-border-color:inherit;--system-spectrum-pickerbutton-spectrum-picker-button-border-radius:var(
--spectrum-corner-radius-100
);--system-spectrum-pickerbutton-spectrum-picker-button-border-radius-rounded-sided:0;--system-spectrum-pickerbutton-spectrum-picker-button-border-radius-sided:0;--system-spectrum-pickerbutton-spectrum-picker-button-border-width:var(
--spectrum-border-width-100
)}:host,:root{--system:spectrum;--spectrum-animation-linear:cubic-bezier(0,0,1,1);--spectrum-animation-duration-0:0ms;--spectrum-animation-duration-100:130ms;--spectrum-animation-duration-200:160ms;--spectrum-animation-duration-300:190ms;--spectrum-animation-duration-400:220ms;--spectrum-animation-duration-500:250ms;--spectrum-animation-duration-600:300ms;--spectrum-animation-duration-700:350ms;--spectrum-animation-duration-800:400ms;--spectrum-animation-duration-900:450ms;--spectrum-animation-duration-1000:500ms;--spectrum-animation-duration-2000:1000ms;--spectrum-animation-duration-4000:2000ms;--spectrum-animation-duration-6000:3000ms;--spectrum-animation-ease-in-out:cubic-bezier(0.45,0,0.4,1);--spectrum-animation-ease-in:cubic-bezier(0.5,0,1,1);--spectrum-animation-ease-out:cubic-bezier(0,0,0.4,1);--spectrum-animation-ease-linear:cubic-bezier(0,0,1,1);--spectrum-sans-font-family-stack:adobe-clean,var(--spectrum-sans-serif-font-family),"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Trebuchet MS","Lucida Grande",sans-serif;--spectrum-sans-serif-font:var(--spectrum-sans-font-family-stack);--spectrum-serif-font-family-stack:adobe-clean-serif,var(--spectrum-serif-font-family),"Source Serif Pro",Georgia,serif;--spectrum-serif-font:var(--spectrum-serif-font-family-stack);--spectrum-code-font-family-stack:"Source Code Pro",Monaco,monospace;--spectrum-cjk-font-family-stack:adobe-clean-han-japanese,var(--spectrum-cjk-font-family),sans-serif;--spectrum-cjk-font:var(--spectrum-code-font-family-stack);--spectrum-docs-static-white-background-color-rgb:15,121,125;--spectrum-docs-static-white-background-color:rgba(var(--spectrum-docs-static-white-background-color-rgb));--spectrum-docs-static-black-background-color-rgb:206,247,243;--spectrum-docs-static-black-background-color:rgba(var(--spectrum-docs-static-black-background-color-rgb))}

/*!
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/:host,:root{--spectrum-font-family-ar:myriad-arabic,adobe-clean,"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Trebuchet MS","Lucida Grande",sans-serif;--spectrum-font-family-he:myriad-hebrew,adobe-clean,"Source Sans Pro",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Ubuntu,"Trebuchet MS","Lucida Grande",sans-serif;--spectrum-font-family:var(--spectrum-sans-font-family-stack);--spectrum-font-style:var(--spectrum-default-font-style);--spectrum-font-size:var(--spectrum-font-size-100);font-family:var(--spectrum-font-family);font-size:var(--spectrum-font-size);font-style:var(--spectrum-font-style)}.spectrum:lang(ar){font-family:var(--spectrum-font-family-ar)}.spectrum:lang(he){font-family:var(--spectrum-font-family-he)}.spectrum-Heading{--spectrum-heading-sans-serif-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-heading-serif-font-family:var(
--spectrum-serif-font-family-stack
);--spectrum-heading-cjk-font-family:var(--spectrum-cjk-font-family-stack);--spectrum-heading-cjk-letter-spacing:var(--spectrum-cjk-letter-spacing);--spectrum-heading-font-color:var(--spectrum-heading-color);--spectrum-heading-margin-start:calc(var(--mod-heading-font-size, var(--spectrum-heading-font-size))*var(--spectrum-heading-margin-top-multiplier));--spectrum-heading-margin-end:calc(var(--mod-heading-font-size, var(--spectrum-heading-font-size))*var(--spectrum-heading-margin-bottom-multiplier))}@media (forced-colors:active){.spectrum-Heading{--highcontrast-heading-font-color:Text}}.spectrum-Heading--sizeXXS{--spectrum-heading-font-size:var(--spectrum-heading-size-xxs);--spectrum-heading-cjk-font-size:var(--spectrum-heading-cjk-size-xxs)}.spectrum-Heading--sizeXS{--spectrum-heading-font-size:var(--spectrum-heading-size-xs);--spectrum-heading-cjk-font-size:var(--spectrum-heading-cjk-size-xs)}.spectrum-Heading--sizeS{--spectrum-heading-font-size:var(--spectrum-heading-size-s);--spectrum-heading-cjk-font-size:var(--spectrum-heading-cjk-size-s)}.spectrum-Heading--sizeM{--spectrum-heading-font-size:var(--spectrum-heading-size-m);--spectrum-heading-cjk-font-size:var(--spectrum-heading-cjk-size-m)}.spectrum-Heading--sizeL{--spectrum-heading-font-size:var(--spectrum-heading-size-l);--spectrum-heading-cjk-font-size:var(--spectrum-heading-cjk-size-l)}.spectrum-Heading--sizeXL{--spectrum-heading-font-size:var(--spectrum-heading-size-xl);--spectrum-heading-cjk-font-size:var(--spectrum-heading-cjk-size-xl)}.spectrum-Heading--sizeXXL{--spectrum-heading-font-size:var(--spectrum-heading-size-xxl);--spectrum-heading-cjk-font-size:var(--spectrum-heading-cjk-size-xxl)}.spectrum-Heading--sizeXXXL{--spectrum-heading-font-size:var(--spectrum-heading-size-xxxl);--spectrum-heading-cjk-font-size:var(--spectrum-heading-cjk-size-xxxl)}.spectrum-Heading{color:var(
--highcontrast-heading-font-color,var(--mod-heading-font-color,var(--spectrum-heading-font-color))
);font-family:var(
--mod-heading-sans-serif-font-family,var(--spectrum-heading-sans-serif-font-family)
);font-size:var(--mod-heading-font-size,var(--spectrum-heading-font-size));font-style:var(
--mod-heading-sans-serif-font-style,var(--spectrum-heading-sans-serif-font-style)
);font-weight:var(
--mod-heading-sans-serif-font-weight,var(--spectrum-heading-sans-serif-font-weight)
);line-height:var(
--mod-heading-line-height,var(--spectrum-heading-line-height)
);margin-block-end:0;margin-block-start:0}.spectrum-Heading .spectrum-Heading-strong,.spectrum-Heading strong{font-style:var(
--mod-heading-sans-serif-strong-font-style,var(--spectrum-heading-sans-serif-strong-font-style)
);font-weight:var(
--mod-heading-sans-serif-strong-font-weight,var(--spectrum-heading-sans-serif-strong-font-weight)
)}.spectrum-Heading .spectrum-Heading-emphasized,.spectrum-Heading em{font-style:var(
--mod-heading-sans-serif-emphasized-font-style,var(--spectrum-heading-sans-serif-emphasized-font-style)
);font-weight:var(
--mod-heading-sans-serif-emphasized-font-weight,var(--spectrum-heading-sans-serif-emphasized-font-weight)
)}.spectrum-Heading .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading em strong,.spectrum-Heading strong em{font-style:var(
--mod-heading-sans-serif-strong-emphasized-font-style,var(--spectrum-heading-sans-serif-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-sans-serif-strong-emphasized-font-weight,var(--spectrum-heading-sans-serif-strong-emphasized-font-weight)
)}.spectrum-Heading:lang(ja),.spectrum-Heading:lang(ko),.spectrum-Heading:lang(zh){font-family:var(
--mod-heading-cjk-font-family,var(--spectrum-heading-cjk-font-family)
);font-size:var(
--mod-heading-cjk-font-size,var(--spectrum-heading-cjk-font-size)
);font-style:var(
--mod-heading-cjk-font-style,var(--spectrum-heading-cjk-font-style)
);font-weight:var(
--mod-heading-cjk-font-weight,var(--spectrum-heading-cjk-font-weight)
);letter-spacing:var(
--mod-heading-cjk-letter-spacing,var(--spectrum-heading-cjk-letter-spacing)
);line-height:var(
--mod-heading-cjk-line-height,var(--spectrum-heading-cjk-line-height)
)}.spectrum-Heading:lang(ja) .spectrum-Heading-emphasized,.spectrum-Heading:lang(ja) em,.spectrum-Heading:lang(ko) .spectrum-Heading-emphasized,.spectrum-Heading:lang(ko) em,.spectrum-Heading:lang(zh) .spectrum-Heading-emphasized,.spectrum-Heading:lang(zh) em{font-style:var(
--mod-heading-cjk-emphasized-font-style,var(--spectrum-heading-cjk-emphasized-font-style)
);font-weight:var(
--mod-heading-cjk-emphasized-font-weight,var(--spectrum-heading-cjk-emphasized-font-weight)
)}.spectrum-Heading:lang(ja) .spectrum-Heading-strong,.spectrum-Heading:lang(ja) strong,.spectrum-Heading:lang(ko) .spectrum-Heading-strong,.spectrum-Heading:lang(ko) strong,.spectrum-Heading:lang(zh) .spectrum-Heading-strong,.spectrum-Heading:lang(zh) strong{font-style:var(
--mod-heading-cjk-strong-font-style,var(--spectrum-heading-cjk-strong-font-style)
);font-weight:var(
--mod-heading-cjk-strong-font-weight,var(--spectrum-heading-cjk-strong-font-weight)
)}.spectrum-Heading:lang(ja) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading:lang(ja) em strong,.spectrum-Heading:lang(ja) strong em,.spectrum-Heading:lang(ko) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading:lang(ko) em strong,.spectrum-Heading:lang(ko) strong em,.spectrum-Heading:lang(zh) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading:lang(zh) em strong,.spectrum-Heading:lang(zh) strong em{font-style:var(
--mod-heading-cjk-strong-emphasized-font-style,var(--spectrum-heading-cjk-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-cjk-strong-emphasized-font-weight,var(--spectrum-heading-cjk-strong-emphasized-font-weight)
)}.spectrum-Heading--heavy{font-style:var(
--mod-heading-sans-serif-heavy-font-style,var(--spectrum-heading-sans-serif-heavy-font-style)
);font-weight:var(
--mod-heading-sans-serif-heavy-font-weight,var(--spectrum-heading-sans-serif-heavy-font-weight)
)}.spectrum-Heading--heavy .spectrum-Heading-strong,.spectrum-Heading--heavy strong{font-style:var(
--mod-heading-sans-serif-heavy-strong-font-style,var(--spectrum-heading-sans-serif-heavy-strong-font-style)
);font-weight:var(
--mod-heading-sans-serif-heavy-strong-font-weight,var(--spectrum-heading-sans-serif-heavy-strong-font-weight)
)}.spectrum-Heading--heavy .spectrum-Heading-emphasized,.spectrum-Heading--heavy em{font-style:var(
--mod-heading-sans-serif-heavy-emphasized-font-style,var(--spectrum-heading-sans-serif-heavy-emphasized-font-style)
);font-weight:var(
--mod-heading-sans-serif-heavy-emphasized-font-weight,var(--spectrum-heading-sans-serif-heavy-emphasized-font-weight)
)}.spectrum-Heading--heavy .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--heavy em strong,.spectrum-Heading--heavy strong em{font-style:var(
--mod-heading-sans-serif-heavy-strong-emphasized-font-style,var(--spectrum-heading-sans-serif-heavy-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-sans-serif-heavy-strong-emphasized-font-weight,var(--spectrum-heading-sans-serif-heavy-strong-emphasized-font-weight)
)}.spectrum-Heading--heavy:lang(ja),.spectrum-Heading--heavy:lang(ko),.spectrum-Heading--heavy:lang(zh){font-style:var(
--mod-heading-cjk-heavy-font-style,var(--spectrum-heading-cjk-heavy-font-style)
);font-weight:var(
--mod-heading-cjk-heavy-font-weight,var(--spectrum-heading-cjk-heavy-font-weight)
)}.spectrum-Heading--heavy:lang(ja) .spectrum-Heading-emphasized,.spectrum-Heading--heavy:lang(ja) em,.spectrum-Heading--heavy:lang(ko) .spectrum-Heading-emphasized,.spectrum-Heading--heavy:lang(ko) em,.spectrum-Heading--heavy:lang(zh) .spectrum-Heading-emphasized,.spectrum-Heading--heavy:lang(zh) em{font-style:var(
--mod-heading-cjk-heavy-emphasized-font-style,var(--spectrum-heading-cjk-heavy-emphasized-font-style)
);font-weight:var(
--mod-heading-cjk-heavy-emphasized-font-weight,var(--spectrum-heading-cjk-heavy-emphasized-font-weight)
)}.spectrum-Heading--heavy:lang(ja) .spectrum-Heading-strong,.spectrum-Heading--heavy:lang(ja) strong,.spectrum-Heading--heavy:lang(ko) .spectrum-Heading-strong,.spectrum-Heading--heavy:lang(ko) strong,.spectrum-Heading--heavy:lang(zh) .spectrum-Heading-strong,.spectrum-Heading--heavy:lang(zh) strong{font-style:var(
--mod-heading-cjk-heavy-strong-font-style,var(--spectrum-heading-cjk-heavy-strong-font-style)
);font-weight:var(
--mod-heading-cjk-heavy-strong-font-weight,var(--spectrum-heading-cjk-heavy-strong-font-weight)
)}.spectrum-Heading--heavy:lang(ja) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--heavy:lang(ja) em strong,.spectrum-Heading--heavy:lang(ja) strong em,.spectrum-Heading--heavy:lang(ko) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--heavy:lang(ko) em strong,.spectrum-Heading--heavy:lang(ko) strong em,.spectrum-Heading--heavy:lang(zh) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--heavy:lang(zh) em strong,.spectrum-Heading--heavy:lang(zh) strong em{font-style:var(
--mod-heading-cjk-heavy-strong-emphasized-font-style,var(--spectrum-heading-cjk-heavy-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-cjk-heavy-strong-emphasized-font-weight,var(--spectrum-heading-cjk-heavy-strong-emphasized-font-weight)
)}.spectrum-Heading--light{font-style:var(
--mod-heading-sans-serif-light-font-style,var(--spectrum-heading-sans-serif-light-font-style)
);font-weight:var(
--mod-heading-sans-serif-light-font-weight,var(--spectrum-heading-sans-serif-light-font-weight)
)}.spectrum-Heading--light .spectrum-Heading-emphasized,.spectrum-Heading--light em{font-style:var(
--mod-heading-sans-serif-light-emphasized-font-style,var(--spectrum-heading-sans-serif-light-emphasized-font-style)
);font-weight:var(
--mod-heading-sans-serif-light-emphasized-font-weight,var(--spectrum-heading-sans-serif-light-emphasized-font-weight)
)}.spectrum-Heading--light .spectrum-Heading-strong,.spectrum-Heading--light strong{font-style:var(
--mod-heading-sans-serif-light-strong-font-style,var(--spectrum-heading-sans-serif-light-strong-font-style)
);font-weight:var(
--mod-heading-sans-serif-light-strong-font-weight,var(--spectrum-heading-sans-serif-light-strong-font-weight)
)}.spectrum-Heading--light .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--light em strong,.spectrum-Heading--light strong em{font-style:var(
--mod-heading-sans-serif-light-strong-emphasized-font-style,var(--spectrum-heading-sans-serif-light-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-sans-serif-light-strong-emphasized-font-weight,var(--spectrum-heading-sans-serif-light-strong-emphasized-font-weight)
)}.spectrum-Heading--light:lang(ja),.spectrum-Heading--light:lang(ko),.spectrum-Heading--light:lang(zh){font-style:var(
--mod-heading-cjk-light-font-style,var(--spectrum-heading-cjk-light-font-style)
);font-weight:var(
--mod-heading-cjk-light-font-weight,var(--spectrum-heading-cjk-light-font-weight)
)}.spectrum-Heading--light:lang(ja) .spectrum-Heading-strong,.spectrum-Heading--light:lang(ja) strong,.spectrum-Heading--light:lang(ko) .spectrum-Heading-strong,.spectrum-Heading--light:lang(ko) strong,.spectrum-Heading--light:lang(zh) .spectrum-Heading-strong,.spectrum-Heading--light:lang(zh) strong{font-style:var(
--mod-heading-cjk-light-strong-font-style,var(--spectrum-heading-cjk-light-strong-font-style)
);font-weight:var(
--mod-heading-cjk-light-strong-font-weight,var(--spectrum-heading-cjk-light-strong-font-weight)
)}.spectrum-Heading--light:lang(ja) .spectrum-Heading-emphasized,.spectrum-Heading--light:lang(ja) em,.spectrum-Heading--light:lang(ko) .spectrum-Heading-emphasized,.spectrum-Heading--light:lang(ko) em,.spectrum-Heading--light:lang(zh) .spectrum-Heading-emphasized,.spectrum-Heading--light:lang(zh) em{font-style:var(
--mod-heading-cjk-light-emphasized-font-style,var(--spectrum-heading-cjk-light-emphasized-font-style)
);font-weight:var(
--mod-heading-cjk-light-emphasized-font-weight,var(--spectrum-heading-cjk-light-emphasized-font-weight)
)}.spectrum-Heading--light:lang(ja) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--light:lang(ja) em strong,.spectrum-Heading--light:lang(ja) strong em,.spectrum-Heading--light:lang(ko) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--light:lang(ko) em strong,.spectrum-Heading--light:lang(ko) strong em,.spectrum-Heading--light:lang(zh) .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--light:lang(zh) em strong,.spectrum-Heading--light:lang(zh) strong em{font-style:var(
--mod-heading-cjk-light-strong-emphasized-font-style,var(--spectrum-heading-cjk-light-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-cjk-light-strong-emphasized-font-weight,var(--spectrum-heading-cjk-light-strong-emphasized-font-weight)
)}.spectrum-Heading--serif{font-family:var(
--mod-heading-serif-font-family,var(--spectrum-heading-serif-font-family)
);font-style:var(
--mod-heading-serif-font-style,var(--spectrum-heading-serif-font-style)
);font-weight:var(
--mod-heading-serif-font-weight,var(--spectrum-heading-serif-font-weight)
)}.spectrum-Heading--serif .spectrum-Heading-emphasized,.spectrum-Heading--serif em{font-style:var(
--mod-heading-serif-emphasized-font-style,var(--spectrum-heading-serif-emphasized-font-style)
);font-weight:var(
--mod-heading-serif-emphasized-font-weight,var(--spectrum-heading-serif-emphasized-font-weight)
)}.spectrum-Heading--serif .spectrum-Heading-strong,.spectrum-Heading--serif strong{font-style:var(
--mod-heading-serif-strong-font-style,var(--spectrum-heading-serif-strong-font-style)
);font-weight:var(
--mod-heading-serif-strong-font-weight,var(--spectrum-heading-serif-strong-font-weight)
)}.spectrum-Heading--serif .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--serif em strong,.spectrum-Heading--serif strong em{font-style:var(
--mod-heading-serif-strong-emphasized-font-style,var(--spectrum-heading-serif-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-serif-strong-emphasized-font-weight,var(--spectrum-heading-serif-strong-emphasized-font-weight)
)}.spectrum-Heading--serif.spectrum-Heading--heavy{font-style:var(
--mod-heading-serif-heavy-font-style,var(--spectrum-heading-serif-heavy-font-style)
);font-weight:var(
--mod-heading-serif-heavy-font-weight,var(--spectrum-heading-serif-heavy-font-weight)
)}.spectrum-Heading--serif.spectrum-Heading--heavy .spectrum-Heading-strong,.spectrum-Heading--serif.spectrum-Heading--heavy strong{font-style:var(
--mod-heading-serif-heavy-strong-font-style,var(--spectrum-heading-serif-heavy-strong-font-style)
);font-weight:var(
--mod-heading-serif-heavy-strong-font-weight,var(--spectrum-heading-serif-heavy-strong-font-weight)
)}.spectrum-Heading--serif.spectrum-Heading--heavy .spectrum-Heading-emphasized,.spectrum-Heading--serif.spectrum-Heading--heavy em{font-style:var(
--mod-heading-serif-heavy-emphasized-font-style,var(--spectrum-heading-serif-heavy-emphasized-font-style)
);font-weight:var(
--mod-heading-serif-heavy-emphasized-font-weight,var(--spectrum-heading-serif-heavy-emphasized-font-weight)
)}.spectrum-Heading--serif.spectrum-Heading--heavy .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--serif.spectrum-Heading--heavy em strong,.spectrum-Heading--serif.spectrum-Heading--heavy strong em{font-style:var(
--mod-heading-serif-heavy-strong-emphasized-font-style,var(--spectrum-heading-serif-heavy-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-serif-heavy-strong-emphasized-font-weight,var(--spectrum-heading-serif-heavy-strong-emphasized-font-weight)
)}.spectrum-Heading--serif.spectrum-Heading--light{font-style:var(
--mod-heading-serif-light-font-style,var(--spectrum-heading-serif-light-font-style)
);font-weight:var(
--mod-heading-serif-light-font-weight,var(--spectrum-heading-serif-light-font-weight)
)}.spectrum-Heading--serif.spectrum-Heading--light .spectrum-Heading-emphasized,.spectrum-Heading--serif.spectrum-Heading--light em{font-style:var(
--mod-heading-serif-light-emphasized-font-style,var(--spectrum-heading-serif-light-emphasized-font-style)
);font-weight:var(
--mod-heading-serif-light-emphasized-font-weight,var(--spectrum-heading-serif-light-emphasized-font-weight)
)}.spectrum-Heading--serif.spectrum-Heading--light .spectrum-Heading-strong,.spectrum-Heading--serif.spectrum-Heading--light strong{font-style:var(
--mod-heading-serif-light-strong-font-style,var(--spectrum-heading-serif-light-strong-font-style)
);font-weight:var(
--mod-heading-serif-light-strong-font-weight,var(--spectrum-heading-serif-light-strong-font-weight)
)}.spectrum-Heading--serif.spectrum-Heading--light .spectrum-Heading-strong.spectrum-Heading-emphasized,.spectrum-Heading--serif.spectrum-Heading--light em strong,.spectrum-Heading--serif.spectrum-Heading--light strong em{font-style:var(
--mod-heading-serif-light-strong-emphasized-font-style,var(--spectrum-heading-serif-light-strong-emphasized-font-style)
);font-weight:var(
--mod-heading-serif-light-strong-emphasized-font-weight,var(--spectrum-heading-serif-light-strong-emphasized-font-weight)
)}.spectrum-Typography .spectrum-Heading{margin-block-end:var(
--mod-heading-margin-end,var(--spectrum-heading-margin-end)
);margin-block-start:var(
--mod-heading-margin-start,var(--spectrum-heading-margin-start)
)}.spectrum-Body{--spectrum-body-sans-serif-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-body-serif-font-family:var(--spectrum-serif-font-family-stack);--spectrum-body-cjk-font-family:var(--spectrum-cjk-font-family-stack);--spectrum-body-cjk-letter-spacing:var(--spectrum-cjk-letter-spacing);--spectrum-body-margin:calc(var(--mod-body-font-size, var(--spectrum-body-font-size))*var(--spectrum-body-margin-multiplier));--spectrum-body-font-color:var(--spectrum-body-color)}@media (forced-colors:active){.spectrum-Body{--highcontrast-body-font-color:Text}}.spectrum-Body--sizeXS{--spectrum-body-font-size:var(--spectrum-body-size-xs)}.spectrum-Body--sizeS{--spectrum-body-font-size:var(--spectrum-body-size-s)}.spectrum-Body--sizeM{--spectrum-body-font-size:var(--spectrum-body-size-m)}.spectrum-Body--sizeL{--spectrum-body-font-size:var(--spectrum-body-size-l)}.spectrum-Body--sizeXL{--spectrum-body-font-size:var(--spectrum-body-size-xl)}.spectrum-Body--sizeXXL{--spectrum-body-font-size:var(--spectrum-body-size-xxl)}.spectrum-Body--sizeXXXL{--spectrum-body-font-size:var(--spectrum-body-size-xxxl)}.spectrum-Body{color:var(
--highcontrast-body-font-color,var(--mod-body-font-color,var(--spectrum-body-font-color))
);font-family:var(
--mod-body-sans-serif-font-family,var(--spectrum-body-sans-serif-font-family)
);font-size:var(--mod-body-font-size,var(--spectrum-body-font-size));font-style:var(
--mod-body-sans-serif-font-style,var(--spectrum-body-sans-serif-font-style)
);font-weight:var(
--mod-body-sans-serif-font-weight,var(--spectrum-body-sans-serif-font-weight)
);line-height:var(--mod-body-line-height,var(--spectrum-body-line-height));margin-block-end:0;margin-block-start:0}.spectrum-Body .spectrum-Body-strong,.spectrum-Body strong{font-style:var(
--mod-body-sans-serif-strong-font-style,var(--spectrum-body-sans-serif-strong-font-style)
);font-weight:var(
--mod-body-sans-serif-strong-font-weight,var(--spectrum-body-sans-serif-strong-font-weight)
)}.spectrum-Body .spectrum-Body-emphasized,.spectrum-Body em{font-style:var(
--mod-body-sans-serif-emphasized-font-style,var(--spectrum-body-sans-serif-emphasized-font-style)
);font-weight:var(
--mod-body-sans-serif-emphasized-font-weight,var(--spectrum-body-sans-serif-emphasized-font-weight)
)}.spectrum-Body .spectrum-Body-strong.spectrum-Body-emphasized,.spectrum-Body em strong,.spectrum-Body strong em{font-style:var(
--mod-body-sans-serif-strong-emphasized-font-style,var(--spectrum-body-sans-serif-strong-emphasized-font-style)
);font-weight:var(
--mod-body-sans-serif-strong-emphasized-font-weight,var(--spectrum-body-sans-serif-strong-emphasized-font-weight)
)}.spectrum-Body:lang(ja),.spectrum-Body:lang(ko),.spectrum-Body:lang(zh){font-family:var(
--mod-body-cjk-font-family,var(--spectrum-body-cjk-font-family)
);font-style:var(
--mod-body-cjk-font-style,var(--spectrum-body-cjk-font-style)
);font-weight:var(
--mod-body-cjk-font-weight,var(--spectrum-body-cjk-font-weight)
);letter-spacing:var(
--mod-body-cjk-letter-spacing,var(--spectrum-body-cjk-letter-spacing)
);line-height:var(
--mod-body-cjk-line-height,var(--spectrum-body-cjk-line-height)
)}.spectrum-Body:lang(ja) .spectrum-Body-strong,.spectrum-Body:lang(ja) strong,.spectrum-Body:lang(ko) .spectrum-Body-strong,.spectrum-Body:lang(ko) strong,.spectrum-Body:lang(zh) .spectrum-Body-strong,.spectrum-Body:lang(zh) strong{font-style:var(
--mod-body-cjk-strong-font-style,var(--spectrum-body-cjk-strong-font-style)
);font-weight:var(
--mod-body-cjk-strong-font-weight,var(--spectrum-body-cjk-strong-font-weight)
)}.spectrum-Body:lang(ja) .spectrum-Body-emphasized,.spectrum-Body:lang(ja) em,.spectrum-Body:lang(ko) .spectrum-Body-emphasized,.spectrum-Body:lang(ko) em,.spectrum-Body:lang(zh) .spectrum-Body-emphasized,.spectrum-Body:lang(zh) em{font-style:var(
--mod-body-cjk-emphasized-font-style,var(--spectrum-body-cjk-emphasized-font-style)
);font-weight:var(
--mod-body-cjk-emphasized-font-weight,var(--spectrum-body-cjk-emphasized-font-weight)
)}.spectrum-Body:lang(ja) .spectrum-Body-strong.spectrum-Body-emphasized,.spectrum-Body:lang(ja) em strong,.spectrum-Body:lang(ja) strong em,.spectrum-Body:lang(ko) .spectrum-Body-strong.spectrum-Body-emphasized,.spectrum-Body:lang(ko) em strong,.spectrum-Body:lang(ko) strong em,.spectrum-Body:lang(zh) .spectrum-Body-strong.spectrum-Body-emphasized,.spectrum-Body:lang(zh) em strong,.spectrum-Body:lang(zh) strong em{font-style:var(
--mod-body-cjk-strong-emphasized-font-style,var(--spectrum-body-cjk-strong-emphasized-font-style)
);font-weight:var(
--mod-body-cjk-strong-emphasized-font-weight,var(--spectrum-body-cjk-strong-emphasized-font-weight)
)}.spectrum-Body--serif{font-family:var(
--mod-body-serif-font-family,var(--spectrum-body-serif-font-family)
);font-style:var(
--mod-body-serif-font-style,var(--spectrum-body-serif-font-style)
);font-weight:var(
--mod-body-serif-font-weight,var(--spectrum-body-serif-font-weight)
)}.spectrum-Body--serif .spectrum-Body-strong,.spectrum-Body--serif strong{font-style:var(
--mod-body-serif-strong-font-style,var(--spectrum-body-serif-strong-font-style)
);font-weight:var(
--mod-body-serif-strong-font-weight,var(--spectrum-body-serif-strong-font-weight)
)}.spectrum-Body--serif .spectrum-Body-emphasized,.spectrum-Body--serif em{font-style:var(
--mod-body-serif-emphasized-font-style,var(--spectrum-body-serif-emphasized-font-style)
);font-weight:var(
--mod-body-serif-emphasized-font-weight,var(--spectrum-body-serif-emphasized-font-weight)
)}.spectrum-Body--serif .spectrum-Body-strong.spectrum-Body-emphasized,.spectrum-Body--serif em strong,.spectrum-Body--serif strong em{font-style:var(
--mod-body-serif-strong-emphasized-font-style,var(--spectrum-body-serif-strong-emphasized-font-style)
);font-weight:var(
--mod-body-serif-strong-emphasized-font-weight,var(--spectrum-body-serif-strong-emphasized-font-weight)
)}.spectrum-Typography .spectrum-Body{margin-block-end:var(--mod-body-margin,var(--spectrum-body-margin))}.spectrum-Detail{--spectrum-detail-sans-serif-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-detail-serif-font-family:var(
--spectrum-serif-font-family-stack
);--spectrum-detail-cjk-font-family:var(--spectrum-cjk-font-family-stack);--spectrum-detail-margin-start:calc(var(--mod-detail-font-size, var(--spectrum-detail-font-size))*var(--spectrum-detail-margin-top-multiplier));--spectrum-detail-margin-end:calc(var(--mod-detail-font-size, var(--spectrum-detail-font-size))*var(--spectrum-detail-margin-bottom-multiplier));--spectrum-detail-font-color:var(--spectrum-detail-color)}@media (forced-colors:active){.spectrum-Detail{--highcontrast-detail-font-color:Text}}.spectrum-Detail--sizeS{--spectrum-detail-font-size:var(--spectrum-detail-size-s)}.spectrum-Detail--sizeM{--spectrum-detail-font-size:var(--spectrum-detail-size-m)}.spectrum-Detail--sizeL{--spectrum-detail-font-size:var(--spectrum-detail-size-l)}.spectrum-Detail--sizeXL{--spectrum-detail-font-size:var(--spectrum-detail-size-xl)}.spectrum-Detail{color:var(
--highcontrast-detail-font-color,var(--mod-detail-font-color,var(--spectrum-detail-font-color))
);font-family:var(
--mod-detail-sans-serif-font-family,var(--spectrum-detail-sans-serif-font-family)
);font-size:var(--mod-detail-font-size,var(--spectrum-detail-font-size));font-style:var(
--mod-detail-sans-serif-font-style,var(--spectrum-detail-sans-serif-font-style)
);font-weight:var(
--mod-detail-sans-serif-font-weight,var(--spectrum-detail-sans-serif-font-weight)
);letter-spacing:var(
--mod-detail-letter-spacing,var(--spectrum-detail-letter-spacing)
);line-height:var(
--mod-detail-line-height,var(--spectrum-detail-line-height)
);margin-block-end:0;margin-block-start:0;text-transform:uppercase}.spectrum-Detail .spectrum-Detail-strong,.spectrum-Detail strong{font-style:var(
--mod-detail-sans-serif-strong-font-style,var(--spectrum-detail-sans-serif-strong-font-style)
);font-weight:var(
--mod-detail-sans-serif-strong-font-weight,var(--spectrum-detail-sans-serif-strong-font-weight)
)}.spectrum-Detail .spectrum-Detail-emphasized,.spectrum-Detail em{font-style:var(
--mod-detail-sans-serif-emphasized-font-style,var(--spectrum-detail-sans-serif-emphasized-font-style)
);font-weight:var(
--mod-detail-sans-serif-emphasized-font-weight,var(--spectrum-detail-sans-serif-emphasized-font-weight)
)}.spectrum-Detail .spectrum-Detail-strong.spectrum-Detail-emphasized,.spectrum-Detail em strong,.spectrum-Detail strong em{font-style:var(
--mod-detail-sans-serif-strong-emphasized-font-style,var(--spectrum-detail-sans-serif-strong-emphasized-font-style)
);font-weight:var(
--mod-detail-sans-serif-strong-emphasized-font-weight,var(--spectrum-detail-sans-serif-strong-emphasized-font-weight)
)}.spectrum-Detail:lang(ja),.spectrum-Detail:lang(ko),.spectrum-Detail:lang(zh){font-family:var(
--mod-detail-cjk-font-family,var(--spectrum-detail-cjk-font-family)
);font-style:var(
--mod-detail-cjk-font-style,var(--spectrum-detail-cjk-font-style)
);font-weight:var(
--mod-detail-cjk-font-weight,var(--spectrum-detail-cjk-font-weight)
);line-height:var(
--mod-detail-cjk-line-height,var(--spectrum-detail-cjk-line-height)
)}.spectrum-Detail:lang(ja) .spectrum-Detail-strong,.spectrum-Detail:lang(ja) strong,.spectrum-Detail:lang(ko) .spectrum-Detail-strong,.spectrum-Detail:lang(ko) strong,.spectrum-Detail:lang(zh) .spectrum-Detail-strong,.spectrum-Detail:lang(zh) strong{font-style:var(
--mod-detail-cjk-strong-font-style,var(--spectrum-detail-cjk-strong-font-style)
);font-weight:var(
--mod-detail-cjk-strong-font-weight,var(--spectrum-detail-cjk-strong-font-weight)
)}.spectrum-Detail:lang(ja) .spectrum-Detail-emphasized,.spectrum-Detail:lang(ja) em,.spectrum-Detail:lang(ko) .spectrum-Detail-emphasized,.spectrum-Detail:lang(ko) em,.spectrum-Detail:lang(zh) .spectrum-Detail-emphasized,.spectrum-Detail:lang(zh) em{font-style:var(
--mod-detail-cjk-emphasized-font-style,var(--spectrum-detail-cjk-emphasized-font-style)
);font-weight:var(
--mod-detail-cjk-emphasized-font-weight,var(--spectrum-detail-cjk-emphasized-font-weight)
)}.spectrum-Detail:lang(ja) .spectrum-Detail-strong.spectrum-Detail-emphasized,.spectrum-Detail:lang(ja) em strong,.spectrum-Detail:lang(ja) strong em,.spectrum-Detail:lang(ko) .spectrum-Detail-strong.spectrum-Detail-emphasized,.spectrum-Detail:lang(ko) em strong,.spectrum-Detail:lang(ko) strong em,.spectrum-Detail:lang(zh) .spectrum-Detail-strong.spectrum-Detail-emphasized,.spectrum-Detail:lang(zh) em strong,.spectrum-Detail:lang(zh) strong em{font-style:var(
--mod-detail-cjk-strong-emphasized-font-style,var(--spectrum-detail-cjk-strong-emphasized-font-style)
);font-weight:var(
--mod-detail-cjk-strong-emphasized-font-weight,var(--spectrum-detail-cjk-strong-emphasized-font-weight)
)}.spectrum-Detail--serif{font-family:var(
--mod-detail-serif-font-family,var(--spectrum-detail-serif-font-family)
);font-style:var(
--mod-detail-serif-font-style,var(--spectrum-detail-serif-font-style)
);font-weight:var(
--mod-detail-serif-font-weight,var(--spectrum-detail-serif-font-weight)
)}.spectrum-Detail--serif .spectrum-Detail-strong,.spectrum-Detail--serif strong{font-style:var(
--mod-detail-serif-strong-font-style,var(--spectrum-detail-serif-strong-font-style)
);font-weight:var(
--mod-detail-serif-strong-font-weight,var(--spectrum-detail-serif-strong-font-weight)
)}.spectrum-Detail--serif .spectrum-Detail-emphasized,.spectrum-Detail--serif em{font-style:var(
--mod-detail-serif-emphasized-font-style,var(--spectrum-detail-serif-emphasized-font-style)
);font-weight:var(
--mod-detail-serif-emphasized-font-weight,var(--spectrum-detail-serif-emphasized-font-weight)
)}.spectrum-Detail--serif .spectrum-Detail-strong.spectrum-Detail-emphasized,.spectrum-Detail--serif em strong,.spectrum-Detail--serif strong em{font-style:var(
--mod-detail-serif-strong-emphasized-font-style,var(--spectrum-detail-serif-strong-emphasized-font-style)
);font-weight:var(
--mod-detail-serif-strong-emphasized-font-weight,var(--spectrum-detail-serif-strong-emphasized-font-weight)
)}.spectrum-Detail--light{font-style:var(
--mod-detail-sans-serif-light-font-style,var(--spectrum-detail-sans-serif-light-font-style)
);font-weight:var(
--spectrum-detail-sans-serif-light-font-weight,var(--spectrum-detail-sans-serif-light-font-weight)
)}.spectrum-Detail--light .spectrum-Detail-strong,.spectrum-Detail--light strong{font-style:var(
--mod-detail-sans-serif-light-strong-font-style,var(--spectrum-detail-sans-serif-light-strong-font-style)
);font-weight:var(
--mod-detail-sans-serif-light-strong-font-weight,var(--spectrum-detail-sans-serif-light-strong-font-weight)
)}.spectrum-Detail--light .spectrum-Detail-emphasized,.spectrum-Detail--light em{font-style:var(
--mod-detail-sans-serif-light-emphasized-font-style,var(--spectrum-detail-sans-serif-light-emphasized-font-style)
);font-weight:var(
--mod-detail-sans-serif-light-emphasized-font-weight,var(--spectrum-detail-sans-serif-light-emphasized-font-weight)
)}.spectrum-Detail--light .spectrum-Detail-strong.spectrum-Body-emphasized,.spectrum-Detail--light em strong,.spectrum-Detail--light strong em{font-style:var(
--mod-detail-sans-serif-light-strong-emphasized-font-style,var(--spectrum-detail-sans-serif-light-strong-emphasized-font-style)
);font-weight:var(
--mod-detail-sans-serif-light-strong-emphasized-font-weight,var(--spectrum-detail-sans-serif-light-strong-emphasized-font-weight)
)}.spectrum-Detail--light:lang(ja),.spectrum-Detail--light:lang(ko),.spectrum-Detail--light:lang(zh){font-style:var(
--mod-detail-cjk-light-font-style,var(--spectrum-detail-cjk-light-font-style)
);font-weight:var(
--mod-detail-cjk-light-font-weight,var(--spectrum-detail-cjk-light-font-weight)
)}.spectrum-Detail--light:lang(ja) .spectrum-Detail-strong,.spectrum-Detail--light:lang(ja) strong,.spectrum-Detail--light:lang(ko) .spectrum-Detail-strong,.spectrum-Detail--light:lang(ko) strong,.spectrum-Detail--light:lang(zh) .spectrum-Detail-strong,.spectrum-Detail--light:lang(zh) strong{font-style:var(
--mod-detail-cjk-light-strong-font-style,var(--spectrum-detail-cjk-light-strong-font-style)
);font-weight:var(
--mod-detail-cjk-light-strong-font-weight,var(--spectrum-detail-cjk-light-strong-font-weight)
)}.spectrum-Detail--light:lang(ja) .spectrum-Detail-emphasized,.spectrum-Detail--light:lang(ja) em,.spectrum-Detail--light:lang(ko) .spectrum-Detail-emphasized,.spectrum-Detail--light:lang(ko) em,.spectrum-Detail--light:lang(zh) .spectrum-Detail-emphasized,.spectrum-Detail--light:lang(zh) em{font-style:var(
--mod-detail-cjk-light-emphasized-font-style,var(--spectrum-detail-cjk-light-emphasized-font-style)
);font-weight:var(
--mod-detail-cjk-light-emphasized-font-weight,var(--spectrum-detail-cjk-light-emphasized-font-weight)
)}.spectrum-Detail--light:lang(ja) .spectrum-Detail-strong.spectrum-Detail-emphasized,.spectrum-Detail--light:lang(ko) .spectrum-Detail-strong.spectrum-Detail-emphasized,.spectrum-Detail--light:lang(zh) .spectrum-Detail-strong.spectrum-Detail-emphasized{font-style:var(
--mod-detail-cjk-light-strong-emphasized-font-style,var(--spectrum-detail-cjk-light-strong-emphasized-font-style)
);font-weight:var(
--mod-detail-cjk-light-strong-emphasized-font-weight,var(--spectrum-detail-cjk-light-strong-emphasized-font-weight)
)}.spectrum-Detail--serif.spectrum-Detail--light{font-style:var(
--mod-detail-serif-light-font-style,var(--spectrum-detail-serif-light-font-style)
);font-weight:var(
--mod-detail-serif-light-font-weight,var(--spectrum-detail-serif-light-font-weight)
)}.spectrum-Detail--serif.spectrum-Detail--light .spectrum-Detail-strong,.spectrum-Detail--serif.spectrum-Detail--light strong{font-style:var(
--mod-detail-serif-light-strong-font-style,var(--spectrum-detail-serif-light-strong-font-style)
);font-weight:var(
--mod-detail-serif-light-strong-font-weight,var(--spectrum-detail-serif-light-strong-font-weight)
)}.spectrum-Detail--serif.spectrum-Detail--light .spectrum-Detail-emphasized,.spectrum-Detail--serif.spectrum-Detail--light em{font-style:var(
--mod-detail-serif-light-emphasized-font-style,var(--spectrum-detail-serif-light-emphasized-font-style)
);font-weight:var(
--mod-detail-serif-light-emphasized-font-weight,var(--spectrum-detail-serif-light-emphasized-font-weight)
)}.spectrum-Detail--serif.spectrum-Detail--light .spectrum-Detail-strong.spectrum-Body-emphasized,.spectrum-Detail--serif.spectrum-Detail--light em strong,.spectrum-Detail--serif.spectrum-Detail--light strong em{font-style:var(
--mod-detail-serif-light-strong-emphasized-font-style,var(--spectrum-detail-serif-light-strong-emphasized-font-style)
);font-weight:var(
--mod-detail-serif-light-strong-emphasized-font-weight,var(--spectrum-detail-serif-light-strong-emphasized-font-weight)
)}.spectrum-Typography .spectrum-Detail{margin-block-end:var(
--mod-detail-margin-end,var(--spectrum-detail-margin-end)
);margin-block-start:var(
--mod-detail-margin-start,var(--spectrum-detail-margin-start)
)}.spectrum-Code{--spectrum-code-font-family:var(--spectrum-code-font-family-stack);--spectrum-code-cjk-letter-spacing:var(--spectrum-cjk-letter-spacing);--spectrum-code-font-color:var(--spectrum-code-color)}@media (forced-colors:active){.spectrum-Code{--highcontrast-code-font-color:Text}}.spectrum-Code--sizeXS{--spectrum-code-font-size:var(--spectrum-code-size-xs)}.spectrum-Code--sizeS{--spectrum-code-font-size:var(--spectrum-code-size-s)}.spectrum-Code--sizeM{--spectrum-code-font-size:var(--spectrum-code-size-m)}.spectrum-Code--sizeL{--spectrum-code-font-size:var(--spectrum-code-size-l)}.spectrum-Code--sizeXL{--spectrum-code-font-size:var(--spectrum-code-size-xl)}.spectrum-Code{color:var(
--highcontrast-code-font-color,var(--mod-code-font-color,var(--spectrum-code-font-color))
);font-family:var(--mod-code-font-family,var(--spectrum-code-font-family));font-size:var(--mod-code-font-size,var(--spectrum-code-font-size));font-style:var(--mod-code-font-style,var(--spectrum-code-font-style));font-weight:var(--mod-code-font-weight,var(--spectrum-code-font-weight));line-height:var(--mod-code-line-height,var(--spectrum-code-line-height));margin-block-end:0;margin-block-start:0}.spectrum-Code .spectrum-Code-strong,.spectrum-Code strong{font-style:var(
--mod-code-strong-font-style,var(--spectrum-code-strong-font-style)
);font-weight:var(
--mod-code-strong-font-weight,var(--spectrum-code-strong-font-weight)
)}.spectrum-Code .spectrum-Code-emphasized,.spectrum-Code em{font-style:var(
--mod-code-emphasized-font-style,var(--spectrum-code-emphasized-font-style)
);font-weight:var(
--mod-code-emphasized-font-weight,var(--spectrum-code-emphasized-font-weight)
)}.spectrum-Code .spectrum-Code-strong.spectrum-Code-emphasized,.spectrum-Code em strong,.spectrum-Code strong em{font-style:var(
--mod-code-strong-emphasized-font-style,var(--spectrum-code-strong-emphasized-font-style)
);font-weight:var(
--mod-code-strong-emphasized-font-weight,var(--spectrum-code-strong-emphasized-font-weight)
)}.spectrum-Code:lang(ja),.spectrum-Code:lang(ko),.spectrum-Code:lang(zh){font-family:var(
--mod-code-cjk-font-family,var(--spectrum-code-cjk-font-family)
);font-style:var(
--mod-code-cjk-font-style,var(--spectrum-code-cjk-font-style)
);font-weight:var(
--mod-code-cjk-font-weight,var(--spectrum-code-cjk-font-weight)
);letter-spacing:var(
--mod-code-cjk-letter-spacing,var(--spectrum-code-cjk-letter-spacing)
);line-height:var(
--mod-code-cjk-line-height,var(--spectrum-code-cjk-line-height)
)}.spectrum-Code:lang(ja) .spectrum-Code-strong,.spectrum-Code:lang(ja) strong,.spectrum-Code:lang(ko) .spectrum-Code-strong,.spectrum-Code:lang(ko) strong,.spectrum-Code:lang(zh) .spectrum-Code-strong,.spectrum-Code:lang(zh) strong{font-style:var(
--mod-code-cjk-strong-font-style,var(--spectrum-code-cjk-strong-font-style)
);font-weight:var(
--mod-code-cjk-strong-font-weight,var(--spectrum-code-cjk-strong-font-weight)
)}.spectrum-Code:lang(ja) .spectrum-Code-emphasized,.spectrum-Code:lang(ja) em,.spectrum-Code:lang(ko) .spectrum-Code-emphasized,.spectrum-Code:lang(ko) em,.spectrum-Code:lang(zh) .spectrum-Code-emphasized,.spectrum-Code:lang(zh) em{font-style:var(
--mod-code-cjk-emphasized-font-style,var(--spectrum-code-cjk-emphasized-font-style)
);font-weight:var(
--mod-code-cjk-emphasized-font-weight,var(--spectrum-code-cjk-emphasized-font-weight)
)}.spectrum-Code:lang(ja) .spectrum-Code-strong.spectrum-Code-emphasized,.spectrum-Code:lang(ja) em strong,.spectrum-Code:lang(ja) strong em,.spectrum-Code:lang(ko) .spectrum-Code-strong.spectrum-Code-emphasized,.spectrum-Code:lang(ko) em strong,.spectrum-Code:lang(ko) strong em,.spectrum-Code:lang(zh) .spectrum-Code-strong.spectrum-Code-emphasized,.spectrum-Code:lang(zh) em strong,.spectrum-Code:lang(zh) strong em{font-style:var(
--mod-code-cjk-strong-emphasized-font-style,var(--spectrum-code-cjk-strong-emphasized-font-style)
);font-weight:var(
--mod-code-cjk-strong-emphasized-font-weight,var(--spectrum-code-cjk-strong-emphasized-font-weight)
)}:host{display:block}#scale,#theme{height:100%;width:100%}
`,To=Ga;jt.registerThemeFragment("spectrum","theme",To);jt.registerThemeFragment("light","color",Io);h();var Xa=i.css`
:host,:root{--spectrum-global-dimension-scale-factor:1;--spectrum-global-dimension-size-0:0px;--spectrum-global-dimension-size-10:1px;--spectrum-global-dimension-size-25:2px;--spectrum-global-dimension-size-30:2px;--spectrum-global-dimension-size-40:3px;--spectrum-global-dimension-size-50:4px;--spectrum-global-dimension-size-65:5px;--spectrum-global-dimension-size-75:6px;--spectrum-global-dimension-size-85:7px;--spectrum-global-dimension-size-100:8px;--spectrum-global-dimension-size-115:9px;--spectrum-global-dimension-size-125:10px;--spectrum-global-dimension-size-130:11px;--spectrum-global-dimension-size-150:12px;--spectrum-global-dimension-size-160:13px;--spectrum-global-dimension-size-175:14px;--spectrum-global-dimension-size-185:15px;--spectrum-global-dimension-size-200:16px;--spectrum-global-dimension-size-225:18px;--spectrum-global-dimension-size-250:20px;--spectrum-global-dimension-size-275:22px;--spectrum-global-dimension-size-300:24px;--spectrum-global-dimension-size-325:26px;--spectrum-global-dimension-size-350:28px;--spectrum-global-dimension-size-400:32px;--spectrum-global-dimension-size-450:36px;--spectrum-global-dimension-size-500:40px;--spectrum-global-dimension-size-550:44px;--spectrum-global-dimension-size-600:48px;--spectrum-global-dimension-size-650:52px;--spectrum-global-dimension-size-675:54px;--spectrum-global-dimension-size-700:56px;--spectrum-global-dimension-size-750:60px;--spectrum-global-dimension-size-800:64px;--spectrum-global-dimension-size-900:72px;--spectrum-global-dimension-size-1000:80px;--spectrum-global-dimension-size-1125:90px;--spectrum-global-dimension-size-1200:96px;--spectrum-global-dimension-size-1250:100px;--spectrum-global-dimension-size-1600:128px;--spectrum-global-dimension-size-1700:136px;--spectrum-global-dimension-size-1800:144px;--spectrum-global-dimension-size-2000:160px;--spectrum-global-dimension-size-2400:192px;--spectrum-global-dimension-size-2500:200px;--spectrum-global-dimension-size-3000:240px;--spectrum-global-dimension-size-3400:272px;--spectrum-global-dimension-size-3600:288px;--spectrum-global-dimension-size-4600:368px;--spectrum-global-dimension-size-5000:400px;--spectrum-global-dimension-size-6000:480px;--spectrum-global-dimension-font-size-25:10px;--spectrum-global-dimension-font-size-50:11px;--spectrum-global-dimension-font-size-75:12px;--spectrum-global-dimension-font-size-100:14px;--spectrum-global-dimension-font-size-150:15px;--spectrum-global-dimension-font-size-200:16px;--spectrum-global-dimension-font-size-300:18px;--spectrum-global-dimension-font-size-400:20px;--spectrum-global-dimension-font-size-500:22px;--spectrum-global-dimension-font-size-600:25px;--spectrum-global-dimension-font-size-700:28px;--spectrum-global-dimension-font-size-800:32px;--spectrum-global-dimension-font-size-900:36px;--spectrum-global-dimension-font-size-1000:40px;--spectrum-global-dimension-font-size-1100:45px;--spectrum-global-dimension-font-size-1200:50px;--spectrum-global-dimension-font-size-1300:60px;--spectrum-alias-item-text-padding-top-l:var(
--spectrum-global-dimension-size-115
);--spectrum-alias-item-text-padding-bottom-s:var(
--spectrum-global-dimension-static-size-65
);--spectrum-alias-item-workflow-padding-left-m:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-rounded-workflow-padding-left-m:var(
--spectrum-global-dimension-size-175
);--spectrum-alias-item-rounded-workflow-padding-left-xl:21px;--spectrum-alias-item-mark-padding-top-m:var(
--spectrum-global-dimension-static-size-75
);--spectrum-alias-item-mark-padding-bottom-m:var(
--spectrum-global-dimension-static-size-75
);--spectrum-alias-item-mark-padding-left-m:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-control-1-size-l:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-control-1-size-xl:var(
--spectrum-global-dimension-size-125
);--spectrum-alias-item-control-2-size-s:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-item-control-3-height-s:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-item-control-3-width-s:23px;--spectrum-alias-item-control-3-width-m:var(
--spectrum-global-dimension-static-size-325
);--spectrum-alias-item-control-3-width-l:29px;--spectrum-alias-item-control-3-width-xl:33px;--spectrum-alias-item-mark-size-m:var(
--spectrum-global-dimension-size-250
);--spectrum-alias-component-focusring-border-radius:var(
--spectrum-global-dimension-static-size-65
);--spectrum-alias-control-two-size-s:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-control-three-height-s:var(
--spectrum-global-dimension-size-150
);--spectrum-alias-control-three-width-s:23px;--spectrum-alias-control-three-width-m:var(
--spectrum-global-dimension-static-size-325
);--spectrum-alias-control-three-width-l:29px;--spectrum-alias-control-three-width-xl:33px;--spectrum-alias-focus-ring-border-radius-regular:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-focus-ring-radius-default:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-workflow-icon-size-l:var(
--spectrum-global-dimension-static-size-250
);--spectrum-alias-ui-icon-chevron-size-75:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-chevron-size-100:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-chevron-size-200:var(
--spectrum-global-dimension-static-size-150
);--spectrum-alias-ui-icon-chevron-size-300:var(
--spectrum-global-dimension-static-size-175
);--spectrum-alias-ui-icon-chevron-size-400:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-ui-icon-chevron-size-500:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-ui-icon-checkmark-size-50:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-checkmark-size-75:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-checkmark-size-100:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-checkmark-size-200:var(
--spectrum-global-dimension-static-size-150
);--spectrum-alias-ui-icon-checkmark-size-300:var(
--spectrum-global-dimension-static-size-175
);--spectrum-alias-ui-icon-checkmark-size-400:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-ui-icon-checkmark-size-500:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-ui-icon-checkmark-size-600:var(
--spectrum-global-dimension-static-size-225
);--spectrum-alias-ui-icon-dash-size-50:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-ui-icon-dash-size-75:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-ui-icon-dash-size-100:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-dash-size-200:var(
--spectrum-global-dimension-static-size-150
);--spectrum-alias-ui-icon-dash-size-300:var(
--spectrum-global-dimension-static-size-150
);--spectrum-alias-ui-icon-dash-size-400:var(
--spectrum-global-dimension-static-size-175
);--spectrum-alias-ui-icon-dash-size-500:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-ui-icon-dash-size-600:var(
--spectrum-global-dimension-static-size-225
);--spectrum-alias-ui-icon-cross-size-75:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-ui-icon-cross-size-100:var(
--spectrum-global-dimension-static-size-100
);--spectrum-alias-ui-icon-cross-size-200:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-cross-size-300:var(
--spectrum-global-dimension-static-size-150
);--spectrum-alias-ui-icon-cross-size-400:var(
--spectrum-global-dimension-static-size-150
);--spectrum-alias-ui-icon-cross-size-500:var(
--spectrum-global-dimension-static-size-175
);--spectrum-alias-ui-icon-cross-size-600:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-ui-icon-arrow-size-75:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-arrow-size-100:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-arrow-size-200:var(
--spectrum-global-dimension-static-size-150
);--spectrum-alias-ui-icon-arrow-size-300:var(
--spectrum-global-dimension-static-size-175
);--spectrum-alias-ui-icon-arrow-size-400:var(
--spectrum-global-dimension-static-size-200
);--spectrum-alias-ui-icon-arrow-size-500:var(
--spectrum-global-dimension-static-size-225
);--spectrum-alias-ui-icon-arrow-size-600:var(
--spectrum-global-dimension-static-size-250
);--spectrum-alias-ui-icon-triplegripper-size-100-width:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-doublegripper-size-100-height:var(
--spectrum-global-dimension-static-size-50
);--spectrum-alias-ui-icon-singlegripper-size-100-height:var(
--spectrum-global-dimension-static-size-25
);--spectrum-alias-ui-icon-cornertriangle-size-100:var(
--spectrum-global-dimension-static-size-65
);--spectrum-alias-ui-icon-cornertriangle-size-300:var(
--spectrum-global-dimension-static-size-85
);--spectrum-alias-ui-icon-asterisk-size-200:var(
--spectrum-global-dimension-static-size-125
);--spectrum-alias-ui-icon-asterisk-size-300:var(
--spectrum-global-dimension-static-size-125
);--spectrum-dialog-confirm-title-text-size:var(
--spectrum-alias-heading-s-text-size
);--spectrum-dialog-confirm-description-text-size:var(
--spectrum-global-dimension-font-size-100
);--spectrum-dialog-confirm-padding:var(
--spectrum-global-dimension-static-size-500
)}:host,:root{--spectrum-global-alias-appframe-border-size:2px}:host,:root{--spectrum-workflow-icon-size-50:14px;--spectrum-workflow-icon-size-75:16px;--spectrum-workflow-icon-size-100:18px;--spectrum-workflow-icon-size-200:20px;--spectrum-workflow-icon-size-300:22px;--spectrum-arrow-icon-size-75:10px;--spectrum-arrow-icon-size-100:10px;--spectrum-arrow-icon-size-200:12px;--spectrum-arrow-icon-size-300:14px;--spectrum-arrow-icon-size-400:16px;--spectrum-arrow-icon-size-500:18px;--spectrum-arrow-icon-size-600:20px;--spectrum-asterisk-icon-size-75:8px;--spectrum-asterisk-icon-size-100:8px;--spectrum-asterisk-icon-size-200:10px;--spectrum-asterisk-icon-size-300:10px;--spectrum-checkmark-icon-size-50:10px;--spectrum-checkmark-icon-size-75:10px;--spectrum-checkmark-icon-size-100:10px;--spectrum-checkmark-icon-size-200:12px;--spectrum-checkmark-icon-size-300:14px;--spectrum-checkmark-icon-size-400:16px;--spectrum-checkmark-icon-size-500:16px;--spectrum-checkmark-icon-size-600:18px;--spectrum-chevron-icon-size-50:6px;--spectrum-chevron-icon-size-75:10px;--spectrum-chevron-icon-size-100:10px;--spectrum-chevron-icon-size-200:12px;--spectrum-chevron-icon-size-300:14px;--spectrum-chevron-icon-size-400:16px;--spectrum-chevron-icon-size-500:16px;--spectrum-chevron-icon-size-600:18px;--spectrum-corner-triangle-icon-size-75:5px;--spectrum-corner-triangle-icon-size-100:5px;--spectrum-corner-triangle-icon-size-200:6px;--spectrum-corner-triangle-icon-size-300:7px;--spectrum-cross-icon-size-75:8px;--spectrum-cross-icon-size-100:8px;--spectrum-cross-icon-size-200:10px;--spectrum-cross-icon-size-300:12px;--spectrum-cross-icon-size-400:12px;--spectrum-cross-icon-size-500:14px;--spectrum-cross-icon-size-600:16px;--spectrum-dash-icon-size-50:8px;--spectrum-dash-icon-size-75:8px;--spectrum-dash-icon-size-100:10px;--spectrum-dash-icon-size-200:12px;--spectrum-dash-icon-size-300:12px;--spectrum-dash-icon-size-400:14px;--spectrum-dash-icon-size-500:16px;--spectrum-dash-icon-size-600:18px;--spectrum-field-label-text-to-asterisk-small:4px;--spectrum-field-label-text-to-asterisk-medium:4px;--spectrum-field-label-text-to-asterisk-large:5px;--spectrum-field-label-text-to-asterisk-extra-large:5px;--spectrum-field-label-top-to-asterisk-small:8px;--spectrum-field-label-top-to-asterisk-medium:12px;--spectrum-field-label-top-to-asterisk-large:15px;--spectrum-field-label-top-to-asterisk-extra-large:19px;--spectrum-field-label-top-margin-small:0px;--spectrum-field-label-top-margin-medium:4px;--spectrum-field-label-top-margin-large:5px;--spectrum-field-label-top-margin-extra-large:5px;--spectrum-field-label-to-component-quiet-small:-8px;--spectrum-field-label-to-component-quiet-medium:-8px;--spectrum-field-label-to-component-quiet-large:-12px;--spectrum-field-label-to-component-quiet-extra-large:-15px;--spectrum-help-text-top-to-workflow-icon-small:4px;--spectrum-help-text-top-to-workflow-icon-medium:3px;--spectrum-help-text-top-to-workflow-icon-large:6px;--spectrum-help-text-top-to-workflow-icon-extra-large:9px;--spectrum-status-light-dot-size-small:8px;--spectrum-status-light-dot-size-medium:8px;--spectrum-status-light-dot-size-large:10px;--spectrum-status-light-dot-size-extra-large:10px;--spectrum-status-light-top-to-dot-small:8px;--spectrum-status-light-top-to-dot-medium:12px;--spectrum-status-light-top-to-dot-large:15px;--spectrum-status-light-top-to-dot-extra-large:19px;--spectrum-action-button-edge-to-hold-icon-extra-small:3px;--spectrum-action-button-edge-to-hold-icon-small:3px;--spectrum-action-button-edge-to-hold-icon-medium:4px;--spectrum-action-button-edge-to-hold-icon-large:5px;--spectrum-action-button-edge-to-hold-icon-extra-large:6px;--spectrum-tooltip-tip-width:8px;--spectrum-tooltip-tip-height:4px;--spectrum-tooltip-maximum-width:160px;--spectrum-progress-circle-size-small:16px;--spectrum-progress-circle-size-medium:32px;--spectrum-progress-circle-size-large:64px;--spectrum-progress-circle-thickness-small:2px;--spectrum-progress-circle-thickness-medium:3px;--spectrum-progress-circle-thickness-large:4px;--spectrum-toast-height:48px;--spectrum-toast-maximum-width:336px;--spectrum-toast-top-to-workflow-icon:15px;--spectrum-toast-top-to-text:14px;--spectrum-toast-bottom-to-text:17px;--spectrum-action-bar-height:48px;--spectrum-action-bar-top-to-item-counter:14px;--spectrum-swatch-size-extra-small:16px;--spectrum-swatch-size-small:24px;--spectrum-swatch-size-medium:32px;--spectrum-swatch-size-large:40px;--spectrum-progress-bar-thickness-small:4px;--spectrum-progress-bar-thickness-medium:6px;--spectrum-progress-bar-thickness-large:8px;--spectrum-progress-bar-thickness-extra-large:10px;--spectrum-meter-width:192px;--spectrum-meter-thickness-small:4px;--spectrum-meter-thickness-large:6px;--spectrum-tag-top-to-avatar-small:4px;--spectrum-tag-top-to-avatar-medium:6px;--spectrum-tag-top-to-avatar-large:9px;--spectrum-tag-top-to-cross-icon-small:8px;--spectrum-tag-top-to-cross-icon-medium:12px;--spectrum-tag-top-to-cross-icon-large:15px;--spectrum-popover-top-to-content-area:4px;--spectrum-menu-item-edge-to-content-not-selected-small:28px;--spectrum-menu-item-edge-to-content-not-selected-medium:32px;--spectrum-menu-item-edge-to-content-not-selected-large:38px;--spectrum-menu-item-edge-to-content-not-selected-extra-large:45px;--spectrum-menu-item-top-to-disclosure-icon-small:7px;--spectrum-menu-item-top-to-disclosure-icon-medium:11px;--spectrum-menu-item-top-to-disclosure-icon-large:14px;--spectrum-menu-item-top-to-disclosure-icon-extra-large:17px;--spectrum-menu-item-top-to-selected-icon-small:7px;--spectrum-menu-item-top-to-selected-icon-medium:11px;--spectrum-menu-item-top-to-selected-icon-large:14px;--spectrum-menu-item-top-to-selected-icon-extra-large:17px;--spectrum-slider-control-to-field-label-small:5px;--spectrum-slider-control-to-field-label-medium:8px;--spectrum-slider-control-to-field-label-large:11px;--spectrum-slider-control-to-field-label-extra-large:14px;--spectrum-picker-visual-to-disclosure-icon-small:7px;--spectrum-picker-visual-to-disclosure-icon-medium:8px;--spectrum-picker-visual-to-disclosure-icon-large:9px;--spectrum-picker-visual-to-disclosure-icon-extra-large:10px;--spectrum-text-area-minimum-width:112px;--spectrum-text-area-minimum-height:56px;--spectrum-combo-box-visual-to-field-button-small:7px;--spectrum-combo-box-visual-to-field-button-medium:8px;--spectrum-combo-box-visual-to-field-button-large:9px;--spectrum-combo-box-visual-to-field-button-extra-large:10px;--spectrum-thumbnail-size-50:16px;--spectrum-thumbnail-size-75:18px;--spectrum-thumbnail-size-100:20px;--spectrum-thumbnail-size-200:22px;--spectrum-thumbnail-size-300:26px;--spectrum-thumbnail-size-400:28px;--spectrum-thumbnail-size-500:32px;--spectrum-thumbnail-size-600:36px;--spectrum-thumbnail-size-700:40px;--spectrum-thumbnail-size-800:44px;--spectrum-thumbnail-size-900:50px;--spectrum-thumbnail-size-1000:56px;--spectrum-alert-dialog-title-size:var(--spectrum-heading-size-s);--spectrum-alert-dialog-description-size:var(--spectrum-body-size-s);--spectrum-opacity-checkerboard-square-size:8px;--spectrum-contextual-help-title-size:var(--spectrum-heading-size-xs);--spectrum-contextual-help-body-size:var(--spectrum-heading-size-s);--spectrum-breadcrumbs-height-multiline:72px;--spectrum-breadcrumbs-top-to-text:13px;--spectrum-breadcrumbs-top-to-text-compact:11px;--spectrum-breadcrumbs-top-to-text-multiline:12px;--spectrum-breadcrumbs-bottom-to-text:15px;--spectrum-breadcrumbs-bottom-to-text-compact:12px;--spectrum-breadcrumbs-bottom-to-text-multiline:9px;--spectrum-breadcrumbs-start-edge-to-text:8px;--spectrum-breadcrumbs-top-text-to-bottom-text:9px;--spectrum-breadcrumbs-top-to-separator-icon:19px;--spectrum-breadcrumbs-top-to-separator-icon-compact:15px;--spectrum-breadcrumbs-top-to-separator-icon-multiline:15px;--spectrum-breadcrumbs-separator-icon-to-bottom-text-multiline:11px;--spectrum-breadcrumbs-top-to-truncated-menu:8px;--spectrum-breadcrumbs-top-to-truncated-menu-compact:4px;--spectrum-avatar-size-50:16px;--spectrum-avatar-size-75:18px;--spectrum-avatar-size-100:20px;--spectrum-avatar-size-200:22px;--spectrum-avatar-size-300:26px;--spectrum-avatar-size-400:28px;--spectrum-avatar-size-500:32px;--spectrum-avatar-size-600:36px;--spectrum-avatar-size-700:40px;--spectrum-alert-banner-minimum-height:48px;--spectrum-alert-banner-width:832px;--spectrum-alert-banner-top-to-workflow-icon:15px;--spectrum-alert-banner-top-to-text:14px;--spectrum-alert-banner-bottom-to-text:17px;--spectrum-rating-indicator-width:18px;--spectrum-rating-indicator-to-icon:4px;--spectrum-color-area-width:192px;--spectrum-color-area-minimum-width:64px;--spectrum-color-area-height:192px;--spectrum-color-area-minimum-height:64px;--spectrum-color-wheel-width:192px;--spectrum-color-wheel-minimum-width:175px;--spectrum-color-slider-length:192px;--spectrum-color-slider-minimum-length:80px;--spectrum-illustrated-message-title-size:var(--spectrum-heading-size-m);--spectrum-illustrated-message-cjk-title-size:var(
--spectrum-heading-cjk-size-m
);--spectrum-illustrated-message-body-size:var(--spectrum-body-size-s);--spectrum-coach-mark-width:296px;--spectrum-coach-mark-minimum-width:296px;--spectrum-coach-mark-maximum-width:380px;--spectrum-coach-mark-edge-to-content:var(--spectrum-spacing-400);--spectrum-coach-mark-pagination-text-to-bottom-edge:33px;--spectrum-coach-mark-media-height:222px;--spectrum-coach-mark-media-minimum-height:166px;--spectrum-coach-mark-title-size:var(--spectrum-heading-size-xs);--spectrum-coach-mark-body-size:var(--spectrum-body-size-s);--spectrum-coach-mark-pagination-body-size:var(--spectrum-body-size-s);--spectrum-accordion-top-to-text-compact-small:2px;--spectrum-accordion-top-to-text-regular-small:5px;--spectrum-accordion-small-top-to-text-spacious:9px;--spectrum-accordion-top-to-text-compact-medium:4px;--spectrum-accordion-top-to-text-regular-medium:8px;--spectrum-accordion-top-to-text-spacious-medium:12px;--spectrum-accordion-top-to-text-compact-large:4px;--spectrum-accordion-top-to-text-regular-large:9px;--spectrum-accordion-top-to-text-spacious-large:12px;--spectrum-accordion-top-to-text-compact-extra-large:5px;--spectrum-accordion-top-to-text-regular-extra-large:9px;--spectrum-accordion-top-to-text-spacious-extra-large:13px;--spectrum-accordion-bottom-to-text-compact-small:2px;--spectrum-accordion-bottom-to-text-regular-small:7px;--spectrum-accordion-bottom-to-text-spacious-small:11px;--spectrum-accordion-bottom-to-text-compact-medium:5px;--spectrum-accordion-bottom-to-text-regular-medium:9px;--spectrum-accordion-bottom-to-text-spacious-medium:13px;--spectrum-accordion-bottom-to-text-compact-large:8px;--spectrum-accordion-bottom-to-text-regular-large:11px;--spectrum-accordion-bottom-to-text-spacious-large:16px;--spectrum-accordion-bottom-to-text-compact-extra-large:8px;--spectrum-accordion-bottom-to-text-regular-extra-large:12px;--spectrum-accordion-bottom-to-text-spacious-extra-large:16px;--spectrum-accordion-minimum-width:200px;--spectrum-accordion-disclosure-indicator-to-text:0px;--spectrum-accordion-edge-to-disclosure-indicator:0px;--spectrum-accordion-edge-to-text:0px;--spectrum-accordion-focus-indicator-gap:0px;--spectrum-accordion-content-area-top-to-content:8px;--spectrum-accordion-content-area-bottom-to-content:16px;--spectrum-color-handle-size:16px;--spectrum-color-handle-size-key-focus:32px;--spectrum-table-column-header-row-top-to-text-small:8px;--spectrum-table-column-header-row-top-to-text-medium:7px;--spectrum-table-column-header-row-top-to-text-large:10px;--spectrum-table-column-header-row-top-to-text-extra-large:13px;--spectrum-table-column-header-row-bottom-to-text-small:9px;--spectrum-table-column-header-row-bottom-to-text-medium:8px;--spectrum-table-column-header-row-bottom-to-text-large:10px;--spectrum-table-column-header-row-bottom-to-text-extra-large:13px;--spectrum-table-row-height-small-regular:32px;--spectrum-table-row-height-medium-regular:40px;--spectrum-table-row-height-large-regular:48px;--spectrum-table-row-height-extra-large-regular:56px;--spectrum-table-row-height-small-spacious:40px;--spectrum-table-row-height-medium-spacious:48px;--spectrum-table-row-height-large-spacious:56px;--spectrum-table-row-height-extra-large-spacious:64px;--spectrum-table-row-top-to-text-small-regular:8px;--spectrum-table-row-top-to-text-medium-regular:11px;--spectrum-table-row-top-to-text-large-regular:14px;--spectrum-table-row-top-to-text-extra-large-regular:17px;--spectrum-table-row-bottom-to-text-small-regular:9px;--spectrum-table-row-bottom-to-text-medium-regular:12px;--spectrum-table-row-bottom-to-text-large-regular:14px;--spectrum-table-row-bottom-to-text-extra-large-regular:17px;--spectrum-table-row-top-to-text-small-spacious:12px;--spectrum-table-row-top-to-text-medium-spacious:15px;--spectrum-table-row-top-to-text-large-spacious:18px;--spectrum-table-row-top-to-text-extra-large-spacious:21px;--spectrum-table-row-bottom-to-text-small-spacious:13px;--spectrum-table-row-bottom-to-text-medium-spacious:16px;--spectrum-table-row-bottom-to-text-large-spacious:18px;--spectrum-table-row-bottom-to-text-extra-large-spacious:21px;--spectrum-table-edge-to-content:16px;--spectrum-table-checkbox-to-text:24px;--spectrum-table-header-row-checkbox-to-top-small:10px;--spectrum-table-header-row-checkbox-to-top-medium:9px;--spectrum-table-header-row-checkbox-to-top-large:12px;--spectrum-table-header-row-checkbox-to-top-extra-large:15px;--spectrum-table-row-checkbox-to-top-small-compact:6px;--spectrum-table-row-checkbox-to-top-small-regular:10px;--spectrum-table-row-checkbox-to-top-small-spacious:14px;--spectrum-table-row-checkbox-to-top-medium-compact:9px;--spectrum-table-row-checkbox-to-top-medium-regular:13px;--spectrum-table-row-checkbox-to-top-medium-spacious:17px;--spectrum-table-row-checkbox-to-top-large-compact:12px;--spectrum-table-row-checkbox-to-top-large-regular:16px;--spectrum-table-row-checkbox-to-top-large-spacious:20px;--spectrum-table-row-checkbox-to-top-extra-large-compact:15px;--spectrum-table-row-checkbox-to-top-extra-large-regular:19px;--spectrum-table-row-checkbox-to-top-extra-large-spacious:23px;--spectrum-table-section-header-row-height-small:24px;--spectrum-table-section-header-row-height-medium:32px;--spectrum-table-section-header-row-height-large:40px;--spectrum-table-section-header-row-height-extra-large:48px;--spectrum-table-thumbnail-to-top-minimum-small-compact:4px;--spectrum-table-thumbnail-to-top-minimum-medium-compact:5px;--spectrum-table-thumbnail-to-top-minimum-large-compact:7px;--spectrum-table-thumbnail-to-top-minimum-extra-large-compact:8px;--spectrum-table-thumbnail-to-top-minimum-small-regular:5px;--spectrum-table-thumbnail-to-top-minimum-medium-regular:7px;--spectrum-table-thumbnail-to-top-minimum-large-regular:8px;--spectrum-table-thumbnail-to-top-minimum-extra-large-regular:8px;--spectrum-table-thumbnail-to-top-minimum-small-spacious:7px;--spectrum-table-thumbnail-to-top-minimum-medium-spacious:8px;--spectrum-table-thumbnail-to-top-minimum-large-spacious:8px;--spectrum-table-thumbnail-to-top-minimum-extra-large-spacious:10px;--spectrum-tab-item-to-tab-item-horizontal-small:21px;--spectrum-tab-item-to-tab-item-horizontal-medium:24px;--spectrum-tab-item-to-tab-item-horizontal-large:27px;--spectrum-tab-item-to-tab-item-horizontal-extra-large:30px;--spectrum-tab-item-to-tab-item-vertical-small:4px;--spectrum-tab-item-to-tab-item-vertical-medium:4px;--spectrum-tab-item-to-tab-item-vertical-large:5px;--spectrum-tab-item-to-tab-item-vertical-extra-large:5px;--spectrum-tab-item-start-to-edge-small:12px;--spectrum-tab-item-start-to-edge-medium:12px;--spectrum-tab-item-start-to-edge-large:13px;--spectrum-tab-item-start-to-edge-extra-large:13px;--spectrum-tab-item-top-to-text-small:11px;--spectrum-tab-item-bottom-to-text-small:12px;--spectrum-tab-item-top-to-text-medium:14px;--spectrum-tab-item-bottom-to-text-medium:14px;--spectrum-tab-item-top-to-text-large:16px;--spectrum-tab-item-bottom-to-text-large:18px;--spectrum-tab-item-top-to-text-extra-large:19px;--spectrum-tab-item-bottom-to-text-extra-large:20px;--spectrum-tab-item-top-to-text-compact-small:4px;--spectrum-tab-item-bottom-to-text-compact-small:5px;--spectrum-tab-item-top-to-text-compact-medium:6px;--spectrum-tab-item-bottom-to-text-compact-medium:8px;--spectrum-tab-item-top-to-text-compact-large:10px;--spectrum-tab-item-bottom-to-text-compact-large:12px;--spectrum-tab-item-top-to-text-compact-extra-large:12px;--spectrum-tab-item-bottom-to-text-compact-extra-large:13px;--spectrum-tab-item-top-to-workflow-icon-small:13px;--spectrum-tab-item-top-to-workflow-icon-medium:15px;--spectrum-tab-item-top-to-workflow-icon-large:17px;--spectrum-tab-item-top-to-workflow-icon-extra-large:19px;--spectrum-tab-item-top-to-workflow-icon-compact-small:3px;--spectrum-tab-item-top-to-workflow-icon-compact-medium:7px;--spectrum-tab-item-top-to-workflow-icon-compact-large:9px;--spectrum-tab-item-top-to-workflow-icon-compact-extra-large:11px;--spectrum-tab-item-focus-indicator-gap-small:7px;--spectrum-tab-item-focus-indicator-gap-medium:8px;--spectrum-tab-item-focus-indicator-gap-large:9px;--spectrum-tab-item-focus-indicator-gap-extra-large:10px;--spectrum-side-navigation-width:192px;--spectrum-side-navigation-minimum-width:160px;--spectrum-side-navigation-maximum-width:240px;--spectrum-side-navigation-second-level-edge-to-text:24px;--spectrum-side-navigation-third-level-edge-to-text:36px;--spectrum-side-navigation-with-icon-second-level-edge-to-text:50px;--spectrum-side-navigation-with-icon-third-level-edge-to-text:62px;--spectrum-side-navigation-item-to-item:4px;--spectrum-side-navigation-item-to-header:16px;--spectrum-side-navigation-bottom-to-text:8px;--spectrum-tray-top-to-content-area:4px;--spectrum-text-to-visual-50:6px;--spectrum-text-to-visual-75:7px;--spectrum-text-to-visual-100:8px;--spectrum-text-to-visual-200:9px;--spectrum-text-to-visual-300:10px;--spectrum-text-to-control-75:9px;--spectrum-text-to-control-100:10px;--spectrum-text-to-control-200:11px;--spectrum-text-to-control-300:13px;--spectrum-component-height-50:20px;--spectrum-component-height-75:24px;--spectrum-component-height-100:32px;--spectrum-component-height-200:40px;--spectrum-component-height-300:48px;--spectrum-component-height-400:56px;--spectrum-component-height-500:64px;--spectrum-component-pill-edge-to-visual-75:10px;--spectrum-component-pill-edge-to-visual-100:14px;--spectrum-component-pill-edge-to-visual-200:18px;--spectrum-component-pill-edge-to-visual-300:21px;--spectrum-component-pill-edge-to-visual-only-75:4px;--spectrum-component-pill-edge-to-visual-only-100:7px;--spectrum-component-pill-edge-to-visual-only-200:10px;--spectrum-component-pill-edge-to-visual-only-300:13px;--spectrum-component-pill-edge-to-text-75:12px;--spectrum-component-pill-edge-to-text-100:16px;--spectrum-component-pill-edge-to-text-200:20px;--spectrum-component-pill-edge-to-text-300:24px;--spectrum-component-edge-to-visual-50:6px;--spectrum-component-edge-to-visual-75:7px;--spectrum-component-edge-to-visual-100:10px;--spectrum-component-edge-to-visual-200:13px;--spectrum-component-edge-to-visual-300:15px;--spectrum-component-edge-to-visual-only-50:3px;--spectrum-component-edge-to-visual-only-75:4px;--spectrum-component-edge-to-visual-only-100:7px;--spectrum-component-edge-to-visual-only-200:10px;--spectrum-component-edge-to-visual-only-300:13px;--spectrum-component-edge-to-text-50:8px;--spectrum-component-edge-to-text-75:9px;--spectrum-component-edge-to-text-100:12px;--spectrum-component-edge-to-text-200:15px;--spectrum-component-edge-to-text-300:18px;--spectrum-component-top-to-workflow-icon-50:3px;--spectrum-component-top-to-workflow-icon-75:4px;--spectrum-component-top-to-workflow-icon-100:7px;--spectrum-component-top-to-workflow-icon-200:10px;--spectrum-component-top-to-workflow-icon-300:13px;--spectrum-component-top-to-text-50:3px;--spectrum-component-top-to-text-75:4px;--spectrum-component-top-to-text-100:6px;--spectrum-component-top-to-text-200:9px;--spectrum-component-top-to-text-300:12px;--spectrum-component-bottom-to-text-50:3px;--spectrum-component-bottom-to-text-75:5px;--spectrum-component-bottom-to-text-100:9px;--spectrum-component-bottom-to-text-200:11px;--spectrum-component-bottom-to-text-300:14px;--spectrum-component-to-menu-small:6px;--spectrum-component-to-menu-medium:6px;--spectrum-component-to-menu-large:7px;--spectrum-component-to-menu-extra-large:8px;--spectrum-field-edge-to-disclosure-icon-75:7px;--spectrum-field-edge-to-disclosure-icon-100:11px;--spectrum-field-edge-to-disclosure-icon-200:14px;--spectrum-field-edge-to-disclosure-icon-300:17px;--spectrum-field-end-edge-to-disclosure-icon-75:7px;--spectrum-field-end-edge-to-disclosure-icon-100:11px;--spectrum-field-end-edge-to-disclosure-icon-200:14px;--spectrum-field-end-edge-to-disclosure-icon-300:17px;--spectrum-field-top-to-disclosure-icon-75:7px;--spectrum-field-top-to-disclosure-icon-100:11px;--spectrum-field-top-to-disclosure-icon-200:14px;--spectrum-field-top-to-disclosure-icon-300:17px;--spectrum-field-top-to-alert-icon-small:4px;--spectrum-field-top-to-alert-icon-medium:7px;--spectrum-field-top-to-alert-icon-large:10px;--spectrum-field-top-to-alert-icon-extra-large:13px;--spectrum-field-top-to-validation-icon-small:7px;--spectrum-field-top-to-validation-icon-medium:11px;--spectrum-field-top-to-validation-icon-large:14px;--spectrum-field-top-to-validation-icon-extra-large:17px;--spectrum-field-top-to-progress-circle-small:4px;--spectrum-field-top-to-progress-circle-medium:8px;--spectrum-field-top-to-progress-circle-large:12px;--spectrum-field-top-to-progress-circle-extra-large:16px;--spectrum-field-edge-to-alert-icon-small:9px;--spectrum-field-edge-to-alert-icon-medium:12px;--spectrum-field-edge-to-alert-icon-large:15px;--spectrum-field-edge-to-alert-icon-extra-large:18px;--spectrum-field-edge-to-validation-icon-small:9px;--spectrum-field-edge-to-validation-icon-medium:12px;--spectrum-field-edge-to-validation-icon-large:15px;--spectrum-field-edge-to-validation-icon-extra-large:18px;--spectrum-field-text-to-alert-icon-small:8px;--spectrum-field-text-to-alert-icon-medium:12px;--spectrum-field-text-to-alert-icon-large:15px;--spectrum-field-text-to-alert-icon-extra-large:18px;--spectrum-field-text-to-validation-icon-small:8px;--spectrum-field-text-to-validation-icon-medium:12px;--spectrum-field-text-to-validation-icon-large:15px;--spectrum-field-text-to-validation-icon-extra-large:18px;--spectrum-field-width:192px;--spectrum-character-count-to-field-quiet-small:-3px;--spectrum-character-count-to-field-quiet-medium:-3px;--spectrum-character-count-to-field-quiet-large:-3px;--spectrum-character-count-to-field-quiet-extra-large:-4px;--spectrum-side-label-character-count-to-field:12px;--spectrum-side-label-character-count-top-margin-small:4px;--spectrum-side-label-character-count-top-margin-medium:8px;--spectrum-side-label-character-count-top-margin-large:11px;--spectrum-side-label-character-count-top-margin-extra-large:14px;--spectrum-disclosure-indicator-top-to-disclosure-icon-small:7px;--spectrum-disclosure-indicator-top-to-disclosure-icon-medium:11px;--spectrum-disclosure-indicator-top-to-disclosure-icon-large:14px;--spectrum-disclosure-indicator-top-to-disclosure-icon-extra-large:17px;--spectrum-navigational-indicator-top-to-back-icon-small:7px;--spectrum-navigational-indicator-top-to-back-icon-medium:11px;--spectrum-navigational-indicator-top-to-back-icon-large:14px;--spectrum-navigational-indicator-top-to-back-icon-extra-large:17px;--spectrum-color-control-track-width:24px;--spectrum-font-size-50:11px;--spectrum-font-size-75:12px;--spectrum-font-size-100:14px;--spectrum-font-size-200:16px;--spectrum-font-size-300:18px;--spectrum-font-size-400:20px;--spectrum-font-size-500:22px;--spectrum-font-size-600:25px;--spectrum-font-size-700:28px;--spectrum-font-size-800:32px;--spectrum-font-size-900:36px;--spectrum-font-size-1000:40px;--spectrum-font-size-1100:45px;--spectrum-font-size-1200:50px;--spectrum-font-size-1300:60px}:host,:root{--spectrum-edge-to-visual-only-75:4px;--spectrum-edge-to-visual-only-100:7px;--spectrum-edge-to-visual-only-200:10px;--spectrum-edge-to-visual-only-300:13px;--spectrum-slider-tick-mark-height:10px;--spectrum-slider-ramp-track-height:16px;--spectrum-colorwheel-path:"M 95 95 m -95 0 a 95 95 0 1 0 190 0 a 95 95 0 1 0 -190 0.2 M 95 95 m -73 0 a 73 73 0 1 0 146 0 a 73 73 0 1 0 -146 0";--spectrum-colorwheel-path-borders:"M 96 96 m -96 0 a 96 96 0 1 0 192 0 a 96 96 0 1 0 -192 0.2 M 96 96 m -72 0 a 72 72 0 1 0 144 0 a 72 72 0 1 0 -144 0";--spectrum-colorwheel-colorarea-container-size:144px;--spectrum-colorloupe-checkerboard-fill:url(#checkerboard-primary);--spectrum-menu-item-selectable-edge-to-text-not-selected-small:28px;--spectrum-menu-item-selectable-edge-to-text-not-selected-medium:32px;--spectrum-menu-item-selectable-edge-to-text-not-selected-large:38px;--spectrum-menu-item-selectable-edge-to-text-not-selected-extra-large:45px;--spectrum-menu-item-checkmark-height-small:10px;--spectrum-menu-item-checkmark-height-medium:10px;--spectrum-menu-item-checkmark-height-large:12px;--spectrum-menu-item-checkmark-height-extra-large:14px;--spectrum-menu-item-checkmark-width-small:10px;--spectrum-menu-item-checkmark-width-medium:10px;--spectrum-menu-item-checkmark-width-large:12px;--spectrum-menu-item-checkmark-width-extra-large:14px;--spectrum-rating-icon-spacing:var(--spectrum-spacing-75);--spectrum-button-top-to-text-small:5px;--spectrum-button-bottom-to-text-small:4px;--spectrum-button-top-to-text-medium:7px;--spectrum-button-bottom-to-text-medium:8px;--spectrum-button-top-to-text-large:10px;--spectrum-button-bottom-to-text-large:10px;--spectrum-button-top-to-text-extra-large:13px;--spectrum-button-bottom-to-text-extra-large:13px;--spectrum-alert-banner-close-button-spacing:var(--spectrum-spacing-100);--spectrum-alert-banner-edge-to-divider:var(--spectrum-spacing-100);--spectrum-alert-banner-edge-to-button:var(--spectrum-spacing-100);--spectrum-alert-banner-text-to-button-vertical:var(
--spectrum-spacing-100
);--spectrum-sidenav-heading-top-margin:24px;--spectrum-sidenav-heading-bottom-margin:8px;--spectrum-sidenav-bottom-to-label:8px;--spectrum-alert-dialog-padding:var(--spectrum-spacing-500);--spectrum-alert-dialog-description-to-buttons:var(--spectrum-spacing-700);--spectrum-coach-indicator-gap:6px;--spectrum-coach-indicator-ring-diameter:var(--spectrum-spacing-300);--spectrum-coach-indicator-quiet-ring-diameter:var(--spectrum-spacing-100);--spectrum-coachmark-buttongroup-display:flex;--spectrum-coachmark-buttongroup-mobile-display:none;--spectrum-coachmark-menu-display:inline-flex;--spectrum-coachmark-menu-mobile-display:none;--spectrum-well-padding:var(--spectrum-spacing-300);--spectrum-well-margin-top:var(--spectrum-spacing-75);--spectrum-well-min-width:240px;--spectrum-well-border-radius:var(--spectrum-spacing-75);--spectrum-icon-chevron-size-50:6px;--spectrum-treeview-item-indentation-medium:var(--spectrum-spacing-300);--spectrum-treeview-item-indentation-small:var(--spectrum-spacing-200);--spectrum-treeview-item-indentation-large:20px;--spectrum-treeview-item-indentation-extra-large:var(
--spectrum-spacing-400
);--spectrum-treeview-indicator-inset-block-start:5px;--spectrum-dialog-confirm-entry-animation-distance:20px;--spectrum-dialog-confirm-hero-height:128px;--spectrum-dialog-confirm-border-radius:4px;--spectrum-dialog-confirm-title-text-size:18px;--spectrum-dialog-confirm-description-text-size:14px;--spectrum-dialog-confirm-padding-grid:40px;--spectrum-datepicker-initial-width:128px;--spectrum-datepicker-generic-padding:var(--spectrum-spacing-200);--spectrum-datepicker-dash-line-height:24px;--spectrum-datepicker-width-quiet-first:72px;--spectrum-datepicker-width-quiet-second:16px;--spectrum-datepicker-datetime-width-first:36px;--spectrum-datepicker-invalid-icon-to-button:8px;--spectrum-datepicker-invalid-icon-to-button-quiet:7px;--spectrum-datepicker-input-datetime-width:var(--spectrum-spacing-400);--spectrum-pagination-textfield-width:var(--spectrum-spacing-700);--spectrum-pagination-item-inline-spacing:5px;--spectrum-dial-border-radius:16px;--spectrum-dial-handle-position:8px;--spectrum-dial-handle-block-margin:16px;--spectrum-dial-handle-inline-margin:16px;--spectrum-dial-controls-margin:8px;--spectrum-dial-label-gap-y:5px;--spectrum-dial-label-container-top-to-text:4px}:host,:root{--spectrum-checkbox-control-size-small:12px;--spectrum-checkbox-control-size-medium:14px;--spectrum-checkbox-control-size-large:16px;--spectrum-checkbox-control-size-extra-large:18px;--spectrum-checkbox-top-to-control-small:6px;--spectrum-checkbox-top-to-control-medium:9px;--spectrum-checkbox-top-to-control-large:12px;--spectrum-checkbox-top-to-control-extra-large:15px;--spectrum-switch-control-width-small:23px;--spectrum-switch-control-width-medium:26px;--spectrum-switch-control-width-large:29px;--spectrum-switch-control-width-extra-large:33px;--spectrum-switch-control-height-small:12px;--spectrum-switch-control-height-medium:14px;--spectrum-switch-control-height-large:16px;--spectrum-switch-control-height-extra-large:18px;--spectrum-switch-top-to-control-small:6px;--spectrum-switch-top-to-control-medium:9px;--spectrum-switch-top-to-control-large:12px;--spectrum-switch-top-to-control-extra-large:15px;--spectrum-radio-button-control-size-small:12px;--spectrum-radio-button-control-size-medium:14px;--spectrum-radio-button-control-size-large:16px;--spectrum-radio-button-control-size-extra-large:18px;--spectrum-radio-button-top-to-control-small:6px;--spectrum-radio-button-top-to-control-medium:9px;--spectrum-radio-button-top-to-control-large:12px;--spectrum-radio-button-top-to-control-extra-large:15px;--spectrum-slider-control-height-small:14px;--spectrum-slider-control-height-medium:16px;--spectrum-slider-control-height-large:18px;--spectrum-slider-control-height-extra-large:20px;--spectrum-slider-handle-size-small:14px;--spectrum-slider-handle-size-medium:16px;--spectrum-slider-handle-size-large:18px;--spectrum-slider-handle-size-extra-large:20px;--spectrum-slider-handle-border-width-down-small:5px;--spectrum-slider-handle-border-width-down-medium:6px;--spectrum-slider-handle-border-width-down-large:7px;--spectrum-slider-handle-border-width-down-extra-large:8px;--spectrum-slider-bottom-to-handle-small:5px;--spectrum-slider-bottom-to-handle-medium:8px;--spectrum-slider-bottom-to-handle-large:11px;--spectrum-slider-bottom-to-handle-extra-large:14px;--spectrum-corner-radius-75:2px;--spectrum-corner-radius-100:4px;--spectrum-corner-radius-200:8px;--spectrum-drop-shadow-x:0px;--spectrum-drop-shadow-y:1px;--spectrum-drop-shadow-blur:4px}
`,So=Xa;jt.registerThemeFragment("medium","scale",So);h();S();h();S();Ee();Ft();_r();h();var rc=i.css`
:host{display:inline-flex;vertical-align:top}:host([dir]){-webkit-appearance:none}:host([disabled]){cursor:auto;pointer-events:none}#button{inset:0;position:absolute}::slotted(sp-overlay),::slotted(sp-tooltip){position:absolute}:host:after{pointer-events:none}slot[name=icon]::slotted(img),slot[name=icon]::slotted(svg){fill:currentcolor;stroke:currentcolor;height:var(
--spectrum-alias-workflow-icon-size-m,var(--spectrum-global-dimension-size-225)
);width:var(
--spectrum-alias-workflow-icon-size-m,var(--spectrum-global-dimension-size-225)
)}[icon-only]+#label{display:contents}:host([size=s]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-s
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-s
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-75
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-75
)}:host([size=m]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-m
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-m
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-100
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-100
)}:host([size=l]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-l
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-l
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-200
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-200
)}:host([size=xl]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-xl
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-xl
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-300
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-300
)}
`,qo=rc;var oc=Object.defineProperty,sc=Object.getOwnPropertyDescriptor,Nr=(s,t,e,r)=>{for(var o=r>1?void 0:r?sc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&oc(t,e,o),o},yt=class extends _e(Qt(U),"",["sp-overlay,sp-tooltip"]){constructor(){super(),this.active=!1,this.type="button",this.proxyFocus=this.proxyFocus.bind(this),this.addEventListener("click",this.handleClickCapture,{capture:!0})}static get styles(){return[qo]}get focusElement(){return this}get hasLabel(){return this.slotHasContent}get buttonContent(){return[i.html`
                <slot name="icon" ?icon-only=${!this.hasLabel}></slot>
            `,i.html`
                <span id="label">
                    <slot @slotchange=${this.manageTextObservedSlot}></slot>
                </span>
            `]}click(){this.disabled||this.shouldProxyClick()||super.click()}handleClickCapture(t){if(this.disabled)return t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation(),!1}proxyFocus(){this.focus()}shouldProxyClick(){let t=!1;if(this.anchorElement)this.anchorElement.click(),t=!0;else if(this.type!=="button"){let e=document.createElement("button");e.type=this.type,this.insertAdjacentElement("afterend",e),e.click(),e.remove(),t=!0}return t}renderAnchor(){return i.html`
            ${this.buttonContent}
            ${super.renderAnchor({id:"button",ariaHidden:!0,className:"button anchor hidden"})}
        `}renderButton(){return i.html`
            ${this.buttonContent}
        `}render(){return this.href&&this.href.length>0?this.renderAnchor():this.renderButton()}handleKeydown(t){let{code:e}=t;switch(e){case"Space":t.preventDefault(),typeof this.href>"u"&&(this.addEventListener("keyup",this.handleKeyup),this.active=!0);break;default:break}}handleKeypress(t){let{code:e}=t;switch(e){case"Enter":case"NumpadEnter":this.click();break;default:break}}handleKeyup(t){let{code:e}=t;switch(e){case"Space":this.removeEventListener("keyup",this.handleKeyup),this.active=!1,this.click();break;default:break}}handleRemoveActive(){this.active=!1}handlePointerdown(){this.active=!0}manageAnchor(){this.href&&this.href.length>0?((!this.hasAttribute("role")||this.getAttribute("role")==="button")&&this.setAttribute("role","link"),this.removeEventListener("click",this.shouldProxyClick)):((!this.hasAttribute("role")||this.getAttribute("role")==="link")&&this.setAttribute("role","button"),this.addEventListener("click",this.shouldProxyClick))}firstUpdated(t){super.firstUpdated(t),this.hasAttribute("tabindex")||this.setAttribute("tabindex","0"),this.manageAnchor(),this.addEventListener("keydown",this.handleKeydown),this.addEventListener("keypress",this.handleKeypress),this.addEventListener("pointerdown",this.handlePointerdown)}updated(t){super.updated(t),t.has("href")&&this.manageAnchor(),t.has("label")&&this.setAttribute("aria-label",this.label||""),t.has("active")&&(this.active?(this.addEventListener("focusout",this.handleRemoveActive),this.addEventListener("pointerup",this.handleRemoveActive),this.addEventListener("pointercancel",this.handleRemoveActive),this.addEventListener("pointerleave",this.handleRemoveActive)):(this.removeEventListener("focusout",this.handleRemoveActive),this.removeEventListener("pointerup",this.handleRemoveActive),this.removeEventListener("pointercancel",this.handleRemoveActive),this.removeEventListener("pointerleave",this.handleRemoveActive))),this.anchorElement&&(this.anchorElement.addEventListener("focus",this.proxyFocus),this.anchorElement.tabIndex=-1)}};Nr([(0,n.property)({type:Boolean,reflect:!0})],yt.prototype,"active",2),Nr([(0,n.property)({type:String})],yt.prototype,"type",2),Nr([(0,n.query)(".anchor")],yt.prototype,"anchorElement",2);h();var ac=i.css`
:host{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;align-items:center;-webkit-appearance:button;box-sizing:border-box;cursor:pointer;display:inline-flex;font-family:var(
--mod-sans-font-family-stack,var(--spectrum-sans-font-family-stack)
);justify-content:center;line-height:var(--mod-line-height-100,var(--spectrum-line-height-100));margin:0;overflow:visible;-webkit-text-decoration:none;text-decoration:none;text-transform:none;transition:background var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out,border-color var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out,color var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out,box-shadow var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out;-webkit-user-select:none;user-select:none;vertical-align:top}:host(:focus){outline:none}:host([disabled]){cursor:default}:host:after{display:block;margin:calc(var(--mod-focus-indicator-gap, var(--spectrum-focus-indicator-gap))*-1);transition:opacity var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out,margin var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out}:host(.focus-visible):after{margin:calc(var(--mod-focus-indicator-gap, var(--spectrum-focus-indicator-gap))*-2)}:host(.focus-visible):after{margin:calc(var(--mod-focus-indicator-gap, var(--spectrum-focus-indicator-gap))*-2)}:host(:focus-visible):after{margin:calc(var(--mod-focus-indicator-gap, var(--spectrum-focus-indicator-gap))*-2)}#label{place-self:center;text-align:center}#label[hidden]{display:none}:host{--spectrum-button-animation-duration:var(
--spectrum-animation-duration-100
);--spectrum-button-border-radius:var(--spectrum-corner-radius-100);--spectrum-button-border-width:var(--spectrum-border-width-200);--spectrum-button-line-height:1.2;--spectrum-button-focus-ring-border-radius:calc(var(--spectrum-button-border-radius) + var(--spectrum-button-focus-ring-gap));--spectrum-button-focus-ring-gap:var(--spectrum-focus-indicator-gap);--spectrum-button-focus-ring-thickness:var(
--spectrum-focus-indicator-thickness
);--spectrum-button-focus-indicator-color:var(
--spectrum-focus-indicator-color
)}:host([size=s]){--spectrum-button-min-width:calc(var(--spectrum-component-height-75)*var(--spectrum-button-minimum-width-multiplier));--spectrum-button-border-radius:var(
--spectrum-component-pill-edge-to-text-75
);--spectrum-button-height:var(--spectrum-component-height-75);--spectrum-button-font-size:var(--spectrum-font-size-75);--spectrum-button-edge-to-visual:calc(var(--spectrum-component-pill-edge-to-visual-75) - var(--spectrum-button-border-width));--spectrum-button-edge-to-visual-only:var(
--spectrum-component-pill-edge-to-visual-only-75
);--spectrum-button-edge-to-text:calc(var(--spectrum-component-pill-edge-to-text-75) - var(--spectrum-button-border-width));--spectrum-button-padding-label-to-icon:var(--spectrum-text-to-visual-75);--spectrum-button-top-to-text:var(--spectrum-button-top-to-text-small);--spectrum-button-bottom-to-text:var(
--spectrum-button-bottom-to-text-small
)}:host{--spectrum-button-min-width:calc(var(--spectrum-component-height-100)*var(--spectrum-button-minimum-width-multiplier));--spectrum-button-border-radius:var(
--spectrum-component-pill-edge-to-text-100
);--spectrum-button-height:var(--spectrum-component-height-100);--spectrum-button-font-size:var(--spectrum-font-size-100);--spectrum-button-edge-to-visual:calc(var(--spectrum-component-pill-edge-to-visual-100) - var(--spectrum-button-border-width));--spectrum-button-edge-to-visual-only:var(
--spectrum-component-pill-edge-to-visual-only-100
);--spectrum-button-edge-to-text:calc(var(--spectrum-component-pill-edge-to-text-100) - var(--spectrum-button-border-width));--spectrum-button-padding-label-to-icon:var(--spectrum-text-to-visual-100);--spectrum-button-top-to-text:var(--spectrum-button-top-to-text-medium);--spectrum-button-bottom-to-text:var(
--spectrum-button-bottom-to-text-medium
)}:host([size=l]){--spectrum-button-min-width:calc(var(--spectrum-component-height-200)*var(--spectrum-button-minimum-width-multiplier));--spectrum-button-border-radius:var(
--spectrum-component-pill-edge-to-text-200
);--spectrum-button-height:var(--spectrum-component-height-200);--spectrum-button-font-size:var(--spectrum-font-size-200);--spectrum-button-edge-to-visual:calc(var(--spectrum-component-pill-edge-to-visual-200) - var(--spectrum-button-border-width));--spectrum-button-edge-to-visual-only:var(
--spectrum-component-pill-edge-to-visual-only-200
);--spectrum-button-edge-to-text:calc(var(--spectrum-component-pill-edge-to-text-200) - var(--spectrum-button-border-width));--spectrum-button-padding-label-to-icon:var(--spectrum-text-to-visual-200);--spectrum-button-top-to-text:var(--spectrum-button-top-to-text-large);--spectrum-button-bottom-to-text:var(
--spectrum-button-bottom-to-text-large
)}:host([size=xl]){--spectrum-button-min-width:calc(var(--spectrum-component-height-300)*var(--spectrum-button-minimum-width-multiplier));--spectrum-button-border-radius:var(
--spectrum-component-pill-edge-to-text-300
);--spectrum-button-height:var(--spectrum-component-height-300);--spectrum-button-font-size:var(--spectrum-font-size-300);--spectrum-button-edge-to-visual:calc(var(--spectrum-component-pill-edge-to-visual-300) - var(--spectrum-button-border-width));--spectrum-button-edge-to-visual-only:var(
--spectrum-component-pill-edge-to-visual-only-300
);--spectrum-button-edge-to-text:calc(var(--spectrum-component-pill-edge-to-text-300) - var(--spectrum-button-border-width));--spectrum-button-padding-label-to-icon:var(--spectrum-text-to-visual-300);--spectrum-button-top-to-text:var(
--spectrum-button-top-to-text-extra-large
);--spectrum-button-bottom-to-text:var(
--spectrum-button-bottom-to-text-extra-large
)}:host{border-radius:var(
--mod-button-border-radius,var(--spectrum-button-border-radius)
);border-style:solid;border-width:var(
--mod-button-border-width,var(--spectrum-button-border-width)
);color:inherit;font-size:var(--mod-button-font-size,var(--spectrum-button-font-size));font-weight:var(--mod-bold-font-weight,var(--spectrum-bold-font-weight));gap:var(
--mod-button-padding-label-to-icon,var(--spectrum-button-padding-label-to-icon)
);margin-block:var(--mod-button-margin-block);margin-inline-end:var(--mod-button-margin-right);margin-inline-start:var(--mod-button-margin-left);min-block-size:var(--mod-button-height,var(--spectrum-button-height));min-inline-size:var(
--mod-button-min-width,var(--spectrum-button-min-width)
);padding-block:0;padding-inline:var(
--mod-button-edge-to-text,var(--spectrum-button-edge-to-text)
);position:relative}:host(:hover),:host([active]){box-shadow:none}::slotted([slot=icon]){color:inherit;margin-inline-start:calc(var(--mod-button-edge-to-visual, var(--spectrum-button-edge-to-visual)) - var(--mod-button-edge-to-text, var(--spectrum-button-edge-to-text)))}:host:after{border-radius:calc(var(--mod-button-border-radius, var(--spectrum-button-border-radius)) + var(--mod-focus-indicator-gap, var(--spectrum-focus-indicator-gap)))}:host .spectrum-Button--iconOnly{border-radius:50%;min-inline-size:unset;padding:calc(var(
--mod-button-edge-to-visual-only,
var(--spectrum-button-edge-to-visual-only)
) - var(--mod-button-border-width, var(--spectrum-button-border-width)))}:host .spectrum-Button--iconOnly ::slotted([slot=icon]){margin-inline-start:0}:host .spectrum-Button--iconOnly:after{border-radius:50%}#label{align-self:start;line-height:var(
--mod-button-line-height,var(--spectrum-button-line-height)
);padding-block-end:calc(var(--mod-button-bottom-to-text, var(--spectrum-button-bottom-to-text)) - var(--mod-button-border-width, var(--spectrum-button-border-width)));padding-block-start:calc(var(--mod-button-top-to-text, var(--spectrum-button-top-to-text)) - var(--mod-button-border-width, var(--spectrum-button-border-width)));white-space:nowrap}:host(.focus-visible):after,:host([focused]):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) var(
--mod-button-focus-ring-color,var(--spectrum-button-focus-indicator-color)
)}:host(.focus-visible):after,:host([focused]):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) var(
--mod-button-focus-ring-color,var(--spectrum-button-focus-indicator-color)
)}:host(:focus-visible):after,:host([focused]):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) var(
--mod-button-focus-ring-color,var(--spectrum-button-focus-indicator-color)
)}:host{transition:border-color var(
--mod-button-animation-duration,var(--spectrum-button-animation-duration)
) ease-in-out}:host:after{border-radius:var(
--mod-button-focus-ring-border-radius,var(--spectrum-button-focus-ring-border-radius)
);content:"";inset:0;margin:calc((var(
--mod-button-focus-ring-gap,
var(--spectrum-button-focus-ring-gap)
) + var(
--mod-button-border-width,
var(--spectrum-button-border-width)
))*-1);pointer-events:none;position:absolute;transition:box-shadow var(
--mod-button-animation-duration,var(--spectrum-button-animation-duration)
) ease-in-out}:host(.focus-visible){box-shadow:none;outline:none}:host(.focus-visible){box-shadow:none;outline:none}:host(:focus-visible){box-shadow:none;outline:none}:host(.focus-visible):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) var(
--highcontrast-button-focus-ring-color,var(
--mod-button-focus-ring-color,var(
--mod-button-focus-ring-color,var(--spectrum-button-focus-indicator-color)
)
)
)}:host(.focus-visible):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) var(
--highcontrast-button-focus-ring-color,var(
--mod-button-focus-ring-color,var(
--mod-button-focus-ring-color,var(--spectrum-button-focus-indicator-color)
)
)
)}:host(:focus-visible):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) var(
--highcontrast-button-focus-ring-color,var(
--mod-button-focus-ring-color,var(
--mod-button-focus-ring-color,var(--spectrum-button-focus-indicator-color)
)
)
)}:host{background-color:var(
--highcontrast-button-background-color-default,var(
--mod-button-background-color-default,var(--spectrum-button-background-color-default)
)
);border-color:var(
--highcontrast-button-border-color-default,var(
--mod-button-border-color-default,var(--spectrum-button-border-color-default)
)
);color:var(
--highcontrast-button-content-color-default,var(
--mod-button-content-color-default,var(--spectrum-button-content-color-default)
)
)}:host(:hover){background-color:var(
--highcontrast-button-background-color-hover,var(
--mod-button-background-color-hover,var(--spectrum-button-background-color-hover)
)
);border-color:var(
--highcontrast-button-border-color-hover,var(
--mod-button-border-color-hover,var(--spectrum-button-border-color-hover)
)
);color:var(
--highcontrast-button-content-color-hover,var(
--mod-button-content-color-hover,var(--spectrum-button-content-color-hover)
)
)}:host(.focus-visible){background-color:var(
--highcontrast-button-background-color-focus,var(
--mod-button-background-color-focus,var(--spectrum-button-background-color-focus)
)
);border-color:var(
--highcontrast-button-border-color-focus,var(
--mod-button-border-color-focus,var(--spectrum-button-border-color-focus)
)
);color:var(
--highcontrast-button-content-color-focus,var(
--mod-button-content-color-focus,var(--spectrum-button-content-color-focus)
)
)}:host(.focus-visible){background-color:var(
--highcontrast-button-background-color-focus,var(
--mod-button-background-color-focus,var(--spectrum-button-background-color-focus)
)
);border-color:var(
--highcontrast-button-border-color-focus,var(
--mod-button-border-color-focus,var(--spectrum-button-border-color-focus)
)
);color:var(
--highcontrast-button-content-color-focus,var(
--mod-button-content-color-focus,var(--spectrum-button-content-color-focus)
)
)}:host(:focus-visible){background-color:var(
--highcontrast-button-background-color-focus,var(
--mod-button-background-color-focus,var(--spectrum-button-background-color-focus)
)
);border-color:var(
--highcontrast-button-border-color-focus,var(
--mod-button-border-color-focus,var(--spectrum-button-border-color-focus)
)
);color:var(
--highcontrast-button-content-color-focus,var(
--mod-button-content-color-focus,var(--spectrum-button-content-color-focus)
)
)}:host([active]){background-color:var(
--highcontrast-button-background-color-down,var(
--mod-button-background-color-down,var(--spectrum-button-background-color-down)
)
);border-color:var(
--highcontrast-button-border-color-down,var(
--mod-button-border-color-down,var(--spectrum-button-border-color-down)
)
);color:var(
--highcontrast-button-content-color-down,var(
--mod-button-content-color-down,var(--spectrum-button-content-color-down)
)
)}:host([disabled]){background-color:var(
--highcontrast-button-background-color-disabled,var(
--mod-button-background-color-disabled,var(--spectrum-button-background-color-disabled)
)
);border-color:var(
--highcontrast-button-border-color-disabled,var(
--mod-button-border-color-disabled,var(--spectrum-button-border-color-disabled)
)
);color:var(
--highcontrast-button-content-color-disabled,var(
--mod-button-content-color-disabled,var(--spectrum-button-content-color-disabled)
)
)}@media (forced-colors:active){:host{--highcontrast-button-content-color-disabled:GrayText;--highcontrast-button-border-color-disabled:GrayText}:host(.focus-visible):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) ButtonText;forced-color-adjust:none}:host(.focus-visible):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) ButtonText;forced-color-adjust:none}:host(:focus-visible):after{box-shadow:0 0 0 var(
--mod-button-focus-ring-thickness,var(--spectrum-button-focus-ring-thickness)
) ButtonText;forced-color-adjust:none}:host([variant=accent][treatment=fill]){--highcontrast-button-background-color-default:ButtonText;--highcontrast-button-content-color-default:ButtonFace;--highcontrast-button-background-color-disabled:ButtonFace;--highcontrast-button-background-color-hover:Highlight;--highcontrast-button-background-color-down:Highlight;--highcontrast-button-background-color-focus:Highlight;--highcontrast-button-content-color-hover:ButtonFace;--highcontrast-button-content-color-down:ButtonFace;--highcontrast-button-content-color-focus:ButtonFace}:host([variant=accent][treatment=fill]) #label{forced-color-adjust:none}}:host([static=white]){--spectrum-button-focus-indicator-color:var(
--mod-static-black-focus-indicator-color,var(--spectrum-static-black-focus-indicator-color)
)}:host([static=black]){--spectrum-button-focus-indicator-color:var(
--mod-static-black-focus-indicator-color,var(--spectrum-static-black-focus-indicator-color)
)}:host{--spectrum-button-background-color-default:var(
--system-spectrum-button-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-content-color-disabled
)}:host([variant=accent]){--spectrum-button-background-color-default:var(
--system-spectrum-button-accent-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-accent-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-accent-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-accent-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-accent-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-accent-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-accent-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-accent-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-accent-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-accent-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-accent-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-accent-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-accent-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-accent-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-accent-content-color-disabled
)}:host([variant=accent][treatment=outline]){--spectrum-button-background-color-default:var(
--system-spectrum-button-accent-outline-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-accent-outline-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-accent-outline-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-accent-outline-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-accent-outline-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-accent-outline-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-accent-outline-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-accent-outline-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-accent-outline-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-accent-outline-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-accent-outline-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-accent-outline-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-accent-outline-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-accent-outline-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-accent-outline-content-color-disabled
)}:host([variant=negative]){--spectrum-button-background-color-default:var(
--system-spectrum-button-negative-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-negative-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-negative-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-negative-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-negative-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-negative-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-negative-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-negative-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-negative-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-negative-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-negative-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-negative-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-negative-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-negative-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-negative-content-color-disabled
)}:host([variant=negative][treatment=outline]){--spectrum-button-background-color-default:var(
--system-spectrum-button-negative-outline-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-negative-outline-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-negative-outline-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-negative-outline-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-negative-outline-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-negative-outline-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-negative-outline-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-negative-outline-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-negative-outline-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-negative-outline-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-negative-outline-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-negative-outline-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-negative-outline-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-negative-outline-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-negative-outline-content-color-disabled
)}:host([variant=primary]){--spectrum-button-background-color-default:var(
--system-spectrum-button-primary-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-primary-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-primary-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-primary-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-primary-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-primary-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-primary-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-primary-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-primary-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-primary-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-primary-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-primary-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-primary-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-primary-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-primary-content-color-disabled
)}:host([variant=primary][treatment=outline]){--spectrum-button-background-color-default:var(
--system-spectrum-button-primary-outline-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-primary-outline-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-primary-outline-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-primary-outline-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-primary-outline-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-primary-outline-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-primary-outline-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-primary-outline-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-primary-outline-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-primary-outline-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-primary-outline-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-primary-outline-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-primary-outline-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-primary-outline-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-primary-outline-content-color-disabled
)}:host([variant=secondary]){--spectrum-button-background-color-default:var(
--system-spectrum-button-secondary-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-secondary-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-secondary-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-secondary-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-secondary-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-secondary-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-secondary-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-secondary-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-secondary-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-secondary-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-secondary-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-secondary-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-secondary-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-secondary-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-secondary-content-color-disabled
)}:host([variant=secondary][treatment=outline]){--spectrum-button-background-color-default:var(
--system-spectrum-button-secondary-outline-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-secondary-outline-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-secondary-outline-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-secondary-outline-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-secondary-outline-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-secondary-outline-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-secondary-outline-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-secondary-outline-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-secondary-outline-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-secondary-outline-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-secondary-outline-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-secondary-outline-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-secondary-outline-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-secondary-outline-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-secondary-outline-content-color-disabled
)}:host([quiet]){--spectrum-button-background-color-default:var(
--system-spectrum-button-quiet-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-quiet-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-quiet-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-quiet-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-quiet-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-quiet-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-quiet-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-quiet-border-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-quiet-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-quiet-border-color-disabled
)}:host([selected]){--spectrum-button-background-color-default:var(
--system-spectrum-button-selected-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-selected-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-selected-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-selected-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-selected-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-selected-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-selected-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-selected-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-selected-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-selected-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-selected-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-selected-content-color-focus
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-selected-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-selected-border-color-disabled
)}:host([selected][emphasized]){--spectrum-button-background-color-default:var(
--system-spectrum-button-selected-emphasized-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-selected-emphasized-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-selected-emphasized-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-selected-emphasized-background-color-focus
)}:host([static=black][quiet]){--spectrum-button-border-color-default:var(
--system-spectrum-button-staticblack-quiet-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticblack-quiet-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticblack-quiet-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticblack-quiet-border-color-focus
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticblack-quiet-border-color-disabled
)}:host([static=white][quiet]){--spectrum-button-border-color-default:var(
--system-spectrum-button-staticwhite-quiet-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticwhite-quiet-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticwhite-quiet-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticwhite-quiet-border-color-focus
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticwhite-quiet-border-color-disabled
)}:host([static=white]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticwhite-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticwhite-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticwhite-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticwhite-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-staticwhite-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticwhite-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticwhite-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticwhite-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-staticwhite-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-staticwhite-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-staticwhite-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-staticwhite-content-color-focus
);--spectrum-button-focus-indicator-color:var(
--system-spectrum-button-staticwhite-focus-indicator-color
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticwhite-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticwhite-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-staticwhite-content-color-disabled
)}:host([static=white][treatment=outline]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticwhite-outline-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticwhite-outline-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticwhite-outline-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticwhite-outline-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-staticwhite-outline-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticwhite-outline-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticwhite-outline-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticwhite-outline-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-staticwhite-outline-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-staticwhite-outline-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-staticwhite-outline-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-staticwhite-outline-content-color-focus
);--spectrum-button-focus-indicator-color:var(
--system-spectrum-button-staticwhite-outline-focus-indicator-color
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticwhite-outline-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticwhite-outline-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-staticwhite-outline-content-color-disabled
)}:host([static=white][selected]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticwhite-selected-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticwhite-selected-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticwhite-selected-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticwhite-selected-background-color-focus
);--spectrum-button-content-color-default:var(
--mod-button-static-content-color,var(--system-spectrum-button-staticwhite-selected-content-color-default)
);--spectrum-button-content-color-hover:var(
--mod-button-static-content-color,var(--system-spectrum-button-staticwhite-selected-content-color-hover)
);--spectrum-button-content-color-down:var(
--mod-button-static-content-color,var(--system-spectrum-button-staticwhite-selected-content-color-down)
);--spectrum-button-content-color-focus:var(
--mod-button-static-content-color,var(--system-spectrum-button-staticwhite-selected-content-color-focus)
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticwhite-selected-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticwhite-selected-border-color-disabled
)}:host([static=white][variant=secondary]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticwhite-secondary-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticwhite-secondary-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticwhite-secondary-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticwhite-secondary-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-staticwhite-secondary-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticwhite-secondary-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticwhite-secondary-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticwhite-secondary-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-staticwhite-secondary-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-staticwhite-secondary-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-staticwhite-secondary-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-staticwhite-secondary-content-color-focus
);--spectrum-button-focus-indicator-color:var(
--system-spectrum-button-staticwhite-secondary-focus-indicator-color
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticwhite-secondary-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticwhite-secondary-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-staticwhite-secondary-content-color-disabled
)}:host([static=white][variant=secondary][treatment=outline]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticwhite-secondary-outline-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticwhite-secondary-outline-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticwhite-secondary-outline-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticwhite-secondary-outline-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-staticwhite-secondary-outline-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticwhite-secondary-outline-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticwhite-secondary-outline-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticwhite-secondary-outline-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-staticwhite-secondary-outline-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-staticwhite-secondary-outline-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-staticwhite-secondary-outline-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-staticwhite-secondary-outline-content-color-focus
);--spectrum-button-focus-indicator-color:var(
--system-spectrum-button-staticwhite-secondary-outline-focus-indicator-color
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticwhite-secondary-outline-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticwhite-secondary-outline-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-staticwhite-secondary-outline-content-color-disabled
)}:host([static=black]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticblack-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticblack-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticblack-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticblack-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-staticblack-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticblack-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticblack-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticblack-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-staticblack-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-staticblack-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-staticblack-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-staticblack-content-color-focus
);--spectrum-button-focus-indicator-color:var(
--system-spectrum-button-staticblack-focus-indicator-color
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticblack-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticblack-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-staticblack-content-color-disabled
)}:host([static=black][treatment=outline]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticblack-outline-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticblack-outline-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticblack-outline-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticblack-outline-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-staticblack-outline-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticblack-outline-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticblack-outline-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticblack-outline-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-staticblack-outline-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-staticblack-outline-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-staticblack-outline-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-staticblack-outline-content-color-focus
);--spectrum-button-focus-indicator-color:var(
--system-spectrum-button-staticblack-outline-focus-indicator-color
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticblack-outline-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticblack-outline-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-staticblack-outline-content-color-disabled
)}:host([static=black][variant=secondary]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticblack-secondary-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticblack-secondary-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticblack-secondary-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticblack-secondary-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-staticblack-secondary-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticblack-secondary-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticblack-secondary-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticblack-secondary-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-staticblack-secondary-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-staticblack-secondary-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-staticblack-secondary-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-staticblack-secondary-content-color-focus
);--spectrum-button-focus-indicator-color:var(
--system-spectrum-button-staticblack-secondary-focus-indicator-color
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticblack-secondary-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticblack-secondary-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-staticblack-secondary-content-color-disabled
)}:host([static=black][variant=secondary][treatment=outline]){--spectrum-button-background-color-default:var(
--system-spectrum-button-staticblack-secondary-outline-background-color-default
);--spectrum-button-background-color-hover:var(
--system-spectrum-button-staticblack-secondary-outline-background-color-hover
);--spectrum-button-background-color-down:var(
--system-spectrum-button-staticblack-secondary-outline-background-color-down
);--spectrum-button-background-color-focus:var(
--system-spectrum-button-staticblack-secondary-outline-background-color-focus
);--spectrum-button-border-color-default:var(
--system-spectrum-button-staticblack-secondary-outline-border-color-default
);--spectrum-button-border-color-hover:var(
--system-spectrum-button-staticblack-secondary-outline-border-color-hover
);--spectrum-button-border-color-down:var(
--system-spectrum-button-staticblack-secondary-outline-border-color-down
);--spectrum-button-border-color-focus:var(
--system-spectrum-button-staticblack-secondary-outline-border-color-focus
);--spectrum-button-content-color-default:var(
--system-spectrum-button-staticblack-secondary-outline-content-color-default
);--spectrum-button-content-color-hover:var(
--system-spectrum-button-staticblack-secondary-outline-content-color-hover
);--spectrum-button-content-color-down:var(
--system-spectrum-button-staticblack-secondary-outline-content-color-down
);--spectrum-button-content-color-focus:var(
--system-spectrum-button-staticblack-secondary-outline-content-color-focus
);--spectrum-button-focus-indicator-color:var(
--system-spectrum-button-staticblack-secondary-outline-focus-indicator-color
);--spectrum-button-background-color-disabled:var(
--system-spectrum-button-staticblack-secondary-outline-background-color-disabled
);--spectrum-button-border-color-disabled:var(
--system-spectrum-button-staticblack-secondary-outline-border-color-disabled
);--spectrum-button-content-color-disabled:var(
--system-spectrum-button-staticblack-secondary-outline-content-color-disabled
)}@media (forced-colors:active){:host([treatment][disabled]){border-color:graytext}:host([treatment]:not([disabled]):hover){border-color:highlight}}
`,$o=ac;var cc=Object.defineProperty,ic=Object.getOwnPropertyDescriptor,Ne=(s,t,e,r)=>{for(var o=r>1?void 0:r?ic(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&cc(t,e,o),o},nc=["accent","primary","secondary","negative","white","black"];var Dt=class extends H(yt,{noDefaultSize:!0}){constructor(){super(...arguments),this._variant="accent",this.treatment="fill"}static get styles(){return[...super.styles,$o]}get variant(){return this._variant}set variant(t){if(t!==this.variant){switch(this.requestUpdate("variant",this.variant),t){case"cta":this._variant="accent";break;case"overBackground":this.removeAttribute("variant"),this.static="white",this.treatment="outline";return;case"white":case"black":this.static=t,this.removeAttribute("variant");return;case null:return;default:nc.includes(t)?this._variant=t:this._variant="accent";break}this.setAttribute("variant",this.variant)}}set quiet(t){this.treatment=t?"outline":"fill"}firstUpdated(t){super.firstUpdated(t),this.hasAttribute("variant")||this.setAttribute("variant",this.variant)}};Ne([(0,n.property)()],Dt.prototype,"variant",1),Ne([(0,n.property)({type:String,reflect:!0})],Dt.prototype,"static",2),Ne([(0,n.property)({reflect:!0})],Dt.prototype,"treatment",2),Ne([(0,n.property)({type:Boolean})],Dt.prototype,"quiet",1);P();b("sp-button",Dt);h();S();h();S();Ft();var lc=Object.defineProperty,uc=Object.getOwnPropertyDescriptor,Vr=(s,t,e,r)=>{for(var o=r>1?void 0:r?uc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&lc(t,e,o),o},Ut=class extends U{constructor(){super(...arguments),this.checked=!1,this.readonly=!1}get focusElement(){return this.inputElement}handleChange(){if(this.readonly){this.inputElement.checked=this.checked;return}this.checked=this.inputElement.checked;let t=new CustomEvent("change",{bubbles:!0,cancelable:!0,composed:!0});this.dispatchEvent(t)||(this.checked=!this.inputElement.checked,this.inputElement.checked=this.checked)}render(){return i.html`
            <input
                id="input"
                type="checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
        `}};Vr([(0,n.property)({type:Boolean,reflect:!0})],Ut.prototype,"checked",2),Vr([(0,n.property)({type:Boolean,reflect:!0})],Ut.prototype,"readonly",2),Vr([(0,n.query)("#input")],Ut.prototype,"inputElement",2);h();h();S();h();var mc=i.css`
:host{fill:currentColor;color:var(--mod-icon-color,inherit);display:inline-block;pointer-events:none}:host(:not(:root)){overflow:hidden}@media (forced-colors:active){:host{forced-color-adjust:auto}}:host{--spectrum-icon-size-s:var(
--spectrum-alias-workflow-icon-size-s,var(--spectrum-global-dimension-size-200)
);--spectrum-icon-size-m:var(
--spectrum-alias-workflow-icon-size-m,var(--spectrum-global-dimension-size-225)
);--spectrum-icon-size-l:var(--spectrum-alias-workflow-icon-size-l);--spectrum-icon-size-xl:var(
--spectrum-alias-workflow-icon-size-xl,var(--spectrum-global-dimension-size-275)
);--spectrum-icon-size-xxl:var(--spectrum-global-dimension-size-400)}:host([size=s]){height:var(--spectrum-icon-size-s);width:var(--spectrum-icon-size-s)}:host([size=m]){height:var(--spectrum-icon-size-m);width:var(--spectrum-icon-size-m)}:host([size=l]){height:var(--spectrum-icon-size-l);width:var(--spectrum-icon-size-l)}:host([size=xl]){height:var(--spectrum-icon-size-xl);width:var(--spectrum-icon-size-xl)}:host([size=xxl]){height:var(--spectrum-icon-size-xxl);width:var(--spectrum-icon-size-xxl)}:host{--spectrum-icon-size-xxs:var(
--spectrum-alias-workflow-icon-size-xxs,var(--spectrum-global-dimension-size-150)
);--spectrum-icon-size-xs:var(
--spectrum-alias-workflow-icon-size-xs,var(--spectrum-global-dimension-size-175)
);height:var(
--spectrum-icon-tshirt-size-height,var(
--spectrum-alias-workflow-icon-size,var(--spectrum-global-dimension-size-225)
)
);width:var(
--spectrum-icon-tshirt-size-width,var(
--spectrum-alias-workflow-icon-size,var(--spectrum-global-dimension-size-225)
)
)}:host([size=xxs]){height:var(--spectrum-icon-size-xxs);width:var(--spectrum-icon-size-xxs)}:host([size=xs]){height:var(--spectrum-icon-size-xs);width:var(--spectrum-icon-size-xs)}#container{height:100%}::slotted(*),img,svg{color:inherit;height:100%;vertical-align:top;width:100%}@media (forced-colors:active){::slotted(*),img,svg{forced-color-adjust:auto}}
`,Bo=mc;var pc=Object.defineProperty,dc=Object.getOwnPropertyDescriptor,Fo=(s,t,e,r)=>{for(var o=r>1?void 0:r?dc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&pc(t,e,o),o},T=class extends I{constructor(){super(...arguments),this.label=""}static get styles(){return[Bo]}update(t){t.has("label")&&(this.label?this.removeAttribute("aria-hidden"):this.setAttribute("aria-hidden","true")),super.update(t)}render(){return i.html`
            <slot></slot>
        `}};Fo([(0,n.property)()],T.prototype,"label",2),Fo([(0,n.property)({reflect:!0})],T.prototype,"size",2);var Kr,j=function(s,...t){return Kr?Kr(s,...t):t.reduce((e,r,o)=>e+r+s[o+1],s[0])},A=s=>{Kr=s};var Uo=({width:s=24,height:t=24,title:e="Checkmark75"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M3.667 9.07a.96.96 0 01-.737-.344L.753 6.114a.96.96 0 111.474-1.23l1.418 1.701 4.112-5.233a.96.96 0 011.51 1.186L4.422 8.704a.962.962 0 01-.741.367z"
    />
  </svg>`;var Ve=class extends T{render(){return A(i.html),Uo()}};P();b("sp-icon-checkmark75",Ve);h();var Ro=({width:s=24,height:t=24,title:e="Checkmark100"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M3.5 9.5a.999.999 0 01-.774-.368l-2.45-3a1 1 0 111.548-1.264l1.657 2.028 4.68-6.01A1 1 0 019.74 2.114l-5.45 7a1 1 0 01-.777.386z"
    />
  </svg>`;var Ke=class extends T{render(){return A(i.html),Ro()}};P();b("sp-icon-checkmark100",Ke);h();var Mo=({width:s=24,height:t=24,title:e="Checkmark200"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M4.313 10.98a1.042 1.042 0 01-.8-.375L.647 7.165a1.042 1.042 0 011.6-1.333l2.042 2.45 5.443-6.928a1.042 1.042 0 011.64 1.287l-6.24 7.94a1.04 1.04 0 01-.804.399z"
    />
  </svg>`;var We=class extends T{render(){return A(i.html),Mo()}};P();b("sp-icon-checkmark200",We);h();var _o=({width:s=24,height:t=24,title:e="Checkmark300"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 14 14"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M5.102 12.514a1.087 1.087 0 01-.834-.39L.988 8.19A1.085 1.085 0 012.656 6.8l2.421 2.906 6.243-7.947a1.085 1.085 0 011.707 1.34L5.955 12.1a1.089 1.089 0 01-.838.415z"
    />
  </svg>`;var Ge=class extends T{render(){return A(i.html),_o()}};P();b("sp-icon-checkmark300",Ge);h();var No=({width:s=24,height:t=24,title:e="Dash75"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 8 8"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path d="M6.99 4.96H1.01a.96.96 0 010-1.92h5.98a.96.96 0 010 1.92z" />
  </svg>`;var Xe=class extends T{render(){return A(i.html),No()}};P();b("sp-icon-dash75",Xe);h();var Vo=({width:s=24,height:t=24,title:e="Dash100"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path d="M8.5 6h-7a1 1 0 010-2h7a1 1 0 010 2z" />
  </svg>`;var Ye=class extends T{render(){return A(i.html),Vo()}};P();b("sp-icon-dash100",Ye);h();var Ko=({width:s=24,height:t=24,title:e="Dash200"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path d="M10.021 7.042H1.98a1.042 1.042 0 110-2.083h8.043a1.042 1.042 0 010 2.083z" />
  </svg>`;var Ze=class extends T{render(){return A(i.html),Ko()}};P();b("sp-icon-dash200",Ze);h();var Wo=({width:s=24,height:t=24,title:e="Dash300"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path d="M10.61 7.085H1.39a1.085 1.085 0 010-2.17h9.22a1.085 1.085 0 010 2.17z" />
  </svg>`;var Qe=class extends T{render(){return A(i.html),Wo()}};P();b("sp-icon-dash300",Qe);h();var hc=i.css`
:host{--spectrum-checkbox-content-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-checkbox-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-checkbox-content-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-checkbox-content-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-checkbox-focus-indicator-color:var(
--spectrum-focus-indicator-color
);--spectrum-checkbox-content-color-disabled:var(
--spectrum-disabled-content-color
);--spectrum-checkbox-control-color-disabled:var(
--spectrum-disabled-content-color
);--spectrum-checkbox-checkmark-color:var(--spectrum-gray-75);--spectrum-checkbox-invalid-color-default:var(
--spectrum-negative-color-900
);--spectrum-checkbox-invalid-color-hover:var(
--spectrum-negative-color-1000
);--spectrum-checkbox-invalid-color-down:var(--spectrum-negative-color-1100);--spectrum-checkbox-invalid-color-focus:var(
--spectrum-negative-color-1000
);--spectrum-checkbox-emphasized-color-default:var(
--spectrum-accent-color-900
);--spectrum-checkbox-emphasized-color-hover:var(
--spectrum-accent-color-1000
);--spectrum-checkbox-emphasized-color-down:var(
--spectrum-accent-color-1100
);--spectrum-checkbox-emphasized-color-focus:var(
--spectrum-accent-color-1000
);--spectrum-checkbox-control-selected-color-default:var(
--spectrum-neutral-background-color-selected-default
);--spectrum-checkbox-control-selected-color-hover:var(
--spectrum-neutral-background-color-selected-hover
);--spectrum-checkbox-control-selected-color-down:var(
--spectrum-neutral-background-color-selected-down
);--spectrum-checkbox-control-selected-color-focus:var(
--spectrum-neutral-background-color-selected-key-focus
);--spectrum-checkbox-line-height:var(--spectrum-line-height-100);--spectrum-checkbox-line-height-cjk:var(--spectrum-cjk-line-height-100);--spectrum-checkbox-control-corner-radius:var(--spectrum-corner-radius-75);--spectrum-checkbox-focus-indicator-gap:var(
--spectrum-focus-indicator-gap
);--spectrum-checkbox-focus-indicator-thickness:var(
--spectrum-focus-indicator-thickness
);--spectrum-checkbox-border-width:var(--spectrum-border-width-200);--spectrum-checkbox-selected-border-width:calc(var(--spectrum-checkbox-control-size)/2);--spectrum-checkbox-animation-duration:var(
--spectrum-animation-duration-100
)}:host([size=s]){--spectrum-checkbox-font-size:var(--spectrum-font-size-75);--spectrum-checkbox-height:var(--spectrum-component-height-75);--spectrum-checkbox-control-size:var(
--spectrum-checkbox-control-size-small
);--spectrum-checkbox-top-to-text:var(--spectrum-component-top-to-text-75);--spectrum-checkbox-text-to-control:var(--spectrum-text-to-control-75)}:host{--spectrum-checkbox-font-size:var(--spectrum-font-size-100);--spectrum-checkbox-height:var(--spectrum-component-height-100);--spectrum-checkbox-control-size:var(
--spectrum-checkbox-control-size-medium
);--spectrum-checkbox-top-to-text:var(--spectrum-component-top-to-text-100);--spectrum-checkbox-text-to-control:var(--spectrum-text-to-control-100)}:host([size=l]){--spectrum-checkbox-font-size:var(--spectrum-font-size-200);--spectrum-checkbox-height:var(--spectrum-component-height-200);--spectrum-checkbox-control-size:var(
--spectrum-checkbox-control-size-large
);--spectrum-checkbox-top-to-text:var(--spectrum-component-top-to-text-200);--spectrum-checkbox-text-to-control:var(--spectrum-text-to-control-200)}:host([size=xl]){--spectrum-checkbox-font-size:var(--spectrum-font-size-300);--spectrum-checkbox-height:var(--spectrum-component-height-300);--spectrum-checkbox-control-size:var(
--spectrum-checkbox-control-size-extra-large
);--spectrum-checkbox-top-to-text:var(--spectrum-component-top-to-text-300);--spectrum-checkbox-text-to-control:var(--spectrum-text-to-control-300)}:host{align-items:flex-start;color:var(
--highcontrast-checkbox-content-color-default,var(
--mod-checkbox-content-color-default,var(--spectrum-checkbox-content-color-default)
)
);max-inline-size:100%;min-block-size:var(--mod-checkbox-height,var(--spectrum-checkbox-height));position:relative}:host(:hover) #box:before{border-color:var(
--highcontrast-checkbox-highlight-color-hover,var(
--mod-checkbox-control-color-hover,var(--spectrum-checkbox-control-color-hover)
)
)}:host(:hover) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-hover,var(
--mod-checkbox-control-selected-color-hover,var(--spectrum-checkbox-control-selected-color-hover)
)
)}:host(:hover) #label{color:var(
--highcontrast-checkbox-content-color-hover,var(
--mod-checkbox-content-color-hover,var(--spectrum-checkbox-content-color-hover)
)
)}:host:active #box:before{border-color:var(
--highcontrast-checkbox-highlight-color-down,var(
--mod-checkbox-control-color-down,var(--spectrum-checkbox-control-color-down)
)
)}:host:active #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-down,var(
--mod-checkbox-control-selected-color-down,var(--spectrum-checkbox-control-selected-color-down)
)
)}:host:active #label{color:var(
--highcontrast-checkbox-content-color-down,var(
--mod-checkbox-content-color-down,var(--spectrum-checkbox-content-color-down)
)
)}:host([invalid][invalid]) #box:before,:host([invalid][invalid]) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-invalid-color-default,var(--spectrum-checkbox-invalid-color-default)
)
)}:host([invalid][invalid]) #input.focus-visible+#box:before,:host([invalid][invalid][indeterminate]) #input.focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-color-hover,var(
--mod-checkbox-invalid-color-hover,var(--spectrum-checkbox-invalid-color-hover)
)
)}:host([invalid][invalid]) #input.focus-visible+#box:before,:host([invalid][invalid][indeterminate]) #input.focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-color-hover,var(
--mod-checkbox-invalid-color-hover,var(--spectrum-checkbox-invalid-color-hover)
)
)}:host([invalid][invalid]) #input:focus-visible+#box:before,:host([invalid][invalid][indeterminate]) #input:focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-color-hover,var(
--mod-checkbox-invalid-color-hover,var(--spectrum-checkbox-invalid-color-hover)
)
)}:host([invalid][invalid]:hover) #box:before,:host([invalid][invalid]:hover) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-hover,var(
--mod-checkbox-invalid-color-hover,var(--spectrum-checkbox-invalid-color-hover)
)
)}:host([readonly]){border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-control-selected-color-default,var(--spectrum-checkbox-control-selected-color-default)
)
)}:host([readonly]:hover) #box:before{border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-control-selected-color-default,var(--spectrum-checkbox-control-selected-color-default)
)
)}:host([readonly]):active #box:before{border-color:var(
--highcontrast-checkbox-selected-color-default,var(
--mod-checkbox-control-selected-color-default,var(--spectrum-checkbox-control-selected-color-default)
)
)}:host([readonly]) #input:checked:disabled+#box:before,:host([readonly]) #input:disabled+#box:before{background-color:var(
--highcontrast-checkbox-background-color-default,var(
--mod-checkbox-checkmark-color,var(--spectrum-checkbox-checkmark-color)
)
);border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-control-selected-color-default,var(--spectrum-checkbox-control-selected-color-default)
)
)}:host([readonly]) #input:checked:disabled~#label,:host([readonly]) #input:disabled~#label{color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-content-color-default,var(--spectrum-checkbox-content-color-default)
)
);forced-color-adjust:none}:host([indeterminate]) #box:before,:host([indeterminate]) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-default,var(
--mod-checkbox-control-selected-color-default,var(--spectrum-checkbox-control-selected-color-default)
)
);border-width:var(
--mod-checkbox-selected-border-width,var(--spectrum-checkbox-selected-border-width)
)}:host([indeterminate]) #box #checkmark,:host([indeterminate]) #input:checked+#box #checkmark{display:none}:host([indeterminate]) #box #partialCheckmark,:host([indeterminate]) #input:checked+#box #partialCheckmark{display:block;opacity:1;transform:scale(1)}:host([indeterminate]) #input.focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-control-selected-color-focus,var(--spectrum-checkbox-control-selected-color-focus)
)
)}:host([indeterminate]) #input.focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-control-selected-color-focus,var(--spectrum-checkbox-control-selected-color-focus)
)
)}:host([indeterminate]) #input:focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-control-selected-color-focus,var(--spectrum-checkbox-control-selected-color-focus)
)
)}:host([indeterminate]:hover) #box:before,:host([indeterminate]:hover) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-hover,var(
--mod-checkbox-control-selected-color-hover,var(--spectrum-checkbox-control-selected-color-hover)
)
)}:host([invalid][invalid][indeterminate]) #box:before,:host([invalid][invalid][indeterminate]) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-invalid-color-default,var(--spectrum-checkbox-invalid-color-default)
)
);border-width:var(
--mod-checkbox-selected-border-width,var(--spectrum-checkbox-selected-border-width)
)}:host([invalid][invalid][indeterminate]:hover) #box:before,:host([invalid][invalid][indeterminate]:hover) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-invalid-color-hover,var(--spectrum-checkbox-invalid-color-hover)
)
)}:host([invalid][invalid][indeterminate]:hover) #label{color:var(
--highcontrast-checkbox-content-color-hover,var(
--mod-checkbox-content-color-hover,var(--spectrum-checkbox-content-color-hover)
)
)}:host([emphasized]) #input:checked+#box:before,:host([emphasized][indeterminate]) #box:before,:host([emphasized][indeterminate]) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-default,var(
--mod-checkbox-emphasized-color-default,var(--spectrum-checkbox-emphasized-color-default)
)
)}:host([emphasized]:hover) #input:checked+#box:before,:host([emphasized][indeterminate]:hover) #box:before,:host([emphasized][indeterminate]:hover) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-hover,var(
--mod-checkbox-emphasized-color-hover,var(--spectrum-checkbox-emphasized-color-hover)
)
)}:host([emphasized]) #input.focus-visible:checked+#box:before,:host([emphasized][indeterminate]) #input.focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-emphasized-color-focus,var(--spectrum-checkbox-emphasized-color-focus)
)
)}:host([emphasized]) #input.focus-visible:checked+#box:before,:host([emphasized][indeterminate]) #input.focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-emphasized-color-focus,var(--spectrum-checkbox-emphasized-color-focus)
)
)}:host([emphasized]) #input:focus-visible:checked+#box:before,:host([emphasized][indeterminate]) #input:focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-emphasized-color-focus,var(--spectrum-checkbox-emphasized-color-focus)
)
)}:host([emphasized][invalid][invalid]) #input.focus-visible:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-invalid-color-focus,var(--spectrum-checkbox-invalid-color-focus)
)
)}:host([emphasized][invalid][invalid]) #input.focus-visible:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-invalid-color-focus,var(--spectrum-checkbox-invalid-color-focus)
)
)}:host([emphasized][invalid][invalid]) #input:focus-visible:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-invalid-color-focus,var(--spectrum-checkbox-invalid-color-focus)
)
)}:host([emphasized][invalid][invalid]:hover) #input:checked+#box:before,:host([emphasized][invalid][invalid][indeterminate]:hover) #box:before,:host([emphasized][invalid][invalid][indeterminate]:hover) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-hover,var(
--mod-checkbox-invalid-color-hover,var(--spectrum-checkbox-invalid-color-hover)
)
)}:host([emphasized]:hover) #input:checked+#box:before,:host([emphasized][indeterminate]:hover) #box:before,:host([emphasized][indeterminate]:hover) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-hover,var(
--mod-checkbox-emphasized-color-hover,var(--spectrum-checkbox-emphasized-color-hover)
)
)}:host([emphasized]):active #input:checked+#box:before,:host([emphasized][indeterminate]):active #box:before,:host([emphasized][indeterminate]):active #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-default,var(
--mod-checkbox-emphasized-color-down,var(--spectrum-checkbox-emphasized-color-down)
)
)}:host([emphasized][invalid][invalid]):active #box:before,:host([emphasized][invalid][invalid]):active #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-default,var(
--mod-checkbox-control-invalid-color-down,var(--spectrum-checkbox-invalid-color-down)
)
)}:host([emphasized].focus-visible) #box:before,:host([emphasized].focus-visible) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-focus,var(
--mod-checkbox-control-color-focus,var(--spectrum-checkbox-control-color-focus)
)
)}:host([emphasized].focus-visible) #box:before,:host([emphasized].focus-visible) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-focus,var(
--mod-checkbox-control-color-focus,var(--spectrum-checkbox-control-color-focus)
)
)}:host([emphasized]:focus-visible) #box:before,:host([emphasized]:focus-visible) #input:checked+#box:before{border-color:var(
--highcontrast-checkbox-color-focus,var(
--mod-checkbox-control-color-focus,var(--spectrum-checkbox-control-color-focus)
)
)}#label{font-size:var(
--mod-checkbox-font-size,var(--spectrum-checkbox-font-size)
);line-height:var(
--mod-checkbox-line-height,var(--spectrum-checkbox-line-height)
);margin-block-start:var(
--mod-checkbox-top-to-text,var(--spectrum-checkbox-top-to-text)
);margin-inline-start:var(
--mod-checkbox-text-to-control,var(--spectrum-checkbox-text-to-control)
);text-align:start;transition:color var(
--mod-checkbox-animation-duration,var(--spectrum-checkbox-animation-duration)
) ease-in-out}#label:lang(ja),#label:lang(ko),#label:lang(zh){line-height:var(
--mod-checkbox-line-height-cjk,var(--spectrum-checkbox-line-height-cjk)
)}#input{block-size:100%;box-sizing:border-box;color:var(
--mod-checkbox-control-color-default,var(--spectrum-checkbox-control-color-default)
);cursor:pointer;font-family:inherit;font-size:100%;inline-size:100%;line-height:1.15;margin:0;opacity:.0001;overflow:visible;padding:0;position:absolute;z-index:1}#input:disabled{cursor:default}#input:checked+#box:before{background-color:var(
--mod-checkbox-checkmark-color,var(--spectrum-checkbox-checkmark-color)
);border-color:var(
--highcontrast-checkbox-highlight-color-default,var(
--mod-checkbox-control-selected-color-default,var(--spectrum-checkbox-control-selected-color-default)
)
);border-width:var(
--mod-checkbox-selected-border-width,var(--spectrum-checkbox-selected-border-width)
)}#input:checked+#box #checkmark{opacity:1;transform:scale(1)}#input.focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-color-focus,var(
--mod-checkbox-control-color-focus,var(--spectrum-checkbox-control-color-focus)
)
)}#input.focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-color-focus,var(
--mod-checkbox-control-color-focus,var(--spectrum-checkbox-control-color-focus)
)
)}#input:focus-visible+#box:before{border-color:var(
--highcontrast-checkbox-color-focus,var(
--mod-checkbox-control-color-focus,var(--spectrum-checkbox-control-color-focus)
)
)}#input.focus-visible+#box:after{box-shadow:0 0 0 var(
--mod-checkbox-focus-indicator-thinkness,var(--spectrum-checkbox-focus-indicator-thickness)
) var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
);forced-color-adjust:none;margin:calc(var(
--mod-checkbox-focus-indicator-gap,
var(--spectrum-checkbox-focus-indicator-gap)
)*-1)}#input.focus-visible+#box:after{box-shadow:0 0 0 var(
--mod-checkbox-focus-indicator-thinkness,var(--spectrum-checkbox-focus-indicator-thickness)
) var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
);forced-color-adjust:none;margin:calc(var(
--mod-checkbox-focus-indicator-gap,
var(--spectrum-checkbox-focus-indicator-gap)
)*-1)}#input:focus-visible+#box:after{box-shadow:0 0 0 var(
--mod-checkbox-focus-indicator-thinkness,var(--spectrum-checkbox-focus-indicator-thickness)
) var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
);forced-color-adjust:none;margin:calc(var(
--mod-checkbox-focus-indicator-gap,
var(--spectrum-checkbox-focus-indicator-gap)
)*-1)}#input.focus-visible+#label{color:var(
--highcontrast-checkbox-content-color-focus,var(
--mod-checkbox-content-color-focus,var(--spectrum-checkbox-content-color-focus)
)
)}#input.focus-visible+#label{color:var(
--highcontrast-checkbox-content-color-focus,var(
--mod-checkbox-content-color-focus,var(--spectrum-checkbox-content-color-focus)
)
)}#input:focus-visible+#label{color:var(
--highcontrast-checkbox-content-color-focus,var(
--mod-checkbox-content-color-focus,var(--spectrum-checkbox-content-color-focus)
)
)}#input.focus-visible:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-control-selected-color-focus,var(--spectrum-checkbox-control-selected-color-focus)
)
)}#input.focus-visible:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-control-selected-color-focus,var(--spectrum-checkbox-control-selected-color-focus)
)
)}#input:focus-visible:checked+#box:before{border-color:var(
--highcontrast-checkbox-highlight-color-focus,var(
--mod-checkbox-control-selected-color-focus,var(--spectrum-checkbox-control-selected-color-focus)
)
)}#box{--spectrum-checkbox-spacing:calc(var(--mod-checkbox-height, var(--spectrum-checkbox-height)) - var(
--mod-checkbox-control-size,
var(--spectrum-checkbox-control-size)
));align-items:center;block-size:var(
--mod-checkbox-control-size,var(--spectrum-checkbox-control-size)
);box-sizing:border-box;display:flex;flex-grow:0;flex-shrink:0;inline-size:var(
--mod-checkbox-control-size,var(--spectrum-checkbox-control-size)
);justify-content:center;margin:calc(var(--mod-checkbox-spacing, var(--spectrum-checkbox-spacing))/2) 0;position:relative}#box:before{border-color:var(
--highcontrast-checkbox-color-default,var(
--mod-checkbox-control-color-default,var(--spectrum-checkbox-control-color-default)
)
);border-radius:var(
--mod-checkbox-control-corner-radius,var(--spectrum-checkbox-control-corner-radius)
);border-style:solid;border-width:var(
--mod-checkbox-border-width,var(--spectrum-checkbox-border-width)
);box-sizing:border-box;content:"";display:block;forced-color-adjust:none;height:var(
--mod-checkbox-control-size,var(--spectrum-checkbox-control-size)
);position:absolute;transition:border var(
--mod-checkbox-animation-duration,var(--spectrum-checkbox-animation-duration)
) ease-in-out,box-shadow var(
--mod-checkbox-animation-duration,var(--spectrum-checkbox-animation-duration)
) ease-in-out;width:var(
--mod-checkbox-control-size,var(--spectrum-checkbox-control-size)
);z-index:0}#box:after{border-radius:calc(var(
--mod-checkbox-control-corner-radius,
var(--spectrum-checkbox-control-corner-radius)
) + var(
--mod-checkbox-focus-indicator-gap,
var(--spectrum-checkbox-focus-indicator-gap)
));content:"";display:block;inset:0;margin:var(
--mod-checkbox-focus-indicator-gap,var(--spectrum-checkbox-focus-indicator-gap)
);position:absolute;transform:translate(0);transition:box-shadow var(
--mod-checkbox-animation-duration,var(--spectrum-checkbox-animation-duration)
) ease-out,margin var(
--mod-checkbox-animation-duration,var(--spectrum-checkbox-animation-duration)
) ease-out}#checkmark,#partialCheckmark{color:var(
--highcontrast-checkbox-background-color-default,var(
--mode-checkbox-checkmark-color,var(--spectrum-checkbox-checkmark-color)
)
);opacity:0;transform:scale(0);transition:opacity var(
--mod-checkbox-animation-duration,var(--spectrum-checkbox-animation-duration)
) ease-in-out,transform var(
--mod-checkbox-animation-duration,var(--spectrum-checkbox-animation-duration)
) ease-in-out}#partialCheckmark{display:none}#input:checked:disabled+#box:before,#input:disabled+#box:before{background-color:var(
--highcontrast-checkbox-background-color-default,var(
--mod-checkbox-checkmark-color,var(--spectrum-checkbox-checkmark-color)
)
);border-color:var(
--highcontrast-checkbox-disabled-color-default,var(
--mod-checkbox-control-color-disabled,var(--spectrum-checkbox-control-color-disabled)
)
)}#input:checked:disabled~#label,#input:disabled~#label{color:var(
--highcontrast-checkbox-disabled-color-default,var(
--mod-checkbox-content-color-disabled,var(--spectrum-checkbox-content-color-disabled)
)
);forced-color-adjust:none}@media (forced-colors:active){#input.focus-visible+#box{forced-color-adjust:none;outline-color:var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
);outline-offset:var(
--highcontrast-checkbox-focus-indicator-gap,var(
--mod-checkbox-focus-indicator-gap,var(--spectrum-checkbox-focus-indicator-gap)
)
);outline-style:auto;outline-width:var(
--mod-focus-indicator-thickness,var(--spectrum-focus-indicator-thickness)
)}#input.focus-visible+#box{forced-color-adjust:none;outline-color:var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
);outline-offset:var(
--highcontrast-checkbox-focus-indicator-gap,var(
--mod-checkbox-focus-indicator-gap,var(--spectrum-checkbox-focus-indicator-gap)
)
);outline-style:auto;outline-width:var(
--mod-focus-indicator-thickness,var(--spectrum-focus-indicator-thickness)
)}#input:focus-visible+#box{forced-color-adjust:none;outline-color:var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
);outline-offset:var(
--highcontrast-checkbox-focus-indicator-gap,var(
--mod-checkbox-focus-indicator-gap,var(--spectrum-checkbox-focus-indicator-gap)
)
);outline-style:auto;outline-width:var(
--mod-focus-indicator-thickness,var(--spectrum-focus-indicator-thickness)
)}#input.focus-visible+#box:after{box-shadow:0 0 0 0 var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
)}#input.focus-visible+#box:after{box-shadow:0 0 0 0 var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
)}#input:focus-visible+#box:after{box-shadow:0 0 0 0 var(
--highcontrast-checkbox-focus-indicator-color,var(
--mod-checkbox-focus-indicator-color,var(--spectrum-checkbox-focus-indicator-color)
)
)}:host{--highcontrast-checkbox-content-color-default:CanvasText;--highcontrast-checkbox-content-color-hover:CanvasText;--highcontrast-checkbox-content-color-down:CanvasText;--highcontrast-checkbox-content-color-focus:CanvasText;--highcontrast-checkbox-background-color-default:Canvas;--highcontrast-checkbox-color-default:ButtonText;--highcontrast-checkbox-color-hover:ButtonText;--highcontrast-checkbox-color-focus:Highlight;--highcontrast-checkbox-highlight-color-default:Highlight;--highcontrast-checkbox-highlight-color-hover:Highlight;--highcontrast-checkbox-highlight-color-down:Highlight;--highcontrast-checkbox-highlight-color-focus:Highlight;--highcontrast-checkbox-disabled-color-default:GrayText;--highcontrast-checkbox-focus-indicator-color:CanvasText}}:host{--spectrum-checkbox-control-color-default:var(
--system-spectrum-checkbox-control-color-default
);--spectrum-checkbox-control-color-hover:var(
--system-spectrum-checkbox-control-color-hover
);--spectrum-checkbox-control-color-down:var(
--system-spectrum-checkbox-control-color-down
);--spectrum-checkbox-control-color-focus:var(
--system-spectrum-checkbox-control-color-focus
)}:host{display:inline-flex;vertical-align:top}:host(:focus){outline:none}:host([disabled]){pointer-events:none}:host(:empty) label{display:none}
`,Go=hc;h();var gc=i.css`
.spectrum-UIIcon-Checkmark50{height:var(--spectrum-alias-ui-icon-checkmark-size-50);width:var(--spectrum-alias-ui-icon-checkmark-size-50)}.spectrum-UIIcon-Checkmark75{height:var(--spectrum-alias-ui-icon-checkmark-size-75);width:var(--spectrum-alias-ui-icon-checkmark-size-75)}.spectrum-UIIcon-Checkmark100{height:var(--spectrum-alias-ui-icon-checkmark-size-100);width:var(--spectrum-alias-ui-icon-checkmark-size-100)}.spectrum-UIIcon-Checkmark200{height:var(--spectrum-alias-ui-icon-checkmark-size-200);width:var(--spectrum-alias-ui-icon-checkmark-size-200)}.spectrum-UIIcon-Checkmark300{height:var(--spectrum-alias-ui-icon-checkmark-size-300);width:var(--spectrum-alias-ui-icon-checkmark-size-300)}.spectrum-UIIcon-Checkmark400{height:var(--spectrum-alias-ui-icon-checkmark-size-400);width:var(--spectrum-alias-ui-icon-checkmark-size-400)}.spectrum-UIIcon-Checkmark500{height:var(--spectrum-alias-ui-icon-checkmark-size-500);width:var(--spectrum-alias-ui-icon-checkmark-size-500)}.spectrum-UIIcon-Checkmark600{height:var(--spectrum-alias-ui-icon-checkmark-size-600);width:var(--spectrum-alias-ui-icon-checkmark-size-600)}
`,Jt=gc;h();var bc=i.css`
.spectrum-UIIcon-Dash50{height:var(--spectrum-alias-ui-icon-dash-size-50);width:var(--spectrum-alias-ui-icon-dash-size-50)}.spectrum-UIIcon-Dash75{height:var(--spectrum-alias-ui-icon-dash-size-75);width:var(--spectrum-alias-ui-icon-dash-size-75)}.spectrum-UIIcon-Dash100{height:var(--spectrum-alias-ui-icon-dash-size-100);width:var(--spectrum-alias-ui-icon-dash-size-100)}.spectrum-UIIcon-Dash200{height:var(--spectrum-alias-ui-icon-dash-size-200);width:var(--spectrum-alias-ui-icon-dash-size-200)}.spectrum-UIIcon-Dash300{height:var(--spectrum-alias-ui-icon-dash-size-300);width:var(--spectrum-alias-ui-icon-dash-size-300)}.spectrum-UIIcon-Dash400{height:var(--spectrum-alias-ui-icon-dash-size-400);width:var(--spectrum-alias-ui-icon-dash-size-400)}.spectrum-UIIcon-Dash500{height:var(--spectrum-alias-ui-icon-dash-size-500);width:var(--spectrum-alias-ui-icon-dash-size-500)}.spectrum-UIIcon-Dash600{height:var(--spectrum-alias-ui-icon-dash-size-600);width:var(--spectrum-alias-ui-icon-dash-size-600)}
`,Xo=bc;var vc=Object.defineProperty,fc=Object.getOwnPropertyDescriptor,Wr=(s,t,e,r)=>{for(var o=r>1?void 0:r?fc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&vc(t,e,o),o},yc={s:i.html`
        <sp-icon-checkmark75
            id="checkmark"
            class="spectrum-Icon spectrum-UIIcon-Checkmark75"
        ></sp-icon-checkmark75>
    `,m:i.html`
        <sp-icon-checkmark100
            id="checkmark"
            class="spectrum-Icon spectrum-UIIcon-Checkmark100"
        ></sp-icon-checkmark100>
    `,l:i.html`
        <sp-icon-checkmark200
            id="checkmark"
            class="spectrum-Icon spectrum-UIIcon-Checkmark200"
        ></sp-icon-checkmark200>
    `,xl:i.html`
        <sp-icon-checkmark300
            id="checkmark"
            class="spectrum-Icon spectrum-UIIcon-Checkmark300"
        ></sp-icon-checkmark300>
    `},xc={s:i.html`
        <sp-icon-dash75
            id="partialCheckmark"
            class="spectrum-Icon spectrum-UIIcon-Dash75"
        ></sp-icon-dash75>
    `,m:i.html`
        <sp-icon-dash100
            id="partialCheckmark"
            class="spectrum-Icon spectrum-UIIcon-Dash100"
        ></sp-icon-dash100>
    `,l:i.html`
        <sp-icon-dash200
            id="partialCheckmark"
            class="spectrum-Icon spectrum-UIIcon-Dash200"
        ></sp-icon-dash200>
    `,xl:i.html`
        <sp-icon-dash300
            id="partialCheckmark"
            class="spectrum-Icon spectrum-UIIcon-Dash300"
        ></sp-icon-dash300>
    `},Rt=class extends H(Ut,{noDefaultSize:!0}){constructor(){super(...arguments),this.indeterminate=!1,this.invalid=!1,this.emphasized=!1}static get styles(){return[Go,Jt,Xo]}handleChange(){this.indeterminate=!1,super.handleChange()}render(){return i.html`
            ${super.render()}
            <span id="box">
                ${yc[this.size]}
                ${xc[this.size]}
            </span>
            <label id="label" for="input"><slot></slot></label>
        `}updated(t){super.updated(t),t.has("invalid")&&(this.invalid?this.inputElement.setAttribute("aria-invalid","true"):this.inputElement.removeAttribute("aria-invalid")),t.has("indeterminate")&&(this.inputElement.indeterminate=this.indeterminate)}};Wr([(0,n.property)({type:Boolean,reflect:!0})],Rt.prototype,"indeterminate",2),Wr([(0,n.property)({type:Boolean,reflect:!0})],Rt.prototype,"invalid",2),Wr([(0,n.property)({type:Boolean,reflect:!0})],Rt.prototype,"emphasized",2);P();b("sp-checkbox",Rt);h();S();tt();h();S();h();var kc=i.css`
:host{--spectrum-overlay-animation-distance:var(
--spectrum-picker-m-texticon-popover-offset-y
);opacity:0;pointer-events:none;transition:transform var(--spectrum-global-animation-duration-100) ease-in-out,opacity var(--spectrum-global-animation-duration-100) ease-in-out,visibility 0s linear var(--spectrum-global-animation-duration-100);visibility:hidden}:host([open]){opacity:1;pointer-events:auto;transition-delay:0s;visibility:visible}:host{--spectrum-underlay-background-entry-animation-delay:var(
--spectrum-animation-duration-0
);--spectrum-underlay-background-exit-animation-ease:var(
--spectrum-animation-ease-in
);--spectrum-underlay-background-entry-animation-ease:var(
--spectrum-animation-ease-out
);--spectrum-underlay-background-entry-animation-duration:var(
--spectrum-animation-duration-600
);--spectrum-underlay-background-exit-animation-duration:var(
--spectrum-animation-duration-300
);--spectrum-underlay-background-exit-animation-delay:var(
--spectrum-animation-duration-200
);--spectrum-underlay-background-color:rgba(var(--spectrum-black-rgb),var(--spectrum-overlay-opacity))}:host{background-color:var(
--mod-underlay-background-color,var(--spectrum-underlay-background-color)
);inset-block:0;inset-inline:0;overflow:hidden;position:fixed;transition:opacity var(
--mod-underlay-background-exit-animation-duration,var(--spectrum-underlay-background-exit-animation-duration)
) var(
--mod-underlay-background-exit-animation-ease,var(--spectrum-underlay-background-exit-animation-ease)
) var(
--mod-underlay-background-exit-animation-delay,var(--spectrum-underlay-background-exit-animation-delay)
),visibility 0s linear calc(var(
--mod-underlay-background-exit-animation-delay,
var(--spectrum-underlay-background-exit-animation-delay)
) + var(
--mod-underlay-background-exit-animation-duration,
var(
--spectrum-underlay-background-exit-animation-duration
)
));z-index:1}:host([open]){transition:opacity var(
--mod-underlay-background-entry-animation-duration,var(--spectrum-underlay-background-entry-animation-duration)
) var(
--mod-underlay-background-entry-animation-ease,var(--spectrum-underlay-background-entry-animation-ease)
) var(
--mod-underlay-background-entry-animation-delay,var(--spectrum-underlay-background-entry-animation-delay)
)}
`,Yo=kc;var wc=Object.defineProperty,zc=Object.getOwnPropertyDescriptor,Cc=(s,t,e,r)=>{for(var o=r>1?void 0:r?zc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&wc(t,e,o),o},Ie=class extends I{constructor(){super(...arguments),this.open=!1}static get styles(){return[Yo]}render(){return i.html``}};Cc([(0,n.property)({type:Boolean,reflect:!0})],Ie.prototype,"open",2);P();b("sp-underlay",Ie);h();S();h();S();h();var Ec=i.css`
:host{--spectrum-divider-background-color-small:var(--spectrum-gray-300);--spectrum-divider-background-color-medium:var(--spectrum-gray-300);--spectrum-divider-background-color-large:var(--spectrum-gray-800);--spectrum-divider-background-color-small-static-white:var(
--spectrum-transparent-white-300
);--spectrum-divider-background-color-medium-static-white:var(
--spectrum-transparent-white-300
);--spectrum-divider-background-color-large-static-white:var(
--spectrum-transparent-white-800
);--spectrum-divider-background-color-small-static-black:var(
--spectrum-transparent-black-300
);--spectrum-divider-background-color-medium-static-black:var(
--spectrum-transparent-black-300
);--spectrum-divider-background-color-large-static-black:var(
--spectrum-transparent-black-800
)}:host([size=s]){--spectrum-divider-thickness:var(--spectrum-divider-thickness-small);--spectrum-divider-background-color:var(
--spectrum-divider-background-color-small
)}:host{--spectrum-divider-thickness:var(--spectrum-divider-thickness-medium);--spectrum-divider-background-color:var(
--spectrum-divider-background-color-medium
)}:host([size=l]){--spectrum-divider-thickness:var(--spectrum-divider-thickness-large);--spectrum-divider-background-color:var(
--spectrum-divider-background-color-large
)}@media (forced-colors:active){:host,:host([size=l]),:host([size=s]){--spectrum-divider-background-color:CanvasText;--spectrum-divider-background-color-small-static-white:CanvasText;--spectrum-divider-background-color-medium-static-white:CanvasText;--spectrum-divider-background-color-large-static-white:CanvasText;--spectrum-divider-background-color-small-static-black:CanvasText;--spectrum-divider-background-color-medium-static-black:CanvasText;--spectrum-divider-background-color-large-static-black:CanvasText}}:host{background-color:var(
--mod-divider-background-color,var(--spectrum-divider-background-color)
);block-size:var(--mod-divider-thickness,var(--spectrum-divider-thickness));border:none;border-radius:var(
--mod-divider-thickness,var(--spectrum-divider-thickness)
);border-width:var(
--mod-divider-thickness,var(--spectrum-divider-thickness)
);inline-size:100%;overflow:visible}:host([static=white][size=s]){--spectrum-divider-background-color:var(
--mod-divider-background-color-small-static-white,var(--spectrum-divider-background-color-small-static-white)
)}:host([static=white]){--spectrum-divider-background-color:var(
--mod-divider-background-color-medium-static-white,var(--spectrum-divider-background-color-medium-static-white)
)}:host([static=white][size=l]){--spectrum-divider-background-color:var(
--mod-divider-background-color-large-static-white,var(--spectrum-divider-background-color-large-static-white)
)}:host([static=black][size=s]){--spectrum-divider-background-color:var(
--mod-divider-background-color-small-static-black,var(--spectrum-divider-background-color-small-static-black)
)}:host([static=black]){--spectrum-divider-background-color:var(
--mod-divider-background-color-medium-static-black,var(--spectrum-divider-background-color-medium-static-black)
)}:host([static=black][size=l]){--spectrum-divider-background-color:var(
--mod-divider-background-color-large-static-black,var(--spectrum-divider-background-color-large-static-black)
)}:host([vertical]){align-self:var(--mod-divider-vertical-align);block-size:100%;inline-size:var(
--mod-divider-thickness,var(--spectrum-divider-thickness)
);height:var(--mod-divider-vertical-height);margin-block:var(--mod-divider-vertical-margin)}:host{display:block}hr{border:none;margin:0}
`,Zo=Ec;var Pc=Object.defineProperty,Ic=Object.getOwnPropertyDescriptor,Tc=(s,t,e,r)=>{for(var o=r>1?void 0:r?Ic(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Pc(t,e,o),o},te=class extends H(I,{validSizes:["s","m","l"],noDefaultSize:!0}){constructor(){super(...arguments),this.vertical=!1}render(){return i.html``}firstUpdated(t){super.firstUpdated(t),this.setAttribute("role","separator")}updated(t){super.updated(t),t.has("vertical")&&(this.vertical?this.setAttribute("aria-orientation","vertical"):this.removeAttribute("aria-orientation"))}};te.styles=[Zo],Tc([(0,n.property)({type:Boolean,reflect:!0})],te.prototype,"vertical",2);P();b("sp-divider",te);h();S();var ee=class extends yt{};h();var Sc=i.css`
:host{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;-webkit-appearance:button;border-style:solid;box-sizing:border-box;cursor:pointer;font-family:var(
--mod-sans-font-family-stack,var(--spectrum-sans-font-family-stack)
);line-height:var(--mod-line-height-100,var(--spectrum-line-height-100));margin:0;overflow:visible;-webkit-text-decoration:none;text-decoration:none;text-transform:none;transition:background var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out,border-color var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out,color var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out,box-shadow var(
--mod-animation-duration-100,var(--spectrum-animation-duration-100)
) ease-out;-webkit-user-select:none;user-select:none;vertical-align:top}:host(:focus){outline:none}:host([disabled]){cursor:default}:host a{-webkit-appearance:none;-webkit-user-select:none;user-select:none}:host{--spectrum-closebutton-size-300:24px;--spectrum-closebutton-size-400:32px;--spectrum-closebutton-size-500:40px;--spectrum-closebutton-size-600:48px;--spectrum-closebutton-icon-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-closebutton-icon-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-closebutton-icon-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-closebutton-icon-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-closebutton-icon-color-disabled:var(
--spectrum-disabled-content-color
);--spectrum-closebutton-focus-indicator-thickness:var(
--spectrum-focus-indicator-thickness
);--spectrum-closebutton-focus-indicator-gap:var(
--spectrum-focus-indicator-gap
);--spectrum-closebutton-focus-indicator-color:var(
--spectrum-focus-indicator-color
);--spectrum-closebutton-animation-duration:var(
--spectrum-animation-duration-100
)}:host([size=s]){--spectrum-closebutton-height:var(--spectrum-component-height-75);--spectrum-closebutton-width:var(--spectrum-closebutton-height);--spectrum-closebutton-size:var(--spectrum-closebutton-size-300);--spectrum-closebutton-border-radius:var(--spectrum-closebutton-size-300)}:host{--spectrum-closebutton-height:var(--spectrum-component-height-100);--spectrum-closebutton-width:var(--spectrum-closebutton-height);--spectrum-closebutton-size:var(--spectrum-closebutton-size-400);--spectrum-closebutton-border-radius:var(--spectrum-closebutton-size-400)}:host([size=l]){--spectrum-closebutton-height:var(--spectrum-component-height-200);--spectrum-closebutton-width:var(--spectrum-closebutton-height);--spectrum-closebutton-size:var(--spectrum-closebutton-size-500);--spectrum-closebutton-border-radius:var(--spectrum-closebutton-size-500)}:host([size=xl]){--spectrum-closebutton-height:var(--spectrum-component-height-300);--spectrum-closebutton-width:var(--spectrum-closebutton-height);--spectrum-closebutton-size:var(--spectrum-closebutton-size-600);--spectrum-closebutton-border-radius:var(--spectrum-closebutton-size-600)}:host([static=white]){--spectrum-closebutton-static-background-color-default:transparent;--spectrum-closebutton-static-background-color-hover:var(
--spectrum-transparent-white-300
);--spectrum-closebutton-static-background-color-down:var(
--spectrum-transparent-white-400
);--spectrum-closebutton-static-background-color-focus:var(
--spectrum-transparent-white-300
);--spectrum-closebutton-icon-color-default:var(--spectrum-white);--spectrum-closebutton-icon-color-disabled:var(
--spectrum-disabled-static-white-content-color
);--spectrum-closebutton-focus-indicator-color:var(
--spectrum-static-white-focus-indicator-color
)}:host([static=black]){--spectrum-closebutton-static-background-color-default:transparent;--spectrum-closebutton-static-background-color-hover:var(
--spectrum-transparent-black-300
);--spectrum-closebutton-static-background-color-down:var(
--spectrum-transparent-black-400
);--spectrum-closebutton-static-background-color-focus:var(
--spectrum-transparent-black-300
);--spectrum-closebutton-icon-color-default:var(--spectrum-black);--spectrum-closebutton-icon-color-disabled:var(
--spectrum-disabled-static-black-content-color
);--spectrum-closebutton-focus-indicator-color:var(
--spectrum-static-black-focus-indicator-color
)}@media (forced-colors:active){:host{--highcontrast-closebutton-icon-color-disabled:GrayText;--highcontrast-closebutton-icon-color-down:Highlight;--highcontrast-closebutton-icon-color-hover:Highlight;--highcontrast-closebutton-icon-color-focus:Highlight;--highcontrast-closebutton-background-color-default:ButtonFace;--highcontrast-closebutton-focus-indicator-color:ButtonText}:host(.focus-visible):after{forced-color-adjust:none;margin:var(
--mod-closebutton-focus-indicator-gap,var(--spectrum-closebutton-focus-indicator-gap)
);transition:opacity var(
--mod-closebutton-animation-duration,var(--spectrum-closebutton-animation-duration)
) ease-out,margin var(
--mod-closebutton-animation-duraction,var(--spectrum-closebutton-animation-duration)
) ease-out}:host(.focus-visible):after{forced-color-adjust:none;margin:var(
--mod-closebutton-focus-indicator-gap,var(--spectrum-closebutton-focus-indicator-gap)
);transition:opacity var(
--mod-closebutton-animation-duration,var(--spectrum-closebutton-animation-duration)
) ease-out,margin var(
--mod-closebutton-animation-duraction,var(--spectrum-closebutton-animation-duration)
) ease-out}:host(:focus-visible):after{forced-color-adjust:none;margin:var(
--mod-closebutton-focus-indicator-gap,var(--spectrum-closebutton-focus-indicator-gap)
);transition:opacity var(
--mod-closebutton-animation-duration,var(--spectrum-closebutton-animation-duration)
) ease-out,margin var(
--mod-closebutton-animation-duraction,var(--spectrum-closebutton-animation-duration)
) ease-out}:host([static=black]){--highcontrast-closebutton-static-background-color-default:ButtonFace;--highcontrast-closebutton-icon-color-default:Highlight;--highcontrast-closebutton-icon-color-disabled:GrayText}:host([static=white]){--highcontrast-closebutton-static-background-color-default:ButtonFace;--highcontrast-closebutton-icon-color-default:Highlight;--highcontrast-closebutton-icon-color-disabled:Highlight}}:host{align-items:center;align-self:var(--mod-closebutton-align-self);border-color:#0000;border-radius:var(
--mod-closebutton-border-radius,var(--spectrum-closebutton-border-radius)
);border-width:0;color:inherit;display:inline-flex;flex-direction:row;height:var(--mod-closebutton-height,var(--spectrum-closebutton-height));justify-content:center;margin-block-start:var(--mod-closebutton-margin-top);margin-inline:var(--mod-closebutton-margin-inline);padding:0;position:relative;transition:border-color var(
--mod-closebutton-animation-duration,var(--spectrum-closebutton-animation-duration)
) ease-in-out;width:var(--mod-closebutton-width,var(--spectrum-closebutton-width))}:host:after{border-radius:calc(var(--mod-closebutton-size, var(--spectrum-closebutton-size)) + var(
--mod-closebutton-focus-indicator-gap,
var(--spectrum-closebutton-focus-indicator-gap)
));content:"";inset:0;margin:calc(var(
--mod-closebutton-focus-indicator-gap,
var(--spectrum-closebutton-focus-indicator-gap)
)*-1);pointer-events:none;position:absolute;transition:box-shadow var(
--mod-closebutton-animation-duration,var(--spectrum-closebutton-animation-duration)
) ease-in-out}:host(.focus-visible){box-shadow:none;outline:none}:host(.focus-visible){box-shadow:none;outline:none}:host(:focus-visible){box-shadow:none;outline:none}:host(.focus-visible):after{box-shadow:0 0 0 var(
--mod-closebutton-focus-indicator-thickness,var(--spectrum-closebutton-focus-indicator-thickness)
) var(
--highcontrast-closebutton-focus-indicator-color,var(
--mod-closebutton-focus-indicator-color,var(--spectrum-closebutton-focus-indicator-color)
)
)}:host(.focus-visible):after{box-shadow:0 0 0 var(
--mod-closebutton-focus-indicator-thickness,var(--spectrum-closebutton-focus-indicator-thickness)
) var(
--highcontrast-closebutton-focus-indicator-color,var(
--mod-closebutton-focus-indicator-color,var(--spectrum-closebutton-focus-indicator-color)
)
)}:host(:focus-visible):after{box-shadow:0 0 0 var(
--mod-closebutton-focus-indicator-thickness,var(--spectrum-closebutton-focus-indicator-thickness)
) var(
--highcontrast-closebutton-focus-indicator-color,var(
--mod-closebutton-focus-indicator-color,var(--spectrum-closebutton-focus-indicator-color)
)
)}:host(:not([disabled])){background-color:var(
--highcontrast-closebutton-background-color-default,var(
--mod-closebutton-background-color-default,var(--spectrum-closebutton-background-color-default)
)
)}:host(:not([disabled]):hover){background-color:var(
--mod-closebutton-background-color-hover,var(--spectrum-closebutton-background-color-hover)
)}:host(:not([disabled]):hover) .icon{color:var(
--highcontrast-closebutton-icon-color-hover,var(
--mod-closebutton-icon-color-hover,var(--spectrum-closebutton-icon-color-hover)
)
)}:host(:not([disabled])[active]){background-color:var(
--mod-closebutton-background-color-down,var(--spectrum-closebutton-background-color-down)
)}:host(:not([disabled])[active]) .icon{color:var(
--highcontrast-closebutton-icon-color-down,var(
--mod-closebutton-icon-color-down,var(--spectrum-closebutton-icon-color-down)
)
)}:host(:not([disabled]).focus-visible),:host(:not([disabled])[focused]){background-color:var(
--mod-closebutton-background-color-focus,var(--spectrum-closebutton-background-color-focus)
)}:host(:not([disabled]).focus-visible),:host(:not([disabled])[focused]){background-color:var(
--mod-closebutton-background-color-focus,var(--spectrum-closebutton-background-color-focus)
)}:host(:not([disabled]):focus-visible),:host(:not([disabled])[focused]){background-color:var(
--mod-closebutton-background-color-focus,var(--spectrum-closebutton-background-color-focus)
)}:host(:not([disabled]).focus-visible) .icon,:host(:not([disabled])[focused]) .icon{color:var(
--highcontrast-closebutton-icon-color-focus,var(
--mod-closebutton-icon-color-focus,var(--spectrum-closebutton-icon-color-focus)
)
)}:host(:not([disabled]).focus-visible) .icon,:host(:not([disabled])[focused]) .icon{color:var(
--highcontrast-closebutton-icon-color-focus,var(
--mod-closebutton-icon-color-focus,var(--spectrum-closebutton-icon-color-focus)
)
)}:host(:not([disabled]):focus-visible) .icon,:host(:not([disabled])[focused]) .icon{color:var(
--highcontrast-closebutton-icon-color-focus,var(
--mod-closebutton-icon-color-focus,var(--spectrum-closebutton-icon-color-focus)
)
)}:host(:not([disabled])) .icon{color:var(
--mod-closebutton-icon-color-default,var(--spectrum-closebutton-icon-color-default)
)}:host(:not([disabled]):focus) .icon,:host(:not([disabled])[focused]) .icon{color:var(
--highcontrast-closebutton-icon-color-focus,var(
--mod-closebutton-icon-color-focus,var(--spectrum-closebutton-icon-color-focus)
)
)}:host([disabled]){background-color:var(
--mod-closebutton-background-color-default,var(--spectrum-closebutton-background-color-default)
)}:host([disabled]) .icon{color:var(
--highcontrast-closebutton-icon-color-disabled,var(
--mod-closebutton-icon-color-disabled,var(--spectrum-closebutton-icon-color-disabled)
)
)}:host([static=black]:not([disabled])),:host([static=white]:not([disabled])){background-color:var(
--highcontrast-closebutton-static-background-color-default,var(
--mod-closebutton-static-background-color-default,var(--spectrum-closebutton-static-background-color-default)
)
)}:host([static=black]:not([disabled]):hover),:host([static=white]:not([disabled]):hover){background-color:var(
--highcontrast-closebutton-static-background-color-hover,var(
--mod-closebutton-static-background-color-hover,var(--spectrum-closebutton-static-background-color-hover)
)
)}:host([static=black]:not([disabled]):hover) .icon,:host([static=white]:not([disabled]):hover) .icon{color:var(
--highcontrast-closebutton-icon-color-default,var(
--mod-closebutton-icon-color-default,var(--spectrum-closebutton-icon-color-default)
)
)}:host([static=black]:not([disabled])[active]),:host([static=white]:not([disabled])[active]){background-color:var(
--highcontrast-closebutton-static-background-color-down,var(
--mod-closebutton-static-background-color-down,var(--spectrum-closebutton-static-background-color-down)
)
)}:host([static=black]:not([disabled])[active]) .icon,:host([static=white]:not([disabled])[active]) .icon{color:var(
--highcontrast-closebutton-icon-color-default,var(
--mod-closebutton-icon-color-default,var(--spectrum-closebutton-icon-color-default)
)
)}:host([static=black]:not([disabled]).focus-visible),:host([static=black]:not([disabled])[focused]),:host([static=white]:not([disabled]).focus-visible),:host([static=white]:not([disabled])[focused]){background-color:var(
--highcontrast-closebutton-static-background-color-focus,var(
--mod-closebutton-static-background-color-focus,var(--spectrum-closebutton-static-background-color-focus)
)
)}:host([static=black]:not([disabled]).focus-visible),:host([static=black]:not([disabled])[focused]),:host([static=white]:not([disabled]).focus-visible),:host([static=white]:not([disabled])[focused]){background-color:var(
--highcontrast-closebutton-static-background-color-focus,var(
--mod-closebutton-static-background-color-focus,var(--spectrum-closebutton-static-background-color-focus)
)
)}:host([static=black]:not([disabled]):focus-visible),:host([static=black]:not([disabled])[focused]),:host([static=white]:not([disabled]):focus-visible),:host([static=white]:not([disabled])[focused]){background-color:var(
--highcontrast-closebutton-static-background-color-focus,var(
--mod-closebutton-static-background-color-focus,var(--spectrum-closebutton-static-background-color-focus)
)
)}:host([static=black]:not([disabled]).focus-visible) .icon,:host([static=black]:not([disabled]):focus) .icon,:host([static=black]:not([disabled])[focused]) .icon,:host([static=white]:not([disabled]).focus-visible) .icon,:host([static=white]:not([disabled]):focus) .icon,:host([static=white]:not([disabled])[focused]) .icon{color:var(
--highcontrast-closebutton-icon-color-default,var(
--mod-closebutton-icon-color-default,var(--spectrum-closebutton-icon-color-default)
)
)}:host([static=black]:not([disabled]):focus) .icon,:host([static=black]:not([disabled]):focus-visible) .icon,:host([static=black]:not([disabled])[focused]) .icon,:host([static=white]:not([disabled]):focus) .icon,:host([static=white]:not([disabled]):focus-visible) .icon,:host([static=white]:not([disabled])[focused]) .icon{color:var(
--highcontrast-closebutton-icon-color-default,var(
--mod-closebutton-icon-color-default,var(--spectrum-closebutton-icon-color-default)
)
)}:host([static=black]:not([disabled])) .icon,:host([static=white]:not([disabled])) .icon{color:var(
--mod-closebutton-icon-color-default,var(--spectrum-closebutton-icon-color-default)
)}:host([static=black][disabled]) .icon,:host([static=white][disabled]) .icon{color:var(
--highcontrast-closebutton-icon-disabled,var(
--mod-closebutton-icon-color-disabled,var(--spectrum-closebutton-icon-color-disabled)
)
)}.icon{margin:0}:host{--spectrum-closebutton-background-color-default:var(
--system-spectrum-closebutton-background-color-default
);--spectrum-closebutton-background-color-hover:var(
--system-spectrum-closebutton-background-color-hover
);--spectrum-closebutton-background-color-down:var(
--system-spectrum-closebutton-background-color-down
);--spectrum-closebutton-background-color-focus:var(
--system-spectrum-closebutton-background-color-focus
)}
`,Qo=Sc;h();var Jo=({width:s=24,height:t=24,title:e="Cross75"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 8 8"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M5.188 4l2.14-2.14A.84.84 0 106.141.672L4 2.812 1.86.672A.84.84 0 00.672 1.86L2.812 4 .672 6.14A.84.84 0 101.86 7.328L4 5.188l2.14 2.14A.84.84 0 107.328 6.14z"
    />
  </svg>`;var Je=class extends T{render(){return A(i.html),Jo()}};P();b("sp-icon-cross75",Je);h();var ts=({width:s=24,height:t=24,title:e="Cross100"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 8 8"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M5.238 4l2.456-2.457A.875.875 0 106.456.306L4 2.763 1.543.306A.875.875 0 00.306 1.544L2.763 4 .306 6.457a.875.875 0 101.238 1.237L4 5.237l2.456 2.457a.875.875 0 101.238-1.237z"
    />
  </svg>`;var tr=class extends T{render(){return A(i.html),ts()}};P();b("sp-icon-cross100",tr);h();var es=({width:s=24,height:t=24,title:e="Cross200"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M6.29 5l2.922-2.922a.911.911 0 00-1.29-1.29L5 3.712 2.078.789a.911.911 0 00-1.29 1.289L3.712 5 .79 7.922a.911.911 0 101.289 1.29L5 6.288 7.923 9.21a.911.911 0 001.289-1.289z"
    />
  </svg>`;var er=class extends T{render(){return A(i.html),es()}};P();b("sp-icon-cross200",er);h();var rs=({width:s=24,height:t=24,title:e="Cross300"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M7.344 6l3.395-3.396a.95.95 0 00-1.344-1.342L6 4.657 2.604 1.262a.95.95 0 00-1.342 1.342L4.657 6 1.262 9.396a.95.95 0 001.343 1.343L6 7.344l3.395 3.395a.95.95 0 001.344-1.344z"
    />
  </svg>`;var rr=class extends T{render(){return A(i.html),rs()}};P();b("sp-icon-cross300",rr);h();var jc=i.css`
.spectrum-UIIcon-Cross75{height:var(--spectrum-alias-ui-icon-cross-size-75);width:var(--spectrum-alias-ui-icon-cross-size-75)}.spectrum-UIIcon-Cross100{height:var(--spectrum-alias-ui-icon-cross-size-100);width:var(--spectrum-alias-ui-icon-cross-size-100)}.spectrum-UIIcon-Cross200{height:var(--spectrum-alias-ui-icon-cross-size-200);width:var(--spectrum-alias-ui-icon-cross-size-200)}.spectrum-UIIcon-Cross300{height:var(--spectrum-alias-ui-icon-cross-size-300);width:var(--spectrum-alias-ui-icon-cross-size-300)}.spectrum-UIIcon-Cross400{height:var(--spectrum-alias-ui-icon-cross-size-400);width:var(--spectrum-alias-ui-icon-cross-size-400)}.spectrum-UIIcon-Cross500{height:var(--spectrum-alias-ui-icon-cross-size-500);width:var(--spectrum-alias-ui-icon-cross-size-500)}.spectrum-UIIcon-Cross600{height:var(--spectrum-alias-ui-icon-cross-size-600);width:var(--spectrum-alias-ui-icon-cross-size-600)}
`,or=jc;var Ac=Object.defineProperty,Dc=Object.getOwnPropertyDescriptor,os=(s,t,e,r)=>{for(var o=r>1?void 0:r?Dc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Ac(t,e,o),o},Lc={s:()=>i.html`
        <sp-icon-cross75
            slot="icon"
            class="icon spectrum-UIIcon-Cross75"
        ></sp-icon-cross75>
    `,m:()=>i.html`
        <sp-icon-cross100
            slot="icon"
            class="icon spectrum-UIIcon-Cross100"
        ></sp-icon-cross100>
    `,l:()=>i.html`
        <sp-icon-cross200
            slot="icon"
            class="icon spectrum-UIIcon-Cross200"
        ></sp-icon-cross200>
    `,xl:()=>i.html`
        <sp-icon-cross300
            slot="icon"
            class="icon spectrum-UIIcon-Cross300"
        ></sp-icon-cross300>
    `},re=class extends H(ee,{noDefaultSize:!0}){constructor(){super(...arguments),this.variant=""}static get styles(){return[...super.styles,Qo,or]}get buttonContent(){return[Lc[this.size]()]}};os([(0,n.property)({reflect:!0})],re.prototype,"variant",2),os([(0,n.property)({type:String,reflect:!0})],re.prototype,"static",2);P();b("sp-close-button",re);h();S();h();var Oc=i.css`
:host([size=s]){--spectrum-buttongroup-spacing-horizontal:var(--spectrum-spacing-200);--spectrum-buttongroup-spacing-vertical:var(--spectrum-spacing-200)}:host{--spectrum-buttongroup-spacing-horizontal:var(--spectrum-spacing-300);--spectrum-buttongroup-spacing-vertical:var(--spectrum-spacing-300)}:host([size=l]){--spectrum-buttongroup-spacing-horizontal:var(--spectrum-spacing-300);--spectrum-buttongroup-spacing-vertical:var(--spectrum-spacing-300)}:host([size=xl]){--spectrum-buttongroup-spacing-horizontal:var(--spectrum-spacing-300);--spectrum-buttongroup-spacing-vertical:var(--spectrum-spacing-300)}:host{display:flex;flex-wrap:wrap;gap:var(
--mod-buttongroup-spacing-horizontal,var(--spectrum-buttongroup-spacing-horizontal)
);justify-content:var(--mod-buttongroup-justify-content,normal)}::slotted(*){flex-shrink:0}:host([vertical]){display:inline-flex;flex-direction:column;gap:var(
--mod-buttongroup-spacing-vertical,var(--spectrum-buttongroup-spacing-vertical)
)}:host([vertical]) ::slotted(sp-action-button){--spectrum-actionbutton-label-flex-grow:1}:host([dir=ltr][vertical]) ::slotted(sp-action-button){--spectrum-actionbutton-label-text-align:left}:host([dir=rtl][vertical]) ::slotted(sp-action-button){--spectrum-actionbutton-label-text-align:right}
`,ss=Oc;var Hc=Object.defineProperty,qc=Object.getOwnPropertyDescriptor,$c=(s,t,e,r)=>{for(var o=r>1?void 0:r?qc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Hc(t,e,o),o},Te=class extends H(I,{noDefaultSize:!0}){constructor(){super(...arguments),this.vertical=!1}static get styles(){return[ss]}handleSlotchange({target:t}){t.assignedElements().forEach(e=>{e.size=this.size})}render(){return i.html`
            <slot @slotchange=${this.handleSlotchange}></slot>
        `}};$c([(0,n.property)({type:Boolean,reflect:!0})],Te.prototype,"vertical",2);P();b("sp-button-group",Te);h();var Gr,oe=function(s,...t){return Gr?Gr(s,...t):t.reduce((e,r,o)=>e+r+s[o+1],s[0])},se=s=>{Gr=s};var as=({width:s=24,height:t=24,hidden:e=!1,title:r="Alert"}={})=>oe`<svg
    xmlns="http://www.w3.org/2000/svg"
    height=${t}
    viewBox="0 0 36 36"
    width=${s}
    aria-hidden=${e?"true":"false"}
    role="img"
    fill="currentColor"
    aria-label=${r}
  >
    <path
      d="M17.127 2.579.4 32.512A1 1 0 0 0 1.272 34h33.456a1 1 0 0 0 .872-1.488L18.873 2.579a1 1 0 0 0-1.746 0ZM20 29.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5Zm0-6a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5Z"
    />
  </svg>`;var sr=class extends T{render(){return se(i.html),as({hidden:!this.label,title:this.label})}};P();b("sp-icon-alert",sr);kt();h();var _c=i.css`
:host{--spectrum-dialog-fullscreen-header-text-size:28px;--spectrum-dialog-confirm-small-width:400px;--spectrum-dialog-confirm-medium-width:480px;--spectrum-dialog-confirm-large-width:640px;--spectrum-dialog-error-width:var(--spectrum-dialog-confirm-medium-width);--spectrum-dialog-confirm-hero-height:var(
--spectrum-global-dimension-size-1600
);--spectrum-dialog-confirm-description-padding:var(
--spectrum-global-dimension-size-25
);--spectrum-dialog-confirm-description-margin:calc(var(--spectrum-global-dimension-size-25)*-1);--spectrum-dialog-confirm-footer-padding-top:var(
--spectrum-global-dimension-static-size-500,40px
);--spectrum-dialog-confirm-gap-size:var(
--spectrum-global-dimension-size-200
);--spectrum-dialog-confirm-buttongroup-padding-top:var(
--spectrum-global-dimension-static-size-500,40px
);--spectrum-dialog-confirm-close-button-size:var(
--spectrum-global-dimension-size-400
);--spectrum-dialog-confirm-close-button-padding:calc(26px - var(--spectrum-global-dimension-size-175));--spectrum-dialog-confirm-divider-height:var(
--spectrum-global-dimension-static-size-25,2px
)}:host{box-sizing:border-box;display:flex;max-height:inherit;max-width:100%;min-width:var(
--spectrum-dialog-confirm-min-width,var(--spectrum-global-dimension-static-size-3600)
);outline:none;width:-moz-fit-content;width:fit-content}:host([size=s]){width:var(--spectrum-dialog-confirm-small-width)}:host([size=m]){width:var(--spectrum-dialog-confirm-medium-width)}:host([size=l]){width:var(--spectrum-dialog-confirm-large-width)}::slotted([slot=hero]){background-position:50%;background-size:cover;border-top-left-radius:var(
--spectrum-dialog-confirm-border-radius,var(--spectrum-alias-component-border-radius)
);border-top-right-radius:var(
--spectrum-dialog-confirm-border-radius,var(--spectrum-alias-component-border-radius)
);grid-area:hero;height:var(--spectrum-dialog-confirm-hero-height);overflow:hidden}.grid{display:grid;grid-template-areas:"hero hero hero hero hero hero" ". . . . . ." ". heading header header typeIcon ." ". divider divider divider divider ." ". content content content content ." ". footer footer buttonGroup buttonGroup ." ". . . . . .";grid-template-columns:var(--spectrum-dialog-confirm-padding) auto 1fr auto minmax(0,auto) var(--spectrum-dialog-confirm-padding);grid-template-rows:auto var(--spectrum-dialog-confirm-padding) auto auto 1fr auto var(
--spectrum-dialog-confirm-padding
);width:100%}:host([dir=ltr]) ::slotted([slot=heading]){padding-right:var(--spectrum-dialog-confirm-gap-size)}:host([dir=rtl]) ::slotted([slot=heading]){padding-left:var(--spectrum-dialog-confirm-gap-size)}::slotted([slot=heading]){font-size:var(--spectrum-dialog-confirm-title-text-size);font-weight:var(
--spectrum-dialog-confirm-title-text-font-weight,var(--spectrum-alias-heading-text-font-weight-regular)
);grid-area:heading;line-height:var(
--spectrum-dialog-confirm-title-text-line-height,var(--spectrum-alias-heading-text-line-height)
);margin:0;outline:none}:host([dir=ltr]) .no-header::slotted([slot=heading]){padding-right:0}:host([dir=rtl]) .no-header::slotted([slot=heading]){padding-left:0}.no-header::slotted([slot=heading]){grid-area:heading-start/heading-start/header-end/header-end}.header{align-items:center;box-sizing:border-box;display:flex;grid-area:header;justify-content:flex-end;outline:none}.type-icon{grid-area:typeIcon}.divider{grid-area:divider;margin-bottom:var(
--spectrum-dialog-confirm-divider-margin-bottom,var(--spectrum-global-dimension-static-size-200)
);margin-top:var(
--spectrum-dialog-confirm-divider-margin-top,var(--spectrum-global-dimension-static-size-150)
);width:100%}:host([mode=fullscreen]) [name=heading]+.divider{margin-bottom:calc(var(
--spectrum-dialog-confirm-divider-margin-bottom,
var(--spectrum-global-dimension-static-size-200)
) - var(--spectrum-dialog-confirm-description-padding)*2)}:host([no-divider]) .divider{display:none}:host([no-divider]) ::slotted([slot=heading]){padding-bottom:calc(var(
--spectrum-dialog-confirm-divider-margin-top,
var(--spectrum-global-dimension-static-size-150)
) + var(
--spectrum-dialog-confirm-divider-margin-bottom,
var(--spectrum-global-dimension-static-size-200)
) + var(
--spectrum-dialog-confirm-divider-height,
var(--spectrum-global-dimension-size-25)
))}.content{-webkit-overflow-scrolling:touch;box-sizing:border-box;font-size:var(--spectrum-dialog-confirm-description-text-size);font-weight:var(
--spectrum-dialog-confirm-description-text-font-weight,var(--spectrum-global-font-weight-regular)
);grid-area:content;line-height:var(
--spectrum-dialog-confirm-description-text-line-height,var(--spectrum-alias-component-text-line-height)
);margin:0 var(--spectrum-dialog-confirm-description-margin);outline:none;overflow-y:auto;padding:calc(var(--spectrum-dialog-confirm-description-padding)*2)}.footer{display:flex;flex-wrap:wrap;grid-area:footer;outline:none;padding-top:var(--spectrum-dialog-confirm-footer-padding-top)}.footer>*,.footer>.spectrum-Button+.spectrum-Button{margin-bottom:0}:host([dir=ltr]) .button-group{padding-left:var(--spectrum-dialog-confirm-gap-size)}:host([dir=rtl]) .button-group{padding-right:var(--spectrum-dialog-confirm-gap-size)}.button-group{display:flex;grid-area:buttonGroup;justify-content:flex-end;padding-top:var(--spectrum-dialog-confirm-buttongroup-padding-top)}.button-group.button-group--noFooter{grid-area:footer-start/footer-start/buttonGroup-end/buttonGroup-end}:host([dismissable]) .grid{grid-template-areas:"hero hero hero hero hero hero hero" ". . . . . closeButton closeButton" ". heading header header typeIcon closeButton closeButton" ". divider divider divider divider divider ." ". content content content content content ." ". footer footer buttonGroup buttonGroup buttonGroup ." ". . . . . . .";grid-template-columns:var(--spectrum-dialog-confirm-padding) auto 1fr auto minmax(0,auto) minmax(0,var(--spectrum-dialog-confirm-close-button-size)) var(--spectrum-dialog-confirm-padding);grid-template-rows:auto var(--spectrum-dialog-confirm-padding) auto auto 1fr auto var(
--spectrum-dialog-confirm-padding
)}:host([dismissable]) .grid .button-group{display:none}:host([dismissable]) .grid .footer{grid-area:footer/footer/buttonGroup/buttonGroup}:host([dir=ltr]) .close-button{margin-right:var(--spectrum-dialog-confirm-close-button-padding)}:host([dir=rtl]) .close-button{margin-left:var(--spectrum-dialog-confirm-close-button-padding)}.close-button{grid-area:closeButton;margin-top:var(--spectrum-dialog-confirm-close-button-padding);place-self:start end}:host([error]){width:var(--spectrum-dialog-error-width,90%)}:host([mode=fullscreen]){height:100%;width:100%}:host([mode=fullscreenTakeover]){border-radius:0;height:100%;width:100%}:host([mode=fullscreenTakeover]),:host([mode=fullscreen]){max-height:none;max-width:none}:host([mode=fullscreenTakeover]) .grid,:host([mode=fullscreen]) .grid{display:grid;grid-template-areas:". . . . ." ". heading header buttonGroup ." ". divider divider divider ." ". content content content ." ". . . . .";grid-template-columns:var(--spectrum-dialog-confirm-padding) 1fr auto auto var(
--spectrum-dialog-confirm-padding
);grid-template-rows:var(--spectrum-dialog-confirm-padding) auto auto 1fr var(
--spectrum-dialog-confirm-padding
)}:host([mode=fullscreenTakeover]) ::slotted([slot=heading]),:host([mode=fullscreen]) ::slotted([slot=heading]){font-size:var(--spectrum-dialog-fullscreen-header-text-size)}:host([mode=fullscreenTakeover]) .content,:host([mode=fullscreen]) .content{max-height:none}:host([mode=fullscreenTakeover]) .button-group,:host([mode=fullscreenTakeover]) .footer,:host([mode=fullscreen]) .button-group,:host([mode=fullscreen]) .footer{padding-top:0}:host([mode=fullscreenTakeover]) .footer,:host([mode=fullscreen]) .footer{display:none}:host([mode=fullscreenTakeover]) .button-group,:host([mode=fullscreen]) .button-group{align-self:start;grid-area:buttonGroup}@media screen and (max-width:700px){.grid{grid-template-areas:"hero hero hero hero hero hero" ". . . . . ." ". heading heading heading typeIcon ." ". header header header header ." ". divider divider divider divider ." ". content content content content ." ". footer footer buttonGroup buttonGroup ." ". . . . . .";grid-template-columns:var(--spectrum-dialog-confirm-padding) auto 1fr auto minmax(0,auto) var(--spectrum-dialog-confirm-padding);grid-template-rows:auto var(--spectrum-dialog-confirm-padding) auto auto auto 1fr auto var(
--spectrum-dialog-confirm-padding
)}:host([dismissable]) .grid{grid-template-areas:"hero hero hero hero hero hero hero" ". . . . . closeButton closeButton" ". heading heading heading typeIcon closeButton closeButton" ". header header header header header ." ". divider divider divider divider divider ." ". content content content content content ." ". footer footer buttonGroup buttonGroup buttonGroup ." ". . . . . . .";grid-template-columns:var(--spectrum-dialog-confirm-padding) auto 1fr auto minmax(0,auto) minmax(0,var(--spectrum-dialog-confirm-close-button-size)) var(--spectrum-dialog-confirm-padding);grid-template-rows:auto var(--spectrum-dialog-confirm-padding) auto auto auto 1fr auto var(
--spectrum-dialog-confirm-padding
)}.header{justify-content:flex-start}:host([mode=fullscreenTakeover]) .grid,:host([mode=fullscreen]) .grid{display:grid;grid-template-areas:". . ." ". heading ." ". header ." ". divider ." ". content ." ". buttonGroup ." ". . .";grid-template-columns:var(--spectrum-dialog-confirm-padding) 1fr var(
--spectrum-dialog-confirm-padding
);grid-template-rows:var(--spectrum-dialog-confirm-padding) auto auto auto 1fr auto var(
--spectrum-dialog-confirm-padding
)}:host([mode=fullscreenTakeover]) .button-group,:host([mode=fullscreen]) .button-group{padding-top:var(--spectrum-dialog-confirm-buttongroup-padding-top)}:host([mode=fullscreenTakeover]) ::slotted([slot=heading]),:host([mode=fullscreen]) ::slotted([slot=heading]){font-size:var(--spectrum-dialog-confirm-title-text-size)}}@media (forced-colors:active){:host{border:solid}}::slotted([slot=heading]){color:var(
--spectrum-dialog-confirm-title-text-color,var(--spectrum-alias-heading-text-color)
)}.content,.footer{color:var(
--spectrum-dialog-confirm-description-text-color,var(--spectrum-global-color-gray-800)
)}.type-icon{color:var(
--spectrum-dialog-confirm-icon-color,var(--spectrum-global-color-gray-900)
)}:host([error]) .type-icon{color:var(
--spectrum-dialog-error-icon-color,var(--spectrum-semantic-negative-icon-color)
)}.content{overflow:hidden}.footer{color:var(
--spectrum-dialog-confirm-description-text-color,var(--spectrum-global-color-gray-800)
)}.content[tabindex]{overflow:auto}::slotted(img[slot=hero]){height:auto;width:100%}.grid{grid-template-areas:"hero hero    hero    hero        hero        hero" ".    .       .       .           .           ." ".    heading heading heading     typeIcon    ." ".    divider divider divider     divider     ." ".    content content content     content     ." ".    footer  footer  buttonGroup buttonGroup ." ".    .       .       .           .           ."}
`,gs=_c;h();S();kt();ir();var nr=class{constructor(t,{target:e,config:r,callback:o,skipInitial:a}){this.t=new Set,this.o=!1,this.i=!1,this.h=t,e!==null&&this.t.add(e??t),this.l=r,this.o=a??this.o,this.callback=o,window.ResizeObserver?(this.u=new ResizeObserver(c=>{this.handleChanges(c),this.h.requestUpdate()}),t.addController(this)):console.warn("ResizeController error: browser does not support ResizeObserver.")}handleChanges(t){this.value=this.callback?.(t,this.u)}hostConnected(){for(let t of this.t)this.observe(t)}hostDisconnected(){this.disconnect()}async hostUpdated(){!this.o&&this.i&&this.handleChanges([]),this.i=!1}observe(t){this.t.add(t),this.u.observe(t,this.l),this.i=!0,this.h.requestUpdate()}unobserve(t){this.t.delete(t),this.u.unobserve(t)}disconnect(){this.u.disconnect()}};h();var Vc=i.css`
:host{--spectrum-alert-dialog-min-width:var(
--spectrum-alert-dialog-minimum-width
);--spectrum-alert-dialog-max-width:var(
--spectrum-alert-dialog-maximum-width
);--spectrum-alert-dialog-icon-size:var(--spectrum-workflow-icon-size-100);--spectrum-alert-dialog-warning-icon-color:var(
--spectrum-notice-visual-color
);--spectrum-alert-dialog-error-icon-color:var(
--spectrum-negative-visual-color
);--spectrum-alert-dialog-title-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-alert-dialog-title-font-weight:var(
--spectrum-heading-sans-serif-font-weight
);--spectrum-alert-dialog-title-font-style:var(
--spectrum-heading-sans-serif-font-style
);--spectrum-alert-dialog-title-font-size:var(
--spectrum-alert-dialog-title-size
);--spectrum-alert-dialog-title-line-height:var(
--spectrum-heading-line-height
);--spectrum-alert-dialog-title-color:var(--spectrum-heading-color);--spectrum-alert-dialog-body-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-alert-dialog-body-font-weight:var(
--spectrum-body-sans-serif-font-weight
);--spectrum-alert-dialog-body-font-style:var(
--spectrum-body-sans-serif-font-style
);--spectrum-alert-dialog-body-font-size:var(
--spectrum-alert-dialog-description-size
);--spectrum-alert-dialog-body-line-height:var(--spectrum-line-height-100);--spectrum-alert-dialog-body-color:var(--spectrum-body-color);--spectrum-alert-dialog-title-to-divider:var(--spectrum-spacing-200);--spectrum-alert-dialog-divider-to-description:var(--spectrum-spacing-300);--spectrum-alert-dialog-title-to-icon:var(--spectrum-spacing-300);--mod-buttongroup-justify-content:flex-end}:host{box-sizing:border-box;display:flex;inline-size:-moz-fit-content;inline-size:fit-content;max-inline-size:var(
--mod-alert-dialog-max-width,var(--spectrum-alert-dialog-max-width)
);max-height:inherit;min-inline-size:var(
--mod-alert-dialog-min-width,var(--spectrum-alert-dialog-min-width)
);outline:none;padding:var(
--mod-alert-dialog-padding,var(--spectrum-alert-dialog-padding)
)}.icon{block-size:var(
--mod-alert-dialog-icon-size,var(--spectrum-alert-dialog-icon-size)
);flex-shrink:0;inline-size:var(
--mod-alert-dialog-icon-size,var(--spectrum-alert-dialog-icon-size)
);margin-left:var(
--mod-alert-dialog-title-to-icon,var(--spectrum-alert-dialog-title-to-icon)
)}:host([variant=warning]){--mod-icon-color:var(
--mod-alert-dialog-warning-icon-color,var(--spectrum-alert-dialog-warning-icon-color)
)}:host([variant=error]){--mod-icon-color:var(
--mod-alert-dialog-error-icon-color,var(--spectrum-alert-dialog-error-icon-color)
)}.grid{display:grid}.header{align-items:baseline;display:flex;justify-content:space-between}::slotted([slot=heading]){color:var(
--mod-alert-dialog-title-color,var(--spectrum-alert-dialog-title-color)
);font-family:var(
--mod-alert-dialog-title-font-family,var(--spectrum-alert-dialog-title-font-family)
);font-size:var(
--mod-alert-dialog-title-font-size,var(--spectrum-alert-dialog-title-font-size)
);font-style:var(
--mod-alert-dialog-title-font-style,var(--spectrum-alert-dialog-title-font-style)
);font-weight:var(
--mod-alert-dialog-title-font-weight,var(--spectrum-alert-dialog-title-font-weight)
);line-height:var(
--mod-alert-dialog-title-line-height,var(--spectrum-alert-dialog-title-line-height)
);margin:0;margin-block-end:var(
--mod-alert-dialog-title-to-divider,var(--spectrum-alert-dialog-title-to-divider)
)}.content{-webkit-overflow-scrolling:touch;color:var(
--mod-alert-dialog-body-color,var(--spectrum-alert-dialog-body-color)
);font-family:var(
--mod-alert-dialog-body-font-family,var(--spectrum-alert-dialog-body-font-family)
);font-size:var(
--mod-alert-dialog-body-font-size,var(--spectrum-alert-dialog-body-font-size)
);font-style:var(
--mod-alert-dialog-body-font-style,var(--spectrum-alert-dialog-body-font-style)
);font-weight:var(
--mod-alert-dialog-body-font-weight,var(--spectrum-alert-dialog-body-font-weight)
);line-height:var(
--mod-alert-dialog-body-line-height,var(--spectrum-alert-dialog-body-line-height)
);margin:0;margin-block-end:var(
--mod-alert-dialog-description-to-buttons,var(--spectrum-alert-dialog-description-to-buttons)
);margin-block-start:var(
--mod-alert-dialog-divider-to-description,var(--spectrum-alert-dialog-divider-to-description)
);overflow-y:auto}@media (forced-colors:active){:host{border:solid}}
`,bs=Vc;var Kc=Object.defineProperty,Wc=Object.getOwnPropertyDescriptor,vs=(s,t,e,r)=>{for(var o=r>1?void 0:r?Wc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Kc(t,e,o),o},Gc=["confirmation","information","warning","error","destructive","secondary"],Xc=0;function fs(s,t){let e=s.assignedElements(),r=[];return e.forEach(o=>{if(o.id)r.push(o.id);else{let a=t+`-${Xc++}`;o.id=a,r.push(a)}}),r}var lr=class Jr extends lt(I){constructor(){super(...arguments),this.resizeController=new nr(this,{callback:()=>{this.shouldManageTabOrderForScrolling()}}),this._variant="",this.labelledbyId=`sp-dialog-label-${Jr.instanceCount++}`,this.shouldManageTabOrderForScrolling=()=>{if(!this.contentElement)return;let{offsetHeight:t,scrollHeight:e}=this.contentElement;t<e?this.contentElement.tabIndex=0:this.contentElement.removeAttribute("tabindex")},this.describedbyId=`sp-dialog-description-${Jr.instanceCount++}`}static get styles(){return[bs]}set variant(t){if(t===this.variant)return;let e=this.variant;Gc.includes(t)?(this.setAttribute("variant",t),this._variant=t):(this.removeAttribute("variant"),this._variant=""),this.requestUpdate("variant",e)}get variant(){return this._variant}renderIcon(){switch(this.variant){case"warning":case"error":return i.html`
                    <sp-icon-alert class="icon"></sp-icon-alert>
                `;default:return i.html``}}renderHeading(){return i.html`
            <slot name="heading" @slotchange=${this.onHeadingSlotchange}></slot>
        `}renderContent(){return i.html`
            <div class="content">
                <slot @slotchange=${this.onContentSlotChange}></slot>
            </div>
        `}onHeadingSlotchange({target:t}){this.conditionLabelledby&&(this.conditionLabelledby(),delete this.conditionLabelledby);let e=fs(t,this.labelledbyId);e.length&&(this.conditionLabelledby=ut(this,"aria-labelledby",e))}onContentSlotChange({target:t}){requestAnimationFrame(()=>{this.resizeController.unobserve(this.contentElement),this.resizeController.observe(this.contentElement)}),this.conditionDescribedby&&(this.conditionDescribedby(),delete this.conditionDescribedby);let e=fs(t,this.describedbyId);if(e.length&&e.length<4)this.conditionDescribedby=ut(this,"aria-describedby",e);else if(!e.length){let r=!!this.id;r||(this.id=this.describedbyId);let o=ut(this,"aria-describedby",this.id);this.conditionDescribedby=()=>{o(),r||this.removeAttribute("id")}}}renderButtons(){return i.html`
            <sp-button-group class="button-group">
                <slot name="button"></slot>
            </sp-button-group>
        `}render(){return i.html`
            <div class="grid">
                <div class="header">
                    ${this.renderHeading()} ${this.renderIcon()}
                </div>
                <sp-divider size="m" class="divider"></sp-divider>
                ${this.renderContent()} ${this.renderButtons()}
            </div>
        `}};lr.instanceCount=0,vs([(0,n.query)(".content")],lr.prototype,"contentElement",2),vs([(0,n.property)({type:String,reflect:!0})],lr.prototype,"variant",1);var ys=lr;tt();var Yc=Object.defineProperty,Zc=Object.getOwnPropertyDescriptor,ne=(s,t,e,r)=>{for(var o=r>1?void 0:r?Zc(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Yc(t,e,o),o},mt=class extends cr(ys,['[slot="hero"]','[slot="footer"]','[slot="button"]']){constructor(){super(...arguments),this.error=!1,this.dismissable=!1,this.noDivider=!1}static get styles(){return[gs]}get hasFooter(){return this.getSlotContentPresence('[slot="footer"]')}get hasButtons(){return this.getSlotContentPresence('[slot="button"]')}get hasHero(){return this.getSlotContentPresence('[slot="hero"]')}close(){this.dispatchEvent(new Event("close",{bubbles:!0,composed:!0,cancelable:!0}))}renderHero(){return i.html`
            <slot name="hero"></slot>
        `}renderFooter(){return i.html`
            <div class="footer">
                <slot name="footer"></slot>
            </div>
        `}renderButtons(){let t={"button-group":!0,"button-group--noFooter":!this.hasFooter};return i.html`
            <sp-button-group class=${jo(t)}>
                <slot name="button"></slot>
            </sp-button-group>
        `}renderDismiss(){return i.html`
            <sp-close-button
                class="close-button"
                label="Close"
                quiet
                size="m"
                @click=${this.close}
            ></sp-close-button>
        `}render(){return i.html`
            <div class="grid">
                ${this.renderHero()} ${this.renderHeading()}
                ${this.error?i.html`
                          <sp-icon-alert class="type-icon"></sp-icon-alert>
                      `:i.nothing}
                ${this.noDivider?i.nothing:i.html`
                          <sp-divider size="m" class="divider"></sp-divider>
                      `}
                ${this.renderContent()}
                ${this.hasFooter?this.renderFooter():i.nothing}
                ${this.hasButtons?this.renderButtons():i.nothing}
                ${this.dismissable?this.renderDismiss():i.nothing}
            </div>
        `}shouldUpdate(t){return t.has("mode")&&this.mode&&(this.dismissable=!1),t.has("dismissable")&&this.dismissable&&(this.dismissable=!this.mode),super.shouldUpdate(t)}firstUpdated(t){super.firstUpdated(t),this.setAttribute("role","dialog")}};ne([(0,n.query)(".close-button")],mt.prototype,"closeButton",2),ne([(0,n.property)({type:Boolean,reflect:!0})],mt.prototype,"error",2),ne([(0,n.property)({type:Boolean,reflect:!0})],mt.prototype,"dismissable",2),ne([(0,n.property)({type:Boolean,reflect:!0,attribute:"no-divider"})],mt.prototype,"noDivider",2),ne([(0,n.property)({type:String,reflect:!0})],mt.prototype,"mode",2),ne([(0,n.property)({type:String,reflect:!0})],mt.prototype,"size",2);P();b("sp-dialog",mt);h();S();h();var Qc=i.css`
:host{align-items:center;box-sizing:border-box;display:flex;height:100vh;height:-webkit-fill-available;height:-moz-available;height:stretch;justify-content:center;left:0;pointer-events:none;position:fixed;top:0;transition:visibility 0s linear var(--spectrum-global-animation-duration-100,.13s);visibility:hidden;width:100vw;z-index:2}:host([open]){visibility:visible}@media only screen and (max-device-height:350px),only screen and (max-device-width:400px){:host([responsive]){border-radius:0;height:100%;max-height:100%;max-width:100%;width:100%}:host([responsive]){margin-top:0}}
`,xs=Qc;h();var Jc=i.css`
.modal{opacity:0;pointer-events:none;transition:transform var(--spectrum-global-animation-duration-100,.13s) ease-in-out,opacity var(--spectrum-global-animation-duration-100,.13s) ease-in-out,visibility 0s linear var(--spectrum-global-animation-duration-100,.13s);visibility:hidden}:host([open]) .modal{opacity:1;pointer-events:auto;transition-delay:0s;visibility:visible}:host{--spectrum-dialog-confirm-exit-animation-delay:0s;--spectrum-dialog-fullscreen-margin:32px;--spectrum-dialog-max-height:90vh;--spectrum-dialog-max-width:90%}.modal{border-radius:var(
--spectrum-dialog-confirm-border-radius,var(--spectrum-alias-component-border-radius)
);max-height:var(--spectrum-dialog-max-height);max-width:var(--spectrum-dialog-max-width);outline:none;overflow:hidden;pointer-events:auto;transform:translateY(var(
--spectrum-dialog-confirm-entry-animation-distance,var(--spectrum-global-dimension-size-250)
));transition:opacity var(
--spectrum-dialog-confirm-exit-animation-duration,var(--spectrum-global-animation-duration-100)
) cubic-bezier(.5,0,1,1) var(--spectrum-dialog-confirm-exit-animation-delay,0s),visibility 0s linear calc(var(--spectrum-dialog-confirm-exit-animation-delay, 0s) + var(
--spectrum-dialog-confirm-exit-animation-duration,
var(--spectrum-global-animation-duration-100)
)),transform 0s linear calc(var(--spectrum-dialog-confirm-exit-animation-delay, 0s) + var(
--spectrum-dialog-confirm-exit-animation-duration,
var(--spectrum-global-animation-duration-100)
));z-index:2}:host([open]) .modal{transform:translateY(0);transition:transform var(
--spectrum-dialog-confirm-entry-animation-duration,var(--spectrum-global-animation-duration-500)
) cubic-bezier(0,0,.4,1) var(
--spectrum-dialog-confirm-entry-animation-delay,var(--spectrum-global-animation-duration-200)
),opacity var(
--spectrum-dialog-confirm-entry-animation-duration,var(--spectrum-global-animation-duration-500)
) cubic-bezier(0,0,.4,1) var(
--spectrum-dialog-confirm-entry-animation-delay,var(--spectrum-global-animation-duration-200)
)}@media only screen and (max-device-height:350px),only screen and (max-device-width:400px){:host([responsive]) .modal{border-radius:0;height:100%;max-height:100%;max-width:100%;width:100%}}.fullscreen{bottom:var(--spectrum-dialog-fullscreen-margin);left:var(--spectrum-dialog-fullscreen-margin);right:var(--spectrum-dialog-fullscreen-margin);top:var(--spectrum-dialog-fullscreen-margin)}.fullscreen,.fullscreenTakeover{max-height:none;max-width:none;position:fixed}.fullscreenTakeover{border:none;border-radius:0;box-sizing:border-box;inset:0}.fullscreenTakeover,:host([open]) .fullscreenTakeover{transform:none}.modal{background:var(--spectrum-gray-100)}:host{--spectrum-dialog-confirm-exit-animation-duration:var(--swc-test-duration);--spectrum-dialog-confirm-entry-animation-duration:var(
--swc-test-duration
);height:100dvh}.modal{overflow:visible}
`,ks=Jc;kt();ce();var ti=Object.defineProperty,ei=Object.getOwnPropertyDescriptor,Se=(s,t,e,r)=>{for(var o=r>1?void 0:r?ei(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&ti(t,e,o),o},wt=class extends lt(I){constructor(){super(...arguments),this.dismissable=!1,this.open=!1,this.responsive=!1,this.transitionPromise=Promise.resolve(),this.resolveTransitionPromise=()=>{},this.underlay=!1,this.animating=!1}static get styles(){return[xs,ks]}get dialog(){return this.shadowRoot.querySelector("slot").assignedElements()[0]||this}async focus(){if(this.shadowRoot){let t=Lt(this.dialog);t?(t.updateComplete&&await t.updateComplete,t.focus()):this.dialog.focus()}else super.focus()}overlayWillCloseCallback(){return this.open?(this.close(),!0):this.animating}dismiss(){this.dismissable&&this.close()}handleClose(t){t.stopPropagation(),this.close()}close(){this.open=!1}dispatchClosed(){this.dispatchEvent(new Event("close",{bubbles:!0}))}handleTransitionEvent(t){this.dispatchEvent(new TransitionEvent(t.type,{bubbles:!0,composed:!0,propertyName:t.propertyName}))}handleUnderlayTransitionend(t){!this.open&&t.propertyName==="visibility"&&this.resolveTransitionPromise(),this.handleTransitionEvent(t)}handleModalTransitionend(t){(this.open||!this.underlay)&&this.resolveTransitionPromise(),this.handleTransitionEvent(t)}update(t){t.has("open")&&t.get("open")!==void 0&&(this.animating=!0,this.transitionPromise=new Promise(e=>{this.resolveTransitionPromise=()=>{this.animating=!1,e()}}),this.open||this.dispatchClosed()),super.update(t)}renderDialog(){return i.html`
            <slot></slot>
        `}render(){return i.html`
            ${this.underlay?i.html`
                      <sp-underlay
                          ?open=${this.open}
                          @click=${this.dismiss}
                          @transitionrun=${this.handleTransitionEvent}
                          @transitionend=${this.handleUnderlayTransitionend}
                          @transitioncancel=${this.handleTransitionEvent}
                      ></sp-underlay>
                  `:i.nothing}
            <div
                class="modal ${this.mode}"
                @transitionrun=${this.handleTransitionEvent}
                @transitionend=${this.handleModalTransitionend}
                @transitioncancel=${this.handleTransitionEvent}
                @close=${this.handleClose}
            >
                ${this.renderDialog()}
            </div>
        `}updated(t){t.has("open")&&this.open&&"updateComplete"in this.dialog&&"shouldManageTabOrderForScrolling"in this.dialog&&this.dialog.updateComplete.then(()=>{this.dialog.shouldManageTabOrderForScrolling()})}async getUpdateComplete(){let t=await super.getUpdateComplete();return await this.transitionPromise,t}};Se([(0,n.property)({type:Boolean,reflect:!0})],wt.prototype,"dismissable",2),Se([(0,n.property)({type:Boolean,reflect:!0})],wt.prototype,"open",2),Se([(0,n.property)({type:String,reflect:!0})],wt.prototype,"mode",2),Se([(0,n.property)({type:Boolean})],wt.prototype,"responsive",2),Se([(0,n.property)({type:Boolean})],wt.prototype,"underlay",2);var ri=Object.defineProperty,oi=Object.getOwnPropertyDescriptor,ot=(s,t,e,r)=>{for(var o=r>1?void 0:r?oi(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&ri(t,e,o),o},_=class extends wt{constructor(){super(...arguments),this.error=!1,this.cancelLabel="",this.confirmLabel="",this.footer="",this.hero="",this.heroLabel="",this.noDivider=!1,this.secondaryLabel="",this.headline=""}static get styles(){return[...super.styles]}get dialog(){return this.shadowRoot.querySelector("sp-dialog")}clickSecondary(){this.dispatchEvent(new Event("secondary",{bubbles:!0}))}clickCancel(){this.dispatchEvent(new Event("cancel",{bubbles:!0}))}clickConfirm(){this.dispatchEvent(new Event("confirm",{bubbles:!0}))}renderDialog(){let t=this.noDivider||!this.headline||this.headlineVisibility==="none";return i.html`
            <sp-dialog
                ?dismissable=${this.dismissable}
                ?no-divider=${t}
                ?error=${this.error}
                mode=${z(this.mode)}
                size=${z(this.size)}
            >
                ${this.hero?i.html`
                          <img
                              src="${this.hero}"
                              slot="hero"
                              aria-hidden=${z(this.heroLabel?void 0:"true")}
                              alt=${z(this.heroLabel?this.heroLabel:void 0)}
                          />
                      `:i.nothing}
                ${this.headline?i.html`
                          <h2
                              slot="heading"
                              ?hidden=${this.headlineVisibility==="none"}
                          >
                              ${this.headline}
                          </h2>
                      `:i.nothing}
                <slot></slot>
                ${this.footer?i.html`
                          <div slot="footer">${this.footer}</div>
                      `:i.nothing}
                ${this.cancelLabel?i.html`
                          <sp-button
                              variant="secondary"
                              treatment="outline"
                              slot="button"
                              @click=${this.clickCancel}
                          >
                              ${this.cancelLabel}
                          </sp-button>
                      `:i.nothing}
                ${this.secondaryLabel?i.html`
                          <sp-button
                              variant="primary"
                              treatment="outline"
                              slot="button"
                              @click=${this.clickSecondary}
                          >
                              ${this.secondaryLabel}
                          </sp-button>
                      `:i.nothing}
                ${this.confirmLabel?i.html`
                          <sp-button
                              variant="accent"
                              slot="button"
                              @click=${this.clickConfirm}
                          >
                              ${this.confirmLabel}
                          </sp-button>
                      `:i.nothing}
            </sp-dialog>
        `}};ot([(0,n.property)({type:Boolean,reflect:!0})],_.prototype,"error",2),ot([(0,n.property)({attribute:"cancel-label"})],_.prototype,"cancelLabel",2),ot([(0,n.property)({attribute:"confirm-label"})],_.prototype,"confirmLabel",2),ot([(0,n.property)()],_.prototype,"footer",2),ot([(0,n.property)()],_.prototype,"hero",2),ot([(0,n.property)({attribute:"hero-label"})],_.prototype,"heroLabel",2),ot([(0,n.property)({type:Boolean,reflect:!0,attribute:"no-divider"})],_.prototype,"noDivider",2),ot([(0,n.property)({type:String,reflect:!0})],_.prototype,"size",2),ot([(0,n.property)({attribute:"secondary-label"})],_.prototype,"secondaryLabel",2),ot([(0,n.property)()],_.prototype,"headline",2),ot([(0,n.property)({type:String,attribute:"headline-visibility"})],_.prototype,"headlineVisibility",2);P();b("sp-dialog-wrapper",_);h();S();h();tt();ir();var ws=class zs{constructor(t,{mode:e}={mode:"internal"}){this.mode="internal",this.handleSlotchange=({target:r})=>{this.handleHelpText(r),this.handleNegativeHelpText(r)},this.host=t,this.instanceCount=zs.instanceCount++,this.id=`sp-help-text-${this.instanceCount}`,this.mode=e}get isInternal(){return this.mode==="internal"}render(t){return i.html`
            <div id=${z(this.isInternal?this.id:void 0)}>
                <slot
                    name=${t?"negative-help-text":`pass-through-help-text-${this.instanceCount}`}
                    @slotchange=${this.handleSlotchange}
                >
                    <slot name="help-text"></slot>
                </slot>
            </div>
        `}addId(){let t=this.helpTextElement?this.helpTextElement.id:this.id;this.conditionId=ut(this.host,"aria-describedby",t),this.host.hasAttribute("tabindex")&&(this.previousTabindex=parseFloat(this.host.getAttribute("tabindex"))),this.host.tabIndex=0}removeId(){this.conditionId&&(this.conditionId(),delete this.conditionId),!this.helpTextElement&&(this.previousTabindex?this.host.tabIndex=this.previousTabindex:this.host.removeAttribute("tabindex"))}handleHelpText(t){if(this.isInternal)return;this.helpTextElement&&this.helpTextElement.id===this.id&&this.helpTextElement.removeAttribute("id"),this.removeId();let e=t.assignedElements()[0];this.helpTextElement=e,e&&(e.id||(e.id=this.id),this.addId())}handleNegativeHelpText(t){t.name==="negative-help-text"&&t.assignedElements().forEach(e=>e.variant="negative")}};ws.instanceCount=0;var Cs=ws;function ur(s,{mode:t}={mode:"internal"}){class e extends s{constructor(){super(...arguments),this.helpTextManager=new Cs(this,{mode:t})}get helpTextId(){return this.helpTextManager.id}renderHelpText(o){return this.helpTextManager.render(o)}}return e}h();var si=i.css`
:host{--spectrum-fieldgroup-margin:var(--spectrum-spacing-300);--spectrum-fieldgroup-readonly-delimiter:","}.spectrum-FieldGroup--toplabel{flex-direction:column}.spectrum-FieldGroup--sidelabel{flex-direction:row}.group{display:flex;flex-flow:column wrap}:host([vertical]) .group{flex-direction:column}:host([horizontal]) .group{flex-direction:row}:host([horizontal]) .group slot:not([name])::slotted(:not(:last-child)){margin-inline-end:var(--spectrum-fieldgroup-margin)}:host([horizontal]) .group .spectrum-HelpText{flex-basis:100%}:host([dir=rtl]:not([vertical])) slot:not([name])::slotted(:not(:last-child)),:host([horizontal][dir=rtl]) slot:not([name])::slotted(:not(:last-child)){margin:0 0 0 var(--spectrum-fieldgroup-margin)}:host([dir=ltr]:not([vertical])) slot:not([name])::slotted(:not(:last-child)),:host([horizontal][dir=ltr]) slot:not([name])::slotted(:not(:last-child)){margin:0 var(--spectrum-fieldgroup-margin) 0 0}
`,Es=si;var ai=Object.defineProperty,ci=Object.getOwnPropertyDescriptor,mr=(s,t,e,r)=>{for(var o=r>1?void 0:r?ci(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&ai(t,e,o),o},pt=class extends ur(I,{mode:"external"}){constructor(){super(...arguments),this.horizontal=!1,this.invalid=!1,this.label="",this.vertical=!1}static get styles(){return[Es]}handleSlotchange(){}render(){return i.html`
            <div class="group" role="presentation">
                <slot @slotchange=${this.handleSlotchange}></slot>
            </div>
            ${this.renderHelpText(this.invalid)}
        `}updated(t){super.updated(t),t.has("label")&&(this.label?this.setAttribute("aria-label",this.label):this.removeAttribute("aria-label"))}};mr([(0,n.property)({type:Boolean,reflect:!0})],pt.prototype,"horizontal",2),mr([(0,n.property)({type:Boolean,reflect:!0})],pt.prototype,"invalid",2),mr([(0,n.property)()],pt.prototype,"label",2),mr([(0,n.property)({type:Boolean,reflect:!0})],pt.prototype,"vertical",2);P();b("sp-field-group",pt);h();var Ps=({width:s=24,height:t=24,hidden:e=!1,title:r="Link Out Light"}={})=>oe`<svg
    xmlns="http://www.w3.org/2000/svg"
    height=${t}
    viewBox="0 0 36 36"
    width=${s}
    aria-hidden=${e?"true":"false"}
    role="img"
    fill="currentColor"
    aria-label=${r}
  >
    <path
      d="M32 17.5V30H4V4h14.5a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H3a1 1 0 0 0-1 1v28a1 1 0 0 0 1 1h30a1 1 0 0 0 1-1V17.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5Z"
    />
    <path
      d="m23.54 2.853 3.389 3.39-9.546 9.546a.5.5 0 0 0 0 .707l2.117 2.121a.5.5 0 0 0 .707 0l9.546-9.546 3.389 3.389a.5.5 0 0 0 .858-.353V2H23.893a.5.5 0 0 0-.353.853Z"
    />
  </svg>`;var pr=class extends T{render(){return se(i.html),Ps({hidden:!this.label,title:this.label})}};P();b("sp-icon-link-out-light",pr);h();kt();S();Ee();Ft();h();var Is=({width:s=24,height:t=24,title:e="Chevron100"}={})=>j`<svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 10"
    aria-hidden="true"
    role="img"
    fill="currentColor"
    aria-label=${e}
    width=${s}
    height=${t}
  >
    <path
      d="M3 9.95a.875.875 0 01-.615-1.498L5.88 5 2.385 1.547A.875.875 0 013.615.302L7.74 4.377a.876.876 0 010 1.246L3.615 9.698A.872.872 0 013 9.95z"
    />
  </svg>`;var dr=class extends T{render(){return A(i.html),Is()}};P();b("sp-icon-chevron100",dr);h();var ii=i.css`
.spectrum-UIIcon-ChevronDown100,.spectrum-UIIcon-ChevronDown200,.spectrum-UIIcon-ChevronDown300,.spectrum-UIIcon-ChevronDown400,.spectrum-UIIcon-ChevronDown50,.spectrum-UIIcon-ChevronDown500,.spectrum-UIIcon-ChevronDown75{transform:rotate(90deg)}.spectrum-UIIcon-ChevronLeft100,.spectrum-UIIcon-ChevronLeft200,.spectrum-UIIcon-ChevronLeft300,.spectrum-UIIcon-ChevronLeft400,.spectrum-UIIcon-ChevronLeft50,.spectrum-UIIcon-ChevronLeft500,.spectrum-UIIcon-ChevronLeft75{transform:rotate(180deg)}.spectrum-UIIcon-ChevronUp100,.spectrum-UIIcon-ChevronUp200,.spectrum-UIIcon-ChevronUp300,.spectrum-UIIcon-ChevronUp400,.spectrum-UIIcon-ChevronUp50,.spectrum-UIIcon-ChevronUp500,.spectrum-UIIcon-ChevronUp75{transform:rotate(270deg)}.spectrum-UIIcon-ChevronDown50,.spectrum-UIIcon-ChevronLeft50,.spectrum-UIIcon-ChevronRight50,.spectrum-UIIcon-ChevronUp50{height:var(--spectrum-icon-chevron-size-50);width:var(--spectrum-icon-chevron-size-50)}.spectrum-UIIcon-ChevronDown75,.spectrum-UIIcon-ChevronLeft75,.spectrum-UIIcon-ChevronRight75,.spectrum-UIIcon-ChevronUp75{height:var(--spectrum-alias-ui-icon-chevron-size-75);width:var(--spectrum-alias-ui-icon-chevron-size-75)}.spectrum-UIIcon-ChevronDown100,.spectrum-UIIcon-ChevronLeft100,.spectrum-UIIcon-ChevronRight100,.spectrum-UIIcon-ChevronUp100{height:var(--spectrum-alias-ui-icon-chevron-size-100);width:var(--spectrum-alias-ui-icon-chevron-size-100)}.spectrum-UIIcon-ChevronDown200,.spectrum-UIIcon-ChevronLeft200,.spectrum-UIIcon-ChevronRight200,.spectrum-UIIcon-ChevronUp200{height:var(--spectrum-alias-ui-icon-chevron-size-200);width:var(--spectrum-alias-ui-icon-chevron-size-200)}.spectrum-UIIcon-ChevronDown300,.spectrum-UIIcon-ChevronLeft300,.spectrum-UIIcon-ChevronRight300,.spectrum-UIIcon-ChevronUp300{height:var(--spectrum-alias-ui-icon-chevron-size-300);width:var(--spectrum-alias-ui-icon-chevron-size-300)}.spectrum-UIIcon-ChevronDown400,.spectrum-UIIcon-ChevronLeft400,.spectrum-UIIcon-ChevronRight400,.spectrum-UIIcon-ChevronUp400{height:var(--spectrum-alias-ui-icon-chevron-size-400);width:var(--spectrum-alias-ui-icon-chevron-size-400)}.spectrum-UIIcon-ChevronDown500,.spectrum-UIIcon-ChevronLeft500,.spectrum-UIIcon-ChevronRight500,.spectrum-UIIcon-ChevronUp500{height:var(--spectrum-alias-ui-icon-chevron-size-500);width:var(--spectrum-alias-ui-icon-chevron-size-500)}
`,Ts=ii;h();var ni=i.css`
::slotted([slot=icon]){fill:var(
--highcontrast-menu-item-color-default,var(
--mod-menu-item-label-icon-color-default,var(--spectrum-menu-item-label-icon-color-default)
)
);color:var(
--highcontrast-menu-item-color-default,var(
--mod-menu-item-label-icon-color-default,var(--spectrum-menu-item-label-icon-color-default)
)
)}.checkmark{fill:var(
--highcontrast-menu-checkmark-icon-color-default,var(
--mod-menu-checkmark-icon-color-default,var(--spectrum-menu-checkmark-icon-color-default)
)
);align-self:center;color:var(
--highcontrast-menu-checkmark-icon-color-default,var(
--mod-menu-checkmark-icon-color-default,var(--spectrum-menu-checkmark-icon-color-default)
)
);display:var(
--mod-menu-checkmark-display,var(--spectrum-menu-checkmark-display)
);opacity:1}:host{align-items:center;background-color:var(
--highcontrast-menu-item-background-color-default,var(
--mod-menu-item-background-color-default,var(--spectrum-menu-item-background-color-default)
)
);box-sizing:border-box;cursor:pointer;line-height:var(
--mod-menu-item-label-line-height,var(--spectrum-menu-item-label-line-height)
);margin:0;min-block-size:var(
--mod-menu-item-min-height,var(--spectrum-menu-item-min-height)
);padding-block-end:var(
--mod-menu-item-bottom-edge-to-text,var(--spectrum-menu-item-bottom-edge-to-text)
);padding-block-start:var(
--mod-menu-item-top-edge-to-text,var(--spectrum-menu-item-top-edge-to-text)
);padding-inline:var(
--mod-menu-item-label-inline-edge-to-content,var(--spectrum-menu-item-label-inline-edge-to-content)
);position:relative;-webkit-text-decoration:none;text-decoration:none}:host{display:grid;grid-template:". chevronAreaCollapsible . iconArea sectionHeadingArea . . ." 1fr "selectedArea chevronAreaCollapsible checkmarkArea iconArea labelArea valueArea actionsArea chevronAreaDrillIn" ". . . . descriptionArea . . ." ". . . . submenuArea . . ."/auto auto auto auto 1fr auto auto auto}#label{grid-area:submenuItemLabelArea}::slotted([slot=value]){grid-area:submenuItemValueArea}:host(:focus),:host([focused]){background-color:var(
--highcontrast-menu-item-background-color-focus,var(
--mod-menu-item-background-color-key-focus,var(--spectrum-menu-item-background-color-key-focus)
)
);outline:none}:host(:focus)>#label,:host([focused])>#label{color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-content-color-focus,var(--spectrum-menu-item-label-content-color-focus)
)
)}:host(:focus)>[name=description]::slotted(*),:host([focused])>[name=description]::slotted(*){color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-description-color-focus,var(--spectrum-menu-item-description-color-focus)
)
)}:host(:focus)>::slotted([slot=value]),:host([focused])>::slotted([slot=value]){color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-value-color-focus,var(--spectrum-menu-item-value-color-focus)
)
)}:host(:focus)>.icon:not(.chevron,.checkmark),:host([focused])>.icon:not(.chevron,.checkmark){fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-icon-color-focus,var(--spectrum-menu-item-label-icon-color-focus)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-icon-color-focus,var(--spectrum-menu-item-label-icon-color-focus)
)
)}:host(:focus)>.chevron,:host([focused])>.chevron{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-collapsible-icon-color,var(--spectrum-menu-collapsible-icon-color)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-collapsible-icon-color,var(--spectrum-menu-collapsible-icon-color)
)
)}:host(:focus)>.checkmark,:host([focused])>.checkmark{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-checkmark-icon-color-focus,var(--spectrum-menu-checkmark-icon-color-focus)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-checkmark-icon-color-focus,var(--spectrum-menu-checkmark-icon-color-focus)
)
)}:host([focused]){box-shadow:inset calc(var(
--mod-menu-item-focus-indicator-width,
var(--spectrum-menu-item-focus-indicator-width)
)*var(--spectrum-menu-item-focus-indicator-direction-scalar, 1)) 0 0 0 var(
--highcontrast-menu-item-focus-indicator-color,var(
--mod-menu-item-focus-indicator-color,var(--spectrum-menu-item-focus-indicator-color)
)
)}:host([dir=rtl]){--spectrum-menu-item-focus-indicator-direction-scalar:-1}:host(:hover){background-color:var(
--highcontrast-menu-item-background-color-focus,var(
--mod-menu-item-background-color-hover,var(--spectrum-menu-item-background-color-hover)
)
)}:host(:hover)>#label{color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-content-color-hover,var(--spectrum-menu-item-label-content-color-hover)
)
)}:host(:hover)>[name=description]::slotted(*){color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-description-color-hover,var(--spectrum-menu-item-description-color-hover)
)
)}:host(:hover)>::slotted([slot=value]){color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-value-color-hover,var(--spectrum-menu-item-value-color-hover)
)
)}:host(:hover)>.icon:not(.chevron,.checkmark){fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-icon-color-hover,var(--spectrum-menu-item-label-icon-color-hover)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-icon-color-hover,var(--spectrum-menu-item-label-icon-color-hover)
)
)}:host(:hover)>.chevron{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-collapsible-icon-color,var(--spectrum-menu-collapsible-icon-color)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-collapsible-icon-color,var(--spectrum-menu-collapsible-icon-color)
)
)}:host(:hover)>.checkmark{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-checkmark-icon-color-hover,var(--spectrum-menu-checkmark-icon-color-hover)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-checkmark-icon-color-hover,var(--spectrum-menu-checkmark-icon-color-hover)
)
)}:host:active{background-color:var(
--highcontrast-menu-item-background-color-focus,var(
--mod-menu-item-background-color-down,var(--spectrum-menu-item-background-color-down)
)
)}:host:active>#label{color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-content-color-down,var(--spectrum-menu-item-label-content-color-down)
)
)}:host:active>[name=description]::slotted(*){color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-description-color-down,var(--spectrum-menu-item-description-color-down)
)
)}:host:active>::slotted([slot=value]){color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-value-color-down,var(--spectrum-menu-item-value-color-down)
)
)}:host:active>.icon:not(.chevron,.checkmark){fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-icon-color-down,var(--spectrum-menu-item-label-icon-color-down)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-icon-color-down,var(--spectrum-menu-item-label-icon-color-down)
)
)}:host:active>.chevron{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-collapsible-icon-color,var(--spectrum-menu-collapsible-icon-color)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-collapsible-icon-color,var(--spectrum-menu-collapsible-icon-color)
)
)}:host:active>.checkmark{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-checkmark-icon-color-down,var(--spectrum-menu-checkmark-icon-color-down)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-checkmark-icon-color-down,var(--spectrum-menu-checkmark-icon-color-down)
)
)}:host([aria-disabled=true]),:host([disabled]){background-color:#0000}:host([aria-disabled=true]) #label,:host([disabled]) #label{color:var(
--highcontrast-menu-item-color-disabled,var(
--mod-menu-item-label-content-color-disabled,var(--spectrum-menu-item-label-content-color-disabled)
)
)}:host([aria-disabled=true]) [name=description]::slotted(*),:host([disabled]) [name=description]::slotted(*){color:var(
--highcontrast-menu-item-color-disabled,var(
--mod-menu-item-description-color-disabled,var(--spectrum-menu-item-description-color-disabled)
)
)}:host([aria-disabled=true]) ::slotted([slot=icon]),:host([disabled]) ::slotted([slot=icon]){fill:var(
--highcontrast-menu-item-color-disabled,var(
--mod-menu-item-label-icon-color-disabled,var(--spectrum-menu-item-label-icon-color-disabled)
)
);color:var(
--highcontrast-menu-item-color-disabled,var(
--mod-menu-item-label-icon-color-disabled,var(--spectrum-menu-item-label-icon-color-disabled)
)
)}:host([aria-disabled=true]:hover),:host([disabled]:hover){cursor:default}:host([aria-disabled=true]:hover) ::slotted([slot=icon]),:host([disabled]:hover) ::slotted([slot=icon]){fill:var(
--highcontrast-menu-item-color-disabled,var(
--mod-menu-item-label-icon-color-disabled,var(--spectrum-menu-item-label-icon-color-disabled)
)
);color:var(
--highcontrast-menu-item-color-disabled,var(
--mod-menu-item-label-icon-color-disabled,var(--spectrum-menu-item-label-icon-color-disabled)
)
)}::slotted([slot=icon]){align-self:start;grid-area:iconArea}.checkmark{align-self:start;grid-area:checkmarkArea}.menu-itemSelection{grid-area:selectedArea}#label{color:var(
--highcontrast-menu-item-color-default,var(
--mod-menu-item-label-content-color-default,var(--spectrum-menu-item-label-content-color-default)
)
);font-size:var(
--mod-menu-item-label-font-size,var(--spectrum-menu-item-label-font-size)
);grid-area:labelArea}::slotted([slot=value]){grid-area:valueArea}.spectrum-Menu-itemActions{grid-area:actionsArea}.chevron{align-self:center;block-size:var(--spectrum-menu-item-checkmark-height);grid-area:chevronArea;height:var(--spectrum-menu-item-checkmark-height);inline-size:var(--spectrum-menu-item-checkmark-width);width:var(--spectrum-menu-item-checkmark-width)}.spectrum-Menu-item--collapsible .chevron{grid-area:chevronAreaCollapsible}[name=description]::slotted(*){grid-area:descriptionArea}:host([has-submenu]) .chevron{grid-area:chevronAreaDrillIn}.icon:not(.chevron,.checkmark){block-size:var(
--mod-menu-item-icon-height,var(--spectrum-menu-item-icon-height)
);inline-size:var(
--mod-menu-item-icon-width,var(--spectrum-menu-item-icon-width)
)}.checkmark{block-size:var(
--mod-menu-item-checkmark-height,var(--spectrum-menu-item-checkmark-height)
);inline-size:var(
--mod-menu-item-checkmark-width,var(--spectrum-menu-item-checkmark-width)
);margin-block-start:calc(var(
--mod-menu-item-top-to-checkmark,
var(--spectrum-menu-item-top-to-checkmark)
) - var(
--mod-menu-item-top-edge-to-text,
var(--spectrum-menu-item-top-edge-to-text)
));margin-inline-end:var(
--mod-menu-item-text-to-control,var(--spectrum-menu-item-text-to-control)
)}::slotted([slot=icon]){margin-inline-end:var(
--mod-menu-item-label-text-to-visual,var(--spectrum-menu-item-label-text-to-visual)
)}.chevron{margin-inline-end:var(
--mod-menu-item-text-to-control,var(--spectrum-menu-item-text-to-control)
)}[name=description]::slotted(*){color:var(
--highcontrast-menu-item-color-default,var(
--mod-menu-item-description-color-default,var(--spectrum-menu-item-description-color-default)
)
);font-size:var(
--mod-menu-item-description-font-size,var(--spectrum-menu-item-description-font-size)
);-webkit-hyphens:auto;hyphens:auto;line-height:var(
--mod-menu-item-description-line-height,var(--spectrum-menu-item-description-line-height)
);margin-block-start:var(
--mod-menu-item-label-to-description-spacing,var(--spectrum-menu-item-label-to-description-spacing)
);overflow-wrap:break-word}::slotted([slot=value]){color:var(
--highcontrast-menu-item-color-default,var(
--mod-menu-item-value-color-default,var(--spectrum-menu-item-value-color-default)
)
);font-size:var(
--mod-menu-item-label-font-size,var(--spectrum-menu-item-label-font-size)
);justify-self:end;margin-inline-start:var(
--mod-menu-item-label-to-value-area-min-spacing,var(--spectrum-menu-item-label-to-value-area-min-spacing)
)}:host([no-wrap]) #label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.spectrum-Menu-item--collapsible.is-open{padding-block-end:0}.spectrum-Menu-item--collapsible.is-open .chevron{transform:rotate(90deg)}.spectrum-Menu-item--collapsible.is-open:active,.spectrum-Menu-item--collapsible.is-open:focus,.spectrum-Menu-item--collapsible.is-open:hover,:host([focused]) .spectrum-Menu-item--collapsible.is-open{background-color:var(
--highcontrast-menu-item-background-color-default,var(
--mod-menu-item-background-color-default,var(--spectrum-menu-item-background-color-default)
)
)}.spectrum-Menu-item--collapsible>::slotted([slot=icon]){padding-block-end:var(
--mod-menu-section-header-bottom-edge-to-text,var(
--mod-menu-item-bottom-edge-to-text,var(--spectrum-menu-item-bottom-edge-to-text)
)
);padding-block-start:var(
--mod-menu-section-header-top-edge-to-text,var(
--mod-menu-item-top-edge-to-text,var(--spectrum-menu-item-top-edge-to-text)
)
)}:host([dir=rtl]) .chevron{transform:rotate(-180deg)}:host([has-submenu]) .chevron{fill:var(
--highcontrast-menu-item-color-default,var(
--mod-menu-drillin-icon-color-default,var(--spectrum-menu-drillin-icon-color-default)
)
);color:var(
--highcontrast-menu-item-color-default,var(
--mod-menu-drillin-icon-color-default,var(--spectrum-menu-drillin-icon-color-default)
)
);margin-inline-end:0;margin-inline-start:var(
--mod-menu-item-label-to-value-area-min-spacing,var(--spectrum-menu-item-label-to-value-area-min-spacing)
)}:host([has-submenu]) .is-open{--spectrum-menu-item-background-color-default:var(
--highcontrast-menu-item-selected-background-color,var(
--mod-menu-item-background-color-hover,var(--spectrum-menu-item-background-color-hover)
)
)}:host([has-submenu]) .is-open .icon:not(.chevron,.checkmark){fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-icon-color-hover,var(--spectrum-menu-item-label-icon-color-hover)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-item-label-icon-color-hover,var(--spectrum-menu-item-label-icon-color-hover)
)
)}:host([has-submenu]) .is-open .chevron{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-drillin-icon-color-hover,var(--spectrum-menu-drillin-icon-color-hover)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-drillin-icon-color-hover,var(--spectrum-menu-drillin-icon-color-hover)
)
)}:host([has-submenu]) .is-open .checkmark{fill:var(
--highcontrast-menu-checkmark-icon-color-default,var(
--mod-menu-checkmark-icon-color-hover,var(--spectrum-menu-checkmark-icon-color-hover)
)
);color:var(
--highcontrast-menu-checkmark-icon-color-default,var(
--mod-menu-checkmark-icon-color-hover,var(--spectrum-menu-checkmark-icon-color-hover)
)
)}:host([has-submenu]:hover) .chevron{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-drillin-icon-color-hover,var(--spectrum-menu-drillin-icon-color-hover)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-drillin-icon-color-hover,var(--spectrum-menu-drillin-icon-color-hover)
)
)}:host([has-submenu]:focus) .chevron,:host([has-submenu][focused]) .chevron{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-drillin-icon-color-focus,var(--spectrum-menu-drillin-icon-color-focus)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-drillin-icon-color-focus,var(--spectrum-menu-drillin-icon-color-focus)
)
)}:host([has-submenu]):active .chevron{fill:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-drillin-icon-color-down,var(--spectrum-menu-drillin-icon-color-down)
)
);color:var(
--highcontrast-menu-item-color-focus,var(
--mod-menu-drillin-icon-color-down,var(--spectrum-menu-drillin-icon-color-down)
)
)}#label{flex:1 1 auto;-webkit-hyphens:auto;hyphens:auto;line-height:var(--spectrum-listitem-texticon-label-line-height);overflow-wrap:break-word;width:calc(100% - var(--spectrum-listitem-texticon-ui-icon-width) - var(--spectrum-listitem-texticon-icon-gap))}.spectrum-Menu-itemLabel--wrapping{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host([hidden]){display:none}:host([disabled]){pointer-events:none}#button{inset:0;position:absolute}:host([dir=ltr]) [icon-only]::slotted(:last-of-type){margin-right:auto}:host([dir=rtl]) [icon-only]::slotted(:last-of-type){margin-left:auto}@media (forced-colors:active){:host{forced-color-adjust:none}}::slotted([slot=submenu]){max-width:100%;width:max-content}
`,Ss=ni;Me();var _i=Object.defineProperty,Ni=Object.getOwnPropertyDescriptor,at=(s,t,e,r)=>{for(var o=r>1?void 0:r?Ni(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&_i(t,e,o),o},Vi=100,bo=class extends Event{constructor(t){super("sp-menu-item-added-or-updated",{bubbles:!0,composed:!0}),this.menuCascade=new WeakMap,this.clear(t)}clear(t){this._item=t,this.currentAncestorWithSelects=void 0,t.menuData={cleanupSteps:[],focusRoot:void 0,selectionRoot:void 0,parentMenu:void 0},this.menuCascade=new WeakMap}get item(){return this._item}},K=class extends Qt(_e(cr(U,'[slot="icon"]'))){constructor(){super(),this.active=!1,this.focused=!1,this.selected=!1,this._value="",this.hasSubmenu=!1,this.noWrap=!1,this.open=!1,this.proxyFocus=()=>{this.focus()},this.handleBeforetoggle=t=>{t.newState==="closed"&&(this.open=!0,this.overlayElement.manuallyKeepOpen(),this.overlayElement.removeEventListener("beforetoggle",this.handleBeforetoggle))},this.recentlyLeftChild=!1,this.willDispatchUpdate=!1,this.menuData={focusRoot:void 0,parentMenu:void 0,selectionRoot:void 0,cleanupSteps:[]},this.addEventListener("click",this.handleClickCapture,{capture:!0}),new At(this,{config:{characterData:!0,childList:!0,subtree:!0},callback:()=>{this.breakItemChildrenCache()}})}static get styles(){return[Ss,Jt,Ts]}get value(){return this._value||this.itemText}set value(t){t!==this._value&&(this._value=t||"",this._value?this.setAttribute("value",this._value):this.removeAttribute("value"))}get itemText(){return this.itemChildren.content.reduce((t,e)=>t+(e.textContent||"").trim(),"")}get focusElement(){return this}get hasIcon(){return this.slotContentIsPresent}get itemChildren(){if(!this.iconSlot||!this.contentSlot)return{icon:[],content:[]};if(this._itemChildren)return this._itemChildren;let t=this.iconSlot.assignedElements().map(r=>{let o=r.cloneNode(!0);return o.removeAttribute("slot"),o.classList.toggle("icon"),o}),e=this.contentSlot.assignedNodes().map(r=>r.cloneNode(!0));return this._itemChildren={icon:t,content:e},this._itemChildren}click(){this.disabled||this.shouldProxyClick()||super.click()}handleClickCapture(t){if(this.disabled)return t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation(),!1}shouldProxyClick(){let t=!1;return this.anchorElement&&(this.anchorElement.click(),t=!0),t}breakItemChildrenCache(){this._itemChildren=void 0,this.triggerUpdate()}renderSubmenu(){let t=i.html`
            <slot
                name="submenu"
                @slotchange=${this.manageSubmenu}
                @sp-menu-item-added-or-updated=${{handleEvent:e=>{e.clear(e.item)},capture:!0}}
                @focusin=${e=>e.stopPropagation()}
            ></slot>
        `;return this.hasSubmenu?(Promise.resolve().then(()=>Nt()),Promise.resolve().then(()=>go()),i.html`
            <sp-overlay
                .triggerElement=${this}
                ?disabled=${!this.hasSubmenu}
                ?open=${this.hasSubmenu&&this.open}
                .placement=${this.isLTR?"right-start":"left-start"}
                .offset=${[-10,-4]}
                .type=${"auto"}
                @close=${e=>e.stopPropagation()}
            >
                <sp-popover
                    @change=${e=>{this.handleSubmenuChange(e),this.open=!1}}
                    @pointerenter=${this.handleSubmenuPointerenter}
                    @pointerleave=${this.handleSubmenuPointerleave}
                    @sp-menu-item-added-or-updated=${e=>e.stopPropagation()}
                >
                    ${t}
                </sp-popover>
            </sp-overlay>
            <sp-icon-chevron100
                class="spectrum-UIIcon-ChevronRight100 chevron icon"
            ></sp-icon-chevron100>
        `):t}render(){return i.html`
            ${this.selected?i.html`
                      <sp-icon-checkmark100
                          id="selected"
                          class="spectrum-UIIcon-Checkmark100 
                            icon 
                            checkmark
                            ${this.hasIcon?"checkmark--withAdjacentIcon":""}"
                      ></sp-icon-checkmark100>
                  `:i.nothing}
            <slot name="icon"></slot>
            <div id="label">
                <slot id="slot"></slot>
            </div>
            <slot name="description"></slot>
            <slot name="value"></slot>
            ${this.href&&this.href.length>0?super.renderAnchor({id:"button",ariaHidden:!0,className:"button anchor hidden"}):i.nothing}
            ${this.renderSubmenu()}
        `}manageSubmenu(t){let e=t.target.assignedElements({flatten:!0});this.hasSubmenu=!!e.length,this.hasSubmenu&&this.setAttribute("aria-haspopup","true")}handleRemoveActive(){this.open||(this.active=!1)}handlePointerdown(t){this.active=!0,t.target===this&&this.hasSubmenu&&this.open&&(this.addEventListener("focus",this.handleSubmenuFocus,{once:!0}),this.overlayElement.addEventListener("beforetoggle",this.handleBeforetoggle))}firstUpdated(t){super.firstUpdated(t),this.setAttribute("tabindex","-1"),this.addEventListener("pointerdown",this.handlePointerdown),this.addEventListener("pointerenter",this.closeOverlaysForRoot),this.hasAttribute("id")||(this.id=`sp-menu-item-${crypto.randomUUID().slice(0,8)}`)}closeOverlaysForRoot(){var t;this.open||(t=this.menuData.parentMenu)==null||t.closeDescendentOverlays()}handleSubmenuClick(t){t.composedPath().includes(this.overlayElement)||this.openOverlay()}handleSubmenuFocus(){requestAnimationFrame(()=>{this.overlayElement.open=this.open})}handlePointerenter(){if(this.leaveTimeout){clearTimeout(this.leaveTimeout),delete this.leaveTimeout;return}this.openOverlay()}handlePointerleave(){this.open&&!this.recentlyLeftChild&&(this.leaveTimeout=setTimeout(()=>{delete this.leaveTimeout,this.open=!1},Vi))}handleSubmenuChange(t){var e;t.stopPropagation(),(e=this.menuData.selectionRoot)==null||e.selectOrToggleItem(this)}handleSubmenuPointerenter(){this.recentlyLeftChild=!0}async handleSubmenuPointerleave(){requestAnimationFrame(()=>{this.recentlyLeftChild=!1})}handleSubmenuOpen(t){this.focused=!1;let e=t.composedPath().find(r=>r!==this.overlayElement&&r.localName==="sp-overlay");this.overlayElement.parentOverlayToForceClose=e}cleanup(){this.open=!1,this.active=!1}async openOverlay(){!this.hasSubmenu||this.open||this.disabled||(this.open=!0,this.active=!0,this.setAttribute("aria-expanded","true"),this.addEventListener("sp-closed",this.cleanup,{once:!0}))}updateAriaSelected(){let t=this.getAttribute("role");t==="option"?this.setAttribute("aria-selected",this.selected?"true":"false"):(t==="menuitemcheckbox"||t==="menuitemradio")&&this.setAttribute("aria-checked",this.selected?"true":"false")}setRole(t){this.setAttribute("role",t),this.updateAriaSelected()}updated(t){var e,r,o;if(super.updated(t),t.has("label")&&(this.label||typeof t.get("label")<"u")&&this.setAttribute("aria-label",this.label||""),t.has("active")&&(this.active||typeof t.get("active")<"u"))if(this.active){(e=this.menuData.selectionRoot)==null||e.closeDescendentOverlays(),this.abortControllerPointer=new AbortController;let a={signal:this.abortControllerPointer.signal};this.addEventListener("pointerup",this.handleRemoveActive,a),this.addEventListener("pointerleave",this.handleRemoveActive,a),this.addEventListener("pointercancel",this.handleRemoveActive,a)}else(r=this.abortControllerPointer)==null||r.abort();if(this.anchorElement&&(this.anchorElement.addEventListener("focus",this.proxyFocus),this.anchorElement.tabIndex=-1),t.has("selected")&&this.updateAriaSelected(),t.has("hasSubmenu")&&(this.hasSubmenu||typeof t.get("hasSubmenu")<"u"))if(this.hasSubmenu){this.abortControllerSubmenu=new AbortController;let a={signal:this.abortControllerSubmenu.signal};this.addEventListener("click",this.handleSubmenuClick,a),this.addEventListener("pointerenter",this.handlePointerenter,a),this.addEventListener("pointerleave",this.handlePointerleave,a),this.addEventListener("sp-opened",this.handleSubmenuOpen,a)}else(o=this.abortControllerSubmenu)==null||o.abort()}connectedCallback(){super.connectedCallback(),this.triggerUpdate()}disconnectedCallback(){this.menuData.cleanupSteps.forEach(t=>t(this)),super.disconnectedCallback()}async triggerUpdate(){this.willDispatchUpdate||(this.willDispatchUpdate=!0,await new Promise(t=>requestAnimationFrame(t)),this.dispatchUpdate())}dispatchUpdate(){this.dispatchEvent(new bo(this)),this.willDispatchUpdate=!1}};at([(0,n.property)({type:Boolean,reflect:!0})],K.prototype,"active",2),at([(0,n.property)({type:Boolean,reflect:!0})],K.prototype,"focused",2),at([(0,n.property)({type:Boolean,reflect:!0})],K.prototype,"selected",2),at([(0,n.property)({type:String})],K.prototype,"value",1),at([(0,n.property)({type:Boolean,reflect:!0,attribute:"has-submenu"})],K.prototype,"hasSubmenu",2),at([(0,n.query)("slot:not([name])")],K.prototype,"contentSlot",2),at([(0,n.query)('slot[name="icon"]')],K.prototype,"iconSlot",2),at([(0,n.property)({type:Boolean,reflect:!0,attribute:"no-wrap",hasChanged(){return!1}})],K.prototype,"noWrap",2),at([(0,n.query)(".anchor")],K.prototype,"anchorElement",2),at([(0,n.query)("sp-overlay")],K.prototype,"overlayElement",2),at([(0,n.property)({type:Boolean,reflect:!0})],K.prototype,"open",2);P();b("sp-menu-item",K);h();S();h();var Ki=i.css`
:host{--spectrum-menu-item-min-height:var(--spectrum-component-height-100);--spectrum-menu-item-icon-height:var(--spectrum-workflow-icon-size-100);--spectrum-menu-item-icon-width:var(--spectrum-workflow-icon-size-100);--spectrum-menu-item-label-font-size:var(--spectrum-font-size-100);--spectrum-menu-item-label-text-to-visual:var(
--spectrum-text-to-visual-100
);--spectrum-menu-item-label-inline-edge-to-content:var(
--spectrum-component-edge-to-text-100
);--spectrum-menu-item-top-edge-to-text:var(
--spectrum-component-top-to-text-100
);--spectrum-menu-item-bottom-edge-to-text:var(
--spectrum-component-bottom-to-text-100
);--spectrum-menu-item-text-to-control:var(--spectrum-text-to-control-100);--spectrum-menu-item-description-font-size:var(--spectrum-font-size-75);--spectrum-menu-section-header-font-size:var(--spectrum-font-size-100);--spectrum-menu-section-header-min-width:var(
--spectrum-component-height-100
);--spectrum-menu-item-selectable-edge-to-text-not-selected:var(
--spectrum-menu-item-selectable-edge-to-text-not-selected-medium
);--spectrum-menu-item-checkmark-height:var(
--spectrum-menu-item-checkmark-height-medium
);--spectrum-menu-item-checkmark-width:var(
--spectrum-menu-item-checkmark-width-medium
);--spectrum-menu-item-top-to-checkmark:var(
--spectrum-menu-item-top-to-selected-icon-medium
);--spectrum-menu-item-label-line-height:var(--spectrum-line-height-100);--spectrum-menu-item-label-line-height-cjk:var(
--spectrum-cjk-line-height-100
);--spectrum-menu-item-label-to-description-spacing:var(
--spectrum-menu-item-label-to-description
);--spectrum-menu-item-focus-indicator-width:var(
--spectrum-border-width-200
);--spectrum-menu-item-focus-indicator-color:var(--spectrum-blue-800);--spectrum-menu-item-label-to-value-area-min-spacing:var(
--spectrum-spacing-100
);--spectrum-menu-item-label-content-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-menu-item-label-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-menu-item-label-content-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-menu-item-label-content-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-menu-item-label-icon-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-menu-item-label-icon-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-menu-item-label-icon-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-menu-item-label-icon-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-menu-item-label-content-color-disabled:var(
--spectrum-disabled-content-color
);--spectrum-menu-item-label-icon-color-disabled:var(
--spectrum-disabled-content-color
);--spectrum-menu-item-description-line-height:var(
--spectrum-line-height-100
);--spectrum-menu-item-description-line-height-cjk:var(
--spectrum-cjk-line-height-100
);--spectrum-menu-item-description-color-default:var(
--spectrum-neutral-subdued-content-color-default
);--spectrum-menu-item-description-color-hover:var(
--spectrum-neutral-subdued-content-color-hover
);--spectrum-menu-item-description-color-down:var(
--spectrum-neutral-subdued-content-color-down
);--spectrum-menu-item-description-color-focus:var(
--spectrum-neutral-subdued-content-color-key-focus
);--spectrum-menu-item-description-color-disabled:var(
--spectrum-disabled-content-color
);--spectrum-menu-section-header-line-height:var(--spectrum-line-height-100);--spectrum-menu-section-header-line-height-cjk:var(
--spectrum-cjk-line-height-100
);--spectrum-menu-section-header-font-weight:var(
--spectrum-bold-font-weight
);--spectrum-menu-section-header-color:var(--spectrum-gray-900);--spectrum-menu-collapsible-icon-color:var(--spectrum-gray-900);--spectrum-menu-checkmark-icon-color-default:var(
--spectrum-accent-color-900
);--spectrum-menu-checkmark-icon-color-hover:var(
--spectrum-accent-color-1000
);--spectrum-menu-checkmark-icon-color-down:var(
--spectrum-accent-color-1100
);--spectrum-menu-checkmark-icon-color-focus:var(
--spectrum-accent-color-1000
);--spectrum-menu-drillin-icon-color-default:var(
--spectrum-neutral-subdued-content-color-default
);--spectrum-menu-drillin-icon-color-hover:var(
--spectrum-neutral-subdued-content-color-hover
);--spectrum-menu-drillin-icon-color-down:var(
--spectrum-neutral-subdued-content-color-down
);--spectrum-menu-drillin-icon-color-focus:var(
--spectrum-neutral-subdued-content-color-key-focus
);--spectrum-menu-item-value-color-default:var(
--spectrum-neutral-subdued-content-color-default
);--spectrum-menu-item-value-color-hover:var(
--spectrum-neutral-subdued-content-color-hover
);--spectrum-menu-item-value-color-down:var(
--spectrum-neutral-subdued-content-color-down
);--spectrum-menu-item-value-color-focus:var(
--spectrum-neutral-subdued-content-color-key-focus
);--spectrum-menu-checkmark-display-hidden:none;--spectrum-menu-checkmark-display-shown:block;--spectrum-menu-checkmark-display:var(
--spectrum-menu-checkmark-display-shown
);--spectrum-menu-item-collapsible-has-icon-submenu-item-padding-x-start:calc(var(--spectrum-menu-item-label-inline-edge-to-content) + var(--spectrum-menu-item-checkmark-width) + var(--spectrum-menu-item-text-to-control) + var(--spectrum-menu-item-icon-width) + var(--spectrum-menu-item-label-text-to-visual) + var(--spectrum-menu-item-focus-indicator-width));--spectrum-menu-item-collapsible-no-icon-submenu-item-padding-x-start:calc(var(--spectrum-menu-item-label-inline-edge-to-content) + var(--spectrum-menu-item-checkmark-width) + var(--spectrum-menu-item-label-text-to-visual) + var(--spectrum-menu-item-focus-indicator-width))}:host([size=s]){--spectrum-menu-item-min-height:var(--spectrum-component-height-75);--spectrum-menu-item-icon-height:var(--spectrum-workflow-icon-size-75);--spectrum-menu-item-icon-width:var(--spectrum-workflow-icon-size-75);--spectrum-menu-item-label-font-size:var(--spectrum-font-size-75);--spectrum-menu-item-label-text-to-visual:var(
--spectrum-text-to-visual-75
);--spectrum-menu-item-label-inline-edge-to-content:var(
--spectrum-component-edge-to-text-75
);--spectrum-menu-item-top-edge-to-text:var(
--spectrum-component-top-to-text-75
);--spectrum-menu-item-bottom-edge-to-text:var(
--spectrum-component-bottom-to-text-75
);--spectrum-menu-item-text-to-control:var(--spectrum-text-to-control-75);--spectrum-menu-item-description-font-size:var(--spectrum-font-size-50);--spectrum-menu-section-header-font-size:var(--spectrum-font-size-75);--spectrum-menu-section-header-min-width:var(
--spectrum-component-height-75
);--spectrum-menu-item-selectable-edge-to-text-not-selected:var(
--spectrum-menu-item-selectable-edge-to-text-not-selected-small
);--spectrum-menu-item-checkmark-height:var(
--spectrum-menu-item-checkmark-height-small
);--spectrum-menu-item-checkmark-width:var(
--spectrum-menu-item-checkmark-width-small
);--spectrum-menu-item-top-to-checkmark:var(
--spectrum-menu-item-top-to-selected-icon-small
)}:host([size=l]){--spectrum-menu-item-min-height:var(--spectrum-component-height-200);--spectrum-menu-item-icon-height:var(--spectrum-workflow-icon-size-200);--spectrum-menu-item-icon-width:var(--spectrum-workflow-icon-size-200);--spectrum-menu-item-label-font-size:var(--spectrum-font-size-200);--spectrum-menu-item-label-text-to-visual:var(
--spectrum-text-to-visual-200
);--spectrum-menu-item-label-inline-edge-to-content:var(
--spectrum-component-edge-to-text-200
);--spectrum-menu-item-top-edge-to-text:var(
--spectrum-component-top-to-text-200
);--spectrum-menu-item-bottom-edge-to-text:var(
--spectrum-component-bottom-to-text-200
);--spectrum-menu-item-text-to-control:var(--spectrum-text-to-control-200);--spectrum-menu-item-description-font-size:var(--spectrum-font-size-100);--spectrum-menu-section-header-font-size:var(--spectrum-font-size-200);--spectrum-menu-section-header-min-width:var(
--spectrum-component-height-200
);--spectrum-menu-item-selectable-edge-to-text-not-selected:var(
--spectrum-menu-item-selectable-edge-to-text-not-selected-large
);--spectrum-menu-item-checkmark-height:var(
--spectrum-menu-item-checkmark-height-large
);--spectrum-menu-item-checkmark-width:var(
--spectrum-menu-item-checkmark-width-large
);--spectrum-menu-item-top-to-checkmark:var(
--spectrum-menu-item-top-to-selected-icon-large
)}:host([size=xl]){--spectrum-menu-item-min-height:var(--spectrum-component-height-300);--spectrum-menu-item-icon-height:var(--spectrum-workflow-icon-size-300);--spectrum-menu-item-icon-width:var(--spectrum-workflow-icon-size-300);--spectrum-menu-item-label-font-size:var(--spectrum-font-size-300);--spectrum-menu-item-label-text-to-visual:var(
--spectrum-text-to-visual-300
);--spectrum-menu-item-label-inline-edge-to-content:var(
--spectrum-component-edge-to-text-300
);--spectrum-menu-item-top-edge-to-text:var(
--spectrum-component-top-to-text-300
);--spectrum-menu-item-bottom-edge-to-text:var(
--spectrum-component-bottom-to-text-300
);--spectrum-menu-item-text-to-control:var(--spectrum-text-to-control-300);--spectrum-menu-item-description-font-size:var(--spectrum-font-size-200);--spectrum-menu-section-header-font-size:var(--spectrum-font-size-300);--spectrum-menu-section-header-min-width:var(
--spectrum-component-height-300
);--spectrum-menu-item-selectable-edge-to-text-not-selected:var(
--spectrum-menu-item-selectable-edge-to-text-not-selected-extra-large
);--spectrum-menu-item-checkmark-height:var(
--spectrum-menu-item-checkmark-height-extra-large
);--spectrum-menu-item-checkmark-width:var(
--spectrum-menu-item-checkmark-width-extra-large
);--spectrum-menu-item-top-to-checkmark:var(
--spectrum-menu-item-top-to-selected-icon-extra-large
)}@media (forced-colors:active){:host{--highcontrast-menu-item-background-color-default:ButtonFace;--highcontrast-menu-item-color-default:ButtonText;--highcontrast-menu-item-background-color-focus:Highlight;--highcontrast-menu-item-color-focus:HighlightText;--highcontrast-menu-checkmark-icon-color-default:Highlight;--highcontrast-menu-item-color-disabled:GrayText;--highcontrast-menu-item-focus-indicator-color:Highlight;--highcontrast-menu-item-selected-background-color:Highlight;--highcontrast-menu-item-selected-color:HighlightText}@supports (color:SelectedItem){:host{--highcontrast-menu-item-selected-background-color:SelectedItem;--highcontrast-menu-item-selected-color:SelectedItemText}}}:host{box-sizing:border-box;display:inline-block;list-style-type:none;margin:0;overflow:auto;padding:0}:host:lang(ja),:host:lang(ko),:host:lang(zh){--spectrum-menu-item-label-line-height:var(
--mod-menu-item-label-line-height-cjk,var(--spectrum-menu-item-label-line-height-cjk)
);--spectrum-menu-item-description-line-height:var(
--mod-menu-item-description-line-height-cjk,var(--spectrum-menu-item-description-line-height-cjk)
);--spectrum-menu-section-header-line-height:var(
--mod-menu-section-header-line-height-cjk,var(--spectrum-menu-section-header-line-height-cjk)
)}:host([selects]) ::slotted(sp-menu-item){--spectrum-menu-checkmark-display:var(
--spectrum-menu-checkmark-display-hidden
);padding-inline-start:var(
--mod-menu-item-selectable-edge-to-text-not-selected,var(--spectrum-menu-item-selectable-edge-to-text-not-selected)
)}:host([selects]) ::slotted(sp-menu-item[selected]){--spectrum-menu-checkmark-display:var(
--spectrum-menu-checkmark-display-shown
);padding-inline-start:var(
--mod-menu-item-label-inline-edge-to-content,var(--spectrum-menu-item-label-inline-edge-to-content)
)}li:not(::slotted(sp-menu-item),.menu-divider){box-sizing:border-box;display:block;margin:0;padding:0;position:relative}.spectrum-Menu-sectionHeading{color:var(
--highcontrast-menu-item-color-default,var(
--mod-menu-section-header-color,var(--spectrum-menu-section-header-color)
)
);display:block;font-size:var(
--mod-menu-section-header-font-size,var(--spectrum-menu-section-header-font-size)
);font-weight:var(
--mod-menu-section-header-font-weight,var(--spectrum-menu-section-header-font-weight)
);grid-area:sectionHeadingArea/1/sectionHeadingArea/-1;line-height:var(
--mod-menu-section-header-line-height,var(--spectrum-menu-section-header-line-height)
);min-inline-size:var(
--mod-menu-section-header-min-width,var(--spectrum-menu-section-header-min-width)
);padding-block-end:var(
--mod-menu-section-header-bottom-edge-to-text,var(
--mod-menu-item-bottom-edge-to-text,var(--spectrum-menu-item-bottom-edge-to-text)
)
);padding-block-start:var(
--mod-menu-section-header-top-edge-to-text,var(
--mod-menu-item-top-edge-to-text,var(--spectrum-menu-item-top-edge-to-text)
)
);padding-inline:var(
--mod-menu-item-label-inline-edge-to-content,var(--spectrum-menu-item-label-inline-edge-to-content)
)}:host{display:inline-flex;flex-direction:column;width:var(--swc-menu-width)}:host(:focus){outline:none}::slotted(*){flex-shrink:0}
`,ha=Ki;var Wi=Object.defineProperty,Gi=Object.getOwnPropertyDescriptor,qt=(s,t,e,r)=>{for(var o=r>1?void 0:r?Gi(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Wi(t,e,o),o};function ga(s,t){return!!t&&(s===t||s.contains(t))}var et=class extends H(I,{noDefaultSize:!0}){constructor(){super(),this.label="",this.ignore=!1,this.value="",this.valueSeparator=",",this._selected=[],this.selectedItems=[],this.childItemSet=new Set,this.focusedItemIndex=0,this.focusInItemIndex=0,this.selectedItemsMap=new Map,this.descendentOverlays=new Map,this.handleSubmenuClosed=t=>{t.stopPropagation(),t.composedPath()[0].dispatchEvent(new Event("sp-menu-submenu-closed",{bubbles:!0,composed:!0}))},this.handleSubmenuOpened=t=>{t.stopPropagation(),t.composedPath()[0].dispatchEvent(new Event("sp-menu-submenu-opened",{bubbles:!0,composed:!0}));let e=this.childItems[this.focusedItemIndex];e&&(e.focused=!1);let r=t.composedPath().find(a=>this.childItemSet.has(a));if(!r)return;let o=this.childItems.indexOf(r);this.focusedItemIndex=o,this.focusInItemIndex=o},this._hasUpdatedSelectedItemIndex=!1,this._willUpdateItems=!1,this.cacheUpdated=Promise.resolve(),this.resolveCacheUpdated=()=>{},this.addEventListener("sp-menu-item-added-or-updated",this.onSelectableItemAddedOrUpdated),this.addEventListener("sp-menu-item-added-or-updated",this.onFocusableItemAddedOrUpdated,{capture:!0}),this.addEventListener("click",this.handleClick),this.addEventListener("focusin",this.handleFocusin),this.addEventListener("focusout",this.handleFocusout),this.addEventListener("sp-opened",this.handleSubmenuOpened),this.addEventListener("sp-closed",this.handleSubmenuClosed)}static get styles(){return[ha]}get isSubmenu(){return this.slot==="submenu"}get selected(){return this._selected}set selected(t){if(t===this.selected)return;let e=this.selected;this._selected=t,this.selectedItems=[],this.selectedItemsMap.clear(),this.childItems.forEach(r=>{r.selected=this.selected.includes(r.value),r.selected&&(this.selectedItems.push(r),this.selectedItemsMap.set(r,!0))}),this.requestUpdate("selected",e)}get childItems(){return this.cachedChildItems||(this.cachedChildItems=this.updateCachedMenuItems()),this.cachedChildItems}updateCachedMenuItems(){if(this.cachedChildItems=[],!this.menuSlot)return[];let t=this.menuSlot.assignedElements({flatten:!0});for(let[e,r]of t.entries()){if(this.childItemSet.has(r)){this.cachedChildItems.push(r);continue}let o=r.localName==="slot"?r.assignedElements({flatten:!0}):[...r.querySelectorAll(":scope > *")];t.splice(e,1,r,...o)}return this.cachedChildItems}get childRole(){if(this.resolvedRole==="listbox")return"option";switch(this.resolvedSelects){case"single":return"menuitemradio";case"multiple":return"menuitemcheckbox";default:return"menuitem"}}get ownRole(){return"menu"}onFocusableItemAddedOrUpdated(t){t.menuCascade.set(this,{hadFocusRoot:!!t.item.menuData.focusRoot,ancestorWithSelects:t.currentAncestorWithSelects}),this.selects&&(t.currentAncestorWithSelects=this),t.item.menuData.focusRoot=t.item.menuData.focusRoot||this}onSelectableItemAddedOrUpdated(t){var e,r;let o=t.menuCascade.get(this);if(!o)return;if(t.item.menuData.parentMenu=t.item.menuData.parentMenu||this,o.hadFocusRoot&&!this.ignore&&(this.tabIndex=-1),this.addChildItem(t.item),this.selects==="inherit"){this.resolvedSelects="inherit";let c=(e=t.currentAncestorWithSelects)==null?void 0:e.ignore;this.resolvedRole=c?"none":((r=t.currentAncestorWithSelects)==null?void 0:r.getAttribute("role"))||this.getAttribute("role")||void 0}else this.selects?(this.resolvedRole=this.ignore?"none":this.getAttribute("role")||void 0,this.resolvedSelects=this.selects):(this.resolvedRole=this.ignore?"none":this.getAttribute("role")||void 0,this.resolvedSelects=this.resolvedRole==="none"?"ignore":"none");let a=this.resolvedSelects==="single"||this.resolvedSelects==="multiple";t.item.menuData.cleanupSteps.push(c=>this.removeChildItem(c)),(a||!this.selects&&this.resolvedSelects!=="ignore")&&!t.item.menuData.selectionRoot&&(t.item.setRole(this.childRole),t.item.menuData.selectionRoot=t.item.menuData.selectionRoot||this,t.item.selected&&(this.selectedItemsMap.set(t.item,!0),this.selectedItems=[...this.selectedItems,t.item],this._selected=[...this.selected,t.item.value],this.value=this.selected.join(this.valueSeparator)))}addChildItem(t){this.childItemSet.add(t),this.handleItemsChanged()}async removeChildItem(t){this.childItemSet.delete(t),this.cachedChildItems=void 0,t.focused&&(this.handleItemsChanged(),await this.updateComplete,this.focus())}focus({preventScroll:t}={}){if(!this.childItems.length||this.childItems.every(r=>r.disabled))return;if(this.childItems.some(r=>r.menuData.focusRoot!==this)){super.focus({preventScroll:t});return}this.focusMenuItemByOffset(0),super.focus({preventScroll:t});let e=this.selectedItems[0];e&&!t&&e.scrollIntoView({block:"nearest"})}handleClick(t){let e=t.composedPath().find(r=>r instanceof Element?r.getAttribute("role")===this.childRole:!1);if(t.defaultPrevented){let r=this.childItems.indexOf(e);e?.menuData.focusRoot===this&&r>-1&&(this.focusedItemIndex=r);return}if(e!=null&&e.href&&e.href.length){this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}));return}else if(e?.menuData.selectionRoot===this&&this.childItems.length){if(t.preventDefault(),e.hasSubmenu||e.open)return;this.selectOrToggleItem(e)}else return;this.prepareToCleanUp()}handleFocusin(t){var e;let r=ga(this,t.relatedTarget);if(this.childItems.some(c=>c.menuData.focusRoot!==this))return;let o=this.getRootNode().activeElement,a=((e=this.childItems[this.focusedItemIndex])==null?void 0:e.menuData.selectionRoot)||this;if((o!==a||!r&&t.target!==this)&&(a.focus({preventScroll:!0}),o&&this.focusedItemIndex===0)){let c=this.childItems.findIndex(l=>l===o);this.focusMenuItemByOffset(Math.max(c,0))}this.startListeningToKeyboard()}startListeningToKeyboard(){this.addEventListener("keydown",this.handleKeydown)}handleFocusout(t){ga(this,t.relatedTarget)||(this.stopListeningToKeyboard(),this.childItems.forEach(e=>e.focused=!1),this.removeAttribute("aria-activedescendant"))}stopListeningToKeyboard(){this.removeEventListener("keydown",this.handleKeydown)}handleDescendentOverlayOpened(t){let e=t.composedPath()[0];e.overlayElement&&this.descendentOverlays.set(e.overlayElement,e.overlayElement)}handleDescendentOverlayClosed(t){let e=t.composedPath()[0];e.overlayElement&&this.descendentOverlays.delete(e.overlayElement)}async selectOrToggleItem(t){let e=this.resolvedSelects,r=new Map(this.selectedItemsMap),o=this.selected.slice(),a=this.selectedItems.slice(),c=this.value,l=this.childItems[this.focusedItemIndex];if(l&&(l.focused=!1,l.active=!1),this.focusedItemIndex=this.childItems.indexOf(t),this.forwardFocusVisibleToItem(t),e==="multiple"){this.selectedItemsMap.has(t)?this.selectedItemsMap.delete(t):this.selectedItemsMap.set(t,!0);let u=[],m=[];this.childItemSet.forEach(d=>{d.menuData.selectionRoot===this&&this.selectedItemsMap.has(d)&&(u.push(d.value),m.push(d))}),this._selected=u,this.selectedItems=m,this.value=this.selected.join(this.valueSeparator)}else this.selectedItemsMap.clear(),this.selectedItemsMap.set(t,!0),this.value=t.value,this._selected=[t.value],this.selectedItems=[t];if(!this.dispatchEvent(new Event("change",{cancelable:!0,bubbles:!0,composed:!0}))){this._selected=o,this.selectedItems=a,this.selectedItemsMap=r,this.value=c;return}if(e==="single"){for(let u of r.keys())u!==t&&(u.selected=!1);t.selected=!0}else e==="multiple"&&(t.selected=!t.selected)}navigateWithinMenu(t){let{code:e}=t,r=this.childItems[this.focusedItemIndex],o=e==="ArrowDown"?1:-1,a=this.focusMenuItemByOffset(o);a!==r&&(t.preventDefault(),t.stopPropagation(),a.scrollIntoView({block:"nearest"}))}navigateBetweenRelatedMenus(t){let{code:e}=t,r=this.isLTR&&e==="ArrowRight"||!this.isLTR&&e==="ArrowLeft",o=this.isLTR&&e==="ArrowLeft"||!this.isLTR&&e==="ArrowRight";if(r){t.stopPropagation();let a=this.childItems[this.focusedItemIndex];a!=null&&a.hasSubmenu&&a.openOverlay()}else o&&this.isSubmenu&&(t.stopPropagation(),this.dispatchEvent(new Event("close",{bubbles:!0})),this.updateSelectedItemIndex())}handleKeydown(t){var e;if(t.target!==this&&this!==t.target.parentElement||t.defaultPrevented)return;let r=this.childItems[this.focusedItemIndex];r&&(r.focused=!0);let{code:o}=t;if(t.shiftKey&&t.target!==this&&this.hasAttribute("tabindex")){this.removeAttribute("tabindex");let a=c=>{!c.shiftKey&&!this.hasAttribute("tabindex")&&(this.tabIndex=0,document.removeEventListener("keyup",a),this.removeEventListener("focusout",a))};document.addEventListener("keyup",a),this.addEventListener("focusout",a)}if(o==="Tab"){this.prepareToCleanUp();return}if(o==="Space"&&r!=null&&r.hasSubmenu){r.openOverlay();return}if(o==="Space"||o==="Enter"){(e=this.childItems[this.focusedItemIndex])==null||e.click();return}if(o==="ArrowDown"||o==="ArrowUp"){this.navigateWithinMenu(t);return}this.navigateBetweenRelatedMenus(t)}focusMenuItemByOffset(t){let e=t||1,r=this.childItems[this.focusedItemIndex];r&&(r.focused=!1,r.active=r.open),this.focusedItemIndex=(this.childItems.length+this.focusedItemIndex+t)%this.childItems.length;let o=this.childItems[this.focusedItemIndex],a=this.childItems.length;for(;o!=null&&o.disabled&&a;)a-=1,this.focusedItemIndex=(this.childItems.length+this.focusedItemIndex+e)%this.childItems.length,o=this.childItems[this.focusedItemIndex];return o!=null&&o.disabled||this.forwardFocusVisibleToItem(o),o}prepareToCleanUp(){document.addEventListener("focusout",()=>{requestAnimationFrame(()=>{let t=this.childItems[this.focusedItemIndex];t&&(t.focused=!1,this.updateSelectedItemIndex())})},{once:!0})}updateSelectedItemIndex(){let t=0,e=new Map,r=[],o=[],a=this.childItems.length;for(;a;){a-=1;let c=this.childItems[a];c.menuData.selectionRoot===this&&((c.selected||!this._hasUpdatedSelectedItemIndex&&this.selected.includes(c.value))&&(t=a,e.set(c,!0),r.unshift(c.value),o.unshift(c)),a!==t&&(c.focused=!1))}o.map((c,l)=>{l>0&&(c.focused=!1)}),this.selectedItemsMap=e,this._selected=r,this.selectedItems=o,this.value=this.selected.join(this.valueSeparator),this.focusedItemIndex=t,this.focusInItemIndex=t}handleItemsChanged(){this.cachedChildItems=void 0,this._willUpdateItems||(this._willUpdateItems=!0,this.cacheUpdated=this.updateCache())}async updateCache(){this.hasUpdated?await new Promise(t=>requestAnimationFrame(()=>t(!0))):await Promise.all([new Promise(t=>requestAnimationFrame(()=>t(!0))),this.updateComplete]),this.cachedChildItems===void 0&&(this.updateSelectedItemIndex(),this.updateItemFocus()),this._willUpdateItems=!1}updateItemFocus(){if(this.childItems.length==0)return;let t=this.childItems[this.focusInItemIndex];this.getRootNode().activeElement===t.menuData.focusRoot&&this.forwardFocusVisibleToItem(t)}closeDescendentOverlays(){this.descendentOverlays.forEach(t=>{t.open=!1}),this.descendentOverlays=new Map}forwardFocusVisibleToItem(t){if(!t||t.menuData.focusRoot!==this)return;this.closeDescendentOverlays();let e=this.hasVisibleFocusInTree()||!!this.childItems.find(r=>r.hasVisibleFocusInTree());t.focused=e,this.setAttribute("aria-activedescendant",t.id),t.menuData.selectionRoot&&t.menuData.selectionRoot!==this&&t.menuData.selectionRoot.focus()}handleSlotchange({target:t}){let e=t.assignedElements({flatten:!0});this.childItems.length!==e.length&&e.forEach(r=>{typeof r.triggerUpdate<"u"&&r.triggerUpdate()})}renderMenuItemSlot(){return i.html`
            <slot
                @sp-menu-submenu-opened=${this.handleDescendentOverlayOpened}
                @sp-menu-submenu-closed=${this.handleDescendentOverlayClosed}
                @slotchange=${this.handleSlotchange}
            ></slot>
        `}render(){return this.renderMenuItemSlot()}firstUpdated(t){super.firstUpdated(t),!this.hasAttribute("tabindex")&&!this.ignore&&(this.getAttribute("role")==="group"?this.tabIndex=-1:this.tabIndex=0);let e=[new Promise(r=>requestAnimationFrame(()=>r(!0)))];[...this.children].forEach(r=>{r.localName==="sp-menu-item"&&e.push(r.updateComplete)}),this.childItemsUpdated=Promise.all(e)}updated(t){super.updated(t),t.has("selects")&&this.hasUpdated&&this.selectsChanged(),t.has("label")&&(this.label||typeof t.get("label")<"u")&&(this.label?this.setAttribute("aria-label",this.label):this.removeAttribute("aria-label"))}selectsChanged(){let t=[new Promise(e=>requestAnimationFrame(()=>e(!0)))];this.childItemSet.forEach(e=>{t.push(e.triggerUpdate())}),this.childItemsUpdated=Promise.all(t)}connectedCallback(){super.connectedCallback(),!this.hasAttribute("role")&&!this.ignore&&this.setAttribute("role",this.ownRole),this.updateComplete.then(()=>this.updateItemFocus())}disconnectedCallback(){this.cachedChildItems=void 0,super.disconnectedCallback()}async getUpdateComplete(){let t=await super.getUpdateComplete();return await this.childItemsUpdated,await this.cacheUpdated,t}};qt([(0,n.property)({type:String,reflect:!0})],et.prototype,"label",2),qt([(0,n.property)({type:Boolean,reflect:!0})],et.prototype,"ignore",2),qt([(0,n.property)({type:String,reflect:!0})],et.prototype,"selects",2),qt([(0,n.property)({type:String})],et.prototype,"value",2),qt([(0,n.property)({type:String,attribute:"value-separator"})],et.prototype,"valueSeparator",2),qt([(0,n.property)({attribute:!1})],et.prototype,"selected",1),qt([(0,n.property)({attribute:!1})],et.prototype,"selectedItems",2),qt([(0,n.query)("slot:not([name])")],et.prototype,"menuSlot",2);P();b("sp-menu",et);P();h();S();h();var Xi=i.css`
:host([disabled]) ::slotted([slot=trigger]){pointer-events:none}slot[name=longpress-describedby-descriptor]{display:none}
`,ba=Xi;var Yi=Object.defineProperty,Zi=Object.getOwnPropertyDescriptor,Z=(s,t,e,r)=>{for(var o=r>1?void 0:r?Zi(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Yi(t,e,o),o},R=class extends I{constructor(){super(...arguments),this.content="click hover longpress",this.offset=6,this.disabled=!1,this.clickContent=[],this.longpressContent=[],this.hoverContent=[],this.targetContent=[]}static get styles(){return[ba]}getAssignedElementsFromSlot(t){return t.assignedElements({flatten:!0})}handleTriggerContent(t){this.targetContent=this.getAssignedElementsFromSlot(t.target)}handleSlotContent(t){switch(t.target.name){case"click-content":this.clickContent=this.getAssignedElementsFromSlot(t.target);break;case"longpress-content":this.longpressContent=this.getAssignedElementsFromSlot(t.target);break;case"hover-content":this.hoverContent=this.getAssignedElementsFromSlot(t.target);break}}handleBeforetoggle(t){let{target:e}=t,r;if(e===this.clickOverlayElement)r="click";else if(e===this.longpressOverlayElement)r="longpress";else if(e===this.hoverOverlayElement)r="hover";else return;t.newState==="open"?this.open=r:this.open===r&&(this.open=void 0)}update(t){var e,r,o,a,c,l;t.has("clickContent")&&(this.clickPlacement=((e=this.clickContent[0])==null?void 0:e.getAttribute("placement"))||((r=this.clickContent[0])==null?void 0:r.getAttribute("direction"))||void 0),t.has("hoverContent")&&(this.hoverPlacement=((o=this.hoverContent[0])==null?void 0:o.getAttribute("placement"))||((a=this.hoverContent[0])==null?void 0:a.getAttribute("direction"))||void 0),t.has("longpressContent")&&(this.longpressPlacement=((c=this.longpressContent[0])==null?void 0:c.getAttribute("placement"))||((l=this.longpressContent[0])==null?void 0:l.getAttribute("direction"))||void 0),super.update(t)}renderSlot(t){return i.html`
            <slot name=${t} @slotchange=${this.handleSlotContent}></slot>
        `}renderClickOverlay(){Promise.resolve().then(()=>Nt());let t=this.renderSlot("click-content");return this.clickContent.length?i.html`
            <sp-overlay
                id="click-overlay"
                ?disabled=${this.disabled||!this.clickContent.length}
                ?open=${this.open==="click"&&!!this.clickContent.length}
                .offset=${this.offset}
                .placement=${this.clickPlacement||this.placement}
                .triggerElement=${this.targetContent[0]}
                .triggerInteraction=${"click"}
                .type=${this.type!=="modal"?"auto":"modal"}
                @beforetoggle=${this.handleBeforetoggle}
            >
                ${t}
            </sp-overlay>
        `:t}renderHoverOverlay(){Promise.resolve().then(()=>Nt());let t=this.renderSlot("hover-content");return this.hoverContent.length?i.html`
            <sp-overlay
                id="hover-overlay"
                ?disabled=${this.disabled||!this.hoverContent.length||!!this.open&&this.open!=="hover"}
                ?open=${this.open==="hover"&&!!this.hoverContent.length}
                .offset=${this.offset}
                .placement=${this.hoverPlacement||this.placement}
                .triggerElement=${this.targetContent[0]}
                .triggerInteraction=${"hover"}
                .type=${"hint"}
                @beforetoggle=${this.handleBeforetoggle}
            >
                ${t}
            </sp-overlay>
        `:t}renderLongpressOverlay(){Promise.resolve().then(()=>Nt());let t=this.renderSlot("longpress-content");return this.longpressContent.length?i.html`
            <sp-overlay
                id="longpress-overlay"
                ?disabled=${this.disabled||!this.longpressContent.length}
                ?open=${this.open==="longpress"&&!!this.longpressContent.length}
                .offset=${this.offset}
                .placement=${this.longpressPlacement||this.placement}
                .triggerElement=${this.targetContent[0]}
                .triggerInteraction=${"longpress"}
                .type=${"auto"}
                @beforetoggle=${this.handleBeforetoggle}
            >
                ${t}
            </sp-overlay>
            <slot name="longpress-describedby-descriptor"></slot>
        `:t}render(){let t=this.content.split(" ");return i.html`
            <slot
                id="trigger"
                name="trigger"
                @slotchange=${this.handleTriggerContent}
            ></slot>
            ${[t.includes("click")?this.renderClickOverlay():i.html``,t.includes("hover")?this.renderHoverOverlay():i.html``,t.includes("longpress")?this.renderLongpressOverlay():i.html``]}
        `}updated(t){if(super.updated(t),this.disabled&&t.has("disabled")){this.open=void 0;return}}async getUpdateComplete(){return await super.getUpdateComplete()}};Z([(0,n.property)()],R.prototype,"content",2),Z([(0,n.property)({reflect:!0})],R.prototype,"placement",2),Z([(0,n.property)()],R.prototype,"type",2),Z([(0,n.property)({type:Number})],R.prototype,"offset",2),Z([(0,n.property)({reflect:!0})],R.prototype,"open",2),Z([(0,n.property)({type:Boolean,reflect:!0})],R.prototype,"disabled",2),Z([(0,n.state)()],R.prototype,"clickContent",2),Z([(0,n.state)()],R.prototype,"longpressContent",2),Z([(0,n.state)()],R.prototype,"hoverContent",2),Z([(0,n.state)()],R.prototype,"targetContent",2),Z([(0,n.query)("#click-overlay",!0)],R.prototype,"clickOverlayElement",2),Z([(0,n.query)("#longpress-overlay",!0)],R.prototype,"longpressOverlayElement",2),Z([(0,n.query)("#hover-overlay",!0)],R.prototype,"hoverOverlayElement",2);b("overlay-trigger",R);go();h();S();Qr();tt();h();var Qi=i.css`
.fill-submask-2{animation:spectrum-fill-mask-2 1s linear infinite}@keyframes spectrum-fill-mask-1{0%{transform:rotate(90deg)}1.69%{transform:rotate(72.3deg)}3.39%{transform:rotate(55.5deg)}5.08%{transform:rotate(40.3deg)}6.78%{transform:rotate(25deg)}8.47%{transform:rotate(10.6deg)}10.17%{transform:rotate(0)}11.86%{transform:rotate(0)}13.56%{transform:rotate(0)}15.25%{transform:rotate(0)}16.95%{transform:rotate(0)}18.64%{transform:rotate(0)}20.34%{transform:rotate(0)}22.03%{transform:rotate(0)}23.73%{transform:rotate(0)}25.42%{transform:rotate(0)}27.12%{transform:rotate(0)}28.81%{transform:rotate(0)}30.51%{transform:rotate(0)}32.2%{transform:rotate(0)}33.9%{transform:rotate(0)}35.59%{transform:rotate(0)}37.29%{transform:rotate(0)}38.98%{transform:rotate(0)}40.68%{transform:rotate(0)}42.37%{transform:rotate(5.3deg)}44.07%{transform:rotate(13.4deg)}45.76%{transform:rotate(20.6deg)}47.46%{transform:rotate(29deg)}49.15%{transform:rotate(36.5deg)}50.85%{transform:rotate(42.6deg)}52.54%{transform:rotate(48.8deg)}54.24%{transform:rotate(54.2deg)}55.93%{transform:rotate(59.4deg)}57.63%{transform:rotate(63.2deg)}59.32%{transform:rotate(67.2deg)}61.02%{transform:rotate(70.8deg)}62.71%{transform:rotate(73.8deg)}64.41%{transform:rotate(76.2deg)}66.1%{transform:rotate(78.7deg)}67.8%{transform:rotate(80.6deg)}69.49%{transform:rotate(82.6deg)}71.19%{transform:rotate(83.7deg)}72.88%{transform:rotate(85deg)}74.58%{transform:rotate(86.3deg)}76.27%{transform:rotate(87deg)}77.97%{transform:rotate(87.7deg)}79.66%{transform:rotate(88.3deg)}81.36%{transform:rotate(88.6deg)}83.05%{transform:rotate(89.2deg)}84.75%{transform:rotate(89.2deg)}86.44%{transform:rotate(89.5deg)}88.14%{transform:rotate(89.9deg)}89.83%{transform:rotate(89.7deg)}91.53%{transform:rotate(90.1deg)}93.22%{transform:rotate(90.2deg)}94.92%{transform:rotate(90.1deg)}96.61%{transform:rotate(90deg)}98.31%{transform:rotate(89.8deg)}to{transform:rotate(90deg)}}@keyframes spectrum-fill-mask-2{0%{transform:rotate(180deg)}1.69%{transform:rotate(180deg)}3.39%{transform:rotate(180deg)}5.08%{transform:rotate(180deg)}6.78%{transform:rotate(180deg)}8.47%{transform:rotate(180deg)}10.17%{transform:rotate(179.2deg)}11.86%{transform:rotate(164deg)}13.56%{transform:rotate(151.8deg)}15.25%{transform:rotate(140.8deg)}16.95%{transform:rotate(130.3deg)}18.64%{transform:rotate(120.4deg)}20.34%{transform:rotate(110.8deg)}22.03%{transform:rotate(101.6deg)}23.73%{transform:rotate(93.5deg)}25.42%{transform:rotate(85.4deg)}27.12%{transform:rotate(78.1deg)}28.81%{transform:rotate(71.2deg)}30.51%{transform:rotate(89.1deg)}32.2%{transform:rotate(105.5deg)}33.9%{transform:rotate(121.3deg)}35.59%{transform:rotate(135.5deg)}37.29%{transform:rotate(148.4deg)}38.98%{transform:rotate(161deg)}40.68%{transform:rotate(173.5deg)}42.37%{transform:rotate(180deg)}44.07%{transform:rotate(180deg)}45.76%{transform:rotate(180deg)}47.46%{transform:rotate(180deg)}49.15%{transform:rotate(180deg)}50.85%{transform:rotate(180deg)}52.54%{transform:rotate(180deg)}54.24%{transform:rotate(180deg)}55.93%{transform:rotate(180deg)}57.63%{transform:rotate(180deg)}59.32%{transform:rotate(180deg)}61.02%{transform:rotate(180deg)}62.71%{transform:rotate(180deg)}64.41%{transform:rotate(180deg)}66.1%{transform:rotate(180deg)}67.8%{transform:rotate(180deg)}69.49%{transform:rotate(180deg)}71.19%{transform:rotate(180deg)}72.88%{transform:rotate(180deg)}74.58%{transform:rotate(180deg)}76.27%{transform:rotate(180deg)}77.97%{transform:rotate(180deg)}79.66%{transform:rotate(180deg)}81.36%{transform:rotate(180deg)}83.05%{transform:rotate(180deg)}84.75%{transform:rotate(180deg)}86.44%{transform:rotate(180deg)}88.14%{transform:rotate(180deg)}89.83%{transform:rotate(180deg)}91.53%{transform:rotate(180deg)}93.22%{transform:rotate(180deg)}94.92%{transform:rotate(180deg)}96.61%{transform:rotate(180deg)}98.31%{transform:rotate(180deg)}to{transform:rotate(180deg)}}@keyframes spectrum-fills-rotate{0%{transform:rotate(-90deg)}to{transform:rotate(270deg)}}:host{--spectrum-progress-circle-track-border-color:var(--spectrum-gray-300);--spectrum-progress-circle-fill-border-color:var(
--spectrum-accent-content-color-default
);--spectrum-progress-circle-track-border-color-over-background:var(
--spectrum-transparent-white-300
);--spectrum-progress-circle-fill-border-color-over-background:var(
--spectrum-transparent-white-900
);--spectrum-progress-circle-size:var(
--spectrum-progress-circle-size-medium
);--spectrum-progress-circle-thickness:var(
--spectrum-progress-circle-thickness-medium
);--spectrum-progress-circle-track-border-style:solid}:host([size=s]){--spectrum-progress-circle-size:var(--spectrum-progress-circle-size-small);--spectrum-progress-circle-thickness:var(
--spectrum-progress-circle-thickness-small
)}.spectrum-ProgressCircle--medium{--spectrum-progress-circle-size:var(
--spectrum-progress-circle-size-medium
);--spectrum-progress-circle-thickness:var(
--spectrum-progress-circle-thickness-medium
)}:host([size=l]){--spectrum-progress-circle-size:var(--spectrum-progress-circle-size-large);--spectrum-progress-circle-thickness:var(
--spectrum-progress-circle-thickness-large
)}@media (forced-colors:active){:host{--highcontrast-progress-circle-fill-border-color:Highlight;--highcontrast-progress-circle-fill-border-color-over-background:Highlight}.track{--spectrum-progress-circle-track-border-style:double}}:host{block-size:var(
--mod-progress-circle-size,var(--spectrum-progress-circle-size)
);direction:ltr;display:inline-block;inline-size:var(
--mod-progress-circle-size,var(--spectrum-progress-circle-size)
);position:relative;transform:translateZ(0)}.track{block-size:var(
--mod-progress-circle-size,var(--spectrum-progress-circle-size)
);border-color:var(
--mod-progress-circle-track-border-color,var(--spectrum-progress-circle-track-border-color)
);border-radius:var(
--mod-progress-circle-size,var(--spectrum-progress-circle-size)
);border-style:var(
--highcontrast-progress-circle-track-border-style,var(
--mod-progress-circle-track-border-style,var(--spectrum-progress-circle-track-border-style)
)
);border-width:var(
--mod-progress-circle-thickness,var(--spectrum-progress-circle-thickness)
);box-sizing:border-box;inline-size:var(
--mod-progress-circle-size,var(--spectrum-progress-circle-size)
)}.fills{block-size:100%;inline-size:100%;inset-block-start:0;inset-inline-start:0;position:absolute}.fill{block-size:var(
--mod-progress-circle-size,var(--spectrum-progress-circle-size)
);border-color:var(
--highcontrast-progress-circle-fill-border-color,var(
--mod-progress-circle-fill-border-color,var(--spectrum-progress-circle-fill-border-color)
)
);border-radius:var(
--mod-progress-circle-size,var(--spectrum-progress-circle-size)
);border-style:solid;border-width:var(
--mod-progress-circle-thickness,var(--spectrum-progress-circle-thickness)
);box-sizing:border-box;inline-size:var(
--mod-progress-circle-size,var(--spectrum-progress-circle-size)
)}:host([static=white]) .track{border-color:var(
--mod-progress-circle-track-border-color-over-background,var(--spectrum-progress-circle-track-border-color-over-background)
)}:host([static=white]) .fill{border-color:var(
--highcontrast-progress-circle-fill-border-color-over-background,var(
--mod-progress-circle-fill-border-color-over-background,var(--spectrum-progress-circle-fill-border-color-over-background)
)
)}.fillMask1,.fillMask2{block-size:100%;inline-size:50%;overflow:hidden;position:absolute;transform:rotate(180deg);transform-origin:100%}.fillSubMask1,.fillSubMask2{block-size:100%;inline-size:100%;overflow:hidden;transform:rotate(-180deg);transform-origin:100%}.fillMask2{transform:rotate(0)}:host([indeterminate]) .fills{animation:spectrum-fills-rotate 1s cubic-bezier(.25,.78,.48,.89) infinite;transform:translateZ(0);transform-origin:center;will-change:transform}:host([indeterminate]) .fillSubMask1{animation:spectrum-fill-mask-1 1s linear infinite;transform:translateZ(0);will-change:transform}:host([indeterminate]) .fillSubMask2{animation:spectrum-fill-mask-2 1s linear infinite;transform:translateZ(0);will-change:transform}:host{--spectrum-progresscircle-m-over-background-track-fill-color:var(
--spectrum-alias-track-fill-color-overbackground
)}slot{display:none}
`,va=Qi;var Ji=Object.defineProperty,tn=Object.getOwnPropertyDescriptor,ye=(s,t,e,r)=>{for(var o=r>1?void 0:r?tn(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Ji(t,e,o),o},vt=class extends H(I,{validSizes:["s","m","l"]}){constructor(){super(...arguments),this.indeterminate=!1,this.label="",this.overBackground=!1,this.progress=0}static get styles(){return[va]}makeRotation(t){return this.indeterminate?void 0:`transform: rotate(${t}deg);`}willUpdate(t){t.has("overBackground")&&(this.static=this.overBackground?"white":this.static||void 0)}render(){let t=[this.makeRotation(-180+3.6*Math.min(this.progress,50)),this.makeRotation(-180+3.6*Math.max(this.progress-50,0))],e=["Mask1","Mask2"];return i.html`
            <slot @slotchange=${this.handleSlotchange}></slot>
            <div class="track"></div>
            <div class="fills">
                ${e.map((r,o)=>i.html`
                        <div class="fill${r}">
                            <div
                                class="fillSub${r}"
                                style=${z(t[o])}
                            >
                                <div class="fill"></div>
                            </div>
                        </div>
                    `)}
            </div>
        `}handleSlotchange(){let t=hs(this.label,this.slotEl);t&&(this.label=t)}firstUpdated(t){super.firstUpdated(t),this.hasAttribute("role")||this.setAttribute("role","progressbar")}updated(t){super.updated(t),!this.indeterminate&&t.has("progress")?this.setAttribute("aria-valuenow",""+this.progress):this.hasAttribute("aria-valuenow")&&this.removeAttribute("aria-valuenow"),t.has("label")&&(this.label.length?this.setAttribute("aria-label",this.label):this.removeAttribute("aria-label"))}};ye([(0,n.property)({type:Boolean,reflect:!0})],vt.prototype,"indeterminate",2),ye([(0,n.property)({type:String})],vt.prototype,"label",2),ye([(0,n.property)({type:Boolean,reflect:!0,attribute:"over-background"})],vt.prototype,"overBackground",2),ye([(0,n.property)({reflect:!0})],vt.prototype,"static",2),ye([(0,n.property)({type:Number})],vt.prototype,"progress",2),ye([(0,n.query)("slot")],vt.prototype,"slotEl",2);P();b("sp-progress-circle",vt);S();Pe();h();S();Pe();h();var en=i.css`
:host{--spectrum-radio-neutral-content-color:var(
--spectrum-neutral-content-color-default
);--spectrum-radio-neutral-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-radio-neutral-content-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-radio-neutral-content-color-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-radio-focus-indicator-thickness:var(
--spectrum-focus-indicator-thickness
);--spectrum-radio-focus-indicator-gap:var(--spectrum-focus-indicator-gap);--spectrum-radio-focus-indicator-color:var(
--spectrum-focus-indicator-color
);--spectrum-radio-disabled-content-color:var(
--spectrum-disabled-content-color
);--spectrum-radio-disabled-border-color:var(
--spectrum-disabled-content-color
);--spectrum-radio-emphasized-accent-color:var(--spectrum-accent-color-900);--spectrum-radio-emphasized-accent-color-hover:var(
--spectrum-accent-color-1000
);--spectrum-radio-emphasized-accent-color-down:var(
--spectrum-accent-color-1100
);--spectrum-radio-emphasized-accent-color-focus:var(
--spectrum-accent-color-1000
);--spectrum-radio-border-width:var(--spectrum-border-width-200);--spectrum-radio-button-background-color:var(--spectrum-gray-75);--spectrum-radio-button-checked-border-color-default:var(
--spectrum-neutral-background-color-selected-default
);--spectrum-radio-button-checked-border-color-hover:var(
--spectrum-neutral-background-color-selected-hover
);--spectrum-radio-button-checked-border-color-down:var(
--spectrum-neutral-background-color-selected-down
);--spectrum-radio-button-checked-border-color-focus:var(
--spectrum-neutral-background-color-selected-focus
);--spectrum-radio-line-height:var(--spectrum-line-height-100);--spectrum-radio-animation-duration:var(--spectrum-animation-duration-100)}:host(:lang(ja)),:host(:lang(ko)),:host(:lang(zh)){--spectrum-radio-line-height-cjk:var(--spectrum-cjk-line-height-100)}:host([size=s]){--spectrum-radio-height:var(--spectrum-component-height-75);--spectrum-radio-button-control-size:var(
--spectrum-radio-button-control-size-small
);--spectrum-radio-text-to-control:var(--spectrum-text-to-control-75);--spectrum-radio-label-top-to-text:var(
--spectrum-component-top-to-text-75
);--spectrum-radio-label-bottom-to-text:var(
--spectrum-component-bottom-to-text-75
);--spectrum-radio-button-top-to-control:var(
--spectrum-radio-button-top-to-control-small
);--spectrum-radio-font-size:var(--spectrum-font-size-75)}:host{--spectrum-radio-height:var(--spectrum-component-height-100);--spectrum-radio-button-control-size:var(
--spectrum-radio-button-control-size-medium
);--spectrum-radio-text-to-control:var(--spectrum-text-to-control-100);--spectrum-radio-label-top-to-text:var(
--spectrum-component-top-to-text-100
);--spectrum-radio-label-bottom-to-text:var(
--spectrum-component-bottom-to-text-100
);--spectrum-radio-button-top-to-control:var(
--spectrum-radio-button-top-to-control-medium
);--spectrum-radio-font-size:var(--spectrum-font-size-100)}:host([size=l]){--spectrum-radio-height:var(--spectrum-component-height-200);--spectrum-radio-button-control-size:var(
--spectrum-radio-button-control-size-large
);--spectrum-radio-text-to-control:var(--spectrum-text-to-control-200);--spectrum-radio-label-top-to-text:var(
--spectrum-component-top-to-text-200
);--spectrum-radio-label-bottom-to-text:var(
--spectrum-component-bottom-to-text-200
);--spectrum-radio-button-top-to-control:var(
--spectrum-radio-button-top-to-control-large
);--spectrum-radio-font-size:var(--spectrum-font-size-200)}:host([size=xl]){--spectrum-radio-height:var(--spectrum-component-height-300);--spectrum-radio-button-control-size:var(
--spectrum-radio-button-control-size-extra-large
);--spectrum-radio-text-to-control:var(--spectrum-text-to-control-300);--spectrum-radio-label-top-to-text:var(
--spectrum-component-top-to-text-300
);--spectrum-radio-label-bottom-to-text:var(
--spectrum-component-bottom-to-text-300
);--spectrum-radio-button-top-to-control:var(
--spectrum-radio-button-top-to-control-extra-large
);--spectrum-radio-font-size:var(--spectrum-font-size-300)}@media (forced-colors:active){:host{--highcontrast-radio-neutral-content-color:CanvasText;--highcontrast-radio-neutral-content-color-hover:CanvasText;--highcontrast-radio-neutral-content-color-down:CanvasText;--highcontrast-radio-neutral-content-color-focus:CanvasText;--highcontrast-radio-button-border-color-default:ButtonText;--highcontrast-radio-button-border-color-hover:Highlight;--highcontrast-radio-button-border-color-down:ButtonText;--highcontrast-radio-button-border-color-focus:Highlight;--highcontrast-radio-emphasized-accent-color:ButtonText;--highcontrast-radio-emphasized-accent-color-hover:Highlight;--highcontrast-radio-emphasized-accent-color-down:ButtonText;--highcontrast-radio-emphasized-accent-color-focus:Highlight;--highcontrast-radio-button-checked-border-color-default:Highlight;--highcontrast-radio-button-checked-border-color-hover:Highlight;--highcontrast-radio-button-checked-border-color-down:Highlight;--highcontrast-radio-button-checked-border-color-focus:Highlight;--highcontrast-radio-disabled-content-color:GrayText;--highcontrast-radio-disabled-border-color:GrayText;--highcontrast-radio-focus-indicator-color:CanvasText}#button:after{forced-color-adjust:none}}:host{align-items:flex-start;display:inline-flex;max-inline-size:100%;min-block-size:var(--mod-radio-height,var(--spectrum-radio-height));position:relative;vertical-align:top}:host(:hover) #button:before{border-color:var(
--highcontrast-radio-button-border-color-hover,var(
--mod-radio-button-border-color-hover,var(--spectrum-radio-button-border-color-hover)
)
)}:host([checked]:hover) #input+#button:before{border-color:var(
--highcontrast-radio-button-checked-border-color-hover,var(
--mod-radio-button-checked-border-color-hover,var(--spectrum-radio-button-checked-border-color-hover)
)
)}:host(:hover) #label{color:var(
--highcontrast-radio-neutral-content-color-hover,var(
--mod-radio-neutral-content-color-hover,var(--spectrum-radio-neutral-content-color-hover)
)
)}:host(:active) #button:before{border-color:var(
--highcontrast-radio-button-border-color-down,var(
--mod-radio-button-border-color-down,var(--spectrum-radio-button-border-color-down)
)
)}:host(:active[checked]) #input+#button:before{border-color:var(
--highcontrast-radio-button-checked-border-color-down,var(
--mod-radio-button-checked-border-color-down,var(--spectrum-radio-button-checked-border-color-down)
)
)}:host(:active) #label{color:var(
--highcontrast-radio-neutral-content-color-down,var(
--mod-radio-neutral-content-color-down,var(--spectrum-radio-neutral-content-color-down)
)
)}:host(.focus-visible) #button:before{border-color:var(
--highcontrast-radio-button-border-color-focus,var(
--mod-radio-button-border-color-focus,var(--spectrum-radio-button-border-color-focus)
)
)}:host(.focus-visible) #button:before{border-color:var(
--highcontrast-radio-button-border-color-focus,var(
--mod-radio-button-border-color-focus,var(--spectrum-radio-button-border-color-focus)
)
)}:host(:focus-visible) #button:before{border-color:var(
--highcontrast-radio-button-border-color-focus,var(
--mod-radio-button-border-color-focus,var(--spectrum-radio-button-border-color-focus)
)
)}:host(.focus-visible) #button:after{border-color:var(
--highcontrast-radio-focus-indicator-color,var(
--mod-radio-focus-indicator-color,var(--spectrum-radio-focus-indicator-color)
)
);border-style:solid;border-width:var(
--mod-radio-focus-indicator-thickness,var(--spectrum-radio-focus-indicator-thickness)
);height:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2);width:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2)}:host(.focus-visible) #button:after{border-color:var(
--highcontrast-radio-focus-indicator-color,var(
--mod-radio-focus-indicator-color,var(--spectrum-radio-focus-indicator-color)
)
);border-style:solid;border-width:var(
--mod-radio-focus-indicator-thickness,var(--spectrum-radio-focus-indicator-thickness)
);height:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2);width:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2)}:host(:focus-visible) #button:after{border-color:var(
--highcontrast-radio-focus-indicator-color,var(
--mod-radio-focus-indicator-color,var(--spectrum-radio-focus-indicator-color)
)
);border-style:solid;border-width:var(
--mod-radio-focus-indicator-thickness,var(--spectrum-radio-focus-indicator-thickness)
);height:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2);width:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2)}:host(.focus-visible[checked]) #input+#button:before{border-color:var(
--highcontrast-radio-button-checked-border-color-focus,var(
--mod-radio-button-checked-border-color-focus,var(--spectrum-radio-button-checked-border-color-focus)
)
)}:host(.focus-visible[checked]) #input+#button:before{border-color:var(
--highcontrast-radio-button-checked-border-color-focus,var(
--mod-radio-button-checked-border-color-focus,var(--spectrum-radio-button-checked-border-color-focus)
)
)}:host(:focus-visible[checked]) #input+#button:before{border-color:var(
--highcontrast-radio-button-checked-border-color-focus,var(
--mod-radio-button-checked-border-color-focus,var(--spectrum-radio-button-checked-border-color-focus)
)
)}:host(.focus-visible) #label{color:var(
--highcontrast-radio-neutral-content-color-focus,var(
--mod-radio-neutral-content-color-focus,var(--spectrum-radio-neutral-content-color-focus)
)
)}:host(.focus-visible) #label{color:var(
--highcontrast-radio-neutral-content-color-focus,var(
--mod-radio-neutral-content-color-focus,var(--spectrum-radio-neutral-content-color-focus)
)
)}:host(:focus-visible) #label{color:var(
--highcontrast-radio-neutral-content-color-focus,var(
--mod-radio-neutral-content-color-focus,var(--spectrum-radio-neutral-content-color-focus)
)
)}:host([invalid]) #label{color:var(
--highcontrast-radio-neutral-content-color,var(
--mod-radio-neutral-content-color,var(--spectrum-radio-neutral-content-color)
)
)}:host([readonly]) #input:read-only{cursor:auto}:host([readonly]) #button{clip:rect(1px,1px,1px,1px);bottom:100%;clip-path:inset(50%);position:fixed;right:100%}:host([readonly]),:host([readonly]) #label,:host([readonly][checked][disabled]) #input~#label,:host([readonly][disabled]) #input~#label{color:inherit;margin-inline-start:auto}:host([emphasized][checked]) #input+#button:before{border-color:var(
--highcontrast-radio-emphasized-accent-color,var(
--mod-radio-emphasized-accent-color,var(--spectrum-radio-emphasized-accent-color)
)
)}:host([emphasized][checked]:hover) #input+#button:before{border-color:var(
--highcontrast-radio-emphasized-accent-color-hover,var(
--mod-radio-emphasized-accent-color-hover,var(--spectrum-radio-emphasized-accent-color-hover)
)
)}:host([emphasized]:active[checked]) #input+#button:before{border-color:var(
--highcontrast-radio-emphasized-accent-color-down,var(
--mod-radio-emphasized-accent-color-down,var(--spectrum-radio-emphasized-accent-color-down)
)
)}:host([emphasized].focus-visible[checked]) #input+#button:before{border-color:var(
--highcontrast-radio-emphasized-accent-color-focus,var(
--mod-radio-emphasized-accent-color-focus,var(--spectrum-radio-emphasized-accent-color-focus)
)
)}:host([emphasized].focus-visible[checked]) #input+#button:before{border-color:var(
--highcontrast-radio-emphasized-accent-color-focus,var(
--mod-radio-emphasized-accent-color-focus,var(--spectrum-radio-emphasized-accent-color-focus)
)
)}:host([emphasized]:focus-visible[checked]) #input+#button:before{border-color:var(
--highcontrast-radio-emphasized-accent-color-focus,var(
--mod-radio-emphasized-accent-color-focus,var(--spectrum-radio-emphasized-accent-color-focus)
)
)}:host([checked][disabled]) #input+#button:before,:host([disabled]) #input+#button:before{border-color:var(
--highcontrast-radio-disabled-border-color,var(
--mod-radio-disabled-border-color,var(--spectrum-radio-disabled-border-color)
)
)}:host([checked][disabled]) #input~#label,:host([disabled]) #input~#label{color:var(
--highcontrast-radio-disabled-content-color,var(
--mod-radio-disabled-content-color,var(--spectrum-radio-disabled-content-color)
)
)}#input{block-size:100%;box-sizing:border-box;cursor:pointer;font-family:inherit;font-size:100%;inline-size:100%;line-height:var(
--mod-radio-line-height,var(--spectrum-radio-line-height)
);margin:0;opacity:0;overflow:visible;padding:0;position:absolute;z-index:1}:host([disabled]) #input{cursor:default}:host([checked]) #input+#button:before{border-color:var(
--highcontrast-radio-button-checked-border-color-default,var(
--mod-radio-button-checked-border-color-default,var(--spectrum-radio-button-checked-border-color-default)
)
);border-width:calc(var(--spectrum-radio-button-control-size)/2 - var(--spectrum-radio-button-selection-indicator)/2)}#input.focus-visible+#button:after{border-color:var(
--highcontrast-radio-focus-indicator-color,var(
--mod-radio-focus-indicator-color,var(--spectrum-radio-focus-indicator-color)
)
);border-style:solid;border-width:var(
--mod-radio-focus-indicator-thickness,var(--spectrum-radio-focus-indicator-thickness)
);height:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2);width:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2)}#input.focus-visible+#button:after{border-color:var(
--highcontrast-radio-focus-indicator-color,var(
--mod-radio-focus-indicator-color,var(--spectrum-radio-focus-indicator-color)
)
);border-style:solid;border-width:var(
--mod-radio-focus-indicator-thickness,var(--spectrum-radio-focus-indicator-thickness)
);height:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2);width:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2)}#input:focus-visible+#button:after{border-color:var(
--highcontrast-radio-focus-indicator-color,var(
--mod-radio-focus-indicator-color,var(--spectrum-radio-focus-indicator-color)
)
);border-style:solid;border-width:var(
--mod-radio-focus-indicator-thickness,var(--spectrum-radio-focus-indicator-thickness)
);height:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2);width:calc(var(--spectrum-radio-button-control-size) + var(--spectrum-radio-focus-indicator-gap)*2)}#label{color:var(
--highcontrast-radio-neutral-content-color,var(
--mod-radio-neutral-content-color,var(--spectrum-radio-neutral-content-color)
)
);font-size:var(--mod-radio-font-size,var(--spectrum-radio-font-size));line-height:var(
--mod-radio-line-height,var(--spectrum-radio-line-height)
);margin-block-end:var(--spectrum-radio-label-bottom-to-text);margin-block-start:var(--spectrum-radio-label-top-to-text);margin-inline-start:var(
--mod-radio-text-to-control,var(--spectrum-radio-text-to-control)
);text-align:start;transition:color var(
--mod-radio-animation-duration,var(--spectrum-radio-animation-duration)
) ease-in-out}#label:lang(ja),#label:lang(ko),#label:lang(zh){line-height:var(
--mod-radio-line-height-cjk,var(--spectrum-radio-line-height-cjk)
)}#button{block-size:var(
--mod-radio-button-control-size,var(--spectrum-radio-button-control-size)
);box-sizing:border-box;flex-grow:0;flex-shrink:0;inline-size:var(
--mod-radio-button-control-size,var(--spectrum-radio-button-control-size)
);margin-block-start:var(
--mod-radio-button-top-to-control,var(--spectrum-radio-button-top-to-control)
);position:relative}#button:before{background-color:var(
--highcontrast-radio-button-background-color,var(
--mod-radio-button-background-color,var(--spectrum-radio-button-background-color)
)
);border-color:var(
--highcontrast-radio-button-border-color-default,var(
--mod-radio-button-border-color-default,var(--spectrum-radio-button-border-color-default)
)
);border-radius:50%;border-style:solid;border-width:var(
--mod-radio-border-width,var(--spectrum-radio-border-width)
);box-sizing:border-box;content:"";display:block;height:var(
--mod-radio-button-control-size,var(--spectrum-radio-button-control-size)
);position:absolute;transition:border var(
--mod-radio-animation-duration,var(--spectrum-radio-animation-duration)
) ease-in-out,box-shadow var(
--mod-radio-animation-duration,var(--spectrum-radio-animation-duration)
) ease-in-out;width:var(
--mod-radio-button-control-size,var(--spectrum-radio-button-control-size)
);z-index:0}#button:after{border-radius:50%;content:"";display:block;left:50%;position:absolute;top:50%;transform:translateX(-50%) translateY(-50%);transition:opacity var(
--mod-radio-animation-duration,var(--spectrum-radio-animation-duration)
) ease-out,margin var(
--mod-radio-animation-duration,var(--spectrum-radio-animation-duration)
) ease-out}:host{--spectrum-radio-button-border-color-default:var(
--system-spectrum-radio-button-border-color-default
);--spectrum-radio-button-border-color-hover:var(
--system-spectrum-radio-button-border-color-hover
);--spectrum-radio-button-border-color-down:var(
--system-spectrum-radio-button-border-color-down
);--spectrum-radio-button-border-color-focus:var(
--system-spectrum-radio-button-border-color-focus
)}:host([emphasized]){--spectrum-radio-button-checked-border-color-default:var(
--system-spectrum-radio-emphasized-button-checked-border-color-default
);--spectrum-radio-button-checked-border-color-hover:var(
--system-spectrum-radio-emphasized-button-checked-border-color-hover
);--spectrum-radio-button-checked-border-color-down:var(
--system-spectrum-radio-emphasized-button-checked-border-color-down
);--spectrum-radio-button-checked-border-color-focus:var(
--system-spectrum-radio-emphasized-button-checked-border-color-focus
)}:host{--spectrum-radio-label-margin-top:var(
--spectrum-global-dimension-size-75,6px
)}:host(:focus){outline:none}:host([disabled]){pointer-events:none}
`,fa=en;var rn=Object.defineProperty,on=Object.getOwnPropertyDescriptor,Yt=(s,t,e,r)=>{for(var o=r>1?void 0:r?on(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&rn(t,e,o),o},Q=class extends H(lt(I),{noDefaultSize:!0}){constructor(){super(...arguments),this.autofocus=!1,this.value="",this.checked=!1,this.disabled=!1,this.emphasized=!1,this.invalid=!1,this.readonly=!1}static get styles(){return[fa]}click(){this.disabled||this.activate()}manageAutoFocus(){this.autofocus&&(this.dispatchEvent(new KeyboardEvent("keydown",{code:"Tab"})),this.focus())}activate(){this.checked||(this.checked=!0,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})))}handleKeyup(t){t.code==="Space"&&this.activate()}render(){return i.html`
            <div id="input"></div>
            <span id="button"></span>
            <span id="label" role="presentation"><slot></slot></span>
        `}firstUpdated(t){super.firstUpdated(t),this.setAttribute("role","radio"),this.hasAttribute("tabindex")||(this.tabIndex=0),this.manageAutoFocus(),this.addEventListener("click",this.activate),this.addEventListener("keyup",this.handleKeyup)}updated(t){super.updated(t),t.has("invalid")&&(this.invalid?this.setAttribute("aria-invalid","true"):this.removeAttribute("aria-invalid")),t.has("checked")&&(this.checked?this.setAttribute("aria-checked","true"):this.setAttribute("aria-checked","false")),t.has("disabled")&&(this.disabled?this.setAttribute("aria-disabled","true"):this.removeAttribute("aria-disabled"))}};Yt([(0,n.property)({type:Boolean})],Q.prototype,"autofocus",2),Yt([(0,n.property)({type:String,reflect:!0})],Q.prototype,"value",2),Yt([(0,n.property)({type:Boolean,reflect:!0})],Q.prototype,"checked",2),Yt([(0,n.property)({type:Boolean,reflect:!0})],Q.prototype,"disabled",2),Yt([(0,n.property)({type:Boolean,reflect:!0})],Q.prototype,"emphasized",2),Yt([(0,n.property)({type:Boolean,reflect:!0})],Q.prototype,"invalid",2),Yt([(0,n.property)({type:Boolean,reflect:!0})],Q.prototype,"readonly",2);function vo(s,t,e){return typeof s===t?()=>s:typeof s=="function"?s:e}var Sr=class{constructor(t,{direction:e,elementEnterAction:r,elements:o,focusInIndex:a,isFocusableElement:c,listenerScope:l}={elements:()=>[]}){this._currentIndex=-1,this._direction=()=>"both",this.directionLength=5,this.elementEnterAction=u=>{},this._focused=!1,this._focusInIndex=u=>0,this.isFocusableElement=u=>!0,this._listenerScope=()=>this.host,this.offset=0,this.recentlyConnected=!1,this.handleFocusin=u=>{if(!this.isEventWithinListenerScope(u))return;this.isRelatedTargetAnElement(u)&&this.hostContainsFocus();let m=u.composedPath(),d=-1;m.find(p=>(d=this.elements.indexOf(p),d!==-1)),this.currentIndex=d>-1?d:this.currentIndex},this.handleFocusout=u=>{this.isRelatedTargetAnElement(u)&&this.hostNoLongerContainsFocus()},this.handleKeydown=u=>{if(!this.acceptsEventCode(u.code)||u.defaultPrevented)return;let m=0;switch(u.code){case"ArrowRight":m+=1;break;case"ArrowDown":m+=this.direction==="grid"?this.directionLength:1;break;case"ArrowLeft":m-=1;break;case"ArrowUp":m-=this.direction==="grid"?this.directionLength:1;break;case"End":this.currentIndex=0,m-=1;break;case"Home":this.currentIndex=this.elements.length-1,m+=1;break}u.preventDefault(),this.direction==="grid"&&this.currentIndex+m<0?this.currentIndex=0:this.direction==="grid"&&this.currentIndex+m>this.elements.length-1?this.currentIndex=this.elements.length-1:this.setCurrentIndexCircularly(m),this.elementEnterAction(this.elements[this.currentIndex]),this.focus()},this.mutationObserver=new MutationObserver(()=>{this.handleItemMutation()}),this.host=t,this.host.addController(this),this._elements=o,this.isFocusableElement=c||this.isFocusableElement,this._direction=vo(e,"string",this._direction),this.elementEnterAction=r||this.elementEnterAction,this._focusInIndex=vo(a,"number",this._focusInIndex),this._listenerScope=vo(l,"object",this._listenerScope)}get currentIndex(){return this._currentIndex===-1&&(this._currentIndex=this.focusInIndex),this._currentIndex-this.offset}set currentIndex(t){this._currentIndex=t+this.offset}get direction(){return this._direction()}get elements(){return this.cachedElements||(this.cachedElements=this._elements()),this.cachedElements}set focused(t){t!==this.focused&&(this._focused=t)}get focused(){return this._focused}get focusInElement(){return this.elements[this.focusInIndex]}get focusInIndex(){return this._focusInIndex(this.elements)}isEventWithinListenerScope(t){return this._listenerScope()===this.host?!0:t.composedPath().includes(this._listenerScope())}handleItemMutation(){if(this._currentIndex==-1||this.elements.length<=this._elements().length)return;let t=this.elements[this.currentIndex];if(this.clearElementCache(),this.elements.includes(t))return;let e=this.currentIndex!==this.elements.length,r=e?1:-1;e&&this.setCurrentIndexCircularly(-1),this.setCurrentIndexCircularly(r),this.focus()}update({elements:t}={elements:()=>[]}){this.unmanage(),this._elements=t,this.clearElementCache(),this.manage()}focus(t){let e=this.elements;if(!e.length)return;let r=e[this.currentIndex];(!r||!this.isFocusableElement(r))&&(this.setCurrentIndexCircularly(1),r=e[this.currentIndex]),r&&this.isFocusableElement(r)&&r.focus(t)}clearElementCache(t=0){this.mutationObserver.disconnect(),delete this.cachedElements,this.offset=t,requestAnimationFrame(()=>{this.elements.forEach(e=>{this.mutationObserver.observe(e,{attributes:!0})})})}setCurrentIndexCircularly(t){let{length:e}=this.elements,r=e,o=(e+this.currentIndex+t)%e;for(;r&&this.elements[o]&&!this.isFocusableElement(this.elements[o]);)o=(e+o+t)%e,r-=1;this.currentIndex=o}hostContainsFocus(){this.host.addEventListener("focusout",this.handleFocusout),this.host.addEventListener("keydown",this.handleKeydown),this.focused=!0}hostNoLongerContainsFocus(){this.host.addEventListener("focusin",this.handleFocusin),this.host.removeEventListener("focusout",this.handleFocusout),this.host.removeEventListener("keydown",this.handleKeydown),this.focused=!1}isRelatedTargetAnElement(t){let e=t.relatedTarget;return!this.elements.includes(e)}acceptsEventCode(t){if(t==="End"||t==="Home")return!0;switch(this.direction){case"horizontal":return t==="ArrowLeft"||t==="ArrowRight";case"vertical":return t==="ArrowUp"||t==="ArrowDown";case"both":case"grid":return t.startsWith("Arrow")}}manage(){this.addEventListeners()}unmanage(){this.removeEventListeners()}addEventListeners(){this.host.addEventListener("focusin",this.handleFocusin)}removeEventListeners(){this.host.removeEventListener("focusin",this.handleFocusin),this.host.removeEventListener("focusout",this.handleFocusout),this.host.removeEventListener("keydown",this.handleKeydown)}hostConnected(){this.recentlyConnected=!0,this.addEventListeners()}hostDisconnected(){this.mutationObserver.disconnect(),this.removeEventListeners()}hostUpdated(){this.recentlyConnected&&(this.recentlyConnected=!1,this.elements.forEach(t=>{this.mutationObserver.observe(t,{attributes:!0})}))}};var xe=class extends Sr{constructor(){super(...arguments),this.managed=!0,this.manageIndexesAnimationFrame=0}set focused(t){t!==this.focused&&(super.focused=t,this.manageTabindexes())}get focused(){return super.focused}clearElementCache(t=0){cancelAnimationFrame(this.manageIndexesAnimationFrame),super.clearElementCache(t),this.managed&&(this.manageIndexesAnimationFrame=requestAnimationFrame(()=>this.manageTabindexes()))}manageTabindexes(){this.focused?this.updateTabindexes(()=>({tabIndex:-1})):this.updateTabindexes(t=>({removeTabIndex:t.contains(this.focusInElement)&&t!==this.focusInElement,tabIndex:t===this.focusInElement?0:-1}))}updateTabindexes(t){this.elements.forEach(e=>{let{tabIndex:r,removeTabIndex:o}=t(e);if(!o){e.tabIndex=r;return}e.removeAttribute("tabindex");let a=e;a.requestUpdate&&a.requestUpdate()})}manage(){this.managed=!0,this.manageTabindexes(),super.manage()}unmanage(){this.managed=!1,this.updateTabindexes(()=>({tabIndex:0})),super.unmanage()}hostUpdated(){super.hostUpdated(),this.host.hasUpdated||this.manageTabindexes()}};var sn=Object.defineProperty,an=Object.getOwnPropertyDescriptor,fo=(s,t,e,r)=>{for(var o=r>1?void 0:r?an(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&sn(t,e,o),o},Zt=class extends lt(pt){constructor(){super(...arguments),this.name="",this.rovingTabindexController=new xe(this,{focusInIndex:t=>t.findIndex(e=>this.selected?!e.disabled&&e.value===this.selected:!e.disabled),elementEnterAction:t=>{this._setSelected(t.value)},elements:()=>this.buttons,isFocusableElement:t=>!t.disabled}),this.selected=""}get buttons(){return this.defaultNodes.filter(t=>t instanceof Q)}focus(){this.rovingTabindexController.focus()}_setSelected(t){if(t===this.selected)return;let e=this.selected,r=t?this.querySelector(`sp-radio[value="${t}"]`):void 0;if(this.selected=r?t:"",!this.dispatchEvent(new Event("change",{cancelable:!0,bubbles:!0,composed:!0}))){this.selected=e;return}this.validateRadios()}willUpdate(t){if(!this.hasUpdated){this.setAttribute("role","radiogroup");let e=this.querySelector("sp-radio[checked]"),r=e?e.value:"";if(this.selected=r||this.selected,this.selected&&this.selected!==r){let o=this.querySelector(`sp-radio[value="${this.selected}"]`);o&&(o.checked=!0)}this.shadowRoot.addEventListener("change",o=>{o.stopPropagation();let a=o.target;this._setSelected(a.value)})}t.has("selected")&&this.validateRadios()}async validateRadios(){let t=!1;this.hasUpdated||await this.updateComplete,this.buttons.map(e=>{e.checked=this.selected===e.value,t=t||e.checked}),t||(this.selected="")}handleSlotchange(){this.rovingTabindexController.clearElementCache()}};fo([(0,n.property)({type:String})],Zt.prototype,"name",2),fo([(0,n.queryAssignedNodes)()],Zt.prototype,"defaultNodes",2),fo([(0,n.property)({reflect:!0})],Zt.prototype,"selected",2);P();b("sp-radio-group",Zt);P();b("sp-radio",Q);h();S();tt();h();tt();S();Ft();h();var cn=i.css`
:host{--spectrum-textfield-input-line-height:var(--spectrum-textfield-height);--spectrum-texfield-animation-duration:var(
--spectrum-animation-duration-100
);--spectrum-textfield-width:240px;--spectrum-textfield-min-width:var(
--spectrum-text-field-minimum-width-multiplier
);--spectrum-textfield-corner-radius:var(--spectrum-corner-radius-100);--spectrum-textfield-spacing-inline-quiet:var(
--spectrum-field-edge-to-text-quiet
);--spectrum-textfield-spacing-block-start:var(
--spectrum-component-top-to-text-100
);--spectrum-textfield-spacing-block-end:var(
--spectrum-component-bottom-to-text-100
);--spectrum-textfield-spacing-block-quiet:var(
--spectrum-field-edge-to-border-quiet
);--spectrum-textfield-label-spacing-block:var(
--spectrum-field-label-to-component
);--spectrum-textfield-label-spacing-inline-side-label:var(
--spectrum-spacing-100
);--spectrum-textfield-helptext-spacing-block:var(
--spectrum-help-text-to-component
);--spectrum-textfield-icon-spacing-inline-end-quiet-invalid:var(
--spectrum-field-edge-to-alert-icon-quiet
);--spectrum-textfield-icon-spacing-inline-end-quiet-valid:var(
--spectrum-field-edge-to-validation-icon-quiet
);--spectrum-textfield-icon-spacing-inline-end-override:32px;--spectrum-Textfield-workflow-icon-width:18px;--spectrum-Textfield-workflow-icon-gap:6px;--spectrum-textfield-font-family:var(--spectrum-sans-font-family-stack);--spectrum-textfield-font-weight:var(--spectrum-regular-font-weight);--spectrum-textfield-character-count-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-textfield-character-count-font-weight:var(
--spectrum-regular-font-weight
);--spectrum-textfield-character-count-spacing-inline:var(
--spectrum-spacing-200
);--spectrum-textfield-character-count-spacing-inline-side:var(
--spectrum-side-label-character-count-to-field
);--spectrum-textfield-focus-indicator-width:var(
--spectrum-focus-indicator-thickness
);--spectrum-textfield-focus-indicator-gap:var(
--spectrum-focus-indicator-gap
);--spectrum-textfield-background-color:var(--spectrum-gray-50);--spectrum-textfield-text-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-textfield-text-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-textfield-text-color-focus:var(
--spectrum-neutral-content-color-focus
);--spectrum-textfield-text-color-focus-hover:var(
--spectrum-neutral-content-color-focus-hover
);--spectrum-textfield-text-color-keyboard-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-textfield-text-color-readonly:var(
--spectrum-neutral-content-color-default
);--spectrum-textfield-background-color-disabled:var(
--spectrum-disabled-background-color
);--spectrum-textfield-border-color-disabled:var(
--spectrum-disabled-border-color
);--spectrum-textfield-text-color-disabled:var(
--spectrum-disabled-content-color
);--spectrum-textfield-border-color-invalid-default:var(
--spectrum-negative-border-color-default
);--spectrum-textfield-border-color-invalid-hover:var(
--spectrum-negative-border-color-hover
);--spectrum-textfield-border-color-invalid-focus:var(
--spectrum-negative-border-color-focus
);--spectrum-textfield-border-color-invalid-focus-hover:var(
--spectrum-negative-border-color-focus-hover
);--spectrum-textfield-border-color-invalid-keyboard-focus:var(
--spectrum-negative-border-color-key-focus
);--spectrum-textfield-icon-color-invalid:var(
--spectrum-negative-visual-color
);--spectrum-textfield-text-color-invalid:var(
--spectrum-neutral-content-color-default
);--spectrum-textfield-text-color-valid:var(
--spectrum-neutral-content-color-default
);--spectrum-textfield-icon-color-valid:var(
--spectrum-positive-visual-color
);--spectrum-textfield-focus-indicator-color:var(
--spectrum-focus-indicator-color
);--spectrum-text-area-min-inline-size:var(
--spectrum-text-area-minimum-width
);--spectrum-text-area-min-block-size:var(
--spectrum-text-area-minimum-height
)}:host([size=s]){--spectrum-textfield-height:var(--spectrum-component-height-75);--spectrum-textfield-label-spacing-block-quiet:var(
--spectrum-field-label-to-component-quiet-small
);--spectrum-textfield-label-spacing-inline-side-label:var(
--spectrum-spacing-100
);--spectrum-textfield-placeholder-font-size:var(--spectrum-font-size-75);--spectrum-textfield-spacing-inline:var(
--spectrum-component-edge-to-text-75
);--spectrum-textfield-icon-size-invalid:var(
--spectrum-workflow-icon-size-75
);--spectrum-textfield-icon-spacing-inline-end-invalid:var(
--spectrum-field-edge-to-alert-icon-small
);--spectrum-textfield-icon-spacing-inline-end-valid:var(
--spectrum-field-edge-to-validation-icon-small
);--spectrum-textfield-icon-spacing-block-invalid:var(
--spectrum-field-top-to-alert-icon-small
);--spectrum-textfield-icon-spacing-block-valid:var(
--spectrum-field-top-to-validation-icon-small
);--spectrum-textfield-icon-spacing-inline-start-invalid:var(
--spectrum-field-text-to-alert-icon-small
);--spectrum-textfield-icon-spacing-inline-start-valid:var(
--spectrum-field-text-to-validation-icon-small
);--spectrum-textfield-character-count-font-size:var(
--spectrum-font-size-75
);--spectrum-textfield-character-count-spacing-block:var(
--spectrum-component-bottom-to-text-75
);--spectrum-textfield-character-count-spacing-block-quiet:var(
--spectrum-character-count-to-field-quiet-small
);--spectrum-textfield-character-count-spacing-block-side:var(
--spectrum-side-label-character-count-top-margin-small
);--spectrum-text-area-min-block-size-quiet:var(
--spectrum-component-height-75
)}:host{--spectrum-textfield-height:var(--spectrum-component-height-100);--spectrum-textfield-label-spacing-block-quiet:var(
--spectrum-field-label-to-component-quiet-medium
);--spectrum-textfield-label-spacing-inline-side-label:var(
--spectrum-spacing-200
);--spectrum-textfield-placeholder-font-size:var(--spectrum-font-size-100);--spectrum-textfield-spacing-inline:var(
--spectrum-component-edge-to-text-100
);--spectrum-textfield-icon-size-invalid:var(
--spectrum-workflow-icon-size-100
);--spectrum-textfield-icon-spacing-inline-end-invalid:var(
--spectrum-field-edge-to-alert-icon-medium
);--spectrum-textfield-icon-spacing-inline-end-valid:var(
--spectrum-field-edge-to-validation-icon-medium
);--spectrum-textfield-icon-spacing-block-invalid:var(
--spectrum-field-top-to-alert-icon-medium
);--spectrum-textfield-icon-spacing-block-valid:var(
--spectrum-field-top-to-validation-icon-medium
);--spectrum-textfield-icon-spacing-inline-start-invalid:var(
--spectrum-field-text-to-alert-icon-medium
);--spectrum-textfield-icon-spacing-inline-start-valid:var(
--spectrum-field-text-to-validation-icon-medium
);--spectrum-textfield-character-count-font-size:var(
--spectrum-font-size-75
);--spectrum-textfield-character-count-spacing-block:var(
--spectrum-component-bottom-to-text-75
);--spectrum-textfield-character-count-spacing-block-quiet:var(
--spectrum-character-count-to-field-quiet-medium
);--spectrum-textfield-character-count-spacing-block-side:var(
--spectrum-side-label-character-count-top-margin-medium
);--spectrum-text-area-min-block-size-quiet:var(
--spectrum-component-height-100
)}:host([size=l]){--spectrum-textfield-height:var(--spectrum-component-height-200);--spectrum-textfield-label-spacing-block-quiet:var(
--spectrum-field-label-to-component-quiet-large
);--spectrum-textfield-label-spacing-inline-side-label:var(
--spectrum-spacing-200
);--spectrum-textfield-placeholder-font-size:var(--spectrum-font-size-200);--spectrum-textfield-spacing-inline:var(
--spectrum-component-edge-to-text-200
);--spectrum-textfield-icon-size-invalid:var(
--spectrum-workflow-icon-size-200
);--spectrum-textfield-icon-spacing-inline-end-invalid:var(
--spectrum-field-edge-to-alert-icon-large
);--spectrum-textfield-icon-spacing-inline-end-valid:var(
--spectrum-field-edge-to-validation-icon-large
);--spectrum-textfield-icon-spacing-block-invalid:var(
--spectrum-field-top-to-alert-icon-large
);--spectrum-textfield-icon-spacing-block-valid:var(
--spectrum-field-top-to-validation-icon-large
);--spectrum-textfield-icon-spacing-inline-start-invalid:var(
--spectrum-field-text-to-alert-icon-large
);--spectrum-textfield-icon-spacing-inline-start-valid:var(
--spectrum-field-text-to-validation-icon-large
);--spectrum-textfield-character-count-font-size:var(
--spectrum-font-size-100
);--spectrum-textfield-character-count-spacing-block:var(
--spectrum-component-bottom-to-text-100
);--spectrum-textfield-character-count-spacing-block-quiet:var(
--spectrum-character-count-to-field-quiet-large
);--spectrum-textfield-character-count-spacing-block-side:var(
--spectrum-side-label-character-count-top-margin-large
);--spectrum-text-area-min-block-size-quiet:var(
--spectrum-component-height-200
)}:host([size=xl]){--spectrum-textfield-height:var(--spectrum-component-height-300);--spectrum-textfield-label-spacing-block-quiet:var(
--spectrum-field-label-to-component-quiet-extra-large
);--spectrum-textfield-label-spacing-inline-side-label:var(
--spectrum-spacing-200
);--spectrum-textfield-placeholder-font-size:var(--spectrum-font-size-300);--spectrum-textfield-spacing-inline:var(
--spectrum-component-edge-to-text-200
);--spectrum-textfield-icon-size-invalid:var(
--spectrum-workflow-icon-size-300
);--spectrum-textfield-icon-spacing-inline-end-invalid:var(
--spectrum-field-edge-to-alert-icon-extra-large
);--spectrum-textfield-icon-spacing-inline-end-valid:var(
--spectrum-field-edge-to-validation-icon-extra-large
);--spectrum-textfield-icon-spacing-block-invalid:var(
--spectrum-field-top-to-alert-icon-extra-large
);--spectrum-textfield-icon-spacing-block-valid:var(
--spectrum-field-top-to-validation-icon-extra-large
);--spectrum-textfield-icon-spacing-inline-start-invalid:var(
--spectrum-field-text-to-alert-icon-extra-large
);--spectrum-textfield-icon-spacing-inline-start-valid:var(
--spectrum-field-text-to-validation-icon-extra-large
);--spectrum-textfield-character-count-font-size:var(
--spectrum-font-size-200
);--spectrum-textfield-character-count-spacing-block:var(
--spectrum-component-bottom-to-text-200
);--spectrum-textfield-character-count-spacing-block-quiet:var(
--spectrum-character-count-to-field-quiet-extra-large
);--spectrum-textfield-character-count-spacing-block-side:var(
--spectrum-side-label-character-count-top-margin-extra-large
);--spectrum-text-area-min-block-size-quiet:var(
--spectrum-component-height-300
)}#textfield{-moz-appearance:textfield;display:inline-grid;grid-template-columns:auto auto;grid-template-rows:auto auto auto;inline-size:var(--mod-textfield-width,var(--spectrum-textfield-width));margin:0;overflow:visible;position:relative;text-indent:0;text-overflow:ellipsis}:host([quiet]) #textfield:after{block-size:var(
--mod-textfield-focus-indicator-width,var(--spectrum-textfield-focus-indicator-width)
);bottom:calc((var(
--mod-textfield-focus-indicator-gap,
var(--spectrum-textfield-focus-indicator-gap)
) + var(
--mod-textfield-focus-indicator-width,
var(--spectrum-textfield-focus-indicator-width)
))*-1);content:"";inline-size:100%;left:0;position:absolute}:host([quiet]) #textfield.focus-visible:after,:host([quiet]) #textfield:focus-within:after,:host([quiet][focused]) #textfield:after{background-color:var(
--highcontrast-textfield-focus-indicator-color,var(
--mod-textfield-focus-indicator-color,var(--spectrum-textfield-focus-indicator-color)
)
)}:host([quiet]) #textfield.focus-visible:after,:host([quiet]) #textfield:focus-within:after,:host([quiet][focused]) #textfield:after{background-color:var(
--highcontrast-textfield-focus-indicator-color,var(
--mod-textfield-focus-indicator-color,var(--spectrum-textfield-focus-indicator-color)
)
)}:host([quiet]) #textfield:focus-visible:after,:host([quiet]) #textfield:focus-within:after,:host([quiet][focused]) #textfield:after{background-color:var(
--highcontrast-textfield-focus-indicator-color,var(
--mod-textfield-focus-indicator-color,var(--spectrum-textfield-focus-indicator-color)
)
)}:host([invalid]) #textfield .icon,:host([valid]) #textfield .icon{grid-area:2/2;margin-inline-start:auto;pointer-events:all;position:absolute;top:0}:host([valid]) #textfield .icon{color:var(
--highcontrast-textfield-icon-color-valid,var(
--mod-textfield-icon-color-valid,var(--spectrum-textfield-icon-color-valid)
)
);inset-block-end:var(
--mod-textfield-icon-spacing-block-valid,var(--spectrum-textfield-icon-spacing-block-valid)
);inset-block-start:var(
--mod-textfield-icon-spacing-block-valid,var(--spectrum-textfield-icon-spacing-block-valid)
);inset-inline-end:var(
--mod-textfield-icon-spacing-inline-end-valid,var(--spectrum-textfield-icon-spacing-inline-end-valid)
);inset-inline-start:var(
--mod-textfield-icon-spacing-inline-start-valid,var(--spectrum-textfield-icon-spacing-inline-start-valid)
)}:host([invalid]) #textfield .icon{block-size:var(
--mod-textfield-icon-size-invalid,var(--spectrum-textfield-icon-size-invalid)
);color:var(
--highcontrast-textfield-icon-color-invalid,var(
--mod-textfield-icon-color-invalid,var(--spectrum-textfield-icon-color-invalid)
)
);inline-size:var(
--mod-textfield-icon-size-invalid,var(--spectrum-textfield-icon-size-invalid)
);inset-block-end:var(
--mod-textfield-icon-spacing-block-invalid,var(--spectrum-textfield-icon-spacing-block-invalid)
);inset-block-start:var(
--mod-textfield-icon-spacing-block-invalid,var(--spectrum-textfield-icon-spacing-block-invalid)
);inset-inline-end:var(
--mod-textfield-icon-spacing-inline-end-invalid,var(--spectrum-textfield-icon-spacing-inline-end-invalid)
);inset-inline-start:var(
--mod-textfield-icon-spacing-inline-start-invalid,var(--spectrum-textfield-icon-spacing-inline-start-invalid)
)}:host([disabled]) #textfield .icon,:host([readonly]) #textfield .icon{color:#0000}:host([quiet]) .icon{padding-inline-end:0}:host([quiet][valid]) .icon{inset-inline-end:var(
--mod-textfield-icon-spacing-inline-end-quiet-valid,var(--spectrum-textfield-icon-spacing-inline-end-quiet-valid)
)}:host([quiet][invalid]) .icon{inset-inline-end:var(
--mod-textfield-icon-spacing-inline-end-quiet-invalid,var(--spectrum-textfield-icon-spacing-inline-end-quiet-invalid)
)}.spectrum-InputGroup .icon{margin-inline-end:var(
--spectrum-textfield-icon-spacing-inline-end-override
)}#textfield .spectrum-FieldLabel{grid-area:1/1/auto/span 1;margin-block-end:var(
--mod-textfield-label-spacing-block,var(--spectrum-textfield-label-spacing-block)
);padding-left:calc(var(
--mod-textfield-corner-radius,
var(--spectrum-textfield-corner-radius)
)/2)}:host([quiet]) .spectrum-FieldLabel{margin-block-end:var(
--mod-textfield-label-spacing-block-quiet,var(--spectrum-textfield-label-spacing-block-quiet)
)}:host([disabled]) .spectrum-FieldLabel{color:var(--spectrum-textfield-text-color-disabled)}#textfield .spectrum-HelpText{grid-area:3/1/auto/span 2;margin-block-start:var(
--mod-textfield-helptext-spacing-block,var(--spectrum-textfield-helptext-spacing-block)
);padding-left:calc(var(
--mod-textfield-corner-radius,
var(--spectrum-textfield-corner-radius)
)/2)}.spectrum-Textfield-characterCount{align-items:flex-end;display:inline-flex;font-family:var(
--mod-textfield-character-count-font-family,var(--spectrum-textfield-character-count-font-family)
);font-size:var(
--mod-textfield-character-count-font-size,var(--spectrum-textfield-character-count-font-size)
);font-weight:var(
--mod-textfield-character-count-font-weight,var(--spectrum-textfield-character-count-font-weight)
);grid-area:1/2/auto/span 1;justify-content:flex-end;margin-block-end:var(
--mod-textfield-character-count-spacing-block,var(--spectrum-textfield-character-count-spacing-block)
);margin-inline-end:0;margin-inline-start:var(
--mod-textfield-character-count-spacing-inline,var(--spectrum-textfield-character-count-spacing-inline)
);padding-right:calc(var(
--mod-textfield-corner-radius,
var(--spectrum-textfield-corner-radius)
)/2);width:auto}:host([quiet]) .spectrum-Textfield-characterCount{margin-block-end:var(
--mod-textfield-character-count-spacing-block-quiet,var(--spectrum-textfield-character-count-spacing-block-quiet)
)}.input{-webkit-appearance:none;-moz-appearance:textfield;background-color:var(
--mod-textfield-background-color,var(--spectrum-textfield-background-color)
);block-size:var(--mod-textfield-height,var(--spectrum-textfield-height));border:var(
--mod-textfield-border-width,var(--spectrum-textfield-border-width)
) solid var(
--highcontrast-textfield-border-color,var(
--mod-textfield-border-color,var(--spectrum-textfield-border-color)
)
);border-radius:var(
--mod-textfield-corner-radius,var(--spectrum-textfield-corner-radius)
);box-sizing:border-box;color:var(
--highcontrast-textfield-text-color-default,var(
--mod-textfield-text-color-default,var(--spectrum-textfield-text-color-default)
)
);font-family:var(
--mod-textfield-font-family,var(--spectrum-textfield-font-family)
);font-size:var(
--mod-textfield-placeholder-font-size,var(--spectrum-textfield-placeholder-font-size)
);font-weight:var(
--mod-textfield-font-weight,var(--spectrum-textfield-font-weight)
);grid-area:2/1/auto/span 2;inline-size:100%;line-height:var(--spectrum-textfield-input-line-height);margin:0;min-inline-size:var(
--mod-textfield-min-width,var(--spectrum-textfield-min-width)
);outline:none;overflow:visible;padding-block-end:calc(var(
--mod-textfield-spacing-block-end,
var(--spectrum-textfield-spacing-block-end)
) - var(
--mod-textfield-border-width,
var(--spectrum-textfield-border-width)
));padding-block-start:calc(var(
--mod-textfield-spacing-block-start,
var(--spectrum-textfield-spacing-block-start)
) - var(
--mod-textfield-border-width,
var(--spectrum-textfield-border-width)
));padding-inline:calc(var(
--mod-textfield-spacing-inline,
var(--spectrum-textfield-spacing-inline)
) - var(
--mod-textfield-border-width,
var(--spectrum-textfield-border-width)
));text-indent:0;text-overflow:ellipsis;transition:border-color var(
--mod-texfield-animation-duration,var(--spectrum-texfield-animation-duration)
) ease-in-out;vertical-align:top}:host([quiet]) .icon-workflow~.input{padding-inline-start:calc(var(
--mod--Textfield-workflow-icon-gap,
var(--spectrum-Textfield-workflow-icon-gap)
) + var(
--mod-Textfield-workflow-icon-width,
var(--spectrum-Textfield-workflow-icon-width)
))}.input::-ms-clear{block-size:0;inline-size:0}.input::-webkit-inner-spin-button,.input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.input:-moz-ui-invalid{box-shadow:none}.input::placeholder{color:var(
--highcontrast-textfield-text-color-default,var(
--mod-textfield-text-color-default,var(--spectrum-textfield-text-color-default)
)
);font-family:var(
--mod-textfield-font-family,var(--spectrum-textfield-font-family)
);font-size:var(
--mod-textfield-placeholder-font-size,var(--spectrum-textfield-placeholder-font-size)
);font-weight:var(
--mod-textfield-font-weight,var(--spectrum-textfield-font-weight)
);opacity:1;transition:color var(
--mod-texfield-animation-duration,var(--spectrum-texfield-animation-duration)
) ease-in-out}.input:lang(ja)::placeholder,.input:lang(ko)::placeholder,.input:lang(zh)::placeholder{font-style:normal}.input:lang(ja)::-moz-placeholder,.input:lang(ko)::-moz-placeholder,.input:lang(zh)::-moz-placeholder{font-style:normal}#textfield:hover .input,.input:hover{border-color:var(
--highcontrast-textfield-border-color-hover,var(
--mod-textfield-border-color-hover,var(--spectrum-textfield-border-color-hover)
)
);color:var(
--highcontrast-textfield-text-color-hover,var(
--mod-textfield-text-color-hover,var(--spectrum-textfield-text-color-hover)
)
)}#textfield:hover .input::placeholder,.input:hover::placeholder{color:var(
--highcontrast-textfield-text-color-hover,var(
--mod-textfield-text-color-hover,var(--spectrum-textfield-text-color-hover)
)
)}.input:focus,:host([focused]) .input{border-color:var(
--highcontrast-textfield-border-color-focus,var(
--mod-textfield-border-color-focus,var(--spectrum-textfield-border-color-focus)
)
);color:var(
--highcontrast-textfield-text-color-focus,var(
--mod-textfield-text-color-focus,var(--spectrum-textfield-text-color-focus)
)
)}.input:focus::placeholder,:host([focused]) .input::placeholder{color:var(
--highcontrast-textfield-text-color-focus,var(
--mod-textfield-text-color-focus,var(--spectrum-textfield-text-color-focus)
)
)}.input:focus:hover,:host([focused]) .input:hover{border-color:var(
--highcontrast-textfield-border-color-focus-hover,var(
--mod-textfield-border-color-focus-hover,var(--spectrum-textfield-border-color-focus-hover)
)
);color:var(
--highcontrast-textfield-text-color-focus-hover,var(
--mod-textfield-text-color-focus-hover,var(--spectrum-textfield-text-color-focus-hover)
)
)}.input:focus:hover::placeholder,:host([focused]) .input:hover::placeholder{color:var(
--highcontrast-textfield-text-color-focus-hover,var(
--mod-textfield-text-color-focus-hover,var(--spectrum-textfield-text-color-focus-hover)
)
)}.input.focus-visible,:host([focused]) .input{border-color:var(
--highcontrast-textfield-border-color-keyboard-focus,var(
--mod-textfield-border-color-keyboard-focus,var(--spectrum-textfield-border-color-keyboard-focus)
)
);color:var(
--highcontrast-textfield-text-color-keyboard-focus,var(
--mod-textfield-text-color-keyboard-focus,var(--spectrum-textfield-text-color-keyboard-focus)
)
);outline:var(
--mod-textfield-focus-indicator-width,var(--spectrum-textfield-focus-indicator-width)
) solid;outline-color:var(
--highcontrast-textfield-focus-indicator-color,var(
--mod-textfield-focus-indicator-color,var(--spectrum-textfield-focus-indicator-color)
)
);outline-offset:var(
--mod-textfield-focus-indicator-gap,var(--spectrum-textfield-focus-indicator-gap)
)}.input.focus-visible,:host([focused]) .input{border-color:var(
--highcontrast-textfield-border-color-keyboard-focus,var(
--mod-textfield-border-color-keyboard-focus,var(--spectrum-textfield-border-color-keyboard-focus)
)
);color:var(
--highcontrast-textfield-text-color-keyboard-focus,var(
--mod-textfield-text-color-keyboard-focus,var(--spectrum-textfield-text-color-keyboard-focus)
)
);outline:var(
--mod-textfield-focus-indicator-width,var(--spectrum-textfield-focus-indicator-width)
) solid;outline-color:var(
--highcontrast-textfield-focus-indicator-color,var(
--mod-textfield-focus-indicator-color,var(--spectrum-textfield-focus-indicator-color)
)
);outline-offset:var(
--mod-textfield-focus-indicator-gap,var(--spectrum-textfield-focus-indicator-gap)
)}.input:focus-visible,:host([focused]) .input{border-color:var(
--highcontrast-textfield-border-color-keyboard-focus,var(
--mod-textfield-border-color-keyboard-focus,var(--spectrum-textfield-border-color-keyboard-focus)
)
);color:var(
--highcontrast-textfield-text-color-keyboard-focus,var(
--mod-textfield-text-color-keyboard-focus,var(--spectrum-textfield-text-color-keyboard-focus)
)
);outline:var(
--mod-textfield-focus-indicator-width,var(--spectrum-textfield-focus-indicator-width)
) solid;outline-color:var(
--highcontrast-textfield-focus-indicator-color,var(
--mod-textfield-focus-indicator-color,var(--spectrum-textfield-focus-indicator-color)
)
);outline-offset:var(
--mod-textfield-focus-indicator-gap,var(--spectrum-textfield-focus-indicator-gap)
)}.input.focus-visible::placeholder,:host([focused]) .input::placeholder{color:var(
--highcontrast-textfield-text-color-keyboard-focus,var(
--mod-textfield-text-color-keyboard-focus,var(--spectrum-textfield-text-color-keyboard-focus)
)
)}.input.focus-visible::placeholder,:host([focused]) .input::placeholder{color:var(
--highcontrast-textfield-text-color-keyboard-focus,var(
--mod-textfield-text-color-keyboard-focus,var(--spectrum-textfield-text-color-keyboard-focus)
)
)}.input:focus-visible::placeholder,:host([focused]) .input::placeholder{color:var(
--highcontrast-textfield-text-color-keyboard-focus,var(
--mod-textfield-text-color-keyboard-focus,var(--spectrum-textfield-text-color-keyboard-focus)
)
)}:host([valid]) .input{color:var(
--highcontrast-textfield-text-color-valid,var(
--mod-textfield-text-color-valid,var(--spectrum-textfield-text-color-valid)
)
)}:host([invalid]) .input{border-color:var(
--highcontrast-textfield-border-color-invalid-default,var(
--mod-textfield-border-color-invalid-default,var(--spectrum-textfield-border-color-invalid-default)
)
);color:var(
--highcontrast-textfield-text-color-invalid,var(
--mod-textfield-text-color-invalid,var(--spectrum-textfield-text-color-invalid)
)
)}:host([invalid]) .input:hover,:host([invalid]:hover) .input{border-color:var(
--highcontrast-textfield-border-color-invalid-hover,var(
--mod-textfield-border-color-invalid-hover,var(--spectrum-textfield-border-color-invalid-hover)
)
)}:host([invalid]) .input:focus,:host([invalid]:focus) .input,:host([invalid][focused]) .input{border-color:var(
--highcontrast-textfield-border-color-invalid-focus,var(
--mod-textfield-border-color-invalid-focus,var(--spectrum-textfield-border-color-invalid-focus)
)
)}:host([invalid]) .input:focus:hover,:host([invalid]:focus) .input:hover,:host([invalid][focused]) .input:hover{border-color:var(
--highcontrast-textfield-border-color-invalid-focus-hover,var(
--mod-textfield-border-color-invalid-focus-hover,var(--spectrum-textfield-border-color-invalid-focus-hover)
)
)}:host([invalid]) .input.focus-visible,:host([invalid][focused]) .input{border-color:var(
--highcontrast-textfield-border-color-invalid-keyboard-focus,var(
--mod-textfield-border-color-invalid-keyboard-focus,var(--spectrum-textfield-border-color-invalid-keyboard-focus)
)
)}:host([invalid]) .input.focus-visible,:host([invalid][focused]) .input{border-color:var(
--highcontrast-textfield-border-color-invalid-keyboard-focus,var(
--mod-textfield-border-color-invalid-keyboard-focus,var(--spectrum-textfield-border-color-invalid-keyboard-focus)
)
)}:host([invalid]) .input:focus-visible,:host([invalid][focused]) .input{border-color:var(
--highcontrast-textfield-border-color-invalid-keyboard-focus,var(
--mod-textfield-border-color-invalid-keyboard-focus,var(--spectrum-textfield-border-color-invalid-keyboard-focus)
)
)}.input:disabled,:host([disabled]) #textfield .input,:host([disabled]) #textfield:hover .input{-webkit-text-fill-color:var(
--highcontrast-textfield-text-color-disabled,var(
--mod-textfield-text-color-disabled,var(--spectrum-textfield-text-color-disabled)
)
);background-color:var(
--mod-textfield-background-color-disabled,var(--spectrum-textfield-background-color-disabled)
);border-color:#0000;color:var(
--highcontrast-textfield-text-color-disabled,var(
--mod-textfield-text-color-disabled,var(--spectrum-textfield-text-color-disabled)
)
);opacity:1;resize:none}.input:disabled::placeholder,:host([disabled]) #textfield .input::placeholder,:host([disabled]) #textfield:hover .input::placeholder{color:var(
--highcontrast-textfield-text-color-disabled,var(
--mod-textfield-text-color-disabled,var(--spectrum-textfield-text-color-disabled)
)
)}:host([quiet]) .input{background-color:#0000;border-block-start-width:0;border-inline-width:0;border-radius:0;margin-block-end:var(
--mod-textfield-spacing-block-quiet,var(--spectrum-textfield-spacing-block-quiet)
);outline:none;overflow-y:hidden;padding-block-start:var(
--mod-textfield-spacing-block-start,var(--spectrum-textfield-spacing-block-start)
);padding-inline:var(
--mod-textfield-spacing-inline-quiet,var(--spectrum-textfield-spacing-inline-quiet)
);resize:none}.input:disabled,:host([quiet][disabled]) .input,:host([quiet][disabled]:hover) .input{background-color:#0000;border-color:var(
--mod-textfield-border-color-disabled,var(--spectrum-textfield-border-color-disabled)
);color:var(
--highcontrast-textfield-text-color-disabled,var(
--mod-textfield-text-color-disabled,var(--spectrum-textfield-text-color-disabled)
)
)}.input:disabled::placeholder,:host([quiet][disabled]) .input::placeholder,:host([quiet][disabled]:hover) .input::placeholder{color:var(
--highcontrast-textfield-text-color-disabled,var(
--mod-textfield-text-color-disabled,var(--spectrum-textfield-text-color-disabled)
)
)}.input:read-only,:host([readonly]) #textfield .input,:host([readonly]) #textfield:hover .input{background-color:#0000;border-color:#0000;color:var(
--highcontrast-textfield-text-color-readonly,var(
--mod-textfield-text-color-readonly,var(--spectrum-textfield-text-color-readonly)
)
);outline:none}.input:read-only::placeholder,:host([readonly]) #textfield .input::placeholder,:host([readonly]) #textfield:hover .input::placeholder{background-color:#0000;color:var(
--highcontrast-textfield-text-color-readonly,var(
--mod-textfield-text-color-readonly,var(--spectrum-textfield-text-color-readonly)
)
)}.spectrum-Textfield--sideLabel{grid-template-columns:auto auto auto;grid-template-rows:auto auto}.spectrum-Textfield--sideLabel:after{grid-area:1/2/span 1/span 1}.spectrum-Textfield--sideLabel .spectrum-FieldLabel{grid-area:1/1/span 2/span 1;margin-inline-end:var(
--mod-textfield-label-spacing-inline-side-label,var(--spectrum-textfield-label-spacing-inline-side-label)
)}.spectrum-Textfield--sideLabel .spectrum-Textfield-characterCount{align-items:flex-start;grid-area:1/3/auto/span 1;margin-block-start:var(
--mod-textfield-character-count-spacing-block-side,var(--spectrum-textfield-character-count-spacing-block-side)
);margin-inline-start:var(
--mod-textfield-character-count-spacing-inline-side,var(--spectrum-textfield-character-count-spacing-inline-side)
)}.spectrum-Textfield--sideLabel .spectrum-HelpText{grid-area:2/2/auto/span 1}.spectrum-Textfield--sideLabel .icon,.spectrum-Textfield--sideLabel .input{grid-area:1/2/span 1/span 1}:host([multiline]){--spectrum-textfield-input-line-height:normal}:host([multiline]) .input{min-block-size:var(
--mod-text-area-min-block-size,var(--spectrum-text-area-min-block-size)
);min-inline-size:var(
--mod-text-area-min-inline-size,var(--spectrum-text-area-min-inline-size)
);resize:inherit}:host([multiline][grows]) .input{grid-row:1}:host([multiline][quiet]) .input{min-block-size:var(
--mod-text-area-min-block-size-quiet,var(--spectrum-text-area-min-block-size-quiet)
);overflow-y:hidden;resize:none}@media (forced-colors:active){:host{--highcontrast-textfield-border-color-hover:Highlight;--highcontrast-textfield-border-color-focus:Highlight;--highcontrast-textfield-border-color-keyboard-focus:CanvasText;--highcontrast-textfield-focus-indicator-color:Highlight;--highcontrast-textfield-border-color-invalid-default:Highlight;--highcontrast-textfield-border-color-invalid-hover:Highlight;--highcontrast-textfield-border-color-invalid-focus:Highlight;--highcontrast-textfield-border-color-invalid-keyboard-focus:Highlight;--highcontrast-textfield-text-color-valid:CanvasText;--highcontrast-textfield-text-color-invalid:CanvasText}#textfield .input{--highcontrast-textfield-text-color-default:CanvasText;--highcontrast-textfield-text-color-hover:CanvasText;--highcontrast-textfield-text-color-keyboard-focus:CanvasText;--highcontrast-textfield-text-color-disabled:GrayText;--highcontrast-textfield-text-color-readonly:CanvasText}#textfield .input::placeholder{--highcontrast-textfield-text-color-default:GrayText;--highcontrast-textfield-text-color-hover:GrayText;--highcontrast-textfield-text-color-keyboard-focus:GrayText;--highcontrast-textfield-text-color-disabled:GrayText;--highcontrast-textfield-text-color-readonly:CanvasText}}:host{--spectrum-textfield-border-color:var(
--system-spectrum-textfield-border-color
);--spectrum-textfield-border-color-hover:var(
--system-spectrum-textfield-border-color-hover
);--spectrum-textfield-border-color-focus:var(
--system-spectrum-textfield-border-color-focus
);--spectrum-textfield-border-color-focus-hover:var(
--system-spectrum-textfield-border-color-focus-hover
);--spectrum-textfield-border-color-keyboard-focus:var(
--system-spectrum-textfield-border-color-keyboard-focus
);--spectrum-textfield-border-width:var(
--system-spectrum-textfield-border-width
)}:host{display:inline-flex;flex-direction:column;inline-size:var(--mod-textfield-width,var(--spectrum-textfield-width))}:host([multiline]){resize:both}:host([multiline][readonly]){resize:none}#textfield{inline-size:100%}#textfield,textarea{resize:inherit}.input{min-inline-size:var(--spectrum-textfield-min-width)}:host([focused]) .input{caret-color:var(--swc-test-caret-color);forced-color-adjust:var(--swc-test-forced-color-adjust)}:host([grows]:not([quiet])) #textfield:after{grid-area:unset;min-block-size:calc(var(
--mod-text-area-min-block-size,
var(--spectrum-text-area-min-block-size)
) + var(
--mod-textfield-focus-indicator-gap,
var(--spectrum-textfield-focus-indicator-gap)
)*2)}#sizer{block-size:auto;opacity:0;word-break:break-word}.icon,.icon-workflow{pointer-events:none}:host([multiline]) #textfield{display:inline-grid}:host([multiline]) textarea{transition:box-shadow var(--spectrum-global-animation-duration-100,.13s) ease-in-out,border-color var(--spectrum-global-animation-duration-100,.13s) ease-in-out}:host([multiline]:not([quiet])) #textfield:after{box-shadow:none}:host([multiline][rows]) .input{block-size:auto;resize:none}:host([multiline][rows="1"]) .input{min-block-size:auto}:host([grows]:not([rows])) .input:not(#sizer){height:100%;left:0;overflow:hidden;position:absolute;resize:none;top:0}:host([disabled][quiet]) #textfield .input,:host([disabled][quiet]) #textfield:hover .input,:host([quiet]) .input :disabled{background-color:var(
--spectrum-textfield-m-quiet-texticon-background-color-disabled,var(--spectrum-alias-background-color-transparent)
);border-color:var(
--spectrum-textfield-m-quiet-texticon-border-color-disabled,var(--spectrum-alias-input-border-color-quiet-disabled)
)}:host([disabled]) #textfield .icon.icon-search,:host([readonly]) #textfield .icon.icon-search{color:var(
--highcontrast-textfield-text-color-disabled,var(
--mod-textfield-text-color-disabled,var(--spectrum-textfield-text-color-disabled)
)
)}
`,ya=cn;var nn=Object.defineProperty,ln=Object.getOwnPropertyDescriptor,O=(s,t,e,r)=>{for(var o=r>1?void 0:r?ln(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&nn(t,e,o),o},un=["text","url","tel","email","password"],L=class extends ur(H(U,{noDefaultSize:!0})){constructor(){super(...arguments),this.allowedKeys="",this.focused=!1,this.invalid=!1,this.label="",this.placeholder="",this._type="text",this.grows=!1,this.maxlength=-1,this.minlength=-1,this.multiline=!1,this.readonly=!1,this.rows=-1,this.valid=!1,this._value="",this.quiet=!1,this.required=!1}static get styles(){return[ya,Jt]}get type(){var t;return(t=un.find(e=>e===this._type))!=null?t:"text"}set type(t){let e=this._type;this._type=t,this.requestUpdate("type",e)}set value(t){if(t===this.value)return;let e=this._value;this._value=t,this.requestUpdate("value",e)}get value(){return this._value}get focusElement(){return this.inputElement}setSelectionRange(t,e,r="none"){this.inputElement.setSelectionRange(t,e,r)}select(){this.inputElement.select()}handleInput(t){if(this.allowedKeys&&this.inputElement.value&&!new RegExp(`^[${this.allowedKeys}]*$`,"u").test(this.inputElement.value)){let e=this.inputElement.selectionStart-1;this.inputElement.value=this.value.toString(),this.inputElement.setSelectionRange(e,e);return}this.value=this.inputElement.value}handleChange(){this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}onFocus(){this.focused=!this.readonly&&!0}onBlur(){this.focused=!this.readonly&&!1}renderStateIcons(){return this.invalid?i.html`
                <sp-icon-alert id="invalid" class="icon"></sp-icon-alert>
            `:this.valid?i.html`
                <sp-icon-checkmark100
                    id="valid"
                    class="icon spectrum-UIIcon-Checkmark100"
                ></sp-icon-checkmark100>
            `:i.nothing}get displayValue(){return this.value.toString()}get renderMultiline(){return i.html`
            ${this.grows&&this.rows===-1?i.html`
                      <div id="sizer" class="input" aria-hidden="true">
                          ${this.value}&#8203;
                      </div>
                  `:i.nothing}
            <!-- @ts-ignore -->
            <textarea
                aria-describedby=${this.helpTextId}
                aria-label=${this.label||this.appliedLabel||this.placeholder}
                aria-invalid=${z(this.invalid||void 0)}
                class="input"
                maxlength=${z(this.maxlength>-1?this.maxlength:void 0)}
                minlength=${z(this.minlength>-1?this.minlength:void 0)}
                title=${this.invalid?"":i.nothing}
                pattern=${z(this.pattern)}
                placeholder=${this.placeholder}
                .value=${this.displayValue}
                @change=${this.handleChange}
                @input=${this.handleInput}
                @focus=${this.onFocus}
                @blur=${this.onBlur}
                ?disabled=${this.disabled}
                ?required=${this.required}
                ?readonly=${this.readonly}
                rows=${z(this.rows>-1?this.rows:void 0)}
                autocomplete=${z(this.autocomplete)}
            ></textarea>
        `}get renderInput(){return i.html`
            <!-- @ts-ignore -->
            <input
                type=${this.type}
                aria-describedby=${this.helpTextId}
                aria-label=${this.label||this.appliedLabel||this.placeholder}
                aria-invalid=${z(this.invalid||void 0)}
                class="input"
                title=${this.invalid?"":i.nothing}
                maxlength=${z(this.maxlength>-1?this.maxlength:void 0)}
                minlength=${z(this.minlength>-1?this.minlength:void 0)}
                pattern=${z(this.pattern)}
                placeholder=${this.placeholder}
                .value=${Ao(this.displayValue)}
                @change=${this.handleChange}
                @input=${this.handleInput}
                @focus=${this.onFocus}
                @blur=${this.onBlur}
                ?disabled=${this.disabled}
                ?required=${this.required}
                ?readonly=${this.readonly}
                autocomplete=${z(this.autocomplete)}
            />
        `}renderField(){return i.html`
            ${this.renderStateIcons()}
            ${this.multiline?this.renderMultiline:this.renderInput}
        `}render(){return i.html`
            <div id="textfield">${this.renderField()}</div>
            ${this.renderHelpText(this.invalid)}
        `}update(t){(t.has("value")||t.has("required")&&this.required)&&this.updateComplete.then(()=>{this.checkValidity()}),super.update(t)}checkValidity(){let t=this.inputElement.checkValidity();return(this.required||this.value&&this.pattern)&&((this.disabled||this.multiline)&&this.pattern&&(t=new RegExp(`^${this.pattern}$`,"u").test(this.value.toString())),typeof this.minlength<"u"&&(t=t&&this.value.toString().length>=this.minlength),this.valid=t,this.invalid=!t),t}};O([(0,n.state)()],L.prototype,"appliedLabel",2),O([(0,n.property)({attribute:"allowed-keys"})],L.prototype,"allowedKeys",2),O([(0,n.property)({type:Boolean,reflect:!0})],L.prototype,"focused",2),O([(0,n.query)(".input:not(#sizer)")],L.prototype,"inputElement",2),O([(0,n.property)({type:Boolean,reflect:!0})],L.prototype,"invalid",2),O([(0,n.property)()],L.prototype,"label",2),O([(0,n.property)()],L.prototype,"placeholder",2),O([(0,n.property)({attribute:"type",reflect:!0})],L.prototype,"_type",2),O([(0,n.state)()],L.prototype,"type",1),O([(0,n.property)()],L.prototype,"pattern",2),O([(0,n.property)({type:Boolean,reflect:!0})],L.prototype,"grows",2),O([(0,n.property)({type:Number})],L.prototype,"maxlength",2),O([(0,n.property)({type:Number})],L.prototype,"minlength",2),O([(0,n.property)({type:Boolean,reflect:!0})],L.prototype,"multiline",2),O([(0,n.property)({type:Boolean,reflect:!0})],L.prototype,"readonly",2),O([(0,n.property)({type:Number})],L.prototype,"rows",2),O([(0,n.property)({type:Boolean,reflect:!0})],L.prototype,"valid",2),O([(0,n.property)({type:String})],L.prototype,"value",1),O([(0,n.property)({type:Boolean,reflect:!0})],L.prototype,"quiet",2),O([(0,n.property)({type:Boolean,reflect:!0})],L.prototype,"required",2),O([(0,n.property)({type:String,reflect:!0})],L.prototype,"autocomplete",2);var $e=class extends L{constructor(){super(...arguments),this._value=""}set value(t){if(t===this.value)return;let e=this._value;this._value=t,this.requestUpdate("value",e)}get value(){return this._value}};O([(0,n.property)({type:String})],$e.prototype,"value",1);h();S();h();var mn=i.css`
:host{--spectrum-clear-button-height:var(--spectrum-component-height-100);--spectrum-clear-button-width:var(--spectrum-component-height-100);--spectrum-clear-button-padding:var(
--spectrum-in-field-button-edge-to-fill
);--spectrum-clear-button-icon-color:var(
--spectrum-neutral-content-color-default
);--spectrum-clear-button-icon-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-clear-button-icon-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-clear-button-icon-color-key-focus:var(
--spectrum-neutral-content-color-key-focus
)}:host([size=s]){--spectrum-clear-button-height:var(--spectrum-component-height-75);--spectrum-clear-button-width:var(--spectrum-component-height-75)}:host([size=l]){--spectrum-clear-button-height:var(--spectrum-component-height-200);--spectrum-clear-button-width:var(--spectrum-component-height-200)}:host([size=xl]){--spectrum-clear-button-height:var(--spectrum-component-height-300);--spectrum-clear-button-width:var(--spectrum-component-height-300)}:host .spectrum-ClearButton--quiet{--mod-clear-button-background-color:var(
--spectrum-clear-button-background-color-quiet,transparent
);--mod-clear-button-background-color-hover:var(
--spectrum-clear-button-background-color-hover-quiet,transparent
);--mod-clear-button-background-color-down:var(
--spectrum-clear-button-background-color-down-quiet,transparent
);--mod-clear-button-background-color-key-focus:var(
--spectrum-clear-button-background-color-key-focus-quiet,transparent
)}:host([variant=overBackground]){--mod-clear-button-icon-color:var(
--spectrum-clear-button-icon-color-over-background,var(--spectrum-white)
);--mod-clear-button-icon-color-hover:var(
--spectrum-clear-button-icon-color-hover-over-background,var(--spectrum-white)
);--mod-clear-button-icon-color-down:var(
--spectrum-clear-button-icon-color-down-over-background,var(--spectrum-white)
);--mod-clear-button-icon-color-key-focus:var(
--spectrum-clear-button-icon-color-key-focus-over-background,var(--spectrum-white)
);--mod-clear-button-background-color:var(
--spectrum-clear-button-background-color-over-background,transparent
);--mod-clear-button-background-color-hover:var(
--spectrum-clear-button-background-color-hover-over-background,var(--spectrum-transparent-white-300)
);--mod-clear-button-background-color-down:var(
--spectrum-clear-button-background-color-hover-over-background,var(--spectrum-transparent-white-400)
);--mod-clear-button-background-color-key-focus:var(
--spectrum-clear-button-background-color-hover-over-background,var(--spectrum-transparent-white-300)
)}:host([disabled]){--mod-clear-button-icon-color:var(
--mod-clear-button-icon-color-disabled,var(--spectrum-disabled-content-color)
);--mod-clear-button-icon-color-hover:var(
--spectrum-clear-button-icon-color-hover-disabled,var(--spectrum-disabled-content-color)
);--mod-clear-button-icon-color-down:var(
--spectrum-clear-button-icon-color-down-disabled,var(--spectrum-disabled-content-color)
);--mod-clear-button-background-color:var(
--mod-clear-button-background-color-disabled,transparent
)}:host{background-color:var(--mod-clear-button-background-color,transparent);block-size:var(
--mod-clear-button-height,var(--spectrum-clear-button-height)
);border:none;border-radius:100%;color:var(
--mod-clear-button-icon-color,var(--spectrum-clear-button-icon-color)
);cursor:pointer;inline-size:var(
--mod-clear-button-width,var(--spectrum-clear-button-width)
);margin:0;padding:var(
--mod-clear-button-padding,var(--spectrum-clear-button-padding)
)}.icon{margin-block:0;margin-inline:auto}:host(:hover){color:var(
--highcontrast-clear-button-icon-color-hover,var(
--mod-clear-button-icon-color-hover,var(--spectrum-clear-button-icon-color-hover)
)
)}:host(:hover) .fill{background-color:var(
--mod-clear-button-background-color-hover,var(--spectrum-clear-button-background-color-hover)
)}:host([active]){color:var(
--mod-clear-button-icon-color-down,var(--spectrum-clear-button-icon-color-down)
)}:host([active]) .fill{background-color:var(
--mod-clear-button-background-color-down,var(--spectrum-clear-button-background-color-down)
)}:host(.focus-visible),:host:focus-within{color:var(
--mod-clear-button-icon-color-key-focus,var(--spectrum-clear-button-icon-color-key-focus)
)}:host(.focus-visible),:host:focus-within{color:var(
--mod-clear-button-icon-color-key-focus,var(--spectrum-clear-button-icon-color-key-focus)
)}:host(:focus-visible),:host:focus-within{color:var(
--mod-clear-button-icon-color-key-focus,var(--spectrum-clear-button-icon-color-key-focus)
)}:host(.focus-visible) .fill,:host:focus-within .fill{background-color:var(
--mod-clear-button-background-color-key-focus,var(--spectrum-clear-button-background-color-key-focus)
)}:host(.focus-visible) .fill,:host:focus-within .fill{background-color:var(
--mod-clear-button-background-color-key-focus,var(--spectrum-clear-button-background-color-key-focus)
)}:host(:focus-visible) .fill,:host:focus-within .fill{background-color:var(
--mod-clear-button-background-color-key-focus,var(--spectrum-clear-button-background-color-key-focus)
)}.fill{align-items:center;background-color:var(
--mod-clear-button-background-color,var(--spectrum-clear-button-background-color)
);block-size:100%;border-radius:100%;display:flex;inline-size:100%;justify-content:center}:host([variant=overBackground].focus-visible){outline:none}:host([variant=overBackground].focus-visible){outline:none}:host([variant=overBackground]:focus-visible){outline:none}@media (forced-colors:active){:host:not(:disabled){--highcontrast-clear-button-icon-color-hover:Highlight}}:host{--spectrum-clear-button-background-color:var(
--system-spectrum-clearbutton-spectrum-clear-button-background-color
);--spectrum-clear-button-background-color-hover:var(
--system-spectrum-clearbutton-spectrum-clear-button-background-color-hover
);--spectrum-clear-button-background-color-down:var(
--system-spectrum-clearbutton-spectrum-clear-button-background-color-down
);--spectrum-clear-button-background-color-key-focus:var(
--system-spectrum-clearbutton-spectrum-clear-button-background-color-key-focus
)}
`,xa=mn;var pn=Object.defineProperty,dn=Object.getOwnPropertyDescriptor,hn=(s,t,e,r)=>{for(var o=r>1?void 0:r?dn(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&pn(t,e,o),o},gn={s:()=>i.html`
        <sp-icon-cross75
            slot="icon"
            class="icon spectrum-UIIcon-Cross75"
        ></sp-icon-cross75>
    `,m:()=>i.html`
        <sp-icon-cross100
            slot="icon"
            class="icon spectrum-UIIcon-Cross100"
        ></sp-icon-cross100>
    `,l:()=>i.html`
        <sp-icon-cross200
            slot="icon"
            class="icon spectrum-UIIcon-Cross200"
        ></sp-icon-cross200>
    `,xl:()=>i.html`
        <sp-icon-cross300
            slot="icon"
            class="icon spectrum-UIIcon-Cross300"
        ></sp-icon-cross300>
    `},Be=class extends H(ee,{noDefaultSize:!0}){constructor(){super(...arguments),this.variant=""}static get styles(){return[...super.styles,xa,or]}get buttonContent(){return[gn[this.size]()]}render(){return i.html`
            <div class="fill">${super.render()}</div>
        `}};hn([(0,n.property)({reflect:!0})],Be.prototype,"variant",2);P();b("sp-clear-button",Be);h();var ka=({width:s=24,height:t=24,hidden:e=!1,title:r="Magnify"}={})=>oe`<svg
    xmlns="http://www.w3.org/2000/svg"
    height=${t}
    viewBox="0 0 36 36"
    width=${s}
    aria-hidden=${e?"true":"false"}
    role="img"
    fill="currentColor"
    aria-label=${r}
  >
    <path
      d="M33.173 30.215 25.4 22.443a12.826 12.826 0 1 0-2.957 2.957l7.772 7.772a2.1 2.1 0 0 0 2.958-2.958ZM6 15a9 9 0 1 1 9 9 9 9 0 0 1-9-9Z"
    />
  </svg>`;var jr=class extends T{render(){return se(i.html),ka({hidden:!this.label,title:this.label})}};P();b("sp-icon-magnify",jr);h();var bn=i.css`
:host{--spectrum-search-inline-size:var(--spectrum-field-width);--spectrum-search-block-size:var(--spectrum-component-height-100);--spectrum-search-button-inline-size:var(--spectrum-search-block-size);--spectrum-search-min-inline-size:calc(var(--spectrum-search-field-minimum-width-multiplier)*var(--spectrum-search-block-size));--spectrum-search-icon-size:var(--spectrum-workflow-icon-size-100);--spectrum-search-text-to-icon:var(--spectrum-text-to-visual-100);--spectrum-search-to-help-text:var(--spectrum-help-text-to-component);--spectrum-search-top-to-text:var(--spectrum-component-top-to-text-100);--spectrum-search-bottom-to-text:var(
--spectrum-component-bottom-to-text-100
);--spectrum-search-focus-indicator-thickness:var(
--spectrum-focus-indicator-thickness
);--spectrum-search-focus-indicator-gap:var(--spectrum-focus-indicator-gap);--spectrum-search-focus-indicator-color:var(
--spectrum-focus-indicator-color
);--spectrum-search-font-family:var(--spectrum-sans-font-family-stack);--spectrum-search-font-weight:var(--spectrum-regular-font-weight);--spectrum-search-font-style:var(--spectrum-default-font-style);--spectrum-search-line-height:var(--spectrum-line-height-100);--spectrum-search-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-search-color-hover:var(--spectrum-neutral-content-color-hover);--spectrum-search-color-focus:var(--spectrum-neutral-content-color-focus);--spectrum-search-color-focus-hover:var(
--spectrum-neutral-content-color-focus-hover
);--spectrum-search-color-key-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-search-border-width:var(--spectrum-border-width-100);--spectrum-search-background-color:var(--spectrum-gray-50);--spectrum-search-color-disabled:var(--spectrum-disabled-content-color);--spectrum-search-background-color-disabled:var(
--spectrum-disabled-background-color
);--spectrum-search-border-color-disabled:var(
--spectrum-disabled-background-color
);--mod-textfield-font-family:var(
--mod-search-font-family,var(--spectrum-search-font-family)
);--mod-textfield-font-weight:var(
--mod-search-font-weight,var(--spectrum-search-font-weight)
);--mod-textfield-corner-radius:var(
--mod-search-border-radius,var(--spectrum-search-border-radius)
);--mod-textfield-border-width:var(
--mod-search-border-width,var(--spectrum-search-border-width)
);--mod-textfield-focus-indicator-gap:var(
--mod-search-focus-indicator-gap,var(--spectrum-search-focus-indicator-gap)
);--mod-textfield-focus-indicator-width:var(
--mod-search-focus-indicator-thickness,var(--spectrum-search-focus-indicator-thickness)
);--mod-textfield-focus-indicator-color:var(
--mod-search-focus-indicator-color,var(--spectrum-search-focus-indicator-color)
);--mod-textfield-text-color-default:var(
--mod-search-color-default,var(--spectrum-search-color-default)
);--mod-textfield-text-color-hover:var(
--mod-search-color-hover,var(--spectrum-search-color-hover)
);--mod-textfield-text-color-focus:var(
--mod-search-color-focus,var(--spectrum-search-color-focus)
);--mod-textfield-text-color-focus-hover:var(
--mod-search-color-focus-hover,var(--spectrum-search-color-focus-hover)
);--mod-textfield-text-color-keyboard-focus:var(
--mod-search-color-key-focus,var(--spectrum-search-color-key-focus)
);--mod-textfield-text-color-disabled:var(
--mod-search-color-disabled,var(--spectrum-search-color-disabled)
);--mod-textfield-border-color:var(
--mod-search-border-color-default,var(--spectrum-search-border-color-default)
);--mod-textfield-border-color-hover:var(
--mod-search-border-color-hover,var(--spectrum-search-border-color-hover)
);--mod-textfield-border-color-focus:var(
--mod-search-border-color-focus,var(--spectrum-search-border-color-focus)
);--mod-textfield-border-color-focus-hover:var(
--mod-search-border-color-focus-hover,var(--spectrum-search-border-color-focus-hover)
);--mod-textfield-border-color-keyboard-focus:var(
--mod-search-border-color-key-focus,var(--spectrum-search-border-color-key-focus)
);--mod-textfield-border-color-disabled:var(
--mod-search-border-color-disabled,var(--spectrum-search-border-color-disabled)
);--mod-textfield-background-color:var(
--mod-search-background-color,var(--spectrum-search-background-color)
);--mod-textfield-background-color-disabled:var(
--mod-search-background-color-disabled,var(--spectrum-search-background-color-disabled)
)}:host([size=s]){--spectrum-search-block-size:var(--spectrum-component-height-75);--spectrum-search-icon-size:var(--spectrum-workflow-icon-size-75);--spectrum-search-text-to-icon:var(--spectrum-text-to-visual-75)}:host([size=l]){--spectrum-search-block-size:var(--spectrum-component-height-200);--spectrum-search-icon-size:var(--spectrum-workflow-icon-size-200);--spectrum-search-text-to-icon:var(--spectrum-text-to-visual-200)}:host([size=xl]){--spectrum-search-block-size:var(--spectrum-component-height-300);--spectrum-search-icon-size:var(--spectrum-workflow-icon-size-300);--spectrum-search-text-to-icon:var(--spectrum-text-to-visual-300)}:host([quiet]){--spectrum-search-quiet-button-offset:calc(var(--mod-search-block-size, var(--spectrum-search-block-size))/2 - var(
--mod-workflow-icon-size-100,
var(--spectrum-workflow-icon-size-100)
)/2);--spectrum-search-background-color:transparent;--spectrum-search-background-color-disabled:transparent;--spectrum-search-border-color-disabled:var(
--spectrum-disabled-border-color
)}:host([quiet]) #textfield{--spectrum-search-border-radius:0;--spectrum-search-edge-to-visual:var(
--spectrum-field-edge-to-visual-quiet
)}@media (forced-colors:active){#textfield #textfield,#textfield #textfield .input{--highcontrast-search-color-default:CanvasText;--highcontrast-search-color-hover:CanvasText;--highcontrast-search-color-focus:CanvasText;--highcontrast-search-color-disabled:GrayText}#textfield #button .spectrum-ClearButton-fill{background-color:#0000;forced-color-adjust:none}}#textfield{display:inline-block;inline-size:var(
--mod-search-inline-size,var(--spectrum-search-inline-size)
);min-inline-size:var(
--mod-search-min-inline-size,var(--spectrum-search-min-inline-size)
);position:relative}#textfield .spectrum-HelpText{margin-block-start:var(
--mod-search-to-help-text,var(--spectrum-search-to-help-text)
)}#button{inset-block-start:0;inset-inline-end:0;position:absolute}#button,#button .spectrum-ClearButton-fill{border-radius:var(
--mod-search-border-radius,var(--spectrum-search-border-radius)
)}#textfield.is-disabled #button{display:none}#textfield{inline-size:100%}.icon-search{--spectrum-search-color:var(
--highcontrast-search-color-default,var(--mod-search-color-default,var(--spectrum-search-color-default))
);color:var(--spectrum-search-color);display:block;inset-block:0;margin-block:auto;position:absolute}#textfield:hover .icon-search{--spectrum-search-color:var(
--highcontrast-search-color-hover,var(--mod-search-color-hover,var(--spectrum-search-color-hover))
)}#textfield.is-focused .icon-search{--spectrum-search-color:var(
--highcontrast-search-color-focus,var(--mod-search-color-focus,var(--spectrum-search-color-focus))
)}#textfield.is-focused:hover .icon-search{--spectrum-search-color:var(
--highcontrast-search-color-focus,var(
--mod-search-color-focus-hover,var(--spectrum-search-color-focus-hover)
)
)}#textfield.is-keyboardFocused .icon-search{--spectrum-search-color:var(
--highcontrast-search-color-focus,var(
--mod-search-color-key-focus,var(--spectrum-search-color-key-focus)
)
)}#textfield.is-disabled .icon-search,#textfield.is-disabled:hover .icon-search{--spectrum-search-color:var(
--highcontrast-search-color-disabled,var(--mod-search-color-disabled,var(--spectrum-search-color-disabled))
)}.input{-webkit-appearance:none;block-size:var(--mod-search-block-size,var(--spectrum-search-block-size));font-style:var(--mod-search-font-style,var(--spectrum-search-font-style));line-height:var(
--mod-search-line-height,var(--spectrum-search-line-height)
);padding-block-end:calc(var(--mod-search-bottom-to-text, var(--spectrum-search-bottom-to-text)) - var(--mod-search-border-width, var(--spectrum-search-border-width)));padding-block-start:calc(var(--mod-search-top-to-text, var(--spectrum-search-top-to-text)) - var(--mod-search-border-width, var(--spectrum-search-border-width)))}.input::-webkit-search-cancel-button,.input::-webkit-search-decoration{-webkit-appearance:none}:host(:not([quiet])) #textfield .icon-search{inset-inline-start:var(
--mod-search-edge-to-visual,var(--spectrum-search-edge-to-visual)
)}:host(:not([quiet])) #textfield .input{padding-inline-end:calc(var(
--mod-search-button-inline-size,
var(--spectrum-search-button-inline-size)
) - var(--mod-search-border-width, var(--spectrum-search-border-width)));padding-inline-start:calc(var(--mod-search-edge-to-visual, var(--spectrum-search-edge-to-visual)) - var(--mod-search-border-width, var(--spectrum-search-border-width)) + var(--mod-search-icon-size, var(--spectrum-search-icon-size)) + var(--mod-search-text-to-icon, var(--spectrum-search-text-to-icon)))}:host([quiet]) #button{transform:translateX(var(
--mod-search-quiet-button-offset,var(--spectrum-search-quiet-button-offset)
))}:host([quiet]) #textfield .input{border-radius:var(
--mod-search-border-radius,var(--spectrum-search-border-radius)
);padding-block-start:var(
--mod-search-top-to-text,var(--spectrum-search-top-to-text)
);padding-inline-end:calc(var(
--mod-search-button-inline-size,
var(--spectrum-search-button-inline-size)
) - var(
--mod-search-quiet-button-offset,
var(--spectrum-search-quiet-button-offset)
));padding-inline-start:calc(var(--mod-search-edge-to-visual, var(--spectrum-search-edge-to-visual)) + var(--mod-search-icon-size, var(--spectrum-search-icon-size)) + var(--mod-search-text-to-icon, var(--spectrum-search-text-to-icon)))}:host{--spectrum-search-border-radius:var(
--system-spectrum-search-border-radius
);--spectrum-search-edge-to-visual:var(
--system-spectrum-search-edge-to-visual
);--spectrum-search-border-color-default:var(
--system-spectrum-search-border-color-default
);--spectrum-search-border-color-hover:var(
--system-spectrum-search-border-color-hover
);--spectrum-search-border-color-focus:var(
--system-spectrum-search-border-color-focus
);--spectrum-search-border-color-focus-hover:var(
--system-spectrum-search-border-color-focus-hover
);--spectrum-search-border-color-key-focus:var(
--system-spectrum-search-border-color-key-focus
)}:host([size=s]){--spectrum-search-border-radius:var(
--system-spectrum-search-sizes-border-radius
);--spectrum-search-edge-to-visual:var(
--system-spectrum-search-sizes-edge-to-visual
)}:host{--spectrum-search-border-radius:var(
--system-spectrum-search-sizem-border-radius
);--spectrum-search-edge-to-visual:var(
--system-spectrum-search-sizem-edge-to-visual
)}:host([size=l]){--spectrum-search-border-radius:var(
--system-spectrum-search-sizel-border-radius
);--spectrum-search-edge-to-visual:var(
--system-spectrum-search-sizel-edge-to-visual
)}:host([size=xl]){--spectrum-search-border-radius:var(
--system-spectrum-search-sizexl-border-radius
);--spectrum-search-edge-to-visual:var(
--system-spectrum-search-sizexl-edge-to-visual
)}:host{--mod-textfield-spacing-inline:var(
--spectrum-alias-infieldbutton-full-height-m
);--mod-clear-button-padding:0}input::-webkit-search-cancel-button{display:none}:host([size=s]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-s
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-s
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-75
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-75
)}:host([size=l]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-l
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-l
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-200
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-200
)}:host([size=xl]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-xl
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-xl
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-300
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-300
)}@media (forced-colors:active){sp-clear-button{--spectrum-clearbutton-fill-background-color:transparent;--spectrum-clearbutton-fill-background-color-disabled:transparent;--spectrum-clearbutton-fill-background-color-down:transparent;--spectrum-clearbutton-fill-background-color-hover:transparent;--spectrum-clearbutton-fill-background-color-key-focus:transparent}}
`,wa=bn;var vn=Object.defineProperty,fn=Object.getOwnPropertyDescriptor,Fe=(s,t,e,r)=>{for(var o=r>1?void 0:r?fn(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&vn(t,e,o),o},yn=s=>s.stopPropagation(),It=class extends $e{constructor(){super(...arguments),this.action="",this.label="Search",this.placeholder="Search"}static get styles(){return[...super.styles,wa]}handleSubmit(t){this.dispatchEvent(new Event("submit",{cancelable:!0,bubbles:!0}))||t.preventDefault()}handleKeydown(t){let{code:e}=t;!this.value||e!=="Escape"||this.reset()}async reset(){this.value="",await this.updateComplete,this.focusElement.dispatchEvent(new InputEvent("input",{bubbles:!0,composed:!0})),this.focusElement.dispatchEvent(new InputEvent("change",{bubbles:!0}))}renderField(){return i.html`
            <form
                action=${this.action}
                id="form"
                method=${z(this.method)}
                @submit=${this.handleSubmit}
                @reset=${this.reset}
                @keydown=${this.handleKeydown}
            >
                <sp-icon-magnify
                    class="icon magnifier icon-workflow icon-search"
                ></sp-icon-magnify>
                ${super.renderField()}
                ${this.value?i.html`
                          <sp-clear-button
                              id="button"
                              label="Reset"
                              tabindex="-1"
                              type="reset"
                              size=${z(this.size)}
                              @keydown=${yn}
                          ></sp-clear-button>
                      `:i.nothing}
            </form>
        `}firstUpdated(t){super.firstUpdated(t),this.inputElement.setAttribute("type","search")}willUpdate(){this.multiline=!1}};Fe([(0,n.property)()],It.prototype,"action",2),Fe([(0,n.property)()],It.prototype,"label",2),Fe([(0,n.property)()],It.prototype,"method",2),Fe([(0,n.property)()],It.prototype,"placeholder",2),Fe([(0,n.query)("#form")],It.prototype,"form",2);P();b("sp-search",It);h();S();tt();Ee();Ft();h();var xn=i.css`
#list{--spectrum-sidenav-focus-ring-size:var(
--spectrum-focus-indicator-thickness
);--spectrum-sidenav-focus-ring-gap:var(--spectrum-focus-indicator-gap);--spectrum-sidenav-focus-ring-color:var(--spectrum-focus-indicator-color);--spectrum-sidenav-min-height:var(--spectrum-component-height-100);--spectrum-sidenav-width:100%;--spectrum-sidenav-min-width:var(--spectrum-side-navigation-minimum-width);--spectrum-sidenav-max-width:var(--spectrum-side-navigation-maximum-width);--spectrum-sidenav-border-radius:var(--spectrum-corner-radius-100);--spectrum-sidenav-icon-size:var(--spectrum-workflow-icon-size-100);--spectrum-sidenav-icon-spacing:var(--spectrum-text-to-visual-100);--spectrum-sidenav-inline-padding:var(
--spectrum-component-edge-to-text-100
);--spectrum-sidenav-gap:var(--spectrum-side-navigation-item-to-item);--spectrum-sidenav-top-to-icon:var(
--spectrum-component-top-to-workflow-icon-100
);--spectrum-sidenav-top-to-label:var(--spectrum-component-top-to-text-100);--spectrum-sidenav-bottom-to-label:var(
--spectrum-side-navigation-bottom-to-text
);--spectrum-sidenav-start-to-content-second-level:var(
--spectrum-side-navigation-second-level-edge-to-text
);--spectrum-sidenav-start-to-content-third-level:var(
--spectrum-side-navigation-third-level-edge-to-text
);--spectrum-sidenav-start-to-content-with-icon-second-level:var(
--spectrum-side-navigation-with-icon-second-level-edge-to-text
);--spectrum-sidenav-start-to-content-with-icon-third-level:var(
--spectrum-side-navigation-with-icon-third-level-edge-to-text
);--spectrum-sidenav-background-disabled:transparent;--spectrum-sidenav-background-default:transparent;--spectrum-sidenav-background-hover:var(--spectrum-gray-200);--spectrum-sidenav-item-background-down:var(--spectrum-gray-300);--spectrum-sidenav-background-key-focus:var(--spectrum-gray-200);--spectrum-sidenav-item-background-default-selected:var(
--spectrum-gray-200
);--spectrum-sidenav-background-hover-selected:var(--spectrum-gray-300);--spectrum-sidenav-item-background-down-selected:var(--spectrum-gray-300);--spectrum-sidenav-background-key-focus-selected:var(--spectrum-gray-200);--spectrum-sidenav-header-color:var(--spectrum-gray-600);--spectrum-sidenav-content-disabled-color:var(
--spectrum-disabled-content-color
);--spectrum-sidenav-content-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-sidenav-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-sidenav-content-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-sidenav-content-color-key-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-sidenav-content-color-default-selected:var(
--spectrum-neutral-content-color-default
);--spectrum-sidenav-content-color-hover-selected:var(
--spectrum-neutral-content-color-hover
);--spectrum-sidenav-content-color-down-selected:var(
--spectrum-neutral-content-color-down
);--spectrum-sidenav-content-color-key-focus-selected:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-sidenav-text-font-family:var(--spectrum-sans-font-family-stack);--spectrum-sidenav-text-font-weight:var(--spectrum-regular-font-weight);--spectrum-sidenav-text-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-text-font-size:var(--spectrum-font-size-100);--spectrum-sidenav-text-line-height:var(--spectrum-line-height-100);--spectrum-sidenav-top-level-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-sidenav-top-level-font-weight:var(--spectrum-bold-font-weight);--spectrum-sidenav-top-level-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-top-level-font-size:var(--spectrum-font-size-100);--spectrum-sidenav-top-level-line-height:var(--spectrum-line-height-100);--spectrum-sidenav-header-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-sidenav-header-font-weight:var(--spectrum-medium-font-weight);--spectrum-sidenav-header-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-header-font-size:var(--spectrum-font-size-75);--spectrum-sidenav-header-line-height:var(--spectrum-line-height-100)}#list:lang(ja),#list:lang(ko),#list:lang(zh){--spectrum-sidenav-text-line-height:var(--spectrum-cjk-line-height-100)}#list:lang(ja),#list:lang(ko),#list:lang(zh){--spectrum-sidenav-top-level-line-height:var(
--spectrum-cjk-line-height-100
)}#list:lang(ja),#list:lang(ko),#list:lang(zh){--spectrum-sidenav-header-line-height:var(--spectrum-cjk-line-height-100)}#list{display:flex;flex-direction:column;list-style-type:none;margin:0;padding:0}:host{list-style-type:none;margin-inline:0}:host([selected]) #item-link{background-color:var(
--highcontrast-sidenav-item-background-default-selected,var(
--mod-sidenav-item-background-default-selected,var(--spectrum-sidenav-item-background-default-selected)
)
);color:var(
--highcontrast-sidenav-content-color-default-selected,var(
--mod-sidenav-content-color-default-selected,var(--spectrum-sidenav-content-color-default-selected)
)
)}:host([selected]) #item-link:hover{background-color:var(
--highcontrast-sidenav-background-hover-selected,var(
--mod-sidenav-background-hover-selected,var(--spectrum-sidenav-background-hover-selected)
)
);color:var(
--mod-sidenav-content-color-hover-selected,var(--spectrum-sidenav-content-color-hover-selected)
)}:host([selected]) #item-link:active{background-color:var(
--highcontrast-sidenav-item-background-down-selected,var(
--mod-sidenav-item-background-down-selected,var(--spectrum-sidenav-item-background-down-selected)
)
);color:var(
--mod-sidenav-content-color-down-selected,var(--spectrum-sidenav-content-color-down-selected)
)}:host([selected]) #item-link.focus-visible,:host([selected]) #item-link.is-keyboardFocused{background-color:var(
--highcontrast-sidenav-background-key-focus-selected,var(
--mod-sidenav-background-key-focus-selected,var(--spectrum-sidenav-background-key-focus-selected)
)
);color:var(
--mod-sidenav-content-color-key-focus-selected,var(--spectrum-sidenav-content-color-key-focus-selected)
)}:host([selected]) #item-link.is-keyboardFocused,:host([selected]) #item-link:focus-visible{background-color:var(
--highcontrast-sidenav-background-key-focus-selected,var(
--mod-sidenav-background-key-focus-selected,var(--spectrum-sidenav-background-key-focus-selected)
)
);color:var(
--mod-sidenav-content-color-key-focus-selected,var(--spectrum-sidenav-content-color-key-focus-selected)
)}:host([disabled]) #item-link{background-color:var(
--highcontrast-sidenav-background-disabled,var(
--mod-sidenav-background-disabled,var(--spectrum-sidenav-background-disabled)
)
);color:var(
--highcontrast-sidenav-content-disabled-color,var(
--mod-sidenav-content-disabled-color,var(--spectrum-sidenav-content-disabled-color)
)
);cursor:default;pointer-events:none}#item-link{background-color:var(
--highcontrast-sidenav-background-default,var(
--mod-sidenav-background-default,var(--spectrum-sidenav-background-default)
)
);border-radius:var(
--mod-sidenav-border-radius,var(--spectrum-sidenav-border-radius)
);box-sizing:border-box;color:var(
--highcontrast-sidenav-content-color-default,var(
--mod-sidenav-content-color-default,var(--spectrum-sidenav-content-color-default)
)
);cursor:pointer;display:inline-flex;font-family:var(
--mod-sidenav-text-font-family,var(--spectrum-sidenav-text-font-family)
);font-size:var(
--mod-sidenav-text-font-size,var(--spectrum-sidenav-text-font-size)
);font-style:var(
--mod-sidenav-text-font-style,var(--spectrum-sidenav-text-font-style)
);font-weight:var(
--mod-sidenav-text-font-weight,var(--spectrum-sidenav-text-font-weight)
);-webkit-hyphens:auto;hyphens:auto;inline-size:var(--mod-sidenav-width,var(--spectrum-sidenav-width));line-height:var(
--mod-sidenav-text-line-height,var(--spectrum-sidenav-text-line-height)
);margin-block-end:var(--mod-sidenav-gap,var(--spectrum-sidenav-gap));max-inline-size:var(
--mod-sidenav-max-width,var(--spectrum-sidenav-max-width)
);min-block-size:var(
--mod-sidenav-min-height,var(--spectrum-sidenav-min-height)
);min-inline-size:var(
--mod-sidenav-min-width,var(--spectrum-sidenav-min-width)
);padding-inline:var(
--mod-sidenav-inline-padding,var(--spectrum-sidenav-inline-padding)
);position:relative;-webkit-text-decoration:none;text-decoration:none;transition:background-color var(--spectrum-animation-duration-100) ease-out,color var(--spectrum-animation-duration-100) ease-out;word-break:break-word}#item-link #link-text{margin-block-end:var(
--mod-sidenav-bottom-to-label,var(--spectrum-sidenav-bottom-to-label)
);margin-block-start:var(
--mod-sidenav-top-to-label,var(--spectrum-sidenav-top-to-label)
)}#item-link ::slotted([slot=icon]){block-size:var(--spectrum-sidenav-icon-size);flex-shrink:0;inline-size:var(--spectrum-sidenav-icon-size);margin-block-start:var(--spectrum-sidenav-top-to-icon);margin-inline-end:var(--spectrum-sidenav-icon-spacing)}#item-link:hover{background-color:var(
--highcontrast-sidenav-background-hover,var(
--mod-sidenav-background-hover,var(--spectrum-sidenav-background-hover)
)
);color:var(
--highcontrast-sidenav-content-color-hover,var(
--mod-sidenav-content-color-hover,var(--spectrum-sidenav-content-color-hover)
)
)}#item-link:active{background-color:var(
--highcontrast-sidenav-item-background-down,var(
--mod-sidenav-item-background-down,var(--spectrum-sidenav-item-background-down)
)
);color:var(
--highcontrast-sidenav-content-color-down,var(
--mod-sidenav-content-color-down,var(--spectrum-sidenav-content-color-down)
)
)}#item-link.focus-visible,#item-link.is-keyboardFocused{background-color:var(
--highcontrast-sidenav-background-key-focus,var(
--mod-sidenav-background-key-focus,var(--spectrum-sidenav-background-key-focus)
)
);color:var(
--highcontrast-sidenav-content-color-key-focus,var(
--mod-sidenav-content-color-key-focus,var(--spectrum-sidenav-content-color-key-focus)
)
);outline:var(
--highcontrast-sidenav-focus-ring-color,var(
--mod-sidenav-focus-ring-color,var(--spectrum-sidenav-focus-ring-color)
)
) solid var(
--mod-sidenav-focus-ring-size,var(--spectrum-sidenav-focus-ring-size)
);outline-offset:var(
--mod-sidenav-focus-ring-gap,var(--spectrum-sidenav-focus-ring-gap)
)}#item-link.is-keyboardFocused,#item-link:focus-visible{background-color:var(
--highcontrast-sidenav-background-key-focus,var(
--mod-sidenav-background-key-focus,var(--spectrum-sidenav-background-key-focus)
)
);color:var(
--highcontrast-sidenav-content-color-key-focus,var(
--mod-sidenav-content-color-key-focus,var(--spectrum-sidenav-content-color-key-focus)
)
);outline:var(
--highcontrast-sidenav-focus-ring-color,var(
--mod-sidenav-focus-ring-color,var(--spectrum-sidenav-focus-ring-color)
)
) solid var(
--mod-sidenav-focus-ring-size,var(--spectrum-sidenav-focus-ring-size)
);outline-offset:var(
--mod-sidenav-focus-ring-gap,var(--spectrum-sidenav-focus-ring-gap)
)}@media (forced-colors:active){#list ::slotted([slot=icon]){forced-color-adjust:preserve-parent-color}:host{--highcontrast-sidenav-content-disabled-color:GrayText;--highcontrast-sidenav-focus-ring-color:Highlight;--highcontrast-sidenav-content-color-default-selected:SelectedItemText;--highcontrast-sidenav-item-background-default-selected:SelectedItem;--highcontrast-sidenav-background-key-focus-selected:Highlight;--highcontrast-sidenav-background-hover-selected:Highlight;--highcontrast-sidenav-item-background-down-selected:Highlight;--highcontrast-sidenav-item-background-down:Highlight;--highcontrast-sidenav-background-hover:Highlight;--highcontrast-sidenav-content-color-hover:HighlightText;--highcontrast-sidenav-background-key-focus:Highlight;--highcontrast-sidenav-top-level-font-color:ButtonText;--highcontrast-sidenav-content-color-default:ButtonText;--highcontrast-sidenav-content-color-down:HighlightText;forced-color-adjust:none}}:host{display:block}:host([disabled]){pointer-events:none}:host([multiLevel]){--spectrum-web-component-sidenav-font-weight:var(
--spectrum-sidenav-item-font-weight,700
)}::slotted(sp-sidenav-item:not([multiLevel])){--spectrum-web-component-sidenav-font-weight:var(
--spectrum-sidenav-item-font-weight,400
)}#item-link{font-weight:var(--spectrum-web-component-sidenav-font-weight);justify-content:start}:host([dir=ltr]) #item-link[data-level="1"]{padding-left:calc(var(
--spectrum-sidenav-multilevel-item-indentation-level1,
var(--spectrum-global-dimension-size-150)
) + var(
--spectrum-sidenav-item-padding-x,
var(--spectrum-global-dimension-size-150)
))}:host([dir=ltr]) #item-link[data-level="2"]{padding-left:calc(var(
--spectrum-sidenav-multilevel-item-indentation-level2,
var(--spectrum-global-dimension-size-300)
) + var(
--spectrum-sidenav-item-padding-x,
var(--spectrum-global-dimension-size-150)
))}:host([dir=rtl]) #item-link[data-level="1"]{padding-right:calc(var(
--spectrum-sidenav-multilevel-item-indentation-level1,
var(--spectrum-global-dimension-size-150)
) + var(
--spectrum-sidenav-item-padding-x,
var(--spectrum-global-dimension-size-150)
))}:host([dir=rtl]) #item-link[data-level="2"]{padding-right:calc(var(
--spectrum-sidenav-multilevel-item-indentation-level2,
var(--spectrum-global-dimension-size-300)
) + var(
--spectrum-sidenav-item-padding-x,
var(--spectrum-global-dimension-size-150)
))}a ::slotted(sp-sidenav-item){display:none}
`,Ar=xn;var kn=Object.defineProperty,wn=Object.getOwnPropertyDescriptor,yo=(s,t,e,r)=>{for(var o=r>1?void 0:r?wn(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&kn(t,e,o),o},Dr=class xo extends Qt(U){constructor(){super(...arguments),this.value=void 0,this.selected=!1,this.expanded=!1}static get styles(){return[Ar]}get parentSideNav(){return this._parentSidenav||(this._parentSidenav=this.closest("sp-sidenav")),this._parentSidenav}get hasChildren(){return!!this.querySelector("sp-sidenav-item")}get depth(){let t=0,e=this.parentElement;for(;e instanceof xo;)t++,e=e.parentElement;return t}handleSideNavSelect(t){this.selected=t.target===this}handleClick(t){!this.href&&t&&t.preventDefault(),!this.disabled&&(!this.href||t!=null&&t.defaultPrevented)&&(this.hasChildren?this.expanded=!this.expanded:this.value&&this.announceSelected(this.value))}announceSelected(t){let e={value:t},r=new CustomEvent("sidenav-select",{bubbles:!0,composed:!0,detail:e});this.dispatchEvent(r)}click(){this.handleClick()}get focusElement(){return this.shadowRoot.querySelector("#item-link")}update(t){this.hasAttribute("slot")||(this.slot="descendant"),super.update(t)}render(){return i.html`
            <a
                href=${this.href||"#"}
                target=${z(this.target)}
                download=${z(this.download)}
                rel=${z(this.rel)}
                data-level="${this.depth}"
                @click="${this.handleClick}"
                id="item-link"
                aria-current=${z(this.selected&&this.href?"page":void 0)}
                aria-expanded=${z(this.hasChildren?this.expanded:void 0)}
                aria-controls=${z(this.hasChildren&&this.expanded?"list":void 0)}
            >
                <slot name="icon"></slot>
                <span id="link-text">
                    ${this.label}
                    <slot></slot>
                </span>
            </a>
            ${this.expanded?i.html`
                      <div id="list" aria-labelledby="item-link" role="list">
                          <slot name="descendant"></slot>
                      </div>
                  `:i.nothing}
        `}updated(t){var e;this.hasChildren&&this.expanded&&!this.selected&&(e=this.parentSideNav)!=null&&e.manageTabIndex?this.focusElement.tabIndex=-1:this.focusElement.removeAttribute("tabindex"),super.updated(t)}connectedCallback(){super.connectedCallback(),this.startTrackingSelection()}disconnectedCallback(){this.stopTrackingSelection(),super.disconnectedCallback()}async startTrackingSelection(){let t=this.parentSideNav;if(t&&(await t.updateComplete,t.startTrackingSelectionForItem(this),this.selected=this.value!=null&&this.value===t.value,this.selected===!0&&t.variant==="multilevel")){let e=this.parentElement;for(;e instanceof xo;)e.expanded=!0,e=e.parentElement}}stopTrackingSelection(){let t=this.parentSideNav;t&&t.stopTrackingSelectionForItem(this),this._parentSidenav=void 0}firstUpdated(t){super.firstUpdated(t),this.setAttribute("role","listitem")}};yo([(0,n.property)()],Dr.prototype,"value",2),yo([(0,n.property)({type:Boolean,reflect:!0})],Dr.prototype,"selected",2),yo([(0,n.property)({type:Boolean,reflect:!0})],Dr.prototype,"expanded",2);var Lr=Dr;P();b("sp-sidenav-item",Lr);h();S();h();var zn=i.css`
:host{--spectrum-sidenav-focus-ring-size:var(
--spectrum-focus-indicator-thickness
);--spectrum-sidenav-focus-ring-gap:var(--spectrum-focus-indicator-gap);--spectrum-sidenav-focus-ring-color:var(--spectrum-focus-indicator-color);--spectrum-sidenav-min-height:var(--spectrum-component-height-100);--spectrum-sidenav-width:100%;--spectrum-sidenav-min-width:var(--spectrum-side-navigation-minimum-width);--spectrum-sidenav-max-width:var(--spectrum-side-navigation-maximum-width);--spectrum-sidenav-border-radius:var(--spectrum-corner-radius-100);--spectrum-sidenav-icon-size:var(--spectrum-workflow-icon-size-100);--spectrum-sidenav-icon-spacing:var(--spectrum-text-to-visual-100);--spectrum-sidenav-inline-padding:var(
--spectrum-component-edge-to-text-100
);--spectrum-sidenav-gap:var(--spectrum-side-navigation-item-to-item);--spectrum-sidenav-top-to-icon:var(
--spectrum-component-top-to-workflow-icon-100
);--spectrum-sidenav-top-to-label:var(--spectrum-component-top-to-text-100);--spectrum-sidenav-bottom-to-label:var(
--spectrum-side-navigation-bottom-to-text
);--spectrum-sidenav-start-to-content-second-level:var(
--spectrum-side-navigation-second-level-edge-to-text
);--spectrum-sidenav-start-to-content-third-level:var(
--spectrum-side-navigation-third-level-edge-to-text
);--spectrum-sidenav-start-to-content-with-icon-second-level:var(
--spectrum-side-navigation-with-icon-second-level-edge-to-text
);--spectrum-sidenav-start-to-content-with-icon-third-level:var(
--spectrum-side-navigation-with-icon-third-level-edge-to-text
);--spectrum-sidenav-background-disabled:transparent;--spectrum-sidenav-background-default:transparent;--spectrum-sidenav-background-hover:var(--spectrum-gray-200);--spectrum-sidenav-item-background-down:var(--spectrum-gray-300);--spectrum-sidenav-background-key-focus:var(--spectrum-gray-200);--spectrum-sidenav-item-background-default-selected:var(
--spectrum-gray-200
);--spectrum-sidenav-background-hover-selected:var(--spectrum-gray-300);--spectrum-sidenav-item-background-down-selected:var(--spectrum-gray-300);--spectrum-sidenav-background-key-focus-selected:var(--spectrum-gray-200);--spectrum-sidenav-header-color:var(--spectrum-gray-600);--spectrum-sidenav-content-disabled-color:var(
--spectrum-disabled-content-color
);--spectrum-sidenav-content-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-sidenav-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-sidenav-content-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-sidenav-content-color-key-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-sidenav-content-color-default-selected:var(
--spectrum-neutral-content-color-default
);--spectrum-sidenav-content-color-hover-selected:var(
--spectrum-neutral-content-color-hover
);--spectrum-sidenav-content-color-down-selected:var(
--spectrum-neutral-content-color-down
);--spectrum-sidenav-content-color-key-focus-selected:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-sidenav-text-font-family:var(--spectrum-sans-font-family-stack);--spectrum-sidenav-text-font-weight:var(--spectrum-regular-font-weight);--spectrum-sidenav-text-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-text-font-size:var(--spectrum-font-size-100);--spectrum-sidenav-text-line-height:var(--spectrum-line-height-100);--spectrum-sidenav-top-level-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-sidenav-top-level-font-weight:var(--spectrum-bold-font-weight);--spectrum-sidenav-top-level-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-top-level-font-size:var(--spectrum-font-size-100);--spectrum-sidenav-top-level-line-height:var(--spectrum-line-height-100);--spectrum-sidenav-header-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-sidenav-header-font-weight:var(--spectrum-medium-font-weight);--spectrum-sidenav-header-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-header-font-size:var(--spectrum-font-size-75);--spectrum-sidenav-header-line-height:var(--spectrum-line-height-100)}:host:lang(ja),:host:lang(ko),:host:lang(zh){--spectrum-sidenav-text-line-height:var(--spectrum-cjk-line-height-100)}:host:lang(ja),:host:lang(ko),:host:lang(zh){--spectrum-sidenav-top-level-line-height:var(
--spectrum-cjk-line-height-100
)}:host:lang(ja),:host:lang(ko),:host:lang(zh){--spectrum-sidenav-header-line-height:var(--spectrum-cjk-line-height-100)}:host{display:flex;flex-direction:column;list-style-type:none;margin:0;padding:0}@media (forced-colors:active){.spectrum-Icon{forced-color-adjust:preserve-parent-color}}:host{--spectrum-web-component-sidenav-font-weight:var(
--spectrum-sidenav-item-font-weight,var(--spectrum-global-font-weight-regular)
);display:block;width:240px}:host([variant=multilevel]){--spectrum-web-component-sidenav-font-weight:var(
--spectrum-sidenav-multilevel-main-item-font-weight,var(--spectrum-global-font-weight-bold)
)}
`,za=zn;kt();h();S();h();var Cn=i.css`
#list{--spectrum-sidenav-focus-ring-size:var(
--spectrum-focus-indicator-thickness
);--spectrum-sidenav-focus-ring-gap:var(--spectrum-focus-indicator-gap);--spectrum-sidenav-focus-ring-color:var(--spectrum-focus-indicator-color);--spectrum-sidenav-min-height:var(--spectrum-component-height-100);--spectrum-sidenav-width:100%;--spectrum-sidenav-min-width:var(--spectrum-side-navigation-minimum-width);--spectrum-sidenav-max-width:var(--spectrum-side-navigation-maximum-width);--spectrum-sidenav-border-radius:var(--spectrum-corner-radius-100);--spectrum-sidenav-icon-size:var(--spectrum-workflow-icon-size-100);--spectrum-sidenav-icon-spacing:var(--spectrum-text-to-visual-100);--spectrum-sidenav-inline-padding:var(
--spectrum-component-edge-to-text-100
);--spectrum-sidenav-gap:var(--spectrum-side-navigation-item-to-item);--spectrum-sidenav-top-to-icon:var(
--spectrum-component-top-to-workflow-icon-100
);--spectrum-sidenav-top-to-label:var(--spectrum-component-top-to-text-100);--spectrum-sidenav-bottom-to-label:var(
--spectrum-side-navigation-bottom-to-text
);--spectrum-sidenav-start-to-content-second-level:var(
--spectrum-side-navigation-second-level-edge-to-text
);--spectrum-sidenav-start-to-content-third-level:var(
--spectrum-side-navigation-third-level-edge-to-text
);--spectrum-sidenav-start-to-content-with-icon-second-level:var(
--spectrum-side-navigation-with-icon-second-level-edge-to-text
);--spectrum-sidenav-start-to-content-with-icon-third-level:var(
--spectrum-side-navigation-with-icon-third-level-edge-to-text
);--spectrum-sidenav-background-disabled:transparent;--spectrum-sidenav-background-default:transparent;--spectrum-sidenav-background-hover:var(--spectrum-gray-200);--spectrum-sidenav-item-background-down:var(--spectrum-gray-300);--spectrum-sidenav-background-key-focus:var(--spectrum-gray-200);--spectrum-sidenav-item-background-default-selected:var(
--spectrum-gray-200
);--spectrum-sidenav-background-hover-selected:var(--spectrum-gray-300);--spectrum-sidenav-item-background-down-selected:var(--spectrum-gray-300);--spectrum-sidenav-background-key-focus-selected:var(--spectrum-gray-200);--spectrum-sidenav-header-color:var(--spectrum-gray-600);--spectrum-sidenav-content-disabled-color:var(
--spectrum-disabled-content-color
);--spectrum-sidenav-content-color-default:var(
--spectrum-neutral-content-color-default
);--spectrum-sidenav-content-color-hover:var(
--spectrum-neutral-content-color-hover
);--spectrum-sidenav-content-color-down:var(
--spectrum-neutral-content-color-down
);--spectrum-sidenav-content-color-key-focus:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-sidenav-content-color-default-selected:var(
--spectrum-neutral-content-color-default
);--spectrum-sidenav-content-color-hover-selected:var(
--spectrum-neutral-content-color-hover
);--spectrum-sidenav-content-color-down-selected:var(
--spectrum-neutral-content-color-down
);--spectrum-sidenav-content-color-key-focus-selected:var(
--spectrum-neutral-content-color-key-focus
);--spectrum-sidenav-text-font-family:var(--spectrum-sans-font-family-stack);--spectrum-sidenav-text-font-weight:var(--spectrum-regular-font-weight);--spectrum-sidenav-text-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-text-font-size:var(--spectrum-font-size-100);--spectrum-sidenav-text-line-height:var(--spectrum-line-height-100);--spectrum-sidenav-top-level-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-sidenav-top-level-font-weight:var(--spectrum-bold-font-weight);--spectrum-sidenav-top-level-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-top-level-font-size:var(--spectrum-font-size-100);--spectrum-sidenav-top-level-line-height:var(--spectrum-line-height-100);--spectrum-sidenav-header-font-family:var(
--spectrum-sans-font-family-stack
);--spectrum-sidenav-header-font-weight:var(--spectrum-medium-font-weight);--spectrum-sidenav-header-font-style:var(--spectrum-default-font-style);--spectrum-sidenav-header-font-size:var(--spectrum-font-size-75);--spectrum-sidenav-header-line-height:var(--spectrum-line-height-100)}#list:lang(ja),#list:lang(ko),#list:lang(zh){--spectrum-sidenav-text-line-height:var(--spectrum-cjk-line-height-100)}#list:lang(ja),#list:lang(ko),#list:lang(zh){--spectrum-sidenav-top-level-line-height:var(
--spectrum-cjk-line-height-100
)}#list:lang(ja),#list:lang(ko),#list:lang(zh){--spectrum-sidenav-header-line-height:var(--spectrum-cjk-line-height-100)}#list{display:flex;flex-direction:column;list-style-type:none;margin:0;padding:0}#heading{color:var(
--mod-sidenav-header-color,var(--spectrum-sidenav-header-color)
);font-size:var(
--mod-sidenav-header-font-size,var(--spectrum-sidenav-header-font-size)
);font-style:var(
--mod-sidenav-header-font-style,var(--spectrum-sidenav-header-font-style)
);font-weight:var(
--mod-sidenav-header-font-weight,var(--spectrum-sidenav-header-font-weight)
);line-height:var(
--mod-sidenav-header-line-height,var(--spectrum-sidenav-header-line-height)
);margin-block-end:var(--spectrum-sidenav-heading-bottom-margin);margin-block-start:calc(var(--spectrum-sidenav-heading-top-margin) - var(--spectrum-sidenav-gap));padding-inline:var(
--mod-sidenav-inline-padding,var(--spectrum-sidenav-inline-padding)
)}@media (forced-colors:active){#list .spectrum-Icon{forced-color-adjust:preserve-parent-color}}:host{display:block}
`,Ca=Cn;var En=Object.defineProperty,Pn=Object.getOwnPropertyDescriptor,In=(s,t,e,r)=>{for(var o=r>1?void 0:r?Pn(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&En(t,e,o),o},Ue=class extends I{constructor(){super(...arguments),this.label=""}static get styles(){return[Ar,Ca]}update(t){this.hasAttribute("slot")||(this.slot="descendant"),super.update(t)}render(){return i.html`
            <h2 id="heading">${this.label}</h2>
            <div id="list" aria-labelledby="heading" role="list">
                <slot name="descendant"></slot>
            </div>
        `}firstUpdated(t){super.firstUpdated(t),this.setAttribute("role","listitem")}};In([(0,n.property)({reflect:!0})],Ue.prototype,"label",2);tt();var Tn=Object.defineProperty,Sn=Object.getOwnPropertyDescriptor,Or=(s,t,e,r)=>{for(var o=r>1?void 0:r?Sn(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&Tn(t,e,o),o},$t=class extends U{constructor(){super(...arguments),this.items=new Set,this.rovingTabindexController=new xe(this,{focusInIndex:t=>{let e,r=t.findIndex(o=>(o.value===this.value&&this.isDisabledChild(o)&&(e=o.closest("sp-sidenav-item:not([expanded])")),this.value?!o.disabled&&!this.isDisabledChild(o)&&o.value===this.value:!o.disabled&&!this.isDisabledChild(o)));return r===-1&&e&&(r=t.findIndex(o=>o===e)),r},direction:"vertical",elements:()=>[...this.querySelectorAll("sp-sidenav-item")],isFocusableElement:t=>!t.disabled&&!this.isDisabledChild(t)}),this.manageTabIndex=!1,this.value=void 0,this.variant=void 0,this.label=void 0}static get styles(){return[za]}startTrackingSelectionForItem(t){this.items.add(t),this.rovingTabindexController.clearElementCache()}stopTrackingSelectionForItem(t){this.items.delete(t),this.rovingTabindexController.clearElementCache()}handleSelect(t){if(t.stopPropagation(),this.value===t.detail.value)return;let e=this.value;this.value=t.detail.value,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0,cancelable:!0}))?this.items.forEach(r=>r.handleSideNavSelect(t)):(this.value=e,t.target.selected=!1,t.preventDefault())}focus(){this.rovingTabindexController.focus()}blur(){this.focusElement!==this&&super.blur()}click(){this.focusElement!==this&&super.click()}get focusElement(){return this.rovingTabindexController.focusInElement||this}isDisabledChild(t){if(t.disabled)return!0;let e=t.parentElement;for(;e instanceof Ue||!e.disabled&&e instanceof Lr&&e.expanded;)e=e.parentElement;return e!==this}handleSlotchange(){this.manageTabIndex?this.rovingTabindexController.manage():this.rovingTabindexController.unmanage()}render(){return i.html`
            <nav
                @sidenav-select=${this.handleSelect}
                aria-label=${z(this.label)}
            >
                <div role="list">
                    <slot
                        name="descendant"
                        @slotchange=${this.handleSlotchange}
                    ></slot>
                </div>
            </nav>
        `}willUpdate(){if(!this.hasUpdated){let t=this.querySelector("[selected]");t&&(this.value=t.value)}}updated(t){super.updated(t),t.has("manageTabIndex")&&(this.manageTabIndex?this.rovingTabindexController.manage():this.rovingTabindexController.unmanage())}};Or([(0,n.property)({type:Boolean,reflect:!0,attribute:"manage-tab-index"})],$t.prototype,"manageTabIndex",2),Or([(0,n.property)({reflect:!0})],$t.prototype,"value",2),Or([(0,n.property)({reflect:!0})],$t.prototype,"variant",2),Or([(0,n.property)({reflect:!0})],$t.prototype,"label",2);P();b("sp-sidenav",$t);h();S();tt();h();var jn=i.css`
#tooltip{--spectrum-overlay-animation-distance:6px;--spectrum-overlay-animation-duration:var(
--spectrum-animation-duration-100
);opacity:0;pointer-events:none;transition:transform var(--spectrum-overlay-animation-duration) ease-in-out,opacity var(--spectrum-overlay-animation-duration) ease-in-out,visibility 0s linear var(--spectrum-overlay-animation-duration);visibility:hidden}:host([open]) #tooltip{opacity:1;pointer-events:auto;transition-delay:0s;visibility:visible}:host([open]) .spectrum-Tooltip--bottom-end,:host([open]) .spectrum-Tooltip--bottom-left,:host([open]) .spectrum-Tooltip--bottom-right,:host([open]) .spectrum-Tooltip--bottom-start,:host([placement*=bottom][open]) #tooltip{--spectrum-overlay-animation-distance:6px;transform:translateY(var(--spectrum-overlay-animation-distance))}:host([open]) #tooltip,:host([open]) .spectrum-Tooltip--top-end,:host([open]) .spectrum-Tooltip--top-left,:host([open]) .spectrum-Tooltip--top-right,:host([open]) .spectrum-Tooltip--top-start,:host([placement*=top][open]) #tooltip{--spectrum-overlay-animation-distance:6px;transform:translateY(calc(var(--spectrum-overlay-animation-distance)*-1))}:host([dir=rtl][open]) .spectrum-Tooltip--start,:host([dir=rtl][open]) .spectrum-Tooltip--start-bottom,:host([dir=rtl][open]) .spectrum-Tooltip--start-top,:host([open]) .spectrum-Tooltip--end,:host([open]) .spectrum-Tooltip--end-bottom,:host([open]) .spectrum-Tooltip--end-top,:host([open]) .spectrum-Tooltip--right-bottom,:host([open]) .spectrum-Tooltip--right-top,:host([placement*=right][open]) #tooltip{--spectrum-overlay-animation-distance:6px;transform:translateX(var(--spectrum-overlay-animation-distance))}:host([dir=rtl][open]) .spectrum-Tooltip--end,:host([dir=rtl][open]) .spectrum-Tooltip--end-bottom,:host([dir=rtl][open]) .spectrum-Tooltip--end-top,:host([open]) .spectrum-Tooltip--left-bottom,:host([open]) .spectrum-Tooltip--left-top,:host([open]) .spectrum-Tooltip--start,:host([open]) .spectrum-Tooltip--start-bottom,:host([open]) .spectrum-Tooltip--start-top,:host([placement*=left][open]) #tooltip{--spectrum-overlay-animation-distance:6px;transform:translateX(calc(var(--spectrum-overlay-animation-distance)*-1))}#tooltip{--spectrum-tooltip-animation-duration:var(
--spectrum-animation-duration-100
);--spectrum-tooltip-animation-distance:var(--spectrum-spacing-75);--spectrum-tooltip-margin:0px;--spectrum-tooltip-height:var(--spectrum-component-height-75);--spectrum-tooltip-max-inline-size:var(--spectrum-tooltip-maximum-width);--spectrum-tooltip-border-radius:var(--spectrum-corner-radius-100);--spectrum-tooltip-icon-width:var(--spectrum-workflow-icon-size-50);--spectrum-tooltip-icon-height:var(--spectrum-workflow-icon-size-50);--spectrum-tooltip-font-size:var(--spectrum-font-size-75);--spectrum-tooltip-line-height:var(--spectrum-line-height-100);--spectrum-tooltip-cjk-line-height:var(--spectrum-cjk-line-height-100);--spectrum-tooltip-font-weight:var(--spectrum-regular-font-weight);--spectrum-tooltip-spacing-inline:var(
--spectrum-component-edge-to-text-75
);--spectrum-tooltip-spacing-block-start:var(
--spectrum-component-top-to-text-75
);--spectrum-tooltip-spacing-block-end:var(
--spectrum-component-bottom-to-text-75
);--spectrum-tooltip-icon-spacing-inline-start:var(
--spectrum-text-to-visual-75
);--spectrum-tooltip-icon-spacing-inline-end:var(
--spectrum-text-to-visual-75
);--spectrum-tooltip-icon-spacing-block-start:var(
--spectrum-component-top-to-workflow-icon-75
);--spectrum-tooltip-background-color-informative:var(
--spectrum-informative-background-color-default
);--spectrum-tooltip-background-color-positive:var(
--spectrum-positive-background-color-default
);--spectrum-tooltip-background-color-negative:var(
--spectrum-negative-background-color-default
);--spectrum-tooltip-content-color:var(--spectrum-white);--spectrum-tooltip-tip-inline-size:var(--spectrum-tooltip-tip-width);--spectrum-tooltip-tip-block-size:var(--spectrum-tooltip-tip-height);--spectrum-tooltip-tip-square-size:var(--spectrum-tooltip-tip-inline-size);--spectrum-tooltip-tip-height-percentage:50%;--spectrum-tooltip-tip-antialiasing-inset:0.5px;--spectrum-tooltip-pointer-corner-spacing:var(
--spectrum-corner-radius-100
);--spectrum-tooltip-background-color-default:var(
--spectrum-tooltip-backgound-color-default-neutral
)}@media (forced-colors:active){#tooltip{border:1px solid #0000}#tip{--highcontrast-tooltip-background-color-default:CanvasText;--highcontrast-tooltip-background-color-informative:CanvasText;--highcontrast-tooltip-background-color-positive:CanvasText;--highcontrast-tooltip-background-color-negative:CanvasText;forced-color-adjust:none}}#tooltip{-webkit-font-smoothing:antialiased;align-items:center;background-color:var(
--highcontrast-tooltip-background-color-default,var(
--mod-tooltip-background-color-default,var(--spectrum-tooltip-background-color-default)
)
);block-size:auto;border-radius:var(
--mod-tooltip-border-radius,var(--spectrum-tooltip-border-radius)
);box-sizing:border-box;color:var(
--mod-tooltip-content-color,var(--spectrum-tooltip-content-color)
);display:inline-flex;flex-direction:row;font-size:var(--mod-tooltip-font-size,var(--spectrum-tooltip-font-size));font-weight:var(
--mod-tooltip-font-weight,var(--spectrum-tooltip-font-weight)
);inline-size:auto;line-height:var(
--mod-tooltip-line-height,var(--spectrum-tooltip-line-height)
);max-inline-size:var(
--mod-tooltip-max-inline-size,var(--spectrum-tooltip-max-inline-size)
);min-block-size:var(--mod-tooltip-height,var(--spectrum-tooltip-height));padding-inline:var(
--mod-tooltip-spacing-inline,var(--spectrum-tooltip-spacing-inline)
);position:relative;vertical-align:top;word-break:break-word}:host(:lang(ja)) #tooltip,:host(:lang(ko)) #tooltip,:host(:lang(zh)) #tooltip{line-height:var(
--mod-tooltip-cjk-line-height,var(--spectrum-tooltip-cjk-line-height)
)}#tooltip{cursor:default;-webkit-user-select:none;user-select:none}#tooltip p{margin:0}:host([variant=info]) #tooltip{background-color:var(
--highcontrast-tooltip-background-color-informative,var(
--mod-tooltip-background-color-informative,var(--spectrum-tooltip-background-color-informative)
)
)}:host([variant=positive]) #tooltip{background-color:var(
--highcontrast-tooltip-background-color-positive,var(
--mod-tooltip-background-color-positive,var(--spectrum-tooltip-background-color-positive)
)
)}:host([variant=negative]) #tooltip{background-color:var(
--highcontrast-tooltip-background-color-negative,var(
--mod-tooltip-background-color-negative,var(--spectrum-tooltip-background-color-negative)
)
)}#tip{background-color:var(
--highcontrast-tooltip-background-color-default,var(
--mod-tooltip-background-color-default,var(--spectrum-tooltip-background-color-default)
)
);block-size:var(
--mod-tooltip-tip-square-size,var(--spectrum-tooltip-tip-square-size)
);clip-path:polygon(0 calc(0% - var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)),50% var(
--mod-tooltip-tip-height-percentage,var(--spectrum-tooltip-tip-height-percentage)
),100% calc(0% - var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)));inline-size:var(
--mod-tooltip-tip-square-size,var(--spectrum-tooltip-tip-square-size)
);left:50%;position:absolute;top:100%;transform:translateX(-50%)}:host([variant=info]) #tooltip #tip{background-color:var(
--highcontrast-tooltip-background-color-informative,var(
--mod-tooltip-background-color-informative,var(--spectrum-tooltip-background-color-informative)
)
)}:host([variant=positive]) #tooltip #tip{background-color:var(
--highcontrast-tooltip-background-color-positive,var(
--mod-tooltip-background-color-positive,var(--spectrum-tooltip-background-color-positive)
)
)}:host([variant=negative]) #tooltip #tip{background-color:var(
--highcontrast-tooltip-background-color-negative,var(
--mod-tooltip-background-color-negative,var(--spectrum-tooltip-background-color-negative)
)
)}.spectrum-Tooltip--top-end #tip,.spectrum-Tooltip--top-left #tip,.spectrum-Tooltip--top-right #tip,.spectrum-Tooltip--top-start #tip,:host([placement*=top]) #tooltip #tip{top:100%}.spectrum-Tooltip--bottom-end #tip,.spectrum-Tooltip--bottom-left #tip,.spectrum-Tooltip--bottom-right #tip,.spectrum-Tooltip--bottom-start #tip,:host([placement*=bottom]) #tooltip #tip{bottom:100%;clip-path:polygon(50% calc(100% - var(
--mod-tooltip-tip-height-percentage,
var(--spectrum-tooltip-tip-height-percentage)
)),0 calc(100% + var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)),100% calc(100% + var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)));top:auto}.spectrum-Tooltip--bottom-end #tip,.spectrum-Tooltip--bottom-left #tip,.spectrum-Tooltip--bottom-right #tip,.spectrum-Tooltip--bottom-start #tip,.spectrum-Tooltip--top-end #tip,.spectrum-Tooltip--top-left #tip,.spectrum-Tooltip--top-right #tip,.spectrum-Tooltip--top-start #tip{transform:none}.spectrum-Tooltip--bottom-left #tip,.spectrum-Tooltip--top-left #tip{left:var(
--mod-tooltip-pointer-corner-spacing,var(--spectrum-tooltip-pointer-corner-spacing)
)}.spectrum-Tooltip--bottom-right #tip,.spectrum-Tooltip--top-right #tip{left:auto;right:var(
--mod-tooltip-pointer-corner-spacing,var(--spectrum-tooltip-pointer-corner-spacing)
)}.spectrum-Tooltip--bottom-start #tip,.spectrum-Tooltip--top-start #tip{left:var(
--mod-tooltip-pointer-corner-spacing,var(--spectrum-tooltip-pointer-corner-spacing)
);right:auto}:host([dir=rtl]) .spectrum-Tooltip--bottom-start #tip,:host([dir=rtl]) .spectrum-Tooltip--top-start #tip{left:auto;right:var(
--mod-tooltip-pointer-corner-spacing,var(--spectrum-tooltip-pointer-corner-spacing)
)}.spectrum-Tooltip--bottom-end #tip,.spectrum-Tooltip--top-end #tip{left:auto;right:var(
--mod-tooltip-pointer-corner-spacing,var(--spectrum-tooltip-pointer-corner-spacing)
)}:host([dir=rtl]) .spectrum-Tooltip--bottom-end #tip,:host([dir=rtl]) .spectrum-Tooltip--top-end #tip{left:var(
--mod-tooltip-pointer-corner-spacing,var(--spectrum-tooltip-pointer-corner-spacing)
);right:auto}.spectrum-Tooltip--end #tip,.spectrum-Tooltip--end-bottom #tip,.spectrum-Tooltip--end-top #tip,.spectrum-Tooltip--left-bottom #tip,.spectrum-Tooltip--left-top #tip,.spectrum-Tooltip--right-bottom #tip,.spectrum-Tooltip--right-top #tip,.spectrum-Tooltip--start #tip,.spectrum-Tooltip--start-bottom #tip,.spectrum-Tooltip--start-top #tip,:host([placement*=left]) #tooltip #tip,:host([placement*=right]) #tooltip #tip{top:50%;transform:translateY(-50%)}.spectrum-Tooltip--end-bottom #tip,.spectrum-Tooltip--end-top #tip,.spectrum-Tooltip--left-bottom #tip,.spectrum-Tooltip--left-top #tip,.spectrum-Tooltip--right-bottom #tip,.spectrum-Tooltip--right-top #tip,.spectrum-Tooltip--start-bottom #tip,.spectrum-Tooltip--start-top #tip{top:auto;transform:none}.spectrum-Tooltip--end #tip,.spectrum-Tooltip--end-bottom #tip,.spectrum-Tooltip--end-top #tip,.spectrum-Tooltip--right-bottom #tip,.spectrum-Tooltip--right-top #tip,:host([placement*=right]) #tooltip #tip{clip-path:polygon(calc(100% - var(
--mod-tooltip-tip-height-percentage,
var(--spectrum-tooltip-tip-height-percentage)
)) 50%,calc(100% + var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)) 100%,calc(100% + var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)) 0);left:auto;right:100%}.spectrum-Tooltip--left-bottom #tip,.spectrum-Tooltip--left-top #tip,.spectrum-Tooltip--start #tip,.spectrum-Tooltip--start-bottom #tip,.spectrum-Tooltip--start-top #tip,:host([placement*=left]) #tooltip #tip{clip-path:polygon(calc(0% - var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)) 0,calc(0% - var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)) 100%,var(
--mod-tooltip-tip-height-percentage,var(--spectrum-tooltip-tip-height-percentage)
) 50%);left:100%}.spectrum-Tooltip--end-top #tip,.spectrum-Tooltip--left-top #tip,.spectrum-Tooltip--right-top #tip,.spectrum-Tooltip--start-top #tip{top:var(
--mod-tooltip-pointer-corner-spacing,var(--spectrum-tooltip-pointer-corner-spacing)
)}.spectrum-Tooltip--end-bottom #tip,.spectrum-Tooltip--left-bottom #tip,.spectrum-Tooltip--right-bottom #tip,.spectrum-Tooltip--start-bottom #tip{bottom:var(
--mod-tooltip-pointer-corner-spacing,var(--spectrum-tooltip-pointer-corner-spacing)
)}:host([dir=rtl]) .spectrum-Tooltip--end #tip,:host([dir=rtl]) .spectrum-Tooltip--end-bottom #tip,:host([dir=rtl]) .spectrum-Tooltip--end-top #tip{clip-path:polygon(calc(0% - var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)) 0,calc(0% - var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)) 100%,var(
--mod-tooltip-tip-height-percentage,var(--spectrum-tooltip-tip-height-percentage)
) 50%);left:100%;right:auto}:host([dir=rtl]) .spectrum-Tooltip--start #tip,:host([dir=rtl]) .spectrum-Tooltip--start-bottom #tip,:host([dir=rtl]) .spectrum-Tooltip--start-top #tip{clip-path:polygon(var(
--mod-tooltip-tip-height-percentage,var(--spectrum-tooltip-tip-height-percentage)
) 50%,calc(100% + var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)) 100%,calc(100% + var(
--mod-tooltip-tip-antialiasing-inset,
var(--spectrum-tooltip-tip-antialiasing-inset)
)) 0);left:auto;right:100%}::slotted([slot=icon]){align-self:flex-start;block-size:var(
--mod-tooltip-icon-height,var(--spectrum-tooltip-icon-height)
);flex-shrink:0;inline-size:var(
--mod-tooltip-icon-width,var(--spectrum-tooltip-icon-width)
);margin-block-start:var(
--mod-tooltip-icon-spacing-block-start,var(--spectrum-tooltip-icon-spacing-block-start)
);margin-inline-end:var(
--mod-tooltip-icon-spacing-inline-end,var(--spectrum-tooltip-icon-spacing-inline-end)
);margin-inline-start:calc(var(
--mod-tooltip-icon-spacing-inline-start,
var(--spectrum-tooltip-icon-spacing-inline-start)
) - var(
--mod-tooltip-spacing-inline,
var(--spectrum-tooltip-spacing-inline)
))}#label{line-height:var(
--mod-tooltip-line-height,var(--spectrum-tooltip-line-height)
);margin-block-end:var(
--mod-tooltip-spacing-block-end,var(--spectrum-tooltip-spacing-block-end)
);margin-block-start:var(
--mod-tooltip-spacing-block-start,var(--spectrum-tooltip-spacing-block-start)
)}#tooltip,.spectrum-Tooltip--top-end,.spectrum-Tooltip--top-left,.spectrum-Tooltip--top-right,.spectrum-Tooltip--top-start,:host([placement*=top]) #tooltip{margin-bottom:calc(var(
--mod-tooltip-tip-block-size,
var(--spectrum-tooltip-tip-block-size)
) + var(--mod-tooltip-margin, var(--spectrum-tooltip-margin)))}.spectrum-Tooltip--bottom-end,.spectrum-Tooltip--bottom-left,.spectrum-Tooltip--bottom-right,.spectrum-Tooltip--bottom-start,:host([placement*=bottom]) #tooltip{margin-top:calc(var(
--mod-tooltip-tip-block-size,
var(--spectrum-tooltip-tip-block-size)
) + var(--mod-tooltip-margin, var(--spectrum-tooltip-margin)))}.spectrum-Tooltip--right-bottom,.spectrum-Tooltip--right-top,:host([placement*=right]) #tooltip{margin-left:calc(var(
--mod-tooltip-tip-block-size,
var(--spectrum-tooltip-tip-block-size)
) + var(--mod-tooltip-margin, var(--spectrum-tooltip-margin)))}.spectrum-Tooltip--left-bottom,.spectrum-Tooltip--left-top,:host([placement*=left]) #tooltip{margin-right:calc(var(
--mod-tooltip-tip-block-size,
var(--spectrum-tooltip-tip-block-size)
) + var(--mod-tooltip-margin, var(--spectrum-tooltip-margin)))}.spectrum-Tooltip--start,.spectrum-Tooltip--start-bottom,.spectrum-Tooltip--start-top{margin-inline-end:calc(var(
--mod-tooltip-tip-block-size,
var(--spectrum-tooltip-tip-block-size)
) + var(--mod-tooltip-margin, var(--spectrum-tooltip-margin)))}.spectrum-Tooltip--end,.spectrum-Tooltip--end-bottom,.spectrum-Tooltip--end-top{margin-inline-start:calc(var(
--mod-tooltip-tip-block-size,
var(--spectrum-tooltip-tip-block-size)
) + var(--mod-tooltip-margin, var(--spectrum-tooltip-margin)))}#tooltip{--spectrum-tooltip-backgound-color-default-neutral:var(
--system-spectrum-tooltip-backgound-color-default-neutral
)}:host{display:contents;white-space:normal}#tooltip{inline-size:max-content}:host([placement]) #tooltip{margin:var(--swc-tooltip-margin)}#tip{clip-path:polygon(0 -5%,50% 50%,100% -5%);height:var(--spectrum-tooltip-tip-inline-size)!important;width:var(--spectrum-tooltip-tip-inline-size)!important}#tip[style]{transform:none!important}:host(:not([placement*=top])) #tooltip{margin-bottom:0}:host([placement*=top]) #tooltip #tip{top:100%}:host([placement*=bottom]) #tooltip #tip{bottom:100%;clip-path:polygon(50% 50%,0 105%,100% 105%);top:auto}:host([placement*=left]) #tooltip #tip,:host([placement*=right]) #tooltip #tip{top:50%;transform:translateY(-50%)}:host([placement*=right]) #tooltip #tip{clip-path:polygon(50% 50%,105% 100%,105% 0);left:calc(var(
--mod-tooltip-tip-block-size,
var(--spectrum-tooltip-tip-block-size)
)*-2);right:100%}:host([placement*=left]) #tooltip #tip{clip-path:polygon(-5% 0,-5% 100%,50% 50%);left:100%}
`,Ea=jn;ar();var An=Object.defineProperty,Dn=Object.getOwnPropertyDescriptor,Bt=(s,t,e,r)=>{for(var o=r>1?void 0:r?Dn(t,e):t,a=s.length-1,c;a>=0;a--)(c=s[a])&&(o=(r?c(t,e,o):c(o))||o);return r&&o&&An(t,e,o),o},ko=class extends HTMLElement{constructor(){super(),this._open=!1,this._placement="top",this.addEventListener("sp-opened",this.redispatchEvent),this.addEventListener("sp-closed",this.redispatchEvent)}redispatchEvent(t){t.stopPropagation(),this.tooltip.dispatchEvent(new CustomEvent(t.type,{bubbles:t.bubbles,composed:t.composed,detail:t.detail}))}get tooltip(){return this.getRootNode().host}static get observedAttributes(){return["open","placement"]}attributeChangedCallback(t,e,r){switch(t){case"open":this.open=r!==null;break;case"placement":this.placement=r;break}}set open(t){this._open=t;let{tooltip:e}=this;e&&(e.open=t)}get open(){return this._open}set placement(t){this._placement=t;let{tooltip:e}=this;e&&(e.placement=t)}get placement(){return this._placement}get tipElement(){return this.tooltip.tipElement}};customElements.get("sp-tooltip-openable")||customElements.define("sp-tooltip-openable",ko);var rt=class extends I{constructor(){super(...arguments),this.selfManaged=!1,this.offset=0,this.open=!1,this._variant="",this.handleOpenOverlay=()=>{this.open=!0},this.handleCloseOverlay=()=>{this.open=!1}}static get styles(){return[Ea]}get variant(){return this._variant}set variant(t){if(t!==this.variant){if(["info","positive","negative"].includes(t)){this.setAttribute("variant",t),this._variant=t;return}this.removeAttribute("variant"),this._variant=""}}forwardTransitionEvent(t){this.dispatchEvent(new TransitionEvent(t.type,{bubbles:!0,composed:!0,propertyName:t.propertyName}))}get triggerElement(){var t;let e=this.assignedSlot||this,r=e.getRootNode(),o=e.parentElement||r.host||r;for(;!((t=o?.matches)!=null&&t.call(o,ns));)e=o.assignedSlot||o,r=e.getRootNode(),o=e.parentElement||r.host||r;return o}render(){let t=i.html`
            <sp-tooltip-openable
                id="tooltip"
                placement=${z(this.placement)}
                @transitionrun=${this.forwardTransitionEvent}
                @transitionend=${this.forwardTransitionEvent}
                @transitioncancel=${this.forwardTransitionEvent}
            >
                <slot name="icon"></slot>
                <span id="label"><slot></slot></span>
                <span id="tip" aria-hidden="true"></span>
            </sp-tooltip-openable>
        `;return this.selfManaged?(Promise.resolve().then(()=>Nt()),i.html`
                <sp-overlay
                    ?open=${this.open}
                    offset=${this.offset}
                    .placement=${this.placement}
                    type="hint"
                    .tipPadding=${this.tipPadding}
                    .triggerInteraction=${"hover"}
                    @sp-opened=${this.handleOpenOverlay}
                    @sp-closed=${this.handleCloseOverlay}
                >
                    ${t}
                </sp-overlay>
            `):t}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{if(!this.selfManaged)return;let t=this.overlayElement;if(t){let e=this.triggerElement;t.triggerElement=e}})}};Bt([(0,n.property)({type:Boolean,attribute:"self-managed"})],rt.prototype,"selfManaged",2),Bt([(0,n.property)({type:Number})],rt.prototype,"offset",2),Bt([(0,n.property)({type:Boolean,reflect:!0})],rt.prototype,"open",2),Bt([(0,n.query)("sp-overlay")],rt.prototype,"overlayElement",2),Bt([(0,n.property)({reflect:!0})],rt.prototype,"placement",2),Bt([(0,n.query)("#tip")],rt.prototype,"tipElement",2),Bt([(0,n.property)({type:Number})],rt.prototype,"tipPadding",2),Bt([(0,n.property)({type:String})],rt.prototype,"variant",1);P();b("sp-tooltip",rt);ho();window.__merch__spectrum_Overlay=Tr;
//# sourceMappingURL=merch-spectrum.js.map
