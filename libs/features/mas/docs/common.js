import '../../../deps/custom-elements.js';
let masCommerceService;
const toggleTheme = (themeParam) => {
  const theme = themeParam ?? 'light';
  document.body.className = 'spectrum spectrum--medium';
  document.body.classList.add(`spectrum--${theme}`);
  params.set('theme', theme);
  history.replaceState(null, '', `${location.pathname}?${params}`);
}

const toggleLocale = (locale) => {
  if (locale.includes(',')) {
    const [country, language] = locale.split(',');
    masCommerceService.setAttribute('country', country);
    masCommerceService.setAttribute('language', language);
    params.set('country', country);
    params.set('language', language);
  } else {
    masCommerceService.setAttribute('locale', locale);
    params.set('locale', locale);
  }
  masCommerceService.refreshFragments();
  history.replaceState(null, '', `${location.pathname}?${params}`);
}

const params = new URLSearchParams(document.location.search);
const init = () => {
  import('../dist/mas.js');
  // theme
  toggleTheme(params.get('theme'));
  document.querySelectorAll('.theme-toggle').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme(el.getAttribute('value'));
    });
  });
  document.querySelectorAll('.locale-toggle').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLocale(el.getAttribute('value'));
    });
  });
  // mas-commerce-service
  masCommerceService = document.createElement('mas-commerce-service');
  ['locale','language','env','country','language'].forEach((attribute) => {
    const value = params.get(attribute);
    if (value) masCommerceService.setAttribute(attribute, value);
  });
  masCommerceService.setAttribute('lana-tags', 'nala-test-page');
  document.head.appendChild(masCommerceService);
}
export { init };
