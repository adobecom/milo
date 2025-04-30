export function getLocalesFromUi(nodeList) {
  return [...nodeList].reduce((rdx, cb) => {
    if (cb.checked) {
      rdx.push(cb.value);
    }
    return rdx;
  }, []);
}

function createPairsFromTextaArea(textaAreaValue) {
  const whitespace = /\s+/;
  const urlValues = textaAreaValue.split(whitespace);
  const pairs = [];
  for (let i = 0; i < urlValues.length; i += 2) {
    const source = urlValues[i]?.trim();
    const destination = urlValues[i + 1]?.trim();

    if (source?.length && destination) {
      pairs.push({
        source,
        destination,
      });
    }
  }
  return pairs;
}

function createPairsFromNodeList(nodeList, sourceSelector, destinationSelector) {
  return [...nodeList].reduce((rdx, container) => {
    const source = container.querySelector(sourceSelector);
    const destination = container.querySelector(destinationSelector);
    rdx.push({
      source: source?.value.trim(),
      destination: destination?.value.trim(),
    });
    return rdx;
  }, []);
}

export function createRedirectsList(inputArea) {
  const isTextArea = inputArea.querySelector('textarea');
  if (isTextArea) return createPairsFromTextaArea(isTextArea.value);
  return createPairsFromNodeList(inputArea.querySelectorAll('.input-container'), '.source', '.destination');
}

function isFullyQualifiedUrl(inputValue) {
  try {
    const url = new URL(inputValue);
    return url;
  } catch (e) {
    return false;
  }
}

export function processRedirects(redirectList, locales, errorCallback) {
  return redirectList.reduce((rdx, urlPair) => {
    locales.forEach((locale) => {
      const source = isFullyQualifiedUrl(urlPair.source);
      const destination = isFullyQualifiedUrl(urlPair.destination);

      if (!source || !destination) {
        errorCallback();
      }

      const appendHtml = document.querySelector('#add-html').checked;
      const sourcePath = source.pathname?.split('.html')[0] || '/';
      const destinationPath = () => {
        if (!appendHtml || destination.pathname === '/') {
          return destination.pathname;
        }
        return `${destination.pathname}.html`;
      };
      rdx.push([`/${locale}${sourcePath}`, `${destination.origin}/${locale}${destinationPath()}`]);
    });
    return rdx;
  }, []);
}
