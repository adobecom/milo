import "./chunk-NE6SFPCS.js";

// ../features/interlinks.js
function checkAndAddMatch(matches, contender, maxMatches) {
  const collisions = matches.filter((match) => !(contender.end < match.start || contender.start > match.end));
  if (collisions.length === 0 && matches.length < maxMatches) {
    matches.push(contender);
  }
}
async function interlink(path, language, limit = 1e3) {
  const isExceptionLanguage = ["zh", "ko", "ja", "th", "he"].includes(language);
  const articleBody = document.querySelector("main");
  const resp = await fetch(`${path}?limit=${limit}`);
  if (!(articleBody && resp.ok)) return;
  const json = await resp.json();
  const articleText = articleBody.textContent.toLowerCase();
  const articleLinks = articleBody.querySelectorAll("a").length;
  const articleWords = articleText.split(/\s/).length;
  const maxLinks = Math.floor(articleWords / 100) - articleLinks;
  if (maxLinks <= 0) return;
  const wordBorder = isExceptionLanguage ? "" : "\\b";
  const keywords = (Array.isArray(json) ? json : json.data).filter(({ Keyword }) => articleText.indexOf(Keyword.toLowerCase()) !== -1).sort((a, b) => b.Keyword.length - a.Keyword.length).map((item) => ({
    regexp: new RegExp(`${wordBorder}(${item.Keyword.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&")})${wordBorder}`, "iu"),
    ...item
  }));
  if (keywords.length === 0) return;
  articleBody.querySelectorAll("div > p:not([class])").forEach((p) => {
    const paraLinks = p.querySelectorAll("a").length;
    const paraWords = p.textContent.split(/\s/).length;
    const maxParaLinks = Math.floor(paraWords / 40) - paraLinks;
    if (isExceptionLanguage || maxParaLinks > 0) {
      Array.from(p.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE).forEach((textNode) => {
        const matches = [];
        keywords.forEach((item) => {
          const match = item.regexp.exec(textNode.nodeValue);
          if (match) {
            checkAndAddMatch(matches, {
              item,
              start: match.index,
              end: match.index + item.Keyword.length
            }, maxParaLinks);
          }
        });
        matches.sort((a, b) => b.start - a.start).forEach(({ item, start, end }) => {
          const text = textNode.nodeValue;
          const a = document.createElement("a");
          a.title = item.Keyword;
          a.href = item.URL;
          a.setAttribute("data-origin", "interlink");
          a.setAttribute("daa-ll", `${a.title}--interlinks_p_${item.Keyword}`);
          a.appendChild(document.createTextNode(text.substring(start, end)));
          p.insertBefore(a, textNode.nextSibling);
          p.insertBefore(document.createTextNode(text.substring(end)), a.nextSibling);
          textNode.nodeValue = text.substring(0, start);
          keywords.splice(keywords.indexOf(item), 1);
        });
      });
    }
  });
}
export {
  checkAndAddMatch,
  interlink as default
};
//# sourceMappingURL=interlinks-DMZPOFKO.js.map
