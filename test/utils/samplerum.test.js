/* eslint-disable no-unused-expressions */
/* global describe it */

import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import sampleRUM from '../../libs/utils/samplerum.js';

describe('SampleRUM', () => {
  it('Collects RUM data', async () => {
    const sendBeacon = sinon.stub(navigator, 'sendBeacon');
    // turn on RUM
    window.history.pushState({}, '', `${window.location.href}&rum=on`);
    delete window.hlx;

    // sends checkpoint beacon
    await sampleRUM('test', { foo: 'bar' });
    expect(sendBeacon.called).to.be.true;
    sendBeacon.resetHistory();

    // sends cwv beacon
    await sampleRUM('cwv', { foo: 'bar' });
    expect(sendBeacon.called).to.be.true;

    // test error handling
    sendBeacon.throws();
    await sampleRUM('error', { foo: 'bar' });

    sendBeacon.restore();
  });
});
