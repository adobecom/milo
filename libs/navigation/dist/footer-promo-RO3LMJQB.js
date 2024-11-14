import {
  decorateSectionAnalytics
} from "./chunk-LHF7GOQG.js";
import {
  createTag,
  getConfig
} from "./chunk-ZEVYWJU7.js";
import "./chunk-NE6SFPCS.js";

// ../features/footer-promo.js
async function getPromoFromTaxonomy(contentRoot, doc) {
  const NAME_KEY = "Name";
  const FOOTER_PROMO_LINK_KEY = "Footer Promo Link";
  const taxonomyUrl = `${contentRoot}/taxonomy.json`;
  const tags = [...doc.head.querySelectorAll('meta[property="article:tag"]')].map((el) => el.content);
  if (!tags.length) return void 0;
  try {
    const resp = await fetch(taxonomyUrl);
    if (!resp.ok) return void 0;
    const { data } = await resp.json();
    const primaryTag = data.find((tag) => {
      const name = tag[NAME_KEY].split("|").pop().trim();
      return tags.includes(name) && tag[FOOTER_PROMO_LINK_KEY];
    });
    if (primaryTag) return primaryTag[FOOTER_PROMO_LINK_KEY];
  } catch (error) {
    window.lana.log(`Footer Promo - Taxonomy error: ${error}`, { tags: "footer-promo", errorType: "i" });
  }
  return void 0;
}
async function initFooterPromo(footerPromoTag, footerPromoType, doc = document) {
  const config = getConfig();
  const { locale: { contentRoot } } = config;
  let href = footerPromoTag && `${contentRoot}/fragments/footer-promos/${footerPromoTag}`;
  if (footerPromoType === "taxonomy") {
    const promo = await getPromoFromTaxonomy(contentRoot, doc);
    if (promo) href = promo;
  }
  if (!href) return;
  const { default: loadFragment } = await import("./fragment-WO6WLZWW.js");
  const a = createTag("a", { href }, href);
  const div = createTag("div", null, a);
  const section = createTag("div", null, div);
  doc.querySelector("main > div:last-of-type").insertAdjacentElement("afterend", section);
  await loadFragment(a);
  section.classList.add("section");
  const sections = document.querySelectorAll("main > div");
  decorateSectionAnalytics(section, sections.length - 1, config);
}
export {
  initFooterPromo as default
};
//# sourceMappingURL=footer-promo-RO3LMJQB.js.map
