const PROJECT_NAME = 'milo--adobecom';
const PRODUCTION_DOMAINS = ['milo.adobe.com'];
const AUTO_BLOCKS = [
  { adobetv: 'https://video.tv.adobe.com' },
  { youtube: 'https://www.youtube.com' },
  { gist: 'https://gist.github.com' },
  { caas: '/tools/caas' },
  { faas: '/tools/faas' },
  { fragment: '/fragments' },
];

export function getEnv() {
  const { hostname } = window.location;
  if (hostname.includes('localhost')) return 'local';
  /* c8 ignore start */
  if (hostname.includes('hlx.page') || hostname.includes('hlx.live')) return 'stage';
  return 'prod';
  /* c8 ignore stop */
}

export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
}

export default function createTag(tag, attributes, html) {
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
  const relative = hosts.some((host) => url.hostname.includes(host));
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

export async function loadBlock(block) {
  const { status } = block.dataset;
  if (!status === 'loaded') return block;
  block.dataset.status = 'loading';
  const blockName = block.classList[0];
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`/libs/blocks/${blockName}/${blockName}.css`, resolve);
  });
  const scriptLoaded = new Promise((resolve) => {
    (async () => {
      try {
        const { default: init } = await import(`/libs/blocks/${blockName}/${blockName}.js`);
        await init(block);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Failed loading ${blockName}`, err);
      }
      resolve();
    })();
  });
  await Promise.all([styleLoaded, scriptLoaded]);
  delete block.dataset.status;
  const section = block.closest('.section[data-status]');
  if (section) {
    const decoratedBlock = section.querySelector(':scope > [data-status]');
    if (!decoratedBlock) { delete section.dataset.status; }
  }
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
    const match = href.startsWith(candidate[key]);
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

function decoratePictures(el) {
  const styledPictures = el.querySelectorAll('strong > picture, em > picture');
  styledPictures.forEach((picture) => {
    const styleEl = picture.parentElement;
    styleEl.parentElement.replaceChild(picture, styleEl);
  });
}

export function decorateButtons(el, isLarge) {
  const buttons = el.querySelectorAll('em a, strong a');
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    const buttonSize = isLarge ? 'button-XL' : 'button-M';
    button.classList.add('con-button', buttonType, buttonSize);
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  if (buttons.length > 0) {
    const actionArea = buttons[0].closest('p');
    actionArea.classList.add('action-area');
    actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
  }
}

export function decorateIcons(el, displayText = true) {
  const regex = /[^{{]+(?=}})/g; // {{value}}
  const placeholders = el.textContent.match(regex);
  placeholders?.forEach((str) => {
    if (window.milo && window.milo.iconLibrary) {
      const icon = window.milo.iconLibrary[str];
      const size = str.includes('persona') ? 80 : 40;
      if (icon) {
        const svg = `<img height="${size}" width="${size}" alt="${icon.label}" src="${icon.value}">`;
        const label = `${svg} ${displayText ? icon.label : ''}`;
        const anchor = `<a class="icon ${str}" href="${icon.link}">${label}</a>`;
        const inner = `<span class="icon ${str}">${label}</span>`;
        el.innerHTML = el.innerHTML.replace(`{{${str}}}`, icon.link ? anchor : inner);
      } else {
        el.innerHTML = el.innerHTML.replace(`{{${str}}}`, '');
      }
    } else {
      el.innerHTML = el.innerHTML.replace(`{{${str}}}`, `<span class="icon">${str}</span>`);
    }
  });
  const icons = el.querySelectorAll('.icon');
  if (icons.length > 0) {
    let areaIndex = 0;
    if (icons[0].classList.contains('icon-persona')) {
      icons[0].closest('p').classList.add('persona-area');
      areaIndex = 1;
    }
    icons[areaIndex].closest('p').classList.add('icon-area');
  }
}

export function decorateBlockDaa(el) {
  const lh = [];
  const exclude = ['--', 'block'];
  el.classList.forEach((c) => {
    if (!c.includes(exclude[0]) && c !== exclude[1]) lh.push(c);
  });
  el.setAttribute('daa-im', 'true');
  el.setAttribute('daa-lh', lh.join('|'));
}

export function decorateTextDaa(el, heading) {
  el.setAttribute('daa-lh', heading.textContent);
  const links = el.querySelectorAll('a, button');
  if (links) {
    links.forEach((link, i) => {
      const linkType = () => {
        if (link.classList.contains('con-button')) {
          return 'cta';
        }
        if (link.classList.contains('icon')) {
          return 'icon cta';
        }
        return 'link';
      };
      const str = `${linkType(link)}|${link.innerText} ${i + 1}`;
      link.setAttribute('daa-ll', str);
    });
  }
}

export function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  if (!size || size === 'small') {
    heading.classList.add('heading-XS');
    heading.nextElementSibling.classList.add('body-S');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-M');
    }
  }
  if (size === 'medium') {
    heading.classList.add('heading-M');
    heading.nextElementSibling.classList.add('body-S');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-M');
    }
  }
  if (size === 'large') {
    heading.classList.add('heading-XL');
    heading.nextElementSibling.classList.add('body-M');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-L');
    }
  }
  decorateIcons(el);
  decorateButtons(el);
  decorateTextDaa(el, heading);
}

export function isHexColorDark(color) {
  if (color[0] !== '#') return false;
  const hex = color.replace('#', '');
  const cR = parseInt(hex.substr(0, 2), 16);
  const cG = parseInt(hex.substr(2, 2), 16);
  const cB = parseInt(hex.substr(4, 2), 16);
  const brightness = ((cR * 299) + (cG * 587) + (cB * 114)) / 1000;
  return brightness < 155;
}

export function decorateBlockBg(block, node) {
  node.classList.add('background');
  if (!node.querySelector(':scope img')) {
    block.style.background = node.textContent;
    if (isHexColorDark(node.textContent)) block.classList.add('dark');
    node.remove();
  }
}

export function getBlockSize(el) {
  const sizes = ['small', 'medium', 'large'];
  let defaultSize = sizes[1];
  sizes.forEach((size) => {
    if (el.classList.contains(size)) {
      defaultSize = size;
    }
  });
  return defaultSize;
}

// Marquee (Large, Light) >>> marquee--large--light- >>> marquee large light
function decorateBlocks(el) {
  const blocks = el.querySelectorAll('div[class]');
  return [...blocks].map((block) => {
    const variants = block.className.split('--');
    if (variants.length > 1) {
      variants.push(variants.pop().slice(0, -1));
    }
    block.dataset.status = 'decorated';
    block.className = variants.join(' ');
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

function decorateSections(el) {
  el.querySelectorAll('body > main > div').forEach((section) => {
    decorateDefaults(section);
    section.className = 'section';
    // Only mark as decorated if blocks are still loading inside
    const decoratedBlock = section.querySelector(':scope > [data-status]');
    if (decoratedBlock) { section.dataset.status = 'decorated'; }
  });
}

export function decorateArea(el = document) {
  const linkBlocks = decorateLinks(el);
  const blocks = decorateBlocks(el);
  decoratePictures(el);
  decorateSections(el);
  return [...linkBlocks, ...blocks];
}

export async function loadLazy(blocks, el = document) {
  if (getMetadata('nofollow-links') === 'on') {
    const { default: nofollow } = await import('../blocks/nofollow/nofollow.js');
    nofollow('/seo/nofollow.json', el);
  }
  const loaded = blocks.map((block) => loadBlock(block));
  await Promise.all(loaded);
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
    script.onload = () => {
      resolve(script);
    };
    script.onerror = () => {
      reject(new Error('error loading script'));
    };
    head.append(script);
  }
});

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
