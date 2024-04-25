const { slackNotification, getLocalConfigs } = require('./helpers.js');

// Run from the root of the project for local testing: node --env-file=.env .github/workflows/merge-to-stage.js
const PR_TITLE = '[Release] Stage to Main';
const seen = {};
const requiredApprovals = process.env.LOCAL_RUN ? 0 : 2;
let github, owner, repo;

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

const addLabels = ({ pr }) =>
  github.rest.issues
    .listLabelsOnIssue({ owner, repo, issue_number: pr.number })
    .then(({ data }) => {
      pr.labels = data.map(({ name }) => name);
      return pr;
    });

const addFiles = ({ pr }) =>
  github.rest.pulls
    .listFiles({ owner, repo, pull_number: pr.number })
    .then(({ data }) => {
      pr.files = data.map(({ filename }) => filename);
      return pr;
    });

const getChecks = ({ pr }) =>
  github.rest.checks
    .listForRef({ owner, repo, ref: pr.head.sha })
    .then(({ data }) => {
      const checksByName = data.check_runs.reduce((map, check) => {
        if (
          !map.has(check.name) ||
          new Date(map.get(check.name).completed_at) <
            new Date(check.completed_at)
        ) {
          map.set(check.name, check);
        }
        return map;
      }, new Map());
      pr.checks = Array.from(checksByName.values());
      return pr;
    });

const getReviews = ({ pr }) =>
  github.rest.pulls
    .listReviews({
      owner,
      repo,
      pull_number: pr.number,
    })
    .then(({ data }) => {
      pr.reviews = data;
      return pr;
    });

const getPRs = async () => {
  let prs = await github.rest.pulls
    .list({ owner, repo, state: 'open', per_page: 100, base: 'stage' })
    .then(({ data }) => data);
  await Promise.all(prs.map((pr) => addLabels({ pr })));
  prs = prs.filter((pr) => pr.labels.includes('Ready for Stage'));
  await Promise.all([
    ...prs.map((pr) => addFiles({ pr })),
    ...prs.map((pr) => getChecks({ pr })),
    ...prs.map((pr) => getReviews({ pr })),
  ]);

  prs = prs.filter(({ checks, reviews, html_url, number, title }) => {
    if (checks.some(({ conclusion }) => conclusion === 'failure')) {
      slackNotification(
        `:x: Skipping <${html_url}|${number}: ${title}> due to failing checks`
      );
      return false;
    }

    const approvals = reviews.filter(({ state }) => state === 'APPROVED');
    if (approvals.length < requiredApprovals) {
      slackNotification(
        `:x: Skipping <${html_url}|${number}: ${title}> due to insufficient approvals`
      );
      return false;
    }

    return true;
  });

  return prs.reverse(); // OLD PRs first
};

const mergePRs = async ({ prs }) => {
  for await (const { number, files, html_url, title } of prs) {
    if (files.some((file) => seen[file])) {
      const message = `:fast_forward: Skipping <${html_url}|${number}: ${title}> due to overlap in files.`;
      await slackNotification(message);
      continue;
    }

    files.forEach((file) => (seen[file] = true));

    if (!process.env.LOCAL_RUN)
      await github.rest.pulls.merge({ owner, repo, pull_number: number });
    await slackNotification(
      `:merged: Stage merge PR <${html_url}|${number}: ${title}>.`
    );
    body = `- [${title}](${html_url})\n${body}`;
  }
};

const getStageToMainPR = () =>
  github.rest.pulls
    .list({ owner, repo, state: 'open', base: 'main' })
    .then(({ data } = {}) => data.find(({ title } = {}) => title === PR_TITLE))
    .then((pr) => pr && addLabels({ pr }))
    .then((pr) => pr && addFiles({ pr }))
    .then((pr) => {
      pr?.files.forEach((file) => (seen[file] = true));
      return pr;
    });

const openStageToMainPR = async () => {
  const { data } = await github.rest.repos.compareCommits({
    owner,
    repo,
    base: 'main',
    head: 'stage',
  });
  if (data.status !== 'divergent') return console.log('Stage&Main are equal');

  const { data: pr } = await github.rest.pulls.create({
    owner,
    repo,
    title: '[Release] Stage to Main',
    head: 'stage',
    base: 'main',
    body,
  });

  await slackNotification(
    `:sync_icon2: Prod release PR <${pr.html_url}|#${pr.number}> has been opened`
  );
};
const main = async (params) => {
  github = params.github;
  owner = params.context.repo.owner;
  repo = params.context.repo.repo;

  const now = new Date();
  for (const { start, end } of RCPDates) {
    if (start <= now && now <= end) {
      console.log('Current date is within a RCP. Stopping execution.');
      process.exit(0);
    }
  }
  try {
    // TODO - test if existing PR adds to the seenFiles map
    const stageToMainPR = await getStageToMainPR();
    if (stageToMainPR?.labels.includes('SOT')) return console.log('PR exists');

    const prs = await getPRs();
    await mergePRs({
      prs: prs.filter(({ labels }) => labels.includes('high priority')),
    });
    await mergePRs({
      prs: prs.filter(({ labels }) => !labels.includes('high priority')),
    });
    await openStageToMainPR();
  } catch (error) {
    console.error(error);
  }
};

if (process.env.LOCAL_RUN) {
  const { github, context } = getLocalConfigs();
  main({
    github,
    context,
  });
}

module.exports = main;
