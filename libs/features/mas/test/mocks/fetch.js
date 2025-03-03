import sinon from 'sinon';

export async function mockFetch(...stubs) {
    const originalFetch = fetch;
    const mocks = await Promise.all(stubs.map((stub) => stub(originalFetch)));
    mocks.forEach((mock) => {
        mock.count = 0;
    });
    const stub = sinon.stub().callsFake(async (...args) => {
        const { href, pathname, searchParams } = new URL(
            String(args[0]),
            window.location,
        );

        // Extract headers from the request options
        const headers = args[1]?.headers || {};

        let found = false;
        for await (const mock of mocks) {
            found = await mock({ href, pathname, searchParams, headers });
            if (found === false) continue;
            mock.count++;
            break;
        }
        if (found === false) {
            return originalFetch(...args);
        }
        return found;
    });
    window.fetch = stub;
    return mocks;
}
