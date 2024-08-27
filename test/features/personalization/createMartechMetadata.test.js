import { expect } from '@esm-bundle/chai';
import { createMartechMetadata } from '../../../libs/features/personalization/personalization.js';
import placeholders from './mocks/placeholders.js';
import newPlaceholders from './mocks/placeholders-new.js';

const config = {
  locale: { ietf: 'fr-fr' },
  mep: {},
};

// Note that the manifestPath doesn't matter as we stub the fetch
describe('replace action', () => {
  it('testing create martech metadata output', async () => {
    expect(config.mep).to.deep.equal({});

    await createMartechMetadata(placeholders, config, 'fr');
    expect(config.mep.analyticLocalization).to.deep.equal({
      'value1 fr': 'value1 en us',
      'value2 fr': 'value2 en us',
      'bonjour fr': 'Hello en us',
      'buy now fr': 'buy now en us',
      'try now fr': 'try now en us',
    });
    await createMartechMetadata(newPlaceholders, config, 'fr');
    expect(config.mep.analyticLocalization).to.deep.equal({
      'new fr': 'new en us',
      'value1 fr': 'value1 en us',
      'value2 fr': 'new2 en us',
      'bonjour fr': 'Hello en us',
      'buy now fr': 'buy now en us',
      'try now fr': 'try now en us',
    });
  });
});
