import{C as c,D as d,e as u,g as n,i as f}from"./chunk-V5EBVEYY.js";import"./chunk-Y4BBGCES.js";import{b as m}from"./chunk-TWIEHJXN.js";import"./chunk-K6YJSUAP.js";import{f as r}from"./chunk-KHBABMXA.js";import"./chunk-YBWLHNHN.js";var E=a=>{if(!a.length)return"en";let e={"no-NO":"nb"};return e[a]?e[a]:a.split("-")[0]},h=(a,e="")=>{let t={adminconsole:"https://adminconsole.adobe.com",account:"https://account.adobe.com"};if(!a.length||!t[a])return"";let s,{env:i}=r();return i?.[a]?(s=new URL(t[a]),s.hostname=i[a]):s=t[a],`${s}${e}`},g=(a,e)=>n`<li><a class="feds-profile-action" href="${h("adminconsole",e)}">${a}</a></li>`,p=class{constructor({rawElem:e,decoratedElem:t,avatar:s,sections:i,buttonElem:o,openOnInit:l}={}){this.placeholders={},this.profileData={},this.avatar=s,this.buttonElem=o,this.decoratedElem=t,this.sections=i,this.openOnInit=l,this.localMenu=e.querySelector("h5")?.parentElement,u(this.init.bind(this),"ProfileDropdown.init()","errorType=error,module=gnav-profile")}async init(){await this.getData(),this.setButtonLabel(),this.dropdown=this.decorateDropdown(),this.addEventListeners(),this.openOnInit&&d({element:this.buttonElem}),this.decoratedElem.append(this.dropdown)}async getData(){[[this.placeholders.profileButton,this.placeholders.signOut,this.placeholders.viewAccount,this.placeholders.manageTeams,this.placeholders.manageEnterprise,this.placeholders.profileAvatar],{displayName:this.profileData.displayName,email:this.profileData.email}]=await Promise.all([m(["profile-button","sign-out","view-account","manage-teams","manage-enterprise","profile-avatar"],f()),window.adobeIMS.getProfile()])}setButtonLabel(){this.buttonElem&&this.buttonElem.setAttribute("aria-label",this.profileData.displayName)}decorateDropdown(){let{locale:e}=r(),t=E(e.ietf);return this.avatarElem=n`<img
      class="feds-profile-img"
      src="${this.avatar}"
      tabindex="0"
      alt="${this.placeholders.profileAvatar}"
      data-url="${h("account",`profile?lang=${t}`)}"></img>`,n`
      <div id="feds-profile-menu" class="feds-profile-menu">
        <a
          href="${h("account",`?lang=${t}`)}"
          class="feds-profile-header"
          daa-ll="${this.placeholders.viewAccount}"
          aria-label="${this.placeholders.viewAccount}"
        >
          ${this.avatarElem}
          <div class="feds-profile-details">
            <p class="feds-profile-name">${this.profileData.displayName}</p>
            <p class="feds-profile-email">${this.decorateEmail(this.profileData.email)}</p>
            <p class="feds-profile-account">${this.placeholders.viewAccount}</p>
          </div>
        </a>
        ${this.localMenu?this.decorateLocalMenu():""}
        <ul class="feds-profile-actions">
          ${this.sections?.manage?.items?.team?.id?g(this.placeholders.manageTeams,"/team"):""}
          ${this.sections?.manage?.items?.enterprise?.id?g(this.placeholders.manageEnterprise):""}
          ${this.decorateSignOut()}
        </ul>
      </div>
    `}decorateEmail(){let t=this.profileData.email.split("@"),s=t[0].length<=12?t[0]:`${t[0].slice(0,12)}\u2026`,i=t[1].split("."),o=i.pop(),l=i.join(".");return l=l.length<=12?l:`${l.slice(0,12)}\u2026`,`${s}@${l}.${o}`}decorateLocalMenu(){return this.localMenu&&this.localMenu.classList.add("feds-local-menu"),this.localMenu}decorateSignOut(){let e=n`
      <li>
        <a href="#" class="feds-profile-action" daa-ll="${this.placeholders.signOut}">${this.placeholders.signOut}</a>
      </li>
    `;return e.addEventListener("click",t=>{t.preventDefault(),window.dispatchEvent(new Event("feds:signOut")),window.adobeIMS.signOut()}),e}addEventListeners(){this.buttonElem.addEventListener("click",e=>d({element:this.buttonElem,event:e})),this.buttonElem.addEventListener("keydown",e=>e.code==="Escape"&&c()),this.dropdown.addEventListener("keydown",e=>e.code==="Escape"&&c()),this.avatarElem.addEventListener("click",e=>{e.preventDefault(),window.location.assign(this.avatarElem.dataset?.url)})}},b=p;export{b as default};
