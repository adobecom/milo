# a[is="checkout-link"]

HTML Checkout Link Anchor element, extends anchor
special member _onceSettled_ promise that either resolves or fail with web commerce information.


# span[is="inline-price"]

HTML Price Web Component, extends span.
special member _onceSettled_ promise that either resolves or fail with web commerce information.


# wcms-commerce

Custom web component to provide active instance of commerce service
to consumers, appended to the head section of current document.


# merch-card-collection

## Events

| Event                            | Type                           |
|----------------------------------|--------------------------------|
| `merch-card-collection:showmore` | `CustomEvent<any>`             |
| `merch-card-collection:sort`     | `CustomEvent<{ value: any; }>` |


# merch-card

## Events

| Event                  | Type                                 |
|------------------------|--------------------------------------|
| `merch-card:ready`     | `CustomEvent<any>`                   |
| `merch-storage:change` | `CustomEvent<{ offerSelect: any; }>` |


# merch-datasource

Custom element representing a MerchDataSource.


# merch-icon


# merch-mnemonic-list


# merch-offer-select

## Events

| Event                      | Type                |
|----------------------------|---------------------|
| `merch-offer-select:ready` | `CustomEvent<any>`  |
| `merch-offer:selected`     | `CustomEvent<this>` |


# merch-offer

## Events

| Event               | Type               |
|---------------------|--------------------|
| `merch-offer:ready` | `CustomEvent<any>` |


# merch-quantity-select

## Events

| Event                            | Type                               |
|----------------------------------|------------------------------------|
| `merch-quantity-selector:change` | `CustomEvent<{ option: number; }>` |


# merch-search

## Events

| Event                 | Type                                            |
|-----------------------|-------------------------------------------------|
| `merch-search:change` | `CustomEvent<{ type: string; value: string; }>` |


# merch-secure-transaction


# merch-stock

## Events

| Event                | Type                                            |
|----------------------|-------------------------------------------------|
| `merch-stock:change` | `CustomEvent<{ checked: any; planType: any; }>` |


# merch-subscription-panel


# merch-twp-d2p


# merch-whats-included

## Events

| Event                    | Type               |
|--------------------------|--------------------|
| `hide-see-more-elements` | `CustomEvent<any>` |


# plans-modal


# merch-sidenav-checkbox-group


# merch-sidenav-list

## Events

| Event                  | Type                                             |
|------------------------|--------------------------------------------------|
| `merch-sidenav:select` | `CustomEvent<{ type: string; value: any; elt: any; }>` |


# merch-sidenav
