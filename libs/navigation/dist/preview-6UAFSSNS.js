import{b as L,d as g}from"./chunk-O6WE24RY.js";import"./chunk-2DWMPQSP.js";import{c as A,f as k,h as q,k as H}from"./chunk-KHBABMXA.js";import"./chunk-YBWLHNHN.js";function M(){let i=document.querySelectorAll('.mep-popup input[type="radio"]:checked, .mep-popup input[type="text"]'),e=[];i.forEach(a=>{let{value:n}=a;if(a.getAttribute("id")==="new-manifest"){if(a.value!==""){try{let r=new URL(n);r&&(n=r.pathname)}catch{}e.push(n)}}else n=`${a.getAttribute("name")}--${n}`,e.push(n)});let t=new URL(window.location.href);t.searchParams.set("mep",e.join("---"));let o=document.querySelector('.mep-popup input[type="checkbox"]#mepHighlightCheckbox');document.body.dataset.mepHighlight=o.checked,o.checked?t.searchParams.set("mepHighlight",!0):t.searchParams.delete("mepHighlight"),document.querySelector('.mep-popup input[type="checkbox"]#mepPreviewButtonCheckbox').checked?t.searchParams.set("mepButton","off"):t.searchParams.delete("mepButton"),document.querySelector(".mep-popup a.con-button").setAttribute("href",t.href)}function I(){let[,i]=new URL(window.location.href).hostname.split("--");if(i)return i;try{let e=document.querySelector("aem-sidekick, helix-sidekick");if(e){let[,t]=new URL(JSON.parse(e.getAttribute("status"))?.live.url).hostname.split("--");return t}}catch(e){console.log("Error getting repo from sidekick",e)}return!1}async function O(i,e){let t=I();if(!t)return e.location=i.dataset.manifestPath,!1;let a=(await(await fetch(`https://admin.hlx.page/status/adobecom/${t}/main${i.dataset.manifestPath}?editUrl=auto`)).json())?.edit?.url;return a?(e.location=a,i.href=a,!0):(e.location=i.dataset.manifestUrl,!1)}function R(i){i.querySelectorAll('.mep-popup input[type="radio"], .mep-popup input[type="checkbox"]').forEach(e=>{e.addEventListener("change",M)}),i.querySelectorAll('.mep-popup input[type="text"]').forEach(e=>{e.addEventListener("keyup",M)}),i.querySelector(".mep-manifest.mep-badge").addEventListener("click",()=>{i.classList.toggle("mep-hidden")}),i.querySelector(".mep-close").addEventListener("click",()=>{document.body.removeChild(document.querySelector(".mep-preview-overlay"))}),i.querySelector(".mep-toggle-advanced").addEventListener("click",()=>{document.querySelector(".mep-advanced-container").classList.toggle("mep-advanced-open")}),i.querySelectorAll("a[data-manifest-path]").forEach(e=>{e.addEventListener("click",()=>{if(e.getAttribute("href"))return!1;let t=window.open("","_blank");return t.document.write(`<html><head></head><body>
        Please wait while we redirect you. 
        If you are not redirected, please check that you are signed into the AEM sidekick
        and try again.
        </body></html>`),t.document.close(),t.focus(),O(e,t),!0})})}function N(i){let e=q("div",{class:"mep-preview-overlay static-links",style:"display: none;"});document.body.append(e);let t=document.createElement("div");t.classList.add("mep-hidden");let o="",c=[];i?.forEach(l=>{let{variantNames:x,manifestPath:s=l.manifest,selectedVariantName:P,name:E,manifestType:B,manifestUrl:T,manifestOverrideName:S}=l,u=T||s,h="";x.forEach(d=>{let f={attribute:"",class:""};d===P&&(f.attribute='checked="checked"',f.class='class="mep-manifest-selected-variant"',c.push(`${s}--${d}`)),h+=`<div>
        <input type="radio" name="${s}" value="${d}" id="${s}--${d}" ${f.attribute}>
        <label for="${s}--${d}" ${f.class}>${d}</label>
      </div>`});let p={attribute:"",class:""};x.includes(P)||(p.attribute='checked="checked"',p.class='class="mep-manifest-selected-variant"',c.push(`${s}--default`)),h+=`<div>
      <input type="radio" name="${s}" value="default" id="${s}--default" ${p.attribute}>
      <label for="${s}--default" ${p.class}>Default (control)</label>
    </div>`;let v=g(s),U=E?`${E}<br><i>${v}</i>`:v,z=l.event?`<p>Scheduled - ${l.disabled?"inactive":"active"}</p>
         <p>On: ${l.event.start?.toLocaleString()} - <a target= "_blank" href="?instant=${l.event.start?.toISOString()}">instant</a></p>
         <p>Off: ${l.event.end?.toLocaleString()}</p>`:"",m="";B!==L?m="N/A for this manifest type":S?m=S:m=v.replace(".json","").slice(0,20),o+=`<div class="mep-manifest-info" title="Manifest location: ${u}&#013;Analytics manifest name: ${m}">
      <div class="mep-manifest-title">
        ${U}
        <i></i>
        <a class="mep-edit-manifest" data-manifest-url="${u}" data-manifest-path="${u}" target="_blank" title="Open manifest">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0,0,256,256" width="16px" height="16px" fill-rule="nonzero"><g transform=""><g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M22.82813,3c-0.51175,0 -1.02356,0.19544 -1.41406,0.58594l-2.41406,2.41406l5,5l2.41406,-2.41406c0.781,-0.781 0.781,-2.04713 0,-2.82812l-2.17187,-2.17187c-0.3905,-0.3905 -0.90231,-0.58594 -1.41406,-0.58594zM17,8l-11.74023,11.74023c0,0 0.91777,-0.08223 1.25977,0.25977c0.342,0.342 0.06047,2.58 0.48047,3c0.42,0.42 2.64389,0.12436 2.96289,0.44336c0.319,0.319 0.29688,1.29688 0.29688,1.29688l11.74023,-11.74023zM4,23l-0.94336,2.67188c-0.03709,0.10544 -0.05623,0.21635 -0.05664,0.32813c0,0.55228 0.44772,1 1,1c0.11177,-0.00041 0.22268,-0.01956 0.32813,-0.05664c0.00326,-0.00128 0.00652,-0.00259 0.00977,-0.00391l0.02539,-0.00781c0.00196,-0.0013 0.00391,-0.0026 0.00586,-0.00391l2.63086,-0.92773l-1.5,-1.5z"></path></g></g></g></svg>
        </a>
        ${z}
      </div>
      <div class="mep-manifest-variants">${h}</div>
    </div>`});let a=k(),n=a.mep.targetEnabled?"on":"off";a.mep.targetEnabled==="gnav"&&(n="on for gnav only");let r=A("personalization"),C=r&&r!==""?"on":"off",b=new URL(window.location.href);b.searchParams.set("mep",c.join("---"));let y="";a.mep?.highlight&&(y='checked="checked"',document.body.dataset.mepHighlight=!0);let w="preview-button";t.innerHTML=`
    <div class="mep-manifest mep-badge">
      <span class="mep-open"></span>
      <div class="mep-manifest-count">${i?.length||0} Manifest(s) served</div>
    </div>
    <div class="mep-popup">
      <div class="mep-popup-header">
        <div>
          <h4>${i?.length||0} Manifest(s) served</h4>
          <span class="mep-close"></span>
          <div class="mep-manifest-page-info-title">Page Info:</div>
          <div>Target integration feature is ${n}</div>
          <div>Personalization feature is ${C}</div>
          <div>Page's Prefix/Region/Locale are ${a.mep.geoPrefix} / ${a.locale.region} / ${a.locale.ietf}</div>
        </div>
      </div>
      <div class="mep-manifest-list">
        <div class="mep-manifest-info">
          <div class="mep-manifest-variants">
            <input type="checkbox" name="mepHighlight" id="mepHighlightCheckbox" ${y} value="true"> <label for="mepHighlightCheckbox">Highlight changes</label>
          </div>
        </div>
        ${o}
        <div class="mep-advanced-container">
          <div class="mep-toggle-advanced">Advanced options</div>
          <div class="mep-manifest-info mep-advanced-options">
            <div>
              Optional: new manifest location or path
            </div>
            <div class="mep-manifest-variants">
              <div>
                <input type="text" name="new-manifest" id="new-manifest">
              </div>
            </div>
          </div>
          <div class="mep-manifest-info">
            <div class="mep-manifest-variants mep-advanced-options">
              <input type="checkbox" name="mepPreviewButtonCheckbox" id="mepPreviewButtonCheckbox" value="off"> <label for="mepPreviewButtonCheckbox">add mepButton=off to preview link</label>
            </div>
          </div>
        </div>
      </div>
      <div class="dark">
        <a class="con-button outline button-l" data-id="${w}" title="Preview above choices">Preview</a>
      </div>
    </div>`;let $=t.querySelector(`a[data-id="${w}"]`);$&&($.href=b.href),e.append(t),R(t)}function _(i){i.forEach(({selectedVariant:e,manifest:t})=>{let o=g(t),c=(a,n="manifestId")=>{document.querySelectorAll(a).forEach(r=>r.dataset[n]=o)};e?.replacefragment?.forEach(({val:a})=>c(`[data-path*="${a}"]`)),e?.useblockcode?.forEach(({selector:a})=>{a&&c(`.${a}`,"codeManifestId")}),e?.updatemetadata?.forEach(({selector:a})=>{a==="gnav-source"&&c("header, footer")}),document.querySelectorAll(`.section[class*="merch-cards"] .fragment[data-manifest-id="${o}"] merch-card`).forEach(a=>a.dataset.manifestId=o)})}async function j(){let{miloLibs:i,codeRoot:e,mep:t}=k();H(`${i||e}/features/personalization/preview.css`),N(t?.experiments),t?.experiments&&_(t.experiments)}export{j as default};
