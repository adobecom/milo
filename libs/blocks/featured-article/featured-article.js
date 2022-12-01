import { getMetadata, createTag, getConfig } from '../../utils/utils.js';
import fetchTaxonomy from '../../scripts/taxonomy.js'

export default async function init(el) {
  const a = el.querySelector('a');
  if (!a) return;
  a.innerHTML = '';
  a.classList.add('featured-article-card');
  const path = new URL(a.href).pathname;
  const resp = await fetch(path);
  if (!resp || !resp.ok) {
    // eslint-disable-next-line no-console
    console.log(`Could not retrieve metadata for ${path}`);
    return;
  }

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const category = getMetadata('article:tag', doc);

  //load taxonomy to get link of article "category"
  let taxonomy = await fetchTaxonomy(getConfig(), '/topics')
  const categoryTaxonomy = taxonomy.get(category)

  // Image
  const pic = doc.body.querySelector('picture');
  const featuredImg = createTag('div', { class: 'featured-article-card-image' }, pic);

  // Category
  const categoryLink = createTag('a', { href: categoryTaxonomy.link }, categoryTaxonomy.name);
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
