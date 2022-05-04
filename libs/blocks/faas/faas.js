import { parseEncodedConfig } from '../../libs/utils.js';

export function loadScript(url, callback, type) {
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
}

const loadFaaS = (a) => {
  const block = document.createElement('div');
  block.className = a.className;
  const url = new URL(a.href);
  const faasconf = parseEncodedConfig(url.searchParams.get('config'));
  
  //Todo: modify faasconf here //
  
  loadScript('https://code.jquery.com/jquery-3.6.0.min.js', () => {
    loadScript('https://dev.apps.enterprise.adobe.com/faas/service/jquery.faas-current.js', () => {
      window.faasLoaded = true;
      // eslint-disable-next-line no-undef
      $(block).faas(faasconf);
    });
  });
  a.parentElement.replaceChild(block, a);
}

const intersectHandler = (entries) => {
  const entry = entries[0];
  if (entry.isIntersecting) {
    if (entry.intersectionRatio >= 0.25) {
      const el = entry.target;
      loadFaaS(el);
    }
  } else {
    // if ((entry.intersectionRatio === 0.0) && (adBox.dataset.totalViewTime >= 60000)) {
    // Error handler placeholder
    // }
  }
};

export default function init(el) {
  const runObserver = () => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0.0, 0.25],
    };

    const observer = new IntersectionObserver(intersectHandler, options);
    observer.observe(el);
  };

  if (document.readyState === 'complete') {
    runObserver();
  } else {
    window.addEventListener('load', () => {
      runObserver();
    });
  }
}
