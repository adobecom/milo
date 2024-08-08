import { getSvgFromFile } from '../../features/icons/icons.js';
import { createTag } from '../../utils/utils.js';
import { copyToClipboard } from '../../utils/tools.js';

const icons = [];

function initCopyLinks(el) {
  const links = el.querySelectorAll('.fetch-icon');
  console.log('initCopyLinks', links);

  [...links].forEach((link) => {
    link.addEventListener('click', () => {
      console.log('Button clicked!', link);
      copyToClipboard(link, link.alt);
    });
  });
  console.log('allIcons', el, links);
}

async function fetchIconList(url) {
  const resp = await fetch(url);
  const json = await resp.json()
    .then((json) => {
      json.content.data.forEach((icon) => {
        icons.push(icon);
      });
    });
  if (!resp.ok) { return { error: json }; }
  return { list: json };
}

export default async function init(el) {
  const row = el.querySelector(':scope > div');
  await fetchIconList(row.textContent);

  if (!icons.length) return;
  const iconDiv = createTag('div', { class: 'fetched-icons' });
  [...icons].forEach(async (icon) => {
    console.log(icon.name);
    const iconSvg = await getSvgFromFile(icon.url, icon.name);
    if (!iconSvg) return;
    icon.svg = iconSvg;
    const iconLink = createTag('a', { alt: `${icon.name}`, class: `fetch-icon ${icon.name}` }, icon.svg);
    iconDiv.append(iconLink);
  });
  el.append(iconDiv);
}
