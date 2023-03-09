export function getFloodgateUrl(url) {
  if (!url) {
    return undefined;
  }
  const urlArr = url.split('--');
  urlArr[1] += '-pink';
  return urlArr.join('--');
}

export function createColumn(innerHtml, classValue) {
  const tag = classValue === 'header' ? 'th' : 'td';
  const element = document.createElement(tag);
  if (innerHtml) {
    element.innerHTML = innerHtml;
  }
  return element;
}

export function handleExtension(path) {
  if (path.endsWith('.xlsx')) {
    return path.replace('.xlsx', '.json');
  }
  return path.substring(0, path.lastIndexOf('.'));
}
