// Those env variables are set by an github action automatically
// For local testing, you should test on your fork.
const owner = process.env.REPO_OWNER || ''; // example owner: adobecom
const repo = process.env.REPO_NAME || ''; // example repo name: milo
const auth = process.env.GH_TOKEN || ''; // https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

const getLocalConfigs = () => {
  if (!owner || !repo || !auth) {
    throw new Error(`Create a .env file on the root of the project with credentials.
Then run: node --env-file=.env .github/workflows/update-ims.js`);
  }

  const { Octokit } = require('@octokit/rest');
  return {
    github: { rest: new Octokit({ auth: process.env.GH_TOKEN }) },
    context: {
      repo: {
        owner,
        repo,
      },
    },
  };
};

module.exports = getLocalConfigs;
