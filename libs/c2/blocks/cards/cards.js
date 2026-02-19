import { createTag } from '../../../utils/utils.js';

function parseCardCell(cell) {
  const ps = cell.querySelectorAll(':scope > p');
  const firstP = ps[0];
  const picture = firstP?.querySelector('picture');
  let title = '';
  let description = '';
  let linkEl;

  if (ps.length >= 4) {
    title = (ps[1]?.textContent || '').trim();
    description = (ps[2]?.textContent || '').trim();
    linkEl = ps[3]?.querySelector('a');
  } else {
    if (firstP) {
      const clone = firstP.cloneNode(true);
      const pic = clone.querySelector('picture');
      if (pic) pic.remove();
      title = (clone.textContent || '').trim();
    }
    description = (ps[1]?.textContent || '').trim();
    linkEl = ps[2]?.querySelector('a');
  }

  const linkHref = linkEl?.getAttribute('href') || '';
  const linkText = (linkEl?.textContent || '').trim() || 'Learn more';

  return { picture, title, description, linkHref, linkText };
}

function buildCard({ picture, title, description, linkHref, linkText }, options = {}) {
  const { featured = false } = options;
  const card = createTag('div', { class: `card ${featured ? 'card--featured' : 'card--standard'}` });

  const media = createTag('div', { class: 'card-media' });
  if (picture) {
    media.appendChild(picture.cloneNode(true));
  }
  card.appendChild(media);

  const body = createTag('div', { class: 'card-body' });
  if (featured) {
    const heading = createTag('div', { class: 'card-heading' });
    if (title) {
      const titleEl = createTag('h3', { class: 'card-title' });
      titleEl.textContent = title;
      heading.appendChild(titleEl);
    }
    if (linkHref) {
      const link = createTag('a', { class: 'card-link', href: linkHref }, `${linkText} >`);
      heading.appendChild(link);
    }
    body.appendChild(heading);
    if (description) {
      const descEl = createTag('p', { class: 'card-description' });
      descEl.textContent = description;
      body.appendChild(descEl);
    }
  } else {
    if (title) {
      const titleEl = createTag('h3', { class: 'card-title' });
      titleEl.textContent = title;
      body.appendChild(titleEl);
    }
    if (description) {
      const descEl = createTag('p', { class: 'card-description' });
      descEl.textContent = description;
      body.appendChild(descEl);
    }
    if (linkHref) {
      const link = createTag('a', { class: 'card-link', href: linkHref }, `${linkText} >`);
      body.appendChild(link);
    }
  }
  card.appendChild(body);

  return card;
}

function decorate(el) {
  const rows = el.querySelectorAll(':scope > div');
  if (!rows.length) return;

  const fragment = document.createDocumentFragment();

  rows.forEach((row) => {
    const allCells = row.querySelectorAll('[data-valign="middle"]');
    const cells = [...allCells].filter(
      (cell) => (cell.textContent || '').trim().toLowerCase() !== 'hide',
    );
    if (!cells.length) return;

    if (cells.length === 1) {
      const featuredWrap = createTag('div', { class: 'cards-featured' });
      const data = parseCardCell(cells[0]);
      featuredWrap.appendChild(buildCard(data, { featured: true }));
      fragment.appendChild(featuredWrap);
    } else {
      const standardWrap = createTag('div', { class: 'cards-row' });
      standardWrap.style.setProperty('--cards-count', cells.length);
      cells.forEach((cell) => {
        const data = parseCardCell(cell);
        standardWrap.appendChild(buildCard(data, { featured: false }));
      });
      fragment.appendChild(standardWrap);
    }
  });

  el.innerHTML = '';
  el.appendChild(fragment);
}

export default function init(el) {
  decorate(el);
}
