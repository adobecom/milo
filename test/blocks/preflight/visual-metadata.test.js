import { expect } from '@esm-bundle/chai';
import { addAssetMetadata, displayPreflightVisuals } from '../../../libs/blocks/preflight/visual-metadata.js';

describe('preflight visual-metadata', () => {
  const created = [];
  const mount = (html) => {
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    document.body.append(wrap);
    created.push(wrap);
    return wrap;
  };

  afterEach(() => {
    while (created.length) created.pop().remove();
    document.body.classList.remove('preflight-assets-analysis');
  });

  describe('addAssetMetadata', () => {
    it('adds a "correct" size entry for a valid image', () => {
      const wrap = mount('<picture><img></picture>');
      const img = wrap.querySelector('img');
      addAssetMetadata(img, { hasMismatch: false, isAboveFold: false, recommendedDimensions: '800x600', type: 'image' });
      const meta = wrap.querySelector('.asset-meta');
      expect(meta).to.exist;
      expect(meta.querySelector('.asset-meta-entry').textContent).to.equal('Size: correct');
      expect(meta.querySelector('.is-valid')).to.exist;
    });

    it('flags a too-small image with the recommended dimensions', () => {
      const wrap = mount('<picture><img></picture>');
      addAssetMetadata(wrap.querySelector('img'), { hasMismatch: true, isAboveFold: false, recommendedDimensions: '1200x900', type: 'image' });
      const entry = wrap.querySelector('.asset-meta-entry');
      expect(entry.textContent).to.contain('too small, use > 1200x900');
      expect(entry.classList.contains('is-invalid')).to.be.true;
    });

    it('marks an above-the-fold mismatch as CRITICAL', () => {
      const wrap = mount('<picture><img></picture>');
      addAssetMetadata(wrap.querySelector('img'), { hasMismatch: true, isAboveFold: true, recommendedDimensions: '1200x900', type: 'image' });
      const entry = wrap.querySelector('.asset-meta-entry');
      expect(entry.textContent).to.contain('CRITICAL');
      expect(entry.classList.contains('above-fold-critical')).to.be.true;
    });

    it('adds a title entry for mpc assets with and without a title', () => {
      const withTitle = mount('<div class="milo-video"><iframe title="My Video"></iframe></div>');
      addAssetMetadata(withTitle.querySelector('iframe'), { hasMismatch: false, type: 'mpc' });
      expect(withTitle.querySelector('.asset-meta').textContent).to.contain('Title: My Video');

      const noTitle = mount('<div class="milo-video"><iframe></iframe></div>');
      addAssetMetadata(noTitle.querySelector('iframe'), { hasMismatch: false, type: 'mpc' });
      const entries = noTitle.querySelectorAll('.asset-meta-entry');
      expect(entries[entries.length - 1].textContent).to.equal('Title: no title');
      expect(entries[entries.length - 1].classList.contains('is-invalid')).to.be.true;
    });

    it('resolves the video-holder parent for video assets', () => {
      const wrap = mount('<div class="video-holder"><video></video></div>');
      addAssetMetadata(wrap.querySelector('video'), { hasMismatch: false, type: 'video' });
      expect(wrap.querySelector('.video-holder > .asset-meta')).to.exist;
    });

    it('reuses an existing .asset-meta container', () => {
      const wrap = mount('<picture><img></picture>');
      const img = wrap.querySelector('img');
      addAssetMetadata(img, { hasMismatch: false, type: 'image' });
      addAssetMetadata(img, { hasMismatch: true, type: 'image' });
      expect(wrap.querySelectorAll('.asset-meta')).to.have.lengthOf(1);
      expect(wrap.querySelectorAll('.asset-meta-entry')).to.have.lengthOf(2);
    });
  });

  describe('displayPreflightVisuals', () => {
    it('does nothing for an empty asset list', () => {
      displayPreflightVisuals([]);
      expect(document.body.classList.contains('preflight-assets-analysis')).to.be.false;
    });

    it('marks the body and decorates each asset, skipping entries without an asset', () => {
      const wrap = mount('<picture><img></picture>');
      const img = wrap.querySelector('img');
      displayPreflightVisuals([
        { asset: img, hasMismatch: false, type: 'image' },
        { hasMismatch: true, type: 'image' },
      ]);
      expect(document.body.classList.contains('preflight-assets-analysis')).to.be.true;
      expect(wrap.querySelector('.asset-meta-entry')).to.exist;
    });
  });
});
