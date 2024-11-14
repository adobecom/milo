import {
  closeAllDropdowns,
  getFedsPlaceholderConfig,
  logErrorFor,
  toFragment,
  trigger
} from "./chunk-I4EBDGNP.js";
import {
  replaceKeyArray
} from "./chunk-Z64B4EXQ.js";
import "./chunk-LHF7GOQG.js";
import "./chunk-EI44K5W3.js";
import {
  getConfig
} from "./chunk-ZEVYWJU7.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/global-navigation/features/profile/dropdown.js
var getLanguage = (ietfLocale) => {
  if (!ietfLocale.length) return "en";
  const nonStandardLocaleMap = { "no-NO": "nb" };
  if (nonStandardLocaleMap[ietfLocale]) {
    return nonStandardLocaleMap[ietfLocale];
  }
  return ietfLocale.split("-")[0];
};
var decorateProfileLink = (service, path = "") => {
  const defaultServiceUrls = {
    adminconsole: "https://adminconsole.adobe.com",
    account: "https://account.adobe.com"
  };
  if (!service.length || !defaultServiceUrls[service]) return "";
  let serviceUrl;
  const { env } = getConfig();
  if (!env?.[service]) {
    serviceUrl = defaultServiceUrls[service];
  } else {
    serviceUrl = new URL(defaultServiceUrls[service]);
    serviceUrl.hostname = env[service];
  }
  return `${serviceUrl}${path}`;
};
var decorateAction = (label, path) => toFragment`<li><a class="feds-profile-action" href="${decorateProfileLink("adminconsole", path)}">${label}</a></li>`;
var ProfileDropdown = class {
  constructor({
    rawElem,
    decoratedElem,
    avatar,
    sections,
    buttonElem,
    openOnInit
  } = {}) {
    this.placeholders = {};
    this.profileData = {};
    this.avatar = avatar;
    this.buttonElem = buttonElem;
    this.decoratedElem = decoratedElem;
    this.sections = sections;
    this.openOnInit = openOnInit;
    this.localMenu = rawElem.querySelector("h5")?.parentElement;
    logErrorFor(this.init.bind(this), "ProfileDropdown.init()", "errorType=error,module=gnav-profile");
  }
  async init() {
    await this.getData();
    this.setButtonLabel();
    this.dropdown = this.decorateDropdown();
    this.addEventListeners();
    if (this.openOnInit) trigger({ element: this.buttonElem });
    this.decoratedElem.append(this.dropdown);
  }
  async getData() {
    [
      [
        this.placeholders.profileButton,
        this.placeholders.signOut,
        this.placeholders.viewAccount,
        this.placeholders.manageTeams,
        this.placeholders.manageEnterprise,
        this.placeholders.profileAvatar
      ],
      { displayName: this.profileData.displayName, email: this.profileData.email }
    ] = await Promise.all([
      replaceKeyArray(
        ["profile-button", "sign-out", "view-account", "manage-teams", "manage-enterprise", "profile-avatar"],
        getFedsPlaceholderConfig()
      ),
      window.adobeIMS.getProfile()
    ]);
  }
  setButtonLabel() {
    if (this.buttonElem) this.buttonElem.setAttribute("aria-label", this.profileData.displayName);
  }
  decorateDropdown() {
    const { locale } = getConfig();
    const lang = getLanguage(locale.ietf);
    this.avatarElem = toFragment`<img
      class="feds-profile-img"
      src="${this.avatar}"
      tabindex="0"
      alt="${this.placeholders.profileAvatar}"
      data-url="${decorateProfileLink("account", `profile?lang=${lang}`)}"></img>`;
    return toFragment`
      <div id="feds-profile-menu" class="feds-profile-menu">
        <a
          href="${decorateProfileLink("account", `?lang=${lang}`)}"
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
        ${this.localMenu ? this.decorateLocalMenu() : ""}
        <ul class="feds-profile-actions">
          ${this.sections?.manage?.items?.team?.id ? decorateAction(this.placeholders.manageTeams, "/team") : ""}
          ${this.sections?.manage?.items?.enterprise?.id ? decorateAction(this.placeholders.manageEnterprise) : ""}
          ${this.decorateSignOut()}
        </ul>
      </div>
    `;
  }
  decorateEmail() {
    const maxCharacters = 12;
    const emailParts = this.profileData.email.split("@");
    const username = emailParts[0].length <= maxCharacters ? emailParts[0] : `${emailParts[0].slice(0, maxCharacters)}\u2026`;
    const domainArr = emailParts[1].split(".");
    const tld = domainArr.pop();
    let domain = domainArr.join(".");
    domain = domain.length <= maxCharacters ? domain : `${domain.slice(0, maxCharacters)}\u2026`;
    return `${username}@${domain}.${tld}`;
  }
  decorateLocalMenu() {
    if (this.localMenu) this.localMenu.classList.add("feds-local-menu");
    return this.localMenu;
  }
  decorateSignOut() {
    const signOutLink = toFragment`
      <li>
        <a href="#" class="feds-profile-action" daa-ll="${this.placeholders.signOut}">${this.placeholders.signOut}</a>
      </li>
    `;
    signOutLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.dispatchEvent(new Event("feds:signOut"));
      window.adobeIMS.signOut();
    });
    return signOutLink;
  }
  addEventListeners() {
    this.buttonElem.addEventListener("click", (e) => trigger({ element: this.buttonElem, event: e }));
    this.buttonElem.addEventListener("keydown", (e) => e.code === "Escape" && closeAllDropdowns());
    this.dropdown.addEventListener("keydown", (e) => e.code === "Escape" && closeAllDropdowns());
    this.avatarElem.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.assign(this.avatarElem.dataset?.url);
    });
  }
};
var dropdown_default = ProfileDropdown;
export {
  dropdown_default as default
};
//# sourceMappingURL=dropdown-TP2KXQKZ.js.map
