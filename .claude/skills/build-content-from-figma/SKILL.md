---
name: build-content-from-figma
description: >
  Extracts content from Figma designs and produces an authored HTML
  document following the C2 block authoring pattern. Downloads Figma
  assets locally, then uploads images and HTML directly to the DA
  admin API. Handles text, media, icons, and per-viewport variations.
---

# Build Content from Figma Skill

You are creating an authored HTML document for the **C2 design system**
by extracting content from Figma designs. The document follows the
standard block authoring pattern and is uploaded to **DA** (Document
Authoring) for publishing via Adobe EDS.

> **Critical rules**
>
> - Assets are downloaded from Figma locally, then uploaded directly
>   to the DA admin API via `curl POST` to
>   `admin.da.live/source/...` with multipart form data.
> - Block content is authored as a `<table>` (see
>   `references/authoring-pattern.md`); `section-metadata` and
>   `metadata` remain div-based.
> - **Never embed images as base64 in DA HTML.**
> - The HTML references assets using their **final
>   `content.da.live` URLs** (computed from the DA destination and
>   the shadow folder convention). Since we upload assets ourselves,
>   we know the exact paths upfront.
> - Typography tokens from Figma (`--s2a-typography-*`) determine
>   heading levels, body sizes, and eyebrow classification.
> - Viewport-specific content follows the inheritance model:
>   only include what changes per viewport. Omit viewports and
>   columns that are identical to a lower viewport.
> - Link URLs use `https://www.adobe.com/` as a placeholder.
>   Link display text must match Figma.

## Bundled resources

Do **not** load these upfront. Each phase tells you which file to
read when it becomes relevant.

### references/
| File | Purpose |
|------|---------|
| `authoring-pattern.md` | HTML div structure for DA block authoring: document skeleton, viewport rows, content columns, media placement, complete examples. |
| `token-mapping.md` | Maps `--s2a-typography-*` Figma tokens to heading levels (`h1`-`h4`), body sizes (`lg`, `md`, `sm`, `xs`), and eyebrow classification. Includes fallback heuristics. |

### agents/
| File | Purpose |
|------|---------|
| `figma-content-extractor.md` | Extracts structured content (text, media, tokens) from a single Figma frame. Run once per viewport. |

---

## Inputs

Collect all inputs before starting extraction work.

| Input | Required | Example |
|---|---|---|
| **Figma URL(s)** | At least one | One URL per viewport (mobile, tablet, desktop) |
| **DA destination** (org, repo, path) | Yes | `adobe / my-repo / docs/my-page.html` |

Ask which viewport each Figma URL corresponds to. Valid viewports:
- **Mobile** (S, up to 767 px)
- **Tablet** (M, 768-1279 px)
- **Desktop** (L/XL, 1280 px +)

If only one URL is provided, the document has no viewport variations.

---

## Phase 1 — Gather requirements

### 1a. Collect Figma frames

Ask the user for Figma frame URL(s). Each URL corresponds to a
viewport. At minimum one frame is required.

### 1b. Confirm block name (BLOCKING)

For each Figma URL, use **Figma MCP** `get_metadata` to inspect
the frame name. Look for a recognizable block name in the frame
label or parent component name (e.g. "aside", "marquee", "brick",
"media", "editorial-card").

Present the suggested name and ask the user to confirm or provide
an alternative. This name becomes the class on the block's outer
`<div>`.

> **STOP**: Do NOT proceed to Phase 2 until the user explicitly
> confirms the block name. If the user provides a different name,
> use theirs. If they do not respond, wait.

### 1c. Collect DA destination

Ask for:
- **Organization** (e.g. `adobe`)
- **Repository** (e.g. `my-site`)
- **File path** (e.g. `docs/my-page.html`)

The media folder is derived automatically in Phase 4c using the
dot-prefixed shadow folder convention.

### 1d. Confirm before proceeding

```
Block name:    <name>
Viewports:     Mobile [check] | Tablet [check/cross] | Desktop [check/cross]
DA target:     <org>/<repo>/<path>
Media folder:  <org>/<repo>/<media-folder>/
```

Wait for user confirmation.

---

## Phase 2 — Extract content from Figma

**Load `references/token-mapping.md` now.**

For each provided Figma frame, **load `agents/figma-content-extractor.md`**
and follow its procedure. If multiple frames are provided, run
extractions in parallel.

Provide each extraction with:
- The Figma frame URL (fileKey and nodeId)
- The viewport label (mobile, tablet, or desktop)

Each extraction returns:
- Icon (Figma asset URL + node ID + alt text, if present)
- Eyebrow text (if present)
- Heading text + level (h1-h4)
- Body text + size class (body-lg, body-md, body-sm, body-xs)
- Links (display text + CTA style: primary/secondary/plain, 0 or more)
- Background (color string, or Figma asset URL + node ID if image)
- Foreground (Figma asset URL + node ID, if present)
- Additional media (if present)
- Fallback classifications (elements where tokens were not found)

---

## Phase 3 — Compute viewport differences

Compare extracted content across viewports to determine what needs
explicit authoring vs what can be inherited.

### Inheritance rules

Viewports inherit upward: mobile -> tablet -> desktop. See
`references/authoring-pattern.md` for the full inheritance table
and partial viewport HTML patterns.

### Comparison checklist

For each viewport pair (mobile->tablet, tablet->desktop), compare:
- Icon: same or different?
- Eyebrow text: same or different?
- Heading text and level: same or different?
- Body text and size: same or different? (size change triggers a viewport variant)
- Links: same count and text?
- Background: same color/image?
- Foreground: same or different?

### Present diff table

```
Element          | Mobile        | Tablet       | Desktop
---------------------------------------------------------
Icon             | sparkle.svg   | = (inherit)  | = (inherit)
Eyebrow          | "New"         | = (inherit)  | "Updated"
Heading (h3)     | "Get started" | = (inherit)  | "Get started today"
Body (body-md)   | "Lorem..."    | = (inherit)  | "Different text..."
Links            | 2 links       | = (inherit)  | 1 link
Background       | #1a1a1a       | gradient     | gradient
Foreground       | hero.png      | = (inherit)  | hero-wide.png

Viewport sections needed: Mobile + Tablet (bg only) + Desktop
```

### Body size variant

Check the body size from each viewport's extraction. `body-md` is
the default and needs no variant. `body-sm` or `body-lg` must be
declared.

**Same body size across all viewports:** add it as a variant on the
block header.

- `aside` + body-sm → `<p>aside (body-sm)</p>` in the header row
- `aside` + body-lg → `<p>aside (body-lg)</p>` in the header row

**Body size differs per viewport:** declare the base (mobile) size
on the block header, then override in the viewport row.

- Mobile body-md, Desktop body-lg →
  - Header: `<p>aside</p>`
  - Desktop row: `<tr><td colspan="2"><p>Desktop-viewport (body-lg)</p></td></tr>`
- Mobile body-sm, Tablet body-lg →
  - Header: `<p>aside (body-sm)</p>`
  - Tablet row: `<tr><td colspan="2"><p>Tablet-viewport (body-lg)</p></td></tr>`

Variants are comma-separated inside parentheses in both the block
header and viewport rows; they are text content parsed at render time.

Wait for user confirmation of the diff analysis.

---

## Phase 4 — Download and prepare media

Collect all Figma asset URLs from Phase 2 and download them
locally. This is **required**, not optional. We upload assets
directly to the DA admin API, so they must exist on disk first.

> **Critical constraints**
>
> - **No compression, no resizing, no Python scripts.** DA and EDS
>   handle image optimization.
> - **Never read image data into context.** Do not use the Read
>   tool on image files. Do not `cat` them. Do not print base64
>   output to inspect it.

### 4a. Collect asset URLs

From the Phase 2 extraction output, collect every Figma asset URL:
- Icon asset URLs
- Background image asset URLs (per viewport)
- Foreground image asset URLs (per viewport)
- Any additional media asset URLs

Deduplicate: if the same asset appears across viewports (e.g. a
shared icon), include it only once.

### 4b. Download assets locally

Download each Figma asset to a local folder. **Use descriptive
filenames with proper extensions** (e.g. `bg-mobile.png`,
`adobe-firefly-icon.svg`). Figma MCP asset URLs serve files
without extensions, so you must determine the type yourself.

```bash
mkdir -p /tmp/figma-media/<page-name>
curl -sL "<figma-asset-url>" -o /tmp/figma-media/<page-name>/<filename>
```

After downloading, verify the file type:
```bash
file /tmp/figma-media/<page-name>/<filename>
```

Common types from Figma:
- `SVG Scalable Vector Graphics image` → use `.svg` extension
- `PNG image data` → use `.png` extension
- `JPEG image data` → use `.jpg` extension

#### SVG icons follow a different path than raster images

Icons in Figma are almost always multi-layer (background +
symbol/text). `get_design_context` decomposes them into separate
per-layer asset URLs, each incomplete. **Do not use individual
layer asset URLs for icons.**

Instead, export the composite SVG via the Figma Plugin API:

```javascript
// use_figma: Export icon node as composite SVG
const node = await figma.getNodeByIdAsync('<icon-node-id>');
const svgBytes = await node.exportAsync({ format: 'SVG' });
const svgString = String.fromCharCode(...svgBytes);
return svgString;
```

Save the returned SVG content to a local `.svg` file. Then:

1. Upload the SVG to the **same directory as the document** via
   `POST admin.da.live/source/<org>/<repo>/<parent-path>/<icon-name>.svg`.
2. **Preview** the SVG via
   `POST admin.hlx.page/preview/<org>/<repo>/main/<parent-path>/<icon-name>.svg`.
3. Use the resulting **`aem.page` preview URL** in the HTML as
   both the `href` and the display text of the icon `<a>` tag:
   ```html
   <p><a href="https://main--<repo>--<org>.aem.page/<path>/<icon>.svg">https://main--<repo>--<org>.aem.page/<path>/<icon>.svg</a></p>
   ```

### 4c. Compute DA asset paths

Since we upload assets directly, compute the final
`content.da.live` URLs upfront. Use the **dot-prefixed shadow
folder** convention:

```
https://content.da.live/<org>/<repo>/<parent-path>/.<page-name>/<filename>
```

Example: page at `homepage/drafts/<your-ldap>/my-block.html`
stores media at:
```
https://content.da.live/<org>/<repo>/homepage/drafts/<your-ldap>/.my-block/bg-mobile.png
```

These URLs go directly into the HTML in Phase 5.

### 4d. Color backgrounds

Solid colors, gradients, and semi-transparent values are not
assets. They are placed as text in the media column:
- `rgb(255 255 255 / 0)`
- `#1a1a1a`
- `linear-gradient(135deg, #1a1a1a, #2d2d2d)`

---

## Phase 5 — Build HTML document

**Load `references/authoring-pattern.md` now.**

### Document skeleton

The block is authored as an explicit `<table>` so that media can
stack in the right column while the text column spans via `rowspan`.
The surrounding `section-metadata` and `metadata` sections remain
div-based.

```html
<body>
  <header></header>
  <main>
    <div>
      <table>
        <tbody>
          <tr><td colspan="2"><p>block-name (variant1, variant2)</p></td></tr>
          <!-- viewport and content rows -->
        </tbody>
      </table>
      <div class="section-metadata">
        <div>
          <div>style</div>
          <div>container, wide</div>
        </div>
      </div>
    </div>
    <div>
      <div class="metadata">
        <div>
          <div>foundation</div>
          <div>c2</div>
        </div>
      </div>
    </div>
  </main>
  <footer></footer>
</body>
```

The first row of the block table is the header: a single
`<td colspan="2">` containing `<p>block-name (variant1, variant2)</p>`.
Variants go in parentheses, comma-separated. If there are no
variants, just `<p>block-name</p>`.

The `section-metadata` block is placed in the **same section** as
the content block (same parent `<div>`, no `---` separator). It
sets `style: container, wide` for the section layout.

The `metadata` section with `foundation: c2` is **required** for C2
blocks. Without it, the EDS block loader will not resolve blocks
from `libs/c2/blocks/` and the block JS/CSS will fail to load.

### Assembly rules

**No viewport variations** (single frame, or all viewports identical):
the header row is followed directly by the content row(s); no
viewport rows.

**With viewport variations**: add viewport rows and content rows
per the authoring pattern. Only include viewports that differ from
their parent. Each viewport row is a single `<td colspan="2">`
containing the viewport keyword.

For each viewport section:

**Left column text cell** (use `rowspan="N"` where N = number of
stacked media sub-rows on the right; omit `rowspan` when N=1):
1. Icon (SVG): `<p><a href="<aem.page-preview-url>"><aem.page-preview-url></a></p>` (if present). Both href and display text are the preview URL. See Phase 4b for SVG icon upload details.
2. Eyebrow: `<p>eyebrow text</p>` (if present)
3. Heading: `<hN>text</hN>` where N is from token mapping. Add
   `<strong>` inside if the Figma text is bold.
4. Body: `<p>text</p>`
5. Links: wrap each `<a>` based on its CTA style:
   - Primary CTA (filled button): `<strong><a href="https://www.adobe.com/">text</a></strong>`
   - Secondary CTA (outline/ghost button): `<em><a href="https://www.adobe.com/">text</a></em>`
   - Plain link (text-only, no button styling): `<a href="https://www.adobe.com/">text</a>`

**Right column media cells** (one `<td>` per media element, each in
its own `<tr>` after the first):
- Color background: the CSS value as text content inside the `<td>`
- Image media: `<td><picture><img src="<content.da.live-url>" alt="..."></picture></td>`

Order in the right column: background first, foreground second,
then any additional media. The first media sub-row shares the `<tr>`
with the text cell; every subsequent media sub-row is its own `<tr>`
containing only the right `<td>`.

### Save HTML to disk

Write the HTML file to the upload folder, mirroring the DA path:
```
/tmp/da-upload/<da-path>/<page-name>.html
```

Example: `/tmp/da-upload/homepage/drafts/<your-ldap>/my-page.html`

### Present HTML for review

Show the constructed HTML to the user and ask for confirmation
before proceeding to upload.

---

## Phase 6 — Upload to DA

Upload images and HTML directly to the DA admin API. No
intermediate tools needed.

All curl commands in Phases 6 and 7 use:
```bash
TOKEN=$(da-auth-helper token 2>/dev/null)
```

### 6a. Ask the user

Present the upload plan and ask:

```
DA upload:
  HTML:       /tmp/da-upload/<da-path>/<page-name>.html
  Assets:     <N> images in /tmp/figma-media/<page-name>/
  Target:     <org>/<repo>

Ready to upload?
```

Wait for user confirmation before proceeding.

### 6b. Check token

Verify `da-auth-helper` is installed and can provide a token:

```bash
da-auth-helper token >/dev/null 2>&1 && echo "Token OK" || echo "No token"
```

If the command fails, instruct the user to:
1. Install: `npm install -g github:adobe-rnd/da-auth-helper`
2. Log in: `da-auth-helper login` (opens browser for Adobe IMS; choose the **Skyline** profile when prompted)
3. Verify: `da-auth-helper token`

Wait for the user to confirm before continuing. The token is
cached at `~/.aem/da-token.json` and refreshed automatically
when it expires.

### 6c. Upload images

Upload each image to the shadow folder via the DA admin API.
Use `POST` with multipart form data. Run uploads in parallel.

```bash
curl -s -w "\n%{http_code}" -X POST \
  "https://admin.da.live/source/<org>/<repo>/<parent-path>/.<page-name>/<filename>" \
  -H "Authorization: Bearer $TOKEN" \
  -F "data=@/tmp/figma-media/<page-name>/<filename>;type=<mime-type>"
```

MIME types:
- `.png` → `image/png`
- `.jpg` / `.jpeg` → `image/jpeg`
- `.svg` → `image/svg+xml`
- `.webp` → `image/webp`

Expect **201 Created** for each file. If you get 401, the token
has expired; ask the user to refresh it.

### 6d. Upload HTML

Upload the HTML file to DA:

```bash
curl -s -w "\n%{http_code}" -X POST \
  "https://admin.da.live/source/<org>/<repo>/<da-path>/<page-name>.html" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: text/html" \
  --data-binary @/tmp/da-upload/<da-path>/<page-name>.html
```

Expect **200 OK** or **201 Created**.

### 6e. Verify

After uploading, verify images are accessible:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  "https://content.da.live/<org>/<repo>/<parent-path>/.<page-name>/<filename>" \
  -H "Authorization: Bearer $TOKEN"
```

Expect **200** for each image.

### 6f. Handle result

**On success:** report the DA edit URL:
- Edit: `https://da.live/edit#/<org>/<repo>/<da-path>/<page-name>`

**On failure:**
1. 401 → token expired, ask the user to run `da-auth-helper login` (choose the **Skyline** profile).
2. 403 → check org/repo permissions.
3. Images 404 after upload → verify the POST returned 201 and
   the path matches the HTML reference exactly.

---

## Phase 7 — Preview & Publish

After a successful upload, ask the user whether they want to
preview and publish the document.

### 7a. Ask user

```
Document uploaded. Would you like to preview and publish? (y/n)
```

If the user declines, skip to Phase 8.

### 7b. Path safety check (BLOCKING)

Check whether the DA file path contains `/drafts/`.

**Path contains `/drafts/`:** safe to proceed. Continue to 7c.

**Path does NOT contain `/drafts/`:**

Present this warning and wait for explicit confirmation:

```
⚠️  You're about to preview and publish a document on production.
Are you sure you want to proceed? (y/n)
```

If the user declines, skip to Phase 8.

> **STOP**: Do NOT call the preview or publish APIs without passing
> this check. This guardrail is mandatory and cannot be bypassed,
> even if the user already confirmed the upload in Phase 6a. The
> two confirmations serve different purposes.

### 7c. Preview

POST to the EDS admin API to generate a preview:

```bash
curl -s -w "\n%{http_code}" -X POST \
  "https://admin.hlx.page/preview/<org>/<repo>/main/<da-path>/<page-name>" \
  -H "Authorization: Bearer $TOKEN"
```

Expect **200 OK**. On success, report the preview URL:
```
Preview: https://main--<repo>--<org>.aem.page/<da-path>/<page-name>
```

### 7d. Publish

POST to the EDS admin API to publish. If the document contains SVG
icons (uploaded and previewed in Phase 4b), publish those first,
then publish the document.

```bash
# Publish each SVG icon (if any)
curl -s -w "\n%{http_code}" -X POST \
  "https://admin.hlx.page/live/<org>/<repo>/main/<parent-path>/<icon-name>.svg" \
  -H "Authorization: Bearer $TOKEN"

# Publish the document
curl -s -w "\n%{http_code}" -X POST \
  "https://admin.hlx.page/live/<org>/<repo>/main/<da-path>/<page-name>" \
  -H "Authorization: Bearer $TOKEN"
```

Expect **200 OK**. On success, report the live URL:
```
Live: https://main--<repo>--<org>.aem.live/<da-path>/<page-name>
```

### 7e. Handle errors

- **200**: success, show URLs above.
- **401**: token expired, ask the user to run `da-auth-helper login` (choose the **Skyline** profile).
- **403**: permissions issue, inform user.

---

## Phase 8 — Cleanup

After a successful upload, ask the user if they want to keep or
delete the local folders:

```
Upload complete. Delete /tmp/da-upload/ and /tmp/figma-media/ ? (y/n)
```

If the upload failed or the user wants to keep the folders, leave
them in place.

---

## Phase 9 — Summary

Output:

1. **Block name** and DA file path.
2. **Viewports authored** and what differs per viewport.
3. **Content structure**: icon, eyebrow, heading level, body size,
   link count.
4. **Placeholder links**: remind the user to update the dummy
   `https://www.adobe.com/` URLs with real destinations.
5. **Fallback classifications**: any elements where tokens were not
   found and visual heuristics were used.
6. **Obstacles encountered**: Figma ambiguities, missing tokens, or
   content that required manual judgment.
7. **Local files**: paths to `/tmp/da-upload/` (HTML) and
   `/tmp/figma-media/` (images), if not deleted.
