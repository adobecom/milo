export const GeoRoutingCookies = {
  international: 'international',
  georouting_presented: 'georouting_presented',
};
const geo2Link = 'https://geo2.adobe.com/json/';

const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
</svg>`;

const WORLD_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iU19HbG9iZV8yNF9OQDJ4IiBoZWlnaHQ9IjQ4IiBpZD0iU19HbG9iZV8yNF9OXzJ4IiB3aWR0aD0iNDgiPjxkZWZzPjxzdHlsZT4uZmlsbHtmaWxsOiM3MDcwNzB9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImZpbGwiIGQ9Ik05LjUyNyAxOC4zNThjLTEuNC01LjA0OSAyLjIwNy03LjIyMyAxLjg1Mi0xMS41MzdBMjEuNDMgMjEuNDMgMCAwIDAgMi42NjcgMjRjMCAxMi4xNDkgMTAuNTkxIDE5LjM5IDE4LjA3MiAyMC45NzZhOS4yIDkuMiAwIDAgMCAxLjM5My4yMjFjMi42NjgtNi44LTIuMzY0LTE0LjM4NS01LjY4NC0xOS4zMjYtMi43NjUtNC4xMTMtNS4yNzgtMS41NzEtNi45MjEtNy41MTNaIi8+PHBhdGggY2xhc3M9ImZpbGwiIGQ9Ik0xOS45IDUuNnMtLjQ4NS4wMjktLjYxOS4xNjNjLTEuMDE0IDEuMDEgMS43NzYgNi4xIDEuNjU2IDUuMzIyLjY2NC0zLjA1NiA0LjgxNi00LjIzNSA2LjA4OC0uMmE0Ljk4OSA0Ljk4OSAwIDAgMS0xLjExNyAzLjAyYy0xLjg4IDIuNDcyLTIuMjYyIDYuODcyLTMuMiA1Ljc0Ni04Ljc4Ny0zLjYtNy44MiAxLjE2MS00LjkzNiA0LjM0MyA0LjYxOCA1LjA5NCAyLjI3NS41MjIgOC4zMjMgMy4xODkgNC44NjQgMi4xNDUgMTAuNzE4IDIuNjUyIDkuMjg5IDQuMjctNC4zMjIgNC44OTQtMy40MTMgOC4xMzctMTEuMDU3IDEzLjg3Mi42MzctLjAxNyAyLjY2NS0uMjIgMy4wODItLjI4OGEyMS43IDIxLjcgMCAwIDAgMTcuODMzLTE5LjIgMy4yIDMuMiAwIDAgMS0xLjUzOS0uNDY5Yy0yLjE0Ny0uODE3LTMuOTg5IDEuOTY3LTQuMTUyLTUuNTUyYTcuNjg2IDcuNjg2IDAgMCAxIDIuMjIyLTUuMzMzIDQuMTA3IDQuMTA3IDAgMCAxIC45NzItLjQ2NSAyMi4zMDEgMjIuMzAxIDAgMCAwLS44MjYtMS4zNTdjLS4wNS4wMjYtLjA5NC4wNTktLjE0NS4wODMtMS42NjcuNzc4LTEuOSAxLjAwNy0yLjY2NyAwYTIuMSAyLjEgMCAwIDEgLjQ2MS0zLjEgMjEuMzEzIDIxLjMxMyAwIDAgMC0xNS41MzMtNi45NTdjMi43LjAzNyA1LjkyOSAyLjAzOSA0LjI4NCA1LjIzOS4yNDctLjUwOC01LjM2OS0xLjcyLTYuMTMzLTEuNzItMS4wMjkgMCAxLjg1My0zLjUxOSAxLjgxNC0zLjUxOWEyMS40MzkgMjEuNDM5IDAgMCAwLTguODIgMS45QzE2LjYzNyA1LjUyNiAxOS45IDUuNiAxOS45IDUuNloiLz48L3N2Zz4=';

export const getCookieValueByName = (a) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${a}=`))
  ?.split('=')[1];

const jsonpGist = (url, callback) => {
  // Setup a unique name that can be called & destroyed
  const callbackName = `jsonp_${Math.round(100000 * Math.random())}`;

  // Create the script tag
  const script = document.createElement('script');

  // TODO: Should be more modern and use URLParams
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

const getUserCountryByIP = async () => new Promise((resolve) => {
  // override user region if akamaiLocale is set in URL params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const akamaiLocale = urlParams.get('akamaiLocale');
  if (akamaiLocale !== null) {
    resolve(akamaiLocale);
  } else {
    jsonpGist(geo2Link, (data) => resolve(data.country));
  }
});

const closeModals = (modals) => {
  const qModals = modals || document.querySelectorAll('dialog[open]');
  if (qModals?.length) {
    qModals.forEach((modal) => {
      modal.remove();
    });
    window.history.pushState('', document.title, `${window.location.pathname}${window.location.search}`);
  }
};

const setInternationalCookie = (prefix) => {
  const pre = prefix === '' ? 'us' : prefix;
  document.cookie = `${GeoRoutingCookies.international}=${pre};path=/`;
};

const setGeoroutingCookies = (prefix) => {
  document.cookie = `${GeoRoutingCookies.international}=${prefix};path=/`;
  const inThirtyDaysTime = new Date().getTime() + 60 * 60 * 1000 * 24 * 30;
  const expirationDateGeoRoutingPresentedCookie = new Date(inThirtyDaysTime).toUTCString();
  document.cookie = `${GeoRoutingCookies.georouting_presented}=true;expires=${expirationDateGeoRoutingPresentedCookie};path=/`;
};

const showModal = async (config, loadStyle, createTag, localeTexts) => {
  const { miloLibs, codeRoot } = config;
  loadStyle(`${miloLibs || codeRoot}/features/georouting/georouting.css`);

  const dialog = document.createElement('dialog');
  dialog.className = 'dialog-modal';

  const close = createTag('button', { class: 'dialog-close', 'aria-label': 'Close' }, CLOSE_ICON);
  const worldIcon = createTag('img', { src: WORLD_ICON });

  close.addEventListener('click', (e) => {
    closeModals([dialog]);
    e.preventDefault();
  });

  dialog.addEventListener('click', (e) => {
    // on click outside of modal
    if (e.target === dialog) {
      closeModals([dialog]);
    }
  });

  dialog.addEventListener('close', () => {
    closeModals([dialog]);
  });

  const georoutingContainer = createTag('div', { class: 'georouting-container' });

  const textContainer = createTag('div', { class: 'georouting-text-container' });
  const linkContainer = document.createElement('div');
  localeTexts.forEach((l) => {
    if (l.text) textContainer.append(createTag('p', { class: 'georouting-text' }, l.text));
    const aTag = createTag('a', { class: 'georouting-link', href: l.targetUrl }, l.button);
    aTag.addEventListener('click', () => {
      setGeoroutingCookies(l.prefix);
    });
    if (l.button) linkContainer.append(aTag);
  });
  georoutingContainer.append(worldIcon, textContainer, linkContainer);

  dialog.append(close, georoutingContainer);
  document.body.append(dialog);
  dialog.showModal();
  close.focus({ focusVisible: true });
};

const fetchGeoroutingMetadata = async (config, getMetadata) => {
  const url = `${config.locale.contentRoot}/georouting-metadata`;
  const resp = await fetch(`${url}`);
  const html = await resp.text();
  if (!html) return null;
  try {
    // TODO: Fallback to consumer config
    const geoRoutingMetadata = getMetadata('georouting');
    const fallbackRoutingMetadata = getMetadata('fallbackrouting');
    return {
      isGeoRoutingFeatureActive: geoRoutingMetadata?.toLowerCase().trim() === 'on',
      isFallbackRoutingEnabled: fallbackRoutingMetadata?.toLowerCase().trim() === 'on',
    };
  } catch (e) {
    console.log('Could not get the metadata for the georouting:', e);
  }
  return null;
};

export default async function loadGeoRouting(config, loadStyle, createTag, getConfigRoot, getMetadata) {
  const georoutingMetadata = await fetchGeoroutingMetadata(config, getMetadata);
  if (georoutingMetadata !== null && !georoutingMetadata.isGeoRoutingFeatureActive) {
    return;
  }
  if (getCookieValueByName(GeoRoutingCookies.georouting_presented)) {
    return;
  }

  // get country either by IP or take akamaiLocale override from params
  let userCountryByIP = '';
  const getUserCountryByIPProm = getUserCountryByIP()
    .then((country) => {
      userCountryByIP = country;
    });

  let georoutingJsonResponse;
  const getGeoroutingJSONProm = fetch(`${config.locale.contentRoot}/georouting.json`).then((response) => {
    georoutingJsonResponse = response;
  });
  await Promise.all([getUserCountryByIPProm, getGeoroutingJSONProm]);
  if (!georoutingJsonResponse.ok) return;
  const georoutingJson = await georoutingJsonResponse.json();

  // if there is no country in URL then it will later be treated as USA
  const potentialUserCountriesByURL = georoutingJson.data
    .find((gj) => gj.prefix === config.locale.prefix)?.akamaiCodes.split(',').map((ak) => ak.trim());

  const internationalCookie = getCookieValueByName(GeoRoutingCookies.international);
  // US prefix is always an empty string in the config object and in the delivered json.
  // If cookie is therefore US convert it
  const internationalCookieUSChecked = internationalCookie === 'us' ? '' : internationalCookie;
  const potentialUserCountriesByCookie = georoutingJson.data
    .find((gj) => gj.prefix === internationalCookieUSChecked)?.akamaiCodes.split(',').map((ak) => ak.trim());

  const comparerArray = [potentialUserCountriesByURL, potentialUserCountriesByCookie];
  const isDiscrepencyDetected = !comparerArray.every((c) => {
    if (c && Array.isArray(c)) {
      return c.some((a) => a.toLowerCase() === userCountryByIP.toLowerCase());
    }
    return true;
  });

  if (!isDiscrepencyDetected) {
    setInternationalCookie(config.locale.prefix);
    return;
  }
  const localeTexts = georoutingJson.data.filter((locale) => {
    if (!locale.akamaiCodes) return false;
    const localeAkamaiCodes = locale.akamaiCodes.split(',').map((ak) => ak.trim());
    return localeAkamaiCodes
      .some((lak) => lak.toLowerCase() === userCountryByIP.toLowerCase());
  });

  const targetUrlWithoutContentRoot = window.location.href.replace(config.locale.contentRoot, '');
  const doesPageExistRequests = [];
  localeTexts.forEach((l) => {
    if (l.prefix && config.locales[l.prefix]) {
      // set content root for locale
      const locale = config.locales[l.prefix];
      locale.contentRoot = `${getConfigRoot(config, `/${l.prefix}`)}`;
      // set initial target url - used in the links in the georouting modal
      const targetUrl = locale.contentRoot + targetUrlWithoutContentRoot;

      // content roots always exist
      // if target url is equal to content root don't send unnecessary head requests
      if (locale.contentRoot === targetUrl || `${locale.contentRoot}/` === targetUrl) {
        l.targetUrl = locale.contentRoot;
        l.isTargetURLSibling = true;
        return;
      }

      const headRequest = fetch(targetUrl, { method: 'HEAD' })
        .then((response) => {
          l.targetUrl = response.ok ? targetUrl : locale.contentRoot;
          l.isTargetURLSibling = response.ok;
        });
      doesPageExistRequests.push(headRequest);
    }
  });

  if (doesPageExistRequests.length > 0) await Promise.all(doesPageExistRequests);

  if (georoutingMetadata !== null
    && !georoutingMetadata.isFallbackRoutingEnabled
    && !localeTexts.some((d) => d.isTargetURLSibling)) {
    return;
  }

  const continueLocaleText = georoutingJson.data
    .filter((locale) => locale.prefix === config.locale.prefix);
  if (continueLocaleText.length > 0) continueLocaleText[0].targetUrl = '#';
  localeTexts.push(...continueLocaleText);

  // This shouldn't ever happen, but if there's no content to show to the user
  // don't open the modal
  if (localeTexts.length === 0) {
    return;
  }

  await showModal(userCountryByIP, config, loadStyle, createTag, localeTexts);
}
