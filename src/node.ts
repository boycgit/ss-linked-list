export class SinglyNode<T> {
  value: T;
  next: SinglyNode<T> | null;

  constructor(val: T) {
    this.value = val;
    this.next = null;
  }
}

export class DoublyNode<T> {
  value: T;
  next: DoublyNode<T> | null;
  prev: DoublyNode<T> | null;

  constructor(val: T) {
    this.value = val;
    this.next = null;
    this.prev = null;
  }
}
