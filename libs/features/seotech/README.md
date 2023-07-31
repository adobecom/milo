# SEOTECH

Collection of SEO-related features that use the SEOTECH service.
For more details see [SEOTECH API](https://wiki.corp.adobe.com/display/seoteam/SEOTECH+API) (Corp Only).

## Video

Metadata:

- `seotech-video-url`: url for query sent to getVideoObject

This feature selects a video url from the page then queries the SEOTECH service for structured data.
If a valid VideoObject is returned then it is appended to the head of the document as JSON-LD.

Only YouTube is supported at the moment.
We are exploring support of Adobe TV and adhoc video content.
