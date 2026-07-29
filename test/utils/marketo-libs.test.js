import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  getMarketoLibsBase,
  loadMarketoLibs,
  getConfig,
  updateConfig,
} from '../../libs/utils/utils.js';

const loc = (search) => ({ search });
const noMeta = () => '';
const areaWith = (html = '') => {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el;
};

describe('marketo-libs', () => {
  beforeEach(() => { window.lana = { log: sinon.spy() }; });
  afterEach(() => { sinon.restore(); });

  describe('getMarketoLibsBase', () => {
    it('returns null when there is no trigger', () => {
      expect(getMarketoLibsBase(areaWith(), loc(''), noMeta)).to.be.null;
    });

    it('resolves ?marketolibs=main to the da-marketo production mkto base', () => {
      expect(getMarketoLibsBase(areaWith(), loc('?marketolibs=main'), noMeta))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('treats a bare ?marketolibs as main', () => {
      expect(getMarketoLibsBase(areaWith(), loc('?marketolibs'), noMeta))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('treats ?marketolibs=true as main', () => {
      expect(getMarketoLibsBase(areaWith(), loc('?marketolibs=true'), noMeta))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves a named branch to a da-marketo branch mkto base', () => {
      expect(getMarketoLibsBase(areaWith(), loc('?marketolibs=stage'), noMeta))
        .to.equal('https://stage--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves the marketo-libs metadata trigger', () => {
      expect(getMarketoLibsBase(areaWith(), loc(''), () => 'stage'))
        .to.equal('https://stage--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves a da-marketo block in the area to main', () => {
      expect(getMarketoLibsBase(areaWith('<div class="da-marketo"></div>'), loc(''), noMeta))
        .to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('gives the query param precedence over metadata and a da-marketo block', () => {
      const area = areaWith('<div class="da-marketo"></div>');
      expect(getMarketoLibsBase(area, loc('?marketolibs=parambranch'), () => 'metabranch'))
        .to.equal('https://parambranch--da-marketo--adobecom.aem.live/mkto');
    });

    it('gives metadata precedence over a da-marketo block', () => {
      const area = areaWith('<div class="da-marketo"></div>');
      expect(getMarketoLibsBase(area, loc(''), () => 'metabranch'))
        .to.equal('https://metabranch--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves a fork branch containing -- to an aem.live mkto base', () => {
      expect(getMarketoLibsBase(areaWith(), loc('?marketolibs=feature--da-marketo--adobecom'), noMeta))
        .to.equal('https://feature--da-marketo--adobecom.aem.live/mkto');
    });

    it('resolves local to the da-marketo local mkto base', () => {
      expect(getMarketoLibsBase(areaWith(), loc('?marketolibs=local'), noMeta))
        .to.equal('http://localhost:6586/mkto');
    });

    it('rejects an invalid branch name and warns', () => {
      const result = getMarketoLibsBase(areaWith(), loc('?marketolibs=bad!name'), noMeta);
      expect(result).to.be.null;
      expect(window.lana.log.calledOnce).to.be.true;
    });
  });

  describe('loadMarketoLibs', () => {
    let original;
    beforeEach(() => { original = getConfig(); });
    afterEach(() => { updateConfig(original); });

    it('does nothing when there is no trigger', () => {
      updateConfig({ ...original, externalLibs: undefined });
      loadMarketoLibs(areaWith('<div class="marquee"></div>'), loc(''), noMeta);
      expect(getConfig().externalLibs).to.be.undefined;
    });

    it('renames marketo blocks and adds a da-marketo externalLibs entry', () => {
      updateConfig({ ...original, externalLibs: undefined });
      const area = areaWith('<div class="marketo"></div><div class="marketo-config"></div>');
      loadMarketoLibs(area, loc('?marketolibs=main'), noMeta);

      expect(area.querySelector('.marketo')).to.be.null;
      expect(area.querySelector('.da-marketo')).to.exist;
      expect(area.querySelector('.da-marketo-config')).to.exist;
      const match = getConfig().externalLibs.find((lib) => lib.blocks?.includes('da-marketo'));
      expect(match.base).to.equal('https://main--da-marketo--adobecom.aem.live/mkto');
    });

    it('does not disturb codeRoot (no setConfig re-prefix)', () => {
      updateConfig({ ...original, externalLibs: undefined, codeRoot: 'http://localhost:3000' });
      loadMarketoLibs(areaWith(), loc('?marketolibs=main'), noMeta);
      expect(getConfig().codeRoot).to.equal('http://localhost:3000');
    });

    it('does not register again when da-marketo libs are already registered', () => {
      updateConfig({ ...original, externalLibs: [{ base: '/mkto', blocks: ['da-marketo'] }] });
      const area = areaWith('<div class="marketo"></div>');
      loadMarketoLibs(area, loc('?marketolibs=main'), noMeta);
      // guard returns early -> the block is left untouched
      expect(area.querySelector('.marketo')).to.exist;
      expect(getConfig().externalLibs).to.have.lengthOf(1);
    });
  });
});
