export default function init(el) {
  const container = el.querySelector(':scope > div');
  container.classList.add('container');
  const list = el.querySelector('ul');
  const headingDiv = container.querySelector('div:first-of-type');
  const heading = document.createElement('h1');
  heading.textContent = headingDiv.textContent;
  headingDiv.remove();
  container.append(heading, list);
}
