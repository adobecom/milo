import { expect } from '@esm-bundle/chai';
import { canServeManifest } from '../../../libs/features/personalization/personalization.js';

describe('canServeManifest', () => {
  it('should return true if the action is core services', () => {
    const result = canServeManifest('core services', null, { configuration: { performance: false, advertising: false } });
    expect(result).to.be.true;
  });
  it('should return true if the source is promo', () => {
    const result = canServeManifest(null, ['promo'], { configuration: { performance: false, advertising: false } });
    expect(result).to.be.true;
  });
  it('should return true if the action is non-marketing and performance is true', () => {
    const result = canServeManifest('non-marketing', null, { configuration: { performance: true, advertising: false } });
    expect(result).to.be.true;
  });
  it('should return false if the action is non-marketing and performance is false', () => {
    const result = canServeManifest('non-marketing', null, { configuration: { performance: false, advertising: true } });
    expect(result).to.be.false;
  });
  it('should return true if the action is null and advertising is true', () => {
    const result = canServeManifest(
      null,
      null,
      { configuration: { performance: false, advertising: true } },
    );
    expect(result).to.be.true;
  });
  it('should return false if the action is null and advertising is false', () => {
    const result = canServeManifest(
      null,
      null,
      { configuration: { performance: true, advertising: false } },
    );
    expect(result).to.be.false;
  });
  it('should return true if the action is marketing and advertising is true', () => {
    const result = canServeManifest('marketing', null, { configuration: { performance: false, advertising: true } });
    expect(result).to.be.true;
  });
  it('should return false if the action is marketing and advertising is false', () => {
    const result = canServeManifest('marketing', null, { configuration: { performance: true, advertising: false } });
    expect(result).to.be.false;
  });
});
