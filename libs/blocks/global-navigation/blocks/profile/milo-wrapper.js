import { toFragment, getPlaceholders } from '../../utilities.js';

const initProfileButton = async ({
  blockEl,
  decoratedEl,
  avatar,
}) => {
  const placeholders = await getPlaceholders(['profile-button']);

  if (blockEl.children.length > 1) decoratedEl.classList.add('has-menu');
  decoratedEl.closest('nav.gnav')?.classList.add('signed-in');

  const profileButtonEl = toFragment`
      <button 
        class="feds-profile-button" 
        aria-expanded="false" 
        aria-controls="feds-profile-menu"
        aria-label="${placeholders['profile-button'].value}"
        daa-ll="Account"
        aria-haspopup="true"
      > 
        <img class="feds-profile-img" src="${avatar}"></img>
      </button>
    `;
  profileButtonEl.addEventListener('click', () => window.dispatchEvent(new Event('feds:profileButton:clicked')));
  return profileButtonEl;
};

const initProfileMenu = async ({ blockEl, Profile, ...rest }) => {
  const placeholders = await getPlaceholders(['profile-button', 'sign-out', 'view-account', 'manage-teams', 'manage-enterprise']);
  const profile = new Profile({
    localMenu: blockEl.querySelector('h5')?.parentElement,
    placeholders,
    ...rest,
  });
  return profile;
};

export default { initProfileButton, initProfileMenu };
