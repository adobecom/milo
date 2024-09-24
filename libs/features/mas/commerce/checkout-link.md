# checkout-link

## Introduction
This custom element renders a checkout link supporting most of the features documented at https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide.<br>
Sometimes a checkout-link can be also referred as placeholder as it can be used as an inline link resolving at runtime.<br>
The term placeholder will be deprecated and it is recommended to refer as **checkout-link custom element** going forward.

Behind the scene, it uses https://git.corp.adobe.com/PandoraUI/commerce-core to generate the checkout url.

It requires an Offer Selector ID to retrieve the offer from WCS.

### Offer Selector ID <br>
AOS generated a stable reference for a set of natural keys allowing to retrieve a specific offer whose offer ID can change over time.

[API: Create an offer selector](https://developers.corp.adobe.com/aos/docs/guide/apis/api.yaml#/paths/offer_selectors/post)

### WCS
WCS (pronounced weks) provides APIs returning Commerce data required by Adobe.com.

https://developers.corp.adobe.com/wcs/docs/guide/introduction.md
https://developers.corp.adobe.com/wcs/docs/api/openapi/wcs/latest.yaml#/schemas/Web-Commerce-Artifacts




### Example <br>

```html
<a href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M">Buy now</a>
```

#### Demo<br>

This is a functional **buy now** button: <a href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M">Buy now</a>


## Attributes

| Attribute                    | Description                                                                                     | Default Value | Required |
|------------------------------|-------------------------------------------------------------------------------------------------|---------------|----------|
| `data-wcs-osi`               | Offer Selector ID, can be multiple, seperated by comma           |               |   `true`       |
| `data-checkout-workflow`     | Target checkout workflow to for the generation of checkout urls     | UCv3              |         `false` |
| `data-checkout-workflow-step`| [workflow step](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide#UCv3LinkCreationGuide-RegularWorkflow) to land on on the unified checkout page|     email          |     `false`     |
| `data-extra-options`         | additional query params to append to the url, see: [Table of public query params](https://wiki.corp.adobe.com/pages/viewpage.action?spaceKey=businessservices&title=UCv3+Link+Creation+Guide#UCv3LinkCreationGuide-Tableofpublicqueryparams)|        {}       |   `false`       |
| `data-ims-country`           | the ims country to code of the user if signed in, overrides the locale country in the generated checkout url           |              |   `false`       |
| `data-perpetual`             | whether this is a perpetual offer `true\|false`             |               |        `false`  |
| `data-promotion-code`        | Flex promotion code, if applicable        |               |        `false`  |
| `data-quantity`              | Quantity of the offer to purchase              |    1           |     `false`     |
| `data-entitlement`           | `entitlement` flag for client side interpretation           |    `false`           |          `false` |
| `data-upgrade`               | `upgrade` flag for client side interpretation               |     `false`          |  `false`        |
| `data-modal`                 | `modal` flag for client side interpretation                 |     `false`          |      `false`    |



### Examples <br>


#### Custom Workflow Step

```html
<a href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-checkout-workflow-step="recommendation">Buy now</a>
```

##### Demo<br>
<a href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-checkout-workflow-step="recommendation">Buy now</a>

#### Multiple Quantities
Two photoshop and three acrobat pro single apps (TEAMS):

```html
<a href="#" is="checkout-link" data-wcs-osi="yHKQJK2VOMSY5bINgg7oa2ov9RnmnU1oJe4NOg4QTYI,vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE" data-quantity="2,3">Buy now</a>
```

##### Demo<br>
<a href="#" is="checkout-link" data-wcs-osi="yHKQJK2VOMSY5bINgg7oa2ov9RnmnU1oJe4NOg4QTYI,vV01ci-KLH6hYdRfUKMBFx009hdpxZcIRG1-BY_PutE" data-quantity="2,3">Buy now</a>


#### Custom query params

```html
<a href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-extra-options="{&quot;promoid&quot;:&quot;promo12345&quot;,&quot;mv&quot;:1,&quot;mv2&quot;:2}">Buy now</a>
```

##### Demo<br>
<a href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-extra-options="{&quot;promoid&quot;:&quot;promo12345&quot;,&quot;mv&quot;:1,&quot;mv2&quot;:2}">Buy now</a>


#### IMS Country

```html
<a href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-ims-country="JP">Buy now</a>
```

##### Demo<br>
<a href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-ims-country="JP">Buy now</a>


## Properties

| Property      | Description                       |
|---------------|-----------------------------------|
| `onceSettled` | promise that resolves when the custom-element either resolves or fails to resolve the offer       |
| `options`     | JSON object with the complete set of properties used to resolve the offer          |
| `value`       | The actual offer that is used to render the checkout link. In some cases WCS can return multiple offers but only one will be picked to render for a single app.            |

### Example <br>

```html
<a id="co1" href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-ims-country="CA">Buy now</a>
<script type="module">
  document.getElementById('co1').onceSettled().then(el => {
    document.getElementById('coValue').innerHTML = JSON.stringify(el.value, null, '\t');
    document.getElementById('coOptions').innerHTML = JSON.stringify(el.options, null, '\t');
  });
</script>
```
<a id="co1" href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M" data-ims-country="CA">Buy now</a>
<script type="module">
  document.getElementById('co1').onceSettled().then(el => {
    document.getElementById('coValue').innerHTML = JSON.stringify(el.value, null, '\t');
    document.getElementById('coOptions').innerHTML = JSON.stringify(el.options, null, '\t');
  });
</script>

#### value property
```json {#coValue}
```

#### options property
```json {#coOptions}
```


## Methods

| Property      | Description                       |
|---------------|-----------------------------------|
| `requestUpdate(true\|false)` |  causes a re-render using the actual options      |


## Events

| Event     | Description                       |
|-----------|-----------------------------------|
| `wcms:placeholder:pending` | fires when checkout link starts loading    |
| `wcms:placeholder:resolved`| fires when the offer is successfully  resolved  |
| `wcms:placeholder:failed`  | fires when the offer is could not be found or fetched     |
| `click`   | native click event on the `a`  element      |


<br>

For each events except `click`, the following css classes are toggled on the element: `placeholder-pending`, `placeholder-resolved`, `placeholder-failed`.

::: warning
**Note**: Event names with `wcms:placeholder` prefix can be subject to change.
:::


### Example <br>

```html
<a id="co2" href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M">Buy now (click me)</a>
<script type="module">
  const logTarget = document.getElementById('logTarget');
  const log = (...messages) => logTarget.innerHTML = `${logTarget.innerHTML}<br>${messages.join(' ')}`;
  const a = document.getElementById('co2');
  a.addEventListener('wcms:placeholder:pending', () => log('placeholder pending'));
  a.addEventListener('wcms:placeholder:resolved', () => log('placeholder resolved'));
  a.addEventListener('wcms:placeholder:failed', () => log('placeholder failed'));
  a.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    log('checkout link is clicked: ', e.target.href);
  });
  a.addEvent
</script>
```

<a id="co2" href="#" is="checkout-link" data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M">Buy now (click me)</a>
<script type="module">
  const logTarget = document.getElementById('logTarget');
  const log = (...messages) => logTarget.innerHTML = `${logTarget.innerHTML}<br>${messages.join(' ')}`;
  const a = document.getElementById('co2');
  a.addEventListener('wcms:placeholder:pending', () => log('placeholder pending'));
  a.addEventListener('wcms:placeholder:resolved', () => log('placeholder resolved'));
  a.addEventListener('wcms:placeholder:failed', () => log('placeholder failed'));
  a.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    log('checkout link is clicked: ', e.target.href);
  });
  a.addEvent
</script>


#### Logs <br>
```html {#logTarget}
```
