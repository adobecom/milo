export default async function init(el) {
  el.textContent = document.querySelector('main').textContent;
  await window.holdReport?.();
}
