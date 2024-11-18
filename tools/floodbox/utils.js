function isEditableFile(fileExt) {
  return ['html', 'json'].includes(fileExt);
}

function getFileName(path) {
  const fileNameWithExt = path.split('/').pop();
  if (fileNameWithExt.includes('.')) {
    return fileNameWithExt.split('.').slice(0, -1).join('.');
  }
  return fileNameWithExt;
}

function findFragmentsAndAssets() {
  return [];
}

export {
  isEditableFile,
  getFileName,
  findFragmentsAndAssets,
};
