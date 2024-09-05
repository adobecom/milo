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

// eslint-disable-next-line no-promise-executor-return
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

describe('countdown-timer', () => {
  it('decorates cdt', async () => {
    const block = document.querySelector('.countdown-timer');
    init(block);
    const cdt = await waitForElement('.countdown-timer');
    expect(cdt).to.exist;

    await sleep(61000);

    cdt.countdownCompleted();

    cdt.remove();
    expect(cdt.isConnected).to.be.false;
  });
});
