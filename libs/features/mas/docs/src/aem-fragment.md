# aem-fragment custom element

The `aem-fragment` custom element is used to load a content fragment from MAS/Odin.
It features a caching mechanism, supports retrying on fetch errors, and can serve stale content if fetching new content fails, ensuring robustness.

## Example

The `aem-fragment` element is headless and does not render any content on its own. You should use its events to handle the loaded data.

## Attributes

| Name       | Description                                                                                                                                                   | Default Value | Required |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------- |
| `fragment` | The ID of the fragment to load.                                                                                                                               |               | `true`   |
| `loading`  | If a fragment is known to be in a collection, set to `cache`, so that it can be initialized from the collection cache, falls back to `eager` after a timeout. | `eager`       | `false`  |
| `timeout`  | The timeout in milliseconds for `loading=cache`.                                                                                                              | `5000`        | `false`  |
| `author`   | Enables author mode, which affects data transformation.                                                                                                       | `false`       | `false`  |
| `preview`  | Enables preview mode, fetching data from the preview service.                                                                                                 | `false`       | `false`  |
| `title`    | An informative title for the fragment.                                                                                                                        |               | `false`  |

## Properties

| Name             | Description                                                                              | Type      |
| ---------------- | ---------------------------------------------------------------------------------------- | --------- |
| `data`           | The transformed fragment data.                                                           | `Object`  |
| `updateComplete` | A promise that resolves when the fragment is loaded, or rejects on error.                | `Promise` |
| `fetchInfo`      | An object containing information about the fetch operation (URL, status, retries, etc.). | `Object`  |

## Methods

| Name                         | Description                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `refresh(flushCache = true)` | Refreshes the fragment content. If `flushCache` is `true`, it will bypass the cache. |

## Events

| Name        | Description                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| `aem:load`  | Fires when the fragment is successfully loaded. The event `detail` property contains the fragment data. |
| `aem:error` | Fires when the fragment fails to load. The event `detail` property contains error information.          |

## Error Handling

The `aem-fragment` component can encounter several types of errors during its lifecycle, such as a missing fragment ID, network issues, or server errors. When an error occurs, it dispatches an `aem:error` event. The `detail` property of this event contains information about the error.

You can handle these errors by adding an event listener to the `aem-fragment` element.

<style>
  #log1 {
    max-height: 400px;
  }
</style>

```html {.demo .light}
<div id="fragment-container"></div>
<script type="module">
    const target = document.getElementById('log1');
    const container = document.getElementById('fragment-container');

    container.addEventListener('aem:load', (e) => {
        const pre = document.createElement('pre');
        pre.textContent = 'aem:load: ' + JSON.stringify(e.detail, null, 2);
        target.append(pre);
    });

    container.addEventListener('aem:error', (e) => {
        const pre = document.createElement('pre');
        pre.textContent = 'aem:error: ' + JSON.stringify(e.detail, null, 2);
        target.append(pre);
    });

    container.innerHTML = `
        <aem-fragment fragment="d8008cac-010f-4607-bacc-a7a327da1312"></aem-fragment>
        <aem-fragment fragment="wrong-fragment-id"></aem-fragment>
    `;
</script>
```

#### Logs

```html {#log1}

```
