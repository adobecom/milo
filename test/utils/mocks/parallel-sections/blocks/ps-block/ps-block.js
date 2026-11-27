import { loadSectionsEarly } from '../../../../../../libs/utils/utils.js';

export default async function init(el) {
  const { started, gates } = window.parallelSectionsTest;
  started.push(el.dataset.id);
  if (el.dataset.rush) loadSectionsEarly([...document.querySelectorAll(el.dataset.rush)]);
  await gates[el.dataset.id];
}
