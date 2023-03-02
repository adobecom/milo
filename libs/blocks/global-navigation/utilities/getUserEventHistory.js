/* eslint-disable no-promise-executor-return, no-async-promise-executor */
import { getConfig } from '../../../utils/utils.js';

let userEventHistory;
const getUserEventHistory = async (id) => {
  if (userEventHistory) return userEventHistory;
  if (!window.adobeIMS?.isSignedInUser()) return new Promise((resolve, reject) => { reject(new Error('User not signed in')); });
  let resolve;
  let reject;
  userEventHistory = userEventHistory || new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  const profile = await window.adobeIMS.getProfile();
  const guid = profile.userId;
  const apiUrl = getConfig().env.name === 'prod'
    ? 'https://www.adobe.com/gating/api/realtime-profile'
    : 'https://www.stage.adobe.com/gating/api/realtime-profile';
  const res = await window
    .fetch(`${apiUrl}?guid=${id || guid}`, {
      method: 'GET',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })
    .then((resp) => (resp.status === 200 ? resp.json() : null));
  if (res) resolve(res);
  reject(new Error('Error retrieving a response'));
  return userEventHistory;
};

export default getUserEventHistory;
