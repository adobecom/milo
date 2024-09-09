import { createTag } from '../../utils/utils.js';
import { decorateButtons } from '../../utils/decorate.js';
import { processTrackingLabels } from '../../martech/attributes.js';

const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };
const mediaCollection = {};

function setSEO(questions) {
  faq.mainEntity.push(questions.map(({ name, text }) => (
    { '@type': 'Question', name, acceptedAnswer: { text, '@type': 'Answer' } })));
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(faq));
  document.head.append(script);
}

function toggleMedia(con, trig, status) {
  if (status === 'open') {
    trig.setAttribute('hidden', '');
    trig.setAttribute('aria-expanded', 'false');
    con.setAttribute('hidden', '');
    con.setAttribute('aria-expanded', 'false');
  } else {
    trig.setAttribute('aria-expanded', 'true');
    trig.removeAttribute('hidden');
    con.setAttribute('aria-expanded', 'true');
    con.removeAttribute('hidden');
  }
}

function displayMedia(displayArea, el, dd, i, expanded) {
  const id = el.getAttribute('aria-controls').split('-')[1];
  [...mediaCollection[id]].forEach(
    (mediaCollectionItem, idx, total) => {
      mediaCollectionItem.classList.remove('expanded');

      total.forEach((element, index) => {
        const trigger = document.querySelector(`#accordion-${id}-trigger-${index + 1}`);
        const content = document.querySelector(`#accordion-${id}-content-${index + 1}`);
        toggleMedia(content, trigger, 'open');
      });
      toggleMedia(dd, el);
      displayArea.childNodes[i - 1].classList.add('expanded');

      if (expanded) {
        toggleMedia(dd, el, 'open');
        displayArea.childNodes[i - 1]?.classList.remove('expanded');
      }
    },
  );
}

function handleClick(el, dd, num) {
  const expanded = el.getAttribute('aria-expanded') === 'true';
  const analyticsValue = el.getAttribute('daa-ll');
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('daa-ll', analyticsValue.replace(/close-/, 'open-'));
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    el.setAttribute('daa-ll', analyticsValue.replace(/open-/, 'close-'));
    dd.removeAttribute('hidden');
  }

  const closestEditorial = el.closest('.editorial');
  if (closestEditorial) displayMedia(closestEditorial.querySelector('.accordion-media'), el, dd, num, expanded);
}

function defalutOpen(accordion) {
  handleClick(accordion.querySelector('.accordion-trigger'), accordion.querySelector('dd'), 1, 0);
}

function createItem(accordion, id, heading, num, edit) {
  const triggerId = `accordion-${id}-trigger-${num}`;
  const panelId = `accordion-${id}-content-${num}`;
  const icon = createTag('span', { class: 'accordion-icon' });
  const hTag = heading.querySelector('h1, h2, h3, h4, h5, h6');
  const analyticsString = `open-${num}--${processTrackingLabels(heading.textContent)}`;
  const button = createTag('button', {
    type: 'button',
    id: triggerId,
    class: 'accordion-trigger tracking-header',
    'aria-expanded': 'false',
    'aria-controls': panelId,
    'daa-ll': analyticsString,
  }, heading.textContent);
  button.append(icon);

  const panel = heading.nextElementSibling?.firstElementChild;

  const para = panel?.querySelector('p');
  const text = para ? para.textContent : panel?.textContent;
  const dtAttrs = hTag ? {} : { role: 'heading', 'aria-level': 3 };
  const dtHtml = hTag ? createTag(hTag.tagName, { class: 'accordion-heading' }, button) : button;
  const dt = createTag('dt', dtAttrs, dtHtml);
  const dd = createTag('dd', { 'aria-labelledby': triggerId, id: panelId, hidden: true }, panel);
  const dm = createTag('div', { class: 'media-p' });

  if (edit) {
    const ogMedia = mediaCollection[id][num - 1];
    const mediaCopy = ogMedia.cloneNode(true);
    dm.append(mediaCopy);
    dd.prepend(dm);
  }

  button.addEventListener('click', (e) => { handleClick(e.target, dd, num, id); });
  accordion.append(dt, dd);

  return { name: heading.textContent, text };
}

function getUniqueId(el) {
  const accordions = document.querySelectorAll('.accordion');
  return [...accordions].indexOf(el) + 1;
}

function populateMedia(accordion, id, num, collection) {
  mediaCollection[id] = collection;
  accordion.append(mediaCollection[id][num]);
}

export default function init(el) {
  const id = getUniqueId(el);
  const accordion = createTag('dl', { class: 'accordion', id: `accordion-${id}`, role: 'presentation' });
  const accordionMedia = createTag('div', { class: 'accordion-media', id: `accordion-media-${id}` });
  const isSeo = el.classList.contains('seo');
  const isEditorial = el.classList.contains('editorial');
  decorateButtons(el);

  if (isEditorial) {
    const editorialMedia = el.querySelectorAll(':scope > div:nth-child(3n)');
    [...editorialMedia].map(
      (media, idx, collection) => populateMedia(accordionMedia, id, idx, collection),
    );
  }

  const headings = el.querySelectorAll(':scope > div:nth-child(odd)');
  const items = [...headings].map(
    (heading, idx) => createItem(
      accordion,
      id,
      heading,
      idx + 1,
      isEditorial,
      accordionMedia,
    ),
  );

  if (isSeo) { setSEO(items); }
  el.innerHTML = '';
  el.className = `accordion-container ${el.className}`;
  el.classList.remove('accordion');
  const maxWidthClass = Array.from(el.classList).find((style) => style.startsWith('max-width-'));
  el.classList.add('con-block', maxWidthClass || 'max-width-10-desktop');
  accordion.classList.add('foreground');
  el.append(accordion);
  if (isEditorial) {
    el.append(accordionMedia);
    defalutOpen(el);
  }
}
