/* eslint-disable no-unused-expressions */
/* global describe before after it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const hash = '#eyJjYXJkU3R5bGUiOiJmdWxsLWNhcmQiLCJjb2xsZWN0aW9uQnRuU3R5bGUiOiJwcmltYXJ5IiwiY29udGFpbmVyIjoiODNQZXJjZW50IiwiY291bnRyeSI6ImNhYXM6Y291bnRyeS91cyIsImNvbnRlbnRUeXBlVGFncyI6W10sImRpc2FibGVCYW5uZXJzIjpmYWxzZSwiZHJhZnREYiI6ZmFsc2UsImd1dHRlciI6IjR4IiwibGFuZ3VhZ2UiOiJjYWFzOmxhbmd1YWdlL2VuIiwibGF5b3V0VHlwZSI6IjN1cCIsImxvYWRNb3JlQnRuU3R5bGUiOiJwcmltYXJ5IiwicGFnaW5hdGlvbkFuaW1hdGlvblN0eWxlIjoicGFnZWQiLCJwYWdpbmF0aW9uRW5hYmxlZCI6ZmFsc2UsInBhZ2luYXRpb25RdWFudGl0eVNob3duIjpmYWxzZSwicGFnaW5hdGlvblVzZVRoZW1lMyI6ZmFsc2UsInBhZ2luYXRpb25UeXBlIjoibm9uZSIsInJlc3VsdHNQZXJQYWdlIjoiMSIsInNldENhcmRCb3JkZXJzIjpmYWxzZSwic2hvd0ZpbHRlcnMiOmZhbHNlLCJzaG93U2VhcmNoIjpmYWxzZSwic29ydERlZmF1bHQiOiJ0aXRsZURlc2MiLCJzb3J0RW5hYmxlUG9wdXAiOmZhbHNlLCJzb3J0RW5hYmxlUmFuZG9tU2FtcGxpbmciOmZhbHNlLCJzb3J0UmVzZXJ2b2lyU2FtcGxlIjozLCJzb3J0UmVzZXJ2b2lyUG9vbCI6MTAwMCwic291cmNlIjpbImhhd2tzIl0sInRoZW1lIjoibGlnaHRlc3QiLCJ0b3RhbENhcmRzVG9TaG93IjoiMyIsInVzZUxpZ2h0VGV4dCI6ZmFsc2V9';

const utils = {};

const config = {
  imsClientId: 'milo',
  projectRoot: `${window.location.origin}/libs`,
  locales: {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
    cn: { ietf: 'zh-CN', tk: 'tav4wnu' },
    kr: { ietf: 'ko-KR', tk: 'zfo3ouc' },
  },
};

document.head.innerHTML = await readFile({ path: './mocks/head.html' });
document.body.innerHTML = await readFile({ path: './mocks/body.html' });

describe('Utils', () => {
  before(() => {
    sinon.spy(console, 'log');
  });

  after(() => {
    console.log.restore();
  });

  before(async () => {
    const module = await import('../../libs/utils/utils.js');
    module.setConfig(config);
    Object.keys(module).forEach((func) => {
      utils[func] = module[func];
    });
  });

  it('Loads a script', async () => {
    const script = await utils.loadScript('/test/utils/mocks/script.js', 'module');
    expect(script).to.exist;
    expect(script.type).to.equal('module');
    await utils.loadScript('/test/utils/mocks/script.js', 'module');
    expect(script).to.exist;
  });

  it('Rejects a bad script', async () => {
    try {
      await utils.loadScript('/test/utils/mocks/error.js');
    } catch (err) {
      expect(err.message).to.equal('error loading script');
    }
  });

  it('Does not setup nofollow links', async () => {
    const gaLink = document.querySelector('a[href="https://analytics.google.com"]');
    expect(gaLink.getAttribute('rel')).to.be.null;
  });

  it('Sets up nofollow links', async () => {
    const meta = document.createElement('meta');
    meta.name = 'nofollow-links';
    meta.content = 'on';
    document.head.append(meta);
    await utils.loadArea({ blocks: [] });
    const gaLink = document.querySelector('a[href="https://analytics.google.com"]');
    expect(gaLink).to.exist;
  });

  it('Converts UTF-8 to Base 64', () => {
    const b64 = utils.utf8ToB64('hello world');
    expect(b64).to.equal('aGVsbG8gd29ybGQ=');
  });

  it('Converts Base 64 to UTF-8', () => {
    const b64 = utils.b64ToUtf8('aGVsbG8gd29ybGQ=');
    expect(b64).to.equal('hello world');
  });

  it('Converts Base 64 to UTF-8', () => {
    window.location.hash = hash;
    const hashConfig = utils.getHashConfig();
    expect(hashConfig.cardStyle).to.equal('full-card');
  });

  it('Successfully dies parsing a bad config', () => {
    utils.parseEncodedConfig('error');
    expect(console.log.args[0][0].name).to.equal('InvalidCharacterError');
  });

  // it('Test getEnv()', () => {
  //   expect(utils.getEnv()).to.equal('local');
  // });

  it('updateObj should add any missing keys to the obj', () => {
    const allKeys = { a: 'one', b: 2, c: [6, 7, 8] };
    expect(utils.updateObj({}, allKeys)).to.eql(utils.cloneObj(allKeys));
    expect(utils.updateObj({ a: 'blah', d: 1234 }, allKeys)).to.eql({ a: 'blah', b: 2, c: [6, 7, 8], d: 1234 });
  });
});
