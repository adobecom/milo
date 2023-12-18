import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

describe('Analytics', async () => {
  beforeEach(async () => {
    await readFile({ path: './mocks/body.html' });
    const analytics = await import('../../libs/martech/attributes.js');
    document.body.outerHTML = await readFile({ path: './mocks/body.html' });
    document.querySelectorAll('main > div').forEach((section, idx) => analytics.decorateSectionAnalytics(section, idx));
  });
  it('should decorate with attributes', async () => {
    const main = document.querySelector('main');
    expect(main?.getAttribute('daa-im')).to.equal('true');
    const section = document.querySelector('main > div');
    expect(section?.getAttribute('daa-lh')).to.equal('s1');
    const block = section.querySelector(':scope > div')?.getAttribute('daa-lh');
    expect(block).to.equal('b1|icon-block|smb|hp');
    const link = section.querySelector('#unit-test')?.getAttribute('daa-ll');
    expect(link).to.equal('Learn more-3--Learn more');
  });
});
