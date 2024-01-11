# Spectrum Web Components

This repository provides individual Spectrum Web Components for consumption in SPA like pages.<br>
This feature is mainly designed for consumption by the different merch blocks.

Please know that SWC is heavy, impacts page performance and is not suitable for cases where a Consonant component is already available in Milo, e.g: button.

To load SWC components, do as follows:

```
await Promise.all([
  import(`${miloLibs}/features/spectrum-web-components/dist/theme.js`),
  import(`${miloLibs}/features/spectrum-web-components/dist/button.js`),
  import(`${miloLibs}/features/spectrum-web-components/dist/search.js`),
]);
```
