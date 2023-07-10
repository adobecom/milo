# Milo Commerce

A future that retrieves and displays product prices and checkout URLs on Milo pages.

Price offers are provided by [Web Commerce Service](https://developers.corp.adobe.com/wcs/docs/api/openapi/wcs/latest.yaml).
To communicate with this service, Milo Commerce uses `@pandora/data-source-wcs` npm package hosted on corporate Artifactory.
Checkout URLs are constructed with another `@pandora` npm package.

## Build artifacts

The need to use corporate npm packages results in need for build step.
It emits several files to Milo deps folder:
- `libs/deps/commerce.js` - ESM bundle to be used by consumers
- `libs/deps/commerce.d.ts` - types and docs, used by VS code
- `libs/deps/literals/price/{lang}.json` - price literals obtained from Odin endpoint

## Development

1. Obtain corporate artifactory access token and make it accessible to npm.
  - you may want to check `.npmrc` file for list of required npm scopes
2. Install npm dependencies
  - `cd libs/features/commerce`
  - `npm i`
3. Run Adobe Helix Cli and open Commerce test page
  - `hlx up`
  - `http://localhost:3000/drafts/ilyas/merch?martech=off`
4. (Optional) Link Commerce git hooks to auto-build your changes before every commit
  - `mv -f ../../../.git/hooks/pre-commit ../../../.git/hooks/pre-commit.old`
  - `ln -fisv "$(cd scripts; pwd -P)/pre-commit" ../../../.git/hooks/pre-commit`
5. Run feature tests
  - `npm run test`
  - `test:watch`, `test:file` and `test:file:watch` are also supported
6. Build bundle and its types to `dist/deps/commerce.*`
  - `npm run build:bundle`
  - `npm run build:types`
7. Test Commerce feature bundle from Milo consumers
  - `cd ../../..` - back to Milo repository root
  - `npm run test:file:watch -- test/blocks/merch/merch.test.js`
  - `npm run test:file:watch -- test/blocks/ost/ost.test.js`

## Useful links
- [Web Commerce Service](https://developers.corp.adobe.com/wcs/docs/api/openapi/wcs/latest.yaml)
- [PandoraUI](https://git.corp.adobe.com/PandoraUI/odm-core/tree/master/packages/data-source-wcs)
- [UCv2 link creation guide](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=BPS&title=UCv2+Link+Creation+Guide)
- [UCv3 link creation guide](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide)
