import { stub } from 'sinon';

export const createC2pa = stub()
  .returns({ read: () => new Promise((resolve, reject) => { reject(new Error('Metadata not found')); }) });

export const selectFormattedGenerator = stub();

export const selectGenerativeInfo = stub();
