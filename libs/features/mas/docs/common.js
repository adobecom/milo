import '../../../deps/custom-elements.js';

const toggleTheme = (themeParam) => {
  const theme = themeParam ?? 'light';
  document.body.className = 'spectrum spectrum--medium';
  document.body.classList.add(`spectrum--${theme}`);
  params.set('theme', theme);
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
  // mas-commerce-service
  const masCommerceService = document.createElement('mas-commerce-service');
  ['locale','language','env'].forEach((attribute) => {
    const value = params.get(attribute);
    if (value) masCommerceService.setAttribute(attribute, value);
  });
  masCommerceService.setAttribute('lana-tags', 'nala-test-page');
  document.head.appendChild(masCommerceService);
}
export { init };
