# merch-card custom element

## Introduction

This custom element implements all the merch-card variants provided in acom and ccd figma designs.

A `merch-card` can be rendered using either static html markup or `aem-fragment` custom element to retrieve a card from Odin/AEM.

Designs:

**ACOM**: https://www.figma.com/design/tiEUQLJ1hVlosqwzAATVXZ/Cards-(Merch)?node-id=1086-17994&t=LeMR0vbaBoEKaKln-1

**CCD**: https://www.figma.com/proto/7tUtNgFelfMjgPoJ5QcE1k/Merch%40Scale-Frameworks?node-id=2077-63597&t=cWfdzWlga79eyjyI-1

## examples

### Odin/AEM Fragments

```html
<merch-card>
    <aem-fragment title="CCD Slice Creative Cloud Photography" fragment="830f76be-0e83-4faf-9051-3dbb1a1dff04"></aem-fragment>
</merch-card>

<script type="module">
  const log = document.getElementById('log');
  const logger = (...messages) => log.innerHTML = `${log.innerHTML}<br>${messages.join(' ')}`;

  const fragment1 = document.getElementById('fragment1');
  fragment1.addEventListener('load', (e) => {
    logger('aem-fragment is loaded: ', JSON.stringify(e.target.data, null, '\t'));
  });

  const card1 = document.getElementById('card1');
   card1.addEventListener('mas:ready', (e) => {
    logger('merch-card is ready: ', e.target.variant);
  });
</script>

```

#### Demo

<merch-card id="card1">
        <aem-fragment id="fragment1" title="CCD Slice Creative Cloud Photography" fragment="830f76be-0e83-4faf-9051-3dbb1a1dff04"></aem-fragment>
</merch-card>
<script type="module">
  const log = document.getElementById('log');
  const logger = (...messages) => log.innerHTML = `${messages.join(' ')}<br>${log.innerHTML}`;
  const fragment1 = document.getElementById('fragment1');
  fragment1.addEventListener('mas:load', (e) => {
    logger('aem-fragment is loaded: ', JSON.stringify(e.target.data, null, '\t'));
  });
  const card1 = document.getElementById('card1');
   card1.addEventListener('mas:ready', (e) => {
    logger('merch-card is ready: ', e.target.variant);
  });
   card1.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      e.stopPropagation();
      logger('merch-card cta click: ', e.target);
    }
  });
</script>

[See logs](#logs)

### Static HTML

```html
<merch-card variant="plans" badge-color="#EDCC2D" badge-background-color="#000000"" badge-text=" Best value">
  <merch-icon slot="icons" size="l" src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg" alt="Creative Cloud All Apps"></merch-icon>
  <h4 slot="heading-xs">Creative Cloud All Apps</h4>
  <h3 slot="heading-m">
      <span is="inline-price" data-display-per-unit="false" data-display-recurrence="true"
          data-display-tax="false" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"></span>
  </h3>
  <p slot="body-xxs">Desktop</p>
  <div slot="body-xs">
      <p>Get 20+ Creative Cloud apps including Photoshop, Illustrator, Adobe Express, Premiere Pro, and
          Acrobat Pro. (Substance 3D apps are not included.)</p>
      <p><a href="https://adobe.com">See plans & pricing details</a></p>
  </div>
  <div slot="footer">
      <a is="checkout-link" href="#" class="con-button blue active" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8">Save now</a>
  </div>
</merch-card>
```

#### Demo

<merch-card variant="plans" badge-color="#EDCC2D" badge-background-color="#000000" badge-text="Best value">
  <merch-icon slot="icons" size="l" src="https://www.adobe.com/content/dam/shared/images/product-icons/svg/creative-cloud.svg" alt="Creative Cloud All Apps"></merch-icon>
  <h4 slot="heading-xs">Creative Cloud All Apps</h4>
  <h3 slot="heading-m">
      <span is="inline-price" data-display-per-unit="false" data-display-recurrence="true"
          data-display-tax="false" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"></span>
  </h3>
  <p slot="body-xxs">Desktop</p>
  <div slot="body-xs">
      <p>Get 20+ Creative Cloud apps including Photoshop, Illustrator, Adobe Express, Premiere Pro, and
          Acrobat Pro. (Substance 3D apps are not included.)</p>
      <p><a href="https://adobe.com">See plans & pricing details</a></p>
  </div>
  <div slot="footer">
      <a is="checkout-link" href="#" class="con-button blue active" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8">Save now</a>
  </div>
</merch-card>

### Attributes

| Name        | Description                                                                         | Default Value                        | Required |
| ----------- | ----------------------------------------------------------------------------------- | ------------------------------------ | -------- |
| `variant`   | Variant in terms design. Not required when used with an `aem-fragment`              |                                      | `false`  |
| `consonant` | Whether to use consonant styles without sp-button decorator around the footer CTAs. | `true` if `aem-fragment` is not used | `false`  |
| `size`      | a card can span over 2 columns or entire row with `wide\|super-wide`                | `medium`                             | `false`  |

#### Active variants:

-   `catalog`
-   `ccd-action`
-   `image`
-   `inline-heading`
-   `mini-compare-chart`
-   `plans`
-   `product`
-   `segment`
-   `special-offers`
-   `twp`
-   `ccd-slice`

### Properties

| Name             | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `updateComplete` | a promise that resolves when the `merch-card` finishes to render |

### Events

| Name    | Description                                      |
| ------- | ------------------------------------------------ |
| `mas:ready` | fires when rendered together with `aem-fragment` |

## aem-fragment custom element

### Attributes

| Name       | Description                                                                              | Default Value | Required |
| ---------- | ---------------------------------------------------------------------------------------- | ------------- | -------- |
| `fragment` | Fragment id. The copy/use feature in M@S Studio will copy the id/markup to the clipboard |               | `true`   |
| `title`    | Informative title                                                                        |               | `false`  |
| `ims`      | attempts to use IMS access token via `window.adobeid.authorize()` to fetch fragment      |               | `false`  |

### Properties

| Name             | Description                                                                    |
| ---------------- | ------------------------------------------------------------------------------ |
| `data`           | Current fragment RAW data that is used to render the merch-card                |
| `updateComplete` | Promise that resolves when the fragment is retrieved and `load` event is fired |

### Events

| Name   | Description                                    |
| ------ | ---------------------------------------------- |
| `mas:load` | fires when the fragment is successfully loaded |

#### Logs <br>

```html {#log}

```
