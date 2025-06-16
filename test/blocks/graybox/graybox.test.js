import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { loadStyle, MILO_EVENTS } from '../../../libs/utils/utils.js';
import { waitForElement, waitForRemoval } from '../../helpers/waitfor.js';

const { default: init, convertToGrayboxDomain, getGrayboxEnv } = await import('../../../libs/blocks/graybox/graybox.js');
await loadStyle('../../../libs/blocks/graybox/graybox.css');

window.milo = { deferredPromise: Promise.resolve() };

describe('Graybox', () => {
  before(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/graybox.html' });
    await init(document.querySelector('.graybox'));
    document.dispatchEvent(new Event(MILO_EVENTS.DEFERRED));
  });

  it('Displays a graybox dialog', async () => {
    const dialogEl = document.querySelector('.graybox-container');
    expect(dialogEl).to.exist;
    expect(dialogEl.classList.contains('open')).to.be.true;
  });

  it('Displays a mobile iframe on device button click', async () => {
    const dialogEl = document.querySelector('.graybox-container');
    const mobileBtn = dialogEl.querySelector('.graybox-mobile');
    mobileBtn.click();
    await waitForElement('iframe');
    let iframeEl = document.querySelector('iframe');
    expect(iframeEl).to.exist;

    const desktopBtn = dialogEl.querySelector('.graybox-desktop');
    desktopBtn.click();
    await waitForRemoval('iframe');
    iframeEl = document.querySelector('iframe');
    expect(iframeEl).not.to.exist;

    const tabletBtn = dialogEl.querySelector('.graybox-tablet');
    tabletBtn.click();
    await waitForElement('iframe');
    iframeEl = document.querySelector('iframe');
    expect(iframeEl).to.exist;

    desktopBtn.click();
    await waitForRemoval('iframe');
    iframeEl = document.querySelector('iframe');
    expect(iframeEl).not.to.exist;
  });

  it('Can open and close the dialog', async () => {
    const dialogEl = document.querySelector('.graybox-container');
    expect(dialogEl.classList.contains('open')).to.be.true;
    const toggleBtn = document.querySelector('.gb-toggle');
    toggleBtn.click();
    expect(dialogEl.classList.contains('open')).to.be.false;
    toggleBtn.click();
    expect(dialogEl.classList.contains('open')).to.be.true;
  });

  it('Puts an overlay on the entire page', async () => {
    const overlayDiv = document.querySelector('body > .gb-page-overlay');
    expect(overlayDiv).to.exist;
    const beforeStyle = window.getComputedStyle(overlayDiv);
    expect(beforeStyle.backgroundColor).to.equal('rgba(0, 0, 0, 0.45)');
  });

  it('Does not put an overlay on gb-changed blocks', async () => {
    const gbChangedEl = document.querySelector('.gb-changed');
    const gbChangedElStyle = window.getComputedStyle(gbChangedEl);
    expect(gbChangedElStyle.backgroundColor).to.equal('rgb(255, 255, 255)');
  });

  it('Does not put an overlay on gb-no-change sections', async () => {
    const gbChangedSection = document.querySelector('main > div.gb-changed');
    const gbChangedSectionStyle = window.getComputedStyle(gbChangedSection);
    expect(gbChangedSectionStyle.backgroundColor).to.equal('rgb(255, 255, 255)');
  });

  it('Can use gb-no-change inside of a gb-changed section', async () => {
    const noChangeEl = document.querySelector('.gb-no-change');
    const beforeStyle = window.getComputedStyle(noChangeEl, '::before');
    expect(beforeStyle.backgroundColor).to.equal('rgba(0, 0, 0, 0.45)');
  });

  it('Can use gb-no-click to disable clicks', async () => {
    const noClickEl = document.querySelector('.gb-no-click');
    const noClickElStyle = window.getComputedStyle(noClickEl, '::after');
    expect(noClickElStyle.pointerEvents).to.equal('none');
  });
});

describe('convertToGrayboxDomain', () => {
  const testUrlMap = new Map([
    ['business.adobe.com', 'business-graybox.adobe.com'],
    ['www.adobe.com/creativecloud', 'cc-graybox.adobe.com'],
    ['www.adobe.com/help/pics/light', 'helpsite-graybox.adobe.com/new'],
    ['www.adobe.com', 'graybox.adobe.com'],
  ]);

  it('converts business.adobe.com domain', () => {
    const result = convertToGrayboxDomain('https://business.adobe.com/pros/hello', 'test', testUrlMap);
    expect(result).to.equal('https://test.business-graybox.adobe.com/pros/hello');
  });

  it('converts www.adobe.com/creativecloud path', () => {
    const result = convertToGrayboxDomain('https://www.adobe.com/creativecloud/products/photo', 'asdf', testUrlMap);
    expect(result).to.equal('https://asdf.cc-graybox.adobe.com/products/photo');
  });

  it('converts www.adobe.com/help/pics/light path with replacement path', () => {
    const result = convertToGrayboxDomain('https://www.adobe.com/help/pics/light/deep/direc', 'qwer', testUrlMap);
    expect(result).to.equal('https://qwer.helpsite-graybox.adobe.com/new/deep/direc');
  });

  it('converts www.adobe.com fallback', () => {
    const result = convertToGrayboxDomain('https://www.adobe.com/other/path', 'test', testUrlMap);
    expect(result).to.equal('https://test.graybox.adobe.com/other/path');
  });

  it('preserves query parameters and hash', () => {
    const result = convertToGrayboxDomain('https://business.adobe.com/test?param=value&other=test#section', 'env', testUrlMap);
    expect(result).to.equal('https://env.business-graybox.adobe.com/test?param=value&other=test#section');
  });

  it('handles URLs with no path', () => {
    const result = convertToGrayboxDomain('https://business.adobe.com/', 'test', testUrlMap);
    expect(result).to.equal('https://test.business-graybox.adobe.com/');
  });

  it('handles URLs with no trailing slash', () => {
    const result = convertToGrayboxDomain('https://business.adobe.com', 'test', testUrlMap);
    expect(result).to.equal('https://test.business-graybox.adobe.com/');
  });

  it('handles exact path matches', () => {
    const result = convertToGrayboxDomain('https://www.adobe.com/creativecloud', 'test', testUrlMap);
    expect(result).to.equal('https://test.cc-graybox.adobe.com/');
  });

  it('handles path matches with trailing slash', () => {
    const result = convertToGrayboxDomain('https://www.adobe.com/creativecloud/', 'test', testUrlMap);
    expect(result).to.equal('https://test.cc-graybox.adobe.com/');
  });

  it('handles deep path matching correctly', () => {
    const result = convertToGrayboxDomain('https://www.adobe.com/help/pics/light', 'test', testUrlMap);
    expect(result).to.equal('https://test.helpsite-graybox.adobe.com/new');
  });

  it('returns original URL for non-matching domains', () => {
    const originalUrl = 'https://example.com/test/path';
    const result = convertToGrayboxDomain(originalUrl, 'test', testUrlMap);
    expect(result).to.equal(originalUrl);
  });

  it('returns original URL for non-matching paths', () => {
    const result = convertToGrayboxDomain('https://www.adobe.com/nomatch/path', 'test', testUrlMap);
    expect(result).to.equal('https://test.graybox.adobe.com/nomatch/path');
  });

  it('handles invalid URLs gracefully', () => {
    const invalidUrl = 'not-a-url';
    const result = convertToGrayboxDomain(invalidUrl, 'test', testUrlMap);
    expect(result).to.equal(invalidUrl);
  });

  it('handles empty grayboxEnv', () => {
    const result = convertToGrayboxDomain('https://business.adobe.com/test', '', testUrlMap);
    expect(result).to.equal('https://.business-graybox.adobe.com/test');
  });

  it('respects pattern matching order (more specific first)', () => {
    // This should match the more specific creativecloud pattern, not the general www.adobe.com
    const result = convertToGrayboxDomain('https://www.adobe.com/creativecloud/desktop', 'test', testUrlMap);
    expect(result).to.equal('https://test.cc-graybox.adobe.com/desktop');
  });

  it('handles HTTP URLs', () => {
    const result = convertToGrayboxDomain('http://business.adobe.com/test', 'dev', testUrlMap);
    expect(result).to.equal('http://dev.business-graybox.adobe.com/test');
  });

  it('handles URLs with ports', () => {
    const result = convertToGrayboxDomain('https://business.adobe.com:8080/test', 'local', testUrlMap);
    expect(result).to.equal('https://local.business-graybox.adobe.com:8080/test');
  });

  it('works with custom URL maps', () => {
    const customMap = new Map([
      ['custom.example.com/app', 'app-graybox.example.com/v2'],
      ['custom.example.com', 'general-graybox.example.com'],
    ]);

    const result1 = convertToGrayboxDomain('https://custom.example.com/app/dashboard', 'test', customMap);
    expect(result1).to.equal('https://test.app-graybox.example.com/v2/dashboard');

    const result2 = convertToGrayboxDomain('https://custom.example.com/other', 'test', customMap);
    expect(result2).to.equal('https://test.general-graybox.example.com/other');
  });

  it('handles empty URL map', () => {
    const emptyMap = new Map();
    const originalUrl = 'https://www.adobe.com/test';
    const result = convertToGrayboxDomain(originalUrl, 'test', emptyMap);
    expect(result).to.equal(originalUrl);
  });
});

describe('getGrayboxEnv', () => {
  it('returns environment name for valid graybox domains', () => {
    const result = getGrayboxEnv('https://test.graybox.adobe.com/page');
    expect(result).to.equal('test');
  });

  it('returns null for non-graybox domains', () => {
    const result = getGrayboxEnv('https://www.adobe.com/page');
    expect(result).to.be.null;
  });

  it('returns null for invalid URLs', () => {
    const result = getGrayboxEnv('not-a-url');
    expect(result).to.be.null;
  });

  it('returns null for empty URL', () => {
    const result = getGrayboxEnv('');
    expect(result).to.be.null;
  });

  it('returns null for URLs without hostname', () => {
    const result = getGrayboxEnv('https://');
    expect(result).to.be.null;
  });

  it('handles URLs with subdomains', () => {
    const result = getGrayboxEnv('https://dev.test.graybox.adobe.com/page');
    expect(result).to.equal('dev.test');
  });

  it('handles URLs with query parameters', () => {
    const result = getGrayboxEnv('https://test.graybox.adobe.com/page?param=value');
    expect(result).to.equal('test');
  });

  it('handles URLs with hash fragments', () => {
    const result = getGrayboxEnv('https://test.graybox.adobe.com/page#section');
    expect(result).to.equal('test');
  });
});
