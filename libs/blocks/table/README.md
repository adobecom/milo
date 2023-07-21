# Table

## Block variant
* `sticky`
* `highlight`
* `merch`
* `collapse`


### `sticky`
* To enable sticky header.

### `highlight`
* If enabled, the first row below the table header is reserved for highlights, and the second row is reserved for table headings.
```
_______________________________________________________
| Table (highlight)                                   |
|_____________________________________________________|
| Highlight-1     | Highlight-2     |                 |
|_________________|_________________|_________________|
| Heading Title-1 | Heading Title-2 | Heading Title-3 |
| Pricing-1       | Pricing-2       | Pricing-3       |
| Buttons-1       | Buttons-2       | Buttons-3       |
|_________________|_________________|_________________|

```

* If not enabled, the first row below the table header is reserved for table headings.
```
_______________________________________________________
| Table                                               |
|_____________________________________________________|
| Heading Title-1 | Heading Title-2 | Heading Title-3 |
| Pricing-1       | Pricing-2       | Pricing-3       |
| Buttons-1       | Buttons-2       | Buttons-3       |
|_________________|_________________|_________________|

```
### `merch`
* Each column will be displayed as a separate table.

### `collapse`
* A plus/minus icon will automatically be added next to the Section Title, allowing the sections to expand/collapse.
* The first section is always expanded by default.
* It is disabled for merch tables.


## Block Configuration

### Standard Table
```
__________________________________________________________________________
| Table (sticky, highlight, collapse)                                    |
|________________________________________________________________________|
|                  | Highlight-2     |                 | Highlight-4     |
|__________________|_________________|_________________|_________________|
|                  | Heading Title-2 | Heading Title-3 | Heading Title-4 |
|                  | Pricing-2       | Pricing-3       | Pricing-4       |
|                  | Buttons-2       | Buttons-3       | Buttons-4       |
|__________________|_________________|_________________|_________________|
|---               |                 |                 |                 |
|__________________|_________________|_________________|_________________|
| Section-1, Title |                 |                 |                 |
|__________________|_________________|_________________|_________________|
| Row-1.1, Title   | Content         | Content         | Content         |
|__________________|_________________|_________________|_________________|
| Row-1.2, Title   | Content         | Content         | Content         |
|__________________|_________________|_________________|_________________|
|---               |                 |                 |                 |
|__________________|_________________|_________________|_________________|
| Section-2, Title |                 |                 |                 |
|__________________|_________________|_________________|_________________|
| Row-2.1, Title   | Content         | Content         | Content         |
|__________________|_________________|_________________|_________________|
| Row-2.2, Title   | Content         | Content         | Content         |
|__________________|_________________|_________________|_________________|

```

### Merch Table
```
___________________________________________________________________
| Table (merch, sticky, highlight)                                |
|_________________________________________________________________|
|                     | Highlight-2         |                     |
|_____________________|_____________________|_____________________|
| Images-1            | Images-2            | Images-3            |
| Heading Title-1     | Heading Title-2     | Heading Title-3     |
| Pricing-1           | Pricing-2           | Pricing-3           |
| Additional Text-1   | Additional Text-2   | Additional Text-3   |
| Buttons-1           | Buttons-3           | Buttons-3           |
|_____________________|_____________________|_____________________|
|---                  |                     |                     |
|_____________________|_____________________|_____________________|
| Section-1, Title    | Section-1, Title    | Section-1, Title    |
|____________________ |_____________________|_____________________|
| Section Content-1.1 | Section Content-1.1 | Section Content-1.1 |
|_____________________|_____________________|_____________________|
| Section Content-1.2 | Section Content-1.2 | Section Content-1.2 |
|_____________________|____________________ |_____________________|
|---                  |                     |                     |
|_____________________|_____________________|_____________________|
| Section-2, Title    | Section-2, Title    | Section-2, Title    |
|_____________________|_____________________|_____________________|
| Section Content-2.1 | Section Content-2.1 | Section Content-2.1 |
|_____________________|_____________________|_____________________|
| Section Content-2.2 | Section Content-2.2 | Section Content-2.2 |
|_____________________|_____________________|_____________________|

```
## Headings in Table
* The first text element in the heading column is always the title.
* The only element(s) that can be added before the title are images.
* The second element is reserved for pricing.
* Every additional content after the pricing will be formatted regularly.
* Buttons will always be displayed at the bottom of the column cell.


## Sections in Table
* Sections are separated by '---'.
* The first row in a section is the Section Title.
* The rest of the rows within the section will be considered as section content.


## Table metadata
It is an optional feature for customizing colors on the table instead of using default colors.

Colors can be set in two ways:
* For all columns in a row - by passing just the color without specifying the column number.
* For each column separately - by passing the specific column number and color.

The following two options are available for text color:
* light/white
* dark

For the background color, it is possible to use the following ways of specifing colors:
* Keywords
* Hexadecimal colors
* Hexadecimal colors with transparency
* RGB colors
* RGBA colors
* HSL colors
* HSLA colors
* Gradients

```
Example:
_____________________________________________________________________________________________________________
| Table Metadata                                                                                            |
|___________________________________________________________________________________________________________|
| Highlight color             | light                                                                       |
|___________________________________________________________________________________________________________|
| Highlight background  color | #232323                                                                     |
|___________________________________________________________________________________________________________|
| Heading color               | 1, light                                                                    |
|                             | 2, dark                                                                     |
|___________________________________________________________________________________________________________|
| Heading background color    | 1, #d16971                                                                  |
|                             | 3, linear-gradient(256.69deg, #E3F1FE 4.12%, #A1CDF9 42.35%, #6BA6F0 98.9%) |
|___________________________________________________________________________________________________________|

```


## Behaviors

### Standard Table

#### Mobile (0 - 768px)
* Only 2 columns will be visible. By default, the first 2 columns with a filled heading column will be displayed. The user can then select, from the select box, which two columns they want to see.

#### Tablet (769px - 899px) and Desktop (900px - ∞)
* Each column will be visible.

### Merch Table

#### Mobile (0 - 768px) and Tablet (769px - 899px)
* Only 2 columns will be visible. By default, the first 2 columns with a filled heading column will be displayed. The user can then select, from the select box, which two columns they want to see.

#### Desktop (900px - ∞)
* Each column will be visible.


## User Experience

### Standard Table
* Default colors, without passing Table Metadata:

<img width="425" alt="Screenshot 2023-06-12 at 12 50 28" src="https://github.com/draganatrajkovic/milo/assets/65951679/1e293b4c-b71a-4aaa-8c84-1ebd1051e916">

* Customized colors by Table Matadata:

<img width="425" alt="Screenshot 2023-06-12 at 13 14 20" src="https://github.com/draganatrajkovic/milo/assets/65951679/6a74cc24-4e20-42cb-9156-c2128a591650">

* Mobile screen:

<img width="284" alt="Screenshot 2023-06-12 at 13 21 45" src="https://github.com/draganatrajkovic/milo/assets/65951679/6d1567cd-1f57-41ea-9717-d542125b8e76">

### Merch Table
* Default colors, without passing Table Metadata:

<img width="425" alt="Screenshot 2023-06-12 at 12 57 24" src="https://github.com/draganatrajkovic/milo/assets/65951679/f43e24bc-6acf-4294-9d3a-cbf04908daca">

* Customized colors by Table Matadata:

<img width="425" alt="Screenshot 2023-06-12 at 13 12 02" src="https://github.com/draganatrajkovic/milo/assets/65951679/ac820c7f-d2a4-44cb-b71d-482f752de95c">

* Mobile screen:

<img width="369" alt="Screenshot 2023-06-12 at 13 20 00" src="https://github.com/draganatrajkovic/milo/assets/65951679/fda0baa8-9781-4974-b467-09807e6aefc6">
