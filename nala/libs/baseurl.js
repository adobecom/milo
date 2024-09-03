/* eslint-disable import/no-extraneous-dependencies, import/prefer-default-export, max-len, no-console */
import { head } from 'axios';

export async function isBranchURLValid(url) {
  try {
    const response = await head(url);
    if (response.status === 200) {
      console.info(`\nURL (${url}) returned a 200 status code. It is valid.`);
      return true;
    }
    console.info(`\nURL (${url}) returned a non-200 status code (${response.status}). It is invalid.`);
    return false;
  } catch (error) {
    console.info(`\nError checking URL (${url}): returned a non-200 status code (${error.message})`);
    return false;
  }
}
