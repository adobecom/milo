import { expect } from '@esm-bundle/chai';
import { getLocale, setConfig } from '../../../libs/utils/utils.js';
import { waitForElement } from '../../helpers/waitfor.js';
import { readMockText } from '../merch/mocks/fetch.js';

const { default: init } = await import('../../../libs/blocks/countdown-timer/countdown-timer.js');

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};

setConfig(config);

describe('countdown-timer', () => {
  it('decorates cdt', async () => {
    document.body.innerHTML = await readMockText('/test/blocks/countdown-timer/mocks/cdt_ok.html');
    init(document.querySelector('.countdown-timer'));
    const cdt = await waitForElement('.countdown-timer');
    expect(cdt).to.exist;

    expect(cdt.isConnected).to.be.true;
    cdt.timeRangesEpoch = [1725599876000, 1914901881000];
    cdt.countdownUpdate();
    expect(cdt.isVisible).to.be.true;

    cdt.timeRangesEpoch = [1725599876000, 0];
    cdt.countdownUpdate();
    expect(cdt.isVisible).to.be.false;

    cdt.countdownCompleted();
    expect(cdt.isVisible).to.be.false;

    cdt.remove();
    expect(cdt.isConnected).to.be.false;
  });

  it('decorates cdt with no timeRangesEpoch', async () => {
    document.body.innerHTML = await readMockText('/test/blocks/countdown-timer/mocks/cdt_error.html');
    init(document.querySelector('.countdown-timer'));
    expect(document.querySelector('.countdown-timer')).to.not.exist;
  });
});
