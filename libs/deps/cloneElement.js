// From https://github.com/preactjs/preact/blob/master/src/clone-element.js
/* c8 ignore start */
let vnodeId = 0;
const options = { _catchError: _catchError };
function _catchError(n, t, e, r) {
  let o, l, c;
  for (; (t = t._parent); )
    if ((o = t._component) && !o._processingException)
      try {
        if (
          ((l = o.constructor) &&
            null != l.getDerivedStateFromError &&
            (o.setState(l.getDerivedStateFromError(n)), (c = o._dirty)),
          null != o.componentDidCatch && (o.componentDidCatch(n, r || {}), (c = o._dirty)),
          c)
        )
          return (o._pendingError = o);
      } catch (t) {
        n = t;
      }
  throw n;
}
function assign(n, t) {
  for (let e in t) n[e] = t[e];
  return n;
}
const slice = [].slice;
function createVNode(n, t, e, r, o) {
  const l = {
    type: n,
    props: t,
    key: e,
    ref: r,
    _children: null,
    _parent: null,
    _depth: 0,
    _dom: null,
    _nextDom: void 0,
    _component: null,
    _hydrating: null,
    constructor: void 0,
    _original: null == o ? ++vnodeId : o,
  };
  return null == o && null != options.vnode && options.vnode(l), l;
}
export default function cloneElement(n, t, e) {
  let r,
    o,
    l,
    c = assign({}, n.props);
  for (l in t) 'key' == l ? (r = t[l]) : 'ref' == l ? (o = t[l]) : (c[l] = t[l]);
  return (
    arguments.length > 2 && (c.children = arguments.length > 3 ? slice.call(arguments, 2) : e),
    createVNode(n.type, c, r || n.key, o || n.ref, null)
  );
}
