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

  // override user region if akamaiLocale is set in URL params
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const akamaiLocale = urlParams.get('akamaiLocale');
  if (akamaiLocale !== null) {
    country = akamaiLocale;
  } else {
    await jsonpGist(geo2Link, (data) => {
      country = data.country;
    });
  }

  return country;
});

const CLOSE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
</svg>`;

const WORLD_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iU19HbG9iZV8yNF9OQDJ4IiBoZWlnaHQ9IjQ4IiBpZD0iU19HbG9iZV8yNF9OXzJ4IiB3aWR0aD0iNDgiPjxkZWZzPjxzdHlsZT4uZmlsbHtmaWxsOiM3MDcwNzB9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImZpbGwiIGQ9Ik05LjUyNyAxOC4zNThjLTEuNC01LjA0OSAyLjIwNy03LjIyMyAxLjg1Mi0xMS41MzdBMjEuNDMgMjEuNDMgMCAwIDAgMi42NjcgMjRjMCAxMi4xNDkgMTAuNTkxIDE5LjM5IDE4LjA3MiAyMC45NzZhOS4yIDkuMiAwIDAgMCAxLjM5My4yMjFjMi42NjgtNi44LTIuMzY0LTE0LjM4NS01LjY4NC0xOS4zMjYtMi43NjUtNC4xMTMtNS4yNzgtMS41NzEtNi45MjEtNy41MTNaIi8+PHBhdGggY2xhc3M9ImZpbGwiIGQ9Ik0xOS45IDUuNnMtLjQ4NS4wMjktLjYxOS4xNjNjLTEuMDE0IDEuMDEgMS43NzYgNi4xIDEuNjU2IDUuMzIyLjY2NC0zLjA1NiA0LjgxNi00LjIzNSA2LjA4OC0uMmE0Ljk4OSA0Ljk4OSAwIDAgMS0xLjExNyAzLjAyYy0xLjg4IDIuNDcyLTIuMjYyIDYuODcyLTMuMiA1Ljc0Ni04Ljc4Ny0zLjYtNy44MiAxLjE2MS00LjkzNiA0LjM0MyA0LjYxOCA1LjA5NCAyLjI3NS41MjIgOC4zMjMgMy4xODkgNC44NjQgMi4xNDUgMTAuNzE4IDIuNjUyIDkuMjg5IDQuMjctNC4zMjIgNC44OTQtMy40MTMgOC4xMzctMTEuMDU3IDEzLjg3Mi42MzctLjAxNyAyLjY2NS0uMjIgMy4wODItLjI4OGEyMS43IDIxLjcgMCAwIDAgMTcuODMzLTE5LjIgMy4yIDMuMiAwIDAgMS0xLjUzOS0uNDY5Yy0yLjE0Ny0uODE3LTMuOTg5IDEuOTY3LTQuMTUyLTUuNTUyYTcuNjg2IDcuNjg2IDAgMCAxIDIuMjIyLTUuMzMzIDQuMTA3IDQuMTA3IDAgMCAxIC45NzItLjQ2NSAyMi4zMDEgMjIuMzAxIDAgMCAwLS44MjYtMS4zNTdjLS4wNS4wMjYtLjA5NC4wNTktLjE0NS4wODMtMS42NjcuNzc4LTEuOSAxLjAwNy0yLjY2NyAwYTIuMSAyLjEgMCAwIDEgLjQ2MS0zLjEgMjEuMzEzIDIxLjMxMyAwIDAgMC0xNS41MzMtNi45NTdjMi43LjAzNyA1LjkyOSAyLjAzOSA0LjI4NCA1LjIzOS4yNDctLjUwOC01LjM2OS0xLjcyLTYuMTMzLTEuNzItMS4wMjkgMCAxLjg1My0zLjUxOSAxLjgxNC0zLjUxOWEyMS40MzkgMjEuNDM5IDAgMCAwLTguODIgMS45QzE2LjYzNyA1LjUyNiAxOS45IDUuNiAxOS45IDUuNloiLz48L3N2Zz4=';

function closeModals(modals) {
  const qModals = modals || document.querySelectorAll('dialog[open]');
  if (qModals?.length) {
    qModals.forEach((modal) => {
      modal.remove();
    });
    window.history.pushState('', document.title, `${window.location.pathname}${window.location.search}`);
  }
}

const showModal = (async (userCountry, createTag, config) => {
  const resp = await fetch(`${config.locale.contentRoot}/georouting.json`);
  if (!resp.ok) return;

  const json = await resp.json();
  const localeText = json.data.filter((locale) => {
    const country = locale.prefix.match('^[^_]*');
    if (country === null || country.length === 0) return userCountry.toLowerCase() === 'us';
    return country[0].toLowerCase() === userCountry.toLowerCase();
  });

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
  georoutingContainer.style.textAlign = 'center';
  georoutingContainer.style.padding = '3em 2em 1.88em';

  const textContainer = createTag('div', { class: 'georouting-text-container' });
  const linkContainer = createTag('div', { class: 'georouting-link-container' });
  localeText.forEach((l) => {
    textContainer.append(createTag('p', { class: 'georouting-text' }, l.text));
    linkContainer.append(createTag('a', { class: 'georouting-link' }, l.button));
  });
  georoutingContainer.append(worldIcon, textContainer, linkContainer);

  dialog.append(close, georoutingContainer);
  document.body.append(dialog);
  dialog.showModal();
  close.focus({ focusVisible: true });
});

export default async function loadGeoRouting(config, createTag) {
  const userCountry = await getUserCountry();
  const isUserCountrySameAsInUrl = userCountry === config.locale.prefix;
  if (!isUserCountrySameAsInUrl && !isCookieSet(GeoRoutingCookieNames.georouting_presented)) {
    console.log('Going to show the modal');
    expireGeoLocationCookies();
    showModal(userCountry, createTag, config);
  } else {
    // TODO vhargrave - figure out what to do here
  }
}
