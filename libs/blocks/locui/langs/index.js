import { rolloutLang } from '../utils/miloc.js';

export default async function rollout(item) {
  await rolloutLang(item.code);
}
