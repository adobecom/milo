import "./chunk-NE6SFPCS.js";

// ../features/richresults.js
function getRichResultsForArticle(type, getMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headLine: getMetadata("og:title"),
    image: getMetadata("og:image"),
    description: getMetadata("description"),
    datePublished: getMetadata("published"),
    dateModified: getMetadata("modified"),
    author: {
      "@type": "Person",
      name: getMetadata("authorname"),
      url: getMetadata("authorurl")
    }
  };
}
function getRichResultsForSiteSearchBox(getMetadata) {
  const SEARCH_TERM_STRING = "search_term_string";
  const urlTemplate = `${getMetadata("search-url")}?${getMetadata("search-parameter-name")}={${SEARCH_TERM_STRING}}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: getMetadata("url"),
    potentialAction: [{
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate
      },
      "query-input": `required name=${SEARCH_TERM_STRING}`
    }]
  };
}
function getRichResultsForOrgLogo(getMetadata) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    url: getMetadata("orgurl"),
    logo: getMetadata("orglogo")
  };
}
function getRichResults(type, getMetadata) {
  switch (type) {
    case "Article":
    case "NewsArticle":
      return getRichResultsForArticle(type, getMetadata);
    case "SiteSearchBox":
      return getRichResultsForSiteSearchBox(getMetadata);
    case "Organization":
      return getRichResultsForOrgLogo(getMetadata);
    default:
      console.error(`Type ${type} is not supported`);
      return null;
  }
}
function addToDom(richResults, createTag) {
  if (!richResults) {
    return;
  }
  const script = createTag("script", { type: "application/ld+json" }, JSON.stringify(richResults));
  document.head.append(script);
}
function addRichResults(type, { createTag, getMetadata }) {
  const richResults = getRichResults(type, getMetadata);
  addToDom(richResults, createTag);
}
export {
  addRichResults as default
};
//# sourceMappingURL=richresults-GAU5FOJP.js.map
