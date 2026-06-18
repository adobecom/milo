import { createTag, getFederatedUrl } from '../../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import icons from '../../../c2/assets/icons.js';

function waitForCheckoutLink(linkPara, timeoutMs = 10000) {
  const existing = linkPara.querySelector('a');
  if (existing?.isCheckoutLink) return Promise.resolve(existing);

  return new Promise((resolve, reject) => {
    let timeoutId;
    const observer = new MutationObserver(() => {
      const link = linkPara.querySelector('a');
      if (link?.isCheckoutLink) {
        clearTimeout(timeoutId);
        observer.disconnect();
        resolve(link);
      }
    });
    observer.observe(linkPara, { childList: true, subtree: true });
    timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error('Timed out waiting for checkout link to upgrade'));
    }, timeoutMs);
  });
}

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
      if (isHidden) {
        ctaEl.setAttribute('tabindex', '-1');
        ctaEl.setAttribute('aria-hidden', String(isHidden));
      } else {
        ctaEl.removeAttribute('tabindex');
        ctaEl.removeAttribute('aria-hidden');
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
  const isMerchLink = linkEl?.classList.contains('merch') || linkEl?.isCheckoutLink;
  if (isMerchLink) {
    try {
      const checkoutLink = await waitForCheckoutLink(linkPara);
      await checkoutLink.onceSettled();
      checkoutLink.replaceChildren(img, checkoutLink.textContent.trim(), arrow);
      checkoutLink.classList.add('promo-cta');
      checkoutLink.classList.remove('con-button');
      checkoutLink.setAttribute('tabindex', '-1');
      checkoutLink.setAttribute('aria-hidden', 'true');
      el.replaceChildren(checkoutLink);
      applyCustomHide(el, checkoutLink);
    } catch (e) {
      window.lana?.log?.(
        `floating-cta: merch link failed: ${e?.message || e}`,
        { tags: 'floating-cta', severity: 'error' },
      );
      el.remove();
    }
    return;
  }
  const sourceText = (linkEl ? linkEl.textContent : linkPara.textContent).trim();
  const [ctaText, ariaLabel = ctaText] = sourceText.split('|').map((s) => s.trim());
  const ctaHref = linkEl?.getAttribute('href') || '#';

  const cta = createTag('a', { href: ctaHref, class: 'promo-cta', 'aria-label': ariaLabel, tabindex: '-1' }, [img, ctaText, arrow]);
  el.replaceChildren(cta);
  applyCustomHide(el, cta);
}
