import{getConfig as e,getFedsPlaceholderConfig as t}from"../../../../utils/utils.js";import{toFragment as a,trigger as s,closeAllDropdowns as i,logErrorFor as l}from"../../utilities/utilities.js";import{replaceKeyArray as o}from"../../../../features/placeholders.js";const n=(t,a="")=>{const s={adminconsole:"https://adminconsole.adobe.com",account:"https://account.adobe.com"};if(!t.length||!s[t])return"";let i;const{env:l}=e();return l?.[t]?(i=new URL(s[t]),i.hostname=l[t]):i=s[t],`${i}${a}`},r=(e,t)=>a`<li><a class="feds-profile-action" href="${n("adminconsole",t)}">${e}</a></li>`;export default class{constructor({rawElem:e,decoratedElem:t,avatar:a,sections:s,buttonElem:i,openOnInit:o}={}){this.placeholders={},this.profileData={},this.avatar=a,this.buttonElem=i,this.decoratedElem=t,this.sections=s,this.openOnInit=o,this.localMenu=e.querySelector("h5")?.parentElement,l(this.init.bind(this),"ProfileDropdown.init()","gnav-profile","e")}async init(){await this.getData(),this.setButtonLabel(),this.dropdown=this.decorateDropdown(),this.addEventListeners(),this.openOnInit&&s({element:this.buttonElem}),this.decoratedElem.append(this.dropdown)}async getData(){[[this.placeholders.profileButton,this.placeholders.signOut,this.placeholders.viewAccount,this.placeholders.manageTeams,this.placeholders.manageEnterprise,this.placeholders.profileAvatar],{displayName:this.profileData.displayName,email:this.profileData.email}]=await Promise.all([o(["profile-button","sign-out","view-account","manage-teams","manage-enterprise","profile-avatar"],t()),window.adobeIMS.getProfile()])}setButtonLabel(){this.buttonElem&&this.buttonElem.setAttribute("aria-label",this.profileData.displayName)}decorateDropdown(){const{locale:t}=e(),s=(e=>{if(!e.length)return"en";const t={"no-NO":"nb"};return t[e]?t[e]:e.split("-")[0]})(t.ietf);return this.avatarElem=a`<img
      data-cs-mask
      class="feds-profile-img"
      src="${this.avatar}"
      tabindex="0"
      alt="${this.placeholders.profileAvatar}"
      data-url="${n("account",`profile?lang=${s}`)}"></img>`,a`
      <div id="feds-profile-menu" class="feds-profile-menu">
        <a
          href="${n("account",`?lang=${s}`)}"
          class="feds-profile-header"
          daa-ll="${this.placeholders.viewAccount}"
          aria-label="${this.placeholders.viewAccount}"
        >
          ${this.avatarElem}
          <div class="feds-profile-details">
            <p data-cs-mask class="feds-profile-name">${this.profileData.displayName}</p>
            <p data-cs-mask class="feds-profile-email">${this.decorateEmail(this.profileData.email)}</p>
            <p class="feds-profile-account">${this.placeholders.viewAccount}</p>
          </div>
        </a>
        ${this.localMenu?this.decorateLocalMenu():""}
        <ul class="feds-profile-actions">
          ${this.sections?.manage?.items?.team?.id?r(this.placeholders.manageTeams,"/team"):""}
          ${this.sections?.manage?.items?.enterprise?.id?r(this.placeholders.manageEnterprise):""}
          ${this.decorateSignOut()}
        </ul>
      </div>
    `}decorateEmail(){const e=this.profileData.email.split("@"),t=e[0].length<=12?e[0]:`${e[0].slice(0,12)}…`,a=e[1].split("."),s=a.pop();let i=a.join(".");return i=i.length<=12?i:`${i.slice(0,12)}…`,`${t}@${i}.${s}`}decorateLocalMenu(){return this.localMenu&&this.localMenu.classList.add("feds-local-menu"),this.localMenu}decorateSignOut(){const e=a`
      <li>
        <a href="#" class="feds-profile-action" daa-ll="${this.placeholders.signOut}">${this.placeholders.signOut}</a>
      </li>
    `;return e.addEventListener("click",(e=>{e.preventDefault(),window.dispatchEvent(new Event("feds:signOut")),window.adobeIMS.signOut()})),e}addEventListeners(){this.buttonElem.addEventListener("click",(e=>s({element:this.buttonElem,event:e}))),this.buttonElem.addEventListener("keydown",(e=>"Escape"===e.code&&i())),this.dropdown.addEventListener("keydown",(e=>"Escape"===e.code&&i())),this.avatarElem.addEventListener("click",(e=>{e.preventDefault(),window.location.assign(this.avatarElem.dataset?.url)}))}}