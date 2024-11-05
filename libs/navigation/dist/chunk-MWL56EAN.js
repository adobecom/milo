// ../../tools/utils/utils.js
var IMS_CLIENT_ID = "milo_ims";
var IMS_PROD_URL = "https://auth.services.adobe.com/imslib/imslib.min.js";
var CONFIGS = {};
var getImsToken = async (loadScript) => {
  window.adobeid = {
    client_id: IMS_CLIENT_ID,
    environment: "prod",
    scope: "AdobeID,openid"
  };
  if (!window.adobeIMS) {
    await loadScript(IMS_PROD_URL);
  }
  return window.adobeIMS?.getAccessToken()?.token;
};
var getCustomConfig = async (path) => {
  if (CONFIGS[path] !== void 0) {
    return CONFIGS[path];
  }
  let config = null;
  const resp = await fetch(path);
  if (resp.ok) {
    config = await resp.json();
  }
  CONFIGS[path] = config;
  return CONFIGS[path];
};

export {
  getImsToken,
  getCustomConfig
};
//# sourceMappingURL=chunk-MWL56EAN.js.map
