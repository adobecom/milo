import { html } from '../../deps/htm-preact.js';

export const DecorateBlockBackgroundCmp = ({ background = '' }) => html`<img loading="eager" alt="" src=${background} height="1020" width="1920" />`;

export const DecorateBlockForeground = ({ heading, subhead }) => html`<div class="quiz-foreground">
    <h1 id="question" class="quiz-question-title" daa-lh="${heading}">${heading}</h1>
    <p class="quiz-question-text">${subhead}</p>
  </div>`;

export const DecorateBlockBackground = (getStringValue) => html`<${DecorateBlockBackgroundCmp} background=${getStringValue('background')} />`;
