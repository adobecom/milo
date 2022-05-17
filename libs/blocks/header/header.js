import { getMetadata, makeRelative } from '../../utils/utils.js';

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function init(block) {
  const navPath = getMetadata('nav url') || '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const anchors = doc.querySelectorAll('a');
    anchors.forEach((a) => {
      a.href = makeRelative(a.href);
    });

    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');

    const toggle = document.createElement('button');
    nav.append(toggle, ...doc.querySelectorAll('div > *'));
    block.append(nav);
    return block;
  }
  return false;
}
