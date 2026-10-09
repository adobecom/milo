import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';

const { default: init, parseUrls, normalizeUrl } = await import('../../../libs/blocks/project-tracking/project-tracking.js');

describe('project-tracking normalizeUrl', () => {
  it('maps bacom pages to da-bacom and strips .html', () => {
    expect(normalizeUrl('https://business.adobe.com/products/marketo.html'))
      .to.equal('https://main--da-bacom--adobecom.aem.page/products/marketo');
  });
  it('maps bacom blog pages to da-bacom-blog', () => {
    expect(normalizeUrl('https://business.adobe.com/blog/how-the-nfl-uses-adobe-ai'))
      .to.equal('https://main--da-bacom-blog--adobecom.aem.page/blog/how-the-nfl-uses-adobe-ai');
    expect(normalizeUrl('https://business.adobe.com/blog/'))
      .to.equal('https://main--da-bacom-blog--adobecom.aem.page/blog');
  });
  it('maps localized bacom blog pages to da-bacom-blog', () => {
    expect(normalizeUrl('https://business.adobe.com/uk/blog/some-post.html'))
      .to.equal('https://main--da-bacom-blog--adobecom.aem.page/uk/blog/some-post');
    expect(normalizeUrl('https://business.adobe.com/la_es/blog/some-post'))
      .to.equal('https://main--da-bacom-blog--adobecom.aem.page/la_es/blog/some-post');
  });
  it('does not treat blog-like paths as blog', () => {
    expect(normalizeUrl('https://business.adobe.com/products/blogger'))
      .to.equal('https://main--da-bacom--adobecom.aem.page/products/blogger');
    expect(normalizeUrl('https://business.adobe.com/resources/blog/x'))
      .to.equal('https://main--da-bacom--adobecom.aem.page/resources/blog/x');
  });
  it('leaves EDS and unknown hosts untouched', () => {
    const eds = 'https://main--da-bacom--adobecom.aem.page/blog/x';
    expect(normalizeUrl(eds)).to.equal(eds);
    expect(normalizeUrl('https://www.adobe.com/x')).to.equal('https://www.adobe.com/x');
  });
});

describe('project-tracking parseUrls', () => {
  it('splits on newlines, trims, drops empties', () => {
    expect(parseUrls('  a \n\n b \n')).to.deep.equal(['a', 'b']);
  });
  it('also splits on commas', () => {
    expect(parseUrls('a, b ,c')).to.deep.equal(['a', 'b', 'c']);
  });
  it('returns [] for empty input', () => {
    expect(parseUrls('')).to.deep.equal([]);
  });
  it('returns [] for whitespace/newline-only input', () => {
    expect(parseUrls('   \n ')).to.deep.equal([]);
  });
  it('returns [] for undefined', () => {
    expect(parseUrls(undefined)).to.deep.equal([]);
  });
});

describe('project-tracking UI', () => {
  const ROWS = {
    'https://main--da-bacom--adobecom.aem.page/a': { status: 'Draft' },
    'https://main--da-bacom--adobecom.aem.page/b': { status: 'Live', lastPreview: '2026-09-01T00:00:00Z', lastPublish: '2026-09-02T00:00:00Z' },
    'https://main--da-bacom--adobecom.aem.page/c': { status: 'Live', lastPreview: '2026-09-03T00:00:00Z', lastPublish: '2026-09-04T00:00:00Z' },
  };
  let block;
  let fetchStub;

  const tableUrls = () => [...block.querySelectorAll('.pt-table tbody .pt-link')].map((a) => a.textContent);
  const waitForTable = () => waitForElement('.pt-table', { rootEl: block });

  beforeEach(async () => {
    fetchStub = sinon.stub(window, 'fetch').callsFake(async (url, opts) => {
      const { urls } = JSON.parse(opts.body);
      return new Response(JSON.stringify(urls.map((u) => ({ url: u, ...ROWS[u] }))));
    });
    block = document.createElement('div');
    block.innerHTML = '<div><div>api</div><div>http://localhost:8080</div></div>';
    document.body.append(block);
    await init(block);
    block.querySelector('#pt-urls').value = Object.keys(ROWS).join('\n');
  });

  afterEach(() => {
    fetchStub.restore();
    block.remove();
  });

  it('Enter alone does not trigger a check', () => {
    const ev = block.querySelector('#pt-urls').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }));
    expect(ev).to.be.true;
    expect(fetchStub.called).to.be.false;
  });

  it('places the toolbar directly above the table, only once results exist', async () => {
    expect(block.querySelector('.pt-toolbar')).to.be.null;
    block.querySelector('.pt-check-btn').click();
    await waitForTable();
    const kids = [...block.querySelector('.pt-results').children].map((el) => el.className);
    expect(kids).to.deep.equal(['pt-stats', 'pt-status-counts', 'pt-toolbar', 'pt-table-wrap']);
  });

  it('status badges act as toggleable quick filters synced with the dropdown', async () => {
    block.querySelector('.pt-check-btn').click();
    await waitForTable();
    const badge = (s) => [...block.querySelectorAll('.pt-badge-btn')].find((b) => b.textContent.startsWith(s));

    badge('Live').click();
    expect(tableUrls()).to.deep.equal(Object.keys(ROWS).slice(1));
    expect(badge('Live').getAttribute('aria-pressed')).to.equal('true');
    expect(block.querySelector('.pt-filter').value).to.equal('Live');

    badge('Live').click();
    expect(tableUrls()).to.have.length(3);
    expect(badge('Live').getAttribute('aria-pressed')).to.equal('false');
    expect(block.querySelector('.pt-filter').value).to.equal('all');
  });

  it('renders backend-supplied text as text, never as HTML', async () => {
    const evil = '<img src=x class="pt-injected">';
    fetchStub.callsFake(async (url, opts) => {
      const { urls } = JSON.parse(opts.body);
      const row = { status: 'Live', annotations: { threads: evil, open: 0 }, preflight: { score: evil } };
      return new Response(JSON.stringify(urls.map((u) => ({ url: u, ...row }))));
    });
    block.querySelector('.pt-check-btn').click();
    await waitForTable();
    expect(block.querySelectorAll('.pt-injected').length).to.equal(0);
    expect(block.querySelector('.pt-table').textContent).to.include(evil);

    fetchStub.callsFake(async () => new Response(evil));
    block.querySelector('.pt-check-btn').click();
    await waitForElement('.pt-error', { rootEl: block });
    expect(block.querySelectorAll('.pt-injected').length).to.equal(0);
  });

  it('labels unresolvable URLs Unsupported and explains the Preflight card denominator', async () => {
    fetchStub.callsFake(async (url, opts) => {
      const { urls } = JSON.parse(opts.body);
      return new Response(JSON.stringify(urls.map((u, i) => ({
        url: u,
        site: i === 0 ? null : 'da-bacom',
        status: 'Live',
        preflight: i === 1 ? { score: 95 } : null,
      }))));
    });
    block.querySelector('.pt-check-btn').click();
    await waitForTable();

    const statuses = [...block.querySelectorAll('.pt-table tbody .pt-badge')].map((b) => b.textContent);
    expect(statuses).to.deep.equal(['Unsupported', 'Live', 'Live']);
    const badge = [...block.querySelectorAll('.pt-badge-btn')].find((b) => b.textContent === 'Unsupported 1');
    badge.click();
    expect(tableUrls()).to.deep.equal([Object.keys(ROWS)[0]]);
    expect(block.querySelector('.pt-filter').value).to.equal('Unsupported');

    expect(block.querySelector('.pt-stat-preflight .pt-stat-note').textContent)
      .to.equal('Score 90+ · 1 of 3 pages have a preflight run');
  });

  it('keeps focus in the search box while typing', async () => {
    block.querySelector('.pt-check-btn').click();
    await waitForTable();
    const search = block.querySelector('.pt-search');
    search.focus();
    search.value = '/b';
    search.dispatchEvent(new Event('input'));
    expect(document.activeElement).to.equal(search);
    expect(tableUrls()).to.deep.equal([Object.keys(ROWS)[1]]);
  });

  it('uses No history found in table rows, quick filters, dropdown and status sorting', async () => {
    block.querySelector('.pt-check-btn').click();
    await waitForTable();
    const statuses = () => [...block.querySelectorAll('.pt-table tbody .pt-badge')].map((b) => b.textContent);
    expect(statuses()).to.deep.equal(['No history found', 'Live', 'Live']);
    const badge = block.querySelector('[data-status="No history found"]');
    expect(badge.textContent).to.equal('No history found 1');
    badge.click();
    expect(tableUrls()).to.deep.equal([Object.keys(ROWS)[0]]);
    const filter = block.querySelector('.pt-filter');
    expect(filter.value).to.equal('No history found');
    expect([...filter.options].map((o) => o.textContent)).not.to.include('Draft');
    filter.value = 'all';
    filter.dispatchEvent(new Event('change'));
    const sort = block.querySelector('.pt-sort');
    sort.value = 'status';
    sort.dispatchEvent(new Event('change'));
    expect(statuses()).to.deep.equal(['No history found', 'Live', 'Live']);
  });
});
