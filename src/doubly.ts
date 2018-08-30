import { DoublyNode } from './node';
import { invariant } from './util';

export class DoublyList<T> {
  private _head: DoublyNode<T> | null;
  private _tail: DoublyNode<T> | null;
  private _length: number;

  constructor(...values: T[]) {
    this._head = null;
    this._tail = null;
    this._length = 0;

    if (values.length > 0) {
      values.forEach(value => {
        this.append(value);
      });
    }
  }

  get head(): T | null {
    return this._head ? this._head.value : null;
  }
  get tail(): T | null {
    return this._tail ? this._tail.value : null;
  }

  get length(): number {
    return this._length;
  }

  *iterator(): IterableIterator<T> {
    let currentNode = this._head;

    while (currentNode) {
      yield currentNode.value;
      currentNode = currentNode.next;
    }
  }

  [Symbol.iterator]() {
    return this.iterator();
  }

  getNode(position: number): DoublyNode<T> | null {
    let length = this._length;

    // 1st use-case: invalid position
    invariant(
      length > 0 && position >= 0 && position < length,
      `[singly-list] index ${position} out of scope of list, which length is ${length}`
    );

    let currentNode = this._head as DoublyNode<T>;
    let count = 0;
    // 2nd use-case: a valid position
    while (count < position) {
      currentNode = <DoublyNode<T>>currentNode.next;
      count++;
    }

    return currentNode;
  }

  get(position: number): T | null {
    const node = this.getNode(position);
    return node ? node.value : null;
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
    if (currentNode.value === val) {
      // 这里需要注意，有两种情况：
      if (currentNode.next){ // 链表多于 1 个元素
        this._head = currentNode.next as DoublyNode<T>;
        this._head.prev = null;
        currentNode.next = currentNode.prev = null;
      } else { // 链表只有 1 个元素
        this._head = this._tail = null;
      }
      this._length--;
      return val;
    } else {
      while (true) {
        if (currentNode.value === val) {
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

  first(num: number): T[] {
    invariant(
      num >= 0,
      `[linked-list] param 'num' (${num}) should not less than 0`
    );
    let iter = this.iterator();
    let result: T[] = [];

    let n = Math.min(num, this.length);

    for (let i = 0; i < n; i++) {
      let val = iter.next();
      result.push(val.value);
    }
    return result;
  }

  toArray(): T[] {
    return [...this];
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
