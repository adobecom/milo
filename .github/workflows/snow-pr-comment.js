// Run from the root of the project for local testing: node --env-file=.env .github/workflows/pr-reminders.js
const { getLocalConfigs } = require('./helpers.js');
const { fs } = require('fs');

const main = async ({ github, context }) => {
  const comment = async ({ pr_number, message, comments, transaction_id }) => {
    if (comments.some((c) => c.body.includes(message))) {
      console.log(
        `SNOW Transaction Comment exists. Commenting skipped... ${message}`
      );
      return;
    }
    process.env.LOCAL_RUN
      ? console.log(
          `PR #${pr_number} Local execution commenting SKIPPED message for SNOW Transaction ID ${transaction_id}: ${message}`
        )
      : await github.rest.issues
          .createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: pr_number,
            body: message,
          })
          .then(() => console.log(`PR #${pr_number} Commented for SNOW Transaction ID ${transaction_id}: ${message}`))
          .catch(console.error);
  };

  try {
    const { data: comments } = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: process.env.PR_NUMBER,
    });

    if (process.env.PR_STATE !== 'open') {
      let foundTransactionId = false;
      for await (const singleComment of comments) {
        if (singleComment.body.includes("SNOW Change Request Transaction ID: ")) {
          console.log(`Found SNOW Transaction ID Comment. Assigning transaction ID for closing SNOW Change Request...`);
          foundTransactionId = true;
          const transaction_id = singleComment.body.split("SNOW Change Request Transaction ID: ")[1].trim();
          fs.appendFileSync(process.env.GITHUB_OUTPUT, `TRANSACTION_ID=${transaction_id}\n`);
          break;
        }
      }
      if (!foundTransactionId) {
        console.log(`No SNOW Transaction ID Comment found. Skipping...`);
        return;
      }
    }
    else if (process.env.TRANSACTION_ID) {
      comment({
        pr_number: process.env.PR_NUMBER,
        comments,
        transaction_id: process.env.TRANSACTION_ID,
        message:
          'SNOW Change Request Transaction ID: ' + process.env.TRANSACTION_ID,
      });
    }
    else {
      console.log(`No SNOW Transaction ID found. Can't make PR comment. Skipping...`);
      return;
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
