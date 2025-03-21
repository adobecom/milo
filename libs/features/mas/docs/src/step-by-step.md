# Step By Step - Enable M@S

## 1. Import polyfills, if required
```html
<script src="https://www.adobe.comlibs/deps/custom-elements.js"></script>
```
Example how to load polyfill only if required:
```js
let isSupported = false;
document.createElement('div', {
  get is() {
    isSupported = true;
  },
});
if (!isSupported) {
  await import('https://www.adobe.com/libs/deps/custom-elements.js');
}
```

## 2. Import mas.js
```html
<script src="https://www.adobe.com/libs/features/mas/dist/mas.js" type="module"></script>
```

## 3. Add `<mas-commerce-service>` element
Preferrably, place it inside the <head> tag. 
(!) Mas Commerce Service should be attached to DOM *before* `<aem-fragment>` elements are created.
```html
<head>
  ...
  <mas-commerce-service></mas-commerce-service>
</head>  
```

## 4. Add `<merch-card>` elements.
```html
<merch-card><aem-fragment fragment="a1ca4a50-dd85-4cf9-94e2-a9e90ad4bb27"></aem-fragment></merch-card>
```

## 5. Import styles
Depending on the surface, import spectrum css / spectrum web components / consonant styles

 
