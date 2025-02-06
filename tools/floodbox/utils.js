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

function getFileExtension(path) {
  const match = path.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1] : null;
}

export {
  isEditableFile,
  getFileName,
  getFileExtension,
};
