# Milo
Milo is a shared set of features and services to power Helix-based websites on adobe.com.

[![codecov](https://codecov.io/gh/adobecom/milo/branch/main/graph/badge.svg?token=a7ZTCbitBt)](https://codecov.io/gh/adobecom/milo)

## Environments
[Preview](https://main--milo--adobecom.hlx.page) | [Live](https://milo.adobe.com)

## Developing
1. Install the [Helix CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/helix-cli`
1. Run `hlx up` this repo's folder. (opens your browser at `http://localhost:3000`)
1. Open this repo's folder in your favorite editor and start coding.

### Forks
Forks will have a separate content bus and will 404. To use the main content bus run the following:
```bash
hlx up --pages-url=https://main--milo--adobecom.hlx.page
```

## Testing
```sh
npm i
npm test
```
