import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  SOURCE_URL, PREVIEW_URL, fetchGroups, fetchGroupTags, readSheet,
  reconcileSheet, saveSheet, refreshPreview,
} from '../../../tools/da/tag-manager/tag-manager-utils.js';

const GROUP = 'caas:blog-author';
const jsonResponse = (data) => new Response(JSON.stringify(data));
const tag = (tagID, title, tags = {}) => ({ tagID, title, tags });
const taxonomy = (tags = {}) => ({ namespaces: { caas: { tags: { authors: tag(GROUP, 'Blog Author', tags) } } } });
const makeSheet = () => ({
  primaryProductName: { data: [{ name: 'analytics', title: 'Analytics' }], ':colWidths': [300, 300] },
  'CaaS tags': {
    data: [
      { name: `${GROUP}/one`, title: 'Old title', notes: 'Keep this column' },
      { name: `${GROUP}/retired`, title: 'Retired author' },
      { name: 'caas:blog-authors/other', title: 'Similar prefix' },
      { name: 'caas:products/analytics', title: 'Analytics' },
    ],
    total: 4,
    limit: 4,
    offset: 0,
    ':colWidths': [374, 501],
  },
  ':names': ['primaryProductName', 'CaaS tags'],
  ':type': 'multi-sheet',
  ':version': 3,
});
const incoming = [
  { name: `${GROUP}/one`, title: 'New title' },
  { name: `${GROUP}/new`, title: 'New author' },
];
const failure = (promise) => promise.then(() => null, (error) => error);

describe('Tag Manager', () => {
  let fetchStub;

  beforeEach(() => {
    fetchStub = sinon.stub(window, 'fetch');
  });

  afterEach(() => sinon.restore());

  it('discovers friendly group choices without using an empty namespace include filter', async () => {
    const data = taxonomy();
    data.namespaces.caas.tags.products = tag('caas:products', 'Products');
    fetchStub.resolves(jsonResponse(data));

    expect(await fetchGroups()).to.deep.equal([
      { id: GROUP, title: 'Blog Author' },
      { id: 'caas:products', title: 'Products' },
    ]);
    const url = new URL(fetchStub.firstCall.args[0]);
    expect(url.searchParams.get('include')).to.equal(null);
    expect(url.searchParams.get('v')).to.equal('1');
  });

  it('uses canonical IDs for all descendants and deduplicates identical API records', async () => {
    fetchStub.resolves(jsonResponse(taxonomy({
      parent: tag(`${GROUP}/one`, 'One', { child: tag(`${GROUP}/one/child`, 'Nested author') }),
      duplicate: tag(`${GROUP}/one/child`, 'Nested author'),
    })));

    expect(await fetchGroupTags(GROUP)).to.deep.equal([
      { name: `${GROUP}/one`, title: 'One' },
      { name: `${GROUP}/one/child`, title: 'Nested author' },
    ]);
    expect(new URL(fetchStub.firstCall.args[0]).searchParams.get('include')).to.equal(GROUP);
  });

  it('rejects missing groups, cross-group IDs, incomplete tags and conflicting API titles', async () => {
    const invalid = [
      { namespaces: { caas: { tags: {} } } },
      taxonomy({ wrong: tag('caas:products/other', 'Other') }),
      taxonomy({ incomplete: { tagID: `${GROUP}/one`, tags: {} } }),
      taxonomy({ one: tag(`${GROUP}/one`, 'First'), two: tag(`${GROUP}/one`, 'Different') }),
    ];
    for (const data of invalid) {
      fetchStub.resolves(jsonResponse(data));
      expect(await failure(fetchGroupTags(GROUP))).to.be.instanceOf(Error);
    }
  });

  it('keeps missing tags by default, preserves metadata and columns, and never mutates the source', () => {
    const sheet = makeSheet();
    const original = JSON.parse(JSON.stringify(sheet));
    const result = reconcileSheet(sheet, GROUP, incoming);

    expect(result.added).to.deep.equal([incoming[1]]);
    expect(result.updated).to.deep.equal([{ ...incoming[0], before: 'Old title' }]);
    expect(result.missing.map(({ name }) => name)).to.deep.equal([`${GROUP}/retired`]);
    expect(result.removed).to.deep.equal([]);
    expect(result.sheet['CaaS tags'].data).to.deep.equal([
      { ...incoming[0], notes: 'Keep this column' },
      ...sheet['CaaS tags'].data.slice(1),
      incoming[1],
    ]);
    expect(result.sheet['CaaS tags'][':colWidths']).to.deep.equal([374, 501]);
    expect(result.sheet.primaryProductName).to.deep.equal(sheet.primaryProductName);
    expect(result.sheet[':names']).to.deep.equal(sheet[':names']);
    expect(result.sheet[':version']).to.equal(3);
    expect(sheet).to.deep.equal(original);
  });

  it('removes only missing rows in the selected exact group when opted in', () => {
    const sheet = makeSheet();
    const result = reconcileSheet(sheet, GROUP, incoming, true);

    expect(result.removed.map(({ name }) => name)).to.deep.equal([`${GROUP}/retired`]);
    expect(result.sheet['CaaS tags'].data.map(({ name }) => name)).to.deep.equal([
      `${GROUP}/one`, 'caas:blog-authors/other', 'caas:products/analytics', `${GROUP}/new`,
    ]);
    expect(result.sheet['CaaS tags']).to.include({ total: 4, limit: 4, offset: 0 });
    expect(reconcileSheet(sheet, GROUP, incoming).sheet['CaaS tags'].data).to.have.length(5);
  });

  it('retains existing duplicate rows and supports an explicitly empty API group safely', async () => {
    const sheet = makeSheet();
    sheet['CaaS tags'].data.push({ name: `${GROUP}/one`, title: 'Another old title' });
    sheet['CaaS tags'].total = 5;
    const updated = reconcileSheet(sheet, GROUP, incoming);
    expect(updated.updated).to.have.length(2);
    expect(updated.sheet['CaaS tags'].data.filter(({ name }) => name === `${GROUP}/one`)).to.have.length(2);

    fetchStub.resolves(jsonResponse(taxonomy()));
    const empty = await fetchGroupTags(GROUP);
    expect(reconcileSheet(sheet, GROUP, empty).removed).to.deep.equal([]);
    expect(reconcileSheet(sheet, GROUP, empty, true).sheet['CaaS tags'].data
      .map(({ name }) => name)).to.deep.equal(['caas:blog-authors/other', 'caas:products/analytics']);
  });

  it('rejects partial sheets and unexpected tag schemas instead of risking data loss', () => {
    const sheet = makeSheet();
    sheet['CaaS tags'].total = 99;
    expect(() => reconcileSheet(sheet, GROUP, incoming)).to.throw('Only part');
    expect(() => reconcileSheet({}, GROUP, incoming)).to.throw('name and a title');
    expect(() => reconcileSheet(makeSheet(), GROUP, [{ name: 'caas:products/other', title: 'Other' }])).to.throw('do not belong');
  });

  it('reports API and sheet authentication failures without producing an update', async () => {
    fetchStub.rejects(new Error('Network failed'));
    expect((await failure(fetchGroups())).message).to.include('Could not load');
    for (const status of [401, 403]) {
      const daFetch = sinon.stub().resolves(new Response(null, { status }));
      const error = await failure(readSheet(daFetch));
      expect(error.message).to.include(status === 401 ? 'sign-in expired' : 'do not have access');
    }
  });

  it('rechecks the source, backs it up, saves multipart JSON, verifies it and refreshes preview only', async () => {
    const baseline = makeSheet();
    const next = reconcileSheet(baseline, GROUP, incoming).sheet;
    const daFetch = sinon.stub();
    daFetch.onCall(0).resolves(jsonResponse(baseline));
    daFetch.onCall(1).resolves(new Response());
    daFetch.onCall(2).resolves(new Response());
    daFetch.onCall(3).resolves(jsonResponse(next));
    daFetch.onCall(4).resolves(new Response());

    expect(await saveSheet(daFetch, baseline, next)).to.equal(true);
    expect(daFetch.getCalls().map(({ args }) => [args[0], args[1].method || 'GET'])).to.deep.equal([
      [SOURCE_URL, 'GET'],
      ['https://admin.da.live/versionsource/adobecom/milo/drafts/bmarshal/tags.json', 'POST'],
      [SOURCE_URL, 'PUT'],
      [SOURCE_URL, 'GET'],
      [PREVIEW_URL, 'POST'],
    ]);
    const form = daFetch.getCall(2).args[1].body;
    expect(form).to.be.instanceOf(FormData);
    expect([...form.keys()]).to.deep.equal(['data']);
    expect(form.get('data').type).to.equal('application/json');
    expect(JSON.parse(await form.get('data').text())).to.deep.equal(next);
  });

  it('does not write if another editor changed the sheet or a backup fails', async () => {
    const baseline = makeSheet();
    const next = reconcileSheet(baseline, GROUP, incoming).sheet;
    const changed = JSON.parse(JSON.stringify(baseline));
    changed.primaryProductName.data.push({ name: 'new-product', title: 'New product' });
    const conflict = sinon.stub().resolves(jsonResponse(changed));
    expect((await failure(saveSheet(conflict, baseline, next))).message).to.include('sheet changed');
    expect(conflict.callCount).to.equal(1);

    const backupFailure = sinon.stub();
    backupFailure.onFirstCall().resolves(jsonResponse(baseline));
    backupFailure.onSecondCall().resolves(new Response(null, { status: 500 }));
    expect((await failure(saveSheet(backupFailure, baseline, next))).message).to.include('backup');
    expect(backupFailure.callCount).to.equal(2);
  });

  it('does not preview a failed or unverified save', async () => {
    const baseline = makeSheet();
    const next = reconcileSheet(baseline, GROUP, incoming).sheet;
    const failed = sinon.stub();
    failed.onCall(0).resolves(jsonResponse(baseline));
    failed.onCall(1).resolves(new Response());
    failed.onCall(2).resolves(new Response(null, { status: 500 }));
    expect((await failure(saveSheet(failed, baseline, next))).message).to.include('could not confirm');
    expect(failed.callCount).to.equal(3);

    const unverified = sinon.stub();
    unverified.onCall(0).resolves(jsonResponse(baseline));
    unverified.onCall(1).resolves(new Response());
    unverified.onCall(2).resolves(new Response());
    unverified.onCall(3).resolves(jsonResponse(baseline));
    expect((await failure(saveSheet(unverified, baseline, next))).message).to.include('was saved');
    expect(unverified.callCount).to.equal(4);
  });

  it('reports saved-but-preview-failed separately and can retry preview without saving again', async () => {
    const baseline = makeSheet();
    const next = reconcileSheet(baseline, GROUP, incoming).sheet;
    const daFetch = sinon.stub();
    daFetch.onCall(0).resolves(jsonResponse(baseline));
    daFetch.onCall(1).resolves(new Response());
    daFetch.onCall(2).resolves(new Response());
    daFetch.onCall(3).resolves(jsonResponse(next));
    daFetch.onCall(4).resolves(new Response(null, { status: 503 }));
    daFetch.onCall(5).resolves(new Response());

    expect(await saveSheet(daFetch, baseline, next)).to.equal(false);
    expect(await refreshPreview(daFetch)).to.equal(true);
    expect(daFetch.getCall(5).args).to.deep.equal([PREVIEW_URL, { method: 'POST' }]);
    expect(daFetch.getCalls().filter(({ args }) => args[1].method === 'PUT')).to.have.length(1);
  });
});
