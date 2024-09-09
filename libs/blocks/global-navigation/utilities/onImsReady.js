let ready = false;
let existingCall = null;
const onInstance = 'onImsLibInstance';

const onImsReady = (timeout = 3000) => {
  existingCall = existingCall || new Promise((resolve, reject) => {
    const onFail = () => {
      if (!ready) reject();
    };
    const waitTimeout = setTimeout(onFail, timeout);
    const onSuccess = (data) => {
      const instance = data?.detail?.instance;
      if (!instance) {
        reject();
        return;
      }

      ready = true;
      window.removeEventListener(onInstance, onSuccess);
      clearTimeout(waitTimeout);
      resolve(instance);
    };

    window.addEventListener(onInstance, onSuccess);
    window.dispatchEvent(new window.CustomEvent('getImsLibInstance'));
  });

  return existingCall;
};

export default onImsReady;
