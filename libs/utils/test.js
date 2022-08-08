import { getConfig } from './utils.js';

export default function init() {
  const { locale } = getConfig();
  console.log(locale);
}
