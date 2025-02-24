export default class Video {
  constructor(page, nth = 0) {
    this.page = page;

    // video locators
    this.section = this.page.locator('.section').nth(nth);
    this.content = this.page.locator('.content').nth(nth);
    this.fragment = this.page.locator('.fragment');
    this.video = this.page.locator('.content video');
    this.videoSource = this.video.locator('source');
    this.miloVideo = this.page.locator('.milo-video');
    this.iframe = this.page.locator('iframe').first();
    this.mpcPlayerTitle = this.page.frameLocator('iframe').first().locator('.mpc-player__title');
    this.mpcPlayButton = this.page.frameLocator('iframe').first().locator('button .mpc-large-play.mpc-player__large-play');
    this.mpcMutedButton = this.page.frameLocator('iframe').first().locator('.mpc-player button[aria-label="Mute"]');
    this.mpcMutedLabel = this.page.frameLocator('iframe').first().locator('.mpc-player button[aria-label="Mute"] span');
    this.youtubePlayButton = this.page.locator('button.lty-playbtn');
    this.liteYoutube = this.page.locator('lite-youtube');
    this.modalVideo = this.fragment.locator('video');
    this.modalVideoSource = this.modalVideo.locator('source');
    this.consonantCardsGrid = this.page.locator('.consonant-CardsGrid');
    this.consonantCards = this.consonantCardsGrid.locator('.card.consonant-Card');
    this.video = this.page.locator('.content video');
    this.videoSource = this.video.locator('source');

    // video block attributes
    this.attributes = {
      'video.default': {
        playsinline: '',
        controls: '',
      },
      'video.source': {
        type: 'video/mp4',
        src: /.*.mp4/,
      },
      'video.autoplay': {
        playsinline: '',
        autoplay: '',
        loop: '',
        muted: '',
      },
      'video.autoplay.once': {
        playsinline: '',
        autoplay: '',
        muted: '',
      },
      'video.hover.play': {
        playsinline: '',
        autoplay: '',
        muted: '',
        'data-hoverplay': '',
        'data-mouseevent': 'true',
      },
      'iframe-mpc': {
        class: 'adobetv',
        scrolling: 'no',
        allow: 'encrypted-media; fullscreen',
        loading: 'lazy',
      },
      'iframe-youtube': {
        class: 'youtube',
        scrolling: 'no',
        allowfullscreen: '',
        allow: 'encrypted-media; accelerometer; gyroscope; picture-in-picture',
      },
      analytics: {
        'section.daa-lh': { 'daa-lh': /s[1-9]/ },
        'content.daa-lh': { 'daa-lh': /b[1-9]|content|default|default/ },
      },
    };
  }
}
