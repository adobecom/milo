import { getConfig, createTag, getFedsPlaceholderConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

function decorateEmail(email) {
  const MAX_CHAR = 12;
  const emailParts = email.split('@');
  const username = emailParts[0].length <= MAX_CHAR ? emailParts[0] : `${emailParts[0].slice(0, MAX_CHAR)}…`;
  const domainArr = emailParts[1].split('.');
  const tld = domainArr.pop();
  let domain = domainArr.join('.');
  domain = domain.length <= MAX_CHAR ? domain : `${domain.slice(0, MAX_CHAR)}…`;
  return `${username}@${domain}.${tld}`;
}

function decorateProfileLink(href, service) {
  const { env } = getConfig();
  if (env.name === 'prod') return href;
  const url = new URL(href);
  url.hostname = env[service];
  return url.href;
}

function decorateProfileMenu(blockEl, profileEl, profiles, toggle) {
  const { displayName, email } = profiles.ims;
  const avatar = profiles.io?.images?.['138'] || '';

  const displayEmail = decorateEmail(email);
  const avatarImg = createTag('img', { class: 'gnav-profile-img', src: avatar });
  const accountLink = blockEl.querySelector('div > div > p:nth-child(2) a');

  const profileButton = createTag(
    'button',
    {
      class: 'gnav-profile-button',
      'aria-label': displayName,
      'aria-expanded': false,
      'aria-controls': 'gnav-profile-menu',
    },
    avatarImg,
  );
  profileButton.addEventListener('click', () => { toggle(profileEl); });

  const profileMenu = createTag('div', { id: 'gnav-profile-menu', class: 'gnav-profile-menu' });
  const profileHeader = createTag('a', { class: 'gnav-profile-header' });
  const profileDetails = createTag('div', { class: 'gnav-profile-details' });
  const profileActions = createTag('ul', { class: 'gnav-profile-actions' });

  profileHeader.href = decorateProfileLink(accountLink.href, 'account');
  profileHeader.setAttribute('aria-label', accountLink.textContent);

  const profileImg = avatarImg.cloneNode(true);
  const profileName = createTag('p', { class: 'gnav-profile-name' }, displayName);
  const profileEmail = createTag('p', { class: 'gnav-profile-email' }, displayEmail);
  const accountText = blockEl.querySelector('div > div > p:nth-child(2) a').innerHTML;
  const profileViewAccount = createTag('p', { class: 'gnav-profile-account' }, accountText);
  profileDetails.append(profileName, profileEmail, profileViewAccount);

  if (profiles.hasOrgs) {
    const adminConsoleLink = createTag('a', { href: decorateProfileLink('https://adminconsole.adobe.com', 'adminconsole') }, profiles.goToAdminConsole || 'Go to Admin Console');
    const adminConsoleItem = createTag('li', { class: 'gnav-profile-action' }, adminConsoleLink);
    profileActions.append(adminConsoleItem);
  }

  const signOutLink = blockEl.querySelector('div > div > p:nth-child(5) a');
  signOutLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.adobeIMS.signOut({ redirect_uri: window.location.href });
  });
  const signOut = createTag('li', { class: 'gnav-profile-action' }, signOutLink);
  profileActions.append(signOut);

  profileHeader.append(profileImg, profileDetails);
  profileMenu.append(profileHeader, profileActions);
  profileEl.append(profileButton, profileMenu);
}

export default async function getProfile(blockEl, profileEl, toggle, ioResp, hasOrgs) {
  const gnav = profileEl.closest('nav.gnav');
  gnav.classList.add('signed-in');

  const profiles = {};
  [profiles.ims, profiles.io, profiles.goToAdminConsole] = await Promise.all([
    window.adobeIMS.getProfile(),
    ioResp.json(),
    replaceKey('go-to-admin-console', getFedsPlaceholderConfig()),
  ]);
  profiles.hasOrgs = hasOrgs;
  decorateProfileMenu(blockEl, profileEl, profiles, toggle);
}
