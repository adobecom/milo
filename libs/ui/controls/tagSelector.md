# TagSelector Component

This component is used for selecting tag values that are then listed in the input field.

## Parameters

* `options`: Options to select from.  Can be in one of 2 formats:
  * Single select - `{ key: label }`:
    *  e.g: `{ 'product-photoshop': 'Photoshop', 'product-ai': 'Illustrator' }`
  * Multi select - object tree:

  optionMap = {},
  isModal = false,
  label = '',
  value = [],
  onChange,
