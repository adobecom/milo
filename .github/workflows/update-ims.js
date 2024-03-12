const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');

const fetch = () => new Promise((resolve, reject) => {
  https.get('https://auth.services.adobe.com/imslib/imslib.min.js', (res) => {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return reject(new Error('statusCode=' + res.statusCode));
    }

    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      resolve({
        data,
        headers: res.headers
      });
    });

  }).on('error', (err) => {
    reject(err);
  });
});

const main = async ({github, context, local = false}) => {
  const response = await fetch();
  const lastModified = new Date(response.headers['last-modified']);
  const now = new Date();
  const diffHours = Math.ceil((now - lastModified) / 1000 / 60 / 60);
  console.log(`imslib.min.js last modified: ${lastModified}. Last modified ${diffHours} hours ago <= 24H, means new PR created.`);

  if (diffHours <= 2400 || local) {
    console.log("Diff detected in the last 24h, creating PR.")
    const header = `// Last modified ${lastModified.toISOString()}\n// Build at ${new Date().toISOString()}\n`;

    if (local) return console.log("Local mode - skipped git commands.")
    // If you run this on local, this might overwrite ur current git configs.
    if(!local) execSync('git config --global user.name "GitHub Action"');
    if(!local) execSync('git config --global user.email "action@github.com"');
    execSync('git fetch');
    execSync('git checkout stage');
    try {
      execSync('git branch -D update-imslib');
    } catch (error) {
      console.log('update-imslib branch not found, skipping delete');
    }
    execSync('git checkout -b update-imslib');
    fs.writeFileSync(`${local ? '../../' : ''}libs/deps/imslib.min.js`, header + response.data);
    execSync('git add libs/deps/imslib.min.js');
    execSync('git commit -m "Update imslib.min.js"');
    execSync('git push --force origin update-imslib');

    await github.rest.pulls.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: 'Update imslib.min.js',
      head: 'update-imslib',
      base: 'stage',
      body: `
## Description
Update imslib.min.js to the latest version

## Related Issue
Resolves: NO TICKET - AUTOMATED CREATED PR.

## Testing instructions
1. Signing in should still function
2. Signing out should still work
3. Regression tests on all consumers

## Test URLs
**Acrobat:**
- Before: https://www.stage.adobe.com/acrobat/online/sign-pdf.html?martech=off
- After: https://www.stage.adobe.com/acrobat/online/sign-pdf.html?martech=off&milolibs=update-imslib--milo--adobecom

**BACOM:**
- Before: https://business.stage.adobe.com/fr/customer-success-stories.html?martech=off
- After: https://business.stage.adobe.com/fr/customer-success-stories.html?martech=off&milolibs=update-imslib--milo--adobecom

**CC:**
- Before: https://main--cc--adobecom.hlx.live/?martech=off
- After: https://main--cc--adobecom.hlx.live/?martech=off&milolibs=update-imslib--milo--adobecom

**Homepage:**
- Before: https://main--homepage--adobecom.hlx.page/homepage/index-loggedout?martech=off
- After: https://main--homepage--adobecom.hlx.page/homepage/index-loggedout?martech=off&milolibs=update-imslib--milo--adobecom

**Blog:**
- Before: https://main--blog--adobecom.hlx.page/
- After: https://main--blog--adobecom.hlx.page/?milolibs=update-imslib--milo--adobecom

**Milo:**
- Before: https://main--milo--adobecom.hlx.page/ch_de/drafts/ramuntea/gnav-refactor?martech=off
- After: https://update-imslib--milo--adobecom.hlx.page/ch_de/drafts/ramuntea/gnav-refactor?martech=off`
    });
  }
}

// Enable and just run node update-ims.js to debug locally
// main({local: true})

module.exports = main