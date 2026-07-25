# Sidekick /status probe — throwaway harness

Settles the one unknown that gates the `/status` auth-detection refactor of
`sidekick-auth.js`: **does a page-initiated `GET admin.hlx.page/status/...`
receive the token the Sidekick injects (via declarativeNetRequest) and return a
readable `profile`?**

If yes, one re-queryable GET replaces both the fragile shadow-DOM probe and the
flaky one-shot `status-fetched` event subscription. Delete this dir after use.

## Run it

Must run with the **AEM Sidekick installed and logged in**, on a milo origin the
Sidekick recognizes (so its DNR rules are active). Push this branch and open:

```
https://mep-next-v1-sidekick-status-poc--milo--adobecom.aem.page/tools/sk-status-probe/sk-status-probe.html
```

Click **Run /status GET**.

(Localhost won't work — no Sidekick context and the host can't be parsed into
owner/repo/ref.)

## Reading the verdict

- **AUTHED (green)** — `profile.email` came back → a page GET gets the token →
  single-GET refactor is viable. Drop the shadow-DOM probe and the event sub.
- **401/403 (red)** — no profile. Sidekick not logged in, not yet ready for the
  project, or the token isn't injected on a *page* fetch (would mean the GET
  alone isn't sufficient and we'd still need the events).
- **Fetch threw / CORS (red)** — the page can't read the cross-origin response
  even if authed → GET-from-page not viable as-is.

## Overrides

- `?owner=` `?repo=` `?ref=` — default parsed from the `{ref}--{repo}--{owner}` host label
- `?path=/some/page` — status path (default `/`)
- `?creds=include` — send credentials (default `same-origin`; token is header-injected, so cookies shouldn't be needed — use this only to compare)
