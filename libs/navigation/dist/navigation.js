import {
  loadStyle
} from "./chunk-ZEVYWJU7.js";
import "./chunk-NE6SFPCS.js";

// navigation.js
var blockConfig = [
  {
    key: "header",
    name: "global-navigation",
    targetEl: "header",
    appendType: "prepend",
    params: ["imsClientId", "searchEnabled", "unav", "customLinks", "jarvis"]
  },
  {
    key: "footer",
    name: "global-footer",
    targetEl: "footer",
    appendType: "appendChild",
    params: ["privacyId", "privacyLoadDelay"]
  }
];
var envMap = {
  prod: "https://www.adobe.com",
  stage: "https://www.stage.adobe.com",
  qa: "https://gnav--milo--adobecom.aem.page"
};
var getStageDomainsMap = (stageDomainsMap) => ({
  "www.stage.adobe.com": {
    "www.adobe.com": "origin",
    "helpx.adobe.com": "helpx.stage.adobe.com",
    "creativecloud.adobe.com": "stage.creativecloud.adobe.com",
    ...stageDomainsMap
  },
  // Test app
  "adobecom.github.io": {
    "www.adobe.com": "www.stage.adobe.com",
    "helpx.adobe.com": "helpx.stage.adobe.com",
    "creativecloud.adobe.com": "stage.creativecloud.adobe.com",
    ...stageDomainsMap
  }
});
function getParamsConfigs(configs) {
  return blockConfig.reduce((acc, block) => {
    block.params.forEach((param) => {
      const value = configs[block.key]?.[param];
      if (value !== void 0) {
        acc[param] = value;
      }
    });
    return acc;
  }, {});
}
async function loadBlock(configs, customLib) {
  const {
    header,
    footer,
    authoringPath,
    env = "prod",
    locale = "",
    theme,
    stageDomainsMap = {}
  } = configs || {};
  if (!header && !footer) {
    console.error("Global navigation Error: header and footer configurations are missing.");
    return;
  }
  const branch = new URLSearchParams(window.location.search).get("navbranch");
  const miloLibs = branch ? `https://${branch}--milo--adobecom.aem.page` : customLib || envMap[env];
  if (theme === "dark") {
    loadStyle(`${miloLibs}/libs/navigation/dist/base.css`, () => loadStyle(`${miloLibs}/libs/navigation/dist/dark-nav.css`));
  } else {
    loadStyle(`${miloLibs}/libs/navigation/dist/base.css`);
  }
  const [{ default: bootstrapBlock }, { default: locales }, { setConfig }] = await Promise.all([
    import("./bootstrapper-OPTZNGC6.js"),
    import("./locales-PE6ERXTI.js"),
    import("./utils-IERWOBZX.js")
  ]);
  loadStyle(`${miloLibs}/libs/navigation/dist/navigation.css`);
  const paramConfigs = getParamsConfigs(configs);
  const clientConfig = {
    clientEnv: env,
    origin: `https://main--federal--adobecom.aem.${env === "prod" ? "live" : "page"}`,
    miloLibs: `${miloLibs}/libs`,
    pathname: `/${locale}`,
    locales: configs.locales || locales,
    contentRoot: authoringPath || footer.authoringPath,
    theme,
    ...paramConfigs,
    standaloneGnav: true,
    stageDomainsMap: getStageDomainsMap(stageDomainsMap)
  };
  setConfig(clientConfig);
  for await (const block of blockConfig) {
    const configBlock = configs[block.key];
    try {
      if (configBlock) {
        if (block.key === "header") {
          const { default: init } = await import("./global-navigation-UWTEC37Q.js");
          await bootstrapBlock(init, {
            ...block,
            unavComponents: configBlock.unav?.unavComponents,
            redirect: configBlock.redirect,
            layout: configBlock.layout,
            noBorder: configBlock.noBorder,
            jarvis: configBlock.jarvis
          });
        } else if (block.key === "footer") {
          loadStyle(`${miloLibs}/libs/navigation/dist/footer.css`);
          const { default: init } = await import("./global-footer-RKXQBHDV.js");
          await bootstrapBlock(init, { ...block });
        }
        configBlock.onReady?.();
      }
    } catch (e) {
      configBlock.onError?.(e);
    }
  }
}
window.loadNavigation = loadBlock;
export {
  loadBlock as default
};
//# sourceMappingURL=navigation.js.map
