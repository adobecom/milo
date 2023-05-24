import { createTag, getConfig } from '../../utils/utils.js';
import { inlineBlock } from '../../utils/inline.js';
import { replaceKey } from '../../features/placeholders.js';

export async function getSVGsfromFile(path, selectors) {
  if (!path) return null;
  const resp = await fetch(path);
  if (!resp.ok) return null;

  const text = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');

  if (!selectors) {
    const svg = doc.querySelector('svg');
    if (svg) return [{ svg }];
    /* c8 ignore next 4 */
    return null;
  } else if (!(selectors instanceof Array)) {
    selectors = [selectors];
  }

  return selectors.map((selector) => {
    const symbol = doc.querySelector(`#${selector}`);
    if (!symbol) return null;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    while (symbol.firstChild) svg.appendChild(symbol.firstChild);
    [...symbol.attributes].forEach((attr) => svg.attributes.setNamedItem(attr.cloneNode()));
    svg.classList.add('icon');
    svg.classList.add(`icon-${selector}`);
    svg.removeAttribute('id');
    return { svg, name: selector };
  });
}

function getPlatforms(el) {
  const manualShares = el.querySelectorAll('a');
  if (manualShares.length === 0) return null;
  return [...manualShares].map((link) => {
    const { href } = link;
    const url = new URL(href);
    const parts = url.host.split('.');
    return parts[parts.length - 2];
  });
}

export default async function decorate(block) {
  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;
  const platforms = getPlatforms(block) || ['facebook', 'twitter', 'linkedin', 'pinterest', 'reddit'];
  block.innerHTML = '';
  const clipboardSupport = !!(navigator.clipboard)
  if (clipboardSupport) platforms.push('clipboard');
  const svgs = await getSVGsfromFile(`${base}/blocks/share/share.svg`, platforms);
  if (!svgs) return;

  const toSentenceCase = (str) => (str && typeof str === 'string') ? str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()) : '';
  const shareToText = toSentenceCase(await replaceKey('share-to', config));
  const url = encodeURIComponent(window.location.href);
  const title = document.title ?? url;
  const getDetails = (name, url) => {
    switch (name) {
      case 'facebook':
        return { title: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` };
      case 'twitter':
        return { title: 'Twitter', href: `https://twitter.com/share?&url=${url}` };
      case 'linkedin':
        return { title: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` };
      case 'pinterest':
        return { title: 'Pinterest', href: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}` };
      case 'reddit':
        return { title: 'Reddit', href: `https://reddit.com/submit?url=${url}&title=${title}` };
      default: return null;
    }
  };
  if (!block.classList.contains('inline')) {
    const heading = toSentenceCase(await replaceKey('share-this-page', config));
    block.append(createTag('p', null, ((heading))));
  }
  const container = createTag('p', { class: 'icon-container' });
  svgs.forEach(async (svg) => {
    if (svg.name === 'clipboard') return;
    
    const obj = getDetails(svg.name, url);
    if (!obj) return;

    const shareLink = createTag('a', { 
      title: `${shareToText} ${obj.title}`,
      target: '_blank',
      href: obj.href 
    }, svg.svg);
    container.append(shareLink);
    shareLink.addEventListener('click', (e) => {
      /* c8 ignore next 2 */
      e.preventDefault();
      window.open(shareLink.href, 'newwindow', 'width=600, height=400');
    });
  });
  const clipboardSvg = svgs.find((svg) => svg.name === 'clipboard');
  if (clipboardSvg && clipboardSupport) {
    const clipboardToolTip = toSentenceCase(await replaceKey('copy-to-clipboard', config));
    const copiedTooltip = toSentenceCase(await replaceKey('copied', config));
    const copyButton = createTag('button', { 
      type:'button', 
      class:'copy-to-clipboard', 
      'aria-label': clipboardToolTip, 
      'data-copy-to-clipboard': clipboardToolTip, 
      'data-copied': `${copiedTooltip}!` 
    }, clipboardSvg.svg);
    container.append(copyButton);
    copyButton.addEventListener('click', (e) => {
      /* c8 ignore next 6 */
      e.preventDefault();
      navigator.clipboard.writeText(window.location.href).then(() => {
        copyButton.classList.add('copy-to-clipboard-copied');
        setTimeout(() => document.activeElement.blur(), 500);
        setTimeout(() => copyButton.classList.remove('copy-to-clipboard-copied'), 2000);
      });
    });
  }
  block.append(container);
  inlineBlock(block);
}
