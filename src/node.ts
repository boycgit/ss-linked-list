export interface ListNodeConstructor<T> {
  new (val: T): ListNode<T>; // 构造函数约束
}
export interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
  prev?: ListNode<T> | null;
}

export class SinglyNode<T> implements ListNode<T> {
  value: T;
  next: SinglyNode<T> | null;

  constructor(val: T) {
    this.value = val;
    this.next = null;
  }
}

export class DoublyNode<T> implements ListNode<T> {
  value: T;
  next: DoublyNode<T> | null;
  prev: DoublyNode<T> | null;

  constructor(val: T) {
    this.value = val;
    this.next = null;
    this.prev = null;
  }
}
