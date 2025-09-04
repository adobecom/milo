/* eslint-disable import/no-import-module-exports */

export default class DefaultFlags {
  constructor(page) {
    this.page = page;
    this.prices = {
      seat: {
        el: page.locator('[data-wcs-osi="1KfaN_o5h4Gvmvh_QwfK7KB7xGPpNpsTXsdhqpJUT5Y"] .price-unit-type'),
        textEN: '',
        textFR: '',
        textNG: '',
      },
      old: {
        el: page.locator('[data-wcs-osi="yIcVsmjmQCHKQ-TvUJxH3-kop4ifvwoMBBzVg3qfaTg"] .price.price-strikethrough'),
        textEN: '',
        textFR: '',
        textNG: '',
      },
      taxIndividual: {
        el: page.locator('[data-wcs-osi="A1xn6EL4pK93bWjM8flffQpfEL-bnvtoQKQAvkx574M"] .price-tax-inclusivity:not(.disabled)'),
        textEN: '',
        textFR: 'TVA comprise',
        textNG: 'incl. VAT',
      },
      taxBusiness: {
        el: page.locator('[data-wcs-osi="yHKQJK2VOMSY5bINgg7oa2ov9RnmnU1oJe4NOg4QTYI"] .price-tax-inclusivity:not(.disabled)'),
        textEN: '',
        textFR: 'hors TVA',
        textNG: 'incl. VAT',
      },
      taxStudents: {
        el: page.locator('[data-wcs-osi="ZaYfYXbCY4vSKmLfVe-8_RrEDOkwRrFLUgGR3tBXu6k"] .price-tax-inclusivity:not(.disabled)'),
        textEN: '',
        textFR: 'TVA comprise',
        textNG: '',
      },
      taxUni: {
        el: page.locator('[data-wcs-osi="Q4QqArYA-FiSl-onSZlz_r3QUnDjXirAHaYcQW9KoTk"] .price-tax-inclusivity:not(.disabled)'),
        textEN: '',
        textFR: 'hors TVA',
        textNG: '',
      },
    };
    this.props = {};
  }
}
