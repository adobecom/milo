
    const mediaCollection = {};
/* c8 ignore next 8 */
function playVideo(video) {
  if (!video) return;
  if (video.getAttribute('autoplay') === null) return;
  const playBtn = video.nextElementSibling;
  const isPlaying = playBtn.getAttribute('aria-pressed') === 'true';
  if (isPlaying || video.readyState === 0) return;
  playBtn.click();
}

/* c8 ignore next 11 */
function pauseVideo(video) {
  if (!video) return;
  if (video.getAttribute('controls') !== null) {
    video.pause();
    return;
  }
  const pauseBtn = video.nextElementSibling;
  const isPlaying = pauseBtn?.getAttribute('aria-pressed') === 'true';
  if (!isPlaying || video.readyState === 0) return;
  pauseBtn.click();
}
function openPanel(btn, panel) {
  const analyticsValue = btn.getAttribute('daa-ll');
  btn.setAttribute('aria-expanded', 'true');
  btn.setAttribute('daa-ll', analyticsValue.replace(/open-/, 'close-'));
  panel.removeAttribute('hidden');
}
function closePanel(btn, panel) {
  const analyticsValue = btn.getAttribute('daa-ll');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('daa-ll', analyticsValue.replace(/close-/, 'open-'));
  panel.setAttribute('hidden', '');
}
function closeMediaPanel(displayArea, el, dd, clickedId) {
  closePanel(el, dd);
  const clickedMedia = displayArea.childNodes[clickedId - 1];
  const video = clickedMedia?.querySelector('video');
  if (video) pauseVideo(video);
  const otherExpandedPanels = el.closest('.accordion').querySelectorAll('.accordion-trigger[aria-expanded="true"]');
  if (!otherExpandedPanels.length) return;
  clickedMedia.classList.remove('expanded');
  const newExpandedId = otherExpandedPanels[0].id.split('trigger-')[1] - 1;
  displayArea.childNodes[newExpandedId].classList.add('expanded');
}
function openMediaPanel(displayArea, el, dd, clickedId) {
  const accordionId = el.getAttribute('aria-controls').split('-')[1];
  [...mediaCollection[accordionId]].forEach((mediaCollectionItem, idx) => {
    const video = mediaCollectionItem.querySelector('video');
    if (idx === clickedId - 1) {
      openPanel(el, dd);
      displayArea?.childNodes[idx]?.classList.add('expanded');
      if (video) playVideo(video);
      return;
    }
    mediaCollectionItem.classList.remove('expanded');
    const trigger = document.querySelector(`#accordion-${accordionId}-trigger-${idx + 1}`);
    const content = document.querySelector(`#accordion-${accordionId}-content-${idx + 1}`);
    closePanel(trigger, content);
    if (video) pauseVideo(video);
  });
}
function handleClick(el, dd, num) {
  const expandAllBtns = el.closest('.accordion-container')?.querySelectorAll('.accordion-expand-all button');
  if (expandAllBtns.length) {
    expandAllBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', 'mixed');
      btn.classList.remove('fill');
      btn.disabled = false;
    });
  }
  const closestEditorial = el.closest('.editorial');
  const expanded = el.getAttribute('aria-expanded') === 'true';
  if (closestEditorial) {
    if (expanded) {
      closeMediaPanel(closestEditorial.querySelector('.accordion-media'), el, dd, num);
      return;
    }
    openMediaPanel(closestEditorial.querySelector('.accordion-media'), el, dd, num);
    return;
  }
  if (expanded) {
    closePanel(el, dd);
    return;
  }
  openPanel(el, dd);
}
    document.querySelectorAll('.accordion').forEach(block => {
      
        (function(){
        const conditionMethod = undefined || (() => true);
        const isSuccess = conditionMethod({block});
        if(!isSuccess) {
          return false;
        }

        const scopeResolver = () => ({
           x: function(){

        }
        });
        const scopeObject = scopeResolver();
        const scopeResult = {};

        for (const key in scopeObject) {
          if (typeof scopeObject[key] === 'function') {
            scopeResult[key] = scopeObject[key]({block});
          }
        }
        const x= scopeResult['x'];
        block.querySelectorAll('button').forEach(el => {
          const paramResolver = () => ({
            id: function(ob) {
          const {block, target, } = ob;
          const id = target.id;
          const adArr = id.split('-');
          return adArr[1]
        },
num: function(ob) {
          const {block, target, } = ob;
          const id = target.id;
          const adArr = id.split('-');
          return adArr[3]
        },
dd: function(ob) {
          const {block, target} = ob;
          const id = target.id;
          const adArr = id.split('-');
          return block.querySelector(`#accordion-${adArr[1]}-content-${adArr[3]}`)
        }
          });
          el.addEventListener('click', (e) => {
            const paramsObject = paramResolver();
            const result = {};

            for (const key in paramsObject) {
              if (typeof paramsObject[key] === 'function') {
                result[key] = paramsObject[key]({target:el, block}); // Execute function and store result
              }
            }

            const id= result['id'];
const num= result['num'];
const dd= result['dd'];
           (e => {
  handleClick(e.target, dd, num, id);
})(e);
          });
        });})();
    });
  