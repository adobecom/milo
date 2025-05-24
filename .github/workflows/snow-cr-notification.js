const { slackNotification, getLocalConfigs } = require('./helpers.js');

async function main({ github, context, transaction_id, change_id, planned_start_time, planned_end_time } = {}) {
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
    const isOpen = process.env.PR_STATE === 'open';
    const prefix = isOpen
        ? ':exclamation: ServiceNow Change Request Created and in progress: Transaction ID: ' + transaction_id + '\n:'
        : ':exclamation: ServiceNow Change Request Closed: Search for Change Record by Change ID: ' + change_id + '\n or Planned Start Time: ' + planned_start_time + '\n and/or Planned End Time: ' + planned_end_time + '\n:';

    console.log(`Sending SNOW CR notification for PR #${number}: ${title}`);

    await slackNotification(
        `${prefix} <${html_url}|#${number}: ${title}>.`,
        process.env.MILO_RELEASE_SLACK_WH
    );
}

if (process.env.LOCAL_RUN) {
    const { github, context } = getLocalConfigs();
    main({ github, context });
}

module.exports = main;
