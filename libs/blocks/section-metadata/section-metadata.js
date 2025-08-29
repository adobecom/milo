import { handleFocalpoint } from '../../utils/decorate.js';
import { createTag, getConfig } from '../../utils/utils.js';
import { decorateDefaultLinkAnalytics } from '../../martech/attributes.js';
import { replaceKey } from '../../features/placeholders.js';

const replacePlaceholder = async (key) => replaceKey(key, getConfig());
const ADD_MORE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none"><path d="M12 24.24C5.38258 24.24 0 18.8574 0 12.24C0 5.62257 5.38258 0.23999 12 0.23999C18.6174 0.23999 24 5.62257 24 12.24C24 18.8574 18.6174 24.24 12 24.24ZM12 2.29713C6.51696 2.29713 2.05714 6.75695 2.05714 12.24C2.05714 17.723 6.51696 22.1828 12 22.1828C17.483 22.1828 21.9429 17.723 21.9429 12.24C21.9429 6.75695 17.483 2.29713 12 2.29713Z" fill="#292929"/><path d="M16.5504 11.1884H13.0504V7.68843C13.0504 7.10874 12.5801 6.63843 12.0004 6.63843C11.4207 6.63843 10.9504 7.10874 10.9504 7.68843V11.1884H7.45039C6.87071 11.1884 6.40039 11.6587 6.40039 12.2384C6.40039 12.8181 6.87071 13.2884 7.45039 13.2884H10.9504V16.7884C10.9504 17.3681 11.4207 17.8384 12.0004 17.8384C12.5801 17.8384 13.0504 17.3681 13.0504 16.7884V13.2884H16.5504C17.1301 13.2884 17.6004 12.8181 17.6004 12.2384C17.6004 11.6587 17.1301 11.1884 16.5504 11.1884Z" fill="#292929"/></svg>';

export function handleBackground(div, section) {
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

function handleAnchor(anchor, section) {
  if (!anchor || !section) return;
  section.id = anchor.toLowerCase().trim().replaceAll(/\s+/g, '-');
  section.classList.add('section-anchor');
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

async function handleShowMoreButton(section) {
  const showMoreBtn = section.querySelector('.show-more-button button');
  if (!showMoreBtn) return;
  const iconSpan = createTag('span', {
    class: 'show-more-icon',
    'aria-hidden': 'true',
  }, `${ADD_MORE_ICON}`);

  showMoreBtn.innerHTML = `${await replacePlaceholder('see-more-features')}`;
  showMoreBtn.appendChild(iconSpan);
  showMoreBtn.setAttribute('aria-label', `${await replacePlaceholder('see-more-features')}`);

  showMoreBtn.addEventListener('click', () => {
    section.classList.add('show-all');
    section.querySelector('.show-more-button').remove(); // Remove the entire show-more-button div
  });
}

async function handleCollapseSection(text, section) {
  if (!text || !section) return;
  const blocks = section.querySelectorAll('.con-block');
  const existingShowMoreButton = section.querySelector('.show-more-button');
  if (text === 'on' && blocks.length > 3 && !existingShowMoreButton) {
    const showMoreButton = createTag('div', { class: 'show-more-button' });
    const button = createTag('button', {}, '');
    showMoreButton.append(button);
    section.append(showMoreButton);
    await handleShowMoreButton(section);
    decorateDefaultLinkAnalytics(showMoreButton);
  }
}

function addListAttrToSection(section) {
  if (!section) return;
  const isSectionUp = [...section.classList].some((c) => c.endsWith('-up'));
  const hasHeader = section.querySelector('h1, h2, h3, h4, h5, h6');
  const allowedBlocks = ['icon-block', 'action-item', 'section-metadata'];
  const hasAllowedChildren = [...section.children]
    .every((child) => allowedBlocks.some((block) => child.classList.contains(block)));
  if (!isSectionUp || hasHeader || !hasAllowedChildren) return;
  section.setAttribute('role', 'list');
  [...section.children].forEach((child) => {
    if (child.classList.contains('section-metadata')) return;
    child.setAttribute('role', 'listitem');
  });
}

export default async function init(el) {
  const section = el.closest('.section');
  const metadata = getMetadata(el);
  if (metadata.style) await handleStyle(metadata.style.text, section);
  if (metadata.background) handleBackground(metadata, section);
  if (metadata.layout) handleLayout(metadata.layout.text, section);
  if (metadata.masonry) handleMasonry(metadata.masonry.text, section);
  if (metadata.delay) handleDelay(metadata.delay.text, section);
  if (metadata.anchor) handleAnchor(metadata.anchor.text, section);
  // eslint-disable-next-line max-len
  if (metadata['collapse-ups-mobile']) await handleCollapseSection(metadata['collapse-ups-mobile'].text, section);
  addListAttrToSection(section);
}
