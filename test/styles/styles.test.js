import { expect } from '@esm-bundle/chai';
import { setViewport } from '@web/test-runner-commands';

describe('C2 gnav on a C1 page: header height reservation', () => {
  let header;
  let localnavMeta;
  const height = () => header.getBoundingClientRect().height;
  // Mirrors decorateHeader: authored breadcrumbs are moved into the header.
  const decorate = ({ breadcrumbs = false, hasBreadcrumbsClass = breadcrumbs } = {}) => {
    header.className = 'global-navigation c2-gnav-c1-host';
    if (hasBreadcrumbsClass) header.classList.add('has-breadcrumbs');
    header.innerHTML = breadcrumbs ? '<div class="breadcrumbs"></div>' : '';
  };
  // Mirrors the markup federal renders into the header.
  const renderNav = ({ breadcrumbs = false } = {}) => {
    header.innerHTML = `<nav class="localnav"><ul><li class="feds-menu-wrapper">
      <button class="feds-localnav-bar"></button></li></ul>
      ${breadcrumbs ? '<ul class="feds-breadcrumbs"></ul>' : ''}</nav>`;
  };

  before(async () => {
    await new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/libs/styles/styles.css';
      link.onload = resolve;
      document.head.append(link);
    });
  });

  beforeEach(() => {
    localnavMeta = document.createElement('meta');
    localnavMeta.name = 'localnav';
    localnavMeta.content = 'true';
    document.head.append(localnavMeta);
    document.body.innerHTML = '<header></header>';
    header = document.querySelector('header');
  });

  afterEach(() => localnavMeta.remove());

  describe('below 1024px', () => {
    before(() => setViewport({ width: 600, height: 800 }));

    it('reserves the local-nav bar row from metadata before the bar renders', () => {
      decorate({ breadcrumbs: true });
      expect(height()).to.equal(126);
      renderNav({ breadcrumbs: true });
      expect(height()).to.equal(126);
    });

    it('does not reserve the row without localnav metadata', () => {
      localnavMeta.remove();
      decorate();
      expect(height()).to.equal(80);
    });

    it('does not change C1 headers', () => {
      decorate();
      header.classList.remove('c2-gnav-c1-host');
      expect(height()).to.equal(64);
    });
  });

  describe('from 1024px', () => {
    before(() => setViewport({ width: 1100, height: 800 }));

    it('reserves the breadcrumbs row whether or not the nav turns compact', () => {
      decorate({ breadcrumbs: true });
      expect(height()).to.equal(126);
      renderNav({ breadcrumbs: true });
      expect(height()).to.equal(126);
      header.classList.add('is-compact');
      expect(height()).to.equal(126);
    });

    it('reserves authored breadcrumbs when has-breadcrumbs is suppressed (dynamic nav)', () => {
      decorate({ breadcrumbs: true, hasBreadcrumbsClass: false });
      expect(height()).to.equal(126);
    });

    it('does not reserve the row when there are no breadcrumbs to render', () => {
      decorate();
      expect(height()).to.equal(80);
      decorate({ hasBreadcrumbsClass: true });
      expect(height()).to.equal(80);
    });

    it('does not reserve the row without localnav metadata', () => {
      localnavMeta.remove();
      decorate({ breadcrumbs: true });
      expect(height()).to.equal(80);
    });
  });

  describe('from 1204px', () => {
    before(() => setViewport({ width: 1280, height: 800 }));

    it('does not double-reserve the breadcrumbs row', () => {
      decorate({ breadcrumbs: true });
      expect(height()).to.equal(126);
      renderNav({ breadcrumbs: true });
      expect(height()).to.equal(126);
      header.classList.add('is-compact');
      expect(height()).to.equal(126);
    });
  });
});
