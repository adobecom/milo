const MAS_IO_URL = 'mas-io-url';

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

const init = async () => {
  await polyfills();
  const params = new URLSearchParams(document.location.search);
  if (params.get(MAS_IO_URL)) {
    const meta = document.createElement('meta');
    meta.name = MAS_IO_URL;
    meta.content = params.get(MAS_IO_URL);
    document.head.appendChild(meta);
  }

  // theme
  toggleTheme(params.get('theme') ?? 'light');

  // mas-commerce-service
  const masCommerceService = document.querySelector('mas-commerce-service');
  ['locale','country','language','env'].forEach((attribute) => {
    const value = params.get(attribute);
    if (value) masCommerceService.setAttribute(attribute, value);
  });
  await import('../dist/mas.js');
  masCommerceService.refreshFragments();

  document.querySelectorAll('a.theme-toggle').forEach((link) => 
    link.addEventListener('click', (event) =>
      toggleTheme(event.target.getAttribute('value'), event, params)
    )
  );

  document.querySelectorAll('a.locale-toggle').forEach((link) => 
    link.addEventListener('click', (e) => {
      e?.preventDefault();
      if (e.target.getAttribute('value').includes(',')) {
        const [country, language] = e.target.getAttribute('value').split(',');
        masCommerceService.setAttribute('country', country);
        masCommerceService.setAttribute('language', language);
        masCommerceService.removeAttribute('locale');
        params.set('country', country);
        params.set('language', language);
        params.delete('locale');
      } else {
        masCommerceService.setAttribute('locale', e.target.getAttribute('value'));
        masCommerceService.removeAttribute('country');
        masCommerceService.removeAttribute('language');
        params.set('locale', e.target.getAttribute('value'));
        params.delete('country');
        params.delete('language');
      }
      masCommerceService.refreshFragments();
      history.replaceState(
          null,
          '',
          `${location.pathname}?${params}`,
      );
    }
    )
  );
}
window.log = (target, ...messages) =>  (target.textContent = `${messages.join(' ')}${target.textContent}`);
export { init };
