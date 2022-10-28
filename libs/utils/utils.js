const PROJECT_NAME = 'milo--adobecom';
const PRODUCTION_DOMAINS = ['milo.adobe.com'];
const MILO_TEMPLATES = [
  '404',
  'featured-story',
];
const MILO_BLOCKS = [
  'accordion',
  'adobetv',
  'aside',
  'caas',
  'caas-config',
  'card-metadata',
  'carousel',
  'chart',
  'columns',
  'faas',
  'faq',
  'fragment',
  'footer',
  'gnav',
  'how-to',
  'icon-block',
  'card',
  'marquee',
  'media',
  'merch',
  'modal',
  'pdf-viewer',
  'quote',
  'review',
  'section-metadata',
  'tabs',
  'table-of-contents',
  'text',
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
  { youtube: 'https://www.youtube.com' },
  { youtube: 'https://youtu.be' },
  { 'pdf-viewer': '.pdf' },
];
const ENVS = {
  local: {
    name: 'local',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
  },
  stage: {
    name: 'stage',
    ims: 'stg1',
    adobeIO: 'cc-collab-stage.adobe.io',
    adminconsole: 'stage.adminconsole.adobe.com',
    account: 'stage.account.adobe.com',
    edgeConfigId: '8d2805dd-85bf-4748-82eb-f99fdad117a6',
  },
  prod: {
    name: 'prod',
    ims: 'prod',
    adobeIO: 'cc-collab.adobe.io',
    adminconsole: 'adminconsole.adobe.com',
    account: 'account.adobe.com',
    edgeConfigId: '2cba807b-7430-41ae-9aac-db2b0da742d5',
  },
};

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

// find out current locale based on pathname and existing locales object from config.
export function getLocale(locales) {
  if (!locales) {
    return { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '' };
  }
  const { pathname } = window.location;
  const split = pathname.split('/');
  const locale = locales[split[1]] || locales[''];
  locale.prefix = locale.ietf === 'en-US' ? '' : `/${split[1]}`;
  return locale;
}

export const getContentRoot = (config) => {
  const { prefix } = config.locale;
  if (config.contentRoot) return `${origin}${prefix}${config.contentRoot}`;
  return `${origin}${prefix}`;
};

export const [setConfig, getConfig] = (() => {
  let config = {};
  return [
    (conf) => {
      const { origin } = window.location;
      config = { env: getEnv(conf), ...conf };
      config.codeRoot = conf.codeRoot ? `${origin}${conf.codeRoot}` : origin;
      config.contentRoot ??= '/';
      config.locale = getLocale(conf.locales);
      document.documentElement.setAttribute('lang', config.locale.ietf);
      config.locale.contentRoot = getContentRoot(config);
      return config;
    },
    () => config,
  ];
})();

export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

export function createTag(tag, attributes, html) {
  const el = document.createElement(tag);
  if (html) {
    if (html instanceof HTMLElement || html instanceof SVGElement) {
      el.append(html);
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

export function makeRelative(href) {
  const fixedHref = href.replace(/\u2013|\u2014/g, '--');
  const hosts = [`${PROJECT_NAME}.hlx.page`, `${PROJECT_NAME}.hlx.live`, ...PRODUCTION_DOMAINS];
  const url = new URL(fixedHref);
  const relative = hosts.some((host) => url.hostname.includes(host))
    || url.hostname === window.location.hostname;
  return relative ? `${url.pathname}${url.search}${url.hash}` : href;
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
          block.dataset.failed = 'true';
          block.dataset.reason = `Failed loading ${name || ''} block.`;
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
  const ext = textContent?.substr(textContent.lastIndexOf('.') + 1);
  if (ext !== 'svg') return;
  const img = document.createElement('img');
  img.src = makeRelative(textContent);
  const pic = document.createElement('picture');
  pic.append(img);
  if (img.src === href) {
    a.parentElement.replaceChild(pic, a);
  } else {
    a.textContent = '';
    a.append(pic);
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
      if (key === 'pdf-viewer' && a.textContent !== decodeURI(a.href)) {
        a.target = '_blank';
        return false;
      }
      // Fragments
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

function decorateLinks(el) {
  const anchors = el.getElementsByTagName('a');
  return [...anchors].reduce((rdx, a) => {
    a.href = makeRelative(a.href);
    decorateSVG(a);
    const autoBLock = decorateAutoBlock(a);
    if (autoBLock) {
      rdx.push(a);
    }
    return rdx;
  }, []);
}

function decorateBlocks(el) {
  const blocks = el.querySelectorAll('div[class]:not(.content)');
  return [...blocks].map((block) => block);
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
    const blocks = decorateBlocks(section);
    section.className = 'section';
    section.dataset.status = 'decorated';
    section.dataset.idx = idx;
    return { el: section, blocks: [...links, ...blocks] };
  });
}

async function loadMartech(config) {
  const query = new URL(window.location.href).searchParams.get('martech');
  if (query !== 'off') {
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

export async function loadDeferred(area) {
  if (getMetadata('nofollow-links') === 'on') {
    const path = getMetadata('nofollow-path') || '/seo/nofollow.json';
    const { default: nofollow } = await import('../features/nofollow.js');
    nofollow(path, area);
  }
}

/**
* Load the Privacy library
*/
function loadPrivacy() {
  // Configure Privacy
  window.fedsConfig = {
    privacy: {
      otDomainId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db',
      footerLinkSelector: '[href="https://www.adobe.com/#openPrivacy"]',
    },
  };

  const env = getConfig().env.name === 'prod' ? '' : 'stage.';
  loadScript(`https://www.${env}adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js`);
}

export async function loadArea(area = document) {
  const config = getConfig();
  const isDoc = area === document;

  if (isDoc) {
    decorateHeader();
  }

  const sections = decorateSections(area, isDoc);
  // eslint-disable-next-line no-restricted-syntax
  for (const section of sections) {
    const loaded = section.blocks.map((block) => loadBlock(block));

    // Only move on to the next section when all blocks are loaded.
    // eslint-disable-next-line no-await-in-loop
    await Promise.all(loaded);

    // Post LCP operations.
    if (isDoc && section.el.dataset.idx === '0') { loadPostLCP(config); }

    // Show the section when all blocks inside are done.
    delete section.el.dataset.status;
    delete section.el.dataset.idx;
  }

  // Post section loading on document
  if (isDoc) {
    if (getMetadata('georouting') === 'on' || config.georouting === 'on') {
      const { default: loadGeoRouting } = await import('../features/georouting/georouting.js');
      loadGeoRouting(config, createTag, getMetadata);
    }
    loadFooter();
    const { default: loadFavIcon } = await import('./favicon.js');
    loadFavIcon(createTag, config, getMetadata);
  }

  // Load everything that can be deferred until after all blocks load.
  await loadDeferred(area);
}

/**
 * Load everything that impacts performance later.
 */
export function loadDelayed(delay = 3000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      loadPrivacy();
      if (getMetadata('interlinks') === 'on') {
        import('../features/interlinks.js').then((mod) => {
          resolve(mod);
        });
      } else {
        resolve(null);
      }
    }, delay);
  });
}

export function utf8ToB64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export function b64ToUtf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

const RE_ALPHANUM = /[^0-9a-z]/gi;
const RE_TRIM_UNDERSCORE = /^_+|_+$/g;
export const analyticsGetLabel = (txt) => txt.replaceAll('&', 'and').replace(RE_ALPHANUM, '_').replace(RE_TRIM_UNDERSCORE, '');

export const analyticsDecorateList = (li, idx) => {
  const link = li.firstChild?.nodeName === 'A' && li.firstChild;
  if (!link) return;

  const label = link.textContent || link.getAttribute('aria-label');
  if (!label) return;

  link.setAttribute('daa-ll', `${analyticsGetLabel(label)}-${idx + 1}`);
};

export function parseEncodedConfig(encodedConfig) {
  try {
    return JSON.parse(b64ToUtf8(decodeURIComponent(encodedConfig)));
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const removeHash = (url) => url?.split('#')[0];

export function getHashConfig() {
  const { hash } = window.location;
  if (!hash) return null;
  window.location.hash = '';

  const encodedConfig = hash.startsWith('#') ? hash.substring(1) : hash;
  return parseEncodedConfig(encodedConfig);
}

export const isValidUuid = (id) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);

export const cloneObj = (obj) => JSON.parse(JSON.stringify(obj));

export function updateObj(obj, defaultObj) {
  const ds = cloneObj(defaultObj);
  Object.keys(ds).forEach((key) => {
    if (obj[key] === undefined) obj[key] = ds[key];
  });
  return obj;
}

export function getBlockClasses(className) {
  const trimDashes = (str) => str.replace(/(^\s*-)|(-\s*$)/g, '');
  const blockWithVariants = className.split('--');
  const name = trimDashes(blockWithVariants.shift());
  const variants = blockWithVariants.map((v) => trimDashes(v));
  return { name, variants };
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
