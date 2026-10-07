import sinon from 'sinon';

export default function mockExternalScripts() {
  const append = document.head.append.bind(document.head);
  return sinon.stub(document.head, 'append').callsFake((...elements) => {
    elements.forEach((element) => {
      if (element.tagName === 'SCRIPT' && element.src.startsWith('https://')) {
        setTimeout(() => element.dispatchEvent(new Event('load')), 0);
      } else {
        append(element);
      }
    });
  });
}
