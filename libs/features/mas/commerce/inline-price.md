# inline-price {#inline-price}

## Introduction {#introduction}

This custom element renders an inline price supporting various display options and configurations. It retrieves pricing information based on the provided Offer Selector ID.

It requires an Offer Selector ID to retrieve the offer details from WCS.

See [MAS](mas.html) introduction to learn more.

### Example

```html
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
></span>
```

#### Demo

This is a functional inline price element: <span is="inline-price" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"></span>

## Attributes {#attributes}

| Attribute                 | Description                                                                                 | Default Value | Required |
| ------------------------- | ------------------------------------------------------------------------------------------- | ------------- | -------- |
| `data-wcs-osi`            | Offer Selector ID                                                                           |               | `true`   |
| `data-display-old-price`  | Whether to display the old price (in case of flex or legacy promo offer)                    | `true`        | `false`  |
| `data-display-per-unit`   | Whether to display the price per unit (e.g:, per license)                                   | `false`       | `false`  |
| `data-display-recurrence` | Whether to display the recurrence information (e.g:, /mo)                                   | `true`        | `false`  |
| `data-display-tax`        | Whether to display tax information                                                          | `false`       | `false`  |
| `data-perpetual`          | Whether this is a perpetual offer                                                           | `false`       | `false`  |
| `data-promotion-code`     | Flex promotion code to apply, if applicable                                                 |               | `false`  |
| `data-tax-exclusive`      | Whether to force tax exclusive price, if `false`, it's automatic, driven by country service | `false`       | `false`  |
| `data-template`           | One of price, priceDiscount, priceOptical, priceStrikethrough, priceAnnual                  | price         | `false`  |

### data-template values

| Name                 | Description                                                     |
| -------------------- | --------------------------------------------------------------- |
| `price`              | The default price of the offer                                  |
| `priceDiscount`      | Displays the promo price in percentage, e.g:, 19%               |
| `priceOptical`       | For **paid upfront offers**(PUF), renders the monthly price     |
| `priceAnnual`        | For **annual, billed monthly** offers, renders the yearly price |
| `priceStrikethrough` | render the price as strikethrough                               |

### Examples {#examples}

#### Display Per Unit Price with Tax

```html
<span
    is="inline-price"
    data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"
    data-display-per-unit="true"
    data-display-tax="true"
></span>
```

##### Demo

<span is="inline-price" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-display-per-unit="true" data-display-tax="true"></span>

## Properties {#properties}

| Property      | Description                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------- |
| `onceSettled` | Promise that resolves when the custom-element either resolves or fails to retrieve the price |
| `options`     | JSON object with the complete set of properties used to resolve the price                    |
| `value`       | The actual price data that is used to render the inline price.                               |

### Example

```html
<span
    id="ip1"
    is="inline-price"
    data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
></span>
<script type="module">
    document
        .getElementById('ip1')
        .onceSettled()
        .then((el) => {
            document.getElementById('ipValue').innerHTML = JSON.stringify(
                el.value,
                null,
                '\t',
            );
            document.getElementById('ipOptions').innerHTML = JSON.stringify(
                el.options,
                null,
                '\t',
            );
        });
</script>
```

<span id="ip1" is="inline-price" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"></span>

<script type="module">
  document.getElementById('ip1').onceSettled().then(el => {
    document.getElementById('ipValue').innerHTML = JSON.stringify(el.value, null, '\t');
    document.getElementById('ipOptions').innerHTML = JSON.stringify(el.options, null, '\t');
  });
</script>

#### value property

```json {#ipValue}

```

#### options property

```json {#ipOptions}

```

## Methods {#methods}

| Property                     | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `requestUpdate(true\|false)` | Causes a re-render using the actual options |

## Events {#events}

| Event                       | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `wcms:placeholder:pending`  | Fires when inline price starts loading             |
| `wcms:placeholder:resolved` | Fires when the price is successfully resolved      |
| `wcms:placeholder:failed`   | Fires when the price could not be found or fetched |

For each event, the following CSS classes are toggled on the element: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

::: warning
**Note**: Event names with `wcms:placeholder` prefix may be subject to change.
:::

### Example

```html
<span
    id="ip2"
    is="inline-price"
    data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"
></span>
<script type="module">
    const log = document.getElementById('log');
    const logger = (...messages) =>
        (log.innerHTML = `${messages.join(' ')}<br>${log.innerHTML}`);
    const span = document.getElementById('ip2');
    span.addEventListener('wcms:placeholder:pending', () =>
        logger('inline-price pending'),
    );
    span.addEventListener('wcms:placeholder:resolved', () =>
        logger('inline-price resolved'),
    );
    span.addEventListener('wcms:placeholder:failed', () =>
        logger('inline-price failed'),
    );
</script>
```

<span id="ip2" is="inline-price" data-wcs-osi="r_JXAnlFI7xD6FxWKl2ODvZriLYBoSL701Kd1hRyhe8"></span>

<script type="module">
  const log = document.getElementById('log');
  const logger = (...messages) => log.innerHTML = `${messages.join(' ')}<br>${log.innerHTML}`;
  const span = document.getElementById('ip2');
  span.addEventListener('wcms:placeholder:pending', () => logger('inline-price pending'));
  span.addEventListener('wcms:placeholder:resolved', () => logger('inline-price resolved'));
  span.addEventListener('wcms:placeholder:failed', () => logger('inline-price failed'));
</script>

#### Logs

```html {#log}

```
