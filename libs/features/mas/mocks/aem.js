export async function withAem(originalFetch) {
    return async ({ pathname }) => {
        if (/cf\/fragments\//.test(pathname)) {
            const fragmentId = pathname.split('/').pop();
            const item = await originalFetch(
                '/test/mocks/sites/cf/fragments/search/authorPayload.json',
            )
                .then((res) => res.json())
                .then(({ items }) =>
                    items.find((item) => item.id === fragmentId),
                );
            if (item) {
                return Promise.resolve({
                    ok: true,
                    status: 200,
                    headers: { get: () => ({}) },
                    json: () => Promise.resolve(item),
                });
            }
        }
        return false;
    };
}
