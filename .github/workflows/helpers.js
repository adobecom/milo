// Those env variables are set by an github action automatically
// For local testing, you should test on your fork.
const owner = process.env.REPO_OWNER || ''; // example owner: adobecom
const repo = process.env.REPO_NAME || ''; // example repo name: milo
const auth = process.env.GH_TOKEN || ''; // https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
const RCPDates = [
  {
    start: new Date('2026-02-22T00:00:00-08:00'),
    end: new Date('2026-03-01T00:00:00-08:00'),
  },
  {
    start: new Date('2026-03-12T11:00:00-07:00'),
    end: new Date('2026-03-12T14:00:00-07:00'),
  },
  {
    start: new Date('2026-04-19T00:00:00-07:00'),
    end: new Date('2026-04-22T00:00:00-07:00'),
  },
  {
    start: new Date('2026-05-24T11:00:00-07:00'),
    end: new Date('2026-05-30T00:00:00-07:00'),
  },
  {
    start: new Date('2026-06-11T11:00:00-07:00'),
    end: new Date('2026-06-11T14:00:00-07:00'),
  },
  {
    start: new Date('2026-06-29T00:00:00-07:00'),
    end: new Date('2026-07-05T00:00:00-07:00'),
  },
  {
    start: new Date('2026-08-23T00:00:00-07:00'),
    end: new Date('2026-08-30T00:00:00-07:00'),
  },
  {
    start: new Date('2026-09-10T11:00:00-07:00'),
    end: new Date('2026-09-10T14:00:00-07:00'),
  },
  {
    start: new Date('2026-11-10T00:00:00-08:00'),
    end: new Date('2026-11-12T23:59:59-08:00'),
  },
  {
    start: new Date('2026-11-22T00:00:00-08:00'),
    end: new Date('2026-11-29T00:00:00-08:00'),
  },
  {
    start: new Date('2026-12-09T11:00:00-08:00'),
    end: new Date('2026-12-09T14:00:00-08:00'),
  },
  {
    start: new Date('2026-12-14T00:00:00-08:00'),
    end: new Date('2027-01-02T00:00:00-08:00'),
  },
];

const isShortRCP = (start, end) => {
  return ((end - start) / (1000 * 60 * 60)) < 24;
};

const isWithinRCP = ({ offset = 0, excludeShortRCP = false } = {}) => {
  const now = new Date();
  const lastRcpDate = RCPDates.reverse()[0];
  if (now > lastRcpDate.end) {
    console.log('ADD NEW RCPs for the current year');
    return true;
  }

  if (RCPDates.some(({ start, end }) => {
    const adjustedStart = new Date(start);
    adjustedStart.setDate(adjustedStart.getDate() - offset);
    const match = adjustedStart <= now && now <= end;
    if (!match || (excludeShortRCP && isShortRCP(start, end))) return false;
    return true;
  })) {
    console.log(
      'Current date is within a RCP (2 days earlier for stage, to keep stage clean & make CSO contributions during an RCP easier). Stopping execution.'
    );
    return true;
  }

  return false;
};

const isWithinPrePostRCP = ({ offset = 7 } = {}) => {
  const now = new Date();
  return RCPDates.some(({ start, end }) => {
    const preRCPStart = new Date(start);
    preRCPStart.setDate(preRCPStart.getDate() - offset);

    const postRCPEnd = new Date(end);
    postRCPEnd.setDate(postRCPEnd.getDate() + offset);

    return (preRCPStart <= now && now < postRCPEnd);
  });
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
      per_page: 100,
    })
    .then(({ data }) => {
      pr.reviews = data;
      return pr;
    });

const isWeekendOrMondayRCP = (start) => {
  const day = new Date(start).getDay();
  return day === 0 || day === 1 || day === 6;
};

const getDaysUntilRCP = (start, now = new Date()) => {
  const rcpStart = new Date(start);
  rcpStart.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.floor((rcpStart - today) / (1000 * 60 * 60 * 24));
};

const isStageFreezeActive = (now = new Date()) => {
  return RCPDates.some(({ start, end }) => {
    if (isShortRCP(start, end)) return false;
    if (!isWeekendOrMondayRCP(start)) return false;
    const days = getDaysUntilRCP(start, now);
    const currentDay = new Date(now).getDay();
    // Monday(1) RCP: Thu(4 days) -> Freeze
    // Sunday(0) RCP: Wed(4 days) -> Skip, Thu(3 days) -> Freeze
    const isThuFriSatSun = currentDay >= 4 || currentDay === 0;
    return days > 0 && days <= 4 && isThuFriSatSun;
  });
};

module.exports = {
  getLocalConfigs,
  slackNotification,
  pulls: { addLabels, addFiles, getChecks, getReviews },
  isShortRCP,
  isWithinRCP,
  isWithinPrePostRCP,
  RCPDates,
  ZERO_IMPACT_PREFIX: '[ZERO IMPACT]',
  isWeekendOrMondayRCP,
  getDaysUntilRCP,
  isStageFreezeActive,
};
