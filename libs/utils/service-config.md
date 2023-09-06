# Service Config

The Milo service config stores integration details with 3rd party services. These services are typically only author facing. Some examples are: Microsoft Graph, SharePoint, GLaaS, etc.

## Content location
The content of this file is stored in `{your-project-folder}/.milo/config.xlsx` on SharePoint or Google Drive.

## Supported environments

* `prod`
* `stage`
* `local`

## Environment inheritance
Service config comes with an inheritance model that will gracefully fallback to a higher-level environment when a value is not found for a given environment.

If there is not a local value, a stage value is used. If there is not a stage value, a prod value is used.

## Formats

### Excel
```
environmentname.servicename.servicetype | value
```

### Javascript

```js
const { sharepoint } = await getServiceConfig(origin);
const { driveId } = sharepoint;
```

Note: In your app's usage, you do not have to make a decision about what environment is currently present. Service config will automatically determine this based on existing Milo env rules or a supplied parameter (see below).

## Usage
The `getServiceConfig` function can take two properties:

1. origin
1. envName

### Origin
By supplying origin, you can determine what site to pull a service config from. This is helpful if you are hosting a tool out of Milo, but want to access to service config of another site (cc--adobecom). If you find that you cannot host out of the default location (./milo/config.json), you can even supply a full base path instead of a simple origin.

### envName
There may be times where you want to override the inferred environment. This is helpful for testing stage integrations with production content. Think of sending a sample localization project to a stage server without interupting the normal production flow of content. You may respond to a property set in a query param or an excel file and pass that to the service config.
