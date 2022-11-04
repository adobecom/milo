import { createTag, loadArea, makeRelative, removeHash } from '../../utils/utils.js';
import Tree from '../../utils/tree.js';

const fragMap = {};

const isCircularRef = (href) => [...Object.values(fragMap)]
  .some((tree) => {
    const node = tree.find(href);
    return node ? !(node.isLeaf) : false;
  });

const updateFragMap = (fragment, a, href) => {
  const fragLinks = [...fragment.querySelectorAll('a')]
    .filter((link) => makeRelative(link.href).includes('/fragments/'));
  if (!fragLinks.length) return;

  if (document.body.contains(a)) { // is fragment on page (not nested)
    fragMap[href] = new Tree(href);
    fragLinks.forEach((link) => fragMap[href].insert(href, makeRelative(removeHash(link.href))));
  } else {
    Object.values(fragMap).forEach((tree) => {
      if (tree.find(href)) {
        fragLinks.forEach((link) => tree.insert(href, makeRelative(removeHash(link.href))));
      }
    });
  }
};

export default async function init(a, parent) {
  const relHref = makeRelative(a.href);
  if (isCircularRef(relHref)) {
    console.log(`ERROR: Fragment Circular Reference loading ${a.href}`);
    return;
  }
  const resp = await fetch(`${a.href}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sections = doc.querySelectorAll('body > div');
    if (sections.length > 0) {
      const fragment = createTag('div', { class: 'fragment' });
      fragment.append(...sections);

      updateFragMap(fragment, a, relHref);

      if (parent) {
        a.remove();
        parent.append(fragment);
      } else if (a.parentElement) {
        a.parentElement.replaceChild(fragment, a);
      }

      await loadArea(fragment);

    } else {
      window.lana.log('Could not make fragment');
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Could not get fragment');
  }
}
