"use strict";

var _testRunnerCommands = require("@web/test-runner-commands");

var _chai = require("@esm-bundle/chai");

var _sinon = _interopRequireDefault(require("sinon"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var utils = {};
var config = {
  codeRoot: '/libs',
  locales: {
    '': {
      ietf: 'en-US',
      tk: 'hah7vzn.css'
    }
  }
};
describe('Utils', function () {
  before(function _callee() {
    var module;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Promise.resolve().then(function () {
              return _interopRequireWildcard(require('../../libs/utils/utils.js'));
            }));

          case 2:
            module = _context.sent;
            module.setConfig(config);
            Object.keys(module).forEach(function (func) {
              utils[func] = module[func];
            });

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  describe('with body', function () {
    before(function () {
      _sinon["default"].spy(console, 'log');
    });
    after(function () {
      console.log.restore();
    });
    before(function _callee2() {
      return regeneratorRuntime.async(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap((0, _testRunnerCommands.readFile)({
                path: './mocks/head.html'
              }));

            case 2:
              document.head.innerHTML = _context2.sent;
              _context2.next = 5;
              return regeneratorRuntime.awrap((0, _testRunnerCommands.readFile)({
                path: './mocks/body.html'
              }));

            case 5:
              document.body.innerHTML = _context2.sent;

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      });
    });
    describe('Template', function () {
      it('loads a template script and style', function _callee3() {
        var meta, hasTemplateSidebar;
        return regeneratorRuntime.async(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                meta = document.createElement('meta');
                meta.name = 'template';
                meta.content = 'Template Sidebar';
                document.head.append(meta);
                _context3.next = 6;
                return regeneratorRuntime.awrap(utils.loadTemplate());

              case 6:
                hasTemplateSidebar = document.querySelector('body.template-sidebar');
                (0, _chai.expect)(hasTemplateSidebar).to.exist;

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        });
      });
    });
    describe('PDF Viewer', function () {
      it('pdf link with different text content opens in new window', function () {
        var link = document.querySelector('a[href$="pdf"]');
        utils.decorateAutoBlock(link);
        (0, _chai.expect)(link.target).to.equal('_blank');
      });
    });
    describe('Fragments', function () {
      it('fully unwraps a fragment', function () {
        var fragments = document.querySelectorAll('.link-block.fragment');
        utils.decorateAutoBlock(fragments[0]);
        (0, _chai.expect)(fragments[0].parentElement.nodeName).to.equal('DIV');
      });
      it('Does not unwrap when sibling content present', function () {
        var fragments = document.querySelectorAll('.link-block.fragment');
        utils.decorateAutoBlock(fragments[1]);
        (0, _chai.expect)(fragments[1].parentElement.nodeName).to.equal('P');
        (0, _chai.expect)(fragments[1].parentElement.textContent).to.contain('My sibling');
      });
      it('Does not unwrap when not in paragraph tag', function () {
        var fragments = document.querySelectorAll('.link-block.fragment');
        utils.decorateAutoBlock(fragments[1]);
        (0, _chai.expect)(fragments[1].parentElement.nodeName).to.equal('P');
        (0, _chai.expect)(fragments[1].parentElement.textContent).to.contain('My sibling');
      });
    });
    it('Loads a script', function _callee4() {
      var script;
      return regeneratorRuntime.async(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(utils.loadScript('/test/utils/mocks/script.js', 'module'));

            case 2:
              script = _context4.sent;
              (0, _chai.expect)(script).to.exist;
              (0, _chai.expect)(script.type).to.equal('module');
              _context4.next = 7;
              return regeneratorRuntime.awrap(utils.loadScript('/test/utils/mocks/script.js', 'module'));

            case 7:
              (0, _chai.expect)(script).to.exist;

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      });
    });
    it('Loads a script twice', function _callee5() {
      var scriptOne, scriptTwo;
      return regeneratorRuntime.async(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(utils.loadScript('/test/utils/mocks/script.js', 'module'));

            case 2:
              scriptOne = _context5.sent;
              (0, _chai.expect)(scriptOne).to.exist;
              _context5.next = 6;
              return regeneratorRuntime.awrap(utils.loadScript('/test/utils/mocks/script.js', 'module'));

            case 6:
              scriptTwo = _context5.sent;
              (0, _chai.expect)(scriptTwo).to.exist;

            case 8:
            case "end":
              return _context5.stop();
          }
        }
      });
    });
    it('Rejects a bad script', function _callee6() {
      return regeneratorRuntime.async(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(utils.loadScript('/test/utils/mocks/error.js'));

            case 3:
              _context6.next = 8;
              break;

            case 5:
              _context6.prev = 5;
              _context6.t0 = _context6["catch"](0);
              (0, _chai.expect)(_context6.t0.message).to.equal('error loading script: http://localhost:2000/test/utils/mocks/error.js');

            case 8:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 5]]);
    });
    it('Does not setup nofollow links', function _callee7() {
      var gaLink;
      return regeneratorRuntime.async(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              gaLink = document.querySelector('a[href="https://analytics.google.com"]');
              (0, _chai.expect)(gaLink.getAttribute('rel')).to.be["null"];

            case 2:
            case "end":
              return _context7.stop();
          }
        }
      });
    });
    it('Sets up nofollow links', function _callee8() {
      var metaOn, metaPath, gaLink;
      return regeneratorRuntime.async(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              metaOn = document.createElement('meta');
              metaOn.name = 'nofollow-links';
              metaOn.content = 'on';
              metaPath = document.createElement('meta');
              metaPath.name = 'nofollow-path';
              metaPath.content = '/test/utils/mocks/nofollow.json';
              document.head.append(metaOn, metaPath);
              _context8.next = 9;
              return regeneratorRuntime.awrap(utils.loadDeferred(document, [], {
                contentRoot: ''
              }));

            case 9:
              gaLink = document.querySelector('a[href^="https://analytics.google.com"]');
              (0, _chai.expect)(gaLink).to.exist;

            case 11:
            case "end":
              return _context8.stop();
          }
        }
      });
    });
    it('loadDelayed() test - expect moduled', function _callee9() {
      var mod;
      return regeneratorRuntime.async(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return regeneratorRuntime.awrap(utils.loadDelayed(0));

            case 2:
              mod = _context9.sent;
              (0, _chai.expect)(mod).to.exist;

            case 4:
            case "end":
              return _context9.stop();
          }
        }
      });
    });
    it('loadDelayed() test - expect nothing', function _callee10() {
      var mod;
      return regeneratorRuntime.async(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              document.head.querySelector('meta[name="interlinks"]').remove();
              _context10.next = 3;
              return regeneratorRuntime.awrap(utils.loadDelayed(0));

            case 3:
              mod = _context10.sent;
              (0, _chai.expect)(mod).to.be["null"];

            case 5:
            case "end":
              return _context10.stop();
          }
        }
      });
    });
    it('Converts UTF-8 to Base 64', function () {
      var b64 = utils.utf8ToB64('hello world');
      (0, _chai.expect)(b64).to.equal('aGVsbG8gd29ybGQ=');
    });
    it('Converts Base 64 to UTF-8', function () {
      var b64 = utils.b64ToUtf8('aGVsbG8gd29ybGQ=');
      (0, _chai.expect)(b64).to.equal('hello world');
    });
    it('Successfully dies parsing a bad config', function () {
      utils.parseEncodedConfig('error');
      (0, _chai.expect)(console.log.args[0][0].name).to.equal('InvalidCharacterError');
    });
    it('Decorates no nav', function _callee11() {
      var headerMeta, footerMeta;
      return regeneratorRuntime.async(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              headerMeta = utils.createTag('meta', {
                name: 'header',
                content: 'off'
              });
              footerMeta = utils.createTag('meta', {
                name: 'footer',
                content: 'off'
              });
              document.head.append(headerMeta, footerMeta);
              _context11.next = 5;
              return regeneratorRuntime.awrap(utils.loadArea());

            case 5:
              (0, _chai.expect)(document.querySelector('header')).to.not.exist;
              (0, _chai.expect)(document.querySelector('footer')).to.not.exist;

            case 7:
            case "end":
              return _context11.stop();
          }
        }
      });
    });
    it('Decorates placeholder', function () {
      var paragraphs = _toConsumableArray(document.querySelectorAll('p'));

      var lastPara = paragraphs.pop();
      (0, _chai.expect)(lastPara.textContent).to.equal('nothing to see here');
    });
    it('Decorates meta helix url', function () {
      var meta = document.head.querySelector('[name="hlx-url"]');
      (0, _chai.expect)(meta.content).to.equal('http://localhost:2000/otis');
    });
    it('getLocale default return', function () {
      (0, _chai.expect)(utils.getLocale().ietf).to.equal('en-US');
    });
    it('getLocale for different paths', function () {
      var locales = {
        '': {
          ietf: 'en-US',
          tk: 'hah7vzn.css'
        },
        langstore: {
          ietf: 'en-US',
          tk: 'hah7vzn.css'
        },
        be_fr: {
          ietf: 'fr-BE',
          tk: 'vrk5vyv.css'
        }
      };

      function validateLocale(path, expectedOutput) {
        var locale = utils.getLocale(locales, path);
        (0, _chai.expect)(locale.prefix).to.equal(expectedOutput.prefix);
        (0, _chai.expect)(locale.ietf).to.equal(expectedOutput.ietf);
        (0, _chai.expect)(locale.tk).to.equal(expectedOutput.tk);
      }

      validateLocale('/', {
        prefix: '',
        ietf: 'en-US',
        tk: 'hah7vzn.css'
      });
      validateLocale('/page', {
        prefix: '',
        ietf: 'en-US',
        tk: 'hah7vzn.css'
      });
      validateLocale('/be_fr', {
        prefix: '/be_fr',
        ietf: 'fr-BE',
        tk: 'vrk5vyv.css'
      });
      validateLocale('/be_fr/page', {
        prefix: '/be_fr',
        ietf: 'fr-BE',
        tk: 'vrk5vyv.css'
      });
      validateLocale('/langstore/lv', {
        prefix: '/langstore/lv',
        ietf: 'en-US',
        tk: 'hah7vzn.css'
      });
      validateLocale('/langstore/lv/page', {
        prefix: '/langstore/lv',
        ietf: 'en-US',
        tk: 'hah7vzn.css'
      });
    });
    it('Open link in new tab', function () {
      var newTabLink = document.querySelector('.new-tab');
      newTabLink.target = '_blank';
      (0, _chai.expect)(newTabLink.target).to.contain('_blank');
      newTabLink.href = newTabLink.href.replace('#_blank', '');
      (0, _chai.expect)(newTabLink.href).to.equal('https://www.adobe.com/test');
    });
    describe('SVGs', function () {
      it('Not a valid URL', function () {
        var a = document.querySelector('.bad-url');

        try {
          var textContentUrl = new URL(a.textContent);
        } catch (err) {
          (0, _chai.expect)(err.message).to.equal("Failed to construct 'URL': Invalid URL");
        }
      });
    });
    describe('rtlSupport', function () {
      before(function _callee12() {
        return regeneratorRuntime.async(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                config.locales = {
                  '': {
                    ietf: 'en-US',
                    tk: 'hah7vzn.css'
                  },
                  africa: {
                    ietf: 'en',
                    tk: 'pps7abe.css'
                  },
                  il_he: {
                    ietf: 'he',
                    tk: 'nwq1mna.css'
                  },
                  mena_ar: {
                    ietf: 'ar',
                    tk: 'dis2dpj.css'
                  },
                  ua: {
                    tk: 'aaz7dvd.css'
                  }
                };

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        });
      });

      function setConfigWithPath(path) {
        document.documentElement.removeAttribute('dir');
        config.pathname = path;
        utils.setConfig(config);
      }

      it('LTR Languages have dir as ltr', function () {
        setConfigWithPath('/africa/solutions');
        (0, _chai.expect)(document.documentElement.getAttribute('dir')).to.equal('ltr');
      });
      it('RTL Languages have dir as rtl', function () {
        setConfigWithPath('/il_he/solutions');
        (0, _chai.expect)(document.documentElement.getAttribute('dir')).to.equal('rtl');
        setConfigWithPath('/mena_ar/solutions');
        (0, _chai.expect)(document.documentElement.getAttribute('dir')).to.equal('rtl');
      });
      it('Gracefully dies when locale ietf is missing and dir is not set.', function () {
        setConfigWithPath('/ua/solutions');
        (0, _chai.expect)(document.documentElement.getAttribute('dir'))["null"];
      });
    });
    describe('localizeLink', function () {
      before(function _callee13() {
        return regeneratorRuntime.async(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                config.locales = {
                  '': {
                    ietf: 'en-US',
                    tk: 'hah7vzn.css'
                  },
                  fi: {
                    ietf: 'fi-FI',
                    tk: 'aaz7dvd.css'
                  },
                  be_fr: {
                    ietf: 'fr-BE',
                    tk: 'vrk5vyv.css'
                  },
                  langstore: {
                    ietf: 'en-US',
                    tk: 'hah7vzn.css'
                  }
                };
                config.prodDomains = ['milo.adobe.com', 'www.adobe.com'];
                config.pathname = '/be_fr/page';
                config.origin = 'https://main--milo--adobecom';
                utils.setConfig(config);

              case 5:
              case "end":
                return _context13.stop();
            }
          }
        });
      });

      function setConfigPath(path) {
        config.pathname = path;
        utils.setConfig(config);
      }

      it('Same domain link is relative and localized', function () {
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions');
      });
      it('Same domain fragment link is relative and localized', function () {
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/fragments/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/fragments/gnav/solutions');
      });
      it('Same domain langstore link is relative and localized', function () {
        setConfigPath('/langstore/fr/page');
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/langstore/fr/gnav/solutions');
        setConfigPath('/be_fr/page');
      });
      it('Same domain extensions /, .html, .json are handled', function () {
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions.html', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions.html');
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions.json', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions.json');
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions/', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions/');
      });
      it('Same domain link that is already localized is returned as relative', function () {
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/be_fr/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/be_fr/gnav/solutions');
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/fi/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/fi/gnav/solutions');
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/fi', 'main--milo--adobecom.hlx.page')).to.equal('/fi');
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/langstore/fr/gnav/solutions', 'main--milo--adobecom.hlx.page')).to.equal('/langstore/fr/gnav/solutions');
      });
      it('Same domain PDF link is returned as relative and not localized', function () {
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions.pdf', 'main--milo--adobecom.hlx.page')).to.equal('/gnav/solutions.pdf');
      });
      it('Same domain link with #_dnt is returned as relative, #_dnt is removed and not localized', function () {
        (0, _chai.expect)(utils.localizeLink('https://main--milo--adobecom.hlx.page/gnav/solutions#_dnt', 'main--milo--adobecom.hlx.page')).to.equal('/gnav/solutions');
      });
      it('Live domain html link  is absolute and localized', function () {
        (0, _chai.expect)(utils.localizeLink('https://milo.adobe.com/solutions/customer-experience-personalization-at-scale.html', 'main--milo--adobecom.hlx.page')).to.equal('https://milo.adobe.com/be_fr/solutions/customer-experience-personalization-at-scale.html');
        (0, _chai.expect)(utils.localizeLink('https://www.adobe.com/solutions/customer-experience-personalization-at-scale.html', 'main--milo--adobecom.hlx.page')).to.equal('https://www.adobe.com/be_fr/solutions/customer-experience-personalization-at-scale.html');
      });
      it('Live domain html link with #_dnt is left absolute, not localized and #_dnt is removed', function () {
        (0, _chai.expect)(utils.localizeLink('https://milo.adobe.com/solutions/customer-experience-personalization-at-scale.html#_dnt', 'main--milo--adobecom.hlx.page')).to.equal('https://milo.adobe.com/solutions/customer-experience-personalization-at-scale.html');
      });
      it('Invalid href fails gracefully', function () {
        (0, _chai.expect)(utils.localizeLink('not-a-url', 'main--milo--adobecom.hlx.page')).to.equal('not-a-url');
      });
    });
    it('creates an IntersectionObserver', function (done) {
      var block = document.createElement('div');
      block.id = 'myblock';
      block.innerHTML = '<div>hello</div>';
      document.body.appendChild(block);
      var io = utils.createIntersectionObserver({
        el: block,
        options: {
          rootMargin: '10000px'
        },
        callback: function callback(target) {
          (0, _chai.expect)(target).to.equal(block);
          done();
        }
      });
      (0, _chai.expect)(io instanceof IntersectionObserver).to.be["true"];
    });
  });
  it('adds privacy trigger to cookie preferences link in footer', function () {
    window.adobePrivacy = {
      showPreferenceCenter: _sinon["default"].spy()
    };
    document.body.innerHTML = '<footer><a href="https://www.adobe.com/#openPrivacy" id="privacy-link">Cookie preferences</a></footer>';
    utils.loadPrivacy();
    var privacyLink = document.querySelector('#privacy-link');
    privacyLink.click();
    (0, _chai.expect)(adobePrivacy.showPreferenceCenter.called).to.be["true"];
  });
});