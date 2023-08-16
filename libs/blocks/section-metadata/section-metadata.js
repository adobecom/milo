import { createTag } from '../../utils/utils.js';

export function handleFocalpoint(pic, child, removeChild) {
  const image = pic.querySelector('img');
  if (!child || !image) return;
  let text = '';
  if (child.childElementCount === 2) {
    const dataElement = child.querySelectorAll('p')[1];
    text = dataElement?.textContent;
    if (removeChild) dataElement?.remove();
  } else if (child.textContent) {
    text = child.textContent;
    const childData = child.childNodes;
    if (removeChild) childData.forEach((c) => c.nodeType === Node.TEXT_NODE && c.remove());
  }
  const directions = text.trim().toLowerCase().split(',');
  const [x, y = ''] = directions;
  image.style.objectPosition = `${x} ${y}`;
}
function handleBackground(div, section) {
  const pic = div.background.content?.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.classList.add('section-background');
    handleFocalpoint(pic, div.background.content);
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = div.background.content?.textContent;
    if (color) {
      section.style.background = color;
    }
  }
}

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
      const isPromoStart = stickySectionEl && entry.target === stickySectionEl;
      const abovePromoStart = (isPromoStart && entry.isIntersecting)
                        || (stickySectionEl && stickySectionEl.getBoundingClientRect().y > 0);
      if (entry.isIntersecting || (isPromoStart && abovePromoStart)) el.classList.add('hide-sticky-section');
      else if (!abovePromoStart) el.classList.remove('hide-sticky-section');
    });
  }, options);
  return io;
}

function handleStickyPromobar(section) {
  const main = document.querySelector('main');
  section.classList.add('hide-sticky-section');
  let stickySectionEl = null;
  if (main.children[0] !== section) {
    stickySectionEl = createTag('div', { class: 'section show-sticky-section' });
    main.insertBefore(stickySectionEl, section);
  }
  const io = promoIntersectObserve(section, stickySectionEl);
  if (stickySectionEl) io.observe(stickySectionEl);
  io.observe(document.querySelector('footer'));
}

async function handleStickySection(sticky, section) {
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

export async function handleStyle(text, section) {
  if (!text || !section) return;
  const styles = text.split(', ').map((style) => style.replaceAll(' ', '-'));
  const sticky = styles.find((style) => style === 'sticky-top' || style === 'sticky-bottom');
  if (sticky) await handleStickySection(sticky, section);
  if (styles.includes('masonry')) styles.push('masonry-up');
  section.classList.add(...styles);
}

function handleLayout(text, section) {
  if (!(text || section)) return;
  const layoutClass = `grid-template-columns-${text.replaceAll(' | ', '-')}`;
  section.classList.add(layoutClass);
}

export const getMetadata = (el) => [...el.childNodes].reduce((rdx, row) => {
  if (row.children) {
    const key = row.children[0].textContent.trim().toLowerCase();
    const content = row.children[1];
    const text = content.textContent.trim().toLowerCase();
    if (key && content) rdx[key] = { content, text };
  }
  return rdx;
}, {});

export default async function init(el) {
  const section = el.closest('.section');
  const metadata = getMetadata(el);
  if (metadata.style) await handleStyle(metadata.style.text, section);
  if (metadata.background) handleBackground(metadata, section);
  if (metadata.layout) handleLayout(metadata.layout.text, section);
}
