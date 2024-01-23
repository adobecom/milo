import { createTag } from '../../utils/utils.js';

function handleTopHeight(section) {
  const headerHeight = document.querySelector('header').offsetHeight;
  section.style.top = `${headerHeight}px`;
}

function promoIntersectObserve(el, stickySectionEl, options = {}) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (el.classList.contains('close-sticky-section')) {
        observer.unobserve(entry.target);
        return;
      }
      const isPromoStart = entry.target === stickySectionEl;
      const abovePromoStart = (isPromoStart && entry.isIntersecting)
                        || stickySectionEl?.getBoundingClientRect().y > 0;
      if (entry.isIntersecting || abovePromoStart) el.classList.add('hide-sticky-section');
      else el.classList.remove('hide-sticky-section');
    });
  }, options);
  return io;
}

function handleStickyPromobar(section) {
  const main = document.querySelector('main');
  section.classList.add('promo-sticky-section', 'hide-sticky-section');
  if (section.querySelector('.promobar.popup')) section.classList.add('popup');
  let stickySectionEl = null;
  const hasScrollControl = section.querySelector('.promobar').classList.contains('no-delay');
  if (!hasScrollControl && main.children[0] !== section) {
    stickySectionEl = createTag('div', { class: 'section show-sticky-section' });
    section.parentElement.insertBefore(stickySectionEl, section);
  }
  const io = promoIntersectObserve(section, stickySectionEl);
  if (stickySectionEl) io.observe(stickySectionEl);
  io.observe(document.querySelector('footer'));
}

export default async function handleStickySection(sticky, section) {
  const main = document.querySelector('main');
  switch (sticky) {
    case 'sticky-top':
    {
      const { debounce } = await import('../../utils/action.js');
      window.addEventListener('resize', debounce(() => handleTopHeight(section)));
      main.prepend(section);
      break;
    }
    case 'sticky-bottom':
      if (section.querySelector('.promobar')) handleStickyPromobar(section);
      main.append(section);
      break;
    default:
      break;
  }
}
