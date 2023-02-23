import { createTag, getMetadata, getConfig } from '../../utils/utils.js';
import { sampleRUM } from '../../utils/samplerum.js';
import { loadTaxonomy, computeTaxonomyFromTopics, getTaxonomyModule, getLinkForTopic } from '../../blocks/article-feed/article-helpers.js';
import { replaceKey } from '../../features/placeholders.js';
import { fetchIcons } from '../../features/icons.js';
import { buildFigure } from '../../blocks/figure/figure.js';

async function populateAuthorInfo(authorEl, imgContainer, url, name) {
  if (!url) return;
  const resp = await fetch(`${url}.plain.html`);
  if (!resp || !resp.ok) {
    const p = createTag('p', null, authorEl.textContent);
    authorEl.replaceChildren(p);
    console.log(`Could not retrieve metadata for ${url}`);
    return;
  }
  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const img = doc.querySelector('img');
  if (img) {
    img.setAttribute('alt', name);
    imgContainer.append(img);
    if (!img.complete) {
      img.addEventListener('load', () => {
        imgContainer.style.backgroundImage = 'none';
      });
      img.addEventListener('error', () => {
        img.remove();
      });
    } else {
      imgContainer.style.backgroundImage = 'none';
    }
  }
}

function openPopup(e) {
  const target = e.target.closest('a');
  const href = target.getAttribute('data-href');
  const type = target.getAttribute('data-type');
  window.open(
    href,
    type,
    'popup,top=233,left=233,width=700,height=467',
  );
}

async function copyToClipboard(button) {
  try {
    await navigator.clipboard.writeText(window.location.href);
    button.setAttribute('title', await replaceKey('copied-to-clipboard', getConfig()));
    button.setAttribute('alt', await replaceKey('copied-to-clipboard', getConfig()));
    button.setAttribute('aria-label', await replaceKey('copied-to-clipboard', getConfig()));

    const tooltip = createTag('div', { role: 'status', 'aria-live': 'polite', class: 'copied-to-clipboard' }, `${await replaceKey('copied-to-clipboard', getConfig())}`);
    button.append(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 3000);
    button.classList.remove('copy-failure');
    button.classList.add('copy-success');
  } catch (e) {
    button.classList.add('copy-failure');
    button.classList.remove('copy-success');
  }
}

async function buildSharing(el, heading) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(heading.textContent);
  const description = encodeURIComponent(getMetadata('description'));

  const platformMap = {
    twitter: {
      'data-href': `https://www.twitter.com/share?&url=${url}&text=${title}`,
      alt: `${await replaceKey('share-twitter', getConfig())}`,
      'aria-label': `${await replaceKey('share-twitter', getConfig())}`,
    },
    linkedin: {
      'data-type': 'LinkedIn',
      'data-href': `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${description || ''}`,
      alt: `${await replaceKey('share-linkedin', getConfig())}`,
      'aria-label': `${await replaceKey('share-linkedin', getConfig())}`,
    },
    facebook: {
      'data-type': 'Facebook',
      'data-href': `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      alt: `${await replaceKey('share-facebook', getConfig())}`,
      'aria-label': `${await replaceKey('share-facebook', getConfig())}`,
    },
    link: {
      id: 'copy-to-clipboard',
      alt: `${await replaceKey('copy-to-clipboard', getConfig())}`,
      'aria-label': `${await replaceKey('copy-to-clipboard', getConfig())}`,
    },
  };

  const platforms = Object.keys(platformMap);
  const svgs = await fetchIcons(getConfig());

  const sharing = createTag('div');
  sharing.classList.add('article-byline-sharing');

  const anchorTags = platforms.map(async (platform) => {
    const platformProperties = platformMap[platform];
    if (platformProperties) {
      return createTag('a', platformProperties, svgs[platform]);
    }
    return null;
  });

  const allAnchorTags = await Promise.all(anchorTags);
  allAnchorTags.forEach((anchorTag) => {
    const span = createTag('span', null, anchorTag);
    sharing.append(span);
  });

  sharing.querySelectorAll('[data-href]').forEach((link) => {
    link.addEventListener('click', openPopup);
  });
  const copyButton = sharing.querySelector('#copy-to-clipboard');
  copyButton.addEventListener('click', async () => {
    await copyToClipboard(copyButton);
  });

  el.append(sharing);
}

async function validateDate(date) {
  if (date && !/^[0-1]\d{1}-[0-3]\d{1}-[2]\d{3}$/.test(date.textContent.trim())) {
    // match publication date to MM-DD-YYYY format
    date.classList.add('article-date-invalid');
    date.setAttribute('title', await replaceKey('invalid-date', getConfig()));
  }
}

async function decorateArticleHeader() {
  const el = document.querySelector('.section');
  const h1 = el.querySelector('h1');
  const picture = el.querySelector('picture');
  const tag = getMetadata('article:tag');
  const category = tag || 'News';
  const authorName = getMetadata('author');
  const { codeRoot, miloLibs } = getConfig();
  const authorURL = getMetadata('author-url') || (authorName ? `${codeRoot}/authors/${authorName.toLowerCase().replace(/[^0-9a-z]/gi, '-')}` : null);
  const publicationDate = getMetadata('publication-date');

  const imageWrapper = createTag('div', { class: 'figure-feature' }, picture);
  const figure = buildFigure(imageWrapper);
  const featureImgContainer = createTag('div', { class: 'article-feature-image' }, figure);

  const categoryTag = getLinkForTopic(category);
  const categoryEl = createTag('div', { class: 'article-category' }, categoryTag);

  const titleEl = createTag('div', { class: 'article-title' }, h1);

  const base = miloLibs || codeRoot;
  const authorImg = createTag('div', { class: 'article-author-image' });
  authorImg.style.backgroundImage = `url(${base}/templates/article-header-and-tags/adobe-logo.svg)`;

  const author = authorURL ? `<a href="${authorURL}">${authorName}</a>` : authorName;
  const authorWrapper = createTag('div', { class: 'article-author' }, author);
  const publicationDateEl = createTag('div', { class: 'article-date' }, publicationDate);
  validateDate(publicationDateEl);

  const bylineInfo = createTag('div', { class: 'article-byline-info' }, [authorWrapper, publicationDateEl]);
  populateAuthorInfo(authorWrapper, authorImg, authorURL, authorName);

  const byline = createTag('div', { class: 'article-byline' }, [authorImg, bylineInfo]);

  buildSharing(byline, h1);

  const articleHeader = createTag('div', { class: 'article-header' }, [categoryEl, titleEl, byline, featureImgContainer]);

  el.prepend(articleHeader);

  
}

function decorateTags(topics) {
  const articleTax = computeTaxonomyFromTopics(topics);
  const tagsForBlock = articleTax.visibleTopics.map((topic) => {
    const anchor = createTag('a', { href: getTaxonomyModule().get(topic).link }, topic);
    return anchor;
  });

  const tagsEl = createTag('p');
  const container = createTag('div', { class: 'tags-container' }, tagsEl);
  const mainEl = document.querySelector('main');
  const recBlock = mainEl.querySelector('.recommended-articles');
  if (recBlock) {
    recBlock.insertAdjacentElement('beforebegin', container);
  } else {
    mainEl.lastElementChild.append(container);
  }

  const targets = [];
  Array.from(tagsForBlock).forEach((tag) => {
    tag.classList.add('button');
    tagsEl.append(tag);
    targets.push(tag.textContent);
  });
  const target = targets.join('; ');

  sampleRUM('loadtags', { target, source: 'tags' });
}

async function init() {
  await loadTaxonomy();
  await decorateArticleHeader();

  const topics = [...document.head.querySelectorAll('meta[property="article:tag"]')].map((el) => el.content);
  decorateTags(topics);
}

await init();
