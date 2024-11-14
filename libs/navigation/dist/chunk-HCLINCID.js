import {
  getMetadata
} from "./chunk-ZEVYWJU7.js";

// ../features/dynamic-navigation/dynamic-navigation.js
function foundDisableValues() {
  const dynamicNavDisableValues = getMetadata("dynamic-nav-disable");
  if (!dynamicNavDisableValues) return false;
  const metadataPairsMap = dynamicNavDisableValues.split(",").map((pair) => pair.split(";"));
  const foundValues = metadataPairsMap.filter(([metadataKey, metadataContent]) => {
    const metaTagContent = getMetadata(metadataKey.toLowerCase());
    return metaTagContent && metaTagContent.toLowerCase() === metadataContent.toLowerCase();
  });
  return foundValues.length ? foundValues : false;
}
function dynamicNav(url, key) {
  if (foundDisableValues()) return url;
  const metadataContent = getMetadata("dynamic-nav");
  if (metadataContent === "entry") {
    window.sessionStorage.setItem("gnavSource", url);
    window.sessionStorage.setItem("dynamicNavKey", key);
    return url;
  }
  if (metadataContent !== "on" || key !== window.sessionStorage.getItem("dynamicNavKey")) return url;
  return window.sessionStorage.getItem("gnavSource") || url;
}

export {
  foundDisableValues,
  dynamicNav
};
//# sourceMappingURL=chunk-HCLINCID.js.map
