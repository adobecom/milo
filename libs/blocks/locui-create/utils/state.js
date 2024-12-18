import { signal } from '../../../deps/htm-preact.js';

const emptyProject = {
  name: '',
  htmlFlow: false,
  regionalEditBehavior: '',
  urls: [],
  fragments: false,
  locales: [],
};

export const currentStep = signal(1);
export const isLoading = signal(false);
export const project = signal({ ...emptyProject });
