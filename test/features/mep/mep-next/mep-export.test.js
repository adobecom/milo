import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../../libs/utils/utils.js');
const { crc32, zip, escapeXml } = await import('../../../../libs/features/mep/mep-next/mep-export/mep-export-ooxml.js');
const { default: buildXlsx } = await import('../../../../libs/features/mep/mep-next/mep-export/mep-export-xlsx.js');

const decoder = new TextDecoder();

async function readZip(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const view = new DataView(bytes.buffer);
  const eocd = bytes.length - 22;
  expect(view.getUint32(eocd, true)).to.equal(0x06054b50);
  const count = view.getUint16(eocd + 10, true);
  let pos = view.getUint32(eocd + 16, true);
  const files = {};
  for (let i = 0; i < count; i += 1) {
    expect(view.getUint32(pos, true)).to.equal(0x02014b50);
    const crc = view.getUint32(pos + 16, true);
    const size = view.getUint32(pos + 24, true);
    const nameLen = view.getUint16(pos + 28, true);
    const localOffset = view.getUint32(pos + 42, true);
    const name = decoder.decode(bytes.slice(pos + 46, pos + 46 + nameLen));
    const localNameLen = view.getUint16(localOffset + 26, true);
    const start = localOffset + 30 + localNameLen;
    const data = bytes.slice(start, start + size);
    expect(crc32(data), `crc of ${name}`).to.equal(crc);
    files[name] = decoder.decode(data);
    pos += 46 + nameLen;
  }
  return files;
}

function expectWellFormed(files) {
  Object.entries(files).forEach(([name, text]) => {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    expect(doc.querySelector('parsererror'), `${name} is well-formed`).to.be.null;
  });
}

const DATA = {
  pageUrl: 'https://www.adobe.com/test',
  exportedAt: 'Oct 2, 2026',
  summary: [
    { title: 'Page', rows: [['Manifests Found', '2'], ['Manifest Sources', [['Page', '1'], ['Promo', '2']]]] },
    { title: 'Consent', rows: [['Level 2 | Performance', 'on']] },
  ],
  manifests: [
    {
      index: 1,
      name: 'a & b.json',
      url: 'https://www.adobe.com/a.json',
      status: { level: 'warning', label: 'Ineligible', messages: ['User country is restricted.'] },
      rows: [['Campaign', 'Camp <1>'], ['Source', 'mep']],
      variants: [{ label: 'Default (control)', selected: false }, { label: 'v1', selected: true }],
    },
    {
      index: 1,
      name: 'a & b.json',
      url: 'https://www.adobe.com/dup.json',
      status: null,
      rows: [['Source', 'mep']],
      variants: [],
    },
    {
      index: 3,
      name: 'broken.json',
      url: 'https://www.adobe.com/broken.json',
      status: { level: 'error', label: 'Error', messages: ['broken.json not found.'] },
      rows: [],
      variants: [],
    },
    {
      index: 4,
      name: 'a-very-long-manifest-file-name-that-exceeds-the-excel-limit.json',
      url: 'https://www.adobe.com/long.json',
      status: null,
      rows: [],
      variants: [],
    },
  ],
};

describe('mep-export-ooxml', () => {
  it('crc32 matches the known check value', () => {
    expect(crc32(new TextEncoder().encode('123456789'))).to.equal(0xCBF43926);
  });

  it('escapeXml escapes markup and drops control characters', () => {
    expect(escapeXml('<a href="x">&</a>\u0001')).to.equal('&lt;a href=&quot;x&quot;&gt;&amp;&lt;/a&gt;');
  });

  it('zip round-trips file names and contents', async () => {
    const blob = zip([
      { name: 'one.txt', content: 'hello' },
      { name: 'dir/two.txt', content: new Uint8Array([1, 2, 3]) },
    ], 'application/zip');
    expect(blob.type).to.equal('application/zip');
    const files = await readZip(blob);
    expect(Object.keys(files)).to.deep.equal(['one.txt', 'dir/two.txt']);
    expect(files['one.txt']).to.equal('hello');
  });
});

describe('mep-export-xlsx', () => {
  let files;

  before(async () => {
    const blob = buildXlsx(DATA);
    expect(blob.type).to.equal('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    files = await readZip(blob);
  });

  it('contains only well-formed XML parts', () => {
    expectWellFormed(files);
  });

  it('puts Summary first, then a single Manifests sheet', () => {
    const doc = new DOMParser().parseFromString(files['xl/workbook.xml'], 'application/xml');
    const names = [...doc.getElementsByTagName('sheet')].map((s) => s.getAttribute('name'));
    expect(names).to.deep.equal(['Summary', 'Manifests']);
  });

  it('omits the Manifests sheet when there are no manifests', async () => {
    const empty = await readZip(buildXlsx({ ...DATA, manifests: [] }));
    expectWellFormed(empty);
    expect(Object.keys(empty).filter((name) => name.startsWith('xl/worksheets/'))).to.have.length(1);
  });

  it('writes the summary breakdown into the first sheet', () => {
    const sheet = files['xl/worksheets/sheet1.xml'];
    ['Manifest Sources', 'Consent', 'Level 2 | Performance', 'https://www.adobe.com/test'].forEach((text) => {
      expect(sheet).to.include(text);
    });
  });

  it('lays manifests out as columns beneath sticky labels', () => {
    const sheet = files['xl/worksheets/sheet2.xml'];
    const doc = new DOMParser().parseFromString(sheet, 'application/xml');
    const pane = doc.querySelector('pane');
    expect(pane.getAttribute('xSplit')).to.equal('1');
    expect(pane.getAttribute('ySplit')).to.equal('1');
    expect(pane.getAttribute('state')).to.equal('frozen');
    const firstRow = [...doc.querySelectorAll('row')[0].querySelectorAll('c')];
    expect(firstRow).to.have.length(1 + DATA.manifests.length);
    expect(firstRow[0].getAttribute('s')).to.equal('3');
    ['URL', 'Status', 'Campaign', 'Source', 'Variant List'].forEach((label) => {
      expect(sheet).to.include(`>${label}</t>`);
    });
    ['https://www.adobe.com/a.json', 'https://www.adobe.com/long.json', 'Camp &lt;1&gt;', 'User country is restricted.', 'v1'].forEach((text) => {
      expect(sheet).to.include(text);
    });
  });

  it('registers every sheet in content types and workbook relationships', () => {
    const count = 2;
    expect(files['[Content_Types].xml'].match(/worksheets\/sheet\d+\.xml/g)).to.have.length(count);
    expect(files['xl/_rels/workbook.xml.rels'].match(/worksheets\/sheet\d+\.xml/g)).to.have.length(count);
  });
});

describe('mep-export header action', () => {
  const config = {
    miloLibs: 'https://main--milo--adobecom.aem.live/libs',
    codeRoot: 'https://main--homepage--adobecom.aem.live/homepage',
    locale: { ietf: 'en-US', tk: 'hah7vzn.css', prefix: '', region: 'us', regions: {} },
    mep: { experiments: [], prefix: '', highlight: true, targetEnabled: true, consentState: { functional: true, advertising: true } },
    env: { name: 'stage' },
  };
  let fetchStub;
  let createUrlStub;
  let clickStub;
  let headerEl;
  let blobs;

  before(async () => {
    fetchStub = sinon.stub(window, 'fetch').callsFake(() => Promise.resolve({ ok: false, status: 404, json: async () => ({}), text: async () => '' }));
    setConfig(config);
    blobs = [];
    createUrlStub = sinon.stub(URL, 'createObjectURL').callsFake((blob) => {
      blobs.push(blob);
      return 'blob:mep-test';
    });
    sinon.stub(URL, 'revokeObjectURL');
    clickStub = sinon.stub(HTMLAnchorElement.prototype, 'click');
    document.body.replaceChildren();
    headerEl = document.createElement('header');
    headerEl.getBoundingClientRect = () => ({ bottom: 50 });
    document.body.prepend(headerEl);
    const { default: init } = await import('../../../../libs/features/mep/mep-next/mep-overlay/mep-overlay.js');
    await init();
  });

  after(() => {
    fetchStub.restore();
    createUrlStub.restore();
    URL.revokeObjectURL.restore();
    clickStub.restore();
    headerEl.remove();
    document.querySelectorAll('#mep-drawer, .mep-fab').forEach((el) => el.remove());
  });

  async function clickAndWait(fab) {
    const before = blobs.length;
    fab.click();
    await new Promise((resolve) => {
      const poll = setInterval(() => {
        if (blobs.length > before && !fab.disabled) { clearInterval(poll); resolve(); }
      }, 20);
    });
    return blobs[blobs.length - 1];
  }

  it('adds export and dock icon buttons to the drawer header actions', () => {
    const buttons = [...document.querySelectorAll('.mep-header .mep-nav-actions button')];
    expect(buttons.map((b) => b.className)).to.deep.equal([
      'mep-export',
      'mep-align-toggle',
      'icon-close',
    ]);
    const [exportBtn, alignBtn] = buttons;
    expect(exportBtn.getAttribute('aria-label')).to.equal('Export Page Data');
    expect(exportBtn.hasAttribute('title')).to.be.false;
    expect(alignBtn.getAttribute('aria-label')).to.equal('Orient Overlay');
    expect(alignBtn.hasAttribute('title')).to.be.false;
    expect(exportBtn.textContent).to.equal('');
    expect(exportBtn.querySelector('svg')).to.exist;
    expect(document.querySelector('.mep-export-sidebar')).to.be.null;
  });

  it('export button downloads a workbook starting with the Summary sheet', async () => {
    const button = document.querySelector('.mep-export');
    const blob = await clickAndWait(button);
    const files = await readZip(blob);
    expect(files['xl/workbook.xml']).to.include('name="Summary"');
    expect(button.hasAttribute('aria-busy')).to.be.false;
    expect(clickStub.called).to.be.true;
  });
});
