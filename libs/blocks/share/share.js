import { createTag, getConfig } from '../../utils/utils.js';
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

export default async function decorate(el) {
  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;
  const platforms = getPlatforms(el) || ['facebook', 'twitter', 'linkedin', 'pinterest'];
  el.querySelector('div').remove();
  const clipboardSupport = !!(navigator.clipboard)
  if (clipboardSupport) platforms.push('clipboard');
  const svgs = await getSVGsfromFile(`${base}/blocks/share/share.svg`, platforms);
  if (!svgs) return;

  const toSentenceCase = (str) => (str && typeof str === 'string') ? str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()) : '';
  const shareToText = toSentenceCase(await replaceKey('share-to', config));
  const url = encodeURIComponent(window.location.href);
  const getDetails = (name, url) => {
    switch (name) {
      case 'facebook':
        return { title: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}` };
      case 'twitter':
        return { title: 'Twitter', href: `https://twitter.com/share?&url=${url}` };
      case 'linkedin':
        return { title: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}` };
      case 'pinterest':
        return { title: 'Pinterest', href: `https://pinterest.com/pin/create/button/?url=${url}` };
      default: return null;
    }
  };
  
  const heading = toSentenceCase(await replaceKey('share-this-page', config));
  el.append(createTag('p', null, ((heading))));
  const container = createTag('p', { class: 'icon-container' });
  svgs.forEach(async (svg) => {
    let clipboard = svg.name === 'clipboard';
    const obj = getDetails(svg.name, url);
    if (!obj && !clipboard) return;

    let shareLink;
    console.log((clipboard && clipboardSupport));
    if (clipboard && clipboardSupport) {
      const clipboardToolTip = toSentenceCase(await replaceKey('copy-to-clipboard', config));
      const copiedTooltip = toSentenceCase(await replaceKey('copied', config));
      shareLink = createTag('button', { title: clipboardToolTip, type:'button', class:'copy-to-clipboard', 'data-copy-to-clipboard': clipboardToolTip, 'data-copied': `${copiedTooltip}!` }, svg.svg);
    } else if (!clipboard) {
      shareLink = createTag('a', { title: `${shareToText} ${obj.title}`, target: '_blank', href: obj.href }, svg.svg);
    }
    if (shareLink) container.append(shareLink);
    shareLink.addEventListener('click', (e) => {
      if (clipboard && clipboardSupport) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          shareLink.classList.add('copy-to-clipboard-copied');
          setTimeout(() => document.activeElement.blur(), 500);
          setTimeout(() => shareLink.classList.remove('copy-to-clipboard-copied'), 2000);
        });
      } else {
        /* c8 ignore next 2 */
        window.open(shareLink.href, 'newwindow', 'width=600, height=400');
      }
    });
  });
  el.append(container);
}
