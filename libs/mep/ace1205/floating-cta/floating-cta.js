import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import icons from '../../../c2/assets/icons.js';

function waitForCheckoutLink(link) {
  if (link.isCheckoutLink) return Promise.resolve();
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (link.isCheckoutLink) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(link, { attributes: true });
  });
}

function setupVisibilityObserver(el, cta) {
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
      cta.classList.toggle('active', !isHidden);
      cta.setAttribute('aria-hidden', String(isHidden));
      if (isHidden) {
        cta.setAttribute('tabindex', '-1');
      } else {
        cta.removeAttribute('tabindex');
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
  const arrow = createTag('span', { class: 'icon-button', 'aria-hidden': 'true' }, icons.arrowRightWhite);

  if (linkEl?.isCheckoutLink
    || linkEl?.getAttribute('is') === 'checkout-link'
    || linkEl?.hasAttribute('data-wcs-osi')
    || linkEl?.classList.contains('merch')) {
    const authoredText = linkEl.textContent.trim();
    const [, ariaLabel = authoredText] = authoredText.split('|').map((s) => s.trim());
    linkEl.classList.add('promo-cta');
    linkEl.setAttribute('aria-label', ariaLabel);
    linkEl.setAttribute('tabindex', '-1');
    linkEl.textContent = authoredText.split('|')[0].trim();
    linkEl.prepend(img);
    linkEl.append(arrow);
    el.replaceChildren(linkEl);
    setupVisibilityObserver(el, linkEl);

    await waitForCheckoutLink(linkEl);
    await linkEl.onceSettled();
    linkEl.classList.remove('con-button');
    const resolvedText = [...linkEl.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent)
      .join('')
      .trim();
    if (resolvedText) linkEl.setAttribute('aria-label', resolvedText);
    return;
  }

  const sourceText = (linkEl ? linkEl.textContent : linkPara.textContent).trim();
  const [ctaText, ariaLabel = ctaText] = sourceText.split('|').map((s) => s.trim());
  const ctaHref = linkEl?.getAttribute('href') || '#';

  const cta = createTag('a', { href: ctaHref, class: 'promo-cta', 'aria-label': ariaLabel, tabindex: '-1' }, [img, ctaText, arrow]);
  el.replaceChildren(cta);

  setupVisibilityObserver(el, cta);
}