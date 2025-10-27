/* eslint-disable max-classes-per-file */
import { createTag, getConfig, loadArea, localizeLink, customFetch } from '../../utils/utils.js';

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

const updateFragMap = (fragment, a, href) => {
  const fragLinks = [...fragment.querySelectorAll('a')]
    .filter((link) => localizeLink(link.href).includes('/fragments/'));
  if (!fragLinks.length) return;

  if (document.body.contains(a) && !a.parentElement?.closest('.fragment')) {
    // eslint-disable-next-line no-use-before-define
    fragMap[href] = new Tree(href);
    fragLinks.forEach((link) => fragMap[href].insert(href, localizeLink(removeHash(link.href))));
  } else {
    Object.values(fragMap).forEach((tree) => {
      const hrefNode = tree.find(href);
      if (!hrefNode) return;

      fragLinks.forEach((link) => {
        const localizedHref = localizeLink(removeHash(link.href));
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
  const { decorateArea, mep, placeholders, locale } = getConfig();
  let relHref = localizeLink(a.href);
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
  const country = urlSearchParams.get('akamaiLocale')?.toLowerCase()
    || sessionStorage.getItem('akamai') || window.performance?.getEntriesByType('navigation')?.[0]?.serverTiming
    ?.find((timing) => timing?.name === 'geo')?.description?.toLowerCase();

  const prefixParts = locale.prefix.split('/').filter((part) => part);
  const localeCode = (prefixParts[0] === 'langstore' || prefixParts[0] === 'target-preview')
    ? prefixParts[1]
    : prefixParts[0];

  const isLingoLocale = urlSearchParams?.get('lingoLocale') === 'on';
  const mepLingoFragSwap = !!(isLingoLocale
    && a.dataset.roc
    && Object.keys(locale?.regions || {})?.length
    && locale.prefix
    && country
    && resourcePath
    && localeCode
    && locale.regions?.[`${localeCode}/${country}`]);

  // *** site structure for English sites not finalized yet ***
  // will need to update this when we have a final structure
  let resp;
  let rocResourcePath;
  // let lingoOutcome;
  let usedRocPath = false;
  let usedFallbackPath = false;
  const isBlockSwap = !!a.dataset.mepLingoBlockFragment;
  if (mepLingoFragSwap) {
    rocResourcePath = resourcePath.replace(locale.prefix, `${locale.prefix}/${country}`);
    const [rocResp, fallbackResp] = await Promise.all([
      customFetch({ resource: `${rocResourcePath}.plain.html`, withCacheRules: true })
        .catch(() => ({})),
      customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true })
        .catch(() => ({})),
    ]);

    if (rocResp?.ok) {
      usedRocPath = true;
      // lingoOutcome = `roc: ${locale.prefix}/${country}`;
      if (a.dataset.mepLingoBlockFragment) {
        a?.parentElement?.previousElementSibling.remove(); // confirm that this isn't too brittle
      }
      if (a.dataset.mepLingoSectionMetadata) {
        const section = a.parentElement.parentElement;
        a.parentElement.dataset.mepLingoNewBlock = true;
        section.style = '';
        if (section.childElementCount > 1) {
          [...section.children].forEach((child) => {
            if (!child.dataset.mepLingoNewBlock) child.remove();
          });
        }
      }
    } else if (fallbackResp?.ok) {
      usedFallbackPath = true;
    }
    // TODO: remove lingoOutcome if I don't need for logging/tracking
      // lingoOutcome = `fallback: ${locale.prefix}`;
    // } else {
      // lingoOutcome = 'failed';
    // }

    resp = rocResp?.ok ? rocResp : fallbackResp;
    if (rocResp?.ok) relHref = localizeLink(rocResourcePath);
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

  updateFragMap(fragment, a, relHref);
  if (a.dataset.manifestId
    || a.dataset.adobeTargetTestid
    || mep?.commands?.length
    || placeholders) {
    const { updateFragDataProps, handleCommands, replacePlaceholders } = await import('../../features/personalization/personalization.js');
    if (a.dataset.manifestId || a.dataset.adobeTargetTestid) {
      updateFragDataProps(a, inline, sections, fragment);
    }
    if (mep?.commands?.length) handleCommands(mep?.commands, fragment, false, true);
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
