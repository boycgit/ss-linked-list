import { SinglyNode } from './node';
import { invariant } from './util';
import List, { CircleList } from './list';

export class SinglyList<T> extends List<T, SinglyNode<T>> {
  constructor(...values: T[]) {
    super(...values);
  }

  // Adds the element at the end of the linked list
  append(val: T): boolean {
    let node = new SinglyNode<T>(val);

    if (!this._tail) {
      this._head = this._tail = node;
    } else {
      this._tail.next = node;
      this._tail = node;
    }

    this._length++;
    return true;
  }
  // Add the element at the beginning of the linked list
  prepend(val: T): boolean {
    let node = new SinglyNode<T>(val);
    if (!this._head) {
      this._head = this._tail = node;
    } else {
      node.next = this._head;
      this._head = node;
    }
    this._length++;
    return true;
  }

  // remove by value
  remove(val: T): T | void {
    let currentNode = this._head;

    if (!currentNode) {
      return;
    }

    if (currentNode.value === val) {
      // 这里需要注意，有两种情况：
      if (currentNode.next) {
        // 链表多于 1 个元素
        this._head = currentNode.next;
        currentNode.next = null;
      } else {
        // 链表只有 1 个元素
        this._head = this._tail = null;
      }
      this._length--;
      return val;
    } else {
      let prevNode = currentNode;
      while (true) {
        if (currentNode.value === val) {
          if (currentNode.next) {
            prevNode.next = currentNode.next;
          } else {
            // special case for last element
            this._tail = prevNode;
            this._tail.next = null;
          }
          currentNode.next = null;
          this._length--;
          return val;
        } else {
          if (currentNode.next) {
            prevNode = currentNode;
            currentNode = currentNode.next;
          } else {
            return;
          }
        }
      }
    }
  }

  removeHead(): T | void {
    let currentNode = this._head;

    // empty list
    if (!currentNode) {
      return;
    }

    // single item list
    if (!(this._head as SinglyNode<T>).next) {
      this._head = null;
      this._tail = null;
      // full list
    } else {
      this._head = currentNode.next;
      currentNode.next = null;
    }
    this._length--;
    return currentNode.value;
  }

  removeTail(): T | void {
    const tailNode = this._tail;

    // empty list
    if (!tailNode) {
      return;
    }

    // single item list
    if (!(this._head as SinglyNode<T>).next) {
      this._head = null;
      this._tail = null;
      // full list
    } else {
      // start traversal from head
      let currentNode = this._head as SinglyNode<T>;
      while (currentNode.next !== tailNode) {
        currentNode = currentNode.next as SinglyNode<T>;
      }
      currentNode.next = null;
      this._tail = currentNode;
    }

    this._length--;
    return tailNode.value;
  }

  reverse(): void {
    if (!this._head) {
      return;
    }
    let currentNode: SinglyNode<T> | null = this._head;
    let prevNode: SinglyNode<T> | null = null;
    let nextNode: SinglyNode<T> | null;
    this._tail = this._head;
    while (currentNode !== null) {
      nextNode = currentNode.next;
      currentNode.next = prevNode;
      prevNode = currentNode;
      currentNode = nextNode;
    }
    this._head = prevNode;
  }

  clone(): SinglyList<T> {
    const arrValue = this.toArray();
    return new SinglyList<T>(...arrValue);
  }
}

// 循环链表中的大部分方法，都可以转换成单向链表
// 每次操作之前将列表断开，执行完后再结合

export class CircleSinglyList<T> extends SinglyList<T> {
  breakCircle() {
    if (this._tail && this._tail.next === this._head) {
      this._tail.next = null;
    }
  }

  cyclization() {
    if (this._tail && this._tail.next === null) {
      this._tail.next = this._head;
    }
  }

  constructor(...values: T[]) {
    super(...values);
    this.cyclization();
  }

  *iterator(): IterableIterator<T> {
    let currentNode = this._head;

    while (currentNode) {
      yield currentNode.value;
      currentNode = currentNode.next;

      // 如果下一个节点是 head，说明回到循环列表的头部了
      if (currentNode === this._head) {
        currentNode = null;
      }
    }
  }

  *circleIterator(): IterableIterator<T> {
    let currentNode = this._head;

    while (currentNode) {
      yield currentNode.value;
      currentNode = currentNode.next;
    }
  }

  [Symbol.iterator]() {
    return this.iterator();
  }

  mapToNormalListFn(name, ...params) {
    this.breakCircle();
    var result = super[name].apply(this, params);
    this.cyclization();
    return result;
  }

  getNode(position: number): SinglyNode<T> | null {
    return this.mapToNormalListFn('getNode', position);
  }

  append(val: T): boolean {
    return this.mapToNormalListFn('append', val);
  }

  prepend(val: T): boolean {
    return this.mapToNormalListFn('prepend', val);
  }

  indexOf(val: T): Number {
    return this.mapToNormalListFn('indexOf', val);
  }

  remove(val: T): T | void {
    return this.mapToNormalListFn('remove', val);
  }

  removeHead(): T | void {
    return this.mapToNormalListFn('removeHead');
  }

  removeTail(): T | void {
    return this.mapToNormalListFn('removeTail');
  }

  first(num: number): T[] {
    invariant(
      num >= 0,
      `[linked-list] param 'num' (${num}) should not less than 0`
    );
    let iter = this.circleIterator();
    let result: T[] = [];

    for (let i = 0; i < num; i++) {
      let val = iter.next();
      result.push(val.value);
    }
    return result;
  }

  toArray(): T[] {
    return this.mapToNormalListFn('toArray');
  }

  reverse(): void {
    return this.mapToNormalListFn('reverse');
  }

  clone(): CircleSinglyList<T> {
    const arrValue = this.toArray();
    return new CircleSinglyList<T>(...arrValue);
  }
}
