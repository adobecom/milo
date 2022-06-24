import { decorateArea, loadLazy, makeRelative } from '../../utils/utils.js';
import Tree from '../../utils/tree.js';

const fragMap = {};

const isCircularRef = (href) => [...Object.values(fragMap)]
  .some((tree) => {
    const node = tree.find(href);
    return !node?.isLeaf;
  });

const updateFragMap = (fragment, a, href) => {
  const fragLinks = [...fragment.querySelectorAll('a')]
    .filter((link) => makeRelative(link.href).includes('/fragments/'));
  if (!fragLinks.length) return;

  if (document.body.contains(a)) { // is fragment on page (not nested)
    fragMap[href] = new Tree(href);
    fragLinks.forEach((link) => fragMap[href].insert(href, makeRelative(link.href)));
  } else {
    Object.values(fragMap).forEach((tree) => {
      if (tree.find(href)) {
        fragLinks.forEach((link) => tree.insert(href, makeRelative(link.href)));
      }
    });
  }
};

export default async function init(a, parent) {
  const relHref = makeRelative(a.href);
  if (isCircularRef(relHref)) {
    console.log(`ERROR: Fragment Circular Reference loading ${a.href}`)
    return;
  }
  const resp = await fetch(`${a.href}.plain.html`);
  if (resp.ok) {
    try {
      const html = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const fragment = doc.querySelector('div');
      fragment.className = 'fragment';

      updateFragMap(fragment, a, relHref);

      const blocks = decorateArea(fragment);
      await loadLazy(blocks, fragment);

      if (parent) {
        a.remove();
        parent.append(fragment);
      } else if (a.parentElement) {
        a.parentElement.replaceChild(fragment, a);
      }
    } catch (e) {
      window.lana.log('Could not make fragment');
    }
  } else {
    // eslint-disable-next-line no-console
    console.log('Could not get fragment');
  }
}
