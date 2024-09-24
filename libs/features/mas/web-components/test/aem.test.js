import { expect } from '@esm-bundle/chai';
import { AEM } from '../src/aem.js';

describe('aem.js', () => {
    const aem = new AEM('test');
    const originalFetch = window.fetch;
    describe('method: searchFragment', () => {
        it('should fetch content fragments with multiple calls', async () => {
            window.fetch = async (url) => {
                if (url.includes('cursor1')) {
                    return {
                        ok: true,
                        json: async () => ({
                            items: [
                                {
                                    id: 2,
                                    fields: [{ name: 'variant', value: 'v2' }],
                                },
                            ],
                        }),
                    };
                } else {
                    return {
                        ok: true,
                        json: async () => ({
                            items: [
                                {
                                    id: 1,
                                    fields: [{ name: 'variant', value: 'v1' }],
                                },
                            ],
                            cursor: 'cursor1',
                        }),
                    };
                }
            };

            const result = await aem.searchFragment('some-query');

            const actual = [];

            for await (const items of result) {
              actual.push(...items);
            }

            expect(actual).to.deep.equal([
                { id: 1, fields: [{ name: 'variant', value: 'v1' }] },
                { id: 2, fields: [{ name: 'variant', value: 'v2' }] },
            ]);
        });
    });
});
