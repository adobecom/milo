const { slackNotification, getLocalConfigs, ZERO_IMPACT_PREFIX } = require('./helpers.js');

const LABELS = {
  zeroImpact: 'zero-impact',
};

async function main({ github = getLocalConfigs().github, context = getLocalConfigs().context } = {}) {
    const { payload = {} } = context;
    const { pull_request } = payload;
    if (!pull_request) {
        console.log("No pull_request found in context payload. Skipping notification.");
        return;
    }

    const { number, title, html_url, base = {} } = pull_request;
    const { ref: baseRef } = base;
    const isStage = baseRef === 'stage';
    const prefix = isStage
        ? ':merged: PR merged to stage:'
        : ':rocket: Production release:';
    console.log(`Sending notification for PR #${number}: ${title}`);
    await slackNotification(
      `${prefix} <${html_url}|#${number}: ${title}>.`,
      process.env.MILO_RELEASE_SLACK_WH
    ).catch(e => console.error("Error sending Slack notification:", e.message))

    await updateStageToMainPR(github, context, pull_request);
}

async function updateStageToMainPR(github, context, mergedPR) {
  const { base = {} } = mergedPR;
  const { ref: baseRef } = base;
  if (baseRef !== 'stage') return;
  
  const { repo = {} } = context;
  const { owner, repo: repoName } = repo;
  const PR_TITLE = '[Release] Stage to Main';
  const { data: pulls = [] } = await github.rest.pulls
      .list({owner, repo: repoName, state: 'open', base: 'main'});
  
  const stageToMain = pulls.find(({ title } = {}) => title === PR_TITLE);
  if (!stageToMain || stageToMain.body?.includes(mergedPR.html_url)) {
    return;
  }
  const isZeroImpact = mergedPR.labels?.some(label => label.name === LABELS.zeroImpact);
  const zeroImpactPrefix = isZeroImpact ? ` ${ZERO_IMPACT_PREFIX}` : '';
  const body = `-${zeroImpactPrefix} ${mergedPR.html_url}\n${stageToMain.body || ''}`;
  console.log("Updating PR's description");

  await github.rest.pulls.update({
    owner,
    repo: repoName,
    pull_number: stageToMain.number,
    body,
  });

  console.log(`Updated the description of the Stage to Main PR #${stageToMain.number} with manually merged PR #${mergedPR.number}`);
}

if (process.env.LOCAL_RUN) {
    console.log("Local run detected. Loading local configurations...");
    main();
}

module.exports = main;
