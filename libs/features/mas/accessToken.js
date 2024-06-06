/* bookmarklet code to update the access token */

let accessToken;
Object.keys(sessionStorage).forEach((key) => {
  if (/adobeid_ims_access_token\/exc_app/.test(key)) {
    const data = JSON.parse(sessionStorage.getItem(key));
    accessToken = data.tokenValue;
  }
});
const iframeMain = document.querySelector('iframe[name="Main Content"]');
const iframe = iframeMain.contentDocument.querySelector('iframe[src*="/mas/studio"]');
console.log('sending accessToken', accessToken);
iframe.contentWindow.postMessage({ type: 'mas:updateAccessToken', accessToken }, '*');
