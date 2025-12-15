/* eslint-disable max-classes-per-file */
import {
  createTag, getConfig, loadArea, localizeLinkAsync, customFetch, getMepLingoPrefix,
} from '../../utils/utils.js';

const fragMap = {};

const removeHash = (url) => {
  const urlNoHash = url.split('#')[0];
  return url.includes('#_dnt') ? `${urlNoHash}#_dnt` : urlNoHash;
};

const isCircularRef = (href) => [...Object.values(fragMap)]
  .some((tree) => {
    const node = tree.find(href);
    return node?.isRecursive;
  });

const updateFragMap = async (fragment, a, href) => {
  const allLinks = [...fragment.querySelectorAll('a')];
  const linkLocalizations = await Promise.all(
    allLinks.map((link) => localizeLinkAsync(
      removeHash(link.href),
      window.location.hostname,
      false,
      link,
    )),
  );
  const fragLinksWithLocalizations = linkLocalizations
    .filter((localizedHref) => localizedHref.includes('/fragments/'));

  if (!fragLinksWithLocalizations.length) return;

  if (document.body.contains(a) && !a.parentElement?.closest('.fragment')) {
    // eslint-disable-next-line no-use-before-define
    fragMap[href] = new Tree(href);
    fragLinksWithLocalizations.forEach((localizedHref) => {
      fragMap[href].insert(href, localizedHref);
    });
  } else {
    Object.values(fragMap).forEach((tree) => {
      const hrefNode = tree.find(href);
      if (!hrefNode) return;
      fragLinksWithLocalizations.forEach((localizedHref) => {
        const parentNodeSameHref = hrefNode.findParent(localizedHref);
        if (parentNodeSameHref) {
          parentNodeSameHref.isRecursive = true;
        } else {
          hrefNode.addChild(localizedHref);
        }
      });
    });
  }
};

const insertInlineFrag = async (sections, a, relHref) => {
  // Inline fragments only support one section, other sections are ignored
  const fragChildren = [...sections[0].children];
  if (a.parentElement.nodeName === 'DIV' && !a.parentElement.attributes.length) {
    a.parentElement.replaceWith(...fragChildren);
  } else {
    a.replaceWith(...fragChildren);
  }
  const promises = [];
  fragChildren.forEach((child) => {
    child.setAttribute('data-path', relHref);
    if (child.querySelector('a[href*="/fragments/"]')) promises.push(loadArea(child));
  });
  await Promise.all(promises);
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
  const { decorateArea, mep, placeholders, locale, env } = getConfig();
  let relHref = await localizeLinkAsync(a.href);
  let url;
  let inline = false;

  if (a.parentElement?.nodeName === 'P') {
    const children = a.parentElement.childNodes;
    const div = createTag('div');
    for (const attr of a.parentElement.attributes) div.setAttribute(attr.name, attr.value);
    a.parentElement.replaceWith(div);
    div.append(...children);
  }

  let mepFrag;
  try {
    url = new URL(a.href);
    const path = !a.href.includes('/federal/') ? url.pathname
      : a.href.replace('#_inline', '');
    mepFrag = mep?.fragments?.[path];
  } catch (e) {
    // do nothing
  }
  if (mepFrag) {
    const { handleFragmentCommand } = await import('../../features/personalization/personalization.js');
    relHref = handleFragmentCommand(mepFrag, a);
    if (!relHref) return;
  }

  if (a.href.includes('#_inline')) {
    inline = true;
    a.href = a.href.replace('#_inline', '');
    relHref = relHref.replace('#_inline', '');
  }

  if (isCircularRef(relHref)) {
    window.lana?.log(`ERROR: Fragment Circular Reference loading ${a.href}`);
    return;
  }

  let resourcePath = a.href;
  if (a.href.includes('/federal/')) {
    const { getFederatedUrl } = await import('../../utils/utils.js');
    resourcePath = getFederatedUrl(a.href);
  }

  const shouldFetchMepLingo = !!(
    a.dataset.mepLingo && getMepLingoPrefix()
  );
  const isMepLingoInvalid = a.dataset.mepLingo && !shouldFetchMepLingo;
  const isOnRegionalPage = a.dataset.mepLingo && !locale?.regions;

  // Helper to remove mep-lingo row from a container
  const removeMepLingoRow = (container) => {
    const rows = container?.querySelectorAll(':scope > div');
    const mepLingoRow = [...rows || []].find((row) => {
      const firstCell = row.children[0];
      return firstCell?.textContent?.toLowerCase().trim() === 'mep-lingo';
    });
    mepLingoRow?.remove();
  };

  if (isMepLingoInvalid && isOnRegionalPage) {
    lingoModule.handleInvalidOnRegionalPage(a, { env, relHref });
    return;
  }

  let originalBlock;
  let originalSection;
  const isSectionSwap = !!a.dataset.mepLingoSectionSwap;
  const isBlockSwap = !!a.dataset.mepLingoBlockSwap;
  
  try { 
    const originalUrl = new URL(a.dataset.originalHref);
    const regionPrefixes = Object.values(locale?.regions)?.map((r) => r.prefix);
    const regionalUrlOnBasePage = regionPrefixes?.length ? !!regionPrefixes?.some((prefix) => url?.pathname.startsWith(prefix)) : false;
    const linkPrelocalizedWhileAuthoring = Object.keys(getConfig().locales)?.filter(Boolean)?.some((key) => originalUrl?.pathname.startsWith(key));
    const regionalPage = locale?.regions;
    const prod = env?.name === 'prod';

    originalSection = isSectionSwap ? a.closest('.section') : null;
    if (isSectionSwap && originalSection && !regionalUrlOnBasePage) { 
      // is a regional page
      if (prod && regionalPage) { originalSection?.remove(); return; }
      // TODO set some type of class on the section so this can be marked as problematic but handled later
      // link was prelocalized
      if (prod && linkPrelocalizedWhileAuthoring) {
        removeMepLingoRow(originalSection?.querySelector('.section-metadata'));
      }
      // TODO set some type of class on the section so this can be marked as problematic but handled later
    }

    // Handle block swap (anchor is still inside block)
    
    if (isBlockSwap) {
      const blockName = a.dataset.mepLingoBlockSwap;
      originalBlock = a.closest(`.${blockName}`);

      if (originalBlock) {
        const wrapper = createTag('div', null, a);
        originalBlock.insertAdjacentElement('afterend', wrapper);
        if (blockName === 'mep-lingo') originalBlock.remove();
      }
    }
  }
  catch (e) {
    // TODO lana log error
  }

  const resp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
    .catch(() => ({}));

  if (!resp?.ok) {
    const message = `Could not get ${shouldFetchMepLingo ? 'mep-lingo ' : ''}fragment: ${resourcePath}.plain.html`;
    window.lana?.log(message);
    return;
  }

  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  replaceDotMedia(a.href, doc);
  if (decorateArea) decorateArea(doc, { fragmentLink: a });

  const sections = doc.querySelectorAll('body > div');
  if (!sections.length) {
    window.lana?.log(`Could not make fragment: ${resourcePath}.plain.html`);
    return;
  }

  const fragmentAttrs = { class: 'fragment', 'data-path': relHref };

  const fragment = createTag('div', fragmentAttrs);
  fragment.append(...sections);

  await updateFragMap(fragment, a, relHref);
  if (a.dataset.manifestId
    || a.dataset.adobeTargetTestid
    || mep?.commands?.length
    || placeholders) {
    const { updateFragDataProps, handleCommands, replacePlaceholders } = await import('../../features/personalization/personalization.js');
    if (a.dataset.manifestId || a.dataset.adobeTargetTestid) {
      updateFragDataProps(a, inline, sections, fragment);
    }
    if (mep?.commands?.length) await handleCommands(mep?.commands, fragment, false, true);
    if (placeholders) fragment.innerHTML = replacePlaceholders(fragment.innerHTML, placeholders);
  }

  if (inline) {
    await insertInlineFrag(sections, a, relHref);
    originalBlock?.remove(); // Remove original block for inline block swaps
  } else if (isSectionSwap && originalSection) {
    await loadArea(fragment);
    originalSection.innerHTML = '';
    originalSection.append(createTag('div', null, fragment));
  } else {
    const anchorParent = a.parentElement;
    anchorParent.replaceChild(fragment, a);

    originalBlock?.remove();

    await loadArea(fragment);
  }
}

class Node {
  constructor(key, value = key, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.children = [];
    this.isRecursive = false;
  }

  addChild(key, value = key) {
    const alreadyHasChild = this.children.some((n) => n.key === key);
    if (!alreadyHasChild) {
      this.children.push(new Node(key, value, this));
    }
  }

  findParent(key) {
    if (this.parent?.key === key) return this.parent;
    return this.parent?.findParent(key);
  }
}

export class Tree {
  constructor(key, value = key) {
    this.root = new Node(key, value);
  }

  * traverse(node = this.root) {
    yield node;
    if (node.children.length) {
      for (const child of node.children) {
        yield* this.traverse(child);
      }
    }
  }

  insert(parentNodeKey, key, value = key) {
    for (const node of this.traverse()) {
      if (node.key === parentNodeKey) {
        if (parentNodeKey === key) {
          node.isRecursive = true;
        } else {
          node.children.push(new Node(key, value, node));
        }
        return true;
      }
    }
    return false;
  }

  remove(key) {
    for (const node of this.traverse()) {
      const filtered = node.children.filter((c) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key) {
    for (const node of this.traverse()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
}
