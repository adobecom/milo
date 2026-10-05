import { createTag, getConfig, getMetadata } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';
import { getSVGsfromFile } from '../share/share.js';
import { getModal } from '../modal/modal.js';

const SHARE_MODAL_ID = 'blog-share-modal';
const DEFAULT_PLATFORMS = ['x', 'email', 'linkedin', 'copy'];
const PREVIEW_PARAMS = ['milolibs', 'martech', 'mep', 'georouting'];
const ICON_PATH = 'blocks/blog-header/blog-header.svg';

const SHARE_LABEL_KEYS = {
  heading: 'blog-share-post',
  close: 'blog-share-close',
  x: 'blog-share-x',
  email: 'blog-share-email',
  linkedin: 'blog-share-linkedin',
  copy: 'blog-share-copy-link',
  copied: 'blog-share-link-copied',
  copyError: 'blog-share-copy-error',
};

export function getReadingTime(main) {
  const content = main.cloneNode(true);

  content.querySelectorAll(
    '.blog-header, .section-metadata, .card-metadata, .reading-time, '
    + 'script, style, template, nav, [hidden], [aria-hidden="true"]',
  ).forEach((element) => element.remove());
  content.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, li, td, th, br')
    .forEach((element) => element.after(' '));

  const wordCount = (content.textContent.match(/\S+/g) || []).length;

  // Match Milo's reading-time block: 200 words/minute
  return Math.ceil(wordCount / 200);
}

/* Author profile picture resolution */

const profileCache = new Map();

function resolveUrl(value, base) {
  try {
    return new URL(value, base).href;
  } catch (e) {
    return value;
  }
}

function resolveSrcset(srcset, base) {
  return srcset.split(',').map((candidate) => {
    const [url, descriptor] = candidate.trim().split(/\s+/);
    return [resolveUrl(url, base), descriptor].filter(Boolean).join(' ');
  }).join(', ');
}

function resolveMediaUrls(picture, base) {
  picture.querySelectorAll?.('source[srcset]').forEach((source) => {
    source.setAttribute('srcset', resolveSrcset(source.getAttribute('srcset'), base));
  });
  const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
  if (img?.getAttribute('src')) img.setAttribute('src', resolveUrl(img.getAttribute('src'), base));
  if (img?.getAttribute('srcset')) img.setAttribute('srcset', resolveSrcset(img.getAttribute('srcset'), base));
}

function fetchProfilePicture(profileUrl) {
  if (!profileCache.has(profileUrl)) {
    profileCache.set(profileUrl, (async () => {
      let resp;
      try {
        resp = await fetch(`${profileUrl}.plain.html`);
      } catch (e) {
        window.lana?.log(`Blog header: author profile request failed for ${profileUrl}: ${e.message}`, { tags: 'blog-header', errorType: 'e' });
        return null;
      }
      if (!resp.ok) {
        window.lana?.log(`Blog header: author profile responded ${resp.status} for ${profileUrl}`, { tags: 'blog-header', errorType: 'e' });
        return null;
      }
      const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
      return doc.querySelector('.blog-author picture') || doc.querySelector('.blog-author img') || null;
    })());
  }
  return profileCache.get(profileUrl);
}

function defaultAvatar(base) {
  return createTag('img', {
    class: 'blog-header-avatar',
    src: `${base}/blocks/blog-header/img/author-placeholder.png`,
    alt: '',
    loading: 'lazy',
  });
}

async function loadProfilePicture(profileUrl, avatar) {
  const picture = await fetchProfilePicture(profileUrl);
  if (!picture) return;
  const clone = picture.cloneNode(true);
  resolveMediaUrls(clone, profileUrl);
  const img = clone.tagName === 'IMG' ? clone : clone.querySelector('img');
  img?.classList.add('blog-header-avatar');
  avatar.replaceChildren(clone);
}

function decorateAuthor(row, authorLinkEnabled, base) {
  const inner = row.querySelector(':scope > div') || row;
  const author = createTag('div', { class: 'blog-header-author' });
  const avatar = createTag('div', { class: 'blog-header-author-avatar' });
  const info = createTag('div', { class: 'blog-header-author-info' });

  const authoredPicture = inner.querySelector('picture');
  const paragraphs = [...inner.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture') && p.textContent.trim());
  const nameP = paragraphs[0];
  const link = nameP?.querySelector('a');
  const name = (link || nameP)?.textContent.trim() || '';

  const nameEl = (link && authorLinkEnabled)
    ? createTag('a', { class: 'blog-header-author-name', href: link.getAttribute('href') }, name)
    : createTag('span', { class: 'blog-header-author-name' }, name);
  info.append(nameEl);

  const meta = paragraphs.slice(1).map((p) => p.textContent.trim()).filter(Boolean).join(' | ');
  if (meta) info.append(createTag('span', { class: 'blog-header-author-meta' }, meta));

  if (authoredPicture) {
    avatar.append(authoredPicture);
  } else {
    avatar.append(defaultAvatar(base));
    const href = link?.getAttribute('href');
    if (authorLinkEnabled && href) {
      loadProfilePicture(resolveUrl(href, window.location.href), avatar);
    }
  }

  author.append(avatar, info);
  return author;
}

/* Eyebrow */

function formatDate(value, config) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
  return new Intl.DateTimeFormat(config.locale?.ietf || 'en-US', options).format(date);
}

async function buildEyebrow(config, readingTime) {
  const eyebrow = createTag('p', { class: 'blog-header-eyebrow' });

  let startText = getMetadata('eyebrow-start');
  if (!startText) {
    const published = formatDate(getMetadata('publication-date'), config);
    const updated = formatDate(getMetadata('updated-date'), config);
    startText = updated ? `${published} [${updated}]` : published;
  }

  let endText = getMetadata('eyebrow-end');
  if (!endText && readingTime > 0) {
    const key = readingTime > 1 ? '5-min-read' : '1-min-read';
    endText = (await replaceKey(key, config)).replace(/[15]/g, readingTime);
  }

  if (startText) eyebrow.append(createTag('span', { class: 'blog-header-eyebrow-start' }, startText));
  if (endText) eyebrow.append(createTag('span', { class: 'blog-header-eyebrow-end' }, endText));
  return eyebrow;
}

/* Social share modal */

export function getShareUrl() {
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  if (canonical) return canonical;
  const url = new URL(window.location.href);
  PREVIEW_PARAMS.forEach((param) => url.searchParams.delete(param));
  url.hash = '';
  return url.href;
}

export function getShareData() {
  return {
    url: getShareUrl(),
    title: getMetadata('og:title') || document.title,
    description: getMetadata('og:description') || getMetadata('description') || '',
    image: getMetadata('og:image') || '',
    imageAlt: getMetadata('og:image:alt') || '',
  };
}

function getPlatforms() {
  const authored = getMetadata('blog-share-platforms');
  if (!authored) return DEFAULT_PLATFORMS;
  const requested = authored.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
  const platforms = requested.filter((p) => DEFAULT_PLATFORMS.includes(p));
  return platforms.length ? platforms : DEFAULT_PLATFORMS;
}

function buildShareCard(data) {
  const card = createTag('div', { class: 'blog-share-card' });
  if (data.image) {
    card.append(createTag('img', {
      class: 'blog-share-card-image',
      src: data.image,
      alt: data.imageAlt,
      loading: 'lazy',
    }));
  }
  const text = createTag('div', { class: 'blog-share-card-text' });
  const title = createTag('strong', null, data.title);
  text.append(createTag('p', { class: 'blog-share-card-title' }, title));
  if (data.description) {
    text.append(createTag('p', { class: 'blog-share-card-desc' }, data.description));
  }
  card.append(text);
  return card;
}

function openPopup(href) {
  window.open(href, '_blank', 'popup,noopener,noreferrer,width=600,height=500');
}

function buildActionLink(platform, svg, label, data) {
  const url = encodeURIComponent(data.url);
  const title = encodeURIComponent(data.title);
  if (platform === 'email') {
    return createTag('a', {
      class: 'blog-share-action',
      'aria-label': label,
      href: `mailto:?subject=${title}&body=${url}`,
    }, svg);
  }
  const hrefs = {
    x: `https://x.com/share?&url=${url}&text=${title}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  };
  const link = createTag('a', {
    class: 'blog-share-action',
    'aria-label': label,
    href: hrefs[platform],
    rel: 'noopener noreferrer',
  }, svg);
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openPopup(link.href);
  });
  return link;
}

function buildCopyButton(svg, labels, data) {
  const button = createTag('button', {
    type: 'button',
    class: 'blog-share-action blog-share-copy',
    'aria-label': labels.copy,
  }, svg);
  const feedback = createTag('div', { role: 'status', 'aria-live': 'polite', class: 'blog-share-feedback' });
  let timeout;
  button.addEventListener('click', async () => {
    clearTimeout(timeout);
    try {
      await navigator.clipboard.writeText(data.url);
      button.classList.remove('blog-share-copy-error');
      button.classList.add('blog-share-copied');
      feedback.textContent = labels.copied;
    } catch (e) {
      button.classList.remove('blog-share-copied');
      button.classList.add('blog-share-copy-error');
      feedback.textContent = labels.copyError;
    }
    timeout = setTimeout(() => {
      button.classList.remove('blog-share-copied');
      feedback.textContent = '';
    }, 3000);
  });
  return createTag('li', null, [button, feedback]);
}

async function buildShareActions(platforms, data, base, labels) {
  const iconNames = platforms.map((p) => (p === 'copy' ? 'link' : p));
  const svgs = await getSVGsfromFile(`${base}/${ICON_PATH}`, iconNames);
  const list = createTag('ul', { class: 'blog-share-actions' });
  platforms.forEach((platform, index) => {
    const svg = svgs?.[index]?.svg;
    if (!svg) return;
    if (platform === 'copy') {
      if (!navigator.clipboard) return;
      list.append(buildCopyButton(svg, labels, data));
      return;
    }
    const link = buildActionLink(platform, svg, labels[platform], data);
    list.append(createTag('li', null, link));
  });
  return list;
}

async function getShareLabels(config) {
  const entries = await Promise.all(
    Object.entries(SHARE_LABEL_KEYS).map(
      async ([name, key]) => [name, await replaceKey(key, config)],
    ),
  );
  return Object.fromEntries(entries);
}

export async function openShareModal(trigger) {
  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;
  const labels = await getShareLabels(config);
  const data = getShareData();

  const content = createTag('div', { class: 'blog-share' });
  content.append(createTag('h2', { class: 'blog-share-heading' }, labels.heading));
  content.append(buildShareCard(data));
  content.append(await buildShareActions(getPlatforms(), data, base, labels));

  const dialog = await getModal(null, {
    id: SHARE_MODAL_ID,
    class: 'blog-share-modal',
    title: labels.heading,
    content,
  });
  if (!dialog) return null;
  dialog.querySelector('.dialog-close')?.setAttribute('aria-label', labels.close);
  if (trigger) {
    window.addEventListener('milo:modal:closed', () => trigger.focus(), { once: true });
  }
  return dialog;
}

async function buildShareButton(config, base) {
  const label = await replaceKey('blog-share', config);
  const button = createTag('button', {
    type: 'button',
    class: 'blog-header-share',
    'aria-haspopup': 'dialog',
  }, label);
  const svgs = await getSVGsfromFile(`${base}/${ICON_PATH}`, ['share']);
  const svg = svgs?.[0]?.svg;
  if (svg) button.append(svg);
  button.addEventListener('click', () => openShareModal(button));
  return button;
}

export default async function init(el) {
  const main = el.closest('main');
  const readingTime = main ? getReadingTime(main) : 0;
  window.sessionStorage.setItem('blog-reading-time', readingTime);

  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;

  const rows = [...el.children];
  rows[0]?.classList.add('blog-header-title');
  rows[1]?.classList.add('blog-header-summary');

  const summaryRow = rows[1].querySelector('div');

  if (summaryRow) {
    const pSummary = createTag('p', {}, summaryRow.textContent);
    summaryRow.replaceWith(pSummary);
  }

  const authorRows = rows.slice(2);
  const authorLinkEnabled = getMetadata('article-author-link') !== 'off';
  const authors = createTag('div', { class: 'blog-header-authors' });
  authorRows.forEach((row) => authors.append(decorateAuthor(row, authorLinkEnabled, base)));

  const [eyebrow, shareButton] = await Promise.all([
    buildEyebrow(config, readingTime),
    buildShareButton(config, base),
  ]);

  const byline = createTag('div', { class: 'blog-header-byline' }, [authors, shareButton]);

  el.prepend(eyebrow);
  authorRows.forEach((row) => row.remove());
  el.append(byline);

  return readingTime;
}
