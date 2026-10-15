import { createTag } from '../../../utils/utils.js';
import { decorateTextOverrides } from '../../../utils/decorate.js';
import { processTrackingLabels } from '../../../martech/attributes.js';

const SEO_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };

function handleToggle(details) {
  const summary = details.querySelector('summary');
  summary?.setAttribute('aria-expanded', details.open);
  const daaLl = summary?.getAttribute('daa-ll');
  if (!daaLl) return;
  summary.setAttribute(
    'daa-ll',
    details.open ? daaLl.replace(/^open-/, 'close-') : daaLl.replace(/^close-/, 'open-'),
  );
}

function buildItem(row, num, isFirst) {
  const cell = row.firstElementChild;
  const heading = cell?.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return null;

  const questionText = heading.textContent.trim();
  const answerNodes = [...cell.children].filter((n) => n !== heading);

  const headingTag = createTag(heading.tagName, { class: 'faq-question heading-5' }, questionText);
  const icon = createTag('span', { class: 'faq-icon', 'aria-hidden': 'true' });
  const summary = createTag('summary', {
    class: 'faq-trigger',
    'aria-expanded': isFirst,
    'daa-ll': `${isFirst ? 'close' : 'open'}-${num}--${processTrackingLabels(questionText)}`,
  }, [headingTag, icon]);

  const panelInner = createTag('div', { class: 'faq-panel-inner' }, answerNodes);
  const panel = createTag('div', { class: 'faq-panel body-md' }, panelInner);
  const itemAttrs = { class: 'faq-item' };
  if (isFirst) itemAttrs.open = '';
  const details = createTag('details', itemAttrs, [summary, panel]);
  details.addEventListener('toggle', () => handleToggle(details));

  const answerText = answerNodes.map((n) => n.textContent.trim()).join(' ').trim();
  return { item: details, name: questionText, text: answerText };
}

function setSEO(items) {
  SEO_SCHEMA.mainEntity = items.map(({ name, text }) => ({
    '@type': 'Question',
    name,
    acceptedAnswer: { '@type': 'Answer', text },
  }));
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(SEO_SCHEMA));
  document.head.append(script);
}

export default function init(el) {
  const rows = [...el.children].filter((row) => row.querySelector('h1, h2, h3, h4, h5, h6'));
  const items = rows
    .map((row, idx) => buildItem(row, idx + 1, idx === 0))
    .filter(Boolean);

  const list = createTag('div', { class: 'faq-list foreground' }, items.map((i) => i.item));
  el.replaceChildren(list);
  decorateTextOverrides(el);

  if (el.matches('.seo')) setSEO(items);
}
