import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { decorateSectionAnalytics } from '../../libs/martech/attributes.js';

describe('Analytics', async () => {
  it('should decorate attributes without pzn', async () => {
    document.body.outerHTML = await readFile({ path: './mocks/body.html' });
    document.querySelectorAll('main > div').forEach((section, idx) => decorateSectionAnalytics(section, idx, { mep: {} }));
    const main = document.querySelector('main');
    expect(main?.getAttribute('daa-im')).to.equal('true');
    const section = document.querySelector('main > div');
    expect(section?.getAttribute('daa-lh')).to.equal('s1');
    const block = section.querySelector(':scope > div')?.getAttribute('daa-lh');
    expect(block).to.equal('b1|icon-block');
    const link = section.querySelector('#unit-test')?.getAttribute('daa-ll');
    expect(link).to.equal('Learn more-3--Learn more');
  });
  it('should decorate pzn with attributes', async () => {
    document.body.outerHTML = await readFile({ path: './mocks/body.html' });
    document.querySelectorAll('main > div').forEach((section, idx) => decorateSectionAnalytics(section, idx, { mep: { martech: '|smb|hp' } }));
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
