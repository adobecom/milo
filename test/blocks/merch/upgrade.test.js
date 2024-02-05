import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';
import handleUpgradeOffer from '../../../libs/blocks/merch/upgrade.js';

const CTA_PRODUCT_FAMILY = 'CC_ALL_APPS';
const UPGRADE_OFFER = { value: [{ offerId: '632B3ADD940A7FBB7864AA5AD19B8D28' }] };
const ENTITLEMENTS = [
  {
    offer: {
      offer_id: '5F2E4A8FD58D70C8860F51A4DE042E0C',
      product_arrangement: { family: 'ILLUSTRATOR' },
    },
    change_plan_available: true,
  },
];
const config = {
  env: { name: 'prod' },
  placeholders: { 'upgrade-now': 'Upgrade Now' },
};
const EXPECTED_UPGRADE_URL_PROD = 'https://plan.adobe.com/?intent=switch&toOfferId=632B3ADD940A7FBB7864AA5AD19B8D28&fromOffer=5F2E4A8FD58D70C8860F51A4DE042E0C&language=en&surface=ADOBE_COM&ctx=if';
const EXPECTED_UPGRADE_URL_STAGE = 'https://stage.plan.adobe.com/?intent=switch&toOfferId=632B3ADD940A7FBB7864AA5AD19B8D28&fromOffer=5F2E4A8FD58D70C8860F51A4DE042E0C&language=en&surface=ADOBE_COM&ctx=if';

const verifyUrl = (url, expectedUrl) => {
  const parsedUrl = new URL(url);
  const parsedExpectedUrl = new URL(expectedUrl);
  parsedUrl.searchParams.delete('ctxRtUrl');
  expect(parsedUrl.toString()).to.equal(parsedExpectedUrl.toString());
};
describe('handleUpgradeOffer', () => {
  before(async () => {
    setConfig(config);
  });

  it('should return an upgrade action for PROD', async () => {
    const result = await handleUpgradeOffer(CTA_PRODUCT_FAMILY, UPGRADE_OFFER, ENTITLEMENTS);
    expect(result.text).to.equal('Upgrade Now');
    verifyUrl(result.url, EXPECTED_UPGRADE_URL_PROD);
    const { handler } = result;
    expect(handler).to.be.a('function');
  });

  it('should return an upgrade action for STAGE', async () => {
    setConfig(
      {
        ...config,
        env: { name: 'stage' },
      },
    );
    const result = await handleUpgradeOffer(CTA_PRODUCT_FAMILY, UPGRADE_OFFER, ENTITLEMENTS);
    verifyUrl(result.url, EXPECTED_UPGRADE_URL_STAGE);
  });

  it('should return undefined if CTA product family is not in the list of upgrade targets', async () => {
    const ctaPF = 'LIGHTROOM';
    const result = await handleUpgradeOffer(ctaPF, UPGRADE_OFFER, ENTITLEMENTS);
    expect(result).to.equal(undefined);
  });

  it('should return undefined if user is has one of upgrade targets already', async () => {
    const ENTITLEMENTS_WITH_UPGRADE_TARGET = [
      {
        offer: {
          offer_id: '212E4A8FD58D70C8860F51A4DE042E0C',
          product_arrangement: { family: 'CC_ALL_APPS_STOCK_BUNDLE' },
        },
        change_plan_available: true,
      },
    ];

    const result = await handleUpgradeOffer(
      CTA_PRODUCT_FAMILY,
      UPGRADE_OFFER,
      ENTITLEMENTS_WITH_UPGRADE_TARGET,
    );
    expect(result).to.equal(undefined);
  });

  it('should return undefined if no change plan available in entitlements', async () => {
    const ENTITLEMENTS_NO_CP = [
      {
        offer: {
          offer_id: '5F2E4A8FD58D70C8860F51A4DE042E0C',
          product_arrangement: { family: 'ILLUSTRATOR' },
        },
        change_plan_available: false,
      },
    ];
    const result = await handleUpgradeOffer(CTA_PRODUCT_FAMILY, UPGRADE_OFFER, ENTITLEMENTS_NO_CP);
    expect(result).to.equal(undefined);
  });

  it('should return undefined if no entitlement offer is not in upgrade source offers', async () => {
    const ENTITLEMENTS_NO_CP = [
      {
        offer: {
          offer_id: '5F2E4A8FD58D70C8860F51A4DE042E0C',
          product_arrangement: { family: 'INVALID_PRODUCT' },
        },
        change_plan_available: true,
      },
    ];
    const result = await handleUpgradeOffer(CTA_PRODUCT_FAMILY, UPGRADE_OFFER, ENTITLEMENTS_NO_CP);
    expect(result).to.equal(undefined);
  });

  it('should return undefined if failed to build upgrade url', async () => {
    const ENTITLEMENTS_NO_CP = [
      {
        offer: {},
        change_plan_available: true,
      },
    ];
    const result = await handleUpgradeOffer(CTA_PRODUCT_FAMILY, UPGRADE_OFFER, ENTITLEMENTS_NO_CP);
    expect(result).to.equal(undefined);
  });
});
