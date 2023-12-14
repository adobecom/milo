import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';

const { CheckoutWorkflow, CheckoutWorkflowStep } = await import('../../../libs/deps/commerce.js');
const { DEFAULT_CTA_TEXT, createLinkMarkup } = await import('../../../libs/blocks/ost/ost.js');

const data = await readFile({ path: './mocks/wcs-artifacts-mock.json' });
const { perpM2M } = JSON.parse(data);
const defaults = {
  checkoutWorkflow: 'UCv3',
  checkoutWorkflowStep: 'email',
};
const osi = 'cea462e983f649bca2293325c9894bdd';
const promo = 'test-promo';
const texts = {
  buy: DEFAULT_CTA_TEXT,
  try: 'free-trial',
};
const types = {
  checkoutUrl: 'checkoutUrl',
  price: 'price',
  opticalPrice: 'opticalPrice',
};

function assertLink(link, offer, params, text = texts.buy) {
  const { searchParams } = new URL(link.href);
  Object.entries(params).forEach(([key, value]) => {
    expect(searchParams.get(key)).to.equal(String(value));
  });
  if (params.type === types.checkoutUrl) {
    expect(searchParams.get('text')).to.equal(text);
    expect(link.text).to.equal(`CTA {{${text}}}`);
  } else {
    expect(link.text).to.equal(`PRICE - ${offer.planType} - ${offer.name}`);
  }
}

function createLink(params = {}) {
  return createLinkMarkup(
    defaults,
    params.osi ?? osi,
    params.type,
    perpM2M,
    params,
    params.promo,
  );
}

describe('function "createLinkMarkup"', () => {
  describe('creates "cta" link', () => {
    const type = types.checkoutUrl;

    it('with default params', async () => {
      const link = createLink({ type });
      assertLink(link, perpM2M, { osi, type });
    });

    it('with promo and custom text', async () => {
      const ctaText = texts.try;
      const link = createLink({ ctaText, promo, type });
      assertLink(link, perpM2M, { osi, promo, type }, ctaText);
    });

    it('to UCv2 workflow', async () => {
      const workflow = CheckoutWorkflow.V2;
      const workflowStep = CheckoutWorkflowStep.CHECKOUT_EMAIL;
      const link = createLink({ type, workflow, workflowStep });
      assertLink(link, perpM2M, { osi, type, workflow, workflowStep });
    });
  });

  describe('creates "price" link', () => {
    const type = types.price;

    it('with default params', async () => {
      const link = createLink({ type });
      assertLink(link, perpM2M, { osi, type });
    });

    it('with custom options', async () => {
      const displayRecurrence = true;
      const displayPerUnit = true;
      const displayTax = true;
      const forceTaxExclusive = true;
      const link = createLink({
        displayRecurrence,
        displayPerUnit,
        displayTax,
        forceTaxExclusive,
        type,
      });
      assertLink(link, perpM2M, {
        term: displayRecurrence,
        seat: displayPerUnit,
        tax: displayTax,
        exclusive: forceTaxExclusive,
        osi,
        type,
      });
    });
  });
});
