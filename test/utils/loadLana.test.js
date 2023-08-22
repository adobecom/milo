import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor } from '../helpers/waitfor.js';
import { loadLana } from '../../libs/utils/utils.js';

describe('Utils loadLana', () => {
  it('Loads lana.js upon calling lana.log the first time', async () => {
    expect(window.lana?.log).not.to.exist;
    loadLana();
    expect(window.lana.log).to.exist;

    const initialLana = window.lana.log;
    sinon.spy(console, 'log');
    await window.lana.log('test', { clientId: 'myclient', sampleRate: 0 });
    await waitFor(() => initialLana !== window.lana.log);

    expect(window.lana.options).to.exist;
    expect(console.log.args[0][0]).to.equal('LANA Msg: ');
    expect(console.log.args[0][1]).to.equal('test');
    console.log.restore();

    sinon.spy(console, 'log');
    await window.lana.log('test2', { clientId: 'myclient', sampleRate: 0 });
    expect(console.log.args[0][0]).to.equal('LANA Msg: ');
    expect(console.log.args[0][1]).to.equal('test2');
    console.log.restore();
  });
});
