const ORG_MAP = {
  'da-bacom': 'DA BACOM',
  'da-helpx': 'DA HELPX',
};

(async function init() {
  document.body.style.visibility = 'hidden';

  const searchParams = new URLSearchParams(window.location.search);
  const repo = searchParams.get('tenant');
  const token = searchParams.get('token');
  const tenant = ORG_MAP[repo];

  window.sessionStorage.setItem('da-repo', JSON.stringify(tenant));
  window.sessionStorage.setItem('da-token', JSON.stringify(token));

  if (token === 'undefined') {
    document.body.innerHTML = `
      <div style='display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column;'>
        <h2>Please sign in to continue</h2>
      </div>
    `;
    document.body.style.visibility = 'visible';
    return;
  }

  let fullURL = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + window.location.pathname + '#/search';
  window.history.pushState({}, null, fullURL);
  document.body.style.visibility = 'visible';
  } 
)();
