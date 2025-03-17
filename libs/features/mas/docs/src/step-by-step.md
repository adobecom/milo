# Step By Step - Enable M@S

## 1. Import mas.js
```html
<script src="https://www.adobe.com/libs/features/mas/dist/mas.js" type="module"></script>
```

## 2. Add `<mas-commerce-service>` element
Preferrably, place it inside the <head> tag. 
(!) Mas Commerce Service should be attached to DOM *before* `<aem-fragment>` elements are created.
```html
<head>
  ...
  <mas-commerce-service></mas-commerce-service>
</head>  
```

## 3. Add `<merch-card>` elements.
```html
<merch-card><aem-fragment fragment="a1ca4a50-dd85-4cf9-94e2-a9e90ad4bb27"></aem-fragment></merch-card>
```

## 4. Import styles
Depending on the surface, import spectrum css / spectrum web components / consonant styles

## 5. Import polyfill, if required
```html
<script src="https://www.adobe.comlibs/deps/custom-elements.js"></script>
```
Example how to load polyfill only if required:
```js
export async function polyfills() {
  if (polyfills.promise) return polyfills.promise;
  let isSupported = false;
  document.createElement('div', {
    // eslint-disable-next-line getter-return
    get is() {
      isSupported = true;
    },
  });
  if (isSupported) {
    polyfills.promise = Promise.resolve();
  } else {
    const { base } = getConfig();
    polyfills.promise = await loadScript(`${base}/deps/custom-elements.js`);
  }
  return polyfills.promise;
}
```
