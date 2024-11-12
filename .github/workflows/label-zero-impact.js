const { getLocalConfigs } = require('./helpers.js');
const zeroImpactDirs = [
  '.github',
  '.kodiak',
  '.vscode',
  '.test',
  '.browserslistrc',
  '.gitignore',
  '.eslintrc.js',
  'CODEOWNERS',
  'web-test-runner.config.mjs',
  'LICENSE',
  'codecov.yaml',
  'package.json',
  'package-lock.json',
  'test',
  'libs/mep',
  'nala'
];
const zeroImpactLabel = 'zero-impact';

// Run from the root of the project for local testing: node --env-file=.env .github/workflows/label-zero-impact.js
const main = async ({ github, context }) => {
  const number = context.issue?.number || process.env.ISSUE;
  const owner = context.repo.owner;
  const repo = context.repo.repo;

  try {
    const { data: files } = await github.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: number,
    });

    const isZeroImpactPR = files.every(({ filename }) =>
      zeroImpactDirs.some((dir) => filename.startsWith(dir))
    );
    console.log(`PR ${number} is zero impact: ${isZeroImpactPR}.`);
    if (isZeroImpactPR) {
      console.log('Adding zero-impact label to PR.');
      await github.rest.issues.addLabels({
        owner,
        repo,
        issue_number: number,
        labels: [zeroImpactLabel],
      });
    } else {
      console.log('Removing zero-impact label from PR.');
      await github.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: number,
        name: zeroImpactLabel,
      });
      console.log('Posting a comment on the PR.');
      await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: number,
        body: 'This PR does not qualify for the zero-impact label as it touches code outside of the allowed areas. The label is auto applied, do not manually apply the label.',
      });
    }

    console.log('Process successfully executed.');
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
