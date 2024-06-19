// Those env variables are set by an github action automatically
// For local testing, you should test on your fork.
const owner = process.env.REPO_OWNER || ''; // example owner: adobecom
const repo = process.env.REPO_NAME || ''; // example repo name: milo
const auth = process.env.GH_TOKEN || ''; // https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const CURRENT_YEAR = 2024;
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

const isWithinRCP = (offset = 0) => {
  const now = new Date();
  if (now.getFullYear() !== CURRENT_YEAR) {
    console.log(`ADD NEW RCPs for ${CURRENT_YEAR + 1}`);
    return true;
  }

  if (RCPDates.some(({ start, end }) => {
    const adjustedStart = new Date(start);
    adjustedStart.setDate(adjustedStart.getDate() - offset);
    return start <= now && now <= end
  })) {
    console.log(
      'Current date is within a RCP (2 days earlier for stage, to keep stage clean & make CSO contributions during an RCP easier). Stopping execution.'
    );
    return true;
  }

  return false;
};

const getLocalConfigs = () => {
  if (!owner || !repo || !auth) {
    throw new Error(`Create a .env file on the root of the project with credentials.
Then run: node --env-file=.env .github/workflows/update-ims.js`);
  }

  const { Octokit } = require('@octokit/rest');
  return {
    github: {
      rest: new Octokit({ auth }),
      repos: {
        createDispatchEvent: () => console.log('local mock createDispatch'),
      },
    },
    context: {
      repo: {
        owner,
        repo,
      },
    },
  };
};

const slackNotification = (text, webhook) => {
  console.log(text);
  return fetch(webhook || process.env.MILO_RELEASE_SLACK_WH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
};

const addLabels = ({ pr, github, owner, repo }) =>
  github.rest.issues
    .listLabelsOnIssue({ owner, repo, issue_number: pr.number })
    .then(({ data }) => {
      pr.labels = data.map(({ name }) => name);
      return pr;
    });

const addFiles = ({ pr, github, owner, repo }) =>
  github.rest.pulls
    .listFiles({ owner, repo, pull_number: pr.number })
    .then(({ data }) => {
      pr.files = data.map(({ filename }) => filename);
      return pr;
    });

const getChecks = ({ pr, github, owner, repo }) =>
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

const getReviews = ({ pr, github, owner, repo }) =>
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

module.exports = {
  getLocalConfigs,
  slackNotification,
  pulls: { addLabels, addFiles, getChecks, getReviews },
  isWithinRCP,
};
