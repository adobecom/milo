export async function withAem(originalFetch) {
    return async ({ pathname, searchParams }) => {
        if (/cf\/fragments\/search/.test(pathname)) {
            // TODO add conditional use case.
            return originalFetch(
                '/test/mocks/sites/cf/fragments/search/authorPayload.json',
            );
        } else if (/cf\/fragments/.test(pathname) && searchParams.has('path')) {
            const fragmentId = searchParams.get('fragmentId');
            const item = await originalFetch(
                '/test/mocks/sites/cf/fragments/search/authorPayload.json',
            )
                .then((res) => res.json())
                .then(({ items }) => items.find((item) => item.id === id));
            if (item) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve({ items: [item] }),
                });
            }
        }
        return false;
    };
}
