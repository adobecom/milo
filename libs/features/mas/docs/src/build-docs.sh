#!/bin/bash

node ./build-docs.mjs inline-price.md ../inline-price.html
node ./build-docs.mjs checkout-link.md ../checkout-link.html
node ./build-docs.mjs checkout-button.md ../checkout-button.html
node ./build-docs.mjs mas.md ../mas.html
node ./build-docs.mjs step-by-step.md ../step-by-step.html
node ./build-docs.mjs mas.js.md ../mas.js.html
node ./build-docs.mjs merch-card.md ../merch-card.html
node ./build-docs.mjs plans.md ../plans.html
node ./build-docs.mjs ccd.md ../ccd.html
npx esbuild --bundle  --outfile=../spectrum.js ./spectrum.mjs
