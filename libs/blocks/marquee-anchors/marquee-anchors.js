/*
 * Marquee Anchors
 */
import { createTag, getConfig } from '../../utils/utils.js';
import { decorateBlockText, getBlockSize, decorateBlockBg } from '../../utils/decorate.js';

// size: [heading, body, ...detail]
const blockTypeSizes = {
  default: {
    xsmall: ['xs', 'xs', 'xs'],
    small: ['m', 's', 's'],
    medium: ['l', 'm', 'm'],
    large: ['xl', 'm', 'l'],
    xlarge: ['xxl', 'l', 'xl'],
  },
};

let fetchedIcon;
let fetched = false;
function decorateAnchors(anchors) {
  const linkGroup = createTag('div', { class: 'links-group' });
  anchors[0].insertAdjacentElement('beforebegin', linkGroup);
  if (!fetched) {
    const { miloLibs, codeRoot } = getConfig();
    let base = miloLibs || codeRoot;
    if (!base) base = 'https://milo.adobe.com/libs';
    const iconImg = createTag('img', {
      alt: 'arrow-down',
      class: 'icon-milo',
      src: `${base}/img/ui/arrow-down.svg`,
    });
    fetched = true;
    fetchedIcon = iconImg;
  }
  const anchorIcon = createTag('span', { class: 'anchor-icon' }, fetchedIcon);
  [...anchors].forEach((el) => {
    const external = el.classList.contains('no-icon');
    if (!external) el.append(anchorIcon.cloneNode(true));
    linkGroup.append(el);
  });
}

export default function init(el) {
  el.classList.add('con-block');
  const size = getBlockSize(el);
  const rows = el.querySelectorAll(':scope > div');
  const [background, copy, ...list] = [...rows];
  background.classList.add('background');
  copy.classList.add('copy');
  decorateBlockBg(el, background);
  decorateBlockText(copy, blockTypeSizes.default[size]);
  const links = createTag('div', { class: 'links' }, list);
  const foreground = createTag('div', { class: 'foreground' }, copy);
  decorateBlockText(links, blockTypeSizes.default.xsmall);
  foreground.append(links);
  el.append(foreground);

  [...list].forEach((i) => {
    const aTag = i.querySelector('a');
    if (aTag?.textContent.charAt(0) === '#') {
      const content = i.querySelector(':scope > div');
      // (href === origin+path) - url is an anchor
      const hrefPathEqual = (aTag.href.split('?')[0] === window.location.origin + window.location.pathname);
      const hrefUrl = (hrefPathEqual)
        ? `${aTag.href}${aTag.textContent}`
        : `${aTag.href}`;
      const link = createTag('a', {
        class: 'anchor-link',
        href: hrefUrl,
      }, content);
      if (!hrefPathEqual) link.classList.add('no-icon');
      i.parentElement.replaceChild(link, i);
      aTag.parentElement.remove();
    }
  });

  const emptyLinkRows = links.querySelectorAll(':scope > div:not([class])');
  if (emptyLinkRows[0]) emptyLinkRows[0].classList.add('links-header');
  if (emptyLinkRows[1]) emptyLinkRows[1].classList.add('links-footer', 'body-s');
  decorateBlockText(emptyLinkRows[0], blockTypeSizes.default.xsmall);

  const anchors = el.querySelectorAll('.anchor-link');
  if (anchors.length) decorateAnchors(anchors);
}
