# WCMS Commerce

This package provides commerce capabilities to non Dexter consumers such as Milo.


### Building

To build this package, use:

```sh
$ npm run build
```

Build system is based on [esbuild](https://esbuild.github.io/), it bundles and optimises package code for evergreen web browsers.

Build process will copy the files below to `libs` folder:
- `commerce.js` - bundle ESM file for browser,
- `commerce.js.map` - source map, needed for debugging of build code in browser,
- `commerce.d.ts` - type definitions, enables intelligent suggestions in an IDE.
To explore bundle contents, upload `stats.json` file to [esbuild analyzer](https://esbuild.github.io/analyze/).


### Milo Consumption
To consume in milo, use another command - `npm run build`, that will generate files in `/libs/deps/mas` folder 
File `milo-libs/commerce.js` should be copied to Milo's [deps](https://github.com/adobecom/milo/tree/main/libs/deps).

### Testing
This package uses same unit testing toolset as Milo:
- [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/)
- [ChaiJS](https://www.chaijs.com/api/bdd/)
- [SinonJS](https://sinonjs.org/releases/v15/)

To run all tests in watch mode, use:

```sh
$ npm run test
```

To run particular test file in watch mode, use:

```sh
$ npm run test:file -- test/settings.test.js
```

Unit tests can output debugging log messages to the developer console of browser performing the test.
To enable debug mode, update `env.name` in `getConfig` function of `test/utilities.js`.

### Consumption

Consumers usually import commerce service dynamically and call its `init` function:

```javascript
import { getConfig } from '../../utils/utils.js';

export default async function init(el) {
  const { Log, init, reset } = await import('../../deps/mas/commerce.js');
  const log = Log.commerce.module('merch');
  const commerce = await init(getConfig);
  log.debug('Activated:', { commerce, el });
}
```

The `init` function accepts
* a `getConfig` function providing the commerce config
* a `getProviders` function providing callbacks for external logic such us entitlements provided by Milo
<br>

It returns a promise resolving to an initialised instance of `Commerce` service. Resolved instance is shared across subsequent calls to `init` function and can be released with call to `reset` function. Next call to `init` will create and return a new instance of Commerce service.

The most usable features Commerce service provides, are:
- `service.checkout.buildUrl` function - returns checkout URL for given price offers,
- `service.wcs.resolveOfferSelectors` function - resolves price offers by requesting WCS endpoint,
- `service.providers.price` function - registers function to preprocess WCS options collected from every price HTML element appended to DOM.
- `service.settings` object - contains configured settings for `checkout` and `wcs` modules.

A consuming code may append inline price and/or checkout link elements to the DOM:
```
const a = document.createElement('a', { is: 'checkout-link' });
a.setAttribute('is', 'checkout-link');
a.dataset = { wcsOsi: '...' };
document.body.append(a);

const span = document.createElement('span', { is: 'inline-price' });
span.setAttribute('is', 'inline-price');
span.dataset = { wcsOsi: '...', wcsType: 'price' };
document.body.append(span);
```

For full list of package exports, see `src/index.js`.

