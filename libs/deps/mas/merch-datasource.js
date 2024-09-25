function g(l,t={},s){let e=document.createElement(l);s instanceof HTMLElement?e.appendChild(s):e.innerHTML=s;for(let[r,i]of Object.entries(t))e.setAttribute(r,i);return e}function T(l=1e3){return new Promise(t=>setTimeout(t,l))}var m="Network error",C={sort:[{on:"created",order:"ASC"}]},u=class{#t;constructor(t,s){this.#t=/^author-/.test(t);let e=s||`https://${t}.adobeaemcloud.com`,r=`${e}/adobe/sites`;this.cfFragmentsUrl=`${r}/cf/fragments`,this.cfSearchUrl=`${this.cfFragmentsUrl}/search`,this.cfPublishUrl=`${this.cfFragmentsUrl}/publish`,this.wcmcommandUrl=`${e}/bin/wcmcommand`,this.csrfTokenUrl=`${e}/libs/granite/csrf/token.json`,this.foldersUrl=`${e}/adobe/folders`,this.foldersClassicUrl=`${e}/api/assets`,this.headers={Authorization:`Bearer ${sessionStorage.getItem("masAccessToken")??window.adobeid?.authorize?.()}`,pragma:"no-cache","cache-control":"no-cache"}}async getCsrfToken(){let t=await fetch(this.csrfTokenUrl,{headers:this.headers}).catch(e=>{throw new Error(`${m}: ${e.message}`)});if(!t.ok)throw new Error(`Failed to get CSRF token: ${t.status} ${t.statusText}`);let{token:s}=await t.json();return s}async*searchFragment({path:t,query:s="",sort:e}){let r={path:t};s?r.fullText={text:encodeURIComponent(s),queryMode:"EXACT_WORDS"}:r.onlyDirectChildren=!0;let i={...C,filter:r};e&&(i.sort=e);let a={query:JSON.stringify(i)},o;for(;;){o&&(a.cursor=o);let c=new URLSearchParams(a).toString(),n=await fetch(`${this.cfSearchUrl}?${c}`,{headers:this.headers}).catch(d=>{throw new Error(`${m}: ${d.message}`)});if(!n.ok)throw new Error(`Search failed: ${n.status} ${n.statusText}`);let h;if({items:h,cursor:o}=await n.json(),yield h,!o)break}}async getFragmentByPath(t){let s=this.#t?this.headers:{},e=await fetch(`${this.cfFragmentsUrl}?path=${t}`,{headers:s}).catch(i=>{throw new Error(`${m}: ${i.message}`)});if(!e.ok)throw new Error(`Failed to get fragment: ${e.status} ${e.statusText}`);let{items:r}=await e.json();if(!r||r.length===0)throw new Error("Fragment not found");return r[0]}async getFragment(t){let s=t.headers.get("Etag"),e=await t.json();return e.etag=s,e}async getFragmentById(t){let s=await fetch(`${this.cfFragmentsUrl}/${t}`,{headers:this.headers});if(!s.ok)throw new Error(`Failed to get fragment: ${s.status} ${s.statusText}`);return await this.getFragment(s)}async saveFragment(t){let{title:s,fields:e}=t,r=await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"PUT",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({title:s,fields:e})}).catch(i=>{throw new Error(`${m}: ${i.message}`)});if(!r.ok)throw new Error(`Failed to save fragment: ${r.status} ${r.statusText}`);return await this.getFragment(r)}async copyFragmentClassic(t){let s=await this.getCsrfToken(),e=t.path.split("/").slice(0,-1).join("/"),r=new FormData;r.append("cmd","copyPage"),r.append("srcPath",t.path),r.append("destParentPath",e),r.append("shallow","false"),r.append("_charset_","UTF-8");let i=await fetch(this.wcmcommandUrl,{method:"POST",headers:{...this.headers,"csrf-token":s},body:r}).catch(b=>{throw new Error(`${m}: ${b.message}`)});if(!i.ok)throw new Error(`Failed to copy fragment: ${i.status} ${i.statusText}`);let a=await i.text(),h=new DOMParser().parseFromString(a,"text/html").getElementById("Message")?.textContent.trim();if(!h)throw new Error("Failed to extract new path from copy response");await T();let d=await this.getFragmentByPath(h);return d&&(d=await this.getFragmentById(d.id)),d}async publishFragment(t){let s=await fetch(this.cfPublishUrl,{method:"POST",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers},body:JSON.stringify({paths:[t.path],filterReferencesByStatus:["DRAFT","UNPUBLISHED"],workflowModelId:"/var/workflow/models/scheduled_activation_with_references"})}).catch(e=>{throw new Error(`${m}: ${e.message}`)});if(!s.ok)throw new Error(`Failed to publish fragment: ${s.status} ${s.statusText}`);return await s.json()}async deleteFragment(t){let s=await fetch(`${this.cfFragmentsUrl}/${t.id}`,{method:"DELETE",headers:{"Content-Type":"application/json","If-Match":t.etag,...this.headers}}).catch(e=>{throw new Error(`${m}: ${e.message}`)});if(!s.ok)throw new Error(`Failed to delete fragment: ${s.status} ${s.statusText}`);return s}async listFolders(t){let s=new URLSearchParams({path:t}).toString(),e=await fetch(`${this.foldersUrl}/?${s}`,{method:"GET",headers:{...this.headers,"X-Adobe-Accept-Experimental":"1"}}).catch(r=>{throw new Error(`${m}: ${r.message}`)});if(!e.ok)throw new Error(`Failed to list folders: ${e.status} ${e.statusText}`);return await e.json()}async listFoldersClassic(t){let s=t?.replace(/^\/content\/dam/,""),e=await fetch(`${this.foldersClassicUrl}${s}.json?limit=1000`,{method:"GET",headers:{...this.headers}}).catch(a=>{throw new Error(`${m}: ${a.message}`)});if(!e.ok)throw new Error(`Failed to list folders: ${e.status} ${e.statusText}`);let{properties:{name:r},entities:i=[]}=await e.json();return{self:{name:r,path:t},children:i.filter(({class:[a]})=>/folder/.test(a)).map(({properties:{name:a,title:o}})=>({name:a,title:o,folderId:`${t}/${a}`,path:`${t}/${a}`}))}}sites={cf:{fragments:{search:this.searchFragment.bind(this),getByPath:this.getFragmentByPath.bind(this),getById:this.getFragmentById.bind(this),save:this.saveFragment.bind(this),copy:this.copyFragmentClassic.bind(this),publish:this.publishFragment.bind(this),delete:this.deleteFragment.bind(this)}}};folders={list:this.listFoldersClassic.bind(this)}};var F="aem-bucket",k="publish-p22655-e155390",$=class{#t=new Map;clear(){this.#t.clear()}add(...t){t.forEach(s=>{let{path:e}=s;e&&this.#t.set(e,s)})}has(t){return this.#t.has(t)}get(t){return this.#t.get(t)}remove(t){this.#t.delete(t)}},w=new $,f=class extends HTMLElement{#t;cache=w;item;refs=[];path;consonant=!1;_readyPromise;static get observedAttributes(){return["path"]}attributeChangedCallback(t,s,e){this[t]=e}connectedCallback(){this.consonant=this.hasAttribute("consonant"),this.clearRefs();let t=this.getAttribute(F)??k;this.#t=new u(t),this.refresh(!1)}clearRefs(){this.refs.forEach(t=>{t.remove()})}async refresh(t=!0){this.path&&(this._readyPromise&&!await Promise.race([this._readyPromise,Promise.resolve(!1)])||(this.clearRefs(),this.refs=[],t&&this.cache.remove(this.path),this._readyPromise=this.fetchData().then(()=>!0)))}async fetchData(){let t=w.get(this.path);t||(t=await this.#t.sites.cf.fragments.getByPath(this.path),w.add(t)),this.item=t,this.render()}get updateComplete(){return this._readyPromise??Promise.reject(new Error("datasource is not correctly configured"))}async render(){}};customElements.define("aem-datasource",f);var p={CATALOG:"catalog",AH:"ah",CCD_ACTION:"ccd-action",SPECIAL_OFFERS:"special-offers",CCD_SLICE:"ccd-slice"},P={[p.CATALOG]:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[p.AH]:{title:{tag:"h3",slot:"heading-xxs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xxs"},ctas:{size:"s"}},[p.CCD_ACTION]:{title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[p.SPECIAL_OFFERS]:{name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{size:"l"}},[p.CCD_SLICE]:{backgroundImage:{tag:"div",slot:"image"},description:{tag:"div",slot:"body-s"},ctas:{size:"l"}}};async function S(l,t,s,e){let r=l.fields.reduce((o,{name:c,multiple:n,values:h})=>(o[c]=n?h:h[0],o),{id:l.id});r.model=r.model;let{variant:i="catalog"}=r;s.setAttribute("variant",i);let a=P[i]??"catalog";if(r.mnemonicIcon?.forEach((o,c)=>{let n=r.mnemonicLink?.length>c?r.mnemonicLink[c]:"",h=r.mnemonicAlt?.length>c?r.mnemonicAlt[c]:"",d=g("merch-icon",{slot:"icons",src:o,alt:h,href:n,size:"l"});t(d)}),r.cardTitle&&a.title&&t(g(a.title.tag,{slot:a.title.slot},r.cardTitle)),r.backgroundImage&&a.backgroundImage&&t(g(a.backgroundImage.tag,{slot:a.backgroundImage.slot},`<img loading="lazy" src="${r.backgroundImage}" width="600" height="362">`)),r.prices&&a.prices){let o=r.prices,c=g(a.prices.tag,{slot:a.prices.slot},o);t(c)}if(r.description&&a.description){let o=g(a.description.tag,{slot:a.description.slot},r.description);t(o)}if(r.ctas){let o=g("div",{slot:"footer"},r.ctas),c=[];[...o.querySelectorAll("a")].forEach(n=>{let h=n.parentElement.tagName==="STRONG";if(e)n.classList.add("con-button"),h&&n.classList.add("blue"),c.push(n);else{let E=g("sp-button",{treatment:h?"fill":"outline",variant:h?"accent":"primary"},n);E.addEventListener("click",x=>{x.stopPropagation(),n.click()}),c.push(E)}}),o.innerHTML="",o.append(...c),t(o)}}var y=class extends f{async render(){if(this.item){let t=s=>{this.parentElement.appendChild(s),this.refs.push(s)};S(this.item,t,this.parentElement,this.consonant)}}};customElements.define("merch-datasource",y);export{y as MerchDataSource};
