window.addEventListener('message', (msg) => {
  if (msg.data?.type !== 'odin:copy') return;
  const { odinPath, miloBlock, aueLabel } = msg.data.data;
  // create a link with the above params and copy it to clipboard both as text and html
  const link = document.createElement('a');
  link.href = `https://milo.adobe.com/tools/odin/index.html?fragment=${odinPath}`;
  link.innerHTML = `<strong>${miloBlock}</strong>: ${aueLabel}`;
  link.style.display = 'none';

  const linkBlob = new Blob([link.outerHTML], { type: 'text/html' });
  const textBlob = new Blob([link.href], { type: 'text/plain' });
  // eslint-disable-next-line no-undef
  const data = [new ClipboardItem({ [linkBlob.type]: linkBlob, [textBlob.type]: textBlob })];
  navigator.clipboard.write(data, console.log, console.error);
});
