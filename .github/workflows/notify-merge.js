const fs = require('fs');

const { slackNotification, getLocalConfigs } = require('./helpers.js');

const SLACK = {
  merge: ({ html_url, number, title, prefix = '' }) =>
    `:merged: PR merged to stage: ${prefix} <${html_url}|${number}: ${title}>.`,
};

const mergeRegex = /Merge pull request #(\d+)/i;

function getRepoInfo() {
  const repoFull = process.env.GITHUB_REPOSITORY; // e.g. "your-org/your-repo"
  if (!repoFull) {
    throw new Error("GITHUB_REPOSITORY is not defined in the environment.");
  }
  const [owner, repo] = repoFull.split('/');
  return { owner, repo };
}

async function getPR(prNumber, owner, repo, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch PR ${prNumber}: ${response.status}`);
  }
  return await response.json();
}

async function main() {
  let prNumbers = new Set();

  // Read event payload if available (from GITHUB_EVENT_PATH)
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

  const { owner, repo } = getRepoInfo();

  const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!githubToken) {
    console.error('No GitHub token provided. Set GITHUB_TOKEN (or GH_TOKEN for local testing).');
    process.exit(1);
  }

  if (prNumbers.size > 0) {
    for (let prNumber of prNumbers) {
      try {
        const pr = await getPR(prNumber, owner, repo, githubToken);
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
    const branch = process.env.GITHUB_REF ? process.env.GITHUB_REF.split('/').pop() : 'unknown';
    const commit = process.env.GITHUB_SHA || 'unknown';
    const commitUrl = `https://github.com/${owner}/${repo}/commit/${commit}`;
    const message = `*Merge Alert!*  
A new merge was detected on *${branch}*.  
[View Commit](${commitUrl})`;
    console.log(`Sending fallback Slack notification: ${message}`);
    await slackNotification(message, process.env.OKAN_SLACK_WEBHOOK);
  }
}

if (process.env.LOCAL_RUN) {
  const { github, context } = getLocalConfigs();
  main({ github, context });
} else {
  main();
}

module.exports = main;
