/* eslint-disable max-classes-per-file */
import {
  createTag, getConfig, loadArea, localizeLink, localizeLinkAsync, customFetch, queryIndexes,
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

/* ROC (Region-Optimized Content): Serves region-specific fragments based on user location */

const fetchFragment = (path) => customFetch({ resource: `${path}.plain.html`, withCacheRules: true })
  .catch(() => ({}));

const fetchRocThenFallback = async (rocPath, fallbackPath) => {
  const rocResp = await fetchFragment(rocPath);
  if (rocResp?.ok) return { resp: rocResp, usedRoc: true };
  const fallbackResp = await fetchFragment(fallbackPath);
  if (fallbackResp?.ok) return { resp: fallbackResp, usedFallback: true };
  return {};
};

const fetchRocParallel = async (rocPath, fallbackPath) => {
  const [rocResp, fallbackResp] = await Promise.all([
    fetchFragment(rocPath),
    fetchFragment(fallbackPath),
  ]);
  if (rocResp?.ok) return { resp: rocResp, usedRoc: true };
  if (fallbackResp?.ok) return { resp: fallbackResp, usedFallback: true };
  return {};
};

async function getQueryIndexPaths(prefix, checkImmediate = false) {
  const unavailable = { resolved: false, paths: [], available: false };
  try {
    const config = getConfig();
    const imsClientId = config?.imsClientId ?? '';
    const clientIndex = queryIndexes?.[imsClientId];

    if (!clientIndex) return checkImmediate ? unavailable : { paths: [], available: false };

    if (checkImmediate) {
      if (!clientIndex.requestResolved) return unavailable;
      const paths = await clientIndex.pathsRequest;
      return { resolved: true, paths: Array.isArray(paths) ? paths : [], available: true };
    }

    const paths = await clientIndex.pathsRequest;
    return { paths: Array.isArray(paths) ? paths : [], available: true };
  } catch (e) {
    window.lana?.log(`Query index error for ${prefix}:`, e);
    return checkImmediate ? unavailable : { paths: [], available: false };
  }
}

function getRocContext(locale) {
  const urlParams = new URLSearchParams(window.location.search);
  const country = urlParams.get('akamaiLocale')?.toLowerCase()
    || sessionStorage.getItem('akamai')
    || window.performance?.getEntriesByType('navigation')?.[0]?.serverTiming
      ?.find((t) => t?.name === 'geo')?.description?.toLowerCase();

  const prefixParts = locale.prefix.split('/').filter(Boolean);
  const [firstPart, secondPart] = prefixParts;
  const hasSpecialPrefix = firstPart === 'langstore' || firstPart === 'target-preview';

  let localeCode;
  if (prefixParts.length === 0 || (hasSpecialPrefix && !secondPart)) {
    localeCode = locale.region === 'us' ? 'en' : locale.language || 'en';
  } else if (hasSpecialPrefix) {
    localeCode = secondPart;
  } else {
    localeCode = firstPart;
  }

  let regionKey = `${country}_${localeCode}`;
  let matchingRegion = locale?.regions?.[regionKey];
  if (!matchingRegion && locale?.regions?.[country]) {
    regionKey = country;
    matchingRegion = locale.regions[country];
  }

  return { country, localeCode, regionKey, matchingRegion };
}

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
  if (a.href.includes('/federal/')) {
    const { getFederatedUrl } = await import('../../utils/utils.js');
    resourcePath = getFederatedUrl(a.href);
  }

  const { country, localeCode, matchingRegion } = getRocContext(locale);
  const rocEnabled = !!(a.dataset.roc && matchingRegion && country && resourcePath && localeCode);
  const isBlockSwap = !!a.dataset.mepLingoBlockFragment;

  let resp;
  let rocPath;
  let usedRoc = false;
  let usedFallback = false;

  if (rocEnabled && matchingRegion?.prefix) {
    rocPath = locale.prefix
      ? resourcePath.replace(locale.prefix, matchingRegion.prefix)
      : resourcePath.replace(/^(https?:\/\/[^/]+)/, `$1${matchingRegion.prefix}`);

    const section = a.closest('.section[data-idx]');
    const isLcp = section?.dataset.idx === '0';
    const qiResult = await getQueryIndexPaths(matchingRegion.prefix, isLcp);
    const qiResolved = qiResult.resolved !== false;
    // *******TODO: revert to qiAvailable when ready to check against query index****
    // const qiAvailable = qiResult.available;
    const qiAvailable = false;
    const rocPathname = new URL(rocPath).pathname;
    const rocInIndex = qiResult.paths?.length > 0 && qiResult.paths.includes(rocPathname);

    if (isBlockSwap) {
      const shouldTryRoc = !qiAvailable || rocInIndex;
      if (!shouldTryRoc) { a.parentElement.remove(); return; }

      const rocResp = await fetchFragment(rocPath);
      if (!rocResp?.ok) { a.parentElement.remove(); return; }

      resp = rocResp;
      usedRoc = true;
      relHref = localizeLink(rocPath);

      if (a.dataset.mepLingoSectionMetadata) {
        const sectionEl = a.closest('.section');
        if (sectionEl) {
          a.parentElement.dataset.mepRocSectionContent = true;
          sectionEl.style = '';
          [...sectionEl.children].forEach((child) => {
            if (!child.dataset.mepRocSectionContent) child.remove();
          });
        }
      } else {
        a.dataset.removeOriginalBlock = true;
      }
    }

    if (!isBlockSwap) {
      let result;
      const useQueryIndex = qiResolved && qiAvailable;

      if (useQueryIndex && rocInIndex) {
        result = await fetchRocThenFallback(rocPath, resourcePath);
      } else if (useQueryIndex && !rocInIndex) {
        const fallbackResp = await fetchFragment(resourcePath);
        if (fallbackResp?.ok) result = { resp: fallbackResp, usedFallback: true };
      } else {
        result = await fetchRocParallel(rocPath, resourcePath);
      }

      if (result?.resp) {
        resp = result.resp;
        usedRoc = result.usedRoc || false;
        usedFallback = result.usedFallback || false;
        if (usedRoc) relHref = localizeLink(rocPath);
      }
    }
  } else if (!rocEnabled && isBlockSwap) {
    a.parentElement.remove();
  } else {
    resp = await fetchFragment(resourcePath);
  }

  if (!resp?.ok) {
    const message = rocEnabled
      ? `Could not get ROC fragments: ${rocPath}.plain.html or ${resourcePath}.plain.html`
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
  if (usedRoc) {
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
    await insertInlineFrag(sections, a, relHref, mep);
  } else {
    a.parentElement.replaceChild(fragment, a);

    if (a.dataset.removeOriginalBlock && a.dataset.originalBlockId) {
      const originalBlock = document.querySelector(`[data-roc-original-block="${a.dataset.originalBlockId}"]`);
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
