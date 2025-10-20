import { getConfig } from '../../../utils/utils.js';
import { getCookie, AMCV_COOKIE } from '../../../martech/helpers.js';

export async function getSpectraLOB(lastVisitedPage) {
  const getECID = getCookie(AMCV_COOKIE);
  if (!getECID) return false;
  const [, ECID] = getECID.split('|');
  const domainSuffix = getConfig()?.env?.name === 'prod' ? '' : '-stage';
  let url = `https://cchome${domainSuffix}.adobe.io/int/v1/aep/events/webpage?ecid=${ECID}`;
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
    /* c8 ignore next 3 */
  } catch (e) {
    return false;
  }
}

export default async function init(enablement) {
  if (enablement !== true) return enablement;
  const consentCookieValue = getCookie('OptanonConsent');
  if (consentCookieValue?.includes('C0002:0')) return 'cc';
  const lobValue = await getSpectraLOB(document.referrer);
  return lobValue;
}
