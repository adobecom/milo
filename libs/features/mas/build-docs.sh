#!/bin/bash

node build-docs.mjs commerce/inline-price.md docs/inline-price.html
node build-docs.mjs commerce/checkout-link.md docs/checkout-link.html
node build-docs.mjs mas.md docs/mas.html
node build-docs.mjs mas/mas.js.md docs/mas.js.html
node build-docs.mjs web-components/merch-card.md docs/merch-card.html
