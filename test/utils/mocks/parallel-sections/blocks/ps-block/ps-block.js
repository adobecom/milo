export default async function init(el) {
  const { started, gates } = window.parallelSectionsTest;
  started.push(el.dataset.id);
  await gates[el.dataset.id];
}
