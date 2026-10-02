import { XML_HEADER, escapeXml, zip } from './mep-export-ooxml.js';

const MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const PKG_REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';

const CONTENT_WIDTH = 9360;
const LABEL_WIDTH = 2800;
const COLORS = { green: '228800', lightGreen: 'E8F3E4', error: 'F8D7DA', warning: 'FFF3CD' };

function runs(text, { bold = false, color = '' } = {}) {
  const props = `${bold ? '<w:b/>' : ''}${color ? `<w:color w:val="${color}"/>` : ''}`;
  return String(text ?? '')
    .split('\n')
    .map((line, i) => `<w:r>${props ? `<w:rPr>${props}</w:rPr>` : ''}${i ? '<w:br/>' : ''}<w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r>`)
    .join('');
}

function para(text, { style = '', pPr = '', ...runOpts } = {}) {
  const props = `${style ? `<w:pStyle w:val="${style}"/>` : ''}${pPr}`;
  return `<w:p>${props ? `<w:pPr>${props}</w:pPr>` : ''}${runs(text, runOpts)}</w:p>`;
}

function cellXml(width, content, fill = '') {
  const shade = fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>` : '';
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/>${shade}</w:tcPr>${content}</w:tc>`;
}

function table(rows, widths, { header = false } = {}) {
  const grid = widths.map((w) => `<w:gridCol w:w="${w}"/>`).join('');
  const body = rows.map((row, r) => {
    const isHeader = header && r === 0;
    const trPr = isHeader ? '<w:trPr><w:cantSplit/><w:tblHeader/></w:trPr>' : '<w:trPr><w:cantSplit/></w:trPr>';
    return `<w:tr>${trPr}${row.map(({ text, ...opts }, c) => {
      const fill = isHeader ? COLORS.green : opts.fill;
      const cellPara = para(text, {
        bold: isHeader || opts.bold,
        color: isHeader ? 'FFFFFF' : opts.color,
        pPr: opts.indent ? `<w:ind w:left="${opts.indent}"/>` : '',
      });
      return cellXml(widths[c], cellPara, fill);
    }).join('')}</w:tr>`;
  }).join('');
  return `<w:tbl><w:tblPr><w:tblStyle w:val="MepTable"/><w:tblW w:w="${CONTENT_WIDTH}" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${body}</w:tbl>`;
}

const labelCell = (text, extra = {}) => ({ text, bold: true, fill: COLORS.lightGreen, ...extra });
const valueCell = (text, extra = {}) => ({ text, ...extra });
const spacer = () => '<w:p/>';
const KV_WIDTHS = [LABEL_WIDTH, CONTENT_WIDTH - LABEL_WIDTH];

function summaryRows(pairs) {
  return pairs.flatMap(([label, value]) => {
    if (!Array.isArray(value)) return [[labelCell(label), valueCell(value)]];
    return [
      [labelCell(label), valueCell('')],
      ...value.map(([subLabel, subValue]) => [
        valueCell(subLabel, { indent: 360 }),
        valueCell(subValue),
      ]),
    ];
  });
}

function buildSummary(data) {
  const parts = [para('Summary', { style: 'Heading1' })];
  data.summary.forEach(({ title, rows }) => {
    parts.push(para(title, { style: 'Heading2' }));
    parts.push(rows.length ? table(summaryRows(rows), KV_WIDTHS) : para('No data available.'));
    parts.push(spacer());
  });
  return parts;
}

function buildStatus(status) {
  if (!status) return [];
  const fill = status.level === 'error' ? COLORS.error : COLORS.warning;
  const shade = `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>`;
  return [
    para(`${status.level === 'error' ? 'Error' : 'Warning'}: ${status.label}`, { bold: true, pPr: shade }),
    ...status.messages.map((message) => para(`\u2022 ${message}`, { pPr: `${shade}<w:ind w:left="360"/>` })),
    spacer(),
  ];
}

function buildManifest(manifest, isFirst) {
  const pageBreak = isFirst ? '' : '<w:pageBreakBefore/>';
  const parts = [
    para(`${manifest.index}. ${manifest.name}`, { style: 'Heading2', pPr: pageBreak }),
    para(manifest.url, { style: 'Url' }),
    ...buildStatus(manifest.status),
  ];
  if (manifest.rows.length) {
    parts.push(para('Details', { style: 'Heading3' }));
    const detailRows = manifest.rows.map(([label, value]) => [labelCell(label), valueCell(value)]);
    parts.push(table(detailRows, KV_WIDTHS));
    parts.push(spacer());
  }
  if (manifest.variants.length) {
    parts.push(para('Variants', { style: 'Heading3' }));
    parts.push(table([
      [{ text: 'Variant' }, { text: 'Selected' }],
      ...manifest.variants.map(({ label, selected }) => [
        valueCell(label, selected ? { bold: true, fill: COLORS.lightGreen } : {}),
        valueCell(selected ? 'Yes' : '', selected ? { fill: COLORS.lightGreen } : {}),
      ]),
    ], [CONTENT_WIDTH - 1600, 1600], { header: true }));
    parts.push(spacer());
  }
  return parts;
}

function buildManifests(data) {
  const parts = [para('Manifests', { style: 'Heading1', pPr: '<w:pageBreakBefore/>' })];
  if (!data.manifests.length) {
    parts.push(para('No manifests found.'));
    return parts;
  }
  parts.push(para(`${data.manifests.length} manifest${data.manifests.length === 1 ? '' : 's'} on this page.`));
  data.manifests.forEach((manifest, i) => parts.push(...buildManifest(manifest, i === 0)));
  return parts;
}

function buildDocument(data) {
  const body = [
    para('MEP Overlay Export', { style: 'Title' }),
    para(data.pageUrl, { style: 'Subtitle' }),
    para(`Exported ${data.exportedAt}`, { style: 'Subtitle' }),
    ...buildSummary(data),
    ...buildManifests(data),
  ].join('');
  const section = '<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1080" w:right="1440" w:bottom="1080" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/></w:sectPr>';
  return `${XML_HEADER}<w:document xmlns:w="${W_NS}"><w:body>${body}${section}</w:body></w:document>`;
}

function paragraphStyle({
  id, name, size, color = '222222', before = 0, after = 120, outline, extra = '', bold = true,
}) {
  const outlineXml = outline === undefined ? '' : `<w:outlineLvl w:val="${outline}"/>`;
  return `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/>`
    + `<w:pPr><w:keepNext/>${extra}<w:spacing w:before="${before}" w:after="${after}"/>${outlineXml}</w:pPr>`
    + `<w:rPr>${bold ? '<w:b/>' : ''}<w:color w:val="${color}"/><w:sz w:val="${size}"/></w:rPr></w:style>`;
}

function buildStyles() {
  const rule = `<w:pBdr><w:bottom w:val="single" w:sz="8" w:space="4" w:color="${COLORS.green}"/></w:pBdr>`;
  const cellBorder = (side) => `<w:${side} w:val="single" w:sz="4" w:space="0" w:color="BFBFBF"/>`;
  const heading = paragraphStyle;
  const borders = ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(cellBorder).join('');
  return [
    `${XML_HEADER}<w:styles xmlns:w="${W_NS}">`,
    '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/></w:rPr></w:rPrDefault>',
    '<w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="259" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>',
    '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>',
    heading({ id: 'Title', name: 'Title', size: 56, color: COLORS.green, after: 60 }),
    heading({
      id: 'Subtitle', name: 'Subtitle', size: 22, color: '666666', after: 40, bold: false,
    }),
    heading({
      id: 'Heading1',
      name: 'heading 1',
      size: 40,
      color: COLORS.green,
      before: 360,
      after: 160,
      outline: 0,
      extra: rule,
    }),
    heading({
      id: 'Heading2', name: 'heading 2', size: 30, before: 240, after: 120, outline: 1,
    }),
    heading({
      id: 'Heading3', name: 'heading 3', size: 24, color: '555555', before: 160, after: 80, outline: 2,
    }),
    '<w:style w:type="paragraph" w:customStyle="1" w:styleId="Url"><w:name w:val="Url"/><w:basedOn w:val="Normal"/>',
    '<w:rPr><w:i/><w:color w:val="666666"/><w:sz w:val="20"/></w:rPr></w:style>',
    '<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:uiPriority w:val="99"/>',
    '<w:tblPr><w:tblInd w:w="0" w:type="dxa"/><w:tblCellMar><w:top w:w="0" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="0" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>',
    '<w:style w:type="table" w:customStyle="1" w:styleId="MepTable"><w:name w:val="MepTable"/><w:basedOn w:val="TableNormal"/>',
    `<w:tblPr><w:tblBorders>${borders}</w:tblBorders>`,
    '<w:tblCellMar><w:top w:w="60" w:type="dxa"/><w:left w:w="108" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:right w:w="108" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>',
    '</w:styles>',
  ].join('');
}

export default function buildDocx(data) {
  const contentTypes = `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
    + '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
    + '</Types>';
  const rootRels = `${XML_HEADER}<Relationships xmlns="${PKG_REL_NS}">`
    + `<Relationship Id="rId1" Type="${REL_NS}/officeDocument" Target="word/document.xml"/></Relationships>`;
  const documentRels = `${XML_HEADER}<Relationships xmlns="${PKG_REL_NS}">`
    + `<Relationship Id="rId1" Type="${REL_NS}/styles" Target="styles.xml"/></Relationships>`;

  return zip([
    { name: '[Content_Types].xml', content: contentTypes },
    { name: '_rels/.rels', content: rootRels },
    { name: 'word/document.xml', content: buildDocument(data) },
    { name: 'word/_rels/document.xml.rels', content: documentRels },
    { name: 'word/styles.xml', content: buildStyles() },
  ], MIME);
}
