import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

import init from '../../../libs/c2/blocks/quick-actions/quick-actions.js';

const N_UP = ['two-up', 'three-up', 'six-up'];

describe('Quick Actions', () => {
  describe('with a section header and linked tiles', () => {
    let block;

    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      block = document.querySelector('.quick-actions');
      init(block);
    });

    it('promotes the first row into a decorated header and removes the source row', () => {
      const header = block.querySelector(':scope > .quick-actions-header');
      expect(header).to.exist;
      const heading = header.querySelector('h2');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Quick actions');
      // heading decorated at level 4
      expect(heading.classList.contains('heading-4')).to.be.true;
      // header is no longer wrapped in the original row cell
      expect(block.querySelector('.quick-actions-header p').textContent)
        .to.equal('Get things done fast with Adobe Express.');
    });

    it('builds a grid with one tile per tile row', () => {
      const grid = block.querySelector(':scope > .quick-actions-grid');
      expect(grid).to.exist;
      expect(grid.classList.contains('parallax-stagger-ltr')).to.be.true;
      const tiles = grid.querySelectorAll(':scope > a.quick-actions-tile');
      expect(tiles.length).to.equal(3);
      // after decoration the block only holds the header and the grid
      expect(block.children.length).to.equal(2);
    });

    it('applies exactly one responsive n-up class to the grid', () => {
      const grid = block.querySelector('.quick-actions-grid');
      const applied = N_UP.filter((cls) => grid.classList.contains(cls));
      expect(applied.length).to.equal(1);
    });

    it('uses the label link href as the tile href', () => {
      const firstTile = block.querySelector('.quick-actions-tile');
      expect(firstTile.tagName).to.equal('A');
      expect(firstTile.getAttribute('href'))
        .to.equal('https://www.adobe.com/express/feature/pdf/convert');
    });

    it('moves each tile picture into the tile with a media class', () => {
      const tiles = block.querySelectorAll('.quick-actions-tile');
      tiles.forEach((tile) => {
        const media = tile.querySelector('picture.quick-actions-media');
        expect(media).to.exist;
        expect(media.querySelector('img')).to.exist;
      });
    });

    it('renders a tile footer with a trimmed label and a chevron', () => {
      const firstTile = block.querySelector('.quick-actions-tile');
      const footer = firstTile.querySelector('.quick-actions-tile-footer');
      expect(footer).to.exist;
      const label = footer.querySelector('.quick-actions-tile-label');
      expect(label.classList.contains('heading-6')).to.be.true;
      expect(label.textContent).to.equal('Convert to PDF');
      const chevron = footer.querySelector('.quick-actions-chevron');
      expect(chevron.getAttribute('aria-hidden')).to.equal('true');
      expect(chevron.querySelector('svg')).to.exist;
    });
  });

  describe('without a section header', () => {
    let block;

    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/no-header.html' });
      block = document.querySelector('.quick-actions');
      init(block);
    });

    it('does not create a header when the first cell has no heading', () => {
      expect(block.querySelector('.quick-actions-header')).to.be.null;
    });

    it('treats every row as a tile', () => {
      const grid = block.querySelector(':scope > .quick-actions-grid');
      expect(grid).to.exist;
      const tiles = grid.querySelectorAll('.quick-actions-tile');
      expect(tiles.length).to.equal(2);
      // grid is the block's only child since there is no header
      expect(block.children.length).to.equal(1);
      expect(tiles[0].getAttribute('href'))
        .to.equal('https://www.adobe.com/express/feature/image/resize');
    });
  });

  describe('fallback tile branches', () => {
    let block;

    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/fallback.html' });
      block = document.querySelector('.quick-actions');
      init(block);
    });

    it('ignores rows that do not have at least two cells', () => {
      const tiles = block.querySelectorAll('.quick-actions-tile');
      // the trailing single-cell row is not turned into a tile
      expect(tiles.length).to.equal(2);
    });

    it('adds the media class to a bare img when no picture is present', () => {
      const firstTile = block.querySelector('.quick-actions-tile');
      const media = firstTile.querySelector('img.quick-actions-media');
      expect(media).to.exist;
      expect(firstTile.querySelector('picture')).to.be.null;
    });

    it('renders no href and no footer for a tile without a label link', () => {
      const tiles = block.querySelectorAll('.quick-actions-tile');
      const noLinkTile = tiles[1];
      expect(noLinkTile.hasAttribute('href')).to.be.false;
      expect(noLinkTile.querySelector('.quick-actions-tile-footer')).to.be.null;
      // media is still moved into the tile
      expect(noLinkTile.querySelector('picture.quick-actions-media')).to.exist;
    });
  });

  describe('empty block', () => {
    it('renders an empty grid and does not throw when there are no rows', async () => {
      document.body.innerHTML = await readFile({ path: './mocks/empty.html' });
      const block = document.querySelector('.quick-actions');
      expect(() => init(block)).to.not.throw();

      const grid = block.querySelector(':scope > .quick-actions-grid');
      expect(grid).to.exist;
      expect(grid.querySelectorAll('.quick-actions-tile').length).to.equal(0);
      expect(block.querySelector('.quick-actions-header')).to.be.null;
    });
  });
});
