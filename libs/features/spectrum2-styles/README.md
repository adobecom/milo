# Spectrum CSS Tokens Integration into Milo CSS

This script automatically updates the Milo S2 CSS custom properties with the latest values from Spectrum CSS Tokens, ensuring your styles stay up-to-date effortlessly.

## How it Works

The script extracts Spectrum CSS Tokens from the [Spectrum CSS Tokens npm package](https://www.npmjs.com/package/@spectrum-css/tokens) and overrides corresponding custom properties in the main Milo CSS file that are prefixed with `--s2`. It also formats, combines and transforms RGB and opacity properties to maintain performance.

## Tokens Specifications in Milo

Only Spectrum 2 tokens that are prefixed with --s2 will be updated by this script. Tokens prefixed with --sn are Spectrum 2 Narrative tokens that only exist in Milo and other custom properties will not be updated by the script.
Example:
 - `--s2-gray-700 `: Spectrum 2 token that will be updated automatically by script
 - `--sn-drop-shadow-x `: Spectrum Narrative token that will not be updated by script
 - `--color-white` (and all other properties): Original Milo custom properties that will not be updated by script.

## Usage

### 1. Update Spectrum CSS Tokens Dependency as Needed

Before running the script, ensure that you have the desired version of `@spectrum-css/tokens` dependency installed. As new versions of Spectrum CSS Tokens are released, you can update the dependency version in the `package.json` file to access the latest tokens. To do this:

- Open the `package.json` file.
- Locate the `"@spectrum-css/tokens"` dependency.
- Update the version number to the latest or desired version.
- run an `npm install` to install it.

### 2. Run the build script

Run the following script to update the main Milo CSS file with latest Spectrum 2 CSS Token values.

```
npm run build:spectrum2-styles
```

## Resources

* [Milo Spectrum 2 Tokens List](https://docs.google.com/spreadsheets/d/18SdT8J2xkP4gVqWLJFXE2koPwRCHMNrUJ5NNsRmfH9k/edit?pli=1&gid=969898798#gid=969898798)
* [Spectrum CSS Tokens Library](https://www.npmjs.com/package/@spectrum-css/tokens)
* [Spectrum Tokens Codebase](https://github.com/adobe/spectrum-css)



## Notes

`08-29-2024`: This script currently consumes Spectrum 2 tokens from a beta release of Spectrum CSS (`v14.0.0-next.7`) as we await the official releases. Once official versions are available, this should be updated accordingly. A few `--s2` properties missing from this beta release have been hard-coded in the stylesheet with the correct values and are marked with `*s2 missing*`.

