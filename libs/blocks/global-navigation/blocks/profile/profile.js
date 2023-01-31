import { getConfig } from '../../../../utils/utils.js';
import { toFragment } from '../../utilities.js';

const decorateEmail = (email) => {
  const MAX_CHAR = 12;
  const emailParts = email.split('@');
  const username = emailParts[0].length <= MAX_CHAR ? emailParts[0] : `${emailParts[0].slice(0, MAX_CHAR)}…`;
  const domainArr = emailParts[1].split('.');
  const tld = domainArr.pop();
  let domain = domainArr.join('.');
  domain = domain.length <= MAX_CHAR ? domain : `${domain.slice(0, MAX_CHAR)}…`;
  return `${username}@${domain}.${tld}`;
};

const decorateProfileLink = (href, service) => {
  const env = getConfig();
  const name = env.name || 'prod';
  if (name === 'prod') return href;
  const url = new URL(href);
  url.hostname = env[service];
  return url.href;
};

const decorateAction = (actionEl) => {
  if (!actionEl) return '';
  actionEl.href = decorateProfileLink(actionEl.href, 'adminconsole');
  return toFragment`<li class="feds-profile-action">${actionEl}</li>`;
};

class Profile {
  constructor({
    decoratedEl,
    avatarImgEl,
    sections,
    toggleMenu,
    profileButtonEl,
    accountLinkEl,
    signOutEl,
    manageTeamsEl,
    manageEnterpriseEl,
    localMenu,
  }) {
    this.sections = sections;
    this.avatarImgEl = avatarImgEl;
    this.accountLinkEl = accountLinkEl;
    this.signOutEl = signOutEl;
    this.manageTeamsEl = manageTeamsEl;
    this.manageEnterpriseEl = manageEnterpriseEl;
    this.toggleMenu = toggleMenu;
    this.profileButtonEl = profileButtonEl;
    this.decoratedEl = decoratedEl;
    this.localMenu = localMenu;
    if (localMenu) {
      localMenu.classList.add('feds-local-menu');
    }
    this.init();
  }

  async init() {
    // TODO do some sanity checks if the user is logged in, the mandatory properties are set.
    // If not there should be helpful logs providing guidance for developers
    const { displayName, email } = await window.adobeIMS.getProfile();
    if (this.profileButtonEl) this.profileButtonEl.setAttribute('aria-label', displayName);
    this.displayName = displayName;
    this.email = email;
    this.decoratedEl.append(this.menu());
    this.decoratedEl.addEventListener('click', () => this.toggleMenu(this.decoratedEl));
    this.decoratedEl.dispatchEvent(new Event('profile_ready'));
  }

  decorateSignOut() {
    // TODO integrate the placeholders here
    const signOutLink = toFragment`
      <li>
        <a class="feds-profile-action" daa-ll="Sign Out">Sign Out</a>
      </li>
    `;
    signOutLink.addEventListener('click', (e) => {
      // TODO consumers might want to execute their own logic before a sign out
      // we might want to provide them a way to do so here
      e.preventDefault();
      window.adobeIMS.signOut();
    });
    return signOutLink;
  }

  menu() {
    // TODO integrate placerholders here, for the view account // and profile actions
    // TODO the account name and email might need a bit of adaptive behaviour
    // historically we shrunk the fontsize and displayed the account name on two lines
    // the email had some special logic as well
    // we took a simpler approach ("Some very long name, very l...") for MVP
    // also TODO, TAKE A GOOD LOOK AT THE TEMPLATE WHEN DOING THE PLACEHOLDERS.
    return toFragment`
      <div id="feds-profile-menu" class="feds-profile-menu">
        <a 
          href="${decorateProfileLink('https://account.adobe.com/', 'account')}" 
          class="feds-profile-header"
          daa-ll="View Account"
          aria-label="${this.accountLinkText}"
        >
          ${this.avatarImgEl.cloneNode(true)}
          <div class="feds-profile-details">
            <p class="feds-profile-name">${this.displayName}</p>
            <p class="feds-profile-email">${decorateEmail(this.email)}</p>
            <p class="feds-profile-account">View Account</p>
          </div>
        </a>
        ${this.localMenu}
        <ul class="feds-profile-actions">
          ${this.sections.manage.items.team?.id ? decorateAction(this.manageTeamsEl) : ''}
          ${this.sections.manage.items.enterprise?.id ? decorateAction(this.manageEnterpriseEl) : ''}
          ${this.decorateSignOut()}
        </ul>
      </div>
    `;
  }
}
export default Profile;
