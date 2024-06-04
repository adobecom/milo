# MAS Integration Guide

`mas` feature is an experiment for enabling essential merch features such as pricing and merch cards on commerce consumers such as CCH, CCD.

The `merch-card` web component includes various slots for placing content such as title, price, CTA (Call to Action), etc.<br>

The footer checkout links are rendered using `sp-button` from Spectrum Web Components.<br>
If the custom elements `sp-button` and `sp-theme` are not already defined, they will be automatically imported from Milo by `mas.js`.


## 1. declare wcs locale ##
a meta element must be added to document head to define the wcs locale in the format as expected by AOS.

The format is: `language_COUNTRY` in short codes.
e.g:

```html
  <meta name="wcs-locale" content="fr_CA">
```

## 2. Import mas.js ##

```javascript
  <script src="mas.js" type="module"></script>
```

## 3. insert merch card ##
merch-cards are designed to be rendered inside a custom responsive grid. Thus they support wide and super-wide sizes automatically.
They can also be rendered without the responsive grid, but in this case, its dimensions must be set by the consumers.

```html
<!-- a single merch card without responsive grid -->
<merch-card variant="catalog">
  <merch-datasource source="odin" path="/content/dam/sandbox/mas/creative-cloud" mep></merch-datasource>
</merch-card>

<!-- single merch card grid -->
<div class="one-merch-card catalog">
  <merch-card variant="catalog">
    <merch-datasource source="odin" path="/content/dam/sandbox/mas/creative-cloud"></merch-datasource>
  </merch-card>
</div>

<!-- four merch cards grid -->
<div class="four-merch-cards catalog">
  <merch-card variant="catalog">
    <merch-datasource source="odin" path="/content/dam/sandbox/mas/creative-cloud"></merch-datasource>
  </merch-card>
  ...
</div>

```

**variant**: `merch-card` variant, defines the card layout.
**merch-datasource**: a web component that retrieves the merch-card content, from Odin in these examples.
**source**: Only `odin` is supported.
**path**: the path of the fragment that provides the card data.
**mep**: whether to enable the promotion management used on adobe.com.  If enabled, before fetching the fragment from Odin, it will check in the MEP manifest if there is a promo override set for that path, and if yes, retrieve override one instead of the default one.
