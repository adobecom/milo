import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl, scrollToHashedElement } from '../../../utils/utils.js';

const ARROW_SVG = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g transform="rotate(90, 6, 6)"><path d="M11.208 5.41699L7.50781 1.71679C7.18554 1.39452 6.66406 1.39452 6.34179 1.71679C6.01952 2.03906 6.01952 2.56054 6.34179 2.88281L8.63281 5.1748H1.375C0.91895 5.1748 0.5498 5.54394 0.5498 6C0.5498 6.45606 0.91894 6.8252 1.375 6.8252H8.63281L6.34179 9.11719C6.01952 9.43946 6.01952 9.96094 6.34179 10.2832C6.50292 10.4443 6.71386 10.5254 6.9248 10.5254C7.13574 10.5254 7.34668 10.4444 7.50781 10.2832L11.208 6.58301C11.5303 6.26074 11.5303 5.73926 11.208 5.41699Z" fill="currentColor"/></g></svg>';

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

function promoteParagraphTitle(content, headingSize = '2', skipFirst = false) {
  if (!content || content.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const ps = [...content.querySelectorAll('p')];
  const target = skipFirst ? ps[1] : ps[0];
  if (!target) return;
  const bodyClass = [...target.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) target.classList.replace(bodyClass, `title-${headingSize}`);
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
    badge.innerHTML = ARROW_SVG;
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

function decorate(block, root = block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);
  const isJumpLink = root.classList.contains('jump-link');
  promoteParagraphTitle(content, '2', isJumpLink);

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
