import { buildCssRule } from './controls.js';

export default class StyleManager {
  constructor() {
    this.el = document.createElement('style');
    this.el.id = 'page-animator-styles';
    document.head.appendChild(this.el);
    this.rules = new Map();
    this.renderStyles();
  }

  renderStyles() {
    this.el.textContent = [...this.rules.values()].join('\n');
  }

  updateRule(animId, state) {
    this.rules.set(animId, buildCssRule(animId, state));
    this.renderStyles();
  }

  removeRule(animId) {
    this.rules.delete(animId);
    this.renderStyles();
  }

  updateStaggerRule(sectionId, css) {
    if (css) {
      this.rules.set(`stagger:${sectionId}`, css);
    } else {
      this.rules.delete(`stagger:${sectionId}`);
    }
    this.renderStyles();
  }

  removeStaggerRule(sectionId) {
    this.rules.delete(`stagger:${sectionId}`);
    this.renderStyles();
  }
}
