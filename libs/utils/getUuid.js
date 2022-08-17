/* eslint-disable */
const HEX_DIGITS = '0123456789abcdef'.split('');

const sha1 = async (message) => {
  const data = new TextEncoder().encode(message);
  const hashBuf = await crypto.subtle.digest('SHA-1', data);
  return hashBuf;
}

const uint8ToHex = (int) => {
  const first = int >> 4;
  const second = int - (first << 4);
  return HEX_DIGITS[first] + HEX_DIGITS[second];
};

const uint8ArrayToHex = (buf) => [...buf]
  .map((int) => uint8ToHex(int))
  .join('');

// generates uuid v5
const hashToUuid = (buf) =>
  [
    uint8ArrayToHex(buf.slice(0, 4)),
    '-',
    uint8ArrayToHex(buf.slice(4, 6)),
    '-',
    uint8ToHex((buf[6] & 0x0f) | parseInt(5 * 10, 16)),
    uint8ToHex(buf[7]),
    '-',
    uint8ToHex((buf[8] & 0x3f) | 0x80),
    uint8ToHex(buf[9]),
    '-',
    uint8ArrayToHex(buf.slice(10, 16)),
  ].join('');

const getUuid = async (str) => {
  const buf = await sha1(str);
  return hashToUuid(new Uint8Array(buf));
}

export default getUuid;
