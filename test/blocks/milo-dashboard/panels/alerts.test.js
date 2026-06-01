import { expect } from '@esm-bundle/chai';

const { default: renderAlerts } = await import('../../../../libs/blocks/milo-dashboard/panels/alerts.js');

describe('milo-dashboard alerts', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders high before warn with correct messages', () => {
    renderAlerts(container, {
      testPages: [{ path: '/drafts/x.html', site: 'milo', signal: 'path' }],
      projects: [
        { site: 'dc', avg_health: '42.00', publishes: 10 },
        { site: 'milo', avg_health: 88, publishes: 50 },
      ],
    });
    const items = container.querySelectorAll('.alert-item');
    expect(items.length).to.equal(2);
    const firstSev = items[0].querySelector('.alert-sev.high');
    expect(firstSev).to.exist;
    const firstMsg = items[0].querySelector('.alert-msg').textContent;
    expect(firstMsg.includes('dc')).to.equal(true);
    expect(firstMsg.includes('42.0')).to.equal(true);
    const warnMsg = items[1].querySelector('.alert-msg').textContent;
    expect(warnMsg.includes('milo/drafts/x.html')).to.equal(true);
  });

  it('shows all-clear when nothing flagged', () => {
    renderAlerts(container, {
      testPages: [],
      projects: [{ site: 'milo', avg_health: 88, publishes: 50 }],
    });
    const empty = container.querySelector('.alerts-empty');
    expect(empty).to.exist;
    expect(empty.textContent.includes('All clear')).to.equal(true);
    expect(container.querySelector('.alert-item')).to.equal(null);
  });

  it('caps at 8 items and shows +N more', () => {
    const testPages = Array.from({ length: 10 }, (_, i) => ({ path: `/p/${i}.html`, site: 'milo', signal: 'path' }));
    renderAlerts(container, { testPages, projects: [] });
    expect(container.querySelectorAll('.alert-item').length).to.equal(8);
    const more = container.querySelector('.alerts-more');
    expect(more).to.exist;
    expect(more.textContent.includes('+2 more')).to.equal(true);
  });

  it('is undefined-safe', () => {
    expect(() => renderAlerts(container, {})).to.not.throw();
    expect(container.querySelector('.alerts-empty')).to.exist;
    expect(container.querySelector('.alert-item')).to.equal(null);
  });

  it('is re-render safe', () => {
    const data = { testPages: [{ path: '/drafts/x.html', site: 'milo', signal: 'path' }], projects: [] };
    renderAlerts(container, data);
    renderAlerts(container, data);
    expect(container.querySelectorAll('.alert-item').length).to.equal(1);
  });
});
