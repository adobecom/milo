// Browser-facing entry for the CaaS send-to-caas tool.
//
// The card -> XDM payload business logic lives in the self-contained leaf module
// ./caas-payload-core.js (which does NOT import Milo's utils.js / caas/utils.js
// so it can be bundled standalone). This file re-exports that payload surface and
// adds the browser-only pieces that depend on window.location / live admin
// status / the milo-caas POST endpoint and therefore must stay out of the leaf.

import {
  buildCaasXdmPayload,
  checkUrl,
  getCaasIds,
  getCardMetadata,
  getCaasProps,
  getConfig,
  getKeyValPairs,
  getFloodgateColorFromHost,
  getOrigin,
  hasCardMetadata,
  hasContentTypeTag,
  isDisabledOnPage,
  loadCaasTags,
  runLanguageFirstRetry,
  setConfig,
} from './caas-payload-core.js';

const HLX_ADMIN_STATUS = 'https://admin.hlx.page/status';
const URL_POSTXDM = 'https://14257-milocaasproxy.adobeio-static.net/api/v1/web/milocaas/postXDM';
const URL_POSTXDM_DEV = 'https://14257-milocaasproxy-dev.adobeio-static.net/api/v1/web/milocaas/postXDM';

// Inject the lazy local tag-taxonomy fallback used by loadCaasTags when the
// network fetch to the chimera tags API fails. The leaf (caas-payload-core.js)
// stays free of the 706KB data module so it can be bundled standalone; the
// browser loads it on demand only when actually needed.
setConfig({
  getCaasTagsFallback: () => import('../../libs/blocks/caas-config/caas-tags.js')
    .then((m) => m.default),
});

const isPagePublished = async () => {
  let { branch, repo, owner } = getConfig();
  if (!(branch || repo || owner)
    && window.location.hostname.endsWith('.page')) {
    [branch, repo, owner] = window.location.hostname.split('.')[0].split('--');
  }

  if (!(branch || repo || owner)) {
    throw new Error(`Branch, Repo or Owner is not set - branch: ${branch}, repo: ${repo}, owner: ${owner}`);
  }

  const res = await fetch(
    `${HLX_ADMIN_STATUS}/${owner}/${repo}/${branch}${window.location.pathname}`,
  );
  if (res.ok) {
    const json = await res.json();
    return json.live.status === 200;
  }
  return false;
};

const postDataToCaaS = async ({ accessToken, caasEnv, caasProps, draftOnly }) => {
  const isDev = new URLSearchParams(window.location.search).get('caas-env') === 'dev';
  const postXdmUrl = isDev ? URL_POSTXDM_DEV : URL_POSTXDM;
  const resolvedEnv = isDev ? 'dev' : caasEnv;
  const options = {
    method: 'POST',
    body: JSON.stringify(caasProps),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      draft: !!draftOnly,
      'caas-env': resolvedEnv,
    },
  };
  let response;
  const res = await fetch(postXdmUrl, options);
  if (res !== undefined) {
    const text = await res.text();

    try {
      response = JSON.parse(text);
    } catch {
      response = text;
    }
  }
  return response;
};

export {
  buildCaasXdmPayload,
  checkUrl,
  getCaasIds,
  getCardMetadata,
  getCaasProps,
  getConfig,
  getKeyValPairs,
  getFloodgateColorFromHost,
  getOrigin,
  hasCardMetadata,
  hasContentTypeTag,
  isDisabledOnPage,
  isPagePublished,
  loadCaasTags,
  postDataToCaaS,
  runLanguageFirstRetry,
  setConfig,
};
