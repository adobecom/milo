import { createTag, getConfig, getMetadata } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

// Elements excluded from the fetched article's reading-time word count.
const READING_TIME_EXCLUDE = [
  '.article-header', '.card-metadata', '.recommended-articles',
  '.related-content-card', 'nav', 'header', 'footer', 'script', 'style',
  '.article-feed', '.featured-article',
].join(', ');

function getTextLength(node) {
  let textLength = 0;
  for (const childNode of node.childNodes) {
    if (childNode.nodeType === Node.TEXT_NODE) {
      if (childNode.textContent.match(/\S+/g)) {
        textLength += childNode.textContent.match(/\S+/g).length;
      }
    } else {
      textLength += getTextLength(childNode);
    }
  }
  return textLength;
}

async function getReadingTimeText(textLength, config = getConfig()) {
  const readingSpeed = 200; // Assume that the average reader reads 200 words per minute
  const readingTime = Math.ceil(textLength / readingSpeed);
  const placeholderKey = (readingTime > 1) ? '5-min-read' : '1-min-read';
  const format = await replaceKey(placeholderKey, config);
  return format.replace(/[1,5]/g, readingTime);
}

function logError(message) {
  window.lana?.log(`related-content-card: ${message}`, { tags: 'related-content-card', severity: 'info' });
}

function trimTitle(title) {
  if (!title) return '';
  return title.split('|')[0].trim();
}

function parseDate(value) {
  const parts = value?.trim().match(/(\d{1,4})\D(\d{1,2})\D(\d{1,4})/);
  if (!parts) return null;
  const nums = parts.slice(1).map(Number);
  const [year, month, day] = parts[1].length === 4
    ? [nums[0], nums[1], nums[2]]
    : [nums[2], nums[0], nums[1]];
  const date = new Date(Date.UTC(year, month - 1, day));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value, config) {
  const date = parseDate(value);
  if (!date) return '';
  return date.toLocaleDateString(config.locale?.ietf, { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function formatCategory(tag) {
  const slug = tag.split('/').pop().replace(/-/g, ' ').trim();
  return slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';
}

// Resolve relative image URLs against the fetched article URL.
function resolveImageUrls(picture, baseUrl) {
  picture.querySelectorAll('img, source').forEach((el) => {
    ['src', 'srcset'].forEach((attr) => {
      const val = el.getAttribute(attr);
      if (!val) return;
      const resolved = val.split(',').map((part) => {
        const [url, descriptor] = part.trim().split(/\s+/);
        if (!url) return part.trim();
        return `${new URL(url, baseUrl).href}${descriptor ? ` ${descriptor}` : ''}`;
      }).join(', ');
      el.setAttribute(attr, resolved);
    });
  });
  return picture;
}

function getCardMetadata(doc) {
  const rows = {};
  doc.querySelectorAll('.card-metadata > div').forEach((row) => {
    const [key, value] = row.querySelectorAll(':scope > div');
    if (key && value) rows[key.textContent.trim().toLowerCase()] = value;
  });
  return rows;
}

function getLinkedCategory(meta) {
  const tags = meta.tags?.textContent.split(',').map((tag) => tag.trim()) || [];
  const topic = tags.find((tag) => tag.startsWith('caas:topic/'));
  return topic ? formatCategory(topic) : '';
}

async function getReadingTime(doc, config) {
  const main = doc.querySelector('main') || doc.body;
  const clone = main.cloneNode(true);
  clone.querySelectorAll(READING_TIME_EXCLUDE).forEach((el) => el.remove());
  const words = Math.max(getTextLength(clone), 1);
  return getReadingTimeText(words, config);
}

async function fetchLinkedData(link, config) {
  let articleUrl;
  try {
    articleUrl = new URL(link.href);
  } catch {
    return null;
  }
  try {
    const resp = await fetch(articleUrl.pathname);
    if (!resp.ok) throw new Error(`status ${resp.status}`);
    const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    const meta = getCardMetadata(doc);

    const title = trimTitle(meta.title?.textContent.trim())
      || trimTitle(getMetadata('og:title', doc)) || trimTitle(doc.title);

    let picture = meta.cardimage?.querySelector('picture');
    if (picture) {
      picture = resolveImageUrls(picture.cloneNode(true), articleUrl.href);
    } else {
      const ogImage = getMetadata('og:image', doc);
      if (ogImage) picture = createTag('picture', null, createTag('img', { src: ogImage, alt: '', loading: 'lazy' }));
    }

    return {
      title,
      picture,
      date: meta.carddate?.textContent.trim() || getMetadata('publication-date', doc) || '',
      category: getLinkedCategory(meta),
      readingTime: await getReadingTime(doc, config),
    };
  } catch (err) {
    logError(`failed to fetch linked article ${articleUrl.pathname}: ${err.message}`);
    return null;
  }
}

function getAuthoredData(block) {
  const link = block.querySelector('a[href]');
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const headingLink = heading?.querySelector('a[href]');
  const textCell = heading?.closest('div') || block.querySelector('div');
  const picture = block.querySelector('picture');

  const dateStrong = textCell?.querySelector('p > strong');
  const paragraphs = textCell
    ? [...textCell.querySelectorAll(':scope > p')].filter((p) => !p.querySelector('strong'))
    : [];

  return {
    link,
    navHref: headingLink?.href || link?.href || '',
    picture,
    title: heading?.textContent.trim() || '',
    date: dateStrong?.textContent.trim() || '',
    readingTime: paragraphs[0]?.textContent.trim() || '',
    category: paragraphs[1]?.textContent.trim() || '',
  };
}

function buildCard({
  navHref, picture, title, date, readingTime, category,
}) {
  const copy = createTag('div', { class: 'related-content-card-copy' });
  if (date) copy.append(createTag('p', { class: 'related-content-card-eyebrow' }, date));
  copy.append(createTag('h3', { class: 'related-content-card-title' }, title));

  if (readingTime || category) {
    const meta = createTag('p', { class: 'related-content-card-meta' });
    if (readingTime) meta.append(createTag('span', { class: 'related-content-card-readtime' }, readingTime));
    if (readingTime && category) {
      meta.append(createTag('span', { class: 'related-content-card-separator', 'aria-hidden': 'true' }, '|'));
    }
    if (category) meta.append(createTag('span', { class: 'related-content-card-category' }, category));
    copy.append(meta);
  }

  const children = [];
  if (picture) {
    picture.querySelector('img')?.setAttribute('alt', '');
    children.push(createTag('div', { class: 'related-content-card-image' }, picture));
  }
  children.push(copy);

  const attrs = { class: 'related-content-card-link' };
  if (navHref) attrs.href = navHref;
  return createTag('a', attrs, children);
}

export default async function init(block) {
  const config = getConfig();
  const authored = getAuthoredData(block);
  const linked = authored.link ? await fetchLinkedData(authored.link, config) : null;

  const title = authored.title || linked?.title || '';

  if (!title) {
    if (!authored.link) logError('no title and no link could be resolved');
    block.classList.add('related-content-card-unresolved');
    return;
  }

  const card = buildCard({
    navHref: authored.navHref,
    picture: authored.picture || linked?.picture || null,
    title,
    date: formatDate(authored.date || linked?.date || '', config),
    readingTime: authored.readingTime || linked?.readingTime || '',
    category: authored.category || linked?.category || '',
  });

  block.textContent = '';
  block.append(card);
}
