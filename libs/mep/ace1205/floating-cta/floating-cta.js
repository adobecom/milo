import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import icons from '../../../c2/assets/icons.js';

function applyCustomHide(el, ctaEl) {
  const sectionMeta = el.parentElement?.querySelector('.section-metadata');
  if (!sectionMeta) return;
  const metadata = getMetadata(sectionMeta);
  const customHide = metadata['custom-hide']?.text[0];
  if (!customHide) return;

  const customHideSection = document.querySelector(customHide);
  if (!customHideSection) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      const isHidden = entry.isIntersecting;
      ctaEl.classList.toggle('active', !isHidden);
      ctaEl.setAttribute('aria-hidden', String(isHidden));
      if (isHidden) {
        ctaEl.setAttribute('tabindex', '-1');
      } else {
        ctaEl.removeAttribute('tabindex');
      }
    },
    {
      rootMargin: '-90% 0px 0px 0px',
      threshold: 0,
    },
  );
  observer.observe(customHideSection);
}

export default async function init(el) {
  const contentDiv = el.querySelector('div > div');
  if (!contentDiv) return;

  const [imgPara, linkPara] = contentDiv.querySelectorAll('p');
  if (!imgPara || !linkPara) return;

  const img = imgPara.querySelector('img');
  if (!img) return;

  const relativeSrc = img.getAttribute('src');
  if (relativeSrc?.startsWith('/')) {
    img.src = getFederatedUrl(relativeSrc);
  }

  const linkEl = linkPara.querySelector('a');
  if (linkEl?.isCheckoutLink) {
    await linkEl.onceSettled();
    const [ctaText] = linkEl.textContent.trim().split('|').map((s) => s.trim());
    linkEl.textContent = ctaText;
    linkEl.prepend(img);
    linkEl.append(createTag('span', { class: 'icon-button', 'aria-hidden': 'true' }, icons.arrowRightWhite));
    linkEl.classList.add('promo-cta');
    linkEl.classList.remove('con-button');
    el.replaceChildren(linkEl);
    applyCustomHide(el, linkEl);
    return;
  }
  const sourceText = (linkEl ? linkEl.textContent : linkPara.textContent).trim();
  const [ctaText, ariaLabel = ctaText] = sourceText.split('|').map((s) => s.trim());
  const ctaHref = linkEl?.getAttribute('href') || '#';

  const arrow = createTag('span', { class: 'icon-button', 'aria-hidden': 'true' }, icons.arrowRightWhite);
  const cta = createTag('a', { href: ctaHref, class: 'promo-cta', 'aria-label': ariaLabel, tabindex: '-1' }, [img, ctaText, arrow]);
  el.replaceChildren(cta);
  applyCustomHide(el, cta);
}
