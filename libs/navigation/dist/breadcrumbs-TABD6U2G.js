import {
  lanaLog,
  toFragment
} from "./chunk-I4EBDGNP.js";
import "./chunk-Z64B4EXQ.js";
import "./chunk-LHF7GOQG.js";
import {
  getFederatedUrl
} from "./chunk-EI44K5W3.js";
import {
  getConfig,
  getMetadata
} from "./chunk-ZEVYWJU7.js";
import {
  __template
} from "./chunk-NE6SFPCS.js";

// ../blocks/global-navigation/features/breadcrumbs/breadcrumbs.js
var metadata = {
  seo: "breadcrumbs-seo",
  seoLegacy: "breadcrumb-seo",
  fromFile: "breadcrumbs-from-file",
  showCurrent: "breadcrumbs-show-current-page",
  hiddenEntries: "breadcrumbs-hidden-entries",
  pageTitle: "breadcrumbs-page-title",
  base: "breadcrumbs-base",
  fromUrl: "breadcrumbs-from-url"
};
var _a;
var setBreadcrumbSEO = (breadcrumbs) => {
  const seoDisabled = (getMetadata(metadata.seo) || getMetadata(metadata.seoLegacy)) === "off";
  if (seoDisabled || !breadcrumbs) return;
  const breadcrumbsSEO = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: []
  };
  breadcrumbs.querySelectorAll("ul > li").forEach((item, idx) => {
    const link = item.querySelector("a");
    breadcrumbsSEO.itemListElement.push({
      "@type": "ListItem",
      position: idx + 1,
      name: link ? link.innerText.trim() : item.innerText.trim(),
      item: link?.href
    });
  });
  const script = toFragment(_a || (_a = __template(['<script type="application/ld+json">', "<\/script>"])), JSON.stringify(
    breadcrumbsSEO
  ));
  document.head.append(script);
};
var createBreadcrumbs = (element) => {
  if (!element) return null;
  const ul = element.querySelector("ul");
  const pageTitle = getMetadata(metadata.pageTitle);
  if (pageTitle || getMetadata(metadata.showCurrent) === "on") {
    ul.append(toFragment`
      <li>
        ${pageTitle || document.title}
      </li>
    `);
  }
  const hiddenEntries = getMetadata(metadata.hiddenEntries)?.toLowerCase().split(",").map((item) => item.trim()) || [];
  ul.querySelectorAll("li").forEach((li) => {
    if (hiddenEntries.includes(li.innerText?.toLowerCase().trim())) li.remove();
  });
  const breadcrumbs = toFragment`
    <div class="feds-breadcrumbs-wrapper">
      <nav class="feds-breadcrumbs" aria-label="Breadcrumb">${ul}</nav>
    </div>
  `;
  ul.querySelector("li:last-of-type")?.setAttribute("aria-current", "page");
  return breadcrumbs;
};
var createWithBase = async (el) => {
  const element = el || toFragment`<div><ul></ul></div>`;
  const url = getFederatedUrl(getMetadata(metadata.base));
  if (!url) return null;
  try {
    const resp = await fetch(`${url}.plain.html`);
    const text = await resp.text();
    const base = new DOMParser().parseFromString(text, "text/html").body;
    element.querySelector("ul")?.prepend(...base.querySelectorAll("li"));
    return createBreadcrumbs(element);
  } catch (e) {
    lanaLog({ e, message: "Breadcrumbs failed fetching base", tags: "errorType=info,module=gnav-breadcrumbs" });
    return null;
  }
};
var fromUrl = () => {
  if (getMetadata(metadata.fromUrl) !== "on") return null;
  const list = toFragment`<ul></ul>`;
  const paths = document.location.pathname.replace(getConfig().locale?.prefix || "", "").split("/").filter((n) => n);
  for (let i = 0; i < paths.length; i += 1) {
    list.append(toFragment`
      <li>
        <a href="/${paths.slice(0, i + 1).join("/")}">${paths[i].replaceAll("-", " ")}</a>
      </li>
    `);
  }
  return createBreadcrumbs(toFragment`<div>${list}</div>`);
};
async function init(el) {
  try {
    const breadcrumbsEl = await createWithBase(el) || createBreadcrumbs(el) || fromUrl();
    setBreadcrumbSEO(breadcrumbsEl);
    return breadcrumbsEl;
  } catch (e) {
    lanaLog({ e, message: "Breadcrumbs failed rendering", tags: "errorType=error,module=gnav-breadcrumbs" });
    return null;
  }
}
export {
  init as default
};
//# sourceMappingURL=breadcrumbs-TABD6U2G.js.map
