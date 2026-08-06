import { expect } from '@esm-bundle/chai';
import { getXPath } from '../../../../libs/blocks/preflight/checks/diff/nodePath.js';
import { stampKeys, renderPane } from '../../../../libs/blocks/preflight/panels/diff-render.js';

function parseMain(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.querySelector('main') || doc.body;
}

describe('preflight diff-render', () => {
  describe('stampKeys', () => {
    it('sets data-diff-key to getXPath for each content-selector node', () => {
      const main = parseMain('<main><div><p>hi</p><h2>Title</h2></div></main>');
      stampKeys(main);
      const p = main.querySelector('p');
      const h2 = main.querySelector('h2');
      expect(p.dataset.diffKey).to.equal(getXPath(p, main));
      expect(h2.dataset.diffKey).to.equal(getXPath(h2, main));
    });

    it('does not stamp elements outside the content selector', () => {
      const main = parseMain('<main><div><span>skip</span><p>stamp</p></div></main>');
      stampKeys(main);
      expect(main.querySelector('span').dataset.diffKey).to.be.undefined;
      expect(main.querySelector('p').dataset.diffKey).to.exist;
    });
  });

  describe('renderPane', () => {
    it('stamps keys before decorate, and the key survives DOM reshaping (Approach B)', async () => {
      const html = '<main><div><p>hi</p></div></main>';
      const refMain = parseMain(html);
      const expectedKey = getXPath(refMain.querySelector('p'), refMain);

      // Simulates decoration reshaping the tree (e.g. wrapping a link in a button).
      const fakeDecorate = async (container) => {
        const p = container.querySelector('p');
        const wrapper = document.createElement('div');
        wrapper.className = 'decorated-wrapper';
        p.replaceWith(wrapper);
        wrapper.append(p);
      };

      const pane = await renderPane(html, { decorate: fakeDecorate });
      const stamped = pane.querySelector('[data-diff-key]');

      expect(stamped).to.exist;
      expect(stamped.tagName).to.equal('P');
      expect(stamped.dataset.diffKey).to.equal(expectedKey);
      // Prove the fake decorate actually reshaped the DOM around the stamped node.
      expect(stamped.parentElement.classList.contains('decorated-wrapper')).to.equal(true);
    });

    it('passes the same container to decorate that it returns', async () => {
      let received;
      const decorate = async (container) => { received = container; };
      const pane = await renderPane('<main><div><p>hi</p></div></main>', { decorate });
      expect(pane).to.equal(received);
      expect(pane.tagName).to.equal('DIV');
    });

    it('is not a <main> landmark, to avoid duplicate landmarks when two panes are inserted', async () => {
      const pane = await renderPane('<main><div><p>hi</p></div></main>', { decorate: async () => {} });
      expect(pane.tagName).to.not.equal('MAIN');
      expect(pane.querySelector('main')).to.not.exist;
    });

    it('strips ids assigned during decoration so panes never carry duplicate ids', async () => {
      const decorate = async (container) => {
        container.id = 'root-id';
        container.querySelector('p').id = 'decorated-id';
      };
      const pane = await renderPane('<main><div><p>hi</p></div></main>', { decorate });
      expect(pane.hasAttribute('id')).to.equal(false);
      expect(pane.querySelector('[id]')).to.not.exist;
    });
  });
});
