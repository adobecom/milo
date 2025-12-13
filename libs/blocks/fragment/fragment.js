/* eslint-disable max-classes-per-file */
import { createTag, getConfig, loadArea, localizeLinkAsync, customFetch } from '../../utils/utils.js';

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

const insertInlineFrag = async (sections, a, relHref, fragment) => {
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
    if (fragment?.dataset?.mepLingoRoc) {
      child.setAttribute('data-mep-lingo-roc', fragment.dataset.mepLingoRoc);
    } else if (fragment?.dataset?.mepLingoFallback) {
      child.setAttribute('data-mep-lingo-fallback', fragment.dataset.mepLingoFallback);
    }
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
  if (!a?.href) return;
  const { decorateArea, mep, placeholders, locale } = getConfig();
  let relHref = await localizeLinkAsync(a.href);
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
    const path = !a.href.includes('/federal/') ? new URL(a.href).pathname
      : a.href.replace('#_inline', '').replace(locale.prefix, '');
    mepFrag = mep?.fragments?.[path];
  } catch (e) {
    // do nothing
  }
  if (mepFrag) {
    const { handleFragmentCommand } = await import('../../features/personalization/personalization.js');
    relHref = handleFragmentCommand(mepFrag, a);
    if (!relHref) return;
  }

  if (a.href?.includes('#_inline')) {
    inline = true;
    a.href = a.href.replace('#_inline', '');
    relHref = relHref.replace('#_inline', '');
  }

  if (isCircularRef(relHref)) {
    window.lana?.log(`ERROR: Fragment Circular Reference loading ${a.href}`);
    return;
  }

  let resourcePath = a.href;
  const isFederalFragment = a.href.includes('/federal/');
  if (isFederalFragment) {
    const { getFederatedUrl } = await import('../../utils/utils.js');
    resourcePath = getFederatedUrl(a.href);
  }

  const lingoModule = a.dataset.mepLingo
    ? await import('../../features/mep/lingo.js')
    : null;

  const { country, localeCode, matchingRegion } = lingoModule?.getMepLingoContext(locale)
    ?? { country: null, localeCode: null, matchingRegion: null };
  const shouldFetchMepLingo = !!(
    a.dataset.mepLingo && matchingRegion && country && resourcePath && localeCode
  );

  // Helper to remove mep-lingo row from a container
  const removeMepLingoRow = (container) => {
    const rows = container?.querySelectorAll(':scope > div');
    const mepLingoRow = [...rows || []].find((row) => {
      const firstCell = row.children[0];
      return firstCell?.textContent?.toLowerCase().trim() === 'mep-lingo';
    });
    mepLingoRow?.remove();
  };

  // Handle section swap (anchor is inside section-metadata)
  const isSectionSwap = !!a.dataset.mepLingoSectionSwap;

  const originalSection = isSectionSwap ? a.closest('.section') : null;

  // Handle block swap (anchor is still inside block)
  const isBlockSwap = !!a.dataset.mepLingoBlockSwap;
  let originalBlock;

  if (isBlockSwap) {
    const blockName = a.dataset.mepLingoBlockSwap;
    originalBlock = a.closest(`.${blockName}`);

    if (originalBlock) {
      const wrapper = createTag('div', null, a);
      originalBlock.insertAdjacentElement('afterend', wrapper);
      if (blockName === 'mep-lingo') originalBlock.remove();
    }
  }

  let resp;
  let mepLingoPath;
  let usedMepLingo = false;
  let usedFallback = false;

  if (shouldFetchMepLingo && matchingRegion?.prefix) {
    mepLingoPath = locale.prefix
      ? resourcePath.replace(locale.prefix, matchingRegion.prefix)
      : resourcePath.replace(/^(https?:\/\/[^/]+)/, `$1${matchingRegion.prefix}`);

    const section = a.closest('.section[data-idx]');
    const isLcp = section?.dataset.idx === '0';

    // const skipQueryIndex = isFederalFragment;
    // TODO change this for PROD
    const skipQueryIndex = true;
    const qiResult = skipQueryIndex
      ? { resolved: false, paths: [], available: false }
      : await lingoModule.getQueryIndexPaths(matchingRegion.prefix, isLcp);
    const qiResolved = qiResult.resolved !== false;
    const qiAvailable = qiResult.available;
    const mepLingoPathname = new URL(mepLingoPath).pathname;
    const mepLingoPathnameNoExt = mepLingoPathname.replace(/\.html$/, '');
    const mepLingoInIndex = qiResult.paths?.length > 0
      && qiResult.paths.includes(mepLingoPathnameNoExt);

    if (isSectionSwap) {
      const shouldTryMepLingo = !qiAvailable || mepLingoInIndex;
      if (!shouldTryMepLingo) {
        // No regional content - keep original section but clean up mep-lingo row
        a.parentElement?.remove();
        removeMepLingoRow(originalSection?.querySelector('.section-metadata'));
        return;
      }

      const mepLingoResp = await lingoModule.fetchFragment(mepLingoPath);
      if (!mepLingoResp?.ok) {
        // Fetch failed - keep original section but clean up mep-lingo row
        a.parentElement?.remove();
        removeMepLingoRow(originalSection?.querySelector('.section-metadata'));
        return;
      }

      resp = mepLingoResp;
      usedMepLingo = true;
      relHref = await localizeLinkAsync(mepLingoPath);
    }

    if (isBlockSwap) {
      // If query-index unavailable (including federal with no index yet), try anyway
      const shouldTryMepLingo = !qiAvailable || mepLingoInIndex;
      if (!shouldTryMepLingo) {
        // No regional content - keep original block but clean up mep-lingo row
        a.parentElement?.remove();
        removeMepLingoRow(originalBlock);
        return;
      }

      const mepLingoResp = await lingoModule.fetchFragment(mepLingoPath);
      if (!mepLingoResp?.ok) {
        // Fetch failed - keep original block but clean up mep-lingo row
        a.parentElement?.remove();
        removeMepLingoRow(originalBlock);
        return;
      }

      resp = mepLingoResp;
      usedMepLingo = true;
      relHref = await localizeLinkAsync(mepLingoPath);
    }

    if (!isBlockSwap && !isSectionSwap) {
      let result;
      const useQueryIndex = qiResolved && qiAvailable;
      if (useQueryIndex && !mepLingoInIndex) {
        const fallbackResp = await lingoModule.fetchFragment(resourcePath);
        if (fallbackResp?.ok) result = { resp: fallbackResp, usedFallback: true };
      } else {
        // TODO call the fragment first. It should pretty much always exist,
        // so no need to fetch fallback unless this is a LCP fragment.
        result = await lingoModule.fetchMepLingo(mepLingoPath, resourcePath);
        if (isLcp && !isFederalFragment) {
          const opts = { tags: 'mep-lingo,lcp-no-qi', sampleRate: 10 };
          window.lana?.log(`mep-lingo: LCP parallel fetch (QI not ready): ${mepLingoPathname}`, opts);
        }
      }

      if (result?.resp) {
        resp = result.resp;
        usedMepLingo = result.usedMepLingo || false;
        usedFallback = result.usedFallback || false;
        if (usedMepLingo) relHref = await localizeLinkAsync(mepLingoPath);
      }

      if (mepLingoInIndex && usedFallback) {
        const opts = { tags: 'mep-lingo,qi-stale' };
        window.lana?.log(`mep-lingo: path in QI but fetch failed: ${mepLingoPathname}`, opts);
      }
      if (!mepLingoInIndex && usedMepLingo) {
        const opts = { tags: 'mep-lingo,qi-lag', sampleRate: 10 };
        window.lana?.log(`mep-lingo: path not in QI but exists: ${mepLingoPathname}`, opts);
      }
    }
  } else if (!shouldFetchMepLingo && isBlockSwap) {
    const blockName = a.dataset.mepLingoBlockSwap;
    if (blockName === 'mep-lingo') {
      resp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
        .catch(() => ({}));
    } else {
      // TODO: When on a regional page directly (e.g., /ar), shouldFetchMepLingo is false
      // because locale.regions is undefined (regions are defined on base locales only).
      // Current behavior: keeps original block but leaves mep-lingo row visible (bug).
      // Options: 1) Call removeMepLingoRow(originalBlock) before returning
      //          2) Add logic to swap in the regional fragment even when on regional page
      a.parentElement.remove();
      return;
    }
  } else {
    resp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
      .catch(() => ({}));
  }

  if (!resp?.ok) {
    const message = shouldFetchMepLingo
      ? `Could not get mep-lingo fragments: ${mepLingoPath}.plain.html or ${resourcePath}.plain.html`
      : `Could not get fragment: ${resourcePath}.plain.html`;
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
  if (usedMepLingo) {
    fragmentAttrs['data-mep-lingo-roc'] = relHref;
  } else if (usedFallback) {
    fragmentAttrs['data-mep-lingo-fallback'] = relHref;
  }

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
    await insertInlineFrag(sections, a, relHref, fragment);
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
