import { XML_HEADER, escapeXml, zip } from './mep-export-ooxml.js';

const MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const REL_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const PKG_REL_NS = 'http://schemas.openxmlformats.org/package/2006/relationships';
const MAX_SHEETS = 255;
const MAX_SHEET_NAME = 31;
const MAX_CELL_CHARS = 32767;

const STYLE = {
  DEFAULT: 0, TITLE: 1, HEADER: 2, LABEL: 3, VALUE: 4, SUB_LABEL: 5, ERROR: 6, WARNING: 7,
};

const FONTS = [
  '<font><sz val="11"/><name val="Calibri"/></font>',
  '<font><b/><sz val="11"/><name val="Calibri"/></font>',
  '<font><b/><sz val="16"/><color rgb="FF222222"/><name val="Calibri"/></font>',
  '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>',
];

const FILL_COLORS = ['FF228800', 'FFE8F3E4', 'FFF8D7DA', 'FFFFF3CD'];
const FILLS = [
  '<fill><patternFill patternType="none"/></fill>',
  '<fill><patternFill patternType="gray125"/></fill>',
  ...FILL_COLORS.map((rgb) => `<fill><patternFill patternType="solid"><fgColor rgb="${rgb}"/><bgColor indexed="64"/></patternFill></fill>`),
];

const BORDER_SIDE = '<color rgb="FFBFBFBF"/>';
const BORDERS = [
  '<border><left/><right/><top/><bottom/><diagonal/></border>',
  `<border><left style="thin">${BORDER_SIDE}</left><right style="thin">${BORDER_SIDE}</right><top style="thin">${BORDER_SIDE}</top><bottom style="thin">${BORDER_SIDE}</bottom><diagonal/></border>`,
];

// [fontId, fillId, borderId, indent, wrap]
const CELL_XFS = [
  [0, 0, 0, 0, true],
  [2, 0, 0, 0, false],
  [3, 2, 1, 0, false],
  [1, 3, 1, 0, true],
  [0, 0, 1, 0, true],
  [0, 0, 1, 2, true],
  [1, 4, 1, 0, true],
  [1, 5, 1, 0, true],
];

function buildStyles() {
  const xfs = CELL_XFS.map(([font, fill, border, indent, wrap]) => (
    `<xf numFmtId="0" fontId="${font}" fillId="${fill}" borderId="${border}" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top"${wrap ? ' wrapText="1"' : ''}${indent ? ` indent="${indent}"` : ''}/></xf>`
  ));
  return `${XML_HEADER}<styleSheet xmlns="${NS}">`
    + `<fonts count="${FONTS.length}">${FONTS.join('')}</fonts>`
    + `<fills count="${FILLS.length}">${FILLS.join('')}</fills>`
    + `<borders count="${BORDERS.length}">${BORDERS.join('')}</borders>`
    + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + `<cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs>`
    + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
    + '</styleSheet>';
}

function columnName(index) {
  let name = '';
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }
  return name;
}

function buildCell(content, rowIdx, colIdx) {
  const { v, s } = typeof content === 'object' && content !== null ? content : { v: content, s: STYLE.VALUE };
  const ref = `${columnName(colIdx)}${rowIdx + 1}`;
  const text = String(v ?? '').slice(0, MAX_CELL_CHARS);
  if (!text) return `<c r="${ref}" s="${s}"/>`;
  return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
}

function buildSheet({ rows, widths, freezeRows = 0 }) {
  const pane = freezeRows
    ? `<pane ySplit="${freezeRows}" topLeftCell="A${freezeRows + 1}" activePane="bottomLeft" state="frozen"/>`
    : '';
  const cols = widths.map((width, i) => `<col min="${i + 1}" max="${i + 1}" width="${width}" customWidth="1"/>`).join('');
  const data = rows
    .map((row, r) => `<row r="${r + 1}">${row.map((content, c) => buildCell(content, r, c)).join('')}</row>`)
    .join('');
  return `${XML_HEADER}<worksheet xmlns="${NS}">`
    + `<sheetViews><sheetView workbookViewId="0">${pane}</sheetView></sheetViews>`
    + `<cols>${cols}</cols><sheetData>${data}</sheetData></worksheet>`;
}

function toSheetName(raw, used) {
  const base = String(raw).replace(/[[\]:*?/\\]/g, '_').replace(/^'+|'+$/g, '').trim() || 'Sheet';
  let name = base.slice(0, MAX_SHEET_NAME);
  let counter = 1;
  while (used.has(name.toLowerCase())) {
    counter += 1;
    const suffix = ` (${counter})`;
    name = `${base.slice(0, MAX_SHEET_NAME - suffix.length)}${suffix}`;
  }
  used.add(name.toLowerCase());
  return name;
}

const cell = (v, s) => ({ v, s });
const sectionRow = (title) => [cell(title, STYLE.HEADER), cell('', STYLE.HEADER)];

function buildSummarySheet(data) {
  const rows = [
    [cell('MEP Overlay Export', STYLE.TITLE)],
    [cell('Page', STYLE.LABEL), data.pageUrl],
    [cell('Exported', STYLE.LABEL), data.exportedAt],
    [cell('Manifests', STYLE.LABEL), String(data.manifests.length)],
  ];
  data.summary.forEach(({ title, rows: pairs }) => {
    rows.push([], sectionRow(title));
    pairs.forEach(([label, value]) => {
      if (!Array.isArray(value)) {
        rows.push([cell(label, STYLE.LABEL), value]);
        return;
      }
      rows.push([cell(label, STYLE.LABEL), cell('', STYLE.VALUE)]);
      value.forEach(([subLabel, subValue]) => {
        rows.push([cell(subLabel, STYLE.SUB_LABEL), subValue]);
      });
    });
  });
  return buildSheet({ rows, widths: [34, 90] });
}

function buildManifestSheet(manifest) {
  const rows = [
    [cell(`${manifest.index}. ${manifest.name}`, STYLE.TITLE)],
    sectionRow('Manifest'),
    [cell('URL', STYLE.LABEL), manifest.url],
  ];
  if (manifest.status) {
    const statusStyle = manifest.status.level === 'error' ? STYLE.ERROR : STYLE.WARNING;
    rows.push([cell('Status', STYLE.LABEL), cell(manifest.status.label, statusStyle)]);
    manifest.status.messages.forEach((message) => rows.push([cell('', STYLE.LABEL), cell(message, statusStyle)]));
  }
  manifest.rows.forEach(([label, value]) => rows.push([cell(label, STYLE.LABEL), value]));
  if (manifest.variants.length) {
    rows.push([], sectionRow('Variants'));
    manifest.variants.forEach(({ label, selected }) => {
      rows.push([cell(label, STYLE.LABEL), selected ? 'Selected' : '']);
    });
  }
  return buildSheet({ rows, widths: [34, 90], freezeRows: 2 });
}

export default function buildXlsx(data) {
  const used = new Set();
  const sheets = [
    { name: toSheetName('Summary', used), xml: buildSummarySheet(data) },
    ...data.manifests.slice(0, MAX_SHEETS - 1).map((manifest) => ({
      name: toSheetName(`${manifest.index}. ${manifest.name}`, used),
      xml: buildManifestSheet(manifest),
    })),
  ];

  const sheetOverrides = sheets
    .map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`)
    .join('');
  const contentTypes = `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">`
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
    + '<Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
    + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
    + `${sheetOverrides}</Types>`;

  const rootRels = `${XML_HEADER}<Relationships xmlns="${PKG_REL_NS}">`
    + `<Relationship Id="rId1" Type="${REL_NS}/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

  const sheetEntries = sheets
    .map(({ name }, i) => `<sheet name="${escapeXml(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
    .join('');
  const workbook = `${XML_HEADER}<workbook xmlns="${NS}" xmlns:r="${REL_NS}"><sheets>${sheetEntries}</sheets></workbook>`;

  const sheetRels = sheets
    .map((_, i) => `<Relationship Id="rId${i + 1}" Type="${REL_NS}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`)
    .join('');
  const stylesRel = `<Relationship Id="rId${sheets.length + 1}" Type="${REL_NS}/styles" Target="styles.xml"/>`;
  const workbookRels = `${XML_HEADER}<Relationships xmlns="${PKG_REL_NS}">${sheetRels}${stylesRel}</Relationships>`;

  return zip([
    { name: '[Content_Types].xml', content: contentTypes },
    { name: '_rels/.rels', content: rootRels },
    { name: 'xl/workbook.xml', content: workbook },
    { name: 'xl/_rels/workbook.xml.rels', content: workbookRels },
    { name: 'xl/styles.xml', content: buildStyles() },
    ...sheets.map(({ xml }, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, content: xml })),
  ], MIME);
}
