const { execSync } = require('child_process');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const postcss = require('postcss');

// Run locally: npm run build:s2a (build only)
// Run in CI: Called by Github action (build + PR)

const BRANCH = 'update-s2a-styles';
const TITLE = '[AUTOMATED-PR] Update S2A style tokens';
const TARGET_FILE = './libs/c2/styles/styles.css';
const DEPS_DIR = './libs/c2/styles/deps';

// S2A Build Logic
function trimWhitespace(str) {
  return str.replace(/\s/g, '');
}

function isS2aVar(decl) {
  return decl.startsWith('--s2a-');
}

function isTokensFile(f) {
  return f.isFile()
    && f.name.startsWith('tokens.')
    && f.name.endsWith('.css');
}

async function getCssFiles(dir) {
  const dirEntries = await fsp.readdir(dir, { withFileTypes: true });
  return dirEntries
    .filter(isTokensFile)
    .map((f) => path.join(dir, f.name));
}

function getSelectorMode(sel) {
  const s = trimWhitespace(sel);
  if (s === ':root') return 'light';
  if (s === '.dark') return 'dark';
  const match = s.match(/^:root\[data-theme\s*=\s*("|')(\w+)\1?\]$/);
  return match ? match[2] : 'light';
}

function extractDeclsFromRule(rule) {
  return rule.nodes.filter((node) => node.type === 'decl');
}

function limitDecimals(str) {
  return str.replace(/(\d+\.\d{4})\d*/g, '$1');
}

async function buildS2AStyles() {
  const depsDir = path.resolve(DEPS_DIR);
  const targetFile = path.resolve(TARGET_FILE);
  const cssFiles = await getCssFiles(depsDir);

  const rootDecls = [];
  const darkDecls = [];
  const updatedVars = [];
  const newVars = [];
  const deletedVars = [];

  const extractRules = (ast) => ast.nodes.filter((node) => node.type === 'rule');

  for (const file of cssFiles) {
    const code = await fsp.readFile(file, 'utf8');
    const ast = postcss.parse(code);

    for (const rule of extractRules(ast)) {
      const sel = trimWhitespace(rule.selector);
      const mode = getSelectorMode(sel);
      const targetDecls = mode === 'dark' ? darkDecls : rootDecls;

      for (const decl of extractDeclsFromRule(rule)) {
        if (isS2aVar(decl.prop)) {
          targetDecls.push({ ...decl, value: limitDecimals(decl.value) });
        }
      }
    }
  }

  const rootDeclMap = {};
  for (const decl of rootDecls) {
    rootDeclMap[decl.prop] = decl.value;
  }

  const filteredDarkDecls = darkDecls.filter(
    (darkDecl) => !(darkDecl.prop in rootDeclMap
      && rootDeclMap[darkDecl.prop] === darkDecl.value),
  );

  let cssText;
  try {
    cssText = await fsp.readFile(targetFile, 'utf8');
  } catch (e) {
    console.error(`Error: ${targetFile} not found, cannot patch its --s2a- variables`);
    throw e;
  }

  const ast = postcss.parse(cssText);

  function patchDeclarationsForSelector(selector, varsMap) {
    let foundRule = null;
    for (const node of ast.nodes) {
      if (node.type === 'rule' && trimWhitespace(node.selector) === selector) {
        foundRule = node;
        break;
      }
    }
    if (!foundRule) return;

    const oldVarsIdx = {};
    foundRule.nodes.forEach((n, i) => {
      if (n.type === 'decl' && n.prop.startsWith('--s2a-')) oldVarsIdx[n.prop] = i;
    });

    Object.entries(varsMap).forEach(([prop, value]) => {
      if (prop in oldVarsIdx) {
        if (value !== foundRule.nodes[oldVarsIdx[prop]].value) {
          updatedVars.push(`${prop}: ${foundRule.nodes[oldVarsIdx[prop]].value} -> ${value}`);
        }
        foundRule.nodes[oldVarsIdx[prop]].value = value;
      } else {
        const newDecl = postcss.decl({ prop, value });
        newDecl.raws.before = newVars.length > 0 ? '\n  ' : '\n\n  ';
        foundRule.append(newDecl);
        foundRule.raws.semicolon = true;
        newVars.push(`${prop}: ${value}`);
      }
    });

    foundRule.walkDecls((decl) => {
      if (isS2aVar(decl.prop) && !(decl.prop in varsMap)) {
        deletedVars.push(`${decl.prop}: ${decl.value}`);
        decl.remove();
      }
    });
  }

  const rootVars = {};
  for (const decl of rootDecls) rootVars[decl.prop] = decl.value;
  const darkVars = {};
  for (const decl of filteredDarkDecls) darkVars[decl.prop] = decl.value;

  patchDeclarationsForSelector(':root', rootVars);
  patchDeclarationsForSelector('.dark', darkVars);

  const finalCss = ast.toResult().css;
  await fsp.writeFile(targetFile, `${finalCss.trim()}\n`, 'utf8');

  const hasChanges = updatedVars.length > 0 || newVars.length > 0 || deletedVars.length > 0;

  const summary = `Synchronized --s2a- variables in \`${TARGET_FILE}\`.

**Updated variables:**
${updatedVars.length ? updatedVars.join('\n') : 'none'}

**Added variables:**
${newVars.length ? newVars.join('\n') : 'none'}

**Deleted variables:**
${deletedVars.length ? deletedVars.join('\n') : 'none'}`;

  console.log(summary);

  return { hasChanges, summary };
}

// Workflow PR Logic
const execSyncSafe = (command) => {
  try {
    execSync(command);
  } catch (error) {
    console.log(`Skipped command: ${command}`);
  }
};

const createAndPushBranch = ({ filePath, branch }) => {
  execSync('git config --global user.name "GitHub Action"');
  execSync('git config --global user.email "action@github.com"');
  execSync('git fetch');
  execSync('git checkout stage');
  execSyncSafe(`git branch -D ${branch}`);
  execSync(`git checkout -b ${branch}`);
  execSync(`git add ${filePath}`);
  execSyncSafe('git commit -m "Update S2A style tokens"');
  execSync(`git push --force origin ${branch}`);
};

const main = async ({ github, context }) => {
  try {
    const { hasChanges, summary } = await buildS2AStyles();

    if (!hasChanges) {
      console.log('No changes detected in S2A styles. Skipping PR creation.');
      return;
    }

    const { data: openPRs } = await github.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: 'open',
    });

    const existingPR = openPRs.find((pr) => pr.head.ref === BRANCH);
    if (existingPR) {
      console.log(`PR already exists for branch ${BRANCH}. Execution stopped.`);
      return;
    }

    createAndPushBranch({
      filePath: TARGET_FILE,
      branch: BRANCH,
    });

    const pr = await github.rest.pulls.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: TITLE,
      head: BRANCH,
      base: 'stage',
      body: summary,
    });

    await github.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.data.number,
      labels: ['high-impact'],
    });

    await github.rest.pulls.requestReviewers({
      owner: context.repo.owner,
      repo: context.repo.repo,
      pull_number: pr.data.number,
      reviewers: [
        'overmyheadandbody',
        'mokimo',
        'robert-bogos',
        'narcis-radu',
      ],
      assignees: ['SilviuLCF'],
    });

    console.log(`PR created: ${pr.data.html_url}`);
  } catch (error) {
    console.error('An error occurred while running S2A styles update workflow:', error);
    throw error;
  }
};

// Direct Execution (npm run build:s2a)
if (require.main === module) {
  buildS2AStyles().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = main;
