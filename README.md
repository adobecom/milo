# Milo
Milo is a shared set of features and services to power Helix-based websites on adobe.com. If you wish to create your own milo-based project, please use the [College project](https://github.com/adobecom/milo-college) as your foundation.

Demo again

[![codecov](https://codecov.io/gh/adobecom/milo/branch/main/graph/badge.svg?token=a7ZTCbitBt)](https://codecov.io/gh/adobecom/milo)

## Environments
[Preview](https://main--milo--adobecom.hlx.page) | [Live](https://milo.adobe.com)

## Developing
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `sudo npm install -g @adobe/helix-cli`
1. Run `hlx up` this repo's folder. (opens your browser at `http://localhost:3000`)
1. Open this repo's folder in your favorite editor and start coding.

### NPM (Recommended)
While milo does not require a build step to function, you will need to install npm packages to:

1. Lint
2. Test
3. Run libs

### Tool recommendations
You can use any text editor or IDE of your choice, but milo is highly optimized for VS Code. Milo provides recommended extensions (use the filters) and debugging tools.

### Forks
Forks will have a separate content bus and will 404. To use the main content bus run the following:
```bash
hlx up --pages-url=https://main--milo--adobecom.hlx.page
```

### Libs
If you want to see how your milo changes impact a consuming site you will need to work on a different port.
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
This will give you several options to debug tests. Note: coverage may not be accurate.
