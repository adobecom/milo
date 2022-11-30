import { getMetadata, createTag } from '../../utils/utils.js';

export default async function init(el) {
  const a = el.querySelector('a');
  if (!a) return;
  a.innerHTML = '';
  a.classList.add('featured-article-card');
  const resp = await fetch(a.href);
  if (!resp.ok) return;
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const category = getMetadata('article:tag', doc);

  // Image
  const pic = doc.body.querySelector('picture');
  const featuredImg = createTag('div', { class: 'featured-article-card-image' }, pic);

  // Category
  const categoryLink = createTag('a', { href: 'CHANGE_ME' }, category);
  const categoryEl = createTag('div', { class: 'featured-article-card-category' }, categoryLink);

  // Title
  const text = doc.body.querySelector('h1, h2, h3').textContent;
  const title = createTag('h3', null, text);
  const body = createTag('div', { class: 'featured-article-card-body' });

  // Description
  const descriptionMeta = getMetadata('description', doc);
  const description = createTag('p', { class: 'featured-article-card-description' }, descriptionMeta);

  // Date
  const dateMeta = getMetadata('publication-date', doc);
  const date = createTag('p', { class: 'featured-article-card-date' }, dateMeta);

  body.append(categoryEl, title, description, date);

  a.append(featuredImg, body);
}
