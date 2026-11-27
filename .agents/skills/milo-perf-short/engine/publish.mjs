// Publish a FINAL perf short on BOTH platforms: a comment on the PR (GitHub) and a comment on its Jira ticket, each
// proven to serve the same bytes. Adapted from Adobe-acom/forgeflex .agents/skills/pr-short/engine/publish.mjs
// @5479db43; milo-perf-short changes: the provenance describes a milo-perf-verify run, the GitHub comment carries
// the run's per-viewport verdict table first and report.md under "Full perf report"; the Jira comment carries
// only the short (embedded) and a link to the PR comment, never the perf writeup itself.
//   node publish.mjs <work>
// Refuses unless: out/provenance.json is a --final build whose screen passed, out/short.mp4 is the file that
// build produced (sha256), the PR head still matches provenance.head, comment.md has no TODO left, the story
// names a ticket key and a Jira token (JIRA_TOKEN or JIRA_PAT) is set. All checks run before either post, so a
// refusal never leaves a half-published short. A rerun skips a platform out/published.json already records for
// this exact mp4, so a failed Jira post is finished by running publish again, never a second PR comment.
// Comment = the verdict table, the bare asset URL alone in its own paragraph (GitHub renders a player), comment.md's words,
// then a provenance block generated from provenance.json. Uploads with `gh pr comment --attach` (gh >= 2.99),
// else the documented user-attachments endpoint. Then reads the comment back by its URL, takes the rendered
// <video src> from body_html, fetches it WITHOUT credentials and compares sha256. The signed media URL is
// never printed or stored. Jira: uploads the mp4 as an attachment named for the PR and the video hash, reads it
// back with the token (same host only) and compares sha256, then comments with the embedded player and links to
// the PR and its comment. Writes
// out/published.json. Never edits the PR description or the ticket's fields, never transitions, merges or marks
// ready.
// --video-on-jira (milo-perf-short): for an account without write access to the repo, which GitHub refuses
// attachments to. Jira goes first (attach, verify, comment); then the PR gets a text-only comment whose first
// paragraph links the Jira comment, and the Jira comment is edited to link that PR comment.
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { headDrift } from './lint.mjs';
import { fixCell, wikiLink } from './jira-markup.mjs';
import { verdictTable } from '../../milo-perf-verify/lib/report.mjs';

export const ATTACH_MIN = '2.99.0';
export function versionAtLeast(v, min) {
  const a = String(v).split('.').map(Number); const b = min.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0);
  return true;
}
export const assetUrlIn = (body) => body.match(/https:\/\/github\.com\/user-attachments\/assets\/[0-9a-f-]+/i)?.[0] ?? null;
export const videoSrcIn = (html) => html.match(/<video[^>]*\ssrc="(https:\/\/[^"]+)"/i)?.[1]?.replace(/&amp;/g, '&') ?? null;

export const TICKET_RE = /^[A-Z][A-Z0-9]+-\d+$/;
export const JIRA_DEFAULT_BASE = 'https://jira.corp.adobe.com';

export function publishRefusals({ prov, mp4Sha, comment, drift, ticket, jiraToken, noJira = false }) {
  const r = [];
  if (!prov) return ['out/provenance.json missing: node engine/build.mjs <W>/story.json --final'];
  if (!prov.final) r.push('the last build was a draft: node engine/build.mjs <W>/story.json --final');
  if (!prov.screen?.pass) r.push(`screen did not pass: ${(prov.screen?.flags || ['not run']).join('; ')}`);
  if (prov.output?.sha256 !== mp4Sha) r.push('out/short.mp4 is not the file the final build wrote');
  if (drift) r.push(drift);
  if (!comment.trim()) r.push('comment.md is empty');
  if (/TODO/.test(comment)) r.push('comment.md still has TODO placeholders');
  if (!noJira && !TICKET_RE.test(ticket || '')) r.push(`no ticket key to post to (story.json ticket: ${JSON.stringify(ticket ?? null)})`);
  if (!noJira && !jiraToken) r.push('no Jira token: set JIRA_TOKEN (or JIRA_PAT) to post the short to the ticket');
  return r;
}

// fixMd (milo-perf-short): a fix check's fixcheck.md leads instead of the verdict table: the before/after
// table and at most three points, then the short.
export function composeBody(asset, comment, prov, reportMd = '', report = null, fixMd = '') {
  const f = prov.facts || {}; const s = (x) => (x ? String(x).slice(0, 12) : '?');
  const lines = [
    ...(fixMd ? [fixMd.trim(), ''] : report?.viewports ? [...verdictTable(report), ''] : []),
    asset, '', comment.trim(), '',
    reportMd ? '<details><summary>Full perf report</summary>' : null, reportMd ? '' : null, reportMd ? reportMd.trim() : null,
    reportMd ? '' : null, reportMd ? '</details>' : null, reportMd ? '' : null,
    '<details><summary>Provenance</summary>', '',
    `- Before: ${f.before ?? '?'}; after: ${f.after ?? '?'} (PR head \`${s(f.head)}\`)`,
    f.page ? `- Page: ${f.page}` : null,
    f.runs ? `- ${f.runs} interleaved cold loads per side per viewport, run ${f.fetchedAt ?? '?'}${f.blocked?.length ? `; blocked on both sides: ${f.blocked.join(', ')}` : ''}` : null,
    f.profiles ? `- Profiles: ${Object.entries(f.profiles).map(([k, v]) => `${k} ${v}`).join('; ')}` : null,
    `- ${prov.duration} s, ${prov.voice?.name} at ${prov.voice?.rate}; screen ${prov.screen?.pass ? 'PASS' : 'FLAG'}; built ${prov.builtAt}`,
    prov.overriddenFailures?.length ? `- Overridden checks: ${prov.overriddenFailures.join('; ')}` : null,
    `- Video sha256 \`${prov.output.sha256}\``, '', '</details>', '',
  ];
  return lines.filter((l) => l !== null).join('\n');
}

export const ownParagraph = (body, text) => `\n${body}\n`.replace(/\r/g, '').includes(`\n${text}\n`);
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', ...opts }).trim();
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

export const jiraFileName = (pr, sha256) => `pr${Number(pr)}-perf-short-${String(sha256).slice(0, 8)}.mp4`;

// The short only: the verdict, numbers and writeup live on the PR comment, so they have one place to be right.
export function composeJiraBody({ repo, pr, prUrl, commentUrl, fileName, prov }) {
  const f = prov.facts || {}; const s = (x) => (x ? String(x).slice(0, 12) : '?');
  return [
    `*Perf short:* ${wikiLink(prUrl, `${repo}#${pr}`)}`, '',
    `!${fileName}|width=960!`, '',
    `Verdict, perf report and provenance: ${wikiLink(commentUrl, 'GitHub comment')}`,
    `{color:#6b6b6b}${fixCell(`${prov.duration} s; ${f.before ?? '?'} vs ${f.after ?? '?'} @ ${s(f.head)}; video sha256 ${prov.output.sha256}`, 400)}{color}`,
  ].join('\n');
}

async function postGithub({ work, cfg, mp4, comment, prov, reportMd, report, fixMd }) {
  const ghv = sh('gh', ['--version']).match(/gh version ([0-9.]+)/)?.[1] ?? '0';
  const bodyFile = path.join(work, 'out', 'comment-body.md');
  let commentUrl;
  if (versionAtLeast(ghv, ATTACH_MIN)) {
    fs.writeFileSync(bodyFile, composeBody('__ASSET__', comment, prov, reportMd, report, fixMd));
    commentUrl = sh('gh', ['pr', 'comment', String(cfg.pr), '--repo', cfg.repo, '--body-file', bodyFile, '--attach', mp4]);
  } else {
    const repoId = sh('gh', ['api', `repos/${cfg.repo}`, '--hostname', 'github.com', '--jq', '.id']);
    if (!/^\d+$/.test(repoId)) throw new Error(`no repository id for ${cfg.repo}`);
    const q = new URLSearchParams({ name: `pr${cfg.pr}-perf-short.mp4`, content_type: 'video/mp4', repository_id: repoId });
    const res = await fetch(`https://uploads.github.com/user-attachments/assets?${q}`, { method: 'POST', body: fs.readFileSync(mp4),
      headers: { 'Content-Type': 'application/octet-stream', 'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${sh('gh', ['auth', 'token', '--hostname', 'github.com'])}` } });
    const url = res.ok ? (await res.json()).url : null;
    if (!assetUrlIn(url || '')) throw new Error(`upload failed: HTTP ${res.status}`);
    fs.writeFileSync(bodyFile, composeBody(url, comment, prov, reportMd, report, fixMd));
    commentUrl = sh('gh', ['pr', 'comment', String(cfg.pr), '--repo', cfg.repo, '--body-file', bodyFile]);
  }
  const id = commentUrl.match(/issuecomment-(\d+)/)?.[1];
  if (!id) throw new Error(`posted, but no comment URL came back (${commentUrl}); find the comment before retrying`);
  const read = () => JSON.parse(sh('gh', ['api', `repos/${cfg.repo}/issues/comments/${id}`, '-H', 'Accept: application/vnd.github.full+json']));
  let c = read();
  // --attach appends the bare URL at the end; move it to its own paragraph under the verdict, where GitHub renders the player.
  const asset = assetUrlIn(c.body);
  if (!asset) throw new Error(`comment ${commentUrl} has no attachment URL; the upload did not land`);
  if (c.body.includes('__ASSET__')) {
    const body = composeBody(asset, comment, prov, reportMd, report, fixMd);
    sh('gh', ['api', '-X', 'PATCH', `repos/${cfg.repo}/issues/comments/${id}`, '-F', 'body=@-'], { input: body });
    c = read();
  }
  if (!ownParagraph(c.body, asset)) throw new Error('the asset URL is not a paragraph of its own in the comment');
  const src = videoSrcIn(c.body_html || '');
  if (!src) throw new Error('GitHub did not render a <video> for the comment');
  const hosted = Buffer.from(await (await fetch(src)).arrayBuffer());
  return { commentUrl, asset, sha256: sha(hosted), bytes: hosted.length, hostedMatches: sha(hosted) === prov.output.sha256 };
}

async function postJira({ cfg, ticket, token, mp4, prov, commentUrl }) {
  const base = new URL(process.env.JIRA_BASE_URL || JIRA_DEFAULT_BASE);
  if (base.protocol !== 'https:') throw new Error('JIRA_BASE_URL must be https');
  const api = `${base.origin}${base.pathname.replace(/\/$/, '')}/rest/api/2/issue/${ticket}`;
  const auth = { Authorization: `Bearer ${token}` };
  const fileName = jiraFileName(cfg.pr, prov.output.sha256);

  const existing = await fetch(`${api}?fields=attachment`, { headers: { ...auth, Accept: 'application/json' } });
  if (!existing.ok) throw new Error(`Jira ${ticket}: cannot read the ticket (HTTP ${existing.status}); check the key, the token and VPN`);
  let att = (await existing.json()).fields?.attachment?.find((a) => a.filename === fileName);
  if (!att) {
    const form = new FormData();
    form.append('file', new Blob([fs.readFileSync(mp4)], { type: 'video/mp4' }), fileName);
    const up = await fetch(`${api}/attachments`, { method: 'POST', body: form, headers: { ...auth, 'X-Atlassian-Token': 'no-check' } });
    if (!up.ok) throw new Error(`Jira ${ticket}: attachment upload failed (HTTP ${up.status})`);
    [att] = await up.json();
  }
  // The token goes only to the Jira host it came for.
  if (new URL(att.content).host !== base.host) throw new Error(`Jira ${ticket}: attachment served from an unexpected host`);
  const hosted = Buffer.from(await (await fetch(att.content, { headers: auth })).arrayBuffer());
  const hostedMatches = sha(hosted) === prov.output.sha256;
  if (!hostedMatches) return { ticket, attachment: fileName, sha256: sha(hosted), bytes: hosted.length, hostedMatches };

  const body = composeJiraBody({ repo: cfg.repo, pr: cfg.pr, prUrl: cfg.url || `https://github.com/${cfg.repo}/pull/${cfg.pr}`,
    commentUrl, fileName, prov });
  const res = await fetch(`${api}/comment`, { method: 'POST', body: JSON.stringify({ body }),
    headers: { ...auth, 'Content-Type': 'application/json', Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Jira ${ticket}: attachment is up (${fileName}) but the comment failed (HTTP ${res.status}); rerun publish`);
  const { id } = await res.json();
  return { ticket, attachment: fileName, sha256: sha(hosted), bytes: hosted.length, hostedMatches, commentId: id,
    commentUrl: `${base.origin}/browse/${ticket}?focusedCommentId=${id}#comment-${id}` };
}

// --video-on-jira: re-point the Jira comment's link at the PR comment once that exists.
async function relinkJira({ cfg, ticket, token, prov, jira, commentUrl }) {
  const base = new URL(process.env.JIRA_BASE_URL || JIRA_DEFAULT_BASE);
  const api = `${base.origin}${base.pathname.replace(/\/$/, '')}/rest/api/2/issue/${ticket}/comment/${jira.commentId}`;
  const body = composeJiraBody({ repo: cfg.repo, pr: cfg.pr, prUrl: cfg.url || `https://github.com/${cfg.repo}/pull/${cfg.pr}`,
    commentUrl, fileName: jira.attachment, prov });
  const res = await fetch(api, { method: 'PUT', body: JSON.stringify({ body }),
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Jira ${ticket}: the PR comment is up (${commentUrl}) but relinking the Jira comment failed (HTTP ${res.status})`);
}

// --video-on-jira: a text-only PR comment; its first paragraph links the Jira comment that embeds the video.
export const jiraVideoLine = (jira, prov) => `🎬 **Perf short (${prov.duration} s)** is on Jira, embedded in [${jira.ticket}](${jira.commentUrl}) `
  + `as \`${jira.attachment}\` (sha256 \`${String(prov.output.sha256).slice(0, 12)}…\`, Adobe sign-in). GitHub attaches files only for accounts with write access to this repo.`;

async function postGithubText({ work, cfg, comment, prov, reportMd, report, fixMd, jira }) {
  const bodyFile = path.join(work, 'out', 'comment-body.md');
  const line = jiraVideoLine(jira, prov);
  fs.writeFileSync(bodyFile, composeBody(line, comment, prov, reportMd, report, fixMd));
  const commentUrl = sh('gh', ['pr', 'comment', String(cfg.pr), '--repo', cfg.repo, '--body-file', bodyFile]);
  const id = commentUrl.match(/issuecomment-(\d+)/)?.[1];
  if (!id) throw new Error(`posted, but no comment URL came back (${commentUrl}); find the comment before retrying`);
  const c = JSON.parse(sh('gh', ['api', `repos/${cfg.repo}/issues/comments/${id}`]));
  if (!ownParagraph(c.body, line)) throw new Error('the Jira video link is not a paragraph of its own in the PR comment');
  return { commentUrl, videoOn: 'jira', sha256: prov.output.sha256, linksJira: jira.commentUrl };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const work = path.resolve(process.argv[2] || '.');
  const cfg = JSON.parse(fs.readFileSync(path.join(work, 'short.json'), 'utf8'));
  const story = JSON.parse(fs.readFileSync(path.join(work, 'story.json'), 'utf8'));
  const mp4 = path.join(work, 'out', 'short.mp4');
  const provFile = path.join(work, 'out', 'provenance.json');
  const prov = fs.existsSync(provFile) ? JSON.parse(fs.readFileSync(provFile, 'utf8')) : null;
  let comment = fs.readFileSync(path.join(work, 'comment.md'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const ticket = story.ticket || cfg.ticket;
  const reportDir = cfg.report ? path.resolve(work, cfg.report) : null;
  const reportMd = reportDir && fs.existsSync(path.join(reportDir, 'report.md')) ? fs.readFileSync(path.join(reportDir, 'report.md'), 'utf8') : '';
  const report = reportDir && fs.existsSync(path.join(reportDir, 'report.json')) ? JSON.parse(fs.readFileSync(path.join(reportDir, 'report.json'), 'utf8')) : null;
  // --no-jira (milo-perf-short): the PR only; nothing is posted to the ticket.
  const noJira = process.argv.includes('--no-jira');
  const fixMd = reportDir && fs.existsSync(path.join(reportDir, 'fixcheck.md')) ? fs.readFileSync(path.join(reportDir, 'fixcheck.md'), 'utf8') : '';
  const jiraToken = process.env.JIRA_TOKEN || process.env.JIRA_PAT || '';
  const head = spawnSync('gh', ['pr', 'view', String(cfg.pr), '--repo', cfg.repo, '--json', 'headRefOid', '-q', '.headRefOid'], { encoding: 'utf8' });
  let drift = headDrift(story, head.status === 0 ? head.stdout.trim() : null, (head.stderr || '').split('\n')[0]);
  // milo-perf-short: a head that only ADDS test-only commits (test/, nala/) on top of the recorded one ships
  // the same code the recording measured; publish, and disclose the move in the comment. Anything else refuses.
  let driftNote = '';
  if (drift && head.status === 0) {
    const cur = head.stdout.trim();
    const cmp = spawnSync('gh', ['api', `repos/${cfg.repo}/compare/${story.provenance.head}...${cur}`, '--jq', '[.status, (.files[].filename)] | .[]'], { encoding: 'utf8' });
    const [status, ...files] = cmp.status === 0 ? cmp.stdout.trim().split('\n') : [];
    if (status === 'ahead' && files.length && files.every((f) => /^(test|nala)\//.test(f))) {
      driftNote = `The PR head moved to \`${cur.slice(0, 9)}\` after the recording at \`${String(story.provenance.head).slice(0, 9)}\`; it changes only tests (${files.map((f) => `\`${f}\``).join(', ')}), so the shipped code measured here is unchanged.`;
      console.log(`head moved, test-only: ${files.join(', ')}`);
      drift = null;
      comment = `${comment.trim()}\n\n${driftNote}\n`;
    }
  }
  const refusals = publishRefusals({ prov, mp4Sha: fs.existsSync(mp4) ? sha(fs.readFileSync(mp4)) : null, comment, ticket, jiraToken, drift, noJira });
  if (refusals.length) { for (const m of refusals) console.error(`REFUSED: ${m}`); process.exit(1); }

  const outFile = path.join(work, 'out', 'published.json');
  const prior = fs.existsSync(outFile) ? JSON.parse(fs.readFileSync(outFile, 'utf8')) : {};
  const doneFor = (x) => x?.hostedMatches && x.sha256 === prov.output.sha256;
  const save = (r) => fs.writeFileSync(outFile, `${JSON.stringify(r, null, 2)}\n`);

  if (process.argv.includes('--video-on-jira') && !noJira) {
    const result = { pr: cfg.pr, mode: 'video-on-jira', ...prior };
    if (doneFor(prior.jira) && prior.jira.commentUrl && prior.jira.ticket === ticket) console.log(`${ticket} already has this short: ${prior.jira.commentUrl}`);
    else {
      result.jira = await postJira({ cfg, ticket, token: jiraToken, mp4, prov, commentUrl: cfg.url || `https://github.com/${cfg.repo}/pull/${cfg.pr}` });
      save(result);
      console.log(`${result.jira.commentUrl}\n${ticket} attachment ${result.jira.attachment}: hosted bytes ${result.jira.hostedMatches ? 'MATCH' : 'DIFFER'}`);
      if (!result.jira.hostedMatches) process.exit(1);
    }
    if (prior.github?.sha256 === prov.output.sha256 && prior.github.linksJira === result.jira.commentUrl) console.log(`PR already links this short: ${prior.github.commentUrl}`);
    else {
      result.github = await postGithubText({ work, cfg, comment, prov, reportMd, report, fixMd, jira: result.jira });
      save(result);
      console.log(`${result.github.commentUrl}\nPR comment links the Jira video`);
    }
    if (!result.jira.relinked) {
      await relinkJira({ cfg, ticket, token: jiraToken, prov, jira: result.jira, commentUrl: result.github.commentUrl });
      result.jira.relinked = true; result.verifiedAt = new Date().toISOString(); save(result);
      console.log(`${ticket} comment now links ${result.github.commentUrl}`);
    }
    process.exit(0);
  }

  let result = { pr: cfg.pr, ...(doneFor(prior) ? prior : {}) };
  if (doneFor(prior)) console.log(`PR already has this short: ${prior.commentUrl}`);
  else {
    result = { ...result, ...(await postGithub({ work, cfg, mp4, comment, prov, reportMd, report, fixMd })), jira: undefined, verifiedAt: new Date().toISOString() };
    save(result);
    console.log(`${result.commentUrl}\n${result.asset}\nPR hosted bytes ${result.hostedMatches ? 'MATCH' : 'DIFFER'} (${result.bytes} B, sha256 ${result.sha256.slice(0, 12)}…)`);
    if (!result.hostedMatches) process.exit(1);
  }

  if (noJira) console.log('--no-jira: nothing posted to the ticket');
  else if (doneFor(prior.jira) && prior.jira.commentUrl && prior.jira.ticket === ticket) console.log(`${ticket} already has this short: ${prior.jira.commentUrl}`);
  else {
    result.jira = await postJira({ cfg, ticket, token: jiraToken, mp4, prov, commentUrl: result.commentUrl });
    save(result);
    console.log(`${result.jira.commentUrl ?? ticket}\n${ticket} attachment ${result.jira.attachment}: hosted bytes ${result.jira.hostedMatches ? 'MATCH' : 'DIFFER'}`);
    if (!result.jira.hostedMatches) process.exit(1);
  }
}
