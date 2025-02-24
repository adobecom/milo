import { findDeepFragments } from '../../locui/actions/index.js';
import { urls as locuiUrls } from '../../locui/utils/state.js';
import { validateUrlsFormat } from '../../locui/loc/index.js';
import { PROJECT_TYPES } from '../utils/constant.js';
import { validateOrigin } from '../utils/utils.js';

export function validateProjectName(name) {
  if (name && !/^[a-zA-Z0-9-]+$/.test(name)) {
    return 'Invalid Project Name. Please enter letters, alphabets and hyphens only';
  }
  return '';
}

export function validateUrls(urlsStr) {
  const urls = urlsStr.split(/,|\n/).filter((url) => url);
  const errorMessage = 'Invalid URL Pattern. Please enter valid URL';
  while (urls.length > 0) {
    try {
      if (!(/^(https):\/\/[^\s/$.?#].[^\s]*$/g.test(urls[0]))) {
        return errorMessage;
      }
      if (!validateOrigin(urls[0])) {
        return errorMessage;
      }
    } catch {
      return errorMessage;
    }
    urls.shift();
  }
  return '';
}

export function validateFragments(isFragmentEnabled, noOfValidFrag, fragmentsSelected) {
  if (isFragmentEnabled && noOfValidFrag > 0 && fragmentsSelected.length === 0) {
    return 'Select atleast one fragment to proceed further';
  }
  return '';
}

export function validateForm({
  type,
  name,
  editBehavior,
  urlsStr,
  fragmentsEnabled,
  fragments,
  noOfValidFrag,
}) {
  const errors = { name: '', editBehavior: '', urlsStr: '', fragments: '' };
  if (name === '') {
    errors.name = 'Project name is required';
  }
  if (name.length > 50) {
    errors.name = 'Project name is too long. Please ensure it is no more than 50 characters.';
  }
  if (type === 'rollout' && editBehavior === '') {
    errors.editBehavior = 'Edit behavior is required';
  }
  if (urlsStr === '') {
    errors.urlsStr = 'URLs are required';
  }
  if (fragmentsEnabled && noOfValidFrag > 0 && fragments.length === 0) {
    errors.fragments = 'Select atleast one fragment to proceed further';
  }
  return errors;
}

export function checkForErrors(errors) {
  return (
    errors.name || errors.editBehavior || errors.urlsStr || errors.fragments
  );
}

export async function findFragments(urls) {
  // Using locui state urls as it is internally used in finding fragments and check duplicates
  locuiUrls.value = [...urls];
  const fragmentUrls = urls.map((url) => findDeepFragments(url.pathname));
  const pageFragments = await Promise.all(fragmentUrls);
  const fragmentsByPathname = pageFragments.reduce((acc, fragments, index) => {
    if (fragments.length > 0) {
      fragments.forEach((fragment) => {
        if (acc[fragment.pathname]) {
          acc[fragment.pathname].parentPages.add(urls[index]?.href);
          return acc;
        }
        fragment.parentPages = new Set([urls[index]?.href]);
        acc[fragment.pathname] = fragment;
        return acc;
      });
    }
    return acc;
  }, {});
  locuiUrls.value = [];
  const foundFragments = Object.values(fragmentsByPathname);
  return validateUrlsFormat(foundFragments, true);
}

export function getInitialName(type) {
  const prefix = type === PROJECT_TYPES.rollout ? 'rollout' : 'translate';
  let date = new Date().toISOString();
  if (date.indexOf('.') > -1) {
    date = date.slice(0, date.indexOf('.'));
  }
  const formattedDate = date.replace(/[-:]/g, '').replace(/T/g, '-');
  return `${prefix}-${formattedDate}`;
}
