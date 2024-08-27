export const priceLiteralsURL =
    'https://www.adobe.com/federal/commerce/price-literals.json';

export async function withLiterals(originalFetch) {
    const literals = await originalFetch('/test/mocks/literals.json').then(
        (res) => res.json(),
    );
    return async ({ href }) => {
        if (href === priceLiteralsURL) {
            return Promise.resolve({
                ok: true,
                json: async () => literals,
            });
        }
        return false;
    };
}
