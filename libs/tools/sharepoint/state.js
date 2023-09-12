import { signal } from '../../deps/htm-preact.js';

const account = signal({});
const accessToken = signal('');
const accessTokenExtra = signal('');

export { account, accessToken, accessTokenExtra };
