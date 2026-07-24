# MEP IMS Probe — throwaway harness

Settles the one unknown that caps reuse of Milo's existing IMS client for a
MEP-only employee login: **does the `milo` client return an `@adobe.com`
signal under the default scope, and does it resolve silently or need an
interactive redirect?**

Delete this directory once the questions are answered.

## Run it

**Locally** (silent-SSO path only — interactive redirect from localhost is
likely not allowlisted):

```sh
npm run libs   # serves the repo at http://localhost:6456
```
Open: `http://localhost:6456/tools/ims-probe/ims-probe.html`

**On an allowlisted origin** (tests the interactive redirect too) — push this
branch and open:
`https://mep-next-v1-ims-auth--milo--adobecom.aem.page/tools/ims-probe/ims-probe.html`

## What to look for

The verdict banner reports one of:
- **EMPLOYEE SIGNAL PRESENT** — `@adobe.com` email came back under the default
  scope → reuse works, no IMS ticket. Proceed to build the gate.
- **NO EMPLOYEE SIGNAL** — profile has no email under this scope → a scope
  change on the client is needed (IMS ticket).
- **Not signed in / no profile** — silent SSO didn't resolve; use *Sign in
  (interactive)*. If that fails on localhost but works on the aem.page origin,
  the redirect_uri allowlist is the constraint (expected).

## Overrides (URL params)

- `?client_id=` — which registered client to test (default `milo`)
- `?env=stg1|prod` — IMS environment (default `stg1`)
- `?scope=` — probe scope variations without editing (default `AdobeID,openid,gnav`)

Signed in as a non-employee should show a **fail** verdict — that's the gate
correctly rejecting a consumer account.
