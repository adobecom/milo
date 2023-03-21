import { toFragment, getFedsPlaceholderConfig } from '../../utilities/utilities.js';
import { replaceKey } from '../../../../features/placeholders.js';

const decorateButton = async ({ avatar }) => {
  const label = await replaceKey(
    'profile-button',
    getFedsPlaceholderConfig(),
  );

  const buttonElem = toFragment`
      <button 
        class="feds-profile-button" 
        aria-expanded="false" 
        aria-controls="feds-profile-menu"
        aria-label="${label}"
        daa-ll="Account"
        aria-haspopup="true"
      > 
        <img class="feds-profile-img" src="${avatar}"></img>
      </button>
    `;

  return buttonElem;
};

export default decorateButton;
