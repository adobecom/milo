import { HEADER_X_REQUEST_ID } from "../../src/constants.js";

export async function withAem(fetch) {
  const requestCounts = {};
    return async ({ pathname, headers, searchParams }) => {
        if (/\/mas\/io\/fragment/.test(pathname)) {
            // Get the request ID from the incoming request headers
            const requestId = headers?.[HEADER_X_REQUEST_ID];

            // Create headers object for response
            const responseHeaders = {
                get: (name) => {
                    if (name === HEADER_X_REQUEST_ID && requestId) {
                        return requestId;
                    }
                    return null;
                }
            };

            const fragmentId = searchParams.get('id');

            // Track requests for fragment-cc-all-apps2 to simulate failure on second request
            if (fragmentId === 'fragment-cc-all-apps2') {
                requestCounts[fragmentId] = (requestCounts[fragmentId] || 0) + 1;
                // Fail on the second request
                if (requestCounts[fragmentId] > 1) {
                    return Promise.resolve({
                        ok: false,
                        status: 500,
                        url: `${window.location.origin}${pathname}`,
                        statusText: 'Server Error',
                        headers: responseHeaders,
                    });
                }
            }

            if (fragmentId === 'notfound') {
                return Promise.resolve({
                    ok: false,
                    status: 404,
                    url: `${window.location.origin}${pathname}`,
                    statusText: 'Fragment not found',
                    headers: responseHeaders,
                });
            }
            return await fetch(`/test/mocks/sites/fragments/${fragmentId}.json`).then((res) => {
                if (res.ok) return res;
                throw new Error(
                    `Failed to fetch fragment: ${res.status} ${res.statusText}`,
                );
            });
        }
        return false;
    };
}
