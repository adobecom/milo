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

function decorate(block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);
  promoteParagraphTitle(content);
}

function setSectionBgVar(el) {
  const section = el.closest('.section');
  if (!section) return;
  const set = (img) => {
    const src = img.currentSrc || img.src;
    if (src) section.style.setProperty('--section-bg-url', `url("${src}")`);
  };
  const watchImg = (img) => {
    set(img);
    if (!img.currentSrc) img.addEventListener('load', () => set(img), { once: true });
  };
  const img = section.querySelector('.section-background img');
  if (img) { watchImg(img); return; }
  const mo = new MutationObserver(() => {
    const found = section.querySelector('.section-background img');
    if (!found) return;
    mo.disconnect();
    watchImg(found);
  });
  mo.observe(section, { childList: true, subtree: true });
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  setSectionBgVar(el);
}
