import { expect } from '@esm-bundle/chai';
import { AXE_CORE_CONFIG, CUSTOM_CHECKS_CONFIG } from '../../../../libs/blocks/preflight/accessibility/accessibility-config.js';

describe('preflight accessibility config', () => {
  it('AXE_CORE_CONFIG scopes to body and runs only WCAG tags', () => {
    expect(AXE_CORE_CONFIG.include).to.deep.equal([['body']]);
    expect(AXE_CORE_CONFIG.runOnly.type).to.equal('tag');
    expect(AXE_CORE_CONFIG.runOnly.values).to.include('wcag2aa');
    expect(AXE_CORE_CONFIG.exclude.map((s) => s[0])).to.include('#preflight');
  });

  it('CUSTOM_CHECKS_CONFIG lists all five custom checks', () => {
    expect(CUSTOM_CHECKS_CONFIG.checks).to.have.members([
      'altText', 'color-contrast', 'aria-labels', 'video-captions', 'keyboard',
    ]);
  });

  it('both configs exclude preflight-owned decoration nodes', () => {
    [AXE_CORE_CONFIG, CUSTOM_CHECKS_CONFIG].forEach((cfg) => {
      const excluded = cfg.exclude.map((s) => s[0]);
      expect(excluded).to.include('.preflight-decoration');
      expect(excluded).to.include('.asset-meta-entry');
    });
  });
});
