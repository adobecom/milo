# Bulk Preview and Publish

Tool to bulk preview and publish URLs:
https://main--milo--adobecom.hlx.page/tools/bulk-publish

## Content Contract

```
| bulk-publish                                                                   |
|--------------------------------------------------------------------------------|
|                                                                                |

| metadata                                                                       |
|--------------------------------------------------------------------------------|
| IMS sign in         | off                                                      |
| header              | off                                                      |
| footer              | off                                                      |
| martech             | off                                                      |

```

## Features

- Displays the status for each URL
- Reports the overall status in Sharepoint/milo/tools/bulk-publish/report.xlsx
- Supports enabling/disabling IMS sign-in
- Supports defining authorised users in Sharepoint/milo/tools/bulk-publish/config.xlsx
- Supports defining supported sites in Sharepoint/milo/tools/bulk-publish/config.xlsx
- Supports resuming the bulk process after a browser refresh
- Detects and displays duplicate URLs
- Persists URLs between browser reloads
- Limits to a maximum batch of 1000 URLs
- Throttles 100 ms between each single bulk action
- Times out the single bulk action after 5 s


