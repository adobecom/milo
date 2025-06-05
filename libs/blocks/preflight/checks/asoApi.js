const CHECK_API = 'https://spacecat.experiencecloud.live/api/v1';
const CHECK_KEY = (() => {
  const storedKey = sessionStorage.getItem('preflight-key');
  if (storedKey) return storedKey;

  const params = new URLSearchParams(window.location.search);
  const queryKey = params.get('preflight-key');
  if (queryKey) {
    sessionStorage.setItem('preflight-key', queryKey);
    return queryKey;
  }

  return null;
})();

async function getJobId(step) {
  try {
    if (!CHECK_KEY) throw new Error('No preflight key found');
    const res = await fetch(`${CHECK_API}/preflight/jobs`, {
      method: 'POST',
      headers: {
        'x-api-key': CHECK_KEY,
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

async function getJobResults(jobId) {
  const MAX_RETRIES = 50;
  const POLL_INTERVAL = 2500;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      if (!CHECK_KEY) throw new Error('No preflight key found');
      const res = await fetch(`${CHECK_API}/preflight/jobs/${jobId}`, { headers: { 'x-api-key': CHECK_KEY } });
      const data = await res.json();
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
  const checks = await getJobResults(jobId);
  if (!checks) return null;
  return checks.result;
}

export const preflightCache = {
  identify: null,
  suggest: null,
  identifyPromise: null,
  suggestPromise: null,
};

export async function prefetchPreflightChecks() {
  if (!preflightCache.identifyPromise) {
    preflightCache.identifyPromise = getChecks('IDENTIFY').then((result) => {
      preflightCache.identify = result;
      return result;
    });
  }
  if (!preflightCache.suggestPromise) {
    preflightCache.suggestPromise = getChecks('SUGGEST').then((result) => {
      preflightCache.suggest = result;
      return result;
    });
  }
}
