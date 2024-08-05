export async function withAem(originalFetch) {
    return async ({ pathname }) => {
        if (/cf\/fragments\/search/.test(pathname)) {
            // TODO add conditional use case.
            return originalFetch(
                '/test/mocks/sites/cf/fragments/search/default.json',
            );
        }
        return false;
    };
}
