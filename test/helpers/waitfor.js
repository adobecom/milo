export const waitForElement = (
  selector,
  {
    options = {
      childList: true,
      subtree: true,
    },
    rootEl = document.body,
    textContent = '',
  } = {},
) => new Promise((resolve) => {
  const el = document.querySelector(selector);

  if (el) {
    resolve(el);
    return;
  }

  const observer = new MutationObserver((mutations, obsv) => {
    mutations.forEach((mutation) => {
      const nodes = [...mutation.addedNodes];
      nodes.some((node) => {
        if (node.matches && node.matches(selector)) {
          if (textContent && node.textContent !== textContent) return false;

          obsv.disconnect();
          resolve(node);
          return true;
        }

        // check for child in added node
        const treeWalker = document.createTreeWalker(node);
        let { currentNode } = treeWalker;
        while (currentNode) {
          if (currentNode.matches && currentNode.matches(selector)) {
            obsv.disconnect();
            resolve(currentNode);
            return true;
          }
          currentNode = treeWalker.nextNode();
        }
        return false;
      });
    });
  });

  observer.observe(rootEl, options);
});

export const waitForUpdate = (
  el,
  options = {
    childList: true,
    subtree: true,
  },
) => new Promise((resolve) => {
  const observer = new MutationObserver((mutations, obsv) => {
    obsv.disconnect();
    resolve();
  });
  observer.observe(el, options);
});

export const waitForRemoval = (
  selector,
  options = {
    childList: true,
    subtree: false,
  },
) => new Promise((resolve) => {
  const el = document.querySelector(selector);

  if (!el) {
    resolve();
    return;
  }

  const observer = new MutationObserver((mutations, obsv) => {
    mutations.forEach((mutation) => {
      const nodes = [...mutation.removedNodes];
      nodes.some((node) => {
        if (node.matches(selector)) {
          obsv.disconnect();
          resolve();
          return true;
        }
        return false;
      });
    });
  });

  observer.observe(el.parentElement, options);
});

/**
 * Promise based setTimeout that can be await'd
 * @param {int} timeOut time out in milliseconds
 * @param {*} cb Callback function to call when time elapses
 * @returns
 */
export const delay = (timeOut, cb) => new Promise((resolve) => {
  setTimeout(() => {
    resolve((cb && cb()) || null);
  }, timeOut);
});
