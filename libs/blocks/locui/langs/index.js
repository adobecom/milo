import { rolloutLang } from '../utils/miloc.js';
import { languages } from '../utils/state.js';

export default async function rollout(item, idx) {
  const reroll = item.status === 'completed';

  // Update the UI immediate instead of waiting on polling
  languages.value[idx].status = 'rolling-out';
  languages.value[idx].done = 0;
  languages.value = [...languages.value];

  await rolloutLang(item.code, reroll);
}
