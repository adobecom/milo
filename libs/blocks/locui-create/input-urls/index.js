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
      const url = new URL(urls[0]);
      if (url.origin !== window.location.origin) {
        return errorMessage;
      }
    } catch {
      return errorMessage;
    }
    urls.shift();
  }
  return '';
}

export function validateForm({
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
  if (editBehavior === '') {
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
