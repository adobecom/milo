import { loadBlock, decorateAutoBlock } from '../../../../utils/utils.js';
import { toFragment, lanaLog } from '../../utilities/utilities.js';
import { processTrackingLabels } from '../../../../martech/attributes.js';

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

  const fragLink = toFragment`<a href="${promoPath}">${promoPath}</a>`;
  const fragTemplate = toFragment`<div>${fragLink}</div>`;
  decorateAutoBlock(fragLink);
  if (!fragLink.classList.contains('fragment')) return onError();
  await loadBlock(fragLink).catch(() => onError());
  const aside = fragTemplate.querySelector('.aside');
  if (fragTemplate.contains(fragLink) || !aside) return onError();

  aside.removeAttribute('data-block');
  aside.setAttribute('daa-lh', 'Promo');

  const hasBackgroundImage = !!aside.querySelector(':scope > .background img, :scope > .background picture');
  if (hasBackgroundImage && !aside.style.backgroundColor) {
    aside.style.backgroundColor = aside.classList.contains('dark') ? '#000' : '#fff';
  }

  aside.querySelectorAll('a').forEach((link, index) => {
    link.setAttribute('daa-ll', `${processTrackingLabels(link.textContent)}--${index + 1}`);
  });

  return aside;
}
