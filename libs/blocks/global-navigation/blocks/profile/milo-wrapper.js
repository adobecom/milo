import { toFragment, getFedsPlaceholderConfig } from '../../utilities/utilities.js';
import {
  replaceKey,
  replaceKeyArray,
} from '../../../../features/placeholders.js';

const initProfileButton = async ({ blockEl, decoratedEl, avatar }) => {
  const profileButtonLabel = await replaceKey(
    'profile-button',
    getFedsPlaceholderConfig(),
  );
  if (blockEl.children.length > 1) decoratedEl.classList.add('has-menu');
  decoratedEl.closest('nav.gnav')?.classList.add('signed-in');

  const profileButtonEl = toFragment`
      <button 
        class="feds-profile-button" 
        aria-expanded="false" 
        aria-controls="feds-profile-menu"
        aria-label="${profileButtonLabel}"
        daa-ll="Account"
        aria-haspopup="true"
      > 
        <img class="feds-profile-img" src="${avatar}"></img>
      </button>
    `;
  profileButtonEl.addEventListener('click', () => window.dispatchEvent(new Event('feds:profileButton:clicked')));
  return profileButtonEl;
};

const initProfileMenu = async ({ blockEl, ProfileClass, ...rest }) => {
  const placeholders = {};
  [
    placeholders.profileButton,
    placeholders.signOut,
    placeholders.viewAccount,
    placeholders.manageTeams,
    placeholders.manageEnterprise,
  ] = await replaceKeyArray(
    [
      'profile-button',
      'sign-out',
      'view-account',
      'manage-teams',
      'manage-enterprise',
    ],
    getFedsPlaceholderConfig(),
  );
  const profile = new ProfileClass({
    localMenu: blockEl.querySelector('h5')?.parentElement,
    placeholders,
    ...rest,
  });
  return profile;
};

export default { initProfileButton, initProfileMenu };
