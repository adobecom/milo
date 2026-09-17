import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import checkVideoCaptions from '../../../../libs/blocks/preflight/accessibility/check-video-captions.js';

const CONFIG = { checks: ['video-captions'] };

function mpcIframe(id = '12345') {
  const el = document.createElement('iframe');
  el.src = `https://video.tv.adobe.com/v/${id}/?quality=12`;
  el.title = `Video ${id}`;
  return el;
}

describe('preflight accessibility check-video-captions', () => {
  let responses;

  beforeEach(() => {
    // captions-map maps captions language -> geos; ',us' includes the empty default geo.
    responses = {
      configMap: { data: [{ captions: 'eng', geos: ',us' }] },
      videoByLang: {}, // e.g. { eng: { captions: [] } }
    };
    sinon.stub(window, 'fetch').callsFake((url) => {
      const u = String(url);
      if (u.includes('preflight-config.json')) {
        return Promise.resolve({ json: () => Promise.resolve(responses.configMap) });
      }
      const langMatch = u.match(/\/vc\/\d+\/(\w+)\.json/);
      if (langMatch) {
        const body = responses.videoByLang[langMatch[1]] ?? { captions: [] };
        return Promise.resolve({ json: () => Promise.resolve(body) });
      }
      return Promise.reject(new Error(`unexpected fetch: ${u}`));
    });
  });

  afterEach(() => sinon.restore());

  it('returns [] when video-captions check is not enabled', async () => {
    expect(await checkVideoCaptions([mpcIframe()], { checks: [] })).to.deep.equal([]);
  });

  it('ignores non-MPC iframes', async () => {
    const other = document.createElement('iframe');
    other.src = 'https://example.com/embed/1';
    expect(await checkVideoCaptions([other], CONFIG)).to.deep.equal([]);
  });

  it('returns [] when no captions language maps to the current geo', async () => {
    responses.configMap = { data: [{ captions: 'eng', geos: 'jp,kr' }] };
    expect(await checkVideoCaptions([mpcIframe()], CONFIG)).to.deep.equal([]);
  });

  it('flags an MPC video with no captions', async () => {
    responses.videoByLang = { eng: { captions: [] } };
    const res = await checkVideoCaptions([mpcIframe('999')], CONFIG);
    expect(res).to.have.lengthOf(1);
    expect(res[0].id).to.equal('video-captions');
    expect(res[0].description).to.contain('999');
  });

  it('passes an MPC video that has captions in the geo language', async () => {
    responses.videoByLang = { eng: { captions: [{ lang: 'eng' }] } };
    expect(await checkVideoCaptions([mpcIframe()], CONFIG)).to.deep.equal([]);
  });

  it('falls back to English captions when the geo language has none', async () => {
    responses.configMap = { data: [{ captions: 'fra', geos: ',us' }] };
    responses.videoByLang = { fra: { captions: [] }, eng: { captions: [{ lang: 'eng' }] } };
    expect(await checkVideoCaptions([mpcIframe()], CONFIG)).to.deep.equal([]);
  });
});
