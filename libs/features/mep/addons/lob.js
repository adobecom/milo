function getCookie(key) {
  const cookie = document.cookie.split(';')
    .map((x) => decodeURIComponent(x.trim()).split(/=(.*)/s))
    .find(([k]) => k === key);
  return cookie ? cookie[1] : null;
}

export async function getSpectraLOB(lastVisitedPage) {
  const getECID = getCookie('AMCV_9E1005A551ED61CA0A490D45@AdobeOrg');
  if (!getECID) return false;
  const [, ECID] = getECID.split('|');
  let url = `https://cchome-stage.adobe.io/int/v1/aep/events/webpage?ecid=${ECID}`;
  if (lastVisitedPage) url = `${url}&lastVisitedPage=${lastVisitedPage}`;

  try {
    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': 'MarketingTech',
        'Content-Type': 'application/json',
      },
      body: null,
    });
    const content = await rawResponse.json();
    return content.modelLineOfBusiness?.toLowerCase();
  } catch (e) {
    if (e.name === 'TimeoutError') window.lana?.log('Spectra Timeout'); // Abort signal
    else window.lana?.log(e.reason || e.error || e.message, { errorType: 'i' });
    return false;
  }
}

export default async function init(addon, enablement, config) {
  config.mep[addon] = enablement !== true ? enablement : await getSpectraLOB(document.referrer);
}
