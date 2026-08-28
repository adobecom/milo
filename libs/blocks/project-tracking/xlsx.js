const TRACKABLE = /(^|\.)aem\.(page|live)$|^business(\.stage)?\.adobe\.com$/i;
const URL_RE = /https?:\/\/[^\s"'<>]+/gi;

function isTrackable(u) {
  try { return TRACKABLE.test(new URL(u).hostname); } catch { return false; }
}

function unescapeXml(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}

export function extractUrlsFromText(text) {
  const matches = unescapeXml(text || '').match(URL_RE) || [];
  const out = [];
  const seen = new Set();
  matches.forEach((raw) => {
    const u = raw.replace(/[.,);]+$/, '');
    if (isTrackable(u) && !seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  });
  return out;
}

async function inflateRaw(bytes) {
  // eslint-disable-next-line compat/compat
  const DS = globalThis.DecompressionStream;
  if (!DS) throw new Error('.xlsx needs a modern browser — use .csv or paste instead');
  const stream = new Response(bytes).body.pipeThrough(new DS('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unzip(u8) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 22 - 65536); i -= 1) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a valid .xlsx (zip) file');
  const count = dv.getUint16(eocd + 10, true);
  let off = dv.getUint32(eocd + 16, true);
  const td = new TextDecoder();
  const wanted = /^xl\/(sharedStrings\.xml|worksheets\/(sheet\d+\.xml|_rels\/sheet\d+\.xml\.rels))$/;
  const entries = [];
  for (let n = 0; n < count; n += 1) {
    if (dv.getUint32(off, true) !== 0x02014b50) break;
    const method = dv.getUint16(off + 10, true);
    const compSize = dv.getUint32(off + 20, true);
    const nameLen = dv.getUint16(off + 28, true);
    const extraLen = dv.getUint16(off + 30, true);
    const commentLen = dv.getUint16(off + 32, true);
    const localOff = dv.getUint32(off + 42, true);
    const name = td.decode(u8.subarray(off + 46, off + 46 + nameLen));
    if (wanted.test(name) && (method === 0 || method === 8)) {
      const lNameLen = dv.getUint16(localOff + 26, true);
      const lExtraLen = dv.getUint16(localOff + 28, true);
      const dataStart = localOff + 30 + lNameLen + lExtraLen;
      entries.push({ name, method, comp: u8.subarray(dataStart, dataStart + compSize) });
    }
    off += 46 + nameLen + extraLen + commentLen;
  }
  const files = new Map();
  await Promise.all(entries.map(async ({ name, method, comp }) => {
    files.set(name, method === 0 ? comp : await inflateRaw(comp));
  }));
  return files;
}

export async function extractUrlsFromXlsx(arrayBuffer) {
  const files = await unzip(new Uint8Array(arrayBuffer));
  const td = new TextDecoder();
  let text = '';
  files.forEach((bytes) => { text += `\n${td.decode(bytes)}`; });
  return extractUrlsFromText(text);
}

export async function extractUrlsFromFile(file) {
  const name = (file.name || '').toLowerCase();
  if (name.endsWith('.csv') || file.type === 'text/csv') {
    return extractUrlsFromText(await file.text());
  }
  return extractUrlsFromXlsx(await file.arrayBuffer());
}
