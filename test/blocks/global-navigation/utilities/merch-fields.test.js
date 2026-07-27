import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  resolveMerchCardFields,
  toFragment,
} from '../../../../libs/blocks/global-navigation/utilities/utilities.js';

describe('global navigation merch fields', () => {
  it('resolves inline links and CTAs but not full cards or undecorated links', async () => {
    const content = toFragment`<div>
      <h2>
        <a class="merch-card-autoblock link-block"
          href="https://mas.adobe.com/studio.html#content-type=merch-card&field=ctas%5B1%5D">Nav link</a>
      </h2>
      <p><strong>
        <a class="merch-card-autoblock link-block"
          href="https://mas.adobe.com/studio.html#content-type=merch-card&field=ctas%5B4%5D">CTA</a>
      </strong></p>
      <a class="merch-card-autoblock link-block"
        href="https://mas.adobe.com/studio.html#content-type=merch-card">Full card</a>
      <a href="https://mas.adobe.com/studio.html#content-type=merch-card&field=ctas%5B2%5D">
        Undecorated field
      </a>
    </div>`;
    const loader = sinon.spy(async () => {});

    await resolveMerchCardFields(content, loader);

    expect(loader.callCount).to.equal(2);
    expect(loader.firstCall.args[0].textContent).to.equal('Nav link');
    expect(loader.secondCall.args[0].textContent).to.equal('CTA');
  });
});
