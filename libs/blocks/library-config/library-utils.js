/* global ClipboardItem */
export default function createCopy(blob) {
  const data = [new ClipboardItem({ [blob.type]: blob })];
  navigator.clipboard.write(data);
}
