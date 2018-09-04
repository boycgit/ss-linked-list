import { SinglyNode } from './node';
import { invariant, INDEX_NOT_FOUND } from './util';

export class SinglyList<T> {
  protected _head: SinglyNode<T> | null;
  protected _tail: SinglyNode<T> | null;
  protected _length: number;

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

  indexOf(val: T): Number {
    let currentNode = this._head;
    if (!currentNode) {
      return INDEX_NOT_FOUND;
    }
    let count = -1;
    // 多余 1 个节点的情况
    while (currentNode.next) {
      count++;
      if (currentNode.value === val) {
        return count;
      }
      currentNode = currentNode.next;
    }

    // 如果是末尾节点，需要额外处理
    if (currentNode === this._tail && currentNode.value === val) {
      count += 1;
    }

    return count;
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

  isEmpty(): boolean {
    return this._head === null;
  }

  get loopLength(): number {
    let isLoop: boolean = false;
    let loopLength = 1;

    if (!this._head) {
      return 0;
    }

    let p1 = this._head as SinglyNode<T>;
    let p2 = this._head as SinglyNode<T>;

    while (p2.next && p2.next.next) {
      p2 = p2.next.next as SinglyNode<T>;
      p1 = p1.next as SinglyNode<T>;

      if (p1 === p2) {
        isLoop = true;
        break;
      }
    }

    if (isLoop) {
      p2 = p2.next as SinglyNode<T>;
      while (p1 !== p2) {
        loopLength++;
        p2 = p2.next as SinglyNode<T>;
      }
      return loopLength;
    } else {
      return 0;
    }
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
