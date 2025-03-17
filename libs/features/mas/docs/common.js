import '../../../deps/custom-elements.js';
import '../dist/mas.js'; 
const MAS_IO_URL = 'mas-io-url';
const init = () => {
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
  const masCommerceService = document.createElement('mas-commerce-service');
  ['locale','language','env'].forEach((attribute) => {
    const value = params.get(attribute);
    if (value) masCommerceService.setAttribute(attribute, value);
  });
  masCommerceService.setAttribute('host-env', 'prod');
  masCommerceService.setAttribute('lana-tags', 'ccd');
  document.head.appendChild(masCommerceService);
}
window.log = (target, ...messages) =>  (target.textContent = `${messages.join(' ')}${target.textContent}`);
export { init };
