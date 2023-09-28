import { signal } from '../../../deps/htm-preact.js';
import { serviceStatusDate } from '../utils/state.js';

export const showContents = signal(false);

export function getPrettyDate() {
  if (!serviceStatusDate.value) return null;
  const dateObj = serviceStatusDate.value;
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], { hour12: false });
  return [date, time];
}

export function toggleContent() {
  showContents.value = showContents.value === false;
}
