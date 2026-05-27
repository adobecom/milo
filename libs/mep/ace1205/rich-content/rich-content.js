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

function decorateJumpLinks(content, foreground) {
  const paras = [...(content?.querySelectorAll('p') ?? [])];
  const jumpPara = paras.findLast((p) => p.querySelector('a') && [...p.childNodes].some(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent.includes('|'),
  ));
  if (!jumpPara) return;

  const anchors = [...jumpPara.querySelectorAll('a')];
  const nav = createTag('nav', { class: 'jump-links', 'aria-label': 'Jump to section' });

  anchors.forEach((anchor) => {
    const badge = createTag('span', { class: 'jump-link-badge' });
    const label = createTag('span', { class: 'jump-link-label' }, anchor.textContent.trim());
    anchor.textContent = '';
    anchor.classList.add('jump-link-anchor');
    anchor.append(badge, label);
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToHashedElement(anchor.hash);
    });
    nav.append(anchor);
  });

  jumpPara.remove();
  foreground.append(nav);
}

function decorateVideoVariant(container) {
  const row = container.children[0];
  if (!row) return;

  const [ctaCell, mediaCell] = [...row.children];
  if (!ctaCell && !mediaCell) return;

  if (mediaCell) {
    mediaCell.classList.add('media');
    container.append(mediaCell);
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

  if (!isJumpLink) return;

  const firstP = content?.querySelector('p:has(picture, img)');
  const bodyClass = firstP && [...firstP.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, 'eyebrow');
  const iconImg = firstP?.querySelector('img[src]');
  if (iconImg) iconImg.src = getFederatedUrl(iconImg.getAttribute('src'));
  decorateJumpLinks(content, foreground);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
