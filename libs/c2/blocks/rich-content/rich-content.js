import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

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

function promoteParagraphTitle(content, headingSize = '2') {
  if (!content || content.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const firstP = content.querySelector('p');
  if (!firstP) return;
  const bodyClass = [...firstP.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, `title-${headingSize}`);
}

function decorateJumpLinks(content, foreground) {
  const paras = [...(content?.querySelectorAll('p') ?? [])];
  const jumpPara = paras.findLast((p) => p.querySelector('a') && [...p.childNodes].some(
    (n) => n.nodeType === Node.TEXT_NODE && n.textContent.includes('|'),
  ));
  if (!jumpPara) return;

  const anchors = [...jumpPara.querySelectorAll('a')];
  const nav = createTag('nav', { class: 'jump-links', 'aria-label': 'Jump to section' });
  const arrowSvg = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5 0.5V9.5M1.5 6L5 9.5L8.5 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  anchors.forEach((anchor) => {
    const badge = createTag('span', { class: 'jump-link-badge' });
    badge.innerHTML = arrowSvg;
    const label = createTag('span', { class: 'jump-link-label' }, anchor.textContent.trim());
    anchor.textContent = '';
    anchor.classList.add('jump-link-anchor');
    anchor.append(badge, label);
    nav.append(anchor);
  });

  jumpPara.remove();
  foreground.append(nav);
}

function decorate(block, root = block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);
  promoteParagraphTitle(content);
  if (root.classList.contains('jump-link')) decorateJumpLinks(content, foreground);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}
