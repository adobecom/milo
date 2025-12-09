/* eslint-disable max-classes-per-file */
import { createTag, getConfig, loadArea, localizeLinkAsync, customFetch } from '../../utils/utils.js';
import { getMepLingoContext, getQueryIndexPaths, fetchMepLingoThenFallback, fetchMepLingoParallel } from '../../features/mep/lingo.js';

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
    allLinks.map((link) => localizeLinkAsync(removeHash(link.href))),
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

const fetchFragment = (path) => customFetch({ resource: `${path}.plain.html`, withCacheRules: true })
  .catch(() => ({}));

export default async function init(a) {
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
  const isFederalFragment = a.href.includes('/federal/');
  if (isFederalFragment) {
    const { getFederatedUrl } = await import('../../utils/utils.js');
    resourcePath = getFederatedUrl(a.href);
  }

  const { country, localeCode, matchingRegion } = getMepLingoContext(locale);
  const mepLingoEnabled = !!(
    a.dataset.mepLingo && matchingRegion && country && resourcePath && localeCode
  );
  const isBlockSwap = !!a.dataset.mepLingoBlockFragment;

  let resp;
  let mepLingoPath;
  let usedMepLingo = false;
  let usedFallback = false;

  if (mepLingoEnabled && matchingRegion?.prefix) {
    mepLingoPath = locale.prefix
      ? resourcePath.replace(locale.prefix, matchingRegion.prefix)
      : resourcePath.replace(/^(https?:\/\/[^/]+)/, `$1${matchingRegion.prefix}`);

    const section = a.closest('.section[data-idx]');
    const isLcp = section?.dataset.idx === '0';

    // TODO: Enable federal query-index once it's implemented and tested
    // For now, force parallel fetch for federal fragments to avoid issues
    const skipQueryIndex = isFederalFragment;
    const qiResult = skipQueryIndex
      ? { resolved: false, paths: [], available: false }
      : await getQueryIndexPaths(matchingRegion.prefix, isLcp);
    const qiResolved = qiResult.resolved !== false;
    const qiAvailable = qiResult.available;
    const mepLingoPathname = new URL(mepLingoPath).pathname;
    const mepLingoInIndex = qiResult.paths?.length > 0 && qiResult.paths.includes(mepLingoPathname);

    if (isBlockSwap) {
      // If query-index unavailable (including federal with no index yet), try anyway
      const shouldTryMepLingo = !qiAvailable || mepLingoInIndex;
      if (!shouldTryMepLingo) { a.parentElement.remove(); return; }

      const mepLingoResp = await fetchFragment(mepLingoPath);
      if (!mepLingoResp?.ok) { a.parentElement.remove(); return; }

      resp = mepLingoResp;
      usedMepLingo = true;
      relHref = await localizeLinkAsync(mepLingoPath);

      if (a.dataset.mepLingoSectionMetadata) {
        const sectionEl = a.closest('.section');
        if (sectionEl) {
          a.parentElement.dataset.mepLingoSectionContent = true;
          sectionEl.style = '';
          [...sectionEl.children].forEach((child) => {
            if (!child.dataset.mepLingoSectionContent) child.remove();
          });
        }
      } else {
        a.dataset.removeOriginalBlock = true;
      }
    }

    if (!isBlockSwap) {
      let result;
      const useQueryIndex = qiResolved && qiAvailable;

      // NOTE: This optimization relies on query-index being available. Currently blocked by
      // -preview suffix issue: da-bacom (and likely others) only publish query-index.json,
      // not query-index-preview.json. See TODO in loadQueryIndexes. Until resolved,
      // useQueryIndex may be false, falling through to parallel fetch.
      if (useQueryIndex && mepLingoInIndex) {
        // Path confirmed in index → fetch mep-lingo first, fallback if needed
        result = await fetchMepLingoThenFallback(mepLingoPath, resourcePath);
      } else if (useQueryIndex && !mepLingoInIndex) {
        // Path NOT in index → only fetch fallback (optimization: skip non-existent path)
        const fallbackResp = await fetchFragment(resourcePath);
        if (fallbackResp?.ok) result = { resp: fallbackResp, usedFallback: true };
      } else {
        // No index available → parallel fetch (safety net)
        result = await fetchMepLingoParallel(mepLingoPath, resourcePath);
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

      // Log QI mismatches for monitoring
      if (mepLingoInIndex && usedFallback) {
        const opts = { tags: 'mep-lingo,qi-stale' };
        window.lana?.log(`mep-lingo: path in QI but fetch failed: ${mepLingoPathname}`, opts);
      }
      if (!mepLingoInIndex && usedMepLingo) {
        const opts = { tags: 'mep-lingo,qi-lag', sampleRate: 10 };
        window.lana?.log(`mep-lingo: path not in QI but exists: ${mepLingoPathname}`, opts);
      }
    }
  } else if (!mepLingoEnabled && isBlockSwap) {
    a.parentElement.remove();
  } else {
    resp = await fetchFragment(resourcePath);
  }

  if (!resp?.ok) {
    const message = mepLingoEnabled
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
  } else {
    a.parentElement.replaceChild(fragment, a);

    if (a.dataset.removeOriginalBlock && a.dataset.originalBlockId) {
      const originalBlock = document.querySelector(`[data-mep-lingo-original-block="${a.dataset.originalBlockId}"]`);
      if (originalBlock) originalBlock.remove();
    }

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
