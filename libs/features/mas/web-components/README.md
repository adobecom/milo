### WCMS Commerce Web Components

This module contains interactive web components and core features for wcms commerce such as:

* Merch cards for usage on CC/DC
* Subscription modal
* TWP modal
* Quantity selector
* Entitlements
* Upgrade flow logic

The web components are built using [Lit](https://lit.dev/) framework.

The main reason is to embrace vanilla HTML/JS approach as much as possible instead of a React like framework, while having a strong component based foundation for building the user experiences.

A web component can be used similar to any HTML tag without requiring any initialitation logic.

e.g:

```
<div>
    <merch-card image="http://www.adobe.com/image">
    ...
    </merch-card>
</div>
```

#### Merch-card web component
Provides the following Consonant merch card implementations

- special-offers
- segment
- plans
- catalog
- inline-heading
- image

#### Merch-cards web component
`merch-card-collection` web component is a card collection for merch cards and has the following capabilities and properties

 - [x] Filtering by category
 - [x] Filtering by device type
 - [x] Search by keyword
 - [-] Sort: alphabetical order
 - [x] Sort: natural order
 - [-] Accessibility (keyboard support, aria attributes)
 - [x] Deep linking
 - [x] single_app query parameter support
 - [x] show more button
 - [-] 100% unit test coverage

 ### Development
```
# at the project root run the following commands:

npm install

cd packages/web-components

npm test
```

#### Local
In order to develop and preview live `merch-card-collection` web component, after running `npm test`, open `http://localhost:2023`, navigate to `merch-card-collection.test.html` and type `skipTests()` in the js console and enter.<br />
The browser will stop running tests on page load in the current tab.<br />
To reset tests, type `resetTests()` and enter in the js console.<br />

To preview all available 'merch-card' components, open `http://localhost:2023`, navigate to `/test/merch-card.test.html`

Please refer to the main tacocat.js/README.md for more details.


#### On Milo

By default, Milo will load `merch-*.js` from `/libs/deps`<br/>
We will use the Redirector extension for [Chrome](https://chrome.google.com/webstore/detail/redirector/ocgpenflpmgnfapjedencafcfakcekcd)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/redirector/) for redirecting those files to web-test-runner on the port `2023`.<br/>
Please import `./redirector.json` and toggle `Debug commerce web components` rule.

### Build
run
```
npm run build
```
Checkin the files updated in ~/git/milo/libs/deps/mas folder
```

#### Troubleshooting
Please reach out to us in `#tacocat-friends` for any questions.
