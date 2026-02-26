import { createTag, getFederatedUrl } from '../../utils/utils.js';

export default function init(el) {
  const blockName = el.classList[0].toLowerCase();
  const elems = el.querySelectorAll(':scope > div');

  elems.forEach((elem) => {
    const contentDiv = elem.querySelector('div:first-child');
    const picDiv = elem.querySelector('div:last-child');
    const isSvgUrl = (url) => /\.svg(\?.*)?$/i.test(url || '');
    const img = contentDiv.querySelector('img');
    const link = contentDiv.querySelector('a');

    if (img && isSvgUrl(img.src)) {
      img.src = getFederatedUrl(img.src);
    }

    picDiv.classList.add(`${blockName}-image`);
    contentDiv.classList.add(`${blockName}-content`);
    elem.classList.add('explore-card');

    if (!link) return;
    const linkContainer = createTag('a', { class: `${blockName}-link-container`, href: link.href });
    link.remove();
    linkContainer.append(contentDiv);
    elem.prepend(linkContainer);
  });
}
