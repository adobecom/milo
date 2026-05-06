import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  findFragmentElements,
  checkFragmentPublished,
  checkUnpublishedFragments,
  runChecks,
} from '../../../../libs/blocks/preflight/checks/merch.js';
import { SEVERITY } from '../../../../libs/blocks/preflight/checks/constants.js';

const UUID_PUBLISHED = '11111111-1111-1111-1111-111111111111';
const UUID_UNPUBLISHED = '22222222-2222-2222-2222-222222222222';

function buildArea() {
  const area = document.createElement('div');
  area.innerHTML = `
    <merch-card>
      <aem-fragment fragment="${UUID_PUBLISHED}"></aem-fragment>
    </merch-card>
    <merch-card>
      <aem-fragment fragment="${UUID_UNPUBLISHED}"></aem-fragment>
    </merch-card>
  `;
  return area;
}

function stubFetch() {
  return sinon.stub(window, 'fetch').callsFake((url) => {
    const id = new URL(url).searchParams.get('id');
    if (id === UUID_PUBLISHED) return Promise.resolve({ status: 200 });
    if (id === UUID_UNPUBLISHED) return Promise.resolve({ status: 404 });
    return Promise.resolve({ status: 500 });
  });
}

describe('Preflight M@S Unpublished Fragments check', () => {
  let area;
  let fetchStub;

  beforeEach(() => {
    area = buildArea();
    fetchStub = stubFetch();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('findFragmentElements returns one entry per aem-fragment with closest merch-card', () => {
    const entries = findFragmentElements(area);
    expect(entries).to.have.length(2);
    expect(entries[0].uuid).to.equal(UUID_PUBLISHED);
    expect(entries[0].card.tagName).to.equal('MERCH-CARD');
    expect(entries[1].uuid).to.equal(UUID_UNPUBLISHED);
    expect(entries[1].card.tagName).to.equal('MERCH-CARD');
  });

  it('checkFragmentPublished returns published=true on 200', async () => {
    const result = await checkFragmentPublished(UUID_PUBLISHED, 'en_US');
    expect(result).to.deep.equal({ uuid: UUID_PUBLISHED, httpStatus: 200, published: true });
  });

  it('checkFragmentPublished returns published=false on 404', async () => {
    const result = await checkFragmentPublished(UUID_UNPUBLISHED, 'en_US');
    expect(result).to.deep.equal({ uuid: UUID_UNPUBLISHED, httpStatus: 404, published: false });
  });

  it('checkUnpublishedFragments reports 1 unpublished out of 2 scanned', async () => {
    const result = await checkUnpublishedFragments({ area, locale: 'en_US' });
    expect(result.scanned).to.equal(2);
    expect(result.unpublished).to.have.length(1);
    expect(result.unpublished[0].uuid).to.equal(UUID_UNPUBLISHED);
    expect(result.unpublished[0].httpStatus).to.equal(404);
  });

  it('runChecks resolves to fail with CRITICAL severity when there are unpublished fragments', async () => {
    const [promise] = runChecks({ area, locale: 'en_US', delayMs: 0 });
    const result = await promise;
    expect(result.status).to.equal('fail');
    expect(result.severity).to.equal(SEVERITY.CRITICAL);
    expect(result.details.unpublished).to.have.length(1);
  });

  it('runChecks resolves to pass when all fragments are published', async () => {
    const cleanArea = document.createElement('div');
    cleanArea.innerHTML = `
      <merch-card>
        <aem-fragment fragment="${UUID_PUBLISHED}"></aem-fragment>
      </merch-card>
    `;
    const [promise] = runChecks({ area: cleanArea, locale: 'en_US', delayMs: 0 });
    const result = await promise;
    expect(result.status).to.equal('pass');
    expect(result.severity).to.equal(SEVERITY.CRITICAL);
  });

  it('builds the API URL with api_key and underscore locale', async () => {
    await checkFragmentPublished(UUID_PUBLISHED, 'en_US');
    const url = fetchStub.firstCall.args[0];
    expect(url).to.include('api_key=wcms-commerce-ims-ro-user-milo');
    expect(url).to.include('locale=en_US');
    expect(url).to.include(`id=${UUID_PUBLISHED}`);
  });
});
