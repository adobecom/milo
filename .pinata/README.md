# `.pinata/`

Setup files that let Pinata (the Fiesta harness) work on `adobecom/milo`.
Pinata reads them at the pinned commit. Code tickets use its default pipeline
and never edit this folder.

## Files

| File | Purpose |
|------|---------|
| `manifest.yaml` | Identity (`org`, `product`, `repo`), `owners_from: CODEOWNERS`, shared mental models |
| `gates.yaml` | Verification gates. Replaces Pinata's default set |
| `floor/gates.yaml` | Copy of the acom org floor, the minimum every acom repo meets |
| `preview.yaml` | Branch preview URLs, capture pages, logins for gated hosts |
| `pr.yaml` | Branch naming and PR body template |
| `scripts/check-contract.mjs` | Checks the files parse and `gates.yaml` does not weaken the floor |
| `scripts/check-contract.test.mjs` | Tests for that check, plus repo and owner names agreeing across files |
| `scripts/check-block-structure.mjs` | Used by the `block-structure` gate |

## Gates

`npm ci` runs once, then:

| Gate | Runs | Blocks |
|------|------|--------|
| `lockfiles` | `package-lock.json` is untouched, otherwise a human reviews | yes |
| `lint` | ESLint on changed files, same bar as Milo's CI | yes |
| `compat-lint` | Browser-compat ESLint config | yes |
| `stylelint` | Stylelint | yes |
| `unit-tests` | `npm run test:file` on affected files under `test/` | yes |
| `block-structure` | Each changed `libs/blocks/<name>/` has `<name>.js` and `<name>.css` | yes |
| `visual` | Screenshots and a clip | no (advisory) |
| `adversary` | Independent review | yes |

Codecov's patch rule stays in Milo's CI. Pinata does not repeat it.

## Previews

| Option | URL or command |
|--------|----------------|
| `pin_pattern` | `<branch>--milo--adobecom.aem.page` |
| `overlay_pattern` | Content-bus page loaded with the branch's code via `?milolibs=` |
| `local` (preferred) | `aem up` on the checked-out branch |

## Secrets

No secrets are in this repo. `preview.yaml` names the env vars that hold them.

| Env var | Holds | Note |
|---------|-------|------|
| `IMS_PASS` | Password for `pinata+masautomation@adobetest.com` | Account needs preview access to `da-dc` and `da-bacom` |
| `AEM_SITE_TOKEN_DA_DC` | Site token for `da-dc` | Set by hand, the account cannot create tokens (MWPW-215332) |
| `AEM_SITE_TOKEN_DA_BACOM` | Site token for `da-bacom` | Same |

Without a site token, the `visual` gate cannot capture that host.

## Activation outside this PR

Merging `.pinata/` does not route requests to `adobecom/milo`. Still to do:

1. Add or update the Pinata catalog entry for `adobecom/milo`.
2. Give the Pinata GitHub App access to `adobecom/milo` (checkout, branches, PRs).
3. Confirm branch previews resolve at `<branch>--milo--adobecom.aem.page`.
4. Set the secrets above in the engine environment.
5. Run one ticket end to end before switching the default repo.

`preview.yaml`'s `local` preview runs `aem up`, so the engine needs the AEM CLI on its `PATH`. Milo does not install it.

## Running the checks

CI runs both on PRs that touch `.pinata/`. Locally:

```sh
npm ci
node .pinata/scripts/check-contract.mjs --skip-registry
node --test .pinata/scripts/check-contract.test.mjs
```

Drop `--skip-registry` to also check mental-model ids against
`Adobe-acom/pinata-tool-shelf`. It warns, and does not fail, if the clone fails.
