const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');

// Run from the root of the project for local testing: node --env-file=.env .github/workflows/update-script.js
const localExecution = process.env.LOCAL_RUN || false;
const localRunConfigs = {
  branch: process.env.LOCAL_RUN_BRANCH || 'update-imslib',
  title: process.env.LOCAL_RUN_TITLTE || '[AUTOMATED-PR] Update imslib.min.js dependency',
  path: process.env.LOCAL_RUN_SCRIPT || 'https://auth.services.adobe.com/imslib/imslib.min.js',
  scriptPath: process.env.LOCAL_RUN_SCRIPT_PATH || './libs/deps/imslib.min.js',
  origin: process.env.LOCAL_RUN_ORIGIN || 'origin',
};

const getPrDescription = ({ branch, scriptPath }) => `## Description
Update ${scriptPath} to the latest version
## Related Issue
Resolves: NO TICKET - AUTOMATED CREATED PR.
## Testing instructions
1. Signing in should still function
2. Signing out should still work
3. Regression tests on all consumers
## Test URLs
**Acrobat:**
- Before: https://www.stage.adobe.com/acrobat/online/sign-pdf.html?martech=off
- After: https://www.stage.adobe.com/acrobat/online/sign-pdf.html?martech=off&milolibs=${branch}--milo--adobecom
**BACOM:**
- Before: https://business.stage.adobe.com/fr/customer-success-stories.html?martech=off
- After: https://business.stage.adobe.com/fr/customer-success-stories.html?martech=off&milolibs=${branch}--milo--adobecom
**CC:**
- Before: https://main--cc--adobecom.hlx.live/?martech=off
- After: https://main--cc--adobecom.hlx.live/?martech=off&milolibs=${branch}--milo--adobecom
**Homepage:**
- Before: https://main--homepage--adobecom.hlx.page/homepage/index-loggedout?martech=off
- After: https://main--homepage--adobecom.hlx.page/homepage/index-loggedout?martech=off&milolibs=${branch}--milo--adobecom
**Blog:**
- Before: https://main--blog--adobecom.hlx.page/?martech=off
- After: https://main--blog--adobecom.hlx.page/?martech=off&milolibs=${branch}--milo--adobecom
**Milo:**
- Before: https://main--milo--adobecom.hlx.page/ch_de/drafts/ramuntea/gnav-refactor?martech=off
- After: https://${branch}--milo--adobecom.hlx.page/ch_de/drafts/ramuntea/gnav-refactor?martech=off`;

const fetchScript = (path) => new Promise((resolve, reject) => {
  console.log(`Fetching script from ${path}`);
  https
    .get(path, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`statusCode=${res.statusCode}`));
      }

      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve({
          data,
          headers: res.headers,
        });
      });
    })
    .on('error', (err) => {
      reject(err);
    });
});

// Use this for conditional execution of commands
const execSyncSafe = (command) => {
  try {
    execSync(command);
  } catch (error) {
    console.log(`Skipped command ${command}`);
  }
};

const createAndPushBranch = ({ script, branch, scriptPath, origin = 'origin' }) => {
  // When testing locally, u likely do not want to kill your dev branch
  if (!localExecution) {
    execSync('git config --global user.name "GitHub Action"');
    execSync('git config --global user.email "action@github.com"');
    execSync('git fetch');
    execSync('git checkout stage');
    execSyncSafe(`git branch -D ${branch}`);
    execSync(`git checkout -b ${branch}`);
  }
  console.log('writing script to file', scriptPath);
  fs.writeFileSync(scriptPath, script);
  execSync(`git add ${scriptPath}`);
  execSyncSafe('git commit -m "Update self hosted dependency"');
  execSync(`git push --force ${origin} ${branch}`);
};

const main = async ({
  github, context, title, path, branch, scriptPath, origin,
}) => {
  try {
    const { data: script } = await fetchScript(path);
    const selfHostedScript = fs.existsSync(scriptPath) && fs.readFileSync(scriptPath, 'utf8');
    const scriptHasChanged = script !== selfHostedScript;
    console.log(`Validating if "${scriptPath}" has changed. Script change: ${scriptHasChanged}`);

    if (scriptHasChanged || localExecution) {
      const { data: openPRs } = await github.rest.pulls.list({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: 'open',
      });

      const hasPR = openPRs.find((pr) => pr.head.ref === branch);
      if (hasPR) return console.log(`PR already exists for branch ${branch}. Execution stopped.`);

      createAndPushBranch({ script, branch, scriptPath, origin });

      const pr = await github.rest.pulls.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title,
        head: branch,
        base: 'stage',
        body: getPrDescription({ branch, scriptPath }),
      });

      await github.rest.issues.addLabels({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: pr.data.number,
        labels: ['needs-verification'],
      });

      await github.rest.pulls.requestReviewers({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: pr.data.number,
        team_reviewers: ['admins'],
        reviewers: ['mokimo', 'overmyheadandbody', 'narcis-radu', 'robert-bogos'],
      });
    }
  } catch (error) {
    console.error(`An error occurred while running workflow for ${title}`, error);
  }
};

if (localExecution) {
  const { github, context } = require('./localWorkflowConfigs.js')();
  main({
    github,
    context,
    title: localRunConfigs.title,
    path: localRunConfigs.path,
    branch: localRunConfigs.branch,
    scriptPath: localRunConfigs.scriptPath,
    origin: localRunConfigs.origin,
  });
}

module.exports = main;
