import { Log } from '../src/log.js';
import { Defaults, lanaAppender } from '../src/lana.js';

import { mockLana, unmockLana } from './mocks/lana.js';
import { expect } from './utilities.js';

describe('lana', () => {
    let lana;

    afterEach(() => {
        unmockLana();
    });

    beforeEach(() => {
        lana = mockLana();
    });

    it('calls `window.lana.log` with params', () => {
        const { clientId, sampleRate, tags } = Defaults;
        const { href } = window.location;
        window.history.replaceState({}, '', '/test/page');
        lanaAppender.append({
            level: Log.Level.ERROR,
            message: 'Test',
            namespace: 'test',
            params: [
                { err: new Error('Houston'), fn: window.open, str: 'test' },
            ],
            source: 'testModule',
            timestamp: Date.now(),
        });
        window.history.replaceState({}, '', href);
        expect(lana.log.firstCall.args).to.deep.equal([
            'Test¶page=/test/page¶facts=[{"err":"Houston","fn":"function open","str":"test"}]',
            { clientId, sampleRate, tags },
        ]);
    });
});
