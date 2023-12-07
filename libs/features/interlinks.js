/**
 * Checks if a given match intersects with an existing match
 * before adding it to the list of matches. In case of an
 * intersection, the more specific (i.e. longer) match wins.
 * @param {array} matches The existing matches
 * @param {object} contender The match to check and add
 * @param {number} maxMatches The maximum number of matches
 */
export function checkAndAddMatch(matches, contender, maxMatches) {
  const collisions = matches
    // check for intersections
    .filter((match) => !(contender.end < match.start || contender.start > match.end));
  if (collisions.length === 0 && matches.length < maxMatches) {
    // no intersecting existing matches, add contender if max not yet reached
    matches.push(contender);
  }
}

/**
 * Loops through a list of keywords and looks for matches in the article text.
 * The first occurrence of each keyword will be replaced with a link and tracking added.
 * The keywords file must have a column titled "Keyword".
 * @param {string} path The location of the keywords file to be used for interlinks.
 * @param {number} limit The maximum amount of keywords to fetch from the file.  Default is 1000.
 */
export default async function interlink(path, language, limit = 1000) {
  const isExceptionLanguage = ['zh', 'ko', 'ja', 'th', 'he'].includes(language);
  const articleBody = document.querySelector('main');
  const resp = await fetch(`${path}?limit=${limit}`);
  if (!(articleBody && resp.ok)) return;
  const json = await resp.json();
  const articleText = articleBody.textContent.toLowerCase();
  // set article link limit: 1 every 100 words
  const articleLinks = articleBody.querySelectorAll('a').length;
  const articleWords = articleText.split(/\s/).length;
  const maxLinks = (Math.floor(articleWords / 100)) - articleLinks;
  // eslint-disable-next-line no-useless-return
  if (maxLinks <= 0) return;
  const wordBorder = isExceptionLanguage ? '' : '\\b';
  const keywords = (Array.isArray(json) ? json : json.data)
    // scan article to filter keywords down to relevant ones
    .filter(({ Keyword }) => articleText.indexOf(Keyword.toLowerCase()) !== -1)
    // sort matches by length descending
    .sort((a, b) => b.Keyword.length - a.Keyword.length)
    // prepare regexps
    .map((item) => ({
      regexp: new RegExp(`${wordBorder}(${item.Keyword.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')})${wordBorder}`, 'iu'),
      ...item,
    }));
  // eslint-disable-next-line no-useless-return
  if (keywords.length === 0) return;
  // find exact text node matches and insert links
  articleBody
    .querySelectorAll('div > p:not([class])')
    .forEach((p) => {
      // set paragraph link limit: 1 every 40 words
      const paraLinks = p.querySelectorAll('a').length;
      const paraWords = p.textContent.split(/\s/).length;
      const maxParaLinks = Math.floor(paraWords / 40) - paraLinks;
      if (isExceptionLanguage || maxParaLinks > 0) {
        Array.from(p.childNodes)
        // filter out non text nodes
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .forEach((textNode) => {
            const matches = [];
            // find case-insensitive matches inside text node
            keywords.forEach((item) => {
              const match = item.regexp.exec(textNode.nodeValue);
              if (match) {
                checkAndAddMatch(matches, {
                  item,
                  start: match.index,
                  end: match.index + item.Keyword.length,
                }, maxParaLinks);
              }
            });
            matches
            // sort matches by start index descending
              .sort((a, b) => b.start - a.start)
            // split text node, insert link with matched text, and add link tracking
              .forEach(({ item, start, end }) => {
                const text = textNode.nodeValue;
                const a = document.createElement('a');
                a.title = item.Keyword;
                a.href = item.URL;
                a.setAttribute('data-origin', 'interlink');
                a.setAttribute('daa-ll', `${a.title}--interlinks_p_${item.Keyword}`);
                a.appendChild(document.createTextNode(text.substring(start, end)));
                p.insertBefore(a, textNode.nextSibling);
                p.insertBefore(document.createTextNode(text.substring(end)), a.nextSibling);
                textNode.nodeValue = text.substring(0, start);
                // remove matched link from interlinks
                keywords.splice(keywords.indexOf(item), 1);
              });
          });
      }
    });
}
