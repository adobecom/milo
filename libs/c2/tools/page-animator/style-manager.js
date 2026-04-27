import { buildCssRule } from './controls.js';

export default class StyleManager {
  constructor() {
    this.el = document.createElement('style');
    this.el.id = 'page-animator-styles';
    document.head.appendChild(this.el);
    this.rules = new Map();
    this._flush();
  }

  _flush() {
    this.el.textContent = [...this.rules.values()].join('\n');
  }

  updateRule(animId, state) {
    this.rules.set(animId, buildCssRule(animId, state));
    this._flush();
  }

  removeRule(animId) {
    this.rules.delete(animId);
    this._flush();
  }
}
