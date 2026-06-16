import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import {
  registerFragment,
  warnDuplicate,
  clearRegistry,
  getRegistry,
  canonicalizeFragmentUrl,
} from '../../libs/utils/fragment-registry.js';

describe('fragment-registry', () => {
  let warnStub;

  beforeEach(() => {
    clearRegistry();
    warnStub = stub(console, 'warn');
  });

  afterEach(() => {
    warnStub.restore();
  });

  // ── canonicalizeFragmentUrl ──────────────────────────────────────────────

  describe('canonicalizeFragmentUrl', () => {
    it('lowercases the pathname', () => {
      const result = canonicalizeFragmentUrl('http://localhost:2000/Fragments/MyFrag');
      expect(result).to.include('/fragments/myfrag');
    });

    it('strips a trailing slash', () => {
      const a = canonicalizeFragmentUrl('http://localhost:2000/fragments/frag/');
      const b = canonicalizeFragmentUrl('http://localhost:2000/fragments/frag');
      expect(a).to.equal(b);
    });

    it('strips query strings', () => {
      const a = canonicalizeFragmentUrl('http://localhost:2000/fragments/frag?foo=bar');
      const b = canonicalizeFragmentUrl('http://localhost:2000/fragments/frag');
      expect(a).to.equal(b);
    });

    it('strips hash fragments', () => {
      const a = canonicalizeFragmentUrl('http://localhost:2000/fragments/frag#section');
      const b = canonicalizeFragmentUrl('http://localhost:2000/fragments/frag');
      expect(a).to.equal(b);
    });

    it('resolves relative paths against window.location', () => {
      const result = canonicalizeFragmentUrl('/fragments/relative-frag');
      expect(result).to.include('/fragments/relative-frag');
    });

    it('treats paths differing only by trailing slash as equal', () => {
      const a = canonicalizeFragmentUrl('/fragments/same/');
      const b = canonicalizeFragmentUrl('/fragments/same');
      expect(a).to.equal(b);
    });
  });

  // ── registerFragment ────────────────────────────────────────────────────

  describe('registerFragment', () => {
    it('returns false on first registration', () => {
      const result = registerFragment('http://localhost:2000/fragments/frag-a', 'test');
      expect(result).to.be.false;
    });

    it('returns true on second registration (duplicate)', () => {
      registerFragment('http://localhost:2000/fragments/frag-a', 'first');
      const result = registerFragment('http://localhost:2000/fragments/frag-a', 'second');
      expect(result).to.be.true;
    });

    it('increments count on each duplicate', () => {
      registerFragment('http://localhost:2000/fragments/frag-b', 'loc1');
      registerFragment('http://localhost:2000/fragments/frag-b', 'loc2');
      registerFragment('http://localhost:2000/fragments/frag-b', 'loc3');
      const reg = getRegistry();
      const key = canonicalizeFragmentUrl('http://localhost:2000/fragments/frag-b');
      expect(reg.get(key).count).to.equal(3);
    });

    it('accumulates locations array', () => {
      registerFragment('http://localhost:2000/fragments/frag-c', 'loc-a');
      registerFragment('http://localhost:2000/fragments/frag-c', 'loc-b');
      const reg = getRegistry();
      const key = canonicalizeFragmentUrl('http://localhost:2000/fragments/frag-c');
      expect(reg.get(key).locations).to.deep.equal(['loc-a', 'loc-b']);
    });

    it('treats URLs differing only by trailing slash as the same fragment', () => {
      registerFragment('http://localhost:2000/fragments/frag-d/', 'first');
      const result = registerFragment('http://localhost:2000/fragments/frag-d', 'second');
      expect(result).to.be.true;
    });

    it('treats URLs differing only by query string as the same fragment', () => {
      registerFragment('http://localhost:2000/fragments/frag-e?v=1', 'first');
      const result = registerFragment('http://localhost:2000/fragments/frag-e', 'second');
      expect(result).to.be.true;
    });
  });

  // ── clearRegistry ───────────────────────────────────────────────────────

  describe('clearRegistry', () => {
    it('resets state so previously seen fragments are treated as new', () => {
      registerFragment('http://localhost:2000/fragments/frag-f', 'first');
      clearRegistry();
      const result = registerFragment('http://localhost:2000/fragments/frag-f', 'after-clear');
      expect(result).to.be.false;
    });

    it('empties the registry map', () => {
      registerFragment('http://localhost:2000/fragments/frag-g', 'x');
      clearRegistry();
      expect(getRegistry().size).to.equal(0);
    });
  });

  // ── warnDuplicate ───────────────────────────────────────────────────────

  describe('warnDuplicate', () => {
    it('calls console.warn with structured payload when flag is true', () => {
      registerFragment('http://localhost:2000/fragments/frag-h', 'loc1');
      registerFragment('http://localhost:2000/fragments/frag-h', 'loc2');
      warnDuplicate('http://localhost:2000/fragments/frag-h', true);
      expect(warnStub.calledOnce).to.be.true;
      const [msg, payload] = warnStub.firstCall.args;
      expect(msg).to.equal('[Milo] Duplicate fragment reference detected');
      expect(payload.occurrences).to.equal(2);
      expect(payload.locations).to.deep.equal(['loc1', 'loc2']);
      expect(payload.path).to.include('/fragments/frag-h');
    });

    it('does NOT call console.warn when feature flag is false', () => {
      registerFragment('http://localhost:2000/fragments/frag-i', 'loc1');
      registerFragment('http://localhost:2000/fragments/frag-i', 'loc2');
      warnDuplicate('http://localhost:2000/fragments/frag-i', false);
      expect(warnStub.called).to.be.false;
    });

    it('does nothing when the fragment is not in the registry', () => {
      warnDuplicate('http://localhost:2000/fragments/nonexistent', true);
      expect(warnStub.called).to.be.false;
    });
  });

  // ── getRegistry ─────────────────────────────────────────────────────────

  describe('getRegistry', () => {
    it('returns a snapshot that does not mutate the internal registry', () => {
      registerFragment('http://localhost:2000/fragments/frag-j', 'x');
      const snap = getRegistry();
      snap.clear();
      expect(getRegistry().size).to.equal(1);
    });
  });
});
