import { expect } from '@esm-bundle/chai';

const { extractUrlsFromText, extractUrlsFromXlsx } = await import('../../../libs/blocks/project-tracking/xlsx.js');

// Minimal STORED (uncompressed) zip so the round-trip exercises the central-directory
// walk without depending on DecompressionStream.
function storedZip(files) {
  const enc = new TextEncoder();
  const locals = [];
  const centrals = [];
  let offset = 0;
  files.forEach(({ name, content }) => {
    const nameB = enc.encode(name);
    const dataB = enc.encode(content);
    const lh = new Uint8Array(30 + nameB.length + dataB.length);
    const lv = new DataView(lh.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(8, 0, true);
    lv.setUint32(18, dataB.length, true);
    lv.setUint32(22, dataB.length, true);
    lv.setUint16(26, nameB.length, true);
    lh.set(nameB, 30);
    lh.set(dataB, 30 + nameB.length);
    const ch = new Uint8Array(46 + nameB.length);
    const cv = new DataView(ch.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(10, 0, true);
    cv.setUint32(20, dataB.length, true);
    cv.setUint32(24, dataB.length, true);
    cv.setUint16(28, nameB.length, true);
    cv.setUint32(42, offset, true);
    ch.set(nameB, 46);
    locals.push(lh);
    centrals.push(ch);
    offset += lh.length;
  });
  const cdSize = centrals.reduce((s, c) => s + c.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, offset, true);
  const out = new Uint8Array(offset + cdSize + 22);
  let p = 0;
  [...locals, ...centrals, eocd].forEach((chunk) => { out.set(chunk, p); p += chunk.length; });
  return out.buffer;
}

describe('project-tracking xlsx — extractUrlsFromText', () => {
  it('keeps only trackable hosts (aem.page/live, business[.stage].adobe.com)', () => {
    const text = [
      'https://main--da-bacom--adobecom.aem.page/de/x',
      'https://main--da-cc--adobecom.aem.live/y',
      'https://business.adobe.com/products/z',
      'https://business.stage.adobe.com/products/z2',
      'https://www.google.com/nope',
      'https://example.com/nope',
    ].join(' ');
    expect(extractUrlsFromText(text)).to.eql([
      'https://main--da-bacom--adobecom.aem.page/de/x',
      'https://main--da-cc--adobecom.aem.live/y',
      'https://business.adobe.com/products/z',
      'https://business.stage.adobe.com/products/z2',
    ]);
  });

  it('dedupes and strips trailing punctuation', () => {
    const text = 'see https://main--da-bacom--adobecom.aem.page/a, and https://main--da-bacom--adobecom.aem.page/a).';
    expect(extractUrlsFromText(text)).to.eql(['https://main--da-bacom--adobecom.aem.page/a']);
  });

  it('unescapes XML entities before matching, incl. &amp; (no double-unescape)', () => {
    const text = 'href=&quot;https://main--da-bacom--adobecom.aem.page/a?x=1&amp;y=2&quot;';
    expect(extractUrlsFromText(text)).to.eql(['https://main--da-bacom--adobecom.aem.page/a?x=1&y=2']);
  });

  it('empty / no-match input → []', () => {
    expect(extractUrlsFromText('')).to.eql([]);
    expect(extractUrlsFromText('no urls here')).to.eql([]);
  });
});

describe('project-tracking xlsx — extractUrlsFromXlsx', () => {
  it('round-trips a stored sheet through the zip reader', async () => {
    const buf = storedZip([{
      name: 'xl/worksheets/sheet1.xml',
      content: '<worksheet><a href="https://main--da-bacom--adobecom.aem.page/de/fixture">x</a></worksheet>',
    }]);
    const urls = await extractUrlsFromXlsx(buf);
    expect(urls).to.eql(['https://main--da-bacom--adobecom.aem.page/de/fixture']);
  });
});
