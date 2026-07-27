# Conditional da-marketo forms2.min.js loading (MWPW-194731)

**Date:** 2026-07-27
**Branch:** da-mkto-port
**File touched:** `libs/blocks/marketo/marketo.js` (only)

## Problem

Milo's shared Marketo block (`libs/blocks/marketo/marketo.js`) loads Marketo's
form-rendering script from the site's own libs base:

```js
const { base } = getConfig();
loadScript(`${base}/deps/forms2.min.js`);
```

`base` resolves to `miloLibs || codeRoot` — e.g. `https://main--milo--adobecom.aem.live/libs`
or `/libs` — and Milo hosts its own copy at `/libs/deps/forms2.min.js`.

We need Milo consumers to be able to load `forms2.min.js` from the **da-marketo**
EDS site instead (which hosts its own `/deps/forms2.min.js`), triggered by a query
param, page metadata, or a block class — while leaving default behavior for
everyone else **completely unchanged**.

## Binding constraints (from MWPW-194731 / task Q1–Q4)

- **Three triggers**, precedence `?marketolibs` > `marketo-libs` metadata > `da-marketo` block class.
- **Production resolution** (any site other than da-bacom): resolve directly to
  da-marketo's own production domain `main--da-marketo--adobecom.aem.live`.
  Do **not** assume a `/mkto`-style Akamai mapping exists (that is da-bacom-only).
  da-marketo has no custom prod domain — its `aem.live` URL *is* production.
- **da-bacom is out of scope** — do not modify its repo or its existing
  `getMarketoLibs()`/`scripts.js`. It remains the reference pattern only.
- **da-marketo needs no changes** — its existing `/deps/forms2.min.js` is loaded as-is.
- **No changes to Milo's `scripts.js` or `utils.js`** — everything lives inside
  `marketo.js`. Prefer adding a new code path over modifying existing ones.

## Root cause of the known "BASE property override" snag

Jason's Jira note ("Issues with BASE property override") is explained by the fact
that `getConfig().base` is the load root for **every** dep, block, and style in
the app. Any attempt to override `config.base` (via `setConfig`) so that
`${base}/deps/forms2.min.js` points at da-marketo simultaneously repoints *every
other* Milo asset at da-marketo → a cascade of 404s.

**Resolution:** never touch `config.base`. Compute a dedicated origin used *only*
for the forms2 URL; every other load keeps using `getConfig().base`.

## Design

### 1. New pure resolver `getMarketoLibsBase(el, location, getMeta)`

Exported from `marketo.js`. Returns a da-marketo **origin** string, or `null`
when there is no trigger (→ default behavior). Mirrors da-bacom's
`getMarketoLibs` branch→CDN logic, **minus** the `/mkto` path, returning the bare
origin (da-marketo serves `/deps/forms2.min.js` at root, not under `/libs`).

Signature: `getMarketoLibsBase(el, location = window.location, getMeta = getMetadata)`
— `location` and `getMeta` are injectable for unit testing.

Resolution table:

| trigger value                                   | resolved origin |
|-------------------------------------------------|-----------------|
| bare `?marketolibs` / `=true` / meta=`true` / `da-marketo` class | `https://main--da-marketo--adobecom.aem.live` |
| `=main`                                          | `https://main--da-marketo--adobecom.aem.live` |
| `=stage` / `=<branch>`                           | `https://<branch>--da-marketo--adobecom.aem.live` |
| `=<x>--da-marketo--<y>` (value contains `--`)    | `https://<x>--da-marketo--<y>.aem.live` |
| `=local`                                          | `http://localhost:6456` |
| invalid branch (fails `/^[a-zA-Z0-9_-]+$/`)      | `null` (LANA `severity: 'w'`, fall back to Milo default) |
| no trigger at all                                | `null` |

Precedence is enforced by resolution order: query param first, then metadata,
then class. A bare `?marketolibs` (empty string) is treated as `main` and, being
the highest-precedence source, wins over metadata/class. `true` (from param or
metadata) normalizes to `main`.

### 2. Call-site change in `loadMarketo` (the only edit to existing code)

```js
const { base } = getConfig();
const scriptBase = getMarketoLibsBase(el) ?? base;      // null when untriggered
return loadScript(`${scriptBase}/deps/forms2.min.js`)   // was `${base}/...`
```

When untriggered, `getMarketoLibsBase` returns `null`, `?? base` yields the
original `base`, and the resulting URL is byte-identical to today. This is why
normal (non-flagged) behavior is provably unaffected.

No other use of `base` in the file changes. `formData[BASE_URL]` (the Marketo
engage instance host used by `MktoForms2.loadForm`) and the `loadLink` dns-prefetch
are unrelated and untouched.

## Failure handling

- **Invalid branch name** → resolver returns `null`, logs LANA `severity: 'w'`,
  and the block falls back to Milo's default forms2. Never throws.
- **da-marketo forms2 404 at load time** → hits the *existing* `.catch` in
  `loadMarketo` → `LANA_MESSAGE.MARKETO_FORMS_JS` (`severity: 'e'`) + block hidden,
  exactly as today.

## Testing

- **Unit** (`test/blocks/marketo/marketo.test.js`), pure fn, no network — one case
  per resolution-table row: no-trigger→`null`; `?marketolibs=main`→main origin;
  bare param→main; `=true`→main; metadata trigger; `da-marketo` class→main;
  precedence param>meta>class; branch containing `--`; `=local`→localhost:6456;
  invalid branch→`null` + LANA warn.
- **Regression** — existing `loadMarketo` tests must keep passing unchanged
  (proves the untriggered path is a no-op).
- **Manual / QA** (acceptance criterion, not unit) — on a triggered page, verify
  the Network tab fetches da-marketo's `forms2.min.js` from the correct domain
  with no 404s; confirm da-bacom's existing `?marketolibs` flow still works
  independently.

## Scope guardrails

- No da-bacom repo changes (reference only). No da-marketo repo changes.
- No `scripts.js` / `utils.js` changes.
- New code path added; existing logic modified by exactly one substitution line.
- da-bacom's `?marketolibs` flow and this new Milo flow run in parallel.

## Acceptance criteria (MWPW-194731)

- [x] Milo consumers get marketolibs without any `scripts.js` changes.
- [ ] All da-marketo requests load the correct domain in the Network tab, no 404s. *(manual QA)*
- [x] Feature flag manageable via config/metadata (query param, metadata, class).
- [x] da-bacom's existing `?marketolibs` flow and the new Milo block-level flow run in parallel.
