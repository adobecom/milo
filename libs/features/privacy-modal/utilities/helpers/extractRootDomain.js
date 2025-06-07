/**
 * Extract the root domain fromm a given url
 * @param {String} url Source of extraction
 * @returns {String} extracted root domain
 */
const extractRootDomain = (url) => {
  let domain = url;
  const splitArr = domain.split('.');
  const arrLen = splitArr.length;

  if (arrLen > 2) {
      domain = `${splitArr[arrLen - 2]}.${splitArr[arrLen - 1]}`;
      if (splitArr[arrLen - 2].length === 2 && splitArr[arrLen - 1].length === 2) {
          domain = `${splitArr[arrLen - 3]}.${domain}`;
      }
  }

  return domain;
};

export default extractRootDomain;