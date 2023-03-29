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

export async function getFile(downloadUrl) {
  const response = await fetch(downloadUrl);
  if (response) {
    return response.blob();
  }
  return undefined;
}

export function getPathFromUrl(url) {
  return new URL(url).pathname;
}

export function getDocPathFromUrl(url) {
  let path = getPathFromUrl(url);
  if (!path) {
    return undefined;
  }
  if (path.endsWith('.json')) {
    path = path.slice(0, -5);
    return `${path}.xlsx`;
  }

  if (path.endsWith('/')) {
    path += 'index';
  } else if (path.endsWith('.html')) {
    path = path.slice(0, -5);
  }

  return `${path}.docx`;
}
