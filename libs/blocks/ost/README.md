# Offer Selector Tool (OST)

## About

Offer Selector Tool is a React based UI that allows to discover [offer selectors](https://developers.corp.adobe.com/aos/docs/api/openapi/openapi.yml) and use them in different context.

e.g: insert the price, or select an offer selector to render its checkout URL.

Offer selectors are kind of saved search for AOS offers. They can return multiple offers.

Offer Selector Tool will assume an offer selector returns always a single offer, and always pick the first offer in the result.

In Milo, Offer Selector Tool is imported as a webpack-generated library 

For more info on Tacocat.js or Offer Selector Tool visit https://git.corp.adobe.com/Dexter/tacocat.js/tree/develop/packages/offer-selector-tool

## Updating Offer Selector Tool library in Milo
To import Offer Selector Tool into Milo it first needs to be generated as a webpack-built library in [Tacocat.js project](https://git.corp.adobe.com/Dexter/tacocat.js/tree/develop/packages/offer-selector-tool).
Assuming there is an update to Offer Selector Tool, these are the steps to update the library:

1. Generate OST library in Tacocat.js by running `npm run build-global` in `packages/offer-selector-tool`.
2. A new version of OST will be generated in `packages/offer-selector-tool/public/develop.js`.
3. Copy the JS file and paste it in Milo project under `libs/deps`, then rename it to `offer-selector-tool.js` (delete the old version first).

