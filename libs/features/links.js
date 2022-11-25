const getNoFollowLinks = (() => {
  let data;
  return async (path) => {
    if (!path) return null;
    if (!data) {
      const resp = await fetch(path);
      if (!resp.ok) return null;
      const json = await resp.json();
      data = json.data;
    }
    return data;
  };
})();

export default async function init(path, area = document) {
  const data = await getNoFollowLinks(path);
  if (!data) return null;
  const links = area.querySelectorAll('a:not([href^="/"])');
  [...links].forEach((link) => {
    data.filter((s) => link.href.startsWith(s.domain)).map((s) => {
      if(s.rel) link.setAttribute('rel', s.rel);
      if(s.window) link.setAttribute('target', s.window);
    })
  });
}
