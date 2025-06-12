export default class TimelineBlock {
  constructor(page, nth = 0) {
    this.page = page;

    this.timelineBlock = page.locator('.timeline').nth(nth);

    this.allHeadings = page.locator('[data-valign="middle"] h3');
    this.day1Heading = this.allHeadings.nth(0);
    this.day8HeadingLeft = this.allHeadings.nth(1);
    this.day8HeadingRight = this.allHeadings.nth(2);
    this.day21Heading = this.allHeadings.nth(3);

    this.allParagraphs = page.locator('[data-valign="middle"] p');
    this.day1Paragraph = this.allParagraphs.nth(0);
    this.day8ParagraphLeft = this.allParagraphs.nth(1);
    this.day8ParagraphRight = this.allParagraphs.nth(2);
    this.day21Paragraph = this.allParagraphs.nth(3);

    this.bar1 = page.locator('.bar').nth(0);
    this.bar2 = page.locator('.bar').nth(1);
    this.bar3 = page.locator('.bar').nth(2);
    this.banner1 = this.timelineBlock.locator('.left .period.body-s');
    this.banner2 = this.timelineBlock.locator('.right .period.body-s');
    this.timeline = page.locator('.timeline');

    this.attributes = {
      'segment-timeline': {
        backgroundLeft: {
          style:
            'background: linear-gradient(to right, rgb(244, 122, 178) 0px, rgb(255, 206, 46) 100%);',
        },
        backgroundRight: { style: 'background: rgb(255, 206, 46);' },
        backgroundBar1: { style: 'background: rgb(244, 122, 178);' },
        backgroundBar2: { style: 'background: rgb(255, 206, 46);' },
        backgroundBar3: { style: 'background: rgb(255, 206, 46);' },
      },
    };
  }
}
