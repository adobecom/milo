/**
 * this is to execute in the console of Universal Editor in order to handle the copy button.
 */

window.addEventListener('message', (msg) => {
  if (msg.data?.type !== 'odin:copy') return;
  const { merchType, odinPath, aueLabel } = msg.data.data;
  // create a link with the above params and copy it to clipboard both as text and html
  const link = document.createElement('a');
  link.href = `https://experience.adobe.com/#/@odin02/aem/editor/canvas/local.adobe.com/libs/features/mas/studio.html?fragment=${odinPath}`;
  link.innerHTML = `<strong>${merchType}</strong>: ${aueLabel}`;
  link.style.display = 'none';

  const linkBlob = new Blob([link.outerHTML], { type: 'text/html' });
  const textBlob = new Blob([odinPath], { type: 'text/plain' });
  // eslint-disable-next-line no-undef
  const data = [new ClipboardItem({ [linkBlob.type]: linkBlob, [textBlob.type]: textBlob })];
  navigator.clipboard.write(data, console.log, console.error);
});
