function isEditableFile(fileExt) {
  return ['html', 'json'].includes(fileExt);
}

function findFragmentsAndAssets() {
  return [];
}

export {
  isEditableFile,
  findFragmentsAndAssets,
};
