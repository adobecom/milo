import service, { ErrorMessage, init, reset } from '../src/service.js';

import { mockFetch, unmockFetch } from './mocks/fetch.js';
import { mockIms, unmockIms } from './mocks/ims.js';
import { delay, expect } from './utils.js';

describe('service', () => {
  after(() => {
    unmockFetch();
    unmockIms();
  });

  afterEach(() => {
    reset();
  });

  before(async () => {
    await mockFetch();
    await mockIms();
  });

  it('getters throw if not initialised', () => {
    expect(() => service.ims).to.throw(ErrorMessage.init);
  });

  it('initialises for provided locale', async () => {
    const { settings } = await init(() => ({ locale: { prefix: 'mena_en' } }));
    expect(settings).to.deep.contain({
      country: 'DZ',
      language: 'en',
    });
  });

  it('uses IMS country code', async () => {
    await mockIms('CH');
    const instance = await init();
    await delay();
    unmockIms();
    expect(instance.ims.country).to.be.eventually.equal('CH');
  });

  it('destructs shared instance via call to reset', async () => {
    await init();
    reset();
    expect(() => service.ims).to.throw(ErrorMessage.init);
  });

  it('returns same object for subsequent inits', async () => {
    const instance = await init();
    expect(await init()).to.be.equal(instance);
    expect(await init()).to.be.equal(instance);
  });

  it('constructs new instance after reset', async () => {
    const instance = await init();
    expect(await init(null, true)).not.to.be.equal(instance);
  });

  it('provides frozen copy of defaults object', async () => {
    const instance = await init();
    expect(instance.defaults).to.be.frozen;
  });
});
