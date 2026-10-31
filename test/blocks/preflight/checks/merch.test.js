import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  findFragmentElements,
  checkFragmentPublished,
  checkUnpublishedFragments,
  findStaticPrices,
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

describe('Preflight static prices check', () => {
  let area;

  const pricesIn = (markup) => {
    area.innerHTML = markup;
    return findStaticPrices(area).map(({ text }) => text);
  };

  beforeEach(() => {
    area = document.createElement('div');
    document.body.append(area);
  });

  afterEach(() => {
    area.remove();
  });

  it('finds static prices across locales and formats', () => {
    expect(pricesIn(`
      <p>学生以外の方の価格は9,080 円/月です</p>
      <p>月々¥2,380でご利用いただけます</p>
      <p>또는 에₩30,300/월</p>
      <p>Assine por R$ 109,99/mês</p>
      <p>Only A$21.99/mo</p>
      <p>Ab CHF 26.75 pro Monat</p>
      <p>Nur 17,99 €/Monat</p>
      <p>Previously US$20.99, now US$22.99 per month</p>
      <p>Save with USD 599.88/yr</p>
      <p>Get it for 22.99/mo</p>
    `)).to.deep.equal([
      '9,080 円/月',
      '¥2,380',
      '₩30,300/월',
      'R$ 109,99/mês',
      'A$21.99/mo',
      'CHF 26.75',
      '17,99 €/Monat',
      'US$20.99',
      'US$22.99 per month',
      'USD 599.88/yr',
      '22.99/mo',
    ]);
  });

  it('ignores dynamic prices, magnitudes, non-prices and script text', () => {
    expect(pricesIn(`
      <p>Now <span is="inline-price" data-wcs-osi="a"><span>US$22.99/mo</span></span></p>
      <p><a is="checkout-link" data-wcs-osi="b" href="#">Buy for $9.99</a></p>
      <merch-card><p slot="body-xs">$4.99/mo</p></merch-card>
      <mas-field><span>€12,09</span></mas-field>
      <p>A $54 billion market, a $15K prize, a 5万円 budget</p>
      <p>Save 40% with version 2025, call 800-833-6687</p>
      <script>const price = '$9.99';</script>
      <style>.x::after { content: '$9.99'; }</style>
      <noscript>$9.99/mo</noscript>
      <template><p>$9.99/mo</p></template>
      <p>Support Mo–Fr. 9–17 Uhr, Mo-Fr. 8:00</p>
    `)).to.deep.equal([]);
  });

  it('marks static prices in hidden content and keeps a short snippet', () => {
    area.innerHTML = `
      <p>Visible plan from $9.99/mo for everyone.</p>
      <div style="display: none"><p>Hidden tab price ¥1,078/月</p></div>`;
    const [visible, hidden] = findStaticPrices(area);
    expect(visible).to.include({ text: '$9.99/mo', snippet: 'Visible plan from $9.99/mo for everyone.', hidden: false });
    expect(hidden).to.include({ text: '¥1,078/月', hidden: true });
    expect(hidden.element.tagName).to.equal('P');
  });

  it('only scans main when the area contains it', () => {
    area.innerHTML = '<header>$5.99/mo</header><main><p>$7.99/mo</p></main>';
    expect(findStaticPrices(area).map(({ text }) => text)).to.deep.equal(['$7.99/mo']);
  });

  it('runChecks fails with CRITICAL severity when static prices are found', async () => {
    area.innerHTML = '<p>Only $9.99/mo</p>';
    const [, promise] = runChecks({ area, delayMs: 0 });
    const result = await promise;
    expect(result).to.include({ checkId: 'static-prices', title: 'Static prices', status: 'fail', severity: SEVERITY.CRITICAL });
    expect(result.details.prices.map(({ text }) => text)).to.deep.equal(['$9.99/mo']);
  });

  it('runChecks passes when every price is dynamic', async () => {
    area.innerHTML = '<p>Now <span is="inline-price" data-wcs-osi="a">US$22.99/mo</span></p>';
    const [, promise] = runChecks({ area, delayMs: 0 });
    const result = await promise;
    expect(result).to.include({ status: 'pass', severity: SEVERITY.CRITICAL });
    expect(result.details.prices).to.deep.equal([]);
  });
});
