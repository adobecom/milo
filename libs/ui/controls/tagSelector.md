# TagSelector Component

This component is used for selecting tag values that are then listed in the input field.  Can be used as a dropdown single select, or multiple select via a modal dialog depending on the `options` data format specified.

## Parameters

* `options`: Options to select from.  Can be in one of 2 formats:
  * Single select - Dropdown Selector - `{ key: 'label' }`:
  * Multi select - Modal Selector - object tree:
    ```js
    {
      key: {
        label: 'Label for key',
        path: 'Path/Breadcrumb to current item',
        children: { ... }
      }
    }
    ```
* `label`: (String) The label for the field
* `value`: (Array) Current selected tag values
* `onChange`: (Function) Called when the value changes

### Sample options

#### Dropdown Select:
```js
{ 'product-photoshop': 'Photoshop', 'product-ai': 'Illustrator' }
```

#### Modal Select:
```js
{
  'caas:language': {
    label: 'Language',
    path: 'language',
    children: {
      'caas:language/en': { label: 'English', path: 'language/en' },
      'caas:language/fr': { label: 'French', path: 'language/fr' },
      ...
    }
  },
  ...
}
