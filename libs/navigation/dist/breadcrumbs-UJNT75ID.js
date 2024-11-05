import{d as u,g as n}from"./chunk-VLPXW364.js";import"./chunk-NY3PBGKK.js";import"./chunk-TXSFCJFB.js";import{b as p}from"./chunk-I5JF36TS.js";import{c as s,f as b}from"./chunk-VP5VJMKQ.js";import{a as m}from"./chunk-YBWLHNHN.js";var i={seo:"breadcrumbs-seo",seoLegacy:"breadcrumb-seo",fromFile:"breadcrumbs-from-file",showCurrent:"breadcrumbs-show-current-page",hiddenEntries:"breadcrumbs-hidden-entries",pageTitle:"breadcrumbs-page-title",base:"breadcrumbs-base",fromUrl:"breadcrumbs-from-url"},f,g=t=>{if((s(i.seo)||s(i.seoLegacy))==="off"||!t)return;let r={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[]};t.querySelectorAll("ul > li").forEach((l,a)=>{let c=l.querySelector("a");r.itemListElement.push({"@type":"ListItem",position:a+1,name:c?c.innerText.trim():l.innerText.trim(),item:c?.href})});let o=n(f||(f=m(['<script type="application/ld+json">',"<\/script>"])),JSON.stringify(r));document.head.append(o)},d=t=>{if(!t)return null;let e=t.querySelector("ul"),r=s(i.pageTitle);(r||s(i.showCurrent)==="on")&&e.append(n`
      <li>
        ${r||document.title}
      </li>
    `);let o=s(i.hiddenEntries)?.toLowerCase().split(",").map(a=>a.trim())||[];e.querySelectorAll("li").forEach(a=>{o.includes(a.innerText?.toLowerCase().trim())&&a.remove()});let l=n`
    <div class="feds-breadcrumbs-wrapper">
      <nav class="feds-breadcrumbs" aria-label="Breadcrumb">${e}</nav>
    </div>
  `;return e.querySelector("li:last-of-type")?.setAttribute("aria-current","page"),l},h=async t=>{let e=t||n`<div><ul></ul></div>`,r=p(s(i.base));if(!r)return null;try{let l=await(await fetch(`${r}.plain.html`)).text(),a=new DOMParser().parseFromString(l,"text/html").body;return e.querySelector("ul")?.prepend(...a.querySelectorAll("li")),d(e)}catch(o){return u({e:o,message:"Breadcrumbs failed fetching base",tags:"errorType=info,module=gnav-breadcrumbs"}),null}},y=()=>{if(s(i.fromUrl)!=="on")return null;let t=n`<ul></ul>`,e=document.location.pathname.replace(b().locale?.prefix||"","").split("/").filter(r=>r);for(let r=0;r<e.length;r+=1)t.append(n`
      <li>
        <a href="/${e.slice(0,r+1).join("/")}">${e[r].replaceAll("-"," ")}</a>
      </li>
    `);return d(n`<div>${t}</div>`)};async function v(t){try{let e=await h(t)||d(t)||y();return g(e),e}catch(e){return u({e,message:"Breadcrumbs failed rendering",tags:"errorType=error,module=gnav-breadcrumbs"}),null}}export{v as default};
