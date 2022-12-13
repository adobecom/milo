let fetched = false;
let linkData = null;

const getLinks = async (path) => {
  if (!path) return null;
  if (!fetched) {
    const resp = await fetch(path);
    if (resp.ok) {
      const json = await resp.json();
      linkData = json.data;
    }
    fetched = true;
  }
  return linkData;
};

export default async function init(path, area = document) {
  const data = await getLinks(path);
  if (!data) return;
  const links = area.querySelectorAll('a:not([href^="/"])');
  [...links].forEach((link) => {
    data.filter((s) => link.href.startsWith(s.domain))
      .forEach((s) => {
        if (s.rel) link.setAttribute('rel', s.rel);
        if (s.window) link.setAttribute('target', s.window);
      });
  });
}
