import { html } from '../../deps/htm-preact.js';

export const DecorateBlockBackgroundCmp = ({ background = '' }) => html`<picture>
        <source type="image/webp" srcset=${background} media="(min-width: 400px)" />
        <source type="image/png" srcset=${background}  media="(min-width: 400px)" />
        <source type="image/webp" srcset=${background} />
        <img loading="eager" alt="" type="image/png" src=${background}  width="750" height="375" />
      </picture>`;

export const DecorateBlockForeground = ({ heading, subhead }) => html`<div class="quiz-foreground">
    <h1 class="quiz-question-title" daa-lh="${heading}">${heading}</h1>
    <p class="quiz-question-text">${subhead}</p>
  </div>`;

export const DecorateBlockBackground = (getStringValue) => html`<${DecorateBlockBackgroundCmp} background=${getStringValue('background')} />`;
