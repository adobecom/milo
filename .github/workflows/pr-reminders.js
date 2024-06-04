// Run from the root of the project for local testing: node --env-file=.env .github/workflows/pr-reminders.js
const { getLocalConfigs } = require('./helpers.js');

const main = async ({ github, context }) => {
  const comment = async ({ pr, message, comments }) => {
    if (comments.some((c) => c.body.includes(message))) {
      console.log(
        `PR #${pr.number} Comment exists. Commenting skipped... ${message}`
      );
      return;
    }
    process.env.LOCAL_RUN
      ? console.log(
          `PR #${pr.number} Local execution commenting SKIPPED message: ${message}`
        )
      : await github.rest.issues
          .createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: pr.number,
            body: message,
          })
          .then(() => console.log(`PR #${pr.number} Commented: ${message}`))
          .catch(console.error);
  };

  const getLatestChecks = async ({ pr }) => {
    const { data: checks } = await github.rest.checks
      .listForRef({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: pr.head.sha,
      })
      .catch((error) => {
        console.error(error);
        return { data: { check_runs: [] } };
      });
    const checksByName = checks.check_runs.reduce((map, check) => {
      if (
        !map.has(check.name) ||
        new Date(map.get(check.name).completed_at) <
          new Date(check.completed_at)
      ) {
        map.set(check.name, check);
      }
      return map;
    }, new Map());
    return Array.from(checksByName.values());
  };

  try {
    const { data: openPRs } = await github.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
      base: 'stage',
    });

    for await (const pr of openPRs) {
      const { data: labels } = await github.rest.issues.listLabelsOnIssue({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pr.number,
      });

      if (
        labels.some(
          ({ name } = {}) => name === 'Ready for Stage' || name === 'Stale'
        )
      ) {
        console.log(
          `PR #${pr.number} has the 'Ready for Stage' or 'Stale' label. Skipping...`
        );
        continue;
      }

      const { data: comments } = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pr.number,
      });

      const latestChecks = await getLatestChecks({ github, context, pr });
      if (latestChecks.some((check) => check.conclusion === 'failure')) {
        comment({
          pr,
          comments,
          message:
            'This pull request is not passing all required checks. Please see [this discussion](https://github.com/orgs/adobecom/discussions/997) for information on how to get all checks passing. Inconsistent checks can be manually retried. If a test absolutely can not pass for a good reason, please add a comment with an explanation to the PR.',
        });
        continue;
      }

      const { data: reviews } = await github.rest.pulls.listReviews({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pr.number,
      });

      if (reviews.some((review) => review.state === 'CHANGES_REQUESTED')) {
        console.log(`PR #${pr.number} has changes requested. Skipping...`);
        continue;
      }

      if (reviews.filter((review) => review.state === 'APPROVED').length < 2) {
        console.log(`PR #${pr.number} has less than 2 approvals. Skipping...`);
        continue;
      }

      if (labels.some(({ name } = {}) => name === 'needs-verification')) {
        comment({
          pr,
          comments,
          message:
            'This PR is currently in the `needs-verification` state. Please assign a QA engineer to verify the changes.',
        });
        continue;
      }

      comment({
        pr,
        comments,
        message:
          'Reminder to set the `Ready for Stage` label - to queue this to get merged to stage & production.',
      });
    }
  } catch (error) {
    console.error(error);
  }
};

if (process.env.LOCAL_RUN) {
  const { github, context } = getLocalConfigs();
  main({
    github,
    context,
  });
}

module.exports = main;
