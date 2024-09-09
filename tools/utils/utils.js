const IMS_CLIENT_ID = 'milo_ims';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const STYLE_SHEETS = {};

const getImsToken = async (loadScript) => {
  window.adobeid = {
    client_id: IMS_CLIENT_ID,
    environment: 'prod',
    scope: 'AdobeID,openid',
  };

  if (!window.adobeIMS) {
    await loadScript(IMS_PROD_URL);
  }
  return window.adobeIMS?.getAccessToken()?.token;
};

const getSheet = async (url) => {
  if (STYLE_SHEETS[url]) return STYLE_SHEETS[url];
  const resp = await fetch(url);
  const text = await resp.text();
  const sheet = new CSSStyleSheet();
  sheet.replace(text);
  STYLE_SHEETS[url] = sheet;
  return sheet;
};

export { getImsToken, getSheet };
