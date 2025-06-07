/* eslint-disable */
const uuid = (a, b) => {
  // https://gist.github.com/LeverOne/1308368
  /* jshint ignore:start */
  // jscs:disable requireCurlyBraces
  for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');
  /* jshint ignore:end */
  return b;
}

export default uuid;