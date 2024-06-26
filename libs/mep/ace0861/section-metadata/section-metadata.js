import { handleFocalpoint } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

function handleBackground(background, section, breakpoints) {
  const pic = background.content?.querySelector('picture');
  if (pic) {
    section.classList.add('has-background');
    pic.className = `section-background ${breakpoints}`;
    handleFocalpoint(pic, background.content);
    section.insertAdjacentElement('afterbegin', pic);
  } else {
    const color = background.content?.textContent;
    if (color) {
      if (!breakpoints) {
        section.style.background = color;
      } else {
        const backgroundDiv = createTag('DIV', {
          class: `section-background ${breakpoints}`,
          style: `background: ${color}`,
        }, '');
        section.prepend(backgroundDiv);
      }
    }
  }
}

function handleBackgrounds(backgrounds, section) {
  if (backgrounds.length === 1) {
    handleBackground(backgrounds[0], section, ''); //  needed the 3rd argument or else its undefined
  } else if (backgrounds.length > 1) {
    const viewports = ['mobile-only', 'tablet-only', 'desktop-only'];
    if (backgrounds.length === 2) {
      const [mobile, desktop] = backgrounds;
      handleBackground(mobile, section, viewports.slice(0, 2).join(' '));
      handleBackground(desktop, section, viewports[2]);
    } else {
      backgrounds.forEach((e, i) => {
        handleBackground(e, section, viewports[i]);
      });
    }
  }
}

export async function handleStyle(text, section) {
  if (!text || !section) return;
  const styles = text.split(', ').map((style) => style.replaceAll(' ', '-'));
  const sticky = styles.find((style) => style === 'sticky-top' || style === 'sticky-bottom');
  if (sticky) {
    const { default: handleStickySection } = await import('./sticky-section.js');
    await handleStickySection(sticky, section);
  }
  if (styles.includes('masonry')) styles.push('masonry-up');
  section.classList.add(...styles);
}

function handleMasonry(text, section) {
  section.classList.add(...['masonry-layout', 'masonry-up']);
  const divs = section.querySelectorAll(":scope > div:not([class*='metadata'])");
  const spans = [];
  text.split('\n').forEach((line) => spans.push(...line.trim().split(',')));
  [...divs].forEach((div, i) => {
    const spanWidth = spans[i] ? spans[i] : 'span 4';
    div.classList.add(`grid-${spanWidth.trim().replace(' ', '-')}`);
  });
}

function handleLayout(text, section) {
  if (!(text || section)) return;
  const layoutClass = `grid-template-columns-${text.replaceAll(' | ', '-')}`;
  section.classList.add(layoutClass);
}

export function getDelayTime(time) {
  if (time > 99) return time;
  return (time * 1000);
}

function handleDelay(time, section) {
  if (!(time || section)) return;
  section.classList.add('hide-sticky-section');
  setTimeout(() => { section.classList.remove('hide-sticky-section'); }, getDelayTime(time));
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
  if (metadata.background || metadata['background-mobile'] || metadata['background-tablet'] || metadata['background-desktop']) {
    const backgrounds = [];
    if (metadata.background) {
      backgrounds.push(metadata.background);
    } else if (metadata['background-mobile']) {
      backgrounds.push(metadata['background-mobile']);
    } else backgrounds.push('');
    if (metadata['background-tablet']) backgrounds.push(metadata['background-tablet']);
    if (metadata['background-desktop']) backgrounds.push(metadata['background-desktop']);
    handleBackgrounds(backgrounds, section);
  }
  if (metadata.layout) handleLayout(metadata.layout.text, section);
  if (metadata.masonry) handleMasonry(metadata.masonry.text, section);
  if (metadata.delay) handleDelay(metadata.delay.text, section);
}
