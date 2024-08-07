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
- Adobe TV: Supported
- BYO HTML5: See "Structured Data"

See [video-metadata](../../blocks/video-metadata/) if you need to define a specific VideoObject on your page.

## Structured Data

This feature queries the SEOTECH service for adhoc structured data that should be added to the page.

Metadata Properties:

- `seotech-structured-data`: `on` to enable SEOTECH lookup

See [Structured Data for Milo](https://wiki.corp.adobe.com/x/YpPwwg) (Corp Only) for complete documentation.
