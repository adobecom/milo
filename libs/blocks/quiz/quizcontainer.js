import { html } from '../../deps/htm-preact.js';

export const DecorateBlockBackgroundCmp = ({ background = '' }) => {
  return html `<div data-valign="middle">
      <picture>
        <source type="image/webp" srcset=${background} media="(min-width: 400px)" />
        <source type="image/png" srcset=${background}  media="(min-width: 400px)" />
        <source type="image/webp" srcset=${background} />

        <img loading="eager" alt="" type="image/png" src=${background}  width="750" height="375" />
      </picture>
  </div>`;
}

export  const DecorateBlockForeground = ({ heading, subhead }) => {
  return html `<div class="foreground container">
    <div data-valign="middle" class="text" daa-lh="${heading}">
      <h2 id="heading-xl-marquee-standard-medium-left" class="heading-XL">
      ${heading}
      </h2>
      <p class="detail-L">${subhead}</p>
    </div>
    
  </div>`;
};

export const DecorateBlockBackground = (getStringValue) => html `<${DecorateBlockBackgroundCmp} background=${getStringValue('background')} />`;
