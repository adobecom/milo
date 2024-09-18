import { getSvgFromFile } from '../../features/icons/icons.js';
import { createTag } from '../../utils/utils.js';

async function copyToClipboard(elem, copyTxt) {
  try {
    await navigator.clipboard.writeText(copyTxt);

    const tooltip = createTag('div', { role: 'status', 'aria-live': 'polite', class: 'copied-to-clipboard' }, 'copied');
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

const icons = [];

function fetchIconList(url) {
  return fetch(url)
    .then((resp) => resp.json())
    .then((json) => {
      json.content.data.forEach((icon) => {
        icons.push(icon);
      });
      return json;
    })
    .catch((err) => {
      console.error('Failed to fetch icons:', err);
      return { error: err };
    });
}

export default function init(el) {
  const row = el.querySelector(':scope > div');

  fetchIconList(row.textContent)
    .then(() => {
      if (!icons.length) return;
      const iconDiv = createTag('div', { class: 'fetched-icons' });
      const svgPromises = icons.map((icon) => getSvgFromFile(icon.url, icon.name)
        .then((iconSvg) => {
          icon.svg = iconSvg;
          return icon;
        }));
      Promise.all(svgPromises).then((updatedIcons) => {
        updatedIcons.forEach((icon) => {
          if (icon.svg) {
            const iconLink = createTag('a', {
              title: `${icon.name}`,
              alt: `${icon.name}`,
              'data-copy': `${icon.ref}`,
              'aria-label': `${icon.name}`,
              class: `fetch-icon ${icon.name}`,
            }, icon.svg);
            iconDiv.append(iconLink);
          }
        });
        el.append(iconDiv);
        initCopyLinks(el);
      });
    })
    .catch((err) => {
      console.error('Error initializing icons:', err);
    });
}
