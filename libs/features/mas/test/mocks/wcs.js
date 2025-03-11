import { HEADER_X_REQUEST_ID } from '../../src/constants.js';

export async function withWcs(originalFetch) {
    const offers = JSON.parse(
        await originalFetch('/test/mocks/offers.json').then((r) => r.text()),
    );
    return async ({ pathname, searchParams, headers }) => {
        // mock Wcs responses
        if (pathname.endsWith('/web_commerce_artifact')) {
            const language = searchParams.get('language').toLowerCase();
            const buckets = searchParams
                .get('offer_selector_ids')
                .split(',')
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
                    if (name === HEADER_X_REQUEST_ID && requestId) {
                        return requestId;
                    }
                    return null;
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
