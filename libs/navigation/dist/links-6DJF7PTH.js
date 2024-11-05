import "./chunk-NE6SFPCS.js";

// ../features/links.js
var fetched = false;
var linkData = null;
var fetchSeoLinks = async (path) => {
  if (!path) return null;
  if (!fetched) {
    const resp = await fetch(path);
    if (resp.ok) {
      const json = await resp.json();
      linkData = json.data;
    }
    fetched = true;
  }
  return linkData;
};
async function init(path, area = document) {
  const seoLinks = await fetchSeoLinks(path);
  if (!seoLinks) return;
  const { origin } = window.location;
  const pageLinks = area.querySelectorAll('a:not([href^="/"])');
  [...pageLinks].forEach((link) => {
    seoLinks.filter((s) => link.href.startsWith(s.domain) || s.domain === "off-origin" && !link.href.startsWith(origin)).forEach((s) => {
      if (s.rel) link.setAttribute("rel", s.rel);
      if (s.window && !link.getAttribute("target")) link.setAttribute("target", s.window);
    });
  });
}
export {
  init as default
};
//# sourceMappingURL=links-6DJF7PTH.js.map
