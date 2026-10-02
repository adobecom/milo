import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig } = await import('../../../../libs/utils/utils.js');
const { crc32, zip, escapeXml } = await import('../../../../libs/features/mep/mep-next/mep-export/mep-export-ooxml.js');
const { default: buildXlsx } = await import('../../../../libs/features/mep/mep-next/mep-export/mep-export-xlsx.js');
const { default: buildDocx } = await import('../../../../libs/features/mep/mep-next/mep-export/mep-export-docx.js');

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

  it('puts Summary first, then one sheet per manifest', () => {
    const doc = new DOMParser().parseFromString(files['xl/workbook.xml'], 'application/xml');
    const names = [...doc.getElementsByTagName('sheet')].map((s) => s.getAttribute('name'));
    expect(names[0]).to.equal('Summary');
    expect(names).to.have.length(1 + DATA.manifests.length);
    expect(names[1]).to.equal('1. a & b.json');
  });

  it('keeps sheet names unique and within 31 characters', () => {
    const doc = new DOMParser().parseFromString(files['xl/workbook.xml'], 'application/xml');
    const names = [...doc.getElementsByTagName('sheet')].map((s) => s.getAttribute('name'));
    expect(new Set(names.map((n) => n.toLowerCase())).size).to.equal(names.length);
    names.forEach((name) => expect(name.length).to.be.at.most(31));
  });

  it('writes the summary breakdown into the first sheet', () => {
    const sheet = files['xl/worksheets/sheet1.xml'];
    ['Manifest Sources', 'Consent', 'Level 2 | Performance', 'https://www.adobe.com/test'].forEach((text) => {
      expect(sheet).to.include(text);
    });
  });

  it('writes manifest rows, status and variants into the manifest sheet', () => {
    const sheet = files['xl/worksheets/sheet2.xml'];
    ['Camp &lt;1&gt;', 'Ineligible', 'User country is restricted.', 'Variants', 'Selected'].forEach((text) => {
      expect(sheet).to.include(text);
    });
  });

  it('registers every sheet in content types and workbook relationships', () => {
    const count = DATA.manifests.length + 1;
    expect(files['[Content_Types].xml'].match(/worksheets\/sheet\d+\.xml/g)).to.have.length(count);
    expect(files['xl/_rels/workbook.xml.rels'].match(/worksheets\/sheet\d+\.xml/g)).to.have.length(count);
  });
});

describe('mep-export-docx', () => {
  let files;

  before(async () => {
    const blob = buildDocx(DATA);
    expect(blob.type).to.equal('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    files = await readZip(blob);
  });

  it('contains only well-formed XML parts', () => {
    expectWellFormed(files);
  });

  it('uses heading styles to build a hierarchy', () => {
    const doc = files['word/document.xml'];
    expect(doc).to.include('<w:pStyle w:val="Title"/>');
    expect((doc.match(/w:val="Heading1"/g) ?? []).length).to.equal(2);
    expect((doc.match(/w:val="Heading2"/g) ?? []).length).to.equal(DATA.summary.length + DATA.manifests.length);
    expect(doc).to.include('w:val="Heading3"');
    ['Heading1', 'Heading2', 'Heading3'].forEach((id) => {
      expect(files['word/styles.xml']).to.include(`w:styleId="${id}"`);
    });
  });

  it('writes summary, manifest and status content', () => {
    const doc = files['word/document.xml'];
    ['Manifest Sources', 'Camp &lt;1&gt;', 'Warning: Ineligible', 'Error: Error', 'Default (control)'].forEach((text) => {
      expect(doc).to.include(text);
    });
  });

  it('handles an empty export', async () => {
    const empty = await readZip(buildDocx({ ...DATA, summary: [], manifests: [] }));
    expectWellFormed(empty);
    expect(empty['word/document.xml']).to.include('No manifests found.');
  });
});

describe('mep-export sidebar', () => {
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
    document.querySelectorAll('#mep-drawer, .mep-fab, .mep-export-sidebar').forEach((el) => el.remove());
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

  it('groups xlsx and docx exports in a sidebar beneath the separate MEP FAB', () => {
    const sidebar = document.querySelector('.mep-export-sidebar');
    const [xlsx, docx] = sidebar.querySelectorAll('.mep-export-fab');
    expect(sidebar.getAttribute('role')).to.equal('group');
    expect(sidebar.contains(document.querySelector('.mep-fab'))).to.be.false;
    expect(xlsx.getAttribute('aria-label')).to.equal('Export to Excel');
    expect(docx.getAttribute('aria-label')).to.equal('Export to Word');
    expect(parseFloat(sidebar.style.top)).to.equal(50 + 24 + 48);
  });

  it('each export has an SVG icon and its own associated tooltip', () => {
    document.querySelectorAll('.mep-export-fab').forEach((fab) => {
      const tooltip = document.getElementById(fab.getAttribute('aria-describedby'));
      expect(fab.querySelector('svg')).to.exist;
      expect(tooltip.getAttribute('role')).to.equal('tooltip');
      expect(tooltip.textContent).to.equal(fab.getAttribute('aria-label'));
    });
  });

  it('xlsx FAB downloads a workbook starting with the Summary sheet', async () => {
    const [xlsxFab] = document.querySelectorAll('.mep-export-fab');
    const blob = await clickAndWait(xlsxFab);
    const files = await readZip(blob);
    expect(files['xl/workbook.xml']).to.include('name="Summary"');
    expect(xlsxFab.hasAttribute('aria-busy')).to.be.false;
  });

  it('docx FAB downloads a document', async () => {
    const docxFab = document.querySelectorAll('.mep-export-fab')[1];
    const blob = await clickAndWait(docxFab);
    const files = await readZip(blob);
    expect(files['word/document.xml']).to.include('MEP Overlay Export');
    expect(clickStub.called).to.be.true;
  });
});
