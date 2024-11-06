function calculatePromoteTime(startTime) {
  const endTime = Date.now();
  const timeTaken = (endTime - startTime) / 1000;
  console.log(`Time taken for promotion: ${timeTaken} seconds`);
}

function isEditableFile(fileExt) {
  return ['html', 'json'].includes(fileExt);
}

export { calculatePromoteTime, isEditableFile };
