import { expect } from '@esm-bundle/chai';
import { getConfig } from '../../../libs/utils/utils.js';
import { checkCustomPlaceholders } from '../../../libs/features/personalization/personalization.js';

const values = [
  {
    b: 'This is a string with no placeholders.',
    a: 'This is a string with no placeholders.',
  },
  {
    b: 'This is a string with custom placeholders {{test-placeholder}} and {{marquee-headline}}.',
    a: 'This is a string with custom placeholders value1-us and hello-us.',
  },
  {
    b: 'This is a string with custom placeholders {{test-placeholder}} and {{marquee-headline}}, then the standard placeholder {{buy-now}}.',
    a: 'This is a string with custom placeholders value1-us and hello-us, then the standard placeholder {{buy-now}}.',
  },
];
describe('test different values', () => {
  before(() => {
    // Add custom keys so tests doesn't rely on real data
    const config = getConfig();
    config.placeholders = {
      'test-placeholder': 'value1-us',
      'marquee-headline': 'hello-us',
    };
  });

  values.forEach((value) => {
    it(`should return the expected value for ${value.b}`, async () => {
      const { modifiedSelector, modifiers } = checkCustomPlaceholders(value.b);
      expect(modifiedSelector).to.equal(value.a);
      expect(modifiers).to.deep.equal(value.m || []);
    });
  });
});
