function groupTags(tags) {
  const groups = [];
  tags.forEach(({ name, title }) => {
    let children = groups;
    name.split('/').slice(0, -1).filter(Boolean).forEach((segment) => {
      let group = children.find((tag) => tag.name === segment && tag.children.length > 0);
      if (!group) {
        group = { name: segment, title: segment, children: [] };
        children.push(group);
      }
      children = group.children;
    });
    children.push({ name, title, children: [] });
  });
  return groups;
}

export default async function fetchTags(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Could not load tags.');

  const json = await resp.json();
  const sheets = Array.isArray(json.data) ? [['Tags', json]] : Object.entries(json);
  return sheets
    .filter(([, sheet]) => Array.isArray(sheet?.data) && sheet.data.length > 0)
    .map(([name, sheet]) => ({
      name,
      title: name,
      children: groupTags(sheet.data),
    }));
}
