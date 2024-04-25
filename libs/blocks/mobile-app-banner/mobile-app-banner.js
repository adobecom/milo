import { getConfig } from '../../utils/utils.js';

async function getKey(product) {
  const config = getConfig();
  let keyMatch = [];
  const resp = await fetch(`${config.contentRoot ?? ''}/branch-io-key.json`);
  if (resp.ok) {
    const json = await resp.json();
    keyMatch = json.data.filter(
      (p) => p.product === product,
    );
  }
  return keyMatch[0]?.key;
}

/* eslint-disable */
function branchInit(key) {
  let initValue = false;
  function initBranch() {
    if (initValue) {
      return;
    }
    initValue = true;
    (function (b, r, a, n, c, h, _, s, d, k) {
      if (!b[n] || !b[n]._q) {
        for (; s < _.length;) c(h, _[s++]);
        d = r.createElement(a);
        d.async = 1;
        d.src = 'https://cdn.branch.io/branch-latest.min.js';
        k = r.getElementsByTagName(a)[0];
        k.parentNode.insertBefore(d, k);
        b[n] = h;
      }
    })(
      window,
      document,
      'script',
      'branch',
      function (b, r) {
        b[r] = function () {
          b._q.push([r, arguments]);
        };
      },
      { _q: [], _v: 1 },
      'addListener applyCode autoAppIndex banner closeBanner closeJourney creditHistory credits data deepview deepviewCta first getCode init link logout redeem referrals removeListener sendSMS setBranchViewData setIdentity track validateCode trackCommerceEvent logEvent disableTracking'.split(
        ' '
      ),
      0
    );
    const privacyConsent = window.adobePrivacy?.hasUserProvidedConsent();
    branch.init(key, { tracking_disabled: !privacyConsent });
  }
  ['adobePrivacy:PrivacyConsent', 'adobePrivacy:PrivacyReject', 'adobePrivacy:PrivacyCustom']
    .forEach((event) => {
      window.addEventListener(event, initBranch);
    });
}

/* eslint-enable */
export default async function init(el) {
  const header = document.querySelector('.global-navigation');
  if (!header) return;
  const classListArray = Array.from(el.classList);
  const product = classListArray.find((token) => token.startsWith('product-')).split('-')[1];
  const key = await getKey(product);
  if (key) branchInit(key);
}
