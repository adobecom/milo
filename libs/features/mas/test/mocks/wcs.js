import { HEADER_X_REQUEST_ID } from '../../src/constants.js';
import { FETCH_INFO_HEADERS } from '../../src/utilities.js';

export async function withWcs(originalFetch) {
    const offers = JSON.parse(
        await originalFetch('/test/mocks/offers.json').then((r) => r.text()),
    );
    const callCountsByOsi = {};

    return async ({ pathname, searchParams, headers }) => {
        // mock Wcs responses
        if (
            pathname.endsWith('/web_commerce_artifact') ||
            pathname.endsWith('/web_commerce_artifact_stage')
        ) {
            const osi = searchParams.get('offer_selector_ids');
            // Check for network error trigger
            if (osi === 'network-error') {
                return Promise.reject(new TypeError('Failed to fetch')); // Simulate network error
            }

            const language = searchParams.get('language')?.toLowerCase() || '';
            const buckets = osi
                .split(',') // wcs.js doesn't support multiple osis any more
                .map((osi) =>
                    offers[`${osi}-${language}`]?.map((offer) => ({
                        ...offer,
                        offerSelectorIds: [osi],
                    })),
                );

            // Get the request ID from the incoming request headers
            const requestId = headers?.[HEADER_X_REQUEST_ID];

            // Create headers object for response
            const responseHeaders = {
                get: (name) => {
                    switch (name) {
                        case HEADER_X_REQUEST_ID:
                            if (requestId) {
                                return requestId;
                            }
                            break;
                        case FETCH_INFO_HEADERS.serverTiming:
                            return 'cdn-cache; desc=MISS, edge; dur=12, origin; dur=427, sis; desc=0, ak_p; desc="1748272635433_390603879_647362112_45054_10750_42_0_219";dur=1';
                        default:
                            return undefined;
                    }
                },
            };

            // 404 if any of requested osis does not exist
            if (buckets.some((bucket) => bucket == null)) {
                return Promise.resolve({
                    ok: false,
                    status: 404,
                    headers: responseHeaders,
                    url: `https://www.adobe.com/${pathname}?${searchParams.toString()}`,
                    json: async () => new Error(),
                    text: async () => 'Some osis were not found',
                });
            }

            if (osi === 'success-after-fail') {
                callCountsByOsi[osi] = (callCountsByOsi[osi] || 0) + 1;
                if (callCountsByOsi[osi] < 4) {
                    // First 3 calls, simulate a failure
                    return Promise.reject(new TypeError('Failed to fetch'));
                }
            }

            // 200, all osis were found
            return Promise.resolve({
                ok: true,
                status: 200,
                headers: responseHeaders,
                url: `https://www.adobe.com/${pathname}?${searchParams.toString()}`,
                json: async () => ({
                    resolvedOffers: buckets.flatMap((array) => array ?? []),
                }),
                text: async () => 'Unexpected error',
            });
        }
        return false;
    };
}
