import { head } from 'axios'; 

export async function isBranchURLValid(url) {
  try {
    const response = await head(url);
    if (response.status === 200) {
      console.info(`\nURL (${url}) returned a 200 status code. It is valid.`);
      return true;
    } else {
      console.info(`\nURL (${url}) returned a non-200 status code (${response.status}). It is invalid.`);
      return false;
    }
  } catch (error) {
    console.info(`\nError checking URL (${url}): returned a non-200 status code (${response.status})`);
    return false; 
  }
}
