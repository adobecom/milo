// notify-merge.js

const fs = require('fs');
const { slackNotification, getLocalConfigs } = require('./helpers.js');

// Use the same Slack message template as in merge-to-stage.js.
const SLACK = {
  merge: ({ html_url, number, title, prefix = '' }) =>
    `:merged: PR merged to stage: ${prefix} <${html_url}|${number}: ${title}>.`,
};

const mergeRegex = /Merge pull request #(\d+)/i;

async function main({ github, context }) {
  let prNumbers = new Set();

  // If GITHUB_EVENT_PATH is available, use it to extract commit info.
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (eventPath) {
    try {
      const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
      const commits = eventData.commits || [];
      commits.forEach((commit) => {
        const message = commit.message || '';
        const match = mergeRegex.exec(message);
        if (match && match[1]) {
          prNumbers.add(match[1]);
        }
      });
    } catch (error) {
      console.error('Error reading event payload:', error);
    }
  }

  // If we found merge commit(s), fetch PR details and send notifications.
  if (prNumbers.size > 0) {
    const { owner, repo } = context.repo;
    for (let prNumber of prNumbers) {
      try {
        const { data: pr } = await github.rest.pulls.get({
          owner,
          repo,
          pull_number: prNumber,
        });
        const message = SLACK.merge({
          html_url: pr.html_url,
          number: pr.number,
          title: pr.title,
          prefix: '',
        });
        console.log(`Sending notification for PR #${pr.number}: ${pr.title}`);
        await slackNotification(message, process.env.OKAN_SLACK_WEBHOOK);
      } catch (error) {
        console.error(`Error fetching or notifying for PR #${prNumber}:`, error);
      }
    }
    console.log('All notifications processed from event payload.');
  } else {
    // Fallback: use the GitHub Actions context to send a generic message.
    const branch = context.ref.split('/').pop();
    const commit = context.sha;
    const { owner, repo } = context.repo;
    const commitUrl = `https://github.com/${owner}/${repo}/commit/${commit}`;
    const message = `*Merge Alert!*  
A new merge was detected on *${branch}* in \`${owner}/${repo}\`.  
[View Commit](${commitUrl})`;
    console.log(`Sending fallback Slack notification: ${message}`);
    await slackNotification(message, process.env.OKAN_SLACK_WEBHOOK);
  }
}

if (process.env.LOCAL_RUN) {
  const { github, context } = getLocalConfigs();
  main({ github, context });
} else {
  const { getOctokit, context } = require('@actions/github');
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }
  const octokit = getOctokit(githubToken);
  main({ github: octokit, context });
}

module.exports = main;
