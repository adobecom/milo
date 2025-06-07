const isProduction = () => {
  // Using src*="..." to capture use-cases where privacy is loaded with query params
  // e.g. [...]/privacy-standalone.js?cors-psweb
  const script = document.querySelector('script[src*="/privacy-standalone.js"]') || document.querySelector('script[src$="/feds.js"]');
  if (script) {
    const anchor = document.createElement('a');
    anchor.href = script.src;

    return anchor.host === 'www.adobe.com';
  }

  return false;
};

export default isProduction;
