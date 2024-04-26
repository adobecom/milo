import { getConfig, loadStyle, createTag } from './utils.js';

const PLAY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" fill="none" class="play-icon">
                        <path d="M24 16.0005L0 32L1.39876e-06 0L24 16.0005Z" fill="white"/>
                      </svg>`;

export default function init(el, a, btnFormat) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  loadStyle(`${base}/styles/consonant-play-button.css`);

  const playBtnFormat = btnFormat.split(':')[1];
  const btnSize = playBtnFormat.includes('-') ? `btn-${playBtnFormat.split('-')[1]}` : 'btn-large';
  const pic = el.querySelector('picture');
  const playIcon = createTag('div', { class: 'play-icon-container', 'aria-label': 'play', role: 'button' }, PLAY_ICON_SVG);
  const imgLinkContainer = createTag('span', { class: 'modal-img-link' });
  el.insertBefore(imgLinkContainer, pic);
  if (btnSize) a.classList.add(btnSize);
  a.classList.add('consonant-play-btn');
  a.append(playIcon);
  imgLinkContainer.append(pic, a);
}
