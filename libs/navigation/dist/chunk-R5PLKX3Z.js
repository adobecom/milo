import {
  getConfig
} from "./chunk-G4SXHKM5.js";

// ../utils/federated.js
var federatedContentRoot;
var getFederatedContentRoot = () => {
  const cdnWhitelistedOrigins = [
    "https://www.adobe.com",
    "https://business.adobe.com",
    "https://blog.adobe.com",
    "https://milo.adobe.com",
    "https://news.adobe.com"
  ];
  const { allowedOrigins = [], origin: configOrigin } = getConfig();
  if (federatedContentRoot) return federatedContentRoot;
  const origin = configOrigin || window.location.origin;
  federatedContentRoot = [...allowedOrigins, ...cdnWhitelistedOrigins].some((o) => origin.replace(".stage", "") === o) ? origin : "https://www.adobe.com";
  if (origin.includes("localhost") || origin.includes(".hlx.")) {
    federatedContentRoot = `https://main--federal--adobecom.hlx.${origin.endsWith(".live") ? "live" : "page"}`;
  }
  return federatedContentRoot;
};
var getFederatedUrl = (url = "") => {
  if (typeof url !== "string" || !url.includes("/federal/")) return url;
  if (url.startsWith("/")) return `${getFederatedContentRoot()}${url}`;
  try {
    const { pathname, search, hash } = new URL(url);
    return `${getFederatedContentRoot()}${pathname}${search}${hash}`;
  } catch (e) {
    window.lana?.log(`getFederatedUrl errored parsing the URL: ${url}: ${e.toString()}`);
  }
  return url;
};

export {
  getFederatedContentRoot,
  getFederatedUrl
};
//# sourceMappingURL=chunk-R5PLKX3Z.js.map
