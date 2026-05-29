import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import icons from '../../../c2/assets/icons.js';

export default function init(el) {
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
  const sourceText = (linkEl ? linkEl.textContent : linkPara.textContent).trim();
  const [ctaText, ariaLabel = ctaText] = sourceText.split('|').map((s) => s.trim());
  const ctaHref = linkEl?.getAttribute('href') || '#';

  const arrow = createTag('span', { class: 'icon-button', 'aria-hidden': 'true' });
  arrow.innerHTML = icons.arrowRightWhite;
  const cta = createTag('a', { href: ctaHref, class: 'promo-cta', 'aria-label': ariaLabel }, [img, ctaText, arrow]);
  el.replaceChildren(cta);

  const sectionMeta = el.parentElement?.querySelector('.section-metadata');
  if (!sectionMeta) return;
  const metadata = getMetadata(sectionMeta);
  const customHide = metadata['custom-hide']?.text[0];
  if (!customHide) return;

  // Intersection Observer on section selected by custom-hide in section metadata
  const customHideSection = document.querySelector(customHide);
  if (!customHideSection) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      cta.classList.toggle('active', !entry.isIntersecting);
      cta.setAttribute('aria-hidden', String(entry.isIntersecting));
    },
    {
      rootMargin: '-90% 0px 0px 0px',
      threshold: 0,
    },
  );
  observer.observe(customHideSection);
}
