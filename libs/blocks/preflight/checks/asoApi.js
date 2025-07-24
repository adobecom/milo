const CHECK_API = 'https://spacecat.experiencecloud.live/api/v1';

let asoTokenPromise = null;

async function getASOToken() {
  asoTokenPromise = asoTokenPromise || (async () => {
    window.adobeImsFactory.createIMSLib({
      client_id: 'milo-tools',
      scope: 'AdobeID,openid,gnav,read_organizations,additional_info.projectedProductContext,additional_info.roles',
      environment: 'prod',
      autoValidateToken: true,
      useLocalStorage: false,
    }, 'asoIMS');
    // TODO: We should only initialize (or re-initialize) AFTER
    // we get a 'logged-in' sidekick event
    window.asoIMS.initialize();
    if (!window.asoIMS.getAccessToken()?.token) return null;

    const res = await fetch(`${CHECK_API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: window.asoIMS.getAccessToken().token }),
    });
    const data = await res.json();
    return data.sessionToken;
  })();

  return asoTokenPromise;
}

export const preflightCache = {
  identify: null,
  suggest: null,
  identifyPromise: null,
  suggestPromise: null,
};

async function getJobId(step) {
  try {
    const sessionToken = await getASOToken();
    if (!sessionToken) return null;

    const res = await fetch(`${CHECK_API}/preflight/jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          step,
          urls: [window.location.href],
        },
      ),
    });
    const data = await res.json();
    return data.jobId;
  } catch (err) {
    // TODO: handle error
    return null;
  }
}

async function getJobResults(jobId, step) {
  const MAX_RETRIES = 50;
  const POLL_INTERVAL = 2500;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const sessionToken = await getASOToken();
      if (!sessionToken) return null;

      const res = await fetch(`${CHECK_API}/preflight/jobs/${jobId}`, { headers: { Authorization: `Bearer ${sessionToken}` } });
      const data = await res.json();

      if (step === 'IDENTIFY' && data.result) {
        preflightCache.identify = {
          audits: data.result[0].audits,
          status: data.status,
          step: 'IDENTIFY',
        };
      } else if (step === 'SUGGEST' && data.result) {
        preflightCache.suggest = {
          audits: data.result[0].audits,
          status: data.status,
          step: 'SUGGEST',
        };
      }

      if (data.status === 'COMPLETED') return data;
      await new Promise((resolve) => {
        setTimeout(resolve, POLL_INTERVAL);
      });
      retries += 1;
    } catch (err) {
      // TODO: handle error
      return null;
    }
  }

  // Max retries exceeded
  return null;
}

export default async function getChecks(step) {
  const jobId = await getJobId(step);
  if (!jobId) return null;
  const checks = await getJobResults(jobId, step);
  if (!checks) return null;
  return checks.result;
}

export async function prefetchPreflightChecks() {
  if (!preflightCache.identifyPromise) {
    preflightCache.identifyPromise = getChecks('IDENTIFY');
  }
  if (!preflightCache.suggestPromise) {
    preflightCache.suggestPromise = getChecks('SUGGEST');
  }
}
