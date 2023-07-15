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

function handleClick(el, dd, num, id) {
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    dd.removeAttribute('hidden');
  }

  const theID = el.getAttribute('aria-controls').split('-')[1];
  console.log(theID);
  if (el.closest('.editorial')) {
    console.log(el.closest('.editorial'));
    console.log(id);
    console.log(num);
    displayMedia(el.closest('.editorial').querySelector('.accordion-media'), el, dd, num, id, expanded, theID)
  }
}

function defalutOpen(accordion) {
  handleClick(accordion.querySelector('.accordion-trigger'), accordion.querySelector('dd'), 1, 0);
}

function displayMedia(area,bi, d, i, id, expandd, newID) {
  console.log('dispaly media');
  console.log('id');
  console.log(id);
  console.log('newID');
  console.log(newID);
  console.log(mediaCollection[newID]);
    const theID = bi.getAttribute('aria-controls').split('-')[1];
     const items = [...mediaCollection[newID]].map(
      (mediaCollectionItem, idx, total) => {
        console.log(mediaCollectionItem);
        console.log(area);
        console.log('bi');
        console.log(bi.id);
        console.log(`d ${d}`);
        console.log(`you clicked item ${i}`);
        console.log(`id ${id}`);
        mediaCollectionItem.classList.remove('expanded');
        const panels = document.querySelectorAll(`.accordion-${id}`);
        console.log( document.querySelectorAll(`.accordion-${id}`));
        console.log('total');
        console.log(total.length);

        // Reset all 
        for (let index = 0; index < total.length; index++) {
          mediaCollectionItem.classList.remove('expanded');
          console.log(`#accordion-${theID}-trigger-${index + 1}`);
          console.log(document.querySelector(`#accordion-${theID}-trigger-${index + 1}`));
          document.querySelector(`#accordion-${theID}-trigger-${index + 1}`).setAttribute('hidden', '');
          document.querySelector(`#accordion-${theID}-trigger-${index + 1}`).setAttribute('aria-expanded', 'false');  
          document.querySelector(`#accordion-${theID}-content-${index + 1}`).setAttribute('hidden', '');
          document.querySelector(`#accordion-${theID}-content-${index + 1}`).setAttribute('aria-expanded', 'false');
        }
        document.querySelector(`#accordion-${theID}-trigger-${i}`).setAttribute('aria-expanded', 'true');;
        document.querySelector(`#accordion-${theID}-trigger-${i}`).removeAttribute('hidden');
        document.querySelector(`#accordion-${theID}-content-${i}`).setAttribute('aria-expanded', 'true');;
        document.querySelector(`#accordion-${theID}-content-${i}`).removeAttribute('hidden');
        document.querySelector('.accordion-media').childNodes[i - 1].classList.add('expanded')

        // toggle
        if (expandd) {
          console.log(`you clicked item ${i} and its expanded`);
          document.querySelector(`#accordion-${theID}-trigger-${i}`).setAttribute('hidden', '');
          document.querySelector(`#accordion-${theID}-trigger-${i}`).setAttribute('aria-expanded', 'false');  
          document.querySelector(`#accordion-${theID}-content-${i}`).setAttribute('hidden', '');
          document.querySelector(`#accordion-${theID}-content-${i}`).setAttribute('aria-expanded', 'false');
          document.querySelector('.accordion-media').childNodes[i - 1].classList.remove('expanded')

        } 

      }
    );
}

function createItem(accordion, id, heading, num, edit) {
  console.log(`create item ${id}`);
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
    const ogMedia = mediaCollection[id][0];
    console.log('ogMedia');
    console.log(ogMedia);
    console.log(mediaCollection[id][0]);
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


setTimeout( () => {
  console.log(mediaCollection);
}, 10000)


// remove media from DOM and add to array to later display 
function createMedia(accordion, id, media, num, length) {
  mediaCollection[id] = length;
  // media.remove();
  accordion.append(mediaCollection[id][num]);
  // document.querySelector(`#accordion-${id}-content-${1 + num}`).append

}

export default function init(el) {
  const id = getUniqueId(el);
  const accordion = createTag('dl', { class: 'accordion', id: `accordion-${id}`, role: 'presentation' });
  const accordionMedia = createTag('div', { class: 'accordion-media', id: `accordion-media-${id}`});
  const isSeo = el.classList.contains('seo');
  const isEditorial = el.classList.contains('editorial');
  decorateButtons(el);

  if (isEditorial) {
    const editMediaItems = el.querySelectorAll(':scope > div:nth-child(3n)');
    const it = [...editMediaItems].map(
      (media, idx, length, dd) => 
      createMedia(accordionMedia, id, media, idx, length),

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
