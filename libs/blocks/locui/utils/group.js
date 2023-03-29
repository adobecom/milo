export default function group(items, size = 20) {
  const groups = [];
  while (items.length) {
    groups.push(items.splice(0, size));
  }
  return groups;
}
