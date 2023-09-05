import { html } from '../../deps/htm-preact.js';

export const DecorateBlockBackgroundCmp = ({ background = '' }) => html`<div data-valign="middle">
      <picture>
        <source type="image/webp" srcset=${background} media="(min-width: 400px)" />
        <source type="image/png" srcset=${background}  media="(min-width: 400px)" />
        <source type="image/webp" srcset=${background} />
        <img loading="eager" alt="" type="image/png" src=${background}  width="750" height="375" />
      </picture>
  </div>`;

export const DecorateBlockForeground = ({ heading, subhead }) => html`<div class="quiz-foreground">
    <div class="text" daa-lh="${heading}">
      <h2 class="quiz-question-title">
      ${heading}
      </h2>
      <p class="quiz-question-text">${subhead}</p>
    </div>
  </div>`;

export const DecorateBlockBackground = (getStringValue) => html`<${DecorateBlockBackgroundCmp} background=${getStringValue('background')} />`;
