import { createTag, getFederatedUrl } from '../../utils/utils.js';

export default function init(el) {
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

    picDiv.classList.add('explore-image');
    contentDiv.classList.add('explore-content');
    elem.classList.add('explore-card');

    if (!link) return;
    const linkContainer = createTag('a', { class: 'explore-link-container', href: link.href });
    link.remove();
    linkContainer.append(contentDiv);
    elem.prepend(linkContainer);
  });
}
