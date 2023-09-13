import { createTag, getConfig, loadArea, localizeLink } from '../../utils/utils.js';
import Tree from '../../utils/tree.js';

const fragMap = {};

const removeHash = (url) => {
  const urlNoHash = url.split('#')[0];
  return url.includes('#_dnt') ? `${urlNoHash}#_dnt` : urlNoHash;
};

const isCircularRef = (href) => [...Object.values(fragMap)]
  .some((tree) => {
    const node = tree.find(href);
    return node ? !(node.isLeaf) : false;
  });

const updateFragMap = (fragment, a, href) => {
  const fragLinks = [...fragment.querySelectorAll('a')]
    .filter((link) => localizeLink(link.href).includes('/fragments/'));
  if (!fragLinks.length) return;

  if (document.body.contains(a)) { // is fragment on page (not nested)
    fragMap[href] = new Tree(href);
    fragLinks.forEach((link) => fragMap[href].insert(href, localizeLink(removeHash(link.href))));
  } else {
    Object.values(fragMap).forEach((tree) => {
      if (tree.find(href)) {
        fragLinks.forEach((link) => tree.insert(href, localizeLink(removeHash(link.href))));
      }
    });
  }
};

export default async function init(a) {
  const { expFragments } = getConfig();
  let relHref = localizeLink(a.href);
  if (expFragments?.[relHref]) {
    a.href = expFragments[relHref];
    relHref = expFragments[relHref];
  }
  if (isCircularRef(relHref)) {
    window.lana?.log(`ERROR: Fragment Circular Reference loading ${a.href}`);
    return;
  }
  const resp = await fetch(`${a.href}.plain.html`);
  if (resp.ok) {
    const html = await resp.text();
    const doc = (new DOMParser()).parseFromString(html, 'text/html');
    const sections = doc.querySelectorAll('body > div');
    if (sections.length > 0) {
      const fragment = createTag('div', { class: 'fragment', 'data-path': relHref });
      fragment.append(...sections);

      updateFragMap(fragment, a, relHref);

      if (a.dataset.manifestId) {
        import('../../features/personalization/add-fragment-link-headers.js')
          .then(({ default: addFragmentLinkHeaders }) => addFragmentLinkHeaders(fragment, a));
      }
      a.parentElement.replaceChild(fragment, a);

      await loadArea(fragment);
    } else {
      window.lana?.log(`Could not make fragment: ${a.href}.plain.html`);
    }
  } else {
    window.lana?.log(`Could not get fragment: ${a.href}.plain.html`);
  }
}
