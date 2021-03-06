import { ListNode } from './node';
import { invariant, INDEX_NOT_FOUND } from './util';
import Comparator from 'ss-comparator';

export interface IFindConition<T> { value?: T, callback?: (value: T) => boolean }
export default abstract class List<T, U extends ListNode<T>> {
  protected _head: U | null;
  protected _tail: U | null;
  protected _length: number;
  public compare: Comparator; 

  constructor(...values: T[]) {
    this._head = null;
    this._tail = null;
    this._length = 0;
    this.compare = new Comparator();

    if (values.length > 0) {
      values.forEach(value => {
        this.append(value);
      });
    }
  }

  get head(): T | void {
    return this._head ? this._head.value : void 0;
  }
  get tail(): T | void {
    return this._tail ? this._tail.value : void 0;
  }

  get length(): number {
    return this._length;
  }

  get loopLength(): number {
    let isLoop: boolean = false;
    let loopLength = 1;

    if (!this._head) {
      return 0;
    }

    let p1 = this._head as U;
    let p2 = this._head as U;

    while (p2.next && p2.next.next) {
      p2 = p2.next.next as U;
      p1 = p1.next as U;

      if (p1 === p2) {
        isLoop = true;
        break;
      }
    }

    if (isLoop) {
      p2 = p2.next as U;
      while (p1 !== p2) {
        loopLength++;
        p2 = p2.next as U;
      }
      return loopLength;
    } else {
      return 0;
    }
  }

  getNode(position: number): U | null {
    let length = this._length;

    // 1st use-case: invalid position
    invariant(
      length > 0 && position >= 0 && position < length,
      `[linked-list] index ${position} out of scope of list, which length is ${length}`
    );

    let currentNode = this._head as U;
    let count = 0;
    // 2nd use-case: a valid position
    while (count < position) {
      currentNode = <U>currentNode.next;
      count++;
    }

    return currentNode;
  }

  get(position: number): T | null {
    const node = this.getNode(position);
    return node ? node.value : null;
  }

  /**
   * 根据指定条件返回待查找的链表节点
   * 
   * @param {IFindConition<T>} { value, callback }
   * @returns
   * @memberof List
   */
  find({ value, callback }: IFindConition<T>) {
    if (!this._head) {
      return null;
    }
    let currentNode = <U>this._head;

    while (currentNode) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }

      // If value is specified then try to compare by value..
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }

      currentNode = <U>currentNode.next;
    }

    return null;
  }

  indexOf(val: T): Number {
    if (!this._head) {
      return INDEX_NOT_FOUND;
    }
    let currentNode = <U>this._head;

    let count = -1;
    // 多余 1 个节点的情况
    while (currentNode.next) {
      count++;
      if (this.compare.equal(currentNode.value, val)) {
        return count;
      }
      currentNode = <U>currentNode.next;
    }

    // 如果是末尾节点，需要额外处理
    if (currentNode === this._tail && this.compare.equal(currentNode.value, val)) {
      count += 1;
    }

    return count;
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

  isEmpty(): boolean {
    return this._head === null;
  }
  *iterator(): IterableIterator<T> {
    let currentNode = this._head;

    while (currentNode) {
      yield currentNode.value;
      currentNode = <U>currentNode.next;
    }
  }

  [Symbol.iterator]() {
    return this.iterator();
  }

  abstract clone(): List<T, U>;

  // Adds the element at the end of the linked list
  abstract append(val: T): boolean;
  // Add the element at the beginning of the linked list
  abstract prepend(val: T): boolean;

  // remove by value
  abstract remove(val: T): T | void;

  abstract removeHead(): T | void;

  abstract removeTail(): T | void;
  abstract reverse(): void;
}
