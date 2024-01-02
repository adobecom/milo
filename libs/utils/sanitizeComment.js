const invalidUrlChars = /["<>\\^`{|}]/g;

// modified from https://gist.github.com/dperini/729294
const validUrl = new RegExp(
  '(?:(?:(?:https?):)?\\/\\/)?'
    + '(?:'
    // IP address exclusion
    // private & local networks
    + '(?!(?:10|127)(?:\\.\\d{1,3}){3})'
    + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})'
    + '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})'
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broadcast addresses
    // (first & last IP address of each class)
    + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])'
    + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}'
    + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))'
    + '|'
    // host & domain names, may end with dot
    // can be replaced by a shortest alternative
    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
    + '(?:'
    + '(?:'
    + '[a-z0-9\\u00a1-\\uffff]'
    + '[a-z0-9\\u00a1-\\uffff_-]{0,62}'
    + ')?'
    + '[a-z0-9\\u00a1-\\uffff]\\.'
    + ')+'
    // TLD identifier name, may end with dot
    + '(?:[a-z\\u00a1-\\uffff]{2,}\\.?)'
    + ')'
    // resource path (optional)
    + '(?:[/?#]\\S*)?',
  'ig',
);

const allowedChars = /[a-zA-Z0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s@.]/g;

const getUniqueArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.filter((item, pos) => arr.indexOf(item) === pos);
};

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Strip all non-alphanumeric chars (leaving spaces and ,.)
 * Allow urls, but verify they are valid
 * @param {string} comment
 */
const sanitizeComment = (comment) => {
  if (!comment) return '';

  let sanitizedComment = comment;
  // find any urls in comment
  const urls = getUniqueArray(comment.match(validUrl));
  urls.forEach((url, i) => {
    if (!invalidUrlChars.test(url)) {
      // replace each url with a placeholder before sanitizing rest of comment
      sanitizedComment = sanitizedComment.replace(
        new RegExp(escapeRegExp(url), 'g'),
        `...${i}...`,
      );
    }
  });

  // remove invalid chars
  const matchedAllowedChars = sanitizedComment.match(allowedChars);
  sanitizedComment = matchedAllowedChars ? matchedAllowedChars.join('') : '';

  // put urls back
  urls.forEach((url, i) => {
    sanitizedComment = sanitizedComment.replace(
      new RegExp(`...${i}...`, 'g'),
      url,
    );
  });

  return sanitizedComment;
};

export default sanitizeComment;
