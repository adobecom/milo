import{a as v}from"./chunk-YLISDLB5.js";import{c as l,f as g,h as i}from"./chunk-VP5VJMKQ.js";import"./chunk-YBWLHNHN.js";var f="active",D="enabled",m="inactive",N={active:"Displayed in green, this status appears when a user is on an entry page or a page with the Dynamic Nav enabled, indicating that the nav is fully functioning.",enabled:'Displayed in yellow, this status indicates that the Dynamic Nav is set to "on," but the user has not yet visited an entry page.',inactive:"Displayed in red, this status indicates that the Dynamic Nav is either not configured or has been disabled."},E=(t,s,e)=>t==="on"&&s||e,L=(t,s,e)=>t==="entry"?f:s?m:t==="on"&&e?f:t==="on"&&!e?D:m,V=(t,s,e=!1)=>{if(!t||t.length===0)return;let a=t.split(","),o=i("table"),r=Array.isArray(e)&&e.flat();o.innerHTML=`
      <caption>Disable Values</caption>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Match?</th>
        </tr>
      </thead>
      <tbody>
      </tbody>`;let d=o.querySelector("tbody");a.forEach(c=>{let n=i("tr"),[S,p]=c.split(";"),u=i("td"),y=i("td"),h=i("td");u.innerText=S,y.innerText=p,h.innerText=r&&r.includes(p)?"yes":"no",n.append(u,y,h),d.append(n)}),s.append(o)},b=t=>t.startsWith("https://")?new URL(t).pathname:"",w=t=>{let s=window.sessionStorage.getItem("gnavSource"),e=l("gnav-source")||"Metadata not found: site gnav source",a=l("dynamic-nav"),o=E(a,s,e),r=l("dynamic-nav-disable"),d=v(),c=L(a,d.length>=1,s),n=i("div",{class:"dynamic-nav-status"});return n.innerHTML=`
    <span class="title"><span class="dns-badge"></span>Dynamic Nav</span>
    <section class="details hidden">
      <span class="dns-close"></span>
      <div class="message additional-info">
        <p>Additional Info:
          <span>${N[c]}</span>
        </p>
      </div>
      <p class="status">Status: <span>${c}</span></p> 
      <p class="setting">Setting: <span>${a}</span></p>
      <p class="consumer-key">Consumer key: <span>${t}</span></p>
      <div class="nav-source-info">
        <p>Authored and stored source match: <span>${e===o}</span></p>
        <p>Authored Nav Source:
        <span>${b(e)}</span></p>
        <p>Stored Nav Source:
        <span>${b(o)}</span></p>
      </div>
      <div class="disable-values">
      </div>
    </section>
  `,V(r,n.querySelector(".disable-values"),d),n.classList.add(c),n.addEventListener("click",()=>{n.querySelector(".details").classList.toggle("hidden"),n.querySelector(".dns-badge").classList.toggle("dns-open")}),n};async function x(){let{dynamicNavKey:t}=g(),s=w(t),e=document.querySelector(".feds-topnav"),a=document.querySelector(".feds-nav-wrapper");s.querySelector(".dns-close").addEventListener("click",()=>{e.removeChild(s)}),a.after(s)}export{f as ACTIVE,D as ENABLED,m as INACTIVE,x as default,N as tooltipInfo};
