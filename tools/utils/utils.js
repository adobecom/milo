const IMS_CLIENT_ID = 'milo_ims';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';

const getImsToken = async (loadScript) => {
  window.adobeid = window.adobeid || {
    client_id: IMS_CLIENT_ID,
    environment: 'prod',
    scope: 'AdobeID,openid',
  };

  if (!window.adobeIMS) {
    await loadScript(IMS_PROD_URL);
  }
  return window.adobeIMS?.getAccessToken()?.token;
};

const isImsStage = () => window.adobeid?.environment?.toLowerCase
  && window.adobeid.environment.toLowerCase() !== 'prod';

export { getImsToken, isImsStage };
