#!/bin/bash

node build-docs.mjs commerce/checkout-link.md docs/checkout-link.html

node build-docs.mjs mas.md docs/mas.html

# do not include mas.js in the generated html
node build-docs.mjs mas/mas.js.md docs/mas.js.html --skip-mas

node build-docs.mjs web-components/merch-card.md docs/merch-card.html
