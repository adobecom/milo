const { slackNotification } = require('./helpers'); // Adjust the path if needed

module.exports = async ({ github, context }) => {
  try {
    const branch = context.ref.split('/').pop();
    const commit = context.sha;
    const { owner, repo } = context.repo;
    const commitUrl = `https://github.com/${owner}/${repo}/commit/${commit}`;

    const message = `*Merge Alert!*  
    A new merge was detected on *${branch}* in \`${owner}/${repo}\`.  
    [View Commit](${commitUrl})`;

    console.log(`Sending Slack Notification: ${message}`);

    await slackNotification(message, process.env.OKAN_SLACK_WEBHOOK);
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    throw error;
  }
};
