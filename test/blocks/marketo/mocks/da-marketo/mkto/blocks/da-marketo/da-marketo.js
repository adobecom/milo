// Mock of da-marketo's own da-marketo block, used to verify Milo delegates to it.
export default function init(el) {
  el.dataset.daMarketoRan = 'true';
}
