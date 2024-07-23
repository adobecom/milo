# Merch At Scale
This is a library of features related to Merch At Scale that includes web components providing merchandising content to various surfaces such as adobe.com. For more details please visit: https://github.com/adobecom/mas

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Local development
```
npm run build
aem up
```

Refer to the corresponding README.md under any of the packages:
* commerce - contains generic commerce-related logic, 'price' and 'checkout-link' web components
* web-components - merch-card, merch-offer-selector and other web components
* studio - M@S Studio for creating, updating and publishing merch fragments

# Pre push hook
Before each push 'npm run build' is triggered.
1. It will build the artifacts in the /libs folder
2. If any of the artifacts have an update the hook will stage the changes and commit
3. If there are unstaged/uncommitted changes the hook will prevent the push

There is no need to run 'npm run build' manually, but if you run it and commit - no issue (then hook won't do an additional commit).

# Consumption of artifacts in Milo
Please run 'npm run build:milo'
```
npm run build:milo
```
Copy required artifacts from 'milo-libs' folder to milo/libs/deps.

#### Troubleshooting
Please reach out to us in `#tacocat-friends` for any questions.
