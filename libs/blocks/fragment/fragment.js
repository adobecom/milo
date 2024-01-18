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

const setManifestIdOnChildren = (sections, manifestId) => {
  [...sections[0].children].forEach(
    (child) => (child.dataset.manifestId = manifestId),
  );
};

const insertInlineFrag = (sections, a, relHref) => {
  // Inline fragments only support one section, other sections are ignored
  const fragChildren = [...sections[0].children];
  fragChildren.forEach((child) => child.setAttribute('data-path', relHref));
  if (a.parentElement.nodeName === 'DIV' && !a.parentElement.attributes.length) {
    a.parentElement.replaceWith(...fragChildren);
  } else {
    a.replaceWith(...fragChildren);
  }
};

function replaceDotMedia(path, doc) {
  const resetAttributeBase = (tag, attr) => {
    doc.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((el) => {
      el[attr] = new URL(el.getAttribute(attr), new URL(path, window.location)).href;
    });
  };
  resetAttributeBase('img', 'src');
  resetAttributeBase('source', 'srcset');
}

export default async function init(a) {
  const { expFragments, decorateArea } = getConfig();
  let relHref = localizeLink(a.href);
  let inline = false;

  if (a.href.includes('#_inline')) {
    inline = true;
    a.href = a.href.replace('#_inline', '');
    relHref = relHref.replace('#_inline', '');
  }

  if (expFragments?.[relHref]) {
    a.href = expFragments[relHref];
    relHref = expFragments[relHref];
  }
  if (isCircularRef(relHref)) {
    window.lana?.log(`ERROR: Fragment Circular Reference loading ${a.href}`);
    return;
  }

  const resp = await fetch(`${a.href}.plain.html`);

  if (!resp.ok) {
    window.lana?.log(`Could not get fragment: ${a.href}.plain.html`);
    return;
  }

  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  replaceDotMedia(a.href, doc);
  if (decorateArea) decorateArea(doc, { fragmentLink: a });

  const sections = doc.querySelectorAll('body > div');

  if (!sections.length) {
    window.lana?.log(`Could not make fragment: ${a.href}.plain.html`);
    return;
  }

  const fragment = createTag('div', { class: 'fragment', 'data-path': relHref });

  if (!inline) {
    fragment.append(...sections);
  }

  updateFragMap(fragment, a, relHref);

  if (a.dataset.manifestId) {
    if (inline) {
      setManifestIdOnChildren(sections, a.dataset.manifestId);
    } else {
      fragment.dataset.manifestId = a.dataset.manifestId;
    }
  }

  if (inline) {
    insertInlineFrag(sections, a, relHref);
  } else {
    a.parentElement.replaceChild(fragment, a);
    await loadArea(fragment);
  }
}
