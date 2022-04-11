export default function init(a) {
  const block = document.createElement('div');
  block.className = a.className;
  const url = new URL(a.href);
  url.searchParams.forEach((value, key) => {
    const p = document.createElement('p');
    p.className = 'demo';
    p.innerHTML = `<strong>${key}:</strong> ${value}`;
    block.append(p);
  });
  a.parentElement.replaceChild(block, a);
}
