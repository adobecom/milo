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
  if (!path) return null;
  const data = await getNoFollowLinks(path);
  const links = area.querySelectorAll('a:not([href^="/"])');
  return [...links].map((link) => {
    data.forEach((site) => {
      if (link.href.startsWith(site.domain)) {
        link.setAttribute('rel', 'nofollow noopener noreferrer');
        link.setAttribute('target', '_blank');
      }
    });
    return link;
  });
}
