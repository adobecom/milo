import { createTag } from '../../utils/utils.js';
import { getMetadata, getDelayTime } from './section-metadata.js';
import { getGnavHeight } from '../global-navigation/utilities/utilities.js';

function handleTopHeight(section) {
  const topHeight = getGnavHeight();
  section.style.top = `${topHeight}px`;
}

let visibleMerchCards;

function promoIntersectObserve(el, stickySectionEl, options = {}) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (el.classList.contains('close-sticky-section')) {
        window.removeEventListener('resize', handleTopHeight);
        observer.unobserve(entry.target);
        return;
      }

      const { target, isIntersecting } = entry;

      const abovePromoStart = (target === stickySectionEl && isIntersecting)
        || stickySectionEl?.getBoundingClientRect().y > 0;

      if (target === document.querySelector('footer')) {
        el.classList.toggle('fill-sticky-section', isIntersecting);
      } else if (target === document.querySelector('.hide-at-intersection')) {
        const shouldHideSticky = isIntersecting
        || entry.boundingClientRect.top < 0
        || stickySectionEl?.getBoundingClientRect().y > 0;
        el.classList.toggle('hide-sticky-section', shouldHideSticky);
      } else if (target.matches('merch-card')) {
        const section = target.closest('.section[daa-lh]');
        if (!section) return;
        const total = section.querySelectorAll('merch-card')?.length;
        if (visibleMerchCards === undefined && isIntersecting) visibleMerchCards = 0;
        else if (visibleMerchCards === undefined) return;
        visibleMerchCards += isIntersecting ? 1 : -1;
        visibleMerchCards = Math.min(Math.max(visibleMerchCards, 0), total);
        el.classList.toggle('hide-sticky-section', visibleMerchCards > 0);
      } else el.classList.toggle('hide-sticky-section', abovePromoStart);
    });
  }, options);
}

function handleStickyPromobar(section, delay) {
  const main = document.querySelector('main');
  section.classList.add('promo-sticky-section', 'hide-sticky-section');
  if (section.querySelector('.popup:is(.promobar)')) section.classList.add('popup');
  let stickySectionEl = null;
  let hasScrollControl;
  if ((section.querySelector(':is(.promobar, .notification)').classList.contains('no-delay'))
    || (delay && section.classList.contains('popup'))) {
    hasScrollControl = true;
    section.classList.remove('hide-sticky-section');
  }
  const metadata = getMetadata(section.querySelector('.section-metadata'));

  if (!hasScrollControl && main.children[0] !== section) {
    const isStickyAfterCTA = metadata?.style?.text.includes('sticky-after-cta');

    if (isStickyAfterCTA) {
      stickySectionEl = main.children[0].querySelector('.action-area');
      stickySectionEl?.classList.add('show-sticky-section');
    } else {
      stickySectionEl = createTag('div', { class: 'section show-sticky-section' });
      section.parentElement.insertBefore(stickySectionEl, section);
    }
  }
  const io = promoIntersectObserve(section, stickySectionEl);
  if (stickySectionEl) io.observe(stickySectionEl);
  if (section.querySelector(':is(.promobar, .notification)')) {
    io.observe(document.querySelector('footer'));
  }

  const selector = metadata?.['custom-hide']?.text?.trim();
  const targetElement = selector ? document.querySelector(selector) : null;
  if (targetElement) {
    stickySectionEl = createTag('div', { class: 'hide-at-intersection' });
    targetElement.parentElement.insertBefore(stickySectionEl, targetElement);
    io.observe(stickySectionEl);
  }

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeName === 'MERCH-CARD') {
          io.observe(node);
        }
      });
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

export default async function handleStickySection(sticky, section) {
  const main = document.querySelector('main');
  switch (sticky) {
    case 'sticky-top': {
      const { debounce } = await import('../../utils/action.js');
      window.addEventListener('resize', debounce(() => handleTopHeight(section)));
      handleTopHeight(section);
      main.prepend(section);
      break;
    }
    case 'sticky-bottom': {
      if (section.querySelector(':is(.promobar, .notification)')) {
        const metadata = getMetadata(section.querySelector('.section-metadata'));
        const delay = getDelayTime(metadata.delay?.text);
        if (delay) setTimeout(() => { handleStickyPromobar(section, delay); }, delay);
        else handleStickyPromobar(section, delay);
      }
      main.append(section);
      break;
    }
    default:
      break;
  }
}
