const ADMIN = 'https://admin.hlx.page';
const LANG_ACTIONS = ['Translate', 'English Copy', 'Rollout'];

let resourcePath;

export async function getStatus() {
  const urlParams = new URLSearchParams(window.location.search);
  const owner = urlParams.get('owner');
  const repo = urlParams.get('repo');
  const ref = urlParams.get('ref');
  const editUrl = urlParams.get('referrer');
  // TODO: Die gracefully here
  const resp = await fetch(`${ADMIN}/status/${owner}/${repo}/${ref}?editUrl=${editUrl}`);
  const json = await resp.json();
  resourcePath = json.resourcePath;
  return json;
}

function getPaths(urls) {
  return urls.data.map((item) => {
    const url = new URL(item.URL);
    return url.pathname;
  });
}

export async function getProjectDetails() {
  const resp = await fetch(resourcePath);
  if (!resp.ok) return null;
  const json = await resp.json();
  const paths = getPaths(json.urls);
  const languages = json.languages.data.filter((lang) => LANG_ACTIONS.includes(lang.Action));
  return { languages, paths };
}

export async function getProjectHeading() {
  const { edit } = await getStatus();
  const projectName = edit.name.split('.').shift().replace('-', ' ');
  return { name: projectName, editUrl: edit.url };
}
