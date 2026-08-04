#!/usr/bin/env node
/**
 * Local relay for the pr-review sidebar extension.
 *
 * Runs `claude -p "/pr-review <url>"` against a milo checkout and returns
 * structured findings as JSON, then (on explicit user confirmation from the
 * sidebar) posts the accepted subset to GitHub via `gh pr review`.
 *
 * Binds to 127.0.0.1 only — never exposed off this machine. Auth for both
 * Claude and GitHub is whatever `claude`/`gh` already use on this machine;
 * no tokens pass through the browser extension.
 */
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = process.env.PR_REVIEW_RELAY_PORT || 4756;
const MILO_DIR = process.env.MILO_DIR || path.join(os.homedir(), 'milo');
const CLAUDE_MODEL = process.env.PR_REVIEW_MODEL || 'sonnet';
// Simplifying one finding is a plain text rewrite, not a repo-aware review —
// no tool access needed, so a cheap/fast model is the right default here,
// distinct from CLAUDE_MODEL (which does the real agentic review work).
const SIMPLIFY_MODEL = process.env.PR_REVIEW_SIMPLIFY_MODEL || 'haiku';
const REVIEW_TIMEOUT_MS = 8 * 60 * 1000; // agentic review can take a few minutes
const SIMPLIFY_TIMEOUT_MS = 60 * 1000;

// Each finding is split into free-text `body` plus an optional anchor to a
// specific line in the current (post-PR) version of a file, so the posting
// path can turn anchored findings into native inline review comments instead
// of flattening everything into one big comment body.
const FINDING_ITEM_SCHEMA = {
  type: 'object',
  properties: {
    body: { type: 'string' },
    file: { type: ['string', 'null'] },
    line: { type: ['integer', 'null'] },
  },
  required: ['body', 'file', 'line'],
  additionalProperties: false,
};

const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    pr_number: { type: 'integer' },
    title: { type: 'string' },
    repo: { type: 'string' },
    size_line: { type: 'string' },
    overview: { type: 'string' },
    blockers: { type: 'array', items: FINDING_ITEM_SCHEMA },
    suggestions: { type: 'array', items: FINDING_ITEM_SCHEMA },
    nice_to_haves: { type: 'array', items: FINDING_ITEM_SCHEMA },
  },
  required: [
    'pr_number', 'title', 'repo', 'size_line', 'overview',
    'blockers', 'suggestions', 'nice_to_haves',
  ],
  additionalProperties: false,
};

// Any tab in the browser can otherwise reach this relay (127.0.0.1 has no
// same-origin protection of its own) and trigger a real `claude`/`gh` run
// under this machine's credentials. Only a browser extension's background/
// side-panel context can send an Origin of "chrome-extension://..." — an
// ordinary webpage's JS cannot spoof this header. That narrows the trust
// boundary from "any website" to "any installed extension", which is the
// practical floor without pinning this extension's ID via a manifest `key`.
function isAllowedOrigin(origin) {
  return typeof origin === 'string' && origin.startsWith('chrome-extension://');
}

function setCors(res, origin) {
  if (isAllowedOrigin(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, payload, origin) {
  setCors(res, origin);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function runClaudeReview(repoUrl) {
  return new Promise((resolve, reject) => {
    const prompt = [
      `/pr-review ${repoUrl}`,
      '',
      'Do not post, comment, or run any gh/git write commands. Only read and report.',
      'Return the review as the structured JSON output described by the schema — do not also print the Ultrareview markdown separately.',
      '',
      'Each item in blockers/suggestions/nice_to_haves must be split into:',
      '- `body`: the finding text (may include a fenced ```suggestion``` block).',
      '- `file` and `line`: both `null` if the finding is general or not tied to one exact',
      '  spot (e.g. a process/architecture comment); otherwise the exact repo-relative file',
      '  path and a single line number in the current (post-PR) version of that file. If a',
      '  finding spans a range of lines, use the first line of the range.',
    ].join('\n');

    const args = [
      '-p', prompt,
      '--output-format', 'json',
      '--json-schema', JSON.stringify(FINDINGS_SCHEMA),
      '--permission-mode', 'bypassPermissions',
      '--allowedTools', 'Bash Read Grep Glob',
      // The "don't post/comment" instruction above is prose, not enforcement — a
      // prompt-injected PR description could otherwise get the child session to
      // just run these directly, bypassing the entire accept/decline flow this
      // relay exists for. Actually deny the write-shaped gh/git commands.
      '--disallowedTools',
      'Bash(gh pr review*) Bash(gh pr comment*) Bash(gh pr merge*) Bash(gh pr close*) '
      + 'Bash(gh pr edit*) Bash(gh issue comment*) Bash(gh api -X*) Bash(gh api --method*) '
      + 'Bash(git push*) Bash(git commit*) Bash(git merge*) Bash(git reset*) Bash(git checkout*)',
      '--model', CLAUDE_MODEL,
      '--no-session-persistence',
    ];

    const child = spawn('claude', args, { cwd: MILO_DIR, detached: true });

    let stdout = '';
    let stderr = '';
    const killTimer = setTimeout(() => {
      try { process.kill(-child.pid, 'SIGTERM'); } catch { /* already gone */ }
      setTimeout(() => {
        try { process.kill(-child.pid, 'SIGKILL'); } catch { /* already gone */ }
      }, 5000).unref();
      reject(new Error('claude review timed out'));
    }, REVIEW_TIMEOUT_MS);

    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });

    child.on('error', (err) => {
      clearTimeout(killTimer);
      reject(err);
    });

    child.on('close', (code) => {
      clearTimeout(killTimer);
      if (code !== 0) {
        return reject(new Error(`claude exited ${code}: ${stderr.slice(-2000)}`));
      }
      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch (err) {
        return reject(new Error(`Could not parse claude output as JSON: ${err.message}`));
      }
      if (parsed.is_error || parsed.subtype !== 'success') {
        return reject(new Error(`claude reported an error: ${parsed.result || stderr.slice(-2000)}`));
      }
      if (!parsed.structured_output) {
        return reject(new Error('claude did not return structured_output — check --json-schema support'));
      }
      resolve({ findings: parsed.structured_output, cost_usd: parsed.total_cost_usd, session_id: parsed.session_id });
    });
  });
}

// Rewrites one finding's body text to be shorter/simpler. This is a plain
// text transform, not a repo-aware review — `--tools ""` disables all tool
// access entirely (cheaper, faster, and no chance of it wandering off to
// read files), independent of the --allowedTools/--disallowedTools scoping
// that only applies to the real review-generation subprocess above.
function runSimplify(text) {
  return new Promise((resolve, reject) => {
    const prompt = [
      'Rewrite the following PR-review comment to be shorter and simpler,',
      'preserving its meaning and its severity. If it contains a fenced',
      '```suggestion``` code block, keep that block byte-for-byte unchanged —',
      'only simplify the surrounding prose. Return ONLY the rewritten text,',
      'no preamble, no explanation of what you changed.',
      '',
      '---',
      text,
    ].join('\n');

    const args = [
      '-p', prompt,
      '--output-format', 'json',
      '--tools', '',
      '--model', SIMPLIFY_MODEL,
      '--no-session-persistence',
    ];

    const child = spawn('claude', args, { cwd: MILO_DIR, detached: true });

    let stdout = '';
    let stderr = '';
    const killTimer = setTimeout(() => {
      try { process.kill(-child.pid, 'SIGTERM'); } catch { /* already gone */ }
      setTimeout(() => {
        try { process.kill(-child.pid, 'SIGKILL'); } catch { /* already gone */ }
      }, 3000).unref();
      reject(new Error('simplify timed out'));
    }, SIMPLIFY_TIMEOUT_MS);

    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });

    child.on('error', (err) => {
      clearTimeout(killTimer);
      reject(err);
    });

    child.on('close', (code) => {
      clearTimeout(killTimer);
      if (code !== 0) {
        return reject(new Error(`claude exited ${code}: ${stderr.slice(-2000)}`));
      }
      let parsed;
      try {
        parsed = JSON.parse(stdout);
      } catch (err) {
        return reject(new Error(`Could not parse claude output as JSON: ${err.message}`));
      }
      if (parsed.is_error || parsed.subtype !== 'success') {
        return reject(new Error(`claude reported an error: ${parsed.result || stderr.slice(-2000)}`));
      }
      resolve({ simplified: parsed.result, cost_usd: parsed.total_cost_usd });
    });
  });
}

// GitHub's reviews API 422s the *entire* review if even one inline comment's
// `line` doesn't correspond to an actual line in the PR's current diff — a
// finding citing a line outside every rendered hunk (same failure mode
// content.js's on-page injection already has to handle) silently breaks
// posting for every OTHER accepted finding too. Fetch the PR's real diff and
// compute, per file, the set of new-file line numbers that actually appear
// in it (context + added lines — the only lines a `side: RIGHT` comment can
// target), so buildReviewPayload can filter bad citations out before they
// ever reach GitHub's API instead of after a 422.
function parsePatchLines(patch) {
  const lines = new Set();
  if (!patch) return lines; // binary or too-large files omit `patch` entirely
  let newLine = 0;
  for (const line of patch.split('\n')) {
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      newLine = parseInt(hunkMatch[1], 10);
      continue;
    }
    if (line.startsWith('\\')) continue; // "\ No newline at end of file" — not a real line
    if (line.startsWith('-')) continue; // old-side only, doesn't consume a new-line number
    if (line.startsWith('+') || line.startsWith(' ') || line === '') {
      lines.add(newLine);
      newLine++;
    }
  }
  return lines;
}

function fetchDiffLineIndex(repo, prNumber) {
  return new Promise((resolve) => {
    const args = ['api', `repos/${repo}/pulls/${prNumber}/files`, '--paginate'];
    const child = spawn('gh', args, { cwd: MILO_DIR });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', (err) => {
      console.error('[pr-review] could not fetch diff for line validation, skipping it:', err.message);
      resolve(null); // null = "validation unavailable" — caller falls back to unfiltered behavior
    });
    child.on('close', (code) => {
      if (code !== 0) {
        console.error('[pr-review] could not fetch diff for line validation, skipping it:', stderr.slice(-500));
        return resolve(null);
      }
      try {
        const files = JSON.parse(stdout);
        const index = {};
        for (const f of files) index[f.filename] = parsePatchLines(f.patch);
        resolve(index);
      } catch (err) {
        console.error('[pr-review] could not parse diff for line validation, skipping it:', err.message);
        resolve(null);
      }
    });
  });
}

// Splits every accepted finding into (a) general items — no file/line anchor,
// or a file/line that doesn't correspond to a real line in the current diff —
// which get folded into the review's markdown `body` under the same section
// headings as before, and (b) location-specific items — which become native
// inline review `comments` anchored to a file/line, so they render on the
// code itself in the PR's Files-changed tab (with GitHub's suggestion-accept
// UI when `body` contains a ```suggestion``` block). `diffLineIndex` is
// `{ [filename]: Set<line> }` from fetchDiffLineIndex, or null if that fetch
// failed — null means "can't validate", so every file/line-anchored item is
// treated as anchored (the pre-validation behavior), same as before this
// existed.
// GitHub only renders a fenced ```suggestion block with its special
// "Apply suggestion" UI inside an actual inline diff comment — a finding
// that ends up in the review's general body text (no valid anchor) loses
// that treatment and would otherwise look like a plain code example, not a
// proposed change. Flag it explicitly so it's not missed.
const SUGGESTION_FENCE_RE = /```suggestion\b/;
function formatGeneralBody(text) {
  return SUGGESTION_FENCE_RE.test(text) ? `**💡 Code suggestion:**\n${text}` : text;
}

// Deliberately excludes findings.overview (the multi-paragraph reasoning
// narrative) — useful context in the side panel for your own reading, but
// not something to post to the PR itself. The posted review body is just a
// title/size header plus the findings you actually accepted.
function buildReviewPayload(findings, accepted, diffLineIndex) {
  const sections = [
    ['Blockers', findings.blockers],
    ['Suggestions', findings.suggestions],
    ['Nice-to-haves', findings.nice_to_haves],
  ];

  let body = `## PR #${findings.pr_number} — ${findings.title}\n\n`;
  body += `**Size:** ${findings.size_line}\n\n`;

  const comments = [];

  for (const [title, items] of sections) {
    const generalBodies = [];
    items.forEach((item, i) => {
      if (!accepted[title]?.[i]) return;
      const isValidAnchor = item.file != null && item.line != null
        && (diffLineIndex == null || diffLineIndex[item.file]?.has(item.line));
      if (isValidAnchor) {
        comments.push({ path: item.file, line: item.line, side: 'RIGHT', body: item.body });
      } else if (item.file != null && item.line != null) {
        // Had an anchor, but it doesn't correspond to a real diff line (e.g.
        // a related file outside this PR, or a collapsed-context line) —
        // fold it into the general body with its citation kept as text,
        // instead of letting it 422 the whole review.
        generalBodies.push(`${formatGeneralBody(item.body)}\n\n_(references ${item.file}:${item.line}, outside this PR's diff)_`);
      } else {
        generalBodies.push(formatGeneralBody(item.body));
      }
    });
    if (generalBodies.length) {
      body += `### ${title}\n${generalBodies.map((t) => `- ${t}`).join('\n')}\n\n`;
    }
  }

  return { body: body.trim() + '\n', comments };
}

function reviewStateToEvent(reviewState) {
  if (reviewState === 'approve') return 'APPROVE';
  if (reviewState === 'request_changes') return 'REQUEST_CHANGES';
  return 'COMMENT';
}

// Posts via `gh api .../reviews` (not `gh pr review`) because the CLI's own
// review command has no flag for inline comments — only the raw REST
// endpoint accepts a `comments` array. GitHub validates every comment's
// `line` against the PR's actual diff and 422s the *whole* review if one
// doesn't match; buildReviewPayload's diffLineIndex filtering is the primary
// defense against that, but it's best-effort (the diff fetch can itself
// fail), so failures here still surface via the rejected promise — with both
// stdout and stderr, since `gh api`'s human-readable summary and the
// underlying JSON error body don't always land on the same stream.
//
// `reviewState === 'draft'` omits `event` entirely from the payload — per
// GitHub's REST API docs, doing so creates a PENDING review instead of a
// submitted one: it's saved server-side but invisible to anyone but the
// author until they open the PR in their own browser and hit GitHub's own
// "Submit review" button. This replaces content.js's old "Open in GitHub"
// button, which tried to click GitHub's native comment composer open via
// `.js-add-line-comment` — a selector confirmed removed from GitHub's own UI
// back in 2021 (refined-github dropped it the same year). This API path is
// officially documented and has no DOM to go stale.
// Generic `gh api` runner returning parsed JSON (or null for an empty body,
// e.g. a DELETE's 204 response) — used by clearExistingPendingReview below.
function ghApiJson(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('gh', args, { cwd: MILO_DIR });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) return reject(new Error(`gh ${args.join(' ')} exited ${code}: ${stderr}`));
      try {
        resolve(stdout.trim() ? JSON.parse(stdout) : null);
      } catch (err) {
        reject(new Error(`Could not parse gh output as JSON: ${err.message}`));
      }
    });
  });
}

// GitHub allows only one PENDING review per user per PR — a leftover pending
// review (from an earlier "Send as draft" click, or a manual one on GitHub
// itself) blocks ANY new create-review call, draft or immediately-submitted,
// with a 422 ("User can only have one pending review per pull request").
// Find and delete it first so re-clicking "Send as draft" as accept/decline
// choices change stays safe — deleting a still-pending review destroys
// nothing visible to anyone else, since pending reviews are private to their
// author until submitted (same guarantee "Send as draft" itself relies on).
async function clearExistingPendingReview(repo, prNumber) {
  const reviews = await ghApiJson(['api', `repos/${repo}/pulls/${prNumber}/reviews`, '--paginate']);
  const pending = (reviews || []).find((r) => r.state === 'PENDING');
  if (!pending) return false;
  await ghApiJson(['api', `repos/${repo}/pulls/${prNumber}/reviews/${pending.id}`, '--method', 'DELETE']);
  return true;
}

async function postReview(repo, prNumber, payload) {
  try {
    const cleared = await clearExistingPendingReview(repo, prNumber);
    if (cleared) console.log(`[pr-review] cleared an existing pending review on PR #${prNumber} before creating a new one`);
  } catch (err) {
    console.error('[pr-review] could not check/clear an existing pending review, proceeding anyway:', err.message);
  }

  return new Promise((resolve, reject) => {
    const tmpFile = path.join(os.tmpdir(), `pr-review-${prNumber}-${Date.now()}.json`);
    fs.writeFileSync(tmpFile, JSON.stringify(payload), 'utf8');

    const args = ['api', `repos/${repo}/pulls/${prNumber}/reviews`, '--method', 'POST', '--input', tmpFile];
    const child = spawn('gh', args, { cwd: MILO_DIR });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('error', (err) => {
      fs.unlink(tmpFile, () => {});
      reject(err);
    });
    child.on('close', (code) => {
      fs.unlink(tmpFile, () => {});
      if (code !== 0) {
        return reject(new Error(`gh api pulls/reviews exited ${code}: ${stderr}${stdout ? ` | stdout: ${stdout}` : ''}`));
      }
      resolve();
    });
  });
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;

  if (req.method === 'OPTIONS') {
    setCors(res, origin);
    res.writeHead(204);
    return res.end();
  }

  // /api/review and /api/post trigger real claude/gh runs under this
  // machine's credentials — restrict them to extension-context callers.
  // (A bare curl/no-Origin request also gets rejected here; use
  // /api/health, which stays open, to check the relay is up.)
  const isProtectedRoute = req.url === '/api/review' || req.url === '/api/post' || req.url === '/api/simplify';
  if (isProtectedRoute && !isAllowedOrigin(origin)) {
    return sendJson(res, 403, { error: 'forbidden: request did not come from the extension' }, origin);
  }

  if (req.method === 'POST' && req.url === '/api/review') {
    try {
      const { repoUrl } = await readJsonBody(req);
      if (!repoUrl) return sendJson(res, 400, { error: 'repoUrl is required' }, origin);
      const result = await runClaudeReview(repoUrl);
      return sendJson(res, 200, result, origin);
    } catch (err) {
      return sendJson(res, 500, { error: err.message }, origin);
    }
  }

  if (req.method === 'POST' && req.url === '/api/simplify') {
    try {
      const { body } = await readJsonBody(req);
      if (!body) return sendJson(res, 400, { error: 'body is required' }, origin);
      const result = await runSimplify(body);
      return sendJson(res, 200, result, origin);
    } catch (err) {
      return sendJson(res, 500, { error: err.message }, origin);
    }
  }

  if (req.method === 'POST' && req.url === '/api/post') {
    try {
      const { repo, prNumber, findings, accepted, reviewState, dryRun } = await readJsonBody(req);
      if (!repo || !prNumber || !findings || !accepted) {
        return sendJson(res, 400, { error: 'repo, prNumber, findings, accepted are required' }, origin);
      }
      const diffLineIndex = await fetchDiffLineIndex(repo, prNumber);
      const { body, comments } = buildReviewPayload(findings, accepted, diffLineIndex);
      const isDraft = reviewState === 'draft';
      const event = isDraft ? undefined : reviewStateToEvent(reviewState);
      const payload = isDraft ? { body, comments } : { event, body, comments };
      if (dryRun) {
        // Build the exact payload without calling gh — lets the caller inspect
        // what would be submitted (useful for testing and for a future "preview" UI).
        return sendJson(res, 200, { posted: false, dryRun: true, ...payload, pending: isDraft }, origin);
      }
      await postReview(repo, prNumber, payload);
      return sendJson(res, 200, { posted: true, ...payload, pending: isDraft }, origin);
    } catch (err) {
      return sendJson(res, 500, { error: err.message }, origin);
    }
  }

  if (req.method === 'GET' && req.url === '/api/health') {
    return sendJson(res, 200, { ok: true, miloDir: MILO_DIR }, origin);
  }

  setCors(res, origin);
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`pr-review relay listening on http://127.0.0.1:${PORT}`);
  console.log(`Running claude from: ${MILO_DIR}`);
});
