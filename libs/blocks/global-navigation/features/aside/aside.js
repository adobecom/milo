import { loadBlock, decorateAutoBlock, loadStyle, getConfig } from '../../../../utils/utils.js';
import { toFragment, lanaLog } from '../../utilities/utilities.js';
import { processTrackingLabels } from '../../../../martech/attributes.js';

const DISMISSED_KEY = (promoPath) => `gnav-promo-dismissed:${promoPath}`;

const closeSvg = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <g transform="translate(-10500 3403)">
                      <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"></circle>
                      <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"></line>
                      <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"></line>
                    </g>
                  </svg>`;

function addCloseButton(aside, fedsPromoWrapper, promoPath, headerElem) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/blocks/global-navigation/features/aside/aside.css`);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'promo-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = closeSvg;

  aside.querySelector('.foreground').appendChild(closeBtn);

  closeBtn.addEventListener('click', () => {
    localStorage.setItem(DISMISSED_KEY(promoPath), '1');
    fedsPromoWrapper.remove();
    headerElem.classList.remove('has-promo');

    const header = document.querySelector('header');
    const localNav = document.querySelector('.feds-localnav');
    if (header) header.style.top = '0';
    if (localNav) localNav.style.top = '0';

    document.dispatchEvent(new CustomEvent('milo:sticky:closed'));
  });
}

export default async function decorateAside({ headerElem, fedsPromoWrapper, promoPath } = {}) {
  const onError = () => {
    fedsPromoWrapper?.remove();
    headerElem?.classList.remove('has-promo');
    lanaLog({
      message: 'Gnav Promo fragment not replaced, potential CLS',
      tags: 'aside',
      severity: 'warning',
    });
    return '';
  };

  if (localStorage.getItem(DISMISSED_KEY(promoPath))) {
    fedsPromoWrapper?.remove();
    headerElem?.classList.remove('has-promo');
    return '';
  }

  const fragLink = toFragment`<a href="${promoPath}">${promoPath}</a>`;
  const fragTemplate = toFragment`<div>${fragLink}</div>`;
  decorateAutoBlock(fragLink);
  if (!fragLink.classList.contains('fragment')) return onError();
  await loadBlock(fragLink).catch(() => onError());
  const aside = fragTemplate.querySelector('.aside');
  if (fragTemplate.contains(fragLink) || !aside) return onError();

  aside.removeAttribute('data-block');
  aside.setAttribute('daa-lh', 'Promo');

  aside.querySelectorAll('a').forEach((link, index) => {
    link.setAttribute('daa-ll', `${processTrackingLabels(link.textContent)}--${index + 1}`);
  });

  if (aside.classList.contains('dismissable')) {
    addCloseButton(aside, fedsPromoWrapper, promoPath, headerElem);
  }

  return aside;
}
