const INFO_ICON = `<svg id="info" viewBox="0 0 18 18" class="icon-milo icon-milo-info">
    <path fill="currentcolor" d="M10.075,6A1.075,1.075,0,1,1,9,4.925H9A1.075,1.075,0,0,1,10.075,6Zm.09173,6H10V8.2A.20005.20005,0,0,0,9.8,8H7.83324S7.25,8.01612,7.25,8.5c0,.48365.58325.5.58325.5H8v3H7.83325s-.58325.01612-.58325.5c0,.48365.58325.5.58325.5h2.3335s.58325-.01635.58325-.5C10.75,12.01612,10.16673,12,10.16673,12ZM9,.5A8.5,8.5,0,1,0,17.5,9,8.5,8.5,0,0,0,9,.5ZM9,15.6748A6.67481,6.67481,0,1,1,15.67484,9,6.67481,6.67481,0,0,1,9,15.6748Z"></path>
  </svg>`;

async function getJson(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Response status: ${resp.status}`);
    }
    return await resp.json();
  } catch (error) {
    window.lana?.log(error.message);
    return null;
  }
}

export default async function delist(locale) {
  const url = `${locale.contentRoot}/docs/library/blocks/block-notifications.json`;
  const json = await getJson(url);
  const blocks = [];
  const tags = [];
  const urls = [];

  json.data.forEach((item) => {
    blocks.push(`.${item.name}`);
    tags.push(item.tag);
    urls.push(item.url);
  });

  const arraysObject = { blocks, tags, urls };
  const blockNotification = document.querySelectorAll(arraysObject.blocks);

  blockNotification.forEach((block, idx) => {
    const tagText = arraysObject.tags[idx] || 'delisted';
    const alertDOM = document.createElement('div');

    block.classList.add('block-alert');
    alertDOM.textContent = tagText;
    if (arraysObject.urls[idx]) {
      const alertLink = document.createElement('a');
      alertLink.href = arraysObject.urls[idx];
      alertLink.target = '_blank';
      alertLink.innerHTML = INFO_ICON;
      alertDOM.appendChild(alertLink);
    }
    alertDOM.classList.add('alert-tag');
    block.appendChild(alertDOM);
  });
}
