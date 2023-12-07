export default function init(el) {
  el.classList.add('con-block', 'aside-video');
  let rows = el.querySelectorAll(':scope > div ');

  rows.forEach(element => {
    element.classList.add('container');
    decorateColumns(element);
  });
}


function decorateColumns(element) {
  let columns = element.querySelectorAll(':scope > div');
  columns.forEach(column => {
    const item = column.firstChild
   if( item instanceof HTMLAnchorElement) {
    const video = `<video controls>
        <source src="${item.innerText}" type="video/mp4" />
      </video>`;
      item.insertAdjacentHTML('afterend', video);
      item.remove()
    }
  })
}
