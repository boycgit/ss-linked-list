export class SinglyNode<T> {
  value: T;
  next: SinglyNode<T> | null;

  constructor(val: T) {
    this.value = val;
    this.next = null;
  }
}