const MILO_TEMPLATES = [
  '404',
  'featured-story',
];
const MILO_BLOCKS = [
  'accordion',
  'adobetv',
  'article-feed',
  'aside',
  'author-header',
  'caas',
  'caas-config',
  'card-metadata',
  'carousel',
  'chart',
  'columns',
  'faas',
  'faq',
  'featured-article',
  'figure',
  'fragment',
  'featured-article',
  'footer',
  'gnav',
  'how-to',
  'icon-block',
  'instagram',
  'marketo',
  'card',
  'marquee',
  'media',
  'merch',
  'modal',
  'modal-metadata',
  'pdf-viewer',
  'quote',
  'read-more',
  'recommended-articles',
  'review',
  'section-metadata',
  'slideshare',
  'tabs',
  'table-of-contents',
  'text',
  'walls-io',
  'tiktok',
  'twitter',
  'vimeo',
  'youtube',
  'z-pattern',
  'share',
];
const AUTO_BLOCKS = [
  { adobetv: 'https://video.tv.adobe.com' },
  { gist: 'https://gist.github.com' },
  { caas: '/tools/caas' },
  { faas: '/tools/faas' },
  { fragment: '/fragments/' },
  { instagram: 'https://www.instagram.com' },
  { slideshare: 'https://www.slideshare.net' },
  { tiktok: 'https://www.tiktok.com' },
  { twitter: 'https://twitter.com' },
  { vimeo: 'https://vimeo.com' },
  { vimeo: 'https://player.vimeo.com' },
  { youtube: 'https://www.youtube.com' },
  { youtube: 'https://youtu.be' },
  { 'pdf-viewer': '.pdf' },
];
const ENVS = {
  local: {
    name: 'local',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
    pdfViewerClientId: '600a4521c23d4c7eb9c7b039bee534a0',
  },
  stage: {
    name: 'stage',
    ims: 'stg1',
    adobeIO: 'cc-collab-stage.adobe.io',
    adminconsole: 'stage.adminconsole.adobe.com',
    account: 'stage.account.adobe.com',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
    pdfViewerClientId: '600a4521c23d4c7eb9c7b039bee534a0',
  },
  prod: {
    name: 'prod',
    ims: 'prod',
    adobeIO: 'cc-collab.adobe.io',
    adminconsole: 'adminconsole.adobe.com',
    account: 'account.adobe.com',
    edgeConfigId: '2cba807b-7430-41ae-9aac-db2b0da742d5',
    pdfViewerClientId: '3c0a5ddf2cc04d3198d9e48efc390fa9',
  },
};
const SUPPORTED_RICH_RESULTS_TYPES = ['NewsArticle'];
const LANGSTORE = 'langstore';

function getEnv(conf) {
  const { host, href } = window.location;
  const location = new URL(href);
  const query = location.searchParams.get('env');

  if (query) return { ...ENVS[query], consumer: conf[query] };
  if (host.includes('localhost:')) return { ...ENVS.local, consumer: conf.local };
  /* c8 ignore start */
  if (host.includes('hlx.page')
    || host.includes('hlx.live')
    || host.includes('stage.adobe')
    || host.includes('corp.adobe')) {
    return { ...ENVS.stage, consumer: conf.stage };
  }
  return { ...ENVS.prod, consumer: conf.prod };
  /* c8 ignore stop */
}

export function getLocale(locales, pathname = window.location.pathname) {
  if (!locales) {
    return { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' };
  }
  const split = pathname.split('/');
  const localeString = split[1];
  const locale = locales[localeString] || locales[''];
  if (localeString === LANGSTORE) {
    locale.prefix = `/${localeString}/${split[2]}`;
    return locale;
  }
  locale.prefix = locale.ietf === 'en-US' ? '' : `/${localeString}`;
  return locale;
}

export const [setConfig, getConfig] = (() => {
  let config = {};
  return [
    (conf) => {
      const origin = conf.origin || window.location.origin;
      const pathname = conf.pathname || window.location.pathname;
      config = { env: getEnv(conf), ...conf };
      config.codeRoot = conf.codeRoot ? `${origin}${conf.codeRoot}` : origin;
      config.locale = pathname ? getLocale(conf.locales, pathname) : getLocale(conf.locales);
      document.documentElement.setAttribute('lang', config.locale.ietf);
      try {
        document.documentElement.setAttribute('dir', (new Intl.Locale(config.locale.ietf)).textInfo.direction);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Invalid or missing locale:', e);
      }
      config.locale.contentRoot = `${origin}${config.locale.prefix}${config.contentRoot ?? ''}`;
      return config;
    },
    () => config,
  ];
})();

export function isInTextNode(node) {
  return node.parentElement.firstChild.nodeType === Node.TEXT_NODE;
}

export function getMetadata(name, doc = document) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = doc.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement
      || html instanceof SVGElement
      || html instanceof DocumentFragment) {
      el.append(html);
    } else if (Array.isArray(html)) {
      el.append(...html);
    } else {
      el.insertAdjacentHTML('beforeend', html);
    }
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, val]) => {
      el.setAttribute(key, val);
    });
  }
  return el;
}

function getExtension(path) {
  const pageName = path.split('/').pop();
  return pageName.includes('.') ? pageName.split('.').pop() : '';
}

export function localizeLink(href, originHostName = window.location.hostname) {
  try {
    const url = new URL(href);
    const relative = url.hostname === originHostName;
    const processedHref = relative ? href.replace(url.origin, '') : href;
    const { hash } = url;
    if (hash === '#_dnt') return processedHref.split('#')[0];
    const path = url.pathname;
    const extension = getExtension(path);
    const allowedExts = ['', 'html', 'json'];
    if (!allowedExts.includes(extension)) return processedHref;
    const { locale, locales, prodDomains } = getConfig();
    if (!locale || !locales) return processedHref;
    const isLocalizable = relative || (prodDomains && prodDomains.includes(url.hostname));
    if (!isLocalizable) return processedHref;
    const isLocalizedLink = path.startsWith(`/${LANGSTORE}`) || Object.keys(locales)
      .some((loc) => loc !== '' && (path.startsWith(`/${loc}/`) || path.endsWith(`/${loc}`)));
    if (isLocalizedLink) return processedHref;
    const urlPath = `${locale.prefix}${path}${url.search}${hash}`;
    return relative ? urlPath : `${url.origin}${urlPath}`;
  } catch (error) {
    return href;
  }
}

export function loadStyle(href, callback) {
  let link = document.head.querySelector(`link[href="${href}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    if (callback) {
      link.onload = (e) => callback(e.type);
      link.onerror = (e) => callback(e.type);
    }
    document.head.appendChild(link);
  } else if (callback) {
    callback('noop');
  }
  return link;
}

export function appendHtmlPostfix(area = document) {
  const pageUrl = new URL(window.location.href);
  if (!pageUrl.pathname.endsWith('.html')) return;

  const relativeAutoBlocks = AUTO_BLOCKS
    .map((b) => Object.values(b)[0])
    .filter((b) => b.startsWith('/'));

  const { htmlExclude = [] } = getConfig();

  const HAS_EXTENSION = /\..*$/;
  const shouldNotConvert = (href) => {
    if (!(href.startsWith('/') || href.startsWith(pageUrl.origin))
      || href.endsWith('/')
      || href === pageUrl.origin
      || htmlExclude.includes(href)
      || HAS_EXTENSION.test(href.split('/').pop())) {
      return true;
    }
    const isAutoblockLink = relativeAutoBlocks.some((block) => href.includes(block));
    if (isAutoblockLink) return true;
    return false;
  };

  const links = area.querySelectorAll('a');
  links.forEach((el) => {
    const href = el.getAttribute('href');
    if (!href || shouldNotConvert(href)) return;

    try {
      const linkUrl = new URL(href.startsWith('http') ? href : `${pageUrl.origin}${href}`);
      if (linkUrl.pathname && !linkUrl.pathname.endsWith('.html')) {
        linkUrl.pathname = `${linkUrl.pathname}.html`;
        el.setAttribute('href', href.startsWith('/')
          ? `${linkUrl.pathname}${linkUrl.search}${linkUrl.hash}`
          : linkUrl.href);
      }
    } catch (err) {
      /* c8 ignore next 3 */
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });
}

export const loadScript = (url, type) => new Promise((resolve, reject) => {
  let script = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (type) {
      script.setAttribute('type', type);
    }
    head.append(script);
  }

  if (script.dataset.loaded) {
    resolve(script);
    return;
  }

  const onScript = (event) => {
    script.removeEventListener('load', onScript);
    script.removeEventListener('error', onScript);

    if (event.type === 'error') {
      reject(new Error(`error loading script: ${script.src}`));
    } else if (event.type === 'load') {
      script.dataset.loaded = true;
      resolve(script);
    }
  };

  script.addEventListener('load', onScript);
  script.addEventListener('error', onScript);
});

export async function loadTemplate() {
  const template = getMetadata('template');
  if (!template) return;
  const name = template.toLowerCase().replace(/[^0-9a-z]/gi, '-');
  document.body.classList.add(name);
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs && MILO_TEMPLATES.includes(name) ? miloLibs : codeRoot;
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`${base}/templates/${name}/${name}.css`, resolve);
  });
  const scriptLoaded = new Promise((resolve) => {
    (async () => {
      try {
        await import(`${base}/templates/${name}/${name}.js`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`failed to load module for ${name}`, err);
      }
      resolve();
    })();
  });
  await Promise.all([styleLoaded, scriptLoaded]);
}

export async function loadBlock(block) {
  const name = block.classList[0];
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs && MILO_BLOCKS.includes(name) ? miloLibs : codeRoot;
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`${base}/blocks/${name}/${name}.css`, resolve);
  });

  const scriptLoaded = new Promise((resolve) => {
    (async () => {
      try {
        const { default: init } = await import(`${base}/blocks/${name}/${name}.js`);
        await init(block);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Failed loading ${name}`, err);
        const config = getConfig();
        if (config.env.name !== 'prod') {
          const { showError } = await import('../blocks/fallback/fallback.js');
          showError(block, name);
        }
      }
      resolve();
    })();
  });
  await Promise.all([styleLoaded, scriptLoaded]);
  return block;
}

export function decorateSVG(a) {
  const { textContent, href } = a;
  const altTextFlagIndex = textContent.indexOf('|');
  const sanitizedTextContent = altTextFlagIndex === -1
    ? textContent
    : textContent?.slice(0, altTextFlagIndex).trim();
  const ext = sanitizedTextContent?.substring(sanitizedTextContent.lastIndexOf('.') + 1);
  if (ext !== 'svg') return;

  const altText = altTextFlagIndex === -1
    ? ''
    : textContent.substring(textContent.indexOf('|') + 1).trim();
  const img = document.createElement('img');
  img.setAttribute('loading', 'lazy');
  img.src = localizeLink(sanitizedTextContent);
  img.alt = altText;
  const pic = document.createElement('picture');
  pic.append(img);

  try {
    const textContentUrl = new URL(sanitizedTextContent);
    const hrefUrl = new URL(href);
    if (textContentUrl?.pathname === hrefUrl?.pathname) {
      a.parentElement.replaceChild(pic, a);
    } else {
      a.textContent = '';
      a.append(pic);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Failed to load svg.', err.message);
  }
}

export function decorateAutoBlock(a) {
  const { hostname } = window.location;
  const url = new URL(a.href);
  const href = hostname === url.hostname ? `${url.pathname}${url.search}${url.hash}` : a.href;
  return AUTO_BLOCKS.find((candidate) => {
    const key = Object.keys(candidate)[0];
    const match = href.includes(candidate[key]);
    if (match) {
      if (key === 'pdf-viewer' && !a.textContent.includes('.pdf')) {
        a.target = '_blank';
        return false;
      }
      if (key === 'fragment' && url.hash === '') {
        const { parentElement } = a;
        const { nodeName, innerHTML } = parentElement;
        const noText = innerHTML === a.outerHTML;
        if (noText && nodeName === 'P') {
          const div = createTag('div', null, a);
          parentElement.parentElement.replaceChild(div, parentElement);
        }
      }
      // Modals
      if (key === 'fragment' && url.hash !== '') {
        a.dataset.modalPath = url.pathname;
        a.dataset.modalHash = url.hash;
        a.href = url.hash;
        a.className = 'modal link-block';
        return true;
      }
      a.className = `${key} link-block`;
      return true;
    }
    return false;
  });
}

export function decorateLinks(el) {
  const anchors = el.getElementsByTagName('a');
  return [...anchors].reduce((rdx, a) => {
    a.href = localizeLink(a.href);
    decorateSVG(a);
    if (a.href.includes('#_blank')) {
      a.setAttribute('target', '_blank');
      a.href = a.href.replace('#_blank', '');
    }
    const autoBLock = decorateAutoBlock(a);
    if (autoBLock) {
      rdx.push(a);
    }
    return rdx;
  }, []);
}

function decorateContent(el) {
  const children = [el];
  let child = el;
  while (child) {
    child = child.nextElementSibling;
    if (child && child.nodeName !== 'DIV') {
      children.push(child);
    } else {
      break;
    }
  }
  const block = document.createElement('div');
  block.className = 'content';
  block.append(...children);
  return block;
}

function decorateDefaults(el) {
  const firstChild = ':scope > *:not(div):first-child';
  const afterBlock = ':scope > div + *:not(div)';
  const children = el.querySelectorAll(`${firstChild}, ${afterBlock}`);
  children.forEach((child) => {
    const prev = child.previousElementSibling;
    const content = decorateContent(child);
    if (prev) {
      prev.insertAdjacentElement('afterend', content);
    } else {
      el.insertAdjacentElement('afterbegin', content);
    }
  });
}

function decorateHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  const headerMeta = getMetadata('header');
  if (headerMeta === 'off') {
    document.body.classList.add('nav-off');
    header.remove();
    return;
  }
  header.className = headerMeta || 'gnav';
  const breadcrumbs = document.querySelector('.breadcrumbs');
  if (breadcrumbs) {
    header.classList.add('has-breadcrumbs');
    header.append(breadcrumbs);
  }
}

async function decorateIcons(area, config) {
  const domIcons = area.querySelectorAll('span.icon');
  if (domIcons.length === 0) return;
  const { default: loadIcons } = await import('../features/icons.js');
  loadIcons(domIcons, config);
}

async function decoratePlaceholders(area, config) {
  const el = area.documentElement ? area.body : area;
  const regex = /{{(.*?)}}/g;
  const found = regex.test(el.innerHTML);
  if (!found) return;
  const { replaceText } = await import('../features/placeholders.js');
  el.innerHTML = await replaceText(config, regex, el.innerHTML);
}

async function loadFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;
  const footerMeta = getMetadata('footer');
  if (footerMeta === 'off') {
    footer.remove();
    return;
  }
  footer.className = footerMeta || 'footer';
  await loadBlock(footer);
}

function decorateSections(el, isDoc) {
  const selector = isDoc ? 'body > main > div' : ':scope > div';
  return [...el.querySelectorAll(selector)].map((section, idx) => {
    const links = decorateLinks(section);
    decorateDefaults(section);
    const blocks = section.querySelectorAll('div[class]:not(.content)');
    section.className = 'section';
    section.dataset.status = 'decorated';
    section.dataset.idx = idx;
    return { el: section, blocks: [...links, ...blocks] };
  });
}

async function loadMartech(config) {
  const query = new URL(window.location.href).searchParams.get('martech');
  if (query !== 'off' && getMetadata('martech') !== 'off') {
    const { default: martech } = await import('../martech/martech.js');
    martech(config, loadScript, getMetadata);
  }
}

async function loadPostLCP(config) {
  loadMartech(config);
  const header = document.querySelector('header');
  if (header) { loadBlock(header); }
  loadTemplate();
  const { default: loadFonts } = await import('./fonts.js');
  loadFonts(config.locale, loadStyle);
}

export async function loadDeferred(area, blocks, config) {
  const event = new Event('milo:deferred');
  area.dispatchEvent(event);
  if (config.links === 'on') {
    const path = `${config.contentRoot || ''}${getMetadata('links-path') || '/seo/links.json'}`;
    import('../features/links.js').then((mod) => mod.default(path, area));
  }

  import('./samplerum.js').then(({ sampleRUM }) => {
    sampleRUM('lazy');
    sampleRUM.observe(blocks);
    sampleRUM.observe(area.querySelectorAll('picture > img'));
  });
}

function loadPrivacy() {
  window.fedsConfig = {
    privacy: {
      otDomainId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db',
      footerLinkSelector: '[href="https://www.adobe.com/#openPrivacy"]',
    },
  };
  loadScript('https://www.adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js');
}

function initSidekick() {
  const initPlugins = async () => {
    const { default: init } = await import('./sidekick.js');
    init({ loadScript, loadStyle });
  };

  if (document.querySelector('helix-sidekick')) {
    initPlugins();
  } else {
    document.addEventListener('sidekick-ready', () => {
      initPlugins();
    });
  }
}

export async function loadArea(area = document) {
  const config = getConfig();
  const isDoc = area === document;

  appendHtmlPostfix(area);
  await decoratePlaceholders(area, config);

  if (isDoc) {
    decorateHeader();

    import('./samplerum.js').then(({ addRumListeners }) => {
      addRumListeners();
    });
  }

  const sections = decorateSections(area, isDoc);

  const areaBlocks = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const section of sections) {
    const loaded = section.blocks.map((block) => loadBlock(block));
    areaBlocks.push(...section.blocks);

    // Only move on to the next section when all blocks are loaded.
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(loaded);

    // eslint-disable-next-line no-await-in-loop
    await decorateIcons(section.el, config);

    // Post LCP operations.
    if (isDoc && section.el.dataset.idx === '0') { loadPostLCP(config); }

    // Show the section when all blocks inside are done.
    delete section.el.dataset.status;
    delete section.el.dataset.idx;
  }

  // Post section loading on document
  if (isDoc) {
    const georouting = getMetadata('georouting') || config.geoRouting;
    if (georouting === 'on') {
      const { default: loadGeoRouting } = await import('../features/georouting/georouting.js');
      loadGeoRouting(config, createTag, getMetadata);
    }
    const type = getMetadata('richresults');
    if (SUPPORTED_RICH_RESULTS_TYPES.includes(type)) {
      const { addRichResults } = await import('../features/richresults.js');
      addRichResults(type, { createTag, getMetadata });
    }
    loadFooter();
    const { default: loadFavIcon } = await import('./favicon.js');
    loadFavIcon(createTag, getConfig(), getMetadata);
    initSidekick();
  }

  // Load everything that can be deferred until after all blocks load.
  await loadDeferred(area, areaBlocks, config);
}

// Load everything that impacts performance later.
export function loadDelayed(delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      loadPrivacy();
      if (getMetadata('interlinks') === 'on') {
        const path = `${getConfig().locale.contentRoot}/keywords.json`;
        import('../features/interlinks.js').then((mod) => { mod.default(path); resolve(mod); });
      } else {
        resolve(null);
      }
      import('./samplerum.js').then(({ sampleRUM }) => sampleRUM('cwv'));
    }, delay);
  });
}

export const utf8ToB64 = (str) => window.btoa(unescape(encodeURIComponent(str)));
export const b64ToUtf8 = (str) => decodeURIComponent(escape(window.atob(str)));

export function parseEncodedConfig(encodedConfig) {
  try {
    return JSON.parse(b64ToUtf8(decodeURIComponent(encodedConfig)));
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function createIntersectionObserver({ el, callback, once = true, options = {} }) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        if (once) observer.unobserve(entry.target);
        callback(entry.target, entry);
      }
    });
  }, options);
  io.observe(el);
  return io;
}

export function loadLana(options = {}) {
  if (window.lana) return;

  const lanaError = (e) => {
    window.lana.log(e.reason || e.error || e.message, {
      errorType: 'i',
    });
  }

  window.lana = {
    log: async (...args) => {
      await import('../utils/lana.js');
      window.removeEventListener('error', lanaError);
      window.removeEventListener('unhandledrejection', lanaError);
      return window.lana.log(...args);
    },
    debug: false,
    options,
  };

  window.addEventListener('error', lanaError);
  window.addEventListener('unhandledrejection', lanaError);
}
