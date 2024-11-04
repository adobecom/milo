import{b as f}from"./chunk-XA4S2AUY.js";import"./chunk-YBWLHNHN.js";var y=async(i,c=!0)=>{if(!i)return!1;let{live:l,profile:e,webPath:t}=i,s=c?l?.permissions?.includes("write"):!0,u="Publishing is currently disabled for this page",r=await f("/.milo/publish-permissions-config.json"),o=r?.urls?.data?.find(({url:n})=>n.endsWith("**")?t.includes(n.slice(0,-2)):n===t);if(o){s=!1,o.message&&(u=o.message);let n=r[o.group];if(n&&e?.email){let a,p=n.data?.find(({allow:b,deny:d})=>d?(a=!0,d===e.email):b===e.email);s=a?!p:!!p}}return{canPublish:s,message:u}},m=y;var w=".publish.plugin button",x=".profile-email",v="Are you sure? This will publish to production.";function g(i){let c=async(e,t)=>{let{canPublish:s,message:u}=await m(e,!1);s?t.removeAttribute("disabled"):t.setAttribute("disabled",!0);let r=t.querySelector("span"),o=s?v:u;r?r.innerText=o:t.insertAdjacentHTML("beforeend",`<span>${o}</span>`)},l=new CSSStyleSheet;l.replaceSync(`
    :host {
      --bg-color: rgb(129 27 14);
      --text-color: #fff0f0;
      color-scheme: light dark;
    }
    .publish.plugin {
      order: 100;
    }
    .publish.plugin button {
      position: relative;
    }
    .publish.plugin button:not([disabled=true]) {
      background: var(--bg-color);
      border-color: #b46157;
      color: var(--text-color);
    }
    .publish.plugin button:not([disabled=true]):hover {
      background-color: var(--hlx-sk-button-hover-bg);
      border-color: unset;
      color: var(--hlx-sk-button-hover-color);
    }
    .publish.plugin button > span {
      display: none;
      background: #666;
      border-radius: 4px;
      line-height: 1.2rem;
      padding: 8px 12px;
      position: absolute;
      top: 34px;
      left: 50%;
      transform: translateX(-50%);
      width: 150px;
      white-space: pre-wrap;
    }
    .publish.plugin button:not([disabled=true]) > span {
      background: var(--bg-color);
    }
    .publish.plugin button:hover > span {
      display: block;
      color: var(--text-color);
    }
    .publish.plugin button > span:before {
      content: '';
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid #666;
      position: absolute;
      text-align: center;
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
    .publish.plugin button:not([disabled=true]) > span:before {
      border-bottom: 6px solid var(--bg-color);
    }
  `),i.shadowRoot.adoptedStyleSheets=[l],i.addEventListener("statusfetched",async e=>{let t=e?.detail?.data,s=e?.target?.shadowRoot?.querySelector(w);t&&s&&c(t,s)}),setTimeout(async()=>{let e=i.shadowRoot.querySelector(w);e?.setAttribute("disabled",!0);let t=e?.querySelector("span");if(e&&!t){let s={webPath:window.location.pathname,profile:{email:i.shadowRoot.querySelector(x)?.innerText}};c(s,e)}},500)}function S({createTag:i,loadBlock:c,loadScript:l,loadStyle:e}){let t=async o=>{let{host:n,project:a,ref:p,repo:b,owner:d}=o.detail.data.config,{sendToCaaS:h}=await import("https://milo.adobe.com/tools/send-to-caas/send-to-caas.js");h({host:n,project:a,branch:p,repo:b,owner:d},l,e)},s=async()=>{if(document.querySelector('script[type="application/ld+json"]')===null)return;window.open(`https://search.google.com/test/rich-results?url=${encodeURIComponent(window.location.href)}`,"check-schema")},u=async()=>{let o=i("div",{class:"preflight"}),n=await c(o),{getModal:a}=await import("./modal-7AHCVFRD.js");a(null,{id:"preflight",content:n,closeEvent:"closeModal"})};document.addEventListener("send-to-caas",async o=>{let{host:n,project:a,branch:p,repo:b,owner:d}=o.detail,{sendToCaaS:h}=await import("./send-to-caas-ZSPRJRPY.js");h({host:n,project:a,branch:p,repo:b,owner:d},l,e)});let r=document.querySelector("aem-sidekick, helix-sidekick");r.addEventListener("custom:send-to-caas",t),r.addEventListener("custom:check-schema",s),r.addEventListener("custom:preflight",u),r.nodeName==="HELIX-SIDEKICK"&&g(r)}export{S as default};
