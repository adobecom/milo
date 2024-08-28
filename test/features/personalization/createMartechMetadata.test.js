import { expect } from '@esm-bundle/chai';
import { createMartechMetadata } from '../../../libs/features/personalization/personalization.js';
import placeholders from './mocks/placeholders.js';

const config = {
  locale: { ietf: 'fr-fr' },
  mep: {},
};

// Note that the manifestPath doesn't matter as we stub the fetch
describe('test martech metadata creation', () => {
  beforeEach(() => {
    config.mep = {};
  });
  it('test two non US manifests', async () => {
    expect(config.mep).to.deep.equal({});

    await createMartechMetadata(placeholders.geoTest, config, 'fr');
    expect(config.mep.analyticLocalization).to.deep.equal({
      'value1 fr': 'value1 en us',
      'value2 fr': 'value2 en us',
      'bonjour fr': 'Hello en us',
      'buy now fr': 'buy now en us',
      'try now fr': 'try now en us',
    });
    await createMartechMetadata(placeholders.secondManifestTest, config, 'fr');
    expect(config.mep.analyticLocalization).to.deep.equal({
      'new fr': 'new en us',
      'value1 fr': 'value1 en us',
      'value2 fr': 'new2 en us',
      'bonjour fr': 'Hello en us',
      'buy now fr': 'buy now en us',
      'try now fr': 'try now en us',
    });
  });
  it('test one manifest non US withou en-us keys', async () => {
    await createMartechMetadata(placeholders.keyTest, config, 'fr');
    expect(config.mep.analyticLocalization).to.deep.equal({
      'value1 fr': 'test placeholder',
      'value2 fr': 'test placeholder2',
      'bonjour fr': 'marquee headline',
      'buy now fr': 'marquee hollow',
      'try now fr': 'marquee solid',
    });
  });
  it('test one manifest en-US', async () => {
    config.locale.ietf = 'en-US';
    await createMartechMetadata(placeholders.keyTest, config, 'us');
    expect(config.mep).to.deep.equal({});
  });
});
