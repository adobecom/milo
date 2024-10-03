import { expect } from '@esm-bundle/chai';
import { parseNestedPlaceholders, createContent } from '../../../libs/features/personalization/personalization.js';
import { getConfig } from '../../../libs/utils/utils.js';

const config = getConfig();
config.placeholders = {
  'promo-product-name': 'CC All Apps',
  'promo-header': 'Buy now and save {{promo-discount}}% off {{promo-product-name}}.',
  'promo-discount': '50',
  'promo-description': 'For just {{promo-price}}, get 20+...',
  'promo-price': 'US$49.99',
};
describe('test different values for parseNestedPlaceholders', () => {
  it('should update placeholders', () => {
    parseNestedPlaceholders(config);
    expect(config.placeholders['promo-header']).to.equal('Buy now and save 50% off CC All Apps.');
    expect(config.placeholders['promo-description']).to.equal('For just US$49.99, get 20+...');
  });
});
describe('test createContent', () => {
  const el = document.createElement('div');
  it('append action', () => {
    const newContent = createContent(el, {
      content: '{{promo-discount}}',
      manifestId: false,
      targetManifestId: false,
      action: 'append',
      modifiers: [],
    });
    expect(newContent.innerHTML).to.equal('50');
  });
  it('replace action', () => {
    el.innerHTML = 'Hello World';
    const newContent = createContent(el, {
      content: '{{promo-discount}}',
      manifestId: false,
      targetManifestId: false,
      action: 'replace',
      modifiers: [],
    });
    expect(newContent.innerHTML).to.equal('50');
  });
});
