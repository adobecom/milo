/* eslint-disable max-classes-per-file */
import {
  createTag, getConfig, loadArea, localizeLinkAsync, customFetch, getMepLingoPrefix, lingoActive,
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
    // Skip loadArea for MEP in-block replacements - gnav/footer have their own decoration
    if (a.dataset.skipLoadArea !== 'true' && child.querySelector('a[href*="/fragments/"]')) {
      promises.push(loadArea(child));
    }
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

export const removeMepLingoRow = (container) => {
  const rows = container?.querySelectorAll(':scope > div');
  const mepLingoRow = [...rows || []].find((row) => {
    const firstCell = row.children[0];
    return firstCell?.textContent?.toLowerCase().trim() === 'mep-lingo';
  });
  mepLingoRow?.remove();
};

function removeMepLingoElement(a, isMepLingoBlock, originalBlock) {
  if (isMepLingoBlock && originalBlock) {
    originalBlock.remove();
    a.parentElement?.remove();
  } else {
    const parent = a.parentElement;
    a.remove();
    if (!parent?.children.length && !parent?.textContent?.trim()) parent?.remove();
  }
}

async function tryMepLingoFallbackForStaleIndex(originalHref, locale, resourcePath) {
  window.lana?.log(`MEP Lingo: Query-index indicated regional content exists but fetch failed for ${resourcePath}. Falling back to authored locale.`);

  let fallbackPath = originalHref;
  try {
    const resourceUrl = new URL(resourcePath);
    const originalUrl = new URL(originalHref);
    if (locale?.prefix !== undefined && !originalUrl.pathname.startsWith(locale.prefix)) {
      fallbackPath = `${resourceUrl.origin}${locale.prefix}${originalUrl.pathname}`;
    } else {
      fallbackPath = `${resourceUrl.origin}${originalUrl.pathname}`;
    }
  } catch (e) {
    if (locale?.prefix && !fallbackPath.startsWith(locale.prefix)) {
      fallbackPath = `${locale.prefix}${fallbackPath}`;
    }
  }

  const resp = await customFetch({ resource: `${fallbackPath}.plain.html`, withCacheRules: true })
    .catch(() => ({}));

  return { resp, fallbackPath };
}

export default async function init(a) {
  const { decorateArea, mep, placeholders, locale, env } = getConfig();
  let relHref = await localizeLinkAsync(a.href, window.location.hostname, false, a);
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
    mepFrag = mep?.fragments?.[path] || mep?.fragments?.[path.replace(locale.prefix, '')];
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

  const isMepLingoLink = a.dataset.mepLingo === 'true';
  const isMepLingoInsert = a.dataset.mepLingoInsert === 'true';
  const isMepLingoRemove = a.dataset.mepLingoRemove === 'true';
  const shouldFetchMepLingo = isMepLingoLink && !!getMepLingoPrefix();
  const isOnRegionalPage = locale?.base !== undefined;

  if (isMepLingoLink && (isOnRegionalPage || !lingoActive())) {
    const { handleInvalidMepLingo } = await import('../../features/mep/lingo.js');
    handleInvalidMepLingo(a, { env });
    return;
  }

  let originalBlock;
  const isSectionSwap = a.dataset.mepLingoSectionSwap === 'true';
  const isBlockSwap = !!a.dataset.mepLingoBlockSwap;
  const originalSection = isSectionSwap ? a.closest('.section') : null;
  const isMepLingoBlock = isBlockSwap && a.dataset.mepLingoBlockSwap === 'mep-lingo';

  if (isMepLingoInsert && !shouldFetchMepLingo) {
    if (isMepLingoBlock) {
      const block = a.closest('.mep-lingo');
      block?.remove();
      return;
    }
    removeMepLingoElement(a, false);
    return;
  }

  // For block/section swaps (not mep-lingo blocks) when no regional targeting: keep authored
  if (!shouldFetchMepLingo && (isBlockSwap || isSectionSwap) && !isMepLingoBlock) {
    if (isBlockSwap) {
      removeMepLingoRow(a.closest(`.${a.dataset.mepLingoBlockSwap}`));
    } else if (isSectionSwap) {
      removeMepLingoRow(originalSection?.querySelector('.section-metadata'));
    }
    return;
  }

  if (isBlockSwap) {
    const blockName = a.dataset.mepLingoBlockSwap;
    originalBlock = a.closest(`.${blockName}`);

    if (originalBlock) {
      const wrapper = createTag('div', null, a);
      originalBlock.insertAdjacentElement('afterend', wrapper);
      if (blockName === 'mep-lingo' && !isMepLingoInsert) originalBlock.remove();
    }
  }

  const isMepLingoFragment = !isBlockSwap && !isSectionSwap && isMepLingoLink;
  const needsFallback = (isMepLingoBlock || isMepLingoFragment)
    && !!a.dataset.originalHref && !isMepLingoInsert && !isMepLingoRemove;

  let resp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
    .catch(() => ({}));

  let usedFallback = false;

  const mepLingoPrefix = getMepLingoPrefix();
  if (isMepLingoLink && resp?.ok && !relHref.includes(mepLingoPrefix || '___NONE___')) {
    usedFallback = true;
  }

  const attemptedRegionalFetch = relHref.includes(mepLingoPrefix);
  const canTryFallback = needsFallback && mepLingoPrefix
    && a.dataset.originalHref && !isMepLingoInsert && !isMepLingoRemove;

  const applyFallback = (fallback) => {
    if (fallback.resp?.ok) {
      resp = fallback.resp;
      try {
        relHref = new URL(fallback.fallbackPath).pathname;
      } catch (e) {
        relHref = fallback.fallbackPath;
      }
      usedFallback = true;
    }
  };

  if (!resp?.ok && attemptedRegionalFetch && canTryFallback) {
    const fallback = await tryMepLingoFallbackForStaleIndex(
      a.dataset.originalHref,
      locale,
      resourcePath,
    );
    applyFallback(fallback);
  }

  if (!resp?.ok && isMepLingoRemove && attemptedRegionalFetch && a.dataset.originalHref) {
    const fallback = await tryMepLingoFallbackForStaleIndex(
      a.dataset.originalHref,
      locale,
      resourcePath,
    );
    applyFallback(fallback);
  }

  if (!resp?.ok) {
    if (isMepLingoInsert) {
      removeMepLingoElement(a, isMepLingoBlock, originalBlock);
      return;
    }

    if (isBlockSwap && originalBlock) {
      if (isMepLingoBlock) {
        originalBlock?.remove();
        a.parentElement?.remove();
      } else {
        removeMepLingoRow(originalBlock);
        a.parentElement?.remove();
      }
      return;
    }
    if (isSectionSwap && originalSection) {
      removeMepLingoRow(originalSection?.querySelector('.section-metadata'));
      a.parentElement?.remove();
      return;
    }
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

  // Remove variant: If regional content exists but is empty, remove the element
  if (isMepLingoRemove && !usedFallback) {
    const hasText = [...sections].some((section) => section.textContent.trim());
    if (!hasText) {
      removeMepLingoElement(a, isMepLingoBlock, originalBlock);
      return;
    }
  }

  const fragmentAttrs = { class: 'fragment', 'data-path': relHref };
  const fragment = createTag('div', fragmentAttrs);

  if (isMepLingoLink && mep?.preview) {
    const { addMepLingoPreviewAttrs } = await import('../../features/mep/lingo.js');
    addMepLingoPreviewAttrs(fragment, {
      usedFallback,
      relHref,
      isInsert: isMepLingoInsert,
      isRemove: isMepLingoRemove,
    });
  }
  fragment.append(...sections);

  await updateFragMap(fragment, a, relHref);
  const hasManifestId = a.dataset.manifestId || a.dataset.adobeTargetTestid;
  const hasLingoAttrs = fragment.dataset.mepLingoRoc || fragment.dataset.mepLingoFallback;
  if (hasManifestId || hasLingoAttrs || mep?.commands?.length || placeholders) {
    const { updateFragDataProps, handleCommands, replacePlaceholders } = await import('../../features/personalization/personalization.js');
    if (hasManifestId || hasLingoAttrs) {
      updateFragDataProps(a, inline, sections, fragment);
    }
    if (mep?.commands?.length) await handleCommands(mep?.commands, fragment, false, true);
    if (placeholders) fragment.innerHTML = replacePlaceholders(fragment.innerHTML, placeholders);
  }

  if (inline) {
    await insertInlineFrag(sections, a, relHref);
    originalBlock?.remove();
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
