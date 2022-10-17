const GeoRoutingCookieNames = {
  international: 'international',
  georouting_presented: 'georouting_presented',
  storeregion: 'storeregion',
};
const geo2Link = 'https://geo2.adobe.com/json/';

const getCookieValueByName = ((a) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${a}=`))
  ?.split('=')[1]);

const isCookieSet = ((cookieName) => {
  const cookie = getCookieValueByName(cookieName);
  return !!cookie;
});

const expireGeoLocationCookies = (() => {
  // TODO vhargrave - do I need to do this?
});

const showModal = (() => {
  // TODO vhargrave
});

const jsonpGist = (url, callback) => {
  // Setup a unique name that can be called & destroyed
  const callbackName = `jsonp_${Math.round(100000 * Math.random())}`;

  // Create the script tag
  const script = document.createElement('script');
  script.src = `${url}${(url.indexOf('?') >= 0 ? '&' : '?')}callback=${callbackName}`;

  // Define the function that the script will call
  window[callbackName] = (data) => {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  // Append to the document
  document.body.appendChild(script);
};

const getUserCountry = (async () => {
  let country = '';
  await jsonpGist(geo2Link, (data) => {
    country = data.country;
  });

  return country;
});

export default async function loadGeoRouting(config) {
  const isUserCountrySameAsInUrl = await getUserCountry() === config.locale.prefix;
  if (!isUserCountrySameAsInUrl && !isCookieSet(GeoRoutingCookieNames.georouting_presented)) {
    expireGeoLocationCookies();
    showModal();
  } else {
    // TODO vhargrave - figure out what to do here
  }
  const resp = await fetch(`${config.locale.contentRoot}/georouting.json`);
  if (!resp.ok) return;

  const json = await resp.json();
  const localeText = json.data.filter((locale) => locale.prefix === config.locale.prefix);
  console.log(localeText[0]);
}
