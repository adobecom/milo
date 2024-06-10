# Spectrum CSS Tokens Integration into Milo CSS

This script automatically updates the Milo S2 CSS custom properties with the latest values from Spectrum CSS Tokens, ensuring your styles stay up-to-date effortlessly.

## How it Works

The script extracts Spectrum CSS Tokens from an npm package and overrides corresponding custom properties in the Milo CSS file. It formats and transforms RGB and opacity properties to maintain performance and compatibility.

## Usage

### 1. Update Spectrum CSS Tokens Dependency as Needed

Before running the script, ensure that you have the desired version of `@spectrum-css/tokens` dependency installed. As new versions of Spectrum CSS Tokens are released, you can update the dependency version in the `package.json` file to access the latest tokens. To do this:

- Open the `package.json` file.
- Locate the `"@spectrum-css/tokens"` dependency.
- Update the version number to the latest or desired version.
- run an `npm install` to install it.

### 2. Run the build script

Run the following script to update the Milo S2 CSS file with latest Spectrum 2 CSS Tokens.

```
npm run build:spectrum2-styles
```
