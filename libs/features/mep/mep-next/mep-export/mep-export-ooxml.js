/* eslint-disable no-bitwise */
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

const DOS_DATE_1980_01_01 = 0x21;
const XML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

export const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

export function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i += 1) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

export function escapeXml(value) {
  return [...String(value ?? '')]
    .filter((ch) => {
      const code = ch.codePointAt(0);
      return code >= 32 || code === 9 || code === 10 || code === 13;
    })
    .join('')
    .replace(/[&<>"]/g, (ch) => XML_ESCAPES[ch]);
}

function header(size, fields) {
  const view = new DataView(new ArrayBuffer(size));
  fields.forEach(([offset, bytes, value]) => {
    if (bytes === 4) view.setUint32(offset, value, true);
    else view.setUint16(offset, value, true);
  });
  return new Uint8Array(view.buffer);
}

export function zip(files, type) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach(({ name, content }) => {
    const nameBytes = encoder.encode(name);
    const data = typeof content === 'string' ? encoder.encode(content) : content;
    const crc = crc32(data);

    localParts.push(
      header(30, [
        [0, 4, 0x04034b50], [4, 2, 20], [6, 2, 0x0800], [12, 2, DOS_DATE_1980_01_01],
        [14, 4, crc], [18, 4, data.length], [22, 4, data.length], [26, 2, nameBytes.length],
      ]),
      nameBytes,
      data,
    );
    centralParts.push(
      header(46, [
        [0, 4, 0x02014b50], [4, 2, 20], [6, 2, 20], [8, 2, 0x0800], [14, 2, DOS_DATE_1980_01_01],
        [16, 4, crc], [20, 4, data.length], [24, 4, data.length], [28, 2, nameBytes.length],
        [42, 4, offset],
      ]),
      nameBytes,
    );
    offset += 30 + nameBytes.length + data.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = header(22, [
    [0, 4, 0x06054b50], [8, 2, files.length], [10, 2, files.length],
    [12, 4, centralSize], [16, 4, offset],
  ]);

  return new Blob([...localParts, ...centralParts, end], { type });
}
