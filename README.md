# Milo
Milo is a shared set of features and services to power Franklin-based websites on adobe.com. If you wish to create your own milo-based project, please use the [College project](https://github.com/adobecom/milo-college) as your foundation.

[![codecov](https://codecov.io/gh/adobecom/milo/branch/main/graph/badge.svg?token=a7ZTCbitBt)](https://codecov.io/gh/adobecom/milo)

## Environments
[Preview](https://main--milo--adobecom.hlx.page) | [Live](https://milo.adobe.com)

## Getting started

### TL;DR
1. Clone this repo to your computer.
1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `sudo npm install -g @adobe/aem-cli`
1. In a terminal, run `aem up` this repo's folder.
1. Start coding.

### Detailed
1. Fork this repo.
1. Install the [AEM Code Sync](https://github.com/apps/aem-code-sync) on your forked repo.
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

https://main--project--owner.hlx.page/?milolibs=local (prod code, stage content)

https://main--project--owner.hlx.live/?milolibs=local (prod code, prod content)

https://feat-branch--project--owner.hlx.page/?milolibs=local (feature code, stage content)
```

## Testing
```sh
npm run test
```
or:
```sh
npm run test:watch
```
### Coverage
`npm run test:watch` can give misleading coverage reports. Use `npm run test` for accurate coverage reporting.

