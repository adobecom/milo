export async function withAem(originalFetch) {
    return async ({ pathname }) => {
        const isPublish = /\/sites\/fragments\//.test(pathname);
        const isAuthor = /cf\/fragments\//.test(pathname);
        if (isPublish || isAuthor) {
            const fragmentId = pathname.split('/').pop();
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
