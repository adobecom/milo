/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const PROJECT_NAME = 'milo--adobecom';
const PRODUCTION_DOMAINS = ['milo.adobe.com'];
const LCP_BLOCKS = ['section', 'hero'];
const LINK_BLOCKS = [
  { youtube: 'https://www.youtube.com' },
  { gist: 'https://gist.github.com' },
  { caas: 'http://cmiqueo.corp.adobe.com/' },
];

/*
 * ------------------------------------------------------------
 * Edit below at your own risk
 * ------------------------------------------------------------
 */

export function getMetadata(name) {
  const attr = name && name.includes(':') ? 'property' : 'name';
  const meta = document.head.querySelector(`meta[${attr}="${name}"]`);
  return meta && meta.content;
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

export function loadScript(url, callback, type) {
  const script = document.createElement('script');
  script.onload = callback;
  script.setAttribute('src', url);
  if (type) { script.setAttribute('type', type); }
  document.head.append(script);
  return script;    
}

export async function loadBlock(block) {
  const { status } = block.dataset;
  if (status === 'loaded') return block;
  block.dataset.status = 'loading';
  const blockName = block.classList[0];
  const styleLoaded = new Promise((resolve) => {
    loadStyle(`../blocks/${blockName}/${blockName}.css`, resolve);
  });
  const scriptLoaded = new Promise((resolve) => {
    (async () => {
      try {
        const { default: init } = await import(`../blocks/${blockName}/${blockName}.js`);
        await init(block);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(`Failed loading ${blockName}`);
        console.log(err);
      }
      resolve();
    })();
  });
  await Promise.all([styleLoaded, scriptLoaded]);
  block.dataset.status = 'loaded';
  return block;
}

function makeRelative(href) {
  const hosts = [`${PROJECT_NAME}.hlx.page`, `${PROJECT_NAME}.hlx.live`, ...PRODUCTION_DOMAINS];
  const url = new URL(href);
  const relative = hosts.some((host) => url.hostname.includes(host));
  if (relative) return `${url.pathname}${url.search}${url.hash}`;
  return href;
}

function decorateSVG(a) {
  const { textContent, href } = a;
  const ext = textContent.substr(textContent.lastIndexOf('.') + 1);
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

function decorateLinkBlock(a) {
  const { hostname } = window.location;
  const url = new URL(a.href);
  const href = hostname === url.hostname ? `${url.pathname}${url.search}${url.hash}` : a.href;
  return LINK_BLOCKS.find((candidate) => {
    const key = Object.keys(candidate)[0];
    if (href.startsWith(candidate[key])) {
      a.className = key;
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
    const linkBlock = decorateLinkBlock(a);
    if (linkBlock) {
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

function decorateBlocks(el) {
  const blocks = el.querySelectorAll('div[class]');
  return [...blocks].map((block) => {
    const variants = block.className.split('--');
    if (variants.length > 1) {
      variants.push(variants.pop().slice(0, -1));
    }
    block.className = variants.join(' ');
    return block;
  });
}

function decorateArea(el = document) {
  decoratePictures(el);
  const linkBlocks = decorateLinks(el);
  const blocks = decorateBlocks(el);
  return [...linkBlocks, ...blocks];
}

function decorateNavs() {
  const navs = document.querySelectorAll('header, footer');
  return [...navs].map((nav) => {
    nav.className = nav.nodeName.toLowerCase();
    return nav;
  });
}

export async function loadLCP(blocks) {
  const lcpBlock = blocks.find((block) => LCP_BLOCKS.includes(block.classList[0]));
  if (lcpBlock) {
    const lcpIdx = blocks.indexOf(lcpBlock);
    blocks.splice(lcpIdx, 1);
    await loadBlock(lcpBlock, true);
  }
}

async function loadLazy(blocks) {
  loadStyle('/fonts/fonts.css');
  const loaded = blocks.map((block) => loadBlock(block));
  await Promise.all(loaded);
}

function loadDelayed() {}

async function loadPage() {
  const blocks = decorateArea();
  const navs = decorateNavs();
  await loadLCP(blocks);
  await loadLazy([...navs, ...blocks]);
  loadDelayed();
}
loadPage();
