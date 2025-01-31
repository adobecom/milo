import { getConfig } from '../../utils/utils.js';

async function getCommunityImages() {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  const response = await fetch(
    `${base}/blocks/turing/communityres.json`
  );
  const data = await response.json();
  return data;
}

function decorateTuringEl(el, imgSet) {
  const imgList = [];
  imgSet['_embedded']['assets'].forEach((a) => {
    let imgUrl = a['_links']['rendition'].href;
    imgUrl = imgUrl.replace('{format}', 'png');
    imgUrl = imgUrl.replace('{dimension}', 'width');
    imgUrl = imgUrl.replace('{size}', '200');
    imgList.push({
      creator: a["_embedded"]["owner"]["display_name"],
      title: a.title,
      url: imgUrl,
    });
  });
  console.log('Turing: ', imgList);
  const x = document.querySelector('.turing');
  x.classList.add('carousel_items');
  imgList.forEach((img, i) => {
    x.innerHTML += `<div class="carousel_item"> <p class="carousel_text"> <span class="carousel_title"> ${img.title.substring(
      0,
      20,
    )}... </span> <span class="carousel_creator"> ${
      img.creator
    } </span> </p> </div>`;
    const tmp = x.querySelector('div:last-child');
    tmp.style.backgroundImage = `url("${img.url}")`;
  });
  const carouselItems = document.querySelectorAll('.carousel_item');
}

export default async function init(el) {
  const imgSet = await getCommunityImages();
  decorateTuringEl(el, imgSet);
}
