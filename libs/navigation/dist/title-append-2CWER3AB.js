import "./chunk-NE6SFPCS.js";

// ../features/title-append/title-append.js
function titleAppend(appendage) {
  if (!appendage) return;
  document.title = `${document.title} ${appendage}`;
  const ogTitleEl = document.querySelector('meta[property="og:title"]');
  if (ogTitleEl) ogTitleEl.setAttribute("content", document.title);
  const twitterTitleEl = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitleEl) twitterTitleEl.setAttribute("content", document.title);
}
export {
  titleAppend as default
};
//# sourceMappingURL=title-append-2CWER3AB.js.map
