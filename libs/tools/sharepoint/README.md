# SharePoint
The SharePoint tool provides a rich foundation to use common SharePoint features. This feature-set spans the Microsoft Graph API as well as the legacy SharePoint API.

## Usage

### login.js

Login to SharePoint with minimal configuration.

```js
import login from './tools/sharepoint/login.js';

const scopes = ['files.readwrite', 'sites.readwrite.all'];
const telemetry = { application: { appName: 'Adobe Version History' } };
await login({ scopes, telemetry });
```

This will open a separate pop up window to prompt the user to login. Often times this popup will be blocked and you will need to provide a fallbck to open the pop up with user intervention. Please see Advanced Usage below for more details.

Once logged in, login.js will set properties in state.js within the SharePoint tool. It may be helpful to know about the logged in user in your application. You can do so using state.js.

### state.js

```js
import { account } from './tools/sharepoint/state.js';

if (!account.value.username) {
  console.log('Please login');
} else {
  console.log(account.value.username);
}
```

### msal.js
msal.js is a a thin wrapper around the MS Authentication Library (msal). It provides the ability to talk to both the MS Graph API as well as the SharePoint API using the current authenticated user. Typically, you should only need the `getReqOptions` function in your application.

```js
import getServiceConfig from '../../utils/service-config.js';
import { getReqOptions } from './tools/sharepoint/msal.js';

const { sharepoint } = await getServiceConfig(origin);
const { site } = sharepoint;
const driveId = sharepoint.driveId ? `drives/${sharepoint.driveId}` : 'drive';
const reqOpts = getReqOptions();
const itemId = getItemId();
const resp = await fetch(`${site}/${driveId}/items/${itemId}`, reqOpts);
```
The above example is a basic `GET` request for an item. Based on the API needs, you can pass a body, method, accept, and contentType. Please see the internal documentation of `getReqOptions` for up-to-date information on how to use this function.

## Advanced Usage

### login.js

```js
import login from './tools/sharepoint/login.js';

const scopes = ['files.readwrite', 'sites.readwrite.all'];
const telemetry = { application: { appName: 'Adobe Version History' } };

try {
  await login(scopes, telemetry);
} catch {
  // show a button that can open the pop up
}
```
