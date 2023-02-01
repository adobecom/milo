import { toFragment } from '../../utilities.js';
import { MenuControls } from '../../delayed-utilities.js';
import Profile from './profile.js';
import { loadStyle } from '../../../../utils/utils.js';

const loadStyles = (path) => new Promise((resolve) => {
  loadStyle(`https://www.adobe.com/${path}`, resolve);
});

// TODO Don't commit into main for now, this is a POC only
// usage might look something like this:
// const target = document.querySelector('.feds-login')
// const token = window.feds.utilities.imslib.getAccessToken();
// if (!token) {
//     target.addEventListener('click', () => {
//         window.feds.utilities.imslib.signIn();
//     });
// }
// await loadScript('http://localhost:6456/build/profile-wrapper-build.umd.js');
// window.adobeProfile({target});

// TODOS
// - keep the API consistent with the old profile, so it's just switching out an URL?
// - the menucontrols are quite tightly tied to milo. this won't work as there's JS errors
// regarding the curtain
const profileWrapper = async ({ target }) => {
  const accessToken = window.adobeIMS.getAccessToken();
  await loadStyles('libs/styles/variables.css');
  await loadStyles('libs/blocks/global-navigation/blocks/profile/profile.css');
  await loadStyles('libs/blocks/global-navigation/blocks/profile/profile-wrapper.css');
  const profileRes = accessToken
    ? await fetch('https://cc-collab-stage.adobe.io/profile', { headers: new Headers({ Authorization: `Bearer ${accessToken.token}` }) })
    : {};
  const {
    sections,
    user: { avatar },
  } = await profileRes.json();
  const avatarImgEl = toFragment`<img class="gnav-profile-img" src="${avatar}"></img>`;
  const signOutEl = toFragment`<a href="https://account.adobe.com/">Sign Out</a>`;
  const manageTeamsEl = toFragment`<a href="https://adminconsole.adobe.com/team">Manage Team</a>`;
  const manageEnterpriseEl = toFragment`<a href="https://adminconsole.adobe.com/">Manage Enterprise</a>`;
  const accountLinkEl = toFragment`<a href="https://account.adobe.com/">View Account</a>`;
  const decoratedEl = toFragment`
  <div class="gnav-profile">
    <button class="gnav-profile-button" aria-expanded="false" aria-controls="gnav-profile-menu" aria-label="Profile button"> 
      ${avatarImgEl}
    </button>
  </div>
`;

  const profile = new Profile({
    toggleMenu: new MenuControls().toggleMenu,
    avatarImgEl,
    sections,
    accountLinkEl,
    decoratedEl,
    signOutEl,
    manageTeamsEl,
    manageEnterpriseEl,
  });

  target.parentNode.replaceChild(decoratedEl, target);
  return profile;
};

window.adobeProfile = profileWrapper;

export default profileWrapper;
