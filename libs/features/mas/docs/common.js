import '../../../deps/custom-elements.js';
import '../dist/mas.js'; 
const init = () => {
  const ENVS = {
    qa: 'qa-odin',
    stage: 'stage-odin',
    prod: 'odin',
  };
  const href = window.location.href;
  const envOverride = new URL(href).searchParams.get('aem.env');
  const env =
    envOverride && ENVS[envOverride]
      ? ENVS[envOverride]
      : ENVS.prod;
  if (window.location.host.includes('aem.page') || window.location.host.includes('hlx.page')) {
    const meta = document.createElement('meta');
    meta.name = 'aem-base-url';
    meta.content = 'https://mas.adobe.com/io/fragment';
    document.head.appendChild(meta);
  }
  
  // theme
  const params = new URLSearchParams(document.location.search);
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
  if (window.location.host.includes('aem.page') || window.location.host.includes('hlx.page')) {
    masCommerceService.setAttribute('env', 'stage');
  }
  document.head.appendChild(masCommerceService);
}
window.log = (target, ...messages) =>  (target.textContent = `${messages.join(' ')}${target.textContent}`);
export { init };
