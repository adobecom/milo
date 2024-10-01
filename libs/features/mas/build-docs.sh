#!/bin/bash

# Build documentation for commerce/checkout-link.md and output to docs/checkout-link.html
node build-docs.mjs commerce/checkout-link.md docs/checkout-link.html

# Build documentation for mas/mas.md and output to docs/mas.html
node build-docs.mjs mas/mas.md docs/mas.html

# Build documentation for mas/mas.js.md and output to docs/mas.js.html, does not include mas.js in the generated html
node build-docs.mjs mas/mas.js.md docs/mas.js.html --skip-mas
