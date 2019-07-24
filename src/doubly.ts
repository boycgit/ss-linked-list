import { DoublyNode } from './node';
import { invariant } from './util';
import List, { IFindConition } from './list';

export class DoublyList<T> extends List<T, DoublyNode<T>> {
  constructor(...values: T[]) {
    super(...values);
  }

  // Adds the element at the end of the linked list
  append(val: T): boolean {
    let node = new DoublyNode<T>(val);

    if (!this._tail) {
      this._head = this._tail = node;
    } else {
      this._tail.next = node;
      node.prev = this._tail;
      this._tail = node;
    }

    this._length++;
    return true;
  }
  // Add the element at the beginning of the linked list
  prepend(val: T): boolean {
    let node = new DoublyNode<T>(val);
    if (!this._head) {
      this._head = this._tail = node;
    } else {
      node.next = this._head;
      this._head.prev = node;
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
    // 当首个元素恰好是目标值的时候
    if (this.compare.equal(currentNode.value, val)) {
      // 这里需要注意，有两种情况：
      if (currentNode.next) {
        // 链表多于 1 个元素
        this._head = currentNode.next;
        this._head.prev = null;
        currentNode.next = currentNode.prev = null;
      } else {
        // 链表只有 1 个元素
        this._head = this._tail = null;
      }
      this._length--;
      return val;
    } else {
      while (true) {
        if (this.compare.equal(currentNode.value, val)) {
          if (currentNode.next) {
            // special case for last element
            (currentNode.prev as DoublyNode<T>).next = currentNode.next;
            currentNode.next.prev = currentNode.prev;
            currentNode.next = currentNode.prev = null;
          } else {
            (currentNode.prev as DoublyNode<T>).next = null;
            this._tail = currentNode.prev;
            currentNode.next = currentNode.prev = null;
          }
          this._length--;
          return currentNode.value;
        } else {
          if (currentNode.next) {
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
    if (!(this._head as DoublyNode<T>).next) {
      this._head = null;
      this._tail = null;
      // full list
    } else {
      ((currentNode as DoublyNode<T>).next as DoublyNode<T>).prev = null;
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
    if (!(this._head as DoublyNode<T>).next) {
      this._head = null;
      this._tail = null;
      // full list
    } else {
      ((tailNode as DoublyNode<T>).prev as DoublyNode<T>).next = null;
      this._tail = tailNode.prev;
      tailNode.next = tailNode.prev = null;
    }

    this._length--;
    return tailNode.value;
  }

  reverse(): void {
    if (!this._head) {
      return;
    }
    let currentNode: DoublyNode<T> | null = this._head;
    let prevNode: DoublyNode<T> | null = null;
    let nextNode: DoublyNode<T> | null;
    this._tail = this._head;
    while (currentNode !== null) {
      nextNode = currentNode.next;
      currentNode.next = prevNode;
      currentNode.prev = nextNode;
      prevNode = currentNode;
      currentNode = nextNode;
    }
    this._head = prevNode;
  }

  clone(): DoublyList<T> {
    const arrValue = this.toArray();
    return new DoublyList<T>(...arrValue);
  }
}

export abstract class AbstractCircleDoublyList<T> extends DoublyList<T> {
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

  getNode(position: number): DoublyNode<T> | null {
    return this.mapToNormalListFn('getNode', position);
  }

  append(val: T): boolean {
    return this.mapToNormalListFn('append', val);
  }

  prepend(val: T): boolean {
    return this.mapToNormalListFn('prepend', val);
  }

  find(condition: IFindConition<T>): DoublyNode<T> | null {
    return this.mapToNormalListFn('find', condition);
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
  abstract clone(): AbstractCircleDoublyList<T>;
  abstract breakCircle(): void;
  abstract cyclization(): void;
}

// 循环链表中的大部分方法，都可以转换成双向链表
// 每次操作之前将列表断开，执行完后再结合

export class CircleDoublyList<T> extends AbstractCircleDoublyList<T> {
  breakCircle() {
    if (this._tail && this._head && this._tail.next === this._head) {
      this._tail.next = null;
      this._head.prev = null;
    }
  }

  cyclization() {
    if (this._head && this._tail && this._tail.next === null) {
      this._tail.next = this._head;
      this._head.prev = this._tail;
    }
  }

  constructor(...values: T[]) {
    super(...values);
    this.cyclization();
  }

  clone(): CircleDoublyList<T> {
    const arrValue = this.toArray();
    return new CircleDoublyList<T>(...arrValue);
  }
}
