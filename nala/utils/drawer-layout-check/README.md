# BC drawer layout check (test branch only — do not merge)

Long-lived branch `bc-drawer-layout-check`, rebased onto the BC drawer branch (`mwpw-12345-bc-persistent-panel`) as needed. Tracking: INFINITY-1931 / INFINITY-1921.

For each page and window width `W`, the check takes two full-page screenshots and compares them:

- **A**: the page at width `W` with the drawer open, cropped to the content area (`W - drawer`).
- **B**: the same page at width `W - drawer` with the drawer closed.

If the page handles the drawer well, A and B look the same. The check also lists visible content that ends up
outside the content area in A.

## Requirements

- Google Chrome installed.
- `npm ci` once per checkout, from the repo root.
- Pages on `*.stage.adobe.com` that have a Brand Concierge block.

## How to run

Run from the repo root.

```sh
# Against your local Milo: first run `npm run libs` in another terminal (serves localhost:6456).
# Uses pages.txt in this folder and widths 1920,1600,1440,1280.
node nala/utils/drawer-layout-check/drawer-layout-check.js --out test-drawer-layout-results/local
open test-drawer-layout-results/local/index.html
```

```sh
# Against a pushed Milo branch, with your own page list and two widths.
printf '%s\n' https://www.stage.adobe.com/creativecloud.html https://www.stage.adobe.com/acrobat.html > /tmp/drawer-pages.txt
node nala/utils/drawer-layout-check/drawer-layout-check.js \
  --milolibs mwpw-12345-bc-persistent-panel \
  --pages /tmp/drawer-pages.txt \
  --widths 1920,1440 \
  --out test-drawer-layout-results/branch
open test-drawer-layout-results/branch/index.html
```

## Options (defaults in parentheses)

- `--pages` (`nala/utils/drawer-layout-check/pages.txt`): file with one URL per line; `#` comments allowed.
- `--milolibs` (`local`): `local` (requires `npm run libs` on port 6456) or a pushed Milo branch name.
- `--widths` (`1920,1600,1440,1280`): comma-separated window widths `W` in pixels.
- `--drawer` (`400`): drawer width in pixels.
- `--height` (`900`): window height in pixels.
- `--concurrency` (`3`): how many comparisons run in parallel.
- `--out` (`test-drawer-layout-results/<timestamp>`): output folder.

## Reading the report

`index.html` is a table with one row per page and one column per width. Each cell shows the diff and how many items
are outside the content area, and links to a side-by-side page for that comparison.

- **diff**: share of pixels that differ between A and B. A change near the top of a page tends to push everything
  below it, so a large number doesn't always mean many separate problems.
- **outside the content area**: visible content in A that is under the drawer or cut off at the left edge, grouped by
  block. Elements that don't draw anything (empty or transparent) are ignored.
- **overlay**: the drawer covered the page instead of pushing it at this width, so there is nothing to compare.

The side-by-side page shows A, B and a diff image (differing pixels in red). The three scroll together, and
"jump to first difference" scrolls to the first row of pixels that differs.

`results.json` has the same data, and the screenshots are saved next to the report.

## Notes

- Chat itself isn't loaded (its requests are blocked), so the drawer shows a "could not be loaded" message; only
  layout matters for this check. The drawer is opened by setting the "chat was open" state before the page loads.
- To keep screenshots stable, pages load with `?martech=off`, video is paused, and the cookie banner and Brand
  Concierge entry points in the nav are hidden.
- Results can include noise from content that changes between loads (for example, a sign-in button that renders late).

Page-settling logic is adapted from `Adobe-acom/nala-visual-runner` (`tools/screenshot-diff/lib/settle.js`).
