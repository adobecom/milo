/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
class Node {
  constructor(key, value = key, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.children = [];
  }

  get isLeaf() {
    return this.children.length === 0;
  }
}

export default class Tree {
  constructor(key, value = key) {
    this.root = new Node(key, value);
  }

  * traverse(node = this.root) {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.traverse(child);
      }
    }
  }

  insert(parentNodeKey, key, value = key) {
    for (let node of this.traverse()) {
      if (node.key === parentNodeKey) {
        node.children.push(new Node(key, value, node));
        return true;
      }
    }
    return false;
  }

  remove(key) {
    for (let node of this.traverse()) {
      const filtered = node.children.filter((c) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key) {
    for (let node of this.traverse()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
}
