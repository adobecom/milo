import { createTag, getConfig, getFederatedUrl, loadStyle } from '../../../utils/utils.js';
import { decorateBlockBg, decorateBlockText, decorateViewportContent, normalizeMasFieldText } from '../../../utils/decorate.js';

const hasContent = (cell) => !!cell
  && (!!cell.textContent.trim() || !!cell.querySelector(':not(p, br)'));

function decorateCopy(copy) {
  const heading = copy.querySelector('h1, h2, h3, h4, h5, h6');
  const eyebrow = heading?.previousElementSibling;
  if (eyebrow?.matches('p')) {
    eyebrow.querySelectorAll('img[src*=".svg"]').forEach((img) => {
      img.src = getFederatedUrl(img.getAttribute('src'));
    });
    eyebrow.classList.add('eyebrow');
    eyebrow.before(heading);
  }
  decorateBlockText(copy, { heading: '2', body: 'md', button: 'md' });
  const [, ...otherHeadings] = copy.querySelectorAll('h1, h2, h3, h4, h5, h6');
  otherHeadings.forEach((other) => other.classList.remove('heading-2'));
  normalizeMasFieldText(copy, 'md');
  copy.classList.add('hero-c2-header');
}

function decorateBackground(cell) {
  if (!hasContent(cell)) return null;
  const scratch = createTag('div');
  decorateBlockBg(scratch, cell, { className: 'hero-c2-media-bg', useHandleFocalpoint: true });
  if (cell.classList.contains('hero-c2-media-bg')) return cell;
  if (!scratch.style.background) return null;
  return createTag('div', { class: 'hero-c2-media-bg', style: `background: ${scratch.style.background}` });
}

function buildPlainWidget(cell) {
  const widget = createTag('div');
  widget.append(...cell.childNodes);
  decorateBlockText(widget, { body: 'md', button: 'md' });
  return widget;
}

const isDate = (p) => p.firstElementChild?.matches('strong')
  && p.textContent === p.firstElementChild.textContent;

function buildEventWidget(cell) {
  const widget = buildPlainWidget(cell);
  const dates = createTag('div', { class: 'hero-c2-event-dates' });
  let date;
  [...widget.children].filter((el) => !el.matches('.action-area')).forEach((el) => {
    if (isDate(el)) {
      date = createTag('div', { class: 'hero-c2-event-date' });
      dates.append(date);
    }
    date?.append(el);
  });
  widget.classList.add('hero-c2-event');
  widget.prepend(dates);
  return widget;
}

function extractAfterDividers(cell) {
  const parts = [];
  [...cell.children].forEach((child) => {
    if (child.textContent.trim() === '+++') {
      parts.push(createTag('div'));
      child.remove();
    } else if (parts.length) {
      parts.at(-1).append(child);
    }
  });
  return parts;
}

function decorate(block, buildWidget) {
  const [textRow, secondRow, footerRow] = block.children;
  const [text, mediaBgCell] = textRow?.children || [];
  const secondCells = [...(secondRow?.children || [])];
  const media = secondCells.at(-1);
  if (!text) return;

  const [splitWidget, splitFooter] = extractAfterDividers(text);
  const widgetCell = splitWidget || (secondCells.length > 1 ? secondCells[0] : null);
  const footer = splitFooter || footerRow?.children[0];

  decorateCopy(text);
  const content = createTag('div', { class: 'hero-c2-content' }, text);
  if (hasContent(widgetCell)) {
    const widget = buildWidget(widgetCell);
    widget.classList.add('hero-c2-widget');
    content.append(widget);
  }
  if (hasContent(footer)) {
    footer.classList.add('hero-c2-footer', 'caption');
    content.append(footer);
  }

  const mediaArea = createTag('div', { class: 'hero-c2-media-area' });
  const mediaBg = decorateBackground(mediaBgCell);
  if (mediaBg) mediaArea.append(mediaBg);
  if (hasContent(media)) {
    media.classList.add('hero-c2-media');
    mediaArea.append(media);
  }

  const inner = createTag('div', { class: 'hero-c2-inner container' });
  inner.append(content, mediaArea);
  block.replaceChildren(inner);
  block.querySelectorAll('video:not([controls])').forEach((video) => video.setAttribute('tabindex', '-1'));
}

export default async function init(el) {
  let buildWidget = el.classList.contains('event') ? buildEventWidget : buildPlainWidget;
  if (el.classList.contains('merch')) {
    const [{ default: buildMerchWidget }] = await Promise.all([
      import('../../utils/merch-widget/merch-widget.js'),
      new Promise((resolve) => {
        loadStyle(`${getConfig().base}/c2/utils/merch-widget/merch-widget.css`, resolve);
      }),
    ]);
    buildWidget = buildMerchWidget;
  }
  decorateViewportContent(el, (block) => decorate(block, buildWidget));
}
