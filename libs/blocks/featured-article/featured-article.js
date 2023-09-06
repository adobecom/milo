import { getMetadata, createTag, getConfig } from '../../utils/utils.js';

async function createCategoryLink(el, category = 'News') {
  const promises = [import('../../scripts/taxonomy.js'), import('../../utils/helpers.js')];
  Promise.all(promises).then(async ([taxonomyMod, helpersMod]) => {
    const fetchTaxonomy = taxonomyMod.default;
    const { updateLinkWithLangRoot } = helpersMod;
    const config = getConfig();
    const taxonomyRoot = config.taxonomyRoot || '/topics';
    const taxonomy = await fetchTaxonomy(config, taxonomyRoot);
    const categoryTaxonomy = taxonomy.get(category);
    const categoryLink = createTag('a', { href: updateLinkWithLangRoot(categoryTaxonomy?.link) }, categoryTaxonomy?.name);
    el.append(categoryLink);
  });
}

export default async function init(el) {
  const a = el.querySelector('a');
  if (!a) return;
  a.innerHTML = '';
  a.classList.add('featured-article-card');
  const path = new URL(a.href).pathname;
  const resp = await fetch(path);
  if (!resp || !resp.ok) {
    a.remove();
    // eslint-disable-next-line no-console
    console.log(`Could not retrieve metadata for ${path}`);
    return;
  }

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const pic = doc.body.querySelector('picture');
  const img = pic.querySelector('img');
  img.removeAttribute('loading');
  const featuredImg = createTag('div', { class: 'featured-article-card-image' }, pic);
  const categoryEl = createTag('div', { class: 'featured-article-card-category' });
  img.addEventListener('load', () => {
    // Load category link after block has been displayed to speed up LCP
    createCategoryLink(categoryEl, getMetadata('article:tag', doc));
  });
  const text = doc.body.querySelector('h1, h2, h3').textContent;
  const title = createTag('h3', null, text);
  const body = createTag('div', { class: 'featured-article-card-body' });
  const descriptionMeta = getMetadata('description', doc);
  const description = createTag('p', { class: 'featured-article-card-description' }, descriptionMeta);
  const dateMeta = getMetadata('publication-date', doc);
  const date = createTag('p', { class: 'featured-article-card-date' }, dateMeta);

  body.append(categoryEl, title, description, date);
  a.append(featuredImg, body);
}
