import { createTag, getMetadata, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';
import { fetchIcons } from '../../features/icons.js';
import { buildFigure } from '../figure/figure.js';

async function populateAuthorInfo(authorEl, imgContainer, url, name) {
  const resp = await fetch(`${url}.plain.html`);
  if (!resp || !resp.ok) {
    const p = document.createElement('p');
    p.innerHTML = authorEl.innerHTML;
    authorEl.replaceWith(p);
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
    }, 5000);
    button.classList.remove('copy-failure');
    button.classList.add('copy-success');
  } catch (e) {
    button.classList.add('copy-failure');
    button.classList.remove('copy-success');
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

  return sharing;
}

async function validateDate(date) {
  if (date && !/[0-1]\d{1}-[0-3]\d{1}-[2]\d{3}/.test(date.textContent.trim())) {
    // match publication date to MM-DD-YYYY format
    date.classList.add('article-date-invalid');
    date.setAttribute('title', await replaceKey('invalid-date', getConfig()));
  }
}

// /**
//  * builds article header block from meta and default content.
//  * @param {Element} mainEl The container element
//  */
// //  function buildArticleHeader(mainEl) {
// //   const div = document.createElement('div');
// //   const h1 = mainEl.querySelector('h1');
// //   const picture = mainEl.querySelector('picture');
// //   const tags = getMetadata('article:tag', true);
// //   const category = tags.length > 0 ? tags[0] : '';
// //   const author = getMetadata('author');
// //   const { codeRoot } = getConfig();
// //   const authorURL = getMetadata('author-url') || `${codeRoot}/authors/${toClassName(author)}`;
// //   const publicationDate = getMetadata('publication-date');

// //   const categoryTag = getLinkForTopic(category);

// //   const test = [
// //     [`<p>${categoryTag}</p>`],
// //     [h1],
// //     [`<p><a href="${authorURL}">${author}</a></p>
// //       <p>${publicationDate}</p>`],
// //     [{ elems: [picture.closest('p'), getImageCaption(picture)] }],
// //   ]
// //   const articleHeaderBlockEl = buildBlock('article-header', test);
// //   console.log(articleHeaderBlockEl);
// //   div.append(articleHeaderBlockEl);
// //   mainEl.prepend(div);
// // }

export default async function init(blockEl, blockName, document, eager) {
  const childrenEls = Array.from(blockEl.children);

  const categoryContainer = childrenEls[0];
  categoryContainer.classList.add('article-category');

  const titleContainer = childrenEls[1];
  titleContainer.classList.add('article-title');

  const bylineContainer = childrenEls[2];
  bylineContainer.classList.add('article-byline');
  bylineContainer.firstElementChild.classList.add('article-byline-info');

  const author = bylineContainer.firstElementChild.firstElementChild;
  const authorEl = author.querySelector('a');
  const authorURL = authorEl.href;
  const authorName = author.textContent;
  author.classList.add('article-author');

  const date = bylineContainer.firstElementChild.lastElementChild;
  date.classList.add('article-date');
  await validateDate(date);

  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;
  const authorImg = createTag('div', { class: 'article-author-image' });
  authorImg.style.backgroundImage = `url(${base}/blocks/article-header/adobe-logo.svg)`;
  bylineContainer.prepend(authorImg);
  populateAuthorInfo(authorEl, authorImg, authorURL, authorName, eager);

  const shareBlock = await buildSharing();
  bylineContainer.append(shareBlock);

  const featureImgContainer = childrenEls[3];
  featureImgContainer.classList.add('article-feature-image');
  const featureFigEl = buildFigure(featureImgContainer.firstElementChild);
  featureFigEl.classList.add('figure-feature');
  featureImgContainer.prepend(featureFigEl);
  featureImgContainer.lastElementChild.remove();
}
