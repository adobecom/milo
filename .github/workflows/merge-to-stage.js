const { slackNotification, getLocalConfigs } = require('./helpers.js');

// Run from the root of the project for local testing: node --env-file=.env .github/workflows/merge-to-stage.js
const PR_TITLE = '[Release] Stage to Main';
const getPRs = async ({ github, owner, repo }) => {
  let prs = await github.rest.pulls
    .list({ owner, repo, state: 'open', per_page: 100, base: 'stage' })
    .then(({ data }) => data);

  await Promise.all(
    prs.map((pr) =>
      github.rest.issues
        .listLabelsOnIssue({ owner, repo, issue_number: pr.number })
        .then(({ data }) => (pr.labels = data.map(({ name }) => name)))
    )
  );

  prs = prs.filter((pr) => pr.labels.includes('Ready for Stage'));

  await Promise.all(
    prs.map((pr) =>
      github.rest.pulls
        .listFiles({ owner, repo, pull_number: pr.number })
        .then(({ data }) => (pr.files = data.map(({ filename }) => filename)))
    )
  );
  return prs.filter((pr) => pr.labels.includes('Ready for Stage')).reverse(); // OLD PRs first
};

const map = {};
const mergePRs = async ({ prs, owner, repo, github }) => {
  for await (const { number, files, html_url, title } of prs) {
    if (files.some((file) => map[file])) {
      await slackNotification(
        `Skipping <${html_url}|${number}: ${title}> due to overlap in files`
      );
      console.log('Skipping PR due to overlap in files ', number);
      continue;
    }

    files.forEach((file) => (map[file] = true));

    await slackNotification(
      `Stage merged PR: <${html_url}|${number}: ${title}>`
    );
    if (process.env.LOCAL_RUN) {
      console.log('DRY merge PR: ', number);
      continue;
    }

    // await github.rest.pulls.merge({ owner, repo, pull_number: number });
  }
};

const main = async ({ github, context }) => {
  const { owner, repo } = context.repo;
  try {
    const stageToMain = await github.rest.pulls
      .list({ owner, repo, state: 'open', base: 'main' })
      .then(({ data }) => data);

    if (stageToMain.some(({ title }) => title === PR_TITLE)) {
      console.log('PR already exists - execution stopped');
      return;
    }

    const prs = await getPRs({ github, owner, repo });
    console.log('PRs ready for stage: ', prs.length);

    // we first want to merge any high priority PRs
    await mergePRs({
      prs: prs.filter(({ labels }) => labels.includes('high priority')),
      owner,
      repo,
      github,
    });

    // and then continue with the rest
    await mergePRs({
      prs: prs.filter(({ labels }) => !labels.includes('high priority')),
      owner,
      repo,
      github,
    });
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
