import { createTag } from '../../utils/utils.js';

const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [] };

function setSEO(questions) {
  faq.mainEntity.push(questions.map(({ name, text }) => (
    { '@type': 'Question', name, acceptedAnswer: { text, '@type': 'Answer' } })));
  const script = createTag('script', { type: 'application/ld+json' }, JSON.stringify(faq));
  document.head.append(script);
}

function handleClick(el, dt, dd) {
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (expanded) {
    el.setAttribute('aria-expanded', 'false');
    dd.setAttribute('hidden', '');
  } else {
    el.setAttribute('aria-expanded', 'true');
    dd.removeAttribute('hidden');
  }
  dt.classList.toggle('is-open');
  dd.classList.toggle('is-open');
}

function handleFocus(dt, dd) {
  dt.classList.add('has-focus');
  dd.classList.add('has-focus');
}

function handleFocusOut(dt, dd) {
  dt.classList.remove('has-focus');
  dd.classList.remove('has-focus');
}

function createItem(accordion, id, heading, num) {
  const triggerId = `accordion-${id}-trigger-${num}`;
  const panelId = `accordion-${id}-content-${num}`;

  const button = createTag('button', {
    type: 'button',
    id: triggerId,
    class: 'accordion-trigger',
    'aria-expanded': 'false',
    'aria-controls': panelId,
  }, heading.textContent);

  const panel = heading.nextElementSibling.firstElementChild;
  const para = panel.querySelector('p');
  const text = para ? para.textContent : panel.textContent;

  const dt = createTag('dt', { role: 'heading', 'aria-level': 3 }, button);
  const dd = createTag('dd', { role: 'region', 'aria-labelledby': triggerId, id: panelId, hidden: true }, panel);

  button.addEventListener('click', (e) => { handleClick(e.target, dt, dd); });
  dt.addEventListener('focusin', () => { handleFocus(dt, dd); });
  dd.addEventListener('focusin', () => { handleFocus(dt, dd); });
  dt.addEventListener('focusout', () => { handleFocusOut(dt, dd); });
  dd.addEventListener('focusout', () => { handleFocusOut(dt, dd); });
  accordion.append(dt, dd);
  return { name: heading.textContent, text };
}

function getUniqueId(el) {
  const accordions = document.querySelectorAll('.accordion');
  return [...accordions].indexOf(el) + 1;
}

export default function init(el) {
  const id = getUniqueId(el);
  const accordion = createTag('dl', { class: 'accordion', id: `accordion-${id}`, role: 'presentation' });
  const isSeo = el.classList.contains('seo');

  const headings = el.querySelectorAll(':scope > div:nth-child(odd)');
  const items = [...headings].map((heading, idx) => createItem(accordion, id, heading, idx + 1));

  if (isSeo) { setSEO(items); }
  el.innerHTML = '';
  el.className = `accordion-container ${el.className}`;
  el.classList.remove('accordion');
  el.append(accordion);
}
