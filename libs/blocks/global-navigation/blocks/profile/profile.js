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

const decorateAction = (label, href) => toFragment`<li><a class="feds-profile-action" href="${decorateProfileLink(href, 'adminconsole')}">${label}</a></li>`;

class Profile {
  constructor({
    decoratedEl,
    avatar,
    sections,
    profileButtonEl,
    localMenu,
    placeholders,
  }) {
    this.sections = sections;
    this.avatar = avatar;
    this.profileButtonEl = profileButtonEl;
    this.decoratedEl = decoratedEl;
    this.localMenu = localMenu;
    this.placeholders = placeholders;
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
  }

  decorateSignOut() {
    const signOutLink = toFragment`
      <li>
        <a class="feds-profile-action" daa-ll="${this.placeholders['sign-out'].value}">${this.placeholders['sign-out'].value}</a>
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

  menu() {
    // TODO the account name and email might need a bit of adaptive behaviour
    // historically we shrunk the fontsize and displayed the account name on two lines
    // the email had some special logic as well
    // we took a simpler approach ("Some very long name, very l...") for MVP
    return toFragment`
      <div id="feds-profile-menu" class="feds-profile-menu">
        <a 
          href="${decorateProfileLink('https://account.adobe.com', 'account')}" 
          class="feds-profile-header"
          daa-ll="${this.placeholders['view-account'].value}"
          aria-label="${this.accountLinkText}"
        >
          <img class="feds-profile-img" src="${this.avatar}"></img>
          <div class="feds-profile-details">
            <p class="feds-profile-name">${this.displayName}</p>
            <p class="feds-profile-email">${decorateEmail(this.email)}</p>
            <p class="feds-profile-account">${this.placeholders['view-account'].value}</p>
          </div>
        </a>
        ${this.localMenu}
        <ul class="feds-profile-actions">
          ${this.sections.manage.items.team?.id ? decorateAction(this.placeholders['manage-teams'].value, 'https://adminconsole.adobe.com/team') : ''}
          ${this.sections.manage.items.enterprise?.id ? decorateAction(this.placeholders['manage-enterprise'].value, 'https://adminconsole.adobe.com') : ''}
          ${this.decorateSignOut()}
        </ul>
      </div>
    `;
  }
}
export default Profile;
