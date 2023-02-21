import { stub } from 'sinon';

export const replaceKey = stub().returns(
  new Promise((resolve) => {
    resolve('Sign in Mockholder');
  }),
);
