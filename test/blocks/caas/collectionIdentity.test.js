import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import {
  isCollectionIdentityPolicyMiss,
  resetCollectionIdentityNoticesForTesting,
  toCollectionIdentityUrl,
} from '../../../libs/blocks/caas/collectionIdentity.js';

describe('caas collection identity policy', () => {
  beforeEach(() => {
    resetCollectionIdentityNoticesForTesting();
  });

  afterEach(() => {
    document.head.querySelectorAll('meta[name="caas-identity-extensionless-sections"]')
      .forEach((el) => el.remove());
  });

  const setSections = (content) => {
    const meta = document.createElement('meta');
    meta.name = 'caas-identity-extensionless-sections';
    meta.content = content;
    document.head.append(meta);
  };

  describe('toCollectionIdentityUrl', () => {
    it('forces .html with the flag on and nothing configured', () => {
      // A site that has not declared any extensionless section gets the
      // unqualified policy -- the carve-out is never assumed on its behalf.
      expect(toCollectionIdentityUrl('https://business.adobe.com/blog/x', 'true'))
        .to.equal('business.adobe.com/blog/x.html');
    });

    it('leaves a configured section bare, wherever it sits in the path', () => {
      setSections('blog');
      ['/blog/x', '/de/blog/x', '/langstore/en/blog/x', '/products/blog/x'].forEach((path) => {
        expect(toCollectionIdentityUrl(`business.adobe.com${path}`, 'true'), path)
          .to.equal(`business.adobe.com${path}`);
      });
    });

    it('converges a legacy .html blog link onto the bare id', () => {
      setSections('blog');
      expect(toCollectionIdentityUrl('business.adobe.com/blog/x.html', 'true'))
        .to.equal('business.adobe.com/blog/x');
    });

    it('does not exempt a segment that merely contains the section name', () => {
      setSections('blog');
      expect(toCollectionIdentityUrl('business.adobe.com/products/blogging-tool', 'true'))
        .to.equal('business.adobe.com/products/blogging-tool.html');
    });

    it('reads a comma list, trimmed and case-insensitively', () => {
      setSections(' Blog , news ');
      expect(toCollectionIdentityUrl('business.adobe.com/news/x', 'true'))
        .to.equal('business.adobe.com/news/x');
    });

    it('still only strips the scheme when the page flag is off', () => {
      setSections('blog');
      expect(toCollectionIdentityUrl('https://business.adobe.com/resources/x', 'false'))
        .to.equal('business.adobe.com/resources/x');
    });
  });

  describe('isCollectionIdentityPolicyMiss', () => {
    it('does not report a link in a configured section', () => {
      // The warning latches after one call, so a false positive here consumes
      // the page's only slot and silences a real miss elsewhere on it.
      setSections('blog');
      expect(isCollectionIdentityPolicyMiss('business.adobe.com/blog/x', 'false')).to.be.false;
    });

    it('reports that same link when the site configured no sections', () => {
      expect(isCollectionIdentityPolicyMiss('business.adobe.com/blog/x', 'false')).to.be.true;
    });

    it('reports an in-scope extensionless link while the policy is off', () => {
      expect(isCollectionIdentityPolicyMiss('business.adobe.com/resources/x', 'false')).to.be.true;
    });

    it('stays quiet once the policy is enabled', () => {
      expect(isCollectionIdentityPolicyMiss('business.adobe.com/resources/x', 'true')).to.be.false;
    });
  });

  describe('a misauthored section list is reported, not silently ignored', () => {
    // This runtime is the one where an unusable entry is otherwise completely
    // unobservable. The flag is ON, so the identity-miss warning cannot fire --
    // it is gated on the flag being off -- and the publisher page that would
    // have warned is a DIFFERENT page from this collection. Without this the
    // author sees nothing while every card in the section stops resolving.
    let lanaStub;

    beforeEach(() => {
      lanaStub = stub();
      window.lana = { log: lanaStub };
    });

    it('reports an entry that names a glob rather than a segment', () => {
      setSections('blog/*');
      toCollectionIdentityUrl('business.adobe.com/blog/x', 'true');
      expect(lanaStub.calledOnce).to.be.true;
      expect(lanaStub.firstCall.args[0]).to.contain('blog/*');
      // error, not warning: here a bad entry drops cards out of a live
      // collection rather than merely minting a duplicate id.
      expect(lanaStub.firstCall.args[1].severity).to.equal('error');
    });

    it('reports an entry that names a host or a path', () => {
      setSections('business.adobe.com/blog');
      toCollectionIdentityUrl('business.adobe.com/blog/x', 'true');
      expect(lanaStub.calledOnce).to.be.true;
    });

    it('stays silent for a well-formed list, and for no list at all', () => {
      setSections('blog');
      toCollectionIdentityUrl('business.adobe.com/blog/x', 'true');
      toCollectionIdentityUrl('business.adobe.com/resources/x', 'true');
      expect(lanaStub.called).to.be.false;
    });

    it('reports once per page, not once per card reference', () => {
      // A collection resolves dozens of references through this path.
      setSections('blog/*');
      toCollectionIdentityUrl('business.adobe.com/blog/a', 'true');
      toCollectionIdentityUrl('business.adobe.com/blog/b', 'true');
      toCollectionIdentityUrl('business.adobe.com/blog/c', 'true');
      expect(lanaStub.callCount).to.equal(1);
    });
  });
});
