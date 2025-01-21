import { createTag } from '../../utils/utils.js';
import { getMetadata, getDelayTime } from './section-metadata.js';

function handleTopHeight(section) {
  let topHeight = document.querySelector('header')?.offsetHeight ?? 0;
  const localNav = document.querySelector('.feds-localnav');
  const fedsPromo = document.querySelector('.feds-promo-wrapper');
  if (localNav && localNav.offsetHeight > 0) {
    topHeight = localNav.offsetHeight;
  }
  if (fedsPromo) {
    topHeight += fedsPromo.offsetHeight;
  }

  section.style.top = `${topHeight}px`;
}

function promoIntersectObserve(el, stickySectionEl, options = {}) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (el.classList.contains('close-sticky-section')) {
        window.removeEventListener('resize', handleTopHeight);
        observer.unobserve(entry.target);
        return;
      }
      const footerTarget = entry.target === document.querySelector('footer');
      const isPromoStart = entry.target === stickySectionEl;
      const abovePromoStart = (isPromoStart && entry.isIntersecting)
        || stickySectionEl?.getBoundingClientRect().y > 0;
      if (footerTarget && entry.isIntersecting) el.classList.add('fill-sticky-section');
      else el.classList.remove('fill-sticky-section');

      if (!footerTarget && (entry.isIntersecting || abovePromoStart)) el.classList.add('hide-sticky-section');
      else el.classList.remove('hide-sticky-section');
    });
  }, options);
  return io;
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
  if (!hasScrollControl && main.children[0] !== section) {
    stickySectionEl = createTag('div', { class: 'section show-sticky-section' });
    section.parentElement.insertBefore(stickySectionEl, section);
  }
  const io = promoIntersectObserve(section, stickySectionEl);
  if (stickySectionEl) io.observe(stickySectionEl);
  if (section.querySelector(':is(.promobar, .notification)')) {
    io.observe(document.querySelector('footer'));
  }
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
