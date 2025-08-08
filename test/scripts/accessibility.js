import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import { setListRoles } from '../../libs/scripts/accessibility.js';

document.body.innerHTML = await readFile({ path: './mocks/accessibility.html' });

describe('Accessibility', async () => {
  before(() => {
    setListRoles();
  });

  it('Adds list roles to section up without header', async () => {
    const sections = document.querySelectorAll('.section[class*="-up"]:not(.has-header, .no-action-icon)');
    sections.forEach((section) => {
      expect(section.getAttribute('role')).to.be.equal('list');
      [...section.children].forEach((child) => {
        if (child.classList.contains('section-metadata')) return;
        expect(child.getAttribute('role')).to.be.equal('listitem');
      });
    });
  });

  it('Doesn\'t add list roles to section up with header', async () => {
    const sections = document.querySelectorAll('.section[class*="-up"].has-header');
    sections.forEach((section) => {
      expect(section.getAttribute('role')).to.be.null;
      [...section.children].forEach((child) => {
        if (child.classList.contains('section-metadata')) return;
        expect(child.getAttribute('role')).to.be.null;
      });
    });
  });

  it('Adds list roles to action-item in scroller', async () => {
    const scroller = document.querySelector('.scroller');
    expect(scroller.getAttribute('role')).to.be.equal('list');
    [...scroller.children].forEach((child) => {
      if (child.classList.contains('section-metadata')) return;
      expect(child.getAttribute('role')).to.be.equal('listitem');
    });
  });

  it('Doesn\'t add list roles to section up without action-scroller or icon-block', async () => {
    const section = document.querySelector('#not-list');
    expect(section.getAttribute('role')).to.be.null;
    [...section.children].forEach((child) => {
      if (child.classList.contains('section-metadata')) return;
      expect(child.getAttribute('role')).to.be.null;
    });
  });
});
