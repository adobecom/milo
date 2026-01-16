/* eslint-disable no-underscore-dangle */
import { expect } from '@esm-bundle/chai';
import { getButtonType } from '../../libs/utils/decorate.js';

describe('Decorate', () => {
  it('Should return outline for <em><strong> CTA', async () => {
    const ctaParent = document.createElement('em');
    const cta = document.createElement('strong');
    cta.innerHTML = '<a href="https://test.com">CTA</a>';
    ctaParent.appendChild(cta);
    const type = getButtonType(cta);
    expect(type).to.equal('outline');
  });
  it('Should return outline for <strong><em> CTA', async () => {
    const ctaParent = document.createElement('strong');
    const cta = document.createElement('em');
    cta.innerHTML = '<a href="https://test.com">CTA</a>';
    ctaParent.appendChild(cta);
    const type = getButtonType(cta);
    expect(type).to.equal('outline');
  });
  it('Should return blue for <strong> CTA', async () => {
    const cta = document.createElement('strong');
    cta.innerHTML = '<a href="https://test.com">CTA</a>';
    const type = getButtonType(cta);
    expect(type).to.equal('blue');
  });
  it('Should return outline for <em> CTA', async () => {
    const cta = document.createElement('em');
    cta.innerHTML = '<a href="https://test.com">CTA</a>';
    const type = getButtonType(cta);
    expect(type).to.equal('outline');
  });
  it('Should return blue for <a> CTA', async () => {
    const cta = document.createElement('a');
    cta.innerHTML = '<strong>CTA</strong>';
    const type = getButtonType(cta);
    expect(type).to.equal('blue');
  });
});
