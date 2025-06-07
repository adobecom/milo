import config from '../config.js';
import dispatchCustomEvent from '../dom/dispatchCustomEvent.js';

let isImsReady = false;
const onIMSReady = () => new Promise((resolve, reject) => {
  const executeOnFail = () => {
    if (!isImsReady) {
      isImsReady = false;
      reject();
    }
  };

  const waitTimeout = setTimeout(executeOnFail, config.restrictions.imsTimeout);
  const executeOnReady = (data) => {
    const instance = data?.detail?.instance;
    if (!instance) {
      reject();
      return;
    }

    isImsReady = true;
    window.removeEventListener('onImsLibInstance', executeOnReady);
    clearTimeout(waitTimeout);
    resolve(instance);
  };

  window.addEventListener('onImsLibInstance', executeOnReady);
  dispatchCustomEvent('getImsLibInstance', null);
});

export default onIMSReady;
