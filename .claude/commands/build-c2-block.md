---
description: Author content from Figma to DA, then build the matching C2 block against the published page.
---

# build-c2-block

Orchestrates the `build-content-from-figma` and `build-block-from-figma` skills end-to-end: gather inputs once, author the content document, capture the resulting `.aem.live` URL, then build the C2 block against that page.

---

## Phase A — Gather all inputs upfront

Ask the user for the following in a single message. Collect every value before invoking either skill.

| Input | Required | Notes |
|-------|----------|-------|
| Figma URL — Mobile (≤767 px) | At least one of the three | Frame link |
| Figma URL — Tablet (768–1279 px) | | Frame link |
| Figma URL — Desktop (≥1280 px) | | Frame link |
| DA organization | Yes | e.g. `adobecom` |
| DA repository | Yes | e.g. `da-playground` |
| DA file path | Yes | e.g. `drafts/<ldap>/my-block` |
| Block name override | No | Skip if you want the content skill to infer from Figma metadata |
| Base branch (block skill) | No | Default `stage` |

Validation:
- At least one Figma URL is mandatory.
- Org, repo, and DA path are all mandatory.
- Do not proceed until every required input is provided.

Show the collected inputs back to the user and ask for one confirmation before kicking off the chain.

---

## Phase B — Run the content skill

Invoke the `build-content-from-figma` skill via the Skill tool. Hand it the Figma URLs (with their viewport labels), the DA org/repo/path, and the block name override if the user provided one.

The content skill has its own internal prompts (block name confirmation, diff review, upload confirmation, preview/publish confirmation). Let the user answer those directly — do not pre-answer or skip them.

When the content skill reaches Phase 7 (Preview & Publish), the user **must** opt in to publishing for the chain to continue. If they decline, stop here and tell the user the block skill needs an `.aem.live` URL to run.

---

## Phase C — Capture the live URL

Once the content skill finishes, parse the live URL from its Phase 7d / Phase 9 summary. It has the shape:

```
https://main--<repo>--<org>.aem.live/<da-path>/<page-name>
```

If the live URL is not present in the skill's output (e.g. the user declined to publish, or publishing failed), stop and report the situation. Do not invent a URL or guess the path.

Show the parsed live URL to the user and confirm it before proceeding.

---

## Phase D — Run the block skill

Invoke the `build-block-from-figma` skill via the Skill tool. Pass:

- **Preview URL**: the `.aem.live` URL from Phase C.
- **Figma URLs**: the same per-viewport URLs collected in Phase A.
- **Base branch**: the user's value, or `stage` if they did not provide one.

The block skill will detect remote-branch-mode from the `.aem.live` URL and handle feature-branch creation, `?milolibs=` testing, visual comparison, accessibility, and performance audits on its own.

---

## Phase E — Final summary

After the block skill finishes, output a combined summary:

1. **DA document**: edit URL + live URL.
2. **Block component**: name, file paths, and feature branch.
3. **Audit results**: accessibility and performance highlights from the block skill.
4. **Suggested next steps**: open a PR from the feature branch, update placeholder `https://www.adobe.com/` links in the DA document, etc.

---

## Failure handling

- Content skill fails before publish: stop, report the failure, do not run the block skill.
- User declines preview/publish in the content skill: stop with a clear message that the block skill requires an `.aem.live` URL.
- Block skill fails the foundation gate (missing `foundation: c2` metadata): the block skill itself handles the recovery path, follow its instructions.