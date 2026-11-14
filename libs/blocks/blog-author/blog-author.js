import loadIcons from '../../features/icons/icons.js';

const SOCIAL_PLATFORMS = {
  'linkedin.com': { name: 'LinkedIn', icon: 'linkedin' },
  'twitter.com': { name: 'X', icon: 'twitter' },
  'x.com': { name: 'X', icon: 'twitter' },
  'facebook.com': { name: 'Facebook', icon: 'facebook' },
  'instagram.com': { name: 'Instagram', icon: 'instagram' },
};

function logSchemaError(message) {
  window.lana?.log(`Blog schema: ${message}`, { tags: 'blog-schema', severity: 'warning' });
}

function httpUrl(value, base) {
  try {
    const url = new URL(value, base);
    if (url.protocol === 'https:' || url.protocol === 'http:') return url;
  } catch (error) {
    logSchemaError(`invalid URL: ${value}`);
    return null;
  }
  logSchemaError(`unsupported URL protocol: ${value}`);
  return null;
}

function resolveSocialPlatform(value) {
  const url = httpUrl(value);
  if (!url) return undefined;
  const domain = Object.keys(SOCIAL_PLATFORMS).find((host) => (
    url.hostname === host || url.hostname.endsWith(`.${host}`)
  ));
  return SOCIAL_PLATFORMS[domain];
}

function getSchemaUrl(value, doc = document, base = window.location.href) {
  const canonical = doc.head.querySelector('link[rel="canonical"]')?.getAttribute('href')
    || doc.head.querySelector('meta[property="og:url"]')?.content;
  const canonicalUrl = httpUrl(canonical || base, base);
  if (!canonicalUrl) return null;
  const url = httpUrl(value || canonicalUrl.href, base);
  if (!url) return null;
  // Relative author links on previews must identify the production author.
  if (url.origin === new URL(base).origin) {
    url.protocol = canonicalUrl.protocol;
    url.host = canonicalUrl.host;
    url.port = canonicalUrl.port;
  }
  url.search = '';
  url.hash = '';
  return url.href;
}

function getPersonSchema(author, pageUrl) {
  if (!pageUrl) return null;
  const decorated = author.querySelector('.blog-author-name');
  const rows = [...author.querySelectorAll(':scope > div > div')].filter((row) => (
    !row.querySelector('picture, img')
    && !/^#[0-9a-fA-F]{3,6}(?:\s*,\s*#[0-9a-fA-F]{3,6})?$/.test(row.textContent.trim())
  ));
  const socialIndex = rows.findIndex((row) => [...row.querySelectorAll('a')]
    .some((link) => resolveSocialPlatform(link.href)));
  const textRows = socialIndex < 0 ? rows : rows.slice(0, socialIndex);
  const name = (decorated || textRows[0])?.textContent.trim();
  if (!name) {
    logSchemaError(`author profile has no name: ${pageUrl}`);
    return null;
  }
  if (/\s(?:and|&)\s/i.test(name) || /-and-/i.test(new URL(pageUrl).pathname)) {
    logSchemaError(`combined author profile requires individual author pages: ${pageUrl}`);
    return null;
  }
  const schema = {
    '@type': 'Person',
    name,
    url: pageUrl,
    '@id': `${pageUrl}#person`,
    worksFor: { '@type': 'Organization', name: 'Adobe' },
  };
  const title = (decorated ? author.querySelector('.blog-author-title') : textRows[1])
    ?.textContent.trim();
  if (title) schema.jobTitle = title;
  const description = (decorated ? [...author.querySelectorAll('.blog-author-description')]
    : textRows.slice(2)).map((row) => row.textContent.trim()).filter(Boolean).join(' ');
  if (description) schema.description = description;
  const image = author.querySelector('picture img, img')?.getAttribute('src');
  const imageUrl = image && httpUrl(image, pageUrl);
  if (imageUrl) schema.image = imageUrl.href;
  const socialLinks = decorated
    ? author.querySelectorAll('.blog-author-social a:not([hidden])')
    : rows.slice(Math.max(socialIndex, 0)).flatMap((row) => [...row.querySelectorAll('a')]);
  const sameAs = [...new Set([...socialLinks].filter((link) => resolveSocialPlatform(link.href))
    .map((link) => link.href))];
  if (sameAs.length) schema.sameAs = sameAs;
  return schema;
}

function injectBlogSchema(type, schema) {
  let script = document.head.querySelector(`script[data-blog-schema="${type}"]`);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.blogSchema = type;
    document.head.append(script);
  }
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', ...schema });
}

function decorateSocial(row) {
  const links = [...row.querySelectorAll('a')];
  row.replaceChildren(...links);
  row.className = 'blog-author-social';
  links.forEach((a) => {
    const platform = resolveSocialPlatform(a.href);
    if (!platform) { a.hidden = true; return; }
    const { name, icon } = platform;
    a.setAttribute('aria-label', name);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    const span = document.createElement('span');
    span.className = `icon icon-${icon}`;
    a.replaceChildren(span);
  });
  loadIcons(row.querySelectorAll('span.icon'));
}

export default async function init(el) {
  let socialContainer = null;
  let textIdx = 0;
  const HEX = '#[0-9a-fA-F]{3,6}';
  const TEXT_CLASSES = ['blog-author-name', 'blog-author-title', 'blog-author-description'];

  function decorateRow(row) {
    const text = row.textContent.trim();

    const gradient = text.match(new RegExp(`^(${HEX})\\s*,\\s*(${HEX})$`));
    if (gradient) {
      el.style.background = `linear-gradient(to bottom, ${gradient[1]}, ${gradient[2]})`;
      row.parentElement.remove();
      return;
    }

    if (new RegExp(`^${HEX}$`).test(text)) {
      el.style.backgroundColor = text;
      row.parentElement.remove();
      return;
    }

    if (row.querySelector('picture')) {
      row.className = 'blog-author-image';
      return;
    }

    if ([...row.querySelectorAll('a')].some((a) => resolveSocialPlatform(a.href))) {
      if (!socialContainer) {
        socialContainer = row;
      } else {
        [...row.querySelectorAll('a')].forEach((a) => socialContainer.append(a));
        row.parentElement.remove();
      }
      return;
    }

    if (socialContainer) {
      row.parentElement.remove();
      return;
    }

    row.className = TEXT_CLASSES[Math.min(textIdx, 2)];
    textIdx += 1;
  }

  el.querySelectorAll(':scope > div > div').forEach(decorateRow);

  if (socialContainer) decorateSocial(socialContainer);

  const content = document.createElement('div');
  content.className = 'blog-author-content';
  el.querySelectorAll('.blog-author-name, .blog-author-title, .blog-author-description, .blog-author-social')
    .forEach((t) => content.append(t));
  el.querySelectorAll(':scope > div:not(:has(*))').forEach((d) => d.remove());
  el.append(content);

  const schema = getPersonSchema(el, getSchemaUrl());
  if (schema) injectBlogSchema('person', schema);
}
