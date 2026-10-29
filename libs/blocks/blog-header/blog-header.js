import { createTag, getConfig, getMetadata, loadBlock, MILO_EVENTS } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';
import { getSVGsfromFile } from '../share/share.js';
import { getModal } from '../modal/modal.js';

const SHARE_MODAL_ID = 'blog-share-modal';
const PREVIEW_PARAMS = ['milolibs', 'martech', 'mep', 'georouting'];
const ICON_PATH = 'blocks/blog-header/blog-header.svg';

const SHARE_PLATFORMS = {
  x: {
    icon: 'x',
    href: (url, title) => `https://x.com/share?&url=${url}&text=${title}`,
    popup: true,
  },
  email: {
    icon: 'email',
    href: (url, title) => `mailto:?subject=${title}&body=${url}`,
  },
  linkedin: {
    icon: 'linkedin',
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    popup: true,
  },
  copy: { icon: 'link' },
};
const DEFAULT_PLATFORMS = Object.keys(SHARE_PLATFORMS);

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

function logError(message) {
  window.lana?.log(`Blog header: ${message}`, { tags: 'blog-header', errorType: 'e' });
}

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

/* Author profile resolution */

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
  picture.querySelectorAll('source[srcset]').forEach((source) => {
    source.setAttribute('srcset', resolveSrcset(source.getAttribute('srcset'), base));
  });
  const img = picture.tagName === 'IMG' ? picture : picture.querySelector('img');
  if (img?.getAttribute('src')) img.setAttribute('src', resolveUrl(img.getAttribute('src'), base));
  if (img?.getAttribute('srcset')) img.setAttribute('srcset', resolveSrcset(img.getAttribute('srcset'), base));
}

function getProfileData(doc) {
  const author = doc.querySelector('.blog-author');
  if (!author) return null;
  const rows = [...author.querySelectorAll(':scope > div > div')].filter((row) => (
    !row.querySelector('picture, img')
    && !/^#[0-9a-fA-F]{3,6}(?:\s*,\s*#[0-9a-fA-F]{3,6})?$/.test(row.textContent.trim())
  ));
  const socialIndex = rows.findIndex((row) => [...row.querySelectorAll('a')].some((link) => (
    /(?:linkedin|twitter|x|facebook|instagram)\.com/.test(link.getAttribute('href'))
  )));
  const [nameRow, titleRow] = socialIndex < 0 ? rows : rows.slice(0, socialIndex);
  const companyRow = socialIndex < 0
    ? rows[5] || rows[4]
    : rows.slice(socialIndex + 1).at(-1);
  return {
    picture: author.querySelector('picture') || author.querySelector('img'),
    name: nameRow?.textContent.trim() || '',
    title: titleRow?.textContent.trim() || '',
    company: companyRow?.textContent.trim() || '',
  };
}

function fetchAuthorProfile(profileUrl) {
  if (!profileCache.has(profileUrl)) {
    profileCache.set(profileUrl, (async () => {
      try {
        const resp = await fetch(`${profileUrl}.plain.html`);
        if (!resp.ok) {
          logError(`author profile responded ${resp.status} for ${profileUrl}`);
          return null;
        }
        const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
        return getProfileData(doc);
      } catch (e) {
        logError(`author profile request failed for ${profileUrl}: ${e.message}`);
        return null;
      }
    })());
  }
  return profileCache.get(profileUrl);
}

function defaultAvatar(base) {
  return createTag('img', {
    class: 'blog-header-avatar',
    src: `${base}/blocks/article-header/adobe-logo.svg`,
    alt: '',
    loading: 'lazy',
  });
}

function setAuthorMeta(info, details) {
  const text = details.filter(Boolean).join(' | ');
  if (!text) return;
  let meta = info.querySelector('.blog-header-author-meta');
  if (!meta) {
    meta = createTag('span', { class: 'blog-header-author-meta' });
    info.append(meta);
  }
  meta.textContent = text;
}

/* An interactive link is only rendered once a usable accessible name exists. */
function createNameEl(name, href) {
  const el = (href && name)
    ? createTag('a', { class: 'blog-header-author-name', href })
    : createTag('span', { class: 'blog-header-author-name' });
  el.textContent = name ?? '';
  return el;
}

function getAuthorHref(href) {
  if (!href) return null;
  try {
    const { protocol } = new URL(href, window.location.href);
    if (protocol === 'https:' || protocol === 'http:') return href;
  } catch (e) {
    logError(`invalid author profile URL: ${e.message}`);
    return null;
  }
  logError('unsupported author profile URL protocol');
  return null;
}

function hideIcon(svg) {
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  return svg;
}

async function loadAuthorProfile(profileUrl, data, avatar, info) {
  const profile = await fetchAuthorProfile(profileUrl);
  if (!profile) return;
  if (!data.picture && profile.picture) {
    const clone = profile.picture.cloneNode(true);
    resolveMediaUrls(clone, profileUrl);
    const img = clone.tagName === 'IMG' ? clone : clone.querySelector('img');
    if (img?.getAttribute('src') === 'about:error') {
      logError(`author profile image is invalid for ${profileUrl}`);
    } else {
      img?.classList.add('blog-header-avatar');
      avatar.replaceChildren(clone);
    }
  }
  if (data.needsName && profile.name) {
    info.querySelector('.blog-header-author-name').replaceWith(createNameEl(profile.name, data.href));
  }
  setAuthorMeta(info, [
    data.details[0] || profile.title,
    data.details[1] || profile.company,
    ...data.details.slice(2),
  ]);
}

function getAuthorData(row) {
  const inner = row.querySelector(':scope > div') || row;
  const paragraphs = [...inner.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture'));
  const directLink = inner.querySelector(':scope > a');
  const nameIndex = directLink ? -1 : paragraphs.findIndex((p) => (
    p.querySelector('a') || p.textContent.trim()
  ));
  const nameP = paragraphs[nameIndex];
  const link = directLink || nameP?.querySelector('a');
  const name = (link || nameP)?.textContent.trim() || '';
  const href = getAuthorHref(link?.getAttribute('href'));
  const details = directLink ? paragraphs : paragraphs.slice(nameIndex + 1);
  const needsName = !!href
    && (!name || name === href || name === resolveUrl(href, window.location.href));

  return {
    picture: inner.querySelector('picture'),
    name,
    href,
    needsName,
    details: details.map((p) => p.textContent.trim()),
  };
}

function decorateAuthor(row, authorLinkEnabled, base) {
  const data = getAuthorData(row);
  const { picture, name, href, details, needsName } = data;
  const author = createTag('div', { class: 'blog-header-author' });
  const avatar = createTag('div', { class: 'blog-header-author-avatar' });
  const info = createTag('div', { class: 'blog-header-author-info' });

  info.append(createNameEl(name, authorLinkEnabled ? href : null));

  setAuthorMeta(info, details);

  if (picture) {
    avatar.append(picture);
  } else {
    avatar.append(defaultAvatar(base));
  }
  if (authorLinkEnabled && href && (!picture || !details[0] || !details[1] || needsName)) {
    loadAuthorProfile(resolveUrl(href, window.location.href), data, avatar, info);
  }

  author.append(avatar, info);
  return author;
}

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
  let image = '';
  const authoredImage = getMetadata('og:image');
  if (authoredImage) {
    try {
      const imageUrl = new URL(authoredImage, window.location.href);
      image = `${window.location.origin}${imageUrl.pathname}${imageUrl.search}${imageUrl.hash}`;
    } catch (e) {
      logError(`Invalid share image URL: ${authoredImage}`);
    }
  }
  return {
    url: getShareUrl(),
    title: getMetadata('og:title') || document.title,
    description: getMetadata('og:description') || getMetadata('description') || '',
    image,
    imageAlt: getMetadata('og:image:alt') || '',
  };
}

function getPlatforms() {
  const authored = getMetadata('blog-share-platforms');
  if (!authored) return DEFAULT_PLATFORMS;
  const requested = authored.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean);
  const platforms = [...new Set(requested.filter((p) => DEFAULT_PLATFORMS.includes(p)))];
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
  const title = createTag('strong');
  title.textContent = data.title;
  text.append(createTag('p', { class: 'blog-share-card-title' }, title));
  if (data.description) {
    const description = createTag('p', { class: 'blog-share-card-desc' });
    description.textContent = data.description;
    text.append(description);
  }
  card.append(text);
  return card;
}

function buildActionLink(platform, svg, label, data) {
  const { href, popup } = SHARE_PLATFORMS[platform];
  const link = createTag('a', {
    class: 'blog-share-action',
    'aria-label': label,
    href: href(encodeURIComponent(data.url), encodeURIComponent(data.title)),
    ...(popup ? { rel: 'noopener noreferrer' } : {}),
  }, svg);
  if (popup) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(link.href, '_blank', 'popup,noopener,noreferrer,width=600,height=500');
    });
  }
  return link;
}

function buildCopyButton(svg, labels, data) {
  const button = createTag('button', {
    type: 'button',
    class: 'blog-share-action blog-share-copy',
    'aria-label': labels.copy,
  }, svg);
  // The badge is decorative; the persistent sr-only region owns the announcement.
  const feedback = createTag('span', { class: 'blog-share-feedback', 'aria-hidden': 'true' });
  const status = createTag('span', {
    class: 'blog-share-status sr-only',
    role: 'status',
    'aria-live': 'polite',
  });
  let timeout;
  const clearFeedback = () => {
    clearTimeout(timeout);
    button.classList.remove('blog-share-copied');
    feedback.textContent = '';
  };
  button.addEventListener('click', async () => {
    clearFeedback();
    status.textContent = '';
    let message;
    try {
      await navigator.clipboard.writeText(data.url);
      button.classList.add('blog-share-copied');
      message = labels.copied;
    } catch (e) {
      message = labels.copyError;
    }
    feedback.textContent = message;
    status.textContent = message;
    timeout = setTimeout(clearFeedback, 3000);
  });
  return createTag('li', null, [button, feedback, status]);
}

async function buildShareActions(platforms, data, base, labels) {
  const available = platforms.filter((p) => p !== 'copy' || navigator.clipboard);
  const list = createTag('ul', { class: 'blog-share-actions' });
  if (!available.length) return list;
  const iconNames = available.map((p) => SHARE_PLATFORMS[p].icon);
  const svgs = await getSVGsfromFile(`${base}/${ICON_PATH}`, iconNames);
  available.forEach((platform, index) => {
    const svg = svgs?.[index]?.svg;
    if (!svg) return;
    hideIcon(svg);
    if (platform === 'copy') {
      list.append(buildCopyButton(svg, labels, data));
      return;
    }
    const link = buildActionLink(platform, svg, labels[platform], data);
    list.append(createTag('li', null, link));
  });
  return list;
}

async function getShareLabels(config) {
  const labels = {};
  await Promise.all(
    Object.entries(SHARE_LABEL_KEYS).map(async ([name, key]) => {
      labels[name] = await replaceKey(key, config);
    }),
  );
  return labels;
}

async function createShareModal(trigger) {
  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;
  const labels = await getShareLabels(config);
  const data = getShareData();

  const content = createTag('div', { class: 'blog-share' });
  content.append(createTag('h2', { class: 'blog-share-heading' }, labels.heading));
  content.append(buildShareCard(data));
  content.append(await buildShareActions(getPlatforms(), data, base, labels));

  if (trigger) {
    trigger.dataset.modalHash = `#${SHARE_MODAL_ID}`;
    trigger.dataset.isModalTrigger = 'true';
  }
  const dialog = await getModal(null, {
    id: SHARE_MODAL_ID,
    class: 'blog-share-modal',
    title: labels.heading,
    content,
  });
  if (!dialog) return null;
  dialog.querySelector('.dialog-close')?.setAttribute('aria-label', labels.close);
  return dialog;
}

let shareModalRequest;

export async function openShareModal(trigger) {
  const existing = document.getElementById(SHARE_MODAL_ID);
  if (existing) return existing;
  if (!shareModalRequest) {
    shareModalRequest = createShareModal(trigger).finally(() => {
      shareModalRequest = null;
    });
  }
  return shareModalRequest;
}

async function buildShareButton(config, base) {
  const label = await replaceKey('blog-share', config);
  const button = createTag('button', {
    type: 'button',
    class: 'blog-header-share',
    'aria-haspopup': 'dialog',
    'data-modal-hash': `#${SHARE_MODAL_ID}`,
  }, label);
  const svgs = await getSVGsfromFile(`${base}/${ICON_PATH}`, ['share']);
  const svg = svgs?.[0]?.svg;
  if (svg) button.append(hideIcon(svg));
  button.addEventListener('click', () => {
    openShareModal(button).catch((e) => logError(`share dialog failed to open: ${e.message}`));
  });
  return button;
}

function decorateSummary(row) {
  const cell = row?.querySelector(':scope > div');
  if (!cell) return;
  if (cell.querySelector(':scope > p')) {
    cell.replaceWith(...cell.childNodes);
  } else {
    cell.replaceWith(createTag('p', null, [...cell.childNodes]));
  }
}

async function buildByline(authorRows, config, base) {
  const authorLinkEnabled = getMetadata('article-author-link') !== 'off';
  const authors = createTag('div', { class: 'blog-header-authors' });
  authorRows.forEach((row) => authors.append(decorateAuthor(row, authorLinkEnabled, base)));
  const shareButton = await buildShareButton(config, base);
  return createTag('div', { class: 'blog-header-byline' }, [authors, shareButton]);
}

const dividerObservers = new WeakMap();

export function getBlogSections(headerSection) {
  const sections = [];
  let section = headerSection?.nextElementSibling;
  while (section) {
    // Header initialization can precede section-metadata decoration.
    const styleRow = [...(section.querySelector(':scope > .section-metadata')?.children || [])]
      .find((row) => row.firstElementChild?.textContent.trim().toLowerCase() === 'style');
    const styles = styleRow?.lastElementChild?.textContent.toLowerCase()
      .split(',').map((style) => style.trim().replace(/\s+/g, '-'));
    if (section.matches('footer, [data-footer-promo], .footer-promo, .blog-layout-end')
      || styles?.includes('blog-layout-end')) break;
    if (section.matches('.section:not([hidden])') && [...section.children].some((child) => (
      !child.matches('.metadata, .section-metadata, .card-metadata')
    ))) sections.push(section);
    section = section.nextElementSibling;
  }
  return sections;
}

function decorateDividers(el) {
  if (el.classList.contains('no-dividers')) return;
  const headerSection = el.closest('.section');
  if (!headerSection) return;

  headerSection.classList.add('blog-divider-frame');
  const sections = [headerSection, ...getBlogSections(headerSection)];

  const findEndpoint = () => {
    const layout = headerSection.nextElementSibling;
    if (layout?.classList.contains('blog-article-layout')) return layout;
    return getBlogSections(headerSection).at(-1) || headerSection;
  };

  let endpoint;
  const updateFrame = (entries, observer) => {
    if (!headerSection.isConnected) {
      observer.disconnect();
      dividerObservers.delete(headerSection);
      return;
    }
    const nextEndpoint = findEndpoint();
    if (nextEndpoint !== endpoint) {
      if (endpoint && !sections.includes(endpoint)) observer.unobserve(endpoint);
      endpoint = nextEndpoint;
      observer.observe(endpoint);
    }
    const height = endpoint.getBoundingClientRect().bottom
      - headerSection.getBoundingClientRect().top;
    headerSection.style.setProperty('--blog-divider-height', `${height}px`);
  };

  dividerObservers.get(headerSection)?.disconnect();
  const observer = new ResizeObserver(updateFrame);
  dividerObservers.set(headerSection, observer);
  [...sections, headerSection.parentElement]
    .forEach((target) => observer.observe(target));
  updateFrame([], observer);
}

const BAR_HEIGHT = 8;

function findArticleCopy(headerSection) {
  const layout = headerSection.nextElementSibling;
  const sections = layout?.classList.contains('blog-article-layout')
    ? [...layout.querySelectorAll(':scope > .blog-article-content > .section:not([hidden])')]
    : getBlogSections(headerSection);
  const contents = [];
  for (const section of sections) {
    if (section.querySelector('.card-metadata')) {
      let copy = section.firstElementChild;
      while (copy?.matches('.content, .ai-summary')) {
        contents.push(copy);
        copy = copy.nextElementSibling;
      }
      break;
    }
    contents.push(...section.querySelectorAll(':scope > .content, :scope > .ai-summary'));
  }
  return { first: contents[0], last: contents.at(-1) };
}

function decorateProgressBar(el, main) {
  const headerSection = el.closest('.section');
  if (el.classList.contains('no-progress-bar') || !main || !headerSection) return;

  const bar = createTag('div', { class: 'blog-progress-bar', 'aria-hidden': 'true' });
  el.append(bar);
  const stacked = window.matchMedia('(max-width: 599px)');
  let frame = 0;
  let discover = true;
  let articleCopy;
  let article;
  let lastTop;
  let lastProgress;

  const update = () => {
    frame = 0;
    if (!el.isConnected) {
      cleanup(); // eslint-disable-line no-use-before-define
      return;
    }
    if (discover) {
      articleCopy = findArticleCopy(headerSection);
      article = main.querySelector('.blog-article-layout > .blog-article-content');
      discover = false;
    }
    const first = articleCopy.first?.getBoundingClientRect();
    const last = articleCopy.last?.getBoundingClientRect();
    if (!first) {
      if (!bar.hidden) bar.hidden = true;
      return;
    }

    // The mobile nav is sticky and display: contents; the divider follows the article's gap.
    const dividerY = stacked.matches && article
      ? article.getBoundingClientRect().top
        - parseFloat(getComputedStyle(article).marginBlockStart) / 2
      : headerSection.getBoundingClientRect().bottom - 1;
    const globalNav = document.querySelector('.global-navigation')?.getBoundingClientRect().bottom || 0;
    const dividerTop = dividerY - BAR_HEIGHT / 2;
    const top = Math.max(globalNav, dividerTop);
    // Start filling when the first article copy reaches the bar below the global nav.
    const start = window.scrollY + first.top - globalNav;

    const distance = last.bottom + window.scrollY - window.innerHeight - start;
    const hidden = distance <= 0;
    if (bar.hidden !== hidden) bar.hidden = hidden;
    if (hidden) return;
    const progress = Math.min(1, Math.max(0, (window.scrollY - start) / distance));
    if (top !== lastTop) {
      bar.style.top = `${top}px`;
      lastTop = top;
    }
    if (progress !== lastProgress) {
      bar.style.transform = `scaleX(${progress})`;
      lastProgress = progress;
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const invalidate = (records) => {
    if (records.every((record) => record.target === bar)) return;
    discover = true;
    schedule();
  };
  const mutations = new MutationObserver(invalidate);
  const observer = new ResizeObserver(schedule);
  const cleanup = () => {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    observer.disconnect();
    mutations.disconnect();
    cancelAnimationFrame(frame);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  observer.observe(main);
  mutations.observe(main, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'hidden'],
  });
  update();
}

export default async function init(el) {
  const main = el.closest('main');
  const readingTime = main ? getReadingTime(main) : 0;
  window.sessionStorage.setItem('blog-reading-time', readingTime);

  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;

  const [titleRow, summaryRow, ...authorRows] = el.children;
  titleRow?.classList.add('blog-header-title');
  summaryRow?.classList.add('blog-header-summary');
  decorateSummary(summaryRow);

  const [eyebrow, byline] = await Promise.all([
    buildEyebrow(config, readingTime),
    buildByline(authorRows, config, base),
  ]);

  el.prepend(eyebrow);
  authorRows.forEach((row) => row.remove());
  el.append(byline);
  decorateDividers(el);
  decorateProgressBar(el, main);

  document.addEventListener(MILO_EVENTS.DEFERRED, () => {
    if (!el.isConnected || main?.querySelector('.blog-side-navigation')) return;
    const navigation = createTag('div', { class: 'blog-side-navigation' });
    el.after(navigation);
    loadBlock(navigation).catch((error) => logError(`side navigation failed: ${error.message}`));
  }, { once: true });

  return readingTime;
}
