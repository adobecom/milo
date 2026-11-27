---
name: milo-local-testpage
description: >
  Launch Milo locally (one `aem up` per checkout, side by side) and get a page that actually
  exercises a changed block: find an existing test page, point a consumer page at local Milo
  with ?milolibs=local, or author a test page under tmp/ by copying a real consumer page
  (renaming blocks, overriding metadata) or wrapping a block snippet. Use for "run milo
  locally", "serve both branches side by side", "make a test page for this block", "the test
  URL doesn't load the block", or as the page step of milo-perf-verify / milo-perf-short.
---

# Launch Milo locally and author a test page

A check is only as good as its page. This skill gets you a running Milo and a page that loads
the code a PR changed, on one checkout or on two side by side (base and PR).

## 1. Run Milo

`npm run libs` is `aem up --port=6456`, and serves the checkout's `libs/` at `http://localhost:6456/libs`.
Every consumer site's head script maps `?milolibs=local` to exactly that address, on `.aem.`,
`.hlx.`, `.stage.` and `local` hosts.

**One checkout per side, never `git checkout` in the shared one.** Other sessions use it:

```sh
git fetch adobecom <base> <pr-branch>
git worktree add --detach ../milo-before adobecom/<base>
git worktree add --detach ../milo-after  adobecom/<pr-branch>
ln -s ../milo/node_modules ../milo-before/node_modules   # aem/playwright come from milo's install
ln -s ../milo/node_modules ../milo-after/node_modules
(cd ../milo-before && npx aem up --port=6471 --no-open --livereload=false)   # run in the background
(cd ../milo-after  && npx aem up --port=6472 --no-open --livereload=false)
```

- Run each `aem up` as a background (async) command and keep its handle. Check it answers before
  using it: `curl -s -o /dev/null -w '%{http_code}' http://localhost:6472/libs/utils/utils.js` → 200.
- `--livereload=false` keeps the livereload script out of the page, which would otherwise be a
  request and a websocket that are on one side only if the flags differ.
- For a PR from a fork, fetch it with `git fetch adobecom pull/<N>/head:pr-<N>`.
- Stop the servers and `git worktree remove` the checkouts when you're done.

## 2. Find a page that loads the change

Confirm, don't assume. Open the page and check that the block's files are requested
(`/libs/blocks/<block>/` or `/libs/c2/blocks/<block>/`), and that the block element ends with
`data-block-status="loaded"`.

| Source | Where |
|---|---|
| The PR body's test URLs | Swap `.aem.page` for `.aem.live`: `.page` answers 401 without a login cookie. |
| Nala specs | `nala/blocks/<block>/<block>.spec.js`: the `path` entries are test pages. |
| Milo docs | `https://main--milo--adobecom.aem.live/docs/library/blocks/<block>` |
| Consumer pages | `?milolibs=local` (local Milo on :6456), or `?milolibs=<branch>` / `branch--milo--<owner>` for pushed code. |

Common reasons a page doesn't exercise the change:

- **C2 names.** On a page with `<meta name="foundation" content="c2">`, a block loads from
  `libs/c2/blocks/` only if its name is in `C2_BLOCKS` (`libs/utils/utils.js`). A draft that authors
  `blog-header` when the block is `forge-blog-header` loads nothing. There's no error, just a 404
  for `<page-dir>/undefined.js`.
- The block is in a later section, and the page needs a scroll before it decorates.
- A feature flag or metadata turns it off (`<meta name="...">`, see the block's `getMetadata` calls).

## 3. Author a test page under `tmp/`

`aem up` serves any file in the checkout as-is, at its path with or without `.html`. `tmp/` is
gitignored, so a page there never ends up in a commit. Such a page **does not get `head.html`
injected**: it must include Milo's head itself. The generator does it for you:

A test page is **one foundation, authored throughout**: its `foundation` metadata says C1 or C2, and
every block on it is a block of that foundation, including the blocks the change touches. Run the
generator from the checkout that will serve the page, with the change's range. It writes the page only
when that holds:

- every authored block loads on the page's foundation: on C2 a name in `C2_BLOCKS`, on C1 one in
  `C1_BLOCKS` (`libs/utils/utils.js` of that checkout). A C1-only name on a C2 page is refused by Milo
  (the pink "is a C1 block" box), and a site-only block 404s locally because a local Milo doesn't
  serve the site's codeRoot. Either one changes the page's height, requests and shifts.
- every block `--changed` touches (`libs/blocks/<name>`, `libs/c2/blocks/<name>`) is on that
  foundation. One that isn't authored is noted: another block may load it, and milo-perf-verify's
  `--changed` proves whether its files ran.

It never renames on its own. When the source page authors other names (here the stage draft still
uses the site's `blog-header`), author the right ones yourself with `--rename`, one per block on
the page, and say so in the writeup.

```sh
# Copy a real consumer page, authored with the C2 names of every block on it
node .agents/skills/milo-local-testpage/make-testpage.mjs \
  --from "https://stage--da-bacom-blog--adobecom.aem.live/blog/drafts/slavin/blog-demo-page-c2-corrected" \
  --changed origin/stage...HEAD \
  --rename blog-header=forge-blog-header,ai-summary=forge-ai-summary,related-content-card=forge-related-content-card,blog-related-content=forge-blog-related-content,tag-cta=forge-tag-cta \
  --meta header=off,footer=off \
  --out tmp/perf/blog-article.html

# Or wrap a block snippet (EDS table markup) in a page
node .agents/skills/milo-local-testpage/make-testpage.mjs \
  --html my-block.snippet.html --foundation c2 --out tmp/perf/my-block.html
```

What `--from` does:

- It keeps the page's `<main>` and every `<meta name|property>`.
- It drops its scripts and styles: Milo's own `libs/scripts/scripts.js` takes their place, served by
  whichever checkout serves the page, so the page always runs that checkout's code.
- It makes every `href`, `src` and `srcset` absolute against the source page, so images and linked
  articles still load from the CDN.
- `--rename` authors block classes, `--meta k=v` overrides metadata (`k=-` removes a tag), and
  `--drop <selectors>` removes nodes. `--allow-mismatch` writes a page that fails the checks above;
  don't measure one.

Templates for blocks without any page are in `templates/`. `block-snippet.html` shows the EDS table
shape: a `<div class="block-name variant">` holding one `<div>` per row, each holding one `<div>`
per cell. Write the content the block's JS reads (look at its `init(el)`), at realistic lengths:
a one-word title hides layout shifts that a two-line title causes.

Rules for a test page:

- **The same file on both sides.** Copy it byte for byte into each worktree's `tmp/`; never
  generate it twice.
- **Turn off what the PR doesn't touch**, so its noise can't hide the change. Use `header=off` /
  `footer=off` when the gnav isn't in the diff (gnav and footer sources on `.aem.page` 401
  anyway), and `?martech=off`.
- **Keep what the PR does touch at a realistic size**: the real images, the real copy length, the
  block in the position it has on real pages (the first section, if it's a hero).
- **Note any page you built in the PR writeup**, and attach the HTML or the generator command, so
  a reviewer can reproduce it.

## 4. Check it before measuring

Run this one-off from the milo root:

```sh
node -e "
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  p.on('response', (r) => r.status() >= 400 && console.log(r.status(), r.url()));
  await p.goto(process.argv[1]); await p.waitForTimeout(5000);
  console.log(await p.\$\$eval('main div[class]', (els) => els.filter((e) => e.dataset.blockStatus).map((e) => e.className + ' ' + e.dataset.blockStatus)));
  await p.screenshot({ path: 'tmp/perf/check.png' }); await b.close();
})();" "http://localhost:6472/tmp/perf/blog-article.html?martech=off"
```

Look at the screenshot. The blocks you care about must say `loaded`, and every 4xx must be explained.
Explained means one of: a missing placeholder sheet, an author image the CDN won't serve
cross-origin, or a site-only JSON file. Then hand the two URLs to **milo-perf-verify** (local mode).
