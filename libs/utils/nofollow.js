export default async function init(path, area = document) {
  if (!path) return null;
  const resp = await fetch(path);
  if (!resp.ok) return null;
  const json = await resp.json();
  const links = area.querySelectorAll('a:not([href^="/"])');
  return [...links].map((link) => {
    json.data.forEach((site) => {
      if (link.href.startsWith(site.domain)) {
        link.setAttribute('rel', 'nofollow noopener noreferrer');
        link.setAttribute('target', '_blank');
      }
    });
    return link;
  });
}
