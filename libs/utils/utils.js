const PROJECT_NAME = 'milo--adobecom';
const PRODUCTION_DOMAINS = ['milo.adobe.com'];
const MILO_TEMPLATES = [];
const MILO_BLOCKS = [
  'adobetv',
  'caas',
  'card-metadata',
  'columns',
  'faas',
  'faq',
  'fragment',
  'footer',
  'gnav',
  'how-to',
  'marquee',
  'media',
  'modal',
  'quote',
  'section-metadata',
  'z-pattern',
];
const AUTO_BLOCKS = [
  { adobetv: 'https://video.tv.adobe.com' },
  { gist: 'https://gist.github.com' },
  { caas: '/tools/caas' },
  { faas: '/tools/faas' },
  { fragment: '/fragments/' },
];
const ENVS = {
  local: { name: 'local' },
  stage: {
    name: 'stage',
    ims: 'stg1',
    adobeIO: 'cc-collab-stage.adobe.io',
    adminconsole: 'stage.adminconsole.adobe.com',
    account: 'stage.account.adobe.com',
  },
  prod: {
    name: 'prod',
    ims: 'prod',
    adobeIO: 'cc-collab.adobe.io',
    adminconsole: 'adminconsole.adobe.com',
    account: 'account.adobe.com',
  },
};

function getEnv() {
  const { host, href } = window.location;
  const location = new URL(href);
  const query = location.searchParams.get('env');

  if (query) { return ENVS.query; }
  if (host.includes('localhost:')) return ENVS.local;
  /* c8 ignore start */
  if (host.includes('hlx.page') || host.includes('hlx.live')) return ENVS.stage;
  return ENVS.prod;
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

export const [setConfig, getConfig] = (() => {
  let config = {};
  return [
    (conf) => {
      const { origin } = window.location;
      config = { ...conf, env: getEnv() };
      config.codeRoot = conf.codeRoot ? `${origin}${conf.codeRoot}` : origin;
      config.locale = getLocale(conf.locales);
      document.documentElement.setAttribute('lang', config.locale.ietf);
      if (config.contentRoot) {
        config.locale.contentRoot = `${origin}${config.locale.prefix}${config.contentRoot}`;
      } else {
        config.locale.contentRoot = `${origin}${config.locale.prefix}`;
      }
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
    if (html instanceof HTMLElement) {
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
  if (script) {
    resolve(script);
  } else {
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (type) {
      script.setAttribute('type', type);
    }
    script.onload = () => {
      resolve(script);
    };
    script.onerror = () => {
      reject(new Error('error loading script'));
    };
    head.append(script);
  }
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
  block.dataset.status = 'loading';
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
        if (getEnv() !== 'prod') {
          block.dataset.failed = 'true';
          block.dataset.reason = `Failed loading ${name || ''} block.`;
        }
      }
      resolve();
    })();
  });
  await Promise.all([styleLoaded, scriptLoaded]);
  delete block.dataset.status;
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

function decorateAutoBlock(a) {
  const { hostname } = window.location;
  const url = new URL(a.href);
  const href = hostname === url.hostname ? `${url.pathname}${url.search}${url.hash}` : a.href;
  return AUTO_BLOCKS.find((candidate) => {
    const key = Object.keys(candidate)[0];
    const match = href.includes(candidate[key]);
    if (match) {
      // Modals
      if (key === 'fragment' && url.hash !== '') {
        a.dataset.modalPath = url.pathname;
        a.dataset.modalHash = url.hash;
        a.href = url.hash;
        return false;
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
  return [...blocks].map((block) => {
    block.dataset.status = 'decorated';
    return block;
  });
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

async function loadHeader() {
  const header = document.querySelector('header');
  if (getMetadata('header') === 'off') {
    document.body.classList.add('nav-off');
    header.remove();
    return null;
  }
  header.dataset.status = 'decorated';
  header.className = getMetadata('header') || 'gnav';
  await loadBlock(header);
  return header;
}

async function loadFooter() {
  const footer = document.querySelector('footer');
  footer.className = 'footer';
  await loadBlock(footer);
  return footer;
}

function decorateSections(el, isDoc) {
  const selector = isDoc ? 'body > main > div' : ':scope > div';
  return [...el.querySelectorAll(selector)].map((section, idx) => {
    decorateDefaults(section);
    const links = decorateLinks(section);
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
    const { default: martech } = await import('./martech.js');
    martech(config, loadScript, getMetadata);
  }
}

async function loadPostLCP(config) {
  loadHeader();
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

export async function loadArea(area = document) {
  const config = getConfig();
  const isDoc = area === document;

  if (isDoc) { loadMartech(config); }

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
    loadFooter();
    const { default: loadFavIcon } = await import('./favicon.js');
    loadFavIcon(createTag, getConfig(), getMetadata);
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

export function parseEncodedConfig(encodedConfig) {
  try {
    return JSON.parse(b64ToUtf8(decodeURIComponent(encodedConfig)));
  } catch (e) {
    console.log(e);
  }
  return null;
}

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
