import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, getConfig } from '../../../libs/utils/utils.js';

import init from '../../../libs/blocks/region-nav/region-nav.js';

document.body.innerHTML = await readFile({ path: './mocks/regions.html' });

setConfig({ });

const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

describe('Region Nav Block', () => {
  const block = document.body.querySelector('.region-nav');
  init(block);
  let clock;

  beforeEach(async () => {
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout'],
      shouldAdvanceTime: true,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('sets links correctly', () => {
    const { contentRoot } = getConfig().locale;
    window.location.hash = 'langnav';
    const path = window.location.href.replace(`${contentRoot}`, '').replace('#langnav', '');
    const links = document.body.querySelectorAll('a');
    expect(links[0].href).to.be.equal(`${origin}/ar${path}`);
    expect(links[links.length - 1].href).to.be.equal(`${origin}/kr${path}`);
  });

  it('handles mouseover event for 200 pages', async () => {
    sinon.stub(window, 'fetch').callsFake(() => new Promise((resolve) => {
      resolve({
        status: 200,
        ok: true,
      });
    }));
    sinon.stub(Element.prototype, 'matches').callsFake(() => true);
    const mouseoverEvent = new Event('mouseover');

    const auLink = document.querySelector('a[href*="/au/"]');
    const auLinkHref = auLink.href;
    auLink.dispatchEvent(mouseoverEvent);
    await clock.runAllAsync();
    expect(auLink.href).to.equal(auLinkHref);
  });

  it('handles mouseover event for 404 pages', async () => {
    sinon.stub(window, 'fetch').callsFake(() => new Promise((resolve) => {
      resolve({
        status: 404,
        ok: false,
      });
    }));
    sinon.stub(Element.prototype, 'matches').callsFake(() => true);
    const mouseoverEvent = new Event('mouseover');

    const brLink = document.querySelector('a[href*="/br/"]');
    brLink.dispatchEvent(mouseoverEvent);
    await clock.runAllAsync();
    expect(brLink.href).to.equal(`${origin}/br/`);
  });

  it('handles click event for 200 pages', async () => {
    sinon.stub(window, 'fetch').callsFake(() => new Promise((resolve) => {
      resolve({
        status: 200,
        ok: true,
      });
    }));
    sinon.stub(window, 'open').callsFake(() => {});

    const chdePrefix = 'ch_de';
    const chdeLink = document.querySelector(`a[href*="/${chdePrefix}/"]`);
    chdeLink.click();
    await clock.runAllAsync();
    expect(window.open.calledWith(chdeLink.href)).to.be.true;
    expect(getCookie('international')).to.equal(chdePrefix);
  });

  it('handles click event for 404 pages', async () => {
    sinon.stub(window, 'fetch').callsFake(() => new Promise((resolve) => {
      resolve({
        status: 404,
        ok: false,
      });
    }));
    sinon.stub(window, 'open').callsFake(() => {});

    const chfrPrefix = '/ch_fr/';
    const chfrLink = document.querySelector(`a[href*="${chfrPrefix}"]`);
    chfrLink.click();
    await clock.runAllAsync();
    expect(window.open.calledWith(chfrPrefix)).to.be.true;
  });
});
