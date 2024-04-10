import { createTag, getMetadata, getConfig } from '../../utils/utils.js';
import { copyToClipboard } from '../../utils/tools.js';
import { loadTaxonomy, getLinkForTopic, getTaxonomyModule } from '../article-feed/article-helpers.js';
import { replaceKey } from '../../features/placeholders.js';
import { fetchIcons } from '../../features/icons/icons.js';
import { buildFigure } from '../figure/figure.js';

async function validateAuthorUrl(url) {
  if (!url) return null;

  const resp = await fetch(`${url.toLowerCase()}.plain.html`);
  if (!resp?.ok) {
    console.log(`Could not retrieve metadata for ${url}`);
    return null;
  }

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  return doc;
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

async function buildAuthorInfo(authorEl, bylineContainer) {
  const { href, textContent } = authorEl;

  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;
  const authorImg = createTag('div', { class: 'article-author-image' });
  authorImg.style.backgroundImage = `url(${base}/blocks/article-header/adobe-logo.svg)`;
  bylineContainer.prepend(authorImg);

  const doc = await validateAuthorUrl(href);
  if (!doc) {
    const p = createTag('p', null, textContent);
    authorEl.replaceWith(p);
    return;
  }

  const img = doc.querySelector('img');
  if (img) {
    img.setAttribute('alt', authorEl.textContent);
    authorImg.append(img);
    if (!img.complete) {
      img.addEventListener('load', () => {
        authorImg.style.backgroundImage = 'none';
      });
      img.addEventListener('error', () => {
        img.remove();
      });
    } else {
      authorImg.style.backgroundImage = 'none';
    }
  }
}

async function buildSharing() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.querySelector('h1').textContent);
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
  const allAnchorTags = platforms.map((platform) => {
    const platformProperties = platformMap[platform];
    if (platformProperties) {
      return createTag('a', platformProperties, svgs[platform].cloneNode(true));
    }
    return null;
  }).filter(Boolean);

  const sharing = createTag('div', { class: 'article-byline-sharing' });
  allAnchorTags.forEach((anchorTag) => {
    const span = createTag('span', null, anchorTag);
    sharing.append(span);
  });

  sharing.querySelectorAll('[data-href]').forEach((link) => {
    link.addEventListener('click', openPopup);
  });
  const copyButton = sharing.querySelector('#copy-to-clipboard');
  copyButton.addEventListener('click', async () => {
    const copyText = await replaceKey('copied-to-clipboard', getConfig());
    await copyToClipboard(copyButton, copyText);
  });

  return sharing;
}

async function validateDate(date) {
  const { env } = getConfig();
  if (env?.name === 'prod') return;
  if (date && !/^[0-1]\d{1}-[0-3]\d{1}-[2]\d{3}$/.test(date.textContent.trim())) {
    // match publication date to MM-DD-YYYY format
    date.classList.add('article-date-invalid');
    date.setAttribute('title', await replaceKey('invalid-date', getConfig()));
  }
}

export default async function init(blockEl) {
  if (!getTaxonomyModule()) {
    await loadTaxonomy();
  }

  const childrenEls = Array.from(blockEl.children);
  if (childrenEls.length < 4) {
    console.warn('Block does not have enough children');
  }

  const categoryContainer = childrenEls[0];
  const categoryEl = categoryContainer.firstElementChild.firstElementChild;
  if (categoryEl?.textContent) {
    const categoryTag = getLinkForTopic(categoryEl.textContent);
    categoryEl.innerHTML = categoryTag;
  }
  categoryContainer.classList.add('article-category');

  const titleContainer = childrenEls[1];
  titleContainer.classList.add('article-title');

  const bylineContainer = childrenEls[2];
  bylineContainer.classList.add('article-byline');
  bylineContainer.firstElementChild.classList.add('article-byline-info');

  const authorContainer = bylineContainer.firstElementChild.firstElementChild;
  const authorEl = authorContainer.querySelector('a');
  authorContainer.classList.add('article-author');

  await buildAuthorInfo(authorEl, bylineContainer);

  const date = bylineContainer.querySelector('.article-byline-info > p:last-child');
  date.classList.add('article-date');
  await validateDate(date);

  const shareBlock = await buildSharing();
  bylineContainer.append(shareBlock);

  const featureImgContainer = childrenEls[3];
  featureImgContainer.classList.add('article-feature-image');
  const featureFigEl = buildFigure(featureImgContainer.firstElementChild);
  featureFigEl.classList.add('figure-feature');
  featureImgContainer.prepend(featureFigEl);
  featureImgContainer.lastElementChild.remove();
}
