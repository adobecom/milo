export default function filterKoreaWords() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false,
  );

  const wordsToFilter = ['free-trial', 'free trial', '무료 체험판', '무료 체험하기'];
  const combinedPattern = new RegExp(wordsToFilter.join('|'), 'gi');

  let node = walker.nextNode();
  while (node) {
    const text = node.nodeValue;
    const modifiedText = text.replace(combinedPattern, '');
    if (modifiedText !== text) node.nodeValue = modifiedText;
    node = walker.nextNode();
  }
}
