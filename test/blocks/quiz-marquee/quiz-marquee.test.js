import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

window.lana = { log: stub() };

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);

describe('Quiz Marquee (Biz Markie) got what you need', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    const { default: init } = await import('../../../libs/blocks/quiz-marquee/quiz-marquee.js');
    const marquees = document.querySelectorAll('.quiz-marquee');
    marquees.forEach(async (marquee) => {
      await init(marquee, 'quiz-results', 'quiz-result-test');
    });
  });
  it('it has a static copy friend', async () => {
    const copy = await waitForElement('.static');
    expect(copy).to.exist;
  });
  it('it has a dynamic fragmaent friend', async () => {
    const nested = await waitForElement('.nested');
    expect(nested).to.exist;
  });
  it('it has a horizontal rule friend', async () => {
    const hr = await waitForElement('.has-divider');
    expect(hr).to.exist;
  });
});
