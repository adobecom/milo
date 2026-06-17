import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl, scrollToHashedElement } from '../../../utils/utils.js';

function hangOpeningQuote(header) {
  if (!header) return;
  const openingQuotes = /^(\p{Pi})/u;
  const match = header.textContent.match(openingQuotes);
  if (!match) return;
  const quote = match[1];
  header.textContent = header.textContent.slice(1);
  const span = createTag('span', { class: 'opening-quote' }, quote);
  header.prepend(span);
}

function decorateText(el) {
  decorateBlockText(el);
  const firstText = el?.querySelector('h1, h2, h3, h4, h5, h6, p');
  hangOpeningQuote(firstText);
}

function promoteParagraphHeading(content, headingSize = '2', skipFirst = false) {
  if (!content || content.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const ps = [...content.querySelectorAll('p')];
  const target = skipFirst ? ps[1] : ps[0];
  if (!target) return;
  const bodyClass = [...target.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) target.classList.replace(bodyClass, `heading-${headingSize}`);
}

function isJumpLinkRow(el) {
  return [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.includes('|'));
}

function getSectionHash(anchor) {
  const id = anchor.hash?.split('#')[1];
  return id ? `#${id}` : '';
}

function decorateJumpLinks(content, foreground) {
  const jumpRow = [...content?.querySelectorAll(':is(p, div):has(a)') ?? []].find(isJumpLinkRow);
  if (!jumpRow) return;

  const anchors = [...jumpRow.querySelectorAll('a')];
  const nav = createTag('nav', { class: 'jump-links', 'aria-label': 'Jump to section' });
  const list = createTag('ul');

  anchors.forEach((anchor) => {
    const badge = createTag('span', { class: 'jump-link-badge' });
    const label = createTag('span', { class: 'jump-link-label heading-5' }, anchor.textContent.trim());
    anchor.textContent = '';
    anchor.classList.add('jump-link-anchor');
    anchor.append(badge, label);
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = getSectionHash(anchor);
      if (window.lenis?.scrollTo) {
        const target = document.querySelector(`#${hash.slice(1)}:not(.dialog-modal)`);
        if (!target) return;
        const offset = -(document.querySelector('.global-navigation')?.offsetHeight || 0);
        window.lenis.scrollTo(target, { offset, force: true });
        return;
      }
      scrollToHashedElement(hash);
    });
    list.append(createTag('li', {}, anchor));
  });

  nav.append(list);

  jumpRow.remove();
  foreground.append(nav);
}

function decorateVideoVariant(container) {
  const row = container.children[0];
  if (!row) return;

  const [ctaCell, mediaCell] = [...row.children];
  if (!ctaCell && !mediaCell) return;

  if (mediaCell?.textContent.trim() || mediaCell?.children.length) {
    mediaCell.classList.add('media');
    container.append(mediaCell);
  } else {
    mediaCell?.remove();
  }

  if (ctaCell) {
    decorateBlockText(ctaCell);
    ctaCell.classList.add('cta-area');
    container.append(ctaCell);
  }

  row.remove();
  container.querySelector('.action-area')?.classList.add('dark');
  container.querySelector('.con-button.blue')?.classList.replace('blue', 'fill');
}

function decorate(block, root = block) {
  if (root.classList.contains('video')) {
    decorateVideoVariant(block);
    return;
  }

  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);
  const isJumpLink = root.classList.contains('jump-link');
  promoteParagraphHeading(content, '2', isJumpLink);
  const firstP = content?.querySelector('p:has(picture, img)');
  const iconImg = firstP?.querySelector('img[src]');

  if (iconImg) iconImg.src = getFederatedUrl(iconImg.getAttribute('src'));

  const bodyClass = firstP && [...firstP.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, 'eyebrow');
  if (!isJumpLink) return;
  decorateJumpLinks(content, foreground);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
