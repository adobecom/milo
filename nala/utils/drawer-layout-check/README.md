# BC drawer layout check (test branch only — do not merge)

Long-lived branch `bc-drawer-layout-check`, rebased onto the BC drawer branch (`mwpw-12345-bc-persistent-panel`) as needed. Tracking: INFINITY-1931 / INFINITY-1921.

The Brand Concierge (BC) drawer is a 400px chat side panel on the right that pushes page content left when open. This tool checks how a page looks with the drawer open compared to the same page at a naturally narrower viewport, and flags content hidden behind the drawer. For each page and viewport width `W`, it takes two full-page screenshots of the `W - drawer` content area:

- **A (drawer open)**: viewport `W` with the drawer open (content pushed left by `drawer` px), cropped to `W - drawer`.
- **B (drawer closed)**: viewport `W - drawer` with the drawer closed.

## Requirements

- System Google Chrome installed.
- Run `npm ci` once per checkout from the repo root.
- Pages must be on `*.stage.adobe.com` (needed for `?acom-assistant-panel=on`) and have a BC block in the gnav or body.

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

- `--pages` (`nala/utils/drawer-layout-check/pages.txt`): file with one `*.stage.adobe.com` URL per line; `#` comments allowed.
- `--milolibs` (`local`): `local` (requires `npm run libs` on port 6456) or a pushed Milo branch name.
- `--widths` (`1920,1600,1440,1280`): comma-separated viewport widths `W` in pixels.
- `--drawer` (`400`): drawer width in pixels.
- `--height` (`900`): viewport height in pixels.
- `--concurrency` (`3`): parallel page/width checks.
- `--out` (`test-drawer-layout-results/<timestamp>`): output folder for `index.html`, `results.json`, and screenshots.

## How to read the report

- **Diff (`%` and diff image)**: compares **A** and **B** pixel by pixel. Differing pixels are drawn in red over a faded copy of **A**.
- **`first diff y`**: the vertical pixel coordinate where **A** and **B** first differ. This is often more useful than the total diff percentage because any height change shifts everything below it.
- **`under drawer`**: visible elements in **A** whose right edge extends past `W - drawer` behind the drawer. This check does not depend on breakpoints. Fixed elements sized to the full viewport (such as `.feds-backdrop`) appear here too.
- **Breakpoints (900 / 1200 / 1440px)**: CSS media queries use the full viewport `W`, not the narrowed `W - drawer` space. Whenever a Milo breakpoint falls between `W - drawer` and `W`, the pushed page (**A**) keeps the wider breakpoint's layout inside the narrower space while **B** uses the narrower breakpoint. That is a real difference this check is meant to surface, but it changes most of the page and can hide smaller issues. With a 400px drawer, only `W >= 1840` keeps both sides on the same breakpoint, so diffs there point at other viewport-tied code (`vw` units, `innerWidth`/`matchMedia` JS).

## Notes and limitations

- Jarvis chat domains are blocked so the floating window never covers content and the drawer shell is deterministic (it shows "Chat could not be loaded"; only page layout matters).
- Because Jarvis is blocked, the script opens the drawer via Milo's reopen state (`localStorage['bc-side-overlay'] = 'open'` and the BC session cookie) instead of clicking an entry point.
- Pages load with `?martech=off`, media paused, and the cookie banner, stage nav badge, and gnav BC icons hidden.

Settle logic is condensed from `Adobe-acom/nala-visual-runner` (`tools/screenshot-diff/lib/settle.js`).
