import "./chunk-NE6SFPCS.js";

// ../features/icons/icons.js
var fetchedIcons;
var fetched = false;
async function getSVGsfromFile(path) {
  if (!path) return null;
  const resp = await fetch(path);
  if (!resp.ok) return null;
  const miloIcons = {};
  const text = await resp.text();
  const parser = new DOMParser();
  const parsedText = parser.parseFromString(text, "image/svg+xml");
  const symbols = parsedText.querySelectorAll("symbol");
  symbols.forEach((symbol) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    while (symbol.firstChild) svg.appendChild(symbol.firstChild);
    [...symbol.attributes].forEach((attr) => svg.attributes.setNamedItem(attr.cloneNode()));
    svg.classList.add("icon-milo", `icon-milo-${svg.id}`);
    miloIcons[svg.id] = svg;
  });
  return miloIcons;
}
var fetchIcons = (config) => new Promise(async (resolve) => {
  if (!fetched) {
    const { miloLibs, codeRoot } = config;
    const base = miloLibs || codeRoot;
    fetchedIcons = await getSVGsfromFile(`${base}/img/icons/icons.svg`);
    fetched = true;
  }
  resolve(fetchedIcons);
});
function decorateToolTip(icon) {
  const wrapper = icon.closest("em");
  wrapper.className = "tooltip-wrapper";
  if (!wrapper) return;
  const conf = wrapper.textContent.split("|");
  const content = conf.pop().trim();
  if (!content) return;
  icon.dataset.tooltip = content;
  const place = conf.pop()?.trim().toLowerCase() || "right";
  icon.className = `icon icon-info milo-tooltip ${place}`;
  wrapper.parentElement.replaceChild(icon, wrapper);
}
async function loadIcons(icons, config) {
  const iconSVGs = await fetchIcons(config);
  if (!iconSVGs) return;
  icons.forEach(async (icon) => {
    const { classList } = icon;
    if (classList.contains("icon-tooltip")) decorateToolTip(icon);
    const iconName = icon.classList[1].replace("icon-", "");
    const existingIcon = icon.querySelector("svg");
    if (!iconSVGs[iconName] || existingIcon) return;
    const parent = icon.parentElement;
    if (parent.childNodes.length > 1) {
      if (parent.lastChild === icon) {
        icon.classList.add("margin-inline-start");
      } else if (parent.firstChild === icon) {
        icon.classList.add("margin-inline-end");
        if (parent.parentElement.tagName === "LI") parent.parentElement.classList.add("icon-list-item");
      } else {
        icon.classList.add("margin-inline-start", "margin-inline-end");
      }
    }
    icon.insertAdjacentHTML("afterbegin", iconSVGs[iconName].outerHTML);
  });
}
export {
  loadIcons as default,
  fetchIcons
};
//# sourceMappingURL=icons-2SSTIN6G.js.map
