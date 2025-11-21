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

// Helper to get query index paths for a specific prefix
// If checkImmediate=true, uses Promise.race to check if already resolved
// Returns: { resolved: boolean, paths: array, available: boolean }
//   - resolved: Promise is resolved (checkImmediate only)
//   - paths: Array of paths from query index
//   - available: Query index was successfully loaded (not error/unavailable)
async function getQueryIndexPaths(prefix, checkImmediate = false) {
  try {
    const config = getConfig();
    if (!config) {
      return checkImmediate
        ? { resolved: false, paths: [], available: false }
        : { paths: [], available: false };
    }

    const imsClientId = config.imsClientId ?? '';

    // Check if query indexes are loaded for this client
    if (!queryIndexes || !queryIndexes[imsClientId]) {
      // Query indexes not loaded yet or not available
      return checkImmediate
        ? { resolved: false, paths: [], available: false }
        : { paths: [], available: false };
    }

    if (checkImmediate) {
      // Race the Promise against an immediate resolution to check if already resolved
      const result = await Promise.race([
        queryIndexes[imsClientId].pathsRequest
          .then((paths) => ({
            resolved: true,
            paths: Array.isArray(paths) ? paths : [],
            available: true,
          })),
        Promise.resolve({ resolved: false, paths: [], available: false }),
      ]);
      return result;
    }

    // Normal await (for non-LCP)
    const paths = await queryIndexes[imsClientId].pathsRequest;
    return {
      paths: Array.isArray(paths) ? paths : [],
      available: true,
    };
  } catch (e) {
    // Silently fail and allow normal fetch behavior
    window.lana?.log(`Query index not available for ${prefix}, falling back to normal fetch:`, e);
    return checkImmediate
      ? { resolved: false, paths: [], available: false }
      : { paths: [], available: false };
  }
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

  const urlSearchParams = new URLSearchParams(window.location.search);
  // TODO: confirm what the final country decision should include
  const country = urlSearchParams.get('akamaiLocale')?.toLowerCase()
    || sessionStorage.getItem('akamai') || window.performance?.getEntriesByType('navigation')?.[0]?.serverTiming
    ?.find((timing) => timing?.name === 'geo')?.description?.toLowerCase();

  const prefixParts = locale.prefix.split('/').filter((part) => part);
  const localeCode = (prefixParts[0] === 'langstore' || prefixParts[0] === 'target-preview')
    ? prefixParts[1]
    : prefixParts[0];

  // Current correct format: country_localeCode (e.g., ch_de)
  // let regionKey = `${country}_${localeCode}`;

  // Old incorrect format for testing (uncomment to test with wrong structure):
  // TODO: REVERT THIS TEMP CHANGE for ch_de!!!!!
  // For temporary Milo page testing only!!
  let regionKey = `${localeCode}/${country}`;

  let matchingRegion = locale?.regions?.[regionKey];
  if (!matchingRegion && locale?.regions?.[country]) {
    regionKey = country;
    matchingRegion = locale.regions[country];
  }
  const mepLingoFragSwap = !!(a.dataset.roc
    && matchingRegion
    && locale.prefix
    && country
    && resourcePath
    && localeCode);

  // *** site structure for English sites not finalized yet ***
  // will need to update this when we have a final structure
  let resp;
  let rocResourcePath;
  // let lingoOutcome;
  let usedRocPath = false;
  let usedFallbackPath = false;
  const isBlockSwap = !!a.dataset.mepLingoBlockFragment;

  // Detect if we're in LCP section (first section with blocks)
  const section = a.closest('.section');
  const isLcpSection = section?.dataset.idx === '0'
    || (section?.parentElement?.children[0] === section && section?.querySelector('[class*="block"]'));

  if (mepLingoFragSwap && matchingRegion?.prefix) {
    rocResourcePath = resourcePath.replace(locale.prefix, matchingRegion.prefix);

    // Extract pathname for comparison
    const rocPath = new URL(rocResourcePath).pathname;

    // For LCP: check if query index is already resolved (non-blocking)
    // For non-LCP: always await query index (we have time to optimize)
    const queryIndexResult = isLcpSection
      ? await getQueryIndexPaths(matchingRegion.prefix, true)
      : await getQueryIndexPaths(matchingRegion.prefix);

    const rocQueryIndexPaths = queryIndexResult.paths || [];
    // For non-LCP, resolved is undefined (always considered resolved)
    const queryIndexResolved = queryIndexResult.resolved !== false;
    const queryIndexAvailable = queryIndexResult.available;
    const queryIndexHasData = rocQueryIndexPaths.length > 0;

    // Check if ROC path exists in query index
    // Only meaningful if query index is available
    const rocExistsInIndex = queryIndexHasData && rocQueryIndexPaths.includes(rocPath);

    if (isBlockSwap) {
      // Block swaps: try ROC unless query index explicitly says it doesn't exist
      // If query index unavailable/error: try ROC (might exist)
      // If query index available but ROC not in it: skip ROC (we know it doesn't exist)
      const shouldTryRoc = !queryIndexAvailable || rocExistsInIndex;

      if (shouldTryRoc) {
        const rocResp = await customFetch({ resource: `${rocResourcePath}.plain.html`, withCacheRules: true })
          .catch(() => ({}));

        if (rocResp?.ok) {
          usedRocPath = true;
          resp = rocResp;
          relHref = localizeLink(rocResourcePath);
          a?.parentElement?.previousElementSibling.remove(); // Remove ROC row from table

          // Special cleanup for section-metadata blocks
          if (a.dataset.mepLingoSectionMetadata) {
            const sectionEl = a.closest('.section');
            if (sectionEl) {
              a.parentElement.dataset.mepLingoNewBlock = true;
              sectionEl.style = '';
              if (sectionEl.childElementCount > 1) {
                [...sectionEl.children].forEach((child) => {
                  if (!child.dataset.mepLingoNewBlock) child.remove();
                });
              }
            }
          }
        } else {
          // ROC fetch failed, remove ROC row and keep original block
          a.parentElement.remove();
          return;
        }
      } else {
        // Query index available and ROC doesn't exist in it
        // Remove ROC row and keep original block
        a.parentElement.remove();
        return;
      }
    }

    // Regular fragments: Strategy depends on LCP vs non-LCP
    if (!isBlockSwap) {
      if (isLcpSection) {
        // LCP STRATEGY: Check if query index is already resolved AND available
        if (queryIndexResolved && queryIndexAvailable) {
          // Query index is available and loaded, use it to guide fetching
          if (rocExistsInIndex) {
            // ROC exists in index, try it first
            const rocResp = await customFetch({ resource: `${rocResourcePath}.plain.html`, withCacheRules: true })
              .catch(() => ({}));
            if (rocResp?.ok) {
              usedRocPath = true;
              resp = rocResp;
              relHref = localizeLink(rocResourcePath);
            } else {
              // ROC failed, try fallback
              const fallbackResp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
                .catch(() => ({}));
              if (fallbackResp?.ok) {
                usedFallbackPath = true;
                resp = fallbackResp;
              }
            }
          } else {
            // ROC doesn't exist in index, go straight to fallback
            const fallbackResp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
              .catch(() => ({}));
            if (fallbackResp?.ok) {
              usedFallbackPath = true;
              resp = fallbackResp;
            }
          }
        } else {
          // Query index not resolved OR unavailable, use Direct-404 approach for speed
          // Fetch both ROC and fallback in parallel
          const [rocResp, fallbackResp] = await Promise.all([
            customFetch({ resource: `${rocResourcePath}.plain.html`, withCacheRules: true })
              .catch(() => ({})),
            customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
              .catch(() => ({})),
          ]);

          if (rocResp?.ok) {
            usedRocPath = true;
            resp = rocResp;
            relHref = localizeLink(rocResourcePath);
          } else if (fallbackResp?.ok) {
            usedFallbackPath = true;
            resp = fallbackResp;
          }
        }
      }

      // NON-LCP STRATEGY: Use query index if available, otherwise fall back to 404s
      if (!isLcpSection) {
        if (queryIndexAvailable) {
          // Query index is available and loaded, use it to avoid 404s
          if (rocExistsInIndex) {
            // ROC exists in index, try it first
            const rocResp = await customFetch({ resource: `${rocResourcePath}.plain.html`, withCacheRules: true })
              .catch(() => ({}));
            if (rocResp?.ok) {
              usedRocPath = true;
              resp = rocResp;
              relHref = localizeLink(rocResourcePath);
            } else {
              // ROC failed, try fallback
              const fallbackResp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
                .catch(() => ({}));
              if (fallbackResp?.ok) {
                usedFallbackPath = true;
                resp = fallbackResp;
              }
            }
          } else {
            // ROC doesn't exist in index, go straight to fallback
            const fallbackResp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
              .catch(() => ({}));
            if (fallbackResp?.ok) {
              usedFallbackPath = true;
              resp = fallbackResp;
            }
          }
        } else {
          // Query index not available, fall back to 404s approach (try both)
          const [rocResp, fallbackResp] = await Promise.all([
            customFetch({ resource: `${rocResourcePath}.plain.html`, withCacheRules: true })
              .catch(() => ({})),
            customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
              .catch(() => ({})),
          ]);

          if (rocResp?.ok) {
            usedRocPath = true;
            resp = rocResp;
            relHref = localizeLink(rocResourcePath);
          } else if (fallbackResp?.ok) {
            usedFallbackPath = true;
            resp = fallbackResp;
          }
        }
      }
    }
  } else if (!mepLingoFragSwap && isBlockSwap) {
    a.parentElement.remove();
  } else {
    resp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
      .catch(() => ({}));
  }

  if (!resp?.ok) {
    // *** still need to decide on what we will log and/or track ***
    const message = mepLingoFragSwap
      ? `Could not get lingo locale fragments: ${resourcePath}.plain.html or ${rocResourcePath}.plain.html`
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
  if (usedRocPath) {
    fragmentAttrs['data-mep-lingo-roc'] = relHref;
  } else if (usedFallbackPath) {
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
