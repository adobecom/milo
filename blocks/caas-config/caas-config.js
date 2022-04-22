export default function init(block) {
  block.querySelector('div').remove();
  const title = document.createElement('h2');
  title.textContent = 'CaaS Configurator';
  block.append(title);
  console.log(window.location.href);
  const url = new URL(window.location.href);
  url.searchParams.forEach((value, key) => {
    const p = document.createElement('p');
    p.className = 'demo';
    p.innerHTML = `<strong>${key}:</strong> ${value}`;
    block.append(p);
  });
}
