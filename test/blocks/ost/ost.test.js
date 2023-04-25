import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { createLinkMarkup } from '../../../libs/blocks/ost/ost.js';

const data = await readFile({ path: './mocks/wcs-artifacts-mock.json' });
const { stockOffer } = JSON.parse(data);

const osi = 'A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M';
const offerId = '0133AE34E68F36920F5B33482A251DE7';
const placeholderOptions = {
  workflow: 'UCv2',
  workflowStep: 'email/checkout',
  displayRecurrence: false, // term
  displayPerUnit: true, // seat
  displayTax: true, // tax
  isPerpetual: true,
};
describe('test createLinkMarkup', () => {
  const WINDOW_LOCATION = 'https://main--milo--adobecom.hlx.page';
  const EXPECTED_PRICE_TEXT = `{{PRICE - ${offerId} - Adobe Stock – 1 credit pack}}`;
  const EXPECTED_PRICE_URL = `${WINDOW_LOCATION}/tools/ost?osi=${osi}&offerId=${offerId}&type=price&perp=true&term=false&seat=true&tax=true`;
  const EXPECTED_CTA_TEXT = 'CTA {{buy-now}}';
  const EXPECTED_CTA_URL = `${WINDOW_LOCATION}/tools/ost?osi=${osi}&offerId=${offerId}&type=checkoutUrl&perp=true&text=buy-now&checkoutType=UCv2&workflowStep=email_checkout`;
  const location = {
    protocol: 'https:',
    host: 'main--milo--adobecom.hlx.page',
  };

  it('create a "cta" link', async () => {
    const type = 'checkoutUrl';
    const link = createLinkMarkup(
      osi,
      type,
      stockOffer,
      placeholderOptions,
      location,
    );
    expect(EXPECTED_CTA_TEXT).to.equal(link.text);
    expect(EXPECTED_CTA_URL).to.equal(link.href);
  });

  it('create a "price" link', async () => {
    const type = 'price';
    const link = createLinkMarkup(
      osi,
      type,
      stockOffer,
      placeholderOptions,
      location,
    );
    expect(EXPECTED_PRICE_TEXT).to.be.equal(link.text);
    expect(EXPECTED_PRICE_URL).to.be.equal(link.href);
  });
});
