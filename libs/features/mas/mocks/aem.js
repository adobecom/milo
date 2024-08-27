export async function withAem(originalFetch) {
    return async ({ pathname, searchParams }) => {
        if (/cf\/fragments\/search/.test(pathname)) {
            // TODO add conditional use case.
            return originalFetch(
                '/test/mocks/sites/cf/fragments/search/default.json',
            );
        } else if (/cf\/fragments/.test(pathname) && searchParams.has('path')) {
            const path = searchParams.get('path');
            const item = await originalFetch(
                '/test/mocks/sites/cf/fragments/search/default.json',
            )
                .then((res) => res.json())
                .then(({ items }) => items.find((item) => item.path === path));
            if (item) {
                return Promise.resolve({
                    json: () => Promise.resolve({ items: [item] }),
                });
            }
        }
        return false;
    };
}
