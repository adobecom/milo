import { createTag } from '../../utils/utils.js';
import { decorateBlockAnalytics, decorateLinkAnalytics } from '../../martech/attributes.js';
import { decorateButtons } from '../../utils/decorate.js';

const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };

function setSEO(questions) {
  faq.mainEntity.push(questions.map(({ name, text }) => (
    { '@type': 'Question', name, acceptedAnswer: { text, '@type': 'Answer' } })));
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(faq));
  document.head.append(script);
}

function displayMedia(displayArea, el, dd, i, id, expanded) {
  const theID = el.getAttribute('aria-controls').split('-')[1];
  [...mediaCollection[theID]].map(
    (mediaCollectionItem, idx, total) => {
      mediaCollectionItem.classList.remove('expanded');

      for (let index = 0; index < total.length; index++) {
        mediaCollectionItem.classList.remove('expanded');
        const trigger = document.querySelector(`#accordion-${theID}-trigger-${index + 1}`);
        const content = document.querySelector(`#accordion-${theID}-content-${index + 1}`);
        trigger.setAttribute('hidden', '');
        trigger.setAttribute('aria-expanded', 'false');  
        content.setAttribute('hidden', '');
        content.setAttribute('aria-expanded', 'false');
      }
      el.setAttribute('aria-expanded', 'true');;
      el.removeAttribute('hidden');
      dd.setAttribute('aria-expanded', 'true');;
      dd.removeAttribute('hidden');
      displayArea.childNodes[i - 1].classList.add('expanded')

      // toggle
      if (expanded) {
        el.setAttribute('hidden', '');
        el.setAttribute('aria-expanded', 'false');  
        dd.setAttribute('hidden', '');
        dd.setAttribute('aria-expanded', 'false');
        displayArea.childNodes[i - 1].classList.remove('expanded')
      } 
    }
  );
}

function handleClick(el, dd, num, id) {
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    dd.removeAttribute('hidden');
  }

  if (el.closest('.editorial')) {
    displayMedia(el.closest('.editorial').querySelector('.accordion-media'), el, dd, num, id, expanded)
  }
}

function defalutOpen(accordion) {
  handleClick(accordion.querySelector('.accordion-trigger'), accordion.querySelector('dd'), 1, 0);
}

function createItem(accordion, id, heading, num, edit) {
  const triggerId = `accordion-${id}-trigger-${num}`;
  const panelId = `accordion-${id}-content-${num}`;
  const panelClass = `accordion-${id}`;
  const icon = createTag('span', { class: 'accordion-icon' });
  const button = createTag('button', {
    type: 'button',
    id: triggerId,
    class: 'accordion-trigger',
    'aria-expanded': 'false',
    'aria-controls': panelId,
  }, heading.textContent);
  button.append(icon);

  const panel = heading.nextElementSibling?.firstElementChild;

  const para = panel?.querySelector('p');
  const text = para ? para.textContent : panel?.textContent;

  const dt = createTag('dt', { role: 'heading', 'aria-level': 3 }, button);
  const dd = createTag('dd', { role: 'region', 'aria-labelledby': triggerId, id: panelId, hidden: true, class: panelClass}, panel);
  const dm = createTag('dd', { class: 'media-p' });

  if (edit) {
    const ogMedia = mediaCollection[id][num - 1];
    const mediaCopy = ogMedia.cloneNode(true);
    dm.append(mediaCopy)
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


const mediaCollection = {};

function populateMedia(accordion, id, num, collection) {
  mediaCollection[id] = collection;
  accordion.append(mediaCollection[id][num]);
}

export default function init(el) {
  const id = getUniqueId(el);
  const accordion = createTag('dl', { class: 'accordion', id: `accordion-${id}`, role: 'presentation' });
  const accordionMedia = createTag('div', { class: 'accordion-media', id: `accordion-media-${id}`});
  const isSeo = el.classList.contains('seo');
  const isEditorial = el.classList.contains('editorial');
  decorateButtons(el);

  if (isEditorial) {
    const editorialMedia = el.querySelectorAll(':scope > div:nth-child(3n)');
    [...editorialMedia].map(
      (media, idx, collection) => 
      populateMedia(accordionMedia, id, idx, collection),
    );
  };

  const headings = el.querySelectorAll(':scope > div:nth-child(odd)');
  const items = [...headings].map(
    (heading, idx) => 
    createItem(accordion, id, heading, idx + 1, isEditorial, accordionMedia),
  );

  if (isSeo) { setSEO(items); }
  el.innerHTML = '';
  el.className = `accordion-container ${el.className}`;
  el.classList.remove('accordion');
  const maxWidthClass = Array.from(el.classList).find((style) => style.startsWith('max-width-'));
  el.classList.add('con-block', maxWidthClass || 'max-width-10-desktop');
  accordion.classList.add('foreground');
  decorateBlockAnalytics(el);
  decorateLinkAnalytics(accordion, headings);
  el.append(accordion)
  if (isEditorial) {
    el.append(accordionMedia)
    defalutOpen(el);
    };
}
