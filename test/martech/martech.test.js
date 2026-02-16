import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  getTargetAjoPersonalization,
  roundToQuarter,
  setDeep,
  isProxied,
} from '../../libs/martech/martech.js';

describe('martech', () => {
  let lanaStub;
  let consoleErrorStub;

  beforeEach(() => {
    lanaStub = sinon.stub();
    window.lana = { log: lanaStub };
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    consoleErrorStub.restore();
    delete window.lana;
  });

  describe('roundToQuarter', () => {
    it('returns 0 for 0', () => {
      expect(roundToQuarter(0)).to.equal(0);
    });

    it('returns 0.25 for 250', () => {
      expect(roundToQuarter(250)).to.equal(0.25);
    });

    it('returns 0.25 for 125', () => {
      expect(roundToQuarter(125)).to.equal(0.25);
    });

    it('returns 0.5 for 251', () => {
      expect(roundToQuarter(251)).to.equal(0.5);
    });

    it('returns 0 for negative values (ceil rounds toward positive infinity)', () => {
      expect(roundToQuarter(-125)).to.equal(0);
    });
  });

  describe('setDeep', () => {
    it('sets single level', () => {
      const obj = {};
      setDeep(obj, 'foo', 'bar');
      expect(obj.foo).to.equal('bar');
    });

    it('sets multi-level path', () => {
      const obj = {};
      setDeep(obj, 'a.b.c', 42);
      expect(obj.a.b.c).to.equal(42);
    });

    it('overwrites existing value', () => {
      const obj = { a: { b: 'old' } };
      setDeep(obj, 'a.b', 'new');
      expect(obj.a.b).to.equal('new');
    });

    it('creates mid-path when missing', () => {
      const obj = {};
      setDeep(obj, 'x.y.z', true);
      expect(obj.x.y.z).to.equal(true);
    });
  });

  describe('isProxied', () => {
    it('returns true for www.adobe.com', () => {
      expect(isProxied('www.adobe.com')).to.be.true;
    });

    it('returns true for www.stage.adobe.com', () => {
      expect(isProxied('www.stage.adobe.com')).to.be.true;
    });

    it('returns true for milo.adobe.com', () => {
      expect(isProxied('milo.adobe.com')).to.be.true;
    });

    it('returns true for business.adobe.com', () => {
      expect(isProxied('business.adobe.com')).to.be.true;
    });

    it('returns false for example.com', () => {
      expect(isProxied('example.com')).to.be.false;
    });

    it('returns false for assets.adobedtm.com', () => {
      expect(isProxied('assets.adobedtm.com')).to.be.false;
    });
  });

  describe('getTargetAjoPersonalization', () => {
    it('returns manifests and propositions on AJO success', async () => {
      const handleAlloyResponse = sinon.stub().returns([{ manifestPath: '/test.json' }]);
      const sendTargetResponseAnalytics = sinon.stub();
      const config = { mep: { ajoEnabled: true } };
      const propositions = [{ id: 'prop1' }];
      const result = { propositions, decisions: [] };

      const promise = getTargetAjoPersonalization({
        handleAlloyResponse,
        config,
        sendTargetResponseAnalytics,
      });

      window.dispatchEvent(new CustomEvent('alloy_propositionFetch', {
        detail: { result },
      }));

      const output = await promise;

      expect(output.targetAjoManifests).to.deep.equal([{ manifestPath: '/test.json' }]);
      expect(output.targetAjoPropositions).to.deep.equal(propositions);
      expect(handleAlloyResponse.calledWith(result)).to.be.true;
      expect(sendTargetResponseAnalytics.calledWith(false, sinon.match.number, sinon.match.number)).to.be.true;
    });

    it('returns manifests and propositions on Target (no AJO) success', async () => {
      const handleAlloyResponse = sinon.stub().returns([{ manifestPath: '/target.json' }]);
      const sendTargetResponseAnalytics = sinon.stub();
      const config = { mep: { ajoEnabled: false } };
      const propositions = [{ id: 'prop2' }];
      const result = { propositions };

      const promise = getTargetAjoPersonalization({
        handleAlloyResponse,
        config,
        sendTargetResponseAnalytics,
      });

      window.dispatchEvent(new CustomEvent('alloy_sendEvent', {
        detail: { result },
      }));

      const output = await promise;

      expect(output.targetAjoManifests).to.deep.equal([{ manifestPath: '/target.json' }]);
      expect(output.targetAjoPropositions).to.deep.equal(propositions);
      expect(sendTargetResponseAnalytics.calledWith(false, sinon.match.number, sinon.match.number)).to.be.true;
    });

    it('returns empty arrays on error (ad blocker)', async () => {
      const handleAlloyResponse = sinon.stub();
      const sendTargetResponseAnalytics = sinon.stub();
      const config = { mep: { ajoEnabled: false } };

      const promise = getTargetAjoPersonalization({
        handleAlloyResponse,
        config,
        sendTargetResponseAnalytics,
      });

      window.dispatchEvent(new CustomEvent('alloy_sendEvent_error'));

      const output = await promise;

      expect(output.targetAjoManifests).to.deep.equal([]);
      expect(output.targetAjoPropositions).to.deep.equal([]);
      expect(handleAlloyResponse.called).to.be.false;
      expect(lanaStub.calledWith(sinon.match('ad blocker'))).to.be.true;
    });

    it('returns empty arrays on AJO error (ad blocker)', async () => {
      const handleAlloyResponse = sinon.stub();
      const sendTargetResponseAnalytics = sinon.stub();
      const config = { mep: { ajoEnabled: true } };

      const promise = getTargetAjoPersonalization({
        handleAlloyResponse,
        config,
        sendTargetResponseAnalytics,
      });

      window.dispatchEvent(new CustomEvent('alloy_propositionFetch', {
        detail: { error: true },
      }));

      const output = await promise;

      expect(output.targetAjoManifests).to.deep.equal([]);
      expect(output.targetAjoPropositions).to.deep.equal([]);
      expect(handleAlloyResponse.called).to.be.false;
    });

    it('handles timeout and calls sendTargetResponseAnalytics with delayed callback', async () => {
      const clock = sinon.useFakeTimers({ shouldAdvanceTime: true });
      const handleAlloyResponse = sinon.stub();
      const sendTargetResponseAnalytics = sinon.stub();
      const config = { mep: { ajoEnabled: false } };

      const promise = getTargetAjoPersonalization({
        handleAlloyResponse,
        config,
        sendTargetResponseAnalytics,
      });

      await clock.tickAsync(4500);

      const output = await promise;

      expect(output.targetAjoManifests).to.deep.equal([]);
      expect(output.targetAjoPropositions).to.deep.equal([]);

      await clock.tickAsync(1500);

      expect(sendTargetResponseAnalytics.calledWith(true, sinon.match.number, sinon.match.number)).to.be.true;

      clock.restore();
    });

    it('logs target response time on success', async () => {
      const handleAlloyResponse = sinon.stub().returns([]);
      const sendTargetResponseAnalytics = sinon.stub();
      const config = { mep: { ajoEnabled: false } };

      const promise = getTargetAjoPersonalization({
        handleAlloyResponse,
        config,
        sendTargetResponseAnalytics,
      });

      window.dispatchEvent(new CustomEvent('alloy_sendEvent', {
        detail: { result: { propositions: [] } },
      }));

      await promise;

      expect(lanaStub.calledWith(sinon.match('target response time:'))).to.be.true;
    });

    it('uses console.error when lana.log throws', async () => {
      lanaStub.throws(new Error('lana error'));
      const handleAlloyResponse = sinon.stub().returns([]);
      const sendTargetResponseAnalytics = sinon.stub();
      const config = { mep: { ajoEnabled: false } };

      const promise = getTargetAjoPersonalization({
        handleAlloyResponse,
        config,
        sendTargetResponseAnalytics,
      });

      window.dispatchEvent(new CustomEvent('alloy_sendEvent', {
        detail: { result: { propositions: [] } },
      }));

      await promise;

      expect(consoleErrorStub.called).to.be.true;
    });

    it('returns empty propositions when result has no propositions', async () => {
      const handleAlloyResponse = sinon.stub().returns([]);
      const sendTargetResponseAnalytics = sinon.stub();
      const config = { mep: { ajoEnabled: false } };

      const promise = getTargetAjoPersonalization({
        handleAlloyResponse,
        config,
        sendTargetResponseAnalytics,
      });

      window.dispatchEvent(new CustomEvent('alloy_sendEvent', {
        detail: { result: {} },
      }));

      const output = await promise;

      expect(output.targetAjoPropositions).to.deep.equal([]);
    });
  });
});
