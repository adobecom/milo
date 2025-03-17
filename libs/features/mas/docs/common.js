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

const toggleTheme = (theme, params) => {
  document.body.className = 'spectrum spectrum--medium';
  document.body.classList.add(`spectrum--${theme}`);
  document.querySelector('sp-theme')?.setAttribute('color', theme);
  params.set('theme', theme);
  history.replaceState(
      null,
      '',
      `${location.pathname}?${params}`,
  );
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
  const darkTheme = params?.get('theme')?.toLowerCase() === 'dark';
  const theme = document.createElement('script');
  theme.setAttribute('src', `../../spectrum-web-components/dist/themes/${darkTheme ? 'dark' : 'light'}.js`);
  theme.setAttribute('type', `module`);
  document.head.appendChild(theme);
  
  // mas-commerce-service
  const masCommerceService = document.querySelector('mas-commerce-service');
  ['locale','country','language','env'].forEach((attribute) => {
    const value = params.get(attribute);
    if (value) masCommerceService.setAttribute(attribute, value);
  });
  await import('../dist/mas.js');

  document.querySelectorAll('a.theme-toggle').forEach((link) => 
    link.addEventListener('click', (e) =>
      toggleTheme(e.target.getAttribute('value'), params)
    )
  );
}
window.log = (target, ...messages) =>  (target.textContent = `${messages.join(' ')}${target.textContent}`);
export { init };
