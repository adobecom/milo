# Spectrum Web Components

This repository provides individual Spectrum Web Components for consumption in SPA like pages.<br>
This feature is mainly designed for consumption by the different merch blocks.

Please know that SWC is heavy, impacts page performance and is not suitable for cases where a Consonant component is already available in Milo, e.g: button.

To load SWC components, do as follows:

```
const { base } = getConfig();
await Promise.all([
  import(`${base}/features/spectrum-web-components/dist/theme.js`),
  import(`${base}/features/spectrum-web-components/dist/button.js`),
  import(`${base}/features/spectrum-web-components/dist/search.js`),
]);
```
On the page embedd your SWCs in `sp-theme` component and append to the DOM

```
const pCircle = createTag('sp-progress-circle', { label: 'progress circle', indeterminate: true, size: 'l' });
      const theme = createTag('sp-theme', { theme: 'spectrum', color: 'light', scale: 'medium', dir: 'ltr' });
      theme.append(pCircle);
      content.append(theme);
```

# Troubleshooting

## Error [ERR_MODULE_NOT_FOUND]
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'esbuild' imported from /Users/lukianet/Develop/Projects/milo/libs/features/spectrum-web-components/build.mjs
```
To fix - install esbuild.
```
npm install --save-exact --save-dev esbuild
```
