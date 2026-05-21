# Figma Content Extractor Subagent

Delegated from Phase 2 of the main SKILL.md. Extracts structured
content from a single Figma frame representing one viewport of a
block.

---

## Inputs

- **Figma frame URL** (fileKey and nodeId)
- **Viewport label** (mobile, tablet, or desktop)

---

## Extraction procedure

### Step 1 — Get design context

Use Figma MCP `get_design_context` with the provided fileKey and
nodeId. Also use `get_screenshot` to capture a visual reference.

### Step 2 — Identify text elements

Scan the design context for all text elements. For each, determine:

1. **Content**: the visible text string.
2. **Typography token**: look for `--s2a-typography-*` token
   references in the element's styling. See
   `references/token-mapping.md` for the full mapping table
   (title tokens → heading levels, body tokens → size classes,
   eyebrow token, corroborating tokens, and fallback heuristics).

3. **Position in layout**: vertical position within the frame
   determines ordering (top to bottom).

### Step 3 — Classify text elements

Based on tokens, classify each text element:

- **Eyebrow**: `--s2a-typography-font-size-eyebrow` token.
  Optional. Appears between icon and heading.
- **Heading**: `--s2a-typography-font-size-title-X` token.
  X determines heading level (h1-h4). Note if text has bold
  formatting.
- **Body**: `--s2a-typography-font-size-body-X` token.
  X determines size class.
- **Link / CTA**: text inside interactive elements, or text
  styled as buttons/underlined links. Record display text and
  CTA style:
  - **Primary** (filled/solid button background) → `<strong><a>`
  - **Secondary** (outline/ghost/transparent button) → `<em><a>`
  - **Plain** (text-only link, no button styling) → bare `<a>`

If a token is ambiguous or missing, use visual heuristics from
`references/token-mapping.md` (fallback section). Document any
elements that required fallback classification.

### Step 4 — Identify media elements

Scan for non-text visual elements:

- **Icons**: small graphic elements (typically < 48px), often
  SVG or small images. Usually near the top, above or beside
  the eyebrow/heading.
  **Detection**: in `get_design_context` output, look for a
  small container (`size-[24px]`, `size-[32px]`, etc.) whose
  children include multiple `<img>` elements or nested layers
  (background fill + symbol/mnemonic). Component names often
  follow patterns like `B_app_*`, `icon_*`, or contain
  `mnemonic`. The parent container's `data-node-id` is the
  icon node ID.
  **Do not** use individual child layer asset URLs. Instead,
  record the **parent icon node ID** so Phase 4 can export
  the composite SVG via `use_figma` + `exportAsync`.
- **Background**: the largest visual behind the content, or a
  solid/gradient fill on the frame or container.
  - Color value: extract the exact hex, rgb, or gradient CSS string.
  - Image: record the Figma asset URL and node ID.
- **Foreground**: image layered in front of the background as
  part of the media area (not inline with text). Typically a
  product shot or illustration. Record the asset URL and node ID.
- **Additional media**: other image elements beyond background
  and foreground (rare). Record each.

> **Do not download or base64-encode images.** Only capture
> Figma asset URLs and node IDs. Phase 4 handles all media
> transfers.

### Step 5 — Compile output

Return a structured content summary:

```
Viewport: <label>

Icon:
  present: true/false
  node_id: <parent icon node id> (for exportAsync SVG export)
  name: <icon component name, e.g. "B_app_AdobeFirefly">
  alt_text: <description>

Eyebrow:
  present: true/false
  text: "<text>"

Heading:
  text: "<text>"
  level: <1-4>
  has_bold: true/false

Body:
  text: "<text>"
  size: <lg|md|sm|xs>

Links:
  count: <N>
  items:
    - text: "<link text 1>", style: primary|secondary|plain
    - text: "<link text 2>", style: primary|secondary|plain

Background:
  type: color | image
  value: "<css color string>" (if color)
  asset_url: <figma asset URL> (if image)
  node_id: <figma node id> (if image)
  alt_text: <description> (if image)

Foreground:
  present: true/false
  asset_url: <figma asset URL> (if present)
  node_id: <figma node id> (if present)

Additional_media:
  items: []

Fallback_classifications:
  - "<element>: <reason for fallback>"
```

---

## Error handling

- If `get_design_context` does not return token information, fall
  back to visual heuristics. Document which elements required it.
- If a media element cannot be captured via `get_screenshot`,
  flag it for manual handling.
- If the frame is unusually complex, focus on top-level content
  elements visible to the end user.
