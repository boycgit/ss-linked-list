import { SinglyNode } from './node';
import { invariant } from './util';

export class SinglyList<T> {
  private _head: SinglyNode<T> | null;
  private _tail: SinglyNode<T> | null;
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

  getNode(position: number): SinglyNode<T> | null {
    let length = this._length;

    // 1st use-case: invalid position
    invariant(
      length > 0 && position >= 0 && position < length,
      `[singly-list] index ${position} out of scope of list, which length is ${length}`
    );

    let currentNode = this._head as SinglyNode<T>;
    let count = 0;
    // 2nd use-case: a valid position
    while (count < position) {
      currentNode = <SinglyNode<T>>currentNode.next;
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
      this._head = currentNode.next;
      currentNode.next = null;
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

  first(num: number): T[] {
    invariant(num > 0, `[linked-list] param 'num' (${num}) should greater than 0`)
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
