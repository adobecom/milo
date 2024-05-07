const {
  slackNotification,
  getLocalConfigs,
  pulls: { addLabels, addFiles, getChecks, getReviews },
} = require('./helpers.js');

// Run from the root of the project for local testing: node --env-file=.env .github/workflows/merge-to-stage.js
const PR_TITLE = '[Release] Stage to Main';
const SEEN = {};
const REQUIRED_APPROVALS = process.env.REQUIRED_APPROVALS || 2;
const STAGE = 'stage';
const PROD = 'main';
const LABELS = {
  highPriority: 'high priority',
  readyForStage: 'Ready for Stage',
  SOTPrefix: 'SOT',
  highImpact: 'high-impact',
};

const SLACK = {
  fileOverlap: ({ html_url, number, title }) =>
    `:fast_forward: Skipping <${html_url}|${number}: ${title}> due to overlap in files.`,
  merge: ({ html_url, number, title, highImpact }) =>
    `:merged:${highImpact} Stage merge PR <${html_url}|${number}: ${title}>.`,
  failingChecks: ({ html_url, number, title }) =>
    `:x: Skipping <${html_url}|${number}: ${title}> due to failing checks`,
  requireApprovals: ({ html_url, number, title }) =>
    `:x: Skipping <${html_url}|${number}: ${title}> due to insufficient approvals`,
  openedSyncPr: ({ html_url, number }) =>
    `:fast_forward: Created <${html_url}|Stage to Main PR ${number}>`,
};

let github, owner, repo, currPrNumber, core;

let body = `
## common base root URLs
**Homepage :** https://www.stage.adobe.com/
**BACOM:** https://business.stage.adobe.com/fr/
**CC:** https://www.stage.adobe.com/creativecloud.html
**Blog:** https://blog.stage.adobe.com/
**Acrobat:** https://www.stage.adobe.com/acrobat/online/sign-pdf.html

**Milo:**
- Before: https://main--milo--adobecom.hlx.live/?martech=off
- After: https://stage--milo--adobecom.hlx.live/?martech=off
`;

const RCPDates = [
  {
    start: new Date('2024-05-26T00:00:00-07:00'),
    end: new Date('2024-06-01T00:00:00-07:00'),
  },
  {
    start: new Date('2024-06-13T11:00:00-07:00'),
    end: new Date('2024-06-13T14:00:00-07:00'),
  },
  {
    start: new Date('2024-06-30T00:00:00-07:00'),
    end: new Date('2024-07-06T00:00:00-07:00'),
  },
  {
    start: new Date('2024-08-25T00:00:00-07:00'),
    end: new Date('2024-08-31T00:00:00-07:00'),
  },
  {
    start: new Date('2024-09-12T11:00:00-07:00'),
    end: new Date('2024-09-12T14:00:00-07:00'),
  },
  {
    start: new Date('2024-10-14T00:00:00-07:00'),
    end: new Date('2024-11-18T17:00:00-08:00'),
  },
  {
    start: new Date('2024-11-17T00:00:00-08:00'),
    end: new Date('2024-11-30T00:00:00-08:00'),
  },
  {
    start: new Date('2024-12-12T11:00:00-08:00'),
    end: new Date('2024-12-12T14:00:00-08:00'),
  },
  {
    start: new Date('2024-12-15T00:00:00-08:00'),
    end: new Date('2025-01-02T00:00:00-08:00'),
  },
];

const isHighPrio = (labels) => labels.includes(LABELS.highPriority);

const hasFailingChecks = (checks) =>
  checks.some(
    ({ conclusion, name }) =>
      name !== 'merge-to-stage' && conclusion === 'failure'
  );

const getPRs = async () => {
  let prs = await github.rest.pulls
    .list({ owner, repo, state: 'open', per_page: 100, base: STAGE })
    .then(({ data }) => data);
  await Promise.all(prs.map((pr) => addLabels({ pr, github, owner, repo })));
  prs = prs.filter((pr) => pr.labels.includes(LABELS.readyForStage));
  await Promise.all([
    ...prs.map((pr) => addFiles({ pr, github, owner, repo })),
    ...prs.map((pr) => getChecks({ pr, github, owner, repo })),
    ...prs.map((pr) => getReviews({ pr, github, owner, repo })),
  ]);

  prs = prs.filter(({ checks, reviews, html_url, number, title }) => {
    if (hasFailingChecks(checks)) {
      slackNotification(SLACK.failingChecks({ html_url, number, title }));
      if (number === currPrNumber)
        core.setFailed(`Failing checks on the current PR ${number}`);
      return false;
    }

    const approvals = reviews.filter(({ state }) => state === 'APPROVED');
    if (approvals.length < REQUIRED_APPROVALS) {
      slackNotification(SLACK.requireApprovals({ html_url, number, title }));
      if (number === currPrNumber)
        core.setFailed(`Insufficient approvals on the current PR ${number}`);
      return false;
    }

    return true;
  });

  return prs.reverse(); // OLD PRs first
};

const merge = async ({ prs }) => {
  console.log(`Merging ${prs.length || 0} PRs that are ready... `);
  for await (const { number, files, html_url, title, labels } of prs) {
    if (files.some((file) => SEEN[file])) {
      await slackNotification(SLACK.fileOverlap({ html_url, number, title }));
      continue;
    }
    files.forEach((file) => (SEEN[file] = true));
    if (!process.env.LOCAL_RUN)
      await github.rest.pulls.merge({ owner, repo, pull_number: number });
    body = `- [${title}](${html_url})\n${body}`;
    const isHighImpact = labels.includes(LABELS.highImpact);
    if (isHighImpact && process.env.SLACK_HIGH_IMPACT_PR_WEBHOOK) {
      await slackNotification(
        SLACK.merge({ html_url, number, title, highImpact: ' :alert:' }),
        process.env.SLACK_HIGH_IMPACT_PR_WEBHOOK
      );
    }
    await slackNotification(
      SLACK.merge({
        html_url,
        number,
        title,
        highImpact: isHighImpact ? ' :alert:' : '',
      })
    );
  }
};

const getStageToMainPR = () =>
  github.rest.pulls
    .list({ owner, repo, state: 'open', base: PROD })
    .then(({ data } = {}) => data.find(({ title } = {}) => title === PR_TITLE))
    .then((pr) => pr && addLabels({ pr, github, owner, repo }))
    .then((pr) => pr && addFiles({ pr, github, owner, repo }))
    .then((pr) => {
      pr?.files.forEach((file) => (SEEN[file] = true));
      return pr;
    });

const openStageToMainPR = async () => {
  const { data: comparisonData } = await github.rest.repos.compareCommits({
    owner,
    repo,
    base: PROD,
    head: STAGE,
  });

  for (const commit of comparisonData.commits) {
    const { data: pullRequestData } =
      await github.rest.repos.listPullRequestsAssociatedWithCommit({
        owner,
        repo,
        commit_sha: commit.sha,
      });

    for (const pr of pullRequestData) {
      if (!body.includes(pr.html_url))
        body = `- [${pr.title}](${pr.html_url})\n${body}`;
    }
  }

  try {
    const {
      data: { html_url, number },
    } = await github.rest.pulls.create({
      owner,
      repo,
      title: PR_TITLE,
      head: STAGE,
      base: PROD,
      body,
    });
    await slackNotification(SLACK.openedSyncPr({ html_url, number }));
  } catch (error) {
    if (error.message.includes('No commits between main and stage'))
      return console.log('No new commits, no stage->main PR opened');
    throw error;
  }
};

const main = async (params) => {
  github = params.github;
  owner = params.context.repo.owner;
  repo = params.context.repo.repo;
  currPrNumber = params.context.issue?.number;
  core = params.core;

  const now = new Date();
  // We need to revisit this every year
  if (now.getFullYear() !== 2024) {
    throw new Error('ADD NEW RCPs');
  }
  for (const { start, end } of RCPDates) {
    if (start <= now && now <= end) {
      console.log('Current date is within a RCP. Stopping execution.');
      return;
    }
  }
  try {
    const stageToMainPR = await getStageToMainPR();
    console.log('has Stage to Main PR:', !!stageToMainPR);
    if (stageToMainPR?.labels.some((label) => label.includes(LABELS.SOTPrefix)))
      return console.log('PR exists & testing started. Stopping execution.');
    const prs = await getPRs();
    await merge({ prs: prs.filter(({ labels }) => isHighPrio(labels)) });
    await merge({ prs: prs.filter(({ labels }) => !isHighPrio(labels)) });
    if (!stageToMainPR) await openStageToMainPR();
    console.log('Process successfully executed.');
  } catch (error) {
    console.error(error);
  }
};

if (process.env.LOCAL_RUN) {
  const { github, context } = getLocalConfigs();
  main({
    github,
    context,
    core: { setFailed: console.error },
  });
}

module.exports = main;
