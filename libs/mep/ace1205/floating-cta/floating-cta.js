import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { getMetadata } from '../../../c2/blocks/section-metadata/section-metadata.js';

export default function init(el) {
  const contentDiv = el.querySelector('div > div');
  if (!contentDiv) return;

  const [imgPara, textPara] = contentDiv.querySelectorAll('p');
  if (!imgPara || !textPara) return;

  const img = imgPara.querySelector('img');
  if (!img) return;

  const relativeSrc = img.getAttribute('src');
  if (relativeSrc?.startsWith('/')) {
    img.src = `${getFederatedUrl(relativeSrc)}`;
  }

  const [ctaText, ariaLabel = ctaText] = textPara.textContent.trim().split('|').map((s) => s.trim());

  const cta = createTag('a');
  cta.href = '#';
  cta.className = 'promo-cta';
  cta.setAttribute('aria-label', ariaLabel);
  cta.appendChild(img);
  cta.append(ctaText);
  cta.appendChild(createTag('span', { class: 'icon-button arrow', 'aria-hidden': 'true' }));

  el.innerHTML = '';
  el.appendChild(cta);

  cta.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: window.innerHeight * 0.33,
      behavior: 'auto'
    });
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  const sectionMeta = el.parentElement?.querySelector('.section-metadata');
  if (!sectionMeta) return;
  const metadata = getMetadata(sectionMeta);
  const customHide = metadata['custom-hide']?.text[0] || "";
  if (!customHide) return;

  // Intersection Observer on section selected by custom-hide in section metadata
  const customHideSection = document.querySelector(customHide);
  if (!customHideSection) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      cta.classList.toggle('active', !entry.isIntersecting);
      cta.setAttribute('aria-hidden', entry.isIntersecting?.toString());
    },
    {
      rootMargin: '33% 0px 0px 0px',
      threshold: 0
    }
  );
  observer.observe(customHideSection);
}
