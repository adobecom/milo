var m=class{#t;constructor(t){this.#t=/^author-/.test(t);let s=`https://${t}.adobeaemcloud.com`,a=`${s}/adobe/sites`;this.cfFragmentsUrl=`${a}/cf/fragments`,this.cfSearchUrl=`${this.cfFragmentsUrl}/search`,this.cfPublishUrl=`${this.cfFragmentsUrl}/publish`,this.wcmcommandUrl=`${s}/bin/wcmcommand`,this.csrfTokenUrl=`${s}/libs/granite/csrf/token.json`,this.headers={Authorization:`Bearer ${sessionStorage.getItem("masAccessToken")??window.adobeid?.authorize?.()}`,pragma:"no-cache","cache-control":"no-cache"}}async getCsrfToken(){let{token:t}=await fetch(this.csrfTokenUrl,{headers:this.headers}).then(s=>s.json());return t}async searchFragment({path:t,query:s,variant:a}){let e={};t&&(e.path=t),s&&(e.fullText={text:encodeURIComponent(s),queryMode:"EXACT_WORDS"});let i=new URLSearchParams({query:JSON.stringify({filter:e})}).toString();return fetch(`${this.cfSearchUrl}?${i}`,{headers:this.headers}).then(n=>n.json()).then(n=>n.items).then(n=>a?n.filter(r=>{let[o]=r.fields.find(c=>c.name==="variant")?.values;return o===a}):n)}async getFragmentByPath(t){let s=this.#t?this.headers:{};return fetch(`${this.cfFragmentsUrl}?path=${t}`,{headers:s}).then(a=>a.json()).then(({items:[a]})=>a)}async getFragment(t){let s=t.headers.get("Etag"),a=await t.json();return a.etag=s,a}async getFragmentById(t){return await fetch(`${this.cfFragmentsUrl}/${t}`,{headers:this.headers}).then(this.getFragment)}async saveFragment(t){let{title:s,fields:a}=t;return await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({title:s,fields:a})}).then(this.getFragment)}async copyFragmentClassic(t){let s=await this.getCsrfToken(),a=t.path.split("/").slice(0,-1).join("/"),e=new FormData;e.append("cmd","copyPage"),e.append("srcPath",t.path),e.append("destParentPath",a),e.append("shallow","false"),e.append("_charset_","UTF-8");let i=await fetch(this.wcmcommandUrl,{method:"POST",headers:{...this.headers,"csrf-token":s},body:e});if(i.ok){let n=await i.text(),d=new DOMParser().parseFromString(n,"text/html").getElementById("Message")?.textContent.trim();return this.getFragmentByPath(d)}throw new Error("Failed to copy fragment")}async publishFragment(t){await fetch(this.cfPublishUrl,{method:"POST",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({paths:[t.path],filterReferencesByStatus:["DRAFT","UNPUBLISHED"],workflowModelId:"/var/workflow/models/scheduled_activation_with_references"})})}async deleteFragment(t){await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"DELETE",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers}})}sites={cf:{fragments:{search:this.searchFragment.bind(this),getByPath:this.getFragmentByPath.bind(this),getById:this.getFragmentById.bind(this),save:this.saveFragment.bind(this),copy:this.copyFragmentClassic.bind(this),publish:this.publishFragment.bind(this),delete:this.deleteFragment.bind(this)}}}};function h(l,t={},s){let a=document.createElement(l);s instanceof HTMLElement?a.appendChild(s):a.innerHTML=s;for(let[e,i]of Object.entries(t))a.setAttribute(e,i);return a}var f="aem-bucket",T={"8a7b6c5d-4e3f-2a1b-9c8d-7e6f5a4b3c2d":"photoshop-lapsed-upgrade","f731437c-1d9c-4e94-949b-5ab010f5d72b":"photography-upsell"},x={catalog:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},ah:{title:{tag:"h3",slot:"heading-xxs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xxs"},ctas:{size:"s"}},"ccd-action":{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},"special-offers":{name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}}};async function b(l,t,s,a){let e=l.fields.reduce((r,{name:o,multiple:c,values:d})=>(r[o]=c?d:d[0],r),{id:l.id});e.path=e.path,e.model=e.model;let{variant:i="catalog"}=e;s.setAttribute("variant",i);let n=x[i]??"catalog";if(e.icon?.forEach(r=>{let o=h("merch-icon",{slot:"icons",src:r,alt:"",href:"",size:"l"});t(o)}),e.title&&n.title&&t(h(n.title.tag,{slot:n.title.slot},e.title)),e.backgroundImage&&n.backgroundImage&&t(h(n.backgroundImage.tag,{slot:n.backgroundImage.slot},`<img loading="lazy" src="${e.backgroundImage}" width="600" height="362">`)),e.prices&&n.prices){let r=e.prices,o=h(n.prices.tag,{slot:n.prices.slot},r);t(o)}if(e.description&&n.description){let r=h(n.description.tag,{slot:n.description.slot},e.description);t(r)}if(e.ctas){let r=e.ctas,o=h("div",{slot:"footer"},r);[...o.querySelectorAll("a")].forEach(c=>{if(a)c.classList.add("con-button"),c.parentElement.tagName==="STRONG"&&c.classList.add("blue"),o.appendChild(c);else{let d=h("sp-button",{},c);d.addEventListener("click",u=>{u.stopPropagation(),c.click()}),o.appendChild(d)}}),t(o)}}var p=class{#t=new Map;clear(){this.#t.clear()}add(...t){t.forEach(s=>{let{path:a}=s;a&&this.#t.set(a,s)})}has(t){return this.#t.has(t)}get(t){return this.#t.get(t)}remove(t){this.#t.delete(t)}},E=new p,g=class extends HTMLElement{#t;cache=E;refs=[];path;consonant=!1;static get observedAttributes(){return["source","path","consonant"]}attributeChangedCallback(t,s,a){this[t]=a}connectedCallback(){this.consonant=this.hasAttribute("consonant"),this.clearRefs();let t=this.getAttribute(f)??document.querySelector("mas-studio")?.getAttribute(f)??"publish-p22655-e59341";this.#t=new m(t),this.fetchData()}clearRefs(){this.refs.forEach(t=>{t.remove()})}refresh(t=!0){this.clearRefs(),this.refs=[],t&&this.cache.remove(this.path),this.fetchData()}async fetchData(){let t=E.get(this.path);t||(t=await this.#t.sites.cf.fragments.getByPath(this.path));let s=(sessionStorage.getItem("mas_xlg")??window.alloy_all?.data?._adobe_corpnew?.digitalData?.adobe?.xlg)?.split(",")?.map(e=>T[e]).find(Boolean),a=t.fields.find(e=>e.name==="xlg")?.values[0];if(s&&a?.includes(s)){let e=await this.#t.sites.cf.fragments.getByPath(`${this.path}-${s}`).catch(()=>null);e&&(t=e)}if(t){b(t,i=>{this.parentElement.appendChild(i),this.refs.push(i)},this.parentElement,this.consonant);return}}};customElements.define("merch-datasource",g);export{g as MerchDataSource};
//# sourceMappingURL=merch-datasource.js.map
