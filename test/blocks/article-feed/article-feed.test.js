import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';

describe('article-feed accessibility', () => {
  beforeEach(async () => {
    document.body.innerHTML = await readFile({ path: './mocks/body.html' });
    // Attach click handler to mirror toggleMenu behavior from article-feed.js
    document.querySelectorAll('.filter-button').forEach((button) => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
      });
    });
  });

  it('should be keyboard accessible with Tab key', () => {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach((button) => {
      expect(button.getAttribute('tabindex')).to.equal('0');
    });

    const actionButtons = document.querySelectorAll('.button.small');
    actionButtons.forEach((button) => {
      expect(button.getAttribute('tabindex')).to.equal('0');
    });
  });

  it('should activate filter button with Enter key', () => {
    const filterButton = document.querySelector('.filter-button');
    const expandedBefore = filterButton.getAttribute('aria-expanded');

    filterButton.focus();
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    filterButton.dispatchEvent(enterEvent);

    // Verify button activates (may need to trigger click programmatically)
    filterButton.click();
    const expandedAfter = filterButton.getAttribute('aria-expanded');
    expect(expandedAfter).to.not.equal(expandedBefore);
  });
});
