import { createTag } from '../../../utils/utils.js';
import { getMetadata, getDelayTime } from './section-metadata.js';
import { getGnavHeight } from '../../../blocks/global-navigation/utilities/utilities.js';

function handleTopHeight(section) {
  const topHeight = getGnavHeight();
  section.style.top = `${topHeight}px`;
}

function promoIntersectObserve(el, stickySectionEl, options = {}) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (el.classList.contains('close-sticky-section')) {
        window.removeEventListener('resize', handleTopHeight);
        observer.unobserve(entry.target);
        return;
      }

      const { target, isIntersecting } = entry;

      if (target === document.querySelector('footer')) {
        el.classList.toggle('fill-sticky-section', isIntersecting);
      } else if (target === stickySectionEl) {
        const abovePromoStart = isIntersecting || stickySectionEl?.getBoundingClientRect().y > 0;
        el.classList.toggle('hide-sticky-section', abovePromoStart);
      } else if (target === document.querySelector('.hide-at-intersection')) {
        const aboveViewport = isIntersecting
        || entry.boundingClientRect.top < 0
        || stickySectionEl?.getBoundingClientRect().y > 0;
        el.classList.toggle('hide-sticky-section', aboveViewport);
      }
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

  const selector = metadata?.['custom-hide']?.text;
  const targetElement = document.querySelector(selector);
  if (targetElement) {
    stickySectionEl = createTag('div', { class: 'hide-at-intersection' });
    targetElement.parentElement.insertBefore(stickySectionEl, targetElement);
    io.observe(stickySectionEl);
  }
}

export default async function handleStickySection(sticky, section) {
  const main = document.querySelector('main');
  switch (sticky) {
    case 'sticky-top': {
      const { debounce } = await import('../../../utils/action.js');
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
