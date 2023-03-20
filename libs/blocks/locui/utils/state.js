import { signal } from '../../../deps/htm-preact.js';

const DEFAULT_STATUS = { type: 'Status', text: 'Getting project name.' };

// Signals
export const status = signal(DEFAULT_STATUS);
export const heading = signal({ name: '' });
export const languages = signal([]);
export const urls = signal([]);
