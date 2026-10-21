# Milo
Milo is a shared set of features and services to power Franklin-based websites on adobe.com. If you wish to create your own milo-based project, please use the [College project](https://github.com/adobecom/milo-college) as your foundation.

[![codecov](https://codecov.io/gh/adobecom/milo/branch/main/graph/badge.svg?token=a7ZTCbitBt)](https://codecov.io/gh/adobecom/milo)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/adobecom/milo)

## Environments
[Preview](https://main--milo--adobecom.aem.page) | [Live](https://milo.adobe.com)

## Getting started

### TL;DR
1. Clone this repo to your computer.
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `sudo npm install -g @adobe/aem-cli`
1. In a terminal, run `aem up` this repo's folder.
1. Start coding.

### Detailed
1. Fork this repo.
1. Install the [AEM Code Sync](https://github.com/apps/aem-code-sync) on your forked repo. Make sure that a `main` branch exists in your forked repository.  
1. Clone your forked repo down to your computer.
1. Install the [AEM CLI](https://github.com/adobe/helix-cli) using your terminal: `sudo npm install -g @adobe/aem-cli`
1. In a terminal, run `aem up` your repo's folder on your computer. It will open a browser.
1. Open your repo's folder in your favorite code editor and start coding.

### Even more detailed
See the wiki for [more detailed instructions](https://github.com/adobecom/milo/wiki/Getting-started) on how to get started writing features for Milo.

## Tooling

### NPM (Recommended)
While milo *does not* require NPM to function, you will need to install npm packages (`npm install`) to:

1. Lint
2. Test
3. Run libs

### Recommendations
You can use any text editor or IDE of your choice, but milo is highly optimized for VS Code. Milo provides recommended extensions (use the filters) and debugging tools.

## Libs
If you want to see how your local milo changes impact a consuming site you will need to work on a different port.

```
npm run libs
```
Milo will run at:
```
http://localhost:6456
```
You can then test any of the following:
```
http://localhost:3000/?milolibs=local (local code, stage content)

https://main--project--owner.aem.page/?milolibs=local (prod code, stage content)

https://main--project--owner.aem.live/?milolibs=local (prod code, prod content)

https://feat-branch--project--owner.aem.page/?milolibs=local (feature code, stage content)
```

## Testing
### Jarvis persistent-panel spike

With the local Milo server and Leo's client/UI dev servers running, use:

```
https://www.stage.adobe.com/creativecloud.html?milolibs=local&jarvis-panel=local
```

This opt-in requires `acom-assistant: on` plus the existing Jarvis surface ID/version
metadata or site configuration. `jarvis-panel=local` uses Leo's HTTPS client on port
4443 and UI on port 3443, with deployed integration configuration and backend services.
No local backend or messaging-init proxy is needed. Both jarvis-client and jarvis-ui
need the embedded-mode changes. In `jarvis-ui`, run `npm start` with
`LEO_MSG_ENV=integration`, `LEO_MSG_SERVER_URL=https://assistant-integration.adobe.io`,
and `LEO_MSG_WS_URL=wss://assistant-integration.adobe.io`.
Start the client with `LEO_MSG_INIT_CLIENT_VERSION=2026.10.38 npm run watch`
to match the existing integration init version pin.
`jarvis-panel=on` uses the environment's hosted bundle instead, which must
also support `mountSelector`. Unsupported bundles show an error, not a separate window.
Without the parameter, the existing web-client panel remains unchanged.
Restart Leo's client dev server after the webpack entrypoint change, and allow
Chrome's local-network access prompt for the stage page.
This spike covers BC prompts and panel lifecycle; live-agent handoff and per-link
footer surface overrides are not wired into the embedded mode.

For local conversation testing, launch the surface-override browser harness:

```sh
node nala/utils/jarvis-panel-preview.js
```

It opens Chrome with the local-panel URL above. It discovers the deployed UI surface
from integration's unmodified messaging-init response, then replaces only local
`events[*].query.conversation.surfaces` values on outgoing integration conversation
requests. Message, authentication, XDM, headers, and all other payload fields are
unchanged. This avoids integration's `Concierge not found` response for localhost.
The override exists only in this browser session; no shipped code or backend config
is changed, and credentials/payloads are not logged or saved. Close Chrome or press
Ctrl+C to stop. An optional stage URL can be supplied as the only positional argument.
Use `--smoke` for a headless HTTP-200 conversation check with a sample Photoshop prompt.

### Unit Testing
```sh
npm run test
```
or:
```sh
npm run test:watch
```
### Coverage
`npm run test:watch` can give misleading coverage reports. Use `npm run test` for accurate coverage reporting.

### Nala E2E UI Testing
-----

#### 1. Running Nala Tests
Make sure you ran `npm install` in the project root.
You might need also to run `npx playwright install`.
Nala tests are run using the `npm run nala <env> [options]` command:

```sh
npm run nala <env> [options]
```
```sh
# env: [local | libs | branch | stage | etc ] default: local

# options:
  - browser=<chrome|firefox|webkit>    # Browser to use (default: chrome)
  - device=<desktop|mobile>            # Device (default: desktop)
  - test=<.test.js>                    # Specific test file to run (runs all tests in the file)
  - -g, --g=<@tag>                     # Tag to filter tests by annotations ex: @test1 @accordion @marquee
  - mode=<headless|ui|debug|headed>    # Mode (default: headless)
  - config=<config-file>               # Configuration file (default: Playwright default)
  - project=<project-name>             # Project configuration (default: milo-live-chromium)
  - milolibs=<local|prod|feature|any|> # Milolibs?=<env> 
```

Examples:
```sh
npm run nala local test=masccd.test.js                # Run tests from masccd.test.js file on your local changes. Don't forget `aem up` before running.
npm run nala MWPW-162385 owner='npeltier' @mas-ccd    # Run tests tagged as 'mas-ccd' in 'npeltier' fork on MWPW-162385 branch
```

#### 2. Nala Help Command:
To view examples of how to use Nala commands with various options, you can run
```sh
npm run nala help
```

#### ⚠️ Important Note
- **Debug and UI Mode Caution**: When using `debug` or `ui` mode, it is recommended to run only a single test using annotations (e.g., `@test1`). Running multiple tests in these modes (e.g., `npm run nala local mode=debug` or `mode=ui`) will launch a separate browser or debugger window for each test, which can quickly become resource-intensive and challenging to manage.

- **Tip**: To effectively watch or debug, focus on one test at a time to avoid opening excessive browser instances or debugger windows.

#### 3. Nala Documentation
For detailed guides and documentation on Nala, please visit the [Nala GitHub Wiki](https://github.com/adobecom/milo/wiki/Nala#nala-introduction).
