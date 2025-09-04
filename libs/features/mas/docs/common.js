let polyfillsPromise;
export async function polyfills() {
  if (polyfillsPromise) return polyfillsPromise;
  let isSupported = false;
  document.createElement('div', {
    // eslint-disable-next-line getter-return
    get is() {
      isSupported = true;
    },
  });
  if (isSupported) {
    polyfillsPromise = Promise.resolve();
  } else {
    polyfillsPromise = await import('../../../deps/custom-elements.js');
  }
  return polyfillsPromise;
}

const toggleTheme = (theme, event, params) => {
  event?.preventDefault();
  document.body.className = `spectrum spectrum--medium spectrum--${theme}`;
  document.querySelector('sp-theme')?.setAttribute('color', theme);
  if (params) {
    params.set('theme', theme);
    history.replaceState(
        null,
        '',
        `${location.pathname}?${params}`,
    );
  }
}

const toggleLocale = (event, params) => {
  event?.preventDefault();
  const val = event.target.getAttribute('value');
  if (val.includes(',')) {
    const [country, language] = val.split(',');
    params.set('country', country);
    params.set('language', language);
    params.delete('locale');
  } else {
    params.set('locale', val);
    params.delete('country');
    params.delete('language');
  }
  history.replaceState(
      null,
      '',
      `${location.pathname}?${params}`,
  );
  window.location.reload();
}

const createMasCommerceService = (params, commerceEnv) => {
  const old = document.querySelector('mas-commerce-service');
  if (old) {
    old.remove();
  }
  const masCommerceService = document.createElement('mas-commerce-service');
  masCommerceService.setAttribute('lana-tags', 'nala');
  masCommerceService.setAttribute('lana-sample-rate', '100');
  if (commerceEnv) {
    masCommerceService.setAttribute('env', commerceEnv);
  }
  ['locale','country','language','env','lana-tags','data-mas-ff-defaults'].forEach((attribute) => {
    const value = params[attribute];
    if (value) masCommerceService.setAttribute(attribute, value);
  });
  document.head.appendChild(masCommerceService);
  
  return masCommerceService;
}

const init = async (params = {}) => {
  await polyfills();
  const urlParams = new URLSearchParams(document.location.search);

  const commerceEnv = document.querySelector('meta[name="commerce.env"]')?.content;

  // theme
  toggleTheme(urlParams.get('theme') ?? 'light');

  // mas-commerce-service
  createMasCommerceService({...params, ...Object.fromEntries(urlParams.entries())}, commerceEnv);
  await import('../dist/mas.js');

  document.querySelectorAll('a.theme-toggle').forEach((link) => 
    link.addEventListener('click', (event) =>
      toggleTheme(event.target.getAttribute('value'), event, urlParams)
    )
  );

  document.querySelectorAll('a.locale-toggle').forEach((link) => 
    link.addEventListener('click', (event) => toggleLocale(event, urlParams)
    )
  );
}

window.onceEvent = (element, event, handler) => {
  element.addEventListener(event, handler, { once: true });
}

window.log = (target, ...messages) =>  (target.innerHTML =  `${messages.join(' ')}<br>${target.innerHTML}`);
export { init };
