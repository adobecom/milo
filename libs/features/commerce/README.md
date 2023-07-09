# Milo Commerce

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

