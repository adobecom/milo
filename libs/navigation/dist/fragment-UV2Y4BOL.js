import {
  createTag,
  customFetch,
  getConfig,
  loadArea,
  localizeLink
} from "./chunk-G4SXHKM5.js";
import "./chunk-NE6SFPCS.js";

// ../blocks/fragment/fragment.js
var fragMap = {};
var removeHash = (url) => {
  const urlNoHash = url.split("#")[0];
  return url.includes("#_dnt") ? `${urlNoHash}#_dnt` : urlNoHash;
};
var isCircularRef = (href) => [...Object.values(fragMap)].some((tree) => {
  const node = tree.find(href);
  return node?.isRecursive;
});
var updateFragMap = (fragment, a, href) => {
  const fragLinks = [...fragment.querySelectorAll("a")].filter((link) => localizeLink(link.href).includes("/fragments/"));
  if (!fragLinks.length) return;
  if (document.body.contains(a) && !a.parentElement?.closest(".fragment")) {
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
var insertInlineFrag = (sections, a, relHref, mep, handleMepCommands) => {
  const fragChildren = [...sections[0].children];
  if (a.parentElement.nodeName === "DIV" && !a.parentElement.attributes.length) {
    a.parentElement.replaceWith(...fragChildren);
  } else {
    a.replaceWith(...fragChildren);
  }
  fragChildren.forEach((child) => {
    child.setAttribute("data-path", relHref);
    if (handleMepCommands) mep.commands = handleMepCommands(mep.commands, child);
  });
};
function replaceDotMedia(path, doc) {
  const resetAttributeBase = (tag, attr) => {
    doc.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((el) => {
      el[attr] = new URL(el.getAttribute(attr), new URL(path, window.location)).href;
    });
  };
  resetAttributeBase("img", "src");
  resetAttributeBase("source", "srcset");
}
async function init(a) {
  const { decorateArea, mep } = getConfig();
  let relHref = localizeLink(a.href);
  let inline = false;
  if (a.parentElement?.nodeName === "P") {
    const children = a.parentElement.childNodes;
    const div = createTag("div");
    for (const attr of a.parentElement.attributes) div.setAttribute(attr.name, attr.value);
    a.parentElement.replaceWith(div);
    div.append(...children);
  }
  if (a.href.includes("#_inline")) {
    inline = true;
    a.href = a.href.replace("#_inline", "");
    relHref = relHref.replace("#_inline", "");
  }
  const path = new URL(a.href).pathname;
  if (mep?.fragments?.[path]) {
    const { handleFragmentCommand } = await import("./personalization-ON6N7TPG.js");
    relHref = handleFragmentCommand(mep?.fragments[path], a);
    if (!relHref) return;
  }
  if (isCircularRef(relHref)) {
    window.lana?.log(`ERROR: Fragment Circular Reference loading ${a.href}`);
    return;
  }
  let resourcePath = a.href;
  if (a.href.includes("/federal/")) {
    const { getFederatedUrl } = await import("./federated-GKQGROBN.js");
    resourcePath = getFederatedUrl(a.href);
  }
  const resp = await customFetch({ resource: `${resourcePath}.plain.html`, withCacheRules: true }).catch(() => ({}));
  if (!resp?.ok) {
    window.lana?.log(`Could not get fragment: ${resourcePath}.plain.html`);
    return;
  }
  const html = await resp.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  replaceDotMedia(a.href, doc);
  if (decorateArea) decorateArea(doc, { fragmentLink: a });
  const sections = doc.querySelectorAll("body > div");
  if (!sections.length) {
    window.lana?.log(`Could not make fragment: ${resourcePath}.plain.html`);
    return;
  }
  const fragment = createTag("div", { class: "fragment", "data-path": relHref });
  if (!inline) {
    fragment.append(...sections);
  }
  updateFragMap(fragment, a, relHref);
  if (a.dataset.manifestId || a.dataset.adobeTargetTestid) {
    const { updateFragDataProps } = await import("./personalization-ON6N7TPG.js");
    updateFragDataProps(a, inline, sections, fragment);
  }
  let handleMepCommands = false;
  if (mep?.commands?.length) {
    const { handleCommands } = await import("./personalization-ON6N7TPG.js");
    handleMepCommands = handleCommands;
  }
  if (inline) {
    insertInlineFrag(sections, a, relHref, mep, handleMepCommands);
  } else {
    a.parentElement.replaceChild(fragment, a);
    if (handleMepCommands) handleMepCommands(mep?.commands, fragment);
    await loadArea(fragment);
  }
}
var Node = class _Node {
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
      this.children.push(new _Node(key, value, this));
    }
  }
  findParent(key) {
    if (this.parent?.key === key) return this.parent;
    return this.parent?.findParent(key);
  }
};
var Tree = class {
  constructor(key, value = key) {
    this.root = new Node(key, value);
  }
  *traverse(node = this.root) {
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
        node.children.push(new Node(key, value, node));
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
    return void 0;
  }
};
export {
  Tree,
  init as default
};
//# sourceMappingURL=fragment-UV2Y4BOL.js.map
