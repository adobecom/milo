/* eslint-disable */
//Temporary disable eslint as it does not allow only 1 named export in a file
//TODO When more utilities are added, remove the "eslint-disable" comment

export const isValidUrl = (u) => {
  try {
    const urlInstance = new URL(u); // Assign to a constant to avoid ESLint warning
    return !!urlInstance;
  } catch (e) {
    return false;
  }
};
