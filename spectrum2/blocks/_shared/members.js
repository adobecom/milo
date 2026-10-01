import { tagFor } from './dom.js';

const ORIGINS = ['c1', 'c2', 'bacom'];
export const ORIGIN_PATHS = Object.freeze({ __proto__: null, c1: '/libs', c2: '/libs/c2', bacom: '' });
const OVERRIDES = ['c1', 'c2', 'none'];
const COMPAT = ['canonical', 'yes', 'adapter'];

function readOnlySet(values) {
  const set = new Set(values);
  const deny = () => {
    throw new TypeError('spectrum2: VIEWPORT_PREPASS_MEMBERS is read-only');
  };
  Object.defineProperties(set, {
    add: { value: deny },
    delete: { value: deny },
    clear: { value: deny },
  });
  return Object.freeze(set);
}

export const VIEWPORT_PREPASS_MEMBERS = readOnlySet([
  'base-card',
  'explore-card',
  'hover-list',
  'offer-hero',
  'plans-hero',
  'quick-actions',
  'product-marquee-grid',
  'rich-content',
  'social-proof',
  'side-by-side',
  'split-aside-grid',
]);

const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

function describeBlock(members, block) {
  if (block) return block;
  const names = members && typeof members === 'object' ? Object.keys(members) : [];
  return names.length ? names.join('/') : 'block';
}

export function validateMembers(members, block) {
  const label = describeBlock(members, block);
  if (!members || typeof members !== 'object') {
    throw new TypeError(`spectrum2: ${label} member table must be an object`);
  }
  Object.entries(members).forEach(([name, member]) => {
    const where = `spectrum2: ${label} member "${name}"`;
    if (!member || typeof member !== 'object') throw new TypeError(`${where} must be an object`);
    if (!ORIGINS.includes(member.origin)) throw new Error(`${where} has origin ${JSON.stringify(member.origin)} (want c1|c2|bacom)`);
    if (!OVERRIDES.includes(member.overrides)) {
      throw new Error(`${where} has overrides ${JSON.stringify(member.overrides)} (want c1|c2|none)`);
    }
    if (!COMPAT.includes(member.compat)) {
      throw new Error(`${where} has compat ${JSON.stringify(member.compat)} (want canonical|yes|adapter)`);
    }
    if (typeof member.viewportPrePass !== 'boolean') throw new Error(`${where} viewportPrePass must be a boolean`);
    const expected = VIEWPORT_PREPASS_MEMBERS.has(name);
    if (member.viewportPrePass !== expected) {
      throw new Error(`${where} says viewportPrePass: ${member.viewportPrePass} but milo prod ${expected
        ? 'runs' : 'does not run'} decorateViewportContent for it (VIEWPORT_PREPASS_MEMBERS)`);
    }
    if (typeof member.decorate !== 'function') throw new TypeError(`${where} has no decorate(el, ctx) function`);
  });
  return members;
}

export function dispatch(el, members, { block } = {}) {
  validateMembers(members, block);
  const [name] = el.classList;
  if (!name || !own(members, name)) {
    throw new Error(`spectrum2: ${describeBlock(members, block)} has no member "${name ?? ''}"`);
  }
  const member = members[name];
  el.dataset.spectrum2Member = name;
  el.dataset.spectrum2Origin = member.origin;
  el.classList.add('spectrum2');
  const ctx = {
    member: name,
    origin: member.origin,
    overrides: member.overrides,
    compat: member.compat,
    viewportPrePass: member.viewportPrePass,
    make: tagFor(el),
  };
  return member.decorate(el, ctx);
}
