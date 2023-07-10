import { Level } from '../src/log.js';
import { defaults, lanaAppender } from '../src/lana.js';

import { mockLana, unmockLana } from './mocks/lana.js';
import { expect } from './utils.js';

describe('lana', () => {
  let lana;

  after(() => {
    unmockLana();
  });

  before(() => {
    lana = mockLana();
  });

  it('calls `window.lana.log` with params', () => {
    const { sampleRate, tags } = defaults;
    const { href } = window.location;
    window.history.replaceState({}, '', '/test/page');
    lanaAppender.append({
      level: Level.error,
      message: 'Test',
      namespace: 'test',
      params: [{ err: new Error('Houston'), fn: window.open, str: 'test' }],
      source: 'testModule',
      timestamp: Date.now(),
    });
    window.history.replaceState({}, '', href);
    expect(lana.log.firstCall.args).to.deep.equal([
      'Test¶page=/test/page¶facts=[{"err":"Houston","fn":"function open","str":"test"}]',
      { sampleRate, tags },
    ]);
  });
});
