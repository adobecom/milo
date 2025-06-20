// Run from the root of the project for local testing: node --env-file=.env .github/workflows/pr-reminders.js
const { getLocalConfigs } = require('./helpers.js');
const fs = require('fs');
const SNOW_TRANSACTION_ID_COMMENT = "SNOW Change Request Transaction ID";

const main = async ({ github = getLocalConfigs().github, context = getLocalConfigs().context, transaction_id = process.env.TRANSACTION_ID }) => {
  const comment = async ({ pr_number, message, comments }) => {
    if (comments.some((c) => c.body.includes(message))) {
      console.log(
        `SNOW Transaction Comment exists. Commenting skipped... ${message}`
      );
      return;
    }
    process.env.LOCAL_RUN
      ? console.log(
          `PR #${pr_number} Local execution commenting SKIPPED message for SNOW Change Request: "${message}"`
        )
      : await github.rest.issues
          .createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: pr_number,
            body: message,
            token: process.env.GITHUB_TOKEN,
          })
          .then(() => console.log(`PR #${pr_number} Commented for SNOW Change Request: "${message}"`))
          .catch(console.error);
  };

  try {
    const { data: comments } = await github.rest.issues.listComments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: process.env.PR_NUMBER,
    });

    if (process.env.PR_STATE !== 'open') {
      // find transactionId in a pure way
      const transactionIdComment = comments.find(singleComment => singleComment.body.includes(SNOW_TRANSACTION_ID_COMMENT));

      // Run the effect
      if (transactionIdComment === undefined) {
        console.log(`No SNOW Transaction ID Comment found. Skipping...`);
      } else {
        console.log(`Found SNOW Transaction ID Comment. Assigning transaction ID for closing SNOW Change Request...`);
        const transactionID = transactionIdComment.body.split(`${SNOW_TRANSACTION_ID_COMMENT}: `)?.[1].trim();
        console.log(`Found Transaction ID: ${transactionID}`);
        fs.appendFileSync(process.env.GITHUB_OUTPUT, `retrieved_transaction_id=${transactionID}\n`);
      }

      return;
    }
    else if (transaction_id && transaction_id !== 'null') {
      comment({
        pr_number: process.env.PR_NUMBER,
        comments,
        message:
          `${SNOW_TRANSACTION_ID_COMMENT}: ` + transaction_id,
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

module.exports = main;
