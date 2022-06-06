# MultiField Component

A component that emulates the AEM multifield.  Any fields wrapped within the multifield can be repeated any number of times.

## Parameters

* `title`: Title for the entire multifield component
* `subTitle`: (Optional) Heading placed under the title.
* `values`: Array of values for the child fields.
* `onChange`: Function to handle user changes
* `children`: Passed in via jsx
* `className`: (Optional) class name to be added to the multifield wrapper divs.  Useful for targeting css changes or adding js handlers.

## Usage

Any fields to be wrapped within the multifield component *must* contain the following attributes:
* `name` OR `id`: Used to uniquely identify the field.  This is used as the object key in the `values` array.
* `value`: Value for the field, controlled by the multifield component.
* `onChange`: Controlled by the multifield component to handle user changes.

```js
<${MultiField}
    onChange=${multifieldOnChange}
    values=${multifieldValues}
    title="Sample Multifield Component"
    subTitle=""
    className="sample"
    >
    <${Input}
        label="Dog Name"
        name="dogName"
        />
    <${Select}
        id="country"
        options=${allCountries}
        label="Country"
        />
<//>
```

For the sample above, the `values` array will have the format of:
```js
[
    {
        dogName: 'Dexter',
        country: 'Switzerland',
    },
    {
        dogName: 'Milo',
        country: 'Germany',
    },
    ...
]
