import { STATUS_COLORS, ALL_STATUSES } from './constants.js';

export const getStatusColor = (status) => STATUS_COLORS[status] || '#808080';

export const isStepCompleted = (currentStatus, stepStatus) => {
  const currentIndex = ALL_STATUSES.indexOf(currentStatus);
  const stepIndex = ALL_STATUSES.indexOf(stepStatus);
  const isLastStep = stepIndex === ALL_STATUSES.length - 1;
  const isAtLastStep = currentIndex === ALL_STATUSES.length - 1;
  return stepIndex < currentIndex || (isLastStep && isAtLastStep);
};

export const isInProgressStep = (stepStatus, currentStatus) => {
  const isLastStep = stepStatus === ALL_STATUSES[ALL_STATUSES.length - 1];
  const isAtLastStep = currentStatus === ALL_STATUSES[ALL_STATUSES.length - 1];
  return !isLastStep && !isAtLastStep && (stepStatus === 'initiated' || stepStatus.includes('_in_progress'));
};

export const isLastStep = (stepStatus) => stepStatus === ALL_STATUSES[ALL_STATUSES.length - 1];

export const getStepNumber = (step) => {
  const stepMatch = step.match(/Step (\d+) of \d+/);
  return stepMatch ? parseInt(stepMatch[1], 10) : 0;
}; 
