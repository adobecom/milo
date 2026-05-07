const { execSync } = require('child_process');
const crypto = require('crypto');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const postcss = require('postcss');
const tar = require('tar');

// Run locally: npm run build:s2a (build only). Pass `--skip-download` to
// reuse whatever is currently in deps/ instead of pulling the upstream package.
// Run in CI: Called by Github action (build + PR).

const BRANCH = 'update-s2a-styles';
const TITLE = '[AUTOMATED-PR] Update S2A style tokens';
const TARGET_FILE = './libs/c2/styles/styles.css';
const DEPS_DIR = './libs/c2/styles/deps';

// Upstream source for the deps package. The base URL is expected to expose a
// flat list of `.tgz` files; the package name has no consistent naming pattern,
// so it is pinned here and bumped manually when a new release ships.
const DEPS_RELEASE_BASE_URL = 'https://github.com/adobecom/consonant/raw/main/releases';
const DEPS_PACKAGE = 'adobecom-s2a-tokens-0.0.16.tgz';
const DEPS_PACKAGE_SHA256 = '3a189fc72ff8193205c9ec120babdcec3c467077ef0ac3f74d45a74c2e04c908';
// Path inside the extracted package that holds the CSS sources we want to
// mirror into DEPS_DIR.
const DEPS_PACKAGE_CSS_SUBPATH = path.join('css', 'dev');

// Tolerance (in px) when matching a deps @media breakpoint to a target @media
// breakpoint. Covers off-by-one mismatches like deps `1441px` vs target `1440px`.
const MQ_BREAKPOINT_TOLERANCE_PX = 1;

// Variables matching any of these patterns are fully ignored by the pipeline:
// they are not pulled from deps and they are not removed from the target if
// already present. `*` acts as a global wildcard; other characters match literally.
const EXCLUDED_VAR_PATTERNS = [
  '--s2a-grid-container-*', /* grid definitions already in Milo*/
  '--s2a-grid-breakpoint-*', /* can't use tokens in media queries */
  /* correct font families already defined in Milo */
  '--s2a-font-family-title',
  '--s2a-font-family-subheading',
  '--s2a-font-family-body',
  '--s2a-font-family-label',
  '--s2a-font-family-eyebrow',
  '--s2a-font-family-caption',
  /* waiting for some clarity */
  '--s2a-color-button-*',
  '--s2a-color-iconbutton-*',
];

// S2A Build Logic
function trimWhitespace(str) {
  return str.replace(/\s/g, '');
}

function isS2aVar(decl) {
  return decl.startsWith('--s2a-');
}

const excludedVarMatchers = EXCLUDED_VAR_PATTERNS.map((pattern) => {
  const source = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  return new RegExp(`^${source}$`);
});

function isExcludedVar(prop) {
  return excludedVarMatchers.some((re) => re.test(prop));
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
  const match = s.match(/^:root\[data-theme\s*=\s*("|')([^"']+)\1\]$/);
  return match ? match[2] : 'light';
}

function extractDeclsFromRule(rule) {
  return rule.nodes.filter((node) => node.type === 'decl');
}

function limitDecimals(str) {
  return str.replace(/(\d+\.\d{4})\d*/g, '$1');
}

function getMediaMinWidth(params) {
  const match = params.match(/(?:min-width\s*:\s*|width\s*>=\s*)(\d+)\s*px/);
  return match ? parseInt(match[1], 10) : null;
}

function findEnclosingMediaBreakpoint(rule) {
  let parent = rule.parent;
  while (parent) {
    if (parent.type === 'atrule' && parent.name === 'media') {
      return getMediaMinWidth(parent.params);
    }
    parent = parent.parent;
  }
  return null;
}

// Collapse a decl list into a `{ prop: { value, source } }` map, last write wins.
// Keeping `source` alongside `value` lets us annotate newly-added decls in the
// output with the deps file they originated from.
function declsToMap(decls) {
  const map = {};
  for (const d of decls) map[d.prop] = { value: d.value, source: d.source };
  return map;
}

// Parse all deps files and group their --s2a- declarations by breakpoint and mode.
// Returns Map<bpKey, { light: Decl[], dark: Decl[] }> where bpKey is:
//   - 'base' for rules at file top level (no enclosing @media)
//   - a number (min-width px) for rules inside an @media (min-width: N) block
async function collectDepsBuckets(cssFiles) {
  const buckets = new Map();
  const getBucket = (bpKey) => {
    if (!buckets.has(bpKey)) buckets.set(bpKey, {});
    return buckets.get(bpKey);
  };

  for (const file of cssFiles) {
    const source = path.basename(file);
    const code = await fsp.readFile(file, 'utf8');
    const fileAst = postcss.parse(code);

    fileAst.walkRules((rule) => {
      const bp = findEnclosingMediaBreakpoint(rule);
      // Ignore rules nested inside other rules (e.g. `&:lang(...)`) since we
      // only care about top-level declarations or those directly under @media.
      if (bp === null && rule.parent.type !== 'root') return;
      const bpKey = bp === null ? 'base' : bp;
      const mode = getSelectorMode(rule.selector);
      const bucket = getBucket(bpKey);
      if (!bucket[mode]) bucket[mode] = [];
      for (const decl of extractDeclsFromRule(rule)) {
        if (isS2aVar(decl.prop) && !isExcludedVar(decl.prop)) {
          bucket[mode].push({ prop: decl.prop, value: limitDecimals(decl.value), source });
        }
      }
    });
  }

  return buckets;
}

// Turn raw buckets into the per-target var maps, applying two dedup layers:
//   - dark mode against base :root (existing behavior)
//   - each breakpoint against the cascade of base + all smaller breakpoints,
//     so a breakpoint only carries values that actually override the cascade
function buildLayerMaps(buckets) {
  const baseBucket = buckets.get('base') ?? {};
  const baseLight = baseBucket.light ?? [];
  const baseDark = baseBucket.dark ?? [];
  const baseLightMap = declsToMap(baseLight);
  const baseDarkMap = declsToMap(
    baseDark.filter((d) => baseLightMap[d.prop]?.value !== d.value),
  );

  const sortedBps = [...buckets.keys()]
    .filter((k) => k !== 'base')
    .sort((a, b) => a - b);

  const bpMaps = {};
  const cascaded = { ...baseLightMap };
  for (const bp of sortedBps) {
    const bpLight = buckets.get(bp).light ?? [];
    const filtered = bpLight.filter((d) => cascaded[d.prop]?.value !== d.value);
    bpMaps[bp] = declsToMap(filtered);
    for (const d of bpLight) cascaded[d.prop] = { value: d.value, source: d.source };
  }

  return { baseLightMap, baseDarkMap, sortedBps, bpMaps };
}

function findTopLevelRule(ast, selector) {
  for (const node of ast.nodes) {
    if (node.type === 'rule' && trimWhitespace(node.selector) === selector) return node;
  }
  return null;
}

function findRuleInContainer(container, selector) {
  for (const node of container.nodes) {
    if (node.type === 'rule' && trimWhitespace(node.selector) === selector) return node;
  }
  return null;
}

function formatWithContext(text, context) {
  return context ? `[${context}] ${text}` : text;
}

// Detect sibling decl indentation so appended decls match the rule's existing style.
function detectIndent(rule) {
  const sampleDecl = rule.nodes.find((n) => n.type === 'decl');
  return sampleDecl?.raws?.before?.match(/\n([ \t]*)/)?.[1] ?? '  ';
}

// A managed section is a standalone /* tokens.xxx */ or /* tokens.xxx.css */
// comment. These are the only comments the script creates or groups decls under;
// all other comments (e.g. `/* Animation properties */`) are left untouched.
function isManagedSectionComment(node) {
  if (node.type !== 'comment') return false;
  if (!node.raws.before?.includes('\n')) return false;
  return /^tokens\.[\w.-]*$/i.test(node.text.trim());
}

function normalizeSectionKey(textOrFilename) {
  return textOrFilename.trim().replace(/\.css$/i, '').toLowerCase();
}

// Walk the rule's children once to map each managed section to its last S2A
// decl. Appending after `lastNode` keeps insertions glued to the section's
// decls and stops before any unrelated content that follows (nested rules
// or non-S2A decls).
function scanSections(rule) {
  const sections = [];
  let current = null;
  for (const node of rule.nodes) {
    if (isManagedSectionComment(node)) {
      current = { comment: node, key: normalizeSectionKey(node.text), lastNode: node };
      sections.push(current);
      continue;
    }
    if (!current) continue;
    if (node.type === 'decl' && isS2aVar(node.prop)) {
      current.lastNode = node;
    } else if (node.type === 'rule' || node.type === 'atrule') {
      current = null;
    }
  }
  return sections;
}

// Create a new /* tokens.xxx */ section comment appended at the end of the
// rule so new sections stack after existing managed ones.
function createSection(rule, source, indent) {
  const key = normalizeSectionKey(source);
  const comment = postcss.comment({ text: key });
  comment.raws.before = `\n\n${indent}`;
  comment.raws.left = ' ';
  comment.raws.right = ' ';
  rule.append(comment);
  rule.raws.semicolon = true;
  return { comment, key, lastNode: comment };
}

// Reconcile the --s2a- declarations inside `rule` against `varsMap`:
//   - update values when they differ (decls keep their current position),
//   - insert new decls under the /* tokens.xxx */ section matching their
//     source, creating the section at the end of the rule if it doesn't exist,
//   - remove existing --s2a- decls that are no longer in varsMap.
// Changes are recorded into changeLog with an optional context prefix.
function patchRule(rule, varsMap, changeLog, context = '') {
  if (!rule) return;

  const indent = detectIndent(rule);

  const existingByProp = new Map();
  rule.walkDecls((decl) => {
    if (isS2aVar(decl.prop)) existingByProp.set(decl.prop, decl);
  });

  const sections = scanSections(rule);
  const sectionByKey = new Map(sections.map((s) => [s.key, s]));

  for (const [prop, { value, source }] of Object.entries(varsMap)) {
    const existing = existingByProp.get(prop);
    if (existing) {
      if (value !== existing.value) {
        changeLog.updated.push(formatWithContext(`${prop}: ${existing.value} -> ${value}`, context));
        existing.value = value;
      }
      continue;
    }

    const key = source ? normalizeSectionKey(source) : null;
    let section = key ? sectionByKey.get(key) : null;
    if (!section && source) {
      section = createSection(rule, source, indent);
      sectionByKey.set(section.key, section);
    }

    const newDecl = postcss.decl({ prop, value });
    newDecl.raws.before = `\n${indent}`;

    if (section) {
      rule.insertAfter(section.lastNode, newDecl);
      section.lastNode = newDecl;
    } else {
      rule.append(newDecl);
    }
    rule.raws.semicolon = true;

    const sourceNote = source ? ` (${source})` : '';
    changeLog.added.push(formatWithContext(`${prop}: ${value}${sourceNote}`, context));
  }

  rule.walkDecls((decl) => {
    if (isS2aVar(decl.prop) && !isExcludedVar(decl.prop) && !(decl.prop in varsMap)) {
      changeLog.deleted.push(formatWithContext(`${decl.prop}: ${decl.value}`, context));
      decl.remove();
    }
  });
}

// Walk every layer (base :root, base .dark, each target @media :root) and
// patch the matching rule. Iterating the target's @media blocks (rather than
// only deps') ensures stale --s2a- vars in target breakpoints that deps no
// longer covers still get pruned: those rules patch against an empty map.
function applyLayersToTarget(ast, layers, changeLog) {
  const { baseLightMap, baseDarkMap, sortedBps, bpMaps } = layers;

  patchRule(findTopLevelRule(ast, ':root'), baseLightMap, changeLog);
  patchRule(findTopLevelRule(ast, '.dark'), baseDarkMap, changeLog, '.dark');

  const matchedDepsBps = new Set();
  for (const node of ast.nodes) {
    if (node.type !== 'atrule' || node.name !== 'media') continue;
    const targetBp = getMediaMinWidth(node.params);
    if (targetBp === null) continue;
    const rootInside = findRuleInContainer(node, ':root');
    if (!rootInside) continue;

    const depsBp = sortedBps.find((bp) => Math.abs(bp - targetBp) <= MQ_BREAKPOINT_TOLERANCE_PX);
    const map = depsBp != null ? bpMaps[depsBp] : {};
    patchRule(rootInside, map, changeLog, `@media ${node.params}`);
    if (depsBp != null) matchedDepsBps.add(depsBp);
  }

  for (const bp of sortedBps) {
    if (!matchedDepsBps.has(bp)) {
      console.warn(`No matching @media rule in target for deps breakpoint ${bp}px — skipping.`);
    }
  }
}

function formatSummary(changeLog) {
  const { updated, added, deleted } = changeLog;
  const hasChanges = updated.length + added.length + deleted.length > 0;
  const summary = `Synchronized --s2a- variables in \`${TARGET_FILE}\`.

**Updated variables:**
${updated.length ? updated.join('\n') : 'none'}

**Added variables:**
${added.length ? added.join('\n') : 'none'}

**Deleted variables:**
${deleted.length ? deleted.join('\n') : 'none'}`;
  return { hasChanges, summary };
}

// Mirror sourceDir into targetDir: replace existing files, copy new ones, and
// delete any local files that no longer exist in source so deps stays 1:1
// with the upstream release. Only `tokens.*.css` files are considered on both
// sides; anything else upstream is ignored and anything else local is left alone.
async function mirrorDirectory(sourceDir, targetDir) {
  await fsp.mkdir(targetDir, { recursive: true });

  const sourceEntries = await fsp.readdir(sourceDir, { withFileTypes: true });
  const sourceFiles = sourceEntries.filter(isTokensFile).map((e) => e.name);
  const sourceSet = new Set(sourceFiles);

  const localEntries = await fsp.readdir(targetDir, { withFileTypes: true }).catch(() => []);
  for (const entry of localEntries) {
    if (!isTokensFile(entry)) continue;
    if (!sourceSet.has(entry.name)) {
      await fsp.rm(path.join(targetDir, entry.name), { force: true });
    }
  }

  for (const f of sourceFiles) {
    await fsp.copyFile(path.join(sourceDir, f), path.join(targetDir, f));
  }
}

// Download the upstream tarball, extract it to a temp dir, and mirror its
// css/dev contents into the local deps folder. The download is checked
// against DEPS_PACKAGE_SHA256 before extraction so a swapped or tampered
// tarball fails the build instead of silently propagating into the PR.
async function syncDepsFromUpstream(depsDir) {
  const url = `${DEPS_RELEASE_BASE_URL}/${DEPS_PACKAGE}`;
  console.log(`Downloading ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const actualHash = crypto.createHash('sha256').update(buffer).digest('hex');
  if (actualHash !== DEPS_PACKAGE_SHA256) {
    throw new Error(
      `SHA-256 mismatch for ${DEPS_PACKAGE}.\n  expected: ${DEPS_PACKAGE_SHA256}\n  actual:   ${actualHash}\n`
      + 'Update DEPS_PACKAGE_SHA256 if this version bump is intentional.',
    );
  }

  const tmpRoot = await fsp.mkdtemp(path.join(os.tmpdir(), 's2a-deps-'));
  try {
    const tarPath = path.join(tmpRoot, DEPS_PACKAGE);
    await fsp.writeFile(tarPath, buffer);

    const extractDir = path.join(tmpRoot, 'extracted');
    await fsp.mkdir(extractDir);
    await tar.x({ file: tarPath, cwd: extractDir, strict: true });

    const entries = await fsp.readdir(extractDir, { withFileTypes: true });
    const root = entries.find((e) => e.isDirectory());
    if (!root) throw new Error(`Extracted ${DEPS_PACKAGE} contains no top-level directory`);

    const sourceDir = path.join(extractDir, root.name, DEPS_PACKAGE_CSS_SUBPATH);
    await mirrorDirectory(sourceDir, depsDir);
  } finally {
    await fsp.rm(tmpRoot, { recursive: true, force: true });
  }
}

async function readTargetAst(targetFile) {
  try {
    const cssText = await fsp.readFile(targetFile, 'utf8');
    return postcss.parse(cssText);
  } catch (e) {
    console.error(`Error: ${targetFile} not found, cannot patch its --s2a- variables`);
    throw e;
  }
}

async function buildS2AStyles({ skipDownload = false } = {}) {
  const depsDir = path.resolve(DEPS_DIR);
  const targetFile = path.resolve(TARGET_FILE);

  if (skipDownload) {
    console.log('Skipping upstream download; using existing deps/.');
  } else {
    await syncDepsFromUpstream(depsDir);
  }

  const cssFiles = await getCssFiles(depsDir);
  const buckets = await collectDepsBuckets(cssFiles);
  const layers = buildLayerMaps(buckets);

  const ast = await readTargetAst(targetFile);
  const changeLog = { updated: [], added: [], deleted: [] };
  applyLayersToTarget(ast, layers, changeLog);

  await fsp.writeFile(targetFile, `${ast.toResult().css.trim()}\n`, 'utf8');

  const { hasChanges, summary } = formatSummary(changeLog);
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
  execSync('git commit -m "Update S2A style tokens"');
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
        'DKos95',
        'narcis-radu',
        'overmyheadandbody',
        'robert-bogos',
        'zagi25',
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
  const skipDownload = process.argv.includes('--skip-download');
  buildS2AStyles({ skipDownload }).catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = main;
