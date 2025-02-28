import { HEADER_X_REQUEST_ID } from "../../src/constants.js";

export async function withAem(originalFetch) {
    return async ({ pathname, headers }) => {
        const isPublish = /\/sites\/fragments\//.test(pathname);
        const isAuthor = /cf\/fragments\//.test(pathname);
        if (isPublish || isAuthor) {
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

            const fragmentId = pathname.split('/').pop();
            if (fragmentId === 'notfound') {
                return Promise.resolve({
                    ok: false,
                    status: 404,
                    statusText: 'Fragment not found',
                    headers: responseHeaders,
                });
            }
            return await originalFetch(
                isAuthor
                    ? `/test/mocks/sites/cf/fragments/${fragmentId}.json`
                    : `/test/mocks/sites/fragments/${fragmentId}.json`,
            ).then((res) => {
                if (res.ok) return res;
                throw new Error(
                    `Failed to get fragment: ${res.status} ${res.statusText}`,
                );
            });
        }
        return false;
    };
}
