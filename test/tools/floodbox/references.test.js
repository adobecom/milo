import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import findFragmentsAndAssets from '../../../tools/floodbox/references.js';
import RequestHandler from '../../../tools/floodbox/request-handler.js';

describe('References', () => {
  const accessToken = 'test-token';
  const htmlPaths = ['/path1', '/path2'];
  const org = 'test-org';
  const repo = 'test-repo';
  let requestHandlerStub;

  beforeEach(() => {
    requestHandlerStub = sinon.stub(RequestHandler.prototype, 'daFetch');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('returns referenced fragments and assets for valid links with different domains', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path1">Link</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path2">Link</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set(['/test-org/test-repo/fragments/path1', '/test-org/test-repo/fragments/path2']));
  });

  it('returns referenced fragments and assets for valid links with different file types', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/path1.pdf">Link1</a><a href="https://main--test-repo--test-org.aem.page/path2.txt">Link2</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/path3.svg">Link3</a><a href="https://main--test-repo--test-org.aem.page/path4.json">Link4</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set(['/test-org/test-repo/path1.pdf', '/test-org/test-repo/path3.svg', '/test-org/test-repo/path4.json']));
  });

  it('returns an empty set when no links are present in the HTML', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<html><body>No links here</body></html>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<html><body>Still no links</body></html>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set());
  });

  it('returns an empty set when links do not match the reference pattern', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://example.com/invalid-link">Link</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://example.com/another-invalid-link">Link</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set());
  });

  it('handles mixed valid and invalid links', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path1">Valid Link</a><a href="https://example.com/invalid-link">Invalid Link</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path2">Valid Link</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set(['/test-org/test-repo/fragments/path1', '/test-org/test-repo/fragments/path2']));
  });

  it('handles fetch errors gracefully', async () => {
    requestHandlerStub
      .onFirstCall().resolves({ ok: false })
      .onSecondCall().resolves({ ok: false });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set());
  });

  it('strips URL hashes from captured fragment paths', async () => {
    requestHandlerStub
      .onFirstCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path1#section-2">Link</a>',
      })
      .onSecondCall().resolves({
        ok: true,
        text: async () => '<a href="https://main--test-repo--test-org.aem.page/fragments/path2#top">Link</a><a href="https://main--test-repo--test-org.aem.page/path3.pdf#page=4">PDF</a>',
      });

    const result = await findFragmentsAndAssets({ accessToken, htmlPaths, org, repo });
    expect(result).to.eql(new Set([
      '/test-org/test-repo/fragments/path1',
      '/test-org/test-repo/fragments/path2',
      '/test-org/test-repo/path3.pdf',
    ]));
  });

  describe('chrono-box fragments', () => {
    const dirHtmlPaths = ['/some/dir/page1', '/some/dir/page2'];

    const chronoBoxHtml = (json) => `
      <div class="chrono-box">
        <div>
          <div>schedule</div>
          <div>${json}</div>
        </div>
      </div>`;

    it('ignores chrono-box blocks when the flag is not enabled', async () => {
      const html = `
        <a href="https://main--test-repo--test-org.aem.page/fragments/from-link">link</a>
        ${chronoBoxHtml('[{"pathToFragment":"fragments/2026-06-10/hero-pre"}]')}`;
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const args = { accessToken, htmlPaths: dirHtmlPaths, org, repo };
      const result = await findFragmentsAndAssets(args);
      expect(result).to.eql(new Set(['/test-org/test-repo/fragments/from-link']));
    });

    it('extracts chrono-box fragments resolved against the page directory when enabled', async () => {
      const html = `
        <a href="https://main--test-repo--test-org.aem.page/fragments/from-link">link</a>
        ${chronoBoxHtml('[{"pathToFragment":"fragments/2026-06-10/hero-pre"},{"toggleTime":"1781136000000","pathToFragment":"fragments/2026-06-10/hero-post"}]')}`;
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const result = await findFragmentsAndAssets({
        accessToken,
        htmlPaths: dirHtmlPaths,
        org,
        repo,
        includeChronoBoxFragments: true,
      });
      expect(result).to.eql(new Set([
        '/test-org/test-repo/fragments/from-link',
        '/test-org/test-repo/some/dir/fragments/2026-06-10/hero-pre',
        '/test-org/test-repo/some/dir/fragments/2026-06-10/hero-post',
      ]));
    });

    it('handles multiple chrono-box blocks and skips entries without pathToFragment', async () => {
      const html = `
        ${chronoBoxHtml('[{"pathToFragment":"fragments/a"},{"toggleTime":"1"}]')}
        ${chronoBoxHtml('[{"pathToFragment":"fragments/b"}]')}`;
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const result = await findFragmentsAndAssets({
        accessToken,
        htmlPaths: dirHtmlPaths,
        org,
        repo,
        includeChronoBoxFragments: true,
      });
      expect(result).to.eql(new Set([
        '/test-org/test-repo/some/dir/fragments/a',
        '/test-org/test-repo/some/dir/fragments/b',
      ]));
    });

    it('skips chrono-box blocks with malformed JSON without throwing', async () => {
      const html = `
        ${chronoBoxHtml('not-json')}
        ${chronoBoxHtml('[{"pathToFragment":"fragments/ok"}]')}`;
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const result = await findFragmentsAndAssets({
        accessToken,
        htmlPaths: dirHtmlPaths,
        org,
        repo,
        includeChronoBoxFragments: true,
      });
      expect(result).to.eql(new Set(['/test-org/test-repo/some/dir/fragments/ok']));
    });

    it('treats absolute pathToFragment values as repo-rooted paths', async () => {
      const html = chronoBoxHtml('[{"pathToFragment":"/absolute/fragments/foo"}]');
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const result = await findFragmentsAndAssets({
        accessToken,
        htmlPaths: dirHtmlPaths,
        org,
        repo,
        includeChronoBoxFragments: true,
      });
      expect(result).to.eql(new Set(['/test-org/test-repo/absolute/fragments/foo']));
    });

    const buildScheduleHref = (payload) => {
      const b64 = btoa(JSON.stringify(payload));
      return `https://www.adobe.com/ecc/system/tools/schedule-maker?schedule=${b64}`;
    };

    it('extracts fragmentPath values from schedule-maker links when enabled', async () => {
      const href = buildScheduleHref({
        title: 'promo',
        blocks: [
          { fragmentPath: '/events/events-shared/fragments/sm/blank' },
          { fragmentPath: '/events/events-shared/fragments/sm/promo' },
          { startDateTime: 1 },
        ],
      });
      const html = `<a href="${href}">schedule</a>`;
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const result = await findFragmentsAndAssets({
        accessToken,
        htmlPaths: dirHtmlPaths,
        org,
        repo,
        includeChronoBoxFragments: true,
      });
      expect(result).to.eql(new Set([
        '/test-org/test-repo/events/events-shared/fragments/sm/blank',
        '/test-org/test-repo/events/events-shared/fragments/sm/promo',
      ]));
    });

    it('ignores schedule-maker links when the flag is not enabled', async () => {
      const blocks = [{ fragmentPath: '/events/events-shared/fragments/sm/blank' }];
      const href = buildScheduleHref({ blocks });
      const html = `<a href="${href}">schedule</a>`;
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const args = { accessToken, htmlPaths: dirHtmlPaths, org, repo };
      const result = await findFragmentsAndAssets(args);
      expect(result).to.eql(new Set());
    });

    it('ignores schedule-maker links from non-allowlisted endpoints', async () => {
      const b64 = btoa(JSON.stringify({ blocks: [{ fragmentPath: '/events/x' }] }));
      const href = `https://example.com/some/other/tool?schedule=${b64}`;
      const html = `<a href="${href}">other</a>`;
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const result = await findFragmentsAndAssets({
        accessToken,
        htmlPaths: dirHtmlPaths,
        org,
        repo,
        includeChronoBoxFragments: true,
      });
      expect(result).to.eql(new Set());
    });

    it('handles malformed schedule-maker payloads without throwing', async () => {
      const validHref = buildScheduleHref({ blocks: [{ fragmentPath: '/events/ok' }] });
      const badBase64Href = 'https://www.adobe.com/ecc/system/tools/schedule-maker?schedule=%%%not-base64%%%';
      const badJsonHref = `https://www.adobe.com/ecc/system/tools/schedule-maker?schedule=${btoa('not json')}`;
      const noParamHref = 'https://www.adobe.com/ecc/system/tools/schedule-maker';
      const html = `
        <a href="${badBase64Href}">a</a>
        <a href="${badJsonHref}">b</a>
        <a href="${noParamHref}">c</a>
        <a href="${validHref}">d</a>`;
      requestHandlerStub
        .onFirstCall().resolves({ ok: true, text: async () => html })
        .onSecondCall().resolves({ ok: true, text: async () => '' });

      const result = await findFragmentsAndAssets({
        accessToken,
        htmlPaths: dirHtmlPaths,
        org,
        repo,
        includeChronoBoxFragments: true,
      });
      expect(result).to.eql(new Set(['/test-org/test-repo/events/ok']));
    });
  });
});
