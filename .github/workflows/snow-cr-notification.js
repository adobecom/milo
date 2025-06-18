const { slackNotification, getLocalConfigs } = require('./helpers.js');

async function main({
  github = getLocalConfigs().github,
  context = getLocalConfigs().context,
  transaction_id = process.env.TRANSACTION_ID,
  change_id = process.env.CHANGE_ID,
  planned_start_time = process.env.PLANNED_START_TIME,
  planned_end_time = process.env.PLANNED_END_TIME
} = {}) {
    if (!github || !context) {
        throw new Error("GitHub context is missing. Ensure you are running in the correct environment.");
    }

    const { pull_request } = context.payload;
    if (!pull_request) {
        console.log("No pull_request found in context payload. Skipping notification.");
        return;
    }

    const { number, title, html_url } = pull_request;
    const isOpen = process.env.PR_STATE === 'open';
    const prefix = isOpen
        ? ':servicenow_logo: ServiceNow Change Request Created and in progress: Transaction ID: ' + transaction_id + '\n: Planned start: ' + planned_start_time + ' | end: ' + planned_end_time + ' | '
        : ':servicenow_logo: ServiceNow Change Request Closed: Search for Change Record by Change ID: ' + change_id + ' or search for it by planned start, end time\n:';

    console.log(`Sending SNOW CR notification for PR #${number}: ${title}`);

    await slackNotification(
        `${prefix} <${html_url}|#${number}>.`,
        process.env.MILO_RELEASE_SLACK_WH
    );
}

module.exports = main;
