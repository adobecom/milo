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

  const { number, title, html_url } = pull_request;
  console.log(`Sending notification for PR #${number}: ${title}`);

  await slackNotification(
    `:merged: PR merged to stage <${html_url}|#${number}: ${title}>.`,
    process.env.MILO_RELEASE_SLACK_WH
  );
}

if (process.env.LOCAL_RUN) {
  const { github, context } = getLocalConfigs();
  main({ github, context });
}

module.exports = main;
