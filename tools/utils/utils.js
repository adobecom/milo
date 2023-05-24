const IMS_CLIENT_ID = 'milo_ims';
const IMS_PROD_URL = 'https://auth.services.adobe.com/imslib/imslib.min.js';
const IMS_STAGE_URL = 'https://auth-stg1.services.adobe.com/imslib/imslib.min.js';

const getImsToken = async (loadScript, imsEnv = 'prod') => {
  window.adobeid = {
    client_id: IMS_CLIENT_ID,
    environment: imsEnv,
    scope: 'AdobeID,openid',
  };

  if (!window.adobeIMS) {
    await loadScript(imsEnv === 'stage' ? IMS_STAGE_URL : IMS_PROD_URL);
  }
  return window.adobeIMS?.getAccessToken()?.token;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getImsToken,
};
