export const loadScript = (url, type) => new Promise((resolve, reject) => {
  let script = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (type) {
      script.setAttribute('type', type);
    }
    script.onload = () => { resolve(script); };
    script.onerror = () => { reject(); };
    head.append(script);
  }
});

export function utf8ToB64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export function b64ToUtf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

export function parseEncodedConfig(encodedConfig) {
  try {
    return JSON.parse(b64ToUtf8(decodeURIComponent(encodedConfig)));
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function getHashConfig() {
  const { hash } = window.location;
  if (!hash) return null;
  window.location.hash = '';

  const encodedConfig = hash.startsWith('#') ? hash.substring(1) : hash;
  return parseEncodedConfig(encodedConfig);
}
