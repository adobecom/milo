import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { waitForElement, delay } from '../../helpers/waitfor.js';
import { getConfig, updateConfig, loadArea } from '../../../libs/utils/utils.js';

describe('Review Component for JP', () => {
  beforeEach(async () => {
    const config = getConfig();
    updateConfig({ ...config, base: '/libs', codeRoot: '/libs', locale: { ietf: 'ja-JP', tk: '', prefix: 'jp' } });
    document.head.innerHTML = await readFile({ path: './mocks/head.html' });
    document.body.innerHTML = await readFile({ path: './mocks/body_jp.html' });
    window.s_adobe = { visitor: { getMarketingCloudVisitorID: () => 'abcd' } };
    sinon.stub(window, 'fetch').resolves(
      new Response(JSON.stringify({
        total: 4,
        offset: 0,
        limit: 4,
        data: [
          { country: 'all', total: '17', average: '3.5' },
          { country: 'en', total: '6', average: '3.3' },
          { country: 'fr', total: '3', average: '3.3' },
          { country: 'de', total: '3', average: '3.3' },
        ],
        ':type': 'sheet',
      }), {
        status: 200,
        headers: { 'Content-type': 'application/json' },
      }),
    );
    await loadArea();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should show JP text correctly', async () => {
    const review = await waitForElement('.hlx-ReviewWrapper');
    const ratingInputs = review.querySelectorAll('.hlx-Review-ratingFields input');
    await delay(125);
    await ratingInputs[2].dispatchEvent(new Event('click'));
    await delay(125);
    const title = review.querySelector('.hlx-reviewTitle');
    expect(title.textContent).to.equal('私たちのツールをぜひ評価してください。いただいた評価が開発チームの原動力となります。');
    const vote = review.querySelector('.hlx-ReviewStats');
    expect(vote.textContent).to.equal('3.5/5-17 件の評価');
  });
});
