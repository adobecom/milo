# SEOTECH

Collection of SEO-related features that use the SEOTECH service.
See [structured-data](https://milo.adobe.com/docs/authoring/structured-data) for authoring documentation including examples.
See [SEOTECH Wiki](https://wiki.corp.adobe.com/display/seoteam/SEOTECH) for documentation regarding the service.

## Video

This feature selects a video url from the page then queries the SEOTECH service for structured data.
If a valid VideoObject is returned then it is appended to the head of the document as JSON-LD.

Metadata Properties:

- `seotech-video-url`: url for query sent to /getVideoObject

Video Platforms:

- YouTube: Supported
- Adobe TV: WIP
- BYO HTML5: TBD

See [video-metadata](../../blocks/video-metadata/) if you need to define a specific VideoObject on your page.

## Structured Data

This feature queries the SEOTECH service for structured data that should be added to the page.

Metadata Properties:

- `seotech-structured-data`: `on` to enable SEOTECH lookup
- `seotech-sheet-url`: url of Franklin Spreadsheet JSON (Optional)

You can also specify `seotech-sheet-url` as a query parameter.
Otherwise SEOTECH will search for _/structured-data.json_ at the root of the current page.

See [seotech page](https://git.corp.adobe.com/pages/wcms/seotech/) (Corp Only) for list of supported structured data types.
