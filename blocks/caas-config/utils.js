const setQueryStringWithoutPageReload = (qsValue) => {
  const newurl = `${window.location.protocol}//${
    window.location.host
  }${window.location.pathname}#${
    qsValue}`;

  window.history.pushState({ path: newurl }, '', newurl);
};

const loadScript = (url, callback, type) => {
  let script = document.querySelector(`head > script[src="${url}"]`);
  if (!script) {
    const { head } = document;
    script = document.createElement('script');
    script.setAttribute('src', url);
    if (type) {
      script.setAttribute('type', type);
    }
    script.onload = () => { if (callback) callback(); };
    script.onerror = () => { if (callback) callback(); };
    head.append(script);
  }
  return script;
};

export { loadScript,
  setQueryStringWithoutPageReload };
