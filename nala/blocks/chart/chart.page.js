export default class Chart {
  constructor(page, nth = 0) {
    this.page = page;
    // chart locators
    this.chart = this.page.locator('.chart').nth(nth);
    this.type = this.page.locator('.chart').nth(nth);

    this.title = this.chart.locator('.title');
    this.subTitle = this.chart.locator('.subtitle').nth(0);
    this.container = this.chart.locator('.chart-container');
    this.svgImg = this.container.locator('svg');
    this.svgImgCircle = this.container.locator('circle');
    this.svgImgCircleNumber = this.container.locator('text.number');
    this.svgImgCircleSubTitle = this.container.locator('text.subtitle');

    this.legendChrome = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Chrome' });
    this.legendFirefox = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Firefox' });
    this.legendEdge = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Edge' });
    this.legendSafari = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Safari' });
    this.legendOpera = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Opera' });
    this.legendChromeAndroid = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Chrome Android' });
    this.legendFirefoxAndroid = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Firefox Android' });
    this.legendSafariIos = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Safari iOS' });
    this.legendOperaAndroid = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Opera Android' });
    this.legendSamsungInternet = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Samsung Internet' });
    this.legendAdobeAcrobat = page.locator('text[dominant-baseline="central"][fill="#333"]').filter({ hasText: 'Adobe Acrobat' });
    this.legendAdobeExperienceManager = page.locator('text[dominant-baseline="central"][fill="#333"]').filter({ hasText: 'Adobe Experience Manager' });

    this.x_axisMonday = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Monday' });
    this.x_axisTuesday = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Tuesday' });
    this.x_axisSunday = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Sunday' });
    this.y_axis50K = page.locator('text[dominant-baseline="central"]').filter({ hasText: '50K', exact: true });
    this.y_axis100K = page.locator('text[dominant-baseline="central"]').filter({ hasText: '100K', exact: true });
    this.y_axis250K = page.locator('text[dominant-baseline="central"]').filter({ hasText: '250K', exact: true });
    this.y_axis300K = page.locator('text[dominant-baseline="central"]').filter({ hasText: '300K', exact: true });

    this.donutTitle = page.locator('text[dominant-baseline="central"]').filter({ hasText: 'Hello World', exact: true });

    this.pieChartLabelAdobeSign = page.locator('text[dominant-baseline="central"][text-anchor="end"]').filter({ hasText: 'Adobe Sign' });
    this.pieChartLabelAdobePhotoshop = page.locator('text[dominant-baseline="central"][text-anchor="end"]').filter({ hasText: 'Adobe Photoshop' });
    this.pieChartLabelAdobePremier = page.locator('text[dominant-baseline="central"][text-anchor="end"]').filter({ hasText: 'Adobe Premier' });

    // chart footer
    this.footNote = this.chart.locator('.footnote');

    // chart attributes
    this.attributes = { svgViewBox: { viewBox: '0 0 430 430' } };
  }
}
