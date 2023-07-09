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
4. Link git hooks for Commerce feature to auto-build your changes before every commit
  - `mv -f ../../../.git/hooks/pre-commit ../../../.git/hooks/pre-commit.old`
  - `ln -fisv "$(cd scripts; pwd -P)/pre-commit" ../../../.git/hooks/pre-commit`
