# Load da-marketo blocks from Milo's marketo block (MWPW-194731)

**Date:** 2026-07-27
**Branch:** da-mkto-port
**Ticket:** MWPW-194731 — "[DA-Marketo][Milo] Load External Libs from Milo"
**File touched:** `libs/blocks/marketo/marketo.js` (only)

## Problem

Milo's shared Marketo block (`libs/blocks/marketo/marketo.js`) renders Marketo
forms with Milo's own block code and loads the vendor script from the site's own
libs base:

```js
const { base } = getConfig();
loadScript(`${base}/deps/forms2.min.js`);
```

Per MWPW-194731, Milo consumers should be able to **render the form using
da-marketo's own block implementation** (da-marketo is a full EDS site that hosts
its own `blocks/marketo/marketo.js`, `blocks/marketo/marketo-multi.js`,
`blocks/marketo/marketo.css`, and `deps/forms2.min.js`), triggered by a query
param, page metadata, or a block class — while leaving default behavior for
everyone else **completely unchanged**.

Today `?marketolibs` is a da-bacom-only feature (its `scripts/scripts.js`
resolves a da-marketo base and `import()`s a libs entry point). This work brings
an equivalent, opt-in capability into Milo's marketo block itself so **all** Milo
consumers get it, with **no `scripts.js` changes**.

## Binding constraints

- **Three triggers**, precedence `?marketolibs` > `marketo-libs` metadata >
  `da-marketo` block class.
- **Production resolution** (any site other than da-bacom): resolve directly to
  da-marketo's own production domain `main--da-marketo--adobecom.aem.live`. No
  `/mkto`-style Akamai mapping (that is da-bacom-only). da-marketo has no custom
  prod domain — its `aem.live` URL *is* production.
- **da-bacom out of scope** — do not modify its repo or its `getMarketoLibs()`.
  It remains the reference pattern only.
- **da-marketo needs no changes** (Q4) — its existing blocks and
  `deps/forms2.min.js` are loaded as-is.
- **No changes to Milo's `scripts.js` or `utils.js`** — everything lives inside
  `marketo.js`. Prefer a new code path over modifying existing ones.
- **Mechanism (confirmed):** *delegate* — Milo dynamically imports and runs
  da-marketo's `blocks/marketo/marketo.js`; it does **not** reimplement or merely
  swap a single script.
- **Target block (confirmed):** da-marketo's `blocks/marketo/marketo.js`.
- **forms2 origin (confirmed):** `forms2.min.js` may load from the **host's**
  Milo libs (all Milo consumers host it); it need not come from da-marketo.

## Root cause of the "BASE property override" snag (Jason, 2026-07-24)

da-marketo's block resolves its forms2 URL at runtime from the global config:

```js
// da-marketo blocks/marketo/marketo.js
const { base } = getConfig();
loadScript(`${base}/deps/forms2.min.js`);
```

`getConfig().base` (`miloLibs || codeRoot`) is the load-root for **every** dep,
block, and style on the host page. The previous attempt overrode `config.base`
so that forms2 would resolve to da-marketo — but that simultaneously repoints
*every other* asset on the host page at da-marketo → a 404 cascade.

**Resolution:** never touch `config.base`. Delegate the *block code* to da-marketo
and let the one shared vendor script (`forms2.min.js`, functionally identical on
both origins) load from the host, which always has it.

## Design

### 1. Trigger resolver — new pure fn `getMarketoLibsBase(el, location, getMeta)`

Exported from `marketo.js`. Returns a da-marketo **origin** string, or `null`
when there is no trigger. Injectable `location`/`getMeta` for unit testing.
Mirrors da-bacom's `getMarketoLibs` branch→CDN logic, minus the `/mkto` path,
returning the bare origin (da-marketo serves its blocks/deps at root).

Signature: `getMarketoLibsBase(el, location = window.location, getMeta = getMetadata)`

| trigger value                                   | resolved origin |
|-------------------------------------------------|-----------------|
| bare `?marketolibs` / `=true` / meta=`true` / `da-marketo` class | `https://main--da-marketo--adobecom.aem.live` |
| `=main`                                          | `https://main--da-marketo--adobecom.aem.live` |
| `=stage` / `=<branch>`                           | `https://<branch>--da-marketo--adobecom.aem.live` |
| `=<x>--da-marketo--<y>` (value contains `--`)    | `https://<x>--da-marketo--<y>.aem.live` |
| `=local`                                          | `http://localhost:6456` |
| invalid branch (fails `/^[a-zA-Z0-9_-]+$/`)      | `null` (LANA `severity: 'w'`, fall back to Milo default) |
| no trigger at all                                | `null` |

Precedence via resolution order: query param, then metadata, then class. A bare
`?marketolibs` (empty string) is treated as `main` and, being highest precedence,
wins over metadata/class. `true` (param or metadata) normalizes to `main`.

### 2. Delegation at the top of `init(el)` (the only edit to existing code)

```js
export default async function init(el) {
  const marketoBase = getMarketoLibsBase(el);
  if (marketoBase) {
    try {
      loadStyle(`${marketoBase}/blocks/marketo/marketo.css`);   // visual parity
      const { default: daInit } = await import(`${marketoBase}/blocks/marketo/marketo.js`);
      return daInit(el);                                          // hand off entirely
    } catch (e) {
      window.lana?.log(`da-marketo block load failed: ${e.message}`, { tags: 'marketo', severity: 'w' });
      // fall through to Milo's own rendering
    }
  }
  // ---- existing Milo init logic, byte-for-byte unchanged ----
}
```

- `loadStyle` is added to the existing `../../utils/utils.js` import in
  `marketo.js` (no utils.js change).
- When untriggered, `getMarketoLibsBase` returns `null`, the whole block is
  skipped, and Milo's `init` runs exactly as today. This is why normal
  (non-flagged) behavior is provably unaffected.

### What loads from where

When Milo hands off to da-marketo's `blocks/marketo/marketo.js`:

| asset | origin | how |
|---|---|---|
| block module `marketo.js` | da-marketo | dynamic-import URL |
| `./marketo-multi.js` | da-marketo | relative import from the module's da-marketo URL |
| `marketo.css` | da-marketo | `loadStyle(`${marketoBase}/blocks/marketo/marketo.css`)` |
| `forms2.min.js` | **host** Milo libs | da-marketo block reads host `getConfig().base`; host always hosts it → no 404 |

`config.base` is never mutated → the snag is avoided.

## Failure handling

- **Invalid branch name** → resolver returns `null`, LANA `severity: 'w'`, Milo's
  default block renders. Never throws.
- **da-marketo block import fails / 404** → caught in `init`, LANA `severity: 'w'`,
  falls through to Milo's own rendering — the form still works.

## Testing

- **Unit** (`test/blocks/marketo/marketo.test.js`), pure fn, no network — one case
  per resolution-table row: no-trigger→`null`; `?marketolibs=main`→main origin;
  bare param→main; `=true`→main; metadata trigger; `da-marketo` class→main;
  precedence param>meta>class; branch containing `--`; `=local`→localhost:6456;
  invalid branch→`null` + LANA warn.
- **Delegation branch** — resolve `marketoBase` to a locally served mock module
  (default export = sinon spy) and assert `init(el)` imports it, calls its
  default with `el`, loads the mock CSS, and returns without running Milo's own
  decoration; and that an import failure falls through to Milo's path.
- **Regression** — existing `init` / `loadMarketo` tests keep passing unchanged
  (proves the untriggered path is a no-op).
- **Manual / QA** (acceptance criterion) — on a triggered page, verify the Network
  tab: da-marketo `marketo.js`, `marketo-multi.js`, `marketo.css` load from the
  da-marketo domain with no 404s; `forms2.min.js` loads from the host with no 404;
  da-bacom's existing `?marketolibs` flow still works independently.

## Scope guardrails

- No da-bacom repo changes (reference only). No da-marketo repo changes.
- No `scripts.js` / `utils.js` changes.
- New code path added; existing `init` logic modified only by prepending the
  guarded delegation block. `loadMarketo` and the rest are untouched.
- da-bacom's `?marketolibs` flow and the new Milo flow run in parallel.

## Acceptance criteria (MWPW-194731)

- [x] Milo consumers get marketolibs without any `scripts.js` changes.
- [ ] All da-marketo requests load the correct domain in the Network tab, no 404s. *(manual QA)*
- [x] Feature flag manageable via config/metadata (query param, metadata, class).
- [x] da-bacom's `?marketolibs` flow and the new Milo block-level flow run in parallel.
