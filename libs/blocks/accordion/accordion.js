import { createTag } from '../../utils/utils.js';
import { decorateBlockAnalytics, decorateLinkAnalytics } from '../../martech/attributes.js';

const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };

function setSEO(questions) {
  faq.mainEntity.push(questions.map(({ name, text }) => (
    { '@type': 'Question', name, acceptedAnswer: { text, '@type': 'Answer' } })));
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(faq));
  document.head.append(script);
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
    displayMedia(document.querySelector('.accordion-media'), el, num, id)
  }
}

function displayMedia(area,bi, i, id) {
     const items = [...mediaCollection].map(
      (mediaCollectionItem, idx) => {
        mediaCollectionItem.classList.remove('expanded');
        const panels = document.querySelectorAll(`.accordion-${id}`);
        const panelCollection = [...panels].map(
          (panel, idx) => {
            const expanded = panel.getAttribute('aria-expanded') === 'true';
            if (idx + 1 === i && !expanded) {
              console.log(`match!! panel ${idx + 1} & ${i} `);
              document.querySelector(`#accordion-${id}-content-${i}`).setAttribute('aria-expanded', 'true');;
              document.querySelector(`#accordion-${id}-content-${i}`).removeAttribute('hidden');
            } else {
              document.querySelector(`#accordion-${id}-content-${idx + 1}`).setAttribute('hidden', '');
              document.querySelector(`#accordion-${id}-content-${idx + 1}`).setAttribute('aria-expanded', 'false');      
            }
          }
        )
      }
    );
    document.querySelector('.accordion-media').childNodes[i - 1].classList.add('expanded')
}

function createItem(accordion, id, heading, num) {
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

  button.addEventListener('click', (e) => { handleClick(e.target, dd, num, id); });

  const numberOne = document.querySelector('.accordion-trigger');
  accordion.append(dt, dd);
  dd.prepend(dm);
  return { name: heading.textContent, text };
}

function getUniqueId(el) {
  const accordions = document.querySelectorAll('.accordion');
  return [...accordions].indexOf(el) + 1;
}

const mediaCollection = [];

// remove media from DOM and add to array to later display 
function createMedia(accordion, id, media, num) {
  mediaCollection.push(media);
  media.remove();
  accordion.append(mediaCollection[num]);
}

export default function init(el) {
  const id = getUniqueId(el);
  const accordion = createTag('dl', { class: 'accordion', id: `accordion-${id}`, role: 'presentation' });
  const accordionMedia = createTag('div', { class: 'accordion-media', id: `accordion-media-${id}`});
  const isSeo = el.classList.contains('seo');
  const isEditorial = el.classList.contains('editorial');

  if (isEditorial) {
    const editMediaItems = el.querySelectorAll(':scope > div:nth-child(3n)');
    const it = [...editMediaItems].map(
      (media, idx) => 
      createMedia(accordionMedia, id, media, idx),
    );
  };


  const headings = el.querySelectorAll(':scope > div:nth-child(odd)');
  const items = [...headings].map(
    (heading, idx) => 
    createItem(accordion, id, heading, idx + 1),
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
  if (isEditorial) { el.append(accordionMedia)};
}
