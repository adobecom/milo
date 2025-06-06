const { slackNotification, getLocalConfigs } = require('./helpers.js');

async function main({ github, context } = {}) {
    if (!github || !context) {
        throw new Error("GitHub context is missing. Ensure you are running in the correct environment.");
    }

    if (process.env.LOCAL_RUN) {
        console.log("Local run detected. Loading local configurations...");
        const localConfigs = getLocalConfigs();
        github = localConfigs.github;
        context = localConfigs.context;
    }

    const { pull_request } = context.payload;
    if (!pull_request) {
        console.log("No pull_request found in context payload. Skipping notification.");
        return;
    }

    const { number, title, html_url, base } = pull_request;
    const isStage = base.ref === 'stage';
    const prefix = isStage
        ? ':merged: PR merged to stage:'
        : ':rocket: Production release:';

    console.log(`Sending notification for PR #${number}: ${title}`);

    try {
        await slackNotification(
            `${prefix} <${html_url}|#${number}: ${title}>.`,
            process.env.MILO_RELEASE_SLACK_WH
        );
    } catch (error) {
        console.error("Error sending Slack notification:", error.message);
        console.log("Continuing with PR update...");
    }
    
    if (['stage', 'main'].includes(base.ref)) {
        await updateStageToMainPR(github, context, pull_request);
    }
}

async function updateStageToMainPR(github, context, mergedPR) {
  const owner = context.repo.owner; 
  const repo = context.repo.repo;
  const PR_TITLE = '[Release] Stage to Main';

  try {
    const stageToMain = await github.rest.pulls
        .list({owner, repo, state: 'open', base: 'main'})
        .then(({ data } = {}) => data.find(({ title } = {}) => title === PR_TITLE));

    if (!stageToMain || stageToMain.body.includes(mergedPR.html_url)) {
      return;
    }
    
    const body = `- ${mergedPR.html_url}\n${stageToMain.body || ''}`;
    console.log("Updating PR's description");

    await github.rest.pulls.update({
      owner,
      repo,
      pull_number: stageToMain.number,
      body,
    });

    console.log(`Updated Stage to Main PR #${stageToMain.number} with manually merged PR #${mergedPR.number}`);
  } catch (error) {
    console.error("Error updating Stage to Main PR:", error.message);
  }
}

if (process.env.LOCAL_RUN) {
  const { github, context } = getLocalConfigs();
  main({ github, context });
}

module.exports = main;
