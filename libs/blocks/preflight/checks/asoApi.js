import { SEO_TITLES, STATUS, SEO_IDS, SEO_DESCRIPTIONS } from './constants.js';

const CHECK_API = 'https://spacecat.experiencecloud.live/api/v1';

export const asoCache = {
  identify: null,
  suggest: null,
  identifyPromise: null,
  suggestPromise: null,
  tokenPromise: null,
};

const lanaLog = (message) => {
  window.lana.log(message, {
    sampleRate: 1,
    tags: 'preflight',
    errorType: 'e',
  });
};

async function getASOToken() {
  asoCache.tokenPromise = asoCache.tokenPromise || (async () => {
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

    try {
      const res = await fetch(`${CHECK_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: window.asoIMS.getAccessToken().token }),
      });

      if (!res.ok) {
        lanaLog(`ASO: Error fetching token | status: ${res.status} | url: ${CHECK_API}/auth/login`);
        return null;
      }

      const data = await res.json();
      return data.sessionToken;
    } catch (err) {
      lanaLog(`ASO: Error fetching token | error: ${err.reason || err.error || err.message || err} | url: ${CHECK_API}/auth/login`);
      return null;
    }
  })();

  return asoCache.tokenPromise;
}

function resultsFormatter(results) {
  const formattedResults = [];

  const processAudit = ({ type, seoId, seoTitle, passDescription }) => {
    let issue = null;

    if (type === 'metatag') {
      const opportunity = results
        .find((result) => result.name === 'metatags')
        ?.opportunities.find((opp) => opp.tagName === seoId);
      if (opportunity) {
        formattedResults.push({
          id: seoId,
          title: seoTitle,
          status: STATUS.FAIL,
          description: `${opportunity.issue} ${opportunity.issueDetails}`,
          aiSuggestion: opportunity.aiSuggestion,
        });
        return;
      }
    } else {
      const [audit] = results.filter((result) => result.name === seoId);
      if (!audit) return;

      if (audit.opportunities.length > 0) {
        [issue] = audit.opportunities;
        formattedResults.push({
          id: seoId,
          title: seoTitle,
          status: STATUS.FAIL,
          description: issue.issue,
          aiSuggestion: issue.aiSuggestion || issue.seoRecommendation,
        });
        return;
      }
    }

    formattedResults.push({
      id: seoId,
      title: seoTitle,
      status: STATUS.PASS,
      description: passDescription,
    });
  };

  processAudit({ type: 'metatag', seoId: SEO_IDS.title, seoTitle: SEO_TITLES.title, passDescription: SEO_DESCRIPTIONS.title });
  processAudit({ type: 'metatag', seoId: SEO_IDS.description, seoTitle: SEO_TITLES.description, passDescription: SEO_DESCRIPTIONS.description });
  processAudit({ type: 'standard', seoId: 'h1-count', seoTitle: SEO_TITLES.h1Count, passDescription: SEO_DESCRIPTIONS.h1Count });
  processAudit({ type: 'standard', seoId: 'canonical', seoTitle: SEO_TITLES.canonical, passDescription: SEO_DESCRIPTIONS.canonical });
  processAudit({ type: 'standard', seoId: 'body-size', seoTitle: SEO_TITLES.bodySize, passDescription: SEO_DESCRIPTIONS.bodySize });
  processAudit({ type: 'standard', seoId: 'lorem-ipsum', seoTitle: SEO_TITLES.loremIpsum, passDescription: SEO_DESCRIPTIONS.loremIpsum });

  const [links] = results.filter((audit) => audit.name === 'links');
  if (links) {
    const [badLinksOpportunity] = links.opportunities.filter((o) => o.check === 'bad-links');
    const [brokenLinksOpportunity] = links.opportunities.filter((o) => o.check === 'broken-links');
    const badLinks = badLinksOpportunity?.issue || [];
    const brokenLinks = brokenLinksOpportunity?.issue || [];
    const issueLinks = [...badLinks, ...brokenLinks];
    const hasIssues = issueLinks.length > 0;

    formattedResults.push({
      id: SEO_IDS.links,
      title: SEO_TITLES.links,
      status: hasIssues ? STATUS.FAIL : STATUS.PASS,
      description: hasIssues ? `Reason: ${issueLinks.length} problem ${issueLinks.length > 1 ? 'links' : 'link'}. Use the list below to fix them.` : SEO_DESCRIPTIONS.links,
      details: {
        badLinks: hasIssues ? issueLinks.map((link) => ({
          liveHref: link.url,
          status: link.issue,
          parent: 'main',
        })) : [],
      },
    });
  }

  return formattedResults;
}

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

    if (!res.ok) {
      lanaLog(`ASO: Error creating preflight job | step: ${step} | status: ${res.status} | url: ${CHECK_API}/preflight/jobs`);
      return null;
    }

    const data = await res.json();
    return data.jobId;
  } catch (err) {
    lanaLog(`ASO: Error creating preflight job | step: ${step} | error: ${err.reason || err.error || err.message || err} | url: ${CHECK_API}/preflight/jobs`);
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

      if (!res.ok) {
        lanaLog(`ASO: Error fetching job results | step:${step} | status: ${res.status} | url: ${CHECK_API}/preflight/jobs/${jobId}`);
      } else {
        const data = await res.json();

        if (step === 'IDENTIFY' && data.status === 'COMPLETED') {
          asoCache.identify = resultsFormatter(data.result[0].audits);
          return data;
        } if (step === 'SUGGEST' && data.status === 'COMPLETED') {
          asoCache.suggest = resultsFormatter(data.result[0].audits);
          return data;
        }
      }

      await new Promise((resolve) => {
        setTimeout(resolve, POLL_INTERVAL);
      });
      retries += 1;
    } catch (err) {
      lanaLog(`ASO: Error fetching job results | step:${step} | error: ${err.reason || err.error || err.message || err} | url: ${CHECK_API}/preflight/jobs/${jobId}`);
      // Continue retrying on network errors
      await new Promise((resolve) => {
        setTimeout(resolve, POLL_INTERVAL);
      });
      retries += 1;
    }
  }

  // Max retries exceeded
  lanaLog(`ASO: Max retries exceeded for job results | error: Failed to fetch job results after ${MAX_RETRIES} retries for step: ${step}, jobId: ${jobId} | url: ${CHECK_API}/preflight/jobs/${jobId}`);
  return null;
}

export default async function getChecks(step) {
  const jobId = await getJobId(step);
  if (!jobId) return null;
  const checks = await getJobResults(jobId, step);
  if (!checks) return null;
  return checks;
}

export async function fetchPreflightChecks() {
  if (!asoCache.identifyPromise) asoCache.identifyPromise = getChecks('IDENTIFY');
  if (!asoCache.suggestPromise) asoCache.suggestPromise = getChecks('SUGGEST');

  // Poll every 1 second until identify is available
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (asoCache.identify) {
        clearInterval(checkInterval);
        resolve(asoCache.identify);
      }
    }, 1000);
  });
}
