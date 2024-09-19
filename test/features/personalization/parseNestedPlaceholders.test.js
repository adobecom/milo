import { expect } from '@esm-bundle/chai';
import { parseNestedPlaceholders } from '../../../libs/features/personalization/personalization.js';

const config = {
  placeholders: {
    'promo-product-name': 'CC All Apps',
    'promo-header': 'Buy now and save {{promo-discount}}% off {{promo-product-name}}.',
    'promo-discount': '50',
    'promo-description': 'For just {{promo-price}}, get 20+...',
    'promo-price': 'US$49.99',
  },
};
describe('test different values', () => {
  it('should update placeholders', () => {
    parseNestedPlaceholders(config);
    expect(config.placeholders['promo-header']).to.equal('Buy now and save 50% off CC All Apps.');
    expect(config.placeholders['promo-description']).to.equal('For just US$49.99, get 20+...');
  });
});
