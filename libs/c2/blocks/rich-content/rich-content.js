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

function promoteParagraphHeading(content, headingSize = '2') {
  if (!content || content.querySelector('h1, h2, h3, h4, h5, h6')) return;
  const firstP = content.querySelector('p');
  if (!firstP) return;
  const bodyClass = [...firstP.classList].find((c) => c.startsWith('body-'));
  if (bodyClass) firstP.classList.replace(bodyClass, `heading-${headingSize}`);
}

function decorate(block) {
  const foreground = block.children[0];
  const content = foreground?.children[0];
  content?.classList.add('content');
  foreground?.classList.add('foreground');
  decorateText(content);
  promoteParagraphHeading(content);
}

// --- video variant ---

function decorateVideoMedia(mediaCell) {
  const link = mediaCell.querySelector('a[href]');
  if (!link) return;

  const isVideoLink = /\.mp4($|\?)/i.test(link.href) || link.href.includes('/video/');
  if (!isVideoLink) return;

  const picture = mediaCell.querySelector('picture');
  const video = createTag('video', { autoplay: '', muted: '', loop: '', playsinline: '' });
  video.append(createTag('source', { src: link.href, type: 'video/mp4' }));

  const wrap = createTag('div', { class: 'media-wrap' });
  if (picture) wrap.append(picture);
  wrap.append(video);
  link.replaceWith(wrap);
}

function decorateVideoVariant(el) {
  decorateBlockText(el);
  const [mediaRow, ctaRow] = [...el.children];

  // Extract background image from second column and make it the block background
  if (mediaRow?.children[1]) {
    const bgPicture = mediaRow.children[1].querySelector('picture');
    if (bgPicture) {
      const bgDiv = createTag('div', { class: 'video-bg' });
      bgDiv.append(bgPicture);
      el.prepend(bgDiv);
    }
  }

  // Promote media cell to direct block child
  if (mediaRow?.children[0]) {
    const mediaCell = mediaRow.children[0];
    mediaCell.classList.add('media');
    decorateVideoMedia(mediaCell);
    el.append(mediaCell);
  }
  mediaRow?.remove();

  // Promote CTA cell to direct block child (if authored as a separate row)
  if (ctaRow?.children[0]) {
    const ctaCell = ctaRow.children[0];
    ctaCell.classList.add('cta-area');
    el.append(ctaCell);
  }
  ctaRow?.remove();

  const actionArea = el.querySelector('.action-area');
  actionArea?.classList.add('dark');
  actionArea?.querySelector('.con-button.blue')?.classList.replace('blue', 'fill');
}

export default function init(el) {
  if (el.classList.contains('video')) {
    decorateVideoVariant(el);
    return;
  }
  decorateViewportContent(el, decorate);
}
