---
name: milo-perf-short
description: >
  Make a 15-30 second narrated performance short for a Milo PR from a finished milo-perf-verify run:
  film the same test page before and after under the same device profile and throttling (one cold load
  plus one matched scroll, LCP boxed), render a scorecard drawn only from report.json (CLS, TBT, LCP,
  requests before LCP, initiator stacks), build and screen the video with the pr-short engine, then post
  it with the perf writeup to the PR (GitHub comment) and its Jira ticket, verifying the hosted bytes.
  Use for "perf short", "record the performance short", "prove no CLS / no new requests on video", or
  after milo-perf-verify when a reviewer-facing proof is wanted. Never commits, merges or marks a PR ready.
---

# Milo perf short

The proof that a PR leaves loading alone, or what it changed, in a form a reviewer watches in 20 s. It is
pr-short (forgeflex) cut to one job: **the numbers come from milo-perf-verify, the film shows the same
page and throttling, the words say nothing the report doesn't.**

`S=.agents/skills/milo-perf-short`. Workspace `W` defaults to `tmp/perf/<slug>-short` (gitignored).

| Step | Command | What it does / refuses |
|---|---|---|
| measure | **milo-perf-verify** → `tmp/perf/<slug>/report.json` | The numbers. A short without a finished run is refused (record needs report.json). |
| record | `node $S/record.mjs --work $W --report tmp/perf/<slug> --pr N --ticket MWPW-N --title "..." [--profile mobile] [--scroll-ms 5000]` | Re-uses the run's URLs, local ports and blocked hosts. Per side: a warm-up load, then a filmed cold load, 1.5 s, and one matched smooth scroll of up to three screens. Writes `rec/{before,after}.webm`, `rec/probe.json`, `rec/scorecard.png`, and drafts `short.json`, `story.json`, `comment.md` (never overwritten). |
| write | edit `story.json`, `comment.md` | Fill every `TODO` (lint refuses leftovers). See §2. |
| build | `node $S/engine/build.mjs $W/story.json` | Lint, synthesize, render, screen → `out/short.mp4`, `sheet.png`, `captions.srt`, `provenance.json`. A draft: look at it (§3). |
| final | `node $S/engine/build.mjs $W/story.json --final` | Same, plus: refuses if the PR head moved since `record` (or cannot be read), refuses a flagged screen. |
| publish | `node $S/engine/publish.mjs $W` | Refuses a draft, a flagged screen, an mp4 edited after final, head drift, a `TODO` in `comment.md`, no ticket, or no `JIRA_TOKEN`/`JIRA_PAT`, all before posting anywhere. PR comment = the per-viewport verdict table first, then the video, `comment.md`, the run's `report.md` under "Full perf report", provenance. Jira = the short only: the mp4 attached and embedded, and a link to the PR comment; no perf writeup, so the numbers live in one place. Hosted bytes verified on both; a rerun finishes only the platform still missing. |
| publish, PR only | `node $S/engine/publish.mjs $W --no-jira` | Posts the short and the description on the PR and nothing on the ticket. If the report folder has a `fixcheck.md` (milo-perf-verify's fix check), it leads the comment instead of the verdict table. |

The engine (`build.mjs`, `screen.mjs`, `tts.py`, `lint.mjs`) is vendored from forgeflex `pr-short`, and only
`lint.mjs` changes: a comparison may be the scorecard still when it names `evidence: "report.json"`. Read
the scene-type reference at the top of `engine/build.mjs`. Fix engine bugs upstream too.

## 1. Pick the film

- **One profile.** Mobile by default: it's the most throttled (4x CPU, slow 4G), so a change in what loads
  before LCP shows most there. Use the viewport where the report found something, if it found something.
- **Same everything.** `record` films after the run, with the same URLs, ports and blocked hosts, and
  interleaves a warm-up load per side, so both films start from the same caches. The film is one load,
  not the median. Its LCP is labeled on screen, so if the film's LCP is far from the report's median
  (more than the run's IQR), re-record rather than narrate a lucky take.
- **The PR head moves.** `build --final` refuses when the PR head is no longer the `--head` that was
  recorded. Check out the new head in the after worktree, re-run `milo-perf-verify` into a new `--out`,
  and re-record. A new commit can flip the verdict, so don't reuse the old narration as is.
  One exception, publish only: if the new head is a descendant of the recorded one and every file
  changed since is under `test/` or `nala/`, publish goes ahead and adds a line naming the move and the files.
- **The box marks the LCP element** from `until` the scroll starts. Add a second box per side for a shift
  source or a changed block if the report names one (`rect` in CSS px of the viewport, inside the panel).

## 2. Write the story

`story.json` from `record` has three scenes, plus a drafted `verdict` when the report is not PASS:

| Scene | Beat | Say (about) |
|---|---|---|
| `card` | context | What the PR changes about loading, in one sentence (≤ 18 words). |
| `split` before \| after | comparison | What the film shows: when each side paints, any shift; the LCP numbers only if they moved beyond the report's ranges. |
| `still` scorecard | comparison | The scorecard: CLS, TBT, requests before LCP, stacks. Name the one request that left or arrived. |
| `verdict` (optional) | verdict | Only an open item: a regression, a viewport not measured, a page that could not exercise the change. |

- **Every sentence maps to a cell of report.md.** "No new requests before LCP" needs an empty "New before
  LCP" list. "No layout shift" needs CLS at or near 0 on every viewport. "Stacks identical" needs zero
  initiator-stack changes. A rename is called a rename, never a new request.
- **Narration:** ordinary words, 35-60 words total, at most 70. No URLs, no ticket key read aloud, nothing
  from lint's `BANNED` list. Use Ava (`en-US-AvaMultilingualNeural`) at -5%, the engine default, and never
  substitute another voice. If the words run long, shorten them rather than speeding up the voice.
- `comment.md`: one sentence on the result, then the disclosures. The disclosures are: a local test
  page (and how it was made), any hosts blocked on both sides, header or footer off, martech off, the
  number of runs, what the film is (one load), and whether anyone listened to the audio. Publish adds
  report.md and the provenance.
- Light `paper` palette, calm motion. The card is drawn on frame 0, which is GitHub's thumbnail.

## 3. Look before you publish

`build` screens every output (`engine/screen.mjs`). It checks for 1920x1080 H.264 + AAC at 30 fps, a
frame 0 that isn't blank, narration that isn't silent, and no static span of 3 s or more inside a
comparison (the scorecard moves slowly, so it passes). Only once it passes, look at `out/sheet.png` and full-size
frames at the LCP box and on the scorecard (`ffmpeg -ss <t> -i out/short.mp4 -frames:v 1 f.png`). Check
four things: the scorecard numbers match report.md, the labels say BEFORE and AFTER on the right sides,
the boxes sit on the LCP element, and nothing is clipped.

## 4. Publish

A short that passes `final` and your look is posted to both the PR and the ticket without asking, unless
the user said not to. publish never edits the PR description or ticket fields, never transitions the ticket,
and never merges.

**No GitHub attachments.** GitHub attaches files only for accounts with write access to adobecom/milo, and an
Enterprise Managed User (`*_adobe`) cannot comment there at all. Without write access, use
`node $S/engine/publish.mjs $W --video-on-jira`. It attaches and embeds the video on the ticket, verifies
the hosted sha256, and posts a text-only PR comment (verdict table, then a line linking the Jira comment, then the
same words and report). Then it edits the Jira comment to link the PR comment. If the active `gh` account is an EMU,
ask the user which account to post from (`gh auth switch -u <user>`), and switch back afterwards.
A rerun only finishes the steps still missing (`out/published.json`). Then stop any `aem up` you started and remove the before/after worktrees
(**milo-local-testpage** §1).
