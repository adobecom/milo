import { signal } from '../../../deps/htm-preact.js';

export const currentStep = signal(1);
export const project = signal(null);

export function nextStep() {
  currentStep.value += 1;
}

export function prevStep() {
  currentStep.value -= 1;
}

export function setProject(_project) {
  // console.log('setting project:', _project)
  project.value = {
    ...project.value,
    ..._project,
  };
}

export function reset() {
  currentStep.value = 1;
  project.value = null;
}
