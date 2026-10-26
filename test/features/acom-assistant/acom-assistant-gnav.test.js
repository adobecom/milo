import { expect } from '@esm-bundle/chai';
import { getAcomAssistantGnavFabState } from '../../../libs/features/acom-assistant-gnav.js';

describe('getAcomAssistantGnavFabState', () => {
  let meta;

  beforeEach(() => {
    meta = document.createElement('meta');
    meta.name = 'gnav-brand-concierge-state';
  });

  afterEach(() => meta.remove());

  const setState = (content) => {
    meta.content = content;
    document.head.append(meta);
  };

  it('is undefined without metadata', () => {
    expect(getAcomAssistantGnavFabState()).to.be.undefined;
  });

  it('returns normalized collapsed and hidden values', () => {
    setState(' Collapsed ');
    expect(getAcomAssistantGnavFabState()).to.equal('collapsed');
    setState('HIDDEN');
    expect(getAcomAssistantGnavFabState()).to.equal('hidden');
  });

  it('is undefined for normal, empty or unknown values', () => {
    for (const value of ['normal', '', 'minimized']) {
      setState(value);
      expect(getAcomAssistantGnavFabState()).to.be.undefined;
    }
  });
});
