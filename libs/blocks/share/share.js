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
  }
  if (!(selectors instanceof Array)) {
    /* eslint-disable no-param-reassign */
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
  if (manualShares.length === 0) return ['facebook', 'x', 'linkedin', 'pinterest', 'reddit'];
  const platforms = [];
  [...manualShares].forEach((share) => {
    const { href } = share;
    const url = new URL(href);
    const parts = url.host.split('.');
    const platform = parts[parts.length - 2] !== 'twitter' ? parts[parts.length - 2] : 'x';
    platforms.push(platform);
    const parentP = share.closest('p');
    parentP?.remove();
  });
  return platforms;
}

function getPrevHeadingLevel(block) {
  const prevHeading = [...document.querySelectorAll('h2, h3, h4, h5, h6')]
    .reverse()
    /* eslint-disable-next-line no-bitwise */
    .find((heading) => heading.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_FOLLOWING);
  const prevHeadingTag = prevHeading?.tagName.toLowerCase() ?? 'h2';
  return prevHeadingTag.replace('h', '');
}

function toSentenceCase(str) {
  if (!str || typeof str !== 'string') return '';
  /* eslint-disable-next-line no-useless-escape */
  return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
}

function showCopyTooltip({ copyButton, show = true, copied = false }) {
  copyButton.classList.toggle('hide-copy-tooltip', !show);
  copyButton.classList.toggle('copy-to-clipboard-copied', copied);
}

export default async function decorate(block) {
  const config = getConfig();
  const base = config.miloLibs || config.codeRoot;
  const platforms = getPlatforms(block);
  let firstRow = block.querySelector(':scope > div');
  let headingElem;

  if (block.matches('.inline')) firstRow?.remove();
  else if (firstRow?.textContent.trim().length) {
    headingElem = firstRow.querySelector('p, div:not(:has(p, h1, h2, h3, h4, h5, h6))');
  } else {
    headingElem = createTag('p', null, toSentenceCase(await replaceKey('share-this-page', config)));
    if (firstRow) firstRow.replaceChildren(headingElem);
    else {
      firstRow = createTag('div', null, headingElem);
      block.append(firstRow);
    }
  }

  firstRow?.classList.add('tracking-header');
  headingElem?.setAttribute('role', 'heading');
  headingElem?.setAttribute('aria-level', getPrevHeadingLevel(block));

  const clipboardSupport = !!navigator.clipboard;
  if (clipboardSupport) platforms.push('clipboard');
  const svgs = await getSVGsfromFile(
    `${base}/blocks/share/share.svg`,
    platforms,
  );
  if (!svgs) return;

  const shareToText = toSentenceCase(await replaceKey('share-to', config));
  const url = encodeURIComponent(window.location.href);
  const title = document.title ?? url;
  /* eslint-disable  no-shadow */
  const getDetails = (name, url) => {
    switch (name) {
      case 'facebook':
        return {
          title: 'Facebook',
          href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        };
      case 'x':
        return {
          title: 'X',
          href: `https://x.com/share?&url=${url}`,
        };
      case 'linkedin':
        return {
          title: 'LinkedIn',
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };
      case 'pinterest':
        return {
          title: 'Pinterest',
          href: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
        };
      case 'reddit':
        return {
          title: 'Reddit',
          href: `https://reddit.com/submit?url=${url}&title=${title}`,
        };
      default:
        /* c8 ignore next 1 */
        return null;
    }
  };

  const container = createTag('ul', { class: 'icon-container' });
  svgs.forEach(async (svg) => {
    if (svg.name === 'clipboard') return;

    const obj = getDetails(svg.name, url);
    if (!obj) return;

    const shareLink = createTag(
      'a',
      {
        title: `${shareToText} ${obj.title}`,
        target: '_blank',
        href: obj.href,
      },
      svg.svg,
    );
    const li = createTag('li');
    li.appendChild(shareLink);
    container.append(li);
    shareLink.addEventListener('click', (e) => {
      /* c8 ignore next 2 */
      e.preventDefault();
      window.open(shareLink.href, 'newwindow', 'width=600, height=400');
    });
  });

  const clipboardSvg = svgs.find((svg) => svg.name === 'clipboard');
  if (clipboardSvg && clipboardSupport) {
    const clipboardToolTip = toSentenceCase(
      await replaceKey('copy-to-clipboard', config),
    );
    const copiedTooltip = toSentenceCase(await replaceKey('copied', config));
    const copyButton = createTag(
      'button',
      {
        type: 'button',
        class: 'copy-to-clipboard hide-copy-tooltip',
        'aria-label': clipboardToolTip,
        'data-copied': `${copiedTooltip}!`,
      },
      clipboardSvg.svg,
    );

    let clipboardTimeout;
    const li = createTag('li');
    ['keydown', 'focus', 'blur', 'mouseenter', 'mouseleave'].forEach((eventType) => {
      const target = eventType.startsWith('mouse') ? li : copyButton;
      target.addEventListener(eventType, (event) => {
        const { type, key } = event;
        if (type === 'keydown' && key !== 'Escape') return;
        showCopyTooltip({ copyButton, show: !['mouseleave', 'blur', 'keydown'].includes(type) });
        clearTimeout(clipboardTimeout);
      });
    });

    const copyAriaLive = createTag(
      'div',
      {
        'aria-live': 'polite',
        role: 'status',
        class: 'aria-live-container',
      },
    );
    li.append(copyButton, copyAriaLive);
    container.append(li);
    let changeText = false;
    copyButton.addEventListener('click', (e) => {
      /* c8 ignore next 6 */
      e.preventDefault();
      copyAriaLive.textContent = '';
      navigator.clipboard.writeText(window.location.href).then(() => {
        showCopyTooltip({ copyButton, copied: true });
        copyAriaLive.textContent = copiedTooltip + (changeText ? '\u200b' : '');
        changeText = !changeText;
        clipboardTimeout = setTimeout(() => {
          showCopyTooltip({ copyButton, show: false });
        }, 2000);
      });
    });
  }
  block.append(container);
  inlineBlock(block);
}
