import { getConfig } from '../../../../utils/utils.js';
import { toFragment, getFedsPlaceholderConfig, trigger, closeAllDropdowns } from '../../utilities/utilities.js';
import { replaceKeyArray } from '../../../../features/placeholders.js';

const getLanguage = (ietfLocale) => {
  if (!ietfLocale.length) return 'en';

  const nonStandardLocaleMap = { 'no-NO': 'nb' };

  if (nonStandardLocaleMap[ietfLocale]) {
    return nonStandardLocaleMap[ietfLocale];
  }

  return ietfLocale.split('-')[0];
};

const decorateProfileLink = (service, path = '') => {
  const defaultServiceUrls = {
    adminconsole: 'https://adminconsole.adobe.com',
    account: 'https://account.adobe.com',
  };

  if (!service.length || !defaultServiceUrls[service]) return '';

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

const decorateAction = (label, path) => toFragment`<li><a class="feds-profile-action" href="${decorateProfileLink('adminconsole', path)}">${label}</a></li>`;

class ProfileDropdown {
  constructor({
    rawElem,
    decoratedElem,
    avatar,
    sections,
    buttonElem,
    openOnInit,
  } = {}) {
    this.placeholders = {};
    this.profileData = {};
    this.avatar = avatar;
    this.buttonElem = buttonElem;
    this.decoratedElem = decoratedElem;
    this.sections = sections;
    this.openOnInit = openOnInit;
    this.localMenu = rawElem.querySelector('h5')?.parentElement;
    this.init();
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
      ],
      // TODO: sanity checks if the user is logged in and mandatory properties are set.
      // If not, add logs providing guidance for developers
      { displayName: this.profileData.displayName, email: this.profileData.email },
    ] = await Promise.all([
      replaceKeyArray(
        ['profile-button', 'sign-out', 'view-account', 'manage-teams', 'manage-enterprise'],
        getFedsPlaceholderConfig(),
        'feds',
      ),
      window.adobeIMS.getProfile(),
    ]);
  }

  setButtonLabel() {
    if (this.buttonElem) this.buttonElem.setAttribute('aria-label', this.profileData.displayName);
  }

  decorateDropdown() {
    const { locale } = getConfig();
    const lang = getLanguage(locale.ietf);

    // TODO: the account name and email might need a bit of adaptive behavior;
    // historically we shrunk the font size and displayed the account name on two lines;
    // the email had some special logic as well;
    // for MVP, we took a simpler approach ("Some very long name, very l...")
    // TODO: historically, clicking the avatar lead to '/profile',
    // but clicking the 'View account link' let to the account page;
    // we need to check whether this is still needed
    return toFragment`
      <div id="feds-profile-menu" class="feds-profile-menu">
        <a 
          href="${decorateProfileLink('account', `?lang=${lang}`)}"
          class="feds-profile-header"
          daa-ll="${this.placeholders.viewAccount}"
          aria-label="${this.placeholders.viewAccount}"
        >
          <img class="feds-profile-img" src="${this.avatar}"></img>
          <div class="feds-profile-details">
            <p class="feds-profile-name">${this.profileData.displayName}</p>
            <p class="feds-profile-email">${this.decorateEmail(this.profileData.email)}</p>
            <p class="feds-profile-account">${this.placeholders.viewAccount}</p>
          </div>
        </a>
        ${this.localMenu ? this.decorateLocalMenu() : ''}
        <ul class="feds-profile-actions">
          ${this.sections?.manage?.items?.team?.id ? decorateAction(this.placeholders.manageTeams, '/team') : ''}
          ${this.sections?.manage?.items?.enterprise?.id ? decorateAction(this.placeholders.manageEnterprise) : ''}
          ${this.decorateSignOut()}
        </ul>
      </div>
    `;
  }

  decorateEmail() {
    const maxCharacters = 12;
    const emailParts = this.profileData.email.split('@');
    const username = emailParts[0].length <= maxCharacters
      ? emailParts[0]
      : `${emailParts[0].slice(0, maxCharacters)}…`;
    const domainArr = emailParts[1].split('.');
    const tld = domainArr.pop();
    let domain = domainArr.join('.');
    domain = domain.length <= maxCharacters
      ? domain
      : `${domain.slice(0, maxCharacters)}…`;

    return `${username}@${domain}.${tld}`;
  }

  decorateLocalMenu() {
    if (this.localMenu) this.localMenu.classList.add('feds-local-menu');

    return this.localMenu;
  }

  decorateSignOut() {
    const signOutLink = toFragment`
      <li>
        <a href="#" class="feds-profile-action" daa-ll="${this.placeholders.signOut}">${this.placeholders.signOut}</a>
      </li>
    `;

    // TODO consumers might want to execute their own logic before a sign out
    // we might want to provide them a way to do so here
    signOutLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.adobeIMS.signOut();
    });

    return signOutLink;
  }

  addEventListeners() {
    this.buttonElem.addEventListener('click', () => trigger({ element: this.buttonElem }));
    this.buttonElem.addEventListener('keydown', (e) => e.code === 'Escape' && closeAllDropdowns());
    this.dropdown.addEventListener('keydown', (e) => e.code === 'Escape' && closeAllDropdowns());
  }
}

export default ProfileDropdown;
