import {
  SEO_TITLES,
  STATUS,
  SEO_IDS,
  SEO_DESCRIPTIONS,
  ASO_POLL_INTERVAL_MS,
  ASO_MAX_RETRIES,
  ASO_TIMEOUT_MS,
} from './constants.js';

const CHECK_API = 'https://spacecat.experiencecloud.live/api/v1';

export const asoCache = {
  identify: null,
  identifyFinished: false,
  suggest: null,
  suggestFinished: false,
  sessionToken: null,
};

const lanaLog = (message) => {
  window.lana.log(message, {
    sampleRate: 100,
    tags: 'preflight',
    errorType: 'e',
  });
};

export async function getASOToken() {
  if (!window.asoIMS) {
    window.adobeImsFactory.createIMSLib({
      client_id: 'milo-tools',
      scope: 'AdobeID,openid,gnav,read_organizations,additional_info.projectedProductContext,additional_info.roles',
      environment: 'prod',
      autoValidateToken: true,
      useLocalStorage: false,
      modalMode: true,
    }, 'asoIMS');
    await window.asoIMS.initialize();
  }

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
    asoCache.sessionToken = data.sessionToken;
    return asoCache.sessionToken;
  } catch (err) {
    lanaLog(`ASO: Error fetching token | error: ${err.reason || err.error || err.message || err} | url: ${CHECK_API}/auth/login`);
    return null;
  }
}

function resultsFormatter(results) {
  const formattedResults = [];

  const processMetaAudit = ({ seoId, seoTitle, passDescription }) => {
    const audit = results.find((result) => result.name === 'metatags');
    if (!audit) return;
    const opportunity = audit?.opportunities.find((opp) => opp.tagName === seoId);

    formattedResults.push({
      id: seoId,
      title: seoTitle,
      status: opportunity ? STATUS.FAIL : STATUS.PASS,
      description: opportunity ? `${opportunity.issue} ${opportunity.issueDetails}` : passDescription,
      aiSuggestion: opportunity?.aiSuggestion,
    });
  };

  const processStandardAudit = ({ seoId, seoTitle, passDescription }) => {
    const audit = results.find((result) => result.name === seoId);
    if (!audit) return;
    const [issue] = audit.opportunities;
    formattedResults.push({
      id: seoId,
      title: seoTitle,
      status: issue ? STATUS.FAIL : STATUS.PASS,
      description: issue ? issue.issue : passDescription,
      aiSuggestion: issue?.aiSuggestion || issue?.seoRecommendation,
    });
  };

  const processLinksAudit = () => {
    const [links] = results.filter((audit) => audit.name === SEO_IDS.links);
    if (links) {
      const [badLinksOpportunity] = links.opportunities.filter((o) => o.check === 'bad-links');
      const [brokenLinksOpportunity] = links.opportunities.filter((o) => o.check === 'broken-internal-links');
      const [brokenExternalLinksOpportunity] = links.opportunities.filter((o) => o.check === 'broken-external-links');
      const badLinks = badLinksOpportunity?.issue || [];
      const brokenLinks = brokenLinksOpportunity?.issue || [];
      const brokenExternalLinks = brokenExternalLinksOpportunity?.issue || [];
      const issueLinks = [...badLinks, ...brokenLinks, ...brokenExternalLinks];
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
  };

  processMetaAudit({
    seoId: SEO_IDS.title,
    seoTitle: SEO_TITLES.title,
    passDescription: SEO_DESCRIPTIONS.title,
  });
  processMetaAudit({
    seoId: SEO_IDS.description,
    seoTitle: SEO_TITLES.description,
    passDescription: SEO_DESCRIPTIONS.description,
  });
  processStandardAudit({
    seoId: SEO_IDS.h1Count,
    seoTitle: SEO_TITLES.h1Count,
    passDescription: SEO_DESCRIPTIONS.h1Count,
  });
  processStandardAudit({
    seoId: SEO_IDS.canonical,
    seoTitle: SEO_TITLES.canonical,
    passDescription: SEO_DESCRIPTIONS.canonical,
  });
  processStandardAudit({
    seoId: SEO_IDS.bodySize,
    seoTitle: SEO_TITLES.bodySize,
    passDescription: SEO_DESCRIPTIONS.bodySize,
  });
  processStandardAudit({
    seoId: SEO_IDS.loremIpsum,
    seoTitle: SEO_TITLES.loremIpsum,
    passDescription: SEO_DESCRIPTIONS.loremIpsum,
  });
  processLinksAudit();
  return formattedResults;
}

async function getJobId(step) {
  try {
    const res = await fetch(`${CHECK_API}/preflight/jobs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${asoCache.sessionToken}`,
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

async function fetchJobStatus(jobId) {
  try {
    const res = await fetch(`${CHECK_API}/preflight/jobs/${jobId}`, { headers: { Authorization: `Bearer ${asoCache.sessionToken}` } });
    if (!res.ok) {
      lanaLog(`ASO: Error fetching job status | status: ${res.status} | url: ${CHECK_API}/preflight/jobs/${jobId}`);
      return null;
    }
    return res;
  } catch (err) {
    lanaLog(`ASO: Error fetching job status | error: ${err.reason || err.error || err.message || err} | url: ${CHECK_API}/preflight/jobs/${jobId}`);
    return null;
  }
}

function processJobUpdate(data, step) {
  if (!data?.result?.[0]?.audits) return null;
  const formattedResults = resultsFormatter(data.result[0].audits);
  if (step === 'IDENTIFY') asoCache.identify = formattedResults;
  if (step === 'SUGGEST') asoCache.suggest = formattedResults;
  return { results: formattedResults, status: data.status };
}

async function attemptJobPoll(jobId, step) {
  try {
    const response = await fetchJobStatus(jobId);
    if (!response || !response.ok) {
      lanaLog(`ASO: Error fetching job results | step:${step} | status: ${response?.status} | url: ${CHECK_API}/preflight/jobs/${jobId}`);
      return null;
    }

    const data = await response.json();
    return processJobUpdate(data, step);
  } catch (err) {
    lanaLog(`ASO: Error fetching job results | step:${step} | error: ${err.reason || err.error || err.message || err} | url: ${CHECK_API}/preflight/jobs/${jobId}`);
    return null;
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getJobResults(jobId, step) {
  let retries = 0;

  while (retries < ASO_MAX_RETRIES) {
    const update = await attemptJobPoll(jobId, step);
    if (update?.status === 'COMPLETED') {
      asoCache[step === 'IDENTIFY' ? 'identifyFinished' : 'suggestFinished'] = true;
      return update.results;
    }

    await sleep(ASO_POLL_INTERVAL_MS);
    retries += 1;
  }

  lanaLog(`ASO: Max retries exceeded for job results | error: Failed to fetch job results after ${ASO_MAX_RETRIES} retries for step: ${step}, jobId: ${jobId} | url: ${CHECK_API}/preflight/jobs/${jobId}`);
  return null;
}

export default async function getChecks(step) {
  const jobId = await getJobId(step);
  if (!jobId) return null;
  if (step === 'IDENTIFY') asoCache.identifyJobId = jobId;
  const checks = await getJobResults(jobId, step);
  if (!checks) return null;
  return checks;
}

export async function fetchPreflightChecks() {
  await getASOToken();
  if (!asoCache.sessionToken) return null;

  if (!asoCache.identify) asoCache.identify = getChecks('IDENTIFY');
  if (!asoCache.suggest) asoCache.suggest = getChecks('SUGGEST');

  const raceResult = await Promise.race([
    asoCache.identify,
    new Promise((_, reject) => {
      setTimeout(() => {
        const identifyTimeoutSeconds = ASO_TIMEOUT_MS / 1000;
        lanaLog(`ASO: identify results not available within ${identifyTimeoutSeconds} seconds | jobId: ${asoCache.identifyJobId || 'unknown'}`);
        reject(new Error(`ASO: identify results not available within ${identifyTimeoutSeconds} seconds`));
      }, ASO_TIMEOUT_MS);
    }),
  ]);

  if (raceResult) return raceResult;

  return null;
}
