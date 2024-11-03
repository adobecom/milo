import{D as S,E as A,d as c,e as f,g as i,h as L,i as $,j as m,k as E,n as M,o as C,p as x}from"./chunk-MSFBWOG7.js";import{b}from"./chunk-6BOSLXEP.js";import{a as k}from"./chunk-3ELCGEYD.js";import"./chunk-WT37DKJ5.js";import{c as y,f as P,i as v,u as w}from"./chunk-7TJA6U3A.js";import"./chunk-YBWLHNHN.js";var{miloLibs:F,codeRoot:I,locale:g,mep:R}=P(),D=F||I,T={socialPlatforms:["facebook","instagram","twitter","linkedin","pinterest","discord","behance","youtube","weibo","social-media"],delays:{decoration:3e3}},p=class{constructor({block:e}={}){this.block=e,this.elements={},this.init()}init=()=>f(async()=>{let e,o={rootMargin:"300px 0px"},s=new window.IntersectionObserver(r=>{r.find(t=>t.isIntersecting===!0)&&(clearTimeout(e),s.disconnect(),this.decorateContent())},o);s.observe(this.block),e=setTimeout(()=>{s.disconnect(),this.decorateContent()},T.delays.decoration)},"Error in global footer init","errorType=error,module=global-footer");decorateContent=()=>f(async()=>{let e=y("footer-source")||`${g.contentRoot}/footer`;if(this.body=await A({url:e,shouldDecorateLinks:!1}),!this.body)return;let[o,s]=[".region-selector",".social"].map(n=>this.body.querySelector(n)),[r,a]=[o?.parentElement,s?.parentElement];[r,a].forEach(n=>n?.replaceChildren()),w(this.body),r?.appendChild(o),a?.appendChild(s);let t=b(e);L({section:this.body,forceFederate:t.includes("/federal/")});let l=[C,this.decorateGrid,this.decorateProducts,this.loadIcons,this.decorateRegionPicker,this.decorateSocial,this.decoratePrivacy,this.decorateFooter];for await(let n of l)await S(),await n();let d=R?.martech||"";this.block.setAttribute("daa-lh",`gnav|${E()}|footer${d}`),this.block.append(this.elements.footer)},"Failed to decorate footer content","errorType=error,module=global-footer");loadMenuLogic=async()=>(this.menuLogic=this.menuLogic||new Promise(async e=>{let o=await x();this.decorateMenu=o.decorateMenu,this.decorateLinkGroup=o.decorateLinkGroup,e()}),this.menuLogic);decorateGrid=async()=>{this.elements.footerMenu="";let e=this.body.querySelectorAll(":scope > div > h2:first-child");return!e||!e.length?this.elements.footerMenu:(this.elements.footerMenu=i`<div class="feds-menu-content"></div>`,e.forEach(o=>this.elements.footerMenu.appendChild(o.parentElement)),await this.loadMenuLogic(),await this.decorateMenu({item:this.elements.footerMenu,type:"footerMenu"}),this.elements.headlines=this.elements.footerMenu.querySelectorAll(".feds-menu-headline"),this.elements.footerMenu)};loadIcons=async()=>{let e=await fetch(`${D}/blocks/global-footer/icons.svg`);e.ok||c({message:"Issue with loadIcons",e:`${e.statusText} url: ${e.url}`,tags:"errorType=info,module=global-footer"});let o=await e.text(),s=i`<div class="feds-footer-icons">${o}</div>`;this.block.append(s)};decorateProducts=async()=>{this.elements.featuredProducts="";let e=this.body.querySelector(".link-group");if(!e)return this.elements.featuredProducts;let o=e.parentElement;this.elements.featuredProducts=i`<div class="feds-featuredProducts"></div>`;let[s]=await Promise.all([k("featured-products",$()),this.loadMenuLogic()]);return s&&s.length&&this.elements.featuredProducts.append(i`<span class="feds-featuredProducts-label">${s}</span>`),o.querySelectorAll(".link-group").forEach(r=>{this.elements.featuredProducts.append(this.decorateLinkGroup(r))}),this.elements.featuredProducts};decorateRegionPicker=async()=>{this.elements.regionPicker="";let e=this.body.querySelector(".region-selector a");if(!e)return this.elements.regionPicker;let o;try{o=new URL(e.href)}catch{return c({message:`Could not create URL for region picker; href: ${e.href}`,tags:"errorType=error,module=global-footer"}),this.elements.regionPicker}let s=import("./modal-6G3H3KLH.js"),r="feds-regionPicker",a=i`<span class="feds-regionPicker-text">${e.textContent}</span>`,t=i`
      <a
        href="${e.href}"
        class="${r}"
        aria-expanded="false"
        aria-haspopup="true"
        role="button">
        <svg xmlns="http://www.w3.org/2000/svg" class="feds-regionPicker-globe" focusable="false">
          <use href="#footer-icon-globe" />
        </svg>
        ${a}
      </a>`;t.classList.add("modal","link-block"),t.dataset.modalPath=o.pathname,t.dataset.modalHash=o.hash,t.href=o.hash;let l="feds-regionPicker-wrapper";this.elements.regionPicker=i`<div class="${l}">
        ${t}
      </div>`;let d=()=>t.getAttribute("aria-expanded")==="true";if(o.hash!==""){t.classList[0]!=="modal"&&c({message:`Modal block class missing from region picker pre loading the block; locale: ${g}; regionPickerElem: ${t.outerHTML}`,tags:"errorType=warn,module=global-footer"});let{default:n}=await s;await n(t),t.classList[0]!=="modal"&&c({message:`Modal block class missing from region picker post loading the block; locale: ${g}; regionPickerElem: ${t.outerHTML}`,tags:"errorType=warn,module=global-footer"}),t.addEventListener("click",()=>{d()||t.setAttribute("aria-expanded","true")}),window.addEventListener("milo:modal:closed",()=>{d()&&t.setAttribute("aria-expanded","false")})}else{t.href="#",e.href=v(e.href),this.elements.regionPicker.append(e);let{default:n}=await s;await n(e),t.addEventListener("click",u=>{u.preventDefault(),import("./region-nav-RP2O2GFU.js");let q=t.getAttribute("aria-expanded")==="true";t.setAttribute("aria-expanded",!q)}),document.addEventListener("click",u=>{d()&&!u.target.closest(`.${l}`)&&t.setAttribute("aria-expanded",!1)})}return this.regionPicker};decorateSocial=()=>{this.elements.social="";let e=this.body.querySelector(".social");if(!e)return this.elements.social;let o=i`<ul class="feds-social" daa-lh="Social"></ul>`,s=r=>r.replace("#_blank","").replace("#_dnb","");return T.socialPlatforms.forEach((r,a)=>{let t=e.querySelector(`a[href*="${r}"]`);if(!t)return;let l=i`<li class="feds-social-item">
          <a
            href="${s(t.href)}"
            class="feds-social-link"
            aria-label="${r}"
            daa-ll="${m(r,a+1)}"
            target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" class="feds-social-icon" alt="${r} logo">
              <use href="#footer-icon-${r}" />
            </svg>
          </a>
        </li>`;o.append(l)}),this.elements.social=o.childElementCount!==0?o:"",this.elements.social};decoratePrivacy=()=>{this.elements.legal="";let e=this.body.querySelector("div > p > em");if(!e)return this.elements.legal;let o=e.closest("div"),s=new Date().getFullYear();for(e.replaceWith(i`<span class="feds-footer-copyright">
        Copyright © ${s} ${e.textContent}
      </span>`),o.querySelector('a[href*="#interest-based-ads"]')?.prepend(i`<svg xmlns="http://www.w3.org/2000/svg" class="feds-adChoices-icon" focusable="false">
        <use href="#footer-icon-adchoices" />
      </svg>`),this.elements.legal=i`<div class="feds-footer-legalWrapper" daa-lh="Legal"></div>`;o.children.length;){let a=o.firstElementChild;a.classList.add("feds-footer-privacySection"),a.querySelectorAll("a").forEach((t,l)=>{t.classList.add("feds-footer-privacyLink"),t.setAttribute("daa-ll",m(t.textContent,l+1))}),this.elements.legal.append(a)}return this.elements.legal};decorateFooter=()=>(this.elements.footer=i`<div class="feds-footer-wrapper">
        ${this.elements.footerMenu}
        ${this.elements.featuredProducts}
        <div class="feds-footer-options">
          <div class="feds-footer-miscLinks">
            ${this.elements.regionPicker}
            ${this.elements.social}
          </div>
          ${this.elements.legal}
        </div>
      </div>`,this.elements.footer)};function G(h){try{let e=new p({block:h});return M()&&h.classList.add("feds--dark"),e}catch(e){return c({message:"Could not create footer",e}),null}}export{G as default};
