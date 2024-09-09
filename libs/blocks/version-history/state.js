import { signal } from '../../deps/htm-preact.js';

const origin = signal('');
const itemId = signal('');
const comment = signal('');
const error = signal('');
const versions = signal([]);
const showLogin = signal(false);

export {
  origin,
  itemId,
  comment,
  error,
  versions,
  showLogin,
};
