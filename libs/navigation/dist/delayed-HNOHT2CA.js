import "./chunk-NE6SFPCS.js";

// ../scripts/delayed.js
var loadJarvisChat = async (getConfig, getMetadata, loadScript, loadStyle) => {
  const config = getConfig();
  const jarvis = getMetadata("jarvis-chat")?.toLowerCase();
  if (!jarvis || !["mobile", "desktop", "on"].includes(jarvis) || !config.jarvis?.id || !config.jarvis?.version) return;
  const desktopViewport = window.matchMedia("(min-width: 900px)").matches;
  if (jarvis === "mobile" && desktopViewport) return;
  if (jarvis === "desktop" && !desktopViewport) return;
  const { initJarvisChat } = await import("./jarvis-chat-6NO6BTW2.js");
  initJarvisChat(config, loadScript, loadStyle, getMetadata);
};
var loadPrivacy = async (getConfig, loadScript) => {
  const acom = "7a5eb705-95ed-4cc4-a11d-0cc5760e93db";
  const ids = {
    "hlx.page": "3a6a37fe-9e07-4aa9-8640-8f358a623271-test",
    "hlx.live": "926b16ce-cc88-4c6a-af45-21749f3167f3-test"
  };
  const otDomainId = ids?.[Object.keys(ids).find((domainId) => window.location.host.includes(domainId))] ?? (getConfig()?.privacyId || acom);
  window.fedsConfig = {
    privacy: { otDomainId },
    documentLanguage: true
  };
  loadScript("https://www.adobe.com/etc.clientlibs/globalnav/clientlibs/base/privacy-standalone.js");
  document.addEventListener("click", (event) => {
    if (event.target.closest('a[href*="#openPrivacy"]')) {
      event.preventDefault();
      window.adobePrivacy?.showPreferenceCenter();
    }
  });
};
var loadGoogleLogin = async (getMetadata, loadIms, loadScript, getConfig) => {
  const googleLogin = getMetadata("google-login")?.toLowerCase();
  if (window.adobeIMS?.isSignedInUser() || !["mobile", "desktop", "on"].includes(googleLogin)) return;
  const desktopViewport = window.matchMedia("(min-width: 900px)").matches;
  if (googleLogin === "mobile" && desktopViewport) return;
  if (googleLogin === "desktop" && !desktopViewport) return;
  const { default: initGoogleLogin } = await import("./google-login-AKYRMXAP.js");
  initGoogleLogin(loadIms, getMetadata, loadScript, getConfig);
};
var loadDelayed = ([
  getConfig,
  getMetadata,
  loadScript,
  loadStyle,
  loadIms
], DELAY = 3e3) => new Promise((resolve) => {
  setTimeout(() => {
    loadPrivacy(getConfig, loadScript);
    loadJarvisChat(getConfig, getMetadata, loadScript, loadStyle);
    loadGoogleLogin(getMetadata, loadIms, loadScript, getConfig);
    if (getMetadata("interlinks") === "on") {
      const { locale } = getConfig();
      const path = `${locale.contentRoot}/keywords.json`;
      const language = locale.ietf?.split("-")[0];
      import("./interlinks-DMZPOFKO.js").then((mod) => {
        mod.default(path, language);
        resolve(mod);
      });
    } else {
      resolve(null);
    }
    import("./samplerum-UMPZCNEM.js").then(({ sampleRUM }) => sampleRUM());
  }, DELAY);
});
var delayed_default = loadDelayed;
export {
  delayed_default as default,
  loadGoogleLogin,
  loadJarvisChat,
  loadPrivacy
};
//# sourceMappingURL=delayed-HNOHT2CA.js.map
