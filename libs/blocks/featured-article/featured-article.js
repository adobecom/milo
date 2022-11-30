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

/* <div class="featured-article">
  <a class="featured-article-card" href="/published/2022/11/15/voices-of-our-community">
    <div class="featured-article-card-image">
      <picture>
        <source type="image/webp"
          srcset="/published/2022/11/15/media_1cd7a8c416aaff1e70d71679b74441e46c4c545f3.png?width=750&amp;format=webply&amp;optimize=medium">
        <img
          src="/published/2022/11/15/media_1cd7a8c416aaff1e70d71679b74441e46c4c545f3.png?width=750&amp;format=png&amp;optimize=medium"
          loading="lazy" alt="Still from 'New York Minute'">
      </picture>
    </div>
    <div class="featured-article-card-body">
      <p class="featured-article-card-category">
        <a href="/topics/creativity" topics="" creativity="">Creativity</a>
      </p>
      <h3>"In a New York Minute” with Maliyamungu Muhande and Imani Dennison </h3>
      <p class="featured-article-card-description">Filmmakers Maliyamungu Muhande and Imani Dennison collaborated
        together with Muhande creating an original short film around the theme of “community”, and Dennison documenting
        and filming Muhande’s creative process behind the scenes.</p>
      <p class="featured-article-card-date">08-01-2022
      </p>
    </div>
  </a>
</div> */
