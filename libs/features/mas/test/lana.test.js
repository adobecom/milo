import { Log } from '../src/log.js';
import { config, lanaAppender } from '../src/lana.js';
import { mockLana, unmockLana } from './mocks/lana.js';
import { expect } from './utilities.js';

describe('lana', () => {
    let lana;
    const originalHref = window.location.href;

    afterEach(() => {
        unmockLana();
        window.history.replaceState({}, '', originalHref);
    });

    beforeEach(() => {
        lana = mockLana();
    });

    it('calls `window.lana.log` with params', () => {
        Log.reset();
        const { clientId, sampleRate, tags } = config;

        window.history.replaceState({}, '', '/test/page');

        lanaAppender.append({
            level: Log.Level.ERROR,
            message: 'Test',
            namespace: 'test',
            params: [
                {
                    err: new Error('Houston'),
                    fn: window.open,
                    str: 'test',
                },
            ],
            source: 'testModule',
            timestamp: Date.now(),
        });

        expect(lana.log.firstCall.args).to.deep.equal([
            'Test¶page=/test/page¶facts=[{"err":"Houston","fn":"function open","str":"test"}]',
            {
                clientId: 'merch-at-scale',
                delimiter: '¶',
                ignoredProperties: ['analytics', 'literals'],
                serializableTypes: ['Array', 'Object'],
                sampleRate: 1,
                tags: 'consumer,acom,mas',
            },
        ]);
    });
});
