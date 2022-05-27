// From https://github.com/preactjs/preact/blob/master/compat/src/portals.js
/* c8 ignore start */
import { h, render } from './htm-preact.js';
function ContextProvider(e) {
  return (this.getChildContext = () => e.context), e.children;
}
function Portal(e) {
  const n = this;
  let t = e._container;
  (n.componentWillUnmount = function () {
    render(null, n._temp), (n._temp = null), (n._container = null);
  }),
    n._container && n._container !== t && n.componentWillUnmount(),
    e._vnode
      ? (n._temp ||
          ((n._container = t),
          (n._temp = {
            nodeType: 1,
            parentNode: t,
            childNodes: [],
            appendChild(e) {
              this.childNodes.push(e), n._container.appendChild(e);
            },
            insertBefore(e, t) {
              this.childNodes.push(e), n._container.appendChild(e);
            },
            removeChild(e) {
              this.childNodes.splice(this.childNodes.indexOf(e) >>> 1, 1),
                n._container.removeChild(e);
            },
          })),
        render(h(ContextProvider, { context: n.context }, e._vnode), n._temp))
      : n._temp && n.componentWillUnmount();
}
export default function createPortal(e, n) {
  const t = h(Portal, { _vnode: e, _container: n });
  return (t.containerInfo = n), t;
}
