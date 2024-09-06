import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { getLocale, setConfig } from '../../../libs/utils/utils.js';
import { waitForElement } from '../../helpers/waitfor.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const config = {
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: `${window.location.origin}${getLocale(locales).prefix}`,
  locales,
};

setConfig(config);

document.body.innerHTML = await readFile({ path: './mocks/body.html' });
const { default: init } = await import('../../../libs/blocks/countdown-timer/countdown-timer.js');

describe('countdown-timer', () => {
  it('decorates cdt', async () => {
    const block = document.querySelector('.countdown-timer');
    init(block);
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
});
