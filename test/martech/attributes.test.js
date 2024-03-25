import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { decorateSectionAnalytics, processTrackingLabels } from '../../libs/martech/attributes.js';

const expectedLinkValues = [
  'already-has-1',
  'Traditional Link-2--Second Traditional H',
  'Title Only Link-3--Tracking Header',
  'After bold-1--Bold text',
  'After strong-2--Strong text',
];

describe('Analytics', async () => {
  it('should decorate attributes without pzn', async () => {
    document.body.outerHTML = await readFile({ path: './mocks/body.html' });
    document.querySelectorAll('main > div').forEach((section, idx) => decorateSectionAnalytics(section, idx, { mep: {} }));

    const main = document.querySelector('main');
    expect(main?.getAttribute('daa-im')).to.equal('true');
    const section = document.querySelector('main > div');
    expect(section?.getAttribute('daa-lh')).to.equal('s1');
    const block = section.querySelector(':scope > div')?.getAttribute('daa-lh');
    expect(block).to.equal('b1|text');

    section.querySelectorAll('a').forEach((link, idx) => {
      expect(link.getAttribute('daa-ll')).to.equal(expectedLinkValues[idx]);
    });

    const cardLink = document.querySelector('.milo-card-section a');
    expect(cardLink.getAttribute('daa-ll')).to.equal('Learn more AI for gr-1--Header for tiles bel');
  });
  it('should decorate pzn with attributes', async () => {
    document.body.outerHTML = await readFile({ path: './mocks/body.html' });
    document.querySelectorAll('main > div').forEach((section, idx) => decorateSectionAnalytics(section, idx, { mep: { martech: '|smb|hp' } }));

    const main = document.querySelector('main');
    expect(main?.getAttribute('daa-im')).to.equal('true');
    const section = document.querySelector('main > div');
    expect(section?.getAttribute('daa-lh')).to.equal('s1');
    const block = section.querySelector(':scope > div')?.getAttribute('daa-lh');
    expect(block).to.equal('b1|text|smb|hp');

    section.querySelectorAll('a').forEach((link, idx) => {
      expect(link.getAttribute('daa-ll')).to.equal(expectedLinkValues[idx]);
    });
  });
  it('should process tracking labels', () => {
    const longString = 'This is a long string that should be truncated';
    const processedString = processTrackingLabels(longString, { locale: { ietf: 'en-US' } }, 20);
    expect(processedString).to.equal('This is a long strin');
  });
  it('should process tracking labels with foreign locale', () => {
    const translatedString = 'Comprar ahora';
    const processedString = processTrackingLabels(translatedString, {
      locale: { ietf: 'es-ES' },
      analyticLocalization: { 'Comprar ahora': 'Buy now' },
    }, 20);
    expect(processedString).to.equal('Buy now');
  });
});
