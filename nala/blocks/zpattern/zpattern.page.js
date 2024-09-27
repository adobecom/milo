export default class ZPattern {
  constructor(page, nth = 0) {
    this.page = page;
    // z-pattern  locators
    this.zPattern = page.locator('.z-pattern').nth(nth);

    // zpatter header
    this.zPatternHeader = this.zPattern.locator('.heading-row');
    this.zPatternPText = this.zPatternHeader.locator('p');

    this.smallIntroHeadingText = this.zPattern.locator('#small-default-intro-text-optional');
    this.mediumIntroHeadingText = this.zPattern.locator('#medium-intro-text-optional');
    this.largeIntroHeadingText = this.zPattern.locator('#large-intro-text-optional');
    this.darkIntroHeadingText = this.zPattern.locator('#intuitive-block-authoring');

    this.zPatternMediaBlocks = this.zPattern.locator('.media');
    this.mediaBlocks = this.zPattern.locator('.media');

    // zpattern contents attributes
    this.attProperties = {
      'z-pattern': { style: 'background: rgb(245, 245, 245);' },
      'z-pattern-dark': { style: 'background: rgb(50, 50, 50);' },
      'small-default-intro-text-optional': { class: 'heading-l headline' },
      'medium-intro-text-optional': { class: 'heading-l headline' },
      'large-intro-text-optional': { class: 'heading-xl headline' },
      'dark-intro-text-optional': { class: 'heading-l headline' },
      'media-medium': { class: 'media medium con-block' },
      'small-media-reversed': { class: 'media small media-reversed con-block' },
      'medium-media-reversed': { class: 'media medium media-reversed con-block' },
      'medium-media-reverse-mobile': { class: 'media medium con-block media-reverse-mobile' },
      'large-media-reversed': { class: 'media large media-reversed con-block' },
      'media-image': {
        width: '600',
        height: '300',
      },

    };
  }
}
