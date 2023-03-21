import { toFragment, getFedsPlaceholderConfig } from '../../utilities/utilities.js';
import { replaceKey } from '../../../../features/placeholders.js';

const decorateSignIn = async ({ rawElem, decoratedElem }) => {
  const dropdownElem = rawElem.querySelector(':scope > div:nth-child(2)');
  const signInLabel = await replaceKey('sign-in', getFedsPlaceholderConfig());
  let signInElem;

  if (!dropdownElem) {
    signInElem = toFragment`<a href="#" daa-ll="${signInLabel}" class="feds-signIn">${signInLabel}</a>`;

    signInElem.addEventListener('click', (e) => {
      e.preventDefault();
      // TODO confirm adobeIMS is always set
      // e.g. when it's consumed as NPM package or when we are on a consumer page
      window.adobeIMS.signIn();
    });
  } else {
    signInElem = toFragment`<a href="#" daa-ll="${signInLabel}" class="feds-signIn" role="button" aria-expanded="false" aria-haspopup="true">${signInLabel}</a>`;

    signInElem.addEventListener('click', () => {
      const isOpen = signInElem.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        signInElem.setAttribute('aria-expanded', 'false');
      } else {
        signInElem.setAttribute('aria-expanded', 'true');
      }
    });

    dropdownElem.classList.add('feds-signIn-dropdown');

    // TODO we don't have a good way of adding attributes to links
    const dropdownSignIn = dropdownElem.querySelector('[href="https://adobe.com?sign-in=true"]');

    if (dropdownSignIn) {
      dropdownSignIn.addEventListener('click', (e) => {
        e.preventDefault();
        window.adobeIMS.signIn();
      });
    }

    decoratedElem.append(dropdownElem);
  }

  decoratedElem.prepend(signInElem);
};

export default decorateSignIn;
