import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import sendHelixData from '../../../../libs/blocks/review/utils/sendHelixData.js';

describe('sendHelixData Util', () => {
  beforeEach(() => {
    sinon.spy(window, 'fetch');
  });
  it('could send a POST call', () => {
    const input = {
      comment: 'comment',
      lang: 'en-us',
      rating: '2',
      postUrl: 'https://main--helixdemo--nkthakur48.hlx.page/data/review',
      visitorId: 'abcd',
    };
    sendHelixData(input);
    expect(window.fetch.called).to.be.true;
  });
});
