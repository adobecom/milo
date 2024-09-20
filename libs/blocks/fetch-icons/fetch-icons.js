import { injectSVGIcons } from '../../features/icons/icons.js';
import { createTag } from '../../utils/utils.js';

async function copyToClipboard(elem, copyTxt) {
  try {
    await navigator.clipboard.writeText(copyTxt);

    const tooltip = createTag('div', { role: 'status', 'aria-live': 'polite', class: 'copied-to-clipboard' }, `${copyTxt} copied`);
    elem.append(tooltip);

    setTimeout(() => {
      tooltip.remove();
      elem.classList.remove('copy-success');
      elem.classList.remove('copy-failure');
    }, 1500);
    elem.classList.remove('copy-failure');
    elem.classList.add('copy-success');
  } catch (e) {
    elem.classList.add('copy-failure');
    elem.classList.remove('copy-success');
  }
}

function initCopyLinks(el) {
  const links = el.querySelectorAll('.fetch-icon');
  [...links].forEach((link) => {
    link.addEventListener('click', () => {
      const dataCopy = link.getAttributeNode('data-copy');
      copyToClipboard(link, dataCopy.value);
    });
  });
}

const iconList = [];
function fetchIconList(url) {
  return fetch(url)
    .then((resp) => resp.json())
    .then((json) => {
      json.content.data.forEach((icon) => {
        iconList.push(icon);
      });
      return json;
    })
    .catch((err) => {
      console.error('Failed to fetch iconList:', err);
      return { error: err };
    });
}

function getIconPlainTxt(icon) {
  const span = createTag('span', { class: `icon icon-${icon.name}` });
  return span;
}

export default function init(el) {
  const row = el.querySelector(':scope > div');
  fetchIconList(row.textContent)
    .then(() => {
      if (!iconList.length) return;
      const iconDiv = createTag('div', { class: 'fetched-icons' });
      [...iconList].forEach((i) => {
        const iconLink = createTag('a', {
          title: `${i.name}`,
          alt: `${i.name}`,
          'data-copy': `${i.ref}`,
          'aria-label': `${i.name}`,
          class: `fetch-icon ${i.name}`,
        }, getIconPlainTxt(i));
        iconDiv.append(iconLink);
      });
      el.append(iconDiv);
      const spanIcons = el.querySelectorAll('span.icon');
      injectSVGIcons(spanIcons);
      initCopyLinks(el);
    });
}
